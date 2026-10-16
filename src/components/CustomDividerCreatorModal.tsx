import React, { useState, useEffect } from 'react';
import { X, Sparkles, Code2, Sliders, Check, Eye, HelpCircle } from 'lucide-react';
import { CustomDivider } from '../types';
import { BASE_DIVIDER_SHAPES, parseSvgOrPath } from './HeaderShapeDivider';

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
  if (!isOpen) return null;

  // Selected base shape or custom mode
  const [selectedShapeId, setSelectedShapeId] = useState<string>('wave-flow');
  const [rawSvgInput, setRawSvgInput] = useState<string>('');
  const [detectedPath, setDetectedPath] = useState<string>(
    BASE_DIVIDER_SHAPES[0]?.pathData || ''
  );
  const [detectedViewBox, setDetectedViewBox] = useState<string>('0 0 1200 120');

  // Parameters matching the user's screenshot
  const [name, setName] = useState<string>('Eigener Wellen-Divider');
  const [color, setColor] = useState<string>('#FAF8F5');
  const [flipHorizontal, setFlipHorizontal] = useState<boolean>(false);
  const [invert, setInvert] = useState<boolean>(false);
  const [position, setPosition] = useState<'bottom' | 'top'>('bottom');
  const [heightPx, setHeightPx] = useState<number>(64);
  const [widthPercent, setWidthPercent] = useState<number>(100);

  // Tab: visual generator vs code import
  const [activeTab, setActiveTab] = useState<'generator' | 'code'>('generator');
  const [parseError, setParseError] = useState<string | null>(null);
  const [previewBgType, setPreviewBgType] = useState<'image' | 'solid'>('image');

  // When selectedShapeId changes (if not custom), update detectedPath
  useEffect(() => {
    if (selectedShapeId !== 'custom') {
      const found = BASE_DIVIDER_SHAPES.find(s => s.id === selectedShapeId);
      if (found) {
        setDetectedPath(found.pathData);
        setDetectedViewBox(found.viewBox);
        setParseError(null);
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

    const newDivider: CustomDivider = {
      id: `custom-${Date.now()}`,
      name: name.trim() || 'Eigener Divider',
      description: `Individuell erstellt (${selectedShapeId === 'custom' ? 'Code-Import' : 'Vorlage ' + selectedShapeId})`,
      badge: 'Eigen',
      pathData: detectedPath.trim(),
      viewBox: detectedViewBox || '0 0 1200 120',
      color: color || '#FAF8F5',
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

  const svgPreviewStyle: React.CSSProperties = {
    transform: transforms.join(' '),
    transformOrigin: 'center center',
    height: `${heightPx}px`
  };

  if (widthPercent > 100) {
    svgPreviewStyle.width = `${widthPercent}%`;
    svgPreviewStyle.minWidth = '100%';
    svgPreviewStyle.position = 'relative';
    svgPreviewStyle.left = '50%';
    transforms.unshift('translateX(-50%)');
    svgPreviewStyle.transform = transforms.join(' ');
  }

  return (
    <div className="fixed inset-0 z-[99999] bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div 
        className="bg-white border border-[#EDE8E0] rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden my-auto flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200"
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
                Divider Generator &amp; Creator
              </h3>
              <p className="text-xs text-[#5F6B63] m-0">
                Eigenen Divider gestalten, Parameter anpassen oder SVG-Code aus ShapeDivider.app einfügen
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
        <div className="p-6 overflow-y-auto space-y-6 flex-1">

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
              1. Visueller Konfigurator (Form, Flip, Invert, Maße)
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
              2. SVG-Code direkt importieren (ShapeDivider.app)
            </button>
          </div>

          {/* Tab 1: Visual Generator Control Bar (Styled exactly like the User's Screenshot) */}
          {activeTab === 'generator' && (
            <div className="bg-[#FAF8F5] border border-[#E7E2DA] rounded-xl p-5 shadow-xs space-y-5">
              
              {/* Divider Name Input */}
              <div className="max-w-md">
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

              {/* Parameter Controls Grid (Shape, Colour, Flip, Invert, Top/bottom) */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 items-start pt-2 border-t border-black/5">
                
                {/* 1. Shape */}
                <div>
                  <label className="block font-display font-bold text-xs text-[#1B211D] mb-0.5">
                    Shape
                  </label>
                  <span className="block text-[11px] text-[#5F6B63] mb-2">Select your style</span>
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

                {/* 2. Colour */}
                <div>
                  <label className="block font-display font-bold text-xs text-[#1B211D] mb-0.5">
                    Colour
                  </label>
                  <span className="block text-[11px] text-[#5F6B63] mb-2">Pick any colour</span>
                  <div className="flex items-center gap-2">
                    <div className="relative flex items-center bg-white border border-[#D5D0C5] rounded-lg px-2.5 py-1.5 shadow-2xs w-full">
                      <input
                        type="color"
                        value={color.startsWith('#') ? color : '#FAF8F5'}
                        onChange={(e) => setColor(e.target.value)}
                        className="w-5 h-5 rounded-full border border-gray-300 cursor-pointer p-0 mr-2 bg-transparent"
                        title="Farbe wählen"
                      />
                      <input
                        type="text"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        className="text-xs font-mono font-semibold text-[#1B211D] w-full outline-none bg-transparent"
                        placeholder="#FAF8F5"
                      />
                    </div>
                  </div>
                  <div className="flex gap-1.5 mt-1.5">
                    <button
                      type="button"
                      onClick={() => setColor('#FAF8F5')}
                      className={`text-[10px] px-2 py-0.5 rounded border transition-colors cursor-pointer ${
                        color.toUpperCase() === '#FAF8F5' 
                          ? 'bg-[#0F4C2E] text-white border-[#0F4C2E] font-bold' 
                          : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      #FAF8F5 (Layout)
                    </button>
                    <button
                      type="button"
                      onClick={() => setColor('#FFFFFF')}
                      className={`text-[10px] px-2 py-0.5 rounded border transition-colors cursor-pointer ${
                        color.toUpperCase() === '#FFFFFF' 
                          ? 'bg-[#0F4C2E] text-white border-[#0F4C2E] font-bold' 
                          : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      #FFFFFF
                    </button>
                  </div>
                </div>

                {/* 3. Flip */}
                <div>
                  <label className="block font-display font-bold text-xs text-[#1B211D] mb-0.5">
                    Flip
                  </label>
                  <span className="block text-[11px] text-[#5F6B63] mb-2">Flip Horizontally</span>
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

              {/* Sliders Grid: Height & Width */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-3 border-t border-black/5">
                {/* Height */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="font-display font-bold text-xs text-[#1B211D]">
                      Height: <span className="text-[#F2761B]">{heightPx}px</span>
                    </label>
                    <span className="text-[11px] text-[#5F6B63]">0px - 250px</span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="200"
                    step="2"
                    value={heightPx}
                    onChange={(e) => setHeightPx(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#F2761B]"
                  />
                  <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                    <span>Flach (30px)</span>
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
                    <span>300% (Ultra-Weit)</span>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* Tab 2: Code Import Mode */}
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
                <strong>Tipp:</strong> Sie können direkt den exportierten HTML- oder SVG-Code von{' '}
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

          {/* Live Preview Section with Transparency Verification */}
          <div className="border border-[#EDE8E0] rounded-xl overflow-hidden shadow-md">
            {/* Header Mockup */}
            <div className="bg-[#FAF8F5] px-4 py-2.5 border-b border-[#EDE8E0] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-[#0F4C2E]" />
                <span className="font-display font-bold text-xs text-[#1B211D]">
                  Live-Echtzeit-Vorschau (Transparenz-Prüfung)
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-[#5F6B63]">Hintergrund:</span>
                <button
                  type="button"
                  onClick={() => setPreviewBgType('image')}
                  className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                    previewBgType === 'image' ? 'bg-[#0F4C2E] text-white' : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  Header-Bild
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewBgType('solid')}
                  className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                    previewBgType === 'solid' ? 'bg-[#0F4C2E] text-white' : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  Grün
                </button>
              </div>
            </div>

            {/* The Header Box */}
            <div
              className="relative text-white overflow-hidden transition-all duration-300"
              style={{
                background: previewBgType === 'image'
                  ? 'linear-gradient(105deg, rgba(6,48,28,0.92) 0%, rgba(15,76,46,0.85) 55%, rgba(15,76,46,0.55) 100%), url(/winterberg-header.webp) center/cover no-repeat'
                  : 'linear-gradient(135deg, #0F4C2E 0%, #06301C 100%)'
              }}
            >
              <div className="px-6 pt-8 pb-4 text-center">
                <span className="inline-block bg-white/15 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full mb-2">
                  Winterberg Header Bereich
                </span>
                <h4 className="font-display text-xl font-bold m-0 text-white">
                  {name || 'Ihr neuer Divider'}
                </h4>
                <p className="text-xs text-white/80 max-w-md mx-auto mt-1 mb-3">
                  Der obere Bereich oberhalb der Schnittkante ist <strong>100% transparent</strong> — das Headerbild dahinter ist vollständig sichtbar.
                </p>
              </div>

              {/* The Live Divider itself */}
              <div className="w-full overflow-hidden leading-none select-none pointer-events-none -mb-[1px] relative z-10">
                <svg
                  viewBox={detectedViewBox}
                  preserveAspectRatio="none"
                  className="w-full block"
                  style={svgPreviewStyle}
                >
                  <path
                    d={detectedPath}
                    fill={color}
                  />
                </svg>
              </div>
            </div>

            {/* Light Content Area directly below the divider */}
            <div 
              className="p-5 text-center transition-colors border-t border-black/5"
              style={{ backgroundColor: color }}
            >
              <div className="text-xs font-semibold text-[#1B211D]">
                Seiteninhalt (Farbe: <span className="font-mono">{color}</span>)
              </div>
              <p className="text-[11px] text-[#5F6B63] m-0 mt-0.5">
                Fließender Übergang vom Header in den Inhalt ohne Kantenbruch.
              </p>
            </div>
          </div>

          {/* Transparency Info Box */}
          <div className="bg-[#E8F1EB] border border-[#CDE1D4] rounded-lg p-3.5 flex items-start gap-3">
            <HelpCircle className="w-4 h-4 text-[#0F4C2E] shrink-0 mt-0.5" />
            <div className="text-xs text-[#0F4C2E] leading-relaxed">
              <strong>Transparenz-Garantie:</strong> Der Divider besitzt keinen festen Hintergrundkasten. Der nicht von der Kurve gefüllte Bereich ist vollkommen transparent, sodass das Header-Bild oder der Farbverlauf dahinter exakt sichtbar bleibt.
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
