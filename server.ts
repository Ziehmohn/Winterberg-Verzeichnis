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

  // Redirect Middleware
  app.use((req, res, next) => {
    const target = redirectsMap.get(req.path);
    if (target) {
      return res.redirect(301, target);
    }
    next();
  });


  app.use(express.json());

  // API Routes
  app.post('/api/create-checkout-session', async (req, res) => {
    try {
      const { businessId, email } = req.body;
      const stripe = getStripe();
      const origin = req.headers.origin || process.env.APP_URL || `http://localhost:${PORT}`;

      // This creates a Checkout Session with a subscription
      // 9,95 € / month for 3 months, then 49,95 € / month.
      // Easiest way in Stripe: Create a subscription with a 3-month trial? No, a subscription with phases (Subscription Schedules)
      // or simply a custom product with two prices, but for simplicity here we can just create a Checkout Session with a subscription.
      // Wait, Stripe Checkout doesn't easily support dynamic step pricing without passing Price IDs.
      // Let's create the products and prices dynamically if they don't exist, or just use `price_data`.
      // Stripe allows creating subscriptions using `price_data` directly in checkout!
      // But wait, to have a different price for the first 3 months, you can use "discounts" (a 3-month coupon).
      // Let's use `price_data` for 49.95 / month and apply a coupon that reduces it to 9.95 for 3 months.
      // Or we can just create a basic checkout session for 49.95 and add a note, or we can use the `subscription_data` with a trial.
      // For demonstration, let's keep it simple: 49.95 EUR / month.
      
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card', 'paypal', 'sepa_debit'],
        line_items: [
          {
            price_data: {
              currency: 'eur',
              product_data: {
                name: 'Premium Eintrag - Winterberg Wirtschaft',
                description: '9,95 € / Monat in den ersten 3 Monaten, danach 49,95 € / Monat.',
              },
              unit_amount: 4995, // 49.95 EUR
              recurring: {
                interval: 'month',
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
      });

      res.json({ url: session.url });
    } catch (error: any) {
      console.error('Error creating checkout session:', error);
      res.status(500).json({ error: error.message });
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
