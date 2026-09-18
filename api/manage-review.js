import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

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
    const { businessId, reviewId, action, replyText } = req.body || {};

    if (!businessId || !reviewId || !action) {
      return res.status(400).json({ error: 'Missing businessId, reviewId, or action' });
    }

    if (!['approve', 'reject', 'delete', 'reply'].includes(action)) {
      return res.status(400).json({ error: 'Invalid action' });
    }

    if (!getApps().length) {
      return res.status(500).json({ error: 'Firebase Admin not initialized. Please check FIREBASE_SERVICE_ACCOUNT in Vercel.' });
    }

    const db = getFirestore('ai-studio-winterberguntern-dcab9b4d-c8de-4204-84d9-91f84061f319');
    const docRef = db.collection('businesses').doc(String(businessId));
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return res.status(404).json({ error: `Business document ${businessId} not found in Firestore` });
    }

    const data = docSnap.data() || {};
    const existingReviews = Array.isArray(data.reviews) ? data.reviews : [];
    let updatedReviews;

    if (action === 'approve') {
      updatedReviews = existingReviews.map(r => r.id === reviewId ? { ...r, status: 'approved' } : r);
    } else if (action === 'reject' || action === 'delete') {
      updatedReviews = existingReviews.filter(r => r.id !== reviewId);
    } else if (action === 'reply') {
      updatedReviews = existingReviews.map(r => r.id === reviewId ? { ...r, ownerReply: replyText || '' } : r);
    }

    await docRef.update({ reviews: updatedReviews });

    // Bump metadata so all clients worldwide detect the change immediately
    const version = Date.now();
    try {
      await db.collection('system').doc('metadata').set({
        businessesUpdatedAt: version
      }, { merge: true });
    } catch (metaErr) {
      console.warn('Could not update system/metadata:', metaErr);
    }

    return res.status(200).json({ success: true, reviews: updatedReviews, version });
  } catch (error) {
    console.error('Error managing review:', error);
    return res.status(500).json({ error: error.message });
  }
}
