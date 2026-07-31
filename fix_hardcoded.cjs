const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf8');

// Replace standard hardcoded texts with translation keys
content = content.replace(/<h3 className="hidden md:block font-display font-bold text-lg mb-4">Branchen<\/h3>/g, '<h3 className="hidden md:block font-display font-bold text-lg mb-4">{t("categoriesTitle")}</h3>');
content = content.replace(/<h2 className="text-xl font-bold shrink-0">Ergebnisse \(\{filteredBusinesses\.length\}\)<\/h2>/g, '<h2 className="text-xl font-bold shrink-0">{t("results")} ({filteredBusinesses.length})</h2>');
content = content.replace(/>Lädt\.\.\.<\/div>/g, '>{t("loading")}</div>');
content = content.replace(/<span className="hidden xs:inline">Premium<\/span>/g, '<span className="hidden xs:inline">{t("premium")}</span>');
content = content.replace(/<p className="text-lg font-medium">Keine Unternehmen gefunden\.<\/p>/g, '<p className="text-lg font-medium">{t("noBusinessesFound")}</p>');
content = content.replace(/<p className="text-sm mt-1">Bitte passen Sie Ihre Suchkriterien an\.<\/p>/g, '<p className="text-sm mt-1">{t("adjustSearchCriteria")}</p>');

fs.writeFileSync('src/App.tsx', content);

// Add missing translations to i18n
const extraDe = {
  categoriesTitle: 'Branchen',
  results: 'Ergebnisse',
  loading: 'Lädt...',
  premium: 'Premium',
  noBusinessesFound: 'Keine Unternehmen gefunden.',
  adjustSearchCriteria: 'Bitte passen Sie Ihre Suchkriterien an.'
};

const extraNl = {
  categoriesTitle: 'Branches',
  results: 'Resultaten',
  loading: 'Laden...',
  premium: 'Premium',
  noBusinessesFound: 'Geen bedrijven gevonden.',
  adjustSearchCriteria: 'Pas uw zoekcriteria aan.'
};

let i18n = fs.readFileSync('src/i18n.tsx', 'utf8');

let deString = "";
for (const [k, v] of Object.entries(extraDe)) {
  deString += `    "${k}": "${v}",\n`;
}

let nlString = "";
for (const [k, v] of Object.entries(extraNl)) {
  nlString += `    "${k}": "${v}",\n`;
}

i18n = i18n.replace(
  /"allRightsReserved": "Alle Rechte vorbehalten",\n/g,
  `"allRightsReserved": "Alle Rechte vorbehalten",\n${deString}`
);

i18n = i18n.replace(
  /"allRightsReserved": "Alle rechten voorbehouden",\n/g,
  `"allRightsReserved": "Alle rechten voorbehouden",\n${nlString}`
);

fs.writeFileSync('src/i18n.tsx', i18n);

