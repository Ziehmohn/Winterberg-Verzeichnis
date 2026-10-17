import { Business } from '../types';
import { resolveTokenIntent, scoreBusinessForIntent } from './searchIntents';

export interface ParsedSearchQuery {
  raw: string;
  normalized: string;
  subjectTokens: string[];
  actionTokens: string[];
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

// Conversational stop words & fillers (German & Dutch)
const STOP_WORDS = new Set([
  // German
  'wo', 'kann', 'könnte', 'koennte', 'ich', 'wir', 'man', 'du', 'ihr', 'sie',
  'gibt', 'es', 'hier', 'in', 'im', 'am', 'an', 'auf', 'aus', 'bei', 'nach', 'von', 'zu', 'zum', 'zur',
  'winterberg', 'sauerland',
  'ein', 'eine', 'einer', 'eines', 'einem', 'einen',
  'der', 'die', 'das', 'den', 'dem', 'des',
  'wer', 'wie', 'was', 'welcher', 'welche', 'welches', 'welchem', 'welchen',
  'möchte', 'moechte', 'will', 'wollte', 'brauche', 'brauchen', 'benötige', 'benoetige',
  'suche', 'suchen', 'gesucht', 'finde', 'finden', 'bietet', 'hat', 'haben',
  'und', 'oder', 'aber', 'denn', 'mit', 'für', 'fuer',
  'sehr', 'gut', 'gute', 'guten', 'gutes', 'bester', 'beste', 'bestes', 'besten',
  'lecker', 'leckere', 'leckeren', 'leckeres', 'frisch', 'frische', 'frischen',
  'günstig', 'guenstig', 'billig', 'preiswert', 'schnell', 'einfach',
  'bitte', 'mal', 'gerne', 'irgendwo', 'jemand', 'etwas', 'lassen', 'zeigen',
  // Dutch
  'waar', 'kan', 'ik', 'je', 'we', 'men', 'jullie',
  'is', 'er', 'hier', 'een', 'de', 'het',
  'wie', 'wat', 'welke', 'welk',
  'heeft', 'hebben', 'vind', 'vinden', 'zoek', 'zoeken', 'gezocht',
  'graag', 'lekker', 'lekkere', 'beste', 'goed', 'goede',
  'bij', 'voor', 'van', 'en', 'of', 'alsjeblieft', 'eens', 'ergens'
]);

// Generic Action Verbs: describe an action, NOT a specific product/entity
const ACTION_VERBS = new Set([
  'kaufen', 'kaufe', 'gekauft', 'kauf', 'einkaufen', 'shoppen', 'besorgen', 'holen', 'bekommen', 'kriegen', 'kopen',
  'essen', 'speisen', 'gegessen', 'frühstücken', 'snacken', 'eten',
  'trinken', 'getrunken', 'drinken',
  'leihen', 'ausleihen', 'mieten', 'geliehen', 'gemietet', 'verleih', 'huren',
  'reparieren', 'repariert', 'reparatur', 'instandsetzen',
  'übernachten', 'uebernachten', 'schlafen', 'wohnen', 'overnachten', 'slapen'
]);

/**
 * Word stemmer for common German & Dutch plurals / inflections
 */
export function stemWord(w: string): string {
  const norm = w.toLowerCase().trim();
  if (norm === 'skier' || norm === 'skiern') return 'ski';
  if (norm === 'brille' || norm === 'brillen') return 'brille';
  if (norm === 'hose' || norm === 'hosen') return 'hose';
  if (norm === 'schraube' || norm === 'schrauben') return 'schraube';
  if (norm === 'nagel' || norm === 'nägel' || norm === 'naegel') return 'nagel';
  if (norm === 'apotheke' || norm === 'apotheken') return 'apotheke';
  if (norm === 'küche' || norm === 'küchen') return 'küche';
  if (norm === 'bücher' || norm === 'buecher') return 'buch';
  if (norm === 'schuhe' || norm === 'schoenen') return 'schuh';
  if (norm === 'blumen') return 'blume';
  if (norm === 'autos') return 'auto';
  if (norm === 'hotels') return 'hotel';
  if (norm === 'pizzen') return 'pizza';
  if (norm === 'bäcker' || norm === 'bäckereien') return 'bäckerei';
  if (norm.endsWith('en') && norm.length > 5) return norm.slice(0, -2);
  if (norm.endsWith('e') && norm.length > 4) return norm.slice(0, -1);
  if (norm.endsWith('s') && norm.length > 4) return norm.slice(0, -1);
  return norm;
}

// Specific domain synonyms for Subjects & Entities
const DOMAIN_SYNONYMS: Record<string, string[]> = {
  // Optik / Brillen
  'brille': ['brille', 'brillen', 'optik', 'optiker', 'augenoptik', 'augenoptiker', 'sehhilfe', 'brillengläser', 'sonnenbrille', 'kontaktlinsen', 'brillenschmiede'],
  'optiker': ['optiker', 'augenoptiker', 'brille', 'brillen', 'sehhilfe', 'sehtest', 'augenoptik', 'brillenschmiede', 'optik'],
  'optik': ['optik', 'optiker', 'augenoptik', 'augenoptiker', 'brille', 'brillen', 'brillenschmiede'],

  // Döner / Kebab
  'döner': ['döner', 'doener', 'kebab', 'kebap', 'shawarma', 'dürüm', 'dueruem', 'lahmacun', 'drehspieß', 'drehspiess', 'türkisch'],
  'doener': ['döner', 'doener', 'kebab', 'kebap', 'shawarma', 'dürüm', 'dueruem', 'lahmacun', 'drehspieß', 'drehspiess', 'türkisch'],
  'kebab': ['döner', 'doener', 'kebab', 'kebap', 'shawarma', 'dürüm', 'drehspieß'],
  'kebap': ['döner', 'doener', 'kebab', 'kebap', 'shawarma', 'dürüm', 'drehspieß'],
  'shawarma': ['shawarma', 'döner', 'kebab', 'ceylon'],
  'dürüm': ['dürüm', 'dueruem', 'döner', 'kebab', 'rollo'],
  'dueruem': ['dürüm', 'dueruem', 'döner', 'kebab', 'rollo'],

  // Bücher
  'buch': ['buch', 'bücher', 'buecher', 'buchhandlung', 'buchladen', 'lesen', 'taschenbuch', 'wortreich'],
  'buchhandlung': ['buchhandlung', 'buchladen', 'buch', 'bücher', 'buecher', 'wortreich'],

  // Blumen / Floristik
  'blume': ['blumen', 'blume', 'floristik', 'blumengeschäft', 'blumenladen', 'gärtnerei', 'pflanzen', 'schnittblumen'],
  'floristik': ['floristik', 'blumen', 'blumengeschäft', 'pflanzen', 'gärtnerei'],

  // Schuhe
  'schuh': ['schuhe', 'schuh', 'schuhgeschäft', 'schuhhaus', 'stiefel', 'sneaker', 'wanderschuhe', 'winterschuhe', 'schoenen'],
  'schoenen': ['schuhe', 'schoenen', 'stiefel', 'schuhhaus'],

  // Kleidung / Mode
  'kleidung': ['kleidung', 'mode', 'bekleidung', 'fashion', 'boutique', 'textilien', 'damenmode', 'herrenmode', 'kleding'],
  'mode': ['mode', 'bekleidung', 'kleidung', 'fashion', 'boutique', 'textilien', 'damenmode', 'herrenmode'],
  'kleding': ['mode', 'bekleidung', 'kleding', 'kleidung', 'fashion'],

  // Pizza / Pasta
  'pizza': ['pizza', 'pizzeria', 'steinofenpizza', 'pasta', 'italienisch', 'ristorante'],
  'pizzeria': ['pizzeria', 'pizza', 'italienisch', 'pasta', 'ristorante'],
  'pasta': ['pasta', 'spaghetti', 'italienisch', 'pizza', 'pizzeria'],

  // Burger / Fast Food
  'burger': ['burger', 'hamburger', 'cheeseburger', 'pommes', 'fast food', 'imbiss', 'mcdonalds'],
  'mcdonalds': ['mcdonalds', "mcdonald's", 'burger', 'fast food', 'mcdrive', 'mccafe', 'imbiss'],
  'fastfood': ['fast food', 'fastfood', 'burger', 'mcdonalds', 'pommes', 'imbiss'],
  'mcdrive': ['mcdrive', 'mcdonalds', 'burger', 'fast food'],
  'pommes': ['pommes', 'currywurst', 'imbiss', 'fast food'],
  'currywurst': ['currywurst', 'pommes', 'bratwurst', 'imbiss'],
  'schnitzel': ['schnitzel', 'restaurant', 'gasthof', 'deutsche küche'],
  'steak': ['steak', 'steakhouse', 'fleisch', 'grill', 'restaurant'],
  'fondue': ['fondue', 'käsefondue', 'fleischfondue', 'kurparkstuben'],

  // Bäcker / Frühstück
  'brötchen': ['bäckerei', 'baeckerei', 'brötchen', 'broetchen', 'brot', 'frühstück', 'café', 'konditorei', 'backwaren'],
  'broetchen': ['bäckerei', 'baeckerei', 'brötchen', 'brot', 'frühstück', 'bäckerei'],
  'brot': ['brot', 'bäckerei', 'baeckerei', 'brötchen', 'backwaren'],
  'frühstück': ['frühstück', 'fruehstueck', 'café', 'cafe', 'bäckerei', 'buffet', 'brunch', 'ontbijt'],
  'fruehstueck': ['frühstück', 'café', 'cafe', 'bäckerei', 'brunch'],
  'kaffee': ['café', 'cafe', 'kaffee', 'kuchen', 'torte', 'konditorei', 'bäckerei', 'koffie'],
  'kuchen': ['kuchen', 'torte', 'café', 'cafe', 'konditorei', 'bäckerei'],
  'bäcker': ['bäckerei', 'baeckerei', 'brot', 'brötchen', 'konditorei', 'backwaren', 'bakker'],
  'baeckerei': ['bäckerei', 'brot', 'brötchen', 'konditorei', 'backwaren'],
  'bakker': ['bäckerei', 'bakker', 'brood', 'ontbijt'],

  // Hotel / Übernachten
  'hotel': ['hotel', 'hotels & unterkünfte', 'resort', 'pension', 'zimmer', 'garni'],
  'ferienwohnung': ['ferienwohnung', 'fewo', 'apartments', 'unterkunft', 'ferienhaus'],
  'fewo': ['ferienwohnung', 'fewo', 'apartments', 'unterkunft'],
  'unterkunft': ['unterkunft', 'hotel', 'ferienwohnung', 'pension', 'gästehaus', 'zimmer'],
  'pension': ['pension', 'gasthof', 'garni', 'zimmer', 'unterkunft', 'hotel'],

  // Wellness / Sauna
  'sauna': ['sauna', 'wellness', 'spa', 'bad', 'schwimmbad', 'badelandschaft'],
  'wellness': ['wellness', 'sauna', 'spa', 'massage', 'schwimmbad', 'erholung'],
  'massage': ['massage', 'wellness', 'physiotherapie', 'entspannung'],
  'schwimmbad': ['schwimmbad', 'pool', 'badelandschaft', 'hallenbad', 'freibad'],

  // Auto / KFZ
  'auto': ['kfz', 'werkstatt', 'auto', 'reparatur', 'reifen', 'tüv', 'inspektion', 'autowerkstatt', 'autohaus', 'kraftfahrzeug'],
  'kfz': ['kfz', 'auto', 'werkstatt', 'reparatur', 'tüv', 'reifen', 'kfz-werkstätten'],
  'werkstatt': ['werkstatt', 'kfz', 'reparatur', 'handwerk', 'inspektion', 'autowerkstatt'],
  'tüv': ['tüv', 'hauptuntersuchung', 'inspektion', 'kfz', 'werkstatt'],
  'reifen': ['reifen', 'räder', 'kfz', 'werkstatt', 'reifenwechsel'],
  'tankstelle': ['tankstelle', 'kraftstoff', 'benzin', 'diesel', 'tanken'],

  // Fahrrad / Bike
  'fahrrad': ['fahrrad', 'bike', 'e-bike', 'mountainbike', 'radsport', 'fahrradverleih', 'bikeverleih', 'fiets'],
  'bike': ['bike', 'mountainbike', 'e-bike', 'fahrrad', 'bikepark', 'radsport'],
  'ebike': ['e-bike', 'ebike', 'fahrrad', 'bike', 'verleih'],
  'mountainbike': ['mountainbike', 'bike', 'bikepark', 'trail', 'fahrrad'],
  'fiets': ['fahrrad', 'fiets', 'bike', 'e-bike', 'fietsverhuur'],

  // Ski / Wintersport
  'ski': ['ski', 'skier', 'skilift', 'skiverleih', 'skischule', 'wintersport', 'piste', 'schnee', 'skiverhuur'],
  'skiverleih': ['skiverleih', 'ski', 'snowboard', 'ausrüstung', 'helme', 'skiverhuur'],
  'skischule': ['skischule', 'skikurs', 'snowboardkurs', 'skilehrer', 'skischool'],
  'snowboard': ['snowboard', 'ski', 'wintersport', 'skiverleih'],
  'schlitten': ['schlitten', 'rodel', 'rodelbahn'],

  // Ärzte & Gesundheit
  'arzt': ['arzt', 'ärzte & praxen', 'praxis', 'hausarzt', 'facharzt', 'medizin', 'dokter'],
  'hausarzt': ['hausarzt', 'arzt', 'ärzte & praxen', 'praxis', 'allgemeinmedizin'],
  'zahnarzt': ['zahnarzt', 'zahn', 'zähne', 'prophylaxe', 'dental', 'tandarts'],
  'apotheke': ['apotheke', 'medikamente', 'arzneimittel', 'notdienst', 'apotheek'],
  'physiotherapie': ['physiotherapie', 'krankengymnastik', 'massage', 'therapie'],
  'tierarzt': ['tierarzt', 'tierarztpraxis', 'tiere', 'hund', 'katze'],

  // Handwerk
  'dachdecker': ['dachdecker', 'bedachung', 'dach', 'zimmerei'],
  'schreiner': ['schreiner', 'tischler', 'möbel', 'innenausbau', 'holz'],
  'tischler': ['tischler', 'schreiner', 'holz', 'möbel'],
  'elektriker': ['elektro', 'elektriker', 'strom', 'installation', 'beleuchtung'],
  'photovoltaik': ['photovoltaik', 'solar', 'pv-anlage', 'solaranlagen', 'energie'],
  'solar': ['photovoltaik', 'solar', 'pv-anlage', 'solaranlagen', 'energie'],
  'wärmepumpe': ['wärmepumpe', 'heizung', 'sanitär', 'energieberatung'],
  'maler': ['maler', 'lackierer', 'anstrich', 'tapeten', 'fassade'],

  // Finanzen / Recht / Beratung / Coworking
  'steuerberater': ['steuerberater', 'steuerberatung', 'steuern', 'buchhaltung'],
  'rechtsanwalt': ['rechtsanwalt', 'anwalt', 'kanzlei', 'recht', 'notar'],
  'anwalt': ['rechtsanwalt', 'anwalt', 'kanzlei', 'recht'],
  'versicherung': ['versicherung', 'versicherungsagenturen', 'vorsorge', 'absicherung'],
  'bank': ['bank', 'volksbank', 'sparkasse', 'geldautomat', 'finanzen'],
  'marketing': ['werbeagentur', 'marketing', 'marketingdienstleistungen', 'webdesign', 'werbung', 'seo'],
  'coworking': ['coworking', 'coworking space', 'arbeitsplatz', 'schreibtisch', 'meetingraum', 'cowolo'],

  // Technologie / Sicherheit / Drohnen
  'exorock': ['exorock', 'drohnenabwehr', 'drohnendetektion', 'drohne', 'drohnen', 'exodeck', 'citadel', 'sicherheitstechnik', 'luftraum'],
  'drohne': ['drohne', 'drohnen', 'drohnenabwehr', 'drohnendetektion', 'exorock', 'exodeck', 'citadel', 'luftraumüberwachung', 'uav'],
  'drohnen': ['drohne', 'drohnen', 'drohnenabwehr', 'drohnendetektion', 'exorock', 'exodeck', 'citadel', 'luftraumüberwachung', 'uav'],
  'drohnenabwehr': ['drohnenabwehr', 'drohnendetektion', 'exorock', 'exodeck', 'citadel', 'drohne', 'sicherheitstechnik'],
  'sicherheit': ['sicherheit', 'sicherheitstechnik', 'drohnenabwehr', 'exorock', 'kritis', 'überwachung'],
  'software': ['software', 'it', 'softwareentwicklung', 'exorock', 'app', 'systeme'],
  'systemhaus': ['systemhaus', 'great oak', 'it-service', 'it', 'computer', 'netzwerk', 'server', 'datev'],
  'great oak': ['great oak', 'greatoak', 'systemhaus', 'it-service', 'edv', 'netzwerk', 'datev', 'niedersfeld'],
  'it-service': ['it-service', 'it service', 'systemhaus', 'great oak', 'edv', 'netzwerk', 'computer'],
  'datev': ['datev', 'kanzlei', 'steuerberater', 'great oak', 'systemhaus', 'software'],
  'netzwerk': ['netzwerk', 'netzwerktechnik', 'wlan', 'firewall', 'great oak', 'systemhaus', 'it'],
  'edv': ['edv', 'it', 'systemhaus', 'computer', 'great oak', 'netzwerk'],

  // Baumarkt / Heimwerker / Baustoffe
  'baumarkt': ['baumarkt', 'baumärkte', 'hagebau', 'hagebaumarkt', 'müllenhoff', 'eisenwaren', 'werkzeug', 'baustoffe', 'heimwerker', 'gartencenter', 'bouwmarkt', 'bouwmarkten'],
  'hagebau': ['hagebau', 'hagebaumarkt', 'baumarkt', 'baumärkte', 'müllenhoff', 'heimwerker', 'werkzeug', 'baustoffe', 'gartencenter', 'farben', 'bouwmarkt'],
  'hagebaumarkt': ['hagebau', 'hagebaumarkt', 'baumarkt', 'baumärkte', 'müllenhoff', 'heimwerker', 'werkzeug', 'baustoffe', 'gartencenter', 'bouwmarkt'],
  'müllenhoff': ['müllenhoff', 'muellenhoff', 'hagebau', 'baumarkt', 'dachdecker', 'bedachung'],
  'muellenhoff': ['müllenhoff', 'muellenhoff', 'hagebau', 'baumarkt', 'dachdecker', 'bedachung'],
  'werkzeug': ['werkzeug', 'werkzeuge', 'baumarkt', 'hagebau', 'eisenwaren', 'heimwerker', 'lütteken', 'gereedschap'],
  'baustoffe': ['baustoffe', 'baustoff', 'baumaterial', 'baumarkt', 'happe', 'bauzentrum', 'hagebau'],
  'eisenwaren': ['eisenwaren', 'beschläge', 'werkzeug', 'schrauben', 'nägel', 'lütteken', 'hagebau', 'baumarkt'],
  'drogerie': ['drogerie', 'drogeriemarkt', 'dm', 'rossmann', 'parfümerie', 'kosmetik', 'pflege', 'drogisterij'],
  'tourismus': ['tourismus', 'tourist-information', 'touristik', 'wirtschaft', 'winterberg touristik', 'kurpark', 'gästeberatung', 'urlaub']
};

// Fallback category domains when ONLY an action verb is queried without any subject
const ACTION_VERB_DEFAULT_DOMAINS: Record<string, string[]> = {
  'kaufen': ['einzelhandel', 'supermarkt', 'geschäft', 'einkaufen', 'shopping'],
  'einkaufen': ['einzelhandel', 'supermarkt', 'geschäft', 'einkaufen', 'shopping'],
  'shoppen': ['einzelhandel', 'mode', 'geschäft', 'einkaufen', 'shopping'],
  'kopen': ['einzelhandel', 'supermarkt', 'geschäft', 'einkaufen', 'shopping'],
  'essen': ['restaurant', 'gastronomie', 'speisen', 'imbiss', 'gasthof', 'küche'],
  'eten': ['restaurant', 'gastronomie', 'speisen', 'imbiss', 'gasthof'],
  'trinken': ['kneipe', 'bar', 'pub', 'biergarten', 'gaststätte'],
  'drinken': ['kneipe', 'bar', 'pub', 'biergarten'],
  'übernachten': ['hotel', 'unterkunft', 'ferienwohnung', 'pension'],
  'uebernachten': ['hotel', 'unterkunft', 'ferienwohnung', 'pension'],
  'schlafen': ['hotel', 'unterkunft', 'ferienwohnung', 'pension'],
  'overnachten': ['hotel', 'unterkunft', 'ferienwohnung', 'pension'],
  'leihen': ['verleih', 'skiverleih', 'fahrradverleih', 'mieten'],
  'mieten': ['verleih', 'skiverleih', 'fahrradverleih', 'mieten'],
  'reparieren': ['werkstatt', 'reparatur', 'kfz', 'handwerk']
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
 * Checks if a haystack contains a term using word boundaries and domain-safe compound rules.
 * Avoids false substring matches (e.g. 'auto' in 'autorenlesung', 'buch' in 'terminbuchung').
 */
export function matchesKeyword(haystack: string, term: string): boolean {
  if (!haystack || !term) return false;
  const lowerH = haystack.toLowerCase();
  const lowerT = term.toLowerCase().trim();

  // 1. Direct word boundary match
  const wordBoundaryRegex = new RegExp(`(^|[^a-zA-Z0-9äöüÄÖÜß])${lowerT}([^a-zA-Z0-9äöüÄÖÜß]|$)`, 'i');
  if (wordBoundaryRegex.test(lowerH)) {
    return true;
  }

  // 2. Specific domain compounds & safety rules
  if (lowerT === 'buch') {
    return /\b(buch|bücher|buecher|buchhandlung|buchladen|taschenbuch|fachbuch|lesebuch|bilderbuch)\b/i.test(lowerH);
  }
  if (lowerT === 'auto') {
    return /\b(auto|autos|autohaus|autowerkstatt|autoreparatur|autohandel|autopflege|kfz)\b/i.test(lowerH);
  }
  if (lowerT === 'ski') {
    return /\b(ski|skier|skiern|skiverleih|skischule|skilift|skigebiet|skipiste|skiverhuur)\b/i.test(lowerH);
  }
  if (lowerT === 'brille') {
    return /\b(brille|brillen|brillenschmiede|sonnenbrille|lesebrille|gleitsichtbrille|brillengläser|sehhilfe|optik|optiker)\b/i.test(lowerH);
  }
  if (lowerT === 'blume' || lowerT === 'blumen') {
    return /\b(blume|blumen|blumengeschäft|blumenladen|floristik|schnittblumen|blumenstrauß|blumenstrauss)\b/i.test(lowerH);
  }
  if (lowerT === 'schuh' || lowerT === 'schuhe') {
    return /\b(schuh|schuhe|schuhgeschäft|schuhhaus|wanderschuhe|winterschuhe|sportschuhe|stiefel|sneaker|schoenen)\b/i.test(lowerH);
  }
  if (lowerT === 'döner' || lowerT === 'doener') {
    return /\b(döner|doener|dönerladen|kebab|kebap|shawarma|dürüm|dueruem|drehspieß)\b/i.test(lowerH);
  }
  if (lowerT === 'sauna') {
    return /\b(sauna|saunabereich|saunalandschaft|biosauna|finnische sauna|dampfbad)\b/i.test(lowerH);
  }

  // 3. Fallback for longer terms (>= 6 chars): match if starting at word boundary
  if (lowerT.length >= 6) {
    const startBoundaryRegex = new RegExp(`(^|[^a-zA-Z0-9äöüÄÖÜß])${lowerT}`, 'i');
    if (startBoundaryRegex.test(lowerH)) {
      return true;
    }
  }

  return false;
}

/**
 * Resolves all search variants and synonyms for a given subject token
 */
export function getDomainSynonyms(token: string): string[] {
  const norm = token.toLowerCase();
  const stemmed = stemWord(norm);
  const set = new Set<string>([norm, stemmed]);

  if (DOMAIN_SYNONYMS[norm]) {
    DOMAIN_SYNONYMS[norm].forEach(s => set.add(s.toLowerCase()));
  }
  if (DOMAIN_SYNONYMS[stemmed]) {
    DOMAIN_SYNONYMS[stemmed].forEach(s => set.add(s.toLowerCase()));
  }

  return Array.from(set);
}

/**
 * Parses user input into search tokens, distinguishing Subjects and Action Verbs
 */
export function parseSearchQuery(query: string): ParsedSearchQuery {
  const raw = query.trim();
  const normalized = normalizeSearchString(raw);

  const words = normalized.split(' ').filter(w => w.length > 0);

  const isQuestion = raw.includes('?') ||
    /^(wo|wer|wie|was|kann|gibt|haben|suche|brauche|waar|kan|wie|wat|is er)\b/i.test(raw);

  const wantsSundayOpen = /\b(sonntag|sonntags|zondag|zondags)\b/i.test(normalized);
  const wantsJobs = /\b(job|jobs|arbeit|stelle|stellen|karriere|ausbildung|vacature|vacatures)\b/i.test(normalized);
  const wantsEvents = /\b(event|events|veranstaltung|veranstaltungen|konzert|fest|party|evenement|evenementen)\b/i.test(normalized);

  const nonStopWords = words.filter(w => !STOP_WORDS.has(w) && w.length > 1);

  // Distinguish Subject Nouns from Action Verbs
  const subjectTokens: string[] = [];
  const actionTokens: string[] = [];

  for (const w of nonStopWords) {
    if (ACTION_VERBS.has(w)) {
      actionTokens.push(w);
    } else {
      subjectTokens.push(w);
    }
  }

  // If user only typed stop words, keep the longest word as fallback
  if (subjectTokens.length === 0 && actionTokens.length === 0 && words.length > 0) {
    subjectTokens.push(words[words.length - 1]);
  }

  return {
    raw,
    normalized,
    subjectTokens,
    actionTokens,
    isNaturalLanguage: isQuestion || nonStopWords.length !== words.length,
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
  const { normalized, subjectTokens, actionTokens, wantsJobs, wantsEvents } = parsed;

  if (!normalized) {
    return { business: bus, score: 0 };
  }

  const { primaryText, secondaryText, deepText } = buildBusinessFulltextCorpus(bus);
  const combinedAllText = `${primaryText} ${secondaryText} ${deepText}`;

  // Direct exact name match always gets top priority
  const normName = normalizeSearchString(bus.name);
  if (normName === normalized) {
    return { business: bus, score: 500, matchedReason: { type: 'name', text: bus.name } };
  }

  // --------------------------------------------------------------------------
  // CASE A: The query contains one or more Subject / Entity tokens (e.g. "Brille", "Döner", "Auto")
  // RULE: Every subject MUST be matched by the business (or its domain synonyms).
  // Generic action verbs (like "kaufen") do NOT qualify a business that doesn't sell the subject!
  // --------------------------------------------------------------------------
  if (subjectTokens.length > 0) {
    let allSubjectsMatched = true;
    let matchedReason: SearchMatchResult['matchedReason'] = undefined;
    let subjectScore = 0;

    for (const subject of subjectTokens) {
      let subjectFound = false;

      // 1. Intent Recognition layer (e.g. "Hose" -> Bekleidungsgeschäfte, "Sportschuhe" -> Sportgeschäfte, "Nägel/Schrauben" -> Baumarkt, "Imbiss" -> Imbisse)
      const intent = resolveTokenIntent(subject);
      if (intent) {
        const intentResult = scoreBusinessForIntent(bus, intent);
        if (intentResult.weight > 0) {
          subjectScore += intentResult.weight;
          subjectFound = true;
          if (!matchedReason) {
            matchedReason = { type: 'category', text: intentResult.label || intent.label };
          }
        }
      }

      const allowedVariants = getDomainSynonyms(subject);

      // 2. Direct name match bonus
      for (const variant of allowedVariants) {
        if (matchesKeyword(bus.name, variant)) {
          subjectScore += subjectFound ? 60 : 260;
          subjectFound = true;
          matchedReason = { type: 'name', text: bus.name };
          break;
        }
      }

      // 3. Services / Products match bonus
      const allServices = (bus.services || []).concat(bus.services_nl || []);
      for (const variant of allowedVariants) {
        const s = allServices.find(srv => matchesKeyword(srv, variant));
        if (s) {
          subjectScore += subjectFound ? 40 : 220;
          subjectFound = true;
          if (!matchedReason || matchedReason.type === 'category') {
            matchedReason = { type: 'service', text: s };
          }
          break;
        }
      }

      const allProducts = (bus.products || []).concat(bus.products_nl || []);
      for (const variant of allowedVariants) {
        const p = allProducts.find(prd => matchesKeyword(prd, variant));
        if (p) {
          subjectScore += subjectFound ? 40 : 220;
          subjectFound = true;
          if (!matchedReason || matchedReason.type === 'category') {
            matchedReason = { type: 'product', text: p };
          }
          break;
        }
      }

      // 4. Category / Subcategory match
      if (!subjectFound) {
        for (const variant of allowedVariants) {
          if (bus.subcategory && matchesKeyword(bus.subcategory, variant)) {
            subjectScore += 200;
            subjectFound = true;
            if (!matchedReason) matchedReason = { type: 'category', text: bus.subcategory };
            break;
          }
          if (matchesKeyword(bus.category, variant)) {
            subjectScore += 160;
            subjectFound = true;
            if (!matchedReason) matchedReason = { type: 'category', text: bus.category };
            break;
          }
        }
      }

      // 5. Description & Extended Description
      if (!subjectFound) {
        const fullDesc = `${bus.description || ''} ${bus.description_nl || ''} ${bus.extendedDescription || ''} ${bus.extendedDescription_nl || ''}`;
        for (const variant of allowedVariants) {
          if (matchesKeyword(fullDesc, variant)) {
            subjectScore += 120;
            subjectFound = true;
            if (!matchedReason) {
              const idx = fullDesc.toLowerCase().indexOf(variant);
              const start = Math.max(0, idx - 15);
              const end = Math.min(fullDesc.length, idx + variant.length + 35);
              matchedReason = { type: 'description', text: `...${fullDesc.slice(start, end).trim()}...` };
            }
            break;
          }
        }
      }

      // 6. Deep Text (Documents/Menu, Reviews, Events, Jobs)
      if (!subjectFound) {
        for (const variant of allowedVariants) {
          const doc = (bus.documents || []).find(d => matchesKeyword(`${d.title} ${d.type}`, variant));
          if (doc) {
            subjectScore += 100;
            subjectFound = true;
            if (!matchedReason) matchedReason = { type: 'document', text: doc.title };
            break;
          }
          const rev = (bus.reviews || []).find(r => matchesKeyword(r.text || '', variant));
          if (rev) {
            subjectScore += 90;
            subjectFound = true;
            if (!matchedReason) {
              const text = rev.text;
              const idx = text.toLowerCase().indexOf(variant);
              const start = Math.max(0, idx - 15);
              const end = Math.min(text.length, idx + variant.length + 35);
              matchedReason = { type: 'review', text: `"${text.slice(start, end).trim()}..."` };
            }
            break;
          }
          if (wantsEvents && (bus.events || []).some(e => matchesKeyword(`${e.title} ${e.description}`, variant))) {
            subjectScore += 80;
            subjectFound = true;
            const ev = bus.events?.find(e => matchesKeyword(`${e.title} ${e.description}`, variant));
            if (!matchedReason && ev) matchedReason = { type: 'event', text: ev.title };
            break;
          }
          if (wantsJobs && (bus.jobs || []).some(j => matchesKeyword(`${j.title} ${j.description}`, variant))) {
            subjectScore += 80;
            subjectFound = true;
            const jb = bus.jobs?.find(j => matchesKeyword(`${j.title} ${j.description}`, variant));
            if (!matchedReason && jb) matchedReason = { type: 'job', text: jb.title };
            break;
          }
          if (matchesKeyword(deepText, variant)) {
            subjectScore += 40;
            subjectFound = true;
            if (!matchedReason) matchedReason = { type: 'semantic', text: variant };
            break;
          }
        }
      }

      if (!subjectFound) {
        allSubjectsMatched = false;
        break;
      }
    }

    // If ANY required subject noun was not matched by this business, it is EXCLUDED!
    if (!allSubjectsMatched) {
      return { business: bus, score: 0 };
    }

    // Action verb bonus if matched
    if (actionTokens.length > 0) {
      subjectScore += 20;
    }

    if (bus.isPremium) {
      subjectScore += 10;
    }

    return { business: bus, score: subjectScore, matchedReason };
  }

  // --------------------------------------------------------------------------
  // CASE B: The query contains ONLY Action Verbs (e.g. user typed "kaufen", "essen", "übernachten")
  // In this case, we match businesses in the corresponding broad category
  // --------------------------------------------------------------------------
  if (actionTokens.length > 0) {
    let actionScore = 0;
    let matchedReason: SearchMatchResult['matchedReason'] = undefined;

    for (const act of actionTokens) {
      const domains = ACTION_VERB_DEFAULT_DOMAINS[act] || [];
      for (const d of domains) {
        if (matchesKeyword(primaryText, d)) {
          actionScore += 80;
          if (!matchedReason) matchedReason = { type: 'category', text: bus.category };
          break;
        } else if (matchesKeyword(secondaryText, d)) {
          actionScore += 40;
          if (!matchedReason) matchedReason = { type: 'semantic', text: d };
          break;
        }
      }
    }

    if (actionScore > 0) {
      if (bus.isPremium) actionScore += 5;
      return { business: bus, score: actionScore, matchedReason };
    }
  }

  // Fallback: literal keyword match in combinedAllText
  if (matchesKeyword(combinedAllText, normalized)) {
    return { business: bus, score: 50, matchedReason: { type: 'description', text: bus.name } };
  }

  return { business: bus, score: 0 };
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
