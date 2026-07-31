const fs = require('fs');
let content = fs.readFileSync('src/i18n.tsx', 'utf8');

const idx = content.indexOf('export const I18nContext');
let before = content.substring(0, idx);

// Keep stripping the trailing closing braces and newlines
before = before.replace(/[\s\};]+$/, '');

// Add the correct closing
before += '\n  }\n};\n\n';

fs.writeFileSync('src/i18n.tsx', before + content.substring(idx));
