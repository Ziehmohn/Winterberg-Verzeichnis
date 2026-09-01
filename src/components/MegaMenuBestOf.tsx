import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, 
  Utensils, 
  Bed, 
  Compass, 
  Hammer, 
  Briefcase, 
  ShoppingBag, 
  Star, 
  ArrowRight, 
  Medal, 
  Award, 
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { CategoryGroup, Business } from '../types';
import { useTranslation } from '../i18n';
import { getCategorySlug, getSubcategorySlug } from '../utils/routes';

interface MegaMenuBestOfProps {
  isOpen: boolean;
  onClose: () => void;
  categories: CategoryGroup[];
  businesses: Business[];
  onSelectBestOf: (category?: string, subcategory?: string) => void;
  getPath: (path: string) => string;
}

export const MegaMenuBestOf: React.FC<MegaMenuBestOfProps> = ({
  isOpen,
  onClose,
  categories,
  businesses,
  onSelectBestOf,
  getPath,
}) => {
  const { t, lang } = useTranslation();
  const isNl = lang === 'nl';

  const categoryMeta: Record<string, { icon: any; color: string; bg: string; title: string }> = {
    'Gastronomie': {
      icon: Utensils,
      color: 'text-[#D65F0C]',
      bg: 'bg-orange-50 hover:bg-orange-100/80 border-orange-100',
      title: isNl ? 'Beste Horeca & Restaurants' : 'Die besten Restaurants & Gaststätten'
    },
    'Hotels und Unterkünfte': {
      icon: Bed,
      color: 'text-[#0F4C2E]',
      bg: 'bg-emerald-50 hover:bg-emerald-100/80 border-emerald-100',
      title: isNl ? 'Beste Hotels & Vakantiehuizen' : 'Die besten Hotels & Unterkünfte'
    },
    'Freizeit': {
      icon: Compass,
      color: 'text-teal-700',
      bg: 'bg-teal-50 hover:bg-teal-100/80 border-teal-100',
      title: isNl ? 'Beste Verhuur & Vrije Tijd' : 'Die besten Skiverleihe & Freizeitangebote'
    },
    'Handwerk': {
      icon: Hammer,
      color: 'text-amber-800',
      bg: 'bg-amber-50 hover:bg-amber-100/80 border-amber-100',
      title: isNl ? 'Beste Vakmensen & Ambacht' : 'Die besten Handwerker & Meisterbetriebe'
    },
    'Dienstleistungen': {
      icon: Briefcase,
      color: 'text-indigo-800',
      bg: 'bg-indigo-50 hover:bg-indigo-100/80 border-indigo-100',
      title: isNl ? 'Beste Diensten & Artsen' : 'Die besten Dienstleister & Praxen'
    },
    'Einzelhandel': {
      icon: ShoppingBag,
      color: 'text-blue-800',
      bg: 'bg-blue-50 hover:bg-blue-100/80 border-blue-100',
      title: isNl ? 'Beste Winkels & Sportzaken' : 'Die besten Geschäfte & Fachhändler'
    }
  };

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
            onClick={onClose}
            className="fixed inset-0 top-[73px] bg-black/40 backdrop-blur-xs z-40"
          />

          {/* MegaMenu Dropdown Content */}
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-[73px] left-0 right-0 bg-white border-b border-[#EDE8E0] shadow-[0_20px_50px_rgba(15,76,46,0.12)] z-50 max-h-[calc(100vh-80px)] overflow-y-auto"
          >
            <div className="max-w-[1240px] mx-auto px-6 py-8">
              {/* Header Bar within MegaMenu */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-[#EDE8E0]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 border border-amber-200/80 flex items-center justify-center shadow-xs">
                    <Trophy className="w-5 h-5 text-[#F2761B]" />
                  </div>
                  <div>
                    <h2 className="font-display text-xl font-bold text-[#1B211D] flex items-center gap-2">
                      {isNl ? 'De Beste Bedrijven in Winterberg' : 'Die Besten in Winterberg – Offizielle Bestenlisten'}
                      <span className="text-[11px] font-bold bg-[#E8F1EB] text-[#0F4C2E] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                        {isNl ? 'Geverifieerd' : 'Bewertungsbasiert'}
                      </span>
                    </h2>
                    <p className="text-xs text-[#5F6B63] mt-0.5">
                      {isNl
                        ? 'De best beoordeelde bedrijven, restaurants, hotels en vakmensen in Winterberg en de 14 dorpen.'
                        : 'Entdecken Sie die beliebtesten und am besten bewerteten Betriebe, Gastronomen und Handwerker der Region.'}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    onSelectBestOf('all');
                    onClose();
                  }}
                  className="inline-flex items-center gap-2 bg-[#0F4C2E] text-white hover:bg-[#06301C] text-xs font-bold px-4 py-2.5 rounded-lg shadow-sm transition-all cursor-pointer hover:scale-[1.02] shrink-0"
                >
                  <Award className="w-4 h-4 text-amber-300" />
                  <span>{isNl ? 'Bekijk Top 10 Totaal' : 'Gesamtübersicht: Top 10 Winterberg'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* 6 Category Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((catGroup) => {
                  const meta = categoryMeta[catGroup.name] || {
                    icon: Trophy,
                    color: 'text-[#0F4C2E]',
                    bg: 'bg-gray-50 hover:bg-gray-100 border-gray-200',
                    title: `Die besten ${catGroup.name}`
                  };
                  const Icon = meta.icon;

                  return (
                    <div 
                      key={catGroup.name}
                      className="bg-white border border-[#EDE8E0] hover:border-[#F2761B]/40 rounded-xl p-5 transition-all duration-200 hover:shadow-md flex flex-col justify-between group"
                    >
                      <div>
                        {/* Category Header */}
                        <div 
                          onClick={() => {
                            onSelectBestOf(catGroup.name);
                            onClose();
                          }}
                          className="flex items-center gap-3 mb-3 cursor-pointer"
                        >
                          <div className={`w-9 h-9 rounded-lg ${meta.bg} border flex items-center justify-center shrink-0 transition-transform group-hover:scale-105`}>
                            <Icon className={`w-4 h-4 ${meta.color}`} />
                          </div>
                          <div>
                            <h3 className="font-bold text-sm text-[#1B211D] group-hover:text-[#F2761B] transition-colors leading-tight">
                              {meta.title}
                            </h3>
                            <span className="text-[11px] text-[#8A928B] flex items-center gap-1 mt-0.5">
                              <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                              {isNl ? 'Top gerangschikt' : 'Nach Kundenbewertungen'}
                            </span>
                          </div>
                        </div>

                        {/* Top Subcategories List */}
                        <div className="space-y-1 mt-3 pt-3 border-t border-[#F3F0EA]">
                          {catGroup.subcategories.slice(0, 5).map((sub) => (
                            <button
                              key={sub}
                              type="button"
                              onClick={() => {
                                onSelectBestOf(catGroup.name, sub);
                                onClose();
                              }}
                              className="w-full text-left text-xs text-[#4A544D] hover:text-[#0F4C2E] hover:bg-[#FAF8F5] px-2.5 py-1.5 rounded-md transition-colors flex items-center justify-between group/sub cursor-pointer"
                            >
                              <span className="font-medium truncate">{isNl ? sub : `Die besten ${sub}`}</span>
                              <ChevronRight className="w-3 h-3 text-[#C5BFAF] group-hover/sub:text-[#0F4C2E] group-hover/sub:translate-x-0.5 transition-all" />
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Footer Link */}
                      <button
                        type="button"
                        onClick={() => {
                          onSelectBestOf(catGroup.name);
                          onClose();
                        }}
                        className="mt-4 pt-2.5 border-t border-[#F3F0EA] text-[11px] font-bold text-[#0F4C2E] hover:text-[#D65F0C] flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <span>{isNl ? `Alle ${catGroup.name} bekijken` : `Alle Top-${catGroup.name} ansehen`}</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Bottom Quick Bar */}
              <div className="mt-8 pt-5 border-t border-[#EDE8E0] bg-[#FAF8F5] rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#5F6B63]">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#F2761B]" />
                  <span>
                    {isNl
                      ? 'Transparante beoordelingen: Alle geregistreerde bedrijven worden gerangschikt op basis van echte recensies en sterren.'
                      : 'Transparente Rankings: Alle eingetragenen Betriebe werden neutral anhand verifizierter Kundenbewertungen sortiert.'}
                  </span>
                </div>
                <div className="flex items-center gap-4 shrink-0 font-medium">
                  <span className="flex items-center gap-1"><span className="text-amber-500 font-bold">🥇</span> Platz 1</span>
                  <span className="flex items-center gap-1"><span className="text-gray-400 font-bold">🥈</span> Platz 2</span>
                  <span className="flex items-center gap-1"><span className="text-amber-700 font-bold">🥉</span> Platz 3</span>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
export default MegaMenuBestOf;
