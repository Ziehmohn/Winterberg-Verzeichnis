const fs = require('fs');
const content = fs.readFileSync('src/App.tsx', 'utf8');
const searchList = ["t('allLocations')", 't("allLocations")', 'Alle Orte', 'Dunkles Design'];
for (const s of searchList) {
    console.log(s + ': ' + content.includes(s));
}
