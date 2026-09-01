import React, { useState, useEffect, Suspense, Component, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Menu, X, Check, Bot, MapPin, Phone, Globe, ChevronRight, ChevronDown, Plus, ArrowLeft, Image as ImageIcon, Trash2, Edit2, LogIn, LogOut, Map as MapIcon, List as ListIcon, Star, Lock, Clock, Settings, SearchCode, BadgeCheck, Sun, Moon, Briefcase, CreditCard, FileText , User, Bed, Utensils, Hammer, ShoppingBag, Code2, Building2, Sparkles, ArrowUpDown, Calendar, AlertCircle, Upload, ExternalLink } from 'lucide-react';
import { 
  businesses as initialBusinesses, 
  categories,
  themes,
  initialAds
} from './data';
import { ThemeKey, CategoryGroup, Business, SeoSettings, DesignSettings, AdBanner, PricingSettings } from './types';
import { DEFAULT_PRICING_SETTINGS } from './config';
import OfferRibbon from './components/OfferRibbon';
import Logo from './components/Logo';
import NotFound from './components/NotFound';
import BusinessDetail from './components/BusinessDetail';
import BusinessCategoryIcon from './components/BusinessCategoryIcon';
import AdminDesignManager, { loadGoogleFont } from './components/AdminDesignManager';
import { isOpenNow, canDisplayOpeningHours } from './utils';
import ReviewForm from './components/ReviewForm';
import { Review } from './types';
import { useAuth } from './AuthContext';
import Login from './components/Login';
import { MegaMenu } from './components/MegaMenu';
import SkyscraperBanner from './components/SkyscraperBanner';
import AdInquiryModal from './components/AdInquiryModal';
import AdminAdsManager from './components/AdminAdsManager';
import ReviewWidget, { WidgetLayout, WidgetTheme } from './components/ReviewWidget';
import WidgetGeneratorModal from './components/WidgetGeneratorModal';
import CookieConsent from './components/CookieConsent';
import DynamicScriptLoader from './components/DynamicScriptLoader';
import { trackPageView, initGA, getGoogleAnalyticsId } from './utils/analytics';
import {
  RouteState,
  findCategoryFromSlug,
  findSubcategoryFromSlug,
  buildLocalizedUrl,
  getAlternateUrls,
  getCategorySlug,
  getSubcategorySlug,
  getBusinessSlug,
  getBusinessPath,
  slugify,
  STATIC_PAGE_SLUGS
} from './utils/routes';
import { getLocalizedBusiness } from './utils/translator';
import { getBusinessReviewUsps } from './utils/reviewUsps';

// Lazy-load heavy components that most visitors never see (code-splitting)
const DirectoryMap = React.lazy(() => import('./components/DirectoryMap'));
const Impressum = React.lazy(() => import('./components/Impressum'));
const AGB = React.lazy(() => import('./components/AGB'));
const SubmitBusiness = React.lazy(() => import('./components/SubmitBusiness'));
const PricingTable = React.lazy(() => import('./components/PricingTable'));
const AdminPricingManager = React.lazy(() => import('./components/AdminPricingManager'));
const JobsBoard = React.lazy(() => import('./components/JobsBoard'));
const AdminPanel = React.lazy(() => import('./components/AdminPanel'));
const ScriptManager = React.lazy(() => import('./components/ScriptManager'));
const Datenschutz = React.lazy(() => import('./components/Datenschutz'));
const NewsBoard = React.lazy(() => import('./components/NewsBoard'));
const NewsDetail = React.lazy(() => import('./components/NewsDetail'));
const SubmitNews = React.lazy(() => import('./components/SubmitNews'));
const WinterbergFaq = React.lazy(() => import('./components/WinterbergFaq'));
const GroundingPage = React.lazy(() => import('./components/GroundingPage'));
import { db, auth, storage } from './firebase';
import { collection, getDocs, getDoc, doc, setDoc, updateDoc, deleteDoc, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useTranslation } from './i18n';
import { getSeoContent } from './utils/seoContent';
import { signOut } from 'firebase/auth';



class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean; error: Error | null }> {
  state = { hasError: false, error: null as Error | null };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error("React ErrorBoundary caught error:", error, errorInfo);
  }

  render() {
    const s = (this as any).state;
    if (s && s.hasError) {
      return (
        <div className="w-full max-w-xl mx-auto p-8 my-10 bg-white border border-red-200 rounded-xl text-center shadow-lg">
          <h2 className="text-xl font-bold text-red-700 mb-2">Ein Anzeigefehler ist aufgetreten</h2>
          <p className="text-sm text-gray-600 mb-4 font-mono bg-red-50 p-3 rounded text-left overflow-auto max-h-32">
            {s.error?.message || 'Laufzeitfehler'}
          </p>
          <button 
            onClick={() => { (this as any).setState({ hasError: false, error: null }); window.location.reload(); }}
            className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg transition-colors"
          >
            Seite neu laden
          </button>
        </div>
      );
    }
    return (this as any).props?.children;
  }
}

export default function App() {

  const { currentUser, userProfile } = useAuth();
  const { t, lang, setLang } = useTranslation();
  const [activeThemeKey, setActiveThemeKey] = useState<ThemeKey>('nature');
  
  // URL Parse (Prioritize Path)
  let initialNotFound = false;
  let defaultCategory = 'Alle';
  let defaultSearchQuery = '';
  let initialSelectedBusiness: Business | null = null;
  let initialJobsMode = false;
  let initialJobsCategory: string | null = null;
  let initialAllMode = false;
  let initialNewsMode = false;
  let initialNewsSubmitMode = false;
  let initialNewsId: string | null = null;
  let initialFaqMode = false;
  let initialImpressumMode = false;
  let initialDatenschutzMode = false;
  let initialAGBMode = false;
  let initialGroundingMode = false;
  let initialPricingMode = false;
  let initialSubmitMode = false;
  let initialEmbedMode = false;
  let initialEmbedBusinessId = '';
  let initialEmbedLayout: WidgetLayout = 'badge';
  let initialEmbedTheme: WidgetTheme = 'light';
  let initialEmbedWhitelabel = false;

  if (typeof window !== 'undefined') {
    const path = window.location.pathname;
    const pathParts = path.split('/').filter(Boolean);
    if (pathParts[0] === 'nl') {
      pathParts.shift();
    }
    
    if (pathParts[0]) {
      const decodedPart1 = decodeURIComponent(pathParts[0]).toLowerCase();
      if (decodedPart1 === 'embed' || decodedPart1 === 'widget') {
        initialEmbedMode = true;
        let busId = '';
        if (pathParts[1] && (pathParts[1].toLowerCase() === 'reviews' || pathParts[1].toLowerCase() === 'badge')) {
          busId = decodeURIComponent(pathParts[2] || '');
        } else if (pathParts[1]) {
          busId = decodeURIComponent(pathParts[1]);
        }
        initialEmbedBusinessId = busId;

        const params = new URLSearchParams(window.location.search);
        const l = params.get('layout');
        if (l === 'card' || l === 'carousel' || l === 'simple_badge' || l === 'badge') {
          initialEmbedLayout = l;
        }
        const th = params.get('theme');
        if (th === 'dark' || th === 'brand' || th === 'transparent' || th === 'light') {
          initialEmbedTheme = th;
        }
        initialEmbedWhitelabel = params.get('whitelabel') === '1' || params.get('whitelabel') === 'true';
      } else if (decodedPart1 === 'news' || decodedPart1 === 'nieuws') {
        initialNewsMode = true;
        if (pathParts[1] && (decodeURIComponent(pathParts[1]).toLowerCase() === 'einreichen' || decodeURIComponent(pathParts[1]).toLowerCase() === 'indienen')) {
          initialNewsSubmitMode = true;
        } else if (pathParts[1]) {
          initialNewsId = decodeURIComponent(pathParts[1]);
        }
      } else if (decodedPart1 === 'alle-unternehmen' || decodedPart1 === 'alle-bedrijven') {
        initialAllMode = true;
      } else if (decodedPart1 === 'stellenangebote' || decodedPart1 === 'jobs' || decodedPart1 === 'vacatures') {
        initialJobsMode = true;
        if (pathParts[1]) {
          initialJobsCategory = decodeURIComponent(pathParts[1]);
        }
      } else if (decodedPart1 === 'faq' || decodedPart1 === 'faqs' || decodedPart1 === 'veelgestelde-vragen' || decodedPart1 === 'winterberg-faq') {
        initialFaqMode = true;
      } else if (decodedPart1 === 'impressum' || decodedPart1 === 'colofon') {
        initialImpressumMode = true;
      } else if (decodedPart1 === 'datenschutz' || decodedPart1 === 'privacy') {
        initialDatenschutzMode = true;
      } else if (decodedPart1 === 'agb' || decodedPart1 === 'algemene-voorwaarden') {
        initialAGBMode = true;
      } else if (decodedPart1 === 'grounding' || decodedPart1 === 'groundingpage' || decodedPart1 === 'grounding-page') {
        initialGroundingMode = true;
      } else if (decodedPart1 === 'preise' || decodedPart1 === 'pricing' || decodedPart1 === 'prijzen') {
        initialPricingMode = true;
      } else if (decodedPart1 === 'eintragen' || decodedPart1 === 'unternehmen-eintragen' || decodedPart1 === 'bedrijf-aanmelden') {
        initialSubmitMode = true;
      } else {
        const catName = findCategoryFromSlug(decodedPart1) || categories.find(c => c.name.toLowerCase() === decodedPart1)?.name;
        
        if (catName) {
          defaultCategory = catName;
          const catGroup = categories.find(c => c.name === catName);
          
          if (pathParts[1]) {
            const decodedPart2 = decodeURIComponent(pathParts[1]);
            const subName = findSubcategoryFromSlug(decodedPart2) || catGroup?.subcategories.find(s => s.toLowerCase() === decodedPart2.toLowerCase());
            
            if (subName) {
              defaultCategory = subName;
              if (pathParts[2]) {
                const decodedPart3 = decodeURIComponent(pathParts[2]);
                const matchBusiness = (b: Business, rawPart: string) => {
                  const cleanPart = slugify(decodeURIComponent(rawPart));
                  const bCleanSlug = slugify(b.name);
                  const rawPartDecoded = decodeURIComponent(rawPart).toLowerCase();
                  const oldRawSlug = b.name.replace(/\s+/g, '-').toLowerCase();
                  return bCleanSlug === cleanPart || oldRawSlug === rawPartDecoded || b.id.toLowerCase() === rawPartDecoded;
                };
                const business = initialBusinesses.find(b => matchBusiness(b, decodedPart3));
                if (business) {
                  defaultSearchQuery = business.name;
                  initialSelectedBusiness = business;
                } else {
                  initialNotFound = true;
                }
              }
            } else {
              // maybe business?
              const matchBusiness = (b: Business, rawPart: string) => {
                const cleanPart = slugify(decodeURIComponent(rawPart));
                const bCleanSlug = slugify(b.name);
                const rawPartDecoded = decodeURIComponent(rawPart).toLowerCase();
                const oldRawSlug = b.name.replace(/\s+/g, '-').toLowerCase();
                return bCleanSlug === cleanPart || oldRawSlug === rawPartDecoded || b.id.toLowerCase() === rawPartDecoded;
              };
              const business = initialBusinesses.find(b => matchBusiness(b, decodedPart2));
              if (business) {
                defaultSearchQuery = business.name;
                initialSelectedBusiness = business;
              } else {
                initialNotFound = true;
              }
            }
          }
        } else {
          initialNotFound = true;
        }
      }
    }
  }

  const [searchQuery, setSearchQuery] = useState(defaultSearchQuery);
  const [homeSearchInput, setHomeSearchInput] = useState('');
  const [showHomeSuggestions, setShowHomeSuggestions] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>(defaultCategory);
  const [isNotFound, setIsNotFound] = useState(initialNotFound);

  useEffect(() => {
    if (isNotFound) {
      const checkRedirect = async () => {
        try {
          const snap = await getDocs(collection(db, 'redirects'));
          const currentPath = window.location.pathname;
          let redirectTarget = null;
          snap.forEach(docSnap => {
            const data = docSnap.data();
            if (data.source === currentPath || data.source + '/' === currentPath || data.source === currentPath + '/') {
              redirectTarget = data.target;
            }
          });
          if (redirectTarget) {
            window.location.replace(redirectTarget);
          }
        } catch(e) { console.error("Error fetching redirects", e); }
      };
      checkRedirect();
    }
  }, [isNotFound]);

  // Google Analytics Pageview Tracking (Property ID 302481363)
  useEffect(() => {
    initGA(getGoogleAnalyticsId());
    trackPageView(window.location.pathname, document.title);

    const handleLocationChange = () => {
      setTimeout(() => {
        trackPageView(window.location.pathname, document.title);
      }, 60);
    };

    window.addEventListener('popstate', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, []);

  const [activeLocation, setActiveLocation] = useState<string>('Alle');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [sortBy, setSortBy] = useState<'featured' | 'rating' | 'reviews_count' | 'name_asc' | 'name_desc'>('featured');
  const [isAllMode, setIsAllMode] = useState(initialAllMode);
  const [isNewsMode, setIsNewsMode] = useState(initialNewsMode);
  const [isNewsSubmitMode, setIsNewsSubmitMode] = useState(initialNewsSubmitMode);
  const [newsId, setNewsId] = useState<string | null>(initialNewsId);
  const [isGroundingMode, setIsGroundingMode] = useState(initialGroundingMode);
  const [expandedGroups, setExpandedGroups] = useState<string[]>([]);
  const [isMobileCategoriesOpen, setIsMobileCategoriesOpen] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(initialSelectedBusiness);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const megaMenuTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnterMegaMenu = () => {
    if (megaMenuTimeoutRef.current) clearTimeout(megaMenuTimeoutRef.current);
    setIsMegaMenuOpen(true);
  };

  const handleMouseLeaveMegaMenu = () => {
    megaMenuTimeoutRef.current = setTimeout(() => {
      setIsMegaMenuOpen(false);
    }, 180);
  };

  const getCurrentRouteState = (): RouteState => {
    if (selectedBusiness) {
      return {
        view: 'business',
        category: selectedBusiness.category,
        subcategory: selectedBusiness.subcategory,
        businessSlug: getBusinessSlug(selectedBusiness.name)
      };
    }
    if (isJobsMode) return { view: 'jobs', jobsCategory: jobsCategory || undefined };
    if (isNewsSubmitMode) return { view: 'news-submit' };
    if (newsId) return { view: 'news-detail', newsSlug: newsId };
    if (isNewsMode) return { view: 'news' };
    if (isFaqMode) return { view: 'faq' };
    if (isSubmitMode) return { view: 'submit' };
    if (isPricingMode) return { view: 'pricing' };
    if (isImpressumMode) return { view: 'impressum' };
    if (isDatenschutzMode) return { view: 'datenschutz' };
    if (isAGBMode) return { view: 'agb' };
    if (isGroundingMode) return { view: 'grounding' };
    if (isAllMode) return { view: 'all', location: activeLocation };
    if (activeCategory !== 'Alle') {
      const parentCat = categories.find(c => c.subcategories.includes(activeCategory));
      if (parentCat) {
        return { view: 'category', category: parentCat.name, subcategory: activeCategory };
      }
      return { view: 'category', category: activeCategory };
    }
    return { view: 'home' };
  };

  const switchLanguage = (newLang: 'de' | 'nl') => {
    if (newLang === lang) return;
    setLang(newLang);
    const state = getCurrentRouteState();
    const newUrl = buildLocalizedUrl(state, newLang);
    window.history.pushState(null, '', newUrl);
  };
  
  const getPath = (p: string) => {
    if (!p || p === '/') return buildLocalizedUrl({ view: 'home' }, lang);
    if (p === '/alle-unternehmen' || p === '/alle-bedrijven') return buildLocalizedUrl({ view: 'all' }, lang);
    if (p === '/jobs' || p === '/vacatures') return buildLocalizedUrl({ view: 'jobs' }, lang);
    if (p === '/news' || p === '/nieuws') return buildLocalizedUrl({ view: 'news' }, lang);
    if (p === '/faq' || p === '/faqs' || p === '/veelgestelde-vragen') return buildLocalizedUrl({ view: 'faq' }, lang);
    if (p === '/eintragen' || p === '/bedrijf-aanmelden') return buildLocalizedUrl({ view: 'submit' }, lang);
    if (p === '/preise' || p === '/prijzen') return buildLocalizedUrl({ view: 'pricing' }, lang);
    if (p === '/impressum' || p === '/colofon') return buildLocalizedUrl({ view: 'impressum' }, lang);
    if (p === '/datenschutz' || p === '/privacy') return buildLocalizedUrl({ view: 'datenschutz' }, lang);
    if (p === '/agb' || p === '/algemene-voorwaarden') return buildLocalizedUrl({ view: 'agb' }, lang);
    if (p === '/grounding' || p === '/groundingpage' || p === '/grounding-page') return buildLocalizedUrl({ view: 'grounding' }, lang);

    const clean = p.startsWith('/') ? p.slice(1) : p;
    const parts = clean.split('/').filter(Boolean);
    if (parts.length === 1) {
      const cat = findCategoryFromSlug(parts[0]) || parts[0];
      return buildLocalizedUrl({ view: 'category', category: cat }, lang);
    }
    if (parts.length === 2) {
      const cat = findCategoryFromSlug(parts[0]) || parts[0];
      const sub = findSubcategoryFromSlug(parts[1]) || parts[1];
      return buildLocalizedUrl({ view: 'category', category: cat, subcategory: sub }, lang);
    }
    if (parts.length === 3) {
      const cat = findCategoryFromSlug(parts[0]) || parts[0];
      const sub = findSubcategoryFromSlug(parts[1]) || parts[1];
      const bSlug = parts[2];
      return buildLocalizedUrl({ view: 'business', category: cat, subcategory: sub, businessSlug: bSlug }, lang);
    }

    const base = lang === 'nl' ? '/nl' : '';
    if (p.startsWith('/')) return base + p;
    return base + '/' + p;
  };

  const resetToDirectory = () => {
    setSelectedBusiness(null);
    setIsAdminMode(false);
    setIsImpressumMode(false);
    setIsAGBMode(false);
    setIsDatenschutzMode(false);
    setIsSubmitMode(false);
    setIsPricingMode(false);
    setIsJobsMode(false);
    setIsNotFound(false);
    setIsAllMode(false);
    setIsNewsMode(false);
    setIsNewsSubmitMode(false);
    setNewsId(null);
    setIsFaqMode(false);
    setIsGroundingMode(false);
  };
  
  useEffect(() => {
    if (activeThemeKey === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [activeThemeKey]);

  useEffect(() => {
    // Redirect old query parameters to clean paths
    if (typeof window !== 'undefined') {
      const search = window.location.search;
      if (search && (search.includes('success=true'))) {
        alert('Zahlung erfolgreich! Ihr Eintrag wird in Kürze geprüft und freigeschaltet.');
        // Clean URL
        window.history.replaceState(null, '', window.location.pathname);
      } else if (search && search.includes('canceled=true')) {
        alert('Zahlungsvorgang abgebrochen.');
        window.history.replaceState(null, '', window.location.pathname);
      }
      else if (search && (search.includes('kategorie=') || search.includes('eintrag='))) {
        const queryParams = new URLSearchParams(search);
        const kat = queryParams.get('kategorie');
        const sub = queryParams.get('unterkategorie');
        const eintrag = queryParams.get('eintrag');
        
        let newUrl = '/';
        if (kat) {
           newUrl = `/${encodeURIComponent(kat)}`;
           if (sub) {
             newUrl += `/${encodeURIComponent(sub)}`;
           }
           if (eintrag) {
             newUrl += `/${encodeURIComponent(eintrag.replace(/\s+/g, '-').toLowerCase())}`;
           }
        }
        window.history.replaceState(null, '', newUrl);
      }
    }

    const handlePopState = () => {
      const path = window.location.pathname;
      const pathParts = path.split('/').filter(Boolean);
      
      resetToDirectory();
      
      if (pathParts[0]) {
        const p1 = decodeURIComponent(pathParts[0]).toLowerCase();
        if (p1 === 'news') {
          setIsNewsMode(true);
          if (pathParts[1] && decodeURIComponent(pathParts[1]).toLowerCase() === 'einreichen') {
            setIsNewsSubmitMode(true);
          } else if (pathParts[1]) {
            setNewsId(decodeURIComponent(pathParts[1]));
          }
        } else if (p1 === 'alle-unternehmen') {
          setIsAllMode(true);
        } else if (p1 === 'stellenangebote' || p1 === 'jobs') {
          setIsJobsMode(true);
        } else if (p1 === 'preise' || p1 === 'pricing') {
          setIsPricingMode(true);
        } else if (p1 === 'faq' || p1 === 'faqs' || p1 === 'winterberg-faq') {
          setIsFaqMode(true);
        } else if (p1 === 'impressum') {
          setIsImpressumMode(true);
        } else if (p1 === 'datenschutz') {
          setIsDatenschutzMode(true);
        } else if (p1 === 'agb') {
          setIsAGBMode(true);
        } else if (p1 === 'grounding' || p1 === 'groundingpage' || p1 === 'grounding-page') {
          setIsGroundingMode(true);
        } else if (p1 === 'eintragen' || p1 === 'unternehmen-eintragen') {
          setIsSubmitMode(true);
        } else {
           window.location.reload();
        }
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);
  const [businesses, setBusinesses] = useState<Business[]>(initialBusinesses);

  const handleReviewSubmit = async (businessId: string, review: Review) => {
    const business = businesses.find(b => b.id === businessId);
    if (!business) return;
    const updatedReviews = [...(business.reviews || []), review];
    
    setBusinesses(prev => prev.map(b => {
      if (b.id === businessId) {
        return { ...b, reviews: updatedReviews };
      }
      return b;
    }));

    if (selectedBusiness && selectedBusiness.id === businessId) {
      setSelectedBusiness(prev => prev ? { ...prev, reviews: updatedReviews } : null);
    }
    
    try {
      await updateDoc(doc(db, 'businesses', businessId), { reviews: updatedReviews });
    } catch (err) {
      console.error("Review save error", err);
      // Fallback if doc doesn't exist yet
      try {
        const bToUpdate = { ...business, reviews: updatedReviews };
        await setDoc(doc(db, 'businesses', businessId), bToUpdate, { merge: true });
      } catch (e2) {
        console.error("Fallback review save error", e2);
      }
    }
  };


  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isImpressumMode, setIsImpressumMode] = useState(initialImpressumMode);
  const [isAGBMode, setIsAGBMode] = useState(initialAGBMode);
  const [isDatenschutzMode, setIsDatenschutzMode] = useState(initialDatenschutzMode);
  const [isSubmitMode, setIsSubmitMode] = useState(initialSubmitMode);
  const [isPricingMode, setIsPricingMode] = useState(initialPricingMode);
  const [isJobsMode, setIsJobsMode] = useState(initialJobsMode);
  const [jobsCategory, setJobsCategory] = useState<string | null>(initialJobsCategory);
  const [isFaqMode, setIsFaqMode] = useState(initialFaqMode);
  const [isEmbedMode] = useState(initialEmbedMode);
  const [embedBusinessId] = useState(initialEmbedBusinessId);
  const [embedLayout] = useState<WidgetLayout>(initialEmbedLayout);
  const [embedTheme] = useState<WidgetTheme>(initialEmbedTheme);
  const [embedWhitelabel] = useState<boolean>(initialEmbedWhitelabel);
  const [isLoading, setIsLoading] = useState(false);
  const [ads, setAds] = useState<AdBanner[]>([]);
  const [isAdInquiryOpen, setIsAdInquiryOpen] = useState(false);
  const [inquiryCategory, setInquiryCategory] = useState<string>('Alle');
  const [reviewsEnabled, setReviewsEnabled] = useState(localStorage.getItem('premium_reviews_enabled') === 'true');
  const [token, setToken] = useState<string | null>(localStorage.getItem('admin_token'));
  const [designSettings, setDesignSettings] = useState<DesignSettings>({
    headlineFont: 'Manrope',
    bodyFont: 'Public Sans',
    headlineWeight: 'bold',
    headlineLetterSpacing: 'normal',
    presetId: 'modern-clean'
  });
  const [seoSettings, setSeoSettings] = useState<SeoSettings>({
    title: 'Das Winterberg Verzeichnis',
    description: 'Das umfassende Verzeichnis für alle Unternehmen, Dienstleister, Handwerker und Freizeiteinrichtungen in Winterberg und den umliegenden Ortsteilen.',
    baseUrl: 'https://www.winterberg-verzeichnis.de',
    googleSiteVerification: 'eD2M5X0XpFemq843s7x3232ic58ogimCDB6zWKPN_u8',
    googleAnalyticsId: 'G-86EMTRTX80'
  });
  const [pricingSettings, setPricingSettings] = useState<PricingSettings>(DEFAULT_PRICING_SETTINGS);

  const theme = themes[activeThemeKey];

  // Load remote pricing settings from Firestore
  useEffect(() => {
    const loadRemotePricing = async () => {
      try {
        const snap = await getDoc(doc(db, 'settings', 'pricing'));
        if (snap.exists()) {
          const data = snap.data() as PricingSettings;
          setPricingSettings({ ...DEFAULT_PRICING_SETTINGS, ...data });
        }
      } catch (e) {
        console.error("Failed to load pricing settings from Firestore", e);
      }
    };
    loadRemotePricing();
  }, []);

  // Load and apply global typography & design settings
  useEffect(() => {
    const applyDesign = (settings: DesignSettings) => {
      if (!settings?.headlineFont) return;
      loadGoogleFont(settings.headlineFont);
      if (settings.bodyFont) {
        loadGoogleFont(settings.bodyFont);
        document.documentElement.style.setProperty('--font-sans', `"${settings.bodyFont}", ui-sans-serif, system-ui, sans-serif`);
      }
      document.documentElement.style.setProperty('--font-display', `"${settings.headlineFont}", ui-sans-serif, system-ui, sans-serif`);
    };

    const savedDesign = localStorage.getItem('siteDesignSettings');
    if (savedDesign) {
      try {
        const parsed = JSON.parse(savedDesign);
        setDesignSettings(parsed);
        applyDesign(parsed);
      } catch (e) {}
    } else {
      applyDesign({
        headlineFont: 'Manrope',
        bodyFont: 'Public Sans',
        headlineWeight: 'bold',
        headlineLetterSpacing: 'normal',
        presetId: 'modern-clean'
      });
    }

    const loadRemoteDesign = async () => {
      try {
        const snap = await getDoc(doc(db, 'settings', 'design'));
        if (snap.exists()) {
          const data = snap.data() as DesignSettings;
          setDesignSettings(data);
          localStorage.setItem('siteDesignSettings', JSON.stringify(data));
          applyDesign(data);
        }
      } catch(e) {
        console.error("Failed to load design settings from Firestore", e);
      }
    };
    loadRemoteDesign();
  }, []);

  useEffect(() => {
    const savedSeo = localStorage.getItem('seoSettings');
    if (savedSeo) {
      try {
        const parsed = JSON.parse(savedSeo);
        // Reset old incorrect titles that include personal/agency names
        if (parsed.title && (parsed.title.toLowerCase().includes('simon') || parsed.title.toLowerCase().includes('sichtbar'))) {
          parsed.title = 'Das Winterberg Verzeichnis';
        }
        if (parsed.baseUrl === 'https://winterberg.sichtbar-online.com') {
          parsed.baseUrl = 'https://www.winterberg-verzeichnis.de';
        }
        localStorage.setItem('seoSettings', JSON.stringify(parsed));
        setSeoSettings(parsed);
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    const isNl = lang === 'nl';
    const baseTitle = isNl ? 'De Winterberg Bedrijvengids' : (seoSettings.title || 'Das Winterberg Verzeichnis');
    let currentTitle = baseTitle;
    let currentDesc = isNl 
      ? 'De grote gids voor alle bedrijven, vakmensen, horeca en dienstverleners in Winterberg en omgeving.'
      : seoSettings.description;

    const matchedBusiness = businesses.find(b => b.name.toLowerCase() === searchQuery.toLowerCase()) || selectedBusiness;
    
    if (isNewsMode) {
      if (newsId) {
        currentTitle = isNl ? `Nieuws uit Winterberg | ${baseTitle}` : `Aktuelles aus Winterberg | ${baseTitle}`;
        currentDesc = isNl ? `Actueel nieuws en economische updates uit Winterberg en de dorpen.` : `Aktuelle Nachrichten, Wirtschafts-Updates und Neuigkeiten aus Winterberg.`;
      } else {
        currentTitle = isNl ? `Nieuws & Berichten uit Winterberg | ${baseTitle}` : `Aktuelles aus Winterberg - News & Meldungen | ${baseTitle}`;
        currentDesc = isNl ? `Het laatste nieuws, aanbiedingen en mededelingen uit Winterberg en alle 14 dorpen.` : `Die neuesten Nachrichten, Angebote und Ankündigungen aus Winterberg und den Ortsteilen.`;
      }
    } else if (isJobsMode) {
      if (jobsCategory) {
        currentTitle = isNl ? `Vacatures ${jobsCategory} in Winterberg | ${baseTitle}` : `Offene Stellen ${jobsCategory} in Winterberg | ${baseTitle}`;
        currentDesc = isNl ? `Bekijk actuele vacatures voor ${jobsCategory} in Winterberg en omgeving. Solliciteer direct!` : `Finden Sie aktuelle Jobangebote und offene Stellen für ${jobsCategory} in Winterberg und Umgebung. Jetzt bewerben!`;
      } else {
        currentTitle = isNl ? `Vacatures in Winterberg - Alle banen | ${baseTitle}` : `Offene Stellen in Winterberg - Alle Jobangebote | ${baseTitle}`;
        currentDesc = isNl ? `Overzicht van alle openstaande vacatures en banen bij bedrijven in Winterberg en omliggende dorpen.` : `Übersicht aller offenen Stellen und Jobs bei Unternehmen in Winterberg und den Ortsteilen. Starten Sie Ihre Karriere im Sauerland.`;
      }
    } else if (isFaqMode) {
      currentTitle = isNl ? `Veelgestelde Vragen (FAQ) | ${baseTitle}` : `Häufige Fragen (FAQ) | ${baseTitle}`;
      currentDesc = isNl ? `Antwoorden op veelgestelde vragen over bedrijven, openingstijden en inschrijvingen in Winterberg.` : `Antworten auf häufig gestellte Fragen zu Unternehmen, Öffnungszeiten und Einträgen in Winterberg.`;
    } else if (isPricingMode) {
      currentTitle = isNl ? `Pakketten & Prijzen voor bedrijven | ${baseTitle}` : `Pakete & Preise für Unternehmen | ${baseTitle}`;
      currentDesc = isNl ? `Kies het passende pakket voor uw bedrijf in het Winterberg-overzicht.` : `Wählen Sie das passende Paket für Ihr Unternehmen im Winterberg-Verzeichnis.`;
    } else if (isSubmitMode) {
      currentTitle = isNl ? `Bedrijf aanmelden | ${baseTitle}` : `Unternehmen eintragen | ${baseTitle}`;
      currentDesc = isNl ? `Meld uw bedrijf gratis aan in de officiële Winterberg gids.` : `Tragen Sie Ihr Unternehmen kostenlos im offiziellen Winterberg-Verzeichnis ein.`;
    } else if (matchedBusiness) {
      const city = matchedBusiness.district || 'Winterberg';
      currentTitle = `${matchedBusiness.name} in ${city} | ${baseTitle}`;
      const shortDesc = matchedBusiness.description ? matchedBusiness.description.substring(0, 100).trim() + '...' : '';
      currentDesc = isNl 
        ? `Alle informatie over ${matchedBusiness.name} in ${city}. ✓ Contactgegevens ✓ Openingstijden ✓ Adres. ${shortDesc}`
        : `Alle Infos zu ${matchedBusiness.name} in ${city}. ✓ Kontaktdaten ✓ Öffnungszeiten ✓ Adresse. ${shortDesc}`;
    } else if (activeCategory !== 'Alle') {
      const catLabel = t(activeCategory) || activeCategory;
      currentTitle = isNl 
        ? `${catLabel} in Winterberg - Alle bedrijven in één oogopslag | ${baseTitle}`
        : `${activeCategory} in Winterberg - Alle Unternehmen im Überblick | ${baseTitle}`;
      currentDesc = isNl
        ? `Vind snel en eenvoudig bedrijven in de categorie ${catLabel} in Winterberg en de dorpen. Overzicht van adressen, contactgegevens en openingstijden.`
        : `Finden Sie schnell und einfach Unternehmen aus dem Bereich ${activeCategory} in Winterberg und den Ortsteilen. Übersicht aller Adressen, Kontaktinfos und Öffnungszeiten.`;
    }

    document.title = currentTitle;
    let metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', currentDesc);
    } else {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      metaDesc.setAttribute('content', currentDesc);
      document.head.appendChild(metaDesc);
    }

    if (seoSettings.googleSiteVerification) {
      let metaVerif = document.querySelector('meta[name="google-site-verification"]');
      if (metaVerif) {
        metaVerif.setAttribute('content', seoSettings.googleSiteVerification);
      } else {
        metaVerif = document.createElement('meta');
        metaVerif.setAttribute('name', 'google-site-verification');
        metaVerif.setAttribute('content', seoSettings.googleSiteVerification);
        document.head.appendChild(metaVerif);
      }
    }

    // Dynamic HREFLANG SEO Tags & Canonical URL
    document.documentElement.lang = lang;
    const state = getCurrentRouteState();
    const domain = typeof window !== 'undefined' ? window.location.origin : 'https://www.winterberg-verzeichnis.de';
    const altUrls = getAlternateUrls(state, domain);

    const head = document.head;
    const existingHreflangs = head.querySelectorAll('link[rel="alternate"]');
    existingHreflangs.forEach(el => el.remove());

    const addAlt = (hLang: string, href: string) => {
      const link = document.createElement('link');
      link.rel = 'alternate';
      link.hreflang = hLang;
      link.href = href;
      head.appendChild(link);
    };

    addAlt('de', altUrls.de);
    addAlt('nl', altUrls.nl);
    addAlt('x-default', altUrls.xDefault);

    // Canonical link
    const currentCanonicalUrl = lang === 'nl' ? altUrls.nl : altUrls.de;
    let linkCanonical = document.querySelector('link[rel="canonical"]');
    if (linkCanonical) {
      linkCanonical.setAttribute('href', currentCanonicalUrl);
    } else {
      linkCanonical = document.createElement('link');
      linkCanonical.setAttribute('rel', 'canonical');
      linkCanonical.setAttribute('href', currentCanonicalUrl);
      head.appendChild(linkCanonical);
    }

    // OpenGraph locale
    let ogLocale = head.querySelector('meta[property="og:locale"]');
    if (!ogLocale) {
      ogLocale = document.createElement('meta');
      ogLocale.setAttribute('property', 'og:locale');
      head.appendChild(ogLocale);
    }
    ogLocale.setAttribute('content', lang === 'nl' ? 'nl_NL' : 'de_DE');
  }, [lang, seoSettings, activeCategory, activeLocation, searchQuery, businesses, selectedBusiness, isJobsMode, jobsCategory, isNewsMode, newsId, isFaqMode, isPricingMode, isSubmitMode, isImpressumMode, isDatenschutzMode, isAGBMode, isGroundingMode, isAllMode]);

  const loadAds = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'ads'));
      const loadedAds: AdBanner[] = [];
      querySnapshot.forEach((doc: any) => {
        loadedAds.push({ id: doc.id, ...doc.data() } as AdBanner);
      });
      
      const localAds = JSON.parse(localStorage.getItem('local_ads') || '[]');
      
      // If Firestore is empty, but we have local ads, use local ads (so they don't disappear)
      if (loadedAds.length === 0 && localAds.length > 0) {
        setAds(localAds);
        return;
      }

      // Merge Firestore ads with initialAds
      const merged = [...initialAds];
      loadedAds.forEach(fb => {
        const idx = merged.findIndex(a => a.id === fb.id);
        if (idx >= 0) {
          merged[idx] = { ...merged[idx], ...fb };
        } else {
          merged.push(fb);
        }
      });
      
      setAds(merged);
      if (merged.length > 0) {
        localStorage.setItem('local_ads', JSON.stringify(merged));
      }
    } catch (err) {
      console.warn('Could not load ads from Firestore, using fallback', err);
      const localAds = JSON.parse(localStorage.getItem('local_ads') || '[]');
      if (localAds.length > 0) {
        setAds(localAds);
      } else {
        setAds(initialAds);
      }
    }
  };

  const loadBusinesses = async () => {
    console.log("Loading businesses from Firestore...");
    try {
      const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('TIMEOUT_READ')), 5000));
      const querySnapshot = await Promise.race([
        getDocs(collection(db, 'businesses')),
        timeoutPromise
      ]) as any;
      console.log("Firestore read successful!");
      
      const loadedBusinesses: Business[] = [];
      querySnapshot.forEach((doc: any) => {
        loadedBusinesses.push({ id: doc.id, ...doc.data() } as Business);
      });
      if (loadedBusinesses.length > 0) {
        setBusinesses(prev => {
          const merged = [...initialBusinesses];
          loadedBusinesses.forEach(fb => {
            const idx = merged.findIndex(b => b.id === fb.id);
            if (idx >= 0) {
              const existing = merged[idx];
              merged[idx] = { 
                ...existing, 
                ...fb,
                logoUrl: fb.logoUrl || existing.logoUrl,
                gallery: (Array.isArray(fb.gallery) && fb.gallery.length > 0) ? fb.gallery : existing.gallery,
                services: (Array.isArray(fb.services) && fb.services.length > 0) ? fb.services : existing.services,
                products: (Array.isArray(fb.products) && fb.products.length > 0) ? fb.products : existing.products,
              };
            } else {
              merged.push(fb);
            }
          });
          return merged;
        });
      }
    } catch (err) {
      console.error("Error fetching businesses:", err);
    }
  };

  // Ads and businesses load independently so a slow businesses fetch
  // does not block the ads from appearing
  useEffect(() => {
    loadAds();
  }, []);

  useEffect(() => {
    loadBusinesses();
  }, []);

  const extractLocation = (bus: Business) => {
    return bus.district || 'Winterberg';
  };


  const availableLocations = Array.from(new Set(businesses.map(b => extractLocation(b)))).sort();

  const homeSuggestions = homeSearchInput.length > 1 ? businesses.filter(b => {
    if (b.status === 'pending') return false;
    const lowerInput = homeSearchInput.toLowerCase().trim();
    const matchesServices = Array.isArray(b.services) && b.services.some(s => s.toLowerCase().includes(lowerInput));
    const matchesExtended = !!(b.extendedDescription && b.extendedDescription.toLowerCase().includes(lowerInput));
    return b.name.toLowerCase().includes(lowerInput) || 
           (b.description && b.description.toLowerCase().includes(lowerInput)) ||
           b.category.toLowerCase().includes(lowerInput) || 
           (b.subcategory && b.subcategory.toLowerCase().includes(lowerInput)) ||
           matchesServices ||
           matchesExtended;
  }).slice(0, 8) : [];

  const getBusinessRatingStats = (b: Business) => {
    const approved = Array.isArray(b.reviews) ? b.reviews.filter(r => !r.status || r.status === 'approved') : [];
    const count = approved.length;
    const avg = count > 0 ? approved.reduce((sum, r) => sum + (Number(r?.rating) || 0), 0) / count : 0;
    return { avg, count };
  };

  const filteredBusinesses = businesses.filter((bus) => {
    if (bus.status === 'pending') return false;
    const inAdditional = bus.additionalCategories?.some(ac => ac.category === activeCategory || ac.subcategory === activeCategory);
    const matchesCategory = activeCategory === 'Alle' || bus.category === activeCategory || bus.subcategory === activeCategory || inAdditional;
    
    const lowerSearch = searchQuery.toLowerCase().trim();
    const allowedServices = bus.isPremium ? (bus.services || []) : (bus.services || []).slice(0, 3);
    const allowedServicesNl = bus.isPremium ? (bus.services_nl || []) : (bus.services_nl || []).slice(0, 3);
    const matchesServices = !!lowerSearch && (
      allowedServices.some(s => s.toLowerCase().includes(lowerSearch)) ||
      allowedServicesNl.some(s => s.toLowerCase().includes(lowerSearch))
    );

    const allowedProducts = bus.isPremium ? (bus.products || []) : (bus.products || []).slice(0, 3);
    const allowedProductsNl = bus.isPremium ? (bus.products_nl || []) : (bus.products_nl || []).slice(0, 3);
    const matchesProducts = !!lowerSearch && (
      allowedProducts.some(p => p.toLowerCase().includes(lowerSearch)) ||
      allowedProductsNl.some(p => p.toLowerCase().includes(lowerSearch))
    );
    const matchesExtended = !!(bus.extendedDescription && bus.extendedDescription.toLowerCase().includes(lowerSearch)) ||
                            !!(bus.extendedDescription_nl && bus.extendedDescription_nl.toLowerCase().includes(lowerSearch));
    
    const matchesSearch = !lowerSearch ||
                          bus.name.toLowerCase().includes(lowerSearch) || 
                          (bus.description && bus.description.toLowerCase().includes(lowerSearch)) ||
                          (bus.description_nl && bus.description_nl.toLowerCase().includes(lowerSearch)) ||
                          bus.category.toLowerCase().includes(lowerSearch) ||
                          (bus.subcategory && bus.subcategory.toLowerCase().includes(lowerSearch)) ||
                          matchesServices ||
                          matchesProducts ||
                          matchesExtended;

    const busLocation = extractLocation(bus);
    const matchesLocation = activeLocation === 'Alle' || busLocation === activeLocation;
    return matchesCategory && matchesSearch && matchesLocation;
  }).sort((a, b) => {
    if (sortBy === 'rating') {
      const aStats = getBusinessRatingStats(a);
      const bStats = getBusinessRatingStats(b);
      if (bStats.avg !== aStats.avg) {
        return bStats.avg - aStats.avg;
      }
      if (bStats.count !== aStats.count) {
        return bStats.count - aStats.count;
      }
      return a.name.localeCompare(b.name);
    }
    if (sortBy === 'reviews_count') {
      const aStats = getBusinessRatingStats(a);
      const bStats = getBusinessRatingStats(b);
      if (bStats.count !== aStats.count) {
        return bStats.count - aStats.count;
      }
      if (bStats.avg !== aStats.avg) {
        return bStats.avg - aStats.avg;
      }
      return a.name.localeCompare(b.name);
    }
    if (sortBy === 'name_asc') {
      return a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' });
    }
    if (sortBy === 'name_desc') {
      return b.name.localeCompare(a.name, undefined, { numeric: true, sensitivity: 'base' });
    }
    // Default / 'featured': Premium entries first, then alphabetical
    if (a.isPremium && !b.isPremium) return -1;
    if (!a.isPremium && b.isPremium) return 1;
    return a.name.localeCompare(b.name);
  });

  const getCategoryBadges = () => {
    if (activeCategory === 'Alle') {
      const counts: Record<string, number> = {};
      businesses.forEach(b => {
        counts[b.category] = (counts[b.category] || 0) + 1;
      });
      return Object.entries(counts).map(([name, count]) => ({ name, count })).sort((a,b) => b.count - a.count);
    }
    
    const mainCategory = categories.find(c => c.name === activeCategory);
    if (mainCategory) {
      const counts: Record<string, number> = {};
      businesses.filter(b => b.category === activeCategory).forEach(b => {
        const sub = b.subcategory || 'Andere';
        counts[sub] = (counts[sub] || 0) + 1;
      });
      return Object.entries(counts).map(([name, count]) => ({ name, count })).sort((a,b) => b.count - a.count);
    }

    return [{ name: activeCategory, count: businesses.filter(b => b.subcategory === activeCategory).length }];
  };

  const categoryBadges = getCategoryBadges();

  if (isEmbedMode) {
    return (
      <div className="w-full min-h-screen bg-transparent flex items-center justify-center p-2">
        <ReviewWidget
          businessId={embedBusinessId}
          layout={embedLayout}
          theme={embedTheme}
          whitelabel={embedWhitelabel}
        />
      </div>
    );
  }

  if (isNotFound) {
    return (
      <div className={`min-h-screen relative transition-colors duration-300 ${theme.bgPage} ${theme.textBase}`}>
        {/* Background Decorators */}
        {theme.backgroundImage && (
          <div 
            className={`absolute inset-0 z-0 bg-cover bg-center bg-no-repeat ${theme.backgroundBlur} ${theme.backgroundOpacity}`}
            style={{ backgroundImage: `url(${theme.backgroundImage})` }}
          />
        )}
        <div className="relative z-10 w-full h-full">
          <NotFound />
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen relative transition-colors duration-300 ${theme.bgPage} ${theme.textBase}`}>
      
      {/* Background Decorators */}
      {theme.backgroundImage && (
        <div 
          className={`absolute inset-0 z-0 bg-cover bg-center bg-no-repeat ${theme.backgroundBlur} ${theme.backgroundOpacity}`}
          style={{ backgroundImage: `url(${theme.backgroundImage})` }}
        />
      )}
      {theme.bottomRightImage && (
         <div 
          className="fixed bottom-0 right-0 w-[150vw] h-[120vh] max-w-[1400px] max-h-[1200px] z-0 opacity-[0.15] pointer-events-none bg-cover bg-center bg-no-repeat transition-all duration-700 mix-blend-multiply" 
          style={{ 
            backgroundImage: `url(${theme.bottomRightImage})`,
            maskImage: 'radial-gradient(ellipse at bottom right, black 0%, transparent 70%)',
            WebkitMaskImage: 'radial-gradient(ellipse at bottom right, black 0%, transparent 70%)'
          }} 
          aria-hidden="true"
        />
      )}

      {/* Main Container */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header (Claude Design) */}
        <header style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(255,255,255,0.94)', backdropFilter: 'blur(10px)', borderBottom: '1px solid #E7E2DA' }}>
          <div style={{ maxWidth: 1180, margin: '0 auto', padding: '12px 24px', display: 'flex', alignItems: 'center', gap: '28px' }}>
            <div 
              onClick={(e) => {
                e.preventDefault();
                window.history.pushState(null, '', getPath('/'));
                setSearchQuery('');
                setActiveCategory('Alle');
                setActiveLocation('Alle');
                resetToDirectory();
              }} 
              style={{ cursor: 'pointer', display: 'flex', alignItems: 'baseline', gap: '8px' }}
            >
              <span style={{ fontFamily: '"Outfit", sans-serif', fontSize: '15px', fontWeight: 500, color: '#5F6B63' }}>Das</span>
              <span style={{ display: 'inline-block' }}>
                <span style={{ fontFamily: '"Outfit", sans-serif', fontSize: '24px', fontWeight: 800, letterSpacing: '0.05em', color: '#0F4C2E', display: 'block', lineHeight: 1 }}>WINTERBERG</span>
                <svg viewBox="0 0 200 10" preserveAspectRatio="none" style={{ width: '100%', height: '7px', display: 'block', marginTop: '2px' }}><path d="M3 7C38 2 78 1 118 4c28 2 52 5 79 1" stroke="#F2761B" strokeWidth="3.4" fill="none" strokeLinecap="round"/></svg>
                <span style={{ fontFamily: '"Outfit", sans-serif', fontSize: '12.5px', fontWeight: 600, letterSpacing: '0.34em', color: '#1B211D', display: 'block', marginTop: '3px' }}>VERZEICHNIS</span>
              </span>
            </div>
            <nav className="hidden md:flex items-center" style={{ gap: '18px', fontSize: '15px', marginLeft: 'auto' }}>
              <div 
                className="relative flex items-center h-full py-1"
                onMouseEnter={handleMouseEnterMegaMenu}
                onMouseLeave={handleMouseLeaveMegaMenu}
              >
                <a 
                  href={getPath('/alle-unternehmen')} 
                  onClick={(e) => { 
                    e.preventDefault(); 
                    window.history.pushState(null, '', getPath('/alle-unternehmen')); 
                    resetToDirectory(); 
                    setIsAllMode(true); 
                    setIsMegaMenuOpen(false);
                  }} 
                  style={{ color: '#0F4C2E', textDecoration: 'none', fontWeight: 700 }} 
                  className="hover:text-orange-500 transition-colors flex items-center gap-1.5 cursor-pointer py-1 select-none"
                >
                  <span>{t("allCompanies")}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isMegaMenuOpen ? 'rotate-180 text-[#F2761B]' : 'text-[#5F6B63]'}`} />
                </a>
              </div>
              <div className="w-[1px] h-[18px] bg-[#E7E2DA]"></div>
              <a href={getPath('/jobs')} onClick={(e) => { e.preventDefault(); window.history.pushState(null, '', getPath('/jobs')); setIsJobsMode(true); }} style={{ color: '#0F4C2E', textDecoration: 'none', fontWeight: 500 }} className="hover:text-orange-500 transition-colors">{lang === 'nl' ? 'Vacatures' : 'Jobs'}</a>
              <a href={getPath('/news')} onClick={(e) => { e.preventDefault(); window.history.pushState(null, '', getPath('/news')); resetToDirectory(); setIsNewsMode(true); }} style={{ color: '#0F4C2E', textDecoration: 'none', fontWeight: 500 }} className="hover:text-orange-500 transition-colors">{lang === 'nl' ? 'Nieuws' : 'News'}</a>
              <a href={getPath('/faq')} onClick={(e) => { e.preventDefault(); window.history.pushState(null, '', getPath('/faq')); resetToDirectory(); setIsFaqMode(true); }} style={{ color: '#0F4C2E', textDecoration: 'none', fontWeight: 500 }} className="hover:text-orange-500 transition-colors">FAQs</a>
              
              <div className="w-[1px] h-[20px] bg-[#E7E2DA] mx-0.5"></div>

              {/* Länderschieber (Sprachumschalter nur Flaggen) */}
              <div className="flex items-center bg-[#F3F0EA] p-1 rounded-full border border-[#E7E2DA] shadow-inner select-none gap-1">
                <button 
                  type="button" 
                  onClick={() => switchLanguage('de')} 
                  className={`w-7 h-7 rounded-full text-[15px] flex items-center justify-center transition-all cursor-pointer ${
                    lang === 'de' 
                      ? 'bg-white shadow-sm ring-1 ring-black/10 scale-105' 
                      : 'opacity-50 hover:opacity-100 hover:scale-105'
                  }`}
                  title="Deutsch"
                  aria-label="Deutsch"
                >
                  <span className="leading-none select-none">🇩🇪</span>
                </button>
                <button 
                  type="button" 
                  onClick={() => switchLanguage('nl')} 
                  className={`w-7 h-7 rounded-full text-[15px] flex items-center justify-center transition-all cursor-pointer ${
                    lang === 'nl' 
                      ? 'bg-white shadow-sm ring-1 ring-black/10 scale-105' 
                      : 'opacity-50 hover:opacity-100 hover:scale-105'
                  }`}
                  title="Nederlands"
                  aria-label="Nederlands"
                >
                  <span className="leading-none select-none">🇳🇱</span>
                </button>
              </div>

              <div className="w-[1px] h-[20px] bg-[#E7E2DA] mx-0.5"></div>

              <button 
                onClick={() => { resetToDirectory(); setIsAdminMode(true); window.scrollTo(0, 0); }}
                className="flex items-center justify-center transition-colors cursor-pointer"
                title={currentUser ? 'Dashboard' : t("adminLogin")}
              >
                {currentUser ? (
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-[13px] tracking-wider ${isAdminMode ? 'bg-[#0F4C2E] shadow-inner' : 'bg-[#F2761B] shadow-md hover:bg-[#D65F0C]'} transition-colors`}>
                    {currentUser.email ? currentUser.email.substring(0, 2).toUpperCase() : 'A'}
                  </div>
                ) : (
                  <User className={`w-5 h-5 ${isAdminMode ? 'text-[#F2761B]' : 'text-[#0F4C2E] hover:text-orange-500'}`} />
                )}
              </button>
            </nav>

            <button 
              type="button" 
              onClick={() => setIsSubmitMode(true)} 
              className="hidden md:block hover:-translate-y-0.5"
              style={{ background: '#F2761B', color: '#fff', border: 'none', borderRadius: '6px', padding: '10px 18px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 12px rgba(242,118,27,0.25)', transition: 'background 0.15s, transform 0.15s' }}
            >
              {t("createEntry")}
            </button>

            {/* Mobile Language Switch & Menu Button */}
            <div className="md:hidden ml-auto flex items-center gap-2">
              <div className="flex items-center bg-[#F3F0EA] p-0.5 rounded-full border border-[#E7E2DA] gap-0.5">
                <button 
                  type="button" 
                  onClick={() => switchLanguage('de')} 
                  className={`w-7 h-7 rounded-full text-[14px] flex items-center justify-center transition-all cursor-pointer ${
                    lang === 'de' ? 'bg-white shadow-xs scale-105' : 'opacity-50'
                  }`}
                  title="Deutsch"
                  aria-label="Deutsch"
                >
                  <span className="leading-none">🇩🇪</span>
                </button>
                <button 
                  type="button" 
                  onClick={() => switchLanguage('nl')} 
                  className={`w-7 h-7 rounded-full text-[14px] flex items-center justify-center transition-all cursor-pointer ${
                    lang === 'nl' ? 'bg-white shadow-xs scale-105' : 'opacity-50'
                  }`}
                  title="Nederlands"
                  aria-label="Nederlands"
                >
                  <span className="leading-none">🇳🇱</span>
                </button>
              </div>

              <button className="text-[#0F4C2E] p-1 cursor-pointer" onClick={() => setIsMobileCategoriesOpen(!isMobileCategoriesOpen)}>
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </header>

        {/* Mega Menu Overlay */}
        <div onMouseEnter={handleMouseEnterMegaMenu} onMouseLeave={handleMouseLeaveMegaMenu}>
          <MegaMenu
            isOpen={isMegaMenuOpen}
            onClose={() => setIsMegaMenuOpen(false)}
            categories={categories}
            businesses={businesses}
            onSelectCategory={(catName, subcat) => {
              const catGroup = categories.find(c => c.name === catName || c.subcategories.includes(catName));
              const groupName = catGroup?.name || catName;
              const url = subcat 
                ? getPath(`/${encodeURIComponent(groupName)}/${encodeURIComponent(subcat)}`)
                : getPath(`/${encodeURIComponent(groupName)}`);
              window.history.pushState(null, '', url);
              setActiveCategory(subcat || groupName);
              setSearchQuery('');
              setIsAllMode(false);
              resetToDirectory();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onSelectAll={() => {
              window.history.pushState(null, '', getPath('/alle-unternehmen'));
              setActiveCategory('Alle');
              setActiveLocation('Alle');
              setSearchQuery('');
              resetToDirectory();
              setIsAllMode(true);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onSelectLocation={(loc) => {
              const url = getPath(`/alle-unternehmen?ort=${encodeURIComponent(loc)}`);
              window.history.pushState(null, '', url);
              setActiveCategory('Alle');
              setActiveLocation(loc);
              setSearchQuery('');
              resetToDirectory();
              setIsAllMode(true);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenMap={() => {
              window.history.pushState(null, '', getPath('/alle-unternehmen'));
              setActiveCategory('Alle');
              setActiveLocation('Alle');
              setSearchQuery('');
              resetToDirectory();
              setIsAllMode(true);
              setViewMode('map');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenSubmit={() => {
              resetToDirectory();
              setIsSubmitMode(true);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            getPath={getPath}
          />
        </div>

      {/* Offer Ribbon (Top Right) */}
      <OfferRibbon 
        pricingSettings={pricingSettings} 
        onNavigate={(path) => {
          resetToDirectory();
          if (path === '/preise') {
            setIsPricingMode(true);
            window.history.pushState(null, '', getPath('/preise'));
          } else {
            window.history.pushState(null, '', getPath(path));
            window.dispatchEvent(new PopStateEvent('popstate'));
          }
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }} 
      />

      {/* Main Content */}
      <main className="flex-1 w-full flex flex-col">
        <ErrorBoundary>
        <Suspense fallback={<div className="flex-1 flex items-center justify-center py-20"><div style={{width:40,height:40,border:'3px solid rgba(15,76,46,0.1)',borderRadius:'50%',borderTopColor:'#0F4C2E',animation:'spin 1s ease-in-out infinite'}} /></div>}>

        {selectedBusiness ? (
          <BusinessDetail business={selectedBusiness} onBack={() => { 
            const basePath = activeCategory !== 'Alle' 
              ? `/${encodeURIComponent(categories.find(c => c.name === activeCategory || c.subcategories.includes(activeCategory))?.name || activeCategory)}${categories.some(c => c.subcategories.includes(activeCategory)) ? `/${encodeURIComponent(activeCategory)}` : ''}` 
              : '/alle-unternehmen';
            const url = getPath(basePath);
            window.history.pushState(null, '', activeLocation !== 'Alle' ? `${url}?ort=${encodeURIComponent(activeLocation)}` : url);
            setSelectedBusiness(null); 
          }} theme={theme} activeThemeKey={activeThemeKey} onReviewSubmit={handleReviewSubmit} />
        ) : isNewsSubmitMode ? (
          <SubmitNews 
            theme={theme} 
            activeThemeKey={activeThemeKey} 
          />
        ) : newsId ? (
          <NewsDetail 
            newsId={newsId} 
            theme={theme} 
            activeThemeKey={activeThemeKey} 
            onBack={() => {
              window.history.pushState(null, '', '/news');
              window.dispatchEvent(new PopStateEvent('popstate'));
            }} 
          />
        ) : isNewsMode ? (
          <NewsBoard 
            theme={theme} 
            activeThemeKey={activeThemeKey} 
            onNewsClick={(id) => {
              window.history.pushState(null, '', `/news/${id}`);
              window.dispatchEvent(new PopStateEvent('popstate'));
            }}
          />
        ) : isFaqMode ? (
          <WinterbergFaq
            theme={theme}
            activeThemeKey={activeThemeKey}
            onBack={() => {
              resetToDirectory();
              window.history.pushState(null, '', getPath('/'));
            }}
            onSelectCategory={(cat, sub) => {
              resetToDirectory();
              setActiveCategory(sub || cat);
              if (cat !== 'Alle') {
                window.history.pushState(null, '', getPath(`/${encodeURIComponent(cat)}${sub ? `/${encodeURIComponent(sub)}` : ''}`));
              } else {
                window.history.pushState(null, '', getPath('/'));
              }
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        ) : isJobsMode ? (
          <JobsBoard 
            businesses={businesses} 
            theme={theme} 
            activeThemeKey={activeThemeKey} 
            initialCategory={jobsCategory}
            onBusinessSelect={(business) => {
              setSelectedBusiness(business);
              setIsJobsMode(false);
            }}
            onBack={() => setIsJobsMode(false)}
          />
        ) : isPricingMode ? (
          <PricingTable 
            theme={theme} 
            activeThemeKey={activeThemeKey} 
            pricingSettings={pricingSettings}
            onBack={() => setIsPricingMode(false)}
            onSelect={(plan) => {
              setIsPricingMode(false);
              setIsSubmitMode(true);
              // Future: pass selected plan to SubmitBusiness if we want it pre-selected
            }}
            onInquireAd={() => {
              setInquiryCategory('Alle');
              setIsAdInquiryOpen(true);
            }}
          />
        ) : isGroundingMode ? (
          <GroundingPage theme={theme} activeThemeKey={activeThemeKey} onBack={() => setIsGroundingMode(false)} />
        ) : isImpressumMode ? (
          <Impressum theme={theme} activeThemeKey={activeThemeKey} />
        ) : isAGBMode ? (
          <AGB theme={theme} activeThemeKey={activeThemeKey} />
        ) : isDatenschutzMode ? (
          <Datenschutz theme={theme} onBack={() => setIsDatenschutzMode(false)} />
        ) : isSubmitMode ? (
          <SubmitBusiness theme={theme} activeThemeKey={activeThemeKey} onCancel={() => setIsSubmitMode(false)} />
        ) : isAdminMode ? (
          <AdminDashboard 
            theme={theme} 
            activeThemeKey={activeThemeKey} 
            businesses={businesses} 
            setBusinesses={setBusinesses} 
            onBusinessAdded={loadBusinesses} 
            reviewsEnabled={reviewsEnabled} 
            setReviewsEnabled={(v: boolean) => { setReviewsEnabled(v); localStorage.setItem('premium_reviews_enabled', String(v)); }} 
            seoSettings={seoSettings} 
            setSeoSettings={setSeoSettings}
            designSettings={designSettings}
            setDesignSettings={setDesignSettings}
            ads={ads}
            setAds={setAds}
            pricingSettings={pricingSettings}
            setPricingSettings={setPricingSettings}
            onBack={() => setIsAdminMode(false)}
          />
        ) : (
          <>
            {/* Conditional Claude Home View */}
            {!searchQuery && activeCategory === 'Alle' && activeLocation === 'Alle' && viewMode === 'list' && !isAllMode ? (
              <div className="w-full flex flex-col mb-8">
                <section className="relative text-white w-full" style={{ background: 'linear-gradient(105deg, rgba(6,48,28,0.94) 0%, rgba(15,76,46,0.86) 55%, rgba(15,76,46,0.55) 100%), url(/winterberg-header.webp) center/cover no-repeat' }}>
                  <div className="max-w-[1180px] mx-auto px-6 pt-[80px] pb-[88px]">
                    <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-md px-3.5 py-1.5 text-sm font-medium tracking-wide">
                      <span className="w-2 h-2 rounded-full bg-[#F2761B]"></span>
                      {t("heroAllDistricts")}
                    </div>
                    <h1 className="font-display text-4xl md:text-6xl font-medium mt-6 mb-4 leading-tight">
                      {lang === 'nl' ? 'De ' : 'Das '} <br className="md:hidden"/>
                      <span className="inline-block relative">
                        <span className="font-extrabold tracking-wide">WINTERBERG</span>
                        <svg viewBox="0 0 200 10" preserveAspectRatio="none" className="w-full h-3 block -mt-1"><path d="M3 7C38 2 78 1 118 4c28 2 52 5 79 1" stroke="#F2761B" strokeWidth="3.4" fill="none" strokeLinecap="round"/></svg>
                      </span>
                      <br className="md:hidden"/> {lang === 'nl' ? 'Gids' : 'Verzeichnis'}
                    </h1>
                    <p className="text-lg md:text-xl text-white/90 max-w-2xl mb-4 leading-relaxed">{t("heroText1")}</p>
                    <p className="text-sm md:text-base text-white/70 max-w-3xl mb-8 leading-relaxed">{t("heroText2")}</p>

                    <div className="bg-white rounded-lg p-2.5 flex flex-col md:flex-row gap-2.5 items-center max-w-3xl shadow-2xl">
                      <div className="flex items-center gap-3 w-full md:flex-[2] px-3 relative">
                        <Search className="w-5 h-5 text-gray-400" />
                        <input 
                          placeholder={t("searchPlaceholderHero")} 
                          value={homeSearchInput}
                          onChange={(e) => {
                            setHomeSearchInput(e.target.value);
                            setShowHomeSuggestions(true);
                          }}
                          onFocus={() => setShowHomeSuggestions(true)}
                          onBlur={() => setTimeout(() => setShowHomeSuggestions(false), 200)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              setSearchQuery(homeSearchInput);
                              setShowHomeSuggestions(false);
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }
                          }}
                          className="border-none outline-none text-base w-full py-2.5 text-gray-900 bg-transparent" 
                        />
                        {showHomeSuggestions && homeSuggestions.length > 0 && (
                          <div className="absolute top-full left-0 right-0 mt-3 bg-white rounded-md shadow-2xl border border-gray-100 overflow-hidden z-[100] text-left">
                            {homeSuggestions.map(s => {
                              const matchingServices = (s.services || []).filter(srv => 
                                srv.toLowerCase().includes(homeSearchInput.toLowerCase().trim())
                              );
                              return (
                                <div 
                                  key={s.id} 
                                  className="px-4 py-3 hover:bg-gray-50 cursor-pointer flex items-center justify-between transition-colors border-b border-gray-50 last:border-0"
                                  onMouseDown={() => {
                                    setHomeSearchInput(s.name);
                                    setSearchQuery(s.name);
                                    setShowHomeSuggestions(false);
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                  }}
                                >
                                  <div className="flex items-center gap-3 overflow-hidden">
                                    <div className="w-8 h-8 rounded-md bg-gray-100 flex items-center justify-center flex-shrink-0">
                                      <Search className="w-4 h-4 text-gray-400" />
                                    </div>
                                    <div className="flex flex-col overflow-hidden">
                                      <span className="text-gray-900 font-medium truncate">{s.name}</span>
                                      <div className="flex items-center gap-1.5 flex-wrap">
                                        <span className="text-gray-500 text-xs truncate">{t(s.category)}{s.subcategory ? ` > ${t(s.subcategory)}` : ''}</span>
                                        {matchingServices.length > 0 && (
                                          <span className="text-[#0F4C2E] bg-[#E8F1EB] text-[11px] font-semibold px-1.5 py-0.5 rounded truncate">
                                            {t("foundService")}: {matchingServices.join(', ')}
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                      <select 
                        value={activeLocation} 
                        onChange={(e) => setActiveLocation(e.target.value)}
                        className="w-full md:w-auto md:flex-1 border border-gray-200 rounded-md px-3.5 py-2.5 text-base text-gray-900 bg-gray-50 focus:outline-none focus:border-[#F2761B]"
                      >
                        <option value="Alle">{t("allTowns")}</option>
                        {categories.flatMap(c => c.subcategories).map(s => s).filter((v,i,a)=>a.indexOf(v)===i).slice(0,0)} {/* Dummy to avoid unused */}
                        {Array.from(new Set(businesses.map(b => b.district || b.address.split(',')[1]?.trim().split(' ')[1] || 'Winterberg'))).sort().map(d => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                      <button 
                        type="button" 
                        onClick={() => {
                          setSearchQuery(homeSearchInput);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }} 
                        className="w-full md:w-auto bg-[#F2761B] hover:bg-[#D65F0C] text-white rounded-md px-5 py-2.5 font-semibold transition-colors cursor-pointer"
                      >
                        {lang === 'nl' ? 'Zoeken' : 'Suchen'}
                      </button>
                    </div>

                    {/* Popular Services & Products Search Pills */}
                    <div className="mt-4 flex items-center gap-2 flex-wrap text-xs text-white/90">
                      <span className="font-semibold text-white flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-[#F2761B]" /> {t("popularSearches")}:
                      </span>
                      {(lang === 'nl' ? [
                        'Schoenen',
                        'Ski-Verhuur',
                        'Bakkerij & Ontbijt',
                        'E-Bike',
                        'Dakdekkers',
                        'Bandenwissel',
                        'Fysiotherapie',
                        'Autogarage',
                        'Bowlen'
                      ] : [
                        'Schuhe',
                        'Ski-Verleih',
                        'Bäckerei & Frühstück',
                        'E-Bike',
                        'Dachdecker',
                        'Reifenwechsel',
                        'Physiotherapie',
                        'Autowerkstatt',
                        'Bowling'
                      ]).map(term => (
                        <button
                          key={term}
                          type="button"
                          onClick={() => {
                            setHomeSearchInput(term);
                            setSearchQuery(term);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="bg-white/15 hover:bg-white/30 text-white px-3 py-1 rounded-full border border-white/20 transition-all cursor-pointer font-medium"
                        >
                          {term}
                        </button>
                      ))}
                    </div>

                    <div className="flex gap-8 mt-12 flex-wrap">
                      <div><div className="font-display text-4xl font-bold">{businesses.length}</div><div className="text-sm text-white/70 mt-1">{lang === 'nl' ? 'Bedrijven' : 'Unternehmen'}</div></div>
                      <div><div className="font-display text-4xl font-bold">{categories.length}</div><div className="text-sm text-white/70 mt-1">{lang === 'nl' ? 'Categorieën' : 'Kategorien'}</div></div>
                      <div><div className="font-display text-4xl font-bold">14</div><div className="text-sm text-white/70 mt-1">{lang === 'nl' ? 'Dorpen & Wijken' : 'Ortsteile'}</div></div>
                    </div>
                  </div>
                </section>
                
                {/* Claude Home Sections */}
                <div className="max-w-[1180px] mx-auto px-6 pt-[68px] pb-[20px]">
                  <h2 className="font-display text-[34px] font-bold m-0 mb-[6px]">{lang === 'nl' ? 'Categorieën' : 'Kategorien'}</h2>
                  <p className="text-[16px] text-[#5F6B63] m-0 mb-[30px]">
                    {lang === 'nl' 
                      ? `Zes hoofdsectoren, ${categories.reduce((acc, cat) => acc + cat.subcategories.length, 0)} branches — vind precies wat u zoekt.`
                      : `Sechs Bereiche, ${categories.reduce((acc, cat) => acc + cat.subcategories.length, 0)} Branchen — such dir aus, was du brauchst.`}
                  </p>
                  
                  <div className="mb-16">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[18px]">
                      {categories.map(cat => (
                        <div 
                          key={cat.name}
                          onClick={() => { setActiveCategory(cat.name); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                          className="bg-white border border-[#EDE8E0] rounded-lg p-6 cursor-pointer shadow-[0_2px_10px_rgba(27,33,29,0.04)] hover:-translate-y-1 hover:shadow-[0_16px_34px_rgba(27,33,29,0.10)] transition-all"
                        >
                          <div className="flex items-center gap-[14px]">
                            <div className="w-[48px] h-[48px] rounded-md bg-[#E4F0F4] text-[#146C82] flex items-center justify-center shrink-0">
                               {cat.name === 'Dienstleistungen' ? <Briefcase className="w-6 h-6" /> : cat.name === 'Freizeit' ? <Sun className="w-6 h-6" /> : cat.name === 'Hotels & Unterkünfte' ? <Bed className="w-6 h-6" /> : cat.name === 'Einkaufen' ? <ShoppingBag className="w-6 h-6" /> : cat.name === 'Gastronomie' ? <Utensils className="w-6 h-6" /> : <BadgeCheck className="w-6 h-6" />}
                            </div>
                            <div className="flex-1">
                              <div className="font-display text-[21px] font-semibold text-gray-900 leading-tight">{t(cat.name)}</div>
                              <div className="text-[14px] text-[#5F6B63]">{businesses.filter(b => b.category === cat.name || b.subcategory === cat.name).length} {lang === 'nl' ? 'bedrijven' : 'Betriebe'}</div>
                            </div>
                            <ChevronRight className="w-5 h-5 text-[#B9B2A8]" />
                          </div>
                          <div className="mt-[16px] text-[14px] text-[#5F6B63] leading-[1.6]">
                            {cat.subcategories.map(s => t(s)).join(', ')}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mb-16">
                    <div className="flex flex-wrap gap-[10px]">
                      {Array.from(new Set(businesses.map(b => b.district || b.address.split(',')[1]?.trim().split(' ')[1] || 'Winterberg'))).sort().map(d => (
                        <button 
                          key={d}
                          onClick={() => { setActiveLocation(d); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                          className="bg-[#FAF8F5] border border-[#E7E2DA] rounded-md px-4 py-2 text-[14.5px] font-medium text-[#1B211D] cursor-pointer inline-flex items-center gap-2 hover:border-[#0F4C2E] transition-colors"
                        >
                          {d}
                          <span className="bg-[#F3F0EA] rounded px-2 py-0.5 text-[12px] font-semibold text-[#5F6B63]">
                            {businesses.filter(b => (b.district || b.address.split(',')[1]?.trim().split(' ')[1] || 'Winterberg') === d).length}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-baseline justify-between gap-4 flex-wrap mb-[22px]">
                      <h2 className="font-display text-[34px] font-bold m-0 leading-tight">
                        {lang === 'nl' ? 'Aanbevolen bedrijven' : 'Empfohlene Unternehmen'}
                      </h2>
                      <a 
                        href={getPath('/alle-unternehmen')} 
                        onClick={(e) => { 
                          e.preventDefault(); 
                          window.history.pushState(null, '', getPath('/alle-unternehmen')); 
                          resetToDirectory(); 
                          setActiveCategory('Alle');
                          setActiveLocation('Alle');
                          setSearchQuery('');
                          setIsAllMode(true); 
                          window.scrollTo({ top: 0, behavior: 'smooth' }); 
                        }} 
                        className="font-semibold text-[15px] text-[#0F4C2E] hover:text-[#F2761B] transition-colors"
                      >
                        {lang === 'nl' ? `Bekijk alle ${businesses.length} →` : `Alle ${businesses.length} ansehen →`}
                      </a>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[18px]">
                      {businesses.filter(b => b.isPremium).slice(0, 6).map(b => {
                        const bApproved = Array.isArray(b.reviews) ? b.reviews.filter(r => !r.status || r.status === 'approved') : [];
                        const bAvg = bApproved.length > 0 
                          ? (bApproved.reduce((sum, r) => sum + (Number(r?.rating) || 0), 0) / bApproved.length).toFixed(1) 
                          : null;
                        const bUsps = getBusinessReviewUsps(b, lang);
                        const localized = getLocalizedBusiness(b, lang);

                        return (
                          <div 
                            key={b.id} 
                            onClick={() => { setSelectedBusiness(b); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                            className="bg-white border border-[#EDE8E0] rounded-lg p-5 cursor-pointer flex flex-col gap-[12px] shadow-[0_2px_10px_rgba(27,33,29,0.04)] hover:-translate-y-1 hover:shadow-[0_16px_34px_rgba(27,33,29,0.10)] transition-all"
                          >
                            <div className="flex items-start gap-[13px]">
                              {b.logoUrl ? (
                                <img src={b.logoUrl} alt={b.name} className="w-[44px] h-[44px] rounded-md object-cover shrink-0 border border-[#EDE8E0]" />
                              ) : (
                                <BusinessCategoryIcon 
                                  category={b.category} 
                                  subcategory={b.subcategory} 
                                  name={b.name} 
                                  isPremium={b.isPremium} 
                                  className="w-[44px] h-[44px]"
                                />
                              )}
                              <div className="flex-1 min-w-0">
                                <div className="font-display text-[18px] font-semibold truncate leading-[1.25]">{b.name}</div>
                                <div className="text-[13px] text-[#5F6B63] mt-[3px]">{b.subcategory ? t(b.subcategory) : 'Andere'} · {b.district || 'Winterberg'}</div>
                              </div>
                              <div className="flex items-center gap-1.5 shrink-0">
                                {bAvg && (
                                  <div className="flex items-center gap-1 text-[12px] font-bold text-[#1B211D] bg-[#FAF8F5] px-2 py-0.5 rounded border border-[#EDE8E0]">
                                    <span className="text-[#F2761B]">★</span>
                                    <span>{bAvg}</span>
                                  </div>
                                )}
                                {b.isPremium && (
                                  <span className="bg-[#FFF1E4] text-[#D65F0C] rounded px-2 py-0.5 text-[11px] font-bold uppercase tracking-[0.04em]">Premium</span>
                                )}
                              </div>
                            </div>
                            
                            <p className="text-[14.5px] text-[#4A544D] leading-[1.55] m-0 line-clamp-3">{localized.description || b.description}</p>
                            
                            {/* AI Extracted Review USPs (Rating >= 4.0) */}
                            {bUsps.length > 0 && (
                              <div className="flex items-center gap-1.5 flex-wrap">
                                {bUsps.map((usp, uIdx) => (
                                  <span
                                    key={uIdx}
                                    className="bg-[#E8F1EB] text-[#0F4C2E] text-[11.5px] font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-[#0F4C2E]/20 shadow-2xs"
                                  >
                                    <span className="text-[#F2761B] text-[10px] leading-none">✓</span>
                                    {usp}
                                  </span>
                                ))}
                              </div>
                            )}

                            <div className="flex items-center gap-[7px] text-[13px] text-[#5F6B63] mt-auto pt-[4px]">
                              <MapPin className="w-[14px] h-[14px]" /> {b.address}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Footer CTA */}
                  <div className="mt-[62px] mb-[14px] bg-gradient-to-br from-[#0F4C2E] to-[#06301C] rounded-xl p-8 md:p-10 text-white flex flex-col md:flex-row gap-8 items-center justify-between">
                    <div className="max-w-[46ch]">
                      <h2 className="font-display text-[34px] font-bold m-0 mb-[12px]">{t("bannerMissingBusinessTitle")}</h2>
                      <p className="text-[17px] leading-[1.6] text-white/85 m-0">
                        {t("bannerMissingBusinessText")}
                      </p>
                    </div>
                    <div className="flex gap-[12px] flex-wrap">
                      <button type="button" onClick={() => setIsSubmitMode(true)} className="bg-[#F2761B] text-white border-none rounded-md px-6 py-3 text-[15px] font-semibold cursor-pointer hover:bg-[#D65F0C] transition-colors">{t("bannerRegisterNow")}</button>
                      <button type="button" onClick={() => setIsPricingMode(true)} className="bg-transparent text-white border border-white/40 rounded-md px-6 py-3 text-[15px] font-semibold cursor-pointer hover:bg-white/10 transition-colors">{t("bannerViewPricing")}</button>
                    </div>
                  </div>

                </div>
              </div>
            ) : null}

            {/* List View Header */}
            {(!(!searchQuery && activeCategory === 'Alle' && activeLocation === 'Alle' && viewMode === 'list' && !isAllMode)) && (
              <div className="w-full bg-[#0F4C2E] text-white">
                <div className="max-w-[1180px] mx-auto px-6 py-[40px] pb-[44px]">
                  <div className="text-[14px] text-white/70 mb-2.5">
                    <a href={getPath('/')} onClick={(e) => { e.preventDefault(); window.history.pushState(null, '', getPath('/')); resetToDirectory(); }} className="text-white/80 hover:text-white transition-colors">Start</a> / {activeCategory === 'Alle' ? t("allCompanies") : t(activeCategory)}
                  </div>
                  <h1 className="font-display text-[30px] md:text-[46px] font-bold m-0 mb-2.5">
                    {activeCategory === 'Alle' ? t("allCompanies") : t(activeCategory)}
                  </h1>
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <p className="m-0 text-[16px] text-white/80">{filteredBusinesses.length} {lang === 'nl' ? 'bedrijven gevonden' : 'Unternehmen gefunden'}</p>
                    <div className="flex bg-white/12 rounded-md p-1">
                      <button type="button" onClick={() => setViewMode('list')} className={`border-none rounded px-3 py-1.5 text-[13px] font-semibold cursor-pointer ${viewMode === 'list' ? 'bg-white text-[#1B211D]' : 'bg-transparent text-white hover:bg-white/10'}`}>{t("viewList")}</button>
                      <button type="button" onClick={() => setViewMode('map')} className={`border-none rounded px-3 py-1.5 text-[13px] font-semibold cursor-pointer ${viewMode === 'map' ? 'bg-white text-[#1B211D]' : 'bg-transparent text-white hover:bg-white/10'}`}>{t("viewMap")}</button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className={`w-full max-w-[1400px] mx-auto px-4 md:px-6 pt-[28px] pb-[80px] flex flex-col lg:flex-row gap-[24px] xl:gap-[30px] items-start ${(!searchQuery && activeCategory === 'Alle' && activeLocation === 'Alle' && viewMode === 'list' && !isAllMode) ? 'hidden' : ''}`}>
            {/* Sidebar (Categories) */}
            <aside className="w-full lg:w-[250px] xl:w-[270px] shrink-0 mb-6 lg:mb-0 bg-white border border-[#EDE8E0] rounded-lg p-5 lg:sticky lg:top-[116px]">
              
              {/* Mobile Toggle Button */}
              <button 
                className="w-full lg:hidden flex items-center justify-between p-3 font-display font-bold text-sm bg-gray-50 rounded-md mb-4"
                onClick={() => setIsMobileCategoriesOpen(!isMobileCategoriesOpen)}
              >
                <span>{lang === 'nl' ? 'Filters & Categorieën' : 'Filter & Kategorien'}</span>
                {isMobileCategoriesOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

              <div className={`${isMobileCategoriesOpen ? 'block' : 'hidden lg:block'}`}>
                <div className="font-display text-[13px] font-semibold tracking-[0.08em] uppercase text-[#8A928B] mb-[11px]">{lang === 'nl' ? 'Categorie' : 'Kategorie'}</div>
                <div className="flex flex-col gap-1 mb-[24px]">
                  {categories.map((group) => {
                    const count = initialBusinesses.filter(b => b.category === group.name).length;
                    const isActive = activeCategory === group.name || categories.find(c => c.name === group.name)?.subcategories.includes(activeCategory);
                    return (
                      <button
                        key={group.name}
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          const url = getPath(`/${encodeURIComponent(group.name)}`);
                          window.history.pushState(null, '', activeLocation !== 'Alle' ? `${url}?ort=${encodeURIComponent(activeLocation)}` : url);
                          setActiveCategory(group.name);
                          setSearchQuery('');
                          setIsAllMode(false);
                          if(isMobileCategoriesOpen) setIsMobileCategoriesOpen(false);
                          window.scrollTo({top: 0, behavior: 'smooth'});
                        }}
                        className={`text-left border-none rounded-md px-3 py-2 text-[14.5px] cursor-pointer flex justify-between gap-2 transition-colors ${isActive ? 'bg-[#0F4C2E] text-white font-semibold' : 'bg-transparent text-[#1B211D] font-medium hover:bg-[#F3F0EA]'}`}
                      >
                        <span>{t(group.name)}</span>
                        <span className={isActive ? 'text-white/70 text-[13px]' : 'text-[#8A928B] text-[13px]'}>{count}</span>
                      </button>
                    )
                  })}
                </div>

                {(() => {
                  const activeGroup = categories.find(c => c.name === activeCategory || c.subcategories.includes(activeCategory));
                  if (activeGroup && activeGroup.subcategories.length > 0) {
                    return (
                      <>
                        <div className="font-display text-[13px] font-semibold tracking-[0.08em] uppercase text-[#8A928B] mb-[11px]">{lang === 'nl' ? 'Branche' : 'Branche'}</div>
                        <div className="flex gap-[7px] flex-wrap mb-[24px]">
                          {activeGroup.subcategories.map(sub => {
                            const isSubActive = activeCategory === sub;
                            return (
                              <button
                                key={sub}
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  const url = getPath(`/${encodeURIComponent(activeGroup.name)}/${encodeURIComponent(sub)}`);
                                  window.history.pushState(null, '', activeLocation !== 'Alle' ? `${url}?ort=${encodeURIComponent(activeLocation)}` : url);
                                  setActiveCategory(sub);
                                  setSearchQuery('');
                                  if(isMobileCategoriesOpen) setIsMobileCategoriesOpen(false);
                                  window.scrollTo({top: 0, behavior: 'smooth'});
                                }}
                                className={`border rounded-md px-3 py-1.5 text-[13px] font-medium cursor-pointer transition-colors ${isSubActive ? 'border-[#0F4C2E] bg-[#0F4C2E] text-white' : 'border-[#E7E2DA] bg-transparent text-[#1B211D] hover:border-[#0F4C2E]'}`}
                              >
                                {t(sub)}
                              </button>
                            );
                          })}
                        </div>
                      </>
                    );
                  }
                  return null;
                })()}

                <div className="font-display text-[13px] font-semibold tracking-[0.08em] uppercase text-[#8A928B] mb-[11px]">{lang === 'nl' ? 'Dorp / Wijk' : 'Ortsteil'}</div>
                <div className="flex gap-[7px] flex-wrap mb-[24px]">
                  {['Alle', ...Array.from(new Set(initialBusinesses.map(b => b.district || b.address.split(',')[1]?.trim().split(' ')[1] || 'Winterberg'))).sort()].map(d => {
                    const isDistActive = activeLocation === d;
                    return (
                      <button
                        key={d}
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          const basePath = activeCategory !== 'Alle' 
                            ? `/${encodeURIComponent(categories.find(c => c.name === activeCategory || c.subcategories.includes(activeCategory))?.name || activeCategory)}${categories.some(c => c.subcategories.includes(activeCategory)) ? `/${encodeURIComponent(activeCategory)}` : ''}` 
                            : '/alle-unternehmen';
                          const url = getPath(basePath);
                          window.history.pushState(null, '', d !== 'Alle' ? `${url}?ort=${encodeURIComponent(d)}` : url);
                          setActiveLocation(d);
                          if(activeCategory === 'Alle') setIsAllMode(true);
                          if(isMobileCategoriesOpen) setIsMobileCategoriesOpen(false);
                        }}
                        className={`border rounded-md px-3 py-1.5 text-[13px] font-medium cursor-pointer transition-colors ${isDistActive ? 'border-[#0F4C2E] bg-[#0F4C2E] text-white' : 'border-[#E7E2DA] bg-transparent text-[#1B211D] hover:border-[#0F4C2E]'}`}
                      >
                        {d === 'Alle' ? t("allTowns") : d}
                      </button>
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={() => {
                     window.history.pushState(null, '', getPath('/alle-unternehmen'));
                     setActiveCategory('Alle');
                     setActiveLocation('Alle');
                     setSearchQuery('');
                     setIsAllMode(true);
                     if(isMobileCategoriesOpen) setIsMobileCategoriesOpen(false);
                     window.scrollTo({top: 0, behavior: 'smooth'});
                  }}
                  className="mt-6 w-full bg-transparent border border-[#E7E2DA] rounded-md p-2.5 text-[14px] font-medium cursor-pointer text-[#5F6B63] hover:border-[#0F4C2E] hover:text-[#0F4C2E] transition-colors"
                >
                  {lang === 'nl' ? 'Filters wissen' : 'Filter zurücksetzen'}
                </button>
              </div>
            </aside>


            {/* Main Area */}
            <div className="flex-1 min-w-0 w-full">

              {/* Search Bar & Sorting Controls – mobile: above banner */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 bg-white border border-[#EDE8E0] rounded-lg px-4 py-2.5 shadow-[0_2px_8px_rgba(27,33,29,0.03)] focus-within:border-[#0F4C2E] focus-within:shadow-[0_4px_12px_rgba(15,76,46,0.08)] transition-all">
                    <Search className="w-5 h-5 text-[#5F6B63] shrink-0" />
                    <input 
                      placeholder={
                        activeCategory === 'Alle'
                          ? (lang === 'nl' ? 'Zoek bedrijven, producten of diensten (bijv. schoenen, bakker, ski)...' : 'Unternehmen, Produkte oder Dienstleistungen suchen (z. B. Schuhe, Bäcker, Ski)…')
                          : (lang === 'nl' ? `In „${t(activeCategory)}" zoeken naar namen, producten of diensten…` : `In „${activeCategory}" nach Namen, Produkten oder Leistungen suchen…`)
                      } 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="border-none outline-none bg-transparent text-[15px] w-full text-[#1B211D] placeholder:text-[#8A928B]"
                    />
                    {searchQuery && (
                      <button 
                        type="button" 
                        onClick={() => setSearchQuery('')}
                        className="text-[#8A928B] hover:text-[#1B211D] p-1 rounded hover:bg-[#F3F0EA] transition-colors cursor-pointer"
                        title={lang === 'nl' ? 'Zoekopdracht wissen' : 'Suche zurücksetzen'}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Sorting Select Dropdown */}
                <div className="flex items-center gap-2 bg-white border border-[#EDE8E0] rounded-lg px-3.5 py-2.5 shrink-0 shadow-2xs">
                  <ArrowUpDown className="w-4 h-4 text-[#0F4C2E] shrink-0" />
                  <span className="text-xs font-bold text-[#5F6B63] hidden md:inline">{t("sortBy")}:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="bg-transparent border-none text-[13.5px] font-semibold text-[#1B211D] focus:outline-none cursor-pointer pr-1"
                  >
                    <option value="featured">{t("sortFeatured")}</option>
                    <option value="rating">{t("sortRating")}</option>
                    <option value="reviews_count">{t("sortReviewsCount")}</option>
                    <option value="name_asc">{t("sortNameAsc")}</option>
                    <option value="name_desc">{t("sortNameDesc")}</option>
                  </select>
                </div>
              </div>

              {/* Mobile Sponsor Banner – below search/sort, always visible */}
              <div className="block lg:hidden mb-5">
                <SkyscraperBanner 
                  banners={ads} 
                  activeCategory={activeCategory} 
                  onInquire={(cat) => {
                    setInquiryCategory(cat || activeCategory);
                    setIsAdInquiryOpen(true);
                  }} 
                  isMobile={true} 
                />
              </div>

              {/* Directory Grid or Map */}
              {isLoading ? (
                <div className={`py-20 text-center ${theme.textMuted}`}>{t("loading")}</div>
              ) : viewMode === 'map' ? (
                <DirectoryMap businesses={filteredBusinesses} onSelectBusiness={(bus) => {
                  window.history.pushState(null, '', getPath(getBusinessPath(bus, lang)));
                  setSelectedBusiness(bus);
                }} />
              ) : (
                <>
                {searchQuery && (
                  <div className="mb-4 bg-[#E8F1EB] border border-[#C5DCCE] rounded-lg p-3.5 flex items-center justify-between gap-3 text-[14px]">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[#0F4C2E] font-semibold">
                        {t("searchResultsFor")}: <strong>„{searchQuery}“</strong>
                      </span>
                      <span className="text-[#5F6B63] text-xs">
                        ({filteredBusinesses.length} {filteredBusinesses.length === 1 ? (lang === 'nl' ? 'bedrijf' : 'Unternehmen') : (lang === 'nl' ? 'bedrijven' : 'Unternehmen')} {t("foundInServices")})
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="text-[#0F4C2E] hover:underline font-bold text-xs shrink-0 cursor-pointer"
                    >
                      {t("resetSearch")} ✕
                    </button>
                  </div>
                )}

                <motion.div 
                  key={`${activeCategory}-${activeLocation}-${searchQuery}-${sortBy}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 xl:grid-cols-2 gap-6"
                >
                  {filteredBusinesses.length > 0 ? (
                    filteredBusinesses.map((bus) => {
                      const localized = getLocalizedBusiness(bus, lang);
                      const approvedReviews = Array.isArray(bus.reviews) ? bus.reviews.filter(r => !r.status || r.status === 'approved') : [];
                      const reviewCount = approvedReviews.length;
                      const avgRating = reviewCount > 0 
                        ? (approvedReviews.reduce((sum, r) => sum + (Number(r?.rating) || 0), 0) / reviewCount).toFixed(1)
                        : null;

                      const cardUsps = getBusinessReviewUsps(bus, lang);

                      return (
                        <div 
                          key={bus.id} 
                          onClick={(e) => {
                            e.preventDefault();
                            window.history.pushState(null, '', getPath(getBusinessPath(bus, lang)));
                            setSearchQuery(bus.name);
                            setSelectedBusiness(bus);
                          }}
                          className={`bg-white border rounded-lg p-5 cursor-pointer transition-all duration-200 shadow-[0_2px_10px_rgba(27,33,29,0.04)] hover:-translate-y-[3px] hover:shadow-[0_16px_34px_rgba(27,33,29,0.10)] ${bus.isPremium ? 'border-[#D65F0C]' : 'border-[#EDE8E0]'}`}
                        >
                          <div className="flex items-start justify-between gap-3 mb-[14px]">
                            <div className="flex items-start gap-[14px] min-w-0">
                              {bus.logoUrl ? (
                                <img src={bus.logoUrl} alt={bus.name} className="w-[48px] h-[48px] rounded-md object-cover shrink-0 border border-[#EDE8E0]" />
                              ) : (
                                <BusinessCategoryIcon 
                                  category={bus.category} 
                                  subcategory={bus.subcategory} 
                                  name={bus.name} 
                                  isPremium={bus.isPremium} 
                                  size="lg"
                                  className="w-[48px] h-[48px]"
                                />
                              )}
                              <div className="min-w-0">
                                <div className="font-display text-[17.5px] font-semibold leading-[1.25] mb-[4px] text-[#1B211D] flex items-center gap-2 flex-wrap">
                                  <span>{bus.name}</span>
                                  {bus.isPremium && (
                                    <span className="bg-[#FFF1E4] text-[#D65F0C] text-[11px] font-bold px-2 py-0.5 rounded border border-[#F2761B]/30 shrink-0">
                                      Premium
                                    </span>
                                  )}
                                </div>
                                <div className="text-[13.5px] text-[#8A928B] truncate">
                                  {t(bus.category)}{bus.subcategory ? ` · ${t(bus.subcategory)}` : ''} · {bus.district || 'Winterberg'}
                                </div>
                              </div>
                            </div>

                            {/* Star Rating Badge on Card */}
                            {avgRating && (
                              <div className="flex items-center gap-1 bg-[#FAF8F5] border border-[#E7E2DA] px-2.5 py-1 rounded-md shrink-0 shadow-2xs">
                                <span className="text-[#F2761B] text-[13px] leading-none">★</span>
                                <span className="font-bold text-[13px] text-[#1B211D]">{avgRating}</span>
                                <span className="text-[11px] text-[#8A928B]">({reviewCount})</span>
                              </div>
                            )}
                          </div>

                          <div className="text-[15px] text-[#5F6B63] leading-[1.5] mb-[16px] min-h-[44px]">
                            {localized.description && localized.description.length > 90 
                              ? localized.description.substring(0, 90) + '…' 
                              : (localized.description || '')}
                          </div>

                          {/* AI Extracted Review USPs (Rating >= 4.0) */}
                          {cardUsps.length > 0 && (
                            <div className="flex items-center gap-1.5 flex-wrap mb-3.5">
                              {cardUsps.map((usp, uIdx) => (
                                <span
                                  key={uIdx}
                                  className="bg-[#E8F1EB] text-[#0F4C2E] text-[11.5px] font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-[#0F4C2E]/20 shadow-2xs"
                                >
                                  <span className="text-[#F2761B] text-[10px] leading-none">✓</span>
                                  {usp}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Services Tags (Max 3 on card, +X for Premium if more) */}
                          {Array.isArray(localized.services) && localized.services.length > 0 && (
                            <div className="flex items-center gap-1.5 flex-wrap mb-2.5">
                              {localized.services.slice(0, 3).map((svc, sIdx) => {
                                const isMatched = searchQuery && (svc.toLowerCase().includes(searchQuery.toLowerCase().trim()) || (bus.services && bus.services.some(orig => orig.toLowerCase().includes(searchQuery.toLowerCase().trim()))));
                                return (
                                  <span
                                    key={sIdx}
                                    className={`text-[12px] px-2.5 py-0.5 rounded-md font-medium transition-colors ${
                                      isMatched 
                                        ? 'bg-[#FFF1E4] text-[#D65F0C] font-bold border border-[#F2761B]/40' 
                                        : 'bg-[#FAF8F5] text-[#5F6B63] border border-[#EDE8E0]'
                                    }`}
                                  >
                                    {isMatched ? `★ ${svc}` : svc}
                                  </span>
                                );
                              })}
                              {bus.isPremium && localized.services.length > 3 && (
                                <span className="text-[11px] text-[#8A928B] font-medium">
                                  +{localized.services.length - 3} {lang === 'nl' ? 'meer' : 'weitere'}
                                </span>
                              )}
                            </div>
                          )}

                          {/* Products Tags (Max 3 on card, +X for Premium if more) */}
                          {Array.isArray(localized.products) && localized.products.length > 0 && (
                            <div className="flex items-center gap-1.5 flex-wrap mb-3.5">
                              {localized.products.slice(0, 3).map((prod, pIdx) => {
                                const isMatched = searchQuery && (prod.toLowerCase().includes(searchQuery.toLowerCase().trim()) || (bus.products && bus.products.some(orig => orig.toLowerCase().includes(searchQuery.toLowerCase().trim()))));
                                return (
                                  <span
                                    key={pIdx}
                                    className={`text-[12px] px-2.5 py-0.5 rounded-md font-medium transition-colors ${
                                      isMatched 
                                        ? 'bg-[#FFF1E4] text-[#D65F0C] font-bold border border-[#F2761B]/40' 
                                        : 'bg-[#FFF8F1] text-[#D65F0C] border border-[#F2761B]/25'
                                    }`}
                                  >
                                    {isMatched ? `★ ${prod}` : prod}
                                  </span>
                                );
                              })}
                              {bus.isPremium && localized.products.length > 3 && (
                                <span className="text-[11px] text-[#8A928B] font-medium">
                                  +{localized.products.length - 3} {lang === 'nl' ? 'meer' : 'weitere'}
                                </span>
                              )}
                            </div>
                          )}

                          <div className="flex items-center gap-[8px] text-[13.5px] text-[#8A928B]">
                            <MapPin className="w-[14px] h-[14px]" />
                            {bus.address}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className={`col-span-full py-16 text-center border-dashed border-2 ${activeThemeKey === 'modern' ? 'rounded-none' : 'rounded-lg'} ${theme.cardBorder} ${theme.textMuted}`}>
                      <p className="text-lg font-medium">{t("noBusinessesFound")}</p>
                      <p className="text-sm mt-1">{t("adjustSearchCriteria")}</p>
                    </div>
                  )}
                </motion.div>
                
                {/* SEO Text Footer */}
                {(() => {
                  const seoData = getSeoContent(activeCategory, activeLocation, filteredBusinesses.length);
                  return (
                    <section className="mt-[34px] bg-white border border-[#EDE8E0] rounded-lg p-8">
                      <h2 className="font-display text-[26px] font-bold m-0 mb-[14px]">
                        {seoData.introTitle}
                      </h2>
                      <div className="text-[16px] leading-[1.75] text-[#4A544D] max-w-[78ch] mb-8">
                        {seoData.introText}
                      </div>
                      
                      {/* FAQ Section */}
                      {seoData.faqs.length > 0 && (
                        <div className="mt-8 border-t border-[#F3F0EA] pt-8">
                          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "FAQPage",
                            "mainEntity": seoData.faqs.map(faq => ({
                              "@type": "Question",
                              "name": faq.question,
                              "acceptedAnswer": {
                                "@type": "Answer",
                                "text": faq.answer
                              }
                            }))
                          })}} />
                          <h3 className="font-display text-[20px] font-bold mb-[18px]">Häufig gestellte Fragen (FAQ)</h3>
                          <div className="grid gap-[12px]">
                            {seoData.faqs.map((faq, idx) => (
                              <details key={idx} className="bg-[#FAF8F5] border border-[#EDE8E0] rounded-md overflow-hidden group">
                                <summary className="font-semibold text-[15.5px] p-[18px] cursor-pointer flex justify-between items-center outline-none">
                                  {faq.question}
                                  <span className="text-[#0F4C2E] group-open:rotate-180 transition-transform duration-200">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                                  </span>
                                </summary>
                                <div className="px-[18px] pb-[20px] pt-0 text-[15px] text-[#4A544D] leading-relaxed">
                                  {faq.answer}
                                </div>
                              </details>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Aktuelle Öffnungszeiten */}
                      <div className="mt-10 border-t border-[#F3F0EA] pt-8">
                        <h2 className="font-display text-[22px] font-bold mb-[18px]">
                          {(() => {
                            const plurals: Record<string, string> = {
                              'Heizungstechnik': 'Heizungstechniker',
                              'Friseur': 'Friseure',
                              'Restaurant': 'Restaurants',
                              'Supermarkt': 'Supermärkte',
                              'Bekleidung': 'Bekleidungsgeschäfte',
                              'Bürobedarf': 'Bürobedarfsgeschäfte',
                              'Dienstleistungen': 'Dienstleister',
                              'Einzelhandel': 'Einzelhandelsgeschäfte',
                              'Handwerk': 'Handwerksbetriebe',
                              'Gastronomie': 'Gastronomiebetriebe',
                            };
                            const catName = activeCategory !== 'Alle' ? (plurals[activeCategory] || activeCategory) : 'Unternehmen';
                            const locName = activeLocation !== 'Alle' ? 'in ' + activeLocation : 'in Winterberg und Umgebung';
                            return `Welche ${catName} ${locName} haben aktuell geöffnet?`;
                          })()}
                        </h2>
                        {(() => {
                          const currentlyOpenBusinesses = filteredBusinesses.filter(bus => canDisplayOpeningHours(bus) && bus.openingHours && isOpenNow(bus.openingHours, t).isOpen);
                          return currentlyOpenBusinesses.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                              {currentlyOpenBusinesses.map(bus => (
                                <div 
                                  key={bus.id} 
                                  onClick={(e) => {
                                    e.preventDefault();
                                    window.history.pushState(null, '', getPath(getBusinessPath(bus, lang)));
                                    setSearchQuery(bus.name);
                                    setSelectedBusiness(bus);
                                    window.scrollTo(0,0);
                                  }}
                                  className="bg-[#FAF8F5] border border-[#EDE8E0] rounded-md p-4 cursor-pointer hover:border-[#0F4C2E] transition-colors flex flex-col justify-between"
                                >
                                  <div>
                                    <div className="font-semibold text-[#1B211D] text-[15.5px] mb-1 leading-tight">{bus.name}</div>
                                    <div className="text-[13px] text-[#5F6B63]">{bus.district || 'Winterberg'}</div>
                                  </div>
                                  <div className="mt-3">
                                    <span className="inline-flex items-center gap-1.5 bg-[#E8F1EB] text-[#0F4C2E] px-2.5 py-1 rounded-md text-[12px] font-semibold">
                                      <span className="w-1.5 h-1.5 rounded-full bg-[#0F4C2E]"></span>
                                      Jetzt geöffnet
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-[15px] text-[#5F6B63] mb-6">
                              {(() => {
                                const plurals: Record<string, string> = {
                                  'Heizungstechnik': 'Heizungstechniker',
                                  'Friseur': 'Friseure',
                                  'Restaurant': 'Restaurants',
                                  'Supermarkt': 'Supermärkte',
                                  'Bekleidung': 'Bekleidungsgeschäfte',
                                  'Bürobedarf': 'Bürobedarfsgeschäfte',
                                  'Dienstleistungen': 'Dienstleister',
                                  'Einzelhandel': 'Einzelhandelsgeschäfte',
                                  'Handwerk': 'Handwerksbetriebe',
                                  'Gastronomie': 'Gastronomiebetriebe',
                                };
                                const catName = activeCategory !== 'Alle' ? (plurals[activeCategory] || activeCategory) : 'Unternehmen';
                                return `Aktuell sind leider keine ${catName} geöffnet oder es wurden noch keine Öffnungszeiten hinterlegt.`;
                              })()}
                            </div>
                          );
                        })()}
                        
                        <div className="bg-[#FFF1E4] border border-[#FADBD5] rounded-md p-5 flex flex-col sm:flex-row items-center gap-4 justify-between mt-4">
                          <div className="text-[14px] text-[#4A544D]">
                            <strong className="text-[#D65F0C] block mb-1">Für Unternehmer</strong>
                            Für die Darstellung von Öffnungszeiten ist ein Premium-Eintrag notwendig.
                          </div>
                          <button 
                            type="button" 
                            onClick={() => { setIsSubmitMode(true); window.scrollTo(0,0); }}
                            className="whitespace-nowrap bg-[#F2761B] text-white border-none rounded-md px-5 py-2.5 text-[14px] font-semibold cursor-pointer hover:bg-[#D65F0C] transition-colors"
                          >
                            Jetzt abschließen
                          </button>
                        </div>
                      </div>

                      <div className="mt-[32px] pt-[20px] border-t border-[#F3F0EA] flex gap-[14px] items-center flex-wrap">
                        <span className="text-[15px] text-[#4A544D]">Ihr Betrieb fehlt in dieser Kategorie?</span>
                        <button type="button" onClick={() => { setIsSubmitMode(true); window.scrollTo(0,0); }} className="bg-[#F2761B] text-white border-none rounded-md px-5 py-2.5 text-[14.5px] font-semibold cursor-pointer hover:bg-[#D65F0C] transition-colors">
                          Kostenlos eintragen
                        </button>
                      </div>
                    </section>
                  );
                })()}
                </>
              )}
            </div>

            {/* Desktop Sticky Right Skyscraper Banner */}
            <div className="hidden lg:block shrink-0 sticky top-[100px] self-start z-20">
              <SkyscraperBanner 
                banners={ads} 
                activeCategory={activeCategory} 
                onInquire={(cat) => {
                  setInquiryCategory(cat || activeCategory);
                  setIsAdInquiryOpen(true);
                }} 
              />
            </div>
            </div>

          </>
        )}
        </Suspense>
        </ErrorBoundary>
      </main>

      {/* Mobile Full Screen Menu */}
      {isMobileCategoriesOpen && (
        <div className={`md:hidden fixed inset-0 z-[100] overflow-y-auto ${theme.bgPage} flex flex-col`}>
          {/* Mobile Header (inside full screen menu) */}
          <div className={`flex items-center justify-between p-4 border-b border-black/10 dark:border-white/10 sticky top-0 ${theme.bgPage} z-10 shadow-sm`}>
            <div className="flex items-center gap-2">
              <span className="font-display text-[16px] font-extrabold tracking-wider text-[#0F4C2E]">WINTERBERG</span>
              <span className="text-xs text-[#5F6B63] font-medium">Navigation</span>
            </div>
            <button 
              onClick={() => setIsMobileCategoriesOpen(false)} 
              className="p-2 -mr-2 transition-colors hover:bg-black/5 dark:hover:bg-white/5 rounded-full text-[#1B211D]"
              aria-label="Menü schließen"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="p-4 flex flex-col gap-4">
            {/* Mobile Language Switcher */}
            <div className="flex items-center justify-between p-3 bg-white border border-[#EDE8E0] rounded-xl shadow-xs">
              <span className="text-sm font-semibold text-[#1B211D] flex items-center gap-2">
                <span>🌐</span>
                <span>{t("language")}:</span>
              </span>
              <div className="flex items-center bg-[#F3F0EA] p-1 rounded-full border border-[#E7E2DA] gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    switchLanguage('de');
                    setIsMobileCategoriesOpen(false);
                  }}
                  className={`w-9 h-9 rounded-full text-[20px] flex items-center justify-center transition-all cursor-pointer ${
                    lang === 'de' ? 'bg-white shadow-sm ring-1 ring-black/10 scale-105' : 'opacity-40 hover:opacity-100'
                  }`}
                  title="Deutsch"
                  aria-label="Deutsch"
                >
                  <span className="leading-none">🇩🇪</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    switchLanguage('nl');
                    setIsMobileCategoriesOpen(false);
                  }}
                  className={`w-9 h-9 rounded-full text-[20px] flex items-center justify-center transition-all cursor-pointer ${
                    lang === 'nl' ? 'bg-white shadow-sm ring-1 ring-black/10 scale-105' : 'opacity-40 hover:opacity-100'
                  }`}
                  title="Nederlands"
                  aria-label="Nederlands"
                >
                  <span className="leading-none">🇳🇱</span>
                </button>
              </div>
            </div>

            {/* Quick Navigation Cards */}
            <div className="grid grid-cols-2 gap-2.5">
              <a
                href={getPath("/alle-unternehmen")}
                onClick={(e) => {
                  e.preventDefault();
                  window.history.pushState(null, '', getPath('/alle-unternehmen'));
                  setActiveCategory('Alle');
                  setActiveLocation('Alle');
                  setSearchQuery('');
                  resetToDirectory();
                  setIsAllMode(true);
                  setIsMobileCategoriesOpen(false);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="flex items-center gap-2.5 p-3.5 rounded-lg bg-white border border-[#EDE8E0] font-display font-bold text-sm text-[#1B211D] hover:border-[#0F4C2E] transition-all shadow-xs"
              >
                <div className="w-8 h-8 rounded-md bg-[#FAF8F5] text-[#0F4C2E] flex items-center justify-center shrink-0">
                  <Building2 className="w-4 h-4" />
                </div>
                <span>Alle Betriebe</span>
              </a>

              <a
                href={getPath("/jobs")}
                onClick={(e) => {
                  e.preventDefault();
                  window.history.pushState(null, '', getPath('/jobs'));
                  resetToDirectory();
                  setIsJobsMode(true);
                  setJobsCategory(null);
                  setIsMobileCategoriesOpen(false);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="flex items-center gap-2.5 p-3.5 rounded-lg bg-white border border-[#EDE8E0] font-display font-bold text-sm text-[#1B211D] hover:border-[#0F4C2E] transition-all shadow-xs"
              >
                <div className="w-8 h-8 rounded-md bg-blue-50 text-blue-800 flex items-center justify-center shrink-0">
                  <Briefcase className="w-4 h-4" />
                </div>
                <span>Jobs & Karriere</span>
              </a>

              <a
                href={getPath("/news")}
                onClick={(e) => {
                  e.preventDefault();
                  window.history.pushState(null, '', getPath('/news'));
                  resetToDirectory();
                  setIsNewsMode(true);
                  setIsMobileCategoriesOpen(false);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="flex items-center gap-2.5 p-3.5 rounded-lg bg-white border border-[#EDE8E0] font-display font-bold text-sm text-[#1B211D] hover:border-[#0F4C2E] transition-all shadow-xs"
              >
                <div className="w-8 h-8 rounded-md bg-amber-50 text-amber-800 flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <span>News</span>
              </a>

              <a
                href={getPath("/faq")}
                onClick={(e) => {
                  e.preventDefault();
                  window.history.pushState(null, '', getPath('/faq'));
                  resetToDirectory();
                  setIsFaqMode(true);
                  setIsMobileCategoriesOpen(false);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="flex items-center gap-2.5 p-3.5 rounded-lg bg-white border border-[#EDE8E0] font-display font-bold text-sm text-[#1B211D] hover:border-[#0F4C2E] transition-all shadow-xs"
              >
                <div className="w-8 h-8 rounded-md bg-orange-50 text-[#F2761B] flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <span>FAQs</span>
              </a>
            </div>

            <div className="font-display text-xs font-bold uppercase tracking-[0.1em] text-[#8A928B] px-1 mt-2">
              Branchen & Kategorien
            </div>

            <nav className="flex flex-col gap-1.5">
              {categories.map((group) => {
                const isExpanded = expandedGroups.includes(group.name);
                const count = businesses.filter(b => b.category === group.name).length;
                return (
                  <div key={t(group.name)} className="flex flex-col gap-1">
                    <div className="flex items-center gap-1.5">
                      <a
                        href={getPath(`/${encodeURIComponent(group.name)}`)}
                        onClick={(e) => {
                          e.preventDefault();
                          window.history.pushState(null, '', getPath(`/${encodeURIComponent(group.name)}`));
                          setActiveCategory(group.name);
                          resetToDirectory();
                          if (!isExpanded) {
                            setExpandedGroups(prev => [...prev, group.name]);
                          }
                          setIsMobileCategoriesOpen(false);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className={`flex-1 flex items-center justify-between px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                          activeCategory === group.name ? 'bg-[#0F4C2E] text-white font-semibold' : 'bg-white text-[#1B211D] border border-[#EDE8E0]'
                        }`}
                      >
                        <span>{t(group.name)}</span>
                        <span className={`text-[11.5px] font-bold px-2 py-0.5 rounded ${activeCategory === group.name ? 'bg-white/20 text-white' : 'bg-[#FAF8F5] text-[#5F6B63]'}`}>
                          {count}
                        </span>
                      </a>
                      {group.subcategories.length > 0 && (
                        <button
                          onClick={() => {
                            setExpandedGroups(prev =>
                              isExpanded ? prev.filter(g => g !== group.name) : [...prev, group.name]
                            );
                          }}
                          className="p-3 flex items-center justify-center transition-colors text-[#8A928B] hover:text-black rounded-md bg-white border border-[#EDE8E0]"
                          aria-label="Unterkategorien anzeigen"
                        >
                          {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                        </button>
                      )}
                    </div>
                    {isExpanded && group.subcategories.length > 0 && (
                      <div className="flex flex-col gap-1 ml-3 border-l-2 border-[#0F4C2E]/20 pl-2.5 my-1">
                        {group.subcategories.map((sub) => (
                          <a
                            key={sub}
                            href={getPath(`/${encodeURIComponent(group.name)}/${encodeURIComponent(sub)}`)}
                            onClick={(e) => {
                              e.preventDefault();
                              window.history.pushState(null, '', getPath(`/${encodeURIComponent(group.name)}/${encodeURIComponent(sub)}`));
                              setActiveCategory(sub);
                              resetToDirectory();
                              setIsMobileCategoriesOpen(false);
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className={`block w-full text-left px-3 py-2 text-[13.5px] font-medium rounded-md transition-colors ${
                              activeCategory === sub ? 'bg-[#0F4C2E] text-white' : 'text-[#5F6B63] hover:bg-black/5'
                            }`}
                          >
                            {sub}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>
          </div>

          <div className="mt-auto p-4 pt-4 border-t border-black/10 dark:border-white/10 flex flex-col gap-2.5">
            <button 
              onClick={() => {
                resetToDirectory();
                window.history.pushState(null, '', getPath('/eintragen'));
                setIsSubmitMode(true);
                setIsMobileCategoriesOpen(false);
                window.scrollTo(0, 0);
              }}
              className="w-full py-3 px-4 font-bold text-sm text-center flex items-center justify-center gap-2 bg-[#F2761B] hover:bg-[#D65F0C] text-white rounded-md shadow-sm transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Unternehmen eintragen
            </button>
            <button 
              onClick={() => {
                resetToDirectory();
                setIsAdminMode(true);
                setIsMobileCategoriesOpen(false);
                window.scrollTo(0, 0);
              }}
              className="w-full py-3 px-4 font-bold text-sm text-center flex items-center justify-center gap-2 bg-white text-[#1B211D] border border-[#EDE8E0] hover:border-[#0F4C2E] rounded-md transition-colors cursor-pointer"
            >
              {currentUser ? (
                <>
                  <div className="w-5 h-5 rounded-full flex items-center justify-center bg-[#F2761B] text-white text-[10px]">
                    {currentUser.email ? currentUser.email.substring(0, 2).toUpperCase() : 'A'}
                  </div>
                  Account Dashboard
                </>
              ) : (
                <>
                  <User className="w-4 h-4" />
                  Account Login
                </>
              )}
            </button>
          </div>
        </div>
      )}

      <footer style={{ background: '#06301C', color: 'rgba(255,255,255,0.78)', marginTop: 'auto' }}>
        <div className="max-w-[1180px] mx-auto px-6 py-12 md:py-16 grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-12">
          <div className="md:col-span-2">
            <div 
              className="inline-block cursor-pointer" 
              onClick={(e) => { 
                e.preventDefault(); 
                window.history.pushState(null, '', getPath('/')); 
                resetToDirectory(); 
                setActiveCategory('Alle'); 
                setActiveLocation('Alle'); 
                setSearchQuery(''); 
                window.scrollTo({ top: 0, behavior: 'smooth' }); 
              }}
            >
              <span className="font-display text-[13px] font-medium text-white/70">{lang === 'nl' ? 'De' : 'Das'}</span>
              <span className="font-display text-[22px] font-extrabold tracking-widest text-white block leading-tight">WINTERBERG</span>
              <svg viewBox="0 0 200 10" preserveAspectRatio="none" className="w-full h-[7px] block mt-0.5">
                <path d="M3 7C38 2 78 1 118 4c28 2 52 5 79 1" stroke="#F2761B" strokeWidth="3.4" fill="none" strokeLinecap="round"/>
              </svg>
              <span className="font-display text-[12px] font-semibold tracking-[0.32em] text-white/90 block mt-1">{lang === 'nl' ? 'BEDRIJVENGIDS' : 'VERZEICHNIS'}</span>
            </div>
            <p className="text-[14.5px] leading-relaxed mt-4 max-w-[52ch]">
              {lang === 'nl' 
                ? `De grote gids voor alle bedrijven, vakmensen en dienstverleners in Winterberg en alle dorpen ${availableLocations.filter(l => l !== 'Winterberg').join(', ')}.`
                : `Das große Verzeichnis für alle Unternehmen, Handwerker und Dienstleister in Winterberg und seinen Ortsteilen ${availableLocations.filter(l => l !== 'Winterberg').join(', ')}.`}
            </p>
          </div>
          <div className="flex flex-col gap-2.5 text-[14.5px]">
            <div className="text-white font-semibold mb-0.5">{lang === 'nl' ? 'Gids' : 'Verzeichnis'}</div>
            <a 
              href={getPath('/alle-unternehmen')} 
              onClick={(e) => { 
                e.preventDefault(); 
                window.history.pushState(null, '', getPath('/alle-unternehmen')); 
                resetToDirectory(); 
                setActiveCategory('Alle');
                setActiveLocation('Alle');
                setSearchQuery('');
                setIsAllMode(true); 
                window.scrollTo({ top: 0, behavior: 'smooth' }); 
              }} 
              className="text-white/80 hover:text-white transition-colors"
            >
              {lang === 'nl' ? 'Alle bedrijven' : 'Alle Unternehmen'}
            </a>
            <a 
              href={getPath('/jobs')} 
              onClick={(e) => { 
                e.preventDefault(); 
                window.history.pushState(null, '', getPath('/jobs')); 
                resetToDirectory(); 
                setIsJobsMode(true); 
                window.scrollTo({ top: 0, behavior: 'smooth' }); 
              }} 
              className="text-white/80 hover:text-white transition-colors"
            >
              {lang === 'nl' ? 'Vacatures & Banen' : 'Jobs & Stellenangebote'}
            </a>
            <a 
              href={getPath('/news')} 
              onClick={(e) => { 
                e.preventDefault(); 
                window.history.pushState(null, '', getPath('/news')); 
                resetToDirectory(); 
                setIsNewsMode(true); 
                window.scrollTo({ top: 0, behavior: 'smooth' }); 
              }} 
              className="text-white/80 hover:text-white transition-colors"
            >
              {lang === 'nl' ? 'Nieuws & Berichten' : 'News & Aktuelles'}
            </a>
            <a 
              href={getPath('/faq')} 
              onClick={(e) => { 
                e.preventDefault(); 
                window.history.pushState(null, '', getPath('/faq')); 
                resetToDirectory(); 
                setIsFaqMode(true); 
                window.scrollTo({ top: 0, behavior: 'smooth' }); 
              }} 
              className="text-white/80 hover:text-white transition-colors"
            >
              {lang === 'nl' ? 'Veelgestelde Vragen (FAQ)' : 'Winterberg FAQs'}
            </a>
            <a 
              href={getPath('/eintragen')} 
              onClick={(e) => { 
                e.preventDefault(); 
                window.history.pushState(null, '', getPath('/eintragen')); 
                resetToDirectory(); 
                setIsSubmitMode(true); 
                window.scrollTo({ top: 0, behavior: 'smooth' }); 
              }} 
              className="text-white/80 hover:text-white transition-colors"
            >
              {lang === 'nl' ? 'Bedrijf aanmelden' : 'Unternehmen eintragen'}
            </a>
            <a 
              href={getPath('/preise')} 
              onClick={(e) => { 
                e.preventDefault(); 
                window.history.pushState(null, '', getPath('/preise')); 
                resetToDirectory(); 
                setIsPricingMode(true); 
                window.scrollTo({ top: 0, behavior: 'smooth' }); 
              }} 
              className="text-white/80 hover:text-white transition-colors"
            >
              {lang === 'nl' ? 'Pakketten & Prijzen' : 'Preise & Pakete'}
            </a>
            <a 
              href={getPath('/grounding')} 
              onClick={(e) => { 
                e.preventDefault(); 
                window.history.pushState(null, '', getPath('/grounding')); 
                resetToDirectory(); 
                setIsGroundingMode(true); 
                window.scrollTo({ top: 0, behavior: 'smooth' }); 
              }} 
              className="text-white/80 hover:text-white transition-colors"
            >
              {lang === 'nl' ? 'Grounding Page (AI)' : 'Grounding Page (KI-Fakten)'}
            </a>
            <button 
              type="button"
              onClick={() => { 
                setInquiryCategory('Alle');
                setIsAdInquiryOpen(true);
              }} 
              className="text-left bg-transparent border-none p-0 text-white/80 hover:text-[#F2761B] transition-colors cursor-pointer text-[14.5px]"
            >
              {lang === 'nl' ? 'Adverteren' : 'Werbung schalten'}
            </button>
          </div>
          <div className="flex flex-col gap-2.5 text-[14.5px]">
            <div className="text-white font-semibold mb-0.5">{lang === 'nl' ? 'Juridisch' : 'Rechtliches'}</div>
            <a 
              href={getPath('/impressum')} 
              onClick={(e) => { 
                e.preventDefault(); 
                window.history.pushState(null, '', getPath('/impressum')); 
                resetToDirectory(); 
                setIsImpressumMode(true); 
                window.scrollTo({ top: 0, behavior: 'smooth' }); 
              }} 
              className="text-white/80 hover:text-white transition-colors"
            >
              {lang === 'nl' ? 'Colofon' : 'Impressum'}
            </a>
            <a 
              href={getPath('/datenschutz')} 
              onClick={(e) => { 
                e.preventDefault(); 
                window.history.pushState(null, '', getPath('/datenschutz')); 
                resetToDirectory(); 
                setIsDatenschutzMode(true); 
                window.scrollTo({ top: 0, behavior: 'smooth' }); 
              }} 
              className="text-white/80 hover:text-white transition-colors"
            >
              {lang === 'nl' ? 'Privacybeleid' : 'Datenschutz'}
            </a>
            <a 
              href={getPath('/agb')} 
              onClick={(e) => { 
                e.preventDefault(); 
                window.history.pushState(null, '', getPath('/agb')); 
                resetToDirectory(); 
                setIsAGBMode(true); 
                window.scrollTo({ top: 0, behavior: 'smooth' }); 
              }} 
              className="text-white/80 hover:text-white transition-colors"
            >
              {lang === 'nl' ? 'Algemene Voorwaarden' : 'AGB'}
            </a>
          </div>
          <div className="flex flex-col gap-2.5 text-[14.5px]">
            <div className="text-white font-semibold mb-0.5">{lang === 'nl' ? 'Externe Links' : 'Externe Links'}</div>
            <a href="https://www.winterberg.de/service-kontakt/wirtschaftsfoerderung/" target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-white transition-colors">Wirtschaftsförderung Winterberg</a>
          </div>
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.12)' }}>
          <div className="max-w-[1180px] mx-auto px-6 py-4 text-[13px] flex items-center justify-between">
            <span>© {new Date().getFullYear()} {lang === 'nl' ? 'De Winterberg Bedrijvengids' : 'Das Winterberg Verzeichnis'} · {t("projectBy")} <a href="https://sichtbar-online.com" target="_blank" rel="noopener noreferrer" className="hover:text-orange-500 transition-colors">SICHTBAR SEO Simon Kräling</a></span>
          </div>
        </div>
      </footer>

      {/* Ad Inquiry Modal */}
      <AdInquiryModal 
        isOpen={isAdInquiryOpen} 
        onClose={() => setIsAdInquiryOpen(false)} 
        initialCategory={inquiryCategory} 
      />

      {/* GDPR Cookie Consent & Dynamic Scripts (Google Analytics 302481363) */}
      <CookieConsent theme={theme} />
      <DynamicScriptLoader />
      </div>
    </div>
  );
}

function InteractiveLockOverlay({ children, groupHoverClass = "group-hover/review" }: { children: React.ReactNode, groupHoverClass?: string }) {
  const { t } = useTranslation();

  const [isShaking, setIsShaking] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    // If we clicked a button inside, let it handle its own click
    if ((e.target as HTMLElement).tagName === 'BUTTON') return;
    
    e.preventDefault();
    e.stopPropagation();
    if (isShaking) return;
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 400);
  };

  return (
    <div 
      onClick={handleClick}
      className={`absolute inset-0 flex items-center justify-center opacity-0 ${groupHoverClass}:opacity-100 transition-opacity bg-white/10 backdrop-blur-[1px] z-10 cursor-pointer rounded-inherit`}
    >
      <div className={`bg-black text-white text-sm px-4 py-3 rounded shadow-xl flex flex-col md:flex-row items-center gap-2 max-w-[90%] text-center font-medium transition-transform ${isShaking ? 'animate-lock-shake' : ''}`}>
        {children}
      </div>
    </div>
  );
}

function NewsAdminPanel() {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Form Fields
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [author, setAuthor] = useState('Redaktion');
  const [businessName, setBusinessName] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageSource, setImageSource] = useState('');
  const [isAiGenerated, setIsAiGenerated] = useState(false);
  const [status, setStatus] = useState<'pending' | 'approved'>('approved');

  const loadNews = async () => {
    try {
      setLoading(true);
      const snap = await getDocs(collection(db, 'news'));
      const items = snap.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
      items.sort((a: any, b: any) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime());
      setNews(items);
    } catch(e) {
      console.error("Error loading news in admin:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNews();
  }, []);

  const handleOpenNew = () => {
    setEditingItem(null);
    setTitle('');
    setSlug('');
    setAuthor('Redaktion');
    setBusinessName('');
    setDate(new Date().toISOString().split('T')[0]);
    setContent('');
    setImageUrl('');
    setImageSource('');
    setIsAiGenerated(false);
    setStatus('approved');
    setFormError(null);
    setIsEditing(true);
  };

  const handleOpenEdit = (item: any) => {
    setEditingItem(item);
    setTitle(item.title || '');
    setSlug(item.slug || slugify(item.title || ''));
    setAuthor(item.author || '');
    setBusinessName(item.businessName || '');
    setDate(item.date ? new Date(item.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]);
    setContent(item.content || '');
    setImageUrl(item.imageUrl || '');
    setImageSource(item.imageSource || '');
    setIsAiGenerated(!!item.isAiGenerated);
    setStatus(item.status || 'approved');
    setFormError(null);
    setIsEditing(true);
  };

  const handleImageFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setUploadingImage(true);
    setFormError(null);

    try {
      let url = '';
      try {
        const storageRef = ref(storage, `news/${Date.now()}_${file.name}`);
        await uploadBytes(storageRef, file);
        url = await getDownloadURL(storageRef);
      } catch (storageErr) {
        console.warn('Storage upload failed, using FileReader fallback', storageErr);
        url = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      }
      setImageUrl(url);
    } catch (err: any) {
      setFormError('Fehler beim Hochladen des Bildes: ' + (err.message || err));
    } finally {
      setUploadingImage(false);
    }
  };

  const handleToggleAi = async (id: string, currentVal: boolean) => {
    const newVal = !currentVal;
    try {
      await updateDoc(doc(db, 'news', id), { isAiGenerated: newVal });
      setNews(prev => prev.map(item => item.id === id ? { ...item, isAiGenerated: newVal } : item));
    } catch (e) {
      console.error(e);
      alert('Fehler beim Aktualisieren des KI-Status');
    }
  };

  const handleUpdateImageSource = async (id: string, source: string) => {
    try {
      await updateDoc(doc(db, 'news', id), { imageSource: source.trim() });
      setNews(prev => prev.map(item => item.id === id ? { ...item, imageSource: source.trim() } : item));
    } catch (e) {
      console.error(e);
      alert('Fehler beim Aktualisieren der Bildquelle');
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: 'pending' | 'approved') => {
    const nextStatus = currentStatus === 'pending' ? 'approved' : 'pending';
    try {
      await updateDoc(doc(db, 'news', id), { status: nextStatus });
      setNews(prev => prev.map(item => item.id === id ? { ...item, status: nextStatus } : item));
    } catch (e) {
      console.error(e);
      alert('Fehler beim Aktualisieren des Status');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Möchten Sie diesen News-Beitrag wirklich unwiderruflich löschen?')) return;
    try {
      await deleteDoc(doc(db, 'news', id));
      setNews(prev => prev.filter(item => item.id !== id));
    } catch (e) {
      console.error(e);
      alert('Fehler beim Löschen');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || !author.trim()) {
      setFormError('Bitte füllen Sie mindestens Überschrift, Autor und Text aus.');
      return;
    }

    setIsSubmitting(true);
    setFormError(null);

    const finalSlug = slug.trim() || slugify(title.trim());
    const articleData: any = {
      title: title.trim(),
      slug: finalSlug,
      author: author.trim(),
      businessName: businessName.trim() || '',
      date: new Date(date).toISOString(),
      content: content.trim(),
      imageUrl: imageUrl.trim() || '',
      imageSource: imageSource.trim() || '',
      isAiGenerated: !!isAiGenerated,
      status: status,
    };

    try {
      if (editingItem) {
        await updateDoc(doc(db, 'news', editingItem.id), articleData);
      } else {
        await addDoc(collection(db, 'news'), {
          ...articleData,
          createdAt: new Date().toISOString()
        });
      }

      setIsEditing(false);
      setEditingItem(null);
      await loadNews();
    } catch (err: any) {
      console.error('Error saving news article:', err);
      setFormError('Fehler beim Speichern: ' + (err.message || err));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading && !isEditing) {
    return (
      <div className="bg-white border border-[#EDE8E0] rounded-lg p-10 text-center text-[#5F6B63]">
        <div className="w-8 h-8 border-3 border-[#0F4C2E]/20 border-t-[#0F4C2E] rounded-full animate-spin mx-auto mb-3" />
        Lade News-Einträge...
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#EDE8E0] rounded-lg p-6 shadow-[0_10px_30px_rgba(27,33,29,0.06)]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-[#EDE8E0]">
        <div>
          <h2 className="font-display text-[22px] font-bold text-[#1B211D] flex items-center gap-2">
            <FileText className="w-6 h-6 text-[#0F4C2E]" /> News &amp; Aktuelles verwalten
          </h2>
          <p className="text-xs text-[#5F6B63] mt-0.5">
            Veröffentlichen und bearbeiten Sie Neuigkeiten, Pressemitteilungen, Bildquellen und KI-Kennzeichnungen.
          </p>
        </div>
        {!isEditing && (
          <button
            type="button"
            onClick={handleOpenNew}
            className="inline-flex items-center gap-1.5 bg-[#0F4C2E] hover:bg-[#0b3822] text-white px-4 py-2.5 rounded-md font-semibold text-sm transition-colors shadow-sm self-start sm:self-auto cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Neue News erstellen
          </button>
        )}
      </div>

      {/* Inline Editor */}
      {isEditing ? (
        <div className="bg-[#FAF8F5] border border-[#E7E2DA] rounded-xl p-6 md:p-8 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#E7E2DA]">
            <div>
              <h3 className="text-xl font-bold font-display text-[#1B211D]">
                {editingItem ? 'News-Beitrag bearbeiten' : 'Neuen News-Beitrag anlegen'}
              </h3>
              <p className="text-xs text-[#5F6B63] mt-0.5">
                Alle Änderungen werden sofort nach dem Speichern auf der Website wirksam.
              </p>
            </div>
            <button 
              type="button" 
              onClick={() => { setIsEditing(false); setEditingItem(null); }}
              className="text-sm font-semibold text-gray-500 hover:text-gray-900 bg-white border border-[#E7E2DA] rounded-md px-3 py-1.5 transition-colors"
            >
              Abbrechen
            </button>
          </div>

          {formError && (
            <div className="p-3.5 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {formError}
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Überschrift *
              </label>
              <input 
                type="text" 
                required 
                value={title} 
                onChange={e => {
                  setTitle(e.target.value);
                  if (!editingItem) {
                    setSlug(slugify(e.target.value));
                  }
                }}
                placeholder="z. B. Winterberg legt bei Übernachtungen deutlich zu"
                className="w-full border border-[#E7E2DA] rounded-md px-3.5 py-2.5 text-base bg-white focus:outline-none focus:border-[#0F4C2E] font-semibold text-gray-900 shadow-xs"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                  Autor / Redaktion *
                </label>
                <input 
                  type="text" 
                  required 
                  value={author} 
                  onChange={e => setAuthor(e.target.value)}
                  placeholder="z. B. Ralf Hermann"
                  className="w-full border border-[#E7E2DA] rounded-md px-3.5 py-2 text-sm bg-white focus:outline-none focus:border-[#0F4C2E]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                  Bezug zu Unternehmen
                </label>
                <input 
                  type="text" 
                  value={businessName} 
                  onChange={e => setBusinessName(e.target.value)}
                  placeholder="z. B. Winterberg Touristik"
                  className="w-full border border-[#E7E2DA] rounded-md px-3.5 py-2 text-sm bg-white focus:outline-none focus:border-[#0F4C2E]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                  Veröffentlichungsdatum *
                </label>
                <input 
                  type="date" 
                  required 
                  value={date} 
                  onChange={e => setDate(e.target.value)}
                  className="w-full border border-[#E7E2DA] rounded-md px-3.5 py-2 text-sm bg-white focus:outline-none focus:border-[#0F4C2E]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                URL-Slug / Pfad (Optional)
              </label>
              <div className="flex items-center text-xs text-gray-500 bg-white border border-[#E7E2DA] rounded-md px-3 py-2">
                <span className="shrink-0 text-gray-400">https://www.winterberg-verzeichnis.de/news/</span>
                <input 
                  type="text" 
                  value={slug} 
                  onChange={e => setSlug(slugify(e.target.value))}
                  placeholder="mein-news-beitrag"
                  className="w-full bg-transparent focus:outline-none font-mono text-[#0F4C2E] font-medium ml-1"
                />
              </div>
            </div>

            {/* Image & Attribution Section */}
            <div className="bg-white border border-[#E7E2DA] rounded-lg p-5 space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#1B211D] uppercase tracking-wider flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-[#0F4C2E]" /> Titelbild &amp; Bildnachweis
                </label>
                {imageUrl && (
                  <button
                    type="button"
                    onClick={() => setImageUrl('')}
                    className="text-xs text-red-600 hover:underline font-medium cursor-pointer"
                  >
                    Bild entfernen
                  </button>
                )}
              </div>

              {imageUrl ? (
                <div className="relative rounded-lg overflow-hidden border border-[#E7E2DA] bg-[#FAF8F5] h-[200px] group">
                  <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <label className="bg-white text-gray-900 text-xs font-bold px-3 py-2 rounded-md cursor-pointer hover:bg-gray-100 transition-colors shadow">
                      Bild austauschen
                      <input type="file" accept="image/*" className="hidden" onChange={handleImageFileUpload} />
                    </label>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label className="border-2 border-dashed border-[#D8D2C8] hover:border-[#0F4C2E] bg-[#FAF8F5] rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-colors text-center">
                    <Upload className="w-7 h-7 text-[#0F4C2E] mb-2" />
                    <span className="text-sm font-bold text-gray-800">
                      {uploadingImage ? 'Wird hochgeladen...' : 'Vom Computer hochladen'}
                    </span>
                    <span className="text-xs text-gray-500 mt-1">JPG, PNG, WebP (max. 5MB)</span>
                    <input type="file" accept="image/*" disabled={uploadingImage} className="hidden" onChange={handleImageFileUpload} />
                  </label>

                  <div className="flex flex-col justify-center bg-[#FAF8F5] border border-[#E7E2DA] rounded-lg p-4">
                    <label className="text-xs font-semibold text-gray-700 mb-1.5">Oder direkte Bild-URL einfügen:</label>
                    <input 
                      type="url" 
                      value={imageUrl} 
                      onChange={e => setImageUrl(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full border border-[#E7E2DA] rounded px-3 py-2 text-sm bg-white focus:outline-none focus:border-[#0F4C2E]"
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Bildquelle / Bildnachweis (Optional)
                  </label>
                  <input 
                    type="text" 
                    value={imageSource} 
                    onChange={e => setImageSource(e.target.value)}
                    placeholder="z. B. Foto: Max Mustermann / Textzeit"
                    className="w-full border border-[#E7E2DA] rounded-md px-3.5 py-2 text-sm bg-[#FAF8F5] focus:bg-white focus:outline-none focus:border-[#0F4C2E]"
                  />
                </div>

                <div className="flex items-end">
                  <label className="flex items-center gap-2 cursor-pointer select-none bg-[#FAF8F5] border border-[#E7E2DA] rounded-md px-3.5 py-2.5 w-full text-xs font-semibold text-gray-800 hover:bg-gray-100 transition-colors">
                    <input 
                      type="checkbox"
                      checked={isAiGenerated}
                      onChange={e => setIsAiGenerated(e.target.checked)}
                      className="w-4 h-4 accent-[#0F4C2E] rounded cursor-pointer"
                    />
                    <span>Dieses Bild ist KI-generiert (Symbolbild)</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Content Textarea */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Text / Inhalt der News *
                </label>
                <span className="text-xs text-[#5F6B63]">
                  Formatierung: <code>## Überschrift</code>, <code>**fett**</code>, <code>&gt; Zitat</code>, <code>:::contact ... :::</code>
                </span>
              </div>
              <textarea 
                required 
                rows={12}
                value={content} 
                onChange={e => setContent(e.target.value)}
                placeholder="Geben Sie hier den ausführlichen Text der Pressemitteilung / News ein..."
                className="w-full border border-[#E7E2DA] rounded-md p-4 text-sm bg-white focus:outline-none focus:border-[#0F4C2E] font-sans leading-relaxed shadow-xs"
              />
            </div>

            {/* Status Selector */}
            <div className="flex items-center gap-3 pt-2">
              <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">Status:</span>
              <button
                type="button"
                onClick={() => setStatus('approved')}
                className={`px-4 py-2 rounded-md text-xs font-bold transition-colors cursor-pointer ${
                  status === 'approved' 
                    ? 'bg-[#E8F1EB] text-[#0F4C2E] border-2 border-[#0F4C2E]' 
                    : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'
                }`}
              >
                ✓ Sofort freigeben (Öffentlich sichtbar)
              </button>
              <button
                type="button"
                onClick={() => setStatus('pending')}
                className={`px-4 py-2 rounded-md text-xs font-bold transition-colors cursor-pointer ${
                  status === 'pending' 
                    ? 'bg-[#FDF3D3] text-[#96700B] border-2 border-[#96700B]' 
                    : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'
                }`}
              >
                ⏳ In Prüfung (Nicht öffentlich)
              </button>
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-end gap-3 pt-6 border-t border-[#E7E2DA]">
              <button
                type="button"
                onClick={() => { setIsEditing(false); setEditingItem(null); }}
                className="px-5 py-2.5 text-sm font-semibold text-gray-600 hover:text-gray-900 bg-white border border-gray-300 rounded-md cursor-pointer transition-colors"
              >
                Abbrechen
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#0F4C2E] hover:bg-[#0b3822] text-white px-7 py-2.5 rounded-md font-bold text-sm transition-colors shadow-md cursor-pointer disabled:opacity-50 flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                {isSubmitting ? 'Wird gespeichert...' : editingItem ? 'Änderungen jetzt speichern' : 'News jetzt veröffentlichen'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* News List */
        news.length > 0 ? (
          <div className="grid gap-4">
            {news.map(item => {
              const articleSlug = item.slug || slugify(item.title);
              return (
                <div 
                  key={item.id} 
                  className="border border-[#EDE8E0] rounded-lg p-5 bg-white hover:border-[#0F4C2E]/40 transition-all flex flex-col md:flex-row gap-5 items-start"
                >
                  {/* Thumbnail & Quick Actions */}
                  <div className="w-full md:w-[160px] shrink-0">
                    {item.imageUrl ? (
                      <div className="relative rounded-md overflow-hidden border border-[#E7E2DA] bg-[#FAF8F5] h-[110px]">
                        <img src={item.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                        {item.isAiGenerated && (
                          <span className="absolute top-1.5 right-1.5 bg-black/75 backdrop-blur-xs text-white text-[9.5px] font-semibold px-1.5 py-0.5 rounded">
                            KI
                          </span>
                        )}
                      </div>
                    ) : (
                      <div className="w-full h-[110px] bg-[#FAF8F5] border border-dashed border-[#D8D2C8] rounded-md flex items-center justify-center text-xs text-[#8A928B]">
                        Kein Bild
                      </div>
                    )}

                    {item.imageUrl && (
                      <div className="mt-2 space-y-1.5">
                        <label 
                          title="1-Klick-Umschaltung für KI-Hinweis"
                          className="flex items-center gap-1.5 cursor-pointer select-none bg-[#FAF8F5] hover:bg-[#F3F0EA] border border-[#E7E2DA] px-2 py-1 rounded text-[11px] font-semibold text-[#1B211D] transition-colors"
                        >
                          <input 
                            type="checkbox"
                            checked={!!item.isAiGenerated}
                            onChange={() => handleToggleAi(item.id, !!item.isAiGenerated)}
                            className="w-3.5 h-3.5 accent-[#0F4C2E] rounded cursor-pointer"
                          />
                          <span>KI-generiert</span>
                        </label>

                        <input
                          type="text"
                          defaultValue={item.imageSource || ''}
                          onBlur={(e) => {
                            if (e.target.value !== (item.imageSource || '')) {
                              handleUpdateImageSource(item.id, e.target.value);
                            }
                          }}
                          placeholder="Bildquelle..."
                          title="Bildquelle / Bildnachweis (speichert automatisch beim Verlassen)"
                          className="w-full text-[11px] border border-[#E7E2DA] rounded px-2 py-1 bg-white focus:outline-none focus:border-[#0F4C2E]"
                        />
                      </div>
                    )}
                  </div>

                  {/* Article Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <span className="font-bold text-[17px] text-[#1B211D] leading-snug">{item.title}</span>
                      
                      {item.status === 'pending' ? (
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(item.id, item.status)}
                          className="bg-[#FDF3D3] text-[#96700B] hover:bg-[#fae7b4] rounded px-2.5 py-0.5 text-[11px] font-bold cursor-pointer transition-colors"
                          title="Klicken zum Freigeben"
                        >
                          ⏳ NEU (In Prüfung)
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(item.id, item.status)}
                          className="bg-[#E8F1EB] text-[#0F4C2E] hover:bg-[#d4e6d9] rounded px-2.5 py-0.5 text-[11px] font-bold cursor-pointer transition-colors"
                          title="Klicken zum Zurückstellen"
                        >
                          ✓ FREIGEGEBEN
                        </button>
                      )}

                      {item.isAiGenerated && (
                        <span className="bg-purple-100 text-purple-800 rounded px-2 py-0.5 text-[11px] font-semibold flex items-center gap-1">
                          <Sparkles className="w-3 h-3" /> KI-Bild
                        </span>
                      )}

                      {item.imageSource && (
                        <span className="bg-gray-100 text-gray-700 rounded px-2 py-0.5 text-[11px] font-medium">
                          Quelle: {item.imageSource}
                        </span>
                      )}
                    </div>

                    <div className="text-[12.5px] text-[#5F6B63] mb-2 flex items-center gap-2 flex-wrap">
                      <span className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-gray-400" />
                        Von: <strong className="text-[#1B211D]">{item.author}</strong>
                      </span>
                      {item.businessName && (
                        <span className="flex items-center gap-1">
                          <Building2 className="w-3.5 h-3.5 text-gray-400" />
                          Bezug: <strong>{item.businessName}</strong>
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-gray-400" />
                        Datum: {new Date(item.date).toLocaleDateString('de-DE')}
                      </span>
                    </div>

                    <div className="text-[13.5px] text-[#4A544D] line-clamp-2 bg-[#FAF8F5] p-3 rounded-md border border-[#EDE8E0]/70 mb-2">
                      {item.content}
                    </div>

                    {articleSlug && (
                      <a
                        href={`/news/${articleSlug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-[#0F4C2E] hover:underline font-semibold inline-flex items-center gap-1"
                      >
                        Öffentlichen Beitrag ansehen <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex sm:flex-col gap-2 shrink-0 self-end sm:self-start w-full sm:w-auto justify-end">
                    <button 
                      type="button"
                      onClick={() => handleOpenEdit(item)}
                      className="bg-[#0F4C2E] hover:bg-[#0b3822] text-white rounded-md px-4 py-2 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-sm cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" /> Bearbeiten
                    </button>

                    <button 
                      type="button"
                      onClick={() => handleDelete(item.id)}
                      className="bg-[#FBEAE7] text-[#C0392B] hover:bg-[#FADBD5] rounded-md px-4 py-2 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Löschen
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="border border-dashed border-[#D8D2C8] rounded-md p-10 text-center text-[#8A928B]">
            Keine News vorhanden. Klicken Sie oben auf „Neue News erstellen“, um einen Beitrag anzulegen.
          </div>
        )
      )}
    </div>
  );
}


function RedirectsAdminPanel({ theme, activeThemeKey }: any) {
  const [redirects, setRedirects] = useState<any[]>([]);
  const [source, setSource] = useState('');
  const [target, setTarget] = useState('');
  const [loading, setLoading] = useState(true);

  const loadRedirects = async () => {
    try {
      const snap = await getDocs(collection(db, 'redirects'));
      setRedirects(snap.docs.map((doc: any) => ({ id: doc.id, ...doc.data() })));
    } catch(e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRedirects();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!source || !target) return;
    try {
      await addDoc(collection(db, 'redirects'), { source, target });
      setSource('');
      setTarget('');
      loadRedirects();
    } catch(e) {
      console.error(e);
      alert('Fehler beim Speichern');
    }
  };

  const handleDelete = async (id: string) => {
    if(!window.confirm('Weiterleitung wirklich löschen?')) return;
    try {
      await deleteDoc(doc(db, 'redirects', id));
      loadRedirects();
    } catch(e) {
      console.error(e);
    }
  };

  return (
    <div>
      <h3 className="text-xl font-bold mb-4 font-display">301 Redirects (Weiterleitungen)</h3>
      <p className="text-sm opacity-70 mb-6 max-w-2xl">Hier können Sie permanente (301) Weiterleitungen einrichten. Dies ist nützlich, wenn sich eine URL ändert und Sie sicherstellen möchten, dass bestehende Links weiterhin funktionieren.</p>
      
      <form onSubmit={handleAdd} className="flex flex-col md:flex-row gap-3 items-end mb-8 bg-black/5 p-5 rounded-md border border-black/10">
        <div className="flex-1 w-full">
          <label className="block text-xs font-bold uppercase mb-1.5 opacity-70">Ausgangs-URL (z.B. /alte-seite)</label>
          <input value={source} onChange={e=>setSource(e.target.value)} required placeholder="/alte-seite" className="w-full px-3 py-2 border border-black/10 rounded focus:outline-none" />
        </div>
        <div className="flex-1 w-full">
          <label className="block text-xs font-bold uppercase mb-1.5 opacity-70">Ziel-URL (z.B. /neue-seite)</label>
          <input value={target} onChange={e=>setTarget(e.target.value)} required placeholder="/neue-seite" className="w-full px-3 py-2 border border-black/10 rounded focus:outline-none" />
        </div>
        <button type="submit" className={`w-full md:w-auto px-6 py-2 text-sm font-medium transition-colors ${theme.primaryBtn} ${activeThemeKey === 'modern' ? 'rounded-none' : 'rounded-md'}`}>Hinzufügen</button>
      </form>
      
      {loading ? (
        <p className="opacity-70">Lade Weiterleitungen...</p>
      ) : redirects.length === 0 ? (
        <p className="text-sm opacity-70 italic">Noch keine Weiterleitungen vorhanden.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-black/10 opacity-70">
                <th className="py-3 px-4 font-medium text-sm">Ausgangs-URL</th>
                <th className="py-3 px-4 font-medium text-sm">Ziel-URL</th>
                <th className="py-3 px-4 font-medium text-sm text-right">Aktion</th>
              </tr>
            </thead>
            <tbody>
              {redirects.map(r => (
                <tr key={r.id} className="border-b border-black/10 hover:bg-black/5 transition-colors">
                  <td className="py-3 px-4 text-sm font-medium">{r.source}</td>
                  <td className="py-3 px-4 text-sm opacity-80">{r.target}</td>
                  <td className="py-3 px-4 text-right">
                    <button onClick={() => handleDelete(r.id)} className="text-red-500 hover:text-red-700 p-2 transition-colors rounded hover:bg-red-50" title="Löschen"><Trash2 className="w-4 h-4"/></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function AdminDashboard({ theme, activeThemeKey, businesses, setBusinesses, onBusinessAdded, token, setToken, reviewsEnabled, setReviewsEnabled, seoSettings, setSeoSettings, designSettings, setDesignSettings, ads, setAds, pricingSettings, setPricingSettings, onBack }: any) {

  const { t } = useTranslation();
  const { currentUser, userProfile } = useAuth();
  const [view, setView] = useState<'list' | 'add' | 'edit'>('list');
  const [activeTab, setActiveTab] = useState<'entries' | 'widgets' | 'seo' | 'design' | 'pricing' | 'reviews' | 'abrechnung' | 'werbung' | 'news' | 'redirects' | 'scripts'>('entries');
  const [editingBusiness, setEditingBusiness] = useState<Business | null>(null);
  const [generatorBusiness, setGeneratorBusiness] = useState<Business | null>(null);
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);

  const [activeAdminCategory, setActiveAdminCategory] = useState<string>('Alle');
  const [activeAdminLocation, setActiveAdminLocation] = useState<string>('Alle');
  const [adminSearchQuery, setAdminSearchQuery] = useState('');
  const [expandedGroups, setExpandedGroups] = useState<string[]>([]);

  const handleLogout = () => {
    signOut(auth);
    onBack();
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t("confirmDelete"))) return;
    try {
      await deleteDoc(doc(db, 'businesses', id));
      setBusinesses((businesses: Business[]) => businesses.filter(b => b.id !== id));
    } catch (e) {
      console.error(e);
      alert('Fehler beim Löschen');
    }
  };

  const updateBusinessInFirestore = async (businessId: string, transform: (b: Business) => Business) => {
    let updatedBusiness: Business | null = null;
    setBusinesses((prev: Business[]) => prev.map(b => {
      if (b.id === businessId) {
        updatedBusiness = transform(b);
        return updatedBusiness;
      }
      return b;
    }));
    
    if (updatedBusiness) {
      try {
        await setDoc(doc(db, 'businesses', businessId), updatedBusiness);
      } catch(e) {
        console.error("Firestore update failed", e);
        alert("Fehler beim Speichern in der Datenbank.");
      }
    }
  };

  if (!currentUser) {
    return <Login theme={theme} activeThemeKey={activeThemeKey} onBack={onBack} />;
  }

  // Determine allowed businesses based on role
  const adminEmails = ['simon.kraeling@sichtbar-online.com', 'info@sichtbar-online.com', 'info@winterberg.sichtbar-online.com'];
  const isAdmin = userProfile?.role === 'admin' || 
                  (currentUser?.email && adminEmails.includes(currentUser.email));

  const ownerBusinessId = userProfile?.businessId;
  const currentUid = currentUser?.uid;
  const allowedBusinesses = isAdmin 
    ? businesses 
    : businesses.filter((b: Business) => b.id === ownerBusinessId || b.ownerId === currentUid || b.ownerId === userProfile?.uid);



  if (view === 'add' || view === 'edit') {
    return (
      <AdminPanel 
        theme={theme} 
        activeThemeKey={activeThemeKey} 
        businesses={businesses}
        setBusinesses={setBusinesses}
        onBusinessAdded={() => { onBusinessAdded(); setView('list'); }} 
        onCancel={() => setView('list')} 
        token={token}
        businessToEdit={editingBusiness}
      />
    );
  }

  const filteredAdminBusinesses = allowedBusinesses.filter((bus: Business) => {
    let matchesCategory = true;
    if (activeAdminCategory === 'In Prüfung') {
      matchesCategory = bus.status === 'pending';
    } else if (activeAdminCategory !== 'Alle') {
      const inAdditional = bus.additionalCategories?.some(ac => ac.category === activeAdminCategory || ac.subcategory === activeAdminCategory);
      matchesCategory = bus.category === activeAdminCategory || bus.subcategory === activeAdminCategory || !!inAdditional;
    }

    const busLocation = bus.district || (bus.address && bus.address.split(',')[1]?.trim().split(' ')[1]) || 'Winterberg';
    const matchesLocation = activeAdminLocation === 'Alle' || busLocation === activeAdminLocation;
    
    const searchStr = adminSearchQuery.toLowerCase();
    const matchesSearch = !searchStr || 
                          bus.name.toLowerCase().includes(searchStr) || 
                          (bus.description && bus.description.toLowerCase().includes(searchStr)) ||
                          (bus.email && bus.email.toLowerCase().includes(searchStr));
                          
    return matchesCategory && matchesLocation && matchesSearch;
  }).sort((a, b) => a.name.localeCompare(b.name));

  return (
    <main className="flex-1 max-w-[1180px] mx-auto w-full px-6 py-[32px] pb-[80px]">
      <div className="flex justify-between items-center gap-4 flex-wrap mb-[22px]">
        <div>
            <h2 className="text-[26px] font-bold tracking-tight mb-[4px]">{isAdmin ? 'Adminbereich' : 'Account'}</h2>
            <div className="text-[13px] text-[#5F6B63]">Angemeldet als {currentUser?.email}</div>
        </div>
        <button 
          onClick={handleLogout}
          className="bg-white border border-[#E7E2DA] rounded-md px-[18px] py-[10px] text-[14px] font-medium cursor-pointer hover:border-[#0F4C2E] hover:text-[#0F4C2E] transition-colors"
        >
          Abmelden
        </button>
      </div>

      <div className="flex gap-[6px] flex-wrap mb-[24px] bg-white border border-[#EDE8E0] rounded-md p-1.5">
        {[
          { id: 'entries', label: 'Einträge' },
          { id: 'widgets', label: '⚡ Widget & Siegel' },
          { id: 'reviews', label: 'Bewertungen' },
          { id: 'abrechnung', label: 'Abrechnung' },
          ...(isAdmin ? [
            { id: 'pricing', label: '🏷️ Preise & Aktionen' },
            { id: 'design', label: 'Design & Fonts' },
            { id: 'werbung', label: 'Werbung' },
            { id: 'news', label: 'News' },
            { id: 'seo', label: 'SEO' },
            { id: 'redirects', label: 'Redirects' },
            { id: 'scripts', label: 'Skripte' }
          ] : [])
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`border-none rounded px-4 py-2 text-[14.5px] cursor-pointer transition-colors ${activeTab === tab.id ? 'bg-[#0F4C2E] text-white font-semibold' : 'bg-transparent text-[#1B211D] font-normal hover:bg-black/5'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'entries' ? (
        <div className="bg-white border border-[#EDE8E0] rounded-lg p-6 shadow-[0_10px_30px_rgba(27,33,29,0.06)]">
          <div className="flex flex-col gap-[16px] mb-[24px]">
            <div className="flex gap-[12px] flex-wrap items-center">
              {isAdmin && (
                <input 
                  placeholder="Unternehmen, E-Mail oder Text suchen..." 
                  value={adminSearchQuery}
                  onChange={(e) => setAdminSearchQuery(e.target.value)}
                  className="flex-1 min-w-[220px] border border-[#E7E2DA] rounded-md px-3.5 py-2.5 text-[15px] bg-[#FAF8F5] focus:outline-none focus:border-[#0F4C2E]"
                />
              )}
              <button 
                onClick={() => { setEditingBusiness(null); setView('add'); }}
                className="bg-[#0F4C2E] text-white border-none rounded-md px-5 py-2.5 text-[14.5px] font-semibold cursor-pointer hover:bg-[#06301C] transition-colors ml-auto"
              >
                + Neues Unternehmen
              </button>
            </div>
            
            {isAdmin && (
              <div className="flex gap-2 flex-wrap mb-4 items-center">
                <div className="flex gap-2 flex-wrap flex-1">
                  {['Alle', 'In Prüfung', ...categories.map(c => c.name)].map(c => (
                    <button 
                      key={c}
                      onClick={() => setActiveAdminCategory(c)}
                      className={`border rounded-md px-3 py-1.5 text-[13.5px] cursor-pointer transition-colors ${activeAdminCategory === c ? 'bg-[#0F4C2E] text-white border-[#0F4C2E]' : 'bg-[#FAF8F5] text-[#4A544D] border-[#E7E2DA] hover:border-[#0F4C2E]'}`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
                <select
                  value={activeAdminLocation}
                  onChange={(e) => setActiveAdminLocation(e.target.value)}
                  className="border border-[#E7E2DA] rounded-md px-3 py-1.5 text-[13.5px] bg-[#FAF8F5] focus:outline-none focus:border-[#0F4C2E]"
                >
                  <option value="Alle">Alle Ortsteile</option>
                  {Array.from(new Set(allowedBusinesses.map((b: Business) => b.district || (b.address && b.address.split(',')[1]?.trim().split(' ')[1]) || 'Winterberg'))).filter(Boolean).sort().map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
          
          <div className="grid gap-[8px]">
            {filteredAdminBusinesses.map((bus: Business, i: number, arr: Business[]) => {
              const firstLetter = bus.name.charAt(0).toUpperCase();
              const prevLetter = i > 0 ? arr[i-1].name.charAt(0).toUpperCase() : '';
              const showHeader = firstLetter !== prevLetter;
              
              return (
                <React.Fragment key={bus.id}>
                  {showHeader && (
                    <div className="flex items-center gap-[12px] mt-[16px] mb-[8px]">
                      <span className="text-[15px] font-bold text-[#0F4C2E] bg-[#E8F1EB] rounded-full min-w-[28px] h-[28px] flex items-center justify-center">
                        {firstLetter}
                      </span>
                      <div className="flex-1 border-t-2 border-dotted border-[#E7E2DA]"></div>
                    </div>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-[14px] items-center border border-[#EDE8E0] rounded-md px-4 py-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-[9px] flex-wrap">
                        <span className="font-semibold text-[15.5px]">{bus.name}</span>
                        {bus.isPremium && <span className="bg-[#FFF1E4] text-[#D65F0C] rounded px-2 py-0.5 text-[11px] font-bold">PREMIUM</span>}
                        {bus.status === 'pending' && <span className="bg-[#FDF3D3] text-[#96700B] rounded px-2 py-0.5 text-[11px] font-bold">IN PRÜFUNG</span>}
                      </div>
                      <div className="text-[13.5px] text-[#5F6B63] mt-[3px]">
                        {bus.category} {bus.subcategory ? `· ${bus.subcategory}` : ''} {bus.district ? `· ${bus.district}` : ''}
                      </div>
                    </div>
                    <div className="flex gap-[8px]">
                      {bus.status === 'pending' && (
                        <button 
                          onClick={async () => {
                            try {
                              const res = await fetch('/api/approve-business', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ id: bus.id })
                              });
                              
                              if (!res.ok) {
                                throw new Error('Server error');
                              }
                              
                              const updated = { ...bus, status: 'approved' };
                              setBusinesses(businesses.map((b: Business) => b.id === bus.id ? updated : b));
                            } catch (e) {
                              console.error(e);
                              alert("Fehler beim Freischalten");
                            }
                          }}
                          className="bg-[#E8F1EB] text-[#0F4C2E] border-none rounded-md px-3.5 py-2 text-[13.5px] font-medium cursor-pointer hover:bg-[#D6E7DC]"
                        >
                          Freigeben
                        </button>
                      )}
                      <button 
                        onClick={() => { setGeneratorBusiness(bus); setIsGeneratorOpen(true); }}
                        className="bg-[#E8F1EB] text-[#0F4C2E] hover:bg-[#D6E7DC] border-none rounded-md px-3.5 py-2 text-[13.5px] font-semibold cursor-pointer transition-colors inline-flex items-center gap-1.5"
                        title="Trust-Siegel & Bewertungs-Widget konfigurieren"
                      >
                        <span>⚡ Widget</span>
                      </button>
                      <button 
                        onClick={() => { setEditingBusiness(bus); setView('edit'); }}
                        className="bg-[#F3F0EA] border-none rounded-md px-3.5 py-2 text-[13.5px] font-medium cursor-pointer hover:bg-[#EAE5DB]"
                      >
                        Bearbeiten
                      </button>
                      <button 
                        onClick={() => handleDelete(bus.id)}
                        className="bg-[#FBEAE7] text-[#C0392B] border-none rounded-md px-3.5 py-2 text-[13.5px] font-medium cursor-pointer hover:bg-[#FADBD5]"
                      >
                        Löschen
                      </button>
                </div>
              </div>
            </React.Fragment>
            );
          })}
            {filteredAdminBusinesses.length === 0 && (
              <div className="border border-dashed border-[#D8D2C8] rounded-md p-6 text-center text-[#8A928B]">
                Keine Einträge gefunden.
              </div>
            )}
          </div>
        </div>
        
        ) : activeTab === 'widgets' ? (
          <div className="bg-white border border-[#EDE8E0] rounded-lg p-6 shadow-[0_10px_30px_rgba(27,33,29,0.06)]">
            <div className="flex justify-between items-start flex-wrap gap-4 mb-6">
              <div>
                <h2 className="font-display text-[21px] font-bold m-0 mb-1">Bewertungs- & Trust-Siegel für Ihre Website</h2>
                <p className="text-[14.5px] text-[#4A544D] max-w-[65ch]">
                  Binden Sie Ihr offizielles Winterberg-Verzeichnis Siegel oder interaktives Bewertungs-Widget direkt auf Ihrer Firmenwebsite ein. 
                  Das Siegel stärkt das Vertrauen lokaler Kunden und signalisiert geprüfte Qualität.
                </p>
              </div>
            </div>

            <div className="grid gap-4">
              {allowedBusinesses.map((bus: Business) => {
                const revCount = (bus.reviews || []).filter(r => r.status === 'approved').length;
                const avg = revCount > 0 
                  ? ((bus.reviews || []).filter(r => r.status === 'approved').reduce((a, b) => a + (Number(b.rating) || 5), 0) / revCount).toFixed(1)
                  : '5.0';

                return (
                  <div key={bus.id} className="border border-[#EDE8E0] rounded-xl p-5 bg-[#FAF8F5] flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-[#0F4C2E]/40 transition-all">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="font-bold text-[17px] text-[#1B211D]">{bus.name}</span>
                        {bus.isPremium ? (
                          <span className="bg-[#FFF1E4] text-[#D65F0C] rounded-full px-2.5 py-0.5 text-[11px] font-bold">
                            PREMIUM WHITE-LABEL
                          </span>
                        ) : (
                          <span className="bg-emerald-100 text-[#0F4C2E] rounded-full px-2.5 py-0.5 text-[11px] font-bold">
                            BASIS-SIEGEL (KOSTENLOS)
                          </span>
                        )}
                      </div>
                      <div className="text-[13.5px] text-[#5F6B63] flex items-center gap-3">
                        <span>{bus.category} {bus.district ? `· ${bus.district}` : ''}</span>
                        <span>·</span>
                        <span className="text-[#F2761B] font-bold">{avg} ★ ({revCount} Bewertungen)</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => { setGeneratorBusiness(bus); setIsGeneratorOpen(true); }}
                        className="bg-[#0F4C2E] hover:bg-[#06301C] text-white border-none rounded-md px-4 py-2.5 text-[14px] font-semibold cursor-pointer transition-colors shadow-sm inline-flex items-center gap-2"
                      >
                        <span>⚡ Widget & Code konfigurieren</span>
                      </button>
                    </div>
                  </div>
                );
              })}

              {allowedBusinesses.length === 0 && (
                <div className="border border-dashed border-[#D8D2C8] rounded-md p-8 text-center text-[#8A928B]">
                  Keine Unternehmen zugeordnet.
                </div>
              )}
            </div>
          </div>

        ) : activeTab === 'news' ? (
          <NewsAdminPanel theme={theme} activeThemeKey={activeThemeKey} />
        ) : activeTab === 'reviews' ? (
          <div className="bg-white border border-[#EDE8E0] rounded-lg p-6 shadow-[0_10px_30px_rgba(27,33,29,0.06)]">
            <h2 className="font-display text-[21px] font-bold m-0 mb-[16px]">Offene Bewertungen</h2>
            
            {allowedBusinesses.flatMap((b: Business) => (b.reviews || []).filter(r => r.status === 'pending').map(r => ({ ...r, businessId: b.id, businessName: b.name }))).length > 0 ? (
              <div className="grid gap-[10px] mb-[30px]">
                {allowedBusinesses.flatMap((b: Business) => (b.reviews || []).filter(r => r.status === 'pending').map(r => ({ ...r, businessId: b.id, businessName: b.name }))).map((review) => (
                  <div key={review.id} className="border border-[#EDE8E0] rounded-md p-4">
                    <div className="flex justify-between gap-[12px] items-center">
                      <div className="font-semibold text-[15px]">{review.businessName}</div>
                      <div className="text-[#F2761B] tracking-[2px]">{'★'.repeat(review.rating)}{'☆'.repeat(5-review.rating)}</div>
                    </div>
                    <div className="text-[13px] text-[#8A928B] mt-[2px]">{review.authorName} · {review.createdAt ? new Date(review.createdAt).toLocaleDateString('de-DE') : ''}</div>
                    <p className="my-[10px] text-[15px] text-[#4A544D] leading-[1.6]">{review.text}</p>
                    <div className="flex gap-[8px]">
                      <button 
                        onClick={() => {
                          updateBusinessInFirestore(review.businessId, b => {
                            return { ...b, reviews: (b.reviews || []).map(r => r.id === review.id ? { ...r, status: 'approved' } : r) };
                          });
                        }}
                        className="bg-[#0F4C2E] text-white border-none rounded-md px-4 py-2 text-[13.5px] font-semibold cursor-pointer hover:bg-[#06301C] transition-colors"
                      >
                        Freigeben
                      </button>
                      <button 
                        onClick={() => {
                          updateBusinessInFirestore(review.businessId, b => {
                            return { ...b, reviews: (b.reviews || []).filter(r => r.id !== review.id) };
                          });
                        }}
                        className="bg-[#FBEAE7] text-[#C0392B] border-none rounded-md px-4 py-2 text-[13.5px] font-semibold cursor-pointer hover:bg-[#FADBD5]"
                      >
                        Ablehnen
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="border border-dashed border-[#D8D2C8] rounded-md p-6 text-center text-[#8A928B] mb-[30px]">
                Keine offenen Bewertungen.
              </div>
            )}

            <h2 className="font-display text-[21px] font-bold m-0 mb-[16px]">Freigegebene Bewertungen</h2>
            {allowedBusinesses.flatMap((b: Business) => (b.reviews || []).filter(r => r.status === 'approved').map(r => ({ ...r, businessId: b.id, businessName: b.name, isPremium: b.isPremium }))).length > 0 ? (
              <div className="grid gap-[10px]">
                {allowedBusinesses.flatMap((b: Business) => (b.reviews || []).filter(r => r.status === 'approved').map(r => ({ ...r, businessId: b.id, businessName: b.name, isPremium: b.isPremium }))).map((review) => (
                  <div key={review.id} className="border border-[#EDE8E0] rounded-md p-4">
                    <div className="flex justify-between gap-[12px] items-center">
                      <div className="font-semibold text-[15px]">{review.businessName}</div>
                      <div className="text-[#F2761B] tracking-[2px]">{'★'.repeat(review.rating)}{'☆'.repeat(5-review.rating)}</div>
                    </div>
                    <p className="my-[8px] text-[15px] text-[#4A544D] leading-[1.6]">{review.text}</p>
                    
                    {review.ownerReply && (
                      <div className="mt-2 pl-4 border-l-2 border-[#E7E2DA] text-[14px] text-[#5F6B63] italic">
                        <strong>Antwort:</strong> {review.ownerReply}
                      </div>
                    )}

                    <div className="mt-[12px] flex flex-wrap gap-[8px] items-center">
                      <button 
                        onClick={() => {
                          if (!review.isPremium) {
                            alert('Diese Funktion ist nur im Premium-Paket verfügbar. Bitte rüsten Sie auf Premium auf, um auf Kundenbewertungen zu antworten.');
                            return;
                          }
                          const reply = window.prompt("Ihre Antwort:", review.ownerReply || "");
                          if (reply !== null) {
                            updateBusinessInFirestore(review.businessId, b => {
                              return { ...b, reviews: (b.reviews || []).map(r => r.id === review.id ? { ...r, ownerReply: reply } : r) };
                            });
                          }
                        }}
                        className={`border-none rounded-md px-3.5 py-2 text-[13px] font-semibold cursor-pointer transition-colors ${review.isPremium ? 'bg-[#F3F0EA] hover:bg-[#EAE5DB]' : 'bg-[#FAF8F5] text-[#A3ABA5]'}`}
                        title={!review.isPremium ? 'Nur für Premium-Kunden' : ''}
                      >
                        Antworten {!review.isPremium && '🔒'}
                      </button>
                      <button 
                        onClick={() => {
                          if (window.confirm("Bewertung wirklich löschen?")) {
                            updateBusinessInFirestore(review.businessId, b => {
                              return { ...b, reviews: (b.reviews || []).filter(r => r.id !== review.id) };
                            });
                          }
                        }}
                        className="bg-[#FBEAE7] text-[#C0392B] border-none rounded-md px-3.5 py-2 text-[13px] font-semibold cursor-pointer hover:bg-[#FADBD5]"
                      >
                        Entfernen
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="border border-dashed border-[#D8D2C8] rounded-md p-6 text-center text-[#8A928B]">
                Noch keine freigegebenen Bewertungen.
              </div>
            )}
          </div>
        ) : activeTab === 'abrechnung' ? (
          <AbrechnungAdminPanel 
            isAdmin={isAdmin} 
            currentUser={currentUser} 
            allowedBusinesses={allowedBusinesses} 
            businesses={businesses} 
            setBusinesses={setBusinesses} 
          />
        
        ) : activeTab === 'pricing' ? (
          <AdminPricingManager 
            theme={theme}
            pricingSettings={pricingSettings}
            onUpdatePricing={(newPricing) => setPricingSettings(newPricing)}
          />
        ) : activeTab === 'design' ? (
          <AdminDesignManager 
            designSettings={designSettings} 
            setDesignSettings={setDesignSettings} 
            theme={theme} 
            activeThemeKey={activeThemeKey} 
          />
        ) : activeTab === 'werbung' ? (
          <AdminAdsManager ads={ads} setAds={setAds} businesses={businesses} currentUser={currentUser} />
        ) : activeTab === 'redirects' ? (
          <RedirectsAdminPanel theme={theme} activeThemeKey={activeThemeKey} />
        ) : activeTab === 'scripts' ? (
          <ScriptManager theme={theme} activeThemeKey={activeThemeKey} />
        ) : (
          <SeoAdminPanel theme={theme} activeThemeKey={activeThemeKey} seoSettings={seoSettings} setSeoSettings={setSeoSettings} businesses={businesses} />
        )}

        {generatorBusiness && (
          <WidgetGeneratorModal
            business={generatorBusiness}
            isOpen={isGeneratorOpen}
            onClose={() => setIsGeneratorOpen(false)}
            onUpgrade={() => {
              setIsGeneratorOpen(false);
              window.open('/preise', '_blank');
            }}
          />
        )}
      </main>
  );
}

function SeoAdminPanel({ theme, activeThemeKey, seoSettings, setSeoSettings, businesses }: any) {
  const { t } = useTranslation();

  const [formData, setFormData] = useState<SeoSettings>(seoSettings);
  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSeoSettings(formData);
    localStorage.setItem('seoSettings', JSON.stringify(formData));
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const inputClass = `w-full px-4 py-3 border focus:outline-none focus:ring-2 focus:border-orange-500 focus:ring-orange-500/20 transition-all bg-white ${theme.cardBorder} ${theme.textBase} ${activeThemeKey === 'modern' ? 'rounded-none' : 'rounded-md shadow-sm'}`;
  const labelClass = `block text-sm font-medium mb-1.5 ${theme.textBase}`;

  return (
    <div className={`w-full max-w-2xl mx-auto p-6 md:p-8 border ${theme.cardBg} ${theme.cardBorder} ${theme.cardShadow} ${activeThemeKey === 'modern' ? 'rounded-none' : 'rounded-xl'}`}>
      <h3 className="text-xl font-bold mb-6">SEO & Sitemap Einstellungen</h3>
      
      {isSaved && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-md">
          Einstellungen für SEO erfolgreich gespeichert!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className={labelClass}>Seiten Titel (Meta Title) *</label>
          <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className={inputClass} placeholder="Mein Unternehmens-Verzeichnis" />
        </div>

        <div>
          <label className={labelClass}>Seiten Beschreibung (Meta Description) *</label>
          <textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className={inputClass} rows={3} placeholder="Kurze SEO-Beschreibung der Seite..." />
        </div>

        <div>
          <label className={labelClass}>Basis-URL der Website *</label>
          <input required type="url" value={formData.baseUrl} onChange={e => setFormData({...formData, baseUrl: e.target.value})} className={inputClass} placeholder="https://mein-verzeichnis.de" />
          <p className="text-xs mt-1.5 opacity-70">Wird für die Generierung der korrekten Sitemap benötigt.</p>
        </div>

        <div>
           <label className={labelClass}>Google Site Verification <span className="opacity-60 font-normal">(Optional)</span></label>
           <input type="text" value={formData.googleSiteVerification || ''} onChange={e => setFormData({...formData, googleSiteVerification: e.target.value})} className={inputClass} placeholder="z.B. ABcDefGH..." />
           <p className="text-xs mt-1.5 opacity-70">Fügt den HTML-Meta-Tag für die Search Console-Inhaberschaft hinzu. (Code aus dem content-Attribut eingeben).</p>
        </div>

        <div>
           <label className={labelClass}>Google Analytics 4 Mess-ID <span className="opacity-60 font-normal">(z. B. G-XXXXXXXXXX)</span></label>
           <input type="text" value={formData.googleAnalyticsId || ''} onChange={e => setFormData({...formData, googleAnalyticsId: e.target.value.trim()})} className={inputClass} placeholder="z.B. G-302481363 oder G-MXFC2V1GXZ" />
           <p className="text-xs mt-1.5 opacity-70">Geben Sie hier Ihre GA4 Mess-ID ein (zu finden in Google Analytics unter <em>Verwaltung &rarr; Datenstreams &rarr; Web-Stream</em>).</p>
        </div>

        <div className="pt-4 pb-8 border-b border-black/10">
          <button type="submit" className={`px-6 py-2 font-medium w-full md:w-auto transition-colors ${theme.primaryBtn} ${activeThemeKey === 'modern' ? 'rounded-none' : 'rounded-md'}`}>
            SEO & Analytics Einstellungen speichern
          </button>
        </div>
      </form>

      <div className="pt-6">
        <h4 className="font-bold mb-3 flex items-center gap-2"><MapPin className="w-5 h-5 text-orange-500" /> Google Search Console</h4>
        <p className="text-sm opacity-80 mb-5 leading-relaxed">
          Geben Sie oben Ihren Verifizierungs-Code ein (wird automatisch als Meta-Tag gesetzt). Ihre <strong>sitemap.xml</strong> wird automatisch im Hintergrund generiert und ist <a href="/sitemap.xml" target="_blank" className="underline hover:text-orange-500">hier (/sitemap.xml) erreichbar</a>.
        </p>
      </div>
    </div>
  );
}

function AbrechnungAdminPanel({ isAdmin, currentUser, allowedBusinesses, businesses, setBusinesses }: any) {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loadingInvoices, setLoadingInvoices] = useState(true);

  useEffect(() => {
    async function loadInvoices() {
      try {
        setLoadingInvoices(true);
        const snap = await getDocs(collection(db, 'invoices'));
        const list: any[] = [];
        snap.forEach(docSnap => {
          list.push({ id: docSnap.id, ...docSnap.data() });
        });
        list.sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime());
        
        if (isAdmin) {
          setInvoices(list);
        } else {
          const userSubIds = allowedBusinesses.map((b: Business) => (b as any).stripeSubscriptionId).filter(Boolean);
          const filtered = list.filter(inv => 
            (inv.customerEmail && currentUser?.email && inv.customerEmail.toLowerCase() === currentUser.email.toLowerCase()) ||
            userSubIds.includes(inv.subscriptionId)
          );
          setInvoices(filtered);
        }
      } catch (e) {
        console.error("Error loading invoices", e);
      } finally {
        setLoadingInvoices(false);
      }
    }
    loadInvoices();
  }, [isAdmin, currentUser, allowedBusinesses]);

  const handleCancelSubscription = async (bus: Business) => {
    if (confirm(`Möchten Sie das Abonnement für "${bus.name}" wirklich kündigen? Es läuft dann noch bis zum Ende der aktuellen Abrechnungsperiode weiter.`)) {
      if (!(bus as any).stripeSubscriptionId) {
        const docRef = doc(db, 'businesses', bus.id);
        await updateDoc(docRef, { isPremium: false, subscriptionStatus: 'canceled' });
        setBusinesses(businesses.map((b: Business) => b.id === bus.id ? { ...b, isPremium: false, subscriptionStatus: 'canceled' } : b));
        alert("Erfolgreich gekündigt (Manuelles Downgrade).");
        return;
      }

      try {
        const res = await fetch('/api/cancel-subscription', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ subscriptionId: (bus as any).stripeSubscriptionId })
        });
        const data = await res.json();
        if (data.success) {
          const docRef = doc(db, 'businesses', bus.id);
          await updateDoc(docRef, { cancelAtPeriodEnd: true, cancelAt: data.cancelAt, subscriptionStatus: 'canceling' });
          setBusinesses(businesses.map((b: Business) => b.id === bus.id ? { ...b, cancelAtPeriodEnd: true, cancelAt: data.cancelAt, subscriptionStatus: 'canceling' } : b));
          alert(data.message);
        } else {
          alert("Fehler bei der Kündigung: " + (data.error || "Unbekannter Fehler"));
        }
      } catch (err) {
        alert("Fehler bei der Verbindung zum Server.");
      }
    }
  };

  return (
    <div className="bg-white border border-[#EDE8E0] rounded-lg p-6 shadow-[0_10px_30px_rgba(27,33,29,0.06)]">
      {isAdmin ? (
        <>
          <div className="flex gap-[18px] flex-wrap mb-[24px]">
            <div className="bg-[#FFF8F1] border border-[#FBD9BC] rounded-md px-5 py-4 flex-1 min-w-[200px]">
              <div className="text-[13px] text-[#96551F]">Premium-Kunden</div>
              <div className="font-display text-[32px] font-bold text-[#D65F0C] my-[4px]">
                {businesses.filter((b: Business) => b.isPremium).length}
              </div>
            </div>
            <div className="bg-[#E8F1EB] border border-[#C5DFCE] rounded-md px-5 py-4 flex-1 min-w-[200px]">
              <div className="text-[13px] text-[#0F4C2E]">Generierte Rechnungen</div>
              <div className="font-display text-[32px] font-bold text-[#0F4C2E] my-[4px]">
                {invoices.length}
              </div>
            </div>
          </div>
          
          <h2 className="font-display text-[21px] font-bold m-0 mb-[16px]">Alle Rechnungen (Admin-Ansicht)</h2>
          
          {loadingInvoices ? (
            <div className="py-6 text-center text-[#5F6B63]">Rechnungen werden geladen...</div>
          ) : invoices.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[14px] border-collapse">
                <thead>
                  <tr className="border-b border-[#EDE8E0] text-[#5F6B63]">
                    <th className="py-3 px-4 font-semibold">Datum</th>
                    <th className="py-3 px-4 font-semibold">Kunde / E-Mail</th>
                    <th className="py-3 px-4 font-semibold">Betrag</th>
                    <th className="py-3 px-4 font-semibold">Status</th>
                    <th className="py-3 px-4 font-semibold text-right">PDF</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((inv) => (
                    <tr key={inv.id} className="border-b border-[#EDE8E0] hover:bg-[#FAF8F5]">
                      <td className="py-3 px-4 font-medium">{inv.date ? new Date(inv.date).toLocaleDateString('de-DE') : '-'}</td>
                      <td className="py-3 px-4">{inv.customerEmail || inv.customerId || '-'}</td>
                      <td className="py-3 px-4 font-bold text-[#0F4C2E]">{Number(inv.amount || 0).toFixed(2).replace('.', ',')} €</td>
                      <td className="py-3 px-4"><span className="bg-[#E8F1EB] text-[#0F4C2E] px-2.5 py-1 rounded text-xs font-semibold">Bezahlt</span></td>
                      <td className="py-3 px-4 text-right">
                        {inv.pdfUrl ? (
                          <a href={inv.pdfUrl} target="_blank" rel="noopener noreferrer" className="text-[#F2761B] hover:underline font-semibold">
                            Download
                          </a>
                        ) : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="border border-dashed border-[#D8D2C8] rounded-md p-6 text-center text-[#8A928B]">
              Noch keine Rechnungen in der Datenbank vorhanden.
            </div>
          )}
        </>
      ) : (
        <>
          <h2 className="font-display text-[21px] font-bold m-0 mb-[16px]">Ihr Abonnement</h2>
          {allowedBusinesses.filter((b: Business) => b.isPremium).length > 0 ? (
            <div>
              {allowedBusinesses.filter((b: Business) => b.isPremium).map((bus: Business) => (
                <div key={bus.id} className="border border-[#EDE8E0] rounded-md p-5 mb-5 bg-[#FAF8F5]">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="font-bold text-[18px] text-[#0F4C2E]">{bus.name}</div>
                      <div className="text-[14px] text-[#5F6B63]">
                        Premium-Eintrag {(bus as any).cancelAtPeriodEnd ? '(Läuft zum Periodenende aus)' : '(Aktiv)'}
                      </div>
                    </div>
                    {!(bus as any).cancelAtPeriodEnd && (
                      <button 
                        onClick={() => handleCancelSubscription(bus)}
                        className="bg-white border border-[#D8D2C8] text-[#C0392B] px-3.5 py-1.5 rounded-md text-[13px] font-semibold hover:border-[#C0392B] transition-colors cursor-pointer"
                      >
                        Abo kündigen
                      </button>
                    )}
                  </div>
                  <div className="text-[13px] text-[#4A544D] bg-[#E8F1EB] p-3 rounded-md">
                    <strong>Hinweis:</strong> Die Kündigungsfrist beträgt 14 Tage zum Ende der jeweiligen Vertragslaufzeit. Jahresabonnements gehen bei nicht fristgerechter Kündigung automatisch in ein monatlich kündbares Abonnement zum regulären Monatspreis über.
                  </div>
                </div>
              ))}

              <h2 className="font-display text-[21px] font-bold m-0 mb-[16px]">Ihre Rechnungen</h2>
              <p className="text-[14px] text-[#5F6B63] mb-4">
                Ihre Rechnungen werden automatisch von Stripe generiert und nach jeder erfolgreichen Zahlung hier bereitgestellt.
              </p>
              
              {loadingInvoices ? (
                <div className="py-6 text-center text-[#5F6B63]">Rechnungen werden geladen...</div>
              ) : invoices.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-[14px] border-collapse">
                    <thead>
                      <tr className="border-b border-[#EDE8E0] text-[#5F6B63]">
                        <th className="py-3 px-4 font-semibold">Datum</th>
                        <th className="py-3 px-4 font-semibold">Betrag</th>
                        <th className="py-3 px-4 font-semibold">Status</th>
                        <th className="py-3 px-4 font-semibold text-right">Rechnung</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoices.map((inv) => (
                        <tr key={inv.id} className="border-b border-[#EDE8E0] hover:bg-[#FAF8F5]">
                          <td className="py-3 px-4 font-medium">{inv.date ? new Date(inv.date).toLocaleDateString('de-DE') : '-'}</td>
                          <td className="py-3 px-4 font-bold text-[#0F4C2E]">{Number(inv.amount || 0).toFixed(2).replace('.', ',')} €</td>
                          <td className="py-3 px-4"><span className="bg-[#E8F1EB] text-[#0F4C2E] px-2.5 py-1 rounded text-xs font-semibold">Bezahlt</span></td>
                          <td className="py-3 px-4 text-right">
                            {inv.pdfUrl ? (
                              <a href={inv.pdfUrl} target="_blank" rel="noopener noreferrer" className="text-[#F2761B] hover:underline font-semibold">
                                PDF herunterladen
                              </a>
                            ) : '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="border border-dashed border-[#D8D2C8] rounded-md p-6 text-center text-[#8A928B]">
                  Noch keine Rechnungen für diesen Account vorhanden.
                </div>
              )}
            </div>
          ) : (
            <div className="border border-dashed border-[#D8D2C8] rounded-md p-6 text-center text-[#8A928B]">
              Sie haben aktuell kein aktives Premium-Abonnement.
            </div>
          )}
        </>
      )}
    </div>
  );
}
