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
  Filter
} from 'lucide-react';
import { ThemeConfig, WasteBinType } from '../types';
import { 
  WINTERBERG_DISTRICTS, 
  DISTRICT_SCHEDULES, 
  BIN_TYPE_CONFIG, 
  RECYCLING_CENTER_INFO,
  generateIcsCalendar 
} from '../utils/wasteCalendarData';

interface WasteCalendarPageProps {
  theme?: ThemeConfig;
  onBack?: () => void;
}

export const WasteCalendarPage: React.FC<WasteCalendarPageProps> = ({
  theme,
  onBack,
}) => {
  const { t, lang } = useTranslation();
  const isNl = lang === 'nl';

  const [selectedDistrict, setSelectedDistrict] = useState<string>(WINTERBERG_DISTRICTS[0]);
  const [selectedBinType, setSelectedBinType] = useState<string>('all');

  React.useEffect(() => {
    const title = isNl
      ? `Afvalkalender ${selectedDistrict} | Ophaaldagen Winterberg`
      : `Abfallkalender ${selectedDistrict} | Müllabfuhr-Termine Stadt Winterberg`;
    document.title = title;

    const desc = isNl
      ? `Alle ophaaldata voor restafval, papier, GFT en de gele zak in ${selectedDistrict}. Download direct de afvalkalender voor je smartphone.`
      : `Müllabfuhrtermine für Restmüll, Altpapier, Biomüll und Gelben Sack in ${selectedDistrict}. Inkl. Kalender-Export (.ics) und Wertstoffhof.`;
    
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', desc);
  }, [selectedDistrict, isNl]);

  const schedule = DISTRICT_SCHEDULES[selectedDistrict] || DISTRICT_SCHEDULES[WINTERBERG_DISTRICTS[0]];

  // Filter collections by bin type
  const filteredCollections = useMemo(() => {
    if (selectedBinType === 'all') return schedule.collections;
    return schedule.collections.filter(c => c.binType === selectedBinType);
  }, [schedule, selectedBinType]);

  // Next upcoming collection
  const nextCollection = schedule.collections[0];

  // Helper to format date
  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString(isNl ? 'nl-NL' : 'de-DE', {
      weekday: 'short',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Helper to calculate days remaining
  const getDaysRemaining = (dateStr: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(dateStr);
    target.setHours(0, 0, 0, 0);
    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
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
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-emerald-300 mb-4">
            <Truck className="w-3.5 h-3.5" />
            {isNl ? 'Stadsreiniging & Milieudienst' : 'Stadtreinigung & Entsorgung'}
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-3">
            {isNl ? 'Digitale Afvalkalender Winterberg' : 'Digitaler Abfallkalender Winterberg'}
          </h1>
          <p className="text-sm sm:text-base text-white/90 leading-relaxed">
            {isNl
              ? 'Mis nooit meer een ophaaldag. Selecteer je dorp voor de actuele ophaaldata van restafval, papier, GFT en PMD inclusief export naar je smartphone.'
              : 'Verpasse keine Müllabfuhr mehr. Wähle deinen Ortsteil für alle Abfuhrtermine von Restmüll, Altpapier, Gelbem Sack und Biomüll inkl. Kalender-Export.'}
          </p>

          {/* District Selector Header */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
            <div className="relative flex-1 max-w-md">
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-700 pointer-events-none" />
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white text-gray-900 font-semibold text-sm rounded-xl shadow-md border-0 focus:ring-2 focus:ring-emerald-400 cursor-pointer"
              >
                {WINTERBERG_DISTRICTS.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={handleDownloadIcs}
              className="inline-flex items-center justify-center gap-2 py-3 px-5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>{isNl ? 'Exporteer naar agenda (.ics)' : 'Termine in Kalender laden (.ics)'}</span>
            </button>
          </div>
        </div>

        {/* Decorative background trash icon */}
        <div className="absolute right-4 -bottom-10 opacity-10 pointer-events-none hidden md:block">
          <Trash2 className="w-80 h-80 text-white" />
        </div>
      </section>

      {/* NEXT COLLECTION SPOTLIGHT CARD */}
      {nextCollection && (
        <div className="mb-8 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-[#17261E] dark:to-[#172D24] border-2 border-emerald-500/30 dark:border-emerald-500/20 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md shrink-0">
              <Calendar className="w-7 h-7" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 block mb-0.5">
                {isNl ? 'Eerstvolgende ophaaldag' : 'Nächster Abfuhrtermin'} in {selectedDistrict}
              </span>
              <h3 className="text-xl font-extrabold text-gray-900 dark:text-white">
                {isNl ? nextCollection.title_nl : nextCollection.title}
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                {formatDate(nextCollection.date)} • {isNl ? 'Zet de container voor 06:00 uur klaar' : 'Tonne bitte bis spätestens 06:00 Uhr bereitstellen'}
              </p>
            </div>
          </div>

          <div className="shrink-0 bg-white dark:bg-[#1E2621] px-4 py-2.5 rounded-xl border border-emerald-200 dark:border-emerald-800 shadow-sm text-center">
            <span className="text-[11px] text-gray-500 block uppercase font-bold">{isNl ? 'Resterend' : 'Noch'}</span>
            <span className="text-lg font-black text-emerald-700 dark:text-emerald-400">
              {getDaysRemaining(nextCollection.date) <= 0 
                ? (isNl ? 'Vandaag' : 'Heute!') 
                : `${getDaysRemaining(nextCollection.date)} ${isNl ? 'dagen' : 'Tage'}`}
            </span>
          </div>
        </div>
      )}

      {/* FILTER BUTTONS BY BIN TYPE */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 scrollbar-thin">
        <button
          type="button"
          onClick={() => setSelectedBinType('all')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
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
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
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

      {/* SCHEDULE TABLE / GRID */}
      <div className="bg-white dark:bg-[#1E2621] rounded-2xl border border-black/5 dark:border-white/10 shadow-sm overflow-hidden mb-12">
        <div className="p-4 sm:p-5 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
          <h3 className="font-bold text-sm sm:text-base text-gray-900 dark:text-white flex items-center gap-2">
            <Trash2 className="w-4 h-4 text-[#0F4C2E] dark:text-emerald-400" />
            <span>{isNl ? `Ophaaldata voor ${selectedDistrict}` : `Termine für ${selectedDistrict}`}</span>
          </h3>
          <span className="text-xs text-gray-400">
            {filteredCollections.length} {isNl ? 'datums' : 'Termine'}
          </span>
        </div>

        <div className="divide-y divide-gray-100 dark:divide-gray-800">
          {filteredCollections.map((item) => {
            const cfg = BIN_TYPE_CONFIG[item.binType];
            const daysLeft = getDaysRemaining(item.date);

            return (
              <div 
                key={item.id}
                className="p-4 sm:px-6 hover:bg-gray-50/70 dark:hover:bg-[#151B17] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                {/* Date and Day */}
                <div className="flex items-center gap-4">
                  <div className="text-center w-16 shrink-0 py-1.5 px-2 bg-gray-100 dark:bg-[#151B17] rounded-lg">
                    <span className="text-xs uppercase font-bold text-gray-400 block">
                      {new Date(item.date).toLocaleDateString(isNl ? 'nl-NL' : 'de-DE', { weekday: 'short' })}
                    </span>
                    <span className="text-base font-black text-gray-800 dark:text-gray-200">
                      {new Date(item.date).toLocaleDateString(isNl ? 'nl-NL' : 'de-DE', { day: '2-digit', month: '2-digit' })}
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2.5 py-0.5 rounded text-[11px] font-bold ${cfg.colorBadge}`}>
                        {isNl ? cfg.label_nl : cfg.label}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {isNl ? (item.notes_nl || cfg.description_nl) : (item.notes || cfg.description)}
                    </p>
                  </div>
                </div>

                {/* Days remaining badge */}
                <div className="self-end sm:self-center">
                  <span className="text-xs font-semibold px-2.5 py-1 bg-gray-100 dark:bg-[#252E28] text-gray-600 dark:text-gray-300 rounded-md">
                    {daysLeft <= 0 
                      ? (isNl ? 'Vandaag' : 'Heute') 
                      : (daysLeft === 1 ? (isNl ? 'Morgen' : 'Morgen') : `in ${daysLeft} ${isNl ? 'dagen' : 'Tagen'}`)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
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
