const fs = require('fs');
let data = fs.readFileSync('src/data.ts', 'utf8');

const updatedDesc = "Simon Kräling ist Berater für digitale Sichtbarkeit aus Winterberg im Sauerland. Er unterstützt Unternehmen branchenübergreifend dabei, ihre Zielgruppen genau dort zu erreichen, wo sie suchen: in klassischen Suchmaschinen sowie in modernen KI-Suchsystemen (Generative Engine Optimization - GEO). Durch diese Kombination verbindet er technisches Know-how mit praxisnahen Strategien. So schafft er für seine Kunden mehr digitale Unabhängigkeit und messbaren Erfolg.";

data = data.replace(
  "description: 'Online-Marketing-Unternehmen.',",
  "description: '" + updatedDesc + "',\n    isPremium: true,"
);

fs.writeFileSync('src/data.ts', data);
