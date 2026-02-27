const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const { createClient } = require('@libsql/client');
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// ==================== FUNCIONES HELPER ====================
/**
 * Parse JSON de forma segura
 * @param {string} jsonString - String a parsear
 * @param {any} defaultValue - Valor por defecto si falla el parse
 * @returns {any} Objeto parseado o defaultValue
 */
function safeJSONParse(jsonString, defaultValue = []) {
    try {
        return JSON.parse(jsonString || JSON.stringify(defaultValue));
    } catch (error) {
        console.warn('⚠️  JSON inválido:', jsonString, 'usando default:', defaultValue);
        return defaultValue;
    }
}

// Configurar Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

console.log('☁️  Cloudinary configurado para:', process.env.CLOUDINARY_CLOUD_NAME);

// Configurar multer para procesar archivo en memoria
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        console.log('🔍 Validando archivo:', file.originalname, '- MIME:', file.mimetype);
        const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'];
        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error(`Tipo de archivo no permitido: ${file.mimetype}`));
        }
    }
});

// Configurar CORS detallado
const corsOptions = {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: false,
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Logging middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path} - Origin: ${req.headers.origin || 'local'}`);
    next();
});

app.use(express.static(path.join(__dirname)));

// Ruta para servir admin.html
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});

app.get('/admin/', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});

// Conexión a Turso
let db;

async function initializeDatabase() {
    try {
        db = createClient({
            url: process.env.TURSO_DATABASE_URL,
            authToken: process.env.TURSO_AUTH_TOKEN,
        });

        // Crear tabla si no existe
        await db.execute(`
            CREATE TABLE IF NOT EXISTS propiedades (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                titulo TEXT NOT NULL,
                categoria TEXT NOT NULL,
                precio TEXT NOT NULL,
                rating TEXT DEFAULT '5.0',
                img TEXT NOT NULL,
                galeria TEXT DEFAULT '[]',
                ubicacion TEXT NOT NULL,
                mapa_embed TEXT DEFAULT '',
                descripcion TEXT NOT NULL,
                huespedes INTEGER NOT NULL,
                dormitorios INTEGER NOT NULL,
                banios INTEGER NOT NULL,
                amenidades TEXT DEFAULT '[]',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Verificar si necesitamos migrar de coordenadas a mapa_embed
        try {
            const result = await db.execute(`PRAGMA table_info(propiedades)`);
            const columnas = result.rows.map(row => row.name);

            if (columnas.includes('coordenadas') && !columnas.includes('mapa_embed')) {
                console.log('🔄 Migrando: renombrando coordenadas → mapa_embed');
                await db.execute(`
                    ALTER TABLE propiedades RENAME COLUMN coordenadas TO mapa_embed
                `);
                console.log('✅ Migración completada');
            }

            // Migración: eliminar columna detalles si existe
            if (columnas.includes('detalles')) {
                console.log('🔄 Migrando: eliminando columna detalles');
                // SQLite no soporta DROP COLUMN directamente, necesitamos recrear la tabla
                await db.execute(`
                    CREATE TABLE propiedades_new (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        titulo TEXT NOT NULL,
                        categoria TEXT NOT NULL,
                        precio TEXT NOT NULL,
                        rating TEXT DEFAULT '5.0',
                        img TEXT NOT NULL,
                        galeria TEXT DEFAULT '[]',
                        ubicacion TEXT NOT NULL,
                        mapa_embed TEXT DEFAULT '',
                        descripcion TEXT NOT NULL,
                        huespedes INTEGER NOT NULL,
                        dormitorios INTEGER NOT NULL,
                        banios INTEGER NOT NULL,
                        amenidades TEXT DEFAULT '[]',
                        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
                    )
                `);

                await db.execute(`
                    INSERT INTO propiedades_new
                    SELECT id, titulo, categoria, precio, rating, img, galeria, ubicacion, mapa_embed, descripcion, huespedes, dormitorios, banios, amenidades, created_at, updated_at
                    FROM propiedades
                `);

                await db.execute(`DROP TABLE propiedades`);
                await db.execute(`ALTER TABLE propiedades_new RENAME TO propiedades`);
                console.log('✅ Columna detalles eliminada');
            }
        } catch (migrationError) {
            console.log('ℹ️  No se necesita migración (tabla nueva)');
        }

        console.log('✓ Base de datos conectada y tabla lista');
    } catch (error) {
        console.error('Error conectando a Turso:', error);
        process.exit(1);
    }
}

// Endpoints

// Obtener todas las propiedades
app.get('/api/propiedades', async (req, res) => {
    try {
        const result = await db.execute('SELECT * FROM propiedades ORDER BY id DESC');
        const propiedades = result.rows.map(row => ({
            id: row.id,
            titulo: row.titulo,
            categoria: row.categoria,
            precio: row.precio,
            rating: row.rating,
            img: row.img,
            galeria: safeJSONParse(row.galeria, []),
            ubicacion: row.ubicacion,
            mapa_embed: row.mapa_embed || '',
            descripcion: row.descripcion,
            huespedes: row.huespedes,
            dormitorios: row.dormitorios,
            banios: row.banios,
            amenidades: safeJSONParse(row.amenidades, []),
        }));
        res.json(propiedades);
    } catch (error) {
        console.error('Error obteniendo propiedades:', error);
        res.status(500).json({ error: 'Error obteniendo propiedades' });
    }
});

// Obtener una propiedad por ID
app.get('/api/propiedades/:id', async (req, res) => {
    try {
        const result = await db.execute('SELECT * FROM propiedades WHERE id = ?', [req.params.id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Propiedad no encontrada' });
        }
        const row = result.rows[0];
        const propiedad = {
            id: row.id,
            titulo: row.titulo,
            categoria: row.categoria,
            precio: row.precio,
            rating: row.rating,
            img: row.img,
            galeria: safeJSONParse(row.galeria, []),
            ubicacion: row.ubicacion,
            mapa_embed: row.mapa_embed || '',
            descripcion: row.descripcion,
            huespedes: row.huespedes,
            dormitorios: row.dormitorios,
            banios: row.banios,
            amenidades: safeJSONParse(row.amenidades, []),
        };
        res.json(propiedad);
    } catch (error) {
        console.error('Error obteniendo propiedad:', error);
        res.status(500).json({ error: 'Error obteniendo propiedad' });
    }
});

// Crear nueva propiedad
app.post('/api/propiedades', async (req, res) => {
    try {
        const {
            titulo, categoria, precio, rating, img, galeria,
            ubicacion, mapa_embed, descripcion, huespedes,
            dormitorios, banios, amenidades
        } = req.body;

        console.log('📝 Datos recibidos:', {
            titulo: !!titulo,
            categoria: !!categoria,
            precio: !!precio,
            ubicacion: !!ubicacion,
            img: !!img,
            descripcion: !!descripcion,
            huespedes,
            dormitorios,
            banios,
            amenidades: !!amenidades
        });

        // ==================== VALIDACIONES ====================
        // Validación de campos requeridos
        if (!titulo || !categoria || !precio || !ubicacion || !img || !descripcion) {
            console.error('❌ Validación fallida: faltan campos requeridos');
            return res.status(400).json({
                error: 'Faltan campos requeridos',
                recibidos: { titulo: !!titulo, categoria: !!categoria, precio: !!precio, ubicacion: !!ubicacion, img: !!img, descripcion: !!descripcion }
            });
        }

        // Validación de longitudes de strings
        if (typeof titulo !== 'string' || titulo.trim().length === 0 || titulo.length > 200) {
            return res.status(400).json({ error: 'Título debe tener 1-200 caracteres' });
        }

        if (!['Playa', 'Bosque', 'Ciudad'].includes(categoria)) {
            return res.status(400).json({ error: 'Categoría inválida. Debe ser: Playa, Bosque o Ciudad' });
        }

        if (typeof descripcion !== 'string' || descripcion.trim().length === 0 || descripcion.length > 5000) {
            return res.status(400).json({ error: 'Descripción debe tener 1-5000 caracteres' });
        }

        if (typeof precio !== 'string' || precio.trim().length === 0) {
            return res.status(400).json({ error: 'Precio no puede estar vacío' });
        }

        if (typeof ubicacion !== 'string' || ubicacion.trim().length === 0) {
            return res.status(400).json({ error: 'Ubicación no puede estar vacía' });
        }

        // Validación de números
        const ratingNum = parseFloat(rating) || 5.0;
        if (isNaN(ratingNum) || ratingNum < 0 || ratingNum > 5) {
            return res.status(400).json({ error: 'Rating debe estar entre 0 y 5' });
        }

        const huespedesNum = parseInt(huespedes, 10);
        if (!Number.isInteger(huespedesNum) || huespedesNum < 1 || huespedesNum > 10000) {
            return res.status(400).json({ error: 'Huéspedes debe ser un número entre 1 y 10000' });
        }

        const dormitoriosNum = parseInt(dormitorios, 10);
        if (!Number.isInteger(dormitoriosNum) || dormitoriosNum < 0 || dormitoriosNum > 500) {
            return res.status(400).json({ error: 'Dormitorios debe ser un número entre 0 y 500' });
        }

        const baniosNum = parseInt(banios, 10);
        if (!Number.isInteger(baniosNum) || baniosNum < 0 || baniosNum > 500) {
            return res.status(400).json({ error: 'Baños debe ser un número entre 0 y 500' });
        }

        // Validación de arrays
        if (galeria && !Array.isArray(galeria)) {
            return res.status(400).json({ error: 'Galería debe ser un array' });
        }

        if (galeria && galeria.length > 100) {
            return res.status(400).json({ error: 'Máximo 100 imágenes en galería' });
        }

        // Validar URLs de galería
        const galeriaValidada = (galeria || []).filter(url => {
            try {
                if (typeof url !== 'string') return false;
                new URL(url); // Valida que sea URL válida
                return url.startsWith('https://') || url.startsWith('data:image');
            } catch {
                return false;
            }
        });

        if (amenidades) {
            const amenidadesArray = Array.isArray(amenidades) ? amenidades : [];
            if (amenidadesArray.length > 50) {
                return res.status(400).json({ error: 'Máximo 50 amenidades' });
            }
        }

        if (!mapa_embed) {
            console.warn('⚠️  Advertencia: mapa_embed vacío para propiedad:', titulo);
        }

        console.log('📝 Creando propiedad:', titulo);

        await db.execute(
            `INSERT INTO propiedades (
                titulo, categoria, precio, rating, img, galeria,
                ubicacion, mapa_embed, descripcion, huespedes,
                dormitorios, banios, amenidades
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                titulo, categoria, precio, ratingNum, img,
                JSON.stringify(galeriaValidada),
                ubicacion, mapa_embed || '',
                descripcion, huespedesNum, dormitoriosNum, baniosNum,
                JSON.stringify(amenidades || [])
            ]
        );

        res.status(201).json({ message: 'Propiedad creada exitosamente' });
    } catch (error) {
        console.error('❌ Error creando propiedad:', error.message);
        res.status(500).json({ error: error.message || 'Error creando propiedad' });
    }
});

// Actualizar propiedad
app.put('/api/propiedades/:id', async (req, res) => {
    try {
        const {
            titulo, categoria, precio, rating, img, galeria,
            ubicacion, mapa_embed, descripcion, huespedes,
            dormitorios, banios, amenidades
        } = req.body;

        console.log('✏️  Actualizando propiedad ID:', req.params.id);

        // ==================== VALIDACIONES ====================
        if (!titulo || !categoria || !precio || !ubicacion || !img || !descripcion) {
            return res.status(400).json({ error: 'Faltan campos requeridos' });
        }

        // Validación de longitudes de strings
        if (typeof titulo !== 'string' || titulo.trim().length === 0 || titulo.length > 200) {
            return res.status(400).json({ error: 'Título debe tener 1-200 caracteres' });
        }

        if (!['Playa', 'Bosque', 'Ciudad'].includes(categoria)) {
            return res.status(400).json({ error: 'Categoría inválida. Debe ser: Playa, Bosque o Ciudad' });
        }

        if (typeof descripcion !== 'string' || descripcion.trim().length === 0 || descripcion.length > 5000) {
            return res.status(400).json({ error: 'Descripción debe tener 1-5000 caracteres' });
        }

        // Validación de números
        const ratingNum = parseFloat(rating) || 5.0;
        if (isNaN(ratingNum) || ratingNum < 0 || ratingNum > 5) {
            return res.status(400).json({ error: 'Rating debe estar entre 0 y 5' });
        }

        const huespedesNum = parseInt(huespedes, 10);
        if (!Number.isInteger(huespedesNum) || huespedesNum < 1 || huespedesNum > 10000) {
            return res.status(400).json({ error: 'Huéspedes debe ser un número entre 1 y 10000' });
        }

        const dormitoriosNum = parseInt(dormitorios, 10);
        if (!Number.isInteger(dormitoriosNum) || dormitoriosNum < 0 || dormitoriosNum > 500) {
            return res.status(400).json({ error: 'Dormitorios debe ser un número entre 0 y 500' });
        }

        const baniosNum = parseInt(banios, 10);
        if (!Number.isInteger(baniosNum) || baniosNum < 0 || baniosNum > 500) {
            return res.status(400).json({ error: 'Baños debe ser un número entre 0 y 500' });
        }

        // Validación de arrays
        if (galeria && !Array.isArray(galeria)) {
            return res.status(400).json({ error: 'Galería debe ser un array' });
        }

        if (galeria && galeria.length > 100) {
            return res.status(400).json({ error: 'Máximo 100 imágenes en galería' });
        }

        // Validar URLs de galería
        const galeriaValidada = (galeria || []).filter(url => {
            try {
                if (typeof url !== 'string') return false;
                new URL(url);
                return url.startsWith('https://') || url.startsWith('data:image');
            } catch {
                return false;
            }
        });

        if (amenidades && Array.isArray(amenidades) && amenidades.length > 50) {
            return res.status(400).json({ error: 'Máximo 50 amenidades' });
        }

        const id = parseInt(req.params.id, 10);
        if (!Number.isInteger(id) || id < 1) {
            return res.status(400).json({ error: 'ID de propiedad inválido' });
        }

        await db.execute(
            `UPDATE propiedades SET
                titulo = ?, categoria = ?, precio = ?, rating = ?, img = ?,
                galeria = ?, ubicacion = ?, mapa_embed = ?, descripcion = ?,
                huespedes = ?, dormitorios = ?, banios = ?, amenidades = ?,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ?`,
            [
                titulo, categoria, precio, ratingNum, img,
                JSON.stringify(galeriaValidada),
                ubicacion, mapa_embed || '',
                descripcion, huespedesNum, dormitoriosNum, baniosNum,
                JSON.stringify(amenidades || []),
                id
            ]
        );

        res.json({ message: 'Propiedad actualizada exitosamente' });
    } catch (error) {
        console.error('❌ Error actualizando propiedad:', error.message);
        res.status(500).json({ error: error.message || 'Error actualizando propiedad' });
    }
});

// Eliminar propiedad
app.delete('/api/propiedades/:id', async (req, res) => {
    try {
        await db.execute('DELETE FROM propiedades WHERE id = ?', [req.params.id]);
        res.json({ message: 'Propiedad eliminada exitosamente' });
    } catch (error) {
        console.error('Error eliminando propiedad:', error);
        res.status(500).json({ error: 'Error eliminando propiedad' });
    }
});

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'OK' });
});

// Endpoint para subir imágenes
app.post('/api/upload', (req, res) => {
    try {
        console.log('📤 Recibida solicitud `/api/upload`');
        console.log('Content-Type:', req.headers['content-type']);
        
        upload.single('file')(req, res, (err) => {
            try {
                if (err) {
                    console.error('❌ Error multer al subir:', err.message);
                    return res.status(400).json({ error: `Error al subir: ${err.message}` });
                }
                
                if (!req.file) {
                    console.warn('⚠️  No se recibió archivo');
                    return res.status(400).json({ error: 'No se subió ningún archivo' });
                }

                // Subir a Cloudinary desde el buffer en memoria
                const uploadStream = cloudinary.uploader.upload_stream(
                    {
                        resource_type: 'auto',
                        folder: 'casas-ernestina',
                        quality: 'auto',
                        fetch_format: 'auto',
                    },
                    (error, result) => {
                        if (error) {
                            console.error('❌ Error en Cloudinary:', error.message);
                            return res.status(400).json({ error: `Error al subir a Cloudinary: ${error.message}` });
                        }

                        console.log('✅ Archivo subido a Cloudinary:', result.public_id);
                        console.log('📂 URL:', result.secure_url);
                        res.json({ 
                            url: result.secure_url, 
                            publicId: result.public_id,
                            filename: result.public_id
                        });
                    }
                );

                uploadStream.end(req.file.buffer);
            } catch (innerErr) {
                console.error('❌ Error interno en upload:', innerErr.message);
                res.status(500).json({ error: `Error interno: ${innerErr.message}` });
            }
        });
    } catch (outerErr) {
        console.error('❌ Error crítico en /api/upload:', outerErr.message);
        res.status(500).json({ error: `Error crítico: ${outerErr.message}` });
    }
});

// Endpoint para subir múltiples imágenes (para galería)
app.post('/api/upload-multiple', (req, res) => {
    try {
        console.log('📤 Recibida solicitud `/api/upload-multiple`');
        
        upload.array('files', 10)(req, res, async (err) => {
            try {
                if (err) {
                    console.error('❌ Error multer al subir múltiples:', err.message);
                    return res.status(400).json({ error: `Error al subir: ${err.message}` });
                }
                
                if (!req.files || req.files.length === 0) {
                    console.warn('⚠️  No se recibieron archivos');
                    return res.status(400).json({ error: 'No se subieron archivos' });
                }

                console.log(`📤 Subiendo ${req.files.length} archivos a Cloudinary...`);

                // Subir todos los archivos a Cloudinary en paralelo
                const uploadPromises = req.files.map((file) => {
                    return new Promise((resolve, reject) => {
                        const uploadStream = cloudinary.uploader.upload_stream(
                            {
                                resource_type: 'auto',
                                folder: 'casas-ernestina/gallery',
                                quality: 'auto',
                                fetch_format: 'auto',
                            },
                            (error, result) => {
                                if (error) {
                                    console.error('❌ Error en Cloudinary:', error.message);
                                    reject(error);
                                } else {
                                    console.log('✅ Archivo subido a Cloudinary:', result.public_id);
                                    resolve({
                                        url: result.secure_url,
                                        publicId: result.public_id
                                    });
                                }
                            }
                        );
                        uploadStream.end(file.buffer);
                    });
                });

                const uploadedFiles = await Promise.all(uploadPromises);
                const urls = uploadedFiles.map(file => file.url);

                console.log(`✅ ${req.files.length} archivos subidos correctamente`);
                res.json({ urls: urls });
            } catch (innerErr) {
                console.error('❌ Error interno en upload-multiple:', innerErr.message);
                res.status(500).json({ error: `Error interno: ${innerErr.message}` });
            }
        });
    } catch (outerErr) {
        console.error('❌ Error crítico en /api/upload-multiple:', outerErr.message);
        res.status(500).json({ error: `Error crítico: ${outerErr.message}` });
    }
});

// Manejador de errores general
app.use((err, req, res, next) => {
    console.error('❌ ERROR NO MANEJADO:', err.message);
    console.error('Stack:', err.stack);
    res.status(500).json({ 
        error: err.message || 'Error interno del servidor',
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});

// Iniciar servidor
initializeDatabase().then(() => {
    app.listen(PORT, () => {
        console.log(`\n🚀 Servidor corriendo en http://localhost:${PORT}`);
        console.log(`📱 Accede al panel de admin en http://localhost:5000/admin.html\n`);
    });
});
