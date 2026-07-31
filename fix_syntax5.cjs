const fs = require('fs');
let content = fs.readFileSync('src/i18n.tsx', 'utf8');

content = content.replace(/Umgebung\.",\s*nl: \{/g, 'Umgebung."\n  },\n  nl: {');
fs.writeFileSync('src/i18n.tsx', content);
