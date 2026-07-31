const fs = require('fs');
let content = fs.readFileSync('src/i18n.tsx', 'utf8');

const deAdd = `
    thankYou: 'Vielen Dank!',
    submitSuccess: 'Ihr Unternehmen wurde erfolgreich zur Prüfung eingereicht.',
    submitSuccessDesc: 'Wir werden Ihre Angaben schnellstmöglich überprüfen und den Eintrag freischalten.',
    backToOverview: 'Zurück zur Übersicht',
    submitBusinessTitle: 'Unternehmen eintragen',
    company: 'Unternehmen',
    companyNamePlaceholder: 'Name des Unternehmens',
    category: 'Kategorie',
    subcategoryOptional: 'Unterkategorie (Optional)',
    shortDescription: 'Kurzbeschreibung',
    detailedDescriptionPremium: 'Ausführliche Beschreibung (Premium)',
    detailedDescriptionPlaceholder: 'z.B. Wir sind ein Familienbetrieb...',
    email: 'E-Mail Adresse',
    emailPlaceholder: 'ihre@email.de',
    phoneOptional: 'Telefon (Optional)',
    websiteOptional: 'Webseite (Optional)',
    websitePlaceholder: 'www.beispiel.de',
    streetAndNumber: 'Straße und Hausnummer',
    streetPlaceholder: 'z.B. Hauptstraße 1',
    districtCity: 'Stadtteil/Ort',
    districtPlaceholder: 'z.B. Winterberg, Niedersfeld...',
    logoUrlOptional: 'Logo URL (Optional)',
    urlPlaceholder: 'https://...',
    submitPaidEntry: 'Eintrag kostenpflichtig einreichen',
    bookPaid: 'Kostenpflichtig buchen',
    // Categories`;

const nlAdd = `
    thankYou: 'Dank u wel!',
    submitSuccess: 'Uw bedrijf is succesvol ingediend voor beoordeling.',
    submitSuccessDesc: 'We zullen uw gegevens zo snel mogelijk controleren en de vermelding publiceren.',
    backToOverview: 'Terug naar overzicht',
    submitBusinessTitle: 'Bedrijf aanmelden',
    company: 'Bedrijf',
    companyNamePlaceholder: 'Naam van het bedrijf',
    category: 'Categorie',
    subcategoryOptional: 'Subcategorie (Optioneel)',
    shortDescription: 'Korte beschrijving',
    detailedDescriptionPremium: 'Gedetailleerde beschrijving (Premium)',
    detailedDescriptionPlaceholder: 'Bijv. Wij zijn een familiebedrijf...',
    email: 'E-mailadres',
    emailPlaceholder: 'uw@email.nl',
    phoneOptional: 'Telefoon (Optioneel)',
    websiteOptional: 'Website (Optioneel)',
    websitePlaceholder: 'www.voorbeeld.nl',
    streetAndNumber: 'Straat en huisnummer',
    streetPlaceholder: 'Bijv. Hoofdstraat 1',
    districtCity: 'Wijk/Plaats',
    districtPlaceholder: 'Bijv. Winterberg, Niedersfeld...',
    logoUrlOptional: 'Logo URL (Optioneel)',
    urlPlaceholder: 'https://...',
    submitPaidEntry: 'Vermelding betaald indienen',
    bookPaid: 'Betaald boeken',
    // Categories`;

content = content.replace('// Categories', deAdd);
content = content.replace('// Categories', nlAdd);

fs.writeFileSync('src/i18n.tsx', content);
