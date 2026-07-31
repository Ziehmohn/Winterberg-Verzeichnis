const fs = require('fs');

// Fix data.ts
let data = fs.readFileSync('src/data.ts', 'utf8');
data = data.replace(/'Kleidung'/g, "'Bekleidung'");
fs.writeFileSync('src/data.ts', data);

// Fix i18n.tsx
let i18n = fs.readFileSync('src/i18n.tsx', 'utf8');
i18n = i18n.replace(/"Kleidung": "Kleidung"/g, '"Bekleidung": "Bekleidung"');
i18n = i18n.replace(/"Kleidung": "Kleding"/g, '"Bekleidung": "Kleding"');
fs.writeFileSync('src/i18n.tsx', i18n);

// Fix App.tsx
let app = fs.readFileSync('src/App.tsx', 'utf8');
app = app.replace(/activeCategory === 'Kleidung'/g, "activeCategory === 'Bekleidung'");
app = app.replace(/b\.category === 'Kleidung'/g, "b.category === 'Bekleidung'");
app = app.replace(/b\.subcategory === 'Kleidung'/g, "b.subcategory === 'Bekleidung'");
app = app.replace(/Modegeschäfte und Kleidung in Winterberg/g, "Bekleidung in Winterberg");
fs.writeFileSync('src/App.tsx', app);
