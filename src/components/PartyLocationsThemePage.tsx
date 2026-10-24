import React, { useState, useMemo, useEffect } from 'react';
import { useTranslation } from '../i18n';
import { 
  Sparkles, 
  MapPin, 
  Search, 
  Users, 
  PartyPopper, 
  Calendar, 
  Heart, 
  GlassWater, 
  Music, 
  Building2, 
  Mountain, 
  Flame, 
  CheckCircle2, 
  X, 
  ChevronRight,
  Filter,
  Cake,
  Briefcase,
  ExternalLink
} from 'lucide-react';
import { Business, ThemeConfig, DesignSettings } from '../types';
import BusinessCard from './BusinessCard';
import HeaderShapeDivider, { getEffectiveDivider } from './HeaderShapeDivider';
import { 
  PARTY_VENUES_MAP, 
  PARTY_VENUES_DATA, 
  PartyLocationType, 
  isPartyLocation 
} from '../utils/partyLocations';

interface PartyLocationsThemePageProps {
  businesses: Business[];
  theme?: ThemeConfig;
  designSettings?: DesignSettings;
  onSelectBusiness?: (bus: Business) => void;
  onBack?: () => void;
  onNavigateContact?: () => void;
}

export const PartyLocationsThemePage: React.FC<PartyLocationsThemePageProps> = ({
  businesses,
  theme,
  designSettings,
  onSelectBusiness,
  onBack,
  onNavigateContact
}) => {
  const { t, lang } = useTranslation();
  const isNl = lang === 'nl';

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedOccasion, setSelectedOccasion] = useState<string>('all');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');

  // SEO setup
  useEffect(() => {
    const pageTitle = isNl
      ? 'Partylocaties & Feestzalen huren in Winterberg | Bruiloft, Verjaardag & Bedrijfsuitje'
      : 'Partylocations mieten in Winterberg | Feiern, Hochzeit, Geburtstag & Firmenevent';
    document.title = pageTitle;

    const pageDesc = isNl
      ? 'Ontdek de mooiste partylocaties en feestzalen in Winterberg en Sauerland: berghutten, historische schuren, feestzalen en clubs te huur voor bruiloften, verjaardagen en bedrijfsevenementen.'
      : 'Entdecke die schönsten Partylocations, Berghütten, Festsäle und Clubs in Winterberg zum Mieten für Hochzeiten, Geburtstage, Firmenfeiern, Weihnachtsfeiern und Vereinsfeste.';

    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', pageDesc);

    // Schema.org structured data
    let scriptTag = document.getElementById('party-theme-schema') as HTMLScriptElement;
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.type = 'application/ld+json';
      scriptTag.id = 'party-theme-schema';
      document.head.appendChild(scriptTag);
    }
    scriptTag.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      'name': pageTitle,
      'description': pageDesc,
      'breadcrumb': {
        '@type': 'BreadcrumbList',
        'itemListElement': [
          { '@type': 'ListItem', 'position': 1, 'name': isNl ? 'Home' : 'Startseite', 'item': 'https://www.winterberg-verzeichnis.de' },
          { '@type': 'ListItem', 'position': 2, 'name': isNl ? 'Thema\'s' : 'Themen', 'item': 'https://www.winterberg-verzeichnis.de/themen' },
          { '@type': 'ListItem', 'position': 3, 'name': isNl ? 'Feestlocaties' : 'Partylocations', 'item': 'https://www.winterberg-verzeichnis.de/themen/partylocations-in-winterberg' }
        ]
      }
    });

    return () => {
      const tag = document.getElementById('party-theme-schema');
      if (tag) tag.remove();
    };
  }, [isNl]);

  // Extract all party businesses
  const partyBusinesses = useMemo(() => {
    return businesses.filter(b => isPartyLocation(b));
  }, [businesses]);

  // Available districts
  const availableDistricts = useMemo(() => {
    const set = new Set<string>();
    partyBusinesses.forEach(b => {
      const d = b.district || (b.address?.includes('Winterberg-') ? b.address.split('Winterberg-')[1]?.split(' ')[0] : 'Winterberg');
      if (d) set.add(d);
    });
    return Array.from(set).sort();
  }, [partyBusinesses]);

  // Location type definitions
  const typeOptions: { id: string; labelDe: string; labelNl: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'all', labelDe: 'Alle Locations', labelNl: 'Alle locaties', icon: Building2 },
    { id: 'huette', labelDe: 'Berghütten & Almen', labelNl: 'Berghutten & Almen', icon: Mountain },
    { id: 'saal', labelDe: 'Festsäle & Schützenhallen', labelNl: 'Feestzalen & Schuttershallen', icon: Building2 },
    { id: 'club', labelDe: 'Clubs, Pubs & Bars', labelNl: 'Clubs & Bars', icon: Music },
    { id: 'scheune', labelDe: 'Historische Scheunen', labelNl: 'Historische Schuren', icon: Flame },
    { id: 'hotel', labelDe: 'Hotels & Eventresorts', labelNl: 'Hotels & Resorts', icon: Sparkles },
    { id: 'freizeit', labelDe: 'Party & Freizeit', labelNl: 'Feest & Vrije tijd', icon: PartyPopper }
  ];

  // Occasion definitions
  const occasionOptions = [
    { id: 'all', labelDe: 'Alle Anlässe', labelNl: 'Alle gelegenheden' },
    { id: 'hochzeit', labelDe: '💍 Hochzeiten', labelNl: '💍 Bruiloften' },
    { id: 'geburtstag', labelDe: '🎂 Geburtstage', labelNl: '🎂 Verjaardagen' },
    { id: 'firmenfeier', labelDe: '🏢 Firmenfeiern & Jubiläen', labelNl: '🏢 Bedrijfsuitjes' },
    { id: 'weihnachtsfeier', labelDe: '🎄 Weihnachtsfeiern', labelNl: '🎄 Kerstborrels' },
    { id: 'huette', labelDe: '🏔️ Hüttengaudi & Feiern am Berg', labelNl: '🏔️ Hutfeesten' }
  ];

  // Counts per type
  const typeCounts = useMemo(() => {
    const counts: Record<string, number> = { all: partyBusinesses.length };
    partyBusinesses.forEach(b => {
      const meta = PARTY_VENUES_MAP[b.id];
      const t = meta?.locationType || (b.subcategory === 'Skihütten' ? 'huette' : 'saal');
      counts[t] = (counts[t] || 0) + 1;
    });
    return counts;
  }, [partyBusinesses]);

  // Filtered businesses
  const filteredBusinesses = useMemo(() => {
    return partyBusinesses.filter(b => {
      const meta = PARTY_VENUES_MAP[b.id];
      const venueType = meta?.locationType || (b.subcategory === 'Skihütten' ? 'huette' : 'saal');

      // 1. Type filter
      if (selectedType !== 'all' && venueType !== selectedType) {
        return false;
      }

      // 2. Occasion filter
      if (selectedOccasion !== 'all') {
        const occasions = (meta ? meta.occasionsDe.concat(meta.occasionsNl) : []).map(o => o.toLowerCase());
        const desc = (b.description || '').toLowerCase();
        const searchWord = selectedOccasion.toLowerCase();
        const matchesOccasion = occasions.some(o => o.includes(searchWord)) || desc.includes(searchWord);
        if (!matchesOccasion) {
          // If searching for huette, also match locationType huette
          if (selectedOccasion === 'huette' && venueType === 'huette') {
            // allow
          } else {
            return false;
          }
        }
      }

      // 3. District filter
      if (selectedDistrict !== 'all') {
        const bDistrict = b.district || (b.address?.includes('Winterberg-') ? b.address.split('Winterberg-')[1]?.split(' ')[0] : 'Winterberg');
        if (bDistrict !== selectedDistrict) {
          return false;
        }
      }

      // 4. Text Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = b.name.toLowerCase().includes(q);
        const matchDesc = (b.description || '').toLowerCase().includes(q);
        const matchAddress = (b.address || '').toLowerCase().includes(q);
        const matchDistrict = (b.district || '').toLowerCase().includes(q);
        const matchMeta = meta
          ? (meta.occasionsDe.join(' ') + ' ' + meta.highlightsDe.join(' ') + ' ' + meta.locationTypeLabelDe).toLowerCase().includes(q)
          : false;

        if (!matchName && !matchDesc && !matchAddress && !matchDistrict && !matchMeta) {
          return false;
        }
      }

      return true;
    });
  }, [partyBusinesses, selectedType, selectedOccasion, selectedDistrict, searchQuery]);

  return (
    <div className="min-h-screen bg-[#FDFBF7] dark:bg-[#121614] text-[#1B211D] dark:text-[#EAE6DF]">
      
      {/* Hero Header mit fließendem Farbverlauf & atmosphärischem Partybild */}
      <section className="w-full bg-gradient-to-br from-[#0B3B24] via-[#0F4C2E] to-[#176239] text-white relative overflow-hidden">
        
        {/* Hero Background Image mit weichem horizontalen & vertikalen Verlauf */}
        <figure className="relative lg:absolute lg:right-0 lg:top-0 lg:bottom-0 w-full lg:w-[50%] xl:w-[48%] 2xl:w-[45%] h-56 sm:h-72 md:h-80 lg:h-full m-0 z-0 overflow-hidden pointer-events-none">
          <img
            src="/partylocations-winterberg-header.jpg"
            alt={isNl ? 'Feestlocaties huren in Winterberg' : 'Partylocations mieten in Winterberg: Urige Berghütten, Festsäle und Clubs'}
            width={1600}
            height={900}
            fetchPriority="high"
            decoding="async"
            className="w-full h-full object-cover hero-party-mask"
            style={{ objectPosition: 'center 40%' }}
          />
          <div className="absolute top-3 right-3 lg:top-4 lg:right-6 flex items-center gap-1.5 z-10 pointer-events-none">
            <span className="text-[10px] leading-none font-semibold text-white/90 bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-md border border-white/10 flex items-center gap-1 shadow-xs">
              <Sparkles className="w-2.5 h-2.5 text-amber-300" />
              <span>{isNl ? 'Feesten in Winterberg' : 'Feiern in Winterberg'}</span>
            </span>
          </div>
        </figure>

        {/* Content Container */}
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 pt-5 sm:pt-10 lg:pt-16 pb-16 sm:pb-20 lg:pb-28 relative z-10">
          <div className="max-w-2xl xl:max-w-3xl">
            
            {/* Breadcrumb Navigation */}
            <nav className="text-[12px] sm:text-[13px] text-white/75 mb-3 sm:mb-4 flex items-center gap-1.5 flex-wrap" aria-label="Breadcrumb">
              <button
                type="button"
                onClick={onBack}
                className="hover:text-white transition-colors bg-transparent border-none p-0 cursor-pointer text-[12px] sm:text-[13px] text-white/75"
              >
                {isNl ? 'Startpagina' : 'Startseite'}
              </button>
              <span>/</span>
              <span className="text-white/60">{isNl ? 'Thema\'s' : 'Themen'}</span>
              <span>/</span>
              <span className="font-semibold text-white">
                {isNl ? 'Feestlocaties' : 'Partylocations mieten'}
              </span>
            </nav>

            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md border border-white/20 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-amber-300 mb-4 shadow-sm">
              <PartyPopper className="w-3.5 h-3.5 text-amber-300" />
              <span>{isNl ? 'Feesten in het Sauerland • Locaties te huur' : 'Feiern im Sauerland • Locations zum Mieten'}</span>
            </div>

            {/* Headline */}
            <h1 className="font-display text-[28px] sm:text-[40px] md:text-[50px] font-extrabold m-0 mb-3 sm:mb-4 leading-[1.1] tracking-tight text-white drop-shadow-sm">
              {isNl ? 'Partylocaties & Feestzalen in Winterberg' : 'Partylocations in Winterberg mieten'}
            </h1>

            {/* Compact Intro Text */}
            <p className="text-sm sm:text-base md:text-[17px] text-white/90 leading-relaxed mb-6 sm:mb-8 max-w-2xl">
              {isNl
                ? 'Of het nu gaat om een sprookjesachtige bruiloft, een bijzondere verjaardag, een gezellig berghutfeest, een bedrijfsuitje of kerstborrel: ontdek de beste locaties in Winterberg en omliggende dorpen die je exclusief of gedeeltelijk kunt huren voor jouw eigen feest.'
                : 'Ob unvergessliche Traumhochzeit, runder Geburtstag, ausgelassene Hüttengaudi, Firmenjubiläum oder stimmungsvolle Weihnachtsfeier: Entdecke die schönsten Partylocations in Winterberg und den Sauerländer Bergdörfern, die du für dein ganz persönliches Event mieten kannst.'}
            </p>

            {/* Feature Highlights Chips */}
            <div className="flex flex-wrap gap-2 sm:gap-2.5">
              <div className="bg-white/10 hover:bg-white/15 transition-colors backdrop-blur-sm border border-white/15 px-3 py-1.5 rounded-xl text-xs sm:text-[13px] text-white/95 flex items-center gap-2">
                <span className="text-base">💍</span>
                <span className="font-medium">{isNl ? 'Bruiloften' : 'Traumhochzeiten'}</span>
              </div>
              <div className="bg-white/10 hover:bg-white/15 transition-colors backdrop-blur-sm border border-white/15 px-3 py-1.5 rounded-xl text-xs sm:text-[13px] text-white/95 flex items-center gap-2">
                <span className="text-base">🎂</span>
                <span className="font-medium">{isNl ? 'Verjaardagen' : 'Runde Geburtstage'}</span>
              </div>
              <div className="bg-white/10 hover:bg-white/15 transition-colors backdrop-blur-sm border border-white/15 px-3 py-1.5 rounded-xl text-xs sm:text-[13px] text-white/95 flex items-center gap-2">
                <span className="text-base">🏢</span>
                <span className="font-medium">{isNl ? 'Bedrijfsuitjes' : 'Firmen- & Weihnachtsfeiern'}</span>
              </div>
              <div className="bg-white/10 hover:bg-white/15 transition-colors backdrop-blur-sm border border-white/15 px-3 py-1.5 rounded-xl text-xs sm:text-[13px] text-white/95 flex items-center gap-2">
                <span className="text-base">🏔️</span>
                <span className="font-medium">{isNl ? 'Hutfeesten' : 'Urige Hüttengaudi'}</span>
              </div>
            </div>

          </div>
        </div>

        {/* Dynamic Shape Divider at Header Bottom */}
        <HeaderShapeDivider
          style={getEffectiveDivider('category', designSettings)}
          color="transparent"
          customDividers={designSettings?.customDividers}
        />
      </section>

      {/* Main Content Area */}
      <main className="max-w-[1240px] mx-auto px-4 sm:px-6 py-8 sm:py-12">
        
        {/* Filter- & Suchleiste (Sticky / Prominent) */}
        <section aria-label="Filter und Suche" className="bg-white dark:bg-[#1A221E] rounded-2xl border border-[#EDE8E0] dark:border-white/10 shadow-sm p-4 sm:p-6 mb-8 space-y-4">
          
          {/* Row 1: Suchfeld + Ortsteil Dropdown */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0F4C2E]/60 dark:text-emerald-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isNl ? 'Zoek op locatienaam, dorp of type feest...' : 'Suche nach Location, Ortsteil, Hütte oder Festsaal...'}
                className="w-full pl-10 pr-9 py-2.5 text-sm bg-[#FAF8F5] dark:bg-[#141A16] border border-[#E0D9CE] dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F4C2E] text-gray-900 dark:text-gray-100 placeholder:text-gray-400"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                  aria-label="Suche leeren"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Ortsteil Dropdown */}
            <div className="sm:w-64">
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="w-full py-2.5 px-3.5 text-sm bg-[#FAF8F5] dark:bg-[#141A16] border border-[#E0D9CE] dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F4C2E] text-gray-800 dark:text-gray-200 cursor-pointer"
                aria-label="Ortsteil filtern"
              >
                <option value="all">{isNl ? 'Alle stadsdelen (14 dorpen)' : 'Alle Ortsteile (14 Bergdörfer)'}</option>
                {availableDistricts.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 2: Location-Typ Tabs (Pills) */}
          <div className="border-t border-[#F0EBE1] dark:border-white/5 pt-3">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
              {typeOptions.map(opt => {
                const count = typeCounts[opt.id] || 0;
                const isSelected = selectedType === opt.id;
                const IconComponent = opt.icon;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setSelectedType(opt.id)}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-[13px] font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#0F4C2E] text-white shadow-sm ring-1 ring-[#0F4C2E]'
                        : 'bg-[#F2ECE1]/70 dark:bg-[#222C25] text-gray-700 dark:text-gray-300 hover:bg-[#EAE2D5] dark:hover:bg-[#2B372F]'
                    }`}
                  >
                    <IconComponent className={`w-3.5 h-3.5 ${isSelected ? 'text-amber-300' : 'text-[#0F4C2E] dark:text-emerald-400'}`} />
                    <span>{isNl ? opt.labelNl : opt.labelDe}</span>
                    <span className={`text-[11px] px-1.5 py-0.5 rounded-full ${isSelected ? 'bg-white/20 text-white' : 'bg-black/5 dark:bg-white/10 text-gray-500 dark:text-gray-400'}`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Row 3: Anlass-Schnellfilter Chips */}
          <div className="flex items-center gap-1.5 flex-wrap pt-1 text-xs text-gray-600 dark:text-gray-400">
            <span className="font-semibold text-gray-700 dark:text-gray-300 mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3 text-[#0F4C2E]" />
              {isNl ? 'Gelegenheid:' : 'Anlass:'}
            </span>
            {occasionOptions.map(occ => {
              const active = selectedOccasion === occ.id;
              return (
                <button
                  key={occ.id}
                  type="button"
                  onClick={() => setSelectedOccasion(occ.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    active
                      ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-700 font-bold'
                      : 'bg-white dark:bg-[#1D2520] text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-[#252E28]'
                  }`}
                >
                  {isNl ? occ.labelNl : occ.labelDe}
                </button>
              );
            })}

            {/* Active Filters Reset */}
            {(selectedType !== 'all' || selectedOccasion !== 'all' || selectedDistrict !== 'all' || searchQuery) && (
              <button
                type="button"
                onClick={() => {
                  setSelectedType('all');
                  setSelectedOccasion('all');
                  setSelectedDistrict('all');
                  setSearchQuery('');
                }}
                className="ml-auto text-xs text-red-600 dark:text-red-400 hover:underline flex items-center gap-1 cursor-pointer font-medium"
              >
                <X className="w-3 h-3" />
                {isNl ? 'Filters wissen' : 'Filter zurücksetzen'}
              </button>
            )}
          </div>
        </section>

        {/* Results Counter Header */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
          <div>
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-[#1B211D] dark:text-white m-0">
              {filteredBusinesses.length} {isNl ? 'Feestlocaties gevonden' : 'Partylocations zum Mieten gefunden'}
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 m-0 mt-0.5">
              {isNl 
                ? 'Klik op een locatie om alle details, capaciteit en contactopties te bekijken' 
                : 'Klicke auf eine Location, um vollständige Details, Kapazitäten und Kontaktdaten aufzurufen'}
            </p>
          </div>
        </div>

        {/* Locations Cards Grid */}
        {filteredBusinesses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBusinesses.map(bus => {
              const meta = PARTY_VENUES_MAP[bus.id];
              const locationTypeLabel = meta 
                ? (isNl ? meta.locationTypeLabelNl : meta.locationTypeLabelDe)
                : (bus.subcategory || bus.category);
              const capacityText = meta 
                ? (isNl ? meta.capacityNl : meta.capacityDe)
                : (isNl ? 'Capaciteit op aanvraag' : 'Kapazität auf Anfrage');
              const topOccasions = meta
                ? (isNl ? meta.occasionsNl.slice(0, 3) : meta.occasionsDe.slice(0, 3))
                : ['Feiern & Feste'];

              return (
                <div key={bus.id} className="flex flex-col h-full relative group">
                  
                  {/* Location Meta Banner directly on top of card */}
                  <div className="mb-2 bg-white dark:bg-[#18201B] border border-[#E7E0D3] dark:border-white/10 rounded-xl p-2.5 shadow-2xs flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0"></span>
                      <span className="text-xs font-bold text-gray-800 dark:text-gray-100 truncate">
                        {locationTypeLabel}
                      </span>
                    </div>
                    <div className="inline-flex items-center gap-1 bg-amber-50 dark:bg-amber-950/70 border border-amber-200 dark:border-amber-800/80 px-2 py-0.5 rounded-md text-[11px] font-semibold text-amber-900 dark:text-amber-200 shrink-0">
                      <Users className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                      <span>{capacityText}</span>
                    </div>
                  </div>

                  {/* Standard BusinessCard Component */}
                  <div className="flex-1 flex flex-col">
                    <BusinessCard
                      business={bus}
                      theme={theme}
                      allBusinesses={businesses}
                      onClick={() => onSelectBusiness ? onSelectBusiness(bus) : null}
                    />
                  </div>

                  {/* Occasions Tags Footer Bar */}
                  <div className="mt-2.5 flex items-center justify-between gap-1.5 flex-wrap">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {topOccasions.map((occ, idx) => (
                        <span 
                          key={idx} 
                          className="text-[11px] font-medium bg-[#EFE9DF]/80 dark:bg-[#202923] text-gray-700 dark:text-gray-300 px-2 py-0.5 rounded-md border border-[#E2DBD0] dark:border-white/5"
                        >
                          {occ}
                        </span>
                      ))}
                      {meta?.highlightsDe?.[0] && (
                        <span className="text-[11px] font-medium text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800/60">
                          ✓ {isNl ? meta.highlightsNl[0] : meta.highlightsDe[0]}
                        </span>
                      )}
                    </div>
                    {bus.website && (
                      <a
                        href={bus.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1 text-[11.5px] font-bold text-[#0F4C2E] dark:text-emerald-400 hover:text-amber-600 dark:hover:text-amber-300 transition-colors shrink-0 ml-auto"
                      >
                        <span>{isNl ? 'Website bezoeken' : 'Event-Website'}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 bg-white dark:bg-[#1A221E] rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 p-8 shadow-xs">
            <PartyPopper className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-gray-800 dark:text-gray-200 mb-1">
              {isNl ? 'Geen partylocaties gevonden' : 'Keine passenden Partylocations gefunden'}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-4">
              {isNl
                ? 'Pas de zoekterm of gekozen filters aan om beschikbare locaties te zien.'
                : 'Versuche deine Suche anzupassen oder wähle einen anderen Ortsteil oder Anlass aus.'}
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedType('all');
                setSelectedOccasion('all');
                setSelectedDistrict('all');
                setSearchQuery('');
              }}
              className="px-4 py-2 bg-[#0F4C2E] text-white rounded-xl text-xs font-semibold hover:bg-[#14532D] transition-colors cursor-pointer"
            >
              {isNl ? 'Alle filters wissen' : 'Alle Filter zurücksetzen'}
            </button>
          </div>
        )}

        {/* Location Owner CTA Box */}
        <section className="mt-14 bg-gradient-to-br from-[#0F4C2E] via-[#14532D] to-[#0A331E] rounded-2xl p-6 sm:p-10 text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-6 border border-emerald-800">
          <div className="max-w-xl text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full text-xs font-semibold text-amber-300 mb-3">
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span>{isNl ? 'Locatiebeheerder in Winterberg?' : 'Betreibst du eine Partylocation?'}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight mb-2 text-white">
              {isNl
                ? 'Verhuur je een zaal, berghut of partyruimte in Winterberg?'
                : 'Vermietest du eine Hütte, Halle oder Partylocation im Sauerland?'}
            </h3>
            <p className="text-xs sm:text-sm text-white/85 leading-relaxed m-0">
              {isNl
                ? 'Meld je feestlocatie gratis aan in de Winterberg Bedrijvengids en bereik duizenden feestgangers, bruidsparen en bedrijven die op zoek zijn naar de perfecte plek voor hun evenement.'
                : 'Trage deine Eventlocation in das Winterberg Verzeichnis ein und erreiche Brautpaare, Geburtstagskinder, Firmen und Vereine, die nach einer passenden Mietlocation in Winterberg suchen.'}
            </p>
          </div>
          <div className="shrink-0 flex flex-col sm:flex-row gap-3">
            <a
              href="/eintragen"
              onClick={(e) => {
                if (onNavigateContact) {
                  e.preventDefault();
                  onNavigateContact();
                }
              }}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-gray-950 font-bold text-sm shadow-md transition-all cursor-pointer no-underline"
            >
              <span>{isNl ? 'Locatie gratis aanmelden' : 'Location jetzt eintragen'}</span>
              <ChevronRight className="w-4 h-4" />
            </a>
          </div>
        </section>

      </main>
    </div>
  );
};

export default PartyLocationsThemePage;
