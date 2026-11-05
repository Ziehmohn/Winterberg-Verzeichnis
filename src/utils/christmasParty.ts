import { Business } from '../types';

export interface ChristmasFeature {
  icon: 'utensils' | 'wine' | 'headphones' | 'flame' | 'sparkles' | 'tree';
  titleDe: string;
  titleNl: string;
  descDe: string;
  descNl: string;
}

export interface ChristmasPartyItem {
  id: string;
  businessId: string;
  businessName: string;
  subtitleDe: string;
  subtitleNl: string;
  titleDe: string;
  titleNl: string;
  seasonDe: string;
  seasonNl: string;
  packageTypeDe: string;
  packageTypeNl: string;
  priceInfoDe: string;
  priceInfoNl: string;
  address: string;
  district: string;
  category: string;
  subcategory: string;
  features: ChristmasFeature[];
  highlightsDe: string[];
  highlightsNl: string[];
  shortDescriptionDe: string;
  shortDescriptionNl: string;
  infoTextDe: string;
  infoTextNl: string;
  flyerImage: string;
  badgeDe: string;
  badgeNl: string;
  contactEmail: string;
  contactPhone: string;
  website: string;
  bookingUrl?: string;
  capacityDe?: string;
  capacityNl?: string;
}

export const CHRISTMAS_PARTY_DATA: ChristmasPartyItem[] = [
  {
    id: 'nordhang-jause-weihnachtsfeier-2026',
    businessId: 'nordhang-jause',
    businessName: 'Nordhang Jause Winterberg',
    subtitleDe: 'Deine All-Inclusive Weihnachtsfeier 2026 auf der Skihütte',
    subtitleNl: 'Je All-Inclusive Kerstborrel & Winterfeest 2026 in een authentieke berghut',
    titleDe: 'All-Inclusive Weihnachtsfeier 2026 an der Nordhang Jause',
    titleNl: 'All-Inclusive Kerstfeest 2026 bij Nordhang Jause',
    seasonDe: 'Saison 2026 / 2027 • Termine ab November 2026',
    seasonNl: 'Seizoen 2026 / 2027 • Data vanaf november 2026',
    packageTypeDe: 'All-Inclusive Hütten-Weihnachtsfeier',
    packageTypeNl: 'All-inclusive hutten-kerstfeest',
    priceInfoDe: 'All-Inclusive Pauschale (Preise & Termine auf Anfrage)',
    priceInfoNl: 'All-inclusive arrangement (prijzen & data op aanvraag)',
    address: 'In d. Renau 10/11, 59955 Winterberg',
    district: 'Winterberg',
    category: 'Gastronomie & Event',
    subcategory: 'Skihütte & Eventlocation',
    features: [
      {
        icon: 'utensils',
        titleDe: 'Überraschungs-4-Gänge-Menü',
        titleNl: 'Verrassend 4-gangenmenu',
        descDe: 'Rustikal, bodenständig und mit Liebe zubereitet – ein festlicher Hochgenuss für das ganze Team.',
        descNl: 'Robuust, bourgondisch en met liefde bereid – een feestelijk culinair genot voor het hele team.'
      },
      {
        icon: 'wine',
        titleDe: 'Inklusive Getränkepauschale',
        titleNl: 'Inclusief drankenarrangement',
        descDe: 'Sorgenfrei feiern mit umfassendem Getränkeangebot inkl. Bier, Wein, Softdrinks & Heißgetränken.',
        descNl: 'Zorgeloos genieten met een compleet aanbod inclusief bier, wijn, frisdrank en warme dranken.'
      },
      {
        icon: 'headphones',
        titleDe: 'Inklusive DJ',
        titleNl: 'Inclusief live-dj',
        descDe: 'Beste Hüttengaudi und Wunschmusik: Unser DJ sorgt vom Empfang bis spät in die Nacht für Top-Stimmung.',
        descNl: 'Echte après-ski ambiance en feestmuziek: de dj zorgt vanaf binnenkomst tot diep in de nacht voor sfeer.'
      }
    ],
    highlightsDe: [
      'Überraschungs-4-Gänge-Menü (rustikal & bodenständig)',
      'Inklusive Getränkepauschale während der gesamten Feier',
      'Inklusive professionellem DJ & Soundanlage',
      'Uriges Ambiente aus Naturholz direkt am Skihang',
      'Winterliche Kulisse mit knisternder Feuerschale'
    ],
    highlightsNl: [
      'Verrassend 4-gangenmenu (robuust & streekeigen)',
      'Inclusief royale drankvoorziening gedurende de hele avond',
      'Inclusief professionele dj & complete geluidsinstallatie',
      'Authentieke berghutsfeer met warm hout aan de piste',
      'Winterse bergambiance met knisperende vuurschaal'
    ],
    shortDescriptionDe: 'Deine All-Inclusive Weihnachtsfeier 2026 in Winterberg: Die Nordhang Jause bietet ein unvergessliches Komplettpaket für Firmen, Gruppen und Vereine mit 4-Gänge-Menü, Getränkepauschale und DJ.',
    shortDescriptionNl: 'Je all-inclusive kerstfeest 2026 in Winterberg: Berghut Nordhang Jause biedt een compleet arrangement voor bedrijven, teams en verenigingen met 4-gangenmenu, dranken en dj.',
    infoTextDe: 'Feiern Sie Ihre Weihnachtsfeier 2026 mitten im Winterberger Wintersport- und Wandergebiet! Die Nordhang Jause bietet Ihnen das perfekte Rundum-Sorglos-Paket: Gemütlicher Empfang in rustikaler Hüttenatmosphäre, ein exklusives 4-Gänge-Überraschungsmenü aus der Hüttenküche, eine offene Getränkepauschale und beste musikalische Begleitung durch einen hauseigenen DJ. Ideal für Firmenfeiern, Abteilungsessen, Vereinsabschlüsse und geschlossene Gruppen. Jetzt Wunschtermin für November/Dezember 2026 anfragen!',
    infoTextNl: 'Vier uw kerst- of eindejaarsborrel 2026 in het hart van het Winterbergse wintersportgebied! Nordhang Jause biedt u een compleet zorgeloos all-inclusive arrangement: een warm onthaal in de sfeervolle berghut, een feestelijk 4-gangen verrassingsmenu, onbeperkt dranken en een eigen dj voor een bruisende après-ski feestavond. Uitermate geschikt voor bedrijven, personeelsverenigingen en besloten gezelschappen.',
    flyerImage: '/weihnachtsfeier-winterberg-nordhang-jause.jpg',
    badgeDe: 'All-Inclusive 2026',
    badgeNl: 'All-Inclusive 2026',
    contactEmail: 'info@nordhangjause.de',
    contactPhone: '02981 8996399',
    website: 'https://www.nordhangjause.de/#vermietung',
    bookingUrl: 'https://www.nordhangjause.de/#vermietung',
    capacityDe: 'Firmen, Gruppen, Vereine & Abteilungen (exklusiv buchbar)',
    capacityNl: 'Bedrijven, groepen, verenigingen & teams (exclusief te boeken)'
  },
  {
    id: 'dorf-alm-weihnachten-winterberg-2026',
    businessId: '107',
    businessName: 'Dorf Alm Winterberg',
    subtitleDe: 'Eure Weihnachtsfeier mit Erlebnis • Alm-Tour & Hüttenbuffet',
    subtitleNl: 'Uw kerstfeest met beleving • Alm-tour & berghuttenbuffet',
    titleDe: 'Weihnachtsfeier mit Erlebnis in der Dorf Alm Winterberg',
    titleNl: 'Feestelijke kerstborrel & Alm-beleving in Dorf Alm Winterberg',
    seasonDe: 'Weihnachtssaison 2026 / 2027 • Termine ab November',
    seasonNl: 'Kerstseizoen 2026 / 2027 • Data vanaf november',
    packageTypeDe: 'Alm-Erlebnis & Hüttenbuffet',
    packageTypeNl: 'Alm-beleving & huttenbuffet',
    priceInfoDe: 'Individuelle Menü- & Buffet-Baukästen auf Anfrage',
    priceInfoNl: 'Individuele buffet- & menupakketten op aanvraag',
    address: 'Am Waltenberg 35, 59955 Winterberg',
    district: 'Winterberg',
    category: 'Gastronomie & Event',
    subcategory: 'Alpenländische Hütte & Restaurant',
    features: [
      {
        icon: 'wine',
        titleDe: 'Glühwein-Empfang',
        titleNl: 'Glühweinontvangst',
        descDe: 'Stimmungsvoller Start am offenen Feuer mit heißem Winzerglühwein & Punsch an der Feuerschale.',
        descNl: 'Sfeervolle start bij het knisperende vuur met warme glühwein en feestelijke punch.'
      },
      {
        icon: 'utensils',
        titleDe: 'Uriges Hüttenbuffet',
        titleNl: 'Ambachtelijk huttenbuffet',
        descDe: 'Deftige bayerische Schmankerl, saftige Haxen, Schnitzelvariationen & winterliche Desserts.',
        descNl: 'Heerlijke Beierse specialiteiten, malse schnitzels, knapperige haantjes en desserts.'
      },
      {
        icon: 'flame',
        titleDe: 'Fackelwanderung & Alm-Tour',
        titleNl: 'Fakkeltocht & Alm-tour',
        descDe: 'Perfekt kombinierbar mit einer romantischen Winter-Fackelwanderung oder Winterberg-Aktivprogramm.',
        descNl: 'Perfect te combineren met een romantische fakkeltocht of winters outdoorprogramma.'
      }
    ],
    highlightsDe: [
      'Uriges Hüttenflair an der zentralen Flaniermeile Am Waltenberg',
      'Glühwein-Empfang an der Feuerschale auf der Terrasse',
      'Individuell planbare Festmenüs & reichhaltige Buffets',
      'Kombinierbar mit geführter Fackelwanderung durch Winterberg',
      'Gemütlicher Kaminbereich, Holzbar & zünftige Musik'
    ],
    highlightsNl: [
      'Authentieke alpenhutsfeer aan de centrale boulevard Am Waltenberg',
      'Glühwein-ontvangst bij de vuurschaal op het terras',
      'Maatwerk feestbuffetten en feestelijke meergangenmenu\'s',
      'Te combineren met een sfeervolle fakkeltocht door het winterlandschap',
      'Gezellige open haard, rustieke houten bar en feestmuziek'
    ],
    shortDescriptionDe: 'Feiern, lachen und genießen: Die Dorf Alm Winterberg bietet unvergessliche Weihnachtsfeiern mit urigem Alm-Ambiente, Glühwein-Empfang, individuellem Hüttenbuffet und optionaler Fackelwanderung.',
    shortDescriptionNl: 'Vieren, lachen en genieten: Dorf Alm Winterberg biedt sfeervolle kerstvieringen met een authentieke berghutsfeer, glühwein bij het vuur, feestbuffet en optionele fakkeltocht.',
    infoTextDe: 'Erleben Sie Ihre Weihnachtsfeier im Herzen von Winterberg! Die Dorf Alm empfängt Sie mit knisterndem Kaminfeuer, urigem Altholz und herzlicher Gastfreundschaft. Ob traditioneller Glühwein-Empfang an der Feuerschale auf der Terrasse, ein großes Festbuffet mit alpenländischen Spezialitäten oder eine kombinierte Alm-Tour inklusive romantischer Winter-Fackelwanderung – das Team der Dorf Alm stellt Ihnen das perfekte Eventpaket für Ihr Team zusammen.',
    infoTextNl: 'Beleef uw eindejaarsborrel of personeelsfeest in het hart van Winterberg! De Dorf Alm verwelkomt u met een knisperend haardvuur, warm alpenhout en oprechte gastvrijheid. Geniet van een sfeervolle glühwein-ontvangst bij de vuurschaal, een royaal berghuttenbuffet met alpiene lekkernijen en combineer dit naar wens met een romantische fakkeltocht door het winterlandschap.',
    flyerImage: '/weihnachtsfeier-winterberg-dorf-alm.jpg',
    badgeDe: 'Alm-Erlebnis 2026',
    badgeNl: 'Alm-beleving 2026',
    contactEmail: 'winterberg@dorf-alm.de',
    contactPhone: '02981 929592',
    website: 'https://www.dorf-alm-winterberg.de/fileadmin/Kundenbereich/Winterberg/PDF/2026-09_DorfAlm-Winterberg_Mailing-Weihnachten_Flyer_A4_08-2026_WEB_final.pdf',
    bookingUrl: 'https://www.dorf-alm-winterberg.de/fileadmin/Kundenbereich/Winterberg/PDF/2026-09_DorfAlm-Winterberg_Mailing-Weihnachten_Flyer_A4_08-2026_WEB_final.pdf',
    capacityDe: 'Gruppen & Firmen von 15 bis 200+ Personen',
    capacityNl: 'Groepen en bedrijven van 15 tot 200+ personen'
  },
  {
    id: 'bei-moeppi-weihnachtsfeier-winterberg-2026',
    businessId: 'bei-moppi',
    businessName: 'Bei Möppi',
    subtitleDe: 'Deine Eventlocation direkt an der Piste • Feiern über 3 Etagen',
    subtitleNl: 'Feestlocatie direct aan de piste • Drie etages pure berghutsfeer',
    titleDe: 'Weihnachtsfeier bei Möppi im Skiliftkarussell Winterberg',
    titleNl: 'Kerstfeest bij Möppi in het Skiliftkarussell Winterberg',
    seasonDe: 'Saison 2026 / 2027 • Ab Mitte November',
    seasonNl: 'Seizoen 2026 / 2027 • Vanaf half november',
    packageTypeDe: 'Hütten-Event & Lavagrill-Buffet',
    packageTypeNl: 'Berghut-evenement & lavagrill',
    priceInfoDe: 'Komplettangebote auf Anfrage (15 bis 300+ Personen)',
    priceInfoNl: 'Totaalarrangementen op aanvraag (15 tot 300+ personen)',
    address: 'In d. Büre 32, 59955 Winterberg',
    district: 'Winterberg',
    category: 'Gastronomie & Event',
    subcategory: 'Kult-Skihütte & Eventlocation',
    features: [
      {
        icon: 'flame',
        titleDe: 'Glühwein an der Feuerschale',
        titleNl: 'Glühwein bij de vuurschaal',
        descDe: 'Aperitif-Empfang auf der Panoramaterrasse mit direktem Blick auf den verschneiten Skihang.',
        descNl: 'Feestelijk welkom op het panoramaterras met uitzicht op de verlichte skipiste.'
      },
      {
        icon: 'utensils',
        titleDe: 'Lavagrill & Festbuffet',
        titleNl: 'Lavagrill & feestbuffet',
        descDe: 'Köstlichkeiten frisch vom Lavasteingrill, herzhafte Hüttengerichte & süße Desserts.',
        descNl: 'Vleesspecialiteiten van de lavasteengrill, bourgondische gerechten en desserts.'
      },
      {
        icon: 'headphones',
        titleDe: 'DJ & Party über 3 Etagen',
        titleNl: 'DJ & feest over 3 verdiepingen',
        descDe: 'Modernste Sound- & Lichtanlage für ausgelassene Hüttengaudi bis tief in die Nacht.',
        descNl: 'Moderne geluids- en lichtinstallatie voor après-ski en dansen tot in de late uurtjes.'
      }
    ],
    highlightsDe: [
      'Direkt im Skiliftkarussell Winterberg (Büre Herrloh)',
      'Großzügige Location über drei Etagen plus Aussichtsterrasse',
      'Catering frisch vom Lavasteingrill & maßgeschneiderte Buffets',
      'Glühweinempfang mit offenen Feuerkörben & echtem Hüttenflair',
      'Professionelle Musikanlage mit Platz für DJs und Live-Bands'
    ],
    highlightsNl: [
      'Direct in het Skiliftkarussell Winterberg (Büre Herrloh)',
      'Ruime berghut over drie verdiepingen plus groot terras',
      'Catering van de lavagrill en feestelijke buffetten',
      'Glühweinontvangst met vuurkorven en uitzicht op de piste',
      'Professionele muziekinstallatie voor dj\'s en live-muziek'
    ],
    shortDescriptionDe: 'Firmen-Weihnachtsfeier direkt im Skiliftkarussell Winterberg: Bei Möppi feiert Ihr über drei Etagen mit Holz, Wärme, Lavagrill-Buffet, Glühwein an der Feuerschale und ausgelassener Hüttenstimmung.',
    shortDescriptionNl: 'Bedrijfskerstfeest direct aan de piste in Winterberg: Bij Möppi viert u feest over drie verdiepingen met hout, warmte, lavagrill-buffet, glühwein bij het vuur en topsfeer.',
    infoTextDe: 'Schluss mit sterilen Konferenzräumen: Bei Möppi feiert Ihr die Firmen-Weihnachtsfeier mitten im Geschehen des Winterberger Skigebiets. Ihr kommt an, zieht die Jacken aus und seid sofort in uriger Hüttenstimmung. Auf drei Etagen plus Terrasse lässt sich das Event perfekt staffeln – vom entspannten Glühwein-Aperitif an den Feuerkörben über das reichhaltige Buffet bis hin zur mitreißenden Party mit DJ. Möppi übernimmt auf Wunsch die komplette Planung für ein rundum gelungenes Fest.',
    infoTextNl: 'Weg met saaie vergaderzalen: bij Möppi viert u het kerstfeest midden in het wintersportgebied van Winterberg. Zodra u binnenstapt, proeft u de gezellige alpensfeer. Dankzij drie verdiepingen en een groot buitenterras kunt u de avond perfect indelen: een warm ontvangst met glühwein bij het vuur, een smakelijk diner van de lavagrill en aansluitend een bruisend après-ski feest met dj.',
    flyerImage: '/weihnachtsfeier-winterberg-bei-moeppi.png',
    badgeDe: 'Pisten-Location 2026',
    badgeNl: 'Piste-locatie 2026',
    contactEmail: 'anfrage@bei-moeppi.de',
    contactPhone: '02981 1073',
    website: 'https://www.bei-moeppi.de/archiv/weihnachtsfeier-location-winterberg/',
    bookingUrl: 'https://www.bei-moeppi.de/archiv/weihnachtsfeier-location-winterberg/',
    capacityDe: 'Firmen jeder Größe (ab 15 bis über 300 Personen)',
    capacityNl: 'Bedrijven en groepen van 15 tot meer dan 300 personen'
  },
  {
    id: 'veltins-eisarena-firmenevent-weihnachten-2026',
    businessId: 'veltins-eisarena',
    businessName: 'VELTINS-EisArena Winterberg',
    subtitleDe: 'Spektakuläres Firmenevent • IceTubing, Taxibob & Exklusiv-Lounge',
    subtitleNl: 'Spectaculair bedrijfsuitje • IceTubing, Taxibob & Panorama Lounge',
    titleDe: 'Weihnachtsfeier & Winter-Incentive in der VELTINS-EisArena',
    titleNl: 'Kerstfeest & Winter-Incentive in de VELTINS-EisArena',
    seasonDe: 'Wintersaison 2026 / 2027 • Mitte November bis Anfang März',
    seasonNl: 'Winterseizoen 2026 / 2027 • Half november tot begin maart',
    packageTypeDe: 'Action & Exklusiv-Lounge Event',
    packageTypeNl: 'Actie & exclusieve lounge',
    priceInfoDe: 'Individuelle Eventbausteine & Komplettpakete auf Anfrage',
    priceInfoNl: 'Maatwerk arrangementen en incentives op aanvraag',
    address: 'Kapperundweg, 59955 Winterberg',
    district: 'Winterberg',
    category: 'Sport & Eventlocation',
    subcategory: 'Kunsteisbahn & Tagungslounge',
    features: [
      {
        icon: 'sparkles',
        titleDe: 'IceTubing (bis 80 km/h)',
        titleNl: 'IceTubing (tot 80 km/u)',
        descDe: 'Adrenalin pur im Eiskanal: Im Reifen durch die legendäre Bobbahn sausen – einmalig in NRW!',
        descNl: 'Spectaculaire rit in een speciale band door het ijskanaal van de bobbahn – uniek in NRW!'
      },
      {
        icon: 'tree',
        titleDe: 'Bobbahn-Führung & Taxibob',
        titleNl: 'Baanrondleiding & Taxibob',
        descDe: 'Exklusiver Blick hinter die Kulissen der WM-Sportstätte oder High-Speed mit Bobpilot.',
        descNl: 'Exclusieve blik achter de schermen van de WK-locatie of meerijden in de taxibob.'
      },
      {
        icon: 'utensils',
        titleDe: 'Lounge mit Bergpanorama',
        titleNl: 'Lounge met bergpanorama',
        descDe: 'ZielArena Lounge & Panoramaraum für bis zu 200 Gäste mit exklusivem Fest-Catering.',
        descNl: 'Lounge en panoramazaal tot 200 gasten met uitzicht en feestelijk diner.'
      }
    ],
    highlightsDe: [
      'Exklusive WM-Sportstätte der weltbesten Kufensportler',
      'Einmalig in NRW: IceTubing mit bis zu 80 km/h im Eiskanal',
      'High-Speed Taxibob-Fahrten mit 130 km/h für den ultimativen Adrenalinkick',
      'Moderne VELTINS-EisArena Lounge mit Blick in den Zielauslauf',
      'Maßgeschneidertes Fest-Catering und individuelles Rahmenprogramm'
    ],
    highlightsNl: [
      'Officiële WK-locatie voor bobslee, rodelen en skeleton',
      'Uniek in NRW: IceTubing tot 80 km/u door de ijsbochten',
      'Adrenalinekick in de snelste taxibob van Europa met 130 km/u',
      'Moderne VELTINS-EisArena Lounge met zicht op de finish en bergen',
      'Feestelijke catering en professionele begeleiding van A tot Z'
    ],
    shortDescriptionDe: 'Das außergewöhnlichste Weihnachts-Incentive in NRW: Feiern Sie Ihre Firmen-Weihnachtsfeier an der VELTINS-EisArena mit IceTubing durch den Eiskanal, exklusiver Führung und erstklassigem Dinner in der Panorama-Lounge.',
    shortDescriptionNl: 'Het meest spectaculaire kerstuitje in het Sauerland: combineer IceTubing of een bobbahn-rondleiding met een sfeervol feestdiner in de exclusieve VELTINS-EisArena Lounge.',
    infoTextDe: 'Suchen Sie für Ihre Firmen-Weihnachtsfeier 2026 das absolute Highlight? Die VELTINS-EisArena in Winterberg kombiniert sportlichen Nervenkitzel mit stilvollem Ambiente: Rauschen Sie im 2er- oder 4er-IceTube mit bis zu 80 km/h durch den Eiskanal, werfen Sie bei einer exklusiven Bahnführung einen Blick hinter die Kulissen des Profisports oder wagen Sie eine Fahrt im Original-Taxibob. Anschließend empfängt Sie die VELTINS-EisArena Lounge oder der Panoramaraum im Starthaus 1 zu einem festlichen Abendessen mit atemberaubendem Blick über die winterlichen Sauerländer Berge.',
    infoTextNl: 'Op zoek naar een kerstviering waar uw collega\'s nog jaren over napraten? De VELTINS-EisArena combineert topsport, actie en een feestelijke loungesfeer. Race met IceTubes door de betonnen bochten, ontdek de geheimen van de bobsleebaan tijdens een rondleiding en sluit de dag af met een heerlijk diner in de sfeervolle lounge met panoramisch uitzicht over de bergen.',
    flyerImage: '/weihnachtsfeier-winterberg-veltins-eisarena.jpg',
    badgeDe: 'Adrenalin & Exklusiv 2026',
    badgeNl: 'Actie & Exclusief 2026',
    contactEmail: 'info@veltins-eisarena.de',
    contactPhone: '02981 92400',
    website: 'https://www.veltins-eisarena.de/incentives-veltins-eisarena/firmenevents',
    bookingUrl: 'https://www.veltins-eisarena.de/incentives-veltins-eisarena/firmenevents',
    capacityDe: 'Gruppen & Firmen bis zu 200 Personen',
    capacityNl: 'Groepen en bedrijven tot 200 personen'
  },
  {
    id: 'schoener-asten-resort-weihnachtsfeier-2026',
    businessId: 'familien-resort-schoener-asten-altastenberg',
    businessName: 'Hotel-Resort Der Schöne Asten',
    subtitleDe: 'Rundum-Sorglos Weihnachtsfeier mit Hotelzimmern & Wellness',
    subtitleNl: 'Compleet verzorgde kerstviering met hotelovernachting & wellness',
    titleDe: 'Weihnachtsfeier im Sauerland im Resort Der Schöne Asten',
    titleNl: 'Kerstfeest in het Sauerland bij Resort Der Schöne Asten',
    seasonDe: 'Saison 2026 / 2027 • Termine November bis Januar',
    seasonNl: 'Seizoen 2026 / 2027 • Data november tot januari',
    packageTypeDe: 'Hotel-Resort & Übernachtungs-Paket',
    packageTypeNl: 'Hotel-resort & overnachting',
    priceInfoDe: 'Individuelle Gesamtpakete inkl. Übernachtung auf Anfrage',
    priceInfoNl: 'Maatwerk totaalpakketten incl. overnachting op aanvraag',
    address: 'Renauweg 54, 59955 Winterberg-Altastenberg',
    district: 'Altastenberg',
    category: 'Hotels & Tagungsresort',
    subcategory: 'Hotel-Resort & Festsaal',
    features: [
      {
        icon: 'wine',
        titleDe: 'Glühweinempfang & Kamin',
        titleNl: 'Glühwein & open haard',
        descDe: 'Warmes Willkommen an der Feuerschale im Garten oder am knisternden Kaminfeuer.',
        descNl: 'Warm welkom bij de vuurschaal in de hoteltuin of bij de knapperende haard.'
      },
      {
        icon: 'utensils',
        titleDe: 'Festliches Buffet oder Menü',
        titleNl: 'Feestelijk buffet of diner',
        descDe: 'Große kulinarische Auswahl: Festtagsbuffets, 3- oder 4-Gänge-Weihnachtsmenü nach Wahl.',
        descNl: 'Culinair genieten: uitgebreid kerstbuffet of verfijnd meer-gangen feestmenu.'
      },
      {
        icon: 'sparkles',
        titleDe: 'Stressfrei mit Übernachtung',
        titleNl: 'Zorgeloos met overnachting',
        descDe: 'Feiern ohne Heimfahrt: Komfortable Hotelzimmer & Wellnessbereich mit Hallenbad am Morgen.',
        descNl: 'Geen zorgen over de terugrit: comfortabele kamers en ontspanning in het zwembad.'
      }
    ],
    highlightsDe: [
      'Idyllische Höhenlage auf knapp 800 m im Skidorf Altastenberg',
      'Festsäle und Veranstaltungsräume für kleine und große Gruppen',
      'Übernachtungsmöglichkeiten direkt vor Ort – stressfrei feiern ohne nächtliche Heimfahrt',
      'Individuelles Rahmenprogramm (Fackelwanderung, Loipen, Rodeln)',
      'Umfassende Beratung und persönliche Begleitung bei der Eventplanung'
    ],
    highlightsNl: [
      'Prachtige ligging op bijna 800 meter hoogte in Altastenberg',
      'Sfeervolle zalen en restaurants voor kleine en grote gezelschappen',
      'Overnachting in het hotel – zorgeloos feesten zonder nachtelijke terugreis',
      'Winterse buitenactiviteiten (fakkeltocht, langlaufen, sneeuwwandeling)',
      'Persoonlijke begeleiding en maatwerk organisatie voor bedrijven'
    ],
    flyerImage: '/weihnachtsfeier-winterberg-schoener-asten.jpg',
    badgeDe: 'Resort & Hotel 2026',
    badgeNl: 'Resort & Hotel 2026',
    contactEmail: 'info@resort-winterberg.de',
    contactPhone: '02981 8050',
    website: 'https://www.resort-winterberg.de/deutsch/sauerland-blog/tagungen/98-weihnachtsfeier-im-sauerland-winterberg-nrw',
    bookingUrl: 'https://www.resort-winterberg.de/deutsch/sauerland-blog/tagungen/98-weihnachtsfeier-im-sauerland-winterberg-nrw',
    capacityDe: 'Firmen, Unternehmen & Gruppen von 20 bis 150+ Personen',
    capacityNl: 'Bedrijven en verenigingen van 20 tot 150+ personen',
    shortDescriptionDe: 'Entspannt feiern mit Hotelkomfort: Der Schöne Asten in Altastenberg bietet maßgeschneiderte Firmen-Weihnachtsfeiern mit Festbuffet, Glühweinempfang, gemütlichem Kamin und der Möglichkeit zur Übernachtung.',
    shortDescriptionNl: 'Ontspannen vieren met hotelcomfort: Resort Der Schöne Asten in Altastenberg organiseert complete kerstvieringen met diner, glühwein bij het vuur en overnachting.',
    infoTextDe: 'Das Hotel-Resort „Der schöne Asten“ in Winterberg-Altastenberg hat sich auf die Ausrichtung unvergesslicher Firmen-Weihnachtsfeiern spezialisiert. Auf knapp 800 Metern Höhe gelegen, erwartet Ihr Team eine echte Winteridylle: Starten Sie mit einem wärmenden Glühweinempfang an der Feuerschale, genießen Sie ein exzellentes Festtagsmenü oder Buffet im Restaurant und feiern Sie unbeschwert bis in die Nacht – denn dank der Hotelzimmer im Haus entfällt die stressige Heimfahrt. Am nächsten Morgen starten alle gestärkt beim Bergfrühstück oder entspannen im Hallenbad und Saunabereich.',
    infoTextNl: 'Hotel-Resort Der Schöne Asten in Altastenberg is gespecialiseerd in het organiseren van geslaagde bedrijfskerstfeesten. Gelegen op bijna 800 meter hoogte geniet u van een winters sprookje. Begin met een glühweinontvangst in de tuin, schuif aan voor een feestelijk dinerbuffet en blijf comfortabel overnachten in het resort. De volgende ochtend geniet het team van een uitgebreid ontbijtbuffet en ontspanning in het zwembad.'
  }
];

export const CHRISTMAS_PARTY_MAP: Record<string, ChristmasPartyItem> = Object.fromEntries(
  CHRISTMAS_PARTY_DATA.map(item => [item.businessId, item])
);

/**
 * Generates an .ics calendar file for Christmas Party Planning 2026
 */
export function generateChristmasPartyIcs(party: ChristmasPartyItem): string {
  const startDate = '20261201T180000';
  const endDate = '20261201T230000';
  const now = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Winterberg-Verzeichnis//Weihnachtsfeier Winterberg 2026//DE',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:christmas-${party.id}@winterberg-verzeichnis.de`,
    `DTSTAMP:${now}`,
    `DTSTART:${startDate}`,
    `DTEND:${endDate}`,
    `SUMMARY:${party.titleDe}`,
    `DESCRIPTION:${party.shortDescriptionDe}\\n\\nKontakt: ${party.contactPhone} / ${party.contactEmail}\\nWeb: ${party.website}`,
    `LOCATION:${party.address}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');
}
