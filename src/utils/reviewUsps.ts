import { Review, Business } from '../types';

export interface ReviewUspRule {
  id: string;
  de: string;
  nl: string;
  keywords: string[];
}

export const REVIEW_USP_RULES: ReviewUspRule[] = [
  {
    id: 'speed',
    de: 'Schnell & Effizient',
    nl: 'Snel & Efficiënt',
    keywords: [
      'schnell', 'flott', 'zügig', 'effizient', 'ohne wartezeit', 'blitzschnell', 'rasch',
      'kurze wartezeit', 'snel', 'vlot', 'efficiënt', 'snelle service'
    ]
  },
  {
    id: 'quality',
    de: 'Top Qualität',
    nl: 'Hoge kwaliteit',
    keywords: [
      'hochwertig', 'qualität', 'top arbeit', 'präzise', 'sauber gearbeitet', 'meisterhaft',
      'exzellent', 'perfekt', 'erstklassig', 'hervorragend', 'klasse arbeit', 'kwaliteit',
      'hoge kwaliteit', 'vakmanschap', 'perfect', 'topkwaliteit'
    ]
  },
  {
    id: 'friendliness',
    de: 'Sehr freundlich',
    nl: 'Zeer vriendelijk',
    keywords: [
      'freundlich', 'nett', 'herzlich', 'aufmerksam', 'zuvorkommend', 'liebevoll',
      'tolles team', 'sympathisch', 'freundlicher', 'liebe', 'vriendelijk', 'gastvrij',
      'aardig', 'attent', 'hartelijk'
    ]
  },
  {
    id: 'fair_price',
    de: 'Faires Preis-Leistungs-Verhältnis',
    nl: 'Goede prijs-kwaliteit',
    keywords: [
      'fair', 'günstig', 'preiswert', 'preis-leistung', 'bezahlbar', 'guter preis',
      'fairer preis', 'faire preise', 'angemessen', 'eerlijke prijs', 'betaalbaar',
      'goede prijs-kwaliteit', 'voordelig'
    ]
  },
  {
    id: 'reliability',
    de: 'Zuverlässig & Pünktlich',
    nl: 'Betrouwbaar & Stipt',
    keywords: [
      'zuverlässig', 'pünktlich', 'verlässlich', 'stammkunde', 'ehrlich', 'vertrauen',
      'termingerecht', 'wort gehalten', 'betrouwbaar', 'stipt', 'op tijd', 'trouw'
    ]
  },
  {
    id: 'atmosphere',
    de: 'Gemütliche Atmosphäre',
    nl: 'Gezellige sfeer',
    keywords: [
      'gemütlich', 'schöne atmosphäre', 'stimmung', 'ambiente', 'einladend',
      'uriges ambiente', 'wohlfühlen', 'tolles flair', 'gezellig', 'sfeervol',
      'fijne sfeer', 'knus'
    ]
  },
  {
    id: 'competence',
    de: 'Kompetente Beratung',
    nl: 'Deskundig advies',
    keywords: [
      'kompetent', 'fachkundig', 'gute beratung', 'profi', 'fachmann', 'wissen',
      'erfahrung', 'meister', 'know-how', 'deskundig', 'goed advies', 'vakkundig',
      'professioneel'
    ]
  },
  {
    id: 'cleanliness',
    de: 'Sehr sauber & gepflegt',
    nl: 'Zeer schoon & verzorgd',
    keywords: [
      'sauber', 'gepflegt', 'hygienisch', 'blitzblank', 'gepflegte', 'ordentlich',
      'schoon', 'netjes', 'hygiënisch', 'verzorgd'
    ]
  },
  {
    id: 'delicious',
    de: 'Hervorragender Geschmack',
    nl: 'Heerlijke gerechten',
    keywords: [
      'lecker', 'köstlich', 'schmeckt', 'frisch', 'hausgemacht', 'delikat',
      'gaumenschmaus', 'aromatisch', 'heerlijk', 'lekker', 'vers', 'smaakvol'
    ]
  },
  {
    id: 'recommended',
    de: 'Absolut empfehlenswert',
    nl: 'Zeer aanbevolen',
    keywords: [
      'empfehlenswert', 'empfehle', 'jederzeit wieder', 'begeistert', 'vollstens zufrieden',
      '5 sterne verdient', 'immer wieder gerne', 'aanbevolen', 'aanrader', 'zeker terug'
    ]
  }
];

/**
 * Automatically extracts up to 5 USPs / advantages of a business from customer reviews.
 * ONLY returns USPs if the average rating is at least 4.0 stars.
 */
export function getBusinessReviewUsps(business: Partial<Business>, lang: 'de' | 'nl' = 'de'): string[] {
  const reviews = Array.isArray(business.reviews) 
    ? business.reviews.filter(r => !r.status || r.status === 'approved') 
    : [];

  if (reviews.length === 0) return [];

  // Calculate average rating
  const avgRating = reviews.reduce((sum, r) => sum + (Number(r?.rating) || 0), 0) / reviews.length;
  if (avgRating < 4.0) {
    return [];
  }

  // Aggregate review texts from positive reviews (rating >= 4)
  const positiveTexts = reviews
    .filter(r => (Number(r.rating) || 0) >= 4 && r.text)
    .map(r => r.text.toLowerCase())
    .join(' ');

  if (!positiveTexts.trim()) return [];

  const matchedUsps: { text: string; score: number }[] = [];

  for (const rule of REVIEW_USP_RULES) {
    let matchCount = 0;
    for (const keyword of rule.keywords) {
      if (positiveTexts.includes(keyword.toLowerCase())) {
        matchCount++;
      }
    }

    if (matchCount > 0) {
      matchedUsps.push({
        text: lang === 'nl' ? rule.nl : rule.de,
        score: matchCount
      });
    }
  }

  // Sort by match frequency and limit to max 5
  matchedUsps.sort((a, b) => b.score - a.score);
  return matchedUsps.slice(0, 5).map(m => m.text);
}
