import React, { useState, useMemo } from 'react';
import { useTranslation } from '../i18n';
import { 
  Trash2, 
  Calendar, 
  Download, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Info, 
  Truck, 
  HelpCircle,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  Filter,
  FileDown,
  RotateCcw
} from 'lucide-react';
import { ThemeConfig, WasteBinType } from '../types';
import { 
  WINTERBERG_DISTRICTS, 
  DISTRICT_SCHEDULES, 
  BIN_TYPE_CONFIG, 
  RECYCLING_CENTER_INFO,
  DISTRICT_PDF_MAP,
  ALL_DISTRICTS_PDF,
  getISOWeek,
  generateIcsCalendar 
} from '../utils/wasteCalendarData';

interface WasteCalendarPageProps {
  theme?: ThemeConfig;
  onBack?: () => void;
}

const MONTH_NAMES_DE = [
  'Alle Monate',
  'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
  'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'
];

const MONTH_NAMES_NL = [
  'Alle maanden',
  'Januari', 'Februari', 'Maart', 'April', 'Mei', 'Juni',
  'Juli', 'Augustus', 'September', 'Oktober', 'November', 'December'
];

export const WasteCalendarPage: React.FC<WasteCalendarPageProps> = ({
  theme,
  onBack,
}) => {
  const { t, lang } = useTranslation();
  const isNl = lang === 'nl';

  const [selectedDistrict, setSelectedDistrict] = useState<string>(WINTERBERG_DISTRICTS[0]);
  const [selectedBinType, setSelectedBinType] = useState<string>('all');
  const [selectedMonth, setSelectedMonth] = useState<string>('all'); // 'all' or '1'..'12'
  const [selectedKw, setSelectedKw] = useState<string>('all'); // 'all' or '1'..'53'
  const [showPastDates, setShowPastDates] = useState<boolean>(false); // default: hide past dates

  React.useEffect(() => {
    const title = isNl
      ? `Afvalkalender ${selectedDistrict} | Ophaaldagen Winterberg`
      : `Abfallkalender ${selectedDistrict} | Müllabfuhr-Termine Stadt Winterberg`;
    document.title = title;

    const desc = isNl
      ? `Alle ophaaldata voor restafval, papier, GFT en de gele zak in ${selectedDistrict}. Download direct de officiële afvalkalender als PDF of voor je smartphone.`
      : `Müllabfuhrtermine für Restmüll, Altpapier, Biomüll und Gelben Sack in ${selectedDistrict}. Inkl. amtlichem PDF-Download, Kalender-Export (.ics) und Wertstoffhof.`;
    
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', desc);
  }, [selectedDistrict, isNl]);

  const schedule = DISTRICT_SCHEDULES[selectedDistrict] || DISTRICT_SCHEDULES[WINTERBERG_DISTRICTS[0]];

  // Today's local date in YYYY-MM-DD
  const todayStr = useMemo(() => {
    const today = new Date();
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, '0');
    const d = String(today.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }, []);

  // Helper to format date without UTC shift
  const formatDate = (dateStr: string) => {
    const [y, m, d] = dateStr.split('-').map(Number);
    const dateObj = new Date(y, m - 1, d);
    return dateObj.toLocaleDateString(isNl ? 'nl-NL' : 'de-DE', {
      weekday: 'short',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Helper to calculate days remaining
  const getDaysRemaining = (dateStr: string) => {
    const [y, m, d] = dateStr.split('-').map(Number);
    const target = new Date(y, m - 1, d, 0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffTime = target.getTime() - today.getTime();
    return Math.round(diffTime / (1000 * 60 * 60 * 24));
  };

  // Next upcoming collection day (today or next future date)
  const nextUpcoming = useMemo(() => {
    // Find upcoming collection(s) on or after today
    const upcoming = schedule.collections.filter(c => c.date >= todayStr);
    if (upcoming.length > 0) {
      const targetDate = upcoming[0].date;
      const items = upcoming.filter(c => c.date === targetDate);
      return {
        date: targetDate,
        items,
        isPast: false
      };
    }
    // If all dates of the year are already past (e.g. at end of 2026), show the last collection as completed
    if (schedule.collections.length > 0) {
      const lastDate = schedule.collections[schedule.collections.length - 1].date;
      return {
        date: lastDate,
        items: schedule.collections.filter(c => c.date === lastDate),
        isPast: true
      };
    }
    return null;
  }, [schedule, todayStr]);

  // Filter collections by bin type, month, KW, and past dates
  const filteredCollections = useMemo(() => {
    return schedule.collections.filter(c => {
      // Filter by bin type
      if (selectedBinType !== 'all' && c.binType !== selectedBinType) {
        return false;
      }
      // Filter past dates (default: hide past)
      if (!showPastDates && c.date < todayStr) {
        return false;
      }
      // Filter by month
      if (selectedMonth !== 'all') {
        const itemMonth = parseInt(c.date.split('-')[1], 10);
        if (itemMonth !== parseInt(selectedMonth, 10)) {
          return false;
        }
      }
      // Filter by KW
      if (selectedKw !== 'all') {
        const itemKw = getISOWeek(c.date);
        if (itemKw !== parseInt(selectedKw, 10)) {
          return false;
        }
      }
      return true;
    });
  }, [schedule, selectedBinType, showPastDates, selectedMonth, selectedKw, todayStr]);

  const hasActiveFilters = selectedBinType !== 'all' || selectedMonth !== 'all' || selectedKw !== 'all' || showPastDates;

  const handleResetFilters = () => {
    setSelectedBinType('all');
    setSelectedMonth('all');
    setSelectedKw('all');
    setShowPastDates(false);
  };

  // Download ICS File
  const handleDownloadIcs = () => {
    const icsContent = generateIcsCalendar(selectedDistrict, schedule.collections);
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `abfallkalender-${selectedDistrict.toLowerCase().replace(/[^a-z0-9]/g, '-')}-2026.ics`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const pdfDownloadUrl = DISTRICT_PDF_MAP[selectedDistrict] || ALL_DISTRICTS_PDF;

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
          {isNl ? 'Afvalkalender' : 'Digitaler Abfallkalender'}
        </span>
      </nav>

      {/* Hero Header */}
      <section className="relative rounded-2xl overflow-hidden shadow-lg mb-8 text-white bg-gradient-to-r from-[#2C4A3E] via-[#24533F] to-[#123023] p-6 sm:p-10">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-emerald-300 mb-4">
            <Truck className="w-3.5 h-3.5" />
            {isNl ? 'Stadsreiniging & Milieudienst' : 'Stadtreinigung & Entsorgung'}
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-3">
            {isNl ? 'Digitale Afvalkalender Winterberg 2026' : 'Digitaler Abfallkalender Winterberg 2026'}
          </h1>
          <p className="text-sm sm:text-base text-white/90 leading-relaxed">
            {isNl
              ? 'Mis nooit meer een ophaaldag. Selecteer je dorp, filter op maand of kalenderweek en download de officiële afvalkalender als PDF of direct naar je smartphone.'
              : 'Verpasse keine Müllabfuhr mehr. Wähle deinen Ortsteil, filtere nach Monat oder Kalenderwoche und lade den amtlichen Abfallkalender als PDF oder direkt auf dein Smartphone herunter.'}
          </p>

          {/* Controls: Ortsteil, Monat, Kalenderwoche & Downloads */}
          <div className="mt-8 space-y-4">
            {/* Top row: 3 Selectors (Ortsteil, Monat, Kalenderwoche) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Ortsteil Selector */}
              <div>
                <label 
                  htmlFor="district-select" 
                  className="block text-xs font-bold uppercase tracking-wider text-emerald-200 mb-1.5 flex items-center gap-1.5"
                >
                  <MapPin className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
                  <span>{isNl ? 'Hier dorp / wijk:' : 'Hier Ortsteil auswählen:'}</span>
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-700 pointer-events-none" />
                  <select
                    id="district-select"
                    value={selectedDistrict}
                    onChange={(e) => setSelectedDistrict(e.target.value)}
                    className="w-full pl-10 pr-9 py-2.5 bg-white text-gray-900 font-bold text-sm rounded-xl shadow-md border-0 focus:ring-2 focus:ring-emerald-400 cursor-pointer appearance-none"
                    aria-label={isNl ? 'Dorp of wijk selecteren' : 'Ortsteil auswählen'}
                  >
                    {WINTERBERG_DISTRICTS.map(d => (
                      <option key={d} value={d}>
                        {d} {d === 'Winterberg' ? (isNl ? '(Kernstad)' : '(Kernstadt)') : ''}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* Monat Selector */}
              <div>
                <label 
                  htmlFor="month-select" 
                  className="block text-xs font-bold uppercase tracking-wider text-emerald-200 mb-1.5 flex items-center gap-1.5"
                >
                  <Calendar className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
                  <span>{isNl ? 'Maand kiezen:' : 'Monat wählen:'}</span>
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-700 pointer-events-none" />
                  <select
                    id="month-select"
                    value={selectedMonth}
                    onChange={(e) => {
                      setSelectedMonth(e.target.value);
                      if (e.target.value !== 'all') setSelectedKw('all');
                    }}
                    className="w-full pl-10 pr-9 py-2.5 bg-white text-gray-900 font-bold text-sm rounded-xl shadow-md border-0 focus:ring-2 focus:ring-emerald-400 cursor-pointer appearance-none"
                    aria-label={isNl ? 'Maand filteren' : 'Monat auswählen'}
                  >
                    <option value="all">{isNl ? 'Alle maanden (Ganzes Jahr)' : 'Alle Monate (Ganzes Jahr)'}</option>
                    {(isNl ? MONTH_NAMES_NL : MONTH_NAMES_DE).slice(1).map((mName, idx) => (
                      <option key={idx + 1} value={String(idx + 1)}>
                        {String(idx + 1).padStart(2, '0')} – {mName} 2026
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* KW Selector */}
              <div>
                <label 
                  htmlFor="kw-select" 
                  className="block text-xs font-bold uppercase tracking-wider text-emerald-200 mb-1.5 flex items-center gap-1.5"
                >
                  <Clock className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
                  <span>{isNl ? 'Kalenderweek (KW):' : 'Kalenderwoche (KW):'}</span>
                </label>
                <div className="relative">
                  <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-700 pointer-events-none" />
                  <select
                    id="kw-select"
                    value={selectedKw}
                    onChange={(e) => {
                      setSelectedKw(e.target.value);
                      if (e.target.value !== 'all') setSelectedMonth('all');
                    }}
                    className="w-full pl-10 pr-9 py-2.5 bg-white text-gray-900 font-bold text-sm rounded-xl shadow-md border-0 focus:ring-2 focus:ring-emerald-400 cursor-pointer appearance-none"
                    aria-label={isNl ? 'Kalenderweek selecteren' : 'Kalenderwoche auswählen'}
                  >
                    <option value="all">{isNl ? 'Alle weken (KW 1 - 53)' : 'Alle Wochen (KW 1 – 53)'}</option>
                    {Array.from({ length: 53 }, (_, i) => i + 1).map(kw => (
                      <option key={kw} value={String(kw)}>
                        KW {String(kw).padStart(2, '0')}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom row: Checkbox for past dates & Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
              {/* Checkbox: Show past dates */}
              <label className="inline-flex items-center gap-2.5 text-xs text-white/90 hover:text-white cursor-pointer select-none py-1.5 px-3 rounded-lg bg-white/10 hover:bg-white/15 border border-white/15 transition-colors w-fit">
                <input
                  type="checkbox"
                  checked={showPastDates}
                  onChange={(e) => setShowPastDates(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-600 bg-white/20 border-white/30 focus:ring-emerald-400 focus:ring-offset-0 cursor-pointer"
                />
                <span className="font-semibold">
                  {isNl ? 'Verstreken ophaaldagen tonen' : 'Vergangene Termine anzeigen'}
                </span>
              </label>

              {/* Action Buttons: PDF Download & ICS */}
              <div className="flex flex-wrap items-center gap-2">
                {/* PDF Download Button */}
                <a
                  href={pdfDownloadUrl}
                  download={`Abfallkalender-2026-${selectedDistrict}.pdf`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-white text-emerald-950 hover:bg-emerald-50 text-xs sm:text-sm font-bold rounded-xl shadow-md transition-all hover:scale-[1.02] cursor-pointer"
                  title={isNl ? `Download PDF voor ${selectedDistrict}` : `Amtlichen Kalender als PDF für ${selectedDistrict} herunterladen`}
                >
                  <FileDown className="w-4 h-4 text-emerald-700" />
                  <span>{isNl ? 'Kalender als PDF' : 'Kalender als PDF'}</span>
                </a>

                {/* ICS Download Button */}
                <button
                  type="button"
                  onClick={handleDownloadIcs}
                  className="inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md transition-all hover:scale-[1.02] cursor-pointer"
                  title={isNl ? 'In smartphone agenda exporteren (.ics)' : 'Termine in Apple/Google/Outlook Kalender laden (.ics)'}
                >
                  <Download className="w-4 h-4" />
                  <span>{isNl ? 'In agenda (.ics)' : 'In Kalender (.ics)'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative background trash icon */}
        <div className="absolute right-4 -bottom-10 opacity-10 pointer-events-none hidden md:block">
          <Trash2 className="w-80 h-80 text-white" />
        </div>
      </section>

      {/* NEXT COLLECTION SPOTLIGHT CARD */}
      {nextUpcoming && (
        <div className="mb-8 bg-gradient-to-r from-emerald-50 via-teal-50/50 to-emerald-50 dark:from-[#17261E] dark:to-[#172D24] border-2 border-emerald-500/30 dark:border-emerald-500/20 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md shrink-0">
              <Calendar className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 block">
                  {nextUpcoming.isPast
                    ? (isNl ? `Laatste ophaaldag 2026 in ${selectedDistrict}` : `Letzter Abfuhrtermin 2026 in ${selectedDistrict}`)
                    : (isNl ? `Eerstvolgende ophaaldag in ${selectedDistrict}` : `Nächster Abfuhrtermin in ${selectedDistrict}`)}
                </span>
                {nextUpcoming.items.map(item => {
                  const cfg = BIN_TYPE_CONFIG[item.binType];
                  return (
                    <span 
                      key={item.id} 
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${cfg.colorBadge} shadow-xs`}
                    >
                      {isNl ? cfg.label_nl : cfg.label}
                    </span>
                  );
                })}
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">
                {nextUpcoming.items.map(c => isNl ? c.title_nl : c.title).join(' & ')}
              </h3>

              <p className="text-xs text-gray-600 dark:text-gray-300 mt-1.5 flex items-center gap-2 flex-wrap">
                <span className="font-bold text-gray-900 dark:text-gray-100 bg-white dark:bg-black/30 px-2 py-0.5 rounded border border-black/5 dark:border-white/10">
                  {formatDate(nextUpcoming.date)}
                </span>
                <span className="text-gray-400">•</span>
                <span className="text-[11px] font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-100/70 dark:bg-emerald-950/40 px-2 py-0.5 rounded">
                  KW {getISOWeek(nextUpcoming.date)}
                </span>
                <span className="text-gray-400">•</span>
                <span>{isNl ? 'Zet de container voor 06:00 uur klaar' : 'Tonne bitte bis spätestens 06:00 Uhr bereitstellen'}</span>
              </p>
            </div>
          </div>

          <div className="shrink-0 bg-white dark:bg-[#1E2621] px-5 py-3 rounded-xl border border-emerald-200 dark:border-emerald-800 shadow-sm text-center min-w-[120px] self-stretch sm:self-center">
            {nextUpcoming.isPast ? (
              <>
                <span className="text-[11px] text-gray-500 block uppercase font-bold">
                  {isNl ? 'Status' : 'Status'}
                </span>
                <span className="text-sm font-black text-gray-500">
                  {isNl ? 'Voltooid' : 'Abgeschlossen'}
                </span>
              </>
            ) : (
              <>
                <span className="text-[11px] text-gray-500 block uppercase font-bold">
                  {getDaysRemaining(nextUpcoming.date) === 0 ? (isNl ? 'Status' : 'Termin') : (isNl ? 'Resterend' : 'Noch')}
                </span>
                <span className="text-lg sm:text-xl font-black text-emerald-700 dark:text-emerald-400">
                  {getDaysRemaining(nextUpcoming.date) === 0 
                    ? (isNl ? 'Vandaag!' : 'Heute!') 
                    : getDaysRemaining(nextUpcoming.date) === 1 
                      ? (isNl ? 'Morgen!' : 'Morgen!')
                      : `${getDaysRemaining(nextUpcoming.date)} ${isNl ? 'dagen' : 'Tage'}`}
                </span>
              </>
            )}
          </div>
        </div>
      )}

      {/* FILTER BUTTONS BY BIN TYPE & RESET */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
          <button
            type="button"
            onClick={() => setSelectedBinType('all')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
              selectedBinType === 'all'
                ? 'bg-[#0F4C2E] text-white shadow-sm'
                : 'bg-gray-100 dark:bg-[#252E28] text-gray-700 dark:text-gray-300 hover:bg-gray-200'
            }`}
          >
            {isNl ? 'Alle bakken' : 'Alle Tonnen'}
          </button>
          {(['rest', 'paper', 'organic', 'yellow', 'hazard'] as WasteBinType[]).map(t => {
            const cfg = BIN_TYPE_CONFIG[t];
            return (
              <button
                key={t}
                type="button"
                onClick={() => setSelectedBinType(t)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  selectedBinType === t
                    ? 'bg-[#0F4C2E] text-white shadow-sm'
                    : 'bg-gray-100 dark:bg-[#252E28] text-gray-700 dark:text-gray-300 hover:bg-gray-200'
                }`}
              >
                {isNl ? cfg.label_nl : cfg.label}
              </button>
            );
          })}
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={handleResetFilters}
            className="inline-flex items-center gap-1.5 text-xs text-rose-600 hover:text-rose-700 dark:text-rose-400 font-semibold cursor-pointer py-1 px-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{isNl ? 'Filters wissen' : 'Filter zurücksetzen'}</span>
          </button>
        )}
      </div>

      {/* SCHEDULE TABLE / GRID */}
      <div className="bg-white dark:bg-[#1E2621] rounded-2xl border border-black/5 dark:border-white/10 shadow-sm overflow-hidden mb-12">
        <div className="p-4 sm:p-5 border-b border-gray-100 dark:border-gray-800 flex flex-wrap justify-between items-center gap-2">
          <h3 className="font-bold text-sm sm:text-base text-gray-900 dark:text-white flex items-center gap-2">
            <Trash2 className="w-4 h-4 text-[#0F4C2E] dark:text-emerald-400" />
            <span>
              {isNl ? `Ophaaldata voor ${selectedDistrict}` : `Abfuhrtermine für ${selectedDistrict}`}
              {selectedMonth !== 'all' && ` • ${isNl ? MONTH_NAMES_NL[parseInt(selectedMonth, 10)] : MONTH_NAMES_DE[parseInt(selectedMonth, 10)]}`}
              {selectedKw !== 'all' && ` • KW ${selectedKw}`}
            </span>
          </h3>
          <div className="flex items-center gap-4">
            <label className="inline-flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={showPastDates}
                onChange={(e) => setShowPastDates(e.target.checked)}
                className="w-3.5 h-3.5 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
              />
              <span>{isNl ? 'Verleden tonen' : 'Vergangene anzeigen'}</span>
            </label>
            <span className="text-xs text-gray-400">
              {filteredCollections.length} {isNl ? 'datums' : 'Termine'}
            </span>
          </div>
        </div>

        {filteredCollections.length === 0 ? (
          <div className="p-10 text-center text-gray-500">
            <Info className="w-9 h-9 text-gray-400 mx-auto mb-2" />
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              {isNl ? 'Geen afvalinzameling gevonden voor deze selectie.' : 'Keine Abfuhrtermine für diese Auswahl gefunden.'}
            </p>
            {!showPastDates && (
              <p className="text-xs text-gray-400 mt-1 max-w-md mx-auto">
                {isNl 
                  ? 'Mogelijk liggen de gekozen data in het verleden. Schakel hierboven "Verstreken ophaaldagen tonen" in.' 
                  : 'Möglicherweise liegen die gewählten Termine bereits in der Vergangenheit. Aktiviere "Vergangene Termine anzeigen", um sie einzublenden.'}
              </p>
            )}
            <button
              type="button"
              onClick={handleResetFilters}
              className="mt-4 inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-gray-100 hover:bg-gray-200 dark:bg-zinc-800 rounded-lg text-gray-700 dark:text-gray-200 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{isNl ? 'Alle filters resetten' : 'Alle Filter zurücksetzen'}</span>
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {filteredCollections.map((item) => {
              const cfg = BIN_TYPE_CONFIG[item.binType];
              const daysLeft = getDaysRemaining(item.date);
              const isToday = daysLeft === 0;
              const isTomorrow = daysLeft === 1;
              const isPast = daysLeft < 0;

              const [y, m, d] = item.date.split('-').map(Number);
              const itemDate = new Date(y, m - 1, d);
              const itemKw = getISOWeek(item.date);

              return (
                <div 
                  key={item.id}
                  className={`p-4 sm:px-6 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    isToday 
                      ? 'bg-emerald-50/80 dark:bg-emerald-950/20 font-medium' 
                      : isPast 
                        ? 'opacity-65 hover:opacity-100 hover:bg-gray-50/70 dark:hover:bg-[#151B17]' 
                        : 'hover:bg-gray-50/70 dark:hover:bg-[#151B17]'
                  }`}
                >
                  {/* Date and Day */}
                  <div className="flex items-center gap-4">
                    <div className={`text-center w-16 shrink-0 py-1.5 px-2 rounded-lg ${
                      isToday 
                        ? 'bg-emerald-600 text-white shadow-xs' 
                        : 'bg-gray-100 dark:bg-[#151B17]'
                    }`}>
                      <span className={`text-[10px] uppercase font-bold block ${isToday ? 'text-emerald-100' : 'text-gray-400'}`}>
                        {itemDate.toLocaleDateString(isNl ? 'nl-NL' : 'de-DE', { weekday: 'short' })}
                      </span>
                      <span className={`text-base font-black ${isToday ? 'text-white' : 'text-gray-800 dark:text-gray-200'}`}>
                        {itemDate.toLocaleDateString(isNl ? 'nl-NL' : 'de-DE', { day: '2-digit', month: '2-digit' })}
                      </span>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className={`px-2.5 py-0.5 rounded text-[11px] font-bold ${cfg.colorBadge}`}>
                          {isNl ? cfg.label_nl : cfg.label}
                        </span>
                        <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-zinc-800 px-2 py-0.5 rounded">
                          KW {itemKw}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {isNl ? (item.notes_nl || cfg.description_nl) : (item.notes || cfg.description)}
                      </p>
                    </div>
                  </div>

                  {/* Days remaining badge */}
                  <div className="self-end sm:self-center">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-md ${
                      isToday
                        ? 'bg-emerald-600 text-white font-bold'
                        : isTomorrow
                          ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-200 font-bold'
                          : isPast
                            ? 'bg-gray-100 dark:bg-[#252E28] text-gray-400 dark:text-gray-500'
                            : 'bg-gray-100 dark:bg-[#252E28] text-gray-600 dark:text-gray-300'
                    }`}>
                      {isToday 
                        ? (isNl ? 'Vandaag' : 'Heute') 
                        : isTomorrow 
                          ? (isNl ? 'Morgen' : 'Morgen') 
                          : isPast 
                            ? (isNl ? 'Vergangen' : 'Vergangen') 
                            : `in ${daysLeft} ${isNl ? 'dagen' : 'Tagen'}`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* RECYCLING CENTER INFO BOX */}
      <section className="bg-white dark:bg-[#1E2621] rounded-2xl border border-black/5 dark:border-white/10 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-8 justify-between">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#0F4C2E] dark:text-emerald-400 mb-2">
              <Truck className="w-4 h-4" />
              {isNl ? 'Gemeentelijke Milieustraat' : 'Städtischer Wertstoffhof'}
            </div>
            <h3 className="text-xl font-extrabold text-gray-900 dark:text-white mb-2">
              {isNl ? RECYCLING_CENTER_INFO.name_nl : RECYCLING_CENTER_INFO.name}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <span>{RECYCLING_CENTER_INFO.address}</span>
            </p>

            <h4 className="text-xs font-bold uppercase text-gray-700 dark:text-gray-300 mb-2">
              {isNl ? 'Gratis inleveren voor inwoners:' : 'Kostenlose Abgabe für Bürger:'}
            </h4>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-600 dark:text-gray-300">
              {(isNl ? RECYCLING_CENTER_INFO.freeItems_nl : RECYCLING_CENTER_INFO.freeItems).map((item, i) => (
                <li key={i} className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            {/* Link to entire 12-page calendar */}
            <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center gap-2 text-xs text-gray-500">
              <FileDown className="w-4 h-4 text-emerald-600" />
              <span>{isNl ? 'Alle dorpen in één bestand nodig?' : 'Alle Ortsteile in einer Datei benötigt?'}</span>
              <a 
                href={ALL_DISTRICTS_PDF} 
                download="Abfallkalender-2026-Winterberg-Gesamt.pdf"
                target="_blank" 
                rel="noopener noreferrer"
                className="font-bold text-[#0F4C2E] dark:text-emerald-400 hover:underline inline-flex items-center gap-1"
              >
                <span>{isNl ? 'Volledige afvalkalender (12 pagina\'s) downloaden' : 'Gesamtkalender (alle 12 Seiten) als PDF herunterladen'}</span>
                <ChevronRight className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Opening Hours */}
          <div className="bg-gray-50 dark:bg-[#151B17] p-5 rounded-xl border border-gray-200 dark:border-gray-800 lg:w-80 shrink-0">
            <h4 className="font-bold text-xs uppercase tracking-wider text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-600" />
              <span>{isNl ? 'Openingstijden' : 'Öffnungszeiten'}</span>
            </h4>
            <div className="space-y-2 text-xs">
              {RECYCLING_CENTER_INFO.openingHours.map((slot, i) => (
                <div key={i} className="flex justify-between py-1 border-b border-gray-200/50 dark:border-gray-800 last:border-0">
                  <span className="font-medium text-gray-600 dark:text-gray-400">{isNl ? slot.days_nl : slot.days}</span>
                  <span className="font-bold text-gray-900 dark:text-white">{slot.time}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-800 text-[11px] text-gray-500">
              {isNl ? 'Telefonische vragen:' : 'Telefonische Auskunft:'} <span className="font-semibold">{RECYCLING_CENTER_INFO.phone}</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default WasteCalendarPage;
