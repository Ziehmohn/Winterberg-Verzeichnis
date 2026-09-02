import React, { useState, useEffect } from 'react';
import { Fuel, ArrowRight, RefreshCw, Clock, Sparkles, CheckCircle2 } from 'lucide-react';
import { Business } from '../types';
import { fetchFuelPrices, formatFuelPrice, matchBusinessToStation } from '../utils/fuelPriceService';
import { FuelStationPrice } from '../types';

interface FuelPriceWidgetProps {
  business: Business;
  lang: 'de' | 'nl';
  onNavigateToFuelPrices?: () => void;
}

export const FuelPriceWidget: React.FC<FuelPriceWidgetProps> = ({
  business,
  lang,
  onNavigateToFuelPrices,
}) => {
  const [station, setStation] = useState<FuelStationPrice | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    fetchFuelPrices().then((res) => {
      if (!isMounted) return;
      const matched = matchBusinessToStation(business, res.stations);
      setStation(matched);
      setLastUpdated(res.lastUpdated);
      setLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, [business.id, business.name]);

  // If business is not a petrol station, do not render
  const isFuelStation =
    business.subcategory === 'Tankstellen' ||
    business.category === 'Tankstellen' ||
    (business.additionalCategories &&
      business.additionalCategories.some((c) => c.subcategory === 'Tankstellen'));

  if (!isFuelStation) return null;

  const dieselFmt = formatFuelPrice(station?.diesel);
  const e10Fmt = formatFuelPrice(station?.e10);
  const e5Fmt = formatFuelPrice(station?.e5);

  return (
    <div className="my-6 bg-gradient-to-br from-[#FAF8F5] to-white border-2 border-[#E7E2DA] rounded-xl p-5 shadow-sm transition-all hover:border-[#F2761B]/40">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-[#EDE8E0]">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-[#0F4C2E]/10 text-[#0F4C2E] flex items-center justify-center font-bold">
            <Fuel className="w-5 h-5 text-[#0F4C2E]" />
          </div>
          <div>
            <h3 className="font-display text-[17px] font-bold text-[#1B211D] flex items-center gap-2 m-0">
              {lang === 'nl' ? 'Actuele brandstofprijzen' : 'Aktuelle Spritpreise'}
              {station?.isOpen ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100/90 px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  {lang === 'nl' ? 'Nu geopend' : 'Jetzt geöffnet'}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                  {lang === 'nl' ? 'Gesloten' : 'Geschlossen'}
                </span>
              )}
            </h3>
            <span className="text-[11.5px] text-[#8A928B]">
              {lang === 'nl' ? 'Live via Tankerkönig / MTS-K' : 'Live via Markttransparenzstelle (MTS-K)'}
            </span>
          </div>
        </div>

        {onNavigateToFuelPrices && (
          <button
            type="button"
            onClick={onNavigateToFuelPrices}
            className="text-xs font-bold text-[#D65F0C] hover:text-[#0F4C2E] flex items-center gap-1 transition-colors bg-transparent border-none cursor-pointer p-0"
          >
            <span>{lang === 'nl' ? 'Alle prijzen in Winterberg' : 'Alle Tankstellen vergleichen'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Fuel Price Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4">
        {/* Diesel */}
        <div className="bg-white border border-[#EDE8E0] rounded-lg p-3.5 flex flex-col justify-between shadow-2xs">
          <div className="flex justify-between items-center mb-1">
            <span className="font-bold text-xs text-[#5F6B63] uppercase tracking-wider">Diesel</span>
            <span className="text-[10px] bg-amber-50 text-amber-900 font-semibold px-1.5 py-0.5 rounded border border-amber-200/60">B7</span>
          </div>
          <div className="flex items-baseline gap-0.5 mt-1">
            <span className="font-display text-[26px] font-extrabold text-[#1B211D] leading-none">
              {dieselFmt.main}
            </span>
            <span className="text-[15px] font-bold text-[#1B211D] leading-none self-start mt-0.5">
              {dieselFmt.fraction}
            </span>
            <span className="text-xs font-semibold text-[#5F6B63] ml-1">€ / L</span>
          </div>
        </div>

        {/* Super E10 */}
        <div className="bg-white border border-[#EDE8E0] rounded-lg p-3.5 flex flex-col justify-between shadow-2xs">
          <div className="flex justify-between items-center mb-1">
            <span className="font-bold text-xs text-[#5F6B63] uppercase tracking-wider">Super E10</span>
            <span className="text-[10px] bg-emerald-50 text-emerald-900 font-semibold px-1.5 py-0.5 rounded border border-emerald-200/60">E10</span>
          </div>
          <div className="flex items-baseline gap-0.5 mt-1">
            <span className="font-display text-[26px] font-extrabold text-[#1B211D] leading-none">
              {e10Fmt.main}
            </span>
            <span className="text-[15px] font-bold text-[#1B211D] leading-none self-start mt-0.5">
              {e10Fmt.fraction}
            </span>
            <span className="text-xs font-semibold text-[#5F6B63] ml-1">€ / L</span>
          </div>
        </div>

        {/* Super E5 */}
        <div className="bg-white border border-[#EDE8E0] rounded-lg p-3.5 flex flex-col justify-between shadow-2xs">
          <div className="flex justify-between items-center mb-1">
            <span className="font-bold text-xs text-[#5F6B63] uppercase tracking-wider">Super E5</span>
            <span className="text-[10px] bg-blue-50 text-blue-900 font-semibold px-1.5 py-0.5 rounded border border-blue-200/60">E5</span>
          </div>
          <div className="flex items-baseline gap-0.5 mt-1">
            <span className="font-display text-[26px] font-extrabold text-[#1B211D] leading-none">
              {e5Fmt.main}
            </span>
            <span className="text-[15px] font-bold text-[#1B211D] leading-none self-start mt-0.5">
              {e5Fmt.fraction}
            </span>
            <span className="text-xs font-semibold text-[#5F6B63] ml-1">€ / L</span>
          </div>
        </div>
      </div>

      {/* Footer / CTA Banner */}
      <div className="pt-2 border-t border-[#EDE8E0] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs text-[#5F6B63]">
        <span>
          {lang === 'nl'
            ? '💡 Vergelijk alle tankstations in Winterberg en bereken je tankkosten.'
            : '💡 Tipp: Vergleiche alle Tankstellen in Winterberg und nutze den Tankrechner.'}
        </span>
        {onNavigateToFuelPrices && (
          <button
            type="button"
            onClick={onNavigateToFuelPrices}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0F4C2E] hover:bg-[#155D38] text-white rounded-md font-bold text-[12px] shadow-2xs transition-colors cursor-pointer border-none whitespace-nowrap"
          >
            <Fuel className="w-3.5 h-3.5" />
            <span>{lang === 'nl' ? 'Spritpreis-Vergleich & Rechner' : 'Live-Vergleich & Tankrechner'}</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default FuelPriceWidget;
