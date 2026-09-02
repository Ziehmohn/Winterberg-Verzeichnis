export interface EmergencyContact {
  id: string;
  nameDe: string;
  nameNl: string;
  number: string;
  numberDisplay: string;
  descriptionDe: string;
  descriptionNl: string;
  category: 'urgent' | 'medical' | 'pharmacy' | 'police' | 'utility' | 'hospital';
  is24h: boolean;
  badgeDe?: string;
  badgeNl?: string;
}

export const EMERGENCY_NUMBERS: EmergencyContact[] = [
  {
    id: 'rescue',
    nameDe: 'Feuerwehr & Rettungsdienst',
    nameNl: 'Brandweer & Ambulance',
    number: '112',
    numberDisplay: '112',
    descriptionDe: 'Für lebensbedrohliche Notfälle, schwere Unfälle, Brände und akute Notarzteinsätze.',
    descriptionNl: 'Voor levensbedreigende situaties, ernstige ongevallen, brand en acute medische nood.',
    category: 'urgent',
    is24h: true,
    badgeDe: '24/7 Notruf',
    badgeNl: '24/7 Noodnummer',
  },
  {
    id: 'police',
    nameDe: 'Polizei Notruf',
    nameNl: 'Politie Noodnummer',
    number: '110',
    numberDisplay: '110',
    descriptionDe: 'Polizeinotruf für akute Gefahrenlagen, Einbrüche und Verkehrsunfälle.',
    descriptionNl: 'Politienoodnummer voor acute dreiging, inbraken en ernstige verkeersongevallen.',
    category: 'police',
    is24h: true,
    badgeDe: '24/7 Notruf',
    badgeNl: '24/7 Noodnummer',
  },
  {
    id: 'medical-oncall',
    nameDe: 'Ärztlicher Bereitschaftsdienst',
    nameNl: 'Huisartsenpost / Medische Spoeddienst',
    number: '116117',
    numberDisplay: '116 117',
    descriptionDe: 'Kostenlose bundesweite Hotline der Kassenärztlichen Vereinigung bei nicht lebensbedrohlichen Erkrankungen außerhalb der Praxiszeiten.',
    descriptionNl: 'Gratis landelijk nummer voor medische hulp buiten kantooruren bij niet-levensbedreigende klachten.',
    category: 'medical',
    is24h: true,
    badgeDe: 'Kostenlos 24/7',
    badgeNl: 'Gratis 24/7',
  },
  {
    id: 'poison',
    nameDe: 'Giftnotrufzentrale NRW (Bonn)',
    nameNl: 'Antigifcentrum NRW (Bonn)',
    number: '022819240',
    numberDisplay: '0228 19 240',
    descriptionDe: 'Beratung bei Vergiftungsunfällen mit Medikamenten, Pflanzen, Pilzen oder Haushaltsmitteln.',
    descriptionNl: 'Advies en eerste hulp bij vergiftigingen met planten, paddenstoelen, chemicaliën of medicijnen.',
    category: 'urgent',
    is24h: true,
    badgeDe: '24/7 Giftnotruf',
    badgeNl: '24/7 Advies',
  },
  {
    id: 'police-station',
    nameDe: 'Polizeiwache Winterberg',
    nameNl: 'Politiebureau Winterberg',
    number: '0298192850',
    numberDisplay: '02981 92850',
    descriptionDe: 'Lokale Polizeiwache Winterberg (Fichtenweg 1, 59955 Winterberg).',
    descriptionNl: 'Lokaal politiebureau Winterberg (Fichtenweg 1, 59955 Winterberg).',
    category: 'police',
    is24h: true,
  },
  {
    id: 'dental',
    nameDe: 'Zahnärztlicher Notdienst Westfalen-Lippe',
    nameNl: 'Tandartsen Spoeddienst Westfalen-Lippe',
    number: '01805986700',
    numberDisplay: '01805 986700',
    descriptionDe: 'Zentrale Ansage des zahnärztlichen Notdienstes im Hochsauerlandkreis an Wochenenden und Feiertagen (14 ct/Min. Festnetz).',
    descriptionNl: 'Tandartsen-spoeddienst voor het Hochsauerland in het weekend en op feestdagen.',
    category: 'medical',
    is24h: false,
    badgeDe: 'Wochenende & Feiertage',
    badgeNl: 'Weekend & Feestdagen',
  }
];

export interface HospitalInfo {
  name: string;
  typeDe: string;
  typeNl: string;
  address: string;
  phone: string;
  phoneDisplay: string;
  emergencyRoomDe: string;
  emergencyRoomNl: string;
  hoursDe: string;
  hoursNl: string;
  notesDe?: string;
  notesNl?: string;
}

export const HOSPITALS_DATA: HospitalInfo[] = [
  {
    name: 'St. Franziskus-Hospital Winterberg',
    typeDe: 'Krankenhaus & Zentrale Notfallpraxis',
    typeNl: 'Ziekenhuis & Centrale Huisartsenpost',
    address: 'Franziskusstraße 2, 59955 Winterberg',
    phone: '029818020',
    phoneDisplay: '02981 802-0',
    emergencyRoomDe: '24/7 Zentrale Notaufnahme (ZNA) im Haus',
    emergencyRoomNl: '24/7 Spoedeisende Hulp (SEH) aanwezig',
    hoursDe: 'Kassenärztliche Notfallpraxis: Mi & Fr 16:00–19:00 Uhr | Sa, So & Feiertage 09:00–13:00 Uhr & 16:00–19:00 Uhr',
    hoursNl: 'Huisartsenpost: Wo & Vr 16:00–19:00 uur | Za, Zo & Feestdagen 09:00–13:00 uur & 16:00–19:00 uur',
    notesDe: 'Direkt im Zentrum von Winterberg mit Notfallversorgung, Chirurgie, Innerer Medizin und Röntgen.',
    notesNl: 'Gelegen in het centrum van Winterberg met eerste hulp, chirurgie, interne geneeskunde en röntgen.',
  },
  {
    name: 'Fachkrankenhaus Kloster Grafschaft',
    typeDe: 'Lungenfachklinik & Akutkrankenhaus',
    typeNl: 'Gespecialiseerd Longziekenhuis & Spoedopname',
    address: 'Annostraße 1, 57392 Schmallenberg-Grafschaft',
    phone: '029727910',
    phoneDisplay: '02972 791-0',
    emergencyRoomDe: 'Akutaufnahme für Pneumologie, Kardiologie & Innere Medizin',
    emergencyRoomNl: 'Spoedopname voor pneumologie en interne geneeskunde',
    hoursDe: '24/7 Akutaufnahme',
    hoursNl: '24/7 Spoedopname',
  },
  {
    name: 'Klinikum Hochsauerland (Standort Meschede / Arnsberg)',
    typeDe: 'Schwerpunktkrankenhaus / Maximalversorgung',
    typeNl: 'Regionaal Ziekenhuis / Traumacentrum',
    address: 'Friedrichstraße 27, 59872 Meschede',
    phone: '0291990',
    phoneDisplay: '0291 99-0',
    emergencyRoomDe: '24/7 Zertifiziertes Regionales Traumazentrum',
    emergencyRoomNl: '24/7 Gecertificeerd Regionaal Traumacentrum',
    hoursDe: '24 Stunden Notaufnahme',
    hoursNl: '24 uur Spoedeisende Hulp',
  }
];

export interface PharmacyRota {
  id: string;
  name: string;
  street: string;
  postCode: string;
  city: string;
  phone: string;
  phoneDisplay: string;
  distanceKm?: number;
  isOpen24h?: boolean;
}

export const WINTERBERG_PHARMACIES: PharmacyRota[] = [
  {
    id: 'kur-apotheke-winterberg',
    name: 'Kur-Apotheke Winterberg',
    street: 'Poststraße 6',
    postCode: '59955',
    city: 'Winterberg',
    phone: '029812244',
    phoneDisplay: '02981 2244',
    distanceKm: 0.2,
  },
  {
    id: 'franziskus-apotheke-winterberg',
    name: 'Franziskus-Apotheke Winterberg',
    street: 'Poststraße 17',
    postCode: '59955',
    city: 'Winterberg',
    phone: '029811234',
    phoneDisplay: '02981 1234',
    distanceKm: 0.3,
  },
  {
    id: 'rathaus-apotheke-winterberg',
    name: 'Rathaus-Apotheke Winterberg',
    street: 'Fichtenweg 1',
    postCode: '59955',
    city: 'Winterberg',
    phone: '0298192970',
    phoneDisplay: '02981 92970',
    distanceKm: 0.6,
  },
  {
    id: 'hirsch-apotheke-medebach',
    name: 'Hirsch-Apotheke Medebach',
    street: 'Oberstraße 24',
    postCode: '59964',
    city: 'Medebach',
    phone: '029828282',
    phoneDisplay: '02982 8282',
    distanceKm: 14.5,
  },
  {
    id: 'kilians-apotheke-hallenberg',
    name: 'Kilians-Apotheke Hallenberg',
    street: 'Hauptstraße 30',
    postCode: '59969',
    city: 'Hallenberg',
    phone: '029848214',
    phoneDisplay: '02984 8214',
    distanceKm: 14.8,
  },
  {
    id: 'engel-apotheke-olsberg',
    name: 'Engel-Apotheke Olsberg',
    street: 'Hauptstraße 73',
    postCode: '59939',
    city: 'Olsberg',
    phone: '0296297970',
    phoneDisplay: '02962 97970',
    distanceKm: 18.2,
  }
];

export const DEFIBRILLATOR_LOCATIONS = [
  { nameDe: 'Rathaus Winterberg (Foyer)', nameNl: 'Gemeentehuis Winterberg (Foyer)', address: 'Fichtenweg 10, 59955 Winterberg', access: 'Zu Öffnungszeiten' },
  { nameDe: 'Bahnhof Winterberg (Wartehalle)', nameNl: 'Station Winterberg (Wachtruimte)', address: 'Bahnhofstraße 1, 59955 Winterberg', access: '24/7 zugänglich' },
  { nameDe: 'St. Franziskus-Hospital (Eingang)', nameNl: 'St. Franziskus-Hospital (Ingang)', address: 'Franziskusstraße 2, 59955 Winterberg', access: '24/7 Notaufnahme' },
  { nameDe: 'Sparkasse Winterberg (SB-Bereich)', nameNl: 'Sparkasse Winterberg (Pinnen)', address: 'Am Waltenberg 4, 59955 Winterberg', access: '06:00 - 23:00 Uhr' },
  { nameDe: 'Skiliftkarussell P1 Herrloh', nameNl: 'Skiliftkarussell P1 Herrloh', address: 'Am Herrloh, 59955 Winterberg', access: 'Während Liftbetrieb' },
];
