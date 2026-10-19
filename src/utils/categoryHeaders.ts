export interface CategoryHeaderData {
  image: string;
  imageAltDe: string;
  imageAltNl: string;
  credit?: string;
  badgeDe?: string;
  badgeNl?: string;
  isAiGenerated?: boolean;
  titleDe?: string;
  titleNl?: string;
  subtitleDe: string;
  subtitleNl: string;
  objectPosition?: string;
}

export const CATEGORY_HEADERS: Record<string, CategoryHeaderData> = {
  // ==========================================
  // Hotels und Unterkünfte
  // ==========================================
  'Hotels und Unterkünfte': {
    image: '/hotels-unterkuenfte-winterberg-header.jpg',
    imageAltDe: 'Hotels und Unterkünfte in Winterberg: Gemütliches Berghotel mit Balkonen und Blick auf die Sauerländer Bergwelt',
    imageAltNl: 'Hotels en accommodaties in Winterberg: Gezellig berghotel met balkons en uitzicht op de bergen van het Sauerland',
    credit: 'Foto: William Dmytrow / Unsplash',
    isAiGenerated: false,
    titleDe: 'Hotels & Unterkünfte in Winterberg',
    titleNl: 'Hotels & Accommodaties in Winterberg',
    subtitleDe: 'Finden Sie Ihre perfekte Unterkunft im heilklimatischen Urlaubsort Winterberg: Von erstklassigen Wellnesshotels und familienfreundlichen Ferienwohnungen bis hin zu gemütlichen Chalets und idyllischen Campingplätzen.',
    subtitleNl: 'Vind uw ideale verblijf in vakantieplaats Winterberg: van luxe wellnesshotels en gezinsvriendelijke vakantiewoningen tot knusse chalets en idyllische campings.',
    objectPosition: 'center center'
  },

  'Hotels': {
    image: '/hotels-winterberg-header.jpg',
    imageAltDe: 'Hotels in Winterberg: Stilvoll eingerichtetes Hotelzimmer mit gemütlichem Boxspringbett und warmer Beleuchtung',
    imageAltNl: 'Hotels in Winterberg: Stijlvolle hotelkamer met comfortabel bed en sfeervolle verlichting',
    credit: 'Foto: reisetopia / Unsplash',
    isAiGenerated: false,
    titleDe: 'Hotels in Winterberg',
    titleNl: 'Hotels in Winterberg',
    subtitleDe: 'Erstklassige Hotels für Ihren Urlaub im Sauerland: Wellnesshotels, Aktiv- und Sporthotels, gemütliche Landhotels und zentrumsnahe Stadthotels in Winterberg.',
    subtitleNl: 'Eersteklas hotels voor uw vakantie in het Sauerland: wellnesshotels, sporthotels, gezellige landhotels en hotels in het centrum van Winterberg.',
    objectPosition: 'center center'
  },

  'Ferienwohnungen': {
    image: '/ferienwohnungen-winterberg-header.jpg',
    imageAltDe: 'Ferienwohnungen in Winterberg: Moderne, lichtdurchflutete Ferienwohnung mit Essbereich, Küche und gemütlichem Wohnzimmer',
    imageAltNl: 'Vakantiewoningen in Winterberg: Modern, licht appartement met eethoek, keuken en gezellige woonkamer',
    credit: 'Foto: deborah cortelazzi / Unsplash',
    isAiGenerated: false,
    titleDe: 'Ferienwohnungen in Winterberg',
    titleNl: 'Vakantiewoningen in Winterberg',
    subtitleDe: 'Gemütliche und modern ausgestattete Ferienwohnungen und Apartments für Paare, Familien und Gruppen – ideal gelegen für Wanderungen und Skitage.',
    subtitleNl: 'Gezellige en modern ingerichte vakantiewoningen en appartementen voor stellen, gezinnen en groepen – ideaal gelegen voor wandel- en skivakanties.',
    objectPosition: 'center center'
  },

  'Ferienhäuser': {
    image: '/ferienhaeuser-winterberg-header.jpg',
    imageAltDe: 'Ferienhäuser & Chalets in Winterberg: Romantisches Holzchalet am Berghang bei Sonnenuntergang inmitten der Sauerländer Natur',
    imageAltNl: 'Vakantiehuizen & Chalets in Winterberg: Romantisch houten chalet op een berghelling bij zonsondergang',
    credit: 'Foto: Lili Kovac / Unsplash',
    isAiGenerated: false,
    titleDe: 'Ferienhäuser in Winterberg',
    titleNl: 'Vakantiehuizen in Winterberg',
    subtitleDe: 'Exklusive Ferienhäuser, urige Blockhütten und moderne Chalets für ungestörte Urlaubstage mit Familie und Freunden in den Winterberger Bergen.',
    subtitleNl: 'Exclusieve vakantiehuizen, knusse blokhutten en moderne chalets voor een onbezorgde vakantie met familie en vrienden in de bergen van Winterberg.',
    objectPosition: 'center center'
  },

  'Ferienparks': {
    image: '/ferienparks-winterberg-header.jpg',
    imageAltDe: 'Ferienparks & Feriendörfer in Winterberg: Idyllische Holzchalets und Ferienhäuser am sonnigen Hang inmitten grüner Sauerländer Wälder',
    imageAltNl: 'Vakantieparken & Bungalowparken in Winterberg: Idyllische houten chalets en vakantiehuizen op een zonnige berghelling',
    credit: 'Foto: Thierry Lemaitre / Unsplash',
    isAiGenerated: false,
    titleDe: 'Ferienparks in Winterberg',
    titleNl: 'Vakantieparken in Winterberg',
    subtitleDe: 'Familienfreundliche Ferienparks und Feriendörfer mit umfassenden Freizeitangeboten, Spielplätzen, Schwimmbädern und komfortablen Unterkünften.',
    subtitleNl: 'Kindvriendelijke vakantieparken en bungalowparken met veel faciliteiten, speeltuinen, zwembaden en comfortabele accommodaties.',
    objectPosition: 'center 45%'
  },

  'Campingplätze': {
    image: '/campingplaetze-winterberg-header.jpg',
    imageAltDe: 'Campingplätze & Stellplätze in Winterberg: Wohnwagen mit Vorzelt auf gepflegtem Campingplatz am Wasser umgeben von Sauerländer Hügeln',
    imageAltNl: 'Campings & Camperplaatsen in Winterberg: Caravan met voortent op een verzorgde camping aan het water omgeven door heuvels',
    credit: 'Foto: Brahm Meyer / Unsplash',
    isAiGenerated: false,
    titleDe: 'Campingplätze in Winterberg',
    titleNl: 'Campings in Winterberg',
    subtitleDe: 'Natururlaub pur: Idyllisch gelegene Campingplätze und moderne Wohnmobilstellplätze für Sommer- und Wintercamping im Hochsauerland.',
    subtitleNl: 'Puur natuur: idyllisch gelegen campings en moderne camperplaatsen voor zowel zomer- als winterkamperen in het Sauerland.',
    objectPosition: 'center center'
  },

  // ==========================================
  // Handwerk & Meisterbetriebe
  // ==========================================
  'Handwerk': {
    image: '/handwerk-winterberg-header.jpg',
    imageAltDe: 'Handwerk & Meisterbetriebe in Winterberg: Traditionelle Meisterwerkstatt mit Handwerkzeugen, Hobeln, Sägen und Stechbeiteln',
    imageAltNl: 'Ambacht in Winterberg: Traditionele meesterwerkplaats met handgereedschap, schaven en zagen',
    credit: 'Foto: Barn Images / Unsplash',
    isAiGenerated: false,
    titleDe: 'Handwerk in Winterberg',
    titleNl: 'Ambacht & Vakmensen in Winterberg',
    subtitleDe: 'Zuverlässige Meisterbetriebe, Werkstätten und Fachhandwerker in Winterberg und allen 14 Ortsteilen – von Dachdeckern, Elektrikern und Schreinereien bis hin zu Bauunternehmen und KFZ-Profis.',
    subtitleNl: 'Betrouwbare vakmensen, ambachtelijke werkplaatsen en vakkundige bedrijven in Winterberg en alle 14 dorpen – van dakdekkers en elektriciens tot timmerlieden en bouwbedrijven.',
    objectPosition: 'center 40%'
  },

  // 1. Elektriker
  'Elektriker': {
    image: '/elektriker-winterberg-header.jpg',
    imageAltDe: 'Elektriker & Elektrotechnik in Winterberg: Professioneller Verteilerkasten mit Leitungsschutzschaltern und Verkabelung',
    imageAltNl: 'Elektriciens in Winterberg: Professionele verdeelkast met installatieautomaten en bedrading',
    credit: 'Foto: Markus Spiske / Unsplash',
    isAiGenerated: false,
    titleDe: 'Elektriker in Winterberg',
    titleNl: 'Elektriciens in Winterberg',
    subtitleDe: 'Zertifizierte Elektro-Fachbetriebe für Hausinstallation, Smart Home, Photovoltaik, E-Mobilität und Störungsdienste in Winterberg und Umgebung.',
    subtitleNl: 'Gecertificeerde elektrotechnische bedrijven voor huisinstallaties, domotica, zonnepanelen, laadpalen en storingsdiensten in Winterberg.',
    objectPosition: 'center center'
  },

  // 2. Heizungstechnik
  'Heizungstechnik': {
    image: '/heizungstechnik-winterberg-header.jpg',
    imageAltDe: 'Heizungstechnik & Sanitär in Winterberg: Moderner Heizungskeller mit Rohrsystemen, Pumpen und Manometern',
    imageAltNl: 'Verwarmingstechniek in Winterberg: Moderne stookruimte met leidingen, pompen en manometers',
    credit: 'Foto: Immo Wegmann / Unsplash',
    isAiGenerated: false,
    titleDe: 'Heizungstechnik in Winterberg',
    titleNl: 'Verwarmingstechniek in Winterberg',
    subtitleDe: 'Fachbetriebe für moderne Heizsysteme, Wärmepumpen, regenerative Energien, Sanitärinstallationen und Notdienste im Sauerland.',
    subtitleNl: 'Vakbedrijven voor moderne verwarmingssystemen, warmtepompen, hernieuwbare energie, sanitair en storingsdiensten in het Sauerland.',
    objectPosition: 'center center'
  },

  // 3. Dachdecker
  'Dachdecker': {
    image: '/dachdecker-winterberg-header.jpg',
    imageAltDe: 'Dachdecker in Winterberg: Traditionelle Sauerländer Schiefereindeckung im Detail',
    imageAltNl: 'Dakdekkers in Winterberg: Traditionele leisteenbedekking uit het Sauerland',
    credit: 'Foto: Michael C. Rygel / Wikimedia Commons',
    isAiGenerated: false,
    titleDe: 'Dachdecker in Winterberg',
    titleNl: 'Dakdekkers in Winterberg',
    subtitleDe: 'Meisterbetriebe für Schiefereindeckung, Flachdächer, Dachdämmung, Klempnerarbeiten und Sturmschaden-Reparaturen in Winterberg.',
    subtitleNl: 'Meesterbedrijven voor leisteen, platte daken, dakisolatie, zinkwerk en stormschadeherstel in Winterberg.',
    objectPosition: 'center center'
  },

  // 4. Schreinereien
  'Schreinereien': {
    image: '/schreinereien-winterberg-header.jpg',
    imageAltDe: 'Schreinereien & Tischlereien in Winterberg: Hobelbank mit Holzhobel, Ziehmesser und frischen Holzspänen',
    imageAltNl: 'Timmerlieden & Meubelmakers in Winterberg: Schaafbank met houtschaaf, haalmes en verse houtsnippers',
    credit: 'Foto: Val Vesa / Unsplash',
    isAiGenerated: false,
    titleDe: 'Schreinereien in Winterberg',
    titleNl: 'Timmerlieden & Meubelmakers in Winterberg',
    subtitleDe: 'Individueller Möbelbau, Maßanfertigungen, Fenster, Türen und hochwertiger Innenausbau aus Meisterhand für Winterberg und das Sauerland.',
    subtitleNl: 'Maatwerk meubelen, ramen, deuren en hoogwaardige interieurbouw van vakkundige meubelmakers in Winterberg en het Sauerland.',
    objectPosition: 'center center'
  },

  // 5. Maler & Lackierer
  'Maler & Lackierer': {
    image: '/maler-winterberg-header.jpg',
    imageAltDe: 'Maler & Lackierer in Winterberg: Farben, Farbfächer und hochwertige Lackierwerkzeuge auf Ausstellungsregal',
    imageAltNl: 'Schilders in Winterberg: Verfkleuren, kleurwaaiers en hoogwaardig schildersgereedschap',
    credit: 'Foto: Declan Sun / Unsplash',
    isAiGenerated: false,
    titleDe: 'Maler & Lackierer in Winterberg',
    titleNl: 'Schilders in Winterberg',
    subtitleDe: 'Kreative Wandgestaltung, Fassadenanstriche, Tapezierarbeiten, Lackierungen und Wärmedämmung von qualifizierten Malermeistern.',
    subtitleNl: 'Creatieve wandafwerking, gevelschilderwerk, behangwerk, lakwerk en isolatie door erkende schildersbedrijven.',
    objectPosition: 'center center'
  },

  // 6. Bauunternehmen
  'Bauunternehmen': {
    image: '/bauunternehmen-winterberg-header.jpg',
    imageAltDe: 'Bauunternehmen in Winterberg: Baustelle mit schwerem Bagger und Erdarbeiten im Hoch- und Tiefbau',
    imageAltNl: 'Bouwbedrijven in Winterberg: Bouwplaats met graafmachine en grondverzet',
    credit: 'Foto: Jamar Penny / Unsplash',
    isAiGenerated: false,
    titleDe: 'Bauunternehmen in Winterberg',
    titleNl: 'Bouwbedrijven in Winterberg',
    subtitleDe: 'Kompetente Partner für Hoch- und Tiefbau, Neubau, Umbau, Sanierung und Erdarbeiten in Winterberg und der Region Sauerland.',
    subtitleNl: 'Betrouwbare partners voor woning- en utiliteitsbouw, grondverzet, nieuwbouw en renovatie in Winterberg en de regio Sauerland.',
    objectPosition: 'center center'
  },

  // 7. Gartenbauer (Garten- und Landschaftsbau)
  'Gartenbauer': {
    image: '/gartenbauer-winterberg-header.jpg',
    imageAltDe: 'Garten- und Landschaftsbau in Winterberg: Naturstein-Terrasse mit gepflegten Hecken und Pflanzungen',
    imageAltNl: 'Tuin- en landschapsarchitectuur in Winterberg: Terras van natuursteen met verzorgde hagen en beplanting',
    credit: 'Foto: Sergej (@skstrannik) / Unsplash',
    isAiGenerated: false,
    titleDe: 'Garten- & Landschaftsbau in Winterberg',
    titleNl: 'Tuin- & Landschapsarchitectuur in Winterberg',
    subtitleDe: 'Professionelle Gartengestaltung, Pflasterarbeiten, Terrassenbau, Bepflanzung, Baumpflege und ganzjährige Gartenpflege in Winterberg.',
    subtitleNl: 'Professioneel tuinontwerp, bestrating, terrasaanleg, beplanting, boomverzorging en tuinonderhoud in Winterberg.',
    objectPosition: 'center center'
  },

  // 8. Friseur
  'Friseur': {
    image: '/friseur-winterberg-header.jpg',
    imageAltDe: 'Friseure & Salons in Winterberg: Stilvoller Salon mit Friseursesseln, großen Spiegeln und warmem Ambiente',
    imageAltNl: 'Kappers in Winterberg: Stijlvolle salon met kappersstoelen, grote spiegels en warme sfeer',
    credit: 'Foto: Nathon Oski / Unsplash',
    isAiGenerated: false,
    titleDe: 'Friseure in Winterberg',
    titleNl: 'Kapsalons in Winterberg',
    subtitleDe: 'Top-Hairstyling, moderne Schnitte, Farb- und Strähnentechniken sowie Brautstylings in den Friseursalons von Winterberg.',
    subtitleNl: 'Top-hairstyling, moderne kapsels, kleurtechnieken en bruidskapsels bij de beste kapsalons in Winterberg.',
    objectPosition: 'center center'
  },

  // 9. Bäckerei
  'Bäckerei': {
    image: '/baeckerei-winterberg-header.jpg',
    imageAltDe: 'Bäckereien & Konditoreien in Winterberg: Traditionell gebackenes Sauerteigbrot mit Getreideähren auf dunklem Holz',
    imageAltNl: 'Bakkerijen in Winterberg: Traditioneel zuurdesembrood met graanhalmen op donker hout',
    credit: 'Foto: Wesual Click / Unsplash',
    isAiGenerated: false,
    titleDe: 'Bäckereien in Winterberg',
    titleNl: 'Bakkerijen in Winterberg',
    subtitleDe: 'Traditionelle Handwerksbäcker und Konditoreien mit täglich frischen Broten, Brötchen, Kuchen und Sauerländer Spezialitäten.',
    subtitleNl: 'Ambachtelijke bakkerijen en banketbakkers met dagelijks vers brood, broodjes, taarten en regionale lekkernijen.',
    objectPosition: 'center center'
  },

  // 10. Fleischerei
  'Fleischerei': {
    image: '/fleischerei-winterberg-header.jpg',
    imageAltDe: 'Fleischereien & Metzgereien in Winterberg: Feine Fleisch- und Wurstspezialitäten mit Gewürzen auf rustikalem Hackblock',
    imageAltNl: 'Slagerijen in Winterberg: Fijne vlees- en worstspecialiteiten met kruiden op ambachtelijk hakblok',
    credit: 'Foto: Eiliv Aceron / Unsplash',
    isAiGenerated: false,
    titleDe: 'Fleischereien in Winterberg',
    titleNl: 'Slagerijen in Winterberg',
    subtitleDe: 'Meister-Fleischereien mit regionalem Qualitätsfleisch, hausgemachten Schinken- und Wurstspezialitäten und Partyservice.',
    subtitleNl: 'Meesterslagers met regionaal kwaliteitsvlees, ambachtelijke ham- en worstspecialiteiten en cateringservice.',
    objectPosition: 'center center'
  },

  // 11. Bäderstudios
  'Bäderstudios': {
    image: '/baederstudios-winterberg-header.jpg',
    imageAltDe: 'Bäderstudios & Baddesign in Winterberg: Elegantes modernes Badezimmer mit freistehender Badewanne und Naturstein',
    imageAltNl: 'Badkamerstudio\'s in Winterberg: Luxe moderne badkamer met vrijstaand ligbad en natuursteen',
    credit: 'Foto: Ela De Pure / Unsplash',
    isAiGenerated: false,
    titleDe: 'Bäderstudios in Winterberg',
    titleNl: 'Badkamerstudio\'s in Winterberg',
    subtitleDe: 'Inspirierende Badausstellungen, individuelle Badplanung und schlüsselfertige Komplettbadsanierung aus einer Hand.',
    subtitleNl: 'Inspirerende badkamershowrooms, persoonlijk badkamerontwerp en complete badkamerrenovaties in Winterberg.',
    objectPosition: 'center 60%'
  },

  // 12. Baumschulen
  'Baumschulen': {
    image: '/baumschulen-winterberg-header.jpg',
    imageAltDe: 'Baumschulen & Pflanzenzucht in Winterberg: Weitläufige Freiland-Baumschule mit gesunden Formgehölzen und Nadelbäumen',
    imageAltNl: 'Boomkwekerijen in Winterberg: Uitgestrekte boomkwekerij met gezonde bomen, struiken en coniferen',
    credit: 'Foto: Chrisdlink / Wikimedia Commons',
    isAiGenerated: false,
    titleDe: 'Baumschulen in Winterberg',
    titleNl: 'Boomkwekerijen in Winterberg',
    subtitleDe: 'Regionale Pflanzen, winterharte Gehölze, Heckenpflanzen, Formbäume und fachkundige Beratung für Ihren Garten im Sauerland.',
    subtitleNl: 'Regionale planten, winterharde bomen, haagplanten en deskundig groenadvies voor uw tuin in het Sauerland.',
    objectPosition: 'center 40%'
  },

  // 13. Wäschereien
  'Wäschereien': {
    image: '/waeschereien-winterberg-header.jpg',
    imageAltDe: 'Wäschereien & Textilpflege in Winterberg: Moderne Großwäscherei mit gewerblichen Waschmaschinen',
    imageAltNl: 'Wasserijen in Winterberg: Moderne industriële wasserij met professionele wasmachines',
    credit: 'Foto: Marshall Williams / Unsplash',
    isAiGenerated: false,
    titleDe: 'Wäschereien in Winterberg',
    titleNl: 'Wasserijen & Textielverzorging in Winterberg',
    subtitleDe: 'Professionelle Textilreinigung, Hotel- und Gastronomiewäsche, Mietwäsche-Service und schonende Pflege für Privat und Gewerbe.',
    subtitleNl: 'Professionele textielreiniging, hotel- en horecalinnen, wasservice en zorgvuldig onderhoud voor bedrijven en particulieren.',
    objectPosition: 'center center'
  },

  // 14. Druckereien
  'Druckereien': {
    image: '/druckereien-winterberg-header.jpg',
    imageAltDe: 'Druckereien in Winterberg: Moderne Offset-Druckmaschine mit laufender Hochgeschwindigkeits-Druckproduktion',
    imageAltNl: 'Drukkerijen in Winterberg: Moderne offsetdrukpers in volle productie',
    credit: 'Foto: Bank Phrom / Unsplash',
    isAiGenerated: false,
    titleDe: 'Druckereien in Winterberg',
    titleNl: 'Drukkerijen in Winterberg',
    subtitleDe: 'Hochwertige Druckerzeugnisse, Werbemittel, Geschäftsausstattungen, Flyer, Broschüren und Großformatdruck in Winterberg.',
    subtitleNl: 'Kwalitatief drukwerk, reclame-uitingen, huisstijlen, flyers, brochures en grootformaat printen in Winterberg.',
    objectPosition: 'center 45%'
  },

  // 15. Maschinenbau
  'Maschinenbau': {
    image: '/maschinenbau-winterberg-header.jpg',
    imageAltDe: 'Maschinenbau & Fertigungstechnik in Winterberg: Präzise CNC-Zahnradfräsung und Getriebekomponenten',
    imageAltNl: 'Machinebouw in Winterberg: Nauwkeurige CNC-tandwielfrezen en transmissiecomponenten',
    credit: 'Foto: Dexter Jacobs / Unsplash',
    isAiGenerated: false,
    titleDe: 'Maschinenbau in Winterberg',
    titleNl: 'Machinebouw in Winterberg',
    subtitleDe: 'Präziser Sondermaschinenbau, Fördertechnik, Sägewerkstechnik und industrielle Fertigung mit jahrzehntelanger Sauerländer Ingenieurskunst.',
    subtitleNl: 'Precisie machinebouw, transporttechniek, zagerijtechnologie en industriële productie uit het Sauerland.',
    objectPosition: 'center 40%'
  },

  // ==========================================
  // Einzelhandel & Shopping
  // ==========================================
  'Einzelhandel': {
    image: '/shoppen-in-winterberg-header.jpg',
    imageAltDe: 'Einzelhandel & Shopping in Winterberg: Geschäfte, Boutiquen und Fachhändler im heilklimatischen Sauerland-Zentrum',
    imageAltNl: 'Winkels & Retail in Winterberg: Winkels, boetieks en speciaalzaken in het centrum van Winterberg',
    credit: 'Foto: Winterberg Verzeichnis',
    isAiGenerated: false,
    titleDe: 'Einzelhandel in Winterberg',
    titleNl: 'Winkels & Retail in Winterberg',
    subtitleDe: 'Entdecken Sie die vielfältige Einkaufswelt in Winterberg: Von Modeboutiquen, Supermärkten und regionalen Spezialitäten bis hin zu Sportgeschäften, Schmuck und Geschenkartikeln.',
    subtitleNl: 'Ontdek de veelzijdige winkelwereld in Winterberg: Van modeboetieks, supermarkten en regionale delicatessen tot sportwinkels, juweliers en cadeauartikelen.',
    objectPosition: 'center 35%'
  },

  'Supermarkt': {
    image: '/supermarkt-winterberg-header.jpg',
    imageAltDe: 'Supermärkte in Winterberg: Frische Obst- und Gemüseabteilung im modernen Einkaufsmarkt',
    imageAltNl: 'Supermarkten in Winterberg: Verse groente- en fruitafdeling in de moderne supermarkt',
    credit: 'Foto: nrd / Unsplash',
    isAiGenerated: false,
    titleDe: 'Supermärkte in Winterberg',
    titleNl: 'Supermarkten in Winterberg',
    subtitleDe: 'Große Supermärkte, Discounter und Lebensmittelmärkte für den täglichen Einkauf von Einheimischen und Urlaubern in Winterberg und den Ortsteilen.',
    subtitleNl: 'Grote supermarkten, discounters en levensmiddelenwinkels voor uw dagelijkse boodschappen in Winterberg en de dorpen.',
    objectPosition: 'center center'
  },

  'Bekleidung': {
    image: '/bekleidung-winterberg-header.jpg',
    imageAltDe: 'Bekleidungsgeschäfte & Mode in Winterberg: Stilvolle Modekollektionen, Outdoorbekleidung und Accessoires im Modegeschäft',
    imageAltNl: 'Kledingwinkels & Mode in Winterberg: Stijlvolle kledingcollecties, outdoor kleding en accessoires in de modewinkel',
    credit: 'Foto: Clark Street Mercantile / Unsplash',
    isAiGenerated: false,
    titleDe: 'Bekleidung in Winterberg',
    titleNl: 'Kleding & Mode in Winterberg',
    subtitleDe: 'Moderne Modehäuser, Boutiquen, Trachten-, Winter- und Outdoor-Bekleidung für Damen, Herren und Kinder in der Einkaufsstadt Winterberg.',
    subtitleNl: 'Moderne kledingzaken, boetieks, winter- en outdoorkleding voor dames, heren en kinderen in winkelstad Winterberg.',
    objectPosition: 'center 40%'
  },

  'Drogerien': {
    image: '/drogerien-winterberg-header.jpg',
    imageAltDe: 'Drogerien in Winterberg: Wohlfühl-Pflegeprodukte, Naturkosmetik und Gesundheitsprodukte im Drogeriemarkt',
    imageAltNl: 'Drogisterijen in Winterberg: Verzorgingsproducten, natuurlijke cosmetica en gezondheidsproducten bij de drogist',
    credit: 'Foto: balesstudio / Unsplash',
    isAiGenerated: false,
    titleDe: 'Drogerien in Winterberg',
    titleNl: 'Drogisterijen in Winterberg',
    subtitleDe: 'Umfangreiches Sortiment an Körperpflege, Kosmetik, Bio-Produkten, Babybedarf und Haushaltsartikeln in den Winterberger Drogeriemärkten.',
    subtitleNl: 'Uitgebreid assortiment lichaamsverzorging, cosmetica, biologische voeding, babyartikelen en huishoudproducten in Winterberg.',
    objectPosition: 'center center'
  },

  'Baumärkte': {
    image: '/baumaerkte-winterberg-header.jpg',
    imageAltDe: 'Baumärkte & Heimwerkerbedarf in Winterberg: Werkzeuge, Baumaterialien und Gartenbedarf im Baufachmarkt',
    imageAltNl: 'Bouwmarkten in Winterberg: Gereedschap, bouwmaterialen en tuinartikelen in de bouwmarkt',
    credit: 'Foto: Jelleke Vanooteghem / Unsplash',
    isAiGenerated: false,
    titleDe: 'Baumärkte in Winterberg',
    titleNl: 'Bouwmarkten in Winterberg',
    subtitleDe: 'Alles für Renovierung, Handwerk, Haus und Garten: Werkzeuge, Maschinen, Holz, Eisenwaren und Gartenbaustoffe in Winterberg.',
    subtitleNl: 'Alles voor verbouwen, klussen, huis en tuin: gereedschap, machines, hout, ijzerwaren en tuinmaterialen in Winterberg.',
    objectPosition: 'center center'
  },

  'Blumengeschäfte': {
    image: '/blumengeschaefte-winterberg-header.jpg',
    imageAltDe: 'Blumengeschäfte & Floristik in Winterberg: Farbenfrohe Blumensträuße, Topfpflanzen und florale Dekorationen im Blumenladen',
    imageAltNl: 'Bloemenwinkels in Winterberg: Kleurrijke boeketten, kamerplanten en bloemdecoraties bij de bloemist',
    credit: 'Foto: Alisa Anton / Unsplash',
    isAiGenerated: false,
    titleDe: 'Blumengeschäfte in Winterberg',
    titleNl: 'Bloemisten in Winterberg',
    subtitleDe: 'Kreative Floristik, frische Schnittblumen, kunstvolle Sträuße, Hochzeits- und Trauerfloristik sowie geschmackvolle Wohnaccessoires.',
    subtitleNl: 'Creatief bloemwerk, verse snijbloemen, feestelijke boeketten, bruidswerk en sfeervolle woonaccessoires in Winterberg.',
    objectPosition: 'center 45%'
  },

  'Schuhgeschäfte': {
    image: '/schuhgeschaefte-winterberg-header.jpg',
    imageAltDe: 'Schuhgeschäfte in Winterberg: Modische Schuhe, Wanderschuhe und Winterschuhe im Schuhfachgeschäft',
    imageAltNl: 'Schoenenwinkels in Winterberg: Modieuze schoenen, wandelschoenen en winterschoenen in de schoenenwinkel',
    credit: 'Foto: Mick Haupt / Unsplash',
    isAiGenerated: false,
    titleDe: 'Schuhgeschäfte in Winterberg',
    titleNl: 'Schoenenwinkels in Winterberg',
    subtitleDe: 'Bequeme Schuhe für jeden Anlass: Modische Freizeitschuhe, robuste Wanderstiefel, Winterschuhe und Kinderschuhe mit Fachberatung.',
    subtitleNl: 'Comfortabele schoenen voor elke gelegenheid: modieuze vrijetijdsschoenen, stevige wandelschoenen, winterschoenen en kinderschoenen.',
    objectPosition: 'center center'
  },

  'Buchhandlungen': {
    image: '/buchhandlungen-winterberg-header.jpg',
    imageAltDe: 'Buchhandlungen in Winterberg: Gemütliche Buchhandlung mit Romanen, Bildbänden, Reiseliteratur und Sauerland-Krimis',
    imageAltNl: 'Boekhandels in Winterberg: Gezellige boekhandel met romans, fotoboeken, reisgidsen en streekthrillers',
    credit: 'Foto: Viktoriia Kondratiuk / Unsplash',
    isAiGenerated: false,
    titleDe: 'Buchhandlungen in Winterberg',
    titleNl: 'Boekhandels in Winterberg',
    subtitleDe: 'Aktuelle Bestseller, Reiseliteratur, Sauerland-Bücher, Kinder- und Jugendbücher sowie persönliche Leseempfehlungen vor Ort.',
    subtitleNl: 'Actuele bestsellers, reisgidsen, regionale literatuur, kinderboeken en deskundig advies in Winterbergse boekhandels.',
    objectPosition: 'center 45%'
  },

  'Haushaltswaren & Deko': {
    image: '/haushaltswaren-winterberg-header.jpg',
    imageAltDe: 'Haushaltswaren & Deko in Winterberg: Geschmackvolle Tischkultur, Wohnaccessoires und Küchenhelfer im Fachgeschäft',
    imageAltNl: 'Huishoudartikelen & Decoratie in Winterberg: Sfeervolle woonaccessoires, servies en keukenbenodigdheden',
    credit: 'Foto: Spacejoy / Unsplash',
    isAiGenerated: false,
    titleDe: 'Haushaltswaren & Deko in Winterberg',
    titleNl: 'Woondecoratie & Huishoudartikelen in Winterberg',
    subtitleDe: 'Alles für ein schönes Zuhause: Hochwertiges Geschirr, Küchenzubehör, stilvolle Wohnaccessoires, Kerzen und Geschenkideen.',
    subtitleNl: 'Alles voor een gezellig thuis: hoogwaardig servies, kookgerei, stijlvolle woondecoratie, kaarsen en cadeauartikelen in Winterberg.',
    objectPosition: 'center center'
  },

  'Feinkost & Lebensmittel': {
    image: '/feinkost-winterberg-header.jpg',
    imageAltDe: 'Feinkost & Spezialitäten in Winterberg: Delikatessen, Sauerländer Schinken, erlesene Weine und Gourmet-Produkte',
    imageAltNl: 'Delicatessen in Winterberg: Lokale specialiteiten, hammen, kwaliteitswijnen en gourmetproducten',
    credit: 'Foto: Carla Martinesi / Unsplash',
    isAiGenerated: false,
    titleDe: 'Feinkost & Spezialitäten in Winterberg',
    titleNl: 'Delicatessen & Specialiteiten in Winterberg',
    subtitleDe: 'Erlesene Gaumenfreuden, Sauerländer Wildspezialitäten, Bio-Käse, erlesene Weine, Essige, Öle und Geschenkkörbe für Genießer.',
    subtitleNl: 'Fijne streekproducten, Sauerlandse wildspecialiteiten, boerenkaas, kwaliteitswijnen en geschenkmanden voor fijnproevers.',
    objectPosition: 'center center'
  },

  'Märkte': {
    image: '/maerkte-winterberg-header.jpg',
    imageAltDe: 'Wochenmärkte & Frischemärkte in Winterberg: Frisches Obst, Gemüse und regionale Erzeugnisse direkt vom Erzeuger',
    imageAltNl: 'Markten in Winterberg: Verse groenten, fruit en streekproducten op de gezellige weekmarkt',
    credit: 'Foto: Kyle Nieber / Unsplash',
    isAiGenerated: false,
    titleDe: 'Märkte in Winterberg',
    titleNl: 'Markten in Winterberg',
    subtitleDe: 'Der Winterberger Wochenmarkt und bunte Saisonmärkte: Frische Produkte von regionalen Landwirten, Blumen und traditionelles Marktflair.',
    subtitleNl: 'De gezellige weekmarkt en seizoensmarkten in Winterberg: verse producten van boeren uit de streek, bloemen en lokale sfeer.',
    objectPosition: 'center 45%'
  },

  'Gaststättenbedarf': {
    image: '/gaststaettenbedarf-winterberg-header.jpg',
    imageAltDe: 'Gaststättenbedarf & Großküchenausstattung in Winterberg: Professionelles Geschirr, Gläser und Küchentechnik für Hotellerie und Gastronomie',
    imageAltNl: 'Horeca-benodigdheden in Winterberg: Professioneel servies, glaswerk en keukenapparatuur voor horeca en hotelwezen',
    credit: 'Foto: Pylyp Sukhenko / Unsplash',
    isAiGenerated: false,
    titleDe: 'Gaststättenbedarf in Winterberg',
    titleNl: 'Horeca-benodigdheden in Winterberg',
    subtitleDe: 'Ausrüstung, Großküchentechnik, Gläser, Porzellan, Hygieneartikel und Zubehör für Hotellerie, Skihütten und Restaurants im Hochsauerland.',
    subtitleNl: 'Grootkeukentechniek, porselein, glaswerk, hygiëne en horecabenodigdheden voor hotels, restaurants en skihutten in het Sauerland.',
    objectPosition: 'center center'
  },

  'Baustoffe': {
    image: '/baustoffe-winterberg-header.jpg',
    imageAltDe: 'Baustoffhandel in Winterberg: Baustoff-Fachhandel für Hoch-, Tief- und Ausbau mit moderner Logistik',
    imageAltNl: 'Bouwmaterialen in Winterberg: Bouwstoffengroothandel voor ruwbouw, afbouw en grondverzet',
    credit: 'Foto: Mufid Majnun / Unsplash',
    isAiGenerated: false,
    titleDe: 'Baustoffe in Winterberg',
    titleNl: 'Bouwmaterialen in Winterberg',
    subtitleDe: 'Zuverlässiger Baustoff-Fachhandel für Gewerbe und Privat: Zement, Schotter, Dämmstoffe, Holz, Steine und Dachbaustoffe im Sauerland.',
    subtitleNl: 'Betrouwbare bouwstoffengroothandel voor bedrijven en particulieren: isolatie, hout, stenen, zand en dakmaterialen in Winterberg.',
    objectPosition: 'center center'
  },

  'Bürobedarf': {
    image: '/buerobedarf-winterberg-header.jpg',
    imageAltDe: 'Bürobedarf & Schreibwaren in Winterberg: Hochwertige Schreibwaren, Papier, Ordner und Büroartikel im Fachhandel',
    imageAltNl: 'Kantoorartikelen & Schrijfwaren in Winterberg: Schrijfwaren, papier, ordners en kantoorbenodigdheden',
    credit: 'Foto: Volodymyr Hryshchenko / Unsplash',
    isAiGenerated: false,
    titleDe: 'Bürobedarf & Schreibwaren in Winterberg',
    titleNl: 'Kantoorartikelen in Winterberg',
    subtitleDe: 'Schreibwaren, Schulbedarf, Papier, Toner, Büromöbel und Organisationstalente für das Homeoffice und gewerbliche Büros in Winterberg.',
    subtitleNl: 'Schrijfwaren, schoolartikelen, papier, inktpatronen en kantoormeubilair voor kantoor en thuiswerkplek in Winterberg.',
    objectPosition: 'center center'
  },

  'Spielwaren': {
    image: '/spielwaren-winterberg-header.jpg',
    imageAltDe: 'Spielwarengeschäfte in Winterberg: Farbenfrohe Spielzeuge, Gesellschaftsspiele, Kuscheltiere und Holzspielzeug für Kinder',
    imageAltNl: 'Speelgoedwinkels in Winterberg: Kleurrijk speelgoed, gezelschapsspellen, knuffels en houten speelgoed voor kinderen',
    credit: 'Foto: Nong / Unsplash',
    isAiGenerated: false,
    titleDe: 'Spielwaren in Winterberg',
    titleNl: 'Speelgoedwinkels in Winterberg',
    subtitleDe: 'Große Auswahl an Spielwaren für jedes Alter: Gesellschaftsspiele, Puzzles, Outdoor-Spielzeug, Schlitten, Puppen und Modellbau.',
    subtitleNl: 'Grote selectie speelgoed voor alle leeftijden: bordspellen, puzzels, buitenspeelgoed, sleeën, knuffels en modelbouw in Winterberg.',
    objectPosition: 'center center'
  },

  'Parfümerie': {
    image: '/parfuemerie-winterberg-header.jpg',
    imageAltDe: 'Parfümerien & Kosmetik in Winterberg: Exklusive Düfte, edle Parfums und hochwertige Kosmetiklinien im Fachgeschäft',
    imageAltNl: 'Parfumerieën in Winterberg: Exclusieve geuren, luxe parfums en hoogwaardige cosmeticalijnen',
    credit: 'Foto: Jessica Weiller / Unsplash',
    isAiGenerated: false,
    titleDe: 'Parfümerie & Kosmetik in Winterberg',
    titleNl: 'Parfumerie & Cosmetica in Winterberg',
    subtitleDe: 'Erlesene Duftkompositionen, Luxuskosmetik, Pflegeprodukte und kompetente Make-up-Beratung in den Fachparfümerien Winterbergs.',
    subtitleNl: 'Exclusieve parfums, luxe huidverzorging, cosmetica en deskundig advies in de parfumerieën van Winterberg.',
    objectPosition: 'center center'
  },

  'Kioske': {
    image: '/kioske-winterberg-header.jpg',
    imageAltDe: 'Kioske & Zeitschriften in Winterberg: Frische Presse, Tageszeitungen, Magazine, Snacks und Erfrischungen',
    imageAltNl: 'Kiosken in Winterberg: Kranten, tijdschriften, tabak, drankjes en snelle snacks',
    credit: 'Foto: thom masat / Unsplash',
    isAiGenerated: false,
    titleDe: 'Kioske in Winterberg',
    titleNl: 'Kiosken & Tabak in Winterberg',
    subtitleDe: 'Der schnelle Halt zwischendurch: Tageszeitungen, Magazine, Tabakwaren, kalte Getränke, Süßwaren und Reisebedarf in Winterberg.',
    subtitleNl: 'Snelle service onderweg: dagbladen, tijdschriften, tabak, koude drankjes, zoetwaren en handige reisartikelen in Winterberg.',
    objectPosition: 'center center'
  },

  'Telekommunikation': {
    image: '/telekommunikation-winterberg-header.jpg',
    imageAltDe: 'Telekommunikation & Mobilfunk in Winterberg: Moderne Smartphones, Tablets und Tarifberatung im Telekommunikations-Shop',
    imageAltNl: 'Telecommunicatie in Winterberg: Moderne smartphones, tablets en mobiele abonnementen in de telefoonwinkel',
    credit: 'Foto: NSYS Group / Unsplash',
    isAiGenerated: false,
    titleDe: 'Telekommunikation & Mobilfunk in Winterberg',
    titleNl: 'Telecommunicatie & Mobiel in Winterberg',
    subtitleDe: 'Smartphones, Festnetz- und Internetanschlüsse, Mobilfunkverträge, Zubehör und kompetenter Reparaturservice vor Ort in Winterberg.',
    subtitleNl: 'Smartphones, internet, vaste telefonie, mobiele abonnementen, accessoires en snelle reparatieservice in Winterberg.',
    objectPosition: 'center center'
  },

  'Juweliere & Uhren': {
    image: '/juweliere-winterberg-header.jpg',
    imageAltDe: 'Juweliere & Uhrmacher in Winterberg: Edler Schmuck, Trauringe, Gold, Silber und hochwertige Armbanduhren in der Vitrine',
    imageAltNl: 'Juweliers & Horlogemakers in Winterberg: Exclusieve sieraden, trouwringen, goud, zilver en luxe horloges in de vitrine',
    credit: 'Foto: Jan Zwarthoed / Unsplash',
    isAiGenerated: false,
    titleDe: 'Juweliere & Uhren in Winterberg',
    titleNl: 'Juweliers & Horloges in Winterberg',
    subtitleDe: 'Glänzende Schmuckstücke, Verlobungs- und Eheringe, exklusive Uhrenmarken, Gravuren und qualifizierter Uhrmacher- und Goldschmiedeservice.',
    subtitleNl: 'Schitterende sieraden, verlovings- en trouwringen, exclusieve horlogemerken, graveringen en vakkundig juwelierswerk in Winterberg.',
    objectPosition: 'center center'
  },

  // ==========================================
  // Gastronomie & Kulinarik
  // ==========================================
  'Gastronomie': {
    image: '/gastronomie-winterberg-header.jpg',
    imageAltDe: 'Gastronomie in Winterberg: Gemütliches Gasthof-Restaurant mit gedeckten Tischen, Weinkirsche und warmem Kaminfeuer',
    imageAltNl: 'Horeca & Gastronomie in Winterberg: Sfeervol restaurant met gedekte tafels en warme open haard',
    credit: 'Foto: Vitor Paladini / Unsplash',
    isAiGenerated: false,
    titleDe: 'Gastronomie in Winterberg',
    titleNl: 'Horeca & Eten in Winterberg',
    subtitleDe: 'Genussmomente im Hochsauerland: Entdecken Sie traditionelle Sauerländer Gasthöfe, gemütliche Restaurants, Berghütten, Cafés und Bars in Winterberg.',
    subtitleNl: 'Culinair genieten in het Sauerland: ontdek traditionele herbergen, gezellige restaurants, berghutten, cafés en bars in Winterberg.',
    objectPosition: 'center 45%'
  },

  'Restaurant': {
    image: '/restaurant-winterberg-header.jpg',
    imageAltDe: 'Restaurants in Winterberg: Festlich gedeckter Tisch mit funkelnden Weingläsern, Besteck und warmem Kerzenschein',
    imageAltNl: 'Restaurants in Winterberg: Feestelijk gedekte tafel met kristallen glazen, bestek en sfeervol kaarslicht',
    credit: 'Foto: Ronan / Unsplash',
    isAiGenerated: false,
    titleDe: 'Restaurants in Winterberg',
    titleNl: 'Restaurants in Winterberg',
    subtitleDe: 'Von regionaler Sauerländer Küche bis hin zu internationaler Gourmet-Gastronomie: Finden Sie das perfekte Restaurant für Ihren Abend in Winterberg.',
    subtitleNl: 'Van regionale Sauerlandse specialiteiten tot internationale haute cuisine: vind het perfecte restaurant voor uw avondje uit in Winterberg.',
    objectPosition: 'center 40%'
  },

  'Skihütten': {
    image: '/skihuetten-winterberg-header.jpg',
    imageAltDe: 'Skihütten & Almen in Winterberg: Urige Holzhütte mit Holzbänken und Panoramablick auf die Sauerländer Berge',
    imageAltNl: 'Skihutten & Bergalmen in Winterberg: Authentieke houten berghut met houten banken en panoramisch uitzicht',
    credit: 'Foto: Ruben Hanssen / Unsplash',
    isAiGenerated: false,
    titleDe: 'Skihütten & Almen in Winterberg',
    titleNl: 'Skihutten & Bergalmen in Winterberg',
    subtitleDe: 'Einkehrschwung & Hüttenzauber: Urige Skihütten an den Pisten des Skiliftkarussells und idyllische Almen für Wanderer und Wintersportler.',
    subtitleNl: 'Gezellige skihutten langs de pistes van het Skiliftkarussell en idyllische berghutten voor wandelaars en wintersporters.',
    objectPosition: 'center 45%'
  },

  'Cafés': {
    image: '/cafes-winterberg-header.jpg',
    imageAltDe: 'Cafés in Winterberg: Frisch zubereiteter Cappuccino mit Latte Art Herz auf rustikalem Holztisch',
    imageAltNl: 'Cafés in Winterberg: Vers bereide cappuccino met latte art hart op een houten tafel',
    credit: 'Foto: Daniel Seßler / Unsplash',
    isAiGenerated: false,
    titleDe: 'Cafés in Winterberg',
    titleNl: 'Cafés & Koffiehuizen in Winterberg',
    subtitleDe: 'Kaffeekultur & süße Verführungen: Gemütliche Cafés mit hausgemachten Torten, frischen Waffeln und erlesenen Kaffeespezialitäten.',
    subtitleNl: 'Koffiecultuur & gebak: gezellige cafés met huisgemaakte taarten, verse wafels en hoogwaardige koffiespecialiteiten.',
    objectPosition: 'center center'
  },

  'Pizzerien': {
    image: '/pizzerien-winterberg-header.jpg',
    imageAltDe: 'Pizzerien in Winterberg: Frische Steinofenpizza auf rustikalem Holzbrett vor loderndem Holzbackofen',
    imageAltNl: 'Pizzeria\'s in Winterberg: Verse pizza op houten plank voor een traditionele houtoven',
    credit: 'Foto: Nik Owens / Unsplash',
    isAiGenerated: false,
    titleDe: 'Pizzerien in Winterberg',
    titleNl: 'Pizzeria\'s in Winterberg',
    subtitleDe: 'Italienische Lebensfreude im Sauerland: Knusprige Holzofenpizzen, frische Pasta und mediterrane Köstlichkeiten in den Pizzerien Winterbergs.',
    subtitleNl: 'Italiaanse sferen in het Sauerland: krokante pizza\'s uit de houtoven, verse pasta en mediterrane specialiteiten.',
    objectPosition: 'center 40%'
  },

  'Kneipen und Bars': {
    image: '/kneipen-bars-winterberg-header.jpg',
    imageAltDe: 'Kneipen & Bars in Winterberg: Klassische glänzende Zapfanlage mit Zapfhähnen an der Holztheke im warmen Bar-Licht',
    imageAltNl: 'Kroegen & Bars in Winterberg: Klassieke biertap aan de houten bar in sfeervol barlicht',
    credit: 'Foto: Lucas Santos / Unsplash',
    isAiGenerated: false,
    titleDe: 'Kneipen & Bars in Winterberg',
    titleNl: 'Kroegen & Bars in Winterberg',
    subtitleDe: 'Gesellige Abende & Après-Ski: Traditionelle Sauerländer Kneipen, moderne Cocktailbars, Pubs und Bierlokale für geselliges Beisammensein.',
    subtitleNl: 'Gezellige avonden & après-ski: authentieke Sauerlandse kroegen, moderne cocktailbars en gezellige pubs in Winterberg.',
    objectPosition: 'center center'
  },

  'Eisdielen': {
    image: '/eisdielen-winterberg-header.jpg',
    imageAltDe: 'Eisdielen & Eiscafés in Winterberg: Farbige Eisauslage mit handgemachten Eissorten in der Glastheke',
    imageAltNl: 'IJssalons in Winterberg: Kleurrijke vitrine met ambachtelijk bereid schepijs in vele smaken',
    credit: 'Foto: masha.uu / Unsplash',
    isAiGenerated: false,
    titleDe: 'Eisdielen in Winterberg',
    titleNl: 'IJssalons in Winterberg',
    subtitleDe: 'Sommerlicher Genuss: Handgemachtes italienisches Speiseeis, verführerische Eisbecher, Waffeln und Shakes in den Eiscafés von Winterberg.',
    subtitleNl: 'Zomers genieten: ambachtelijk Italiaans ijs, luxe ijscoupes, verse wafels en milkshakes bij de beste ijssalons van Winterberg.',
    objectPosition: 'center 35%'
  },

  'Weinstuben': {
    image: '/weinstuben-winterberg-header.jpg',
    imageAltDe: 'Weinstuben & Vinotheken in Winterberg: Edle Weingläser auf rustikalem Weintresen mit warmem Kerzenlicht im Hintergrund',
    imageAltNl: 'Wijnlokalen & Vinotheken in Winterberg: Elegante wijnglazen aan de wijnbar met warm kaarslicht',
    credit: 'Foto: Ambitious Studio* | Rick Barrett / Unsplash',
    isAiGenerated: false,
    titleDe: 'Weinstuben in Winterberg',
    titleNl: 'Wijnlokalen in Winterberg',
    subtitleDe: 'Erlesene Tropfen & edles Ambiente: Gemütliche Weinstuben und Vinotheken mit Spitzenweinen aus Deutschland und aller Welt.',
    subtitleNl: 'Exclusieve wijnen & ontspannen sfeer: gezellige wijnlokalen en vinotheken met topwijnen uit Duitsland en de hele wereld.',
    objectPosition: 'center center'
  },

  'Imbisse': {
    image: '/imbisse-winterberg-header.jpg',
    imageAltDe: 'Imbisse & Schnellrestaurants in Winterberg: Knusprige Pommes frites und saftige Burger mit Dips auf Holzplatte',
    imageAltNl: 'Snackbars & Cafetaria\'s in Winterberg: Krokante friet en verse burgers met sauzen op een houten schaal',
    credit: 'Foto: Shaafi Ali / Unsplash',
    isAiGenerated: false,
    titleDe: 'Imbisse in Winterberg',
    titleNl: 'Snackbars & Imbiss in Winterberg',
    subtitleDe: 'Schnell & lecker: Ob echte Sauerländer Currywurst, knusprige Pommes, Döner oder Gourmet-Burger – hier finden Sie die besten Snacks für den schnellen Hunger.',
    subtitleNl: 'Snel en lekker: van traditionele Currywurst en goudgele friet tot verse burgers en snelle maaltijden in Winterberg.',
    objectPosition: 'center 40%'
  },

  // ==========================================
  // Dienstleistungen
  // ==========================================
  'Dienstleistungen': {
    image: '/dienstleistungen-winterberg-header.jpg',
    imageAltDe: 'Dienstleistungen in Winterberg: Moderne, stilvolle Empfangslounge und Beratungsbereich für professionelle Services',
    imageAltNl: 'Dienstverlening in Winterberg: Moderne receptie en adviesruimte voor professionele dienstverlening',
    credit: 'Foto: Aalo Lens / Unsplash',
    isAiGenerated: false,
    titleDe: 'Dienstleistungen in Winterberg',
    titleNl: 'Dienstverlening in Winterberg',
    subtitleDe: 'Kompetente Beratung, professionelle Services und zuverlässige Partner für Privat- und Geschäftskunden in Winterberg und Umgebung.',
    subtitleNl: 'Deskundig advies, professionele diensten en betrouwbare partners voor particulieren en bedrijven in Winterberg.',
    objectPosition: 'center 45%'
  },

  'Immobilienmakler': {
    image: '/immobilienmakler-winterberg-header.jpg',
    imageAltDe: 'Immobilienmakler in Winterberg: Architektonisches Holzhausmodell auf Tisch für Immobilienberatung',
    imageAltNl: 'Makelaars in Winterberg: Houten modelwoning op tafel voor vastgoedadvies',
    credit: 'Foto: Tierra Mallorca / Unsplash',
    isAiGenerated: false,
    titleDe: 'Immobilienmakler in Winterberg',
    titleNl: 'Makelaars in Winterberg',
    subtitleDe: 'Ihr Traumhaus im Sauerland: Professionelle Immobilienmakler für Kauf, Verkauf, Ferienimmobilien und Wertermittlung in Winterberg.',
    subtitleNl: 'Uw droomhuis in het Sauerland: professionele makelaars voor koop, verkoop, vakantiewoningen en taxaties in Winterberg.',
    objectPosition: 'center center'
  },

  'Steuerberater': {
    image: '/steuerberater-winterberg-header.jpg',
    imageAltDe: 'Steuerberater in Winterberg: Rechner, Stift und Finanzunterlagen auf Schreibtisch für Steuererklärung',
    imageAltNl: 'Belastingadviseurs in Winterberg: Rekenmachine, pen en financiële documenten op bureau',
    credit: 'Foto: Aaron Lefler / Unsplash',
    isAiGenerated: false,
    titleDe: 'Steuerberater & Wirtschaftsprüfer in Winterberg',
    titleNl: 'Belastingadviseurs & Boekhouders in Winterberg',
    subtitleDe: 'Präzise Steuerberatung, Finanzbuchhaltung, Lohnabrechnung und zukunftssichere betriebswirtschaftliche Beratung für Ihren Erfolg.',
    subtitleNl: 'Nauwkeurig belastingadvies, financiële administratie, salarisadministratie en bedrijfseconomisch advies in Winterberg.',
    objectPosition: 'center 40%'
  },

  'Rechtsanwälte': {
    image: '/rechtsanwaelte-winterberg-header.jpg',
    imageAltDe: 'Rechtsanwälte in Winterberg: Skulptur der Justitia mit Waage und Schwert als Symbol des Rechts',
    imageAltNl: 'Advocaten in Winterberg: Standbeeld van Vrouwe Justitia met weegschaal en zwaard',
    credit: 'Foto: Tingey Injury Law Firm / Unsplash',
    isAiGenerated: false,
    titleDe: 'Rechtsanwälte & Notare in Winterberg',
    titleNl: 'Advocaten & Notarissen in Winterberg',
    subtitleDe: 'Kompetenter Rechtsbeistand, fundierte juristische Beratung und zuverlässige Vertragsgestaltung in allen Rechtsbereichen.',
    subtitleNl: 'Deskundige juridische bijstand, gedegen juridisch advies en betrouwbare contracten in Winterberg.',
    objectPosition: 'center 35%'
  },

  'Banken': {
    image: '/banken-winterberg-header.jpg',
    imageAltDe: 'Banken in Winterberg: Klassische Bankenarchitektur mit stattlichen Säulen als Symbol für Stabilität',
    imageAltNl: 'Banken in Winterberg: Statige bankarchitectuur met zuilen als symbool van stabiliteit',
    credit: 'Foto: Etienne Martin / Unsplash',
    isAiGenerated: false,
    titleDe: 'Banken & Sparkassen in Winterberg',
    titleNl: 'Banken & Geldautomaten in Winterberg',
    subtitleDe: 'Finanzdienstleistungen vor Ort: Girokonten, Geldautomaten, Kredite, Vermögensaufbau und persönliche Beratung in Winterberg.',
    subtitleNl: 'Financiële dienstverlening ter plaatse: bankrekeningen, geldautomaten, leningen en persoonlijk financieel advies.',
    objectPosition: 'center center'
  },

  'Versicherungsagenturen': {
    image: '/versicherungsagenturen-winterberg-header.jpg',
    imageAltDe: 'Versicherungsagenturen in Winterberg: Lupe auf Versicherungspolice und Vertragsunterlagen',
    imageAltNl: 'Verzekeringen in Winterberg: Vergrootglas op verzekeringspolis en contractdocumenten',
    credit: 'Foto: Vlad Deep / Unsplash',
    isAiGenerated: false,
    titleDe: 'Versicherungsagenturen in Winterberg',
    titleNl: 'Verzekeringsagenten in Winterberg',
    subtitleDe: 'Rundum abgesichert: Maßgeschneiderter Versicherungsschutz für Gesundheit, Familie, Gebäude, Haftpflicht und Altersvorsorge.',
    subtitleNl: 'Optimaal verzekerd: op maat gemaakte verzekeringen voor gezondheid, gezin, opstal, aansprakelijkheid en pensioen.',
    objectPosition: 'center 45%'
  },

  'Marketingdienstleistungen': {
    image: '/marketingdienstleistungen-winterberg-header.jpg',
    imageAltDe: 'Marketingdienstleistungen in Winterberg: Kreativer Agentur-Arbeitsplatz mit Farbfächern und Tastatur',
    imageAltNl: 'Marketing in Winterberg: Creatieve werkplek met kleurstalen en toetsenbord',
    credit: 'Foto: Andy Brown / Unsplash',
    isAiGenerated: false,
    titleDe: 'Marketing- & Werbeagenturen in Winterberg',
    titleNl: 'Marketing- & Reclamebureaus in Winterberg',
    subtitleDe: 'Kreative Markenentwicklung, Webdesign, Social Media, Fotografie und strategische Werbung für Ihren erfolgreichen Unternehmensauftritt.',
    subtitleNl: 'Creatieve merkontwikkeling, webdesign, social media, fotografie en effectieve reclame in Winterberg.',
    objectPosition: 'center center'
  },

  'Finanzberatung': {
    image: '/finanzberatung-winterberg-header.jpg',
    imageAltDe: 'Finanzberatung in Winterberg: Professionelle Börsen- und Kurscharts für fundierte Kapitalanlagen',
    imageAltNl: 'Financieel advies in Winterberg: Koersgrafieken en analyses voor beleggingen',
    credit: 'Foto: Maxim Hopman / Unsplash',
    isAiGenerated: false,
    titleDe: 'Finanzberatung & Vermögensplanung in Winterberg',
    titleNl: 'Financieel Advies & Vermogensbeheer in Winterberg',
    subtitleDe: 'Unabhängige Finanzberatung, Ruhestandsplanung, Kapitalanlagen und zukunftsorientierte Vermögensstrategien im Hochsauerland.',
    subtitleNl: 'Onafhankelijk financieel advies, pensioenplanning, beleggingen en vermogensopbouw in Winterberg.',
    objectPosition: 'center center'
  },

  'Coworking Space': {
    image: '/coworking-space-winterberg-header.jpg',
    imageAltDe: 'Coworking Space in Winterberg: Moderner offener Büroraum mit Schreibtischen und ergonomischen Stühlen',
    imageAltNl: 'Coworking Space in Winterberg: Moderne open kantoorruimte met bureaus en comfortabele stoelen',
    credit: 'Foto: Exospace Bbsr / Unsplash',
    isAiGenerated: false,
    titleDe: 'Coworking Spaces & Workation in Winterberg',
    titleNl: 'Coworking Spaces & Workation in Winterberg',
    subtitleDe: 'Flexibles Arbeiten in den Sauerländer Bergen: Moderne Arbeitsplätze, Highspeed-Internet, Meetingräume und kreative Community.',
    subtitleNl: 'Flexibel werken in het Sauerland: moderne werkplekken, snel internet, vergaderruimtes en inspirerende sfeer.',
    objectPosition: 'center 45%'
  },

  'IT & Software': {
    image: '/it-software-winterberg-header.jpg',
    imageAltDe: 'IT & Software in Winterberg: Quellcode auf dunklem Bildschirm für moderne Software- und Webentwicklung',
    imageAltNl: 'IT & Software in Winterberg: Broncode op donker scherm voor softwareontwikkeling',
    credit: 'Foto: Markus Spiske / Unsplash',
    isAiGenerated: false,
    titleDe: 'IT-Dienstleister & Softwareentwicklung in Winterberg',
    titleNl: 'IT-Diensten & Softwareontwikkeling in Winterberg',
    subtitleDe: 'Zuverlässige IT-Infrastruktur, Cloud-Lösungen, Cyber-Security, individuelle Softwareentwicklung und professioneller IT-Support.',
    subtitleNl: 'Betrouwbare IT-infrastructuur, cloudoplossingen, cybersecurity, softwareontwikkeling en IT-support in Winterberg.',
    objectPosition: 'center center'
  },

  'Kindergärten & Kitas': {
    image: '/kindergaerten-kitas-winterberg-header.jpg',
    imageAltDe: 'Kindergärten & Kitas in Winterberg: Freundlicher Gruppenraum mit Kindertischen und Holzspielzeug',
    imageAltNl: 'Kinderdagverblijven in Winterberg: Vriendelijke groepsruimte met houten speelgoed',
    credit: 'Foto: Camila Mofsovich / Unsplash',
    isAiGenerated: false,
    titleDe: 'Kindergärten & Kindertagesstätten in Winterberg',
    titleNl: 'Kinderdagverblijven & Peuterspeelzalen in Winterberg',
    subtitleDe: 'Liebevolle Betreuung, frühkindliche Bildung und naturnahe Erlebnisräume für die Kleinsten in den Kitas von Winterberg und den Ortsteilen.',
    subtitleNl: 'Liefdevolle kinderopvang, spelenderwijs leren en veilige ontwikkelingsruimtes voor de allerkleinsten in Winterberg.',
    objectPosition: 'center 45%'
  },

  'Schulen': {
    image: '/schulen-winterberg-header.jpg',
    imageAltDe: 'Schulen in Winterberg: Helles Klassenzimmer mit Holztischen und traditioneller Schultafel',
    imageAltNl: 'Scholen in Winterberg: Licht klaslokaal met houten schoolbanken en krijtbord',
    credit: 'Foto: Ivan Aleksic / Unsplash',
    isAiGenerated: false,
    titleDe: 'Schulen & Bildungseinrichtungen in Winterberg',
    titleNl: 'Scholen & Onderwijsinstellingen in Winterberg',
    subtitleDe: 'Grundschulen, weiterführende Schulen und Bildungsangebote: Beste Voraussetzungen für das Lernen und Heranwachsen in Winterberg.',
    subtitleNl: 'Basisscholen, voortgezet onderwijs en leertrajecten: uitstekende onderwijsvoorzieningen in Winterberg.',
    objectPosition: 'center 45%'
  },

  'Tagungszentren': {
    image: '/tagungszentren-winterberg-header.jpg',
    imageAltDe: 'Tagungszentren in Winterberg: Eleganter Konferenztisch mit bequemen Ledersesseln für geschäftliche Meetings',
    imageAltNl: 'Conferentiecentra in Winterberg: Elegante vergadertafel met lederen stoelen voor zakelijke bijeenkomsten',
    credit: 'Foto: Dane Deaner / Unsplash',
    isAiGenerated: false,
    titleDe: 'Tagungszentren & Kongresse in Winterberg',
    titleNl: 'Conferentiecentra & Vergaderlocaties in Winterberg',
    subtitleDe: 'Konferenzen, Seminare und Events mit Weitblick: Hochwertige Tagungsräume mit moderner Medientechnik im Sauerland.',
    subtitleNl: 'Conferenties, seminars en zakelijke evenementen: hoogwaardige vergaderlocaties met moderne audiovisuele techniek.',
    objectPosition: 'center center'
  },

  'Soziale Dienste': {
    image: '/soziale-dienste-winterberg-header.jpg',
    imageAltDe: 'Soziale Dienste in Winterberg: Warme Holzbuchstaben mit dem Schriftzug Care auf Holztisch als Symbol für Fürsorge',
    imageAltNl: 'Sociale diensten in Winterberg: Houten letters met het woord Care als symbool voor zorg en aandacht',
    credit: 'Foto: Markus Winkler / Unsplash',
    isAiGenerated: false,
    titleDe: 'Soziale Dienste & Hilfsorganisationen in Winterberg',
    titleNl: 'Sociale Diensten & Hulpverlening in Winterberg',
    subtitleDe: 'Menschlichkeit & Unterstützung: Beratung, soziale Hilfsangebote, Nachbarschaftshilfe und Beratungsstellen für alle Lebenslagen.',
    subtitleNl: 'Hulp & maatschappelijke ondersteuning: advies, welzijnsorganisaties en steunpunten voor iedereen in Winterberg.',
    objectPosition: 'center 40%'
  },

  'Tourismus': {
    image: '/tourismus-winterberg-header.jpg',
    imageAltDe: 'Tourismus in Winterberg: Klassischer Kompass auf topografischer Wanderkarte für Bergtouren im Sauerland',
    imageAltNl: 'Toerisme in Winterberg: Klassiek kompas op topografische wandelkaart voor bergtochten',
    credit: 'Foto: Alexander Andrews / Unsplash',
    isAiGenerated: false,
    titleDe: 'Tourismus & Tourist-Informationen in Winterberg',
    titleNl: 'Toerisme & Toeristeninformatie in Winterberg',
    subtitleDe: 'Ihr Urlaub im Hochsauerland: Wanderkarten, Ausflugstipps, Gästekarten, geführte Touren und Prospektmaterial für Winterberg.',
    subtitleNl: 'Uw vakantie in het Sauerland: wandelkaarten, tips voor uitstapjes, gastenkaarten en rondleidingen in Winterberg.',
    objectPosition: 'center 45%'
  },

  // ==========================================
  // Ski, Bike & Sport
  // ==========================================
  'Ski, Bike & Sport': {
    image: '/ski-bike-sport-winterberg-header.jpg',
    imageAltDe: 'Ski, Bike & Sport in Winterberg: Verschneite Sauerländer Berglandschaft unter klarem blauem Winterhimmel',
    imageAltNl: 'Ski, Bike & Sport in Winterberg: Besneeuwd berglandschap van het Sauerland onder een strakblauwe winterhemel',
    credit: 'Foto: Julien Riedel / Unsplash',
    isAiGenerated: false,
    titleDe: 'Ski, Bike & Sport in Winterberg',
    titleNl: 'Ski, Bike & Sport in Winterberg',
    subtitleDe: 'Deutschlands Wintersport- & Bike-Mekka: Erstklassige Skigebiete, Bikepark, Wanderwege, Sportfachgeschäfte und Outdoor-Abenteuer.',
    subtitleNl: 'Hét wintersport- en fietsmekka van Duitsland: topskigebieden, het beroemde Bikepark, wandelpaden en outdoor-avonturen.',
    objectPosition: 'center 40%'
  },

  'Skiverleih': {
    image: '/skiverleih-winterberg-header.jpg',
    imageAltDe: 'Skiverleih in Winterberg: Hochwertige Carvingskis und Wintersportausrüstung im Schnee',
    imageAltNl: 'Skiverhuur in Winterberg: Moderne carveski\'s en wintersportuitrusting in de sneeuw',
    credit: 'Foto: Karsten Winegeart / Unsplash',
    isAiGenerated: false,
    titleDe: 'Skiverleih in Winterberg',
    titleNl: 'Skiverhuur in Winterberg',
    subtitleDe: 'Modernste Ski- und Snowboardausrüstung: Skiverleih-Stationen direkt an den Pisten des Skiliftkarussells Winterberg.',
    subtitleNl: 'Nieuwste ski- en snowboarduitrusting: professionele skiverhuurlocaties direct aan de pistes van het Skiliftkarussell.',
    objectPosition: 'center 45%'
  },

  'Fahrradverleih': {
    image: '/fahrradverleih-winterberg-header.jpg',
    imageAltDe: 'Fahrradverleih in Winterberg: Reihe moderner Mountainbikes und E-Bikes für Radtouren bereitgestellt',
    imageAltNl: 'Fietsverhuur in Winterberg: Rij moderne mountainbikes en e-bikes klaar voor gebruik',
    credit: 'Foto: Waldemar Brandt / Unsplash',
    isAiGenerated: false,
    titleDe: 'Fahrrad- & E-Bike-Verleih in Winterberg',
    titleNl: 'Fiets- & E-Bike Verhuur in Winterberg',
    subtitleDe: 'Erkunden Sie das Land der 1000 Berge: E-Mountainbikes, Fullys, Gravelbikes und Tourenräder für anspruchsvolle Trails und Familientouren.',
    subtitleNl: 'Ontdek het land van de 1000 bergen: e-mountainbikes, fullys, gravelbikes en tourfietsen voor elk niveau.',
    objectPosition: 'center center'
  },

  'Fahrradgeschäfte': {
    image: '/fahrradgeschaefte-winterberg-header.jpg',
    imageAltDe: 'Fahrradgeschäfte in Winterberg: Werkstattwand mit professionellem Fahrradwerkzeug und Zubehör',
    imageAltNl: 'Fietsenwinkels in Winterberg: Werkplaatswand met professioneel fietsgereedschap en accessoires',
    credit: 'Foto: Anton Savinov / Unsplash',
    isAiGenerated: false,
    titleDe: 'Fahrradgeschäfte & Werkstätten in Winterberg',
    titleNl: 'Fietsenwinkels & Reparaties in Winterberg',
    subtitleDe: 'Top-Bikes, Schutzkleidung, Ersatzteile und kompetenter Meisterservice rund ums Zweirad in den Radsportgeschäften Winterbergs.',
    subtitleNl: 'Topfietsen, beschermende kleding, onderdelen en vakkundig onderhoud in de fietsspeciaalzaken van Winterberg.',
    objectPosition: 'center center'
  },

  'Sport & Outdoor': {
    image: '/sport-outdoor-winterberg-header.jpg',
    imageAltDe: 'Sport & Outdoor in Winterberg: Robuster Wanderrucksack auf Holzstamm im Bergwald',
    imageAltNl: 'Sport & Outdoor in Winterberg: Stevige wandelrugzak op een boomstam in het bergbos',
    credit: 'Foto: Ali Kazal / Unsplash',
    isAiGenerated: false,
    titleDe: 'Sport & Outdoor in Winterberg',
    titleNl: 'Sport & Outdoor in Winterberg',
    subtitleDe: 'Ausrüstung für Ihr Bergabenteuer: Funktionsbekleidung, Wanderschuhe, Rucksäcke, Kletterzubehör und Campingartikel.',
    subtitleNl: 'Uitrusting voor uw bergavontuur: functionele kleding, wandelschoenen, rugzakken en kampeerartikelen.',
    objectPosition: 'center center'
  },

  'Fitnessstudios': {
    image: '/fitnessstudios-winterberg-header.jpg',
    imageAltDe: 'Fitnessstudios in Winterberg: Schwarze Kurzhanteln auf dem Studioboden für Kraft- und Fitnesstraining',
    imageAltNl: 'Fitnesscentra in Winterberg: Zwarte dumbbells op de vloer voor kracht- en conditietraining',
    credit: 'Foto: Alora Griffiths / Unsplash',
    isAiGenerated: false,
    titleDe: 'Fitnessstudios in Winterberg',
    titleNl: 'Fitnesscentra & Gyms in Winterberg',
    subtitleDe: 'Kraft, Ausdauer & Wohlbefinden: Moderne Fitnessclubs mit Gerätetraining, Freihantelbereichen, Kursen und Wellness im Hochsauerland.',
    subtitleNl: 'Kracht, conditie en vitaliteit: moderne fitnessclubs met apparatuur, vrije gewichten, groepslessen en wellness.',
    objectPosition: 'center center'
  },

  'Tennisplätze': {
    image: '/tennisplaetze-winterberg-header.jpg',
    imageAltDe: 'Tennisplätze in Winterberg: Tennisball auf weißer Spielfeldlinie auf dem Tennisplatz',
    imageAltNl: 'Tennisbanen in Winterberg: Tennisbal op de belijning van de tennisbaan',
    credit: 'Foto: Ben Hershey / Unsplash',
    isAiGenerated: false,
    titleDe: 'Tennisplätze & Tennisclubs in Winterberg',
    titleNl: 'Tennisbanen & Tennisclubs in Winterberg',
    subtitleDe: 'Spiel, Satz und Sieg: Sand- und Hallenplätze, Vereine, Tennistraining und Freizeitspiel vor Sauerländer Kulisse.',
    subtitleNl: 'Gravel- en binnenbanen, verenigingen, tennisles en recreatief tennis te midden van de Sauerlandse natuur.',
    objectPosition: 'center 45%'
  },

  'Fußballvereine': {
    image: '/fussballvereine-winterberg-header.jpg',
    imageAltDe: 'Fußballvereine in Winterberg: Klassischer Lederfußball auf gepflegtem grünem Rasenplatz',
    imageAltNl: 'Voetbalclubs in Winterberg: Klassieke voetbal op een strak groen grasveld',
    credit: 'Foto: Rachel Yoon / Unsplash',
    isAiGenerated: false,
    titleDe: 'Fußballvereine in Winterberg',
    titleNl: 'Voetbalclubs & Voetbalverenigingen in Winterberg',
    subtitleDe: 'Teamgeist & Leidenschaft: Lokale Sportvereine, Nachwuchsförderung, Rasen- und Kunstrasenplätze in den Stadtteilen von Winterberg.',
    subtitleNl: 'Teamgeest en passie: lokale sportclubs, jeugdopleiding en moderne voetbalvelden in Winterberg.',
    objectPosition: 'center 45%'
  },

  'Reitsport': {
    image: '/reitsport-winterberg-header.jpg',
    imageAltDe: 'Reitsport in Winterberg: Edles Pferd mit klassischem Ledersattel im Stall und Weidebereich',
    imageAltNl: 'Paardensport in Winterberg: Paard met klassiek lederen zadel in de stal en weide',
    credit: 'Foto: Jez Timms / Unsplash',
    isAiGenerated: false,
    titleDe: 'Reitsport & Reiterhöfe in Winterberg',
    titleNl: 'Paardensport & Maneges in Winterberg',
    subtitleDe: 'Glück auf dem Rücken der Pferde: Reitunterricht, geführte Ausritte, Pensionspferdehaltung und Reithallen im Sauerland.',
    subtitleNl: 'Paardrijlessen, buitenritten, pensionstallen en overdekte rijhallen in de prachtige natuur van het Sauerland.',
    objectPosition: 'center 40%'
  },

  // ==========================================
  // Gesundheit & Medizin
  // ==========================================
  'Gesundheit & Medizin': {
    image: '/gesundheit-medizin-winterberg-header.jpg',
    imageAltDe: 'Gesundheit & Medizin in Winterberg: Medizinisches Stethoskop auf Praxistisch für verlässliche medizinische Versorgung',
    imageAltNl: 'Gezondheid & Zorg in Winterberg: Medische stethoscoop op bureau voor betrouwbare zorg',
    credit: 'Foto: Hush Naidoo Jade Photography / Unsplash',
    isAiGenerated: false,
    titleDe: 'Gesundheit & Medizin in Winterberg',
    titleNl: 'Gezondheid & Zorg in Winterberg',
    subtitleDe: 'Ihre Gesundheit in besten Händen: Umfassende medizinische Versorgung, Fachärzte, Apotheken, Therapien und Gesundheitsangebote.',
    subtitleNl: 'Uw gezondheid in goede handen: complete medische zorg, artsen, apotheken, fysiotherapie en wellness in Winterberg.',
    objectPosition: 'center center'
  },

  'Ärzte & Praxen': {
    image: '/aerzte-praxen-winterberg-header.jpg',
    imageAltDe: 'Ärzte & Praxen in Winterberg: Moderner, heller Praxisflur für Patientenbetreuung',
    imageAltNl: 'Huisartsen & Specialisten in Winterberg: Moderne, lichte praktijkgang voor patiëntenzorg',
    credit: 'Foto: Tasha Kostyuk / Unsplash',
    isAiGenerated: false,
    titleDe: 'Ärzte & Fachpraxen in Winterberg',
    titleNl: 'Huisartsen & Medische Praktijken in Winterberg',
    subtitleDe: 'Allgemeinmediziner, Hausärzte und Fachärzte für Kinder, Innere Medizin, Orthopädie und Notfallversorgung in Winterberg.',
    subtitleNl: 'Huisartsen en specialisten voor algemene geneeskunde, interne geneeskunde, orthopedie en spoedeisende hulp.',
    objectPosition: 'center center'
  },

  'Zahnärzte': {
    image: '/zahnaerzte-winterberg-header.jpg',
    imageAltDe: 'Zahnärzte in Winterberg: Moderner zahnärztlicher Behandlungsstuhl und moderne Ausstattung',
    imageAltNl: 'Tandartsen in Winterberg: Moderne tandartsstoel en apparatuur in de praktijk',
    credit: 'Foto: Atikah Akhtar / Unsplash',
    isAiGenerated: false,
    titleDe: 'Zahnärzte & Kieferorthopädie in Winterberg',
    titleNl: 'Tandartsen & Mondzorg in Winterberg',
    subtitleDe: 'Für Ihr schönstes Lächeln: Zahnvorsorge, Prophylaxe, Implantologie, Zahnersatz und ästhetische Zahnheilkunde.',
    subtitleNl: 'Voor een stralende glimlach: tandheelkundige controles, preventie, implantaten en cosmetische tandheelkunde in Winterberg.',
    objectPosition: 'center 45%'
  },

  'Apotheken': {
    image: '/apotheken-winterberg-header.jpg',
    imageAltDe: 'Apotheken in Winterberg: Traditionsreiche Apothekenregale mit Medizinflaschen und Heilmitteln',
    imageAltNl: 'Apotheken in Winterberg: Traditionele apothekerskasten met medicijnflesjes en geneesmiddelen',
    credit: 'Foto: Ángel Nava / Unsplash',
    isAiGenerated: false,
    titleDe: 'Apotheken in Winterberg',
    titleNl: 'Apotheken in Winterberg',
    subtitleDe: 'Schnelle Hilfe & persönliche Beratung: Medikamente, Naturheilkunde, Verleih von Milchpumpen und Notdienstapotheken.',
    subtitleNl: 'Snelle service en deskundig advies: medicijnen, gezondheidsproducten, natuurgeneeskunde en apotheekspoeddienst.',
    objectPosition: 'center 40%'
  },

  'Physiotherapie': {
    image: '/physiotherapie-winterberg-header.jpg',
    imageAltDe: 'Physiotherapie in Winterberg: Behandlungsliege im hellen Therapieraum für Krankengymnastik und Rehabilitation',
    imageAltNl: 'Fysiotherapie in Winterberg: Behandeltafel in een lichte behandelruimte voor revalidatie',
    credit: 'Foto: Nightingale Home nurse / Unsplash',
    isAiGenerated: false,
    titleDe: 'Physiotherapie & Krankengymnastik in Winterberg',
    titleNl: 'Fysiotherapie & Revalidatie in Winterberg',
    subtitleDe: 'Bewegung ohne Schmerzen: Manuelle Therapie, Krankengymnastik, Sportphysiotherapie, Lymphdrainage und Reha-Konzepte.',
    subtitleNl: 'Pijnvrij bewegen: manuele therapie, sportfysiotherapie, lymfedrainage en effectieve revalidatie in Winterberg.',
    objectPosition: 'center center'
  },

  'Pflegedienste': {
    image: '/pflegedienste-winterberg-header.jpg',
    imageAltDe: 'Pflegedienste in Winterberg: Hände ruhen geborgen auf einem Gehstock als Symbol für respektvolle Seniorenpflege',
    imageAltNl: 'Thuiszorg in Winterberg: Handen rusten op een wandelstok als symbool van respectvolle ouderenzorg',
    credit: 'Foto: Alexas_Fotos / Unsplash',
    isAiGenerated: false,
    titleDe: 'Ambulante Pflegedienste in Winterberg',
    titleNl: 'Thuiszorg & Zorgdiensten in Winterberg',
    subtitleDe: 'Würdevolle Betreuung zu Hause: Häusliche Krankenpflege, Seniorenbetreuung, Demenzbegleitung und hauswirtschaftliche Entlastung.',
    subtitleNl: 'Zorgzame begeleiding thuis: wijkverpleging, ouderenzorg, huishoudelijke hulp en ondersteuning van mantelzorgers.',
    objectPosition: 'center 45%'
  },

  'Massagen': {
    image: '/massagen-winterberg-header.jpg',
    imageAltDe: 'Massagen & Wellness in Winterberg: Feines Massageöl, weiche Handtücher und Blüten auf Holzablage',
    imageAltNl: 'Massages & Wellness in Winterberg: Massageolie, zachte handdoeken en bloemen voor ontspanning',
    credit: 'Foto: Camille Brodard / Unsplash',
    isAiGenerated: false,
    titleDe: 'Massagen & Wellness in Winterberg',
    titleNl: 'Massages & Wellness in Winterberg',
    subtitleDe: 'Tiefenentspannung & Regeneration: Klassische Rückenmassagen, Hot Stone, Ayurveda, Sportmassagen und Wohlfühlbehandlungen.',
    subtitleNl: 'Diepe ontspanning en herstel: klassieke rugmassages, hot stone, sportmassages en weldadige wellnessbehandelingen.',
    objectPosition: 'center 40%'
  },

  'Kosmetikstudios': {
    image: '/kosmetikstudios-winterberg-header.jpg',
    imageAltDe: 'Kosmetikstudios in Winterberg: Hochwertige Pflegekosmetik und Make-up-Spiegel für Gesichtsbehandlungen',
    imageAltNl: 'Schoonheidssalons in Winterberg: Huidverzorgingsproducten en spiegel voor gezichtsbehandelingen',
    credit: 'Foto: Mariia Berezovsky / Unsplash',
    isAiGenerated: false,
    titleDe: 'Kosmetikstudios & Beauty in Winterberg',
    titleNl: 'Schoonheidssalons & Beauty in Winterberg',
    subtitleDe: 'Verwöhnmomente für Haut & Sinne: Gesichtsbehandlungen, Anti-Aging, Maniküre, Pediküre, Wimpern- und Brauenstyling.',
    subtitleNl: 'Verwenmomenten voor lichaam en gezicht: gezichtsbehandelingen, manicure, pedicure, wimpers en nagelstyling.',
    objectPosition: 'center center'
  },

  'Tiergesundheit': {
    image: '/tiergesundheit-winterberg-header.jpg',
    imageAltDe: 'Tiergesundheit in Winterberg: Vitaler Hund auf grüner Bergwiese im Sauerland',
    imageAltNl: 'Dierengezondheid in Winterberg: Gezonde hond op een groene bergweide in het Sauerland',
    credit: 'Foto: Xingchen Yan / Unsplash',
    isAiGenerated: false,
    titleDe: 'Tierärzte & Tiergesundheit in Winterberg',
    titleNl: 'Dierenartsen & Diergezondheid in Winterberg',
    subtitleDe: 'Beste Fürsorge für Ihre Haustiere: Tierarztpraxen, Tierheilpraktiker, mobile Notdienste und Tierphysiotherapie.',
    subtitleNl: 'Liefdevolle zorg voor uw huisdieren: dierenartspraktijken, diertherapie en spoedzorg voor honden, katten en paarden.',
    objectPosition: 'center 40%'
  },

  'Yoga': {
    image: '/yoga-winterberg-header.jpg',
    imageAltDe: 'Yoga in Winterberg: Helles, ruhiges Yogastudio mit viel natürlichem Tageslicht für Achtsamkeit',
    imageAltNl: 'Yoga in Winterberg: Lichte yogastudio met natuurlijk daglicht voor mindfulness en rust',
    credit: 'Foto: eran design / Unsplash',
    isAiGenerated: false,
    titleDe: 'Yoga & Meditation in Winterberg',
    titleNl: 'Yoga & Meditatie in Winterberg',
    subtitleDe: 'Ruhepol für Körper und Geist: Hatha Yoga, Vinyasa, Yin Yoga, Klangschalenmeditation und Yoga-Retreats in der Natur.',
    subtitleNl: 'Rust voor lichaam en geest: Hatha yoga, Vinyasa, Yin yoga, meditatie en yoga-retraites te midden van de natuur.',
    objectPosition: 'center center'
  },

  'Sanitätshäuser': {
    image: '/sanitaetshaeuser-winterberg-header.jpg',
    imageAltDe: 'Sanitätshäuser in Winterberg: Moderner Leichtgewicht-Rollstuhl für Mobilität und Selbstständigkeit',
    imageAltNl: 'Thuiszorgwinkels in Winterberg: Moderne rolstoel voor mobiliteit en zelfstandigheid',
    credit: 'Foto: Junseong Lee / Unsplash',
    isAiGenerated: false,
    titleDe: 'Sanitätshäuser & Orthopädietechnik in Winterberg',
    titleNl: 'Thuiszorgwinkels & Orthopedie in Winterberg',
    subtitleDe: 'Mobilität & Lebensqualität im Alltag: Bandagen, Kompressionsstrümpfe, Gehhilfen, Rollatoren, Rollstühle und Orthopädieschuhtechnik.',
    subtitleNl: 'Mobiliteit en zelfstandigheid: braces, compressiekousen, looprekken, rollators en orthopedische hulpmiddelen.',
    objectPosition: 'center center'
  },

  'Hörgeräteakustiker': {
    image: '/hoergeraeteakustiker-winterberg-header.jpg',
    imageAltDe: 'Hörgeräteakustiker in Winterberg: Brillante blaue Schallwellen-Frequenz als Symbol für klares Hören und Akustik',
    imageAltNl: 'Audiciens in Winterberg: Blauwe geluidsgolven als symbool voor helder horen en akoestiek',
    credit: 'Foto: Pawel Czerwinski / Unsplash',
    isAiGenerated: false,
    titleDe: 'Hörgeräteakustiker in Winterberg',
    titleNl: 'Audiciens & Hoorzorg in Winterberg',
    subtitleDe: 'Wieder alles verstehen: Kostenlose Hörtests, diskrete moderne Hörgeräte, Gehörschutz und persönliche Akustik-Beratung.',
    subtitleNl: 'Weer volop genieten van geluid: gratis hoortests, discrete moderne hoortoestellen en vakkundige hoorzorg.',
    objectPosition: 'center center'
  },

  'Optiker': {
    image: '/optiker-winterberg-header.jpg',
    imageAltDe: 'Optiker in Winterberg: Auslage hochwertiger Brillengestelle und Sehhilfen im Optikerfachgeschäft',
    imageAltNl: 'Opticiens in Winterberg: Collectie modieuze brillen en monturen in de optiekzaak',
    credit: 'Foto: CHUTTERSNAP / Unsplash',
    isAiGenerated: false,
    titleDe: 'Optiker & Brillen in Winterberg',
    titleNl: 'Opticiens & Brillen in Winterberg',
    subtitleDe: 'Durchblick mit Stil: Exakte Sehstärkenmessung, modische Korrektionsbrillen, Sonnenbrillen, Sportbrillen und Kontaktlinsen.',
    subtitleNl: 'Scherp zicht met stijl: nauwkeurige oogmetingen, modieuze merkbrillen, zonnebrillen, sportbrillen en contactlenzen.',
    objectPosition: 'center 45%'
  },

  // ==========================================
  // Mobilität & KFZ
  // ==========================================
  'Mobilität & KFZ': {
    image: '/mobilitaet-kfz-winterberg-header.jpg',
    imageAltDe: 'Mobilität & KFZ in Winterberg: Malerische geschwungene Bergstraße durch die tiefgrünen Sauerländer Nadelwälder',
    imageAltNl: 'Mobiliteit & Auto in Winterberg: Schilderachtige bergweg door de diepgroene Sauerlandse dennenbossen',
    credit: 'Foto: Taneli Lahtinen / Unsplash',
    isAiGenerated: false,
    titleDe: 'Mobilität & KFZ in Winterberg',
    titleNl: 'Mobiliteit & Auto in Winterberg',
    subtitleDe: 'Sicher mobil im Sauerland: Autohäuser, Meisterwerkstätten, Tankstellen und Fahrschulen für Ihr Fahrzeug in Winterberg.',
    subtitleNl: 'Veilig onderweg in het Sauerland: autodealers, garages, tankstations en rijscholen voor uw auto in Winterberg.',
    objectPosition: 'center 45%'
  },

  'KFZ-Werkstätten': {
    image: '/kfz-werkstaetten-winterberg-header.jpg',
    imageAltDe: 'KFZ-Werkstätten in Winterberg: Professionelles Werkzeugset für Autoreparatur und Inspektion',
    imageAltNl: 'Autogarages in Winterberg: Professioneel gereedschap voor autoreparatie en onderhoud',
    credit: 'Foto: Quilia / Unsplash',
    isAiGenerated: false,
    titleDe: 'KFZ-Werkstätten & Autoreparatur in Winterberg',
    titleNl: 'Autogarages & Schadeherstel in Winterberg',
    subtitleDe: 'Meisterhafte Fahrzeugtechnik: TÜV/AU-Hauptuntersuchung, Inspektionen, Reifenservice, Bremsen, Unfallinstandsetzung und Klimatechnik.',
    subtitleNl: 'Vakkundig auto-onderhoud: APK-keuring, grote beurt, bandenservice, remmen, aircoservice en schadeherstel.',
    objectPosition: 'center 45%'
  },

  'Tankstellen': {
    image: '/tankstellen-winterberg-header.jpg',
    imageAltDe: 'Tankstellen in Winterberg: Moderne Tankstelle mit beleuchteten Zapfsäulen bei Nacht',
    imageAltNl: 'Tankstations in Winterberg: Modern tankstation met verlichte pompen in de avond',
    credit: 'Foto: Hans Eiskonen / Unsplash',
    isAiGenerated: false,
    titleDe: 'Tankstellen & E-Ladestationen in Winterberg',
    titleNl: 'Tankstations & Laadpalen in Winterberg',
    subtitleDe: 'Tanken, Laden & Rasten: Kraftstoffe, E-Ladesäulen, Waschanlagen, Shop mit Snacks und Reisebedarf rund um die Uhr.',
    subtitleNl: 'Tanken, opladen en pauzeren: brandstoffen, snelladers voor elektrische auto\'s, wasstraten en tankshops.',
    objectPosition: 'center center'
  },

  'Autohäuser': {
    image: '/autohaeuser-winterberg-header.jpg',
    imageAltDe: 'Autohäuser in Winterberg: Moderner Ausstellungsraum mit Neufahrzeugen auf glänzendem Fliesenboden',
    imageAltNl: 'Autodealers in Winterberg: Moderne showroom met nieuwe auto\'s op een glimmende vloer',
    credit: 'Foto: Kenjiro Yagi / Unsplash',
    isAiGenerated: false,
    titleDe: 'Autohäuser & Neuwagen in Winterberg',
    titleNl: 'Autodealers & Showrooms in Winterberg',
    subtitleDe: 'Finden Sie Ihr Wunschfahrzeug: Neuwagen, Gebrauchtwagen, Leasingangebote, Probefahrten und markengebundene Werkstätten.',
    subtitleNl: 'Vind uw ideale auto: nieuwe en gebruikte auto\'s, leasecontracten, proefritten en officiële merkdealers.',
    objectPosition: 'center 40%'
  },

  'Fahrschulen': {
    image: '/fahrschulen-winterberg-header.jpg',
    imageAltDe: 'Fahrschulen in Winterberg: Lenkrad und modernes Cockpit während der Fahrt',
    imageAltNl: 'Rijscholen in Winterberg: Stuurwiel en modern dashboard tijdens een autorit',
    credit: 'Foto: Christian Wiediger / Unsplash',
    isAiGenerated: false,
    titleDe: 'Fahrschulen in Winterberg',
    titleNl: 'Rijscholen in Winterberg',
    subtitleDe: 'Erfolgreich zum Führerschein: Professionelle Ausbildung für PKW, Motorrad, Anhänger und Mofa mit moderner Fahrschulflotte.',
    subtitleNl: 'Snel en veilig uw rijbewijs halen: rijopleidingen voor auto, motor, aanhanger en bromfiets in Winterberg.',
    objectPosition: 'center center'
  },

  // ==========================================
  // Freizeit & Erlebnisse
  // ==========================================
  'Freizeit': {
    image: '/freizeit-winterberg-header.jpg',
    imageAltDe: 'Freizeit & Erlebnis in Winterberg: Idyllischer Bergsee umrahmt von tiefgrünen Tannenwäldern im Sauerland',
    imageAltNl: 'Vrije tijd & Uitstapjes in Winterberg: Idyllisch bergmeer omringd door sparrenbossen in het Sauerland',
    credit: 'Foto: Claudia Chiavazza / Unsplash',
    isAiGenerated: false,
    titleDe: 'Freizeit & Ausflugsziele in Winterberg',
    titleNl: 'Vrije Tijd & Activiteiten in Winterberg',
    subtitleDe: 'Unvergessliche Momente im Hochsauerland: Naturerlebnisse, Freizeitparks, Kultur, Sportattraktionen und Familienspaß.',
    subtitleNl: 'Onvergetelijke momenten in het Sauerland: natuurattracties, themaparken, cultuur, sport en gezinsplezier.',
    objectPosition: 'center 45%'
  },

  'Outdoor-Freizeitgebiet': {
    image: '/outdoor-freizeitgebiet-winterberg-header.jpg',
    imageAltDe: 'Outdoor-Freizeitgebiet in Winterberg: Spektakuläre Hängebrücke zwischen Baumkronen im dichten Wald',
    imageAltNl: 'Outdoor recreatiegebied in Winterberg: Spectaculaire hangbrug tussen de boomtoppen in het bos',
    credit: 'Foto: Sylvain Cleymans / Unsplash',
    isAiGenerated: false,
    titleDe: 'Outdoor-Freizeitgebiete & Erlebnisberge in Winterberg',
    titleNl: 'Outdoor Avonturenparken in Winterberg',
    subtitleDe: 'Abenteuerlust pur: Erlebnisberg Kappe mit Panoramabrücke, Kletterwald, Fly-Line und spannenden Pfaden in luftiger Höhe.',
    subtitleNl: 'Puur avontuur: de Erlebnisberg Kappe met panoramabrug, klimbos, Fly-Line en sensationele wandelpaden.',
    objectPosition: 'center 45%'
  },

  'Indoor-Spielplätze': {
    image: '/indoor-spielplaetze-winterberg-header.jpg',
    imageAltDe: 'Indoor-Spielplätze in Winterberg: Farbenfrohes Bällebad mit Kunststoffbällen für Kinder',
    imageAltNl: 'Binnenspeeltuinen in Winterberg: Kleurrijke ballenbak met plastic ballen voor kinderen',
    credit: 'Foto: Mustafa Fatemi / Unsplash',
    isAiGenerated: false,
    titleDe: 'Indoor-Spielplätze & Spielewelten in Winterberg',
    titleNl: 'Binnenspeeltuinen & Speelparadijzen in Winterberg',
    subtitleDe: 'Wetterunabhängiger Spielspaß: Hüpfburgen, Trampoline, Kletterlabyrinthe und Bällebäder für Kinder aller Altersgruppen.',
    subtitleNl: 'Weersonafhankelijk speelplezier: springkussens, trampolines, klimtoestellen en ballenbakken voor kinderen.',
    objectPosition: 'center 40%'
  },

  'Kino': {
    image: '/kino-winterberg-header.jpg',
    imageAltDe: 'Kino in Winterberg: Gemütliche rote Kinosessel im stimmungsvoll beleuchteten Kinosaal',
    imageAltNl: 'Bioscopen in Winterberg: Comfortabele rode bioscoopstoelen in een sfeervol verlichte zaal',
    credit: 'Foto: Felix Mooneeram / Unsplash',
    isAiGenerated: false,
    titleDe: 'Kino & Filmtheater in Winterberg',
    titleNl: 'Bioscopen & Filmhuizen in Winterberg',
    subtitleDe: 'Großes Kino im Sauerland: Aktuelle Blockbuster, Familienfilme, 3D-Kino und beste Snacks für Ihren perfekten Filmabend.',
    subtitleNl: 'Groots filmplezier in het Sauerland: actuele kaskrakers, familiefilms en popcorn voor een gezellige filmavond.',
    objectPosition: 'center center'
  },

  'Bowling': {
    image: '/bowling-winterberg-header.jpg',
    imageAltDe: 'Bowling & Kegeln in Winterberg: Bowlingkugel rollt über die Bowlingbahn auf die Pins zu',
    imageAltNl: 'Bowlingbanen in Winterberg: Bowlingbal rolt over de baan richting de pins',
    credit: 'Foto: engin akyurt / Unsplash',
    isAiGenerated: false,
    titleDe: 'Bowling & Kegelbahnen in Winterberg',
    titleNl: 'Bowling & Kegelbanen in Winterberg',
    subtitleDe: 'Treffsicherer Freizeitspaß: Moderne Bowlingcenter und traditionelle Sauerländer Kegelbahnen für Freunde, Gruppen und Familien.',
    subtitleNl: 'Gezellige strike-avonden: moderne bowlingcentra en traditionele kegelbanen voor vriendengroepen en gezinnen.',
    objectPosition: 'center 40%'
  },

  'Schwimmbäder': {
    image: '/schwimmbaeder-winterberg-header.jpg',
    imageAltDe: 'Schwimmbäder in Winterberg: Klares türkisfarbenes Wasser im modernen Hallenbad mit Startblöcken',
    imageAltNl: 'Zwembaden in Winterberg: Helder turquoise water in een modern overdekt zwembad',
    credit: 'Foto: Sandeep Vattapparambil / Unsplash',
    isAiGenerated: false,
    titleDe: 'Schwimmbäder & Erlebnisbäder in Winterberg',
    titleNl: 'Zwembaden & Recreatiebaden in Winterberg',
    subtitleDe: 'Badespaß & Wassersport: Hallenbäder, beheizte Freibäder, Wasserrutschen und Saunabereiche für sportliche Schwimmer und Genießer.',
    subtitleNl: 'Waterpret en ontspanning: overdekte zwembaden, verwarmde openluchtbaden, waterglijbanen en wellness in Winterberg.',
    objectPosition: 'center 45%'
  },

  'Sommerrodelbahnen': {
    image: '/sommerrodelbahnen-winterberg-header.jpg',
    imageAltDe: 'Sommerrodelbahnen in Winterberg: Kurvenreiche Sommerrodelbahn und Rodelstrecke inmitten grüner Berghänge',
    imageAltNl: 'Rodelbanen in Winterberg: Bochtige zomerrodelbaan en alpine coaster te midden van groene berghellingen',
    credit: 'Foto: Jan Krzempek / Unsplash',
    isAiGenerated: false,
    titleDe: 'Sommerrodelbahnen in Winterberg',
    titleNl: 'Rodelbanen & Alpine Coasters in Winterberg',
    subtitleDe: 'Rasanter Rodelspaß bei Sonnenschein: Scharfe Kurven, Tunnelfahrten, Jumps und Tempo auf den Sommerrodelbahnen am Erlebnisberg.',
    subtitleNl: 'Spannende afdalingen in de zon: scherpe bochten, tunnels en jumps op de beroemde rodelbanen van Winterberg.',
    objectPosition: 'center 45%'
  }
};

/**
 * Returns header data for a given category or its parent category if defined.
 * If dynamic overrides from DesignSettings (Firestore/localStorage) exist, they take precedence.
 */
export function getCategoryHeader(
  category: string,
  parentCategory?: string,
  dynamicHeaders?: Record<string, Partial<CategoryHeaderData>>
): CategoryHeaderData | null {
  // 1. Check dynamic overrides for category
  const dynamicDirect = dynamicHeaders?.[category];
  const dynamicParent = parentCategory ? dynamicHeaders?.[parentCategory] : undefined;

  // 2. Base static config
  const base = CATEGORY_HEADERS[category] || (parentCategory ? CATEGORY_HEADERS[parentCategory] : null);

  const override = dynamicDirect || dynamicParent;

  if (!base && !override) {
    return null;
  }

  if (base && override) {
    const hasCustomImage = Boolean(override.image && override.image.trim() !== '' && override.image !== base.image);
    const effectiveIsAi = hasCustomImage ? Boolean(override.isAiGenerated) : false;
    const effectiveCredit = (override.credit && override.credit.trim() !== '') ? override.credit.trim() : base.credit;

    return {
      ...base,
      ...override,
      image: override.image || base.image,
      imageAltDe: override.imageAltDe || base.imageAltDe,
      imageAltNl: override.imageAltNl || base.imageAltNl,
      isAiGenerated: effectiveIsAi,
      credit: effectiveCredit,
      titleDe: override.titleDe || base.titleDe,
      titleNl: override.titleNl || base.titleNl,
      subtitleDe: override.subtitleDe || base.subtitleDe,
      subtitleNl: override.subtitleNl || base.subtitleNl,
      objectPosition: override.objectPosition || base.objectPosition
    };
  }

  if (override && override.image) {
    return {
      image: override.image,
      imageAltDe: override.imageAltDe || `${category} in Winterberg`,
      imageAltNl: override.imageAltNl || `${category} in Winterberg`,
      credit: override.credit,
      isAiGenerated: !!override.isAiGenerated,
      titleDe: override.titleDe || `${category} in Winterberg`,
      titleNl: override.titleNl || `${category} in Winterberg`,
      subtitleDe: override.subtitleDe || `Entdecken Sie Unternehmen und Angebote im Bereich ${category} in Winterberg.`,
      subtitleNl: override.subtitleNl || `Ontdek bedrijven en aanbiedingen in de categorie ${category} in Winterberg.`,
      objectPosition: override.objectPosition || 'center center'
    };
  }

  return base;
}
