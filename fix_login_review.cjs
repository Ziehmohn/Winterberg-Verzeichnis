const fs = require('fs');
let login = fs.readFileSync('src/components/Login.tsx', 'utf8');
let review = fs.readFileSync('src/components/ReviewForm.tsx', 'utf8');

// Fix Login
if (!login.includes('useTranslation')) {
  login = login.replace("import { auth } from '../firebase';", "import { auth } from '../firebase';\nimport { useTranslation } from '../i18n';");
}
login = login.replace(/export default function Login\([^)]+\) {/, '$&\n  const { t } = useTranslation();');

login = login.replace(/>Login</, '>{t("login")}<');
login = login.replace(/>Registrieren</, '>{t("register")}<');
login = login.replace(/>Passwort zurücksetzen</, '>{t("resetPassword")}<');
login = login.replace(/'Ein Link zum Zurücksetzen des Passworts wurde gesendet\.'/g, 't("resetLinkSent")');
login = login.replace(/'Ein Fehler ist aufgetreten'/g, 't("errorOccurred")');
login = login.replace(/>E-Mail Adresse</g, '>{t("email")}<');
login = login.replace(/>Passwort</g, '>{t("password")}<');
login = login.replace(/'Bitte warten\.\.\.'/g, 't("pleaseWait")');
login = login.replace(/>Passwort vergessen\?</g, '>{t("forgotPassword")}<');
login = login.replace(/>Noch kein Account\? Registrieren</g, '>{t("noAccountRegister")}<');
login = login.replace(/>Zurück zum Login</g, '>{t("backToLogin")}<');
login = login.replace(/>Abbrechen</g, '>{t("cancel")}<');
login = login.replace(/>Anmelden</g, '>{t("login")}<');
login = login.replace(/>Link anfordern</g, '>{t("requestLink")}<');
// Be careful with the Anmelden/Registrieren/Link anfordern strings inside {loading ? ... : mode === 'login' ? 'Anmelden' : mode === 'register' ? 'Registrieren' : 'Link anfordern'}
login = login.replace(/: 'Anmelden'/g, ': t("login")');
login = login.replace(/: 'Registrieren'/g, ': t("register")');
login = login.replace(/: 'Link anfordern'/g, ': t("requestLink")');

fs.writeFileSync('src/components/Login.tsx', login);

// Fix Review
if (!review.includes('useTranslation')) {
  review = review.replace("import { Business, Review } from '../types';", "import { Business, Review } from '../types';\nimport { useTranslation } from '../i18n';");
}
review = review.replace(/export default function ReviewForm\([^)]+\) {/, '$&\n  const { t } = useTranslation();');

review = review.replace(/'Bitte vergeben Sie eine Sterne-Bewertung\.'/g, 't("alertStarRating")');
review = review.replace(/'Bitte schreiben Sie einen Bewertungstext\.'/g, 't("alertReviewText")');
review = review.replace(/>Kundenbewertungen</g, '>{t("customerReviews")}<');
review = review.replace(/>Antwort des Inhabers:</g, '>{t("ownerReply")}:<');
review = review.replace(/>Vielen Dank für Ihre Bewertung!</g, '>{t("thanksForReview")}<');
review = review.replace(/>Ihre Bewertung wird nach einer kurzen Prüfung freigeschaltet\.</g, '>{t("reviewPendingApproval")}<');
review = review.replace(/placeholder="Schreiben Sie eine Bewertung\.\.\."/g, 'placeholder={t("writeReviewPlaceholder")}');
review = review.replace(/>Bewertung absenden</g, '>{t("submitReview")}<');

fs.writeFileSync('src/components/ReviewForm.tsx', review);
