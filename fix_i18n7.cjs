const fs = require('fs');
let content = fs.readFileSync('src/i18n.tsx', 'utf8');

const deAdd = `
    verifiedBusiness: 'Verifiziertes Unternehmen',
    // Categories`;

const nlAdd = `
    verifiedBusiness: 'Geverifieerd bedrijf',
    // Categories`;

content = content.replace('// Categories', deAdd);
content = content.replace('// Categories', nlAdd);

fs.writeFileSync('src/i18n.tsx', content);
