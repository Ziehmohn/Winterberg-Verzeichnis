import React, { useState, useMemo } from 'react';
import { useTranslation } from '../i18n';
import { 
  Zap, 
  MapPin, 
  Clock, 
  Navigation, 
  ExternalLink, 
  CheckCircle2, 
  Filter, 
  Compass, 
  Info, 
  Coffee, 
  ShoppingBag, 
  Car,
  ChevronRight,
  HelpCircle,
  Sparkles
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { ChargingStation, ThemeConfig } from '../types';
import { CHARGING_STATIONS_DATA } from '../utils/chargingStationsData';

const MapBoundsHandler: React.FC<{ stations: ChargingStation[] }> = ({ stations }) => {
  const map = useMap();
  React.useEffect(() => {
    if (!stations || stations.length === 0) return;
    if (stations.length === 1) {
      map.flyTo([stations[0].lat, stations[0].lng], 15, { duration: 0.8 });
    } else {
      const bounds = L.latLngBounds(stations.map(s => [s.lat, s.lng]));
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 15 });
    }
  }, [stations, map]);
  return null;
};


// Custom Map Markers
const fastChargerIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const normalChargerIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface ChargingStationsPageProps {
  theme?: ThemeConfig;
  onBack?: () => void;
  onSelectBusinessPath?: (path: string) => void;
}

export const ChargingStationsPage: React.FC<ChargingStationsPageProps> = ({
  theme,
  onBack,
  onSelectBusinessPath,
}) => {
  const { t, lang } = useTranslation();
  const isNl = lang === 'nl';

  const [filterType, setFilterType] = useState<'all' | 'fast' | 'normal'>('all');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
  const [selectedStationId, setSelectedStationId] = useState<string | null>(null);

  React.useEffect(() => {
    const title = isNl
      ? 'Elektrische Laadpalen Winterberg | Snelladers & Laadpunten Kaart'
      : 'E-Ladestationen Winterberg | Schnelllader & Ladesäulen-Finder';
    document.title = title;

    const desc = isNl
      ? 'Vind alle openbare laadpalen en snelladers (tot 300 kW) in Winterberg, inclusief stekkertypes, tarieven en restaurants in de buurt.'
      : 'Interaktive Karte aller öffentlichen E-Ladesäulen und Schnellladeparks (bis 300 kW) in Winterberg. Mit Umkreis-Tipps für die Ladezeit.';
    
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', desc);
  }, [isNl]);

  // Extract districts
  const districts = useMemo(() => {
    const set = new Set<string>();
    CHARGING_STATIONS_DATA.forEach(s => set.add(s.district));
    return Array.from(set).sort();
  }, []);

  // Filter stations
  const filteredStations = useMemo(() => {
    return CHARGING_STATIONS_DATA.filter(s => {
      if (filterType === 'fast' && !s.isFastCharger) return false;
      if (filterType === 'normal' && s.isFastCharger) return false;
      if (selectedDistrict !== 'all' && s.district !== selectedDistrict) return false;
      return true;
    });
  }, [filterType, selectedDistrict]);

  const fastCount = CHARGING_STATIONS_DATA.filter(s => s.isFastCharger).length;
  const normalCount = CHARGING_STATIONS_DATA.length - fastCount;

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
          {isNl ? 'Laadpalen' : 'E-Ladesäulen-Radar'}
        </span>
      </nav>

      {/* Hero Banner */}
      <section className="relative rounded-2xl overflow-hidden shadow-lg mb-8 text-white bg-gradient-to-r from-[#0F3A40] via-[#15535D] to-[#0A262B] p-6 sm:p-10">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-cyan-300 mb-4">
            <Zap className="w-3.5 h-3.5" />
            {isNl ? 'Elektrisch Rijden in Winterberg' : 'E-Mobilität im Sauerland'}
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-3">
            {isNl ? 'E-Laadpalen & Snelladers Winterberg' : 'E-Ladesäulen & Schnellladeparks Winterberg'}
          </h1>
          <p className="text-sm sm:text-base text-white/90 leading-relaxed">
            {isNl
              ? 'Overzicht van alle openbare laadpunten in Winterberg en de dorpen. Van krachtige HPC-snelladers (tot 300 kW) tot handige AC-laadpalen bij hotels, skiliften en bezienswaardigheden.'
              : 'Öffentliche Ladepunkte in Winterberg und den Ortsteilen. Von High-Power-Chargern (bis 300 kW) an Einkaufszentren bis zu Destinations-Ladern an Skiliften und Wanderparkplätzen.'}
          </p>

          {/* Quick Metrics */}
          <div className="mt-6 flex flex-wrap gap-3">
            <div className="bg-white/10 backdrop-blur-sm border border-white/15 px-4 py-2.5 rounded-xl text-xs flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyan-300" />
              <span className="font-bold text-base">{CHARGING_STATIONS_DATA.length}</span>
              <span className="text-white/80">{isNl ? 'openbare locaties' : 'öffentliche Standorte'}</span>
            </div>
            <div className="bg-white/10 backdrop-blur-sm border border-white/15 px-4 py-2.5 rounded-xl text-xs flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-400"></span>
              <span className="font-bold text-base">{fastCount}</span>
              <span className="text-white/80">{isNl ? 'Snelladers (HPC DC)' : 'Schnellladeparks (DC)'}</span>
            </div>
            <div className="bg-white/10 backdrop-blur-sm border border-white/15 px-4 py-2.5 rounded-xl text-xs flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
              <span className="font-bold text-base">{normalCount}</span>
              <span className="text-white/80">{isNl ? 'Normale laadpalen (AC)' : 'Normallader (AC)'}</span>
            </div>
          </div>
        </div>

        {/* Decorative graphic */}
        <div className="absolute right-4 -bottom-10 opacity-10 pointer-events-none hidden md:block">
          <Car className="w-80 h-80 text-white" />
        </div>
      </section>

      {/* FILTER CONTROLS */}
      <div className="bg-white dark:bg-[#1E2621] rounded-2xl p-4 sm:p-5 border border-black/5 dark:border-white/10 shadow-sm mb-8 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        {/* Speed Type Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1">
          <button
            type="button"
            onClick={() => setFilterType('all')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
              filterType === 'all'
                ? 'bg-[#0F4C2E] text-white shadow-sm'
                : 'bg-gray-100 dark:bg-[#252E28] text-gray-700 dark:text-gray-300 hover:bg-gray-200'
            }`}
          >
            {isNl ? 'Alle laadpunten' : 'Alle Ladestationen'} ({CHARGING_STATIONS_DATA.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterType('fast')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              filterType === 'fast'
                ? 'bg-purple-700 text-white shadow-sm'
                : 'bg-gray-100 dark:bg-[#252E28] text-gray-700 dark:text-gray-300 hover:bg-gray-200'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-purple-400"></span>
            {isNl ? 'Alleen Snelladers (DC)' : 'Nur Schnelllader (DC ab 50 kW)'} ({fastCount})
          </button>
          <button
            type="button"
            onClick={() => setFilterType('normal')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              filterType === 'normal'
                ? 'bg-emerald-700 text-white shadow-sm'
                : 'bg-gray-100 dark:bg-[#252E28] text-gray-700 dark:text-gray-300 hover:bg-gray-200'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            {isNl ? 'Normaal laden (AC)' : 'Normallader (AC 22 kW)'} ({normalCount})
          </button>
        </div>

        {/* District Filter Dropdown */}
        <div className="w-full sm:w-64">
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="w-full py-2 px-3 text-xs bg-gray-50 dark:bg-[#151B17] border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-[#0F4C2E]"
          >
            <option value="all">{isNl ? 'Alle stadsdelen' : 'Alle Ortsteile'}</option>
            {districts.map(dist => (
              <option key={dist} value={dist}>{dist}</option>
            ))}
          </select>
        </div>
      </div>

      {/* LEAFLET MAP SECTION */}
      <div className="bg-white dark:bg-[#1E2621] rounded-2xl overflow-hidden border border-black/5 dark:border-white/10 shadow-sm mb-10">
        <div className="p-4 bg-gray-50 dark:bg-[#151B17] border-b border-gray-200 dark:border-gray-800 flex justify-between items-center text-xs">
          <span className="font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <Compass className="w-4 h-4 text-[#0F4C2E] dark:text-emerald-400" />
            {isNl ? 'Interactieve Laadpaalkaart Winterberg' : 'Interaktive Übersichtskarte Winterberg'}
          </span>
          <div className="flex items-center gap-4 text-[11px] text-gray-500">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-600 inline-block"></span>
              {isNl ? 'Snellader (DC)' : 'Schnelllader (DC)'}
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block"></span>
              {isNl ? 'Normaal (AC)' : 'Normallader (AC)'}
            </span>
          </div>
        </div>

        <div className="h-[420px] w-full z-0">
          <MapContainer
            center={[51.1960, 8.5300]}
            zoom={12}
            scrollWheelZoom={false}
            className="w-full h-full"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapBoundsHandler stations={filteredStations} />

            {filteredStations.map(station => (
              <Marker
                key={station.id}
                position={[station.lat, station.lng]}
                icon={station.isFastCharger ? fastChargerIcon : normalChargerIcon}
                eventHandlers={{
                  click: () => {
                    setSelectedStationId(station.id);
                  }
                }}
              >
                <Popup>
                  <div className="p-1 max-w-[220px]">
                    <div className="font-bold text-xs text-gray-900 mb-0.5">{station.name}</div>
                    <div className="text-[11px] text-gray-500 mb-2">{station.address}, {station.district}</div>
                    <div className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-gray-100 text-gray-800 mb-2">
                      Max. {station.maxPowerKw} kW
                    </div>
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${station.lat},${station.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-center py-1 px-2 bg-[#0F4C2E] text-white text-[11px] font-semibold rounded"
                    >
                      {isNl ? 'Navigeer' : 'Route planen'}
                    </a>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>

      {/* STATIONS LIST */}
      <div className="space-y-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center justify-between">
          <span>{filteredStations.length} {isNl ? 'Laadlocaties beschikbaar' : 'Ladestandorte verfügbar'}</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredStations.map((st) => (
            <div
              key={st.id}
              className={`bg-white dark:bg-[#1E2621] rounded-2xl p-6 border transition-all shadow-sm hover:shadow-md flex flex-col justify-between ${
                selectedStationId === st.id 
                  ? 'border-2 border-[#0F4C2E] ring-2 ring-[#0F4C2E]/20' 
                  : 'border-black/5 dark:border-white/10'
              }`}
            >
              <div>
                {/* Header */}
                <div className="flex justify-between items-start gap-2 mb-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2.5 py-0.5 rounded text-[11px] font-bold ${
                        st.isFastCharger 
                          ? 'bg-purple-100 text-purple-800 dark:bg-purple-950/70 dark:text-purple-300' 
                          : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300'
                      }`}>
                        {st.isFastCharger ? (isNl ? 'Snellader DC' : 'Schnelllader DC') : 'Normallader AC'}
                      </span>
                      <span className="text-xs font-semibold text-gray-500">
                        {st.operator}
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-gray-900 dark:text-white leading-snug">
                      {st.name}
                    </h4>
                  </div>

                  <span className="text-base font-black px-2.5 py-1 bg-gray-100 dark:bg-[#151B17] text-[#0F4C2E] dark:text-emerald-400 rounded-lg shrink-0">
                    {st.maxPowerKw} kW
                  </span>
                </div>

                <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5 mb-4">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{st.address}, {st.district}</span>
                </p>

                {/* Plug types */}
                <div className="mb-4">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block mb-1.5">
                    {isNl ? 'Aansluitingen & Vermogen:' : 'Verfügbare Anschlüsse:'}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {st.plugs.map((p, idx) => (
                      <span 
                        key={idx}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-50 dark:bg-[#151B17] border border-gray-200 dark:border-gray-800 rounded-md text-xs font-medium text-gray-700 dark:text-gray-300"
                      >
                        <Zap className="w-3 h-3 text-emerald-600" />
                        <span>{p.count}x {p.type} ({p.powerKw} kW)</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Fees / Notes */}
                <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1 mb-4 bg-gray-50 dark:bg-[#151B17] p-3 rounded-xl">
                  <div>
                    <span className="font-semibold text-gray-700 dark:text-gray-300">{isNl ? 'Tarieven:' : 'Kosten:'} </span>
                    <span>{isNl ? (st.costInfo_nl || st.costInfo) : st.costInfo}</span>
                  </div>
                  {st.parkingFeeInfo && (
                    <div>
                      <span className="font-semibold text-gray-700 dark:text-gray-300">{isNl ? 'Parkeren:' : 'Parken:'} </span>
                      <span>{isNl ? (st.parkingFeeInfo_nl || st.parkingFeeInfo) : st.parkingFeeInfo}</span>
                    </div>
                  )}
                </div>

                {/* Nearby highlights ("Ladezeit sinnvoll nutzen") */}
                {st.nearbyHighlights && st.nearbyHighlights.length > 0 && (
                  <div className="pt-3 border-t border-gray-100 dark:border-gray-800 mb-4">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#0F4C2E] dark:text-emerald-400 flex items-center gap-1.5 mb-2">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{isNl ? 'Tijdens het laden (in de buurt):' : 'Ladezeit sinnvoll nutzen (zu Fuß):'}</span>
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {st.nearbyHighlights.map((hl, i) => (
                        <span 
                          key={i}
                          className="inline-flex items-center gap-1 text-xs text-gray-700 dark:text-gray-300 bg-emerald-50/70 dark:bg-emerald-950/30 px-2 py-1 rounded border border-emerald-200/50 dark:border-emerald-800/50"
                        >
                          {hl.category === 'Gastronomie' ? <Coffee className="w-3 h-3 text-amber-600" /> : <ShoppingBag className="w-3 h-3 text-emerald-600" />}
                          <span>{hl.name}</span>
                          <span className="text-[10px] text-gray-400">({hl.distanceMeters}m)</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Navigation Button */}
              <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-end">
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${st.lat},${st.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 py-2 px-4 bg-[#0F4C2E] hover:bg-[#14532D] text-white text-xs font-semibold rounded-lg transition-colors shadow-sm"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>{isNl ? 'Route starten' : 'Navigation starten'}</span>
                  <ExternalLink className="w-3 h-3 opacity-70" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default ChargingStationsPage;
