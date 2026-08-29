import React, { useState, useEffect, useMemo } from 'react';
import { Star, ShieldCheck, ExternalLink, ChevronLeft, ChevronRight, CheckCircle2, MessageSquare } from 'lucide-react';
import { Business, Review } from '../types';
import { businesses as initialBusinesses } from '../data';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

export type WidgetLayout = 'badge' | 'card' | 'carousel' | 'simple_badge';
export type WidgetTheme = 'light' | 'dark' | 'brand' | 'transparent';

interface ReviewWidgetProps {
  businessId: string;
  initialBusiness?: Business | null;
  layout?: WidgetLayout;
  theme?: WidgetTheme;
  whitelabel?: boolean;
  lang?: 'de' | 'nl';
}

export default function ReviewWidget({
  businessId,
  initialBusiness,
  layout = 'badge',
  theme = 'light',
  whitelabel = false,
  lang = 'de'
}: ReviewWidgetProps) {
  const [business, setBusiness] = useState<Business | null>(initialBusiness || null);
  const [loading, setLoading] = useState(!initialBusiness);
  const [activeSlide, setActiveSlide] = useState(0);

  // Fetch business if not provided
  useEffect(() => {
    if (initialBusiness) {
      setBusiness(initialBusiness);
      setLoading(false);
      return;
    }

    let isMounted = true;
    const fetchBusiness = async () => {
      // 1. Try local data first for ultra-fast render
      const localMatch = initialBusinesses.find(b => 
        b.id === businessId || 
        b.name.replace(/\s+/g, '-').toLowerCase() === businessId.toLowerCase()
      );
      
      if (localMatch && isMounted) {
        setBusiness(localMatch);
      }

      // 2. Fetch latest from Firestore
      try {
        const docRef = doc(db, 'businesses', businessId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && isMounted) {
          setBusiness({ id: docSnap.id, ...docSnap.data() } as Business);
        }
      } catch (err) {
        console.warn('Could not load business from firestore for widget:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchBusiness();
    return () => { isMounted = false; };
  }, [businessId, initialBusiness]);

  // Post message to parent iframe for dynamic auto-resizing
  useEffect(() => {
    const notifyHeight = () => {
      if (typeof window !== 'undefined' && window.parent && window.parent !== window) {
        const height = document.body.scrollHeight || document.documentElement.scrollHeight;
        window.parent.postMessage({ type: 'wv-resize', height, businessId }, '*');
      }
    };

    notifyHeight();
    const timeout = setTimeout(notifyHeight, 150);
    window.addEventListener('resize', notifyHeight);
    return () => {
      clearTimeout(timeout);
      window.removeEventListener('resize', notifyHeight);
    };
  }, [business, layout, theme, activeSlide]);

  // Enforce Freemium / Whitelabel rules:
  // Whitelabeling (omitting backlink/branding) is strictly allowed ONLY if business.isPremium === true.
  const isPremium = !!business?.isPremium;
  const isWhitelabelActive = isPremium && whitelabel;

  // Filter approved reviews
  const approvedReviews = useMemo(() => {
    if (!business || !Array.isArray(business.reviews)) return [];
    return business.reviews.filter(r => r.status === 'approved' || !r.status);
  }, [business]);

  const reviewCount = approvedReviews.length;
  const avgRating = useMemo(() => {
    if (reviewCount === 0) return '5.0';
    const sum = approvedReviews.reduce((acc, r) => acc + (Number(r.rating) || 5), 0);
    return (sum / reviewCount).toFixed(1);
  }, [approvedReviews, reviewCount]);

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://www.winterberg-verzeichnis.de';
  const businessCategorySlug = business ? encodeURIComponent(business.category) : '';
  const businessSubcategorySlug = business?.subcategory ? `/${encodeURIComponent(business.subcategory)}` : '';
  const businessNameSlug = business ? encodeURIComponent(business.name.replace(/\s+/g, '-').toLowerCase()) : '';
  const businessUrl = business 
    ? `${baseUrl}/${businessCategorySlug}${businessSubcategorySlug}/${businessNameSlug}` 
    : baseUrl;

  // Theme Styles
  const themeStyles = useMemo(() => {
    switch (theme) {
      case 'dark':
        return {
          container: 'bg-[#141A16] text-[#F3F0EA] border-[#2A362E] shadow-[0_4px_20px_rgba(0,0,0,0.35)]',
          badgeBg: 'bg-[#1E2721]',
          textMuted: 'text-[#9AA69E]',
          accentText: 'text-[#F2761B]',
          starFilled: 'text-[#F2761B]',
          starEmpty: 'text-[#3E4C41]',
          cardBg: 'bg-[#1A221C]',
          linkText: 'text-[#F2761B] hover:text-[#FFA459]',
          border: 'border-[#2A362E]'
        };
      case 'brand':
        return {
          container: 'bg-[#0F4C2E] text-white border-[#17663F] shadow-[0_4px_20px_rgba(15,76,46,0.3)]',
          badgeBg: 'bg-[#0A3620]',
          textMuted: 'text-white/80',
          accentText: 'text-[#F2761B]',
          starFilled: 'text-[#F2761B]',
          starEmpty: 'text-white/30',
          cardBg: 'bg-[#0B3D25]',
          linkText: 'text-[#F2761B] hover:underline',
          border: 'border-[#17663F]'
        };
      case 'transparent':
        return {
          container: 'bg-transparent text-[#1B211D] border-transparent shadow-none',
          badgeBg: 'bg-black/5',
          textMuted: 'text-[#5F6B63]',
          accentText: 'text-[#D65F0C]',
          starFilled: 'text-[#F2761B]',
          starEmpty: 'text-[#D8D2C8]',
          cardBg: 'bg-black/[0.02]',
          linkText: 'text-[#0F4C2E] hover:underline',
          border: 'border-[#EDE8E0]'
        };
      case 'light':
      default:
        return {
          container: 'bg-white text-[#1B211D] border-[#EDE8E0] shadow-[0_4px_20px_rgba(27,33,29,0.06)]',
          badgeBg: 'bg-[#FAF8F5]',
          textMuted: 'text-[#5F6B63]',
          accentText: 'text-[#D65F0C]',
          starFilled: 'text-[#F2761B]',
          starEmpty: 'text-[#E5DFD5]',
          cardBg: 'bg-[#FAF8F5]',
          linkText: 'text-[#0F4C2E] hover:underline',
          border: 'border-[#EDE8E0]'
        };
    }
  }, [theme]);

  // Loading state
  if (loading && !business) {
    return (
      <div className={`p-4 rounded-xl border flex items-center justify-center min-h-[90px] ${themeStyles.container}`}>
        <div className="flex items-center gap-2 text-sm text-[#5F6B63]">
          <div className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
          <span>Bewertungs-Siegel wird geladen...</span>
        </div>
      </div>
    );
  }

  if (!business) {
    return (
      <div className={`p-4 rounded-xl border text-center text-xs ${themeStyles.container}`}>
        Unternehmen nicht gefunden.
      </div>
    );
  }

  const renderStars = (ratingNum: number, size = 'w-4 h-4') => {
    return (
      <div className="inline-flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map(starIndex => (
          <Star
            key={starIndex}
            className={`${size} ${starIndex <= Math.round(ratingNum) ? `${themeStyles.starFilled} fill-current` : `${themeStyles.starEmpty} fill-current`}`}
          />
        ))}
      </div>
    );
  };

  // Structured Data JSON-LD for SEO Crawlers
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: business.name,
    address: business.address,
    url: businessUrl,
    aggregateRating: reviewCount > 0 ? {
      '@type': 'AggregateRating',
      ratingValue: avgRating,
      reviewCount: reviewCount,
      bestRating: '5',
      worstRating: '1'
    } : undefined
  };

  // ==========================================
  // 1. SIMPLE BADGE ("Gelistet in Winterberg")
  // ==========================================
  if (layout === 'simple_badge') {
    return (
      <div className={`font-sans antialiased p-3 rounded-xl border transition-all inline-block max-w-full ${themeStyles.container}`}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#0F4C2E] text-white flex items-center justify-center shrink-0 shadow-sm font-bold text-xs">
            W
          </div>
          <div className="min-w-0 pr-1">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-[13.5px] truncate">{business.name}</span>
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            </div>
            <div className="text-[11.5px] flex items-center gap-1.5 mt-0.5">
              {reviewCount > 0 ? (
                <>
                  <span className="font-bold text-[#F2761B]">{avgRating} ★</span>
                  <span className={themeStyles.textMuted}>({reviewCount} Bewertungen)</span>
                </>
              ) : (
                <span className={themeStyles.textMuted}>Geprüfter Betrieb {business.district ? `in ${business.district}` : 'in Winterberg'}</span>
              )}
            </div>
          </div>
        </div>

        {!isWhitelabelActive && (
          <a
            href={businessUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`mt-2 pt-1.5 border-t ${themeStyles.border} flex items-center justify-between text-[11px] font-medium ${themeStyles.linkText} group`}
            title={`Profil von ${business.name} auf winterberg-verzeichnis.de aufrufen`}
          >
            <span className="inline-flex items-center gap-1">
              <span>Gelistet auf <strong>Winterberg-Verzeichnis.de</strong></span>
            </span>
            <ExternalLink className="w-3 h-3 opacity-60 group-hover:opacity-100 transition-opacity" />
          </a>
        )}
      </div>
    );
  }

  // ==========================================
  // 2. COMPACT BADGE (Default Trust Seal)
  // ==========================================
  if (layout === 'badge') {
    return (
      <div className={`font-sans antialiased p-4 rounded-xl border transition-all max-w-[380px] w-full ${themeStyles.container}`}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
        
        <div className="flex items-center justify-between gap-3 mb-2.5">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-[15px] truncate leading-tight">{business.name}</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            </div>
            <div className={`text-[12px] ${themeStyles.textMuted} mt-0.5 truncate`}>
              {business.category} {business.district ? `· ${business.district}` : ''}
            </div>
          </div>
          
          <div className="text-right shrink-0 flex flex-col items-end">
            <div className="flex items-baseline gap-1">
              <span className="text-[20px] font-black tracking-tight text-[#F2761B]">{avgRating}</span>
              <span className={`text-[12px] font-semibold ${themeStyles.textMuted}`}>/ 5</span>
            </div>
            {renderStars(Number(avgRating), 'w-3.5 h-3.5')}
          </div>
        </div>

        <div className={`py-2 px-3 rounded-lg flex items-center justify-between text-[12px] ${themeStyles.badgeBg} border ${themeStyles.border}`}>
          <span className="font-medium flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Kundenbewertungen</span>
          </span>
          <span className={`font-semibold ${themeStyles.textMuted}`}>
            {reviewCount > 0 ? `${reviewCount} ${reviewCount === 1 ? 'Bewertung' : 'Bewertungen'}` : 'Erststimme abgeben'}
          </span>
        </div>

        {!isWhitelabelActive && (
          <a
            href={businessUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`mt-2.5 pt-2 border-t ${themeStyles.border} flex items-center justify-between text-[11.5px] font-medium ${themeStyles.linkText} group transition-all`}
            title={`Profil & Bewertungen von ${business.name} auf Winterberg-Verzeichnis.de öffnen`}
          >
            <span className="flex items-center gap-1.5 truncate">
              <span className="w-2 h-2 rounded-full bg-[#F2761B]"></span>
              <span>Offizieller Eintrag auf <strong>Winterberg-Verzeichnis.de</strong></span>
            </span>
            <ExternalLink className="w-3.5 h-3.5 shrink-0 opacity-70 group-hover:opacity-100 transition-opacity" />
          </a>
        )}
      </div>
    );
  }

  // ==========================================
  // 3. CARD LAYOUT (Rating Card with Quote)
  // ==========================================
  if (layout === 'card') {
    const featuredReview = approvedReviews[0] || null;

    return (
      <div className={`font-sans antialiased p-5 rounded-2xl border transition-all max-w-[420px] w-full ${themeStyles.container}`}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
        
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-600 mb-1.5 border border-emerald-500/20">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verifizierte Bewertungen</span>
            </div>
            <h3 className="font-bold text-[17px] leading-snug">{business.name}</h3>
            <p className={`text-[12.5px] ${themeStyles.textMuted} mt-0.5`}>
              {business.category} {business.district ? `in ${business.district}` : 'in Winterberg'}
            </p>
          </div>

          <div className="text-right shrink-0 bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/20">
            <div className="text-[22px] font-black text-[#F2761B] leading-none mb-1">{avgRating}</div>
            {renderStars(Number(avgRating), 'w-3.5 h-3.5')}
            <div className="text-[10.5px] font-semibold text-[#5F6B63] mt-1">{reviewCount} Gesamt</div>
          </div>
        </div>

        {featuredReview ? (
          <div className={`p-3.5 rounded-xl border ${themeStyles.border} ${themeStyles.cardBg} mb-3`}>
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <span className="font-semibold text-[13px]">{featuredReview.authorName || 'Kunde'}</span>
              <div className="scale-90 origin-right">{renderStars(featuredReview.rating, 'w-3 h-3')}</div>
            </div>
            <p className={`text-[13px] leading-relaxed italic ${themeStyles.textMuted} line-clamp-3`}>
              "{featuredReview.text}"
            </p>
            {featuredReview.ownerReply && (
              <div className="mt-2 pt-2 border-t border-black/5 text-[11.5px] text-emerald-700 italic flex items-center gap-1">
                <MessageSquare className="w-3 h-3 shrink-0" />
                <span className="truncate">Inhaber hat geantwortet</span>
              </div>
            )}
          </div>
        ) : (
          <div className={`p-3.5 rounded-xl border ${themeStyles.border} ${themeStyles.cardBg} mb-3 text-center text-[12.5px] ${themeStyles.textMuted}`}>
            Geprüfter Eintrag im Winterberg-Verzeichnis.
          </div>
        )}

        <div className="flex items-center justify-between gap-2 pt-2 border-t border-black/5 text-[12px]">
          <a
            href={businessUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`font-semibold ${themeStyles.linkText} inline-flex items-center gap-1`}
          >
            <span>Jetzt bewerten</span>
            <ExternalLink className="w-3 h-3" />
          </a>

          {!isWhitelabelActive ? (
            <a
              href={baseUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`text-[11px] ${themeStyles.textMuted} hover:underline`}
            >
              via <strong>Winterberg-Verzeichnis.de</strong>
            </a>
          ) : (
            <span className={`text-[11px] ${themeStyles.textMuted}`}>Verifiziertes Siegel</span>
          )}
        </div>
      </div>
    );
  }

  // ==========================================
  // 4. CAROUSEL / SLIDER LAYOUT (Full Reviews)
  // ==========================================
  const currentReview = approvedReviews[activeSlide] || null;

  return (
    <div className={`font-sans antialiased p-5 rounded-2xl border transition-all max-w-[460px] w-full ${themeStyles.container}`}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-black/5">
        <div>
          <div className="flex items-center gap-1.5">
            <h3 className="font-bold text-[16.5px] leading-snug">{business.name}</h3>
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          </div>
          <div className="flex items-center gap-2 mt-1">
            {renderStars(Number(avgRating), 'w-3.5 h-3.5')}
            <span className="font-bold text-[13px] text-[#F2761B]">{avgRating}</span>
            <span className={`text-[12px] ${themeStyles.textMuted}`}>({reviewCount} Bewertungen)</span>
          </div>
        </div>

        {approvedReviews.length > 1 && (
          <div className="flex items-center gap-1">
            <button
              onClick={() => setActiveSlide(prev => (prev === 0 ? approvedReviews.length - 1 : prev - 1))}
              className="p-1.5 rounded-lg border border-black/10 hover:bg-black/5 transition-colors cursor-pointer"
              aria-label="Vorherige Bewertung"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-[11.5px] font-medium px-1 text-[#5F6B63]">
              {activeSlide + 1}/{approvedReviews.length}
            </span>
            <button
              onClick={() => setActiveSlide(prev => (prev === approvedReviews.length - 1 ? 0 : prev + 1))}
              className="p-1.5 rounded-lg border border-black/10 hover:bg-black/5 transition-colors cursor-pointer"
              aria-label="Nächste Bewertung"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Review Body */}
      {currentReview ? (
        <div className={`p-4 rounded-xl border ${themeStyles.border} ${themeStyles.cardBg} min-h-[110px] flex flex-col justify-between`}>
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="font-bold text-[13.5px]">{currentReview.authorName || 'Verifizierter Kunde'}</span>
              <div className="scale-90 origin-right">{renderStars(currentReview.rating, 'w-3.5 h-3.5')}</div>
            </div>
            <p className={`text-[13.5px] leading-relaxed italic ${themeStyles.textMuted}`}>
              "{currentReview.text}"
            </p>
          </div>

          {currentReview.ownerReply && (
            <div className="mt-3 pt-2.5 border-t border-black/10 text-[12px] text-emerald-700">
              <div className="font-semibold flex items-center gap-1 mb-0.5">
                <MessageSquare className="w-3 h-3" />
                <span>Antwort von {business.name}:</span>
              </div>
              <p className="italic text-[12px] pl-4 border-l-2 border-emerald-500/40 opacity-90">
                {currentReview.ownerReply}
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className={`p-6 rounded-xl border ${themeStyles.border} ${themeStyles.cardBg} text-center text-[13px] ${themeStyles.textMuted}`}>
          Noch keine Kundenstimmen vorhanden — Jetzt auf Winterberg-Verzeichnis.de bewerten!
        </div>
      )}

      {/* Footer / Backlink */}
      <div className="flex items-center justify-between gap-3 mt-3.5 pt-2.5 border-t border-black/5 text-[11.5px]">
        <a
          href={businessUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`font-semibold ${themeStyles.linkText} inline-flex items-center gap-1`}
        >
          <span>Alle Bewertungen ansehen & Feedback geben</span>
          <ExternalLink className="w-3 h-3" />
        </a>

        {!isWhitelabelActive && (
          <a
            href={baseUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`font-medium ${themeStyles.textMuted} hover:underline`}
            title="Winterberg Unternehmens-Verzeichnis"
          >
            winterberg-verzeichnis.de
          </a>
        )}
      </div>
    </div>
  );
}
