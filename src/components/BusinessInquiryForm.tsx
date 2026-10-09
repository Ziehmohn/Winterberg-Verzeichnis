import React, { useState } from 'react';
import { Mail, Send, CheckCircle2, AlertCircle, Loader2, Sparkles } from 'lucide-react';
import { Business } from '../types';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';

interface BusinessInquiryFormProps {
  business: Business;
  lang: 'de' | 'nl';
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export default function BusinessInquiryForm({ business, lang }: BusinessInquiryFormProps) {
  const isNl = lang === 'nl';
  const targetEmail = business.email || business.contactPerson?.email || business.ownerEmail;

  // Only render for Premium businesses with an email address configured
  if (!business.isPremium || !targetEmail) {
    return null;
  }

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [sendCopy, setSendCopy] = useState(false);
  const [honeypot, setHoneypot] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Honeypot spam protection
    if (honeypot) {
      setIsSuccess(true);
      return;
    }

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedPhone = phone.trim();
    const trimmedMessage = message.trim();

    if (!trimmedName || !trimmedEmail || !trimmedMessage) {
      setErrorMessage(
        isNl
          ? 'Vul alstublieft uw naam, e-mailadres en bericht in.'
          : 'Bitte füllen Sie Name, E-Mail-Adresse und Ihre Nachricht aus.'
      );
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setErrorMessage(
        isNl
          ? 'Vul een geldig e-mailadres in.'
          : 'Bitte geben Sie eine gültige E-Mail-Adresse ein.'
      );
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    const subject = isNl
      ? `Nieuwe aanvraag van ${trimmedName} via Winterberg Verzeichnis`
      : `Neue Kundenanfrage von ${trimmedName} über das Winterberg Verzeichnis`;

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Neue Kundenanfrage</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #F7F5F0; margin: 0; padding: 24px; color: #1B211D;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #EDE8E0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(27,33,29,0.06);">
    <!-- Header -->
    <div style="background-color: #0F4C2E; padding: 24px 30px; text-align: left;">
      <span style="color: #F2761B; font-size: 11px; font-weight: bold; letter-spacing: 0.15em; text-transform: uppercase; display: block; margin-bottom: 4px;">Winterberg Verzeichnis</span>
      <h1 style="color: #ffffff; font-size: 20px; font-weight: 700; margin: 0; line-height: 1.3;">
        ${isNl ? 'Nieuwe klantenaanvraag ontvangen' : 'Neue Kundenanfrage erhalten'}
      </h1>
    </div>

    <!-- Body -->
    <div style="padding: 28px 30px;">
      <p style="font-size: 15px; line-height: 1.6; margin: 0 0 16px 0; color: #1B211D;">
        ${isNl ? `Hallo <strong>${escapeHtml(business.name)}</strong>,` : `Hallo <strong>${escapeHtml(business.name)}</strong>,`}
      </p>
      <p style="font-size: 14px; line-height: 1.6; margin: 0 0 20px 0; color: #4A544D;">
        ${isNl
          ? `Via uw profiel op het <strong>Winterberg Verzeichnis</strong> heeft een bezoeker direct contact met u opgenomen:`
          : `über Ihr Premium-Profil im <strong>Winterberg Verzeichnis</strong> ist eine neue Direkt-Anfrage eingegangen:`}
      </p>

      <!-- Details Box -->
      <div style="background-color: #FAF8F5; border: 1px solid #EDE8E0; border-radius: 8px; padding: 16px 20px; margin-bottom: 22px;">
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr>
            <td style="padding: 6px 0; color: #5F6B63; width: 110px; font-weight: 600;">${isNl ? 'Afzender:' : 'Absender:'}</td>
            <td style="padding: 6px 0; color: #1B211D; font-weight: 600;">${escapeHtml(trimmedName)}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #5F6B63; font-weight: 600;">E-Mail:</td>
            <td style="padding: 6px 0; color: #0F4C2E; font-weight: 600;">
              <a href="mailto:${escapeHtml(trimmedEmail)}" style="color: #0F4C2E; text-decoration: underline;">${escapeHtml(trimmedEmail)}</a>
            </td>
          </tr>
          ${trimmedPhone ? `
          <tr>
            <td style="padding: 6px 0; color: #5F6B63; font-weight: 600;">${isNl ? 'Telefoon:' : 'Telefon:'}</td>
            <td style="padding: 6px 0; color: #1B211D;">
              <a href="tel:${escapeHtml(trimmedPhone)}" style="color: #1B211D; text-decoration: none;">${escapeHtml(trimmedPhone)}</a>
            </td>
          </tr>
          ` : ''}
          <tr>
            <td style="padding: 6px 0; color: #5F6B63; font-weight: 600;">${isNl ? 'Datum:' : 'Datum:'}</td>
            <td style="padding: 6px 0; color: #5F6B63;">${new Date().toLocaleString(isNl ? 'nl-NL' : 'de-DE', { dateStyle: 'medium', timeStyle: 'short' })} Uhr</td>
          </tr>
        </table>
      </div>

      <!-- Message Content -->
      <div style="margin-bottom: 24px;">
        <div style="font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #5F6B63; margin-bottom: 8px;">
          ${isNl ? 'Bericht:' : 'Nachricht:'}
        </div>
        <div style="background-color: #FFFFFF; border-left: 4px solid #0F4C2E; border-top: 1px solid #EDE8E0; border-right: 1px solid #EDE8E0; border-bottom: 1px solid #EDE8E0; border-radius: 0 8px 8px 0; padding: 16px 20px; font-size: 14.5px; line-height: 1.6; color: #1B211D; white-space: pre-wrap;">
${escapeHtml(trimmedMessage)}
        </div>
      </div>

      <!-- Action Button -->
      <div style="text-align: center; margin: 26px 0 10px 0;">
        <a href="mailto:${escapeHtml(trimmedEmail)}?subject=${encodeURIComponent(isNl ? `Re: Uw aanvraag bij ${business.name}` : `Re: Ihre Anfrage bei ${business.name}`)}" style="display: inline-block; background-color: #0F4C2E; color: #ffffff; text-decoration: none; padding: 12px 26px; border-radius: 6px; font-weight: 600; font-size: 14px; box-shadow: 0 2px 6px rgba(15,76,46,0.2);">
          ${isNl ? 'Direct per e-mail beantwoorden &rarr;' : 'Direkt per E-Mail antworten &rarr;'}
        </a>
      </div>
      <p style="text-align: center; font-size: 12px; color: #8A958E; margin-top: 8px;">
        ${isNl ? '(U kunt ook eenvoudig rechtstreeks op deze e-mail antwoorden)' : '(Sie können auch einfach auf diese E-Mail antworten)'}
      </p>
    </div>

    <!-- Footer -->
    <div style="background-color: #FAF8F5; border-top: 1px solid #EDE8E0; padding: 16px 30px; font-size: 11.5px; color: #8A928B; line-height: 1.5;">
      ${isNl
        ? `Dit bericht is verzonden via het contactformulier op uw profiel op <a href="https://www.winterberg-verzeichnis.de" style="color: #5F6B63; text-decoration: underline;">winterberg-verzeichnis.de</a>.`
        : `Diese Nachricht wurde über das Kontaktformular Ihres Profils auf <a href="https://www.winterberg-verzeichnis.de" style="color: #5F6B63; text-decoration: underline;">winterberg-verzeichnis.de</a> übermittelt.`}
    </div>
  </div>
</body>
</html>
`;

    try {
      // 1. Dispatch email via /api/send-mail
      const res = await fetch('/api/send-mail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: targetEmail,
          subject,
          html: htmlContent,
          replyTo: trimmedEmail,
          cc: sendCopy ? trimmedEmail : undefined,
          bcc: 'info@sichtbar-online.com'
        })
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Fehler beim Senden der E-Mail.');
      }

      // 2. Log in Firestore for backup/audit
      try {
        await addDoc(collection(db, 'business_inquiries'), {
          businessId: business.id,
          businessName: business.name,
          recipientEmail: targetEmail,
          senderName: trimmedName,
          senderEmail: trimmedEmail,
          senderPhone: trimmedPhone || null,
          message: trimmedMessage,
          sendCopy,
          lang,
          createdAt: new Date().toISOString(),
          status: 'sent'
        });
      } catch (logErr) {
        console.warn('Could not log inquiry in Firestore:', logErr);
      }

      setIsSuccess(true);
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
      setSendCopy(false);
    } catch (err: any) {
      console.error('Error sending direct business inquiry:', err);
      setErrorMessage(
        isNl
          ? 'Het verzenden van uw aanvraag is mislukt. Probeer het later opnieuw of bel het bedrijf direct.'
          : 'Ihre Anfrage konnte leider nicht gesendet werden. Bitte versuchen Sie es erneut oder kontaktieren Sie das Unternehmen telefonisch.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      id="business-inquiry-form"
      className="bg-white border border-[#EDE8E0] rounded-lg p-5 sm:p-6 shadow-[0_10px_30px_rgba(27,33,29,0.06)] flex flex-col gap-4"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 border-b border-[#EDE8E0] pb-3.5">
        <div>
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#F2761B] uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5 text-[#F2761B]" />
            <span>{isNl ? 'Direct contact' : 'Direktkontakt'}</span>
          </div>
          <h3 className="font-display text-[18px] font-bold text-[#1B211D] leading-tight">
            {isNl ? 'Directe aanvraag' : 'Direkte Anfrage'}
          </h3>
          <p className="text-xs text-[#5F6B63] mt-1 leading-relaxed">
            {isNl
              ? `Stuur ${business.name} direct een bericht per e-mail.`
              : `Senden Sie ${business.name} direkt eine Nachricht per E-Mail.`}
          </p>
        </div>
        <div className="w-9 h-9 rounded-full bg-[#E8F1EB] text-[#0F4C2E] flex items-center justify-center shrink-0 mt-0.5">
          <Mail className="w-4 h-4" />
        </div>
      </div>

      {isSuccess ? (
        <div className="bg-[#F4F9F5] border border-[#C5DFCE] rounded-lg p-4 text-center flex flex-col items-center gap-2.5">
          <CheckCircle2 className="w-8 h-8 text-[#0F4C2E]" />
          <div className="font-bold text-[#0F4C2E] text-[15px]">
            {isNl ? 'Aanvraag succesvol verzonden!' : 'Anfrage erfolgreich gesendet!'}
          </div>
          <p className="text-xs text-[#4A544D] leading-relaxed">
            {isNl
              ? `Uw bericht is rechtstreeks verzonden naar ${business.name}. U ontvangt zo spoedig mogelijk een reactie.`
              : `Ihre Nachricht wurde direkt an ${business.name} übermittelt. Sie erhalten in Kürze eine Rückmeldung.`}
          </p>
          <button
            type="button"
            onClick={() => setIsSuccess(false)}
            className="mt-1 text-xs text-[#0F4C2E] font-semibold underline hover:text-[#06301C] cursor-pointer"
          >
            {isNl ? 'Nog een bericht sturen' : 'Weitere Nachricht senden'}
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {/* Honeypot anti-spam field */}
          <input
            type="text"
            name="fax_check"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
            tabIndex={-1}
            autoComplete="off"
            style={{ display: 'none' }}
          />

          {errorMessage && (
            <div className="bg-[#FFF5F5] border border-[#FCD5CC] text-[#C0392B] rounded-md p-2.5 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-[#1B211D] mb-1">
              {isNl ? 'Uw naam *' : 'Ihr Name *'}
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={isNl ? 'z.B. Jan Jansen' : 'z.B. Max Mustermann'}
              className="w-full bg-[#FAF8F5] border border-[#EDE8E0] rounded-md px-3 py-2 text-[13.5px] text-[#1B211D] placeholder-[#8A958E] focus:outline-none focus:ring-2 focus:ring-[#0F4C2E]/20 focus:border-[#0F4C2E] transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1B211D] mb-1">
              {isNl ? 'Uw e-mailadres *' : 'Ihre E-Mail-Adresse *'}
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ihre-email@beispiel.de"
              className="w-full bg-[#FAF8F5] border border-[#EDE8E0] rounded-md px-3 py-2 text-[13.5px] text-[#1B211D] placeholder-[#8A958E] focus:outline-none focus:ring-2 focus:ring-[#0F4C2E]/20 focus:border-[#0F4C2E] transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1B211D] mb-1">
              {isNl ? 'Telefoonnummer (optioneel)' : 'Telefonnummer (optional)'}
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+49 ..."
              className="w-full bg-[#FAF8F5] border border-[#EDE8E0] rounded-md px-3 py-2 text-[13.5px] text-[#1B211D] placeholder-[#8A958E] focus:outline-none focus:ring-2 focus:ring-[#0F4C2E]/20 focus:border-[#0F4C2E] transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1B211D] mb-1">
              {isNl ? 'Uw bericht *' : 'Ihre Nachricht *'}
            </label>
            <textarea
              required
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={
                isNl
                  ? `Stel hier uw vraag of aanvraag aan ${business.name}...`
                  : `Stellen Sie hier Ihre Frage oder Terminanfrage an ${business.name}...`
              }
              className="w-full bg-[#FAF8F5] border border-[#EDE8E0] rounded-md px-3 py-2 text-[13.5px] text-[#1B211D] placeholder-[#8A958E] focus:outline-none focus:ring-2 focus:ring-[#0F4C2E]/20 focus:border-[#0F4C2E] transition-all resize-y"
            />
          </div>

          {/* Copy checkbox */}
          <label className="flex items-center gap-2 cursor-pointer mt-0.5">
            <input
              type="checkbox"
              checked={sendCopy}
              onChange={(e) => setSendCopy(e.target.checked)}
              className="rounded border-[#EDE8E0] text-[#0F4C2E] focus:ring-[#0F4C2E] w-3.5 h-3.5 cursor-pointer"
            />
            <span className="text-[11.5px] text-[#5F6B63] select-none">
              {isNl ? 'Kopie naar mijn e-mailadres sturen' : 'Kopie an meine E-Mail senden'}
            </span>
          </label>

          {/* Privacy Hint */}
          <p className="text-[11px] text-[#8A958E] leading-normal my-0.5">
            {isNl
              ? 'Uw gegevens worden uitsluitend doorgestuurd naar het bedrijf om uw aanvraag te beantwoorden.'
              : 'Ihre Daten werden vertraulich behandelt und direkt an das Unternehmen übermittelt.'}
          </p>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#0F4C2E] hover:bg-[#06301C] text-white py-2.5 px-4 rounded-md font-semibold text-[14px] flex items-center justify-center gap-2 shadow-xs transition-all duration-150 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed mt-1"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{isNl ? 'Wordt verzonden...' : 'Wird gesendet...'}</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>{isNl ? 'Aanvraag versturen' : 'Anfrage absenden'}</span>
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
