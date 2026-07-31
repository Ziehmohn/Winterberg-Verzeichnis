const fs = require('fs');
let content = fs.readFileSync('src/i18n.tsx', 'utf8');

const deAdd = `
    jobsTitle: 'Offene Stellen in Winterberg',
    jobsDesc: 'Finden Sie Ihren Traumjob bei lokalen Unternehmen. Von Vollzeitstellen bis zu Aushilfsjobs - Winterberg bietet vielfältige Karrieremöglichkeiten.',
    jobsSearchPlaceholder: 'Jobtitel, Unternehmen oder Stichwort...',
    toCompanyProfile: 'Zum Unternehmensprofil',
    // Categories`;

const nlAdd = `
    jobsTitle: 'Vacatures in Winterberg',
    jobsDesc: 'Vind uw droombaan bij lokale bedrijven. Van fulltime banen tot bijbanen - Winterberg biedt diverse carrièremogelijkheden.',
    jobsSearchPlaceholder: 'Functietitel, bedrijf of trefwoord...',
    toCompanyProfile: 'Naar bedrijfsprofiel',
    // Categories`;

content = content.replace('// Categories', deAdd);
content = content.replace('// Categories', nlAdd);

fs.writeFileSync('src/i18n.tsx', content);
