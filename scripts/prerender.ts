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
  h1: string;
  h2?: string;
  ogType?: string;
  jsonLd?: any;
}

const pagesToPrerender: PageSEO[] = [];

// Helper to escape HTML attributes & contents
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
  lang: 'de',
  h1: 'Winterberger Unternehmen',
  h2: 'Das große Branchen- und Firmenverzeichnis für Winterberg und Umgebung'
});

pagesToPrerender.push({
  path: 'nl',
  title: 'Het Winterberg Overzicht | Bedrijven, Ambacht & Horeca in Winterberg',
  description: 'De grote bedrijvengids voor alle bedrijven, horeca en dienstverleners in Winterberg en omgeving. Vind adressen, openingstijden en contactgegevens.',
  canonicalUrl: `${baseUrl}/nl`,
  alternateDe: `${baseUrl}/`,
  alternateNl: `${baseUrl}/nl`,
  alternateXDefault: `${baseUrl}/`,
  lang: 'nl',
  h1: 'Bedrijven in Winterberg',
  h2: 'De grote bedrijvengids voor Winterberg en omgeving'
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
  lang: 'de',
  h1: 'Alle Unternehmen in Winterberg',
  h2: 'Vollständige Übersicht aller Betriebe, Handwerker und Dienstleister'
});

pagesToPrerender.push({
  path: `nl/${STATIC_PAGE_SLUGS.all.nl}`,
  title: 'Alle Bedrijven in Winterberg | Het Winterberg Overzicht',
  description: 'Volledig overzicht van alle geregistreerde bedrijven, horeca en ambachtslieden in Winterberg en de 14 omliggende dorpen.',
  canonicalUrl: `${baseUrl}/nl/${STATIC_PAGE_SLUGS.all.nl}`,
  alternateDe: `${baseUrl}/${STATIC_PAGE_SLUGS.all.de}`,
  alternateNl: `${baseUrl}/nl/${STATIC_PAGE_SLUGS.all.nl}`,
  alternateXDefault: `${baseUrl}/${STATIC_PAGE_SLUGS.all.de}`,
  lang: 'nl',
  h1: 'Alle bedrijven in Winterberg',
  h2: 'Compleet overzicht van alle bedrijven en dienstverleners'
});

// 3. Static Pages
const staticPageConfigs: {
  key: keyof typeof STATIC_PAGE_SLUGS;
  titleDe: string;
  titleNl: string;
  descDe: string;
  descNl: string;
  h1De: string;
  h1Nl: string;
  h2De: string;
  h2Nl: string;
}[] = [
  {
    key: 'jobs',
    titleDe: 'Offene Stellen & Jobs in Winterberg | Das Winterberg Verzeichnis',
    titleNl: 'Vacatures & Banen in Winterberg | Het Winterberg Overzicht',
    descDe: 'Aktuelle Jobangebote und offene Stellen bei Unternehmen in Winterberg und Umgebung. Finden Sie jetzt Ihren neuen Job im Sauerland.',
    descNl: 'Actuele vacatures en banen bij bedrijven in Winterberg en omgeving. Vind uw nieuwe baan in het Sauerland.',
    h1De: 'Jobs & Stellenangebote in Winterberg',
    h1Nl: 'Vacatures & Banen in Winterberg',
    h2De: 'Aktuelle Jobangebote und Karrieremöglichkeiten im Sauerland',
    h2Nl: 'Actuele banen en carrièremogelijkheden in het Sauerland'
  },
  {
    key: 'news',
    titleDe: 'News & Aktuelles aus Winterberg | Das Winterberg Verzeichnis',
    titleNl: 'Nieuws & Actualiteiten uit Winterberg | Het Winterberg Overzicht',
    descDe: 'Aktuelle Nachrichten, Unternehmensmeldungen und Neuigkeiten aus Winterberg und den Ortsteilen.',
    descNl: 'Actueel nieuws, bedrijfsberichten en updates uit Winterberg en de omliggende dorpen.',
    h1De: 'News & Aktuelles aus Winterberg',
    h1Nl: 'Nieuws & Actualiteiten uit Winterberg',
    h2De: 'Neuigkeiten, Unternehmensmeldungen und Wirtschafts-Updates',
    h2Nl: 'Nieuws, bedrijfsberichten en updates'
  },
  {
    key: 'faq',
    titleDe: 'Häufige Fragen (FAQ) zu Winterberg | Das Winterberg Verzeichnis',
    titleNl: 'Veelgestelde Vragen (FAQ) over Winterberg | Het Winterberg Overzicht',
    descDe: 'Antworten auf häufig gestellte Fragen zu Unternehmen, Öffnungszeiten, Tourismus und Brancheneinträgen in Winterberg.',
    descNl: 'Antwoorden op veelgestelde vragen over bedrijven, openingstijden, toerisme en bedrijfsvermeldingen in Winterberg.',
    h1De: 'Häufig gestellte Fragen (FAQ)',
    h1Nl: 'Veelgestelde Vragen (FAQ)',
    h2De: 'Alles Wissenswerte über das Winterberg Verzeichnis',
    h2Nl: 'Alles wat u moet weten over het Winterberg Overzicht'
  },
  {
    key: 'submit',
    titleDe: 'Unternehmen kostenlos eintragen | Das Winterberg Verzeichnis',
    titleNl: 'Bedrijf gratis aanmelden | Het Winterberg Overzicht',
    descDe: 'Tragen Sie Ihr Unternehmen, Ihren Handwerksbetrieb oder Gastronomiebetrieb kostenlos im offiziellen Winterberg-Verzeichnis ein.',
    descNl: 'Meld uw bedrijf, ambachtszaak of horecagelegenheid gratis aan in de officiële Winterberg gids.',
    h1De: 'Unternehmen kostenlos eintragen',
    h1Nl: 'Bedrijf gratis aanmelden',
    h2De: 'Erhöhen Sie Ihre Reichweite bei Einheimischen und Touristen',
    h2Nl: 'Vergroot uw zichtbaarheid bij inwoners en toeristen'
  },
  {
    key: 'pricing',
    titleDe: 'Preise & Premium-Pakete | Das Winterberg Verzeichnis',
    titleNl: 'Pakketten & Prijzen voor bedrijven | Het Winterberg Overzicht',
    descDe: 'Übersicht über den dauerhaft kostenlosen Basiseintrag und das Premium-Paket für maximale Sichtbarkeit und Neukundengewinnung in Winterberg.',
    descNl: 'Overzicht van de gratis basisvermelding en het premiumpakket voor maximale zichtbaarheid in Winterberg.',
    h1De: 'Preise & Premium-Pakete',
    h1Nl: 'Pakketten & Prijzen voor bedrijven',
    h2De: 'Transparente Konditionen für dauerhaften Erfolg',
    h2Nl: 'Transparante voorwaarden voor optimaal resultaat'
  },
  {
    key: 'fuelPrices',
    titleDe: 'Aktuelle Spritpreise in Winterberg | Live-Tankstellenvergleich & Rechner',
    titleNl: 'Actuele Brandstofprijzen in Winterberg | Live Tankstations & Calculator',
    descDe: 'Vergleichen Sie die aktuellen Spritpreise für Diesel, Super E10 und Super E5 aller Tankstellen in Winterberg in Echtzeit. Mit praktischem Tankkosten-Rechner.',
    descNl: 'Vergelijk de actuele prijzen voor Diesel, Super E10 en Super E5 van alle tankstations in Winterberg. Inclusief handige tankkosten calculator.',
    h1De: 'Aktuelle Spritpreise in Winterberg & Umgebung',
    h1Nl: 'Actuele Brandstofprijzen in Winterberg & Omgeving',
    h2De: 'Live-Preise der Markttransparenzstelle (MTS-K) & interaktiver Tankrechner',
    h2Nl: 'Live brandstofprijzen & interactieve tankcalculator'
  },
  {
    key: 'emergency',
    titleDe: 'Notdienste & Notfallnummern in Winterberg | Apotheken-Notdienst (112, 116 117)',
    titleNl: 'Nooddiensten & Apotheken in Winterberg | Alarmnummers (112, 116 117)',
    descDe: 'Wichtige Notrufnummern (112, 110, 116 117), tagesaktueller Apotheken-Notdienst (via aponet.de / ABDA), Notfallpraxis am St. Franziskus-Hospital und Notdienste in Winterberg.',
    descNl: 'Overzicht van alle spoednummers, actuele apotheek-spoeddienst (aponet.de / ABDA), huisartsenpost bij het St. Franziskus-Hospital en eerste hulp in Winterberg.',
    h1De: 'Notdienste & Notfallnummern in Winterberg',
    h1Nl: 'Nooddiensten & Alarmnummers in Winterberg',
    h2De: 'Apotheken-Notdienst (aponet.de / ABDA), Krankenhäuser & 24/7 Bereitschaft',
    h2Nl: 'Apotheek-spoeddienst, ziekenhuizen & 24/7 hulpdiensten'
  },
  {
    key: 'impressum',
    titleDe: 'Impressum | Das Winterberg Verzeichnis',
    titleNl: 'Colofon / Impressum | Het Winterberg Overzicht',
    descDe: 'Rechtliche Angaben und Impressum für Das Winterberg Verzeichnis – Ein Projekt von SICHTBAR SEO Simon Kräling.',
    descNl: 'Wettelijke informatie en colofon voor Het Winterberg Overzicht.',
    h1De: 'Impressum',
    h1Nl: 'Colofon / Impressum',
    h2De: 'Rechtliche Angaben gemäß § 5 TMG',
    h2Nl: 'Wettelijke informatie en contact'
  },
  {
    key: 'datenschutz',
    titleDe: 'Datenschutzerklärung | Das Winterberg Verzeichnis',
    titleNl: 'Privacyverklaring | Het Winterberg Overzicht',
    descDe: 'Informationen zur Verarbeitung personenbezogener Daten und zum Datenschutz gemäß DSGVO im Winterberg Verzeichnis.',
    descNl: 'Informatie over de verwerking van persoonsgegevens en privacy conform AVG/GDPR.',
    h1De: 'Datenschutzerklärung',
    h1Nl: 'Privacyverklaring',
    h2De: 'Datenschutz und Informationen zur DSGVO',
    h2Nl: 'Privacy en gegevensbescherming volgens de AVG'
  },
  {
    key: 'agb',
    titleDe: 'Allgemeine Geschäftsbedingungen (AGB) | Das Winterberg Verzeichnis',
    titleNl: 'Algemene Voorwaarden (AGB) | Het Winterberg Overzicht',
    descDe: 'Allgemeine Geschäftsbedingungen für die Nutzung des Branchenportals Das Winterberg Verzeichnis.',
    descNl: 'Algemene voorwaarden voor het gebruik van Het Winterberg Overzicht.',
    h1De: 'Allgemeine Geschäftsbedingungen (AGB)',
    h1Nl: 'Algemene Voorwaarden (AGB)',
    h2De: 'Nutzungsbedingungen für Das Winterberg Verzeichnis',
    h2Nl: 'Gebruiksvoorwaarden voor Het Winterberg Overzicht'
  },
  {
    key: 'grounding',
    titleDe: 'Grounding Page – KI-Fakten & Entitäts-Referenz | Das Winterberg Verzeichnis',
    titleNl: 'Grounding Page – Geverifieerde Feiten & AI-Referentie | Het Winterberg Overzicht',
    descDe: 'Offizielle Grounding Page des Winterberg Verzeichnisses: Strukturierte, maschinenlesbare Fakten, Ontologie und Disambiguierung für KI-Systeme und LLMs.',
    descNl: 'Officiële Grounding Page van Het Winterberg Overzicht: Gestructureerde feiten, ontologie en entiteitsdefinitie voor AI-systemen en LLMs.',
    h1De: 'Grounding Page – Maschinenlesbare Fakten & KI-Referenz',
    h1Nl: 'Grounding Page – Geverifieerde Feiten & AI-Referentie',
    h2De: 'Standardisierte Entitätsdaten, Ontologie und Anti-Halluzinations-Richtlinien',
    h2Nl: 'Gestandaardiseerde entiteitsgegevens, ontologie en anti-hallucinatie richtlijnen'
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
    lang: 'de',
    h1: cfg.h1De,
    h2: cfg.h2De
  });

  pagesToPrerender.push({
    path: `nl/${nlSlug}`,
    title: cfg.titleNl,
    description: cfg.descNl,
    canonicalUrl: `${baseUrl}/nl/${nlSlug}`,
    alternateDe: `${baseUrl}/${deSlug}`,
    alternateNl: `${baseUrl}/nl/${nlSlug}`,
    alternateXDefault: `${baseUrl}/${deSlug}`,
    lang: 'nl',
    h1: cfg.h1Nl,
    h2: cfg.h2Nl
  });
});

// 3b. Best-Of Pages (Top 10)
const bestOfDeSlug = STATIC_PAGE_SLUGS.bestOf.de;
const bestOfNlSlug = STATIC_PAGE_SLUGS.bestOf.nl;

pagesToPrerender.push({
  path: bestOfDeSlug,
  title: 'Die 10 besten Unternehmen in Winterberg (2026) | Das Winterberg Verzeichnis',
  description: 'Offizielle Bestenliste der am besten bewerteten Unternehmen in Winterberg und den 14 Ortsteilen. Ermittelt nach verifizierten Kundenbewertungen.',
  canonicalUrl: `${baseUrl}/${bestOfDeSlug}`,
  alternateDe: `${baseUrl}/${bestOfDeSlug}`,
  alternateNl: `${baseUrl}/nl/${bestOfNlSlug}`,
  alternateXDefault: `${baseUrl}/${bestOfDeSlug}`,
  lang: 'de',
  h1: 'Die 10 besten Unternehmen in Winterberg',
  h2: 'Offizielle Bestenliste 2026 nach Kundenbewertungen'
});

pagesToPrerender.push({
  path: `nl/${bestOfNlSlug}`,
  title: 'De 10 Beste Bedrijven in Winterberg (2026) | Het Winterberg Overzicht',
  description: 'Officiële ranglijst van de best beoordeelde bedrijven in Winterberg en omgeving. Gebaseerd op echte klantrecensies.',
  canonicalUrl: `${baseUrl}/nl/${bestOfNlSlug}`,
  alternateDe: `${baseUrl}/${bestOfDeSlug}`,
  alternateNl: `${baseUrl}/nl/${bestOfNlSlug}`,
  alternateXDefault: `${baseUrl}/${bestOfDeSlug}`,
  lang: 'nl',
  h1: 'De 10 Beste Bedrijven in Winterberg',
  h2: 'Officiële ranglijst 2026 op basis van klantbeoordelingen'
});

categories.forEach(c => {
  const catDe = getCategorySlug(c.name, 'de');
  const catNl = getCategorySlug(c.name, 'nl');

  // Category Best-Of
  pagesToPrerender.push({
    path: `${bestOfDeSlug}/${catDe}`,
    title: `Die besten ${c.name} in Winterberg (2026) | Das Winterberg Verzeichnis`,
    description: `Die am besten bewerteten ${c.name} in Winterberg und Umgebung im direkten Vergleich.`,
    canonicalUrl: `${baseUrl}/${bestOfDeSlug}/${catDe}`,
    alternateDe: `${baseUrl}/${bestOfDeSlug}/${catDe}`,
    alternateNl: `${baseUrl}/nl/${bestOfNlSlug}/${catNl}`,
    alternateXDefault: `${baseUrl}/${bestOfDeSlug}/${catDe}`,
    lang: 'de',
    h1: `Die besten ${c.name} in Winterberg`,
    h2: `Top-Rangliste für ${c.name} nach Kundenbewertungen`
  });

  pagesToPrerender.push({
    path: `nl/${bestOfNlSlug}/${catNl}`,
    title: `De Beste ${c.name} in Winterberg (2026) | Het Winterberg Overzicht`,
    description: `De best beoordeelde bedrijven in de categorie ${c.name} in Winterberg.`,
    canonicalUrl: `${baseUrl}/nl/${bestOfNlSlug}/${catNl}`,
    alternateDe: `${baseUrl}/${bestOfDeSlug}/${catDe}`,
    alternateNl: `${baseUrl}/nl/${bestOfNlSlug}/${catNl}`,
    alternateXDefault: `${baseUrl}/${bestOfDeSlug}/${catDe}`,
    lang: 'nl',
    h1: `De Beste ${c.name} in Winterberg`,
    h2: `Top ranglijst voor ${c.name} op basis van beoordelingen`
  });

  c.subcategories.forEach(sub => {
    const subDe = getSubcategorySlug(sub, 'de');
    const subNl = getSubcategorySlug(sub, 'nl');

    pagesToPrerender.push({
      path: `${bestOfDeSlug}/${catDe}/${subDe}`,
      title: `Die 10 besten ${sub} in Winterberg (2026) | Das Winterberg Verzeichnis`,
      description: `Entdecken Sie die beliebtesten und am besten bewerteten ${sub} in Winterberg.`,
      canonicalUrl: `${baseUrl}/${bestOfDeSlug}/${catDe}/${subDe}`,
      alternateDe: `${baseUrl}/${bestOfDeSlug}/${catDe}/${subDe}`,
      alternateNl: `${baseUrl}/nl/${bestOfNlSlug}/${catNl}/${subNl}`,
      alternateXDefault: `${baseUrl}/${bestOfDeSlug}/${catDe}/${subDe}`,
      lang: 'de',
      h1: `Die 10 besten ${sub} in Winterberg`,
      h2: `Aktuelle Bestenliste für ${sub} nach Kundenbewertungen`
    });

    pagesToPrerender.push({
      path: `nl/${bestOfNlSlug}/${catNl}/${subNl}`,
      title: `De 10 Beste ${sub} in Winterberg (2026) | Het Winterberg Overzicht`,
      description: `Ontdek de populairste en best beoordeelde ${sub} in Winterberg en omgeving.`,
      canonicalUrl: `${baseUrl}/nl/${bestOfNlSlug}/${catNl}/${subNl}`,
      alternateDe: `${baseUrl}/${bestOfDeSlug}/${catDe}/${subDe}`,
      alternateNl: `${baseUrl}/nl/${bestOfNlSlug}/${catNl}/${subNl}`,
      alternateXDefault: `${baseUrl}/${bestOfDeSlug}/${catDe}/${subDe}`,
      lang: 'nl',
      h1: `De 10 Beste ${sub} in Winterberg`,
      h2: `Actuele ranglijst voor ${sub} op basis van recensies`
    });
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
    lang: 'de',
    h1: `${c.name} in Winterberg`,
    h2: `Übersicht aller Fachbetriebe für ${c.name} in der Region`
  });

  pagesToPrerender.push({
    path: `nl/${catNl}`,
    title: `${c.name} in Winterberg - Bedrijvenoverzicht | Het Winterberg Overzicht`,
    description: `Vind snel en eenvoudig bedrijven in de categorie ${c.name} in Winterberg en de dorpen. Overzicht van adressen, contactgegevens en openingstijden.`,
    canonicalUrl: `${baseUrl}/nl/${catNl}`,
    alternateDe: `${baseUrl}/${catDe}`,
    alternateNl: `${baseUrl}/nl/${catNl}`,
    alternateXDefault: `${baseUrl}/${catDe}`,
    lang: 'nl',
    h1: `${c.name} in Winterberg`,
    h2: `Overzicht van alle bedrijven voor ${c.name} in de regio`
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
      lang: 'de',
      h1: `${sub} in Winterberg`,
      h2: `Geprüfte Adressen & Spezialisten für ${sub}`
    });

    pagesToPrerender.push({
      path: `nl/${catNl}/${subNl}`,
      title: `${sub} in Winterberg | Bedrijven & Adressen | Het Winterberg Overzicht`,
      description: `Alle bedrijven voor ${sub} in Winterberg en omliggende dorpen. Bekijk direct contactgegevens, telefoonnummers en openingstijden.`,
      canonicalUrl: `${baseUrl}/nl/${catNl}/${subNl}`,
      alternateDe: `${baseUrl}/${catDe}/${subDe}`,
      alternateNl: `${baseUrl}/nl/${catNl}/${subNl}`,
      alternateXDefault: `${baseUrl}/${catDe}/${subDe}`,
      lang: 'nl',
      h1: `${sub} in Winterberg`,
      h2: `Geverifieerde adressen & specialisten voor ${sub}`
    });
  });
});

// 5. Business Detail Pages
businesses.forEach((b: any) => {
  const bSlugClean = slugify(b.name);
  const bSlugLegacy = b.name.replace(/\s+/g, '-').toLowerCase();
  const catDe = getCategorySlug(b.category, 'de');
  const catNl = getCategorySlug(b.category, 'nl');
  const subDe = b.subcategory ? getSubcategorySlug(b.subcategory, 'de') : '';
  const subNl = b.subcategory ? getSubcategorySlug(b.subcategory, 'nl') : '';

  const pathDe = subDe ? `${catDe}/${subDe}/${bSlugClean}` : `${catDe}/${bSlugClean}`;
  const pathNl = subNl ? `nl/${catNl}/${subNl}/${bSlugClean}` : `nl/${catNl}/${bSlugClean}`;

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

  // DE Business Page (Canonical clean URL)
  pagesToPrerender.push({
    path: pathDe,
    title: `${b.name} in ${city} | Das Winterberg Verzeichnis`,
    description: `Alle Infos zu ${b.name} in ${city}. ✓ Kontaktdaten ✓ Öffnungszeiten ✓ Adresse. ${shortDesc}`,
    canonicalUrl: `${baseUrl}/${pathDe}`,
    alternateDe: `${baseUrl}/${pathDe}`,
    alternateNl: `${baseUrl}/${pathNl}`,
    alternateXDefault: `${baseUrl}/${pathDe}`,
    lang: 'de',
    h1: b.name,
    h2: `Über ${b.name} in ${city}`,
    jsonLd: schemaJsonLd
  });

  // NL Business Page (Canonical clean URL)
  pagesToPrerender.push({
    path: pathNl,
    title: `${b.name} in ${city} | Het Winterberg Overzicht`,
    description: `Alle informatie over ${b.name} in ${city}. ✓ Contactgegevens ✓ Openingstijden ✓ Adres. ${shortDescNl}`,
    canonicalUrl: `${baseUrl}/${pathNl}`,
    alternateDe: `${baseUrl}/${pathDe}`,
    alternateNl: `${baseUrl}/${pathNl}`,
    alternateXDefault: `${baseUrl}/${pathDe}`,
    lang: 'nl',
    h1: b.name,
    h2: `Over ${b.name} in ${city}`,
    jsonLd: schemaJsonLd
  });

  // Also pre-render legacy alias URL (e.g. abenteuergolf-winterberg---erlebnisberg-kappe) so ANY legacy crawl/link gets exact static HTML with self-referencing or canonical URL!
  if (bSlugLegacy !== bSlugClean && !bSlugLegacy.includes('/') && !bSlugLegacy.includes('\\') && !bSlugLegacy.includes('|') && !bSlugLegacy.includes(':')) {
    const legacyPathDe = subDe ? `${catDe}/${subDe}/${bSlugLegacy}` : `${catDe}/${bSlugLegacy}`;
    const legacyPathNl = subNl ? `nl/${catNl}/${subNl}/${bSlugLegacy}` : `nl/${catNl}/${bSlugLegacy}`;

    pagesToPrerender.push({
      path: legacyPathDe,
      title: `${b.name} in ${city} | Das Winterberg Verzeichnis`,
      description: `Alle Infos zu ${b.name} in ${city}. ✓ Kontaktdaten ✓ Öffnungszeiten ✓ Adresse. ${shortDesc}`,
      canonicalUrl: `${baseUrl}/${pathDe}`,
      alternateDe: `${baseUrl}/${pathDe}`,
      alternateNl: `${baseUrl}/${pathNl}`,
      alternateXDefault: `${baseUrl}/${pathDe}`,
      lang: 'de',
      h1: b.name,
      h2: `Über ${b.name} in ${city}`,
      jsonLd: schemaJsonLd
    });

    pagesToPrerender.push({
      path: legacyPathNl,
      title: `${b.name} in ${city} | Het Winterberg Overzicht`,
      description: `Alle informatie over ${b.name} in ${city}. ✓ Contactgegevens ✓ Openingstijden ✓ Adres. ${shortDescNl}`,
      canonicalUrl: `${baseUrl}/${pathNl}`,
      alternateDe: `${baseUrl}/${pathDe}`,
      alternateNl: `${baseUrl}/${pathNl}`,
      alternateXDefault: `${baseUrl}/${pathDe}`,
      lang: 'nl',
      h1: b.name,
      h2: `Over ${b.name} in ${city}`,
      jsonLd: schemaJsonLd
    });
  }
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

  // 5. Replace H1 & H2 & Description in Skeleton
  const h1Tag = `<h1 id="sk-h1">${escapeHtml(page.h1)}</h1>`;
  const h2Tag = page.h2 ? `<h2 id="sk-h2">${escapeHtml(page.h2)}</h2>` : '';
  const descTag = `<p id="sk-desc">${escapeHtml(page.description)}</p>`;

  html = html.replace(/<h1[^>]*>[\s\S]*?<\/h1>/i, h1Tag);
  if (page.h2) {
    if (/<h2[^>]*>[\s\S]*?<\/h2>/i.test(html)) {
      html = html.replace(/<h2[^>]*>[\s\S]*?<\/h2>/i, h2Tag);
    } else {
      html = html.replace(/(<\/h1>)/i, `$1\n          ${h2Tag}`);
    }
  }
  html = html.replace(/<p id="sk-desc"[^>]*>[\s\S]*?<\/p>/i, descTag);

  // 6. Add Canonical & Hreflang Tags before </head>
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
