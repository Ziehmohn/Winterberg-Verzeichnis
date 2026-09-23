import React, { useState } from 'react';
import { useTranslation } from '../i18n';
import { 
  Snowflake, 
  Mountain, 
  Video, 
  Moon, 
  Clock, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle, 
  Navigation, 
  Sparkles, 
  Compass, 
  Layers, 
  ChevronRight,
  HelpCircle,
  Eye,
  Sun
} from 'lucide-react';
import { Business, SkiResortStatus, ThemeConfig, WebcamSpot } from '../types';
import { SKI_RESORTS_DATA, WEBCAMS_DATA } from '../utils/skiData';
import { getBusinessPath } from '../utils/routes';

interface SkiReportPageProps {
  businesses: Business[];
  theme?: ThemeConfig;
  onSelectBusiness?: (bus: Business) => void;
  onNavigateCategory?: (category: string, subcategory?: string) => void;
  onBack?: () => void;
  defaultTab?: 'pisten' | 'webcams';
}

export const SkiReportPage: React.FC<SkiReportPageProps> = ({
  businesses,
  theme,
  onSelectBusiness,
  onNavigateCategory,
  onBack,
  defaultTab = 'pisten'
}) => {
  const { t, lang } = useTranslation();
  const isNl = lang === 'nl';

  const [activeTab, setActiveTab] = useState<'pisten' | 'webcams'>(defaultTab);

  React.useEffect(() => {
    const title = activeTab === 'webcams'
      ? (isNl ? 'Live Webcams Winterberg | Kahler Asten, Bobbaan & Pistes' : 'Live Webcams Winterberg | Marktplatz, Kahler Asten, Bobbahn & Pisten')
      : (isNl ? 'Sneeuwhoogte & Pistebericht Winterberg | Skiliftkarussell' : 'Schneebericht & Pistenbericht Winterberg | Skiliftkarussell Live');
    document.title = title;

    const desc = isNl
      ? 'Actueel sneeuwbericht, geopende skiliften, avondskiën en live HD webcams voor Winterberg, Altastenberg, Neuastenberg en Züschen.'
      : 'Aktueller Schneebericht, geöffnete Lifte, Pistenkilometer, Flutlicht-Status und Live-Webcams aus Winterberg, Altastenberg und Neuastenberg.';
    
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', desc);
  }, [activeTab, isNl]);

  // Aggregate stats
  const totalOpenLifts = SKI_RESORTS_DATA.reduce((acc, r) => acc + r.openLifts, 0);
  const totalLifts = SKI_RESORTS_DATA.reduce((acc, r) => acc + r.totalLifts, 0);
  const maxSnow = Math.max(...SKI_RESORTS_DATA.map(r => r.snowDepthMountain));
  const hasFloodlight = SKI_RESORTS_DATA.some(r => r.floodlightTonight);

  // Local ski rental businesses
  const skiRentals = businesses.filter(b => 
    (b.subcategory || '').toLowerCase().includes('skiverleih') ||
    (b.name || '').toLowerCase().includes('skiverleih') ||
    (b.name || '').toLowerCase().includes('ski rent')
  ).slice(0, 6);

  // Local ski huts / gastronomic mountain huts
  const skiHuts = businesses.filter(b => 
    (b.subcategory || '').toLowerCase().includes('skihütten') ||
    (b.subcategory || '').toLowerCase().includes('skihuetten') ||
    (b.name || '').toLowerCase().includes('hütte') ||
    (b.name || '').toLowerCase().includes('alm')
  ).slice(0, 6);

  return (
    <main className="flex-1 w-full max-w-[1180px] mx-auto px-4 sm:px-6 py-6 pb-20">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-xs text-[#5F6B63] mb-6 flex-wrap" aria-label="Breadcrumb">
        <button
          type="button"
          onClick={onBack}
          className="hover:text-[#0F4C2E] underline underline-offset-2 bg-transparent border-none p-0 cursor-pointer text-xs"
        >
          {isNl ? 'Home' : 'Startseite'}
        </button>
        <span>/</span>
        <span className="font-semibold text-[#1B211D]">
          {activeTab === 'webcams' 
            ? (isNl ? 'Live Webcams' : 'Live Webcams Winterberg')
            : (isNl ? 'Pistebericht & Sneeuwhoogte' : 'Pistenbericht & Wintersport')}
        </span>
      </nav>

      {/* Hero Header */}
      <section className="relative rounded-2xl overflow-hidden shadow-lg mb-8 text-white bg-gradient-to-r from-[#1B365D] via-[#1E4D80] to-[#0A2540] p-6 sm:p-10">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-cyan-200 mb-4">
            <Snowflake className="w-3.5 h-3.5 animate-spin-slow" />
            {isNl ? 'Wintersport Arena Sauerland' : 'Wintersport-Arena Sauerland'}
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-3">
            {isNl ? 'Pistebericht & Webcams Winterberg' : 'Schnee- & Pistenbericht Winterberg'}
          </h1>
          <p className="text-sm sm:text-base text-white/90 leading-relaxed">
            {isNl
              ? 'Realtime overzicht van alle geopende skiliften, sneeuwhoogtes, geprepareerde loipes, avondskiën en live HD-webcams in en rond Winterberg.'
              : 'Aktuelle Schneehöhen, geöffnete Liftanlagen, Flutlichtampel und Live-Webcams für das Skiliftkarussell und die Skigebiete im Stadtgebiet.'}
          </p>

          {/* Quick Metrics Bar */}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white/10 backdrop-blur-sm border border-white/15 p-3 rounded-xl">
              <span className="text-xs text-white/70 block">{isNl ? 'Liften geopend' : 'Lifte geöffnet'}</span>
              <span className="text-xl sm:text-2xl font-black text-cyan-300">{totalOpenLifts} / {totalLifts}</span>
              <span className="text-[10px] text-white/60 block">{totalOpenLifts === 0 ? (isNl ? 'Zomerseizoen' : 'Sommerbetrieb') : (isNl ? 'Winterseizoen' : 'Winterbetrieb')}</span>
            </div>
            <div className="bg-white/10 backdrop-blur-sm border border-white/15 p-3 rounded-xl">
              <span className="text-xs text-white/70 block">{isNl ? 'Max. Sneeuwhoogte' : 'Max. Schneehöhe'}</span>
              <span className="text-xl sm:text-2xl font-black text-cyan-300">{maxSnow} cm</span>
              <span className="text-[10px] text-white/60 block">{isNl ? 'Sneeuwcondities: Zomer' : 'Saisonstart ab Dez.'}</span>
            </div>
            <div className="bg-white/10 backdrop-blur-sm border border-white/15 p-3 rounded-xl">
              <span className="text-xs text-white/70 block">{isNl ? 'Avondskiën vandaag' : 'Flutlicht heute'}</span>
              <span className="text-base sm:text-lg font-bold text-amber-200 flex items-center gap-1.5 mt-1">
                <span className={`w-2.5 h-2.5 rounded-full ${hasFloodlight ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
                {hasFloodlight ? (isNl ? 'Ja (18:30)' : 'Aktiv (18:30)') : (isNl ? 'Inactief (Zomer)' : 'Inaktiv (Sommer)')}
              </span>
            </div>
            <div className="bg-white/10 backdrop-blur-sm border border-white/15 p-3 rounded-xl">
              <span className="text-xs text-white/70 block">{isNl ? 'Totale Pistes' : 'Gesamte Pisten'}</span>
              <span className="text-xl sm:text-2xl font-black text-cyan-300">55+ km</span>
              <span className="text-[10px] text-white/60 block">{isNl ? 'in 5 skigebieden' : 'in 5 Skigebieten'}</span>
            </div>
          </div>
        </div>

        {/* Decorative mountain icon */}
        <div className="absolute right-4 -bottom-10 opacity-10 pointer-events-none hidden md:block">
          <Mountain className="w-80 h-80 text-white" />
        </div>
      </section>

      {/* Mode Switcher Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-800 mb-8">
        <button
          type="button"
          onClick={() => setActiveTab('pisten')}
          className={`flex items-center gap-2 py-3 px-5 border-b-2 font-semibold text-sm transition-colors cursor-pointer ${
            activeTab === 'pisten'
              ? 'border-[#0F4C2E] text-[#0F4C2E] dark:border-emerald-500 dark:text-emerald-400'
              : 'border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
          }`}
        >
          <Mountain className="w-4 h-4" />
          {isNl ? 'Skigebieden & Pistebericht' : 'Skigebiete & Pistenbericht'}
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('webcams')}
          className={`flex items-center gap-2 py-3 px-5 border-b-2 font-semibold text-sm transition-colors cursor-pointer ${
            activeTab === 'webcams'
              ? 'border-[#0F4C2E] text-[#0F4C2E] dark:border-emerald-500 dark:text-emerald-400'
              : 'border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
          }`}
        >
          <Video className="w-4 h-4" />
          {isNl ? `Live Webcams (${WEBCAMS_DATA.length} Spots)` : `Live Webcams (${WEBCAMS_DATA.length} Spots)`}
        </button>
      </div>

      {/* TAB 1: PISTENBERICHT */}
      {activeTab === 'pisten' && (
        <div className="space-y-8">
          {/* Seasonal Info Callout */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-[#2A2315] dark:to-[#221A10] border border-amber-200 dark:border-amber-800/60 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5 shadow-xs">
            <Sun className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-sm text-amber-950 dark:text-amber-200 mb-1">
                {isNl 
                  ? 'Actuele seizoensinformatie: Zomerbedrijf in Winterberg' 
                  : 'Aktuelle Saison-Information: Sommerbetrieb in der Ferienregion Winterberg'}
              </h3>
              <p className="text-xs text-amber-900/90 dark:text-amber-300/80 leading-relaxed mb-2">
                {isNl
                  ? 'Het reguliere skiseizoen in de Wintersport-Arena Sauerland loopt traditiegetrouw van medio december tot eind maart. Momenteel zijn de hellingen groen. Diverse kabelbanen en attracties (waaronder de Panoramabrug & Erlebnisberg Kappe, Schanzenwirbel Herrloh en de zomerrodelbanen) zijn geopend voor wandelaars, fietsers en dagjesmensen.'
                  : 'Die Wintersportsaison in der Wintersport-Arena Sauerland läuft traditionell von ca. Mitte Dezember bis Ende März (abhängig von Witterung und Beschneiungstemperaturen). Derzeit herrscht regulärer Sommer- und Herbstbetrieb. Für Ausflügler, Wanderer und Biker sind u. a. die Panoramabahn Kappe (Erlebnisberg / Bikepark) und der Schanzenwirbel am Herrloh in Betrieb!'}
              </p>
              <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-amber-900 dark:text-amber-300 bg-amber-100/80 dark:bg-amber-900/40 px-2.5 py-1 rounded-md">
                <span>🚠 {isNl ? 'Zomerseizoen actief' : 'Sommerbahnen geöffnet'}</span>
                <span>•</span>
                <span>🎿 {isNl ? 'Wintersportseizoen start dec 2026' : 'Skisaison 2026/27 startet ab Dezember'}</span>
              </div>
            </div>
          </div>

          {/* Resorts List */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {SKI_RESORTS_DATA.map((resort) => {
              const openPct = Math.round((resort.openLifts / resort.totalLifts) * 100);
              return (
                <div 
                  key={resort.id}
                  className="bg-white dark:bg-[#1E2621] rounded-2xl p-6 border border-black/5 dark:border-white/10 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  <div>
                    {/* Header */}
                    <div className="flex justify-between items-start gap-3 mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          {resort.status === 'open' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300">
                              <CheckCircle2 className="w-3 h-3" />
                              {isNl ? 'Geopend' : 'In Betrieb'}
                            </span>
                          ) : resort.status === 'partial' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-100 text-blue-800 dark:bg-blue-950/70 dark:text-blue-300">
                              <CheckCircle2 className="w-3 h-3" />
                              {isNl ? 'Deels geopend' : 'Teilbetrieb'}
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300">
                              <Sun className="w-3 h-3 text-amber-600" />
                              {isNl ? 'Zomerseizoen' : 'Sommerbetrieb'}
                            </span>
                          )}
                          <span className="text-xs text-gray-400 dark:text-gray-500">
                            {resort.lastUpdated}
                          </span>
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                          {isNl ? (resort.name_nl || resort.name) : resort.name}
                        </h2>
                      </div>

                      <a
                        href={resort.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-gray-400 hover:text-[#0F4C2E] dark:hover:text-emerald-400 transition-colors"
                        title="Offizielle Skigebiets-Website öffnen"
                      >
                        <ExternalLink className="w-5 h-5" />
                      </a>
                    </div>

                    <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed mb-5">
                      {isNl ? (resort.description_nl || resort.description) : resort.description}
                    </p>

                    {/* Progress Bar of Lifts */}
                    <div className="mb-5 bg-gray-50 dark:bg-[#151B17] p-3.5 rounded-xl border border-gray-100 dark:border-gray-800">
                      <div className="flex justify-between items-center text-xs font-semibold mb-1.5">
                        <span className="text-gray-700 dark:text-gray-300">
                          {isNl ? 'Geopende Liften' : 'Geöffnete Liftanlagen'}:
                        </span>
                        <span className="text-[#0F4C2E] dark:text-emerald-400 font-bold">
                          {resort.openLifts === 0 
                            ? (isNl ? `0 van ${resort.totalLifts} (Zomerpauze skibedrijf)` : `0 von ${resort.totalLifts} (Skibetrieb pausiert)`)
                            : `${resort.openLifts} von ${resort.totalLifts} (${openPct}%)`}
                        </span>
                      </div>
                      <div className="w-full h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-emerald-500 to-green-600 rounded-full"
                          style={{ width: `${Math.max(openPct, resort.openLifts > 0 ? openPct : 0)}%` }}
                        />
                      </div>
                    </div>


                    {/* Metrics Grid */}
                    <div className="grid grid-cols-3 gap-2.5 text-center mb-4">
                      <div className="p-2.5 bg-gray-50 dark:bg-[#151B17] rounded-lg border border-gray-100 dark:border-gray-800">
                        <span className="text-[11px] text-gray-500 block">{isNl ? 'Sneeuw Berg' : 'Schnee Berg'}</span>
                        <span className="text-base font-bold text-gray-900 dark:text-white">{resort.snowDepthMountain} cm</span>
                      </div>
                      <div className="p-2.5 bg-gray-50 dark:bg-[#151B17] rounded-lg border border-gray-100 dark:border-gray-800">
                        <span className="text-[11px] text-gray-500 block">{isNl ? 'Sneeuw Dal' : 'Schnee Tal'}</span>
                        <span className="text-base font-bold text-gray-900 dark:text-white">{resort.snowDepthValley} cm</span>
                      </div>
                      <div className="p-2.5 bg-gray-50 dark:bg-[#151B17] rounded-lg border border-gray-100 dark:border-gray-800">
                        <span className="text-[11px] text-gray-500 block">{isNl ? 'Pistes open' : 'Pisten befahrbar'}</span>
                        <span className="text-base font-bold text-gray-900 dark:text-white">{resort.openSlopesKm} km</span>
                      </div>
                    </div>

                    {/* Floodlight & Toboggan Indicators */}
                    <div className="flex flex-wrap gap-2 text-xs">
                      {resort.floodlightTonight && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 rounded-md border border-amber-200 dark:border-amber-800">
                          <Moon className="w-3 h-3 text-amber-600" />
                          {isNl ? 'Avondskiën vanavond actief' : 'Flutlichtbetrieb heute Abend'}
                        </span>
                      )}
                      {resort.tobogganLiftsOpen > 0 && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-cyan-50 dark:bg-cyan-950/40 text-cyan-800 dark:text-cyan-300 rounded-md border border-cyan-200 dark:border-cyan-800">
                          <Snowflake className="w-3 h-3 text-cyan-600" />
                          {resort.tobogganLiftsOpen} {isNl ? 'Rodelliften geopend' : 'Rodellifte geöffnet'}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-5 pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center">
                    <a
                      href={resort.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#0F4C2E] dark:text-emerald-400 hover:underline"
                    >
                      <span>{isNl ? 'Pistekaart & live status bekijken' : 'Pistenplan & Ticketpreise'}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Cross-Link Wirtschaft: Skiverleih & Skihütten */}
          <section className="bg-gradient-to-br from-[#F5F8F6] to-white dark:from-[#17221A] dark:to-[#1E2621] p-6 sm:p-8 rounded-2xl border border-[#0F4C2E]/10 dark:border-white/10 mt-12">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0F4C2E] dark:text-emerald-400 mb-2">
              <Sparkles className="w-4 h-4" />
              {isNl ? 'Lokale Bedrijven' : 'Lokale Wintersport-Partner im Verzeichnis'}
            </div>
            <h3 className="text-xl font-extrabold text-gray-900 dark:text-white mb-6">
              {isNl ? 'Skiverhuur & Gezellige Skihutten in Winterberg' : 'Skiverleih & Einkehrschwung in den Skihütten'}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Skiverleih Box */}
              <div className="bg-white dark:bg-[#151B17] p-5 rounded-xl border border-gray-200 dark:border-gray-800">
                <h4 className="font-bold text-sm text-gray-900 dark:text-white mb-3 flex items-center justify-between">
                  <span>🎿 {isNl ? 'Skiverhuur & Materiaal' : 'Skiverleiher vor Ort'}</span>
                  {onNavigateCategory && (
                    <button
                      type="button"
                      onClick={() => onNavigateCategory('Ski, Bike & Sport', 'Skiverleih')}
                      className="text-xs text-[#0F4C2E] dark:text-emerald-400 hover:underline bg-transparent border-none p-0 cursor-pointer"
                    >
                      {isNl ? 'Alle bekijken' : 'Alle anzeigen'} →
                    </button>
                  )}
                </h4>
                <div className="space-y-2">
                  {skiRentals.map(bus => (
                    <div
                      key={bus.id}
                      onClick={() => onSelectBusiness ? onSelectBusiness(bus) : null}
                      className="flex justify-between items-center p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-[#1E2621] cursor-pointer transition-colors"
                    >
                      <span className="text-xs font-medium text-gray-800 dark:text-gray-200">{bus.name}</span>
                      <span className="text-[11px] text-gray-400">{bus.district || 'Winterberg'}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Skihütten Box */}
              <div className="bg-white dark:bg-[#151B17] p-5 rounded-xl border border-gray-200 dark:border-gray-800">
                <h4 className="font-bold text-sm text-gray-900 dark:text-white mb-3 flex items-center justify-between">
                  <span>☕ {isNl ? 'Skihutten & Restaurants' : 'Skihütten & Gastronomie'}</span>
                  {onNavigateCategory && (
                    <button
                      type="button"
                      onClick={() => onNavigateCategory('Gastronomie', 'Skihütten')}
                      className="text-xs text-[#0F4C2E] dark:text-emerald-400 hover:underline bg-transparent border-none p-0 cursor-pointer"
                    >
                      {isNl ? 'Alle bekijken' : 'Alle anzeigen'} →
                    </button>
                  )}
                </h4>
                <div className="space-y-2">
                  {skiHuts.map(bus => (
                    <div
                      key={bus.id}
                      onClick={() => onSelectBusiness ? onSelectBusiness(bus) : null}
                      className="flex justify-between items-center p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-[#1E2621] cursor-pointer transition-colors"
                    >
                      <span className="text-xs font-medium text-gray-800 dark:text-gray-200">{bus.name}</span>
                      <span className="text-[11px] text-gray-400">{bus.district || 'Winterberg'}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* TAB 2: WEBCAMS HUB */}
      {activeTab === 'webcams' && (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {WEBCAMS_DATA.map((cam) => (
              <div
                key={cam.id}
                className="bg-white dark:bg-[#1E2621] rounded-2xl overflow-hidden border border-black/5 dark:border-white/10 shadow-sm hover:shadow-md transition-all flex flex-col group"
              >
                {/* Image Container with Live Badge */}
                <div className="relative aspect-video overflow-hidden bg-gray-900">
                  <img
                    src={cam.previewImageUrl}
                    alt={isNl ? (cam.title_nl || cam.title) : cam.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3 bg-red-600 text-white px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-md">
                    <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
                    LIVE
                  </div>
                  <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-sm text-white px-2 py-0.5 rounded text-[11px] font-medium">
                    {cam.altitudeMeters} m ü. NHN
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1 leading-snug">
                      {isNl ? (cam.title_nl || cam.title) : cam.title}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                      {cam.location} • <span className="italic">{cam.operator}</span>
                    </p>
                  </div>

                  <a
                    href={cam.liveStreamUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-4 bg-[#0F4C2E] hover:bg-[#14532D] text-white text-xs font-semibold rounded-lg text-center flex items-center justify-center gap-2 transition-colors shadow-sm"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>{isNl ? 'Live stream openen' : 'Live-Webcam öffnen'}</span>
                    <ExternalLink className="w-3.5 h-3.5 ml-1 opacity-70" />
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Legal / Operator Credit Note */}
          <div className="mt-10 p-4 bg-gray-50 dark:bg-[#151B17] rounded-xl text-xs text-gray-500 dark:text-gray-400 flex items-center gap-3 border border-gray-200 dark:border-gray-800">
            <HelpCircle className="w-5 h-5 text-gray-400 shrink-0" />
            <p>
              {isNl
                ? 'De getoonde webcams zijn officiële livestreams van de stad Winterberg, de exploitant van het Skiliftkarussell en de Sauerlandse toerismebond. De beelden openen rechtstreeks bij de officiële bron.'
                : 'Die dargestellten Webcams sind kuratierte Livestreams der Stadt Winterberg, der Skiliftkarussell-Gesellschaft und des Sauerland Tourismus. Die Streams öffnen direkt beim jeweiligen Betreiber.'}
            </p>
          </div>
        </div>
      )}
    </main>
  );
};

export default SkiReportPage;
