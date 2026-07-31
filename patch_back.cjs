const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf8');
content = content.replace(/Zurück zum Verzeichnis/g, '{t("backToDir")}');

fs.writeFileSync('src/App.tsx', content);

