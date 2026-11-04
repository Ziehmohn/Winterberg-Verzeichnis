import { HomeHeroConfig, HomeHeroStyle, DesignSettings } from '../types';

export interface HomeHeroStyleMeta {
  id: HomeHeroStyle;
  name: string;
  badge: string;
  badgeColor: string;
  tagline: string;
  description: string;
  highlights: string[];
}

export const DEFAULT_HOME_HERO_CONFIG: HomeHeroConfig = {
  style: 'split-gradient-badge',
  imageUrl: '/winterberg-hero-stefan-peters.jpg',
  imageAlt: 'Sommerlandschaft Winterberg Panoramablick',
  credit: 'Ferienwelt Winterberg / Stefan Peters',
  showCredit: true,
  objectPosition: 'center 40%',
  showStats: true,
  showPopularSearches: true,
  badgeText: 'Winterberg & Region • Das offizielle Branchenverzeichnis',
  badgeTextNl: 'Winterberg & Regio • De officiële bedrijvengids'
};

export const HOME_HERO_STYLES: HomeHeroStyleMeta[] = [
  {
    id: 'split-gradient-badge',
    name: '1. Neueröffnung-Stil (Rechtsfreigestellt mit weichem Verlauf)',
    badge: 'Favorit / Empfohlen',
    badgeColor: 'bg-emerald-600 text-white',
    tagline: 'Der beliebte Stil der Neueröffnungs-Seite: Bild rechts in voller Strahlkraft mit nahtlosem Ausfaden.',
    description: 'Basiert exakt auf dem Layout der Neueröffnungen: Links steht der Text und die Suche auf satter Waldgrün-Fläche, rechts ist das Stefan-Peters-Panorama prominent platziert und verläuft mit einer weichen horizontalen Maske fließend in den Hintergrund. Inklusive dezentem Foto-Credit-Badge oben rechts.',
    highlights: ['Keine verwaschene Transparenz', 'Weiche Maske (.hero-party-mask)', 'Fotourheber oben rechts', 'Optimale Lesbarkeit']
  },
  {
    id: 'split-card-glow',
    name: '2. Moderner Split mit schwebender Fotokarte & Glow',
    badge: 'Modern & Frisch',
    badgeColor: 'bg-amber-500 text-gray-950',
    tagline: 'Das Panoramafoto schwebt in einer abgerundeten Designer-Karte mit dezentem Leuchteffekt.',
    description: 'Das Foto wird als eigenständiges Schmuckstück in einem freistehenden Rahmen mit abgerundeten 24px-Ecken, feiner Glassmorphism-Kante und tiefem Schatten präsentiert. Links befinden sich Titel und Suche in voller Breite.',
    highlights: ['Schwebende Fotokarte', 'Edler Glass-Border', 'Hohe Bildschärfe', 'Urheber unten im Fotofeld']
  },
  {
    id: 'cinematic-overlay',
    name: '3. Cinematische Vollbild-Szenerie mit Dunkelverlauf',
    badge: 'Imposant & Großflächig',
    badgeColor: 'bg-blue-600 text-white',
    tagline: 'Vollflächiges Panorama von Rand zu Rand mit gezieltem Lese-Verlauf links.',
    description: 'Das Winterberg-Foto spannt sich über die gesamte Breite des Headers. Statt einer gleichmäßigen geringen Deckkraft sorgt ein intelligenter asymmetrischer Verlauf dafür, dass das Foto rechts in voller Brillanz erstrahlt, während links ein abdunkelnder Schatten die Suche und Typografie messerscharf lesbar hält.',
    highlights: ['Vollbild-Erlebnis', 'Asymmetrischer Text-Gradient', 'Maximale Weite', 'Fotografen-Wasserzeichen']
  },
  {
    id: 'split-diagonal-cut',
    name: '4. Dynamischer Diagonalschnitt (Angled Split)',
    badge: 'Dynamisch & Aktiv',
    badgeColor: 'bg-orange-600 text-white',
    tagline: 'Moderne diagonale Schnittkante für einen sportlich-frischen Winterberg-Auftritt.',
    description: 'Eine kraftvolle diagonale Schräge trennt den waldgrünen Text- und Suchbereich vom rechten Fotobereich ab. Verleiht dem Portal Dynamik und Schwung – ideal für eine moderne Tourismus- und Wirtschaftsregion.',
    highlights: ['Diagonaler Schnittwinkel', 'Klares 55/45-Verhältnis', 'Sportlicher Touch', 'Fotourheber am unteren Rand']
  },
  {
    id: 'magazine-editorial',
    name: '5. Magazin & Editorial (Gerahmtes Passepartout)',
    badge: 'High-End & Hochglanz',
    badgeColor: 'bg-purple-600 text-white',
    tagline: 'Wie ein edles Magazincover: Bild im eleganten weißen Passepartout-Rahmen.',
    description: 'Kombiniert traditionelle Eleganz mit redaktionellem Charme. Das Foto von Stefan Peters wird rechts wie in einer Kunstgalerie mit feiner weißer Kontur, Schlagschatten und dezenter Bildunterschrift inszeniert.',
    highlights: ['Galerie-Passepartout', 'Redaktioneller Look', 'Elegante Bildunterschrift', 'Hochwertige Haptik']
  },
  {
    id: 'panoramic-compact',
    name: '6. Kompakter Panoramabalken (Fokus auf Suche)',
    badge: 'Effizient & Kompakt',
    badgeColor: 'bg-teal-600 text-white',
    tagline: 'Schlankes Breitband-Panorama mit schwebender Suchleiste.',
    description: 'Ein flacher, eleganter Header, der weniger vertikalen Raum beansprucht. Das Panoramafoto liegt als breiter Streifen im oberen Bereich, während die Suchleiste mittig über die Schnittkante ragt und die Kategorien schnell erreichbar macht.',
    highlights: ['Platzsparend', 'Direkter Fokus auf Suche', 'Breitband-Panorama', 'Schneller Einstieg']
  },
  {
    id: 'split-curved-arch',
    name: '7. Organischer Rundbogen (Boutique Portal Arch)',
    badge: 'Architektur & Stil',
    badgeColor: 'bg-rose-600 text-white',
    tagline: 'Sanfter, architektonischer Bogen-Ausschnitt inspiriert von Natur und Bergen.',
    description: 'Rechts wird das Winterberg-Motiv durch einen geschwungenen Portal-Rundbogen gerahmt. Ein sehr trendiger, organischer Look, der sich von gewöhnlichen Webseiten abhebt und Winterberg als naturverbundene Wohlfühlregion präsentiert.',
    highlights: ['Trendiger Rundbogen-Ausschnitt', 'Warme organische Silhouette', 'Sanfter Schattenfall', 'Fotourheber im Bogen']
  },
  {
    id: 'glassmorphism-card',
    name: '8. Milchglas-Dock & Deep Forest (Frosted Glass)',
    badge: 'Glassmorphism',
    badgeColor: 'bg-cyan-600 text-white',
    tagline: 'Kristallklares Hintergrundfoto mit schwebendem Milchglas-Cockpit für Suche & Text.',
    description: 'Das Foto füllt den gesamten Header in 100% Schärfe aus. Suche, Titel und Statistiken ruhen in einer transluzenten Frosted-Glass-Box mit Weichzeichner und feiner Lichtkante. Extrem edel und modern.',
    highlights: ['Vollbild im Hintergrund', 'Frosted-Glass-Panel', 'Edler Weichzeichner', 'Transparenter Urheber-Badge']
  },
  {
    id: 'minimal-side-by-side',
    name: '9. Klares 50/50 Side-by-Side (Moderne Galerie)',
    badge: 'Klar & Strukturiert',
    badgeColor: 'bg-slate-700 text-white',
    tagline: 'Reines 50/50 Split-Layout: Symmetrisch, aufgeräumt und schnörkellos.',
    description: 'Klassische moderne Zweiteilung: Exakt 50% für Text, Suche und Kennzahlen auf tiefem Waldgrün, 50% für das hochaufgelöste Winterberg-Motiv mit sauberer senkrechter Trennlinie. Absolut klar und barrierefrei.',
    highlights: ['Symmetrische 50/50-Teilung', 'Maximale Klarheit', 'Strukturierte Übersicht', 'Urheber unten im Fotoblock']
  },
  {
    id: 'immersive-gradient-fade',
    name: '10. Atmosphärischer Horizont-Verlauf (Warm Sunlight Fade)',
    badge: 'Atmosphärisch & Warm',
    badgeColor: 'bg-lime-700 text-white',
    tagline: 'Reicher Farbübergang: Sonnige Berggipfel oben, sanft übergehend in waldgrüne Basis.',
    description: 'Das Foto erstrahlt oben und rechts in warmem Sonnenlicht und tiefblauem Himmel. Nach unten und links hin gleitet es in einen samtigen, dunkelgrünen Farbton über, auf dem die Suchleiste und Statistiken perfekt zur Geltung kommen.',
    highlights: ['Warmes Sonnenlicht oben', 'Samtiger Farbverlauf', 'Lebendige Bergfarben', 'Foto-Credit oben im Himmel']
  }
];

export function getEffectiveHomeHeroConfig(settings?: DesignSettings): HomeHeroConfig {
  if (!settings?.homeHero) {
    return DEFAULT_HOME_HERO_CONFIG;
  }
  return {
    ...DEFAULT_HOME_HERO_CONFIG,
    ...settings.homeHero,
    // Ensure critical defaults if empty
    imageUrl: settings.homeHero.imageUrl || DEFAULT_HOME_HERO_CONFIG.imageUrl,
    credit: settings.homeHero.credit !== undefined ? settings.homeHero.credit : DEFAULT_HOME_HERO_CONFIG.credit,
    style: settings.homeHero.style || DEFAULT_HOME_HERO_CONFIG.style
  };
}
