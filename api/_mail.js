import nodemailer from 'nodemailer';

export async function sendMail({ to, subject, html }) {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn("E-Mail nicht gesendet: SMTP-Umgebungsvariablen fehlen.");
    return;
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '465', 10),
    secure: parseInt(process.env.SMTP_PORT || '465', 10) === 465, 
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const from = `Winterberg Verzeichnis <info@sichtbar-online.com>`;

  await transporter.sendMail({
    from,
    to,
    subject,
    html,
  });
}
