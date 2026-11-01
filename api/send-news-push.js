import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getMessaging } from 'firebase-admin/messaging';

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

  const { title, body, url, icon, imageUrl, testToken } = req.body;

  if (!title || !body) {
    return res.status(400).json({ error: 'Missing title or body' });
  }

  if (!getApps().length) {
    return res.status(500).json({ 
      error: 'Firebase Admin nicht initialisiert. Bitte FIREBASE_SERVICE_ACCOUNT in den Umgebungsvariablen (Vercel) hinterlegen.' 
    });
  }

  try {
    const messaging = getMessaging();
    const db = getFirestore('ai-studio-winterberguntern-dcab9b4d-c8de-4204-84d9-91f84061f319');

    let tokens = [];

    if (testToken) {
      tokens = [testToken];
    } else {
      const snap = await db.collection('push_subscriptions').where('active', '==', true).get();
      tokens = snap.docs.map(doc => doc.data().token).filter(Boolean);
    }

    if (tokens.length === 0) {
      return res.json({ 
        success: true, 
        sentCount: 0, 
        message: 'Keine aktiven Abonnenten gefunden.' 
      });
    }

    const batchSize = 450;
    let successCount = 0;
    let failureCount = 0;
    const tokensToDeactivate = [];

    for (let i = 0; i < tokens.length; i += batchSize) {
      const batchTokens = tokens.slice(i, i + batchSize);
      const response = await messaging.sendEachForMulticast({
        tokens: batchTokens,
        notification: {
          title,
          body,
          imageUrl: imageUrl || undefined
        },
        data: {
          title,
          body,
          url: url || '/news',
          icon: icon || '/pwa-icon-192.png'
        },
        webpush: {
          fcmOptions: {
            link: url || '/news'
          },
          notification: {
            icon: icon || '/pwa-icon-192.png',
            badge: '/favicon.svg'
          }
        }
      });

      successCount += response.successCount;
      failureCount += response.failureCount;

      response.responses.forEach((resp, idx) => {
        if (!resp.success) {
          const errCode = resp.error?.code;
          if (
            errCode === 'messaging/registration-token-not-registered' ||
            errCode === 'messaging/invalid-registration-token'
          ) {
            tokensToDeactivate.push(batchTokens[idx]);
          }
        }
      });
    }

    if (tokensToDeactivate.length > 0) {
      for (const badToken of tokensToDeactivate) {
        const safeDocId = badToken.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 120);
        await db.collection('push_subscriptions').doc(safeDocId).set({ active: false }, { merge: true }).catch(() => {});
      }
    }

    return res.json({
      success: true,
      sentCount: successCount,
      failureCount,
      totalSubscribers: tokens.length
    });
  } catch (error) {
    console.error('Error sending news push notification:', error);
    return res.status(500).json({ error: error.message || 'Fehler beim Senden der Push-Nachricht' });
  }
}
