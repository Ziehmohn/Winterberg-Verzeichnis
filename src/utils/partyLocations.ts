import { Business } from '../types';

export type PartyLocationType = 'huette' | 'saal' | 'club' | 'hotel' | 'scheune' | 'freizeit';

export interface PartyRentalVenue {
  id: string;
  locationType: PartyLocationType;
  locationTypeLabelDe: string;
  locationTypeLabelNl: string;
  occasionsDe: string[];
  occasionsNl: string[];
  capacityDe: string;
  capacityNl: string;
  highlightsDe: string[];
  highlightsNl: string[];
}

export const PARTY_VENUES_DATA: PartyRentalVenue[] = [
  // 1. Stadthalle Oversum
  {
    id: 'stadthalle-oversum-winterberg',
    locationType: 'saal',
    locationTypeLabelDe: 'Kongress- & Festsaal',
    locationTypeLabelNl: 'Congres- & Feestzaal',
    occasionsDe: ['Hochzeit', 'Große Firmenfeier', 'Gala-Abend', 'Abiball', 'Jubiläum'],
    occasionsNl: ['Bruiloft', 'Groot bedrijfsevenement', 'Gala', 'Jubileum'],
    capacityDe: 'Bis zu 600 Personen',
    capacityNl: 'Tot 600 personen',
    highlightsDe: ['Flexible Saalgrößen', 'Professionelle Licht- & Tontechnik', 'Foyer & Barrierefrei', 'Kurparklage'],
    highlightsNl: ['Flexibele zaalgrootte', 'Moderne licht- & geluidstechniek', 'Foyer & rolstoeltoegankelijk', 'Aan het kuurpark']
  },
  // 2. Skihütte Der Brabander
  {
    id: 'brabander-skihutte',
    locationType: 'huette',
    locationTypeLabelDe: 'Skihütte & Après-Ski',
    locationTypeLabelNl: 'Skihut & Après-ski',
    occasionsDe: ['Hüttengaudi', 'Geburtstag', 'Firmenfeier', 'Weihnachtsfeier', 'Polterabend'],
    occasionsNl: ['Hutfeest', 'Verjaardag', 'Bedrijfsuitje', 'Kerstborrel'],
    capacityDe: 'Bis ca. 150 Personen',
    capacityNl: 'Tot ca. 150 personen',
    highlightsDe: ['Direkt an der Piste Herrloh', 'Gemütlicher Kamin & Uriges Holz', 'Hauseigenes Catering', 'Große Sonnenterrasse'],
    highlightsNl: ['Direct aan de skipiste Herrloh', 'Sfeervolle open haard', 'Eigen cateringmogelijkheden', 'Groot zonneterras']
  },
  // 3. Bobhaus Winterberg
  {
    id: 'bobhaus-winterberg',
    locationType: 'huette',
    locationTypeLabelDe: 'Panorama-Berggasthof',
    locationTypeLabelNl: 'Panoramisch Berghotel',
    occasionsDe: ['Hochzeit', 'Runder Geburtstag', 'Firmenjubiläum', 'Weihnachtsfeier', 'Sommerfest'],
    occasionsNl: ['Bruiloft', 'Verjaardag', 'Bedrijfsjubileum', 'Kerstfeest'],
    capacityDe: 'Bis zu 180 Personen',
    capacityNl: 'Tot 180 personen',
    highlightsDe: ['Einmaliger Panoramablick über das Sauerland', 'Auf dem Kahlen Asten / Bobbahn', 'Exklusiv buchbar', 'Erlesene Küche'],
    highlightsNl: ['Uniek uitzicht over het Sauerland', 'Bovenop de Kappe / Bobsleebaan', 'Exclusief af te huren', 'Uitstekende keuken']
  },
  // 4. Die Tenne Winterberg
  {
    id: 'tenne-winterberg',
    locationType: 'club',
    locationTypeLabelDe: 'Party-Club & Bar',
    locationTypeLabelNl: 'Feestclub & Bar',
    occasionsDe: ['Clubparty', 'Geburtstag', 'Junggesellenabschied (JGA)', 'Betriebsfeier', 'Vereinsfeier'],
    occasionsNl: ['Clubparty', 'Verjaardag', 'Vrijgezellenfeest', 'Bedrijfsfeest', 'Verenigingsfeest'],
    capacityDe: 'Bis 300 Personen (3 Ebenen)',
    capacityNl: 'Tot 300 personen (3 verdiepingen)',
    highlightsDe: ['Legendäre Kultlocation im Zentrum', 'Eigene DJs & Soundanlage', 'Flexible Raumkonzepte', 'Lange Partynächte'],
    highlightsNl: ['Legendarische feestlocatie in het centrum', 'Eigen dj-booth & geluidssysteem', 'Flexibele ruimtes', 'Feesten tot in de vroege uurtjes']
  },
  // 5. Hessenkeller Winterberg
  {
    id: '142',
    locationType: 'club',
    locationTypeLabelDe: 'Historischer Gewölbekeller',
    locationTypeLabelNl: 'Historische Gewelvenkelder',
    occasionsDe: ['Geburtstag', 'Mottoparty', 'Privatfeier', 'Weihnachtsfeier', 'Polterabend'],
    occasionsNl: ['Verjaardag', 'Themafeest', 'Besloten feest', 'Kerstborrel'],
    capacityDe: 'Bis ca. 80 Personen',
    capacityNl: 'Tot ca. 80 personen',
    highlightsDe: ['Uriges Naturstein-Gewölbe', 'Thekenanlage & Zapftechnik', 'Direkt am Waltenberg', 'Geschlossene Gesellschaft möglich'],
    highlightsNl: ['Authentieke natuurstenen gewelven', 'Eigen bar & tapinstallatie', 'Midden in het centrum', 'Besloten gezelschap mogelijk']
  },
  // 6. Borgs Scheune Züschen
  {
    id: 'borgs-scheune-zueschen',
    locationType: 'scheune',
    locationTypeLabelDe: 'Historische Fachwerkscheune',
    locationTypeLabelNl: 'Historische Vakwerkschuur',
    occasionsDe: ['Romantische Hochzeit', 'Standesamtliche Trauung', 'Runder Geburtstag', 'Jubiläum', 'Kulturabend'],
    occasionsNl: ['Romantische bruiloft', 'Huwelijksvoltrekking', 'Verjaardag', 'Jubileum', 'Culturele avond'],
    capacityDe: 'Bis ca. 100 Personen',
    capacityNl: 'Tot ca. 100 personen',
    highlightsDe: ['Denkmalgeschützte Fachwerkatmosphäre', 'Besonderer Charme für freie Trauungen', 'Küche & Thekenbereich', 'Parkplätze vor Ort'],
    highlightsNl: ['Historische monumentale sfeer', 'Populair voor huwelijksvoltrekkingen', 'Keuken & bar aanwezig', 'Parkeergelegenheid']
  },
  // 7. Köhlerhütte am Sahnehang
  {
    id: 'koehlerhuette-am-sahnehang',
    locationType: 'huette',
    locationTypeLabelDe: 'Berghütte mit Kamin',
    locationTypeLabelNl: 'Berghut met Open Haard',
    occasionsDe: ['Hüttenzauber', 'Geburtstag', 'Weihnachtsfeier', 'Familienfeier', 'Firmenevent'],
    occasionsNl: ['Huttensfeer', 'Verjaardag', 'Kerstviering', 'Familiefeest', 'Bedrijfsevent'],
    capacityDe: 'Bis ca. 120 Personen',
    capacityNl: 'Tot ca. 120 personen',
    highlightsDe: ['Romantisches Kaminfeuer', 'Direkt am Skigebiet Sahnehang', 'Höhenlage Kahler Asten', 'Regionale Spezialitäten'],
    highlightsNl: ['Gezellig haardvuur', 'Direct aan skigebied Sahnehang', 'Op de flanken van de Kahler Asten', 'Regionale gerechten']
  },
  // 8. Hochheide-Hütte Niedersfeld
  {
    id: 'hochheide-huette',
    locationType: 'huette',
    locationTypeLabelDe: 'Berghütte im Naturschutzgebiet',
    locationTypeLabelNl: 'Berghut in Natuurgebied',
    occasionsDe: ['Hüttenabend', 'Geburtstag', 'Wanderfest', 'Familienfeier', 'Sommerparty'],
    occasionsNl: ['Huttenavond', 'Verjaardag', 'Wandelfeest', 'Familiefeest', 'Zomerfeest'],
    capacityDe: 'Bis ca. 100 Personen',
    capacityNl: 'Tot ca. 100 personen',
    highlightsDe: ['Auf 800 m Höhe auf dem Neuer Hagen', 'Uriges Holz-Ambiente', 'Panoramaterrasse', 'Naturidylle pur'],
    highlightsNl: ['Op 800 m hoogte op de heide', 'Rustieke houten inrichting', 'Panoramaterras', 'Midden in de ongerepte natuur']
  },
  // 9. Hoheleyer Hütte
  {
    id: 'hoheleyer-huette',
    locationType: 'huette',
    locationTypeLabelDe: 'Berghütte an den Höhen',
    locationTypeLabelNl: 'Berghut op de Hoogte',
    occasionsDe: ['Geburtstag', 'Hüttengaudi', 'Vereinsausflug', 'Familientreffen'],
    occasionsNl: ['Verjaardag', 'Hutfeest', 'Verenigingsuitje', 'Familiedag'],
    capacityDe: 'Bis ca. 70 Personen',
    capacityNl: 'Tot ca. 70 personen',
    highlightsDe: ['Familiengeführte Gastfreundschaft', 'Terrasse mit Weitblick', 'Rustikale Gemütlichkeit'],
    highlightsNl: ['Gezellige gastvrijheid', 'Terras met prachtig uitzicht', 'Rustieke sfeer']
  },
  // 10. Alm Salettl
  {
    id: 'alm-salettl',
    locationType: 'huette',
    locationTypeLabelDe: 'Moderne Alm & Schirmbar',
    locationTypeLabelNl: 'Moderne Alm & Schirmbar',
    occasionsDe: ['Après-Ski-Party', 'Geburtstag', 'Firmenfeier', 'Hüttengaudi'],
    occasionsNl: ['Après-ski feest', 'Verjaardag', 'Bedrijfsfeest', 'Hutfeest'],
    capacityDe: 'Bis ca. 160 Personen',
    capacityNl: 'Tot ca. 160 personen',
    highlightsDe: ['Zentrale Lage am Skilift Bremberg', 'Modernes alpines Hüttendesign', 'Große Schirmbar', 'Perfekt für Events'],
    highlightsNl: ['Centraal aan skilift Bremberg', 'Modern alpine design', 'Grote schirmbar', 'Ideaal voor groepen']
  },
  // 11. Bei Möppi
  {
    id: 'bei-moppi',
    locationType: 'huette',
    locationTypeLabelDe: 'Kult-Skihütte',
    locationTypeLabelNl: 'Iconische Skihut',
    occasionsDe: ['Hüttenparty', 'Geburtstag', 'Firmenfeier', 'Après-Ski'],
    occasionsNl: ['Hutfeest', 'Verjaardag', 'Bedrijfsfeest', 'Après-ski'],
    capacityDe: 'Bis ca. 150 Personen',
    capacityNl: 'Tot ca. 150 personen',
    highlightsDe: ['Legendäre Party-Atmosphäre am Poppenberg', 'Außen- und Innenbereich', 'Stimmung garantiert'],
    highlightsNl: ['Legendarische feestsfeer aan de Poppenberg', 'Binnen- en buitengedeelte', 'Gegarandeerde sfeer']
  },
  // 12. Quick's Skihütte
  {
    id: 'quicks-skihutte',
    locationType: 'huette',
    locationTypeLabelDe: 'Skihütte am Herrloh',
    locationTypeLabelNl: 'Skihut aan de Herrloh',
    occasionsDe: ['Hüttenabend', 'Geburtstag', 'Firmenevent', 'Skiparty'],
    occasionsNl: ['Huttenavond', 'Verjaardag', 'Bedrijfsevent', 'Skifeest'],
    capacityDe: 'Bis ca. 120 Personen',
    capacityNl: 'Tot ca. 120 personen',
    highlightsDe: ['Beste Pistenlage', 'Gemütlicher Gastraum', 'Sonnenterrasse'],
    highlightsNl: ['Toplocatie aan de piste', 'Gezellige zaal', 'Zonneterras']
  },
  // 13. Skihütte Rauher Busch
  {
    id: 'rauher-busch',
    locationType: 'huette',
    locationTypeLabelDe: 'Skihütte & Feststube',
    locationTypeLabelNl: 'Skihut & Feestzaal',
    occasionsDe: ['Geburtstag', 'Vereinsfeier', 'Firmenfeier', 'Hüttenzauber'],
    occasionsNl: ['Verjaardag', 'Verenigingsfeest', 'Bedrijfsuitje'],
    capacityDe: 'Bis ca. 100 Personen',
    capacityNl: 'Tot ca. 100 personen',
    highlightsDe: ['Mitten im Skikarussell', 'Direkte Zufahrt & Parkplatz', 'Uriges Ambiente'],
    highlightsNl: ['Midden in de skicarrousel', 'Goede bereikbaarheid & parkeren', 'Authentieke sfeer']
  },
  // 14. Bremberg Klause
  {
    id: 'bremberg-klause',
    locationType: 'huette',
    locationTypeLabelDe: 'Traditionelle Skihütte',
    locationTypeLabelNl: 'Traditionele Skihut',
    occasionsDe: ['Hüttengaudi', 'Geburtstag', 'Weihnachtsfeier', 'Wandergruppen'],
    occasionsNl: ['Hutfeest', 'Verjaardag', 'Kerstfeest', 'Wandelgroepen'],
    capacityDe: 'Bis ca. 90 Personen',
    capacityNl: 'Tot ca. 90 personen',
    highlightsDe: ['Ruhig gelegen am Bremberg', 'Gemütlicher Holzofen', 'Deftige Sauerländer Küche'],
    highlightsNl: ['Rustig gelegen aan de Bremberg', 'Gezellige houtkachel', 'Traditionele streekgerechten']
  },
  // 15. Schirmbar Postwiese
  {
    id: 'schirmbar-postwiese',
    locationType: 'huette',
    locationTypeLabelDe: 'Schirmbar & Hüttenlocation',
    locationTypeLabelNl: 'Schirmbar & Evenementenlocatie',
    occasionsDe: ['Après-Ski-Party', 'Firmen-Event', 'Geburtstag', 'Polterabend'],
    occasionsNl: ['Après-ski', 'Bedrijfsevenement', 'Verjaardag'],
    capacityDe: 'Bis ca. 120 Personen',
    capacityNl: 'Tot ca. 120 personen',
    highlightsDe: ['In Neuastenberg am Skigebiet Postwiese', 'Beheizte Schirmbar', 'Stimmungsvolle Partybeleuchtung'],
    highlightsNl: ['In Neuastenberg aan de Postwiese', 'Verwarmde schirmbar', 'Sfeervolle verlichting']
  },
  // 16. Bowlhaus Winterberg
  {
    id: 'bowlhaus-winterberg',
    locationType: 'freizeit',
    locationTypeLabelDe: 'Bowling & Event-Lounge',
    locationTypeLabelNl: 'Bowling & Evenementenlounge',
    occasionsDe: ['Geburtstag', 'Firmenfeier', 'Weihnachtsfeier', 'Junggesellenabschied (JGA)', 'Kindergeburtstag'],
    occasionsNl: ['Verjaardag', 'Bedrijfsuitje', 'Kerstborrel', 'Vrijgezellenfeest', 'Kinderfeest'],
    capacityDe: 'Bis zu 150 Personen',
    capacityNl: 'Tot 150 personen',
    highlightsDe: ['Moderne Bowlingbahnen mit Schwarzlicht', 'Cocktailbar & Lounge', 'Fingerfood & Menüs', 'Kombination aus Sport & Party'],
    highlightsNl: ['Moderne bowlingbanen met glow-in-the-dark', 'Cocktailbar & lounge', 'Lekkere hapjes & buffet', 'Sportief en feestelijk']
  },
  // 17. Dorf Alm Winterberg
  {
    id: '107',
    locationType: 'huette',
    locationTypeLabelDe: 'Alpenländisches Restaurant & Alm',
    locationTypeLabelNl: 'Alpenrestaurant & Alm',
    occasionsDe: ['Geburtstag', 'Firmenfeier', 'Familienfeier', 'Weihnachtsfeier', 'Jubiläum'],
    occasionsNl: ['Verjaardag', 'Bedrijfsuitje', 'Familiefeest', 'Kerstdiner'],
    capacityDe: 'Bis ca. 200 Personen',
    capacityNl: 'Tot ca. 200 personen',
    highlightsDe: ['Original Tiroler Alm-Flair', 'Mehrere urige Stuben', 'Große Bar & Biergarten', 'Zentral im Ort'],
    highlightsNl: ['Originele alpensfeer', 'Meerdere gezellige stüberl', 'Grote bar & terras', 'In het centrum']
  },
  // 18. Markt Alm Winterberg
  {
    id: 'markt-alm-winterberg',
    locationType: 'huette',
    locationTypeLabelDe: 'Alm im Stadtzentrum',
    locationTypeLabelNl: 'Alm in het Stadscentrum',
    occasionsDe: ['Geburtstag', 'Kleine Feiern', 'Weihnachtsfeier', 'Stammtisch'],
    occasionsNl: ['Verjaardag', 'Klein gezelschap', 'Kerstborrel'],
    capacityDe: 'Bis ca. 100 Personen',
    capacityNl: 'Tot ca. 100 personen',
    highlightsDe: ['Zentrale Lage am Markt', 'Uriges Holz-Ambiente', 'Bier vom Fass & Cocktails'],
    highlightsNl: ['Centrale ligging aan het marktplein', 'Houtrijke ambiance', 'Gezellige bar']
  },
  // 19. Blackwater Irish Pub
  {
    id: '144',
    locationType: 'club',
    locationTypeLabelDe: 'Irish Pub & Partybar',
    locationTypeLabelNl: 'Ierse Pub & Feestcafé',
    occasionsDe: ['Party', 'Geburtstag', 'Junggesellenabschied (JGA)', 'Pub-Abend', 'Vereinsfeier'],
    occasionsNl: ['Feest', 'Verjaardag', 'Vrijgezellenfeest', 'Pubavond'],
    capacityDe: 'Bis ca. 90 Personen',
    capacityNl: 'Tot ca. 90 personen',
    highlightsDe: ['Echtes Irish-Pub-Feeling', 'Guinness & Cider vom Fass', 'Livemusik-Bühne', 'Zentral gelegen'],
    highlightsNl: ['Authentieke Ierse pubsfeer', 'Guinness & cider van de tap', 'Livemuziek', 'Centraal in Winterberg']
  },
  // 20. Indoor Arena Full-One Lasertag
  {
    id: '130',
    locationType: 'freizeit',
    locationTypeLabelDe: 'Lasertag & Action-Arena',
    locationTypeLabelNl: 'Lasergamen & Actie-Arena',
    occasionsDe: ['Action-Geburtstag', 'Junggesellenabschied (JGA)', 'Teamevent & Firmen-Challenge', 'Jugendfeiern'],
    occasionsNl: ['Actieve verjaardag', 'Vrijgezellenfeest', 'Teambuilding', 'Jeugdfeest'],
    capacityDe: 'Bis ca. 80 Personen',
    capacityNl: 'Tot ca. 80 personen',
    highlightsDe: ['Große Lasertag-Arena', 'Eigener Partyraum mit Tischen', 'Action & Spaß für jede Generation'],
    highlightsNl: ['Grote lasergame-arena', 'Eigen feestruimte met tafels', 'Actie & plezier voor iedereen']
  },
  // 21. Hotel Oversum Ski & Vital Resort
  {
    id: 'hotel-oversum-winterberg',
    locationType: 'hotel',
    locationTypeLabelDe: 'Wellness-Resort & Festsäle',
    locationTypeLabelNl: 'Luxe Resort & Feestzalen',
    occasionsDe: ['Traumhochzeit', 'Exklusives Firmenevent', 'Gala & Bankett', 'Jubiläumsfeier'],
    occasionsNl: ['Droombruiloft', 'Exclusief bedrijfsevenement', 'Gala & banket', 'Jubileum'],
    capacityDe: 'Bis ca. 250 Personen',
    capacityNl: 'Tot ca. 250 personen',
    highlightsDe: ['All-in-One: Feiern & Übernachten', 'Erstklassige Kulinarik', 'Großzügige Spa-Landschaft', 'Kurpark-Panoramalage'],
    highlightsNl: ['Alles-in-één: feesten & overnachten', 'Culinaire verwennerij', 'Grote wellnessruimte', 'Uitzicht over het kuurpark']
  },
  // 22. Dorint Resort Winterberg Sauerland
  {
    id: 'dorint-resort-winterberg-neuastenberg',
    locationType: 'hotel',
    locationTypeLabelDe: 'Ferienresort & Bankettsäle',
    locationTypeLabelNl: 'Resort & Banketzalen',
    occasionsDe: ['Große Hochzeit', 'Firmenevent & Tagung', 'Weihnachtsfeier', 'Großes Jubiläum'],
    occasionsNl: ['Grote bruiloft', 'Bedrijfsevenement', 'Kerstfeest', 'Groot jubileum'],
    capacityDe: 'Bis ca. 200 Personen',
    capacityNl: 'Tot ca. 200 personen',
    highlightsDe: ['Vielfältige Veranstaltungsräume', 'Übernachtung für alle Gäste vor Ort', 'Ruhige Hanglage in Neuastenberg'],
    highlightsNl: ['Diverse zalen', 'Overnachten voor alle gasten', 'Prachtige ligging in Neuastenberg']
  },
  // 23. AVITAL Resort Winterberg
  {
    id: 'avital-resort-winterberg',
    locationType: 'hotel',
    locationTypeLabelDe: 'Hotelresort & Gesellschaftsräume',
    locationTypeLabelNl: 'Hotelresort & Feestzalen',
    occasionsDe: ['Hochzeit', 'Geburtstag', 'Familienfeier', 'Betriebsfeier', 'Weihnachtsfeier'],
    occasionsNl: ['Bruiloft', 'Verjaardag', 'Familiefeest', 'Bedrijfsborrel'],
    capacityDe: 'Bis ca. 120 Personen',
    capacityNl: 'Tot ca. 120 personen',
    highlightsDe: ['Stilvolle Restaurantsälen', 'Hotelzimmer & Apartments direkt dabei', 'Ruhige Waldrandlage'],
    highlightsNl: ['Stijlvolle restaurants en zalen', 'Hotelkamers & appartementen ter plaatse', 'Aan de rand van het bos']
  },
  // 24. Der Schöne Asten
  {
    id: 'familien-resort-schoener-asten-altastenberg',
    locationType: 'hotel',
    locationTypeLabelDe: 'Resort & Tagungszentrum',
    locationTypeLabelNl: 'Resort & Conferentiecentrum',
    occasionsDe: ['Familienfeier', 'Hochzeit', 'Geburtstag', 'Vereinsfest', 'Weihnachtsfeier'],
    occasionsNl: ['Familiefeest', 'Bruiloft', 'Verjaardag', 'Verenigingsfeest'],
    capacityDe: 'Bis ca. 150 Personen',
    capacityNl: 'Tot ca. 150 personen',
    highlightsDe: ['Räumlichkeiten für Festgesellschaften', 'Übernachtungskapazitäten für große Gruppen', 'Altastenberg Berglage'],
    highlightsNl: ['Ruimtes voor grote feesten', 'Veel overnachtingsplekken', 'Mooie berglocatie in Altastenberg']
  },
  // 25. Schützenhalle Winterberg (St. Georg)
  {
    id: 'schuetzenhalle-winterberg',
    locationType: 'saal',
    locationTypeLabelDe: 'Große Festhalle & Saal',
    locationTypeLabelNl: 'Grote Feestzaal & Schuttershal',
    occasionsDe: ['Große Hochzeit (100–500 Gäste)', 'Polterabend', 'Runder Geburtstag', 'Betriebsfest', 'Vereinsjubiläum'],
    occasionsNl: ['Grote bruiloft (100-500 gasten)', 'Verjaardag', 'Bedrijfsfeest', 'Jubileum'],
    capacityDe: 'Bis zu 600 Personen',
    capacityNl: 'Tot 600 personen',
    highlightsDe: ['Großer Saal mit Parkett & Bühne', 'Großküche & Ausschanktheken', 'Foyer & Barrierefrei', 'Großer Parkplatz'],
    highlightsNl: ['Grote zaal met parket & podium', 'Grote keuken & ruime toog', 'Foyer & rolstoeltoegankelijk', 'Ruime parking']
  },
  // 26. Schützenhalle Niedersfeld
  {
    id: 'schuetzenhalle-niedersfeld',
    locationType: 'saal',
    locationTypeLabelDe: 'Festhalle & Feiersaal',
    locationTypeLabelNl: 'Feestzaal & Evenementenhal',
    occasionsDe: ['Hochzeit', 'Runder Geburtstag', 'Polterabend', 'Betriebsfeier', 'Dorffest'],
    occasionsNl: ['Bruiloft', 'Verjaardag', 'Bedrijfsfeest', 'Dorpsfeest'],
    capacityDe: 'Bis zu 350 Personen',
    capacityNl: 'Tot 350 personen',
    highlightsDe: ['Hauptsaal & separater Speiseraum/Sektbar', 'Komplette Thekentechnik', 'Küche für Caterer', 'Zentrale Dorflage'],
    highlightsNl: ['Hoofdzaal & aparte eetzaal/wijnbar', 'Complete tapinstallatie', 'Keuken voor cateraars', 'Goede bereikbaarheid']
  },
  // 27. Schützenhalle Züschen
  {
    id: 'schuetzenhalle-zueschen',
    locationType: 'saal',
    locationTypeLabelDe: 'Traditionelle Festhalle',
    locationTypeLabelNl: 'Traditionele Feestzaal',
    occasionsDe: ['Hochzeit', 'Geburtstag', 'Familienfeier', 'Polterabend', 'Vereinsfest'],
    occasionsNl: ['Bruiloft', 'Verjaardag', 'Familiefeest', 'Verenigingsfeest'],
    capacityDe: 'Bis ca. 300 Personen',
    capacityNl: 'Tot ca. 300 personen',
    highlightsDe: ['Großer Festsaal & Gaststube', 'Große Theke & Cateringküche', 'Idyllische Lage im Nuhnetal'],
    highlightsNl: ['Grote feestzaal & gezellig praathuis', 'Ruime bar & cateringkeuken', 'Mooie ligging in het dal']
  },
  // 28. Schützenhalle Siedlinghausen
  {
    id: 'schuetzenhalle-siedlinghausen',
    locationType: 'saal',
    locationTypeLabelDe: 'Große Dorffesthalle',
    locationTypeLabelNl: 'Grote Dorpsfeestzaal',
    occasionsDe: ['Hochzeit', 'Betriebsfest', 'Geburtstag', 'Polterabend', 'Jubiläum'],
    occasionsNl: ['Bruiloft', 'Bedrijfsfeest', 'Verjaardag', 'Groot feest'],
    capacityDe: 'Bis zu 400 Personen',
    capacityNl: 'Tot 400 personen',
    highlightsDe: ['Haupthalle mit großer Bühne', 'Gemütlicher Speisesaal', 'Moderne Zapfanlage', 'Große Küche'],
    highlightsNl: ['Grote zaal met ruim podium', 'Gezellige eetzaal', 'Moderne biertap', 'Volledige keuken']
  },
  // 29. Dorfgemeinschaftshalle Elkeringhausen
  {
    id: 'dorfgemeinschaftshalle-elkeringhausen',
    locationType: 'saal',
    locationTypeLabelDe: 'Dorfgemeinschaftshalle im Grünen',
    locationTypeLabelNl: 'Dorpshuis in het Groen',
    occasionsDe: ['Geburtstag', 'Familienfeier', 'Kleine Hochzeit', 'Sommerfest', 'Vereinstreffen'],
    occasionsNl: ['Verjaardag', 'Familiefeest', 'Intieme bruiloft', 'Zomerfeest'],
    capacityDe: 'Bis ca. 150 Personen',
    capacityNl: 'Tot ca. 150 personen',
    highlightsDe: ['Wunderschöne Waldrandlage', 'Gemütlicher Saal mit Theke', 'Küche & Außengelände', 'Ideal für private Feste'],
    highlightsNl: ['Prachtige bosrandlocatie', 'Gezellige zaal met toog', 'Keuken & buitenterrein', 'Perfect voor besloten feesten']
  },
  // 30. Schützenhalle Altastenberg
  {
    id: 'schuetzenhalle-altastenberg',
    locationType: 'saal',
    locationTypeLabelDe: 'Festhalle im Höhendorf',
    locationTypeLabelNl: 'Feestzaal op de Hoogte',
    occasionsDe: ['Hochzeit', 'Hüttengaudi', 'Geburtstag', 'Vereinsfeier'],
    occasionsNl: ['Bruiloft', 'Hutfeest', 'Verjaardag', 'Verenigingsfeest'],
    capacityDe: 'Bis ca. 200 Personen',
    capacityNl: 'Tot ca. 200 personen',
    highlightsDe: ['Höchstgelegenes Höhendorf NRWs (800 m)', 'Rustikaler Sauerländer Charme', 'Theke & Küche'],
    highlightsNl: ['Hoogst gelegen dorp in NRW (800 m)', 'Rustieke Sauerlandse charme', 'Bar & keuken']
  },
  // 31. Schützenhalle Grönebach
  {
    id: 'schuetzenhalle-groenebach',
    locationType: 'saal',
    locationTypeLabelDe: 'Moderne Dorffesthalle',
    locationTypeLabelNl: 'Moderne Feestzaal',
    occasionsDe: ['Hochzeit', 'Geburtstag', 'Polterabend', 'Familienfeier'],
    occasionsNl: ['Bruiloft', 'Verjaardag', 'Familiefeest'],
    capacityDe: 'Bis ca. 250 Personen',
    capacityNl: 'Tot ca. 250 personen',
    highlightsDe: ['Helle Festhalle mit Theke', 'Moderne Sanitäranlagen & Küche', 'Gute Parkmöglichkeiten'],
    highlightsNl: ['Lichte feestzaal met bar', 'Moderne voorzieningen & keuken', 'Goede parkeerplekken']
  },
  // 32. Schützenhalle Silbach
  {
    id: 'schuetzenhalle-silbach',
    locationType: 'saal',
    locationTypeLabelDe: 'Festhalle im Bergdorf',
    locationTypeLabelNl: 'Feestzaal in Bergdorp',
    occasionsDe: ['Geburtstag', 'Hochzeit', 'Polterabend', 'Vereinsfest'],
    occasionsNl: ['Verjaardag', 'Bruiloft', 'Verenigingsfeest'],
    capacityDe: 'Bis ca. 250 Personen',
    capacityNl: 'Tot ca. 250 personen',
    highlightsDe: ['Idyllische Hanglage', 'Bühne & Schankbereich', 'Gepflegte Räumlichkeiten'],
    highlightsNl: ['Idyllische berghelling', 'Podium & bar', 'Verzorgde accommodatie']
  }
];

export const PARTY_VENUES_MAP: Record<string, PartyRentalVenue> = PARTY_VENUES_DATA.reduce((acc, v) => {
  acc[v.id] = v;
  return acc;
}, {} as Record<string, PartyRentalVenue>);

export function getPartyVenueInfo(id: string): PartyRentalVenue | undefined {
  return PARTY_VENUES_MAP[id];
}

export function isPartyLocation(bus: Business): boolean {
  if (PARTY_VENUES_MAP[bus.id]) return true;
  if (bus.isPartyLocation) return true;
  if (bus.subcategory === 'Skihütten') return true;
  if (bus.subcategory === 'Tagungszentren') return true;
  return false;
}
