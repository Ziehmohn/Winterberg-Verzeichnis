import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
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

function escapeHtml(text) {
  if (!text) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export default async function handler(req, res) {
  // Sync users logic
  if (req.query.sync === 'true') {
    try {
      const db = getFirestore();
      const auth = getAuth();
      let synced = 0;
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
      return res.status(200).json({ success: true, message: `Synced ${synced} missing users to Firestore.` });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!getApps().length) {
    return res.status(500).json({ error: 'Firebase Admin not initialized. Please check FIREBASE_SERVICE_ACCOUNT in Vercel.' });
  }

  // Check if this is a review submission (from submit-review or action === 'submit')
  if (req.body?.review || req.body?.action === 'submit') {
    try {
      const { businessId, review, businessData, lang = 'de' } = req.body || {};

      if (!businessId || !review || !review.id) {
        return res.status(400).json({ error: 'Missing businessId or review' });
      }

      const db = getFirestore('ai-studio-winterberguntern-dcab9b4d-c8de-4204-84d9-91f84061f319');
      const docRef = db.collection('businesses').doc(String(businessId));
      const docSnap = await docRef.get();

      // Prepare review object with pending status
      const reviewToSave = {
        ...review,
        businessId: String(businessId),
        status: 'pending',
        date: review.date || new Date().toISOString()
      };

      let targetBusinessName = businessData?.name || `Unternehmen ${businessId}`;
      let targetEmail = businessData?.ownerEmail || businessData?.email || businessData?.contactPerson?.email;
      let emailNotifications = businessData?.emailNotifications !== false;
      let isClaimed = !!(businessData?.ownerId || businessData?.ownerEmail);

      if (docSnap.exists) {
        const existingData = docSnap.data() || {};
        targetBusinessName = existingData.name || targetBusinessName;
        targetEmail = existingData.ownerEmail || existingData.email || existingData.contactPerson?.email || targetEmail;
        emailNotifications = existingData.emailNotifications !== false;
        isClaimed = !!(existingData.ownerId || existingData.ownerEmail);

        const existingReviews = Array.isArray(existingData.reviews) ? existingData.reviews : [];
        const filtered = existingReviews.filter(r => r.id !== reviewToSave.id);
        filtered.push(reviewToSave);

        await docRef.update({ reviews: filtered });
      } else {
        const initialData = businessData ? { ...businessData } : {};
        initialData.id = String(businessId);
        initialData.reviews = [reviewToSave];
        if (initialData.isActive === undefined) initialData.isActive = true;
        if (initialData.status === undefined) initialData.status = 'approved';

        await docRef.set(initialData, { merge: true });
      }

      const version = Date.now();
      try {
        await db.collection('system').doc('metadata').set({
          businessesUpdatedAt: version
        }, { merge: true });
      } catch (metaErr) {
        console.warn('Could not update system/metadata:', metaErr);
      }

      if (emailNotifications) {
        try {
          const isNl = lang === 'nl';
          const starsHtml = '★'.repeat(Math.min(5, Math.max(1, reviewToSave.rating || 5))) + '☆'.repeat(Math.max(0, 5 - (reviewToSave.rating || 5)));
          const profileUrl = `https://www.winterberg-verzeichnis.de/unternehmen/${encodeURIComponent(businessId)}`;
          const destinationEmail = targetEmail || 'info@sichtbar-online.com';
          const isOwnerKnown = !!targetEmail;

          const subject = isNl
            ? `Nieuwe beoordeling voor ${targetBusinessName} (${reviewToSave.rating} sterren) - Winterberg Verzeichnis`
            : `Neue Kundenbewertung für ${targetBusinessName} (${reviewToSave.rating} Sterne) - Das Winterberg Verzeichnis`;

          const html = `
            <div style="font-family: Arial, sans-serif; color: #1B211D; line-height: 1.5; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #EDE8E0; border-radius: 8px;">
              <h2 style="color: #0F4C2E; margin-top: 0;">${isNl ? 'Nieuwe beoordeling ontvangen' : 'Neue Kundenbewertung eingegangen'}</h2>
              <p>Hallo ${escapeHtml(targetBusinessName)},</p>
              <p>${isNl ? 'een bezoeker heeft een nieuwe beoordeling geplaatst op het <strong>Winterberg Verzeichnis</strong>:' : 'ein Besucher hat im <strong>Winterberg Verzeichnis</strong> eine neue Bewertung abgegeben:'}</p>
              
              <div style="background-color: #FAF8F5; border-left: 4px solid #F2761B; padding: 14px 18px; margin: 18px 0; border-radius: 4px;">
                <div style="color: #F2761B; font-size: 18px; letter-spacing: 2px; margin-bottom: 6px;">${starsHtml} (${reviewToSave.rating}/5 Sterne)</div>
                ${reviewToSave.text ? `<p style="margin: 0; font-size: 15px; color: #1B211D; font-style: italic;">„${escapeHtml(reviewToSave.text)}“</p>` : `<p style="margin: 0; font-size: 13px; color: #8A928B; font-style: italic;">(Sterne-Bewertung ohne Textbericht)</p>`}
                <p style="margin: 8px 0 0 0; font-size: 12px; color: #5F6B63;">${isNl ? 'Gegeven door:' : 'Verfasst von:'} ${escapeHtml(reviewToSave.authorName || 'Besucher')}</p>
              </div>

              <p>${isNl ? 'U kunt de vermelding bekijken op het portaal:' : 'Prüfen und verwalten Sie die Bewertung im Portal:'}</p>
              <div style="margin: 22px 0;">
                <a href="${profileUrl}" style="background-color: #0F4C2E; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold; display: inline-block;">
                  ${isNl ? 'Vermelding bekijken &rarr;' : 'Zum Unternehmensprofil &rarr;'}
                </a>
              </div>
              
              <hr style="border: 0; border-top: 1px solid #EDE8E0; margin: 25px 0;" />
              <p style="font-size: 11px; color: #8A928B; line-height: 1.4;">
                Winterberg Verzeichnis · info@sichtbar-online.com
              </p>
            </div>
          `;

          await sendMail({
            to: destinationEmail,
            bcc: isOwnerKnown ? 'info@sichtbar-online.com' : undefined,
            subject,
            html
          });
        } catch (mailErr) {
          console.error('Fehler beim E-Mail-Versand der Bewertung:', mailErr);
        }
      }

      return res.status(200).json({ success: true, review: reviewToSave, version });
    } catch (error) {
      console.error('Error submitting review:', error);
      return res.status(500).json({ error: error.message });
    }
  }

  // Manage review logic (approve, reject, delete, reply)
  try {
    const { businessId, reviewId, action, replyText } = req.body || {};

    if (!businessId || !reviewId || !action) {
      return res.status(400).json({ error: 'Missing businessId, reviewId, or action' });
    }

    if (!['approve', 'reject', 'delete', 'reply'].includes(action)) {
      return res.status(400).json({ error: 'Invalid action' });
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
