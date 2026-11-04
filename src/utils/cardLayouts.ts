import { CardLayoutId } from '../types';

export interface CardLayoutInfo {
  id: CardLayoutId;
  number: string;
  name: string;
  tagline: string;
  description: string;
  category: 'compact' | 'visual' | 'branding' | 'editorial';
  badge: string;
  badgeColor?: string;
  recommendedFor: string;
  features: string[];
}

export const CARD_LAYOUTS: CardLayoutInfo[] = [
  {
    id: 'default',
    number: '01',
    name: 'Der Klassiker',
    tagline: 'Aktuelles Standard-Layout mit 200px Header & Logo-Overlap',
    description: 'Das bewährte und aktuell aktive Verzeichnis-Design. Bietet ein großzügiges 200px Header-Banner, schwebendes Logo über der Bildkante, Sterne-Rating und eine saubere Text- und Tag-Aufteilung.',
    category: 'branding',
    badge: 'Aktueller Standard',
    badgeColor: 'bg-[#0F4C2E] text-white',
    recommendedFor: 'Universell für alle Branchen, bewährt & vertraut',
    features: ['200px Bannerbild', 'Floating-Logo links unten', 'USPs & Platz-1-Badges', 'Tags & Adresse']
  },
  {
    id: 'modern-compact',
    number: '02',
    name: 'Kompakt & Fokussiert',
    tagline: 'Schlankeres 140px-Bild & inline Logo für hohe Dichte',
    description: 'Reduziert die Bildhöhe zugunsten von mehr Übersicht. Das Logo sitzt aufgeräumt im Titelbereich und die Meta-Informationen sind kompakt angeordnet. Erlaubt mehr Einträge pro Bildschirmseite.',
    category: 'compact',
    badge: 'Kompakt',
    badgeColor: 'bg-blue-600 text-white',
    recommendedFor: 'Starke Verzeichnisse mit vielen Einträgen pro Seite',
    features: ['140px Schlankes Banner', 'Inline-Logo neben Titel', 'Sehr platzsparend', 'Schnelles Überfliegen']
  },
  {
    id: 'horizontal-card',
    number: '03',
    name: 'Querformat & Magazin',
    tagline: '2-spaltiges Magazin-Layout mit geteilter Bild-/Textfläche',
    description: 'Bild links (ca. 36%), ausführlicher Inhalt rechts. Verleiht dem Portal einen hochwertigen redaktionellen Guide-Charakter mit viel Platz für USPs, Öffnungszeiten und Leistungen nebeneinander.',
    category: 'editorial',
    badge: 'Magazin-Stil',
    badgeColor: 'bg-amber-600 text-white',
    recommendedFor: 'Gourmetführer, Erlebnisführer & detaillierte Profile',
    features: ['Horizontale 2-Spalten-Aufteilung', 'Editorial Guide Look', 'Viel Raum für Leistungen', 'Hervorragende Lesbarkeit']
  },
  {
    id: 'editorial-minimal',
    number: '04',
    name: 'Skandinavisch Minimal',
    tagline: 'Feine Linien, dezente Farben & ruhige Typografie',
    description: 'Verzichtet auf laute Overlays zugunsten von feiner Ästhetik. Das Bild ist dezent eingerahmt, die Typografie ist präzise gesetzt und das Logo fügt sich unaufdringlich als Siegel ein.',
    category: 'editorial',
    badge: 'Minimalistisch',
    badgeColor: 'bg-stone-700 text-white',
    recommendedFor: 'Architekten, Design, Boutiquen & Kanzleien',
    features: ['Feiner 1px Warmton-Rahmen', 'Dezent gefasstes Bild', 'Typografischer Weißraum', 'Zeitlos elegant']
  },
  {
    id: 'hero-overlay',
    number: '05',
    name: 'Cinematic Hero',
    tagline: 'Großes Bild mit sanftem Dark-Gradient & Titel-Overlay',
    description: 'Stellt das Foto maximal in den Vordergrund: Der Firmenname, Sterne und Kategorie liegen direkt auf einem weichen Dark-Gradient des 230px hohen Cover-Bildes. Der untere weiße Bereich bleibt aufgeräumt für Kontaktdaten.',
    category: 'visual',
    badge: 'Visuell stark',
    badgeColor: 'bg-emerald-700 text-white',
    recommendedFor: 'Gastronomie, Hotels, Ski- & Freizeitanbieter',
    features: ['230px Cover-Foto', 'Titel direkt im Bild-Overlay', 'Maximale Emotionalität', 'Kompakte Datenzeile unten']
  },
  {
    id: 'bold-brand',
    number: '06',
    name: 'Marken-Fokus',
    tagline: 'Großes Logo im Kopfbereich vor dem Bild platziert',
    description: 'Dreht die visuelle Hierarchie um: Das Logo und der Name stehen in einem eleganten Kopfbereich an erster Stelle, gefolgt von einem 170px Foto-Showcase. Hebt die Markenbekanntheit stark hervor.',
    category: 'branding',
    badge: 'Branding',
    badgeColor: 'bg-purple-700 text-white',
    recommendedFor: 'Bekannte Marken, Ketten, etablierte Handwerker',
    features: ['Prominenter Logo-Header', 'Eingebettetes Bild mittig', 'Starke Marken-Präsenz', 'Klarer Footer']
  },
  {
    id: 'floating-avatar',
    number: '07',
    name: 'Zentraler Avatar',
    tagline: 'Zentrierter runder Logo-Badge auf der Schnittkante',
    description: 'Ein runder, weiß umrandeter Logo-Badge schwebt genau in der Mitte zwischen Headerbild und Text. Titel und Badges sind harmonisch zentriert ausgerichtet. Wirkt sehr persönlich und sympathisch.',
    category: 'branding',
    badge: 'Persönlich',
    badgeColor: 'bg-indigo-600 text-white',
    recommendedFor: 'Inhabergeführte Geschäfte, Ärzte, Therapeuten, Berater',
    features: ['Runder Floating-Avatar zentriert', 'Harmonische Zentrierung', 'Persönliche Note', 'Edler Schatten-Effekt']
  },
  {
    id: 'accent-sidebar',
    number: '08',
    name: 'Sauerland Waldgrün',
    tagline: 'Kräftiger 6px Farbstreifen am linken Kachelrand',
    description: 'Unterstreicht die regionale Winterberg-Identität mit einem 6px dicken Smaragdgrün-Streifen (#0F4C2E) auf der linken Seite. Bei Premium-Einträgen schimmert der Streifen im edlen Sauerland-Orange.',
    category: 'branding',
    badge: 'Regionaler Akzent',
    badgeColor: 'bg-[#0F4C2E] text-white',
    recommendedFor: 'Heimat- und Naturverbundene Betriebe & Dienstleister',
    features: ['6px Smaragd-Seitenleiste', 'Klarer linker Anker', 'Strukturierter Aufbau', 'Hoher Wiedererkennungswert']
  },
  {
    id: 'badge-ribbon',
    number: '09',
    name: 'Auszeichnung & Siegel',
    tagline: 'Prominenter Fokus auf Sternebewertungen & Platzierungen',
    description: 'Rückt Trust-Faktoren an erste Stelle. Mit auffälliger Sterne-Box, verifizierten Siegeln und Platz-1-Bestenlisten-Badges. Schafft sofortiges Kundenvertrauen.',
    category: 'branding',
    badge: 'Trust & Bewertung',
    badgeColor: 'bg-orange-600 text-white',
    recommendedFor: 'Top-bewertete Betriebe & Bestenlisten-Gewinner',
    features: ['Große Sterne-Rating Box', 'Bestenlisten-Banner', 'Verifizierungs-Highlight', 'Starke Conversion-Rate']
  },
  {
    id: 'photo-mosaic',
    number: '10',
    name: 'Mini-Fotogalerie',
    tagline: 'Hauptbild mit seitlichem 2-Foto-Mosaikstreifen',
    description: 'Kombiniert ein Hauptbild mit einem seitlichen 2er-Vorschaustapel aus der Galerie. So bekommt der Besucher sofort mehrere Impressionen von Laden, Essen oder Arbeitsbeispielen.',
    category: 'visual',
    badge: 'Mehrere Bilder',
    badgeColor: 'bg-rose-600 text-white',
    recommendedFor: 'Restaurants, Boutiquen, Handwerker mit Galerie',
    features: ['Multi-Image Header', 'Vorschau auf Galerie', 'Lebendig & Abwechslungsreich', 'Ideal für Fotobetriebe']
  },
  {
    id: 'tag-cloud-services',
    number: '11',
    name: 'Leistungssuche & Tags',
    tagline: 'Fokus auf angebotene Dienstleistungen & Suchbegriffe',
    description: 'Stellt die Leistungen und Produkte der Betriebe als farbige Tag-Cloud direkt unter den Titel. Nutzer sehen auf einen Blick, welche konkreten Arbeiten und Services angeboten werden.',
    category: 'compact',
    badge: 'Leistungs-Fokus',
    badgeColor: 'bg-teal-700 text-white',
    recommendedFor: 'Handwerksbetriebe, Werkstätten, IT- & Fachdienste',
    features: ['Große Leistungs-Tag-Cloud', 'Kompakte Bildzeile', 'Schnelle Relevanz-Erkennung', 'Suchbegriff-Hervorhebung']
  },
  {
    id: 'flat-paper',
    number: '12',
    name: 'Warm Paper & Natur',
    tagline: 'Sanfter Naturton-Hintergrund (#F6F3EE) mit weichen Radien',
    description: 'Ersetzt das sterile Weiß durch einen warmen, beruhigenden Naturstein-Ton. Sehr weiche Radien (rounded-3xl) und softe Konturen erzeugen eine wohnliche, hochwertige Atmosphäre.',
    category: 'editorial',
    badge: 'Natur & Gemütlich',
    badgeColor: 'bg-yellow-800 text-white',
    recommendedFor: 'Hofläden, Cafés, Naturkosmetik, Ferienwohnungen',
    features: ['Warmer Sand-/Papierton', 'Extra softe Rundungen', 'Subtile organische Schatten', 'Entspannte Ästhetik']
  },
  {
    id: 'dark-emerald',
    number: '13',
    name: 'Premium Waldgrün',
    tagline: 'Dunkelgrüner Header-Block mit edlem Gold-/Orange-Kontrast',
    description: 'Das Markenzeichen Winterbergs als Designelement: Ein tiefer Waldgrün-Headerblock (#0F4C2E) rahmt die Kachel oben ein. Wirkt vornehm, traditionsreich und qualitativ erstklassig.',
    category: 'branding',
    badge: 'Exklusiv & Premium',
    badgeColor: 'bg-[#06301C] text-white',
    recommendedFor: 'Exklusive Hotels, Top-Restaurants, Premium-Partner',
    features: ['Smaragdgrüner Header-Block', 'Weißer Textkontrast', 'Gold/Orange Akzente', 'Sehr repräsentativ']
  },
  {
    id: 'interactive-flip',
    number: '14',
    name: 'Direkt-Aktion & Kontakt',
    tagline: 'Integrierte Buttonleiste am Kachelfuß für Schnellkontakt',
    description: 'Entwickelt für schnelle Kontaktaufnahme. Bietet am unteren Kachelrand direkte Schaltflächen für „Profil ansehen“, „Anrufen / E-Mail“ und „Route“. Maximiert Interaktionen.',
    category: 'compact',
    badge: 'Hohe Konversion',
    badgeColor: 'bg-cyan-700 text-white',
    recommendedFor: 'Notdienste, Lieferdienste, Buchungsanfragen, Taxi',
    features: ['Direkte Action-Buttons am Fuß', 'Sofort-Call-to-Action', 'Hover-Schwebung', 'Schnelle Kontaktaufnahme']
  },
  {
    id: 'bento-grid',
    number: '15',
    name: 'Modernes Bento',
    tagline: 'Modulare Apple-inspirierte Bento-Box mit Innenabstand',
    description: 'Die Kachel besteht aus harmonisch abgesetzten Innen-Modulen mit sanftem Padding. Bild, Tags, Auszeichnungen und Adressblock wirken wie perfekt gefügte Bausteine.',
    category: 'editorial',
    badge: 'Modern Bento',
    badgeColor: 'bg-zinc-800 text-white',
    recommendedFor: 'Start-ups, moderne Gastronomie, Lifestyle-Stores',
    features: ['Eingerahmtes Bild mit Padding', 'Modulare Bento-Zellen', 'Subtile Chip-Elemente', 'Sehr zeitgemäß']
  }
];

export const CARD_LAYOUT_CATEGORIES = [
  { id: 'all', label: 'Alle 15 Layouts' },
  { id: 'branding', label: 'Branding & Identität' },
  { id: 'visual', label: 'Bild- & Emotional-Fokus' },
  { id: 'editorial', label: 'Magazin & Minimal' },
  { id: 'compact', label: 'Kompakt & Konversion' }
];

export function getCardLayoutInfo(id?: CardLayoutId | string): CardLayoutInfo {
  const found = CARD_LAYOUTS.find(l => l.id === id);
  return found || CARD_LAYOUTS[0];
}
