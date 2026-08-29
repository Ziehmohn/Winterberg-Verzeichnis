import Stripe from 'stripe';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { subscriptionId } = req.body || {};
  
  if (!subscriptionId) {
    return res.status(400).json({ error: 'subscriptionId ist erforderlich.' });
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return res.status(500).json({ error: 'Missing STRIPE_SECRET_KEY environment variable.' });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    
    if (subscription.status === 'canceled') {
      return res.status(200).json({
        success: true,
        message: 'Dieses Abonnement ist bereits gekündigt.',
        cancelAt: subscription.canceled_at ? new Date(subscription.canceled_at * 1000).toISOString() : new Date().toISOString()
      });
    }

    // Cancel at the end of the billing period
    const updatedSub = await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true,
    });

    const currentPeriodEnd = updatedSub.current_period_end ? new Date(updatedSub.current_period_end * 1000).toLocaleDateString('de-DE') : 'Ablauf der Periode';

    return res.status(200).json({ 
      success: true, 
      message: `Abonnement wurde erfolgreich gekündigt und läuft zum ${currentPeriodEnd} aus.`,
      cancelAt: new Date((updatedSub.current_period_end || Math.floor(Date.now() / 1000)) * 1000).toISOString()
    });
  } catch (error) {
    console.error('Error canceling subscription:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}
