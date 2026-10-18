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
  // Hauptkategorie Handwerk
  'Handwerk': {
    image: '/handwerk-winterberg-header.jpg',
    imageAltDe: 'Handwerk in Winterberg: Schreinermeister bei der traditionellen Holzbearbeitung mit Hobel auf der Werkbank',
    imageAltNl: 'Ambacht in Winterberg: Meestertimmerman bij traditionele houtbewerking met schaaf op de werkbank',
    isAiGenerated: true,
    titleDe: 'Handwerk in Winterberg',
    titleNl: 'Ambacht & Vakmensen in Winterberg',
    subtitleDe: 'Zuverlässige Meisterbetriebe, Werkstätten und Fachhandwerker in Winterberg und allen 14 Ortsteilen – von Dachdeckern, Elektrikern und Schreinereien bis hin zu Bauunternehmen und KFZ-Profis.',
    subtitleNl: 'Betrouwbare vakmensen, ambachtelijke werkplaatsen en vakkundige bedrijven in Winterberg en alle 14 dorpen – van dakdekkers en elektriciens tot timmerlieden en bouwbedrijven.',
    objectPosition: 'center 40%'
  },

  // 1. Elektriker
  'Elektriker': {
    image: '/elektriker-winterberg-header.jpg',
    imageAltDe: 'Elektriker & Elektrotechnik in Winterberg: Fachhandwerker bei Elektroinstallation und Verteilerbau',
    imageAltNl: 'Elektriciens in Winterberg: Vakman bij elektrische installatie en verdeelkast',
    isAiGenerated: true,
    titleDe: 'Elektriker in Winterberg',
    titleNl: 'Elektriciens in Winterberg',
    subtitleDe: 'Zertifizierte Elektro-Fachbetriebe für Hausinstallation, Smart Home, Photovoltaik, E-Mobilität und Störungsdienste in Winterberg und Umgebung.',
    subtitleNl: 'Gecertificeerde elektrotechnische bedrijven voor huisinstallaties, domotica, zonnepanelen, laadpalen en storingsdiensten in Winterberg.',
    objectPosition: 'center center'
  },

  // 2. Heizungstechnik
  'Heizungstechnik': {
    image: '/heizungstechnik-winterberg-header.jpg',
    imageAltDe: 'Heizungstechnik & Sanitär in Winterberg: Heizungsbauer prüft moderne Wärmepumpen- und Heizungsanlage',
    imageAltNl: 'Verwarmingstechniek in Winterberg: Verwarmingstechnicus controleert moderne warmtepomp- en verwarmingsinstallatie',
    isAiGenerated: true,
    titleDe: 'Heizungstechnik in Winterberg',
    titleNl: 'Verwarmingstechniek in Winterberg',
    subtitleDe: 'Fachbetriebe für moderne Heizsysteme, Wärmepumpen, regenerative Energien, Sanitärinstallationen und Notdienste im Sauerland.',
    subtitleNl: 'Vakbedrijven voor moderne verwarmingssystemen, warmtepompen, hernieuwbare energie, sanitair en storingsdiensten in het Sauerland.',
    objectPosition: 'center center'
  },

  // 3. Dachdecker
  'Dachdecker': {
    image: '/dachdecker-winterberg-header.jpg',
    imageAltDe: 'Dachdecker in Winterberg: Dachdeckermeister in Zunftkleidung bei Schiefer- und Ziegeleindeckung mit Sauerland-Panorama',
    imageAltNl: 'Dakdekkers in Winterberg: Dakdekker bij leisteen- en pannenbedekking met uitzicht op het Sauerland',
    isAiGenerated: true,
    titleDe: 'Dachdecker in Winterberg',
    titleNl: 'Dakdekkers in Winterberg',
    subtitleDe: 'Meisterbetriebe für Schiefereindeckung, Flachdächer, Dachdämmung, Klempnerarbeiten und Sturmschaden-Reparaturen in Winterberg.',
    subtitleNl: 'Meesterbedrijven voor leisteen, platte daken, dakisolatie, zinkwerk en stormschadeherstel in Winterberg.',
    objectPosition: 'center 35%'
  },

  // 4. Schreinereien
  'Schreinereien': {
    image: '/schreinereien-winterberg-header.jpg',
    imageAltDe: 'Schreinereien & Tischlereien in Winterberg: Tischlermeister hobelt Eichenholz in der traditionellen Werkstatt',
    imageAltNl: 'Timmerlieden & Meubelmakers in Winterberg: Timmerman schaaft eikenhout in traditionele werkplaats',
    isAiGenerated: true,
    titleDe: 'Schreinereien in Winterberg',
    titleNl: 'Timmerlieden & Meubelmakers in Winterberg',
    subtitleDe: 'Individueller Möbelbau, Maßanfertigungen, Fenster, Türen und hochwertiger Innenausbau aus Meisterhand für Winterberg und das Sauerland.',
    subtitleNl: 'Maatwerk meubelen, ramen, deuren en hoogwaardige interieurbouw van vakkundige meubelmakers in Winterberg en het Sauerland.',
    objectPosition: 'center 40%'
  },

  // 5. Maler & Lackierer
  'Maler & Lackierer': {
    image: '/maler-winterberg-header.jpg',
    imageAltDe: 'Maler & Lackierer in Winterberg: Malerprofi bei hochwertiger Wandgestaltung und Farbanstrich im Innenraum',
    imageAltNl: 'Schilders in Winterberg: Professionele schilder bij wandafwerking en binnenschilderwerk',
    isAiGenerated: true,
    titleDe: 'Maler & Lackierer in Winterberg',
    titleNl: 'Schilders in Winterberg',
    subtitleDe: 'Kreative Wandgestaltung, Fassadenanstriche, Tapezierarbeiten, Lackierungen und Wärmedämmung von qualifizierten Malermeistern.',
    subtitleNl: 'Creatieve wandafwerking, gevelschilderwerk, behangwerk, lakwerk en isolatie door erkende schildersbedrijven.',
    objectPosition: 'center center'
  },

  // 6. Bauunternehmen
  'Bauunternehmen': {
    image: '/bauunternehmen-winterberg-header.jpg',
    imageAltDe: 'Bauunternehmen in Winterberg: Bauleiter mit Bauplänen auf moderner Baustelle mit Bagger und Kran',
    imageAltNl: 'Bouwbedrijven in Winterberg: Uitvoerder met bouwtekeningen op moderne bouwplaats met kraan en graafmachine',
    isAiGenerated: true,
    titleDe: 'Bauunternehmen in Winterberg',
    titleNl: 'Bouwbedrijven in Winterberg',
    subtitleDe: 'Kompetente Partner für Hoch- und Tiefbau, Neubau, Umbau, Sanierung und Erdarbeiten in Winterberg und der Region Sauerland.',
    subtitleNl: 'Betrouwbare partners voor woning- en utiliteitsbouw, grondverzet, nieuwbouw en renovatie in Winterberg en de regio Sauerland.',
    objectPosition: 'center center'
  },

  // 7. Gartenbauer (Garten- und Landschaftsbau)
  'Gartenbauer': {
    image: '/gartenbauer-winterberg-header.jpg',
    imageAltDe: 'Garten- und Landschaftsbau in Winterberg: Landschaftsgärtner bei Naturstein-Pflasterarbeiten im gepflegten Garten',
    imageAltNl: 'Tuin- en landschapsarchitectuur in Winterberg: Hovenier bij natuursteen bestrating in verzorgde tuin',
    isAiGenerated: true,
    titleDe: 'Garten- & Landschaftsbau in Winterberg',
    titleNl: 'Tuin- & Landschapsarchitectuur in Winterberg',
    subtitleDe: 'Professionelle Gartengestaltung, Pflasterarbeiten, Terrassenbau, Bepflanzung, Baumpflege und ganzjährige Gartenpflege in Winterberg.',
    subtitleNl: 'Professioneel tuinontwerp, bestrating, terrasaanleg, beplanting, boomverzorging en tuinonderhoud in Winterberg.',
    objectPosition: 'center center'
  },

  // 8. Friseur
  'Friseur': {
    image: '/friseur-winterberg-header.jpg',
    imageAltDe: 'Friseure & Salons in Winterberg: Friseurmeisterin stylt Haare im modernen Wohlfühl-Salon',
    imageAltNl: 'Kappers in Winterberg: Kapster stijlt haar in een moderne, stijlvolle kapsalon',
    isAiGenerated: true,
    titleDe: 'Friseure in Winterberg',
    titleNl: 'Kapsalons in Winterberg',
    subtitleDe: 'Top-Hairstyling, moderne Schnitte, Farb- und Strähnentechniken sowie Brautstylings in den Friseursalons von Winterberg.',
    subtitleNl: 'Top-hairstyling, moderne kapsels, kleurtechnieken en bruidskapsels bij de beste kapsalons in Winterberg.',
    objectPosition: 'center center'
  },

  // 9. Bäckerei
  'Bäckerei': {
    image: '/baeckerei-winterberg-header.jpg',
    imageAltDe: 'Bäckereien & Konditoreien in Winterberg: Frisches knuspriges Sauerteigbrot aus dem Steinofen der Traditionsbäckerei',
    imageAltNl: 'Bakkerijen in Winterberg: Vers knapperig zuurdesembrood uit de steenoven van de traditionele bakkerij',
    isAiGenerated: true,
    titleDe: 'Bäckereien in Winterberg',
    titleNl: 'Bakkerijen in Winterberg',
    subtitleDe: 'Traditionelle Handwerksbäcker und Konditoreien mit täglich frischen Broten, Brötchen, Kuchen und Sauerländer Spezialitäten.',
    subtitleNl: 'Ambachtelijke bakkerijen en banketbakkers met dagelijks vers brood, broodjes, taarten en regionale lekkernijen.',
    objectPosition: 'center center'
  },

  // 10. Fleischerei
  'Fleischerei': {
    image: '/fleischerei-winterberg-header.jpg',
    imageAltDe: 'Fleischereien & Metzgereien in Winterberg: Metzgermeister präsentiert feine Fleisch- und Wurstspezialitäten',
    imageAltNl: 'Slagerijen in Winterberg: Slager presenteert fijne vlees- en worstspecialiteiten in de toonbank',
    isAiGenerated: true,
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
    credit: 'Foto: Unsplash',
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
    isAiGenerated: true,
    titleDe: 'Baumschulen in Winterberg',
    titleNl: 'Boomkwekerijen in Winterberg',
    subtitleDe: 'Regionale Pflanzen, winterharte Gehölze, Heckenpflanzen, Formbäume und fachkundige Beratung für Ihren Garten im Sauerland.',
    subtitleNl: 'Regionale planten, winterharde bomen, haagplanten en deskundig groenadvies voor uw tuin in het Sauerland.',
    objectPosition: 'center 40%'
  },

  // 13. Wäschereien
  'Wäschereien': {
    image: '/waeschereien-winterberg-header.jpg',
    imageAltDe: 'Wäschereien & Textilpflege in Winterberg: Moderne Großwäscherei mit Edelstahl-Maschinen und schrankfertiger Wäsche',
    imageAltNl: 'Wasserijen in Winterberg: Moderne industriële wasserij met roestvrijstalen wasmachines en fris wasgoed',
    isAiGenerated: true,
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
    imageAltDe: 'Maschinenbau in Winterberg: Moderne Industriefertigung, Fördertechnik und Anlagenbau im Sauerland',
    imageAltNl: 'Machinebouw in Winterberg: Moderne industriële productie, transportsystemen en installatietechniek in het Sauerland',
    credit: 'Foto: Leisse & Söhne Winterberg',
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
    credit: 'Foto: Unsplash',
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
    credit: 'Foto: Unsplash',
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
    credit: 'Foto: Unsplash',
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
    credit: 'Foto: Unsplash',
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
    credit: 'Foto: Unsplash',
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
    credit: 'Foto: Unsplash',
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
    credit: 'Foto: Unsplash',
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
    credit: 'Foto: Unsplash',
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
    credit: 'Foto: Unsplash',
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
    credit: 'Foto: Unsplash',
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
    credit: 'Foto: Unsplash',
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
    credit: 'Foto: Unsplash',
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
    credit: 'Foto: Unsplash',
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
    credit: 'Foto: Unsplash',
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
    credit: 'Foto: Unsplash',
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
    credit: 'Foto: Unsplash',
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
    credit: 'Foto: Unsplash',
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
    credit: 'Foto: Unsplash',
    isAiGenerated: false,
    titleDe: 'Juweliere & Uhren in Winterberg',
    titleNl: 'Juweliers & Horloges in Winterberg',
    subtitleDe: 'Glänzende Schmuckstücke, Verlobungs- und Eheringe, exklusive Uhrenmarken, Gravuren und qualifizierter Uhrmacher- und Goldschmiedeservice.',
    subtitleNl: 'Schitterende sieraden, verlovings- en trouwringen, exclusieve horlogemerken, graveringen en vakkundig juwelierswerk in Winterberg.',
    objectPosition: 'center center'
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
    return {
      ...base,
      ...override,
      image: override.image || base.image,
      imageAltDe: override.imageAltDe || base.imageAltDe,
      imageAltNl: override.imageAltNl || base.imageAltNl,
      isAiGenerated: override.isAiGenerated !== undefined ? override.isAiGenerated : base.isAiGenerated,
      credit: override.credit !== undefined ? override.credit : base.credit,
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
