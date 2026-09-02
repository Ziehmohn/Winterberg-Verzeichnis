import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Business } from '../types';
import { MapPin, ExternalLink } from 'lucide-react';

// Fix Leaflet default icon path issues in React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom green icon to match brand
const brandIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Simple geocode cache
const geocodeCache: Record<string, [number, number]> = {};

// Component to set map center when position is found
function SetViewOnPosition({ position }: { position: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(position, 15);
  }, [position, map]);
  return null;
}

interface BusinessMapProps {
  business: Business;
  lang: 'de' | 'nl';
}

export default function BusinessMap({ business, lang }: BusinessMapProps) {
  const [position, setPosition] = useState<[number, number] | null>(
    business.coordinates ? [business.coordinates.lat, business.coordinates.lng] : null
  );
  const [isLoading, setIsLoading] = useState(!business.coordinates);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (position) return;

    const cacheKey = `${business.address}, Winterberg, Deutschland`;
    if (geocodeCache[cacheKey]) {
      setPosition(geocodeCache[cacheKey]);
      setIsLoading(false);
      return;
    }

    const fetchGeocode = async () => {
      try {
        const query = encodeURIComponent(cacheKey);
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=1`,
          { headers: { 'Accept': 'application/json', 'User-Agent': 'WinterbergVerzeichnisApp/1.0' } }
        );
        const data = await res.json();
        if (data && data.length > 0) {
          const newPos: [number, number] = [parseFloat(data[0].lat), parseFloat(data[0].lon)];
          geocodeCache[cacheKey] = newPos;
          setPosition(newPos);
        } else {
          // Fallback to Winterberg city center
          setPosition([51.1963, 8.5244]);
        }
      } catch {
        // Fallback to Winterberg city center on network error or rate limit
        setPosition([51.1963, 8.5244]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGeocode();
  }, [business.address, position]);

  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(business.address)}`;

  if (isLoading) {
    return (
      <div className="w-full h-[200px] bg-[#F0EDE7] rounded-lg flex items-center justify-center border border-[#EDE8E0] animate-pulse">
        <MapPin className="w-6 h-6 text-[#C5BFAF]" />
      </div>
    );
  }

  if (!position) {
    return null;
  }

  return (
    <div className="w-full overflow-hidden rounded-lg border border-[#EDE8E0] shadow-sm">
      <div className="relative" style={{ height: '200px' }}>
        <MapContainer
          center={position}
          zoom={15}
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
          scrollWheelZoom={false}
          dragging={false}
          doubleClickZoom={false}
          attributionControl={false}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />
          <SetViewOnPosition position={position} />
          <Marker position={position} icon={brandIcon} />
        </MapContainer>

        {/* Overlay: clickable to open Google Maps */}
        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute inset-0 z-[400] flex items-end justify-end p-2"
          title={lang === 'nl' ? 'Route plannen via Google Maps' : 'Route planen via Google Maps'}
        >
          <span className="flex items-center gap-1.5 bg-white text-[#0F4C2E] text-[12px] font-semibold px-2.5 py-1.5 rounded-md shadow-md border border-[#EDE8E0] hover:bg-[#0F4C2E] hover:text-white transition-colors">
            <ExternalLink className="w-3 h-3" />
            {lang === 'nl' ? 'Route plannen' : 'Route planen'}
          </span>
        </a>
      </div>
    </div>
  );
}
