import React from 'react';
import { ExternalLink, Sparkles, Megaphone, Check } from 'lucide-react';
import { AdBanner } from '../types';
import { categories } from '../data';
import { db } from '../firebase';
import { doc, updateDoc, increment } from 'firebase/firestore';

interface SkyscraperBannerProps {
  banners: AdBanner[];
  activeCategory: string;
  onInquire: (category?: string) => void;
  isMobile?: boolean;
}

export default function SkyscraperBanner({
  banners,
  activeCategory,
  onInquire,
  isMobile = false,
}: SkyscraperBannerProps) {
  // Find active banner for current category or fallback to 'Alle'
  const activeBanners = banners.filter((b) => b.isActive);
  
  const isCategoryMatch = (banner: AdBanner, cat: string) => {
    if (!cat || cat === 'Alle') return false;
    const lowerCat = cat.toLowerCase();

    // Check banner.categories array
    if (Array.isArray(banner.categories) && banner.categories.length > 0) {
      if (banner.categories.some((c) => c.toLowerCase() === lowerCat)) {
        return true;
      }
      // Also match if banner has a main category that contains this subcategory
      const parentGroup = categories.find((cg) => cg.subcategories.some((sc) => sc.toLowerCase() === lowerCat));
      if (parentGroup && banner.categories.some((c) => c.toLowerCase() === parentGroup.name.toLowerCase())) {
        return true;
      }
      return false;
    }

    // Legacy fallback banner.category
    if (banner.category && banner.category !== 'Alle') {
      if (banner.category.toLowerCase() === lowerCat) return true;
      const parentGroup = categories.find((cg) => cg.subcategories.some((sc) => sc.toLowerCase() === lowerCat));
      if (parentGroup && banner.category.toLowerCase() === parentGroup.name.toLowerCase()) return true;
    }

    return false;
  };

  // 1. Exact or parent category match
  let matchedBanner = activeCategory !== 'Alle'
    ? activeBanners.find((b) => isCategoryMatch(b, activeCategory))
    : undefined;

  // 2. Global fallback ('Alle' or empty)
  if (!matchedBanner) {
    matchedBanner = activeBanners.find((b) => {
      if (Array.isArray(b.categories) && b.categories.length > 0) {
        return b.categories.some((c) => c === 'Alle' || c.toLowerCase() === 'alle');
      }
      return !b.category || b.category === 'Alle';
    });
  }

  const handleBannerClick = async (banner: AdBanner) => {
    try {
      if (banner.id && !banner.id.startsWith('demo_')) {
        const adRef = doc(db, 'ads', banner.id);
        await updateDoc(adRef, {
          clicks: increment(1)
        });
      }
    } catch (err) {
      console.warn('Could not record click metric:', err);
    }
  };

  // Mobile version (compact standalone card)
  if (isMobile) {
    if (matchedBanner) {
      return (
        <div className="w-full my-4 flex flex-col gap-2">
          <a
            href={matchedBanner.targetUrl}
            target="_blank"
            rel="noopener noreferrer sponsored"
            onClick={() => handleBannerClick(matchedBanner!)}
            className="group block relative rounded-md overflow-hidden border border-[#EDE8E0] shadow-sm hover:shadow-md transition-all bg-[#FAF8F5]"
          >
            <div className="absolute top-2 left-2 z-10 bg-black/65 backdrop-blur-md text-white px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase">
              {matchedBanner.badgeText || 'Anzeige'}
            </div>
            <img
              src={matchedBanner.imageUrl}
              alt={matchedBanner.title || 'Werbebanner'}
              className="w-full h-auto max-h-[180px] object-cover group-hover:scale-[1.02] transition-transform duration-300 block"
              loading="lazy"
            />
            <div className="p-3 bg-white border-t border-[#EDE8E0] flex items-center justify-between">
              <div className="font-display font-semibold text-[14px] text-[#1B211D] truncate">
                {matchedBanner.title}
              </div>
              <ExternalLink className="w-4 h-4 text-[#8A928B] shrink-0 ml-2" />
            </div>
          </a>

          <button
            type="button"
            onClick={() => onInquire(activeCategory)}
            className="w-full bg-[#FAF8F5] hover:bg-[#F3F0EA] border border-[#E7E2DA] rounded-md py-2.5 px-3 text-center transition-colors cursor-pointer"
          >
            <span className="text-xs font-semibold text-[#0F4C2E] hover:text-[#F2761B]">
              Sie möchten hier werben? Mehr erfahren!
            </span>
          </button>
        </div>
      );
    }

    return (
      <div 
        onClick={() => onInquire(activeCategory)}
        className="w-full my-4 bg-gradient-to-br from-[#0F4C2E] to-[#06301C] text-white rounded-md p-4 text-center cursor-pointer shadow-md"
      >
        <div className="inline-flex items-center gap-1 bg-white/15 text-white/90 rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider mb-1.5">
          <Sparkles className="w-3 h-3 text-[#F2761B]" /> Werbeplatz frei
        </div>
        <div className="font-display font-bold text-[15px] text-white mb-1">
          Skyscraper-Banner in „{activeCategory === 'Alle' ? 'Winterberg' : activeCategory}“
        </div>
        <p className="text-xs text-white/80 mb-3">
          Erreichen Sie gezielt lokale Kundschaft mit aufmerksamkeitsstarker Bannerwerbung.
        </p>
        <div className="bg-[#F2761B] text-white text-xs font-bold py-2 px-4 rounded-md inline-flex items-center gap-1.5 shadow-sm">
          Sie möchten hier werben? Mehr erfahren!
        </div>
      </div>
    );
  }

  // Desktop Freestanding Skyscraper Sticky Sidebar (Right Side)
  return (
    <aside className="w-[240px] xl:w-[260px] flex flex-col gap-3">
      {matchedBanner ? (
        <div className="flex flex-col gap-2.5">
          {/* Freestanding Banner Media */}
          <a
            href={matchedBanner.targetUrl}
            target="_blank"
            rel="noopener noreferrer sponsored"
            onClick={() => handleBannerClick(matchedBanner!)}
            className="group block relative overflow-hidden rounded-md border border-[#EDE8E0] shadow-[0_6px_24px_rgba(27,33,29,0.08)] hover:shadow-[0_12px_34px_rgba(27,33,29,0.16)] transition-all bg-[#FAF8F5]"
            title={matchedBanner.title}
          >
            {/* Overlay Badge */}
            <div className="absolute top-2.5 left-2.5 z-10 bg-black/65 backdrop-blur-md text-white px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase shadow-sm">
              {matchedBanner.badgeText || 'Anzeige'}
            </div>

            <div className="w-full overflow-hidden bg-slate-100 flex items-center justify-center min-h-[360px] max-h-[500px]">
              <img
                src={matchedBanner.imageUrl}
                alt={matchedBanner.title || 'Skyscraper Anzeige'}
                className="w-full h-auto object-cover group-hover:scale-[1.03] transition-transform duration-500 block"
                loading="lazy"
              />
            </div>

            {/* Banner bottom info bar */}
            <div className="p-3 bg-white border-t border-[#EDE8E0]">
              <div className="font-display font-bold text-[13.5px] text-[#1B211D] group-hover:text-[#0F4C2E] transition-colors leading-snug line-clamp-2">
                {matchedBanner.title}
              </div>
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#F3F0EA]">
                <span className="text-[12px] font-semibold text-[#D65F0C] group-hover:underline inline-flex items-center gap-1">
                  Mehr erfahren
                </span>
                <ExternalLink className="w-3.5 h-3.5 text-[#8A928B] group-hover:text-[#D65F0C] transition-colors" />
              </div>
            </div>
          </a>

          {/* Standalone Button directly beneath banner */}
          <button
            type="button"
            onClick={() => onInquire(activeCategory)}
            className="w-full bg-[#FAF8F5] hover:bg-[#F3F0EA] border border-[#E7E2DA] hover:border-[#0F4C2E]/40 rounded-md p-3 text-center transition-all group shadow-sm cursor-pointer"
          >
            <div className="text-[13px] font-bold text-[#1B211D] group-hover:text-[#0F4C2E] transition-colors leading-tight">
              Sie möchten hier werben? Mehr erfahren!
            </div>
          </button>
        </div>
      ) : (
        /* Standalone Empty Slot Skyscraper Banner */
        <div 
          onClick={() => onInquire(activeCategory)}
          className="w-full rounded-md bg-gradient-to-b from-[#0F4C2E] to-[#06301C] text-white p-5 text-center shadow-[0_8px_30px_rgba(15,76,46,0.15)] border border-[#0F4C2E] flex flex-col justify-between min-h-[440px] cursor-pointer hover:shadow-[0_12px_36px_rgba(15,76,46,0.25)] hover:scale-[1.01] transition-all relative overflow-hidden group"
        >
          {/* Decorative background shape */}
          <div className="absolute top-0 right-0 w-36 h-36 bg-white/5 rounded-full blur-2xl -mr-12 -mt-12 pointer-events-none" />
          
          <div>
            <div className="inline-flex items-center gap-1 bg-white/15 text-white/90 border border-white/20 rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider mb-3.5">
              <Sparkles className="w-3 h-3 text-[#F2761B]" /> Werbeplatz frei
            </div>

            <h3 className="font-display font-bold text-[17px] leading-snug text-white mb-2">
              Skyscraper-Banner in „{activeCategory === 'Alle' ? 'Winterberg' : activeCategory}“
            </h3>

            <p className="text-[12.5px] text-white/80 leading-relaxed mb-4">
              Präsentieren Sie Ihr Angebot exklusiv und aufmerksamkeitsstark am rechten Rand.
            </p>

            {/* Feature list */}
            <div className="space-y-2.5 text-left text-[12px] text-white/90 bg-white/10 backdrop-blur-sm rounded-md p-3.5 border border-white/15">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#F2761B]" />
                Feste Platzierung am rechten Rand
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#F2761B]" />
                Scrollt beim Lesen kontinuierlich mit
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#F2761B]" />
                Inkl. Logo, Text &amp; Direktverlinkung
              </div>
            </div>
          </div>

          <div>
            <div className="w-full bg-[#F2761B] group-hover:bg-[#D65F0C] text-white font-bold py-2.5 px-3 rounded-md text-[12.5px] transition-all shadow-md flex items-center justify-center gap-1.5">
              Sie möchten hier werben? Mehr erfahren!
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}

