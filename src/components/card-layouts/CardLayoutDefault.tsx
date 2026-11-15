import React from 'react';
import { MapPin, Heart, ShieldCheck, ArrowRight, Phone, Navigation, Star, Sparkles, Check, CheckCircle2 } from 'lucide-react';
import { Business } from '../../types';
import { formatBusinessAddress, isSundayOpen, isBusinessClaimed } from '../../utils';
import RankingBadge from '../RankingBadge';
import BusinessCategoryIcon from '../BusinessCategoryIcon';

export interface CardSharedData {
  business: Business;
  lang: 'de' | 'nl';
  businessUrl: string;
  allBusinesses: Business[];
  searchQuery: string;
  onClick: (e: React.MouseEvent) => void;
  className?: string;
  isFav: boolean;
  toggleFavorite: (id: string) => void;
  avgRating: string | null;
  reviewCount: number;
  cardUsps: string[];
  cardRankingBadges: any[];
  imageSrc: string | null;
  lowerSearch: string;
  localized: any;
  t: (key: string) => string;
}

// ----------------------------------------------------------------------
// Common subcomponents to ensure consistent behavior across layouts
// ----------------------------------------------------------------------

export function BusinessTitleLink({
  href,
  onClick,
  className = '',
  children,
}: {
  href: string;
  onClick: (e: React.MouseEvent) => void;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      onClick={(e) => {
        if (!e.ctrlKey && !e.metaKey && !e.shiftKey && !e.altKey && e.button === 0) {
          e.preventDefault();
          e.stopPropagation();
          onClick(e);
        } else {
          e.stopPropagation();
        }
      }}
      className={`text-inherit no-underline ${className}`}
    >
      {children}
    </a>
  );
}

export function FavoriteButton({ isFav, toggleFavorite, businessId, lang, className = '' }: { 
  isFav: boolean; 
  toggleFavorite: (id: string) => void; 
  businessId: string; 
  lang: string; 
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        toggleFavorite(businessId);
      }}
      title={isFav ? (lang === 'nl' ? 'Verwijderen uit favorieten' : 'Aus Favoriten entfernen') : (lang === 'nl' ? 'Toevoegen aan favorieten' : 'Als Favorit merken')}
      aria-label={isFav ? 'Aus Favoriten entfernen' : 'Als Favorit merken'}
      className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer shadow-md pointer-events-auto shrink-0 ${
        isFav
          ? 'bg-white text-red-500 hover:scale-110 shadow-red-100'
          : 'bg-white/90 backdrop-blur-sm text-gray-400 hover:text-red-500 hover:bg-white hover:scale-110'
      } ${className}`}
    >
      <Heart className={`w-4 h-4 transition-transform ${isFav ? 'fill-red-500 text-red-500 scale-110' : ''}`} />
    </button>
  );
}

export function FallbackBannerImage({ business }: { business: Business }) {
  return (
    <div className="w-full h-full bg-gradient-to-br from-[#06301C] via-[#0F4C2E] to-[#1B211D] flex items-center justify-center relative overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-overlay" 
        style={{ backgroundImage: 'url(/winterberg-header.webp)' }}
      />
      <div className="relative z-10">
        <BusinessCategoryIcon 
          category={business.category} 
          subcategory={business.subcategory} 
          name={business.name} 
          isPremium={business.isPremium} 
          size="xl" 
          className="shadow-md"
        />
      </div>
    </div>
  );
}

export function StandardBadges({ data, showRating = true }: { data: CardSharedData; showRating?: boolean }) {
  const { business, lang, avgRating, reviewCount } = data;
  return (
    <div className="flex items-center gap-1.5 flex-wrap pointer-events-none">
      {business.isPremium && (
        <div className="bg-[#FFF1E4] text-[#D65F0C] border border-[#FBD9BC] px-2.5 py-1 rounded-md text-[12px] font-bold shadow-sm backdrop-blur-xs">
          Premium
        </div>
      )}
      {!business.isPremium && isBusinessClaimed(business) && (
        <div className="bg-[#E8F1EB]/95 text-[#0F4C2E] border border-[#C5DFCE] px-2.5 py-1 rounded-md text-[11.5px] font-bold shadow-sm backdrop-blur-xs flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-[#0F4C2E] shrink-0" />
          <span>{lang === 'nl' ? 'Geverifieerd' : 'Verifiziert'}</span>
        </div>
      )}
      {business.isPremium && business.hasShop && (
        <div className="bg-[#0F4C2E] text-white border border-[#0F4C2E]/30 px-2 py-1 rounded-md text-[11px] font-bold shadow-sm backdrop-blur-xs flex items-center gap-1">
          <span>🛍️</span>
          <span>{lang === 'nl' ? 'Webshop' : 'Onlineshop'}</span>
        </div>
      )}
      {isSundayOpen(business.openingHours) && (
        <div className="bg-emerald-50 text-emerald-800 border border-emerald-200/80 px-2 py-1 rounded-md text-[11px] font-bold shadow-sm backdrop-blur-xs flex items-center gap-1">
          <span>☀️</span>
          <span>{lang === 'nl' ? 'Zondag open' : 'So. geöffnet'}</span>
        </div>
      )}
      {showRating && avgRating && (
        <div className="bg-white/95 backdrop-blur-sm border border-[#E7E2DA] px-2.5 py-1 rounded-md flex items-center gap-1.5 shadow-sm">
          <span className="text-[#F2761B] text-[13px] leading-none">★</span>
          <span className="font-bold text-[13.5px] text-[#1B211D]">{avgRating}</span>
          <span className="text-[12px] text-[#5F6B63]">({reviewCount})</span>
        </div>
      )}
    </div>
  );
}

export function ClaimFooterHint({ business, lang }: { business: Business; lang: 'de' | 'nl' }) {
  if (!isBusinessClaimed(business)) {
    return (
      <div className="mt-2 pt-2 border-t border-dashed border-[#EDE8E0] flex items-center justify-between text-[11.5px] text-[#0F4C2E]">
        <span className="font-semibold flex items-center gap-1 group-hover:underline">
          <span>{lang === 'nl' ? 'Uw bedrijf? Nu gratis claimen' : 'Ihr Betrieb? Jetzt kostenlos übernehmen'}</span>
          <span className="text-[#F2761B] font-bold">→</span>
        </span>
        <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-50 text-[#0F4C2E] border border-emerald-200">
          0 €
        </span>
      </div>
    );
  }
  if (!business.isPremium) {
    return (
      <div className="mt-2 pt-2 border-t border-dashed border-[#EDE8E0] flex items-center justify-between text-[11.5px] text-[#0F4C2E]">
        <span className="font-semibold flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-[#0F4C2E] shrink-0" />
          <span>{lang === 'nl' ? 'Door eigenaar geverifieerd' : 'Vom Inhaber verifiziert'}</span>
        </span>
        <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#E8F1EB] text-[#0F4C2E] border border-[#C5DFCE]">
          {lang === 'nl' ? '✓ Geverifieerd' : '✓ Verifiziert'}
        </span>
      </div>
    );
  }
  return null;
}

export function TagsList({ data, maxServices = 3, maxProducts = 3 }: { data: CardSharedData; maxServices?: number; maxProducts?: number }) {
  const { business, localized, lowerSearch, lang } = data;
  return (
    <>
      {Array.isArray(localized.services) && localized.services.length > 0 && (
        <div className="flex items-center gap-1.5 flex-wrap mb-2">
          {localized.services.slice(0, maxServices).map((svc: string, sIdx: number) => {
            const isMatched = lowerSearch && (
              svc.toLowerCase().includes(lowerSearch) || 
              (business.services && business.services.some(orig => orig.toLowerCase().includes(lowerSearch)))
            );
            return (
              <span
                key={sIdx}
                className={`text-[12px] px-2.5 py-0.5 rounded-md font-medium transition-colors ${
                  isMatched 
                    ? 'bg-[#FFF1E4] text-[#D65F0C] font-bold border border-[#F2761B]/40' 
                    : 'bg-[#FAF8F5] text-[#4A544D] border border-[#E7E2DA]'
                }`}
              >
                {isMatched ? `★ ${svc}` : svc}
              </span>
            );
          })}
          {business.isPremium && localized.services.length > maxServices && (
            <span className="text-[11.5px] text-[#8A928B] font-medium self-center">
              +{localized.services.length - maxServices} {lang === 'nl' ? 'meer' : 'weitere'}
            </span>
          )}
        </div>
      )}

      {Array.isArray(localized.products) && localized.products.length > 0 && (
        <div className="flex items-center gap-1.5 flex-wrap mb-2.5">
          {localized.products.slice(0, maxProducts).map((prod: string, pIdx: number) => {
            const isMatched = lowerSearch && (
              prod.toLowerCase().includes(lowerSearch) || 
              (business.products && business.products.some(orig => orig.toLowerCase().includes(lowerSearch)))
            );
            return (
              <span
                key={pIdx}
                className={`text-[12px] px-2.5 py-0.5 rounded-md font-medium transition-colors ${
                  isMatched 
                    ? 'bg-[#FFF1E4] text-[#D65F0C] font-bold border border-[#F2761B]/40' 
                    : 'bg-[#FFF8F1] text-[#D65F0C] border border-[#FBD9BC]'
                }`}
              >
                {isMatched ? `★ ${prod}` : prod}
              </span>
            );
          })}
          {business.isPremium && localized.products.length > maxProducts && (
            <span className="text-[11.5px] text-[#8A928B] font-medium self-center">
              +{localized.products.length - maxProducts} {lang === 'nl' ? 'meer' : 'weitere'}
            </span>
          )}
        </div>
      )}
    </>
  );
}

// ======================================================================
// 15 DISTINCT CARD LAYOUT RENDERERS
// ======================================================================

// ----------------------------------------------------------------------
// 01. DEFAULT (Der Klassiker - Aktueller Standard)
// ----------------------------------------------------------------------
export function LayoutDefault({ data }: { data: CardSharedData }) {
  const { business, lang, onClick, className = '', isFav, toggleFavorite, avgRating, reviewCount, cardUsps, cardRankingBadges, imageSrc, localized, t } = data;

  return (
    <div 
      onClick={onClick}
      className={`group bg-white rounded-2xl shadow-sm border ${business.isPremium ? 'border-[#F2761B]/60 hover:border-[#F2761B]' : 'border-[#E7E2DA]'} flex flex-col hover:-translate-y-1 hover:shadow-lg transition-all duration-200 cursor-pointer ${className}`}
    >
      <div className="h-[200px] w-full bg-[#FAF8F5] relative shrink-0">
        <div className="w-full h-full overflow-hidden rounded-t-2xl">
          {imageSrc ? (
            <img 
              src={imageSrc} 
              alt={business.name} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy" decoding="async" />
          ) : (
            <FallbackBannerImage business={business} />
          )}
        </div>

        <div className="absolute top-3 left-3 right-3 flex justify-between items-start z-10">
          <StandardBadges data={data} showRating={false} />
          <div className="flex items-center gap-2 ml-auto">
            {avgRating && (
              <div className="bg-white/95 backdrop-blur-sm border border-[#E7E2DA] px-2.5 py-1 rounded-md flex items-center gap-1.5 shadow-sm pointer-events-none">
                <span className="text-[#F2761B] text-[13px] leading-none">★</span>
                <span className="font-bold text-[13.5px] text-[#1B211D]">{avgRating}</span>
                <span className="text-[12px] text-[#5F6B63]">({reviewCount})</span>
              </div>
            )}
            <FavoriteButton isFav={isFav} toggleFavorite={toggleFavorite} businessId={business.id} lang={lang} />
          </div>
        </div>

        {business.isPremium && business.logoUrl && (
          <div className="absolute -bottom-6 left-5 z-30 pointer-events-none">
            <div 
              className="w-[60px] h-[60px] bg-white rounded-xl shadow-lg border border-[#E7E2DA] flex items-center justify-center overflow-hidden p-1.5"
              style={{ backgroundColor: business.logoBgColor || '#ffffff' }}
            >
              <img src={business.logoUrl} alt={business.name} className="max-w-full max-h-full object-contain" loading="lazy" decoding="async" />
            </div>
          </div>
        )}
      </div>

      <div className={`px-5 ${(business.isPremium && business.logoUrl) ? 'pt-9' : 'pt-5'} pb-5 flex flex-col flex-1 relative z-10 bg-white rounded-b-2xl`}>
        <div className="text-[11px] font-bold text-[#F2761B] tracking-wider uppercase mb-1.5 line-clamp-1">
          {t(business.category)}{business.subcategory ? ` · ${t(business.subcategory)}` : ''}
        </div>

        <h3 className="font-display text-[20px] font-bold text-[#1B211D] mb-2.5 leading-tight group-hover:text-[#0F4C2E] transition-colors">
          <BusinessTitleLink href={data.businessUrl} onClick={onClick}>
            {business.name}
          </BusinessTitleLink>
        </h3>

        {cardRankingBadges.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap mb-3">
            {cardRankingBadges.map((badge, bIdx) => (
              <RankingBadge key={bIdx} badge={badge} lang={lang} variant="compact" />
            ))}
          </div>
        )}

        {cardUsps.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap mb-3">
            {cardUsps.map((usp, uIdx) => (
              <span key={uIdx} className="inline-flex items-center gap-1.5 bg-[#E8F1EB] border border-[#C5DFCE] text-[#0F4C2E] px-2.5 py-1 rounded-full text-[12px] font-semibold w-fit shadow-2xs">
                <span className="text-[#F2761B] text-[11px] leading-none">✓</span>
                {usp}
              </span>
            ))}
          </div>
        )}

        {localized.description && (
          <p className="text-[14.5px] text-[#4A544D] leading-relaxed mb-4 line-clamp-4">
            {localized.description}
          </p>
        )}

        <TagsList data={data} />

        <div className="mt-auto pt-3.5 border-t border-[#E7E2DA] flex items-center gap-2 text-[#8A928B]">
          <MapPin className="w-4 h-4 shrink-0 text-[#8A928B]" />
          <span className="text-[13.5px] leading-tight truncate">
            {formatBusinessAddress(business.address, business.district)}
          </span>
        </div>

        <ClaimFooterHint business={business} lang={lang} />
      </div>
    </div>
  );
}
