const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(/>\s*AGB\s*<\/button>/g, '>{t("agb")}</button>');
content = content.replace(/>\s*Preise & Leistungen\s*<\/button>/g, '>{t("pricing")}</button>');

fs.writeFileSync('src/App.tsx', content);

