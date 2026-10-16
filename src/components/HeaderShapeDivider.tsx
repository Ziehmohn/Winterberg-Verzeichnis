import React, { useEffect, useRef } from 'react';
import { HeaderDividerStyle, DesignSettings, HeaderDividerPageConfig, CustomDivider, CustomDividerLayer } from '../types';

export interface HeaderShapeDividerProps {
  style?: HeaderDividerStyle;
  color?: string; // Fill color of the bottom section (e.g. '#FAF8F5', '#FFFFFF' or 'transparent')
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

export interface BaseShapeDef {
  id: string;
  name: string;
  category: string;
  pathData: string;
  viewBox: string;
  defaultLayers?: CustomDividerLayer[];
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
    id: 'fan-opacity',
    label: 'Fächer mit Tiefen-Ebenen',
    description: '3 geschwungene Ebenen mit eleganter Transparenz-Staffelung.',
    badge: 'Layered'
  },
  {
    id: 'mountains-layered',
    label: 'Sauerland Berge (Mehrstufig)',
    description: 'Charakteristische Bergzüge mit malerischen Hintergrund-Kämmen.',
    badge: 'Empfohlen'
  },
  {
    id: 'waves-layered',
    label: 'Moderne Doppelwelle',
    description: 'Zweistufige Welle mit weicher Hintergrund-Silhouette.',
    badge: 'Modern'
  },
  {
    id: 'tilt-opacity',
    label: 'Dynamische Schräge (2 Ebenen)',
    description: 'Moderne Diagonale mit versetzter semi-transparenter Kante.'
  },
  {
    id: 'drops',
    label: 'Tropfen & Drips',
    description: 'Organisch fließende Tropfenform für einen kreativen Look.'
  },
  {
    id: 'clouds',
    label: 'Wolken-Silhouette',
    description: 'Sanft geschwungene, bauschige Wolkenbögen.'
  },
  {
    id: 'curve',
    label: 'Sanfter Bogen',
    description: 'Harmonische, dezente Wölbung für ein ruhiges Gesamtbild.'
  },
  {
    id: 'pyramids',
    label: 'Geometrische Spitzen',
    description: 'Kantige architektonische Dreiecks-Struktur.'
  },
  {
    id: 'zigzag',
    label: 'Zickzack-Kante',
    description: 'Prägnante Sägezahn-Kontur für markanten Rhythmus.'
  },
  {
    id: 'wave-smooth',
    label: 'Sanfte Welle',
    description: 'Weicher, fließender und organischer Wellenverlauf.'
  },
  {
    id: 'slant-right',
    label: 'Diagonale Rechts',
    description: 'Moderne, dynamische Schräge von links oben nach rechts.'
  }
];

// Complete shape divider catalog matching user's reference screenshots (Screenshot 5)
export const BASE_DIVIDER_SHAPES: BaseShapeDef[] = [
  {
    id: 'wave-flow',
    name: 'Waves (Organischer Wellenfluss)',
    category: 'Wellen',
    pathData: 'M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z',
    viewBox: '0 0 1200 120',
    defaultLayers: [
      { pathData: 'M0,120 L0,50 C240,95 480,20 720,60 C960,100 1080,45 1200,65 L1200,120 Z', opacity: 0.35 }
    ]
  },
  {
    id: 'fan-opacity',
    name: 'Fan Opacity (Fächer mit 3 Ebenen)',
    category: 'Layered',
    pathData: 'M0,120 L0,100 Q600,55 1200,105 L1200,120 Z',
    viewBox: '0 0 1200 120',
    defaultLayers: [
      { pathData: 'M0,120 L0,65 Q600,10 1200,80 L1200,120 Z', opacity: 0.25 },
      { pathData: 'M0,120 L0,82 Q600,32 1200,92 L1200,120 Z', opacity: 0.5 }
    ]
  },
  {
    id: 'mountains-layered',
    name: 'Mountains (Sauerland Berge mit Tiefenstaffelung)',
    category: 'Berge & Natur',
    pathData: 'M0,92 Q140,58 290,32 Q380,48 480,24 Q570,38 680,18 Q820,38 970,24 Q1090,44 1200,34 L1200,120 L0,120 Z',
    viewBox: '0 0 1200 120',
    defaultLayers: [
      { pathData: 'M0,120 L0,45 Q150,15 320,50 Q480,10 650,45 Q820,15 980,45 Q1100,20 1200,50 L1200,120 Z', opacity: 0.25 },
      { pathData: 'M0,120 L0,68 Q180,38 350,70 Q520,35 700,65 Q870,30 1020,60 Q1120,40 1200,68 L1200,120 Z', opacity: 0.5 }
    ]
  },
  {
    id: 'tilt-opacity',
    name: 'Tilt Opacity (Diagonale mit 2 Ebenen)',
    category: 'Schrägen',
    pathData: 'M0,85 L1200,25 L1200,120 L0,120 Z',
    viewBox: '0 0 1200 120',
    defaultLayers: [
      { pathData: 'M0,50 L1200,0 L1200,120 L0,120 Z', opacity: 0.35 }
    ]
  },
  {
    id: 'waves-layered',
    name: 'Waves Multi-Layer (Doppelwelle wie Banner)',
    category: 'Wellen',
    pathData: 'M0,65 C240,110 390,25 640,65 C880,100 1040,30 1200,60 L1200,120 L0,120 Z',
    viewBox: '0 0 1200 120',
    defaultLayers: [
      { pathData: 'M0,35 C280,85 450,10 720,60 C960,105 1100,25 1200,50 L1200,120 L0,120 Z', opacity: 0.35 }
    ]
  },
  {
    id: 'wave-brush',
    name: 'Waves Brush (Organische Pinselwelle)',
    category: 'Wellen',
    pathData: 'M0,120 L0,80 C150,95 280,30 450,75 C620,115 800,35 980,80 C1080,100 1140,75 1200,80 L1200,120 Z',
    viewBox: '0 0 1200 120',
    defaultLayers: [
      { pathData: 'M0,120 L0,60 C180,80 320,15 500,65 C680,105 850,20 1020,70 C1100,90 1160,65 1200,70 L1200,120 Z', opacity: 0.3 }
    ]
  },
  {
    id: 'drops',
    name: 'Drops (Tropfen / Farb-Drips)',
    category: 'Kreativ',
    pathData: 'M0,120 L0,30 Q30,30 40,65 Q50,65 60,30 Q120,30 130,80 Q140,80 150,30 Q200,30 210,55 Q220,55 230,30 Q300,30 310,95 Q320,95 330,30 Q400,30 410,70 Q420,70 430,30 Q500,30 510,85 Q520,85 530,30 Q600,30 610,60 Q620,60 630,30 Q700,30 710,90 Q720,90 730,30 Q800,30 810,75 Q820,75 830,30 Q900,30 910,85 Q920,85 930,30 Q1000,30 1010,65 Q1020,65 1030,30 Q1100,30 1110,80 Q1120,80 1130,30 L1200,30 L1200,120 Z',
    viewBox: '0 0 1200 120'
  },
  {
    id: 'clouds',
    name: 'Clouds (Wolken-Kontur)',
    category: 'Berge & Natur',
    pathData: 'M0,120 L0,85 Q60,50 120,85 Q180,45 240,85 Q320,35 400,85 Q480,40 560,85 Q640,30 720,85 Q800,45 880,85 Q960,35 1040,85 Q1120,45 1200,85 L1200,120 Z',
    viewBox: '0 0 1200 120'
  },
  {
    id: 'curve',
    name: 'Curve (Sanfter Bogen)',
    category: 'Bögen',
    pathData: 'M0,90 Q600,0 1200,90 L1200,120 L0,120 Z',
    viewBox: '0 0 1200 120'
  },
  {
    id: 'curve-asymmetric',
    name: 'Curve Asymmetrical (Schwungbogen)',
    category: 'Bögen',
    pathData: 'M0,120 L0,95 Q400,10 1200,80 L1200,120 Z',
    viewBox: '0 0 1200 120'
  },
  {
    id: 'pyramids',
    name: 'Pyramids (Geometrische Zacken)',
    category: 'Geometrisch',
    pathData: 'M0,120 L0,80 L200,45 L400,90 L650,30 L900,85 L1050,55 L1200,80 L1200,120 Z',
    viewBox: '0 0 1200 120'
  },
  {
    id: 'triangle',
    name: 'Triangle (Zentriertes Dreieck)',
    category: 'Geometrisch',
    pathData: 'M0,120 L0,20 L600,105 L1200,20 L1200,120 Z',
    viewBox: '0 0 1200 120'
  },
  {
    id: 'triangle-asymmetric',
    name: 'Triangle Asymmetrical (Asymmetrisches Dreieck)',
    category: 'Geometrisch',
    pathData: 'M0,120 L0,25 L450,105 L1200,50 L1200,120 Z',
    viewBox: '0 0 1200 120'
  },
  {
    id: 'tilt',
    name: 'Tilt (Klare Schräge)',
    category: 'Schrägen',
    pathData: 'M0,120 L1200,18 L1200,120 Z',
    viewBox: '0 0 1200 120'
  },
  {
    id: 'split',
    name: 'Split (Zentrierter Pfeil / Notch)',
    category: 'Geometrisch',
    pathData: 'M0,120 L0,95 L570,95 L600,118 L630,95 L1200,95 L1200,120 Z',
    viewBox: '0 0 1200 120'
  },
  {
    id: 'book',
    name: 'Book (Buch-Schwung)',
    category: 'Bögen',
    pathData: 'M0,120 L0,90 Q300,20 600,100 Q900,20 1200,90 L1200,120 Z',
    viewBox: '0 0 1200 120'
  },
  {
    id: 'zigzag',
    name: 'Zigzag (Zickzack-Kante)',
    category: 'Geometrisch',
    pathData: 'M0,120 L0,70 L50,105 L100,70 L150,105 L200,70 L250,105 L300,70 L350,105 L400,70 L450,105 L500,70 L550,105 L600,70 L650,105 L700,70 L750,105 L800,70 L850,105 L900,70 L950,105 L1000,70 L1050,105 L1100,70 L1150,105 L1200,70 L1200,120 Z',
    viewBox: '0 0 1200 120'
  },
  {
    id: 'waves-pattern',
    name: 'Waves Pattern (Gleichmäßiges Wellenmuster)',
    category: 'Wellen',
    pathData: 'M0,120 L0,80 Q75,55 150,80 T300,80 T450,80 T600,80 T750,80 T900,80 T1050,80 T1200,80 L1200,120 Z',
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

// Generate an SVG mask data-uri that masks out the bottom of a container
export function getMaskSvgDataUri(pathData: string, viewBox: string = '0 0 1200 120'): string {
  const maskSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" preserveAspectRatio="none"><mask id="cutout"><rect width="1200" height="120" fill="white"/><path d="${pathData}" fill="black"/></mask><rect width="1200" height="120" fill="black" mask="url(#cutout)"/></svg>`;
  return `url("data:image/svg+xml;utf8,${encodeURIComponent(maskSvg)}")`;
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
  const containerRef = useRef<HTMLDivElement>(null);

  const isEnabled = Boolean(style && style !== 'none');

  // 1. Resolve custom divider if applicable
  let resolvedCustom: CustomDivider | undefined = isEnabled ? customDividers?.find(d => d.id === style) : undefined;
  if (isEnabled && !resolvedCustom && typeof window !== 'undefined' && style && typeof style === 'string' && style.startsWith('custom-')) {
    try {
      const saved = localStorage.getItem('siteDesignSettings');
      if (saved) {
        const parsed = JSON.parse(saved);
        resolvedCustom = parsed.customDividers?.find((d: any) => d.id === style);
      }
    } catch (e) {}
  }

  // Check matching base shape
  const baseDef = isEnabled ? BASE_DIVIDER_SHAPES.find(s => s.id === style) : undefined;

  // Check if true transparency / mask is requested
  const isTransparent = isEnabled && Boolean(
    resolvedCustom?.isMask || 
    resolvedCustom?.color === 'transparent' || 
    color === 'transparent' ||
    (resolvedCustom?.opacity !== undefined && resolvedCustom.opacity === 0)
  );

  const effectiveColor = isTransparent 
    ? 'transparent' 
    : (resolvedCustom?.color || color);

  const mainPath = resolvedCustom?.pathData || baseDef?.pathData || BASE_DIVIDER_SHAPES[0]?.pathData || '';
  const viewBox = resolvedCustom?.viewBox || baseDef?.viewBox || '0 0 1200 120';
  const heightPx = resolvedCustom?.heightPx || 64;

  // Apply Andrew Walpole's CSS Mask technique to parent header container if transparent
  useEffect(() => {
    const parent = containerRef.current?.parentElement;
    if (!parent) return;

    if (isEnabled && isTransparent && mainPath) {
      const maskDataUri = getMaskSvgDataUri(mainPath, viewBox);
      
      // Apply CSS mask: top area of header is 100% visible, bottom heightPx is masked by the wave
      parent.style.webkitMaskImage = `${maskDataUri}, linear-gradient(to bottom, #000 0%, #000 calc(100% - ${heightPx}px), transparent calc(100% - ${heightPx}px))`;
      parent.style.maskImage = `${maskDataUri}, linear-gradient(to bottom, #000 0%, #000 calc(100% - ${heightPx}px), transparent calc(100% - ${heightPx}px))`;
      parent.style.webkitMaskPosition = 'bottom, top';
      parent.style.maskPosition = 'bottom, top';
      parent.style.webkitMaskSize = `100% ${heightPx}px, 100% 100%`;
      parent.style.maskSize = `100% ${heightPx}px, 100% 100%`;
      parent.style.webkitMaskRepeat = 'no-repeat';
      parent.style.maskRepeat = 'no-repeat';
    } else {
      // Clear mask
      parent.style.webkitMaskImage = '';
      parent.style.maskImage = '';
      parent.style.webkitMaskPosition = '';
      parent.style.maskPosition = '';
      parent.style.webkitMaskSize = '';
      parent.style.maskSize = '';
      parent.style.webkitMaskRepeat = '';
      parent.style.maskRepeat = '';
    }

    return () => {
      if (parent) {
        parent.style.webkitMaskImage = '';
        parent.style.maskImage = '';
        parent.style.webkitMaskPosition = '';
        parent.style.maskPosition = '';
        parent.style.webkitMaskSize = '';
        parent.style.maskSize = '';
        parent.style.webkitMaskRepeat = '';
        parent.style.maskRepeat = '';
      }
    };
  }, [isEnabled, isTransparent, mainPath, viewBox, heightPx]);

  if (!isEnabled) {
    return <div ref={containerRef} className="hidden" aria-hidden="true" />;
  }

  // Build transformation styles for SVG
  const transforms: string[] = ['translateY(1px)'];
  if (resolvedCustom?.flipHorizontal) {
    transforms.push('scaleX(-1)');
  }
  if (resolvedCustom?.invert || resolvedCustom?.position === 'top') {
    transforms.push('scaleY(-1)');
  }

  // Shadow filters
  let shadowFilter = '';
  if (resolvedCustom?.shadow === 'soft') {
    shadowFilter = 'drop-shadow(0 -4px 6px rgba(0,0,0,0.10))';
  } else if (resolvedCustom?.shadow === 'medium') {
    shadowFilter = 'drop-shadow(0 -6px 12px rgba(0,0,0,0.18))';
  } else if (resolvedCustom?.shadow === 'strong') {
    shadowFilter = 'drop-shadow(0 -8px 20px rgba(0,0,0,0.28))';
  }

  const svgStyle: React.CSSProperties = {
    transform: transforms.join(' '),
    transformOrigin: 'center center',
    filter: shadowFilter || undefined,
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

  // Layers to render (multi-layer opacity shapes like Screenshot 1, 3, 4, 5)
  const layers = resolvedCustom?.layers || baseDef?.defaultLayers || [];

  return (
    <div
      ref={containerRef}
      className={`w-full overflow-hidden leading-none select-none pointer-events-none -mb-[1px] relative z-10 ${className}`}
      aria-hidden="true"
    >
      <svg
        viewBox={viewBox}
        preserveAspectRatio="none"
        className={`w-full ${resolvedCustom?.heightPx ? '' : heightClass} block`}
        style={svgStyle}
      >
        {/* Render background opacity layers (if enabled) */}
        {layers.map((layer, idx) => (
          <path
            key={idx}
            d={layer.pathData}
            fill={layer.color || (effectiveColor === 'transparent' ? '#ffffff' : effectiveColor)}
            fillOpacity={layer.opacity}
          />
        ))}

        {/* Main foreground shape */}
        {!isTransparent && (
          <path
            d={mainPath}
            fill={effectiveColor}
            fillOpacity={resolvedCustom?.opacity !== undefined ? resolvedCustom.opacity / 100 : 1}
          />
        )}
      </svg>
    </div>
  );
}
