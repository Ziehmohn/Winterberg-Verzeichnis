import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, 
  Star, 
  MapPin, 
  Phone, 
  Globe, 
  ArrowRight, 
  Check, 
  Sparkles, 
  FileDown, 
  ExternalLink, 
  Award, 
  Filter, 
  UtensilsCrossed, 
  CalendarDays, 
  Siren, 
  FileCheck, 
  ShieldCheck, 
  ChevronRight,
  ArrowLeft,
  Info,
  HelpCircle,
  Scale
} from 'lucide-react';
import { Business, CategoryGroup, ThemeConfig } from '../types';
import { useTranslation } from '../i18n';
import BusinessCategoryIcon from './BusinessCategoryIcon';
import { getLocalizedBusiness } from '../utils/translator';
import { getCategorySlug, getSubcategorySlug } from '../utils/routes';
import { getBestOfTitle, BEST_OF_DISCLAIMER, SUBCATEGORY_PLURALS } from '../utils/bestOfTitles';
import { RankingInfoModal } from './RankingInfoModal';

interface BestOfPageProps {
  theme: ThemeConfig;
  activeThemeKey: string;
  categories: CategoryGroup[];
  businesses: Business[];
  selectedCategory?: string;
  selectedSubcategory?: string;
  onSelectCategory: (category: string, subcategory?: string) => void;
  onSelectBusiness: (business: Business) => void;
  onBack: () => void;
  getPath: (path: string) => string;
}

export default function BestOfPage({
  theme,
  activeThemeKey,
  categories,
  businesses,
  selectedCategory = 'Alle',
  selectedSubcategory,
  onSelectCategory,
  onSelectBusiness,
  onBack,
  getPath
}: BestOfPageProps) {
  const { t, lang } = useTranslation();
  const isNl = lang === 'nl';

  const [activeCategory, setActiveCategory] = useState<string>(selectedCategory || 'Alle');
  const [activeSubcategory, setActiveSubcategory] = useState<string | undefined>(selectedSubcategory);
  const [activeDistrict, setActiveDistrict] = useState<string>('Alle');

  // Modal State for transparency info dialog
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTopic, setModalTopic] = useState<'score' | 'verified'>('score');

  const openInfoModal = (topic: 'score' | 'verified') => {
    setModalTopic(topic);
    setIsModalOpen(true);
  };

  useEffect(() => {
    if (selectedCategory) setActiveCategory(selectedCategory);
    setActiveSubcategory(selectedSubcategory);
  }, [selectedCategory, selectedSubcategory]);

  // Compute Bayesian/Weighted Score for each business
  const scoredBusinesses = useMemo(() => {
    return businesses.map(b => {
      const approvedReviews = (b.reviews || []).filter(r => r.status === 'approved');
      const count = approvedReviews.length;
      let avg = 0;
      let score = 0;
      
      if (count > 0) {
        avg = approvedReviews.reduce((sum, r) => sum + (Number(r.rating) || 5), 0) / count;
        // Bayesian weighted score to balance rating and review count
        const priorRating = 4.6;
        const priorWeight = 2;
        score = (avg * count + priorRating * priorWeight) / (count + priorWeight);
      } else {
        // Unrated businesses have a baseline ranking below rated ones
        avg = 0;
        score = b.isVerified ? 1.5 : 1.0;
      }

      return {
        ...b,
        computedAvg: avg > 0 ? avg.toFixed(1) : null,
        reviewCount: count,
        rankingScore: score,
      };
    });
  }, [businesses]);

  // Filter businesses by active category, subcategory and district
  const rankedList = useMemo(() => {
    return scoredBusinesses.filter(b => {
      // Category Match
      let matchesCat = true;
      if (activeCategory && activeCategory !== 'Alle' && activeCategory !== 'all') {
        const inAdditional = b.additionalCategories?.some(ac => ac.category === activeCategory || ac.subcategory === activeCategory);
        matchesCat = b.category === activeCategory || b.subcategory === activeCategory || !!inAdditional;
      }

      // Subcategory Match
      let matchesSub = true;
      if (activeSubcategory && activeSubcategory !== 'Alle') {
        const inAdditionalSub = b.additionalCategories?.some(ac => ac.subcategory === activeSubcategory);
        matchesSub = b.subcategory === activeSubcategory || !!inAdditionalSub;
      }

      // District Match
      let matchesDistrict = true;
      if (activeDistrict !== 'Alle') {
        const bDistrict = b.district || (b.address && b.address.split(',')[1]?.trim().split(' ')[1]) || 'Winterberg';
        matchesDistrict = bDistrict === activeDistrict;
      }

      return matchesCat && matchesSub && matchesDistrict;
    }).sort((a, b) => {
      if (b.rankingScore !== a.rankingScore) {
        return b.rankingScore - a.rankingScore;
      }
      if (b.isPremium !== a.isPremium) {
        return (b.isPremium ? 1 : 0) - (a.isPremium ? 1 : 0);
      }
      return a.name.localeCompare(b.name);
    });
  }, [scoredBusinesses, activeCategory, activeSubcategory, activeDistrict]);

  const activeCategoryObj = categories.find(c => c.name === activeCategory);
  const subcategoriesList = activeCategoryObj ? activeCategoryObj.subcategories : [];

  // Grammatically correct & descriptive SEO Headline
  const pageHeading = useMemo(() => {
    return getBestOfTitle(activeCategory, activeSubcategory, lang);
  }, [activeCategory, activeSubcategory, lang]);

  // Schema.org ItemList Structured Data for Google Rich Results
  const schemaOrgItemList = useMemo(() => {
    return {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": `${pageHeading} in Winterberg`,
      "description": `Offizielle Bestenliste der am besten bewerteten Unternehmen in Winterberg – ${pageHeading}`,
      "itemListOrder": "https://schema.org/ItemListOrderDescending",
      "numberOfItems": Math.min(rankedList.length, 10),
      "itemListElement": rankedList.slice(0, 10).map((b, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": b.name,
        "url": `https://www.winterberg-verzeichnis.de${getPath(`/${getCategorySlug(b.category, 'de')}/${b.subcategory ? getSubcategorySlug(b.subcategory, 'de') + '/' : ''}${b.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`)}`,
        "description": b.description
      }))
    };
  }, [pageHeading, rankedList, getPath]);

  // Update document title and structured data in head
  useEffect(() => {
    document.title = `${pageHeading} in Winterberg (2026) | ${isNl ? 'De Winterberg Bedrijvengids' : 'Das Winterberg Verzeichnis'}`;
    
    const scriptId = 'schema-bestof-itemlist';
    let scriptTag = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = scriptId;
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }
    scriptTag.textContent = JSON.stringify(schemaOrgItemList);

    return () => {
      const el = document.getElementById(scriptId);
      if (el) el.remove();
    };
  }, [pageHeading, schemaOrgItemList, isNl]);

  return (
    <>
      <main className="flex-1 w-full max-w-[1100px] mx-auto px-4 sm:px-6 py-8 pb-20">
        {/* Back button */}
        <button 
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-bold text-[#5F6B63] hover:text-[#0F4C2E] mb-6 transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>{isNl ? 'Terug naar overzicht' : 'Zurück zur Übersicht'}</span>
        </button>

        {/* Hero Header */}
        <div className="bg-gradient-to-br from-[#0F4C2E] to-[#06301C] rounded-2xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden mb-8">
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl pointer-events-none" />
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/15 border border-white/20 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase mb-4 shadow-xs">
              <Trophy className="w-3.5 h-3.5 text-amber-300" />
              <span>{isNl ? 'Officiële Ranglijst 2026' : 'Offizielle Bestenliste 2026'}</span>
            </div>

            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mb-3 tracking-tight leading-tight">
              {pageHeading} in Winterberg
            </h1>

            <p className="text-white/85 text-sm sm:text-base leading-relaxed mb-6 max-w-2xl">
              {isNl
                ? 'Gebaseerd op echte klantbeoordelingen, geteste kwaliteit en service. Ontdek de populairste adressen in Winterberg en omgeving.'
                : 'Ermittelt auf Basis echter Kundenbewertungen, verifizierter Qualität und regionaler Beliebtheit. Entdecken Sie die Spitzenreiter in Winterberg und den Ortsteilen.'}
            </p>

            {/* Quick Metrics & Transparency badge */}
            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-white/90">
              <span className="bg-white/10 px-3 py-1.5 rounded-lg border border-white/15 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-300" />
                {rankedList.length} {isNl ? 'bedrijven geklasseerd' : 'Betriebe im Ranking'}
              </span>

              {/* Clickable Transparency Badge */}
              <button
                type="button"
                onClick={() => openInfoModal('score')}
                className="bg-white/15 hover:bg-white/25 px-3 py-1.5 rounded-lg border border-white/25 flex items-center gap-1.5 transition-all cursor-pointer group/badge"
                title="Erfahren Sie, wie der gewichtete Score berechnet wird"
              >
                <Scale className="w-4 h-4 text-amber-300" />
                <span>{isNl ? 'Gewogen Score' : '100% Bewertungsbasiert'}</span>
                <HelpCircle className="w-3.5 h-3.5 text-white/70 group-hover/badge:text-white group-hover/badge:scale-110 transition-transform ml-0.5" />
              </button>

              <button
                type="button"
                onClick={() => openInfoModal('verified')}
                className="bg-white/15 hover:bg-white/25 px-3 py-1.5 rounded-lg border border-white/25 flex items-center gap-1.5 transition-all cursor-pointer group/vbadge"
                title="Was bedeutet Verifiziert?"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-300" />
                <span>{isNl ? 'Geverifieerd' : 'Verifiziert & Spamschutz'}</span>
                <HelpCircle className="w-3.5 h-3.5 text-white/70 group-hover/vbadge:text-white group-hover/vbadge:scale-110 transition-transform ml-0.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Transparency Note Box with Clickable Info Triggers */}
        <div className="bg-[#FAF8F5] border border-[#E7E2DA] rounded-xl p-4 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-[#5F6B63] shadow-xs">
          <div className="flex items-start gap-3">
            <Info className="w-4 h-4 text-[#0F4C2E] shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong className="text-[#1B211D]">{isNl ? 'Transparantie-opmerking: ' : 'Transparenzhinweis: '}</strong>
              {isNl ? BEST_OF_DISCLAIMER.nl.short : BEST_OF_DISCLAIMER.de.short}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-[#E7E2DA] w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={() => openInfoModal('score')}
              className="inline-flex items-center gap-1 text-[#0F4C2E] hover:text-[#F2761B] font-bold underline transition-colors cursor-pointer"
            >
              <Scale className="w-3.5 h-3.5" />
              <span>{isNl ? 'Berekening' : 'Score-Berechnung'}</span>
            </button>
            <span className="text-[#D8D2C8]">•</span>
            <button
              type="button"
              onClick={() => openInfoModal('verified')}
              className="inline-flex items-center gap-1 text-[#0F4C2E] hover:text-[#F2761B] font-bold underline transition-colors cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{isNl ? 'Verificatie' : 'Verifizierung'}</span>
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="space-y-4 mb-8 bg-white border border-[#EDE8E0] rounded-xl p-4 sm:p-5 shadow-xs">
          {/* Main Categories */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <button
              type="button"
              onClick={() => {
                setActiveCategory('Alle');
                setActiveSubcategory(undefined);
                onSelectCategory('Alle');
              }}
              className={`px-4 py-2 rounded-lg text-xs font-bold shrink-0 transition-all cursor-pointer ${
                activeCategory === 'Alle' || activeCategory === 'all'
                  ? 'bg-[#0F4C2E] text-white shadow-sm'
                  : 'bg-[#FAF8F5] text-[#5F6B63] hover:bg-[#E8F1EB] hover:text-[#0F4C2E] border border-[#EDE8E0]'
              }`}
            >
              {isNl ? 'Alle Categorieën' : '🏆 Alle Kategorien'}
            </button>

            {categories.map((cat) => {
              const isSelected = activeCategory === cat.name;
              return (
                <button
                  key={cat.name}
                  type="button"
                  onClick={() => {
                    setActiveCategory(cat.name);
                    setActiveSubcategory(undefined);
                    onSelectCategory(cat.name);
                  }}
                  className={`px-4 py-2 rounded-lg text-xs font-bold shrink-0 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#0F4C2E] text-white shadow-sm'
                      : 'bg-[#FAF8F5] text-[#5F6B63] hover:bg-[#E8F1EB] hover:text-[#0F4C2E] border border-[#EDE8E0]'
                  }`}
                >
                  {t(cat.name)}
                </button>
              );
            })}
          </div>

          {/* Subcategories (if main category selected) */}
          {subcategoriesList.length > 0 && (
            <div className="pt-3 border-t border-[#F3F0EA] flex items-center gap-1.5 flex-wrap">
              <span className="text-xs font-bold text-[#8A928B] mr-1">{isNl ? 'Spezialisierung:' : 'Spezialisierung:'}</span>
              <button
                type="button"
                onClick={() => {
                  setActiveSubcategory(undefined);
                  onSelectCategory(activeCategory);
                }}
                className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors cursor-pointer ${
                  !activeSubcategory
                    ? 'bg-[#F2761B] text-white'
                    : 'bg-[#FAF8F5] text-[#4A544D] hover:bg-[#FFF1E4] hover:text-[#D65F0C] border border-[#EDE8E0]'
                }`}
              >
                {isNl ? 'Alle' : 'Alle'}
              </button>
              {subcategoriesList.map(sub => {
                const isSubSelected = activeSubcategory === sub;
                const subPluralTitle = SUBCATEGORY_PLURALS[sub]
                  ? (isNl ? SUBCATEGORY_PLURALS[sub].titleNl : SUBCATEGORY_PLURALS[sub].titleDe)
                  : t(sub);

                return (
                  <button
                    key={sub}
                    type="button"
                    onClick={() => {
                      setActiveSubcategory(sub);
                      onSelectCategory(activeCategory, sub);
                    }}
                    className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors cursor-pointer ${
                      isSubSelected
                        ? 'bg-[#F2761B] text-white shadow-xs font-semibold'
                        : 'bg-[#FAF8F5] text-[#4A544D] hover:bg-[#FFF1E4] hover:text-[#D65F0C] border border-[#EDE8E0]'
                    }`}
                  >
                    {subPluralTitle}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Ranking List */}
        <div className="space-y-6">
          {rankedList.slice(0, 10).map((business, index) => {
            const rank = index + 1;
            const localized = getLocalizedBusiness(business, lang);
            const medalIcon = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : null;

            return (
              <article
                key={business.id}
                className={`rounded-2xl transition-all duration-300 relative ${
                  business.isPremium
                    ? 'bg-white border-2 border-[#F2761B]/30 hover:border-[#F2761B] shadow-[0_8px_30px_rgba(242,118,27,0.08)] hover:shadow-[0_12px_36px_rgba(242,118,27,0.14)] p-6 sm:p-7'
                    : 'bg-white border border-[#EDE8E0] hover:border-[#0F4C2E]/40 shadow-xs hover:shadow-md p-5 sm:p-6'
                }`}
              >
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  {/* Left: Rank Badge + Image/Logo */}
                  <div className="flex sm:flex-col items-center gap-3 shrink-0">
                    {/* Rank Medal Badge */}
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center font-display font-extrabold text-lg shadow-sm ${
                        rank === 1
                          ? 'bg-gradient-to-br from-amber-300 to-amber-500 text-amber-950 border border-amber-300'
                          : rank === 2
                          ? 'bg-gradient-to-br from-slate-200 to-slate-400 text-slate-900 border border-slate-300'
                          : rank === 3
                          ? 'bg-gradient-to-br from-amber-600 to-amber-800 text-white border border-amber-700'
                          : 'bg-[#FAF8F5] text-[#0F4C2E] border border-[#E7E2DA]'
                      }`}
                    >
                      {medalIcon ? (
                        <span className="text-2xl leading-none select-none">{medalIcon}</span>
                      ) : (
                        <span>#{rank}</span>
                      )}
                    </div>

                    {/* Thumbnail Image or Logo (Enhanced for Premium) */}
                    {business.isPremium ? (
                      <div 
                        onClick={() => onSelectBusiness(business)}
                        className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden border border-[#EDE8E0] bg-[#FAF8F5] shrink-0 cursor-pointer group/img relative shadow-2xs"
                      >
                        {business.logoUrl ? (
                          <div 
                            className="w-full h-full flex items-center justify-center p-2"
                            style={{ backgroundColor: business.logoBgColor || '#ffffff' }}
                          >
                            <img 
                              src={business.logoUrl} 
                              alt={business.name} 
                              className="max-w-full max-h-full object-contain group-hover/img:scale-105 transition-transform" 
                            />
                          </div>
                        ) : business.headerImage || (business.gallery && business.gallery[0]) ? (
                          <img 
                            src={business.headerImage || business.gallery?.[0]} 
                            alt={business.name} 
                            className="w-full h-full object-cover group-hover/img:scale-105 transition-transform" 
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <BusinessCategoryIcon 
                              category={business.category} 
                              subcategory={business.subcategory} 
                              name={business.name} 
                              isPremium={true} 
                            />
                          </div>
                        )}
                      </div>
                    ) : (
                      <div 
                        onClick={() => onSelectBusiness(business)}
                        className="w-14 h-14 rounded-xl overflow-hidden border border-[#EDE8E0] bg-[#FAF8F5] flex items-center justify-center shrink-0 cursor-pointer"
                      >
                        <BusinessCategoryIcon 
                          category={business.category} 
                          subcategory={business.subcategory} 
                          name={business.name} 
                          isPremium={false} 
                        />
                      </div>
                    )}
                  </div>

                  {/* Center: Business Information */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1.5">
                      <span className="bg-[#FAF8F5] text-[#0F4C2E] border border-[#E7E2DA] px-2.5 py-0.5 rounded text-xs font-semibold">
                        {t(business.category)}
                      </span>
                      {business.subcategory && (
                        <span className="bg-[#FAF8F5] text-[#5F6B63] border border-[#E7E2DA] px-2.5 py-0.5 rounded text-xs">
                          {t(business.subcategory)}
                        </span>
                      )}
                      {business.isPremium && (
                        <span className="bg-[#F2761B] text-white text-[11px] font-bold px-2.5 py-0.5 rounded uppercase tracking-wider flex items-center gap-1 shadow-2xs">
                          <Sparkles className="w-3 h-3" />
                          Top-Partner
                        </span>
                      )}
                      
                      {/* Clickable Verified Badge with ? icon */}
                      {business.isVerified && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            openInfoModal('verified');
                          }}
                          className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[11px] font-medium px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1 transition-colors cursor-pointer"
                          title="Was bedeutet 'Verifiziert'? Hier klicken für Details"
                        >
                          <span>✓ Verifiziert</span>
                          <HelpCircle className="w-3 h-3 text-emerald-700" />
                        </button>
                      )}
                    </div>

                    {/* Title */}
                    <h2 
                      onClick={() => onSelectBusiness(business)}
                      className="font-display text-xl sm:text-2xl font-bold text-[#1B211D] hover:text-[#0F4C2E] cursor-pointer transition-colors leading-tight mb-2"
                    >
                      {business.name}
                    </h2>

                    {/* Rating & Address (with clickable score help icon or first review CTA) */}
                    <div className="flex items-center gap-4 flex-wrap text-sm text-[#5F6B63] mb-3">
                      {business.reviewCount > 0 && business.computedAvg ? (
                        <div 
                          onClick={() => openInfoModal('score')}
                          className="flex items-center gap-1.5 bg-[#FFF8F1] hover:bg-[#FFF1E4] border border-orange-200/80 px-2.5 py-1 rounded-md transition-colors cursor-pointer group/score"
                          title="Informationen zur Berechnung des Scores"
                        >
                          <span className="text-amber-500 tracking-wider">
                            {'★'.repeat(Math.round(Number(business.computedAvg)))}
                            {'☆'.repeat(5 - Math.round(Number(business.computedAvg)))}
                          </span>
                          <span className="font-bold text-[#1B211D] text-xs">{business.computedAvg}</span>
                          <span className="text-[11px] text-[#8A928B]">({business.reviewCount} {isNl ? 'beoordelingen' : 'Bewertungen'})</span>
                          <HelpCircle className="w-3 h-3 text-orange-400 group-hover/score:text-[#F2761B] ml-0.5 transition-colors" />
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => onSelectBusiness(business)}
                          className="inline-flex items-center gap-1.5 bg-[#FAF8F5] hover:bg-[#E8F1EB] text-[#0F4C2E] border border-[#EDE8E0] hover:border-[#0F4C2E]/30 px-2.5 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer shadow-2xs"
                          title={isNl ? 'Schrijf de eerste beoordeling' : 'Jetzt erste Bewertung abgeben'}
                        >
                          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                          <span>{isNl ? 'Geef de eerste beoordeling' : 'Gebe die erste Bewertung ab'}</span>
                        </button>
                      )}

                      <span className="flex items-center gap-1 text-xs">
                        <MapPin className="w-3.5 h-3.5 text-[#0F4C2E]" />
                        {business.address}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-[#4A544D] line-clamp-2 leading-relaxed mb-4">
                      {localized.description}
                    </p>

                    {/* Feature Badges (for Premium) */}
                    {business.isPremium && Array.isArray(business.featureBadges) && business.featureBadges.length > 0 && (
                      <div className="flex items-center gap-1.5 flex-wrap mb-4">
                        {business.featureBadges.slice(0, 4).map((badge, bIdx) => (
                          <span key={bIdx} className="bg-[#E8F1EB] text-[#0F4C2E] text-xs font-medium px-2.5 py-1 rounded-full border border-[#0F4C2E]/15">
                            {badge}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Services / Products Tags */}
                    {Array.isArray(localized.services) && localized.services.length > 0 && (
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {localized.services.slice(0, business.isPremium ? 5 : 3).map((svc, sIdx) => (
                          <span key={sIdx} className="text-xs bg-[#FAF8F5] text-[#5F6B63] border border-[#EDE8E0] px-2 py-0.5 rounded">
                            {svc}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Right: Actions & Premium Highlights */}
                  <div className="w-full md:w-56 shrink-0 flex flex-col gap-2 pt-3 md:pt-0 border-t md:border-t-0 border-[#EDE8E0]">
                    <button
                      type="button"
                      onClick={() => onSelectBusiness(business)}
                      className="w-full bg-[#0F4C2E] hover:bg-[#06301C] text-white font-bold text-xs py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                    >
                      <span>{isNl ? 'Bekijk Profiel' : 'Profil ansehen'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    {/* Premium Action CTA (e.g. Table Booking, Emergency Hotline, Tickets) */}
                    {business.isPremium && business.customCta?.text && business.customCta?.url && (
                      <a
                        href={business.customCta.url}
                        target={business.customCta.url.startsWith('http') ? '_blank' : undefined}
                        rel={business.customCta.url.startsWith('http') ? 'noopener noreferrer' : undefined}
                        className={`w-full py-2 px-3 rounded-lg text-xs font-bold text-center transition-all flex items-center justify-center gap-1.5 shadow-xs ${
                          business.customCta.type === 'emergency'
                            ? 'bg-red-600 hover:bg-red-700 text-white'
                            : business.customCta.type === 'table'
                            ? 'bg-[#F2761B] hover:bg-[#D65F0C] text-white'
                            : 'bg-[#E8F1EB] hover:bg-[#D6E7DC] text-[#0F4C2E]'
                        }`}
                      >
                        {business.customCta.type === 'table' && <UtensilsCrossed className="w-3.5 h-3.5" />}
                        {business.customCta.type === 'emergency' && <Siren className="w-3.5 h-3.5" />}
                        {business.customCta.type === 'booking' && <CalendarDays className="w-3.5 h-3.5" />}
                        <span>{business.customCta.text}</span>
                      </a>
                    )}

                    {/* PDF Document Button (for Premium) */}
                    {business.isPremium && Array.isArray(business.documents) && business.documents.length > 0 && (
                      <a
                        href={business.documents[0].url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full bg-white hover:bg-[#FAF8F5] border border-[#EDE8E0] text-[#0F4C2E] font-semibold text-xs py-2 px-3 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                      >
                        <FileDown className="w-3.5 h-3.5 text-[#F2761B]" />
                        <span className="truncate">{business.documents[0].title}</span>
                      </a>
                    )}

                    {/* Free Upgrade Callout for Owners */}
                    {!business.isPremium && (
                      <div className="bg-[#FAF8F5] border border-dashed border-[#D8D2C8] rounded-lg p-2.5 text-center mt-1">
                        <span className="text-[11px] text-[#8A928B] block mb-1">
                          {isNl ? 'Bent u de eigenaar?' : 'Sind Sie Inhaber?'}
                        </span>
                        <a
                          href="/preise"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] font-bold text-[#F2761B] hover:underline flex items-center justify-center gap-1"
                        >
                          <Sparkles className="w-3 h-3" />
                          <span>{isNl ? 'Profiel upgraden' : 'Eintrag hervorheben'}</span>
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </article>
            );
          })}

          {rankedList.length === 0 && (
            <div className="bg-white border border-[#EDE8E0] rounded-xl p-12 text-center text-[#5F6B63]">
              <Trophy className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <h3 className="font-bold text-base text-[#1B211D] mb-1">
                {isNl ? 'Geen bedrijven gevonden in deze categorie' : 'Keine Betriebe in dieser Auswahl gefunden'}
              </h3>
              <p className="text-xs">
                {isNl
                  ? 'Probeer een andere categorie of filter om meer resultaten te zien.'
                  : 'Wählen Sie eine andere Kategorie oder heben Sie die Filter auf.'}
              </p>
            </div>
          )}
        </div>

        {/* Detailed Legal & Transparency Box at the bottom with Dialog Buttons */}
        <div className="mt-12 bg-white border border-[#EDE8E0] rounded-2xl p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col md:flex-row items-start justify-between gap-6">
            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-lg bg-emerald-50 text-[#0F4C2E] border border-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display text-base font-bold text-[#1B211D] mb-1.5 flex items-center gap-2">
                  <span>{isNl ? BEST_OF_DISCLAIMER.nl.fullTitle : BEST_OF_DISCLAIMER.de.fullTitle}</span>
                  <HelpCircle className="w-4 h-4 text-[#5F6B63] cursor-pointer hover:text-[#0F4C2E]" onClick={() => openInfoModal('score')} />
                </h3>
                <p className="text-xs text-[#5F6B63] leading-relaxed">
                  {isNl ? BEST_OF_DISCLAIMER.nl.fullText : BEST_OF_DISCLAIMER.de.fullText}
                </p>
              </div>
            </div>

            <div className="flex flex-row md:flex-col gap-2 shrink-0 self-end md:self-auto w-full md:w-auto">
              <button
                type="button"
                onClick={() => openInfoModal('score')}
                className="flex-1 md:flex-none px-4 py-2 bg-[#FAF8F5] hover:bg-[#E8F1EB] text-[#0F4C2E] border border-[#EDE8E0] hover:border-[#0F4C2E]/30 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <Scale className="w-3.5 h-3.5 text-[#F2761B]" />
                <span>{isNl ? 'Kwaliteitsscore Uitleg' : 'Score-Erklärung'}</span>
              </button>

              <button
                type="button"
                onClick={() => openInfoModal('verified')}
                className="flex-1 md:flex-none px-4 py-2 bg-[#FAF8F5] hover:bg-[#E8F1EB] text-[#0F4C2E] border border-[#EDE8E0] hover:border-[#0F4C2E]/30 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>{isNl ? 'Verificatie Uitleg' : 'Verifizierung'}</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Global Transparency Modal */}
      <RankingInfoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialTopic={modalTopic}
      />
    </>
  );
}
