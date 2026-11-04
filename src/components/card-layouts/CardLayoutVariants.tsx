import React from 'react';
import { MapPin, Heart, ShieldCheck, ArrowRight, Phone, Navigation, Star, Sparkles, Check, CheckCircle2 } from 'lucide-react';
import { Business } from '../../types';
import { formatBusinessAddress, isSundayOpen, isBusinessClaimed } from '../../utils';
import RankingBadge from '../RankingBadge';
import BusinessCategoryIcon from '../BusinessCategoryIcon';

export interface CardSharedData {
  business: Business;
  lang: 'de' | 'nl';
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
              loading="lazy"
            />
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
              <img src={business.logoUrl} alt={business.name} className="max-w-full max-h-full object-contain" />
            </div>
          </div>
        )}
      </div>

      <div className={`px-5 ${(business.isPremium && business.logoUrl) ? 'pt-9' : 'pt-5'} pb-5 flex flex-col flex-1 relative z-10 bg-white rounded-b-2xl`}>
        <div className="text-[11px] font-bold text-[#F2761B] tracking-wider uppercase mb-1.5 line-clamp-1">
          {t(business.category)}{business.subcategory ? ` · ${t(business.subcategory)}` : ''}
        </div>

        <h3 className="font-display text-[20px] font-bold text-[#1B211D] mb-2.5 leading-tight group-hover:text-[#0F4C2E] transition-colors">
          {business.name}
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

// ----------------------------------------------------------------------
// 02. MODERN COMPACT (Schlank & Informationsdicht)
// ----------------------------------------------------------------------
export function LayoutModernCompact({ data }: { data: CardSharedData }) {
  const { business, lang, onClick, className = '', isFav, toggleFavorite, avgRating, reviewCount, cardUsps, imageSrc, localized, t } = data;

  return (
    <div 
      onClick={onClick}
      className={`group bg-white rounded-xl shadow-xs border ${business.isPremium ? 'border-[#F2761B]/60' : 'border-[#EDE8E0]'} flex flex-col hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden ${className}`}
    >
      <div className="h-[135px] w-full bg-[#FAF8F5] relative shrink-0 overflow-hidden">
        {imageSrc ? (
          <img src={imageSrc} alt={business.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
        ) : (
          <FallbackBannerImage business={business} />
        )}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex justify-between items-center z-10">
          <StandardBadges data={data} showRating={false} />
          <FavoriteButton isFav={isFav} toggleFavorite={toggleFavorite} businessId={business.id} lang={lang} className="w-7 h-7" />
        </div>
      </div>

      <div className="p-4 flex flex-col flex-1 bg-white">
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <span className="text-[11px] font-bold text-[#F2761B] uppercase tracking-wide truncate">
            {t(business.category)}
          </span>
          {avgRating && (
            <span className="inline-flex items-center gap-1 text-[12px] font-bold text-[#1B211D] bg-[#FAF8F5] border border-[#E7E2DA] px-2 py-0.5 rounded shrink-0">
              <span className="text-[#F2761B]">★</span> {avgRating} <span className="text-[#8A928B] font-normal">({reviewCount})</span>
            </span>
          )}
        </div>

        <div className="flex items-start gap-3 mb-2">
          {business.logoUrl ? (
            <div className="w-10 h-10 rounded-lg border border-[#EDE8E0] bg-white p-1 shrink-0 flex items-center justify-center overflow-hidden">
              <img src={business.logoUrl} alt={business.name} className="max-w-full max-h-full object-contain" />
            </div>
          ) : null}
          <h3 className="font-display text-[17px] font-bold text-[#1B211D] leading-tight group-hover:text-[#0F4C2E] transition-colors line-clamp-2">
            {business.name}
          </h3>
        </div>

        {cardUsps.length > 0 && (
          <div className="mb-2">
            <span className="text-[11.5px] font-semibold text-[#0F4C2E] bg-[#E8F1EB] px-2 py-0.5 rounded-full inline-block truncate max-w-full">
              ✓ {cardUsps[0]}
            </span>
          </div>
        )}

        {localized.description && (
          <p className="text-[13px] text-[#5F6B63] leading-relaxed mb-3 line-clamp-2">
            {localized.description}
          </p>
        )}

        <div className="mt-auto pt-2.5 border-t border-[#F3F0EA] flex items-center justify-between text-[12px] text-[#8A928B]">
          <span className="truncate flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            {business.district || 'Winterberg'}
          </span>
          <span className="text-[#0F4C2E] font-semibold group-hover:underline flex items-center gap-0.5 shrink-0">
            Details <ArrowRight className="w-3 h-3" />
          </span>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// 03. HORIZONTAL CARD (Querformat & Magazin)
// ----------------------------------------------------------------------
export function LayoutHorizontalCard({ data }: { data: CardSharedData }) {
  const { business, lang, onClick, className = '', isFav, toggleFavorite, avgRating, reviewCount, cardUsps, cardRankingBadges, imageSrc, localized, t } = data;

  return (
    <div 
      onClick={onClick}
      className={`group bg-white rounded-2xl shadow-sm border ${business.isPremium ? 'border-[#F2761B]/60' : 'border-[#EDE8E0]'} flex flex-col sm:flex-row hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 cursor-pointer overflow-hidden ${className}`}
    >
      <div className="sm:w-[36%] w-full bg-[#FAF8F5] relative shrink-0 min-h-[170px] sm:min-h-full">
        {imageSrc ? (
          <img src={imageSrc} alt={business.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 absolute inset-0" loading="lazy" />
        ) : (
          <FallbackBannerImage business={business} />
        )}
        <div className="absolute top-3 left-3 right-3 flex justify-between items-start z-10">
          <StandardBadges data={data} showRating={false} />
          <FavoriteButton isFav={isFav} toggleFavorite={toggleFavorite} businessId={business.id} lang={lang} />
        </div>
      </div>

      <div className="p-5 sm:p-6 flex flex-col flex-1 justify-between bg-white">
        <div>
          <div className="flex items-center justify-between gap-3 mb-2">
            <span className="text-[11px] font-bold text-[#F2761B] tracking-wider uppercase">
              {t(business.category)} {business.district ? `· ${business.district}` : ''}
            </span>
            {business.logoUrl && (
              <div className="w-10 h-10 rounded-lg border border-[#EDE8E0] p-1 flex items-center justify-center bg-white shadow-2xs shrink-0">
                <img src={business.logoUrl} alt={business.name} className="max-w-full max-h-full object-contain" />
              </div>
            )}
          </div>

          <h3 className="font-display text-[21px] font-bold text-[#1B211D] mb-2 leading-tight group-hover:text-[#0F4C2E] transition-colors">
            {business.name}
          </h3>

          <div className="flex items-center gap-2 flex-wrap mb-3">
            {avgRating && (
              <div className="inline-flex items-center gap-1.5 bg-[#FAF8F5] border border-[#E7E2DA] px-2.5 py-0.5 rounded-md text-[12.5px] font-bold text-[#1B211D]">
                <span className="text-[#F2761B]">★</span> {avgRating} <span className="text-[#8A928B] font-normal">({reviewCount})</span>
              </div>
            )}
            {cardRankingBadges.length > 0 && (
              <RankingBadge badge={cardRankingBadges[0]} lang={lang} variant="compact" />
            )}
            {cardUsps.length > 0 && (
              <span className="text-[12px] font-semibold text-[#0F4C2E] bg-[#E8F1EB] px-2 py-0.5 rounded-full">
                ✓ {cardUsps[0]}
              </span>
            )}
          </div>

          {localized.description && (
            <p className="text-[14px] text-[#4A544D] leading-relaxed mb-4 line-clamp-3">
              {localized.description}
            </p>
          )}

          <TagsList data={data} maxServices={2} maxProducts={2} />
        </div>

        <div className="pt-3 border-t border-[#EDE8E0] flex items-center justify-between text-[13px] text-[#8A928B]">
          <span className="truncate flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-[#8A928B] shrink-0" />
            {formatBusinessAddress(business.address, business.district)}
          </span>
          <span className="text-[#0F4C2E] font-bold flex items-center gap-1 shrink-0 ml-2 group-hover:translate-x-0.5 transition-transform">
            {lang === 'nl' ? 'Bekijken' : 'Eintrag öffnen'} →
          </span>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// 04. EDITORIAL MINIMAL (Skandinavisch Minimal)
// ----------------------------------------------------------------------
export function LayoutEditorialMinimal({ data }: { data: CardSharedData }) {
  const { business, lang, onClick, className = '', isFav, toggleFavorite, avgRating, reviewCount, imageSrc, localized, t } = data;

  return (
    <div 
      onClick={onClick}
      className={`group bg-[#FAF8F5] rounded-2xl p-4 border border-[#EDE8E0] hover:border-[#0F4C2E]/40 hover:bg-white shadow-[0_2px_12px_rgba(27,33,29,0.03)] hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col ${className}`}
    >
      <div className="h-[180px] w-full rounded-xl overflow-hidden relative bg-stone-200 shrink-0 mb-4">
        {imageSrc ? (
          <img src={imageSrc} alt={business.name} className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500" loading="lazy" />
        ) : (
          <FallbackBannerImage business={business} />
        )}
        <div className="absolute top-2.5 right-2.5 z-10">
          <FavoriteButton isFav={isFav} toggleFavorite={toggleFavorite} businessId={business.id} lang={lang} className="bg-white/95" />
        </div>
        {business.isPremium && (
          <div className="absolute bottom-2.5 left-2.5 bg-white/95 backdrop-blur-xs text-[#0F4C2E] text-[11px] font-bold px-2 py-0.5 rounded shadow-xs uppercase tracking-wider">
            Premium Partner
          </div>
        )}
      </div>

      <div className="flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-[11px] text-[#8A928B] uppercase tracking-widest font-semibold mb-1.5">
            <span>{t(business.category)}</span>
            {avgRating && <span className="text-[#1B211D]">★ {avgRating}</span>}
          </div>

          <h3 className="font-display text-[20px] font-semibold text-[#1B211D] mb-2 leading-snug group-hover:text-[#0F4C2E] transition-colors">
            {business.name}
          </h3>

          {localized.description && (
            <p className="text-[13.5px] text-[#5F6B63] font-normal leading-relaxed line-clamp-3 mb-4">
              {localized.description}
            </p>
          )}
        </div>

        <div className="pt-3 border-t border-[#EDE8E0] flex items-center justify-between text-[12.5px] text-[#8A928B]">
          <span className="truncate">{business.district || 'Winterberg'}</span>
          <span className="font-medium text-[#1B211D] group-hover:text-[#0F4C2E] flex items-center gap-1">
            Mehr erfahren <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// 05. HERO OVERLAY (Cinematic Bild mit Dark Gradient)
// ----------------------------------------------------------------------
export function LayoutHeroOverlay({ data }: { data: CardSharedData }) {
  const { business, lang, onClick, className = '', isFav, toggleFavorite, avgRating, reviewCount, cardUsps, imageSrc, t } = data;

  return (
    <div 
      onClick={onClick}
      className={`group bg-white rounded-2xl shadow-sm border ${business.isPremium ? 'border-[#F2761B]/60' : 'border-[#EDE8E0]'} flex flex-col hover:-translate-y-1 hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden ${className}`}
    >
      <div className="h-[230px] w-full relative shrink-0 bg-neutral-900 overflow-hidden">
        {imageSrc ? (
          <img src={imageSrc} alt={business.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90" loading="lazy" />
        ) : (
          <FallbackBannerImage business={business} />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/10" />

        <div className="absolute top-3 left-3 right-3 flex justify-between items-center z-10">
          <StandardBadges data={data} showRating={false} />
          <FavoriteButton isFav={isFav} toggleFavorite={toggleFavorite} businessId={business.id} lang={lang} />
        </div>

        <div className="absolute bottom-3 left-4 right-4 z-10 text-white">
          <span className="text-[11px] font-bold text-[#FDBA74] tracking-wider uppercase block mb-1">
            {t(business.category)}
          </span>
          <h3 className="font-display text-[21px] font-bold text-white leading-tight mb-1 drop-shadow-sm group-hover:text-[#FDBA74] transition-colors">
            {business.name}
          </h3>
          <div className="flex items-center gap-2 text-xs text-white/80">
            {avgRating && (
              <span className="inline-flex items-center gap-1 font-semibold text-white">
                <span className="text-[#F2761B]">★</span> {avgRating} ({reviewCount})
              </span>
            )}
            <span>·</span>
            <span className="truncate">{business.district || 'Winterberg'}</span>
          </div>
        </div>
      </div>

      <div className="p-4 flex flex-col flex-1 bg-white justify-between">
        {cardUsps.length > 0 && (
          <div className="mb-3">
            <span className="inline-flex items-center gap-1.5 bg-[#E8F1EB] text-[#0F4C2E] border border-[#C5DFCE] px-2.5 py-1 rounded-full text-[12px] font-semibold">
              <span className="text-[#F2761B]">✓</span> {cardUsps[0]}
            </span>
          </div>
        )}

        <TagsList data={data} maxServices={2} maxProducts={2} />

        <div className="pt-3 border-t border-[#EDE8E0] flex items-center justify-between text-[13px] text-[#5F6B63]">
          <span className="truncate flex items-center gap-1.5 text-xs text-[#8A928B]">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            {formatBusinessAddress(business.address, business.district)}
          </span>
          <span className="text-[#0F4C2E] font-bold text-xs shrink-0 flex items-center gap-1">
            Ansehen →
          </span>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// 06. BOLD BRAND (Logo im Kopfbereich vor dem Bild)
// ----------------------------------------------------------------------
export function LayoutBoldBrand({ data }: { data: CardSharedData }) {
  const { business, lang, onClick, className = '', isFav, toggleFavorite, avgRating, reviewCount, imageSrc, localized, t } = data;

  return (
    <div 
      onClick={onClick}
      className={`group bg-white rounded-2xl shadow-sm border ${business.isPremium ? 'border-[#F2761B]/60' : 'border-[#EDE8E0]'} flex flex-col hover:-translate-y-1 hover:shadow-lg transition-all duration-200 cursor-pointer overflow-hidden ${className}`}
    >
      <div className="p-4 bg-white flex items-center gap-3.5 border-b border-[#F3F0EA]">
        <div className="w-[50px] h-[50px] rounded-xl border border-[#EDE8E0] bg-white p-1 shrink-0 flex items-center justify-center shadow-xs overflow-hidden">
          {business.logoUrl ? (
            <img src={business.logoUrl} alt={business.name} className="max-w-full max-h-full object-contain" />
          ) : (
            <div className="w-full h-full bg-[#0F4C2E] text-white rounded-lg flex items-center justify-center font-bold text-base">
              {business.name.slice(0, 2).toUpperCase()}
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <span className="text-[10.5px] font-bold text-[#F2761B] tracking-wider uppercase block truncate">
            {t(business.category)}
          </span>
          <h3 className="font-display text-[18px] font-bold text-[#1B211D] leading-tight truncate group-hover:text-[#0F4C2E] transition-colors">
            {business.name}
          </h3>
        </div>

        <FavoriteButton isFav={isFav} toggleFavorite={toggleFavorite} businessId={business.id} lang={lang} className="shrink-0" />
      </div>

      <div className="h-[160px] w-full bg-[#FAF8F5] relative shrink-0 overflow-hidden">
        {imageSrc ? (
          <img src={imageSrc} alt={business.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
        ) : (
          <FallbackBannerImage business={business} />
        )}
        <div className="absolute top-2.5 left-2.5 z-10">
          <StandardBadges data={data} showRating={false} />
        </div>
        {avgRating && (
          <div className="absolute bottom-2.5 right-2.5 bg-white/95 px-2.5 py-0.5 rounded-md text-xs font-bold text-[#1B211D] shadow-sm">
            <span className="text-[#F2761B]">★</span> {avgRating} ({reviewCount})
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1 bg-white justify-between">
        {localized.description && (
          <p className="text-[13.5px] text-[#4A544D] leading-relaxed mb-3 line-clamp-2">
            {localized.description}
          </p>
        )}
        <div className="mt-auto pt-2.5 border-t border-[#EDE8E0] flex items-center justify-between text-xs text-[#8A928B]">
          <span className="truncate flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            {formatBusinessAddress(business.address, business.district)}
          </span>
          <span className="text-[#0F4C2E] font-bold">Öffnen →</span>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// 07. FLOATING AVATAR (Zentraler runder Logo-Badge)
// ----------------------------------------------------------------------
export function LayoutFloatingAvatar({ data }: { data: CardSharedData }) {
  const { business, lang, onClick, className = '', isFav, toggleFavorite, avgRating, reviewCount, imageSrc, localized, t } = data;

  return (
    <div 
      onClick={onClick}
      className={`group bg-white rounded-2xl shadow-sm border ${business.isPremium ? 'border-[#F2761B]/60' : 'border-[#EDE8E0]'} flex flex-col hover:-translate-y-1 hover:shadow-lg transition-all duration-200 cursor-pointer overflow-hidden ${className}`}
    >
      <div className="h-[170px] w-full bg-[#FAF8F5] relative shrink-0">
        {imageSrc ? (
          <img src={imageSrc} alt={business.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
        ) : (
          <FallbackBannerImage business={business} />
        )}
        <div className="absolute top-3 left-3 right-3 flex justify-between items-center z-10">
          <StandardBadges data={data} showRating={false} />
          <FavoriteButton isFav={isFav} toggleFavorite={toggleFavorite} businessId={business.id} lang={lang} />
        </div>

        <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 z-20">
          <div className="w-[62px] h-[62px] rounded-full bg-white shadow-md border-2 border-white ring-2 ring-[#EDE8E0] flex items-center justify-center overflow-hidden p-1.5">
            {business.logoUrl ? (
              <img src={business.logoUrl} alt={business.name} className="max-w-full max-h-full object-contain" />
            ) : (
              <div className="w-full h-full bg-[#0F4C2E] text-white rounded-full flex items-center justify-center font-bold text-sm">
                {business.name.slice(0, 2).toUpperCase()}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="pt-9 px-5 pb-5 flex flex-col flex-1 items-center text-center bg-white justify-between">
        <div>
          <span className="text-[11px] font-bold text-[#F2761B] tracking-wider uppercase block mb-1">
            {t(business.category)}
          </span>
          <h3 className="font-display text-[19px] font-bold text-[#1B211D] mb-2 leading-tight group-hover:text-[#0F4C2E] transition-colors">
            {business.name}
          </h3>

          {avgRating && (
            <div className="inline-flex items-center gap-1 text-xs font-bold text-[#1B211D] bg-[#FAF8F5] border border-[#EDE8E0] px-2.5 py-0.5 rounded-full mb-3">
              <span className="text-[#F2761B]">★</span> {avgRating} <span className="text-[#8A928B] font-normal">({reviewCount})</span>
            </div>
          )}

          {localized.description && (
            <p className="text-[13.5px] text-[#5F6B63] leading-relaxed line-clamp-3 mb-3">
              {localized.description}
            </p>
          )}
        </div>

        <div className="w-full pt-3 border-t border-[#EDE8E0] flex items-center justify-center gap-1.5 text-xs text-[#8A928B]">
          <MapPin className="w-3.5 h-3.5 text-[#8A928B]" />
          <span>{business.district || 'Winterberg'}</span>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// 08. ACCENT SIDEBAR (Sauerland Waldgrün-Streifen)
// ----------------------------------------------------------------------
export function LayoutAccentSidebar({ data }: { data: CardSharedData }) {
  const { business, lang, onClick, className = '', isFav, toggleFavorite, avgRating, reviewCount, cardUsps, imageSrc, localized, t } = data;

  return (
    <div 
      onClick={onClick}
      className={`group bg-white rounded-2xl shadow-sm border border-[#EDE8E0] ${business.isPremium ? 'border-l-[6px] border-l-[#F2761B]' : 'border-l-[6px] border-l-[#0F4C2E]'} flex flex-col hover:-translate-y-1 hover:shadow-lg transition-all duration-200 cursor-pointer overflow-hidden ${className}`}
    >
      <div className="h-[175px] w-full bg-[#FAF8F5] relative shrink-0">
        {imageSrc ? (
          <img src={imageSrc} alt={business.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
        ) : (
          <FallbackBannerImage business={business} />
        )}
        <div className="absolute top-3 left-3 right-3 flex justify-between items-center z-10">
          <StandardBadges data={data} showRating={false} />
          <FavoriteButton isFav={isFav} toggleFavorite={toggleFavorite} businessId={business.id} lang={lang} />
        </div>
        <div className="absolute bottom-2.5 left-3 bg-[#0F4C2E]/90 backdrop-blur-xs text-white text-[10.5px] font-bold px-2 py-0.5 rounded shadow-xs uppercase tracking-wider">
          Sauerland Original
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1 bg-white justify-between">
        <div>
          <div className="flex items-center justify-between text-[11px] font-bold text-[#F2761B] uppercase tracking-wide mb-1.5">
            <span>{t(business.category)}</span>
            {avgRating && <span className="text-[#0F4C2E]">★ {avgRating}</span>}
          </div>

          <h3 className="font-display text-[19px] font-bold text-[#1B211D] mb-2 leading-tight group-hover:text-[#0F4C2E] transition-colors">
            {business.name}
          </h3>

          {cardUsps.length > 0 && (
            <div className="mb-3">
              <span className="text-[12px] font-semibold text-[#0F4C2E] bg-[#E8F1EB] px-2.5 py-0.5 rounded-full inline-block">
                ✓ {cardUsps[0]}
              </span>
            </div>
          )}

          {localized.description && (
            <p className="text-[14px] text-[#4A544D] leading-relaxed mb-3 line-clamp-3">
              {localized.description}
            </p>
          )}

          <TagsList data={data} maxServices={2} maxProducts={2} />
        </div>

        <div className="pt-3 border-t border-[#EDE8E0] flex items-center justify-between text-xs text-[#8A928B]">
          <span className="truncate flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            {formatBusinessAddress(business.address, business.district)}
          </span>
          <span className="text-[#0F4C2E] font-bold">Details →</span>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// 09. BADGE RIBBON (Auszeichnung & Siegel-Fokus)
// ----------------------------------------------------------------------
export function LayoutBadgeRibbon({ data }: { data: CardSharedData }) {
  const { business, lang, onClick, className = '', isFav, toggleFavorite, avgRating, reviewCount, cardRankingBadges, imageSrc, localized, t } = data;

  return (
    <div 
      onClick={onClick}
      className={`group bg-white rounded-2xl shadow-sm border ${business.isPremium ? 'border-[#F2761B]/60' : 'border-[#EDE8E0]'} flex flex-col hover:-translate-y-1 hover:shadow-lg transition-all duration-200 cursor-pointer overflow-hidden ${className}`}
    >
      <div className="h-[185px] w-full bg-[#FAF8F5] relative shrink-0">
        {imageSrc ? (
          <img src={imageSrc} alt={business.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
        ) : (
          <FallbackBannerImage business={business} />
        )}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
          <StandardBadges data={data} showRating={false} />
        </div>
        <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5">
          <FavoriteButton isFav={isFav} toggleFavorite={toggleFavorite} businessId={business.id} lang={lang} />
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1 bg-white justify-between">
        <div>
          {/* Trust Banner with big Rating Box */}
          <div className="bg-[#FFF8F1] border border-[#FBD9BC] rounded-xl p-2.5 mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-[#F2761B] text-white flex items-center justify-center font-bold text-sm">
                ★
              </span>
              <div>
                <div className="font-bold text-[13px] text-[#1B211D]">
                  {avgRating ? `${avgRating} von 5.0` : 'Winterberg Profil'}
                </div>
                <div className="text-[11px] text-[#8A928B]">
                  {reviewCount > 0 ? `${reviewCount} verifizierte Bewertungen` : 'Geprüfter Eintrag'}
                </div>
              </div>
            </div>
            {cardRankingBadges.length > 0 && (
              <RankingBadge badge={cardRankingBadges[0]} lang={lang} variant="compact" />
            )}
          </div>

          <span className="text-[11px] font-bold text-[#F2761B] tracking-wider uppercase block mb-1">
            {t(business.category)}
          </span>

          <h3 className="font-display text-[19px] font-bold text-[#1B211D] mb-2 leading-tight group-hover:text-[#0F4C2E] transition-colors">
            {business.name}
          </h3>

          {localized.description && (
            <p className="text-[13.5px] text-[#4A544D] leading-relaxed mb-3 line-clamp-3">
              {localized.description}
            </p>
          )}
        </div>

        <div className="pt-3 border-t border-[#EDE8E0] flex items-center justify-between text-xs text-[#8A928B]">
          <span className="truncate flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            {formatBusinessAddress(business.address, business.district)}
          </span>
          <span className="text-[#0F4C2E] font-bold">Ansehen →</span>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// 10. PHOTO MOSAIC (Mini-Fotogalerie)
// ----------------------------------------------------------------------
export function LayoutPhotoMosaic({ data }: { data: CardSharedData }) {
  const { business, lang, onClick, className = '', isFav, toggleFavorite, avgRating, reviewCount, imageSrc, localized, t } = data;

  const galleryImages = Array.isArray(business.gallery) && business.gallery.length > 0 
    ? business.gallery 
    : [imageSrc, imageSrc];

  return (
    <div 
      onClick={onClick}
      className={`group bg-white rounded-2xl shadow-sm border ${business.isPremium ? 'border-[#F2761B]/60' : 'border-[#EDE8E0]'} flex flex-col hover:-translate-y-1 hover:shadow-lg transition-all duration-200 cursor-pointer overflow-hidden ${className}`}
    >
      <div className="h-[185px] w-full grid grid-cols-3 gap-0.5 relative shrink-0 bg-stone-100 overflow-hidden">
        <div className="col-span-2 h-full relative overflow-hidden">
          {imageSrc ? (
            <img src={imageSrc} alt={business.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
          ) : (
            <FallbackBannerImage business={business} />
          )}
        </div>
        <div className="col-span-1 grid grid-rows-2 gap-0.5 h-full">
          <div className="relative overflow-hidden bg-stone-200">
            <img src={galleryImages[0] || imageSrc || ''} alt="Preview 1" className="w-full h-full object-cover" loading="lazy" />
          </div>
          <div className="relative overflow-hidden bg-stone-200">
            <img src={galleryImages[1] || imageSrc || ''} alt="Preview 2" className="w-full h-full object-cover" loading="lazy" />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center text-white text-[11px] font-bold">
              + Galerie
            </div>
          </div>
        </div>

        <div className="absolute top-2.5 left-2.5 z-10">
          <StandardBadges data={data} showRating={false} />
        </div>
        <div className="absolute top-2.5 right-2.5 z-10">
          <FavoriteButton isFav={isFav} toggleFavorite={toggleFavorite} businessId={business.id} lang={lang} />
        </div>
      </div>

      <div className="p-4 flex flex-col flex-1 bg-white justify-between">
        <div>
          <div className="flex items-center justify-between text-[11px] font-bold text-[#F2761B] uppercase tracking-wide mb-1">
            <span>{t(business.category)}</span>
            {avgRating && <span className="text-[#1B211D]">★ {avgRating} ({reviewCount})</span>}
          </div>

          <h3 className="font-display text-[18px] font-bold text-[#1B211D] mb-2 leading-tight group-hover:text-[#0F4C2E] transition-colors">
            {business.name}
          </h3>

          {localized.description && (
            <p className="text-[13.5px] text-[#4A544D] leading-relaxed mb-3 line-clamp-2">
              {localized.description}
            </p>
          )}

          <TagsList data={data} maxServices={2} maxProducts={2} />
        </div>

        <div className="pt-2.5 border-t border-[#EDE8E0] flex items-center justify-between text-xs text-[#8A928B]">
          <span className="truncate flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            {formatBusinessAddress(business.address, business.district)}
          </span>
          <span className="text-[#0F4C2E] font-bold">Fotos & Profil →</span>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// 11. TAG CLOUD SERVICES (Leistungssuche & Tags)
// ----------------------------------------------------------------------
export function LayoutTagCloudServices({ data }: { data: CardSharedData }) {
  const { business, lang, onClick, className = '', isFav, toggleFavorite, avgRating, reviewCount, imageSrc, localized, t } = data;

  return (
    <div 
      onClick={onClick}
      className={`group bg-white rounded-2xl shadow-sm border ${business.isPremium ? 'border-[#F2761B]/60' : 'border-[#EDE8E0]'} flex flex-col hover:-translate-y-1 hover:shadow-lg transition-all duration-200 cursor-pointer overflow-hidden ${className}`}
    >
      <div className="h-[125px] w-full bg-[#FAF8F5] relative shrink-0 overflow-hidden">
        {imageSrc ? (
          <img src={imageSrc} alt={business.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
        ) : (
          <FallbackBannerImage business={business} />
        )}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex justify-between items-center z-10">
          <StandardBadges data={data} showRating={false} />
          <FavoriteButton isFav={isFav} toggleFavorite={toggleFavorite} businessId={business.id} lang={lang} className="w-7 h-7" />
        </div>
      </div>

      <div className="p-4 flex flex-col flex-1 bg-white justify-between">
        <div>
          <div className="flex items-center justify-between text-[11px] font-bold text-[#F2761B] uppercase tracking-wide mb-1">
            <span>{t(business.category)}</span>
            {avgRating && <span className="text-[#1B211D]">★ {avgRating} ({reviewCount})</span>}
          </div>

          <h3 className="font-display text-[18px] font-bold text-[#1B211D] mb-2 leading-tight group-hover:text-[#0F4C2E] transition-colors">
            {business.name}
          </h3>

          <div className="text-[11px] uppercase tracking-wider text-[#8A928B] font-bold mb-1.5">
            Angebot &amp; Leistungen:
          </div>

          <TagsList data={data} maxServices={5} maxProducts={5} />
        </div>

        <div className="mt-3 pt-2.5 border-t border-[#EDE8E0] flex items-center justify-between text-xs text-[#8A928B]">
          <span className="truncate flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            {formatBusinessAddress(business.address, business.district)}
          </span>
          <span className="text-[#0F4C2E] font-bold">Anfragen →</span>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// 12. FLAT PAPER (Warm Stone / Naturpapier)
// ----------------------------------------------------------------------
export function LayoutFlatPaper({ data }: { data: CardSharedData }) {
  const { business, lang, onClick, className = '', isFav, toggleFavorite, avgRating, reviewCount, cardUsps, imageSrc, localized, t } = data;

  return (
    <div 
      onClick={onClick}
      className={`group bg-[#F7F5F0] rounded-3xl shadow-[0_4px_20px_rgba(27,33,29,0.04)] border border-[#E8E3D9] flex flex-col hover:-translate-y-1 hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden ${className}`}
    >
      <div className="h-[185px] w-full bg-[#EAE5DC] relative shrink-0 overflow-hidden">
        {imageSrc ? (
          <img src={imageSrc} alt={business.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
        ) : (
          <FallbackBannerImage business={business} />
        )}
        <div className="absolute top-3 left-3 right-3 flex justify-between items-center z-10">
          <StandardBadges data={data} showRating={false} />
          <FavoriteButton isFav={isFav} toggleFavorite={toggleFavorite} businessId={business.id} lang={lang} className="bg-[#FAF8F5]" />
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1 justify-between">
        <div>
          <span className="text-[11px] font-bold text-stone-600 tracking-wider uppercase block mb-1">
            {t(business.category)}
          </span>

          <h3 className="font-display text-[20px] font-bold text-[#1B211D] mb-2 leading-tight group-hover:text-[#0F4C2E] transition-colors">
            {business.name}
          </h3>

          {avgRating && (
            <div className="inline-flex items-center gap-1 text-xs font-bold text-[#1B211D] bg-white border border-[#E8E3D9] px-2.5 py-0.5 rounded-full mb-3 shadow-2xs">
              <span className="text-[#F2761B]">★</span> {avgRating} <span className="text-[#8A928B] font-normal">({reviewCount})</span>
            </div>
          )}

          {cardUsps.length > 0 && (
            <div className="mb-3">
              <span className="text-[12px] font-semibold text-[#0F4C2E] bg-[#E8F1EB] px-2.5 py-0.5 rounded-full inline-block">
                ✓ {cardUsps[0]}
              </span>
            </div>
          )}

          {localized.description && (
            <p className="text-[14px] text-[#4A544D] leading-relaxed mb-3 line-clamp-3">
              {localized.description}
            </p>
          )}
        </div>

        <div className="pt-3 border-t border-[#E8E3D9] flex items-center justify-between text-xs text-[#5F6B63]">
          <span className="truncate flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-stone-500 shrink-0" />
            {formatBusinessAddress(business.address, business.district)}
          </span>
          <span className="font-bold text-[#0F4C2E]">Entdecken →</span>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// 13. DARK EMERALD (Premium Waldgrün)
// ----------------------------------------------------------------------
export function LayoutDarkEmerald({ data }: { data: CardSharedData }) {
  const { business, lang, onClick, className = '', isFav, toggleFavorite, avgRating, reviewCount, imageSrc, localized, t } = data;

  return (
    <div 
      onClick={onClick}
      className={`group bg-white rounded-2xl shadow-sm border ${business.isPremium ? 'border-[#F2761B]/60' : 'border-[#EDE8E0]'} flex flex-col hover:-translate-y-1 hover:shadow-xl transition-all duration-200 cursor-pointer overflow-hidden ${className}`}
    >
      <div className="bg-gradient-to-r from-[#06301C] via-[#0F4C2E] to-[#144D30] text-white p-4 flex items-center justify-between gap-3 shrink-0">
        <div className="min-w-0">
          <span className="text-[10.5px] font-bold text-[#FDBA74] uppercase tracking-wider block truncate">
            {t(business.category)}
          </span>
          <h3 className="font-display text-[18px] font-bold text-white truncate leading-tight">
            {business.name}
          </h3>
        </div>
        <FavoriteButton isFav={isFav} toggleFavorite={toggleFavorite} businessId={business.id} lang={lang} className="bg-white/20 text-white hover:text-white" />
      </div>

      <div className="h-[160px] w-full bg-[#FAF8F5] relative shrink-0 overflow-hidden">
        {imageSrc ? (
          <img src={imageSrc} alt={business.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
        ) : (
          <FallbackBannerImage business={business} />
        )}
        <div className="absolute top-2.5 left-2.5 z-10">
          <StandardBadges data={data} showRating={false} />
        </div>
        {avgRating && (
          <div className="absolute bottom-2.5 right-2.5 bg-[#0F4C2E] text-white px-2.5 py-0.5 rounded-md text-xs font-bold shadow-md">
            ★ {avgRating} ({reviewCount})
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1 bg-white justify-between">
        {localized.description && (
          <p className="text-[13.5px] text-[#4A544D] leading-relaxed mb-3 line-clamp-3">
            {localized.description}
          </p>
        )}

        <div className="mt-auto pt-2.5 border-t border-[#EDE8E0] flex items-center justify-between text-xs text-[#8A928B]">
          <span className="truncate flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            {formatBusinessAddress(business.address, business.district)}
          </span>
          <span className="text-[#0F4C2E] font-bold">Zum Profil →</span>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// 14. INTERACTIVE FLIP (Direkt-Aktion & Kontakt)
// ----------------------------------------------------------------------
export function LayoutInteractiveFlip({ data }: { data: CardSharedData }) {
  const { business, lang, onClick, className = '', isFav, toggleFavorite, avgRating, reviewCount, cardUsps, imageSrc, localized, t } = data;

  return (
    <div 
      onClick={onClick}
      className={`group bg-white rounded-2xl shadow-sm border ${business.isPremium ? 'border-[#F2761B]/60' : 'border-[#EDE8E0]'} flex flex-col hover:-translate-y-1 hover:shadow-xl transition-all duration-200 cursor-pointer overflow-hidden ${className}`}
    >
      <div className="h-[175px] w-full bg-[#FAF8F5] relative shrink-0">
        {imageSrc ? (
          <img src={imageSrc} alt={business.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
        ) : (
          <FallbackBannerImage business={business} />
        )}
        <div className="absolute top-3 left-3 right-3 flex justify-between items-center z-10">
          <StandardBadges data={data} showRating={false} />
          <FavoriteButton isFav={isFav} toggleFavorite={toggleFavorite} businessId={business.id} lang={lang} />
        </div>
      </div>

      <div className="p-4 flex flex-col flex-1 bg-white justify-between">
        <div>
          <div className="flex items-center justify-between text-[11px] font-bold text-[#F2761B] uppercase tracking-wide mb-1">
            <span>{t(business.category)}</span>
            {avgRating && <span className="text-[#1B211D]">★ {avgRating} ({reviewCount})</span>}
          </div>

          <h3 className="font-display text-[19px] font-bold text-[#1B211D] mb-2 leading-tight group-hover:text-[#0F4C2E] transition-colors">
            {business.name}
          </h3>

          {cardUsps.length > 0 && (
            <div className="mb-2">
              <span className="text-[12px] font-semibold text-[#0F4C2E] bg-[#E8F1EB] px-2 py-0.5 rounded-full inline-block">
                ✓ {cardUsps[0]}
              </span>
            </div>
          )}

          {localized.description && (
            <p className="text-[13.5px] text-[#4A544D] leading-relaxed mb-3 line-clamp-2">
              {localized.description}
            </p>
          )}
        </div>

        {/* Direct Action Bar */}
        <div className="mt-2 pt-3 border-t border-[#EDE8E0] flex items-center gap-2">
          <button 
            type="button" 
            className="flex-1 bg-[#0F4C2E] hover:bg-[#06301C] text-white text-xs font-bold py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <span>Profil ansehen</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          {business.phone ? (
            <a 
              href={`tel:${business.phone}`} 
              onClick={(e) => e.stopPropagation()} 
              title="Anrufen"
              className="w-8 h-8 rounded-lg bg-[#FAF8F5] border border-[#E7E2DA] hover:bg-[#E8F1EB] hover:text-[#0F4C2E] text-[#5F6B63] flex items-center justify-center shrink-0 transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
            </a>
          ) : (
            <div className="w-8 h-8 rounded-lg bg-[#FAF8F5] border border-[#E7E2DA] text-[#8A928B] flex items-center justify-center shrink-0">
              <MapPin className="w-3.5 h-3.5" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// 15. BENTO GRID (Modernes Bento-Box Modular)
// ----------------------------------------------------------------------
export function LayoutBentoGrid({ data }: { data: CardSharedData }) {
  const { business, lang, onClick, className = '', isFav, toggleFavorite, avgRating, reviewCount, cardUsps, imageSrc, localized, t } = data;

  return (
    <div 
      onClick={onClick}
      className={`group bg-[#F8F9FA] p-3 rounded-2xl border ${business.isPremium ? 'border-[#F2761B]/60' : 'border-[#EDE8E0]'} shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col gap-2.5 ${className}`}
    >
      {/* Box 1: Image container with padding */}
      <div className="h-[160px] w-full rounded-xl overflow-hidden relative bg-stone-200 shrink-0">
        {imageSrc ? (
          <img src={imageSrc} alt={business.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
        ) : (
          <FallbackBannerImage business={business} />
        )}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex justify-between items-center z-10">
          <StandardBadges data={data} showRating={false} />
          <FavoriteButton isFav={isFav} toggleFavorite={toggleFavorite} businessId={business.id} lang={lang} className="w-7 h-7" />
        </div>
      </div>

      {/* Box 2: Info Module */}
      <div className="bg-white p-3.5 rounded-xl border border-[#EDE8E0]/70 flex flex-col flex-1 justify-between">
        <div>
          <div className="flex items-center justify-between text-[11px] font-bold text-[#F2761B] uppercase tracking-wide mb-1">
            <span>{t(business.category)}</span>
            {avgRating && <span className="text-[#1B211D]">★ {avgRating} ({reviewCount})</span>}
          </div>

          <h3 className="font-display text-[18px] font-bold text-[#1B211D] mb-2 leading-tight group-hover:text-[#0F4C2E] transition-colors">
            {business.name}
          </h3>

          {cardUsps.length > 0 && (
            <div className="mb-2">
              <span className="text-[11.5px] font-semibold text-[#0F4C2E] bg-[#E8F1EB] px-2 py-0.5 rounded-md inline-block">
                ✓ {cardUsps[0]}
              </span>
            </div>
          )}

          {localized.description && (
            <p className="text-[13px] text-[#4A544D] leading-relaxed mb-2 line-clamp-2">
              {localized.description}
            </p>
          )}
        </div>

        <div className="pt-2 border-t border-[#F3F0EA] flex items-center justify-between text-xs text-[#8A928B]">
          <span className="truncate flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            {business.district || 'Winterberg'}
          </span>
          <span className="text-[#0F4C2E] font-bold">Öffnen →</span>
        </div>
      </div>
    </div>
  );
}
