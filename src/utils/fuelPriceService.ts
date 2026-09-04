import { FuelPriceResponse, FuelStationPrice } from '../types';

export const FALLBACK_FUEL_STATIONS: FuelStationPrice[] = [
  {
    id: 'jet-tankstelle-winterberg',
    tankerId: 'jet-winterberg',
    name: 'JET Tankstelle Winterberg',
    brand: 'JET',
    street: 'Lamfert 1',
    postCode: '59955',
    city: 'Winterberg',
    district: 'Winterberg',
    isOpen: true,
    diesel: 1.639,
    e10: 1.709,
    e5: 1.769,
    dist: 0.8,
    businessSlug: 'jet-tankstelle-winterberg',
    businessPath: '/mobilitaet-und-kfz/tankstellen/jet-tankstelle-winterberg'
  },
  {
    id: 'tinq-tankautomat-langewiese',
    tankerId: 'tinq-langewiese',
    name: 'TinQ 24h-Tankautomat Langewiese',
    brand: 'TinQ',
    street: 'Bundesstraße 38',
    postCode: '59955',
    city: 'Winterberg',
    district: 'Langewiese',
    isOpen: true,
    diesel: 1.629,
    e10: 1.699,
    e5: 1.759,
    dist: 7.5,
    businessSlug: 'tinq-tankautomat-langewiese',
    businessPath: '/mobilitaet-und-kfz/tankstellen/tinq-tankautomat-langewiese'
  },
  {
    id: 'calpam-tankautomat-zueschen',
    tankerId: 'calpam-zueschen',
    name: 'Calpam Tankautomat Züschen',
    brand: 'Calpam',
    street: 'Nuhnetalstraße 88',
    postCode: '59955',
    city: 'Winterberg',
    district: 'Züschen',
    isOpen: true,
    diesel: 1.649,
    e10: 1.719,
    e5: 1.779,
    dist: 6.8,
    businessSlug: 'calpam-tankautomat-zueschen',
    businessPath: '/mobilitaet-und-kfz/tankstellen/calpam-tankautomat-zueschen'
  },
  {
    id: 'aral-tankstelle-winterberg',
    tankerId: 'aral-winterberg',
    name: 'Aral Tankstelle Winterberg',
    brand: 'Aral',
    street: 'Am Hagenblech 60',
    postCode: '59955',
    city: 'Winterberg',
    district: 'Winterberg',
    isOpen: true,
    diesel: 1.669,
    e10: 1.739,
    e5: 1.799,
    dist: 1.2,
    businessSlug: 'aral-tankstelle-winterberg',
    businessPath: '/mobilitaet-und-kfz/tankstellen/aral-tankstelle-winterberg'
  },
  {
    id: 'avia-siedlinghausen',
    tankerId: 'avia-siedlinghausen',
    name: 'AVIA Tankstelle Siedlinghausen',
    brand: 'AVIA',
    street: 'Hochsauerlandstraße 12',
    postCode: '59955',
    city: 'Winterberg',
    district: 'Siedlinghausen',
    isOpen: true,
    diesel: 1.659,
    e10: 1.729,
    e5: 1.789,
    dist: 8.9,
  },
  {
    id: 'total-medebach',
    tankerId: 'total-medebach',
    name: 'TOTAL Tankstelle Medebach',
    brand: 'TOTAL',
    street: 'Oberstraße 52',
    postCode: '59964',
    city: 'Medebach',
    district: 'Medebach',
    isOpen: true,
    diesel: 1.649,
    e10: 1.719,
    e5: 1.779,
    dist: 14.2,
  }
];

let cachedPrices: FuelPriceResponse | null = null;
let lastFetchTime = 0;
const CACHE_TTL = 3 * 60 * 1000; // 3 min client cache

/**
 * Fetches fuel prices from the API, with automatic fallback and caching.
 */
export async function fetchFuelPrices(forceRefresh = false): Promise<FuelPriceResponse> {
  const now = Date.now();
  if (!forceRefresh && cachedPrices && now - lastFetchTime < CACHE_TTL) {
    return cachedPrices;
  }

  try {
    const res = await fetch('/api/fuel-prices');
    if (res.ok) {
      const data: FuelPriceResponse = await res.json();
      if (data && Array.isArray(data.stations) && data.stations.length > 0) {
        cachedPrices = data;
        lastFetchTime = now;
        return data;
      }
    }
  } catch (e) {
    console.warn('Could not fetch /api/fuel-prices, trying direct Tankerkönig query:', e);
  }

  // Direct client-side fetch from Tankerkönig (CORS enabled) with the configured API key
  try {
    const apiKey = 'd20facb9-fc4c-4c3b-80db-7987da020af5';
    const tankerUrl = `https://creativecommons.tankerkoenig.de/json/list.php?lat=51.196&lng=8.532&rad=15&sort=dist&type=all&apikey=${apiKey}`;
    const directRes = await fetch(tankerUrl);
    if (directRes.ok) {
      const tData = await directRes.json();
      if (tData.ok && Array.isArray(tData.stations)) {
        const mappedStations = tData.stations.map((st: any) => {
          const sName = st.name || '';
          const sStreet = st.street || '';
          let businessSlug: string | undefined;
          let businessPath: string | undefined;

          if (sName.toLowerCase().includes('jet') || sStreet.toLowerCase().includes('lamfert')) {
            businessSlug = 'jet-tankstelle-winterberg';
            businessPath = '/mobilitaet-und-kfz/tankstellen/jet-tankstelle-winterberg';
          } else if (sName.toLowerCase().includes('aral') || sStreet.toLowerCase().includes('hagenblech')) {
            businessSlug = 'aral-tankstelle-winterberg';
            businessPath = '/mobilitaet-und-kfz/tankstellen/aral-tankstelle-winterberg';
          } else if (sName.toLowerCase().includes('tinq') || sStreet.toLowerCase().includes('langewiese') || sStreet.toLowerCase().includes('bundesstr')) {
            businessSlug = 'tinq-tankautomat-langewiese';
            businessPath = '/mobilitaet-und-kfz/tankstellen/tinq-tankautomat-langewiese';
          } else if (sName.toLowerCase().includes('calpam') || sStreet.toLowerCase().includes('nuhnetal')) {
            businessSlug = 'calpam-tankautomat-zueschen';
            businessPath = '/mobilitaet-und-kfz/tankstellen/calpam-tankautomat-zueschen';
          }

          return {
            id: st.id,
            name: st.name,
            brand: st.brand || st.name,
            street: st.street || '',
            houseNumber: st.houseNumber || '',
            postCode: String(st.postCode || '59955'),
            city: st.place || 'Winterberg',
            district: st.place?.includes('Winterberg')
              ? (st.street?.toLowerCase().includes('langewiese') ? 'Langewiese' : (st.street?.toLowerCase().includes('zueschen') || st.street?.toLowerCase().includes('züschen') ? 'Züschen' : 'Winterberg'))
              : st.place,
            isOpen: st.isOpen ?? true,
            diesel: typeof st.diesel === 'number' ? st.diesel : null,
            e5: typeof st.e5 === 'number' ? st.e5 : null,
            e10: typeof st.e10 === 'number' ? st.e10 : null,
            dist: st.dist,
            lat: st.lat,
            lng: st.lng,
            businessSlug,
            businessPath,
          };
        });

        const liveResponse: FuelPriceResponse = {
          ok: true,
          source: 'Tankerkönig / MTS-K',
          lastUpdated: new Date().toISOString(),
          isLive: true,
          stations: mappedStations,
        };

        cachedPrices = liveResponse;
        lastFetchTime = now;
        return liveResponse;
      }
    }
  } catch (directErr) {
    console.warn('Direct Tankerkönig fetch fallback failed:', directErr);
  }

  // Fallback response
  const fallbackResponse: FuelPriceResponse = {
    ok: true,
    source: 'Tankerkönig / MTS-K',
    lastUpdated: new Date().toISOString(),
    isLive: false,
    apiKeyRequired: false,
    stations: FALLBACK_FUEL_STATIONS,
  };

  cachedPrices = fallbackResponse;
  lastFetchTime = now;
  return fallbackResponse;
}

/**
 * Formats a fuel price (e.g. 1.649) into currency with 9th-fraction (e.g. "1,64⁹ €").
 */
export function formatFuelPrice(price: number | null | undefined): {
  main: string;
  fraction: string;
  fullFormatted: string;
} {
  if (price === null || price === undefined || price <= 0) {
    return { main: '-,-', fraction: '', fullFormatted: 'Keine Angabe' };
  }

  const str = price.toFixed(3).replace('.', ',');
  const parts = str.split(',');
  const mainPart = `${parts[0]},${parts[1].slice(0, 2)}`;
  const ninthPart = parts[1].slice(2, 3) || '9';

  return {
    main: mainPart,
    fraction: ninthPart,
    fullFormatted: `${mainPart}${ninthPart} €`,
  };
}

/**
 * Finds the matching fuel station for a business (by ID, address or name).
 */
export function matchBusinessToStation(
  business: { id?: string; name: string; address?: string; subcategory?: string },
  stations: FuelStationPrice[]
): FuelStationPrice | null {
  if (!business || !stations || stations.length === 0) return null;

  const bId = (business.id || '').toLowerCase();
  const bName = business.name.toLowerCase();
  const bAddr = (business.address || '').toLowerCase();

  // 1. Direct ID match
  const directMatch = stations.find(s => s.id === bId || s.tankerId === bId);
  if (directMatch) return directMatch;

  // 2. Name & Address heuristics for known Winterberg stations
  if (bName.includes('jet') || bAddr.includes('lamfert')) {
    return stations.find(s => s.brand.toLowerCase() === 'jet' || s.name.toLowerCase().includes('jet')) || null;
  }
  if (bName.includes('aral') || bAddr.includes('hagenblech')) {
    return stations.find(s => s.brand.toLowerCase() === 'aral' || s.name.toLowerCase().includes('aral')) || null;
  }
  if (bName.includes('tinq') || bAddr.includes('langewiese')) {
    return stations.find(s => s.brand.toLowerCase() === 'tinq' || s.name.toLowerCase().includes('tinq') || s.name.toLowerCase().includes('langewiese')) || null;
  }
  if (bName.includes('calpam') || bAddr.includes('züschen') || bAddr.includes('zueschen') || bAddr.includes('nuhnetal')) {
    return stations.find(s => s.brand.toLowerCase() === 'calpam' || s.name.toLowerCase().includes('calpam') || s.name.toLowerCase().includes('züschen')) || null;
  }

  // 3. Fallback name match
  return stations.find(s => bName.includes(s.brand.toLowerCase())) || null;
}
