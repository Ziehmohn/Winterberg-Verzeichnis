import { Business, Job } from '../types';
import { getBusinessPath } from './routes';

export type JobTypeCategory = 'Alle' | 'Vollzeit' | 'Teilzeit' | 'Ausbildung' | 'Minijob';

export interface JobListing {
  id: string;
  title: string;
  company: string;
  location: string;
  district?: string;
  type: 'Vollzeit' | 'Teilzeit' | 'Vollzeit / Teilzeit' | 'Ausbildung' | 'Minijob' | 'Praktikum' | 'Sonstiges';
  category?: string;
  publishedDate?: string;
  relativeDate?: string;
  source: 'arbeitsagentur' | 'partner';
  externalUrl?: string;
  matchedBusiness?: {
    id: string;
    name: string;
    businessPath: string;
    logoUrl?: string;
    isPremium?: boolean;
    category?: string;
  };
  salary?: string;
  description?: string;
}

export interface FetchJobsParams {
  wo?: string;
  umkreis?: number | string;
  was?: string;
  page?: number;
  size?: number;
}

// In-memory client cache to speed up navigation
let clientJobsCache: { [key: string]: { data: JobListing[]; total: number; timestamp: number } } = {};

/**
 * Format relative date (e.g. "Heute", "Gestern", "Vor 3 Tagen", "12.08.2026")
 */
export function formatRelativeDate(dateStr?: string, lang: 'de' | 'nl' = 'de'): string {
  if (!dateStr) return '';
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;

    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) {
      return lang === 'nl' ? 'Vandaag' : 'Heute';
    }
    if (diffDays === 1) {
      return lang === 'nl' ? 'Gisteren' : 'Gestern';
    }
    if (diffDays < 7) {
      return lang === 'nl' ? `${diffDays} dagen geleden` : `Vor ${diffDays} Tagen`;
    }

    return date.toLocaleDateString(lang === 'nl' ? 'nl-NL' : 'de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  } catch {
    return dateStr;
  }
}

/**
 * Identify district from location / address / title
 */
const WINTERBERG_DISTRICTS = [
  'Züschen', 'Zueschen', 'Niedersfeld', 'Siedlinghausen', 'Silbach',
  'Neuastenberg', 'Altastenberg', 'Langewiese', 'Elkeringhausen',
  'Grönebach', 'Groenebach', 'Hildfeld', 'Mollseifen', 'Hoheleye', 'Lenneplätze'
];

function extractDistrict(rawText: string): string | undefined {
  const lower = rawText.toLowerCase();
  for (const dist of WINTERBERG_DISTRICTS) {
    if (lower.includes(dist.toLowerCase())) {
      // Normalize umlaut
      if (dist === 'Zueschen') return 'Züschen';
      if (dist === 'Groenebach') return 'Grönebach';
      return dist;
    }
  }
  return undefined;
}

/**
 * Clean up company name for fuzzy matching against directory
 */
function cleanCompanyName(name: string): string {
  return name
    .toLowerCase()
    .replace(/\b(gmbh|ag|kg|ug|e\.k\.|e\.v\.|co\.?\s*kg|inc|ltd|ohg|gem\.)\b/gi, '')
    .replace(/[^\w\säöüß]/gi, '')
    .trim();
}

/**
 * Find matching business from directory by company name
 */
export function findMatchingBusiness(companyName: string, businesses: Business[]): Business | undefined {
  if (!companyName || !businesses || businesses.length === 0) return undefined;
  
  const cleanTarget = cleanCompanyName(companyName);
  if (cleanTarget.length < 3) return undefined;

  // 1. Exact match after cleaning
  for (const b of businesses) {
    const cleanB = cleanCompanyName(b.name);
    if (cleanB === cleanTarget) {
      return b;
    }
  }

  // 2. Substring match for distinct names (> 5 chars)
  if (cleanTarget.length >= 6) {
    for (const b of businesses) {
      const cleanB = cleanCompanyName(b.name);
      if (cleanB.length >= 6 && (cleanTarget.includes(cleanB) || cleanB.includes(cleanTarget))) {
        return b;
      }
    }
  }

  return undefined;
}

/**
 * Normalize raw job from Bundesagentur für Arbeit
 */
export function normalizeArbeitsagenturJob(
  rawJob: any, 
  businesses: Business[], 
  lang: 'de' | 'nl' = 'de'
): JobListing {
  const title = rawJob.stellenangebotsTitel || rawJob.hauptberuf || 'Stellenangebot';
  const company = rawJob.firma || 'Unternehmen in Winterberg';
  
  // Location
  const loc = rawJob.stellenlokationen && rawJob.stellenlokationen[0] ? rawJob.stellenlokationen[0] : null;
  const ort = loc?.adresse?.ort || 'Winterberg';
  const plz = loc?.adresse?.plz || '59955';
  const district = extractDistrict(ort) || extractDistrict(rawJob.stellenangebotsTitel || '') || (ort.includes('Winterberg') ? undefined : ort);
  const locationStr = district ? `${district} (Winterberg)` : `${plz} ${ort}`;

  // Job Type determination
  let type: JobListing['type'] = 'Vollzeit';
  const titleLower = title.toLowerCase();
  
  if (
    rawJob.stellenangebotsart === 'AUSBILDUNG' || 
    rawJob.ausbildungsart || 
    titleLower.includes('ausbildung') || 
    titleLower.includes('azubi')
  ) {
    type = 'Ausbildung';
  } else if (
    titleLower.includes('minijob') || 
    titleLower.includes('aushilfe') || 
    titleLower.includes('538') || 
    titleLower.includes('520')
  ) {
    type = 'Minijob';
  } else if (rawJob.arbeitszeitVollzeit && (rawJob.arbeitszeitTeilzeitFlexibel || rawJob.arbeitszeitTeilzeitVormittag || rawJob.arbeitszeitTeilzeitNachmittag)) {
    type = 'Vollzeit / Teilzeit';
  } else if (rawJob.arbeitszeitVollzeit) {
    type = 'Vollzeit';
  } else if (rawJob.arbeitszeitTeilzeitFlexibel || rawJob.arbeitszeitTeilzeitVormittag || rawJob.arbeitszeitTeilzeitNachmittag) {
    type = 'Teilzeit';
  }

  // Official Arbeitsagentur Link
  const refnr = rawJob.referenznummer || '';
  const externalUrl = refnr 
    ? `https://www.arbeitsagentur.de/jobsuche/jobdetail/${encodeURIComponent(refnr)}`
    : undefined;

  // Match against directory
  const matched = findMatchingBusiness(company, businesses);

  return {
    id: refnr || `ba-${Math.random().toString(36).substring(2, 9)}`,
    title,
    company,
    location: locationStr,
    district,
    type,
    category: rawJob.hauptberuf,
    publishedDate: rawJob.datumErsteVeroeffentlichung || rawJob.veroeffentlichungszeitraum?.von,
    relativeDate: formatRelativeDate(rawJob.datumErsteVeroeffentlichung || rawJob.veroeffentlichungszeitraum?.von, lang),
    source: 'arbeitsagentur',
    externalUrl,
    matchedBusiness: matched ? {
      id: matched.id,
      name: matched.name,
      businessPath: getBusinessPath(matched, lang),
      logoUrl: matched.logoUrl,
      isPremium: matched.isPremium,
      category: matched.category
    } : undefined
  };
}

/**
 * Convert portal native premium jobs into JobListing items
 */
export function getPortalPartnerJobs(businesses: Business[], lang: 'de' | 'nl' = 'de'): JobListing[] {
  const listings: JobListing[] = [];
  
  if (!businesses) return listings;

  businesses.forEach(b => {
    if (b.isPremium && b.jobs && b.jobs.length > 0) {
      b.jobs.forEach(job => {
        let typeVal: JobListing['type'] = 'Vollzeit';
        const tLower = (job.type || '').toLowerCase();
        if (tLower.includes('teilzeit')) typeVal = 'Teilzeit';
        else if (tLower.includes('ausbildung')) typeVal = 'Ausbildung';
        else if (tLower.includes('minijob')) typeVal = 'Minijob';
        else if (tLower.includes('praktikum')) typeVal = 'Praktikum';

        listings.push({
          id: `partner-${b.id}-${job.id}`,
          title: job.title,
          company: b.name,
          location: job.location || (b.district ? `${b.district} (Winterberg)` : 'Winterberg'),
          district: b.district,
          type: typeVal,
          publishedDate: job.createdAt,
          relativeDate: formatRelativeDate(job.createdAt, lang),
          source: 'partner',
          externalUrl: job.externalUrl,
          description: job.description,
          salary: job.salary,
          matchedBusiness: {
            id: b.id,
            name: b.name,
            businessPath: getBusinessPath(b, lang),
            logoUrl: b.logoUrl,
            isPremium: true,
            category: b.category
          }
        });
      });
    }
  });

  return listings;
}

/**
 * Fetch live jobs from our backend proxy (/api/jobs)
 */
export async function fetchArbeitsagenturJobs(
  params: FetchJobsParams = {},
  businesses: Business[] = [],
  lang: 'de' | 'nl' = 'de'
): Promise<{ jobs: JobListing[]; total: number }> {
  const wo = params.wo || 'Winterberg';
  const umkreis = params.umkreis !== undefined ? params.umkreis : 10;
  const was = params.was || '';
  const size = params.size || 100;
  const page = params.page || 1;

  const cacheKey = `${wo}_${umkreis}_${was}_${size}_${page}_${lang}`.toLowerCase();
  const now = Date.now();

  if (clientJobsCache[cacheKey] && (now - clientJobsCache[cacheKey].timestamp < 5 * 60 * 1000)) {
    return {
      jobs: clientJobsCache[cacheKey].data,
      total: clientJobsCache[cacheKey].total
    };
  }

  try {
    const query = new URLSearchParams({
      wo,
      umkreis: String(umkreis),
      size: String(size),
      page: String(page)
    });
    if (was.trim()) {
      query.set('was', was.trim());
    }

    const res = await fetch(`/api/jobs?${query.toString()}`);
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    const data = await res.json();
    const rawList = Array.isArray(data.jobs) ? data.jobs : [];
    
    const mapped: JobListing[] = rawList.map((raw: any) => 
      normalizeArbeitsagenturJob(raw, businesses, lang)
    );

    clientJobsCache[cacheKey] = {
      data: mapped,
      total: data.total || mapped.length,
      timestamp: now
    };

    return {
      jobs: mapped,
      total: data.total || mapped.length
    };
  } catch (err) {
    console.warn('Could not fetch jobs from /api/jobs:', err);
    return { jobs: [], total: 0 };
  }
}
