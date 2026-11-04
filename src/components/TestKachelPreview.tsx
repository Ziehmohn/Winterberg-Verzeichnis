import React, { useState } from 'react';
import { 
  Layers, 
  CheckCircle2, 
  Sparkles, 
  Eye, 
  Search, 
  RotateCcw, 
  ArrowRight, 
  Building2, 
  UtensilsCrossed, 
  Wrench,
  Check,
  Info
} from 'lucide-react';
import { Business, DesignSettings, CardLayoutId } from '../types';
import { CARD_LAYOUTS, CARD_LAYOUT_CATEGORIES, getCardLayoutInfo } from '../utils/cardLayouts';
import BusinessCard, { setGlobalCardLayout } from './BusinessCard';
import { db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';

interface TestKachelPreviewProps {
  designSettings?: DesignSettings;
  setDesignSettings?: (settings: DesignSettings) => void;
  businesses?: Business[];
}

// 3 High-Fidelity Representative Sample Businesses for Testing
const SAMPLE_BUSINESS_PREMIUM: Business = {
  id: 'sample-sichtbar-seo',
  name: 'SICHTBAR SEO - Simon Kräling',
  category: 'Dienstleistungen',
  subcategory: 'Marketingdienstleistungen',
  description: 'Simon Kräling ist Berater für digitale Sichtbarkeit aus Winterberg. Er unterstützt lokale Betriebe und Gastgeber dabei, bei Google und in modernen KI-Suchen wie ChatGPT ganz oben gefunden zu werden.',
  address: 'Schanzenstraße 28',
  district: 'Winterberg Kernstadt',
  city: 'Winterberg',
  isPremium: true,
  isVerified: true,
  logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&q=80',
  logoBgColor: '#1B211D',
  headerImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1000&q=80',
  gallery: [
    'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=600&q=80',
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&q=80'
  ],
  services: ['Suchmaschinenoptimierung (SEO)', 'Generative Engine Optimization (GEO)', 'Digitale Sichtbarkeit', 'Google Business Profil'],
  products: ['SEO-Audits', 'GEO-Strategiepläne', 'Content-Pakete'],
  phone: '02981 908900',
  website: 'https://www.sichtbar-online.com',
  rating: 5.0,
  reviewCount: 14,
  reviews: [
    {
      id: 'r1',
      authorName: 'Michael S.',
      rating: 5,
      text: 'Exzellente und sehr kompetente Beratung! Unsere Anfragen haben sich deutlich gesteigert.',
      status: 'approved',
      date: '2026-10-12'
    },
    {
      id: 'r2',
      authorName: 'Laura B.',
      rating: 5,
      text: 'Super professionell und schnell umgesetzt.',
      status: 'approved',
      date: '2026-09-28'
    }
  ],
  openingHours: {
    monday: '09:00 - 18:00',
    tuesday: '09:00 - 18:00',
    wednesday: '09:00 - 18:00',
    thursday: '09:00 - 18:00',
    friday: '09:00 - 16:00'
  }
};

const SAMPLE_BUSINESS_GASTRO: Business = {
  id: 'sample-cafe-extrablatt',
  name: 'Café & Restaurant Extrablatt',
  category: 'Gastronomie',
  subcategory: 'Café & Bistro',
  description: 'Beliebter Treffpunkt am Winterberger Marktplatz mit großem Frühstücksbuffet, saftigen Burgern, feinen Kaffeespezialitäten und frischen Cocktails am Abend.',
  address: 'Marktplatz 1',
  district: 'Winterberg Kernstadt',
  city: 'Winterberg',
  isPremium: true,
  isVerified: true,
  headerImage: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1000&q=80',
  gallery: [
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=80',
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80'
  ],
  services: ['Großes Frühstücksbuffet', 'Sonnenterrasse', 'Cocktail Happy Hour', 'Kaffee & Kuchen'],
  products: ['Extrablatt Burger', 'Hausgemachte Waffeln', 'Sauerländer Schnitzel'],
  phone: '02981 12345',
  rating: 4.8,
  reviewCount: 38,
  reviews: [
    {
      id: 'rg1',
      authorName: 'Stefan K.',
      rating: 5,
      text: 'Tolles Frühstücksbuffet und sehr freundlicher Service direkt im Zentrum.',
      status: 'approved',
      date: '2026-10-20'
    }
  ],
  openingHours: {
    monday: '08:30 - 23:00',
    tuesday: '08:30 - 23:00',
    wednesday: '08:30 - 23:00',
    thursday: '08:30 - 23:00',
    friday: '08:30 - 00:00',
    saturday: '08:30 - 00:00',
    sunday: '09:00 - 22:00'
  }
};

const SAMPLE_BUSINESS_HANDWERK: Business = {
  id: 'sample-holzbau-sauerland',
  name: 'Sauerländer Holzbau & Bedachungen GmbH',
  category: 'Handwerk',
  subcategory: 'Zimmerei & Dachdeckerei',
  description: 'Ihr zuverlässiger Meisterbetrieb für Dachsanierungen, Holzrahmenbau, Carports und energetische Gebäudemodernisierung in Winterberg und Umgebung.',
  address: 'Hochsauerlandstraße 42',
  district: 'Siedlinghausen',
  city: 'Winterberg',
  isPremium: false,
  isVerified: true,
  headerImage: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1000&q=80',
  gallery: [
    'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&q=80'
  ],
  services: ['Dachsanierung', 'Holzrahmenbau', 'Carports & Vordächer', 'Energetische Beratung'],
  products: ['Dachfenster', 'Schieferarbeiten', 'Balkongeländer'],
  phone: '02983 56789',
  rating: 4.9,
  reviewCount: 9,
  reviews: [
    {
      id: 'rh1',
      authorName: 'Frank M.',
      rating: 5,
      text: 'Schnelle Umsetzung und saubere Meisterarbeit. Jederzeit wieder!',
      status: 'approved',
      date: '2026-08-15'
    }
  ],
  openingHours: {
    monday: '07:00 - 17:00',
    tuesday: '07:00 - 17:00',
    wednesday: '07:00 - 17:00',
    thursday: '07:00 - 17:00',
    friday: '07:00 - 14:00'
  }
};

export default function TestKachelPreview({
  designSettings,
  setDesignSettings,
  businesses = []
}: TestKachelPreviewProps) {
  const activeLayoutId: CardLayoutId = designSettings?.cardLayout || 'default';
  const [selectedSampleIndex, setSelectedSampleIndex] = useState<number>(0);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [savingLayout, setSavingLayout] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const sampleBusinesses = [
    { label: 'SICHTBAR SEO (Premium & Marketing)', icon: Sparkles, data: SAMPLE_BUSINESS_PREMIUM },
    { label: 'Café Extrablatt (Gastronomie & Fotos)', icon: UtensilsCrossed, data: SAMPLE_BUSINESS_GASTRO },
    { label: 'Sauerländer Holzbau (Handwerk & Meisterbetrieb)', icon: Wrench, data: SAMPLE_BUSINESS_HANDWERK }
  ];

  const currentSampleBusiness = sampleBusinesses[selectedSampleIndex]?.data || SAMPLE_BUSINESS_PREMIUM;

  const currentLayoutInfo = getCardLayoutInfo(activeLayoutId);

  // Filter layouts
  const filteredLayouts = CARD_LAYOUTS.filter(layout => {
    const matchesCategory = activeCategory === 'all' || layout.category === activeCategory;
    const matchesSearch = !searchQuery || 
      layout.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      layout.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      layout.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleActivateLayout = async (layoutId: CardLayoutId) => {
    try {
      setSavingLayout(layoutId);
      const updatedSettings: DesignSettings = {
        headlineFont: designSettings?.headlineFont || 'Manrope',
        bodyFont: designSettings?.bodyFont || 'Public Sans',
        headlineWeight: designSettings?.headlineWeight || 'bold',
        headlineLetterSpacing: designSettings?.headlineLetterSpacing || 'normal',
        presetId: designSettings?.presetId || 'modern-clean',
        headerDividers: designSettings?.headerDividers,
        customDividers: designSettings?.customDividers,
        categoryHeaders: designSettings?.categoryHeaders,
        cardLayout: layoutId
      };

      // 1. Update state
      if (setDesignSettings) {
        setDesignSettings(updatedSettings);
      }

      // 2. Update global card layout cache for instant rendering
      setGlobalCardLayout(layoutId);

      // 3. Persist to localStorage
      localStorage.setItem('siteDesignSettings', JSON.stringify(updatedSettings));

      // 4. Persist to Firestore
      await setDoc(doc(db, 'settings', 'design'), updatedSettings, { merge: true });

      const info = getCardLayoutInfo(layoutId);
      setToastMessage(`Layout "${info.name}" wurde erfolgreich aktiviert und ist jetzt live auf der Website!`);
      setTimeout(() => {
        setToastMessage(null);
      }, 4500);
    } catch (err) {
      console.error('Fehler beim Speichern des Layouts:', err);
      alert('Fehler beim Speichern des Layouts. Bitte versuche es erneut.');
    } finally {
      setSavingLayout(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0F4C2E] text-white px-5 py-3.5 rounded-xl shadow-2xl border-2 border-emerald-400/30 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5 duration-300">
          <CheckCircle2 className="w-5 h-5 text-emerald-300 shrink-0" />
          <span className="font-semibold text-sm">{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-white border border-[#EDE8E0] rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-[#F3F0EA]">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8F1EB] text-[#0F4C2E] text-xs font-bold uppercase tracking-wider mb-1">
              <Layers className="w-3.5 h-3.5" />
              <span>Kachel-Layout Manager · 15 Optionen</span>
            </div>
            <h2 className="font-display text-[26px] sm:text-[30px] font-bold text-[#1B211D] tracking-tight leading-tight">
              Design &amp; Layout der Unternehmenskacheln
            </h2>
            <p className="text-[14.5px] text-[#5F6B63] leading-relaxed">
              Hier kannst du aus 15 aufeinander abgestimmten Kachel-Layouts wählen. Klicke einfach bei deinem Favoriten auf <strong>„Dieses Layout aktivieren“</strong>, um es sofort für alle Unternehmenskacheln auf der gesamten Live-Website zu übernehmen.
            </p>
          </div>

          {/* Current Active Status Card */}
          <div className="bg-[#FAF8F5] border border-[#EDE8E0] rounded-xl p-4 sm:p-5 shrink-0 flex flex-col justify-between min-w-[280px]">
            <div className="text-xs text-[#8A928B] font-semibold uppercase tracking-wider mb-1">
              Aktuell aktives Design:
            </div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-bold text-[16px] text-[#1B211D]">
                {currentLayoutInfo.number} · {currentLayoutInfo.name}
              </span>
            </div>
            <div className="text-xs text-[#5F6B63] mb-3 line-clamp-2">
              {currentLayoutInfo.tagline}
            </div>
            {activeLayoutId !== 'default' && (
              <button
                type="button"
                onClick={() => handleActivateLayout('default')}
                disabled={savingLayout !== null}
                className="inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-[#0F4C2E] bg-white border border-[#EDE8E0] hover:bg-[#E8F1EB] px-3 py-2 rounded-lg transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Auf Standard-Layout zurücksetzen</span>
              </button>
            )}
          </div>
        </div>

        {/* Interactive Controls Bar */}
        <div className="pt-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 flex-wrap">
          {/* Sample Business Selector */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-[#8A928B] uppercase tracking-wider mr-1">
              Vorschau mit Betrieb:
            </span>
            {sampleBusinesses.map((sb, idx) => {
              const isSelected = selectedSampleIndex === idx;
              const Icon = sb.icon;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedSampleIndex(idx)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#0F4C2E] text-white shadow-xs'
                      : 'bg-[#FAF8F5] text-[#5F6B63] hover:text-[#1B211D] border border-[#EDE8E0]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{sb.label.split(' (')[0]}</span>
                </button>
              );
            })}
          </div>

          {/* Search Input */}
          <div className="relative min-w-[220px]">
            <Search className="w-4 h-4 text-[#8A928B] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Layout durchsuchen..."
              className="w-full pl-9 pr-3 py-1.5 bg-[#FAF8F5] border border-[#EDE8E0] rounded-lg text-xs text-[#1B211D] focus:outline-none focus:border-[#0F4C2E] transition-colors"
            />
          </div>
        </div>

        {/* Category Tabs */}
        <div className="mt-4 pt-4 border-t border-[#F3F0EA] flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {CARD_LAYOUT_CATEGORIES.map((cat) => {
            const isCatActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  isCatActive
                    ? 'bg-[#1B211D] text-white'
                    : 'text-[#5F6B63] hover:text-[#1B211D] hover:bg-[#FAF8F5]'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid of all 15 Layout Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredLayouts.map((layout) => {
          const isCurrentActive = activeLayoutId === layout.id;
          const isBeingSaved = savingLayout === layout.id;

          return (
            <div
              key={layout.id}
              className={`bg-white rounded-2xl border transition-all flex flex-col justify-between overflow-hidden ${
                isCurrentActive
                  ? 'border-2 border-[#0F4C2E] ring-4 ring-[#0F4C2E]/10 shadow-lg'
                  : 'border-[#EDE8E0] hover:border-[#0F4C2E]/40 shadow-xs hover:shadow-md'
              }`}
            >
              {/* Layout Header Info */}
              <div className="p-5 pb-4 border-b border-[#F3F0EA] bg-[#FAF8F5]">
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-white border border-[#EDE8E0] text-[#5F6B63]">
                      #{layout.number}
                    </span>
                    <h3 className="font-display text-[17px] font-bold text-[#1B211D]">
                      {layout.name}
                    </h3>
                  </div>

                  <span className={`text-[10.5px] font-bold px-2.5 py-0.5 rounded-full ${layout.badgeColor || 'bg-stone-200 text-stone-800'}`}>
                    {layout.badge}
                  </span>
                </div>

                <p className="text-[12.5px] text-[#5F6B63] leading-snug m-0">
                  {layout.tagline}
                </p>
              </div>

              {/* Live Preview Container */}
              <div className="p-5 bg-gradient-to-b from-[#F7F5F0]/60 to-white flex-1 flex flex-col justify-center">
                <div className="w-full max-w-[420px] mx-auto pointer-events-none select-none">
                  <BusinessCard
                    business={currentSampleBusiness}
                    layout={layout.id}
                    onClick={() => {}}
                  />
                </div>

                {/* Features & Recommendation Box */}
                <div className="mt-5 pt-4 border-t border-[#EDE8E0] space-y-2">
                  <div className="text-[11.5px] text-[#8A928B] leading-relaxed">
                    <strong className="text-[#1B211D]">Empfohlen für:</strong> {layout.recommendedFor}
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {layout.features.map((feat, fIdx) => (
                      <span key={fIdx} className="text-[10.5px] bg-[#FAF8F5] border border-[#EDE8E0] text-[#5F6B63] px-2 py-0.5 rounded font-medium">
                        {feat}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Button Footer */}
              <div className="p-4 bg-white border-t border-[#F3F0EA]">
                {isCurrentActive ? (
                  <div className="w-full bg-[#E8F1EB] text-[#0F4C2E] border-2 border-[#0F4C2E]/40 py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs">
                    <CheckCircle2 className="w-4 h-4 text-[#0F4C2E]" />
                    <span>Auf der Website aktiv</span>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleActivateLayout(layout.id)}
                    disabled={savingLayout !== null}
                    className="w-full bg-[#0F4C2E] hover:bg-[#06301C] text-white py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs hover:shadow-md active:scale-[0.99] disabled:opacity-50"
                  >
                    {isBeingSaved ? (
                      <span>Wird aktiviert...</span>
                    ) : (
                      <>
                        <span>Dieses Layout aktivieren</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredLayouts.length === 0 && (
        <div className="py-16 text-center bg-white border border-[#EDE8E0] rounded-2xl">
          <p className="text-base font-semibold text-[#1B211D]">Kein Layout gefunden</p>
          <p className="text-xs text-[#8A928B] mt-1">Passe deine Suchbegriffe oder Filter an.</p>
          <button
            type="button"
            onClick={() => { setActiveCategory('all'); setSearchQuery(''); }}
            className="mt-4 px-4 py-2 bg-[#FAF8F5] border border-[#EDE8E0] rounded-lg text-xs font-bold text-[#0F4C2E] hover:bg-[#E8F1EB]"
          >
            Filter zurücksetzen
          </button>
        </div>
      )}
    </div>
  );
}
