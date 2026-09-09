/**
 * Geotargeting & Language Detection Service
 * Detects visitor language preferences based on GeoIP, browser locale, and user overrides.
 */

export type SupportedLang = 'de' | 'nl';

const PREFERRED_LANG_KEY = 'user_preferred_lang';
const GEO_COUNTRY_SESSION_KEY = 'user_geo_country';
const DETECTED_LANG_SESSION_KEY = 'detected_geo_lang';

/**
 * Detects if the current user agent is a search engine crawler or social media bot.
 * Such crawlers should never be automatically redirected to avoid SEO penalties or index issues.
 */
export function isSearchEngineBot(): boolean {
  if (typeof window === 'undefined' || !navigator?.userAgent) return false;
  const ua = navigator.userAgent;
  const botPattern = /bot|googlebot|crawler|spider|robot|crawling|bingbot|yandex|baiduspider|duckduckbot|slurp|facebookexternalhit|twitterbot|linkedinbot|embedly|quora link preview|showyoubot|outbrain|pinterest|slackbot|vkShare|W3C_Validator/i;
  return botPattern.test(ua);
}

/**
 * Returns the manually selected language stored in localStorage, if any.
 */
export function getUserPreferredLanguage(): SupportedLang | null {
  if (typeof window === 'undefined') return null;
  try {
    const val = localStorage.getItem(PREFERRED_LANG_KEY);
    if (val === 'de' || val === 'nl') return val;
  } catch {
    // Ignore storage errors in private browsing
  }
  return null;
}

/**
 * Saves the user's manual language selection.
 * Once set, this choice strictly overrides any automatic GeoIP or browser detections.
 */
export function setUserPreferredLanguage(lang: SupportedLang): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(PREFERRED_LANG_KEY, lang);
  } catch {
    // Ignore storage errors in private browsing
  }
}

/**
 * Fast synchronous check of browser language settings (0 ms latency).
 */
export function detectBrowserLanguage(): SupportedLang | null {
  if (typeof window === 'undefined' || !navigator) return null;
  
  const languages = navigator.languages || [navigator.language];
  for (const l of languages) {
    if (!l) continue;
    const lower = l.toLowerCase();
    if (lower.startsWith('nl')) return 'nl';
    if (lower.startsWith('de')) return 'de';
  }
  return null;
}

/**
 * Fetches the user's country code (2-letter ISO, e.g. 'NL', 'BE', 'DE')
 * Checks session cache first, then internal /api/geo, then external fallback.
 */
export async function fetchGeoCountry(): Promise<string | null> {
  if (typeof window === 'undefined') return null;

  try {
    const cached = sessionStorage.getItem(GEO_COUNTRY_SESSION_KEY);
    if (cached) return cached;
  } catch {
    // Ignore session storage errors
  }

  // 1. Try local backend endpoint (reads CDN/Proxy headers like cf-ipcountry)
  try {
    const res = await fetch('/api/geo', {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(2000),
    });
    if (res.ok) {
      const data = await res.json();
      if (data?.country && typeof data.country === 'string') {
        const c = data.country.toUpperCase();
        try { sessionStorage.setItem(GEO_COUNTRY_SESSION_KEY, c); } catch {}
        return c;
      }
    }
  } catch {
    // Continue to fallback
  }

  // 2. Client-side fallback to free, reliable GeoIP API
  try {
    const res = await fetch('https://freeipapi.com/api/json', {
      signal: AbortSignal.timeout(2500),
    });
    if (res.ok) {
      const data = await res.json();
      if (data?.countryCode && typeof data.countryCode === 'string') {
        const c = data.countryCode.toUpperCase();
        try { sessionStorage.setItem(GEO_COUNTRY_SESSION_KEY, c); } catch {}
        return c;
      }
    }
  } catch {
    // Ignore external lookup failure
  }

  return null;
}

/**
 * Master detection logic: determines if a visitor should be on Dutch ('nl') or German ('de').
 * Returns null if no redirection should take place (e.g. for bots or neutral visitors).
 */
export async function detectTargetLanguage(): Promise<SupportedLang | null> {
  // 1. Never redirect search engine bots (SEO protection)
  if (isSearchEngineBot()) return null;

  // 2. If the user previously made an explicit manual choice, always honor it
  const preferred = getUserPreferredLanguage();
  if (preferred) return preferred;

  // 3. Check session cache to avoid repeated checks
  try {
    const sessionLang = sessionStorage.getItem(DETECTED_LANG_SESSION_KEY);
    if (sessionLang === 'de' || sessionLang === 'nl') {
      return sessionLang;
    }
  } catch {}

  // 4. Fast check: If browser language is Dutch (e.g. Dutch user in Netherlands/Belgium)
  const browserLang = detectBrowserLanguage();
  if (browserLang === 'nl') {
    try { sessionStorage.setItem(DETECTED_LANG_SESSION_KEY, 'nl'); } catch {}
    return 'nl';
  }

  // 5. Geolocation check (detects users in Netherlands or Belgium even with English browsers)
  try {
    const country = await fetchGeoCountry();
    if (country) {
      // Netherlands or Belgium
      if (country === 'NL' || country === 'BE') {
        try { sessionStorage.setItem(DETECTED_LANG_SESSION_KEY, 'nl'); } catch {}
        return 'nl';
      }
      // Germany, Austria, Switzerland, Liechtenstein
      if (['DE', 'AT', 'CH', 'LI'].includes(country)) {
        try { sessionStorage.setItem(DETECTED_LANG_SESSION_KEY, 'de'); } catch {}
        return 'de';
      }
    }
  } catch {}

  // 6. If browser language is German
  if (browserLang === 'de') {
    try { sessionStorage.setItem(DETECTED_LANG_SESSION_KEY, 'de'); } catch {}
    return 'de';
  }

  return null;
}
