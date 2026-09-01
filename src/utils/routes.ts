export type Lang = 'de' | 'nl';

export interface RouteMapping {
  de: string;
  nl: string;
}

// Category slug mappings (Category Name in DB -> URL slug)
export const CATEGORY_SLUGS: Record<string, RouteMapping> = {
  'Hotels und Unterkünfte': { de: 'hotels-und-unterkuenfte', nl: 'hotels-en-accommodaties' },
  'Handwerk': { de: 'handwerk', nl: 'ambacht' },
  'Einzelhandel': { de: 'einzelhandel', nl: 'detailhandel' },
  'Gastronomie': { de: 'gastronomie', nl: 'horeca' },
  'Dienstleistungen': { de: 'dienstleistungen', nl: 'dienstverlening' },
  'Freizeit': { de: 'freizeit', nl: 'vrije-tijd' },
};

// Subcategory slug mappings
export const SUBCATEGORY_SLUGS: Record<string, RouteMapping> = {
  'Ferienparks': { de: 'ferienparks', nl: 'vakantieparken' },
  'Ferienhäuser': { de: 'ferienhaeuser', nl: 'vakantiehuizen' },
  'Ferienwohnungen': { de: 'ferienwohnungen', nl: 'vakantiewoningen' },
  'Hotels': { de: 'hotels', nl: 'hotels' },
  'KFZ-Werkstätten': { de: 'kfz-werkstaetten', nl: 'autogarages' },
  'Schreinereien': { de: 'schreinereien', nl: 'timmerlieden' },
  'Wäschereien': { de: 'waeschereien', nl: 'wasserettes' },
  'Dachdecker': { de: 'dachdecker', nl: 'dakdekkers' },
  'Elektriker': { de: 'elektriker', nl: 'elektriciens' },
  'Friseur': { de: 'friseur', nl: 'kappers' },
  'Bäckerei': { de: 'baeckerei', nl: 'bakkerij' },
  'Heizungstechnik': { de: 'heizungstechnik', nl: 'verwarmingstechniek' },
  'Bauunternehmen': { de: 'bauunternehmen', nl: 'bouwbedrijven' },
  'Maler & Lackierer': { de: 'maler-lackierer', nl: 'schilders' },
  'Gartenbauer': { de: 'gartenbauer', nl: 'hoveniers' },
  'Supermarkt': { de: 'supermarkt', nl: 'supermarkt' },
  'Tankstellen': { de: 'tankstellen', nl: 'tankstations' },
  'Bekleidung': { de: 'bekleidung', nl: 'kleding' },
  'Bürobedarf': { de: 'buerobedarf', nl: 'kantoorbenodigdheden' },
  'Autohäuser': { de: 'autohaeuser', nl: 'autodealers' },
  'Restaurant': { de: 'restaurant', nl: 'restaurants' },
  'Cafés': { de: 'cafes', nl: 'cafes' },
  'Kneipen und Bars': { de: 'kneipen-und-bars', nl: 'kroegen-en-bars' },
  'Skihütten': { de: 'skihuetten', nl: 'skihutten' },
  'Eisdielen': { de: 'eisdielen', nl: 'ijssalons' },
  'Pizzerien': { de: 'pizzerien', nl: 'pizzerias' },
  'Imbisse': { de: 'imbisse', nl: 'snackbar-en-fastfood' },
  'Weinstuben': { de: 'weinstuben', nl: 'wijnlokalen' },
  'Steuerberater': { de: 'steuerberater', nl: 'belastingadviseurs' },
  'Marketingdienstleistungen': { de: 'marketingdienstleistungen', nl: 'marketingdiensten' },
  'Finanzberatung': { de: 'finanzberatung', nl: 'financieel-advies' },
  'Rechtsanwälte': { de: 'rechtsanwaelte', nl: 'advocaten' },
  'Banken': { de: 'banken', nl: 'banken' },
  'Versicherungsagenturen': { de: 'versicherungsagenturen', nl: 'verzekeringsagenten' },
  'Indoor-Spielplätze': { de: 'indoor-spielplaetze', nl: 'binnenspeeltuinen' },
  'Fitnessstudios': { de: 'fitnessstudios', nl: 'fitnesscentra' },
  'Bowling': { de: 'bowling', nl: 'bowlen' },
  'Tennisplätze': { de: 'tennisplaetze', nl: 'tennisbanen' },
  'Fußballvereine': { de: 'fussballvereine', nl: 'voetbalclubs' },
  'Schwimmbäder': { de: 'schwimmbaeder', nl: 'zwembaden' },
  'Outdoor-Freizeitgebiet': { de: 'outdoor-freizeitgebiet', nl: 'buitenrecreatiegebied' },
};

// Static Pages Slugs
export const STATIC_PAGE_SLUGS = {
  all: { de: 'alle-unternehmen', nl: 'alle-bedrijven' },
  bestOf: { de: 'die-besten', nl: 'de-beste' },
  jobs: { de: 'jobs', nl: 'vacatures' },
  news: { de: 'news', nl: 'nieuws' },
  newsSubmit: { de: 'news/einreichen', nl: 'nieuws/indienen' },
  faq: { de: 'faq', nl: 'veelgestelde-vragen' },
  submit: { de: 'eintragen', nl: 'bedrijf-aanmelden' },
  pricing: { de: 'preise', nl: 'prijzen' },
  impressum: { de: 'impressum', nl: 'colofon' },
  datenschutz: { de: 'datenschutz', nl: 'privacy' },
  agb: { de: 'agb', nl: 'algemene-voorwaarden' },
  grounding: { de: 'grounding', nl: 'grounding' },
};

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .replace(/&/g, 'und')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function getBusinessSlug(businessName: string): string {
  return slugify(businessName);
}

export function getLegacyBusinessSlug(businessName: string): string {
  return businessName.replace(/\s+/g, '-').toLowerCase();
}

export function getBusinessPath(bus: { category: string; subcategory?: string; name: string }, lang: Lang = 'de'): string {
  const catSlug = getCategorySlug(bus.category, lang);
  const subSlug = bus.subcategory ? getSubcategorySlug(bus.subcategory, lang) : '';
  const bSlug = getBusinessSlug(bus.name);
  const prefix = lang === 'nl' ? '/nl' : '';
  return subSlug ? `${prefix}/${catSlug}/${subSlug}/${bSlug}` : `${prefix}/${catSlug}/${bSlug}`;
}

export function getCategorySlug(categoryName: string, lang: Lang): string {
  const mapping = CATEGORY_SLUGS[categoryName];
  if (mapping) return mapping[lang];
  return slugify(categoryName);
}

export function getSubcategorySlug(subcategoryName: string, lang: Lang): string {
  const mapping = SUBCATEGORY_SLUGS[subcategoryName];
  if (mapping) return mapping[lang];
  return slugify(subcategoryName);
}

// Find DB category name from any slug (DE, NL or direct name)
export function findCategoryFromSlug(slug: string): string | null {
  const cleanSlug = slugify(decodeURIComponent(slug));
  for (const [catName, mapping] of Object.entries(CATEGORY_SLUGS)) {
    if (
      slugify(catName) === cleanSlug ||
      mapping.de === cleanSlug ||
      mapping.nl === cleanSlug ||
      slugify(mapping.de) === cleanSlug ||
      slugify(mapping.nl) === cleanSlug
    ) {
      return catName;
    }
  }
  return null;
}

// Find DB subcategory name from any slug
export function findSubcategoryFromSlug(slug: string): string | null {
  const cleanSlug = slugify(decodeURIComponent(slug));
  for (const [subName, mapping] of Object.entries(SUBCATEGORY_SLUGS)) {
    if (
      slugify(subName) === cleanSlug ||
      mapping.de === cleanSlug ||
      mapping.nl === cleanSlug ||
      slugify(mapping.de) === cleanSlug ||
      slugify(mapping.nl) === cleanSlug
    ) {
      return subName;
    }
  }
  return null;
}

export interface RouteState {
  view: 'home' | 'all' | 'category' | 'business' | 'best-of' | 'jobs' | 'news' | 'news-detail' | 'news-submit' | 'faq' | 'submit' | 'pricing' | 'impressum' | 'datenschutz' | 'agb' | 'grounding' | 'embed' | 'admin' | '404';
  category?: string;
  subcategory?: string;
  businessSlug?: string;
  newsSlug?: string;
  jobsCategory?: string;
  location?: string;
}

/**
 * Builds localized path for any target language
 */
export function buildLocalizedUrl(state: RouteState, targetLang: Lang, baseUrl = ''): string {
  const prefix = targetLang === 'nl' ? '/nl' : '';

  switch (state.view) {
    case 'home':
      return `${baseUrl}${prefix || '/'}`;

    case 'all': {
      const slug = STATIC_PAGE_SLUGS.all[targetLang];
      const query = state.location && state.location !== 'Alle' ? `?ort=${encodeURIComponent(state.location)}` : '';
      return `${baseUrl}${prefix}/${slug}${query}`;
    }

    case 'best-of': {
      const baseSlug = STATIC_PAGE_SLUGS.bestOf[targetLang];
      if (state.category && state.category !== 'Alle' && state.category !== 'all') {
        const catSlug = getCategorySlug(state.category, targetLang);
        if (state.subcategory && state.subcategory !== 'Alle') {
          const subSlug = getSubcategorySlug(state.subcategory, targetLang);
          return `${baseUrl}${prefix}/${baseSlug}/${catSlug}/${subSlug}`;
        }
        return `${baseUrl}${prefix}/${baseSlug}/${catSlug}`;
      }
      return `${baseUrl}${prefix}/${baseSlug}`;
    }

    case 'category': {
      if (!state.category || state.category === 'Alle') {
        const slug = STATIC_PAGE_SLUGS.all[targetLang];
        return `${baseUrl}${prefix}/${slug}`;
      }
      const catSlug = getCategorySlug(state.category, targetLang);
      if (state.subcategory && state.subcategory !== 'Alle') {
        const subSlug = getSubcategorySlug(state.subcategory, targetLang);
        return `${baseUrl}${prefix}/${catSlug}/${subSlug}`;
      }
      return `${baseUrl}${prefix}/${catSlug}`;
    }

    case 'business': {
      const catSlug = state.category ? getCategorySlug(state.category, targetLang) : (targetLang === 'nl' ? 'bedrijf' : 'unternehmen');
      const subSlug = state.subcategory ? getSubcategorySlug(state.subcategory, targetLang) : '';
      const bSlug = state.businessSlug || '';
      if (subSlug) {
        return `${baseUrl}${prefix}/${catSlug}/${subSlug}/${bSlug}`;
      }
      return `${baseUrl}${prefix}/${catSlug}/${bSlug}`;
    }

    case 'jobs': {
      const slug = STATIC_PAGE_SLUGS.jobs[targetLang];
      if (state.jobsCategory) {
        return `${baseUrl}${prefix}/${slug}/${encodeURIComponent(state.jobsCategory)}`;
      }
      return `${baseUrl}${prefix}/${slug}`;
    }

    case 'news': {
      const slug = STATIC_PAGE_SLUGS.news[targetLang];
      return `${baseUrl}${prefix}/${slug}`;
    }

    case 'news-detail': {
      const slug = STATIC_PAGE_SLUGS.news[targetLang];
      return `${baseUrl}${prefix}/${slug}/${state.newsSlug || ''}`;
    }

    case 'news-submit': {
      const slug = STATIC_PAGE_SLUGS.newsSubmit[targetLang];
      return `${baseUrl}${prefix}/${slug}`;
    }

    case 'faq':
      return `${baseUrl}${prefix}/${STATIC_PAGE_SLUGS.faq[targetLang]}`;

    case 'submit':
      return `${baseUrl}${prefix}/${STATIC_PAGE_SLUGS.submit[targetLang]}`;

    case 'pricing':
      return `${baseUrl}${prefix}/${STATIC_PAGE_SLUGS.pricing[targetLang]}`;

    case 'impressum':
      return `${baseUrl}${prefix}/${STATIC_PAGE_SLUGS.impressum[targetLang]}`;

    case 'datenschutz':
      return `${baseUrl}${prefix}/${STATIC_PAGE_SLUGS.datenschutz[targetLang]}`;

    case 'agb':
      return `${baseUrl}${prefix}/${STATIC_PAGE_SLUGS.agb[targetLang]}`;

    case 'grounding':
      return `${baseUrl}${prefix}/${STATIC_PAGE_SLUGS.grounding[targetLang]}`;

    default:
      return `${baseUrl}${prefix || '/'}`;
  }
}

/**
 * Returns alternate URLs for HREFLANG SEO tags
 */
export function getAlternateUrls(state: RouteState, baseUrl = 'https://www.winterberg-verzeichnis.de') {
  const deUrl = buildLocalizedUrl(state, 'de', baseUrl);
  const nlUrl = buildLocalizedUrl(state, 'nl', baseUrl);
  return {
    de: deUrl,
    nl: nlUrl,
    xDefault: deUrl,
  };
}
