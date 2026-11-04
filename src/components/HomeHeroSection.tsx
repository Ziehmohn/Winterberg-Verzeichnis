import React from 'react';
import { 
  Search, 
  X, 
  Sparkles, 
  ChevronRight, 
  ArrowRight, 
  Camera, 
  MapPin, 
  Store,
  Layers,
  Compass
} from 'lucide-react';
import { DesignSettings, HomeHeroConfig, Business, CategoryGroup } from '../types';
import HeaderShapeDivider, { getEffectiveDivider } from './HeaderShapeDivider';
import { getEffectiveHomeHeroConfig } from '../utils/homeHeroOptions';

interface HomeHeroSectionProps {
  designSettings: DesignSettings;
  lang: 'de' | 'nl';
  t: (key: string) => string;
  homeSearchInput: string;
  setHomeSearchInput: (val: string) => void;
  showHomeSuggestions: boolean;
  setShowHomeSuggestions: (val: boolean) => void;
  homeSuggestionsMatches: any[];
  parseSearchQuery: (val: string) => any;
  activeLocation: string;
  setActiveLocation: (val: string) => void;
  categories: CategoryGroup[];
  businesses: Business[];
  popularSearches: string[];
  onSearchSubmit: () => void;
  onSelectBusiness: (b: Business) => void;
  getBusinessPath: (b: Business, lang: string) => string;
  getPath: (path: string) => string;
}

export const HomeHeroSection: React.FC<HomeHeroSectionProps> = ({
  designSettings,
  lang,
  t,
  homeSearchInput,
  setHomeSearchInput,
  showHomeSuggestions,
  setShowHomeSuggestions,
  homeSuggestionsMatches,
  parseSearchQuery,
  activeLocation,
  setActiveLocation,
  categories,
  businesses,
  popularSearches,
  onSearchSubmit,
  onSelectBusiness,
  getBusinessPath,
  getPath
}) => {
  const heroConfig = getEffectiveHomeHeroConfig(designSettings);
  const isNl = lang === 'nl';
  const style = heroConfig.style;
  const imageSrc = heroConfig.imageUrl || '/winterberg-hero-stefan-peters.jpg';
  const objectPos = heroConfig.objectPosition || 'center 40%';
  const creditText = heroConfig.credit || 'Ferienwelt Winterberg / Stefan Peters';

  // Badge Text
  const badgeLabel = isNl 
    ? (heroConfig.badgeTextNl || 'Winterberg & Regio • De officiële bedrijvengids') 
    : (heroConfig.badgeText || 'Winterberg & Region • Das offizielle Branchenverzeichnis');

  // Search box component to reuse across styles
  const renderSearchBox = (isGlass = false) => (
    <div className={`${isGlass ? 'bg-white/95 backdrop-blur-md border border-white/40' : 'bg-white'} rounded-xl p-2.5 flex flex-col md:flex-row gap-2.5 items-center w-full max-w-4xl shadow-2xl relative z-40 transition-all`}>
      <div className="flex items-center gap-3 w-full flex-1 min-w-0 px-3 relative">
        <Search className="w-5 h-5 text-gray-400 shrink-0" />
        <input 
          placeholder={t("searchPlaceholderHero")} 
          title={t("searchPlaceholderHero")}
          value={homeSearchInput}
          onChange={(e) => {
            setHomeSearchInput(e.target.value);
            setShowHomeSuggestions(true);
          }}
          onFocus={() => setShowHomeSuggestions(true)}
          onBlur={() => setTimeout(() => setShowHomeSuggestions(false), 200)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              onSearchSubmit();
            }
          }}
          className="border-none outline-none text-[15px] sm:text-base w-full py-2.5 text-gray-900 bg-transparent placeholder:text-gray-400" 
        />
        {homeSearchInput && (
          <button
            type="button"
            onClick={() => {
              setHomeSearchInput('');
              setShowHomeSuggestions(false);
            }}
            className="text-gray-400 hover:text-gray-600 p-1 shrink-0 cursor-pointer"
            title="Eingabe löschen"
          >
            <X className="w-4 h-4" />
          </button>
        )}
        {showHomeSuggestions && homeSearchInput.trim().length > 1 && (
          <div className="absolute top-full left-0 right-0 mt-2.5 bg-white rounded-xl shadow-[0_25px_60px_-10px_rgba(0,0,0,0.35)] border border-gray-200 overflow-y-auto max-h-[min(500px,65vh)] z-[99999] text-left divide-y divide-gray-100 scrollbar-thin">
            {parseSearchQuery(homeSearchInput).isNaturalLanguage && (
              <div className="px-4 py-2 bg-gradient-to-r from-[#E8F1EB] to-[#F3F8F5] text-[#0F4C2E] text-xs font-semibold flex items-center justify-between sticky top-0 z-10 border-b border-[#D2E4D8] backdrop-blur-xs">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#0F4C2E]" />
                  <span>{isNl ? 'Smarte KI-zoekopdracht:' : 'Smarte KI-Suche:'} <em>„{homeSearchInput}“</em></span>
                </span>
                <span className="text-[11px] font-normal text-[#5F6B63]">
                  {homeSuggestionsMatches.length} {isNl ? 'treffers' : 'Treffer'}
                </span>
              </div>
            )}

            {homeSuggestionsMatches.length === 0 ? (
              <div className="p-4 text-sm text-[#5F6B63]">
                <div className="flex items-center gap-2 text-gray-700 font-medium mb-1">
                  <Search className="w-4 h-4 text-gray-400" />
                  <span>{isNl ? 'Geen directe treffers voor' : 'Keine direkten Treffer für'} „{homeSearchInput}“</span>
                </div>
                <p className="text-xs text-[#8A958E] m-0">
                  {isNl
                    ? 'Druk op Enter of klik op Zoeken om in alle bedrijfsprofielen te zoeken.'
                    : 'Drücke Enter oder klicke auf Suchen, um alle Unternehmensprofile ganzheitlich zu durchsuchen.'}
                </p>
              </div>
            ) : (
              <>
                {homeSuggestionsMatches.map(match => {
                  const s = match.business;
                  const reason = match.matchedReason;
                  return (
                    <a 
                      key={s.id} 
                      href={getPath(getBusinessPath(s, lang))}
                      className="px-4 py-3 hover:bg-[#F9F7F4] cursor-pointer flex items-center justify-between transition-colors border-b border-gray-100 last:border-0 no-underline text-inherit block group"
                      onMouseDown={(e) => {
                        e.preventDefault();
                      }}
                      onClick={(e) => {
                        if (!e.ctrlKey && !e.metaKey && !e.shiftKey) {
                          e.preventDefault();
                          onSelectBusiness(s);
                        }
                      }}
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-8 h-8 rounded-md bg-gray-100 flex items-center justify-center shrink-0 group-hover:bg-[#E8F1EB] transition-colors">
                          <Search className="w-4 h-4 text-gray-400 group-hover:text-[#0F4C2E] transition-colors" />
                        </div>
                        <div className="flex flex-col overflow-hidden text-left min-w-0">
                          <span className="text-gray-900 font-medium truncate group-hover:text-[#0F4C2E] transition-colors">{s.name}</span>
                          <div className="flex items-center gap-1.5 flex-wrap mt-0.5">
                            <span className="text-gray-500 text-xs truncate">{t(s.category)}{s.subcategory ? ` > ${t(s.subcategory)}` : ''}</span>
                            {s.district && (
                              <span className="text-gray-400 text-xs truncate">· {s.district}</span>
                            )}
                            {reason?.type === 'service' && (
                              <span className="text-[#0F4C2E] bg-[#E8F1EB] text-[11px] font-semibold px-1.5 py-0.5 rounded truncate">
                                🏷️ {reason.text}
                              </span>
                            )}
                            {reason?.type === 'product' && (
                              <span className="text-[#D65F0C] bg-[#FFF8F1] border border-[#FBD9BC] text-[11px] font-semibold px-1.5 py-0.5 rounded truncate">
                                📦 {reason.text}
                              </span>
                            )}
                            {reason?.type === 'document' && (
                              <span className="text-[#146C82] bg-[#EAF5F8] text-[11px] font-semibold px-1.5 py-0.5 rounded truncate">
                                📋 {reason.text}
                              </span>
                            )}
                            {reason?.type === 'review' && (
                              <span className="text-[#7E22CE] bg-[#F5EFFB] text-[11px] font-semibold px-1.5 py-0.5 rounded truncate">
                                ⭐ {reason.text}
                              </span>
                            )}
                            {reason?.type === 'semantic' && (
                              <span className="text-[#0F4C2E] bg-[#E8F1EB] text-[11px] font-semibold px-1.5 py-0.5 rounded truncate">
                                💡 {reason.text}
                              </span>
                            )}
                            {reason?.type === 'event' && (
                              <span className="text-[#7E22CE] bg-[#F5EFFB] text-[11px] font-semibold px-1.5 py-0.5 rounded truncate">
                                📅 {reason.text}
                              </span>
                            )}
                            {reason?.type === 'job' && (
                              <span className="text-[#D65F0C] bg-[#FFF8F1] text-[11px] font-semibold px-1.5 py-0.5 rounded truncate">
                                💼 {reason.text}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="hidden sm:flex items-center text-xs text-[#0F4C2E] font-medium shrink-0 ml-3 gap-0.5 opacity-60 group-hover:opacity-100 transition-opacity">
                        <span>{isNl ? 'Profiel' : 'Profil'}</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </div>
                    </a>
                  );
                })}

                <div className="p-2.5 bg-[#FAF8F5] border-t border-gray-100 flex items-center justify-between sticky bottom-0 z-10">
                  <span className="text-xs text-[#5F6B63]">
                    {homeSuggestionsMatches.length} {isNl ? 'bedrijven gevonden' : 'Unternehmen gefunden'}
                  </span>
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={onSearchSubmit}
                    className="text-xs font-semibold text-[#0F4C2E] hover:text-[#06301C] flex items-center gap-1 cursor-pointer bg-white px-2.5 py-1.5 rounded-md border border-[#E7E2DA] shadow-xs hover:border-[#0F4C2E] transition-colors"
                  >
                    <span>{isNl ? 'Alle resultaten bekijken' : 'Alle Ergebnisse anzeigen'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
      <select 
        value={activeLocation} 
        onChange={(e) => setActiveLocation(e.target.value)}
        className="w-full md:w-auto md:w-[195px] shrink-0 border border-[#D5D0C5] rounded-md px-3.5 py-2.5 text-[15px] font-medium text-[#1B211D] bg-[#EDE9E1] hover:bg-[#E5E0D6] focus:outline-none focus:ring-2 focus:ring-[#F2761B]/20 focus:border-[#F2761B] transition-colors cursor-pointer"
      >
        <option value="Alle">{t("allTowns")}</option>
        {Array.from(new Set(businesses.map(b => b.district || (b.address?.includes(',') ? b.address.split(',')[1]?.trim().split(' ')[1] : b.address) || 'Winterberg'))).sort().map(d => (
          <option key={d} value={d}>{d}</option>
        ))}
      </select>
      <button 
        type="button" 
        onClick={onSearchSubmit} 
        className="w-full md:w-auto shrink-0 bg-[#F2761B] hover:bg-[#D65F0C] text-white rounded-md px-6 py-2.5 font-semibold transition-colors cursor-pointer shadow-sm hover:shadow"
      >
        {isNl ? 'Zoeken' : 'Suchen'}
      </button>
    </div>
  );

  // Popular searches pill bar
  const renderPopularSearches = () => {
    if (!heroConfig.showPopularSearches || popularSearches.length === 0) return null;
    return (
      <div className="mt-4 flex items-center gap-2 flex-wrap text-xs text-white/90 relative z-30">
        <span className="font-semibold text-white flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#F2761B]" /> {t("popularSearches")}:
        </span>
        {popularSearches.map(term => (
          <button
            key={term}
            type="button"
            onClick={() => {
              setHomeSearchInput(term);
              setTimeout(() => onSearchSubmit(), 50);
            }}
            className="bg-white/15 hover:bg-white/30 text-white px-3 py-1 rounded-full border border-white/20 transition-all cursor-pointer font-medium"
          >
            {t(term)}
          </button>
        ))}
      </div>
    );
  };

  // Stats Counters
  const renderStats = () => {
    if (!heroConfig.showStats) return null;
    return (
      <div className="flex gap-8 mt-10 md:mt-12 flex-wrap relative z-30">
        <div>
          <div className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-white">{businesses.length}</div>
          <div className="text-xs sm:text-sm text-white/75 mt-0.5">{isNl ? 'Bedrijven' : 'Unternehmen'}</div>
        </div>
        <div>
          <div className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-white">{categories.length}</div>
          <div className="text-xs sm:text-sm text-white/75 mt-0.5">{isNl ? 'Categorieën' : 'Kategorien'}</div>
        </div>
        <div>
          <div className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-white">14</div>
          <div className="text-xs sm:text-sm text-white/75 mt-0.5">{isNl ? 'Dorpen & Wijken' : 'Ortsteile'}</div>
        </div>
      </div>
    );
  };

  // Photo Credit Badge
  const renderCreditBadge = (extraClasses = '') => {
    if (!heroConfig.showCredit) return null;
    return (
      <div className={`flex items-center gap-1.5 z-20 pointer-events-none ${extraClasses}`}>
        <span className="text-[11px] leading-none font-medium text-white/95 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/15 flex items-center gap-1.5 shadow-lg">
          <Camera className="w-3 h-3 text-[#F2761B] shrink-0" />
          <span>Foto: {creditText}</span>
        </span>
      </div>
    );
  };

  // Header Title
  const renderTitle = () => (
    <>
      <div className="flex items-center gap-2 text-xs sm:text-sm font-bold uppercase tracking-wider text-amber-300 mb-3 drop-shadow-xs">
        <Store className="w-4 h-4 text-amber-300 shrink-0" />
        <span>{badgeLabel}</span>
      </div>

      <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-medium mb-4 leading-tight">
        {isNl ? 'De ' : 'Das '} <br className="md:hidden"/>
        <span className="inline-block relative">
          <span className="font-extrabold tracking-wide">WINTERBERG</span>
          <svg viewBox="0 0 200 10" preserveAspectRatio="none" className="w-full h-3 block -mt-1">
            <path d="M3 7C38 2 78 1 118 4c28 2 52 5 79 1" stroke="#F2761B" strokeWidth="3.4" fill="none" strokeLinecap="round"/>
          </svg>
        </span>
        <br className="md:hidden"/> {isNl ? 'Gids' : 'Verzeichnis'}
      </h1>
      <p className="text-base sm:text-lg md:text-xl text-white/95 max-w-2xl mb-3 leading-relaxed drop-shadow-xs">{t("heroText1")}</p>
      <p className="text-xs sm:text-sm md:text-base text-white/75 max-w-3xl mb-8 leading-relaxed">{t("heroText2")}</p>
    </>
  );

  // Common divider
  const renderDivider = () => (
    <HeaderShapeDivider
      style={getEffectiveDivider('home', designSettings)}
      color="transparent"
      customDividers={designSettings.customDividers}
    />
  );

  // ==========================================
  // 1. NEUERÖFFNUNG-STIL (Favorit des Kunden)
  // ==========================================
  if (style === 'split-gradient-badge') {
    return (
      <section className="relative text-white w-full z-30 bg-gradient-to-br from-[#0B3B24] via-[#0F4C2E] to-[#176239] overflow-hidden">
        {/* Prominent Right Image Banner with soft hero-party-mask */}
        <figure className="relative lg:absolute lg:right-0 lg:top-0 lg:bottom-0 w-full lg:w-[48%] xl:w-[46%] 2xl:w-[45%] h-64 sm:h-80 md:h-96 lg:h-full m-0 z-0 overflow-hidden pointer-events-none">
          <img
            src={imageSrc}
            alt={heroConfig.imageAlt || 'Winterberg Panorama'}
            width={1600}
            height={900}
            fetchPriority="high"
            decoding="async"
            className="w-full h-full object-cover hero-party-mask"
            style={{ objectPosition: objectPos }}
          />
          {renderCreditBadge('absolute top-4 right-4 lg:top-6 lg:right-8')}
        </figure>

        {/* Left Content Area */}
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 pt-8 md:pt-[70px] pb-[88px] relative z-30">
          <div className="max-w-2xl xl:max-w-3xl">
            {renderTitle()}
            {renderSearchBox()}
            {renderPopularSearches()}
            {renderStats()}
          </div>
        </div>

        {renderDivider()}
      </section>
    );
  }

  // ==========================================
  // 2. MODERNER SPLIT MIT SCHWEBENDER FOTOKARTE & GLOW
  // ==========================================
  if (style === 'split-card-glow') {
    return (
      <section className="relative text-white w-full z-30 bg-gradient-to-b from-[#062617] via-[#0A3821] to-[#0D4428] overflow-hidden">
        {/* Ambient Glow Orbs */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#16884E]/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-[#F2761B]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 pt-10 md:pt-16 pb-20 relative z-30">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            
            {/* Left Column: Text & Search */}
            <div className="lg:col-span-7 xl:col-span-7">
              {renderTitle()}
              {renderSearchBox()}
              {renderPopularSearches()}
              {renderStats()}
            </div>

            {/* Right Column: Floating Photo Card with Glow */}
            <div className="lg:col-span-5 xl:col-span-5 relative mt-4 lg:mt-0">
              <div className="relative rounded-3xl p-2.5 bg-gradient-to-b from-white/20 via-white/10 to-transparent border border-white/25 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.6)] backdrop-blur-md group">
                <div className="relative rounded-2xl overflow-hidden aspect-[4/3] sm:aspect-[16/11]">
                  <img
                    src={imageSrc}
                    alt={heroConfig.imageAlt || 'Winterberg Panorama'}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    style={{ objectPosition: objectPos }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />
                  {renderCreditBadge('absolute bottom-3 left-3')}
                </div>
              </div>
            </div>

          </div>
        </div>

        {renderDivider()}
      </section>
    );
  }

  // ==========================================
  // 3. CINEMATISCHE VOLLBILD-SZENERIE MIT DUNKELVERLAUF
  // ==========================================
  if (style === 'cinematic-overlay') {
    return (
      <section 
        className="relative text-white w-full z-30 bg-cover bg-center overflow-hidden"
        style={{ 
          backgroundImage: `url(${imageSrc})`,
          backgroundPosition: objectPos 
        }}
      >
        {/* Asymmetric readability gradient: Deep solid green on the left, clear view on the right */}
        <div 
          className="absolute inset-0 w-full h-full pointer-events-none z-10"
          style={{
            background: 'linear-gradient(to right, rgba(6,38,23,0.96) 0%, rgba(10,56,33,0.92) 42%, rgba(15,76,46,0.6) 70%, rgba(0,0,0,0.15) 100%)'
          }}
        />

        {renderCreditBadge('absolute top-4 right-4 sm:top-6 sm:right-8 z-20')}

        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 pt-10 md:pt-[84px] pb-[96px] relative z-20">
          <div className="max-w-2xl xl:max-w-3xl">
            {renderTitle()}
            {renderSearchBox()}
            {renderPopularSearches()}
            {renderStats()}
          </div>
        </div>

        {renderDivider()}
      </section>
    );
  }

  // ==========================================
  // 4. DYNAMISCHER DIAGONALSCHNITT (ANGLED SPLIT)
  // ==========================================
  if (style === 'split-diagonal-cut') {
    return (
      <section className="relative text-white w-full z-30 bg-[#0A3720] overflow-hidden">
        {/* Right Angled Image Slice */}
        <div 
          className="hidden lg:block absolute top-0 right-0 bottom-0 w-[50%] z-10 overflow-hidden pointer-events-none"
          style={{
            clipPath: 'polygon(15% 0, 100% 0, 100% 100%, 0% 100%)'
          }}
        >
          <img
            src={imageSrc}
            alt={heroConfig.imageAlt || 'Winterberg Panorama'}
            className="w-full h-full object-cover"
            style={{ objectPosition: objectPos }}
          />
          <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-black/20" />
          {renderCreditBadge('absolute bottom-6 right-8')}
        </div>

        {/* Mobile Image Fallback */}
        <div className="lg:hidden relative w-full h-60 sm:h-72 overflow-hidden">
          <img
            src={imageSrc}
            alt={heroConfig.imageAlt || 'Winterberg Panorama'}
            className="w-full h-full object-cover"
            style={{ objectPosition: objectPos }}
          />
          {renderCreditBadge('absolute top-3 right-3')}
        </div>

        {/* Content Area */}
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 pt-6 sm:pt-10 md:pt-16 pb-20 relative z-20">
          <div className="max-w-2xl">
            {renderTitle()}
            {renderSearchBox()}
            {renderPopularSearches()}
            {renderStats()}
          </div>
        </div>

        {renderDivider()}
      </section>
    );
  }

  // ==========================================
  // 5. MAGAZIN & EDITORIAL (GERAHMTES PASSEPARTOUT)
  // ==========================================
  if (style === 'magazine-editorial') {
    return (
      <section className="relative text-white w-full z-30 bg-gradient-to-br from-[#062919] to-[#124B2C] overflow-hidden">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 pt-10 md:pt-16 pb-20 relative z-30">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-7">
              {renderTitle()}
              {renderSearchBox()}
              {renderPopularSearches()}
              {renderStats()}
            </div>

            {/* Passepartout Magazine Frame */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="bg-white p-3 sm:p-4 rounded-xl shadow-[0_30px_70px_rgba(0,0,0,0.45)] max-w-md w-full border border-gray-200/80">
                <div className="relative rounded-lg overflow-hidden aspect-[4/3]">
                  <img
                    src={imageSrc}
                    alt={heroConfig.imageAlt || 'Winterberg Panorama'}
                    className="w-full h-full object-cover"
                    style={{ objectPosition: objectPos }}
                  />
                </div>
                <div className="mt-3 flex items-center justify-between text-xs text-gray-700 px-1 font-medium">
                  <span className="flex items-center gap-1.5 text-[#0F4C2E] font-semibold">
                    <Compass className="w-3.5 h-3.5 text-[#F2761B]" />
                    <span>Ferienwelt Winterberg</span>
                  </span>
                  <span className="text-[11px] text-gray-500 font-normal">Foto: {creditText}</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {renderDivider()}
      </section>
    );
  }

  // ==========================================
  // 6. KOMPAKTER PANORAMABALKEN (FOKUS AUF SUCHE)
  // ==========================================
  if (style === 'panoramic-compact') {
    return (
      <section className="relative text-white w-full z-30 bg-[#09351E] overflow-hidden">
        {/* Top Wide Banner Photo */}
        <div className="relative w-full h-48 sm:h-64 md:h-72 overflow-hidden">
          <img
            src={imageSrc}
            alt={heroConfig.imageAlt || 'Winterberg Panorama'}
            className="w-full h-full object-cover"
            style={{ objectPosition: objectPos }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#09351E] via-black/25 to-transparent" />
          {renderCreditBadge('absolute top-4 right-4 sm:top-5 sm:right-6')}
        </div>

        {/* Content & Floating Search Bar overlapping the banner */}
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 pb-16 relative z-30 -mt-16 sm:-mt-20">
          <div className="flex items-center gap-2 text-xs sm:text-sm font-bold uppercase tracking-wider text-amber-300 mb-3 drop-shadow-xs">
            <Store className="w-4 h-4 text-amber-300 shrink-0" />
            <span>{badgeLabel}</span>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mb-3 text-white drop-shadow-md">
            {isNl ? 'De Winterberg Gids' : 'Das Winterberg Verzeichnis'}
          </h1>
          <p className="text-sm sm:text-base text-white/90 max-w-3xl mb-6">{t("heroText1")}</p>

          {renderSearchBox()}
          {renderPopularSearches()}
          {renderStats()}
        </div>

        {renderDivider()}
      </section>
    );
  }

  // ==========================================
  // 7. ORGANISCHER RUNDBOGEN (BOUTIQUE PORTAL ARCH)
  // ==========================================
  if (style === 'split-curved-arch') {
    return (
      <section className="relative text-white w-full z-30 bg-gradient-to-br from-[#062C1B] via-[#0E4426] to-[#145632] overflow-hidden">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 pt-10 md:pt-16 pb-20 relative z-30">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-7">
              {renderTitle()}
              {renderSearchBox()}
              {renderPopularSearches()}
              {renderStats()}
            </div>

            {/* Architectural Arch Frame */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-sm rounded-t-[140px] rounded-b-2xl overflow-hidden border-2 border-white/30 shadow-[0_25px_60px_-10px_rgba(0,0,0,0.5)] aspect-[3/4] bg-black/40">
                <img
                  src={imageSrc}
                  alt={heroConfig.imageAlt || 'Winterberg Panorama'}
                  className="w-full h-full object-cover"
                  style={{ objectPosition: objectPos }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/10" />
                {renderCreditBadge('absolute bottom-4 left-4 right-4 justify-center')}
              </div>
            </div>

          </div>
        </div>

        {renderDivider()}
      </section>
    );
  }

  // ==========================================
  // 8. MILCHGLAS-DOCK & DEEP FOREST (FROSTED GLASS)
  // ==========================================
  if (style === 'glassmorphism-card') {
    return (
      <section 
        className="relative text-white w-full z-30 bg-cover bg-center overflow-hidden py-10 md:py-16"
        style={{ 
          backgroundImage: `url(${imageSrc})`,
          backgroundPosition: objectPos 
        }}
      >
        {/* Deep dark tint overlay */}
        <div className="absolute inset-0 bg-black/45 backdrop-blur-[2px] pointer-events-none" />

        {renderCreditBadge('absolute top-4 right-4 sm:top-6 sm:right-8 z-30')}

        <div className="max-w-[1180px] mx-auto px-4 sm:px-6 relative z-30">
          <div className="max-w-3xl bg-[#062617]/85 backdrop-blur-xl border border-white/20 rounded-3xl p-6 sm:p-10 shadow-2xl">
            {renderTitle()}
            {renderSearchBox(true)}
            {renderPopularSearches()}
            {renderStats()}
          </div>
        </div>

        {renderDivider()}
      </section>
    );
  }

  // ==========================================
  // 9. KLARES 50/50 SIDE-BY-SIDE (MODERNE GALERIE)
  // ==========================================
  if (style === 'minimal-side-by-side') {
    return (
      <section className="relative text-white w-full z-30 bg-[#0B3722] overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 w-full">
          
          {/* Left 50% Content */}
          <div className="px-6 sm:px-10 lg:px-14 py-10 sm:py-16 flex flex-col justify-center">
            <div className="max-w-xl">
              {renderTitle()}
              {renderSearchBox()}
              {renderPopularSearches()}
              {renderStats()}
            </div>
          </div>

          {/* Right 50% Clear Sharp Image */}
          <div className="relative min-h-[340px] sm:min-h-[420px] lg:min-h-full w-full overflow-hidden border-t lg:border-t-0 lg:border-l border-white/10">
            <img
              src={imageSrc}
              alt={heroConfig.imageAlt || 'Winterberg Panorama'}
              className="w-full h-full object-cover"
              style={{ objectPosition: objectPos }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10 pointer-events-none" />
            {renderCreditBadge('absolute bottom-4 right-4')}
          </div>

        </div>

        {renderDivider()}
      </section>
    );
  }

  // ==========================================
  // 10. ATMOSPHÄRISCHER HORIZONT-VERLAUF (WARM SUNLIGHT FADE)
  // ==========================================
  return (
    <section 
      className="relative text-white w-full z-30 bg-cover bg-center overflow-hidden"
      style={{ 
        backgroundImage: `url(${imageSrc})`,
        backgroundPosition: objectPos 
      }}
    >
      {/* Warm Sunlight & Green Horizon Fade */}
      <div 
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, rgba(11,55,34,0.3) 0%, rgba(11,55,34,0.85) 60%, rgba(7,36,22,0.98) 100%)'
        }}
      />

      {renderCreditBadge('absolute top-4 right-4 sm:top-6 sm:right-8 z-30')}

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 pt-12 md:pt-20 pb-20 relative z-30">
        <div className="max-w-3xl">
          {renderTitle()}
          {renderSearchBox()}
          {renderPopularSearches()}
          {renderStats()}
        </div>
      </div>

      {renderDivider()}
    </section>
  );
};

export default HomeHeroSection;
