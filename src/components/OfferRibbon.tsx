import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, X } from 'lucide-react';
import { PricingSettings } from '../types';
import { isPricingOfferActive } from '../config';

interface OfferRibbonProps {
  pricingSettings?: PricingSettings | null;
  onNavigate?: (url: string) => void;
}

export default function OfferRibbon({ pricingSettings, onNavigate }: OfferRibbonProps) {
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    try {
      const dismissed = sessionStorage.getItem('dismissedOfferRibbon');
      if (dismissed === 'true') {
        setIsDismissed(true);
      }
    } catch (e) {}
  }, []);

  if (!pricingSettings || !pricingSettings.showRibbon) {
    return null;
  }

  // Check if offer is active (and within date range)
  if (!isPricingOfferActive(pricingSettings)) {
    return null;
  }

  if (isDismissed) {
    return null;
  }

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsDismissed(true);
    try {
      sessionStorage.setItem('dismissedOfferRibbon', 'true');
    } catch (e) {}
  };

  const handleClick = () => {
    const targetLink = pricingSettings.ribbonLink || '/preise';
    if (onNavigate) {
      onNavigate(targetLink);
    } else {
      window.history.pushState(null, '', targetLink);
      window.dispatchEvent(new PopStateEvent('popstate'));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const bgColor = pricingSettings.ribbonBgColor || '#F2761B';
  const textColor = pricingSettings.ribbonTextColor || '#FFFFFF';

  return (
    <aside aria-label="Aktuelles Angebot" className="fixed top-20 right-3 md:top-24 md:right-6 z-40 max-w-[calc(100vw-24px)] sm:max-w-sm pointer-events-auto">
      <div
        onClick={handleClick}
        style={{ backgroundColor: bgColor, color: textColor }}
        className="group flex items-center gap-2.5 px-3.5 py-2 md:px-4 md:py-2.5 rounded-full shadow-[0_8px_24px_rgba(0,0,0,0.22)] hover:shadow-[0_12px_28px_rgba(0,0,0,0.3)] transition-all duration-300 hover:scale-[1.03] cursor-pointer border border-white/20 select-none animate-in fade-in slide-in-from-top-2"
      >
        <span className="p-1 rounded-full bg-white/20 shrink-0">
          <Sparkles className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '4s' }} />
        </span>

        <span className="text-[12px] md:text-[13px] font-bold tracking-tight leading-tight truncate">
          {pricingSettings.ribbonText || '🔥 Limitiertes Angebot: Jetzt sparen!'}
        </span>

        <span className="shrink-0 transition-transform group-hover:translate-x-0.5">
          <ArrowRight className="w-3.5 h-3.5" />
        </span>

        <button
          type="button"
          onClick={handleDismiss}
          className="ml-0.5 p-1 rounded-full hover:bg-black/20 text-white/80 hover:text-white transition-colors shrink-0 cursor-pointer"
          title="Schließen"
          aria-label="Angebot schließen"
        >
          <X className="w-3 h-3" />
        </button>
      </div>
    </aside>
  );
}
