import React, { useState, useEffect } from 'react';
import { Snowflake, Clock } from 'lucide-react';

interface SkiOpeningTopBarProps {
  lang?: 'de' | 'nl';
}

interface CountdownState {
  mode: 'countdown' | 'today' | 'open';
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  targetYear: number;
}

function getCountdownState(): CountdownState {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth(); // 0-indexed: 10 = November
  const day = now.getDate();

  // On November 27
  if (month === 10 && day === 27 && now < new Date(year, 10, 27, 9, 0, 0)) {
    const diff = new Date(year, 10, 27, 9, 0, 0).getTime() - now.getTime();
    return {
      mode: 'countdown',
      days: 0,
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60),
      targetYear: year,
    };
  }

  if (month === 10 && day === 27) {
    return { mode: 'today', days: 0, hours: 0, minutes: 0, seconds: 0, targetYear: year };
  }

  // Winter season running: Nov 28 - Dec 31 or Jan 1 - Apr 30
  if ((month === 10 && day > 27) || month === 11 || month <= 3) {
    return { mode: 'open', days: 0, hours: 0, minutes: 0, seconds: 0, targetYear: year };
  }

  // May 1 - Nov 26: count down to Nov 27 of current year
  const target = new Date(year, 10, 27, 9, 0, 0);
  const diff = Math.max(0, target.getTime() - now.getTime());

  return {
    mode: 'countdown',
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    targetYear: year,
  };
}

export default function SkiOpeningTopBar({ lang = 'de' }: SkiOpeningTopBarProps) {
  const isNl = lang === 'nl';
  const [state, setState] = useState<CountdownState>(() => getCountdownState());

  useEffect(() => {
    setState(getCountdownState());
    const timer = setInterval(() => {
      setState(getCountdownState());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <div className="relative z-[110] w-full bg-gradient-to-r from-[#0c2340] via-[#0369a1] to-[#0c2340] text-white border-b border-sky-400/30 shadow-sm">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2 flex items-center justify-center gap-2 sm:gap-4 text-xs sm:text-sm flex-wrap">
        <div className="flex items-center gap-1.5 font-semibold text-sky-200">
          <Snowflake className="w-4 h-4 text-cyan-300 shrink-0" />
          <span>
            {state.mode === 'today'
              ? isNl
                ? 'Vandaag openen de skiliften in Winterberg (27-11)!'
                : 'Heute öffnen die Skilifte in Winterberg (27.11.)!'
              : state.mode === 'open'
                ? isNl
                  ? 'Skiseizoen geopend – skiliften open sinds 27-11'
                  : 'Skisaison gestartet – Skilifte seit dem 27.11. geöffnet'
                : isNl
                  ? 'Opening skiliften op 27-11:'
                  : 'Skilift-Eröffnung am 27.11.:'}
          </span>
        </div>

        {state.mode === 'countdown' && (
          <div className="flex items-center gap-1.5 font-mono font-bold text-white" aria-live="polite">
            <Clock className="w-3.5 h-3.5 text-cyan-300 hidden sm:inline shrink-0" />
            <span className="bg-white/15 border border-white/20 px-2 py-0.5 rounded">
              {state.days} {isNl ? (state.days === 1 ? 'dag' : 'dagen') : state.days === 1 ? 'Tag' : 'Tage'}
            </span>
            <span>:</span>
            <span className="bg-white/15 border border-white/20 px-1.5 py-0.5 rounded">
              {pad(state.hours)} {isNl ? 'u' : 'Std'}
            </span>
            <span>:</span>
            <span className="bg-white/15 border border-white/20 px-1.5 py-0.5 rounded">
              {pad(state.minutes)} Min
            </span>
            <span>:</span>
            <span className="bg-white/15 border border-white/20 px-1.5 py-0.5 rounded">
              {pad(state.seconds)} {isNl ? 'sec' : 'Sek'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
