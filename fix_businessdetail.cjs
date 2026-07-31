const fs = require('fs');

let content = fs.readFileSync('src/components/BusinessDetail.tsx', 'utf8');

content = content.replace(/'Fehler beim Starten des Zahlungsprozesses\.'/g, 't("paymentError")');
content = content.replace(/>Zugriff sichern<\/h2>/g, '>{t("secureAccess")}</h2>');
content = content.replace(/Übernehmen Sie die Kontrolle über den Eintrag <strong>/g, '{t("takeControl")} <strong>');
content = content.replace(/<div className="font-bold text-lg mb-2">Premium-Zugang<\/div>/g, '<div className="font-bold text-lg mb-2">{t("premiumAccess")}</div>');
content = content.replace(/<span>Erste 3 Monate:<\/span>/g, '<span>{t("first3Months")}:</span>');
content = content.replace(/<span>Danach:<\/span>/g, '<span>{t("thereafter")}:</span>');
content = content.replace(/>9,95 € \/ Monat<\/strong>/g, '>9,95 € / {t("month")}</strong>');
content = content.replace(/>49,95 € \/ Monat<\/strong>/g, '>49,95 € / {t("month")}</strong>');
content = content.replace(/Monatlich kündbar\. Alle Preise zzgl\. gesetzl\. MwSt\./g, '{t("cancelMonthlyTax")}');
content = content.replace(/BILDER FOLGEN IN KÜRZE/g, '{t("imagesComingSoon")}');

fs.writeFileSync('src/components/BusinessDetail.tsx', content);

// Add missing translations to i18n
const extraDe = {
  paymentError: 'Fehler beim Starten des Zahlungsprozesses.',
  secureAccess: 'Zugriff sichern',
  takeControl: 'Übernehmen Sie die Kontrolle über den Eintrag',
  premiumAccess: 'Premium-Zugang',
  first3Months: 'Erste 3 Monate',
  thereafter: 'Danach',
  cancelMonthlyTax: 'Monatlich kündbar. Alle Preise zzgl. gesetzl. MwSt.',
  imagesComingSoon: 'BILDER FOLGEN IN KÜRZE'
};

const extraNl = {
  paymentError: 'Fout bij het starten van het betalingsproces.',
  secureAccess: 'Toegang beveiligen',
  takeControl: 'Neem de controle over de vermelding',
  premiumAccess: 'Premium toegang',
  first3Months: 'Eerste 3 maanden',
  thereafter: 'Daarna',
  cancelMonthlyTax: 'Maandelijks opzegbaar. Alle prijzen excl. BTW.',
  imagesComingSoon: 'FOTO\'S VOLGEN BINNENKORT'
};

let i18n = fs.readFileSync('src/i18n.tsx', 'utf8');

let deString = "";
for (const [k, v] of Object.entries(extraDe)) {
  deString += `    "${k}": "${v}",\n`;
}

let nlString = "";
for (const [k, v] of Object.entries(extraNl)) {
  nlString += `    "${k}": "${v}",\n`;
}

i18n = i18n.replace(
  /"allRightsReserved": "Alle Rechte vorbehalten",\n/g,
  `"allRightsReserved": "Alle Rechte vorbehalten",\n${deString}`
);

i18n = i18n.replace(
  /"allRightsReserved": "Alle rechten voorbehouden",\n/g,
  `"allRightsReserved": "Alle rechten voorbehouden",\n${nlString}`
);

fs.writeFileSync('src/i18n.tsx', i18n);

