# 🚀 Guía de Deploy a Netlify

## Opción 1: Deploy desde GitHub (Recomendado - Automático)

### Paso 1: Crear repositorio en GitHub

```bash
cd "c:\Users\agwit\OneDrive\Escritorio\casas ernestina\casas"
git init
git add .
git commit -m "Initial commit - Casas Ernestina con Cloudinary"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/casas-ernestina.git
git push -u origin main
```

### Paso 2: Conectar con Netlify

1. Ir a https://app.netlify.com
2. Click en "New site from Git"
3. Seleccionar "GitHub"
4. Buscar y seleccionar el repositorio "casas-ernestina"
5. Configuración automática:
   - **Build command:** `npm run build`
   - **Publish directory:** `build`
   - Click **"Deploy site"**

### Paso 3: Configurar Variables de Entorno en Netlify

1. En el dashboard de Netlify, ir a **Site settings**
2. En el menú izquierdo → **Build & deploy** → **Environment**
3. Agregar variables:

```
CLOUDINARY_CLOUD_NAME=dkrzgitcl
CLOUDINARY_API_KEY=432418661746495
CLOUDINARY_API_SECRET=mU2F2JGmTmYNtwY8Gd_L1zpwqso
REACT_APP_API_URL=https://tu-backend-url.com/api
```

---

## Opción 2: Deploy Manual (Sin GitHub)

```bash
# Compilar el proyecto
npm run build

# Ir a https://app.netlify.com
# Click "Add new site" → "Deploy manually"
# Arrastra la carpeta "build/"
```

---

## Admin Panel

El panel admin está disponible en:
- **Local:** `http://localhost:3000/admin`
- **Producción:** `https://tu-sitio.netlify.app/admin`

---

## Backend (API)

El backend debe correr en:
- **Local:** `http://localhost:5000`
- **Producción:** Desplegar en Heroku, Railway, o Render

Luego actualizar `REACT_APP_API_URL` en las variables de entorno de Netlify.

---

## Estructura después del Deploy

```
https://tu-sitio.netlify.app/          → React App (Inicio)
https://tu-sitio.netlify.app/admin     → Panel Admin
https://api.tu-sitio.com/api/...       → Backend API (en otro servidor)
```

---

## Verificación Post-Deploy

✅ Las imágenes subidas van a Cloudinary  
✅ URLs en `https://res.cloudinary.com/dkrzgitcl/...`  
✅ Panel admin accesible en `/admin`  
✅ API conectada correctamente desde el frontend
