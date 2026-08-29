import fs from 'fs';
import path from 'path';
import { businesses, categories } from '../src/data';
import {
  CATEGORY_SLUGS,
  SUBCATEGORY_SLUGS,
  STATIC_PAGE_SLUGS,
  getCategorySlug,
  getSubcategorySlug,
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

// 2. All businesses
entries.push({
  locDe: `${baseUrl}/${STATIC_PAGE_SLUGS.all.de}`,
  locNl: `${baseUrl}/nl/${STATIC_PAGE_SLUGS.all.nl}`,
  changefreq: 'daily',
  priority: '0.9',
});

// 3. Static Pages
const staticPages = ['jobs', 'news', 'faq', 'submit', 'pricing', 'impressum', 'datenschutz', 'agb'] as const;
staticPages.forEach(p => {
  entries.push({
    locDe: `${baseUrl}/${STATIC_PAGE_SLUGS[p].de}`,
    locNl: `${baseUrl}/nl/${STATIC_PAGE_SLUGS[p].nl}`,
    changefreq: p === 'news' || p === 'jobs' ? 'daily' : 'monthly',
    priority: p === 'jobs' || p === 'news' || p === 'submit' ? '0.8' : '0.5',
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
  const bSlug = encodeURIComponent(b.name.replace(/\s+/g, '-').toLowerCase());
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
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries.map(entry => `  <url>
    <loc>${escapeXml(entry.locDe)}</loc>
    <xhtml:link rel="alternate" hreflang="de" href="${escapeXml(entry.locDe)}" />
    <xhtml:link rel="alternate" hreflang="nl" href="${escapeXml(entry.locNl)}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(entry.locDe)}" />
    <lastmod>${lastmod}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>
  <url>
    <loc>${escapeXml(entry.locNl)}</loc>
    <xhtml:link rel="alternate" hreflang="de" href="${escapeXml(entry.locDe)}" />
    <xhtml:link rel="alternate" hreflang="nl" href="${escapeXml(entry.locNl)}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(entry.locDe)}" />
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
