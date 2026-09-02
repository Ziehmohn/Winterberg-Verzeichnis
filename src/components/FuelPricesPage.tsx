import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from '../i18n';
import { Fuel, ArrowRight, RefreshCw, Calculator, Sparkles, MapPin, Clock, ExternalLink, CheckCircle, HelpCircle, Navigation, Info } from 'lucide-react';
import { FuelPriceResponse, FuelStationPrice, ThemeConfig } from '../types';
import { fetchFuelPrices, formatFuelPrice } from '../utils/fuelPriceService';
import { getBusinessPath } from '../utils/routes';

interface FuelPricesPageProps {
  theme?: ThemeConfig;
  onSelectBusiness?: (slugOrPath: string) => void;
  onBack?: () => void;
}

export const FuelPricesPage: React.FC<FuelPricesPageProps> = ({
  theme,
  onSelectBusiness,
  onBack,
}) => {
  const { t, lang } = useTranslation();

  const [fuelData, setFuelData] = useState<FuelPriceResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Filter & Sort
  const [fuelTypeFilter, setFuelTypeFilter] = useState<'all' | 'diesel' | 'e10' | 'e5'>('all');
  const [sortBy, setSortBy] = useState<'diesel' | 'e10' | 'e5' | 'dist' | 'name'>('diesel');
  const [onlyOpen, setOnlyOpen] = useState<boolean>(false);

  // Calculator State
  const [calcFuelType, setCalcFuelType] = useState<'diesel' | 'e10' | 'e5'>('diesel');
  const [calcLiters, setCalcLiters] = useState<number>(50);
  const [selectedStationId, setSelectedStationId] = useState<string>('cheapest');

  const loadPrices = async (force = false) => {
    if (force) setIsRefreshing(true);
    else setLoading(true);

    try {
      const data = await fetchFuelPrices(force);
      setFuelData(data);
    } catch (e) {
      console.error('Failed to load fuel prices:', e);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadPrices();
  }, []);

  const stations = fuelData?.stations || [];

  // Filter & Sort stations
  const filteredStations = useMemo(() => {
    let list = [...stations];
    if (onlyOpen) {
      list = list.filter((s) => s.isOpen);
    }

    list.sort((a, b) => {
      if (sortBy === 'diesel') {
        return (a.diesel || 999) - (b.diesel || 999);
      }
      if (sortBy === 'e10') {
        return (a.e10 || 999) - (b.e10 || 999);
      }
      if (sortBy === 'e5') {
        return (a.e5 || 999) - (b.e5 || 999);
      }
      if (sortBy === 'dist') {
        return (a.dist || 999) - (b.dist || 999);
      }
      return a.name.localeCompare(b.name);
    });

    return list;
  }, [stations, onlyOpen, sortBy]);

  // Find lowest price for each category
  const cheapestDiesel = useMemo(() => {
    const valid = stations.filter((s) => s.diesel && s.diesel > 0);
    if (valid.length === 0) return null;
    return valid.reduce((min, cur) => ((cur.diesel || 999) < (min.diesel || 999) ? cur : min), valid[0]);
  }, [stations]);

  const cheapestE10 = useMemo(() => {
    const valid = stations.filter((s) => s.e10 && s.e10 > 0);
    if (valid.length === 0) return null;
    return valid.reduce((min, cur) => ((cur.e10 || 999) < (min.e10 || 999) ? cur : min), valid[0]);
  }, [stations]);

  const cheapestE5 = useMemo(() => {
    const valid = stations.filter((s) => s.e5 && s.e5 > 0);
    if (valid.length === 0) return null;
    return valid.reduce((min, cur) => ((cur.e5 || 999) < (min.e5 || 999) ? cur : min), valid[0]);
  }, [stations]);

  // Calculator Calculations
  const calculatedCostData = useMemo(() => {
    const validStations = stations.filter((s) => {
      const p = s[calcFuelType];
      return p !== null && p !== undefined && p > 0;
    });

    if (validStations.length === 0) {
      return { total: 0, stationName: '-', pricePerLiter: 0, savings: 0, maxStationName: '' };
    }

    // Sort ascending
    const sorted = [...validStations].sort((a, b) => (a[calcFuelType] || 0) - (b[calcFuelType] || 0));
    const cheapest = sorted[0];
    const mostExpensive = sorted[sorted.length - 1];

    let targetStation = cheapest;
    if (selectedStationId !== 'cheapest') {
      const found = validStations.find((s) => s.id === selectedStationId);
      if (found) targetStation = found;
    }

    const pricePerLiter = targetStation[calcFuelType] || 0;
    const total = calcLiters * pricePerLiter;
    const maxCost = calcLiters * (mostExpensive[calcFuelType] || 0);
    const savings = Math.max(0, maxCost - total);

    return {
      total,
      stationName: targetStation.name,
      pricePerLiter,
      savings,
      maxStationName: mostExpensive.name,
    };
  }, [stations, calcFuelType, calcLiters, selectedStationId]);

  return (
    <main className="flex-1 w-full max-w-[1140px] mx-auto px-4 sm:px-6 py-8 pb-16">
      {/* Breadcrumb / Top bar */}
      <div className="flex justify-between items-center mb-6 text-xs text-[#5F6B63]">
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            type="button"
            onClick={onBack}
            className="hover:text-[#0F4C2E] underline underline-offset-2 bg-transparent border-none p-0 cursor-pointer text-xs"
          >
            {lang === 'nl' ? 'Home' : 'Startseite'}
          </button>
          <span>/</span>
          <span className="font-semibold text-[#1B211D]">
            {lang === 'nl' ? 'Actuele brandstofprijzen' : 'Aktuelle Spritpreise'}
          </span>
        </div>

        <button
          type="button"
          onClick={() => loadPrices(true)}
          disabled={isRefreshing}
          className="inline-flex items-center gap-1.5 px-3 py-1 bg-white hover:bg-[#FAF8F5] border border-[#EDE8E0] text-[#0F4C2E] rounded-md font-semibold text-xs transition-colors cursor-pointer disabled:opacity-50 shadow-2xs"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>{lang === 'nl' ? 'Vernieuwen' : 'Preise aktualisieren'}</span>
        </button>
      </div>

      {/* Inactive / Setup Notice Banner if no live key */}
      {!fuelData?.isLive && (
        <div className="mb-6 bg-gradient-to-r from-amber-50 to-orange-50/70 border-2 border-amber-300/90 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5 text-amber-950 shadow-sm">
          <div className="w-9 h-9 rounded-xl bg-amber-200/80 text-amber-900 flex items-center justify-center font-bold shrink-0 mt-0.5 shadow-2xs">
            <Clock className="w-5 h-5 text-amber-800" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h3 className="font-display font-bold text-[15.5px] text-amber-950 m-0">
                {lang === 'nl' ? 'Live-interface wordt momenteel geactiveerd' : 'Live-Schnittstelle wird derzeit eingerichtet'}
              </h3>
              <span className="text-[11px] bg-amber-200 text-amber-900 font-bold px-2.5 py-0.5 rounded-full border border-amber-300">
                {lang === 'nl' ? 'Binnenkort online' : 'In Kürze live'}
              </span>
            </div>
            <p className="text-xs sm:text-[13px] text-amber-900/90 leading-relaxed m-0">
              {lang === 'nl'
                ? 'De directe koppeling met de Markttransparantie-instantie (MTS-K / Tankerkönig) wordt op dit moment voorbereid. De onderstaande gegevens zijn momenteel inactief en worden na koppeling realtime geüpdatet.'
                : 'Die direkte Anbindung an die Markttransparenzstelle für Kraftstoffe (MTS-K / Tankerkönig) wird gerade vorbereitet. Die untenstehenden Inhalte sind derzeit als Vorschau inaktiv geschaltet und gehen nach Aktivierung der Schnittstelle live.'}
            </p>
          </div>
        </div>
      )}

      {/* Hero Header */}
      <div className={`bg-gradient-to-r from-[#0F4C2E] to-[#176B42] rounded-2xl p-6 sm:p-10 text-white shadow-md relative overflow-hidden mb-8 ${!fuelData?.isLive ? 'opacity-85' : ''}`}>
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 pointer-events-none flex items-center justify-end pr-10">
          <Fuel className="w-64 h-64 text-white" />
        </div>

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold tracking-wide text-emerald-100 mb-3 border border-white/20">
            <span className={`w-2 h-2 rounded-full ${fuelData?.isLive ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
            {fuelData?.isLive
              ? (lang === 'nl' ? 'Live-gegevens van MTS-K / Tankerkönig' : 'Echtzeit-Preise der Markttransparenzstelle (MTS-K)')
              : (lang === 'nl' ? 'Koppeling in voorbereiding' : 'Schnittstelle in Vorbereitung')}
          </div>

          <h1 className="font-display text-[clamp(28px,4vw,44px)] font-extrabold leading-tight mb-3">
            {lang === 'nl'
              ? 'Actuele brandstofprijzen in Winterberg'
              : 'Aktuelle Spritpreise in Winterberg & Umgebung'}
          </h1>
          <p className="text-emerald-100 text-sm sm:text-base leading-relaxed max-w-xl">
            {lang === 'nl'
              ? 'Vind direct het voordeligste tankstation voor Diesel, Super E10 en Super E5 in Winterberg en bereken direct je totale tankkosten.'
              : 'Finde immer die günstigste Tankstelle für Diesel, Super E10 und Super E5 in Winterberg und berechne Deine Tankkosten mit unserem Rechner.'}
          </p>
        </div>
      </div>

      {/* Container with Inactive / Grayscale overlay if no API key */}
      <div className={!fuelData?.isLive ? 'opacity-65 grayscale-[35%] pointer-events-none select-none transition-all' : 'transition-all'}>
        {/* 3 Best Price Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {/* Cheapest Diesel */}
        <div className="bg-white border-2 border-[#E7E2DA] rounded-xl p-5 shadow-sm relative overflow-hidden hover:border-[#D65F0C] transition-all">
          <div className="flex justify-between items-start mb-2">
            <div>
              <span className="text-xs font-bold text-[#8A928B] uppercase tracking-wider block">
                {lang === 'nl' ? 'Voordeligste Diesel' : 'Günstigster Diesel'}
              </span>
              <span className="font-bold text-sm text-[#1B211D] block mt-0.5 truncate max-w-[180px]">
                {cheapestDiesel ? cheapestDiesel.name : 'JET Winterberg'}
              </span>
            </div>
            <span className="bg-amber-100 text-amber-900 font-bold text-[11px] px-2 py-0.5 rounded-full">
              B7
            </span>
          </div>

          <div className="flex items-baseline gap-1 mt-2">
            <span className="font-display text-[34px] font-extrabold text-[#D65F0C] leading-none">
              {formatFuelPrice(cheapestDiesel?.diesel).main}
            </span>
            <span className="text-[18px] font-bold text-[#D65F0C] leading-none self-start mt-0.5">
              {formatFuelPrice(cheapestDiesel?.diesel).fraction}
            </span>
            <span className="text-sm font-semibold text-[#5F6B63] ml-1">€ / L</span>
          </div>

          <div className="mt-3 pt-2.5 border-t border-[#EDE8E0] text-[11.5px] text-[#5F6B63] flex items-center justify-between">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-[#D65F0C]" />
              {cheapestDiesel?.district || 'Winterberg'}
            </span>
            <span className="font-semibold text-emerald-700">
              {cheapestDiesel?.isOpen ? (lang === 'nl' ? 'Geopend' : 'Geöffnet') : (lang === 'nl' ? 'Gesloten' : 'Geschlossen')}
            </span>
          </div>
        </div>

        {/* Cheapest Super E10 */}
        <div className="bg-white border-2 border-[#E7E2DA] rounded-xl p-5 shadow-sm relative overflow-hidden hover:border-[#0F4C2E] transition-all">
          <div className="flex justify-between items-start mb-2">
            <div>
              <span className="text-xs font-bold text-[#8A928B] uppercase tracking-wider block">
                {lang === 'nl' ? 'Voordeligste Super E10' : 'Günstigstes Super E10'}
              </span>
              <span className="font-bold text-sm text-[#1B211D] block mt-0.5 truncate max-w-[180px]">
                {cheapestE10 ? cheapestE10.name : 'TinQ Langewiese'}
              </span>
            </div>
            <span className="bg-emerald-100 text-emerald-900 font-bold text-[11px] px-2 py-0.5 rounded-full">
              E10
            </span>
          </div>

          <div className="flex items-baseline gap-1 mt-2">
            <span className="font-display text-[34px] font-extrabold text-[#0F4C2E] leading-none">
              {formatFuelPrice(cheapestE10?.e10).main}
            </span>
            <span className="text-[18px] font-bold text-[#0F4C2E] leading-none self-start mt-0.5">
              {formatFuelPrice(cheapestE10?.e10).fraction}
            </span>
            <span className="text-sm font-semibold text-[#5F6B63] ml-1">€ / L</span>
          </div>

          <div className="mt-3 pt-2.5 border-t border-[#EDE8E0] text-[11.5px] text-[#5F6B63] flex items-center justify-between">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-[#0F4C2E]" />
              {cheapestE10?.district || 'Winterberg'}
            </span>
            <span className="font-semibold text-emerald-700">
              {cheapestE10?.isOpen ? (lang === 'nl' ? 'Geopend' : 'Geöffnet') : (lang === 'nl' ? 'Gesloten' : 'Geschlossen')}
            </span>
          </div>
        </div>

        {/* Cheapest Super E5 */}
        <div className="bg-white border-2 border-[#E7E2DA] rounded-xl p-5 shadow-sm relative overflow-hidden hover:border-[#1E40AF] transition-all">
          <div className="flex justify-between items-start mb-2">
            <div>
              <span className="text-xs font-bold text-[#8A928B] uppercase tracking-wider block">
                {lang === 'nl' ? 'Voordeligste Super E5' : 'Günstigstes Super E5'}
              </span>
              <span className="font-bold text-sm text-[#1B211D] block mt-0.5 truncate max-w-[180px]">
                {cheapestE5 ? cheapestE5.name : 'Calpam Züschen'}
              </span>
            </div>
            <span className="bg-blue-100 text-blue-900 font-bold text-[11px] px-2 py-0.5 rounded-full">
              E5
            </span>
          </div>

          <div className="flex items-baseline gap-1 mt-2">
            <span className="font-display text-[34px] font-extrabold text-[#1E40AF] leading-none">
              {formatFuelPrice(cheapestE5?.e5).main}
            </span>
            <span className="text-[18px] font-bold text-[#1E40AF] leading-none self-start mt-0.5">
              {formatFuelPrice(cheapestE5?.e5).fraction}
            </span>
            <span className="text-sm font-semibold text-[#5F6B63] ml-1">€ / L</span>
          </div>

          <div className="mt-3 pt-2.5 border-t border-[#EDE8E0] text-[11.5px] text-[#5F6B63] flex items-center justify-between">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-[#1E40AF]" />
              {cheapestE5?.district || 'Winterberg'}
            </span>
            <span className="font-semibold text-emerald-700">
              {cheapestE5?.isOpen ? (lang === 'nl' ? 'Geopend' : 'Geöffnet') : (lang === 'nl' ? 'Gesloten' : 'Geschlossen')}
            </span>
          </div>
        </div>
      </div>

      {/* SECTION: Live Comparison Table */}
      <section className="bg-white border border-[#EDE8E0] rounded-2xl p-6 shadow-sm mb-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-[#EDE8E0] mb-5">
          <div>
            <h2 className="font-display text-xl font-bold text-[#1B211D] flex items-center gap-2">
              <Fuel className="w-5 h-5 text-[#F2761B]" />
              {lang === 'nl' ? 'Overzicht van alle tankstations' : 'Übersicht aller Tankstellen in und um Winterberg'}
            </h2>
            <p className="text-xs text-[#5F6B63] mt-1">
              {lang === 'nl'
                ? 'Prijzen worden continu geactualiseerd via de officiële Markttransparantie-instantie (MTS-K).'
                : 'Preise werden laufend über die Markttransparenzstelle für Kraftstoffe aktualisiert.'}
            </p>
          </div>

          {/* Controls: Sort & Only Open */}
          <div className="flex items-center gap-3 flex-wrap">
            <label className="flex items-center gap-2 text-xs font-semibold text-[#1B211D] cursor-pointer bg-[#FAF8F5] px-3 py-2 rounded-lg border border-[#EDE8E0]">
              <input
                type="checkbox"
                checked={onlyOpen}
                onChange={(e) => setOnlyOpen(e.target.checked)}
                className="w-4 h-4 rounded text-[#0F4C2E] focus:ring-[#0F4C2E]"
              />
              <span>{lang === 'nl' ? 'Alleen geopend' : 'Nur geöffnete'}</span>
            </label>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-[#5F6B63]">{lang === 'nl' ? 'Sorteren:' : 'Sortierung:'}</span>
              <select
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="bg-[#FAF8F5] border border-[#EDE8E0] rounded-lg px-3 py-2 font-semibold text-xs text-[#1B211D] focus:outline-none focus:border-[#0F4C2E]"
              >
                <option value="diesel">{lang === 'nl' ? 'Gunstigste Diesel' : 'Günstigster Diesel'}</option>
                <option value="e10">{lang === 'nl' ? 'Gunstigste Super E10' : 'Günstigstes Super E10'}</option>
                <option value="e5">{lang === 'nl' ? 'Gunstigste Super E5' : 'Günstigstes Super E5'}</option>
                <option value="dist">{lang === 'nl' ? 'Afstand' : 'Kürzeste Entfernung'}</option>
                <option value="name">{lang === 'nl' ? 'Naam A-Z' : 'Name A-Z'}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="overflow-x-auto hidden sm:block">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#EDE8E0] text-xs font-bold text-[#5F6B63] uppercase tracking-wider bg-[#FAF8F5]/60">
                <th className="py-3 px-4 rounded-l-lg">{lang === 'nl' ? 'Tankstation' : 'Tankstelle & Ort'}</th>
                <th className="py-3 px-4">{lang === 'nl' ? 'Status' : 'Status'}</th>
                <th className="py-3 px-4">{lang === 'nl' ? 'Diesel' : 'Diesel'}</th>
                <th className="py-3 px-4">{lang === 'nl' ? 'Super E10' : 'Super E10'}</th>
                <th className="py-3 px-4">{lang === 'nl' ? 'Super E5' : 'Super E5'}</th>
                <th className="py-3 px-4 text-right rounded-r-lg">{lang === 'nl' ? 'Details' : 'Aktion'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EDE8E0] text-sm">
              {filteredStations.map((station) => {
                const dieselFmt = formatFuelPrice(station.diesel);
                const e10Fmt = formatFuelPrice(station.e10);
                const e5Fmt = formatFuelPrice(station.e5);

                const isCheapestDiesel = cheapestDiesel?.id === station.id;
                const isCheapestE10 = cheapestE10?.id === station.id;
                const isCheapestE5 = cheapestE5?.id === station.id;

                return (
                  <tr key={station.id} className="hover:bg-[#FAF8F5]/80 transition-colors">
                    {/* Station Name & Location */}
                    <td className="py-4 px-4">
                      <div className="font-bold text-[#1B211D] text-[15px]">{station.name}</div>
                      <div className="text-xs text-[#8A928B] flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-[#8A928B]" />
                        <span>{station.street}, {station.postCode} {station.city}</span>
                        {station.dist && <span className="font-semibold text-[#5F6B63]">({station.dist.toFixed(1)} km)</span>}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-4">
                      {station.isOpen ? (
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          {lang === 'nl' ? 'Geopend' : 'Geöffnet'}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
                          {lang === 'nl' ? 'Gesloten' : 'Geschlossen'}
                        </span>
                      )}
                    </td>

                    {/* Diesel */}
                    <td className="py-4 px-4">
                      <div className="flex items-baseline gap-0.5">
                        <span className={`font-display text-lg font-bold leading-none ${isCheapestDiesel ? 'text-[#D65F0C]' : 'text-[#1B211D]'}`}>
                          {dieselFmt.main}
                        </span>
                        <span className={`text-xs font-bold leading-none ${isCheapestDiesel ? 'text-[#D65F0C]' : 'text-[#1B211D]'}`}>
                          {dieselFmt.fraction}
                        </span>
                        <span className="text-[11px] text-[#8A928B] ml-0.5">€</span>
                      </div>
                      {isCheapestDiesel && (
                        <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.2 rounded mt-1 inline-block">
                          ★ {lang === 'nl' ? 'Voordeligste' : 'Günstigster'}
                        </span>
                      )}
                    </td>

                    {/* E10 */}
                    <td className="py-4 px-4">
                      <div className="flex items-baseline gap-0.5">
                        <span className={`font-display text-lg font-bold leading-none ${isCheapestE10 ? 'text-[#0F4C2E]' : 'text-[#1B211D]'}`}>
                          {e10Fmt.main}
                        </span>
                        <span className={`text-xs font-bold leading-none ${isCheapestE10 ? 'text-[#0F4C2E]' : 'text-[#1B211D]'}`}>
                          {e10Fmt.fraction}
                        </span>
                        <span className="text-[11px] text-[#8A928B] ml-0.5">€</span>
                      </div>
                      {isCheapestE10 && (
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.2 rounded mt-1 inline-block">
                          ★ {lang === 'nl' ? 'Voordeligste' : 'Günstigster'}
                        </span>
                      )}
                    </td>

                    {/* E5 */}
                    <td className="py-4 px-4">
                      <div className="flex items-baseline gap-0.5">
                        <span className={`font-display text-lg font-bold leading-none ${isCheapestE5 ? 'text-[#1E40AF]' : 'text-[#1B211D]'}`}>
                          {e5Fmt.main}
                        </span>
                        <span className={`text-xs font-bold leading-none ${isCheapestE5 ? 'text-[#1E40AF]' : 'text-[#1B211D]'}`}>
                          {e5Fmt.fraction}
                        </span>
                        <span className="text-[11px] text-[#8A928B] ml-0.5">€</span>
                      </div>
                      {isCheapestE5 && (
                        <span className="text-[10px] font-bold text-blue-800 bg-blue-100 px-1.5 py-0.2 rounded mt-1 inline-block">
                          ★ {lang === 'nl' ? 'Voordeligste' : 'Günstigster'}
                        </span>
                      )}
                    </td>

                    {/* Action Button */}
                    <td className="py-4 px-4 text-right">
                      {station.businessPath || station.businessSlug ? (
                        <button
                          type="button"
                          onClick={() => onSelectBusiness && onSelectBusiness(station.businessPath || station.businessSlug || '')}
                          className="inline-flex items-center gap-1 text-xs font-bold text-[#0F4C2E] hover:text-[#F2761B] bg-[#E8F1EB] hover:bg-[#FFEADA] px-3 py-1.5 rounded-md transition-colors cursor-pointer border-none"
                        >
                          <span>{lang === 'nl' ? 'Profiel' : 'Eintrag'}</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      ) : (
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(station.name + ' ' + station.street + ' ' + station.city)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-medium text-[#5F6B63] hover:text-[#0F4C2E] transition-colors"
                        >
                          <Navigation className="w-3 h-3" />
                          <span>{lang === 'nl' ? 'Route' : 'Route'}</span>
                        </a>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards View */}
        <div className="grid grid-cols-1 gap-4 sm:hidden">
          {filteredStations.map((station) => {
            const dieselFmt = formatFuelPrice(station.diesel);
            const e10Fmt = formatFuelPrice(station.e10);
            const e5Fmt = formatFuelPrice(station.e5);

            return (
              <div key={station.id} className="border border-[#EDE8E0] rounded-xl p-4 bg-[#FAF8F5]">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-base text-[#1B211D]">{station.name}</h3>
                    <p className="text-xs text-[#8A928B] flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-[#8A928B]" />
                      {station.street}, {station.city}
                    </p>
                  </div>
                  {station.isOpen ? (
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      {lang === 'nl' ? 'Geopend' : 'Geöffnet'}
                    </span>
                  ) : (
                    <span className="text-[11px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                      {lang === 'nl' ? 'Gesloten' : 'Geschlossen'}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-2 my-3">
                  <div className="bg-white p-2 rounded-lg border border-[#EDE8E0] text-center">
                    <span className="text-[10px] font-bold text-[#5F6B63] block">Diesel</span>
                    <span className="font-bold text-sm text-[#1B211D]">{dieselFmt.main}{dieselFmt.fraction} €</span>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-[#EDE8E0] text-center">
                    <span className="text-[10px] font-bold text-[#5F6B63] block">Super E10</span>
                    <span className="font-bold text-sm text-[#1B211D]">{e10Fmt.main}{e10Fmt.fraction} €</span>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-[#EDE8E0] text-center">
                    <span className="text-[10px] font-bold text-[#5F6B63] block">Super E5</span>
                    <span className="font-bold text-sm text-[#1B211D]">{e5Fmt.main}{e5Fmt.fraction} €</span>
                  </div>
                </div>

                {station.businessPath && (
                  <button
                    type="button"
                    onClick={() => onSelectBusiness && onSelectBusiness(station.businessPath || '')}
                    className="w-full mt-1 bg-white hover:bg-[#0F4C2E] hover:text-white border border-[#EDE8E0] rounded-md py-2 text-xs font-bold text-[#0F4C2E] transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span>{lang === 'nl' ? 'Tankstation profiel bekijken' : 'Tankstelle ansehen'}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION: Interactive Fuel Cost Calculator (Spritpreis-Rechner) */}
      <section className="bg-gradient-to-br from-[#FAF8F5] via-white to-[#F6F3EE] border-2 border-[#E7E2DA] rounded-2xl p-6 sm:p-10 shadow-sm mb-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-[#F2761B]/15 text-[#D65F0C] flex items-center justify-center font-bold">
            <Calculator className="w-5 h-5 text-[#D65F0C]" />
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold text-[#1B211D]">
              {lang === 'nl' ? 'Tankkosten-Calculator Winterberg' : 'Spritpreis- & Tankkosten-Rechner'}
            </h2>
            <p className="text-xs text-[#5F6B63]">
              {lang === 'nl'
                ? 'Bereken direct wat je tankbeurt kost en ontdek hoeveel je bespaart bij de voordeligste pomp.'
                : 'Berechne exakt Deine Tankkosten und wie viel Du bei der günstigsten Tankstelle sparst.'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
          {/* Controls Column */}
          <div className="lg:col-span-7 space-y-6">
            {/* 1. Kraftstoffart wählen */}
            <div>
              <label className="block text-xs font-bold text-[#1B211D] uppercase tracking-wider mb-2">
                1. {lang === 'nl' ? 'Kies je brandstof' : 'Kraftstoffart wählen'}
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setCalcFuelType('diesel')}
                  className={`py-3 px-3 rounded-xl border text-sm font-bold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                    calcFuelType === 'diesel'
                      ? 'bg-[#0F4C2E] text-white border-[#0F4C2E] shadow-sm'
                      : 'bg-white text-[#4A544D] border-[#EDE8E0] hover:border-[#0F4C2E]'
                  }`}
                >
                  <span>Diesel</span>
                  <span className={`text-[11px] font-normal ${calcFuelType === 'diesel' ? 'text-emerald-200' : 'text-[#8A928B]'}`}>
                    ab {formatFuelPrice(cheapestDiesel?.diesel).main} €
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setCalcFuelType('e10')}
                  className={`py-3 px-3 rounded-xl border text-sm font-bold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                    calcFuelType === 'e10'
                      ? 'bg-[#0F4C2E] text-white border-[#0F4C2E] shadow-sm'
                      : 'bg-white text-[#4A544D] border-[#EDE8E0] hover:border-[#0F4C2E]'
                  }`}
                >
                  <span>Super E10</span>
                  <span className={`text-[11px] font-normal ${calcFuelType === 'e10' ? 'text-emerald-200' : 'text-[#8A928B]'}`}>
                    ab {formatFuelPrice(cheapestE10?.e10).main} €
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setCalcFuelType('e5')}
                  className={`py-3 px-3 rounded-xl border text-sm font-bold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                    calcFuelType === 'e5'
                      ? 'bg-[#0F4C2E] text-white border-[#0F4C2E] shadow-sm'
                      : 'bg-white text-[#4A544D] border-[#EDE8E0] hover:border-[#0F4C2E]'
                  }`}
                >
                  <span>Super E5</span>
                  <span className={`text-[11px] font-normal ${calcFuelType === 'e5' ? 'text-emerald-200' : 'text-[#8A928B]'}`}>
                    ab {formatFuelPrice(cheapestE5?.e5).main} €
                  </span>
                </button>
              </div>
            </div>

            {/* 2. Tankvolumen Slider (Schieberegler) */}
            <div className="bg-white border border-[#EDE8E0] rounded-xl p-5 shadow-2xs">
              <div className="flex justify-between items-center mb-3">
                <label className="text-xs font-bold text-[#1B211D] uppercase tracking-wider">
                  2. {lang === 'nl' ? 'Gewenste hoeveelheid liters' : 'Gewünschte Tankmenge'}
                </label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    min="5"
                    max="120"
                    value={calcLiters}
                    onChange={(e) => setCalcLiters(Math.max(5, Math.min(120, parseInt(e.target.value) || 5)))}
                    className="w-16 border border-[#EDE8E0] rounded px-2 py-1 text-right font-bold text-base text-[#1B211D] focus:outline-none focus:border-[#0F4C2E]"
                  />
                  <span className="font-bold text-sm text-[#5F6B63]">Liter</span>
                </div>
              </div>

              {/* Slider Component */}
              <input
                type="range"
                min="10"
                max="100"
                step="1"
                value={calcLiters}
                onChange={(e) => setCalcLiters(parseInt(e.target.value))}
                className="w-full h-2.5 bg-[#E8F1EB] rounded-lg appearance-none cursor-pointer accent-[#0F4C2E]"
              />

              <div className="flex justify-between text-[11px] text-[#8A928B] mt-2 font-medium">
                <span>10 L (Kleinwagen)</span>
                <span>45 L (Kompaktklasse)</span>
                <span>65 L (Kombi)</span>
                <span>100 L (Großtank / SUV)</span>
              </div>
            </div>

            {/* 3. Tankstellen-Wahl */}
            <div>
              <label className="block text-xs font-bold text-[#1B211D] uppercase tracking-wider mb-2">
                3. {lang === 'nl' ? 'Kies een tankstation' : 'Tankstelle auswählen'}
              </label>
              <select
                value={selectedStationId}
                onChange={(e) => setSelectedStationId(e.target.value)}
                className="w-full bg-white border border-[#EDE8E0] rounded-xl p-3 text-sm font-semibold text-[#1B211D] focus:outline-none focus:border-[#0F4C2E] shadow-2xs"
              >
                <option value="cheapest">
                  🏆 {lang === 'nl' ? 'Automatisch het voordeligste tankstation kiezen' : 'Automatisch günstigste Tankstelle in Winterberg'}
                </option>
                {stations.map((st) => (
                  <option key={st.id} value={st.id}>
                    {st.name} ({st.district || st.city}) — {formatFuelPrice(st[calcFuelType]).fullFormatted} / L
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Results Output Box Column */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div className="bg-[#0F4C2E] text-white rounded-2xl p-6 sm:p-8 shadow-md flex flex-col justify-between h-full">
              <div>
                <div className="flex justify-between items-center text-emerald-200 text-xs font-bold uppercase tracking-wider mb-2">
                  <span>{lang === 'nl' ? 'Geschatte Tankkosten' : 'Berechnete Gesamtkosten'}</span>
                  <span>{calcLiters} Liter</span>
                </div>

                {/* Total calculated price */}
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="font-display text-[46px] sm:text-[54px] font-black leading-none text-white">
                    {calculatedCostData.total.toFixed(2).replace('.', ',')}
                  </span>
                  <span className="text-2xl font-bold text-emerald-200 ml-1">€</span>
                </div>

                <div className="mt-3 text-xs text-emerald-100 flex items-center gap-1.5 pb-4 border-b border-emerald-700/60">
                  <CheckCircle className="w-4 h-4 text-emerald-300 shrink-0" />
                  <span>
                    {lang === 'nl' ? 'Berekend bij' : 'Berechnet bei'}: <strong>{calculatedCostData.stationName}</strong> ({formatFuelPrice(calculatedCostData.pricePerLiter).fullFormatted} / L)
                  </span>
                </div>

                {/* Savings Callout */}
                {calculatedCostData.savings > 0 && (
                  <div className="mt-5 bg-white/15 backdrop-blur-sm border border-white/25 rounded-xl p-4 text-xs text-white shadow-2xs">
                    <div className="flex items-center gap-2 font-bold text-amber-300 text-sm mb-1">
                      <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
                      <span>{lang === 'nl' ? 'Je bespaart' : 'Mögliche Ersparnis'}:</span>
                    </div>
                    <p className="m-0 leading-relaxed text-emerald-50">
                      {lang === 'nl'
                        ? `Je bespaart tot wel ${calculatedCostData.savings.toFixed(2).replace('.', ',')} € t.o.v. het duurste tankstation in de regio!`
                        : `Du sparst bis zu ${calculatedCostData.savings.toFixed(2).replace('.', ',')} € gegenüber der teuersten Tankstelle in Winterberg!`}
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-emerald-700/60 text-[11px] text-emerald-200">
                {lang === 'nl'
                  ? 'Alle prijzen zijn inclusief btw. Prijzen kunnen op elk moment wijzigen.'
                  : 'Preise inkl. MwSt. Angaben ohne Gewähr. Tanken vor 22:00 Uhr ist meistens am günstigsten.'}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: Helpful Tips for refueling in Winterberg */}
      <section className="bg-white border border-[#EDE8E0] rounded-xl p-6 sm:p-8 text-[#4A544D] text-sm">
        <h3 className="font-display text-lg font-bold text-[#1B211D] mb-4 flex items-center gap-2">
          <Info className="w-5 h-5 text-[#0F4C2E]" />
          {lang === 'nl' ? 'Handige tips voor tanken in Winterberg' : 'Tipps für günstiges Tanken in Winterberg'}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs leading-relaxed text-[#5F6B63]">
          <div>
            <strong className="text-[#1B211D] block mb-1 text-sm">🕐 Beste Uhrzeit zum Tanken</strong>
            <p>
              In Deutschland und im Sauerland sind die Spritpreise meist <strong>zwischen 18:00 und 22:00 Uhr</strong> am günstigsten. Morgens zwischen 06:00 und 09:00 Uhr sind die Preise oft am höchsten.
            </p>
          </div>
          <div>
            <strong className="text-[#1B211D] block mb-1 text-sm">⛽ E10 vs. Super E5</strong>
            <p>
              Super E10 ist in der Regel <strong>5 bis 6 Cent pro Liter günstiger</strong> als Super E5. Fast alle modernen Benziner vertragen E10 problemlos.
            </p>
          </div>
          <div>
            <strong className="text-[#1B211D] block mb-1 text-sm">⚖️ Datenquelle & Transparenz</strong>
            <p>
              Die Kraftstoffpreise werden direkt von der <strong>Markttransparenzstelle für Kraftstoffe (MTS-K)</strong> des Bundeskartellamts über die offizielle Tankerkönig-API bereitgestellt.
            </p>
          </div>
        </div>
      </section>
      </div>
    </main>
  );
};

export default FuelPricesPage;
