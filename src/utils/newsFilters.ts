import { NewsArticle } from '../types';

export interface NewsCategoryConfig {
  id: string;
  nameDe: string;
  nameNl: string;
  badgeClass: string;
}

export const NEWS_CATEGORIES: NewsCategoryConfig[] = [
  { 
    id: 'all', 
    nameDe: 'Alle', 
    nameNl: 'Alles',
    badgeClass: 'bg-[#0F4C2E] text-white border-transparent'
  },
  { 
    id: 'buergerinfo', 
    nameDe: 'Stadt & Bürger', 
    nameNl: 'Stad & Inwoners',
    badgeClass: 'bg-blue-50 text-blue-900 border-blue-200/80 hover:bg-blue-100/70'
  },
  { 
    id: 'gastronomie', 
    nameDe: 'Gastronomie & Genuss', 
    nameNl: 'Horeca & Culinair',
    badgeClass: 'bg-amber-50 text-amber-900 border-amber-200/80 hover:bg-amber-100/70'
  },
  { 
    id: 'events', 
    nameDe: 'Events & Kultur', 
    nameNl: 'Evenementen & Cultuur',
    badgeClass: 'bg-rose-50 text-rose-900 border-rose-200/80 hover:bg-rose-100/70'
  },
  { 
    id: 'freizeit', 
    nameDe: 'Sport & Freizeit', 
    nameNl: 'Sport & Vrije tijd',
    badgeClass: 'bg-sky-50 text-sky-900 border-sky-200/80 hover:bg-sky-100/70'
  },
  { 
    id: 'wirtschaft', 
    nameDe: 'Wirtschaft & Handel', 
    nameNl: 'Economie & Handel',
    badgeClass: 'bg-emerald-50 text-emerald-900 border-emerald-200/80 hover:bg-emerald-100/70'
  },
  { 
    id: 'gesundheit', 
    nameDe: 'Gesundheit & Leben', 
    nameNl: 'Gezondheid & Leven',
    badgeClass: 'bg-teal-50 text-teal-900 border-teal-200/80 hover:bg-teal-100/70'
  },
];

export function normalizeNewsCategory(rawCat?: string, article?: Partial<NewsArticle>): string {
  if (rawCat) {
    const c = rawCat.toLowerCase().trim();
    if (c === 'buergerinfo' || c === 'buerger' || c === 'einwohner' || c === 'stadt' || c === 'kommunales' || c.includes('bürger') || c.includes('buerger') || c.includes('einwohner') || c.includes('rathaus') || c.includes('stadt') || c.includes('inwoner')) return 'buergerinfo';
    if (c === 'gastronomie' || c.includes('gastro') || c.includes('essen') || c.includes('horeca')) return 'gastronomie';
    if (c === 'events' || c.includes('event') || c.includes('kultur') || c.includes('party')) return 'events';
    if (c === 'freizeit' || c.includes('sport') || c.includes('ski') || c.includes('wander')) return 'freizeit';
    if (c === 'wirtschaft' || c.includes('wirtsch') || c.includes('handel') || c.includes('business')) return 'wirtschaft';
    if (c === 'gesundheit' || c.includes('gesund') || c.includes('arzt') || c.includes('praxis')) return 'gesundheit';
  }
  if (article) {
    const text = `${article.title || ''} ${article.businessName || ''} ${article.content || ''}`.toLowerCase();
    if (text.includes('sondermüll') || text.includes('schadstoff') || text.includes('müll') || text.includes('abfall') || text.includes('bürgerservice') || text.includes('einwohner') || text.includes('rathaus')) {
      return 'buergerinfo';
    }
    if (text.includes('bar') || text.includes('döner') || text.includes('pizz') || text.includes('restaur') || text.includes('cocktail') || text.includes('jause') || text.includes('kebab')) {
      return 'gastronomie';
    }
    if (text.includes('halloween') || text.includes('winterdorf') || text.includes('kino') || text.includes('film') || text.includes('konzert') || text.includes('gospel') || text.includes('party')) {
      return 'events';
    }
    if (text.includes('ski') || text.includes('lift') || text.includes('wander') || text.includes('rad') || text.includes('rundfahrt')) {
      return 'freizeit';
    }
    if (text.includes('arzt') || text.includes('praxis') || text.includes('therap') || text.includes('gesund') || text.includes('psych')) {
      return 'gesundheit';
    }
    if (text.includes('ladenlokal') || text.includes('onlineshop') || text.includes('übernachtung') || text.includes('förderprogramm') || text.includes('wärmepumpen')) {
      return 'wirtschaft';
    }
  }
  return 'wirtschaft';
}

export function getNewsCategoryLabel(catId: string, lang: 'de' | 'nl'): string {
  const normalized = normalizeNewsCategory(catId);
  const found = NEWS_CATEGORIES.find(c => c.id === normalized);
  if (!found) return catId;
  return lang === 'nl' ? found.nameNl : found.nameDe;
}

export function getNewsCategoryBadgeClass(catId: string): string {
  const normalized = normalizeNewsCategory(catId);
  const found = NEWS_CATEGORIES.find(c => c.id === normalized);
  return found?.badgeClass || 'bg-gray-50 text-gray-800 border-gray-200';
}
