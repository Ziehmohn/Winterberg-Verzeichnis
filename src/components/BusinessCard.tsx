import React from 'react';
import { Business, CardLayoutId } from '../types';
import { useTranslation } from '../i18n';
import { getLocalizedBusiness } from '../utils/translator';
import { getBusinessReviewUsps } from '../utils/reviewUsps';
import { getBusinessRankingBadges } from '../utils/bestOfRankingBadges';
import { useFavorites } from '../utils/favorites';
import {
  CardSharedData,
  LayoutDefault,
  LayoutModernCompact,
  LayoutHorizontalCard,
  LayoutEditorialMinimal,
  LayoutHeroOverlay,
  LayoutBoldBrand,
  LayoutFloatingAvatar,
  LayoutAccentSidebar,
  LayoutBadgeRibbon,
  LayoutPhotoMosaic,
  LayoutTagCloudServices,
  LayoutFlatPaper,
  LayoutDarkEmerald,
  LayoutInteractiveFlip,
  LayoutBentoGrid
} from './card-layouts/CardLayoutVariants';

let cachedGlobalLayout: CardLayoutId = 'default';
if (typeof window !== 'undefined') {
  try {
    const raw = localStorage.getItem('siteDesignSettings');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.cardLayout) cachedGlobalLayout = parsed.cardLayout;
    }
  } catch (e) {}
}

export function setGlobalCardLayout(layout: CardLayoutId) {
  cachedGlobalLayout = layout;
}

export function getGlobalCardLayout(): CardLayoutId {
  return cachedGlobalLayout;
}

export interface BusinessCardProps {
  key?: any;
  business: Business;
  lang?: 'de' | 'nl';
  allBusinesses?: Business[];
  searchQuery?: string;
  onClick: (e: React.MouseEvent) => void;
  className?: string;
  theme?: any;
  layout?: CardLayoutId;
}

export default function BusinessCard({
  business,
  lang: propLang,
  allBusinesses = [],
  searchQuery = '',
  onClick,
  className = '',
  layout
}: BusinessCardProps) {
  const { t, lang: contextLang } = useTranslation();
  const lang = propLang || contextLang || 'de';
  const localized = getLocalizedBusiness(business, lang);

  const { isFavorite, toggleFavorite } = useFavorites();
  const isFav = isFavorite(business.id);

  const approvedReviews = Array.isArray(business.reviews) 
    ? business.reviews.filter(r => !r.status || r.status === 'approved') 
    : [];
  const reviewCount = approvedReviews.length;
  const avgRating = reviewCount > 0 
    ? (approvedReviews.reduce((sum, r) => sum + (Number(r?.rating) || 0), 0) / reviewCount).toFixed(1)
    : null;

  const cardUsps = getBusinessReviewUsps(business, lang);
  const cardRankingBadges = getBusinessRankingBadges(business, allBusinesses);

  const imageSrc = business.headerImage || 
                   business.uploadedImage || 
                   business.imageLink || 
                   (Array.isArray(business.gallery) && business.gallery.length > 0 ? business.gallery[0] : null);

  const lowerSearch = searchQuery.toLowerCase().trim();

  const sharedData: CardSharedData = {
    business,
    lang,
    allBusinesses,
    searchQuery,
    onClick,
    className,
    isFav,
    toggleFavorite,
    avgRating,
    reviewCount,
    cardUsps,
    cardRankingBadges,
    imageSrc,
    lowerSearch,
    localized,
    t
  };

  const activeLayout: CardLayoutId = layout || getGlobalCardLayout() || 'default';

  switch (activeLayout) {
    case 'modern-compact':
      return <LayoutModernCompact data={sharedData} />;
    case 'horizontal-card':
      return <LayoutHorizontalCard data={sharedData} />;
    case 'editorial-minimal':
      return <LayoutEditorialMinimal data={sharedData} />;
    case 'hero-overlay':
      return <LayoutHeroOverlay data={sharedData} />;
    case 'bold-brand':
      return <LayoutBoldBrand data={sharedData} />;
    case 'floating-avatar':
      return <LayoutFloatingAvatar data={sharedData} />;
    case 'accent-sidebar':
      return <LayoutAccentSidebar data={sharedData} />;
    case 'badge-ribbon':
      return <LayoutBadgeRibbon data={sharedData} />;
    case 'photo-mosaic':
      return <LayoutPhotoMosaic data={sharedData} />;
    case 'tag-cloud-services':
      return <LayoutTagCloudServices data={sharedData} />;
    case 'flat-paper':
      return <LayoutFlatPaper data={sharedData} />;
    case 'dark-emerald':
      return <LayoutDarkEmerald data={sharedData} />;
    case 'interactive-flip':
      return <LayoutInteractiveFlip data={sharedData} />;
    case 'bento-grid':
      return <LayoutBentoGrid data={sharedData} />;
    case 'default':
    default:
      return <LayoutDefault data={sharedData} />;
  }
}
