import React, { useState, useMemo, useEffect } from 'react';
import { useTranslation } from '../i18n';
import { 
  Sparkles, 
  MapPin, 
  Search, 
  Calendar, 
  Clock, 
  Building2, 
  CheckCircle2, 
  ChevronRight, 
  ExternalLink,
  Plus,
  Maximize2,
  X,
  Navigation,
  Download,
  Share2,
  Flame,
  Users,
  Phone,
  Mail,
  PartyPopper,
  Check,
  Wine,
  Utensils,
  Headphones,
  Music,
  Ticket,
  Info,
  ArrowRight,
  Star
} from 'lucide-react';
import { Business, ThemeConfig, DesignSettings } from '../types';
import HeaderShapeDivider, { getEffectiveDivider } from './HeaderShapeDivider';
import { 
  SILVESTER_PARTY_DATA, 
  SilvesterPartyItem, 
  generateSilvesterPartyIcs 
} from '../utils/silvesterParty';

interface SilvesterThemePageProps {
  businesses: Business[];
  theme?: ThemeConfig;
  designSettings?: DesignSettings;
  onSelectBusiness?: (bus: Business) => void;
  onBack?: () => void;
  onNavigateContact?: () => void;
}

export const SilvesterThemePage: React.FC<SilvesterThemePageProps> = ({
  businesses,
  theme,
  designSettings,
  onSelectBusiness,
  onBack,
  onNavigateContact
}) => {
  const { lang } = useTranslation();
  const isNl = lang === 'nl';

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPartyType, setSelectedPartyType] = useState<string>('all');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
  const [previewImage, setPreviewImage] = useState<{ src: string; title: string } | null>(null);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

  // SEO setup
  useEffect(() => {
    const pageTitle = isNl
      ? 'Silvester feiern in Winterberg 2026 | Sylvester Party, Gala & Berghutten'
      : 'Silvester feiern in Winterberg 2026 | Partys, Gala-Buffets & Hüttenzauber';
    document.title = pageTitle;

    const pageDesc = isNl
      ? 'Vier Oud en Nieuw 2026 / 2027 in Winterberg: De beste oudejaarsfeesten, galabuffetten in luxe resorts, gezellige berghutten aan de piste en de openlucht Sylvesterparty op het marktplein.'
      : 'Silvester feiern in Winterberg 2026 / 2027: Die besten Silvesterpartys, Gourmet-Galabuffets, urige Hüttenabende am Skihang, Clubnächte in der Tenne und Open-Air-Silvester auf dem Marktplatz.';

    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', pageDesc);

    // Schema.org structured data
    let scriptTag = document.getElementById('silvester-theme-schema') as HTMLScriptElement;
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.type = 'application/ld+json';
      scriptTag.id = 'silvester-theme-schema';
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
          { '@type': 'ListItem', 'position': 3, 'name': isNl ? 'Oud en Nieuw 2026' : 'Silvester feiern in Winterberg 2026', 'item': 'https://www.winterberg-verzeichnis.de/themen/silvester-feiern-in-winterberg-2026' }
        ]
      }
    });

    return () => {
      const tag = document.getElementById('silvester-theme-schema');
      if (tag) tag.remove();
    };
  }, [isNl]);

  // Map businesses by id
  const businessMap = useMemo(() => {
    return new Map(businesses.map(b => [b.id, b]));
  }, [businesses]);

  // Available districts
  const availableDistricts = useMemo(() => {
    const set = new Set<string>();
    SILVESTER_PARTY_DATA.forEach(item => {
      if (item.district) set.add(item.district);
    });
    return Array.from(set).sort();
  }, []);

  // Filtered list
  const filteredItems = useMemo(() => {
    return SILVESTER_PARTY_DATA.filter(item => {
      if (selectedDistrict !== 'all' && item.district !== selectedDistrict) {
        return false;
      }
      if (selectedPartyType !== 'all' && item.partyType !== selectedPartyType) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const text = `${item.businessName} ${item.titleDe} ${item.titleNl} ${item.subtitleDe} ${item.subtitleNl} ${item.district} ${item.highlightsDe.join(' ')} ${item.shortDescriptionDe} ${item.packageTypeDe} ${item.priceInfoDe}`.toLowerCase();
        if (!text.includes(q)) return false;
      }
      return true;
    });
  }, [searchQuery, selectedDistrict, selectedPartyType]);

  const handleDownloadIcs = (item: SilvesterPartyItem, e: React.MouseEvent) => {
    e.stopPropagation();
    const icsData = generateSilvesterPartyIcs(item);
    const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `silvester-winterberg-${item.id}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getFeatureIcon = (iconName: string) => {
    switch (iconName) {
      case 'utensils': return <Utensils className="w-4 h-4 text-amber-500" />;
      case 'wine': return <Wine className="w-4 h-4 text-rose-500" />;
      case 'headphones': return <Headphones className="w-4 h-4 text-cyan-500" />;
      case 'music': return <Music className="w-4 h-4 text-purple-500" />;
      case 'sparkles': return <Sparkles className="w-4 h-4 text-amber-400" />;
      case 'flame': return <Flame className="w-4 h-4 text-orange-500" />;
      case 'ticket': return <Ticket className="w-4 h-4 text-emerald-500" />;
      case 'clock': return <Clock className="w-4 h-4 text-blue-500" />;
      default: return <Sparkles className="w-4 h-4 text-amber-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] dark:bg-[#0D1210] text-[#1B211D] dark:text-[#EAE6DF]">
      
      {/* Festive Midnight Hero Header */}
      <section className="w-full bg-gradient-to-br from-[#0A1128] via-[#101C38] to-[#1C2A4A] text-white relative overflow-hidden border-b border-amber-500/20 shadow-xl">
        
        {/* Festive Sparkle & Radial Glow Overlays */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_25%,rgba(245,158,11,0.18),transparent_55%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_20%,rgba(147,51,234,0.22),transparent_50%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_90%,rgba(59,130,246,0.15),transparent_60%)] pointer-events-none" />
        
        {/* Real Unsplash Fireworks Banner Image */}
        <figure className="relative lg:absolute lg:right-0 lg:top-0 lg:bottom-0 w-full lg:w-[48%] xl:w-[46%] 2xl:w-[44%] h-64 sm:h-80 md:h-96 lg:h-full m-0 z-0 overflow-hidden pointer-events-none">
          <img
            src="/silvester-winterberg-header.jpg"
            alt={isNl ? 'Silvester feiern in Winterberg 2026' : 'Silvester feiern in Winterberg 2026: Partys, Gala-Buffets, Hütten & Open Air'}
            width={1600}
            height={900}
            fetchPriority="high"
            decoding="async"
            className="w-full h-full object-cover hero-party-mask brightness-105 contrast-110"
            style={{ objectPosition: 'center 40%' }}
          />
          <div className="absolute top-3 right-3 lg:top-4 lg:right-6 flex items-center gap-1.5 z-10 pointer-events-none flex-wrap justify-end">
            <span className="text-[10.5px] leading-none font-semibold text-white/95 bg-black/65 backdrop-blur-xs px-2.5 py-1 rounded-md border border-white/20 flex items-center gap-1.5 shadow-md">
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span>{isNl ? 'Foto: Unsplash' : 'Foto: Unsplash'}</span>
            </span>
          </div>
        </figure>

        {/* Hero Content Container */}
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
              <span className="font-semibold text-amber-300">
                {isNl ? 'Oud en Nieuw 2026' : 'Silvester feiern 2026'}
              </span>
            </nav>

            {/* Eyebrow */}
            <div className="flex items-center gap-2 text-xs sm:text-sm font-bold uppercase tracking-wider text-amber-300 mb-3 drop-shadow-xs">
              <PartyPopper className="w-4 h-4 text-amber-300 shrink-0" />
              <span>{isNl ? 'Winterberg & Sauerland • Jaarwisseling 2026 / 2027' : 'Winterberg & Sauerland • Jahreswechsel 2026 / 2027'}</span>
            </div>

            {/* Headline */}
            <h1 className="font-display text-[28px] sm:text-[42px] md:text-[50px] font-extrabold m-0 mb-3 sm:mb-4 leading-[1.1] tracking-tight text-white drop-shadow-lg">
              {isNl ? 'Silvester feiern in Winterberg 2026' : 'Silvester feiern in Winterberg 2026'}
            </h1>

            {/* Intro Text */}
            <p className="text-sm sm:text-base md:text-[17px] text-white/90 leading-relaxed mb-6 sm:mb-8 max-w-2xl font-normal">
              {isNl
                ? 'Luid het nieuwe jaar 2027 in stijl in te midden van het betoverende berglandschap van Winterberg! Ontdek exclusieve oudejaarsgala\'s met livemuziek, gezellige berghutten met all-inclusive buffet en dj, de legendarische clubnacht in Die Tenne en het gratis openlucht Sylvesterfeest in het Winterdorf.'
                : 'Begrüße das neue Jahr 2027 im winterlichen Winterberg! Entdecke erstklassige Silvestergalas mit Gourmetbuffet und Live-Band, urige Hüttenpartys mit DJ, ausgelassenes Clubbing in der legendären Tenne bis zum Morgengrauen oder die traditionelle Open-Air-Silvesterparty im Winterberger Winterdorf. Jetzt Plätze & Tickets sichern!'}
            </p>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 flex-wrap">
              <a
                href="#partys"
                className="bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs sm:text-sm inline-flex items-center gap-2 shadow-lg hover:shadow-xl transition-all no-underline"
              >
                <Sparkles className="w-4 h-4 text-slate-950 stroke-[2.5]" />
                <span>{isNl ? 'Silvester-Partys entdecken' : 'Silvester-Partys & Events entdecken'}</span>
              </a>

              <button
                type="button"
                onClick={() => setIsSubmitModalOpen(true)}
                className="bg-white/15 hover:bg-white/25 text-white font-semibold px-4 py-2.5 rounded-xl text-xs sm:text-sm inline-flex items-center gap-2 border border-white/25 backdrop-blur-xs transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>{isNl ? 'Eigen Silvester-Event melden' : 'Silvester-Event eintragen'}</span>
              </button>
            </div>

            {/* Trust Badges */}
            <div className="mt-6 pt-5 border-t border-white/15 flex items-center gap-4 sm:gap-6 flex-wrap text-xs text-white/85">
              <span className="flex items-center gap-1.5 font-medium">
                <Check className="w-3.5 h-3.5 text-amber-400" />
                <span>{isNl ? 'Geverifieerde feestprogramma\'s' : 'Geprüfte Silvesterprogramme 2026'}</span>
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <Check className="w-3.5 h-3.5 text-amber-400" />
                <span>{isNl ? 'Van gala tot berghut & open air' : 'Von Gala über Hütte bis Club & Open-Air'}</span>
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <Check className="w-3.5 h-3.5 text-amber-400" />
                <span>{isNl ? 'Directe tafelreservering & tickets' : 'Direkte Tischreservierung & Tickets'}</span>
              </span>
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
      <main id="partys" className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8 sm:py-12">
        
        {/* Filter & Search Bar */}
        <div className="bg-white dark:bg-[#161C19] border border-[#E7E0D3] dark:border-white/10 rounded-2xl p-4 sm:p-5 shadow-sm mb-8 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="flex-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isNl ? 'Zoeken op locatie, DJ, gala, berghut...' : 'Dorf Alm, Gala, DJ, Tenne, Winterdorf oder Preis suchen...'}
                className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-gray-200 dark:border-white/15 bg-[#F9F7F2] dark:bg-[#111613] text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#1E3A8A]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Party Type Filter */}
            <div className="sm:w-56">
              <select
                value={selectedPartyType}
                onChange={(e) => setSelectedPartyType(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-gray-200 dark:border-white/15 bg-[#F9F7F2] dark:bg-[#111613] text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#1E3A8A]"
              >
                <option value="all">{isNl ? 'Alle party-stijlen' : 'Alle Silvester-Kategorien'}</option>
                <option value="huette">{isNl ? 'Berghut & Alm-party' : 'Skihütte & Alm-Party'}</option>
                <option value="gala">{isNl ? 'Galabuffet & Luxe Resort' : 'Silvestergala & Buffet'}</option>
                <option value="openair">{isNl ? 'Open-Air & Winterdorf' : 'Open-Air & Winterdorf'}</option>
                <option value="club">{isNl ? 'Club & Nightlife' : 'Club & Tanzlokal'}</option>
                <option value="hotel">{isNl ? 'Hotel & Familie' : 'Resort & Familien-Silvester'}</option>
              </select>
            </div>

            {/* Ortsteil Filter */}
            <div className="sm:w-44">
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-gray-200 dark:border-white/15 bg-[#F9F7F2] dark:bg-[#111613] text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#1E3A8A]"
              >
                <option value="all">{isNl ? 'Alle wijken' : 'Alle Ortsteile'}</option>
                {availableDistricts.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Action Button */}
          <button
            type="button"
            onClick={() => setIsSubmitModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#1E3A8A] hover:bg-[#1D4ED8] text-white rounded-xl text-xs sm:text-sm font-semibold shadow-xs transition-colors cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>{isNl ? 'Event aanmelden' : 'Event melden'}</span>
          </button>
        </div>

        {/* Section Header */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
          <div>
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-[#1B211D] dark:text-white m-0 flex items-center gap-2">
              <PartyPopper className="w-5 h-5 text-amber-500" />
              <span>{filteredItems.length} {isNl ? 'Silvester-evenementen voor 2026 / 2027 in Winterberg' : 'Silvester-Partys & Gala-Angebote 2026 / 2027 in Winterberg'}</span>
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 m-0 mt-0.5">
              {isNl 
                ? 'Klik op een flyer om details te vergroten of reserveer uw tafel / tickets rechtstreeks bij de locatie.' 
                : 'Klicke auf den Flyer oder das Bild zum Vergrößern oder sichere Dir Tischreservierung und Tickets direkt beim Veranstalter.'}
            </p>
          </div>
        </div>

        {/* 2-Column Cards Grid (2 Events pro Zeile) */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-stretch">
            {filteredItems.map((item) => {
              const bus = item.businessId ? businessMap.get(item.businessId) : undefined;

              return (
                <article
                  key={item.id}
                  className="w-full bg-white dark:bg-[#161C19] border border-[#E7E0D3] dark:border-white/10 rounded-2xl shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between h-full group"
                >
                  <div>
                    {/* Top Image Banner: Länglich & Widescreen ("über der Überschrift", nicht zu hoch) */}
                    <div 
                      onClick={() => setPreviewImage({ src: item.image, title: item.titleDe })}
                      className="relative w-full h-44 sm:h-48 md:h-52 bg-slate-900 overflow-hidden cursor-pointer group/img border-b border-[#E7E0D3] dark:border-white/10"
                    >
                      <img
                        src={item.image}
                        alt={`${item.businessName} - Silvester 2026`}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-[1.02]"
                        loading="lazy"
                      />

                      {/* Top Badge Left: Nur Format (Keine Adresse auf dem Bild) */}
                      <div className="absolute top-3 left-3 z-10">
                        <span className="inline-flex items-center gap-1.5 bg-amber-500 text-slate-950 text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md shadow-md border border-amber-300">
                          <Sparkles className="w-3 h-3 text-slate-950" />
                          <span>{isNl ? item.badgeNl : item.badgeDe}</span>
                        </span>
                      </div>

                      {/* Top Badge Right: ONLY "Bild Ki-generiert" */}
                      <div className="absolute top-3 right-3 z-10 pointer-events-none">
                        <span className="inline-block bg-black/70 backdrop-blur-xs text-white text-[10.5px] font-medium px-2.5 py-1 rounded-md border border-white/20 shadow-xs">
                          Bild Ki-generiert
                        </span>
                      </div>

                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-white text-xs font-semibold backdrop-blur-2xs">
                        <Maximize2 className="w-4 h-4 text-amber-300" />
                        <span>{isNl ? 'Afbeelding vergroten' : 'Bild vergrößern'}</span>
                      </div>
                    </div>

                    {/* Card Content: Vorwiegend Text, aufgeräumt & großzügig */}
                    <div className="p-5 sm:p-6 md:p-7 flex flex-col justify-between">
                      <div>
                        
                        {/* Top Meta Line: Category, Location & Time */}
                        <div className="flex items-center justify-between gap-2 flex-wrap mb-3">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[11px] font-bold text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-2.5 py-0.5 rounded-md border border-amber-200 dark:border-amber-800/60 flex items-center gap-1">
                              <PartyPopper className="w-3 h-3" />
                              <span>{item.category} • {item.subcategory}</span>
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-gray-400" />
                              <span>{item.address}</span>
                            </span>
                          </div>

                          {/* Date Tag */}
                          <div className="text-[11.5px] font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-white/10 px-2.5 py-0.5 rounded-md flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                            <span>{isNl ? item.dateNl : item.dateDe}</span>
                          </div>
                        </div>

                        {/* Business Name Heading (Groß & markant) */}
                        <div className="text-base sm:text-lg md:text-xl font-black uppercase tracking-wide text-amber-600 dark:text-amber-400 mb-1">
                          {item.businessName}
                        </div>

                        {/* Main Event Title */}
                        <h3 className="text-xl sm:text-2xl font-bold text-[#1B211D] dark:text-white m-0 mb-1.5 leading-snug">
                          {isNl ? item.titleNl : item.titleDe}
                        </h3>

                        {/* Subtitle */}
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-300 m-0 mb-4">
                          {isNl ? item.subtitleNl : item.subtitleDe}
                        </p>

                        {/* Schedule & Price Highlight Banner (Luftig mit großzügigem Padding) */}
                        <div className="bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/90 dark:border-amber-500/20 rounded-2xl p-4 sm:p-5 mb-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 divide-y sm:divide-y-0 sm:divide-x divide-amber-200/90 dark:divide-amber-500/20">
                            {/* Left Column: Schedule / Program */}
                            <div className="flex items-start gap-2.5 min-w-0 sm:pr-3">
                              <Clock className="w-4 h-4 text-amber-700 dark:text-amber-400 shrink-0 mt-0.5" />
                              <div className="min-w-0 flex-1">
                                <div className="text-[10.5px] uppercase tracking-wider font-extrabold text-amber-900 dark:text-amber-300 mb-1">
                                  {isNl ? 'Afloop & Tijden' : 'Ablauf & Uhrzeiten'}
                                </div>
                                <div className="text-xs font-medium text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-line break-words">
                                  {isNl ? item.timeNl : item.timeDe}
                                </div>
                              </div>
                            </div>

                            {/* Right Column: Cost & Tickets */}
                            <div className="flex items-start gap-2.5 min-w-0 pt-3 sm:pt-0 sm:pl-5">
                              <Ticket className="w-4 h-4 text-blue-700 dark:text-blue-400 shrink-0 mt-0.5" />
                              <div className="min-w-0 flex-1">
                                <div className="text-[10.5px] uppercase tracking-wider font-extrabold text-gray-600 dark:text-gray-300 mb-1">
                                  {isNl ? 'Prijzen & Toegang' : 'Kosten & Eintritt'}
                                </div>
                                <div className="text-xs sm:text-[13px] font-bold text-[#1E3A8A] dark:text-blue-300 leading-relaxed whitespace-pre-line break-words">
                                  {isNl ? item.priceInfoNl : item.priceInfoDe}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* 3 USP Boxen - nur Überschrift, zweizeilig, clean */}
                        <div className="grid grid-cols-3 gap-2 sm:gap-2.5 mb-4">
                          {item.features.map((feat, fIdx) => (
                            <div
                              key={fIdx}
                              className="bg-[#FBF9F4] dark:bg-[#121614] border border-[#EDE7DB] dark:border-white/10 rounded-xl p-2.5 sm:p-3 flex items-center gap-2 min-h-[50px] sm:min-h-[54px]"
                            >
                              <div className="shrink-0">
                                {getFeatureIcon(feat.icon)}
                              </div>
                              <span className="text-[11px] sm:text-xs font-bold text-gray-900 dark:text-white leading-tight line-clamp-2">
                                {isNl ? feat.titleNl : feat.titleDe}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Highlights: kurz, knapp und leicht eingerückt */}
                        <div className="mb-4">
                          <div className="text-[11px] font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                            <span>{isNl ? 'Belangrijkste hoogtepunten:' : 'Wichtigste Highlights:'}</span>
                          </div>
                          <ul className="pl-3.5 sm:pl-4 border-l-2 border-amber-400 dark:border-amber-600 space-y-1.5 m-0 list-none">
                            {(isNl ? item.highlightsNl : item.highlightsDe).map((hl, hIdx) => (
                              <li key={hIdx} className="text-xs text-gray-700 dark:text-gray-300 flex items-start gap-2 leading-relaxed">
                                <span className="text-amber-500 font-bold leading-none mt-1 shrink-0">•</span>
                                <span>{hl}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                      </div>

                      {/* Bottom Action Footer */}
                      <div className="pt-4 border-t border-[#E7E0D3] dark:border-white/10 flex items-center justify-between gap-2.5 flex-wrap">
                        
                        <div className="flex items-center gap-2 flex-wrap w-full">
                          {/* Primary CTA: Überall einheitlich "Mehr erfahren" */}
                          <a
                            href={item.bookingUrl || item.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 min-w-[130px] px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 text-xs sm:text-sm font-bold rounded-xl shadow-xs hover:shadow-md transition-all inline-flex items-center justify-center gap-1.5 no-underline"
                          >
                            <span>{isNl ? 'Meer informatie' : 'Mehr erfahren'}</span>
                            <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                          </a>

                          {/* Button: Betriebsprofil ansehen (Analoges Button-Styling) */}
                          {bus && onSelectBusiness && (
                            <button
                              type="button"
                              onClick={() => onSelectBusiness(bus)}
                              className="px-3.5 py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-white/10 dark:hover:bg-white/20 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-2xs transition-colors inline-flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                              <Building2 className="w-3.5 h-3.5 text-amber-400" />
                              <span>{isNl ? 'Profiel bekijken' : 'Betriebsprofil ansehen'}</span>
                              <ChevronRight className="w-3 h-3 text-white/60" />
                            </button>
                          )}

                          {/* ICS Calendar Download */}
                          <button
                            type="button"
                            onClick={(e) => handleDownloadIcs(item, e)}
                            title={isNl ? 'Opslaan in agenda (.ics)' : 'Termin in Kalender eintragen (.ics)'}
                            className="p-2.5 px-3 border border-gray-200 dark:border-white/15 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 transition-colors inline-flex items-center gap-1 text-xs font-semibold cursor-pointer shrink-0"
                          >
                            <Download className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                            <span className="hidden sm:inline">.ICS</span>
                          </button>
                        </div>

                      </div>

                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 bg-white dark:bg-[#161C19] border border-[#E7E0D3] dark:border-white/10 rounded-2xl p-8">
            <PartyPopper className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">
              {isNl ? 'Geen evenementen gevonden' : 'Keine passenden Silvester-Partys gefunden'}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
              {isNl 
                ? 'Probeer de zoekterm of de filters aan te passen.' 
                : 'Passe Deine Suchkriterien oder Filter an, um mehr Ergebnisse anzuzeigen.'}
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedPartyType('all');
                setSelectedDistrict('all');
              }}
              className="px-4 py-2 bg-amber-500 text-slate-950 font-bold text-xs rounded-xl shadow-xs"
            >
              {isNl ? 'Alle filters wissen' : 'Filter zurücksetzen'}
            </button>
          </div>
        )}

      </main>

      {/* Lightbox Preview Modal for Flyers / Images */}
      {previewImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6"
          onClick={() => setPreviewImage(null)}
        >
          <div 
            className="relative max-w-4xl max-h-[92vh] bg-white dark:bg-[#18201B] rounded-2xl overflow-hidden shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-3 sm:p-4 border-b border-gray-200 dark:border-white/10 flex items-center justify-between gap-3">
              <span className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white truncate">
                {previewImage.title}
              </span>
              <button
                type="button"
                onClick={() => setPreviewImage(null)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="overflow-auto p-2 flex items-center justify-center bg-black/5 dark:bg-black/30">
              <img
                src={previewImage.src}
                alt={previewImage.title}
                className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-md"
              />
            </div>
          </div>
        </div>
      )}

      {/* Submit / Add Event Modal */}
      {isSubmitModalOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4"
          onClick={() => setIsSubmitModalOpen(false)}
        >
          <div 
            className="relative w-full max-w-md bg-white dark:bg-[#18201B] border border-[#E7E0D3] dark:border-white/15 rounded-3xl shadow-2xl p-6 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto mb-3">
              <PartyPopper className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2">
              {isNl ? 'Eigen Silvester-party aanmelden' : 'Eigene Silvester-Veranstaltung melden'}
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed mb-5">
              {isNl
                ? 'Bent u organisator of horecaondernemer in Winterberg en wilt u uw oudejaarsevenement opnemen op deze themapagina? Neem contact op met de redactie van het Winterberg Verzeichnis!'
                : 'Sie sind Gastronom, Clubbetreiber oder Eventveranstalter in Winterberg und möchten Ihr Silvester-Angebot 2026 auf dieser Themenseite listen lassen? Schreiben Sie uns kurz Ihre Programmdaten und Flyer.'}
            </p>
            <div className="flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setIsSubmitModalOpen(false)}
                className="px-4 py-2 border border-gray-200 dark:border-white/15 text-gray-600 dark:text-gray-300 rounded-xl text-xs font-medium"
              >
                {isNl ? 'Sluiten' : 'Schließen'}
              </button>
              <a
                href="mailto:info@sichtbar-online.de?subject=Silvester%202026%20in%20Winterberg%20Event-Eintrag"
                className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-bold rounded-xl text-xs shadow-md no-underline inline-flex items-center gap-1.5"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>{isNl ? 'Contact opnemen' : 'Redaktion kontaktieren'}</span>
              </a>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default SilvesterThemePage;
