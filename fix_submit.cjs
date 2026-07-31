const fs = require('fs');
let content = fs.readFileSync('src/components/SubmitBusiness.tsx', 'utf8');

if (!content.includes('useTranslation')) {
  content = content.replace(
    "import React, { useState } from 'react';",
    "import React, { useState } from 'react';\nimport { useTranslation } from '../i18n';"
  );
}

content = content.replace(
  "export default function SubmitBusiness({ onBack, theme, activeThemeKey, onBusinessAdded }: SubmitBusinessProps) {",
  "export default function SubmitBusiness({ onBack, theme, activeThemeKey, onBusinessAdded }: SubmitBusinessProps) {\n  const { t } = useTranslation();"
);

content = content.replace(/>Vielen Dank!</g, '>{t("thankYou")}<');
content = content.replace(/>Ihr Unternehmen wurde erfolgreich zur Prüfung eingereicht\.</g, '>{t("submitSuccess")}<');
content = content.replace(/>Wir werden Ihre Angaben schnellstmöglich überprüfen und den Eintrag freischalten\.</g, '>{t("submitSuccessDesc")}<');
content = content.replace(/>Zurück zur Übersicht</g, '>{t("backToOverview")}<');
content = content.replace(/>Unternehmen eintragen</g, '>{t("submitBusinessTitle")}<');
content = content.replace(/>Unternehmen</g, '>{t("company")}<');
content = content.replace(/placeholder="Name des Unternehmens"/g, 'placeholder={t("companyNamePlaceholder")}');
content = content.replace(/>Kategorie</g, '>{t("category")}<');
content = content.replace(/>Unterkategorie \(Optional\)</g, '>{t("subcategoryOptional")}<');
content = content.replace(/>Kurzbeschreibung</g, '>{t("shortDescription")}<');
content = content.replace(/>Ausführliche Beschreibung \(Premium\)</g, '>{t("detailedDescriptionPremium")}<');
content = content.replace(/placeholder="z\.B\. Wir sind ein Familienbetrieb\.\.\."/g, 'placeholder={t("detailedDescriptionPlaceholder")}');
content = content.replace(/>E-Mail Adresse</g, '>{t("email")}<');
content = content.replace(/placeholder="ihre@email\.de"/g, 'placeholder={t("emailPlaceholder")}');
content = content.replace(/>Telefon \(Optional\)</g, '>{t("phoneOptional")}<');
content = content.replace(/>Webseite \(Optional\)</g, '>{t("websiteOptional")}<');
content = content.replace(/placeholder="www\.beispiel\.de"/g, 'placeholder={t("websitePlaceholder")}');
content = content.replace(/>Straße und Hausnummer</g, '>{t("streetAndNumber")}<');
content = content.replace(/placeholder="z\.B\. Hauptstraße 1"/g, 'placeholder={t("streetPlaceholder")}');
content = content.replace(/>Stadtteil\/Ort</g, '>{t("districtCity")}<');
content = content.replace(/placeholder="z\.B\. Winterberg, Niedersfeld\.\.\."/g, 'placeholder={t("districtPlaceholder")}');
content = content.replace(/>Logo URL \(Optional\)</g, '>{t("logoUrlOptional")}<');
content = content.replace(/placeholder="https:\/\/\.\.\."/g, 'placeholder={t("urlPlaceholder")}');
content = content.replace(/>Eintrag kostenpflichtig einreichen/g, '>{t("submitPaidEntry")}');
content = content.replace(/>Kostenpflichtig buchen/g, '>{t("bookPaid")}');

fs.writeFileSync('src/components/SubmitBusiness.tsx', content);
