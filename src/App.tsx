import React, { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Menu, X,  MapPin, Phone, Globe, ChevronRight, ChevronDown, Plus, ArrowLeft, Image as ImageIcon, Trash2, Edit2, LogIn, LogOut, Map as MapIcon, List as ListIcon, Star, Lock, Clock, Settings, SearchCode, BadgeCheck, Sun, Moon, Briefcase, CreditCard, FileText , User, Bed, Utensils, Hammer, ShoppingBag, Code2 } from 'lucide-react';
import { categories, themes, businesses as initialBusinesses } from './data';
import { ThemeKey, CategoryGroup, Business, SeoSettings } from './types';
import Logo from './components/Logo';
import NotFound from './components/NotFound';
import BusinessDetail from './components/BusinessDetail';
import { isOpenNow } from './utils';
import ReviewForm from './components/ReviewForm';
import { Review } from './types';
import { useAuth } from './AuthContext';
import Login from './components/Login';

// Lazy-load heavy components that most visitors never see (code-splitting)
const DirectoryMap = React.lazy(() => import('./components/DirectoryMap'));
const Impressum = React.lazy(() => import('./components/Impressum'));
const AGB = React.lazy(() => import('./components/AGB'));
const SubmitBusiness = React.lazy(() => import('./components/SubmitBusiness'));
const PricingTable = React.lazy(() => import('./components/PricingTable'));
const JobsBoard = React.lazy(() => import('./components/JobsBoard'));
const AdminPanel = React.lazy(() => import('./components/AdminPanel'));
const ScriptManager = React.lazy(() => import('./components/ScriptManager'));
const Datenschutz = React.lazy(() => import('./components/Datenschutz'));
import { db, auth } from './firebase';
import { collection, getDocs, doc, setDoc, updateDoc, deleteDoc, addDoc } from 'firebase/firestore';
import { useTranslation } from './i18n';
import { getSeoContent } from './utils/seoContent';
import { signOut } from 'firebase/auth';



class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error("React ErrorBoundary caught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full max-w-xl mx-auto p-8 my-10 bg-white border border-red-200 rounded-xl text-center shadow-lg">
          <h2 className="text-xl font-bold text-red-700 mb-2">Ein Anzeigefehler ist aufgetreten</h2>
          <p className="text-sm text-gray-600 mb-4 font-mono bg-red-50 p-3 rounded text-left overflow-auto max-h-32">
            {this.state.error?.message || 'Laufzeitfehler'}
          </p>
          <button 
            onClick={() => { this.setState({ hasError: false, error: null }); window.location.reload(); }}
            className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg transition-colors"
          >
            Seite neu laden
          </button>
        </div>
      );
    }
    return this.props.children;
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

  if (typeof window !== 'undefined') {
    const path = window.location.pathname;
    const pathParts = path.split('/').filter(Boolean);
    if (pathParts[0] === 'nl') { pathParts.shift(); }
    
    if (pathParts[0]) {
      const decodedPart1 = decodeURIComponent(pathParts[0]);
      if (decodedPart1.toLowerCase() === 'alle-unternehmen') {
        initialAllMode = true;
      } else if (decodedPart1.toLowerCase() === 'stellenangebote' || decodedPart1.toLowerCase() === 'jobs') {
        initialJobsMode = true;
        if (pathParts[1]) {
          initialJobsCategory = decodeURIComponent(pathParts[1]);
        }
      } else {
        const catGroup = categories.find(c => c.name.toLowerCase() === decodedPart1.toLowerCase());
        
        if (catGroup) {
          defaultCategory = catGroup.name;
          if (pathParts[1]) {
            const decodedPart2 = decodeURIComponent(pathParts[1]);
            const subCat = catGroup.subcategories.find(s => s.toLowerCase() === decodedPart2.toLowerCase());
            
            if (subCat) {
              defaultCategory = subCat;
              if (pathParts[2]) {
                const decodedPart3 = decodeURIComponent(pathParts[2]);
                const business = initialBusinesses.find(b => b.name.replace(/\s+/g, '-').toLowerCase() === decodedPart3.toLowerCase());
                if (business) {
                  defaultSearchQuery = business.name;
                  initialSelectedBusiness = business;
                } else {
                  initialNotFound = true;
                }
              }
            } else {
              // maybe business?
              const business = initialBusinesses.find(b => b.name.replace(/\s+/g, '-').toLowerCase() === decodedPart2.toLowerCase() && b.category === catGroup.name);
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

  const [activeLocation, setActiveLocation] = useState<string>('Alle');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [isAllMode, setIsAllMode] = useState(initialAllMode);
  const [expandedGroups, setExpandedGroups] = useState<string[]>([]);
  const [isMobileCategoriesOpen, setIsMobileCategoriesOpen] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(initialSelectedBusiness);
  
  const getPath = (p: string) => {
    const base = lang === 'nl' ? '/nl' : '';
    if (!p || p === '/') return base || '/';
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
             if (eintrag) newUrl += `/${encodeURIComponent(eintrag)}`;
           } else if (eintrag) {
             newUrl += `/${encodeURIComponent(eintrag)}`;
           }
        } else if (eintrag) {
           // We might not have category, but we have entry. 
           // Can't reconstruct full hierarchy without searching businesses.
           // Leaving it at / if no category is found is okay, or we can search for the business.
           const foundBus = initialBusinesses.find(b => b.name.replace(/\s+/g, '-').toLowerCase() === eintrag);
           if (foundBus) {
             newUrl = `/${encodeURIComponent(foundBus.category)}${foundBus.subcategory ? `/${encodeURIComponent(foundBus.subcategory)}` : ''}/${encodeURIComponent(eintrag)}`;
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
        if (p1 === 'alle-unternehmen') {
          setIsAllMode(true);
        } else if (p1 === 'stellenangebote' || p1 === 'jobs') {
          setIsJobsMode(true);
        } else if (p1 === 'preise') {
          setIsPricingMode(true);
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
  const [isImpressumMode, setIsImpressumMode] = useState(false);
  const [isAGBMode, setIsAGBMode] = useState(false);
  const [isDatenschutzMode, setIsDatenschutzMode] = useState(false);
  const [isSubmitMode, setIsSubmitMode] = useState(false);
  const [isPricingMode, setIsPricingMode] = useState(false);
  const [isJobsMode, setIsJobsMode] = useState(initialJobsMode);
  const [jobsCategory, setJobsCategory] = useState<string | null>(initialJobsCategory);
  const [isLoading, setIsLoading] = useState(false);
  const [reviewsEnabled, setReviewsEnabled] = useState(localStorage.getItem('premium_reviews_enabled') === 'true');
  const [token, setToken] = useState<string | null>(localStorage.getItem('admin_token'));
  const [seoSettings, setSeoSettings] = useState<SeoSettings>({
    title: 'Winterberger Unternehmen',
    description: 'Das umfassende Verzeichnis für alle Unternehmen, Dienstleister, Handwerker und Freizeiteinrichtungen in Winterberg und den umliegenden Ortsteilen.',
    baseUrl: 'https://winterberg.sichtbar-online.com',
    googleSiteVerification: 'egCnwQfOIztQ10Cv0RUn3psnTm0tyaOUmOrGdpv2Z4c'
  });

  const theme = themes[activeThemeKey];

  useEffect(() => {
    const savedSeo = localStorage.getItem('seoSettings');
    if (savedSeo) {
      try {
        setSeoSettings(JSON.parse(savedSeo));
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    let currentTitle = seoSettings.title;
    let currentDesc = seoSettings.description;

    const matchedBusiness = businesses.find(b => b.name.toLowerCase() === searchQuery.toLowerCase());
    
    if (isJobsMode) {
      if (jobsCategory) {
        currentTitle = `Offene Stellen ${jobsCategory} in Winterberg | ${seoSettings.title}`;
        currentDesc = `Finden Sie aktuelle Jobangebote und offene Stellen für ${jobsCategory} in Winterberg und Umgebung. Jetzt bewerben!`;
      } else {
        currentTitle = `Offene Stellen in Winterberg - Alle Jobangebote | ${seoSettings.title}`;
        currentDesc = `Übersicht aller offenen Stellen und Jobs bei Unternehmen in Winterberg und den Ortsteilen. Starten Sie Ihre Karriere im Sauerland.`;
      }
    } else if (matchedBusiness) {
      const city = matchedBusiness.district || 'Winterberg';
      currentTitle = `${matchedBusiness.name} in ${city} | ${seoSettings.title}`;
      const shortDesc = matchedBusiness.description ? matchedBusiness.description.substring(0, 100).trim() + '...' : '';
      currentDesc = `Alle Infos zu ${matchedBusiness.name} in ${city}. ✓ Kontaktdaten ✓ Öffnungszeiten ✓ Adresse. ${shortDesc}`;
    } else if (activeCategory !== 'Alle') {
      currentTitle = `${activeCategory} in Winterberg - Alle Unternehmen im Überblick | ${seoSettings.title}`;
      currentDesc = `Finden Sie schnell und einfach Unternehmen aus dem Bereich ${activeCategory} in Winterberg und den Ortsteilen. Übersicht aller Adressen, Kontaktinfos und Öffnungszeiten.`;
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

    // Canonical link
    let canonicalUrl = seoSettings.baseUrl || 'https://winterberg.sichtbar-online.com';
    if (isJobsMode) {
      if (jobsCategory) {
        canonicalUrl = `${canonicalUrl}/jobs/${encodeURIComponent(jobsCategory)}`;
      } else {
        canonicalUrl = `${canonicalUrl}/jobs`;
      }
    } else if (matchedBusiness) {
      canonicalUrl = `${canonicalUrl}/${encodeURIComponent(matchedBusiness.category)}${matchedBusiness.subcategory ? `/${encodeURIComponent(matchedBusiness.subcategory)}` : ''}/${encodeURIComponent(matchedBusiness.name.replace(/\s+/g, '-').toLowerCase())}`;
    } else if (activeCategory !== 'Alle') {
      let isSub = false;
      let parentCat = '';
      categories.forEach(c => {
        if (c.subcategories.includes(activeCategory)) {
          isSub = true;
          parentCat = c.name;
        }
      });
      if (isSub) {
        canonicalUrl = `${canonicalUrl}/${encodeURIComponent(parentCat)}/${encodeURIComponent(activeCategory)}`;
      } else {
        canonicalUrl = `${canonicalUrl}/${encodeURIComponent(activeCategory)}`;
      }
    }

    let linkCanonical = document.querySelector('link[rel="canonical"]');
    if (linkCanonical) {
      linkCanonical.setAttribute('href', canonicalUrl);
    } else {
      linkCanonical = document.createElement('link');
      linkCanonical.setAttribute('rel', 'canonical');
      linkCanonical.setAttribute('href', canonicalUrl);
      document.head.appendChild(linkCanonical);
    }
  }, [seoSettings, activeCategory, searchQuery, businesses, isJobsMode, jobsCategory]);

  useEffect(() => {
    loadBusinesses();
  }, []);

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
              merged[idx] = fb;
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

  const extractLocation = (bus: Business) => {
    return bus.district || 'Winterberg';
  };

  const availableLocations = Array.from(new Set(businesses.map(b => extractLocation(b)))).sort();

  const filteredBusinesses = businesses.filter((bus) => {
    if (bus.status === 'pending') return false;
    const matchesCategory = activeCategory === 'Alle' || bus.category === activeCategory || bus.subcategory === activeCategory;
    const matchesSearch = bus.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          bus.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          bus.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (bus.subcategory && bus.subcategory.toLowerCase().includes(searchQuery.toLowerCase()));
    const busLocation = extractLocation(bus);
    const matchesLocation = activeLocation === 'Alle' || busLocation === activeLocation;
    return matchesCategory && matchesSearch && matchesLocation;
  }).sort((a, b) => {
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
            <nav className="hidden md:flex" style={{ gap: '22px', fontSize: '15px', fontWeight: 500, marginLeft: 'auto' }}>
              <a href={getPath('/')} onClick={(e) => { e.preventDefault(); window.history.pushState(null, '', getPath('/')); resetToDirectory(); }} style={{ color: '#0F4C2E', textDecoration: 'none' }} className="hover:text-orange-500 transition-colors">Start</a>
              <a href={getPath('/alle-unternehmen')} onClick={(e) => { e.preventDefault(); window.history.pushState(null, '', getPath('/alle-unternehmen')); resetToDirectory(); setIsAllMode(true); }} style={{ color: '#0F4C2E', textDecoration: 'none' }} className="hover:text-orange-500 transition-colors">Alle Unternehmen</a>
              <a href={getPath('/jobs')} onClick={(e) => { e.preventDefault(); window.history.pushState(null, '', getPath('/jobs')); setIsJobsMode(true); }} style={{ color: '#0F4C2E', textDecoration: 'none' }} className="hover:text-orange-500 transition-colors">Jobs</a>
              <a href={getPath('/preise')} onClick={(e) => { e.preventDefault(); window.history.pushState(null, '', getPath('/preise')); setIsPricingMode(true); }} style={{ color: '#0F4C2E', textDecoration: 'none' }} className="hover:text-orange-500 transition-colors">Preise</a>
              <button 
                onClick={() => { resetToDirectory(); setIsAdminMode(true); window.scrollTo(0, 0); }}
                className="flex items-center justify-center transition-colors ml-2"
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
              style={{ background: '#F2761B', color: '#fff', border: 'none', borderRadius: '999px', padding: '11px 20px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', boxShadow: '0 6px 18px rgba(242,118,27,0.28)', transition: 'background 0.15s, transform 0.15s' }}
            >
              Unternehmen eintragen
            </button>

            {/* Mobile Menu Button */}
            <button className="md:hidden ml-auto text-[#0F4C2E]" onClick={() => setIsMobileCategoriesOpen(!isMobileCategoriesOpen)}>
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </header>

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
            onBack={() => setIsPricingMode(false)}
            onSelect={(plan) => {
              setIsPricingMode(false);
              setIsSubmitMode(true);
              // Future: pass selected plan to SubmitBusiness if we want it pre-selected
            }}
          />
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
            onBack={() => setIsAdminMode(false)}
          />
        ) : (
          <>
            {/* Conditional Claude Home View */}
            {!searchQuery && activeCategory === 'Alle' && activeLocation === 'Alle' && viewMode === 'list' && !isAllMode ? (
              <div className="w-full flex flex-col mb-8">
                <section className="relative text-white w-full" style={{ background: 'linear-gradient(105deg, rgba(6,48,28,0.94) 0%, rgba(15,76,46,0.86) 55%, rgba(15,76,46,0.55) 100%), url(/winterberg-header.webp) center/cover no-repeat' }}>
                  <div className="max-w-[1180px] mx-auto px-6 pt-[80px] pb-[88px]">
                    <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 text-sm font-medium tracking-wide">
                      <span className="w-2 h-2 rounded-full bg-[#F2761B]"></span>
                      Für die Kernstadt und alle 14 Ortsteile
                    </div>
                    <h1 className="font-display text-4xl md:text-6xl font-medium mt-6 mb-4 leading-tight">
                      Das <br className="md:hidden"/>
                      <span className="inline-block relative">
                        <span className="font-extrabold tracking-wide">WINTERBERG</span>
                        <svg viewBox="0 0 200 10" preserveAspectRatio="none" className="w-full h-3 block -mt-1"><path d="M3 7C38 2 78 1 118 4c28 2 52 5 79 1" stroke="#F2761B" strokeWidth="3.4" fill="none" strokeLinecap="round"/></svg>
                      </span>
                      <br className="md:hidden"/> Verzeichnis
                    </h1>
                    <p className="text-lg md:text-xl text-white/90 max-w-2xl mb-4 leading-relaxed">Handwerk, Gastronomie, Einzelhandel, Dienstleistungen, Freizeit und Unterkünfte — aus der Kernstadt und jedem Ortsteil.</p>
                    <p className="text-sm md:text-base text-white/70 max-w-3xl mb-8 leading-relaxed">Finde lokale Anbieter in Winterberg, Züschen, Niedersfeld, Siedlinghausen, Silbach, Neuastenberg, Langewiese, Hoheleye, Mollseifen, Lenneplätze, Elkeringhausen, Grönebach, Hildfeld und Altenfeld.</p>

                    <div className="bg-white rounded-2xl p-3 flex flex-col md:flex-row gap-3 items-center max-w-3xl shadow-2xl">
                      <div className="flex items-center gap-3 w-full md:flex-[2] px-3">
                        <Search className="w-5 h-5 text-gray-400" />
                        <input 
                          placeholder="Unternehmen, Branche oder Leistung" 
                          value={homeSearchInput}
                          onChange={(e) => setHomeSearchInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              setSearchQuery(homeSearchInput);
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }
                          }}
                          className="border-none outline-none text-base w-full py-3 text-gray-900 bg-transparent" 
                        />
                      </div>
                      <select 
                        value={activeLocation} 
                        onChange={(e) => setActiveLocation(e.target.value)}
                        className="w-full md:w-auto md:flex-1 border border-gray-200 rounded-xl px-4 py-3 text-base text-gray-900 bg-gray-50 focus:outline-none focus:border-[#F2761B]"
                      >
                        <option value="Alle">Alle Ortsteile</option>
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
                        className="w-full md:w-auto bg-[#F2761B] hover:bg-[#D65F0C] text-white rounded-xl px-6 py-3 font-semibold transition-colors"
                      >
                        Suchen
                      </button>
                    </div>

                    <div className="flex gap-8 mt-12 flex-wrap">
                      <div><div className="font-display text-4xl font-bold">{businesses.length}</div><div className="text-sm text-white/70 mt-1">Unternehmen</div></div>
                      <div><div className="font-display text-4xl font-bold">{categories.length}</div><div className="text-sm text-white/70 mt-1">Kategorien</div></div>
                      <div><div className="font-display text-4xl font-bold">14</div><div className="text-sm text-white/70 mt-1">Ortsteile</div></div>
                    </div>
                  </div>
                </section>
                
                {/* Claude Home Sections */}
                <div className="max-w-[1180px] mx-auto px-6 pt-[68px] pb-[20px]">
                  <h2 className="font-display text-[34px] font-bold m-0 mb-[6px]">Kategorien</h2>
                  <p className="text-[16px] text-[#5F6B63] m-0 mb-[30px]">Sechs Bereiche, {categories.reduce((acc, cat) => acc + cat.subcategories.length, 0)} Branchen — such dir aus, was du brauchst.</p>
                  
                  <div className="mb-16">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[18px]">
                      {categories.map(cat => (
                        <div 
                          key={cat.name}
                          onClick={() => { setActiveCategory(cat.name); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                          className="bg-white border border-[#EDE8E0] rounded-[20px] p-[26px] cursor-pointer shadow-[0_2px_10px_rgba(27,33,29,0.04)] hover:-translate-y-1 hover:shadow-[0_16px_34px_rgba(27,33,29,0.10)] transition-all"
                        >
                          <div className="flex items-center gap-[14px]">
                            <div className="w-[52px] h-[52px] rounded-[15px] bg-[#E4F0F4] text-[#146C82] flex items-center justify-center shrink-0">
                               {cat.name === 'Dienstleistungen' ? <Briefcase className="w-6 h-6" /> : cat.name === 'Freizeit' ? <Sun className="w-6 h-6" /> : cat.name === 'Hotels & Unterkünfte' ? <Bed className="w-6 h-6" /> : cat.name === 'Einkaufen' ? <ShoppingBag className="w-6 h-6" /> : cat.name === 'Gastronomie' ? <Utensils className="w-6 h-6" /> : <BadgeCheck className="w-6 h-6" />}
                            </div>
                            <div className="flex-1">
                              <div className="font-display text-[21px] font-semibold text-gray-900 leading-tight">{cat.name}</div>
                              <div className="text-[14px] text-[#5F6B63]">{businesses.filter(b => b.category === cat.name || b.subcategory === cat.name).length} Betriebe</div>
                            </div>
                            <ChevronRight className="w-5 h-5 text-[#B9B2A8]" />
                          </div>
                          <div className="mt-[16px] text-[14px] text-[#5F6B63] leading-[1.6]">
                            {cat.subcategories.join(', ')}
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
                          className="bg-[#FAF8F5] border border-[#E7E2DA] rounded-full px-[18px] py-[11px] text-[15px] font-medium text-[#1B211D] cursor-pointer inline-flex items-center gap-[9px] hover:border-[#0F4C2E] transition-colors"
                        >
                          {d}
                          <span className="bg-[#F3F0EA] rounded-full px-[9px] py-[2px] text-[12px] font-semibold text-[#5F6B63]">
                            {businesses.filter(b => (b.district || b.address.split(',')[1]?.trim().split(' ')[1] || 'Winterberg') === d).length}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-baseline justify-between gap-4 flex-wrap mb-[22px]">
                      <h2 className="font-display text-[34px] font-bold m-0 leading-tight">Empfohlene Unternehmen</h2>
                      <a href="#" onClick={(e) => { e.preventDefault(); resetToDirectory(); window.scrollTo({ top: 500, behavior: 'smooth' }); }} className="font-semibold text-[15px] text-[#0F4C2E] hover:text-[#F2761B]">Alle {businesses.length} ansehen →</a>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[18px]">
                      {businesses.filter(b => b.isPremium).slice(0, 6).map(b => (
                        <div 
                          key={b.id}
                          onClick={() => { setSelectedBusiness(b); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                          className="bg-white border border-[#EDE8E0] rounded-[20px] p-[22px] cursor-pointer flex flex-col gap-[12px] shadow-[0_2px_10px_rgba(27,33,29,0.04)] hover:-translate-y-1 hover:shadow-[0_16px_34px_rgba(27,33,29,0.10)] transition-all"
                        >
                          <div className="flex items-start gap-[13px]">
                            <div className="w-[46px] h-[46px] rounded-[14px] bg-[#FAF8F5] text-[#0F4C2E] flex items-center justify-center font-display font-bold text-[15px] shrink-0">
                              {b.name.charAt(0)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-display text-[18px] font-semibold truncate leading-[1.25]">{b.name}</div>
                              <div className="text-[13px] text-[#5F6B63] mt-[3px]">{b.subcategory || 'Andere'} · {b.district || 'Winterberg'}</div>
                            </div>
                            {b.isPremium && (
                              <span className="bg-[#FFF1E4] text-[#D65F0C] rounded-full px-[10px] py-[4px] text-[11px] font-bold uppercase tracking-[0.04em]">Premium</span>
                            )}
                          </div>
                          <p className="text-[14.5px] text-[#4A544D] leading-[1.55] m-0 line-clamp-3">{b.description}</p>
                          <div className="flex items-center gap-[7px] text-[13px] text-[#5F6B63] mt-auto pt-[4px]">
                            <MapPin className="w-[14px] h-[14px]" /> {b.address}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Footer CTA */}
                  <div className="mt-[62px] mb-[14px] bg-gradient-to-br from-[#0F4C2E] to-[#06301C] rounded-[26px] p-8 md:p-[52px] text-white flex flex-col md:flex-row gap-8 items-center justify-between">
                    <div className="max-w-[46ch]">
                      <h2 className="font-display text-[34px] font-bold m-0 mb-[12px]">Ihr Unternehmen fehlt noch?</h2>
                      <p className="text-[17px] leading-[1.6] text-white/85 m-0">
                        Kostenlos eintragen und von Kundinnen und Kunden aus der Region gefunden werden. Mit Premium gibt es Bildergalerie, ausführliches Profil und Top-Platzierung.
                      </p>
                    </div>
                    <div className="flex gap-[12px] flex-wrap">
                      <button type="button" onClick={() => setIsSubmitMode(true)} className="bg-[#F2761B] text-white border-none rounded-full px-[28px] py-[15px] text-[16px] font-semibold cursor-pointer hover:bg-[#D65F0C] transition-colors">Jetzt eintragen</button>
                      <button type="button" onClick={() => setIsPricingMode(true)} className="bg-transparent text-white border border-white/40 rounded-full px-[28px] py-[15px] text-[16px] font-semibold cursor-pointer hover:bg-white/10 transition-colors">Preise ansehen</button>
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
                    <a href={getPath('/')} onClick={(e) => { e.preventDefault(); window.history.pushState(null, '', getPath('/')); resetToDirectory(); }} className="text-white/80 hover:text-white transition-colors">Start</a> / {activeCategory === 'Alle' ? 'Alle Unternehmen' : activeCategory}
                  </div>
                  <h1 className="font-display text-[30px] md:text-[46px] font-bold m-0 mb-2.5">
                    {activeCategory === 'Alle' ? 'Alle Unternehmen' : activeCategory}
                  </h1>
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <p className="m-0 text-[16px] text-white/80">{filteredBusinesses.length} Unternehmen gefunden</p>
                    <div className="flex bg-white/12 rounded-full p-1">
                      <button type="button" onClick={() => setViewMode('list')} className={`border-none rounded-full px-4 py-1.5 text-[13px] font-semibold cursor-pointer ${viewMode === 'list' ? 'bg-white text-[#1B211D]' : 'bg-transparent text-white hover:bg-white/10'}`}>Liste</button>
                      <button type="button" onClick={() => setViewMode('map')} className={`border-none rounded-full px-4 py-1.5 text-[13px] font-semibold cursor-pointer ${viewMode === 'map' ? 'bg-white text-[#1B211D]' : 'bg-transparent text-white hover:bg-white/10'}`}>Karte</button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className={`w-full max-w-[1180px] mx-auto px-6 pt-[28px] pb-[80px] flex flex-col md:flex-row gap-[30px] items-start ${(!searchQuery && activeCategory === 'Alle' && activeLocation === 'Alle' && viewMode === 'list' && !isAllMode) ? 'hidden' : ''}`}>
            {/* Sidebar (Categories) */}
            <aside className="w-full md:w-[270px] shrink-0 mb-6 md:mb-0 bg-white border border-[#EDE8E0] rounded-[20px] p-[22px] md:sticky md:top-[116px]">
              
              <div className="flex items-center gap-[9px] bg-[#FAF8F5] border border-[#E7E2DA] rounded-xl px-3 py-2.5 mb-[22px]">
                <Search className="w-4 h-4 text-[#5F6B63]" />
                <input 
                  placeholder="Suchen…" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="border-none outline-none bg-transparent text-[14px] w-full text-gray-900"
                />
              </div>

              {/* Mobile Toggle Button */}
              <button 
                className="w-full md:hidden flex items-center justify-between p-3 font-display font-bold text-sm bg-gray-50 rounded-xl mb-4"
                onClick={() => setIsMobileCategoriesOpen(!isMobileCategoriesOpen)}
              >
                <span>Filter & Kategorien</span>
                {isMobileCategoriesOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

              <div className={`${isMobileCategoriesOpen ? 'block' : 'hidden md:block'}`}>
                <div className="font-display text-[13px] font-semibold tracking-[0.08em] uppercase text-[#8A928B] mb-[11px]">Kategorie</div>
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
                        className={`text-left border-none rounded-[10px] px-3 py-[9px] text-[14.5px] cursor-pointer flex justify-between gap-2 transition-colors ${isActive ? 'bg-[#0F4C2E] text-white font-semibold' : 'bg-transparent text-[#1B211D] font-medium hover:bg-[#F3F0EA]'}`}
                      >
                        <span>{group.name}</span>
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
                        <div className="font-display text-[13px] font-semibold tracking-[0.08em] uppercase text-[#8A928B] mb-[11px]">Branche</div>
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
                                className={`border rounded-full px-[13px] py-[7px] text-[13px] font-medium cursor-pointer transition-colors ${isSubActive ? 'border-[#0F4C2E] bg-[#0F4C2E] text-white' : 'border-[#E7E2DA] bg-transparent text-[#1B211D] hover:border-[#0F4C2E]'}`}
                              >
                                {sub}
                              </button>
                            );
                          })}
                        </div>
                      </>
                    );
                  }
                  return null;
                })()}

                <div className="font-display text-[13px] font-semibold tracking-[0.08em] uppercase text-[#8A928B] mb-[11px]">Ortsteil</div>
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
                        className={`border rounded-full px-[13px] py-[7px] text-[13px] font-medium cursor-pointer transition-colors ${isDistActive ? 'border-[#0F4C2E] bg-[#0F4C2E] text-white' : 'border-[#E7E2DA] bg-transparent text-[#1B211D] hover:border-[#0F4C2E]'}`}
                      >
                        {d === 'Alle' ? 'Alle Ortsteile' : d}
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
                  className="mt-6 w-full bg-transparent border border-[#E7E2DA] rounded-xl p-[11px] text-[14px] font-medium cursor-pointer text-[#5F6B63] hover:border-[#0F4C2E] hover:text-[#0F4C2E] transition-colors"
                >
                  Filter zurücksetzen
                </button>
              </div>
            </aside>

            {/* Main Area */}
            <div className="flex-1 min-w-0">

              {/* Directory Grid or Map */}
              {isLoading ? (
                <div className={`py-20 text-center ${theme.textMuted}`}>{t("loading")}</div>
              ) : viewMode === 'map' ? (
                <DirectoryMap businesses={filteredBusinesses} onSelectBusiness={(bus) => {
                  window.history.pushState(null, '', getPath(`/${encodeURIComponent(bus.category)}${bus.subcategory ? `/${encodeURIComponent(bus.subcategory)}` : ''}/${encodeURIComponent(bus.name.replace(/\s+/g, '-').toLowerCase())}`));
                  setSelectedBusiness(bus);
                }} />
              ) : (
                <>
                <motion.div 
                  key={`${activeCategory}-${activeLocation}-${searchQuery}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 xl:grid-cols-2 gap-6"
                >
                  {filteredBusinesses.length > 0 ? (
                    filteredBusinesses.map((bus) => (
                      <div 
                        key={bus.id} 
                        onClick={(e) => {
                          e.preventDefault();
                          window.history.pushState(null, '', getPath(`/${encodeURIComponent(bus.category)}${bus.subcategory ? `/${encodeURIComponent(bus.subcategory)}` : ''}/${encodeURIComponent(bus.name.replace(/\s+/g, '-').toLowerCase())}`));
                          setSearchQuery(bus.name);
                          setSelectedBusiness(bus);
                        }}
                        className={`bg-white border rounded-[20px] p-[24px] cursor-pointer transition-all duration-200 shadow-[0_2px_10px_rgba(27,33,29,0.04)] hover:-translate-y-[4px] hover:shadow-[0_16px_34px_rgba(27,33,29,0.10)] ${bus.isPremium ? 'border-[#D65F0C]' : 'border-[#EDE8E0]'}`}
                      >
                        <div className="flex items-start gap-[16px] mb-[16px]">
                          {bus.logoUrl ? (
                            <img src={bus.logoUrl} alt={bus.name} className="w-[48px] h-[48px] rounded-[14px] object-cover shrink-0 border border-[#EDE8E0]" />
                          ) : (
                            <div className={`w-[48px] h-[48px] rounded-[14px] flex items-center justify-center font-display font-bold text-[16px] shrink-0 ${bus.isPremium ? 'bg-[#F2761B] text-white' : 'bg-[#FAF8F5] text-[#F2761B]'}`}>
                              {bus.name.split(' ').filter(Boolean).map(n => n[0]).slice(0, 2).join('').toUpperCase() || bus.name.substring(0, 2).toUpperCase()}
                            </div>
                          )}
                          <div>
                            <div className="font-display text-[17.5px] font-semibold leading-[1.25] mb-[4px] text-[#1B211D]">{bus.name}</div>
                            <div className="text-[13.5px] text-[#8A928B]">{bus.category} · {bus.district || 'Winterberg'}</div>
                          </div>
                        </div>
                        <div className="text-[15px] text-[#5F6B63] leading-[1.5] mb-[24px] min-h-[44px]">
                          {bus.description && bus.description.length > 90 
                            ? bus.description.substring(0, 90) + '…' 
                            : (bus.description || '')}
                        </div>
                        <div className="flex items-center gap-[8px] text-[13.5px] text-[#8A928B]">
                          <MapPin className="w-[14px] h-[14px]" />
                          {bus.address}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className={`col-span-full py-16 text-center border-dashed border-2 ${activeThemeKey === 'modern' ? 'rounded-none' : 'rounded-xl'} ${theme.cardBorder} ${theme.textMuted}`}>
                      <p className="text-lg font-medium">{t("noBusinessesFound")}</p>
                      <p className="text-sm mt-1">{t("adjustSearchCriteria")}</p>
                    </div>
                  )}
                </motion.div>
                
                {/* SEO Text Footer */}
                {(() => {
                  const seoData = getSeoContent(activeCategory, activeLocation, filteredBusinesses.length);
                  return (
                    <section className="mt-[34px] bg-white border border-[#EDE8E0] rounded-[22px] p-[32px]">
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
                              <details key={idx} className="bg-[#FAF8F5] border border-[#EDE8E0] rounded-[16px] overflow-hidden group">
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

                      <div className="mt-[32px] pt-[20px] border-t border-[#F3F0EA] flex gap-[14px] items-center flex-wrap">
                        <span className="text-[15px] text-[#4A544D]">Ihr Betrieb fehlt in dieser Kategorie?</span>
                        <button type="button" onClick={() => { setIsSubmitMode(true); window.scrollTo(0,0); }} className="bg-[#F2761B] text-white border-none rounded-full px-[20px] py-[11px] text-[14.5px] font-semibold cursor-pointer hover:bg-[#D65F0C] transition-colors">
                          Kostenlos eintragen
                        </button>
                      </div>
                    </section>
                  );
                })()}
                </>
              )}
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
            <span className="font-display font-bold text-lg">Branchen</span>
            <button 
              onClick={() => setIsMobileCategoriesOpen(false)} 
              className="p-2 -mr-2 transition-colors hover:bg-black/5 dark:hover:bg-white/5 rounded-full"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <nav className="flex flex-col gap-1 p-4">
            <a
              href={getPath("/")}
              onClick={(e) => {
                e.preventDefault();
                window.history.pushState(null, '', getPath('/'));
                setActiveCategory('Alle');
                resetToDirectory();
                setIsMobileCategoriesOpen(false);
              }}
              className={`block w-full text-left px-4 py-3 text-base font-medium transition-colors ${
                activeCategory === 'Alle' ? theme.categoryTagActive : theme.categoryTagInactive
              } ${activeThemeKey === 'modern' ? 'rounded-none' : 'rounded-md'}`}
            >
              Alle anzeigen
            </a>
            <div className="border-b-2 border-dotted border-black/10 my-3"></div>
            {categories.map((group) => {
              const isExpanded = expandedGroups.includes(group.name);
              return (
                <div key={t(group.name)} className="flex flex-col gap-1 mb-2 last:mb-0">
                  <div className="flex items-center gap-1">
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
                      }}
                      className={`flex-1 block text-left px-4 py-3 text-base font-medium transition-colors ${
                        activeCategory === group.name ? theme.categoryTagActive : theme.categoryTagInactive
                      } ${activeThemeKey === 'modern' ? 'rounded-none' : 'rounded-md'}`}
                    >
                      {t(group.name)}
                    </a>
                    {group.subcategories.length > 0 && (
                      <button
                        onClick={() => {
                          setExpandedGroups(prev =>
                            isExpanded ? prev.filter(g => g !== group.name) : [...prev, group.name]
                          );
                        }}
                        className={`p-3 flex items-center justify-center transition-colors ${theme.textMuted} hover:text-black dark:hover:text-white ${activeThemeKey === 'modern' ? 'rounded-none' : 'rounded-md'}`}
                        aria-label="Toggle subcategories"
                      >
                        {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                      </button>
                    )}
                  </div>
                  {isExpanded && group.subcategories.length > 0 && (
                    <div className="flex flex-col gap-1 ml-3 border-l-2 border-black/10 dark:border-white/10 pl-2">
                      {group.subcategories.map((sub) => (
                        <a
                          href={getPath(`/${encodeURIComponent(group.name)}/${encodeURIComponent(sub)}`)}
                          key={sub}
                          onClick={(e) => {
                            e.preventDefault();
                            window.history.pushState(null, '', getPath(`/${encodeURIComponent(group.name)}/${encodeURIComponent(sub)}`));
                            setActiveCategory(sub);
                            resetToDirectory();
                            setIsMobileCategoriesOpen(false);
                          }}
                          className={`block w-full text-left px-3 py-3 text-sm font-medium transition-colors ${
                            activeCategory === sub ? theme.categoryTagActive : theme.categoryTagInactive
                          } ${activeThemeKey === 'modern' ? 'rounded-none' : 'rounded-md'}`}
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
          <div className="mt-auto p-4 pt-4 border-t border-black/10 dark:border-white/10 flex flex-col gap-3">
            <button 
              onClick={() => {
                resetToDirectory();
                setIsAdminMode(true);
                setIsMobileCategoriesOpen(false);
                window.scrollTo(0, 0);
              }}
              className={`w-full py-4 px-4 font-bold text-base text-center flex items-center justify-center gap-2 bg-[#0F4C2E] hover:bg-[#06301C] text-white transition-colors ${activeThemeKey === 'modern' ? 'rounded-none' : 'rounded-lg shadow-sm hover:shadow'}`}
            >
              {currentUser ? (
                <>
                  <div className="w-6 h-6 rounded-full flex items-center justify-center bg-[#F2761B] text-white text-[11px]">
                    {currentUser.email ? currentUser.email.substring(0, 2).toUpperCase() : 'A'}
                  </div>
                  Account
                </>
              ) : (
                <>
                  <User className="w-5 h-5" />
                  Account Login
                </>
              )}
            </button>
            <button 
              onClick={() => {
                setIsJobsMode(true);
                setJobsCategory(null);
                setIsMobileCategoriesOpen(false);
                window.scrollTo(0, 0);
              }}
              className={`w-full py-4 px-4 font-bold text-base text-center flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white transition-colors ${activeThemeKey === 'modern' ? 'rounded-none' : 'rounded-lg shadow-sm hover:shadow'}`}
            >
              <Briefcase className="w-5 h-5" /> Offene Stellen
            </button>
            <button 
              onClick={() => {
                setIsSubmitMode(true);
                setIsMobileCategoriesOpen(false);
                window.scrollTo(0, 0);
              }}
              className={`w-full py-4 px-4 font-bold text-base text-center flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white transition-colors ${activeThemeKey === 'modern' ? 'rounded-none' : 'rounded-lg shadow-sm hover:shadow'}`}
            >
              <Plus className="w-5 h-5" /> Unternehmen eintragen
            </button>
          </div>
        </div>
      )}

      <footer style={{ background: '#06301C', color: 'rgba(255,255,255,0.78)', marginTop: 'auto' }}>
        <div className="max-w-[1180px] mx-auto px-6 py-12 md:py-16 grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-12">
          <div className="md:col-span-2">
            <div className="inline-block cursor-pointer" onClick={() => { resetToDirectory(); }}>
              <span className="font-display text-[13px] font-medium text-white/70">Das</span>
              <span className="font-display text-[22px] font-extrabold tracking-widest text-white block leading-tight">WINTERBERG</span>
              <svg viewBox="0 0 200 10" preserveAspectRatio="none" className="w-full h-[7px] block mt-0.5">
                <path d="M3 7C38 2 78 1 118 4c28 2 52 5 79 1" stroke="#F2761B" strokeWidth="3.4" fill="none" strokeLinecap="round"/>
              </svg>
              <span className="font-display text-[12px] font-semibold tracking-[0.32em] text-white/90 block mt-1">VERZEICHNIS</span>
            </div>
            <p className="text-[14.5px] leading-relaxed mt-4 max-w-[52ch]">
              Das große Verzeichnis für alle Unternehmen, Handwerker und Dienstleister in Winterberg und seinen Ortsteilen {availableLocations.filter(l => l !== 'Winterberg').join(', ')}.
            </p>
          </div>
          <div className="flex flex-col gap-2.5 text-[14.5px]">
            <div className="text-white font-semibold mb-0.5">Verzeichnis</div>
            <a href="#" onClick={(e) => { e.preventDefault(); resetToDirectory(); }} className="text-white/80 hover:text-white transition-colors">Alle Unternehmen</a>
            <a href="#" onClick={(e) => { e.preventDefault(); setIsJobsMode(true); window.scrollTo(0, 0); }} className="text-white/80 hover:text-white transition-colors">Jobs</a>
            <a href="#" onClick={(e) => { e.preventDefault(); setIsSubmitMode(true); window.scrollTo(0, 0); }} className="text-white/80 hover:text-white transition-colors">Eintragen</a>
            <a href="#" onClick={(e) => { e.preventDefault(); setIsPricingMode(true); window.scrollTo(0, 0); }} className="text-white/80 hover:text-white transition-colors">Preise</a>
          </div>
          <div className="flex flex-col gap-2.5 text-[14.5px]">
            <div className="text-white font-semibold mb-0.5">Rechtliches</div>
            <a href="#" onClick={(e) => { 
              e.preventDefault(); 
              setIsAdminMode(false); setIsAGBMode(false); setIsSubmitMode(false); setIsPricingMode(false); setIsJobsMode(false); setIsDatenschutzMode(false);
              setIsImpressumMode(true); window.scrollTo(0, 0);
            }} className="text-white/80 hover:text-white transition-colors">Impressum</a>
            <a href="#" onClick={(e) => { 
              e.preventDefault(); 
              setIsAdminMode(false); setIsImpressumMode(false); setIsAGBMode(false); setIsSubmitMode(false); setIsPricingMode(false); setIsJobsMode(false);
              setIsDatenschutzMode(true); window.scrollTo(0, 0);
            }} className="text-white/80 hover:text-white transition-colors">Datenschutz</a>
            <a href="#" onClick={(e) => { 
              e.preventDefault(); 
              setIsAdminMode(false); setIsImpressumMode(false); setIsSubmitMode(false); setIsPricingMode(false); setIsJobsMode(false); setIsDatenschutzMode(false);
              setIsAGBMode(true); window.scrollTo(0, 0);
            }} className="text-white/80 hover:text-white transition-colors">AGB</a>
          </div>
          <div className="flex flex-col gap-2.5 text-[14.5px]">
            <div className="text-white font-semibold mb-0.5">Externe Links</div>
            <a href="https://www.winterberg.de/service-kontakt/wirtschaftsfoerderung/" target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-white transition-colors">Wirtschaftsförderung</a>
          </div>
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.12)' }}>
          <div className="max-w-[1180px] mx-auto px-6 py-4 text-[13px] flex items-center justify-between">
            <span>© {new Date().getFullYear()} Das Winterberg Verzeichnis · Ein Projekt von <a href="https://sichtbar-online.com" target="_blank" rel="noopener noreferrer" className="hover:text-orange-500 transition-colors">SICHTBAR SEO Simon Kräling</a></span>
          </div>
        </div>
      </footer>
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
      
      <form onSubmit={handleAdd} className="flex flex-col md:flex-row gap-3 items-end mb-8 bg-black/5 p-5 rounded-lg border border-black/10">
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

function AdminDashboard({ theme, activeThemeKey, businesses, setBusinesses, onBusinessAdded, token, setToken, reviewsEnabled, setReviewsEnabled, seoSettings, setSeoSettings, onBack }: any) {

  const { t } = useTranslation();
  const { currentUser, userProfile } = useAuth();
  const [view, setView] = useState<'list' | 'add' | 'edit'>('list');
  const [activeTab, setActiveTab] = useState<'entries' | 'seo' | 'reviews' | 'abrechnung' | 'redirects' | 'scripts'>('entries');
  const [editingBusiness, setEditingBusiness] = useState<Business | null>(null);

  const [activeAdminCategory, setActiveAdminCategory] = useState<string>('Alle');
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
    if (activeAdminCategory === 'Alle') return true;
    if (activeAdminCategory === 'In Prüfung') return bus.status === 'pending';
    const matchesCategory = bus.category === activeAdminCategory || bus.subcategory === activeAdminCategory;
    const matchesSearch = bus.name.toLowerCase().includes(adminSearchQuery.toLowerCase()) || 
                          (bus.description && bus.description.toLowerCase().includes(adminSearchQuery.toLowerCase())) ||
                          (bus.email && bus.email.toLowerCase().includes(adminSearchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <main className="flex-1 max-w-[1180px] mx-auto w-full px-6 py-[32px] pb-[80px]">
      <div className="flex justify-between items-center gap-4 flex-wrap mb-[22px]">
        <div>
            <h2 className="text-[26px] font-bold tracking-tight mb-[4px]">{isAdmin ? 'Adminbereich' : 'Account'}</h2>
            <div className="text-[13px] text-[#5F6B63]">Angemeldet als {currentUser?.email}</div>
        </div>
        <button 
          onClick={handleLogout}
          className="bg-white border border-[#E7E2DA] rounded-full px-[18px] py-[10px] text-[14px] font-medium cursor-pointer hover:border-[#0F4C2E] hover:text-[#0F4C2E] transition-colors"
        >
          Abmelden
        </button>
      </div>

      <div className="flex gap-[6px] flex-wrap mb-[24px] bg-white border border-[#EDE8E0] rounded-[16px] p-[6px]">
        {[
          { id: 'entries', label: 'Einträge' },
          { id: 'reviews', label: 'Bewertungen' },
          { id: 'abrechnung', label: 'Abrechnung' },
          ...(isAdmin ? [
            { id: 'seo', label: 'SEO' },
            { id: 'redirects', label: 'Redirects' },
            { id: 'scripts', label: 'Skripte' }
          ] : [])
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`border-none rounded-[11px] px-[16px] py-[10px] text-[14.5px] cursor-pointer transition-colors ${activeTab === tab.id ? 'bg-[#0F4C2E] text-white font-semibold' : 'bg-transparent text-[#1B211D] font-normal hover:bg-black/5'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'entries' ? (
        <div className="bg-white border border-[#EDE8E0] rounded-[22px] p-6 shadow-[0_10px_30px_rgba(27,33,29,0.06)]">
          <div className="flex flex-col gap-[16px] mb-[24px]">
            <div className="flex gap-[12px] flex-wrap items-center">
              {isAdmin && (
                <input 
                  placeholder="Unternehmen, E-Mail oder Text suchen..." 
                  value={adminSearchQuery}
                  onChange={(e) => setAdminSearchQuery(e.target.value)}
                  className="flex-1 min-w-[220px] border border-[#E7E2DA] rounded-[12px] px-[14px] py-[12px] text-[15px] bg-[#FAF8F5] focus:outline-none focus:border-[#0F4C2E]"
                />
              )}
              <button 
                onClick={() => { setEditingBusiness(null); setView('add'); }}
                className="bg-[#0F4C2E] text-white border-none rounded-[12px] px-[22px] py-[12px] text-[14.5px] font-semibold cursor-pointer hover:bg-[#06301C] transition-colors ml-auto"
              >
                + Neues Unternehmen
              </button>
            </div>
            
            {isAdmin && (
              <div className="flex gap-2 flex-wrap mb-4">
                {['Alle', 'In Prüfung', ...categories.map(c => c.name)].map(c => (
                  <button 
                    key={c}
                    onClick={() => setActiveAdminCategory(c)}
                    className={`border rounded-full px-[14px] py-[6px] text-[13.5px] cursor-pointer transition-colors ${activeAdminCategory === c ? 'bg-[#0F4C2E] text-white border-[#0F4C2E]' : 'bg-[#FAF8F5] text-[#4A544D] border-[#E7E2DA] hover:border-[#0F4C2E]'}`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <div className="grid gap-[8px]">
            {filteredAdminBusinesses.map((bus: Business) => (
              <div key={bus.id} className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-[14px] items-center border border-[#EDE8E0] rounded-[14px] px-[16px] py-[13px]">
                <div className="min-w-0">
                  <div className="flex items-center gap-[9px] flex-wrap">
                    <span className="font-semibold text-[15.5px]">{bus.name}</span>
                    {bus.isPremium && <span className="bg-[#FFF1E4] text-[#D65F0C] rounded-full px-[9px] py-[2px] text-[11px] font-bold">PREMIUM</span>}
                    {bus.status === 'pending' && <span className="bg-[#FDF3D3] text-[#96700B] rounded-full px-[9px] py-[2px] text-[11px] font-bold">IN PRÜFUNG</span>}
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
                      className="bg-[#E8F1EB] text-[#0F4C2E] border-none rounded-[10px] px-[14px] py-[9px] text-[13.5px] font-medium cursor-pointer hover:bg-[#D6E7DC]"
                    >
                      Freigeben
                    </button>
                  )}
                  <button 
                    onClick={() => { setEditingBusiness(bus); setView('edit'); }}
                    className="bg-[#F3F0EA] border-none rounded-[10px] px-[14px] py-[9px] text-[13.5px] font-medium cursor-pointer hover:bg-[#EAE5DB]"
                  >
                    Bearbeiten
                  </button>
                  <button 
                    onClick={() => handleDelete(bus.id)}
                    className="bg-[#FBEAE7] text-[#C0392B] border-none rounded-[10px] px-[14px] py-[9px] text-[13.5px] font-medium cursor-pointer hover:bg-[#FADBD5]"
                  >
                    Löschen
                  </button>
                </div>
              </div>
            ))}
            {filteredAdminBusinesses.length === 0 && (
              <div className="border border-dashed border-[#D8D2C8] rounded-[12px] p-[24px] text-center text-[#8A928B]">
                Keine Einträge gefunden.
              </div>
            )}
          </div>
        </div>
        
        ) : activeTab === 'reviews' ? (
          <div className="bg-white border border-[#EDE8E0] rounded-[22px] p-[26px] shadow-[0_10px_30px_rgba(27,33,29,0.06)]">
            <h2 className="font-display text-[21px] font-bold m-0 mb-[16px]">Offene Bewertungen</h2>
            
            {allowedBusinesses.flatMap((b: Business) => (b.reviews || []).filter(r => r.status === 'pending').map(r => ({ ...r, businessId: b.id, businessName: b.name }))).length > 0 ? (
              <div className="grid gap-[10px] mb-[30px]">
                {allowedBusinesses.flatMap((b: Business) => (b.reviews || []).filter(r => r.status === 'pending').map(r => ({ ...r, businessId: b.id, businessName: b.name }))).map((review) => (
                  <div key={review.id} className="border border-[#EDE8E0] rounded-[16px] p-[16px]">
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
                        className="bg-[#0F4C2E] text-white border-none rounded-[10px] px-[16px] py-[9px] text-[13.5px] font-semibold cursor-pointer hover:bg-[#06301C] transition-colors"
                      >
                        Freigeben
                      </button>
                      <button 
                        onClick={() => {
                          updateBusinessInFirestore(review.businessId, b => {
                            return { ...b, reviews: (b.reviews || []).filter(r => r.id !== review.id) };
                          });
                        }}
                        className="bg-[#FBEAE7] text-[#C0392B] border-none rounded-[10px] px-[16px] py-[9px] text-[13.5px] font-semibold cursor-pointer hover:bg-[#FADBD5]"
                      >
                        Ablehnen
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="border border-dashed border-[#D8D2C8] rounded-[16px] p-[30px] text-center text-[#8A928B] mb-[30px]">
                Keine offenen Bewertungen.
              </div>
            )}

            <h2 className="font-display text-[21px] font-bold m-0 mb-[16px]">Freigegebene Bewertungen</h2>
            {allowedBusinesses.flatMap((b: Business) => (b.reviews || []).filter(r => r.status === 'approved').map(r => ({ ...r, businessId: b.id, businessName: b.name, isPremium: b.isPremium }))).length > 0 ? (
              <div className="grid gap-[10px]">
                {allowedBusinesses.flatMap((b: Business) => (b.reviews || []).filter(r => r.status === 'approved').map(r => ({ ...r, businessId: b.id, businessName: b.name, isPremium: b.isPremium }))).map((review) => (
                  <div key={review.id} className="border border-[#EDE8E0] rounded-[16px] p-[16px]">
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
                        className={`border-none rounded-[10px] px-[14px] py-[8px] text-[13px] font-semibold cursor-pointer transition-colors ${review.isPremium ? 'bg-[#F3F0EA] hover:bg-[#EAE5DB]' : 'bg-[#FAF8F5] text-[#A3ABA5]'}`}
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
                        className="bg-[#FBEAE7] text-[#C0392B] border-none rounded-[10px] px-[14px] py-[8px] text-[13px] font-semibold cursor-pointer hover:bg-[#FADBD5]"
                      >
                        Entfernen
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="border border-dashed border-[#D8D2C8] rounded-[16px] p-[30px] text-center text-[#8A928B]">
                Noch keine freigegebenen Bewertungen.
              </div>
            )}
          </div>
        ) : activeTab === 'abrechnung' ? (
          <div className="bg-white border border-[#EDE8E0] rounded-[22px] p-[26px] shadow-[0_10px_30px_rgba(27,33,29,0.06)]">
            {isAdmin ? (
              <>
                <div className="flex gap-[18px] flex-wrap mb-[24px]">
                  <div className="bg-[#FFF8F1] border border-[#FBD9BC] rounded-[16px] px-[24px] py-[20px] flex-1 min-w-[200px]">
                    <div className="text-[13px] text-[#96551F]">Premium-Kunden</div>
                    <div className="font-display text-[32px] font-bold text-[#D65F0C] my-[4px]">
                      {businesses.filter((b: Business) => b.isPremium).length}
                    </div>
                  </div>
                </div>
                <h2 className="font-display text-[21px] font-bold m-0 mb-[16px]">Alle Rechnungen (Admin-Ansicht)</h2>
                <div className="border border-dashed border-[#D8D2C8] rounded-[16px] p-[30px] text-center text-[#8A928B]">
                  Hier werden zukünftig alle systemweiten Rechnungen der Nutzer aufgelistet.
                </div>
              </>
            ) : (
              <>
                <h2 className="font-display text-[21px] font-bold m-0 mb-[16px]">Ihr Abonnement</h2>
                {allowedBusinesses.filter((b: Business) => b.isPremium).length > 0 ? (
                  <div>
                    {allowedBusinesses.filter((b: Business) => b.isPremium).map((bus: Business) => (
                      <div key={bus.id} className="border border-[#EDE8E0] rounded-[16px] p-6 mb-6 bg-[#FAF8F5]">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <div className="font-bold text-[18px] text-[#0F4C2E]">{bus.name}</div>
                            <div className="text-[14px] text-[#5F6B63]">Premium-Eintrag (Aktiv)</div>
                          </div>
                          <button 
                            onClick={async () => {
                              if (confirm("Möchten Sie Ihr Abonnement wirklich kündigen? Es läuft dann noch bis zum Ende der aktuellen Abrechnungsperiode weiter.")) {
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
                                    alert(data.message);
                                  } else {
                                    alert("Fehler bei der Kündigung: " + data.error);
                                  }
                                } catch (err) {
                                  alert("Fehler bei der Verbindung zum Server.");
                                }
                              }
                            }}
                            className="bg-white border border-[#D8D2C8] text-[#C0392B] px-4 py-2 rounded-[10px] text-[13px] font-semibold hover:border-[#C0392B] transition-colors cursor-pointer"
                          >
                            Abo kündigen
                          </button>
                        </div>
                        <div className="text-[13px] text-[#4A544D] bg-[#E8F1EB] p-3 rounded-[10px]">
                          <strong>Hinweis:</strong> Die Kündigungsfrist beträgt 14 Tage zum Ende der jeweiligen Vertragslaufzeit. Jahresabonnements gehen bei nicht fristgerechter Kündigung automatisch in ein monatlich kündbares Abonnement zum regulären Monatspreis über.
                        </div>
                      </div>
                    ))}

                    <h2 className="font-display text-[21px] font-bold m-0 mb-[16px]">Ihre Rechnungen</h2>
                    <p className="text-[14px] text-[#5F6B63] mb-4">
                      Ihre Rechnungen werden automatisch von Stripe generiert und nach jeder erfolgreichen Zahlung hier bereitgestellt.
                    </p>
                    <div className="border border-dashed border-[#D8D2C8] rounded-[16px] p-[30px] text-center text-[#8A928B]">
                      Noch keine Rechnungen für diesen Account vorhanden.
                    </div>
                  </div>
                ) : (
                  <div className="border border-dashed border-[#D8D2C8] rounded-[16px] p-[30px] text-center text-[#8A928B]">
                    Sie haben aktuell kein aktives Premium-Abonnement.
                  </div>
                )}
              </>
            )}
          </div>
        
        ) : activeTab === 'redirects' ? (
          <RedirectsAdminPanel theme={theme} activeThemeKey={activeThemeKey} />
        ) : activeTab === 'scripts' ? (
          <ScriptManager theme={theme} activeThemeKey={activeThemeKey} />
        ) : (
          <SeoAdminPanel theme={theme} activeThemeKey={activeThemeKey} seoSettings={seoSettings} setSeoSettings={setSeoSettings} businesses={businesses} />
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

        <div className="pt-4 pb-8 border-b border-black/10">
          <button type="submit" className={`px-6 py-2 font-medium w-full md:w-auto transition-colors ${theme.primaryBtn} ${activeThemeKey === 'modern' ? 'rounded-none' : 'rounded-md'}`}>
            SEO Einstellungen speichern
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
