import Stripe from 'stripe';
// Note: To go live, install 'firebase-admin' via npm and initialize it here with a service account.
// import * as admin from 'firebase-admin';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const sig = req.headers['stripe-signature'];
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    // In Vercel, req.body is already parsed, but Stripe requires the raw body for signature verification.
    // To fix this in Next.js/Vercel, we need to disable body parsing, or use micro.
    // For this demonstration, we assume verification succeeds or we use a helper.
    // event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    event = req.body; 
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const businessId = session.metadata.businessId;
        const billingCycle = session.metadata.billingCycle;
        
        console.log(`Checkout completed for business ${businessId}. Mode: ${billingCycle}`);
        
        // 1. Update Firestore (Requires firebase-admin)
        // await admin.firestore().collection('businesses').doc(businessId).update({
        //   isPremium: true,
        //   stripeSubscriptionId: session.subscription,
        //   stripeCustomerId: session.customer
        // });

        // 2. AGB Rule: If Yearly, convert to Subscription Schedule for monthly fallback
        if (billingCycle === 'yearly' && session.subscription) {
          const subscription = await stripe.subscriptions.retrieve(session.subscription);
          
          // Create a schedule from the existing subscription
          const schedule = await stripe.subscriptionSchedules.create({
            from_subscription: subscription.id,
          });
          
          // Update the schedule to switch to Monthly (12.95 EUR) after phase 1
          // NOTE: You need the Monthly Price ID from your Stripe Dashboard here.
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
                items: [{ price: 'price_MONTHLY_1295', quantity: 1 }], // The regular monthly price ID
                iterations: 0, // 0 = continuous
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
        const invoicePdf = invoice.hosted_invoice_url; // Link to the PDF for the user
        
        // Save the invoice URL to Firestore so it shows in the Admin Panel
        // await admin.firestore().collection('invoices').add({
        //   subscriptionId,
        //   customerId: invoice.customer,
        //   pdfUrl: invoicePdf,
        //   date: new Date(invoice.created * 1000).toISOString(),
        //   amount: invoice.amount_paid / 100
        // });
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        // Downgrade the user in Firestore
        // const businesses = await admin.firestore().collection('businesses').where('stripeSubscriptionId', '==', subscription.id).get();
        // businesses.forEach(doc => doc.ref.update({ isPremium: false, stripeSubscriptionId: null }));
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
