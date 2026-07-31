const fs = require('fs');

try {
  let app = fs.readFileSync('src/App.tsx', 'utf8');
  // Replace categoriesTitle with Branchen
  app = app.replace(/\{t\("categoriesTitle"\)\}/g, '{t("Branchen")}');
  fs.writeFileSync('src/App.tsx', app);
  
  let i18n = fs.readFileSync('src/i18n.tsx', 'utf8');
  
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
  
  const indexDe = i18n.indexOf('  nl: {');
  let dePart = i18n.substring(0, indexDe);
  let nlPart = i18n.substring(indexDe);

  let deAppend = "";
  for (const [k, v] of Object.entries(deExtra)) {
      if (!dePart.includes(`"${k}":`)) {
          deAppend += `    "${k}": "${v}",\n`;
      }
  }
  if (deAppend) {
      dePart = dePart.replace(/"Alle": "Alle"\},/, `"Alle": "Alle",\n${deAppend}  },`); // If comma was missing? Wait, it has "Alle": "Alle"},
      // It might be formatted differently, let's just use string replace carefully
      dePart = dePart.replace(/"Alle": "Alle"\}/, `"Alle": "Alle",\n${deAppend}  }`);
      dePart = dePart.replace(/"Alle": "Alle"\},/, `"Alle": "Alle",\n${deAppend}  },`);
  }

  let nlAppend = "";
  for (const [k, v] of Object.entries(nlExtra)) {
      if (!nlPart.includes(`"${k}":`)) {
          nlAppend += `    "${k}": "${v}",\n`;
      }
  }
  if (nlAppend) {
      nlPart = nlPart.replace(/"Alle": "Alle"\}/, `"Alle": "Alle",\n${nlAppend}}`);
  }

  fs.writeFileSync('src/i18n.tsx', dePart + nlPart);
} catch (e) {
  console.log(e);
}
