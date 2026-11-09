import { Business } from '../types';

export type PartyLocationType = 'huette' | 'saal' | 'scheune' | 'lounge' | 'resort';
export type EventLocationType = PartyLocationType;

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
  verifiedSourceUrl: string;
  sourceDescription: string;
}
export type EventRentalVenue = PartyRentalVenue;

export const PARTY_VENUES_DATA: PartyRentalVenue[] = [
  // 1. Schneewittchenhaus Winterberg
  {
    id: 'schneewittchenhaus-winterberg',
    locationType: 'huette',
    locationTypeLabelDe: 'Moderne Panorama-Alm & Premium-Eventlocation',
    locationTypeLabelNl: 'Moderne Panoramalocatie & Premium Eventlocatie',
    occasionsDe: ['Traumhochzeit & Freie Trauung', 'Firmen-Incentive & Gala', 'Runder Geburtstag', 'Weihnachtsfeier', 'Sommerfest'],
    occasionsNl: ['Droombruiloft met ceremonie', 'Bedrijfsincentive & Gala', 'Verjaardag', 'Kerstfeest', 'Zomerfeest'],
    capacityDe: 'Bis zu 200 Personen',
    capacityNl: 'Tot ca. 200 personen',
    highlightsDe: [
      'Traumhafte Kulisse für Hochzeiten mit weitem Bergblick',
      'Große Panorama-Sonnenterrasse direkt an der Sesselbahn',
      'Erstklassige Gastronomie & Full-Service Eventorganisation',
      'Moderne alpine Architektur für besondere Ansprüche'
    ],
    highlightsNl: [
      'Schitterend decor voor bruiloften met bergpanorama',
      'Groot panoramisch zonneterras aan de skipiste',
      'Catering van hoog niveau & full-service organisatie',
      'Moderne alpine architectuur voor exclusieve events'
    ],
    verifiedSourceUrl: 'https://www.schneewittchenhaus.de/feiern',
    sourceDescription: 'Offizielle Event-Seite für Hochzeiten, Geburtstage & Firmen-Incentives'
  },
  // 2. Bobhaus Winterberg (Offizieller Trauort)
  {
    id: 'bobhaus-winterberg',
    locationType: 'huette',
    locationTypeLabelDe: 'Panorama-Berggasthof & Offizieller Trauort',
    locationTypeLabelNl: 'Panoramisch Berghotel & Trouwlocatie',
    occasionsDe: ['Standesamtliche Trauung', 'Traumhochzeit', 'Firmenjubiläum & Incentive', 'Runder Geburtstag', 'Familienfeier'],
    occasionsNl: ['Huwelijksvoltrekking', 'Bruiloft', 'Bedrijfsjubileum', 'Verjaardag', 'Familiefeest'],
    capacityDe: 'Bis zu 180 Personen',
    capacityNl: 'Tot 180 personen',
    highlightsDe: [
      'Offizielle Standesamts-Außenstelle der Stadt Winterberg',
      'Spektakulärer Panoramablick vom Kahlen Asten / Kappe',
      'Wintergarten & Restaurant exklusiv buchbar',
      'Erlesene regionale Kulinarik & feierlicher Service'
    ],
    highlightsNl: [
      'Officiële trouwlocatie van de gemeente Winterberg',
      'Spectaculair panorama vanaf de Kappe en Kahler Asten',
      'Wintertuin & restaurant exclusief af te huren',
      'Uitstekende regionale keuken en feestsfeer'
    ],
    verifiedSourceUrl: 'https://www.bobhaus.de',
    sourceDescription: 'Offizielle Trauungsaußenstelle Standesamt Winterberg & Hochzeitslocation'
  },
  // 3. Borgs Scheune Züschen (Offizieller Trauort)
  {
    id: 'borgs-scheune-zueschen',
    locationType: 'scheune',
    locationTypeLabelDe: 'Historische Fachwerkscheune & Trauort',
    locationTypeLabelNl: 'Historische Vakwerkschuur & Trouwlocatie',
    occasionsDe: ['Standesamtliche Trauung', 'Romantische Landhochzeit', 'Runder Geburtstag', 'Kultur- & Firmenevent', 'Jubiläum'],
    occasionsNl: ['Huwelijksvoltrekking', 'Romantische bruiloft', 'Verjaardag', 'Cultuur- & bedrijfsevent', 'Jubileum'],
    capacityDe: 'Bis ca. 100 Personen',
    capacityNl: 'Tot ca. 100 personen',
    highlightsDe: [
      'Offizieller historischer Trauort des Standesamtes Winterberg',
      'Denkmalgeschützte Fachwerkatmosphäre von 1791',
      'Voll ausgestattete Küche & Thekenbereich vorhanden',
      'Unverwechselbarer historischer Charme für Trauungen & Feiern'
    ],
    highlightsNl: [
      'Officiële historische trouwlocatie van gemeente Winterberg',
      'Monumentale vakwerksfeer uit 1791',
      'Keuken & complete bar aanwezig',
      'Bijzondere, authentieke sfeer voor trouwerijen'
    ],
    verifiedSourceUrl: 'https://www.borgs-scheune.de',
    sourceDescription: 'Offizieller Trauort Stadt Winterberg & historische Eventtenne'
  },
  // 4. Stadthalle Oversum
  {
    id: 'stadthalle-oversum-winterberg',
    locationType: 'saal',
    locationTypeLabelDe: 'Kongresszentrum & Großer Festsaal',
    locationTypeLabelNl: 'Congrescentrum & Grote Feestzaal',
    occasionsDe: ['Große Traumhochzeit', 'Firmenjubiläum & Gala', 'Tagung & Kongress', 'Vereinsfest', 'Abiball'],
    occasionsNl: ['Grote droombruiloft', 'Bedrijfsjubileum & Gala', 'Congres & conferentie', 'Verenigingsfeest', 'Gala'],
    capacityDe: 'Bis zu 500 Personen',
    capacityNl: 'Tot 500 personen',
    highlightsDe: [
      'Flexibler Festsaal mit Bühne & separater Red Lounge',
      'Professionelle Tagungs-, Licht- & Tontechnik',
      'Barrierefrei mit Foyer direkt am Kurpark Winterberg',
      'Vollständige Hochzeitspauschalen & Premium-Catering'
    ],
    highlightsNl: [
      'Flexibele feestzaal met podium & exclusieve Red Lounge',
      'Professionele congres-, licht- & geluidstechniek',
      'Toegankelijk met foyer direct aan het kuurpark',
      'Bruiloftsarrangementen en top-catering'
    ],
    verifiedSourceUrl: 'https://www.oversum-vitalresort.de/feste-feiern/',
    sourceDescription: 'Offizielle Feste- & Feiern-Broschüre und Veranstaltungszentrum Winterberg'
  },
  // 5. Gästehaus Winterberg Grönebach
  {
    id: 'gaestehaus-winterberg-groenebach',
    locationType: 'saal',
    locationTypeLabelDe: 'Eventlocation, Festsaal & Tagungshaus',
    locationTypeLabelNl: 'Evenementenlocatie, Feestzaal & Seminariehuis',
    occasionsDe: ['Hochzeit mit Trauung in der Kapelle', 'Große Familienfeier', 'Firmen-Offsite & Seminar', 'Vereinsfreizeit', 'Runder Geburtstag'],
    occasionsNl: ['Bruiloft met kerkelijke inzegening', 'Grote familiebijeenkomst', 'Bedrijfsoffsite & seminar', 'Verenigingsreis', 'Verjaardag'],
    capacityDe: 'Bis zu 130 Personen (135 Betten im Haus)',
    capacityNl: 'Tot 130 personen (135 bedden ter plaatse)',
    highlightsDe: [
      'Hauseigene Kapelle für Trauungen & Segnungen',
      'Großer Festsaal & 125 m² Profi-Großküche',
      '135 Betten Übernachtungskapazität direkt im Haus',
      'Großzügiges Außengelände im Grünen für Freie Trauungen'
    ],
    highlightsNl: [
      'Eigen kapel voor huwelijksvoltrekkingen & ceremonies',
      'Grote feestzaal & 125 m² professionele grootkeuken',
      '135 slaapplaatsen ter plaatse in het gebouw',
      'Royaal groen buitenterrein voor vrije ceremonies'
    ],
    verifiedSourceUrl: 'https://www.gaestehaus-winterberg.de/die-eventlocation',
    sourceDescription: 'Offizielle Eventlocation-Präsentation mit Festsaal & Kapelle'
  },
  // 6. VELTINS-EisArena Lounge
  {
    id: 'veltins-eisarena',
    locationType: 'lounge',
    locationTypeLabelDe: 'Exklusive Panorama-Lounge an der Bobbahn',
    locationTypeLabelNl: 'Exclusieve Panoramalounge aan de Bobsleebaan',
    occasionsDe: ['Firmen-Event & Tagung', 'Teambuilding & Incentive', 'Jubiläum & Kick-Off', 'Exklusiver Stehempfang', 'Weihnachtsfeier'],
    occasionsNl: ['Bedrijfsevenement & Congres', 'Teambuilding & Incentive', 'Jubileum & Kick-off', 'Exclusieve borrel', 'Kerstevent'],
    capacityDe: 'Bis zu 120 Personen',
    capacityNl: 'Tot 120 personen',
    highlightsDe: [
      'Atemberaubender Blick auf die weltberühmte Bob- und Skeletonbahn',
      'Modernste Konferenz- & Präsentationstechnik mit Lounge-Möbeln',
      'Kombinierbar mit Taxibob-Fahrten & exklusiven Bahnbesichtigungen',
      'Einzigartiges Weltcup-Ambiente für anspruchsvolle Firmenveranstaltungen'
    ],
    highlightsNl: [
      'Adembenemend zicht op de wereldberoemde bobsleebaan',
      'Moderne conferentietechniek en stijlvolle lounge-inrichting',
      'Te combineren met taxibob-ritten en rondleidingen',
      'Unieke wereldbeker-ambiance voor zakelijke events'
    ],
    verifiedSourceUrl: 'https://www.veltins-eisarena.de',
    sourceDescription: 'Offizielle Vermietung der VELTINS-EisArena LOUNGE für Tagungen, Firmenfeiern & Events'
  },
  // 7. Dorint Resort Winterberg Neuastenberg
  {
    id: 'dorint-resort-winterberg-neuastenberg',
    locationType: 'resort',
    locationTypeLabelDe: '4-Sterne Event- & Tagungsresort',
    locationTypeLabelNl: '4-Sterren Event- & Congresresort',
    occasionsDe: ['Firmentagung & Konferenz', 'Hochzeitsfeier', 'Runder Geburtstag', 'Firmenjubiläum', 'Teamevent & Incentive'],
    occasionsNl: ['Bedrijfscongres & vergadering', 'Bruiloft', 'Verjaardag', 'Bedrijfsjubileum', 'Teambuilding'],
    capacityDe: 'Bis zu 150 Personen',
    capacityNl: 'Tot 150 personen',
    highlightsDe: [
      'Mehrere variable Tagungs- und Banketträume mit moderner Technik',
      'Direkte Lage am Südhang der Postwiese Neuastenberg',
      'Übernachtung im 4-Sterne-Resort mit Badelandschaft & Saunawelt',
      'Komplettes Rahmenprogramm mit Gastronomie & Kartbahn'
    ],
    highlightsNl: [
      'Meerdere flexibele vergader- en banketzalen',
      'Direct aan het skigebied Postwiese in Neuastenberg',
      'Overnachten in 4-sterrenresort met wellness en zwembad',
      'Compleet activiteitenprogramma & gastronomie'
    ],
    verifiedSourceUrl: 'https://hotel-sauerland-winterberg.dorint.com',
    sourceDescription: 'Offizielles Tagungs- und Bankett-Angebot des Dorint Resorts Sauerland'
  },
  // 8. Köhlerhütte am Sahnehang
  {
    id: 'koehlerhuette-am-sahnehang',
    locationType: 'huette',
    locationTypeLabelDe: 'Romantische Kamin-Berghütte',
    locationTypeLabelNl: 'Romantische Berghut met Open Haard',
    occasionsDe: ['Traumhochzeit & Polterabend', 'Weihnachtsfeier', 'Runder Geburtstag', 'Firmenevent', 'Hüttenzauber'],
    occasionsNl: ['Droombruiloft', 'Kerstfeest', 'Verjaardag', 'Bedrijfsevent', 'Huttensfeer'],
    capacityDe: 'Bis ca. 120 Personen',
    capacityNl: 'Tot ca. 120 personen',
    highlightsDe: [
      'Romantisches Kaminfeuer & authentisches Altholz-Ambiente',
      'Auf über 830 m Höhe direkt am schneesicheren Sahnehang',
      'Exklusiv für geschlossene Gesellschaften buchbar',
      'Herzhafte Sauerländer Spezialitäten & stimmungsvolle Buffets'
    ],
    highlightsNl: [
      'Gezellig knapperend haardvuur & authentiek houten interieur',
      'Op ruim 830 m hoogte direct aan de Sahnehang',
      'Exclusief te boeken voor besloten gezelschappen',
      'Regionale gerechten & sfeervolle buffetten'
    ],
    verifiedSourceUrl: 'https://sahnehang.de/events/ihr-event',
    sourceDescription: 'Offizielle Event-Seite für Feiern, Hochzeiten & Hüttenevents'
  },
  // 9. Bei Möppi
  {
    id: 'bei-moppi',
    locationType: 'huette',
    locationTypeLabelDe: 'Kult-Almhütte & Eventlocation',
    locationTypeLabelNl: 'Iconische Bergalm & Evenementenlocatie',
    occasionsDe: ['Firmenfeier & Sommerfest', 'Runder Geburtstag', 'Exklusive Hüttenparty', 'Hochzeits-Afterparty', 'Vereinsfeier'],
    occasionsNl: ['Bedrijfsfeest & Zomerevent', 'Verjaardag', 'Exclusief hutfeest', 'Huwelijksfeest', 'Verenigingsfeest'],
    capacityDe: 'Bis ca. 150 Personen',
    capacityNl: 'Tot ca. 150 personen',
    highlightsDe: [
      'Legendäre Hütten-Atmosphäre direkt am Poppenberg',
      'Direkt an der Piste mit großer Panorama-Sonnenterrasse',
      'Exklusiv für Firmen & private Gruppen mietbar',
      'Perfekt für Firmenjubiläen, Sommerfeste & Hüttenabende'
    ],
    highlightsNl: [
      'Legendarische berghutsfeer direct aan de Poppenberg',
      'Direct aan de piste met groot panoramaterras',
      'Exclusief af te huren voor bedrijven & groepen',
      'Ideaal voor bedrijfsjubilea en thema-avonden'
    ],
    verifiedSourceUrl: 'https://www.bei-moeppi.de/deine-eventlocation/',
    sourceDescription: 'Offizielle Eventlocation-Unterseite für Firmenfeiern, Geburtstage & Feste'
  },
  // 10. Nordhang Jause
  {
    id: 'nordhang-jause',
    locationType: 'huette',
    locationTypeLabelDe: 'Berghütte & Feierlocation am Kahlen Asten',
    locationTypeLabelNl: 'Berghut & Feestlocatie bij de Kahler Asten',
    occasionsDe: ['Hochzeit im Bergpanorama', 'Firmenfeier & Sommerfest', 'Runder Geburtstag', 'Hüttenabend', 'Familienfeier'],
    occasionsNl: ['Bruiloft met bergpanorama', 'Bedrijfsfeest & Zomerborrel', 'Verjaardag', 'Huttenavond', 'Familiebijeenkomst'],
    capacityDe: 'Bis ca. 120 Personen',
    capacityNl: 'Tot ca. 120 personen',
    highlightsDe: [
      'Exklusive Hüttenvermietung für private Feiern & Events',
      'Herrliche Höhenlage mit weitem Sauerland-Blick',
      'Gemütlicher Gastraum & sonnige Panoramaterrasse',
      'Individuelle Buffets, Grillabende & Eventorganisation'
    ],
    highlightsNl: [
      'Exclusieve verhuur voor besloten feesten & events',
      'Schitterende ligging met weids uitzicht',
      'Gezellige zaal & zonnig panoramaterras',
      'Buffetten, barbecues & complete verzorging'
    ],
    verifiedSourceUrl: 'https://www.nordhangjause.de/#vermietung',
    sourceDescription: 'Offizielle Vermietungs-Sektion für private Feiern & Events'
  },
  // 11. Skihütte Der Brabander
  {
    id: 'brabander-skihutte',
    locationType: 'huette',
    locationTypeLabelDe: 'Event- & Hochzeitshütte am Herrloh',
    locationTypeLabelNl: 'Event- & Trouwhut aan de Herrloh',
    occasionsDe: ['Traumhochzeit im Alpenstil', 'Firmenfeier & Teamevent', 'Runder Geburtstag', 'Weihnachtsfeier', 'Familienfest'],
    occasionsNl: ['Trouwerij in alpenstijl', 'Bedrijfsfeest & Teambuilding', 'Verjaardag', 'Kerstviering', 'Familiefeest'],
    capacityDe: 'Bis ca. 150 Personen',
    capacityNl: 'Tot ca. 150 personen',
    highlightsDe: [
      'Malerische Lage direkt an der Skipiste Herrloh',
      'Gemütlicher Kamin & stilvolles Holz-Ambiente',
      'Professionelles Hotel-Catering aus einer Hand',
      'Große Sonnenterrasse mit Blick auf das Skigebiet'
    ],
    highlightsNl: [
      'Pittoreske ligging aan de skipiste Herrloh',
      'Sfeervolle open haard & warm houtdesign',
      'Eigen hotel-catering op hoog niveau',
      'Groot zonneterras met zicht op de bergen'
    ],
    verifiedSourceUrl: 'https://www.brabander.de',
    sourceDescription: 'Offiziell buchbare Event- und Hochzeitshütte am Herrloh'
  },
  // 12. Abendrot im Resort Schöner Asten
  {
    id: 'party-location-abendrot-altastenberg',
    locationType: 'lounge',
    locationTypeLabelDe: 'Exklusive Eventlocation "Abendrot"',
    locationTypeLabelNl: 'Exclusieve Evenementenlocatie "Abendrot"',
    occasionsDe: ['Hochzeitsfeier', 'Betriebsfeier & Firmenevent', 'Runder Geburtstag', 'Vereinsjubiläum', 'Weihnachtsfeier'],
    occasionsNl: ['Bruiloftsfeest', 'Bedrijfsfeest & Bedrijfsuitje', 'Verjaardag', 'Verenigingsjubileum', 'Kerstfeest'],
    capacityDe: 'Bis ca. 150 Personen',
    capacityNl: 'Tot ca. 150 personen',
    highlightsDe: [
      'Exklusiv für geschlossene Gesellschaften mietbar',
      'Eigene Bar, Tanzfläche, moderne Licht- & Tontechnik',
      'Keine Sperrstunde - ungestört feiern bis in den Morgen',
      'Komfortable Übernachtung direkt im Resort vor Ort'
    ],
    highlightsNl: [
      'Exclusief voor besloten gezelschappen te huur',
      'Eigen bar, dansvloer, moderne geluids- en lichtinstallatie',
      'Geen sluitingstijd - feesten tot in de vroege uren',
      'Overnachtingsmogelijkheden direct in het resort'
    ],
    verifiedSourceUrl: 'https://www.resort-winterberg.de/nederlands/component/content/article/192-party-location-sauerland-2?catid=2',
    sourceDescription: 'Offizielle Eventlocation-Seite des Resorts Schöner Asten für geschlossene Feiern'
  },
  // 13. Bu'ket Bar Winterberg
  {
    id: '145',
    locationType: 'lounge',
    locationTypeLabelDe: 'Stilvolle Event-Lounge & Vinothek',
    locationTypeLabelNl: 'Stijlvolle Event-Lounge & Vinotheek',
    occasionsDe: ['Exklusive Firmenfeier', 'Runder Geburtstag', 'Privates Weintasting & Cocktailkurs', 'Geschlossene Gesellschaft', 'Teamevent'],
    occasionsNl: ['Exclusief bedrijfsuitje', 'Verjaardag', 'Wijnproeverij & Cocktailworkshop', 'Besloten gezelschap', 'Teambuilding'],
    capacityDe: 'Bis ca. 40 Personen (Tasting bis 18)',
    capacityNl: 'Tot ca. 40 personen (proeverij tot 18)',
    highlightsDe: [
      'Exklusiv als geschlossene Gesellschaft mietbar',
      'Separater Patron Room für Tastings & Workshops',
      'Individuelle Signature-Cocktails, Spitzenweine & Fingerfood',
      'Zentrale, edle Lage im Herzen von Winterberg'
    ],
    highlightsNl: [
      'Exclusief af te huren voor besloten groepen',
      'Aparte Patron Room voor proeverijen & workshops',
      'Cocktails op maat, kwaliteitswijnen en fingerfood',
      'Centraal en stijlvol gelegen in Winterberg'
    ],
    verifiedSourceUrl: 'https://www.buket.de/events',
    sourceDescription: 'Offizielle Event- & Vermietungsseite für geschlossene Gesellschaften & Tastings'
  },
  // 14. Hochheide-Hütte Niedersfeld
  {
    id: 'hochheide-huette',
    locationType: 'huette',
    locationTypeLabelDe: 'Berghütte im Naturschutzgebiet',
    locationTypeLabelNl: 'Berghut in Beschermd Natuurgebied',
    occasionsDe: ['Private Feier & Jubiläum', 'Runder Geburtstag', 'Firmensommerfest', 'Wander- & Vereinsfest', 'Familientreffen'],
    occasionsNl: ['Privéfeest & Jubileum', 'Verjaardag', 'Zomerbedrijfsfeest', 'Wandel- & verenigingsevenement', 'Familiebijeenkomst'],
    capacityDe: 'Bis ca. 100 Personen',
    capacityNl: 'Tot ca. 100 personen',
    highlightsDe: [
      'Einzigartige Höhenlage auf 800 m auf dem Neuer Hagen in herrlicher Natur',
      'Uriges Holz-Ambiente & große Panoramaterrasse',
      'Für geschlossene Abendveranstaltungen buchbar',
      'Absolute Naturidylle ohne Durchgangsverkehr'
    ],
    highlightsNl: [
      'Unieke ligging op 800 meter hoogte op de heide',
      'Rustiek houten interieur & panoramisch terras',
      'Voor besloten avondfeesten exclusief te boeken',
      'Midden in de ongerepte natuur'
    ],
    verifiedSourceUrl: 'https://www.hochheidehuette-niedersfeld.de/feiern-auf-der-hochheide-huette-niedersfeld/',
    sourceDescription: 'Eigene Unterseite für Feiern & Partys auf der Hütte'
  },
  // 15. Bremberg Klause
  {
    id: 'bremberg-klause',
    locationType: 'huette',
    locationTypeLabelDe: 'Traditionelle Event- & Skihütte',
    locationTypeLabelNl: 'Traditionele Event- & Skihut',
    occasionsDe: ['Firmenfeier', 'Runder Geburtstag', 'Weihnachtsfeier', 'Vereinsausflug', 'Hüttenabend'],
    occasionsNl: ['Bedrijfsuitje', 'Verjaardag', 'Kerstfeest', 'Verenigingsuitje', 'Huttenavond'],
    capacityDe: 'Bis ca. 90 Personen',
    capacityNl: 'Tot ca. 90 personen',
    highlightsDe: [
      'Direkt im Skiliftkarussell an den Bremberg-Pisten',
      'Gemütlicher Holzofen & urige Sauerländer Atmosphäre',
      'Für private Hüttenabende und Firmenfeiern mietbar',
      'Deftige Sauerländer Küche & große Sonnenterrasse'
    ],
    highlightsNl: [
      'Direct in het skigebied aan de Bremberg-pistes',
      'Gezellige houtkachel & authentieke streekgerechten',
      'Te huur voor besloten feesten en bedrijfsuitjes',
      'Groot terras met uitzicht'
    ],
    verifiedSourceUrl: 'https://www.bremberg-klause.de/unsere-huette/',
    sourceDescription: 'Offizielle Hüttenabende- und Gruppenbuchungsseite'
  },
  // 16. Skihütte Rauher Busch
  {
    id: 'rauher-busch',
    locationType: 'huette',
    locationTypeLabelDe: 'Event-Skihütte im Skigebiet',
    locationTypeLabelNl: 'Event-Skihut in het Skigebied',
    occasionsDe: ['Firmenfeier', 'Vereinsfeier', 'Runder Geburtstag', 'Familienfeier', 'Hüttenzauber'],
    occasionsNl: ['Bedrijfsfeest', 'Verenigingsfeest', 'Verjaardag', 'Familiefeest', 'Huttensfeer'],
    capacityDe: 'Bis ca. 100 Personen',
    capacityNl: 'Tot ca. 100 personen',
    highlightsDe: [
      'Mitten im Skiliftkarussell mit bequemer direkter Zufahrt',
      'Rustikale Gemütlichkeit mit Schankanlage & Kamin',
      'Für Feiern und Gruppen flexibel mietbar',
      'Großzügige eigene Parkplätze direkt am Haus'
    ],
    highlightsNl: [
      'Centraal in het skigebied met uitstekende bereikbaarheid',
      'Rustieke gezelligheid met bar en open haard',
      'Flexibel te huur voor feesten en groepen',
      'Ruime parkeergelegenheid voor de deur'
    ],
    verifiedSourceUrl: 'https://www.rauher-busch.de/feiern',
    sourceDescription: 'Offizielle Feiern- und Event-Seite der Hütte'
  },
  // 17. Quick's Skihütte
  {
    id: 'quicks-skihutte',
    locationType: 'huette',
    locationTypeLabelDe: 'Zweistöckige Panorama-Eventhütte',
    locationTypeLabelNl: 'Panoramische Eventhut met Twee Verdiepingen',
    occasionsDe: ['Firmenfeier & Incentive', 'Runder Geburtstag', 'Geschlossene Gesellschaft', 'Weihnachtsfeier'],
    occasionsNl: ['Bedrijfsuitje & Incentive', 'Verjaardag', 'Besloten gezelschap', 'Kerstfeest'],
    capacityDe: 'Bis ca. 120 Personen',
    capacityNl: 'Tot ca. 120 personen',
    highlightsDe: [
      'Zwei Etagen mit Kaminfeuer & gemütlicher Stube',
      'Für geschlossene Gesellschaften & Firmenevents mietbar',
      'Große Außenterrasse mit freiem Pistenblick',
      'Individuelle Menü- und Buffetabsprachen'
    ],
    highlightsNl: [
      'Twee sfeervolle verdiepingen met open haard',
      'Exclusief te huur voor besloten gezelschappen',
      'Groot zonneterras met uitzicht op de piste',
      'Arrangementen op maat voor catering'
    ],
    verifiedSourceUrl: 'https://quicks-winterberg.de',
    sourceDescription: 'Offizielle Event-Anfragen für geschlossene Gesellschaften'
  },
  // 18. Alm Salettl
  {
    id: 'alm-salettl',
    locationType: 'huette',
    locationTypeLabelDe: 'Cabrio-Alm & Event-Rondell',
    locationTypeLabelNl: 'Cabrio-Alm & Event-Rondell',
    occasionsDe: ['Firmen-Sommerfest', 'Runder Geburtstag', 'Vereinsausflug', 'Lockeres Teamevent'],
    occasionsNl: ['Zomerbedrijfsfeest', 'Verjaardag', 'Verenigingsuitje', 'Teambuilding'],
    capacityDe: 'Bis ca. 80 Personen',
    capacityNl: 'Tot ca. 80 personen',
    highlightsDe: [
      'Elektrisches Cabrio-Glasdach zum Öffnen bei schönem Wetter',
      'Zentrale Lage am Skilift Bremberg mit Terrasse',
      'Für Gruppen exklusiv reservierbar',
      'Event-Bewirtung & Catering auf Vorbestellung'
    ],
    highlightsNl: [
      'Elektrisch bedienbaar glazen cabriodak voor zonnige dagen',
      'Centrale ligging aan de Bremberg skilift met terras',
      'Exclusief te reserveren voor gezelschappen',
      'Catering op aanvraag mogelijk'
    ],
    verifiedSourceUrl: 'https://alm-salettl.de',
    sourceDescription: 'Offiziell mietbare Rondell-Eventbar für Gruppen'
  }
];

export const PARTY_VENUES_MAP: Record<string, PartyRentalVenue> = PARTY_VENUES_DATA.reduce((acc, v) => {
  acc[v.id] = v;
  return acc;
}, {} as Record<string, PartyRentalVenue>);

export const EVENT_VENUES_DATA = PARTY_VENUES_DATA;
export const EVENT_VENUES_MAP = PARTY_VENUES_MAP;

export function getPartyVenueInfo(id: string): PartyRentalVenue | undefined {
  return PARTY_VENUES_MAP[id];
}

export const getEventVenueInfo = getPartyVenueInfo;

export function isPartyLocation(bus: Business): boolean {
  return Boolean(PARTY_VENUES_MAP[bus.id]);
}

export const isEventLocation = isPartyLocation;
