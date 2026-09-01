import React from 'react';
import { Trophy, Award, Sparkles, Star } from 'lucide-react';
import { BusinessRankingBadgeInfo } from '../utils/bestOfRankingBadges';

interface RankingBadgeProps {
  badge: BusinessRankingBadgeInfo;
  lang?: 'de' | 'nl';
  variant?: 'compact' | 'pill' | 'seal' | 'header';
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
  onNavigate?: (path: string) => void;
}

export const RankingBadge: React.FC<RankingBadgeProps> = ({
  badge,
  lang = 'de',
  variant = 'pill',
  className = '',
  onClick,
  onNavigate,
}) => {
  const isNl = lang === 'nl';
  const label = isNl ? badge.labelNl : badge.labelDe;
  const subLabel = isNl ? badge.subLabelNl : badge.subLabelDe;
  const targetPath = isNl ? badge.targetPathNl : badge.targetPathDe;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onClick) {
      onClick(e);
      return;
    }
    e.preventDefault();
    if (onNavigate) {
      onNavigate(targetPath);
    } else {
      window.history.pushState(null, '', targetPath);
      window.dispatchEvent(new PopStateEvent('popstate'));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Star Shape Variant for Top 1
  if (badge.tier === 'top1_star' && (variant === 'seal' || variant === 'header')) {
    return (
      <a
        href={targetPath}
        onClick={handleClick}
        className={`relative inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 text-amber-950 font-display font-extrabold text-xs shadow-[0_4px_14px_rgba(245,158,11,0.35)] border border-yellow-200/90 select-none no-underline cursor-pointer hover:scale-105 hover:shadow-[0_6px_20px_rgba(245,158,11,0.5)] transition-all ${className}`}
        title={`${label} – ${subLabel} (Hier klicken zur Bestenliste)`}
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
      </a>
    );
  }

  // Header / Seal Variant for Top 3, Top 5, Top 10
  if (variant === 'header' || variant === 'seal') {
    let bgStyle = '';
    let textColor = '';
    let icon = <Award className="w-4 h-4" />;

    if (badge.tier === 'top3_gold') {
      bgStyle = 'bg-gradient-to-r from-amber-200 via-amber-300 to-yellow-400 border-amber-300/80 shadow-[0_4px_12px_rgba(245,158,11,0.25)] hover:shadow-[0_6px_16px_rgba(245,158,11,0.4)]';
      textColor = 'text-amber-950';
      icon = <Trophy className="w-4 h-4 text-amber-800" />;
    } else if (badge.tier === 'top5_silver') {
      bgStyle = 'bg-gradient-to-r from-slate-100 via-slate-200 to-gray-300 border-slate-300/90 shadow-[0_4px_12px_rgba(148,163,184,0.25)] hover:shadow-[0_6px_16px_rgba(148,163,184,0.4)]';
      textColor = 'text-slate-900';
      icon = <Award className="w-4 h-4 text-slate-700" />;
    } else {
      bgStyle = 'bg-gradient-to-r from-amber-100 via-orange-100 to-amber-200 border-amber-300/70 shadow-[0_4px_12px_rgba(217,119,6,0.20)] hover:shadow-[0_6px_16px_rgba(217,119,6,0.35)]';
      textColor = 'text-amber-950';
      icon = <Award className="w-4 h-4 text-amber-800" />;
    }

    return (
      <a
        href={targetPath}
        onClick={handleClick}
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${bgStyle} ${textColor} border font-display font-extrabold text-xs select-none no-underline cursor-pointer hover:scale-105 transition-all ${className}`}
        title={`${label} – ${subLabel} (Hier klicken zur Bestenliste)`}
      >
        <div className="w-4 h-4 flex items-center justify-center shrink-0">
          {icon}
        </div>
        <div className="flex flex-col leading-tight">
          <span className="font-bold text-[12px] tracking-wide uppercase">{label}</span>
          <span className="text-[9.5px] font-semibold opacity-75 -mt-0.5">{subLabel}</span>
        </div>
      </a>
    );
  }

  // Compact / Pill Variant for Cards
  let badgeClasses = '';
  let badgeIcon = null;

  if (badge.tier === 'top1_star') {
    badgeClasses = 'bg-gradient-to-r from-amber-300 to-yellow-400 text-amber-950 border-yellow-200/90 hover:brightness-105';
    badgeIcon = <Star className="w-3.5 h-3.5 fill-amber-600 text-amber-700" />;
  } else if (badge.tier === 'top3_gold') {
    badgeClasses = 'bg-gradient-to-r from-amber-200 to-amber-300 text-amber-950 border-amber-300 hover:brightness-105';
    badgeIcon = <Trophy className="w-3.5 h-3.5 text-amber-800" />;
  } else if (badge.tier === 'top5_silver') {
    badgeClasses = 'bg-gradient-to-r from-slate-200 to-gray-300 text-slate-900 border-slate-300 hover:brightness-105';
    badgeIcon = <Award className="w-3.5 h-3.5 text-slate-700" />;
  } else {
    badgeClasses = 'bg-gradient-to-r from-amber-100 to-orange-200 text-amber-950 border-amber-300 hover:brightness-105';
    badgeIcon = <Award className="w-3.5 h-3.5 text-amber-800" />;
  }

  return (
    <a
      href={targetPath}
      onClick={handleClick}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md ${badgeClasses} font-bold text-[11px] shadow-2xs border uppercase tracking-wider no-underline cursor-pointer hover:scale-105 transition-transform ${className}`}
      title={`${label} – ${subLabel} (Hier klicken zur Bestenliste)`}
    >
      {badgeIcon}
      <span>{label}</span>
    </a>
  );
};
export default RankingBadge;
