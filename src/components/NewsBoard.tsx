import React, { useState, useEffect, useMemo } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import { NewsArticle, ThemeConfig } from '../types';
import { useTranslation } from '../i18n';
import { getLocalizedNewsArticle } from '../utils/translator';
import { initialNews } from '../dataNews';
import { getCachedItem, setCachedItem, CACHE_KEYS, CACHE_TTLS } from '../utils/dbCache';
import { 
  NEWS_CATEGORIES, 
  normalizeNewsCategory, 
  getNewsCategoryLabel, 
  getNewsCategoryBadgeClass 
} from '../utils/newsFilters';
import { 
  Search, 
  Calendar, 
  Building2, 
  X, 
  SlidersHorizontal, 
  ArrowUpDown, 
  Newspaper,
  UtensilsCrossed,
  PartyPopper,
  Compass,
  Briefcase,
  HeartPulse,
  Sparkles
} from 'lucide-react';

interface NewsBoardProps {
  theme: ThemeConfig;
  activeThemeKey: string;
  onNewsClick: (newsId: string) => void;
}

function stripMarkdown(text: string): string {
  if (!text) return '';
  return text
    .replace(/:::[a-zA-Z0-9_-]+[\s\S]*?:::/gi, '')
    .replace(/:::[a-zA-Z0-9_-]+/gi, '')
    .replace(/:::/g, '')
    .replace(/##+\s+/g, '')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[-*•]\s+/g, '')
    .replace(/\n+/g, ' ')
    .trim();
}

export function generateSlug(title: string): string {
  if (!title) return '';
  return title
    .toLowerCase()
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export default function NewsBoard({ theme, activeThemeKey, onNewsClick }: NewsBoardProps) {
  const { t, lang } = useTranslation();
  const isNl = lang === 'nl';

  const [news, setNews] = useState<NewsArticle[]>(() => {
    const cached = getCachedItem<NewsArticle[]>(CACHE_KEYS.NEWS, CACHE_TTLS.NEWS, true);
    const map = new Map<string, NewsArticle>();
    initialNews.forEach(n => map.set(n.id, n));
    if (cached && Array.isArray(cached)) {
      cached.forEach(n => { const existing = map.get(n.id); map.set(n.id, existing ? { ...existing, ...n } : n); });
    }
    return Array.from(map.values()).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  });

  const [loading, setLoading] = useState(() => {
    const cached = getCachedItem<NewsArticle[]>(CACHE_KEYS.NEWS, CACHE_TTLS.NEWS);
    return !cached && (!initialNews || initialNews.length === 0);
  });

  // Filter state with URL query param support
  const [searchQuery, setSearchQuery] = useState(() => {
    if (typeof window === 'undefined') return '';
    const p = new URLSearchParams(window.location.search);
    return p.get('q') || p.get('suche') || '';
  });

  const [selectedCategory, setSelectedCategory] = useState<string>(() => {
    if (typeof window === 'undefined') return 'all';
    const p = new URLSearchParams(window.location.search);
    return p.get('kategorie') || p.get('category') || 'all';
  });

  const [selectedPeriod, setSelectedPeriod] = useState<string>(() => {
    if (typeof window === 'undefined') return 'all';
    const p = new URLSearchParams(window.location.search);
    return p.get('zeitraum') || p.get('period') || 'all';
  });

  const [selectedBusiness, setSelectedBusiness] = useState<string>(() => {
    if (typeof window === 'undefined') return 'all';
    const p = new URLSearchParams(window.location.search);
    return p.get('unternehmen') || p.get('business') || 'all';
  });

  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');

  // Keep URL search params in sync when filters change
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const url = new URL(window.location.href);

    if (searchQuery.trim()) url.searchParams.set('q', searchQuery.trim());
    else url.searchParams.delete('q');

    if (selectedCategory && selectedCategory !== 'all') url.searchParams.set('category', selectedCategory);
    else url.searchParams.delete('category');

    if (selectedPeriod && selectedPeriod !== 'all') url.searchParams.set('period', selectedPeriod);
    else url.searchParams.delete('period');

    if (selectedBusiness && selectedBusiness !== 'all') url.searchParams.set('business', selectedBusiness);
    else url.searchParams.delete('business');

    window.history.replaceState(null, '', url.toString());
  }, [searchQuery, selectedCategory, selectedPeriod, selectedBusiness]);

  useEffect(() => {
    const fetchNews = async () => {
      // 1. Show cached merged news immediately, then revalidate in background
      const fresh = getCachedItem<NewsArticle[]>(CACHE_KEYS.NEWS, CACHE_TTLS.NEWS);
      if (fresh && fresh.length > 0) {
        const map = new Map<string, NewsArticle>();
        initialNews.forEach(n => map.set(n.id, n));
        fresh.forEach(n => { const existing = map.get(n.id); map.set(n.id, existing ? { ...existing, ...n } : n); });
        const merged = Array.from(map.values()).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setNews(merged);
        setLoading(false);
      }

      try {
        const q = query(collection(db, 'news'), where('status', '==', 'approved'));
        const snapshot = await getDocs(q);
        const fetched = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as NewsArticle));
        const map = new Map<string, NewsArticle>();
        initialNews.forEach(n => map.set(n.id, n));
        fetched.forEach(n => { const existing = map.get(n.id); map.set(n.id, existing ? { ...existing, ...n } : n); });
        const merged = Array.from(map.values()).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setNews(merged);
        setCachedItem(CACHE_KEYS.NEWS, merged);
      } catch (e) {
        console.warn("Error fetching news from Firestore (quota or offline), using cached/initial news:", e);
        const fallback = getCachedItem<NewsArticle[]>(CACHE_KEYS.NEWS, CACHE_TTLS.NEWS, true) || initialNews;
        const map = new Map<string, NewsArticle>();
        initialNews.forEach(n => map.set(n.id, n));
        if (Array.isArray(fallback)) {
          fallback.forEach(n => { const existing = map.get(n.id); map.set(n.id, existing ? { ...existing, ...n } : n); });
        }
        setNews(Array.from(map.values()).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  // Distinct businesses with news count
  const availableBusinesses = useMemo(() => {
    const counts = new Map<string, number>();
    news.forEach(n => {
      const bName = n.businessName?.trim();
      if (bName) {
        counts.set(bName, (counts.get(bName) || 0) + 1);
      }
    });
    return Array.from(counts.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => a.name.localeCompare(b.name, isNl ? 'nl' : 'de'));
  }, [news, isNl]);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: news.length };
    NEWS_CATEGORIES.forEach(c => {
      if (c.id !== 'all') counts[c.id] = 0;
    });
    news.forEach(item => {
      const cat = normalizeNewsCategory(item.category, item);
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return counts;
  }, [news]);

  // Date period helper
  const isWithinPeriod = (dateStr: string, period: string) => {
    if (period === 'all') return true;
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return true;
    const now = new Date();

    if (period === '30days') {
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      return d >= thirtyDaysAgo;
    }
    if (period === '90days') {
      const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      return d >= ninetyDaysAgo;
    }
    if (period === '2026') {
      return d.getFullYear() === 2026;
    }
    if (period === '2025') {
      return d.getFullYear() <= 2025;
    }
    return true;
  };

  // Filtered and sorted news
  const filteredNews = useMemo(() => {
    return news.filter(rawItem => {
      const item = getLocalizedNewsArticle(rawItem, lang);
      const cat = normalizeNewsCategory(rawItem.category, rawItem);

      // Category filter
      if (selectedCategory !== 'all' && cat !== selectedCategory) {
        return false;
      }

      // Period filter
      if (selectedPeriod !== 'all' && !isWithinPeriod(rawItem.date, selectedPeriod)) {
        return false;
      }

      // Business filter
      if (selectedBusiness !== 'all') {
        const bName = rawItem.businessName?.trim().toLowerCase();
        if (!bName || bName !== selectedBusiness.toLowerCase()) {
          return false;
        }
      }

      // Text search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const titleMatch = (item.title || '').toLowerCase().includes(q);
        const contentMatch = (item.content || '').toLowerCase().includes(q);
        const authorMatch = (item.author || '').toLowerCase().includes(q);
        const businessMatch = (item.businessName || '').toLowerCase().includes(q);
        if (!titleMatch && !contentMatch && !authorMatch && !businessMatch) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      const timeA = new Date(a.date).getTime();
      const timeB = new Date(b.date).getTime();
      return sortBy === 'newest' ? timeB - timeA : timeA - timeB;
    });
  }, [news, selectedCategory, selectedPeriod, selectedBusiness, searchQuery, sortBy, lang]);

  const hasActiveFilters = searchQuery.trim() !== '' || selectedCategory !== 'all' || selectedPeriod !== 'all' || selectedBusiness !== 'all';

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedPeriod('all');
    setSelectedBusiness('all');
    setSortBy('newest');
  };

  const getCategoryIcon = (catId: string) => {
    switch (catId) {
      case 'all': return <Sparkles className="w-3.5 h-3.5 shrink-0" />;
      case 'gastronomie': return <UtensilsCrossed className="w-3.5 h-3.5 shrink-0 text-amber-700" />;
      case 'events': return <PartyPopper className="w-3.5 h-3.5 shrink-0 text-rose-700" />;
      case 'freizeit': return <Compass className="w-3.5 h-3.5 shrink-0 text-sky-700" />;
      case 'wirtschaft': return <Briefcase className="w-3.5 h-3.5 shrink-0 text-emerald-700" />;
      case 'gesundheit': return <HeartPulse className="w-3.5 h-3.5 shrink-0 text-teal-700" />;
      default: return null;
    }
  };

  const submitPath = isNl ? '/nl/nieuws/indienen' : '/news/einreichen';

  return (
    <div className="max-w-[1100px] mx-auto py-[40px] px-[20px] min-h-[60vh]">
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-[32px] gap-[20px]">
        <div>
          <div className="relative inline-block mb-2">
            <h1 className="font-display text-[34px] md:text-[44px] font-bold tracking-tight text-[#1B211D] relative z-10 inline-block pb-2">
              {t('newsTitle')}
            </h1>
            <svg 
              className="absolute -bottom-1 left-0 w-full h-3 md:h-4 overflow-visible pointer-events-none z-0" 
              viewBox="0 0 300 20" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
            >
              <path 
                d="M 5 15 Q 100 0 200 12 T 295 8" 
                stroke="#ffc084" 
                strokeWidth="6" 
                strokeLinecap="round" 
              />
            </svg>
          </div>
          <p className={`text-[16px] md:text-[17px] ${theme.textMuted}`}>
            {t('newsSubtitle')}
          </p>
        </div>
        <button 
          onClick={() => {
            window.history.pushState(null, '', submitPath);
            window.dispatchEvent(new PopStateEvent('popstate'));
          }}
          className={`px-5 py-2.5 rounded-md font-semibold whitespace-nowrap transition-all shadow-sm hover:shadow ${theme.primaryBtn}`}
        >
          {t('newsSubmit')}
        </button>
      </div>

      {/* Filter and Search Container */}
      <div className="bg-white border border-[#EDE8E0] rounded-xl p-4 md:p-5 mb-8 shadow-sm space-y-3.5">
        {/* Row 1: Search Bar Full Width */}
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A958E] pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isNl ? "Nieuws doorzoeken op trefwoord, bedrijf of onderwerp..." : "News nach Stichwort, Betrieb oder Thema durchsuchen..."}
            className="w-full pl-10 pr-9 py-2.5 text-[14px] bg-[#FAF8F5] border border-[#E2DDD3] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F4C2E]/20 focus:border-[#0F4C2E] transition-all text-[#1B211D] placeholder:text-[#8A958E]"
          />
          {searchQuery && (
            <button 
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-[#8A958E] hover:text-[#1B211D] transition-colors"
              title={isNl ? "Zoekopdracht wissen" : "Suche löschen"}
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Row 2: 3 Filter Dropdowns in a balanced responsive grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
          {/* Period Dropdown */}
          <div className="relative min-w-0 w-full">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A958E] pointer-events-none" />
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              aria-label={isNl ? "Periode filteren" : "Zeitraum filtern"}
              className="w-full pl-9 pr-7 py-2.5 text-[13.5px] bg-[#FAF8F5] border border-[#E2DDD3] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F4C2E]/20 focus:border-[#0F4C2E] text-[#1B211D] font-medium transition-all cursor-pointer appearance-none truncate"
            >
              <option value="all">{isNl ? 'Alle periodes' : 'Alle Zeiten'}</option>
              <option value="30days">{isNl ? 'Laatste 30 dagen' : 'Letzte 30 Tage'}</option>
              <option value="90days">{isNl ? 'Laatste 3 maanden' : 'Letzte 3 Monate'}</option>
              <option value="2026">2026</option>
              <option value="2025">{isNl ? '2025 & ouder' : '2025 & älter'}</option>
            </select>
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#8A958E] text-[11px]">
              ▼
            </div>
          </div>

          {/* Business Dropdown */}
          <div className="relative min-w-0 w-full">
            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A958E] pointer-events-none" />
            <select
              value={selectedBusiness}
              onChange={(e) => setSelectedBusiness(e.target.value)}
              aria-label={isNl ? "Bedrijf filteren" : "Unternehmen filtern"}
              className="w-full pl-9 pr-7 py-2.5 text-[13.5px] bg-[#FAF8F5] border border-[#E2DDD3] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F4C2E]/20 focus:border-[#0F4C2E] text-[#1B211D] font-medium transition-all cursor-pointer appearance-none truncate"
            >
              <option value="all">{isNl ? 'Alle bedrijven' : 'Alle Unternehmen'}</option>
              {availableBusinesses.map(b => (
                <option key={b.name} value={b.name}>
                  {b.name} ({b.count})
                </option>
              ))}
            </select>
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#8A958E] text-[11px]">
              ▼
            </div>
          </div>

          {/* Sort Toggle */}
          <div className="relative min-w-0 w-full">
            <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A958E] pointer-events-none" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest')}
              aria-label={isNl ? "Sortering" : "Sortierung"}
              className="w-full pl-9 pr-7 py-2.5 text-[13.5px] bg-[#FAF8F5] border border-[#E2DDD3] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F4C2E]/20 focus:border-[#0F4C2E] text-[#1B211D] font-medium transition-all cursor-pointer appearance-none truncate"
            >
              <option value="newest">{isNl ? 'Nieuwste eerst' : 'Neueste zuerst'}</option>
              <option value="oldest">{isNl ? 'Oudste eerst' : 'Älteste zuerst'}</option>
            </select>
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#8A958E] text-[11px]">
              ▼
            </div>
          </div>
        </div>

        {/* Row 3: Category Pills (Wrap naturally without horizontal scrollbar) */}
        <div className="pt-2 border-t border-[#F0ECE3]">
          <div className="flex flex-wrap items-center gap-2">
            {NEWS_CATEGORIES.map(cat => {
              const isActive = selectedCategory === cat.id;
              const count = categoryCounts[cat.id] ?? 0;
              const label = isNl ? cat.nameNl : cat.nameDe;

              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[13px] whitespace-nowrap transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-[#0F4C2E] text-white shadow-sm font-semibold'
                      : 'bg-white text-[#4A5568] hover:text-[#1B211D] hover:bg-[#F4F0E9] border border-[#E2DDD3] font-medium'
                  }`}
                >
                  {getCategoryIcon(cat.id)}
                  <span>{label}</span>
                  <span className={`text-[11px] px-1.5 py-0.2 rounded-full font-semibold ${
                    isActive ? 'bg-white/25 text-white' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Filter Chips and Result Count */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#F0ECE3] text-[12.5px] text-[#7C8780]">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium text-[#1B211D]">
              {filteredNews.length} {filteredNews.length === 1 ? (isNl ? 'bericht gevonden' : 'Beitrag gefunden') : (isNl ? 'berichten gevonden' : 'Beiträge gefunden')}
            </span>

            {hasActiveFilters && (
              <>
                <span className="text-[#C8C2B7]">•</span>

                {/* Search chip */}
                {searchQuery.trim() && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#E8F1EB] text-[#0F4C2E] font-medium border border-[#0F4C2E]/20">
                    <span>"{searchQuery.trim()}"</span>
                    <button type="button" onClick={() => setSearchQuery('')} className="hover:text-red-700">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {/* Category chip */}
                {selectedCategory !== 'all' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#E8F1EB] text-[#0F4C2E] font-medium border border-[#0F4C2E]/20">
                    <span>{getNewsCategoryLabel(selectedCategory, lang)}</span>
                    <button type="button" onClick={() => setSelectedCategory('all')} className="hover:text-red-700">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {/* Period chip */}
                {selectedPeriod !== 'all' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#E8F1EB] text-[#0F4C2E] font-medium border border-[#0F4C2E]/20">
                    <span>
                      {selectedPeriod === '30days' ? (isNl ? 'Laatste 30 dagen' : 'Letzte 30 Tage') : 
                       selectedPeriod === '90days' ? (isNl ? 'Laatste 3 maanden' : 'Letzte 3 Monate') : 
                       selectedPeriod === '2026' ? '2026' : (isNl ? '2025 & ouder' : '2025 & älter')}
                    </span>
                    <button type="button" onClick={() => setSelectedPeriod('all')} className="hover:text-red-700">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {/* Business chip */}
                {selectedBusiness !== 'all' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#E8F1EB] text-[#0F4C2E] font-medium border border-[#0F4C2E]/20">
                    <span className="truncate max-w-[180px]">{selectedBusiness}</span>
                    <button type="button" onClick={() => setSelectedBusiness('all')} className="hover:text-red-700">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
              </>
            )}
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={resetFilters}
              className="text-[#0F4C2E] hover:text-[#186841] font-semibold hover:underline inline-flex items-center gap-1 cursor-pointer ml-auto"
            >
              <X className="w-3.5 h-3.5" />
              <span>{isNl ? 'Alle filters wissen' : 'Alle Filter zurücksetzen'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Content State */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-[80px]">
          <div className="w-9 h-9 border-4 border-[#0F4C2E]/20 border-t-[#0F4C2E] rounded-full animate-spin mb-3"></div>
          <p className="text-[14px] text-[#7C8780]">{isNl ? 'Nieuwsberichten laden...' : 'Nachrichten werden geladen...'}</p>
        </div>
      ) : filteredNews.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[26px]">
          {filteredNews.map(rawItem => {
            const item = getLocalizedNewsArticle(rawItem, lang);
            const itemCat = normalizeNewsCategory(rawItem.category, rawItem);
            const catLabel = getNewsCategoryLabel(itemCat, lang);
            const catBadgeClass = getNewsCategoryBadgeClass(itemCat);

            return (
              <div 
                key={rawItem.id}
                onClick={() => onNewsClick(item.slug || rawItem.slug || generateSlug(item.title) || rawItem.id)}
                className="bg-white border border-[#EDE8E0] rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-[#0F4C2E]/40 flex flex-col group"
              >
                {/* Image Section */}
                {item.imageUrl ? (
                  <div className="h-[210px] overflow-hidden bg-[#FAF8F5] relative">
                    <img 
                      src={item.imageUrl} 
                      alt={item.title} 
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                    />
                    {item.isAiGenerated && (
                      <div className="absolute bottom-2.5 right-2.5 bg-black/60 backdrop-blur-md text-white/95 text-[10px] font-medium px-2 py-0.5 rounded pointer-events-none tracking-wide">
                        {t('newsAiCardBadge')}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="h-[210px] bg-[#FAF8F5] flex items-center justify-center">
                    <span className="text-[#8A928B] font-display font-bold text-[24px] opacity-30">NEWS</span>
                  </div>
                )}

                {/* Content Section */}
                <div className="p-5 flex-1 flex flex-col">
                  {/* Category & Date Metadata Row */}
                  <div className="flex items-center gap-[8px] text-[12.5px] text-[#7C8780] mb-[12px] flex-wrap">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border ${catBadgeClass}`}>
                      {catLabel}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-[#C8C2B7]" />
                    <span className="font-medium text-[#7C8780]">
                      {new Date(item.date).toLocaleDateString(isNl ? 'nl-NL' : 'de-DE', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-[#C8C2B7]" />
                    <span className="truncate max-w-[140px]" title={item.author}>
                      {t('newsBy')} <strong className="font-semibold text-[#1B211D]">{item.author}</strong>
                    </span>
                  </div>
                  
                  {/* Title */}
                  <h3 className="font-display text-[19px] font-bold text-[#1B211D] leading-snug mb-[12px] group-hover:text-[#0F4C2E] transition-colors line-clamp-2">
                    {item.title}
                  </h3>
                  
                  {/* Excerpt */}
                  <p className="text-[14px] text-[#5F6B63] line-clamp-3 mb-[20px] leading-relaxed flex-1">
                    {stripMarkdown(item.content)}
                  </p>
                  
                  {/* Business Badge */}
                  {item.businessName && (
                    <div className="inline-block text-[12px] font-bold text-[#0F4C2E] bg-[#E8F1EB] px-2.5 py-1 rounded-md self-start mt-auto border border-[#0F4C2E]/10">
                      {item.businessName}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white border border-dashed border-[#D8D2C8] rounded-xl py-[60px] px-6 text-center shadow-sm max-w-xl mx-auto">
          <div className="w-12 h-12 rounded-full bg-[#FAF8F5] border border-[#EDE8E0] flex items-center justify-center mx-auto mb-4 text-[#8A958E]">
            <Newspaper className="w-6 h-6" />
          </div>
          <p className="text-[18px] text-[#1B211D] font-bold mb-2">
            {hasActiveFilters 
              ? (isNl ? 'Geen nieuwsberichten gevonden' : 'Keine Beiträge für die ausgewählten Filter gefunden')
              : t('newsNoArticles')}
          </p>
          <p className="text-[14px] text-[#7C8780] mb-6 max-w-md mx-auto">
            {hasActiveFilters
              ? (isNl 
                  ? 'Probeer een andere zoekterm, categorie of wis de actieve filters om alle berichten te zien.' 
                  : 'Versuchen Sie einen anderen Suchbegriff, eine andere Kategorie oder setzen Sie die Filter zurück.')
              : (isNl 
                  ? 'Wees de eerste die een nieuwsbericht indient!' 
                  : 'Seien Sie der Erste, der eine News einreicht!')}
          </p>
          {hasActiveFilters ? (
            <button
              type="button"
              onClick={resetFilters}
              className="px-5 py-2.5 bg-[#0F4C2E] text-white font-semibold text-sm rounded-lg hover:bg-[#186841] transition-all cursor-pointer shadow-sm"
            >
              {isNl ? 'Alle filters wissen' : 'Alle Filter zurücksetzen'}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                window.history.pushState(null, '', submitPath);
                window.dispatchEvent(new PopStateEvent('popstate'));
              }}
              className="px-5 py-2.5 bg-[#0F4C2E] text-white font-semibold text-sm rounded-lg hover:bg-[#186841] transition-all cursor-pointer shadow-sm"
            >
              {t('newsSubmit')}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
