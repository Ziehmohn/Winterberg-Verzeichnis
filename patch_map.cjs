const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf8');
content = content.replace(/> Liste<\/button>/g, '> {t("viewList")}</button>');
content = content.replace(/> Karte<\/button>/g, '> {t("viewMap")}</button>');

fs.writeFileSync('src/App.tsx', content);

