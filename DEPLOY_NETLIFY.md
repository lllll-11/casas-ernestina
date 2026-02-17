# 📱 Subir Sitio Principal a Netlify

## 🚀 Paso a Paso

### 1. Preparar el Sitio Localmente
```bash
# Verificar que todo funciona
npm run build

# Esto crea una carpeta "build" lista para producción
```

### 2. Crear Cuenta en Netlify
- Ve a https://netlify.com
- Haz clic en "Sign up"
- Registrate con GitHub, GitLab, Bitbucket o email

### 3. Opción A: Deploy desde Git (Recomendado)

#### 3.1 Crear Repositorio en GitHub
```bash
# Desde la carpeta del proyecto
git init
git add .
git commit -m "Primera versión del sitio"
git branch -M main
git remote add origin https://github.com/tu-usuario/casas.git
git push -u origin main
```

#### 3.2 Conectar con Netlify
1. Ve a https://netlify.com/drop
2. Click en "New site from Git"
3. Elige "GitHub"
4. Busca el repositorio "casas"
5. En "Build command" → deja: `npm run build`
6. En "Publish directory" → deja: `build`
7. Click "Deploy site"

### 4. Opción B: Deploy Manual (Más Rápido)

1. Ve a https://app.netlify.com
2. Click en "Add new site"
3. "Deploy manually"
4. Arrastra la carpeta `build/` (después de hacer `npm run build`)
5. ¡Listo! Te da una URL

### 5. Configurar Variable de Entorno (Importante!)

Una vez en Netlify:

1. Ve a tu sitio en Netlify
2. Abre "Site settings"
3. Click "Build & deploy" → "Environment"
4. Click "Edit variables"
5. Agrega:
   - **Key**: `REACT_APP_API_URL`
   - **Value**: `https://tu-servidor.com:5000/api`
   
   Por ejemplo:
   ```
   REACT_APP_API_URL=https://casas-backend.onrender.com/api
   ```

6. Vuelve a hacer deploy (redeploy)

### 6. Donde Alojar el Backend

Tienes varias opciones gratuitas:

#### Opción 1: Render.com (Recomendado)
1. Ve a https://render.com
2. Click "New +"
3. "Web Service"
4. Conecta tu repositorio de GitHub
5. Configura:
   - **Build command**: `npm install`
   - **Start command**: `node server.js`
   - **Environment**: Agrega las variables de `.env`
6. Deploy automático

#### Opción 2: Railway.app
1. Ve a https://railway.app
2. Click "Create a new project"
3. "Deploy from GitHub"
4. Selecciona tu repositorio
5. Agrega variables de entorno
6. Deploy automático

#### Opción 3: Replit
1. Ve a https://replit.com
2. "Create a Repl"
3. De GitHub, importa tu repositorio
4. Click "Run"
5. Una URL pública está lista

### 7. Actualizar API_URL en Netlify

Una vez tengas el backend alojado, actualiza en Netlify:

**Antes** (desarrollo):
```
REACT_APP_API_URL=http://localhost:5000/api
```

**Después** (producción con Render):
```
REACT_APP_API_URL=https://casas-api.onrender.com/api
```

**Después** (producción con Railway):
```
REACT_APP_API_URL=https://tu-railway-url/api
```

## ✅ Checklist de Deploy

- [ ] Hice `npm run build` sin errores
- [ ] Creé cuenta en Netlify
- [ ] Conecté mi repositorio de GitHub
- [ ] Configuré `REACT_APP_API_URL` en variables de entorno
- [ ] El backend está corriendo en otro servidor
- [ ] Hice redeploy después de cambiar variables
- [ ] El sitio se ve y funciona correctamente

## 🔗 URLs finales

**Sitio principal**: https://tu-sitio.netlify.app
**Panel Admin**: https://tu-servidor-backend.com/admin.html
**API**: https://tu-servidor-backend.com/api/propiedades

## 🐛 Solución de Problemas

### El sitio se ve pero no carga propiedades
- Abre Console (F12)
- Busca errores CORS
- Verifica que `REACT_APP_API_URL` es correcta en Netlify
- Haz redeploy: "Deploys" → "Trigger deploy"

### Error CORS
```
Access to XMLHttpRequest blocked by CORS policy
```

Solución en `server.js`:
```javascript
app.use(cors({
  origin: "https://tu-sitio.netlify.app"
}));
```

### Las variables de entorno no funcionan
1. Verifica que empiezan con `REACT_APP_`
2. Haz redeploy
3. Abre incógnito para evitar cache

## 📚 Guías útiles

- [Netlify Docs](https://docs.netlify.com)
- [Render Docs](https://render.com/docs)
- [Railway Docs](https://docs.railway.app)
- [Create React App - Deployment](https://create-react-app.dev/deployment/)

---

¡Tu sitio en la nube! 🎉
