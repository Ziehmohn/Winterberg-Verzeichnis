
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


  // Handle formats like "08:00 - 17:00"
  const times = todayHours.split('-').map(t => t.trim());
  if (times.length === 2) {
    const [startStr, endStr] = times;
    
    const [startHour, startMin] = startStr.split(':').map(Number);
    const [endHour, endMin] = endStr.split(':').map(Number);
    
    if (!isNaN(startHour) && !isNaN(endHour)) {
      const startDateTime = new Date(now);
      startDateTime.setHours(startHour, startMin || 0, 0, 0);
      
      const endDateTime = new Date(now);
      endDateTime.setHours(endHour, endMin || 0, 0, 0);

      const isOpen = now >= startDateTime && now <= endDateTime;
      return { 
        isOpen, 
        text: isOpen ? `${'Geöffnet'} ⋅ ${'Schließt um'} ${endStr}` : `${'Geschlossen'} ⋅ ${'Öffnet um'} ${startStr}` 
      };
    }
  }

  // Fallback for unknown formats
  return { isOpen: false, text: todayHours };
}
