const fs = require('fs');

let content = fs.readFileSync('src/components/JobsBoard.tsx', 'utf8');

content = content.replace(/>Keine Stellen gefunden<\/h3>/g, '>{t("noJobsFound")}</h3>');
content = content.replace(/>Aktuell gibt es keine offenen Stellen für diese Suchkriterien\.</g, '>{t("noJobsMatch")}<');
content = content.replace(/>Alle Stellen anzeigen<\/button>/g, '>{t("showAllJobs")}</button>');
content = content.replace(/>\s*Ansehen <ArrowRight/g, '> {t("viewJob")} <ArrowRight');

fs.writeFileSync('src/components/JobsBoard.tsx', content);

