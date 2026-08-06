import admin from 'firebase-admin';

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });
  } catch (error) {
    console.error('Firebase admin initialization error', error);
  }
}

const db = admin.firestore();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { id, data } = req.body;

    if (!id || !data) {
      return res.status(400).json({ error: 'Missing id or data' });
    }

    const docRef = db.collection('businesses').doc(id);
    await docRef.set(data, { merge: true });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error creating business:', error);
    return res.status(500).json({ error: error.message });
  }
}
