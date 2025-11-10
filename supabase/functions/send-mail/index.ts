import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

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

      const emailResponse = await resend.emails.send({
        from: 'RV2 Web <onboarding@resend.dev>',
        to: ['juanchacon@rv2ven.com', 'juanchacon0298@gmail.com'],
        subject: 'Nuevo mensaje desde el formulario web RV2',
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

      console.log('Form email sent successfully:', emailResponse);

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
      const { visitorName, visitorEmail, visitorPhone, startTime, endTime, messages } = body;

      console.log('Sending chat transcript for:', visitorName);

      const formattedMessages = messages
        .map(
          (m: { role: string; content: string }) =>
            `<p><strong>${m.role === 'user' ? '👤 Usuario:' : '🤖 IA:'}</strong> ${m.content}</p>`
        )
        .join('');

      const emailResponse = await resend.emails.send({
        from: 'RV2 Chat <onboarding@resend.dev>',
        to: ['juanchacon@rv2ven.com', 'juanchacon0298@gmail.com'],
        subject: `Transcripción de chat - ${visitorName || 'Visitante Anónimo'}`,
        html: `
          <h2>Transcripción de chat – RV2 Web</h2>
          <p><strong>Visitante:</strong> ${visitorName || 'Anónimo'}</p>
          <p><strong>Correo:</strong> ${visitorEmail || 'No proporcionado'}</p>
          <p><strong>Teléfono:</strong> ${visitorPhone || 'No proporcionado'}</p>
          <p><strong>Hora de inicio:</strong> ${startTime}</p>
          <p><strong>Hora de fin:</strong> ${endTime}</p>
          <hr>
          ${formattedMessages}
          <hr>
          <small>Enviado automáticamente desde el chat RV2.</small>
        `,
      });

      console.log('Chat transcript sent successfully:', emailResponse);

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