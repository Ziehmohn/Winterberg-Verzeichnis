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
  Navigation,
  Ticket,
  Compass,
  Store,
  CalendarDays,
  Filter
} from 'lucide-react';

import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { DISTRICT_COORDINATES } from './BusinessMap';

interface EventsBoardProps {
  businesses: Business[];
  theme: ThemeConfig;
  activeThemeKey: string;
  onBusinessSelect: (business: Business) => void;
  onBack: () => void;
  onNavigatePricing?: () => void;
  onEventClick?: (slug: string) => void;
}

import { normalizeEventCategory } from '../utils/eventUtils';
export { normalizeEventCategory };

// Category icon & color helper
const getCategoryMeta = (category: string) => {
  const cat = category.toLowerCase();
  if (cat.includes('neueröffnung') || cat.includes('eröffnung') || cat.includes('opening'))
    return { Icon: Store, bg: 'bg-teal-50', text: 'text-teal-800', border: 'border-teal-200' };
  if (cat.includes('wander') || cat.includes('outdoor') || cat.includes('tour') || cat.includes('führung'))
    return { Icon: Compass, bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' };
  if (cat.includes('sport') || cat.includes('weltcup') || cat.includes('cup'))
    return { Icon: Trophy, bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' };
  if (cat.includes('comedy') || cat.includes('kabarett') || cat.includes('humor') || cat.includes('stand up') || cat.includes('stand-up'))
    return { Icon: Sparkles, bg: 'bg-fuchsia-50', text: 'text-fuchsia-700', border: 'border-fuchsia-200' };
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
  const endDateObj = isMultiDay ? new Date(endDate) : null;
  const isDifferentMonth = endDateObj && (endDateObj.getMonth() !== date.getMonth() || endDateObj.getFullYear() !== date.getFullYear());
  const endDisplay = endDateObj 
    ? (isDifferentMonth ? `– ${endDateObj.getDate()}.${endDateObj.toLocaleDateString('de-DE', { month: 'short' }).replace('.', '')}` : `– ${endDateObj.getDate()}`)
    : null;

  return (
    <div className="w-[62px] h-[64px] rounded-xl overflow-hidden border border-[#E7E2DA] shadow-sm shrink-0 bg-white flex flex-col text-center select-none">
      <div className="bg-[#7E22CE] text-white text-[9px] font-extrabold tracking-widest py-[3px] leading-none">
        {month}
      </div>
      <div className="flex-1 flex flex-col items-center justify-center -mt-0.5 px-0.5">
        <span className="font-display text-[21px] font-black text-[#1B211D] leading-none">
          {day}
        </span>
        {isMultiDay ? (
          <span className="text-[8.5px] font-bold text-[#7E22CE] leading-none mt-0.5 whitespace-nowrap">{endDisplay}</span>
        ) : (
          <span className="text-[9px] font-semibold text-[#8A958E] leading-none mt-0.5">{weekday}</span>
        )}
      </div>
    </div>
  );
}

// Local date string helper YYYY-MM-DD
function getLocalDateString(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Get weekend date range (Friday through Sunday)
function getWeekendRange(): { start: string; end: string } {
  const now = new Date();
  const day = now.getDay(); // 0 is Sunday, 1 Mon, ... 5 Fri, 6 Sat
  const friday = new Date(now);
  const sunday = new Date(now);

  if (day === 5) {
    sunday.setDate(now.getDate() + 2);
  } else if (day === 6) {
    friday.setDate(now.getDate() - 1);
    sunday.setDate(now.getDate() + 1);
  } else if (day === 0) {
    friday.setDate(now.getDate() - 2);
  } else {
    const diff = 5 - day;
    friday.setDate(now.getDate() + diff);
    sunday.setDate(now.getDate() + diff + 2);
  }

  return {
    start: getLocalDateString(friday),
    end: getLocalDateString(sunday)
  };
}

// Pretty print date for badges e.g. "20.10.2026"
function formatShortDate(dateStr: string): string {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  return `${parts[2]}.${parts[1]}.${parts[0]}`;
}

// Fix Leaflet default icon path issues in React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom violet icon for events
const violetEventIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Helper component to auto-pan and fit size when coordinates are set
function SetViewOnPosition({ position }: { position: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.invalidateSize();
    map.setView(position, 15);
  }, [position, map]);
  return null;
}

// Known event venues in Winterberg with exact coordinates
const KNOWN_EVENT_VENUES: Record<string, [number, number]> = {
  // EisArena / Bob & Rodel
  'eisarena': [51.18349, 8.50882],
  'veltins': [51.18349, 8.50882],
  'bobbahn': [51.18349, 8.50882],
  // Poppenberg / Skiliftkarussell
  'poppenberg': [51.19259, 8.50898],
  'skiliftkarussell': [51.19259, 8.50898],
  // Oversum / Kurpark / Stadthalle
  'oversum': [51.19667, 8.53886],
  'am kurpark': [51.19667, 8.53886],
  'kurpark': [51.19667, 8.53886],
  // Schützenhalle Niedersfeld
  'schützenhalle niedersfeld': [51.2588, 8.5297],
  'niedersfeld': [51.2588, 8.5297],
  // Untere Pforte Marktplatz
  'untere pforte': [51.19449, 8.53251],
  'marktplatz': [51.19449, 8.53251],
  'winterdorf': [51.19449, 8.53251],
  'wintermarkt': [51.19449, 8.53251],
  // Bei Möppi / In der Büre
  'möppi': [51.19726, 8.51181],
  'büre': [51.19726, 8.51181],
  // Nordhang Jause
  'nordhang': [51.18492, 8.48927],
    'renau': [51.18492, 8.48927],
  // Grönebach
  'grönebach': [51.2359, 8.5583],
  'lambertus': [51.2359, 8.5583],
  // Siedlinghausen
  'siedlinghausen': [51.2505, 8.4901],
  // Silbach
  'silbach': [51.2263, 8.4727],
  // Züschen
  'züschen': [51.1578, 8.5663],
  // St. Jakobus Winterberg
  'jakobus': [51.1956, 8.5338],
};

function getKnownOrDistrictCoordinates(location: string): [number, number] {
  if (!location) return [51.1956, 8.5338];
  const lower = location.toLowerCase();

  // 1. Direct match with known venues
  for (const [key, coords] of Object.entries(KNOWN_EVENT_VENUES)) {
    if (lower.includes(key)) {
      return coords;
    }
  }

  // 2. District coordinate match
  for (const [district, coords] of Object.entries(DISTRICT_COORDINATES)) {
    if (lower.includes(district.toLowerCase())) {
      return coords;
    }
  }

  // 3. Fallback to Winterberg center
  return [51.1956, 8.5338];
}

// Geocode cache
const geocodeCache: Record<string, [number, number]> = {};

// Inline event map
function EventMap({ location, lang }: { location: string; lang: string }) {
  const defaultPos = useMemo(() => getKnownOrDistrictCoordinates(location), [location]);
  const [position, setPosition] = useState<[number, number]>(() => geocodeCache[location] || defaultPos);

  useEffect(() => {
    if (geocodeCache[location]) {
      setPosition(geocodeCache[location]);
      return;
    }

    const knownPos = getKnownOrDistrictCoordinates(location);
    setPosition(knownPos);
    geocodeCache[location] = knownPos;

    // Clean address query for extra geocoding precision if needed
    const cleanAddress = location
      .replace(/\bIn d\.\s*/gi, 'In der ')
      .replace(/\bBgm\.-/gi, 'Bürgermeister-')
      .replace(/\bDr\.-/gi, 'Doktor-')
      .replace(/(\d+)\/\d+/g, '$1')
      .replace(/,?\s*(Winterberg|Deutschland)\b/gi, '')
      .trim();

    const query = `${cleanAddress}, Winterberg`;

    const fetchGeocode = async () => {
      try {
        // 1. Photon API (fast, handles fuzzy queries & abbreviations, CORS friendly)
        try {
          const photonRes = await fetch(
            `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=1`
          );
          if (photonRes.ok) {
            const data = await photonRes.json();
            const feat = data.features?.[0];
            if (feat?.geometry?.coordinates && Array.isArray(feat.geometry.coordinates)) {
              const coords: [number, number] = [feat.geometry.coordinates[1], feat.geometry.coordinates[0]];
              geocodeCache[location] = coords;
              setPosition(coords);
              return;
            }
          }
        } catch {
          // Fall through to Nominatim
        }

        // 2. Nominatim fallback with proper headers
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query + ', Deutschland')}&limit=1`,
            {
              headers: {
                'Accept': 'application/json',
                'User-Agent': 'WinterbergVerzeichnis/1.0 (info@winterberg-verzeichnis.de)'
              }
            }
          );
          if (res.ok) {
            const data = await res.json();
            if (Array.isArray(data) && data.length > 0 && data[0].lat && data[0].lon) {
              const coords: [number, number] = [parseFloat(data[0].lat), parseFloat(data[0].lon)];
              geocodeCache[location] = coords;
              setPosition(coords);
              return;
            }
          }
        } catch {
          // Keep knownPos
        }
      } catch {
        // Keep knownPos
      }
    };

    fetchGeocode();
  }, [location, defaultPos]);

  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(location + ', Winterberg')}`;

  return (
    <div className="mt-3 w-full overflow-hidden rounded-lg border border-[#EDE8E0] shadow-sm relative">
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
          <SetViewOnPosition position={position} />
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker position={position} icon={violetEventIcon} />
        </MapContainer>
      </div>
      <a
        href={googleMapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute bottom-2 right-2 z-[400] flex items-center gap-1.5 bg-white text-[#7E22CE] text-[11px] font-semibold px-2.5 py-1.5 rounded-md shadow-md border border-[#EDE8E0] hover:bg-[#7E22CE] hover:text-white transition-colors"
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
  onNavigatePricing,
  onEventClick
}: EventsBoardProps) {
  const { t, lang } = useTranslation();

  const handleEventClick = (eventSlug: string) => {
    if (onEventClick) {
      onEventClick(eventSlug);
    } else {
      const targetUrl = (lang === 'nl' ? '/nl/evenementen/' : '/veranstaltungen/') + eventSlug;
      window.history.pushState(null, '', targetUrl);
      window.dispatchEvent(new PopStateEvent('popstate'));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const cat = params.get('category') || params.get('kategorie');
      if (cat) {
        if (cat.toLowerCase() === 'wandern' || cat.toLowerCase() === 'wandelen') return 'Wandern';
        return cat;
      }
    }
    return 'Alle';
  });
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [expandedMap, setExpandedMap] = useState<string | null>(null);
  const [expandedDescriptions, setExpandedDescriptions] = useState<Record<string, boolean>>({});

  // Date range filter state - default to upcoming events (from today onwards)
  const [startDateFilter, setStartDateFilter] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('period') === 'all') return '';
      const explicitFrom = params.get('from') || params.get('ab') || params.get('datum');
      if (explicitFrom) return explicitFrom;
      const period = params.get('period');
      if (period) {
        const now = new Date();
        if (period === 'upcoming') return getLocalDateString(now);
        if (period === 'today') return getLocalDateString(now);
        if (period === 'weekend') return getWeekendRange().start;
        if (period === '7days') return getLocalDateString(now);
        if (period === 'this_month') return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
        if (period === 'next_month') return getLocalDateString(new Date(now.getFullYear(), now.getMonth() + 1, 1));
        if (period === 'winter') return '2026-12-01';
      }
      if (params.get('to') || params.get('bis')) return '';
      return getLocalDateString(new Date());
    }
    return getLocalDateString(new Date());
  });
  const [endDateFilter, setEndDateFilter] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const explicitTo = params.get('to') || params.get('bis');
      if (explicitTo) return explicitTo;
      const period = params.get('period');
      if (period) {
        const now = new Date();
        if (period === 'upcoming') return '';
        if (period === 'today') return getLocalDateString(now);
        if (period === 'weekend') return getWeekendRange().end;
        if (period === '7days') return getLocalDateString(new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000));
        if (period === 'this_month') return getLocalDateString(new Date(now.getFullYear(), now.getMonth() + 1, 0));
        if (period === 'next_month') return getLocalDateString(new Date(now.getFullYear(), now.getMonth() + 2, 0));
        if (period === 'winter') return '2027-02-28';
      }
    }
    return '';
  });
  const [activeQuickPeriod, setActiveQuickPeriod] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('period')) return params.get('period')!;
      if (params.get('from') || params.get('to') || params.get('ab') || params.get('bis') || params.get('datum')) return 'custom';
      return 'upcoming';
    }
    return 'upcoming';
  });

  const quickPeriods = useMemo(() => [
    { id: 'upcoming', label: lang === 'nl' ? 'Vanaf vandaag' : 'Ab heute' },
    { id: 'today', label: lang === 'nl' ? 'Vandaag' : 'Heute' },
    { id: 'weekend', label: lang === 'nl' ? 'Dit weekend' : 'Dieses Wochenende' },
    { id: '7days', label: lang === 'nl' ? 'Volgende 7 dagen' : 'Nächste 7 Tage' },
    { id: 'this_month', label: lang === 'nl' ? 'Deze maand' : 'Diesen Monat' },
    { id: 'next_month', label: lang === 'nl' ? 'Volgende maand' : 'Nächsten Monat' },
    { id: 'winter', label: lang === 'nl' ? 'Winter 2026/27' : 'Winter 2026/27' },
    { id: 'all', label: lang === 'nl' ? 'Alle data' : 'Alle Termine' },
  ], [lang]);

  const handleSelectPreset = (presetId: string) => {
    const now = new Date();
    if (presetId === 'all') {
      setStartDateFilter('');
      setEndDateFilter('');
      setActiveQuickPeriod('all');
    } else if (presetId === 'upcoming') {
      const todayStr = getLocalDateString(now);
      setStartDateFilter(todayStr);
      setEndDateFilter('');
      setActiveQuickPeriod('upcoming');
    } else if (presetId === 'today') {
      const todayStr = getLocalDateString(now);
      setStartDateFilter(todayStr);
      setEndDateFilter(todayStr);
      setActiveQuickPeriod('today');
    } else if (presetId === 'weekend') {
      const { start, end } = getWeekendRange();
      setStartDateFilter(start);
      setEndDateFilter(end);
      setActiveQuickPeriod('weekend');
    } else if (presetId === '7days') {
      const start = getLocalDateString(now);
      const in7 = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      const end = getLocalDateString(in7);
      setStartDateFilter(start);
      setEndDateFilter(end);
      setActiveQuickPeriod('7days');
    } else if (presetId === 'this_month') {
      const start = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
      const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      setStartDateFilter(start);
      setEndDateFilter(getLocalDateString(lastDay));
      setActiveQuickPeriod('this_month');
    } else if (presetId === 'next_month') {
      const firstNext = new Date(now.getFullYear(), now.getMonth() + 1, 1);
      const lastNext = new Date(now.getFullYear(), now.getMonth() + 2, 0);
      setStartDateFilter(getLocalDateString(firstNext));
      setEndDateFilter(getLocalDateString(lastNext));
      setActiveQuickPeriod('next_month');
    } else if (presetId === 'winter') {
      setStartDateFilter('2026-12-01');
      setEndDateFilter('2027-02-28');
      setActiveQuickPeriod('winter');
    }
  };

  const handleCustomStartDate = (val: string) => {
    setStartDateFilter(val);
    setActiveQuickPeriod(val || endDateFilter ? 'custom' : 'all');
    if (endDateFilter && val && val > endDateFilter) {
      setEndDateFilter('');
    }
  };

  const handleCustomEndDate = (val: string) => {
    setEndDateFilter(val);
    setActiveQuickPeriod(startDateFilter || val ? 'custom' : 'all');
  };

  const resetDateFilter = () => {
    setStartDateFilter('');
    setEndDateFilter('');
    setActiveQuickPeriod('all');
  };

  // Sync URL query params with active filters
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);

      // Default state is 'upcoming' (starting from today) - keep URL clean without query noise
      if (activeQuickPeriod === 'upcoming' && !endDateFilter) {
        url.searchParams.delete('from');
        url.searchParams.delete('ab');
        url.searchParams.delete('datum');
        url.searchParams.delete('to');
        url.searchParams.delete('bis');
        url.searchParams.delete('period');
      } else {
        if (startDateFilter) {
          url.searchParams.set('from', startDateFilter);
        } else {
          url.searchParams.delete('from');
          url.searchParams.delete('ab');
          url.searchParams.delete('datum');
        }
        if (endDateFilter) {
          url.searchParams.set('to', endDateFilter);
        } else {
          url.searchParams.delete('to');
          url.searchParams.delete('bis');
        }
        if (activeQuickPeriod && activeQuickPeriod !== 'custom') {
          url.searchParams.set('period', activeQuickPeriod);
        } else {
          url.searchParams.delete('period');
        }
      }

      if (selectedCategory && selectedCategory !== 'Alle') {
        url.searchParams.set('category', selectedCategory);
      } else {
        url.searchParams.delete('category');
        url.searchParams.delete('kategorie');
      }

      const queryString = url.searchParams.toString();
      window.history.replaceState(null, '', url.pathname + (queryString ? '?' + queryString : ''));
    }
  }, [startDateFilter, endDateFilter, selectedCategory, activeQuickPeriod]);

  const toggleDescription = (key: string) => {
    setExpandedDescriptions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const allEvents = useMemo(() => {
    const list: Array<{ event: EventItem; business: Business }> = [];
    const seenEventIds = new Set<string>();
    businesses.forEach(bus => {
      if (bus.events && Array.isArray(bus.events)) {
        bus.events.forEach(ev => {
          if (!seenEventIds.has(ev.id)) {
            seenEventIds.add(ev.id);
            list.push({ event: ev, business: bus });
          }
        });
      }
    });
    return list.sort((a, b) => new Date(a.event.startDate).getTime() - new Date(b.event.startDate).getTime());
  }, [businesses]);

  const filteredEvents = useMemo(() => {
    let list = [...allEvents];
    if (selectedCategory !== 'Alle') {
      list = list.filter(item => normalizeEventCategory(item.event.category) === selectedCategory);
    }
    if (startDateFilter) {
      list = list.filter(item => {
        const eventEnd = item.event.endDate || item.event.startDate;
        return eventEnd >= startDateFilter;
      });
    }
    if (endDateFilter) {
      list = list.filter(item => {
        return item.event.startDate <= endDateFilter;
      });
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
  }, [allEvents, selectedCategory, searchQuery, startDateFilter, endDateFilter]);

  const uniqueCategories = useMemo(() => {
    const cats = new Set<string>();
    allEvents.forEach(item => {
      const normalized = normalizeEventCategory(item.event.category);
      if (normalized) cats.add(normalized);
    });
    const sorted = Array.from(cats).sort((a, b) => a.localeCompare(b, 'de'));
    return ['Alle', ...sorted];
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

      {/* Hero Header with Winterberger Wintermarkt Image */}
      <section className="relative rounded-3xl overflow-hidden shadow-xl mb-8 text-white bg-gradient-to-br from-[#200536] via-[#3B0764] to-[#4A154B] border border-purple-900/40 flex flex-col lg:block">
        {/* Hero Image (Desktop: rechts als eigenständiges Motiv mit sanftem Mask-Fade, Mobile: oben im Banner) */}
        <figure className="relative lg:absolute lg:right-0 lg:top-0 lg:bottom-0 lg:w-[48%] xl:w-[46%] m-0 h-64 sm:h-80 lg:h-full z-0 overflow-hidden">
          <img
            src="/news-winterberger-winterdorf-jubilaeum-header.jpg"
            alt={lang === 'nl' ? 'Winterberger Winterdorf marktplein met sfeervolle chalets' : 'Winterberger Wintermarkt und Winterdorf auf dem Marktplatz'}
            width={1024}
            height={701}
            fetchPriority="high"
            decoding="async"
            className="w-full h-full object-cover object-[center_60%] hero-events-mask"
          />
          <figcaption className="absolute bottom-2 right-2 lg:bottom-3 lg:right-3 text-[10px] leading-none text-white/85 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-md z-10 pointer-events-none">
            {lang === 'nl' ? 'Foto: Winterberger Winterdorf / Marktplatz' : 'Foto: Winterberger Winterdorf / Marktplatz'}
          </figcaption>
        </figure>

        {/* Hero Content */}
        <div className="relative z-10 p-6 sm:p-10 lg:p-12 max-w-xl xl:max-w-2xl">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 border border-white/20 text-white text-xs font-semibold backdrop-blur-md shadow-xs">
              <Calendar className="w-3.5 h-3.5 text-purple-200" />
              <span>{allEvents.length} {lang === 'nl' ? 'Evenementen gepland' : 'Veranstaltungen geplant'}</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-400/20 border border-amber-300/30 text-amber-200 text-xs font-semibold backdrop-blur-md">
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span>Winterberg & Region</span>
            </div>
          </div>

          <h1 className="font-display text-[clamp(28px,4.5vw,44px)] font-extrabold tracking-tight leading-[1.12] mb-3.5 text-white drop-shadow-sm">
            {lang === 'nl' ? 'Evenementenkalender' : 'Veranstaltungskalender'}
          </h1>
          
          <p className="text-[15.5px] sm:text-[17px] leading-relaxed text-white/90 font-normal drop-shadow-xs mb-5">
            {lang === 'nl' 
              ? 'Ontdek wat er te doen is in Winterberg en omgeving. Van sfeervolle wintermarkten tot sportevenementen, concerten en feesten – mis geen enkel highlight!'
              : 'Entdecke, was in Winterberg und Umgebung los ist. Vom festlichen Wintermarkt und Weltcup-Highlights über stimmungsvolle Konzerte bis hin zu urigen Hüttenabenden – alle Termine auf einen Blick.'}
          </p>

          {/* Winter Highlight Pill */}
          <div className="inline-flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-white/15 hover:bg-white/20 border border-white/25 backdrop-blur-md transition-all text-xs sm:text-sm text-white">
            <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
            <span className="font-medium">
              <strong className="font-bold text-amber-200">{lang === 'nl' ? 'Winter-Highlight: ' : 'Winter-Highlight: '}</strong>
              {lang === 'nl' ? '10 jaar Winterberger Winterdorf (11 dec. – 4 jan.)' : '10 Jahre Winterberger Winterdorf (11. Dez. – 04. Jan.)'}
            </span>
          </div>
        </div>
      </section>

      {/* Filter and Search Bar */}
      <div className="bg-[#F5F4F0] border-2 border-[#DDD7CD] rounded-3xl p-5 sm:p-6 shadow-[0_4px_24px_rgba(27,33,29,0.06)] mb-8 space-y-4">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#717E75]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={lang === 'nl' ? 'Zoek evenement of organisator...' : 'Event oder Veranstalter suchen...'}
            className="w-full pl-10 pr-10 py-2.5 bg-white border border-[#D5D0C5] rounded-xl text-[14.5px] text-[#1B211D] placeholder-[#8A958E] focus:outline-none focus:ring-2 focus:ring-[#7E22CE]/20 focus:border-[#7E22CE] transition-all shadow-xs"
          />
          {searchQuery && (
            <button type="button" onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Date & Timeframe Filter Section */}
        <div className="pt-3 border-t border-[#E2DDD3] space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-[#7E22CE]/10 flex items-center justify-center text-[#7E22CE]">
                <CalendarDays className="w-3.5 h-3.5" />
              </div>
              <span className="font-display text-xs font-bold uppercase tracking-wider text-[#7E22CE]">
                {lang === 'nl' ? 'Datum & Periode selecteren' : 'Datum & Zeitraum wählen'}
              </span>
            </div>

            {(startDateFilter || endDateFilter) && (
              <button
                type="button"
                onClick={resetDateFilter}
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#7E22CE] hover:text-[#581C87] hover:underline cursor-pointer self-start sm:self-auto"
              >
                <X className="w-3.5 h-3.5" />
                <span>{lang === 'nl' ? 'Periode wissen' : 'Zeitraum zurücksetzen'}</span>
              </button>
            )}
          </div>

          {/* Quick Period Presets */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {quickPeriods.map((preset) => {
              const isActive = activeQuickPeriod === preset.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleSelectPreset(preset.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                    isActive 
                      ? 'bg-[#7E22CE] text-white shadow-xs' 
                      : 'bg-white text-[#4A544D] border border-[#DDD7CD] hover:bg-[#FAF9F6] shadow-2xs'
                  }`}
                >
                  {preset.label}
                </button>
              );
            })}
          </div>

          {/* Interactive Date Inputs: Startdatum & Enddatum */}
          <div className="bg-white border border-[#DDD7CD] rounded-2xl p-3.5 sm:p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3.5 items-end shadow-2xs">
            <div className="lg:col-span-5">
              <label className="block text-xs font-bold text-[#1B211D] mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#7E22CE]" />
                <span>{lang === 'nl' ? 'Events tonen vanaf datum (Ab Datum):' : 'Events anzeigen ab Datum:'}</span>
              </label>
              <input
                type="date"
                value={startDateFilter}
                onChange={(e) => handleCustomStartDate(e.target.value)}
                className="w-full px-3.5 py-2 bg-[#FAF8F5] border border-[#D5D0C5] rounded-lg text-xs sm:text-sm text-[#1B211D] font-medium focus:outline-none focus:ring-2 focus:ring-[#7E22CE]/20 focus:border-[#7E22CE] transition-all cursor-pointer shadow-xs"
              />
            </div>

            <div className="lg:col-span-5">
              <label className="block text-xs font-bold text-[#1B211D] mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#7E22CE]" />
                <span>{lang === 'nl' ? 'Tot en met datum (optioneel):' : 'Bis Datum (optional):'}</span>
              </label>
              <input
                type="date"
                value={endDateFilter}
                min={startDateFilter || undefined}
                onChange={(e) => handleCustomEndDate(e.target.value)}
                className="w-full px-3.5 py-2 bg-[#FAF8F5] border border-[#D5D0C5] rounded-lg text-xs sm:text-sm text-[#1B211D] font-medium focus:outline-none focus:ring-2 focus:ring-[#7E22CE]/20 focus:border-[#7E22CE] transition-all cursor-pointer shadow-xs"
              />
            </div>

            <div className="lg:col-span-2 flex items-center">
              {(startDateFilter || endDateFilter) ? (
                <button
                  type="button"
                  onClick={resetDateFilter}
                  className="w-full py-2 px-3 text-xs font-bold text-[#717E75] hover:text-[#1B211D] bg-[#FAF8F5] hover:bg-gray-100 rounded-lg border border-[#D5D0C5] transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>{lang === 'nl' ? 'Reset' : 'Zurücksetzen'}</span>
                </button>
              ) : (
                <div className="text-[11.5px] text-[#717E75] leading-snug">
                  {lang === 'nl' ? 'Kies een datum of periode' : 'Wähle ein Datum oder Zeitraum'}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-start justify-between gap-3 pt-3 border-t border-[#E2DDD3]">
          <div className="flex flex-wrap items-center gap-1.5 flex-1 min-w-0">
            {uniqueCategories.map((type) => {
              const isActive = selectedCategory === type;
              const meta = type !== 'Alle' ? getCategoryMeta(type) : null;
              const CatIcon = meta?.Icon;
              const label = type === 'Alle' 
                ? 'Alle' 
                : (lang === 'nl' && type === 'Fest & Party' ? 'Feest & Party' : (lang === 'nl' && type === 'Konzert' ? 'Concert' : (lang === 'nl' && type === 'Wandern' ? 'Wandelen' : (lang === 'nl' && (type === 'Workshop & Kurse' || type === 'Workshop') ? 'Workshop & Cursus' : (lang === 'nl' && (type === 'Neueröffnungen' || type === 'Neueröffnung') ? 'Nieuwe openingen' : type)))));
              return (
                <button
                  key={type} type="button" onClick={() => setSelectedCategory(type)}
                  className={`px-3.5 py-1.5 rounded-lg text-[13px] font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                    isActive 
                      ? 'bg-[#7E22CE] text-white shadow-xs' 
                      : 'bg-white text-[#4A544D] border border-[#DDD7CD] hover:bg-[#FAF9F6] shadow-2xs'
                  }`}
                >
                  {CatIcon && <CatIcon className="w-3.5 h-3.5" />}
                  {label}
                </button>
              );
            })}
          </div>
          <div className="flex items-center gap-1 shrink-0 self-start md:self-auto bg-white p-1 rounded-xl border border-[#DDD7CD] shadow-2xs">
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                viewMode === 'list' ? 'bg-[#7E22CE] text-white shadow-xs' : 'text-[#5F6B63] hover:text-[#1B211D]'
              }`}
            >
              {lang === 'nl' ? 'Lijst' : 'Liste'}
            </button>
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                viewMode === 'grid' ? 'bg-[#7E22CE] text-white shadow-xs' : 'text-[#5F6B63] hover:text-[#1B211D]'
              }`}
            >
              {lang === 'nl' ? 'Raster' : 'Raster'}
            </button>
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 mb-4 px-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-semibold text-[#1B211D]">
            {filteredEvents.length} {filteredEvents.length === 1 ? (lang === 'nl' ? 'evenement gevonden' : 'Veranstaltung gefunden') : (lang === 'nl' ? 'evenementen gevonden' : 'Veranstaltungen gefunden')}
          </span>

          {/* Active Date Filter Badge */}
          {(startDateFilter || endDateFilter) && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#7E22CE]/10 text-[#7E22CE] border border-[#7E22CE]/20">
              <Calendar className="w-3 h-3 text-[#7E22CE]" />
              <span>
                {startDateFilter && endDateFilter
                  ? (startDateFilter === endDateFilter 
                      ? `${formatShortDate(startDateFilter)}` 
                      : `${formatShortDate(startDateFilter)} – ${formatShortDate(endDateFilter)}`)
                  : (startDateFilter 
                      ? (activeQuickPeriod === 'upcoming'
                          ? (lang === 'nl' ? 'Vanaf vandaag' : 'Ab heute')
                          : `${lang === 'nl' ? 'Vanaf' : 'Ab'} ${formatShortDate(startDateFilter)}`)
                      : `${lang === 'nl' ? 'Tot' : 'Bis'} ${formatShortDate(endDateFilter)}`)}
              </span>
              <button
                type="button"
                onClick={resetDateFilter}
                className="hover:text-red-600 focus:outline-none p-0.5 rounded-full hover:bg-white/80 transition-colors cursor-pointer"
                title={lang === 'nl' ? 'Filter wissen' : 'Filter entfernen'}
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {/* Active Category Badge */}
          {selectedCategory !== 'Alle' && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-200">
              <span>{selectedCategory}</span>
              <button
                type="button"
                onClick={() => setSelectedCategory('Alle')}
                className="hover:text-red-600 focus:outline-none p-0.5 rounded-full hover:bg-white/80 transition-colors cursor-pointer"
                title={lang === 'nl' ? 'Categorie wissen' : 'Kategorie entfernen'}
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
        </div>
      </div>

      {/* Events Listing */}
      <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5" : "space-y-4"}>
        {filteredEvents.length === 0 ? (
          <div className="col-span-full bg-white border border-dashed border-[#D8D2C8] rounded-2xl p-12 text-center text-[#5F6B63]">
            <Calendar className="w-10 h-10 mx-auto text-[#8A958E] mb-3" />
            <p className="text-base font-semibold text-[#1B211D] mb-1">{lang === 'nl' ? 'Geen evenementen gevonden' : 'Keine Veranstaltungen gefunden'}</p>
            <p className="text-sm text-[#717E75] max-w-md mx-auto mb-4">
              {(startDateFilter || endDateFilter)
                ? (lang === 'nl' ? 'Er zijn geen evenementen gevonden in de geselecteerde periode.' : 'In dem ausgewählten Zeitraum wurden keine Veranstaltungen gefunden.')
                : (lang === 'nl' ? 'Probeer een andere zoekterm of categorie.' : 'Bitte versuche einen anderen Suchbegriff oder eine andere Kategorie.')}
            </p>
            {(searchQuery || selectedCategory !== 'Alle' || startDateFilter || endDateFilter) && (
              <button type="button" onClick={() => { setSearchQuery(''); setSelectedCategory('Alle'); resetDateFilter(); }}
                className="px-4 py-2 bg-[#7E22CE] text-white text-xs font-semibold rounded-lg hover:bg-[#6B21A8] transition-colors cursor-pointer"
              >{lang === 'nl' ? 'Alle filters resetten' : 'Alle Filter zurücksetzen'}</button>
            )}
          </div>
        ) : (
          filteredEvents.map(({ event, business }) => {
            const title = (lang === 'nl' && event.title_nl) ? event.title_nl : event.title;
            const description = (lang === 'nl' && event.description_nl) ? event.description_nl : event.description;
            const displayCategory = normalizeEventCategory(event.category);
            const meta = getCategoryMeta(displayCategory);
            const CatIcon = meta.Icon;
            const locationStr = event.location || business.district || business.name;
            const eventKey = `${business.id}-${event.id}`;
            const isMapOpen = expandedMap === eventKey;
            const eventUrl = (lang === 'nl' && event.externalUrl_nl) ? event.externalUrl_nl : event.externalUrl;
            const eventSlug = (lang === 'nl' && event.slug_nl) ? event.slug_nl : (event.slug || event.id);
            const eventDetailPath = (lang === 'nl' ? '/nl/evenementen/' : '/veranstaltungen/') + eventSlug;
            const explicitTicketUrl = (lang === 'nl' && event.ticketUrl_nl) ? event.ticketUrl_nl : event.ticketUrl;
            const isDetectedTicketUrl = !!eventUrl && /ticket|karten|buchen|eventim|reservix|ticket\.io|pretix|standup-republic|tivents/i.test(eventUrl);
            const directTicketUrl = explicitTicketUrl || (isDetectedTicketUrl ? eventUrl : undefined);
            
            return (
              <article key={eventKey} className={`bg-white border rounded-2xl transition-all shadow-[0_2px_10px_rgba(27,33,29,0.03)] hover:shadow-[0_12px_28px_rgba(27,33,29,0.08)] border-[#EDE8E0] hover:border-[#D8D2C8] overflow-hidden ${viewMode === 'list' ? '' : 'flex flex-col'}`}>
                {/* Image for grid view */}
                {viewMode === 'grid' && (
                  event.imageUrl ? (
                    <div 
                      onClick={() => handleEventClick(eventSlug)}
                      className="w-full h-44 shrink-0 relative bg-gray-100 cursor-pointer group/img"
                    >
                      <img src={event.imageUrl} alt={title} className="w-full h-full object-cover object-top group-hover/img:scale-105 transition-transform duration-300" />
                      <div className="absolute top-3 left-3">
                        <CalendarCard startDate={event.startDate} endDate={event.endDate} />
                      </div>
                      {business.logoUrl && (
                        <div 
                          className="absolute bottom-2.5 right-2.5 w-9 h-9 rounded-lg border border-white/90 bg-white p-0.5 shadow-md flex items-center justify-center overflow-hidden z-10"
                          style={{ backgroundColor: business.logoBgColor || '#ffffff' }}
                          title={business.name}
                        >
                          <img src={business.logoUrl} alt={business.name} className="max-w-full max-h-full object-contain" />
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="w-full bg-[#FAF8F5] border-b border-[#EDE8E0] p-4 flex items-center justify-between">
                      <CalendarCard startDate={event.startDate} endDate={event.endDate} />
                      {business.logoUrl && (
                        <div 
                          className="w-10 h-10 rounded-lg border border-[#EDE8E0] bg-white p-1 shadow-2xs flex items-center justify-center overflow-hidden"
                          style={{ backgroundColor: business.logoBgColor || '#ffffff' }}
                          title={business.name}
                        >
                          <img src={business.logoUrl} alt={business.name} className="max-w-full max-h-full object-contain" />
                        </div>
                      )}
                    </div>
                  )
                )}
                
                <div className={`p-5 flex gap-4 ${viewMode === 'grid' ? 'flex-col' : 'items-start'}`}>
                  {/* Calendar card (list view) */}
                  {viewMode === 'list' && (
                    <div onClick={() => handleEventClick(eventSlug)} className="cursor-pointer hover:scale-105 transition-transform">
                      <CalendarCard startDate={event.startDate} endDate={event.endDate} />
                    </div>
                  )}

                  <div className="flex-1 min-w-0 flex flex-col">
                    <div>
                      {/* Category badge with icon */}
                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${meta.bg} ${meta.text} ${meta.border}`}>
                          <CatIcon className="w-3 h-3" />
                          {(lang === 'nl' && displayCategory === 'Fest & Party') ? 'Feest & Party' : (lang === 'nl' && displayCategory === 'Konzert' ? 'Concert' : (lang === 'nl' && displayCategory === 'Wandern' ? 'Wandelen' : (lang === 'nl' && (displayCategory === 'Workshop & Kurse' || displayCategory === 'Workshop') ? 'Workshop & Cursus' : (lang === 'nl' && (displayCategory === 'Neueröffnungen' || displayCategory === 'Neueröffnung') ? 'Nieuwe opening' : displayCategory))))}
                        </span>
                        <span className="text-[11.5px] text-[#5F6B63] font-medium">
                          {formatEventDateLong(event.startDate)}
                          {event.endDate && event.endDate !== event.startDate && ` – ${formatEventDateLong(event.endDate)}`}
                        </span>
                      </div>

                      <h2 
                        onClick={() => handleEventClick(eventSlug)}
                        className="font-display text-[18px] font-bold text-[#1B211D] leading-snug mb-1.5 hover:text-[#7E22CE] transition-colors cursor-pointer"
                      >
                        {title}
                      </h2>

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
                        {event.price && (
                          <span className="flex items-center gap-1 font-semibold text-[#1B211D] bg-[#F4F1EA] px-2 py-0.5 rounded text-xs border border-[#E7E2DA]">
                            <Ticket className="w-3.5 h-3.5 text-[#7E22CE]" />
                            {event.price}
                          </span>
                        )}
                      </div>

                      {description && (
                        <div className="mb-4">
                          <p className={`text-[13.5px] text-[#717E75] leading-relaxed transition-all ${
                            expandedDescriptions[eventKey]
                              ? ''
                              : (viewMode === 'grid' ? 'line-clamp-3' : 'line-clamp-2')
                          }`}>
                            {description}
                          </p>
                          {description.length > 140 && (
                            <button
                              type="button"
                              onClick={() => toggleDescription(eventKey)}
                              className="mt-1.5 text-xs font-bold text-[#7E22CE] hover:text-[#6B21A8] hover:underline cursor-pointer inline-flex items-center gap-1 focus:outline-none"
                            >
                              <span>
                                {expandedDescriptions[eventKey]
                                  ? (lang === 'nl' ? 'Minder weergeven' : 'Weniger anzeigen')
                                  : (lang === 'nl' ? 'Alles anzeigen' : 'Alles anzeigen')}
                              </span>
                              {expandedDescriptions[eventKey] ? (
                                <ChevronUp className="w-3.5 h-3.5" />
                              ) : (
                                <ChevronDown className="w-3.5 h-3.5" />
                              )}
                            </button>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="pt-3 border-t border-[#F0EBE1] flex flex-wrap items-center justify-between gap-3 mt-auto">
                      <button 
                        type="button" 
                        onClick={() => onBusinessSelect(business)} 
                        className="text-sm font-semibold text-[#0F4C2E] hover:underline flex items-center gap-2 cursor-pointer group text-left min-w-0"
                      >
                        {business.logoUrl ? (
                          <div 
                            className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg border border-[#EDE8E0] bg-white p-0.5 shrink-0 flex items-center justify-center overflow-hidden shadow-2xs group-hover:border-[#7E22CE]/40 transition-colors"
                            style={{ backgroundColor: business.logoBgColor || '#ffffff' }}
                          >
                            <img 
                              src={business.logoUrl} 
                              alt={business.name} 
                              className="max-w-full max-h-full object-contain"
                              loading="lazy"
                            />
                          </div>
                        ) : (
                          <div className="w-7 h-7 rounded-lg bg-[#0F4C2E]/10 flex items-center justify-center shrink-0 text-[#0F4C2E]">
                            <Building2 className="w-4 h-4" />
                          </div>
                        )}
                        <span className="truncate">{business.name}</span>
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

                        {/* Direct Ticket Link if available */}
                        {directTicketUrl && (
                          <a
                            href={directTicketUrl}
                            target="_blank"
                            rel={event.isPremium ? "noopener noreferrer" : "nofollow noopener noreferrer"}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 text-[#7E22CE] border border-purple-200 text-xs font-bold transition-colors"
                            title={lang === 'nl' ? 'Tickets direct bestellen' : 'Tickets direkt buchen'}
                          >
                            <Ticket className="w-3 h-3" />
                            <span>Tickets</span>
                            <ExternalLink className="w-2.5 h-2.5 opacity-70" />
                          </a>
                        )}

                        {/* Main Detail Page Link */}
                        <a
                          href={eventDetailPath}
                          onClick={(e) => {
                            e.preventDefault();
                            handleEventClick(eventSlug);
                          }}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#7E22CE] hover:bg-[#6B21A8] text-white text-xs font-semibold transition-colors cursor-pointer shadow-2xs"
                        >
                          <span>{lang === 'nl' ? 'Meer info' : 'Mehr erfahren'}</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>

                    {/* Expandable Map */}
                    {isMapOpen && locationStr && (
                      <EventMap location={locationStr} lang={lang} />
                    )}
                  </div>

                  {/* Thumbnail in list view (sm+ screens) */}
                  {viewMode === 'list' && (
                    event.imageUrl ? (
                      <div 
                        onClick={() => handleEventClick(eventSlug)}
                        className="hidden sm:block w-36 h-28 shrink-0 rounded-xl overflow-hidden border border-[#EDE8E0] self-start ml-2 bg-gray-100 shadow-xs relative cursor-pointer hover:scale-[1.02] transition-transform"
                      >
                        <img src={event.imageUrl} alt={title} className="w-full h-full object-cover" />
                        {business.logoUrl && (
                          <div 
                            className="absolute bottom-1.5 right-1.5 w-6 h-6 rounded border border-white/90 bg-white p-0.5 shadow-xs flex items-center justify-center overflow-hidden"
                            style={{ backgroundColor: business.logoBgColor || '#ffffff' }}
                            title={business.name}
                          >
                            <img src={business.logoUrl} alt={business.name} className="max-w-full max-h-full object-contain" />
                          </div>
                        )}
                      </div>
                    ) : business.logoUrl ? (
                      <div 
                        onClick={() => handleEventClick(eventSlug)}
                        className="hidden sm:flex w-28 h-24 shrink-0 rounded-xl border border-[#EDE8E0] self-start ml-2 p-2.5 items-center justify-center shadow-2xs cursor-pointer hover:border-[#7E22CE]/40 transition-colors"
                        style={{ backgroundColor: business.logoBgColor || '#ffffff' }}
                        title={business.name}
                      >
                        <img src={business.logoUrl} alt={business.name} className="max-w-full max-h-full object-contain" />
                      </div>
                    ) : null
                  )}
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
