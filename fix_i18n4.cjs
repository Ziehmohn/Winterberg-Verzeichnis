const fs = require('fs');
let content = fs.readFileSync('src/i18n.tsx', 'utf8');

const deAdd = `
    pricingTitle: 'Pakete & Preise',
    pricingDesc: 'Wählen Sie das passende Paket für Ihr Unternehmen',
    free: 'Kostenlos',
    idealForStart: 'Ideal für den Start',
    idealForEstablished: 'Für etablierte Unternehmen',
    maxVisibility: 'Maximale Sichtbarkeit',
    month: 'Monat',
    selectNow: 'Jetzt auswählen',
    basicEntry: 'Basis-Eintrag',
    inOneCategory: 'In einer Kategorie',
    contactForm: 'Kontaktformular',
    detailedDesc: 'Detaillierte Beschreibung',
    inUpTo3Categories: 'In bis zu 3 Kategorien',
    websiteLink: 'Link zur eigenen Website',
    highlightedPlacement: 'Hervorgehobene Platzierung',
    logoGallery: 'Logo & Bildergalerie',
    customerReviews: 'Kundenbewertungen',
    publishJobs: 'Stellenanzeigen veröffentlichen',
    // Categories`;

const nlAdd = `
    pricingTitle: 'Pakketten & Prijzen',
    pricingDesc: 'Kies het juiste pakket voor uw bedrijf',
    free: 'Gratis',
    idealForStart: 'Ideaal om te starten',
    idealForEstablished: 'Voor gevestigde bedrijven',
    maxVisibility: 'Maximale zichtbaarheid',
    month: 'Maand',
    selectNow: 'Nu selecteren',
    basicEntry: 'Basisvermelding',
    inOneCategory: 'In één categorie',
    contactForm: 'Contactformulier',
    detailedDesc: 'Gedetailleerde beschrijving',
    inUpTo3Categories: 'In maximaal 3 categorieën',
    websiteLink: 'Link naar eigen website',
    highlightedPlacement: 'Uitgelichte plaatsing',
    logoGallery: 'Logo & fotogalerij',
    customerReviews: 'Klantbeoordelingen',
    publishJobs: 'Vacatures plaatsen',
    // Categories`;

content = content.replace('// Categories', deAdd);
content = content.replace('// Categories', nlAdd);

fs.writeFileSync('src/i18n.tsx', content);
