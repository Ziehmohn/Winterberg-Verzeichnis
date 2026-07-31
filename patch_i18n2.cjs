const fs = require('fs');

const extraDe = {
  noJobsFound: 'Keine Stellen gefunden',
  noJobsMatch: 'Aktuell gibt es keine offenen Stellen für diese Suchkriterien.',
  showAllJobs: 'Alle Stellen anzeigen',
  viewJob: 'Ansehen'
};

const extraNl = {
  noJobsFound: 'Geen vacatures gevonden',
  noJobsMatch: 'Er zijn momenteel geen vacatures die aan uw zoekcriteria voldoen.',
  showAllJobs: 'Alle vacatures bekijken',
  viewJob: 'Bekijken'
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
  /"Alle": "Alle"\n  \},/g,
  `"Alle": "Alle",\n${deString}  },`
);

content = content.replace(
  /"Alle": "Alle"\n\};/g,
  `"Alle": "Alle",\n${nlString}};`
);

fs.writeFileSync('src/i18n.tsx', content);

