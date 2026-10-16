import React from 'react';
import { HeaderDividerStyle, DesignSettings, HeaderDividerPageConfig, CustomDivider } from '../types';

export interface HeaderShapeDividerProps {
  style?: HeaderDividerStyle;
  color?: string; // Fill color of the bottom section (e.g. '#FAF8F5' or '#FFFFFF')
  className?: string;
  heightClass?: string;
  customDividers?: CustomDivider[];
}

export interface DividerOption {
  id: HeaderDividerStyle;
  label: string;
  description: string;
  badge?: string;
  isCustom?: boolean;
}

export const DIVIDER_OPTIONS: DividerOption[] = [
  {
    id: 'none',
    label: 'Kein Divider (Standard)',
    description: 'Klassischer gerader horizontaler Abschluss ohne Verzierung.'
  },
  {
    id: 'wave-flow',
    label: 'Geschwungener Wellenfluss',
    description: 'Elegante, organisch geschwungene Wellenkontur mit weichen Übergängen.',
    badge: 'Neu'
  },
  {
    id: 'mountains',
    label: 'Sauerland Berge & Kämme',
    description: 'Charakteristische Bergspitzen und Höhenzüge des Sauerlands.',
    badge: 'Empfohlen'
  },
  {
    id: 'wave-smooth',
    label: 'Sanfte Welle',
    description: 'Weicher, fließender und organischer Wellenverlauf.'
  },
  {
    id: 'wave-asymmetric',
    label: 'Dynamische Welle',
    description: 'Schwungvolle, asymmetrische Wellenform mit viel Eleganz.'
  },
  {
    id: 'slant-right',
    label: 'Diagonale Rechts',
    description: 'Moderne, dynamische Schräge von links oben nach rechts.'
  },
  {
    id: 'slant-left',
    label: 'Diagonale Links',
    description: 'Dynamische Schräge von rechts oben nach links.'
  },
  {
    id: 'curve',
    label: 'Sanfter Bogen',
    description: 'Harmonische, dezente Wölbung für ein ruhiges Gesamtbild.'
  },
  {
    id: 'peaks-gentle',
    label: 'Sanfte Hügelkette',
    description: 'Gleichmäßige, weiche Bergkuppen und Hügelverläufe.'
  }
];

export const BASE_DIVIDER_SHAPES: { id: string; name: string; pathData: string; viewBox: string }[] = [
  {
    id: 'wave-flow',
    name: 'Waves (Organischer Wellenfluss)',
    pathData: 'M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z',
    viewBox: '0 0 1200 120'
  },
  {
    id: 'mountains',
    name: 'Sauerland Berge & Kämme',
    pathData: 'M0,92 Q140,58 290,32 Q380,48 480,24 Q570,38 680,18 Q820,38 970,24 Q1090,44 1200,34 L1200,120 L0,120 Z',
    viewBox: '0 0 1200 120'
  },
  {
    id: 'wave-smooth',
    name: 'Sanfte Welle',
    pathData: 'M0,55 C240,105 380,15 620,55 C860,95 1020,15 1200,50 L1200,120 L0,120 Z',
    viewBox: '0 0 1200 120'
  },
  {
    id: 'wave-asymmetric',
    name: 'Dynamische Welle',
    pathData: 'M0,75 C220,15 440,100 700,35 C920,-15 1080,65 1200,28 L1200,120 L0,120 Z',
    viewBox: '0 0 1200 120'
  },
  {
    id: 'slant-right',
    name: 'Diagonale Rechts',
    pathData: 'M0,120 L1200,18 L1200,120 Z',
    viewBox: '0 0 1200 120'
  },
  {
    id: 'slant-left',
    name: 'Diagonale Links',
    pathData: 'M0,18 L1200,120 L0,120 Z',
    viewBox: '0 0 1200 120'
  },
  {
    id: 'curve',
    name: 'Sanfter Bogen',
    pathData: 'M0,90 Q600,0 1200,90 L1200,120 L0,120 Z',
    viewBox: '0 0 1200 120'
  },
  {
    id: 'peaks-gentle',
    name: 'Sanfte Hügelkette',
    pathData: 'M0,65 Q180,25 360,55 T720,55 T1080,55 Q1150,60 1200,50 L1200,120 L0,120 Z',
    viewBox: '0 0 1200 120'
  }
];

export function getAllDividerOptions(customDividers?: CustomDivider[]): DividerOption[] {
  const customOpts: DividerOption[] = (customDividers || []).map(cd => ({
    id: cd.id,
    label: cd.name,
    description: cd.description || 'Individuell erstellter Shape-Divider',
    badge: cd.badge || 'Eigen',
    isCustom: true
  }));
  return [...DIVIDER_OPTIONS, ...customOpts];
}

export function parseSvgOrPath(input: string): { pathData: string; viewBox?: string } | null {
  if (!input || !input.trim()) return null;
  const trimmed = input.trim();

  // If it's already just a path 'd' string (starts with M or m):
  if (/^[Mm]\s*[-0-9]/.test(trimmed) && !trimmed.includes('<')) {
    return { pathData: trimmed };
  }

  // Extract d="..." attribute from <path ... d="..." ...>
  const pathMatch = trimmed.match(/<path[^>]*\bd=["']([^"']+)["']/i);
  // Extract viewBox="..." from <svg ... viewBox="..." ...>
  const viewBoxMatch = trimmed.match(/<svg[^>]*\bviewBox=["']([^"']+)["']/i);

  if (pathMatch && pathMatch[1]) {
    return {
      pathData: pathMatch[1],
      viewBox: viewBoxMatch ? viewBoxMatch[1] : undefined
    };
  }

  // If polygon points:
  const polygonMatch = trimmed.match(/<polygon[^>]*\bpoints=["']([^"']+)["']/i);
  if (polygonMatch && polygonMatch[1]) {
    const pts = polygonMatch[1].trim().split(/\s+/).map(p => p.split(',').map(Number));
    if (pts.length > 0) {
      const pathD = `M${pts.map(p => p.join(',')).join(' L')} Z`;
      return {
        pathData: pathD,
        viewBox: viewBoxMatch ? viewBoxMatch[1] : undefined
      };
    }
  }

  return null;
}

export function getEffectiveDivider(
  pageKey: keyof HeaderDividerPageConfig,
  settings?: DesignSettings
): HeaderDividerStyle {
  if (!settings?.headerDividers) return 'none';
  const pageValue = settings.headerDividers[pageKey];
  if (pageValue !== undefined && pageValue !== null) {
    return pageValue;
  }
  return settings.headerDividers.global || 'none';
}

export default function HeaderShapeDivider({
  style = 'none',
  color = '#FAF8F5',
  className = '',
  heightClass = 'h-[36px] sm:h-[50px] md:h-[64px]',
  customDividers
}: HeaderShapeDividerProps) {
  if (!style || style === 'none') {
    return null;
  }

  // 1. Resolve custom divider if applicable
  let resolvedCustom: CustomDivider | undefined = customDividers?.find(d => d.id === style);
  if (!resolvedCustom && typeof window !== 'undefined' && style && typeof style === 'string' && style.startsWith('custom-')) {
    try {
      const saved = localStorage.getItem('siteDesignSettings');
      if (saved) {
        const parsed = JSON.parse(saved);
        resolvedCustom = parsed.customDividers?.find((d: any) => d.id === style);
      }
    } catch (e) {}
  }

  const effectiveColor = resolvedCustom?.color || color;

  const renderPath = () => {
    // If it's a custom divider
    if (resolvedCustom) {
      return (
        <path
          d={resolvedCustom.pathData}
          fill={effectiveColor}
        />
      );
    }

    switch (style) {
      case 'wave-flow':
        // Custom shapedivider.app wave shape requested by user:
        // Fully transparent upper area, smooth organic lower wave in layout color
        return (
          <path
            d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z"
            fill={effectiveColor}
          />
        );

      case 'mountains':
        return (
          <path
            d="M0,92 Q140,58 290,32 Q380,48 480,24 Q570,38 680,18 Q820,38 970,24 Q1090,44 1200,34 L1200,120 L0,120 Z"
            fill={effectiveColor}
          />
        );

      case 'wave-smooth':
        return (
          <path
            d="M0,55 C240,105 380,15 620,55 C860,95 1020,15 1200,50 L1200,120 L0,120 Z"
            fill={effectiveColor}
          />
        );

      case 'wave-asymmetric':
        return (
          <path
            d="M0,75 C220,15 440,100 700,35 C920,-15 1080,65 1200,28 L1200,120 L0,120 Z"
            fill={effectiveColor}
          />
        );

      case 'slant-right':
        return (
          <polygon
            points="0,120 1200,18 1200,120"
            fill={effectiveColor}
          />
        );

      case 'slant-left':
        return (
          <polygon
            points="0,18 1200,120 0,120"
            fill={effectiveColor}
          />
        );

      case 'curve':
        return (
          <path
            d="M0,90 Q600,0 1200,90 L1200,120 L0,120 Z"
            fill={effectiveColor}
          />
        );

      case 'peaks-gentle':
        return (
          <path
            d="M0,65 Q180,25 360,55 T720,55 T1080,55 Q1150,60 1200,50 L1200,120 L0,120 Z"
            fill={effectiveColor}
          />
        );

      default:
        return null;
    }
  };

  // Build transformation styles for SVG
  const transforms: string[] = ['translateY(1px)'];
  if (resolvedCustom?.flipHorizontal) {
    transforms.push('scaleX(-1)');
  }
  if (resolvedCustom?.invert || resolvedCustom?.position === 'top') {
    transforms.push('scaleY(-1)');
  }

  const svgStyle: React.CSSProperties = {
    transform: transforms.join(' '),
    transformOrigin: 'center center',
  };

  if (resolvedCustom?.heightPx) {
    svgStyle.height = `${resolvedCustom.heightPx}px`;
  }

  if (resolvedCustom?.widthPercent && resolvedCustom.widthPercent > 100) {
    svgStyle.width = `${resolvedCustom.widthPercent}%`;
    svgStyle.minWidth = '100%';
    svgStyle.position = 'relative';
    svgStyle.left = '50%';
    transforms.unshift('translateX(-50%)');
    svgStyle.transform = transforms.join(' ');
  }

  const viewBox = resolvedCustom?.viewBox || '0 0 1200 120';

  return (
    <div
      className={`w-full overflow-hidden leading-none select-none pointer-events-none -mb-[1px] relative z-10 ${className}`}
      aria-hidden="true"
    >
      <svg
        viewBox={viewBox}
        preserveAspectRatio="none"
        className={`w-full ${resolvedCustom?.heightPx ? '' : heightClass} block`}
        style={svgStyle}
      >
        {renderPath()}
      </svg>
    </div>
  );
}

