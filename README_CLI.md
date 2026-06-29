# Sistema de Pedidos y Administración - Entre Tazas

Este proyecto ha sido configurado con soporte para persistencia de pedidos en tiempo real usando Firebase Firestore, autenticación del panel de administración con Firebase Auth y salida de pedidos formateada hacia WhatsApp.

## 🛠️ Configuración de Firebase

1. Crea un proyecto en la consola de Firebase: [https://console.firebase.google.com/](https://console.firebase.google.com/)
2. Habilita **Firestore Database** en modo de producción o prueba.
3. Habilita **Authentication** y activa el proveedor de **Correo electrónico y contraseña**.
4. Crea un usuario administrador en Authentication (este será el email y contraseña para ingresar a `tu-url.com/#/admin`).
5. Registra una aplicación web en la configuración del proyecto de Firebase para obtener las credenciales.

## 🔑 Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto basándote en el archivo `.env.example` y rellena con tus credenciales:

```env
VITE_FIREBASE_API_KEY=tu_api_key
VITE_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tu_proyecto
VITE_FIREBASE_STORAGE_BUCKET=tu_proyecto.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
VITE_FIREBASE_APP_ID=tu_app_id
```

## 🚀 Despliegue en Producción (Netlify / Vercel)

El proyecto ya está conectado a tu GitHub. Cada vez que hagas cambios se desplegará solo.

Para que Firebase funcione en producción:
1. Ve a la configuración de tu sitio en Netlify o Vercel.
2. Ve a la pestaña **Environment Variables** (Variables de Entorno).
3. Añade las mismas claves del archivo `.env` con sus respectivos valores.
4. Vuelve a ejecutar un despliegue (Trigger deploy) para aplicar las variables de entorno.

## 🖥️ Panel de Administración

Puedes acceder al panel de administración en la siguiente ruta:
👉 `https://tu-sitio.netlify.app/#/admin`

Desde allí podrás:
* Ver estadísticas de ingresos de pedidos confirmados.
* Ver los 5 productos más pedidos en tiempo real.
* Confirmar pedidos entrantes pendientes.
* Eliminar pedidos de la lista.
