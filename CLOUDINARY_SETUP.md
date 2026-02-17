# Configuración de Cloudinary

## Credenciales Necesarias

Tu nube de Cloudinary es: **dkrzgitcl**

### Variables de Entorno Requeridas

En tu archivo `.env` (desarrollo) y `.env.production` (producción), actualiza estas variables:

```
CLOUDINARY_CLOUD_NAME=dkrzgitcl
CLOUDINARY_API_KEY=tu_api_key_aqui
CLOUDINARY_API_SECRET=tu_api_secret_aqui
CLOUDINARY_URL=cloudinary://tu_api_key:tu_api_secret@dkrzgitcl
```

## Cómo Obtener tus Credenciales

1. Ve a [Cloudinary Dashboard](https://cloudinary.com/console)
2. Inicia sesión con tu cuenta
3. En la página principal, verás tu **Cloud Name** (ya lo tienes: dkrzgitcl)
4. Busca la sección de **API Key** y **API Secret**
5. Copia y pega estos valores en tu `.env`

## Cambios Realizados en el Servidor

✅ **server.js ha sido actualizado para:**
- Usar Cloudinary en lugar de guardar archivos localmente
- Cargar imágenes a la carpeta `casas-ernestina/` en Cloudinary
- Cargar galerías a `casas-ernestina/gallery/`
- Retornar URLs seguras de Cloudinary (HTTPS)

## Características de la Integración

- ✅ Compresión automática de imágenes
- ✅ Soporte de múltiples formatos (JPEG, PNG, WebP, GIF, AVIF)
- ✅ Almacenamiento centralizado en la nube
- ✅ URLs permanentes para tus imágenes
- ✅ Sin necesidad de carpeta `/public/imagenes/` local

## Endpoints Disponibles

- `POST /api/upload` - Subir una imagen
- `POST /api/upload-multiple` - Subir múltiples imágenes para galerías

Ambos endpoints ahora usan Cloudinary automáticamente.
