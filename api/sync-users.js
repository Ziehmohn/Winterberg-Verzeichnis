import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

if (!getApps().length) {
  try {
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
      initializeApp({ credential: cert(serviceAccount) });
    }
  } catch (error) {
    console.error('Firebase Admin init error:', error);
  }
}

export default async function handler(req, res) {
  try {
    const db = getFirestore();
    const auth = getAuth();
    let synced = 0;
    
    // Fetch all users from Firebase Auth
    let pageToken;
    do {
      const result = await auth.listUsers(1000, pageToken);
      pageToken = result.pageToken;
      
      for (const user of result.users) {
        const docRef = db.collection('users').doc(user.uid);
        const snap = await docRef.get();
        if (!snap.exists) {
          const nowIso = new Date(user.metadata.creationTime || Date.now()).toISOString();
          let role = 'user';
          if (user.email && user.email.toLowerCase() === 'simon.kraeling@sichtbar-online.com') {
            role = 'admin';
          }
          await docRef.set({
            uid: user.uid,
            email: user.email || null,
            displayName: user.displayName || '',
            role,
            createdAt: nowIso,
            lastLoginAt: new Date(user.metadata.lastSignInTime || Date.now()).toISOString()
          });
          synced++;
        }
      }
    } while (pageToken);

    res.status(200).json({ success: true, message: `Synced ${synced} missing users to Firestore.` });
  } catch (err) {
    console.error('Sync error:', err);
    res.status(500).json({ error: err.message });
  }
}
