const fs = require('fs');
let i18n = fs.readFileSync('src/i18n.tsx', 'utf8');

const deStart = i18n.indexOf('const translations = {\n  de: {');
const nlStart = i18n.indexOf('  nl: {');

const searchStr = '"Restaurant": "Restaurant",\n';

i18n = i18n.substring(0, deStart) + 
       i18n.substring(deStart, nlStart).replace(searchStr, searchStr + '    "results": "Ergebnisse",\n') + 
       i18n.substring(nlStart).replace(searchStr, searchStr + '    "results": "Resultaten",\n');

fs.writeFileSync('src/i18n.tsx', i18n);
