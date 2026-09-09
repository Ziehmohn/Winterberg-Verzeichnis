import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bed, 
  Hammer, 
  ShoppingBag, 
  Utensils, 
  Briefcase, 
  Compass, 
  ArrowRight, 
  MapPin, 
  Map as MapIcon, 
  Plus, 
  Building2, 
  Sparkles,
  ChevronRight,
  Trophy,
  Fuel,
  Siren,
  CableCar,
  MountainSnow,
  HeartPulse,
  Car,
  Search,
  X
} from 'lucide-react';
import { Business, CategoryGroup } from '../types';
import { useTranslation } from '../i18n';
import { getBusinessPath } from '../utils/routes';

interface MegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
  categories: CategoryGroup[];
  businesses: Business[];
  onSelectCategory: (category: string, subcategory?: string) => void;
  onSelectAll: () => void;
  onSelectBestOf?: () => void;
  onSelectFuelPrices?: () => void;
  onSelectEmergency?: () => void;
  onSelectLocation: (location: string) => void;
  onOpenMap: () => void;
  onOpenSubmit: () => void;
  getPath: (path: string) => string;
  onSearch?: (query: string, location?: string) => void;
  onSelectBusiness?: (business: Business) => void;
}

export const MegaMenu: React.FC<MegaMenuProps> = ({
  isOpen,
  onClose,
  categories,
  businesses,
  onSelectCategory,
  onSelectAll,
  onSelectBestOf,
  onSelectFuelPrices,
  onSelectEmergency,
  onSelectLocation,
  onOpenMap,
  onOpenSubmit,
  getPath,
  onSearch,
  onSelectBusiness,
}) => {
  const { t, lang } = useTranslation();
  const [searchInput, setSearchInput] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('Alle');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [headerBottom, setHeaderBottom] = useState(65);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const updateHeaderBottom = () => {
      const headerEl = document.querySelector('header');
      if (headerEl) {
        setHeaderBottom(headerEl.getBoundingClientRect().bottom);
      }
    };
    if (isOpen) {
      updateHeaderBottom();
      const timer = setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    const updateHeaderBottom = () => {
      const headerEl = document.querySelector('header');
      if (headerEl) {
        setHeaderBottom(headerEl.getBoundingClientRect().bottom);
      }
    };
    window.addEventListener('resize', updateHeaderBottom);
    window.addEventListener('scroll', updateHeaderBottom);
    return () => {
      window.removeEventListener('resize', updateHeaderBottom);
      window.removeEventListener('scroll', updateHeaderBottom);
    };
  }, []);

  const suggestions = useMemo(() => {
    const q = searchInput.toLowerCase().trim();
    if (!q || q.length < 2) return [];
    return businesses.filter(b => {
      const matchName = b.name.toLowerCase().includes(q);
      const matchCat = (b.category || '').toLowerCase().includes(q);
      const matchSub = (b.subcategory || '').toLowerCase().includes(q);
      const matchServices = (b.services || []).some(s => s.toLowerCase().includes(q));
      const matchProducts = (b.products || []).some(p => p.toLowerCase().includes(q));
      const matchDistrict = (b.district || '').toLowerCase().includes(q);
      return matchName || matchCat || matchSub || matchServices || matchProducts || matchDistrict;
    }).slice(0, 6);
  }, [businesses, searchInput]);

  const availableDistricts = useMemo(() => {
    return Array.from(
      new Set(
        businesses.map(b => b.district || b.address?.split(',')[1]?.trim()?.split(' ')[1] || 'Winterberg')
      )
    ).filter(Boolean).sort();
  }, [businesses]);

  const handleExecuteSearch = () => {
    setShowSuggestions(false);
    if (onSearch) {
      onSearch(searchInput.trim(), selectedLocation);
    } else {
      onSelectAll();
    }
    onClose();
  };

  // Category Icons & Color Accents mapping
  const getCategoryMeta = (catName: string) => {
    switch (catName) {
      case 'Hotels und Unterkünfte':
        return {
          icon: Bed,
          accentBg: 'bg-emerald-50 text-[#0F4C2E] border-emerald-100/80 group-hover:bg-[#0F4C2E] group-hover:text-white',
          badgeBg: 'bg-[#FAF8F5] text-[#5F6B63]',
        };
      case 'Handwerk':
        return {
          icon: Hammer,
          accentBg: 'bg-amber-50 text-amber-800 border-amber-100/80 group-hover:bg-amber-700 group-hover:text-white',
          badgeBg: 'bg-[#FAF8F5] text-[#5F6B63]',
        };
      case 'Einzelhandel':
        return {
          icon: ShoppingBag,
          accentBg: 'bg-blue-50 text-blue-800 border-blue-100/80 group-hover:bg-blue-700 group-hover:text-white',
          badgeBg: 'bg-[#FAF8F5] text-[#5F6B63]',
        };
      case 'Gastronomie':
        return {
          icon: Utensils,
          accentBg: 'bg-orange-50 text-[#D65F0C] border-orange-100/80 group-hover:bg-[#F2761B] group-hover:text-white',
          badgeBg: 'bg-[#FAF8F5] text-[#5F6B63]',
        };
      case 'Dienstleistungen':
        return {
          icon: Briefcase,
          accentBg: 'bg-indigo-50 text-indigo-800 border-indigo-100/80 group-hover:bg-indigo-700 group-hover:text-white',
          badgeBg: 'bg-[#FAF8F5] text-[#5F6B63]',
        };
      case 'Ski, Bike & Sport':
        return {
          icon: MountainSnow,
          accentBg: 'bg-sky-50 text-sky-700 border-sky-100/80 group-hover:bg-sky-600 group-hover:text-white',
          badgeBg: 'bg-[#FAF8F5] text-[#5F6B63]',
        };
      case 'Gesundheit & Medizin':
        return {
          icon: HeartPulse,
          accentBg: 'bg-rose-50 text-rose-700 border-rose-100/80 group-hover:bg-rose-600 group-hover:text-white',
          badgeBg: 'bg-[#FAF8F5] text-[#5F6B63]',
        };
      case 'Mobilität & KFZ':
        return {
          icon: Car,
          accentBg: 'bg-slate-100 text-slate-700 border-slate-200 group-hover:bg-slate-700 group-hover:text-white',
          badgeBg: 'bg-[#FAF8F5] text-[#5F6B63]',
        };
      case 'Freizeit':
        return {
          icon: Compass,
          accentBg: 'bg-teal-50 text-teal-800 border-teal-100/80 group-hover:bg-teal-700 group-hover:text-white',
          badgeBg: 'bg-[#FAF8F5] text-[#5F6B63]',
        };
      default:
        return {
          icon: Building2,
          accentBg: 'bg-gray-50 text-gray-800 border-gray-100 group-hover:bg-[#0F4C2E] group-hover:text-white',
          badgeBg: 'bg-[#FAF8F5] text-[#5F6B63]',
        };
    }
  };

  // Top popular districts
  const featuredDistricts = [
    'Winterberg',
    'Altastenberg',
    'Neuastenberg',
    'Niedersfeld',
    'Züschen',
    'Elkeringhausen',
    'Siedlinghausen',
    'Silbach'
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ top: `${headerBottom}px` }}
            className="fixed inset-x-0 bottom-0 bg-black/30 backdrop-blur-[2px] z-[9990]"
            onClick={onClose}
          />

          {/* Mega Menu Dropdown Container */}
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.995 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.995 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            style={{ top: `${headerBottom}px` }}
            className="fixed left-0 right-0 z-[9999] px-2 sm:px-4 pointer-events-none"
          >
            <div 
              className="max-w-[1180px] mx-auto bg-white border border-[#EDE8E0] rounded-b-2xl shadow-[0_25px_60px_-15px_rgba(15,76,46,0.18),0_10px_25px_-5px_rgba(0,0,0,0.08)] overflow-hidden pointer-events-auto max-h-[calc(100vh-${headerBottom + 16}px)] flex flex-col"
              onMouseLeave={(e) => {
                const currentTarget = e.currentTarget;
                if (!currentTarget.contains(e.relatedTarget as Node)) {
                  onClose();
                }
              }}
            >
              {/* Search Bar at the Top */}
              <div className="bg-[#FAF8F5] border-b border-[#EDE8E0] px-4 py-3.5 sm:px-6 sm:py-4 shrink-0">
                <div className="flex flex-col sm:flex-row items-center gap-2.5">
                  <div className="relative flex-1 w-full">
                    <div className="flex items-center gap-2.5 bg-white border border-[#D5D0C5] focus-within:border-[#0F4C2E] focus-within:ring-2 focus-within:ring-[#0F4C2E]/15 rounded-lg px-3.5 py-2 transition-all shadow-2xs">
                      <Search className="w-4 h-4 sm:w-5 sm:h-5 text-[#0F4C2E] shrink-0" />
                      <input
                        ref={searchInputRef}
                        type="text"
                        value={searchInput}
                        onChange={(e) => {
                          setSearchInput(e.target.value);
                          setShowSuggestions(true);
                        }}
                        onFocus={() => setShowSuggestions(true)}
                        onBlur={() => setTimeout(() => setShowSuggestions(false), 220)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleExecuteSearch();
                          } else if (e.key === 'Escape') {
                            setShowSuggestions(false);
                          }
                        }}
                        placeholder={
                          lang === 'nl'
                            ? 'Bedrijf, categorie of trefwoord zoeken (bijv. ski, hotel, bakker)...'
                            : 'Unternehmen, Branche oder Begriff suchen (z. B. Ski, Hotel, Bäcker)...'
                        }
                        className="w-full bg-transparent border-none outline-none text-[14.5px] sm:text-[15px] text-[#1B211D] placeholder:text-[#8A928B]"
                      />
                      {searchInput && (
                        <button
                          type="button"
                          onClick={() => {
                            setSearchInput('');
                            setShowSuggestions(false);
                          }}
                          className="text-[#8A928B] hover:text-[#1B211D] p-0.5 rounded cursor-pointer"
                          title={lang === 'nl' ? 'Wissen' : 'Löschen'}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    {/* Live Suggestions Dropdown */}
                    {showSuggestions && suggestions.length > 0 && (
                      <div className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-lg shadow-2xl border border-[#EDE8E0] overflow-hidden z-[10000] text-left divide-y divide-[#F3F0EA]">
                        {suggestions.map((s) => {
                          const lowerInput = searchInput.toLowerCase().trim();
                          const matchingServices = (s.services || []).filter(srv =>
                            srv.toLowerCase().includes(lowerInput)
                          );
                          const matchingProducts = (s.products || []).filter(prd =>
                            prd.toLowerCase().includes(lowerInput)
                          );
                          return (
                            <a
                              key={s.id}
                              href={getPath(getBusinessPath(s, lang))}
                              onMouseDown={(e) => e.preventDefault()}
                              onClick={(e) => {
                                if (!e.ctrlKey && !e.metaKey && !e.shiftKey) {
                                  e.preventDefault();
                                  if (onSelectBusiness) {
                                    onSelectBusiness(s);
                                  } else {
                                    window.history.pushState(null, '', getPath(getBusinessPath(s, lang)));
                                    window.dispatchEvent(new PopStateEvent('popstate'));
                                  }
                                  onClose();
                                }
                              }}
                              className="px-4 py-2.5 hover:bg-[#FAF8F5] cursor-pointer flex items-center justify-between transition-colors no-underline text-inherit group"
                            >
                              <div className="flex items-center gap-3 overflow-hidden">
                                <div className="w-8 h-8 rounded-md bg-[#FAF8F5] group-hover:bg-[#E8F1EB] flex items-center justify-center shrink-0 transition-colors">
                                  <Search className="w-4 h-4 text-[#8A928B] group-hover:text-[#0F4C2E]" />
                                </div>
                                <div className="flex flex-col overflow-hidden">
                                  <div className="flex items-center gap-2">
                                    <span className="text-[14px] font-bold text-[#1B211D] group-hover:text-[#0F4C2E] truncate transition-colors">
                                      {s.name}
                                    </span>
                                    {s.district && (
                                      <span className="text-[11px] text-[#5F6B63] bg-[#F3F0EA] px-1.5 py-0.2 rounded shrink-0">
                                        {s.district}
                                      </span>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-1.5 flex-wrap text-xs">
                                    <span className="text-[#5F6B63] truncate">
                                      {t(s.category)}{s.subcategory ? ` > ${t(s.subcategory)}` : ''}
                                    </span>
                                    {matchingServices.length > 0 && (
                                      <span className="text-[#0F4C2E] bg-[#E8F1EB] text-[11px] font-semibold px-1.5 py-0.2 rounded truncate">
                                        🏷️ {matchingServices.join(', ')}
                                      </span>
                                    )}
                                    {matchingProducts.length > 0 && (
                                      <span className="text-[#D65F0C] bg-[#FFF8F1] border border-[#FBD9BC] text-[11px] font-semibold px-1.5 py-0.2 rounded truncate">
                                        📦 {matchingProducts.join(', ')}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="hidden sm:flex items-center text-xs text-[#0F4C2E] font-semibold shrink-0 ml-3 gap-0.5 opacity-70 group-hover:opacity-100 transition-opacity">
                                <span>{lang === 'nl' ? 'Profiel' : 'Profil'}</span>
                                <ChevronRight className="w-3.5 h-3.5" />
                              </div>
                            </a>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Ortsteil Select */}
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="w-full sm:w-[180px] shrink-0 border border-[#D5D0C5] rounded-lg px-3 py-2 text-[14px] font-medium text-[#1B211D] bg-[#EDE9E1] hover:bg-[#E5E0D6] focus:outline-none focus:ring-2 focus:ring-[#F2761B]/20 cursor-pointer"
                  >
                    <option value="Alle">{t("allTowns")}</option>
                    {availableDistricts.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>

                  {/* Search Button */}
                  <button
                    type="button"
                    onClick={handleExecuteSearch}
                    className="w-full sm:w-auto shrink-0 bg-[#F2761B] hover:bg-[#D65F0C] text-white rounded-lg px-5 py-2 font-bold text-[14px] transition-colors cursor-pointer shadow-sm flex items-center justify-center gap-1.5"
                  >
                    <Search className="w-4 h-4" />
                    <span>{lang === 'nl' ? 'Zoeken' : 'Suchen'}</span>
                  </button>
                </div>
              </div>

              {/* Scrollable Content: Categories & Highlights */}
              <div className="overflow-y-auto flex-1 overscroll-contain">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                
                {/* Left Area: 6 Main Categories with Subcategories (8 Cols) */}
                <div className="lg:col-span-8 p-6 sm:p-8 bg-white border-b lg:border-b-0 lg:border-r border-[#EDE8E0]">
                  <div className="flex items-center justify-between mb-5 pb-3 border-b border-[#F3F0EA]">
                    <div className="flex items-center gap-2">
                      <span className="font-display font-bold text-xs uppercase tracking-[0.12em] text-[#8A928B]">
                        {lang === 'nl' ? 'Categorieën & Branches' : 'Kategorien & Branchen'}
                      </span>
                      <span className="bg-[#FAF8F5] border border-[#EDE8E0] text-[#0F4C2E] text-[11px] font-bold px-2 py-0.5 rounded">
                        {categories.length} {lang === 'nl' ? 'Hoofdcategorieën' : 'Hauptbereiche'}
                      </span>
                    </div>
                    <a
                      href={getPath('/alle-unternehmen')}
                      onClick={(e) => {
                        e.preventDefault();
                        onSelectAll();
                        onClose();
                      }}
                      className="text-[13px] font-semibold text-[#0F4C2E] hover:text-[#F2761B] flex items-center gap-1 transition-colors"
                    >
                      {lang === 'nl' ? 'Alle bedrijven bekijken' : 'Alle Betriebe ansehen'} <ChevronRight className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  {/* 3-Column Category Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-5">
                    {categories.map((group) => {
                      const meta = getCategoryMeta(group.name);
                      const IconComponent = meta.icon;
                      const count = businesses.filter(b => b.category === group.name).length;

                      return (
                        <div key={group.name} className="group/cat flex flex-col">
                          {/* Main Category Header Link */}
                          <a
                            href={getPath(`/${encodeURIComponent(group.name)}`)}
                            onClick={(e) => {
                              e.preventDefault();
                              onSelectCategory(group.name);
                              onClose();
                            }}
                            className="group flex items-center justify-between p-2 -mx-2 rounded-md hover:bg-[#FAF8F5] transition-all duration-150 mb-1"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className={`w-8 h-8 rounded-md flex items-center justify-center border transition-all duration-200 shrink-0 ${meta.accentBg}`}>
                                <IconComponent className="w-4 h-4" />
                              </div>
                              <span className="font-display font-bold text-[14.5px] text-[#1B211D] group-hover:text-[#0F4C2E] truncate transition-colors">
                                {t(group.name)}
                              </span>
                            </div>
                            <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded shrink-0 transition-colors ${meta.badgeBg}`}>
                              {count}
                            </span>
                          </a>

                          {/* Subcategories links (top 4-5) */}
                          <div className="flex flex-col gap-0.5 pl-9 pr-1">
                            {group.subcategories.slice(0, 4).map((sub) => (
                              <a
                                key={sub}
                                href={getPath(`/${encodeURIComponent(group.name)}/${encodeURIComponent(sub)}`)}
                                onClick={(e) => {
                                  e.preventDefault();
                                  onSelectCategory(group.name, sub);
                                  onClose();
                                }}
                                className="text-[12.5px] text-[#5F6B63] hover:text-[#0F4C2E] hover:font-medium py-0.5 transition-colors truncate block"
                              >
                                {t(sub)}
                              </a>
                            ))}
                            {group.subcategories.length > 4 && (
                              <a
                                href={getPath(`/${encodeURIComponent(group.name)}`)}
                                onClick={(e) => {
                                  e.preventDefault();
                                  onSelectCategory(group.name);
                                  onClose();
                                }}
                                className="text-[11.5px] font-semibold text-[#8A928B] hover:text-[#0F4C2E] pt-0.5 transition-colors flex items-center gap-0.5"
                              >
                                + {group.subcategories.length - 4} {lang === 'nl' ? 'meer' : 'weitere'}
                              </a>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Right Area: Highlights, Ortsteile & Actions (4 Cols) */}
                <div className="lg:col-span-4 p-6 sm:p-7 bg-[#FAF8F5] flex flex-col justify-between gap-5">
                  
                  {/* Card: Alle Unternehmen Gesamtübersicht */}
                  <div 
                    onClick={() => {
                      onSelectAll();
                      onClose();
                    }}
                    className="bg-white border border-[#EDE8E0] rounded-lg p-4 cursor-pointer hover:border-[#0F4C2E] hover:shadow-[0_8px_20px_rgba(15,76,46,0.08)] hover:-translate-y-0.5 transition-all group"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="w-8 h-8 rounded-md bg-[#0F4C2E] text-white flex items-center justify-center shadow-sm">
                        <Building2 className="w-4 h-4" />
                      </div>
                      <span className="text-[12px] font-bold text-[#0F4C2E] group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                        {lang === 'nl' ? 'Overzicht' : 'Übersicht'} <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                    <div className="font-display font-bold text-[15px] text-[#1B211D] mb-1">
                      {lang === 'nl' ? `Alle ${businesses.length} bedrijven` : `Alle ${businesses.length} Unternehmen`}
                    </div>
                    <p className="text-[12.5px] text-[#5F6B63] leading-relaxed m-0">
                      {lang === 'nl' 
                        ? 'Volledige gids met alle actieve ondernemingen, contactgegevens en openingstijden.' 
                        : 'Vollständiges Verzeichnis mit allen Betrieben, Kontakten und Öffnungszeiten.'}
                    </p>
                  </div>

                  {/* Card: Bestenlisten */}
                  <a
                    href={getPath('/die-besten')}
                    onClick={(e) => {
                      e.preventDefault();
                      if (onSelectBestOf) {
                        onSelectBestOf();
                      } else {
                        window.history.pushState(null, '', getPath('/die-besten'));
                        window.dispatchEvent(new PopStateEvent('popstate'));
                      }
                      onClose();
                    }}
                    className="bg-white border border-[#EDE8E0] hover:border-[#F2761B] rounded-lg p-3.5 cursor-pointer hover:shadow-[0_8px_20px_rgba(242,118,27,0.08)] hover:-translate-y-0.5 transition-all group no-underline block"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-md bg-amber-50 text-[#F2761B] border border-amber-200/80 flex items-center justify-center shadow-2xs">
                          <Trophy className="w-3.5 h-3.5" />
                        </div>
                        <span className="font-display font-bold text-[14px] text-[#1B211D] group-hover:text-[#F2761B] transition-colors">
                          {lang === 'nl' ? 'Bestenlijsten' : 'Bestenlisten'}
                        </span>
                      </div>
                      <span className="text-[11.5px] font-bold text-[#F2761B] group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                        {lang === 'nl' ? 'Top 10' : 'Top 10'} <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                    <p className="text-[12px] text-[#5F6B63] leading-relaxed m-0 pl-9">
                      {lang === 'nl' 
                        ? 'De best beoordeelde bedrijven in Winterberg per categorie.' 
                        : 'Die am besten bewerteten Betriebe in Winterberg nach Branchen.'}
                    </p>
                  </a>

                  {/* Subtle Divider */}
                  <hr className="border-[#EDE8E0] my-1" />

                  {/* Section: Live-Daten (3 horizontal cards side by side) */}
                  <div>
                    <div className="font-display font-bold text-[11px] uppercase tracking-[0.1em] text-[#8A928B] mb-2.5 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span>{lang === 'nl' ? 'Live-informatie' : 'Live-Daten'}</span>
                      </span>
                      <span className="text-[10px] font-medium text-[#8A928B] lowercase">{lang === 'nl' ? 'realtime' : 'echtzeit'}</span>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      {/* Card 1: Spritpreise */}
                      <a
                        href={getPath(lang === 'nl' ? '/actuele-brandstofprijzen' : '/aktuelle-spritpreise')}
                        onClick={(e) => {
                          e.preventDefault();
                          if (onSelectFuelPrices) {
                            onSelectFuelPrices();
                          } else {
                            window.history.pushState(null, '', getPath(lang === 'nl' ? '/actuele-brandstofprijzen' : '/aktuelle-spritpreise'));
                            window.dispatchEvent(new PopStateEvent('popstate'));
                          }
                          onClose();
                        }}
                        className="bg-white border border-[#EDE8E0] hover:border-emerald-500 rounded-xl p-2.5 flex flex-col items-center text-center cursor-pointer hover:shadow-[0_6px_16px_rgba(15,76,46,0.08)] hover:-translate-y-0.5 transition-all group no-underline"
                        title={lang === 'nl' ? 'Actuele brandstofprijzen' : 'Aktuelle Spritpreise'}
                      >
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#0F4C2E] border border-emerald-200/80 flex items-center justify-center mb-1.5 shadow-2xs group-hover:scale-105 transition-transform">
                          <Fuel className="w-4 h-4" />
                        </div>
                        <span className="font-display font-bold text-[12px] text-[#1B211D] group-hover:text-[#0F4C2E] leading-tight">
                          {lang === 'nl' ? 'Brandstof' : 'Spritpreise'}
                        </span>
                        <span className="text-[9.5px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded mt-1">
                          Live
                        </span>
                      </a>

                      {/* Card 2: Notdienste */}
                      <a
                        href={getPath(lang === 'nl' ? '/nooddiensten' : '/notdienste')}
                        onClick={(e) => {
                          e.preventDefault();
                          if (onSelectEmergency) {
                            onSelectEmergency();
                          } else {
                            window.history.pushState(null, '', getPath(lang === 'nl' ? '/nooddiensten' : '/notdienste'));
                            window.dispatchEvent(new PopStateEvent('popstate'));
                          }
                          onClose();
                        }}
                        className="bg-white border border-[#EDE8E0] hover:border-red-500 rounded-xl p-2.5 flex flex-col items-center text-center cursor-pointer hover:shadow-[0_6px_16px_rgba(220,38,38,0.08)] hover:-translate-y-0.5 transition-all group no-underline"
                        title={lang === 'nl' ? 'Nooddiensten & Apotheekwacht' : 'Notdienste & Notfallnummern'}
                      >
                        <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 border border-red-200/80 flex items-center justify-center mb-1.5 shadow-2xs group-hover:scale-105 transition-transform">
                          <Siren className="w-4 h-4" />
                        </div>
                        <span className="font-display font-bold text-[12px] text-[#1B211D] group-hover:text-red-700 leading-tight">
                          {lang === 'nl' ? 'Nooddienst' : 'Notdienste'}
                        </span>
                        <span className="text-[9.5px] font-bold text-red-700 bg-red-50 px-1.5 py-0.5 rounded mt-1">
                          24/7
                        </span>
                      </a>

                      {/* Card 3: Skiliftdaten (ausgegraut / in Kürze) */}
                      <div
                        className="bg-gray-50/70 border border-dashed border-gray-300 rounded-xl p-2.5 flex flex-col items-center text-center cursor-not-allowed opacity-60 select-none"
                        title={lang === 'nl' ? 'Binnenkort: Live skiliften & pistes' : 'In Kürze verfügbar: Live Skilifte & Pisten'}
                      >
                        <div className="w-8 h-8 rounded-lg bg-gray-100 text-gray-400 border border-gray-200 flex items-center justify-center mb-1.5 shadow-2xs">
                          <CableCar className="w-4 h-4" />
                        </div>
                        <span className="font-display font-bold text-[12px] text-gray-500 leading-tight">
                          {lang === 'nl' ? 'Skiliften' : 'Skilifte'}
                        </span>
                        <span className="text-[9px] font-semibold text-gray-400 bg-gray-200/70 px-1.5 py-0.5 rounded mt-1 whitespace-nowrap">
                          {lang === 'nl' ? 'Binnenkort' : 'In Kürze'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Subtle Divider below Live-Daten */}
                  <hr className="border-[#EDE8E0] my-1" />

                  {/* Ortsteile Quick Chips */}
                  <div>
                    <div className="font-display font-bold text-xs uppercase tracking-[0.1em] text-[#8A928B] mb-2.5 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#0F4C2E]" />
                      <span>{lang === 'nl' ? 'Populaire dorpen & wijken' : 'Beliebte Ortsteile'}</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {featuredDistricts.map((district) => (
                        <button
                          key={district}
                          type="button"
                          onClick={() => {
                            onSelectLocation(district);
                            onClose();
                          }}
                          className="text-[12px] font-medium bg-white hover:bg-[#0F4C2E] text-[#1B211D] hover:text-white border border-[#EDE8E0] hover:border-[#0F4C2E] rounded px-2 py-1 transition-all cursor-pointer shadow-xs"
                        >
                          {district}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Quick Shortcuts & Submit Promo */}
                  <div className="flex flex-col gap-2 pt-2 border-t border-[#EDE8E0]">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          onOpenMap();
                          onClose();
                        }}
                        className="flex-1 flex items-center justify-center gap-1.5 bg-white border border-[#EDE8E0] hover:border-[#0F4C2E] hover:text-[#0F4C2E] text-[#1B211D] rounded-md py-2 px-3 text-[13px] font-semibold transition-all cursor-pointer"
                      >
                        <MapIcon className="w-4 h-4 text-[#0F4C2E]" />
                        <span>{t("viewMap")}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          onOpenSubmit();
                          onClose();
                        }}
                        className="flex-1 flex items-center justify-center gap-1.5 bg-[#F2761B] hover:bg-[#D65F0C] text-white rounded-md py-2 px-3 text-[13px] font-semibold transition-all cursor-pointer shadow-sm"
                      >
                        <Plus className="w-4 h-4" />
                        <span>{t("createEntry")}</span>
                      </button>
                    </div>
                  </div>

                </div>

              </div>
              </div>

              {/* Bottom Subtle Trust Bar */}
              <div className="bg-[#0F4C2E] text-white/90 px-6 sm:px-8 py-2.5 flex items-center justify-between flex-wrap gap-3 text-[12px] font-medium">
                <div className="flex items-center gap-4 flex-wrap">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#F2761B]" />
                    {businesses.length} {lang === 'nl' ? 'regionale bedrijven' : 'regionale Unternehmenseinträge'}
                  </span>
                  <span className="hidden sm:inline text-white/40">•</span>
                  <span className="hidden sm:inline">14 Ortsteile in Winterberg</span>
                  <span className="hidden sm:inline text-white/40">•</span>
                  <span className="hidden sm:inline">Tagesaktuell & regional</span>
                </div>
                <div className="text-white/70">
                  Winterberg im Sauerland
                </div>
              </div>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
