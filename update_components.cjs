const fs = require('fs');

function updateSubmitBusiness() {
  let content = fs.readFileSync('src/components/SubmitBusiness.tsx', 'utf8');
  content = content.replace(/Ihr Unternehmen wurde erfolgreich eingereicht\. Wir werden die Daten prüfen und den Eintrag in Kürze freischalten\./g, '{t("submitSuccessDesc")}');
  content = content.replace(/Bitte füllen Sie das Formular aus, um Ihr Unternehmen in das Verzeichnis aufzunehmen\. Alle Angaben werden manuell geprüft\./g, '{t("submitBusinessDesc")}');
  content = content.replace(/Unternehmensname\*/g, '{t("companyNamePlaceholder")}*');
  content = content.replace(/Kategorie\*/g, '{t("category")}*');
  content = content.replace(/Kurzbeschreibung\*/g, '{t("shortDescription")}*');
  content = content.replace(/Adresse \(mit Ort\)\*/g, '{t("address")}*');
  content = content.replace(/>Telefon</g, '>{t("phoneOptional")}<');
  content = content.replace(/>Webseite</g, '>{t("websiteOptional")}<');
  content = content.replace(/Wählen Sie Ihr Leistungspaket/g, '{t("pricingDesc")}');
  content = content.replace(/Basis-Eintrag/g, '{t("basicEntry")}');
  content = content.replace(/0,00 € <span className="text-xs font-normal">\/ dauerhaft<\/span>/g, '0,00 € <span className="text-xs font-normal">/ {t("free")}</span>');
  content = content.replace(/> Firmenname & Adresse<\/li>/g, '> {t("company")} & {t("address")}</li>');
  content = content.replace(/> Kurzbeschreibung<\/li>/g, '> {t("shortDescription")}</li>');
  content = content.replace(/> Kontaktdaten<\/li>/g, '> {t("contactDetails")}</li>');
  
  content = content.replace(/> Ausführliches Profil & Bildergalerie<\/li>/g, '> {t("detailedDesc")} & {t("logoGallery")}</li>');
  content = content.replace(/> Hervorgehobene Platzierung & SEO<\/li>/g, '> {t("highlightedPlacement")} & SEO</li>');
  content = content.replace(/> Stellenanzeigen veröffentlichen<\/li>/g, '> {t("publishJobs")}</li>');
  content = content.replace(/> Bewertungen kommentieren<\/li>/g, '> {t("customerReviews")}</li>');
  content = content.replace(/> Eigener Account & Login<\/li>/g, '> {t("login")}</li>');
  content = content.replace(/19,95 € <span className="text-xs font-normal">\/ Monat<\/span>/g, '19,95 € <span className="text-xs font-normal">/ {t("month")}</span>');
  content = content.replace(/Oder 199,50 € \/ Jahr \(2 Monate geschenkt\)/g, '{t("premiumYearlyDesc")}');
  content = content.replace(/Kostenfrei eintragen/g, '{t("createEntry")}');
  content = content.replace(/Zahlungspflichtig bestellen/g, '{t("bookPaid")}');
  content = content.replace(/Fehler beim Einreichen\. Bitte versuchen Sie es später noch einmal\./g, '"+t("errorOccurred")+"');

  fs.writeFileSync('src/components/SubmitBusiness.tsx', content);
}

function updatePricingTable() {
  let content = fs.readFileSync('src/components/PricingTable.tsx', 'utf8');
  content = content.replace(/'Firmenname & Adresse'/g, '`${t("company")} & ${t("address")}`');
  content = content.replace(/'Kurzbeschreibung'/g, 't("shortDescription")');
  content = content.replace(/'Kontaktdaten \(Telefon, E-Mail\)'/g, 't("contactDetails")');
  content = content.replace(/'Link zur eigenen Webseite'/g, 't("websiteLink")');
  content = content.replace(/'Öffnungszeiten'/g, 't("openingHours")');
  content = content.replace(/'Ausführliches Profil \(Über uns\)'/g, 't("detailedDesc")');
  content = content.replace(/'Bildergalerie \(bis zu 6 Bilder\)'/g, 't("logoGallery")');
  content = content.replace(/'Leistungen & Services Liste'/g, 't("servicesAndFeatures")');
  content = content.replace(/'Priorität in den Suchergebnissen'/g, 't("priorityInSearch")');
  content = content.replace(/'Eigener Account & Login'/g, 't("login")');
  content = content.replace(/'Eintrag jederzeit bearbeitbar'/g, 't("editAnytime")');
  
  content = content.replace(/Zurück/g, '{t("back")}');
  content = content.replace(/>Monatlich/g, '>{t("monthly")}<');
  content = content.replace(/>Jährlich /g, '>{t("yearly")} ');
  content = content.replace(/sparen<\/span>/g, ' {t("save")}</span>');
  content = content.replace(/Wählen Sie den passenden Eintrag für Ihr Unternehmen in Winterberg\. Sichern Sie sich mehr Sichtbarkeit und präsentieren Sie Ihre Angebote optimal\./g, '{t("pricingDesc2")}');
  content = content.replace(/e Grundpräsenz in unserem Verzeichnis\./g, ' {t("freeBasicPresence")}');
  content = content.replace(/>Kostenfrei eintragen</g, '>{t("createEntry")}<');
  content = content.replace(/>Zahlungspflichtig bestellen</g, '>{t("bookPaid")}<');
  content = content.replace(/Die Bezahlfunktion wird in Kürze eingerichtet\. Aktuell ist nur der /g, '{t("paymentSoon")} ');
  content = content.replace(/ verfügbar\./g, ' {t("available")}.');
  content = content.replace(/Jederzeit monatlich kündbar\./g, '"+t("monthlyCancelable")+"');
  
  fs.writeFileSync('src/components/PricingTable.tsx', content);
}

function updateApp() {
  let content = fs.readFileSync('src/App.tsx', 'utf8');
  content = content.replace(/>Neuer Eintrag</g, '>{t("createEntry")}<');
  content = content.replace(/Eintrag speichern/g, '{t("saveEntry")}');
  content = content.replace(/Wird gespeichert\.\.\./g, '{t("saving")}');
  content = content.replace(/'Eintrag wirklich löschen\?'/g, 't("confirmDelete")');
  
  // Footer text
  content = content.replace(/© 2026 Winterberger Unternehmen\. Alle Rechte vorbehalten\./g, '© 2026 Winterberger Unternehmen. {t("allRightsReserved")}.');
  
  fs.writeFileSync('src/App.tsx', content);
}

updateSubmitBusiness();
updatePricingTable();
updateApp();

