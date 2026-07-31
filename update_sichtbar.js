const fs = require('fs');
let data = fs.readFileSync('src/data.ts', 'utf8');

const updatedDesc = "Simon Kräling ist Berater für digitale Sichtbarkeit aus Winterberg im Sauerland. Er unterstützt Unternehmen branchenübergreifend dabei, ihre Zielgruppen genau dort zu erreichen, wo sie suchen: in klassischen Suchmaschinen sowie in modernen KI-Suchsystemen. Durch die Kombination aus klassischer Suchmaschinenoptimierung (SEO) und Generative Engine Optimization (GEO) verbindet er technisches Know-how mit praxisnahen Strategien. So schafft er für seine Kunden mehr digitale Unabhängigkeit und messbaren Erfolg bei der Neukunden- und Mitarbeitergewinnung.";

data = data.replace(
  /name:\s*'SICHTBAR SEO - Simon Kräling',\s*category:\s*'Dienstleistungen',\s*subcategory:\s*'Marketingdienstleistungen',\s*description:\s*'Online-Marketing-Unternehmen.',/g,
  "name: 'SICHTBAR SEO - Simon Kräling',\n    category: 'Dienstleistungen',\n    subcategory: 'Marketingdienstleistungen',\n    description: '" + updatedDesc + "',\n    isPremium: true,"
);

fs.writeFileSync('src/data.ts', data);
