// Serverless endpoint for fetching jobs from the Bundesagentur für Arbeit API

const jobsMemoryCache = new Map();
const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const wo = (req.query.wo || 'Winterberg');
    const umkreis = (req.query.umkreis || '10');
    const was = (req.query.was || '');
    const size = (req.query.size || '100');
    const page = (req.query.page || '1');

    const cacheKey = `${wo}_${umkreis}_${was}_${size}_${page}`.toLowerCase();
    const now = Date.now();
    const cached = jobsMemoryCache.get(cacheKey);

    if (cached && now - cached.timestamp < CACHE_TTL_MS) {
      res.setHeader('Cache-Control', 's-maxage=1800, stale-while-revalidate=3600');
      return res.status(200).json(cached.data);
    }

    const queryParams = new URLSearchParams({
      wo,
      umkreis,
      size,
      page
    });
    if (was.trim()) {
      queryParams.set('was', was.trim());
    }

    const baUrl = `https://rest.arbeitsagentur.de/jobboerse/jobsuche-service/pc/v6/jobs?${queryParams.toString()}`;

    const baResponse = await fetch(baUrl, {
      headers: {
        'X-API-Key': 'jobboerse-jobsuche',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) WinterbergVerzeichnis/1.0',
        'Accept': 'application/json'
      }
    });

    if (!baResponse.ok) {
      throw new Error(`Arbeitsagentur API returned status ${baResponse.status}`);
    }

    const baData = await baResponse.json();

    const responsePayload = {
      ok: true,
      source: 'Bundesagentur für Arbeit',
      total: baData.maxErgebnisse || (baData.ergebnisliste ? baData.ergebnisliste.length : 0),
      jobs: baData.ergebnisliste || [],
      lastUpdated: new Date().toISOString()
    };

    jobsMemoryCache.set(cacheKey, { data: responsePayload, timestamp: now });

    res.setHeader('Cache-Control', 's-maxage=1800, stale-while-revalidate=3600');
    return res.status(200).json(responsePayload);
  } catch (err) {
    console.error('Error fetching jobs in serverless handler:', err);
    return res.status(500).json({
      ok: false,
      error: err.message || 'Failed to fetch jobs',
      jobs: []
    });
  }
}
