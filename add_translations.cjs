const fs = require('fs');

const extraDe = {
  submitBusinessDesc: 'Bitte füllen Sie das Formular aus, um Ihr Unternehmen in das Verzeichnis aufzunehmen. Alle Angaben werden manuell geprüft.',
  premiumYearlyDesc: 'Oder 199,50 € / Jahr (2 Monate geschenkt)',
  openingHours: 'Öffnungszeiten',
  priorityInSearch: 'Priorität in den Suchergebnissen',
  editAnytime: 'Eintrag jederzeit bearbeitbar',
  monthly: 'Monatlich',
  yearly: 'Jährlich',
  save: 'sparen',
  pricingDesc2: 'Wählen Sie den passenden Eintrag für Ihr Unternehmen in Winterberg. Sichern Sie sich mehr Sichtbarkeit und präsentieren Sie Ihre Angebote optimal.',
  freeBasicPresence: 'e Grundpräsenz in unserem Verzeichnis.',
  paymentSoon: 'Die Bezahlfunktion wird in Kürze eingerichtet. Aktuell ist nur der ',
  available: 'verfügbar',
  monthlyCancelable: 'Jederzeit monatlich kündbar.',
  saveEntry: 'Eintrag speichern',
  saving: 'Wird gespeichert...',
  confirmDelete: 'Eintrag wirklich löschen?',
  allRightsReserved: 'Alle Rechte vorbehalten',
};

const extraNl = {
  submitBusinessDesc: 'Vul het formulier in om uw bedrijf aan de gids toe te voegen. Alle gegevens worden handmatig gecontroleerd.',
  premiumYearlyDesc: 'Of 199,50 € / jaar (2 maanden gratis)',
  openingHours: 'Openingstijden',
  priorityInSearch: 'Prioriteit in de zoekresultaten',
  editAnytime: 'Vermelding altijd te bewerken',
  monthly: 'Maandelijks',
  yearly: 'Jaarlijks',
  save: 'besparen',
  pricingDesc2: 'Kies de juiste vermelding voor uw bedrijf in Winterberg. Krijg meer zichtbaarheid en presenteer uw aanbod optimaal.',
  freeBasicPresence: 'e basisaanwezigheid in onze gids.',
  paymentSoon: 'De betaalfunctie wordt binnenkort ingesteld. Momenteel is alleen de ',
  available: 'beschikbaar',
  monthlyCancelable: 'Altijd maandelijks opzegbaar.',
  saveEntry: 'Vermelding opslaan',
  saving: 'Opslaan...',
  confirmDelete: 'Vermelding echt verwijderen?',
  allRightsReserved: 'Alle rechten voorbehouden',
};

let content = fs.readFileSync('src/i18n.tsx', 'utf8');

// Insert the extra DE keys before the NL section
for (const [k, v] of Object.entries(extraDe)) {
  content = content.replace(/(\n  \},)/, `,\n    "${k}": "${v}"$1`);
}

// Insert the extra NL keys before the end of the NL section
for (const [k, v] of Object.entries(extraNl)) {
  content = content.replace(/(\n  \}\n\};)/, `,\n    "${k}": "${v}"$1`);
}

fs.writeFileSync('src/i18n.tsx', content);

