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
    timeDe: '10:00 – 16:00 Uhr: Regulär geöffnet\nAb 17:00 & 19:30 Uhr: Silvester-Essen\nAb 21:00 Uhr: Silvesterparty (Open End)',
    timeNl: '10:00 – 16:00 uur: Regulier geopend\nVanaf 17:00 & 19:30 uur: Sylvesterdiner\nVanaf 21:00 uur: Feest met dj (Open End)',
    packageTypeDe: 'Silvester-Essen & Party mit DJ',
    packageTypeNl: 'Oudejaarsdiner & feest met dj',
    partyType: 'huette',
    priceInfoDe: '15 € (Essen 17–19 Uhr)\n25 € (Essen & Party ab 19:30 Uhr)\n10 € (nur Party ab 21:00 Uhr)',
    priceInfoNl: '€ 15 (diner 17–19u)\n€ 25 (diner & party vanaf 19:30u)\n€ 10 (alleen party vanaf 21:00u)',
    address: 'Am Waltenberg 35, 59955 Winterberg',
    district: 'Winterberg',
    category: 'Gastronomie & Party',
    subcategory: 'Alpenländische Erlebnisgastronomie',
    features: [
      {
        icon: 'utensils',
        titleDe: 'Silvester-Essen am Abend',
        titleNl: 'Feestelijk oudejaarsdiner',
        descDe: 'Aus der Speisekarte und Silvester-Zusatzkarte wählen.',
        descNl: 'Dineren van de reguliere kaart en Sylvester-kaart.'
      },
      {
        icon: 'headphones',
        titleDe: 'Silvesterparty mit DJ ab 21:00 Uhr',
        titleNl: 'Sylvesterparty met live-dj vanaf 21:00 uur',
        descDe: 'Party mit DJ ab 21:00 Uhr bis Open End.',
        descNl: 'Feest met live-dj tot in de vroege uurtjes.'
      },
      {
        icon: 'wine',
        titleDe: 'Begrüßungsgetränk & Mitternachtssnack',
        titleNl: 'Welkomstdrankje & midnight snack',
        descDe: 'Inkl. Begrüßungsgetränk, Sekt und Mitternachtssnack.',
        descNl: 'Inclusief welkomstdrankje, toost en middernachtsnack.'
      }
    ],
    highlightsDe: [
      'Silvester-Essen & Party mit DJ bis Open End',
      'Zwei Menüzeiten: 17:00–19:00 Uhr oder ab 19:30 Uhr',
      'Party-Ticket ab 21:00 Uhr auch separat erhältlich (10 €)',
      'Inklusive Begrüßungsgetränk, Sekt & Mitternachtssnack'
    ],
    highlightsNl: [
      'Sylvesterdiner & feest met dj tot in de vroege uurtjes',
      'Twee dinertijden: 17:00–19:00 uur of vanaf 19:30 uur',
      'Feestticket vanaf 21:00 uur ook apart verkrijgbaar (€ 10)',
      'Inclusief welkomstdrankje, prosecco & midnight snack'
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
    timeDe: 'Silvesterabend: Festliches Gala-Buffet\nIm 3-Tage-Silvesterarrangement enthalten',
    timeNl: 'Oudejaarsavond: Feestelijk galabuffet\nInbegrepen in arrangement (vanaf 3 nachten)',
    packageTypeDe: 'Silvester-Gala-Buffet & Getränkepauschale',
    packageTypeNl: 'Galabuffet & drankenarrangement',
    partyType: 'gala',
    priceInfoDe: 'Buffet & Getränke im Arrangement\nVerfügbarkeiten auf Anfrage beim Hotel',
    priceInfoNl: 'Buffet & dranken inbegrepen in pakket\nBeschikbaarheid op aanvraag bij het hotel',
    address: 'Am Kurpark 6, 59955 Winterberg',
    district: 'Winterberg',
    category: 'Hotels & Wellness',
    subcategory: 'Vitalresort & Wellnesshotel',
    features: [
      {
        icon: 'utensils',
        titleDe: 'Silvester-Gala-Buffet & Kinderbuffet',
        titleNl: 'Galabuffet & kinderbuffet',
        descDe: 'Gourmet-Buffet und separates Kinderbuffet.',
        descNl: 'Gourmetbuffet en kinderbuffet voor gezinnen.'
      },
      {
        icon: 'wine',
        titleDe: 'Getränkepauschale inklusive',
        titleNl: 'Inclusief drankenarrangement',
        descDe: 'Ausgewählte Getränke während des Gala-Abends.',
        descNl: 'Drankenarrangement tijdens de feestavond.'
      },
      {
        icon: 'music',
        titleDe: 'Live-Musik, Sekt & Mitternachtssnack',
        titleNl: 'Livemuziek, toost & midnight snack',
        descDe: 'Live-Band, Tanz und Mitternachtsanstoßen.',
        descNl: 'Liveband, dans en toosten om middernacht.'
      }
    ],
    highlightsDe: [
      'Großes Gourmet-Gala-Buffet & separates Kinderbuffet',
      'Ausgewählte Getränkepauschale während der Feier inklusive',
      'Live-Band, Tanzfläche & festliche Abendstimmung',
      'Mitternachtsanstoßen mit Sekt & herzhafter Snack'
    ],
    highlightsNl: [
      'Groot gourmet-galabuffet & apart kinderbuffet',
      'Geselecteerd drankenarrangement tijdens het feest inbegrepen',
      'Liveband, dansvloer & feestelijke sfeer',
      'Toosten om middernacht met prosecco & midnight snack'
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
    timeDe: 'Silvesterabend an der Herrloh-Piste\nParty bis in die frühen Morgenstunden',
    timeNl: 'Oudejaarsavond aan de Herrloh-piste\nFeest tot in de vroege ochtend',
    packageTypeDe: 'Skihütten-Silvester & Feuerwerk',
    packageTypeNl: 'Skihut-Sylvester & vuurwerk',
    partyType: 'huette',
    priceInfoDe: 'Online-Vorverkauf auf winterbergbooking.de\nInkl. Häppchenbuffet, Oliebollen & Sekt',
    priceInfoNl: 'Voorverkoop via winterbergbooking.de\nIncl. hapjesbuffet, oliebollen & toost',
    address: 'Am Herrloh, In der Büre 32, 59955 Winterberg',
    district: 'Winterberg',
    category: 'Gastronomie & Party',
    subcategory: 'Event-Skihütte an der Piste',
    features: [
      {
        icon: 'music',
        titleDe: 'Live-Musik in der Skihütte',
        titleNl: 'Livemuziek in de berghut',
        descDe: 'Live-Musik an der Piste Herrloh.',
        descNl: 'Livemuziek aan de piste Herrloh.'
      },
      {
        icon: 'utensils',
        titleDe: 'Häppchenbuffet & Oliebollen',
        titleNl: 'Hapjesbuffet & oliebollen',
        descDe: 'Warmes & kaltes Buffet und Apfelbeignets.',
        descNl: 'Hapjesbuffet en Hollandse oliebollen.'
      },
      {
        icon: 'sparkles',
        titleDe: 'Mitternachtssekt & Feuerwerk',
        titleNl: 'Toost om 00:00u & vuurwerk',
        descDe: 'Sektanstoßen und Herrloh-Feuerwerk.',
        descNl: 'Proosten en vuurwerk op de skipiste.'
      }
    ],
    highlightsDe: [
      'Skihütten-Party auch für externe Besucher offen',
      'Stimmungsvolle Live-Musik an der Piste Herrloh',
      'Häppchenbuffet, holländische Oliebollen & Apfelküchlein',
      'Mitternachtssekt & großes Herrloh-Feuerwerk'
    ],
    highlightsNl: [
      'Feest in de skihut ook open voor externe bezoekers',
      'Gezellige livemuziek aan de skipiste Herrloh',
      'Hapjesbuffet, traditionele oliebollen & appelbeignets',
      'Prosecco om middernacht & vuurwerk op de piste'
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
    timeDe: '11:00 bis 01:00 Uhr nachts geöffnet\nSilvesterparty mit DJ Marlon am Abend',
    timeNl: '11:00 tot 01:00 uur \'s nachts geopend\nSylvesterparty met DJ Marlon in de avond',
    packageTypeDe: 'Open-Air Silvesterparty unter freiem Himmel',
    packageTypeNl: 'Openlucht Sylvesterfeest in het centrum',
    partyType: 'openair',
    priceInfoDe: 'Eintritt frei\nOpen-Air auf dem Marktplatz Untere Pforte',
    priceInfoNl: 'Gratis toegang\nOpenbaar feest op het marktplein',
    address: 'Marktplatz Untere Pforte, 59955 Winterberg',
    district: 'Winterberg',
    category: 'Open Air & Event',
    subcategory: 'Wintermarkt & Marktplatz-Event',
    features: [
      {
        icon: 'headphones',
        titleDe: 'Silvesterparty mit DJ Marlon',
        titleNl: 'Sylvesterfeest met DJ Marlon',
        descDe: 'DJ Marlon sorgt für Stimmung.',
        descNl: 'DJ Marlon verzorgt de feestmuziek.'
      },
      {
        icon: 'wine',
        titleDe: 'Glühwein & Hüttenspezialitäten',
        titleNl: 'Glühwein & streekgerechten',
        descDe: 'Winzer-Glühwein und Punsch.',
        descNl: 'Warme glühwein en lekkernijen.'
      },
      {
        icon: 'clock',
        titleDe: 'Geöffnet bis 01:00 Uhr nachts',
        titleNl: 'Geopend tot 01:00 uur \'s nachts',
        descDe: 'Treffpunkt zum gemeinsamen Anstoßen.',
        descNl: 'Trefpunt voor de jaarwisseling.'
      }
    ],
    highlightsDe: [
      'Open-Air-Silvesterparty mitten in Winterberg',
      'DJ Marlon sorgt für Partystimmung bis 01:00 Uhr',
      'Winzerglühwein, Punsch & Spezialitäten in den Hütten',
      'Freier Eintritt ohne Voranmeldung'
    ],
    highlightsNl: [
      'Openlucht Sylvesterfeest in hartje Winterberg',
      'DJ Marlon zorgt voor muziek tot 01:00 uur',
      'Glühwein, punch en lekkernijen bij de chalets',
      'Gratis toegang zonder reservering'
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
    timeDe: '31. Dezember ab 20:00 Uhr\nClubbing & Tanz bis in den Morgen',
    timeNl: '31 december vanaf 20:00 uur\nClubbing & dans tot in de ochtend',
    packageTypeDe: 'Club-Silvesterparty',
    packageTypeNl: 'Club-Sylvesterfeest',
    partyType: 'club',
    priceInfoDe: '15,00 € im Online-Vorverkauf\nDigitales Ticket auf tenne-winterberg.de',
    priceInfoNl: '€ 15,00 in de voorverkoop\nDigitaal ticket via tenne-winterberg.de',
    address: 'Marktstraße 12, 59955 Winterberg',
    district: 'Winterberg',
    category: 'Club & Nightlife',
    subcategory: 'Diskothek & Tanzlokal',
    features: [
      {
        icon: 'headphones',
        titleDe: 'Club-Silvesterparty & Tanz',
        titleNl: 'Club-Sylvesterfeest & dansen',
        descDe: 'Feiern im Kult-Tanzlokal.',
        descNl: 'Feesten in de bekende discotheek.'
      },
      {
        icon: 'ticket',
        titleDe: '15,00 € Vorverkaufsticket',
        titleNl: '€ 15,00 voorverkoopticket',
        descDe: 'Digitales Online-Ticket.',
        descNl: 'Digitaal e-ticket.'
      },
      {
        icon: 'wine',
        titleDe: 'Theken, Cocktails & Drinks',
        titleNl: 'Bars, cocktails & drinks',
        descDe: 'Große Getränkeauswahl.',
        descNl: 'Drankjes aan de bar.'
      }
    ],
    highlightsDe: [
      'SILVESTER in der Tenne – Der Partyklassiker der Altstadt',
      'Feiern & Tanzen bis in die frühen Morgenstunden',
      'Online-Vorverkauf für 15,00 € direkt über die Website',
      'Einlass am 31. Dezember ab 20:00 Uhr'
    ],
    highlightsNl: [
      'SILVESTER in Die Tenne – Hét clubfeest van het centrum',
      'Feesten & dansen tot in de vroege ochtenduren',
      'Online voorverkooptickets voor € 15,00 via de website',
      'Entree op 31 december vanaf 20:00 uur'
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
    timeDe: 'Festliches Silvesterprogramm (30.12. – 01.01.)\nAbendessen an festlichen Tafeln & Tanz',
    timeNl: 'Feestelijk programma (30-12 t/m 01-01)\nFeestelijk diner & dansen',
    packageTypeDe: 'Silvesterprogramm & Familien-Aktionen',
    packageTypeNl: 'Sylvesterprogramma & familie-activiteiten',
    partyType: 'hotel',
    priceInfoDe: 'Im Rahmen des Hotelaufenthalts buchbar\nDetails & Zimmer direkt beim Hotel',
    priceInfoNl: 'Onderdeel van het hotelverblijf\nInformatie & kamers direct bij het hotel',
    address: 'In der Renau 1, 59955 Winterberg',
    district: 'Winterberg',
    category: 'Hotels & Wellness',
    subcategory: 'Resort & Hotel',
    features: [
      {
        icon: 'utensils',
        titleDe: 'Festlich gedeckte Tafeln',
        titleNl: 'Feestelijk gedekte tafels',
        descDe: 'Kerzen und Tannengrün zum Silvesteressen.',
        descNl: 'Kaarsen en dennengroen voor het diner.'
      },
      {
        icon: 'headphones',
        titleDe: 'Musik, DJ, Tanz & Mitternachtstoast',
        titleNl: 'Muziek, dj, dans & toost om 00:00u',
        descDe: 'DJ-Musik und Mitternachtsanstoßen.',
        descNl: 'Muziek, dans en proosten om middernacht.'
      },
      {
        icon: 'flame',
        titleDe: 'Stockbrot am Lagerfeuer',
        titleNl: 'Broodjes bakken bij kampvuur',
        descDe: 'Stockbrotbacken für Kinder.',
        descNl: 'Broodjes bakken voor de kids.'
      }
    ],
    highlightsDe: [
      'Festlich gedeckte Silvestertafeln mit Kerzen & Tannengrün',
      'Musik, DJ, Tanzfläche & gemeinsamer Mitternachtstoast',
      'Kinderprogramm mit Stockbrot am Lagerfeuer',
      'Nachmittagskaffee mit Kuchen, Glühwein & heißer Schokolade'
    ],
    highlightsNl: [
      'Feestelijk gedekte tafels met kaarsen & dennengroen',
      'Muziek, dj, dansvloer & toosten om middernacht',
      'Kinderprogramma met broodjes bakken bij het kampvuur',
      'Middagkoffie met gebak, glühwein & warme chocolademelk'
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
    timeDe: 'Silvesterabend an der Skihütte Poppenberg\nGenaue Einlasszeiten folgen in Kürze',
    timeNl: 'Oudejaarsavond aan de Poppenberg\nExacte aanvangstijden volgen binnenkort',
    packageTypeDe: 'Skihütten-Silvesterparty',
    packageTypeNl: 'Skihut-Sylvesterfeest',
    partyType: 'huette',
    priceInfoDe: 'Tickets & Einlass-Infos folgen zeitnah\nVorab-Info direkt an der Skihütte',
    priceInfoNl: 'Informatie over tickets & entree volgt\nVooraf informeren bij de locatie',
    address: 'In d. Büre 32, 59955 Winterberg',
    district: 'Winterberg',
    category: 'Gastronomie & Party',
    subcategory: 'Skihütte & Après-Ski am Poppenberg',
    features: [
      {
        icon: 'flame',
        titleDe: 'Möppis Hütte am Poppenberg',
        titleNl: 'Möppi\'s Hütte aan de Poppenberg',
        descDe: 'Beliebte Skihütte am Skilift.',
        descNl: 'Bekende berghut aan de piste.'
      },
      {
        icon: 'sparkles',
        titleDe: 'Große Silvesterparty',
        titleNl: 'Groot oudejaarsfeest',
        descDe: 'Silvesterparty an der Skipiste.',
        descNl: 'Sylvesterparty aan de skipiste.'
      },
      {
        icon: 'clock',
        titleDe: 'Programm & Details folgen',
        titleNl: 'Programma & details volgen',
        descDe: 'Infos folgen zeitnah.',
        descNl: 'Details volgen binnenkort.'
      }
    ],
    highlightsDe: [
      'Möppis große Silvesterparty am beliebten Poppenberghang',
      'Uriges Hüttenflair & Winterstimmung zum Jahreswechsel',
      'Genaue Programmdetails werden zeitnah bekanntgegeben'
    ],
    highlightsNl: [
      'Möppi\'s grote oudejaarsfeest aan de Poppenberg',
      'Gezellige berghutsfeer voor de jaarwisseling',
      'Gedetailleerde programma-info volgt binnenkort'
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
