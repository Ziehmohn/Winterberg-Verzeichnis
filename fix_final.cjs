const fs = require('fs');

try {
  let content = fs.readFileSync('src/App.tsx', 'utf8');
  content = content.replace(/Alle Orte/g, '{t("allLocations")}');
  content = content.replace(/>Liste<\/span>/g, '>{t("list")}</span>');
  content = content.replace(/>Karte<\/span>/g, '>{t("map")}</span>');
  content = content.replace(/Dunkles Design/g, '{t("darkTheme")}');
  content = content.replace(/Admin \/ Partner Login/g, '{t("adminLogin")}');
  content = content.replace(/Das große Verzeichnis für alle Unternehmen, Handwerker und Dienstleister in Winterberg und Umgebung\./g, '{t("titleSubtitle")}');
  content = content.replace(/>Alle anzeigen<\/button>/g, '>{t("showAll")}</button>');
  
  content = content.replace(
    /<span className={`font-medium whitespace-nowrap \${activeThemeKey === 'modern' \? 'tracking-wide' : ''}`}>{badge\.category}<\/span>/g,
    '<span className={`font-medium whitespace-nowrap ${activeThemeKey === \'modern\' ? \'tracking-wide\' : \'\'}`}>{t(badge.category)}</span>'
  );
  content = content.replace(
    /<span className={`font-medium whitespace-nowrap`}>{badge\.category}<\/span>/g,
    '<span className={`font-medium whitespace-nowrap`}>{t(badge.category)}</span>'
  );

  fs.writeFileSync('src/App.tsx', content);
  console.log("App.tsx fixed");
} catch(e) { console.error(e); }

try {
  let jobs = fs.readFileSync('src/components/JobsBoard.tsx', 'utf8');
  jobs = jobs.replace(/>Alle anzeigen<\/button>/g, '>{t("showAllJobs")}</button>');
  fs.writeFileSync('src/components/JobsBoard.tsx', jobs);
  console.log("JobsBoard.tsx fixed");
} catch(e) { console.error(e); }

try {
  let agb = fs.readFileSync('src/components/AGB.tsx', 'utf8');
  agb = agb.replace(/>Zurück zur Startseite/g, '>{t("backToStart")}');
  fs.writeFileSync('src/components/AGB.tsx', agb);
  console.log("AGB.tsx fixed");
} catch(e) {}
try {
  let imp = fs.readFileSync('src/components/Impressum.tsx', 'utf8');
  imp = imp.replace(/>Zurück zur Startseite/g, '>{t("backToStart")}');
  fs.writeFileSync('src/components/Impressum.tsx', imp);
  console.log("Impressum.tsx fixed");
} catch(e) {}

