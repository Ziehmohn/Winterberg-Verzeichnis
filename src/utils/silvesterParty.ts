import { Business } from '../types';

export interface SilvesterFeature {
  icon: 'utensils' | 'wine' | 'headphones' | 'flame' | 'sparkles' | 'tree' | 'ticket' | 'music' | 'clock';
  titleDe: string;
  titleNl: string;
  descDe: string;
  descNl: string;
}

export interface SilvesterPartyItem {
  id: string;
  businessId?: string;
  businessName: string;
  subtitleDe: string;
  subtitleNl: string;
  titleDe: string;
  titleNl: string;
  dateDe: string;
  dateNl: string;
  timeDe: string;
  timeNl: string;
  packageTypeDe: string;
  packageTypeNl: string;
  partyType: 'huette' | 'gala' | 'openair' | 'club' | 'hotel';
  priceInfoDe: string;
  priceInfoNl: string;
  address: string;
  district: string;
  category: string;
  subcategory: string;
  features: SilvesterFeature[];
  highlightsDe: string[];
  highlightsNl: string[];
  shortDescriptionDe: string;
  shortDescriptionNl: string;
  infoTextDe: string;
  infoTextNl: string;
  image: string;
  isAiGenerated?: boolean;
  flyerImage?: string;
  badgeDe: string;
  badgeNl: string;
  contactEmail: string;
  contactPhone?: string;
  website: string;
  bookingUrl?: string;
  capacityDe?: string;
  capacityNl?: string;
}

export const SILVESTER_PARTY_DATA: SilvesterPartyItem[] = [
  // 1. Dorf Alm Winterberg (Quelle: Offizieller Flyer des Betriebs)
  {
    id: 'silvester-dorf-alm-winterberg-2026',
    businessId: '107',
    businessName: 'Dorf Alm Winterberg',
    subtitleDe: 'Silvester-Essen am Abend & Silvesterparty mit DJ',
    subtitleNl: 'Oudejaarsdiner en Sylvesterfeest met dj',
    titleDe: 'Silvester 2026 in der Dorf Alm Winterberg',
    titleNl: 'Oud en Nieuw 2026 in Dorf Alm Winterberg',
    dateDe: 'Donnerstag, 31. Dezember 2026',
    dateNl: 'Donderdag 31 december 2026',
    timeDe: '10:00 – 16:00 Uhr regulär geöffnet\nSilvester-Essen: 17:00 – 19:00 Uhr oder ab 19:30 Uhr\nSilvesterparty mit DJ: ab 21:00 Uhr (Open End)',
    timeNl: '10:00 – 16:00 uur regulier geopend\nOudejaarsdiner: 17:00 – 19:00 uur of vanaf 19:30 uur\nSylvesterparty met dj: vanaf 21:00 uur (Open End)',
    packageTypeDe: 'Silvester-Essen & Party mit DJ',
    packageTypeNl: 'Oudejaarsdiner & feest met dj',
    partyType: 'huette',
    priceInfoDe: '15 € p.P. (Essen 17–19 Uhr inkl. Begrüßungsgetränk & Brotkorb)\n25 € p.P. (ab 19:30 Uhr inkl. Essen, Party, Sekt & Mitternachtssnack)\n10 € p.P. (nur Party ab 21:00 Uhr inkl. Sekt & Snack)',
    priceInfoNl: '€ 15 p.p. (diner 17–19u incl. welkomstdrankje & broodmand)\n€ 25 p.p. (vanaf 19:30u incl. diner, party, toost & midnight snack)\n€ 10 p.p. (alleen feest vanaf 21:00u incl. toost & snack)',
    address: 'Am Waltenberg 35, 59955 Winterberg',
    district: 'Winterberg',
    category: 'Gastronomie & Party',
    subcategory: 'Alpenländische Erlebnisgastronomie',
    features: [
      {
        icon: 'utensils',
        titleDe: 'Silvester-Essen am Abend',
        titleNl: 'Feestelijk oudejaarsdiner',
        descDe: 'Aus der regulären Speisekarte sowie einer kleinen Silvester-Zusatzkarte wählen (Tischzeiten: 17–19 Uhr oder ab 19:30 Uhr).',
        descNl: 'Dineren van de reguliere menukaart en een speciale Sylvester-kaart (tijden: 17–19 uur of vanaf 19:30 uur).'
      },
      {
        icon: 'headphones',
        titleDe: 'Silvesterparty mit DJ ab 21:00 Uhr',
        titleNl: 'Sylvesterparty met live-dj vanaf 21:00 uur',
        descDe: 'Die Party mit DJ startet um 21:00 Uhr. Wer zum Essen ab 19:30 Uhr da ist, feiert einfach direkt weiter.',
        descNl: 'Het feest met dj start om 21:00 uur. Gasten van het diner vanaf 19:30 uur feesten aansluitend direct mee.'
      },
      {
        icon: 'wine',
        titleDe: 'Begrüßungsgetränk & Mitternachtssnack',
        titleNl: 'Welkomstdrankje & midnight snack',
        descDe: 'Inklusive Begrüßungsgetränk, Brotkorb, Sekt zum Anstoßen um Mitternacht und herzhaftem Mitternachtssnack.',
        descNl: 'Inclusief welkomstdrankje, broodmand, glas prosecco om middernacht en een hartige middernachtsnack.'
      }
    ],
    highlightsDe: [
      '10:00 – 16:00 Uhr regulär geöffnet',
      'Silvester-Essen (17:00 – 19:00 Uhr): 15 € p.P. inkl. Begrüßungsgetränk und Brotkorb zzgl. Essen & Getränke',
      'Silvester-Essen & Party (ab 19:30 Uhr): 25 € p.P. inkl. Begrüßungsgetränk, Brotkorb, anschließender Silvesterparty, Sekt zum Anstoßen & Mitternachtssnack zzgl. Essen & Getränke',
      'Nur Silvesterparty (ab 21:00 Uhr): Eintritt 10 € p.P. inkl. Sekt zum Anstoßen und Mitternachtssnack',
      'Die Party mit DJ startet um 21:00 Uhr'
    ],
    highlightsNl: [
      '10:00 – 16:00 uur regulier geopend',
      'Oudejaarsdiner (17:00 – 19:00 uur): € 15 p.p. incl. welkomstdrankje en broodmand excl. eten & drinken',
      'Diner & feest (vanaf 19:30 uur): € 25 p.p. incl. welkomstdrankje, broodmand, aansluitende party, toost om middernacht & snack excl. eten & drinken',
      'Alleen feest (vanaf 21:00 uur): Entree € 10 p.p. incl. glas prosecco en midnight snack',
      'Het feest met dj begint om 21:00 uur'
    ],
    shortDescriptionDe: 'Silvester in der Dorf Alm Winterberg: Tagsüber regulär geöffnet, abends Silvester-Essen (17–19 Uhr oder ab 19:30 Uhr) und ab 21:00 Uhr Silvesterparty mit DJ, Sekt zum Anstoßen und Mitternachtssnack.',
    shortDescriptionNl: 'Oud en Nieuw in de Dorf Alm Winterberg: overdag geopend, \'s avonds oudejaarsdiner (17–19 uur of vanaf 19:30 uur) en vanaf 21:00 uur Sylvesterparty met dj, prosecco en midnight snack.',
    infoTextDe: 'Feiert in der Dorf Alm Winterberg ins neue Jahr! Am 31. Dezember 2026 ist die Hütte von 10:00 bis 16:00 Uhr regulär geöffnet. Am Abend könnt ihr aus der regulären Speisekarte sowie einer kleinen Silvester-Zusatzkarte wählen. Zwei Optionen: 17:00 bis 19:00 Uhr (15 € p.P. inkl. Begrüßungsgetränk und Brotkorb zzgl. Essen & Getränke) oder ab 19:30 Uhr Open End (25 € p.P. inkl. Begrüßungsgetränk, Brotkorb, anschließender Silvesterparty, Sekt zum Anstoßen und Mitternachtssnack zzgl. Essen & Getränke). Wer nur zur Party kommen möchte, kann ab 21:00 Uhr direkt dazukommen (Eintritt 10 € p.P. inkl. Sekt und Mitternachtssnack). Tischreservierung empfohlen.',
    infoTextNl: 'Vier de jaarwisseling in Dorf Alm Winterberg! Op 31 december 2026 overdag van 10:00 tot 16:00 uur regulier geopend. \'s Avonds kunt u kiezen van de reguliere kaart en een kleine Sylvester-kaart. Dineroptie 1 van 17:00 tot 19:00 uur (€ 15 p.p.) of dineroptie 2 vanaf 19:30 uur inclusief party (€ 25 p.p. inclusief feest met dj, prosecco en snack). Alleen naar het feest komen kan vanaf 21:00 uur (€ 10 p.p.). Tafelreservering aangeraden.',
    image: '/silvester-dorf-alm-ai.jpg',
    isAiGenerated: true,
    badgeDe: 'Alm-Party & Menü 2026',
    badgeNl: 'Alm-party & Diner 2026',
    contactEmail: 'winterberg@dorf-alm.de',
    contactPhone: '02981 929592',
    website: 'https://www.dorf-alm-winterberg.de',
    bookingUrl: 'https://www.dorf-alm-winterberg.de',
    capacityDe: 'Tischreservierung empfohlen • Plätze nach Verfügbarkeit',
    capacityNl: 'Tafelreservering aangeraden • Naar beschikbaarheid'
  },

  // 2. Hotel Oversum Ski- & Vitalresort (Quelle: oversum-vitalresort.de/kulinarik/silvestergala/)
  {
    id: 'silvestergala-oversum-winterberg-2026',
    businessId: 'hotel-oversum-winterberg',
    businessName: 'Hotel Oversum Ski- & Vitalresort',
    subtitleDe: 'Silvestergala mit Gala-Buffet, Getränkepauschale, Live-Musik & Kinderbuffet',
    subtitleNl: 'Oudejaarsgala met galabuffet, drankenarrangement, livemuziek & kinderbuffet',
    titleDe: 'Exklusive Silvestergala 2026 im Oversum Vitalresort',
    titleNl: 'Exclusief Oudejaarsgala 2026 in Oversum Vitalresort',
    dateDe: 'Donnerstag, 31. Dezember 2026',
    dateNl: 'Donderdag 31 december 2026',
    timeDe: 'Silvesterabend: Gala-Buffet & Feier zum Jahreswechsel\nIm Rahmen des mehrtägigen Silvesterarrangements (ab 3 Nächten)',
    timeNl: 'Oudejaarsavond: Galabuffet & feestelijke viering\nOnderdeel van het meerdaagse Sylvester-arrangement (vanaf 3 overnachtingen)',
    packageTypeDe: 'Silvester-Gala-Buffet & Getränkepauschale',
    packageTypeNl: 'Galabuffet & drankenarrangement',
    partyType: 'gala',
    priceInfoDe: 'Gala-Buffet & Getränkepauschale im Arrangement enthalten\nBuchung & Verfügbarkeiten direkt auf Anfrage beim Hotel',
    priceInfoNl: 'Galabuffet & dranken inbegrepen in arrangement\nBoeking & beschikbaarheid op aanvraag bij het hotel',
    address: 'Am Kurpark 6, 59955 Winterberg',
    district: 'Winterberg',
    category: 'Hotels & Wellness',
    subcategory: 'Vitalresort & Wellnesshotel',
    features: [
      {
        icon: 'utensils',
        titleDe: 'Silvester-Gala-Buffet & Kinderbuffet',
        titleNl: 'Galabuffet & kinderbuffet',
        descDe: 'Festliches Silvester-Gala-Buffet mit feiner Speisenauswahl sowie speziellem Kinderbuffet für Familien.',
        descNl: 'Feestelijk galabuffet met uitgebreide gerechten en een kindvriendelijk buffet voor gezinnen.'
      },
      {
        icon: 'wine',
        titleDe: 'Getränkepauschale inklusive',
        titleNl: 'Inclusief drankenarrangement',
        descDe: 'Ausgewählte Getränkepauschale während der Silvesterfeier im Arrangementpreis enthalten.',
        descNl: 'Geselecteerd drankenarrangement tijdens de feestavond inbegrepen in het arrangement.'
      },
      {
        icon: 'music',
        titleDe: 'Live-Musik, Sekt & Mitternachtssnack',
        titleNl: 'Livemuziek, toost & midnight snack',
        descDe: 'Musikalische Begleitung durch Live-Band, Glas Sekt zum Anstoßen um Mitternacht und Mitternachtssnack.',
        descNl: 'Muzikale begeleiding door liveband, glas prosecco om middernacht en een middernachtsnack.'
      }
    ],
    highlightsDe: [
      'Silvester-Gala-Buffet mit großer Speisenauswahl und separatem Kinderbuffet',
      'Ausgewählte Getränkepauschale während der Feier inklusive',
      'Musikalische Begleitung mit Live-Band',
      'Glas Sekt um Mitternacht und herzhafter Mitternachtssnack',
      'Silvesterarrangement ab 3 Nächten inkl. Frühstücksbuffet, Kuchenbuffet, Glühweinwanderung und Spa-Nutzung'
    ],
    highlightsNl: [
      'Groot oudejaars-galabuffet met kindvriendelijk buffet voor gezinnen',
      'Geselecteerd drankenarrangement tijdens het feest inbegrepen',
      'Sfeervolle liveband voor muziek en dans',
      'Glas prosecco om middernacht en een middernachtsnack',
      'Arrangement vanaf 3 overnachtingen incl. ontbijt, middaggebak, glühweinwandeling en wellness'
    ],
    shortDescriptionDe: 'Silvestergala im Oversum Ski- & Vitalresort Winterberg: Silvester-Gala-Buffet, ausgewählte Getränkepauschale, Live-Band, Sekt um Mitternacht und Mitternachtssnack im Rahmen des Silvesterarrangements.',
    shortDescriptionNl: 'Oudejaarsgala in Oversum Ski- & Vitalresort Winterberg: galabuffet, drankenarrangement, liveband, champagne om middernacht en snack als onderdeel van het Sylvester-arrangement.',
    infoTextDe: 'Das Hotel Oversum Ski- & Vitalresort am Kurpark veranstaltet zum Jahreswechsel seine traditionelle Silvestergala. Das Silvesterarrangement (buchbar ab 3 Übernachtungen) umfasst neben Übernachtung und Frühstücksbuffet das festliche Silvester-Gala-Buffet, eine ausgewählte Getränkepauschale während der Feier, Tanz und Unterhaltung mit Live-Band, ein Glas Sekt um Mitternacht, einen Mitternachtssnack sowie ein separates Kinderbuffet. Zudem sind tägliches Kuchenbuffet, eine winterliche Glühweinwanderung und die Nutzung der Wellness- und Saunalandschaft enthalten. Buchungen und Verfügbarkeiten direkt über das Hotel.',
    infoTextNl: 'Hotel Oversum Ski- & Vitalresort aan het Kurpark organiseert met de jaarwisseling haar traditionele oudejaarsgala. Het arrangement (vanaf 3 overnachtingen) omvat het galabuffet, een geselecteerd drankenarrangement, livemuziek, kinderbuffet, toosten om middernacht en een midnight snack. Inclusief ontbijt, glühweinwandeling en wellness. Reserveringen direct via het hotel.',
    image: '/silvester-oversum-ai.jpg',
    isAiGenerated: true,
    badgeDe: 'Gala & Wellness 2026',
    badgeNl: 'Gala & Wellness 2026',
    contactEmail: 'info@oversum-vitalresort.de',
    contactPhone: '02981 929550',
    website: 'https://www.oversum-vitalresort.de/kulinarik/silvestergala/',
    bookingUrl: 'https://www.oversum-vitalresort.de/kulinarik/silvestergala/',
    capacityDe: 'Im Rahmen des mehrtägigen Silvesterarrangements buchbar',
    capacityNl: 'Te boeken als onderdeel van het meerdaagse Sylvester-arrangement'
  },

  // 3. Skihütte Der Brabander (Quelle: brabander.de/arrangements/weihnachten-silvester/)
  {
    id: 'silvester-brabander-skihuette-2026',
    businessId: 'brabander-skihutte',
    businessName: 'Skihütte Der Brabander',
    subtitleDe: 'Silvesterparty an der Piste Herrloh mit Live-Musik, Häppchenbuffet, Oliebollen & Feuerwerk',
    subtitleNl: 'Sylvesterfeest aan de Herrloh-piste met livemuziek, hapjesbuffet, oliebollen & vuurwerk',
    titleDe: 'Silvesterparty 2026 in der Skihütte Der Brabander',
    titleNl: 'Oudejaarsfeest 2026 in Skihütte Der Brabander',
    dateDe: 'Donnerstag, 31. Dezember 2026',
    dateNl: 'Donderdag 31 december 2026',
    timeDe: 'Donnerstag, 31. Dezember 2026\nSilvesterparty am Abend bis ins neue Jahr',
    timeNl: 'Donderdag 31 december 2026\nSylvesterparty \'s avonds tot in het nieuwe jaar',
    packageTypeDe: 'Skihütten-Silvester & Feuerwerk',
    packageTypeNl: 'Skihut-Sylvester & vuurwerk',
    partyType: 'huette',
    priceInfoDe: 'Online-Vorverkauf über winterbergbooking.de\nInkl. Häppchenbuffet, Oliebollen & Mitternachtssekt (Getränke exkl.)',
    priceInfoNl: 'Online voorverkoop via winterbergbooking.de\nIncl. hapjesbuffet, oliebollen & toost om middernacht (dranken excl.)',
    address: 'Am Herrloh, In der Büre 32, 59955 Winterberg',
    district: 'Winterberg',
    category: 'Gastronomie & Party',
    subcategory: 'Event-Skihütte an der Piste',
    features: [
      {
        icon: 'music',
        titleDe: 'Live-Musik in der Skihütte',
        titleNl: 'Livemuziek in de berghut',
        descDe: 'Stimmungsvolle Live-Musik direkt an der Piste Herrloh (auch für Nicht-Hotelgäste offen).',
        descNl: 'Gezellige livemuziek direct aan de skipiste (ook toegankelijk voor niet-hotelgasten).'
      },
      {
        icon: 'utensils',
        titleDe: 'Häppchenbuffet & Oliebollen',
        titleNl: 'Hapjesbuffet & oliebollen',
        descDe: 'Reichhaltiges Häppchenbuffet, traditionelle holländische Oliebollen und warme Apfelküchlein.',
        descNl: 'Royaal warm en koud hapjesbuffet, traditionele Nederlandse oliebollen en appelbeignets.'
      },
      {
        icon: 'sparkles',
        titleDe: 'Mitternachtssekt & Feuerwerk',
        titleNl: 'Toost om 00:00u & vuurwerk',
        descDe: 'Ein Glas Sekt um Mitternacht zum Anstoßen und spektakuläres Feuerwerk an der Skipiste Herrloh.',
        descNl: 'Een glas prosecco om middernacht om te proosten en vuurwerk op de skipiste van de Herrloh.'
      }
    ],
    highlightsDe: [
      'Silvesterfeier in der Skihütte steht auch externen Besuchern und Nicht-Hotelgästen offen',
      'Inklusive Live-Musik für ausgelassene Stimmung',
      'Reichhaltiges Häppchenbuffet über den Abend',
      'Traditionelle holländische Oliebollen und Apfelküchlein',
      'Ein Glas Sekt um Mitternacht zum Anstoßen inklusive (weitere Getränke exklusive)',
      'Spektakuläres Feuerwerk an der Skipiste am Herrloh'
    ],
    highlightsNl: [
      'Het feest in de skihut is ook toegankelijk voor externe bezoekers en daggasten',
      'Inclusief gezellige livemuziek',
      'Royaal hapjesbuffet gedurende de avond',
      'Traditionele Nederlandse oliebollen en appelbeignets',
      'Glas prosecco om middernacht inbegrepen (overige dranken exclusief)',
      'Spectaculair vuurwerk op de Herrloh-skipiste'
    ],
    shortDescriptionDe: 'Silvesterparty 2026 in der Skihütte Der Brabander: Live-Musik, Häppchenbuffet, traditionelle Oliebollen & Apfelküchlein, Mitternachtssekt und Feuerwerk am Skihang. Tickets im Vorverkauf.',
    shortDescriptionNl: 'Sylvesterparty 2026 in Skihütte Der Brabander: livemuziek, hapjesbuffet, traditionele oliebollen, champagne en vuurwerk aan de piste. Tickets in de voorverkoop.',
    infoTextDe: 'Die Skihütte Der Brabander an der Piste Herrloh lädt zur Silvesterparty ein – geöffnet auch für externe Besucher. Zum Programm gehören Live-Musik, ein reichhaltiges Häppchenbuffet, traditionelle holländische Oliebollen und Apfelküchlein, ein Glas Sekt um Mitternacht zum Anstoßen sowie ein spektakuläres Feuerwerk am Skihang (weitere Getränke exklusive). Tickets können im Voraus online reserviert werden. Zudem bietet das Hotel Der Brabander mehrtägige Unterkunftsarrangements über Weihnachten und Silvester an.',
    infoTextNl: 'Skihütte Der Brabander aan de skipiste organiseert een gezellig Sylvesterfeest, ook voor externe bezoekers. Inclusief livemuziek, hapjesbuffet, verse oliebollen en appelbeignets, een glas prosecco om middernacht en vuurwerk op de piste (overige dranken exclusief). Tickets vooraf online te reserveren. Tevens meerdaagse hotelarrangementen beschikbaar.',
    image: '/silvester-brabander-ai.jpg',
    isAiGenerated: true,
    badgeDe: 'Hüttenzauber & Feuerwerk',
    badgeNl: 'Huttensfeer & Vuurwerk',
    contactEmail: 'info@brabander.nl',
    contactPhone: '02981 9320',
    website: 'https://brabander.de/arrangements/weihnachten-silvester/',
    bookingUrl: 'https://www.winterbergbooking.de',
    capacityDe: 'Online-Tickets im Vorverkauf über winterbergbooking.de buchbar',
    capacityNl: 'Voorverkooptickets online via winterbergbooking.de te boeken'
  },

  // 4. Winterberger Winterdorf (Quelle: winterberger-winterdorf.de/programm & Programm-Aushang)
  {
    id: 'silvester-winterberger-winterdorf-2026',
    businessName: 'Winterberger Winterdorf',
    subtitleDe: 'Open-Air Silvesterparty mit DJ Marlon auf dem Marktplatz Untere Pforte',
    subtitleNl: 'Openlucht Sylvesterfeest met DJ Marlon op het marktplein Untere Pforte',
    titleDe: 'Open-Air Silvesterparty 2026 im Winterberger Winterdorf',
    titleNl: 'Open-Air Oudejaarsfeest 2026 in Winterberger Winterdorf',
    dateDe: 'Donnerstag, 31. Dezember 2026',
    dateNl: 'Donderdag 31 december 2026',
    timeDe: 'Donnerstag, 31. Dezember 2026: 11:00 – 01:00 Uhr nachts geöffnet\nSilvesterparty mit DJ Marlon am Abend',
    timeNl: 'Donderdag 31 december 2026: geopend van 11:00 tot 01:00 uur \'s nachts\nSylvesterparty met DJ Marlon in de avond',
    packageTypeDe: 'Open-Air Silvesterparty unter freiem Himmel',
    packageTypeNl: 'Openlucht Sylvesterfeest in het centrum',
    partyType: 'openair',
    priceInfoDe: 'Eintritt frei\nOffene Veranstaltung auf dem Marktplatz Untere Pforte',
    priceInfoNl: 'Gratis toegang\nOpenbaar evenement op het plein Untere Pforte',
    address: 'Marktplatz Untere Pforte, 59955 Winterberg',
    district: 'Winterberg',
    category: 'Open Air & Event',
    subcategory: 'Wintermarkt & Marktplatz-Event',
    features: [
      {
        icon: 'headphones',
        titleDe: 'Silvesterparty mit DJ Marlon',
        titleNl: 'Sylvesterfeest met DJ Marlon',
        descDe: 'DJ Marlon sorgt auf dem Marktplatz für Stimmung und Musik zum Jahreswechsel.',
        descNl: 'DJ Marlon verzorgt de feestmuziek op het marktplein voor de jaarwisseling.'
      },
      {
        icon: 'wine',
        titleDe: 'Glühwein, Punsch & Sauerländer Spezialitäten',
        titleNl: 'Glühwein & streekgerechten',
        descDe: 'Winzer-Glühwein, Punsch und Spezialitäten an den gemütlichen Holzhütten.',
        descNl: 'Warme glühwein, punch en lekkernijen bij de sfeervolle houten chalets.'
      },
      {
        icon: 'clock',
        titleDe: 'Geöffnet bis 01:00 Uhr nachts',
        titleNl: 'Geopend tot 01:00 uur \'s nachts',
        descDe: 'Das Winterdorf bleibt an Silvester bis 01:00 Uhr nachts geöffnet – Treffpunkt zum gemeinsamen Anstoßen.',
        descNl: 'Het Winterdorf blijft op oudejaarsavond geopend tot 01:00 uur \'s nachts.'
      }
    ],
    highlightsDe: [
      'Silvesterparty mit DJ Marlon',
      'Geöffnet an Silvester (31. Dezember) bis 01:00 Uhr nachts',
      'Eintritt frei – keine Voranmeldung oder Tickets nötig',
      'Zentraler Treffpunkt auf dem Marktplatz an der Unteren Pforte',
      'Winzer-Glühwein, Punsch und Spezialitäten in den Holzhütten'
    ],
    highlightsNl: [
      'Sylvesterfeest met DJ Marlon',
      'Geopend op 31 december tot 01:00 uur \'s nachts',
      'Toegang gratis – geen ticket of reservering nodig',
      'Centraal trefpunt op het plein Untere Pforte',
      'Glühwein, punch en hapjes bij de chalets'
    ],
    shortDescriptionDe: 'Silvesterparty im Winterberger Winterdorf: Am 31. Dezember geöffnet bis 01:00 Uhr nachts mit DJ Marlon auf dem Marktplatz Untere Pforte. Eintritt frei!',
    shortDescriptionNl: 'Sylvesterfeest in het Winterberger Winterdorf: op 31 december geopend tot 01:00 uur \'s nachts met DJ Marlon op het plein Untere Pforte. Gratis toegang!',
    infoTextDe: 'Das Winterberger Winterdorf auf dem Marktplatz an der Unteren Pforte lädt an Silvester zum Feiern unter freiem Himmel ein. Am 31. Dezember ist das Winterdorf bis 01:00 Uhr nachts geöffnet. Für die musikalische Stimmung am Silvesterabend sorgt DJ Marlon. Besucher können mit Glühwein, Punsch und Sauerländer Spezialitäten in den Holzhütten auf das neue Jahr anstoßen. Der Eintritt ist frei.',
    infoTextNl: 'Het Winterberger Winterdorf op de Untere Pforte is op oudejaarsavond geopend tot 01:00 uur \'s nachts. DJ Marlon zorgt voor de muziek op het marktplein. Bezoekers proosten samen met glühwein en streekgerechten op het nieuwe jaar. Toegang is gratis.',
    image: '/silvester-winterdorf-ai.jpg',
    isAiGenerated: true,
    badgeDe: 'Open-Air & Eintritt frei',
    badgeNl: 'Open-Air & Gratis entree',
    contactEmail: 'info@winterberger-winterdorf.de',
    website: 'https://www.winterberger-winterdorf.de/programm',
    bookingUrl: 'https://www.winterberger-winterdorf.de/programm',
    capacityDe: 'Freier Zugang für alle Besucher ohne Reservierung',
    capacityNl: 'Vrije toegang voor iedereen zonder reservering'
  },

  // 5. Die Tenne Winterberg (Quelle: tenne-winterberg.de/veranstaltung/silvester-in-der-tenne-2/)
  {
    id: 'silvester-die-tenne-winterberg-2026',
    businessId: 'tenne-winterberg',
    businessName: 'Die Tenne Winterberg',
    subtitleDe: 'Silvesterparty im Kult-Tanzlokal der Winterberger Altstadt',
    subtitleNl: 'Sylvesterfeest in de bekende discotheek van Winterberg',
    titleDe: 'SILVESTER in der Tenne 2026',
    titleNl: 'SILVESTER in Die Tenne 2026',
    dateDe: 'Donnerstag, 31. Dezember 2026',
    dateNl: 'Donderdag 31 december 2026',
    timeDe: 'Donnerstag, 31. Dezember 2026\nSilvesterparty am Abend',
    timeNl: 'Donderdag 31 december 2026\nSylvesterparty in de avond',
    packageTypeDe: 'Club-Silvesterparty',
    packageTypeNl: 'Club-Sylvesterfeest',
    partyType: 'club',
    priceInfoDe: '15,00 € im Online-Vorverkauf\nDigitales Ticket über tenne-winterberg.de',
    priceInfoNl: '€ 15,00 in de online voorverkoop\nDigitaal e-ticket via tenne-winterberg.de',
    address: 'Marktstraße 12, 59955 Winterberg',
    district: 'Winterberg',
    category: 'Club & Nightlife',
    subcategory: 'Diskothek & Tanzlokal',
    features: [
      {
        icon: 'headphones',
        titleDe: 'Club-Silvesterparty & Tanz',
        titleNl: 'Club-Sylvesterfeest & dansen',
        descDe: 'Feiern und Tanzen zum Jahreswechsel in Winterbergs bekanntem Tanzlokal in der Marktstraße.',
        descNl: 'Feesten en dansen voor de jaarwisseling in de bekende club in de Marktstraße.'
      },
      {
        icon: 'ticket',
        titleDe: '15,00 € Vorverkaufsticket',
        titleNl: '€ 15,00 voorverkoopticket',
        descDe: 'Digitales Online-Ticket im Vorverkauf über die offizielle Website erhältlich.',
        descNl: 'Digitaal ticket online verkrijgbaar via de officiële website.'
      },
      {
        icon: 'wine',
        titleDe: 'Theken & Drinks',
        titleNl: 'Bars & drankjes',
        descDe: 'Erfrischende Getränke, Cocktails und Biere an den Theken der Tenne.',
        descNl: 'Koude bieren, cocktails en drankjes aan de bars van Die Tenne.'
      }
    ],
    highlightsDe: [
      'SILVESTER in der Tenne!',
      'Datum: 31. Dezember 2026',
      'Online-Tickets im Vorverkauf für 15,00 € auf tenne-winterberg.de',
      'Traditionsreiches Tanz- und Partylokal mitten in der Winterberger Altstadt (Marktstraße 12)'
    ],
    highlightsNl: [
      'SILVESTER in Die Tenne!',
      'Datum: 31 december 2026',
      'Online voorverkooptickets voor € 15,00 via tenne-winterberg.de',
      'Bekende uitgaansgelegenheid in het centrum van Winterberg (Marktstraße 12)'
    ],
    shortDescriptionDe: 'SILVESTER in der Tenne 2026: Die Silvesterparty in Winterbergs Traditionsclub in der Marktstraße. Tickets im Online-Vorverkauf für 15,00 € auf tenne-winterberg.de.',
    shortDescriptionNl: 'SILVESTER in Die Tenne 2026: feest de jaarwisseling in de bekende discotheek in de Marktstraße. Online voorverkooptickets voor € 15,00 via tenne-winterberg.de.',
    infoTextDe: 'Die Tenne Winterberg in der Marktstraße 12 lädt an Silvester zur Party ein: "SILVESTER in der Tenne!". Tickets für den Abend sind im Vorverkauf als digitales Ticket über die Website tenne-winterberg.de für 15,00 € erhältlich.',
    infoTextNl: 'Die Tenne Winterberg aan de Marktstraße 12 organiseert op oudejaarsavond het feest "SILVESTER in der Tenne!". Digitale voorverkooptickets zijn verkrijgbaar via tenne-winterberg.de voor € 15,00.',
    image: '/silvester-tenne-ai.jpg',
    isAiGenerated: true,
    badgeDe: 'Club Silvesterparty 15 €',
    badgeNl: 'Club Sylvesterfeest € 15',
    contactEmail: 'info@tenne-winterberg.de',
    contactPhone: '02981 92870',
    website: 'https://tenne-winterberg.de/veranstaltung/silvester-in-der-tenne-2/',
    bookingUrl: 'https://tenne-winterberg.de/veranstaltung/silvester-in-der-tenne-2/',
    capacityDe: 'Vorverkaufsticket online erhältlich',
    capacityNl: 'Voorverkooptickets online verkrijgbaar'
  },

  // 6. Hotel Winterberg Resort (Quelle: hotelwinterberg-resort.nl/de/weihnachten-silvester-programm-winterberg/)
  {
    id: 'silvester-hotel-winterberg-resort-2026',
    businessId: 'hotel-winterberg-resort',
    businessName: 'Hotel Winterberg Resort',
    subtitleDe: 'Silvesterprogramm mit festlichen Tafeln, DJ, Tanz & Stockbrot am Lagerfeuer',
    subtitleNl: 'Sylvesterprogramma met feestelijk diner, dj, dans & kampvuur voor kinderen',
    titleDe: 'Silvester- & Neujahrsprogramm im Winterberg Resort',
    titleNl: 'Oudejaars- & Nieuwjaarsprogramma in Winterberg Resort',
    dateDe: '30. Dezember 2026 bis 1. Januar 2027',
    dateNl: '30 december 2026 t/m 1 januari 2027',
    timeDe: 'Mehrtägiges Festtagsprogramm (30.12. – 01.01.)\nSilvesterabend mit festlichen Tischen, DJ & Tanz',
    timeNl: 'Meerdaags feestprogramma (30-12 t/m 01-01)\nOudejaarsavond met feestelijke tafels, dj & dans',
    packageTypeDe: 'Silvesterprogramm & Familien-Aktionen',
    packageTypeNl: 'Sylvesterprogramma & familie-activiteiten',
    partyType: 'hotel',
    priceInfoDe: 'Im Rahmen des Hotelaufenthalts buchbar\nAnfragen zu Programm & Zimmern direkt beim Hotel',
    priceInfoNl: 'Onderdeel van het verblijfsarrangement\nVragen over kamers & programma rechtstreeks bij het hotel',
    address: 'In der Renau 1, 59955 Winterberg',
    district: 'Winterberg',
    category: 'Hotels & Wellness',
    subcategory: 'Resort & Hotel',
    features: [
      {
        icon: 'utensils',
        titleDe: 'Festlich gedeckte Tafeln',
        titleNl: 'Feestelijk gedekte tafels',
        descDe: 'Festlich gedeckte Tische mit Kerzen, Tannengrün und Servietten zum Silvesteressen.',
        descNl: 'Feestelijk gedekte tafels met kaarsen, dennengroen en servetten.'
      },
      {
        icon: 'headphones',
        titleDe: 'Musik, DJ, Tanz & Mitternachtstoast',
        titleNl: 'Muziek, dj, dans & toost om 00:00u',
        descDe: 'Musik, DJ und Tanz sowie gemeinsames Anstoßen um Mitternacht auf das neue Jahr.',
        descNl: 'Muziek, dj en dansvloer, samen proosten om middernacht op het nieuwe jaar.'
      },
      {
        icon: 'flame',
        titleDe: 'Stockbrot am Lagerfeuer & Kinderprogramm',
        titleNl: 'Broodjes bakken bij kampvuur & kinderpret',
        descDe: 'Basteln, Plätzchen verzieren und Stockbrotbacken am Lagerfeuer für die Kinder.',
        descNl: 'Knutselen, koekjes versieren en broodjes bakken bij het kampvuur voor de kids.'
      }
    ],
    highlightsDe: [
      'Silvester- und Neujahrsprogramm über den Jahreswechsel (30.12. – 01.01.)',
      'Festlich gedeckte Tische mit Kerzen und Tannengrün',
      'Musik, DJ und Tanz sowie gemeinsames Anstoßen um Mitternacht',
      'Nachmittagskaffee mit hausgemachtem Kuchen, Glühwein, Kinderpunsch und heißer Schokolade',
      'Kinderprogramm: Basteln, Plätzchen verzieren und Stockbrotbacken am Lagerfeuer'
    ],
    highlightsNl: [
      'Oudejaars- en nieuwjaarsprogramma rond de jaarwisseling (30-12 t/m 01-01)',
      'Feestelijk gedekte tafels met kaarsen en dennengroen',
      'Muziek, dj en dans, gezamenlijk proosten om middernacht',
      'Middagkoffie met huisgemaakt gebak, glühwein, kinderpunch en warme chocolademelk',
      'Kinderprogramma: knutselen, koekjes versieren en broodjes bakken bij het kampvuur'
    ],
    shortDescriptionDe: 'Silvesterprogramm im Hotel Winterberg Resort: Festlich gedeckte Tafeln, Musik, DJ und Tanz, Mitternachtsanstoßen, Lagerfeuer mit Stockbrot sowie Kaffee, Kuchen und Glühwein.',
    shortDescriptionNl: 'Sylvesterprogramma in Hotel Winterberg Resort: feestelijk gedekte tafels, muziek, dj en dans, toosten om 00:00 uur, kampvuur voor de kids, glühwein en gebak.',
    infoTextDe: 'Das Hotel Winterberg Resort bietet für den Jahreswechsel ein spezielles Weihnachts- und Silvesterprogramm an. Gäste erwarten am Silvesterabend festlich gedeckte Tische (mit Kerzen und Tannengrün), Musik, DJ und Tanz sowie das gemeinsame Anstoßen um Mitternacht. Tagsüber gibt es Nachmittagskaffee mit hausgemachtem Kuchen, hausgemachten Glühwein, Kinderpunsch und heiße Schokolade. Für Kinder werden Bastelaktionen, Plätzchenverzieren und Stockbrotbacken am Lagerfeuer angeboten. Buchungsanfragen direkt an das Hotel.',
    infoTextNl: 'Hotel Winterberg Resort biedt een speciaal eindejaarsprogramma. Op oudejaarsavond wachten feestelijk gedekte tafels, muziek, dj en dansvloer en gezamenlijk toosten om middernacht. Overdag koffie met huisgemaakt gebak, glühwein en warme chocolademelk. Voor kinderen knutselen en broodjes bakken bij het kampvuur.',
    image: '/silvester-resort-ai.jpg',
    isAiGenerated: true,
    badgeDe: 'Familie & Hüttenzauber',
    badgeNl: 'Familie & Winterfeest',
    contactEmail: 'info@hotelwinterberg-resort.nl',
    contactPhone: '02981 92450',
    website: 'https://hotelwinterberg-resort.nl/de/weihnachten-silvester-programm-winterberg/',
    bookingUrl: 'https://hotelwinterberg-resort.nl/de/weihnachten-silvester-programm-winterberg/',
    capacityDe: 'Im Rahmen des Hotelaufenthalts buchbar',
    capacityNl: 'Te boeken als onderdeel van het hotelverblijf'
  },

  // 7. Skihütte Bei Möppi (Bekannte Tatsache: Möppis große Silvesterparty bei Möppi, Details folgen)
  {
    id: 'silvester-bei-moeppi-winterberg-2026',
    businessId: 'bei-moppi',
    businessName: 'Skihütte Bei Möppi',
    subtitleDe: 'Möppis große Silvesterparty zum Jahreswechsel am Poppenberg',
    subtitleNl: 'Möppi\'s grote Sylvesterparty voor de jaarwisseling aan de Poppenberg',
    titleDe: 'Möppis große Silvesterparty 2026',
    titleNl: 'Möppi\'s grote Oudejaarsparty 2026',
    dateDe: 'Donnerstag, 31. Dezember 2026',
    dateNl: 'Donderdag 31 december 2026',
    timeDe: 'Donnerstag, 31. Dezember 2026\nGenaue Einlass- & Anfangszeiten folgen zeitnah',
    timeNl: 'Donderdag 31 december 2026\nExacte aanvangstijden volgen binnenkort',
    packageTypeDe: 'Skihütten-Silvesterparty',
    packageTypeNl: 'Skihut-Sylvesterfeest',
    partyType: 'huette',
    priceInfoDe: 'Informationen zu Tickets & Eintritt folgen\nVorab-Anfragen direkt beim Betrieb möglich',
    priceInfoNl: 'Informatie over tickets & toegang volgt\nVooraf informeren mogelijk bij de locatie',
    address: 'In d. Büre 32, 59955 Winterberg',
    district: 'Winterberg',
    category: 'Gastronomie & Party',
    subcategory: 'Skihütte & Après-Ski am Poppenberg',
    features: [
      {
        icon: 'flame',
        titleDe: 'Möppis Hütte am Poppenberg',
        titleNl: 'Möppi\'s Hütte aan de Poppenberg',
        descDe: 'Die beliebte Skihütte am Skiliftkarussell lädt zum Feiern des Jahreswechsels ein.',
        descNl: 'De bekende berghut aan de Skiliftkarussell viert samen het nieuwe jaar.'
      },
      {
        icon: 'sparkles',
        titleDe: 'Große Silvesterparty',
        titleNl: 'Groot oudejaarsfeest',
        descDe: 'Möppis große Silvesterparty am 31. Dezember 2026 direkt an der Skipiste.',
        descNl: 'Möppi\'s grote oudejaarsfeest op 31 december 2026 direct aan de skipiste.'
      },
      {
        icon: 'clock',
        titleDe: 'Programm & Details folgen',
        titleNl: 'Programma & details volgen',
        descDe: 'Weitere Informationen zu Programm, Einlass und Reservierungen folgen rechtzeitig vor dem Event.',
        descNl: 'Nadere informatie over programma en toegang wordt tijdig bekendgemaakt.'
      }
    ],
    highlightsDe: [
      'Möppis große Silvesterparty zum Jahreswechsel 2026 / 2027',
      'Location: Skihütte Bei Möppi am Poppenberg in Winterberg',
      'Termin: Donnerstag, 31. Dezember 2026',
      'Detaillierte Informationen zu Ablauf und Tickets folgen in Kürze direkt über den Betrieb'
    ],
    highlightsNl: [
      'Möppi\'s grote oudejaarsfeest voor de jaarwisseling 2026 / 2027',
      'Locatie: Skihütte Bei Möppi aan de Poppenberg in Winterberg',
      'Datum: donderdag 31 december 2026',
      'Gedetailleerde informatie over programma en tickets volgt binnenkort'
    ],
    shortDescriptionDe: 'Möppis große Silvesterparty 2026 in der Skihütte Bei Möppi am Poppenberg in Winterberg. Feiert den Jahreswechsel in der Hütte – weitere Infos zu Programm und Ablauf folgen zeitnah!',
    shortDescriptionNl: 'Möppi\'s grote oudejaarsparty 2026 in Skihütte Bei Möppi aan de Poppenberg in Winterberg. Nadere informatie over het programma volgt binnenkort!',
    infoTextDe: 'In der Skihütte Bei Möppi am Poppenberg (In der Büre 32) findet an Silvester 2026 Möppis große Silvesterparty statt. Gefeiert wird der Jahreswechsel in der bekannten Winterberger Hütte. Detaillierte Informationen zum genauen Ablauf, Uhrzeiten sowie Reservierungs- oder Ticketmöglichkeiten werden rechtzeitig bekanntgegeben. Bei Fragen wenden Sie sich direkt an das Team von Bei Möppi.',
    infoTextNl: 'In Skihütte Bei Möppi aan de Poppenberg (In der Büre 32) vindt op 31 december 2026 Möppi\'s grote oudejaarsfeest plaats. Nadere informatie over tijden en eventuele tickets worden tijdig bekendgemaakt.',
    image: '/silvester-moeppi-ai.jpg',
    isAiGenerated: true,
    badgeDe: 'Möppis Hütte 2026',
    badgeNl: 'Möppi\'s Hütte 2026',
    contactEmail: 'anfrage@bei-moeppi.de',
    contactPhone: '02981 1073',
    website: 'https://www.bei-moeppi.de',
    bookingUrl: 'https://www.bei-moeppi.de',
    capacityDe: 'Details zu Ablauf & Reservierung folgen zeitnah',
    capacityNl: 'Details over programma & tickets volgen binnenkort'
  }
];

export function generateSilvesterPartyIcs(item: SilvesterPartyItem): string {
  const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
  const now = new Date();
  const dtStamp = `${now.getUTCFullYear()}${pad(now.getUTCMonth() + 1)}${pad(now.getUTCDate())}T${pad(now.getUTCHours())}${pad(now.getUTCMinutes())}${pad(now.getUTCSeconds())}Z`;

  const dtStart = '20261231T180000Z';
  const dtEnd = '20270101T040000Z';

  const cleanDescription = (item.infoTextDe || item.shortDescriptionDe || '')
    .replace(/\r?\n/g, '\\n')
    .replace(/,/g, '\\,')
    .replace(/;/g, '\\;');

  const cleanLocation = `${item.businessName}, ${item.address}`
    .replace(/,/g, '\\,')
    .replace(/;/g, '\\;');

  const cleanSummary = `Silvester 2026: ${item.titleDe}`
    .replace(/,/g, '\\,')
    .replace(/;/g, '\\;');

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Winterberg Verzeichnis//Silvester 2026//DE',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:silvester-2026-${item.id}@winterberg-verzeichnis.de`,
    `DTSTAMP:${dtStamp}`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SUMMARY:${cleanSummary}`,
    `DESCRIPTION:${cleanDescription}\\n\\nDetails: ${item.website || 'https://www.winterberg-verzeichnis.de/themen/silvester-feiern-in-winterberg-2026'}`,
    `LOCATION:${cleanLocation}`,
    `URL:${item.website || 'https://www.winterberg-verzeichnis.de'}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');
}
