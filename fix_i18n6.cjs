const fs = require('fs');
let content = fs.readFileSync('src/i18n.tsx', 'utf8');

const deAdd = `
    login: 'Login',
    register: 'Registrieren',
    resetPassword: 'Passwort zurücksetzen',
    resetLinkSent: 'Ein Link zum Zurücksetzen des Passworts wurde gesendet.',
    errorOccurred: 'Ein Fehler ist aufgetreten',
    password: 'Passwort',
    pleaseWait: 'Bitte warten...',
    forgotPassword: 'Passwort vergessen?',
    noAccountRegister: 'Noch kein Account? Registrieren',
    backToLogin: 'Zurück zum Login',
    cancel: 'Abbrechen',
    requestLink: 'Link anfordern',
    alertStarRating: 'Bitte vergeben Sie eine Sterne-Bewertung.',
    alertReviewText: 'Bitte schreiben Sie einen Bewertungstext.',
    ownerReply: 'Antwort des Inhabers',
    thanksForReview: 'Vielen Dank für Ihre Bewertung!',
    reviewPendingApproval: 'Ihre Bewertung wird nach einer kurzen Prüfung freigeschaltet.',
    writeReviewPlaceholder: 'Schreiben Sie eine Bewertung...',
    submitReview: 'Bewertung absenden',
    // Categories`;

const nlAdd = `
    login: 'Inloggen',
    register: 'Registreren',
    resetPassword: 'Wachtwoord resetten',
    resetLinkSent: 'Er is een link gestuurd om uw wachtwoord te resetten.',
    errorOccurred: 'Er is een fout opgetreden',
    password: 'Wachtwoord',
    pleaseWait: 'Even geduld...',
    forgotPassword: 'Wachtwoord vergeten?',
    noAccountRegister: 'Nog geen account? Registreren',
    backToLogin: 'Terug naar inloggen',
    cancel: 'Annuleren',
    requestLink: 'Link aanvragen',
    alertStarRating: 'Geef a.u.b. een sterrenbeoordeling.',
    alertReviewText: 'Schrijf a.u.b. een beoordelingstekst.',
    ownerReply: 'Antwoord van de eigenaar',
    thanksForReview: 'Bedankt voor uw beoordeling!',
    reviewPendingApproval: 'Uw beoordeling wordt na een korte controle gepubliceerd.',
    writeReviewPlaceholder: 'Schrijf een beoordeling...',
    submitReview: 'Beoordeling verzenden',
    // Categories`;

content = content.replace('// Categories', deAdd);
content = content.replace('// Categories', nlAdd);

fs.writeFileSync('src/i18n.tsx', content);
