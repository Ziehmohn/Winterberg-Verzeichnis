const fs = require('fs');

try {
  let content = fs.readFileSync('src/App.tsx', 'utf8');

  // We check if "Alle Orte" is in the file.
  if (content.includes('>Alle Orte<')) {
    content = content.replace(/>Alle Orte<\/button>/g, '>{t("allLocations")}</button>');
  }

  // Same for other locations
  const locs = ["Grönebach", "Niedersfeld", "Siedlinghausen", "Silbach", "Winterberg", "Züschen"];
  for (const loc of locs) {
    const re = new RegExp(`>${loc}<\/button>`, 'g');
    content = content.replace(re, `>{t("${loc}")}</button>`);
  }

  fs.writeFileSync('src/App.tsx', content);
} catch (e) {
  console.log(e);
}
