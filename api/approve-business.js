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
    
    // Hole die E-Mail des Unternehmens für die Benachrichtigung
    const docSnap = await docRef.get();
    const data = docSnap.data();

    // Status auf approved setzen
    await docRef.update({ status: 'approved' });

    // E-Mail an Kunden senden, falls E-Mail vorhanden
    if (data?.email || data?.ownerEmail) {
      const customerEmail = data.email || data.ownerEmail;
      try {
        await sendMail({
          to: customerEmail,
          subject: 'Ihr Eintrag im Winterberg Verzeichnis ist nun online!',
          html: `
            <h3>Gute Neuigkeiten!</h3>
            <p>Hallo,</p>
            <p>Ihr Unternehmenseintrag für <strong>${data.name || 'Ihr Unternehmen'}</strong> wurde soeben geprüft und freigeschaltet.</p>
            <p>Er ist nun öffentlich im Winterberg Verzeichnis sichtbar.</p>
            <br/>
            <p>Viele Grüße,</p>
            <p>Ihr Winterberg Verzeichnis Team</p>
          `
        });
      } catch (mailError) {
        console.error('Fehler beim Senden der Bestätigungs-E-Mail an den Kunden:', mailError);
      }
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error approving business:', error);
    return res.status(500).json({ error: error.message });
  }
}
