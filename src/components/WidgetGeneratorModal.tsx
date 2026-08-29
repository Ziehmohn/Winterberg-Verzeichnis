import React, { useState, useMemo } from 'react';
import { Business } from '../types';
import ReviewWidget, { WidgetLayout, WidgetTheme } from './ReviewWidget';
import { X, Copy, Check, Sparkles, ShieldCheck, Lock, ExternalLink, Code2, Globe, Laptop, HelpCircle } from 'lucide-react';
import { useTranslation } from '../i18n';

interface WidgetGeneratorModalProps {
  business: Business;
  isOpen: boolean;
  onClose: () => void;
  onUpgrade?: () => void;
}

export default function WidgetGeneratorModal({
  business,
  isOpen,
  onClose,
  onUpgrade
}: WidgetGeneratorModalProps) {
  const { t } = useTranslation();
  const [layout, setLayout] = useState<WidgetLayout>('badge');
  const [theme, setTheme] = useState<WidgetTheme>('light');
  const [whitelabel, setWhitelabel] = useState<boolean>(false);
  const [previewBg, setPreviewBg] = useState<'checkerboard' | 'white' | 'dark'>('checkerboard');
  const [codeType, setCodeType] = useState<'iframe' | 'script' | 'link'>('iframe');
  const [copied, setCopied] = useState(false);
  const [activeGuideTab, setActiveGuideTab] = useState<'wordpress' | 'wix' | 'jimdo' | 'html'>('wordpress');

  const isPremium = !!business?.isPremium;
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://www.winterberg-verzeichnis.de';
  const businessIdentifier = business?.id || business?.name?.replace(/\s+/g, '-').toLowerCase() || 'unternehmen';

  // Embed URL
  const embedUrl = useMemo(() => {
    const params = new URLSearchParams();
    if (layout !== 'badge') params.set('layout', layout);
    if (theme !== 'light') params.set('theme', theme);
    if (isPremium && whitelabel) params.set('whitelabel', '1');
    const queryString = params.toString() ? `?${params.toString()}` : '';
    return `${baseUrl}/embed/reviews/${encodeURIComponent(businessIdentifier)}${queryString}`;
  }, [baseUrl, businessIdentifier, layout, theme, isPremium, whitelabel]);

  // Code snippets
  const iframeCode = useMemo(() => {
    let height = 150;
    let maxWidth = 380;
    if (layout === 'simple_badge') { height = 80; maxWidth = 320; }
    else if (layout === 'card') { height = 240; maxWidth = 420; }
    else if (layout === 'carousel') { height = 280; maxWidth = 460; }

    return `<iframe src="${embedUrl}" width="100%" height="${height}" style="border:0; max-width:${maxWidth}px; overflow:hidden; border-radius:14px;" loading="lazy" title="Bewertungen von ${business.name}"></iframe>`;
  }, [embedUrl, layout, business.name]);

  const scriptCode = useMemo(() => {
    const wlAttr = isPremium && whitelabel ? ' data-whitelabel="true"' : '';
    return `<div class="winterberg-widget" data-business="${businessIdentifier}" data-layout="${layout}" data-theme="${theme}"${wlAttr}></div>\n<script src="${baseUrl}/widget.js" async></script>`;
  }, [baseUrl, businessIdentifier, layout, theme, isPremium, whitelabel]);

  const currentCode = useMemo(() => {
    if (codeType === 'iframe') return iframeCode;
    if (codeType === 'script') return scriptCode;
    return embedUrl;
  }, [codeType, iframeCode, scriptCode, embedUrl]);

  const handleCopy = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(currentCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-[#EDE8E0] overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#EDE8E0] bg-[#FAF8F5]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-[#0F4C2E] text-white flex items-center justify-center font-bold text-sm shadow-sm">
              ★
            </div>
            <div>
              <h2 className="font-bold text-[18px] text-[#1B211D] leading-tight flex items-center gap-2">
                <span>Bewertungs- & Trust-Siegel für Ihre Website</span>
                {isPremium ? (
                  <span className="bg-[#FFF1E4] text-[#D65F0C] text-[11px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Premium White-Label
                  </span>
                ) : (
                  <span className="bg-emerald-100 text-[#0F4C2E] text-[11px] font-bold px-2 py-0.5 rounded-full">
                    Kostenlos
                  </span>
                )}
              </h2>
              <p className="text-[12.5px] text-[#5F6B63]">
                {business.name} {business.district ? `· ${business.district}` : ''}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#5F6B63] hover:text-[#1B211D] hover:bg-black/5 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* LEFT: Configuration Controls */}
          <div className="lg:col-span-6 flex flex-col gap-5">
            
            {/* 1. Layout Selection */}
            <div>
              <label className="block text-[13px] font-bold text-[#1B211D] uppercase tracking-wider mb-2">
                1. Layout auswählen
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'badge', name: 'Kompaktes Siegel', desc: 'Sterne & Gesamtnote', icon: '⭐' },
                  { id: 'card', name: 'Bewertungskarte', desc: 'Mit Kundenstimmen-Zitat', icon: '💬' },
                  { id: 'carousel', name: 'Kundenstimmen-Slider', desc: 'Alle Bewertungen blätterbar', icon: '🔄' },
                  { id: 'simple_badge', name: 'Mini-Badge', desc: 'Schlankes Siegel für Footer', icon: '🛡️' }
                ].map(item => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setLayout(item.id as WidgetLayout)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      layout === item.id 
                        ? 'border-[#0F4C2E] bg-[#E8F1EB]/40 ring-2 ring-[#0F4C2E]/20 text-[#0F4C2E]' 
                        : 'border-[#EDE8E0] bg-white hover:border-[#0F4C2E]/50 text-[#1B211D]'
                    }`}
                  >
                    <div className="font-semibold text-[13.5px] flex items-center gap-1.5">
                      <span>{item.icon}</span>
                      <span>{item.name}</span>
                    </div>
                    <div className="text-[11.5px] text-[#5F6B63] mt-0.5">{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Theme Selection */}
            <div>
              <label className="block text-[13px] font-bold text-[#1B211D] uppercase tracking-wider mb-2">
                2. Farbschema
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'light', name: 'Hell', bg: 'bg-white text-black border-[#E0DCD5]' },
                  { id: 'dark', name: 'Dunkel', bg: 'bg-[#141A16] text-white border-[#2A362E]' },
                  { id: 'brand', name: 'Grün', bg: 'bg-[#0F4C2E] text-white border-[#0A3620]' },
                  { id: 'transparent', name: 'Minimal', bg: 'bg-[#FAF8F5] text-black border-dashed border-[#D8D2C8]' }
                ].map(th => (
                  <button
                    key={th.id}
                    type="button"
                    onClick={() => setTheme(th.id as WidgetTheme)}
                    className={`p-2.5 rounded-lg border text-center transition-all cursor-pointer font-medium text-[12.5px] ${th.bg} ${
                      theme === th.id ? 'ring-2 ring-[#0F4C2E] shadow-sm' : 'opacity-80 hover:opacity-100'
                    }`}
                  >
                    {th.name}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. White-Label Option */}
            <div className="p-4 rounded-xl border border-[#EDE8E0] bg-[#FAF8F5]">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-bold text-[14px] text-[#1B211D] flex items-center gap-1.5">
                    <span>White-Labeling (Ohne Verweis)</span>
                    {!isPremium && <Lock className="w-4 h-4 text-amber-600 shrink-0" />}
                  </div>
                  <p className="text-[12px] text-[#5F6B63] mt-1 leading-relaxed">
                    {isPremium 
                      ? 'Entfernt das Winterberg-Verzeichnis Branding und den Backlink für einen komplett neutralen Auftritt.' 
                      : 'Exklusiv für Premium-Einträge: Im Basiseintrag enthält das Siegel einen offiziellen Backlink zu Ihrem Winterberg-Profil.'}
                  </p>
                </div>

                {isPremium ? (
                  <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-0.5">
                    <input
                      type="checkbox"
                      checked={whitelabel}
                      onChange={e => setWhitelabel(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0F4C2E]"></div>
                  </label>
                ) : (
                  <button
                    type="button"
                    onClick={onUpgrade || (() => window.open('/preise', '_blank'))}
                    className="shrink-0 bg-[#F2761B] hover:bg-[#D65F0C] text-white text-[11px] font-bold px-2.5 py-1 rounded-md transition-colors shadow-sm"
                  >
                    Upgrade
                  </button>
                )}
              </div>

              {!isPremium && (
                <div className="mt-3 pt-2.5 border-t border-[#E7E2DA] flex items-center justify-between text-[11.5px] text-[#0F4C2E] font-medium">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Das Basissiegel ist für Sie 100% kostenfrei nutzbar!</span>
                  </span>
                </div>
              )}
            </div>

          </div>

          {/* RIGHT: Live Preview & Code Export */}
          <div className="lg:col-span-6 flex flex-col gap-4">
            
            {/* Live Preview Card */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[13px] font-bold text-[#1B211D] uppercase tracking-wider">
                  Live-Vorschau
                </span>
                
                {/* Preview background selector */}
                <div className="flex items-center gap-1 bg-[#FAF8F5] p-1 rounded-md border border-[#EDE8E0] text-[11px]">
                  <button
                    type="button"
                    onClick={() => setPreviewBg('white')}
                    className={`px-2 py-0.5 rounded cursor-pointer ${previewBg === 'white' ? 'bg-white shadow-xs font-bold' : 'text-[#5F6B63]'}`}
                  >
                    Weiß
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewBg('dark')}
                    className={`px-2 py-0.5 rounded cursor-pointer ${previewBg === 'dark' ? 'bg-[#1B211D] text-white font-bold' : 'text-[#5F6B63]'}`}
                  >
                    Dunkel
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewBg('checkerboard')}
                    className={`px-2 py-0.5 rounded cursor-pointer ${previewBg === 'checkerboard' ? 'bg-white shadow-xs font-bold' : 'text-[#5F6B63]'}`}
                  >
                    Muster
                  </button>
                </div>
              </div>

              <div 
                className={`p-6 rounded-2xl border border-[#EDE8E0] flex items-center justify-center min-h-[220px] transition-colors ${
                  previewBg === 'white' ? 'bg-white' : 
                  previewBg === 'dark' ? 'bg-[#141A16]' : 
                  'bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] bg-[#FAF8F5]'
                }`}
              >
                <ReviewWidget
                  businessId={business.id}
                  initialBusiness={business}
                  layout={layout}
                  theme={theme}
                  whitelabel={whitelabel}
                />
              </div>
            </div>

            {/* Code Export Box */}
            <div className="bg-[#141A16] text-white rounded-xl p-4 border border-[#2A362E] flex flex-col gap-3">
              
              <div className="flex items-center justify-between gap-2 border-b border-[#2A362E] pb-2.5">
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setCodeType('iframe')}
                    className={`px-2.5 py-1 text-[12px] rounded-md font-medium transition-colors cursor-pointer ${
                      codeType === 'iframe' ? 'bg-[#0F4C2E] text-white' : 'text-[#9AA69E] hover:text-white'
                    }`}
                  >
                    iFrame Code (Empfohlen)
                  </button>
                  <button
                    type="button"
                    onClick={() => setCodeType('script')}
                    className={`px-2.5 py-1 text-[12px] rounded-md font-medium transition-colors cursor-pointer ${
                      codeType === 'script' ? 'bg-[#0F4C2E] text-white' : 'text-[#9AA69E] hover:text-white'
                    }`}
                  >
                    JavaScript Tag
                  </button>
                  <button
                    type="button"
                    onClick={() => setCodeType('link')}
                    className={`px-2.5 py-1 text-[12px] rounded-md font-medium transition-colors cursor-pointer ${
                      codeType === 'link' ? 'bg-[#0F4C2E] text-white' : 'text-[#9AA69E] hover:text-white'
                    }`}
                  >
                    Direktlink
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleCopy}
                  className="bg-[#F2761B] hover:bg-[#D65F0C] text-white text-[12px] font-bold px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Kopiert!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Code kopieren</span>
                    </>
                  )}
                </button>
              </div>

              {/* Snippet Display */}
              <div className="relative">
                <pre className="text-[12px] font-mono text-[#E5EFEA] bg-[#0A0D0B] p-3 rounded-lg overflow-x-auto whitespace-pre-wrap break-all select-all max-h-[90px] border border-[#1E2620]">
                  {currentCode}
                </pre>
              </div>

              <div className="text-[11px] text-[#9AA69E] flex items-center gap-1">
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>
                  {codeType === 'iframe' 
                    ? 'Funktioniert garantiert in jedem CMS (WordPress, Elementor, Jimdo, Wix, Squarespace, Webflow & HTML).' 
                    : codeType === 'script' 
                    ? 'Passt die Widget-Höhe automatisch an jede Bildschirmgröße an.' 
                    : 'Perfekt geeignet als Link in E-Mail-Signaturen, WhatsApp oder Social Media.'}
                </span>
              </div>
            </div>

          </div>

        </div>

        {/* Integration Instructions */}
        <div className="border-t border-[#EDE8E0] bg-[#FAF8F5] px-6 py-3.5">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-2 text-[12.5px] text-[#5F6B63]">
              <HelpCircle className="w-4 h-4 text-[#0F4C2E]" />
              <span><strong>Anleitung:</strong> Fügen Sie den iFrame-Code einfach in einen <em>HTML-Block</em> Ihrer Website ein.</span>
            </div>

            <div className="flex items-center gap-2 text-[12px]">
              <a
                href={embedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#0F4C2E] hover:underline font-semibold inline-flex items-center gap-1"
              >
                <span>Widget in neuem Tab testen</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
