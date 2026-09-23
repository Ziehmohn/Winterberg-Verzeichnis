import React, { useState } from 'react';
import { 
  Sparkles, 
  Car, 
  Waves, 
  Compass, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  Phone, 
  Mail, 
  ExternalLink, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  ArrowLeft,
  ShieldCheck,
  Building2,
  Ticket
} from 'lucide-react';
import { ThemeConfig } from '../types';
import { businesses } from '../data';
import { getBusinessPath } from '../utils/routes';
import { UnderlinedHeading } from './NewsDetail';

interface HeimatCardPageProps {
  theme: ThemeConfig;
  lang: 'de' | 'nl';
  onBack: () => void;
  onSelectBusiness?: (slugOrPath: string) => void;
}

interface Attraction {
  name: string;
  name_nl: string;
  category: 'action' | 'wellness' | 'sport' | 'kultur' | 'ausflug';
  benefit: string;
  benefit_nl: string;
  description: string;
  description_nl: string;
  website: string;
  location: string;
  businessId?: string;
}

export default function HeimatCardPage({ theme, lang, onBack, onSelectBusiness }: HeimatCardPageProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const isNl = lang === 'nl';

  React.useEffect(() => {
    const pageTitle = isNl 
      ? 'Winterberg Card – Mein Heimatmoment (Burgerkaart) | De Winterberg Bedrijvengids'
      : 'Winterberg Card – Mein Heimatmoment (Bürgerkarte) | Das Winterberg Verzeichnis';
    document.title = pageTitle;

    const descContent = isNl
      ? 'Ontdek alle voordelen van de officiële WinterbergCard (HeimatCard): 90 minuten gratis parkeren, 12x zwemmen en meer dan 30 topattracties voor inwoners en werknemers.'
      : 'Alle Vorteile der offiziellen Winterberg Card (HeimatCard Bürgerkarte): 90 Minuten kostenfrei parken, 12x Hallenbad und über 30 Top-Freizeiterlebnisse für Einheimische und Beschäftigte.';

    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    const prevDesc = metaDesc.getAttribute('content') || '';
    metaDesc.setAttribute('content', descContent);

    window.scrollTo({ top: 0, behavior: 'instant' });

    return () => {
      if (prevDesc) metaDesc?.setAttribute('content', prevDesc);
    };
  }, [isNl]);

  const attractions: Attraction[] = [
    {
      name: 'Astenkick Megazipline',
      name_nl: 'Astenkick Megazipline',
      category: 'action',
      benefit: '1x Flug (sitzend oder liegend)',
      benefit_nl: '1x vlucht (zittend of liggend)',
      description: 'Adrenalinkick pur hoch über dem Hochsauerland: Auf der zweitlängsten Doppelseilrutsche Europas saust man mit bis zu 70 km/h ins Tal. Vorab-Terminreservierung erforderlich.',
      description_nl: 'Pure adrenaline boven het Sauerland: op de op één na langste kabelbaan van Europa suis je met 70 km/u door het dal. Vooraf reserveren verplicht.',
      website: 'https://www.astenkick.de',
      location: 'Altastenberg',
      businessId: 'astenkick-megazipline'
    },
    {
      name: 'Der Brabander Sauna & Spa',
      name_nl: 'Der Brabander Sauna & Spa',
      category: 'wellness',
      benefit: '1x 2 Stunden Saunalandschaft (Mo–Fr, ab 16 J.)',
      benefit_nl: '1x 2 uur saunalandschap (ma–vr, vanaf 16 jr.)',
      description: 'Wohltuende Auszeit für Körper und Seele: Großzügige Saunawelt mit balinesischem Ruhegarten, Aromasaunen, Tauchbecken und Wärmebänken. Reservierung erbeten.',
      description_nl: 'Heerlijk ontspannen in het sfeervolle saunacomplex met Balinese rusttuin, verschillende sauna\'s en koudwaterbad. Reservering gewenst.',
      website: 'https://www.saunawinterberg.de',
      location: 'Winterberg',
      businessId: '284'
    },
    {
      name: 'Kletterwald Winterberg',
      name_nl: 'Klimbos Winterberg',
      category: 'action',
      benefit: '1x Parcours-Klettern (Mo–Fr)',
      benefit_nl: '1x klimavontuur (ma–vr)',
      description: 'Hoch hinaus in den Wipfeln des Kappe-Berges: Fünf unterschiedliche Kletterparcours bieten Geschicklichkeitstests und Seilbahnen für jedes Erfahrungslevel.',
      description_nl: 'Klimmen tussen de boomtoppen op de Kappe: vijf uitdagende routes met hangbruggen en tokkelbanen voor jong en oud.',
      website: 'https://www.erlebnisbergkappe.de',
      location: 'Erlebnisberg Kappe',
      businessId: '123'
    },
    {
      name: 'Fly-Line Winterberg',
      name_nl: 'Fly-Line Winterberg',
      category: 'action',
      benefit: '1x Flugfahrt (Mo–Fr)',
      benefit_nl: '1x zweefvlucht (ma–vr)',
      description: 'Sanft und kurvenreich durch das Blätterdach: Im bequemen Hängegurtsystem gleitet man fast lautlos mit etwa 12 km/h hangabwärts mitten durch den Wald.',
      description_nl: 'Rustig en bochtig tussen de bomen door glijden: in een comfortabel tuigje daal je met ca. 12 km/u af door het bos.',
      website: 'https://www.erlebnisbergkappe.de',
      location: 'Erlebnisberg Kappe',
      businessId: '6'
    },
    {
      name: 'Panorama-Erlebnis-Brücke',
      name_nl: 'Panorama Belevenisbrug',
      category: 'ausflug',
      benefit: '1x freier Rundgang',
      benefit_nl: '1x gratis toegang',
      description: 'Atemberaubende Weitsichten über das Rothaargebirge: 435 Meter lange Aussichtsbrücke in 20 Metern Höhe inklusive abenteuerlicher Spaßelemente zum Klettern.',
      description_nl: 'Schitterend uitzicht over het Sauerland: 435 meter lange loopbrug op 20 meter hoogte met speelse klimelementen.',
      website: 'https://www.erlebnisbergkappe.de',
      location: 'Erlebnisberg Kappe',
      businessId: '125'
    },
    {
      name: 'Sommerrodelbahn Kappe',
      name_nl: 'Zomerrodelbaan Kappe',
      category: 'action',
      benefit: '1x Rodelfahrt talwärts',
      benefit_nl: '1x afdaling zomerrodelbaan',
      description: 'Kurvenspaß für die ganze Familie: Mit dem Schlepplift geht es bergauf, bevor der Rodelschlitten durch Steilkurven und Jumps rasant nach unten saust.',
      description_nl: 'Plezier voor het hele gezin: met de lift omhoog en vervolgens op volle snelheid door de scherpe bochten omlaag roetsjen.',
      website: 'https://www.erlebnisbergkappe.de',
      location: 'Erlebnisberg Kappe',
      businessId: '127'
    },
    {
      name: 'Sommerrodelbahn Herrloh-Blitz & Schanzen Wirbel',
      name_nl: 'Zomerrodelbanen Herrloh-Blitz & Schanzen Wirbel',
      category: 'action',
      benefit: '1x Fahrt auf einer der Sommerrodelbahnen',
      benefit_nl: '1x rit op een van de twee banen',
      description: 'Rasanter Fahrspaß direkt am Herrloh und der St.-Georg-Schanze: Zur Wahl stehen 600 oder 700 Meter Bahnlänge mit Tunneln, Kehren und Kreiseln.',
      description_nl: 'Snelheid en actie bij de schans: keuze uit twee banen van 600 of 700 meter lengte met tunnels en steile bochten.',
      website: 'https://www.skiliftkarussell.de',
      location: 'Winterberg Herrloh',
      businessId: '286'
    },
    {
      name: 'Adventure Golf Kappe',
      name_nl: 'Adventure Golf Kappe',
      category: 'sport',
      benefit: '1 komplette Runde (18 Bahnen)',
      benefit_nl: '1 ronde minigolf (18 holes)',
      description: 'Minigolf im modernen Gewand: Naturnah modellierte Bahnen mit Steinformationen, Gefällen und Raffinessen für spannende Duelle mit Freunden oder Familie.',
      description_nl: 'Minigolf in een modern jasje: fraai aangelegde kunstgrasbanen met natuurlijke hindernissen voor een gezellige competitie.',
      website: 'https://www.erlebnisbergkappe.de',
      location: 'Erlebnisberg Kappe',
      businessId: '128'
    },
    {
      name: 'Mini- & Billardgolf Kurparkstuben',
      name_nl: 'Mini- & Biljartgolf Kurparkstuben',
      category: 'sport',
      benefit: '1x Minigolf & 1x Pit-Pat Billardgolf',
      benefit_nl: '1x minigolf & 1x pit-pat biljartgolf',
      description: 'Zwei Geschicklichkeitsklassiker mitten im Grünen des Winterberger Kurparks: Klassischer Minigolfkurs plus die faszinierende Kombination aus Billard und Hindernisparcours.',
      description_nl: 'Twee klassiekers in het groen van het Kurpark: een klassieke minigolfbaan én het geliefde pit-pat biljartgolf.',
      website: 'https://www.kurparkstuben-winterberg.de',
      location: 'Kurpark Winterberg',
      businessId: 'kurparkstuben-minigolf'
    },
    {
      name: 'Schwimmbad Winterberg (Hallenbad Oversum)',
      name_nl: 'Zwembad Winterberg (Oversum)',
      category: 'wellness',
      benefit: '12x freier Eintritt (auch in Nass.Mobil inkl.)',
      benefit_nl: '12x gratis toegang (ook in Nass.Mobil)',
      description: 'Das moderne städtische Hallenbad am Kurpark lädt zum sportlichen Bahnenziehen im 28 Grad warmen Wasser ein – ideal für regelmäßiges Training und Entspannung.',
      description_nl: 'Modern overdekt zwembad aan het Kurpark: perfect om baantjes te trekken in het 28 graden warme water of ontspannen te genieten.',
      website: 'https://www.schwimmbad-winterberg.de',
      location: 'Winterberg',
      businessId: 'schwimmbad-winterberg'
    },
    {
      name: 'Freibad Siedlinghausen',
      name_nl: 'Openluchtzwembad Siedlinghausen',
      category: 'wellness',
      benefit: '1x Sommereintritt ins Freibad',
      benefit_nl: '1x toegang tot het openluchtbad',
      description: 'Herrliches Sommerbadvergnügen unter freiem Himmel: Beheizte Schwimmbecken, Wasserrutsche, Planschbereich und eine gepflegte Liegewiese im Grünen.',
      description_nl: 'Heerlijk buiten zwemmen in de zomer: verwarmde baden, waterglijbaan, peuterbad en een ruime zonneweide.',
      website: 'https://www.baederverein-siedlinghausen.de',
      location: 'Siedlinghausen',
      businessId: 'freibad-siedlinghausen'
    },
    {
      name: 'Sportzentrum Hochsauerland',
      name_nl: 'Sportcentrum Hochsauerland',
      category: 'sport',
      benefit: '1 Stunde Tennis oder Squash (Mo–Fr)',
      benefit_nl: '1 uur tennis of squash (ma–vr)',
      description: 'Matchball bei jedem Wetter: Eine volle Stunde Hallensport auf erstklassigen Tennis- oder Squash-Courts nach vorheriger Platzbuchung.',
      description_nl: 'Sporten ongeacht het weer: een heel uur tennissen of squashen op uitstekende binnenbanen (vooraf reserveren).',
      website: 'https://www.sportzentrum-hochsauerland.de',
      location: 'Winterberg',
      businessId: 'sportzentrum-hochsauerland'
    },
    {
      name: 'VELTINS-EisArena (Event-Eintritt & Führung)',
      name_nl: 'VELTINS-EisArena (Events & Rondleiding)',
      category: 'kultur',
      benefit: '1x Event-Ticket (Weltcup) + 1x Bahnführung',
      benefit_nl: '1x event-ticket (wereldbeker) + 1x rondleiding',
      description: 'Hautnah an der weltberühmten Eisrinne: Die schnellsten Bob-, Rodel- und Skeletonsportler bei Weltcup-Rennen anfeuern und bei einer exklusiven Führung den Eiskanal erkunden.',
      description_nl: 'Beleef de wereldtop in bobslee en skeleton live langs de snelle ijsbaan, of neem deel aan een interessante rondleiding achter de schermen.',
      website: 'https://www.veltins-eisarena.de',
      location: 'Winterberg',
      businessId: 'veltins-eisarena'
    },
    {
      name: 'Kartfun Neuastenberg',
      name_nl: 'Kartfun Neuastenberg',
      category: 'action',
      benefit: '1x 10-Minuten-Fahrt (werktags)',
      benefit_nl: '1x 10 minuten karten (werkdagen)',
      description: 'Echtes Rennsportgefühl auf einer der modernsten Indoor-Kartstrecken Deutschlands: Schnelle Geraden, anspruchsvolle Kurvenkombinationen und moderne Karts.',
      description_nl: 'Echte racesensatie op een van de modernste overdekte kartbanen van Duitsland met 550 meter asfalt en snelle bochten.',
      website: 'https://www.kartfun-astenberg.de',
      location: 'Neuastenberg',
      businessId: 'kartfun-neuastenberg'
    },
    {
      name: 'Bikeverleih PRO BIKER',
      name_nl: 'Fietsverhuur PRO BIKER',
      category: 'sport',
      benefit: '1x E-Mountainbike-Tagesleihe (Mo–Fr außerhalb Ferien)',
      benefit_nl: '1x daghuur e-mountainbike (ma–vr buiten schoolvakanties)',
      description: 'Auf zwei Rädern durch die Sauerländer Bergwelt: Leistungsstarkes E-MTB ausleihen und die schönsten Waldtrails und Hochheiden rund um den Kahlen Asten erobern.',
      description_nl: 'Verken de heuvels op een moderne elektrische mountainbike en ontdek de panoramische routes rond de Kahler Asten.',
      website: 'https://www.pro-biker.de',
      location: 'Winterberg',
      businessId: '199'
    },
    {
      name: 'Pferdefuhrhalterei Winterberg',
      name_nl: 'Huifkartocht Paardenhouderij',
      category: 'ausflug',
      benefit: '1x Planwagenfahrt (freitags um 14 Uhr)',
      benefit_nl: '1x huifkartocht (vrijdag 14:00 uur)',
      description: 'Entschleunigung auf traditionelle Art: Im gemütlichen Planwagen, gezogen von kräftigen Kaltblutpferden, durch die idyllischen Wälder und Täler reisen.',
      description_nl: 'Geniet van een sfeervolle rit in een traditionele huifkar, getrokken door sterke koudbloedpaarden door de prachtige natuur.',
      website: 'https://www.pferdefuhrhalterei.de',
      location: 'Winterberg',
      businessId: '295'
    },
    {
      name: 'Landhotel Grimmeblick (Bergwerk-Kegelbahn)',
      name_nl: 'Landhotel Grimmeblick (Mijn-kegelbaan)',
      category: 'sport',
      benefit: '1x zwei Stunden Erlebnis-Kegeln',
      benefit_nl: '1x 2 uur belevingskegelen',
      description: 'Einzigartiges Kegelvergnügen in einer nachgebildeten Zechenlandschaft mit schummrigem Schwarzlicht und überraschenden Lichteffekten.',
      description_nl: 'Bijzonder kegelen in een nagebouwde historische mijnschacht met sfeervol blacklight en speciale effecten.',
      website: 'https://www.grimmeblick.de',
      location: 'Altastenberg',
      businessId: '187'
    },
    {
      name: 'Die Tenne Winterberg',
      name_nl: 'Die Tenne Winterberg',
      category: 'action',
      benefit: '1x TenneCard Clubvorteil',
      benefit_nl: '1x TenneCard clubvoordeel',
      description: 'Winterbergs Party-Institution im Ortskern: Vielfältige Dancefloors von Schlager über Charts bis Club-Sounds und gemütliche Kneipenbereiche.',
      description_nl: 'Het bekende uitgaanscentrum in het centrum van Winterberg met meerdere muziekzalen, bar en dansvloeren.',
      website: 'https://www.tenne-winterberg.de',
      location: 'Winterberg',
      businessId: 'tenne-winterberg'
    },
    {
      name: 'Westdeutsches Wintersport-Museum',
      name_nl: 'West-Duits Wintersportmuseum',
      category: 'kultur',
      benefit: '1x Museumseintritt',
      benefit_nl: '1x toegang museum',
      description: 'Faszinierende Zeitreise in Neuastenberg: Historische Holzski, Skiausrüstungen früherer Jahrzehnte und die spannende Geschichte des Tourismus im Hochsauerland.',
      description_nl: 'Fascinerende blik op de geschiedenis van de wintersport in het Sauerland: van antieke houten ski\'s tot hedendaagse kampioenen.',
      website: 'https://www.skimuseum-winterberg.de',
      location: 'Neuastenberg',
      businessId: 'westdeutsches-wintersport-museum'
    },
    {
      name: 'Kappe Express & 6er Sesselbahn',
      name_nl: 'Kappe Express & 6-persoons Stoeltjeslift',
      category: 'ausflug',
      benefit: '1x Fahrt im Panoramazug + 1x Sesselliftfahrt',
      benefit_nl: '1x rit panoramatrein + 1x stoeltjeslift',
      description: 'Bequem vom Stadtzentrum zum Erlebnisberg und mit der modernen Sesselbahn aussichtsreich über die Hänge schweben.',
      description_nl: 'Gemakkelijk met het toeristentreintje van de stad naar de belevingsberg en met de stoeltjeslift genieten van het uitzicht.',
      website: 'https://www.erlebnisbergkappe.de',
      location: 'Erlebnisberg Kappe',
      businessId: '6'
    },
    {
      name: 'Stadtmarketing Winterberg (KuKuK Kulturabende)',
      name_nl: 'Stadtmarketing Winterberg (KuKuK Cultuur)',
      category: 'kultur',
      benefit: '1x Eintritt zu einer KuKuK-Veranstaltung (VVK)',
      benefit_nl: '1x toegang tot KuKuK-voorstelling (voorverkoop)',
      description: 'Feinsinnige Bühnenkunst direkt vor Ort: Konzerte, Kabarett, Theater und Comedy im Rahmen der bekannten Winterberger KuKuK-Kulturreihe.',
      description_nl: 'Hoogwaardige cultuurvoorstellingen in Winterberg: cabaret, muziek, toneel en comedy georganiseerd door Stadtmarketing.',
      website: 'https://www.kukuk-winterberg.de',
      location: 'Winterberg',
      businessId: 'winterberg-touristik'
    },
    {
      name: 'Geführte Altstadtrundgänge Winterberg & Hallenberg',
      name_nl: 'Stadswandelingen Winterberg & Hallenberg',
      category: 'kultur',
      benefit: '1x Stadtführung in Winterberg oder Nachtwächtertour Hallenberg',
      benefit_nl: '1x stadswandeling of nachtwachttocht',
      description: 'Verborgene Ecken, Fachwerkhistorie und spannende Anekdoten aus vergangenen Jahrhunderten in den malerischen Gassen der Nachbarstädte.',
      description_nl: 'Ontdek de geschiedenis, vakwerkhuizen en spannende verhalen over het verleden van Winterberg en Hallenberg.',
      website: 'https://www.winterberg.de',
      location: 'Winterberg / Hallenberg',
      businessId: 'winterberg-touristik'
    },
    {
      name: 'Ettelsberg-Kabinenseilbahn Willingen',
      name_nl: 'Ettelsberg Kabelbaan Willingen',
      category: 'ausflug',
      benefit: '1x Berg- und Talfahrt mit der Gondel',
      benefit_nl: '1x retour bergrit kabelbaan',
      description: 'Mit modernen Panorama-Gondeln auf den 838 Meter hohen Ettelsberg schweben, den Hochheideturm erklimmen und die Aussicht genießen.',
      description_nl: 'Zweef in moderne gondels naar de top van de Ettelsberg op 838 meter hoogte en bezoek de uitzichttoren.',
      website: 'https://www.ettelsberg-seilbahn.de',
      location: 'Willingen'
    },
    {
      name: 'Personenschifffahrt Biggesee',
      name_nl: 'Rondvaartboot Biggesee',
      category: 'ausflug',
      benefit: '1x 90-minütige Seerundfahrt (werktags bis 13 Uhr)',
      benefit_nl: '1x 90 minuten rondvaart (werkdagen tot 13 uur)',
      description: 'Maritimes Flair mitten in Westfalen: Eine entspannte Schiffsrundfahrt auf den weiten Wasserflächen des Biggesees.',
      description_nl: 'Heerlijk uitwaaien op het water: een ontspannen boottocht over het uitgestrekte stuwmeer van de Biggesee.',
      website: 'https://www.biggesee.de',
      location: 'Biggesee (Olpe)'
    },
    {
      name: 'Sauerland-Museum Arnsberg',
      name_nl: 'Sauerland-Museum Arnsberg',
      category: 'kultur',
      benefit: '1x Tageseintritt (Dauer- und Sonderausstellung)',
      benefit_nl: '1x dagkaart museum & exposities',
      description: 'Das preisgekrönte Kultur- und Geschichtsmuseum der Region im geschichtsträchtigen Landsberger Hof mit interaktiven Ausstellungen.',
      description_nl: 'Het toonaangevende museum voor de cultuurgeschiedenis van het Sauerland in het historische paleis in Arnsberg.',
      website: 'https://www.sauerland-museum.de',
      location: 'Arnsberg'
    },
    {
      name: 'Heinz Nixdorf MuseumsForum Paderborn',
      name_nl: 'Heinz Nixdorf MuseumsForum Paderborn',
      category: 'kultur',
      benefit: '1x Museumseintritt',
      benefit_nl: '1x toegang museum',
      description: 'Das weltgrößte Computermuseum: Eine fesselnde Reise durch 5.000 Jahre Informations- und Kommunikationstechnologie.',
      description_nl: '\'s Werelds grootste computermuseum: interactieve ontdekkingstocht door 5.000 jaar communicatietechnologie en computers.',
      website: 'https://www.hnf.de',
      location: 'Paderborn'
    },
    {
      name: 'Residenzschloss Bad Arolsen',
      name_nl: 'Residentieslot Bad Arolsen',
      category: 'kultur',
      benefit: '1x Eintritt in die Ausstellung',
      benefit_nl: '1x toegang kasteeltentoonstelling',
      description: 'Barocke Prachtarchitektur im waldeckischen Versailles: Bedeutende Sammlungen zur Jagd- und Militärgeschichte in herrschaftlichen Sälen.',
      description_nl: 'Prachtig barokkasteel naar voorbeeld van Versailles met indrukwekkende historische vertrekken en collecties.',
      website: 'https://www.schloss-arolsen.de',
      location: 'Bad Arolsen'
    },
    {
      name: 'Disc Golf Park Altastenberg',
      name_nl: 'Disc Golf Park Altastenberg',
      category: 'sport',
      benefit: '1x Frisbeescheiben-Ausleihe (mit Pfand)',
      benefit_nl: '1x frisbeeschijf huur (met borg)',
      description: 'Trendsportart in gesunder Höhenluft: Mit speziellen Frisbees wird über Wiesen und Hänge nach Zielen geworfen – Spaß für Jung und Alt.',
      description_nl: 'Actieve buitensport in de berglucht: gooi de speciale frisbee in zo min mogelijk worpen in de doelmanden op de berghelling.',
      website: 'https://www.altastenberg.de',
      location: 'Altastenberg'
    },
    {
      name: 'Baumpflanz-Aktion im Winterberger Stadtwald',
      name_nl: 'Boomplantactie in het stadsbos',
      category: 'ausflug',
      benefit: '1x aktives Pflanzen eines eigenen Baumes (Oster-/Herbstferien)',
      benefit_nl: '1x zelf een boom planten (vakanties)',
      description: 'Aktiv zur Zukunft unserer Wälder beitragen: Bei geführten Pflanzaktionen setzen HeimatCard-Inhaber selbst junge Setzlinge im Revier.',
      description_nl: 'Draag bij aan de natuur: plant je eigen boompje in het stadsbos van Winterberg tijdens speciale actiedagen.',
      website: 'https://www.rathaus-winterberg.de',
      location: 'Winterberg Stadtwald'
    },
    {
      name: 'Wanderkarte & Broschüre Goldener Pfad',
      name_nl: 'Wandelkaart & Gids Gouden Pad',
      category: 'ausflug',
      benefit: '1x detaillierte Wanderkarte & Erlebnisbroschüre',
      benefit_nl: '1x wandelkaart & brochure',
      description: 'Die besten Routen der Region griffbereit in der Tasche: Kostenfreie Ausgabe in der Tourist-Information am Kurpark.',
      description_nl: 'Ontvang een complete wandelkaart en gids over het landschapstherapiepad op de Niedersfelder Hochheide.',
      website: 'https://www.winterberg.de',
      location: 'Tourist-Info Winterberg',
      businessId: 'winterberg-touristik'
    }
  ];

  const categoriesList = [
    { id: 'all', label: isNl ? 'Alle voordelen (30+)' : 'Alle Angebote (30+)' },
    { id: 'action', label: isNl ? 'Actie & Avontuur' : 'Action & Abenteuer' },
    { id: 'wellness', label: isNl ? 'Wellness & Zwemmen' : 'Wellness & Baden' },
    { id: 'sport', label: isNl ? 'Sport & Outdoor' : 'Sport & Outdoor' },
    { id: 'kultur', label: isNl ? 'Cultuur & Musea' : 'Kultur & Museen' },
    { id: 'ausflug', label: isNl ? 'Uitstapjes & Natuur' : 'Ausflüge & Natur' }
  ];

  const filteredAttractions = selectedCategory === 'all' 
    ? attractions 
    : attractions.filter(a => a.category === selectedCategory);

  const faqs = [
    {
      q: isNl ? 'Wie kan de WinterbergCard kopen?' : 'Wer kann die HeimatCard erwerben?',
      a: isNl 
        ? 'De kaart is exclusief ontwikkeld voor iedereen die in de gemeente Winterberg (inclusief alle dorpen zoals Züschen, Siedlinghausen, Niedersfeld etc.) woont met een eerste of tweede verblijfplaats, of die werkzaam is bij een bedrijf in Winterberg.' 
        : 'Die Karte richtet sich gezielt an alle, die in der Stadt Winterberg oder einem ihrer 14 Ortsteile gemeldet sind (mit Erst- oder Zweitwohnsitz) sowie an alle Arbeitnehmerinnen und Arbeitnehmer, die in einem Winterberger Betrieb beschäftigt sind.'
    },
    {
      q: isNl ? 'Wat is het verschil tussen de tarieven Nass.Mobil en Aktiv.Entspannt?' : 'Worin unterscheiden sich Nass.Mobil und Aktiv.Entspannt?',
      a: isNl 
        ? '„Nass.Mobil“ (25 € voor volwassenen / 20 € voor kinderen tot 16 jaar) is de basispas voor het dagelijks leven: het biedt het hele jaar door 90 minuten gratis parkeren op 11 stadspleinen plus 12 bezoeken aan het overdekte zwembad. „Aktiv.Entspannt“ (50 € / 40 €) bevat alles van Nass.Mobil PLUS toegang tot meer dan 30 regionale topattracties met een totale waarde van ruim 350 €.' 
        : '„Nass.Mobil“ (25 € Erwachsene / 20 € Kinder bis 16 Jahre) ist der ideale Alltagsbegleiter mit ganzjährig 90 Minuten Gratisparken auf 11 Parkplätzen und 12 Eintritten ins Schwimmbad Winterberg. „Aktiv.Entspannt“ (50 € Erwachsene / 40 € Kinder) beinhaltet das komplette Nass.Mobil-Paket und schaltet zusätzlich über 30 regionale Top-Freizeitattraktionen im Gesamtwert von über 350 € frei.'
    },
    {
      q: isNl ? 'Hoe werkt het 90 minuten gratis parkeren in de praktijk?' : 'Wie funktioniert das 90-Minuten-Gratisparken in der Praxis?',
      a: isNl 
        ? 'Bij aankoop van de kaart wordt uw autokenteken geregistreerd en ontvangt u een parkeerkaart. Plaats deze parkeerkaart samen met uw blauwe parkeerschijf duidelijk zichtbaar achter de voorruit van uw auto. Hiermee parkeert u 90 minuten gratis op alle deelnemende gemeentelijke parkeerterreinen.' 
        : 'Beim Kauf der HeimatCard wird das amtliche Kennzeichen Ihres Pkw hinterlegt und Sie erhalten einen Berechtigungsausweis. Legen Sie diesen zusammen mit einer normalen blauen Parkscheibe gut sichtbar hinter die Windschutzscheibe. Sie parken damit auf allen 11 ausgewiesenen städtischen Parkflächen 90 Minuten kostenlos.'
    },
    {
      q: isNl ? 'Wat is de geldigheidsperiode van de kaart?' : 'Welcher Gültigkeitszeitraum gilt für die Karte?',
      a: isNl 
        ? 'De kaart geldt altijd voor één kalenderjaar, vanaf het moment van aankoop (op zijn vroegst vanaf 1 januari) tot en met 31 december van hetzelfde jaar.' 
        : 'Die Gültigkeit umfasst ein volles Kalenderjahr – jeweils vom Tag der Ausstellung (frühestens ab dem 01. Januar) bis zum 31. Dezember des betreffenden Jahres.'
    },
    {
      q: isNl ? 'Waar kan ik de kaart aanvragen en afhalen?' : 'Wo erhalte ich die HeimatCard?',
      a: isNl 
        ? 'De kaart is persoonlijk verkrijgbaar bij de balie van de Tourist-Information Winterberg (Winterberg Touristik und Wirtschaft GmbH, Am Kurpark 4, 59955 Winterberg).' 
        : 'Die Karte wird persönlich vor Ort in der Tourist-Information Winterberg (Winterberg Touristik und Wirtschaft GmbH, Am Kurpark 4, 59955 Winterberg, Tel.: 02981 92500) ausgestellt.'
    },
    {
      q: isNl ? 'Wat gebeurt er met het zwembadmuntje aan het einde van het jaar?' : 'Was muss ich bezüglich des Schwimmbad-Coins beachten?',
      a: isNl 
        ? 'Het elektronische zwembad-muntje moet vóór 15 januari van het volgende jaar weer worden ingeleverd bij de Tourist-Info, ongeacht of alle 12 bezoeken zijn gebruikt. Bij verlies of niet-inleveren geldt een vergoeding van 5 Euro.' 
        : 'Der Chip-Coin für das Schwimmbad Winterberg ist unabhängig von der Anzahl der tatsächlich genutzten Eintritte bis spätestens zum 15. Januar des Folgejahres in der Tourist-Information zurückzugeben. Andernfalls wird ein Pfandbetrag von 5 Euro fällig.'
    },
    {
      q: isNl ? 'Mag de kaart worden doorgegeven aan familieleden of vrienden?' : 'Ist die Karte übertragbar?',
      a: isNl 
        ? 'Nee, de kaart is strikt persoonsgebonden. Zowel de naam van de houder als het kenteken worden vastgelegd. Bij de aangesloten attracties dient een identiteitsbewijs te worden getoond.' 
        : 'Nein, die HeimatCard ist personengebunden und nicht auf andere Personen übertragbar. Bei den Partnerbetrieben wird zur Legitimation ein amtlicher Lichtbildausweis herangezogen.'
    }
  ];

  return (
    <div className="max-w-[1140px] mx-auto py-8 sm:py-12 px-4 sm:px-6">
      {/* Back button */}
      <button 
        onClick={onBack}
        className="inline-flex items-center gap-2 text-sm font-semibold text-[#5F6B63] hover:text-[#0F4C2E] mb-6 transition-colors group cursor-pointer"
      >
        <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
        {isNl ? 'Terug naar overzicht' : 'Zurück zur Übersicht'}
      </button>

      {/* Hero Banner */}
      <div className="relative bg-gradient-to-br from-[#0F4C2E] via-[#145A38] to-[#0A3822] rounded-3xl p-6 sm:p-10 md:p-12 text-white overflow-hidden shadow-xl mb-12">
        <div className="relative z-10 max-w-[780px]">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 text-[#FCD34D] text-xs sm:text-sm font-bold tracking-wide uppercase mb-4 backdrop-blur-xs border border-white/20">
            <Sparkles size={15} />
            {isNl ? 'De officiële burgerkaart voor Winterberg' : 'Die offizielle Bürgerkarte für Einheimische & Beschäftigte'}
          </div>

          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight mb-4 tracking-tight">
            Winterberg Card <br className="hidden sm:inline" />
            <span className="text-[#ffc084]">Mein Heimatmoment</span>
          </h1>

          <p className="text-white/90 text-base sm:text-lg md:text-xl leading-relaxed mb-6 font-normal">
            {isNl 
              ? 'Wonen en werken in Winterberg heeft ontzettend veel te bieden. Met de officiële burgerkaart haal je het maximale uit je eigen streek: 90 minuten gratis parkeren bij het boodschappen doen, 12x ontspannen zwemmen én gratis toegang tot ruim 30 topattracties – al vanaf 25 Euro per jaar!'
              : 'Leben und arbeiten, wo andere Urlaub machen: Mit der offiziellen HeimatCard der Stadt Winterberg genießen Bürgerinnen, Bürger und im Stadtgebiet Beschäftigte herausragende Privilegien. Ob 90 Minuten freies Parken bei Erledigungen, 12 Besuche im städtischen Hallenbad oder über 30 Freizeit-Highlights vor der eigenen Haustür – hier spart die ganze Familie!'}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="bg-white/10 rounded-xl p-3 border border-white/10 text-center">
              <div className="text-2xl font-black text-white">ab 25 €</div>
              <div className="text-xs text-white/80">{isNl ? 'Jaarkaart' : 'Pro Kalenderjahr'}</div>
            </div>
            <div className="bg-white/10 rounded-xl p-3 border border-white/10 text-center">
              <div className="text-2xl font-black text-white">90 Min.</div>
              <div className="text-xs text-white/80">{isNl ? 'Gratis parkeren' : 'Freies Parken'}</div>
            </div>
            <div className="bg-white/10 rounded-xl p-3 border border-white/10 text-center">
              <div className="text-2xl font-black text-white">12x</div>
              <div className="text-xs text-white/80">{isNl ? 'Zwemmen Winterberg' : 'Hallenbad-Eintritt'}</div>
            </div>
            <div className="bg-white/10 rounded-xl p-3 border border-white/10 text-center">
              <div className="text-2xl font-black text-white">30+</div>
              <div className="text-xs text-white/80">{isNl ? 'Topattracties gratis' : 'Freizeit-Erlebnisse'}</div>
            </div>
          </div>
        </div>

        {/* Decorative background shapes */}
        <div className="absolute -bottom-16 -right-16 w-80 h-80 rounded-full bg-white/5 pointer-events-none blur-2xl" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#F2761B]/10 rounded-full pointer-events-none blur-3xl" />
      </div>

      {/* Tariffs Comparison */}
      <div className="mb-16">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <UnderlinedHeading 
            text={isNl ? 'Twee sterke tarieven voor elke behoefte' : 'Zwei maßgeschneiderte Tarife für deinen Alltag'} 
            as="h2" 
          />
          <p className="text-[#5F6B63] text-sm sm:text-base mt-3">
            {isNl 
              ? 'Kies het pakket dat bij je past: van de handige parkeer- en zwempas tot het complete avonturenpakket voor het hele gezin.' 
              : 'Wähle das Modell, das am besten zu deinen Lebensgewohnheiten passt – von der täglichen Alltagserleichterung bis zum vollen Abenteuerprogramm.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {/* Tariff 1: Nass.Mobil */}
          <div className="bg-white border-2 border-[#EDE8E0] rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-xs hover:border-[#0F4C2E]/40 transition-all">
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[#0F4C2E] bg-[#EAF2EC] px-3 py-1 rounded-full">
                  {isNl ? 'Voor het dagelijks leven' : 'Der Alltagsbegleiter'}
                </span>
                <span className="text-xs text-[#5F6B63] font-medium">{isNl ? 'Basispakket' : 'Basis-Tarif'}</span>
              </div>

              <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#1B211D] mb-1">
                Nass.Mobil
              </h3>
              <p className="text-xs sm:text-sm text-[#5F6B63] mb-6">
                {isNl ? 'Perfect voor wie geregeld in Winterberg parkeert en graag zwemt.' : 'Ideal für Erledigungen in der Innenstadt und regelmäßige Schwimmbad-Besuche.'}
              </p>

              <div className="flex items-baseline gap-2 mb-6 pb-6 border-b border-[#EDE8E0]">
                <span className="text-4xl font-black text-[#0F4C2E]">25 €</span>
                <span className="text-sm text-[#5F6B63]">{isNl ? 'voor volwassenen' : 'Erwachsene'}</span>
                <span className="text-xs text-[#5F6B63] ml-2">({isNl ? 'Kinderen tot 16 jr.: 20 €' : 'Kinder bis 16 J.: 20 €'})</span>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <Car className="w-5 h-5 text-[#0F4C2E] shrink-0 mt-0.5" />
                  <div className="text-sm sm:text-[15px] text-[#2F3A33]">
                    <strong>{isNl ? '90 minuten gratis parkeren' : '90 Minuten kostenfreies Parken'}</strong> {isNl ? 'op 11 centrale parkeerterreinen in Winterberg.' : 'auf 11 zentralen städtischen Parkflächen im gesamten Stadtgebiet.'}
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Waves className="w-5 h-5 text-[#0F4C2E] shrink-0 mt-0.5" />
                  <div className="text-sm sm:text-[15px] text-[#2F3A33]">
                    <strong>{isNl ? '12x gratis toegang tot het overdekte zwembad' : '12 kostenfreie Eintritte ins Hallenbad Winterberg'}</strong> {isNl ? 'in het Oversum (28 °C sportbad).' : 'am Kurpark (im Oversum) für sportliche Bahnen und Entspannung.'}
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#0F4C2E] shrink-0 mt-0.5" />
                  <div className="text-sm sm:text-[15px] text-[#2F3A33]">
                    {isNl ? 'Geldig voor één heel kalenderjaar (januari t/m december).' : 'Volle 12 Monate Gültigkeit für ein komplettes Kalenderjahr.'}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#EDE8E0] text-xs text-[#5F6B63] flex items-center justify-between">
              <span>{isNl ? 'Verkrijgbaar bij Tourist-Info' : 'Erhältlich bei der Tourist-Info'}</span>
              <span className="font-semibold text-[#0F4C2E]">Am Kurpark 4</span>
            </div>
          </div>

          {/* Tariff 2: Aktiv.Entspannt */}
          <div className="relative bg-gradient-to-b from-[#F3FAF5] to-white border-2 border-[#0F4C2E] rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-lg">
            <div className="absolute -top-3.5 right-6 bg-[#F2761B] text-white text-[11px] font-bold uppercase tracking-wider px-3.5 py-1 rounded-full shadow-xs">
              {isNl ? 'Meest gekozen' : 'Beste Empfehlung'}
            </div>

            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-white bg-[#0F4C2E] px-3 py-1 rounded-full">
                  {isNl ? 'Vrijetijd & Beleving' : 'Das Rundum-Sorglos-Paket'}
                </span>
                <span className="text-xs text-[#0F4C2E] font-bold">{isNl ? 'Alles-in-1' : '30+ Erlebnisse'}</span>
              </div>

              <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#1B211D] mb-1">
                Aktiv.Entspannt
              </h3>
              <p className="text-xs sm:text-sm text-[#5F6B63] mb-6">
                {isNl ? 'Maximale afwisseling voor gezinnen, sporters en cultuurliefhebbers.' : 'Für alle, die ihre Region aktiv erkunden und das volle Freizeitangebot auskosten möchten.'}
              </p>

              <div className="flex items-baseline gap-2 mb-6 pb-6 border-b border-[#0F4C2E]/20">
                <span className="text-4xl font-black text-[#0F4C2E]">50 €</span>
                <span className="text-sm text-[#5F6B63]">{isNl ? 'voor volwassenen' : 'Erwachsene'}</span>
                <span className="text-xs text-[#5F6B63] ml-2">({isNl ? 'Kinderen tot 16 jr.: 40 €' : 'Kinder bis 16 J.: 40 €'})</span>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#0F4C2E] shrink-0 mt-0.5" />
                  <div className="text-sm sm:text-[15px] text-[#2F3A33]">
                    <strong>{isNl ? 'Inclusief alle voordelen van Nass.Mobil' : 'Vollständiges Leistungspaket von Nass.Mobil enthalten'}</strong> (90 Min. Gratisparken & 12x Hallenbad-Eintritt).
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#0F4C2E] shrink-0 mt-0.5" />
                  <div className="text-sm sm:text-[15px] text-[#2F3A33]">
                    <strong>{isNl ? 'Meer dan 30 gratis topattracties' : 'Über 30 kostenfreie Freizeit- & Ausflugsziele'}</strong> (Astenkick Megazipline, Brabander Sauna, Kletterwald, Fly-Line, Sommerrodelbahnen, EisArena Bobbahn uvm.).
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#0F4C2E] shrink-0 mt-0.5" />
                  <div className="text-sm sm:text-[15px] text-[#2F3A33]">
                    <strong>{isNl ? 'Gezamenlijke waarde van ruim 350 €' : 'Gesamtwert aller Einzelleistungen über 350 €'}</strong> {isNl ? '– enorme besparing bij een investering van slechts 50 €!' : '– unschlagbarer Erlebnisfaktor für ein ganzes Jahr!'}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#0F4C2E]/20 text-xs text-[#0F4C2E] font-medium flex items-center justify-between">
              <span>{isNl ? 'Verkrijgbaar bij Tourist-Info Winterberg' : 'Ausstellung in der Tourist-Information'}</span>
              <span className="font-bold">Am Kurpark 4</span>
            </div>
          </div>
        </div>
      </div>

      {/* Free Parking Section */}
      <div className="mb-16 bg-[#F4F8F5] border border-[#0F4C2E]/20 rounded-3xl p-6 sm:p-9">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-[#0F4C2E] text-white flex items-center justify-center shrink-0">
            <Car className="w-5 h-5" />
          </div>
          <h2 className="font-display text-xl sm:text-2xl font-bold text-[#1B211D]">
            {isNl ? '90 Minuten Gratis Parkeren in Winterberg' : '90 Minuten Gratis Parken im gesamten Stadtgebiet'}
          </h2>
        </div>

        <p className="text-[#3F4B42] text-sm sm:text-base leading-relaxed mb-6">
          {isNl 
            ? 'Zowel bij „Nass.Mobil“ als bij „Aktiv.Entspannt“ is het felbegeerde gratis parkeren inbegrepen. Plaats eenvoudig uw blauwe parkeerschijf samen met de officiële HeimatCard-parkeerkaart duidelijk zichtbaar achter de voorruit van uw auto. Zo parkeert u zonder parkeerkosten voor snelle boodschappen, winkelbezoeken of een kop koffie.'
            : 'In beiden Tarifen ist das begehrte 90-Minuten-Freiparken fest integriert. Nach Ausstellung Ihrer Karte legen Sie einfach den personalisierten Parkausweis zusammen mit einer Parkscheibe gut lesbar hinter die Windschutzscheibe Ihres Pkw. So erledigen Sie Ihre Einkäufe, Arztbesuche oder Stadtbummel völlig entspannt ohne Parkgebühren.'}
        </p>

        <div className="bg-white rounded-2xl p-5 border border-[#EDE8E0]">
          <h4 className="font-bold text-sm text-[#1B211D] mb-3 flex items-center gap-2">
            <MapPin size={16} className="text-[#0F4C2E]" />
            {isNl ? 'Geldig op de volgende 11 gemeentelijke parkeerlocaties:' : 'Gültig auf folgenden 11 städtischen Parkflächen in Winterberg:'}
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 text-xs sm:text-sm text-[#5F6B63]">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0F4C2E]" />
              Unterer & Mittlerer Waltenberg
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0F4C2E]" />
              Parkplatz Nuhnestr. / Günninghauser Str.
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0F4C2E]" />
              Untere Pforte (Poststr. / Hagenstr.)
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0F4C2E]" />
              Hellenstraße & Hauptstraße (Ortskern)
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0F4C2E]" />
              Parkplatz Waltenberg-Galerie
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0F4C2E]" />
              Parkplatz „Am Ring“ (REWE-Markt)
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0F4C2E]" />
              Parkplatz Neue Mitte (Edeka)
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0F4C2E]" />
              Parkplatz Aldi (Neue Mitte 3)
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0F4C2E]" />
              Parkplatz Bremberg (P3 Skigebiet)
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0F4C2E]" />
              Parkplatz Hillebachsee (Niedersfeld)
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0F4C2E]" />
              Parkplätze „Im Hohlen Seifen“
            </div>
          </div>
        </div>
      </div>

      {/* Attractions Catalog */}
      <div className="mb-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <UnderlinedHeading 
              text={isNl ? 'Alle inbegrepen attracties (Tarief Aktiv.Entspannt)' : 'Inkludierte Ausflugsziele & Erlebnisse'} 
              as="h2" 
            />
            <p className="text-[#5F6B63] text-sm sm:text-base mt-2">
              {isNl 
                ? 'Ontdek meer dan 30 topbestemmingen. Klik op het bedrijfsprofiel om meer te weten te komen over de onderneming in onze bedrijvengids.' 
                : 'Über 30 hochwertige Freizeit-, Sport- und Naturangebote. Viele Partnerunternehmen sind direkt mit ihrem Profil in unserem Winterberg-Verzeichnis verknüpft.'}
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-1.5">
            {categoriesList.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-[#0F4C2E] text-white shadow-xs'
                    : 'bg-[#EDE8E0] text-[#3F4B42] hover:bg-[#E0DAD0]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredAttractions.map((att, idx) => {
            // Find linked business in database
            const matchedBusiness = att.businessId ? businesses.find(b => b.id === att.businessId) : null;
            const businessPath = matchedBusiness ? getBusinessPath(matchedBusiness, lang) : null;

            return (
              <div 
                key={idx}
                className="bg-white border border-[#EDE8E0] rounded-2xl p-5 shadow-xs hover:shadow-md hover:border-[#0F4C2E]/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#0F4C2E] bg-[#EAF2EC] px-2.5 py-0.5 rounded-md">
                      {att.location}
                    </span>
                    {matchedBusiness && (
                      <span className="text-[10.5px] font-medium text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Building2 size={11} />
                        {isNl ? 'In gids' : 'Im Verzeichnis'}
                      </span>
                    )}
                  </div>

                  <h3 className="font-display font-bold text-lg text-[#1B211D] mb-1.5">
                    {isNl ? att.name_nl : att.name}
                  </h3>

                  <div className="inline-block text-xs font-bold text-[#F2761B] bg-[#FFF7ED] px-2.5 py-1 rounded-md mb-3 border border-[#F2761B]/20">
                    ✨ {isNl ? att.benefit_nl : att.benefit}
                  </div>

                  <p className="text-xs sm:text-[13.5px] text-[#5F6B63] leading-relaxed mb-4">
                    {isNl ? att.description_nl : att.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#EDE8E0]/70 flex items-center justify-between gap-2">
                  {businessPath ? (
                    <button
                      onClick={() => {
                        if (onSelectBusiness) {
                          onSelectBusiness(businessPath);
                        } else {
                          window.location.href = businessPath;
                        }
                      }}
                      className="text-xs font-bold text-[#0F4C2E] hover:text-[#06301C] hover:underline flex items-center gap-1 cursor-pointer transition-colors"
                      title={isNl ? `Bekijk profiel van ${matchedBusiness?.name || att.name}` : `Unternehmensprofil von ${matchedBusiness?.name || att.name} ansehen`}
                    >
                      <Building2 size={13} className="text-[#0F4C2E]" />
                      <span>{isNl ? 'Unternehmensprofil' : 'Unternehmensprofil'}</span> →
                    </button>
                  ) : (
                    <span />
                  )}

                  {att.website && (
                    <a 
                      href={att.website} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-xs font-medium text-gray-500 hover:text-gray-900 inline-flex items-center gap-1 transition-colors ml-auto"
                    >
                      Website <ExternalLink size={12} />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* How to get the card */}
      <div className="mb-16 bg-white border border-[#EDE8E0] rounded-3xl p-6 sm:p-9 shadow-sm">
        <div className="max-w-2xl mb-8">
          <UnderlinedHeading 
            text={isNl ? 'Zo eenvoudig vraag je jouw HeimatCard aan' : 'In 3 Schritten zu deiner HeimatCard'} 
            as="h2" 
          />
          <p className="text-[#5F6B63] text-sm sm:text-base mt-2">
            {isNl 
              ? 'De pas wordt direct persoonlijk voor je aangemaakt bij de Tourist-Information Winterberg in het Kurpark.' 
              : 'Die Karte wird direkt vor Ort in der Tourist-Information am Kurpark für dich personalisiert und ausgehändigt.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-[#FAF8F5] border border-[#EDE8E0] rounded-2xl p-5">
            <div className="w-9 h-9 rounded-xl bg-[#0F4C2E] text-white flex items-center justify-center font-bold text-base mb-3">
              1
            </div>
            <h4 className="font-bold text-base text-[#1B211D] mb-1.5">
              {isNl ? 'Voorwaarde checken' : 'Berechtigung prüfen'}
            </h4>
            <p className="text-xs sm:text-sm text-[#5F6B63] leading-relaxed">
              {isNl 
                ? 'Je woont in de gemeente Winterberg (eerste of tweede woning) óf werkt bij een in Winterberg gevestigd bedrijf.' 
                : 'Du hast deinen Wohnsitz im Stadtgebiet Winterberg oder arbeitest nachweislich in einem Betrieb vor Ort.'}
            </p>
          </div>

          <div className="bg-[#FAF8F5] border border-[#EDE8E0] rounded-2xl p-5">
            <div className="w-9 h-9 rounded-xl bg-[#0F4C2E] text-white flex items-center justify-center font-bold text-base mb-3">
              2
            </div>
            <h4 className="font-bold text-base text-[#1B211D] mb-1.5">
              {isNl ? 'Documenten meenemen' : 'Unterlagen bereithalten'}
            </h4>
            <p className="text-xs sm:text-sm text-[#5F6B63] leading-relaxed">
              {isNl 
                ? 'Neem een geldig identiteitsbewijs mee en houd het kenteken van je auto bij de hand voor het parkeervignet.' 
                : 'Bringe deinen Personalausweis und das Kfz-Kennzeichen deines Pkw mit, damit der Parkausweis direkt ausgestellt werden kann.'}
            </p>
          </div>

          <div className="bg-[#FAF8F5] border border-[#EDE8E0] rounded-2xl p-5">
            <div className="w-9 h-9 rounded-xl bg-[#0F4C2E] text-white flex items-center justify-center font-bold text-base mb-3">
              3
            </div>
            <h4 className="font-bold text-base text-[#1B211D] mb-1.5">
              {isNl ? 'Meteen meenemen & genieten' : 'Sofort mitnehmen & sparen'}
            </h4>
            <p className="text-xs sm:text-sm text-[#5F6B63] leading-relaxed">
              {isNl 
                ? 'Kies je gewenste tarief (25 € of 50 €), reken af en neem je pas, parkeervignet en zwembadmunt meteen mee naar huis!' 
                : 'Wähle deinen Wunschtarif (25 € oder 50 €) und nimm deine persönliche Karte samt Parkausweis und Schwimmbadcoin direkt mit!'}
            </p>
          </div>
        </div>

        {/* Tourist-Info Contact Details Card */}
        <div className="bg-[#EAF2EC] border border-[#0F4C2E]/20 rounded-2xl p-5 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="font-bold text-base text-[#0F4C2E]">
              Winterberg Touristik und Wirtschaft GmbH (Tourist-Information)
            </div>
            <div className="text-xs sm:text-sm text-[#2F3A33] flex items-center gap-2">
              <MapPin size={15} className="text-[#0F4C2E] shrink-0" />
              Am Kurpark 4, 59955 Winterberg
            </div>
            <div className="text-xs sm:text-sm text-[#2F3A33] flex items-center gap-4 flex-wrap">
              <span className="flex items-center gap-1.5">
                <Phone size={14} className="text-[#0F4C2E]" />
                02981 92500
              </span>
              <span className="flex items-center gap-1.5">
                <Mail size={14} className="text-[#0F4C2E]" />
                info@winterberg.de
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={() => {
                const tourBiz = businesses.find(b => b.id === 'winterberg-touristik');
                if (tourBiz) {
                  const p = getBusinessPath(tourBiz, lang);
                  if (onSelectBusiness) onSelectBusiness(p);
                  else window.location.href = p;
                }
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs bg-white text-[#0F4C2E] border border-[#0F4C2E]/30 hover:bg-[#FAF8F5] transition-all cursor-pointer shadow-xs"
            >
              <Building2 size={13} />
              {isNl ? 'Profiel Tourist-Info' : 'Profil im Verzeichnis'}
            </button>

            <a
              href="https://www.rathaus-winterberg.de/leben-wohnen/heimatkarte/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-[#0F4C2E] hover:bg-[#0A3822] text-white shadow-sm transition-all shrink-0 cursor-pointer"
            >
              {isNl ? 'Officiële pagina van de stad' : 'Offizielle Rathaus-Seite'}
              <ExternalLink size={14} />
            </a>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mb-16">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <UnderlinedHeading 
            text={isNl ? 'Veelgestelde Vragen over de Bürgerkarte' : 'Häufig gestellte Fragen zur HeimatCard'} 
            as="h2" 
          />
        </div>

        <div className="space-y-3 max-w-3xl mx-auto">
          {faqs.map((faq, fIdx) => {
            const isOpen = openFaqIndex === fIdx;
            return (
              <div 
                key={fIdx}
                className="bg-white border border-[#EDE8E0] rounded-2xl overflow-hidden shadow-2xs transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : fIdx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-[#1B211D] hover:text-[#0F4C2E] transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-2.5">
                    <HelpCircle size={18} className="text-[#0F4C2E] shrink-0" />
                    {faq.q}
                  </span>
                  {isOpen ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-[#5F6B63] leading-relaxed border-t border-[#EDE8E0]/60 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
