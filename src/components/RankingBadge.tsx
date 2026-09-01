import React from 'react';
import { Trophy, Award, Sparkles, Star } from 'lucide-react';
import { BusinessRankingBadgeInfo } from '../utils/bestOfRankingBadges';

interface RankingBadgeProps {
  badge: BusinessRankingBadgeInfo;
  lang?: 'de' | 'nl';
  variant?: 'compact' | 'pill' | 'seal' | 'header';
  className?: string;
  onClick?: () => void;
}

export const RankingBadge: React.FC<RankingBadgeProps> = ({
  badge,
  lang = 'de',
  variant = 'pill',
  className = '',
  onClick,
}) => {
  const isNl = lang === 'nl';
  const label = isNl ? badge.labelNl : badge.labelDe;
  const subLabel = isNl ? badge.subLabelNl : badge.subLabelDe;

  // Star Shape Variant for Top 1
  if (badge.tier === 'top1_star' && (variant === 'seal' || variant === 'header')) {
    return (
      <div
        onClick={onClick}
        className={`relative inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 text-amber-950 font-display font-extrabold text-xs shadow-[0_4px_14px_rgba(245,158,11,0.35)] border border-yellow-200/90 select-none animate-pulse-subtle ${onClick ? 'cursor-pointer hover:scale-105 transition-transform' : ''} ${className}`}
        title={`${label} – ${subLabel}`}
      >
        {/* Golden Star Icon with sparkle */}
        <div className="w-5 h-5 rounded-full bg-white/90 text-amber-600 flex items-center justify-center shrink-0 shadow-xs">
          <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-600" />
        </div>
        <div className="flex flex-col leading-tight">
          <span className="font-bold text-[12px] tracking-wide text-amber-950 uppercase">{label}</span>
          <span className="text-[9.5px] font-semibold text-amber-900/80 -mt-0.5">{subLabel}</span>
        </div>
        <Sparkles className="w-3.5 h-3.5 text-amber-800 animate-spin-slow" />
      </div>
    );
  }

  // Header / Seal Variant for Top 3, Top 5, Top 10
  if (variant === 'header' || variant === 'seal') {
    let bgStyle = '';
    let textColor = '';
    let icon = <Award className="w-4 h-4" />;

    if (badge.tier === 'top3_gold') {
      bgStyle = 'bg-gradient-to-r from-amber-200 via-amber-300 to-yellow-400 border-amber-300/80 shadow-[0_4px_12px_rgba(245,158,11,0.25)]';
      textColor = 'text-amber-950';
      icon = <Trophy className="w-4 h-4 text-amber-800" />;
    } else if (badge.tier === 'top5_silver') {
      bgStyle = 'bg-gradient-to-r from-slate-100 via-slate-200 to-gray-300 border-slate-300/90 shadow-[0_4px_12px_rgba(148,163,184,0.25)]';
      textColor = 'text-slate-900';
      icon = <Award className="w-4 h-4 text-slate-700" />;
    } else {
      bgStyle = 'bg-gradient-to-r from-amber-100 via-orange-100 to-amber-200 border-amber-300/70 shadow-[0_4px_12px_rgba(217,119,6,0.20)]';
      textColor = 'text-amber-950';
      icon = <Award className="w-4 h-4 text-amber-800" />;
    }

    return (
      <div
        onClick={onClick}
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${bgStyle} ${textColor} border font-display font-extrabold text-xs select-none ${onClick ? 'cursor-pointer hover:scale-105 transition-transform' : ''} ${className}`}
        title={`${label} – ${subLabel}`}
      >
        <div className="w-4 h-4 flex items-center justify-center shrink-0">
          {icon}
        </div>
        <div className="flex flex-col leading-tight">
          <span className="font-bold text-[12px] tracking-wide uppercase">{label}</span>
          <span className="text-[9.5px] font-semibold opacity-75 -mt-0.5">{subLabel}</span>
        </div>
      </div>
    );
  }

  // Compact / Pill Variant for Cards
  if (badge.tier === 'top1_star') {
    return (
      <span
        onClick={onClick}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-gradient-to-r from-amber-300 to-yellow-400 text-amber-950 font-bold text-[11px] shadow-xs border border-yellow-200/90 uppercase tracking-wider ${onClick ? 'cursor-pointer' : ''} ${className}`}
        title={subLabel}
      >
        <Star className="w-3.5 h-3.5 fill-amber-600 text-amber-700" />
        <span>{label}</span>
      </span>
    );
  } else if (badge.tier === 'top3_gold') {
    return (
      <span
        onClick={onClick}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-gradient-to-r from-amber-200 to-amber-300 text-amber-950 font-bold text-[11px] shadow-xs border border-amber-300 uppercase tracking-wider ${onClick ? 'cursor-pointer' : ''} ${className}`}
        title={subLabel}
      >
        <Trophy className="w-3.5 h-3.5 text-amber-800" />
        <span>{label}</span>
      </span>
    );
  } else if (badge.tier === 'top5_silver') {
    return (
      <span
        onClick={onClick}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-gradient-to-r from-slate-200 to-gray-300 text-slate-900 font-bold text-[11px] shadow-xs border border-slate-300 uppercase tracking-wider ${onClick ? 'cursor-pointer' : ''} ${className}`}
        title={subLabel}
      >
        <Award className="w-3.5 h-3.5 text-slate-700" />
        <span>{label}</span>
      </span>
    );
  } else {
    return (
      <span
        onClick={onClick}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-gradient-to-r from-amber-100 to-orange-200 text-amber-950 font-bold text-[11px] shadow-xs border border-amber-300 uppercase tracking-wider ${onClick ? 'cursor-pointer' : ''} ${className}`}
        title={subLabel}
      >
        <Award className="w-3.5 h-3.5 text-amber-800" />
        <span>{label}</span>
      </span>
    );
  }
};
export default RankingBadge;
