const fs = require('fs');
let content = fs.readFileSync('src/i18n.tsx', 'utf8');

content = content.replace(/"Alle": "Alle"\}\};\s*"Branchen": "Branches",/, '"Alle": "Alle",\n    "Branchen": "Branches",');
content = content.replace(/export const I18nContext/, '  }\n};\nexport const I18nContext');

fs.writeFileSync('src/i18n.tsx', content);
