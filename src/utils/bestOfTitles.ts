export interface CategoryBestOfMeta {
  titleDe: string;
  titleNl: string;
  subTitleDe?: string;
  subTitleNl?: string;
}

/**
 * Mapping of subcategories to correct German & Dutch plural forms and meaningful category groupings
 */
export const SUBCATEGORY_PLURALS: Record<string, CategoryBestOfMeta> = {
  // Gastronomie
  'Restaurant': {
    titleDe: 'Die besten Restaurants',
    titleNl: 'De beste restaurants',
  },
  'Cafés': {
    titleDe: 'Die besten Cafés & Röstereien',
    titleNl: 'De beste cafés',
  },
  'Kneipen und Bars': {
    titleDe: 'Die besten Kneipen & Bars',
    titleNl: 'De beste kroegen en bars',
  },
  'Skihütten': {
    titleDe: 'Die besten Skihütten & Bergrestaurants',
    titleNl: 'De beste skihutten & berprestaurants',
  },
  'Eisdielen': {
    titleDe: 'Die besten Eisdielen',
    titleNl: 'De beste ijssalons',
  },
  'Pizzerien': {
    titleDe: 'Die besten Pizzerien & italienischen Restaurants',
    titleNl: 'De beste pizzeria\'s',
  },
  'Imbisse': {
    titleDe: 'Die besten Imbisse & Schnellrestaurants',
    titleNl: 'De beste snackbars & fastfood',
  },
  'Weinstuben': {
    titleDe: 'Die besten Weinstuben & Weinbars',
    titleNl: 'De beste wijnlokalen',
  },

  // Hotels & Unterkünfte
  'Hotels': {
    titleDe: 'Die besten Hotels & Wellnesshotels',
    titleNl: 'De beste hotels & wellnesshotels',
  },
  'Ferienwohnungen': {
    titleDe: 'Die besten Ferienwohnungen & Apartments',
    titleNl: 'De beste vakantiewoningen',
  },
  'Ferienhäuser': {
    titleDe: 'Die besten Ferienhäuser & Chalets',
    titleNl: 'De beste vakantiehuizen & chalets',
  },
  'Ferienparks': {
    titleDe: 'Die besten Ferienparks & Feriendörfer',
    titleNl: 'De beste vakantieparken',
  },

  // Einzelhandel
  'Supermarkt': {
    titleDe: 'Die besten Supermärkte & Lebensmittelmärkte',
    titleNl: 'De beste supermarkten',
  },
  'Bäckerei': {
    titleDe: 'Die besten Bäckereien & Konditoreien',
    titleNl: 'De beste bakkerijen',
  },
  'Fleischerei': {
    titleDe: 'Die besten Fleischereien & Metzgereien',
    titleNl: 'De beste slagerijen',
  },
  'Metzgerei': {
    titleDe: 'Die besten Metzgereien & Fleischereien',
    titleNl: 'De beste slagerijen',
  },
  'Bekleidung': {
    titleDe: 'Die besten Modegeschäfte & Boutiquen',
    titleNl: 'De beste kledingwinkels & boetieks',
  },
  'Bürobedarf': {
    titleDe: 'Die besten Fachgeschäfte für Bürobedarf',
    titleNl: 'De beste kantoorboekhandels',
  },
  'Tankstellen': {
    titleDe: 'Die besten Tankstellen & Waschstraßen',
    titleNl: 'De beste tankstations & carwashes',
  },
  'Autohäuser': {
    titleDe: 'Die besten Autohäuser & Fahrzeughändler',
    titleNl: 'De beste autodealers',
  },

  // Handwerk
  'KFZ-Werkstätten': {
    titleDe: 'Die besten KFZ-Werkstätten & Autoservices',
    titleNl: 'De beste autogarages',
  },
  'Schreinereien': {
    titleDe: 'Die besten Schreinereien & Tischlereien',
    titleNl: 'De beste timmerlieden & meubelmakers',
  },
  'Dachdecker': {
    titleDe: 'Die besten Dachdecker- & Zimmereibetriebe',
    titleNl: 'De beste dakdekkers',
  },
  'Elektriker': {
    titleDe: 'Die besten Elektriker & Elektrobetriebe',
    titleNl: 'De beste elektriciens',
  },
  'Friseur': {
    titleDe: 'Die besten Friseure & Barbershops',
    titleNl: 'De beste kappers & barbershops',
  },
  'Heizungstechnik': {
    titleDe: 'Die besten Heizungs- & Sanitärbetriebe (SHK)',
    titleNl: 'De beste verwarmings- en loodgietersbedrijven',
  },
  'Bauunternehmen': {
    titleDe: 'Die besten Bauunternehmen & Maurerbetriebe',
    titleNl: 'De beste bouwbedrijven',
  },
  'Maler & Lackierer': {
    titleDe: 'Die besten Maler- & Lackierbetriebe',
    titleNl: 'De beste schilders & stukadoors',
  },
  'Gartenbauer': {
    titleDe: 'Die besten Garten- & Landschaftsbauer (GaLaBau)',
    titleNl: 'De beste hoveniers & tuinontwerpers',
  },
  'Wäschereien': {
    titleDe: 'Die besten Wäschereien & Textilreinigungen',
    titleNl: 'De beste wasserettes & stomerijen',
  },

  // Freizeit, Kultur & Sport
  'Fahrradverleih': {
    titleDe: 'Die besten Fahrradverleihe & Bikeshops',
    titleNl: 'De beste fietsverhuurders & bikeshops',
  },
  'Skiverleih': {
    titleDe: 'Die besten Skiverleihe & Wintersportgeschäfte',
    titleNl: 'De beste skiverhuurders',
  },
  'Fitnessstudios': {
    titleDe: 'Die besten Fitnessstudios & Trainingszentren',
    titleNl: 'De beste fitnesscentra',
  },
  'Kino': {
    titleDe: 'Kino, Filmtheater & Kulturangebote',
    titleNl: 'Bioscopen & cultuuraanbod',
  },
  'Bowling': {
    titleDe: 'Bowlingbahnen & Indoor-Freizeitangebote',
    titleNl: 'Bowlingbanen & indoor recreatie',
  },
  'Indoor-Spielplätze': {
    titleDe: 'Die besten Indoor-Spielplätze & Familienattraktionen',
    titleNl: 'De beste binnenspeeltuinen',
  },
  'Outdoor-Freizeitgebiet': {
    titleDe: 'Die besten Outdoor-Erlebnisberge & Freizeitangebote',
    titleNl: 'De beste buitenrecreatie & outdoorparken',
  },
  'Schwimmbäder': {
    titleDe: 'Die besten Schwimmbäder, Thermen & Erlebnisbäder',
    titleNl: 'De beste zwembaden & wellnessbaden',
  },
  'Tennisplätze': {
    titleDe: 'Tennisplätze & Racketsport-Anlagen',
    titleNl: 'Tennisbanen & racketsport',
  },
  'Fußballvereine': {
    titleDe: 'Fußballvereine & Sportplätze',
    titleNl: 'Voetbalclubs & sportvelden',
  },

  // Dienstleistungen
  'Steuerberater': {
    titleDe: 'Die besten Steuerberater & Steuerkanzleien',
    titleNl: 'De beste belastingadviseurs',
  },
  'Marketingdienstleistungen': {
    titleDe: 'Die besten Marketingagenturen & Webdesigner',
    titleNl: 'De beste marketingbureaus & webdesigners',
  },
  'Finanzberatung': {
    titleDe: 'Die besten Finanzberater & Vermögensberatungen',
    titleNl: 'De beste financieel adviseurs',
  },
  'Rechtsanwälte': {
    titleDe: 'Die besten Rechtsanwälte & Notare',
    titleNl: 'De beste advocaten & notarissen',
  },
  'Banken': {
    titleDe: 'Die besten Banken & Sparkassen',
    titleNl: 'De beste banken',
  },
  'Versicherungsagenturen': {
    titleDe: 'Die besten Versicherungsagenturen & Makler',
    titleNl: 'De beste verzekeringsagenten',
  },
};

/**
 * Returns clean, pluralized German or Dutch title for any category / subcategory
 */
export function getBestOfTitle(category?: string, subcategory?: string, lang: 'de' | 'nl' = 'de'): string {
  const isNl = lang === 'nl';

  if (subcategory && SUBCATEGORY_PLURALS[subcategory]) {
    return isNl ? SUBCATEGORY_PLURALS[subcategory].titleNl : SUBCATEGORY_PLURALS[subcategory].titleDe;
  }

  if (subcategory) {
    if (isNl) {
      return `De beste ${subcategory}`;
    }
    // Simple German plural fallback if not explicitly in dictionary
    if (subcategory.endsWith('e') || subcategory.endsWith('en') || subcategory.endsWith('s') || subcategory.endsWith('er')) {
      return `Die besten ${subcategory}`;
    }
    return `Die besten ${subcategory}e`;
  }

  if (category && category !== 'Alle' && category !== 'all') {
    switch (category) {
      case 'Gastronomie':
        return isNl ? 'De beste horecagelegenheden & restaurants' : 'Die besten Restaurants & Gaststätten';
      case 'Hotels und Unterkünfte':
        return isNl ? 'De beste hotels & vakantieverblijven' : 'Die besten Hotels & Unterkünfte';
      case 'Freizeit':
        return isNl ? 'De beste recreatie- & vrijetijdsactiviteiten' : 'Die besten Freizeitangebote & Verleihe';
      case 'Handwerk':
        return isNl ? 'De beste vakmensen & ambachtsbedrijven' : 'Die besten Handwerker & Meisterbetriebe';
      case 'Dienstleistungen':
        return isNl ? 'De beste dienstverleners, artsen & adviseurs' : 'Die besten Dienstleister & Praxen';
      case 'Einzelhandel':
        return isNl ? 'De beste winkels, supermarkten & speciaalzaken' : 'Die besten Geschäfte & Supermärkte';
      default:
        return isNl ? `De beste bedrijven in ${category}` : `Die besten Unternehmen im Bereich ${category}`;
    }
  }

  return isNl ? 'De 10 beste bedrijven in Winterberg' : 'Die 10 besten Unternehmen in Winterberg';
}

/**
 * Standard legal transparency disclaimer for the Best-Of rankings
 */
export const BEST_OF_DISCLAIMER = {
  de: {
    short: 'Hinweis: Diese Rangliste basiert ausschließlich auf den verifizierten Kundenbewertungen auf dieser Plattform (Das Winterberg Verzeichnis) und unserem gewichteten Qualitäts-Score.',
    fullTitle: 'Transparenzhinweis zur Bestenliste & zum Bewertungsranking',
    fullText: 'Die Platzierungen in dieser Bestenliste werden automatisiert und unabhängig anhand der auf dieser Plattform abgegebenen und verifizierten Kundenbewertungen (Sterne 1–5 sowie Anzahl der Erfahrungsberichte) und eines gewichteten Bayes\'schen Ranking-Scores berechnet. Es handelt sich hierbei nicht um eine behördliche, amtliche oder allumfassende Qualitätsprüfung aller im Stadtgebiet existierenden Betriebe, sondern um eine transparente Zusammenfassung der tatsächlichen Nutzererfahrungen auf Das Winterberg Verzeichnis.'
  },
  nl: {
    short: 'Opmerking: Deze ranglijst is uitsluitend gebaseerd op geverifieerde klantbeoordelingen op dit platform (Het Winterberg Overzicht) en onze gewogen kwaliteitsscore.',
    fullTitle: 'Transparantieverklaring over de ranglijst en beoordelingen',
    fullText: 'De posities in deze ranglijst worden geautomatiseerd en onafhankelijk berekend op basis van de op dit platform geplaatste en geverifieerde klantbeoordelingen (sterren 1–5 en aantal recensies) en een gewogen Bayesian ranking-score. Dit is geen officieel of alomvattend overheidsonderzoek naar alle bedrijven in Winterberg, maar een transparante weergave van de werkelijke gebruikerservaringen op Het Winterberg Overzicht.'
  }
};
