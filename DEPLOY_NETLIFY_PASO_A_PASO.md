# 📦 Deploy a Netlify - Guía Paso a Paso

## ✅ Opción 1: Todo en UN sitio Netlify (Recomendado)

La app React en `/` y el admin en `/admin`

### 1️⃣ Preparar en tu computadora

```bash
# En PowerShell dentro de la carpeta del proyecto
cd "C:\Users\agwit\OneDrive\Escritorio\casas ernestina\casas"

# Verificar que compila correctamente
npm run build

# Debe crear una carpeta "build"
```

### 2️⃣ Crear repositorio Git

```bash
# Inicializar Git
git init

# Agregar todos los archivos
git add .

# Hacer commit
git commit -m "Casas Ernestina - App React + Admin + Cloudinary"

# Cambiar rama a main
git branch -M main

# Agregar repositorio remoto (CAMBIAR tu-usuario y tu-repo)
git remote add origin https://github.com/tu-usuario/casas-ernestina.git

# Subir a GitHub
git push -u origin main
```

### 3️⃣ Conectar con Netlify

1. Ir a https://app.netlify.com
2. Click en **"New site from Git"**
3. Seleccionar **GitHub**
4. Buscar y seleccionar tu repositorio
5. Confirmar configuración:
   - **Build command:** `npm run build`
   - **Publish directory:** `build`
6. Click en **"Deploy site"** ✅

### 4️⃣ Configurar Variables en Netlify

1. En el dashboard del sitio
2. Ir a **Site settings** (parte superior)
3. Ir a **Build & deploy** → **Environment**
4. Click en **Edit variables** y agregar:

```
CLOUDINARY_CLOUD_NAME = dkrzgitcl
CLOUDINARY_API_KEY = 432418661746495
CLOUDINARY_API_SECRET = mU2F2JGmTmYNtwY8Gd_L1zpwqso
REACT_APP_API_URL = https://tu-backend.herokuapp.com/api
```

5. Click en **"Save"** y esperar redeploy automático

---

## 🌐 URLs Resultantes

```
Sitio principal:    https://tu-sitio.netlify.app
Admin panel:        https://tu-sitio.netlify.app/admin
API (en otro lado): https://tu-api.com/api
```

---

## 🔧 Para el Backend (Node.js con Express)

El backend (`server.js`) necesita estar en otro servidor:

### Opciones para hospedar el backend:
- **Render.com** (gratis, fácil)
- **Heroku** (de pago, pero popular)
- **Railway** (24/7, barato)
- **DigitalOcean** (VPS, más control)

### Pasos para Render.com (GRATIS):

1. Ir a https://render.com
2. Click en **New +** → **Web Service**
3. Conectar tu repositorio de GitHub
4. Configuración:
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
5. Agregar variables de entorno:
```
CLOUDINARY_URL=cloudinary://432418661746495:mU2F2JGmTmYNtwY8Gd_L1zpwqso@dkrzgitcl
CLOUDINARY_CLOUD_NAME=dkrzgitcl
CLOUDINARY_API_KEY=432418661746495
CLOUDINARY_API_SECRET=mU2F2JGmTmYNtwY8Gd_L1zpwqso
TURSO_DATABASE_URL=libsql://casasernestina-andriyvil.aws-us-east-1.turso.io
TURSO_AUTH_TOKEN=eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzEyMTAyNjQsImlkIjoiNWQ2NDg1MzMtNzcxYy00Yzk3LTg4NDQtZTEwNzczZTA5ZGJjIiwicmlkIjoiNjJhOTc0ZjQtZGFjZi00MzBlLWJlMGYtNzg5NzFhZWVjN2MyIn0.COnv7ttvHViV-8Ow7-rQEXhv_jdHtM2ojtYnwcVZ2FugEItF1X5GT_LTnXxC9I25KsXXi_x8yUYxEySUXLT8DQ
PORT=5000
NODE_ENV=production
```
6. Click **Create Web Service**
7. Copiar la URL (ej: `https://casas-api.onrender.com`)
8. Volver a Netlify y actualizar `REACT_APP_API_URL` con esta URL

---

## ⚠️ Nota Importante

Antes de deployar a Netlify, **asegúrate de que NO están en el repositorio:**
- `.env` (archivo de variables sensibles)
- `node_modules/` (carpeta grande)
- `/build` (se genera en Netlify)

Esto ya debe estar configurado en `.gitignore`

---

## ✅ Checklist Pre-Deploy

- [ ] `npm run build` compila sin errores
- [ ] `.env` NO está en Git (revisar `.gitignore`)
- [ ] `package.json` tiene todos los scripts
- [ ] `netlify.toml` está configurado
- [ ] Repositorio en GitHub creado
- [ ] Sitio en Netlify conectado
- [ ] Variables de entorno en Netlify agregadas
- [ ] Backend desplegado en otro sitio (Render, Heroku, etc)
- [ ] `REACT_APP_API_URL` apunta al backend correcto

---

## 🚨 Si Algo Falla

**Deploy no inicia:**
- Chequea los logs en Netlify (Deploy → logs)
- Verifica `npm run build` funciona localmente

**Admin no carga:**
- Asegúrate `/admin` esté en `public/admin/index.html`
- Verifica en `netlify.toml` la configuración de redirects

**API no funciona:**
- Chequea que backend esté corriendo
- Verifica URL en `REACT_APP_API_URL`
- Chequea CORS en backend

---

## 📞 Soporte

Netlify tiene buena documentación: https://docs.netlify.com
