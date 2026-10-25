import { Business } from '../types';

export type PartyLocationType = 'huette' | 'saal' | 'club' | 'hotel' | 'scheune';

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

export const PARTY_VENUES_DATA: PartyRentalVenue[] = [
  // 1. Bei Möppi
  {
    id: 'bei-moppi',
    locationType: 'huette',
    locationTypeLabelDe: 'Kult-Skihütte & Eventlocation',
    locationTypeLabelNl: 'Iconische Skihut & Evenementenlocatie',
    occasionsDe: ['Hüttenparty', 'Geburtstag', 'Firmenfeier', 'Après-Ski', 'Sommerfest'],
    occasionsNl: ['Hutfeest', 'Verjaardag', 'Bedrijfsfeest', 'Après-ski', 'Zomerfeest'],
    capacityDe: 'Bis ca. 150 Personen',
    capacityNl: 'Tot ca. 150 personen',
    highlightsDe: ['Legendäre Party-Atmosphäre am Poppenberg', 'Direkt an der Piste mit großer Terrasse', 'Exklusiv für Events mietbar', 'Stimmung & Bewirtung garantiert'],
    highlightsNl: ['Legendarische feestsfeer aan de Poppenberg', 'Direct aan de piste met groot terras', 'Exclusief af te huren', 'Gegarandeerde sfeer'],
    verifiedSourceUrl: 'https://www.bei-moeppi.de/deine-eventlocation/',
    sourceDescription: 'Offizielle Eventlocation-Unterseite für Firmenfeiern, Geburtstage & Feste'
  },
  // 2. Nordhang Jause
  {
    id: 'nordhang-jause',
    locationType: 'huette',
    locationTypeLabelDe: 'Berghütte & Feierlocation',
    locationTypeLabelNl: 'Berghut & Feestlocatie',
    occasionsDe: ['Hüttenparty', 'Geburtstag', 'Firmenfeier', 'Hochzeit', 'Sommerfest'],
    occasionsNl: ['Hutfeest', 'Verjaardag', 'Bedrijfsuitje', 'Bruiloft', 'Zomerfeest'],
    capacityDe: 'Bis ca. 120 Personen',
    capacityNl: 'Tot ca. 120 personen',
    highlightsDe: ['Exklusive Hüttenvermietung', 'Direkt an der Nordhang-Piste', 'Gemütlicher Gastraum & Panoramaterrasse', 'Catering & Grillabende'],
    highlightsNl: ['Exclusieve zaalverhuur', 'Direct aan de piste Nordhang', 'Gezellige zaal & zonneterras', 'Catering & barbecue'],
    verifiedSourceUrl: 'https://www.nordhangjause.de/#vermietung',
    sourceDescription: 'Offizielle Vermietungs-Sektion für private Feiern & Events'
  },
  // 3. Köhlerhütte am Sahnehang
  {
    id: 'koehlerhuette-am-sahnehang',
    locationType: 'huette',
    locationTypeLabelDe: 'Berghütte mit Kamin',
    locationTypeLabelNl: 'Berghut met Open Haard',
    occasionsDe: ['Hüttenzauber', 'Geburtstag', 'Weihnachtsfeier', 'Hochzeit', 'Firmenevent'],
    occasionsNl: ['Huttensfeer', 'Verjaardag', 'Kerstviering', 'Bruiloft', 'Bedrijfsevent'],
    capacityDe: 'Bis ca. 120 Personen',
    capacityNl: 'Tot ca. 120 personen',
    highlightsDe: ['Romantisches Kaminfeuer & uriges Holz', 'Direkt am schneesicheren Sahnehang', 'Auf über 830 m am Kahlen Asten', 'Regionale Spezialitäten'],
    highlightsNl: ['Gezellig haardvuur & authentiek hout', 'Direct aan skigebied Sahnehang', 'Op 830 m hoogte bij de Kahler Asten', 'Regionale gerechten'],
    verifiedSourceUrl: 'https://sahnehang.de/events/ihr-event',
    sourceDescription: 'Offizielle Event-Seite für Feiern, Hochzeiten & Hüttenevents'
  },
  // 4. Bremberg Klause
  {
    id: 'bremberg-klause',
    locationType: 'huette',
    locationTypeLabelDe: 'Traditionelle Skihütte',
    locationTypeLabelNl: 'Traditionele Skihut',
    occasionsDe: ['Hüttengaudi', 'Geburtstag', 'Weihnachtsfeier', 'Firmenfeier', 'Wandergruppen'],
    occasionsNl: ['Hutfeest', 'Verjaardag', 'Kerstfeest', 'Bedrijfsuitje', 'Wandelgroepen'],
    capacityDe: 'Bis ca. 90 Personen',
    capacityNl: 'Tot ca. 90 personen',
    highlightsDe: ['Direkt im Skiliftkarussell an den Bremberg-Pisten', 'Gemütlicher Holzofen & urige Atmosphäre', 'Sonnenterrasse & Sauerländer Küche', 'Für private Hüttenabende mietbar'],
    highlightsNl: ['Direct aan de pistes van de Bremberg', 'Gezellige houtkachel & authentieke sfeer', 'Zonneterras & streekgerechten', 'Te huur voor besloten feesten'],
    verifiedSourceUrl: 'https://www.bremberg-klause.de/unsere-huette/',
    sourceDescription: 'Offizielle Hüttenabende- und Gruppenbuchungsseite'
  },
  // 5. Hochheide-Hütte Niedersfeld
  {
    id: 'hochheide-huette',
    locationType: 'huette',
    locationTypeLabelDe: 'Berghütte im Naturschutzgebiet',
    locationTypeLabelNl: 'Berghut in Natuurgebied',
    occasionsDe: ['Hüttenabend', 'Geburtstag', 'Wanderfest', 'Familienfeier', 'Sommerparty'],
    occasionsNl: ['Huttenavond', 'Verjaardag', 'Wandelfeest', 'Familiefeest', 'Zomerfeest'],
    capacityDe: 'Bis ca. 100 Personen',
    capacityNl: 'Tot ca. 100 personen',
    highlightsDe: ['Auf 800 m Höhe auf dem Neuer Hagen', 'Uriges Holz-Ambiente & große Panoramaterrasse', 'Für private Feiern & Hüttenabende buchbar', 'Naturidylle pur'],
    highlightsNl: ['Op 800 m hoogte op de heide', 'Rustieke houten inrichting & panoramaterras', 'Te boeken voor feesten & partijen', 'Midden in de natuur'],
    verifiedSourceUrl: 'https://www.hochheidehuette-niedersfeld.de/feiern-auf-der-hochheide-huette-niedersfeld/',
    sourceDescription: 'Eigene Unterseite für Feiern & Partys auf der Hütte'
  },
  // 6. Skihütte Rauher Busch
  {
    id: 'rauher-busch',
    locationType: 'huette',
    locationTypeLabelDe: 'Skihütte & Feierlocation',
    locationTypeLabelNl: 'Skihut & Feestlocatie',
    occasionsDe: ['Party & Feiern', 'Geburtstag', 'Firmenfeier', 'Vereinsfeier', 'Hüttenzauber'],
    occasionsNl: ['Feest', 'Verjaardag', 'Bedrijfsuitje', 'Verenigingsfeest', 'Huttensfeer'],
    capacityDe: 'Bis ca. 100 Personen',
    capacityNl: 'Tot ca. 100 personen',
    highlightsDe: ['Mitten im Skiliftkarussell am Rauhen Busch', 'Direkte Zufahrt & Parkplätze vorhanden', 'Rustikale Gemütlichkeit mit Schankanlage', 'Für Feiern flexibel mietbar'],
    highlightsNl: ['Midden in het skigebied aan de Rauher Busch', 'Goede bereikbaarheid & parking', 'Rustieke gezelligheid met bar', 'Flexibel te huur'],
    verifiedSourceUrl: 'https://www.rauher-busch.de/feiern',
    sourceDescription: 'Offizielle Feiern- und Event-Seite der Hütte'
  },
  // 7. Schneewittchenhaus Winterberg
  {
    id: 'schneewittchenhaus-winterberg',
    locationType: 'huette',
    locationTypeLabelDe: 'Moderne Panorama-Alm',
    locationTypeLabelNl: 'Moderne Panoramalocatie',
    occasionsDe: ['Traumhochzeit & Freie Trauung', 'Runder Geburtstag', 'Firmen-Incentive', 'Weihnachtsfeier', 'Sommerfest'],
    occasionsNl: ['Droombruiloft met ceremonie', 'Verjaardag', 'Bedrijfsincentive', 'Kerstfeest', 'Zomerfeest'],
    capacityDe: 'Bis ca. 200 Personen',
    capacityNl: 'Tot ca. 200 personen',
    highlightsDe: ['Direkt an der Schneewittchen-Piste & Sesselbahn', 'Herrliche Panorama-Sonnenterrasse', 'Erstklassige Gastronomie & Eventorganisation', 'Moderne alpine Architektur'],
    highlightsNl: ['Direct aan de skipiste Schneewittchen & stoeltjeslift', 'Groot panoramisch zonneterras', 'Catering van hoog niveau', 'Moderne alpine architectuur'],
    verifiedSourceUrl: 'https://www.schneewittchenhaus.de/feiern',
    sourceDescription: 'Offizielle Event-Seite für Hochzeiten, Geburtstage & Firmen-Incentives'
  },
  // 8. Das "Abendrot" im Hotel Schöner Asten
  {
    id: 'party-location-abendrot-altastenberg',
    locationType: 'club',
    locationTypeLabelDe: 'Party-Location & Club',
    locationTypeLabelNl: 'Party-Location & Club',
    occasionsDe: ['Hochzeit', 'Runder Geburtstag', 'Betriebsfeier', 'Vereinsfest', 'Weihnachtsfeier'],
    occasionsNl: ['Bruiloft', 'Verjaardag', 'Bedrijfsfeest', 'Verenigingsfeest', 'Kerstfeest'],
    capacityDe: 'Bis ca. 150 Personen',
    capacityNl: 'Tot ca. 150 personen',
    highlightsDe: ['Exklusiv für geschlossene Gesellschaften mietbar', 'Eigene Bar & Schankanlage', 'Tanzfläche mit Licht- & Soundtechnik', 'Hotelübernachtung direkt im Haus'],
    highlightsNl: ['Exclusief voor besloten gezelschappen te huur', 'Eigen bar & tapinstallatie', 'Dansvloer met professioneel licht & geluid', 'Overnachten in het resort'],
    verifiedSourceUrl: 'https://www.resort-winterberg.de/nederlands/component/content/article/192-party-location-sauerland-2?catid=2',
    sourceDescription: 'Offizielle Partylocation-Seite des Resorts Schöner Asten'
  },
  // 9. Freestyle Area Winterberg
  {
    id: 'freestyle-area-winterberg',
    locationType: 'club',
    locationTypeLabelDe: 'Lounge, Bar & Event-Area',
    locationTypeLabelNl: 'Lounge, Bar & Event-Area',
    occasionsDe: ['Clubparty & DJ-Events', 'Junggesellenabschied (JGA)', 'Geburtstag', 'Firmenfeier', 'Après-Ski-Party'],
    occasionsNl: ['Clubparty & dj-avonden', 'Vrijgezellenfeest', 'Verjaardag', 'Bedrijfsborrel', 'Après-ski'],
    capacityDe: 'Bis ca. 150 Personen',
    capacityNl: 'Tot ca. 150 personen',
    highlightsDe: ['Lässige Lounge-Atmosphäre direkt an der Piste', 'Professionelle Sound- & DJ-Technik', 'Große Pisten-Sonnenterrasse', 'Event-Organisation aus einer Hand'],
    highlightsNl: ['Relaxte lounge direct aan de piste', 'Professioneel licht & geluid', 'Groot zonneterras', 'Complete organisatie van events'],
    verifiedSourceUrl: 'https://www.freestyle-area.de/events',
    sourceDescription: 'Offizielle Event-Seite für JGAs, Feiern & Firmen-Events'
  },
  // 10. Gästehaus Winterberg (Die Eventlocation in Grönebach)
  {
    id: 'gaestehaus-winterberg-groenebach',
    locationType: 'saal',
    locationTypeLabelDe: 'Eventlocation & Tagungshaus',
    locationTypeLabelNl: 'Evenementenlocatie & Feestzaal',
    occasionsDe: ['Hochzeit im Grünen', 'Große Familienfeier', 'Runder Geburtstag', 'Tagung & Seminar', 'Vereinsfreizeit'],
    occasionsNl: ['Bruiloft in het groen', 'Grote familiebijeenkomst', 'Verjaardag', 'Congres & seminar'],
    capacityDe: 'Bis zu 130 Personen (135 Betten)',
    capacityNl: 'Tot 130 personen (135 bedden)',
    highlightsDe: ['Großer Festsaal & 125 m² Profi-Großküche', 'Hauseigene Kapelle für Trauungen', '135 Betten Übernachtungskapazität im Haus', 'Großzügiges Außengelände im Grünen'],
    highlightsNl: ['Grote feestzaal & 125 m² professionele keuken', 'Eigen kapel voor huwelijksvoltrekkingen', '135 slaapplaatsen ter plaatse', 'Royaal buitenterrein in het groen'],
    verifiedSourceUrl: 'https://www.gaestehaus-winterberg.de/die-eventlocation',
    sourceDescription: 'Offizielle Eventlocation-Präsentation mit Festsaal & Kapelle'
  },
  // 11. Stadthalle Oversum
  {
    id: 'stadthalle-oversum-winterberg',
    locationType: 'saal',
    locationTypeLabelDe: 'Kongress- & Festsaal',
    locationTypeLabelNl: 'Congres- & Feestzaal',
    occasionsDe: ['Hochzeit', 'Große Firmenfeier', 'Gala-Abend', 'Abiball', 'Jubiläum'],
    occasionsNl: ['Bruiloft', 'Groot bedrijfsevenement', 'Gala', 'Jubileum'],
    capacityDe: 'Bis zu 500 Personen',
    capacityNl: 'Tot 500 personen',
    highlightsDe: ['Flexibler Festsaal mit Bühne & Red Lounge', 'Professionelle Licht- & Tontechnik', 'Barrierefrei mit Foyer am Kurpark', 'Hochzeitspauschalen & Catering'],
    highlightsNl: ['Flexibele feestzaal met podium', 'Moderne licht- & geluidstechniek', 'Foyer aan het kuurpark', 'Bruiloftsarrangementen'],
    verifiedSourceUrl: 'https://www.oversum-vitalresort.de/feste-feiern/',
    sourceDescription: 'Offizielle Feste- & Feiern-Broschüre und Veranstaltungszentrum Winterberg'
  },
  // 12. Bobhaus Winterberg
  {
    id: 'bobhaus-winterberg',
    locationType: 'huette',
    locationTypeLabelDe: 'Panorama-Berggasthof & Trauort',
    locationTypeLabelNl: 'Panoramisch Berghotel & Trouwlocatie',
    occasionsDe: ['Standesamtliche Trauung', 'Hochzeitsfeier', 'Runder Geburtstag', 'Firmenjubiläum', 'Sommerfest'],
    occasionsNl: ['Huwelijksvoltrekking', 'Bruiloft', 'Verjaardag', 'Bedrijfsjubileum', 'Zomerfeest'],
    capacityDe: 'Bis zu 180 Personen',
    capacityNl: 'Tot 180 personen',
    highlightsDe: ['Offizielle Standesamts-Außenstelle Winterberg', 'Einmaliger Panoramablick auf dem Kahlen Asten / Kappe', 'Exklusiv buchbar mit Wintergarten', 'Erlesene Küche'],
    highlightsNl: ['Officiële trouwlocatie van Winterberg', 'Uniek uitzicht over het Sauerland', 'Exclusief af te huren', 'Uitstekende keuken'],
    verifiedSourceUrl: 'https://www.bobhaus.de',
    sourceDescription: 'Offizielle Trauungsaußenstelle Standesamt Winterberg & Hochzeitslocation'
  },
  // 13. Skihütte Der Brabander
  {
    id: 'brabander-skihutte',
    locationType: 'huette',
    locationTypeLabelDe: 'Skihütte & Feierlocation',
    locationTypeLabelNl: 'Skihut & Feestlocatie',
    occasionsDe: ['Hüttengaudi', 'Geburtstag', 'Firmenfeier', 'Weihnachtsfeier', 'Hochzeit'],
    occasionsNl: ['Hutfeest', 'Verjaardag', 'Bedrijfsuitje', 'Kerstborrel', 'Bruiloft'],
    capacityDe: 'Bis ca. 150 Personen',
    capacityNl: 'Tot ca. 150 personen',
    highlightsDe: ['Direkt an der Piste Herrloh', 'Gemütlicher Kamin & Uriges Holz', 'Hauseigenes Catering', 'Große Sonnenterrasse'],
    highlightsNl: ['Direct aan de skipiste Herrloh', 'Sfeervolle open haard', 'Eigen cateringmogelijkheden', 'Groot zonneterras'],
    verifiedSourceUrl: 'https://www.brabander.de',
    sourceDescription: 'Offiziell buchbare Event- und Hochzeitshütte am Herrloh'
  },
  // 14. Die Tenne Winterberg
  {
    id: 'tenne-winterberg',
    locationType: 'club',
    locationTypeLabelDe: 'Party-Club & Bar',
    locationTypeLabelNl: 'Feestclub & Bar',
    occasionsDe: ['Clubparty', 'Geburtstag', 'Junggesellenabschied (JGA)', 'Betriebsfeier', 'Vereinsfeier'],
    occasionsNl: ['Clubparty', 'Verjaardag', 'Vrijgezellenfeest', 'Bedrijfsfeest', 'Verenigingsfeest'],
    capacityDe: 'Bis 300 Personen (3 Ebenen)',
    capacityNl: 'Tot 300 personen (3 verdiepingen)',
    highlightsDe: ['VIP-Kornkammer exklusiv für Gruppen ab 20 Pers. mietbar', 'Eigene DJs & Soundanlage', 'Flexible Raumkonzepte', 'Lange Partynächte im Zentrum'],
    highlightsNl: ['VIP-ruimte exclusief te huur vanaf 20 pers.', 'Eigen dj-booth & geluidssysteem', 'Flexibele ruimtes', 'Feesten tot in de vroege uurtjes'],
    verifiedSourceUrl: 'https://tenne-winterberg.de/bereiche/',
    sourceDescription: 'Offizielle Gruppen- und Bereichsmiete (VIP-Kornkammer)'
  },
  // 15. Alm Salettl
  {
    id: 'alm-salettl',
    locationType: 'huette',
    locationTypeLabelDe: 'Cabrio-Schirmbar & Alm',
    locationTypeLabelNl: 'Cabrio-Schirmbar & Alm',
    occasionsDe: ['Après-Ski-Party', 'Geburtstag', 'Firmenfeier', 'Sommerparty'],
    occasionsNl: ['Après-ski feest', 'Verjaardag', 'Bedrijfsfeest', 'Zomerparty'],
    capacityDe: 'Bis ca. 80 Personen',
    capacityNl: 'Tot ca. 80 personen',
    highlightsDe: ['Elektrisches Cabrio-Glasdach zum Öffnen', 'Zentrale Lage am Skilift Bremberg / P6', 'Gepflasterte Sonnenterrasse', 'Catering vom Wiesenwirt'],
    highlightsNl: ['Glazen cabriodak dat open kan', 'Centraal aan skilift Bremberg', 'Groot zonneterras', 'Catering op maat'],
    verifiedSourceUrl: 'https://alm-salettl.de',
    sourceDescription: 'Offiziell mietbare Rondell-Eventbar für Gruppen bis 80 Personen'
  },
  // 16. Quick\'s Skihütte
  {
    id: 'quicks-skihutte',
    locationType: 'huette',
    locationTypeLabelDe: 'Skihütte am Quick-Jet',
    locationTypeLabelNl: 'Skihut aan de Quick-Jet',
    occasionsDe: ['Hüttenabend', 'Geburtstag', 'Firmenevent', 'Skiparty'],
    occasionsNl: ['Huttenavond', 'Verjaardag', 'Bedrijfsevent', 'Skifeest'],
    capacityDe: 'Bis ca. 120 Personen',
    capacityNl: 'Tot ca. 120 personen',
    highlightsDe: ['Zwei Etagen mit Kaminfeuer-Atmosphäre', 'Für geschlossene Gesellschaften & Events mietbar', 'Große Außenterrasse mit Pistenblick', 'Eigene Eventanfragen'],
    highlightsNl: ['Twee verdiepingen met haardvuur', 'Exclusief te huur voor besloten groepen', 'Zonneterras aan de piste', 'Eventplanning op maat'],
    verifiedSourceUrl: 'https://quicks-winterberg.de',
    sourceDescription: 'Offizielle Anfrage für geschlossene Gesellschaften (anfrage@quicks-winterberg.de)'
  },
  // 17. Borgs Scheune Züschen
  {
    id: 'borgs-scheune-zueschen',
    locationType: 'scheune',
    locationTypeLabelDe: 'Historische Fachwerkscheune & Trauort',
    locationTypeLabelNl: 'Historische Vakwerkschuur & Trouwlocatie',
    occasionsDe: ['Standesamtliche Trauung', 'Romantische Hochzeit', 'Runder Geburtstag', 'Jubiläum'],
    occasionsNl: ['Huwelijksvoltrekking', 'Bruiloft', 'Verjaardag', 'Jubileum'],
    capacityDe: 'Bis ca. 100 Personen',
    capacityNl: 'Tot ca. 100 personen',
    highlightsDe: ['Offizieller historischer Trauort des Standesamtes', 'Denkmalgeschützte Fachwerkatmosphäre von 1791', 'Küche & Thekenbereich vorhanden', 'Besonderer Charme'],
    highlightsNl: ['Officiële trouwlocatie van gemeente Winterberg', 'Monumentale vakwerksfeer uit 1791', 'Keuken & bar aanwezig', 'Bijzondere sfeer'],
    verifiedSourceUrl: 'https://www.borgs-scheune.de',
    sourceDescription: 'Offizieller Trauort Stadt Winterberg & historische Eventtenne'
  },
  // 18. Bu'ket Bar Winterberg
  {
    id: '145',
    locationType: 'club',
    locationTypeLabelDe: 'Cocktail- & Weinbar (Eventlocation)',
    locationTypeLabelNl: 'Cocktail- & Wijnbar (Feestlocatie)',
    occasionsDe: ['Geburtstag', 'Firmenfeier', 'Weintasting', 'Cocktailkurs', 'Exklusive Feiern'],
    occasionsNl: ['Verjaardag', 'Bedrijfsborrel', 'Wijnproeverij', 'Cocktailworkshop', 'Besloten feesten'],
    capacityDe: 'Bis ca. 40 Personen (Tasting bis 18)',
    capacityNl: 'Tot ca. 40 personen (proeverij tot 18)',
    highlightsDe: ['Exklusiv als geschlossene Gesellschaft mietbar', 'Separater Patron Room für Tastings & Workshops', 'Individuelle Cocktails, erlesene Weine & Fingerfood', 'Zentrale Lage in der Poststraße'],
    highlightsNl: ['Exclusief af te huren voor besloten feesten', 'Aparte Patron Room voor workshops & proeverijen', 'Cocktails, wijnen & hapjes op maat', 'In het centrum aan de Poststraße'],
    verifiedSourceUrl: 'https://www.buket.de/events',
    sourceDescription: 'Offizielle Event- & Vermietungsseite für geschlossene Gesellschaften, Tastings & Kurse'
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
  return Boolean(PARTY_VENUES_MAP[bus.id]);
}
