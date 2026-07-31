const fs = require('fs');
let content = fs.readFileSync('src/i18n.tsx', 'utf8');

const deExtra = {
    "Branchen": "Branchen",
    "Jobs": "Jobs",
    "Stellenangebote": "Stellenangebote",
    "Vollzeit": "Vollzeit",
    "Teilzeit": "Teilzeit",
    "Minijob": "Minijob",
    "Ausbildung": "Ausbildung",
    "Praktikum": "Praktikum",
    "Freelance": "Freelance",
    "Grönebach": "Grönebach",
    "Niedersfeld": "Niedersfeld",
    "Siedlinghausen": "Siedlinghausen",
    "Silbach": "Silbach",
    "Winterberg": "Winterberg",
    "Züschen": "Züschen",
    "list": "Liste",
    "map": "Karte",
    "darkTheme": "Dunkles Design",
    "adminLogin": "Admin / Partner Login",
    "showAll": "Alle anzeigen",
    "backToStart": "Zurück zur Startseite",
    "showAllJobs": "Alle Stellen anzeigen",
    "projectBy": "Ein Projekt von",
    "titleSubtitle": "Das große Verzeichnis für alle Unternehmen, Handwerker und Dienstleister in Winterberg und Umgebung."
};

const nlExtra = {
    "Branchen": "Branches",
    "Jobs": "Banen",
    "Stellenangebote": "Vacatures",
    "Vollzeit": "Fulltime",
    "Teilzeit": "Parttime",
    "Minijob": "Bijbaan",
    "Ausbildung": "Opleiding",
    "Praktikum": "Stage",
    "Freelance": "Freelance",
    "Grönebach": "Grönebach",
    "Niedersfeld": "Niedersfeld",
    "Siedlinghausen": "Siedlinghausen",
    "Silbach": "Silbach",
    "Winterberg": "Winterberg",
    "Züschen": "Züschen",
    "list": "Lijst",
    "map": "Kaart",
    "darkTheme": "Donker thema",
    "adminLogin": "Admin / Partner Login",
    "showAll": "Alles weergeven",
    "backToStart": "Terug naar startpagina",
    "showAllJobs": "Alle vacatures bekijken",
    "projectBy": "Een project van",
    "titleSubtitle": "De grote gids voor alle bedrijven, vakmensen en dienstverleners in Winterberg en omgeving."
};

// Insert for DE
let deStr = "";
for (const [k, v] of Object.entries(deExtra)) {
    if (!content.includes(`"${k}":`)) {
        deStr += `    "${k}": "${v}",\n`;
    }
}

// Insert for NL
let nlStr = "";
for (const [k, v] of Object.entries(nlExtra)) {
    if (!content.includes(`"${k}":`)) {
        nlStr += `    "${k}": "${v}",\n`;
    }
}

content = content.replace('  nl: {', deStr + '  nl: {');
content = content.replace('export const I18nContext', nlStr + '  }\n};\nexport const I18nContext');

// Clean up any weird ending
content = content.replace(/  \}\n\};\n  \}\n\};\nexport const/, '  }\n};\nexport const');
content = content.replace(/"Alle": "Alle"\}\},/, '"Alle": "Alle",');
content = content.replace(/"Alle": "Alle"\}\}/, '"Alle": "Alle",');

fs.writeFileSync('src/i18n.tsx', content);
