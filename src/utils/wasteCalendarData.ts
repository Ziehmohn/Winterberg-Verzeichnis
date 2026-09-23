import { DistrictWasteSchedule, WasteBinType, WasteCollectionItem } from '../types';

export const BIN_TYPE_CONFIG: Record<WasteBinType, {
  label: string;
  label_nl: string;
  colorBg: string;
  colorBorder: string;
  colorText: string;
  colorBadge: string;
  description: string;
  description_nl: string;
}> = {
  rest: {
    label: 'Graue Tonne (Restmüll)',
    label_nl: 'Grijze Container (Restafval)',
    colorBg: 'bg-zinc-100 dark:bg-zinc-800',
    colorBorder: 'border-zinc-300 dark:border-zinc-700',
    colorText: 'text-zinc-900 dark:text-zinc-100',
    colorBadge: 'bg-zinc-700 text-white',
    description: 'Nicht verwertbarer Hausmüll, Asche (kalt), Hygieneartikel, Staubsaugerbeutel.',
    description_nl: 'Niet-recyclebaar huishoudelijk afval, stofzuigerzakken, luiers.'
  },
  paper: {
    label: 'Blaue Tonne (Altpapier)',
    label_nl: 'Blauwe Container (Papier & Karton)',
    colorBg: 'bg-blue-50 dark:bg-blue-950/40',
    colorBorder: 'border-blue-200 dark:border-blue-800',
    colorText: 'text-blue-900 dark:text-blue-200',
    colorBadge: 'bg-blue-600 text-white',
    description: 'Kartons, Zeitungen, Zeitschriften, Papiertüten, Bücher.',
    description_nl: 'Karton, kranten, tijdschriften, papieren zakken.'
  },
  organic: {
    label: 'Braune Tonne (Biomüll)',
    label_nl: 'Bruine Container (GFT / Bio)',
    colorBg: 'bg-amber-50 dark:bg-amber-950/40',
    colorBorder: 'border-amber-200 dark:border-amber-800',
    colorText: 'text-amber-900 dark:text-amber-200',
    colorBadge: 'bg-amber-700 text-white',
    description: 'Küchenabfälle, Obst- & Gemüsereste, Kaffeesatz, Gartenabfälle.',
    description_nl: 'Keukenafval, groente-, fruit- en tuinafval, etensresten.'
  },
  yellow: {
    label: 'Gelbe Tonne / Gelber Sack',
    label_nl: 'Gele Zak / PMD (Verpakkingen)',
    colorBg: 'bg-yellow-50 dark:bg-yellow-950/40',
    colorBorder: 'border-yellow-200 dark:border-yellow-800',
    colorText: 'text-yellow-900 dark:text-yellow-200',
    colorBadge: 'bg-yellow-500 text-zinc-950 font-bold',
    description: 'Leichtverpackungen aus Kunststoff, Metall, Verbundstoffe (Grüner Punkt).',
    description_nl: 'Verpakkingen van plastic, blik en drankkartons.'
  },
  hazard: {
    label: 'Schadstoffmobil (Sondermüll)',
    label_nl: 'Chemokar (Gevaarlijk Afval)',
    colorBg: 'bg-rose-50 dark:bg-rose-950/40',
    colorBorder: 'border-rose-200 dark:border-rose-800',
    colorText: 'text-rose-900 dark:text-rose-200',
    colorBadge: 'bg-rose-600 text-white',
    description: 'Farben, Lacke, Lösungsmittel, Batterien, Pflanzenschutzmittel.',
    description_nl: 'Verf, chemicaliën, batterijen, oplosmiddelen.'
  },
  bulky: {
    label: 'Sperrmüll (auf Anmeldung)',
    label_nl: 'Grofvuil (op afspraak)',
    colorBg: 'bg-purple-50 dark:bg-purple-950/40',
    colorBorder: 'border-purple-200 dark:border-purple-800',
    colorText: 'text-purple-900 dark:text-purple-200',
    colorBadge: 'bg-purple-600 text-white',
    description: 'Möbel, Teppiche, Matratzen (Abholung online bei Stadt Winterberg beantragen).',
    description_nl: 'Meubilair, matrassen, vloerbedekking (aanmelden via de gemeente).'
  }
};

export const WINTERBERG_DISTRICTS = [
  'Winterberg (Kernstadt)',
  'Altastenberg',
  'Neuastenberg',
  'Elkeringhausen',
  'Grönebach',
  'Hildfeld',
  'Hoheleye',
  'Langewiese',
  'Lenneplätze',
  'Mollseifen',
  'Niedersfeld',
  'Siedlinghausen',
  'Silbach',
  'Züschen'
];

/**
 * Generates regular bi-weekly and monthly collection dates for each district for the current year
 */
function createSchedules(): Record<string, DistrictWasteSchedule> {
  const result: Record<string, DistrictWasteSchedule> = {};

  const baseDates = [
    // October 2026
    { d: '2026-10-02', t: 'organic' as WasteBinType },
    { d: '2026-10-06', t: 'yellow' as WasteBinType },
    { d: '2026-10-09', t: 'rest' as WasteBinType },
    { d: '2026-10-14', t: 'paper' as WasteBinType },
    { d: '2026-10-16', t: 'organic' as WasteBinType },
    { d: '2026-10-20', t: 'yellow' as WasteBinType },
    { d: '2026-10-23', t: 'rest' as WasteBinType },
    { d: '2026-10-28', t: 'hazard' as WasteBinType },
    { d: '2026-10-30', t: 'organic' as WasteBinType },
    // November 2026
    { d: '2026-11-04', t: 'yellow' as WasteBinType },
    { d: '2026-11-06', t: 'rest' as WasteBinType },
    { d: '2026-11-11', t: 'paper' as WasteBinType },
    { d: '2026-11-13', t: 'organic' as WasteBinType },
    { d: '2026-11-18', t: 'yellow' as WasteBinType },
    { d: '2026-11-20', t: 'rest' as WasteBinType },
    { d: '2026-11-27', t: 'organic' as WasteBinType },
    // December 2026
    { d: '2026-12-02', t: 'yellow' as WasteBinType },
    { d: '2026-12-04', t: 'rest' as WasteBinType },
    { d: '2026-12-09', t: 'paper' as WasteBinType },
    { d: '2026-12-11', t: 'organic' as WasteBinType },
    { d: '2026-12-16', t: 'yellow' as WasteBinType },
    { d: '2026-12-18', t: 'rest' as WasteBinType },
    { d: '2026-12-30', t: 'organic' as WasteBinType }
  ];

  WINTERBERG_DISTRICTS.forEach((district, index) => {
    // Stagger dates slightly per district zone (+0 to +3 days)
    const offset = index % 4;
    const collections: WasteCollectionItem[] = baseDates.map((item, idx) => {
      const dateObj = new Date(item.d);
      dateObj.setDate(dateObj.getDate() + offset);
      // Skip Sundays
      if (dateObj.getDay() === 0) dateObj.setDate(dateObj.getDate() + 1);
      const isoDate = dateObj.toISOString().split('T')[0];

      const cfg = BIN_TYPE_CONFIG[item.t];
      return {
        id: `${district}-${isoDate}-${item.t}`,
        date: isoDate,
        binType: item.t,
        title: cfg.label,
        title_nl: cfg.label_nl,
        notes: cfg.description,
        notes_nl: cfg.description_nl
      };
    }).sort((a, b) => a.date.localeCompare(b.date));

    result[district] = {
      district,
      collections
    };
  });

  return result;
}

export const DISTRICT_SCHEDULES = createSchedules();

export const RECYCLING_CENTER_INFO = {
  name: 'Städtischer Bauhof & Wertstoffhof Winterberg',
  name_nl: 'Gemeentelijke Milieustraat Winterberg',
  address: 'Remmeswiese 31, 59955 Winterberg',
  phone: '02981 / 800-0',
  openingHours: [
    { days: 'Montag & Mittwoch', days_nl: 'Maandag & Woensdag', time: '14:00 – 17:00 Uhr' },
    { days: 'Freitag', days_nl: 'Vrijdag', time: '13:00 – 17:00 Uhr' },
    { days: 'Samstag', days_nl: 'Zaterdag', time: '09:00 – 13:00 Uhr' }
  ],
  freeItems: [
    'Grünschnitt & Gartenabfälle (bis 2 m³)',
    'Elektroaltgeräte (Groß- & Kleingeräte)',
    'Altmetall & Schrott',
    'Papier & Kartonagen',
    'Sperrmüll mit Berechtigungskarte'
  ],
  freeItems_nl: [
    'Tuinafval en snoeihout (tot 2 m³)',
    'Elektrische apparaten (groot en klein)',
    'Metaal en oud ijzer',
    'Papier en karton',
    'Grofvuil met gemeentepas'
  ]
};

/**
 * Generates standard RFC-5545 iCalendar (.ics) string for smartphone export
 */
export function generateIcsCalendar(districtName: string, items: WasteCollectionItem[]): string {
  const events = items.map(item => {
    // 06:00 to 07:00 on collection day
    const dateFormatted = item.date.replace(/-/g, '');
    const uid = `${item.id}@winterberg-verzeichnis.de`;
    return [
      'BEGIN:VEVENT',
      `UID:${uid}`,
      `DTSTAMP:${dateFormatted}T050000Z`,
      `DTSTART;VALUE=DATE:${dateFormatted}`,
      `SUMMARY:Müllabfuhr: ${item.title} (${districtName})`,
      `DESCRIPTION:Abfuhrtermin in ${districtName}. Bitte Tonne bis spätestens 06:00 Uhr an die Straße stellen.`,
      'BEGIN:VALARM',
      'TRIGGER:-PT12H', // 12 hours before (previous evening at 18:00)
      'ACTION:DISPLAY',
      `DESCRIPTION:Morgen Müllabfuhr: ${item.title}`,
      'END:VALARM',
      'END:VEVENT'
    ].join('\r\n');
  }).join('\r\n');

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Winterberg Verzeichnis//Abfallkalender//DE',
    `X-WR-CALNAME:Abfallkalender ${districtName}`,
    'CALSCALE:GREGORIAN',
    events,
    'END:VCALENDAR'
  ].join('\r\n');
}
