import React, { useState } from 'react';
import { X, Send, CheckCircle2, Megaphone, Sparkles } from 'lucide-react';
import { categories } from '../data';
import { db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';

interface AdInquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCategory?: string;
}

export default function AdInquiryModal({ isOpen, onClose, initialCategory = 'Alle' }: AdInquiryModalProps) {
  const [name, setName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [category, setCategory] = useState(initialCategory || 'Alle');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !companyName.trim() || !email.trim()) {
      setError('Bitte füllen Sie alle Pflichtfelder aus.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const inquiryId = 'inq_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 6);
    const inquiryData = {
      id: inquiryId,
      name: name.trim(),
      companyName: companyName.trim(),
      email: email.trim(),
      phone: phone.trim() || null,
      category,
      message: message.trim() || null,
      status: 'new',
      createdAt: new Date().toISOString()
    };

    try {
      await setDoc(doc(db, 'ad_inquiries', inquiryId), inquiryData);
      setIsSuccess(true);
    } catch (err: any) {
      console.error('Error submitting ad inquiry:', err);
      // Fallback: Store locally in localStorage if Firestore is offline
      try {
        const stored = JSON.parse(localStorage.getItem('local_ad_inquiries') || '[]');
        stored.push(inquiryData);
        localStorage.setItem('local_ad_inquiries', JSON.stringify(stored));
        setIsSuccess(true);
      } catch (localErr) {
        setError('Fehler beim Absenden der Anfrage. Bitte versuchen Sie es später erneut oder kontaktieren Sie uns direkt.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setName('');
    setCompanyName('');
    setEmail('');
    setPhone('');
    setMessage('');
    setIsSuccess(false);
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div 
        className="bg-white rounded-[24px] max-w-[560px] w-full p-6 md:p-8 shadow-2xl border border-[#EDE8E0] relative my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={resetForm}
          className="absolute top-5 right-5 p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
          title="Schließen"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          <div className="py-8 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h3 className="font-display text-2xl font-bold text-gray-900 mb-2">Vielen Dank für Ihre Anfrage!</h3>
            <p className="text-[#5F6B63] max-w-[42ch] mb-6 text-[15px] leading-relaxed">
              Wir haben Ihre Anfrage für eine Skyscraper-Bannerplatzierung erhalten und melden uns in Kürze mit allen Details und Konditionen bei Ihnen.
            </p>
            <button
              type="button"
              onClick={resetForm}
              className="bg-[#0F4C2E] hover:bg-[#06301C] text-white font-semibold px-8 py-3 rounded-full transition-colors"
            >
              Fertig
            </button>
          </div>
        ) : (
          <div>
            {/* Header */}
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-[#FFF1E4] text-[#D65F0C] flex items-center justify-center shrink-0">
                <Megaphone className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[12px] font-bold uppercase tracking-wider text-[#D65F0C] flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> Werbeplatzierung
                </span>
                <h2 className="font-display text-2xl font-bold text-gray-900 leading-tight">
                  Skyscraper-Banner buchen
                </h2>
              </div>
            </div>

            <p className="text-[14.5px] text-[#5F6B63] mb-6 leading-relaxed">
              Präsentieren Sie Ihr Unternehmen exklusiv als auffälliger Skyscraper-Banner in den passenden Kategorien des Winterberg Verzeichnisses.
            </p>

            {error && (
              <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                    Ihr Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Max Mustermann"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-[#E7E2DA] rounded-xl px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-[#0F4C2E] focus:bg-white transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                    Unternehmen / Betrieb <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Muster GmbH"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-[#E7E2DA] rounded-xl px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-[#0F4C2E] focus:bg-white transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                    E-Mail-Adresse <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="kontakt@musterbetrieb.de"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-[#E7E2DA] rounded-xl px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-[#0F4C2E] focus:bg-white transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                    Telefonnummer
                  </label>
                  <input
                    type="tel"
                    placeholder="02981 123456"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-[#E7E2DA] rounded-xl px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-[#0F4C2E] focus:bg-white transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Gewünschte Kategorie
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-[#E7E2DA] rounded-xl px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-[#0F4C2E] focus:bg-white transition-colors"
                >
                  <option value="Alle">Alle Kategorien (Gesamtes Verzeichnis)</option>
                  {categories.map((cat) => (
                    <option key={cat.name} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Ihre Nachricht / Wunsch-Laufzeit (optional)
                </label>
                <textarea
                  rows={3}
                  placeholder="z. B. 3 Monate Laufzeit ab kommenden Monat, Verlinkung auf unsere Website..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-[#E7E2DA] rounded-xl p-3 text-sm text-gray-900 focus:outline-none focus:border-[#0F4C2E] focus:bg-white transition-colors"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-5 py-2.5 rounded-full border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Abbrechen
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[#0F4C2E] hover:bg-[#06301C] text-white text-sm font-semibold px-6 py-2.5 rounded-full inline-flex items-center gap-2 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? (
                    'Wird gesendet...'
                  ) : (
                    <>
                      <Send className="w-4 h-4" /> Unverbindlich anfragen
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}