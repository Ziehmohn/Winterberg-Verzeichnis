const fs = require('fs');
let app = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Add H1 in App.tsx
const searchBarEnd = `                  />\n                </div>`;
const h1Html = `\n                <h1 className="text-3xl md:text-4xl font-display font-black tracking-tight mt-8 mb-6 text-black">\n                  {activeCategory === 'Alle' \n                    ? (activeLocation === 'Alle' ? 'Unternehmen & Dienstleister in Winterberg' : \`Unternehmen & Dienstleister in \${t(activeLocation)}\`)\n                    : \`\${t(activeCategory)} in \${activeLocation === 'Alle' ? 'Winterberg' : t(activeLocation)}\`\n                  }\n                </h1>\n`;
if (!app.includes('Unternehmen & Dienstleister')) {
    app = app.replace(searchBarEnd, searchBarEnd + h1Html);
}

// 2. Add SEO text for Kleidung
const marketingEndIdx = app.indexOf("})()}");
// wait, there are many })()}, let's find the specific one for Marketingdienstleistungen
const mkgText = "activeCategory === 'Marketingdienstleistungen'";
const mkgIdx = app.indexOf(mkgText);
if (mkgIdx !== -1 && !app.includes("activeCategory === 'Kleidung'")) {
    const endMkg = app.indexOf("})()}", mkgIdx) + 5;
    
    const kleidungSeo = `\n              {activeCategory === 'Kleidung' && (() => {\n                const kleidung = businesses.filter(b => b.category === 'Kleidung' || b.subcategory === 'Kleidung');\n                const byDistrict = kleidung.reduce((acc, bus) => {\n                  const dist = bus.district || 'Winterberg';\n                  acc[dist] = (acc[dist] || 0) + 1;\n                  return acc;\n                }, {} as Record<string, number>);\n                \n                const entries = Object.entries(byDistrict).sort((a, b) => (b[1] as number) - (a[1] as number));\n                const parts = entries.map(([dist, count]) => \`\${count} in \${dist}\`);\n                \n                let distributionText = '';\n                if (parts.length > 1) {\n                  const last = parts.pop();\n                  distributionText = \`Davon befinden sich \${parts.join(', ')} und \${last}.\`;\n                } else if (parts.length === 1) {\n                  distributionText = \`Davon befinden sich alle \${parts[0]}.\`;\n                }\n                return (\n                  <div className="mt-12 p-6 bg-black/5 rounded-xl text-sm leading-relaxed text-black/80">\n                    <h3 className="font-bold text-lg mb-3">Modegeschäfte und Kleidung in Winterberg</h3>\n                    <p className="mb-4 font-medium">\n                      Aktuell gibt es im Stadtgebiet {kleidung.length} {kleidung.length === 1 ? 'Geschäft' : 'Geschäfte'} für Bekleidung. {distributionText}\n                    </p>\n                    <p className="mb-2">\n                      Der Einzelhandel in Winterberg bietet eine vielfältige Auswahl an Mode, Bekleidung und Accessoires für Damen, Herren und Kinder. Von Sport- und Outdoorbekleidung, die perfekt zur Region passt, bis hin zu moderner Alltagsmode und schicken Boutiquen finden Sie hier alles, was Sie brauchen.\n                    </p>\n                    <p>\n                      Besuchen Sie die lokalen Modegeschäfte und lassen Sie sich persönlich beraten.\n                    </p>\n                  </div>\n                );\n              })()}`;
    
    app = app.substring(0, endMkg) + kleidungSeo + app.substring(endMkg);
}

fs.writeFileSync('src/App.tsx', app);

// 3. Fix H1 in JobsBoard
let jobs = fs.readFileSync('src/components/JobsBoard.tsx', 'utf8');
jobs = jobs.replace('<h2 className="text-3xl', '<h1 className="text-3xl');
jobs = jobs.replace('</h2', '</h1');
fs.writeFileSync('src/components/JobsBoard.tsx', jobs);

