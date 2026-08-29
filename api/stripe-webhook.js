import Stripe from 'stripe';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { buffer } from 'micro';
import { sendMail } from './_mail.js';

// Initialize Firebase Admin
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

// Disable Next.js / Vercel body parser so we get raw body for Stripe signature verification
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    console.error('Missing STRIPE_SECRET_KEY');
    return res.status(500).json({ error: 'STRIPE_SECRET_KEY is not configured.' });
  }

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    console.error('Missing STRIPE_WEBHOOK_SECRET');
    return res.status(500).json({ error: 'STRIPE_WEBHOOK_SECRET is not configured.' });
  }

  const sig = req.headers['stripe-signature'];
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    const rawBody = await buffer(req);
    event = stripe.webhooks.constructEvent(rawBody, sig, endpointSecret);
  } catch (err) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  const db = getFirestore('ai-studio-winterberguntern-dcab9b4d-c8de-4204-84d9-91f84061f319');

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const businessId = session.metadata?.businessId || session.client_reference_id;
        const billingCycle = session.metadata?.billingCycle || 'monthly';
        const ownerId = session.metadata?.ownerId;
        const ownerEmail = session.metadata?.ownerEmail;
        
        if (businessId) {
          const docRef = db.collection('businesses').doc(businessId);
          const docSnap = await docRef.get();
          const busName = docSnap.exists ? docSnap.data().name : 'Unbekanntes Unternehmen';

          console.log(`Checkout completed for business ${businessId} (${busName}). Mode: ${billingCycle}`);
          
          await docRef.update({
            status: 'approved',
            isPremium: true,
            stripeSubscriptionId: session.subscription || null,
            stripeCustomerId: session.customer || null,
            subscriptionStatus: 'active',
            billingCycle: billingCycle,
            cancelAtPeriodEnd: false,
            ...(ownerId ? { ownerId } : {}),
            ...(ownerEmail ? { ownerEmail } : {})
          });

          try {
            await sendMail({
              to: 'simon.kraeling@sichtbar-online.com, info@sichtbar-online.com',
              subject: `Zahlung erhalten: ${busName}`,
              html: `
                <h3>Neue Zahlung eingegangen</h3>
                <p>Ein Kunde hat soeben für das Unternehmen <strong>${busName}</strong> (ID: ${businessId}) bezahlt.</p>
                <p><strong>Tarif:</strong> Premium (${billingCycle === 'yearly' ? 'Jährlich (119,40 €/Jahr)' : 'Monatlich (12,95 €/Monat)'})</p>
                <p>Der Eintrag wurde automatisch auf <strong>Premium</strong> hochgestuft.</p>
              `
            });
          } catch (mailError) {
            console.error('Fehler beim Senden der Admin-E-Mail (Stripe Webhook):', mailError);
          }
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        const businesses = await db.collection('businesses').where('stripeSubscriptionId', '==', subscription.id).get();
        
        if (!businesses.empty) {
          const batch = db.batch();
          const isActive = subscription.status === 'active' || subscription.status === 'trialing';
          const cancelAtPeriodEnd = subscription.cancel_at_period_end || false;
          const cancelAt = subscription.cancel_at ? new Date(subscription.cancel_at * 1000).toISOString() : null;

          businesses.forEach(doc => {
            batch.update(doc.ref, {
              isPremium: isActive,
              subscriptionStatus: subscription.status,
              cancelAtPeriodEnd: cancelAtPeriodEnd,
              ...(cancelAt ? { cancelAt } : {})
            });
          });
          await batch.commit();
          console.log(`Subscription ${subscription.id} updated: status=${subscription.status}, cancelAtPeriodEnd=${cancelAtPeriodEnd}`);
        }
        break;
      }
      
      case 'invoice.payment_succeeded': {
        const invoice = event.data.object;
        const subscriptionId = invoice.subscription;
        const invoicePdf = invoice.hosted_invoice_url || invoice.invoice_pdf;
        
        if (subscriptionId) {
          await db.collection('invoices').add({
            subscriptionId,
            customerId: invoice.customer,
            customerEmail: invoice.customer_email || null,
            pdfUrl: invoicePdf || null,
            date: new Date((invoice.created || Math.floor(Date.now() / 1000)) * 1000).toISOString(),
            amount: (invoice.amount_paid || 0) / 100,
            currency: invoice.currency || 'eur',
            status: 'paid'
          });
          console.log(`Invoice saved for subscription ${subscriptionId}`);
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        const businesses = await db.collection('businesses').where('stripeSubscriptionId', '==', subscription.id).get();
        
        if (!businesses.empty) {
          const batch = db.batch();
          businesses.forEach(doc => {
            batch.update(doc.ref, {
              isPremium: false,
              subscriptionStatus: 'canceled',
              stripeSubscriptionId: FieldValue.delete()
            });
          });
          await batch.commit();
          console.log(`Subscription ${subscription.id} deleted. Businesses set to isPremium: false.`);
        }
        break;
      }

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return res.status(200).json({ received: true });
  } catch (err) {
    console.error('Webhook processing error:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
