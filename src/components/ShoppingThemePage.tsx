import React, { useState, useMemo, useEffect } from 'react';
import { useTranslation } from '../i18n';
import { 
  ShoppingBag, 
  Sparkles, 
  MapPin, 
  Clock, 
  Calendar, 
  Download, 
  Tag, 
  ChevronRight, 
  ExternalLink, 
  Search, 
  Sun, 
  CheckCircle2, 
  Coffee, 
  Car, 
  HelpCircle,
  Gem,
  Footprints,
  Shirt,
  Compass,
  ArrowRight,
  Filter
} from 'lucide-react';
import { Business, ThemeConfig } from '../types';
import { getBusinessPath } from '../utils/routes';

interface ShoppingThemePageProps {
  businesses: Business[];
  theme?: ThemeConfig;
  onSelectBusiness?: (bus: Business) => void;
  onBack?: () => void;
  onNavigateCategory?: (category: string, subcategory?: string) => void;
}

// 2026 Sunday Openings Dataset (from official Winterberg Stadtmarketing calendar)
interface SundayOpeningDate {
  dateStr: string; // YYYY-MM-DD
  dayDisplay: string;
  monthDisplay: string;
  monthNum: number;
  year: number;
  eventName?: string;
  highlight?: boolean;
}

const SUNDAY_OPENINGS_2026: SundayOpeningDate[] = [
  // Januar
  { dateStr: '2026-01-11', dayDisplay: 'So. 11.01.2026', monthDisplay: 'Januar', monthNum: 1, year: 2026, eventName: 'Rennrodel Weltcup' },
  { dateStr: '2026-01-18', dayDisplay: 'So. 18.01.2026', monthDisplay: 'Januar', monthNum: 1, year: 2026, eventName: 'Junior Rennrodel Weltcup' },
  { dateStr: '2026-01-25', dayDisplay: 'So. 25.01.2026', monthDisplay: 'Januar', monthNum: 1, year: 2026, eventName: 'Wintersport-Saison' },
  // Februar
  { dateStr: '2026-02-01', dayDisplay: 'So. 01.02.2026', monthDisplay: 'Februar', monthNum: 2, year: 2026, eventName: 'Winterferien' },
  { dateStr: '2026-02-08', dayDisplay: 'So. 08.02.2026', monthDisplay: 'Februar', monthNum: 2, year: 2026, eventName: 'Skisaison Hochsauerland' },
  { dateStr: '2026-02-15', dayDisplay: 'So. 15.02.2026', monthDisplay: 'Februar', monthNum: 2, year: 2026, eventName: 'Karnevalswochenende' },
  { dateStr: '2026-02-22', dayDisplay: 'So. 22.02.2026', monthDisplay: 'Februar', monthNum: 2, year: 2026, eventName: 'Wintersport-Hauptsaison' },
  // März
  { dateStr: '2026-03-29', dayDisplay: 'So. 29.03.2026', monthDisplay: 'März', monthNum: 3, year: 2026, eventName: 'Frühjahrsauftakt' },
  // April
  { dateStr: '2026-04-19', dayDisplay: 'So. 19.04.2026', monthDisplay: 'April', monthNum: 4, year: 2026, eventName: 'Frühlings-Shopping' },
  { dateStr: '2026-04-26', dayDisplay: 'So. 26.04.2026', monthDisplay: 'April', monthNum: 4, year: 2026, eventName: 'Königstag (Koningsdag NL)' },
  // Mai
  { dateStr: '2026-05-03', dayDisplay: 'So. 03.05.2026', monthDisplay: 'Mai', monthNum: 5, year: 2026, eventName: 'Mai-Auftakt' },
  { dateStr: '2026-05-10', dayDisplay: 'So. 10.05.2026', monthDisplay: 'Mai', monthNum: 5, year: 2026, eventName: 'Stadterlebnis Winterberg', highlight: true },
  { dateStr: '2026-05-17', dayDisplay: 'So. 17.05.2026', monthDisplay: 'Mai', monthNum: 5, year: 2026, eventName: 'Himmelfahrt-Wochenende' },
  { dateStr: '2026-05-24', dayDisplay: 'So. 24.05.2026', monthDisplay: 'Mai', monthNum: 5, year: 2026, eventName: 'Pfingstsonntag', highlight: true },
  { dateStr: '2026-05-31', dayDisplay: 'So. 31.05.2026', monthDisplay: 'Mai', monthNum: 5, year: 2026, eventName: 'Sauerland Klassik' },
  // Juni
  { dateStr: '2026-06-07', dayDisplay: 'So. 07.06.2026', monthDisplay: 'Juni', monthNum: 6, year: 2026, eventName: 'Sommer-Shopping' },
  // August
  { dateStr: '2026-08-02', dayDisplay: 'So. 02.08.2026', monthDisplay: 'August', monthNum: 8, year: 2026, eventName: 'Sommerferien-Bummel' },
  { dateStr: '2026-08-09', dayDisplay: 'So. 09.08.2026', monthDisplay: 'August', monthNum: 8, year: 2026, eventName: 'Sommer im Sauerland' },
  { dateStr: '2026-08-16', dayDisplay: 'So. 16.08.2026', monthDisplay: 'August', monthNum: 8, year: 2026, eventName: 'Winterberger Kirmes', highlight: true },
  { dateStr: '2026-08-23', dayDisplay: 'So. 23.08.2026', monthDisplay: 'August', monthNum: 8, year: 2026, eventName: 'Maylen Sunshine Race' },
  { dateStr: '2026-08-30', dayDisplay: 'So. 30.08.2026', monthDisplay: 'August', monthNum: 8, year: 2026, eventName: 'Ferienausklang' },
  // September
  { dateStr: '2026-09-06', dayDisplay: 'So. 06.09.2026', monthDisplay: 'September', monthNum: 9, year: 2026, eventName: 'Sauerland Rundfahrt', highlight: true },
  { dateStr: '2026-09-13', dayDisplay: 'So. 13.09.2026', monthDisplay: 'September', monthNum: 9, year: 2026, eventName: 'Spätsommer-Bummel' },
  { dateStr: '2026-09-20', dayDisplay: 'So. 20.09.2026', monthDisplay: 'September', monthNum: 9, year: 2026, eventName: 'Herbstmode-Kollektionen' },
  { dateStr: '2026-09-27', dayDisplay: 'So. 27.09.2026', monthDisplay: 'September', monthNum: 9, year: 2026, eventName: 'Herbst-Auftakt' },
  // Oktober
  { dateStr: '2026-10-03', dayDisplay: 'Sa. 03.10.2026', monthDisplay: 'Oktober', monthNum: 10, year: 2026, eventName: 'Tag der Deutschen Einheit (Feiertag)', highlight: true },
  { dateStr: '2026-10-04', dayDisplay: 'So. 04.10.2026', monthDisplay: 'Oktober', monthNum: 10, year: 2026, eventName: 'Feiertagswochenende' },
  { dateStr: '2026-10-11', dayDisplay: 'So. 11.10.2026', monthDisplay: 'Oktober', monthNum: 10, year: 2026, eventName: 'Herbstferien NRW' },
  { dateStr: '2026-10-18', dayDisplay: 'So. 18.10.2026', monthDisplay: 'Oktober', monthNum: 10, year: 2026, eventName: 'Herbstferien NL' },
  { dateStr: '2026-10-25', dayDisplay: 'So. 25.10.2026', monthDisplay: 'Oktober', monthNum: 10, year: 2026, eventName: 'Goldener Oktober' },
  // Dezember
  { dateStr: '2026-12-20', dayDisplay: 'So. 20.12.2026', monthDisplay: 'Dezember', monthNum: 12, year: 2026, eventName: '4. Advent / Weihnachts-Shopping', highlight: true },
  { dateStr: '2026-12-26', dayDisplay: 'Sa. 26.12.2026', monthDisplay: 'Dezember', monthNum: 12, year: 2026, eventName: '2. Weihnachtstag (Feiertag)' },
  { dateStr: '2026-12-27', dayDisplay: 'So. 27.12.2026', monthDisplay: 'Dezember', monthNum: 12, year: 2026, eventName: 'Winterdorf & Jahresausklang', highlight: true },
];

export const ShoppingThemePage: React.FC<ShoppingThemePageProps> = ({
  businesses,
  theme,
  onSelectBusiness,
  onBack,
  onNavigateCategory,
}) => {
  const { t, lang } = useTranslation();
  const isNl = lang === 'nl';

  const [activeTab, setActiveTab] = useState<'all' | 'fashion' | 'shoes' | 'outdoor' | 'jewelry' | 'outlet'>('all');
  const [searchFilter, setSearchFilter] = useState('');
  const [calendarView, setCalendarView] = useState<'upcoming' | 'all'>('upcoming');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    const pageTitle = isNl
      ? 'Winkelen in Winterberg | Mode, Winkels, Outlet & Koopzondagen'
      : 'Shoppen in Winterberg | Geschäfte, Mode, Outlet & Verkaufsoffene Sonntage';
    document.title = pageTitle;

    const desc = isNl
      ? 'Ontdek winkelen in Winterberg: gezellig flaneren aan de Waltenberg, top modemerken, schoenen, outdoor kleding, juwelier en alle koopzondagen met PDF kalender.'
      : 'Einkaufen & Shoppen in Winterberg: Flaniermeile Am Waltenberg, Modehäuser, Schuhe, Sport & Outdoor, Juwelier, Bessmann Outlet und alle verkaufsoffenen Sonntage 2026 inkl. PDF-Download.';

    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', desc);

    // Schema.org FAQPage Structured Data
    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": isNl ? "Kan men op zondag winkelen in Winterberg?" : "Kann man in Winterberg sonntags shoppen?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": isNl
              ? "Ja, dankzij de officiële Bäderregeling (kuuroord-status) mogen veel winkels in Winterberg op wel 33 zon- en feestdagen in 2026 openen, meestal van 13:00 tot 18:00 uur."
              : "Ja, dank der Kurort-Bäderregelung (§ 10 LÖG NRW) öffnen viele Einzelhändler in Winterberg an bis zu 33 Sonn- und Feiertagen im Jahr 2026 ihre Türen, typischerweise von 13:00 bis 18:00 Uhr."
          }
        },
        {
          "@type": "Question",
          "name": isNl ? "Welke winkels zijn er in het centrum van Winterberg?" : "Welche Geschäfte gibt es in der Winterberger Innenstadt?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": isNl
              ? "In het centrum (Am Waltenberg en Hauptstraße) vind je modewinkels (Lütkemeier, Insider, Street Point, Modeorth), schoenenzaken (Faupel, Schuhhaus Winterberg), outdoorwinkels (Outdoor 842, Peter O. Sport), Juwelier Eiloff en Parfümerie Becker."
              : "Am Waltenberg und in der Hauptstraße finden Sie führende Modehäuser (Lütkemeier, Insider Fashion Store, Street Point, Modeorth), Schuhfachgeschäfte (Faupel Schöne Schuhe, Schuhhaus Winterberg), Sport- und Outdoorgeschäfte (Outdoor 842, Peter O. Sport Mode), Juwelier Eiloff sowie die Parfümerie Becker."
          }
        },
        {
          "@type": "Question",
          "name": isNl ? "Is er een outlet in Winterberg?" : "Gibt es in Winterberg ein Mode-Outlet?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": isNl
              ? "Ja, in het winkelcentrum Neue Mitte bevindt zich de grote Bessmann Mode & Sport Outlet met merkkleding en actieprijzen."
              : "Ja, im Einkaufszentrum Neue Mitte befindet sich das große Bessmann Mode & Sport Outlet mit Markenbekleidung, Trachten und Sportmode zu reduzierten Outlet-Preisen."
          }
        }
      ]
    };

    let scriptTag = document.getElementById('shopping-theme-schema') as HTMLScriptElement;
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = 'shopping-theme-schema';
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }
    scriptTag.text = JSON.stringify(faqSchema);

    return () => {
      const tag = document.getElementById('shopping-theme-schema');
      if (tag) tag.remove();
    };
  }, [isNl]);

  // Curated list of shopping businesses
  const shoppingBusinesses = useMemo(() => {
    return businesses.filter(b => {
      const matchCat = b.category === 'Einzelhandel' || b.category === 'Ski, Bike & Sport';
      const sub = (b.subcategory || '').toLowerCase();
      const name = b.name.toLowerCase();
      const addr = (b.address || '').toLowerCase();
      const desc = ((b.description || '') + ' ' + (b.extendedDescription || '')).toLowerCase();

      // Specifically filter to shopping & retail businesses
      const isFashion = sub.includes('bekleidung') || name.includes('mode') || desc.includes('modehaus') || name.includes('insider') || name.includes('street point') || name.includes('bessmann') || name.includes('leisse') || name.includes('orth');
      const isShoes = sub.includes('schuh') || name.includes('schuh') || name.includes('faupel');
      const isOutdoor = sub.includes('sport') || sub.includes('outdoor') || name.includes('outdoor') || name.includes('liftstation');
      const isJewelry = sub.includes('juwel') || name.includes('juwelier') || name.includes('eiloff') || name.includes('uhren');
      const isPerfumery = sub.includes('parfüm') || sub.includes('parfuem') || sub.includes('droger') || name.includes('becker') || name.includes('dm-');

      return matchCat && (isFashion || isShoes || isOutdoor || isJewelry || isPerfumery);
    });
  }, [businesses]);

  // Tab filtering
  const filteredBusinesses = useMemo(() => {
    return shoppingBusinesses.filter(b => {
      const name = b.name.toLowerCase();
      const sub = (b.subcategory || '').toLowerCase();
      const desc = ((b.description || '') + ' ' + (b.extendedDescription || '')).toLowerCase();

      // Category tab
      if (activeTab === 'fashion') {
        const isFashion = sub.includes('bekleidung') || name.includes('mode') || name.includes('insider') || name.includes('street point') || name.includes('bessmann') || name.includes('leisse') || name.includes('zeitlos') || name.includes('fritz');
        if (!isFashion) return false;
      } else if (activeTab === 'shoes') {
        const isShoes = sub.includes('schuh') || name.includes('schuh') || name.includes('faupel');
        if (!isShoes) return false;
      } else if (activeTab === 'outdoor') {
        const isOutdoor = sub.includes('sport & outdoor') || name.includes('outdoor') || name.includes('menke') || name.includes('liftstation') || name.includes('peter o');
        if (!isOutdoor) return false;
      } else if (activeTab === 'jewelry') {
        const isJewelry = sub.includes('juwel') || name.includes('juwelier') || name.includes('eiloff') || sub.includes('parfüm') || name.includes('becker') || sub.includes('droger');
        if (!isJewelry) return false;
      } else if (activeTab === 'outlet') {
        const isOutlet = name.includes('bessmann') || name.includes('center') || b.id === '104' || b.id === 'dm-drogerie-markt-winterberg' || b.id === 'nkd';
        if (!isOutlet) return false;
      }

      // Search query
      if (searchFilter.trim()) {
        const q = searchFilter.toLowerCase();
        const matchesName = name.includes(q);
        const matchesSub = sub.includes(q);
        const matchesDesc = desc.includes(q);
        const matchesAddr = (b.address || '').toLowerCase().includes(q);
        if (!matchesName && !matchesSub && !matchesDesc && !matchesAddr) return false;
      }

      return true;
    });
  }, [shoppingBusinesses, activeTab, searchFilter]);

  // Today's date logic for upcoming Sundays
  const todayStr = new Date().toISOString().split('T')[0];
  const upcomingSundays = useMemo(() => {
    return SUNDAY_OPENINGS_2026.filter(s => s.dateStr >= todayStr);
  }, [todayStr]);

  const displayedSundays = calendarView === 'upcoming' && upcomingSundays.length > 0 ? upcomingSundays : SUNDAY_OPENINGS_2026;
  const nextSunday = upcomingSundays.length > 0 ? upcomingSundays[0] : SUNDAY_OPENINGS_2026[0];

  const handleBusinessClick = (bus: Business) => {
    if (onSelectBusiness) {
      onSelectBusiness(bus);
    } else {
      window.history.pushState(null, '', getBusinessPath(bus, lang));
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  const handleBekleidungCategoryClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onNavigateCategory) {
      onNavigateCategory('Einzelhandel', 'Bekleidung');
    } else {
      window.history.pushState(null, '', isNl ? '/nl/detailhandel/kleding' : '/einzelhandel/bekleidung');
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  const faqs = [
    {
      q: isNl ? 'Kan men op zondag winkelen in Winterberg?' : 'Kann man in Winterberg sonntags shoppen?',
      a: isNl
        ? 'Jazeker! Als officieel erkend kuuroord (Bäderregelung NRW) mogen winkels in Winterberg op 33 zon- en feestdagen in 2026 hun deuren openen. De winkels zijn dan meestal geopend van 13:00 tot 18:00 uur.'
        : 'Ja, absolut! Als staatlich anerkannter heilklimatischer Kurort profitiert Winterberg von der nordrhein-westfälischen Bäderregelung (§ 10 LÖG NRW). Dadurch dürfen die Fachgeschäfte und Boutiquen an bis zu 33 Sonn- und Feiertagen im Jahr 2026 öffnen. Die Kernöffnungszeit liegt in der Regel zwischen 13:00 und 18:00 Uhr.'
    },
    {
      q: isNl ? 'Welke kledingwinkels en boetieks zijn er in Winterberg?' : 'Welche Modegeschäfte und Boutiquen gibt es in Winterberg?',
      a: isNl
        ? 'In het centrum langs de Waltenberg en de Hauptstraße vind je onder meer Modehaus Lütkemeier, Insider Fashion Store, Street Point, MODEORTH, Christian Leisse (herenmode), JEANS FRITZ, Zeitlos en het grote Bessmann Outlet in de Neue Mitte.'
        : 'In der Winterberger Innenstadt gibt es eine beachtliche Auswahl: Das traditionsreiche Modehaus Lütkemeier (hochwertige Damen- und Herrenmode), Insider Fashion Store (moderne Trends & Casuals), Street Point (junge Mode & Streetwear), MODEORTH, Herrenausstatter Christian Leisse, JEANS FRITZ, Zeitlos, das Winterberger Strumpfhaus sowie das große Bessmann Mode & Sport Outlet in der Neuen Mitte.'
    },
    {
      q: isNl ? 'Zijn supermarkten op zondag geopend?' : 'Haben auch Lebensmittel-Supermärkte sonntags geöffnet?',
      a: isNl
        ? 'Nee, reguliere supermarkten (zoals ALDI, LIDL, REWE, Edeka) zijn op zondag in de regel gesloten. Bakkers (zoals Bakkerij Isken of Sommer) en gezellige cafés hebben op zondagochtend wel verse broodjes en ontbijt.'
        : 'Nein, klassische Lebensmittelmärkte und Discounter (wie ALDI, LIDL, REWE oder E-Center) bleiben an Sonntagen geschlossen. Ausgenommen sind Bäckereien (z.B. Bäckerei Isken, Landbäckerei Sommer), die sonntags morgens frische Brötchen und Gebäck anbieten, sowie die zahlreichen Cafés und Restaurants.'
    },
    {
      q: isNl ? 'Is er een juwelier of parfumerie in Winterberg?' : 'Gibt es in Winterberg einen Juwelier und eine Parfümerie?',
      a: isNl
        ? 'Ja! Aan de Waltenberg 9 bevindt zich Juwelier Eiloff (ringen, sieraden, horloges en reparaties) en aan de Waltenberg 22 Parfümerie Becker voor kwaliteitsgeuren en verzorging.'
        : 'Ja! Am Waltenberg 9 befindet sich Juwelier Eiloff, das traditionsreiche Fachgeschäft für edlen Schmuck, Uhren, Trauringe und Reparaturen. Nur wenige Schritte weiter am Waltenberg 22 bietet die Parfümerie Becker eine exquisite Auswahl an Markendüften, Kosmetik und Beauty-Beratung.'
    },
    {
      q: isNl ? 'Waar kan men het beste parkeren om te winkelen?' : 'Wo parkt man am besten zum Einkaufen in Winterberg?',
      a: isNl
        ? 'Het beste parkeer je in de ondergrondse parkeergarage Oversum (Am Kurpark), op de centrale parkeerplaats Neue Mitte / Zentrum of langs de Waltenberg.'
        : 'Sehr zentral und bequem parken Sie in der Tiefgarage Oversum (Am Kurpark 6), auf dem Großparkplatz Zentrum / Neue Mitte (Untere Pforte / Neue Mitte) sowie entlang der Straße Am Waltenberg mit Parkschein.'
    },
    {
      q: isNl ? 'Waarom is winkelen in Winterberg zo gezellig?' : 'Was macht das Einkaufen in Winterberg besonders?',
      a: isNl
        ? 'Alles ligt op loopafstand dicht bij elkaar! De flaneerstraat Am Waltenberg en de autoluwe plekken bieden een levendige combinatie van boetieks, schoenenwinkels, terrasjes en uitzicht op de Sauerlandse bergen.'
        : 'Die kurzen Wege und das alpine Lebensgefühl! In Winterberg liegen exklusive Boutiquen, Outdoor-Ausrüster, Schuhgeschäfte, Juwelier und gemütliche Cafés direkt nebeneinander. Man kann entspannt flanieren, ohne lange Wege zurückzulegen – und im Sommer wie im Winter die Bergluft und Urlaubsstimmung genießen.'
    }
  ];

  return (
    <main className="flex-1 w-full max-w-[1180px] mx-auto px-4 sm:px-6 py-6 pb-20">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-1.5 text-xs text-[#5F6B63] mb-6 flex-wrap" aria-label="Breadcrumb">
        <button
          type="button"
          onClick={onBack}
          className="hover:text-[#0F4C2E] underline underline-offset-2 bg-transparent border-none p-0 cursor-pointer text-xs"
        >
          {isNl ? 'Home' : 'Startseite'}
        </button>
        <span>/</span>
        <span className="text-[#5F6B63]">{isNl ? 'Themapagina\'s' : 'Themenseiten'}</span>
        <span>/</span>
        <span className="font-semibold text-[#1B211D]">
          {isNl ? 'Winkelen in Winterberg' : 'Shoppen in Winterberg'}
        </span>
      </nav>

      {/* Hero Banner Section */}
      <section className="relative rounded-3xl overflow-hidden shadow-xl mb-10 text-white bg-gradient-to-br from-[#0B3B24] via-[#0F4C2E] to-[#176239] p-6 sm:p-12 border border-emerald-900/30">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md border border-white/20 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide text-amber-300 mb-4 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isNl ? 'Shopping Gids Sauerland' : 'Shopping Guide · Winterberg Sauerland'}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4 leading-tight">
            {isNl ? 'Winkelen in Winterberg' : 'Shoppen in Winterberg'}
            <span className="block text-xl sm:text-2xl font-medium text-emerald-200 mt-2">
              {isNl ? 'Boetieks, Modehuizen, Outdoor & Koopzondagen' : 'Modehäuser, Boutiquen, Outdoor & Verkaufsoffene Sonntage'}
            </span>
          </h1>

          <p className="text-sm sm:text-base text-white/90 leading-relaxed mb-6">
            {isNl
              ? 'Geniet van een levendig stadscentrum met korte afstanden! Aan de flaneerstraat Am Waltenberg en in de Hauptstraße vind je stijlvolle kleding voor elke leeftijd, bekende outdoor-merken, schoenenzaken, Juwelier Eiloff en het grote Bessmann Outlet. Dankzij de kuuroord-status shop je hier ook op maar liefst 33 zondagen per jaar!'
              : 'Winterberg begeistert mit einem lebendigen Zentrum und kurzen Wegen: Entlang der beliebten Einkaufsmeile Am Waltenberg und der Hauptstraße erwarten Sie renommierte Modehäuser, junge Trendmarken, erstklassige Outdoor-Spezialisten, Schuhgeschäfte, Juwelier Eiloff und das beliebte Bessmann Outlet. Als staatlich anerkannter Kurort öffnen die Geschäfte an bis zu 33 Sonntagen im Jahr!'}
          </p>

          {/* Quick Stats & Badges */}
          <div className="flex flex-wrap gap-2.5 sm:gap-3 pt-2">
            <a 
              href="#geschaefte"
              className="inline-flex items-center gap-2 bg-white text-[#0F4C2E] hover:bg-emerald-50 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-md hover:scale-[1.02]"
            >
              <ShoppingBag className="w-4 h-4 text-[#0F4C2E]" />
              {isNl ? 'Winkels ontdekken' : 'Geschäfte durchstöbern'}
            </a>
            <a 
              href="#sonntagsoeffnungen"
              className="inline-flex items-center gap-2 bg-emerald-800/80 hover:bg-emerald-700/90 text-white border border-emerald-500/40 px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all backdrop-blur-sm"
            >
              <Sun className="w-4 h-4 text-amber-300" />
              {isNl ? 'Koopzondagen 2026' : 'Verkaufsoffene Sonntage 2026'}
            </a>
            <a 
              href="/downloads/verkaufsoffene-sonntage-winterberg-2026.pdf"
              download="Verkaufsoffene-Sonntage-Winterberg-2026.pdf"
              className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-stone-950 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-md hover:scale-[1.02]"
            >
              <Download className="w-4 h-4 text-stone-950" />
              {isNl ? 'PDF Kalender downloaden' : 'Sonntags-Kalender PDF'}
            </a>
          </div>
        </div>

        {/* Decorative background visual */}
        <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-10 pointer-events-none hidden md:flex items-center justify-center">
          <ShoppingBag className="w-72 h-72 text-white" />
        </div>
      </section>

      {/* Highlights Grid: Warum sich Shoppen in Winterberg lohnt */}
      <section className="mb-12">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="text-xs uppercase font-bold text-[#0F4C2E] tracking-wider mb-1">
            {isNl ? 'Levendig centrum' : 'Das Einkaufs-Erlebnis im Sauerland'}
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1B211D]">
            {isNl ? 'Waarom winkelen in Winterberg zo bijzonder is' : 'Warum Shoppen in Winterberg begeistert'}
          </h2>
          <p className="text-sm text-[#5F6B63] mt-2">
            {isNl
              ? 'Van haute couture en bergsport tot outletkoopjes en ontspannen pauzes in het café.'
              : 'Flanieren, Anprobieren und Genießen – alles eng beisammen und ohne Großstadt-Hektik.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1: Kurze Wege & Flaniermeile */}
          <div className="bg-white dark:bg-[#1E2621] p-6 rounded-2xl border border-black/5 dark:border-white/10 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-[#0F4C2E] dark:text-emerald-400 flex items-center justify-center mb-4">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-[#1B211D] dark:text-white mb-2">
              {isNl ? 'Korte wegen & Flaneermijl' : 'Kurze Wege am Waltenberg'}
            </h3>
            <p className="text-sm text-[#5F6B63] dark:text-gray-300 leading-relaxed">
              {isNl
                ? 'De meeste winkels liggen dicht bij elkaar aan de Waltenberg en de Hauptstraße. Geen lange afstanden: je wandelt ontspannen van winkel naar winkel.'
                : 'Das Winterberger Zentrum besticht durch seine kompakte Struktur: Entlang der Straße Am Waltenberg und der Hauptstraße liegen Boutiquen, Fachgeschäfte und Cafés nur wenige Schritte auseinander.'}
            </p>
          </div>

          {/* Card 2: Kleidung für alle Generationen */}
          <div className="bg-white dark:bg-[#1E2621] p-6 rounded-2xl border border-black/5 dark:border-white/10 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 flex items-center justify-center mb-4">
              <Shirt className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-[#1B211D] dark:text-white mb-2">
              {isNl ? 'Mode voor elke leeftijd' : 'Mode für jede Zielgruppe'}
            </h3>
            <p className="text-sm text-[#5F6B63] dark:text-gray-300 leading-relaxed">
              {isNl
                ? 'Van trendy streetwear (Insider, Street Point) tot elegante dames- en herenmode (Lütkemeier, Modeorth, Christian Leisse) en het voordelige Bessmann Outlet.'
                : 'Ob jugendliche Streetwear (Insider Fashion, Street Point), anspruchsvolle Damen- und Herrenkollektionen (Modehaus Lütkemeier, Modeorth, Christian Leisse) oder Schnäppchen im Bessmann Outlet.'}
            </p>
          </div>

          {/* Card 3: Bäderregelung Sonntagsöffnung */}
          <div className="bg-white dark:bg-[#1E2621] p-6 rounded-2xl border border-black/5 dark:border-white/10 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 flex items-center justify-center mb-4">
              <Sun className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-[#1B211D] dark:text-white mb-2">
              {isNl ? '33 Koopzondagen per jaar' : '33 Verkaufsoffene Sonntage'}
            </h3>
            <p className="text-sm text-[#5F6B63] dark:text-gray-300 leading-relaxed">
              {isNl
                ? 'Dankzij de kuuroord-status openen winkels op wel 33 zon- en feestdagen tussen 13:00 en 18:00 uur. Ideaal te combineren met een weekendje weg!'
                : 'Dank der nordrhein-westfälischen Kurort-Bäderregelung öffnen die Geschäfte an bis zu 33 Sonn- und Feiertagen von 13:00 bis 18:00 Uhr. Perfekt für einen entspannten Wochenendausflug!'}
            </p>
          </div>
        </div>
      </section>

      {/* Prominenter Banner zur Hauptkategorie Bekleidung */}
      <section className="mb-12 rounded-2xl bg-gradient-to-r from-stone-900 to-stone-800 text-white p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400">
            <Tag className="w-3.5 h-3.5" />
            {isNl ? 'Branche Detailhandel' : 'Branchenverzeichnis Winterberg'}
          </div>
          <h3 className="text-xl sm:text-2xl font-bold">
            {isNl ? 'Alle kledingwinkels in het Verzeichnis bekijken' : 'Auf der Suche nach Bekleidungsgeschäften?'}
          </h3>
          <p className="text-sm text-stone-300 leading-relaxed">
            {isNl
              ? 'Bekijk alle geregistreerde modewinkels, boetieks en kledingzaken in Winterberg met openingstijden, adressen en contactgegevens.'
              : 'Entdecken Sie die vollständige Übersicht aller Fachgeschäfte für Damen-, Herren- und Kindermode in unserer Hauptkategorie Bekleidung.'}
          </p>
        </div>
        <a
          href={isNl ? '/nl/detailhandel/kleding' : '/einzelhandel/bekleidung'}
          onClick={handleBekleidungCategoryClick}
          className="whitespace-nowrap inline-flex items-center gap-2 bg-[#0F4C2E] hover:bg-[#166534] text-white font-bold px-6 py-3 rounded-xl transition-all shadow hover:shadow-lg text-sm"
        >
          <span>{isNl ? 'Naar categorie Kleding' : 'Kategorie Bekleidung öffnen'}</span>
          <ArrowRight className="w-4 h-4" />
        </a>
      </section>

      {/* Geschäfte-Finder & Interaktive Kacheln */}
      <section id="geschaefte" className="mb-14 scroll-mt-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <div className="text-xs uppercase font-bold text-[#0F4C2E] tracking-wider mb-1">
              {isNl ? 'Overzicht van de winkels' : 'Geschäfte & Boutiquen'}
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1B211D] dark:text-white">
              {isNl ? 'Winkels in Winterberg ontdekken' : 'Die beliebtesten Geschäfte im Überblick'}
            </h2>
            <p className="text-sm text-[#5F6B63] dark:text-gray-300 mt-1">
              {isNl
                ? 'Klik op een winkel om het volledige profiel met openingstijden en details te openen.'
                : 'Klicken Sie auf ein Geschäft, um das detaillierte Profil mit Öffnungszeiten und Kontaktdaten aufzurufen.'}
            </p>
          </div>

          {/* Quick Search inside Theme Page */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder={isNl ? 'Winkel of merk zoeken...' : 'Geschäft oder Marke suchen...'}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#1E2621] text-sm focus:outline-none focus:ring-2 focus:ring-[#0F4C2E]"
            />
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'all'
                ? 'bg-[#0F4C2E] text-white shadow-sm'
                : 'bg-white dark:bg-[#1E2621] text-gray-700 dark:text-gray-300 border border-black/5 hover:bg-gray-50'
            }`}
          >
            {isNl ? 'Alle winkels' : 'Alle Geschäfte'} ({shoppingBusinesses.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('fashion')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'fashion'
                ? 'bg-[#0F4C2E] text-white shadow-sm'
                : 'bg-white dark:bg-[#1E2621] text-gray-700 dark:text-gray-300 border border-black/5 hover:bg-gray-50'
            }`}
          >
            <Shirt className="w-3.5 h-3.5" />
            {isNl ? 'Mode & Kleding' : 'Mode & Bekleidung'}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('shoes')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'shoes'
                ? 'bg-[#0F4C2E] text-white shadow-sm'
                : 'bg-white dark:bg-[#1E2621] text-gray-700 dark:text-gray-300 border border-black/5 hover:bg-gray-50'
            }`}
          >
            <Footprints className="w-3.5 h-3.5" />
            {isNl ? 'Schoenen' : 'Schuhgeschäfte'}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('outdoor')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'outdoor'
                ? 'bg-[#0F4C2E] text-white shadow-sm'
                : 'bg-white dark:bg-[#1E2621] text-gray-700 dark:text-gray-300 border border-black/5 hover:bg-gray-50'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            {isNl ? 'Sport & Outdoor' : 'Sport & Outdoor'}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('jewelry')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'jewelry'
                ? 'bg-[#0F4C2E] text-white shadow-sm'
                : 'bg-white dark:bg-[#1E2621] text-gray-700 dark:text-gray-300 border border-black/5 hover:bg-gray-50'
            }`}
          >
            <Gem className="w-3.5 h-3.5" />
            {isNl ? 'Juwelier & Parfumerie' : 'Juweliere & Parfümerie'}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('outlet')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'outlet'
                ? 'bg-[#0F4C2E] text-white shadow-sm'
                : 'bg-white dark:bg-[#1E2621] text-gray-700 dark:text-gray-300 border border-black/5 hover:bg-gray-50'
            }`}
          >
            <Tag className="w-3.5 h-3.5" />
            {isNl ? 'Outlet & Center' : 'Outlet & Neue Mitte'}
          </button>
        </div>

        {/* Business Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredBusinesses.map((b) => {
            const isWaltenberg = (b.address || '').toLowerCase().includes('waltenberg');
            const isHauptstrasse = (b.address || '').toLowerCase().includes('hauptstraße');
            const isNeueMitte = (b.address || '').toLowerCase().includes('neue mitte') || (b.address || '').toLowerCase().includes('pforte');

            return (
              <div
                key={b.id}
                onClick={() => handleBusinessClick(b)}
                className="group bg-white dark:bg-[#1E2621] rounded-2xl border border-black/5 dark:border-white/10 p-5 shadow-sm hover:shadow-md hover:border-[#0F4C2E]/40 transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <span className="inline-block text-[11px] font-semibold text-[#0F4C2E] bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-md mb-1.5">
                        {b.subcategory || b.category}
                      </span>
                      <h3 className="font-bold text-base text-[#1B211D] dark:text-white group-hover:text-[#0F4C2E] transition-colors leading-snug">
                        {b.name}
                      </h3>
                    </div>

                    {b.logoUrl ? (
                      <img
                        src={b.logoUrl}
                        alt={b.name}
                        className="w-10 h-10 rounded-xl object-contain border border-black/5 p-1 bg-white shrink-0"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-xl bg-stone-100 text-[#0F4C2E] font-extrabold flex items-center justify-center text-xs shrink-0">
                        {b.imageFallback || b.name.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                  </div>

                  <p className="text-xs text-[#5F6B63] dark:text-gray-300 line-clamp-3 mb-4 leading-relaxed">
                    {b.description}
                  </p>

                  {/* Highlights & Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {isWaltenberg && (
                      <span className="text-[10.5px] bg-stone-100 text-stone-700 px-2 py-0.5 rounded-full flex items-center gap-1 font-medium">
                        <MapPin className="w-2.5 h-2.5 text-[#0F4C2E]" />
                        Am Waltenberg
                      </span>
                    )}
                    {isHauptstrasse && (
                      <span className="text-[10.5px] bg-stone-100 text-stone-700 px-2 py-0.5 rounded-full flex items-center gap-1 font-medium">
                        <MapPin className="w-2.5 h-2.5 text-[#0F4C2E]" />
                        Hauptstraße
                      </span>
                    )}
                    {isNeueMitte && (
                      <span className="text-[10.5px] bg-amber-50 text-amber-800 border border-amber-200/50 px-2 py-0.5 rounded-full flex items-center gap-1 font-medium">
                        <Tag className="w-2.5 h-2.5" />
                        Neue Mitte
                      </span>
                    )}
                    {b.id === '104' && (
                      <span className="text-[10.5px] bg-rose-50 text-rose-700 border border-rose-200/50 px-2 py-0.5 rounded-full font-bold">
                        Outlet-Preise
                      </span>
                    )}
                    {b.id === 'juwelier-eiloff-winterberg' && (
                      <span className="text-[10.5px] bg-purple-50 text-purple-700 border border-purple-200/50 px-2 py-0.5 rounded-full font-medium">
                        Trauringe & Uhren
                      </span>
                    )}
                    {b.id === 'parfuemerie-becker-winterberg' && (
                      <span className="text-[10.5px] bg-pink-50 text-pink-700 border border-pink-200/50 px-2 py-0.5 rounded-full font-medium">
                        Düfte & Kosmetik
                      </span>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-black/5 dark:border-white/5 flex items-center justify-between text-xs text-[#5F6B63]">
                  <span className="truncate max-w-[190px]">{b.address}</span>
                  <span className="font-semibold text-[#0F4C2E] flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                    {isNl ? 'Profiel' : 'Profil'} <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {filteredBusinesses.length === 0 && (
          <div className="bg-white dark:bg-[#1E2621] rounded-2xl p-10 text-center border border-black/5">
            <ShoppingBag className="w-10 h-10 text-gray-400 mx-auto mb-3" />
            <p className="font-semibold text-gray-700 dark:text-gray-300">
              {isNl ? 'Geen winkels gevonden voor deze zoekopdracht' : 'Keine Geschäfte für diese Auswahl gefunden'}
            </p>
            <button
              onClick={() => { setActiveTab('all'); setSearchFilter(''); }}
              className="mt-3 text-xs font-bold text-[#0F4C2E] hover:underline"
            >
              {isNl ? 'Filters wissen' : 'Filter zurücksetzen'}
            </button>
          </div>
        )}
      </section>

      {/* Verkaufsoffene Sonntage 2026 Sektion mit offiziellem PDF-Download */}
      <section id="sonntagsoeffnungen" className="mb-14 scroll-mt-6">
        <div className="bg-gradient-to-br from-white to-emerald-50/50 dark:from-[#1E2621] dark:to-[#17201a] rounded-3xl p-6 sm:p-10 border border-emerald-900/10 shadow-lg">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8 pb-8 border-b border-emerald-900/10">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-1.5 bg-emerald-100 dark:bg-emerald-950 text-[#0F4C2E] dark:text-emerald-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
                <Sun className="w-3.5 h-3.5 text-amber-500" />
                {isNl ? 'Bäderregeling Winterberg 2026' : 'Kurort-Bäderregelung 2026'}
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1B211D] dark:text-white mb-2">
                {isNl ? 'Koopzondagen in Winterberg 2026' : 'Verkaufsoffene Sonntage in Winterberg 2026'}
              </h2>
              <p className="text-sm text-[#5F6B63] dark:text-gray-300 leading-relaxed">
                {isNl
                  ? 'In 2026 openen de winkels in het centrum op 33 officiële zon- en feestdagen hun deuren. Kernopeningstijd van de winkels: meestal van 13:00 tot 18:00 uur. Bakkers openen al \'s ochtends vroeg!'
                  : 'An 33 behördlich genehmigten Sonn- und Feiertagen dürfen die Winterberger Einzelhändler ihre Türen für Sie öffnen. Die Kernöffnungszeit des Einzelhandels liegt zwischen 13:00 und 18:00 Uhr. Genießen Sie stressfreies Sonntags-Shopping mit der ganzen Familie!'}
              </p>
            </div>

            {/* Big Download Button */}
            <div className="shrink-0 flex flex-col items-start lg:items-end gap-2">
              <a
                href="/downloads/verkaufsoffene-sonntage-winterberg-2026.pdf"
                download="Verkaufsoffene-Sonntage-Winterberg-2026.pdf"
                className="inline-flex items-center gap-3 bg-[#0F4C2E] hover:bg-[#166534] text-white font-bold px-6 py-3.5 rounded-2xl transition-all shadow-md hover:scale-[1.02] text-sm"
              >
                <Download className="w-5 h-5 text-amber-300" />
                <div className="text-left">
                  <div className="text-xs font-normal opacity-90">{isNl ? 'Officiële kalender' : 'Offizieller Kalender 2026'}</div>
                  <div className="font-bold">{isNl ? 'PDF herunterladen' : 'PDF herunterladen'}</div>
                </div>
              </a>
              <span className="text-[11px] text-[#5F6B63] italic">
                {isNl ? 'Drukklare versie (A4 formaat)' : 'Druckfertiges A4-Format · 33 Termine'}
              </span>
            </div>
          </div>

          {/* Next Sunday Callout Box */}
          {nextSunday && (
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 sm:p-5 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center shrink-0 font-bold">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs uppercase font-bold text-amber-800 dark:text-amber-400">
                    {isNl ? 'Volgende koopzondag' : 'Nächster verkaufsoffener Termin'}
                  </div>
                  <div className="text-base font-extrabold text-stone-900 dark:text-white">
                    {nextSunday.dayDisplay} {nextSunday.eventName ? `· ${nextSunday.eventName}` : ''}
                  </div>
                </div>
              </div>
              <div className="text-xs text-amber-900 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 px-3 py-1.5 rounded-xl border border-amber-300/40 shrink-0 font-medium">
                🕒 {isNl ? 'Winkels geopend ca. 13:00 – 18:00 uur' : 'Geschäfte geöffnet ca. 13:00 – 18:00 Uhr'}
              </div>
            </div>
          )}

          {/* Filter switcher: Upcoming vs All */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg text-[#1B211D] dark:text-white">
              {calendarView === 'upcoming' ? (isNl ? 'Aankomende koopzondagen' : 'Kommende Termine 2026') : (isNl ? 'Alle 33 koopzondagen 2026' : 'Alle 33 Sonntagsöffnungen 2026')}
            </h3>
            <div className="flex items-center bg-white dark:bg-stone-800 rounded-xl p-1 border border-black/5 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setCalendarView('upcoming')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  calendarView === 'upcoming' ? 'bg-[#0F4C2E] text-white' : 'text-[#5F6B63] hover:text-stone-900'
                }`}
              >
                {isNl ? 'Aankomend' : 'Kommende'}
              </button>
              <button
                type="button"
                onClick={() => setCalendarView('all')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  calendarView === 'all' ? 'bg-[#0F4C2E] text-white' : 'text-[#5F6B63] hover:text-stone-900'
                }`}
              >
                {isNl ? 'Heel 2026' : 'Gesamtes Jahr'} ({SUNDAY_OPENINGS_2026.length})
              </button>
            </div>
          </div>

          {/* Dates Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {displayedSundays.map((item, idx) => (
              <div
                key={idx}
                className={`p-3.5 rounded-xl border flex items-center justify-between transition-all ${
                  item.highlight
                    ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 shadow-sm'
                    : 'bg-white dark:bg-[#1E2621] border-black/5 dark:border-white/5'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                    item.highlight ? 'bg-[#0F4C2E] text-white' : 'bg-stone-100 text-stone-700'
                  }`}>
                    {item.dayDisplay.split('.')[0].replace(/[^0-9]/g, '') || item.monthNum}
                  </div>
                  <div>
                    <div className="font-bold text-xs text-stone-900 dark:text-white">
                      {item.dayDisplay}
                    </div>
                    {item.eventName && (
                      <div className="text-[11px] text-[#5F6B63] dark:text-gray-400 truncate max-w-[160px]">
                        {item.eventName}
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-[10px] font-semibold text-emerald-800 dark:text-emerald-400 bg-emerald-100/60 dark:bg-emerald-900/40 px-2 py-0.5 rounded">
                  13–18h
                </div>
              </div>
            ))}
          </div>

          {/* Small Note Box */}
          <p className="text-xs text-[#5F6B63] dark:text-gray-400 italic mt-6 bg-white/60 dark:bg-black/20 p-3 rounded-xl border border-black/5">
            <strong>{isNl ? 'Opmerking:' : 'Rechtlicher Hinweis:'}</strong> {isNl
              ? 'Openingstijden zijn onder voorbehoud van wijzigingen door de autoriteiten of de winkeliersvereniging. Supermarkten (zoals Aldi en Lidl) zijn op zondag gesloten.'
              : 'Verkaufsoffene Sonntage erfolgen im Rahmen der Kurort-Bäderregelung des Landes Nordrhein-Westfalen (§ 10 LÖG NRW). Änderungen durch Behörden oder teilnehmende Händler vorbehalten. Supermärkte (Aldi, Lidl, etc.) bleiben sonntags geschlossen.'}
          </p>
        </div>
      </section>

      {/* Tipps für den perfekten Shopping-Tag */}
      <section className="mb-14">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="text-xs uppercase font-bold text-[#0F4C2E] tracking-wider mb-1">
            {isNl ? 'Tips voor bezoekers' : 'Shopping-Tipps'}
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1B211D] dark:text-white">
            {isNl ? 'Tips voor een ontspannen dagje winkelen' : 'Tipps für Ihren perfekten Shopping-Tag'}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-[#1E2621] p-6 rounded-2xl border border-black/5 dark:border-white/10 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-[#0F4C2E] flex items-center justify-center mb-3">
              <Car className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base mb-2">{isNl ? 'Bequem parkeren' : 'Zentral parken'}</h3>
            <p className="text-xs text-[#5F6B63] leading-relaxed">
              {isNl
                ? 'Parkeer in de overdekte Tiefgarage Oversum of op de parkeerplaats Neue Mitte. Van daaruit loop je binnen 2 minuten de winkelstraat in.'
                : 'Nutzen Sie die Tiefgarage Oversum (Am Kurpark 6) oder den Parkplatz Neue Mitte / Zentrum. Beide liegen direkt an der Fußgängerzone und bieten kurze Wege.'}
            </p>
          </div>

          <div className="bg-white dark:bg-[#1E2621] p-6 rounded-2xl border border-black/5 dark:border-white/10 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-3">
              <Coffee className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base mb-2">{isNl ? 'Koffiepauze & Horeca' : 'Kaffeepause & Gastronomie'}</h3>
            <p className="text-xs text-[#5F6B63] leading-relaxed">
              {isNl
                ? 'Combineer winkelen met een gezellige cappuccino of lunch in Cafe Extrablatt, Eiscafe Cortina, Dorf Alm of een van de ambachtelijke bakkers.'
                : 'Gönnen Sie sich eine Pause im Cafe Extrablatt, bei Eiscafe Cortina, in der Dorf Alm oder genießen Sie frisch gebrühten Kaffee und Waffeln bei Bäckerei Isken.'}
            </p>
          </div>

          <div className="bg-white dark:bg-[#1E2621] p-6 rounded-2xl border border-black/5 dark:border-white/10 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-3">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base mb-2">{isNl ? 'Het hele jaar door' : 'Zu jeder Jahreszeit'}</h3>
            <p className="text-xs text-[#5F6B63] leading-relaxed">
              {isNl
                ? 'Of het nu hartje winter met sneeuw is of een zonnige zomerdag: de winkels in Winterberg hebben een sfeervol aanbod in elk seizoen.'
                : 'Ob im verschneiten Winter nach dem Skifahren oder im sonnigen Sommer: Die Geschäfte bieten zu jeder Jahreszeit aktuelle Kollektionen und alpin-sportliche Atmosphäre.'}
            </p>
          </div>
        </div>
      </section>

      {/* Shopping FAQ Accordion */}
      <section className="mb-14">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="text-xs uppercase font-bold text-[#0F4C2E] tracking-wider mb-1">
            {isNl ? 'Veelgestelde vragen' : 'Shopping FAQ'}
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1B211D] dark:text-white">
            {isNl ? 'Veelgestelde vragen over winkelen in Winterberg' : 'Häufige Fragen zum Shoppen in Winterberg'}
          </h2>
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={index}
                className="bg-white dark:bg-[#1E2621] rounded-2xl border border-black/5 dark:border-white/10 overflow-hidden shadow-sm"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full text-left p-5 flex items-center justify-between gap-4 font-bold text-stone-900 dark:text-white text-sm sm:text-base hover:text-[#0F4C2E] transition-colors"
                >
                  <span className="flex items-center gap-2.5">
                    <HelpCircle className="w-4 h-4 text-[#0F4C2E] shrink-0" />
                    {faq.q}
                  </span>
                  <ChevronRight className={`w-4 h-4 text-stone-400 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-[#5F6B63] dark:text-gray-300 leading-relaxed border-t border-black/5 dark:border-white/5">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Back to top or Home CTA */}
      <div className="text-center pt-6 border-t border-black/5 dark:border-white/10">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-bold text-[#0F4C2E] hover:underline"
        >
          ← {isNl ? 'Terug naar het overzicht' : 'Zurück zur Startseite des Winterberg Verzeichnisses'}
        </button>
      </div>
    </main>
  );
};

export default ShoppingThemePage;
