const fs = require('fs');
let i18n = fs.readFileSync('src/i18n.tsx', 'utf8');

// The DE section has:
// "Kneipen und Bars": "Cafés en Bars",
// "Kneipen und Bars": "Kneipen und Bars",
// We should remove both and correctly re-insert.
i18n = i18n.replace(/    "Kneipen und Bars": "Cafés en Bars",\n/g, "");
i18n = i18n.replace(/    "Kneipen und Bars": "Kneipen und Bars",\n/g, "");
i18n = i18n.replace(/    "Kneipen und Bars": "Kroegen en Bars",\n/g, "");

// We find the DE translations object and NL translations object
const deStart = i18n.indexOf('const translations = {\n  de: {');
const nlStart = i18n.indexOf('  nl: {');

const restStr = '"Restaurant": "Restaurant",\n';
const restNlStr = '"Restaurant": "Restaurant",\n'; // wait, for nl it might be the same? Let's check

i18n = i18n.substring(0, deStart) + i18n.substring(deStart, nlStart).replace(restStr, restStr + '    "Kneipen und Bars": "Kneipen und Bars",\n') + i18n.substring(nlStart).replace(restNlStr, restNlStr + '    "Kneipen und Bars": "Kroegen en Bars",\n');

fs.writeFileSync('src/i18n.tsx', i18n);
