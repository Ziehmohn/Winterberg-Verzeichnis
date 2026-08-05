import Stripe from 'stripe';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { businessId, email, billingCycle } = req.body;
  
  if (!process.env.STRIPE_SECRET_KEY) {
    return res.status(500).json({ error: 'Missing STRIPE_SECRET_KEY environment variable. Please add it to your Vercel project.' });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const origin = req.headers.origin || `https://${req.headers.host}`;

  try {
    const isYearly = billingCycle === 'yearly';
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'sepa_debit', 'paypal'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: 'Premium Eintrag - Winterberg Verzeichnis',
              description: isYearly ? 'Premium Eintrag - 1 Jahr (danach mtl. 12,95 €)' : 'Premium Eintrag - monatlich kündbar',
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
      success_url: `${origin}?session_id={CHECKOUT_SESSION_ID}&success=true`,
      cancel_url: `${origin}?canceled=true`,
      client_reference_id: businessId, 
      customer_email: email || undefined,
      subscription_data: {
        metadata: {
          businessId: businessId,
          billingCycle: billingCycle
        }
      },
      metadata: {
        businessId: businessId,
        billingCycle: billingCycle
      }
    });

    res.status(200).json({ url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: error.message });
  }
}
