import React from 'react';
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
  Trophy
} from 'lucide-react';
import { Business, CategoryGroup } from '../types';
import { useTranslation } from '../i18n';

interface MegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
  categories: CategoryGroup[];
  businesses: Business[];
  onSelectCategory: (category: string, subcategory?: string) => void;
  onSelectAll: () => void;
  onSelectBestOf?: () => void;
  onSelectLocation: (location: string) => void;
  onOpenMap: () => void;
  onOpenSubmit: () => void;
  getPath: (path: string) => string;
}

export const MegaMenu: React.FC<MegaMenuProps> = ({
  isOpen,
  onClose,
  categories,
  businesses,
  onSelectCategory,
  onSelectAll,
  onSelectBestOf,
  onSelectLocation,
  onOpenMap,
  onOpenSubmit,
  getPath,
}) => {
  const { t, lang } = useTranslation();
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
            className="fixed inset-0 top-[65px] bg-black/20 backdrop-blur-[2px] z-40"
            onClick={onClose}
          />

          {/* Mega Menu Dropdown Container */}
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.99 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="fixed left-0 right-0 top-[65px] z-50 px-4 pointer-events-none"
          >
            <div 
              className="max-w-[1180px] mx-auto bg-white/98 backdrop-blur-xl border border-[#EDE8E0] rounded-xl shadow-[0_25px_60px_-15px_rgba(15,76,46,0.18),0_10px_25px_-5px_rgba(0,0,0,0.06)] overflow-hidden pointer-events-auto"
              onMouseLeave={(e) => {
                const currentTarget = e.currentTarget;
                if (!currentTarget.contains(e.relatedTarget as Node)) {
                  onClose();
                }
              }}
            >
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
