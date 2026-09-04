import React from 'react';
import { MapPin } from 'lucide-react';
import { Business } from '../types';
import { useTranslation } from '../i18n';
import { getLocalizedBusiness } from '../utils/translator';
import { getBusinessReviewUsps } from '../utils/reviewUsps';
import { getBusinessRankingBadge } from '../utils/bestOfRankingBadges';
import RankingBadge from './RankingBadge';
import BusinessCategoryIcon from './BusinessCategoryIcon';

interface BusinessCardProps {
  business: Business;
  lang: 'de' | 'nl';
  allBusinesses: Business[];
  searchQuery?: string;
  onClick: (e: React.MouseEvent) => void;
  className?: string;
}

export default function BusinessCard({
  business,
  lang,
  allBusinesses,
  searchQuery = '',
  onClick,
  className = ''
}: BusinessCardProps) {
  const { t } = useTranslation();
  const localized = getLocalizedBusiness(business, lang);

  const approvedReviews = Array.isArray(business.reviews) 
    ? business.reviews.filter(r => !r.status || r.status === 'approved') 
    : [];
  const reviewCount = approvedReviews.length;
  const avgRating = reviewCount > 0 
    ? (approvedReviews.reduce((sum, r) => sum + (Number(r?.rating) || 0), 0) / reviewCount).toFixed(1)
    : null;

  const cardUsps = getBusinessReviewUsps(business, lang);
  const cardRankingBadge = getBusinessRankingBadge(business, allBusinesses);

  const imageSrc = business.headerImage || 
                   business.uploadedImage || 
                   business.imageLink || 
                   (Array.isArray(business.gallery) && business.gallery.length > 0 ? business.gallery[0] : null);

  const lowerSearch = searchQuery.toLowerCase().trim();

  return (
    <div 
      onClick={onClick}
      className={`group bg-white rounded-2xl shadow-sm border ${business.isPremium ? 'border-[#F2761B]/60 hover:border-[#F2761B]' : 'border-[#E7E2DA]'} overflow-hidden flex flex-col hover:-translate-y-1 hover:shadow-lg transition-all duration-200 cursor-pointer ${className}`}
    >
      {/* Top Image Banner */}
      <div className="h-[200px] w-full bg-[#FAF8F5] relative overflow-hidden shrink-0">
        {imageSrc ? (
          <img 
            src={imageSrc} 
            alt={business.name} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
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
        )}

        {/* Top Badges (Premium + Star Rating) */}
        <div className="absolute top-3 left-3 right-3 flex justify-between items-start pointer-events-none z-10">
          {business.isPremium ? (
            <div className="bg-[#FFF1E4] text-[#D65F0C] border border-[#FBD9BC] px-2.5 py-1 rounded-md text-[12px] font-bold shadow-sm backdrop-blur-xs">
              Premium
            </div>
          ) : <div />}

          {avgRating && (
            <div className="bg-white/95 backdrop-blur-sm border border-[#E7E2DA] px-2.5 py-1 rounded-md flex items-center gap-1.5 shadow-sm ml-auto">
              <span className="text-[#F2761B] text-[13px] leading-none">★</span>
              <span className="font-bold text-[13.5px] text-[#1B211D]">{avgRating}</span>
              <span className="text-[12px] text-[#5F6B63]">({reviewCount})</span>
            </div>
          )}
        </div>

        {/* Logo overlayed at bottom-left of image */}
        {business.logoUrl && (
          <div className="absolute -bottom-6 left-5 z-20">
            <div 
              className="w-[60px] h-[60px] bg-white rounded-xl shadow-md border border-[#E7E2DA] flex items-center justify-center overflow-hidden p-1.5"
              style={{ backgroundColor: business.logoBgColor || '#ffffff' }}
            >
              <img 
                src={business.logoUrl} 
                alt={business.name} 
                className="max-w-full max-h-full object-contain" 
              />
            </div>
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className={`px-5 ${business.logoUrl ? 'pt-9' : 'pt-5'} pb-5 flex flex-col flex-1`}>
        {/* Category */}
        <div className="text-[11px] font-bold text-[#F2761B] tracking-wider uppercase mb-1.5 line-clamp-1">
          {t(business.category)}{business.subcategory ? ` · ${t(business.subcategory)}` : ''}
        </div>

        {/* Title */}
        <h3 className="font-display text-[20px] font-bold text-[#1B211D] mb-2.5 leading-tight group-hover:text-[#0F4C2E] transition-colors">
          {business.name}
        </h3>

        {/* Ranking Badge */}
        {cardRankingBadge && (
          <div className="mb-3">
            <RankingBadge badge={cardRankingBadge} lang={lang} variant="compact" />
          </div>
        )}

        {/* AI Extracted Review USPs */}
        {cardUsps.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap mb-3">
            {cardUsps.map((usp, uIdx) => (
              <span
                key={uIdx}
                className="inline-flex items-center gap-1.5 bg-[#E8F1EB] border border-[#C5DFCE] text-[#0F4C2E] px-2.5 py-1 rounded-full text-[12px] font-semibold w-fit shadow-2xs"
              >
                <span className="text-[#F2761B] text-[11px] leading-none">✓</span>
                {usp}
              </span>
            ))}
          </div>
        )}

        {/* Complete Short Description (Not clamped as requested) */}
        {localized.description && (
          <p className="text-[14.5px] text-[#4A544D] leading-relaxed mb-4 whitespace-normal">
            {localized.description}
          </p>
        )}

        {/* Services Tags (Max 3, +X for Premium) */}
        {Array.isArray(localized.services) && localized.services.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap mb-2.5">
            {localized.services.slice(0, 3).map((svc, sIdx) => {
              const isMatched = lowerSearch && (
                svc.toLowerCase().includes(lowerSearch) || 
                (business.services && business.services.some(orig => orig.toLowerCase().includes(lowerSearch)))
              );
              return (
                <span
                  key={sIdx}
                  className={`text-[12px] px-2.5 py-1 rounded-md font-medium transition-colors ${
                    isMatched 
                      ? 'bg-[#FFF1E4] text-[#D65F0C] font-bold border border-[#F2761B]/40' 
                      : 'bg-[#FAF8F5] text-[#4A544D] border border-[#E7E2DA]'
                  }`}
                >
                  {isMatched ? `★ ${svc}` : svc}
                </span>
              );
            })}
            {business.isPremium && localized.services.length > 3 && (
              <span className="text-[11.5px] text-[#8A928B] font-medium self-center">
                +{localized.services.length - 3} {lang === 'nl' ? 'meer' : 'weitere'}
              </span>
            )}
          </div>
        )}

        {/* Products Tags (Max 3, +X for Premium) */}
        {Array.isArray(localized.products) && localized.products.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap mb-3.5">
            {localized.products.slice(0, 3).map((prod, pIdx) => {
              const isMatched = lowerSearch && (
                prod.toLowerCase().includes(lowerSearch) || 
                (business.products && business.products.some(orig => orig.toLowerCase().includes(lowerSearch)))
              );
              return (
                <span
                  key={pIdx}
                  className={`text-[12px] px-2.5 py-1 rounded-md font-medium transition-colors ${
                    isMatched 
                      ? 'bg-[#FFF1E4] text-[#D65F0C] font-bold border border-[#F2761B]/40' 
                      : 'bg-[#FFF8F1] text-[#D65F0C] border border-[#FBD9BC]'
                  }`}
                >
                  {isMatched ? `★ ${prod}` : prod}
                </span>
              );
            })}
            {business.isPremium && localized.products.length > 3 && (
              <span className="text-[11.5px] text-[#8A928B] font-medium self-center">
                +{localized.products.length - 3} {lang === 'nl' ? 'meer' : 'weitere'}
              </span>
            )}
          </div>
        )}

        {/* Address at Bottom */}
        <div className="mt-auto pt-4 border-t border-[#E7E2DA] flex items-center gap-2 text-[#8A928B]">
          <MapPin className="w-4 h-4 shrink-0 text-[#8A928B]" />
          <span className="text-[13.5px] leading-tight">{business.address}</span>
        </div>
      </div>
    </div>
  );
}
