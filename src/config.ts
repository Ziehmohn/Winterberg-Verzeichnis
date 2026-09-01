/**
 * SITE_CONFIG – Zentrale Konfigurationsdatei
 * ============================================
 * Alle Werte, die früher an mehreren Stellen hardgecodet waren,
 * sind hier gebündelt. Ändere einen Wert hier – er greift überall.
 */

// ---------------------------------------------------------------------------
// Betreiber & Impressumsangaben
// ---------------------------------------------------------------------------
export const OPERATOR = {
  /** Vollständiger Firmenname */
  name: 'SICHTBAR SEO – Simon Kräling',
  /** Kurzname (für Fließtext) */
  shortName: 'SICHTBAR SEO Simon Kräling',
  /** Straße + Hausnummer */
  street: 'Schanzenstraße 28',
  /** PLZ */
  zip: '59955',
  /** Ort */
  city: 'Winterberg',
  /** Vollständige einzeilige Adresse */
  get address() { return `${this.street}, ${this.zip} ${this.city}`; },
  /** Telefon */
  phone: '+49 1520 654 29 96',
  /** E-Mail */
  email: 'info@sichtbar-online.com',
  /** Umsatzsteuer-ID */
  vatId: 'DE336471774',
  /** Website des Betreibers */
  website: 'https://sichtbar-online.com',
} as const;

// ---------------------------------------------------------------------------
// Portal-Metadaten
// ---------------------------------------------------------------------------
export const SITE = {
  /** Offizieller Portalname */
  name: 'Das Winterberg Verzeichnis',
  /** Kurzname (ohne Artikel) */
  shortName: 'Winterberg Verzeichnis',
  /** Niederländische Variante */
  nameNl: 'Het Winterberg Overzicht',
  /** Kanonische Basis-URL (kein abschließender Slash) */
  baseUrl: 'https://www.winterberg-verzeichnis.de',
  /** Stadt */
  city: 'Winterberg',
  /** PLZ */
  zip: '59955',
  /** Region */
  region: 'Hochsauerlandkreis, NRW, Deutschland',
  /** Google Search Console Verification Token */
  googleSiteVerification: 'eD2M5X0XpFemq843s7x3232ic58ogimCDB6zWKPN_u8',
  /** Alle Ortsteile */
  districts: [
    'Winterberg (Kernstadt)',
    'Altastenberg',
    'Altenbüren',
    'Elkeringhausen',
    'Grönebach',
    'Hildfeld',
    'Hoheleye',
    'Langewiese',
    'Lenneplätze',
    'Mollseifen',
    'Neuastenberg',
    'Niedersfeld',
    'Siedlinghausen',
    'Silbach',
    'Züschen',
  ],
  get districtCount() { return this.districts.length; },
} as const;

// ---------------------------------------------------------------------------
// Preise & Konditionen
// ---------------------------------------------------------------------------
export const PRICING = {
  /** Monatspreis Premium (monatliche Zahlung) */
  premiumMonthly: '12,95 €',
  /** Monatspreis Premium (jährliche Zahlung) */
  premiumYearly: '9,95 €',
  /** Jahresgesamtbetrag bei Jahreszahlung */
  premiumYearlyTotal: '119,40 € / Jahr',

  /** Banner-Preis Stufe 1 (1–2 Kategorien) */
  bannerTier1: '24,95 €',
  /** Banner-Preis Stufe 2 (ab 3 Kategorien) */
  bannerTier2: '19,95 €',
  /** Banner-Preis Stufe 3 (ab 5 Kategorien) */
  bannerTier3: '14,95 €',
  /** Rabatt Stufe 2 */
  bannerTier2Discount: '20% Rabatt',
  /** Rabatt Stufe 3 */
  bannerTier3Discount: '40% Rabatt',

  /** Kündigungsfrist (Text) */
  cancellationPeriod: '14 Tage',
  /** Zahlungsanbieter */
  paymentProvider: 'Stripe',
} as const;

// ---------------------------------------------------------------------------
// Werbetexte (CTA)
// ---------------------------------------------------------------------------
export const AD_CTA = 'Sie möchten hier werben? Mehr erfahren!';
