export interface CategoryHeaderData {
  image: string;
  imageAltDe: string;
  imageAltNl: string;
  credit?: string;
  badgeDe: string;
  badgeNl: string;
  titleDe?: string;
  titleNl?: string;
  subtitleDe: string;
  subtitleNl: string;
  objectPosition?: string;
}

export const CATEGORY_HEADERS: Record<string, CategoryHeaderData> = {
  'Handwerk': {
    image: '/handwerk-winterberg-header.jpg',
    imageAltDe: 'Handwerk in Winterberg: Handwerker bei der präzisen Holzbearbeitung mit Beitel und Drechselbank in der Werkstatt',
    imageAltNl: 'Ambacht in Winterberg: Vakman bij het bewerken van hout met beitel en draaibank in de werkplaats',
    credit: 'Foto: Maxim Tolchinskiy / Unsplash',
    badgeDe: 'Handwerk & Meisterbetriebe · Winterberg Sauerland',
    badgeNl: 'Vakmanschap & Ambacht · Winterberg Sauerland',
    titleDe: 'Handwerk in Winterberg',
    titleNl: 'Ambacht & Vakmensen in Winterberg',
    subtitleDe: 'Zuverlässige Meisterbetriebe, Werkstätten und Fachhandwerker in Winterberg und allen 14 Ortsteilen – von Dachdeckern, Elektrikern und Schreinereien bis hin zu Bauunternehmen und KFZ-Profis.',
    subtitleNl: 'Betrouwbare vakmensen, ambachtelijke werkplaatsen en vakkundige bedrijven in Winterberg en alle 14 dorpen – van dakdekkers en elektriciens tot timmerlieden en bouwbedrijven.',
    objectPosition: '55% center'
  }
};

/**
 * Returns header data for a given category or its parent category if defined.
 */
export function getCategoryHeader(category: string, parentCategory?: string): CategoryHeaderData | null {
  if (CATEGORY_HEADERS[category]) {
    return CATEGORY_HEADERS[category];
  }
  if (parentCategory && CATEGORY_HEADERS[parentCategory]) {
    return CATEGORY_HEADERS[parentCategory];
  }
  return null;
}
