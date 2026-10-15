import { Business } from '../types';

export interface ParsedSearchQuery {
  raw: string;
  normalized: string;
  coreTokens: string[];
  semanticKeywords: string[];
  isNaturalLanguage: boolean;
  wantsSundayOpen: boolean;
  wantsJobs: boolean;
  wantsEvents: boolean;
}

export interface SearchMatchResult {
  business: Business;
  score: number;
  matchedReason?: {
    type: 'name' | 'service' | 'product' | 'category' | 'document' | 'review' | 'description' | 'event' | 'job' | 'semantic';
    text: string;
  };
}

// Common German and Dutch conversational stop words & fillers
const STOP_WORDS = new Set([
  // German
  'wo', 'kann', 'ich', 'wir', 'man', 'du', 'ihr', 'sie',
  'gibt', 'es', 'hier', 'in', 'im', 'am', 'an', 'auf', 'aus', 'bei', 'mit', 'nach', 'von', 'zu', 'zum', 'zur',
  'winterberg', 'sauerland',
  'ein', 'eine', 'einer', 'eines', 'einem', 'einen',
  'der', 'die', 'das', 'den', 'dem', 'des',
  'wer', 'wie', 'was', 'welcher', 'welche', 'welches', 'welchem', 'welchen',
  'bietet', 'macht', 'baut', 'hat', 'haben', 'finde', 'finden', 'sucht', 'suche', 'suchen', 'gesucht',
  'brauche', 'brauchen', 'benötige', 'benoetige', 'möchte', 'moechte', 'will', 'wollte', 'könnte', 'koennte',
  'und', 'oder', 'aber', 'denn',
  'sehr', 'gut', 'gute', 'guten', 'gutes', 'bester', 'beste', 'bestes', 'besten',
  'lecker', 'leckere', 'leckeren', 'leckeres', 'frisch', 'frische', 'frischen',
  'günstig', 'guenstig', 'billig', 'preiswert', 'schnell', 'einfach',
  'bitte', 'mal', 'gerne', 'irgendwo', 'jemand', 'etwas', 'lassen',
  // Dutch
  'waar', 'kan', 'ik', 'je', 'we', 'men', 'jullie',
  'is', 'er', 'hier', 'een', 'de', 'het',
  'wie', 'wat', 'welke', 'welk',
  'heeft', 'hebben', 'vind', 'vinden', 'zoek', 'zoeken', 'gezocht',
  'graag', 'lekker', 'lekkere', 'beste', 'goed', 'goede',
  'bij', 'voor', 'van', 'en', 'of', 'alsjeblieft', 'eens', 'ergens'
]);

// Semantic domains & synonyms for Natural Language queries
const SEMANTIC_SYNONYMS: Record<string, string[]> = {
  // Döner / Kebab / Türkisch / Imbiss
  'döner': ['döner', 'doener', 'kebab', 'kebap', 'shawarma', 'dürüm', 'dueruem', 'lahmacun', 'drehspieß', 'drehspiess', 'türkisch', 'imbiss', 'atas döner', 'nowa kebabhaus', 'ceylon'],
  'doener': ['döner', 'doener', 'kebab', 'kebap', 'shawarma', 'dürüm', 'dueruem', 'lahmacun', 'drehspieß', 'imbiss'],
  'kebab': ['döner', 'kebab', 'kebap', 'shawarma', 'dürüm', 'drehspieß', 'imbiss'],
  'kebap': ['döner', 'kebab', 'kebap', 'shawarma', 'dürüm', 'drehspieß', 'imbiss'],
  'shawarma': ['shawarma', 'döner', 'kebab', 'ceylon'],
  'lahmacun': ['lahmacun', 'döner', 'türkisch', 'kebab'],

  // Gastronomie & Essen
  'essen': ['restaurant', 'gastronomie', 'speisekarte', 'imbiss', 'gasthof', 'küche', 'speisen', 'gerichte', 'mittagstisch', 'abendessen', 'lecker'],
  'trinken': ['bar', 'kneipe', 'pub', 'biergarten', 'café', 'getränke', 'cocktails', 'weinstube'],
  'bier': ['kneipe', 'pub', 'biergarten', 'brauhaus', 'bar', 'bier'],
  'pizza': ['pizza', 'pizzeria', 'steinofenpizza', 'pasta', 'italienisch', 'ristorante'],
  'pasta': ['pasta', 'italienisch', 'spaghetti', 'pizza', 'pizzeria'],
  'burger': ['burger', 'hamburger', 'cheeseburger', 'pommes', 'fast food', 'imbiss'],
  'pommes': ['pommes', 'currywurst', 'imbiss', 'fast food', 'snack'],
  'currywurst': ['currywurst', 'pommes', 'imbiss', 'bratwurst'],
  'schnitzel': ['schnitzel', 'restaurant', 'gasthof', 'deutsche küche'],
  'steak': ['steak', 'steakhouse', 'fleisch', 'grill', 'restaurant'],
  'fondue': ['fondue', 'käsefondue', 'fleischfondue', 'kurparkstuben'],
  'brötchen': ['bäckerei', 'baeckerei', 'brötchen', 'broetchen', 'brot', 'frühstück', 'café'],
  'broetchen': ['bäckerei', 'baeckerei', 'brötchen', 'brot', 'frühstück'],
  'frühstück': ['frühstück', 'fruehstueck', 'café', 'cafe', 'bäckerei', 'buffet', 'brunch'],
  'fruehstueck': ['frühstück', 'café', 'cafe', 'bäckerei', 'brunch'],
  'kaffee': ['café', 'cafe', 'kaffee', 'kuchen', 'torte', 'konditorei', 'bäckerei'],
  'kuchen': ['kuchen', 'torte', 'café', 'cafe', 'konditorei', 'bäckerei'],
  'eis': ['eisdiele', 'eiscafe', 'eisspezialitäten', 'kugeln'],

  // Hotel / Übernachten
  'hotel': ['hotel', 'hotels & unterkünfte', 'übernachtung', 'pension', 'zimmer', 'garni', 'resort'],
  'übernachten': ['hotel', 'ferienwohnung', 'pension', 'unterkunft', 'zimmer', 'gasthof'],
  'uebernachten': ['hotel', 'ferienwohnung', 'pension', 'unterkunft', 'zimmer'],
  'schlafen': ['hotel', 'unterkunft', 'ferienwohnung', 'pension'],
  'unterkunft': ['unterkunft', 'hotel', 'ferienwohnung', 'fewo', 'pension', 'gästehaus'],
  'ferienwohnung': ['ferienwohnung', 'fewo', 'apartments', 'unterkunft'],
  'fewo': ['ferienwohnung', 'fewo', 'unterkunft', 'apartments'],
  'wellness': ['wellness', 'sauna', 'spa', 'massage', 'schwimmbad', 'badelandschaft', 'erholung'],
  'sauna': ['sauna', 'wellness', 'spa', 'bad', 'schwimmbad'],
  'schwimmen': ['schwimmbad', 'pool', 'badelandschaft', 'hallenbad', 'freibad'],

  // Auto / KFZ / Mobilität
  'auto': ['kfz', 'werkstatt', 'auto', 'reparatur', 'reifen', 'tüv', 'inspektion', 'autowerkstatt'],
  'kfz': ['kfz', 'auto', 'werkstatt', 'reparatur', 'tüv', 'reifen', 'kfz-werkstätten'],
  'werkstatt': ['werkstatt', 'kfz', 'reparatur', 'handwerk', 'inspektion'],
  'reparieren': ['reparatur', 'werkstatt', 'instandsetzung', 'service'],
  'reparatur': ['reparatur', 'werkstatt', 'reparieren', 'instandsetzung'],
  'tanken': ['tankstelle', 'benzin', 'diesel', 'kraftstoff', 'e-laden'],
  'tankstelle': ['tankstelle', 'kraftstoff', 'benzin', 'diesel', 'shop'],
  'reifen': ['reifen', 'räder', 'kfz', 'werkstatt', 'reifenwechsel'],

  // Fahrrad / Bike
  'fahrrad': ['fahrrad', 'bike', 'e-bike', 'mountainbike', 'radsport', 'verleih', 'fahrradverleih'],
  'bike': ['bike', 'mountainbike', 'e-bike', 'fahrrad', 'bikepark', 'radsport'],
  'mountainbike': ['mountainbike', 'bike', 'bikepark', 'trail', 'fahrrad'],
  'ebike': ['e-bike', 'ebike', 'fahrrad', 'bike', 'verleih'],

  // Wintersport / Ski
  'ski': ['ski', 'skiverleih', 'skischule', 'skilift', 'karussell', 'wintersport', 'piste', 'schnee'],
  'skiverleih': ['skiverleih', 'ski', 'snowboard', 'verleih', 'ausrüstung', 'helme'],
  'skischule': ['skischule', 'skikurs', 'snowboardkurs', 'skilehrer'],
  'snowboard': ['snowboard', 'ski', 'wintersport', 'skiverleih'],
  'rodel': ['rodel', 'schlitten', 'rodelbahn', 'bobbahn', 'eisarena'],
  'schlitten': ['schlitten', 'rodel', 'rodelbahn'],

  // Gesundheit & Medizin
  'arzt': ['arzt', 'ärzte & praxen', 'praxis', 'hausarzt', 'medizin', 'facharzt'],
  'zahnarzt': ['zahnarzt', 'zahn', 'zähne', 'prophylaxe', 'dental'],
  'apotheke': ['apotheke', 'medikamente', 'arzneimittel', 'notdienst'],
  'physio': ['physiotherapie', 'krankengymnastik', 'massage', 'therapie'],
  'physiotherapie': ['physiotherapie', 'massage', 'krankengymnastik', 'reha'],
  'tierarzt': ['tierarzt', 'tierarztpraxis', 'tiere', 'hund', 'katze'],

  // Einkaufen & Mode & Handwerk
  'einkaufen': ['einzelhandel', 'supermarkt', 'geschäft', 'mode', 'lebensmittel', 'shopping'],
  'supermarkt': ['supermarkt', 'lebensmittel', 'discounter', 'markt', 'einkauf'],
  'lebensmittel': ['lebensmittel', 'supermarkt', 'feinkost', 'bäcker', 'metzger'],
  'mode': ['mode', 'bekleidung', 'kleidung', 'fashion', 'boutique', 'textilien'],
  'kleidung': ['mode', 'bekleidung', 'kleidung', 'textilien', 'fashion'],
  'schuhe': ['schuhe', 'schuhhaus', 'stiefel', 'sneaker'],
  'handwerk': ['handwerk', 'bau', 'renovierung', 'meisterbetrieb'],
  'dach': ['dachdecker', 'bedachung', 'dacharbeiten'],
  'dachdecker': ['dachdecker', 'bedachung', 'dach', 'zimmerei'],
  'schreiner': ['schreiner', 'tischler', 'möbel', 'innenausbau', 'holz'],
  'tischler': ['tischler', 'schreiner', 'holz', 'möbel'],
  'elektro': ['elektro', 'elektriker', 'elektrotechnik', 'strom', 'installation'],
  'elektriker': ['elektro', 'elektriker', 'strom', 'installation', 'beleuchtung'],
  'solar': ['photovoltaik', 'solar', 'pv-anlage', 'solaranlagen', 'energie'],
  'photovoltaik': ['photovoltaik', 'solar', 'pv-anlage', 'solaranlagen', 'erneuerbare energien'],
  'wärmepumpe': ['wärmepumpe', 'heizung', 'sanitär', 'energieberatung'],
  'sanitär': ['sanitär', 'bad', 'badezimmer', 'heizung', 'klempner'],
  'heizung': ['heizung', 'sanitär', 'wärmepumpe', 'klima', 'lüftung'],
  'maler': ['maler', 'lackierer', 'anstrich', 'tapeten', 'fassade'],

  // Finanzen, Recht, Werbung
  'versicherung': ['versicherung', 'versicherungsagenturen', 'vorsorge', 'absicherung'],
  'bank': ['bank', 'volksbank', 'sparkasse', 'geldautomat', 'finanzen', 'kredit'],
  'geld': ['bank', 'geldautomat', 'finanzen', 'sparkasse', 'volksbank'],
  'steuer': ['steuerberater', 'steuern', 'steuerberatung', 'finanzamt'],
  'steuerberater': ['steuerberater', 'steuerberatung', 'steuern', 'buchhaltung'],
  'anwalt': ['rechtsanwalt', 'anwalt', 'notar', 'kanzlei', 'jurist'],
  'rechtsanwalt': ['rechtsanwalt', 'anwalt', 'kanzlei', 'recht', 'notar'],
  'marketing': ['werbeagentur', 'marketing', 'marketingdienstleistungen', 'webdesign', 'werbung', 'seo'],
  'werbung': ['werbeagentur', 'marketing', 'grafikdesign', 'werbung', 'print', 'digital'],
  'webdesign': ['webdesign', 'website', 'homepage', 'internetagentur', 'marketing'],

  // Coworking & Office / Workation
  'coworking': ['coworking', 'cowolo', 'arbeitsplatz', 'schreibtisch', 'desk', 'büro', 'workation', 'meetingraum', 'konferenzraum'],
  'büro': ['büro', 'coworking', 'cowolo', 'arbeitsplatz', 'schreibtisch', 'desk', 'office'],
  'office': ['office', 'büro', 'coworking', 'cowolo', 'arbeitsplatz', 'desk'],
  'workation': ['workation', 'coworking', 'cowolo', 'arbeitsplatz', 'urlaub', 'arbeiten'],
  'arbeitsplatz': ['arbeitsplatz', 'coworking', 'cowolo', 'schreibtisch', 'desk', 'büro'],
  'meetingraum': ['meetingraum', 'konferenzraum', 'tagung', 'coworking', 'cowolo'],
  'konferenzraum': ['konferenzraum', 'meetingraum', 'tagung', 'coworking', 'cowolo'],

  // Dutch synonyms
  'eten': ['restaurant', 'gastronomie', 'essen', 'imbiss', 'snack', 'gerechten', 'lunch', 'diner'],
  'drinken': ['bar', 'café', 'pub', 'bier', 'biergarten', 'drankjes'],
  'overnachten': ['hotel', 'hotels & unterkünfte', 'vakantie', 'slapen', 'overnachting', 'pension', 'vakantiehuis', 'appartement'],
  'slapen': ['hotel', 'vakantiehuis', 'appartement', 'pension', 'overnachten'],
  'fiets': ['fahrrad', 'fiets', 'bike', 'e-bike', 'mountainbike', 'verleih', 'fietsverhuur'],
  'huren': ['verleih', 'verhuur', 'mieten', 'fietsverhuur', 'skiverhuur'],
  'skien': ['ski', 'skiverleih', 'skischool', 'wintersport', 'piste'],
  'winkelen': ['einkaufen', 'shopping', 'supermarkt', 'mode', 'kleding'],
  'kleding': ['mode', 'bekleidung', 'kleding', 'schoenen'],
  'schoenen': ['schuhe', 'schoenen', 'stiefel'],
  'dokter': ['arzt', 'dokter', 'huisarts', 'praktijk', 'medisch'],
  'tandarts': ['zahnarzt', 'tandarts', 'tanden'],
  'bakker': ['bäckerei', 'bakker', 'brood', 'ontbijt', 'café']
};

/**
 * Normalizes text for search: removes punctuation, trims, lowercases
 */
export function normalizeSearchString(str: string): string {
  if (!str) return '';
  return str
    .toLowerCase()
    .replace(/[?!.,;:()[\]{}"'„“»«`´’‘\/\\#+*~=<>]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Parses user input into search tokens, recognizing natural language queries
 */
export function parseSearchQuery(query: string): ParsedSearchQuery {
  const raw = query.trim();
  const normalized = normalizeSearchString(raw);

  // Split into raw words
  const words = normalized.split(' ').filter(w => w.length > 0);

  // Check if it looks like a natural language question
  const isQuestion = raw.includes('?') ||
    /^(wo|wer|wie|was|kann|gibt|haben|suche|brauche|waar|kan|wie|wat|is er)\b/i.test(raw);

  const wantsSundayOpen = /\b(sonntag|sonntags|zondag|zondags)\b/i.test(normalized);
  const wantsJobs = /\b(job|jobs|arbeit|stelle|stellen|karriere|ausbildung|vacature|vacatures)\b/i.test(normalized);
  const wantsEvents = /\b(event|events|veranstaltung|veranstaltungen|konzert|fest|party|evenement|evenementen)\b/i.test(normalized);

  // Filter stop words to find core intent tokens
  let coreTokens = words.filter(w => !STOP_WORDS.has(w) && w.length > 1);

  // If all words were stop words (e.g. user just typed "wo ist"), keep the words
  if (coreTokens.length === 0 && words.length > 0) {
    coreTokens = words.filter(w => w.length > 1);
  }

  // Gather semantic synonyms for core tokens
  const semanticSet = new Set<string>();
  for (const token of coreTokens) {
    if (SEMANTIC_SYNONYMS[token]) {
      SEMANTIC_SYNONYMS[token].forEach(syn => semanticSet.add(syn.toLowerCase()));
    }
    // Also check partial word stems (e.g. "döneressen" -> döner)
    for (const [key, synList] of Object.entries(SEMANTIC_SYNONYMS)) {
      if (token.includes(key) || key.includes(token)) {
        synList.forEach(syn => semanticSet.add(syn.toLowerCase()));
      }
    }
  }

  return {
    raw,
    normalized,
    coreTokens,
    semanticKeywords: Array.from(semanticSet),
    isNaturalLanguage: isQuestion || coreTokens.length !== words.length,
    wantsSundayOpen,
    wantsJobs,
    wantsEvents
  };
}

/**
 * Builds a holistic full-text profile corpus for deep multi-field matching
 */
export function buildBusinessFulltextCorpus(bus: Business): {
  primaryText: string;
  secondaryText: string;
  deepText: string;
} {
  const servicesStr = (bus.services || []).concat(bus.services_nl || []).join(' ');
  const productsStr = (bus.products || []).concat(bus.products_nl || []).join(' ');
  const addCategoriesStr = (bus.additionalCategories || []).map(ac => `${ac.category} ${ac.subcategory || ''}`).join(' ');

  const primaryText = normalizeSearchString(
    `${bus.name} ${bus.category} ${bus.subcategory || ''} ${addCategoriesStr} ${servicesStr} ${productsStr}`
  );

  const contactStr = bus.contactPerson ? `${bus.contactPerson.name} ${bus.contactPerson.role || ''}` : '';
  const badgesStr = (bus.featureBadges || []).join(' ');
  const secondaryText = normalizeSearchString(
    `${bus.description || ''} ${bus.description_nl || ''} ${bus.extendedDescription || ''} ${bus.extendedDescription_nl || ''} ${bus.district || ''} ${bus.address || ''} ${bus.city || ''} ${contactStr} ${badgesStr}`
  );

  const eventsStr = (bus.events || []).map(e => `${e.title} ${e.description || ''} ${e.category} ${e.location || ''}`).join(' ');
  const jobsStr = (bus.jobs || []).map(j => `${j.title} ${j.description || ''} ${j.type || ''}`).join(' ');
  const newsStr = (bus.businessNews || []).map(n => `${n.title} ${n.excerpt || ''} ${n.content || ''}`).join(' ');
  const docsStr = (bus.documents || []).map(d => `${d.title} ${d.type}`).join(' ');
  const reviewsStr = (bus.reviews || []).map(r => `${r.authorName || ''} ${r.text || ''}`).join(' ');

  const deepText = normalizeSearchString(
    `${eventsStr} ${jobsStr} ${newsStr} ${docsStr} ${reviewsStr} ${bus.phone || ''} ${bus.email || ''} ${bus.website || ''}`
  );

  return { primaryText, secondaryText, deepText };
}

/**
 * Scores a business profile against a parsed search query
 */
export function scoreBusinessMatch(bus: Business, parsed: ParsedSearchQuery): SearchMatchResult {
  const { normalized, coreTokens, semanticKeywords, wantsSundayOpen, wantsJobs, wantsEvents } = parsed;

  if (!normalized) {
    return { business: bus, score: 0 };
  }

  const normName = normalizeSearchString(bus.name);
  const normCat = normalizeSearchString(bus.category);
  const normSubcat = normalizeSearchString(bus.subcategory || '');
  const allServices = (bus.services || []).concat(bus.services_nl || []);
  const allProducts = (bus.products || []).concat(bus.products_nl || []);
  const normServices = normalizeSearchString(allServices.join(' '));
  const normProducts = normalizeSearchString(allProducts.join(' '));
  const normDesc = normalizeSearchString(`${bus.description || ''} ${bus.description_nl || ''} ${bus.extendedDescription || ''} ${bus.extendedDescription_nl || ''}`);
  const normDistrict = normalizeSearchString(`${bus.district || ''} ${bus.address || ''}`);

  let score = 0;
  let matchedReason: SearchMatchResult['matchedReason'] = undefined;

  // 1. Direct exact or prefix match on name
  if (normName === normalized) {
    score += 300;
    matchedReason = { type: 'name', text: bus.name };
  } else if (normName.startsWith(normalized)) {
    score += 200;
    matchedReason = { type: 'name', text: bus.name };
  } else if (normName.includes(normalized)) {
    score += 150;
    matchedReason = { type: 'name', text: bus.name };
  }

  // 2. Direct exact or prefix match on category / subcategory
  if (normSubcat && (normSubcat === normalized || normSubcat.includes(normalized))) {
    score += 120;
    if (!matchedReason) matchedReason = { type: 'category', text: bus.subcategory! };
  } else if (normCat === normalized || normCat.includes(normalized)) {
    score += 90;
    if (!matchedReason) matchedReason = { type: 'category', text: bus.category };
  }

  // 3. Direct match on services or products
  const matchingService = allServices.find(s => normalizeSearchString(s).includes(normalized));
  if (matchingService) {
    score += 130;
    if (!matchedReason) matchedReason = { type: 'service', text: matchingService };
  }

  const matchingProduct = allProducts.find(p => normalizeSearchString(p).includes(normalized));
  if (matchingProduct) {
    score += 130;
    if (!matchedReason) matchedReason = { type: 'product', text: matchingProduct };
  }

  // 4. Token & Fulltext Holistic Matching
  const { primaryText, secondaryText, deepText } = buildBusinessFulltextCorpus(bus);
  const combinedAllText = `${primaryText} ${secondaryText} ${deepText}`;

  let matchedTokensCount = 0;
  for (const token of coreTokens) {
    let tokenFound = false;

    // Name match
    if (normName.includes(token)) {
      score += 70;
      tokenFound = true;
      if (!matchedReason) matchedReason = { type: 'name', text: bus.name };
    }

    // Services & Products
    const tokenService = allServices.find(s => normalizeSearchString(s).includes(token));
    if (tokenService) {
      score += 55;
      tokenFound = true;
      if (!matchedReason) matchedReason = { type: 'service', text: tokenService };
    }

    const tokenProduct = allProducts.find(p => normalizeSearchString(p).includes(token));
    if (tokenProduct) {
      score += 55;
      tokenFound = true;
      if (!matchedReason) matchedReason = { type: 'product', text: tokenProduct };
    }

    // Category / Subcategory
    if (normSubcat.includes(token) || normCat.includes(token)) {
      score += 45;
      tokenFound = true;
      if (!matchedReason) matchedReason = { type: 'category', text: bus.subcategory || bus.category };
    }

    // Description & Extended
    if (normDesc.includes(token)) {
      score += 35;
      tokenFound = true;
      if (!matchedReason) {
        // Extract a clean snippet
        const idx = normDesc.indexOf(token);
        const start = Math.max(0, idx - 20);
        const end = Math.min(normDesc.length, idx + token.length + 40);
        matchedReason = { type: 'description', text: `...${normDesc.slice(start, end).trim()}...` };
      }
    }

    // District / Address
    if (normDistrict.includes(token)) {
      score += 25;
      tokenFound = true;
    }

    // Documents (e.g. Speisekarte / Menü)
    const matchingDoc = (bus.documents || []).find(d => normalizeSearchString(`${d.title} ${d.type}`).includes(token));
    if (matchingDoc) {
      score += 35;
      tokenFound = true;
      if (!matchedReason) matchedReason = { type: 'document', text: matchingDoc.title };
    }

    // Reviews (e.g. customer praised "bester Döner")
    const matchingReview = (bus.reviews || []).find(r => normalizeSearchString(r.text || '').includes(token));
    if (matchingReview) {
      score += 30;
      tokenFound = true;
      if (!matchedReason) {
        const text = matchingReview.text;
        const idx = text.toLowerCase().indexOf(token);
        const start = Math.max(0, idx - 15);
        const end = Math.min(text.length, idx + token.length + 35);
        matchedReason = { type: 'review', text: `"${text.slice(start, end).trim()}..."` };
      }
    }

    // Events & Jobs
    if (wantsEvents && Array.isArray(bus.events) && bus.events.some(e => normalizeSearchString(`${e.title} ${e.description}`).includes(token))) {
      score += 40;
      tokenFound = true;
      const ev = bus.events.find(e => normalizeSearchString(`${e.title} ${e.description}`).includes(token));
      if (!matchedReason && ev) matchedReason = { type: 'event', text: ev.title };
    }

    if (wantsJobs && Array.isArray(bus.jobs) && bus.jobs.some(j => normalizeSearchString(`${j.title} ${j.description}`).includes(token))) {
      score += 40;
      tokenFound = true;
      const jb = bus.jobs.find(j => normalizeSearchString(`${j.title} ${j.description}`).includes(token));
      if (!matchedReason && jb) matchedReason = { type: 'job', text: jb.title };
    }

    // Deep text fallback
    if (!tokenFound && deepText.includes(token)) {
      score += 20;
      tokenFound = true;
    }

    if (tokenFound) {
      matchedTokensCount++;
    }
  }

  // 5. Semantic synonyms matching (e.g. "Döner" -> Imbiss, Kebab, Drehspieß)
  if (semanticKeywords.length > 0) {
    let semanticMatches = 0;
    for (const syn of semanticKeywords) {
      if (combinedAllText.includes(syn)) {
        semanticMatches++;
        score += 25;
        if (!matchedReason) {
          matchedReason = { type: 'semantic', text: syn };
        }
      }
    }
    if (semanticMatches > 0) {
      score += 20;
    }
  }

  // 6. Natural Language Question Bonus
  // If user asked a question and at least one core token was found
  if (parsed.isNaturalLanguage && (matchedTokensCount > 0 || score > 40)) {
    // If every core token was matched, give high bonus
    if (coreTokens.length > 0 && matchedTokensCount === coreTokens.length) {
      score += 100;
    }
  }

  // 7. Premium slight boost for tie-breaking
  if (bus.isPremium && score > 0) {
    score += 5;
  }

  // Verification: if core tokens exist, we require that at least one token matched OR direct phrase matched
  if (coreTokens.length > 0 && matchedTokensCount === 0 && !combinedAllText.includes(normalized)) {
    // Check if semantic concept matched strongly
    const hasStrongSemantic = semanticKeywords.some(syn => primaryText.includes(syn) || secondaryText.includes(syn));
    if (!hasStrongSemantic) {
      score = 0;
    }
  }

  return { business: bus, score, matchedReason };
}

/**
 * Filter and search businesses using Natural Language & holistic Full-Text scoring
 */
export function searchBusinesses(
  businesses: Business[],
  query: string,
  options?: {
    category?: string;
    location?: string;
    onlySundayOpen?: boolean;
    isSundayOpenFn?: (hours: any) => boolean;
    limit?: number;
  }
): SearchMatchResult[] {
  if (!businesses || !Array.isArray(businesses)) return [];

  const rawQuery = (query || '').trim();
  const parsed = parseSearchQuery(rawQuery);

  const activeCategory = options?.category || 'Alle';
  const activeLocation = options?.location || 'Alle';
  const onlySunday = options?.onlySundayOpen || false;
  const isSundayOpenFn = options?.isSundayOpenFn;

  const results: SearchMatchResult[] = [];

  for (const bus of businesses) {
    if (bus.status === 'pending' || bus.isActive === false) continue;

    // Location filter
    if (activeLocation !== 'Alle') {
      const busLoc = bus.district || 'Winterberg';
      if (busLoc !== activeLocation) continue;
    }

    // Category filter
    if (activeCategory !== 'Alle') {
      const inAdditional = bus.additionalCategories?.some(
        ac => ac.category === activeCategory || ac.subcategory === activeCategory
      );
      const matchesCat = bus.category === activeCategory || bus.subcategory === activeCategory || inAdditional;
      if (!matchesCat) continue;
    }

    // Sunday open filter
    if (onlySunday && isSundayOpenFn && !isSundayOpenFn(bus.openingHours)) {
      continue;
    }

    // If query is empty, all businesses that match category/location pass with score 1
    if (!rawQuery) {
      results.push({ business: bus, score: 1 });
      continue;
    }

    // Score the business match
    const match = scoreBusinessMatch(bus, parsed);
    if (match.score > 0) {
      results.push(match);
    }
  }

  // Sort by relevance score descending
  results.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    // Tie-breaker: Premium first
    if (a.business.isPremium && !b.business.isPremium) return -1;
    if (!a.business.isPremium && b.business.isPremium) return 1;
    return a.business.name.localeCompare(b.business.name);
  });

  if (options?.limit && options.limit > 0) {
    return results.slice(0, options.limit);
  }

  return results;
}
