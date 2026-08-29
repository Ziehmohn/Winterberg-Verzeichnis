import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Sparkles, 
  MapPin, 
  Phone, 
  Globe, 
  CheckCircle2, 
  Star, 
  Building2, 
  UtensilsCrossed, 
  Wrench, 
  Layers, 
  Sliders, 
  Type
} from 'lucide-react';
import { ThemeConfig } from '../types';

export default function TestPage({ theme, activeThemeKey }: { theme: ThemeConfig; activeThemeKey: string }) {
  const [headlineFont, setHeadlineFont] = useState<'manrope' | 'outfit' | 'jakarta' | 'sans'>('manrope');
  const [fontWeight, setFontWeight] = useState<'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold'>('bold');
  const [letterSpacing, setLetterSpacing] = useState<'normal' | 'tight' | 'wide'>('normal');

  const fontFamilies = {
    manrope: "'Manrope', sans-serif",
    outfit: "'Outfit', sans-serif",
    jakarta: "'Plus Jakarta Sans', sans-serif",
    sans: "'Public Sans', sans-serif"
  };

  const fontWeights = {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800'
  };

  const letterSpacings = {
    tight: '-0.025em',
    normal: '0em',
    wide: '0.03em'
  };

  const dynamicHeadlineStyle = {
    fontFamily: fontFamilies[headlineFont],
    fontWeight: fontWeights[fontWeight],
    letterSpacing: letterSpacings[letterSpacing]
  };

  return (
    <main className="flex-1 w-full max-w-[1180px] mx-auto px-4 sm:px-6 py-10 pb-24">
      {/* Top Navigation / Breadcrumb */}
      <div className="flex items-center justify-between gap-4 mb-8">
        <a 
          href="/" 
          onClick={(e) => {
            e.preventDefault();
            window.history.pushState(null, '', '/');
            window.dispatchEvent(new Event('popstate'));
          }}
          className="inline-flex items-center gap-2 text-sm font-medium text-[#4A544D] hover:text-[#0F4C2E] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Zurück zur Startseite
        </a>

        <div className="inline-flex items-center gap-2 bg-[#FAF8F5] border border-[#E7E2DA] px-3 py-1 rounded-md text-xs font-semibold text-[#8A928B]">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Versteckte Testseite (/test)
        </div>
      </div>

      {/* Floating / Sticky Font Control Panel */}
      <section className="bg-white border border-[#EDE8E0] rounded-lg p-5 mb-12 shadow-[0_4px_20px_rgba(27,33,29,0.06)]">
        <div className="flex items-center gap-2.5 pb-4 border-b border-[#F3F0EA] mb-4">
          <Sliders className="w-5 h-5 text-[#F2761B]" />
          <h2 className="font-display text-lg font-bold text-[#1B211D] m-0">
            Typografie- &amp; Font-Labor
          </h2>
          <span className="ml-auto text-xs text-[#8A928B] bg-[#FAF8F5] px-2.5 py-1 rounded border border-[#EDE8E0]">
            Aktiver Headline-Font: <strong className="text-[#0F4C2E] uppercase">{headlineFont}</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Font Family Switcher */}
          <div>
            <label className="block text-xs font-bold text-[#5F6B63] uppercase tracking-wider mb-2">
              Schriftart für Überschriften
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setHeadlineFont('manrope')}
                className={`px-3 py-2 text-sm rounded-md font-medium border text-left transition-all ${
                  headlineFont === 'manrope'
                    ? 'bg-[#0F4C2E] text-white border-[#0F4C2E] shadow-sm'
                    : 'bg-[#FAF8F5] text-[#1B211D] border-[#E7E2DA] hover:bg-white'
                }`}
                style={{ fontFamily: "'Manrope', sans-serif" }}
              >
                Manrope (Standard)
              </button>
              <button
                type="button"
                onClick={() => setHeadlineFont('outfit')}
                className={`px-3 py-2 text-sm rounded-md font-medium border text-left transition-all ${
                  headlineFont === 'outfit'
                    ? 'bg-[#0F4C2E] text-white border-[#0F4C2E] shadow-sm'
                    : 'bg-[#FAF8F5] text-[#1B211D] border-[#E7E2DA] hover:bg-white'
                }`}
                style={{ fontFamily: "'Outfit', sans-serif" }}
              >
                Outfit (Aktuell)
              </button>
            </div>
          </div>

          {/* Font Weight Switcher */}
          <div>
            <label className="block text-xs font-bold text-[#5F6B63] uppercase tracking-wider mb-2">
              Schriftschnitt (Font-Weight)
            </label>
            <div className="flex gap-1.5 flex-wrap">
              {(['medium', 'semibold', 'bold', 'extrabold'] as const).map((w) => (
                <button
                  key={w}
                  type="button"
                  onClick={() => setFontWeight(w)}
                  className={`px-3 py-2 text-xs rounded-md capitalize border transition-all ${
                    fontWeight === w
                      ? 'bg-[#F2761B] text-white border-[#F2761B] font-bold shadow-sm'
                      : 'bg-[#FAF8F5] text-[#1B211D] border-[#E7E2DA] hover:bg-white'
                  }`}
                >
                  {w} ({fontWeights[w]})
                </button>
              ))}
            </div>
          </div>

          {/* Letter Spacing Switcher */}
          <div>
            <label className="block text-xs font-bold text-[#5F6B63] uppercase tracking-wider mb-2">
              Zeichenabstand (Letter-Spacing)
            </label>
            <div className="flex gap-1.5">
              {(['tight', 'normal', 'wide'] as const).map((ls) => (
                <button
                  key={ls}
                  type="button"
                  onClick={() => setLetterSpacing(ls)}
                  className={`flex-1 px-3 py-2 text-xs rounded-md capitalize border transition-all ${
                    letterSpacing === ls
                      ? 'bg-[#1B211D] text-white border-[#1B211D] font-bold shadow-sm'
                      : 'bg-[#FAF8F5] text-[#1B211D] border-[#E7E2DA] hover:bg-white'
                  }`}
                >
                  {ls}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Hero Showcase Section */}
      <section className="bg-white border border-[#EDE8E0] rounded-lg p-8 md:p-12 mb-12 shadow-[0_6px_24px_rgba(27,33,29,0.05)] relative overflow-hidden">
        <div className="inline-flex items-center gap-2 bg-[#E8F1EB] text-[#0F4C2E] border border-[#C2DBCB] rounded-md px-3.5 py-1.5 text-xs font-bold tracking-wide uppercase mb-6">
          <Sparkles className="w-3.5 h-3.5 text-[#F2761B]" />
          Typischer Seitenaufbau &amp; Headlines in Manrope
        </div>

        <h1 
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[#0F4C2E] mb-6 leading-[1.12]"
          style={dynamicHeadlineStyle}
        >
          Das Verzeichnis für Handwerk, Handel &amp; Gastronomie in Winterberg
        </h1>

        <p className="text-lg md:text-xl text-[#4A544D] leading-relaxed max-w-3xl mb-8">
          Hier entsteht die zentrale digitale Anlaufstelle für Einheimische und Gäste. 
          Entdecken Sie geprüfte Fachbetriebe, Öffnungszeiten, Kontaktdaten und regionale Neuigkeiten aus allen 14 Ortsteilen.
        </p>

        <div className="flex flex-wrap gap-3.5 items-center">
          <button 
            type="button" 
            className="bg-[#0F4C2E] hover:bg-[#06301C] text-white font-semibold px-6 py-3 rounded-md text-sm transition-colors shadow-md"
            style={{ fontFamily: dynamicHeadlineStyle.fontFamily }}
          >
            Unternehmen durchsuchen
          </button>
          <button 
            type="button" 
            className="bg-[#F2761B] hover:bg-[#D65F0C] text-white font-semibold px-6 py-3 rounded-md text-sm transition-colors shadow-md"
            style={{ fontFamily: dynamicHeadlineStyle.fontFamily }}
          >
            Kostenlos eintragen
          </button>
          <button 
            type="button" 
            className="bg-transparent border border-[#EDE8E0] hover:bg-[#FAF8F5] text-[#1B211D] font-semibold px-6 py-3 rounded-md text-sm transition-colors"
          >
            Sekundärer Button
          </button>
        </div>
      </section>

      {/* Grid of UI Cards (Mock Business / Content Cards) */}
      <section className="mb-14">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 
              className="text-2xl md:text-3xl text-[#1B211D] mb-1"
              style={dynamicHeadlineStyle}
            >
              Beispielhafte Unternehmenskarten
            </h2>
            <p className="text-sm text-[#5F6B63] m-0">
              Vorschau mit dem gewählten Headline-Font auf verschiedenen Kartenkomponenten.
            </p>
          </div>
          <span className="text-xs text-[#8A928B]">3 Musterkarten</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Gastronomie */}
          <div className="bg-white border border-[#EDE8E0] rounded-lg p-6 flex flex-col justify-between shadow-[0_2px_10px_rgba(27,33,29,0.04)] hover:shadow-[0_12px_30px_rgba(27,33,29,0.08)] transition-all">
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
                className="text-xl text-[#1B211D] mb-2 leading-snug"
                style={dynamicHeadlineStyle}
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

          {/* Card 2: Handwerk */}
          <div className="bg-white border border-[#EDE8E0] rounded-lg p-6 flex flex-col justify-between shadow-[0_2px_10px_rgba(27,33,29,0.04)] hover:shadow-[0_12px_30px_rgba(27,33,29,0.08)] transition-all">
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
                className="text-xl text-[#1B211D] mb-2 leading-snug"
                style={dynamicHeadlineStyle}
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

          {/* Card 3: Dienstleistung */}
          <div className="bg-white border border-[#EDE8E0] rounded-lg p-6 flex flex-col justify-between shadow-[0_2px_10px_rgba(27,33,29,0.04)] hover:shadow-[0_12px_30px_rgba(27,33,29,0.08)] transition-all">
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
                className="text-xl text-[#1B211D] mb-2 leading-snug"
                style={dynamicHeadlineStyle}
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

      {/* Typography Scale & Article Specimen */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Hierarchy Overview */}
        <div className="bg-white border border-[#EDE8E0] rounded-lg p-8 shadow-[0_2px_10px_rgba(27,33,29,0.04)]">
          <div className="flex items-center gap-2 mb-6 pb-3 border-b border-[#F3F0EA]">
            <Type className="w-5 h-5 text-[#0F4C2E]" />
            <h2 className="font-display text-xl font-bold m-0 text-[#1B211D]">
              Hierarchie &amp; Schriftgrößen
            </h2>
          </div>

          <div className="space-y-6">
            <div>
              <span className="text-[11px] font-bold text-[#8A928B] uppercase tracking-wider block mb-1">Headline H1 (36px - 48px)</span>
              <h1 className="text-3xl md:text-4xl text-[#0F4C2E] leading-tight m-0" style={dynamicHeadlineStyle}>
                Winterberg erleben und entdecken
              </h1>
            </div>

            <div>
              <span className="text-[11px] font-bold text-[#8A928B] uppercase tracking-wider block mb-1">Headline H2 (28px - 32px)</span>
              <h2 className="text-2xl md:text-3xl text-[#1B211D] leading-snug m-0" style={dynamicHeadlineStyle}>
                Zentrale Anlaufstelle für Unternehmen
              </h2>
            </div>

            <div>
              <span className="text-[11px] font-bold text-[#8A928B] uppercase tracking-wider block mb-1">Headline H3 (22px - 24px)</span>
              <h3 className="text-xl md:text-2xl text-[#1B211D] leading-snug m-0" style={dynamicHeadlineStyle}>
                Premium-Eintrag mit vielen Vorteilen
              </h3>
            </div>

            <div>
              <span className="text-[11px] font-bold text-[#8A928B] uppercase tracking-wider block mb-1">Headline H4 (18px - 20px)</span>
              <h4 className="text-lg text-[#1B211D] leading-snug m-0" style={dynamicHeadlineStyle}>
                Persönlicher Kundenservice &amp; Support
              </h4>
            </div>

            <div>
              <span className="text-[11px] font-bold text-[#8A928B] uppercase tracking-wider block mb-1">Headline H5 (15px - 16px)</span>
              <h5 className="text-base text-[#1B211D] leading-snug m-0" style={dynamicHeadlineStyle}>
                Kompakte Beschriftung &amp; Widget-Titel
              </h5>
            </div>
          </div>
        </div>

        {/* Longform Editorial Article with Dummytext */}
        <div className="bg-white border border-[#EDE8E0] rounded-lg p-8 shadow-[0_2px_10px_rgba(27,33,29,0.04)]">
          <div className="flex items-center gap-2 mb-6 pb-3 border-b border-[#F3F0EA]">
            <Layers className="w-5 h-5 text-[#0F4C2E]" />
            <h2 className="font-display text-xl font-bold m-0 text-[#1B211D]">
              Fließtext- &amp; Artikel-Vorschau
            </h2>
          </div>

          <article className="space-y-4 text-[#4A544D] text-[15.5px] leading-[1.7]">
            <h3 
              className="text-2xl text-[#0F4C2E] leading-snug mb-3"
              style={dynamicHeadlineStyle}
            >
              Warum ein starker lokaler Webauftritt den Unterschied macht
            </h3>

            <p>
              In einer digital vernetzten Welt suchen sowohl Einheimische als auch Urlauber gezielt online nach Handwerksbetrieben, Speisekarten, Freizeitaktivitäten und Dienstleistern in ihrer unmittelbaren Umgebung.
            </p>

            <div className="bg-[#FAF8F5] border-l-4 border-[#F2761B] p-4 rounded-r-md my-4">
              <p className="font-medium text-[#1B211D] italic text-sm m-0">
                „Transparente Kontaktdaten, aktuelle Öffnungszeiten und eine ansprechende Präsentation schaffen Vertrauen und bringen neue Kunden direkt zu Ihnen.“
              </p>
            </div>

            <h4 
              className="text-lg text-[#1B211D] pt-2"
              style={dynamicHeadlineStyle}
            >
              Klare Struktur für maximale Nutzerfreundlichkeit
            </h4>

            <p>
              Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.
            </p>

            <ul className="list-disc pl-5 space-y-1.5 text-sm">
              <li>Hohe Sichtbarkeit in Google-Suchergebnissen</li>
              <li>Optimierte mobile Darstellung für Smartphones</li>
              <li>Direkte Verlinkung zu Telefon, Routenplaner und Website</li>
            </ul>
          </article>
        </div>
      </section>

      {/* Bottom Action Footer */}
      <div className="bg-gradient-to-br from-[#0F4C2E] to-[#06301C] rounded-lg p-8 md:p-10 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div>
          <h2 
            className="text-2xl md:text-3xl text-white mb-2"
            style={dynamicHeadlineStyle}
          >
            Bereit für den nächsten Schritt?
          </h2>
          <p className="text-sm md:text-base text-white/80 m-0 max-w-xl">
            Diese Testseite steht Ihnen jederzeit unter <code>.../test</code> für Typografie- und Designvergleiche zur Verfügung.
          </p>
        </div>
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            window.history.pushState(null, '', '/');
            window.dispatchEvent(new Event('popstate'));
          }}
          className="bg-[#F2761B] hover:bg-[#D65F0C] text-white font-bold px-6 py-3 rounded-md text-sm transition-colors shadow-md shrink-0"
          style={{ fontFamily: dynamicHeadlineStyle.fontFamily }}
        >
          Zur Startseite zurückkehren
        </a>
      </div>
    </main>
  );
}
