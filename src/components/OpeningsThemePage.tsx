import React, { useState, useMemo, useEffect } from 'react';
import { useTranslation } from '../i18n';
import { 
  Sparkles, 
  MapPin, 
  Search, 
  Calendar, 
  Clock, 
  Store, 
  Building2, 
  CheckCircle2, 
  ChevronRight, 
  ExternalLink,
  Plus,
  Maximize2,
  X,
  Navigation,
  Download,
  Share2
} from 'lucide-react';
import { Business, ThemeConfig, DesignSettings } from '../types';
import HeaderShapeDivider, { getEffectiveDivider } from './HeaderShapeDivider';
import { 
  OPENINGS_DATA, 
  OpeningItem, 
  generateOpeningIcs 
} from '../utils/openings';
import SubmitOpeningModal from './SubmitOpeningModal';

interface OpeningsThemePageProps {
  businesses: Business[];
  theme?: ThemeConfig;
  designSettings?: DesignSettings;
  onSelectBusiness?: (bus: Business) => void;
  onBack?: () => void;
  onNavigateContact?: () => void;
}

export const OpeningsThemePage: React.FC<OpeningsThemePageProps> = ({
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
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<{ src: string; title: string } | null>(null);

  // SEO setup
  useEffect(() => {
    const pageTitle = isNl
      ? 'Nieuwe openingen in Winterberg | Aangekondigde openingen & nieuwe bedrijven'
      : 'Neueröffnungen in Winterberg | Aktuelle & angekündigte Neueröffnungen';
    document.title = pageTitle;

    const pageDesc = isNl
      ? 'Ontdek aangekondigde en nieuwe openingen van winkels, praktijken en horeca in Winterberg en de 14 dorpen. Blijf op de hoogte van data, locaties en openingsevenementen.'
      : 'Entdecke angekündigte Neueröffnungen von Geschäften, Praxen, Gastronomie und Betrieben in Winterberg und den 14 Ortsteilen. Alle Termine, Uhrzeiten und Unternehmensprofile im Überblick.';

    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', pageDesc);

    // Schema.org structured data
    let scriptTag = document.getElementById('openings-theme-schema') as HTMLScriptElement;
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.type = 'application/ld+json';
      scriptTag.id = 'openings-theme-schema';
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
          { '@type': 'ListItem', 'position': 3, 'name': isNl ? 'Nieuwe openingen' : 'Neueröffnungen', 'item': 'https://www.winterberg-verzeichnis.de/themen/neueroeffnungen-in-winterberg' }
        ]
      }
    });

    return () => {
      const tag = document.getElementById('openings-theme-schema');
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
    OPENINGS_DATA.forEach(item => {
      if (item.district) set.add(item.district);
    });
    return Array.from(set).sort();
  }, []);

  // Filtered openings
  const filteredOpenings = useMemo(() => {
    return OPENINGS_DATA.filter(item => {
      if (selectedDistrict !== 'all' && item.district !== selectedDistrict) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const text = `${item.businessName} ${item.titleDe} ${item.titleNl} ${item.subtitleDe} ${item.subtitleNl} ${item.district} ${item.focusAreasDe.join(' ')} ${item.shortDescriptionDe}`.toLowerCase();
        if (!text.includes(q)) return false;
      }
      return true;
    });
  }, [searchQuery, selectedDistrict]);

  const handleDownloadIcs = (item: OpeningItem, e: React.MouseEvent) => {
    e.stopPropagation();
    const icsData = generateOpeningIcs(item);
    const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `eroeffnung-${item.id}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] dark:bg-[#121614] text-[#1B211D] dark:text-[#EAE6DF]">
      
      {/* Hero Header */}
      <section className="w-full bg-gradient-to-br from-[#0B3B24] via-[#0F4C2E] to-[#176239] text-white relative overflow-hidden">
        
        {/* Background Image Banner */}
        <figure className="relative lg:absolute lg:right-0 lg:top-0 lg:bottom-0 w-full lg:w-[48%] xl:w-[46%] 2xl:w-[44%] h-56 sm:h-72 md:h-80 lg:h-full m-0 z-0 overflow-hidden pointer-events-none">
          <img
            src="/neueroeffnungen-winterberg-header.jpg"
            alt={isNl ? 'Nieuwe openingen in Winterberg' : 'Neueröffnungen in Winterberg: Neue Geschäfte, Praxen und Betriebe'}
            width={1600}
            height={900}
            fetchPriority="high"
            decoding="async"
            className="w-full h-full object-cover hero-party-mask"
            style={{ objectPosition: 'center 40%' }}
          />
          <div className="absolute top-3 right-3 lg:top-4 lg:right-6 flex items-center gap-1.5 z-10 pointer-events-none flex-wrap justify-end">
            <span className="text-[10px] leading-none font-semibold text-white/90 bg-black/60 backdrop-blur-xs px-2.5 py-1 rounded-md border border-white/10 flex items-center gap-1 shadow-xs">
              <Sparkles className="w-2.5 h-2.5 text-[#F2761B]" />
              <span>{isNl ? 'Afbeelding AI-gegenereerd' : 'Bild KI-generiert'}</span>
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
                {isNl ? 'Nieuwe openingen' : 'Neueröffnungen'}
              </span>
            </nav>

            {/* Eyebrow */}
            <div className="flex items-center gap-2 text-xs sm:text-sm font-bold uppercase tracking-wider text-amber-300 mb-3 drop-shadow-xs">
              <Store className="w-4 h-4 text-amber-300 shrink-0" />
              <span>{isNl ? 'Actueel & Aangekondigd • Winterberg & Regio' : 'Aktuell & Angekündigt • Winterberg & Ortsteile'}</span>
            </div>

            {/* Headline */}
            <h1 className="font-display text-[28px] sm:text-[40px] md:text-[50px] font-extrabold m-0 mb-3 sm:mb-4 leading-[1.1] tracking-tight text-white drop-shadow-xs">
              {isNl ? 'Neueröffnungen in Winterberg' : 'Neueröffnungen in Winterberg'}
            </h1>

            {/* Intro Text */}
            <p className="text-sm sm:text-base md:text-[17px] text-white/90 leading-relaxed mb-6 sm:mb-8 max-w-2xl">
              {isNl
                ? 'Ontdek nieuwe winkels, innovatieve praktijken, horecagelegenheden en vakbedrijven in Winterberg en de 14 dorpen. Hier vind je alle aangekondigde openingen met datums, tijdstippen, adressen en bedrijfsprofielen.'
                : 'Entdecke neue Geschäfte, Praxen, Gastronomie und Betriebe in Winterberg und den 14 Ortsteilen. Erfahre aus erster Hand, welche neuen Adressen eröffnen – inklusive Eröffnungsdaten, Programm, Adressen und vollständigen Profilen.'}
            </p>

            {/* Action Button */}
            <div>
              <button
                type="button"
                onClick={() => setIsSubmitModalOpen(true)}
                className="bg-amber-400 hover:bg-amber-300 text-gray-950 font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm inline-flex items-center gap-2 shadow-sm hover:shadow-md transition-all cursor-pointer border-none"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>{isNl ? 'Nieuwe opening aanmelden' : 'Neueröffnung einreichen'}</span>
              </button>
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
      <main className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8 sm:py-12">
        
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
                placeholder={isNl ? 'Zoeken op naam, branche, dorp...' : 'Name, Praxis, Ortsteil oder Leistung suchen...'}
                className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-gray-200 dark:border-white/15 bg-[#F9F7F2] dark:bg-[#121614] text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#0F4C2E]"
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
            <div className="sm:w-56">
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-gray-200 dark:border-white/15 bg-[#F9F7F2] dark:bg-[#121614] text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#0F4C2E]"
              >
                <option value="all">{isNl ? 'Alle dorpen / Ortsteile' : 'Alle Ortsteile'}</option>
                {availableDistricts.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Einreichen Button */}
          <button
            type="button"
            onClick={() => setIsSubmitModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#0F4C2E] hover:bg-[#14532D] text-white rounded-xl text-xs sm:text-sm font-semibold shadow-xs transition-colors cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>{isNl ? 'Neueröffnung einreichen' : 'Neueröffnung einreichen'}</span>
          </button>
        </div>

        {/* Section Header */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
          <div>
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-[#1B211D] dark:text-white m-0">
              {filteredOpenings.length} {isNl ? 'aangekondigde opening(en)' : 'angekündigte Neueröffnung(en)'}
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 m-0 mt-0.5">
              {isNl 
                ? 'Klik op een opening om het volledige bedrijfsprofiel en details te bekijken.' 
                : 'Klicke auf das Unternehmensprofil oder den Flyer für weitere Informationen.'}
            </p>
          </div>
        </div>

        {/* Full-width Cards List */}
        {filteredOpenings.length > 0 ? (
          <div className="space-y-6">
            {filteredOpenings.map((item) => {
              const bus = businessMap.get(item.businessId);

              return (
                <article
                  key={item.id}
                  className="w-full bg-white dark:bg-[#18201B] border border-[#E7E0D3] dark:border-white/10 rounded-2xl shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col lg:flex-row group"
                >
                  {/* Left Column: Image / Flyer Preview */}
                  <div className="lg:w-[360px] xl:w-[400px] shrink-0 bg-gradient-to-br from-[#F8F6F0] to-[#EFEADF] dark:from-[#1E2721] dark:to-[#151D18] relative flex items-center justify-center p-4 sm:p-6 overflow-hidden border-b lg:border-b-0 lg:border-r border-[#E7E0D3] dark:border-white/10">
                    
                    {/* Flyer Container with subtle shadow & frame */}
                    <div 
                      onClick={() => setPreviewImage({ src: item.flyerImage, title: item.titleDe })}
                      className="relative w-full max-w-[280px] sm:max-w-[320px] lg:max-w-full rounded-xl overflow-hidden shadow-md group/flyer cursor-pointer border border-black/5 dark:border-white/10 transition-transform duration-300 group-hover:scale-[1.01]"
                    >
                      <img
                        src={item.flyerImage}
                        alt={`${item.businessName} - Neueröffnung Flyer`}
                        className="w-full h-auto object-cover block"
                        loading="lazy"
                      />

                      {/* Top Badges */}
                      <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 flex-wrap z-10">
                        <span className="inline-flex items-center gap-1 bg-[#F2761B] text-white text-[10.5px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md shadow-xs">
                          <Sparkles className="w-2.5 h-2.5" />
                          <span>{isNl ? item.badgeNl : item.badgeDe}</span>
                        </span>
                      </div>

                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/flyer:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-white text-xs font-semibold backdrop-blur-2xs">
                        <Maximize2 className="w-4 h-4" />
                        <span>{isNl ? 'Flyer vergroten' : 'Flyer vergrößern'}</span>
                      </div>
                    </div>

                  </div>

                  {/* Right Column: Full Details */}
                  <div className="flex-1 p-5 sm:p-7 flex flex-col justify-between">
                    <div>
                      
                      {/* Top Meta Line: Category & Ortsteil */}
                      <div className="flex items-center justify-between gap-2 flex-wrap mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800/60">
                            {item.category} • {item.subcategory}
                          </span>
                          <span className="text-[11px] font-semibold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-white/10 px-2.5 py-0.5 rounded-md flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-[#F2761B]" />
                            <span>{item.district}</span>
                          </span>
                        </div>
                      </div>

                      {/* Business Title & Subtitle */}
                      <h3 className="font-display text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white m-0 tracking-tight">
                        {item.businessName}
                      </h3>
                      <div className="text-xs sm:text-sm font-semibold text-[#0F4C2E] dark:text-emerald-400 mt-0.5 mb-4">
                        {isNl ? item.subtitleNl : item.subtitleDe}
                      </div>

                      {/* Prominent Date, Time & Address Box */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-gradient-to-r from-amber-50/70 via-[#FFFBF2] to-amber-50/50 dark:from-[#212A23] dark:to-[#1B221C] border border-amber-200/80 dark:border-amber-700/30 rounded-xl mb-4">
                        <div className="flex items-start gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-amber-500/15 text-amber-800 dark:text-amber-300 flex items-center justify-center shrink-0 mt-0.5">
                            <Calendar className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-[10.5px] font-bold uppercase tracking-wider text-amber-900/80 dark:text-amber-300/80">
                              {isNl ? 'Openingsdatum' : 'Eröffnungsdatum'}
                            </div>
                            <div className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white">
                              {isNl ? item.openingDateFormattedNl : item.openingDateFormattedDe}
                            </div>
                            <div className="text-[11px] text-gray-600 dark:text-gray-400 font-medium flex items-center gap-1 mt-0.5">
                              <Clock className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                              <span>{isNl ? item.openingTimeNl : item.openingTimeDe}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-start gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-emerald-600/15 text-emerald-800 dark:text-emerald-300 flex items-center justify-center shrink-0 mt-0.5">
                            <MapPin className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-[10.5px] font-bold uppercase tracking-wider text-emerald-900/80 dark:text-emerald-300/80">
                              {isNl ? 'Locatie & Adres' : 'Adresse & Standort'}
                            </div>
                            <div className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white">
                              {item.address}
                            </div>
                            <div className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                              Winterberg-{item.district}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Focus Areas / Services Chips */}
                      <div className="mb-4">
                        <div className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                          {isNl ? 'Diensten & Specialisaties' : 'Schwerpunkte & Leistungen'}
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {(isNl ? item.focusAreasNl : item.focusAreasDe).map((area, idx) => (
                            <span
                              key={idx}
                              className="text-[11.5px] font-semibold bg-[#F2F7F4] dark:bg-[#202923] text-[#0F4C2E] dark:text-emerald-300 px-2.5 py-1 rounded-lg border border-[#D9E6DD] dark:border-white/5 flex items-center gap-1"
                            >
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              <span>{area}</span>
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Info Text */}
                      <div className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed bg-[#FAF8F5] dark:bg-[#151D18] p-3.5 rounded-xl border border-dashed border-[#E3DBD0] dark:border-white/10 mb-5">
                        <span className="font-semibold text-gray-900 dark:text-white block mb-0.5">
                          ℹ️ {isNl ? 'Informatie over de opening:' : 'Details zur Praxiseröffnung:'}
                        </span>
                        {isNl ? item.infoTextNl : item.infoTextDe}
                      </div>

                    </div>

                    {/* Action Buttons Bar */}
                    <div className="pt-3 border-t border-gray-100 dark:border-white/10 flex items-center justify-between gap-3 flex-wrap">
                      <div className="flex items-center gap-2 flex-wrap">
                        
                        {/* Primary Button: View Business Profile */}
                        <button
                          type="button"
                          onClick={() => {
                            if (bus && onSelectBusiness) {
                              onSelectBusiness(bus);
                            }
                          }}
                          className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl bg-[#0F4C2E] hover:bg-[#14532D] text-white font-bold text-xs sm:text-sm shadow-xs hover:shadow-md transition-all cursor-pointer"
                        >
                          <Building2 className="w-4 h-4" />
                          <span>{isNl ? 'Bedrijfsprofiel bekijken' : 'Unternehmensprofil aufrufen'}</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>

                        {/* Calendar ICS Export Button */}
                        <button
                          type="button"
                          onClick={(e) => handleDownloadIcs(item, e)}
                          title={isNl ? 'In agenda opslaan' : 'Termin im Kalender speichern (.ics)'}
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
            <Store className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-gray-800 dark:text-gray-200 mb-1">
              {isNl ? 'Geen openingen gevonden' : 'Keine passenden Neueröffnungen gefunden'}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-4">
              {isNl
                ? 'Pas je zoekopdracht aan of kies een ander dorp.'
                : 'Passe deine Suchbegriffe an oder wähle einen anderen Ortsteil aus.'}
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedDistrict('all');
              }}
              className="px-4 py-2 bg-[#0F4C2E] text-white rounded-xl text-xs font-semibold hover:bg-[#14532D] transition-colors cursor-pointer"
            >
              {isNl ? 'Filters wissen' : 'Filter zurücksetzen'}
            </button>
          </div>
        )}

        {/* Call-to-Action Box for Business Owners */}
        <section className="mt-14 bg-gradient-to-br from-[#0F4C2E] via-[#14532D] to-[#0A331E] rounded-2xl p-6 sm:p-10 text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-6 border border-emerald-800">
          <div className="max-w-xl text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full text-xs font-semibold text-amber-300 mb-3">
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span>{isNl ? 'Ondernemer in Winterberg?' : 'Eröffnest du demnächst in Winterberg?'}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight mb-2 text-white">
              {isNl
                ? 'Meld je nieuwe zaak of praktijk gratis aan!'
                : 'Kündige deine Neueröffnung kostenlos im Verzeichnis an!'}
            </h3>
            <p className="text-xs sm:text-sm text-white/85 leading-relaxed m-0">
              {isNl
                ? 'Maak je opening bekend bij duizenden inwoners en bezoekers. We publiceren je aankondiging met datum, flyer en eigen bedrijfsprofiel.'
                : 'Egal ob Praxis, Handwerksbetrieb, Ladengeschäft oder Gastronomie: Mach deine Neueröffnung bekannt bei Bürgern, Nachbarn und Gästen in der gesamten Region.'}
            </p>
          </div>
          <div className="shrink-0 flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={() => setIsSubmitModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-gray-950 font-bold text-sm shadow-md transition-all cursor-pointer border-none"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>{isNl ? 'Opening nu aanmelden' : 'Neueröffnung jetzt einreichen'}</span>
            </button>
          </div>
        </section>

      </main>

      {/* Submit Modal */}
      <SubmitOpeningModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
      />

      {/* Lightbox Preview Modal for Flyer */}
      {previewImage && (
        <div 
          onClick={() => setPreviewImage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs cursor-pointer"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-2xl max-h-[90vh] bg-white dark:bg-[#18201B] rounded-2xl overflow-hidden shadow-2xl p-2 cursor-default flex flex-col"
          >
            <div className="flex items-center justify-between p-3 border-b border-gray-100 dark:border-white/10">
              <span className="text-sm font-bold text-gray-900 dark:text-white truncate">
                {previewImage.title}
              </span>
              <button
                type="button"
                onClick={() => setPreviewImage(null)}
                className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white p-1 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="overflow-auto p-2 flex items-center justify-center">
              <img
                src={previewImage.src}
                alt={previewImage.title}
                className="max-h-[75vh] w-auto object-contain rounded-lg shadow-sm"
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default OpeningsThemePage;
