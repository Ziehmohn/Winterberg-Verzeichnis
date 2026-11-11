import nodemailer from 'nodemailer';

export async function sendMail({ to, subject, html, cc, bcc, replyTo }) {
  const host = process.env.SMTP_HOST || 'dd15904.kasserver.com';
  const port = parseInt(process.env.SMTP_PORT || '465', 10);
  const secure = process.env.SMTP_SECURE ? process.env.SMTP_SECURE === 'true' : port === 465;
  const user = process.env.SMTP_USER || 'info@sichtbar-online.com';
  const pass = process.env.SMTP_PASS;

  if (!pass) {
    console.warn("[SMTP] E-Mail nicht gesendet: SMTP_PASS fehlt in den Umgebungsvariablen.");
    return { success: false, error: 'SMTP_PASS missing' };
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
  });

  const from = process.env.SMTP_FROM || `"Winterberg Verzeichnis" <${user}>`;

  const parseRecipients = (input) => {
    if (!input) return undefined;
    if (Array.isArray(input)) return input;
    if (typeof input === 'string') {
      return input.split(',').map(s => s.trim()).filter(Boolean);
    }
    return input;
  };

  try {
    const info = await transporter.sendMail({
      from,
      to: parseRecipients(to),
      cc: parseRecipients(cc),
      bcc: parseRecipients(bcc),
      replyTo: replyTo || undefined,
      subject,
      html,
    });
    console.log(`[SMTP] E-Mail erfolgreich versendet an [${to}]: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`[SMTP] Fehler beim Versenden der E-Mail an [${to}] über ${host}:${port} (User: ${user}):`, error.message);
    throw error;
  }
}
