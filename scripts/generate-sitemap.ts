import fs from 'fs';
import path from 'path';
import { businesses, categories } from '../src/data';

const baseUrl = 'https://www.winterberg-verzeichnis.de';

let urls = [baseUrl];

categories.forEach(c => {
  urls.push(`${baseUrl}/${encodeURIComponent(c.name)}`);
  c.subcategories.forEach(sub => {
    urls.push(`${baseUrl}/${encodeURIComponent(c.name)}/${encodeURIComponent(sub)}`);
  });
});

businesses.forEach((b: any) => {
  urls.push(`${baseUrl}/${encodeURIComponent(b.category)}${b.subcategory ? `/${encodeURIComponent(b.subcategory)}` : ''}/${encodeURIComponent(b.name.replace(/\s+/g, '-').toLowerCase())}`);
});

// Add Jobs
urls.push(`${baseUrl}/jobs`);
const jobTypes = ['Vollzeit', 'Teilzeit', 'Minijob', 'Ausbildung', 'Praktikum', 'Freelance'];
jobTypes.forEach(jt => {
  urls.push(`${baseUrl}/jobs/${encodeURIComponent(jt)}`);
});

// Add News
urls.push(`${baseUrl}/news`);
urls.push(`${baseUrl}/news/freistehende-ladenlokale-winterberg`);

// Add FAQ
urls.push(`${baseUrl}/faq`);
urls.push(`${baseUrl}/faqs`);

urls = Array.from(new Set(urls));

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

const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${escapeXml(url)}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${url === baseUrl ? '1.0' : '0.8'}</priority>
  </url>`).join('\n')}
</urlset>`;

const publicDir = path.resolve(process.cwd(), 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemapContent);
console.log('Sitemap successfully generated at public/sitemap.xml');
