import http from 'node:http';
import { readFileSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, parse as parseUrl } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function hydrateEnvFromFile(envFile) {
  if (!envFile || !existsSync(envFile)) {
    return;
  }

  const fileContent = readFileSync(envFile, 'utf8');

  fileContent.split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith('#')) {
      return;
    }

    const equalsIndex = trimmed.indexOf('=');
    if (equalsIndex === -1) {
      return;
    }

    const key = trimmed.slice(0, equalsIndex).trim();
    if (!key || key in process.env) {
      return;
    }

    let value = trimmed.slice(equalsIndex + 1).trim();
    if (value.startsWith('"') && value.endsWith('"')) {
      value = value.slice(1, -1);
    } else if (value.startsWith("'") && value.endsWith("'")) {
      value = value.slice(1, -1);
    }

    process.env[key] = value;
  });
}

const candidateEnvFiles = [
  process.env.MAIL_SERVER_ENV_FILE && resolve(process.cwd(), process.env.MAIL_SERVER_ENV_FILE),
  resolve(process.cwd(), '.env.mail'),
  resolve(process.cwd(), '.env'),
  resolve(__dirname, '.env'),
];

candidateEnvFiles.forEach((filePath) => hydrateEnvFromFile(filePath));

const PORT = Number(process.env.PORT || 8787);
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_FORM = process.env.RESEND_FORM_FROM || 'RV2 Web <onboarding@resend.dev>';
const FROM_CHAT = process.env.RESEND_CHAT_FROM || 'RV2 Chat <onboarding@resend.dev>';
const RECIPIENTS = (process.env.RESEND_RECIPIENTS || 'juanchacon@rv2ven.com,juanchacon0298@gmail.com')
  .split(',')
  .map((email) => email.trim())
  .filter(Boolean);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'OPTIONS, POST',
};

function sendJson(res, status, data) {
  res.writeHead(status, {
    'Content-Type': 'application/json',
    ...corsHeaders,
  });
  res.end(JSON.stringify(data));
}

async function sendEmail(payload) {
  if (!RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY is not configured');
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Resend API error (${response.status}): ${errorText}`);
  }

  return response.json();
}

const server = http.createServer(async (req, res) => {
  const { method, url } = req;
  const { pathname } = parseUrl(url ?? '', true);

  if (method === 'OPTIONS') {
    res.writeHead(204, corsHeaders);
    res.end();
    return;
  }

  if (method !== 'POST' || pathname !== '/api/send-mail') {
    sendJson(res, 404, { success: false, message: 'Route not found.' });
    return;
  }

  try {
    const chunks = [];
    for await (const chunk of req) {
      chunks.push(chunk);
    }
    const rawBody = Buffer.concat(chunks).toString('utf8');
    const body = rawBody ? JSON.parse(rawBody) : {};
    const { type } = body;

    if (!type) {
      sendJson(res, 400, { success: false, message: 'Missing email type.' });
      return;
    }

    if (!Array.isArray(RECIPIENTS) || RECIPIENTS.length === 0) {
      sendJson(res, 500, { success: false, message: 'No recipients configured.' });
      return;
    }

    if (type === 'form') {
      const { name, email, phone, message } = body;

      if (!name || !email) {
        sendJson(res, 400, { success: false, message: 'Nombre y correo son obligatorios.' });
        return;
      }

      await sendEmail({
        from: FROM_FORM,
        to: RECIPIENTS,
        subject: 'Nuevo mensaje desde el formulario web RV2',
        html: `
          <h2>Nuevo mensaje desde el formulario RV2</h2>
          <p><strong>Nombre:</strong> ${name}</p>
          <p><strong>Correo:</strong> ${email}</p>
          <p><strong>Teléfono:</strong> ${phone || 'No proporcionado'}</p>
          <p><strong>Mensaje:</strong><br>${message || 'Sin mensaje adicional'}</p>
          <hr>
          <small>Enviado el ${new Date().toLocaleString('es-VE', { timeZone: 'America/Caracas' })}</small>
        `,
      });

      sendJson(res, 200, { success: true, message: 'Correo enviado correctamente.' });
      return;
    }

    if (type === 'chat') {
      const { visitorName, visitorEmail, visitorPhone, startTime, endTime, messages } = body;

      if (!messages || !Array.isArray(messages) || messages.length === 0) {
        sendJson(res, 400, { success: false, message: 'No hay mensajes para enviar.' });
        return;
      }

      const formattedMessages = messages
        .map((m) => {
          const roleLabel = m.role === 'user' ? '👤 Usuario:' : '🤖 IA:';
          const content = (typeof m.content === 'string' && m.content.trim()) ? m.content : '[mensaje vacío]';
          return `<p><strong>${roleLabel}</strong> ${content}</p>`;
        })
        .join('');

      await sendEmail({
        from: FROM_CHAT,
        to: RECIPIENTS,
        subject: `Transcripción de chat - ${visitorName || 'Visitante Anónimo'}`,
        html: `
          <h2>Transcripción de chat – RV2 Web</h2>
          <p><strong>Visitante:</strong> ${visitorName || 'Anónimo'}</p>
          <p><strong>Correo:</strong> ${visitorEmail || 'No proporcionado'}</p>
          <p><strong>Teléfono:</strong> ${visitorPhone || 'No proporcionado'}</p>
          <p><strong>Hora de inicio:</strong> ${startTime || 'No registrada'}</p>
          <p><strong>Hora de fin:</strong> ${endTime || 'No registrada'}</p>
          <hr>
          ${formattedMessages}
          <hr>
          <small>Enviado automáticamente desde el chat RV2.</small>
        `,
      });

      sendJson(res, 200, { success: true, message: 'Transcripción enviada.' });
      return;
    }

    sendJson(res, 400, { success: false, message: 'Tipo de solicitud no válido.' });
  } catch (error) {
    console.error('Error al procesar la solicitud de correo:', error);
    sendJson(res, 500, {
      success: false,
      message: 'Error interno al enviar el correo.',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

server.listen(PORT, () => {
  console.log(`Resend mail server listening on http://localhost:${PORT}`);
});
