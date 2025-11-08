import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Método no permitido' });
  }

  const { type } = req.body;

  const transporter = nodemailer.createTransport({
    host: 'mail.rv2ven.com',
    port: 587,
    secure: false,
    auth: {
      user: 'contacto@rv2ven.com',
      pass: process.env.SMTP_PASS,
    },
    tls: { rejectUnauthorized: false },
  });

  try {
    if (type === 'form') {
      const { name, email, phone, message } = req.body;

      await transporter.sendMail({
        from: '"RV2 Contacto" <contacto@rv2ven.com>',
        to: 'juanchacon@rv2ven.com',
        subject: 'Nuevo mensaje desde el formulario web RV2',
        html: `
          <h2>Nuevo mensaje desde el formulario RV2</h2>
          <p><strong>Nombre:</strong> ${name}</p>
          <p><strong>Correo:</strong> ${email}</p>
          <p><strong>Teléfono:</strong> ${phone || 'No proporcionado'}</p>
          <p><strong>Mensaje:</strong><br>${message}</p>
          <hr>
          <small>Enviado el ${new Date().toLocaleString('es-VE')}</small>
        `,
      });
      return res.status(200).json({ success: true });
    }

    if (type === 'chat') {
      const { visitorName, startTime, endTime, messages } = req.body;

      const formattedMessages = messages
        .map((m) => `<p><strong>${m.role === 'user' ? '👤 Usuario:' : '🤖 IA:'}</strong> ${m.content}</p>`)
        .join('');

      await transporter.sendMail({
        from: '"RV2 Chat" <contacto@rv2ven.com>',
        to: 'juanchacon@rv2ven.com',
        subject: `Transcripción de chat - ${visitorName || 'Visitante Anónimo'}`,
        html: `
          <h2>Transcripción de chat – RV2 Web</h2>
          <p><strong>Visitante:</strong> ${visitorName || 'Anónimo'}</p>
          <p><strong>Hora de inicio:</strong> ${startTime}</p>
          <p><strong>Hora de fin:</strong> ${endTime}</p>
          <hr>${formattedMessages}<hr>
          <small>Enviado automáticamente desde el chat RV2.</small>
        `,
      });
      return res.status(200).json({ success: true });
    }

    res.status(400).json({ success: false, message: 'Tipo no válido' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error al enviar el correo' });
  }
}
