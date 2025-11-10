# Servidor local para correos y chat IA

Este servicio HTTP minimalista reemplaza las funciones Edge de Supabase. Expone dos rutas:

- `POST /api/send-mail` para reenviar formularios y transcripciones vía [Resend](https://resend.com/).
- `POST /api/chat` para conectarse directamente con la API de Gemini y devolver respuestas en streaming al chatbot del frontend.

## Requisitos

- Node.js 18 o superior (se aprovecha `fetch` nativo y `for await` en streams).
- Una API Key activa de [Resend](https://resend.com/).
- Una API Key de [Gemini](https://ai.google.dev/gemini-api/docs/api-key) para el chat IA.
- El mismo archivo `.env` que usa Vite (o un `.env.mail`) con las variables descritas más abajo.

## Variables de entorno necesarias

La forma más sencilla es copiar `.env.example` en la raíz del proyecto y rellenar los valores reales:

```bash
cp .env.example .env
```

Campos imprescindibles:

- `RESEND_API_KEY`: clave secreta de Resend.
- `GEMINI_API_KEY`: clave secreta de Gemini.
- `RESEND_RECIPIENTS`: lista separada por comas de correos que recibirán los formularios y chats.
- `VITE_MAIL_API_URL`: URL que el frontend utilizará para contactar este servicio. Si lo mantienes en el mismo host, deja `/api/send-mail` o `http://localhost:8787/api/send-mail`.
- `VITE_CHAT_API_URL`: URL que el frontend utilizará para el chat IA. Por defecto apunta a `/api/chat` o `http://localhost:8787/api/chat`.

Campos opcionales:

- `RESEND_FORM_FROM` y `RESEND_CHAT_FROM` para personalizar el remitente mostrado en cada tipo de correo.
- `PORT` para cambiar el puerto (por defecto 8787).

## Puesta en marcha local

```bash
# instalar dependencias del proyecto
npm install

# levantar el servidor de correo/chat en modo desarrollo
npm run server
```

El script carga automáticamente `.env`, `.env.mail` o el archivo apuntado por `MAIL_SERVER_ENV_FILE`. Si todo está correcto verás en consola:

```
Resend mail server listening on http://localhost:8787
```

## Integración con el frontend

El frontend ya envía las solicitudes a `import.meta.env.VITE_MAIL_API_URL` y `import.meta.env.VITE_CHAT_API_URL`. Si hosteas ambos servicios en el mismo dominio puedes dejar los valores por defecto (`/api/send-mail` y `/api/chat`) y configurar tu reverse proxy para que reenvíe esas rutas al proceso Node.

Para instalaciones en servidores distintos, actualiza ambos valores con las URL públicas del servicio (por ejemplo `https://api.midominio.com/api/send-mail` y `https://api.midominio.com/api/chat`). Recuerda reconstruir el frontend (`npm run build`) después de ajustar las variables.

## Despliegue en producción

1. Copia el código del repositorio a tu servidor y ejecuta `npm install` una sola vez.
2. Rellena las variables sensibles en `.env` (o crea `.env.mail`).
3. Arranca el servicio con tu gestor preferido (ejemplos):
   - **PM2**: `npx pm2 start server/index.js --name rv2-services`
   - **systemd**: crea una unidad que ejecute `node /ruta/al/proyecto/server/index.js` con `WorkingDirectory` apuntando al repo.
4. Configura tu reverse proxy (Nginx, Caddy, etc.) para exponer `/api/send-mail` y `/api/chat` hacia `http://127.0.0.1:8787`.
5. (Opcional) habilita HTTPS y logs siguiendo las políticas de tu infraestructura.

Con esto no necesitas ningún servicio de Supabase para los correos; basta con mantener esta pequeña API Node corriendo en tu servidor.
