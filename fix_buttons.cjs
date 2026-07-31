const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(/Neuer Eintrag/g, '{t("createEntry")}');
content = content.replace(/Eintrag speichern/g, '{t("saveEntry")}');

fs.writeFileSync('src/App.tsx', content);

