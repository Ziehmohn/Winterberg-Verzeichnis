import React, { useState } from 'react';
import { useTranslation } from '../i18n';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, MapPin, Phone, Globe, Image as ImageIcon, BadgeCheck, Clock, List as ListIcon, ShieldCheck, Briefcase, Star } from 'lucide-react';
import { Business, ThemeConfig, Review } from '../types';
import { isOpenNow, canDisplayOpeningHours } from '../utils';
import { getLocalizedBusiness } from '../utils/translator';
import { getBusinessReviewUsps } from '../utils/reviewUsps';
import ReviewForm from './ReviewForm';
import { useAuth } from '../AuthContext';
import Login from './Login';
import BusinessCategoryIcon from './BusinessCategoryIcon';
import WidgetGeneratorModal from './WidgetGeneratorModal';
import { getBusinessPath } from '../utils/routes';

interface BusinessDetailProps {
  business: Business;
  onBack: () => void;
  theme: ThemeConfig;
  activeThemeKey: string;
  onReviewSubmit?: (businessId: string, review: Review) => void;
  similarBusinesses?: Business[];
}

export default function BusinessDetail({ business, onBack, theme, activeThemeKey, onReviewSubmit, similarBusinesses = [] }: BusinessDetailProps) {

  const { t, lang } = useTranslation();
  const localized = getLocalizedBusiness(business, lang);
  const { currentUser: user } = useAuth();
  const [showClaimScreen, setShowClaimScreen] = useState(false);
  const [showLoginScreen, setShowLoginScreen] = useState(false);
  const [showWidgetModal, setShowWidgetModal] = useState(false);
  const [isLoadingCheckout, setIsLoadingCheckout] = useState(false);
  
  const [isReportingError, setIsReportingError] = useState(false);
  const [errorReportText, setErrorReportText] = useState('');
  const [reportSuccess, setReportSuccess] = useState(false);
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);

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

      <div 
        className="bg-gradient-to-br from-[#0F4C2E] to-[#06301C] text-white relative"
        style={(business.uploadedImage || business.imageLink) ? {
          backgroundImage: `linear-gradient(to bottom, rgba(15, 76, 46, 0.85), rgba(6, 48, 28, 0.98)), url(${business.uploadedImage || business.imageLink})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
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

          <div className="flex gap-2 flex-wrap mb-[14px]">
            <span className="bg-white/10 rounded px-2.5 py-1 text-[13px]">{t(business.category)}</span>
            {business.subcategory && (
              <span className="bg-white/10 rounded px-2.5 py-1 text-[13px]">{t(business.subcategory)}</span>
            )}
            {business.isPremium && (
              <span className="bg-[#F2761B] rounded px-2.5 py-1 text-[13px] font-semibold">Premium</span>
            )}
            {business.isVerified && (
              <span className="bg-white/10 rounded px-2.5 py-1 text-[13px]">{lang === 'nl' ? 'Geverifieerd' : 'Verifiziert'}</span>
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
            {avgRating && (
              <span className="inline-flex items-center gap-1.5">
                <span className="text-[#F2761B] tracking-[1px]">
                  {Array.from({length: 5}).map((_, i) => (
                    <span key={i}>{i < Math.round(Number(avgRating)) ? '★' : '☆'}</span>
                  ))}
                </span>
                {avgRating} · {approvedReviews.length} {lang === 'nl' ? 'beoordelingen' : 'Bewertungen'}
              </span>
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

          {Array.isArray(business.gallery) && business.gallery.length > 0 && (
            <>
              <h2 className="font-display text-[22px] font-semibold mb-3.5">{lang === 'nl' ? 'Fotogalerij' : 'Bildergalerie'}</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5 mb-[30px]">
                {business.gallery.map((img, i) => (
                  <img key={i} src={img} alt={`Bild ${i+1}`} className="w-full h-[120px] object-cover rounded-md border border-[#EDE8E0]" />
                ))}
              </div>
            </>
          )}

          {business.isPremium && Array.isArray(localized.services) && localized.services.length > 0 && (
            <>
              <h2 className="font-display text-[22px] font-semibold mb-3.5">{lang === 'nl' ? 'Diensten & Services' : 'Leistungen & Services'}</h2>
              <div className="flex gap-2 flex-wrap mb-[30px]">
                {localized.services.map((svc, i) => (
                  <span key={i} className="bg-[#E8F1EB] text-[#0F4C2E] border border-[#0F4C2E]/15 rounded-md px-3 py-1.5 text-[14px] font-medium">{svc}</span>
                ))}
              </div>
            </>
          )}

          {business.isPremium && Array.isArray(localized.products) && localized.products.length > 0 && (
            <>
              <h2 className="font-display text-[22px] font-semibold mb-3.5">{lang === 'nl' ? 'Producten & Aanbod' : 'Produkte & Angebote'}</h2>
              <div className="flex gap-2 flex-wrap mb-[30px]">
                {localized.products.map((prod, i) => (
                  <span key={i} className="bg-[#FFF1E4] text-[#D65F0C] border border-[#F2761B]/25 rounded-md px-3 py-1.5 text-[14px] font-medium">{prod}</span>
                ))}
              </div>
            </>
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
                    <p className="mt-2 text-[14.5px] text-[#4A544D] leading-[1.6]">{r.text}</p>
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
        </div>

        <aside className="bg-white border border-[#EDE8E0] rounded-lg p-6 shadow-[0_10px_30px_rgba(27,33,29,0.06)] sticky top-[116px] flex flex-col gap-3">
          <div className="flex justify-between items-start mb-1">
            <div className="font-display text-[18px] font-semibold mt-1">{t("contact")}</div>
            {business.logoUrl ? (
              <img 
                src={business.logoUrl} 
                alt={`Logo von ${business.name}`} 
                className="w-12 h-12 rounded-md object-contain border border-[#EDE8E0] shadow-sm bg-white"
              />
            ) : (
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
          
          {business.phone && telHref && (
            <a href={telHref} className="flex items-center gap-[11px] bg-[#F2761B] text-white rounded-md py-3 px-4 text-[15px] font-semibold hover:bg-[#D65F0C] transition-colors">
              <Phone className="w-4 h-4" />
              {business.phone}
            </a>
          )}
          
          {business.website && webHref && (
            <a href={webHref} target="_blank" rel="noopener noreferrer" className="flex items-center gap-[11px] bg-[#E8F1EB] text-[#0F4C2E] rounded-md py-3 px-4 text-[15px] font-semibold hover:bg-[#D6E7DC] transition-colors">
              <Globe className="w-4 h-4" />
              {lang === 'nl' ? 'Website bezoeken' : 'Website öffnen'}
            </a>
          )}

          <a href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(business.address)}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-[11px] bg-[#FAF8F5] border border-[#E7E2DA] text-[#1B211D] rounded-md py-3 px-4 text-[15px] font-semibold hover:border-[#0F4C2E] hover:text-[#0F4C2E] transition-colors">
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
    </main>
  );
}
