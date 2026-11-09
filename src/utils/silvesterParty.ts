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
  // 1. Dorf Alm Winterberg
  {
    id: 'silvester-dorf-alm-winterberg-2026',
    businessId: '107',
    businessName: 'Dorf Alm Winterberg',
    subtitleDe: 'Silvester-Essen am Abend & rauschende Silvesterparty mit DJ',
    subtitleNl: 'Oudejaarsdiner en spetterend Sylvesterfeest met live-dj',
    titleDe: 'Silvester 2026 in der Dorf Alm Winterberg',
    titleNl: 'Oud en Nieuw 2026 in Dorf Alm Winterberg',
    dateDe: 'Donnerstag, 31. Dezember 2026',
    dateNl: 'Donderdag 31 december 2026',
    timeDe: 'Tagsüber 10:00–16:00 Uhr • Essen ab 17:00 / 19:30 Uhr • Party ab 21:00 Uhr bis Open End',
    timeNl: 'Overdag 10:00–16:00 uur • Diner vanaf 17:00 / 19:30 uur • Feest vanaf 21:00 uur tot Open End',
    packageTypeDe: 'Silvester-Essen & Party mit DJ',
    packageTypeNl: 'Oudejaarsdiner & feest met dj',
    partyType: 'huette',
    priceInfoDe: '15 € (17–19 Uhr) | 25 € (ab 19:30 Uhr inkl. Party) | 10 € (nur Party ab 21 Uhr)',
    priceInfoNl: '€ 15 (17–19u) | € 25 (vanaf 19:30u incl. feest) | € 10 (alleen feest vanaf 21u)',
    address: 'Am Waltenberg 35, 59955 Winterberg',
    district: 'Winterberg',
    category: 'Gastronomie & Party',
    subcategory: 'Alpenländische Erlebnisgastronomie',
    features: [
      {
        icon: 'utensils',
        titleDe: 'Silvester-Essen am Abend',
        titleNl: 'Feestelijk oudejaarsdiner',
        descDe: 'Gemütlich essen aus der regulären Speisekarte sowie einer feinen Silvester-Zusatzkarte (17:00–19:00 Uhr oder ab 19:30 Uhr).',
        descNl: 'Gezellig dineren van de reguliere menukaart en een speciale Sylvester-kaart (17:00–19:00 uur of vanaf 19:30 uur).'
      },
      {
        icon: 'headphones',
        titleDe: 'Silvesterparty mit DJ ab 21:00 Uhr',
        titleNl: 'Sylvesterparty met live-dj vanaf 21:00 uur',
        descDe: 'Ab 21:00 Uhr startet die ausgelassene Silvesterparty mit DJ – einfach nach dem Essen sitzenbleiben oder direkt dazukommen!',
        descNl: 'Vanaf 21:00 uur knalt het feest met dj – blijf na het eten gezellig natafelen of kom direct binnen voor de party!'
      },
      {
        icon: 'wine',
        titleDe: 'Begrüßungsdrink & Mitternachtssnack',
        titleNl: 'Welkomstdrankje & midnight snack',
        descDe: 'Inklusive feinem Begrüßungsgetränk, Brotkorb, Sekt zum festlichen Mitternachtsanstoßen und deftigem Mitternachtssnack.',
        descNl: 'Inclusief feestelijk welkomstdrankje, broodmand, prosecco om middernacht en een hartige middernachtsnack.'
      }
    ],
    highlightsDe: [
      'Tagsüber 10:00 – 16:00 Uhr regulär geöffnet für Wanderer & Skifahrer',
      'Option 1 (17:00 – 19:00 Uhr): 15 € p.P. inkl. Begrüßungsgetränk und Brotkorb zzgl. Essen & Getränke',
      'Option 2 (ab 19:30 Uhr – Open End): 25 € p.P. inkl. Begrüßungsgetränk, Brotkorb, Silvesterparty, Mitternachtssekt & Snack',
      'Option 3 (Nur Silvesterparty ab 21:00 Uhr): 10 € p.P. Eintritt inkl. Sekt zum Anstoßen und Mitternachtssnack',
      'Top-Stimmung mit Live-DJ im Herzen von Winterberg an der Flaniermeile Am Waltenberg'
    ],
    highlightsNl: [
      'Overdag 10:00 – 16:00 uur regulier geopend voor wintersporters en wandelaars',
      'Optie 1 (17:00 – 19:00 uur): € 15 p.p. incl. welkomstdrankje en broodmand excl. eten & drinken',
      'Optie 2 (vanaf 19:30 uur – Open End): € 25 p.p. incl. welkomstdrankje, broodmand, party, champagne om 00:00u en snack',
      'Optie 3 (Alleen feest vanaf 21:00 uur): € 10 p.p. entree incl. toost om middernacht en midnight snack',
      'Gezellige berghutsfeer met feest-dj in hartje Winterberg aan de boulevard Am Waltenberg'
    ],
    shortDescriptionDe: 'Silvester in der Dorf Alm Winterberg: Feiert mit uns ins neue Jahr 2027! Gemütliches Silvester-Essen am Abend ab 17:00 oder 19:30 Uhr und ab 21:00 Uhr große Silvesterparty mit DJ, Mitternachtssekt und Snack.',
    shortDescriptionNl: 'Oud en Nieuw in de Dorf Alm Winterberg: vier de jaarwisseling met een sfeervol oudejaarsdiner en vanaf 21:00 uur een bruisende Sylvesterparty met dj, prosecco en een middernachtsnack.',
    infoTextDe: 'Feiert mit der Dorf Alm Winterberg ins neue Jahr 2027! Am 31. Dezember 2026 ist die Dorf Alm tagsüber von 10:00 bis 16:00 Uhr regulär für Sie geöffnet. Am Abend erwartet Sie ein stimmungsvolles Silvester-Essen: Wählen Sie aus der regulären Speisekarte sowie einer feinen Silvester-Zusatzkarte. Sie haben die Wahl zwischen zwei Tischzeiten (17:00 bis 19:00 Uhr für 15 € p.P. oder ab 19:30 Uhr Open End für 25 € p.P. inklusive anschließender Party, Sekt zum Anstoßen und Mitternachtssnack). Wer erst später dazustoßen möchte, kommt ab 21:00 Uhr zur Silvesterparty mit DJ (Eintritt 10 € p.P. inkl. Sekt und Snack). Jetzt frühzeitig Plätze reservieren!',
    infoTextNl: 'Vier het nieuwe jaar in Dorf Alm Winterberg! Op 31 december 2026 geopend van 10:00 tot 16:00 uur voor lunch en borrel. \'s Avonds kunt u kiezen uit de reguliere menukaart en een speciale Sylvester-kaart. Dineroptie 1 van 17:00 tot 19:00 uur (€ 15 p.p.) of dineroptie 2 vanaf 19:30 uur open end inclusief party (€ 25 p.p. inclusief feest met dj, middernachtsproost en snack). Alleen naar het feest komen kan ook: vanaf 21:00 uur voor slechts € 10 p.p. Reserveer snel uw tafel!',
    image: '/silvester-dorf-alm-winterberg-2026.jpg',
    flyerImage: '/silvester-dorf-alm-winterberg-2026.jpg',
    badgeDe: 'Alm-Party & Menü 2026',
    badgeNl: 'Alm-party & Diner 2026',
    contactEmail: 'winterberg@dorf-alm.de',
    contactPhone: '02981 929592',
    website: 'https://www.dorf-alm-winterberg.de',
    bookingUrl: 'https://www.dorf-alm-winterberg.de',
    capacityDe: 'Tischreservierung dringend empfohlen • Freie Plätze solange der Vorrat reicht',
    capacityNl: 'Tafelreservering sterk aangeraden • Beperkt aantal plaatsen'
  },

  // 2. Hotel Oversum Ski- & Vitalresort (Silvestergala)
  {
    id: 'silvestergala-oversum-winterberg-2026',
    businessId: 'hotel-oversum-winterberg',
    businessName: 'Hotel Oversum Ski- & Vitalresort',
    subtitleDe: 'Exklusive Silvestergala mit Gala-Buffet, Getränkepauschale & Live-Band',
    subtitleNl: 'Exclusief Oudejaarsgala met galabuffet, drankenarrangement & liveband',
    titleDe: 'Exklusive Silvestergala 2026 im Oversum Vitalresort',
    titleNl: 'Exclusief Oudejaarsgala 2026 in Oversum Vitalresort',
    dateDe: 'Donnerstag, 31. Dezember 2026',
    dateNl: 'Donderdag 31 december 2026',
    timeDe: 'Gala-Abend ab 18:30 Uhr bis Open End • Mehrtägiges Silvester-Arrangement',
    timeNl: 'Gala-avond vanaf 18:30 uur tot Open End • Meerdaags Sylvester-arrangement',
    packageTypeDe: 'Gala-Buffet, Getränke & Live-Musik',
    packageTypeNl: 'Galabuffet, dranken & livemuziek',
    partyType: 'gala',
    priceInfoDe: 'Festliches Gala-Buffet & Getränkepauschale (im Arrangement ab 3 Nächten / Auf Anfrage)',
    priceInfoNl: 'Feestelijk galabuffet & drankenarrangement (in meerdaags arrangement / op aanvraag)',
    address: 'Am Kurpark 6, 59955 Winterberg',
    district: 'Winterberg',
    category: 'Hotels & Wellness',
    subcategory: '4-Sterne-Superior Vitalresort',
    features: [
      {
        icon: 'utensils',
        titleDe: 'Festliches Silvester-Gala-Buffet',
        titleNl: 'Luxe feestelijk galabuffet',
        descDe: 'Hochwertige kulinarische Vielfalt mit edlen Vorspeisen, Fleisch- & Fischspezialitäten, Live-Cooking und Dessertkreationen.',
        descNl: 'Culinair meesterwerk met verfijnde voorgerechten, vlees- en visspecialiteiten, live cooking en verrukkelijke desserts.'
      },
      {
        icon: 'wine',
        titleDe: 'Inklusive Getränkepauschale',
        titleNl: 'Inclusief drankenarrangement',
        descDe: 'Ausgewählte Weine, Biere, alkoholfreie Erfrischungen und Kaffee während des gesamten Galaabends inklusive.',
        descNl: 'Geselecteerde kwaliteitswijnen, bieren, frisdranken en koffie de hele feestavond inbegrepen.'
      },
      {
        icon: 'music',
        titleDe: 'Live-Band & Entertainment',
        titleNl: 'Liveband & entertainment',
        descDe: 'Erstklassige musikalische Begleitung durch renommierte Live-Bands (z. B. "socialclub") für Tanz und beste Stimmung.',
        descNl: 'Eersteklas muzikale omlijsting door gerenommeerde livebands (zoals "socialclub") voor dans en feestvreugde.'
      }
    ],
    highlightsDe: [
      'Großes Silvester-Gala-Buffet mit Gourmet-Spezialitäten und separatem Kinderbuffet für Familien',
      'Ausgewählte Getränkepauschale während der Silvesterfeier im Preis enthalten',
      'Musikalische Begleitung und Tanzmusik mit erstklassiger Live-Band',
      'Glas Sekt um Mitternacht zum gemeinsamen Anstoßen und herzhafter Mitternachtssnack',
      'Im Arrangement enthalten: 3.000 m² Spa- & Wellnesslandschaft, Verwöhnfrühstück & geführte Glühweinwanderung'
    ],
    highlightsNl: [
      'Groot oudejaars-galabuffet met gourmetspecialiteiten en een kindvriendelijk buffet voor families',
      'Geselecteerd drankenarrangement gedurende de hele feestavond inbegrepen',
      'Sfeervolle liveband voor dans en entertainment tot diep in de nacht',
      'Glas prosecco om middernacht om samen te toosten plus een smaakvolle middernachtsnack',
      'In het arrangement inbegrepen: 3.000 m² wellness & sauna, ontbijtbuffet en winterse glühweinwandeling'
    ],
    shortDescriptionDe: 'Erleben Sie den Jahreswechsel 2026/2027 im 4-Sterne-Superior Hotel Oversum in Winterberg: Festliches Silvester-Gala-Buffet, Getränkepauschale, Live-Musik mit Tanz, Mitternachtssekt und Snack.',
    shortDescriptionNl: 'Vier een onvergetelijke jaarwisseling 2026/2027 in het luxe Hotel Oversum in Winterberg: Feestelijk galabuffet, all-inclusive dranken, liveband met dansvloer, champagne om middernacht en snack.',
    infoTextDe: 'Feiern Sie den Jahreswechsel mit Stil und Eleganz im Hotel Oversum Ski- & Vitalresort am Winterberger Kurpark! Das Silvester-Arrangement verspricht unvergessliche Tage im winterlichen Sauerland: Entspannen Sie in der 3.000 m² großen Wellnesslandschaft mit Schwimmbädern und Saunabereich, genießen Sie winterliche Wanderungen mit Glühwein und krönen Sie das Jahr am 31. Dezember bei der großen Silvestergala. Freuen Sie sich auf ein exklusives Gala-Buffet, eine ausgewählte Getränkepauschale, Tanzmusik mit mitreißender Live-Band (z. B. „socialclub“), den feierlichen Mitternachtssekt und einen herzhaften Mitternachtssnack. Auch für Familien bestens geeignet dank individuellem Kinderbuffet.',
    infoTextNl: 'Vier de jaarwisseling in stijl en luxe in het Hotel Oversum Ski- & Vitalresort aan het Kurpark van Winterberg! Het meerdaagse Sylvester-arrangement biedt ontspanning in de 3.000 m² grote wellnesswereld, winterwandelingen met glühwein en op 31 december een groots gala. Geniet van een royaal galabuffet, een drankenarrangement tijdens het feest, dansen met een swingende liveband, feestelijk toosten om 00:00 uur en een midnight snack.',
    image: '/silvester-gala-oversum.jpg',
    badgeDe: 'Gala & Wellness 2026',
    badgeNl: 'Gala & Wellness 2026',
    contactEmail: 'info@oversum-vitalresort.de',
    contactPhone: '02981 929550',
    website: 'https://www.oversum-vitalresort.de/kulinarik/silvestergala/',
    bookingUrl: 'https://www.oversum-vitalresort.de/kulinarik/silvestergala/',
    capacityDe: 'Silvestergala im Rahmen des mehrtägigen Aufenthalts oder auf Anfrage für externe Gäste',
    capacityNl: 'Gala in het kader van een meerdaags verblijf of op aanvraag voor externe gasten'
  },

  // 3. Skihütte Der Brabander
  {
    id: 'silvester-brabander-skihuette-2026',
    businessId: 'brabander-skihutte',
    businessName: 'Skihütte Der Brabander',
    subtitleDe: 'Hüttenzauber an der Skipiste mit Live-Musik, Häppchenbuffet & Skihang-Feuerwerk',
    subtitleNl: 'Huttensfeer aan de skipiste met livemuziek, hapjesbuffet & spectaculair vuurwerk',
    titleDe: 'Silvesterparty 2026 in der Skihütte Der Brabander',
    titleNl: 'Oudejaarsfeest 2026 in Skihütte Der Brabander',
    dateDe: 'Donnerstag, 31. Dezember 2026',
    dateNl: 'Donderdag 31 december 2026',
    timeDe: 'Silvesterparty ab 20:00 Uhr bis Open End (Einlass ab 19:30 Uhr)',
    timeNl: 'Sylvesterfeest vanaf 20:00 uur tot Open End (inloop vanaf 19:30 uur)',
    packageTypeDe: 'Skihütten-Silvester & Feuerwerk',
    packageTypeNl: 'Skihut-Sylvester & vuurwerk',
    partyType: 'huette',
    priceInfoDe: 'Tickets online im Vorverkauf (inkl. Häppchenbuffet, Oliebollen & Mitternachtssekt)',
    priceInfoNl: 'Online tickets in de voorverkoop (incl. hapjesbuffet, oliebollen & prosecco om middernacht)',
    address: 'Am Herrloh, In der Büre 32, 59955 Winterberg',
    district: 'Winterberg',
    category: 'Gastronomie & Party',
    subcategory: 'Event-Skihütte & Après-Ski',
    features: [
      {
        icon: 'music',
        titleDe: 'Live-Musik & Hütten-DJ',
        titleNl: 'Livemuziek & feest-dj',
        descDe: 'Großartige Live-Band und Party-DJ sorgen direkt an der Skipiste für unübertroffene Feststimmung.',
        descNl: 'Gezellige liveband en feest-dj zorgen direct aan de piste voor een uitzinnige feeststemming.'
      },
      {
        icon: 'utensils',
        titleDe: 'Häppchenbuffet & Oliebollen',
        titleNl: 'Royaal hapjesbuffet & oliebollen',
        descDe: 'Köstliches Häppchenbuffet, traditionelle holländische Neujahrs-Oliebollen und warme Apfelküchlein.',
        descNl: 'Heerlijk warm en koud hapjesbuffet, traditionele Hollandse oliebollen en verse appelbeignets.'
      },
      {
        icon: 'sparkles',
        titleDe: 'Spektakuläres Feuerwerk am Herrloh',
        titleNl: 'Spectaculair vuurwerk op de Herrloh',
        descDe: 'Um Mitternacht ein atemberaubendes Feuerwerk über der verschneiten Winterberger Berglandschaft.',
        descNl: 'Om 00:00 uur een adembenemend vuurwerk boven de besneeuwde heuvels van Winterberg.'
      }
    ],
    highlightsDe: [
      'Silvesterparty auch für externe Besucher und Nicht-Hotelgäste nach Voranmeldung geöffnet',
      'Inklusive reichhaltigem Häppchenbuffet über den ganzen Abend verteilt',
      'Traditionelle holländische Oliebollen & warme Apfelküchlein zum Jahreswechsel',
      'Glas Sekt um Mitternacht zum gemeinsamen Anstoßen inklusive',
      'Spektakuläres Silvesterfeuerwerk direkt am Skihang am Herrloh vor traumhafter Bergkulisse',
      'Kombinierbar mit Hotel- und Appartement-Arrangements im Ferienhotel Der Brabander'
    ],
    highlightsNl: [
      'Oudejaarsfeest ook geopend voor externe bezoekers en daggasten (vooraf reserveren verplicht)',
      'Inclusief doorlopend royaal warm en koud hapjesbuffet de hele feestavond lang',
      'Echte traditionele Nederlandse oliebollen en verse appelbeignets om middernacht',
      'Glas prosecco om 00:00 uur om feestelijk te proosten op het nieuwe jaar',
      'Spectaculair vuurwerkspektakel direct op de verlichte skipiste van de Herrloh',
      'Te combineren met verblijfsarrangementen in Vakantiehotel Der Brabander'
    ],
    shortDescriptionDe: 'Feiern Sie Silvester 2026 in der Skihütte Der Brabander am Herrloh: Live-Musik, üppiges Häppchenbuffet, traditionelle Oliebollen, Mitternachtssekt und ein grandioses Skihang-Feuerwerk.',
    shortDescriptionNl: 'Vier Oud en Nieuw 2026 in Skihütte Der Brabander aan de piste: livemuziek, hapjesbuffet, oliebollen, champagne en een spectaculair vuurwerk op de Herrlohberg.',
    infoTextDe: 'Die Skihütte Der Brabander direkt am Skihang Herrloh in Winterberg veranstaltet auch in diesem Jahr ihre legendäre Silvesterparty! Ein ganz besonderes Highlight: Diese Party steht auch Nicht-Hotelgästen und externen Partyfreunden offen. Freuen Sie sich auf fantastische Live-Musik, ein abwechslungsreiches Häppchenbuffet über den Abend hinweg, traditionelle holländische Oliebollen und Apfelküchlein, ein Glas prickelnden Sekt zum Jahreswechsel sowie das berühmte, spektakuläre Brabander-Feuerwerk am Hang. Da die Tickets heiß begehrt und streng limitiert sind, wird eine frühzeitige Online-Buchung über das Buchungsportal dringend empfohlen.',
    infoTextNl: 'Skihütte Der Brabander aan de voet van de Herrloh-pistes organiseert ook dit jaar haar beroemde Sylvesterparty! Het feest is ook toegankelijk voor niet-hotelgasten. Geniet van meeslepende livemuziek, een doorlopend luxe hapjesbuffet, verse ambachtelijke oliebollen en appelbeignets, een toost met prosecco om middernacht en een magisch vuurwerkspektakel op de besneeuwde piste. Tickets zijn beperkt en kunnen vooraf online gereserveerd worden.',
    image: '/silvester-brabander-skihuette.jpg',
    badgeDe: 'Hüttenzauber & Feuerwerk',
    badgeNl: 'Huttensfeer & Vuurwerk',
    contactEmail: 'info@brabander.nl',
    contactPhone: '02981 9320',
    website: 'https://brabander.de/arrangements/weihnachten-silvester/',
    bookingUrl: 'https://www.winterbergbooking.de',
    capacityDe: 'Externe Tickets online buchbar • Begrenztes Kartenkontingent',
    capacityNl: 'Externe tickets online te boeken • Beperkt aantal plaatsen'
  },

  // 4. Winterberger Winterdorf (Marktplatz Untere Pforte)
  {
    id: 'silvester-winterberger-winterdorf-2026',
    businessName: 'Winterberger Winterdorf',
    subtitleDe: 'Große Open-Air Silvesterparty mit DJ Marlon mitten auf dem Marktplatz Untere Pforte',
    subtitleNl: 'Groot openlucht Sylvesterfeest met DJ Marlon midden op het marktplein Untere Pforte',
    titleDe: 'Open-Air Silvesterparty 2026 im Winterberger Winterdorf',
    titleNl: 'Open-Air Oudejaarsfeest 2026 in Winterberger Winterdorf',
    dateDe: 'Donnerstag, 31. Dezember 2026',
    dateNl: 'Donderdag 31 december 2026',
    timeDe: '31. Dezember geöffnet von 11:00 bis 01:00 Uhr nachts • Party mit DJ Marlon am Abend',
    timeNl: '31 december geopend van 11:00 tot 01:00 uur \'s nachts • Feest met DJ Marlon \'s avonds',
    packageTypeDe: 'Open-Air Silvesterparty unter freiem Himmel',
    packageTypeNl: 'Openlucht Sylvesterfeest in de sneeuw',
    partyType: 'openair',
    priceInfoDe: 'Eintritt frei • Feiern mitten im festlich geschmückten Winterdorf',
    priceInfoNl: 'Gratis entree • Feesten op het sfeervol verlichte winterdorp',
    address: 'Marktplatz Untere Pforte, 59955 Winterberg',
    district: 'Winterberg',
    category: 'Open Air & Event',
    subcategory: 'Wintermarkt & Marktplatz-Event',
    features: [
      {
        icon: 'headphones',
        titleDe: 'Silvesterparty mit DJ Marlon',
        titleNl: 'Sylvesterfeest met DJ Marlon',
        descDe: 'DJ Marlon heizt den Besuchern auf dem Marktplatz mit den besten Partyhits, Schlager, Charts und Klassikern ein.',
        descNl: 'DJ Marlon zorgt voor een geweldige sfeer op het dorpsplein met de beste partyhits, meezingers en dance classics.'
      },
      {
        icon: 'wine',
        titleDe: 'Winzer-Glühwein & Hütten-Snacks',
        titleNl: 'Kwaliteitsglühwein & streekgerechten',
        descDe: 'Heißer Winzer-Glühwein, Punsch, heiße Cocktails und herzhafte Sauerländer Köstlichkeiten an urigen Holzhütten.',
        descNl: 'Warme glühwein, feestelijke punch, wintercocktails en hartige Sauerlandse snacks bij de knusse houten chalets.'
      },
      {
        icon: 'clock',
        titleDe: 'Geöffnet bis 01:00 Uhr nachts',
        titleNl: 'Geopend tot 01:00 uur \'s nachts',
        descDe: 'Gemeinsam unter freiem Himmel den Jahreswechsel feiern und bis in die Nacht tanzen und anstoßen.',
        descNl: 'Samen onder de winterse sterrenhemel aftellen naar 2027 en proosten tot diep in de nacht.'
      }
    ],
    highlightsDe: [
      'Der zentrale Treffpunkt an Silvester für Einheimische, Familien, Urlauber und Freunde',
      'Live an den Reglern: Große Silvesterparty mit DJ Marlon am Abend',
      'Geöffnet an Silvester von 11:00 Uhr vormittags bis 01:00 Uhr nachts',
      'Eintritt komplett frei – keine Voranmeldung oder Ticketkauf erforderlich',
      'Urige beheizte Holzchalets, historisches Kinderkarussell und funkelnder Lichterglanz',
      'Mitten im Stadtzentrum von Winterberg – ideal als Startpunkt oder Hauptstation der Silvesternacht'
    ],
    highlightsNl: [
      'De centrale ontmoetingsplek op oudejaarsavond voor inwoners, families en wintersporters',
      'Live op het podium: Spetterend oudejaarsfeest met DJ Marlon \'s avonds',
      'Op 31 december doorlopend geopend van 11:00 uur \'s ochtends tot 01:00 uur \'s nachts',
      'Toegang is volledig gratis – geen reservering of ticket nodig',
      'Knusse verwarmde chalets, historische kinder carrousel en duizenden fonkelende lichtjes',
      'In het hart van het centrum van Winterberg – perfect om samen te proosten op het nieuwe jaar'
    ],
    shortDescriptionDe: 'Silvester feiern unter freiem Himmel im Winterberger Winterdorf: DJ Marlon liefert den besten Partysound auf dem Marktplatz Untere Pforte. Geöffnet bis 01:00 Uhr nachts – Eintritt frei!',
    shortDescriptionNl: 'Oud en Nieuw vieren in de openlucht op het Winterberger Winterdorf: DJ Marlon draait de beste feesthits op het marktplein Untere Pforte. Geopend tot 01:00 uur \'s nachts – gratis toegang!',
    infoTextDe: 'Das Winterberger Winterdorf auf dem Marktplatz an der Unteren Pforte ist das Herzstück des winterlichen Lebens in der Stadt – und am Silvesterabend der beliebteste Treffpunkt überhaupt! Anders als klassische Weihnachtsmärkte bleibt das Winterdorf über die Feiertage und bis ins neue Jahr geöffnet. Am 31. Dezember 2026 öffnen die urigen Holzhütten bereits ab 11:00 Uhr vormittags. Am Abend verwandelt sich der Marktplatz in eine ausgelassene Open-Air-Silvesterparty mit DJ Marlon an den Turntables. Stoßen Sie mit dampfendem Winzerglühwein, Punsch oder prickelndem Sekt unter freiem Himmel auf das neue Jahr an. Der Eintritt ist frei – einfach vorbeikommen und mitfeiern!',
    infoTextNl: 'Het Winterberger Winterdorf op het marktplein Untere Pforte is het kloppend hart van de winter in de stad. Op 31 december 2026 zijn de sfeervolle houten kraampjes al vanaf 11:00 uur geopend. \'s Avonds transformeert het plein in een bruisend openlucht Sylvesterfeest met DJ Marlon achter de draaitafels. Tel gezamenlijk af naar 2027 met een dampende glühwein of een feestelijk glas prosecco onder de sterren. Toegang is gratis!',
    image: '/silvester-winterdorf-openair.jpg',
    flyerImage: '/silvester-winterdorf-dj-marlon-2026.png',
    badgeDe: 'Open-Air & Eintritt frei',
    badgeNl: 'Open-Air & Gratis entree',
    contactEmail: 'info@winterberger-winterdorf.de',
    website: 'https://www.winterberger-winterdorf.de/programm',
    bookingUrl: 'https://www.winterberger-winterdorf.de/programm',
    capacityDe: 'Freier Zugang für alle Besucher • Keine Reservierung nötig',
    capacityNl: 'Vrije toegang voor iedereen • Geen reservering nodig'
  },

  // 5. Die Tenne Winterberg
  {
    id: 'silvester-die-tenne-winterberg-2026',
    businessId: 'tenne-winterberg',
    businessName: 'Die Tenne Winterberg',
    subtitleDe: 'Der legendäre Club-Jahreswechsel im Kult-Tanzlokal auf 3 Floors mit 6 Theken',
    subtitleNl: 'De legendarische clubnacht met Oud en Nieuw op 3 dansvloeren met 6 bars',
    titleDe: 'SILVESTER in der Tenne 2026 – Die Kult-Clubnacht',
    titleNl: 'SILVESTER in Die Tenne 2026 – De ultieme clubnacht',
    dateDe: 'Donnerstag, 31. Dezember 2026',
    dateNl: 'Donderdag 31 december 2026',
    timeDe: 'Einlass ab 21:00 Uhr • Party bis 06:00 Uhr morgens',
    timeNl: 'Deuren open vanaf 21:00 uur • Feest tot 06:00 uur \'s ochtends',
    packageTypeDe: 'Club-Silvesterparty & Nightlife',
    packageTypeNl: 'Club-Sylvesterfeest & Nightlife',
    partyType: 'club',
    priceInfoDe: '15,00 € Online-Vorverkaufsticket auf tenne-winterberg.de',
    priceInfoNl: '€ 15,00 online voorverkoopticket via tenne-winterberg.de',
    address: 'Marktstraße 12, 59955 Winterberg',
    district: 'Winterberg',
    category: 'Club & Nightlife',
    subcategory: 'Diskothek & Tanzlokal',
    features: [
      {
        icon: 'headphones',
        titleDe: '3 Floors & Top-DJs',
        titleNl: '3 dansvloeren & top-dj\'s',
        descDe: 'Main Floor mit Charts, House & Partyhits, Cocktailbar mit feinster elektronischer Musik und uriger Rockkeller.',
        descNl: 'Main floor met charts, house & partyhits, cocktailbar met dancebeats en een authentieke rockkelder.'
      },
      {
        icon: 'wine',
        titleDe: '6 Barzonen & Theken',
        titleNl: '6 barzones & snelle service',
        descDe: 'Keine langen Wartezeiten dank 6 großer Thekenbereiche, Cocktailbar und riesiger Getränkeauswahl.',
        descNl: 'Snelle bediening dankzij 6 bars, een sfeervolle cocktailbar en een breed assortiment drankjes.'
      },
      {
        icon: 'ticket',
        titleDe: 'Digitales Vorverkaufsticket',
        titleNl: 'Digitaal voorverkoopticket',
        descDe: 'Garantiert schneller und unkomplizierter Einlass mit dem digitalen Vorverkaufsticket über den Tenne-Ticketshop.',
        descNl: 'Gegarandeerde en vlotte toegang met het digitale e-ticket via de officiële Tenne ticketshop.'
      }
    ],
    highlightsDe: [
      'Winterbergs bekannteste Party- und Clublegende seit Generationen in der Marktstraße',
      'Feiern auf 3 verschiedenen Ebenen und Floors für jeden Musikgeschmack',
      'Top-DJs liefern die besten Beats zum Jahreswechsel bis in die frühen Morgenstunden',
      'Online-Vorverkauf für 15,00 € direkt über den offiziellen Ticketshop von tenne-winterberg.de',
      '6 Theken und Barzonen, große Cocktailauswahl und grandiose Partystimmung im Herzen der City'
    ],
    highlightsNl: [
      'De bekendste en meest legendarische uitgaansgelegenheid van Winterberg in de Marktstraße',
      'Feesten op 3 verschillende dansvloeren met uiteenlopende muziekstijlen',
      'Top-dj\'s draaien de heetste tracks voor de jaarwisseling tot het ochtendgloren',
      'Online voorverkoop voor € 15,00 via de officiële ticketshop van tenne-winterberg.de',
      '6 grote barzones, uitstekende cocktails en onvergetelijke clubsfeer'
    ],
    shortDescriptionDe: 'SILVESTER in der Tenne 2026: Winterbergs Kult-Club feiert den Jahreswechsel auf 3 Floors und an 6 Theken mit Top-DJs. Tickets im Vorverkauf für 15,00 € auf tenne-winterberg.de sichern!',
    shortDescriptionNl: 'SILVESTER in Die Tenne 2026: Winterbergs beroemdste club viert de jaarwisseling op 3 floors met 6 bars en top-dj\'s. Koop je tickets in de voorverkoop voor € 15,00 op tenne-winterberg.de!',
    infoTextDe: 'Die Tenne Winterberg in der historischen Marktstraße ist der absolute Hotspot für alle, die das neue Jahr auf der Tanzfläche begrüßen wollen! Zum Jahreswechsel 2026 / 2027 lädt die Tenne zur großen Kult-Silvesterparty ein. Auf drei Floors (Main Floor mit Charts, EDM und Partyhits, stilvolle Cocktailbar sowie der legendäre Rockkeller) sorgen hochkarätige DJs für ausgelassene Clubstimmung. An sechs Theken werden frisch gezapftes Bier, erlesene Cocktails und Shots serviert. Sichern Sie sich Ihr Ticket im Vorverkauf online für 15,00 € direkt über die Eventseite der Tenne, um Wartezeiten am Einlass zu vermeiden.',
    infoTextNl: 'Die Tenne Winterberg in de gezellige Marktstraße is dé plek voor clubbers en feestgangers om het nieuwe jaar in te luiden! Tijdens Oud en Nieuw 2026/2027 organiseert Die Tenne haar legendarische Sylvester-clubnacht. Dans op 3 verschillende zalen op de beste charts, house, dance classics en rock. Zes barzones zorgen voor koude biertjes en heerlijke cocktails. Koop je voorverkoopticket online voor € 15,00 via tenne-winterberg.de.',
    image: '/silvester-party-tenne.jpg',
    badgeDe: 'Club Silvesterparty 15 €',
    badgeNl: 'Club Sylvesterfeest € 15',
    contactEmail: 'info@tenne-winterberg.de',
    contactPhone: '02981 92870',
    website: 'https://tenne-winterberg.de/veranstaltung/silvester-in-der-tenne-2/',
    bookingUrl: 'https://tenne-winterberg.de/veranstaltung/silvester-in-der-tenne-2/',
    capacityDe: 'Vorverkaufsticket dringend empfohlen • Einlass ab 18 Jahren',
    capacityNl: 'Voorverkoopticket sterk aanbevolen • Toegang vanaf 18 jaar'
  },

  // 6. Hotel Winterberg Resort
  {
    id: 'silvester-hotel-winterberg-resort-2026',
    businessId: 'hotel-winterberg-resort',
    businessName: 'Hotel Winterberg Resort',
    subtitleDe: 'Silvesterprogramm mit festlichen Tafeln, DJ, Tanz & Stockbrotbacken für Familien',
    subtitleNl: 'Sylvesterprogramma met feestelijk diner, dj, dans & kampvuur voor families',
    titleDe: 'Silvester- & Neujahrsprogramm im Winterberg Resort',
    titleNl: 'Oudejaars- & Nieuwjaarsprogramma in Winterberg Resort',
    dateDe: 'Donnerstag, 31. Dezember 2026 bis Freitag, 1. Januar 2027',
    dateNl: 'Donderdag 31 december 2026 t/m vrijdag 1 januari 2027',
    timeDe: 'Festprogramm über die Feiertage • Silvesterabend ab 18:00 Uhr mit DJ & Tanz',
    timeNl: 'Feestprogramma over de feestdagen • Oudejaarsavond vanaf 18:00 uur met dj en dans',
    packageTypeDe: 'Silvesterprogramm, DJ & Familien-Highlights',
    packageTypeNl: 'Sylvesterprogramma, dj & familie-activiteiten',
    partyType: 'hotel',
    priceInfoDe: 'Silvesterprogramm & Arrangements für Urlauber und Gäste auf Anfrage',
    priceInfoNl: 'Sylvesterprogramma en verblijfsarrangementen op aanvraag',
    address: 'In der Renau 1, 59955 Winterberg',
    district: 'Winterberg',
    category: 'Hotels & Wellness',
    subcategory: 'Resort & Familienhotel',
    features: [
      {
        icon: 'utensils',
        titleDe: 'Festlich gedeckte Tafeln',
        titleNl: 'Feestelijk gedekte tafels',
        descDe: 'Stilvolles Ambiente mit Kerzenschein, Tannengrün und feierlichem Mehrgang-Essen zum Jahreswechsel.',
        descNl: 'Sfeervolle ambiance met kaarslicht, dennengroen en een feestelijk meergangendiner.'
      },
      {
        icon: 'headphones',
        titleDe: 'DJ & Tanz ins neue Jahr',
        titleNl: 'Live-dj & dans het nieuwe jaar in',
        descDe: 'Mitreißende Musik, Tanzfläche und gemeinsames Mitternachtsanstoßen auf das Jahr 2027.',
        descNl: 'Gezellige dansmuziek met een dj en om middernacht gezamenlijk proosten op 2027.'
      },
      {
        icon: 'flame',
        titleDe: 'Stockbrotbacken am Lagerfeuer',
        titleNl: 'Broodjes bakken bij het kampvuur',
        descDe: 'Tolles Familien-Highlight: Kinderbasteln, Plätzchen verzieren und Stockbrotbacken am offenen Feuer.',
        descNl: 'Geweldig voor gezinnen: knutselen voor kids, koekjes versieren en broodjes bakken bij het kampvuur.'
      }
    ],
    highlightsDe: [
      'Familienfreundliches Silvester- und Neujahrsprogramm inmitten der Winterberger Bergwelt',
      'Festlich dekorierte Tafeln mit Kerzen und winterlicher Dekoration zum Silvesterabend',
      'Musik, DJ und Tanz bis spät in die Silvesternacht mit feierlichem Mitternachtsanstoßen',
      'Winter-Highlights am Tag: Nachmittagskaffee mit hausgemachtem Kuchen, Glühwein und feiner heißer Schokolade',
      'Kinderprogramm: Basteln, Plätzchen verzieren und Stockbrot am knisternden Lagerfeuer',
      'Traumhafte Lage direkt am Wander- und Wintersportgebiet in der Nähe des Kahlen Astens'
    ],
    highlightsNl: [
      'Gezinsvriendelijk eindejaarsprogramma midden in de prachtige Sauerlandse natuur',
      'Sfeervol versierde tafels met kaarsen en feestelijk dennengroen op oudejaarsavond',
      'Muziek, dj en dans tot in de kleine uurtjes met gezamenlijk proosten om middernacht',
      'Winterse verwennerij overdag: koffie met vers huisgemaakt gebak, glühwein en warme chocolademelk',
      'Kinderactiviteiten: knutselen, koekjes versieren en marshmallows/broodjes bakken bij het vuur',
      'Prachtige ligging direct aan wandelpaden en skiliften nabij de Kahler Asten'
    ],
    shortDescriptionDe: 'Silvester im Hotel Winterberg Resort: Festliche Tafeln, DJ und Tanz ins neue Jahr, Mitternachtsanstoßen, Lagerfeuer mit Stockbrot für Kids sowie Glühwein und hausgemachter Kuchen.',
    shortDescriptionNl: 'Vier Oud en Nieuw in Hotel Winterberg Resort: feestelijk diner, dj en dans, proosten om 00:00 uur, kampvuur voor de kinderen, glühwein en huisgemaakt gebak.',
    infoTextDe: 'Begrüßen Sie das Jahr 2027 im Hotel Winterberg Resort! Eingebettet in die idyllische Berglandschaft von Winterberg bietet das Resort ein abwechslungsreiches Festtagsprogramm für die ganze Familie. Über die Silvestertage genießen Gäste nachmittags duftenden Kaffee mit hausgemachtem Kuchen, wärmenden Glühwein, Kinderpunsch und heiße Schokolade. Für die kleinen Gäste gibt es kreative Bastelstunden und gemütliches Stockbrotbacken am Lagerfeuer. Am 31. Dezember verwandelt sich das Restaurant in einen festlichen Festsaal mit stilvoll gedeckten Tischen, Musik, DJ und Tanz bis zum gemeinsamen Mitternachtsanstoßen.',
    infoTextNl: 'Luid het nieuwe jaar feestelijk in bij Hotel Winterberg Resort! Gelegen in de rustgevende natuur biedt het hotel een gevarieerd feestprogramma voor jong en oud. Geniet overdag van koffie met vers gebak, geurige glühwein en marshmallows bij het knisperende kampvuur. Op oudejaarsavond wacht een feestelijk diner, gevolgd door een gezellige feestavond met dj, dansvloer en toosten om middernacht.',
    image: '/silvester-resort-winterberg.jpg',
    badgeDe: 'Familie & Hüttenzauber',
    badgeNl: 'Familie & Winterfeest',
    contactEmail: 'info@hotelwinterberg-resort.nl',
    contactPhone: '02981 92450',
    website: 'https://hotelwinterberg-resort.nl/de/weihnachten-silvester-programm-winterberg/',
    bookingUrl: 'https://hotelwinterberg-resort.nl/de/weihnachten-silvester-programm-winterberg/',
    capacityDe: 'Silvesterprogramm für Hotel- und Festgäste • Frühzeitige Buchung empfohlen',
    capacityNl: 'Programma voor hotel- en feestgasten • Vroegtijdig boeken aangeraden'
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
