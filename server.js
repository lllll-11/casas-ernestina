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
            galeria: JSON.parse(row.galeria || '[]'),
            ubicacion: row.ubicacion,
            mapa_embed: row.mapa_embed || '',
            descripcion: row.descripcion,
            huespedes: row.huespedes,
            dormitorios: row.dormitorios,
            banios: row.banios,
            amenidades: JSON.parse(row.amenidades || '[]')
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
            galeria: JSON.parse(row.galeria || '[]'),
            ubicacion: row.ubicacion,
            mapa_embed: row.mapa_embed || '',
            descripcion: row.descripcion,
            huespedes: row.huespedes,
            dormitorios: row.dormitorios,
            banios: row.banios,
            amenidades: JSON.parse(row.amenidades || '[]')
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

        // Validaciones
        if (!titulo || !categoria || !precio || !ubicacion || !img || !descripcion) {
            return res.status(400).json({ error: 'Faltan campos requeridos' });
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
                titulo, categoria, precio, rating || '5.0', img,
                JSON.stringify(galeria || []),
                ubicacion, mapa_embed || '',
                descripcion, huespedes, dormitorios, banios,
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

        // Validaciones
        if (!titulo || !categoria || !precio || !ubicacion || !img || !descripcion) {
            return res.status(400).json({ error: 'Faltan campos requeridos' });
        }

        await db.execute(
            `UPDATE propiedades SET
                titulo = ?, categoria = ?, precio = ?, rating = ?, img = ?,
                galeria = ?, ubicacion = ?, mapa_embed = ?, descripcion = ?,
                huespedes = ?, dormitorios = ?, banios = ?, amenidades = ?,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ?`,
            [
                titulo, categoria, precio, rating || '5.0', img,
                JSON.stringify(galeria || []),
                ubicacion, mapa_embed || '',
                descripcion, huespedes, dormitorios, banios,
                JSON.stringify(amenidades || []), req.params.id
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
