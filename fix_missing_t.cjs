const fs = require('fs');

const deExtra = {
  "noBusinessesFound": "Keine Einträge gefunden",
  "adjustSearchCriteria": "Bitte passen Sie Ihre Suchkriterien an.",
  "footerInitiative": "Eine Initiative für die Wirtschaft in Winterberg",
  "activateLightTheme": "Helles Design aktivieren",
  "lightTheme": "Helles Design",
  "confirmDelete": "Möchten Sie diesen Eintrag wirklich löschen?",
  "secureAccess": "Sicheren Zugriff anfordern",
  "takeControl": "Eintrag übernehmen",
  "premiumAccess": "Premium-Zugang",
  "first3Months": "Erste 3 Monate",
  "thereafter": "danach",
  "cancelMonthlyTax": "mtl. kündbar, zzgl. MwSt.",
  "imagesComingSoon": "Bilder folgen in Kürze",
  "noJobsFound": "Keine Stellenangebote gefunden",
  "noJobsMatch": "Es gibt keine Stellenangebote, die Ihren Kriterien entsprechen.",
  "viewJob": "Job ansehen",
  "openingHours": "Öffnungszeiten",
  "priorityInSearch": "Priorität in der Suche",
  "editAnytime": "Jederzeit bearbeitbar",
  "save": "Speichern",
  "pricingDesc2": "Vergleichen Sie unsere Angebote",
  "freeBasicPresence": "Kostenlose Basispräsenz",
  "monthlyCancelable": "Monatlich kündbar",
  "paymentSoon": "Zahlung bald verfügbar",
  "available": "verfügbar",
  "submitBusinessDesc": "Fügen Sie Ihr Unternehmen zum Verzeichnis hinzu.",
  "premiumYearlyDesc": "Premium-Jahresabonnement",
  "saveEntry": "Eintrag speichern",
  "paymentError": "Zahlungsfehler"
};

const nlExtra = {
  "noBusinessesFound": "Geen vermeldingen gevonden",
  "adjustSearchCriteria": "Pas uw zoekcriteria aan a.u.b.",
  "footerInitiative": "Een initiatief voor de economie in Winterberg",
  "activateLightTheme": "Licht thema activeren",
  "lightTheme": "Licht thema",
  "confirmDelete": "Wilt u deze vermelding echt verwijderen?",
  "secureAccess": "Beveiligde toegang aanvragen",
  "takeControl": "Vermelding overnemen",
  "premiumAccess": "Premium toegang",
  "first3Months": "Eerste 3 maanden",
  "thereafter": "daarna",
  "cancelMonthlyTax": "maandelijks opzegbaar, excl. btw.",
  "imagesComingSoon": "Afbeeldingen volgen binnenkort",
  "noJobsFound": "Geen vacatures gevonden",
  "noJobsMatch": "Er zijn geen vacatures die aan uw criteria voldoen.",
  "viewJob": "Vacature bekijken",
  "openingHours": "Openingstijden",
  "priorityInSearch": "Prioriteit in de zoekopdracht",
  "editAnytime": "Altijd bewerkbaar",
  "save": "Opslaan",
  "pricingDesc2": "Vergelijk onze aanbiedingen",
  "freeBasicPresence": "Gratis basisaanwezigheid",
  "monthlyCancelable": "Maandelijks opzegbaar",
  "paymentSoon": "Betaling binnenkort beschikbaar",
  "available": "beschikbaar",
  "submitBusinessDesc": "Voeg uw bedrijf toe aan de gids.",
  "premiumYearlyDesc": "Premium jaarabonnement",
  "saveEntry": "Vermelding opslaan",
  "paymentError": "Betalingsfout"
};

let content = fs.readFileSync('src/i18n.tsx', 'utf8');

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

content = content.replace(/"Alle": "Alle",\n    "Branchen": "Branchen",/, '"Alle": "Alle",\n    "Branchen": "Branchen",\n' + deStr);
content = content.replace(/"Alle": "Alle",\n    "Branchen": "Branches",/, '"Alle": "Alle",\n    "Branchen": "Branches",\n' + nlStr);

fs.writeFileSync('src/i18n.tsx', content);

