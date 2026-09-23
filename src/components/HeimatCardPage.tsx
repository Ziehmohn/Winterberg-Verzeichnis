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
  Info, 
  ArrowLeft,
  Flame,
  ShieldCheck,
  Mountain,
  Heart
} from 'lucide-react';
import { ThemeConfig } from '../types';
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
  profilePath?: string;
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
      ? 'Alle info over de Winterberg Card (HeimatCard / burgerkaart): 90 minuten gratis parkeren, 12x zwembad Winterberg en meer dan 30 topattracties in het Sauerland.'
      : 'Alle Infos zur Winterberg Card (HeimatCard / Bürgerkarte): 90 Minuten kostenfrei parken, 12x Hallenbad Winterberg und über 30 Top-Freizeitattraktionen im Sauerland ab 25 €.';

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
      description: 'Die zweitlängste Megazipline Europas: Mit über 70 km/h auf der Doppelseilrutsche ins Tal sausen. Vorab-Reservierung erforderlich.',
      description_nl: 'De op één na langste megazipline van Europa: met ruim 70 km/u op de dubbele kabelbaan het dal in suizen. Reservering vooraf vereist.',
      website: 'https://www.astenkick.de',
      location: 'Altastenberg',
      profilePath: '/freizeit/outdoor/astenkick-megazipline'
    },
    {
      name: 'Der Brabander Sauna & Spa',
      name_nl: 'Der Brabander Sauna & Spa',
      category: 'wellness',
      benefit: '1x 2 Stunden Saunalandschaft (ab 16 J., Mo–Fr)',
      benefit_nl: '1x 2 uur saunalandschap (vanaf 16 jr., ma–vr)',
      description: 'Exklusive Entspannung mit verschiedenen Saunen, balinesischem Garten, Ruheraum, Kaltwasser-Tauchbecken und Erlebnisduschen.',
      description_nl: 'Exclusieve ontspanning met verschillende sauna\'s, Balinese tuin, ontspanningsruimte, koudwater-dompelbad en belevingsdouches.',
      website: 'https://www.saunawinterberg.de',
      location: 'Winterberg',
      profilePath: '/hotels-und-unterkuenfte/hotels/vakantiehotel-der-brabander'
    },
    {
      name: 'Kletterwald Winterberg',
      name_nl: 'Klimbos Winterberg',
      category: 'action',
      benefit: '1x Besuch im Kletterwald (Mo–Fr)',
      benefit_nl: '1x bezoek aan het klimbos (ma–vr)',
      description: 'Fünf abwechslungsreiche Kletterparcours auf dem Erlebnisberg Kappe mit Hängebrücken und Seilbahnen.',
      description_nl: 'Vijf afwisselende klimroutes op de Erlebnisberg Kappe met hangbruggen en tokkelbanen.',
      website: 'https://www.erlebnisbergkappe.de',
      location: 'Erlebnisberg Kappe'
    },
    {
      name: 'Fly-Line Winterberg',
      name_nl: 'Fly-Line Winterberg',
      category: 'action',
      benefit: '1x Fahrt mit der Fly-Line (Mo–Fr)',
      benefit_nl: '1x rit met de Fly-Line (ma–vr)',
      description: 'Sanftes Gleiten mit 12 km/h in Rollschlitten durch die Baumwipfel – eine Mischung aus Achterbahn und Naturerlebnis.',
      description_nl: 'Zweef met ca. 12 km/u in een speciale rolstoel door de boomtoppen – een mix van achtbaan en natuurbeleving.',
      website: 'https://www.erlebnisbergkappe.de',
      location: 'Erlebnisberg Kappe'
    },
    {
      name: 'Panorama Erlebnis Brücke',
      name_nl: 'Panorama Belevenisbrug',
      category: 'ausflug',
      benefit: '1x freier Eintritt',
      benefit_nl: '1x gratis toegang',
      description: '435 Meter lange und 20 Meter hohe Aussichtsbrücke über das Sauerland mit 5 lustigen Kletter- und Hangelelementen.',
      description_nl: '435 meter lange en 20 meter hoge panoramabrug over het Sauerland met 5 klim- en speelelementen.',
      website: 'https://www.erlebnisbergkappe.de',
      location: 'Erlebnisberg Kappe'
    },
    {
      name: 'Sommerrodelbahn Kappe',
      name_nl: 'Zomerrodelbaan Kappe',
      category: 'action',
      benefit: '1x Fahrt auf der Sommerrodelbahn',
      benefit_nl: '1x rit op de zomerrodelbaan',
      description: 'Mit dem Lift hinauf und dann mit Vollgas durch rasante Kurven, Brücken und Jumps talwärts sausen.',
      description_nl: 'Met de lift omhoog en daarna vol gas door spannende bochten, bruggen en jumps naar beneden suizen.',
      website: 'https://www.erlebnisbergkappe.de',
      location: 'Erlebnisberg Kappe'
    },
    {
      name: 'Schanzen Wirbel oder Herrloh Blitz',
      name_nl: 'Schanzen Wirbel of Herrloh Blitz',
      category: 'action',
      benefit: '1x Fahrt auf einer der Sommerrodelbahnen',
      benefit_nl: '1x rit op een van de zomerrodelbanen',
      description: 'Wahlweise 600 oder 700 Meter lange Rodelbahn mit Steilkurven, Kreisel und Tunnel direkt am Skiliftkarussell.',
      description_nl: 'Keuze uit een 600 of 700 meter lange rodelbaan met scherpe bochten, tunnels en een looping direct bij de skiliften.',
      website: 'https://www.skiliftkarussell.de',
      location: 'Herrloh / Skiliftkarussell'
    },
    {
      name: 'Abenteuergolf Erlebnisberg Kappe',
      name_nl: 'Avonturengolf Erlebnisberg Kappe',
      category: 'sport',
      benefit: '1 Runde Abenteuergolf (18 Loch)',
      benefit_nl: '1 ronde avonturengolf (18 holes)',
      description: 'Spaß für die ganze Familie auf liebevoll und naturgetreu gestalteten Kunstrasen-Bahnen mit Geländehindernissen.',
      description_nl: 'Plezier voor het hele gezin op prachtig vormgegeven kunstgrasbanen met natuurlijke hindernissen.',
      website: 'https://www.erlebnisbergkappe.de',
      location: 'Erlebnisberg Kappe'
    },
    {
      name: 'Schwimmbad Winterberg',
      name_nl: 'Zwembad Winterberg',
      category: 'wellness',
      benefit: '12x freier Eintritt (auch in Nass.Mobil inkl.)',
      benefit_nl: '12x gratis toegang (ook inbegrepen in Nass.Mobil)',
      description: 'Modernes Hallenbad mit 28°C Wassertemperatur, Bahnenbecken, Entspannungsbereich und wunderbarem Blick ins Grüne.',
      description_nl: 'Modern binnenzwembad met 28°C watertemperatuur, baantjesbad en ontspanningsruimte met uitzicht op de natuur.',
      website: 'https://www.schwimmbad-winterberg.de',
      location: 'Winterberg',
      profilePath: '/gesundheit-und-medizin/sport-outdoor/schwimmbad-winterberg'
    },
    {
      name: 'Freibad Siedlinghausen',
      name_nl: 'Openluchtzwembad Siedlinghausen',
      category: 'wellness',
      benefit: '1x freier Eintritt ins Freibad',
      benefit_nl: '1x gratis toegang tot het openluchtbad',
      description: 'Schwimmerbecken, Nichtschwimmerbecken mit Rutsche und Baby-Planschbecken bei angenehmer Wassertemperatur im Sommer.',
      description_nl: 'Zwemmersbad, recreatiebad met glijbaan en peuterbad in het gezellige openluchtbad van Siedlinghausen.',
      website: 'https://www.baederverein-siedlinghausen.de',
      location: 'Siedlinghausen'
    },
    {
      name: 'Sportzentrum Hochsauerland',
      name_nl: 'Sportcentrum Hochsauerland',
      category: 'sport',
      benefit: '1 Stunde Tennis oder Squash (Mo–Fr)',
      benefit_nl: '1 uur tennis of squash (ma–vr)',
      description: 'Sportlich aktiv bei jedem Wetter: Eine volle Stunde Tennis oder Squash nach Voranmeldung.',
      description_nl: 'Lekker sporten bij elk weer: een heel uur tennis of squash op reservering.',
      website: 'https://www.sportzentrum-hochsauerland.de',
      location: 'Winterberg',
      profilePath: '/ski-bike-sport/sport-outdoor/sportzentrum-hochsauerland'
    },
    {
      name: 'VELTINS-EisArena (Bobbahn)',
      name_nl: 'VELTINS-EisArena (Bobsleebaan)',
      category: 'kultur',
      benefit: '1x Event-Eintritt (Weltcup/WM) + 1x Bahnführung',
      benefit_nl: '1x toegang wereldbeker/WK-event + 1x rondleiding',
      description: 'Erleben Sie die schnellsten Bob-, Rodel- und Skeleton-Sportler der Welt live vor Ort oder blicken Sie bei einer Führung hinter die Kulissen.',
      description_nl: 'Beleef \'s werelds snelste bobslee- en skeletonatleten live of neem een uniek kijkje achter de schermen tijdens een rondleiding.',
      website: 'https://www.veltins-eisarena.de',
      location: 'Winterberg'
    },
    {
      name: 'Kartfun Neuastenberg',
      name_nl: 'Kartfun Neuastenberg',
      category: 'action',
      benefit: '1x 10 Minuten Fahrt auf der Kartbahn (Mo–Fr)',
      benefit_nl: '1x 10 minuten karten (ma–vr)',
      description: 'Formel-1-Feeling pur auf einer der modernsten Indoor-Kartbahnen Deutschlands mit 550 Metern Streckenlänge.',
      description_nl: 'Formule 1-gevoel op een van de modernste overdekte kartbanen van Duitsland met 550 meter lengte.',
      website: 'https://www.kartfun-astenberg.de',
      location: 'Neuastenberg'
    },
    {
      name: 'Bikeverleih PROBIKER',
      name_nl: 'Fietsverhuur PROBIKER',
      category: 'sport',
      benefit: '1x E-MTB leihen (Mo–Fr außerhalb Ferien)',
      benefit_nl: '1x E-MTB huren (ma–vr buiten schoolvakanties)',
      description: 'Hochwertiges E-Mountainbike ausleihen und die schönsten Trails und Waldwege der Ferienwelt Winterberg erkunden.',
      description_nl: 'Huur een topklasse elektrische mountainbike en ontdek de mooiste routes rondom Winterberg.',
      website: 'https://www.pro-biker.de',
      location: 'Winterberg'
    },
    {
      name: 'Ettelsberg-Kabinenseilbahn Willingen',
      name_nl: 'Ettelsberg Kabelbaan Willingen',
      category: 'ausflug',
      benefit: '1x Berg- und Talfahrt mit der Kabinenbahn',
      benefit_nl: '1x retour bergrit met de kabelbaan',
      description: 'Bequem auf den 838m hohen Ettelsberg schweben, den Hochheideturm besuchen oder gemütlich einkehren.',
      description_nl: 'Comfortabel omhoog naar de 838 m hoge Ettelsberg, de Hochheideturm beklimmen of genieten op het terras.',
      website: 'https://www.ettelsberg-seilbahn.de',
      location: 'Willingen'
    },
    {
      name: 'Personenschifffahrt Biggesee',
      name_nl: 'Rondvaartboot Biggesee',
      category: 'ausflug',
      benefit: '1x 1,5-stündige Schifffahrt (werktags bis 13 Uhr)',
      benefit_nl: '1x 1,5 uur durende rondvaart (werkdagen tot 13 uur)',
      description: 'Entspannte Bootstour über einen der schönsten Stauseen Nordrhein-Westfalens mit herrlichen Ausblicken.',
      description_nl: 'Ontspannen boottocht over een van de mooiste meren van Noordrijn-Westfalen met prachtig uitzicht.',
      website: 'https://www.biggesee.de',
      location: 'Biggesee (Olpe)'
    },
    {
      name: 'Westdeutsches Wintersport-Museum',
      name_nl: 'West-Duits Wintersportmuseum',
      category: 'kultur',
      benefit: '1x freier Eintritt ins Museum',
      benefit_nl: '1x gratis toegang tot het museum',
      description: 'Spannende Zeitreise auf 250 qm Ausstellungsfläche durch die über 100-jährige Geschichte des Wintersports im Sauerland.',
      description_nl: 'Fascinerende reis door meer dan 100 jaar wintersportgeschiedenis in het Sauerland op 250 m² tentoonstellingsruimte.',
      website: 'https://www.skimuseum-winterberg.de',
      location: 'Neuastenberg'
    },
    {
      name: 'Sauerland-Museum Arnsberg',
      name_nl: 'Sauerland-Museum Arnsberg',
      category: 'kultur',
      benefit: '1x Tagesticket für Dauer- und Sonderausstellung',
      benefit_nl: '1x dagkaart vaste en tijdelijke tentoonstelling',
      description: 'Das hochmoderne Landesmuseum der Region im historischen Landsberger Hof mit faszinierenden interaktiven Ausstellungen.',
      description_nl: 'Het toonaangevende streekmuseum in de historische Landsberger Hof met interactieve exposities.',
      website: 'https://www.sauerland-museum.de',
      location: 'Arnsberg'
    },
    {
      name: 'Heinz Nixdorf MuseumsForum Paderborn',
      name_nl: 'Heinz Nixdorf MuseumsForum Paderborn',
      category: 'kultur',
      benefit: '1x freier Eintritt',
      benefit_nl: '1x gratis toegang',
      description: 'Das weltgrößte Computermuseum: 5.000 Jahre Geschichte der Informationstechnik von der Keilschrift bis zur Künstlichen Intelligenz.',
      description_nl: '\'s Werelds grootste computermuseum: 5.000 jaar geschiedenis van informatietechnologie van spijkerschrift tot AI.',
      website: 'https://www.hnf.de',
      location: 'Paderborn'
    },
    {
      name: 'Kegelbahn Landhotel Grimmeblick',
      name_nl: 'Kegelbaan Landhotel Grimmeblick',
      category: 'sport',
      benefit: '1x zwei Stunden Erlebnis-Kegeln',
      benefit_nl: '1x twee uur belevingskegelen',
      description: 'Uriges Kegelerlebnis in einer als Bergwerk-Zeche gestalteten Bahn mit geheimnisvollen Schwarzlicht-Effekten.',
      description_nl: 'Gezellig kegelen in een nagebouwde mijngang met mysterieuze blacklight-effecten.',
      website: 'https://www.grimmeblick.de',
      location: 'Altastenberg',
      profilePath: '/hotels-und-unterkuenfte/hotels/landhotel-grimmeblick'
    },
    {
      name: 'Pferdefuhrhalterei Winterberg',
      name_nl: 'Huifkartocht Paardenhouderij',
      category: 'ausflug',
      benefit: '1x Planwagenfahrt (Freitags um 14 Uhr, mit Anm.)',
      benefit_nl: '1x huifkartocht (vrijdag 14:00 uur, met aanm.)',
      description: 'Gemütlich im Planwagen von kräftigen Kaltblutpferden gezogen durch die atemberaubende Natur rund um Winterberg.',
      description_nl: 'Gezellig in de huifkar getrokken door sterke koudbloedpaarden door de schitterende natuur van Winterberg.',
      website: 'https://www.pferdefuhrhalterei.de',
      location: 'Winterberg'
    },
    {
      name: 'KuKuK Kulturveranstaltung',
      name_nl: 'KuKuK Cultuurevenement',
      category: 'kultur',
      benefit: '1x Eintritt zu einer KuKuK-Veranstaltung',
      benefit_nl: '1x toegang tot een KuKuK-voorstelling',
      description: 'Vom Stadtmarketingverein Winterberg präsentierte Kultur-Highlights: Konzerte, Theater, Kabarett und Comedy (im VVK Tourist-Info).',
      description_nl: 'Cultuurvoorstellingen gepresenteerd door Stadtmarketing: concerten, toneel, cabaret en comedy (voorverkoop Tourist Info).',
      website: 'https://www.kukuk-winterberg.de',
      location: 'Winterberg'
    },
    {
      name: 'Tenne Winterberg',
      name_nl: 'Tenne Winterberg',
      category: 'action',
      benefit: '1x TenneCard (Club & Kneipe)',
      benefit_nl: '1x TenneCard (club & bar)',
      description: 'Die Kult-Location in Winterberg für ausgelassene Partyabende mit Schlager, Charts, Club-Beats und gemütlicher Kneipenatmosphäre.',
      description_nl: 'De bekende feestlocatie in Winterberg voor gezellige avonden met muziek, cocktails en dans.',
      website: 'https://www.tenne-winterberg.de',
      location: 'Winterberg',
      profilePath: '/gastronomie/kneipen-und-bars/die-tenne-winterberg'
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
      q: isNl ? 'Wie kan de WinterbergCard kopen?' : 'Wer ist zum Kauf der WinterbergCard berechtigt?',
      a: isNl 
        ? 'De kaart richt zich exclusief op inwoners van de gemeente Winterberg (inclusief alle dorpen) met eerste of tweede verblijfplaats, evenals geregistreerde werknemers in Winterberg. Bij uitgifte en gebruik is een legitimatiebewijs vereist.' 
        : 'Die Karte richtet sich exklusiv an die Bürgerinnen und Bürger der Stadt Winterberg (einschließlich aller Ortsteile) mit Erst- oder Zweitwohnsitz sowie an Beschäftigte in Winterberger Betrieben. Beim Kauf und bei der Nutzung muss ein amtlicher Lichtbildausweis vorgelegt werden.'
    },
    {
      q: isNl ? 'Wat is het verschil tussen de twee varianten?' : 'Was ist der Unterschied zwischen den beiden Varianten?',
      a: isNl 
        ? 'De kleine variant „Nass.Mobil“ (25 € voor volwassenen / 20 € voor kinderen) bevat het hele jaar door 90 minuten gratis parkeren op alle openbare gemeentelijke parkeerplaatsen en 12 gratis bezoeken aan het overdekte zwembad van Winterberg. De grote variant „Aktiv.Entspannt“ (50 € / 40 €) bevat alle voordelen van Nass.Mobil PLUS meer dan 30 gratis vrijetijdsattracties in het Sauerland!' 
        : 'Die kleine Variante „Nass.Mobil“ (25 € Erw. / 20 € Kinder) beinhaltet ganzjährig 90 Minuten kostenloses Parken auf städtischen Parkflächen und 12 Eintritte ins Hallenbad Winterberg. Die große Variante „Aktiv.Entspannt“ (50 € Erw. / 40 € Kinder) umfasst alle Leistungen von Nass.Mobil PLUS über 30 einmalige Freizeit- und Ausflugserlebnisse in der Region im Wert von über 350 €!'
    },
    {
      q: isNl ? 'Hoe werkt het gratis parkeren van 90 minuten precies?' : 'Wie funktioniert das kostenlose Parken für 90 Minuten?',
      a: isNl 
        ? 'Met de kaart ontvangt u een parkeerkaart op kenteken. Plaats eenvoudig uw parkeerschijf samen met de zichtbare parkeerkaart achter de voorruit van uw auto. Dit geldt op alle openbare gemeentelijke parkeerzones in Winterberg (o.a. Waltenberg, Neue Mitte, Bremberg, Hillebachsee etc.).' 
        : 'Mit dem Kauf der Karte wird Ihr Kfz-Kennzeichen erfasst und Sie erhalten einen gut sichtbaren Parkausweis. Legen Sie diesen zusammen mit einer Parkscheibe gut sichtbar hinter die Windschutzscheibe. Sie parken dann auf allen ausgewiesenen städtischen Parkflächen in Winterberg für 90 Minuten gebührenfrei.'
    },
    {
      q: isNl ? 'Hoe lang is de kaart geldig?' : 'Wie lange ist die Karte gültig?',
      a: isNl 
        ? 'De kaart geldt altijd voor één kalenderjaar, vanaf de dag van uitgifte (vroegstens 1 januari) tot en met 31 december van het betreffende jaar.' 
        : 'Die Karte gilt immer für ein volles Kalenderjahr – vom Tag der Ausstellung (frühestens ab dem 01. Januar) bis zum 31. Dezember des jeweiligen Jahres.'
    },
    {
      q: isNl ? 'Waar kan ik de kaart kopen?' : 'Wo kann ich die Karte kaufen?',
      a: isNl 
        ? 'De kaart is uitsluitend verkrijgbaar bij de Tourist Information Winterberg (Am Kurpark 4, 59955 Winterberg, Tel: 02981 92500).' 
        : 'Die Karte ist persönlich in der Tourist-Information Winterberg (Winterberg Touristik und Wirtschaft GmbH, Am Kurpark 4, 59955 Winterberg, Telefon: 02981 92500, E-Mail: info@winterberg.de) erhältlich.'
    },
    {
      q: isNl ? 'Wat moet ik doen met het zwembad-muntje (Schwimmbadcoin)?' : 'Was muss ich beim Schwimmbad-Coin beachten?',
      a: isNl 
        ? 'De elektronische zwembadmunt moet, ongeacht het aantal bezoeken, uiterlijk op 15 januari van het volgende jaar weer worden ingeleverd bij de Tourist Info. Bij niet inleveren wordt 5 euro in rekening gebracht.' 
        : 'Der elektronische Schwimmbadcoin für die 12 Hallenbadbesuche ist unabhängig von der tatsächlichen Nutzung bis spätestens 15. Januar des Folgejahres in der Tourist-Information abzugeben. Bei Verlust oder Nicht-Rückgabe fällt eine Gebühr von 5 Euro an.'
    },
    {
      q: isNl ? 'Kan de kaart worden overgedragen of cadeau worden gegeven?' : 'Kann die Karte übertragen oder verschenkt werden?',
      a: isNl 
        ? 'Nee, de kaart is strikt persoonsgebonden (naam en kenteken staan geregistreerd). Zij kan niet worden overgedragen aan andere personen.' 
        : 'Nein, die Karte wird personalisiert auf den Namen und das Kennzeichen des Inhabers ausgestellt. Eine Weitergabe an Dritte ist ausgeschlossen.'
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
        <div className="relative z-10 max-w-[760px]">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 text-[#FCD34D] text-xs sm:text-sm font-bold tracking-wide uppercase mb-4 backdrop-blur-xs border border-white/20">
            <Sparkles size={15} />
            {isNl ? 'Exclusief voor inwoners van Winterberg' : 'Exklusiv für Bürgerinnen & Bürger von Winterberg'}
          </div>

          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight mb-4 tracking-tight">
            Winterberg Card <br className="hidden sm:inline" />
            <span className="text-[#ffc084]">Mein Heimatmoment</span>
          </h1>

          <p className="text-white/90 text-base sm:text-lg md:text-xl leading-relaxed mb-6 font-normal">
            {isNl 
              ? 'Ken jij je eigen streek eigenlijk wel? Met de officiële burgerkaart van de stad Winterberg geniet je van ruim 30 topattracties, 90 minuten gratis parkeren op städtische parkeerplaatsen en 12x gratis zwemmen – voor een fractie van de reguliere prijs!'
              : 'Sag mal, kennst du eigentlich deine Heimat? Mit der offiziellen Bürgerkarte der Stadt Winterberg sicherst du dir über 30 unverwechselbare Erlebnisse, ganzjährig 90 Minuten freies Parken und 12 Hallenbad-Besuche direkt vor deiner Haustür – für einen Bruchteil des regulären Preises!'}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="bg-white/10 rounded-xl p-3 border border-white/10 text-center">
              <div className="text-2xl font-black text-white">ab 25 €</div>
              <div className="text-xs text-white/80">{isNl ? 'Per kalenderjaar' : 'Pro Kalenderjahr'}</div>
            </div>
            <div className="bg-white/10 rounded-xl p-3 border border-white/10 text-center">
              <div className="text-2xl font-black text-white">90 Min.</div>
              <div className="text-xs text-white/80">{isNl ? 'Gratis parkeren' : 'Gratis Parken'}</div>
            </div>
            <div className="bg-white/10 rounded-xl p-3 border border-white/10 text-center">
              <div className="text-2xl font-black text-white">12x</div>
              <div className="text-xs text-white/80">{isNl ? 'Zwemmen Winterberg' : 'Hallenbad Winterberg'}</div>
            </div>
            <div className="bg-white/10 rounded-xl p-3 border border-white/10 text-center">
              <div className="text-2xl font-black text-white">30+</div>
              <div className="text-xs text-white/80">{isNl ? 'Topattracties gratis' : 'Freizeit-Highlights'}</div>
            </div>
          </div>
        </div>

        {/* Decorative background shapes */}
        <div className="absolute -bottom-16 -right-16 w-80 h-80 rounded-full bg-white/5 pointer-events-none blur-2xl" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#F2761B]/10 rounded-full pointer-events-none blur-3xl" />
      </div>

      {/* The Two Plans / Tariffs */}
      <div className="mb-16">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <UnderlinedHeading 
            text={isNl ? 'Kies jouw HeimatCard-variant' : 'Wähle dein HeimatCard-Modell'} 
            as="h2" 
          />
          <p className="text-[#5F6B63] text-base sm:text-lg mt-3">
            {isNl 
              ? 'Twee aantrekkelijke opties, perfect afgestemd op dagelijks gebruik of maximale vrijetijdsbeleving.'
              : 'Zwei attraktive Varianten, perfekt abgestimmt auf Alltag, Besorgungen oder maximale Freizeit-Action.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {/* Plan 1: Nass.Mobil */}
          <div className="bg-white border-2 border-[#E5E0D6] rounded-3xl p-7 sm:p-9 shadow-sm hover:shadow-md transition-all flex flex-col relative">
            <div className="flex items-center justify-between gap-4 mb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#0F4C2E] bg-[#EAF2EC] px-3 py-1 rounded-full">
                  Basis-Tarif
                </span>
                <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#1B211D] mt-2">
                  „Nass.Mobil“
                </h3>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-[#EAF2EC] text-[#0F4C2E] flex items-center justify-center shrink-0">
                <Waves className="w-6 h-6" />
              </div>
            </div>

            <p className="text-[#5F6B63] text-sm sm:text-base leading-relaxed mb-6">
              {isNl 
                ? 'Ideaal voor dagelijkse boodschappen in de stad en regelmatige bezoekers van het overdekte zwembad.'
                : 'Ideal für alle, die regelmäßig in Winterberg Besorgungen machen und gerne ihre Bahnen im Hallenbad ziehen.'}
            </p>

            <div className="bg-[#FAF8F5] border border-[#EDE8E0] rounded-2xl p-4 mb-6">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-extrabold text-[#1B211D]">25 €</span>
                <span className="text-sm font-medium text-[#7C8780]">{isNl ? 'volwassenen / jaar' : 'Erwachsene / Kalenderjahr'}</span>
              </div>
              <div className="text-sm font-semibold text-[#0F4C2E] mt-1">
                20 € {isNl ? 'voor kinderen (t/m 16 jaar)' : 'für Kinder & Jugendliche (bis 16 Jahre)'}
              </div>
            </div>

            <div className="space-y-3.5 mb-8 flex-1">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#0F4C2E] shrink-0 mt-0.5" />
                <div className="text-sm sm:text-[15px] text-[#2F3A33]">
                  <strong>{isNl ? '90 minuten gratis parkeren' : '90 Minuten gebührenfrei parken'}</strong> {isNl ? 'op alle openbare gemeentelijke parkeerzones in Winterberg' : 'auf allen städtischen Parkflächen'}
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#0F4C2E] shrink-0 mt-0.5" />
                <div className="text-sm sm:text-[15px] text-[#2F3A33]">
                  <strong>{isNl ? '12x gratis toegang tot het zwembad Winterberg' : '12x freier Eintritt ins Hallenbad Winterberg'}</strong> {isNl ? '(28°C warm water, banenzwemmen & ontspanning)' : '(28°C Wassertemperatur, sportives Schwimmen mit Waldblick)'}
                </div>
              </div>
              <div className="flex items-start gap-3 text-[#7C8780]">
                <Info className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
                <div className="text-xs sm:text-sm">
                  {isNl 
                    ? 'Al na 4 zwembeurten heeft deze kaart zichzelf volledig terugverdiend!' 
                    : 'Bereits ab dem vierten Schwimmbadbesuch hat sich die Karte komplett amortisiert!'}
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-[#EDE8E0] text-xs text-[#7C8780]">
              {isNl ? 'Verkrijgbaar bij Tourist-Info Winterberg' : 'Erhältlich persönlich in der Tourist-Information Winterberg'}
            </div>
          </div>

          {/* Plan 2: Aktiv.Entspannt */}
          <div className="bg-white border-2 border-[#0F4C2E] rounded-3xl p-7 sm:p-9 shadow-lg hover:shadow-xl transition-all flex flex-col relative ring-4 ring-[#0F4C2E]/10">
            <div className="absolute -top-3.5 right-6 bg-[#F2761B] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1.5">
              <Flame size={14} />
              {isNl ? 'Aanbevolen & Populairst' : 'Empfohlen & Bester Wert'}
            </div>

            <div className="flex items-center justify-between gap-4 mb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-white bg-[#0F4C2E] px-3 py-1 rounded-full">
                  All-Inclusive Erlebnis
                </span>
                <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#1B211D] mt-2">
                  „Aktiv.Entspannt“
                </h3>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-[#0F4C2E] text-white flex items-center justify-center shrink-0">
                <Compass className="w-6 h-6" />
              </div>
            </div>

            <p className="text-[#5F6B63] text-sm sm:text-base leading-relaxed mb-6">
              {isNl 
                ? 'Het complete pakket: alle voordelen van Nass.Mobil PLUS meer dan 30 topattracties, kabelbanen, sauna en actie in het Sauerland!'
                : 'Das ultimative Heimaterlebnis: Beinhaltet alle Leistungen von Nass.Mobil PLUS über 30 erstklassige Freizeit-, Sport- und Wellness-Highlights!'}
            </p>

            <div className="bg-[#EAF2EC] border border-[#0F4C2E]/20 rounded-2xl p-4 mb-6">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-extrabold text-[#0F4C2E]">50 €</span>
                <span className="text-sm font-medium text-[#2F3A33]">{isNl ? 'volwassenen / jaar' : 'Erwachsene / Kalenderjahr'}</span>
              </div>
              <div className="text-sm font-semibold text-[#0F4C2E] mt-1">
                40 € {isNl ? 'voor kinderen (t/m 16 jaar)' : 'für Kinder & Jugendliche (bis 16 Jahre)'}
              </div>
            </div>

            <div className="space-y-3.5 mb-8 flex-1">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#0F4C2E] shrink-0 mt-0.5" />
                <div className="text-sm sm:text-[15px] text-[#2F3A33]">
                  <strong>{isNl ? 'Alle voordelen van Nass.Mobil inbegrepen' : 'Komplette Leistungen von Nass.Mobil inklusive'}</strong> (90 Min. Gratisparken + 12x Hallenbad Winterberg)
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#0F4C2E] shrink-0 mt-0.5" />
                <div className="text-sm sm:text-[15px] text-[#2F3A33]">
                  <strong>{isNl ? 'Meer dan 30 gratis topattracties' : 'Über 30 kostenfreie Freizeit- & Ausflugsziele'}</strong> (Astenkick, Brabander Sauna, Kletterwald, Fly-Line, Sommerrodelbahn, EisArena Bobbahn, Seilbahn Willingen, Biggesee-Schifffahrt uvm.)
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#0F4C2E] shrink-0 mt-0.5" />
                <div className="text-sm sm:text-[15px] text-[#2F3A33]">
                  <strong>{isNl ? 'Gezamenlijke waarde van ruim 350 €' : 'Gesamtwert der Einzelleistungen über 350 €'}</strong> {isNl ? '– maximale besparing voor het hele gezin!' : '– maximaler Freizeitspaß vor der Haustür!'}
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-[#0F4C2E]/20 text-xs text-[#0F4C2E] font-medium">
              {isNl ? 'Verkrijgbaar bij Tourist-Info Winterberg' : 'Erhältlich persönlich in der Tourist-Information Winterberg'}
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
            {isNl ? '90 Minuten Gratis Parkeren in Winterberg' : '90 Minuten Gratis Parken im Stadtgebiet'}
          </h2>
        </div>

        <p className="text-[#3F4B42] text-sm sm:text-base leading-relaxed mb-6">
          {isNl 
            ? 'Zowel bij „Nass.Mobil“ als bij „Aktiv.Entspannt“ is het felbegeerde gratis parkeren inbegrepen. Plaats eenvoudig uw parkeerschijf én het zichtbare Beschäftigten-/Bürger-parkeervignet achter de voorruit.'
            : 'Sowohl bei „Nass.Mobil“ als auch bei „Aktiv.Entspannt“ ist das beliebte 90-Minuten-Gratisparken enthalten. Voraussetzung ist das gut sichtbare Auslegen der Parkscheibe sowie des ausgegebenen Parkausweises mit Ihrem amtlichen Kfz-Kennzeichen.'}
        </p>

        <div className="bg-white rounded-2xl p-5 border border-[#EDE8E0]">
          <h4 className="font-bold text-sm text-[#1B211D] mb-3 flex items-center gap-2">
            <MapPin size={16} className="text-[#0F4C2E]" />
            {isNl ? 'Geldig op de volgende openbare gemeentelijke parkeerplaatsen:' : 'Gültig auf folgenden städtischen Parkflächen in Winterberg:'}
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
              Untere Pforte / Poststr. / Hagenstr.
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0F4C2E]" />
              Hellenstraße & Hauptstraße (Ortskern)
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0F4C2E]" />
              Waltenberg-Galerie Parkplatz
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
              Parkplatz Bremberg (P3)
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
              text={isNl ? 'Alle inbegrepen attracties (Tarif Aktiv.Entspannt)' : 'Inkludierte Ausflugsziele & Erlebnisse'} 
              as="h2" 
            />
            <p className="text-[#5F6B63] text-sm sm:text-base mt-2">
              {isNl 
                ? 'Ontdek meer dan 30 unieke vrijetijdservaringen direct voor uw voordeur.' 
                : 'Über 30 einmalige Freizeit-, Sport- und Kulturerlebnisse im Sauerland und der Region.'}
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
          {filteredAttractions.map((att, idx) => (
            <div 
              key={idx}
              className="bg-white border border-[#EDE8E0] rounded-2xl p-5 shadow-xs hover:shadow-md hover:border-[#0F4C2E]/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#0F4C2E] bg-[#EAF2EC] px-2.5 py-0.5 rounded-md">
                    {att.location}
                  </span>
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
                {att.profilePath ? (
                  <button
                    onClick={() => {
                      if (onSelectBusiness) {
                        onSelectBusiness(att.profilePath!);
                      } else {
                        window.location.href = att.profilePath!;
                      }
                    }}
                    className="text-xs font-bold text-[#0F4C2E] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    {isNl ? 'Bedrijfsprofiel' : 'Unternehmensprofil'} →
                  </button>
                ) : (
                  <span />
                )}

                <a 
                  href={att.website} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-xs font-medium text-gray-500 hover:text-gray-900 inline-flex items-center gap-1 transition-colors"
                >
                  Website <ExternalLink size={12} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* How to get the card */}
      <div className="mb-16 bg-white border border-[#EDE8E0] rounded-3xl p-6 sm:p-9 shadow-sm">
        <div className="max-w-2xl mb-8">
          <UnderlinedHeading 
            text={isNl ? 'Zo kom je aan jouw WinterbergCard' : 'So einfach kommst du zu deiner HeimatCard'} 
            as="h2" 
          />
          <p className="text-[#5F6B63] text-sm sm:text-base mt-2">
            {isNl 
              ? 'De kaart wordt persoonlijk uitgereikt bij de Tourist-Information Winterberg aan de Kurpark.' 
              : 'Die Karte wird persönlich in der Tourist-Information am Kurpark für dich ausgestellt.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-[#FAF8F5] border border-[#EDE8E0] rounded-2xl p-5">
            <div className="w-9 h-9 rounded-xl bg-[#0F4C2E] text-white flex items-center justify-center font-bold text-base mb-3">
              1
            </div>
            <h4 className="font-bold text-base text-[#1B211D] mb-1.5">
              {isNl ? 'Voorwaarden controleren' : 'Voraussetzungen prüfen'}
            </h4>
            <p className="text-xs sm:text-sm text-[#5F6B63] leading-relaxed">
              {isNl 
                ? 'Je woont in de stad Winterberg of een van de dorpen (eerste of tweede woning), of je werkt bij een bedrijf in Winterberg.' 
                : 'Du hast deinen Erst- oder Zweitwohnsitz im Stadtgebiet Winterberg oder bist Beschäftigter in einem Winterberger Betrieb.'}
            </p>
          </div>

          <div className="bg-[#FAF8F5] border border-[#EDE8E0] rounded-2xl p-5">
            <div className="w-9 h-9 rounded-xl bg-[#0F4C2E] text-white flex items-center justify-center font-bold text-base mb-3">
              2
            </div>
            <h4 className="font-bold text-base text-[#1B211D] mb-1.5">
              {isNl ? 'Documenten meenemen' : 'Unterlagen mitbringen'}
            </h4>
            <p className="text-xs sm:text-sm text-[#5F6B63] leading-relaxed">
              {isNl 
                ? 'Breng je legitimatiebewijs en het kenteken van je auto mee (voor de registratie van het parkeervignet).' 
                : 'Bringe einen amtlichen Lichtbildausweis sowie dein amtliches Kfz-Kennzeichen für den Parkausweis mit.'}
            </p>
          </div>

          <div className="bg-[#FAF8F5] border border-[#EDE8E0] rounded-2xl p-5">
            <div className="w-9 h-9 rounded-xl bg-[#0F4C2E] text-white flex items-center justify-center font-bold text-base mb-3">
              3
            </div>
            <h4 className="font-bold text-base text-[#1B211D] mb-1.5">
              {isNl ? 'Meteen meenemen & genieten' : 'Direkt mitnehmen & sparen'}
            </h4>
            <p className="text-xs sm:text-sm text-[#5F6B63] leading-relaxed">
              {isNl 
                ? 'Betaal je gewenste variant (25 € of 50 €) en neem je gepersonaliseerde pas en zwembadmunt direct mee!' 
                : 'Zahle deinen Wunschtarif (25 € oder 50 €) und nimm deine personalisierte Karte inklusive Schwimmbadcoin direkt mit!'}
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

          <a
            href="https://www.rathaus-winterberg.de/leben-wohnen/heimatkarte/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm bg-[#0F4C2E] hover:bg-[#0A3822] text-white shadow-sm transition-all shrink-0 cursor-pointer"
          >
            {isNl ? 'Website van de stad bezoeken' : 'Offizielle Rathaus-Seite'}
            <ExternalLink size={14} />
          </a>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mb-16">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <UnderlinedHeading 
            text={isNl ? 'Veelgestelde Vragen' : 'Häufig gestellte Fragen'} 
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
