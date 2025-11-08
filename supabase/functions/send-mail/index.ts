import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Configuración del cliente SMTP
const client = new SMTPClient({
  connection: {
    hostname: 'mail.rv2ven.com',
    port: 587,
    tls: false,
    auth: {
      username: 'contacto@rv2ven.com',
      password: Deno.env.get('SMTP_PASS') || '',
    },
  },
});

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type } = await req.json();
    const body = await req.clone().json();

    console.log('Received request type:', type);

    // -------------------------------
    // 1️⃣ ENVÍO DESDE FORMULARIO
    // -------------------------------
    if (type === 'form') {
      const { name, email, phone, message } = body;

      console.log('Sending form email from:', name, email);

      await client.send({
        from: 'contacto@rv2ven.com',
        to: 'juanchacon@rv2ven.com',
        subject: 'Nuevo mensaje desde el formulario web RV2',
        content: 'auto',
        html: `
          <h2>Nuevo mensaje desde el formulario RV2</h2>
          <p><strong>Nombre:</strong> ${name}</p>
          <p><strong>Correo:</strong> ${email}</p>
          <p><strong>Teléfono:</strong> ${phone || 'No proporcionado'}</p>
          <p><strong>Mensaje:</strong><br>${message}</p>
          <hr>
          <small>Enviado el ${new Date().toLocaleString('es-VE', { timeZone: 'America/Caracas' })}</small>
        `,
      });

      await client.close();
      console.log('Form email sent successfully');

      return new Response(
        JSON.stringify({ success: true, message: 'Correo enviado correctamente.' }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // -------------------------------
    // 2️⃣ ENVÍO DE TRANSCRIPCIÓN DE CHAT
    // -------------------------------
    if (type === 'chat') {
      const { visitorName, startTime, endTime, messages } = body;

      console.log('Sending chat transcript for:', visitorName);

      const formattedMessages = messages
        .map(
          (m: { role: string; content: string }) =>
            `<p><strong>${m.role === 'user' ? '👤 Usuario:' : '🤖 IA:'}</strong> ${m.content}</p>`
        )
        .join('');

      await client.send({
        from: 'contacto@rv2ven.com',
        to: 'juanchacon@rv2ven.com',
        subject: `Transcripción de chat - ${visitorName || 'Visitante Anónimo'}`,
        content: 'auto',
        html: `
          <h2>Transcripción de chat – RV2 Web</h2>
          <p><strong>Visitante:</strong> ${visitorName || 'Anónimo'}</p>
          <p><strong>Hora de inicio:</strong> ${startTime}</p>
          <p><strong>Hora de fin:</strong> ${endTime}</p>
          <hr>
          ${formattedMessages}
          <hr>
          <small>Enviado automáticamente desde el chat RV2.</small>
        `,
      });

      await client.close();
      console.log('Chat transcript sent successfully');

      return new Response(
        JSON.stringify({ success: true, message: 'Transcripción enviada.' }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    return new Response(
      JSON.stringify({ success: false, message: 'Tipo de solicitud no válido.' }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error al enviar correo:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: 'Error interno al enviar el correo.',
        error: error instanceof Error ? error.message : 'Unknown error'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});