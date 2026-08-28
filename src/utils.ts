
import { OpeningHours } from './types';

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
