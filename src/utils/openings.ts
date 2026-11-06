import { Business } from '../types';

export interface OpeningItem {
  id: string;
  businessId: string;
  businessName: string;
  subtitleDe: string;
  subtitleNl: string;
  titleDe: string;
  titleNl: string;
  openingDate: string; // YYYY-MM-DD
  openingDateFormattedDe: string;
  openingDateFormattedNl: string;
  openingTimeDe: string;
  openingTimeNl: string;
  address: string;
  district: string;
  category: string;
  subcategory: string;
  focusAreasDe: string[];
  focusAreasNl: string[];
  shortDescriptionDe: string;
  shortDescriptionNl: string;
  infoTextDe: string;
  infoTextNl: string;
  flyerImage: string;
  badgeDe: string;
  badgeNl: string;
  status: 'upcoming' | 'opened';
  contactEmail?: string;
  contactPhone?: string;
  website?: string;
}

export const OPENINGS_DATA: OpeningItem[] = [
  {
    id: 'ivon-baeckerei-konditorei-winterberg',
    businessId: 'ivon-baeckerei-konditorei-winterberg',
    businessName: 'IVON – Bäckerei & Konditorei',
    subtitleDe: 'Inhaberin Ivon Sommer · Schokoladensommelière, Bäcker- & Konditormeisterin',
    subtitleNl: 'Eigenares Ivon Sommer · Chocoladesommelier, Meesterbakker & Patissier',
    titleDe: 'Neueröffnung am 11.11.: IVON Bäckerei & Konditorei',
    titleNl: 'Nieuwe opening op 11.11: IVON Bakkerij & Chocolade',
    openingDate: '2026-11-11',
    openingDateFormattedDe: 'Mittwoch, 11. November 2026',
    openingDateFormattedNl: 'Woensdag 11 november 2026',
    openingTimeDe: 'Ab 07:00 Uhr',
    openingTimeNl: 'Vanaf 07:00 uur',
    address: 'Hauptstraße 20, 59955 Winterberg',
    district: 'Winterberg',
    category: 'Gastronomie',
    subcategory: 'Bäckerei',
    focusAreasDe: [
      'Frisches Handwerksbrot',
      'Feine Konditorei & Torten',
      'Schokoladensommelière-Kreationen',
      'Kaffee & Snacks'
    ],
    focusAreasNl: [
      'Ambachtelijk vers brood',
      'Luxe banket & taarten',
      'Chocoladesommelier creaties',
      'Koffiespecialiteiten'
    ],
    shortDescriptionDe: 'Bäcker- und Konditormeisterin sowie Schokoladensommelière Ivon Sommer eröffnet am 11.11. ihren neuen Genussladen an der Hauptstraße 20 in Winterberg.',
    shortDescriptionNl: 'Meesterbakker en chocoladesommelier Ivon Sommer opent op 11 november haar nieuwe zaak aan de Hauptstraße 20 in Winterberg met vers brood, patisserie en chocolade.',
    infoTextDe: 'Große Neueröffnung am Mittwoch, 11. November 2026 in der Winterberger Innenstadt: Trotz Typ-1-Diabetes hat Ivon Sommer ihren Lebenstraum verwirklicht! Als Bäcker- und Konditormeisterin sowie zertifizierte Schokoladensommelière vereint sie traditionelle Handwerkskunst mit erlesenen Schokoladenkreationen. Freue dich auf ofenfrisches, handwerklich gebackenes Brot, meisterhafte Konditoreiwaren, aromatische Kaffeespezialitäten und handgeschöpfte Schokolade an der Hauptstraße 20.',
    infoTextNl: 'Feestelijke opening op woensdag 11 november 2026: Meesterbakker, patissier en chocoladesommelier Ivon Sommer opent haar eigen ambachtelijke speciaalzaak aan de Hauptstraße 20 in Winterberg met heerlijk ambachtelijk brood, patisserie en verfijnde chocolade.',
    flyerImage: '/ivon-baeckerei-konditorei.jpg',
    badgeDe: 'Neueröffnung 11.11.',
    badgeNl: 'Nieuwe opening 11.11.',
    status: 'upcoming'
  },
  {
    id: 'nadine-albers-heilpraktikerin',
    businessId: 'nadine-albers-heilpraktikerin-winterberg',
    businessName: 'Nadine Albers – Heilpraktikerin',
    subtitleDe: 'Praxis für Naturheilkunde & Irisdiagnostik',
    subtitleNl: 'Praktijk voor natuurgeneeskunde & irisdiagnostiek',
    titleDe: 'Praxiseröffnung Nadine Albers in Siedlinghausen',
    titleNl: 'Praktijkopening Nadine Albers in Siedlinghausen',
    openingDate: '2026-12-30',
    openingDateFormattedDe: 'Mittwoch, 30. Dezember 2026',
    openingDateFormattedNl: 'Woensdag 30 december 2026',
    openingTimeDe: 'Ab 15:00 Uhr',
    openingTimeNl: 'Vanaf 15:00 uur',
    address: 'Sorpestraße 2, 59955 Winterberg-Siedlinghausen',
    district: 'Siedlinghausen',
    category: 'Gesundheit & Medizin',
    subcategory: 'Ärzte & Praxen',
    focusAreasDe: [
      'Naturheilkunde',
      'Phytotherapie (Pflanzenheilkunde)',
      'Irisdiagnostik (Augendiagnose)',
      'Ganzheitliche Therapiekonzepte'
    ],
    focusAreasNl: [
      'Natuurgeneeskunde',
      'Fytotherapie (kruidengeneeskunde)',
      'Irisdiagnostiek (oogdiagnose)',
      'Holistische behandelconcepten'
    ],
    shortDescriptionDe: 'Große Praxiseröffnung in Siedlinghausen: Heilpraktikerin Nadine Albers eröffnet ihre Praxis für Naturheilkunde, Phytotherapie und Irisdiagnostik.',
    shortDescriptionNl: 'Feestelijke opening in Siedlinghausen: Natuurgeneeskundige Nadine Albers opent haar praktijk voor natuurgeneeskunde, fytotherapie en irisdiagnostiek.',
    infoTextDe: 'Heilpraktikerin Nadine Albers lädt herzlich zur Praxiseröffnung in die Sorpestraße 2 in Siedlinghausen ein! Ab 15:00 Uhr sind alle Interessierten, Nachbarn und künftigen Patientinnen und Patienten willkommen, die neuen, liebevoll gestalteten Behandlungsräume kennenzulernen. Erfahre mehr über ganzheitliche Naturheilkunde, die Wirkkraft pflanzlicher Phytotherapie und die faszinierenden Einblicke der Irisdiagnostik zur frühzeitigen Ursachenanalyse.',
    infoTextNl: 'Natuurgeneeskundige Nadine Albers nodigt je van harte uit voor de opening van haar nieuwe praktijk aan de Sorpestraße 2 in Siedlinghausen! Vanaf 15:00 uur is iedereen welkom om de sfeervolle praktijkruimtes te bezichtigen en kennis te maken met haar holistische behandelmethoden zoals fytotherapie en irisdiagnostiek.',
    flyerImage: '/nadine-albers-eroeffnung.jpg',
    badgeDe: 'Save the Date',
    badgeNl: 'Save the Date',
    status: 'upcoming'
  }
];

export const OPENINGS_MAP: Record<string, OpeningItem> = Object.fromEntries(
  OPENINGS_DATA.map(item => [item.businessId, item])
);

/**
 * Generates an .ics calendar file for the opening date
 */
export function generateOpeningIcs(opening: OpeningItem): string {
  const startDate = opening.openingDate.replace(/-/g, '');
  const hourMatch = opening.openingTimeDe.match(/(\d{1,2}):(\d{2})/);
  const startHour = hourMatch ? hourMatch[1].padStart(2, '0') : '08';
  const startMin = hourMatch ? hourMatch[2] : '00';
  const endHour = String(Math.min(parseInt(startHour, 10) + 4, 20)).padStart(2, '0');
  const dtStart = `${startDate}T${startHour}${startMin}00`;
  const dtEnd = `${startDate}T${endHour}${startMin}00`;
  const now = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Winterberg-Verzeichnis//Neueröffnungen Winterberg//DE',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:opening-${opening.id}@winterberg-verzeichnis.de`,
    `DTSTAMP:${now}`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SUMMARY:${opening.titleDe}`,
    `DESCRIPTION:${opening.shortDescriptionDe.replace(/\n/g, '\\n')}\\n\\nAdresse: ${opening.address}`,
    `LOCATION:${opening.address}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');
}

/**
 * Checks if a business has an associated opening
 */
export function isOpeningBusiness(business: Business): boolean {
  return Boolean(OPENINGS_MAP[business.id]);
}
