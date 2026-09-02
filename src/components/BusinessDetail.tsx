import React, { useState, useEffect, Suspense, lazy } from 'react';
const BusinessMap = lazy(() => import('./BusinessMap'));
import { useTranslation } from '../i18n';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, MapPin, Phone, Globe, Image as ImageIcon, BadgeCheck, Clock, List as ListIcon, ShieldCheck, Briefcase, Star, Newspaper, ExternalLink, FileText, ChevronLeft, ChevronRight, X, FileDown, FileCheck, PhoneCall, CalendarDays, UtensilsCrossed, Siren, Sparkles, Download, Tag, HelpCircle } from 'lucide-react';
import { Business, ThemeConfig, Review, BusinessNewsArticle, GalleryCategory, GalleryImage, BusinessDocument, CustomActionCta } from '../types';
import { isOpenNow, canDisplayOpeningHours } from '../utils';
import { getLocalizedBusiness } from '../utils/translator';
import { getBusinessReviewUsps } from '../utils/reviewUsps';
import ReviewForm from './ReviewForm';
import { useAuth } from '../AuthContext';
import Login from './Login';
import BusinessCategoryIcon from './BusinessCategoryIcon';
import WidgetGeneratorModal from './WidgetGeneratorModal';
import { getBusinessPath } from '../utils/routes';
import { RankingInfoModal } from './RankingInfoModal';
import { RankingBadge } from './RankingBadge';
import { getBusinessRankingBadge } from '../utils/bestOfRankingBadges';
import FuelPriceWidget from './FuelPriceWidget';

interface BusinessDetailProps {
  business: Business;
  onBack: () => void;
  theme: ThemeConfig;
  activeThemeKey: string;
  onReviewSubmit?: (businessId: string, review: Review) => void;
  similarBusinesses?: Business[];
  allBusinesses?: Business[];
  onNavigateToFuelPrices?: () => void;
}

export default function BusinessDetail({ business, onBack, theme, activeThemeKey, onReviewSubmit, similarBusinesses = [], allBusinesses = [], onNavigateToFuelPrices }: BusinessDetailProps) {

  const { t, lang } = useTranslation();
  const localized = getLocalizedBusiness(business, lang);
  const { currentUser: user } = useAuth();
  const rankingBadge = getBusinessRankingBadge(business, allBusinesses.length > 0 ? allBusinesses : (similarBusinesses.length > 0 ? [business, ...similarBusinesses] : [business]));
  const [showClaimScreen, setShowClaimScreen] = useState(false);
  const [showLoginScreen, setShowLoginScreen] = useState(false);
  const [showWidgetModal, setShowWidgetModal] = useState(false);
  const [isLoadingCheckout, setIsLoadingCheckout] = useState(false);
  
  const [isReportingError, setIsReportingError] = useState(false);
  const [errorReportText, setErrorReportText] = useState('');
  const [reportSuccess, setReportSuccess] = useState(false);
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);
  
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [infoModalTopic, setInfoModalTopic] = useState<'score' | 'verified'>('verified');

  // Categorized Gallery State
  const [activeGalleryTab, setActiveGalleryTab] = useState<string>('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Normalize gallery categories with fallback for legacy flat gallery
  const rawCategories: GalleryCategory[] = Array.isArray(business.galleryCategories) && business.galleryCategories.length > 0
    ? business.galleryCategories.map(c => ({
        id: c.id,
        name: lang === 'nl' && c.name_nl ? c.name_nl : c.name,
        name_nl: c.name_nl,
        images: (c.images || []).map((img: any) => typeof img === 'string' ? { url: img, alt: '', title: '' } : { url: img.url || '', alt: img.alt || '', title: img.title || '' })
      }))
    : (Array.isArray(business.gallery) && business.gallery.length > 0
        ? [{
            id: 'cat_default',
            name: lang === 'nl' ? 'Impressies' : 'Impressionen',
            name_nl: 'Impressies',
            images: business.gallery.map((url: any) => ({ url: typeof url === 'string' ? url : (url?.url || ''), alt: '', title: '' }))
          }]
        : []);

  const galleryCategories = rawCategories.filter(c => c.images.length > 0);
  const allGalleryImages = galleryCategories.flatMap(c => c.images.map(img => ({ ...img, categoryName: c.name })));

  const displayedImages = activeGalleryTab === 'all'
    ? allGalleryImages
    : (galleryCategories.find(c => c.id === activeGalleryTab)?.images.map(img => ({ ...img, categoryName: galleryCategories.find(c => c.id === activeGalleryTab)?.name || '' })) || []);

  const currentLightboxImage = lightboxIndex !== null ? displayedImages[lightboxIndex] : null;

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (lightboxIndex === null) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setLightboxIndex(null);
      } else if (e.key === 'ArrowLeft') {
        setLightboxIndex(prev => prev !== null && prev > 0 ? prev - 1 : displayedImages.length - 1);
      } else if (e.key === 'ArrowRight') {
        setLightboxIndex(prev => prev !== null && prev < displayedImages.length - 1 ? prev + 1 : 0);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, displayedImages.length]);

  const handleReportError = async () => {
    if (!errorReportText.trim()) return;
    setIsSubmittingReport(true);
    try {
      const res = await fetch('/api/report-error', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessId: business.id,
          businessName: business.name,
          message: errorReportText
        })
      });
      if (res.ok) {
        setReportSuccess(true);
        setTimeout(() => {
          setIsReportingError(false);
          setReportSuccess(false);
          setErrorReportText('');
        }, 3000);
      } else {
        alert("Fehler beim Senden. Bitte später versuchen.");
      }
    } catch (e) {
      alert("Ein Fehler ist aufgetreten.");
    } finally {
      setIsSubmittingReport(false);
    }
  };

  const handleClaim = async () => {
    setIsLoadingCheckout(true);
    try {
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          businessId: business.id, 
          email: business.email || user?.email, 
          billingCycle: 'monthly',
          ownerId: user?.uid || null,
          ownerEmail: user?.email || null
        })
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
        return;
      } else {
        throw new Error(data.error || 'Fehler beim Weiterleiten zu Stripe');
      }
    } catch (err) {
      console.error(err);
      alert("Fehler beim Checkout. Bitte später erneut versuchen.");
      setIsLoadingCheckout(false);
    }
  };

  const telHref = business.phone ? `tel:${String(business.phone).replace(/[^0-9+]/g, '')}` : undefined;
  const webHref = business.website ? (String(business.website).startsWith('http') ? String(business.website) : `https://${business.website}`) : undefined;
  const showHours = canDisplayOpeningHours(business);
  const openState = showHours && business.openingHours && typeof business.openingHours === 'object' ? isOpenNow(business.openingHours, t) : null;
  const approvedReviews = Array.isArray(business.reviews) 
    ? business.reviews.filter(r => !r.status || r.status === 'approved') 
    : [];
  const avgRating = approvedReviews.length > 0 
    ? (approvedReviews.reduce((acc, r) => acc + (Number(r?.rating) || 0), 0) / approvedReviews.length).toFixed(1)
    : null;
  const reviewUsps = getBusinessReviewUsps(business, lang);
  const headerBg = business.isPremium ? (business.headerImage || business.uploadedImage || business.imageLink) : undefined;

  return (
    <main className="flex-1 relative">
      
      {/* Checkout/Claim Overlay */}
      <AnimatePresence>
        {showLoginScreen && !user && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-[#FAF8F5] overflow-y-auto"
          >
            <div className="min-h-screen flex flex-col pt-10">
              <div className="text-center px-6">
                <h2 className="text-2xl font-bold mb-2">Bitte loggen Sie sich ein</h2>
                <p className="text-[#5F6B63]">Um dieses Unternehmen zu bearbeiten oder zu beanspruchen, benötigen Sie ein Konto.</p>
              </div>
              <Login theme={theme} activeThemeKey={activeThemeKey} onBack={() => setShowLoginScreen(false)} />
            </div>
          </motion.div>
        )}

        {showClaimScreen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-white/95 backdrop-blur-sm flex items-center justify-center p-6"
          >
            <div className="max-w-md w-full bg-white p-8 border border-[#EDE8E0] rounded-lg flex flex-col items-center text-center shadow-[0_10px_30px_rgba(27,33,29,0.06)]">
              <ShieldCheck className="w-16 h-16 text-emerald-500 mb-6" />
              <h2 className="text-2xl font-display font-bold mb-4">Sicheren Zugriff anfordern</h2>
              <p className="mb-6 opacity-80 leading-relaxed text-[#4A544D]">
                Eintrag übernehmen für <strong>{business.name}</strong>
              </p>
              
              <div className="flex flex-col w-full gap-3">
                <button 
                  onClick={handleClaim}
                  disabled={isLoadingCheckout}
                  className="w-full bg-[#F2761B] text-white border-none rounded-md py-3 text-[16px] font-semibold cursor-pointer hover:bg-[#D65F0C] transition-colors disabled:opacity-50"
                >
                  {isLoadingCheckout ? "Lade Checkout..." : "Eintrag übernehmen"}
                </button>
                <div className="text-center text-[13px] text-[#5F6B63] mb-1">
                  <a href="/preise" target="_blank" rel="noopener noreferrer" className="underline hover:text-[#0F4C2E]">Leistungen eines Premium-Accounts ansehen</a>
                </div>
                <button 
                  onClick={() => setShowClaimScreen(false)}
                  disabled={isLoadingCheckout}
                  className="w-full bg-transparent border-none text-[#5F6B63] py-2.5 text-[15px] cursor-pointer hover:underline disabled:opacity-50"
                >
                  {t("cancel")}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dynamic responsive background position style */}
      {headerBg && (
        <style>{`
          .hero-header-bg-${business.id} {
            background-position: ${business.headerPosition?.mobile || '50% 50%'};
          }
          @media (min-width: 640px) {
            .hero-header-bg-${business.id} {
              background-position: ${business.headerPosition?.tablet || business.headerPosition?.desktop || '50% 50%'};
            }
          }
          @media (min-width: 1024px) {
            .hero-header-bg-${business.id} {
              background-position: ${business.headerPosition?.desktop || '50% 50%'};
            }
          }
        `}</style>
      )}

      <div 
        className={`bg-gradient-to-br from-[#0F4C2E] to-[#06301C] text-white relative overflow-hidden ${headerBg ? `hero-header-bg-${business.id}` : ''}`}
        style={headerBg ? {
          backgroundImage: `linear-gradient(105deg, rgba(6,48,28,0.95) 0%, rgba(15,76,46,0.88) 55%, rgba(15,76,46,0.42) 100%), url(${headerBg})`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat'
        } : undefined}
      >
        <div className="max-w-[1000px] mx-auto px-6 pt-[34px] pb-[46px]">
          <div className="flex items-center gap-3 mb-[26px]">
            <button 
              type="button" 
              onClick={onBack} 
              className="bg-white/10 border border-white/20 text-white rounded-md px-3.5 py-1.5 text-[14px] cursor-pointer inline-flex items-center gap-2 hover:bg-white/20 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              {t("back")}
            </button>
            
            {!business.isPremium && (
              <button 
                type="button"
                onClick={() => {
                  if (!user) {
                    setShowLoginScreen(true);
                  } else {
                    setShowClaimScreen(true);
                  }
                }}
                className="bg-[#F2761B] hover:bg-[#D65F0C] text-white rounded-md px-3.5 py-1.5 text-[14px] font-semibold cursor-pointer transition-colors shadow"
              >
                {lang === 'nl' ? 'Upgraden naar Premium' : 'Auf Premium upgraden'}
              </button>
            )}
          </div>

          <div className="flex gap-2 flex-wrap mb-[14px] items-center">
            <span className="bg-white/10 rounded px-2.5 py-1 text-[13px]">{t(business.category)}</span>
            {business.subcategory && (
              <span className="bg-white/10 rounded px-2.5 py-1 text-[13px]">{t(business.subcategory)}</span>
            )}
            {business.isPremium && (
              <span className="bg-[#F2761B] rounded px-2.5 py-1 text-[13px] font-semibold">Premium</span>
            )}

            {/* Official Top 10 / Top 5 / Top 3 / Top 1 Ranking Badge for Premium */}
            {rankingBadge && (
              <RankingBadge 
                badge={rankingBadge} 
                lang={lang} 
                variant="seal" 
              />
            )}

            {business.isVerified && (
              <button 
                type="button"
                onClick={() => {
                  setInfoModalTopic('verified');
                  setIsInfoModalOpen(true);
                }}
                className="bg-white/10 hover:bg-white/20 transition-colors rounded px-2.5 py-1 text-[13px] inline-flex items-center gap-1.5 cursor-pointer shadow-2xs"
                title="Was bedeutet 'Verifiziert'? Hier klicken für Details"
              >
                <span>{lang === 'nl' ? '✓ Geverifieerd' : '✓ Verifiziert'}</span>
                <HelpCircle className="w-3.5 h-3.5 text-white/80" />
              </button>
            )}
            {openState && (
              <span className={`rounded px-2.5 py-1 text-[13px] font-semibold ${openState.isOpen ? 'bg-[#E8F1EB] text-[#0F4C2E]' : 'bg-[#FFF1E4] text-[#D65F0C]'}`}>
                {openState.text}
              </span>
            )}
          </div>
          
          <h1 className="font-display text-[clamp(30px,4.6vw,50px)] font-bold mb-[12px] leading-[1.08]">{business.name}</h1>
          
          <div className="flex items-center gap-4 flex-wrap text-[16px] text-white/80">
            <span className="inline-flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              {business.address}
            </span>
            {avgRating ? (
              <button
                type="button"
                onClick={() => {
                  setInfoModalTopic('score');
                  setIsInfoModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 hover:bg-white/15 px-2.5 py-1 rounded-md transition-colors cursor-pointer text-left"
                title="Informationen zur Berechnung des Scores"
              >
                <span className="text-[#F2761B] tracking-[1px]">
                  {Array.from({length: 5}).map((_, i) => (
                    <span key={i}>{i < Math.round(Number(avgRating)) ? '★' : '☆'}</span>
                  ))}
                </span>
                <span>{avgRating} · {approvedReviews.length} {lang === 'nl' ? 'beoordelingen' : 'Bewertungen'}</span>
                <HelpCircle className="w-3.5 h-3.5 text-white/70 ml-0.5" />
              </button>
            ) : (
              <a
                href="#bewertungen"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('bewertungen')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-1.5 bg-white/15 hover:bg-white/25 px-3 py-1 rounded-md text-[13.5px] font-semibold transition-colors cursor-pointer text-white"
              >
                <Star className="w-4 h-4 text-amber-300 fill-amber-300" />
                <span>{lang === 'nl' ? 'Geef de eerste beoordeling' : 'Gebe die erste Bewertung ab'}</span>
              </a>
            )}
          </div>

          {reviewUsps.length > 0 && (
            <div className="mt-4 pt-3.5 border-t border-white/20 flex items-center gap-2.5 flex-wrap text-[14.5px] text-white/95">
              <span className="font-semibold text-white/90">
                {lang === 'nl' ? 'Gebruikers beoordelen het bedrijf als:' : 'Nutzer bewerten das Unternehmen als:'}
              </span>
              <div className="flex items-center gap-2 flex-wrap">
                {reviewUsps.map((usp, idx) => (
                  <span 
                    key={idx} 
                    className="bg-white/20 backdrop-blur-xs text-white rounded-full px-3 py-0.5 text-[13px] font-semibold border border-white/25 flex items-center gap-1.5 shadow-xs"
                  >
                    <span className="text-[#F2761B] text-[12px] font-bold">✓</span>
                    {usp}
                  </span>
                ))}
              </div>
            </div>
          )}

          {business.isPremium && Array.isArray(business.featureBadges) && business.featureBadges.length > 0 && (
            <div className="mt-3.5 pt-3 border-t border-white/15 flex items-center gap-2 flex-wrap">
              {business.featureBadges.map((badge, bIdx) => (
                <span 
                  key={bIdx}
                  className="bg-white/15 backdrop-blur-xs text-white rounded-full px-3 py-1 text-[13px] font-medium border border-white/20 flex items-center gap-1.5 shadow-2xs"
                >
                  {badge}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-[1000px] mx-auto px-6 py-[40px] grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-[26px] items-start">
        <div className="bg-white border border-[#EDE8E0] rounded-lg p-7 shadow-[0_10px_30px_rgba(27,33,29,0.06)]">
          <h2 className="font-display text-[22px] font-semibold mb-3">{lang === 'nl' ? 'Over het bedrijf' : 'Über das Unternehmen'}</h2>
          <p className="text-[16.5px] leading-[1.7] text-[#4A544D] mb-6 whitespace-pre-wrap">{localized.description}</p>
          
          {localized.extendedDescription && (
            <div 
              className="text-[16px] leading-[1.7] text-[#4A544D] mb-[26px] prose prose-sm md:prose-base max-w-none"
              dangerouslySetInnerHTML={{ __html: localized.extendedDescription }}
            />
          )}

          {/* Categorized Gallery Section (Premium) */}
          {business.isPremium && allGalleryImages.length > 0 && (
            <div className="mb-[34px]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3.5">
                <h2 className="font-display text-[22px] font-semibold">{lang === 'nl' ? 'Fotogalerij' : 'Bildergalerie'}</h2>
                
                {/* Category Filter Pills (if multiple categories exist) */}
                {galleryCategories.length > 1 && (
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <button
                      type="button"
                      onClick={() => setActiveGalleryTab('all')}
                      className={`text-xs px-3 py-1 rounded-full font-medium transition-colors cursor-pointer ${
                        activeGalleryTab === 'all'
                          ? 'bg-[#0F4C2E] text-white shadow-xs'
                          : 'bg-[#FAF8F5] text-[#5F6B63] hover:bg-[#E8F1EB] hover:text-[#0F4C2E] border border-[#EDE8E0]'
                      }`}
                    >
                      {lang === 'nl' ? 'Alle' : 'Alle'} ({allGalleryImages.length})
                    </button>
                    {galleryCategories.map(cat => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setActiveGalleryTab(cat.id)}
                        className={`text-xs px-3 py-1 rounded-full font-medium transition-colors cursor-pointer ${
                          activeGalleryTab === cat.id
                            ? 'bg-[#0F4C2E] text-white shadow-xs'
                            : 'bg-[#FAF8F5] text-[#5F6B63] hover:bg-[#E8F1EB] hover:text-[#0F4C2E] border border-[#EDE8E0]'
                        }`}
                      >
                        {cat.name} ({cat.images.length})
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Gallery Image Grid with SEO Alt/Title and Lightbox Trigger */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {displayedImages.map((img, i) => {
                  const altText = img.alt || `${business.name} – ${img.categoryName}`;
                  const titleText = img.title || img.categoryName;
                  return (
                    <div 
                      key={i} 
                      onClick={() => setLightboxIndex(i)}
                      className="group relative h-[150px] sm:h-[180px] rounded-lg overflow-hidden border border-[#EDE8E0] bg-[#FAF8F5] cursor-pointer shadow-2xs hover:shadow-md transition-all"
                    >
                      <img 
                        src={img.url} 
                        alt={altText} 
                        title={titleText}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2.5">
                        <span className="text-white text-xs font-semibold truncate drop-shadow">
                          {titleText || altText}
                        </span>
                        <span className="text-white/80 text-[11px] truncate">
                          {img.categoryName}
                        </span>
                      </div>
                      <div className="absolute top-2 left-2 bg-black/40 backdrop-blur-xs text-white text-[10px] font-medium px-2 py-0.5 rounded shadow-xs opacity-90">
                        {img.categoryName}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {Array.isArray(localized.services) && localized.services.length > 0 && (
            <>
              <div className="flex items-center justify-between mb-3.5">
                <h2 className="font-display text-[22px] font-semibold">{lang === 'nl' ? 'Diensten & Services' : 'Leistungen & Services'}</h2>
                {!business.isPremium && localized.services.length > 3 && (
                  <span className="text-[12px] text-[#5F6B63] bg-[#FAF8F5] border border-[#EDE8E0] px-2.5 py-0.5 rounded">
                    {lang === 'nl' ? '3 van ' + localized.services.length + ' getoond (Basis)' : '3 von ' + localized.services.length + ' angezeigt (Basis)'}
                  </span>
                )}
              </div>
              <div className="flex gap-2 flex-wrap mb-[30px]">
                {(business.isPremium ? localized.services.slice(0, 15) : localized.services.slice(0, 3)).map((svc, i) => (
                  <span key={i} className="bg-[#E8F1EB] text-[#0F4C2E] border border-[#0F4C2E]/15 rounded-md px-3 py-1.5 text-[14px] font-medium">{svc}</span>
                ))}
              </div>
            </>
          )}

          {Array.isArray(localized.products) && localized.products.length > 0 && (
            <>
              <div className="flex items-center justify-between mb-3.5">
                <h2 className="font-display text-[22px] font-semibold">{lang === 'nl' ? 'Producten & Aanbod' : 'Produkte & Angebote'}</h2>
                {!business.isPremium && localized.products.length > 3 && (
                  <span className="text-[12px] text-[#5F6B63] bg-[#FAF8F5] border border-[#EDE8E0] px-2.5 py-0.5 rounded">
                    {lang === 'nl' ? '3 van ' + localized.products.length + ' getoond (Basis)' : '3 von ' + localized.products.length + ' angezeigt (Basis)'}
                  </span>
                )}
              </div>
              <div className="flex gap-2 flex-wrap mb-[30px]">
                {(business.isPremium ? localized.products.slice(0, 15) : localized.products.slice(0, 3)).map((prod, i) => (
                  <span key={i} className="bg-[#FFF1E4] text-[#D65F0C] border border-[#F2761B]/25 rounded-md px-3 py-1.5 text-[14px] font-medium">{prod}</span>
                ))}
              </div>
            </>
          )}

          {/* Live Spritpreise Widget (nur bei Tankstellen) */}
          <FuelPriceWidget
            business={business}
            lang={lang}
            onNavigateToFuelPrices={onNavigateToFuelPrices}
          />

          {/* PDF Documents, Speisekarten & Preislisten (Premium) */}
          {business.isPremium && Array.isArray(business.documents) && business.documents.length > 0 && (
            <div className="mb-[34px]">
              <div className="flex items-center justify-between mb-3.5">
                <h2 className="font-display text-[22px] font-semibold flex items-center gap-2">
                  <FileDown className="w-5 h-5 text-[#F2761B]" />
                  {lang === 'nl' ? 'Menukaarten, Prijslijsten & Downloads' : 'Speisekarten, Preislisten & Downloads'}
                </h2>
                <span className="text-xs text-[#5F6B63] bg-[#FAF8F5] border border-[#EDE8E0] px-2.5 py-0.5 rounded">
                  {business.documents.length} {business.documents.length === 1 ? (lang === 'nl' ? 'document' : 'Dokument') : (lang === 'nl' ? 'documenten' : 'Dokumente')}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {business.documents.map((docItem) => {
                  const typeLabel = docItem.type === 'menu' ? (lang === 'nl' ? '🍽️ Menukaart' : '🍽️ Speisekarte')
                    : docItem.type === 'pricelist' ? (lang === 'nl' ? '🏷️ Prijslijst' : '🏷️ Preisliste')
                    : docItem.type === 'flyer' ? (lang === 'nl' ? '📰 Flyer' : '📰 Flyer')
                    : docItem.type === 'brochure' ? (lang === 'nl' ? '📖 Brochure' : '📖 Broschüre')
                    : (lang === 'nl' ? '📁 Document' : '📁 Dokument');

                  return (
                    <a
                      key={docItem.id}
                      href={docItem.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group bg-[#FAF8F5] hover:bg-[#F2F7F4] border border-[#EDE8E0] hover:border-[#0F4C2E]/40 rounded-xl p-4 transition-all duration-200 shadow-2xs hover:shadow-md flex items-start justify-between gap-3 text-left"
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="w-11 h-11 rounded-lg bg-red-50 text-red-600 border border-red-100 flex items-center justify-center shrink-0 font-bold text-xs shadow-2xs group-hover:scale-105 transition-transform">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <span className="inline-block text-[11px] font-bold text-[#0F4C2E] uppercase tracking-wider mb-0.5">
                            {typeLabel}
                          </span>
                          <h3 className="font-semibold text-[15px] text-[#1B211D] group-hover:text-[#0F4C2E] transition-colors line-clamp-1">
                            {docItem.title}
                          </h3>
                          {docItem.fileSize && (
                            <span className="text-xs text-[#8A928B] block mt-0.5">
                              PDF · {docItem.fileSize}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="w-8 h-8 rounded-full bg-white border border-[#EDE8E0] group-hover:bg-[#0F4C2E] group-hover:text-white text-[#5F6B63] flex items-center justify-center shrink-0 transition-colors shadow-2xs mt-1">
                        <Download className="w-4 h-4" />
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>
          )}

          {showHours && business.openingHours && typeof business.openingHours === 'object' && !Array.isArray(business.openingHours) && (
            <>
              <h2 className="font-display text-[22px] font-semibold mb-3.5">{lang === 'nl' ? 'Openingstijden' : 'Öffnungszeiten'}</h2>
              <div className="border border-[#EDE8E0] rounded-md overflow-hidden mb-[30px]">
                {Object.entries(business.openingHours).map(([day, hours], i) => (
                  <div key={day} className={`flex justify-between py-3 px-4 text-[15px] border-b border-[#F3F0EA] last:border-b-0 ${i % 2 === 0 ? 'bg-white' : 'bg-[#FAF8F5]'}`}>
                    <span className="text-[#4A544D] capitalize w-24">
                      {
                        day === 'monday' ? t('monday') :
                        day === 'tuesday' ? t('tuesday') :
                        day === 'wednesday' ? t('wednesday') :
                        day === 'thursday' ? t('thursday') :
                        day === 'friday' ? t('friday') :
                        day === 'saturday' ? t('saturday') : t('sunday')
                      }
                    </span>
                    <span className="font-semibold text-black">{hours}</span>
                  </div>
                ))}
              </div>
            </>
          )}

          {Array.isArray(business.jobs) && business.jobs.length > 0 && (
            <>
              <h2 className="font-display text-[22px] font-semibold mb-3.5">{lang === 'nl' ? 'Vacatures' : 'Offene Stellen'}</h2>
              <div className="grid gap-2.5 mb-[30px]">
                {business.jobs.map(j => (
                  <div key={j.id} className="border border-[#EDE8E0] rounded-md p-4">
                    <div className="flex justify-between gap-3 items-baseline">
                      <div className="font-display text-[17px] font-semibold">{j.title}</div>
                      <span className="bg-[#FFF1E4] text-[#D65F0C] rounded px-2.5 py-0.5 text-[12px] font-semibold">{j.type}</span>
                    </div>
                    <p className="mt-2 text-[14.5px] text-[#4A544D] leading-[1.55]">{j.description}</p>
                  </div>
                ))}
              </div>
            </>
          )}

          <h2 className="font-display text-[22px] font-semibold mb-3.5">{lang === 'nl' ? 'Beoordelingen' : 'Bewertungen'}</h2>
          <div className="grid gap-3 mb-5">
            {Array.isArray(business.reviews) && business.reviews.filter(r => !r.status || r.status === 'approved').length > 0 ? (
              business.reviews.filter(r => !r.status || r.status === 'approved').map(r => {
                const author = r.authorName || (r as any).author || (r as any).name || (lang === 'nl' ? 'Bezoeker' : 'Besucher');
                return (
                  <div key={r.id} className="bg-[#FAF8F5] border border-[#EDE8E0] rounded-md p-4">
                    <div className="flex justify-between gap-2.5 items-center mb-1">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-[#0F4C2E]/10 text-[#0F4C2E] flex items-center justify-center font-bold text-xs uppercase shrink-0">
                          {author.charAt(0)}
                        </div>
                        <div>
                          <div className="font-semibold text-[15px] text-[#1B211D]">{author}</div>
                          {r.date && (
                            <div className="text-[11.5px] text-[#8A928B]">
                              {new Date(r.date).toLocaleDateString(lang === 'nl' ? 'nl-NL' : 'de-DE', { year: 'numeric', month: 'short', day: 'numeric' })}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-[#F2761B] text-[15px] tracking-[2px] shrink-0">
                        {Array.from({length: 5}).map((_, i) => (
                          <span key={i}>{i < r.rating ? '★' : '☆'}</span>
                        ))}
                      </div>
                    </div>
                    <p className="mt-2 text-[14.5px] text-[#4A544D] leading-[1.6]">{r.text || (r as any).comment || ''}</p>
                    {r.ownerReply && (
                      <div className="mt-3 ml-3 pl-3 border-l-2 border-[#0F4C2E] bg-white rounded p-2.5 text-xs text-[#5F6B63]">
                        <div className="font-bold text-[#0F4C2E] mb-1">
                          {lang === 'nl' ? 'Reactie van eigenaar:' : 'Antwort des Inhabers:'}
                        </div>
                        <p className="m-0 leading-relaxed">{r.ownerReply}</p>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <p className="text-[#8A928B] text-[15px] m-0">{lang === 'nl' ? 'Nog geen beoordelingen — wees de eerste stem!' : 'Noch keine Bewertungen — sei die erste Stimme.'}</p>
            )}
          </div>

          {onReviewSubmit && (
            <div className="mt-6 border-t border-[#EDE8E0] pt-6">
              <ReviewForm business={business} onReviewSubmit={onReviewSubmit} />
            </div>
          )}

          {/* Business News – visible immediately after publishing (Premium only) */}
          {business.isPremium && Array.isArray(business.businessNews) && business.businessNews.filter(n => n.status === 'published').length > 0 && (
            <div className="mt-8 border-t border-[#EDE8E0] pt-6">
              <h2 className="font-display text-[22px] font-semibold mb-4 flex items-center gap-2.5">
                <Newspaper className="w-5 h-5 text-[#F2761B]" />
                {lang === 'nl' ? 'Actueel van dit bedrijf' : 'Aktuelles vom Unternehmen'}
              </h2>
              <div className="grid gap-4">
                {business.businessNews
                  .filter(n => n.status === 'published')
                  .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
                  .map((article) => (
                    <div key={article.id} className="bg-[#FAF8F5] border border-[#EDE8E0] rounded-lg overflow-hidden hover:border-[#0F4C2E]/40 transition-colors group">
                      {article.imageUrl && (
                        <img
                          src={article.imageUrl}
                          alt={article.title}
                          className="w-full h-[180px] object-cover"
                        />
                      )}
                      <div className="p-4">
                        <div className="text-[11.5px] text-[#8A928B] mb-2">
                          {new Date(article.publishedAt).toLocaleDateString(lang === 'nl' ? 'nl-NL' : 'de-DE', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </div>
                        <h3 className="font-display text-[17px] font-semibold text-[#1B211D] mb-2 group-hover:text-[#0F4C2E] transition-colors leading-snug">
                          {article.title}
                        </h3>
                        <p className="text-[14px] text-[#4A544D] leading-relaxed mb-3">
                          {article.excerpt}
                        </p>
                        {article.externalLink && (
                          <a
                            href={article.externalLink.startsWith('http') ? article.externalLink : `https://${article.externalLink}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#0F4C2E] hover:text-[#F2761B] transition-colors"
                          >
                            {lang === 'nl' ? 'Meer lezen' : 'Mehr lesen'}
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>

        <aside className="sticky top-[116px] flex flex-col gap-4">
          {/* Dedicated Premium Logo Card */}
          {business.isPremium && business.logoUrl && (
            <div 
              className="border border-[#EDE8E0] rounded-lg overflow-hidden shadow-[0_10px_30px_rgba(27,33,29,0.06)] h-36 sm:h-44 w-full flex items-center justify-center p-3 sm:p-4 transition-colors"
              style={{ backgroundColor: business.logoBgColor || '#ffffff' }}
            >
              <img 
                src={business.logoUrl} 
                alt={`Logo von ${business.name}`} 
                className="max-w-full max-h-full object-contain" 
              />
            </div>
          )}

          <div className="bg-white border border-[#EDE8E0] rounded-lg p-6 shadow-[0_10px_30px_rgba(27,33,29,0.06)] flex flex-col gap-3">
            <div className="flex justify-between items-start mb-1">
              <div className="font-display text-[18px] font-semibold mt-1">{t("contact")}</div>
              {(!business.isPremium || !business.logoUrl) && (
                <BusinessCategoryIcon 
                  category={business.category} 
                  subcategory={business.subcategory} 
                  name={business.name} 
                  isPremium={business.isPremium} 
                  size="lg"
                  className="w-12 h-12"
                />
              )}
            </div>

            {/* Custom Action CTA Button (Premium) */}
            {business.isPremium && business.customCta && business.customCta.text && business.customCta.url && (
              <a
                href={business.customCta.url}
                target={business.customCta.url.startsWith('http') ? '_blank' : undefined}
                rel={business.customCta.url.startsWith('http') ? 'noopener noreferrer' : undefined}
                className={`w-full flex items-center justify-center gap-2 rounded-md py-3 px-4 text-[15px] font-bold shadow-sm transition-all duration-200 hover:scale-[1.02] text-center cursor-pointer ${
                  business.customCta.type === 'emergency'
                    ? 'bg-[#DC2626] hover:bg-[#B91C1C] text-white shadow-red-500/20 animate-pulse'
                    : business.customCta.type === 'table'
                    ? 'bg-[#D65F0C] hover:bg-[#B94F08] text-white shadow-orange-500/20'
                    : 'bg-[#0F4C2E] hover:bg-[#06301C] text-white shadow-emerald-900/20'
                }`}
              >
                {business.customCta.type === 'table' && <UtensilsCrossed className="w-4 h-4" />}
                {business.customCta.type === 'emergency' && <Siren className="w-4 h-4" />}
                {business.customCta.type === 'booking' && <CalendarDays className="w-4 h-4" />}
                {business.customCta.type === 'rental' && <Sparkles className="w-4 h-4" />}
                {business.customCta.type === 'inquiry' && <FileCheck className="w-4 h-4" />}
                {!['table', 'emergency', 'booking', 'rental', 'inquiry'].includes(business.customCta.type || '') && <ExternalLink className="w-4 h-4" />}
                <span>{business.customCta.text}</span>
              </a>
            )}
          
          {business.phone && telHref && (
            <a href={telHref} className="flex items-center gap-[11px] bg-[#F2761B] text-white rounded-md py-3 px-4 text-[15px] font-semibold hover:bg-[#D65F0C] transition-colors">
              <Phone className="w-4 h-4" />
              {business.phone}
            </a>
          )}
          
          {business.isPremium && business.website && webHref && (
            <a href={webHref} target="_blank" rel="noopener noreferrer" className="flex items-center gap-[11px] bg-[#E8F1EB] text-[#0F4C2E] rounded-md py-3 px-4 text-[15px] font-semibold hover:bg-[#D6E7DC] transition-colors">
              <Globe className="w-4 h-4" />
              {lang === 'nl' ? 'Website bezoeken' : 'Website öffnen'}
            </a>
          )}
          {/* Map for all businesses */}
          <Suspense fallback={
            <div className="w-full h-[200px] bg-[#F0EDE7] rounded-lg flex items-center justify-center border border-[#EDE8E0] animate-pulse">
              <MapPin className="w-6 h-6 text-[#C5BFAF]" />
            </div>
          }>
            <BusinessMap business={business} lang={lang} />
          </Suspense>

          {/* Address – prominent for all accounts, street and city on separate lines */}
          {(() => {
            const parts = business.address.split(',');
            const street = parts[0]?.trim() || business.address;
            const city = parts.slice(1).join(',').trim();
            return (
              <div className="flex items-start gap-3 bg-[#FAF8F5] border border-[#E7E2DA] rounded-md py-3 px-4">
                <MapPin className="w-4 h-4 text-[#0F4C2E] mt-0.5 shrink-0" />
                <div className="flex flex-col">
                  <span className="text-[15px] font-semibold text-[#1B211D] leading-snug">{street}</span>
                  {city && <span className="text-[14px] text-[#5F6B63] leading-snug mt-0.5">{city}</span>}
                </div>
              </div>
            );
          })()}

          {/* Route planen – for all businesses */}
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(business.address)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-[11px] bg-[#E8F1EB] text-[#0F4C2E] rounded-md py-3 px-4 text-[15px] font-semibold hover:bg-[#D6E7DC] transition-colors"
          >
            <MapPin className="w-4 h-4" />
            {lang === 'nl' ? 'Route plannen' : 'Route planen'}
          </a>

          <button 
            type="button" 
            onClick={() => setShowWidgetModal(true)} 
            className="flex items-center justify-center gap-2 bg-[#FAF8F5] border border-[#EDE8E0] hover:border-[#0F4C2E] hover:bg-[#E8F1EB]/40 text-[#0F4C2E] rounded-md py-2.5 px-4 text-[14px] font-semibold transition-all shadow-xs cursor-pointer"
            title={lang === 'nl' ? 'Vertrouwenszegel & widget voor eigen website configureren' : 'Trust-Siegel & Bewertungs-Widget für die eigene Website konfigurieren'}
          >
            <Star className="w-4 h-4 text-[#F2761B]" />
            <span>{lang === 'nl' ? 'Zegel voor eigen website' : 'Siegel für eigene Website'}</span>
          </button>

          {!business.isPremium && (
            <div className="mt-4 pt-4 border-t border-[#EDE8E0]">
              <div className="font-semibold text-[15px] mb-1">{t("isThisYourBusiness")}</div>
              <p className="text-[13px] text-[#5F6B63] mb-3">{t("claimProfileDesc")}</p>
              <button 
                type="button"
                onClick={() => {
                  if (!user) {
                    setShowLoginScreen(true);
                  } else {
                    setShowClaimScreen(true);
                  }
                }}
                className="w-full bg-[#0F4C2E] hover:bg-[#06301C] text-white border-none rounded-md py-2.5 text-[14px] font-semibold cursor-pointer transition-colors"
              >
                {lang === 'nl' ? 'Profiel claimen & upgraden' : 'Profil übernehmen & upgraden'}
              </button>
            </div>
          )}

          <div className="mt-4 pt-4 border-t border-[#EDE8E0]">
            {!isReportingError && !reportSuccess && (
              <button 
                onClick={() => setIsReportingError(true)}
                className="w-full bg-transparent border-none text-[#5F6B63] hover:text-[#0F4C2E] underline text-[13px] cursor-pointer text-center"
              >
                {lang === 'nl' ? 'Fout ontdekt?' : 'Fehler gefunden?'}
              </button>
            )}
            
            {isReportingError && (
              <div className="flex flex-col gap-2">
                <textarea
                  value={errorReportText}
                  onChange={(e) => setErrorReportText(e.target.value)}
                  placeholder={lang === 'nl' ? 'Wat klopt er niet?' : 'Was ist nicht korrekt?'}
                  className="w-full border border-[#E7E2DA] rounded-md p-3 text-[13px] bg-[#FAF8F5] focus:outline-none focus:border-[#0F4C2E] min-h-[80px]"
                />
                <div className="flex gap-2">
                  <button 
                    onClick={() => { setIsReportingError(false); setErrorReportText(''); }}
                    className="flex-1 bg-white border border-[#E7E2DA] rounded-md py-2 text-[13px] font-semibold cursor-pointer hover:bg-[#FAF8F5]"
                  >
                    {lang === 'nl' ? 'Annuleren' : 'Abbrechen'}
                  </button>
                  <button 
                    onClick={handleReportError}
                    disabled={isSubmittingReport || !errorReportText.trim()}
                    className="flex-1 bg-[#0F4C2E] text-white border-none rounded-md py-2 text-[13px] font-semibold cursor-pointer hover:bg-[#06301C] disabled:opacity-50"
                  >
                    {isSubmittingReport ? (lang === 'nl' ? 'Verzenden...' : 'Sendet...') : (lang === 'nl' ? 'Versturen' : 'Senden')}
                  </button>
                </div>
              </div>
            )}
            
            {reportSuccess && (
              <div className="text-center text-emerald-600 text-[13px] font-semibold py-2">
                {lang === 'nl' ? 'Hartelijk dank! Wij controleren het.' : 'Vielen Dank! Wir prüfen das.'}
              </div>
            )}
          </div>
        </div>
      </aside>
    </div>

      {similarBusinesses.length > 0 && (
        <div className="max-w-[1000px] mx-auto px-6 pb-[80px]">
          <h2 className="font-display text-[26px] font-bold m-0 mb-[18px]">{lang === 'nl' ? 'Vergelijkbare bedrijven' : 'Ähnliche Unternehmen'}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-[18px]">
            {similarBusinesses.map(b => {
              const bApproved = Array.isArray(b.reviews) ? b.reviews.filter(r => !r.status || r.status === 'approved') : [];
              const bAvg = bApproved.length > 0 
                ? (bApproved.reduce((sum, r) => sum + (Number(r?.rating) || 0), 0) / bApproved.length).toFixed(1) 
                : null;
              const bUsps = getBusinessReviewUsps(b, lang);

              return (
                <div key={b.id} onClick={() => {
                  const basePath = getBusinessPath(b, lang);
                  const url = typeof window !== 'undefined' ? `${window.location.origin}${basePath}` : basePath;
                  window.location.href = url;
                }} className="bg-white border border-[#EDE8E0] rounded-lg p-5 cursor-pointer shadow-[0_2px_10px_rgba(27,33,29,0.04)] hover:-translate-y-1 hover:shadow-[0_16px_34px_rgba(27,33,29,0.10)] transition-all">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-[12px] min-w-0">
                      {b.logoUrl ? (
                        <img src={b.logoUrl} alt={b.name} className="w-[42px] h-[42px] rounded-md object-cover shrink-0 border border-[#EDE8E0]" />
                      ) : (
                        <BusinessCategoryIcon 
                          category={b.category} 
                          subcategory={b.subcategory} 
                          name={b.name} 
                          isPremium={b.isPremium} 
                          className="w-[42px] h-[42px]"
                        />
                      )}
                      <div className="min-w-0">
                        <div className="font-display text-[16.5px] font-semibold truncate">{b.name}</div>
                        <div className="text-[13px] text-[#5F6B63] truncate">{b.district || 'Winterberg'}</div>
                      </div>
                    </div>
                    {bAvg && (
                      <div className="flex items-center gap-1 text-[12.5px] font-bold text-[#1B211D] bg-[#FAF8F5] px-2 py-0.5 rounded border border-[#EDE8E0] shrink-0">
                        <span className="text-[#F2761B]">★</span>
                        <span>{bAvg}</span>
                      </div>
                    )}
                  </div>
                  {bUsps.length > 0 && (
                    <div className="flex items-center gap-1.5 flex-wrap mt-3 pt-2.5 border-t border-[#F3F0EA]">
                      {bUsps.slice(0, 2).map((u, i) => (
                        <span key={i} className="bg-[#E8F1EB] text-[#0F4C2E] text-[11px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                          <span className="text-[#F2761B] text-[9.5px]">✓</span> {u}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {(() => {
        let ld = "{}";
        try {
          ld = JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": business.name,
            "image": business.gallery && business.gallery.length > 0 ? business.gallery : (business.uploadedImage || business.imageLink || undefined),
            "url": webHref || undefined,
            "telephone": business.phone || undefined,
            "address": {
              "@type": "PostalAddress",
              "streetAddress": business.address,
              "addressLocality": business.district || "Winterberg",
              "addressRegion": "NRW",
              "postalCode": "59955",
              "addressCountry": "DE"
            },
            "aggregateRating": avgRating ? {
              "@type": "AggregateRating",
              "ratingValue": avgRating,
              "reviewCount": Array.isArray(business.reviews) ? business.reviews.length : 0
            } : undefined
          });
        } catch(e) {}
        return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ld }} />;
      })()}

      <WidgetGeneratorModal
        business={business}
        isOpen={showWidgetModal}
        onClose={() => setShowWidgetModal(false)}
        onUpgrade={() => {
          setShowWidgetModal(false);
          if (!user) {
            setShowLoginScreen(true);
          } else {
            setShowClaimScreen(true);
          }
        }}
      />

      {/* Interactive Lightbox Modal */}
      <AnimatePresence>
        {lightboxIndex !== null && currentLightboxImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] bg-black/92 backdrop-blur-md flex flex-col items-center justify-between p-4 sm:p-6 select-none"
            onClick={() => setLightboxIndex(null)}
          >
            {/* Top Bar */}
            <div className="w-full max-w-5xl flex items-center justify-between text-white py-2" onClick={e => e.stopPropagation()}>
              <div className="flex items-center gap-2">
                <span className="bg-white/20 text-xs px-2.5 py-1 rounded font-semibold">
                  {currentLightboxImage.categoryName}
                </span>
                <span className="text-xs text-white/70">
                  {lightboxIndex + 1} / {displayedImages.length}
                </span>
              </div>
              <button 
                type="button" 
                onClick={() => setLightboxIndex(null)}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-colors cursor-pointer"
                title="Schließen (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Main Image with Prev/Next Controls */}
            <div className="relative flex-1 w-full max-w-5xl flex items-center justify-center my-auto" onClick={e => e.stopPropagation()}>
              {displayedImages.length > 1 && (
                <button
                  type="button"
                  onClick={() => setLightboxIndex(prev => prev !== null && prev > 0 ? prev - 1 : displayedImages.length - 1)}
                  className="absolute left-2 sm:-left-4 z-10 w-11 h-11 rounded-full bg-black/60 hover:bg-[#F2761B] text-white flex items-center justify-center transition-colors shadow-lg cursor-pointer"
                  title="Vorheriges Bild"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
              )}

              <img 
                src={currentLightboxImage.url} 
                alt={currentLightboxImage.alt || `${business.name} – ${currentLightboxImage.categoryName}`}
                title={currentLightboxImage.title || currentLightboxImage.categoryName}
                className="max-h-[75vh] max-w-full object-contain rounded-lg shadow-2xl" 
              />

              {displayedImages.length > 1 && (
                <button
                  type="button"
                  onClick={() => setLightboxIndex(prev => prev !== null && prev < displayedImages.length - 1 ? prev + 1 : 0)}
                  className="absolute right-2 sm:-right-4 z-10 w-11 h-11 rounded-full bg-black/60 hover:bg-[#F2761B] text-white flex items-center justify-center transition-colors shadow-lg cursor-pointer"
                  title="Nächstes Bild"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              )}
            </div>

            {/* Bottom Caption Bar */}
            <div className="w-full max-w-2xl text-center py-2" onClick={e => e.stopPropagation()}>
              <p className="text-white text-sm font-medium drop-shadow">
                {currentLightboxImage.title || currentLightboxImage.alt || `${business.name} – ${currentLightboxImage.categoryName}`}
              </p>
              {currentLightboxImage.alt && currentLightboxImage.title && (
                <p className="text-white/70 text-xs mt-0.5">
                  {currentLightboxImage.alt}
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Transparency / Score Info Modal */}
      <RankingInfoModal
        isOpen={isInfoModalOpen}
        onClose={() => setIsInfoModalOpen(false)}
        initialTopic={infoModalTopic}
      />
    </main>
  );
}
