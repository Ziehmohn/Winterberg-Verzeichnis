let cachedData = null;
let cacheTime = 0;
const CACHE_TTL = 3 * 60 * 1000; // 3 minutes

export function isWinterbergStation(st) {
  const pc = String(st.postCode || '').trim();
  // If postal code is present and not 59955, it belongs to neighboring municipalities (e.g. Medebach 59964, Hallenberg 59969, Willingen 34508, Olsberg 59939)
  if (pc && pc !== '59955') {
    return false;
  }
  if (pc === '59955') return true;

  const place = (st.place || st.city || '').toLowerCase();
  return place.includes('winterberg');
}

export default async function handler(req, res) {
  const now = Date.now();
  if (cachedData && (now - cacheTime < CACHE_TTL)) {
    res.setHeader('Cache-Control', 's-maxage=180, stale-while-revalidate=600');
    return res.status(200).json(cachedData);
  }

  const apiKey = process.env.TANKERKOENIG_API_KEY || 'd20facb9-fc4c-4c3b-80db-7987da020af5';
  const tankerUrl = `https://creativecommons.tankerkoenig.de/json/list.php?lat=51.196&lng=8.532&rad=15&sort=dist&type=all&apikey=${apiKey}`;

  try {
    const response = await fetch(tankerUrl);
    if (!response.ok) {
      throw new Error(`Tankerkönig returned ${response.status}`);
    }

    const tData = await response.json();
    if (tData.ok && Array.isArray(tData.stations)) {
      const mappedStations = tData.stations.map((st) => {
        const isLocal = isWinterbergStation(st);
        const sName = st.name || '';
        const sStreet = st.street || '';
        let businessSlug;
        let businessPath;

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
          postCode: String(st.postCode || ''),
          city: st.place || (isLocal ? 'Winterberg' : ''),
          district: isLocal
            ? (st.place?.includes('Winterberg')
              ? (st.street?.toLowerCase().includes('langewiese') ? 'Langewiese' : (st.street?.toLowerCase().includes('zueschen') || st.street?.toLowerCase().includes('züschen') ? 'Züschen' : (st.street?.toLowerCase().includes('ruhrstr') ? 'Niedersfeld' : 'Winterberg')))
              : (st.place || 'Winterberg'))
            : (st.place || 'Nachbarort'),
          isOpen: st.isOpen ?? true,
          diesel: typeof st.diesel === 'number' ? st.diesel : null,
          e5: typeof st.e5 === 'number' ? st.e5 : null,
          e10: typeof st.e10 === 'number' ? st.e10 : null,
          dist: st.dist,
          lat: st.lat,
          lng: st.lng,
          businessSlug,
          businessPath,
          isLocal,
        };
      });

      const responseData = {
        ok: true,
        source: 'Tankerkönig / MTS-K',
        lastUpdated: new Date().toISOString(),
        isLive: true,
        stations: mappedStations,
      };

      cachedData = responseData;
      cacheTime = now;
      res.setHeader('Cache-Control', 's-maxage=180, stale-while-revalidate=600');
      return res.status(200).json(responseData);
    }
  } catch (err) {
    console.error('Error fetching fuel prices from Tankerkönig:', err);
  }

  // Fallback if Tankerkönig request fails
  const fallback = {
    ok: true,
    source: 'Tankerkönig / MTS-K',
    lastUpdated: new Date().toISOString(),
    isLive: false,
    stations: [
      {
        id: 'jet-tankstelle-winterberg',
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
        businessPath: '/mobilitaet-und-kfz/tankstellen/jet-tankstelle-winterberg',
        isLocal: true
      },
      {
        id: 'tinq-tankautomat-langewiese',
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
        businessPath: '/mobilitaet-und-kfz/tankstellen/tinq-tankautomat-langewiese',
        isLocal: true
      },
      {
        id: 'calpam-tankautomat-zueschen',
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
        businessPath: '/mobilitaet-und-kfz/tankstellen/calpam-tankautomat-zueschen',
        isLocal: true
      },
      {
        id: 'aral-tankstelle-winterberg',
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
        businessPath: '/mobilitaet-und-kfz/tankstellen/aral-tankstelle-winterberg',
        isLocal: true
      },
      {
        id: 'avia-siedlinghausen',
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
        isLocal: true
      },
      {
        id: 'total-medebach',
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
        dist: 11.1,
        isLocal: false
      },
      {
        id: 'aral-willingen',
        name: 'Aral Tankstelle Willingen',
        brand: 'Aral',
        street: 'Briloner Straße 36',
        postCode: '34508',
        city: 'Willingen',
        district: 'Willingen',
        isOpen: true,
        diesel: 1.679,
        e10: 1.749,
        e5: 1.809,
        dist: 12.0,
        isLocal: false
      }
    ]
  };

  return res.status(200).json(fallback);
}
