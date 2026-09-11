import { useState, useEffect } from 'react';

const FAVORITES_STORAGE_KEY = 'wb_user_favorites_v1';
const FAVORITES_EVENT = 'wb_favorites_changed';

/**
 * Returns array of saved favorite business IDs from localStorage
 */
export function getFavoriteIds(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
}

/**
 * Checks if a specific business is saved as favorite
 */
export function isFavorite(businessId: string): boolean {
  if (!businessId) return false;
  const ids = getFavoriteIds();
  return ids.includes(businessId);
}

/**
 * Toggles a business in the favorites list.
 * Returns true if added, false if removed.
 */
export function toggleFavorite(businessId: string): boolean {
  if (typeof window === 'undefined' || !businessId) return false;
  try {
    const current = getFavoriteIds();
    let updated: string[];
    let isAdded = false;

    if (current.includes(businessId)) {
      updated = current.filter(id => id !== businessId);
      isAdded = false;
    } else {
      updated = [...current, businessId];
      isAdded = true;
    }

    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent(FAVORITES_EVENT, { detail: { updated, businessId, isAdded } }));
    return isAdded;
  } catch (e) {
    return false;
  }
}

/**
 * React hook to reactively track favorites across the entire app
 */
export function useFavorites() {
  const [favoriteIds, setFavoriteIds] = useState<string[]>(() => getFavoriteIds());

  useEffect(() => {
    const handleUpdate = () => {
      setFavoriteIds(getFavoriteIds());
    };

    window.addEventListener(FAVORITES_EVENT, handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener(FAVORITES_EVENT, handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  return {
    favoriteIds,
    count: favoriteIds.length,
    isFavorite: (id: string) => favoriteIds.includes(id),
    toggleFavorite
  };
}
