import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  MapPin, 
  CheckCircle2, 
  UtensilsCrossed, 
  Wrench, 
  Layers, 
  Sliders, 
  Type,
  Building2,
  Save,
  RotateCcw,
  Eye,
  Check,
  Palette,
  Search,
  ExternalLink,
  Info
} from 'lucide-react';
import { DesignSettings, ThemeConfig } from '../types';
import { db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';

interface AdminDesignManagerProps {
  designSettings: DesignSettings;
  setDesignSettings: (settings: DesignSettings) => void;
  theme: ThemeConfig;
  activeThemeKey: string;
}

export function loadGoogleFont(fontName: string) {
  if (!fontName) return;
  const cleanFont = fontName.trim().replace(/\s+/g, '+');
  const id = `google-font-${cleanFont.toLowerCase()}`;
  if (!document.getElementById(id)) {
    const link = document.createElement('link');
    link.id = id;
    link.rel = 'stylesheet';
    link.href = `https://fonts.googleapis.com/css2?family=${cleanFont}:wght@300;400;500;600;700;800&display=swap`;
    document.head.appendChild(link);
  }
}

export const POPULAR_HEADLINE_FONTS = [
  'Manrope',
  'Outfit',
  'Plus Jakarta Sans',
  'Poppins',
  'Inter',
  'Montserrat',
  'Sora',
  'DM Sans',
  'Space Grotesk',
  'Playfair Display',
  'Urbanist',
  'Barlow',
  'Lora',
  'Work Sans',
  'Raleway',
  'Rubik',
  'Fraunces',
  'Oswald',
  'Bebas Neue',
  'Cinzel',
  'Public Sans',
  'Lato',
  'Roboto'
];

export const POPULAR_BODY_FONTS = [
  'Public Sans',
  'Inter',
  'Open Sans',
  'Roboto',
  'Plus Jakarta Sans',
  'DM Sans',
  'Nunito Sans',
  'Lato',
  'Source Sans 3',
  'Work Sans',
  'Manrope',
  'Outfit',
  'Mulish',
  'Karla'
];

export interface FontPreset {
  id: string;
  name: string;
  badge: string;
  description: string;
  headlineFont: string;
  bodyFont: string;
  headlineWeight: 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold';
  headlineLetterSpacing: 'tight' | 'normal' | 'wide';
}

export const FONT_PRESETS: FontPreset[] = [
  {
    id: 'modern-clean',
    name: 'Modern & Klar (Empfohlen)',
    badge: 'Standard 2026',
    description: 'Manrope für markante, moderne Überschriften mit Public Sans als optimal lesbarem Fließtext.',
    headlineFont: 'Manrope',
    bodyFont: 'Public Sans',
    headlineWeight: 'bold',
    headlineLetterSpacing: 'normal'
  },
  {
    id: 'contemporary-tech',
    name: 'Tech & Contemporary',
    badge: 'Trend',
    description: 'Plus Jakarta Sans gepaart mit Inter für einen hochprofessionellen, zeitgemäßen Web-Auftritt.',
    headlineFont: 'Plus Jakarta Sans',
    bodyFont: 'Inter',
    headlineWeight: 'bold',
    headlineLetterSpacing: 'tight'
  },
  {
    id: 'bold-urban',
    name: 'Bold & Dynamic',
    badge: 'Innovativ',
    description: 'Sora für markante Überschriften mit futuristischem Touch und klarem Plus Jakarta Sans Fließtext.',
    headlineFont: 'Sora',
    bodyFont: 'Plus Jakarta Sans',
    headlineWeight: 'extrabold',
    headlineLetterSpacing: 'tight'
  },
  {
    id: 'warm-humanist',
    name: 'Warm & Regional',
    badge: 'Sympathisch',
    description: 'DM Sans durchgängig für eine einladende, harmonische und organische Gesamterscheinung.',
    headlineFont: 'DM Sans',
    bodyFont: 'DM Sans',
    headlineWeight: 'bold',
    headlineLetterSpacing: 'normal'
  },
  {
    id: 'classic-display',
    name: 'Outfit Klassisch',
    badge: 'Bisheriges Design',
    description: 'Outfit Display-Font mit abgerundeten Nuancen und Public Sans Fließtext.',
    headlineFont: 'Outfit',
    bodyFont: 'Public Sans',
    headlineWeight: 'bold',
    headlineLetterSpacing: 'normal'
  },
  {
    id: 'editorial-elegance',
    name: 'Eleganz & Premium Serif',
    badge: 'Exklusiv',
    description: 'Playfair Display als klassische Serifenschrift für exklusive Gastronomie und Hotels mit Source Sans 3.',
    headlineFont: 'Playfair Display',
    bodyFont: 'Source Sans 3',
    headlineWeight: 'bold',
    headlineLetterSpacing: 'normal'
  },
  {
    id: 'geometric-friendly',
    name: 'Freundlich & Geometrisch',
    badge: 'Lebendig',
    description: 'Poppins für offene, freundliche Überschriften mit bewährtem Open Sans Fließtext.',
    headlineFont: 'Poppins',
    bodyFont: 'Open Sans',
    headlineWeight: 'bold',
    headlineLetterSpacing: 'normal'
  },
  {
    id: 'sharp-corporate',
    name: 'Kompakt & Wirtschaftlich',
    badge: 'Business',
    description: 'Montserrat für kraftvolle Großstadt-Ästhetik mit schnörkellosem Roboto Fließtext.',
    headlineFont: 'Montserrat',
    bodyFont: 'Roboto',
    headlineWeight: 'bold',
    headlineLetterSpacing: 'wide'
  },
  {
    id: 'scandi-minimal',
    name: 'Nordisch Minimalistisch',
    badge: 'Clean',
    description: 'Urbanist mit ultra-klaren Konturen und weichem Nunito Sans Fließtext.',
    headlineFont: 'Urbanist',
    bodyFont: 'Nunito Sans',
    headlineWeight: 'semibold',
    headlineLetterSpacing: 'tight'
  },
  {
    id: 'architectural',
    name: 'Handwerk & Architektur',
    badge: 'Solide',
    description: 'Barlow für konstruktive, präzise Industrie- und Handwerksästhetik mit Work Sans.',
    headlineFont: 'Barlow',
    bodyFont: 'Work Sans',
    headlineWeight: 'bold',
    headlineLetterSpacing: 'normal'
  },
  {
    id: 'traditional-editorial',
    name: 'Traditionell & Magazin',
    badge: 'Editorial',
    description: 'Lora für traditionsreiche Zeitungs-Typografie mit modernem Lato Fließtext.',
    headlineFont: 'Lora',
    bodyFont: 'Lato',
    headlineWeight: 'bold',
    headlineLetterSpacing: 'normal'
  },
  {
    id: 'space-modern',
    name: 'Progressiv & Kantig',
    badge: 'Modernist',
    description: 'Space Grotesk mit technischem Flair kombiniert mit extrem neutralem Inter.',
    headlineFont: 'Space Grotesk',
    bodyFont: 'Inter',
    headlineWeight: 'bold',
    headlineLetterSpacing: 'tight'
  }
];

export const fontWeightsMap = {
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  extrabold: '800'
};

export const letterSpacingsMap = {
  tight: '-0.025em',
  normal: '0em',
  wide: '0.03em'
};

export default function AdminDesignManager({
  designSettings,
  setDesignSettings,
  theme,
  activeThemeKey
}: AdminDesignManagerProps) {
  const [formData, setFormData] = useState<DesignSettings>(designSettings);
  const [customHeadlineFont, setCustomHeadlineFont] = useState('');
  const [customBodyFont, setCustomBodyFont] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'presets' | 'custom'>('presets');

  // Load Google Fonts on mount and whenever font changes
  useEffect(() => {
    loadGoogleFont(formData.headlineFont);
    loadGoogleFont(formData.bodyFont);

    // Apply live style preview
    document.documentElement.style.setProperty('--font-display', `"${formData.headlineFont}", ui-sans-serif, system-ui, sans-serif`);
    document.documentElement.style.setProperty('--font-sans', `"${formData.bodyFont}", ui-sans-serif, system-ui, sans-serif`);
  }, [formData.headlineFont, formData.bodyFont]);

  const handleApplyPreset = (preset: FontPreset) => {
    const updated: DesignSettings = {
      headlineFont: preset.headlineFont,
      bodyFont: preset.bodyFont,
      headlineWeight: preset.headlineWeight,
      headlineLetterSpacing: preset.headlineLetterSpacing,
      presetId: preset.id
    };
    setFormData(updated);
    loadGoogleFont(preset.headlineFont);
    loadGoogleFont(preset.bodyFont);
  };

  const handleCustomHeadlineChange = (font: string) => {
    if (!font.trim()) return;
    loadGoogleFont(font);
    setFormData(prev => ({ ...prev, headlineFont: font.trim(), presetId: 'custom' }));
  };

  const handleCustomBodyChange = (font: string) => {
    if (!font.trim()) return;
    loadGoogleFont(font);
    setFormData(prev => ({ ...prev, bodyFont: font.trim(), presetId: 'custom' }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // 1. Update State
      setDesignSettings(formData);

      // 2. Persist in localStorage
      localStorage.setItem('siteDesignSettings', JSON.stringify(formData));

      // 3. Persist in Firestore for global live frontend deployment
      await setDoc(doc(db, 'settings', 'design'), formData, { merge: true });

      // 4. Apply font variable to root
      document.documentElement.style.setProperty('--font-display', `"${formData.headlineFont}", ui-sans-serif, system-ui, sans-serif`);
      document.documentElement.style.setProperty('--font-sans', `"${formData.bodyFont}", ui-sans-serif, system-ui, sans-serif`);

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3500);
    } catch (err) {
      console.error('Error saving design settings:', err);
      alert('Fehler beim Speichern in der Datenbank. Die Einstellungen wurden lokal angewendet.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    const defaultSettings: DesignSettings = {
      headlineFont: 'Manrope',
      bodyFont: 'Public Sans',
      headlineWeight: 'bold',
      headlineLetterSpacing: 'normal',
      presetId: 'modern-clean'
    };
    setFormData(defaultSettings);
    loadGoogleFont('Manrope');
    loadGoogleFont('Public Sans');
  };

  const previewHeadlineStyle = {
    fontFamily: `"${formData.headlineFont}", sans-serif`,
    fontWeight: fontWeightsMap[formData.headlineWeight],
    letterSpacing: letterSpacingsMap[formData.headlineLetterSpacing]
  };

  const previewBodyStyle = {
    fontFamily: `"${formData.bodyFont}", sans-serif`
  };

  return (
    <div className="w-full flex flex-col gap-8 animate-in fade-in duration-200">
      {/* Control Panel Top Bar */}
      <div className="bg-white border border-[#EDE8E0] rounded-lg p-6 shadow-[0_4px_20px_rgba(27,33,29,0.06)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#F3F0EA] mb-6">
          <div>
            <div className="flex items-center gap-2.5">
              <Palette className="w-6 h-6 text-[#F2761B]" />
              <h2 className="font-display text-2xl font-bold text-[#1B211D] m-0">
                Design- &amp; Typografie-Studio
              </h2>
            </div>
            <p className="text-sm text-[#5F6B63] mt-1 m-0">
              Wählen Sie beliebte Schriftkombinationen oder beliebige Google Fonts aus. Änderungen sind live sichtbar und werden mit einem Klick für alle Besucher im Frontend aktiviert.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={handleReset}
              className="px-3.5 py-2.5 bg-[#FAF8F5] hover:bg-gray-100 text-[#4A544D] text-xs font-semibold rounded-md border border-[#EDE8E0] transition-colors inline-flex items-center gap-1.5 cursor-pointer"
              title="Auf Standard zurücksetzen"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Standard
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="px-5 py-2.5 bg-[#0F4C2E] hover:bg-[#06301C] text-white text-sm font-bold rounded-md transition-all shadow-md inline-flex items-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {isSaving ? (
                <>Wird gespeichert...</>
              ) : saveSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  Live veröffentlicht!
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 text-[#F2761B]" />
                  Live-Design veröffentlichen
                </>
              )}
            </button>
          </div>
        </div>

        {/* Current Active Font Summary Banner */}
        <div className="bg-[#FAF8F5] border border-[#E7E2DA] rounded-md p-4 mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="text-xs text-[#5F6B63]">
              Headline Font: <strong className="text-[#0F4C2E] text-sm ml-1 font-bold">{formData.headlineFont}</strong>
            </div>
            <div className="h-4 w-px bg-[#D8D2C8] hidden sm:block"></div>
            <div className="text-xs text-[#5F6B63]">
              Fließtext / Body Font: <strong className="text-[#1B211D] text-sm ml-1 font-bold">{formData.bodyFont}</strong>
            </div>
            <div className="h-4 w-px bg-[#D8D2C8] hidden sm:block"></div>
            <div className="text-xs text-[#5F6B63]">
              Stil: <span className="bg-white border border-[#EDE8E0] px-2 py-0.5 rounded text-xs font-medium text-[#4A544D] ml-1">{formData.headlineWeight} / {formData.headlineLetterSpacing}</span>
            </div>
          </div>

          {/* Sub-tab navigation */}
          <div className="flex gap-1.5 bg-white border border-[#EDE8E0] rounded-md p-1">
            <button
              type="button"
              onClick={() => setActiveTab('presets')}
              className={`px-3 py-1.5 rounded text-xs font-semibold cursor-pointer transition-colors ${
                activeTab === 'presets' ? 'bg-[#0F4C2E] text-white' : 'text-[#5F6B63] hover:text-black'
              }`}
            >
              Beliebte Schrift-Kombinationen ({FONT_PRESETS.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('custom')}
              className={`px-3 py-1.5 rounded text-xs font-semibold cursor-pointer transition-colors ${
                activeTab === 'custom' ? 'bg-[#0F4C2E] text-white' : 'text-[#5F6B63] hover:text-black'
              }`}
            >
              Freie Google-Fonts Auswahl
            </button>
          </div>
        </div>

        {/* Tab 1: Presets Showcase */}
        {activeTab === 'presets' ? (
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {FONT_PRESETS.map((preset) => {
                const isSelected = formData.headlineFont === preset.headlineFont && formData.bodyFont === preset.bodyFont;
                return (
                  <div
                    key={preset.id}
                    onClick={() => handleApplyPreset(preset)}
                    className={`p-4 rounded-lg border text-left transition-all cursor-pointer flex flex-col justify-between relative ${
                      isSelected
                        ? 'bg-[#E8F1EB] border-[#0F4C2E] ring-2 ring-[#0F4C2E]/20 shadow-sm'
                        : 'bg-white border-[#EDE8E0] hover:border-[#0F4C2E]/50 hover:bg-[#FAF8F5]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                          isSelected ? 'bg-[#0F4C2E] text-white' : 'bg-gray-100 text-[#5F6B63]'
                        }`}>
                          {preset.badge}
                        </span>
                        {isSelected && (
                          <span className="flex items-center gap-1 text-xs font-bold text-[#0F4C2E]">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Aktiv
                          </span>
                        )}
                      </div>

                      <div 
                        className="text-base font-bold text-[#1B211D] mb-1 leading-snug"
                        style={{ fontFamily: `"${preset.headlineFont}", sans-serif` }}
                      >
                        {preset.name}
                      </div>

                      <div className="text-xs font-semibold text-[#0F4C2E] mb-2">
                        {preset.headlineFont} + {preset.bodyFont}
                      </div>

                      <p className="text-xs text-[#5F6B63] leading-relaxed m-0" style={{ fontFamily: `"${preset.bodyFont}", sans-serif` }}>
                        {preset.description}
                      </p>
                    </div>

                    <div className="mt-3 pt-3 border-t border-black/5 flex items-center justify-between text-[11px] text-[#8A928B]">
                      <span>Vorschau anklicken</span>
                      <span className="font-semibold text-[#1B211D] group-hover:text-[#0F4C2E]">Auswählen →</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* Tab 2: Custom Google Fonts selection */
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Headline Font Selector */}
              <div className="bg-[#FAF8F5] border border-[#EDE8E0] rounded-lg p-5">
                <label className="block text-xs font-bold text-[#5F6B63] uppercase tracking-wider mb-2">
                  1. Headline Schriftart (Überschriften)
                </label>

                {/* Quick Pick Dropdown */}
                <select
                  value={formData.headlineFont}
                  onChange={(e) => handleCustomHeadlineChange(e.target.value)}
                  className="w-full bg-white border border-[#E7E2DA] rounded-md px-3.5 py-2.5 text-sm font-semibold text-[#1B211D] focus:outline-none focus:border-[#0F4C2E] mb-3"
                >
                  <optgroup label="Beliebte Überschrift-Fonts">
                    {POPULAR_HEADLINE_FONTS.map(f => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </optgroup>
                </select>

                {/* Custom Google Font Text Input */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Oder beliebigen Google Font Namen eingeben..."
                    value={customHeadlineFont}
                    onChange={(e) => setCustomHeadlineFont(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleCustomHeadlineChange(customHeadlineFont);
                        setCustomHeadlineFont('');
                      }
                    }}
                    className="flex-1 bg-white border border-[#E7E2DA] rounded-md px-3 py-2 text-xs focus:outline-none focus:border-[#0F4C2E]"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      handleCustomHeadlineChange(customHeadlineFont);
                      setCustomHeadlineFont('');
                    }}
                    className="bg-[#0F4C2E] text-white px-3 py-2 rounded-md text-xs font-semibold hover:bg-[#06301C] transition-colors"
                  >
                    Laden
                  </button>
                </div>
                <div className="text-[11px] text-[#8A928B] mt-2">
                  Unterstützt alle 1.500+ Google Fonts (z. B. <em>Cabin, Syne, Archivo, Josefin Sans, Abril Fatface</em> etc.)
                </div>
              </div>

              {/* Body Font Selector */}
              <div className="bg-[#FAF8F5] border border-[#EDE8E0] rounded-lg p-5">
                <label className="block text-xs font-bold text-[#5F6B63] uppercase tracking-wider mb-2">
                  2. Fließtext &amp; UI Schriftart (Body)
                </label>

                {/* Quick Pick Dropdown */}
                <select
                  value={formData.bodyFont}
                  onChange={(e) => handleCustomBodyChange(e.target.value)}
                  className="w-full bg-white border border-[#E7E2DA] rounded-md px-3.5 py-2.5 text-sm font-semibold text-[#1B211D] focus:outline-none focus:border-[#0F4C2E] mb-3"
                >
                  <optgroup label="Optimierte Fließtext-Fonts">
                    {POPULAR_BODY_FONTS.map(f => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </optgroup>
                </select>

                {/* Custom Google Font Text Input */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Beliebigen Google Font Namen eingeben..."
                    value={customBodyFont}
                    onChange={(e) => setCustomBodyFont(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleCustomBodyChange(customBodyFont);
                        setCustomBodyFont('');
                      }
                    }}
                    className="flex-1 bg-white border border-[#E7E2DA] rounded-md px-3 py-2 text-xs focus:outline-none focus:border-[#0F4C2E]"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      handleCustomBodyChange(customBodyFont);
                      setCustomBodyFont('');
                    }}
                    className="bg-[#0F4C2E] text-white px-3 py-2 rounded-md text-xs font-semibold hover:bg-[#06301C] transition-colors"
                  >
                    Laden
                  </button>
                </div>
                <div className="text-[11px] text-[#8A928B] mt-2">
                  Tipp: Für Fließtext eignen sich neutrale Sans-Serif Fonts mit hoher x-Höhe.
                </div>
              </div>
            </div>

            {/* Fine Tuning: Weight & Letter Spacing */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#FAF8F5] border border-[#EDE8E0] rounded-lg p-5">
              <div>
                <label className="block text-xs font-bold text-[#5F6B63] uppercase tracking-wider mb-2">
                  Headline Schriftschnitt (Weight)
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: 'medium', label: '500' },
                    { id: 'semibold', label: '600' },
                    { id: 'bold', label: '700' },
                    { id: 'extrabold', label: '800' }
                  ].map(w => (
                    <button
                      key={w.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, headlineWeight: w.id as any })}
                      className={`p-2 rounded text-xs border text-center transition-all cursor-pointer ${
                        formData.headlineWeight === w.id
                          ? 'bg-[#F2761B] text-white border-[#F2761B] font-bold shadow-sm'
                          : 'bg-white text-[#1B211D] border-[#E7E2DA] hover:bg-gray-50'
                      }`}
                    >
                      {w.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5F6B63] uppercase tracking-wider mb-2">
                  Headline Zeichenabstand (Letter Spacing)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'tight', label: 'Eng (-0.025)' },
                    { id: 'normal', label: 'Normal (0)' },
                    { id: 'wide', label: 'Weit (+0.03)' }
                  ].map(ls => (
                    <button
                      key={ls.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, headlineLetterSpacing: ls.id as any })}
                      className={`p-2 rounded text-xs border text-center transition-all cursor-pointer ${
                        formData.headlineLetterSpacing === ls.id
                          ? 'bg-[#1B211D] text-white border-[#1B211D] font-bold shadow-sm'
                          : 'bg-white text-[#1B211D] border-[#E7E2DA] hover:bg-gray-50'
                      }`}
                    >
                      {ls.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Live Preview Header Badge */}
      <div className="flex items-center justify-between gap-4 pt-2">
        <div className="flex items-center gap-2">
          <Eye className="w-5 h-5 text-[#0F4C2E]" />
          <h3 className="font-display text-xl font-bold text-[#1B211D] m-0">
            Live-Vorschau (Headlines: <span className="text-[#0F4C2E]">{formData.headlineFont}</span> · Body: <span className="text-[#1B211D]">{formData.bodyFont}</span>)
          </h3>
        </div>
        <span className="text-xs text-[#8A928B] bg-white border border-[#EDE8E0] px-3 py-1 rounded-md">
          Echtzeit-Rendering
        </span>
      </div>

      {/* 1. Hero Showcase Section */}
      <section className="bg-white border border-[#EDE8E0] rounded-lg p-8 md:p-10 shadow-[0_6px_24px_rgba(27,33,29,0.05)] relative overflow-hidden" style={previewBodyStyle}>
        <div className="inline-flex items-center gap-2 bg-[#E8F1EB] text-[#0F4C2E] border border-[#C2DBCB] rounded-md px-3.5 py-1.5 text-xs font-bold tracking-wide uppercase mb-6">
          <Sparkles className="w-3.5 h-3.5 text-[#F2761B]" />
          Hero-Bereich mit gewählter Schrift
        </div>

        <h1 
          className="text-3xl sm:text-4xl md:text-5xl text-[#0F4C2E] mb-5 leading-[1.14]"
          style={previewHeadlineStyle}
        >
          Das Verzeichnis für Handwerk, Handel &amp; Gastronomie in Winterberg
        </h1>

        <p className="text-base md:text-lg text-[#4A544D] leading-relaxed max-w-3xl mb-8">
          Entdecken Sie regionale Fachbetriebe, Öffnungszeiten, Kontaktdaten und Neuigkeiten aus allen 14 Ortsteilen.
        </p>

        <div className="flex flex-wrap gap-3 items-center">
          <button 
            type="button" 
            className="bg-[#0F4C2E] hover:bg-[#06301C] text-white font-semibold px-6 py-3 rounded-md text-sm transition-colors shadow-md cursor-pointer"
            style={{ fontFamily: previewHeadlineStyle.fontFamily }}
          >
            Unternehmen durchsuchen
          </button>
          <button 
            type="button" 
            className="bg-[#F2761B] hover:bg-[#D65F0C] text-white font-semibold px-6 py-3 rounded-md text-sm transition-colors shadow-md cursor-pointer"
            style={{ fontFamily: previewHeadlineStyle.fontFamily }}
          >
            Kostenlos eintragen
          </button>
        </div>
      </section>

      {/* 2. Grid of Mock Business Cards */}
      <section className="space-y-4" style={previewBodyStyle}>
        <div>
          <h2 
            className="text-2xl text-[#1B211D] mb-1"
            style={previewHeadlineStyle}
          >
            Musterkarten im Verzeichnis
          </h2>
          <p className="text-xs text-[#5F6B63] m-0">
            So wirken Firmennamen, Badges und Rubriken mit der eingestellten Schriftkombination.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-white border border-[#EDE8E0] rounded-lg p-6 flex flex-col justify-between shadow-[0_2px_10px_rgba(27,33,29,0.04)]">
            <div>
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-md flex items-center justify-center border border-orange-200 shrink-0">
                  <UtensilsCrossed className="w-6 h-6" />
                </div>
                <span className="bg-[#FFF1E4] text-[#D65F0C] text-xs font-bold px-2.5 py-1 rounded uppercase tracking-wider">
                  Premium
                </span>
              </div>

              <h3 
                className="text-lg text-[#1B211D] mb-2 leading-snug"
                style={previewHeadlineStyle}
              >
                Gasthof &amp; Restaurant Bergpanorama
              </h3>
              <p className="text-xs text-[#8A928B] mb-3">Gastronomie · Winterberg Kernstadt</p>
              
              <p className="text-sm text-[#4A544D] leading-relaxed mb-4">
                Regionale Spezialitäten aus dem Sauerland, frische Wildgerichte und Sonnenterrasse mit Blick auf das Skikarussell.
              </p>
            </div>

            <div className="pt-4 border-t border-[#F3F0EA] flex items-center justify-between text-xs text-[#5F6B63]">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#8A928B]" /> Am Waltenberg 24
              </span>
              <span className="font-semibold text-[#0F4C2E]">Geöffnet</span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white border border-[#EDE8E0] rounded-lg p-6 flex flex-col justify-between shadow-[0_2px_10px_rgba(27,33,29,0.04)]">
            <div>
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-700 rounded-md flex items-center justify-center border border-emerald-200 shrink-0">
                  <Wrench className="w-6 h-6" />
                </div>
                <span className="bg-[#E8F1EB] text-[#0F4C2E] text-xs font-semibold px-2.5 py-1 rounded">
                  Meisterbetrieb
                </span>
              </div>

              <h3 
                className="text-lg text-[#1B211D] mb-2 leading-snug"
                style={previewHeadlineStyle}
              >
                Sauerländer Holzbau &amp; Bedachungen GmbH
              </h3>
              <p className="text-xs text-[#8A928B] mb-3">Handwerk · Siedlinghausen</p>
              
              <p className="text-sm text-[#4A544D] leading-relaxed mb-4">
                Ihr kompetenter Ansprechpartner für Dachsanierungen, Holzrahmenbau, Carports und energetische Gebäudemodernisierung.
              </p>
            </div>

            <div className="pt-4 border-t border-[#F3F0EA] flex items-center justify-between text-xs text-[#5F6B63]">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#8A928B]" /> Hochsauerlandstr. 42
              </span>
              <span className="text-[#8A928B]">Winterberg</span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white border border-[#EDE8E0] rounded-lg p-6 flex flex-col justify-between shadow-[0_2px_10px_rgba(27,33,29,0.04)]">
            <div>
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="w-12 h-12 bg-teal-50 text-teal-700 rounded-md flex items-center justify-center border border-teal-200 shrink-0">
                  <Building2 className="w-6 h-6" />
                </div>
                <span className="bg-slate-100 text-slate-700 text-xs font-semibold px-2.5 py-1 rounded">
                  Verifiziert
                </span>
              </div>

              <h3 
                className="text-lg text-[#1B211D] mb-2 leading-snug"
                style={previewHeadlineStyle}
              >
                Kanzlei Kräling &amp; Partner Steuerberatung
              </h3>
              <p className="text-xs text-[#8A928B] mb-3">Dienstleistungen · Niedersfeld</p>
              
              <p className="text-sm text-[#4A544D] leading-relaxed mb-4">
                Ganzheitliche steuerliche und betriebswirtschaftliche Beratung für mittelständische Betriebe, Freiberufler und Privatpersonen.
              </p>
            </div>

            <div className="pt-4 border-t border-[#F3F0EA] flex items-center justify-between text-xs text-[#5F6B63]">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#8A928B]" /> Ruhrstraße 18
              </span>
              <span className="text-[#8A928B]">Niedersfeld</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Typography Scale & Article Specimen */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8" style={previewBodyStyle}>
        {/* Hierarchy Overview */}
        <div className="bg-white border border-[#EDE8E0] rounded-lg p-7 shadow-[0_2px_10px_rgba(27,33,29,0.04)]">
          <div className="flex items-center gap-2 mb-6 pb-3 border-b border-[#F3F0EA]">
            <Type className="w-5 h-5 text-[#0F4C2E]" />
            <h2 className="font-display text-lg font-bold m-0 text-[#1B211D]">
              Hierarchie &amp; Schriftgrößen
            </h2>
          </div>

          <div className="space-y-5">
            <div>
              <span className="text-[10px] font-bold text-[#8A928B] uppercase tracking-wider block mb-1">Headline H1 (36px)</span>
              <h1 className="text-3xl text-[#0F4C2E] leading-tight m-0" style={previewHeadlineStyle}>
                Winterberg erleben und entdecken
              </h1>
            </div>

            <div>
              <span className="text-[10px] font-bold text-[#8A928B] uppercase tracking-wider block mb-1">Headline H2 (26px)</span>
              <h2 className="text-2xl text-[#1B211D] leading-snug m-0" style={previewHeadlineStyle}>
                Zentrale Anlaufstelle für Unternehmen
              </h2>
            </div>

            <div>
              <span className="text-[10px] font-bold text-[#8A928B] uppercase tracking-wider block mb-1">Headline H3 (20px)</span>
              <h3 className="text-xl text-[#1B211D] leading-snug m-0" style={previewHeadlineStyle}>
                Premium-Eintrag mit vielen Vorteilen
              </h3>
            </div>

            <div>
              <span className="text-[10px] font-bold text-[#8A928B] uppercase tracking-wider block mb-1">Headline H4 (17px)</span>
              <h4 className="text-lg text-[#1B211D] leading-snug m-0" style={previewHeadlineStyle}>
                Persönlicher Kundenservice &amp; Support
              </h4>
            </div>
          </div>
        </div>

        {/* Longform Editorial Article with Dummytext */}
        <div className="bg-white border border-[#EDE8E0] rounded-lg p-7 shadow-[0_2px_10px_rgba(27,33,29,0.04)]">
          <div className="flex items-center gap-2 mb-6 pb-3 border-b border-[#F3F0EA]">
            <Layers className="w-5 h-5 text-[#0F4C2E]" />
            <h2 className="font-display text-lg font-bold m-0 text-[#1B211D]">
              Fließtext- &amp; Artikel-Vorschau
            </h2>
          </div>

          <article className="space-y-3.5 text-[#4A544D] text-[15px] leading-[1.65]">
            <h3 
              className="text-xl text-[#0F4C2E] leading-snug mb-2"
              style={previewHeadlineStyle}
            >
              Warum ein starker lokaler Webauftritt den Unterschied macht
            </h3>

            <p>
              In einer digital vernetzten Welt suchen sowohl Einheimische als auch Urlauber gezielt online nach Handwerksbetrieben, Speisekarten, Freizeitaktivitäten und Dienstleistern in ihrer unmittelbaren Umgebung.
            </p>

            <div className="bg-[#FAF8F5] border-l-4 border-[#F2761B] p-3.5 rounded-r-md my-3">
              <p className="font-medium text-[#1B211D] italic text-xs m-0">
                „Transparente Kontaktdaten, aktuelle Öffnungszeiten und eine ansprechende Präsentation schaffen Vertrauen und bringen neue Kunden direkt zu Ihnen.“
              </p>
            </div>

            <h4 
              className="text-base text-[#1B211D] pt-1"
              style={previewHeadlineStyle}
            >
              Klare Struktur für maximale Nutzerfreundlichkeit
            </h4>

            <p>
              Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.
            </p>
          </article>
        </div>
      </section>
    </div>
  );
}
