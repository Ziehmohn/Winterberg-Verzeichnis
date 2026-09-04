export interface CategoryGroup {
  name: string;
  subcategories: string[];
}

export interface OpeningHours {
  monday?: string;
  tuesday?: string;
  wednesday?: string;
  thursday?: string;
  friday?: string;
  saturday?: string;
  sunday?: string;
}

export interface SeoSettings {
  title: string;
  description: string;
  baseUrl: string;
  googleSiteVerification?: string;
  googleAnalyticsId?: string;
}

export interface DesignSettings {
  headlineFont: string;
  bodyFont: string;
  headlineWeight: 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold';
  headlineLetterSpacing: 'tight' | 'normal' | 'wide';
  presetId?: string;
}

export interface Review {
  id: string;
  userId?: string;
  authorName?: string;
  businessId?: string;
  text: string;
  rating: number;
  status: 'pending' | 'approved';
  date: string;
  ownerReply?: string;
  source?: 'internal' | 'google' | 'provenexpert' | 'tripadvisor' | string;
  sourceUrl?: string;
}

export interface Job {
  id: string;
  title: string;
  description: string;
  type: string; // z.B. Vollzeit, Teilzeit, Minijob, Ausbildung, Praktikum, Freelance
  createdAt: string;
  externalUrl?: string;
  source?: string;
  location?: string;
  salary?: string;
}

export interface NewsArticle {
  id: string;
  slug?: string;
  title: string;
  content: string;
  author: string;
  businessId?: string;
  businessName?: string;
  businessSlug?: string;
  date: string;
  imageUrl?: string;
  imageSource?: string;
  isAiGenerated?: boolean;
  isBusinessNews?: boolean; // true = von Premium-Unternehmen eingereicht
  status: 'pending' | 'approved';
}

export interface BusinessNewsArticle {
  id: string;
  title: string;
  excerpt: string;       // Kurztext (max. 300 Zeichen)
  content: string;       // Volltext
  publishedAt: string;   // ISO-Datum
  externalLink?: string; // Optionaler Backlink
  imageUrl?: string;     // Optionales Vorschaubild
  status: 'published' | 'draft';
}

export interface BusinessTranslations {
  nl?: {
    description?: string;
    extendedDescription?: string;
    services?: string[];
    products?: string[];
  };
}

export interface Business {
  id: string;
  name: string;
  category: string;
  subcategory?: string;
  description: string;
  email?: string;
  address: string;
  district?: string;
  coordinates?: { lat: number, lng: number };
  phone?: string;
  website?: string;
  imageFallback?: string;
  uploadedImage?: string;
  imageLink?: string;
  openingHours?: OpeningHours;
  reviews?: Review[];
  services?: string[];
  products?: string[];
  jobs?: Job[];
  businessNews?: BusinessNewsArticle[];
  documents?: BusinessDocument[];
  featureBadges?: string[];
  customCta?: CustomActionCta;
  isPremium?: boolean;
  headerImage?: string;
  headerPosition?: HeaderPositionConfig;
  gallery?: string[];
  galleryCategories?: GalleryCategory[];
  logoUrl?: string;
  logoBgColor?: string;
  extendedDescription?: string;
  ownerId?: string;
  status?: 'pending' | 'approved';
  isVerified?: boolean;
  city?: string;
  additionalCategories?: { category: string, subcategory: string }[];
  translations?: BusinessTranslations;
  description_nl?: string;
  extendedDescription_nl?: string;
  services_nl?: string[];
  products_nl?: string[];
}

export interface BusinessDocument {
  id: string;
  title: string;
  type: 'menu' | 'pricelist' | 'flyer' | 'brochure' | 'other';
  url: string;
  fileSize?: string;
  updatedAt?: string;
}

export interface CustomActionCta {
  text: string;
  url: string;
  type?: 'booking' | 'table' | 'emergency' | 'inquiry' | 'rental' | 'custom';
}

export interface HeaderPositionConfig {
  desktop?: string; // z.B. '50% 50%', 'center center'
  tablet?: string;
  mobile?: string;
}

export interface GalleryImage {
  url: string;
  alt?: string;
  title?: string;
}

export interface GalleryCategory {
  id: string;
  name: string;
  name_nl?: string;
  images: GalleryImage[];
}

export interface UserProfile {
  uid: string;
  email: string | null;
  role: 'admin' | 'business_owner' | 'user';
  businessId?: string;
}

export type ThemeKey = 'nature' | 'winter' | 'modern' | 'alpine' | 'panorama' | 'glass' | 'dark';

export interface ThemeConfig {
  name: string;
  description: string;
  bgPage: string;
  textBase: string;
  textMuted: string;
  primaryBtn: string;
  categoryTagActive: string;
  categoryTagInactive: string;
  cardBg: string;
  cardBorder: string;
  cardShadow: string;
  iconAccent: string;
  headerBg: string;
  backgroundImage?: string;
  backgroundBlur?: string;
  backgroundOpacity?: string;
  bottomRightImage?: string;
}

export interface TrackingScript {
  id: string;
  name: string;
  category: 'analytics' | 'marketing' | 'externalMedia';
  code: string;
  isActive: boolean;
}

export interface AdBanner {
  id: string;
  title: string;
  title_nl?: string;
  ctaText?: string;
  ctaText_nl?: string;
  companyName?: string;
  businessId?: string;
  imageUrl: string;
  imageUrl_nl?: string;
  targetUrl: string;
  category: string; // 'Alle' or specific category name like 'Gastronomie', 'Handwerk', etc.
  categories?: string[]; // Multiple categories / subcategories or ['Alle']
  subcategory?: string;
  position?: 'skyscraper_right' | 'sidebar' | 'custom';
  isActive: boolean;
  badgeText?: string; // default "Anzeige"
  badgeText_nl?: string; // default "Advertentie"
  clicks?: number;
  impressions?: number;
  startDate?: string;
  endDate?: string;
  createdAt?: string;
}

export interface AdInquiry {
  id: string;
  name: string;
  companyName: string;
  email: string;
  phone?: string | null;
  category?: string;
  categories?: string[];
  categoryCount?: number;
  pricePerCategory?: number;
  totalMonthlyPrice?: number;
  message?: string | null;
  status: 'new' | 'contacted' | 'booked' | 'declined';
  createdAt: string;
}

export interface PricingSettings {
  // Standardpreise
  premiumMonthly: string;
  premiumYearly: string;
  premiumYearlyTotal: string;

  // Bannerwerbung Preise
  bannerTier1: string;
  bannerTier2: string;
  bannerTier3: string;
  bannerTier2Discount: string;
  bannerTier3Discount: string;
  cancellationPeriod: string;

  // Aktionen & Streichpreise
  isOfferActive: boolean;
  offerStartDate?: string;
  offerEndDate?: string;
  offerBadgeText?: string;
  offerMonthlyPrice?: string;
  offerYearlyPrice?: string;
  offerYearlyTotal?: string;
  strikethroughMonthly?: string;
  strikethroughYearly?: string;

  // Banderole oben rechts
  showRibbon: boolean;
  ribbonText?: string;
  ribbonLink?: string;
  ribbonBgColor?: string;
  ribbonTextColor?: string;
}

export interface FuelStationPrice {
  id: string;
  tankerId?: string;
  name: string;
  brand: string;
  street: string;
  houseNumber?: string;
  postCode: string;
  city: string;
  district?: string;
  isOpen: boolean;
  diesel: number | null;
  e5: number | null;
  e10: number | null;
  dist?: number;
  lat?: number;
  lng?: number;
  businessSlug?: string;
  businessPath?: string;
}

export interface FuelPriceResponse {
  ok: boolean;
  source: string;
  lastUpdated: string;
  isLive?: boolean;
  apiKeyRequired?: boolean;
  stations: FuelStationPrice[];
}

