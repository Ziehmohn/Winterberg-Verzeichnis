import Stripe from 'stripe';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
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

// Disable Next.js body parser so we can get the raw body for Stripe signature verification
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
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
        const businessId = session.metadata?.businessId;
        const billingCycle = session.metadata?.billingCycle;
        
        const docRef = db.collection('businesses').doc(businessId);
        const docSnap = await docRef.get();
        const busName = docSnap.exists ? docSnap.data().name : 'Unbekanntes Unternehmen';

        console.log(`Checkout completed for business ${businessId}. Mode: ${billingCycle}`);
        
        if (businessId) {
          await db.collection('businesses').doc(businessId).update({
            isPremium: true,
            stripeSubscriptionId: session.subscription,
            stripeCustomerId: session.customer
          });
        }

        // Sende E-Mail an Admin
        await sendMail({
          to: 'simon.kraeling@sichtbar-online.com',
          subject: `Zahlung erhalten: ${busName}`,
          html: `
            <h3>Neue Zahlung eingegangen</h3>
            <p>Ein Kunde hat soeben für das Unternehmen <strong>${busName}</strong> (ID: ${businessId}) bezahlt.</p>
            <p>Der Eintrag wurde automatisch auf Premium hochgestuft.</p>
          `
        });
        
        // 2. AGB Rule: If Yearly, convert to Subscription Schedule for monthly fallback
        if (billingCycle === 'yearly' && session.subscription) {
          const subscription = await stripe.subscriptions.retrieve(session.subscription);
          
          // Create a schedule from the existing subscription
          const schedule = await stripe.subscriptionSchedules.create({
            from_subscription: subscription.id,
          });
          
          // Note: If you want this to automatically switch to the monthly price after 1 year, 
          // you need to specify the monthly price ID below. We will leave it commented out
          // until you create the monthly price in Stripe and provide the ID.
          /*
          await stripe.subscriptionSchedules.update(schedule.id, {
            end_behavior: 'release',
            phases: [
              {
                start_date: schedule.current_phase.start_date,
                end_date: schedule.current_phase.end_date,
                items: [{ price: subscription.items.data[0].price.id, quantity: 1 }],
              },
              {
                items: [{ price: 'price_MONTHLY_1295', quantity: 1 }], 
                iterations: 0, 
              }
            ]
          });
          */
        }
        break;
      }
      
      case 'invoice.payment_succeeded': {
        const invoice = event.data.object;
        const subscriptionId = invoice.subscription;
        const invoicePdf = invoice.hosted_invoice_url;
        
        if (subscriptionId) {
          await db.collection('invoices').add({
            subscriptionId,
            customerId: invoice.customer,
            pdfUrl: invoicePdf,
            date: new Date(invoice.created * 1000).toISOString(),
            amount: invoice.amount_paid / 100
          });
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        const businesses = await db.collection('businesses').where('stripeSubscriptionId', '==', subscription.id).get();
        const batch = db.batch();
        businesses.forEach(doc => {
          batch.update(doc.ref, { isPremium: false, stripeSubscriptionId: admin.firestore.FieldValue.delete() });
        });
        await batch.commit();
        break;
      }

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  } catch (err) {
    console.error('Webhook processing error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
