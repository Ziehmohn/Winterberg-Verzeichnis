import React, { useState } from 'react';
import { ShieldCheck, Sparkles, Check, Building2, User, Mail, Phone, FileText, ArrowRight, X } from 'lucide-react';
import { Business } from '../types';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';

interface ClaimBusinessModalProps {
  business: Business;
  currentUser: any;
  isOpen: boolean;
  onClose: () => void;
  onStartPremiumCheckout: () => void;
  isLoadingCheckout: boolean;
  lang?: 'de' | 'nl';
}

export default function ClaimBusinessModal({
  business,
  currentUser,
  isOpen,
  onClose,
  onStartPremiumCheckout,
  isLoadingCheckout,
  lang = 'de'
}: ClaimBusinessModalProps) {
  const [activePlan, setActivePlan] = useState<'basic' | 'premium'>('basic');
  const [applicantName, setApplicantName] = useState(currentUser?.displayName || '');
  const [applicantEmail, setApplicantEmail] = useState(currentUser?.email || '');
  const [applicantPhone, setApplicantPhone] = useState('');
  const [proofNote, setProofNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmitBasicClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicantName || !applicantEmail) {
      alert('Bitte füllen Sie mindestens Name und E-Mail-Adresse aus.');
      return;
    }

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'claims'), {
        businessId: business.id,
        businessName: business.name,
        businessCategory: business.category,
        applicantName,
        applicantEmail,
        applicantPhone,
        proofNote,
        userId: currentUser?.uid || null,
        status: 'pending',
        type: 'basic',
        createdAt: new Date().toISOString()
      });
      setSubmitSuccess(true);
    } catch (err) {
      console.error('Error submitting claim:', err);
      alert('Fehler beim Absenden der Anfrage. Bitte versuchen Sie es erneut.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl border border-[#EDE8E0] overflow-hidden my-8 relative">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors z-10"
          aria-label="Schließen"
        >
          <X className="w-5 h-5" />
        </button>

        {submitSuccess ? (
          <div className="p-8 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-emerald-100 text-[#0F4C2E] rounded-full flex items-center justify-center mb-4">
              <Check className="w-8 h-8" />
            </div>
            <h3 className="font-display text-2xl font-bold text-[#1B211D] mb-2">
              Übernahme-Anfrage erfolgreich eingereicht!
            </h3>
            <p className="text-[#4A544D] max-w-md mb-6 leading-relaxed">
              Vielen Dank für Ihre Verifizierungsanfrage für <strong>{business.name}</strong>. Unser Team prüft Ihre Daten kurzfristig. Nach der Freischaltung erhalten Sie eine Bestätigung per E-Mail an <strong>{applicantEmail}</strong>.
            </p>
            <button
              onClick={onClose}
              className="bg-[#0F4C2E] text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-[#06301C] transition-colors"
            >
              Verstanden & Schließen
            </button>
          </div>
        ) : (
          <div className="p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#0F4C2E] flex items-center justify-center border border-emerald-200">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h2 className="font-display text-[22px] font-bold text-[#1B211D] leading-tight">
                  Unternehmen übernehmen
                </h2>
                <div className="text-[13.5px] text-[#5F6B63]">
                  Offizieller Inhaberzugriff für <strong>{business.name}</strong>
                </div>
              </div>
            </div>

            {/* Plan Switcher (Tabs) */}
            <div className="grid grid-cols-2 gap-3 my-6 p-1.5 bg-[#FAF8F5] border border-[#E7E2DA] rounded-xl">
              <button
                type="button"
                onClick={() => setActivePlan('basic')}
                className={`py-2.5 px-4 rounded-lg font-semibold text-[14px] transition-all flex items-center justify-center gap-2 ${
                  activePlan === 'basic'
                    ? 'bg-white text-[#0F4C2E] shadow-sm border border-[#E7E2DA]'
                    : 'text-[#5F6B63] hover:text-[#1B211D]'
                }`}
              >
                <Building2 className="w-4 h-4" />
                <span>Kostenloser Basiseintrag</span>
              </button>

              <button
                type="button"
                onClick={() => setActivePlan('premium')}
                className={`py-2.5 px-4 rounded-lg font-semibold text-[14px] transition-all flex items-center justify-center gap-2 ${
                  activePlan === 'premium'
                    ? 'bg-gradient-to-r from-[#F2761B] to-[#D65F0C] text-white shadow-sm'
                    : 'text-[#5F6B63] hover:text-[#1B211D]'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>Premium-Eintrag</span>
              </button>
            </div>

            {/* Tab 1: Free Basic Claim */}
            {activePlan === 'basic' && (
              <form onSubmit={handleSubmitBasicClaim} className="space-y-4">
                <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-xl text-[13px] text-[#0F4C2E] flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong>Kostenlos & dauerhaft gebührenfrei:</strong> Übernehmen Sie die Kontrolle über Adressdaten, Telefonnummer und Öffnungszeiten. Zur Verifizierung benötigen wir Ihre geschäftlichen Kontaktdaten.
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-[13px] font-semibold text-[#1B211D] mb-1">
                      Ihr Name *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 absolute left-3 top-3 text-[#8A928B]" />
                      <input
                        type="text"
                        required
                        value={applicantName}
                        onChange={(e) => setApplicantName(e.target.value)}
                        placeholder="Vor- und Nachname"
                        className="w-full pl-9 pr-3 py-2 border border-[#E7E2DA] rounded-lg text-[14px] focus:outline-none focus:border-[#0F4C2E]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[13px] font-semibold text-[#1B211D] mb-1">
                      Geschäftliche E-Mail *
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3 top-3 text-[#8A928B]" />
                      <input
                        type="email"
                        required
                        value={applicantEmail}
                        onChange={(e) => setApplicantEmail(e.target.value)}
                        placeholder="ihre-email@firma.de"
                        className="w-full pl-9 pr-3 py-2 border border-[#E7E2DA] rounded-lg text-[14px] focus:outline-none focus:border-[#0F4C2E]"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-[13px] font-semibold text-[#1B211D] mb-1">
                      Telefonnummer (für Rückfragen)
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 absolute left-3 top-3 text-[#8A928B]" />
                      <input
                        type="tel"
                        value={applicantPhone}
                        onChange={(e) => setApplicantPhone(e.target.value)}
                        placeholder="z. B. 02981 12345"
                        className="w-full pl-9 pr-3 py-2 border border-[#E7E2DA] rounded-lg text-[14px] focus:outline-none focus:border-[#0F4C2E]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[13px] font-semibold text-[#1B211D] mb-1">
                      Ihre Position im Betrieb
                    </label>
                    <input
                      type="text"
                      value={proofNote}
                      onChange={(e) => setProofNote(e.target.value)}
                      placeholder="z. B. Inhaber / Geschäftsführer"
                      className="w-full px-3 py-2 border border-[#E7E2DA] rounded-lg text-[14px] focus:outline-none focus:border-[#0F4C2E]"
                    />
                  </div>
                </div>

                <div className="pt-3 flex items-center justify-between gap-3 border-t border-[#EDE8E0]">
                  <button
                    type="button"
                    onClick={onClose}
                    className="text-[14px] text-[#5F6B63] hover:underline"
                  >
                    Abbrechen
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-[#0F4C2E] hover:bg-[#06301C] text-white px-6 py-2.5 rounded-lg font-semibold text-[14.5px] transition-colors disabled:opacity-50 flex items-center gap-2 cursor-pointer shadow-sm"
                  >
                    {isSubmitting ? 'Wird übermittelt...' : 'Kostenlos übernehmen anfragen'}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}

            {/* Tab 2: Premium Upgrade Claim */}
            {activePlan === 'premium' && (
              <div className="space-y-4">
                <div className="p-4 bg-[#FFF8F1] border border-[#FBD9BC] rounded-xl">
                  <div className="flex items-center gap-2 text-[#D65F0C] font-bold text-[15px] mb-2">
                    <Sparkles className="w-5 h-5" />
                    <span>Sofort alle Premium-Vorteile nutzen</span>
                  </div>
                  <ul className="text-[13.5px] text-[#4A544D] space-y-1.5 pl-1">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-[#F2761B]" />
                      <strong>5x mehr Sichtbarkeit:</strong> Immer ganz oben in Suchergebnissen
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-[#F2761B]" />
                      <strong>Vollständiges Branding:</strong> Eigenes Logo & Fotogalerie
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-[#F2761B]" />
                      <strong>Wertvoller DoFollow-Backlink</strong> zur Stärkung Ihrer Website
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-[#F2761B]" />
                      <strong>Stellenangebote & News:</strong> Direkt auf Winterberg-Verzeichnis veröffentlichen
                    </li>
                  </ul>
                </div>

                <div className="pt-2 flex items-center justify-between gap-3 border-t border-[#EDE8E0]">
                  <div className="text-[13px] text-[#5F6B63]">
                    Monatlich kündbar · Sofortige Freischaltung
                  </div>

                  <button
                    type="button"
                    onClick={onStartPremiumCheckout}
                    disabled={isLoadingCheckout}
                    className="bg-[#F2761B] hover:bg-[#D65F0C] text-white px-6 py-2.5 rounded-lg font-bold text-[14.5px] transition-colors disabled:opacity-50 flex items-center gap-2 cursor-pointer shadow-md"
                  >
                    {isLoadingCheckout ? 'Lade Checkout...' : 'Mit Premium übernehmen'}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
