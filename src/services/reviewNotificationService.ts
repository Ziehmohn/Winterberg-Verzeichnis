import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Business, Review } from '../types';
import { businesses as initialBusinesses } from '../data';
import { getBusinessPath } from '../utils/routes';

/**
 * Send automated email notification via /api/send-mail
 */
async function sendNotificationEmail(payload: { to: string; subject: string; html: string; cc?: string; bcc?: string }) {
  try {
    const res = await fetch('/api/send-mail', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      console.warn('Failed to send review notification email', await res.text());
    }
  } catch (err) {
    console.error('Error dispatching review notification email:', err);
  }
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Dispatches an email notification to the business owner/recipient when a review is submitted.
 * Respects business.emailNotifications opt-out preference.
 */
export async function notifyBusinessNewReview(
  businessId: string, 
  review: Review, 
  lang: 'de' | 'nl' = 'de'
): Promise<void> {
  let targetBusiness: Business | null = null;

  // 1. Fetch live from Firestore
  try {
    const bSnap = await getDoc(doc(db, 'businesses', businessId));
    if (bSnap.exists()) {
      targetBusiness = { id: bSnap.id, ...bSnap.data() } as Business;
    }
  } catch (err) {
    console.warn('Error fetching business for review notification:', err);
  }

  // 2. Fallback to initialBusinesses
  if (!targetBusiness) {
    targetBusiness = initialBusinesses.find(b => b.id === businessId) || null;
  }

  if (!targetBusiness) return;

  // 3. Opt-out check: If business has disabled email notifications, do not send!
  if (targetBusiness.emailNotifications === false) {
    console.log(`[ReviewNotification] Business "${targetBusiness.name}" has opted out of email notifications. Skipping.`);
    return;
  }

  const targetEmail = targetBusiness.ownerEmail || targetBusiness.email || targetBusiness.contactPerson?.email;
  const isOwnerKnown = !!targetEmail;
  const destinationEmail = targetEmail || 'info@sichtbar-online.com';
  const isClaimed = !!(targetBusiness.ownerId || targetBusiness.ownerEmail);
  const isNl = lang === 'nl';

  const businessSlug = getBusinessPath(targetBusiness, lang).replace(/^\//, '');
  const profileUrl = `https://www.winterberg-verzeichnis.de/${businessSlug}`;
  const unsubscribeUrl = `https://www.winterberg-verzeichnis.de/abmelden?b=${encodeURIComponent(businessId)}`;

  const starsHtml = '★'.repeat(Math.min(5, Math.max(1, review.rating))) + '☆'.repeat(Math.max(0, 5 - review.rating));

  const claimCtaHtml = !isClaimed ? (isNl ? `
    <div style="background-color: #FAF8F5; border: 1px solid #EDE8E0; border-left: 4px solid #F2761B; border-radius: 6px; padding: 16px; margin: 24px 0;">
      <p style="margin: 0 0 6px 0; font-size: 14px; font-weight: bold; color: #0F4C2E;">
        💡 Bent u de eigenaar van ${escapeHtml(targetBusiness.name)}?
      </p>
      <p style="margin: 0 0 12px 0; font-size: 13px; color: #5F6B63; line-height: 1.5;">
        Uw vermelding in het <strong>Winterberg Verzeichnis</strong> is momenteel nog niet geclaimd. Claim uw vermelding gratis om officiële antwoorden op beoordelingen te geven en uw gegevens te beheren.
      </p>
      <a href="${profileUrl}?claim=true" style="background-color: #F2761B; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 6px; font-size: 13px; font-weight: bold; display: inline-block;">
        Vermelding nu gratis claimen &rarr;
      </a>
    </div>
  ` : `
    <div style="background-color: #FAF8F5; border: 1px solid #EDE8E0; border-left: 4px solid #F2761B; border-radius: 6px; padding: 16px; margin: 24px 0;">
      <p style="margin: 0 0 6px 0; font-size: 14px; font-weight: bold; color: #0F4C2E;">
        💡 Sie sind Inhaber von ${escapeHtml(targetBusiness.name)}?
      </p>
      <p style="margin: 0 0 12px 0; font-size: 13px; color: #5F6B63; line-height: 1.5;">
        Ihr Eintrag im <strong>Winterberg Verzeichnis</strong> ist aktuell noch nicht beansprucht. Übernehmen Sie Ihr Profil kostenlos, um offizielle Antworten auf Bewertungen zu verfassen und Ihre Kontaktdaten selbst zu pflegen.
      </p>
      <a href="${profileUrl}?claim=true" style="background-color: #F2761B; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 6px; font-size: 13px; font-weight: bold; display: inline-block;">
        Eintrag jetzt kostenlos übernehmen &rarr;
      </a>
    </div>
  `) : '';

  const subject = isNl
    ? `Nieuwe beoordeling voor ${targetBusiness.name} (${review.rating} sterren) - Winterberg Verzeichnis`
    : `Neue Kundenbewertung für ${targetBusiness.name} (${review.rating} Sterne) - Das Winterberg Verzeichnis`;

  const html = isNl ? `
    <div style="font-family: Arial, sans-serif; color: #1B211D; line-height: 1.5; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #EDE8E0; border-radius: 8px;">
      <h2 style="color: #0F4C2E; margin-top: 0;">Nieuwe beoordeling ontvangen</h2>
      <p>Hallo ${escapeHtml(targetBusiness.name)},</p>
      <p>een bezoeker heeft een nieuwe beoordeling geplaatst op het <strong>Winterberg Verzeichnis</strong>:</p>
      
      <div style="background-color: #FAF8F5; border-left: 4px solid #F2761B; padding: 14px 18px; margin: 18px 0; border-radius: 4px;">
        <div style="color: #F2761B; font-size: 18px; letter-spacing: 2px; margin-bottom: 6px;">${starsHtml} (${review.rating}/5)</div>
        ${review.text ? `<p style="margin: 0; font-size: 15px; color: #1B211D; font-style: italic;">„${escapeHtml(review.text)}“</p>` : `<p style="margin: 0; font-size: 13px; color: #8A928B; font-style: italic;">(Sterne-Bewertung ohne Textbericht)</p>`}
        <p style="margin: 8px 0 0 0; font-size: 12px; color: #5F6B63;">Gegeven door: ${escapeHtml(review.authorName || 'Bezoeker')}</p>
      </div>

      <p>U kunt de beoordeling direct op uw profiel bekijken:</p>

      <div style="margin: 22px 0;">
        <a href="${profileUrl}#bewertungen" style="background-color: #0F4C2E; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold; display: inline-block;">
          Beoordeling bekijken &rarr;
        </a>
      </div>

      ${claimCtaHtml}

      <hr style="border: 0; border-top: 1px solid #EDE8E0; margin: 25px 0;" />
      <p style="font-size: 11px; color: #8A928B; line-height: 1.4;">
        Deze e-mail is automatisch verzonden door Winterberg Verzeichnis.<br />
        Wilt u geen automatische e-mailmeldingen meer ontvangen voor dit profiel? 
        <a href="${unsubscribeUrl}" style="color: #5F6B63; text-decoration: underline;">Hier met één klik uitschakelen</a>.
      </p>
    </div>
  ` : `
    <div style="font-family: Arial, sans-serif; color: #1B211D; line-height: 1.5; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #EDE8E0; border-radius: 8px;">
      <h2 style="color: #0F4C2E; margin-top: 0;">Neue Kundenbewertung eingegangen</h2>
      <p>Hallo ${escapeHtml(targetBusiness.name)},</p>
      <p>ein Besucher hat im <strong>Winterberg Verzeichnis</strong> eine neue Bewertung zu Ihrem Unternehmen abgegeben:</p>
      
      <div style="background-color: #FAF8F5; border-left: 4px solid #F2761B; padding: 14px 18px; margin: 18px 0; border-radius: 4px;">
        <div style="color: #F2761B; font-size: 18px; letter-spacing: 2px; margin-bottom: 6px;">${starsHtml} (${review.rating}/5 Sterne)</div>
        ${review.text ? `<p style="margin: 0; font-size: 15px; color: #1B211D; font-style: italic;">„${escapeHtml(review.text)}“</p>` : `<p style="margin: 0; font-size: 13px; color: #8A928B; font-style: italic;">(Sterne-Bewertung ohne Textbericht)</p>`}
        <p style="margin: 8px 0 0 0; font-size: 12px; color: #5F6B63;">Verfasst von: ${escapeHtml(review.authorName || 'Besucher')}</p>
      </div>

      <p>Sie können die Bewertung direkt auf Ihrem Profil einsehen:</p>

      <div style="margin: 22px 0;">
        <a href="${profileUrl}#bewertungen" style="background-color: #0F4C2E; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold; display: inline-block;">
          Bewertung auf Profil aufrufen &rarr;
        </a>
      </div>

      ${claimCtaHtml}

      <hr style="border: 0; border-top: 1px solid #EDE8E0; margin: 25px 0;" />
      <p style="font-size: 11px; color: #8A928B; line-height: 1.4;">
        Diese E-Mail wurde automatisch vom Winterberg Verzeichnis (winterberg-verzeichnis.de) versendet.<br />
        Sie möchten keine automatischen E-Mail-Benachrichtigungen mehr für diesen Eintrag erhalten? 
        <a href="${unsubscribeUrl}" style="color: #5F6B63; text-decoration: underline;">Hier mit einem Klick abmelden</a>.
      </p>
    </div>
  `;

  await sendNotificationEmail({
    to: destinationEmail,
    bcc: isOwnerKnown ? 'info@sichtbar-online.com' : undefined,
    subject,
    html
  });
}
