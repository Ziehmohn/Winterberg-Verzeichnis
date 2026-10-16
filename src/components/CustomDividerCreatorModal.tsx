import React, { useState, useEffect } from 'react';
import { X, Sparkles, Code2, Sliders, Check, Eye, HelpCircle, Layers, Droplets, SunMedium } from 'lucide-react';
import { CustomDivider, CustomDividerLayer } from '../types';
import { BASE_DIVIDER_SHAPES, parseSvgOrPath, getMaskSvgDataUri } from './HeaderShapeDivider';

interface CustomDividerCreatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (divider: CustomDivider) => void;
}

export default function CustomDividerCreatorModal({
  isOpen,
  onClose,
  onSave
}: CustomDividerCreatorModalProps) {
  // Selected base shape or custom mode
  const [selectedShapeId, setSelectedShapeId] = useState<string>('wave-flow');
  const [rawSvgInput, setRawSvgInput] = useState<string>('');
  const [detectedPath, setDetectedPath] = useState<string>(
    BASE_DIVIDER_SHAPES[0]?.pathData || ''
  );
  const [detectedViewBox, setDetectedViewBox] = useState<string>('0 0 1200 120');

  // Parameters matching the user's reference screenshots
  const [name, setName] = useState<string>('Eigener Wellen-Divider');
  const [color, setColor] = useState<string>('transparent'); // Default to transparent for true transparency!
  const [isMask, setIsMask] = useState<boolean>(true); // True transparency via CSS mask
  const [enableLayered, setEnableLayered] = useState<boolean>(true); // Multi-layer shapes (Screenshots 1, 3, 4, 5)
  const [shadow, setShadow] = useState<'none' | 'soft' | 'medium' | 'strong'>('soft'); // Realistic shadow (Screenshot 2)
  const [opacity, setOpacity] = useState<number>(100);
  const [flipHorizontal, setFlipHorizontal] = useState<boolean>(false);
  const [invert, setInvert] = useState<boolean>(false);
  const [position, setPosition] = useState<'bottom' | 'top'>('bottom');
  const [heightPx, setHeightPx] = useState<number>(64);
  const [widthPercent, setWidthPercent] = useState<number>(100);

  // Tab: visual generator vs code import
  const [activeTab, setActiveTab] = useState<'generator' | 'gallery' | 'code'>('generator');
  const [parseError, setParseError] = useState<string | null>(null);
  const [previewBgType, setPreviewBgType] = useState<'image' | 'checkerboard' | 'solid'>('image');

  // Current base shape object
  const currentBaseShape = BASE_DIVIDER_SHAPES.find(s => s.id === selectedShapeId);

  // When selectedShapeId changes (if not custom), update detectedPath and default layers
  useEffect(() => {
    if (selectedShapeId !== 'custom') {
      const found = BASE_DIVIDER_SHAPES.find(s => s.id === selectedShapeId);
      if (found) {
        setDetectedPath(found.pathData);
        setDetectedViewBox(found.viewBox);
        setParseError(null);
        if (found.defaultLayers && found.defaultLayers.length > 0) {
          setEnableLayered(true);
        }
      }
    }
  }, [selectedShapeId]);

  // Handle raw code input changes
  const handleRawCodeChange = (text: string) => {
    setRawSvgInput(text);
    if (!text.trim()) {
      setParseError(null);
      return;
    }

    const parsed = parseSvgOrPath(text);
    if (parsed) {
      setDetectedPath(parsed.pathData);
      if (parsed.viewBox) {
        setDetectedViewBox(parsed.viewBox);
      }
      setSelectedShapeId('custom');
      setParseError(null);
    } else {
      setParseError('Konnte keinen gültigen SVG-Pfad (d="...") erkennen. Bitte Code prüfen.');
    }
  };

  const handleSaveDivider = () => {
    if (!detectedPath.trim()) {
      alert('Bitte wählen Sie eine Form oder fügen Sie einen gültigen SVG-Pfad ein.');
      return;
    }

    // Determine layers to save
    let layersToSave: CustomDividerLayer[] | undefined = undefined;
    if (enableLayered) {
      if (currentBaseShape?.defaultLayers && currentBaseShape.defaultLayers.length > 0) {
        layersToSave = currentBaseShape.defaultLayers;
      } else {
        // Fallback secondary wave layer for single-layer shapes
        layersToSave = [
          {
            pathData: 'M0,120 L0,50 C240,95 480,20 720,60 C960,100 1080,45 1200,65 L1200,120 Z',
            opacity: 0.35
          }
        ];
      }
    }

    const newDivider: CustomDivider = {
      id: `custom-${Date.now()}`,
      name: name.trim() || 'Eigener Divider',
      description: `Individuell erstellt (${isMask || color === 'transparent' ? 'Echte Transparenz' : color}${enableLayered ? ', Mehrstufig' : ''}${shadow !== 'none' ? ', Schatten' : ''})`,
      badge: isMask || color === 'transparent' ? 'Transparent' : 'Eigen',
      pathData: detectedPath.trim(),
      viewBox: detectedViewBox || '0 0 1200 120',
      color: isMask ? 'transparent' : color,
      opacity,
      isMask: isMask || color === 'transparent',
      shadow,
      layers: layersToSave,
      flipHorizontal,
      invert,
      position,
      heightPx,
      widthPercent,
      createdAt: Date.now()
    };

    onSave(newDivider);
    onClose();
  };

  // Build SVG live preview transforms
  const transforms: string[] = ['translateY(1px)'];
  if (flipHorizontal) {
    transforms.push('scaleX(-1)');
  }
  if (invert || position === 'top') {
    transforms.push('scaleY(-1)');
  }

  // Shadow filter string
  let shadowFilter = '';
  if (shadow === 'soft') {
    shadowFilter = 'drop-shadow(0 -4px 6px rgba(0,0,0,0.12))';
  } else if (shadow === 'medium') {
    shadowFilter = 'drop-shadow(0 -6px 12px rgba(0,0,0,0.20))';
  } else if (shadow === 'strong') {
    shadowFilter = 'drop-shadow(0 -8px 20px rgba(0,0,0,0.30))';
  }

  const svgPreviewStyle: React.CSSProperties = {
    transform: transforms.join(' '),
    transformOrigin: 'center center',
    height: `${heightPx}px`,
    filter: shadowFilter || undefined
  };

  if (widthPercent > 100) {
    svgPreviewStyle.width = `${widthPercent}%`;
    svgPreviewStyle.minWidth = '100%';
    svgPreviewStyle.position = 'relative';
    svgPreviewStyle.left = '50%';
    transforms.unshift('translateX(-50%)');
    svgPreviewStyle.transform = transforms.join(' ');
  }

  // Layers for preview
  const previewLayers = enableLayered 
    ? (currentBaseShape?.defaultLayers || [{ pathData: 'M0,120 L0,50 C240,95 480,20 720,60 C960,100 1080,45 1200,65 L1200,120 Z', opacity: 0.35 }]) 
    : [];

  const isTransparentActive = isMask || color === 'transparent';

  // Live CSS mask style for preview container when true transparency is active
  const maskDataUri = isTransparentActive ? getMaskSvgDataUri(detectedPath, detectedViewBox) : '';
  const previewHeaderMaskStyle: React.CSSProperties = isTransparentActive ? {
    WebkitMaskImage: `${maskDataUri}, linear-gradient(to bottom, #000 0%, #000 calc(100% - ${heightPx}px), transparent calc(100% - ${heightPx}px))`,
    maskImage: `${maskDataUri}, linear-gradient(to bottom, #000 0%, #000 calc(100% - ${heightPx}px), transparent calc(100% - ${heightPx}px))`,
    WebkitMaskPosition: 'bottom, top',
    maskPosition: 'bottom, top',
    WebkitMaskSize: `100% ${heightPx}px, 100% 100%`,
    maskSize: `100% ${heightPx}px, 100% 100%`,
    WebkitMaskRepeat: 'no-repeat',
    maskRepeat: 'no-repeat',
  } : {};

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[99999] bg-black/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div 
        className="bg-white border border-[#EDE8E0] rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden my-auto flex flex-col max-h-[94vh] animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#EDE8E0] bg-[#FAF8F5] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#E8F1EB] flex items-center justify-center text-[#0F4C2E]">
              <Sparkles className="w-4 h-4 text-[#F2761B]" />
            </div>
            <div>
              <h3 className="font-display text-base font-bold text-[#1B211D] m-0 leading-tight">
                Divider Studio &amp; Generator
              </h3>
              <p className="text-xs text-[#5F6B63] m-0">
                Echte Transparenz (Mask-Cutout), Multi-Layer Ebenen, realistische Schatten und 18 Formen
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 p-1.5 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
            title="Schließen"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Scrollable */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">

          {/* Mode Switch Tabs */}
          <div className="flex border-b border-gray-200 gap-6">
            <button
              type="button"
              onClick={() => setActiveTab('generator')}
              className={`pb-2.5 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'generator'
                  ? 'border-[#0F4C2E] text-[#0F4C2E]'
                  : 'border-transparent text-[#5F6B63] hover:text-[#1B211D]'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              1. Visuelle Einstellungen &amp; Parameter
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('gallery')}
              className={`pb-2.5 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'gallery'
                  ? 'border-[#0F4C2E] text-[#0F4C2E]'
                  : 'border-transparent text-[#5F6B63] hover:text-[#1B211D]'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              2. Formen-Katalog ({BASE_DIVIDER_SHAPES.length} Stile aus Vorlage)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('code')}
              className={`pb-2.5 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'code'
                  ? 'border-[#0F4C2E] text-[#0F4C2E]'
                  : 'border-transparent text-[#5F6B63] hover:text-[#1B211D]'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              3. SVG-Code importieren
            </button>
          </div>

          {/* Tab 1: Visual Generator Control Bar */}
          {activeTab === 'generator' && (
            <div className="bg-[#FAF8F5] border border-[#E7E2DA] rounded-xl p-5 shadow-xs space-y-5">
              
              {/* Divider Name & Quick Transparency Toggle */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                <div>
                  <label className="block text-xs font-bold text-[#1B211D] mb-1">
                    Name des Dividers:
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="z. B. Meine Welle, Sommer-Kamm, etc."
                    className="w-full bg-white border border-[#D5D0C5] rounded-md px-3 py-2 text-xs font-semibold text-[#1B211D] focus:outline-none focus:border-[#0F4C2E]"
                  />
                </div>

                {/* ECHTE TRANSPARENZ TOGGLE (Key user request!) */}
                <div className="bg-white border border-[#CDE1D4] rounded-lg p-3 flex items-center justify-between shadow-2xs">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <Droplets className="w-4 h-4 text-[#0F4C2E]" />
                      <span className="font-bold text-xs text-[#1B211D]">Echte Transparenz (Maske)</span>
                    </div>
                    <span className="text-[11px] text-[#5F6B63] block">
                      Bild wird exakt an der Kante abgeschnitten — keine Farb-Balken!
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const next = !isMask;
                      setIsMask(next);
                      if (next) setColor('transparent');
                      else setColor('#FAF8F5');
                    }}
                    className={`relative w-16 h-8 rounded-full transition-colors p-1 flex items-center cursor-pointer shadow-inner shrink-0 ${
                      isMask ? 'bg-[#0F4C2E]' : 'bg-[#E7E2DA]'
                    }`}
                  >
                    <span
                      className={`w-6 h-6 rounded-full bg-white shadow-md transform transition-transform flex items-center justify-center text-[10px] font-bold ${
                        isMask ? 'translate-x-8 text-[#0F4C2E]' : 'translate-x-0 text-gray-400'
                      }`}
                    >
                      {isMask ? 'Ja' : 'Nein'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Parameter Controls Grid (Shape, Colour, Flip, Invert, Top/bottom) */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 items-start pt-2 border-t border-black/5">
                
                {/* 1. Shape Selector */}
                <div>
                  <label className="block font-display font-bold text-xs text-[#1B211D] mb-0.5">
                    Shape
                  </label>
                  <span className="block text-[11px] text-[#5F6B63] mb-2">Form wählen</span>
                  <select
                    value={selectedShapeId}
                    onChange={(e) => setSelectedShapeId(e.target.value)}
                    className="w-full bg-white border border-[#D5D0C5] rounded-lg px-2.5 py-2 text-xs font-semibold text-[#1B211D] focus:outline-none focus:border-[#0F4C2E] shadow-2xs"
                  >
                    {BASE_DIVIDER_SHAPES.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                    {selectedShapeId === 'custom' && (
                      <option value="custom">Individueller Import</option>
                    )}
                  </select>
                </div>

                {/* 2. Colour & Transparenz */}
                <div>
                  <label className="block font-display font-bold text-xs text-[#1B211D] mb-0.5">
                    Colour
                  </label>
                  <span className="block text-[11px] text-[#5F6B63] mb-2">Farbe &amp; Füllung</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        setColor('transparent');
                        setIsMask(true);
                      }}
                      className={`text-[10px] px-2 py-1 rounded border transition-colors cursor-pointer font-semibold flex items-center gap-1 ${
                        isTransparentActive 
                          ? 'bg-[#0F4C2E] text-white border-[#0F4C2E]' 
                          : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                      }`}
                      title="100% Transparent — kein Farbbalken"
                    >
                      <span>🏁 Transparent</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setColor('#FAF8F5');
                        setIsMask(false);
                      }}
                      className={`text-[10px] px-2 py-1 rounded border transition-colors cursor-pointer font-semibold ${
                        !isTransparentActive && color.toUpperCase() === '#FAF8F5' 
                          ? 'bg-[#0F4C2E] text-white border-[#0F4C2E]' 
                          : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      #FAF8F5
                    </button>
                  </div>
                  {!isTransparentActive && (
                    <div className="flex items-center gap-2 mt-2">
                      <input
                        type="color"
                        value={color.startsWith('#') ? color : '#FAF8F5'}
                        onChange={(e) => {
                          setColor(e.target.value);
                          setIsMask(false);
                        }}
                        className="w-5 h-5 rounded-full border border-gray-300 cursor-pointer p-0 mr-1 bg-transparent"
                      />
                      <input
                        type="text"
                        value={color}
                        onChange={(e) => {
                          setColor(e.target.value);
                          setIsMask(false);
                        }}
                        className="text-xs font-mono font-semibold text-[#1B211D] w-full outline-none bg-white border border-gray-200 rounded px-1.5 py-0.5"
                      />
                    </div>
                  )}
                </div>

                {/* 3. Flip */}
                <div>
                  <label className="block font-display font-bold text-xs text-[#1B211D] mb-0.5">
                    Flip
                  </label>
                  <span className="block text-[11px] text-[#5F6B63] mb-2">Horizontal spiegeln</span>
                  <button
                    type="button"
                    onClick={() => setFlipHorizontal(!flipHorizontal)}
                    className={`relative w-20 h-8 rounded-full transition-colors p-1 flex items-center cursor-pointer shadow-inner ${
                      flipHorizontal ? 'bg-[#F2761B]' : 'bg-[#E7E2DA]'
                    }`}
                  >
                    <span
                      className={`w-6 h-6 rounded-full bg-white shadow-md transform transition-transform flex items-center justify-center text-[10px] font-bold ${
                        flipHorizontal ? 'translate-x-12 text-[#F2761B]' : 'translate-x-0 text-gray-400'
                      }`}
                    >
                      {flipHorizontal ? 'Ja' : 'No'}
                    </span>
                  </button>
                </div>

                {/* 4. Invert */}
                <div>
                  <label className="block font-display font-bold text-xs text-[#1B211D] mb-0.5">
                    Invert
                  </label>
                  <span className="block text-[11px] text-[#5F6B63] mb-2">Invertieren</span>
                  <button
                    type="button"
                    onClick={() => setInvert(!invert)}
                    className={`relative w-20 h-8 rounded-full transition-colors p-1 flex items-center cursor-pointer shadow-inner ${
                      invert ? 'bg-[#F2761B]' : 'bg-[#E7E2DA]'
                    }`}
                  >
                    <span
                      className={`w-6 h-6 rounded-full bg-white shadow-md transform transition-transform flex items-center justify-center text-[10px] font-bold ${
                        invert ? 'translate-x-12 text-[#F2761B]' : 'translate-x-0 text-gray-400'
                      }`}
                    >
                      {invert ? 'Ja' : 'No'}
                    </span>
                  </button>
                </div>

                {/* 5. Top / bottom */}
                <div>
                  <label className="block font-display font-bold text-xs text-[#1B211D] mb-0.5">
                    Top/bottom
                  </label>
                  <span className="block text-[11px] text-[#5F6B63] mb-2">Ausrichtung</span>
                  <button
                    type="button"
                    onClick={() => setPosition(position === 'bottom' ? 'top' : 'bottom')}
                    className={`relative w-24 h-8 rounded-full transition-colors p-1 flex items-center cursor-pointer shadow-inner ${
                      position === 'top' ? 'bg-[#F2761B]' : 'bg-[#0F4C2E]'
                    }`}
                  >
                    <span
                      className={`w-14 h-6 rounded-full bg-white shadow-md transform transition-transform flex items-center justify-center text-[10px] font-bold ${
                        position === 'top' ? 'translate-x-8 text-[#F2761B]' : 'translate-x-0 text-[#0F4C2E]'
                      }`}
                    >
                      {position === 'top' ? 'Top' : 'Bottom'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Advanced Gestaltungen (Multi-Layer & Realistic Shadows from Screenshots 1, 2, 3, 4) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-black/5 bg-white/70 p-3 rounded-lg border border-[#EDE8E0]">
                {/* Multi-Layer (Screenshots 1, 3, 5) */}
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-1.5 font-bold text-xs text-[#1B211D]">
                      <Layers className="w-3.5 h-3.5 text-[#F2761B]" />
                      <span>Mehrstufige Ebenen (Layered Tiefen-Effekt)</span>
                    </div>
                    <span className="text-[11px] text-[#5F6B63] block">
                      Zweite geschwungene Hintergrund-Ebene mit Transparenz
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEnableLayered(!enableLayered)}
                    className={`relative w-14 h-7 rounded-full transition-colors p-0.5 flex items-center cursor-pointer shadow-inner shrink-0 ${
                      enableLayered ? 'bg-[#0F4C2E]' : 'bg-[#E7E2DA]'
                    }`}
                  >
                    <span
                      className={`w-6 h-6 rounded-full bg-white shadow-md transform transition-transform flex items-center justify-center text-[10px] font-bold ${
                        enableLayered ? 'translate-x-7 text-[#0F4C2E]' : 'translate-x-0 text-gray-400'
                      }`}
                    >
                      {enableLayered ? 'Ja' : 'No'}
                    </span>
                  </button>
                </div>

                {/* Realistic Shadows (Screenshot 2) */}
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-1.5 font-bold text-xs text-[#1B211D]">
                      <SunMedium className="w-3.5 h-3.5 text-[#0F4C2E]" />
                      <span>Realistischer Schattenwurf</span>
                    </div>
                    <span className="text-[11px] text-[#5F6B63] block">
                      Weicher Drop-Shadow entlang der Kanten-Kontur
                    </span>
                  </div>
                  <select
                    value={shadow}
                    onChange={(e) => setShadow(e.target.value as any)}
                    className="bg-white border border-[#D5D0C5] rounded-md px-2 py-1 text-xs font-semibold text-[#1B211D] focus:outline-none focus:border-[#0F4C2E]"
                  >
                    <option value="none">Kein Schatten</option>
                    <option value="soft">Zart (Soft)</option>
                    <option value="medium">Mittel</option>
                    <option value="strong">Prägnant</option>
                  </select>
                </div>
              </div>

              {/* Sliders Grid: Height & Width */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-3 border-t border-black/5">
                {/* Height */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="font-display font-bold text-xs text-[#1B211D]">
                      Height: <span className="text-[#F2761B]">{heightPx}px</span>
                    </label>
                    <span className="text-[11px] text-[#5F6B63]">20px - 250px</span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="220"
                    step="2"
                    value={heightPx}
                    onChange={(e) => setHeightPx(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#F2761B]"
                  />
                  <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                    <span>Flach (35px)</span>
                    <span>Standard (64px)</span>
                    <span>Hoch (120px)</span>
                  </div>
                </div>

                {/* Width */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="font-display font-bold text-xs text-[#1B211D]">
                      Width: <span className="text-[#F2761B]">{widthPercent}%</span>
                    </label>
                    <span className="text-[11px] text-[#5F6B63]">100% - 300%</span>
                  </div>
                  <input
                    type="range"
                    min="100"
                    max="300"
                    step="5"
                    value={widthPercent}
                    onChange={(e) => setWidthPercent(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#F2761B]"
                  />
                  <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                    <span>100% (Passend)</span>
                    <span>200% (Gestreckt)</span>
                    <span>300% (Weit)</span>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* Tab 2: Visual Shape Gallery (Screenshot 5) */}
          {activeTab === 'gallery' && (
            <div className="space-y-4">
              <div className="text-xs text-[#5F6B63]">
                Klicken Sie auf eine Form, um sie direkt zu übernehmen und im Konfigurator zu verfeinern:
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 max-h-[360px] overflow-y-auto p-1">
                {BASE_DIVIDER_SHAPES.map((shape) => {
                  const isSelected = selectedShapeId === shape.id;
                  return (
                    <div
                      key={shape.id}
                      onClick={() => {
                        setSelectedShapeId(shape.id);
                        setActiveTab('generator');
                      }}
                      className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                        isSelected
                          ? 'border-[#0F4C2E] ring-2 ring-[#0F4C2E]/20 bg-[#E8F1EB]'
                          : 'border-[#EDE8E0] hover:border-[#0F4C2E]/40 hover:bg-[#FAF8F5]'
                      }`}
                    >
                      {/* Mini Preview Box */}
                      <div className="w-full h-14 bg-gradient-to-br from-[#0F4C2E] to-[#06301C] rounded-lg overflow-hidden flex flex-col justify-end relative shadow-inner mb-2">
                        {/* Secondary Layer if available */}
                        <svg viewBox={shape.viewBox} preserveAspectRatio="none" className="w-full h-8 block">
                          {shape.defaultLayers?.map((l, i) => (
                            <path key={i} d={l.pathData} fill="#ffffff" fillOpacity={l.opacity} />
                          ))}
                          <path d={shape.pathData} fill="#FAF8F5" />
                        </svg>
                      </div>
                      <div className="font-bold text-[11px] text-[#1B211D] truncate">
                        {shape.name}
                      </div>
                      <div className="text-[10px] text-[#5F6B63]">
                        Kategorie: {shape.category}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tab 3: Code Import Mode */}
          {activeTab === 'code' && (
            <div className="bg-[#FAF8F5] border border-[#E7E2DA] rounded-xl p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#1B211D] mb-1">
                  SVG-Code oder ShapeDivider.app HTML/SVG hier einfügen:
                </label>
                <textarea
                  rows={6}
                  value={rawSvgInput}
                  onChange={(e) => handleRawCodeChange(e.target.value)}
                  placeholder={`<div class="custom-shape-divider-bottom-...">\n  <svg viewBox="0 0 1200 120">\n    <path d="M985.66,92.83C...Z"></path>\n  </svg>\n</div>`}
                  className="w-full bg-white border border-[#D5D0C5] rounded-md p-3 text-xs font-mono text-gray-800 focus:outline-none focus:border-[#0F4C2E]"
                />
              </div>

              {parseError && (
                <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-md text-xs font-medium">
                  {parseError}
                </div>
              )}

              {detectedPath && !parseError && (
                <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-md text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>SVG-Pfad erfolgreich erkannt und geladen!</span>
                  </div>
                  <span className="font-mono text-[11px] text-emerald-700">
                    viewBox: {detectedViewBox}
                  </span>
                </div>
              )}

              <div className="text-xs text-[#5F6B63] leading-relaxed">
                <strong>Tipp:</strong> Sie können direkt den exportierten Code von{' '}
                <a 
                  href="https://www.shapedivider.app/" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="text-[#0F4C2E] underline font-semibold"
                >
                  shapedivider.app
                </a>{' '}
                oder aus Figma hineinkopieren. Das System extrahiert Pfad und viewBox vollautomatisch.
              </div>
            </div>
          )}

          {/* Live Preview Section with Transparency & Checkerboard Verification */}
          <div className="border border-[#EDE8E0] rounded-xl overflow-hidden shadow-md">
            {/* Header Mockup Bar */}
            <div className="bg-[#FAF8F5] px-4 py-2.5 border-b border-[#EDE8E0] flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-[#0F4C2E]" />
                <span className="font-display font-bold text-xs text-[#1B211D]">
                  Live-Echtzeit-Vorschau ({isTransparentActive ? 'Echte Transparenz aktiv' : `Farbe: ${color}`})
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-[#5F6B63]">Hintergrund:</span>
                <button
                  type="button"
                  onClick={() => setPreviewBgType('image')}
                  className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                    previewBgType === 'image' ? 'bg-[#0F4C2E] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Header-Foto
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewBgType('checkerboard')}
                  className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors cursor-pointer flex items-center gap-1 ${
                    previewBgType === 'checkerboard' ? 'bg-[#0F4C2E] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  title="Schachbrettmuster wie in Screenshot 4"
                >
                  <span>🏁 Schachbrett</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewBgType('solid')}
                  className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                    previewBgType === 'solid' ? 'bg-[#0F4C2E] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Grün
                </button>
              </div>
            </div>

            {/* Checkerboard outer background container (proves transparency!) */}
            <div 
              className="p-4 transition-colors"
              style={{
                backgroundImage: previewBgType === 'checkerboard'
                  ? 'linear-gradient(45deg, #e5e7eb 25%, transparent 25%), linear-gradient(-45deg, #e5e7eb 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e5e7eb 75%), linear-gradient(-45deg, transparent 75%, #e5e7eb 75%)'
                  : 'none',
                backgroundSize: '16px 16px',
                backgroundPosition: '0 0, 0 8px, 8px -8px, -8px 0px',
                backgroundColor: previewBgType === 'checkerboard' ? '#f3f4f6' : '#FAF8F5'
              }}
            >
              {/* The Header Box being masked */}
              <div
                className="relative text-white overflow-hidden transition-all duration-300 rounded-t-xl"
                style={{
                  ...previewHeaderMaskStyle,
                  background: previewBgType === 'solid'
                    ? 'linear-gradient(135deg, #0F4C2E 0%, #06301C 100%)'
                    : 'linear-gradient(105deg, rgba(6,48,28,0.92) 0%, rgba(15,76,46,0.85) 55%, rgba(15,76,46,0.55) 100%), url(/winterberg-header.webp) center/cover no-repeat'
                }}
              >
                <div className="px-6 pt-8 pb-4 text-center">
                  <span className="inline-block bg-white/15 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full mb-2">
                    Winterberg Header Bereich
                  </span>
                  <h4 className="font-display text-xl font-bold m-0 text-white">
                    {name || 'Ihr neuer Divider'}
                  </h4>
                  <p className="text-xs text-white/80 max-w-md mx-auto mt-1 mb-2">
                    {isTransparentActive 
                      ? 'Der Bereich unterhalb der Welle ist 100% transparent abgeschnitten. Keine Kanten, kein Kantenbruch!'
                      : `Die Welle schließt bündig mit der gewählten Farbe (${color}) ab.`}
                  </p>
                </div>

                {/* The Live Divider itself (renders layered waves + shadow) */}
                <div className="w-full overflow-hidden leading-none select-none pointer-events-none -mb-[1px] relative z-10">
                  <svg
                    viewBox={detectedViewBox}
                    preserveAspectRatio="none"
                    className="w-full block"
                    style={svgPreviewStyle}
                  >
                    {/* Render preview background layers */}
                    {previewLayers.map((l, i) => (
                      <path
                        key={i}
                        d={l.pathData}
                        fill={isTransparentActive ? '#ffffff' : color}
                        fillOpacity={l.opacity}
                      />
                    ))}

                    {/* Main path (if not transparent) */}
                    {!isTransparentActive && (
                      <path
                        d={detectedPath}
                        fill={color}
                        fillOpacity={opacity / 100}
                      />
                    )}
                  </svg>
                </div>
              </div>

              {/* Lower Section in preview */}
              <div 
                className="p-4 text-center rounded-b-xl border-t border-black/5 transition-colors"
                style={{
                  backgroundColor: isTransparentActive ? 'transparent' : color
                }}
              >
                <div className="text-xs font-semibold text-[#1B211D]">
                  {isTransparentActive 
                    ? '✨ Echte Transparenz: Seitenhintergrund scheint natürlich durch' 
                    : `Seiteninhalt (Farbe: ${color})`}
                </div>
                <p className="text-[11px] text-[#5F6B63] m-0 mt-0.5">
                  Vollkommen fließender Übergang ohne Kantenbruch.
                </p>
              </div>
            </div>

          </div>

          {/* Transparency Explanation Alert */}
          <div className="bg-[#E8F1EB] border border-[#CDE1D4] rounded-lg p-3.5 flex items-start gap-3">
            <HelpCircle className="w-4 h-4 text-[#0F4C2E] shrink-0 mt-0.5" />
            <div className="text-xs text-[#0F4C2E] leading-relaxed">
              <strong>Echte Transparenz (Maske):</strong> Wenn „Echte Transparenz“ aktiv ist, wird das Header-Bild selbst per CSS-Maske (Andrew Walpole Technik) entlang der Welle physisch zugeschnitten. Es wird keine künstliche Hintergrundfarbe aufgetragen, wodurch die störende Kante vollständig verschwindet.
            </div>
          </div>

        </div>

        {/* Modal Footer with Actions */}
        <div className="px-6 py-4 border-t border-[#EDE8E0] bg-[#FAF8F5] flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-gray-700 hover:text-black hover:bg-gray-200/60 rounded-lg transition-colors cursor-pointer"
          >
            Abbrechen
          </button>

          <button
            type="button"
            onClick={handleSaveDivider}
            className="bg-[#0F4C2E] hover:bg-[#06301C] text-white px-5 py-2.5 rounded-lg text-xs font-bold transition-all inline-flex items-center gap-2 cursor-pointer shadow-md hover:shadow-lg"
          >
            <Check className="w-4 h-4 text-emerald-400" />
            <span>Divider anlegen &amp; im Backend speichern</span>
          </button>
        </div>

      </div>
    </div>
  );
}
