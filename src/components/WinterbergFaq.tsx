import React, { useState, useMemo } from 'react';
import { ThemeConfig } from '../types';
import { 
  Search, 
  ChevronDown, 
  ChevronRight, 
  HelpCircle, 
  Utensils, 
  Snowflake, 
  Compass, 
  ShoppingBag, 
  Car, 
  Sparkles,
  ArrowLeft
} from 'lucide-react';

interface FaqItem {
  id: string;
  question: string;
  categoryGroup: 'Essen & Trinken' | 'Wintersport & Schnee' | 'Freizeit & Natur' | 'Einkaufen & Shopping' | 'Anreise & Parken';
  quickSummary: string;
  answerHtml: React.ReactNode;
  plainAnswer: string;
  relatedCategoryLinks?: {
    label: string;
    category: string;
    subcategory?: string;
  }[];
}

const FAQ_DATA: FaqItem[] = [
  {
    id: 'gut-essen',
    question: 'Wo kann man in Winterberg gut essen?',
    categoryGroup: 'Essen & Trinken',
    quickSummary: 'Winterberg bietet eine vielfältige Gastronomie: Von traditioneller Sauerländer Küche und Steakhäusern über italienische Pizzerien bis hin zu Panoramarestaurants und gemütlichen Skihütten.',
    plainAnswer: 'In Winterberg gibt es eine große gastronomische Auswahl. Beliebte Adressen sind das Hotel Hessenhof und Schneider\'s Restaurant für traditionelle Küche, die Kupferpfanne für Steaks, Da Salvatore für italienische Spezialitäten sowie die Panorama-Restaurants am Erlebnisberg Kappe und Möppi\'s Hütte.',
    answerHtml: (
      <div className="space-y-3">
        <p>In Winterberg und den umliegenden Ortsteilen erwartet Sie eine lebendige Restaurantszene:</p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li><strong>Traditionell & Sauerländisch:</strong> <em>Hotel Hessenhof</em> (Zentrum), <em>Schneider’s Restaurant</em>, <em>Gasthof Zur Post</em> sowie urgemütliche Landgasthöfe in den Ortsteilen (z. B. Altastenberg, Züschen).</li>
          <li><strong>Steak, Grill & International:</strong> <em>Kupferpfanne Winterberg</em> (Steaks & Grillspezialitäten), <em>Pizzeria Da Salvatore</em> oder <em>Benvenuto</em> (italienische Spezialitäten).</li>
          <li><strong>Hütten mit Panoramablick:</strong> <em>Panorama Café & Restaurant</em> auf dem Erlebnisberg Kappe, <em>Möppi’s Hütte</em> am Bremberg und die <em>Herrloh Hütte</em>.</li>
          <li><strong>Gehoben & Feinschmecker:</strong> Ausgewählte Restaurants und Romantik-Hotels mit regionaler Gourmetküche.</li>
        </ul>
        <p className="text-sm bg-amber-50 border border-amber-200 rounded-lg p-2.5 text-amber-900 mt-2">
          <strong>Tipp:</strong> Während der Skisaison (Dezember bis März) sowie an Ferien-Wochenenden empfiehlt sich eine Tischreservierung mindestens 2–3 Tage im Voraus.
        </p>
      </div>
    ),
    relatedCategoryLinks: [
      { label: 'Restaurants entdecken', category: 'Gastronomie', subcategory: 'Restaurant' },
      { label: 'Pizzerien & Trattorien', category: 'Gastronomie', subcategory: 'Pizzerien' },
      { label: 'Alle Gastronomiebetriebe', category: 'Gastronomie' }
    ]
  },
  {
    id: 'fruehstuecken',
    question: 'Wo kann man in Winterberg frühstücken?',
    categoryGroup: 'Essen & Trinken',
    quickSummary: 'Für ein gutes Frühstück oder Brunch gibt es in Winterberg gemütliche Bäckereicafés mit Etageren und Rührei sowie reichhaltige Hotel-Frühstücksbuffets für externe Gäste.',
    plainAnswer: 'Frühstücken kann man in der Bäckerei & Café Isken, im Café Krämer oder Café Engemann im Zentrum sowie bei großen Hotel-Frühstücksbuffets für Tagesgäste im Oversum Vital Resort und Hotel Hessenhof.',
    answerHtml: (
      <div className="space-y-3">
        <p>Egal ob schnelles Bäckerei-Frühstück, gemütlicher Brunch oder ausgiebiges Hotelbuffet:</p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li><strong>Bäckereien & Frühstückscafés:</strong> <em>Café Bäckerei Isken</em> (mehrere Standorte mit umfangreicher Frühstücksauswahl, Pancakes und Kaffeespezialitäten), <em>Café Krämer</em> und <em>Café Engemann</em> im Zentrum.</li>
          <li><strong>Hotel-Frühstücksbuffets für externe Gäste:</strong> Das <em>Oversum Vital Resort</em> und das <em>Hotel Hessenhof</em> bieten auch Tagesbesuchern ein erstklassiges Frühstücksbuffet an (vorherige Reservierung empfohlen).</li>
          <li><strong>Cafés an der Flaniermeile:</strong> Zahlreiche Cafés entlang der Straße <em>Am Waltenberg</em> bieten süße und herzhafte Frühstücksvariationen mit frischen Waffeln.</li>
        </ul>
      </div>
    ),
    relatedCategoryLinks: [
      { label: 'Cafés & Gastronomie', category: 'Gastronomie' },
      { label: 'Hotels & Unterkünfte', category: 'Hotels und Unterkünfte', subcategory: 'Hotels' }
    ]
  },
  {
    id: 'feiern-nachtleben',
    question: 'Wo kann man in Winterberg feiern?',
    categoryGroup: 'Essen & Trinken',
    quickSummary: 'Winterberg ist die Après-Ski- und Party-Hochburg im Sauerland. Gefeiert wird direkt an den Pistenhütten, in Tanzlokalen im Zentrum sowie in urgemütlichen Kneipen und Pubs.',
    plainAnswer: 'Gefeiert wird beim Après-Ski in Möppi\'s Hütte oder im Alm Salettl. Am Abend geht es weiter in die Großraum-Disko Tenne Winterberg, ins Alpenrausch, in die Dorf Alm sowie in Kneipen wie den Hessenkeller und das Blackwater Irish Pub.',
    answerHtml: (
      <div className="space-y-3">
        <p>Vom Hüttengaudi bis zum Nachtclub:</p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li><strong>Après-Ski direkt an den Hängen:</strong> <em>Möppi’s Hütte</em> (Bremberg), <em>Alm Salettl</em> und die Schirmbars am Herrloh – hier steigt die Stimmung bereits ab 15:00 Uhr.</li>
          <li><strong>Clubs & Discos:</strong> Die <em>Tenne Winterberg</em> (Kult-Tanzpalast mit mehreren Tanzbereichen) und der <em>Alpenrausch</em>.</li>
          <li><strong>Uriges Kneipenleben & Pubs:</strong> Der <em>Hessenkeller</em> (uriger Gewölbekeller mit Live-Events und DJ), das <em>Blackwater Irish Pub</em> (Guinness, Whiskys und Live-Sport) und die <em>Dorf Alm Winterberg</em>.</li>
          <li><strong>Cocktails & Lounge:</strong> <em>Bu'ket Bar</em> im Stadtzentrum.</li>
        </ul>
      </div>
    ),
    relatedCategoryLinks: [
      { label: 'Kneipen & Bars in Winterberg', category: 'Gastronomie', subcategory: 'Kneipen und Bars' },
      { label: 'Alle Gastronomiebetriebe', category: 'Gastronomie' }
    ]
  },
  {
    id: 'was-kann-man-abends-machen',
    question: 'Was kann man abends in Winterberg machen?',
    categoryGroup: 'Freizeit & Natur',
    quickSummary: 'Das Abendprogramm in Winterberg reicht von Flutlicht-Skifahren und Rodeln über gesellige Hüttenabende und Clubbesuche bis hin zu Wellness, Kino und Fackelwanderungen.',
    plainAnswer: 'Abends locken Flutlicht-Skifahren (Di, Mi, Fr, Sa bis 21:30 Uhr), gesellige Restaurantabende, Après-Ski in der Tenne oder Dorf Alm, Wellness im Oversum Vital Resort sowie Filmabende im Filmtheater Winterberg.',
    answerHtml: (
      <div className="space-y-3">
        <p>In Winterberg wird es auch nach Sonnenuntergang nicht langweilig:</p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li><strong>Flutlicht-Skifahren & Rodeln:</strong> Dienstags, mittwochs, freitags und samstags werden bis zu 14 Hänge im Skiliftkarussell hell erleuchtet (18:30 bis 21:30 Uhr).</li>
          <li><strong>Ausgehen & Nightlife:</strong> Party in der <em>Tenne</em>, Live-Musik und Bierkultur im <em>Blackwater Irish Pub</em> oder Schlager in der <em>Dorf Alm</em>.</li>
          <li><strong>Wellness-Abend:</strong> Ausgedehnte Saunagänge und Entspannung im Hallen- und Wellnessbereich des <em>Oversum</em>.</li>
          <li><strong>Kino & Kultur:</strong> Das <em>Filmtheater Winterberg</em> zeigt aktuelle Kino-Highlights; das Bürgerhaus veranstaltet Konzerte und Theater.</li>
          <li><strong>Romantischer Abendspaziergang:</strong> Ein Spaziergang durch den illuminierten Kurpark oder eine organisierte Fackel-Winterwanderung.</li>
        </ul>
      </div>
    ),
    relatedCategoryLinks: [
      { label: 'Freizeit & Erlebnisse', category: 'Freizeit', subcategory: 'Outdoor-Freizeitgebiet' },
      { label: 'Kneipen & Nachtleben', category: 'Gastronomie', subcategory: 'Kneipen und Bars' },
      { label: 'Schwimmbäder & Wellness', category: 'Freizeit', subcategory: 'Schwimmbäder' }
    ]
  },
  {
    id: 'wo-ist-was-los',
    question: 'Wo ist in Winterberg was los?',
    categoryGroup: 'Freizeit & Natur',
    quickSummary: 'Die lebendigsten Hotspots sind die Flaniermeile Am Waltenberg im Zentrum, der Erlebnisberg Kappe mit Bikepark und Sommerrodelbahn sowie das Skiliftkarussell im Winter.',
    plainAnswer: 'Die beliebtesten Anlaufstellen sind die Fußgängerzone Am Waltenberg, der Erlebnisberg Kappe (Bikepark, Kletterwald, Sommerrodelbahn, Bobbahn VELTINS-EisArena), das Skiliftkarussell Winterberg und der Kahler Asten.',
    answerHtml: (
      <div className="space-y-3">
        <p>Je nach Jahreszeit und Interesse gibt es mehrere zentrale Drehkreuze:</p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li><strong>Erlebnisberg Kappe (Ganzjährig):</strong> Das Action-Zentrum mit <em>Bikepark Winterberg</em>, der <em>Panorama Erlebnis Brücke</em>, <em>Sommerrodelbahn</em>, <em>Fly-Line</em>, <em>Kletterwald</em> und der <em>VELTINS-EisArena</em> (Bobbahn).</li>
          <li><strong>Stadtzentrum & Marktplatz (Untere Pforte):</strong> Die Straße <em>Am Waltenberg</em> ist gesäumt von Straßencafés, Boutiquen, Eisdielen und Restaurants.</li>
          <li><strong>Skiliftkarussell (Herrloh, Bremberg, Kappe):</strong> Im Winter der Treffpunkt für Zehntausende Wintersportler und Après-Ski-Fans.</li>
          <li><strong>Bikepark Winterberg (Frühjahr bis Herbst):</strong> Einer der größten und traditionsreichsten Mountainbike- und Downhill-Parks Europas.</li>
          <li><strong>Kahler Asten (841 m):</strong> Das Wahrzeichen des Hochsauerlands mit Astenturm, Wetterstation und Rundumblick.</li>
        </ul>
      </div>
    ),
    relatedCategoryLinks: [
      { label: 'Freizeiteinrichtungen', category: 'Freizeit', subcategory: 'Outdoor-Freizeitgebiet' },
      { label: 'Einzelhandel & Flaniermeile', category: 'Einzelhandel' }
    ]
  },
  {
    id: 'skifahren',
    question: 'Wo kann man in Winterberg skifahren?',
    categoryGroup: 'Wintersport & Schnee',
    quickSummary: 'Das Skiliftkarussell Winterberg ist das größte zusammenhängende Skigebiet im Sauerland mit 27,5 Pistenkilometern und rund 26 Liften. Ergänzt wird es durch Skidörfer wie Altastenberg und Neuastenberg.',
    plainAnswer: 'Skifahren kann man im Skiliftkarussell Winterberg (27,5 km Pisten, 26 Lifte, 6 Berge), im Skigebiet Postwiese Neuastenberg, im Skidorf Altastenberg mit dem FIS-Westfalenhang sowie am familienfreundlichen Sahnehang und an der Ruhrquelle.',
    answerHtml: (
      <div className="space-y-3">
        <p>Winterberg bietet erstklassige Wintersport-Infrastruktur mit modernster Flocken-Beschneiung:</p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li><strong>Skiliftkarussell Winterberg:</strong> 27,5 km Pisten, modernste Sessellifte über 6 Berge (Herrloh, Bremberg, Kappe, Poppenberg, Sürenberg, Kahler Asten) inklusive 14 beleuchteter Flutlichtpisten.</li>
          <li><strong>Skigebiet Postwiese Neuastenberg:</strong> Abwechslungsreiche Abfahrten, Funpark für Snowboarder und Freestyler sowie Flutlicht.</li>
          <li><strong>Skikarussell Altastenberg:</strong> Höchstgelegenes Skidorf mit anspruchsvollen Pisten, darunter der berühmte FIS-Slalomhang <em>Westfalenhang</em>.</li>
          <li><strong>Sahnehang am Kahlen Asten:</strong> Sehr breite, sanfte Hänge – optimal für Kinder, Anfänger und Skischulkurse.</li>
          <li><strong>Skigebiet Ruhrquelle:</strong> Übersichtliches Familienskigebiet mit 4er-Sessellift und Skiverleih direkt an der B480.</li>
        </ul>
      </div>
    ),
    relatedCategoryLinks: [
      { label: 'Outdoor & Freizeiteinrichtungen', category: 'Freizeit', subcategory: 'Outdoor-Freizeitgebiet' },
      { label: 'Unterkünfte in Pistennähe', category: 'Hotels und Unterkünfte', subcategory: 'Hotels' }
    ]
  },
  {
    id: 'schlitten-fahren',
    question: 'Wo kann man in Winterberg Schlitten fahren?',
    categoryGroup: 'Wintersport & Schnee',
    quickSummary: 'In Winterberg gibt es präparierte und beschneite Rodelhänge mit eigenen Rodelliften (z. B. am Bremberg und Herrloh) sowie Rodelmöglichkeiten in Neuastenberg und an der Ruhrquelle.',
    plainAnswer: 'Beliebte Rodelhänge mit Rodelliften und Flutlicht sind das Rodelparadies Herrloh (Lift Nr. 1), der Rodelhang Bremberg (Lift Nr. 20), die Ruhrquelle und das Rodelgebiet Postwiese Neuastenberg. Schlitten können direkt an den Talstationen geliehen werden.',
    answerHtml: (
      <div className="space-y-3">
        <p>Rodelspaß für die ganze Familie mit komfortablem Lift-Transport nach oben:</p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li><strong>Rodelparadies Herrloh (Lift Nr. 1):</strong> Direkt unterhalb der St. Georg Schanze – zentral, schneesicher beschneit und mit Flutlicht.</li>
          <li><strong>Rodelhang Bremberg (Lift Nr. 20):</strong> Weitläufiger, sanft abfallender Hang mit speziellem Rodellift – perfekt für Familien mit kleineren Kindern.</li>
          <li><strong>Rodelhang Ruhrquelle:</strong> Ausgestattet mit einem bequemen Förderband (Zauberteppich) und Skiverleih direkt am Parkplatz.</li>
          <li><strong>Postwiese Neuastenberg:</strong> Separater Rodelhang mit eigenem Rodellift und Flutlichtbetrieb.</li>
        </ul>
        <p className="text-sm bg-green-50 border border-green-200 rounded-lg p-2.5 text-green-900 mt-2">
          <strong>Schlittenverleih:</strong> Sie müssen keinen eigenen Schlitten mitbringen. An allen Talstationen stehen Leihschlitten und Bobs gegen eine geringe Gebühr bereit.
        </p>
      </div>
    ),
    relatedCategoryLinks: [
      { label: 'Freizeit- & Wintersportgebiete', category: 'Freizeit', subcategory: 'Outdoor-Freizeitgebiet' }
    ]
  },
  {
    id: 'skipass-kaufen',
    question: 'Wo kann man in Winterberg Skipass kaufen?',
    categoryGroup: 'Wintersport & Schnee',
    quickSummary: 'Skipässe können kontaktlos online über die Webshops des Skiliftkarussells und der Wintersport-Arena gekauft oder direkt an den Kassenautomaten und Kassenhäuschen vor Ort erworben werden.',
    plainAnswer: 'Skipässe gibt es online über skiliftkarussell.de oder wintersport-arena.de (Aufladung auf Keycard oder QR-Code für Pick-up-Automaten) sowie an allen Kassen der Talstationen an den Parkplätzen P1 bis P7.',
    answerHtml: (
      <div className="space-y-3">
        <p>So gelangen Sie am schnellsten zu Ihrem Liftticket:</p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li><strong>Online-Ticketshop (Empfohlen):</strong> Über <em>skiliftkarussell.de</em> oder <em>wintersport-arena.de</em>. Sie können vorhandene Keycards direkt aufladen oder einen QR-Code auf Ihr Smartphone erhalten, den Sie an den Pick-up-Automaten kontaktlos gegen eine Karte eintauschen – so umgehen Sie Kassen-Warteschlangen.</li>
          <li><strong>Vor Ort an den Liftkassen:</strong> An allen Hauptparkplätzen (P1 Herrloh, P2/P3 Bremberg, P4/P5 Kappe, Sürenberg, Ruhrquelle) gibt es besetzte Kassenhäuschen und Ticketautomaten.</li>
          <li><strong>Mehrtagestickets:</strong> Ab einer Dauer von 3 Tagen lohnt sich die <em>Wintersport-Arena Card</em>, die in bis zu 8 Skigebieten der Region gültig ist.</li>
        </ul>
      </div>
    ),
    relatedCategoryLinks: [
      { label: 'Freizeitanlagen in Winterberg', category: 'Freizeit', subcategory: 'Outdoor-Freizeitgebiet' }
    ]
  },
  {
    id: 'schnee-spazieren',
    question: 'Wo kann man in Winterberg im Schnee spazieren gehen?',
    categoryGroup: 'Wintersport & Schnee',
    quickSummary: 'Gewalzte und geräumte Winterwanderwege finden Sie auf dem Kahlen Asten, im Kurpark Winterberg (Philosophenweg), rund um die St. Georg Schanze und am Bremberg.',
    plainAnswer: 'Geräumte Winterwanderwege gibt es auf dem Kahlen Asten (841 m Hochheide-Rundweg), im Kurpark Winterberg mit dem Philosophenweg, rund um den Herrloh an der Schanze und entlang der Waldwege am Bremberg.',
    answerHtml: (
      <div className="space-y-3">
        <p>Die schönsten Winterspaziergänge abseits der Skipisten:</p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li><strong>Kahler Asten (841 m):</strong> Der geräumte Gipfelrundweg führt durch die verschneite Hochheide und bietet traumhafte Fernsichten über das Sauerland.</li>
          <li><strong>Kurpark Winterberg & Philosophenweg:</strong> Barrierearme, flache und regelmäßig geräumte Wege direkt ab Stadtkern – ideal für einen entspannten Nachmittagsspaziergang.</li>
          <li><strong>Herrloh-Panoramaweg:</strong> Rund um die St. Georg Schanze mit schönem Blick auf das Skigeschehen.</li>
          <li><strong>Waldwege am Bremberg:</strong> Winterzauber pur auf Teilstücken des Rothaarsteigs durch tief verschneite Fichten- und Buchenwälder.</li>
        </ul>
        <p className="text-sm bg-blue-50 border border-blue-200 rounded-lg p-2.5 text-blue-900 mt-2">
          <strong>Ausrüstung:</strong> Wasserdichte Wanderschuhe mit griffiger Profilsohle sind ratsam. Bei vereisten Abschnitten erleichtern Grödel (Schuh-Spikes) das Gehen.
        </p>
      </div>
    ),
    relatedCategoryLinks: [
      { label: 'Freizeit & Natur entdecken', category: 'Freizeit', subcategory: 'Outdoor-Freizeitgebiet' }
    ]
  },
  {
    id: 'skisprungschanze',
    question: 'Gibt es in Winterberg eine Skisprungschanze?',
    categoryGroup: 'Wintersport & Schnee',
    quickSummary: 'Ja, die traditionsreiche St. Georg Schanze (K81 / HS87) auf dem Herrloh ist das Wahrzeichen von Winterberg. Sie wird ganzjährig für Training und Wettkämpfe genutzt und besitzt einen Aussichtsturm.',
    plainAnswer: 'Ja, die St. Georg Schanze am Herrloh ist eines der bekanntesten Wahrzeichen von Winterberg. Sie verfügt über Mattenbelag für den Sommerbetrieb, einen Aussichtsturm mit Panoramablick und ein Schanzen-Restaurant.',
    answerHtml: (
      <div className="space-y-3">
        <p>Die Schanze ist ein echter Touristenmagnet und sportliches Zentrum:</p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li><strong>Die Anlage:</strong> Die Großschanze hat einen K-Punkt von 81 Metern (Hillsize HS 87). Dank Kunststoffmatten trainieren hier Bundes- und Landeskader das ganze Jahr über.</li>
          <li><strong>Aussichtsturm & Besichtigung:</strong> Besucher können die Treppen des Schanzenturms erklimmen und einen grandiosen 360-Grad-Blick über Winterberg und die Bobbahn genießen.</li>
          <li><strong>Gastronomie:</strong> Direkt am Fuß der Schanze lädt das <em>Schanzen-Restaurant</em> zur Einkehr ein.</li>
          <li><strong>Nachwuchs-Schanzen:</strong> Ergänzt wird die Anlage durch mehrere kleine Mattenschanzen (K10 bis K44) für den Skisprung-Nachwuchs.</li>
        </ul>
      </div>
    ),
    relatedCategoryLinks: [
      { label: 'Outdoor-Freizeitziele', category: 'Freizeit', subcategory: 'Outdoor-Freizeitgebiet' },
      { label: 'Gastronomie an der Schanze', category: 'Gastronomie', subcategory: 'Restaurant' }
    ]
  },
  {
    id: 'weihnachtsmarkt',
    question: 'Gibt es in Winterberg einen Weihnachtsmarkt?',
    categoryGroup: 'Freizeit & Natur',
    quickSummary: 'Ja, das beliebte „Winterberger Winterdorf“ auf dem Marktplatz (Untere Pforte). Es ist von Mitte Dezember bis Anfang Januar über den gesamten Jahreswechsel geöffnet und bietet eine Eislaufbahn.',
    plainAnswer: 'Ja, das Winterberger Winterdorf auf dem Marktplatz bietet Holzhütten, Glühwein, Sauerländer Spezialitäten, Live-Musik und eine Eislaufbahn. Es hat über Weihnachten bis Anfang Januar geöffnet.',
    answerHtml: (
      <div className="space-y-3">
        <p>Ein besonderes Winter-Erlebnis mitten im Stadtkern:</p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li><strong>Uriges Winterdorf:</strong> Liebevoll dekorierte Holzhütten mit Winzerglühwein, Punsch, Reibekuchen, Mandeln und Sauerländer Spezialitäten.</li>
          <li><strong>Echte Eislaufbahn:</strong> Mitten auf dem Marktplatz können Groß und Klein Schlittschuh laufen (Schlittschuhverleih direkt vor Ort).</li>
          <li><strong>Über den Jahreswechsel geöffnet:</strong> Anders als viele Märkte bleibt das Winterdorf auch über Silvester und Neujahr bis Anfang Januar geöffnet.</li>
          <li><strong>Adventsmärkte in den Ortsteilen:</strong> An einzelnen Wochenenden veranstalten auch Ortsteile wie Siedlinghausen und Züschen gemütliche Kunsthandwerkermärkte.</li>
        </ul>
      </div>
    ),
    relatedCategoryLinks: [
      { label: 'Einzelhandel in der Innenstadt', category: 'Einzelhandel' },
      { label: 'Gastronomie & Imbisse', category: 'Gastronomie', subcategory: 'Imbisse' }
    ]
  },
  {
    id: 'wandern',
    question: 'Kann man in Winterberg wandern?',
    categoryGroup: 'Freizeit & Natur',
    quickSummary: 'Ja, Winterberg ist eine zertifizierte Qualitätsregion „Wanderbares Deutschland“ mit herausragenden Wanderrouten wie dem Rothaarsteig und der 86 km langen Winterberger Hochtour.',
    plainAnswer: 'Ja, Winterberg ist ein erstklassiges Wandergebiet. Zu den Highlights zählen der Rothaarsteig, die 86 km lange Winterberger Hochtour, der Hochheide-Rundweg auf dem Kahlen Asten und der Schluchten- und Brückenpfad durch das Helle-Tal.',
    answerHtml: (
      <div className="space-y-3">
        <p>Vom gemütlichen Spaziergang bis zur anspruchsvollen Mehrtagesetappe:</p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li><strong>Rothaarsteig:</strong> Der berühmte „Weg der Sinne“ führt direkt über den Kahlen Asten und durch das Stadtgebiet.</li>
          <li><strong>Winterberger Hochtour (WHT):</strong> 86 km anspruchsvoller Rundwanderweg, der alle 14 Ortsteile und die höchsten Berge verbindet.</li>
          <li><strong>Heidelehrpfad Kahler Asten:</strong> Entspannter Rundweg durch die europaweit bedeutsame Bergheide mit Panoramablick.</li>
          <li><strong>Schluchten- und Brückenpfad:</strong> Ein wildromantischer Pfad durch das Helle-Tal mit Brücken, Stegen und Felsformationen.</li>
          <li><strong>Goldener Pfad:</strong> Landschaftstherapeutischer Achtsamkeitsweg auf der Niedersfelder Hochheide mit Ruhestationen.</li>
        </ul>
      </div>
    ),
    relatedCategoryLinks: [
      { label: 'Freizeit & Outdoor-Ziele', category: 'Freizeit', subcategory: 'Outdoor-Freizeitgebiet' },
      { label: 'Wanderhotels & Pensionen', category: 'Hotels und Unterkünfte', subcategory: 'Hotels' }
    ]
  },
  {
    id: 'see',
    question: 'Gibt es in Winterberg einen See?',
    categoryGroup: 'Freizeit & Natur',
    quickSummary: 'Ja, den Hillebachsee im Ortsteil Niedersfeld (Freizeit- und Badesee mit Wasserski-Anlage) sowie die idyllischen Kurparkteiche im Stadtzentrum von Winterberg.',
    plainAnswer: 'Ja, im Stadtteil Niedersfeld liegt der Hillebachsee mit asphaltiertem Uferrundweg, Wasserski-Anlage und Gastronomie. Im Zentrum gibt es zudem die Kurpark-Teiche.',
    answerHtml: (
      <div className="space-y-3">
        <p>Wassererlebnisse in und um Winterberg:</p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li><strong>Hillebachsee Niedersfeld:</strong> Der größte See im Stadtgebiet (ca. 8 km nördlich). Bietet einen 1,6 km langen asphaltierten Rundweg (ideal für Spaziergänger, Inlineskater und Kinderwagen), Wasserski- und Wakeboardseilbahn sowie Gastronomie (<em>High Five</em>).</li>
          <li><strong>Kurparkteich Winterberg:</strong> Gepflegter Landschaftsteich mit Fontäne, Spazierwegen und Bänken im Herzen der Stadt.</li>
          <li><strong>Große Talsperren der Region:</strong> In 25–35 Autominuten erreichen Sie zudem den <em>Hennesee</em>, <em>Diemelsee</em> und <em>Biggesee</em>.</li>
        </ul>
      </div>
    ),
    relatedCategoryLinks: [
      { label: 'Freizeit & Outdoor am Wasser', category: 'Freizeit', subcategory: 'Outdoor-Freizeitgebiet' }
    ]
  },
  {
    id: 'badesee',
    question: 'Gibt es in Winterberg einen Badesee?',
    categoryGroup: 'Freizeit & Natur',
    quickSummary: 'Ja! Der Hillebachsee in Winterberg-Niedersfeld ist der offizielle Badesee mit kostenlos zugänglichem Sandstrand, Liegewiese, Badebucht und Wassersport-Angeboten.',
    plainAnswer: 'Ja, der Hillebachsee in Niedersfeld ist ein offizieller Badesee mit freiem Eintritt, Sandstrand, Liegewiese, Badeinsel, Nichtschwimmerbereich und Wasserski-Anlage.',
    answerHtml: (
      <div className="space-y-3">
        <p>Der Hillebachsee bietet vollen Badespaß an heißen Sommertagen:</p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li><strong>Badebereich:</strong> Ausgewiesene Badebucht mit Sandstrand, Flachwasserzone für Kinder, Badeinsel im See und großer Liegewiese.</li>
          <li><strong>Eintritt:</strong> Der Zugang zur Badestelle und Liegewiese ist <strong>kostenlos</strong>.</li>
          <li><strong>Aktivitäten & Sport:</strong> Wasserski- und Wakeboard-Seilbahn, Stand-Up-Paddling (SUP-Verleih), Beachvolleyballfeld und Kinderspielplatz.</li>
          <li><strong>Infrastruktur:</strong> Öffentliche WCs, Umkleiden und Gastronomie mit Seeterrasse direkt vor Ort.</li>
        </ul>
      </div>
    ),
    relatedCategoryLinks: [
      { label: 'Schwimmbäder & Badeseen', category: 'Freizeit', subcategory: 'Schwimmbäder' },
      { label: 'Freizeitanlagen am Hillebachsee', category: 'Freizeit', subcategory: 'Outdoor-Freizeitgebiet' }
    ]
  },
  {
    id: 'freibad',
    question: 'Gibt es in Winterberg ein Freibad?',
    categoryGroup: 'Freizeit & Natur',
    quickSummary: 'Ja, die Stadt Winterberg betreibt im Ortsteil Siedlinghausen ein beheiztes Freibad mit 25m-Becken, Sprungturm, Rutsche und Liegewiese. Hinzu kommt das Strandbad am Hillebachsee.',
    plainAnswer: 'Ja, das beheizte Freibad in Winterberg-Siedlinghausen bietet ein 25m-Schwimmerbecken, Nichtschwimmerbereich, Sprungturm, Rutsche und Liegewiese. Zudem gibt es den Badesee in Niedersfeld.',
    answerHtml: (
      <div className="space-y-3">
        <p>Freibad-Spaß unter freiem Sauerländer Himmel:</p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li><strong>Freibad Siedlinghausen:</strong> Beheiztes Freibad mit 25-Meter-Sportbecken, Nichtschwimmerbecken, 1m- und 3m-Sprungturm, Rutsche, Kinderplanschbecken und Kiosk.</li>
          <li><strong>Naturbadestelle Hillebachsee (Niedersfeld):</strong> Kostenloses Open-Air-Baden am Sandstrand des Sees.</li>
          <li><strong>Wetterunabhängige Alternative:</strong> Das Hallen- und Erlebnisbad im <em>Oversum Vital Resort</em> im Zentrum.</li>
        </ul>
      </div>
    ),
    relatedCategoryLinks: [
      { label: 'Schwimmbäder in Winterberg', category: 'Freizeit', subcategory: 'Schwimmbäder' }
    ]
  },
  {
    id: 'schwimmbad',
    question: 'Gibt es in Winterberg ein Schwimmbad?',
    categoryGroup: 'Freizeit & Natur',
    quickSummary: 'Ja, das städtische Sport- und Wellnessbad im Oversum Vital Resort im Zentrum, das beheizte Freibad Siedlinghausen sowie den Badesee in Niedersfeld.',
    plainAnswer: 'Ja, das Oversum Vital Resort im Stadtzentrum beherbergt ein städtisches Hallenbad mit 25m-Sportbecken, Kinderbereich und großer Saunalandschaft. Ergänzt wird es durch das Freibad Siedlinghausen.',
    answerHtml: (
      <div className="space-y-3">
        <p>Für Sportler, Familien und Erholungssuchende:</p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li><strong>Hallenbad im Oversum Vital Resort (Zentrum):</strong> Modernes städtisches Schwimmbad mit 25-Meter-Sportbecken, Aquafitness-Angeboten, Kinder-Erlebnisbecken sowie einer großzügigen Saunalandschaft (Finnische Sauna, Bio-Sauna, Dampfbad). <em>Adresse: Am Kurpark 6, 59955 Winterberg</em></li>
          <li><strong>Freibad Siedlinghausen:</strong> Beheiztes Außenbecken für die Sommermonate mit großer Liegewiese.</li>
          <li><strong>Hotel-Spas:</strong> Zahlreiche Wellnesshotels bieten zudem Day-Spa-Tageskarten für externe Gäste an.</li>
        </ul>
      </div>
    ),
    relatedCategoryLinks: [
      { label: 'Schwimmbäder & Bäder', category: 'Freizeit', subcategory: 'Schwimmbäder' },
      { label: 'Wellnesshotels & Unterkünfte', category: 'Hotels und Unterkünfte', subcategory: 'Hotels' }
    ]
  },
  {
    id: 'shoppen',
    question: 'Kann man in Winterberg shoppen?',
    categoryGroup: 'Einkaufen & Shopping',
    quickSummary: 'Ja! Die Fußgängerzone und die Straßen Am Waltenberg und Hellstraße bieten Sport- und Outdoorgeschäfte, Boutiquen, Schuhe und Sauerländer Spezialitäten – oft auch sonntags geöffnet.',
    plainAnswer: 'Ja, Winterberg bietet eine lebendige Einkaufsmeile entlang der Straßen Am Waltenberg und Hellstraße mit Sportgeschäften, Modegeschäften und Geschenkeläden. Durch die Bäderregelung haben viele Läden auch sonntags geöffnet.',
    answerHtml: (
      <div className="space-y-3">
        <p>Bummeln und Einkaufen in angenehmer Urlaubsatmosphäre:</p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li><strong>Flaniermeile Am Waltenberg & Untere Pforte:</strong> Das Shopping-Zentrum mit Damen- und Herrenmode, Schuhen, Schmuck, Dekoration und Geschenken.</li>
          <li><strong>Sport- & Outdoorbekleidung:</strong> Große Fachgeschäfte (z. B. <em>Sport Schneider</em>, <em>Sport Klante</em>) mit aktueller Ski-, Wander- und Bike-Ausrüstung namhafter Marken.</li>
          <li><strong>Sauerländer Spezialitäten:</strong> Regionale Schinken, Spirituosen, Senfkreationen und Handwerksprodukte als Mitbringsel.</li>
          <li><strong>Sonntagsöffnung:</strong> Als heilklimatischer Kurort profitieren viele Geschäfte von der Bäderregelung und öffnen an Sonn- und Feiertagen nachmittags ihre Türen.</li>
        </ul>
      </div>
    ),
    relatedCategoryLinks: [
      { label: 'Bekleidung & Mode in Winterberg', category: 'Einzelhandel', subcategory: 'Bekleidung' },
      { label: 'Alle Einzelhändler', category: 'Einzelhandel' }
    ]
  },
  {
    id: 'aldi',
    question: 'Gibt es in Winterberg einen ALDI?',
    categoryGroup: 'Einkaufen & Shopping',
    quickSummary: 'Ja, in der Remmeswiese 13 in Winterberg gibt es eine moderne Filiale von ALDI Nord mit großem kostenlosem Parkplatz und eigener Backstation.',
    plainAnswer: 'Ja, eine moderne Filiale von ALDI Nord befindet sich in der Remmeswiese 13 in Winterberg (in direkter Nachbarschaft zu Lidl und dm).',
    answerHtml: (
      <div className="space-y-3">
        <p>Alles für die Selbstverpflegung im Urlaub:</p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li><strong>Standort:</strong> <em>Remmeswiese 13, 59955 Winterberg</em> (im Fachmarktzentrum, ca. 2 Fahrminuten vom Zentrum entfernt).</li>
          <li><strong>Ausstattung:</strong> Moderne Filiale mit Frischetheke, Backstation für frisches Brot und Brötchen sowie wöchentlich wechselnden Aktionsartikeln.</li>
          <li><strong>Parken:</strong> Großer, kostenloser Kundenparkplatz direkt vor dem Gebäude.</li>
          <li><strong>Nachbarschaft:</strong> In unmittelbarer Nähe liegen weitere Märkte wie Lidl, REWE und dm.</li>
        </ul>
      </div>
    ),
    relatedCategoryLinks: [
      { label: 'Supermärkte & Discounter', category: 'Einzelhandel', subcategory: 'Supermarkt' }
    ]
  },
  {
    id: 'lidl',
    question: 'Gibt es in Winterberg einen LIDL?',
    categoryGroup: 'Einkaufen & Shopping',
    quickSummary: 'Ja, ein großer LIDL-Markt befindet sich in der Remmeswiese 7 in Winterberg mit eigener Backstation und vielen kostenfreien Parkplätzen.',
    plainAnswer: 'Ja, eine LIDL-Filiale befindet sich in der Remmeswiese 7 in Winterberg, direkt neben ALDI und dm.',
    answerHtml: (
      <div className="space-y-3">
        <p>Günstig und frisch einkaufen in Winterberg:</p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li><strong>Standort:</strong> <em>Remmeswiese 7, 59955 Winterberg</em>.</li>
          <li><strong>Angebot:</strong> Breites Sortiment an Lebensmitteln, Bio-Produkten, frischem Obst und Gemüse, Backstation sowie Aktionsartikeln.</li>
          <li><strong>Parken:</strong> Breiter Kundenparkplatz mit kostenfreien Stellplätzen.</li>
        </ul>
      </div>
    ),
    relatedCategoryLinks: [
      { label: 'Supermärkte & Nahversorgung', category: 'Einzelhandel', subcategory: 'Supermarkt' }
    ]
  },
  {
    id: 'parken',
    question: 'Wo kann man in Winterberg parken?',
    categoryGroup: 'Anreise & Parken',
    quickSummary: 'Für Skifahrer gibt es Großparkplätze P1 bis P7 direkt an den Liften. Für das Zentrum stehen das Parkhaus Am Waltenberg, Parkplätze am Bahnhof und am Oversum bereit.',
    plainAnswer: 'Skifahrer parken auf P1 (Herrloh), P2/P3 (Bremberg) oder P4/P5 (Kappe). Für Innenstadtbesuche gibt es das Parkhaus Zentrum / Am Waltenberg sowie Parkplätze am Bahnhof und am Oversum.',
    answerHtml: (
      <div className="space-y-3">
        <p>Winterberg verfügt über ein modernes digitales Parkleitsystem:</p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li><strong>Skifahrer- & Pistenparkplätze:</strong>
            <ul className="list-disc pl-5 mt-1 space-y-1">
              <li><strong>P1 (Herrloh / Schanze):</strong> Zufahrt über die B480</li>
              <li><strong>P2 & P3 (Bremberg / Rodellifte):</strong> Zufahrt über die B236</li>
              <li><strong>P4 & P5 (Erlebnisberg Kappe / Bobbahn):</strong> Zufahrt über die Kapperundweg</li>
              <li><strong>P6 & P7 (Sürenberg / Nordhang):</strong> Weitläufige Parkflächen</li>
            </ul>
          </li>
          <li><strong>Parken in der Innenstadt & zum Einkaufen:</strong>
            <ul className="list-disc pl-5 mt-1 space-y-1">
              <li>Parkhaus <em>Zentrum / Am Waltenberg</em> (Zentrale Tiefgarage)</li>
              <li>Parkplatz <em>Bahnhof / Poststraße</em></li>
              <li>Tiefgarage / Parkplatz am <em>Oversum (Am Kurpark)</em></li>
            </ul>
          </li>
          <li><strong>Wanderparkplätze:</strong> Wanderparkplatz Kahler Asten, Parkplatz Ruhrquelle, Parkplatz Hillebachsee Niedersfeld.</li>
        </ul>
        <p className="text-sm bg-amber-50 border border-amber-200 rounded-lg p-2.5 text-amber-900 mt-2">
          <strong>Anreise-Tipp im Winter:</strong> An sonnigen Winter-Wochenenden empfiehlt sich die Anreise vor 9:00 Uhr morgens, um Staus und voll besetzte Parkplätze zu umgehen.
        </p>
      </div>
    ),
    relatedCategoryLinks: [
      { label: 'Dienstleister in Winterberg', category: 'Dienstleistungen' },
      { label: 'Freizeit- und Ausflugsziele', category: 'Freizeit', subcategory: 'Outdoor-Freizeitgebiet' }
    ]
  },
  {
    id: 'bahnhof',
    question: 'Gibt es in Winterberg einen Bahnhof?',
    categoryGroup: 'Anreise & Parken',
    quickSummary: 'Ja, der Bahnhof Winterberg (Westfalen) ist die Endstation des RE 57 (Dortmund–Winterberg). Der moderne Bürgerbahnhof bietet Tourist-Info und den zentralen Busbahnhof (ZOB).',
    plainAnswer: 'Ja, der Bahnhof Winterberg (Westfalen) wird regelmäßig vom RE 57 aus Dortmund bedient. Er beherbergt die Tourist-Information und den Busbahnhof mit Skibussen zu allen Pisten und Ortsteilen.',
    answerHtml: (
      <div className="space-y-3">
        <p>Bequeme und staufreie Anreise mit der Bahn:</p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li><strong>Zugverbindungen:</strong> Der <em>RE 57 (Dortmund-Sauerland-Express)</em> fährt im regelmäßigen Takt direkt von Dortmund über Bestwig nach Winterberg. An Wochenenden und im Winter verkehren zusätzliche Sonderzüge.</li>
          <li><strong>Bürgerbahnhof:</strong> Im Gebäude befinden sich die Tourist-Information mit Ticketverkauf, ein Bistro/Café, Wartebereiche und barrierefreie Zugänge.</li>
          <li><strong>Busanbindung vor Ort (ZOB):</strong> Direkt am Bahnhofsvorplatz starten die Skibusse zu den Pisten (P1–P7) sowie Linienbusse in alle 14 Ortsteile (z. B. Altastenberg, Neuastenberg, Niedersfeld, Züschen).</li>
          <li><strong>Adresse:</strong> <em>Bahnhofstraße 12, 59955 Winterberg</em></li>
        </ul>
      </div>
    ),
    relatedCategoryLinks: [
      { label: 'Dienstleister vor Ort', category: 'Dienstleistungen' }
    ]
  }
];

const CATEGORY_GROUPS = [
  { id: 'Alle', label: 'Alle Fragen', icon: HelpCircle },
  { id: 'Essen & Trinken', label: 'Essen & Trinken', icon: Utensils },
  { id: 'Wintersport & Schnee', label: 'Wintersport & Schnee', icon: Snowflake },
  { id: 'Freizeit & Natur', label: 'Freizeit & Natur', icon: Compass },
  { id: 'Einkaufen & Shopping', label: 'Einkaufen & Shopping', icon: ShoppingBag },
  { id: 'Anreise & Parken', label: 'Anreise & Parken', icon: Car },
];

interface WinterbergFaqProps {
  theme: ThemeConfig;
  activeThemeKey: string;
  onBack: () => void;
  onSelectCategory: (category: string, subcategory?: string) => void;
}

export default function WinterbergFaq({ theme, activeThemeKey, onBack, onSelectCategory }: WinterbergFaqProps) {
  const [selectedGroup, setSelectedGroup] = useState<string>('Alle');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [openFaqIds, setOpenFaqIds] = useState<Set<string>>(new Set(['gut-essen', 'skifahren']));

  const filteredFaqs = useMemo(() => {
    return FAQ_DATA.filter(item => {
      const matchesGroup = selectedGroup === 'Alle' || item.categoryGroup === selectedGroup;
      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchesGroup;
      
      const matchesSearch = 
        item.question.toLowerCase().includes(q) ||
        item.quickSummary.toLowerCase().includes(q) ||
        item.plainAnswer.toLowerCase().includes(q) ||
        item.categoryGroup.toLowerCase().includes(q);

      return matchesGroup && matchesSearch;
    });
  }, [selectedGroup, searchQuery]);

  const toggleFaq = (id: string) => {
    setOpenFaqIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const expandAll = () => {
    setOpenFaqIds(new Set(filteredFaqs.map(f => f.id)));
  };

  const collapseAll = () => {
    setOpenFaqIds(new Set());
  };

  // Schema.org FAQPage JSON-LD
  const faqSchema = useMemo(() => {
    return {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'mainEntity': FAQ_DATA.map(item => ({
        '@type': 'Question',
        'name': item.question,
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': item.plainAnswer
        }
      }))
    };
  }, []);

  return (
    <main className="flex-1 w-full max-w-[1040px] mx-auto px-4 md:px-6 py-8 md:py-12 pb-20">
      {/* Schema.org FAQ Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Navigation Breadcrumb */}
      <div className="flex items-center gap-2 mb-6">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1 text-[13.5px] font-medium text-[#5F6B63] hover:text-[#0F4C2E] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Zurück zum Verzeichnis
        </button>
        <span className="text-[#5F6B63]/40">/</span>
        <span className="text-[13.5px] text-[#0F4C2E] font-semibold">Winterberg FAQs</span>
      </div>

      {/* Page Header */}
      <div className="bg-white border border-[#EDE8E0] rounded-[24px] p-6 md:p-10 shadow-[0_10px_30px_rgba(27,33,29,0.04)] mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0F4C2E]/10 text-[#0F4C2E] text-xs font-bold tracking-wide uppercase mb-3">
          <Sparkles className="w-3.5 h-3.5 text-[#F2761B]" />
          Winterberg Ratgeber & FAQ
        </div>
        <h1 className="font-display text-[28px] md:text-[42px] font-bold tracking-tight text-[#1B211D] mb-3 leading-tight">
          Häufig gestellte Fragen zu Winterberg
        </h1>
        <p className="text-[15px] md:text-[17px] leading-relaxed text-[#4A544D] max-w-[78ch] mb-6">
          Alles Wichtige rund um Restaurants, Skifahren, Rodeln, Parken, Shopping, Ausflugsziele und praktische Tipps für Ihren Aufenthalt in Winterberg und den 14 Ortsteilen.
        </p>

        {/* Live Search Bar */}
        <div className="relative w-full max-w-[650px]">
          <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Frage oder Stichwort suchen (z.B. Schlitten, Parken, ALDI, See, Skipass)..."
            className="w-full pl-12 pr-10 py-3.5 bg-[#FAF8F5] border border-[#D8D2C8] rounded-xl text-[15px] text-[#1B211D] placeholder:text-gray-400 focus:outline-none focus:border-[#0F4C2E] focus:bg-white transition-all shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-500 hover:text-gray-800 bg-gray-200 hover:bg-gray-300 rounded-full px-2 py-1"
            >
              Löschen
            </button>
          )}
        </div>
      </div>

      {/* Filter Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 no-scrollbar">
        {CATEGORY_GROUPS.map(group => {
          const Icon = group.icon;
          const isActive = selectedGroup === group.id;
          const count = group.id === 'Alle' 
            ? FAQ_DATA.length 
            : FAQ_DATA.filter(f => f.categoryGroup === group.id).length;

          return (
            <button
              key={group.id}
              type="button"
              onClick={() => setSelectedGroup(group.id)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-[14px] font-medium whitespace-nowrap transition-all cursor-pointer border ${
                isActive
                  ? 'bg-[#0F4C2E] text-white border-[#0F4C2E] shadow-sm'
                  : 'bg-white text-[#4A544D] border-[#EDE8E0] hover:border-[#0F4C2E]/40 hover:bg-[#FAF8F5]'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-[#F2761B]' : 'text-[#5F6B63]'}`} />
              <span>{group.label}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Action Bar (Results Count & Expand/Collapse) */}
      <div className="flex justify-between items-center mb-4 px-1">
        <span className="text-[14px] text-[#5F6B63] font-medium">
          {filteredFaqs.length} {filteredFaqs.length === 1 ? 'Frage' : 'Fragen'} {selectedGroup !== 'Alle' ? `in „${selectedGroup}“` : ''} gefunden
        </span>
        <div className="flex gap-3 text-xs font-semibold text-[#0F4C2E]">
          <button
            type="button"
            onClick={expandAll}
            className="hover:underline cursor-pointer"
          >
            Alle öffnen
          </button>
          <span className="text-gray-300">|</span>
          <button
            type="button"
            onClick={collapseAll}
            className="hover:underline cursor-pointer"
          >
            Alle schließen
          </button>
        </div>
      </div>

      {/* FAQ Accordion List */}
      <div className="space-y-3">
        {filteredFaqs.length === 0 ? (
          <div className="bg-white border border-dashed border-[#D8D2C8] rounded-[20px] p-10 text-center text-[#5F6B63]">
            <HelpCircle className="w-10 h-10 mx-auto text-gray-300 mb-3" />
            <p className="font-semibold text-lg text-gray-700 mb-1">Keine passende Frage gefunden</p>
            <p className="text-sm">Versuchen Sie einen anderen Suchbegriff oder wählen Sie „Alle Fragen“ aus.</p>
            <button
              type="button"
              onClick={() => { setSearchQuery(''); setSelectedGroup('Alle'); }}
              className="mt-4 px-4 py-2 bg-[#0F4C2E] text-white text-sm font-semibold rounded-full"
            >
              Filter zurücksetzen
            </button>
          </div>
        ) : (
          filteredFaqs.map((faq) => {
            const isOpen = openFaqIds.has(faq.id);
            return (
              <div
                key={faq.id}
                id={faq.id}
                className="bg-white border border-[#EDE8E0] rounded-[18px] overflow-hidden transition-all duration-200 shadow-[0_2px_8px_rgba(27,33,29,0.03)] hover:border-[#0F4C2E]/30"
              >
                {/* Header / Question Bar */}
                <button
                  type="button"
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full text-left p-5 md:p-6 flex justify-between items-center gap-4 cursor-pointer focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <div className="flex flex-col md:flex-row md:items-center gap-1.5 md:gap-3">
                    <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-[#0F4C2E] bg-[#0F4C2E]/10 px-2.5 py-0.5 rounded-full w-fit">
                      {faq.categoryGroup}
                    </span>
                    <h2 className="font-display text-[17px] md:text-[19px] font-bold text-[#1B211D] m-0">
                      {faq.question}
                    </h2>
                  </div>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-[#FAF8F5] border border-[#EDE8E0] text-[#0F4C2E] shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 bg-[#0F4C2E] text-white border-[#0F4C2E]' : ''}`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {/* Body / Answer */}
                {isOpen && (
                  <div className="px-5 md:px-6 pb-6 pt-0 border-t border-[#F3F0EA] text-[#4A544D]">
                    {/* Quick Summary Box */}
                    <div className="mt-4 bg-[#FAF8F5] border-l-4 border-[#0F4C2E] p-4 rounded-r-xl text-[15px] font-medium text-[#1B211D] leading-relaxed">
                      {faq.quickSummary}
                    </div>

                    {/* Detailed HTML Content */}
                    <div className="mt-4 text-[15px] leading-relaxed">
                      {faq.answerHtml}
                    </div>

                    {/* Category Cross-Links */}
                    {faq.relatedCategoryLinks && faq.relatedCategoryLinks.length > 0 && (
                      <div className="mt-5 pt-4 border-t border-[#F3F0EA]">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#5F6B63] block mb-2">
                          Passende Unternehmen & Angebote im Verzeichnis:
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {faq.relatedCategoryLinks.map((link, idx) => (
                            <a
                              key={idx}
                              href={`/${encodeURIComponent(link.category)}${link.subcategory ? `/${encodeURIComponent(link.subcategory)}` : ''}`}
                              onClick={(e) => {
                                e.preventDefault();
                                onSelectCategory(link.category, link.subcategory);
                              }}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FAF8F5] hover:bg-[#0F4C2E] hover:text-white border border-[#EDE8E0] text-[#0F4C2E] text-[13px] font-medium transition-all group"
                            >
                              <span>{link.label}</span>
                              <ChevronRight className="w-3.5 h-3.5 text-[#0F4C2E] group-hover:text-white transition-colors" />
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Footer Call to Action / Help Box */}
      <div className="mt-12 bg-gradient-to-br from-[#06301C] to-[#0F4C2E] text-white rounded-[24px] p-8 text-center md:text-left md:flex justify-between items-center gap-6 shadow-xl">
        <div>
          <h3 className="font-display text-2xl font-bold mb-2">Haben Sie ein Unternehmen in Winterberg?</h3>
          <p className="text-white/80 text-sm max-w-xl">
            Präsentieren Sie Ihr Geschäft, Restaurant oder Handwerksbetrieb im Winterberg Verzeichnis und werden Sie bei relevanten Google-Suchanfragen gefunden.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            onSelectCategory('Alle');
            window.history.pushState(null, '', '/');
            window.location.hash = 'eintragen';
          }}
          className="mt-4 md:mt-0 px-6 py-3 bg-[#F2761B] hover:bg-[#d96512] text-white font-bold text-sm rounded-full whitespace-nowrap transition-colors shadow-md cursor-pointer"
        >
          Unternehmen eintragen
        </button>
      </div>
    </main>
  );
}
