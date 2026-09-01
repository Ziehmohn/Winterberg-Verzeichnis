import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import Stripe from 'stripe';

let stripeClient: Stripe | null = null;
function getStripe(): Stripe {
  if (!stripeClient) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      throw new Error('STRIPE_SECRET_KEY environment variable is required');
    }
    stripeClient = new Stripe(key);
  }
  return stripeClient;
}


const PROJECT_ID = 'gen-lang-client-0671429103';
let redirectsMap = new Map<string, string>();

async function fetchRedirects() {
  try {
    const res = await fetch(`https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/redirects`);

    const data = await res.json();
    const newMap = new Map<string, string>();
    if (data.documents) {
      data.documents.forEach((doc: any) => {
        const source = doc.fields.source?.stringValue;
        const target = doc.fields.target?.stringValue;
        if (source && target) {
          newMap.set(source, target);
        }
      });
    }
    redirectsMap = newMap;
    console.log("Redirects loaded:", redirectsMap.size);
  } catch(e) {
    console.error("Error fetching redirects", e);
  }
}

fetchRedirects();
setInterval(fetchRedirects, 60000);


async function startServer() {
  const app = express();
  const PORT = 3000;


  app.post('/api/refresh-redirects', (req, res) => {
    fetchRedirects();
    res.json({ success: true });
  });

  // Security Headers Middleware
  app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(self)');
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
    res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.googleapis.com https://*.firebaseio.com https://js.stripe.com https://cdnjs.cloudflare.com https://www.googletagmanager.com https://www.google-analytics.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: blob: https: https://www.google-analytics.com https://stats.g.doubleclick.net; connect-src 'self' https: wss: https://www.google-analytics.com https://stats.g.doubleclick.net; frame-src 'self' https://js.stripe.com https://hooks.stripe.com https://www.google.com; worker-src 'self' blob:; object-src 'none'; base-uri 'self';");
    next();
  });

  // Redirect Middleware
  app.use((req, res, next) => {
    const target = redirectsMap.get(req.path);
    if (target) {
      return res.redirect(301, target);
    }
    next();
  });


  app.use(express.json());

  // Helper to parse price string to number
  const parsePriceNum = (str: any): number => {
    if (!str) return 0;
    const cleaned = String(str).replace(/[^0-9,.]/g, '').replace(',', '.');
    return parseFloat(cleaned) || 0;
  };

  // API Routes
  app.post('/api/create-checkout-session', async (req, res) => {
    try {
      const { businessId, email, billingCycle, ownerId, ownerEmail } = req.body || {};
      
      if (!businessId) {
        return res.status(400).json({ error: 'businessId ist erforderlich.' });
      }

      const stripe = getStripe();
      const origin = req.headers.origin || process.env.APP_URL || `http://localhost:${PORT}`;

      const isYearly = billingCycle === 'yearly';
      const cycle = isYearly ? 'yearly' : 'monthly';

      // Fetch dynamic pricing settings from Firestore
      let pricing: any = null;
      try {
        const pricingRes = await fetch(`https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/settings/pricing`);
        if (pricingRes.ok) {
          const doc = await pricingRes.json();
          if (doc.fields) {
            pricing = {
              premiumMonthly: doc.fields.premiumMonthly?.stringValue || '12,95 €',
              premiumYearly: doc.fields.premiumYearly?.stringValue || '9,95 €',
              isOfferActive: doc.fields.isOfferActive?.booleanValue ?? false,
              offerMonthlyPrice: doc.fields.offerMonthlyPrice?.stringValue,
              offerYearlyPrice: doc.fields.offerYearlyPrice?.stringValue,
              offerStartDate: doc.fields.offerStartDate?.stringValue,
              offerEndDate: doc.fields.offerEndDate?.stringValue,
            };
          }
        }
      } catch (e) {
        console.warn('Could not fetch pricing from Firestore, using default PRICING', e);
      }

      // Check if offer is currently active
      let isOffer = false;
      if (pricing?.isOfferActive) {
        isOffer = true;
        const now = new Date();
        if (pricing.offerStartDate) {
          const start = new Date(pricing.offerStartDate);
          start.setHours(0, 0, 0, 0);
          if (now < start) isOffer = false;
        }
        if (pricing.offerEndDate) {
          const end = new Date(pricing.offerEndDate);
          end.setHours(23, 59, 59, 999);
          if (now > end) isOffer = false;
        }
      }

      const regularMonthlyNum = parsePriceNum(pricing?.premiumMonthly || '12,95 €');
      const regularYearlyPerMonthNum = parsePriceNum(pricing?.premiumYearly || '9,95 €');
      const regularYearlyTotalNum = regularYearlyPerMonthNum * 12;

      const offerMonthlyNum = pricing?.offerMonthlyPrice ? parsePriceNum(pricing.offerMonthlyPrice) : regularMonthlyNum;
      const offerYearlyPerMonthNum = pricing?.offerYearlyPrice ? parsePriceNum(pricing.offerYearlyPrice) : regularYearlyPerMonthNum;
      const offerYearlyTotalNum = offerYearlyPerMonthNum * 12;

      // Regular recurring price (in cents)
      const regularUnitAmount = Math.round((isYearly ? regularYearlyTotalNum : regularMonthlyNum) * 100);
      const activeFirstPeriodAmount = Math.round((isYearly ? (isOffer ? offerYearlyTotalNum : regularYearlyTotalNum) : (isOffer ? offerMonthlyNum : regularMonthlyNum)) * 100);

      // If an introductory discount applies to the 1st period, create a one-time coupon
      const discounts: Stripe.Checkout.SessionCreateParams.Discount[] = [];
      if (isOffer && regularUnitAmount > activeFirstPeriodAmount) {
        const discountAmountCents = regularUnitAmount - activeFirstPeriodAmount;
        const coupon = await stripe.coupons.create({
          amount_off: discountAmountCents,
          currency: 'eur',
          duration: 'once',
          name: isYearly ? 'Aktionsrabatt 1. Jahr' : 'Aktionsrabatt 1. Monat',
        });
        discounts.push({ coupon: coupon.id });
      }
      
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card', 'sepa_debit', 'paypal'],
        line_items: [
          {
            price_data: {
              currency: 'eur',
              product_data: {
                name: 'Premium Eintrag - Winterberg Verzeichnis',
                description: isYearly
                  ? `Premium Eintrag - 1 Jahr (danach regulär ${(regularYearlyTotalNum).toFixed(2).replace('.', ',')} € / Jahr netto)`
                  : `Premium Eintrag - monatlich kündbar (danach regulär ${regularMonthlyNum.toFixed(2).replace('.', ',')} € / Monat netto)`,
              },
              unit_amount: isOffer && activeFirstPeriodAmount > regularUnitAmount ? activeFirstPeriodAmount : regularUnitAmount,
              recurring: {
                interval: isYearly ? 'year' : 'month',
              },
            },
            quantity: 1,
          },
        ],
        mode: 'subscription',
        ...(discounts.length > 0 ? { discounts } : {}),
        billing_address_collection: 'required',
        tax_id_collection: {
          enabled: true,
        },
        allow_promotion_codes: discounts.length === 0,
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

      return res.json({ url: session.url });
    } catch (error: any) {
      console.error('Error creating checkout session:', error);
      return res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
  });

  app.post('/api/cancel-subscription', async (req, res) => {
    try {
      const { subscriptionId } = req.body || {};
      if (!subscriptionId) {
        return res.status(400).json({ error: 'subscriptionId ist erforderlich.' });
      }

      const stripe = getStripe();
      const subscription = await stripe.subscriptions.retrieve(subscriptionId);
      
      if (subscription.status === 'canceled') {
        return res.json({
          success: true,
          message: 'Dieses Abonnement ist bereits gekündigt.',
          cancelAt: subscription.canceled_at ? new Date(subscription.canceled_at * 1000).toISOString() : new Date().toISOString()
        });
      }

      const updatedSub = await stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: true,
      });

      const currentPeriodEnd = updatedSub.current_period_end ? new Date(updatedSub.current_period_end * 1000).toLocaleDateString('de-DE') : 'Ablauf der Periode';

      return res.json({ 
        success: true, 
        message: `Abonnement wurde erfolgreich gekündigt und läuft zum ${currentPeriodEnd} aus.`,
        cancelAt: new Date((updatedSub.current_period_end || Math.floor(Date.now() / 1000)) * 1000).toISOString()
      });
    } catch (error: any) {
      console.error('Error canceling subscription:', error);
      return res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Enable serving static files from dist
    const distPath = path.join(process.cwd(), 'dist');

    // First check if a static file exists (including prerendered index.html in subfolders)
    app.use(express.static(distPath));

    // Fallback to the SPA index.html for any unmatched routes
    app.use((req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
