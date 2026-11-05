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
  TreePine,
  Gift,
  Utensils,
  Wine,
  Headphones,
  Flame,
  Users,
  Phone,
  Mail,
  Snowflake,
  PartyPopper,
  Check
} from 'lucide-react';
import { Business, ThemeConfig, DesignSettings } from '../types';
import HeaderShapeDivider, { getEffectiveDivider } from './HeaderShapeDivider';
import { 
  CHRISTMAS_PARTY_DATA, 
  ChristmasPartyItem, 
  generateChristmasPartyIcs 
} from '../utils/christmasParty';

interface ChristmasThemePageProps {
  businesses: Business[];
  theme?: ThemeConfig;
  designSettings?: DesignSettings;
  onSelectBusiness?: (bus: Business) => void;
  onBack?: () => void;
  onNavigateContact?: () => void;
}

export const ChristmasThemePage: React.FC<ChristmasThemePageProps> = ({
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
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [previewImage, setPreviewImage] = useState<{ src: string; title: string } | null>(null);
  const [selectedItemForInquiry, setSelectedItemForInquiry] = useState<ChristmasPartyItem | null>(null);
  const [inquirySuccess, setInquirySuccess] = useState(false);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

  // Inquiry form fields
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryCompany, setInquiryCompany] = useState('');
  const [inquiryEmail, setInquiryEmail] = useState('');
  const [inquiryPhone, setInquiryPhone] = useState('');
  const [inquiryGuests, setInquiryGuests] = useState('20-50 Personen');
  const [inquiryDate, setInquiryDate] = useState('Dezember 2026');
  const [inquiryMessage, setInquiryMessage] = useState('');

  // SEO setup
  useEffect(() => {
    const pageTitle = isNl
      ? 'Weihnachtsfeier in Winterberg 2026 | Kerstborrel & Locaties boeken'
      : 'Weihnachtsfeier in Winterberg 2026 | Weihnachtsfeier buchen & Hüttenzauber';
    document.title = pageTitle;

    const pageDesc = isNl
      ? 'Vier uw bedrijfs- of groepskerstfeest 2026 in Winterberg: All-inclusive arrangementen in authentieke berghutten met 4-gangenmenu, dranken en dj. Boek nu uw kerstborrel.'
      : 'Planen und buchen Sie Ihre Firmen-Weihnachtsfeier 2026 in Winterberg: All-Inclusive Pakete auf urigen Berghütten mit 4-Gänge-Menü, Getränkepauschale und DJ. Jetzt Termine sichern!';

    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', pageDesc);

    // Schema.org structured data
    let scriptTag = document.getElementById('christmas-theme-schema') as HTMLScriptElement;
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.type = 'application/ld+json';
      scriptTag.id = 'christmas-theme-schema';
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
          { '@type': 'ListItem', 'position': 3, 'name': isNl ? 'Weihnachtsfeier 2026' : 'Weihnachtsfeier 2026', 'item': 'https://www.winterberg-verzeichnis.de/themen/weihnachtsfeier-in-winterberg-2026' }
        ]
      }
    });

    return () => {
      const tag = document.getElementById('christmas-theme-schema');
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
    CHRISTMAS_PARTY_DATA.forEach(item => {
      if (item.district) set.add(item.district);
    });
    return Array.from(set).sort();
  }, []);

  // Filtered list
  const filteredItems = useMemo(() => {
    return CHRISTMAS_PARTY_DATA.filter(item => {
      if (selectedDistrict !== 'all' && item.district !== selectedDistrict) {
        return false;
      }
      if (selectedFilter === 'all-inclusive' && !item.packageTypeDe.toLowerCase().includes('all-inclusive')) {
        return false;
      }
      if (selectedFilter === 'huette' && !item.subcategory.toLowerCase().includes('hütte')) {
        return false;
      }
      if (selectedFilter === 'hotel' && !item.category.toLowerCase().includes('hotel')) {
        return false;
      }
      if (selectedFilter === 'action' && !item.category.toLowerCase().includes('sport')) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const text = `${item.businessName} ${item.titleDe} ${item.titleNl} ${item.subtitleDe} ${item.subtitleNl} ${item.district} ${item.highlightsDe.join(' ')} ${item.shortDescriptionDe} ${item.packageTypeDe}`.toLowerCase();
        if (!text.includes(q)) return false;
      }
      return true;
    });
  }, [searchQuery, selectedDistrict, selectedFilter]);

  const handleDownloadIcs = (item: ChristmasPartyItem, e: React.MouseEvent) => {
    e.stopPropagation();
    const icsData = generateChristmasPartyIcs(item);
    const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `weihnachtsfeier-${item.id}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSendInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItemForInquiry) return;

    // Build mailto link so inquiry directly reaches the host with prefilled structured data
    const subject = encodeURIComponent(`Anfrage Weihnachtsfeier 2026 - ${inquiryCompany || inquiryName} (${inquiryGuests})`);
    const body = encodeURIComponent(
      `Hallo Team von ${selectedItemForInquiry.businessName},\n\n` +
      `wir interessieren uns für eine Weihnachtsfeier 2026 in Ihrer Location:\n\n` +
      `• Firma / Gruppe: ${inquiryCompany || '-'}\n` +
      `• Ansprechpartner: ${inquiryName}\n` +
      `• E-Mail: ${inquiryEmail}\n` +
      `• Telefon: ${inquiryPhone || '-'}\n` +
      `• Wunschtermin / Zeitraum: ${inquiryDate}\n` +
      `• Gruppengröße: ${inquiryGuests}\n\n` +
      `Nachricht / Besondere Wünsche:\n${inquiryMessage || 'Bitte lassen Sie uns Informationen und Verfügbarkeiten für 2026 zukommen.'}\n\n` +
      `Mit freundlichen Grüßen,\n${inquiryName}\n\n(Gesendet über das Winterberg Verzeichnis - Themenseite Weihnachtsfeier 2026)`
    );

    window.open(`mailto:${selectedItemForInquiry.contactEmail}?subject=${subject}&body=${body}`, '_blank');
    setInquirySuccess(true);
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] dark:bg-[#121614] text-[#1B211D] dark:text-[#EAE6DF]">
      
      {/* Festive Hero Header */}
      <section className="w-full bg-gradient-to-br from-[#450A12] via-[#63141F] to-[#143322] text-white relative overflow-hidden border-b border-amber-500/20 shadow-lg">
        
        {/* Subtle festive light pattern / ambient sparkles overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(245,158,11,0.15),transparent_60%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(220,38,38,0.2),transparent_50%)] pointer-events-none" />
        
        {/* Background Image Banner */}
        <figure className="relative lg:absolute lg:right-0 lg:top-0 lg:bottom-0 w-full lg:w-[48%] xl:w-[46%] 2xl:w-[44%] h-64 sm:h-80 md:h-96 lg:h-full m-0 z-0 overflow-hidden pointer-events-none">
          <img
            src="/winterberger-wintermarkt-header.jpg"
            alt={isNl ? 'Weihnachtsfeier in Winterberg 2026' : 'Weihnachtsfeier in Winterberg 2026: Hüttenzauber & All-Inclusive buchen'}
            width={1600}
            height={900}
            fetchPriority="high"
            decoding="async"
            className="w-full h-full object-cover hero-party-mask brightness-95 contrast-105"
            style={{ objectPosition: 'center 40%' }}
          />
          <div className="absolute top-3 right-3 lg:top-4 lg:right-6 flex items-center gap-1.5 z-10 pointer-events-none flex-wrap justify-end">
            <span className="text-[10.5px] leading-none font-semibold text-white/95 bg-black/65 backdrop-blur-xs px-2.5 py-1 rounded-md border border-white/15 flex items-center gap-1.5 shadow-xs">
              <TreePine className="w-3 h-3 text-emerald-400" />
              <span>{isNl ? 'Kerstsfeer Winterberg 2026' : 'Winterberg Hüttenzauber 2026'}</span>
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
              <span className="font-semibold text-amber-200">
                {isNl ? 'Weihnachtsfeier 2026' : 'Weihnachtsfeier 2026'}
              </span>
            </nav>

            {/* Eyebrow */}
            <div className="flex items-center gap-2 text-xs sm:text-sm font-bold uppercase tracking-wider text-amber-300 mb-3 drop-shadow-xs">
              <Snowflake className="w-4 h-4 text-amber-300 shrink-0 animate-spin-slow" />
              <span>{isNl ? 'Winterberg & Sauerland • All-Inclusive Kerstfeest 2026' : 'Winterberg & Sauerland • Deine Weihnachtsfeier 2026 buchen'}</span>
            </div>

            {/* Headline */}
            <h1 className="font-display text-[28px] sm:text-[42px] md:text-[52px] font-extrabold m-0 mb-3 sm:mb-4 leading-[1.1] tracking-tight text-white drop-shadow-md">
              {isNl ? 'Weihnachtsfeier in Winterberg 2026' : 'Weihnachtsfeier in Winterberg 2026'}
            </h1>

            {/* Intro Text */}
            <p className="text-sm sm:text-base md:text-[17px] text-white/90 leading-relaxed mb-6 sm:mb-8 max-w-2xl font-normal">
              {isNl
                ? 'Beleef een onvergetelijke kerstborrel of personeelsfeest in de betoverende winterwereld van Winterberg. Boek authentieke berghutten en feestlocaties met all-inclusive arrangementen inclusief 4-gangenmenu, dranken en dj.'
                : 'Erlebe mit Deinem Team, Deiner Firma oder Deinem Verein eine unvergessliche Weihnachtsfeier im verschneiten Winterberg! Sichere Dir jetzt urige Berghütten und erstklassige Eventlocations mit All-Inclusive Paketen – inklusive Überraschungs-Menü, Getränkepauschale und Live-DJ.'}
            </p>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 flex-wrap">
              <a
                href="#angebote"
                className="bg-amber-400 hover:bg-amber-300 text-gray-950 font-bold px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm inline-flex items-center gap-2 shadow-md hover:shadow-lg transition-all no-underline"
              >
                <Sparkles className="w-4 h-4 text-amber-950 stroke-[2.5]" />
                <span>{isNl ? 'Arrangementen bekijken' : 'Weihnachtsfeiern entdecken'}</span>
              </a>

              <button
                type="button"
                onClick={() => setIsSubmitModalOpen(true)}
                className="bg-white/15 hover:bg-white/25 text-white font-semibold px-4 py-2.5 rounded-xl text-xs sm:text-sm inline-flex items-center gap-2 border border-white/20 backdrop-blur-xs transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>{isNl ? 'Eigen locatie aanmelden' : 'Eigene Location eintragen'}</span>
              </button>
            </div>

            {/* Trust Badges */}
            <div className="mt-6 pt-5 border-t border-white/15 flex items-center gap-4 sm:gap-6 flex-wrap text-xs text-white/85">
              <span className="flex items-center gap-1.5 font-medium">
                <Check className="w-3.5 h-3.5 text-amber-300" />
                <span>{isNl ? 'All-inclusive formules' : 'All-Inclusive Hüttenpakete'}</span>
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <Check className="w-3.5 h-3.5 text-amber-300" />
                <span>{isNl ? 'Inclusief menu & DJ' : 'Menü, Getränke & DJ'}</span>
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <Check className="w-3.5 h-3.5 text-amber-300" />
                <span>{isNl ? 'Voor teams & bedrijven' : 'Für Firmen, Vereine & Gruppen'}</span>
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
      <main id="angebote" className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8 sm:py-12">
        
        {/* Filter & Search Bar */}
        <div className="bg-white dark:bg-[#18201B] border border-[#E7E0D3] dark:border-white/10 rounded-2xl p-4 sm:p-5 shadow-xs mb-8 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="flex-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isNl ? 'Zoeken op locatie, berghut, all-inclusive...' : 'Hütte, Location, Menü oder Ortsteil suchen...'}
                className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-gray-200 dark:border-white/15 bg-[#F9F7F2] dark:bg-[#121614] text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#8B1E22]"
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

            {/* Ortsteil Filter */}
            <div className="sm:w-52">
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-gray-200 dark:border-white/15 bg-[#F9F7F2] dark:bg-[#121614] text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#8B1E22]"
              >
                <option value="all">{isNl ? 'Alle dorpen' : 'Alle Ortsteile'}</option>
                {availableDistricts.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            {/* Package Filter */}
            <div className="sm:w-52">
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-gray-200 dark:border-white/15 bg-[#F9F7F2] dark:bg-[#121614] text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#8B1E22]"
              >
                <option value="all">{isNl ? 'Alle formules & types' : 'Alle Angebote & Typen'}</option>
                <option value="all-inclusive">{isNl ? 'All-inclusive formules' : 'All-Inclusive Pakete'}</option>
                <option value="huette">{isNl ? 'Berghutten & Piste' : 'Skihütten & Alm-Flairs'}</option>
                <option value="hotel">{isNl ? 'Hotel-Resort & Overnachting' : 'Resort & Übernachtung'}</option>
                <option value="action">{isNl ? 'Actie & Bobslee-Incentive' : 'Action & EisArena'}</option>
              </select>
            </div>
          </div>

          {/* Action Button */}
          <button
            type="button"
            onClick={() => setIsSubmitModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#8B1E22] hover:bg-[#A32328] text-white rounded-xl text-xs sm:text-sm font-semibold shadow-xs transition-colors cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>{isNl ? 'Locatie toevoegen' : 'Location eintragen'}</span>
          </button>
        </div>

        {/* Section Header */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
          <div>
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-[#1B211D] dark:text-white m-0 flex items-center gap-2">
              <TreePine className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
              <span>{filteredItems.length} {isNl ? 'beschikbare feestlocatie(s) voor 2026' : 'verfügbare Location(s) für die Weihnachtsfeier 2026'}</span>
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 m-0 mt-0.5">
              {isNl 
                ? 'Klik op een arrangement om de flyer te vergroten of vraag direct een vrijblijvende offerte aan.' 
                : 'Klicke auf den Flyer zum Vergrößern oder frage Deine Wunschtermine direkt beim Gastgeber an.'}
            </p>
          </div>
        </div>

        {/* Full-width Cards List */}
        {filteredItems.length > 0 ? (
          <div className="space-y-8">
            {filteredItems.map((item) => {
              const bus = businessMap.get(item.businessId);

              return (
                <article
                  key={item.id}
                  className="w-full bg-white dark:bg-[#18201B] border border-[#E7E0D3] dark:border-white/10 rounded-2xl shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col lg:flex-row group"
                >
                  {/* Left Column: Image / Flyer Preview */}
                  <div className="lg:w-[380px] xl:w-[420px] shrink-0 bg-gradient-to-br from-[#FDF5E6] via-[#FAF0E6] to-[#F5E6D3] dark:from-[#211818] dark:to-[#171A18] relative flex items-center justify-center p-4 sm:p-6 overflow-hidden border-b lg:border-b-0 lg:border-r border-[#E7E0D3] dark:border-white/10">
                    
                    {/* Flyer Container with subtle festive shadow */}
                    <div 
                      onClick={() => setPreviewImage({ src: item.flyerImage, title: item.titleDe })}
                      className="relative w-full max-w-[300px] sm:max-w-[340px] lg:max-w-full rounded-xl overflow-hidden shadow-md group/flyer cursor-pointer border border-amber-900/15 dark:border-amber-400/20 transition-transform duration-300 group-hover:scale-[1.01]"
                    >
                      <img
                        src={item.flyerImage}
                        alt={`${item.businessName} - Deine All-Inclusive Weihnachtsfeier 2026`}
                        className="w-full h-auto object-cover block"
                        loading="lazy"
                      />

                      {/* Top Festive Badge */}
                      <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 flex-wrap z-10">
                        <span className="inline-flex items-center gap-1.5 bg-[#8B1E22] text-amber-200 text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md shadow-md border border-amber-400/30">
                          <Snowflake className="w-3 h-3 text-amber-300" />
                          <span>{isNl ? item.badgeNl : item.badgeDe}</span>
                        </span>
                      </div>

                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/flyer:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-white text-xs font-semibold backdrop-blur-2xs">
                        <Maximize2 className="w-4 h-4 text-amber-300" />
                        <span>{isNl ? 'Flyer vergroten' : 'Flyer vergrößern'}</span>
                      </div>
                    </div>

                  </div>

                  {/* Right Column: Full Details */}
                  <div className="flex-1 p-5 sm:p-7 flex flex-col justify-between">
                    <div>
                      
                      {/* Top Meta Line: Category, Location & Season */}
                      <div className="flex items-center justify-between gap-2 flex-wrap mb-2.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[11px] font-bold text-[#8B1E22] dark:text-red-300 bg-red-50 dark:bg-red-950/60 px-2.5 py-0.5 rounded-md border border-red-200 dark:border-red-800/60 flex items-center gap-1">
                            <TreePine className="w-3 h-3" />
                            <span>{item.category} • {item.subcategory}</span>
                          </span>
                          <span className="text-[11px] font-semibold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-white/10 px-2.5 py-0.5 rounded-md flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-[#F2761B]" />
                            <span>Winterberg-{item.district}</span>
                          </span>
                        </div>
                        <span className="text-[11px] font-bold text-amber-800 dark:text-amber-300 bg-amber-100/70 dark:bg-amber-950/60 px-2.5 py-0.5 rounded-md border border-amber-300/60 dark:border-amber-700/60">
                          {isNl ? item.seasonNl : item.seasonDe}
                        </span>
                      </div>

                      {/* Business Title & Subtitle */}
                      <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white m-0 tracking-tight">
                        {item.businessName}
                      </h3>
                      <div className="text-xs sm:text-sm font-semibold text-[#8B1E22] dark:text-red-400 mt-1 mb-4 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                        <span>{isNl ? item.subtitleNl : item.subtitleDe}</span>
                      </div>

                      {/* 3 Prominent Feature Boxes (Matching the Flyer: 4-Gänge-Menü, Getränke, DJ) */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 sm:p-4 bg-gradient-to-r from-red-50/60 via-[#FFF9F5] to-amber-50/60 dark:from-[#241718] dark:to-[#1C1F1D] border border-amber-200/90 dark:border-amber-800/40 rounded-xl mb-5">
                        {item.features.map((feat, idx) => (
                          <div key={idx} className="flex items-start gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-[#8B1E22]/10 dark:bg-red-400/10 text-[#8B1E22] dark:text-red-300 flex items-center justify-center shrink-0 mt-0.5">
                              {feat.icon === 'utensils' && <Utensils className="w-4 h-4 text-[#8B1E22] dark:text-red-400" />}
                              {feat.icon === 'wine' && <Wine className="w-4 h-4 text-[#8B1E22] dark:text-red-400" />}
                              {feat.icon === 'headphones' && <Headphones className="w-4 h-4 text-[#8B1E22] dark:text-red-400" />}
                            </div>
                            <div>
                              <div className="text-xs font-bold text-gray-900 dark:text-white leading-tight">
                                {isNl ? feat.titleNl : feat.titleDe}
                              </div>
                              <div className="text-[11px] text-gray-600 dark:text-gray-400 mt-0.5 leading-snug">
                                {isNl ? feat.descNl : feat.descDe}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Highlights Chips */}
                      <div className="mb-4">
                        <div className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                          {isNl ? 'Arrangement Highlights' : 'Inklusivleistungen & Highlights'}
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {(isNl ? item.highlightsNl : item.highlightsDe).map((hl, idx) => (
                            <span
                              key={idx}
                              className="text-[11.5px] font-semibold bg-[#FBF7F2] dark:bg-[#1E2520] text-[#781B20] dark:text-red-300 px-2.5 py-1 rounded-lg border border-[#ECDCCB] dark:border-white/5 flex items-center gap-1.5"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                              <span>{hl}</span>
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Info & Description Box */}
                      <div className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed bg-[#FAF8F5] dark:bg-[#151D18] p-4 rounded-xl border border-dashed border-[#E3DBD0] dark:border-white/10 mb-5">
                        <span className="font-semibold text-gray-900 dark:text-white block mb-1 flex items-center gap-1.5">
                          <Flame className="w-3.5 h-3.5 text-[#F2761B]" />
                          <span>{isNl ? 'Over deze locatie & het kerstarrangement:' : 'Hüttenzauber & Ablauf der Weihnachtsfeier:'}</span>
                        </span>
                        {isNl ? item.infoTextNl : item.infoTextDe}
                      </div>

                      {/* Location & Contact Meta Box */}
                      <div className="flex items-center gap-4 text-xs text-gray-600 dark:text-gray-300 mb-4 flex-wrap bg-gray-50 dark:bg-white/5 p-3 rounded-lg border border-gray-200/80 dark:border-white/10">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{item.address}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5 text-blue-600" />
                          <span>{isNl ? item.capacityNl : item.capacityDe}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5 text-amber-600" />
                          <a href={`tel:${item.contactPhone}`} className="text-gray-700 dark:text-gray-200 hover:text-[#8B1E22] font-semibold no-underline">
                            {item.contactPhone}
                          </a>
                        </span>
                      </div>

                    </div>

                    {/* Action Buttons Bar */}
                    <div className="pt-4 border-t border-gray-100 dark:border-white/10 flex items-center justify-between gap-3 flex-wrap">
                      <div className="flex items-center gap-2 flex-wrap">
                        
                        {/* Primary Button: Inquiry Modal */}
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedItemForInquiry(item);
                            setInquirySuccess(false);
                          }}
                          className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl bg-[#8B1E22] hover:bg-[#A32328] text-white font-bold text-xs sm:text-sm shadow-sm hover:shadow-md transition-all cursor-pointer"
                        >
                          <Gift className="w-4 h-4 text-amber-300" />
                          <span>{isNl ? 'Weihnachtsfeier 2026 aanvragen' : 'Weihnachtsfeier 2026 anfragen'}</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>

                        {/* View Business Profile */}
                        <button
                          type="button"
                          onClick={() => {
                            if (bus && onSelectBusiness) {
                              onSelectBusiness(bus);
                            }
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/15 text-gray-800 dark:text-gray-200 font-semibold text-xs transition-colors cursor-pointer"
                        >
                          <Building2 className="w-3.5 h-3.5 text-gray-600 dark:text-gray-400" />
                          <span>{isNl ? 'Bedrijfsprofiel' : 'Unternehmensprofil'}</span>
                        </button>

                        {/* Calendar ICS Export Button */}
                        <button
                          type="button"
                          onClick={(e) => handleDownloadIcs(item, e)}
                          title={isNl ? 'In agenda opslaan' : 'Planungstermin im Kalender merken (.ics)'}
                          className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/15 text-gray-800 dark:text-gray-200 font-semibold text-xs transition-colors cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
                          <span>{isNl ? 'Agenda (.ics)' : 'Termin merken (.ics)'}</span>
                        </button>

                        {/* Route / Google Maps Button */}
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${item.businessName}, ${item.address}`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/15 text-gray-800 dark:text-gray-200 font-semibold text-xs transition-colors cursor-pointer no-underline"
                        >
                          <Navigation className="w-3.5 h-3.5 text-blue-600" />
                          <span>{isNl ? 'Route' : 'Route planen'}</span>
                        </a>
                      </div>

                      {/* Lightbox Trigger Button */}
                      <button
                        type="button"
                        onClick={() => setPreviewImage({ src: item.flyerImage, title: item.titleDe })}
                        className="text-xs font-semibold text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white flex items-center gap-1 cursor-pointer bg-transparent border-none p-0 ml-auto"
                      >
                        <Maximize2 className="w-3.5 h-3.5" />
                        <span>{isNl ? 'Flyer tonen' : 'Flyer vergrößern'}</span>
                      </button>
                    </div>

                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 bg-white dark:bg-[#1A221E] rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 p-8 shadow-xs">
            <TreePine className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-gray-800 dark:text-gray-200 mb-1">
              {isNl ? 'Geen locaties gevonden' : 'Keine passenden Weihnachtsfeier-Angebote gefunden'}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-4">
              {isNl
                ? 'Pas je zoekopdracht aan of wis de filters.'
                : 'Passe deine Suchbegriffe an oder setze die Filter zurück.'}
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedDistrict('all');
                setSelectedFilter('all');
              }}
              className="px-4 py-2 bg-[#8B1E22] text-white rounded-xl text-xs font-semibold hover:bg-[#A32328] transition-colors cursor-pointer"
            >
              {isNl ? 'Filters wissen' : 'Filter zurücksetzen'}
            </button>
          </div>
        )}

        {/* Call-to-Action Box for Business Owners & Hosts */}
        <section className="mt-14 bg-gradient-to-br from-[#5A0E18] via-[#7A1522] to-[#173824] rounded-2xl p-6 sm:p-10 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border border-amber-500/30">
          <div className="max-w-xl text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full text-xs font-semibold text-amber-300 mb-3 border border-amber-400/20">
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span>{isNl ? 'Locatiehouder of horeca in Winterberg?' : 'Gastronom oder Eventlocation in Winterberg?'}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight mb-2 text-white">
              {isNl
                ? 'Biedt u ook kerstfeesten & eindejaarsborrels aan?'
                : 'Bieten Sie auch Weihnachtsfeiern oder Hüttenabende 2026 an?'}
            </h3>
            <p className="text-xs sm:text-sm text-white/85 leading-relaxed m-0">
              {isNl
                ? 'Plaats uw berghut, restaurant of feestzaal op deze themapagina. Bereik honderden bedrijven en groepen die op zoek zijn naar de perfecte kerstlocatie.'
                : 'Präsentieren Sie Ihr Weihnachts-Special, Ihre Skihütte oder Ihr Menü-Paket prominent im Winterberg Verzeichnis und gewinnen Sie Buchungen von regionalen Firmen und Gruppen.'}
            </p>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row items-center gap-3">
            <button
              type="button"
              onClick={() => setIsSubmitModalOpen(true)}
              className="px-5 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-gray-950 font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all cursor-pointer border-none flex items-center gap-2"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>{isNl ? 'Locatie gratis aanmelden' : 'Angebot / Location eintragen'}</span>
            </button>
            {onNavigateContact && (
              <button
                type="button"
                onClick={onNavigateContact}
                className="px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm transition-colors cursor-pointer border border-white/20"
              >
                <span>{isNl ? 'Contact opnemen' : 'Kontakt aufnehmen'}</span>
              </button>
            )}
          </div>
        </section>

      </main>

      {/* Inquiry Modal */}
      {selectedItemForInquiry && (
        <div 
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedItemForInquiry(null)}
        >
          <div 
            className="bg-white dark:bg-[#18201B] border border-amber-900/20 dark:border-white/15 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setSelectedItemForInquiry(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 dark:hover:text-white p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-2 text-xs font-bold text-[#8B1E22] dark:text-red-400 uppercase tracking-wider mb-1">
              <Gift className="w-4 h-4" />
              <span>{isNl ? 'Vrijblijvende aanvraag' : 'Unverbindliche Terminanfrage 2026'}</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
              {selectedItemForInquiry.businessName}
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-4">
              {isNl ? selectedItemForInquiry.subtitleNl : selectedItemForInquiry.subtitleDe}
            </p>

            {inquirySuccess ? (
              <div className="p-5 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 rounded-xl text-center">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 dark:text-emerald-400 mx-auto mb-2" />
                <h4 className="text-sm font-bold text-emerald-900 dark:text-emerald-200 mb-1">
                  {isNl ? 'E-mailprogramma geopend!' : 'E-Mail-Anfrage vorbereitet!'}
                </h4>
                <p className="text-xs text-emerald-700 dark:text-emerald-300 mb-4 leading-relaxed">
                  {isNl 
                    ? 'Uw e-mailclient is geopend met de ingevulde gegevens voor Nordhang Jause.'
                    : 'Ihr E-Mail-Programm wurde mit den eingetragenen Angaben geöffnet. Sie können die Anfrage direkt absenden.'}
                </p>
                <button
                  type="button"
                  onClick={() => setSelectedItemForInquiry(null)}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold"
                >
                  {isNl ? 'Sluiten' : 'Schließen'}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSendInquiry} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    {isNl ? 'Naam contactpersoon *' : 'Name Ansprechpartner *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={inquiryName}
                    onChange={(e) => setInquiryName(e.target.value)}
                    placeholder="z. B. Max Mustermann"
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-gray-300 dark:border-white/15 bg-white dark:bg-[#121614] text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    {isNl ? 'Bedrijf / Organisatie / Groep' : 'Firma / Abteilung / Gruppe'}
                  </label>
                  <input
                    type="text"
                    value={inquiryCompany}
                    onChange={(e) => setInquiryCompany(e.target.value)}
                    placeholder="z. B. Musterfirma GmbH"
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-gray-300 dark:border-white/15 bg-white dark:bg-[#121614] text-gray-900 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      {isNl ? 'E-mailadres *' : 'E-Mail-Adresse *'}
                    </label>
                    <input
                      type="email"
                      required
                      value={inquiryEmail}
                      onChange={(e) => setInquiryEmail(e.target.value)}
                      placeholder="name@firma.de"
                      className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-gray-300 dark:border-white/15 bg-white dark:bg-[#121614] text-gray-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      {isNl ? 'Telefoonnummer' : 'Telefonnummer'}
                    </label>
                    <input
                      type="tel"
                      value={inquiryPhone}
                      onChange={(e) => setInquiryPhone(e.target.value)}
                      placeholder="0170 1234567"
                      className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-gray-300 dark:border-white/15 bg-white dark:bg-[#121614] text-gray-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      {isNl ? 'Aantal personen' : 'Geschätzte Personenzahl'}
                    </label>
                    <select
                      value={inquiryGuests}
                      onChange={(e) => setInquiryGuests(e.target.value)}
                      className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-gray-300 dark:border-white/15 bg-white dark:bg-[#121614] text-gray-900 dark:text-white"
                    >
                      <option value="10-25 Personen">10 - 25 Personen</option>
                      <option value="25-50 Personen">25 - 50 Personen</option>
                      <option value="50-100 Personen">50 - 100 Personen</option>
                      <option value="100+ Personen">Über 100 Personen</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      {isNl ? 'Gewenste periode 2026' : 'Wunschzeitraum 2026'}
                    </label>
                    <input
                      type="text"
                      value={inquiryDate}
                      onChange={(e) => setInquiryDate(e.target.value)}
                      placeholder="z. B. Anfang Dezember 2026"
                      className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-gray-300 dark:border-white/15 bg-white dark:bg-[#121614] text-gray-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    {isNl ? 'Opmerkingen / Speciale wensen' : 'Nachricht / Individuelle Wünsche'}
                  </label>
                  <textarea
                    rows={3}
                    value={inquiryMessage}
                    onChange={(e) => setInquiryMessage(e.target.value)}
                    placeholder={isNl ? 'bijv. vragen over vegetarische opties of tijdschema' : 'z. B. Fragen zum 4-Gänge-Menü, Verlängerungsstunden oder Ablauf'}
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-gray-300 dark:border-white/15 bg-white dark:bg-[#121614] text-gray-900 dark:text-white"
                  />
                </div>

                <div className="pt-2 flex items-center justify-between gap-3">
                  <a
                    href={`tel:${selectedItemForInquiry.contactPhone}`}
                    className="inline-flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400 hover:text-[#8B1E22] font-semibold"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Direkt anrufen: {selectedItemForInquiry.contactPhone}</span>
                  </a>

                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-[#8B1E22] hover:bg-[#A32328] text-white rounded-xl text-xs sm:text-sm font-bold shadow-sm transition-colors cursor-pointer"
                  >
                    {isNl ? 'Aanvraag versturen' : 'Anfrage jetzt absenden'}
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

      {/* Lightbox Modal for Flyer Preview */}
      {previewImage && (
        <div 
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setPreviewImage(null)}
        >
          <div 
            className="relative max-w-2xl w-full max-h-[90vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setPreviewImage(null)}
              className="absolute -top-10 right-0 sm:-right-10 text-white hover:text-amber-300 p-2 rounded-full cursor-pointer transition-colors"
              aria-label="Schließen"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={previewImage.src}
              alt={previewImage.title}
              className="w-auto h-auto max-h-[82vh] max-w-full rounded-2xl shadow-2xl object-contain border border-white/20"
            />
            <div className="mt-3 text-center text-white/90 text-sm font-medium">
              {previewImage.title}
            </div>
          </div>
        </div>
      )}

      {/* Host / Owner Submit Modal */}
      {isSubmitModalOpen && (
        <div 
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setIsSubmitModalOpen(false)}
        >
          <div 
            className="bg-white dark:bg-[#18201B] border border-amber-900/20 dark:border-white/15 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setIsSubmitModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 dark:hover:text-white p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-xs font-bold text-[#8B1E22] dark:text-red-400 uppercase tracking-wider mb-1">
              <TreePine className="w-4 h-4" />
              <span>{isNl ? 'Locatie toevoegen' : 'Weihnachtsfeier-Angebot einreichen'}</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              {isNl ? 'Plaats uw kerstlocatie op deze pagina' : 'Präsentieren Sie Ihre Location für 2026'}
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-5 leading-relaxed">
              {isNl
                ? 'Heeft u een restaurant, berghut of evenementenlocatie in Winterberg en biedt u kerstfeesten of menu\'s aan? Neem direct contact op met de redactie van het Winterberg Verzeichnis.'
                : 'Betreiben Sie eine Skihütte, ein Restaurant oder eine Eventlocation im Stadtgebiet Winterberg und bieten Weihnachtsfeiern oder All-Inclusive Hüttenabende an? Wir nehmen Ihr Angebot gerne auf.'}
            </p>

            <div className="space-y-3 p-4 bg-amber-50/60 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-900/50 text-xs text-gray-700 dark:text-gray-300">
              <div className="flex items-center gap-2 font-semibold text-gray-900 dark:text-white">
                <Mail className="w-4 h-4 text-[#8B1E22]" />
                <span>E-Mail an: info@sichtbar-online.com</span>
              </div>
              <div>
                Senden Sie uns einfach Ihren Flyer / Ihr Angebot, Bilder und Kontaktdaten. Wir binden Ihr Special ein!
              </div>
            </div>

            <div className="mt-5 flex items-center justify-end gap-3">
              <a
                href="mailto:info@sichtbar-online.com?subject=Neues%20Angebot%20f%C3%BCr%20Themenseite%20Weihnachtsfeier%20Winterberg%202026"
                className="px-5 py-2.5 bg-[#8B1E22] hover:bg-[#A32328] text-white rounded-xl text-xs sm:text-sm font-bold no-underline inline-flex items-center gap-1.5"
              >
                <Mail className="w-4 h-4" />
                <span>E-Mail an Redaktion senden</span>
              </a>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ChristmasThemePage;
