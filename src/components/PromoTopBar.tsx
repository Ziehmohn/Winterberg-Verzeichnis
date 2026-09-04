import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, X } from 'lucide-react';
import { PricingSettings } from '../types';

interface PromoTopBarProps {
  pricingSettings?: PricingSettings | null;
  onNavigate?: (path: string) => void;
  lang?: 'de' | 'nl';
}

export default function PromoTopBar({ pricingSettings, onNavigate, lang = 'de' }: PromoTopBarProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    try {
      const dismissed = sessionStorage.getItem('dismissedOfferTopBar');
      if (dismissed === 'true') {
        setIsVisible(false);
      }
    } catch {
      // ignore
    }
  }, []);

  // If explicitly disabled in admin settings
  if (pricingSettings && pricingSettings.showRibbon === false) {
    return null;
  }

  if (!isVisible) return null;

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsVisible(false);
    try {
      sessionStorage.setItem('dismissedOfferTopBar', 'true');
    } catch {}
  };

  const handleCtaClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const targetUrl = pricingSettings?.ribbonLink || (lang === 'nl' ? '/nl/prijzen' : '/preise');
    if (onNavigate) {
      onNavigate(targetUrl);
    } else {
      window.history.pushState(null, '', targetUrl);
      window.dispatchEvent(new PopStateEvent('popstate'));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const badgeText = pricingSettings?.offerBadgeText || (lang === 'nl' ? 'Tijdelijke actie' : 'Limitiertes Angebot');
  const offerText = pricingSettings?.ribbonText || (lang === 'nl' 
    ? '🔥 Tijdelijke actie: Premium-vermelding vanaf € 4,95 / maand!' 
    : '🔥 Limitiertes Angebot: Premium ab 4,95 € / Monat sichern!');
  const ctaText = lang === 'nl' ? 'Aanbieding bekijken' : 'Jetzt Angebot sichern';

  const bgColor = pricingSettings?.ribbonBgColor || '#F2761B';
  const textColor = pricingSettings?.ribbonTextColor || '#FFFFFF';

  return (
    <div 
      style={{ 
        background: `linear-gradient(90deg, #0F4C2E 0%, ${bgColor} 45%, ${bgColor} 65%, #0F4C2E 100%)`,
        color: textColor 
      }}
      className="relative py-2.5 px-4 shadow-md border-b border-white/20 z-30 transition-all select-none"
    >
      <div className="max-w-[1280px] mx-auto flex items-center justify-between gap-3 text-xs sm:text-sm">
        <div 
          onClick={handleCtaClick}
          className="flex items-center gap-2.5 flex-wrap cursor-pointer group flex-1 justify-center sm:justify-start"
        >
          {/* Badge */}
          <span className="inline-flex items-center gap-1 bg-white/20 hover:bg-white/30 text-white font-bold px-2.5 py-0.5 rounded-full text-[11px] uppercase tracking-wider backdrop-blur-xs border border-white/30 shrink-0">
            <Sparkles className="w-3 h-3 text-amber-300 animate-pulse" />
            {badgeText}
          </span>

          {/* Offer headline */}
          <span className="font-semibold tracking-tight text-white leading-tight text-center sm:text-left drop-shadow-xs">
            {offerText}
          </span>

          {/* CTA Link */}
          <span className="inline-flex items-center gap-1 font-bold text-white bg-black/20 hover:bg-black/30 px-2.5 py-0.5 rounded-full transition-all group-hover:scale-105 shrink-0 border border-white/20">
            <span>{ctaText}</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </span>
        </div>

        {/* Dismiss button */}
        <button
          onClick={handleDismiss}
          className="text-white/80 hover:text-white p-1 rounded-full hover:bg-black/20 transition-colors shrink-0 cursor-pointer ml-1"
          title={lang === 'nl' ? 'Sluiten' : 'Schließen'}
          aria-label="Schließen"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
