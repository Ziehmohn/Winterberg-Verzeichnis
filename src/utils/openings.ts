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
  const dtStart = `${startDate}T150000`;
  const dtEnd = `${startDate}T190000`;
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
