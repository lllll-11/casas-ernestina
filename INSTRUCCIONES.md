# 🏠 Casitas - Sistema de Gestión de Propiedades

Sistema completo para gestionar y mostrar propiedades de alquiler con base de datos Turso.

## ✨ Características

- ✅ **Panel de administración** - Agregar, editar y eliminar propiedades sin código
- 🗺️ **Google Maps embebido** - Mostrar ubicación exacta de cada propiedad
- 📱 **Responsive** - Funciona en móvil, tablet y desktop
- 🎨 **Diseño moderno** - Interface profesional y atractiva
- 🗄️ **Base de datos Turso** - SQLite en la nube, gratis y escalable
- ⚡ **API REST** - Backend con Express y Node.js
- 🔄 **Sincronización en tiempo real** - Los cambios aparecen al instante

## 🚀 Inicio Rápido

### Instalación

```bash
# 1. Instalar dependencias
npm install

# 2. Las variables de entorno ya están configuradas en .env
# (Si necesitas cambiar credenciales, edita el archivo .env)

# 3. Iniciar servidor y cliente en paralelo
npm run dev
```

Esto abrirá:
- **React App**: http://localhost:3000
- **API Backend**: http://localhost:5000

## 📋 Cómo Usar

### Ver Propiedades
1. Ve a http://localhost:3000
2. Verás todas las propiedades listadas con filtros por categoría
3. Haz clic en cualquier propiedad para ver detalles completos

### Panel de Administración
1. Haz clic en el ícono **🔧** en la esquina superior derecha
2. Se abre el panel de administración
3. Puedes:
   - ➕ **Crear** nuevas propiedades
   - ✏️ **Editar** propiedades existentes
   - 🗑️ **Eliminar** propiedades

### Agregar una Propiedad

1. En el panel, haz clic en **"+ Nueva Propiedad"**
2. Completa el formulario:
   - **Título**: Nombre de la propiedad
   - **Categoría**: Playa, Bosque o Ciudad
   - **Rating**: Valoración (0-5)
   - **Imagen principal**: URL de la foto principal
   - **Galería**: URLs de fotos adicionales (una por línea)
   - **Ubicación**: Ciudad o dirección
   - **Coordenadas**: Latitud,Longitud (ej: 21.4872,-105.4323)
   - **Descripción**: Breve descripción
   - **Detalles**: Descripción detallada
   - **Huéspedes**: Cantidad de huéspedes
   - **Dormitorios**: Cantidad de dormitorios
   - **Baños**: Cantidad de baños
   - **Amenidades**: Lista de amenidades (separadas por coma)

3. Haz clic en **"✓ Crear"**

## 📍 Cómo Obtener Coordenadas

1. Ve a https://www.google.com/maps
2. Busca la ubicación de la propiedad
3. Haz clic derecho en el pin rojo
4. Las coordenadas se copiarán automáticamente
5. Pégalas en el formato: `latitud,longitud`

Ejemplo: `21.4872,-105.4323`

## 🗄️ Base de Datos (Turso)

La base de datos está configurada en:
- **URL**: `libsql://casasernestina-andriyvil.aws-us-east-1.turso.io`
- **Token**: Almacenado en `.env`

Las propiedades se guardan automáticamente en Turso SQL.

## 🛠️ Estructura del Proyecto

```
casas/
├── src/
│   ├── App.js           # Componente principal
│   ├── App.css          # Estilos principales
│   ├── AdminPanel.js    # Panel de administración
│   ├── AdminPanel.css   # Estilos del panel
│   └── index.js         # Punto de entrada
├── server.js            # Backend Express + Turso
├── .env                 # Variables de entorno
└── package.json         # Dependencias
```

## 🔌 API Endpoints

### GET /api/propiedades
Obtiene todas las propiedades

### GET /api/propiedades/:id
Obtiene una propiedad específica

### POST /api/propiedades
Crea una nueva propiedad

### PUT /api/propiedades/:id
Actualiza una propiedad

### DELETE /api/propiedades/:id
Elimina una propiedad

## 📱 URLs Importantes

- **Sitio principal**: http://localhost:3000
- **Panel admin**: http://localhost:3000 → clic en 🔧
- **API**: http://localhost:5000/api/propiedades

## 🎓 Comandos Útiles

```bash
# Correr solo el servidor
npm run server

# Correr solo React
npm start

# Correr servidor y React juntos
npm run dev

# Construir para producción
npm run build
```

## 🐛 Solución de Problemas

### El panel no se abre
- Asegúrate de que el servidor está corriendo: `npm run dev`
- Revisa que el puerto 5000 esté disponible

### La base de datos no conecta
- Verifica que el archivo `.env` existe
- Revisa que las credenciales de Turso sean correctas
- Abre la consola del navegador (F12) para ver errores

### Las imagenes no cargan
- Asegúrate de usar URLs HTTP/HTTPS válidas
- Prueba con URLs de imágenes públicas (ej: Unsplash, Pexels)

## 📚 Recursos

- [Turso Docs](https://docs.turso.tech)
- [Express Docs](https://expressjs.com)
- [React Docs](https://react.dev)

## 📝 Notas

- El panel administrativo está disponible en todo momento
- Los datos se guardan automáticamente en Turso
- Puede acceder desde cualquier dispositivo en la red usando: `http://tu-ip:3000`

---

¡Disfruta administrando tus propiedades! 🎉
