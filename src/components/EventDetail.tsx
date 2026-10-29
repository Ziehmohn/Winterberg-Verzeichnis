import React, { useState, useEffect, useMemo } from 'react';
import { Business, EventItem, ThemeConfig } from '../types';
import { useTranslation } from '../i18n';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Ticket, 
  ExternalLink, 
  ArrowLeft, 
  Building2, 
  Navigation, 
  Compass, 
  Trophy, 
  Sparkles, 
  Music, 
  PartyPopper, 
  GraduationCap, 
  Palette, 
  Megaphone, 
  Utensils, 
  Store, 
  ChevronRight, 
  CalendarDays,
  Share2,
  Mail,
  Newspaper,
  Info
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { DISTRICT_COORDINATES } from './BusinessMap';
import { getBusinessPath, getEventPath, slugify } from '../utils/routes';
import { normalizeEventCategory } from '../utils/eventUtils';
import { generateEventSchema } from '../utils/schemaGenerator';
import { businesses as initialBusinesses } from '../data';
import ShareButton from './ShareButton';

interface EventDetailProps {
  eventSlug: string;
  businesses: Business[];
  theme: ThemeConfig;
  activeThemeKey: string;
  onBack: () => void;
  onBusinessSelect: (business: Business) => void;
  onEventClick?: (slug: string) => void;
}

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

// Known event venues in Winterberg with coordinates
const KNOWN_EVENT_VENUES: Record<string, [number, number]> = {
  'eisarena': [51.18349, 8.50882],
  'veltins': [51.18349, 8.50882],
  'bobbahn': [51.18349, 8.50882],
  'poppenberg': [51.19259, 8.50898],
  'skiliftkarussell': [51.19259, 8.50898],
  'oversum': [51.19667, 8.53886],
  'am kurpark': [51.19667, 8.53886],
  'kurpark': [51.19667, 8.53886],
  'schützenhalle niedersfeld': [51.2588, 8.5297],
  'niedersfeld': [51.2588, 8.5297],
  'untere pforte': [51.19449, 8.53251],
  'marktplatz': [51.19449, 8.53251],
  'winterdorf': [51.19449, 8.53251],
  'wintermarkt': [51.19449, 8.53251],
  'möppi': [51.19726, 8.51181],
  'büre': [51.19726, 8.51181],
  'nordhang': [51.18492, 8.48927],
    'renau': [51.18492, 8.48927],
  // Grönebach
  'grönebach': [51.2359, 8.5583],
  'lambertus': [51.2359, 8.5583],
  // Siedlinghausen
  'siedlinghausen': [51.2505, 8.4901],
  // Silbach
  'silbach': [51.2263, 8.4727],
  // St. Jakobus Winterberg
  'jakobus': [51.1956, 8.5338],
  'tenne': [51.1942, 8.5332],
  'hessenkeller': [51.1951, 8.5336],
  'blackwater': [51.1948, 8.5341],
  'borgs scheune': [51.1601, 8.5638],
  'züschen': [51.1601, 8.5638],
  // Hildfeld / Hochsauerlandhalle
  'hochsauerlandhalle': [51.2536, 8.5667],
  'hildfeld': [51.2536, 8.5667],
};

function getKnownOrDistrictCoordinates(location: string): [number, number] {
  if (!location) return [51.1956, 8.5338];
  const lower = location.toLowerCase();
  for (const [key, coords] of Object.entries(KNOWN_EVENT_VENUES)) {
    if (lower.includes(key)) {
      return coords;
    }
  }
  for (const [district, coords] of Object.entries(DISTRICT_COORDINATES)) {
    if (lower.includes(district.toLowerCase())) {
      return coords;
    }
  }
  return [51.1956, 8.5338];
}

const violetEventIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function SetViewOnPosition({ position }: { position: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.invalidateSize();
    map.setView(position, 15);
  }, [position, map]);
  return null;
}

// Download iCalendar (.ics) file helper
function downloadICSFile(event: EventItem, locationStr: string) {
  const cleanTitle = event.title.replace(/,/g, '\\,');
  const cleanDesc = (event.description || '').replace(/\n/g, '\\n').replace(/,/g, '\\,');
  const cleanLoc = locationStr.replace(/,/g, '\\,');

  const startFormatted = event.startDate.replace(/-/g, '');
  const startTimeFormatted = event.startTime ? event.startTime.replace(/:/g, '') + '00' : '090000';
  const startFull = `${startFormatted}T${startTimeFormatted}`;

  const endBaseDate = event.endDate || event.startDate;
  const endFormatted = endBaseDate.replace(/-/g, '');
  const endTimeFormatted = event.endTime ? event.endTime.replace(/:/g, '') + '00' : (event.startTime ? '180000' : '180000');
  const endFull = `${endFormatted}T${endTimeFormatted}`;

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Winterberg Verzeichnis//Veranstaltungen//DE',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${event.id}@winterberg-verzeichnis.de`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
    `DTSTART:${startFull}`,
    `DTEND:${endFull}`,
    `SUMMARY:${cleanTitle}`,
    `DESCRIPTION:${cleanDesc}`,
    `LOCATION:${cleanLoc}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${slugify(event.title)}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Simple markdown paragraphs & bold/links renderer
function renderFormattedEventDescription(text: string) {
  if (!text) return null;

  const paragraphs = text.split(/\n\s*\n/);

  return paragraphs.map((para, pIdx) => {
    const trimmed = para.trim();
    if (!trimmed) return null;

    // Bullet points
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ') || trimmed.includes('\n- ') || trimmed.includes('\n* ')) {
      const lines = trimmed.split('\n');
      return (
        <ul key={pIdx} className="space-y-2 my-4 list-disc list-inside text-[#3F4B42] leading-relaxed">
          {lines.map((l, lIdx) => {
            const cleanLine = l.replace(/^[-*•]\s*/, '').trim();
            if (!cleanLine) return null;
            return (
              <li key={lIdx} className="pl-1">
                {renderInlineTokens(cleanLine)}
              </li>
            );
          })}
        </ul>
      );
    }

    return (
      <p key={pIdx} className="text-[16px] sm:text-[17px] text-[#3F4B42] leading-relaxed mb-4">
        {renderInlineTokens(trimmed)}
      </p>
    );
  });
}

function renderInlineTokens(str: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  const regex = /(\[([^\]]+)\]\(([^)]+)\))|(\*\*([^*]+)\*\*)|(\*([^*]+)\*)|(https?:\/\/[^\s]+)/g;
  let cursor = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(str)) !== null) {
    if (match.index > cursor) {
      parts.push(str.substring(cursor, match.index));
    }
    if (match[1]) {
      // [text](url)
      parts.push(
        <a 
          key={match.index} 
          href={match[3]} 
          target={match[3].startsWith('/') ? '_self' : '_blank'} 
          rel={match[3].startsWith('/') ? undefined : 'noopener noreferrer'} 
          className="text-[#7E22CE] font-semibold underline underline-offset-4 decoration-[#7E22CE]/40 hover:text-[#581C87]"
        >
          {match[2]}
        </a>
      );
    } else if (match[4]) {
      // **bold**
      parts.push(<strong key={match.index} className="font-bold text-[#1B211D]">{match[5]}</strong>);
    } else if (match[6]) {
      // *italic*
      parts.push(<em key={match.index} className="italic text-[#5F6B63]">{match[7]}</em>);
    } else if (match[8]) {
      // raw URL
      parts.push(
        <a 
          key={match.index} 
          href={match[8]} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-[#7E22CE] font-semibold underline underline-offset-4 decoration-[#7E22CE]/40 hover:text-[#581C87]"
        >
          {match[8]}
        </a>
      );
    }
    cursor = match.index + match[0].length;
  }

  if (cursor < str.length) {
    parts.push(str.substring(cursor));
  }

  return parts;
}

export default function EventDetail({
  eventSlug,
  businesses,
  theme,
  activeThemeKey,
  onBack,
  onBusinessSelect,
  onEventClick
}: EventDetailProps) {
  const { t, lang } = useTranslation();
  const isNl = lang === 'nl';

  // 1. Resolve event from businesses (prop or fallback initialBusinesses)
  const resolved = useMemo(() => {
    const cleanTarget = slugify(decodeURIComponent(eventSlug));
    const targetRaw = decodeURIComponent(eventSlug).toLowerCase();

    const pool = (businesses && businesses.length > 0) ? businesses : initialBusinesses;

    for (const bus of pool) {
      if (bus.events && Array.isArray(bus.events)) {
        for (const ev of bus.events) {
          const evCleanId = slugify(ev.id);
          const evCleanSlug = ev.slug ? slugify(ev.slug) : '';
          const evCleanSlugNl = ev.slug_nl ? slugify(ev.slug_nl) : '';
          const evTitleClean = slugify(ev.title);
          const evTitleNlClean = ev.title_nl ? slugify(ev.title_nl) : '';

          if (
            ev.id.toLowerCase() === targetRaw ||
            evCleanId === cleanTarget ||
            (ev.slug && ev.slug.toLowerCase() === targetRaw) ||
            evCleanSlug === cleanTarget ||
            (ev.slug_nl && ev.slug_nl.toLowerCase() === targetRaw) ||
            evCleanSlugNl === cleanTarget ||
            evTitleClean === cleanTarget ||
            evTitleNlClean === cleanTarget
          ) {
            return { event: ev, business: bus };
          }
        }
      }
    }

    return null;
  }, [eventSlug, businesses]);

  const event = resolved?.event;
  const business = resolved?.business;

  // 2. SEO Title & Schema.org JSON-LD
  useEffect(() => {
    if (!event) return;

    const eventTitle = (isNl && event.title_nl) ? event.title_nl : event.title;
    const originalTitle = document.title;
    document.title = `${eventTitle} – ${isNl ? 'Evenement in Winterberg' : 'Veranstaltung in Winterberg'} | Winterberg Verzeichnis`;

    // Inject Schema.org
    const scriptId = 'schema-event-detail';
    let scriptTag = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = scriptId;
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }
    const schemaObj = generateEventSchema(event, business, isNl ? 'nl' : 'de');
    scriptTag.text = JSON.stringify(schemaObj);

    return () => {
      document.title = originalTitle;
      const tag = document.getElementById(scriptId);
      if (tag) tag.remove();
    };
  }, [event, business, isNl]);

  // Date formatting helpers
  const formatEventDateLong = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString(isNl ? 'nl-NL' : 'de-DE', {
      weekday: 'long', day: '2-digit', month: 'long', year: 'numeric'
    });
  };

  const getCalendarMeta = (startDate: string, endDate?: string) => {
    const d = new Date(startDate);
    const day = d.getDate();
    const month = d.toLocaleDateString(isNl ? 'nl-NL' : 'de-DE', { month: 'short' }).toUpperCase().replace('.', '');
    const weekday = d.toLocaleDateString(isNl ? 'nl-NL' : 'de-DE', { weekday: 'short' }).replace('.', '');
    const isMultiDay = endDate && endDate !== startDate;
    const endObj = isMultiDay ? new Date(endDate) : null;
    const endDisplay = endObj ? `– ${endObj.getDate()}.${endObj.toLocaleDateString(isNl ? 'nl-NL' : 'de-DE', { month: 'short' }).replace('.', '')}` : null;
    return { day, month, weekday, isMultiDay, endDisplay };
  };

  // Other upcoming events
  const otherUpcomingEvents = useMemo(() => {
    if (!event) return [];
    const pool = (businesses && businesses.length > 0) ? businesses : initialBusinesses;
    const list: Array<{ event: EventItem; business: Business }> = [];
    const seen = new Set<string>();
    const today = new Date().toISOString().split('T')[0];

    pool.forEach(b => {
      if (b.events && Array.isArray(b.events)) {
        b.events.forEach(e => {
          if (e.id !== event.id && !seen.has(e.id)) {
            const end = e.endDate || e.startDate;
            if (end >= today) {
              seen.add(e.id);
              list.push({ event: e, business: b });
            }
          }
        });
      }
    });

    return list
      .sort((a, b) => new Date(a.event.startDate).getTime() - new Date(b.event.startDate).getTime())
      .slice(0, 3);
  }, [event, businesses]);

  // If event not found
  if (!resolved || !event || !business) {
    return (
      <main className="flex-1 w-full max-w-[900px] mx-auto px-4 sm:px-6 py-12 text-center">
        <div className="bg-white border border-dashed border-[#D8D2C8] rounded-3xl p-12 shadow-sm max-w-lg mx-auto">
          <Calendar className="w-12 h-12 mx-auto text-[#8A958E] mb-4" />
          <h1 className="font-display text-2xl font-bold text-[#1B211D] mb-2">
            {isNl ? 'Evenement niet gevonden' : 'Veranstaltung nicht gefunden'}
          </h1>
          <p className="text-sm text-[#717E75] mb-6">
            {isNl 
              ? 'Het opgevraagde evenement bestaat niet meer of is verplaatst.' 
              : 'Das gesuchte Event existiert leider nicht mehr oder wurde verschoben.'}
          </p>
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#7E22CE] text-white font-semibold text-sm rounded-xl hover:bg-[#6B21A8] transition-colors cursor-pointer shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{isNl ? 'Terug naar het overzicht' : 'Zurück zum Veranstaltungskalender'}</span>
          </button>
        </div>
      </main>
    );
  }

  const title = (isNl && event.title_nl) ? event.title_nl : event.title;
  const description = (isNl && event.description_nl) ? event.description_nl : event.description;
  const displayCategory = normalizeEventCategory(event.category);
  const meta = getCategoryMeta(displayCategory);
  const CatIcon = meta.Icon;
  const locationStr = event.location || business.district || business.name;
  const position = getKnownOrDistrictCoordinates(locationStr);
  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(locationStr + ', Winterberg')}`;

  // Ticket link & external link logic
  const rawUrl = (isNl && event.externalUrl_nl) ? event.externalUrl_nl : event.externalUrl;
  const explicitTicketUrl = (isNl && event.ticketUrl_nl) ? event.ticketUrl_nl : event.ticketUrl;

  const isDetectedTicketUrl = !!rawUrl && /ticket|karten|buchen|eventim|reservix|ticket\.io|pretix|standup-republic|tivents/i.test(rawUrl);
  const ticketUrl = explicitTicketUrl || (isDetectedTicketUrl ? rawUrl : undefined);

  const isInternalNewsUrl = !!rawUrl && (rawUrl.startsWith('/news') || rawUrl.startsWith('/nachrichten') || rawUrl.startsWith('/nl/nieuws'));
  const isMailUrl = !!rawUrl && rawUrl.startsWith('mailto:');
  const externalInfoUrl = (!isDetectedTicketUrl && !isInternalNewsUrl && !isMailUrl && rawUrl) ? rawUrl : undefined;

  const calMeta = getCalendarMeta(event.startDate, event.endDate);

  const handleNavigateToEvent = (slug: string) => {
    if (onEventClick) {
      onEventClick(slug);
    } else {
      const targetUrl = isNl ? `/nl/evenementen/${slug}` : `/veranstaltungen/${slug}`;
      window.history.pushState(null, '', targetUrl);
      window.dispatchEvent(new PopStateEvent('popstate'));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <main className="flex-1 w-full max-w-[1080px] mx-auto px-4 sm:px-6 py-6 sm:py-10 pb-28">
      {/* Top Navigation / Breadcrumb */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <button 
          type="button" 
          onClick={onBack} 
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-[#EDE8E0] text-[#1B211D] hover:text-[#7E22CE] hover:border-[#7E22CE]/40 text-[13px] font-semibold transition-colors cursor-pointer shadow-2xs"
        >
          <ArrowLeft className="w-4 h-4 text-[#7E22CE]" />
          <span>{isNl ? 'Terug naar alle evenementen' : 'Zurück zum Veranstaltungskalender'}</span>
        </button>

        <ShareButton 
          title={title} 
          text={`${title} – ${event.startDate} in Winterberg`} 
        />
      </div>

      {/* Main Grid: Left Details & Right Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (Content & Media) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Hero Card */}
          <div className="bg-white border border-[#EDE8E0] rounded-3xl overflow-hidden shadow-sm">
            {/* Image (if available) */}
            {event.imageUrl ? (
              <div className="w-full h-64 sm:h-96 relative bg-gray-100 overflow-hidden">
                <img 
                  src={event.imageUrl} 
                  alt={title} 
                  className="w-full h-full object-cover object-center" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                
                {/* Overlay Badge */}
                <div className="absolute top-4 left-4">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold shadow-md backdrop-blur-md bg-white/95 text-[#7E22CE] border border-white`}>
                    <CatIcon className="w-3.5 h-3.5" />
                    <span>{displayCategory}</span>
                  </span>
                </div>

                {business.logoUrl && (
                  <div 
                    onClick={() => onBusinessSelect(business)}
                    className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-md rounded-xl p-1.5 shadow-lg border border-white/80 cursor-pointer hover:scale-105 transition-transform flex items-center gap-2 max-w-[220px]"
                    title={business.name}
                  >
                    <div 
                      className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center p-0.5"
                      style={{ backgroundColor: business.logoBgColor || '#ffffff' }}
                    >
                      <img src={business.logoUrl} alt={business.name} className="max-w-full max-h-full object-contain" />
                    </div>
                    <span className="text-xs font-bold text-[#1B211D] truncate pr-1">{business.name}</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="w-full p-6 sm:p-8 bg-gradient-to-br from-[#3B0764] via-[#4C1D95] to-[#581C87] text-white relative">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/20 text-white backdrop-blur-sm border border-white/20 mb-3">
                  <CatIcon className="w-3.5 h-3.5 text-purple-200" />
                  <span>{displayCategory}</span>
                </div>
              </div>
            )}

            {/* Title & Key Header Info */}
            <div className="p-6 sm:p-8">
              {!event.imageUrl && (
                <div className="flex items-center gap-2 flex-wrap mb-3">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${meta.bg} ${meta.text} ${meta.border}`}>
                    <CatIcon className="w-3.5 h-3.5" />
                    <span>{displayCategory}</span>
                  </span>
                </div>
              )}

              <h1 className="font-display text-[26px] sm:text-[34px] font-extrabold text-[#1B211D] leading-tight mb-4">
                {title}
              </h1>

              {/* Quick Meta Badges Row */}
              <div className="flex flex-wrap items-center gap-3 text-sm text-[#5F6B63] pt-1 pb-4 border-b border-[#F0EBE1]">
                <div className="inline-flex items-center gap-2 text-[#7E22CE] font-bold bg-purple-50 px-3 py-1.5 rounded-xl border border-purple-100">
                  <Calendar className="w-4 h-4 text-[#7E22CE]" />
                  <span>
                    {formatEventDateLong(event.startDate)}
                    {event.endDate && event.endDate !== event.startDate && ` – ${formatEventDateLong(event.endDate)}`}
                  </span>
                </div>

                {(event.startTime || event.endTime) && (
                  <div className="inline-flex items-center gap-1.5 bg-[#FAF8F5] px-3 py-1.5 rounded-xl border border-[#EDE8E0] font-medium text-[#1B211D]">
                    <Clock className="w-4 h-4 text-[#8A958E]" />
                    <span>{event.startTime || '?'}{event.endTime ? ` – ${event.endTime}` : ' Uhr'}</span>
                  </div>
                )}

                {locationStr && (
                  <div className="inline-flex items-center gap-1.5 bg-[#EAF2EC] px-3 py-1.5 rounded-xl border border-[#0F4C2E]/20 text-[#0F4C2E] font-semibold">
                    <MapPin className="w-4 h-4" />
                    <span className="truncate max-w-[260px]">{locationStr}</span>
                  </div>
                )}

                {event.price && (
                  <div className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-900 border border-amber-200 px-3 py-1.5 rounded-xl font-bold">
                    <Ticket className="w-4 h-4 text-amber-700" />
                    <span>{event.price}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons Bar */}
              <div className="pt-6 flex flex-wrap items-center gap-3">
                {/* 1. Ticket purchase button */}
                {ticketUrl && (
                  <a
                    href={ticketUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#7E22CE] hover:bg-[#6B21A8] text-white text-sm font-bold shadow-md hover:shadow-lg transition-all cursor-pointer"
                  >
                    <Ticket className="w-4 h-4" />
                    <span>{isNl ? 'Tickets bestellen' : 'Tickets kaufen / buchen'}</span>
                    <ExternalLink className="w-4 h-4 opacity-80" />
                  </a>
                )}

                {/* 2. External official site link */}
                {externalInfoUrl && (
                  <a
                    href={externalInfoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white border border-[#EDE8E0] hover:border-[#7E22CE] text-[#1B211D] hover:text-[#7E22CE] text-sm font-semibold transition-all cursor-pointer shadow-2xs"
                  >
                    <span>{isNl ? 'Officiële website' : 'Offizielle Website & Infos'}</span>
                    <ExternalLink className="w-4 h-4 opacity-70" />
                  </a>
                )}

                {/* 3. Internal news report link */}
                {isInternalNewsUrl && (
                  <a
                    href={rawUrl}
                    onClick={(e) => {
                      e.preventDefault();
                      window.history.pushState(null, '', rawUrl);
                      window.dispatchEvent(new PopStateEvent('popstate'));
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 text-emerald-800 text-sm font-bold transition-all cursor-pointer"
                  >
                    <Newspaper className="w-4 h-4 text-emerald-700" />
                    <span>{isNl ? 'Lees nieuwsbericht' : 'Zum ausführlichen Bericht'}</span>
                    <ChevronRight className="w-4 h-4" />
                  </a>
                )}

                {/* 4. Mailto registration */}
                {isMailUrl && (
                  <a
                    href={rawUrl}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#0F4C2E] hover:bg-[#186841] text-white text-sm font-bold shadow-md transition-all cursor-pointer"
                  >
                    <Mail className="w-4 h-4" />
                    <span>{isNl ? 'Aanmelden via e-mail' : 'Per E-Mail anmelden'}</span>
                  </a>
                )}

                {/* 5. Add to calendar button */}
                <button
                  type="button"
                  onClick={() => downloadICSFile(event, locationStr)}
                  className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-[#FAF8F5] border border-[#E7E2DA] hover:bg-white text-[#5F6B63] hover:text-[#1B211D] text-sm font-semibold transition-colors cursor-pointer"
                  title={isNl ? 'Voeg toe aan agenda' : 'Im Kalender speichern'}
                >
                  <CalendarDays className="w-4 h-4 text-[#7E22CE]" />
                  <span>{isNl ? 'In agenda opslaan' : 'Kalender-Eintrag (.ics)'}</span>
                </button>
              </div>

              {/* Event Description */}
              <div className="mt-8 pt-6 border-t border-[#F0EBE1]">
                <h2 className="font-display text-xl font-bold text-[#1B211D] mb-4">
                  {isNl ? 'Over dit evenement' : 'Über diese Veranstaltung'}
                </h2>

                <div className="prose prose-purple max-w-none">
                  {renderFormattedEventDescription(description)}
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Map Card */}
          {locationStr && (
            <div className="bg-white border border-[#EDE8E0] rounded-3xl p-6 sm:p-7 shadow-sm">
              <div className="flex items-center justify-between gap-4 mb-4">
                <div>
                  <h2 className="font-display text-lg font-bold text-[#1B211D] flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-[#7E22CE]" />
                    <span>{isNl ? 'Locatie & Route' : 'Veranstaltungsort & Anfahrt'}</span>
                  </h2>
                  <p className="text-sm text-[#5F6B63] mt-0.5">{locationStr}</p>
                </div>
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#7E22CE] hover:bg-[#6B21A8] text-white text-xs font-semibold shadow-xs transition-colors shrink-0"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>{isNl ? 'Route plannen' : 'Route planen'}</span>
                </a>
              </div>

              <div className="w-full h-64 rounded-2xl overflow-hidden border border-[#EDE8E0] relative shadow-inner">
                <MapContainer
                  center={position}
                  zoom={15}
                  style={{ height: '100%', width: '100%' }}
                  zoomControl={true}
                  scrollWheelZoom={false}
                >
                  <SetViewOnPosition position={position} />
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <Marker position={position} icon={violetEventIcon} />
                </MapContainer>
              </div>
            </div>
          )}
        </div>

        {/* Right Column (Sidebar: Key Facts & Organizer) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Key Facts Box */}
          <div className="bg-white border border-[#EDE8E0] rounded-3xl p-6 shadow-sm">
            <h3 className="font-display text-base font-bold text-[#1B211D] mb-4 pb-3 border-b border-[#F0EBE1] flex items-center gap-2">
              <Info className="w-4 h-4 text-[#7E22CE]" />
              <span>{isNl ? 'Overzicht gegevens' : 'Alle Details auf einen Blick'}</span>
            </h3>

            <div className="space-y-4 text-sm">
              {/* Calendar Badge & Date */}
              <div className="flex items-start gap-3.5">
                <div className="w-[52px] h-[54px] rounded-xl overflow-hidden border border-[#E7E2DA] shadow-xs bg-white flex flex-col text-center select-none shrink-0">
                  <div className="bg-[#7E22CE] text-white text-[8px] font-extrabold tracking-widest py-[2px] leading-none">
                    {calMeta.month}
                  </div>
                  <div className="flex-1 flex flex-col items-center justify-center px-0.5">
                    <span className="font-display text-[18px] font-black text-[#1B211D] leading-none">
                      {calMeta.day}
                    </span>
                    <span className="text-[8px] font-semibold text-[#8A958E] leading-none mt-0.5">
                      {calMeta.weekday}
                    </span>
                  </div>
                </div>

                <div className="min-w-0">
                  <span className="text-xs font-semibold text-[#8A958E] block uppercase tracking-wider">
                    {isNl ? 'Datum' : 'Datum'}
                  </span>
                  <span className="font-bold text-[#1B211D] block mt-0.5">
                    {formatEventDateLong(event.startDate)}
                  </span>
                  {event.endDate && event.endDate !== event.startDate && (
                    <span className="text-xs text-[#5F6B63] block mt-0.5">
                      {isNl ? 'tot' : 'bis'} {formatEventDateLong(event.endDate)}
                    </span>
                  )}
                </div>
              </div>

              {/* Time */}
              {(event.startTime || event.endTime) && (
                <div className="flex items-start gap-3.5 pt-3 border-t border-[#F5F2EC]">
                  <div className="w-9 h-9 rounded-xl bg-purple-50 text-[#7E22CE] flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-[#8A958E] block uppercase tracking-wider">
                      {isNl ? 'Tijdstip' : 'Uhrzeit'}
                    </span>
                    <span className="font-bold text-[#1B211D] block mt-0.5">
                      {event.startTime || '?'}{event.endTime ? ` – ${event.endTime}` : ' Uhr'}
                    </span>
                  </div>
                </div>
              )}

              {/* Location */}
              {locationStr && (
                <div className="flex items-start gap-3.5 pt-3 border-t border-[#F5F2EC]">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#0F4C2E] flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-[#8A958E] block uppercase tracking-wider">
                      {isNl ? 'Locatie' : 'Veranstaltungsort'}
                    </span>
                    <span className="font-bold text-[#1B211D] block mt-0.5">
                      {locationStr}
                    </span>
                  </div>
                </div>
              )}

              {/* Price / Admission */}
              {event.price && (
                <div className="flex items-start gap-3.5 pt-3 border-t border-[#F5F2EC]">
                  <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                    <Ticket className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-[#8A958E] block uppercase tracking-wider">
                      {isNl ? 'Toegang / Prijs' : 'Eintritt / Tickets'}
                    </span>
                    <span className="font-bold text-[#1B211D] block mt-0.5">
                      {event.price}
                    </span>
                  </div>
                </div>
              )}

              {/* Category */}
              <div className="flex items-start gap-3.5 pt-3 border-t border-[#F5F2EC]">
                <div className={`w-9 h-9 rounded-xl ${meta.bg} ${meta.text} flex items-center justify-center shrink-0`}>
                  <CatIcon className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-[#8A958E] block uppercase tracking-wider">
                    {isNl ? 'Categorie' : 'Kategorie'}
                  </span>
                  <span className="font-bold text-[#1B211D] block mt-0.5">
                    {displayCategory}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Organizer / Presenter Card */}
          <div className="bg-white border border-[#EDE8E0] rounded-3xl p-6 shadow-sm">
            <span className="text-xs font-bold text-[#7E22CE] uppercase tracking-wider block mb-3">
              {isNl ? 'Georganiseerd door' : 'Veranstalter & Organisation'}
            </span>

            <div className="flex items-center gap-3.5 mb-4">
              {business.logoUrl ? (
                <div 
                  className="w-12 h-12 rounded-xl border border-[#EDE8E0] bg-white p-1 shadow-2xs flex items-center justify-center overflow-hidden shrink-0"
                  style={{ backgroundColor: business.logoBgColor || '#ffffff' }}
                >
                  <img src={business.logoUrl} alt={business.name} className="max-w-full max-h-full object-contain" />
                </div>
              ) : (
                <div className="w-12 h-12 rounded-xl bg-[#0F4C2E]/10 text-[#0F4C2E] flex items-center justify-center shrink-0">
                  <Building2 className="w-6 h-6" />
                </div>
              )}

              <div className="min-w-0">
                <h4 className="font-display font-bold text-[#1B211D] text-base leading-snug truncate">
                  {business.name}
                </h4>
                {business.district && (
                  <p className="text-xs text-[#5F6B63] mt-0.5 truncate">{business.district}, Winterberg</p>
                )}
              </div>
            </div>

            {business.description && (
              <p className="text-xs text-[#717E75] line-clamp-3 mb-4 leading-relaxed">
                {business.description}
              </p>
            )}

            <button
              type="button"
              onClick={() => onBusinessSelect(business)}
              className="w-full py-2.5 px-4 rounded-xl bg-[#FAF8F5] border border-[#E7E2DA] hover:border-[#0F4C2E] text-[#0F4C2E] font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>{isNl ? 'Bedrijfsprofiel bekijken' : 'Unternehmensprofil ansehen'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* More Upcoming Events in Winterberg */}
          {otherUpcomingEvents.length > 0 && (
            <div className="bg-white border border-[#EDE8E0] rounded-3xl p-6 shadow-sm">
              <h3 className="font-display text-base font-bold text-[#1B211D] mb-4 pb-3 border-b border-[#F0EBE1]">
                {isNl ? 'Meer evenementen' : 'Weitere Termine & Highlights'}
              </h3>

              <div className="space-y-3.5">
                {otherUpcomingEvents.map(({ event: otherEv, business: otherBus }) => {
                  const otherTitle = (isNl && otherEv.title_nl) ? otherEv.title_nl : otherEv.title;
                  const otherDate = new Date(otherEv.startDate).toLocaleDateString(isNl ? 'nl-NL' : 'de-DE', {
                    day: '2-digit', month: 'short'
                  });

                  return (
                    <div 
                      key={otherEv.id}
                      onClick={() => handleNavigateToEvent(otherEv.slug || otherEv.id)}
                      className="group p-3 rounded-2xl border border-[#EDE8E0] hover:border-[#7E22CE]/40 bg-[#FAF8F5] hover:bg-white transition-all cursor-pointer flex items-center gap-3"
                    >
                      <div className="w-10 h-10 rounded-xl bg-purple-100/60 text-[#7E22CE] font-bold text-xs flex flex-col items-center justify-center shrink-0 leading-tight">
                        <span>{otherDate}</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <h5 className="font-display font-bold text-xs text-[#1B211D] group-hover:text-[#7E22CE] transition-colors truncate">
                          {otherTitle}
                        </h5>
                        <p className="text-[11px] text-[#8A958E] truncate mt-0.5">
                          {otherEv.location || otherBus.name}
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[#8A958E] group-hover:text-[#7E22CE] group-hover:translate-x-0.5 transition-all shrink-0" />
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
