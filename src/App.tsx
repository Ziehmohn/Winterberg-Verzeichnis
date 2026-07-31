import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Menu, X,  MapPin, Phone, Globe, ChevronRight, ChevronDown, Plus, ArrowLeft, Image as ImageIcon, Trash2, Edit2, LogIn, LogOut, Map as MapIcon, List as ListIcon, Star, Lock, Clock, Settings, SearchCode, BadgeCheck, Sun, Moon, Briefcase, CreditCard, FileText , User, Bed, Utensils, Hammer, ShoppingBag } from 'lucide-react';
import { categories, themes, businesses as initialBusinesses } from './data';
import { ThemeKey, CategoryGroup, Business, SeoSettings } from './types';
import DirectoryMap from './components/DirectoryMap';
import Logo from './components/Logo';
import NotFound from './components/NotFound';
import BusinessDetail from './components/BusinessDetail';
import { isOpenNow } from './utils';
import ReviewForm from './components/ReviewForm';
import { Review } from './types';
import { useAuth } from './AuthContext';
import Login from './components/Login';
import Impressum from './components/Impressum';
import AGB from './components/AGB';
import SubmitBusiness from './components/SubmitBusiness';
import PricingTable from './components/PricingTable';
import JobsBoard from './components/JobsBoard';
import { db, auth } from './firebase';
import { collection, getDocs, doc, setDoc, deleteDoc, addDoc } from 'firebase/firestore';
import { useTranslation } from './i18n';
import { signOut } from 'firebase/auth';

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

  if (typeof window !== 'undefined') {
    const path = window.location.pathname;
    const pathParts = path.split('/').filter(Boolean);
    if (pathParts[0] === 'nl') { pathParts.shift(); }
    
    if (pathParts[0]) {
      const decodedPart1 = decodeURIComponent(pathParts[0]);
      if (decodedPart1.toLowerCase() === 'stellenangebote' || decodedPart1.toLowerCase() === 'jobs') {
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
  const [activeCategory, setActiveCategory] = useState<string>(defaultCategory);
  const [isNotFound, setIsNotFound] = useState(initialNotFound);
  const [activeLocation, setActiveLocation] = useState<string>('Alle');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
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
    setIsSubmitMode(false);
    setIsPricingMode(false);
    setIsJobsMode(false);
    setIsNotFound(false);
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
    
    try {
      // Create a copy of the business object without changing the local state reference here
      const bToUpdate = { ...business, reviews: updatedReviews };
      await setDoc(doc(db, 'businesses', businessId), bToUpdate);
    } catch (err) {
      console.error(err);
    }
  };

  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isImpressumMode, setIsImpressumMode] = useState(false);
  const [isAGBMode, setIsAGBMode] = useState(false);
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
    fetchBusinesses();
  }, []);

  const fetchBusinesses = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'businesses'));
      const fbBusinesses: Business[] = [];
      querySnapshot.forEach((doc) => {
        fbBusinesses.push({ id: doc.id, ...doc.data() } as Business);
      });
      
      if (fbBusinesses.length > 0) {
        setBusinesses(prev => {
          const merged = [...initialBusinesses];
          fbBusinesses.forEach(fb => {
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
      <div className={`min-h-screen relative overflow-x-hidden transition-colors duration-300 ${theme.bgPage} ${theme.textBase}`}>
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
    <div className={`min-h-screen relative overflow-x-hidden transition-colors duration-300 ${theme.bgPage} ${theme.textBase}`}>
      
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
        {/* Header */}
        <header 
          className={`w-full relative z-20 pt-6 pb-24 md:pb-32 transition-colors duration-300 ${theme.headerBg}`}
          style={{ backgroundColor: 'transparent', backgroundImage: 'none', backdropFilter: 'none', WebkitBackdropFilter: 'none', border: 'none', boxShadow: 'none' }}
        >
          {/* Orange gradient backdrop (slopes right down) */}
          <div 
            className="absolute inset-x-0 top-0 h-full -z-20 bg-gradient-to-br from-[#ff7e5f] via-orange-400 to-[#fffcdc]" 
            style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 calc(100% - 3rem))' }}
          ></div>
          
          {/* Main theme background (slopes right up) */}
          <div 
            className={`absolute inset-x-0 top-0 h-full -z-10 transition-colors duration-300 ${theme.headerBg} shadow-2xl`} 
            style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 4rem), 0 100%)' }}
          ></div>

          <div className="relative z-30 px-4 md:px-8 w-full max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="w-full md:w-1/2 flex justify-center md:justify-start mt-2 md:mt-4 relative z-50">
              <div className="flex flex-col items-center md:items-start text-center md:text-left w-full">
                <a 
                  href={getPath("/")} 
                  className="block w-full"
                  onClick={(e) => {
                    e.preventDefault();
                    window.history.pushState(null, '', getPath('/'));
                    setSearchQuery('');
                    setActiveCategory('Alle');
                    setActiveLocation('Alle');
                    resetToDirectory();
                  }}
                >
                  <Logo 
                    aria-label="Winterberg Wirtschaft - Das große Verzeichnis für alle Unternehmen vor Ort" 
                    onClick={() => {
                      window.history.pushState(null, '', getPath('/'));
                      setSearchQuery('');
                      setActiveCategory('Alle');
                      setActiveLocation('Alle');
                      resetToDirectory();
                    }}
                  />
                </a>
                <p className="mt-3 text-sm md:text-base max-w-sm text-white drop-shadow-md mx-auto md:mx-0 font-medium">
                  {t("titleSubtitle")}
                </p>
                <div className="flex flex-wrap gap-6 mt-8 text-white/90 items-center justify-center md:justify-start">
                  <div className="flex flex-col items-center gap-1.5 opacity-90 hover:opacity-100 transition-opacity cursor-default" title="Hotels & Unterkünfte"><Bed className="w-6 h-6" /><span className="text-[9px] uppercase font-bold tracking-wider">Hotels</span></div>
                  <div className="flex flex-col items-center gap-1.5 opacity-90 hover:opacity-100 transition-opacity cursor-default" title="Gastronomie"><Utensils className="w-6 h-6" /><span className="text-[9px] uppercase font-bold tracking-wider">Gastro</span></div>
                  <div className="flex flex-col items-center gap-1.5 opacity-90 hover:opacity-100 transition-opacity cursor-default" title="Handwerk"><Hammer className="w-6 h-6" /><span className="text-[9px] uppercase font-bold tracking-wider">Handwerk</span></div>
                  <div className="flex flex-col items-center gap-1.5 opacity-90 hover:opacity-100 transition-opacity cursor-default" title="Einzelhandel"><ShoppingBag className="w-6 h-6" /><span className="text-[9px] uppercase font-bold tracking-wider">Handel</span></div>
                  <div className="flex flex-col items-center gap-1.5 opacity-90 hover:opacity-100 transition-opacity cursor-default" title="Dienstleistungen"><Briefcase className="w-6 h-6" /><span className="text-[9px] uppercase font-bold tracking-wider">Services</span></div>
                  <div className="flex flex-col items-center gap-1.5 opacity-90 hover:opacity-100 transition-opacity cursor-default" title="Freizeit"><MapIcon className="w-6 h-6" /><span className="text-[9px] uppercase font-bold tracking-wider">Freizeit</span></div>
                </div>
              </div>
            </div>
          
            <div className="flex flex-col items-center md:items-end gap-6 w-full md:w-1/2 relative z-50 mt-8 md:mt-0">
              <div className="flex flex-wrap items-center justify-center md:justify-end gap-4 w-full">
                {!isAdminMode && (
                  <button 
                    onClick={() => setIsAdminMode(true)}
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-black/20 hover:bg-black/30 text-white transition-colors backdrop-blur-sm"
                    title={currentUser ? 'Dashboard' : t("adminLogin")}
                  >
                    <User className="w-5 h-5" />
                  </button>
                )}
                {(isAdminMode || isImpressumMode || isAGBMode || isSubmitMode || isPricingMode || isJobsMode) && (
                  <button 
                    onClick={() => {
                      setIsAdminMode(false);
                      setIsImpressumMode(false);
                      setIsAGBMode(false);
                      setIsSubmitMode(false);
                      setIsPricingMode(false);
                      setIsJobsMode(false);
                    }}
                    className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors ${theme.primaryBtn} ${activeThemeKey === 'modern' ? 'rounded-none' : 'rounded-lg'}`}
                  >
                    <ArrowLeft className="w-4 h-4" /> {t("backToDir")}
                  </button>
                )}
              </div>
              
              <div className="hidden md:flex relative transform md:-rotate-3 mt-8 md:mt-4 md:mr-4 justify-center w-full">
                <img 
                  src="/winterberg-header.webp" 
                  alt="Winterberg" 
                  className="w-[75%] max-w-[530px] object-cover rounded-xl shadow-2xl z-50 relative"
                  style={{ border: '4px solid #ffc084' }}
                />
                <div className="absolute -bottom-5 right-0 text-[10px] text-white/90 drop-shadow-md z-50 bg-black/30 px-2 py-0.5 rounded-full backdrop-blur-sm">
                  Urheber: Ferienwelt Winterberg | Stephan Peters
                </div>
              </div>
            </div>
          </div>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-7xl mx-auto px-4 md:px-8 py-8 flex flex-col md:flex-row gap-8">
        
        {isJobsMode ? (
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
        ) : isSubmitMode ? (
          <SubmitBusiness theme={theme} activeThemeKey={activeThemeKey} onCancel={() => setIsSubmitMode(false)} />
        ) : isAdminMode ? (
          <AdminDashboard 
            theme={theme} 
            activeThemeKey={activeThemeKey} 
            businesses={businesses} 
            setBusinesses={setBusinesses} 
            onBusinessAdded={fetchBusinesses} 
            reviewsEnabled={reviewsEnabled} 
            setReviewsEnabled={(v: boolean) => { setReviewsEnabled(v); localStorage.setItem('premium_reviews_enabled', String(v)); }} 
            seoSettings={seoSettings} 
            setSeoSettings={setSeoSettings}
            onBack={() => setIsAdminMode(false)}
          />
        ) : (
          <>
            {/* Sidebar (Categories) */}
            <aside className="w-full md:w-64 shrink-0 mb-6 md:mb-0">
              <div className={`md:sticky md:top-32 md:p-5 ${theme.cardBg} ${theme.cardBorder} ${theme.cardShadow} border ${activeThemeKey === 'modern' ? 'rounded-none' : 'rounded-xl'}`}>
                
                {/* Mobile Toggle Button */}
                <button 
                  className="w-full md:hidden flex items-center gap-3 p-4 font-display font-bold text-lg transition-colors active:bg-black/5"
                  onClick={() => setIsMobileCategoriesOpen(!isMobileCategoriesOpen)}
                >
                  {isMobileCategoriesOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                  <span>{t("menu")}</span>
                </button>

                {/* Desktop Header */}
                <h3 className="hidden md:block font-display font-bold text-lg mb-4">{t("Branchen")}</h3>
                
                {/* Desktop Navigation */}
                <div className="hidden md:flex md:flex-col">
                  <nav className="flex flex-col gap-1 p-0">
                    <a
                      href={getPath("/")}
                      onClick={(e) => {
                        e.preventDefault();
                        window.history.pushState(null, '', getPath('/'));
                        setActiveCategory('Alle');
                        resetToDirectory();
                      }}
                      className={`block w-full text-left px-4 py-2 text-sm font-medium transition-colors ${
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
                              }}
                              className={`flex-1 block text-left px-4 py-2 text-sm font-medium transition-colors ${
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
                                className={`p-2 flex items-center justify-center transition-colors ${theme.textMuted} hover:text-black dark:hover:text-white ${activeThemeKey === 'modern' ? 'rounded-none' : 'rounded-md'}`}
                                aria-label="Toggle subcategories"
                              >
                                {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
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
                                  }}
                                  className={`block w-full text-left px-3 py-2 text-xs font-medium transition-colors ${
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
                  <div className="mt-6 pt-4 border-t border-black/10 dark:border-white/10 flex flex-col gap-3">
                    <button 
                      onClick={() => {
                        setIsJobsMode(true);
                        setJobsCategory(null);
                        window.scrollTo(0, 0);
                      }}
                      className={`w-full py-3 px-4 font-bold text-sm text-center flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white transition-colors ${activeThemeKey === 'modern' ? 'rounded-none' : 'rounded-lg shadow-sm hover:shadow'}`}
                    >
                      <Briefcase className="w-4 h-4" /> Offene Stellen
                    </button>
                    <button 
                      onClick={() => {
                        setIsSubmitMode(true);
                        window.scrollTo(0, 0);
                      }}
                      className={`w-full py-3 px-4 font-bold text-sm text-center flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white transition-colors ${activeThemeKey === 'modern' ? 'rounded-none' : 'rounded-lg shadow-sm hover:shadow'}`}
                    >
                      <Plus className="w-4 h-4" /> Unternehmen eintragen
                    </button>
                  </div>
                </div>
              </div>
            </aside>

            {/* Main Area */}
            <div className="flex-1 min-w-0">
              {selectedBusiness ? (
                <BusinessDetail business={selectedBusiness} onBack={() => setSelectedBusiness(null)} theme={theme} activeThemeKey={activeThemeKey} />
              ) : (
                <>
                  {/* Top Search Bar */}
                  <div className="mb-8">
                <div className="relative max-w-2xl mb-4">
                  <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${theme.textMuted}`} />
                  <input 
                    type="text" 
                    placeholder={t('searchPlaceholder')} 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`w-full pl-12 pr-4 py-4 md:py-3 text-lg md:text-base border focus:outline-none focus:ring-2 focus:border-orange-500 focus:ring-orange-500/20 transition-all bg-white shadow-sm ${theme.cardBorder} ${theme.textBase} ${activeThemeKey === 'modern' ? 'rounded-none' : 'rounded-xl'}`}
                  />
                </div>
                <h1 className="text-3xl md:text-4xl font-display font-black tracking-tight mt-8 mb-6 text-black">
                  {activeCategory === 'Alle' 
                    ? (activeLocation === 'Alle' ? 'Unternehmen & Dienstleister in Winterberg' : `Unternehmen & Dienstleister in ${t(activeLocation)}`)
                    : `${t(activeCategory)} in ${activeLocation === 'Alle' ? 'Winterberg' : t(activeLocation)}`
                  }
                </h1>

                
                {/* Location Filters */}
                {availableLocations.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setActiveLocation('Alle')}
                      className={`px-4 py-1.5 text-sm font-medium transition-colors ${activeThemeKey === 'modern' ? 'rounded-none' : 'rounded-full'} ${activeLocation === 'Alle' ? theme.categoryTagActive : theme.categoryTagInactive}`}
                    >
                      {t("allLocations")}
                    </button>
                    {availableLocations.map(loc => (
                      <button
                        key={loc}
                        onClick={() => setActiveLocation(loc)}
                        className={`px-4 py-1.5 text-sm font-medium transition-colors ${activeThemeKey === 'modern' ? 'rounded-none' : 'rounded-full'} ${activeLocation === loc ? theme.categoryTagActive : theme.categoryTagInactive}`}
                      >
                        {loc}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex flex-col xl:flex-row xl:items-center justify-between mb-4 gap-4">
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-xl font-bold shrink-0">{t("results")} ({filteredBusinesses.length})</h2>
                  
                  {/* Badge List for Active Category Breakdown */}
                  {categoryBadges.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2">
                      {categoryBadges.map(badge => (
                        <span key={badge.name} className={`px-2 py-0.5 text-xs font-medium ${activeThemeKey === 'modern' ? 'rounded-none' : 'rounded-full'} ${theme.categoryTagInactive} flex items-center gap-1.5 opacity-90 hover:opacity-100 transition-opacity`}>
                          {badge.name}
                          <span className={`${theme.cardBg} px-1.5 py-0.5 ${activeThemeKey === 'modern' ? 'rounded-none' : 'rounded-full'} text-[0.65rem] font-bold shadow-sm`}>{badge.count}</span>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="flex items-center border border-black/10 rounded-lg p-1 shadow-sm bg-white self-start xl:self-auto shrink-0">
                  <button
                    onClick={() => setViewMode('list')}
                    className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${viewMode === 'list' ? 'bg-black/5 text-black' : 'text-black/60 hover:text-black'}`}
                  >
                    <ListIcon className="w-4 h-4" /> Liste
                  </button>
                  <button
                    onClick={() => setViewMode('map')}
                    className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${viewMode === 'map' ? 'bg-black/5 text-black' : 'text-black/60 hover:text-black'}`}
                  >
                    <MapIcon className="w-4 h-4" /> Karte
                  </button>
                </div>
              </div>

              {/* Directory Grid or Map */}
              {isLoading ? (
                <div className={`py-20 text-center ${theme.textMuted}`}>{t("loading")}</div>
              ) : viewMode === 'map' ? (
                <DirectoryMap businesses={filteredBusinesses} onSelectBusiness={(bus) => {
                  window.history.pushState(null, '', getPath(`/${encodeURIComponent(bus.category)}${bus.subcategory ? `/${encodeURIComponent(bus.subcategory)}` : ''}/${encodeURIComponent(bus.name.replace(/\s+/g, '-').toLowerCase())}`));
                  setSelectedBusiness(bus);
                }} />
              ) : (
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
                        className={`group flex flex-col overflow-hidden transition-all hover:-translate-y-1 bg-white ${bus.isPremium ? 'border-2 border-orange-400 shadow-lg shadow-orange-500/20' : 'border ' + theme.cardBorder + ' ' + theme.cardShadow} ${activeThemeKey === 'modern' ? 'rounded-none' : 'rounded-xl'}`}
                      >
                        {/* Image Header */}
                        <div className="h-48 w-full bg-black/5 relative overflow-hidden">
                          {(bus.uploadedImage || bus.imageLink) ? (
                            <img src={bus.uploadedImage || bus.imageLink} alt={bus.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-black/40 bg-neutral-100/50">
                              <ImageIcon className="w-8 h-8 mb-3 opacity-40" />
                              <span className="text-[11px] md:text-xs font-bold tracking-widest opacity-60">BILDER FOLGEN IN KÜRZE</span>
                            </div>
                          )}
                          <div className={`absolute top-4 left-4 ${theme.cardBg} bg-opacity-90 backdrop-blur-sm px-3 py-1 text-xs font-medium ${theme.textBase} ${activeThemeKey === 'modern' ? 'rounded-none border border-black' : 'rounded-full shadow-sm'}`}>
                            {bus.subcategory ? `${t(bus.category)} — ${t(bus.subcategory)}` : t(bus.category)}
                          </div>
                          {bus.isPremium && (
                            <div className={`absolute top-4 right-4 bg-orange-500 text-white shadow-lg shadow-orange-500/30 px-3 py-1 text-xs font-bold flex items-center gap-1 ${activeThemeKey === 'modern' ? 'rounded-none' : 'rounded-full'}`}>
                              <Star className="w-3 h-3 fill-current" /> Premium
                            </div>
                          )}
                        </div>

                        <div className={`p-6 flex-1 flex flex-col ${theme.cardBg} transition-colors`}>
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <a 
                              href={`/${encodeURIComponent(bus.category)}${bus.subcategory ? `/${encodeURIComponent(bus.subcategory)}` : ''}/${encodeURIComponent(bus.name.replace(/\s+/g, '-').toLowerCase())}`}
                              onClick={(e) => {
                                e.preventDefault();
                                window.history.pushState(null, '', getPath(`/${encodeURIComponent(bus.category)}${bus.subcategory ? `/${encodeURIComponent(bus.subcategory)}` : ''}/${encodeURIComponent(bus.name.replace(/\s+/g, '-').toLowerCase())}`));
                                setSearchQuery(bus.name);
                                setSelectedBusiness(bus);
                              }}
                              className="hover:underline flex-1"
                            >
                              <h3 className="text-xl font-display font-bold">{bus.name}</h3>
                            </a>
                            {bus.isPremium && (
                              <div className="flex items-center gap-1 px-2 py-1 bg-orange-50 text-orange-700 rounded-full text-xs font-medium shrink-0" title="Premium Unternehmen">
                                <BadgeCheck className="w-4 h-4" />
                                <span className="hidden xs:inline">{t("premium")}</span>
                              </div>
                            )}
                          </div>
                          <p className={`text-sm mb-6 flex-1 ${theme.textMuted}`}>
                            {bus.description}
                          </p>
                          
                          <div className="space-y-3 pt-4 border-t border-black/5">
                            {bus.openingHours && (() => {
                              const openState = isOpenNow(bus.openingHours, t);
                              return (
                                <div className="flex items-start gap-3">
                                  <Clock className={`w-4 h-4 mt-0.5 shrink-0 ${openState.isOpen ? 'text-emerald-500' : 'text-red-500'}`} />
                                  <span className={`text-sm font-medium ${openState.isOpen ? 'text-emerald-600' : 'text-red-600'}`}>{openState.text}</span>
                                </div>
                              );
                            })()}
                            <div className="flex items-start gap-3">
                              <MapPin className={`w-4 h-4 mt-0.5 shrink-0 ${theme.iconAccent}`} />
                              <span className="text-sm">{bus.address}</span>
                            </div>
                            {bus.phone && (
                              <div className="flex items-center gap-3">
                                <Phone className={`w-4 h-4 shrink-0 ${theme.iconAccent}`} />
                                <span className="text-sm">{bus.phone}</span>
                              </div>
                            )}
                            {bus.website && (
                              <div className="flex items-center gap-3">
                                <Globe className={`w-4 h-4 shrink-0 ${theme.iconAccent}`} />
                                <span className="text-sm">
                                  <a href={bus.website.startsWith('http') ? bus.website : `https://${bus.website}`} target="_blank" rel="noopener noreferrer" className="hover:underline">
                                    {bus.website}
                                  </a>
                                </span>
                              </div>
                            )}
                          </div>
                          
                          <ReviewForm business={bus} onReviewSubmit={handleReviewSubmit} />
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
              )}
              
              {activeCategory === 'KFZ-Werkstätten' && (() => {
                const kfz = businesses.filter(b => b.category === 'KFZ-Werkstätten' || b.subcategory === 'KFZ-Werkstätten');
                const byDistrict = kfz.reduce((acc, bus) => {
                  const dist = bus.district || 'Winterberg';
                  acc[dist] = (acc[dist] || 0) + 1;
                  return acc;
                }, {} as Record<string, number>);
                
                const entries = Object.entries(byDistrict);
                const parts = entries.map(([dist, count]) => {
                  const distName = dist;
                  return `${count} in ${distName}`;
                });
                
                let distributionText = '';
                if (parts.length > 1) {
                  const last = parts.pop();
                  distributionText = `Davon befinden sich ${parts.join(', ')} und ${last}.`;
                } else if (parts.length === 1) {
                  distributionText = `Davon befinden sich alle ${parts[0]}.`;
                }

                return (
                  <div className="mt-12 p-6 bg-black/5 rounded-xl text-sm leading-relaxed text-black/80">
                    <h3 className="font-bold text-lg mb-3">KFZ Werkstätten in Winterberg</h3>
                    <p className="mb-4 font-medium">
                      Aktuell gibt es in Winterberg {kfz.length} KFZ-Werkstätten. {distributionText}
                    </p>
                    <p className="mb-2">
                      Suchen Sie eine zuverlässige <strong>Autowerkstatt</strong> oder <strong>freie Werkstatt</strong> im Raum Winterberg? Unsere verzeichneten <strong>KFZ Werkstätten in Winterberg</strong> bieten einen umfassenden <strong>Service</strong> rund um Ihr Auto. Egal, ob Sie eine schnelle <strong>Autoreparatur</strong>, einen termingerechten <strong>Reifenwechsel</strong> oder eine professionelle <strong>Reparatur</strong> bei einem Schaden benötigen – hier finden Sie kompetente Ansprechpartner für nahezu alle <strong>Automarken</strong>.
                    </p>
                    <p>
                      Zusätzlich zu typischen Reparaturen führen viele Betriebe auch die regelmäßige <strong>Inspektion</strong> durch und bereiten Ihr Fahrzeug für den <strong>TÜV</strong> (inklusive <strong>Hauptuntersuchung</strong> und <strong>Abgasuntersuchung</strong>) vor. Finden Sie jetzt den passenden Spezialisten für Ihr Fahrzeug und vertrauen Sie auf Qualität und Erfahrung direkt vor Ort.
                    </p>
                  </div>
                );
              })()}
              
              {activeCategory === 'Schreinereien' && (() => {
                const schreinereien = businesses.filter(b => b.category === 'Schreinereien' || b.subcategory === 'Schreinereien');
                const byDistrict = schreinereien.reduce((acc, bus) => {
                  const dist = bus.district || 'Winterberg';
                  acc[dist] = (acc[dist] || 0) + 1;
                  return acc;
                }, {} as Record<string, number>);
                
                const entries = Object.entries(byDistrict);
                const parts = entries.map(([dist, count]) => {
                  const distName = dist;
                  return `${count} in ${distName}`;
                });
                
                let distributionText = '';
                if (parts.length > 1) {
                  const last = parts.pop();
                  distributionText = `Davon befinden sich ${parts.join(', ')} und ${last}.`;
                } else if (parts.length === 1) {
                  distributionText = `Davon befinden sich alle ${parts[0]}.`;
                }

                return (
                  <div className="mt-12 p-6 bg-black/5 rounded-xl text-sm leading-relaxed text-black/80">
                    <h3 className="font-bold text-lg mb-3">Schreinereien & Tischlereien in Winterberg</h3>
                    <p className="mb-4 font-medium">
                      Aktuell gibt es in Winterberg {schreinereien.length} Schreinereien und Tischlereien. {distributionText}
                    </p>
                    <p className="mb-2">
                      Suchen Sie eine qualifizierte <strong>Schreinerei</strong> oder <strong>Tischlerei</strong> im Raum Winterberg? Unsere verzeichneten Handwerksbetriebe sind die perfekten Ansprechpartner für alle Arbeiten rund um <strong>Holz</strong>. Vom individuellen <strong>Möbelbau</strong> und <strong>Maßmöbeln</strong> bis hin zu hochwertigem <strong>Treppenbau</strong>, <strong>Fenstern</strong>, <strong>Türen</strong> und professionellem <strong>Innenausbau</strong>.
                    </p>
                    <p>
                      Egal ob private Wohnträume oder gewerbliche <strong>Objekteinrichtungen</strong> – vertrauen Sie auf die Erfahrung, Präzision und Kreativität der heimischen Tischler und Schreiner aus Winterberg. Entdecken Sie Fachbetriebe, die Handwerkskunst mit modernem Design verbinden.
                    </p>
                  </div>
                );
              })()}
              
              {activeCategory === 'Wäschereien' && (() => {
                const waeschereien = businesses.filter(b => b.category === 'Wäschereien' || b.subcategory === 'Wäschereien');
                const byDistrict = waeschereien.reduce((acc, bus) => {
                  const dist = bus.district || 'Winterberg';
                  acc[dist] = (acc[dist] || 0) + 1;
                  return acc;
                }, {} as Record<string, number>);
                
                const entries = Object.entries(byDistrict);
                const parts = entries.map(([dist, count]) => {
                  const distName = dist;
                  return `${count} in ${distName}`;
                });
                
                let distributionText = '';
                if (parts.length > 1) {
                  const last = parts.pop();
                  distributionText = `Davon befinden sich ${parts.join(', ')} und ${last}.`;
                } else if (parts.length === 1) {
                  distributionText = `Davon befinden sich alle ${parts[0]}.`;
                }

                return (
                  <div className="mt-12 p-6 bg-black/5 rounded-xl text-sm leading-relaxed text-black/80">
                    <h3 className="font-bold text-lg mb-3">Wäschereien & Textilreinigungen in Winterberg</h3>
                    <p className="mb-4 font-medium">
                      Aktuell gibt es in Winterberg {waeschereien.length} {waeschereien.length === 1 ? 'Wäscherei/Textilreinigung' : 'Wäschereien/Textilreinigungen'}. {distributionText}
                    </p>
                    <p className="mb-2">
                      Suchen Sie eine zuverlässige <strong>Wäscherei</strong> oder <strong>Textilreinigung</strong> in Winterberg? Unsere verzeichneten Betriebe bieten professionelle Hilfe bei der Reinigung Ihrer Textilien. Ob Alltagsbekleidung, <strong>Hemden</strong>, <strong>Anzüge</strong> oder empfindliche <strong>Abendgarderobe</strong> – hier finden Sie kompetente Unterstützung.
                    </p>
                    <p>
                      Zusätzlich bieten viele Reinigungen auch Spezialservices wie <strong>Bettdeckenreinigung</strong>, <strong>biochemische Reinigung</strong>, professionelles <strong>Bügeln</strong> oder praktische <strong>Änderungsschneidereien</strong> an. Auch Serviceleistungen für die <strong>Großwäscherei</strong> oder im Hotel- und Gastgewerbe sind in Winterberg verfügbar. Vertrauen Sie Ihre Textilien den Experten vor Ort an.
                    </p>
                  </div>
                );
              })()}
              
              {activeCategory === 'Elektriker' && (() => {
                const elektriker = businesses.filter(b => b.category === 'Elektriker' || b.subcategory === 'Elektriker');
                const byDistrict = elektriker.reduce((acc, bus) => {
                  const dist = bus.district || 'Winterberg';
                  acc[dist] = (acc[dist] || 0) + 1;
                  return acc;
                }, {} as Record<string, number>);
                
                const entries = Object.entries(byDistrict);
                const parts = entries.map(([dist, count]) => {
                  const distName = dist;
                  return `${count} in ${distName}`;
                });
                
                let distributionText = '';
                if (parts.length > 1) {
                  const last = parts.pop();
                  distributionText = `Davon befinden sich ${parts.join(', ')} und ${last}.`;
                } else if (parts.length === 1) {
                  distributionText = `Davon befinden sich alle ${parts[0]}.`;
                }

                return (
                  <div className="mt-12 p-6 bg-black/5 rounded-xl text-sm leading-relaxed text-black/80">
                    <h3 className="font-bold text-lg mb-3">Elektriker & Elektroinstallationen in Winterberg</h3>
                    <p className="mb-4 font-medium">
                      Aktuell gibt es in Winterberg {elektriker.length} Fachbetriebe für Elektroinstallationen. {distributionText}
                    </p>
                    <p className="mb-2">
                      Suchen Sie einen zuverlässigen <strong>Elektriker</strong> oder Fachbetrieb für <strong>Elektroinstallationen</strong> im Raum Winterberg? Unsere verzeichneten Experten helfen Ihnen kompetent und sicher bei allen Belangen rund um <strong>Strom</strong> und <strong>Elektronik</strong>. Vom einfachen Anschließen eines Herdes über komplexe Hausinstallationen bis hin zu <strong>Smart Home</strong>-Lösungen und <strong>Photovoltaik</strong>.
                    </p>
                    <p>
                      Auch bei Notfällen, Reparaturen oder regelmäßigen Wartungen sind die heimischen <strong>Elektrofachbetriebe</strong> schnell vor Ort. Vertrauen Sie auf geschultes Fachpersonal, um die Sicherheit und Modernität Ihrer elektrischen Anlagen zu gewährleisten.
                    </p>
                  </div>
                );
              })()}
              
              {activeCategory === 'Dachdecker' && (() => {
                const dachdecker = businesses.filter(b => b.category === 'Dachdecker' || b.subcategory === 'Dachdecker');
                const byDistrict = dachdecker.reduce((acc, bus) => {
                  const dist = bus.district || 'Winterberg';
                  acc[dist] = (acc[dist] || 0) + 1;
                  return acc;
                }, {} as Record<string, number>);
                
                const entries = Object.entries(byDistrict);
                const parts = entries.map(([dist, count]) => {
                  const distName = dist;
                  return `${count} in ${distName}`;
                });
                
                let distributionText = '';
                if (parts.length > 1) {
                  const last = parts.pop();
                  distributionText = `Davon befinden sich ${parts.join(', ')} und ${last}.`;
                } else if (parts.length === 1) {
                  distributionText = `Davon befinden sich alle ${parts[0]}.`;
                }

                return (
                  <div className="mt-12 p-6 bg-black/5 rounded-xl text-sm leading-relaxed text-black/80">
                    <h3 className="font-bold text-lg mb-3">Dachdecker & Dachdeckereien in Winterberg</h3>
                    <p className="mb-4 font-medium">
                      Aktuell gibt es in Winterberg {dachdecker.length} {dachdecker.length === 1 ? 'Dachdeckerbetrieb' : 'Dachdeckerbetriebe'}. {distributionText}
                    </p>
                    <p className="mb-2">
                      Suchen Sie einen zuverlässigen <strong>Dachdecker</strong> im Raum Winterberg? Unsere verzeichneten <strong>Dachdecker-Meisterbetriebe</strong> und Fachunternehmen bieten umfassende Dienstleistungen rund um Ihr <strong>Dach</strong> an. Von der klassischen <strong>Dacheindeckung</strong> über <strong>Dachsanierungen</strong> bis hin zu Reparaturen bei <strong>Sturmschäden</strong> sind die Profis für Sie da.
                    </p>
                    <p>
                      Auch Spezialgebiete wie <strong>Flachdachabdichtungen</strong>, fachmännische <strong>Wärmedämmung</strong>, der Einbau von <strong>Dachfenstern</strong> oder Fassadenverkleidungen gehören oft zum Portfolio. Vertrauen Sie auf die Erfahrung und das handwerkliche Geschick der regionalen <strong>Bedachungsunternehmen</strong> für Sicherheit und Werterhalt Ihres Hauses.
                    </p>
                  </div>
                );
              })()}
              
              {activeCategory === 'Supermarkt' && (() => {
                const supermaerkte = businesses.filter(b => b.category === 'Supermarkt' || b.subcategory === 'Supermarkt');
                const byDistrict = supermaerkte.reduce((acc, bus) => {
                  const dist = bus.district || 'Winterberg';
                  acc[dist] = (acc[dist] || 0) + 1;
                  return acc;
                }, {} as Record<string, number>);
                
                const entries = Object.entries(byDistrict);
                const parts = entries.map(([dist, count]) => {
                  const distName = dist;
                  return `${count} in ${distName}`;
                });
                
                let distributionText = '';
                if (parts.length > 1) {
                  const last = parts.pop();
                  distributionText = `Davon befinden sich ${parts.join(', ')} und ${last}.`;
                } else if (parts.length === 1) {
                  distributionText = `Davon befinden sich alle ${parts[0]}.`;
                }

                return (
                  <div className="mt-12 p-6 bg-black/5 rounded-xl text-sm leading-relaxed text-black/80">
                    <h3 className="font-bold text-lg mb-3">Supermärkte & Discounter in Winterberg</h3>
                    <p className="mb-4 font-medium">
                      Aktuell gibt es in Winterberg {supermaerkte.length} {supermaerkte.length === 1 ? 'Supermarkt' : 'Supermärkte'}. {distributionText}
                    </p>
                    <p className="mb-2">
                      Egal ob für den großen Wocheneinkauf oder kleine Besorgungen zwischendurch – auf dieser Seite finden Sie alle wichtigen <strong>Supermärkte</strong> und <strong>Discounter</strong> in Winterberg auf einen Blick. Neben bekannten Filialen wie <strong>Netto</strong>, <strong>Aldi</strong>, <strong>Lidl</strong> oder <strong>Edeka</strong> gibt es auch lokale <strong>Dorfläden</strong> und Frischemärkte in den kleineren Ortsteilen.
                    </p>
                    <p>
                      Möchten Sie frische <strong>Lebensmittel</strong> einkaufen, <strong>regionale Produkte</strong> entdecken, oder schnell Getränke und Snacks für Ihren Ausflug in die Natur besorgen? Unsere Übersicht hilft Ihnen, passend zu den <strong>Öffnungszeiten</strong> und Ihrem Standort in Winterberg, den jeweils nächsten Markt zu finden. Profitieren Sie von der idealen Versorgung in der Stadtlemitte und den Dörfern.
                    </p>
                  </div>
                );
              })()}
              
              {activeCategory === 'Tennisplätze' && (() => {
                const tennisvereine = businesses.filter(b => b.category === 'Tennisplätze' || b.subcategory === 'Tennisplätze');
                const byDistrict = tennisvereine.reduce((acc, bus) => {
                  const dist = bus.district || 'Winterberg';
                  acc[dist] = (acc[dist] || 0) + 1;
                  return acc;
                }, {} as Record<string, number>);
                
                const entries = Object.entries(byDistrict);
                const parts = entries.map(([dist, count]) => {
                  const distName = dist;
                  return `${count} in ${distName}`;
                });
                
                let distributionText = '';
                if (parts.length > 1) {
                  const last = parts.pop();
                  distributionText = `Davon befinden sich ${parts.join(', ')} und ${last}.`;
                } else if (parts.length === 1) {
                  distributionText = `Davon befinden sich alle ${parts[0]}.`;
                }

                return (
                  <div className="mt-12 p-6 bg-black/5 rounded-xl text-sm leading-relaxed text-black/80">
                    <h3 className="font-bold text-lg mb-3">Tennisvereine & Tennisplätze in Winterberg</h3>
                    <p className="mb-4 font-medium">
                      Aktuell gibt es in Winterberg {tennisvereine.length} {tennisvereine.length === 1 ? 'Tennisverein' : 'Tennisvereine'}. {distributionText}
                    </p>
                    <p className="mb-2">
                      Die Tennisvereine im Stadtgebiet bieten Mitgliedern und teilweise auch Gästen hervorragende Spielmöglichkeiten im Grünen. Die meisten Vereine verfügen über gepflegte <strong>Sandplätze</strong>, ideal für die Freiluftsaison von Frühjahr bis Herbst. Lediglich in Siedlinghausen wird auf einem anderen Belag gespielt.
                    </p>
                    <p>
                      Informieren Sie sich gerne direkt bei den Vereinen über Mitgliedschaften, Trainingsangebote oder Möglichkeiten der Platzbuchung für Gäste. Meist finden regelmäßig Turniere und Trainingseinheiten für alle Alters- und Leistungsklassen statt.
                    </p>
                  </div>
                );
              })()}
              
              {activeCategory === 'Fußballvereine' && (() => {
                const fussballvereine = businesses.filter(b => b.category === 'Fußballvereine' || b.subcategory === 'Fußballvereine');
                const byDistrict = fussballvereine.reduce((acc, bus) => {
                  const dist = bus.district || 'Winterberg';
                  acc[dist] = (acc[dist] || 0) + 1;
                  return acc;
                }, {} as Record<string, number>);
                
                const entries = Object.entries(byDistrict);
                const parts = entries.map(([dist, count]) => {
                  const distName = dist;
                  return `${count} in ${distName}`;
                });
                
                let distributionText = '';
                if (parts.length > 1) {
                  const last = parts.pop();
                  distributionText = `Davon befinden sich ${parts.join(', ')} und ${last}.`;
                } else if (parts.length === 1) {
                  distributionText = `Davon befinden sich alle ${parts[0]}.`;
                }

                return (
                  <div className="mt-12 p-6 bg-black/5 rounded-xl text-sm leading-relaxed text-black/80">
                    <h3 className="font-bold text-lg mb-3">Fußballvereine in Winterberg</h3>
                    <p className="mb-4 font-medium">
                      Aktuell gibt es in Winterberg {fussballvereine.length} {fussballvereine.length === 1 ? 'Fußballverein' : 'Fußballvereine'}. {distributionText}
                    </p>
                    <p className="mb-2">
                      Der Fußballsport hat in den Dörfern und der Winterberg von Winterberg eine lange Tradition. Neben Seniorenmannschaften bieten viele der Vereine auch eine hervorragende Jugendarbeit in verschiedenen Altersklassen an sowie ein breites Breitensportangebot von Gymnastik bis zu weiteren Ballsportarten.
                    </p>
                    <p>
                      Möchten Sie sich sportlich betätigen oder einfach als Zuschauer am Wochenende dabei sein? Nehmen Sie gerne direkt Kontakt mit den Ansprechpartnern der Vereine auf oder besuchen Sie die Sportplätze in den Ortsteilen.
                    </p>
                  </div>
                );
              })()}
              
              {activeCategory === 'Steuerberater' && (() => {
                const steuerberater = businesses.filter(b => b.category === 'Steuerberater' || b.subcategory === 'Steuerberater');
                const byDistrict = steuerberater.reduce((acc, bus) => {
                  const dist = bus.district || 'Winterberg';
                  acc[dist] = (acc[dist] || 0) + 1;
                  return acc;
                }, {} as Record<string, number>);
                
                const entries = Object.entries(byDistrict).sort((a, b) => (b[1] as number) - (a[1] as number));
                const parts = entries.map(([dist, count]) => {
                  const distName = dist;
                  return `${count} in ${distName}`;
                });
                
                let distributionText = '';
                if (parts.length > 1) {
                  const last = parts.pop();
                  distributionText = `Davon befinden sich ${parts.join(', ')} und ${last}.`;
                } else if (parts.length === 1) {
                  distributionText = `Davon befinden sich alle ${parts[0]}.`;
                }

                return (
                  <div className="mt-12 p-6 bg-black/5 rounded-xl text-sm leading-relaxed text-black/80">
                    <h3 className="font-bold text-lg mb-3">Steuerberater in Winterberg</h3>
                    <p className="mb-4 font-medium">
                      Aktuell gibt es im Stadtgebiet {steuerberater.length} {steuerberater.length === 1 ? 'Steuerberater / Wirtschaftsprüfer' : 'Kanzleien & Steuerberater'}. {distributionText}
                    </p>
                    <p className="mb-2">
                      Die Steuerberatungskanzleien in Winterberg bieten umfassende Unterstützung in steuerlichen und betriebswirtschaftlichen Fragen, sowohl für Unternehmen, Vereine als auch für Privatpersonen. Typischerweise gehört dazu die Erstellung von Steuererklärungen, Jahresabschlüssen, Lohnbuchhaltung, Finanzbuchhaltung und umfassende Beratung in Finanzfragen.
                    </p>
                    <p>
                      Informieren Sie sich direkt bei den jeweiligen Ansprechpartnern, um einen Termin für ein Erstgespräch zu vereinbaren.
                    </p>
                  </div>
                );
              })()}
              
              {activeCategory === 'Marketingdienstleistungen' && (() => {
                const marketing = businesses.filter(b => b.category === 'Marketingdienstleistungen' || b.subcategory === 'Marketingdienstleistungen');
                const byDistrict = marketing.reduce((acc, bus) => {
                  const dist = bus.district || 'Winterberg';
                  acc[dist] = (acc[dist] || 0) + 1;
                  return acc;
                }, {} as Record<string, number>);
                
                const entries = Object.entries(byDistrict).sort((a, b) => (b[1] as number) - (a[1] as number));
                const parts = entries.map(([dist, count]) => {
                  const distName = dist;
                  return `${count} in ${distName}`;
                });
                
                let distributionText = '';
                if (parts.length > 1) {
                  const last = parts.pop();
                  distributionText = `Davon befinden sich ${parts.join(', ')} und ${last}.`;
                } else if (parts.length === 1) {
                  distributionText = `Davon befinden sich alle ${parts[0]}.`;
                }

                return (
                  <div className="mt-12 p-6 bg-black/5 rounded-xl text-sm leading-relaxed text-black/80">
                    <h3 className="font-bold text-lg mb-3">Werbe- und Marketingagenturen in Winterberg</h3>
                    <p className="mb-4 font-medium">
                      Aktuell gibt es im Stadtgebiet {marketing.length} {marketing.length === 1 ? 'Marketingagentur' : 'Marketingagenturen'}. {distributionText}
                    </p>
                    <p className="mb-2">
                      Die Werbeagenturen und Marketing-Dienstleister in Winterberg bieten umfassende Unterstützung in den Bereichen Online-Marketing, Webdesign, SEO, Printmedien und ganzheitliche Kommunikation. Ob für lokale Unternehmen oder überregionale Werbung – die Agenturen vor Ort helfen Ihnen, sichtbar zu werden.
                    </p>
                    <p>
                      Informieren Sie sich direkt bei den jeweiligen Ansprechpartnern, um Ihr nächstes Projekt zu besprechen.
                    </p>
                  </div>
                );
              })()}
              {activeCategory === 'Bekleidung' && (() => {
                const kleidung = businesses.filter(b => b.category === 'Bekleidung' || b.subcategory === 'Bekleidung');
                const byDistrict = kleidung.reduce((acc, bus) => {
                  const dist = bus.district || 'Winterberg';
                  acc[dist] = (acc[dist] || 0) + 1;
                  return acc;
                }, {} as Record<string, number>);
                
                const entries = Object.entries(byDistrict).sort((a, b) => (b[1] as number) - (a[1] as number));
                const parts = entries.map(([dist, count]) => `${count} in ${dist}`);
                
                let distributionText = '';
                if (parts.length > 1) {
                  const last = parts.pop();
                  distributionText = `Davon befinden sich ${parts.join(', ')} und ${last}.`;
                } else if (parts.length === 1) {
                  distributionText = `Davon befinden sich alle ${parts[0]}.`;
                }
                return (
                  <div className="mt-12 p-6 bg-black/5 rounded-xl text-sm leading-relaxed text-black/80">
                    <h3 className="font-bold text-lg mb-3">Bekleidung in Winterberg</h3>
                    <p className="mb-4 font-medium">
                      Aktuell gibt es im Stadtgebiet {kleidung.length} {kleidung.length === 1 ? 'Geschäft' : 'Geschäfte'} für Bekleidung. {distributionText}
                    </p>
                    <p className="mb-2">
                      Der Einzelhandel in Winterberg bietet eine vielfältige Auswahl an Mode, Bekleidung und Accessoires für Damen, Herren und Kinder. Von Sport- und Outdoorbekleidung, die perfekt zur Region passt, bis hin zu moderner Alltagsmode und schicken Boutiquen finden Sie hier alles, was Sie brauchen.
                    </p>
                    <p>
                      Besuchen Sie die lokalen Modegeschäfte und lassen Sie sich persönlich beraten.
                    </p>
                  </div>
                );
              })()}
                </>
              )}
            </div>

          </>
        )}
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

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-4 md:px-8 py-8 mt-12 border-t border-black/10 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className={`text-center text-sm flex-1 flex flex-col items-center justify-center gap-2 ${theme.textMuted}`}>
          <div>© {new Date().getFullYear()} Winterberg Wirtschaft. {t("footerInitiative")}</div>
          <div className="flex items-center justify-center gap-4 mt-2">
            <div className="flex items-center justify-center gap-2">
              <span className="text-xs text-black/60 dark:text-white/60">{t("projectBy")}</span>
              <a href="https://sichtbar-online.com/seo-freelancer" target="_blank" rel="noopener noreferrer" className="opacity-80 hover:opacity-100 transition-opacity">
                <img src="/logo-sichtbar.png" alt="Sichtbar SEO" className="h-5 md:h-6 object-contain" />
              </a>
            </div>
            <button 
              onClick={() => setIsImpressumMode(true)} 
              className={`text-xs hover:underline`}
            >{t("impressum")}</button>
            <span className="text-xs text-black/20 dark:text-white/20">•</span>
            <button 
              onClick={() => setIsAGBMode(true)} 
              className={`text-xs hover:underline`}
            >{t("agb")}</button>
            <span className="text-xs text-black/20 dark:text-white/20">•</span>
            <button 
              onClick={() => setIsPricingMode(true)} 
              className={`text-xs hover:underline`}
            >{t("pricing")}</button>
            <span className="text-xs text-black/20 dark:text-white/20">•</span>
            <button
              onClick={() => setActiveThemeKey(activeThemeKey === 'dark' ? 'nature' : 'dark')}
              className={`flex items-center gap-1.5 text-xs hover:underline`}
              title={activeThemeKey === 'dark' ? t("activateLightTheme") : t("darkTheme") + ' aktivieren'}
            >
              {activeThemeKey === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
              {activeThemeKey === 'dark' ? t("lightTheme") : t("darkTheme")}
            </button>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-4 text-sm font-medium">
            <button
              onClick={() => {
                setLang('de');
                const curr = window.location.pathname.replace(/^\/nl/, '');
                window.history.pushState(null, '', curr || '/');
              }}
              className={`${lang === 'de' ? 'text-black font-bold' : 'text-black/60'} hover:text-black`}
            >
              DE
            </button>
            <span className="text-black/20">|</span>
            <button
              onClick={() => {
                setLang('nl');
                const curr = window.location.pathname.replace(/^\/nl/, '');
                window.history.pushState(null, '', '/nl' + (curr === '/' ? '' : curr));
              }}
              className={`${lang === 'nl' ? 'text-black font-bold' : 'text-black/60'} hover:text-black`}
            >
              NL
            </button>
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
      fetch('/api/refresh-redirects', { method: 'POST' }).catch(console.error);
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
      fetch('/api/refresh-redirects', { method: 'POST' }).catch(console.error);
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
  const [activeTab, setActiveTab] = useState<'entries' | 'seo' | 'reviews' | 'abrechnung' | 'redirects'>('entries');
  const [editingBusiness, setEditingBusiness] = useState<Business | null>(null);

  const [activeAdminCategory, setActiveAdminCategory] = useState<string>('Alle');
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
    
    // Using a tiny delay to allow React state update, or just write directly since we have the updatedBusiness
    setTimeout(async () => {
       if (updatedBusiness) {
         try {
           await setDoc(doc(db, 'businesses', businessId), updatedBusiness);
         } catch(e) {
           console.error("Firestore update failed", e);
         }
       }
    }, 0);
  };

  if (!currentUser) {
    return <Login theme={theme} activeThemeKey={activeThemeKey} onBack={onBack} />;
  }

  // Determine allowed businesses based on role
  const isAdmin = userProfile?.role === 'admin';
  const ownerBusinessId = userProfile?.businessId;
  const allowedBusinesses = isAdmin ? businesses : businesses.filter((b: Business) => b.id === ownerBusinessId || b.ownerId === userProfile?.uid);

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

  console.log("Admin Check:", isAdmin, allowedBusinesses.length, activeAdminCategory); const filteredAdminBusinesses = allowedBusinesses.filter((bus: Business) => {
    return activeAdminCategory === 'Alle' || bus.category === activeAdminCategory || bus.subcategory === activeAdminCategory;
  });

  return (
    <>
      {activeTab === 'entries' && (
        <aside className="w-full md:w-64 shrink-0">
          <div className={`sticky top-32 p-5 ${theme.cardBg} ${theme.cardBorder} ${theme.cardShadow} border ${activeThemeKey === 'modern' ? 'rounded-none' : 'rounded-xl'}`}>
            <h3 className="font-display font-bold text-lg mb-4">Admin Filter</h3>
            <nav className="flex flex-col gap-1">
              <button
                onClick={() => setActiveAdminCategory('Alle')}
                className={`w-full text-left px-4 py-2 text-sm font-medium transition-colors ${
                  activeAdminCategory === 'Alle' ? theme.categoryTagActive : theme.categoryTagInactive
                } ${activeThemeKey === 'modern' ? 'rounded-none' : 'rounded-md'}`}
              >
                Alle anzeigen
              </button>
              <div className="border-b-2 border-dotted border-black/10 my-3"></div>
              {categories.map((group) => {
                const isExpanded = expandedGroups.includes(group.name);
                return (
                  <div key={t(group.name)} className="flex flex-col gap-1 mb-2 last:mb-0">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setActiveAdminCategory(group.name);
                          if (!isExpanded) {
                            setExpandedGroups(prev => [...prev, group.name]);
                          }
                        }}
                        className={`flex-1 text-left px-4 py-3 md:py-2 text-sm font-medium transition-colors ${
                          activeAdminCategory === group.name ? theme.categoryTagActive : theme.categoryTagInactive
                        } ${activeThemeKey === 'modern' ? 'rounded-none' : 'rounded-md'}`}
                      >
                        {t(group.name)}
                      </button>
                      {group.subcategories.length > 0 && (
                        <button
                          onClick={() => {
                            setExpandedGroups(prev =>
                              isExpanded ? prev.filter(g => g !== group.name) : [...prev, group.name]
                            );
                          }}
                          className={`p-2 flex items-center justify-center transition-colors ${theme.textMuted} hover:text-black dark:hover:text-white ${activeThemeKey === 'modern' ? 'rounded-none' : 'rounded-md'}`}
                          aria-label="Toggle subcategories"
                        >
                          {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                        </button>
                      )}
                    </div>
                    {isExpanded && group.subcategories.length > 0 && (
                      <div className="flex flex-col gap-1 ml-3 border-l-2 border-black/10 dark:border-white/10 pl-2">
                        {group.subcategories.map((sub) => (
                          <button
                            key={sub}
                            onClick={() => setActiveAdminCategory(sub)}
                            className={`w-full text-left px-3 py-2 text-xs font-medium transition-colors ${
                              activeAdminCategory === sub ? theme.categoryTagActive : theme.categoryTagInactive
                            } ${activeThemeKey === 'modern' ? 'rounded-none' : 'rounded-md'}`}
                          >
                            {sub}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>
          </div>
        </aside>
      )}

      <div className={`w-full flex-1 p-6 md:p-8 border ${theme.cardBg} ${theme.cardBorder} ${theme.cardShadow} ${activeThemeKey === 'modern' ? 'rounded-none' : 'rounded-xl'}`}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-display font-bold">Admin Dashboard</h2>
          <div className="flex gap-2">
            {activeTab === 'entries' && (
              <button 
                onClick={() => { setEditingBusiness(null); setView('add'); }}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors ${theme.primaryBtn} ${activeThemeKey === 'modern' ? 'rounded-none' : 'rounded-md'}`}
              >
                <Plus className="w-4 h-4" /> {t("createEntry")}
              </button>
            )}
            <button 
              onClick={handleLogout}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors bg-black/10 hover:bg-black/20 ${theme.textBase} ${activeThemeKey === 'modern' ? 'rounded-none' : 'rounded-md'}`}
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-6 border-b border-black/10 pb-4">
          <button onClick={() => setActiveTab('entries')} className={`px-4 py-2 text-sm font-medium transition-colors ${activeTab === 'entries' ? 'bg-black text-white' : 'hover:bg-black/5'} ${activeThemeKey === 'modern' ? 'rounded-none' : 'rounded-md'} flex items-center gap-2`}>
            <ListIcon className="w-4 h-4" /> Unternehmens-Einträge
          </button>
          <button onClick={() => setActiveTab('reviews')} className={`px-4 py-2 text-sm font-medium transition-colors ${activeTab === 'reviews' ? 'bg-black text-white' : 'hover:bg-black/5'} ${activeThemeKey === 'modern' ? 'rounded-none' : 'rounded-md'} flex items-center gap-2`}>
            <Star className="w-4 h-4" /> Bewertungen
          </button>
          <button onClick={() => setActiveTab('abrechnung')} className={`px-4 py-2 text-sm font-medium transition-colors ${activeTab === 'abrechnung' ? 'bg-black text-white' : 'hover:bg-black/5'} ${activeThemeKey === 'modern' ? 'rounded-none' : 'rounded-md'} flex items-center gap-2`}>
            <FileText className="w-4 h-4" /> Abrechnung & Rechnungen
          </button>
          <button onClick={() => setActiveTab('seo')} className={`px-4 py-2 text-sm font-medium transition-colors ${activeTab === 'seo' ? 'bg-black text-white' : 'hover:bg-black/5'} ${activeThemeKey === 'modern' ? 'rounded-none' : 'rounded-md'} flex items-center gap-2`}>
            <SearchCode className="w-4 h-4" /> SEO & Sitemap
          </button>

          <button onClick={() => setActiveTab('redirects')} className={`px-4 py-2 text-sm font-medium transition-colors ${activeTab === 'redirects' ? 'bg-black text-white' : 'hover:bg-black/5'} ${activeThemeKey === 'modern' ? 'rounded-none' : 'rounded-md'} flex items-center gap-2`}>
            <Globe className="w-4 h-4" /> 301 Redirects
          </button>
        </div>

        {activeTab === 'entries' ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className={`border-b ${theme.cardBorder} opacity-70`}>
                    <th className="py-3 px-4 font-medium">Name</th>
                    <th className="py-3 px-4 font-medium hidden sm:table-cell">Kategorie</th>
                    <th className="py-3 px-4 font-medium">Status</th>
                    <th className="py-3 px-4 font-medium hidden sm:table-cell">Premium</th>
                    <th className="py-3 px-4 font-medium">Aktionen</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAdminBusinesses.map((bus: Business) => (
                    <tr key={bus.id} className={`border-b ${theme.cardBorder} hover:bg-black/5`}>
                      <td className="py-3 px-4 font-medium">{bus.name}</td>
                      <td className="py-3 px-4 hidden sm:table-cell">{bus.subcategory ? `${t(bus.category)} — ${t(bus.subcategory)}` : t(bus.category)}</td>
                      <td className="py-3 px-4">
                        {bus.status === 'pending' ? (
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-bold rounded-full">Ausstehend</span>
                        ) : (
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-bold rounded-full">Aktiv</span>
                        )}
                      </td>
                      <td className="py-3 px-4 hidden sm:table-cell">
                        <button 
                          onClick={async () => {
                            try {
                              const updated = { ...bus, isPremium: !bus.isPremium };
                              await setDoc(doc(db, 'businesses', bus.id), updated);
                              setBusinesses(businesses.map((b) => b.id === bus.id ? updated : b));
                            } catch (e) {
                              console.error(e);
                            }
                          }}
                          className={`px-3 py-1 text-xs font-bold rounded-full transition-colors ${bus.isPremium ? 'bg-orange-100 text-orange-800 hover:bg-orange-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                        >
                          {bus.isPremium ? 'Premium' : 'Standard'}
                        </button>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          {bus.status === 'pending' && (
                            <button 
                              onClick={async () => {
                                try {
                                  const updated = { ...bus, status: 'approved' };
                                  await setDoc(doc(db, 'businesses', bus.id), updated);
                                  setBusinesses(businesses.map((b: Business) => b.id === bus.id ? updated : b));
                                } catch (e) {
                                  console.error(e);
                                  alert("Fehler beim Freischalten");
                                }
                              }}
                              className={`p-2 bg-green-500/10 hover:bg-green-500/20 text-green-700 rounded-md transition-colors`}
                              title="Freischalten"
                            >
                              <BadgeCheck className="w-4 h-4" />
                            </button>
                          )}
                          <button 
                            onClick={() => { setEditingBusiness(bus); setView('edit'); }}
                            className={`p-2 bg-black/5 hover:bg-black/10 rounded-md transition-colors ${theme.textBase}`}
                            title="Bearbeiten"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(bus.id)}
                            className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-600 rounded-md transition-colors"
                            title="Löschen"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredAdminBusinesses.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-8 text-center opacity-70">Keine Einträge für diese Kategorie vorhanden.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        
        ) : activeTab === 'reviews' ? (
          <div>
            <h3 className="text-xl font-bold mb-4 font-display">Kundenbewertungen verwalten</h3>
            
            <div className="mb-6">
              <h4 className="font-bold mb-3">Ausstehende Freigaben</h4>
              {allowedBusinesses.flatMap((b: Business) => (b.reviews || []).filter(r => r.status === 'pending').map(r => ({ ...r, businessId: b.id, businessName: b.name }))).length > 0 ? (
                <div className="space-y-3">
                  {allowedBusinesses.flatMap((b: Business) => (b.reviews || []).filter(r => r.status === 'pending').map(r => ({ ...r, businessId: b.id, businessName: b.name }))).map((review) => (
                    <div key={review.id} className="bg-white/5 p-4 rounded border border-black/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div>
                        <div className="font-medium text-sm">{review.businessName} <span className="font-normal opacity-70">({review.rating} Sterne)</span></div>
                        <div className="text-sm opacity-80 mt-1">{review.text}</div>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <button 
                          onClick={() => {
                            updateBusinessInFirestore(review.businessId, b => {
                              return { ...b, reviews: (b.reviews || []).map(r => r.id === review.id ? { ...r, status: 'approved' } : r) };
                            });
                          }}
                          className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
                        >
                          Freigeben
                        </button>
                        <button 
                          onClick={() => {
                            updateBusinessInFirestore(review.businessId, b => {
                              return { ...b, reviews: (b.reviews || []).filter(r => r.id !== review.id) };
                            });
                          }}
                          className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
                        >
                          Löschen
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                 <p className="text-sm opacity-70">Keine ausstehenden Bewertungen.</p>
              )}
            </div>

            <div>
              <h4 className="font-bold mb-3">Veröffentlichte Bewertungen</h4>
              {allowedBusinesses.flatMap((b: Business) => (b.reviews || []).filter(r => r.status === 'approved').map(r => ({ ...r, businessId: b.id, businessName: b.name, isPremium: b.isPremium }))).length > 0 ? (
                <div className="space-y-3">
                  {allowedBusinesses.flatMap((b: Business) => (b.reviews || []).filter(r => r.status === 'approved').map(r => ({ ...r, businessId: b.id, businessName: b.name, isPremium: b.isPremium }))).map((review) => (
                    <div key={review.id} className="bg-white/5 p-4 rounded border border-black/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div className="w-full">
                        <div className="font-medium text-sm">{review.businessName} <span className="font-normal opacity-70">({review.rating} Sterne)</span></div>
                        <div className="text-sm opacity-80 mt-1">{review.text}</div>
                        {review.ownerReply && (
                          <div className="mt-2 pl-4 border-l-2 border-black/20 text-sm opacity-90 italic">
                            <strong>Antwort:</strong> {review.ownerReply}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col gap-2 shrink-0">
                        <div className="flex gap-2">
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
                            className={`px-3 py-1 text-white text-xs rounded transition-colors ${review.isPremium ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 opacity-70'}`}
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
                            className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
                          >
                            Löschen
                          </button>
                        </div>
                        {!review.isPremium && (
                          <span className="text-[10px] text-gray-500 text-right">Premium-Funktion</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm opacity-70">Keine veröffentlichten Bewertungen vorhanden.</p>
              )}
            </div>
          </div>
        ) : activeTab === 'abrechnung' ? (
          <div>
            <h3 className="text-xl font-bold mb-4 font-display">Abrechnung & Rechnungen</h3>
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
              <h4 className="font-bold text-orange-900 mb-2">Rechnungsstellung</h4>
              <p className="text-orange-800 text-sm mb-4">
                Ihre Rechnungen werden automatisch über unseren Zahlungsdienstleister (Stripe) generiert und nach jeder erfolgreichen Zahlung hier für Sie bereitgestellt.
              </p>
              <p className="text-orange-800 text-sm">
                Aktuell sind noch keine Zahlungen oder Rechnungen für Ihren Account hinterlegt.
              </p>
              <button disabled className="mt-4 px-4 py-2 bg-orange-200 text-orange-600 font-bold rounded text-sm cursor-not-allowed">
                Rechnung herunterladen
              </button>
            </div>
          </div>
        
        ) : activeTab === 'redirects' ? (
          <RedirectsAdminPanel theme={theme} activeThemeKey={activeThemeKey} />
        ) : (
          <SeoAdminPanel
 theme={theme} activeThemeKey={activeThemeKey} seoSettings={seoSettings} setSeoSettings={setSeoSettings} businesses={businesses} />
        )}
      </div>
    </>
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
