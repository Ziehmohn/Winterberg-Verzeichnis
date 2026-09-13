
import { OpeningHours, Business } from './types';

export function isMajorSupermarket(business?: { name?: string; category?: string; subcategory?: string } | null): boolean {
  if (!business || !business.name) return false;
  const name = business.name.toLowerCase();
  const cat = (business.category || '').toLowerCase();
  const sub = (business.subcategory || '').toLowerCase();
  
  const isSupermarketCat = cat.includes('einzelhandel') || sub.includes('supermarkt') || sub.includes('lebensmittel');
  if (!isSupermarketCat) return false;

  return (
    name.includes('edeka') ||
    name.includes('e center') ||
    name.includes('e-center') ||
    name.includes('lidl') ||
    name.includes('aldi') ||
    name.includes('rewe') ||
    name.includes('netto')
  );
}

export function canDisplayOpeningHours(business?: { isPremium?: boolean; name?: string; category?: string; subcategory?: string; openingHours?: OpeningHours } | null): boolean {
  if (!business || !business.openingHours) return false;
  // Rule: Opening hours are exclusively visible for major supermarkets (Edeka, Lidl, Aldi, Rewe, Netto) OR businesses with a Premium Account
  return Boolean(business.isPremium || isMajorSupermarket(business));
}

export function isOpenNow(openingHours: OpeningHours | undefined, t: (key: string) => string): { isOpen: boolean; text: string } {
  if (!openingHours) return { isOpen: false, text: 'Keine Angaben' };

  const now = new Date();
  
  // Array where Sunday is 0, Monday is 1, ..., Saturday is 6
  // We need to map this to our openingHours properties
  const dayNames: (keyof OpeningHours)[] = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const todayName = dayNames[now.getDay()];
  const todayHours = openingHours[todayName];

  if (!todayHours || typeof todayHours !== 'string' || todayHours.toLowerCase() === 'geschlossen') {
    return { isOpen: false, text: 'Geschlossen' };
  }


  // Handle formats like "08:00 - 12:00, 13:00 - 17:00"
  const slots = todayHours.split(',').map(s => s.trim());
  let currentlyOpen = false;
  let text = 'Geschlossen';

  for (const slot of slots) {
    const times = slot.split('-').map(t => t.trim());
    if (times.length === 2) {
      const [startStr, endStr] = times;
      const [startHour, startMin] = startStr.split(':').map(Number);
      const [endHour, endMin] = endStr.split(':').map(Number);
      
      if (!isNaN(startHour) && !isNaN(endHour)) {
        const startDateTime = new Date(now);
        startDateTime.setHours(startHour, startMin || 0, 0, 0);
        
        const endDateTime = new Date(now);
        endDateTime.setHours(endHour, endMin || 0, 0, 0);

        if (now >= startDateTime && now <= endDateTime) {
          currentlyOpen = true;
          text = `${'Geöffnet'} ⋅ ${'Schließt um'} ${endStr}`;
          break; // Stop checking if we found an open slot
        } else if (now < startDateTime) {
          // If we haven't found an open slot yet, and this slot is in the future
          // We can show when it opens next today
          if (!currentlyOpen && text === 'Geschlossen') {
            text = `${'Geschlossen'} ⋅ ${'Öffnet um'} ${startStr}`;
          }
        }
      }
    }
  }

  // If we couldn't parse anything and it's not open, fallback
  if (!currentlyOpen && text === 'Geschlossen' && slots.length === 1 && slots[0].indexOf('-') === -1) {
    return { isOpen: false, text: todayHours };
  }

  return { isOpen: currentlyOpen, text };
}

/**
 * Standardizes a business address to always guarantee that a non-Winterberg district
 * is correctly reflected as "59955 Winterberg-[Ortsteil]".
 *
 * Examples:
 * - ("Hochsauerlandstraße 15, 59955 Winterberg", "Siedlinghausen") => "Hochsauerlandstraße 15, 59955 Winterberg-Siedlinghausen"
 * - ("Poststraße 6, 59955 Winterberg", "Winterberg") => "Poststraße 6, 59955 Winterberg"
 * - ("", "Siedlinghausen") => "59955 Winterberg-Siedlinghausen"
 * - ("Hochsauerlandstraße 15", "Siedlinghausen") => "Hochsauerlandstraße 15, 59955 Winterberg-Siedlinghausen"
 */
export function formatBusinessAddress(address?: string, district?: string): string {
  const cleanAddr = address?.trim() || '';
  const cleanDist = district?.trim() || '';

  const isCoreOrEmptyDistrict = !cleanDist || cleanDist === 'Winterberg' || cleanDist === 'Winterberg (Kernstadt)';

  if (!cleanAddr) {
    if (isCoreOrEmptyDistrict) {
      return cleanDist ? '59955 Winterberg' : '';
    }
    return `59955 Winterberg-${cleanDist}`;
  }

  if (cleanAddr.includes(',')) {
    const parts = cleanAddr.split(',').map(p => p.trim()).filter(Boolean);
    const street = parts[0] || '';
    const cityPart = parts.slice(1).join(', ').trim();

    if (isCoreOrEmptyDistrict) {
      return cleanAddr;
    }

    if (cityPart.toLowerCase().includes(cleanDist.toLowerCase())) {
      return cleanAddr;
    }

    if (/59955\s+Winterberg/i.test(cityPart)) {
      const updatedCity = cityPart.replace(/59955\s+Winterberg/i, `59955 Winterberg-${cleanDist}`);
      return `${street}, ${updatedCity}`;
    }

    if (/Winterberg/i.test(cityPart)) {
      const updatedCity = cityPart.replace(/Winterberg/i, `Winterberg-${cleanDist}`);
      return `${street}, ${updatedCity}`;
    }

    return `${cleanAddr}-${cleanDist}`;
  }

  // Address has no comma
  if (/^\d{5}\s+Winterberg/i.test(cleanAddr)) {
    if (!isCoreOrEmptyDistrict && !cleanAddr.toLowerCase().includes(cleanDist.toLowerCase())) {
      return cleanAddr.replace(/59955\s+Winterberg/i, `59955 Winterberg-${cleanDist}`);
    }
    return cleanAddr;
  }

  if (/^Winterberg/i.test(cleanAddr)) {
    if (!isCoreOrEmptyDistrict && !cleanAddr.toLowerCase().includes(cleanDist.toLowerCase())) {
      return cleanAddr.replace(/Winterberg/i, `Winterberg-${cleanDist}`);
    }
    return cleanAddr;
  }

  // Street only
  const city = isCoreOrEmptyDistrict ? '59955 Winterberg' : `59955 Winterberg-${cleanDist}`;
  return `${cleanAddr}, ${city}`;
}

/**
 * Splits a formatted address into street and city parts for two-line UI display.
 */
export function parseBusinessAddress(address?: string, district?: string): { street: string; city: string; full: string } {
  const full = formatBusinessAddress(address, district);
  if (!full) return { street: '', city: '', full: '' };

  if (full.includes(',')) {
    const parts = full.split(',').map(p => p.trim()).filter(Boolean);
    const street = parts[0] || '';
    const city = parts.slice(1).join(', ').trim();
    return { street, city, full };
  }

  return { street: '', city: full, full };
}

