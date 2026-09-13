import React from 'react';
import { HeaderDividerStyle, DesignSettings, HeaderDividerPageConfig } from '../types';

export interface HeaderShapeDividerProps {
  style?: HeaderDividerStyle;
  color?: string; // Fill color of the bottom section (e.g. '#FAF8F5' or '#FFFFFF')
  className?: string;
  heightClass?: string;
}

export interface DividerOption {
  id: HeaderDividerStyle;
  label: string;
  description: string;
  badge?: string;
}

export const DIVIDER_OPTIONS: DividerOption[] = [
  {
    id: 'none',
    label: 'Kein Divider (Standard)',
    description: 'Klassischer gerader horizontaler Abschluss ohne Verzierung.'
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
  heightClass = 'h-[36px] sm:h-[50px] md:h-[64px]'
}: HeaderShapeDividerProps) {
  if (!style || style === 'none') {
    return null;
  }

  const renderPath = () => {
    switch (style) {
      case 'mountains':
        // Sauerland mountains / ridges inspired by user screenshot:
        // Rolling peaks across the viewport with smooth transitions
        return (
          <path
            d="M0,92 Q140,58 290,32 Q380,48 480,24 Q570,38 680,18 Q820,38 970,24 Q1090,44 1200,34 L1200,120 L0,120 Z"
            fill={color}
          />
        );

      case 'wave-smooth':
        // Soft organic sine wave
        return (
          <path
            d="M0,55 C240,105 380,15 620,55 C860,95 1020,15 1200,50 L1200,120 L0,120 Z"
            fill={color}
          />
        );

      case 'wave-asymmetric':
        // Dynamic asymmetric high-to-low wave
        return (
          <path
            d="M0,75 C220,15 440,100 700,35 C920,-15 1080,65 1200,28 L1200,120 L0,120 Z"
            fill={color}
          />
        );

      case 'slant-right':
        // Clean modern angle sloping down to right
        return (
          <polygon
            points="0,120 1200,18 1200,120"
            fill={color}
          />
        );

      case 'slant-left':
        // Clean modern angle sloping down to left
        return (
          <polygon
            points="0,18 1200,120 0,120"
            fill={color}
          />
        );

      case 'curve':
        // Concave arch / curve
        return (
          <path
            d="M0,90 Q600,0 1200,90 L1200,120 L0,120 Z"
            fill={color}
          />
        );

      case 'peaks-gentle':
        // Gentle rolling hills
        return (
          <path
            d="M0,65 Q180,25 360,55 T720,55 T1080,55 Q1150,60 1200,50 L1200,120 L0,120 Z"
            fill={color}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div
      className={`w-full overflow-hidden leading-none select-none pointer-events-none -mb-[1px] relative z-10 ${className}`}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        className={`w-full ${heightClass} block`}
        style={{ transform: 'translateY(1px)' }}
      >
        {renderPath()}
      </svg>
    </div>
  );
}
