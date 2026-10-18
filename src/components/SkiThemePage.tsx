import React, { useState, useMemo, useEffect } from 'react';
import { useTranslation } from '../i18n';
import { 
  Snowflake, 
  Mountain, 
  Moon, 
  Clock, 
  ExternalLink, 
  CheckCircle2, 
  Sparkles, 
  ChevronRight,
  Sun,
  Coffee,
  Ticket,
  Users,
  Calendar,
  Vote,
  Camera,
  MessageSquare,
  Star,
  ThumbsUp,
  MapPin,
  Flame,
  ChevronDown,
  Upload,
  Info,
  Check,
  Award,
  Video,
  ArrowRight
} from 'lucide-react';
import { Business, ThemeConfig } from '../types';
import { getBusinessPath } from '../utils/routes';
import { SKI_RESORTS_DATA } from '../utils/skiData';
import { initialNews } from '../dataNews';

interface SkiThemePageProps {
  businesses: Business[];
  theme?: ThemeConfig;
  onSelectBusiness?: (bus: Business) => void;
  onSelectNewsArticle?: (slug: string) => void;
  onBack?: () => void;
  onNavigateCategory?: (category: string, subcategory?: string) => void;
  onNavigateSkiReport?: () => void;
}

// Official Ticket Prices Season 2026/27 (from skiliftkarussell.de)
export interface TicketPriceCategory {
  category: string;
  category_nl: string;
  items: {
    title: string;
    title_nl: string;
    adult: string;
    child: string;
    note?: string;
    note_nl?: string;
  }[];
}

const TICKET_PRICES_2026_27: TicketPriceCategory[] = [
  {
    category: 'Tages- & Stundentickets',
    category_nl: 'Dag- & Uurtickets',
    items: [
      { title: 'Vormittags (bis 13:00 Uhr)', title_nl: 'Ochtend (tot 13:00 uur)', adult: '32,- €', child: '20,- €' },
      { title: 'Nachmittags (ab 13:00 Uhr)', title_nl: 'Middag (vanaf 13:00 uur)', adult: '32,- €', child: '20,- €' },
      { title: '1 Tag (ab 09:00 Uhr)', title_nl: '1 Dag (vanaf 09:00 uur)', adult: '53,- €', child: '30,- €', note: 'Gültig in allen Skigebieten der Skiwelt Winterberg', note_nl: 'Geldig in alle skigebieden van de Skiwelt Winterberg' },
      { title: '1 Tag (ab 11:00 Uhr)', title_nl: '1 Dag (vanaf 11:00 uur)', adult: '48,- €', child: '27,- €', note: 'Ausschließlich an Kassen & sKiosk vor Ort (nicht online)', note_nl: 'Uitsluitend aan de kassa & automaten ter plaatse (niet online)' },
    ]
  },
  {
    category: 'Mehrtageskarten',
    category_nl: 'Meerdagkaarten',
    items: [
      { title: '2 Tage', title_nl: '2 Dagen', adult: '98,- €', child: '55,- €', note: 'Skiwelt Winterberg', note_nl: 'Skiwelt Winterberg' },
      { title: '3 Tage', title_nl: '3 Dagen', adult: '136,- €', child: '77,- €', note: 'Zusätzlich gültig in Willingen & Hunau Bödefeld!', note_nl: 'Tevens geldig in Willingen & Hunau Bödefeld!' },
      { title: '4 Tage', title_nl: '4 Dagen', adult: '169,- €', child: '96,- €', note: 'Inkl. Willingen & Hunau Bödefeld', note_nl: 'Incl. Willingen & Hunau Bödefeld' },
      { title: '5 Tage', title_nl: '5 Dagen', adult: '198,- €', child: '113,- €', note: 'Inkl. Willingen & Hunau Bödefeld', note_nl: 'Incl. Willingen & Hunau Bödefeld' },
      { title: '6 Tage', title_nl: '6 Dagen', adult: '224,- €', child: '128,- €', note: 'Inkl. Willingen & Hunau Bödefeld', note_nl: 'Incl. Willingen & Hunau Bödefeld' },
      { title: '7 Tage', title_nl: '7 Dagen', adult: '247,- €', child: '141,- €', note: 'Inkl. Willingen & Hunau Bödefeld', note_nl: 'Incl. Willingen & Hunau Bödefeld' },
    ]
  },
  {
    category: 'Flutlicht & Abendkarten',
    category_nl: 'Avondskiën & Verlichting',
    items: [
      { title: 'Abendkarte (ab 18:30 Uhr)', title_nl: 'Avondkaart (vanaf 18:30 uur)', adult: '32,- €', child: '20,- €', note: 'Gültig 18:30 bis 22:00 Uhr (Mi, Fr, Sa)', note_nl: 'Geldig van 18:30 tot 22:00 uur (wo, vr, za)' },
      { title: 'Abendkarte (ab 20:00 Uhr)', title_nl: 'Avondkaart (vanaf 20:00 uur)', adult: '23,- €', child: '15,- €', note: 'Late-Night-Tarif bis 22:00 Uhr', note_nl: 'Late-night tarief tot 22:00 uur' },
    ]
  },
  {
    category: 'Saisonkarten (Wintersport-Arena)',
    category_nl: 'Seizoenskaarten (Wintersport-Arena)',
    items: [
      { title: 'Tagskifahren Saisonkarte', title_nl: 'Dagskiën Seizoenskaart', adult: '430,- €', child: '255,- €', note: 'Ganze Saison in allen Gebieten der Wintersport-Arena', note_nl: 'Het hele seizoen geldig in de gehele Wintersport-Arena' },
      { title: 'Abendskifahren Saisonkarte', title_nl: 'Avondskiën Seizoenskaart', adult: '280,- €', child: '150,- €', note: 'Alle Flutlichtabende der gesamten Wintersaison', note_nl: 'Alle avondskisessies van het hele winterseizoen' },
      { title: 'Kombikarte (Tag & Abendski)', title_nl: 'Combi-seizoenskaart (Dag & Avond)', adult: '565,- €', child: '330,- €', note: 'Maximale Freiheit: Tag & Flutlicht uneingeschränkt', note_nl: 'Onbeperkt dag- en avondskiën' },
    ]
  },
  {
    category: 'Gruppentarife (Mo-Fr, ab 20 Pers.)',
    category_nl: 'Groepstarieven (Ma-Vr, vanaf 20 pers.)',
    items: [
      { title: '1 Tag (ab 09:00 Uhr)', title_nl: '1 Dag (vanaf 09:00 uur)', adult: '42,- €', child: '24,- €', note: 'Verkauf ausschließlich an den Kassen vor Ort', note_nl: 'Uitsluitend te koop aan de kassa ter plaatse' },
      { title: '1 Tag (ab 11:00 Uhr)', title_nl: '1 Dag (vanaf 11:00 uur)', adult: '38,- €', child: '22,- €' },
      { title: 'Abendkarte (ab 18:30 Uhr)', title_nl: 'Avondkaart (vanaf 18:30 uur)', adult: '24,- €', child: '15,- €' },
      { title: 'Abendkarte (ab 20:00 Uhr)', title_nl: 'Avondkaart (vanaf 20:00 uur)', adult: '18,- €', child: '12,- €' },
    ]
  }
];

// Rich Curated Ski Huts Data (with directory links)
interface SkiHutInfo {
  id: string;
  name: string;
  location: string;
  location_nl: string;
  piste: string;
  highlight: string;
  highlight_nl: string;
  description: string;
  description_nl: string;
  tags: string[];
  businessNameMatch?: string;
  hasFloodlightOpen?: boolean;
}

const SKI_HUTS_DATA: SkiHutInfo[] = [
  {
    id: 'moeppis-huette',
    name: 'Bei Möppi (Möppis Hütte)',
    location: 'Am Poppenberg / Parkplatz P5',
    location_nl: 'Aan de Poppenberg / Parkeerplaats P5',
    piste: 'Piste 5 (Poppenberg) & Sessellifte',
    highlight: 'Kult-Skihütte Nr. 1 in Winterberg – beste Stimmung & legendärer Einkehrschwung',
    highlight_nl: 'Dé nummer 1 cult-skihut in Winterberg – sfeer en legendarische après-ski',
    description: 'Direkt an der beliebten Abfahrt am Poppenberg. Großzügige Sonnenterrasse, urgemütliche Stube und bei Flutlicht bis spät in den Abend der Treffpunkt für Wintersportler.',
    description_nl: 'Direct aan de populaire afdaling van de Poppenberg. Groot zonneterras, knusse houten stube en tijdens avondskiën dé hotspot voor wintersporters.',
    tags: ['Après-Ski', 'Sonnenterrasse', 'Flutlicht-Abend', 'Kult'],
    businessNameMatch: 'Bei Möppi',
    hasFloodlightOpen: true,
  },
  {
    id: 'rauher-busch',
    name: 'Skihütte Rauher Busch',
    location: 'Rauher Busch / Piste 12',
    location_nl: 'Rauher Busch / Piste 12',
    piste: 'Piste 12 & 4er-Sesselbahn',
    highlight: 'Uriges Kaminfeuer, Sauerländer Küche & beliebter Familientreffpunkt',
    highlight_nl: 'Knapperend haardvuur, lokale gerechten en geliefd bij gezinnen',
    description: 'Direkt am Einstieg zum Rauhen Busch. Bekannt für herzhafte Eintöpfe, frische Waffeln und eine warme Kaminatmosphäre. Auch an Flutlichtabenden geöffnet.',
    description_nl: 'Direct aan het dalstation Rauher Busch. Bekend om stevige soepen, warme wafels en knusse open haard. Ook geopend tijdens avondskiën.',
    tags: ['Kaminfeuer', 'Familienfreundlich', 'Flutlicht-Abend', 'Sauerland-Küche'],
    businessNameMatch: 'Skihütte Rauher Busch',
    hasFloodlightOpen: true,
  },
  {
    id: 'schneewittchenhaus',
    name: 'Schneewittchenhaus',
    location: 'Schneewittchenhang / Piste 25',
    location_nl: 'Schneewittchenhang / Piste 25',
    piste: 'Piste 25 & 6er-Sesselbahn Schneewittchen',
    highlight: 'Moderne Alpen-Architektur, Panorama-Terrasse & hochwertige Gastronomie',
    highlight_nl: 'Moderne alpiene architectuur, panoramaterras & heerlijke keuken',
    description: 'Eines der modernsten Bergrestaurants im Sauerland: Beeindruckende Glasfronten mit Ausblick über das Schneewittchental, Lounge-Bereich und frische Spezialitäten.',
    description_nl: 'Een van de modernste bergrestaurants in het Sauerland: indrukwekkende glazen puien, uitzicht over het dal, lounge en verse streekgerechten.',
    tags: ['Panoramablick', 'Moderne Küche', 'Große Terrasse', 'Lounge'],
    businessNameMatch: 'Schneewittchenhaus',
  },
  {
    id: 'skihuette-der-brabander',
    name: 'Skihütte Der Brabander',
    location: 'Am Herrloh / Piste 1',
    location_nl: 'Bij de Herrloh / Piste 1',
    piste: 'Piste 1 & St. Georg Schanze',
    highlight: 'Herzliche niederländische & sauerländische Gastfreundschaft direkt an der Schanze',
    highlight_nl: 'Gezellige Nederlands-Duitse gastvrijheid direct aan de oefenpistes',
    description: 'Liebevoll geführte Skihütte mit großer Außenterrasse direkt neben dem Hotel Der Brabander. Perfekt für Einsteiger, Familien und Aprés-Ski-Genießer.',
    description_nl: 'Sfeervolle skihut met ruim terras naast hotel Der Brabander. Ideaal voor gezinnen, beginners en gezellige après-ski.',
    tags: ['Après-Ski', 'Zentral', 'Flutlicht', 'Familienfreundlich'],
    businessNameMatch: 'Skihütte Der Brabander',
    hasFloodlightOpen: true,
  },
  {
    id: 'alm-salettl',
    name: 'Skihütte und Schirmbar Alm Salettl',
    location: 'Herrloh / Piste 2 & Schanze',
    location_nl: 'Herrloh / Piste 2 & Schans',
    piste: 'Piste 2 & Herrloh-Lifte',
    highlight: 'Echte Schirmbar-Stimmung mit Musik, Heißgetränken und Panoramablick',
    highlight_nl: 'Echte schirmbar-sfeer met muziek, warme drankjes en uitzicht',
    description: 'Die Schirmbar Alm Salettl bringt echtes Alpenflair mitten ins Sauerland. Ob Glühwein nach dem Einkehrschwung oder ein schneller Snack zwischen zwei Abfahrten.',
    description_nl: 'Alm Salettl brengt de echte wintersportsfeer naar Winterberg met muziek, warme glühwein en snelle snacks aan de piste.',
    tags: ['Schirmbar', 'Après-Ski', 'Musik', 'Stimmung'],
    businessNameMatch: 'Skihütte und Schirmbar Alm Salettl',
    hasFloodlightOpen: true,
  },
  {
    id: 'quicks-skihuette',
    name: 'Quick\'s Skihütte',
    location: 'Quick Jet / Piste 5b',
    location_nl: 'Quick Jet / Piste 5b',
    piste: 'Quick Jet Sesselbahn',
    highlight: 'Gemütliche Holzstube direkt am Quick Jet mit schneller Einkehr',
    highlight_nl: 'Gezellige houten stube direct aan de Quick Jet stoeltjeslift',
    description: 'Ideal gelegen am Quick Jet Sesselbahn. Schneller Service, warme Suppen, Burger und Heißgetränke für Skifahrer, die schnell wieder auf die Piste möchten.',
    description_nl: 'Gunstig gelegen aan de Quick Jet. Snelle bediening, warme soepen, burgers en drankjes voor een efficiënte pauze.',
    tags: ['Schnell & Gut', 'Direkt am Lift', 'Sonnenterrasse'],
    businessNameMatch: 'Quick\'s Skihütte',
  },
  {
    id: 'nordhang-jause',
    name: 'Nordhang Jause Winterberg',
    location: 'Kahler Asten / Nordhang',
    location_nl: 'Kahler Asten / Nordhang',
    piste: 'Nordhang / Astenberg-Loipe',
    highlight: 'Traditionelle Sauerländer Jause auf 800 m Höhe mit herrlicher Aussicht',
    highlight_nl: 'Traditionele berghut op 800 m hoogte met prachtig uitzicht',
    description: 'Urige Bergjause auf dem Kahlen Asten. Bekannt für hausgemachte Kuchen, deftige Schinkenplatten, Erbsensuppe und ein unverfälschtes Naturerlebnis abseits des großen Trubels.',
    description_nl: 'Knusse hut op de flanken van de Kahler Asten. Bekend om huisgemaakte taarten, erwtensoep en authentieke rust.',
    tags: ['Traditionell', 'Kahler Asten', 'Hausgemachter Kuchen', 'Natur pur'],
    businessNameMatch: 'Nordhang Jause Winterberg',
  },
  {
    id: 'bobhaus-winterberg',
    name: 'Bobhaus Winterberg',
    location: 'Kappe Gipfel (776 m)',
    location_nl: 'Kappe bergtop (776 m)',
    piste: 'Kappe Steilhang / Piste 14',
    highlight: 'Panoramarestaurant auf dem Gipfel der Kappe – atemberaubender Fernblick',
    highlight_nl: 'Panoramarestaurant op de top van de Kappe – fantastisch uitzicht',
    description: 'Geschichtsträchtiges Berggasthaus oberhalb des Kappe-Steilhangs und der Bobbahn. Erstklassige Aussicht von der Terrasse über die Sauerländer Bergwelt.',
    description_nl: 'Historisch bergrestaurant boven de steile Kappe-piste en de bobsleebaan. Schitterend uitzicht vanaf het panoramaterras.',
    tags: ['Gipfelblick', 'Kappe', 'Gehobene Küche', 'Aussicht'],
    businessNameMatch: 'Bobhaus',
  },
  {
    id: 'koehlerhuette-sahnehang',
    name: 'Köhlerhütte am Sahnehang',
    location: 'Sahnehang / Kahler Asten (836 m)',
    location_nl: 'Sahnehang / Kahler Asten (836 m)',
    piste: 'Skigebiet Sahnehang Piste 1 & Rodelhang',
    highlight: 'Urigste Hütte am schneesichersten Hang im Sauerland',
    highlight_nl: 'Meest authentieke hut op de meest sneeuwzekere helling',
    description: 'Die historische Köhlerhütte empfängt Wintersportler direkt am Hang des Sahnehangs. Ein heißer Kakao oder deftiger Gulasch schmecken hier im Schnee doppelt so gut.',
    description_nl: 'De historische Köhlerhütte verwelkomt skiërs en rodelaars direct aan de Sahnehang. Huiselijke sfeer met warme chocolademelk en soepen.',
    tags: ['Schneesicher', 'Historisch', 'Rodeln & Ski', 'Gemütlich'],
  },
  {
    id: 'schirmbar-postwiese',
    name: 'Schirmbar Skidorf Postwiese',
    location: 'Neuastenberg Postwiese',
    location_nl: 'Neuastenberg Postwiese',
    piste: 'Postwiese Talstation & Naturrodelbahn',
    highlight: 'Zentraler Treffpunkt im Skidorf Neuastenberg bei Tag & Flutlicht',
    highlight_nl: 'Centrale ontmoetingsplek in skidorp Neuastenberg',
    description: 'Inmitten des traditionsreichen Skidorfes Neuastenberg gelegen. Treffpunkt für Skifahrer, Rodler und Boarder aus dem Funpark.',
    description_nl: 'Gelegen in het hart van het skidorp Neuastenberg. Gezellige borrels na een dag skiën of rodelen op de natuurrodelbaan.',
    tags: ['Neuastenberg', 'Postwiese', 'Funpark-Treff', 'Flutlicht'],
    businessNameMatch: 'Schirmbar Postwiese',
    hasFloodlightOpen: true,
  }
];

// UGC Poll 1: Favorite slope
interface PollOption {
  id: string;
  name: string;
  name_nl: string;
  description: string;
  description_nl: string;
  votes: number;
}

const INITIAL_PISTE_POLL: PollOption[] = [
  { id: 'quickjet', name: 'Quick Jet / Poppenberg (Piste 5)', name_nl: 'Quick Jet / Poppenberg (Piste 5)', description: 'Breiter Carving-Hang & legendäre Flutlichtpiste', description_nl: 'Brede carvinghelling en legendarische avondpiste', votes: 142 },
  { id: 'kappe', name: 'Kappe Steilhang (Piste 14)', name_nl: 'Kappe Steilhang (Piste 14)', description: 'Die steilste Herausforderung nördlich der Alpen (bis 50% Gefälle)', description_nl: 'De steilste afdaling ten noorden van de Alpen (tot 50%)', votes: 118 },
  { id: 'herrloh', name: 'Slalomhang Herrloh & St. Georg Schanze', name_nl: 'Slalomhang Herrloh & St. Georg Schans', description: 'Der beliebte Traditions-Klassiker mitten im Karussell', description_nl: 'De populaire klassieker in het hart van het skigebied', votes: 89 },
  { id: 'schneewittchen', name: 'Schneewittchenhang (Piste 25)', name_nl: 'Schneewittchenhang (Piste 25)', description: 'Herrlich weitläufig, modern erschlossen & familienfreundlich', description_nl: 'Heerlijk breed, modern en ideaal voor gezinnen', votes: 104 },
  { id: 'bremberg', name: 'Bremberg Waldabfahrt (Piste 10 & 11)', name_nl: 'Bremberg Bosafdaling (Piste 10 & 11)', description: 'Entspanntes Gleiten durch verschneite Fichtenwälder', description_nl: 'Ontspannen afdalen tussen de besneeuwde dennenbomen', votes: 76 },
  { id: 'altastenberg', name: 'Westfalenhang I (Skikarussell Altastenberg)', name_nl: 'Westfalenhang I (Altastenberg)', description: 'Einzige offizielle FIS-Weltcup-Slalomstrecke im Sauerland', description_nl: 'Enige officiële FIS-wereldbeker slalompiste in de regio', votes: 63 },
];

// UGC Poll 2: Favorite Hut
const INITIAL_HUT_POLL: PollOption[] = [
  { id: 'moeppis', name: 'Bei Möppi (Poppenberg)', name_nl: 'Bij Möppi (Poppenberg)', description: 'Kultige Stimmung & Après-Ski Highlight', description_nl: 'Iconische sfeer en après-ski hotspot', votes: 184 },
  { id: 'rauher-busch', name: 'Skihütte Rauher Busch', name_nl: 'Skihütte Rauher Busch', description: 'Kaminfeuer, Gemütlichkeit & hausgemachte Suppen', description_nl: 'Haardvuur, gezelligheid en verse soepen', votes: 129 },
  { id: 'schneewittchenhaus', name: 'Schneewittchenhaus', name_nl: 'Schneewittchenhaus', description: 'Panoramablick, Alpen-Chic & Sonnenbalkon', description_nl: 'Panoramisch uitzicht, alpen-chic en zonneterras', votes: 112 },
  { id: 'brabander', name: 'Skihütte Der Brabander', name_nl: 'Skihütte Der Brabander', description: 'Gute Laune, zentrale Lage & Sonnenterrasse', description_nl: 'Gezelligheid, centrale ligging en groot terras', votes: 95 },
  { id: 'nordhang', name: 'Nordhang Jause (Kahler Asten)', name_nl: 'Nordhang Jause (Kahler Asten)', description: 'Urige Bergruhe & beste Jausenplatten', description_nl: 'Rustige sfeer en heerlijke streekgerechten', votes: 82 },
];

// UGC Community Reviews Interface & Initial Data
export interface SkiUserReview {
  id: string;
  name: string;
  locationOrPiste: string;
  rating: number; // 1-5
  tag: string;
  text: string;
  date: string;
  helpfulCount: number;
  userVotedHelpful?: boolean;
}

const INITIAL_COMMUNITY_REVIEWS: SkiUserReview[] = [
  {
    id: 'rev-1',
    name: 'Markus T. aus Dortmund',
    locationOrPiste: 'Kappe Steilhang & Poppenberg',
    rating: 5,
    tag: 'Flutlicht-Fan',
    text: 'Wer mittwochs oder freitags Zeit hat: Unbedingt zum Flutlicht! Um 18:30 Uhr sind die Pisten frisch gewalzt, das Flutlicht gibt ein ganz besonderes Feeling und am Poppenberg ist der Übergang zu Möppis Heißgetränken der perfekte Winterabend.',
    date: 'Vor 2 Tagen',
    helpfulCount: 28,
  },
  {
    id: 'rev-2',
    name: 'Sandra & Familie aus Utrecht',
    locationOrPiste: 'Schneewittchenhang & Bremberg',
    rating: 5,
    tag: 'Familientipp',
    text: 'Für Kinder und Anfänger ist der Schneewittchenhang absolut genial. Sehr breite Piste, moderner 6er-Sessellift ohne Stress beim Einsteigen und das Schneewittchenhaus bietet genügend Platz zum Aufwärmen.',
    date: 'Vor 4 Tagen',
    helpfulCount: 19,
  },
  {
    id: 'rev-3',
    name: 'Julian B. aus Köln',
    locationOrPiste: 'Skikarussell Altastenberg (Westfalenhang)',
    rating: 5,
    tag: 'Sportlich / Geheimtipp',
    text: 'Wenn das Karussell am Wochenende voll wird, fahre ich rüber nach Altastenberg. Der Westfalenhang I ist eine echte FIS-Weltcuppiste mit ordentlich Zug. Keine Wartezeiten an den Liften und herrlich freie Pisten!',
    date: 'Vor einer Woche',
    helpfulCount: 34,
  },
  {
    id: 'rev-4',
    name: 'Elena K. aus Münster',
    locationOrPiste: 'Rauher Busch & Herrloh',
    rating: 5,
    tag: 'Genießer & Einkehr',
    text: 'Die Skihütte Rauher Busch hat den besten Kaminofen im ganzen Skigebiet. Nach 3 Stunden auf den Brettern dort eine heiße Waffel mit Kirschen und Sahne essen – purer Winterurlaub nur 1,5 Stunden von NRW entfernt.',
    date: 'Vor 2 Wochen',
    helpfulCount: 22,
  }
];

// UGC Community Photos
export interface SkiUserPhoto {
  id: string;
  imageUrl: string;
  title: string;
  userName: string;
  spot: string;
  likes: number;
  date: string;
  isUserUploaded?: boolean;
}

const INITIAL_COMMUNITY_PHOTOS: SkiUserPhoto[] = [
  {
    id: 'photo-1',
    imageUrl: '/news-skisaison-winterberg-eroeffnung-2026.jpg',
    title: 'Saisonstart im Skiliftkarussell Winterberg',
    userName: 'Simon K. (Winterberg Guide)',
    spot: 'Poppenberg & Herrloh',
    likes: 84,
    date: 'Winter-Highlight'
  },
  {
    id: 'photo-2',
    imageUrl: '/webcams/skiliftkarussell-bremberg.jpg',
    title: 'Traumtag am Brembergkopf mit Neuschnee',
    userName: 'Lukas M.',
    spot: 'Bremberg Sesselbahn',
    likes: 67,
    date: 'Frisch verschneit'
  },
  {
    id: 'photo-3',
    imageUrl: '/webcams/skiliftkarussell-rauher-busch.jpg',
    title: 'Rauher Busch im strahlenden Sonnenschein',
    userName: 'Hannah S.',
    spot: 'Piste 12 Rauher Busch',
    likes: 52,
    date: 'Sonnenskilauf'
  },
  {
    id: 'photo-4',
    imageUrl: '/webcams/erlebnisberg-kappe.jpg',
    title: 'Panoramablick von der Kappe ins Tal',
    userName: 'Dennis W.',
    spot: 'Erlebnisberg Kappe / Bobhaus',
    likes: 41,
    date: 'Aussicht 776 m'
  }
];

export const SkiThemePage: React.FC<SkiThemePageProps> = ({
  businesses,
  theme,
  onSelectBusiness,
  onSelectNewsArticle,
  onBack,
  onNavigateCategory,
  onNavigateSkiReport
}) => {
  const { t, lang } = useTranslation();
  const isNl = lang === 'nl';

  // Ticket Pricing Tab State
  const [activePriceTab, setActivePriceTab] = useState<number>(0);

  // Poll 1 State
  const [pistePoll, setPistePoll] = useState<PollOption[]>(() => {
    try {
      const saved = localStorage.getItem('wv_ski_piste_poll_data');
      return saved ? JSON.parse(saved) : INITIAL_PISTE_POLL;
    } catch {
      return INITIAL_PISTE_POLL;
    }
  });
  const [userVotedPiste, setUserVotedPiste] = useState<string | null>(() => {
    try {
      return localStorage.getItem('wv_ski_user_voted_piste');
    } catch {
      return null;
    }
  });

  // Poll 2 State
  const [hutPoll, setHutPoll] = useState<PollOption[]>(() => {
    try {
      const saved = localStorage.getItem('wv_ski_hut_poll_data');
      return saved ? JSON.parse(saved) : INITIAL_HUT_POLL;
    } catch {
      return INITIAL_HUT_POLL;
    }
  });
  const [userVotedHut, setUserVotedHut] = useState<string | null>(() => {
    try {
      return localStorage.getItem('wv_ski_user_voted_hut');
    } catch {
      return null;
    }
  });

  // Reviews State
  const [reviews, setReviews] = useState<SkiUserReview[]>(() => {
    try {
      const saved = localStorage.getItem('wv_ski_user_reviews');
      return saved ? JSON.parse(saved) : INITIAL_COMMUNITY_REVIEWS;
    } catch {
      return INITIAL_COMMUNITY_REVIEWS;
    }
  });

  // Review Form Modal
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewName, setReviewName] = useState('');
  const [reviewSpot, setReviewSpot] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTag, setReviewTag] = useState('Flutlicht-Fan');
  const [reviewText, setReviewText] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);

  // Photos State
  const [photos, setPhotos] = useState<SkiUserPhoto[]>(() => {
    try {
      const saved = localStorage.getItem('wv_ski_user_photos');
      return saved ? JSON.parse(saved) : INITIAL_COMMUNITY_PHOTOS;
    } catch {
      return INITIAL_COMMUNITY_PHOTOS;
    }
  });

  // Photo Upload Modal
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [photoTitle, setPhotoTitle] = useState('');
  const [photoUserName, setPhotoUserName] = useState('');
  const [photoSpot, setPhotoSpot] = useState('');
  const [photoDataUrl, setPhotoDataUrl] = useState<string | null>(null);
  const [photoSuccess, setPhotoSuccess] = useState(false);

  // FAQ Accordion
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // SEO Page Title & Meta Description
  useEffect(() => {
    const pageTitle = isNl
      ? 'Skiën in Winterberg 2026/27 | Pistes, Skihutten, Skipasprijzen & Avondskiën'
      : 'Skifahren in Winterberg 2026/27 | Pisten, Hütten, Skipasspreise & Flutlicht';
    document.title = pageTitle;

    const desc = isNl
      ? 'De complete wintergids voor Winterberg: alle 5 skigebieden, officiële skipasprijzen 2026/27, gezellige skihutten, avondskiën onder schijnwerpers, webcams en community-tips.'
      : 'Der umfassende Winter- & Skiguide für Winterberg: Alle 5 Skigebiete, offizielle Ticketpreise Saison 2026/27, die besten Skihütten, Flutlicht-Guide, Webcams und Community-Umfragen.';

    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', desc);
  }, [isNl]);

  // Vote Handlers
  const handleVotePiste = (optionId: string) => {
    if (userVotedPiste) return;
    const updated = pistePoll.map(item => item.id === optionId ? { ...item, votes: item.votes + 1 } : item);
    setPistePoll(updated);
    setUserVotedPiste(optionId);
    try {
      localStorage.setItem('wv_ski_piste_poll_data', JSON.stringify(updated));
      localStorage.setItem('wv_ski_user_voted_piste', optionId);
    } catch {
      // ignore
    }
  };

  const handleVoteHut = (optionId: string) => {
    if (userVotedHut) return;
    const updated = hutPoll.map(item => item.id === optionId ? { ...item, votes: item.votes + 1 } : item);
    setHutPoll(updated);
    setUserVotedHut(optionId);
    try {
      localStorage.setItem('wv_ski_hut_poll_data', JSON.stringify(updated));
      localStorage.setItem('wv_ski_user_voted_hut', optionId);
    } catch {
      // ignore
    }
  };

  // Submit Review
  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName.trim() || !reviewText.trim()) return;

    const newRev: SkiUserReview = {
      id: `user-rev-${Date.now()}`,
      name: reviewName.trim(),
      locationOrPiste: reviewSpot.trim() || (isNl ? 'Skiliftkarussell Winterberg' : 'Skiliftkarussell Winterberg'),
      rating: reviewRating,
      tag: reviewTag,
      text: reviewText.trim(),
      date: isNl ? 'Zojuist' : 'Gerade eben',
      helpfulCount: 1,
    };

    const updated = [newRev, ...reviews];
    setReviews(updated);
    try {
      localStorage.setItem('wv_ski_user_reviews', JSON.stringify(updated));
    } catch {
      // ignore
    }

    setReviewSuccess(true);
    setTimeout(() => {
      setReviewSuccess(false);
      setIsReviewModalOpen(false);
      setReviewName('');
      setReviewSpot('');
      setReviewText('');
    }, 1500);
  };

  // Like Review
  const handleHelpfulReview = (id: string) => {
    const updated = reviews.map(r => {
      if (r.id === id) {
        if (r.userVotedHelpful) {
          return { ...r, helpfulCount: Math.max(0, r.helpfulCount - 1), userVotedHelpful: false };
        } else {
          return { ...r, helpfulCount: r.helpfulCount + 1, userVotedHelpful: true };
        }
      }
      return r;
    });
    setReviews(updated);
    try {
      localStorage.setItem('wv_ski_user_reviews', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  // Photo Upload Handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert(isNl ? 'De afbeelding mag maximaal 5 MB groot zijn.' : 'Das Bild darf maximal 5 MB groß sein.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setPhotoDataUrl(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitPhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!photoDataUrl || !photoTitle.trim()) return;

    const newPhoto: SkiUserPhoto = {
      id: `photo-user-${Date.now()}`,
      imageUrl: photoDataUrl,
      title: photoTitle.trim(),
      userName: photoUserName.trim() || (isNl ? 'Wintersportgast' : 'Winterberg-Gast'),
      spot: photoSpot.trim() || (isNl ? 'Skiliftkarussell' : 'Skiliftkarussell Winterberg'),
      likes: 1,
      date: isNl ? 'Nieuw' : 'Neu eingereicht',
      isUserUploaded: true,
    };

    const updated = [newPhoto, ...photos];
    setPhotos(updated);
    try {
      localStorage.setItem('wv_ski_user_photos', JSON.stringify(updated));
    } catch {
      // ignore
    }

    setPhotoSuccess(true);
    setTimeout(() => {
      setPhotoSuccess(false);
      setIsPhotoModalOpen(false);
      setPhotoTitle('');
      setPhotoUserName('');
      setPhotoSpot('');
      setPhotoDataUrl(null);
    }, 1500);
  };

  // Like Photo
  const handleLikePhoto = (id: string) => {
    const updated = photos.map(p => p.id === id ? { ...p, likes: p.likes + 1 } : p);
    setPhotos(updated);
    try {
      localStorage.setItem('wv_ski_user_photos', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  // Calculate Poll Total Votes
  const totalPisteVotes = useMemo(() => pistePoll.reduce((a, b) => a + b.votes, 0), [pistePoll]);
  const totalHutVotes = useMemo(() => hutPoll.reduce((a, b) => a + b.votes, 0), [hutPoll]);

  // Ski & Winter News from dataNews
  const skiNews = useMemo(() => {
    return initialNews.filter(n => 
      n.id.includes('ski') || 
      n.id.includes('winterdorf') || 
      n.id.includes('nordhang') || 
      n.slug.includes('ski') ||
      (n.content || '').toLowerCase().includes('skiliftkarussell') ||
      (n.content || '').toLowerCase().includes('skigebiet')
    ).slice(0, 3);
  }, []);

  return (
    <main className="flex-1 w-full max-w-[1180px] mx-auto px-4 sm:px-6 py-6 pb-24 font-sans text-[#1B211D] dark:text-gray-100">
      
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-xs text-[#5F6B63] mb-6 flex-wrap" aria-label="Breadcrumb">
        <button
          type="button"
          onClick={onBack}
          className="hover:text-[#0F4C2E] underline underline-offset-2 bg-transparent border-none p-0 cursor-pointer text-xs"
        >
          {isNl ? 'Home' : 'Startseite'}
        </button>
        <span>/</span>
        <span className="text-gray-400">{isNl ? 'Themapagina\'s' : 'Themenseiten'}</span>
        <span>/</span>
        <span className="font-semibold text-[#1B211D] dark:text-white">
          {isNl ? 'Skiën in Winterberg' : 'Skifahren in Winterberg'}
        </span>
      </nav>

      {/* HERO SECTION */}
      <section className="relative rounded-3xl overflow-hidden shadow-xl mb-10 text-white bg-gradient-to-br from-[#0c2340] via-[#133e68] to-[#081726] p-6 sm:p-10 lg:p-12 border border-white/10">
        {/* Subtle decorative mountain glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-blue-600/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md border border-white/25 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wider text-cyan-200 mb-4 shadow-xs">
            <Snowflake className="w-4 h-4 text-cyan-300 animate-spin-slow" />
            <span>{isNl ? 'Officiële Wintergids & Pisten-Portal 2026/27' : 'Offizieller Winterguide & Pistenportal 2026/27'}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight mb-4 drop-shadow-xs">
            {isNl 
              ? 'Skiën in Winterberg: Pistes, Skihutten, Skipasprijzen & Avondskiën' 
              : 'Skifahren in Winterberg: Pisten, Hütten, Ticketpreise & Flutlicht'}
          </h1>

          <p className="text-base sm:text-lg text-white/90 leading-relaxed font-normal mb-8 max-w-2xl">
            {isNl
              ? 'Alles voor je perfecte wintersportdag in het Sauerland: de 5 grote skigebieden, de officiële skipasprijzen voor het seizoen 2026/27, de gezelligste skihutten, magisch avondskiën en community-tips.'
              : 'Alles für Ihren perfekten Skitag im Sauerland: Die 5 Skigebiete, aktuelle Ticketpreise der Saison 2026/27, der große Hüttenguide, Flutlicht-Highlights, aktuelle News und interaktive Community-Umfragen.'}
          </p>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8">
            <div className="bg-white/10 backdrop-blur-md border border-white/15 p-3.5 rounded-2xl">
              <span className="text-xs text-white/70 block font-medium">{isNl ? 'Skigebieden' : 'Skigebiete'}</span>
              <span className="text-2xl font-black text-cyan-300">5 Gebiete</span>
              <span className="text-[11px] text-white/60 block">{isNl ? '55+ km Pistes' : '55+ km Pisten'}</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/15 p-3.5 rounded-2xl">
              <span className="text-xs text-white/70 block font-medium">{isNl ? 'Liften Karussell' : 'Lifte Karussell'}</span>
              <span className="text-2xl font-black text-cyan-300">27 Anlagen</span>
              <span className="text-[11px] text-white/60 block">{isNl ? '14 Sesselbahnen' : '14 Sesselbahnen'}</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/15 p-3.5 rounded-2xl">
              <span className="text-xs text-white/70 block font-medium">{isNl ? 'Avondskiën' : 'Flutlichtpisten'}</span>
              <span className="text-2xl font-black text-amber-300">14 Pisten</span>
              <span className="text-[11px] text-white/60 block">{isNl ? 'Mi, Fr, Sa (18:30)' : 'Mi, Fr, Sa 18:30'}</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/15 p-3.5 rounded-2xl">
              <span className="text-xs text-white/70 block font-medium">{isNl ? 'Dagkaart 26/27' : 'Tagesticket 26/27'}</span>
              <span className="text-2xl font-black text-emerald-300">53,- €</span>
              <span className="text-[11px] text-white/60 block">{isNl ? 'Kinderen 30,- €' : 'Kinder* 30,- €'}</span>
            </div>
          </div>

          {/* Jump Anchor Navigation Pills */}
          <div className="flex items-center gap-2 flex-wrap text-xs font-semibold">
            <span className="text-white/60 mr-1 hidden sm:inline">{isNl ? 'Snel naar:' : 'Direkt zu:'}</span>
            <a href="#ticketpreise" className="px-3 py-1.5 bg-white/15 hover:bg-white/25 rounded-full text-white transition-colors border border-white/20">
              🎫 {isNl ? 'Prijzen 2026/27' : 'Ticketpreise 26/27'}
            </a>
            <a href="#flutlicht" className="px-3 py-1.5 bg-white/15 hover:bg-white/25 rounded-full text-white transition-colors border border-white/20">
              💡 {isNl ? 'Avondskiën' : 'Flutlichtfahren'}
            </a>
            <a href="#skigebiete" className="px-3 py-1.5 bg-white/15 hover:bg-white/25 rounded-full text-white transition-colors border border-white/20">
              🎿 {isNl ? 'Skigebieden' : 'Skigebiete'}
            </a>
            <a href="#skihuetten" className="px-3 py-1.5 bg-white/15 hover:bg-white/25 rounded-full text-white transition-colors border border-white/20">
              ☕ {isNl ? 'Skihutten' : 'Skihütten'}
            </a>
            <a href="#umfragen" className="px-3 py-1.5 bg-white/15 hover:bg-white/25 rounded-full text-white transition-colors border border-white/20">
              🗳️ {isNl ? 'Stemmen & Polls' : 'Umfragen'}
            </a>
            <a href="#community-ugc" className="px-3 py-1.5 bg-white/15 hover:bg-white/25 rounded-full text-white transition-colors border border-white/20">
              📸 {isNl ? 'Foto\'s & Reviews' : 'Community & Fotos'}
            </a>
            <a href="#ski-news" className="px-3 py-1.5 bg-white/15 hover:bg-white/25 rounded-full text-white transition-colors border border-white/20">
              📰 News
            </a>
          </div>
        </div>

        {/* Decorative Mountain Contour */}
        <div className="absolute right-4 -bottom-10 opacity-10 pointer-events-none hidden lg:block">
          <Mountain className="w-96 h-96 text-white" />
        </div>
      </section>

      {/* SECTION 1: TICKETPREISE SAISON 2026/27 (OFFIZIELL) */}
      <section id="ticketpreise" className="mb-14 scroll-mt-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#0F4C2E] dark:text-emerald-400 mb-2">
              <Ticket className="w-4 h-4" />
              <span>{isNl ? 'Officiële Tarieven 2026/27' : 'Offizielle Skipass-Preise 2026/27'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
              {isNl ? 'Skipasprijzen Skiliftkarussell Winterberg' : 'Ticketpreise Skiliftkarussell Winterberg (Saison 2026/27)'}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 max-w-2xl">
              {isNl
                ? 'Geldig in de aaneengesloten Skiwelt Winterberg (Skiliftkarussell, Altastenberg, Postwiese Neuastenberg, Sahnehang & Ruhrquelle). Vanaf 3 dagen tevens geldig in Willingen & Hunau.'
                : 'Gültig in allen Skigebieten der Skiwelt Winterberg (Skiliftkarussell Winterberg, Altastenberg, Postwiesen Skidorf Neuastenberg, Sahnehang und Ruhrquelle). Ab 3 Tagen zusätzlich in Willingen & Hunau Bödefeld.'}
            </p>
          </div>

          <a
            href="https://www.skiliftkarussell.de/ski-ticket/preise-skiticket/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#F2761B] hover:bg-[#d96512] text-white font-bold text-sm shadow-md transition-all shrink-0 hover:-translate-y-0.5"
          >
            <span>{isNl ? 'Tickets online bestellen' : 'Tickets online kaufen (starjack)'}</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 scrollbar-none border-b border-gray-200 dark:border-gray-800">
          {TICKET_PRICES_2026_27.map((cat, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActivePriceTab(idx)}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
                activePriceTab === idx
                  ? 'bg-[#0F4C2E] text-white shadow-sm'
                  : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              <span>{isNl ? cat.category_nl : cat.category}</span>
            </button>
          ))}
        </div>

        {/* Price Table / Cards Grid */}
        <div className="bg-white dark:bg-[#1E2621] rounded-2xl border border-black/5 dark:border-white/10 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/80 dark:bg-[#151B17] border-b border-gray-200 dark:border-gray-800 text-xs font-bold uppercase text-gray-500 dark:text-gray-400">
                  <th className="py-3.5 px-4 sm:px-6">{isNl ? 'Ticket / Duur' : 'Ticket / Gültigkeit'}</th>
                  <th className="py-3.5 px-4 text-center sm:text-right">{isNl ? 'Volwassenen' : 'Erwachsene'}</th>
                  <th className="py-3.5 px-4 text-center sm:text-right">{isNl ? 'Kinderen*' : 'Kinder*'}</th>
                  <th className="py-3.5 px-4 sm:px-6 hidden md:table-cell">{isNl ? 'Opmerkingen' : 'Hinweise & Gültigkeit'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-sm">
                {TICKET_PRICES_2026_27[activePriceTab].items.map((item, i) => (
                  <tr key={i} className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors">
                    <td className="py-3.5 px-4 sm:px-6 font-semibold text-gray-900 dark:text-white">
                      {isNl ? item.title_nl : item.title}
                      {/* Mobile Note */}
                      {(item.note || item.note_nl) && (
                        <div className="md:hidden text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                          {isNl ? item.note_nl : item.note}
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center sm:text-right font-bold text-gray-900 dark:text-white text-base">
                      {item.adult}
                    </td>
                    <td className="py-3.5 px-4 text-center sm:text-right font-bold text-emerald-700 dark:text-emerald-400 text-base">
                      {item.child}
                    </td>
                    <td className="py-3.5 px-4 sm:px-6 hidden md:table-cell text-xs text-gray-500 dark:text-gray-400">
                      {isNl ? (item.note_nl || item.note || '—') : (item.note || '—')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Important Rules & Terms Box */}
          <div className="p-4 sm:p-5 bg-gray-50/70 dark:bg-[#151B17]/70 border-t border-gray-100 dark:border-gray-800 text-xs text-gray-600 dark:text-gray-400 space-y-1.5">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-[#0F4C2E] dark:text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong>{isNl ? '* Kindertarief:' : '* Kinderregelung:'}</strong>{' '}
                {isNl
                  ? 'Kinderen en jongeren tot en met 15 jaar. Kinderen tot en met 5 jaar onder begeleiding van een betalende volwassene skiën gratis (met uitzondering van de skischool).'
                  : 'Kinder und Jugendliche bis einschließlich 15 Jahren. Kinder bis einschließlich 5 Jahre in Begleitung eines zahlenden erziehungsberechtigten Erwachsenen fahren frei (außer in der Skischule).'}
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Check className="w-4 h-4 text-[#0F4C2E] dark:text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong>{isNl ? 'Geldigheid:' : 'Gültigkeit:'}</strong>{' '}
                {isNl
                  ? 'Tickets zijn geldig in de Skiwelt Winterberg (Skiliftkarussell, Altastenberg, Neuastenberg, Sahnehang, Ruhrquelle). Vanaf 3 dagen tevens geldig in Willingen en Hunau Bödefeld.'
                  : 'Tickets gelten in der gesamten Skiwelt Winterberg (Skiliftkarussell Winterberg, Skikarussell Altastenberg, Postwiesen Skidorf Neuastenberg, Familienskigebiet Sahnehang, Rodelparadies Ruhrquelle). Ab 3 Tagen auch in Willingen & Hunau Bödefeld.'}
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Clock className="w-4 h-4 text-[#0F4C2E] dark:text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong>{isNl ? '1-Dagskaart vanaf 11:00 uur:' : '1-Tagesticket ab 11:00 Uhr:'}</strong>{' '}
                {isNl
                  ? 'Uitsluitend verkrijgbaar aan de kassa\'s & sKiosk-automaten ter plaatse (niet in de online webshop).'
                  : 'Ausschließlich an den Kassen & sKiosk-Automaten vor Ort im Skigebiet erhältlich (nicht im Webshop).'}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: FLUTLICHTFAHREN (NACHTSKI) */}
      <section id="flutlicht" className="mb-14 scroll-mt-20">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 p-6 sm:p-10 text-white shadow-xl border border-indigo-900/50">
          {/* Decorative Glowing Moon & Stars */}
          <div className="absolute top-4 right-6 text-amber-200/20 pointer-events-none">
            <Moon className="w-48 h-48" />
          </div>

          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-400/20 border border-amber-300/30 text-amber-300 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
              <Flame className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>{isNl ? 'Grootste Verlichte Skigebied van West-Duitsland' : 'Größtes Flutlicht-Skigebiet Westdeutschlands'}</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black tracking-tight mb-3">
              {isNl ? 'Magisch Avondskiën in Winterberg' : 'Flutlichtfahren in Winterberg: Skispaß bis in die Nacht'}
            </h2>

            <p className="text-sm sm:text-base text-white/90 leading-relaxed mb-6 font-normal">
              {isNl
                ? 'Als de duisternis valt over het Sauerland, gaan in Winterberg de schijnwerpers aan! Maar liefst 14 pistes met een totale lengte van circa 8 kilometer worden verlicht. De pistes worden tussen 16:30 en 18:30 uur speciaal opnieuw geprepareerd.'
                : 'Wenn es im Sauerland dunkel wird, verwandelt sich Winterberg in ein leuchtendes Wintermärchen: 14 hell erleuchtete Pisten mit rund 8 Kilometern Abfahrt machen das Skiliftkarussell zum größten zusammenhängenden Flutlichtgebiet Westdeutschlands. Alle Pisten werden vor dem Flutlichtstart zwischen 16:30 und 18:30 Uhr frisch mit Pistenraupen gewalzt!'}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="bg-white/10 backdrop-blur-md border border-white/15 p-4 rounded-2xl">
                <div className="flex items-center gap-2 text-amber-300 font-bold text-sm mb-1">
                  <Clock className="w-4 h-4" />
                  <span>{isNl ? 'Wanneer & Tijden' : 'Wann & Uhrzeiten'}</span>
                </div>
                <div className="text-lg font-black text-white">{isNl ? 'Wo, Vr & Za' : 'Mi, Fr & Sa'}</div>
                <div className="text-xs text-white/80">{isNl ? 'Telkens van 18:30 tot 22:00 uur' : 'Jeweils 18:30 bis 22:00 Uhr'}</div>
              </div>

              <div className="bg-white/10 backdrop-blur-md border border-white/15 p-4 rounded-2xl">
                <div className="flex items-center gap-2 text-cyan-300 font-bold text-sm mb-1">
                  <Snowflake className="w-4 h-4" />
                  <span>{isNl ? 'Pistes & Liften' : '14 Pisten im Karussell'}</span>
                </div>
                <div className="text-lg font-black text-white">8 km Piste</div>
                <div className="text-xs text-white/80">Poppenberg, Quick Jet, Herrloh, Rauher Busch, Bremberg</div>
              </div>

              <div className="bg-white/10 backdrop-blur-md border border-white/15 p-4 rounded-2xl">
                <div className="flex items-center gap-2 text-emerald-300 font-bold text-sm mb-1">
                  <Ticket className="w-4 h-4" />
                  <span>{isNl ? 'Avondskipas' : 'Abendkarte 26/27'}</span>
                </div>
                <div className="text-lg font-black text-white">32,- € / 20,- €</div>
                <div className="text-xs text-white/80">{isNl ? 'Vanaf 20:00: 23,- € / 15,- €' : 'Ab 20:00 Uhr: 23,- € / 15,- €'}</div>
              </div>
            </div>

            <div className="p-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/15 text-xs text-white/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="font-bold text-amber-300">🎿 {isNl ? 'Tip voor de avond:' : 'Tipp für die Abendstunden:'}</span>{' '}
                {isNl
                  ? 'De skihutten Bei Möppi, Rauher Busch en Der Brabander zijn geopend tijdens het avondskiën voor après-ski, warme soep en glühwein.'
                  : 'Die Skihütten Bei Möppi (Piste 5), Rauher Busch (Piste 12) und Skihütte Der Brabander (Herrloh) haben abends während des Flutlichts für zünftigen Einkehrschwung geöffnet.'}
              </div>
              <a
                href="#ticketpreise"
                className="px-4 py-2 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold rounded-xl text-xs transition-colors shrink-0 text-center"
              >
                {isNl ? 'Tarieven bekijken' : 'Tarife & Tickets'}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: SKIGEBIETE IM DETAIL */}
      <section id="skigebiete" className="mb-14 scroll-mt-20">
        <div className="mb-6">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#0F4C2E] dark:text-emerald-400 mb-2">
            <Mountain className="w-4 h-4" />
            <span>{isNl ? 'Overzicht van de 5 Gebieden' : 'Wintersport-Vielfalt im Stadtgebiet'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
            {isNl ? 'De 5 Skigebieden in & rond Winterberg' : 'Die 5 Skigebiete in und rund um Winterberg'}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 max-w-2xl">
            {isNl
              ? 'Van het enorme Skiliftkarussell met 27 liften tot het hoogst gelegen skidorp Altastenberg en de sneeuwzekere hellingen van de Kahler Asten.'
              : 'Vom weitläufigen Skiliftkarussell mit 27 Liftanlagen über das FIS-Weltcupdorf Altastenberg bis zu den schneesicheren Sonnenhängen an Postwiese und Kahlem Asten.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SKI_RESORTS_DATA.map((resort) => (
            <div
              key={resort.id}
              className="bg-white dark:bg-[#1E2621] rounded-2xl border border-black/5 dark:border-white/10 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start gap-2 mb-2">
                  <h3 className="font-extrabold text-lg text-gray-900 dark:text-white leading-snug">
                    {isNl ? (resort.name_nl || resort.name) : resort.name}
                  </h3>
                  <a
                    href={resort.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 text-gray-400 hover:text-[#0F4C2E] dark:hover:text-emerald-400"
                    title="Website öffnen"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>

                <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                  {isNl ? (resort.description_nl || resort.description) : resort.description}
                </p>

                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="bg-gray-50 dark:bg-[#151B17] p-2.5 rounded-xl border border-gray-100 dark:border-gray-800 text-center">
                    <span className="text-[11px] text-gray-500 block">{isNl ? 'Liften' : 'Liftanlagen'}</span>
                    <span className="text-base font-extrabold text-gray-900 dark:text-white">{resort.totalLifts} Lifte</span>
                  </div>
                  <div className="bg-gray-50 dark:bg-[#151B17] p-2.5 rounded-xl border border-gray-100 dark:border-gray-800 text-center">
                    <span className="text-[11px] text-gray-500 block">{isNl ? 'Pistekilometers' : 'Pistenkilometer'}</span>
                    <span className="text-base font-extrabold text-[#0F4C2E] dark:text-emerald-400">{resort.totalSlopesKm} km</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs">
                <a
                  href={resort.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-[#0F4C2E] dark:text-emerald-400 hover:underline flex items-center gap-1"
                >
                  <span>{isNl ? 'Pistekaart bekijken' : 'Offizielle Website & Pistenplan'}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 4: SKIHÜTTEN & GASTRONOMIE */}
      <section id="skihuetten" className="mb-14 scroll-mt-20">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#0F4C2E] dark:text-emerald-400 mb-2">
              <Coffee className="w-4 h-4" />
              <span>{isNl ? 'Echte Berghutsfeer' : 'Einkehrschwung & Kulinarik'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
              {isNl ? 'De Gezelligste Skihutten in Winterberg' : 'Die besten Skihütten & Almen im Skigebiet'}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 max-w-2xl">
              {isNl
                ? 'Van knisperend open haardvuur en Sauerlandse erwtensoep tot zinderende après-ski: ontdek waar je het beste stopt voor een pauze.'
                : 'Vom knisternden Kaminfeuer bei hausgemachter Sauerländer Erbsensuppe bis zur legendären Stimmung bei Möppi – alle Skihütten mit direkter Pistenanbindung.'}
            </p>
          </div>

          {onNavigateCategory && (
            <button
              type="button"
              onClick={() => onNavigateCategory('Gastronomie', 'Skihütten')}
              className="inline-flex items-center gap-1 text-xs font-bold text-[#0F4C2E] dark:text-emerald-400 hover:underline bg-transparent border-none p-0 cursor-pointer self-start sm:self-auto"
            >
              <span>{isNl ? 'Alle skihutten in de gids bekijken' : 'Alle Skihütten im Verzeichnis aufrufen'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SKI_HUTS_DATA.map((hut) => {
            const matchedBus = hut.businessNameMatch 
              ? businesses.find(b => b.name.toLowerCase().includes(hut.businessNameMatch!.toLowerCase()))
              : undefined;

            return (
              <div
                key={hut.id}
                className="bg-white dark:bg-[#1E2621] rounded-2xl border border-black/5 dark:border-white/10 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-extrabold text-lg text-gray-900 dark:text-white leading-snug">
                      {hut.name}
                    </h3>
                    {hut.hasFloodlightOpen && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 dark:bg-amber-950/80 dark:text-amber-300 shrink-0">
                        <Moon className="w-2.5 h-2.5" />
                        {isNl ? 'Avondski' : 'Flutlicht'}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 mb-3">
                    <MapPin className="w-3.5 h-3.5 text-[#0F4C2E] dark:text-emerald-400 shrink-0" />
                    <span>{isNl ? hut.location_nl : hut.location}</span>
                  </div>

                  <div className="p-2.5 bg-gray-50 dark:bg-[#151B17] rounded-xl border border-gray-100 dark:border-gray-800 text-xs mb-3">
                    <span className="font-bold text-gray-800 dark:text-gray-200 block mb-0.5">
                      📍 {hut.piste}
                    </span>
                    <span className="text-gray-600 dark:text-gray-400">
                      {isNl ? hut.highlight_nl : hut.highlight}
                    </span>
                  </div>

                  <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                    {isNl ? hut.description_nl : hut.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {hut.tags.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded text-[11px] font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-100 dark:border-gray-800">
                  {matchedBus ? (
                    <button
                      type="button"
                      onClick={() => onSelectBusiness ? onSelectBusiness(matchedBus) : null}
                      className="w-full py-2 px-3 bg-[#0F4C2E] hover:bg-[#14532D] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <span>{isNl ? 'Profiel & Openingstijden bekijken' : 'Eintrag im Verzeichnis aufrufen'}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <div className="text-xs text-gray-400 italic text-center py-1">
                      {isNl ? 'Direct aan de piste bereikbaar' : 'Direkt an der Piste gelegen'}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 5: INTERAKTIVE UMFRAGEN (UGC POLLS) */}
      <section id="umfragen" className="mb-14 scroll-mt-20">
        <div className="mb-6">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#F2761B] mb-2">
            <Vote className="w-4 h-4" />
            <span>{isNl ? 'Jouw Stem Telt' : 'Interaktive Pisten-Umfragen'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
            {isNl ? 'Community Polls: Wat is jouw favoriet in Winterberg?' : 'Winterberg Umfragen: Was ist deine Lieblingspiste & Lieblingshütte?'}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 max-w-2xl">
            {isNl
              ? 'Stem direct mee en bekijk live wat duizenden andere wintersporters in Winterberg het mooist vinden.'
              : 'Stimmen Sie direkt mit ab und sehen Sie in Echtzeit, welche Abfahrten und Skihütten bei den Wintersportlern im Sauerland ganz oben stehen.'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* POLL 1: LIEBLINGSPISTE */}
          <div className="bg-white dark:bg-[#1E2621] rounded-3xl p-6 sm:p-7 border border-black/5 dark:border-white/10 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-950/70 text-blue-800 dark:text-blue-300 font-bold text-xs rounded-full">
                  🎿 {isNl ? 'Piste-Verkiezing' : 'Pisten-Voting'}
                </span>
                <span className="text-xs text-gray-400">
                  {totalPisteVotes} {isNl ? 'stemmen' : 'Stimmen abgegeben'}
                </span>
              </div>

              <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2 leading-tight">
                {isNl ? 'Welke piste is jouw absolute favoriet in Winterberg?' : 'Welches ist deine liebste Piste in Winterberg?'}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">
                {userVotedPiste 
                  ? (isNl ? '✓ Bedankt voor je stem! Hier zijn de actuele resultaten:' : '✓ Danke für deine Stimme! Hier ist das aktuelle Zwischenergebnis:')
                  : (isNl ? 'Kies jouw favoriete afdaling om het resultaat te zien:' : 'Wähle deinen persönlichen Favoriten per Klick:')}
              </p>

              <div className="space-y-3">
                {pistePoll.map((opt) => {
                  const pct = totalPisteVotes > 0 ? Math.round((opt.votes / totalPisteVotes) * 100) : 0;
                  const isUserChoice = userVotedPiste === opt.id;

                  return (
                    <div
                      key={opt.id}
                      onClick={() => !userVotedPiste && handleVotePiste(opt.id)}
                      className={`relative rounded-xl border p-3.5 transition-all overflow-hidden ${
                        !userVotedPiste 
                          ? 'cursor-pointer hover:border-[#0F4C2E] hover:bg-gray-50 dark:hover:bg-[#151B17] border-gray-200 dark:border-gray-800'
                          : isUserChoice
                            ? 'border-[#0F4C2E] dark:border-emerald-500 bg-[#0F4C2E]/5 dark:bg-emerald-950/30'
                            : 'border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-transparent'
                      }`}
                    >
                      {/* Animated Result Progress Bar */}
                      {userVotedPiste && (
                        <div
                          className={`absolute top-0 bottom-0 left-0 transition-all duration-700 ease-out opacity-20 ${
                            isUserChoice ? 'bg-[#0F4C2E] dark:bg-emerald-500' : 'bg-gray-400'
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      )}

                      <div className="relative z-10 flex items-center justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-gray-900 dark:text-white">
                              {isNl ? opt.name_nl : opt.name}
                            </span>
                            {isUserChoice && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-[#0F4C2E] text-white px-2 py-0.5 rounded-full">
                                ✓ {isNl ? 'Jouw stem' : 'Deine Wahl'}
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400 block mt-0.5">
                            {isNl ? opt.description_nl : opt.description}
                          </span>
                        </div>

                        {userVotedPiste && (
                          <div className="text-right shrink-0">
                            <span className="font-black text-sm text-gray-900 dark:text-white block">{pct}%</span>
                            <span className="text-[11px] text-gray-400">{opt.votes}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-5 text-[11px] text-gray-400 text-center">
              🔒 {isNl ? 'Live-uitslag wordt direct opgeslagen.' : 'Live-Voting: Ihre Stimme wird anonymisiert erfasst.'}
            </div>
          </div>

          {/* POLL 2: LIEBLINGSHÜTTE */}
          <div className="bg-white dark:bg-[#1E2621] rounded-3xl p-6 sm:p-7 border border-black/5 dark:border-white/10 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 font-bold text-xs rounded-full">
                  ☕ {isNl ? 'Skihut-Verkiezing' : 'Hütten-Voting'}
                </span>
                <span className="text-xs text-gray-400">
                  {totalHutVotes} {isNl ? 'stemmen' : 'Stimmen abgegeben'}
                </span>
              </div>

              <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2 leading-tight">
                {isNl ? 'Beste einkehr: Welke skihut is jouw nummer 1?' : 'Bester Einkehrschwung: Welche Hütte ist dein Favorit?'}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">
                {userVotedHut 
                  ? (isNl ? '✓ Bedankt voor je stem! Dit is de tussenstand:' : '✓ Danke für deine Stimme! Hier ist das aktuelle Zwischenergebnis:')
                  : (isNl ? 'Kies de berghut met de beste sfeer of lekkerste gerechten:' : 'Wo schmeckt der Einkehrschwung am besten? Stimme ab:')}
              </p>

              <div className="space-y-3">
                {hutPoll.map((opt) => {
                  const pct = totalHutVotes > 0 ? Math.round((opt.votes / totalHutVotes) * 100) : 0;
                  const isUserChoice = userVotedHut === opt.id;

                  return (
                    <div
                      key={opt.id}
                      onClick={() => !userVotedHut && handleVoteHut(opt.id)}
                      className={`relative rounded-xl border p-3.5 transition-all overflow-hidden ${
                        !userVotedHut 
                          ? 'cursor-pointer hover:border-[#F2761B] hover:bg-gray-50 dark:hover:bg-[#151B17] border-gray-200 dark:border-gray-800'
                          : isUserChoice
                            ? 'border-[#F2761B] bg-[#F2761B]/5 dark:bg-orange-950/30'
                            : 'border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-transparent'
                      }`}
                    >
                      {/* Animated Result Progress Bar */}
                      {userVotedHut && (
                        <div
                          className={`absolute top-0 bottom-0 left-0 transition-all duration-700 ease-out opacity-20 ${
                            isUserChoice ? 'bg-[#F2761B]' : 'bg-gray-400'
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      )}

                      <div className="relative z-10 flex items-center justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-gray-900 dark:text-white">
                              {isNl ? opt.name_nl : opt.name}
                            </span>
                            {isUserChoice && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-[#F2761B] text-white px-2 py-0.5 rounded-full">
                                ✓ {isNl ? 'Jouw keuze' : 'Deine Wahl'}
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400 block mt-0.5">
                            {isNl ? opt.description_nl : opt.description}
                          </span>
                        </div>

                        {userVotedHut && (
                          <div className="text-right shrink-0">
                            <span className="font-black text-sm text-gray-900 dark:text-white block">{pct}%</span>
                            <span className="text-[11px] text-gray-400">{opt.votes}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-5 text-[11px] text-gray-400 text-center">
              🏆 {isNl ? 'De officiële publieksprijs voor beste skihut van Winterberg' : 'Das Voting der Winterberg-Community für die Skisaison 2026/27'}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6: UGC - MEINUNGEN, REZENSIONEN & INSIDER-TIPPS */}
      <section id="community-ugc" className="mb-14 scroll-mt-20">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#0F4C2E] dark:text-emerald-400 mb-2">
              <MessageSquare className="w-4 h-4" />
              <span>{isNl ? 'Ervaringen & Tips' : 'Pisten-Meinungen & Insider-Tipps'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
              {isNl ? 'Wat zeggen andere wintersporters over Winterberg?' : 'Was sagen andere Skifahrer über Winterberg?'}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 max-w-2xl">
              {isNl
                ? 'Echte reviews, geheime tips voor rustige uurtjes op de piste en aanbevelingen van locals en vaste gasten.'
                : 'Echte Erfahrungsberichte, Pisten-Empfehlungen und Insidertipps von Einheimischen und erfahrenen Winterurlaubern.'}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsReviewModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#0F4C2E] hover:bg-[#14532D] text-white font-bold text-sm shadow-sm transition-all cursor-pointer self-start sm:self-auto hover:-translate-y-0.5"
          >
            <MessageSquare className="w-4 h-4" />
            <span>{isNl ? 'Deel jouw ervaring / tip' : 'Eigene Meinung & Tipp teilen'}</span>
          </button>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white dark:bg-[#1E2621] rounded-2xl p-6 border border-black/5 dark:border-white/10 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(5)].map((_, idx) => (
                      <Star
                        key={idx}
                        className={`w-4 h-4 ${idx < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                  <span className="text-[11px] font-semibold text-gray-400">
                    {rev.date}
                  </span>
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <span className="font-bold text-sm text-gray-900 dark:text-white">
                    {rev.name}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    {rev.tag}
                  </span>
                </div>

                <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#0F4C2E] dark:text-emerald-400" />
                  <span>{rev.locationOrPiste}</span>
                </div>

                <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed italic mb-4">
                  "{rev.text}"
                </p>
              </div>

              <div className="pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                <span className="text-[11px] text-gray-400">
                  {rev.helpfulCount} {isNl ? 'mensen vonden dit nuttig' : 'Personen fanden diesen Tipp hilfreich'}
                </span>
                <button
                  type="button"
                  onClick={() => handleHelpfulReview(rev.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    rev.userVotedHelpful
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300'
                      : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300'
                  }`}
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>{rev.userVotedHelpful ? (isNl ? 'Bedankt!' : 'Hilfreich ✓') : (isNl ? 'Nuttig' : 'Hilfreich')}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 7: UGC - COMMUNITY-FOTOS & BILDER-UPLOAD */}
      <section id="community-fotos" className="mb-14 scroll-mt-20">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#F2761B] mb-2">
              <Camera className="w-4 h-4" />
              <span>{isNl ? 'Piste-Impressies' : 'Community-Bilderwand'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
              {isNl ? 'Foto\'s uit de Skigebieden' : 'Winterberg im Bild: Deine schönsten Pisten-Momente'}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 max-w-2xl">
              {isNl
                ? 'Deel jouw mooiste foto van de afdaling, een zonovergoten panoramabeeld of een gezellige pauze in de hut.'
                : 'Laden Sie Ihr persönliches Pistenfoto hoch und zeigen Sie der Community die schönsten Ecken im Schnee.'}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsPhotoModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#F2761B] hover:bg-[#d96512] text-white font-bold text-sm shadow-sm transition-all cursor-pointer self-start sm:self-auto hover:-translate-y-0.5"
          >
            <Upload className="w-4 h-4" />
            <span>{isNl ? 'Jouw foto uploaden' : 'Foto hochladen & teilen'}</span>
          </button>
        </div>

        {/* Photos Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {photos.map((item) => (
            <div
              key={item.id}
              className="group bg-white dark:bg-[#1E2621] rounded-2xl overflow-hidden border border-black/5 dark:border-white/10 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="relative aspect-4/3 overflow-hidden bg-gray-900">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute top-2.5 right-2.5 bg-black/60 backdrop-blur-sm text-white px-2 py-0.5 rounded text-[11px] font-medium">
                  {item.spot}
                </div>
                {item.isUserUploaded && (
                  <div className="absolute top-2.5 left-2.5 bg-[#F2761B] text-white px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider">
                    {isNl ? 'Community' : 'Community Upload'}
                  </div>
                )}
              </div>

              <div className="p-4 flex flex-col justify-between flex-1">
                <div>
                  <h4 className="font-bold text-sm text-gray-900 dark:text-white leading-snug mb-1">
                    {item.title}
                  </h4>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-3 flex items-center justify-between">
                    <span>{item.userName}</span>
                    <span>{item.date}</span>
                  </div>
                </div>

                <div className="pt-2.5 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                  <span className="text-xs text-gray-400">
                    ❤️ {item.likes} {isNl ? 'likes' : 'Gefällt mir'}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleLikePhoto(item.id)}
                    className="p-1.5 rounded-lg bg-gray-50 hover:bg-red-50 text-gray-500 hover:text-red-500 transition-colors cursor-pointer"
                    title="Gefällt mir"
                  >
                    ❤️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 8: WINTERSPORT-NEWS (QUERVERLINKT) */}
      <section id="ski-news" className="mb-14 scroll-mt-20">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#0F4C2E] dark:text-emerald-400 mb-2">
              <Sparkles className="w-4 h-4" />
              <span>{isNl ? 'Laatste Nieuws' : 'Aktuelle Wintersport-Nachrichten'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
              {isNl ? 'Berichten rondom Pistes & Skiseizoen' : 'News rund um Skisaison & Winterberg'}
            </h2>
          </div>

          <a
            href="/news"
            onClick={(e) => {
              e.preventDefault();
              window.history.pushState(null, '', isNl ? '/nl/nieuws' : '/news');
              window.dispatchEvent(new PopStateEvent('popstate'));
            }}
            className="text-xs font-bold text-[#0F4C2E] dark:text-emerald-400 hover:underline flex items-center gap-1"
          >
            <span>{isNl ? 'Alle nieuwsberichten bekijken' : 'Alle News im Überblick'}</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {skiNews.map((article) => (
            <div
              key={article.id}
              className="bg-white dark:bg-[#1E2621] rounded-2xl overflow-hidden border border-black/5 dark:border-white/10 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="relative aspect-video overflow-hidden bg-gray-100 dark:bg-gray-800">
                  <img
                    src={article.imageUrl}
                    alt={isNl ? (article.title_nl || article.title) : article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute top-2.5 left-2.5 bg-[#0F4C2E] text-white px-2 py-0.5 rounded text-[10px] font-bold">
                    {article.businessName || 'Wintersport'}
                  </div>
                </div>

                <div className="p-5">
                  <span className="text-[11px] text-gray-400 block mb-1.5">
                    {new Date(article.date).toLocaleDateString(isNl ? 'nl-NL' : 'de-DE', { day: '2-digit', month: 'long', year: 'numeric' })}
                  </span>
                  <h3 className="font-bold text-base text-gray-900 dark:text-white leading-snug line-clamp-2 mb-2 group-hover:text-[#0F4C2E] dark:group-hover:text-emerald-400 transition-colors">
                    {isNl ? (article.title_nl || article.title) : article.title}
                  </h3>
                </div>
              </div>

              <div className="px-5 pb-5">
                <button
                  type="button"
                  onClick={() => {
                    if (onSelectNewsArticle) {
                      onSelectNewsArticle(article.slug);
                    } else {
                      const prefix = isNl ? '/nl' : '';
                      const newsPath = `${prefix}/news/${(isNl && article.slug_nl) ? article.slug_nl : article.slug}`;
                      window.history.pushState(null, '', newsPath);
                      window.dispatchEvent(new PopStateEvent('popstate'));
                    }
                  }}
                  className="w-full py-2 px-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 font-bold text-xs rounded-xl flex items-center justify-center gap-1 transition-colors cursor-pointer"
                >
                  <span>{isNl ? 'Lees het hele artikel' : 'Artikel lesen'}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 9: LIVE WEBCAMS & SCHNEEBERICHT BANNER */}
      <section className="mb-14">
        <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-emerald-900 via-teal-900 to-[#0F4C2E] text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 rounded-full text-xs font-bold mb-3">
              <Video className="w-4 h-4 text-emerald-300" />
              <span>{isNl ? 'Live Beelden & Piste-Status' : 'Live-Bilder & Schneebericht'}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black mb-2">
              {isNl ? 'Wil je de actuele sneeuwhoogtes & webcams zien?' : 'Möchten Sie die Live-Webcams und Schneehöhen prüfen?'}
            </h3>
            <p className="text-sm text-white/90 leading-relaxed">
              {isNl
                ? 'Bekijk de 360° HD-livestreams van de St. Georg Schanze, Möppis Hütte, Bremberg en Kahler Asten direct in ons portaal.'
                : 'Werfen Sie einen Blick auf die hochauflösenden 360°-Webcams an der St. Georg Schanze, Möppis Hütte, Kappe und Brembergkopf.'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
            <button
              type="button"
              onClick={() => {
                if (onNavigateSkiReport) {
                  onNavigateSkiReport();
                } else {
                  window.history.pushState(null, '', isNl ? '/nl/skigebied-piste' : '/pistenbericht');
                  window.dispatchEvent(new PopStateEvent('popstate'));
                }
              }}
              className="px-6 py-3 rounded-xl bg-white text-[#0F4C2E] hover:bg-gray-100 font-extrabold text-sm transition-all text-center shadow-md cursor-pointer"
            >
              {isNl ? 'Pistebericht & Webcams' : 'Schneebericht & Webcams'}
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 10: FAQ ACCORDION (SKI THEME) */}
      <section className="mb-14">
        <div className="mb-6">
          <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">
            {isNl ? 'Veelgestelde vragen over skiën in Winterberg' : 'Häufige Fragen rund ums Skifahren in Winterberg'}
          </h2>
        </div>

        <div className="space-y-3">
          {[
            {
              q: isNl ? 'Wanneer start het skiseizoen 2026/27 in Winterberg?' : 'Wann startet die Skisaison 2026/27 im Skiliftkarussell Winterberg?',
              a: isNl
                ? 'Dankzij moderne allwetter-sneeuwkanonnen openen de eerste liften in Winterberg traditiegetrouw al eind november (gepland vanaf 27 november 2026). Zodra er constante vorst intreedt, volgt de uitbreiding naar het volledige pistenetwerk.'
                : 'Dank moderner Allwetter-Schneeerzeuger öffnen die ersten Lifte im Skiliftkarussell Winterberg bereits am Freitag, den 27. November 2026 (zunächst bis zu 6 Pistenkilometer). Der Vollbetrieb über alle 27,5 km startet mit dem Einsetzen dauerhafter Frostperioden.'
            },
            {
              q: isNl ? 'Moet ik skipassen vooraf online reserveren?' : 'Müssen Skipässe im Voraus online gekauft werden?',
              a: isNl
                ? 'Skipassen kunnen zowel online via starjack als rechtstreeks bij de kassa\'s en verkoopautomaten in het skigebied worden aangeschaft. Let op: het 1-dagsticket vanaf 11:00 uur is uitsluitend aan de kassa ter plaatse verkrijgbaar.'
                : 'Skitickets können bequem im Vorfeld online über starjack (skiliftkarussell.de) auf bestehende Keycards geladen oder vor Ort an den Kassen und sKiosk-Automaten gekauft werden. Das 1-Tagesticket ab 11:00 Uhr gibt es nur vor Ort.'
            },
            {
              q: isNl ? 'Is mijn dagkaart geldig tijdens het avondskiën?' : 'Gilt mein Tagesticket auch beim Flutlicht-Skifahren am Abend?',
              a: isNl
                ? 'Nee, reguliere dagtickets zijn overdag geldig tot 16:30 uur. Voor het avondskiën (18:30 - 22:00 uur) is een aparte avondkaart nodig, omdat de pistes tussendoor opnieuw worden geprepareerd.'
                : 'Nein, reguliere Tagestickets gelten tagsüber bis 16:30 Uhr. Für das Flutlicht-Skifahren (18:30 bis 22:00 Uhr) wird ein separates Abendticket benötigt, da die Pisten in der Zwischenpause frisch gewalzt werden.'
            },
            {
              q: isNl ? 'Waar kan ik ski\'s en snowboards huren in Winterberg?' : 'Wo kann ich in Winterberg Skier und Snowboards leihen?',
              a: isNl
                ? 'Direct bij de dalstations en parkeerplaatsen van het Skiliftkarussell (zoals P1, P2 Bremberg, P3, P5 Poppenberg en P8 Schneewittchen) bevinden zich professionele skiverhuurders met modern materiaal.'
                : 'Direkt an den Einstiegen und Großparkplätzen rund um das Skiliftkarussell (P1 Herrloh, P2 Bremberg, P3, P5 Poppenberg, P8 Schneewittchen) befinden sich zahlreiche renommierte Skiverleiher mit modernstem Carving- und Snowboard-Equipment.'
            }
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-[#1E2621] rounded-2xl border border-black/5 dark:border-white/10 overflow-hidden shadow-xs"
            >
              <button
                type="button"
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full p-4 sm:p-5 text-left font-bold text-sm sm:text-base text-gray-900 dark:text-white flex items-center justify-between gap-4 cursor-pointer hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors"
              >
                <span>{item.q}</span>
                <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${openFaq === idx ? 'rotate-180 text-[#0F4C2E]' : ''}`} />
              </button>
              {openFaq === idx && (
                <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed border-t border-gray-100 dark:border-gray-800/60">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* MODAL: REVIEW EINREICHEN */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1E2621] rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-gray-100 dark:border-gray-800 relative animate-in fade-in zoom-in-95 duration-200">
            <button
              type="button"
              onClick={() => setIsReviewModalOpen(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xl font-bold p-1 cursor-pointer"
            >
              ✕
            </button>

            <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2">
              {isNl ? 'Deel jouw ervaring of tip' : 'Pisten-Meinung & Tipp teilen'}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">
              {isNl
                ? 'Help andere wintersporters met jouw persoonlijke aanbeveling voor een piste, hut of bezoekuur.'
                : 'Helfen Sie anderen Skifahrern mit Ihrer persönlichen Empfehlung für Pisten, Hütten oder den besten Zeitpunkt.'}
            </p>

            {reviewSuccess ? (
              <div className="p-6 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 rounded-2xl text-center border border-emerald-200 dark:border-emerald-800">
                <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-600 mb-2" />
                <h4 className="font-bold text-base mb-1">{isNl ? 'Hartelijk dank!' : 'Vielen Dank!'}</h4>
                <p className="text-xs">{isNl ? 'Jouw tip is direct toegevoegd aan het overzicht.' : 'Dein Tipp wurde erfolgreich in die Community-Übersicht aufgenommen.'}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    {isNl ? 'Jouw Naam / Woonplaats' : 'Dein Name / Wohnort'} *
                  </label>
                  <input
                    type="text"
                    required
                    value={reviewName}
                    onChange={(e) => setReviewName(e.target.value)}
                    placeholder={isNl ? 'Bijv. Thomas uit Utrecht' : 'Z. B. Stefan aus Dortmund'}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#151B17] text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0F4C2E]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                      {isNl ? 'Piste / Skigebied / Hut' : 'Piste / Skigebiet / Hütte'}
                    </label>
                    <input
                      type="text"
                      value={reviewSpot}
                      onChange={(e) => setReviewSpot(e.target.value)}
                      placeholder={isNl ? 'Bijv. Poppenberg Piste 5' : 'Z. B. Kappe Steilhang oder Möppi'}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#151B17] text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0F4C2E]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                      {isNl ? 'Categorie-Tag' : 'Kategorie-Tag'}
                    </label>
                    <select
                      value={reviewTag}
                      onChange={(e) => setReviewTag(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#151B17] text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0F4C2E]"
                    >
                      <option value="Flutlicht-Fan">{isNl ? 'Avondski-fan' : 'Flutlicht-Fan'}</option>
                      <option value="Familientipp">{isNl ? 'Gezinstip' : 'Familientipp'}</option>
                      <option value="Geheimtipp">{isNl ? 'Geheime tip' : 'Geheimtipp'}</option>
                      <option value="Sportlich">{isNl ? 'Sportief' : 'Sportlich / Profi'}</option>
                      <option value="Einkehr & Hüttengaudi">{isNl ? 'Gezelligheid' : 'Einkehr & Gemütlichkeit'}</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    {isNl ? 'Beoordeling' : 'Bewertung'}
                  </label>
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewRating(star)}
                        className="p-1 cursor-pointer"
                      >
                        <Star
                          className={`w-6 h-6 ${star <= reviewRating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`}
                        />
                      </button>
                    ))}
                    <span className="text-xs text-gray-500 ml-2 font-bold">{reviewRating} / 5</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    {isNl ? 'Jouw ervaring / advies' : 'Dein Erfahrungsbericht oder Tipp'} *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder={isNl ? 'Schrijf hier je tip over wachttijden, beste tijdstip, uitzicht of parkeren...' : 'Was sollten andere Skifahrer wissen? (z.B. Geheimtipps zum Parken, schönste Waldabfahrten oder beste Hüttenküche)'}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#151B17] text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0F4C2E]"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsReviewModalOpen(false)}
                    className="px-4 py-2 text-xs font-bold text-gray-500 hover:text-gray-700 cursor-pointer"
                  >
                    {isNl ? 'Annuleren' : 'Abbrechen'}
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#0F4C2E] hover:bg-[#14532D] text-white font-bold text-xs rounded-xl shadow-md transition-colors cursor-pointer"
                  >
                    {isNl ? 'Tip publiceren' : 'Meinung veröffentlichen'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* MODAL: FOTO HOCHLADEN */}
      {isPhotoModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1E2621] rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-gray-100 dark:border-gray-800 relative animate-in fade-in zoom-in-95 duration-200">
            <button
              type="button"
              onClick={() => setIsPhotoModalOpen(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xl font-bold p-1 cursor-pointer"
            >
              ✕
            </button>

            <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2">
              {isNl ? 'Winterberg Skifoto uploaden' : 'Winterberg-Skifoto hochladen'}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">
              {isNl
                ? 'Laat de community meegenieten van jouw dag in de sneeuw in Winterberg.'
                : 'Teilen Sie Ihren schönsten Wintermoment auf den Pisten mit der Community.'}
            </p>

            {photoSuccess ? (
              <div className="p-6 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 rounded-2xl text-center border border-emerald-200 dark:border-emerald-800">
                <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-600 mb-2" />
                <h4 className="font-bold text-base mb-1">{isNl ? 'Foto succesvol geüpload!' : 'Foto erfolgreich hochgeladen!'}</h4>
                <p className="text-xs">{isNl ? 'Jouw foto is direct zichtbaar in de galerij.' : 'Ihr Bild ist ab sofort in der Community-Galerie zu sehen.'}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitPhoto} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    {isNl ? 'Foto selecteren (JPEG, PNG, WebP tot 5 MB)' : 'Foto auswählen (JPG, PNG, WebP bis 5 MB)'} *
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    required
                    onChange={handleFileChange}
                    className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#F2761B] file:text-white hover:file:bg-[#d96512] cursor-pointer"
                  />
                  {photoDataUrl && (
                    <div className="mt-3 aspect-video rounded-xl overflow-hidden bg-gray-100 max-h-40 border border-gray-200">
                      <img src={photoDataUrl} alt="Vorschau" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    {isNl ? 'Titel van de foto' : 'Bildtitel / Motiv'} *
                  </label>
                  <input
                    type="text"
                    required
                    value={photoTitle}
                    onChange={(e) => setPhotoTitle(e.target.value)}
                    placeholder={isNl ? 'Bijv. Zonsondergang aan de Bremberg' : 'Z. B. Sonnenuntergang am Brembergkopf'}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#151B17] text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#F2761B]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                      {isNl ? 'Jouw Naam' : 'Dein Name / Fotograf'}
                    </label>
                    <input
                      type="text"
                      value={photoUserName}
                      onChange={(e) => setPhotoUserName(e.target.value)}
                      placeholder={isNl ? 'Bijv. Laura M.' : 'Z. B. Florian K.'}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#151B17] text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#F2761B]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                      {isNl ? 'Piste / Locatie' : 'Piste / Ort'}
                    </label>
                    <input
                      type="text"
                      value={photoSpot}
                      onChange={(e) => setPhotoSpot(e.target.value)}
                      placeholder={isNl ? 'Bijv. Poppenberg' : 'Z. B. Poppenberg P5'}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#151B17] text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#F2761B]"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsPhotoModalOpen(false)}
                    className="px-4 py-2 text-xs font-bold text-gray-500 hover:text-gray-700 cursor-pointer"
                  >
                    {isNl ? 'Annuleren' : 'Abbrechen'}
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#F2761B] hover:bg-[#d96512] text-white font-bold text-xs rounded-xl shadow-md transition-colors cursor-pointer"
                  >
                    {isNl ? 'Foto uploaden' : 'Foto hochladen'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </main>
  );
};

export default SkiThemePage;
