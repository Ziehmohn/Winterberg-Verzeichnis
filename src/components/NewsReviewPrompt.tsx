import React, { useState, useEffect } from 'react';
import { Star, X, ArrowRight, Store } from 'lucide-react';

interface NewsReviewPromptProps {
  businessName: string;
  businessProfileUrl: string;
  businessId?: string;
  newsId?: string;
  businessImage?: string;
  lang?: 'de' | 'nl';
}

export default function NewsReviewPrompt({
  businessName,
  businessProfileUrl,
  businessId = '',
  newsId = '',
  businessImage,
  lang = 'de'
}: NewsReviewPromptProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isRendered, setIsRendered] = useState(false);

  // Check if visitor has previously dismissed this review prompt
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const bizDismissed = businessId && localStorage.getItem(`wb_review_prompt_dismissed_${businessId}`) === 'true';
      const newsDismissed = newsId && localStorage.getItem(`wb_review_prompt_dismissed_${newsId}`) === 'true';
      
      if (bizDismissed || newsDismissed) {
        return; // Permanently dismissed by user
      }
    } catch (e) {
      // Storage access blocked or restricted
    }

    // Render component and animate it in after gentle delay (2200ms)
    setIsRendered(true);
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 2200);

    return () => clearTimeout(timer);
  }, [businessId, newsId]);

  const handleDismiss = () => {
    setIsVisible(false);
    
    // Smoothly unmount after fade-out transition
    setTimeout(() => {
      setIsRendered(false);
    }, 500);

    try {
      if (businessId) {
        localStorage.setItem(`wb_review_prompt_dismissed_${businessId}`, 'true');
      }
      if (newsId) {
        localStorage.setItem(`wb_review_prompt_dismissed_${newsId}`, 'true');
      }
    } catch (e) {
      console.warn('Could not store review prompt dismissal in localStorage:', e);
    }
  };

  const handleActionClick = () => {
    // Save dismissal so the user isn't prompted again after writing a review
    handleDismiss();
  };

  if (!isRendered || !businessName || !businessProfileUrl) {
    return null;
  }

  // Ensure anchor jumps directly to review section
  const reviewTargetUrl = businessProfileUrl.includes('#') 
    ? businessProfileUrl 
    : `${businessProfileUrl}#bewertungen`;

  return (
    <aside
      role="dialog"
      aria-label={lang === 'nl' ? 'Beoordeling achterlaten' : 'Bewertung abgeben'}
      aria-live="polite"
      className={`fixed z-40 bottom-[76px] sm:bottom-6 right-4 sm:right-6 max-w-[370px] w-[calc(100%-2rem)] transition-all duration-500 ease-out transform ${
        isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-8 opacity-0 scale-95 pointer-events-none'
      }`}
    >
      <div className="bg-white/98 backdrop-blur-md rounded-2xl border border-[#E2DDD3] shadow-[0_16px_45px_rgba(15,76,46,0.18)] p-4 sm:p-5 relative overflow-hidden text-left">
        {/* Decorative top accent line in Winterberg forest green */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#0F4C2E] via-[#2F855A] to-[#F2761B]" />

        {/* Close Button ("wegklicken") */}
        <button
          type="button"
          onClick={handleDismiss}
          aria-label={lang === 'nl' ? 'Melding sluiten' : 'Hinweis schließen'}
          title={lang === 'nl' ? 'Niet meer tonen' : 'Nicht mehr anzeigen'}
          className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center text-[#7A857D] hover:text-[#1B211D] hover:bg-black/5 active:scale-95 transition-all cursor-pointer z-10"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Eye-catching badge */}
        <div className="flex items-center gap-1.5 mb-2.5">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200/80 shadow-2xs">
            <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
            {lang === 'nl' ? 'Jouw mening telt' : 'Deine Erfahrung zählt'}
          </span>
        </div>

        {/* Business header row */}
        <div className="flex items-start gap-3 mb-2.5 pr-6">
          {businessImage ? (
            <img
              src={businessImage}
              alt={businessName}
              className="w-12 h-12 rounded-xl object-cover shrink-0 border border-[#EDE8E0] shadow-2xs bg-[#FAF8F5]"
              loading="lazy"
            />
          ) : (
            <div className="w-12 h-12 rounded-xl bg-[#0F4C2E]/10 text-[#0F4C2E] flex items-center justify-center shrink-0">
              <Store className="w-6 h-6" />
            </div>
          )}
          <div className="min-w-0">
            <h4 className="font-display text-[15px] sm:text-[16px] font-bold text-[#1B211D] leading-tight line-clamp-2">
              {lang === 'nl'
                ? `Ben je al bij ${businessName} geweest?`
                : `Warst du schon bei ${businessName}?`}
            </h4>
            {/* Visual 5-star preview */}
            <div className="flex items-center gap-0.5 mt-1 text-amber-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              ))}
              <span className="text-[11.5px] text-[#7A857D] font-medium ml-1.5">
                {lang === 'nl' ? 'Beoordeel nu' : 'Bewerte jetzt'}
              </span>
            </div>
          </div>
        </div>

        {/* Friendly explanation copy */}
        <p className="text-[13px] text-[#4F5952] leading-relaxed mb-4">
          {lang === 'nl'
            ? 'Laat weten hoe het je bevallen is – jouw feedback helpt andere bezoekers en het bedrijf enorm!'
            : 'Bitte bewerte, wie es dir gefallen hat – dein ehrliches Feedback hilft anderen Besuchern bei der Auswahl!'}
        </p>

        {/* Primary CTA and Dismiss Option */}
        <div className="space-y-2">
          <a
            href={reviewTargetUrl}
            onClick={handleActionClick}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-[13.5px] text-white bg-[#0F4C2E] hover:bg-[#186841] active:scale-[0.98] shadow-md hover:shadow-lg transition-all no-underline cursor-pointer group"
          >
            <span>{lang === 'nl' ? 'Nu beoordelen & profiel bekijken' : 'Jetzt bewerten & Profil ansehen'}</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </a>

          <button
            type="button"
            onClick={handleDismiss}
            className="w-full py-1 text-center text-[11.5px] text-[#7A857D] hover:text-[#1B211D] hover:underline transition-colors cursor-pointer"
          >
            {lang === 'nl' ? 'Niet nu / Niet meer tonen' : 'Nicht jetzt / Nicht mehr anzeigen'}
          </button>
        </div>
      </div>
    </aside>
  );
}
