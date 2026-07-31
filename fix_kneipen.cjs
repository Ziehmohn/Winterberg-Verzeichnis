const fs = require('fs');

// Fix data.ts
let data = fs.readFileSync('src/data.ts', 'utf8');

// Remove K-Office (id: 141)
const kOfficeStr = `  {
    id: '141',
    name: 'K-Office',
    category: 'Einzelhandel',
    subcategory: 'Bürobedarf',
    description: 'Verkauf von Büroeinrichtungen. Inhaber: Burkhard Kräling.',
    address: 'Winterberg',
    district: 'Winterberg',
    imageFallback: 'KO',
  }`;
if (data.includes(kOfficeStr)) {
    data = data.replace(kOfficeStr + ',', '');
    data = data.replace(kOfficeStr, '');
} else {
    // If exact match fails, fallback
    const id141 = "id: '141'";
    const s1 = data.indexOf(id141);
    if (s1 !== -1) {
       const start = data.lastIndexOf("{", s1);
       const end = data.indexOf("}", s1) + 1;
       const toRemove = data.substring(start, end);
       data = data.replace(toRemove + ',', '');
       data = data.replace(toRemove, '');
    }
}

// Add Kneipen und Bars to Gastronomie categories
const gastroCat = "{ name: 'Gastronomie', subcategories: ['Restaurant'] },";
data = data.replace(gastroCat, "{ name: 'Gastronomie', subcategories: ['Restaurant', 'Kneipen und Bars'] },");

// Add new businesses
const newBusinesses = `
  {
    id: '142',
    name: 'Hessenkeller Winterberg',
    category: 'Gastronomie',
    subcategory: 'Kneipen und Bars',
    description: 'Kneipe in Winterberg. Beliebter Treffpunkt mit Live-Veranstaltungen, Tanzen und Quizabenden.',
    address: 'Am Waltenberg 1, 59955 Winterberg',
    district: 'Winterberg',
    phone: '02981 930111',
    website: 'https://hotel-hessenhof.de',
    imageFallback: 'HK',
    rating: 4.1,
    reviewCount: 129
  },
  {
    id: '143',
    name: 'Lingenauber',
    category: 'Gastronomie',
    subcategory: 'Kneipen und Bars',
    description: 'Gastrokneipe in Siedlinghausen. Bietet Sitzplätze im Freien und Hunde sind erlaubt.',
    address: 'Hochsauerlandstraße 15, 59955 Winterberg',
    district: 'Siedlinghausen',
    phone: '02983 8231',
    website: 'https://lingenaubers.de',
    imageFallback: 'LI',
    rating: 4.6,
    reviewCount: 95
  },
  {
    id: '144',
    name: 'Blackwater Irish Pub Winterberg',
    category: 'Gastronomie',
    subcategory: 'Kneipen und Bars',
    description: 'Beliebte Kneipe mit traditioneller Einrichtung, irischen Bieren vom Fass und Sport auf Großbildleinwand.',
    address: 'Nuhnestraße 2, 59955 Winterberg',
    district: 'Winterberg',
    phone: '02981 899539',
    website: 'https://blackwater-irishpub.de',
    imageFallback: 'BW',
    rating: 4.5,
    reviewCount: 3523
  },
  {
    id: '145',
    name: 'Bu\\'ket Bar Winterberg',
    category: 'Gastronomie',
    subcategory: 'Kneipen und Bars',
    description: 'Cocktailbar in Winterberg. Hunde erlaubt.',
    address: 'Poststraße 1, 59955 Winterberg',
    district: 'Winterberg',
    phone: '02981 8968670',
    imageFallback: 'BK',
    rating: 5.0,
    reviewCount: 53
  },
`;

const insertPoint = 'export const businesses: Business[] = [';
data = data.replace(insertPoint, insertPoint + newBusinesses);

fs.writeFileSync('src/data.ts', data);

// Fix i18n.tsx
let i18n = fs.readFileSync('src/i18n.tsx', 'utf8');
const deInsert = '"Restaurant": "Restaurant",';
i18n = i18n.replace(deInsert, deInsert + '\n    "Kneipen und Bars": "Kneipen und Bars",');
const nlInsert = '"Restaurant": "Restaurant",';
i18n = i18n.replace(nlInsert, nlInsert + '\n    "Kneipen und Bars": "Cafés en Bars",');
fs.writeFileSync('src/i18n.tsx', i18n);

// Fix App.tsx - Add SEO text for Kneipen und Bars
let app = fs.readFileSync('src/App.tsx', 'utf8');

const tStr = "activeCategory === 'Restaurant'";
const tIdx = app.indexOf(tStr);
if (tIdx !== -1) {
    const endT = app.indexOf("})()}", tIdx) + 5;
    
    const kneipenSeo = `
              {activeCategory === 'Kneipen und Bars' && (() => {
                const kneipen = businesses.filter(b => b.category === 'Kneipen und Bars' || b.subcategory === 'Kneipen und Bars');
                const byDistrict = kneipen.reduce((acc, bus) => {
                  const dist = bus.district || 'Winterberg';
                  acc[dist] = (acc[dist] || 0) + 1;
                  return acc;
                }, {} as Record<string, number>);
                
                const entries = Object.entries(byDistrict).sort((a, b) => (b[1] as number) - (a[1] as number));
                const parts = entries.map(([dist, count]) => \`\${count} in \${dist}\`);
                
                let distributionText = '';
                if (parts.length > 1) {
                  const last = parts.pop();
                  distributionText = \`Davon befinden sich \${parts.join(', ')} und \${last}.\`;
                } else if (parts.length === 1) {
                  distributionText = \`Davon befinden sich alle \${parts[0]}.\`;
                }
                return (
                  <div className="mt-12 p-6 bg-black/5 rounded-xl text-sm leading-relaxed text-black/80">
                    <h3 className="font-bold text-lg mb-3">Kneipen und Bars in Winterberg</h3>
                    <p className="mb-4 font-medium">
                      Aktuell gibt es im Stadtgebiet {kneipen.length} {kneipen.length === 1 ? 'Kneipe/Bar' : 'Kneipen und Bars'}. {distributionText}
                    </p>
                    <p className="mb-2">
                      Das Nachtleben in Winterberg hat einiges zu bieten. Von urigen, traditionellen Kneipen über moderne Cocktailbars bis hin zum gemütlichen Irish Pub finden Sie hier die passenden Locations für einen gelungenen Abend. Viele Gastronomen bieten zudem Live-Veranstaltungen, Quizabende und Musik-Events.
                    </p>
                    <p>
                      Entdecken Sie die lokalen Bars und Kneipen für ein kühles Bier, erstklassige Cocktails und gesellige Runden.
                    </p>
                  </div>
                );
              })()}`;
    
    app = app.substring(0, endT) + kneipenSeo + app.substring(endT);
}

fs.writeFileSync('src/App.tsx', app);
