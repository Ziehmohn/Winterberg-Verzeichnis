/**
 * Review Translation & Language Detection Utility for German and Dutch.
 */

const GERMAN_KEYWORDS = [
  'der', 'die', 'das', 'ein', 'eine', 'einen', 'einem', 'einer', 'eines', 'sehr', 
  'lecker', 'freundlich', 'freundlicher', 'freundliche', 'zimmer', 'essen', 'wieder', 
  'immer', 'unser', 'unsere', 'unserem', 'schön', 'schönes', 'schöne', 'toll', 
  'tolles', 'tolle', 'super', 'hilfsbereit', 'gern', 'gerne', 'danke', 'vielen dank', 
  'weiterempfehlen', 'empfehlung', 'wir', 'war', 'waren', 'nicht', 'auch', 'mit', 
  'für', 'bei', 'und', 'aber', 'alles', 'sauber', 'gemütlich', 'lage', 'ausblick', 
  'frühstück', 'service', 'kellner', 'bedienung', 'hotel', 'restaurant', 'perfekt',
  'kommen', 'aufenthalt', 'urlaub', 'preis', 'leistung', 'gastfreundschaft'
];

const DUTCH_KEYWORDS = [
  'het', 'de', 'een', 'van', 'erg', 'heel', 'lekker', 'lekkere', 'vriendelijk', 
  'vriendelijke', 'kamers', 'kamer', 'eten', 'weer', 'altijd', 'ons', 'onze', 
  'mooi', 'mooie', 'geweldig', 'geweldige', 'personeel', 'aanrader', 'aanbevelen', 
  'bedankt', 'hartelijk', 'graag', 'wij', 'was', 'waren', 'niet', 'ook', 'met', 
  'voor', 'bij', 'en', 'maar', 'alles', 'schoon', 'schone', 'gezellig', 'gezellige', 
  'ligging', 'uitzicht', 'ontbijt', 'service', 'ober', 'bediening', 'hotel', 
  'restaurant', 'perfect', 'perfecte', 'komen', 'verblijf', 'vakantie', 'prijs', 
  'kwaliteit', 'gastvrijheid', 'terug'
];

/**
 * Detects whether a review is primarily written in German ('de') or Dutch ('nl').
 */
export function detectReviewLanguage(text: string): 'de' | 'nl' {
  if (!text || typeof text !== 'string') return 'de';

  const tokens = text.toLowerCase().match(/\b[\p{L}\p{M}]+\b/gu) || [];
  if (tokens.length === 0) return 'de';

  let deScore = 0;
  let nlScore = 0;

  for (const token of tokens) {
    if (GERMAN_KEYWORDS.includes(token)) deScore++;
    if (DUTCH_KEYWORDS.includes(token)) nlScore++;
  }

  // Strong indicator checks
  if (/\b(het|een|lekker|geweldig|personeel|ontbijt|uitzicht|aanrader|gezellig|graag|terug|schoon)\b/i.test(text)) {
    nlScore += 3;
  }
  if (/\b(der|die|das|ein|eine|sehr|lecker|frühstück|ausblick|empfehlung|gemütlich|gerne|wieder|sauber)\b/i.test(text)) {
    deScore += 3;
  }

  return nlScore > deScore ? 'nl' : 'de';
}

const DE_TO_NL_PHRASES: [RegExp, string][] = [
  // Full Idioms & Sentences
  [/\bWir kommen gerne wieder\b/gi, 'We komen graag weer terug'],
  [/\bWir kommen auf jeden Fall wieder\b/gi, 'We komen zeker weer terug'],
  [/\bWir kommen sicher wieder\b/gi, 'We komen zeker terug'],
  [/\bImmer wieder gerne\b/gi, 'Altijd graag weer'],
  [/\bSehr zu empfehlen\b/gi, 'Zeer aan te bevelen'],
  [/\bAbsolut zu empfehlen\b/gi, 'Absoluut een aanrader'],
  [/\bKann ich nur weiterempfehlen\b/gi, 'Kan ik alleen maar aanraden'],
  [/\bEine absolute Empfehlung\b/gi, 'Een absolute aanrader'],
  [/\bTop Preis-Leistungs-Verhältnis\b/gi, 'Top prijs-kwaliteitverhouding'],
  [/\bGutes Preis-Leistungs-Verhältnis\b/gi, 'Goede prijs-kwaliteitverhouding'],
  [/\bVielen Dank für alles\b/gi, 'Hartelijk dank voor alles'],
  [/\bVielen Dank für den tollen Aufenthalt\b/gi, 'Hartelijk dank voor het geweldige verblijf'],
  [/\bHerzlichen Dank\b/gi, 'Hartelijk dank'],
  [/\bSehr freundliches Personal\b/gi, 'Zeer vriendelijk personeel'],
  [/\bSehr nettes Personal\b/gi, 'Zeer aardig personeel'],
  [/\bSuper freundlich und hilfsbereit\b/gi, 'Super vriendelijk en behulpzaam'],
  [/\bTolles Essen und super Service\b/gi, 'Geweldig eten en super service'],
  [/\bLeckeres Essen\b/gi, 'Heerlijk eten'],
  [/\bDas Essen war hervorragend\b/gi, 'Het eten was voortreffelijk'],
  [/\bDas Essen war sehr lecker\b/gi, 'Het eten was erg lekker'],
  [/\bDie Zimmer waren sauber und gemütlich\b/gi, 'De kamers waren schoon en gezellig'],
  [/\bSchöne und saubere Zimmer\b/gi, 'Mooie en schone kamers'],
  [/\bWunderschöner Ausblick\b/gi, 'Prachtig uitzicht'],
  [/\bTolle Lage\b/gi, 'Geweldige ligging'],
  [/\bPerfekte Lage\b/gi, 'Perfecte ligging'],
  [/\bSuper Lage\b/gi, 'Geweldige locatie'],
  [/\bReichhaltiges Frühstück\b/gi, 'Uitgebreid ontbijt'],
  [/\bTolles Frühstück\b/gi, 'Geweldig ontbijt'],
  [/\bSchnelle und unkomplizierte Abwicklung\b/gi, 'Snelle en ongecompliceerde afhandeling'],
  [/\bAlles bestens\b/gi, 'Alles was perfect in orde'],
  [/\bAlles top\b/gi, 'Alles was top'],
  [/\bGerne wieder\b/gi, 'Graag tot een volgende keer'],

  // Connectors & Common Review Vocabulary
  [/\bSehr freundlich\b/gi, 'Zeer vriendelijk'],
  [/\bsehr freundlich\b/gi, 'zeer vriendelijk'],
  [/\bSehr hilfsbereit\b/gi, 'Zeer behulpzaam'],
  [/\bsehr hilfsbereit\b/gi, 'zeer behulpzaam'],
  [/\bSehr sauber\b/gi, 'Zeer schoon'],
  [/\bsehr sauber\b/gi, 'zeer schoon'],
  [/\bSehr lecker\b/gi, 'Erg lekker'],
  [/\bsehr lecker\b/gi, 'erg lekker'],
  [/\bSehr gut\b/gi, 'Zeer goed'],
  [/\bsehr gut\b/gi, 'zeer goed'],
  [/\bSehr schön\b/gi, 'Erg mooi'],
  [/\bsehr schön\b/gi, 'erg mooi'],
  [/\bHervorragend\b/gi, 'Uitstekend'],
  [/\bhervorragend\b/gi, 'uitstekend'],
  [/\bGemütlich\b/gi, 'Gezellig'],
  [/\bgemütlich\b/gi, 'gezellig'],
  [/\bAusgezeichnet\b/gi, 'Uitstekend'],
  [/\bausgezeichnet\b/gi, 'uitstekend'],
  [/\bWunderbar\b/gi, 'Prachtig'],
  [/\bwunderbar\b/gi, 'prachtig'],
  [/\bFantastisch\b/gi, 'Fantastisch'],
  [/\bfantastisch\b/gi, 'fantastisch'],
  [/\bGastfreundschaft\b/gi, 'gastvrijheid'],
  [/\bAufenthalt\b/gi, 'verblijf'],
  [/\bFrühstück\b/gi, 'ontbijt'],
  [/\bBedienung\b/gi, 'bediening'],
  [/\bKellner\b/gi, 'ober'],
  [/\bAusblick\b/gi, 'uitzicht'],
  [/\bZimmer\b/gi, 'kamers'],
  [/\bZimmern\b/gi, 'kamers'],
  [/\bBadezimmer\b/gi, 'badkamer'],
  [/\bSauberkeit\b/gi, 'schoonmaak'],
  [/\bEssen\b/gi, 'eten'],
  [/\bSpeisen\b/gi, 'gerechten'],
  [/\bGetränke\b/gi, 'drankjes'],
  [/\bKaffee\b/gi, 'koffie'],
  [/\bKuchen\b/gi, 'gebak'],
  [/\bTerrasse\b/gi, 'terras'],
  [/\bBiergarten\b/gi, 'biertuin'],
  [/\bFamilie\b/gi, 'familie'],
  [/\bKinder\b/gi, 'kinderen'],
  [/\bHund\b/gi, 'hond'],
  [/\bHunde\b/gi, 'honden'],
  [/\bUrlaub\b/gi, 'vakantie'],
  [/\bWochenende\b/gi, 'weekend'],

  // Grammar and Small Words
  [/\bund\b/g, 'en'],
  [/\boder\b/g, 'of'],
  [/\baber\b/g, 'maar'],
  [/\bmit\b/g, 'met'],
  [/\bfür\b/g, 'voor'],
  [/\bvon\b/g, 'van'],
  [/\bbei\b/g, 'bij'],
  [/\bwar\b/g, 'was'],
  [/\bwaren\b/g, 'waren'],
  [/\bist\b/g, 'is'],
  [/\bsind\b/g, 'zijn'],
  [/\bhat\b/g, 'heeft'],
  [/\bhaben\b/g, 'hebben'],
  [/\bhatte\b/g, 'had'],
  [/\bhatten\b/g, 'hadden'],
  [/\bwir\b/g, 'we'],
  [/\bich\b/g, 'ik'],
  [/\bsie\b/g, 'ze'],
  [/\balle\b/g, 'alle'],
  [/\bales\b/g, 'alles'],
  [/\bales\b/g, 'alles'],
  [/\bnicht\b/g, 'niet'],
  [/\bauch\b/g, 'ook'],
  [/\bnur\b/g, 'alleen'],
  [/\bsehr\b/g, 'erg'],
  [/\bimmer\b/g, 'altijd'],
  [/\bwieder\b/g, 'weer'],
  [/\bgerne\b/g, 'graag'],
  [/\bgern\b/g, 'graag'],
  [/\beinfach\b/g, 'gewoon'],
  [/\bperfekt\b/g, 'perfect'],
  [/\btoll\b/g, 'geweldig'],
  [/\btolle\b/g, 'geweldige'],
  [/\btolles\b/g, 'geweldig'],
  [/\btollen\b/g, 'geweldige'],
  [/\bsuper\b/g, 'super'],
  [/\bhier\b/g, 'hier'],
  [/\bdort\b/g, 'daar'],
  [/\bDanke\b/g, 'Bedankt'],
  [/\bdanke\b/g, 'bedankt'],
];

const NL_TO_DE_PHRASES: [RegExp, string][] = [
  // Full Idioms & Sentences
  [/\bWe komen zeker nog eens terug\b/gi, 'Wir kommen sicher wieder'],
  [/\bWe komen graag weer terug\b/gi, 'Wir kommen gerne wieder'],
  [/\bZeker een aanrader\b/gi, 'Absolut zu empfehlen'],
  [/\bEcht een aanrader\b/gi, 'Wirklich sehr zu empfehlen'],
  [/\bEen echte aanrader\b/gi, 'Ein echter Geheimtipp und sehr zu empfehlen'],
  [/\bTop prijs-kwaliteitverhouding\b/gi, 'Top Preis-Leistungs-Verhältnis'],
  [/\bGoede prijs-kwaliteitverhouding\b/gi, 'Gutes Preis-Leistungs-Verhältnis'],
  [/\bHartelijk dank voor alles\b/gi, 'Herzlichen Dank für alles'],
  [/\bHartelijk dank voor het geweldige verblijf\b/gi, 'Vielen Dank für den tollen Aufenthalt'],
  [/\bZeer vriendelijk personeel\b/gi, 'Sehr freundliches Personal'],
  [/\bErg vriendelijk personeel\b/gi, 'Sehr freundliches Personal'],
  [/\bSuper vriendelijk en behulpzaam\b/gi, 'Super freundlich und hilfsbereit'],
  [/\bGeweldig eten en goede service\b/gi, 'Tolles Essen und guter Service'],
  [/\bHeerlijk eten\b/gi, 'Köstliches Essen'],
  [/\bHet eten was erg lekker\b/gi, 'Das Essen war sehr lecker'],
  [/\bHet eten was voortreffelijk\b/gi, 'Das Essen war hervorragend'],
  [/\bDe kamers waren schoon en gezellig\b/gi, 'Die Zimmer waren sauber und gemütlich'],
  [/\bMooie en schone kamers\b/gi, 'Schöne und saubere Zimmer'],
  [/\bPrachtig uitzicht\b/gi, 'Wunderschöner Ausblick'],
  [/\bGeweldige ligging\b/gi, 'Tolle Lage'],
  [/\bPerfecte ligging\b/gi, 'Perfekte Lage'],
  [/\bUitgebreid ontbijt\b/gi, 'Reichhaltiges Frühstück'],
  [/\bHeerlijk ontbijt\b/gi, 'Köstliches Frühstück'],
  [/\bAlles was perfect in orde\b/gi, 'Alles war bestens in Ordnung'],
  [/\bAlles was top\b/gi, 'Alles war top'],

  // Vocabulary & Connectors
  [/\bZeer vriendelijk\b/gi, 'Sehr freundlich'],
  [/\bzeer vriendelijk\b/gi, 'sehr freundlich'],
  [/\bErg vriendelijk\b/gi, 'Sehr freundlich'],
  [/\berg vriendelijk\b/gi, 'sehr freundlich'],
  [/\bZeer behulpzaam\b/gi, 'Sehr hilfsbereit'],
  [/\bzeer behulpzaam\b/gi, 'sehr hilfsbereit'],
  [/\bZeer schoon\b/gi, 'Sehr sauber'],
  [/\bzeer schoon\b/gi, 'sehr sauber'],
  [/\bErg lekker\b/gi, 'Sehr lecker'],
  [/\berg lekker\b/gi, 'sehr lecker'],
  [/\bHeerlijk\b/gi, 'Köstlich'],
  [/\bheerlijk\b/gi, 'köstlich'],
  [/\bZeer goed\b/gi, 'Sehr gut'],
  [/\bzeer goed\b/gi, 'sehr gut'],
  [/\bErg mooi\b/gi, 'Sehr schön'],
  [/\berg mooi\b/gi, 'sehr schön'],
  [/\bPrachtig\b/gi, 'Wunderbar'],
  [/\bprachtig\b/gi, 'wunderbar'],
  [/\bGeweldig\b/gi, 'Großartig'],
  [/\bgeweldig\b/gi, 'großartig'],
  [/\bgezellig\b/gi, 'gemütlich'],
  [/\bUitstekend\b/gi, 'Ausgezeichnet'],
  [/\buitstekend\b/gi, 'ausgezeichnet'],
  [/\bAanrader\b/gi, 'Empfehlung'],
  [/\baanrader\b/gi, 'Empfehlung'],
  [/\bgastvrijheid\b/gi, 'Gastfreundschaft'],
  [/\bverblijf\b/gi, 'Aufenthalt'],
  [/\bontbijt\b/gi, 'Frühstück'],
  [/\bbediening\b/gi, 'Bedienung'],
  [/\bober\b/gi, 'Kellner'],
  [/\buitzicht\b/gi, 'Ausblick'],
  [/\bkamers\b/gi, 'Zimmer'],
  [/\bkamer\b/gi, 'Zimmer'],
  [/\bbadkamer\b/gi, 'Badezimmer'],
  [/\bschoonmaak\b/gi, 'Sauberkeit'],
  [/\beten\b/gi, 'Essen'],
  [/\bgerechten\b/gi, 'Gerichte'],
  [/\bdrankjes\b/gi, 'Getränke'],
  [/\bkoffie\b/gi, 'Kaffee'],
  [/\bgebak\b/gi, 'Kuchen'],
  [/\bterras\b/gi, 'Terrasse'],
  [/\bbiertuin\b/gi, 'Biergarten'],
  [/\bvriendelijke\b/gi, 'freundliche'],
  [/\bschone\b/gi, 'saubere'],
  [/\bgezellige\b/gi, 'gemütliche'],
  [/\bmooie\b/gi, 'schöne'],
  [/\bgeweldige\b/gi, 'großartige'],
  [/\bperfecte\b/gi, 'perfekte'],
  [/\bterug\b/gi, 'zurück'],
  [/\bbedankt\b/gi, 'danke'],
  [/\bHartelijk dank\b/gi, 'Vielen Dank'],

  // Grammar & Small Words
  [/\ben\b/g, 'und'],
  [/\bof\b/g, 'oder'],
  [/\bmaar\b/g, 'aber'],
  [/\bmet\b/g, 'mit'],
  [/\bvoor\b/g, 'für'],
  [/\bvan\b/g, 'von'],
  [/\bbij\b/g, 'bei'],
  [/\bwas\b/g, 'war'],
  [/\bwaren\b/g, 'waren'],
  [/\bis\b/g, 'ist'],
  [/\bzijn\b/g, 'sind'],
  [/\bheeft\b/g, 'hat'],
  [/\bhebben\b/g, 'haben'],
  [/\bhad\b/g, 'hatte'],
  [/\bhadden\b/g, 'hatten'],
  [/\bwe\b/g, 'wir'],
  [/\bwij\b/g, 'wir'],
  [/\bik\b/g, 'ich'],
  [/\bze\b/g, 'sie'],
  [/\balles\b/g, 'alles'],
  [/\bniet\b/g, 'nicht'],
  [/\book\b/g, 'auch'],
  [/\balleen\b/g, 'nur'],
  [/\berg\b/g, 'sehr'],
  [/\bheel\b/g, 'sehr'],
  [/\baltijd\b/g, 'immer'],
  [/\bweer\b/g, 'wieder'],
  [/\bgraag\b/g, 'gerne'],
  [/\bperfect\b/g, 'perfekt'],
  [/\bsuper\b/g, 'super'],
  [/\bhier\b/g, 'hier'],
  [/\bdaar\b/g, 'dort'],
];

/**
 * Translates a review from German to natural Dutch.
 */
export function translateReviewToDutch(text: string): string {
  if (!text) return '';
  let result = text;
  for (const [pattern, replacement] of DE_TO_NL_PHRASES) {
    result = result.replace(pattern, replacement);
  }
  return result;
}

/**
 * Translates a review from Dutch to natural German.
 */
export function translateReviewToGerman(text: string): string {
  if (!text) return '';
  let result = text;
  for (const [pattern, replacement] of NL_TO_DE_PHRASES) {
    result = result.replace(pattern, replacement);
  }
  return result;
}

/**
 * Gets the localized review text and translation toggle metadata.
 */
export function getReviewTranslationData(
  text: string,
  currentLang: 'de' | 'nl'
): {
  originalText: string;
  translatedText: string;
  detectedLang: 'de' | 'nl';
  needsTranslation: boolean;
  badgeLabel: string;
  viewOriginalLabel: string;
  viewTranslationLabel: string;
} {
  const detectedLang = detectReviewLanguage(text);
  const needsTranslation = detectedLang !== currentLang;

  let translatedText = text;
  if (detectedLang === 'de' && currentLang === 'nl') {
    translatedText = translateReviewToDutch(text);
  } else if (detectedLang === 'nl' && currentLang === 'de') {
    translatedText = translateReviewToGerman(text);
  } else if (currentLang === 'nl') {
    // Current is NL and text is already NL, provide DE translation for toggle
    translatedText = translateReviewToGerman(text);
  } else {
    // Current is DE and text is already DE, provide NL translation for toggle
    translatedText = translateReviewToDutch(text);
  }

  const badgeLabel = detectedLang === 'de'
    ? (currentLang === 'nl' ? 'Vertaald uit het Duits' : 'Origineel in het Duits')
    : (currentLang === 'de' ? 'Aus dem Niederländischen übersetzt' : 'Origineel in het Nederlands');

  const viewOriginalLabel = currentLang === 'nl'
    ? `Origineel bekijken (${detectedLang === 'de' ? 'Duits' : 'Nederlands'})`
    : `Original ansehen (${detectedLang === 'nl' ? 'Niederländisch' : 'Deutsch'})`;

  const viewTranslationLabel = currentLang === 'nl'
    ? 'Vertaling weergeven (Nederlands)'
    : 'Übersetzung anzeigen (Deutsch)';

  return {
    originalText: text,
    translatedText,
    detectedLang,
    needsTranslation,
    badgeLabel,
    viewOriginalLabel,
    viewTranslationLabel,
  };
}
