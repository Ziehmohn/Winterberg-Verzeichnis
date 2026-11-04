import React, { useState } from 'react';
import { 
  Sparkles, 
  Camera, 
  Check, 
  Save, 
  RotateCcw, 
  Eye, 
  Image as ImageIcon, 
  Sliders, 
  Layout, 
  Info, 
  ExternalLink,
  Layers,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { DesignSettings, ThemeConfig, HomeHeroConfig, HomeHeroStyle } from '../types';
import { db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { 
  HOME_HERO_STYLES, 
  DEFAULT_HOME_HERO_CONFIG, 
  getEffectiveHomeHeroConfig 
} from '../utils/homeHeroOptions';

interface AdminHeroHeaderManagerProps {
  designSettings: DesignSettings;
  setDesignSettings: (settings: DesignSettings) => void;
  theme?: ThemeConfig;
  activeThemeKey?: string;
  onNavigateHome?: () => void;
}

export const AdminHeroHeaderManager: React.FC<AdminHeroHeaderManagerProps> = ({
  designSettings,
  setDesignSettings,
  onNavigateHome
}) => {
  const currentConfig = getEffectiveHomeHeroConfig(designSettings);

  const [formData, setFormData] = useState<HomeHeroConfig>(currentConfig);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [activeTab, setActiveTab] = useState<'styles' | 'settings' | 'preview'>('styles');

  // Handle style select
  const handleSelectStyle = (styleId: HomeHeroStyle) => {
    setFormData(prev => ({ ...prev, style: styleId }));
  };

  // Save to Firestore and LocalStorage
  const handleSave = async () => {
    setSaveStatus('saving');
    try {
      const updatedSettings: DesignSettings = {
        ...designSettings,
        homeHero: formData
      };

      setDesignSettings(updatedSettings);
      localStorage.setItem('siteDesignSettings', JSON.stringify(updatedSettings));
      await setDoc(doc(db, 'settings', 'design'), updatedSettings, { merge: true });

      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (err) {
      console.error('Error saving hero header settings:', err);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 4000);
    }
  };

  // Reset to default
  const handleReset = () => {
    if (window.confirm('Möchtest du die Hero-Header-Einstellungen wirklich auf den empfohlenen Standard zurücksetzen?')) {
      setFormData(DEFAULT_HOME_HERO_CONFIG);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Action Controls */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-emerald-100 text-[#0F4C2E] text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <Layout className="w-3.5 h-3.5" /> Startseite Hero & Header
            </span>
            <span className="text-gray-400 text-xs">•</span>
            <span className="text-xs text-gray-500 font-medium">10 gestaltete Optionen</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
            Startseiten-Header & Hero Image
          </h2>
          <p className="text-sm text-gray-600 mt-1 max-w-2xl">
            Wähle aus 10 sorgfältig ausgearbeiteten Layout-Stilen für den Einstiegsbereich der Startseite. 
            Alle Stile präsentieren das Panorama von Stefan Peters mit hoher Schärfe, ohne milchigen Schleier und inklusive Urheberhinweis.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap shrink-0">
          <button
            type="button"
            onClick={handleReset}
            className="px-3.5 py-2 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Auf empfohlenen Standard zurücksetzen"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Zurücksetzen</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={saveStatus === 'saving'}
            className="px-5 py-2 text-xs font-bold text-white bg-[#0F4C2E] hover:bg-[#0B3B24] rounded-lg shadow-sm flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
          >
            {saveStatus === 'saving' ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin" />
                <span>Wird gespeichert...</span>
              </>
            ) : saveStatus === 'saved' ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                <span>Erfolgreich gespeichert!</span>
              </>
            ) : saveStatus === 'error' ? (
              <>
                <AlertCircle className="w-4 h-4 text-rose-300" />
                <span>Fehler beim Speichern</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Design speichern & live schalten</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-3">
        <button
          type="button"
          onClick={() => setActiveTab('styles')}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'styles'
              ? 'bg-[#0F4C2E] text-white shadow-xs'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>1. Design-Optionen ({HOME_HERO_STYLES.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'settings'
              ? 'bg-[#0F4C2E] text-white shadow-xs'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>2. Bild, Urheber & Texte</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('preview')}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'preview'
              ? 'bg-[#0F4C2E] text-white shadow-xs'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          <Eye className="w-4 h-4" />
          <span>3. Live-Vorschau</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: 10 DESIGN-OPTIONEN                                */}
      {/* ======================================================== */}
      {activeTab === 'styles' && (
        <div className="space-y-4">
          <div className="text-sm text-gray-500 flex items-center justify-between">
            <span>Klicke auf eine Karte, um den Stil sofort auszuwählen:</span>
            <span className="font-semibold text-emerald-800">
              Aktuell aktiv: {HOME_HERO_STYLES.find(s => s.id === formData.style)?.name}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {HOME_HERO_STYLES.map((item) => {
              const isSelected = formData.style === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => handleSelectStyle(item.id)}
                  className={`group relative rounded-2xl border-2 transition-all cursor-pointer p-5 flex flex-col justify-between ${
                    isSelected
                      ? 'border-[#0F4C2E] bg-emerald-50/40 shadow-md ring-2 ring-[#0F4C2E]/20'
                      : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-xs'
                  }`}
                >
                  {/* Top Badges & Check */}
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${item.badgeColor}`}>
                        {item.badge}
                      </span>
                      {isSelected ? (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-[#0F4C2E] bg-emerald-100 px-2.5 py-1 rounded-full">
                          <Check className="w-3.5 h-3.5 stroke-[3]" /> Aktiviert
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400 group-hover:text-gray-700 font-medium">
                          Klicken zum Auswählen
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-bold text-gray-900 group-hover:text-[#0F4C2E] transition-colors mb-1">
                      {item.name}
                    </h3>

                    <p className="text-xs font-semibold text-emerald-800 mb-2 leading-snug">
                      {item.tagline}
                    </p>

                    <p className="text-xs text-gray-600 leading-relaxed mb-4">
                      {item.description}
                    </p>
                  </div>

                  {/* Highlights Pills */}
                  <div className="pt-3 border-t border-gray-100">
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {item.highlights.map((h, i) => (
                        <span key={i} className="text-[10px] font-medium bg-gray-100 text-gray-700 px-2 py-0.5 rounded-md">
                          ✓ {h}
                        </span>
                      ))}
                    </div>

                    {/* Visual Layout Mockup Bar */}
                    <div className="w-full h-10 rounded-lg overflow-hidden border border-gray-200 bg-gray-100 flex items-center p-1 gap-1">
                      {item.id === 'split-gradient-badge' && (
                        <>
                          <div className="h-full w-[55%] bg-[#0F4C2E] rounded flex items-center px-2 text-[9px] text-white font-medium">
                            Text & Suche
                          </div>
                          <div className="h-full w-[45%] bg-cover bg-center rounded relative" style={{ backgroundImage: `url(${formData.imageUrl || '/winterberg-hero-stefan-peters.jpg'})` }}>
                            <div className="absolute top-1 right-1 bg-black/60 text-[7px] text-white px-1 rounded">Foto-Credit</div>
                          </div>
                        </>
                      )}
                      {item.id === 'split-card-glow' && (
                        <>
                          <div className="h-full w-[60%] bg-[#0B3B24] rounded flex items-center px-2 text-[9px] text-white">
                            Content
                          </div>
                          <div className="h-full w-[40%] p-0.5">
                            <div className="w-full h-full rounded border border-white bg-cover bg-center shadow-xs" style={{ backgroundImage: `url(${formData.imageUrl || '/winterberg-hero-stefan-peters.jpg'})` }} />
                          </div>
                        </>
                      )}
                      {item.id === 'cinematic-overlay' && (
                        <div className="w-full h-full bg-cover bg-center rounded relative flex items-center px-2" style={{ backgroundImage: `url(${formData.imageUrl || '/winterberg-hero-stefan-peters.jpg'})` }}>
                          <div className="absolute inset-0 bg-gradient-to-r from-[#0F4C2E] via-[#0F4C2E]/70 to-transparent rounded" />
                          <span className="relative z-10 text-[9px] text-white font-medium">Vollbild mit Leseverlauf</span>
                        </div>
                      )}
                      {item.id === 'split-diagonal-cut' && (
                        <div className="w-full h-full relative rounded overflow-hidden flex">
                          <div className="w-[55%] h-full bg-[#0F4C2E] text-[9px] text-white flex items-center px-2">Schräge Kante</div>
                          <div className="w-[45%] h-full bg-cover bg-center" style={{ backgroundImage: `url(${formData.imageUrl || '/winterberg-hero-stefan-peters.jpg'})` }} />
                        </div>
                      )}
                      {item.id === 'magazine-editorial' && (
                        <>
                          <div className="h-full w-[65%] bg-[#0B3722] rounded flex items-center px-2 text-[9px] text-white">Redaktionell</div>
                          <div className="h-full w-[35%] bg-white p-0.5 rounded shadow-xs">
                            <div className="w-full h-full bg-cover bg-center rounded-xs" style={{ backgroundImage: `url(${formData.imageUrl || '/winterberg-hero-stefan-peters.jpg'})` }} />
                          </div>
                        </>
                      )}
                      {item.id === 'panoramic-compact' && (
                        <div className="w-full h-full flex flex-col">
                          <div className="h-[60%] w-full bg-cover bg-center rounded-t" style={{ backgroundImage: `url(${formData.imageUrl || '/winterberg-hero-stefan-peters.jpg'})` }} />
                          <div className="h-[40%] w-full bg-[#0F4C2E] rounded-b flex items-center px-2 text-[8px] text-white">Panoramabalken & Suche</div>
                        </div>
                      )}
                      {item.id === 'split-curved-arch' && (
                        <>
                          <div className="h-full w-[65%] bg-[#0F4C2E] rounded flex items-center px-2 text-[9px] text-white">Boutique</div>
                          <div className="h-full w-[35%] flex justify-center">
                            <div className="h-full w-[80%] rounded-t-full bg-cover bg-center border border-white" style={{ backgroundImage: `url(${formData.imageUrl || '/winterberg-hero-stefan-peters.jpg'})` }} />
                          </div>
                        </>
                      )}
                      {item.id === 'glassmorphism-card' && (
                        <div className="w-full h-full bg-cover bg-center rounded relative flex items-center p-1" style={{ backgroundImage: `url(${formData.imageUrl || '/winterberg-hero-stefan-peters.jpg'})` }}>
                          <div className="w-[70%] h-full bg-black/60 backdrop-blur-xs border border-white/20 rounded flex items-center px-2 text-[8px] text-white">
                            Frosted Glass
                          </div>
                        </div>
                      )}
                      {item.id === 'minimal-side-by-side' && (
                        <>
                          <div className="h-full w-[50%] bg-[#0F4C2E] rounded-l flex items-center px-2 text-[9px] text-white">50% Text</div>
                          <div className="h-full w-[50%] bg-cover bg-center rounded-r" style={{ backgroundImage: `url(${formData.imageUrl || '/winterberg-hero-stefan-peters.jpg'})` }} />
                        </>
                      )}
                      {item.id === 'immersive-gradient-fade' && (
                        <div className="w-full h-full bg-cover bg-center rounded relative flex items-center px-2" style={{ backgroundImage: `url(${formData.imageUrl || '/winterberg-hero-stefan-peters.jpg'})` }}>
                          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0F4C2E]/60 to-[#0F4C2E] rounded" />
                          <span className="relative z-10 text-[9px] text-white font-medium">Horizont-Verlauf</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: BILD, URHEBER & TEXTE                             */}
      {/* ======================================================== */}
      {activeTab === 'settings' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-5">
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <Camera className="w-5 h-5 text-[#0F4C2E]" />
              <span>Header-Bild & Urheber-Angabe</span>
            </h3>

            {/* Image Preview & URL */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="md:col-span-1">
                <label className="block text-xs font-semibold text-gray-700 mb-2">Vorschau des Header-Bildes</label>
                <div className="relative rounded-xl overflow-hidden border border-gray-200 shadow-xs aspect-[16/10] bg-gray-100">
                  <img
                    src={formData.imageUrl || '/winterberg-hero-stefan-peters.jpg'}
                    alt="Header Preview"
                    className="w-full h-full object-cover"
                    style={{ objectPosition: formData.objectPosition || 'center 40%' }}
                  />
                  {formData.showCredit && (
                    <div className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded-full backdrop-blur-xs flex items-center gap-1">
                      <Camera className="w-2.5 h-2.5 text-[#F2761B]" />
                      <span>{formData.credit || 'Ferienwelt Winterberg / Stefan Peters'}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="md:col-span-2 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Bild-URL (Pfad oder Web-Adresse)</label>
                  <input
                    type="text"
                    value={formData.imageUrl || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                    placeholder="/winterberg-hero-stefan-peters.jpg"
                    className="w-full text-xs font-mono px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F4C2E] focus:outline-none"
                  />
                  
                  {/* Preset quick buttons */}
                  <div className="flex items-center gap-2 mt-2 flex-wrap text-xs">
                    <span className="text-gray-500 font-medium">Schnellauswahl:</span>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, imageUrl: '/winterberg-hero-stefan-peters.jpg' }))}
                      className="px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded-md border border-emerald-200 hover:bg-emerald-100 transition-colors cursor-pointer text-xs font-medium"
                    >
                      Lokales Stefan-Peters-Foto (Empfohlen)
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, imageUrl: 'https://www.winterberg.de/fileadmin/user_upload/Winterberg/Tourismus/Service___Kontakt/Presse___Newsroom/Bilddatenbank/Winterberg/WINTERBERG_AUGUST_2023_TEIL1_STEPHANPETERSDESIGN.DE-072.jpg' }))}
                      className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors cursor-pointer text-xs"
                    >
                      Winterberg.de Original-URL
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Bildfokus / Vertikale Ausrichtung</label>
                    <select
                      value={formData.objectPosition || 'center 40%'}
                      onChange={(e) => setFormData(prev => ({ ...prev, objectPosition: e.target.value }))}
                      className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg bg-white cursor-pointer focus:ring-2 focus:ring-[#0F4C2E] focus:outline-none"
                    >
                      <option value="center 40%">Mitte 40% (Optimal für Landschaft & Berge)</option>
                      <option value="center center">Zentriert (50%)</option>
                      <option value="center top">Oberer Bereich (Himmel & Weite)</option>
                      <option value="center 65%">Unterer Bereich (Details)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Urheber / Fotograf-Angabe</label>
                    <input
                      type="text"
                      value={formData.credit || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, credit: e.target.value }))}
                      placeholder="Ferienwelt Winterberg / Stefan Peters"
                      className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F4C2E] focus:outline-none"
                    />
                  </div>
                </div>

                {/* Toggle Show Credit */}
                <div className="flex items-center gap-3 pt-2">
                  <input
                    type="checkbox"
                    id="toggle-show-credit"
                    checked={formData.showCredit ?? true}
                    onChange={(e) => setFormData(prev => ({ ...prev, showCredit: e.target.checked }))}
                    className="w-4 h-4 text-[#0F4C2E] rounded border-gray-300 focus:ring-[#0F4C2E] cursor-pointer"
                  />
                  <label htmlFor="toggle-show-credit" className="text-xs font-medium text-gray-700 cursor-pointer">
                    Urheberhinweis-Badge auf dem Header-Bild anzeigen (wird für Bildrechte empfohlen)
                  </label>
                </div>

              </div>

            </div>
          </div>

          {/* Header Content Toggles */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <Sliders className="w-5 h-5 text-[#0F4C2E]" />
              <span>Zusätzliche Header-Elemente & Texte</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Oberer Badge-Text (Deutsch)</label>
                <input
                  type="text"
                  value={formData.badgeText || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, badgeText: e.target.value }))}
                  placeholder="Winterberg & Region • Das offizielle Branchenverzeichnis"
                  className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F4C2E] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Oberer Badge-Text (Niederländisch)</label>
                <input
                  type="text"
                  value={formData.badgeTextNl || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, badgeTextNl: e.target.value }))}
                  placeholder="Winterberg & Regio • De officiële bedrijvengids"
                  className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F4C2E] focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="toggle-show-stats"
                  checked={formData.showStats ?? true}
                  onChange={(e) => setFormData(prev => ({ ...prev, showStats: e.target.checked }))}
                  className="w-4 h-4 text-[#0F4C2E] rounded border-gray-300 focus:ring-[#0F4C2E] cursor-pointer"
                />
                <label htmlFor="toggle-show-stats" className="text-xs font-medium text-gray-700 cursor-pointer">
                  Statistiken anzeigen (Unternehmen, Kategorien, 14 Ortsteile)
                </label>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="toggle-show-popular"
                  checked={formData.showPopularSearches ?? true}
                  onChange={(e) => setFormData(prev => ({ ...prev, showPopularSearches: e.target.checked }))}
                  className="w-4 h-4 text-[#0F4C2E] rounded border-gray-300 focus:ring-[#0F4C2E] cursor-pointer"
                />
                <label htmlFor="toggle-show-popular" className="text-xs font-medium text-gray-700 cursor-pointer">
                  Schnellsuche-Pills anzeigen (z.B. Handwerker, Restaurant, Notdienst)
                </label>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: LIVE-VORSCHAU                                      */}
      {/* ======================================================== */}
      {activeTab === 'preview' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-xs flex items-center justify-between">
            <span className="text-xs text-gray-600 font-medium">
              Ausgewählter Stil: <strong className="text-gray-900">{HOME_HERO_STYLES.find(s => s.id === formData.style)?.name}</strong>
            </span>
            {onNavigateHome && (
              <button
                type="button"
                onClick={onNavigateHome}
                className="text-xs text-[#0F4C2E] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
              >
                <span>Ganze Startseite öffnen</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Mini Live Preview Container */}
          <div className="rounded-2xl overflow-hidden border border-gray-300 shadow-xl bg-gray-900 relative">
            <div className="p-2 bg-gray-800 text-gray-400 text-[11px] flex items-center justify-between border-b border-gray-700 px-4">
              <span>Simulation: Startseite Desktop Ansicht</span>
              <span className="text-emerald-400 font-medium">Live gerendert</span>
            </div>

            {/* Scaled preview simulation */}
            <div className="relative text-white overflow-hidden bg-gradient-to-br from-[#0B3B24] via-[#0F4C2E] to-[#176239] min-h-[380px] p-6 sm:p-10 flex flex-col justify-center">
              
              {/* Neueröffnung Layout */}
              {formData.style === 'split-gradient-badge' && (
                <>
                  <div className="absolute right-0 top-0 bottom-0 w-[48%] pointer-events-none overflow-hidden">
                    <img
                      src={formData.imageUrl || '/winterberg-hero-stefan-peters.jpg'}
                      alt="Preview"
                      className="w-full h-full object-cover hero-party-mask"
                      style={{ objectPosition: formData.objectPosition || 'center 40%' }}
                    />
                    {formData.showCredit && (
                      <div className="absolute top-4 right-4 bg-black/60 text-[10px] text-white px-2.5 py-1 rounded-full border border-white/20 flex items-center gap-1">
                        <Camera className="w-2.5 h-2.5 text-[#F2761B]" />
                        <span>Foto: {formData.credit || 'Stefan Peters'}</span>
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* Floating Card Layout */}
              {formData.style === 'split-card-glow' && (
                <div className="absolute right-6 top-6 bottom-6 w-[38%] pointer-events-none hidden md:block">
                  <div className="w-full h-full rounded-2xl border border-white/30 p-1.5 bg-white/10 backdrop-blur-md shadow-2xl">
                    <img
                      src={formData.imageUrl || '/winterberg-hero-stefan-peters.jpg'}
                      alt="Preview"
                      className="w-full h-full object-cover rounded-xl"
                      style={{ objectPosition: formData.objectPosition || 'center 40%' }}
                    />
                  </div>
                </div>
              )}

              {/* Cinematic Full Overlay */}
              {formData.style === 'cinematic-overlay' && (
                <div 
                  className="absolute inset-0 bg-cover bg-center pointer-events-none"
                  style={{ backgroundImage: `url(${formData.imageUrl || '/winterberg-hero-stefan-peters.jpg'})` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-[#062617] via-[#0A3821]/90 to-transparent" />
                </div>
              )}

              {/* Preview Content */}
              <div className="relative z-10 max-w-xl">
                <div className="inline-flex items-center gap-1.5 bg-white/15 border border-white/20 px-3 py-0.5 rounded-full text-[11px] font-bold text-amber-300 mb-3">
                  <span>{formData.badgeText || 'Winterberg & Region • Das offizielle Branchenverzeichnis'}</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-extrabold mb-2 leading-tight">
                  Das <span className="text-[#F2761B]">WINTERBERG</span> Verzeichnis
                </h1>
                <p className="text-xs sm:text-sm text-white/90 mb-4 max-w-md">
                  Entdecke Unternehmen, Dienstleister, Handwerker und Freizeiteinrichtungen in Winterberg und den 14 Ortsteilen.
                </p>

                {/* Fake Search bar */}
                <div className="bg-white rounded-lg p-2 flex items-center gap-2 max-w-md shadow-xl text-gray-800 text-xs">
                  <span className="text-gray-400 pl-2">🔍 Was suchst du in Winterberg?</span>
                  <div className="ml-auto bg-[#F2761B] text-white px-4 py-1.5 rounded-md font-bold">
                    Suchen
                  </div>
                </div>

                {formData.showStats && (
                  <div className="flex gap-6 mt-6 text-xs text-white/80">
                    <div><strong className="text-base text-white">400+</strong> Betriebe</div>
                    <div><strong className="text-base text-white">15+</strong> Kategorien</div>
                    <div><strong className="text-base text-white">14</strong> Ortsteile</div>
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminHeroHeaderManager;
