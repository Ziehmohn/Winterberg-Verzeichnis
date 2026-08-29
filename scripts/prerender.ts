import fs from 'fs';
import path from 'path';
import { businesses, categories } from '../src/data';
import {
  CATEGORY_SLUGS,
  SUBCATEGORY_SLUGS,
  STATIC_PAGE_SLUGS,
  getCategorySlug,
  getSubcategorySlug,
  slugify,
  buildLocalizedUrl,
  getAlternateUrls,
  RouteState
} from '../src/utils/routes';

const baseUrl = 'https://www.winterberg-verzeichnis.de';
const distDir = path.resolve(process.cwd(), 'dist');
const templatePath = path.join(distDir, 'index.html');

if (!fs.existsSync(templatePath)) {
  console.error('dist/index.html not found. Run vite build first.');
  process.exit(1);
}

const baseTemplate = fs.readFileSync(templatePath, 'utf8');

interface PageSEO {
  path: string; // Relative path without leading slash, e.g. "dienstleistungen/marketingdienstleistungen/werbeagentur-netzpepper" or "nl/vacatures"
  title: string;
  description: string;
  canonicalUrl: string;
  alternateDe: string;
  alternateNl: string;
  alternateXDefault: string;
  lang: 'de' | 'nl';
  ogType?: string;
  jsonLd?: any;
}

const pagesToPrerender: PageSEO[] = [];

// Helper to escape HTML attributes
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// 1. Homepage DE & NL
pagesToPrerender.push({
  path: '',
  title: 'Das Winterberg Verzeichnis | Unternehmen, Handwerk & Gastronomie',
  description: 'Das große Verzeichnis für alle Unternehmen, Handwerker und Dienstleister in Winterberg und Umgebung. Finden Sie Adressen, Öffnungszeiten und Angebote.',
  canonicalUrl: `${baseUrl}/`,
  alternateDe: `${baseUrl}/`,
  alternateNl: `${baseUrl}/nl`,
  alternateXDefault: `${baseUrl}/`,
  lang: 'de'
});

pagesToPrerender.push({
  path: 'nl',
  title: 'Het Winterberg Overzicht | Bedrijven, Ambacht & Horeca in Winterberg',
  description: 'De grote bedrijvengids voor alle bedrijven, horeca en dienstverleners in Winterberg en omgeving. Vind adressen, openingstijden en contactgegevens.',
  canonicalUrl: `${baseUrl}/nl`,
  alternateDe: `${baseUrl}/`,
  alternateNl: `${baseUrl}/nl`,
  alternateXDefault: `${baseUrl}/`,
  lang: 'nl'
});

// 2. All businesses
pagesToPrerender.push({
  path: STATIC_PAGE_SLUGS.all.de,
  title: 'Alle Unternehmen in Winterberg | Das Winterberg Verzeichnis',
  description: 'Vollständige Übersicht aller 150+ registrierten Unternehmen, Dienstleister und Handwerksbetriebe in Winterberg und allen 14 Ortsteilen.',
  canonicalUrl: `${baseUrl}/${STATIC_PAGE_SLUGS.all.de}`,
  alternateDe: `${baseUrl}/${STATIC_PAGE_SLUGS.all.de}`,
  alternateNl: `${baseUrl}/nl/${STATIC_PAGE_SLUGS.all.nl}`,
  alternateXDefault: `${baseUrl}/${STATIC_PAGE_SLUGS.all.de}`,
  lang: 'de'
});

pagesToPrerender.push({
  path: `nl/${STATIC_PAGE_SLUGS.all.nl}`,
  title: 'Alle Bedrijven in Winterberg | Het Winterberg Overzicht',
  description: 'Volledig overzicht van alle geregistreerde bedrijven, horeca en ambachtslieden in Winterberg en de 14 omliggende dorpen.',
  canonicalUrl: `${baseUrl}/nl/${STATIC_PAGE_SLUGS.all.nl}`,
  alternateDe: `${baseUrl}/${STATIC_PAGE_SLUGS.all.de}`,
  alternateNl: `${baseUrl}/nl/${STATIC_PAGE_SLUGS.all.nl}`,
  alternateXDefault: `${baseUrl}/${STATIC_PAGE_SLUGS.all.de}`,
  lang: 'nl'
});

// 3. Static Pages
const staticPageConfigs: {
  key: keyof typeof STATIC_PAGE_SLUGS;
  titleDe: string;
  titleNl: string;
  descDe: string;
  descNl: string;
}[] = [
  {
    key: 'jobs',
    titleDe: 'Offene Stellen & Jobs in Winterberg | Das Winterberg Verzeichnis',
    titleNl: 'Vacatures & Banen in Winterberg | Het Winterberg Overzicht',
    descDe: 'Aktuelle Jobangebote und offene Stellen bei Unternehmen in Winterberg und Umgebung. Finden Sie jetzt Ihren neuen Job im Sauerland.',
    descNl: 'Actuele vacatures en banen bij bedrijven in Winterberg en omgeving. Vind uw nieuwe baan in het Sauerland.'
  },
  {
    key: 'news',
    titleDe: 'News & Aktuelles aus Winterberg | Das Winterberg Verzeichnis',
    titleNl: 'Nieuws & Actualiteiten uit Winterberg | Het Winterberg Overzicht',
    descDe: 'Aktuelle Nachrichten, Unternehmensmeldungen und Neuigkeiten aus Winterberg und den Ortsteilen.',
    descNl: 'Actueel nieuws, bedrijfsberichten en updates uit Winterberg en de omliggende dorpen.'
  },
  {
    key: 'faq',
    titleDe: 'Häufige Fragen (FAQ) zu Winterberg | Das Winterberg Verzeichnis',
    titleNl: 'Veelgestelde Vragen (FAQ) over Winterberg | Het Winterberg Overzicht',
    descDe: 'Antworten auf häufig gestellte Fragen zu Unternehmen, Öffnungszeiten, Tourismus und Brancheneinträgen in Winterberg.',
    descNl: 'Antwoorden op veelgestelde vragen over bedrijven, openingstijden, toerisme en bedrijfsvermeldingen in Winterberg.'
  },
  {
    key: 'submit',
    titleDe: 'Unternehmen kostenlos eintragen | Das Winterberg Verzeichnis',
    titleNl: 'Bedrijf gratis aanmelden | Het Winterberg Overzicht',
    descDe: 'Tragen Sie Ihr Unternehmen, Ihren Handwerksbetrieb oder Gastronomiebetrieb kostenlos im offiziellen Winterberg-Verzeichnis ein.',
    descNl: 'Meld uw bedrijf, ambachtszaak of horecagelegenheid gratis aan in de officiële Winterberg gids.'
  },
  {
    key: 'pricing',
    titleDe: 'Preise & Premium-Pakete | Das Winterberg Verzeichnis',
    titleNl: 'Pakketten & Prijzen voor bedrijven | Het Winterberg Overzicht',
    descDe: 'Übersicht über den dauerhaft kostenlosen Basiseintrag und das Premium-Paket für maximale Sichtbarkeit und Neukundengewinnung in Winterberg.',
    descNl: 'Overzicht van de gratis basisvermelding en het premiumpakket voor maximale zichtbaarheid in Winterberg.'
  },
  {
    key: 'impressum',
    titleDe: 'Impressum | Das Winterberg Verzeichnis',
    titleNl: 'Colofon / Impressum | Het Winterberg Overzicht',
    descDe: 'Rechtliche Angaben und Impressum für Das Winterberg Verzeichnis – Ein Projekt von SICHTBAR SEO Simon Kräling.',
    descNl: 'Wettelijke informatie en colofon voor Het Winterberg Overzicht.'
  },
  {
    key: 'datenschutz',
    titleDe: 'Datenschutzerklärung | Das Winterberg Verzeichnis',
    titleNl: 'Privacyverklaring | Het Winterberg Overzicht',
    descDe: 'Informationen zur Verarbeitung personenbezogener Daten und zum Datenschutz gemäß DSGVO im Winterberg Verzeichnis.',
    descNl: 'Informatie over de verwerking van persoonsgegevens en privacy conform AVG/GDPR.'
  },
  {
    key: 'agb',
    titleDe: 'Allgemeine Geschäftsbedingungen (AGB) | Das Winterberg Verzeichnis',
    titleNl: 'Algemene Voorwaarden (AGB) | Het Winterberg Overzicht',
    descDe: 'Allgemeine Geschäftsbedingungen für die Nutzung des Branchenportals Das Winterberg Verzeichnis.',
    descNl: 'Algemene voorwaarden voor het gebruik van Het Winterberg Overzicht.'
  }
];

staticPageConfigs.forEach(cfg => {
  const deSlug = STATIC_PAGE_SLUGS[cfg.key].de;
  const nlSlug = STATIC_PAGE_SLUGS[cfg.key].nl;

  pagesToPrerender.push({
    path: deSlug,
    title: cfg.titleDe,
    description: cfg.descDe,
    canonicalUrl: `${baseUrl}/${deSlug}`,
    alternateDe: `${baseUrl}/${deSlug}`,
    alternateNl: `${baseUrl}/nl/${nlSlug}`,
    alternateXDefault: `${baseUrl}/${deSlug}`,
    lang: 'de'
  });

  pagesToPrerender.push({
    path: `nl/${nlSlug}`,
    title: cfg.titleNl,
    description: cfg.descNl,
    canonicalUrl: `${baseUrl}/nl/${nlSlug}`,
    alternateDe: `${baseUrl}/${deSlug}`,
    alternateNl: `${baseUrl}/nl/${nlSlug}`,
    alternateXDefault: `${baseUrl}/${deSlug}`,
    lang: 'nl'
  });
});

// 4. Categories & Subcategories
categories.forEach(c => {
  const catDe = getCategorySlug(c.name, 'de');
  const catNl = getCategorySlug(c.name, 'nl');

  // Main Category DE & NL
  pagesToPrerender.push({
    path: catDe,
    title: `${c.name} in Winterberg - Alle Unternehmen im Überblick | Das Winterberg Verzeichnis`,
    description: `Finden Sie schnell und einfach Unternehmen aus dem Bereich ${c.name} in Winterberg und den Ortsteilen. Übersicht aller Adressen, Kontaktinfos und Öffnungszeiten.`,
    canonicalUrl: `${baseUrl}/${catDe}`,
    alternateDe: `${baseUrl}/${catDe}`,
    alternateNl: `${baseUrl}/nl/${catNl}`,
    alternateXDefault: `${baseUrl}/${catDe}`,
    lang: 'de'
  });

  pagesToPrerender.push({
    path: `nl/${catNl}`,
    title: `${c.name} in Winterberg - Bedrijvenoverzicht | Het Winterberg Overzicht`,
    description: `Vind snel en eenvoudig bedrijven in de categorie ${c.name} in Winterberg en de dorpen. Overzicht van adressen, contactgegevens en openingstijden.`,
    canonicalUrl: `${baseUrl}/nl/${catNl}`,
    alternateDe: `${baseUrl}/${catDe}`,
    alternateNl: `${baseUrl}/nl/${catNl}`,
    alternateXDefault: `${baseUrl}/${catDe}`,
    lang: 'nl'
  });

  // Subcategories
  c.subcategories.forEach(sub => {
    const subDe = getSubcategorySlug(sub, 'de');
    const subNl = getSubcategorySlug(sub, 'nl');

    pagesToPrerender.push({
      path: `${catDe}/${subDe}`,
      title: `${sub} in Winterberg | Betriebe & Adressen | Das Winterberg Verzeichnis`,
      description: `Alle Betriebe und Dienstleister für ${sub} in Winterberg und Umgebung. Jetzt Kontaktdaten, Telefonnummern und Öffnungszeiten ansehen.`,
      canonicalUrl: `${baseUrl}/${catDe}/${subDe}`,
      alternateDe: `${baseUrl}/${catDe}/${subDe}`,
      alternateNl: `${baseUrl}/nl/${catNl}/${subNl}`,
      alternateXDefault: `${baseUrl}/${catDe}/${subDe}`,
      lang: 'de'
    });

    pagesToPrerender.push({
      path: `nl/${catNl}/${subNl}`,
      title: `${sub} in Winterberg | Bedrijven & Adressen | Het Winterberg Overzicht`,
      description: `Alle bedrijven voor ${sub} in Winterberg en omliggende dorpen. Bekijk direct contactgegevens, telefoonnummers en openingstijden.`,
      canonicalUrl: `${baseUrl}/nl/${catNl}/${subNl}`,
      alternateDe: `${baseUrl}/${catDe}/${subDe}`,
      alternateNl: `${baseUrl}/nl/${catNl}/${subNl}`,
      alternateXDefault: `${baseUrl}/${catDe}/${subDe}`,
      lang: 'nl'
    });
  });
});

// 5. Business Detail Pages
businesses.forEach((b: any) => {
  const bSlug = slugify(b.name);
  const catDe = getCategorySlug(b.category, 'de');
  const catNl = getCategorySlug(b.category, 'nl');
  const subDe = b.subcategory ? getSubcategorySlug(b.subcategory, 'de') : '';
  const subNl = b.subcategory ? getSubcategorySlug(b.subcategory, 'nl') : '';

  const pathDe = subDe ? `${catDe}/${subDe}/${bSlug}` : `${catDe}/${bSlug}`;
  const pathNl = subNl ? `nl/${catNl}/${subNl}/${bSlug}` : `nl/${catNl}/${bSlug}`;

  const city = b.district || 'Winterberg';
  const shortDesc = b.description ? b.description.substring(0, 140).trim() + '...' : 'Ihr Fachbetrieb in Winterberg.';
  const shortDescNl = (b.description_nl || b.description) ? (b.description_nl || b.description).substring(0, 140).trim() + '...' : 'Uw specialist in Winterberg.';

  const schemaJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: b.name,
    description: b.description,
    address: {
      '@type': 'PostalAddress',
      streetAddress: b.address || 'Winterberg',
      addressLocality: city,
      postalCode: '59955',
      addressCountry: 'DE'
    },
    telephone: b.phone || undefined,
    url: b.website || `${baseUrl}/${pathDe}`,
    image: b.logoUrl ? `${baseUrl}${b.logoUrl}` : undefined
  };

  // DE Business Page
  pagesToPrerender.push({
    path: pathDe,
    title: `${b.name} in ${city} | Das Winterberg Verzeichnis`,
    description: `Alle Infos zu ${b.name} in ${city}. ✓ Kontaktdaten ✓ Öffnungszeiten ✓ Adresse. ${shortDesc}`,
    canonicalUrl: `${baseUrl}/${pathDe}`,
    alternateDe: `${baseUrl}/${pathDe}`,
    alternateNl: `${baseUrl}/${pathNl}`,
    alternateXDefault: `${baseUrl}/${pathDe}`,
    lang: 'de',
    jsonLd: schemaJsonLd
  });

  // NL Business Page
  pagesToPrerender.push({
    path: pathNl,
    title: `${b.name} in ${city} | Het Winterberg Overzicht`,
    description: `Alle informatie over ${b.name} in ${city}. ✓ Contactgegevens ✓ Openingstijden ✓ Adres. ${shortDescNl}`,
    canonicalUrl: `${baseUrl}/${pathNl}`,
    alternateDe: `${baseUrl}/${pathDe}`,
    alternateNl: `${baseUrl}/${pathNl}`,
    alternateXDefault: `${baseUrl}/${pathDe}`,
    lang: 'nl',
    jsonLd: schemaJsonLd
  });
});

console.log(`Starting SSG Pre-rendering for ${pagesToPrerender.length} routes...`);

let createdCount = 0;

pagesToPrerender.forEach(page => {
  let html = baseTemplate;

  // 1. Update HTML lang
  html = html.replace(/<html[^>]*>/, `<html lang="${page.lang}">`);

  // 2. Replace Title
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(page.title)}</title>`);

  // 3. Replace Meta Description
  const metaDescRegex = /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/i;
  const newMetaDesc = `<meta name="description" content="${escapeHtml(page.description)}" />`;
  if (metaDescRegex.test(html)) {
    html = html.replace(metaDescRegex, newMetaDesc);
  } else {
    html = html.replace('</head>', `  ${newMetaDesc}\n</head>`);
  }

  // 4. Update OpenGraph Tags
  const ogTitleTag = `<meta property="og:title" content="${escapeHtml(page.title)}" />`;
  const ogDescTag = `<meta property="og:description" content="${escapeHtml(page.description)}" />`;
  const ogUrlTag = `<meta property="og:url" content="${escapeHtml(page.canonicalUrl)}" />`;
  const ogLocaleTag = `<meta property="og:locale" content="${page.lang === 'nl' ? 'nl_NL' : 'de_DE'}" />`;

  html = html.replace(/<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/i, ogTitleTag);
  html = html.replace(/<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/i, ogDescTag);

  // 5. Add Canonical & Hreflang Tags before </head>
  const seoHeadTags = `
    ${ogUrlTag}
    ${ogLocaleTag}
    <link rel="canonical" href="${escapeHtml(page.canonicalUrl)}" />
    <link rel="alternate" hreflang="de" href="${escapeHtml(page.alternateDe)}" />
    <link rel="alternate" hreflang="nl" href="${escapeHtml(page.alternateNl)}" />
    <link rel="alternate" hreflang="x-default" href="${escapeHtml(page.alternateXDefault)}" />
  `.trim();

  if (page.jsonLd) {
    const jsonLdTag = `\n    <script type="application/ld+json">\n    ${JSON.stringify(page.jsonLd, null, 2)}\n    </script>`;
    html = html.replace('</head>', `    ${seoHeadTags}${jsonLdTag}\n  </head>`);
  } else {
    html = html.replace('</head>', `    ${seoHeadTags}\n  </head>`);
  }

  // Determine output directory
  const targetDir = page.path ? path.join(distDir, page.path) : distDir;
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const targetFile = path.join(targetDir, 'index.html');
  fs.writeFileSync(targetFile, html, 'utf8');
  createdCount++;
});

console.log(`✅ Successfully pre-rendered ${createdCount} static HTML pages in dist/!`);
