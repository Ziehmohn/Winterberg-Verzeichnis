import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Business } from '../types';
import { isOpenNow, canDisplayOpeningHours } from '../utils';
import { useTranslation } from '../i18n';
import { BadgeCheck, MapPin } from 'lucide-react';
import { getBusinessPath } from '../utils/routes';

// Fix Leaflet's default icon path issues in React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom orange icon for our map
const customIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Cache for geocoding to prevent hitting Nominatim too much
const geocodeCache: Record<string, [number, number]> = {};

const GeocodedMarker: React.FC<{ bus: Business; onClick: () => void; onPopupClick?: () => void }> = ({ bus, onClick, onPopupClick }) => {
  const { t } = useTranslation();
  const [position, setPosition] = useState<[number, number] | null>(
    bus.coordinates ? [bus.coordinates.lat, bus.coordinates.lng] : null
  );

  useEffect(() => {
    if (position) return;

    const cacheKey = bus.address + ", Winterberg, Deutschland";
    if (geocodeCache[cacheKey]) {
      setPosition(geocodeCache[cacheKey]);
      return;
    }

    const fetchGeocode = async () => {
      try {
        const query = encodeURIComponent(cacheKey);
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=1`, {
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'WinterbergWirtschaftApp/1.0' // Required by Nominatim
          }
        });
        const data = await res.json();
        if (data && data.length > 0) {
          const newPos: [number, number] = [parseFloat(data[0].lat), parseFloat(data[0].lon)];
          geocodeCache[cacheKey] = newPos;
          setPosition(newPos);
        }
      } catch (err) {
        console.error("Geocoding error for " + bus.address, err);
      }
    };

    // Add a slight random delay to avoid rate limiting
    setTimeout(fetchGeocode, Math.random() * 2000);
  }, [bus.address, position]);

  if (!position) return null;

  const showHours = canDisplayOpeningHours(bus);
  const openState = showHours && bus.openingHours ? isOpenNow(bus.openingHours, t) : null;

  return (
    <Marker position={position} icon={customIcon} eventHandlers={{ click: onClick }}>
      <Popup className="custom-popup">
        <div className="font-sans min-w-[200px]">
          <div className="flex items-center gap-1.5 focus:outline-none mb-1">
            <a 
              href={getBusinessPath(bus, lang)}
              onClick={(e) => {
                e.preventDefault();
                window.history.pushState(null, '', getBusinessPath(bus, lang));
                if (onPopupClick) onPopupClick();
              }}
              className="font-bold text-sm m-0 hover:underline hover:text-orange-600 cursor-pointer"
            >
              {bus.name}
            </a>
            {bus.isVerified && <BadgeCheck className="w-4 h-4 text-orange-500 shrink-0" title={t("verifiedBusiness") || "Verifiziertes Unternehmen"} />}
          </div>
          <p className="text-xs text-black/60 m-0">{bus.address}</p>
          {showHours && openState && (
            <p className={`text-xs mt-1 mb-0 font-medium ${openState.isOpen ? 'text-emerald-600' : 'text-red-600'}`}>
              {openState.text}
            </p>
          )}
        </div>
      </Popup>
    </Marker>
  );
}

// A simple component to re-center map if needed
function MapEventHandler() {
  const map = useMap();
  useEffect(() => {
    // Invalidate size on mount to ensure tiles load correctly (especially inside tabs/modals)
    setTimeout(() => {
      map.invalidateSize();
    }, 100);
  }, [map]);
  return null;
}

export default function DirectoryMap({ businesses, onSelectBusiness }: { businesses: Business[], onSelectBusiness?: (bus: Business) => void }) {
  const [selectedBus, setSelectedBus] = useState<Business | null>(null);

  return (
    <div className="w-full h-[600px] rounded-lg overflow-hidden shadow-sm border border-black/10 mt-6 relative z-0 relative">
      <MapContainer 
        center={[51.195, 8.528]} 
        zoom={12} 
        scrollWheelZoom={true} 
        style={{ width: '100%', height: '100%', zIndex: 1 }}
      >
        <MapEventHandler />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {businesses.map((bus) => (
          <GeocodedMarker 
            key={bus.id} 
            bus={bus} 
            onClick={() => setSelectedBus(bus)}
            onPopupClick={() => onSelectBusiness && onSelectBusiness(bus)}
          />
        ))}
      </MapContainer>
    </div>
  );
}
