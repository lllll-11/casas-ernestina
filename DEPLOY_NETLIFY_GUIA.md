# 🚀 Deploy en Netlify - Guía Rápida

**Fecha de Build:** Febrero 27, 2026
**Estado:** ✅ Build generado correctamente

---

## 📋 Resumen del Estado Actual

```
✅ Build compilado sin errores
✅ Carpeta /build lista para deploy
✅ netlify.toml configurado
✅ Redirecciones SPA configuradas
✅ Headers de seguridad añadidos
✅ Caché optimizada para archivos estáticos
```

### Tamaños de Archivo (Gzipped)
- Main JS: 125.16 kB
- CSS: 5.59 kB
- Chunk JS: 1.76 kB

---

## 🔧 Cómo Hacer Deploy en Netlify

### Opción 1: Desde GitHub (Automático)

1. **Conectar repositorio:**
   - Ve a [netlify.com](https://app.netlify.com)
   - Haz clic en "New site from Git"
   - Selecciona tu repositorio de GitHub
   - Autoriza Netlify

2. **Configuración Automática:**
   - Netlify detectará el archivo `netlify.toml`
   - Build command: `npm run build`
   - Publish directory: `build`

3. **Conectar variables de entorno:**
   - En Netlify, ve a "Site settings" → "Build & deploy" → "Environment"
   - Añade estas variables:
     ```
     REACT_APP_SUPABASE_URL=https://xteghqnlmokceemoameg.supabase.co
     REACT_APP_SUPABASE_ANON_KEY=sb_publishable_1IovWGPE0wG1AgMEWCX3Jw_fUc89xSD
     ```

4. **Deploy:**
   - Cada push a main hace deploy automático
   - También puedes hacer "Trigger deploy" manualmente

---

### Opción 2: Desde CLI (Manual)

```bash
# 1. Instalar Netlify CLI
npm install -g netlify-cli

# 2. Autenticarte
netlify login

# 3. Hacer deploy (genera carpeta build automáticamente)
netlify deploy --prod

# 4. Confirmar build local
netlify deploy --prod --dir=build
```

---

## 🔐 Variables de Entorno para Producción

En Netlify (Site settings → Build & deploy → Environment):

```
REACT_APP_SUPABASE_URL=https://xteghqnlmokceemoameg.supabase.co
REACT_APP_SUPABASE_ANON_KEY=sb_publishable_1IovWGPE0wG1AgMEWCX3Jw_fUc89xSD
```

> ⚠️ **IMPORTANTE:** Cambiar estas credenciales después siguiendo la [guía de seguridad](FALLAS_ENCONTRADAS.md#2-credenciales-de-supabase-expuestas-en-el-cliente)

---

## ✅ Verificaciones Después del Deploy

1. **Homepage:**
   ```
   https://tudominio.netlify.app/
   ```
   - Debe cargar React app correctamente
   - Debe ver todas las propiedades

2. **Panel Admin:**
   ```
   https://tudominio.netlify.app/admin
   ```
   - Debe cargar admin.html
   - Debe conectar a Supabase correctamente

3. **Redirecciones SPA:**
   ```
   https://tudominio.netlify.app/propiedades/1
   https://tudominio.netlify.app/contacto
   ```
   - Deben cargar correctamente (React Router maneja)
   - No deben dar 404

4. **Headers de Seguridad:**
   ```bash
   curl -I https://tudominio.netlify.app/
   ```
   Debe ver:
   - `X-Content-Type-Options: nosniff`
   - `X-Frame-Options: DENY`
   - `X-XSS-Protection: 1; mode=block`

---

## 🐛 Solución de Problemas

### Problema: "npm: not found" o dependencias faltantes

**Solución:**
```bash
# Asegurar que package-lock.json está commitado
npm install  # En local primero
git add package-lock.json
git commit -m "chore: update dependencies"
git push
```

---

### Problema: Supabase no conecta en producción

**Solución:**
- Verificar que las variables de entorno estén configuradas en Netlify
- Verificar CORS en Supabase (debe permitir tu dominio)
- Comprobar en la consola del navegador (F12)

---

### Problema: React Router rutas no funcionan

**Solución:**
- Verificar que `netlify.toml` tenga la redirección `/*` → `/index.html`
- Si aún no funciona, en Netlify añadir redirección en UI:
  ```
  Redirect rule: /* → /index.html [200]
  ```

---

### Problema: Imágenes no cargan

**Solución:**
- Las imágenes deben estar en carpeta `public/`
- Cloudinary URLs deben ser HTTPS
- Verificar en Red tab del navegador (F12)

---

## 📊 Monitoreo en Producción

### Logs en Netlify
- Ve a "Deploys" → último deploy → "Deploy log"
- Busca errores en la sección de build

### Logs del Cliente
- Abre DevTools (F12) → Consola
- Busca errores de conexión a Supabase/Cloudinary

### Analytics
- En Netlify: "Analytics" muestra:
  - Visitantes
  - Páginas más vistas
  - Errores 404
  - Performance

---

## 🔄 CI/CD: Actualizaciones Automáticas

Cada vez que hagas push a `main`:

```
1. GitHub recibe push
2. Webhook notifica a Netlify
3. Netlify corre: npm install → npm run build
4. Si build exitoso → Deploy a producción
5. Si build falla → Notificación por email
6. Sitio actualizado en ~2-5 minutos
```

---

## 📝 Checklist Antes de Deploy Final

- [ ] Build local funcionando: `npm run build`
- [ ] No hay errores en consola
- [ ] Imágenes en Cloudinary (no data URLs)
- [ ] Credenciales de Supabase en `.env.local` para testing
- [ ] `.env` no está commitado (en `.gitignore`)
- [ ] `netlify.toml` está en raíz
- [ ] Repositorio en GitHub
- [ ] Netlify conectado al repo
- [ ] Variables de entorno en Netlify configuradas
- [ ] Dominio custom (opcional): DNS configurado
- [ ] SSL/TLS: ✅ Automático en Netlify

---

## 🎯 Próximos Pasos

1. **Hoy:**
   - Conectar GitHub a Netlify
   - Configurar variables de entorno

2. **Esta Semana:**
   - Cambiar credenciales de Supabase
   - Implementar rate limiting
   - Añadir dominio custom (si tienes)

3. **Próximas Semanas:**
   - Migrar admin.html a React (para mejor seguridad)
   - Implementar rate limiting
   - Restringir CORS

---

## 📞 Soporte

- **Netlify Docs:** https://docs.netlify.com/
- **React Deploy:** https://create-react-app.dev/deployment/
- **GitHub Issues:** Para bugs del código

---

**¡Deploy listo! 🚀**
