const fs = require('fs');

const extraDe = {
  footerInitiative: 'Eine Initiative zur Förderung des lokalen Handels im Sauerland.',
  projectBy: 'Ein Projekt von'
};

const extraNl = {
  footerInitiative: 'Een initiatief ter bevordering van de lokale handel in het Sauerland.',
  projectBy: 'Een project van'
};

let content = fs.readFileSync('src/i18n.tsx', 'utf8');

let deString = "";
for (const [k, v] of Object.entries(extraDe)) {
  deString += `    "${k}": "${v}",\n`;
}

let nlString = "";
for (const [k, v] of Object.entries(extraNl)) {
  nlString += `    "${k}": "${v}",\n`;
}

content = content.replace(
  /"Alle": "Alle",\n/g,
  `"Alle": "Alle",\n${deString}`
);

// wait, replacing "Alle": "Alle" again would replace twice? Let's just find "allRightsReserved" and insert after it.
content = content.replace(
  /"allRightsReserved": "Alle Rechte vorbehalten"\n  \},/g,
  `"allRightsReserved": "Alle Rechte vorbehalten",\n${deString}  },`
);

content = content.replace(
  /"allRightsReserved": "Alle rechten voorbehouden"\n\};/g,
  `"allRightsReserved": "Alle rechten voorbehouden",\n${nlString}};`
);

fs.writeFileSync('src/i18n.tsx', content);

let appContent = fs.readFileSync('src/App.tsx', 'utf8');
appContent = appContent.replace(/Eine Initiative zur Förderung des lokalen Handels im Sauerland\./g, '{t("footerInitiative")}');
appContent = appContent.replace(/Ein Projekt von/g, '{t("projectBy")}');
appContent = appContent.replace(/>\s*Impressum\s*<\/button>/g, '>{t("impressum")}</button>');

fs.writeFileSync('src/App.tsx', appContent);

