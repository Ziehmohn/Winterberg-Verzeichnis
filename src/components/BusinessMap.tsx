import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Business } from '../types';
import { MapPin, ExternalLink } from 'lucide-react';
import { formatBusinessAddress } from '../utils';

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

// Coordinates for all 14 districts of Winterberg + Kernstadt
export const DISTRICT_COORDINATES: Record<string, [number, number]> = {
  'Winterberg': [51.1956, 8.5338],
  'Altastenberg': [51.1873, 8.4687],
  'Altenfeld': [51.2612, 8.4468],
  'Neuastenberg': [51.1627, 8.4908],
  'Züschen': [51.1578, 8.5663],
  'Niedersfeld': [51.2588, 8.5297],
  'Siedlinghausen': [51.2505, 8.4901],
  'Silbach': [51.2263, 8.4727],
  'Elkeringhausen': [51.2155, 8.5714],
  'Grönebach': [51.2359, 8.5583],
  'Hildfeld': [51.2536, 8.5667],
  'Mollseifen': [51.1491, 8.4878],
  'Lenneplätze': [51.1642, 8.4746],
  'Langewiese': [51.1539, 8.4552],
  'Hoheleye': [51.1444, 8.4419]
};

export function getDistrictFallbackCoordinates(district?: string): [number, number] {
  if (district && DISTRICT_COORDINATES[district]) {
    return DISTRICT_COORDINATES[district];
  }
  return DISTRICT_COORDINATES['Winterberg'];
}

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
  const fallbackPosition = getDistrictFallbackCoordinates(business.district);

  const [position, setPosition] = useState<[number, number]>(
    business.coordinates
      ? [business.coordinates.lat, business.coordinates.lng]
      : (geocodeCache[formatBusinessAddress(business.address, business.district)] || fallbackPosition)
  );
  const [isLoading, setIsLoading] = useState(!business.coordinates && !geocodeCache[formatBusinessAddress(business.address, business.district)]);

  useEffect(() => {
    if (business.coordinates) {
      setPosition([business.coordinates.lat, business.coordinates.lng]);
      setIsLoading(false);
      return;
    }

    const rawAddress = formatBusinessAddress(business.address, business.district) || 'Winterberg';
    const cacheKey = rawAddress;
    if (geocodeCache[cacheKey]) {
      setPosition(geocodeCache[cacheKey]);
      setIsLoading(false);
      return;
    }

    // Clean common abbreviations (e.g. "In d. Renau 10/11" -> "In der Renau 10")
    const cleanAddress = rawAddress
      .replace(/\bIn d\.\s*/gi, 'In der ')
      .replace(/\bBgm\.-/gi, 'Bürgermeister-')
      .replace(/\bDr\.-/gi, 'Doktor-')
      .replace(/(\d+)\/\d+/g, '$1'); // "10/11" -> "10"

    const fetchGeocode = async () => {
      try {
        // 1. Try Photon (fast, handles fuzzy search & abbreviations, no CORS blocks)
        try {
          const photonRes = await fetch(
            `https://photon.komoot.io/api/?q=${encodeURIComponent(cleanAddress + ', Winterberg')}&limit=1`
          );
          if (photonRes.ok) {
            const photonData = await photonRes.json();
            const feat = photonData.features?.[0];
            if (feat && feat.geometry && Array.isArray(feat.geometry.coordinates)) {
              const coords: [number, number] = [feat.geometry.coordinates[1], feat.geometry.coordinates[0]];
              geocodeCache[cacheKey] = coords;
              setPosition(coords);
              setIsLoading(false);
              return;
            }
          }
        } catch {
          // Continue to fallback
        }

        // 2. Nominatim fallback with proper headers
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(cleanAddress + ', Deutschland')}&limit=1`,
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
              geocodeCache[cacheKey] = coords;
              setPosition(coords);
              setIsLoading(false);
              return;
            }
          }
        } catch {
          // Continue to fallback
        }

        // 3. Fallback to district center
        geocodeCache[cacheKey] = fallbackPosition;
        setPosition(fallbackPosition);
      } catch (err) {
        console.warn('Geocoding error, falling back to district center:', err);
        setPosition(fallbackPosition);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGeocode();
  }, [business.address, business.district, business.coordinates, fallbackPosition]);

  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(formatBusinessAddress(business.address, business.district) || 'Winterberg')}`;

  const currentPosition = position || fallbackPosition;

  return (
    <div className="w-full overflow-hidden rounded-lg border border-[#EDE8E0] shadow-sm">
      <div className="relative" style={{ height: '200px' }}>
        <MapContainer
          center={currentPosition}
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
          <SetViewOnPosition position={currentPosition} />
          <Marker position={currentPosition} icon={brandIcon} />
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
