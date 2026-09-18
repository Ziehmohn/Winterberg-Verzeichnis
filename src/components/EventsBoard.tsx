import React, { useState, useMemo, useEffect, lazy, Suspense } from 'react';
import { useTranslation } from '../i18n';
import { Business, ThemeConfig, EventItem } from '../types';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Search, 
  ExternalLink, 
  X,
  ChevronRight,
  Sparkles,
  Building2,
  Trophy,
  PartyPopper,
  Music,
  Palette,
  GraduationCap,
  Megaphone,
  Utensils,
  ChevronDown,
  ChevronUp,
  Navigation
} from 'lucide-react';

// Lazy load map components
const MapContainer = lazy(() => import('react-leaflet').then(m => ({ default: m.MapContainer })));
const TileLayer = lazy(() => import('react-leaflet').then(m => ({ default: m.TileLayer })));
const Marker = lazy(() => import('react-leaflet').then(m => ({ default: m.Marker })));

interface EventsBoardProps {
  businesses: Business[];
  theme: ThemeConfig;
  activeThemeKey: string;
  onBusinessSelect: (business: Business) => void;
  onBack: () => void;
  onNavigatePricing?: () => void;
}

// Category icon & color helper
const getCategoryMeta = (category: string) => {
  const cat = category.toLowerCase();
  if (cat.includes('sport') || cat.includes('weltcup') || cat.includes('cup'))
    return { Icon: Trophy, bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' };
  if (cat.includes('konzert') || cat.includes('musik') || cat.includes('music'))
    return { Icon: Music, bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' };
  if (cat.includes('fest') || cat.includes('party') || cat.includes('feier'))
    return { Icon: PartyPopper, bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' };
  if (cat.includes('workshop') || cat.includes('kurs') || cat.includes('seminar'))
    return { Icon: GraduationCap, bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' };
  if (cat.includes('kunst') || cat.includes('art') || cat.includes('ausstellung'))
    return { Icon: Palette, bg: 'bg-violet-50', text: 'text-violet-700', border: 'border-violet-200' };
  if (cat.includes('markt') || cat.includes('messe'))
    return { Icon: Megaphone, bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' };
  if (cat.includes('kulinar') || cat.includes('essen') || cat.includes('food'))
    return { Icon: Utensils, bg: 'bg-lime-50', text: 'text-lime-700', border: 'border-lime-200' };
  return { Icon: Calendar, bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' };
};

// Calendar card component
function CalendarCard({ startDate, endDate }: { startDate: string; endDate?: string }) {
  const date = new Date(startDate);
  const day = date.getDate();
  const month = date.toLocaleDateString('de-DE', { month: 'short' }).toUpperCase().replace('.', '');
  const weekday = date.toLocaleDateString('de-DE', { weekday: 'short' }).replace('.', '');
  
  const isMultiDay = endDate && endDate !== startDate;
  const endDay = isMultiDay ? new Date(endDate).getDate() : null;

  return (
    <div className="w-[58px] h-[64px] rounded-xl overflow-hidden border border-[#E7E2DA] shadow-sm shrink-0 bg-white flex flex-col text-center select-none">
      <div className="bg-[#7E22CE] text-white text-[9px] font-extrabold tracking-widest py-[3px] leading-none">
        {month}
      </div>
      <div className="flex-1 flex flex-col items-center justify-center -mt-0.5">
        <span className="font-display text-[22px] font-black text-[#1B211D] leading-none">
          {day}
        </span>
        {isMultiDay ? (
          <span className="text-[9px] font-bold text-[#7E22CE] leading-none mt-0.5">– {endDay}</span>
        ) : (
          <span className="text-[9px] font-semibold text-[#8A958E] leading-none mt-0.5">{weekday}</span>
        )}
      </div>
    </div>
  );
}

// Geocode cache
const geocodeCache: Record<string, [number, number]> = {};

// Inline event map
function EventMap({ location, lang }: { location: string; lang: string }) {
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const query = `${location}, Winterberg, Deutschland`;
    if (geocodeCache[query]) {
      setPosition(geocodeCache[query]);
      setLoading(false);
      return;
    }

    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`)
      .then(r => r.json())
      .then(data => {
        if (data?.length > 0) {
          const coords: [number, number] = [parseFloat(data[0].lat), parseFloat(data[0].lon)];
          geocodeCache[query] = coords;
          setPosition(coords);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [location]);

  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(location + ', Winterberg')}`;

  if (loading) {
    return (
      <div className="w-full h-[180px] bg-[#F0EDE7] rounded-lg flex items-center justify-center border border-[#EDE8E0] animate-pulse mt-3">
        <MapPin className="w-5 h-5 text-[#C5BFAF]" />
      </div>
    );
  }

  if (!position) {
    return (
      <div className="mt-3 p-3 bg-[#FAF8F5] border border-[#EDE8E0] rounded-lg text-xs text-[#5F6B63] flex items-center justify-between">
        <span>Standort konnte nicht auf der Karte gefunden werden.</span>
        <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer" className="text-[#0F4C2E] font-semibold hover:underline flex items-center gap-1">
          <Navigation className="w-3 h-3" />
          Google Maps
        </a>
      </div>
    );
  }

  // Dynamically import leaflet for the icon
  const L = require('leaflet');
  const brandIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  return (
    <div className="mt-3 w-full overflow-hidden rounded-lg border border-[#EDE8E0] shadow-sm relative">
      <Suspense fallback={<div className="w-full h-[180px] bg-[#F0EDE7] animate-pulse" />}>
        <div style={{ height: '180px' }}>
          <MapContainer
            center={position}
            zoom={14}
            style={{ height: '100%', width: '100%' }}
            zoomControl={false}
            scrollWheelZoom={false}
            dragging={true}
            doubleClickZoom={false}
            attributionControl={false}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={position} icon={brandIcon} />
          </MapContainer>
        </div>
      </Suspense>
      <a
        href={googleMapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute bottom-2 right-2 z-[400] flex items-center gap-1.5 bg-white text-[#0F4C2E] text-[11px] font-semibold px-2.5 py-1.5 rounded-md shadow-md border border-[#EDE8E0] hover:bg-[#0F4C2E] hover:text-white transition-colors"
      >
        <Navigation className="w-3 h-3" />
        {lang === 'nl' ? 'Route plannen' : 'Route planen'}
      </a>
    </div>
  );
}

export default function EventsBoard({ 
  businesses, 
  theme, 
  activeThemeKey, 
  onBusinessSelect, 
  onBack,
  onNavigatePricing 
}: EventsBoardProps) {
  const { t, lang } = useTranslation();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Alle');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [expandedMap, setExpandedMap] = useState<string | null>(null);

  const allEvents = useMemo(() => {
    const list: Array<{ event: EventItem; business: Business }> = [];
    businesses.forEach(bus => {
      if (bus.events && Array.isArray(bus.events)) {
        bus.events.forEach(ev => {
          list.push({ event: ev, business: bus });
        });
      }
    });
    return list.sort((a, b) => new Date(a.event.startDate).getTime() - new Date(b.event.startDate).getTime());
  }, [businesses]);

  const filteredEvents = useMemo(() => {
    let list = [...allEvents];
    if (selectedCategory !== 'Alle') {
      list = list.filter(item => item.event.category === selectedCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(item => 
        item.event.title.toLowerCase().includes(q) ||
        (item.event.title_nl && item.event.title_nl.toLowerCase().includes(q)) ||
        item.business.name.toLowerCase().includes(q) ||
        (item.event.location && item.event.location.toLowerCase().includes(q)) ||
        (item.event.description && item.event.description.toLowerCase().includes(q))
      );
    }
    return list;
  }, [allEvents, selectedCategory, searchQuery]);

  const uniqueCategories = useMemo(() => {
    const cats = new Set<string>();
    allEvents.forEach(item => {
      if (item.event.category) cats.add(item.event.category);
    });
    return ['Alle', ...Array.from(cats)].sort();
  }, [allEvents]);

  const formatEventDateLong = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(lang === 'nl' ? 'nl-NL' : 'de-DE', {
      weekday: 'long', day: '2-digit', month: 'long', year: 'numeric'
    });
  };

  return (
    <main className="flex-1 w-full max-w-[1080px] mx-auto px-4 sm:px-6 py-8 sm:py-12 pb-24">
      {/* Back button */}
      <div className="mb-4">
        <button onClick={onBack} className="inline-flex items-center gap-1.5 bg-transparent border-none text-[#5F6B63] hover:text-[#0F4C2E] text-[13.5px] font-medium cursor-pointer transition-colors">
          <span>←</span>
          <span>{lang === 'nl' ? 'Terug naar overzicht' : 'Zurück zur Übersicht'}</span>
        </button>
      </div>

      {/* Hero Header */}
      <div className="bg-gradient-to-br from-[#4A154B] to-[#7E22CE] text-white rounded-3xl p-6 sm:p-10 shadow-lg mb-8 relative overflow-hidden">
        <div className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute -right-4 -top-8 w-40 h-40 rounded-full bg-white/5 pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-white/90 text-xs font-semibold backdrop-blur-xs mb-3.5">
            <Calendar className="w-3.5 h-3.5 text-purple-300" />
            <span>{allEvents.length} {lang === 'nl' ? 'Evenementen gepland' : 'Veranstaltungen geplant'}</span>
          </div>
          <h1 className="font-display text-[clamp(28px,4.5vw,42px)] font-extrabold tracking-tight leading-[1.15] mb-3 text-white">
            {lang === 'nl' ? 'Evenementenkalender' : 'Veranstaltungskalender'}
          </h1>
          <p className="text-[15.5px] sm:text-[17px] leading-relaxed text-white/85 font-normal">
            {lang === 'nl' 
              ? 'Ontdek wat er te doen is in Winterberg en omgeving. Van feesten tot workshops en concerten – blijf op de hoogte van alle evenementen.'
              : 'Entdecke, was in Winterberg und Umgebung los ist. Von Festen über Workshops bis hin zu Konzerten – bleibe über alle Veranstaltungen auf dem Laufenden.'}
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-[#E7E2DA] rounded-2xl p-4 sm:p-5 shadow-xs mb-8 space-y-4">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#717E75]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={lang === 'nl' ? 'Zoek evenement of organisator...' : 'Event oder Veranstalter suchen...'}
            className="w-full pl-10 pr-10 py-2.5 bg-[#FAF8F5] border border-[#E7E2DA] rounded-xl text-[14.5px] text-[#1B211D] placeholder-[#8A958E] focus:outline-none focus:ring-2 focus:ring-[#7E22CE]/20 focus:border-[#7E22CE] transition-all"
          />
          {searchQuery && (
            <button type="button" onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pt-1 border-t border-[#F0EBE1]">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {uniqueCategories.map((type) => {
              const isActive = selectedCategory === type;
              const meta = type !== 'Alle' ? getCategoryMeta(type) : null;
              const CatIcon = meta?.Icon;
              return (
                <button
                  key={type} type="button" onClick={() => setSelectedCategory(type)}
                  className={`px-3.5 py-1.5 rounded-lg text-[13px] font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                    isActive ? 'bg-[#7E22CE] text-white shadow-xs' : 'bg-[#F4F1EA] text-[#4A544D] hover:bg-[#EBE5DB]'
                  }`}
                >
                  {CatIcon && <CatIcon className="w-3.5 h-3.5" />}
                  {type}
                </button>
              );
            })}
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setViewMode('list')} className={`px-3 py-1.5 rounded-md text-xs font-semibold ${viewMode === 'list' ? 'bg-[#7E22CE] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>Liste</button>
            <button onClick={() => setViewMode('grid')} className={`px-3 py-1.5 rounded-md text-xs font-semibold ${viewMode === 'grid' ? 'bg-[#7E22CE] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>Raster</button>
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="text-sm font-semibold text-[#1B211D]">
          {filteredEvents.length} {filteredEvents.length === 1 ? (lang === 'nl' ? 'evenement gevonden' : 'Veranstaltung gefunden') : (lang === 'nl' ? 'evenementen gevunden' : 'Veranstaltungen gefunden')}
        </div>
      </div>

      {/* Events Listing */}
      <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5" : "space-y-4"}>
        {filteredEvents.length === 0 ? (
          <div className="col-span-full bg-white border border-dashed border-[#D8D2C8] rounded-2xl p-12 text-center text-[#5F6B63]">
            <Calendar className="w-10 h-10 mx-auto text-[#8A958E] mb-3" />
            <p className="text-base font-semibold text-[#1B211D] mb-1">{lang === 'nl' ? 'Geen evenementen gevonden' : 'Keine Veranstaltungen gefunden'}</p>
            <p className="text-sm text-[#717E75] max-w-md mx-auto mb-4">{lang === 'nl' ? 'Probeer een andere zoekterm of categorie.' : 'Bitte versuche einen anderen Suchbegriff oder eine andere Kategorie.'}</p>
            {(searchQuery || selectedCategory !== 'Alle') && (
              <button type="button" onClick={() => { setSearchQuery(''); setSelectedCategory('Alle'); }}
                className="px-4 py-2 bg-[#7E22CE] text-white text-xs font-semibold rounded-lg hover:bg-[#6B21A8] transition-colors"
              >{lang === 'nl' ? 'Filters resetten' : 'Filter zurücksetzen'}</button>
            )}
          </div>
        ) : (
          filteredEvents.map(({ event, business }) => {
            const title = (lang === 'nl' && event.title_nl) ? event.title_nl : event.title;
            const description = (lang === 'nl' && event.description_nl) ? event.description_nl : event.description;
            const meta = getCategoryMeta(event.category);
            const CatIcon = meta.Icon;
            const locationStr = event.location || business.district || business.name;
            const eventKey = `${business.id}-${event.id}`;
            const isMapOpen = expandedMap === eventKey;
            
            return (
              <article key={eventKey} className={`bg-white border rounded-2xl transition-all shadow-[0_2px_10px_rgba(27,33,29,0.03)] hover:shadow-[0_12px_28px_rgba(27,33,29,0.08)] border-[#EDE8E0] hover:border-[#D8D2C8] overflow-hidden ${viewMode === 'list' ? '' : 'flex flex-col'}`}>
                {/* Image for grid view */}
                {viewMode === 'grid' && event.imageUrl && (
                  <div className="w-full h-44 shrink-0 relative bg-gray-100">
                    <img src={event.imageUrl} alt={title} className="w-full h-full object-cover" />
                    <div className="absolute top-3 left-3">
                      <CalendarCard startDate={event.startDate} endDate={event.endDate} />
                    </div>
                  </div>
                )}
                
                <div className={`p-5 flex gap-4 ${viewMode === 'grid' ? 'flex-col' : 'items-start'}`}>
                  {/* Calendar card (list view) */}
                  {viewMode === 'list' && (
                    <CalendarCard startDate={event.startDate} endDate={event.endDate} />
                  )}

                  <div className="flex-1 min-w-0 flex flex-col">
                    <div>
                      {/* Category badge with icon */}
                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${meta.bg} ${meta.text} ${meta.border}`}>
                          <CatIcon className="w-3 h-3" />
                          {event.category}
                        </span>
                        <span className="text-[11.5px] text-[#5F6B63] font-medium">
                          {formatEventDateLong(event.startDate)}
                          {event.endDate && event.endDate !== event.startDate && ` – ${formatEventDateLong(event.endDate)}`}
                        </span>
                      </div>

                      <h2 className="font-display text-[18px] font-bold text-[#1B211D] leading-snug mb-1.5">{title}</h2>

                      {/* Time & Location */}
                      <div className="flex flex-wrap items-center gap-3 text-[13px] text-[#5F6B63] mb-3">
                        {(event.startTime || event.endTime) && (
                          <span className="flex items-center gap-1 font-medium">
                            <Clock className="w-3.5 h-3.5 text-[#8A958E]" />
                            {event.startTime || '?'}{event.endTime ? ` – ${event.endTime}` : ' Uhr'}
                          </span>
                        )}
                        {locationStr && (
                          <span className="flex items-center gap-1 font-medium text-[#0F4C2E]">
                            <MapPin className="w-3.5 h-3.5" />
                            {locationStr}
                          </span>
                        )}
                      </div>

                      {description && (
                        <p className={`text-[13.5px] text-[#717E75] leading-relaxed mb-4 ${viewMode === 'grid' ? 'line-clamp-3' : 'line-clamp-2'}`}>{description}</p>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="pt-3 border-t border-[#F0EBE1] flex flex-wrap items-center justify-between gap-3 mt-auto">
                      <button type="button" onClick={() => onBusinessSelect(business)} className="text-sm font-semibold text-[#0F4C2E] hover:underline flex items-center gap-1.5 cursor-pointer">
                        <Building2 className="w-4 h-4" />
                        <span>{business.name}</span>
                      </button>

                      <div className="flex items-center gap-2">
                        {/* Map toggle */}
                        {locationStr && (
                          <button
                            type="button"
                            onClick={() => setExpandedMap(isMapOpen ? null : eventKey)}
                            className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                              isMapOpen 
                                ? 'border-[#7E22CE] bg-purple-50 text-[#7E22CE]' 
                                : 'border-[#E7E2DA] bg-white hover:bg-[#FAF8F5] text-[#1B211D]'
                            }`}
                          >
                            <MapPin className="w-3 h-3" />
                            <span>Karte</span>
                            {isMapOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                          </button>
                        )}

                        {event.externalUrl && (
                          <a href={event.externalUrl} target="_blank" rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#7E22CE] hover:bg-[#6B21A8] text-white text-xs font-semibold transition-colors"
                          >
                            <span>{lang === 'nl' ? 'Meer info' : 'Mehr erfahren'}</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Expandable Map */}
                    {isMapOpen && locationStr && (
                      <EventMap location={locationStr} lang={lang} />
                    )}
                  </div>
                </div>
              </article>
            );
          })
        )}
      </div>

      {/* Employer CTA Box */}
      <div className="mt-12 bg-gradient-to-r from-[#FDF8FF] to-[#FAF8F5] border border-[#E7E2DA] rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs">
        <div className="space-y-1.5 max-w-xl">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#7E22CE] uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{lang === 'nl' ? 'Voor bedrijven & organisatoren' : 'Für Unternehmen & Veranstalter'}</span>
          </div>
          <h3 className="font-display text-xl sm:text-2xl font-bold text-[#1B211D]">
            {lang === 'nl' ? 'Plaats nu je evenement' : 'Eigenes Event hier eintragen?'}
          </h3>
          <p className="text-sm text-[#5F6B63] leading-relaxed">
            {lang === 'nl' 
              ? 'Promoot je evenementen, feesten en speciale acties. Exclusief voor Premium-leden.' 
              : 'Veröffentliche deine Partys, Konzerte, Workshops oder speziellen Angebote hier im Kalender und auf deinem Profil. Exklusiv für Premium-Mitglieder.'}
          </p>
        </div>
        <button type="button" onClick={() => {
          if (onNavigatePricing) { onNavigatePricing(); } else {
            window.history.pushState(null, '', lang === 'nl' ? '/nl/prijzen' : '/preise');
            window.dispatchEvent(new PopStateEvent('popstate'));
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }} className="shrink-0 inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#7E22CE] hover:bg-[#6B21A8] text-white text-sm font-bold shadow-md hover:shadow-lg transition-all cursor-pointer">
          <span>{lang === 'nl' ? 'Nu informeren' : 'Jetzt eintragen'}</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </main>
  );
}
