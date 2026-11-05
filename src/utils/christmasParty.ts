import { Business } from '../types';

export interface ChristmasFeature {
  icon: 'utensils' | 'wine' | 'headphones' | 'flame' | 'sparkles' | 'tree';
  titleDe: string;
  titleNl: string;
  descDe: string;
  descNl: string;
}

export interface ChristmasPartyItem {
  id: string;
  businessId: string;
  businessName: string;
  subtitleDe: string;
  subtitleNl: string;
  titleDe: string;
  titleNl: string;
  seasonDe: string;
  seasonNl: string;
  packageTypeDe: string;
  packageTypeNl: string;
  priceInfoDe: string;
  priceInfoNl: string;
  address: string;
  district: string;
  category: string;
  subcategory: string;
  features: ChristmasFeature[];
  highlightsDe: string[];
  highlightsNl: string[];
  shortDescriptionDe: string;
  shortDescriptionNl: string;
  infoTextDe: string;
  infoTextNl: string;
  flyerImage: string;
  badgeDe: string;
  badgeNl: string;
  contactEmail: string;
  contactPhone: string;
  website: string;
  bookingUrl?: string;
  capacityDe?: string;
  capacityNl?: string;
}

export const CHRISTMAS_PARTY_DATA: ChristmasPartyItem[] = [
  {
    id: 'nordhang-jause-weihnachtsfeier-2026',
    businessId: 'nordhang-jause',
    businessName: 'Nordhang Jause Winterberg',
    subtitleDe: 'Deine All-Inclusive Weihnachtsfeier 2026 auf der Skihütte',
    subtitleNl: 'Je All-Inclusive Kerstborrel & Winterfeest 2026 in een authentieke berghut',
    titleDe: 'All-Inclusive Weihnachtsfeier 2026 an der Nordhang Jause',
    titleNl: 'All-Inclusive Kerstfeest 2026 bij Nordhang Jause',
    seasonDe: 'Saison 2026 / 2027 • Termine ab November 2026',
    seasonNl: 'Seizoen 2026 / 2027 • Data vanaf november 2026',
    packageTypeDe: 'All-Inclusive Hütten-Weihnachtsfeier',
    packageTypeNl: 'All-inclusive hutten-kerstfeest',
    priceInfoDe: 'All-Inclusive Pauschale (Preise & Termine auf Anfrage)',
    priceInfoNl: 'All-inclusive arrangement (prijzen & data op aanvraag)',
    address: 'In d. Renau 10/11, 59955 Winterberg',
    district: 'Winterberg',
    category: 'Gastronomie & Event',
    subcategory: 'Skihütte & Eventlocation',
    features: [
      {
        icon: 'utensils',
        titleDe: 'Überraschungs-4-Gänge-Menü',
        titleNl: 'Verrassend 4-gangenmenu',
        descDe: 'Rustikal, bodenständig und mit Liebe zubereitet – ein festlicher Hochgenuss für das ganze Team.',
        descNl: 'Robuust, bourgondisch en met liefde bereid – een feestelijk culinair genot voor het hele team.'
      },
      {
        icon: 'wine',
        titleDe: 'Inklusive Getränkepauschale',
        titleNl: 'Inclusief drankenarrangement',
        descDe: 'Sorgenfrei feiern mit umfassendem Getränkeangebot inkl. Bier, Wein, Softdrinks & Heißgetränken.',
        descNl: 'Zorgeloos genieten met een compleet aanbod inclusief bier, wijn, frisdrank en warme dranken.'
      },
      {
        icon: 'headphones',
        titleDe: 'Inklusive DJ',
        titleNl: 'Inclusief live-dj',
        descDe: 'Beste Hüttengaudi und Wunschmusik: Unser DJ sorgt vom Empfang bis spät in die Nacht für Top-Stimmung.',
        descNl: 'Echte après-ski ambiance en feestmuziek: de dj zorgt vanaf binnenkomst tot diep in de nacht voor sfeer.'
      }
    ],
    highlightsDe: [
      'Überraschungs-4-Gänge-Menü (rustikal & bodenständig)',
      'Inklusive Getränkepauschale während der gesamten Feier',
      'Inklusive professionellem DJ & Soundanlage',
      'Uriges Ambiente aus Naturholz direkt am Skihang',
      'Winterliche Kulisse mit knisternder Feuerschale'
    ],
    highlightsNl: [
      'Verrassend 4-gangenmenu (robuust & streekeigen)',
      'Inclusief royale drankvoorziening gedurende de hele avond',
      'Inclusief professionele dj & complete geluidsinstallatie',
      'Authentieke berghutsfeer met warm hout aan de piste',
      'Winterse bergambiance met knisperende vuurschaal'
    ],
    shortDescriptionDe: 'Deine All-Inclusive Weihnachtsfeier 2026 in Winterberg: Die Nordhang Jause bietet ein unvergessliches Komplettpaket für Firmen, Gruppen und Vereine mit 4-Gänge-Menü, Getränkepauschale und DJ.',
    shortDescriptionNl: 'Je all-inclusive kerstfeest 2026 in Winterberg: Berghut Nordhang Jause biedt een compleet arrangement voor bedrijven, teams en verenigingen met 4-gangenmenu, dranken en dj.',
    infoTextDe: 'Feiern Sie Ihre Weihnachtsfeier 2026 mitten im Winterberger Wintersport- und Wandergebiet! Die Nordhang Jause bietet Ihnen das perfekte Rundum-Sorglos-Paket: Gemütlicher Empfang in rustikaler Hüttenatmosphäre, ein exklusives 4-Gänge-Überraschungsmenü aus der Hüttenküche, eine offene Getränkepauschale und beste musikalische Begleitung durch einen hauseigenen DJ. Ideal für Firmenfeiern, Abteilungsessen, Vereinsabschlüsse und geschlossene Gruppen. Jetzt Wunschtermin für November/Dezember 2026 anfragen!',
    infoTextNl: 'Vier uw kerst- of eindejaarsborrel 2026 in het hart van het Winterbergse wintersportgebied! Nordhang Jause biedt u een compleet zorgeloos all-inclusive arrangement: een warm onthaal in de sfeervolle berghut, een feestelijk 4-gangen verrassingsmenu, onbeperkt dranken en een eigen dj voor een bruisende après-ski feestavond. Uitermate geschikt voor bedrijven, personeelsverenigingen en besloten gezelschappen.',
    flyerImage: '/weihnachtsfeier-winterberg-nordhang-jause.jpg',
    badgeDe: 'All-Inclusive 2026',
    badgeNl: 'All-Inclusive 2026',
    contactEmail: 'info@nordhangjause.de',
    contactPhone: '02981 8996399',
    website: 'https://www.nordhangjause.de/#vermietung',
    bookingUrl: 'https://www.nordhangjause.de/#vermietung',
    capacityDe: 'Firmen, Gruppen, Vereine & Abteilungen (exklusiv buchbar)',
    capacityNl: 'Bedrijven, groepen, verenigingen & teams (exclusief te boeken)'
  }
];

export const CHRISTMAS_PARTY_MAP: Record<string, ChristmasPartyItem> = Object.fromEntries(
  CHRISTMAS_PARTY_DATA.map(item => [item.businessId, item])
);

/**
 * Generates an .ics calendar file for Christmas Party Planning 2026
 */
export function generateChristmasPartyIcs(party: ChristmasPartyItem): string {
  const startDate = '20261201T180000';
  const endDate = '20261201T230000';
  const now = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Winterberg-Verzeichnis//Weihnachtsfeier Winterberg 2026//DE',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:christmas-${party.id}@winterberg-verzeichnis.de`,
    `DTSTAMP:${now}`,
    `DTSTART:${startDate}`,
    `DTEND:${endDate}`,
    `SUMMARY:${party.titleDe}`,
    `DESCRIPTION:${party.shortDescriptionDe}\\n\\nKontakt: ${party.contactPhone} / ${party.contactEmail}\\nWeb: ${party.website}`,
    `LOCATION:${party.address}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');
}
