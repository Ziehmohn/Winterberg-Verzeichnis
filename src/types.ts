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
}

export interface Job {
  id: string;
  title: string;
  description: string;
  type: string; // z.B. Vollzeit, Teilzeit, Minijob, Ausbildung, Praktikum, Freelance
  createdAt: string;
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
  jobs?: Job[];
  isPremium?: boolean;
  gallery?: string[];
  logoUrl?: string;
  extendedDescription?: string;
  ownerId?: string;
  status?: 'pending' | 'approved';
  isVerified?: boolean;
  city?: string;
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
