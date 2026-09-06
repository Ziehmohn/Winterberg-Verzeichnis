import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, X, Clock } from 'lucide-react';
import { PricingSettings } from '../types';

interface PromoTopBarProps {
  pricingSettings?: PricingSettings | null;
  onNavigate?: (path: string) => void;
  lang?: 'de' | 'nl';
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

export default function PromoTopBar({ pricingSettings, onNavigate, lang = 'de' }: PromoTopBarProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [timeLeft, setTimeLeft] = useState<TimeRemaining | null>(null);

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

  // Calculate Countdown
  useEffect(() => {
    const calculateTimeLeft = (): TimeRemaining => {
      let targetDate: Date;

      if (pricingSettings?.offerEndDate) {
        // e.g. "2026-09-15" -> End of that day (23:59:59)
        const dateParts = pricingSettings.offerEndDate.split('-');
        if (dateParts.length === 3) {
          targetDate = new Date(
            parseInt(dateParts[0], 10),
            parseInt(dateParts[1], 10) - 1,
            parseInt(dateParts[2], 10),
            23, 59, 59
          );
        } else {
          targetDate = new Date(pricingSettings.offerEndDate);
        }
      } else {
        // Fallback: Persistent dynamic rolling campaign (e.g. ends in 3 days)
        // Saved in localStorage so the user sees a realistic countdown that doesn't reset on refresh
        const storedDeadline = localStorage.getItem('wb_promo_rolling_deadline');
        const nowMs = Date.now();
        if (storedDeadline && parseInt(storedDeadline, 10) > nowMs) {
          targetDate = new Date(parseInt(storedDeadline, 10));
        } else {
          // Set to 3 days from now at 23:59:59
          const future = new Date();
          future.setDate(future.getDate() + 3);
          future.setHours(23, 59, 59, 999);
          localStorage.setItem('wb_promo_rolling_deadline', future.getTime().toString());
          targetDate = future;
        }
      }

      const diff = targetDate.getTime() - Date.now();
      if (diff <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      return { days, hours, minutes, seconds, isExpired: false };
    };

    // Initial calculation
    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [pricingSettings?.offerEndDate]);

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
      <div className="max-w-[1280px] mx-auto flex items-center justify-center gap-3 text-xs sm:text-sm px-6">
        <div 
          onClick={handleCtaClick}
          className="flex items-center gap-2.5 flex-wrap cursor-pointer group justify-center text-center"
        >
          {/* Badge */}
          <span className="inline-flex items-center gap-1 bg-white/20 hover:bg-white/30 text-white font-bold px-2.5 py-0.5 rounded-full text-[11px] uppercase tracking-wider backdrop-blur-xs border border-white/30 shrink-0">
            <Sparkles className="w-3 h-3 text-amber-300 animate-pulse" />
            {badgeText}
          </span>

          {/* Offer headline */}
          <span className="font-semibold tracking-tight text-white leading-tight drop-shadow-xs">
            {offerText}
          </span>

          {/* Live Countdown Timer */}
          {timeLeft && !timeLeft.isExpired && (
            <div className="inline-flex items-center gap-1.5 bg-black/30 hover:bg-black/40 px-2.5 py-1 rounded-lg border border-white/20 text-white shadow-xs backdrop-blur-xs shrink-0">
              <Clock className="w-3.5 h-3.5 text-[#FCD34D] animate-pulse" />
              <span className="text-[10.5px] uppercase tracking-wider text-white/80 font-medium hidden xs:inline">
                {lang === 'nl' ? 'Nog:' : 'Endet in:'}
              </span>
              <div className="flex items-center gap-1 font-mono font-bold text-xs tracking-tight">
                {timeLeft.days > 0 && (
                  <span className="bg-white/15 px-1.5 py-0.5 rounded text-[11px]">
                    {timeLeft.days}d
                  </span>
                )}
                <span className="bg-white/15 px-1.5 py-0.5 rounded text-[11px]">
                  {String(timeLeft.hours).padStart(2, '0')}h
                </span>
                <span>:</span>
                <span className="bg-white/15 px-1.5 py-0.5 rounded text-[11px]">
                  {String(timeLeft.minutes).padStart(2, '0')}m
                </span>
                <span>:</span>
                <span className="bg-[#F2761B] text-white px-1.5 py-0.5 rounded text-[11px]">
                  {String(timeLeft.seconds).padStart(2, '0')}s
                </span>
              </div>
            </div>
          )}

          {/* CTA Link */}
          <span className="inline-flex items-center gap-1 font-bold text-white bg-black/20 hover:bg-black/30 px-2.5 py-1 rounded-full transition-all group-hover:scale-105 shrink-0 border border-white/20">
            <span>{ctaText}</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </span>
        </div>

        {/* Dismiss button positioned on the right */}
        <button
          onClick={handleDismiss}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-1 rounded-full hover:bg-black/20 transition-colors shrink-0 cursor-pointer"
          title={lang === 'nl' ? 'Sluiten' : 'Schließen'}
          aria-label="Schließen"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
