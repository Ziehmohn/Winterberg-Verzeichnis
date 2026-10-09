import fs from 'fs';
import path from 'path';
import { businesses, categories } from '../src/data';
import { initialNews } from '../src/dataNews';
import {
  CATEGORY_SLUGS,
  SUBCATEGORY_SLUGS,
  STATIC_PAGE_SLUGS,
  getCategorySlug,
  getSubcategorySlug,
  slugify,
  isBusinessDeactivated
} from '../src/utils/routes';

const baseUrl = 'https://www.winterberg-verzeichnis.de';

interface SitemapEntry {
  locDe: string;
  locNl: string;
  changefreq: string;
  priority: string;
}

const entries: SitemapEntry[] = [];

// 1. Homepage
entries.push({
  locDe: `${baseUrl}`,
  locNl: `${baseUrl}/nl`,
  changefreq: 'daily',
  priority: '1.0',
});

// Add News (local + Firestore, same set as prerender)
const newsBySlug = new Map<string, any>();
initialNews.forEach(n => { if (n.slug) newsBySlug.set(n.slug, n); });
try {
  const { initializeApp } = await import('firebase/app');
  const { getFirestore, collection, getDocs } = await import('firebase/firestore');
  const fbApp = initializeApp({
    apiKey: 'AIzaSyCU_-ygCWdyCrGvoNXeyIjmt9YnbZgp0Dk',
    authDomain: 'gen-lang-client-0671429103.firebaseapp.com',
    projectId: 'gen-lang-client-0671429103',
    storageBucket: 'gen-lang-client-0671429103.firebasestorage.app',
    messagingSenderId: '363603639368',
    appId: '1:363603639368:web:665f56c570afba7869ac7d'
  }, 'sitemap-news');
  const fbDb = getFirestore(fbApp, 'ai-studio-winterberguntern-dcab9b4d-c8de-4204-84d9-91f84061f319');
  const snap = await Promise.race([
    getDocs(collection(fbDb, 'news')),
    new Promise<never>((_, rej) => setTimeout(() => rej(new Error('Firestore timeout')), 15000))
  ]);
  snap.docs.forEach(d => {
    const data: any = d.data();
    if (data.slug && !newsBySlug.has(data.slug)) newsBySlug.set(data.slug, data);
  });
} catch (e) {
  console.warn('Could not fetch Firestore news for sitemap, using local news only:', e);
}
Array.from(newsBySlug.values()).filter(n => n.status !== 'pending' && n.status !== 'rejected').forEach(n => {
  entries.push({
    locDe: `${baseUrl}/news/${n.slug}`,
    locNl: `${baseUrl}/nl/nieuws/${n.slug_nl || n.slug}`,
    changefreq: 'monthly',
    priority: '0.8',
  });
});

// 2. All businesses
entries.push({
  locDe: `${baseUrl}/${STATIC_PAGE_SLUGS.all.de}`,
  locNl: `${baseUrl}/nl/${STATIC_PAGE_SLUGS.all.nl}`,
  changefreq: 'daily',
  priority: '0.9',
});

// 3. Static Pages
const staticPages = [
  'jobs', 
  'news', 
  'faq', 
  'submit', 
  'pricing', 
  'fuelPrices', 
  'emergency', 
  'impressum', 
  'datenschutz', 
  'agb', 
  'grounding', 
  'heimatkarte',
  'sundayOpen',
  'skiReport',
  'webcams',
  'wasteCalendar',
  'chargingStations',
  'shoppingTheme',
  'shoppenWinterberg'
] as const;
staticPages.forEach(p => {
  entries.push({
    locDe: `${baseUrl}/${STATIC_PAGE_SLUGS[p].de}`,
    locNl: `${baseUrl}/nl/${STATIC_PAGE_SLUGS[p].nl}`,
    changefreq: p === 'news' || p === 'jobs' ? 'daily' : 'monthly',
    priority: p === 'jobs' || p === 'news' || p === 'submit' || p === 'grounding' ? '0.8' : '0.5',
  });
});

// 3b. Best-Of Rankings (Top 10)
entries.push({
  locDe: `${baseUrl}/${STATIC_PAGE_SLUGS.bestOf.de}`,
  locNl: `${baseUrl}/nl/${STATIC_PAGE_SLUGS.bestOf.nl}`,
  changefreq: 'weekly',
  priority: '0.9',
});

categories.forEach(c => {
  const catDe = getCategorySlug(c.name, 'de');
  const catNl = getCategorySlug(c.name, 'nl');

  entries.push({
    locDe: `${baseUrl}/${STATIC_PAGE_SLUGS.bestOf.de}/${catDe}`,
    locNl: `${baseUrl}/nl/${STATIC_PAGE_SLUGS.bestOf.nl}/${catNl}`,
    changefreq: 'weekly',
    priority: '0.9',
  });

  c.subcategories.forEach(sub => {
    const subDe = getSubcategorySlug(sub, 'de');
    const subNl = getSubcategorySlug(sub, 'nl');

    entries.push({
      locDe: `${baseUrl}/${STATIC_PAGE_SLUGS.bestOf.de}/${catDe}/${subDe}`,
      locNl: `${baseUrl}/nl/${STATIC_PAGE_SLUGS.bestOf.nl}/${catNl}/${subNl}`,
      changefreq: 'weekly',
      priority: '0.85',
    });
  });
});

// 4. Categories & Subcategories
categories.forEach(c => {
  const catDe = getCategorySlug(c.name, 'de');
  const catNl = getCategorySlug(c.name, 'nl');

  entries.push({
    locDe: `${baseUrl}/${catDe}`,
    locNl: `${baseUrl}/nl/${catNl}`,
    changefreq: 'weekly',
    priority: '0.8',
  });

  c.subcategories.forEach(sub => {
    const subDe = getSubcategorySlug(sub, 'de');
    const subNl = getSubcategorySlug(sub, 'nl');

    entries.push({
      locDe: `${baseUrl}/${catDe}/${subDe}`,
      locNl: `${baseUrl}/nl/${catNl}/${subNl}`,
      changefreq: 'weekly',
      priority: '0.8',
    });
  });
});

// 5. Businesses (Detail Pages)
businesses.forEach((b: any) => {
  if (isBusinessDeactivated(b)) return;
  const bSlug = slugify(b.name);
  const catDe = getCategorySlug(b.category, 'de');
  const catNl = getCategorySlug(b.category, 'nl');
  const subDe = b.subcategory ? getSubcategorySlug(b.subcategory, 'de') : '';
  const subNl = b.subcategory ? getSubcategorySlug(b.subcategory, 'nl') : '';

  const pathDe = subDe ? `${catDe}/${subDe}/${bSlug}` : `${catDe}/${bSlug}`;
  const pathNl = subNl ? `${catNl}/${subNl}/${bSlug}` : `${catNl}/${bSlug}`;

  entries.push({
    locDe: `${baseUrl}/${pathDe}`,
    locNl: `${baseUrl}/nl/${pathNl}`,
    changefreq: 'weekly',
    priority: b.isPremium ? '0.9' : '0.7',
  });
});

const escapeXml = (unsafe: string) => {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
};

const lastmod = new Date().toISOString().split('T')[0];

const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.map(entry => `  <url>
    <loc>${escapeXml(entry.locDe)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>
  <url>
    <loc>${escapeXml(entry.locNl)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

const publicDir = path.resolve(process.cwd(), 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemapContent);
console.log(`Sitemap successfully generated with ${entries.length * 2} URLs at public/sitemap.xml`);
process.exit(0);
