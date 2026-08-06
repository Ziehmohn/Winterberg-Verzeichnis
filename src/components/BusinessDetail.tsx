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
  similarBusinesses?: Business[];
}

export default function BusinessDetail({ business, onBack, theme, activeThemeKey, onReviewSubmit, similarBusinesses = [] }: BusinessDetailProps) {

  const { t } = useTranslation();
  const [showClaimScreen, setShowClaimScreen] = useState(false);
  const [isLoadingCheckout, setIsLoadingCheckout] = useState(false);

  const handleClaim = async () => {
    setIsLoadingCheckout(true);
    try {
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ businessId: business.id, email: business.email, billingCycle: 'monthly' }) // Default to monthly on upgrade, user can change in Stripe if needed, or we just pass it
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

  const telHref = business.phone ? `tel:${business.phone.replace(/[^0-9+]/g, '')}` : undefined;
  const webHref = business.website ? (business.website.startsWith('http') ? business.website : `https://${business.website}`) : undefined;
  
  const openState = business.openingHours ? isOpenNow(business.openingHours, t) : null;
  const avgRating = business.reviews && business.reviews.length > 0 
    ? (business.reviews.reduce((acc, r) => acc + r.rating, 0) / business.reviews.length).toFixed(1)
    : null;

  return (
    <main className="flex-1 relative">
      
      {/* Checkout/Claim Overlay */}
      <AnimatePresence>
        {showClaimScreen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-white/95 backdrop-blur-sm flex items-center justify-center p-6"
          >
            <div className="max-w-md w-full bg-white p-8 border border-[#EDE8E0] rounded-[22px] flex flex-col items-center text-center shadow-[0_10px_30px_rgba(27,33,29,0.06)]">
              <ShieldCheck className="w-16 h-16 text-emerald-500 mb-6" />
              <h2 className="text-2xl font-display font-bold mb-4">{t("secureAccess")}</h2>
              <p className="mb-6 opacity-80 leading-relaxed text-[#4A544D]">
                {t("takeControl")} <strong>{business.name}</strong>. 
                {t("claimAccessDesc")}
              </p>
              
              <div className="flex flex-col w-full gap-3">
                <button 
                  onClick={handleClaim}
                  disabled={isLoadingCheckout}
                  className="w-full bg-[#F2761B] text-white border-none rounded-full py-[15px] text-[16px] font-semibold cursor-pointer hover:bg-[#D65F0C] transition-colors disabled:opacity-50"
                >
                  {isLoadingCheckout ? "Lade Checkout..." : t("claimNow")}
                </button>
                <div className="text-center text-[12px] text-[#5F6B63] mb-1">
                  Zahlung in Kürze bequem per Stripe.
                </div>
                <button 
                  onClick={() => setShowClaimScreen(false)}
                  disabled={isLoadingCheckout}
                  className="w-full bg-transparent border-none text-[#5F6B63] py-[15px] text-[15px] cursor-pointer hover:underline disabled:opacity-50"
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
          <button 
            type="button" 
            onClick={onBack} 
            className="bg-white/10 border border-white/20 text-white rounded-full px-4 py-2 text-[14px] cursor-pointer inline-flex items-center gap-2 mb-[26px] hover:bg-white/20 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Zurück
          </button>
          
          <div className="flex gap-2 flex-wrap mb-[14px]">
            <span className="bg-white/10 rounded-full px-[13px] py-[5px] text-[13px]">{business.category}</span>
            {business.subcategory && (
              <span className="bg-white/10 rounded-full px-[13px] py-[5px] text-[13px]">{business.subcategory}</span>
            )}
            {business.isPremium && (
              <span className="bg-[#F2761B] rounded-full px-[13px] py-[5px] text-[13px] font-semibold">Premium</span>
            )}
            {business.isVerified && (
              <span className="bg-white/10 rounded-full px-[13px] py-[5px] text-[13px]">Verifiziert</span>
            )}
            {openState && (
              <span className={`rounded-full px-[13px] py-[5px] text-[13px] font-semibold ${openState.isOpen ? 'bg-[#E8F1EB] text-[#0F4C2E]' : 'bg-[#FFF1E4] text-[#D65F0C]'}`}>
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
                {avgRating} · {business.reviews!.length} Bewertungen
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-[1000px] mx-auto px-6 py-[40px] grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-[26px] items-start">
        <div className="bg-white border border-[#EDE8E0] rounded-[22px] p-[32px] shadow-[0_10px_30px_rgba(27,33,29,0.06)]">
          <h2 className="font-display text-[22px] font-semibold mb-3">Über das Unternehmen</h2>
          <p className="text-[16.5px] leading-[1.7] text-[#4A544D] mb-6 whitespace-pre-wrap">{business.description}</p>
          
          {business.extendedDescription && (
            <div 
              className="text-[16px] leading-[1.7] text-[#4A544D] mb-[26px] prose prose-sm md:prose-base max-w-none"
              dangerouslySetInnerHTML={{ __html: business.extendedDescription }}
            />
          )}

          {business.gallery && business.gallery.length > 0 && (
            <>
              <h2 className="font-display text-[22px] font-semibold mb-3.5">Bildergalerie</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5 mb-[30px]">
                {business.gallery.map((img, i) => (
                  <img key={i} src={img} alt={`Bild ${i+1}`} className="w-full h-[120px] object-cover rounded-[14px] border border-[#EDE8E0]" />
                ))}
              </div>
            </>
          )}

          {business.services && business.services.length > 0 && (
            <>
              <h2 className="font-display text-[22px] font-semibold mb-3.5">Leistungen</h2>
              <div className="flex gap-2 flex-wrap mb-[30px]">
                {business.services.map((svc, i) => (
                  <span key={i} className="bg-[#E8F1EB] text-[#0F4C2E] rounded-full py-[8px] px-[14px] text-[14px] font-medium">{svc}</span>
                ))}
              </div>
            </>
          )}

          {business.openingHours && (
            <>
              <h2 className="font-display text-[22px] font-semibold mb-3.5">Öffnungszeiten</h2>
              <div className="border border-[#EDE8E0] rounded-[16px] overflow-hidden mb-[30px]">
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

          {business.jobs && business.jobs.length > 0 && (
            <>
              <h2 className="font-display text-[22px] font-semibold mb-3.5">Offene Stellen</h2>
              <div className="grid gap-2.5 mb-[30px]">
                {business.jobs.map(j => (
                  <div key={j.id} className="border border-[#EDE8E0] rounded-[16px] p-4">
                    <div className="flex justify-between gap-3 items-baseline">
                      <div className="font-display text-[17px] font-semibold">{j.title}</div>
                      <span className="bg-[#FFF1E4] text-[#D65F0C] rounded-full py-1 px-[11px] text-[12px] font-semibold">{j.type}</span>
                    </div>
                    <p className="mt-2 text-[14.5px] text-[#4A544D] leading-[1.55]">{j.description}</p>
                  </div>
                ))}
              </div>
            </>
          )}

          <h2 className="font-display text-[22px] font-semibold mb-3.5">Bewertungen</h2>
          <div className="grid gap-3 mb-5">
            {business.reviews && business.reviews.filter(r => r.status === 'approved').length > 0 ? (
              business.reviews.filter(r => r.status === 'approved').map(r => (
                <div key={r.id} className="bg-[#FAF8F5] border border-[#EDE8E0] rounded-[16px] p-4">
                  <div className="flex justify-between gap-2.5 items-center">
                    <div className="font-semibold text-[15px]">{r.authorName}</div>
                    <div className="text-[#F2761B] text-[15px] tracking-[2px]">
                      {Array.from({length: 5}).map((_, i) => (
                        <span key={i}>{i < r.rating ? '★' : '☆'}</span>
                      ))}
                    </div>
                  </div>
                  <p className="mt-2 text-[14.5px] text-[#4A544D] leading-[1.6]">{r.text}</p>
                </div>
              ))
            ) : (
              <p className="text-[#8A928B] text-[15px] m-0">Noch keine Bewertungen — sei die erste Stimme.</p>
            )}
          </div>

          {onReviewSubmit && (
            <div className="mt-6 border-t border-[#EDE8E0] pt-6">
              <ReviewForm business={business} onReviewSubmit={onReviewSubmit} />
            </div>
          )}
        </div>

        <aside className="bg-white border border-[#EDE8E0] rounded-[22px] p-[26px] shadow-[0_10px_30px_rgba(27,33,29,0.06)] sticky top-[116px] flex flex-col gap-3">
          <div className="font-display text-[18px] font-semibold mb-1">Kontakt</div>
          
          {business.phone && telHref && (
            <a href={telHref} className="flex items-center gap-[11px] bg-[#F2761B] text-white rounded-[14px] py-[14px] px-[16px] text-[15px] font-semibold hover:bg-[#D65F0C] transition-colors">
              <Phone className="w-4 h-4" />
              {business.phone}
            </a>
          )}
          
          {business.website && webHref && (
            <a href={webHref} target="_blank" rel="noopener noreferrer" className="flex items-center gap-[11px] bg-[#E8F1EB] text-[#0F4C2E] rounded-[14px] py-[14px] px-[16px] text-[15px] font-semibold hover:bg-[#D6E7DC] transition-colors">
              <Globe className="w-4 h-4" />
              Website öffnen
            </a>
          )}

          <a href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(business.address)}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-[11px] bg-[#FAF8F5] border border-[#E7E2DA] text-[#1B211D] rounded-[14px] py-[14px] px-[16px] text-[15px] font-semibold hover:border-[#0F4C2E] hover:text-[#0F4C2E] transition-colors">
            <MapPin className="w-4 h-4" />
            Route planen
          </a>

          {!business.isPremium && (
            <div className="mt-4 pt-4 border-t border-[#EDE8E0]">
              <div className="font-semibold text-[15px] mb-1">Ist das Ihr Unternehmen?</div>
              <p className="text-[13px] text-[#5F6B63] mb-3">Übernehmen Sie dieses Profil und fügen Sie Bildergalerie, Öffnungszeiten und mehr hinzu.</p>
              <button 
                onClick={() => setShowClaimScreen(true)}
                className="w-full bg-white text-[#0F4C2E] border border-[#0F4C2E] rounded-[14px] py-[11px] text-[14px] font-semibold cursor-pointer hover:bg-[#E8F1EB] transition-colors"
              >
                Profil übernehmen
              </button>
            </div>
          )}
        </aside>
      </div>

      {similarBusinesses.length > 0 && (
        <div className="max-w-[1000px] mx-auto px-6 pb-[80px]">
          <h2 className="font-display text-[26px] font-bold m-0 mb-[18px]">Ähnliche Unternehmen</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-[18px]">
            {similarBusinesses.map(b => (
              <div key={b.id} onClick={() => {
                const basePath = `/${encodeURIComponent(b.category)}${b.subcategory ? `/${encodeURIComponent(b.subcategory)}` : ''}/${encodeURIComponent(b.name.replace(/\s+/g, '-').toLowerCase())}`;
                const url = typeof window !== 'undefined' ? `${window.location.origin}${basePath}` : basePath;
                window.location.href = url;
              }} className="bg-white border border-[#EDE8E0] rounded-[20px] p-[20px] cursor-pointer shadow-[0_2px_10px_rgba(27,33,29,0.04)] hover:-translate-y-1 hover:shadow-[0_16px_34px_rgba(27,33,29,0.10)] transition-all">
                <div className="flex items-center gap-[12px]">
                  <div className="w-[42px] h-[42px] rounded-[13px] bg-[#FAF8F5] text-[#0F4C2E] flex items-center justify-center font-display font-bold text-[14px] shrink-0">
                    {b.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-display text-[16.5px] font-semibold">{b.name}</div>
                    <div className="text-[13px] text-[#5F6B63]">{b.district || 'Winterberg'}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": business.name,
        "image": business.images ? business.images : undefined,
        "url": webHref || undefined,
        "telephone": business.phone || undefined,
        "address": {
          "@type": "PostalAddress",
          "streetAddress": business.address,
          "addressLocality": business.district || "Winterberg",
          "addressRegion": "NRW",
          "addressCountry": "DE"
        },
        "aggregateRating": avgRating ? {
          "@type": "AggregateRating",
          "ratingValue": avgRating,
          "reviewCount": business.reviews?.length || 0
        } : undefined
      })}} />
    </main>
  );
}
