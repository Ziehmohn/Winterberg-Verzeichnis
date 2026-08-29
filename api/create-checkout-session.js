import Stripe from 'stripe';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { businessId, email, billingCycle, ownerId, ownerEmail } = req.body || {};
  
  if (!businessId) {
    return res.status(400).json({ error: 'businessId ist erforderlich.' });
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return res.status(500).json({ error: 'Missing STRIPE_SECRET_KEY environment variable. Please add it to your Vercel project.' });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const origin = req.headers.origin || (req.headers.host ? `https://${req.headers.host}` : (process.env.APP_URL || 'https://www.winterberg-verzeichnis.de'));

  try {
    const isYearly = billingCycle === 'yearly';
    const cycle = isYearly ? 'yearly' : 'monthly';
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'sepa_debit', 'paypal'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: 'Premium Eintrag - Winterberg Verzeichnis',
              description: isYearly ? 'Premium Eintrag - 1 Jahr (danach mtl. 12,95 € netto)' : 'Premium Eintrag - monatlich kündbar (12,95 € netto)',
            },
            unit_amount: isYearly ? 11940 : 1295, // 119.40 EUR or 12.95 EUR
            recurring: {
              interval: isYearly ? 'year' : 'month',
            },
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      billing_address_collection: 'required',
      tax_id_collection: {
        enabled: true,
      },
      allow_promotion_codes: true,
      success_url: `${origin}?session_id={CHECKOUT_SESSION_ID}&success=true`,
      cancel_url: `${origin}?canceled=true`,
      client_reference_id: businessId, 
      customer_email: email || undefined,
      subscription_data: {
        metadata: {
          businessId: businessId,
          billingCycle: cycle,
          ...(ownerId ? { ownerId } : {}),
          ...(ownerEmail ? { ownerEmail } : {})
        }
      },
      metadata: {
        businessId: businessId,
        billingCycle: cycle,
        ...(ownerId ? { ownerId } : {}),
        ...(ownerEmail ? { ownerEmail } : {})
      }
    });

    return res.status(200).json({ url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}
