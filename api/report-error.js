import { sendMail } from './_mail.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { businessId, businessName, message } = req.body;

  if (!businessId || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const emailHtml = `
      <h2>Fehlermeldung für Eintrag</h2>
      <p>Es wurde ein Fehler für ein Unternehmen auf dem Winterberg-Verzeichnis gemeldet:</p>
      <ul>
        <li><strong>Unternehmen:</strong> ${businessName || businessId}</li>
        <li><strong>ID:</strong> ${businessId}</li>
        <li><strong>Link:</strong> <a href="https://www.winterberg-verzeichnis.de">Verzeichnis aufrufen</a></li>
      </ul>
      <p><strong>Gemeldeter Fehler:</strong></p>
      <blockquote style="background: #f9f9f9; padding: 15px; border-left: 4px solid #F2761B;">
        ${message.replace(/\n/g, '<br>')}
      </blockquote>
      <p>Bitte logge dich ins Admin-Dashboard ein, um dies zu überprüfen.</p>
    `;

    // Send to both admin emails
    await sendMail({
      to: 'simon.kraeling@sichtbar-online.com, info@sichtbar-online.com',
      subject: `Fehlermeldung: ${businessName || businessId}`,
      html: emailHtml
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error in report-error API:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
