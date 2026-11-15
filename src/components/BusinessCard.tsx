import React, { Suspense } from 'react';
import { Business, CardLayoutId } from '../types';
import { useTranslation } from '../i18n';
import { getLocalizedBusiness } from '../utils/translator';
import { getBusinessReviewUsps } from '../utils/reviewUsps';
import { getBusinessRankingBadges } from '../utils/bestOfRankingBadges';
import { useFavorites } from '../utils/favorites';
import { getBusinessPath } from '../utils/routes';
import { CardSharedData, LayoutDefault } from './card-layouts/CardLayoutDefault';

const lazyVariant = <K extends keyof typeof import('./card-layouts/CardLayoutVariants')>(name: K) =>
  React.lazy(() =>
    import('./card-layouts/CardLayoutVariants').then((m) => ({
      default: m[name] as React.ComponentType<{ data: CardSharedData }>,
    }))
  );

const LayoutModernCompact = lazyVariant('LayoutModernCompact');
const LayoutHorizontalCard = lazyVariant('LayoutHorizontalCard');
const LayoutEditorialMinimal = lazyVariant('LayoutEditorialMinimal');
const LayoutHeroOverlay = lazyVariant('LayoutHeroOverlay');
const LayoutBoldBrand = lazyVariant('LayoutBoldBrand');
const LayoutFloatingAvatar = lazyVariant('LayoutFloatingAvatar');
const LayoutAccentSidebar = lazyVariant('LayoutAccentSidebar');
const LayoutBadgeRibbon = lazyVariant('LayoutBadgeRibbon');
const LayoutPhotoMosaic = lazyVariant('LayoutPhotoMosaic');
const LayoutTagCloudServices = lazyVariant('LayoutTagCloudServices');
const LayoutFlatPaper = lazyVariant('LayoutFlatPaper');
const LayoutDarkEmerald = lazyVariant('LayoutDarkEmerald');
const LayoutInteractiveFlip = lazyVariant('LayoutInteractiveFlip');
const LayoutBentoGrid = lazyVariant('LayoutBentoGrid');

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
    businessUrl: getBusinessPath(business, lang),
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

  if (activeLayout === 'default') {
    return <LayoutDefault data={sharedData} />;
  }

  let VariantComponent: React.ComponentType<{ data: CardSharedData }> = LayoutDefault;
  switch (activeLayout) {
    case 'modern-compact':
      VariantComponent = LayoutModernCompact;
      break;
    case 'horizontal-card':
      VariantComponent = LayoutHorizontalCard;
      break;
    case 'editorial-minimal':
      VariantComponent = LayoutEditorialMinimal;
      break;
    case 'hero-overlay':
      VariantComponent = LayoutHeroOverlay;
      break;
    case 'bold-brand':
      VariantComponent = LayoutBoldBrand;
      break;
    case 'floating-avatar':
      VariantComponent = LayoutFloatingAvatar;
      break;
    case 'accent-sidebar':
      VariantComponent = LayoutAccentSidebar;
      break;
    case 'badge-ribbon':
      VariantComponent = LayoutBadgeRibbon;
      break;
    case 'photo-mosaic':
      VariantComponent = LayoutPhotoMosaic;
      break;
    case 'tag-cloud-services':
      VariantComponent = LayoutTagCloudServices;
      break;
    case 'flat-paper':
      VariantComponent = LayoutFlatPaper;
      break;
    case 'dark-emerald':
      VariantComponent = LayoutDarkEmerald;
      break;
    case 'interactive-flip':
      VariantComponent = LayoutInteractiveFlip;
      break;
    case 'bento-grid':
      VariantComponent = LayoutBentoGrid;
      break;
    default:
      return <LayoutDefault data={sharedData} />;
  }

  return (
    <Suspense fallback={<LayoutDefault data={sharedData} />}>
      <VariantComponent data={sharedData} />
    </Suspense>
  );
}
