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

import { PricingSettings } from './types';

// ---------------------------------------------------------------------------
// Preise & Konditionen (Standard-Fallback)
// ---------------------------------------------------------------------------
export const DEFAULT_PRICING_SETTINGS: PricingSettings = {
  premiumMonthly: '12,95 €',
  premiumYearly: '9,95 €',
  premiumYearlyTotal: '119,40 € / Jahr',

  bannerTier1: '24,95 €',
  bannerTier2: '19,95 €',
  bannerTier3: '14,95 €',
  bannerTier2Discount: '20% Rabatt',
  bannerTier3Discount: '40% Rabatt',

  cancellationPeriod: '14 Tage',

  // Aktion standardmäßig deaktiviert
  isOfferActive: false,
  offerStartDate: '',
  offerEndDate: '',
  offerBadgeText: 'Limitiertes Angebot',
  offerMonthlyPrice: '6,95 €',
  offerYearlyPrice: '4,95 €',
  offerYearlyTotal: '59,40 € / Jahr',
  strikethroughMonthly: '12,95 €',
  strikethroughYearly: '9,95 €',

  // Promo-Zeile (Angebotsleiste über der Menüleiste)
  showRibbon: true,
  ribbonText: '🔥 Limitiertes Angebot: Premium ab 4,95 € / Monat!',
  ribbonLink: '/preise',
  ribbonBgColor: '#F2761B',
  ribbonTextColor: '#FFFFFF'
};

export const PRICING = {
  ...DEFAULT_PRICING_SETTINGS,
  paymentProvider: 'Stripe',
} as const;

/**
 * Prüft, ob ein Angebot aktuell aktiv und innerhalb des konfigurierten Datumsbereichs ist.
 */
export function isPricingOfferActive(pricing?: PricingSettings | null): boolean {
  if (!pricing || !pricing.isOfferActive) return false;

  const now = new Date();
  const todayStr = now.toISOString().split('T')[0]; // "YYYY-MM-DD"

  if (pricing.offerStartDate && pricing.offerStartDate > todayStr) {
    return false; // Noch nicht begonnen
  }

  if (pricing.offerEndDate && pricing.offerEndDate < todayStr) {
    return false; // Bereits abgelaufen
  }

  return true;
}

// ---------------------------------------------------------------------------
// Werbetexte (CTA)
// ---------------------------------------------------------------------------
export const AD_CTA = 'Sie möchten hier werben? Mehr erfahren!';
export const AD_CTA_NL = 'Wilt u hier adverteren? Meer informatie!';

export function getAdCta(lang: 'de' | 'nl' = 'de'): string {
  return lang === 'nl' ? AD_CTA_NL : AD_CTA;
}

