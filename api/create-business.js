import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { sendMail } from './_mail.js';

if (!getApps().length) {
  try {
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
      initializeApp({
        credential: cert(serviceAccount)
      });
    } else {
      console.warn("FIREBASE_SERVICE_ACCOUNT environment variable is missing.");
    }
  } catch (error) {
    console.error('Firebase Admin initialization error:', error);
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { id, data } = req.body;

    if (!id || !data) {
      return res.status(400).json({ error: 'Missing id or data' });
    }
    
    if (!getApps().length) {
      return res.status(500).json({ error: 'Firebase Admin not initialized. Please check FIREBASE_SERVICE_ACCOUNT in Vercel.' });
    }

    const db = getFirestore('ai-studio-winterberguntern-dcab9b4d-c8de-4204-84d9-91f84061f319');
    const docRef = db.collection('businesses').doc(id);
    await docRef.set({
      ...data,
      status: data.status || 'pending',
      isActive: data.isActive !== false
    }, { merge: true });

    // Bump remote version in system/metadata so admins and clients receive the update
    const newVersion = Date.now();
    try {
      await db.collection('system').doc('metadata').set({
        businessesUpdatedAt: newVersion
      }, { merge: true });
      console.log(`[Metadata] businessesUpdatedAt auf ${newVersion} gebumpt (neues Unternehmen eingetragen)`);
    } catch (metaErr) {
      console.error('Fehler beim Aktualisieren der Metadaten in Firestore:', metaErr);
    }

    const customerEmail = data.email || data.ownerEmail;

    // 1. Eingangsbestätigung an den Kunden senden
    if (customerEmail) {
      try {
        await sendMail({
          to: customerEmail,
          bcc: 'info@sichtbar-online.com',
          subject: 'Eingang Ihres Eintrags - Das Winterberg Verzeichnis',
          html: `
            <div style="font-family: Arial, sans-serif; color: #1B211D; max-width: 600px; line-height: 1.6;">
              <h2 style="color: #0F4C2E;">Vielen Dank für Ihre Registrierung!</h2>
              <p>Hallo,</p>
              <p>wir haben Ihren neuen Eintrag für <strong>${data.name}</strong> erhalten.</p>
              <p>Unser Team wird die Angaben in Kürze redaktionell prüfen. Sobald Ihr Unternehmensprofil freigeschaltet wurde, informieren wir Sie umgehend per E-Mail.</p>
              <br/>
              <p>Viele Grüße,<br>Ihr Team vom Winterberg Verzeichnis</p>
            </div>
          `
        });
        console.log(`[CreateBusiness] Eingangsbestätigung an Kunden gesendet: ${customerEmail}`);
      } catch (custMailErr) {
        console.error('Fehler beim Senden der Kunden-Eingangsbestätigung:', custMailErr);
      }
    }

    // 2. Benachrichtigung an den Admin senden
    try {
      await sendMail({
        to: 'info@sichtbar-online.com',
        cc: 'simon.kraeling@sichtbar-online.com',
        subject: `Neues Unternehmen eingetragen: ${data.name}`,
        html: `
          <div style="font-family: Arial, sans-serif; color: #1B211D; max-width: 600px; line-height: 1.6;">
            <h3 style="color: #0F4C2E;">Neues Unternehmen eingetragen</h3>
            <p>Ein neues Unternehmen wurde soeben eingereicht:</p>
            <ul>
              <li><strong>Name:</strong> ${data.name}</li>
              <li><strong>Kategorie:</strong> ${data.category || '-'} ${data.subcategory ? `· ${data.subcategory}` : ''}</li>
              <li><strong>Ortsteil:</strong> ${data.district || '-'}</li>
              <li><strong>Tarif:</strong> ${data.isPremium ? 'Premium' : 'Basis'}</li>
              <li><strong>E-Mail:</strong> ${customerEmail || '-'}</li>
              <li><strong>Telefon:</strong> ${data.phone || '-'}</li>
            </ul>
            <p>Bitte prüfen Sie den Eintrag im Adminbereich und schalten Sie ihn frei.</p>
          </div>
        `
      });
      console.log(`[CreateBusiness] Admin-Benachrichtigung gesendet für ${data.name}`);
    } catch (mailError) {
      console.error('Fehler beim Senden der Admin-E-Mail:', mailError);
    }

    return res.status(200).json({ success: true, version: newVersion });
  } catch (error) {
    console.error('Error creating business:', error);
    return res.status(500).json({ error: error.message });
  }
}
