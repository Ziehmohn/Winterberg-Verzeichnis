const fs = require('fs');
let content = fs.readFileSync('src/i18n.tsx', 'utf8');

const deAdd = `
    noInfo: 'Keine Angaben',
    closesAt: 'Schließt um',
    opensAt: 'Öffnet um',
    // Categories`;

const nlAdd = `
    noInfo: 'Geen gegevens',
    closesAt: 'Sluit om',
    opensAt: 'Opent om',
    // Categories`;

content = content.replace('// Categories', deAdd);
content = content.replace('// Categories', nlAdd);

fs.writeFileSync('src/i18n.tsx', content);
