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
