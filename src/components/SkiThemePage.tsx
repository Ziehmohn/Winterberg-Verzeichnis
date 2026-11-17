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
  MessageSquare,
  Star,
  ThumbsUp,
  MapPin,
  Flame,
  ChevronDown,
  ChevronLeft,
  Info,
  Check,
  Award,
  Video,
  ArrowRight,
  Newspaper
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
  onNavigateKidsOnSki?: () => void;
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
    businessNameMatch: 'Bobhaus Winterberg',
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
    businessNameMatch: 'Köhlerhütte am Sahnehang',
  },
  {
    id: 'bremberg-klause',
    name: 'Bremberg Klause',
    location: 'Bremberg / Piste 10 & 11',
    location_nl: 'Bremberg / Piste 10 & 11',
    piste: 'Piste 10 (Bremberg) & Piste 11',
    highlight: 'Beliebter Einkehrschwung & Restaurant direkt an den Bremberg-Abfahrten bei Tag & Flutlicht',
    highlight_nl: 'Gezellige skihut & restaurant direct aan de Bremberg-afdalingen en avondskiën',
    description: 'Direkt an den Pisten des Brembergs: Urige Gemütlichkeit, hausgemachte Speisen, heiße Getränke und Sonnenterrasse. Freitags auch bei Flutlicht bis 22:30 Uhr geöffnet.',
    description_nl: 'Direct aan de pistes van de Bremberg: gezellige sfeer, warme maaltijden, drankjes en zonneterras. Vrijdags ook geopend tijdens avondskiën.',
    tags: ['Bremberg', 'Sonnenterrasse', 'Flutlicht-Abend', 'Gemütlich'],
    businessNameMatch: 'Bremberg Klause',
    hasFloodlightOpen: true,
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
  { id: 'quickjet', name: 'Quick Jet / Poppenberg (Piste 5)', name_nl: 'Quick Jet / Poppenberg (Piste 5)', description: 'Breiter Carving-Hang & legendäre Flutlichtpiste', description_nl: 'Brede carvinghelling en legendarische avondpiste', votes: 0 },
  { id: 'kappe', name: 'Kappe Steilhang (Piste 14)', name_nl: 'Kappe Steilhang (Piste 14)', description: 'Die steilste Herausforderung nördlich der Alpen (bis 50% Gefälle)', description_nl: 'De steilste afdaling ten noorden van de Alpen (tot 50%)', votes: 0 },
  { id: 'herrloh', name: 'Slalomhang Herrloh & St. Georg Schanze', name_nl: 'Slalomhang Herrloh & St. Georg Schans', description: 'Der beliebte Traditions-Klassiker mitten im Karussell', description_nl: 'De populaire klassieker in het hart van het skigebied', votes: 0 },
  { id: 'schneewittchen', name: 'Schneewittchenhang (Piste 25)', name_nl: 'Schneewittchenhang (Piste 25)', description: 'Herrlich weitläufig, modern erschlossen & familienfreundlich', description_nl: 'Heerlijk breed, modern en ideaal voor gezinnen', votes: 0 },
  { id: 'bremberg', name: 'Bremberg Waldabfahrt (Piste 10 & 11)', name_nl: 'Bremberg Bosafdaling (Piste 10 & 11)', description: 'Entspanntes Gleiten durch verschneite Fichtenwälder', description_nl: 'Ontspannen afdalen tussen de besneeuwde dennenbomen', votes: 0 },
  { id: 'altastenberg', name: 'Westfalenhang I (Skikarussell Altastenberg)', name_nl: 'Westfalenhang I (Altastenberg)', description: 'Einzige offizielle FIS-Weltcup-Slalomstrecke im Sauerland', description_nl: 'Enige officiële FIS-wereldbeker slalompiste in de regio', votes: 0 },
];

// UGC Community Reviews Interface & Initial Data (keine erfundenen Test-Einträge)
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

const INITIAL_COMMUNITY_REVIEWS: SkiUserReview[] = [];

export const SkiThemePage: React.FC<SkiThemePageProps> = ({
  businesses,
  theme,
  onSelectBusiness,
  onSelectNewsArticle,
  onBack,
  onNavigateCategory,
  onNavigateSkiReport,
  onNavigateKidsOnSki
}) => {
  const { t, lang } = useTranslation();
  const isNl = lang === 'nl';

  // Ticket Pricing Tab State
  const [activePriceTab, setActivePriceTab] = useState<number>(0);

  // Poll 1 State
  const [pistePoll, setPistePoll] = useState<PollOption[]>(() => {
    try {
      // Clear old mock poll storage keys so browser doesn't load fake 592 votes
      localStorage.removeItem('wv_ski_piste_poll_data');
      localStorage.removeItem('wv_ski_piste_poll_data_v2');
      localStorage.removeItem('wv_ski_hut_poll_data');
      localStorage.removeItem('wv_ski_user_voted_hut');

      const saved = localStorage.getItem('wv_ski_piste_poll_v4');
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

  // Reviews State: Ausschließlich echte Nutzer-Bewertungen (keine erfundenen Mock-Reviews)
  const [reviews, setReviews] = useState<SkiUserReview[]>(() => {
    try {
      const saved = localStorage.getItem('wv_ski_user_reviews');
      if (saved) {
        const parsed: SkiUserReview[] = JSON.parse(saved);
        // Vorherige Test-Reviews (Markus T., Sandra, Julian, Elena bzw. ID rev-*) filtern
        const realReviews = parsed.filter(r => 
          !r.id.startsWith('rev-') && 
          !r.name.includes('Markus T.') && 
          !r.name.includes('Sandra') && 
          !r.name.includes('Julian B.') && 
          !r.name.includes('Elena K.')
        );
        localStorage.setItem('wv_ski_user_reviews', JSON.stringify(realReviews));
        return realReviews;
      }
      return INITIAL_COMMUNITY_REVIEWS;
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

  // FAQ Accordion
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Client-side purge on mount to guarantee removal of cached mock entries from visitors' localStorage
  useEffect(() => {
    try {
      localStorage.removeItem('wv_ski_piste_poll_data');
      localStorage.removeItem('wv_ski_piste_poll_data_v2');
      localStorage.removeItem('wv_ski_hut_poll_data');
      localStorage.removeItem('wv_ski_user_voted_hut');
      localStorage.removeItem('wv_ski_user_photos');

      const savedReviews = localStorage.getItem('wv_ski_user_reviews');
      if (savedReviews) {
        const parsed: SkiUserReview[] = JSON.parse(savedReviews);
        const filtered = parsed.filter(r => 
          !r.id.startsWith('rev-') && 
          !r.name.includes('Markus T.') && 
          !r.name.includes('Sandra') && 
          !r.name.includes('Julian B.') && 
          !r.name.includes('Elena K.')
        );
        if (filtered.length !== parsed.length) {
          localStorage.setItem('wv_ski_user_reviews', JSON.stringify(filtered));
          setReviews(filtered);
        }
      }
    } catch {
      // ignore
    }
  }, []);

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
    if (userVotedPiste === optionId) return;
    const updated = pistePoll.map(item => {
      if (userVotedPiste && item.id === userVotedPiste) {
        return { ...item, votes: Math.max(0, item.votes - 1) };
      }
      if (item.id === optionId) {
        return { ...item, votes: item.votes + 1 };
      }
      return item;
    });
    setPistePoll(updated);
    setUserVotedPiste(optionId);
    try {
      localStorage.setItem('wv_ski_piste_poll_v4', JSON.stringify(updated));
      localStorage.setItem('wv_ski_user_voted_piste', optionId);
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

  // Calculate Poll Total Votes
  const totalPisteVotes = useMemo(() => pistePoll.reduce((a, b) => a + b.votes, 0), [pistePoll]);

  // Ski & Winter News from dataNews
  const skiNews = useMemo(() => {
    return initialNews.filter(n => 
      n.id.includes('ski') || 
      n.id.includes('winterdorf') || 
      n.id.includes('nordhang') || 
      (n.slug || '').includes('ski') ||
      (n.content || '').toLowerCase().includes('skiliftkarussell') ||
      (n.content || '').toLowerCase().includes('skigebiet')
    ).slice(0, 5);
  }, []);

  const [activeNewsIndex, setActiveNewsIndex] = useState(0);
  const currentHeroNews = skiNews[activeNewsIndex] || skiNews[0];
  const [activeSection, setActiveSection] = useState<string>('skigebiete');
  const [stickyTopOffset, setStickyTopOffset] = useState<number>(60);

  // Measure main site header height so sticky on-page nav sits flush underneath
  useEffect(() => {
    const updateHeaderOffset = () => {
      const headerEl = document.querySelector('header');
      if (headerEl) {
        setStickyTopOffset(Math.round(headerEl.getBoundingClientRect().height));
      }
    };
    updateHeaderOffset();
    window.addEventListener('resize', updateHeaderOffset);
    return () => window.removeEventListener('resize', updateHeaderOffset);
  }, []);

  // Scroll-spy for On-Page-Navigation active state
  useEffect(() => {
    const sectionIds = [
      'skigebiete',
      'skihuetten',
      'ticketpreise',
      'flutlicht',
      'pistenbericht',
      'kids-on-ski',
      'umfragen',
      'community-ugc',
      'faq',
    ];
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          setActiveSection(visible[0].target.id);
        }
      },
      { rootMargin: '-140px 0px -55% 0px', threshold: 0.01 }
    );
    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const getNewsExcerpt = (raw?: string) => {
    if (!raw) return '';
    return raw
      .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
      .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
      .replace(/:::[\s\S]*?:::/g, '')
      .replace(/^#+\s*/gm, '')
      .replace(/[*_`>]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] dark:bg-[#121614] text-[#1B211D] dark:text-[#EAE6DF] font-sans">

      {/* FULL-WIDTH HERO HEADER WITH INTEGRATED NEWS SLIDER */}
      <section className="w-full bg-[#091C30] text-white relative overflow-hidden border-b border-white/10 shadow-lg">
        {/* Background Hero Image */}
        <img
          src="/news-skisaison-winterberg-eroeffnung.jpg"
          alt={isNl ? 'Skiën in Winterberg – Skiliftkarussell' : 'Skifahren in Winterberg – Skiliftkarussell Winterberg'}
          width={1600}
          height={900}
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        {/* Editorial Dark Gradient Overlay for high contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#071626]/95 via-[#091D33]/85 to-[#071626]/75" />

        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 pt-5 sm:pt-8 lg:pt-10 pb-8 sm:pb-10 lg:pb-12 relative z-10">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-1.5 text-xs text-white/75 mb-5 flex-wrap" aria-label="Breadcrumb">
            <button
              type="button"
              onClick={onBack}
              className="hover:text-white underline underline-offset-2 bg-transparent border-none p-0 cursor-pointer text-xs text-white/75"
            >
              {isNl ? 'Home' : 'Startseite'}
            </button>
            <span>/</span>
            <span className="text-white/60">{isNl ? 'Themapagina\'s' : 'Themen'}</span>
            <span>/</span>
            <span className="font-semibold text-white">
              {isNl ? 'Skiën in Winterberg' : 'Skifahren in Winterberg'}
            </span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 lg:gap-10 items-center">
            {/* Left Column: Title, Intro & Key Facts */}
            <div className="lg:col-span-7">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sky-300 mb-2.5">
                <Snowflake className="w-4 h-4 text-sky-300 shrink-0" />
                <span>{isNl ? 'Winterberg & Sauerland • Seizoen 2026/27' : 'Winterberg & Sauerland • Saison 2026/27'}</span>
              </div>

              <h1 className="font-display text-3xl sm:text-4xl lg:text-[46px] font-extrabold tracking-tight leading-[1.12] mb-3.5 text-white">
                {isNl
                  ? 'Skiën in Winterberg: Pistes, Skihutten & Skipasprijzen'
                  : 'Skifahren in Winterberg: Skigebiete, Hütten & Ticketpreise'}
              </h1>

              <p className="text-sm sm:text-base text-white/85 leading-relaxed mb-6 max-w-2xl">
                {isNl
                  ? 'Alle informatie voor uw wintersportdag in het Sauerland: de 5 skigebieden, berghutten aan de piste, officiële skipasprijzen voor 2026/27, avondskiën en live pisteberichten.'
                  : 'Alle Informationen für Ihren Skitag im Sauerland: die fünf Skigebiete, Skihütten direkt an der Piste, aktuelle Ticketpreise für die Saison 2026/27, Flutlichtzeiten und der Live-Pistenbericht.'}
              </p>

              {/* Clean Editorial Key Facts Bar */}
              <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-4 border-t border-white/15 text-sm">
                <div>
                  <span className="block text-[11px] uppercase tracking-wider text-white/60">{isNl ? 'Skigebieden' : 'Skigebiete'}</span>
                  <span className="font-bold text-white">{isNl ? '5 gebieden · 55+ km' : '5 Gebiete · 55+ km'}</span>
                </div>
                <div className="hidden sm:block h-7 w-px bg-white/15" />
                <div>
                  <span className="block text-[11px] uppercase tracking-wider text-white/60">Skiliftkarussell</span>
                  <span className="font-bold text-white">{isNl ? '27 liften' : '27 Liftanlagen'}</span>
                </div>
                <div className="hidden sm:block h-7 w-px bg-white/15" />
                <div>
                  <span className="block text-[11px] uppercase tracking-wider text-white/60">{isNl ? 'Dagkaart 26/27' : 'Tagesticket 26/27'}</span>
                  <span className="font-bold text-white">53,- € <span className="font-normal text-white/70 text-xs">({isNl ? 'Kind 30,- €' : 'Kind* 30,- €'})</span></span>
                </div>
                <div className="hidden sm:block h-7 w-px bg-white/15" />
                <div>
                  <span className="block text-[11px] uppercase tracking-wider text-white/60">{isNl ? 'Avondskiën' : 'Flutlicht'}</span>
                  <span className="font-bold text-white">{isNl ? 'Wo, Vr, Za · 18:30' : 'Mi, Fr, Sa · 18:30'}</span>
                </div>
              </div>
            </div>

            {/* Right Column: White Ski-News Slider Card on Hero */}
            {currentHeroNews && (
              <div className="lg:col-span-5">
                <div className="bg-white dark:bg-[#1E2621] text-gray-900 dark:text-white border border-black/10 dark:border-white/15 rounded-2xl overflow-hidden shadow-2xl">
                  {/* Slider Header */}
                  <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-200 dark:border-gray-800 bg-[#F7F5F0] dark:bg-[#151B17]">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0F4C2E] dark:text-emerald-400">
                      <Newspaper className="w-3.5 h-3.5" />
                      <span>{isNl ? 'Actueel Skinieuws' : 'Aktuelle Ski-News'}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        aria-label={isNl ? 'Vorige nieuwsbericht' : 'Vorherige News'}
                        onClick={() => setActiveNewsIndex((prev) => (prev - 1 + skiNews.length) % skiNews.length)}
                        className="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors cursor-pointer"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <span className="text-[11px] font-semibold text-gray-600 dark:text-gray-400 tabular-nums min-w-[32px] text-center">
                        {activeNewsIndex + 1} / {skiNews.length}
                      </span>
                      <button
                        type="button"
                        aria-label={isNl ? 'Volgende nieuwsbericht' : 'Nächste News'}
                        onClick={() => setActiveNewsIndex((prev) => (prev + 1) % skiNews.length)}
                        className="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors cursor-pointer"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Active News Slide */}
                  <div className="p-4">
                    <div className="flex gap-3.5 items-start mb-3">
                      {currentHeroNews.imageUrl && (
                        <img
                          src={currentHeroNews.imageUrl}
                          alt={isNl ? (currentHeroNews.title_nl || currentHeroNews.title) : currentHeroNews.title}
                          className="w-24 h-20 sm:w-28 sm:h-22 rounded-lg object-cover shrink-0 border border-gray-200 dark:border-gray-700"
                        />
                      )}
                      <div className="min-w-0 flex-1">
                        <span className="text-[11px] text-gray-500 dark:text-gray-400 font-medium block mb-1">
                          {new Date(currentHeroNews.date).toLocaleDateString(isNl ? 'nl-NL' : 'de-DE', { day: '2-digit', month: 'long', year: 'numeric' })}
                        </span>
                        <h2 className="text-sm sm:text-base font-extrabold text-gray-900 dark:text-white leading-snug line-clamp-2">
                          {isNl ? (currentHeroNews.title_nl || currentHeroNews.title) : currentHeroNews.title}
                        </h2>
                      </div>
                    </div>

                    <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-2 mb-3.5">
                      {getNewsExcerpt(isNl ? (currentHeroNews.content_nl || currentHeroNews.content) : currentHeroNews.content)}
                    </p>

                    <div className="flex items-center justify-between gap-3 pt-2.5 border-t border-gray-100 dark:border-gray-800">
                      <button
                        type="button"
                        onClick={() => {
                          const targetSlug = (isNl && currentHeroNews.slug_nl) ? currentHeroNews.slug_nl : (currentHeroNews.slug || currentHeroNews.id);
                          if (onSelectNewsArticle) {
                            onSelectNewsArticle(targetSlug);
                          } else {
                            const prefix = isNl ? '/nl' : '';
                            window.history.pushState(null, '', `${prefix}/news/${targetSlug}`);
                            window.dispatchEvent(new PopStateEvent('popstate'));
                          }
                        }}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0F4C2E] dark:text-emerald-400 hover:underline transition-colors bg-transparent border-none p-0 cursor-pointer"
                      >
                        <span>{isNl ? 'Artikel lezen' : 'Meldung lesen'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>

                      {/* Slide Dots */}
                      <div className="flex items-center gap-1.5">
                        {skiNews.map((item, idx) => (
                          <button
                            key={item.id}
                            type="button"
                            aria-label={`News ${idx + 1}`}
                            onClick={() => setActiveNewsIndex(idx)}
                            className={`h-1.5 rounded-full transition-all cursor-pointer border-none ${
                              idx === activeNewsIndex
                                ? 'w-5 bg-[#0F4C2E] dark:bg-emerald-400'
                                : 'w-1.5 bg-gray-300 dark:bg-gray-700 hover:bg-gray-400'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Photo Credit */}
        <div className="absolute bottom-2 right-3 z-10 text-[10px] text-white/60">
          Foto:{' '}
          <a
            href="https://commons.wikimedia.org/wiki/File:Skiliftkarussell_Winterberg_2014_-_3.jpg"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-white/90"
          >
            Thomas Dahlstrøm Nielsen (CC BY 4.0)
          </a>
        </div>
      </section>

      {/* ON-PAGE NAVIGATION BAR (STICKY BELOW SITE HEADER) */}
      <nav
        aria-label={isNl ? 'Paginanavigatie' : 'Seitennavigation'}
        style={{ top: `${stickyTopOffset}px` }}
        className="sticky z-40 w-full bg-white/95 dark:bg-[#161B18]/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 shadow-xs"
      >
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 flex items-center overflow-x-auto scrollbar-none">
          {[
            { id: 'skigebiete', href: '#skigebiete', label: isNl ? 'Skigebieden' : 'Skigebiete' },
            { id: 'skihuetten', href: '#skihuetten', label: isNl ? 'Skihutten' : 'Skihütten' },
            { id: 'ticketpreise', href: '#ticketpreise', label: isNl ? 'Skipasprijzen' : 'Ticketpreise' },
            { id: 'flutlicht', href: '#flutlicht', label: isNl ? 'Avondskiën' : 'Flutlichtfahren' },
            { id: 'pistenbericht', href: '#pistenbericht', label: isNl ? 'Pistebericht & Webcams' : 'Schneebericht & Webcams' },
            { id: 'kids-on-ski', href: '#kids-on-ski', label: 'Kids on Ski' },
            { id: 'umfragen', href: '#umfragen', label: isNl ? 'Pisten-poll' : 'Pisten-Umfrage' },
            { id: 'community-ugc', href: '#community-ugc', label: isNl ? 'Tips & Reviews' : 'Tipps & Bewertungen' },
            { id: 'faq', href: '#faq', label: 'FAQ' },
          ].map((item, idx) => {
            const isActive = activeSection === item.id;
            return (
              <React.Fragment key={item.href}>
                {idx > 0 && (
                  <span className="h-4 w-px bg-gray-200 dark:bg-gray-700 shrink-0" aria-hidden="true" />
                )}
                <a
                  href={item.href}
                  onClick={() => setActiveSection(item.id)}
                  className={`px-3.5 first:pl-0 py-3.5 text-xs sm:text-sm whitespace-nowrap transition-colors no-underline border-b-2 ${
                    isActive
                      ? 'font-bold text-[#0F4C2E] dark:text-emerald-400 border-[#0F4C2E] dark:border-emerald-400'
                      : 'font-semibold text-gray-700 dark:text-gray-300 hover:text-[#0F4C2E] dark:hover:text-emerald-400 border-transparent hover:border-[#0F4C2E]/40'
                  }`}
                >
                  {item.label}
                </a>
              </React.Fragment>
            );
          })}
        </div>
      </nav>

      <main className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 py-8 sm:py-10 pb-24">

      {/* SECTION 3: SKIGEBIETE IM DETAIL */}
      <section id="skigebiete" className="mb-14 scroll-mt-32">
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
      <section id="skihuetten" className="mb-14 scroll-mt-32">
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

      {/* SECTION 1: TICKETPREISE SAISON 2026/27 (OFFIZIELL) */}
      <section id="ticketpreise" className="mb-14 scroll-mt-32">
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
      <section id="flutlicht" className="mb-14 scroll-mt-32">
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

      {/* SECTION 9: LIVE WEBCAMS & SCHNEEBERICHT BANNER */}
      <section id="pistenbericht" className="mb-14 scroll-mt-32">
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

      {/* SECTION: KIDS ON SKI (KOSTENLOSER SKIURLAUB FÜR KINDER 3-5 JAHRE) */}
      <section id="kids-on-ski" className="mb-12 scroll-mt-32">
        <div className="bg-white dark:bg-[#1E2420] rounded-2xl border border-gray-200 dark:border-gray-800 p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-sky-700 dark:text-sky-400 mb-1.5">
                <Snowflake className="w-4 h-4" />
                <span>Winterberg Touristik und Wirtschaft GmbH</span>
              </div>
              <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">
                {isNl
                  ? 'Kids on Ski: Gratis skivakantie voor kinderen (3–5 jaar)'
                  : 'Kids on Ski: Kostenloser Skiurlaub für Kinder (3–5 Jahre)'}
              </h2>
            </div>
            <a
              href={isNl ? '/nl/themas/skien-in-winterberg/kids-on-ski' : '/themen/skifahren-in-winterberg/kids-on-ski'}
              onClick={(e) => {
                if (onNavigateKidsOnSki) {
                  e.preventDefault();
                  onNavigateKidsOnSki();
                }
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold transition-colors shrink-0 self-start md:self-auto"
            >
              <span>{isNl ? 'Alle feiten, data & partners bekijken' : 'Alle Fakten, Zeiträume & Partner ansehen'}</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            {isNl
              ? 'Via het programma „Kids on Ski“ van de Winterberg Touristik und Wirtschaft GmbH kunnen niet-leerplichtige kinderen van 3 tot 5 jaar zonder ski-ervaring in geselecteerde actieweken kosteloos leren skiën. Inbegrepen zijn 5 overnachtingen op de kamer van de ouders (bij partnerbedrijven), 4× halve-dag-skiles, 4 dagen skiverhuur en een 4-daagse skipas.'
              : 'Über das Programm „Kids on Ski“ der Winterberg Touristik und Wirtschaft GmbH erhalten nicht schulpflichtige Kinder im Alter von 3 bis 5 Jahren ohne Vorkenntnisse in festgelegten Aktionswochen einen kostenlosen Einstieg in den Skisport. Enthalten sind 5 Übernachtungen im Zimmer der Eltern (bei Partnerbetrieben), 4 × Halbtagesskikurs, 4 Tage Skiverleih sowie ein 4-Tages-Skipass.'}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs sm:text-sm text-gray-600 dark:text-gray-300">
            <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
              <strong className="block text-gray-900 dark:text-white mb-0.5">{isNl ? 'Doelgroep' : 'Zielgruppe'}</strong>
              {isNl ? 'Kinderen 3–5 jaar (voorkennis niet vereist)' : 'Kinder 3–5 Jahre (Vorkenntnisse nicht notwendig)'}
            </div>
            <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
              <strong className="block text-gray-900 dark:text-white mb-0.5">{isNl ? 'Inbegrepen' : 'Leistungen'}</strong>
              {isNl ? '5 nachten, 4× skiles, verhuur & skipas' : '5 Nächte, 4× Skikurs, Verleih & 4-Tage-Skipass'}
            </div>
            <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
              <strong className="block text-gray-900 dark:text-white mb-0.5">{isNl ? 'Aanbieder & info' : 'Anbieter & Infos'}</strong>
              <div className="flex flex-wrap gap-x-3 gap-y-1">
                <a
                  href="https://www.winterberg.de/aktivitaeten-erlebnisse/winter/kids-on-ski/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sky-700 dark:text-sky-400 hover:underline inline-flex items-center gap-1"
                >
                  winterberg.de
                  <ExternalLink className="w-3 h-3" />
                </a>
                <a
                  href="https://kids-on-ski.com/de/skigebiet/winterberg/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sky-700 dark:text-sky-400 hover:underline inline-flex items-center gap-1"
                >
                  kids-on-ski.com
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: INTERAKTIVE UMFRAGE: LIEBLINGSPISTE */}
      <section id="umfragen" className="mb-14 scroll-mt-32">
        <div className="mb-6">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#0284C7] dark:text-sky-400 mb-2">
            <Vote className="w-4 h-4" />
            <span>{isNl ? 'Community Poll' : 'Winterberg Pisten-Umfrage'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
            {isNl ? 'Welke piste is jouw absolute favoriet in Winterberg?' : 'Welches ist deine liebste Piste in Winterberg?'}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 max-w-2xl">
            {isNl
              ? 'Kies links jouw favoriete afdaling. Aan de rechterkant zie je direct het live balkendiagram met de actuele tussenstand van de community.'
              : 'Wähle links deine persönliche Lieblingsabfahrt. Auf der rechten Seite siehst du in Echtzeit das Balkendiagramm mit den aktuellen Stimmen.'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
          {/* LINKSPARTE: PISTE AUSWÄHLEN */}
          <div className="lg:col-span-6 bg-white dark:bg-[#1E2621] rounded-3xl p-5 sm:p-7 border border-black/5 dark:border-white/10 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="px-3 py-1 bg-sky-100 dark:bg-sky-950/70 text-sky-800 dark:text-sky-300 font-bold text-xs rounded-full">
                🎿 {isNl ? '1. Kies jouw favoriet' : '1. Piste auswählen'}
              </span>
              {userVotedPiste && (
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {isNl ? 'Stem geregistreerd' : 'Abgestimmt'}
                </span>
              )}
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
              {userVotedPiste 
                ? (isNl ? 'Jouw stem telt mee in het diagram. Je kunt je keuze hieronder aanpassen:' : 'Deine Stimme zählt im Diagramm. Du kannst deinen Favoriten hier anklicken:')
                : (isNl ? 'Klik op jouw favoriete piste om direct je stem uit te brengen:' : 'Klicke auf deine Lieblingspiste, um direkt abzustimmen:')}
            </p>

            <div className="space-y-2.5">
              {pistePoll.map((opt) => {
                const isSelected = userVotedPiste === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleVotePiste(opt.id)}
                    className={`w-full text-left rounded-2xl p-3.5 transition-all cursor-pointer border flex items-start gap-3 ${
                      isSelected
                        ? 'border-[#0284C7] bg-sky-50/70 dark:bg-sky-950/30 ring-2 ring-[#0284C7]/20 shadow-xs'
                        : 'border-gray-200 dark:border-gray-800 hover:border-[#0284C7] hover:bg-gray-50 dark:hover:bg-[#151B17] bg-white dark:bg-transparent'
                    }`}
                  >
                    {/* Radio indicator */}
                    <div className={`w-5 h-5 rounded-full shrink-0 mt-0.5 border flex items-center justify-center transition-colors ${
                      isSelected 
                        ? 'border-[#0284C7] bg-[#0284C7] text-white' 
                        : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800'
                    }`}>
                      {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className={`font-bold text-sm ${isSelected ? 'text-[#0284C7] dark:text-sky-400' : 'text-gray-900 dark:text-white'}`}>
                          {isNl ? opt.name_nl : opt.name}
                        </span>
                        {isSelected && (
                          <span className="text-[10px] font-bold bg-[#0284C7] text-white px-2 py-0.5 rounded-full shrink-0">
                            ✓ {isNl ? 'Jouw keuze' : 'Deine Wahl'}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">
                        {isNl ? opt.description_nl : opt.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800/80 text-[11px] text-gray-400 flex items-center justify-between">
              <span>🔒 {isNl ? 'Echte stemmen zonder manipulatie' : 'Echte Stimmen ohne Manipulation'}</span>
              <span>1 {isNl ? 'stem per bezoeker' : 'Stimme pro Besucher'}</span>
            </div>
          </div>

          {/* RECHTSPARTE: BALKENDIAGRAMM (NACH RECHTS GEHEND) */}
          <div className="lg:col-span-6 bg-white dark:bg-[#1E2621] rounded-3xl p-5 sm:p-7 border border-black/5 dark:border-white/10 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 font-bold text-xs rounded-full">
                  📊 {isNl ? '2. Live Balkendiagram' : '2. Balkendiagramm'}
                </span>
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                  {totalPisteVotes} {totalPisteVotes === 1 ? (isNl ? 'Stem' : 'Stimme') : (isNl ? 'Stimmen abgegeben' : 'Stimmen abgegeben')}
                </span>
              </div>

              <h3 className="text-xl font-black text-gray-900 dark:text-white mb-1.5">
                {isNl ? 'Huidige Tussenstand' : 'Aktuelles Abstimmungsergebnis'}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-5">
                {totalPisteVotes === 0
                  ? (isNl ? 'Nog geen stemmen. Kies links jouw favoriet om de eerste balk te vullen!' : 'Bisher noch keine Stimmen abgegeben. Wähle links deinen Favoriten, um den ersten Balken zu füllen!')
                  : (isNl ? 'Balken tonen het percentage van alle uitgebrachte stemmen:' : 'Die horizontalen Balken zeigen den prozentualen Anteil der Stimmen:')}
              </p>

              {/* HORIZONTALES BALKENDIAGRAMM (Bars extending to the right) */}
              <div className="space-y-4">
                {pistePoll.map((opt) => {
                  const pct = totalPisteVotes > 0 ? Math.round((opt.votes / totalPisteVotes) * 100) : 0;
                  const isSelected = userVotedPiste === opt.id;

                  return (
                    <div key={opt.id} className="space-y-1.5">
                      {/* Label row above bar */}
                      <div className="flex items-center justify-between text-xs gap-2">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span className={`font-bold truncate ${isSelected ? 'text-[#0284C7] dark:text-sky-400' : 'text-gray-800 dark:text-gray-200'}`}>
                            {isNl ? opt.name_nl : opt.name}
                          </span>
                          {isSelected && (
                            <span className="text-[10px] font-bold text-[#0284C7] dark:text-sky-400 shrink-0">
                              ({isNl ? 'Jouw keuze' : 'Deine Wahl'})
                            </span>
                          )}
                        </div>
                        <div className="shrink-0 text-right font-semibold text-gray-600 dark:text-gray-400">
                          <span className="font-extrabold text-gray-900 dark:text-white">{pct}%</span>
                          <span className="text-[11px] text-gray-400 ml-1.5">({opt.votes} {opt.votes === 1 ? (isNl ? 'stem' : 'Stimme') : (isNl ? 'stemmen' : 'Stimmen')})</span>
                        </div>
                      </div>

                      {/* Horizontal Bar Track */}
                      <div className="w-full h-3.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden p-0.5 relative">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ease-out ${
                            isSelected
                              ? 'bg-gradient-to-r from-sky-500 to-[#0284C7] shadow-xs'
                              : pct > 0
                                ? 'bg-gradient-to-r from-emerald-500 to-[#0F4C2E]'
                                : 'bg-transparent'
                          }`}
                          style={{ width: `${pct}%`, minWidth: pct > 0 ? '8px' : '0%' }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800 text-[11px] text-gray-400 text-center">
              💡 {isNl ? 'Het diagram wordt direct en in realtime bijgewerkt na elke stem.' : 'Das Balkendiagramm aktualisiert sich nach jedem Klick sofort in Echtzeit.'}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6: UGC - MEINUNGEN, REZENSIONEN & INSIDER-TIPPS */}
      <section id="community-ugc" className="mb-14 scroll-mt-32">
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
                ? 'Echte reviews en aanbevelingen van gasten. Geen verzonnen verhalen, maar authentieke community-tips.'
                : 'Echte Erfahrungsberichte und Pisten-Empfehlungen von Besuchern. Keine erfundenen Bewertungen, sondern authentische Community-Tipps.'}
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

        {/* Reviews Grid or Empty State */}
        {reviews.length === 0 ? (
          <div className="bg-white dark:bg-[#1E2621] rounded-3xl p-8 sm:p-12 border border-dashed border-gray-200 dark:border-gray-800 text-center max-w-2xl mx-auto shadow-xs">
            <div className="w-14 h-14 rounded-2xl bg-sky-50 dark:bg-sky-950/50 text-[#0284C7] flex items-center justify-center mx-auto mb-4 border border-sky-100 dark:border-sky-900">
              <MessageSquare className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              {isNl ? 'Nog geen beoordelingen aanwezig' : 'Noch keine Bewertungen vorhanden'}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 leading-relaxed max-w-md mx-auto">
              {isNl 
                ? 'We tonen uitsluitend echte inzendingen en verzinnen geen reviews. Heb je al ervaring op de pistes van Winterberg? Deel als eerste jouw echte indruk of insider-tip!'
                : 'Wir erfinden keine Bewertungen. Warst du schon auf den Pisten in Winterberg unterwegs? Teile als Erster deine echten Erfahrungen, Pisten-Empfehlungen oder Hütten-Tipps mit der Community!'}
            </p>
            <button
              type="button"
              onClick={() => setIsReviewModalOpen(true)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0F4C2E] hover:bg-[#14532D] text-white font-bold text-sm shadow-md transition-all cursor-pointer hover:-translate-y-0.5"
            >
              <MessageSquare className="w-4 h-4" />
              <span>{isNl ? 'Eerste beoordeling schrijven' : 'Erste Bewertung schreiben'}</span>
            </button>
          </div>
        ) : (
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
        )}
      </section>



      {/* SECTION 10: FAQ ACCORDION (SKI THEME) */}
      <section id="faq" className="mb-14 scroll-mt-32">
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
    </main>
    </div>
  );
};

export default SkiThemePage;
