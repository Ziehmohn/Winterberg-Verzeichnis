import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, X } from 'lucide-react';

interface PromoTopBarProps {
  onNavigate?: (path: string) => void;
  lang?: 'de' | 'nl';
}

export default function PromoTopBar({ onNavigate, lang = 'de' }: PromoTopBarProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if dismissed within the last 7 days
    try {
      const dismissedAt = localStorage.getItem('wb_promo_topbar_dismissed');
      if (dismissedAt) {
        const timePassed = Date.now() - parseInt(dismissedAt, 10);
        if (timePassed < 7 * 24 * 60 * 60 * 1000) {
          return;
        }
      }
      setIsVisible(true);
    } catch {
      setIsVisible(true);
    }
  }, []);

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsVisible(false);
    try {
      localStorage.setItem('wb_promo_topbar_dismissed', Date.now().toString());
    } catch {}
  };

  const handleCtaClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const targetUrl = lang === 'nl' ? '/nl/prijzen' : '/preise';
    if (onNavigate) {
      onNavigate(targetUrl);
    } else {
      window.history.pushState(null, '', targetUrl);
      window.dispatchEvent(new PopStateEvent('popstate'));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (!isVisible) return null;

  return (
    <div className="relative bg-gradient-to-r from-[#06301C] via-[#0F4C2E] to-[#06301C] text-white py-2.5 px-4 shadow-sm border-b border-[#F2761B]/30 z-30 transition-all">
      <div className="max-w-[1240px] mx-auto flex items-center justify-between gap-3 text-xs sm:text-sm">
        <div 
          onClick={handleCtaClick}
          className="flex items-center gap-2 flex-wrap cursor-pointer group flex-1 justify-center sm:justify-start"
        >
          <span className="inline-flex items-center gap-1 bg-[#F2761B] text-white font-bold px-2 py-0.5 rounded text-[11px] uppercase tracking-wider shadow-xs">
            <Sparkles className="w-3 h-3" />
            {lang === 'nl' ? 'Bedrijven' : 'Für Betriebe'}
          </span>

          <span className="text-gray-100 font-medium leading-tight text-center sm:text-left">
            {lang === 'nl' 
              ? 'Ondernemer in Winterberg? Krijg tot 5x meer zichtbaarheid en nieuwe klanten met een Premium-profiel.'
              : 'Sie führen einen Betrieb in Winterberg? Erhalten Sie bis zu 5x mehr Sichtbarkeit, DoFollow-Backlinks und Neukunden.'}
          </span>

          <span className="inline-flex items-center gap-1 font-bold text-[#FCD34D] group-hover:underline underline-offset-2 shrink-0">
            {lang === 'nl' ? 'Vrijblijvend bekijken' : 'Jetzt Vorteile entdecken'}
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </span>
        </div>

        <button
          onClick={handleDismiss}
          className="text-white/70 hover:text-white p-1 rounded hover:bg-white/10 transition-colors shrink-0 cursor-pointer ml-2"
          title={lang === 'nl' ? 'Sluiten' : 'Schließen'}
          aria-label="Schließen"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
