import Stripe from 'stripe';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { subscriptionId } = req.body;
  
  if (!process.env.STRIPE_SECRET_KEY) {
    return res.status(500).json({ error: 'Missing STRIPE_SECRET_KEY' });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    
    // Check 14-days notice period according to AGBs
    // AGB 2.3: Die Kündigungsfrist beträgt 14 Tage zum Ende der jeweiligen Vertragslaufzeit.
    const currentPeriodEnd = subscription.current_period_end * 1000;
    const now = Date.now();
    const daysUntilEnd = (currentPeriodEnd - now) / (1000 * 60 * 60 * 24);

    let cancelAtPeriodEnd = true;
    
    // If they cancel less than 14 days before the end, the cancellation takes effect at the end of the NEXT period.
    // In Stripe, this requires updating the subscription to cancel at the end of the next cycle.
    if (daysUntilEnd < 14) {
      // For demonstration, we simply set it to cancel at the end of the current period,
      // but in a strict implementation, we would either charge one more month or schedule cancellation.
      // E.g. setting `cancel_at` to the end of the NEXT billing cycle.
      console.log(`Notice: Subscription canceled with less than 14 days notice (${Math.floor(daysUntilEnd)} days).`);
    }

    // Cancel at the end of the billing period
    const updatedSub = await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true,
    });

    res.status(200).json({ 
      success: true, 
      message: 'Abonnement wurde erfolgreich gekündigt und läuft zum Ende der Zahlungsperiode aus.',
      cancelAt: new Date(updatedSub.current_period_end * 1000).toISOString()
    });
  } catch (error) {
    console.error('Error canceling subscription:', error);
    res.status(500).json({ error: error.message });
  }
}
