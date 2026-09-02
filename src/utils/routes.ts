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
  'Ski, Bike & Sport': { de: 'ski-bike-sport', nl: 'ski-fiets-sport' },
  'Gesundheit & Medizin': { de: 'gesundheit-und-medizin', nl: 'gezondheid-en-geneeskunde' },
  'Mobilität & KFZ': { de: 'mobilitaet-und-kfz', nl: 'mobiliteit-en-autos' },
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
  'Apotheken': { de: 'apotheken', nl: 'apotheken' },
  'Ärzte & Praxen': { de: 'aerzte-und-praxen', nl: 'artsen-en-praktijken' },
  'Zahnärzte': { de: 'zahnaerzte', nl: 'tandartsen' },
  'Physiotherapie': { de: 'physiotherapie', nl: 'fysiotherapie' },
  'Pflegedienste': { de: 'pflegedienste', nl: 'thuiszorg' },
  'Massagen': { de: 'massagen', nl: 'massages' },
  'Kosmetikstudios': { de: 'kosmetikstudios', nl: 'schoonheidssalons' },
  'Tiergesundheit': { de: 'tiergesundheit', nl: 'diergezondheid' },
  'Yoga': { de: 'yoga', nl: 'yoga' },
  'Skiverleih': { de: 'skiverleih', nl: 'skiverhuur' },
  'Fahrradverleih': { de: 'fahrradverleih', nl: 'fietsverhuur' },
  'Fahrradgeschäfte': { de: 'fahrradgeschaefte', nl: 'fietsenwinkels' },
  'Sport & Outdoor': { de: 'sport-und-outdoor', nl: 'sport-en-outdoor' },
  'Reitsport': { de: 'reitsport', nl: 'paardensport' },
  'Kino': { de: 'kino', nl: 'bioscoop' },
  'Immobilienmakler': { de: 'immobilienmakler', nl: 'makelaars' },
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
  fuelPrices: { de: 'aktuelle-spritpreise', nl: 'actuele-brandstofprijzen' },
  emergency: { de: 'notdienste', nl: 'nooddiensten' },
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
  view: 'home' | 'all' | 'category' | 'business' | 'best-of' | 'jobs' | 'news' | 'news-detail' | 'news-submit' | 'faq' | 'submit' | 'pricing' | 'fuel-prices' | 'emergency' | 'impressum' | 'datenschutz' | 'agb' | 'grounding' | 'embed' | 'admin' | '404';
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

    case 'fuel-prices':
      return `${baseUrl}${prefix}/${STATIC_PAGE_SLUGS.fuelPrices[targetLang]}`;

    case 'emergency':
      return `${baseUrl}${prefix}/${STATIC_PAGE_SLUGS.emergency[targetLang]}`;

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

// Former category assignments before the 9-category restructuring
export const LEGACY_SUBCATEGORY_PARENTS: Record<string, string> = {
  'KFZ-Werkstätten': 'Handwerk',
  'Tankstellen': 'Einzelhandel',
  'Autohäuser': 'Einzelhandel',
  'Fahrradgeschäfte': 'Einzelhandel',
  'Sport & Outdoor': 'Einzelhandel',
  'Ärzte & Praxen': 'Dienstleistungen',
  'Zahnärzte': 'Dienstleistungen',
  'Apotheken': 'Dienstleistungen',
  'Physiotherapie': 'Dienstleistungen',
  'Pflegedienste': 'Dienstleistungen',
  'Massagen': 'Dienstleistungen',
  'Kosmetikstudios': 'Dienstleistungen',
  'Tiergesundheit': 'Dienstleistungen',
  'Skiverleih': 'Freizeit',
  'Fahrradverleih': 'Freizeit',
  'Fitnessstudios': 'Freizeit',
  'Tennisplätze': 'Freizeit',
  'Fußballvereine': 'Freizeit',
  'Reitsport': 'Freizeit',
  'Yoga': 'Freizeit',
};

/**
 * Checks if a path corresponds to a legacy category location and returns the new canonical URL (301)
 */
export function getLegacyCategoryRedirect(pathname: string, categoriesList: Array<{ name: string; subcategories: string[] }>): string | null {
  const cleanPath = pathname.split('?')[0].replace(/\/+$/, '');
  const parts = cleanPath.split('/').filter(Boolean);
  if (parts.length === 0) return null;

  const isNl = parts[0] === 'nl';
  const offset = isNl ? 1 : 0;
  if (parts.length < offset + 2) return null;

  const catSlug = parts[offset];
  const subSlug = parts[offset + 1];
  const rest = parts.slice(offset + 2);

  const subName = findSubcategoryFromSlug(subSlug);
  if (!subName) return null;

  const oldParentCat = LEGACY_SUBCATEGORY_PARENTS[subName];
  if (!oldParentCat) return null;

  const targetLang = isNl ? 'nl' : 'de';
  const expectedOldCatSlug = getCategorySlug(oldParentCat, targetLang);

  if (catSlug.toLowerCase() !== expectedOldCatSlug.toLowerCase() && catSlug.toLowerCase() !== slugify(oldParentCat).toLowerCase()) {
    return null;
  }

  const newParentCat = categoriesList.find(c => c.subcategories.includes(subName))?.name;
  if (!newParentCat) return null;

  const newCatSlug = getCategorySlug(newParentCat, targetLang);
  const prefix = isNl ? '/nl' : '';
  const restPath = rest.length > 0 ? `/${rest.join('/')}` : '';

  return `${prefix}/${newCatSlug}/${subSlug}${restPath}`;
}

export interface SystemRedirectEntry {
  id: string;
  source: string;
  target: string;
  isSystem: boolean;
  type: 'Kategorie' | 'Unternehmen';
  lang: 'de' | 'nl';
}

export function getSystemRedirects(
  categoriesList: Array<{ name: string; subcategories: string[] }>,
  businessesList: Array<{ name: string; subcategory?: string }>
): SystemRedirectEntry[] {
  const redirects: SystemRedirectEntry[] = [];

  for (const lang of ['de', 'nl'] as const) {
    const prefix = lang === 'nl' ? '/nl' : '';
    for (const [subName, oldCatName] of Object.entries(LEGACY_SUBCATEGORY_PARENTS)) {
      const newCatName = categoriesList.find(c => c.subcategories.includes(subName))?.name;
      if (!newCatName) continue;
      const oldCatSlug = getCategorySlug(oldCatName, lang);
      const newCatSlug = getCategorySlug(newCatName, lang);
      const subSlug = getSubcategorySlug(subName, lang);

      redirects.push({
        id: `sys-${lang}-${oldCatSlug}-${subSlug}`,
        source: `${prefix}/${oldCatSlug}/${subSlug}`,
        target: `${prefix}/${newCatSlug}/${subSlug}`,
        isSystem: true,
        type: 'Kategorie',
        lang,
      });

      const subBusinesses = businessesList.filter(b => b.subcategory === subName);
      for (const b of subBusinesses) {
        const bSlug = slugify(b.name);
        redirects.push({
          id: `sys-${lang}-${oldCatSlug}-${subSlug}-${bSlug}`,
          source: `${prefix}/${oldCatSlug}/${subSlug}/${bSlug}`,
          target: `${prefix}/${newCatSlug}/${subSlug}/${bSlug}`,
          isSystem: true,
          type: 'Unternehmen',
          lang,
        });
      }
    }
  }

  return redirects;
}
