# 🐛 Fallas Encontradas en el Código

**Fecha:** Febrero 27, 2026
**Críticas:** 6 | **Altas:** 5 | **Medias:** 4

---

## 🔴 CRÍTICAS (Requieren arreglo inmediato)

### 1. **parseInt sin radix especificado**
**Ubicación:** 
- `public/admin/admin.html` líneas 1129-1131
- `admin.html` líneas 1079-1081
- `src/AdminPanel.js` línea 50, 78-80

**Problema:**
```javascript
// ❌ MALO
parseInt(document.getElementById('huespedes').value)

// ✅ BIEN
parseInt(document.getElementById('huespedes').value, 10)
```

**Riesgo:** Sin radix, "08" se interpreta como octal = 0. Puede dar resultados inesperados.

---

### 2. **Credenciales de Supabase expuestas en el cliente**
**Ubicación:** 
- `src/supabaseClient.js`
- `public/admin/admin.html` línea 776-777

**Problema:** Las claves `SUPABASE_URL` y `SUPABASE_ANON_KEY` están hardcodeadas en código fuente.

**Riesgo:** 
- Alguien puede hacer scraping y usar tus credenciales
- Necesitas cambiar las claves si esto es comprometido

**Solución:**
```javascript
// Usa variables de entorno en React
const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY;
```

---

### 3. **CORS demasiado permisivo**
**Ubicación:** `server.js` línea 38

**Problema:**
```javascript
// ❌ MALO - Permite cualquier origen
const corsOptions = {
    origin: '*',
    credentials: false,
};
```

**Riesgo:** Cualquier sitio web puede hacer requests a tu API.

**Solución:**
```javascript
// ✅ MEJOR
const corsOptions = {
    origin: process.env.ALLOWED_ORIGINS?.split(',') || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
};
```

---

### 4. **JSON.parse sin manejo de errores**
**Ubicación:**
- `server.js` líneas 210, 179 (JSON.parse de galeria y amenidades)
- `App.js` línea 77 (procesa amenidades)

**Problema:**
```javascript
// ❌ Si la data está corrupta, falla la app
amenidades: JSON.parse(row.amenidades || '[]')
```

**Solución:**
```javascript
// ✅ BIEN
amenidades: (() => {
    try {
        return JSON.parse(row.amenidades || '[]');
    } catch (e) {
        console.warn('JSON inválido en amenidades:', row.amenidades);
        return [];
    }
})()
```

---

### 5. **Validación insuficiente de tipos en servidor**
**Ubicación:** `server.js` línea 237 (POST /api/propiedades)

**Problema:**
```javascript
// No valida tipos de datos
const { precio, rating, huespedes, dormitorios, banios } = req.body;

// ¿Qué pasa si el cliente envía?
// { precio: null, rating: "texto", huespedes: -5 }
```

**Solución:**
```javascript
// Añade validaciones de rango
if (typeof precio !== 'string' || precio.trim() === '') {
    return res.status(400).json({ error: 'Precio inválido' });
}

if (isNaN(rating) || rating < 0 || rating > 5) {
    return res.status(400).json({ error: 'Rating debe estar entre 0 y 5' });
}

if (!Number.isInteger(huespedes) || huespedes < 1 || huespedes > 1000) {
    return res.status(400).json({ error: 'Huéspedes debe ser 1-1000' });
}
```

---

### 6. **No hay índices en base de datos**
**Ubicación:** `server.js` línea 79 (CREATE TABLE)

**Problema:**
```sql
-- ❌ Las queries pueden ser lentas sin índices
CREATE TABLE IF NOT EXISTS propiedades (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo TEXT NOT NULL,
    categoria TEXT NOT NULL,
    ...
)
```

**Solución:** Añade índices después de crear la tabla:
```sql
CREATE INDEX idx_categoria ON propiedades(categoria);
CREATE INDEX idx_created_at ON propiedades(created_at);
CREATE INDEX idx_titulo ON propiedades(titulo);
```

---

## 🟠 ALTAS

### 7. **Memory leak en App.js - Event listener no removido**
**Ubicación:** `src/App.js` línea 30 (useEffect del lightbox)

**Problema:**
```javascript
React.useEffect(() => {
    const manejarTeclas = (e) => {
        if (e.key === 'ArrowRight') siguiente();
        if (e.key === 'ArrowLeft') anterior();
        if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', manejarTeclas);
    return () => window.removeEventListener('keydown', manejarTeclas);
    // ✅ Aquí está bien removido
}, [siguiente, anterior, onClose]);
```

**PERO:** Si el component falla o se desactiva el cleanup, puede quedar el listener.

---

### 8. **No hay rate limiting**
**Ubicación:** `server.js` - endpoints GET, POST, PUT, DELETE

**Problema:** Alguien puede hacer spam de requests:
```javascript
// Puedo enviar 1000 requests / segundo
for (let i = 0; i < 10000; i++) {
    fetch('/api/propiedades');
}
```

**Solución:**
```bash
npm install express-rate-limit
```

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100 // máximo 100 requests
});

app.use('/api/', limiter);
```

---

### 9. **Alert() usado para mensajes - No es UX amigable**
**Ubicación:** 
- `src/AdminPanel.js` líneas 93-100
- `public/admin/admin.html` líneas 1162-1167

**Problema:**
```javascript
// ❌ Alert bloquea la interfaz
alert('Propiedad actualizada');
```

**Ya está parcialmente solucionado** en `public/admin/admin.html` con `mostrarAlerta()`, pero en `AdminPanel.js` sigue usando `alert()`.

---

### 10. **No hay validación de URLs en galería**
**Ubicación:** `public/admin/admin.html` línea 1073 y `admin.html` línea 1036

**Problema:**
```javascript
galeriaUrls = estadoFormulario.galeria
    .map(item => typeof item === 'string' ? item : item.url)
    .filter(url => url && (url.startsWith('http') || url.startsWith('https')))
// ¿Qué si alguien pasa javascript:alert(1)?
// ¿Qué si la URL no es una imagen?
```

**Solución:**
```javascript
galeriaUrls = estadoFormulario.galeria
    .map(item => typeof item === 'string' ? item : item.url)
    .filter(url => {
        try {
            const urlObj = new URL(url);
            return url.startsWith('https://') && 
                   /\.(jpg|jpeg|png|webp|avif|gif)$/i.test(url);
        } catch {
            return false;
        }
    });
```

---

### 11. **Falta validación de tamaño máximo para strings**
**Ubicación:** `server.js` línea 261

**Problema:**
```javascript
// ¿Qué si alguien envía un título de 1MB?
titulo: formData.titulo, // Sin validación de longitud

// ¿Qué si envía amenidades con 10,000 items?
amenidades: amenidadesArray // Sin validación de cantidad
```

**Solución:**
```javascript
// Validar longitudes
if (titulo.length > 200) {
    return res.status(400).json({ error: 'Título muy largo (máx 200 caracteres)' });
}

if (descripcion.length > 5000) {
    return res.status(400).json({ error: 'Descripción muy larga (máx 5000 caracteres)' });
}

if (amenidades.length > 50) {
    return res.status(400).json({ error: 'Máximo 50 amenidades' });
}
```

---

## 🟡 MEDIAS

### 12. **No hay validación en el cliente antes de enviar**
**Ubicación:** `AdminPanel.js` línea 61

**Problema:**
```javascript
const dataToSave = {
    // ¿Qué si algún valor es undefined?
    titulo: formData.titulo,
    categoria: formData.categoria,
    precio: parseFloat(formData.rating), // Podrían confunda campos
}
```

**Solución:**
```javascript
// Validar antes de guardar
const validar = () => {
    if (!dataToSave.titulo?.trim()) throw new Error('Título requerido');
    if (!dataToSave.categoria) throw new Error('Categoría requerida');
    if (dataToSave.huespedes < 1) throw new Error('Huéspedes mínimo 1');
    if (dataToSave.dormitorios < 1) throw new Error('Dormitorios mínimo 1');
    if (dataToSave.banios < 1) throw new Error('Baños mínimo 1');
    return true;
};
```

---

### 13. **Race condition en edición simultánea**
**Ubicación:** `AdminPanel.js` línea 84 y `public/admin/admin.html` línea 1125

**Problema:**
```javascript
// Si dos usuarios editan el mismo item simultáneamente:
// Usuario A actualiza y obtiene versión X
// Usuario B actualiza y obtiene versión X
// Usuario A guarda versión X + cambios A
// Usuario B guarda versión X + cambios B (borra cambios de A)

if (editingId) {
    const { error } = await supabase
        .from('propiedades')
        .update(dataToSave)
        .eq('id', editingId); // Sin verificar versión
}
```

**Solución:** Usar un campo `version` o `updated_at`:
```javascript
const { error } = await supabase
    .from('propiedades')
    .update(dataToSave)
    .eq('id', editingId)
    .eq('updated_at', originalUpdatedAt); // Verifica que no fue modificado

if (error && error.message.includes('No rows')) {
    alert('La propiedad fue modificada por otro usuario. Recarga la página.');
}
```

---

### 14. **Falta manejo de errores en listeners de eventos**
**Ubicación:** `public/admin/admin.html` línea 970

**Problema:**
```javascript
galeriaFile.addEventListener('change', async (e) => {
    const files = Array.from(e.target.files);
    
    for (let file of files) {
        const reader = new FileReader();
        reader.onload = (event) => {
            // ¿Qué pasa si estadoFormulario es undefined?
            estadoFormulario.galeria.push(...)
        };
    }
});
```

**Solución:** Validar estado:
```javascript
reader.onload = (event) => {
    if (!estadoFormulario || !Array.isArray(estadoFormulario.galeria)) {
        console.error('Estado de formulario corrupto');
        return;
    }
    estadoFormulario.galeria.push(...);
};
```

---

### 15. **Environment variables no están centralizadas**
**Ubicación:** Varios archivos

**Problema:**
```javascript
// En public/admin/admin.html
const SUPABASE_URL = 'https://...'; // Hardcoded

// En server.js
const PORT = process.env.PORT || 5000; // Usa env

// Inconsistencia
```

**Solución:** Crear `.env.example`:
```
SUPABASE_URL=https://...
SUPABASE_ANON_KEY=...
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
TURSO_DATABASE_URL=...
TURSO_AUTH_TOKEN=...
PORT=5000
ALLOWED_ORIGINS=http://localhost:3000,https://tudominio.com
```

Y documentar cómo configurarlo.

---

## 📋 Prioridad de Arreglos

### Semana 1 (Crítico)
- [ ] Arreglar parseInt con radix
- [ ] Mover credentials de Supabase a .env
- [ ] Restringir CORS
- [ ] Añadir validación de tipos en servidor
- [ ] Manejar JSON.parse errors

### Semana 2 (Alto)
- [ ] Añadir rate limiting
- [ ] Validar URLs en galería
- [ ] Validar longitudes de strings
- [ ] Usar toasts en lugar de alert()
- [ ] Añadir validación en cliente

### Semana 3 (Medio)
- [ ] Evitar race conditions
- [ ] Añadir índices a BD
- [ ] Centralizar environment variables
- [ ] Mejorar manejo de errores en listeners

---

## ✅ Lo que está BIEN

- ✅ Manejo de errores en server.js
- ✅ Cleanup de event listeners en App.js
- ✅ Uso de Data URLs para preview local
- ✅ Subida a Cloudinary para imágenes
- ✅ Separación de concerns frontend/backend
- ✅ Sistema de alertas en admin.html

