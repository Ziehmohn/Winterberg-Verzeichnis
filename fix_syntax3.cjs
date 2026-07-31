const fs = require('fs');
let content = fs.readFileSync('src/i18n.tsx', 'utf8');

// Fix DE
content = content.replace(/"Alle": "Alle"\n\},\n    "Branchen": "Branchen",/, '"Alle": "Alle",\n    "Branchen": "Branchen",');

// Fix NL
content = content.replace(/"Alle": "Alle"\n\}\n\};\n\n    "Branchen": "Branches",/, '"Alle": "Alle",\n    "Branchen": "Branches",');

// Add end of NL dict
content = content.replace(/  \}\n\};\n\n  \}\n\};\nexport const I18nContext/, '  }\n};\nexport const I18nContext');

// Just to be sure, let's fix the end
const idx = content.indexOf('export const I18nContext');
let before = content.substring(0, idx);
// remove all trailing `};` or `}` and just add exactly what's needed.
before = before.replace(/\s+\}\s*\};\s*$/, '\n  }\n};\n');
fs.writeFileSync('src/i18n.tsx', before + 'export const I18nContext' + content.substring(idx + 'export const I18nContext'.length));

