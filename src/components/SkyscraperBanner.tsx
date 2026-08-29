import React from 'react';
import { ExternalLink, Sparkles, Megaphone, Info } from 'lucide-react';
import { AdBanner } from '../types';
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
  
  // 1. Exact category match
  let matchedBanner = activeBanners.find(
    (b) => b.category && b.category.toLowerCase() === activeCategory.toLowerCase() && activeCategory !== 'Alle'
  );

  // 2. Global fallback
  if (!matchedBanner) {
    matchedBanner = activeBanners.find((b) => !b.category || b.category === 'Alle');
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

  // Mobile version (compact horizontal card / slot)
  if (isMobile) {
    if (matchedBanner) {
      return (
        <div className="w-full my-6 bg-white border border-[#EDE8E0] rounded-[20px] p-4 shadow-[0_2px_10px_rgba(27,33,29,0.04)] overflow-hidden">
          <div className="flex items-center justify-between text-[11px] font-semibold text-[#8A928B] uppercase tracking-wider mb-2">
            <span className="flex items-center gap-1 bg-[#F3F0EA] px-2 py-0.5 rounded-full text-[10px]">
              {matchedBanner.badgeText || 'Anzeige'}
            </span>
            <span className="text-[11px] text-[#5F6B63]">{matchedBanner.category || 'Winterberg'}</span>
          </div>

          <a
            href={matchedBanner.targetUrl}
            target="_blank"
            rel="noopener noreferrer sponsored"
            onClick={() => handleBannerClick(matchedBanner!)}
            className="group block"
          >
            <div className="relative rounded-[14px] overflow-hidden mb-2 bg-[#FAF8F5] border border-[#E7E2DA]">
              <img
                src={matchedBanner.imageUrl}
                alt={matchedBanner.title || 'Werbebanner'}
                className="w-full h-auto max-h-[160px] object-cover group-hover:scale-[1.02] transition-transform duration-300"
                loading="lazy"
              />
            </div>
            <div className="flex items-center justify-between mt-2">
              <div className="font-display font-semibold text-[15px] text-[#1B211D] group-hover:text-[#F2761B] transition-colors truncate">
                {matchedBanner.title}
              </div>
              <ExternalLink className="w-4 h-4 text-[#8A928B] group-hover:text-[#F2761B] transition-colors shrink-0 ml-2" />
            </div>
          </a>
        </div>
      );
    }

    return (
      <div className="w-full my-6 bg-gradient-to-r from-[#FAF8F5] to-[#F3F0EA] border border-[#E7E2DA] rounded-[20px] p-4 text-center">
        <div className="flex items-center justify-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#D65F0C] mb-1">
          <Sparkles className="w-3.5 h-3.5" /> Werbefläche
        </div>
        <div className="font-display font-bold text-[15px] text-gray-900 mb-1">
          Hier werben in „{activeCategory === 'Alle' ? 'Winterberg' : activeCategory}“
        </div>
        <p className="text-xs text-[#5F6B63] mb-3">
          Erreichen Sie gezielt lokale Kundschaft mit auffälliger Bannerwerbung.
        </p>
        <button
          type="button"
          onClick={() => onInquire(activeCategory)}
          className="bg-[#0F4C2E] hover:bg-[#06301C] text-white text-xs font-semibold px-4 py-2 rounded-full transition-colors inline-flex items-center gap-1.5 shadow-sm"
        >
          <Megaphone className="w-3.5 h-3.5" /> Jetzt Bannerplatz anfragen
        </button>
      </div>
    );
  }

  // Desktop Skyscraper Sticky Sidebar (Right Side)
  return (
    <aside className="w-[240px] xl:w-[260px] shrink-0 sticky top-[116px] max-h-[calc(100vh-140px)] flex flex-col gap-4 overflow-y-auto no-scrollbar">
      {matchedBanner ? (
        <div className="bg-white border border-[#EDE8E0] rounded-[22px] p-3.5 shadow-[0_4px_18px_rgba(27,33,29,0.05)] hover:shadow-[0_8px_26px_rgba(27,33,29,0.08)] transition-all">
          {/* Label */}
          <div className="flex items-center justify-between px-1 mb-2.5">
            <span className="bg-[#FAF8F5] border border-[#E7E2DA] text-[#8A928B] rounded-md px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase">
              {matchedBanner.badgeText || 'Anzeige'}
            </span>
            <span className="text-[11px] text-[#8A928B] truncate max-w-[120px]">
              {matchedBanner.companyName || matchedBanner.category || 'Winterberg'}
            </span>
          </div>

          {/* Banner Link & Media */}
          <a
            href={matchedBanner.targetUrl}
            target="_blank"
            rel="noopener noreferrer sponsored"
            onClick={() => handleBannerClick(matchedBanner!)}
            className="group block relative overflow-hidden rounded-[16px] border border-[#EDE8E0] bg-[#FAF8F5]"
            title={matchedBanner.title}
          >
            <div className="w-full overflow-hidden bg-slate-100 flex items-center justify-center min-h-[300px]">
              <img
                src={matchedBanner.imageUrl}
                alt={matchedBanner.title || 'Skyscraper Anzeige'}
                className="w-full h-auto object-cover group-hover:scale-[1.03] transition-transform duration-500 block"
                loading="lazy"
              />
            </div>

            {/* Banner bottom info bar */}
            <div className="p-3 bg-white border-t border-[#EDE8E0]">
              <div className="font-display font-bold text-[14px] text-[#1B211D] group-hover:text-[#0F4C2E] transition-colors leading-snug line-clamp-2">
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

          {/* Small Inquire Teaser Below Active Banner */}
          <div className="mt-3 pt-3 border-t border-[#F3F0EA] px-1 text-center">
            <button
              type="button"
              onClick={() => onInquire(activeCategory)}
              className="text-[11.5px] text-[#5F6B63] hover:text-[#0F4C2E] font-medium transition-colors cursor-pointer flex items-center justify-center gap-1 w-full"
            >
              <Megaphone className="w-3 h-3 text-[#F2761B]" />
              Hier werben in „{activeCategory === 'Alle' ? 'Winterberg' : activeCategory}“
            </button>
          </div>
        </div>
      ) : (
        /* Empty Slot: High-Conversion Booking Card */
        <div className="bg-gradient-to-b from-white to-[#FAF8F5] border-2 border-dashed border-[#E7E2DA] hover:border-[#0F4C2E]/40 rounded-[22px] p-5 shadow-[0_2px_12px_rgba(27,33,29,0.03)] text-center transition-all">
          <div className="w-12 h-12 rounded-2xl bg-[#FFF1E4] text-[#D65F0C] flex items-center justify-center mx-auto mb-3.5 shadow-sm">
            <Megaphone className="w-6 h-6" />
          </div>

          <span className="inline-block bg-[#0F4C2E]/10 text-[#0F4C2E] rounded-full px-2.5 py-0.5 text-[10.5px] font-bold uppercase tracking-wider mb-2">
            Werbeplatz frei
          </span>

          <h3 className="font-display font-bold text-[16px] text-gray-900 leading-tight mb-2">
            Ihre Anzeige in „{activeCategory === 'Alle' ? 'Winterberg' : activeCategory}“
          </h3>

          <p className="text-[13px] text-[#5F6B63] leading-relaxed mb-5">
            Präsentieren Sie Ihr Angebot als Skyscraper-Banner exklusiv neben den Brancheneinträgen.
          </p>

          <div className="space-y-2 mb-5 text-left text-[12px] text-[#4A544D] bg-white rounded-xl p-3 border border-[#EDE8E0]">
            <div className="flex items-center gap-1.5 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F2761B]" />
              Feste Platzierung rechts
            </div>
            <div className="flex items-center gap-1.5 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F2761B]" />
              Scrollt beim Lesen mit
            </div>
            <div className="flex items-center gap-1.5 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F2761B]" />
              Direkte Verlinkung
            </div>
          </div>

          <button
            type="button"
            onClick={() => onInquire(activeCategory)}
            className="w-full bg-[#0F4C2E] hover:bg-[#06301C] text-white font-semibold py-2.5 px-4 rounded-xl text-[13.5px] transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-[#F2761B]" />
            Banner buchen
          </button>
        </div>
      )}
    </aside>
  );
}
