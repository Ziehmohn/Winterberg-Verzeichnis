/**
 * Client-Side Caching Utility for Firestore
 * Prevents exhausting Firestore free-tier quotas (50k reads/day)
 * by persisting fetched documents in localStorage with configurable TTLs.
 */

export interface CacheEnvelope<T> {
  data: T;
  timestamp: number;
}

export const CACHE_KEYS = {
  BUSINESSES: 'wb_cache_businesses_v1',
  NEWS: 'wb_cache_news_v1',
  PRICING: 'wb_cache_pricing_v1',
  ADS: 'wb_cache_ads_v1',
  SCRIPTS: 'wb_cache_scripts_v1',
  REDIRECTS: 'wb_cache_redirects_v1'
} as const;

export const CACHE_TTLS = {
  BUSINESSES: 60 * 60 * 1000,    // 60 minutes
  NEWS: 30 * 60 * 1000,          // 30 minutes
  PRICING: 2 * 60 * 60 * 1000,   // 2 hours
  ADS: 60 * 60 * 1000,           // 60 minutes
  SCRIPTS: 24 * 60 * 60 * 1000,  // 24 hours
  REDIRECTS: 12 * 60 * 60 * 1000 // 12 hours
} as const;

/**
 * Returns cached item if present and not expired.
 * If ignoreExpiry is true, returns cached data even if expired (e.g. for offline / quota fallback).
 */
export function getCachedItem<T>(key: string, maxAgeMs?: number, ignoreExpiry = false): T | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const envelope: CacheEnvelope<T> = JSON.parse(raw);
    if (!envelope || typeof envelope.timestamp !== 'number') return null;
    
    const isExpired = maxAgeMs !== undefined && (Date.now() - envelope.timestamp > maxAgeMs);
    if (isExpired && !ignoreExpiry) {
      return null;
    }
    return envelope.data;
  } catch (e) {
    return null;
  }
}

/**
 * Sets a cached item with current timestamp in localStorage.
 */
export function setCachedItem<T>(key: string, data: T): void {
  if (typeof window === 'undefined') return;
  try {
    const envelope: CacheEnvelope<T> = {
      data,
      timestamp: Date.now()
    };
    localStorage.setItem(key, JSON.stringify(envelope));
  } catch (e) {
    console.warn(`[dbCache] Failed to set cache for ${key}:`, e);
  }
}

/**
 * Invalidates a specific cache entry (e.g. on admin update).
 */
export function invalidateCache(key: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(key);
  } catch (e) {}
}
