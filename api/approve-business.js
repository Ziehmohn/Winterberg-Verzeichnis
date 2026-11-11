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
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ error: 'Missing id' });
    }
    
    if (!getApps().length) {
      return res.status(500).json({ error: 'Firebase Admin not initialized. Please check FIREBASE_SERVICE_ACCOUNT in Vercel.' });
    }

    const db = getFirestore('ai-studio-winterberguntern-dcab9b4d-c8de-4204-84d9-91f84061f319');
    const docRef = db.collection('businesses').doc(id);
    
    // Hole die Daten des Unternehmens für die Benachrichtigung
    const docSnap = await docRef.get();
    if (!docSnap.exists) {
      return res.status(404).json({ error: 'Business not found' });
    }
    const data = docSnap.data();

    // Status auf approved setzen und isActive auf true
    await docRef.update({ 
      status: 'approved',
      isActive: true 
    });

    // Version in system/metadata bumpen, damit ALLE Clients weltweit (inkl. Suche) sofort aktualisiert werden
    const newVersion = Date.now();
    try {
      await db.collection('system').doc('metadata').set({
        businessesUpdatedAt: newVersion
      }, { merge: true });
      console.log(`[Metadata] businessesUpdatedAt erfolgreich auf ${newVersion} gesetzt`);
    } catch (metaErr) {
      console.error('Fehler beim Aktualisieren der Metadaten in Firestore:', metaErr);
    }

    // E-Mail an Kunden senden, falls E-Mail vorhanden
    const customerEmail = data?.email || data?.ownerEmail;
    if (customerEmail) {
      try {
        await sendMail({
          to: customerEmail,
          subject: `Ihr Eintrag im Winterberg Verzeichnis ist nun online!`,
          html: `
            <div style="font-family: Arial, sans-serif; color: #1B211D; max-width: 600px; line-height: 1.6;">
              <h2 style="color: #0F4C2E;">Gute Neuigkeiten!</h2>
              <p>Hallo,</p>
              <p>Ihr Unternehmenseintrag für <strong>${data?.name || 'Ihr Unternehmen'}</strong> wurde soeben geprüft und freigeschaltet.</p>
              <p>Er ist nun öffentlich im Winterberg Verzeichnis aufgeführt, in der Volltextsuche auffindbar und auf der interaktiven Karte sichtbar.</p>
              <p style="margin: 25px 0;">
                <a href="https://www.winterberg-verzeichnis.de" style="background-color: #0F4C2E; color: #ffffff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; display: inline-block;">
                  Zum Winterberg Verzeichnis
                </a>
              </p>
              <p>Viele Grüße,<br>Ihr Team vom Winterberg Verzeichnis</p>
            </div>
          `
        });
        console.log(`[Approve] Freischalt-Mail erfolgreich an Kunden versendet: ${customerEmail}`);
      } catch (mailError) {
        console.error('Fehler beim Senden der Bestätigungs-E-Mail an den Kunden:', mailError);
      }
    }

    return res.status(200).json({ success: true, version: newVersion });
  } catch (error) {
    console.error('Error approving business:', error);
    return res.status(500).json({ error: error.message });
  }
}
