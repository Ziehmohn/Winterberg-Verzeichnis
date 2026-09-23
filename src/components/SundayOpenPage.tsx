import React, { useState, useMemo } from 'react';
import { useTranslation } from '../i18n';
import { 
  Sparkles, 
  Clock, 
  MapPin, 
  Search, 
  ShoppingBag, 
  Utensils, 
  Coffee, 
  Compass, 
  HelpCircle,
  ExternalLink,
  ChevronRight,
  Sun
} from 'lucide-react';
import { Business, ThemeConfig } from '../types';
import { isSundayOpen, getSundayHoursText } from '../utils';
import { getBusinessPath } from '../utils/routes';
import BusinessCard from './BusinessCard';

interface SundayOpenPageProps {
  businesses: Business[];
  theme?: ThemeConfig;
  onSelectBusiness?: (bus: Business) => void;
  onBack?: () => void;
}

export const SundayOpenPage: React.FC<SundayOpenPageProps> = ({
  businesses,
  theme,
  onSelectBusiness,
  onBack,
}) => {
  const { t, lang } = useTranslation();
  const isNl = lang === 'nl';

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  React.useEffect(() => {
    const title = isNl
      ? 'Zondag Geopend in Winterberg | Winkels, Horeca & Bakkerijen'
      : 'Sonntags geöffnet in Winterberg | Geschäfte, Gastro & Bäcker';
    document.title = title;

    const desc = isNl
      ? 'Overzicht van alle winkels, bakkers en restaurants in Winterberg die op zondag geopend zijn dankzij de officiële Bäderregelung.'
      : 'Übersicht aller Geschäfte, Bäckereien, Skiverleiher und Gastronomien in Winterberg, die sonntags im Rahmen der Bäderregelung geöffnet haben.';
    
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', desc);
  }, [isNl]);

  // Filter businesses that have opening hours on Sunday
  const sundayBusinesses = useMemo(() => {
    return businesses.filter(b => isSundayOpen(b.openingHours));
  }, [businesses]);

  // Extract available categories from sundayBusinesses
  const availableCategories = useMemo(() => {
    const catCounts: Record<string, number> = {};
    sundayBusinesses.forEach(b => {
      const cat = b.category || 'Sonstiges';
      catCounts[cat] = (catCounts[cat] || 0) + 1;
    });
    return catCounts;
  }, [sundayBusinesses]);

  // Extract available districts
  const availableDistricts = useMemo(() => {
    const districts = new Set<string>();
    sundayBusinesses.forEach(b => {
      if (b.district) districts.add(b.district);
    });
    return Array.from(districts).sort();
  }, [sundayBusinesses]);

  // Filtered result
  const filteredBusinesses = useMemo(() => {
    return sundayBusinesses.filter(b => {
      if (selectedCategory !== 'all' && b.category !== selectedCategory) return false;
      if (selectedDistrict !== 'all' && b.district !== selectedDistrict) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = b.name.toLowerCase().includes(q);
        const matchesSub = (b.subcategory || '').toLowerCase().includes(q);
        const matchesDesc = (b.description || '').toLowerCase().includes(q);
        if (!matchesName && !matchesSub && !matchesDesc) return false;
      }
      return true;
    });
  }, [sundayBusinesses, selectedCategory, selectedDistrict, searchQuery]);

  return (
    <main className="flex-1 w-full max-w-[1180px] mx-auto px-4 sm:px-6 py-6 pb-20">
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
        <span className="font-semibold text-[#1B211D]">
          {isNl ? 'Zondag geopend' : 'Sonntags geöffnet'}
        </span>
      </nav>

      {/* Hero Banner */}
      <section className="relative rounded-2xl overflow-hidden shadow-lg mb-8 text-white bg-gradient-to-r from-[#0F4C2E] via-[#166534] to-[#14532D] p-6 sm:p-10">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-amber-300 mb-4">
            <Sun className="w-3.5 h-3.5" />
            {isNl ? 'Bäderregeling Winterberg' : 'Bäderregelung Winterberg (Kurort)'}
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-3">
            {isNl ? 'Op zondag geopend in Winterberg' : 'Sonntags geöffnet in Winterberg'}
          </h1>
          <p className="text-sm sm:text-base text-white/90 leading-relaxed">
            {isNl
              ? 'Winkelen, lekker ontbijten of skispullen huren op zondag? Dankzij de officiële heilklimatische kuuroord-status mogen veel zaken in Winterberg ook op zon- en feestdagen de deuren openen.'
              : 'Einkaufen, frische Brötchen holen oder die Skiausrüstung leihen? Als anerkannter heilklimatischer Kurort profitieren viele Winterberger Händler, Bäcker und Betriebe von der Bäderverordnung NRW.'}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <div className="bg-white/10 backdrop-blur-sm border border-white/15 px-3.5 py-2 rounded-xl text-xs flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="font-bold text-base">{sundayBusinesses.length}</span>
              <span className="text-white/80">{isNl ? 'bedrijven geopend' : 'Betriebe sonntags geöffnet'}</span>
            </div>
          </div>
        </div>

        {/* Decorative graphic background */}
        <div className="absolute right-4 -bottom-10 opacity-10 pointer-events-none hidden md:block">
          <Sun className="w-80 h-80 text-white" />
        </div>
      </section>

      {/* Filter & Search Bar */}
      <div className="bg-white dark:bg-[#1E2621] rounded-xl p-4 sm:p-5 border border-black/5 dark:border-white/10 shadow-sm mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isNl ? 'Zoek op bedrijfsnaam of activiteit...' : 'Suche nach Betrieb, Bäckerei, Restaurant...'}
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 dark:bg-[#151B17] border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F4C2E]"
            />
          </div>

          {/* District Dropdown */}
          <div className="sm:w-64">
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full py-2.5 px-3 text-sm bg-gray-50 dark:bg-[#151B17] border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F4C2E] text-gray-700 dark:text-gray-200"
            >
              <option value="all">{isNl ? 'Alle stadsdelen (14 dorpen)' : 'Alle Ortsteile (14 Dörfer)'}</option>
              {availableDistricts.map(dist => (
                <option key={dist} value={dist}>{dist}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Pill Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              selectedCategory === 'all'
                ? 'bg-[#0F4C2E] text-white shadow-sm'
                : 'bg-gray-100 dark:bg-[#252E28] text-gray-700 dark:text-gray-300 hover:bg-gray-200'
            }`}
          >
            {isNl ? 'Alle categorieën' : 'Alle Kategorien'} ({sundayBusinesses.length})
          </button>
          {Object.entries(availableCategories).map(([cat, count]) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-[#0F4C2E] text-white shadow-sm'
                  : 'bg-gray-100 dark:bg-[#252E28] text-gray-700 dark:text-gray-300 hover:bg-gray-200'
              }`}
            >
              {cat} ({count})
            </button>
          ))}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex justify-between items-center mb-5">
        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          {filteredBusinesses.length} {isNl ? 'zondag geopende bedrijven gevonden' : 'sonntags geöffnete Betriebe gefunden'}
        </p>
      </div>

      {/* Business Cards Grid */}
      {filteredBusinesses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredBusinesses.map(bus => {
            const sundayHours = getSundayHoursText(bus.openingHours);
            return (
              <div key={bus.id} className="flex flex-col h-full relative">
                {/* Special Sunday Opening Hours Badge on Top */}
                <div className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 px-3 py-1 rounded-md">
                  <Clock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>{isNl ? 'Zondag geopend:' : 'Sonntags geöffnet:'} {sundayHours}</span>
                </div>
                <BusinessCard
                  business={bus}
                  theme={theme}
                  onClick={() => onSelectBusiness ? onSelectBusiness(bus) : null}
                />
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-white dark:bg-[#1E2621] rounded-xl border border-dashed border-gray-300 dark:border-gray-700 p-8">
          <Clock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-gray-800 dark:text-gray-200 mb-1">
            {isNl ? 'Geen bedrijven gevonden' : 'Keine passenden Betriebe gefunden'}
          </h3>
          <p className="text-xs text-gray-500 max-w-md mx-auto mb-4">
            {isNl
              ? 'Probeer de zoekcriteria of het gekozen stadsdeel aan te passen.'
              : 'Versuche die Filter zurückzusetzen oder einen anderen Ortsteil auszuwählen.'}
          </p>
          <button
            type="button"
            onClick={() => { setSelectedCategory('all'); setSelectedDistrict('all'); setSearchQuery(''); }}
            className="px-4 py-2 bg-[#0F4C2E] text-white rounded-lg text-xs font-medium hover:bg-[#14532D]"
          >
            {isNl ? 'Alle filters wissen' : 'Filter zurücksetzen'}
          </button>
        </div>
      )}

      {/* SEO Explanatory Guide Box about Bäderregelung */}
      <section className="mt-14 bg-emerald-50/70 dark:bg-[#17231B] border border-emerald-100 dark:border-emerald-900/50 rounded-2xl p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-emerald-100 dark:bg-emerald-900/40 rounded-xl text-[#0F4C2E] dark:text-emerald-400 shrink-0">
            <HelpCircle className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#0F4C2E] dark:text-emerald-300 mb-2">
              {isNl
                ? 'Wat is de Bäderregeling in Winterberg?'
                : 'Hintergrund: Die Bäderverordnung & Sonntagsöffnung in Winterberg'}
            </h2>
            <div className="text-sm text-gray-700 dark:text-gray-300 space-y-2 leading-relaxed">
              <p>
                {isNl
                  ? 'In Duitsland zijn winkels op zondag doorgaans wettelijk gesloten. Omdat Winterberg officieel erkend is als heilklimatischer Kurort en drukbezocht wintersportcentrum, geldt hier een uitzondering: de zogeheten Bäderregelung van de deelstaat Noordrijn-Westfalen (NRW).'
                  : 'Grundsätzlich gilt in Deutschland das Sonn- und Feiertagsverkaufsverbot. Weil Winterberg jedoch als heilklimatischer Kurort und internationales Wintersportzentrum anerkannt ist, greift hier die nordrhein-westfälische Bäderverordnung.'}
              </p>
              <p>
                {isNl
                  ? 'Hierdoor mogen winkels met artikelen voor toeristen, sportkleding, souvenirs, levensmiddelen en bakkers op vaste zondagen in het seizoen de deuren openen. Horecagelegenheden en skiverhuurbedrijven zijn vanzelfsprekend regulier geopend.'
                  : 'Einzelhändler für Sportartikel, Bekleidung, Souvenirs und Reisebedarf sowie Lebensmittelanbieter dürfen an Sonntagen im Rahmen der festgelegten Kernzeiten öffnen. Gastronomiebetriebe und Skiverleiher haben regulär an Wochenenden Hochbetrieb.'}
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default SundayOpenPage;
