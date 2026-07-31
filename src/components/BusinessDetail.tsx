import React, { useState } from 'react';
import { useTranslation } from '../i18n';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, MapPin, Phone, Globe, Image as ImageIcon, BadgeCheck, Clock, List as ListIcon, ShieldCheck, Briefcase } from 'lucide-react';
import { Business, ThemeConfig, Review } from '../types';
import { isOpenNow } from '../utils';
import ReviewForm from './ReviewForm';

interface BusinessDetailProps {
  business: Business;
  onBack: () => void;
  theme: ThemeConfig;
  activeThemeKey: string;
  onReviewSubmit?: (businessId: string, review: Review) => void;
}

export default function BusinessDetail({ business, onBack, theme, activeThemeKey, onReviewSubmit }: BusinessDetailProps) {

  const { t } = useTranslation();
  const [showClaimScreen, setShowClaimScreen] = useState(false);
  const [isLoadingCheckout, setIsLoadingCheckout] = useState(false);

  const handleClaim = async () => {
    setIsLoadingCheckout(true);
    try {
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ businessId: business.id })
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || 'Fehler beim Weiterleiten zu Stripe');
      }
    } catch (err) {
      console.error(err);
      alert(t("paymentError"));
    } finally {
      setIsLoadingCheckout(false);
    }
  };

  return (
    <div className={`flex flex-col bg-white ${theme.cardBorder} ${theme.cardShadow} ${activeThemeKey === 'modern' ? 'rounded-none' : 'rounded-xl'} overflow-hidden relative`}>
      {/* Checkout/Claim Overlay */}
      <AnimatePresence>
        {showClaimScreen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-white/95 backdrop-blur-sm flex items-center justify-center p-6"
          >
            <div className={`max-w-md w-full bg-white p-8 border ${theme.cardBorder} ${theme.cardShadow} ${activeThemeKey === 'modern' ? 'rounded-none' : 'rounded-2xl'} flex flex-col items-center text-center`}>
              <ShieldCheck className="w-16 h-16 text-emerald-500 mb-6" />
              <h2 className="text-2xl font-display font-bold mb-4">{t("secureAccess")}</h2>
              <p className="mb-6 opacity-80 leading-relaxed">
                {t("takeControl")} <strong>{business.name}</strong>. 
                Präsentieren Sie Ihr Unternehmen optimal mit Bildern, aktuellen Angeboten und Premium-Platzierung.
              </p>
              
              <div className="bg-orange-50 text-orange-900 border border-orange-200 rounded-xl p-5 mb-8 w-full text-left">
                <div className="font-bold text-lg mb-2">{t("premiumAccess")}</div>
                <div className="text-sm space-y-2 mb-4">
                  <div className="flex justify-between"><span>Monatliche Zahlweise:</span> <strong>12,95 € / {t("month")}</strong></div>
                  <div className="flex justify-between"><span>Jährliche Zahlweise:</span> <strong>119,40 € / Jahr</strong></div>
                  <div className="text-xs opacity-70 mt-2">Alle Preise netto zzgl. gesetzlicher MwSt.</div>
                </div>
              </div>

              <div className="flex flex-col w-full gap-3">
                <button 
                  disabled
                  className={`w-full py-3 px-4 font-bold text-white transition-colors bg-orange-500 opacity-50 cursor-not-allowed ${activeThemeKey === 'modern' ? 'rounded-none' : 'rounded-lg'}`}
                >
                  Zahlungspflichtig bestellen
                </button>
                <div className="text-sm font-bold text-orange-700 bg-orange-100 p-2 rounded text-center">
                  Die Bezahlfunktion wird in Kürze eingerichtet.
                </div>
                <button 
                  onClick={() => setShowClaimScreen(false)}
                  disabled={isLoadingCheckout}
                  className={`w-full py-3 px-4 font-medium transition-colors bg-black/5 hover:bg-black/10 ${activeThemeKey === 'modern' ? 'rounded-none' : 'rounded-lg'}`}
                >
                  Abbrechen
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button 
        onClick={(e) => {
          e.preventDefault();
          window.history.pushState(null, '', '/');
          onBack();
        }} 
        className="flex items-center gap-2 px-6 py-4 border-b border-black/5 hover:bg-black/5 transition-colors font-medium text-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        Zurück zur Übersicht
      </button>

      <div className="relative h-64 md:h-80 w-full bg-black/5 overflow-hidden group">
        {(business.uploadedImage || business.imageLink) ? (
          <img src={business.uploadedImage || business.imageLink} alt={business.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-black/40 bg-neutral-100/50">
            <ImageIcon className="w-12 h-12 mb-4 opacity-40" />
            <span className="text-sm font-bold tracking-widest opacity-60">{t("imagesComingSoon")}</span>
          </div>
        )}
        <div className={`absolute top-4 left-4 ${theme.cardBg} bg-opacity-90 backdrop-blur-sm px-4 py-1.5 text-sm font-medium ${theme.textBase} ${activeThemeKey === 'modern' ? 'rounded-none border border-black' : 'rounded-full shadow-sm'}`}>
          {business.subcategory ? `${business.category} — ${business.subcategory}` : business.category}
        </div>
      </div>

      <div className={`p-6 md:p-8 lg:p-10 ${theme.cardBg} transition-colors`}>
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8 text-center md:text-left">
          <div className="w-full">
            <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-3 mb-3">
              <div className="relative inline-block">
                <h1 className="text-3xl md:text-4xl font-display font-bold relative z-10">{business.name}</h1>
                <svg 
                  className="absolute -bottom-1 md:-bottom-2 left-0 w-full h-3 md:h-4 overflow-visible pointer-events-none z-0" 
                  viewBox="0 0 300 20" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                  preserveAspectRatio="none"
                >
                  <motion.path 
                    d="M 5 15 Q 100 0 200 12 T 295 8" 
                    stroke="#ffc084" 
                    strokeWidth="6" 
                    strokeLinecap="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 1.2, ease: "easeInOut", delay: 0.1 }}
                  />
                </svg>
              </div>
              {business.isPremium && (
                <div className="flex items-center gap-1 px-3 py-1.5 bg-orange-50 text-orange-700 rounded-full text-sm font-medium shrink-0" title="Premium Unternehmen">
                  <BadgeCheck className="w-5 h-5" />
                  <span className="hidden sm:inline">Premium</span>
                </div>
              )}
            </div>
            <p className={`text-lg md:text-xl leading-relaxed ${theme.textMuted} max-w-3xl mx-auto md:mx-0`}>
              {business.description}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {business.isPremium && business.services && business.services.length > 0 && (
              <div>
                <h3 className="text-xl font-display font-bold mb-4 flex items-center gap-2">
                  <ListIcon className={`w-5 h-5 ${theme.iconAccent}`} />
                  Leistungen & Services
                </h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {business.services.map((service, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className={`w-1.5 h-1.5 rounded-full mt-2 shrink-0 bg-orange-500`} />
                      <span className="leading-relaxed">{service}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {business.isPremium && business.extendedDescription && (
              <div className="pt-6 border-t border-black/5">
                <h3 className="text-xl font-display font-bold mb-4">{t("aboutUs")}</h3>
                <div className="prose prose-sm md:prose-base max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: business.extendedDescription }} />
                </div>
              </div>
            )}

            {business.isPremium && business.gallery && business.gallery.length > 0 && (
              <div className="pt-6 border-t border-black/5">
                <h3 className="text-xl font-display font-bold mb-4">{t("gallery")}</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {business.gallery.map((img, i) => (
                    <div key={i} className="aspect-square bg-black/5 rounded-lg overflow-hidden relative">
                      <img src={img} alt={`Galerie Bild ${i+1}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {business.isPremium && business.jobs && business.jobs.length > 0 && (
              <div className="pt-6 border-t border-black/5">
                <h3 className="text-xl font-display font-bold mb-4 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-black/40" />
                  Offene Stellen
                </h3>
                <div className="flex flex-col gap-4">
                  {business.jobs.map((job) => (
                    <div key={job.id} className="p-4 bg-black/5 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-lg">{job.title}</h4>
                        <span className="text-xs font-bold px-2 py-1 bg-white text-black rounded-md shadow-sm border border-black/10">
                          {job.type}
                        </span>
                      </div>
                      <p className="text-sm text-black/70 mb-3 whitespace-pre-wrap">{job.description}</p>
                      <div className="text-xs text-black/40">
                        {t("addedOn")} {new Date(job.createdAt).toLocaleDateString('de-DE')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Reviews Section */}
            {onReviewSubmit && (
              <div className="pt-6 border-t border-black/5">
                <ReviewForm business={business} onReviewSubmit={onReviewSubmit} />
              </div>
            )}
          </div>


          <div className={`space-y-6 p-6 border bg-black/[0.02] ${activeThemeKey === 'modern' ? 'rounded-none' : 'rounded-xl'}`}>
            {!business.isPremium && (
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-5 mb-6">
                <h4 className="font-bold text-orange-900 mb-2">{t("isThisYourBusiness")}</h4>
                <p className="text-sm text-orange-800 mb-4">{t("claimProfileDesc")}</p>
                <button 
                  onClick={() => setShowClaimScreen(true)}
                  className={`w-full py-2 px-4 font-bold text-sm text-white bg-orange-500 hover:bg-orange-600 transition-colors ${activeThemeKey === 'modern' ? 'rounded-none' : 'rounded-lg'}`}
                >
                  {t("claimAccess")}
                </button>
              </div>
            )}

            <h3 className="text-lg font-display font-bold mb-2">{t("contactDetails")}</h3>
            
            {!!business.address && typeof business.address === 'string' && (
              <div className="flex items-start gap-3">
                <MapPin className={`w-5 h-5 mt-0.5 shrink-0 ${theme?.iconAccent || 'text-orange-500'}`} />
                <span className="font-medium leading-tight">
                  {business.address.split(',').map((part, i) => (
                    <React.Fragment key={i}>
                      {part.trim()}
                      {i === 0 && <br />}
                    </React.Fragment>
                  ))}
                </span>
              </div>
            )}

            {!!business.phone && (
              <div className="flex items-center gap-3">
                <Phone className={`w-5 h-5 shrink-0 ${theme?.iconAccent || 'text-orange-500'}`} />
                <span className="font-medium">{business.phone}</span>
              </div>
            )}

            {!!business.website && typeof business.website === 'string' && (
              <div className="flex items-center gap-3">
                <Globe className={`w-5 h-5 shrink-0 ${theme?.iconAccent || 'text-orange-500'}`} />
                <span className="font-medium">
                  <a href={business.website.startsWith('http') ? business.website : `https://${business.website}`} target="_blank" rel="noopener noreferrer" className="hover:underline text-blue-600 hover:text-blue-800">
                    {business.website.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                  </a>
                </span>
              </div>
            )}

            {business.isPremium && !!business.openingHours && (() => {

              const openState = isOpenNow(business.openingHours, t);
              return (
                <div className="pt-4 border-t border-black/10">

                  <div className="flex items-start gap-3 mb-3">
                    <Clock className={`w-5 h-5 mt-0.5 shrink-0 ${openState.isOpen ? 'text-emerald-500' : 'text-red-500'}`} />
                    <span className={`font-medium ${openState.isOpen ? 'text-emerald-600' : 'text-red-600'}`}>{openState.text}</span>
                  </div>
                  <div className="space-y-1 text-sm">
                    {Object.entries(business.openingHours).map(([day, hours]) => (
                      <div key={day} className="flex justify-between">
                        <span className="capitalize w-24">{
                          day === 'monday' ? t('monday') :
                          day === 'tuesday' ? t('tuesday') :
                          day === 'wednesday' ? t('wednesday') :
                          day === 'thursday' ? t('thursday') :
                          day === 'friday' ? t('friday') :
                          day === 'saturday' ? t('saturday') : t('sunday')
                        }</span>
                        <span className="font-medium text-right">{hours}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      </div>
    </div>
  );
}
