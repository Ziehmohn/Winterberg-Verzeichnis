import React, { useState, useEffect } from 'react';
import { X, Send, CheckCircle2, Megaphone, Sparkles, Check, Info, ShieldCheck, Tag } from 'lucide-react';
import { categories } from '../data';
import { db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';

interface AdInquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCategory?: string;
}

export default function AdInquiryModal({ isOpen, onClose, initialCategory = 'Alle' }: AdInquiryModalProps) {
  const allCategoryNames = categories.map((c) => c.name);

  const [name, setName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(() => {
    if (!initialCategory || initialCategory === 'Alle') {
      return [allCategoryNames[0] || 'Gastronomie'];
    }
    return [initialCategory];
  });
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sync initialCategory when modal opens
  useEffect(() => {
    if (initialCategory && initialCategory !== 'Alle') {
      setSelectedCategories([initialCategory]);
    }
  }, [initialCategory]);

  if (!isOpen) return null;

  const toggleCategory = (catName: string) => {
    if (selectedCategories.includes(catName)) {
      if (selectedCategories.length > 1) {
        setSelectedCategories(selectedCategories.filter((c) => c !== catName));
      }
    } else {
      setSelectedCategories([...selectedCategories, catName]);
    }
  };

  const selectAllCategories = () => {
    if (selectedCategories.length === allCategoryNames.length) {
      setSelectedCategories([allCategoryNames[0]]);
    } else {
      setSelectedCategories([...allCategoryNames]);
    }
  };

  // Pricing calculation
  const categoryCount = selectedCategories.length;
  let pricePerCategory = 24.95;
  let discountLabel = '';

  if (categoryCount >= 5) {
    pricePerCategory = 14.95;
    discountLabel = '40 % Staffelrabatt';
  } else if (categoryCount >= 3) {
    pricePerCategory = 19.95;
    discountLabel = '20 % Staffelrabatt';
  }

  const totalMonthlyPrice = (categoryCount * pricePerCategory).toFixed(2).replace('.', ',');
  const regularTotal = (categoryCount * 24.95).toFixed(2).replace('.', ',');
  const monthlySavings = (categoryCount * 24.95 - categoryCount * pricePerCategory).toFixed(2).replace('.', ',');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !companyName.trim() || !email.trim()) {
      setError('Bitte füllen Sie alle Pflichtfelder aus.');
      return;
    }

    if (selectedCategories.length === 0) {
      setError('Bitte wählen Sie mindestens eine Kategorie aus.');
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
      categories: selectedCategories,
      categoryCount,
      pricePerCategory,
      totalMonthlyPrice: parseFloat(totalMonthlyPrice.replace(',', '.')),
      message: message.trim() || null,
      status: 'new',
      createdAt: new Date().toISOString()
    };

    try {
      await setDoc(doc(db, 'ad_inquiries', inquiryId), inquiryData);
      setIsSuccess(true);
    } catch (err: any) {
      console.error('Error submitting ad inquiry:', err);
      // Fallback: Store locally in localStorage
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
        className="bg-white rounded-[24px] max-w-[620px] w-full p-6 md:p-8 shadow-2xl border border-[#EDE8E0] relative my-6 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={resetForm}
          className="absolute top-5 right-5 p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors z-10"
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
            <p className="text-[#5F6B63] max-w-[46ch] mb-4 text-[15px] leading-relaxed">
              Wir haben Ihre Anfrage für {categoryCount} Kategorie{categoryCount > 1 ? 'n' : ''} ({selectedCategories.join(', ')}) erhalten und melden uns zeitnah bei Ihnen.
            </p>
            <div className="bg-[#FAF8F5] border border-[#E7E2DA] rounded-xl p-4 text-xs text-[#5F6B63] max-w-[46ch] mb-6 text-left space-y-1">
              <div><strong>Geschätzter Monatspreis:</strong> {totalMonthlyPrice} € netto / Monat</div>
              <div><strong>Kündigungsfrist:</strong> 14 Tage zum Monatsende (wie Premium-Account)</div>
            </div>
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
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-[#FFF1E4] text-[#D65F0C] flex items-center justify-center shrink-0">
                <Megaphone className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#D65F0C] flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Exklusive Werbeplatzierung
                </span>
                <h2 className="font-display text-2xl font-bold text-gray-900 leading-tight">
                  Skyscraper-Banner buchen
                </h2>
              </div>
            </div>

            <p className="text-[13.5px] text-[#5F6B63] mb-4 leading-relaxed">
              Präsentieren Sie Ihr Unternehmen auffällig am rechten Rand neben den Einträgen — sticky mitlaufend bei allen Besuchern.
            </p>

            {/* Pricing Staffelung Table / Banner */}
            <div className="bg-[#FAF8F5] border border-[#E7E2DA] rounded-[18px] p-3.5 mb-5">
              <div className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-[#F2761B]" /> Staffelpreise pro Kategorie (monatlich):
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className={`p-2.5 rounded-xl border transition-colors ${categoryCount < 3 ? 'bg-white border-[#0F4C2E] shadow-sm font-semibold' : 'bg-white/60 border-[#EDE8E0] text-gray-600'}`}>
                  <div className="text-[11px] text-[#8A928B]">1 - 2 Kategorien</div>
                  <div className="text-[15px] font-bold text-[#0F4C2E] mt-0.5">24,95 €</div>
                  <div className="text-[10px] text-gray-500">/ Kat. / Monat</div>
                </div>

                <div className={`p-2.5 rounded-xl border transition-colors relative ${categoryCount >= 3 && categoryCount < 5 ? 'bg-white border-[#F2761B] shadow-sm font-semibold' : 'bg-white/60 border-[#EDE8E0] text-gray-600'}`}>
                  <div className="text-[11px] text-[#8A928B]">Ab 3 Kategorien</div>
                  <div className="text-[15px] font-bold text-[#D65F0C] mt-0.5">19,95 €</div>
                  <div className="text-[10px] text-emerald-700 font-bold">20 % sparen</div>
                </div>

                <div className={`p-2.5 rounded-xl border transition-colors relative ${categoryCount >= 5 ? 'bg-white border-[#0F4C2E] shadow-sm font-semibold' : 'bg-white/60 border-[#EDE8E0] text-gray-600'}`}>
                  <div className="text-[11px] text-[#8A928B]">Ab 5 Kategorien</div>
                  <div className="text-[15px] font-bold text-[#0F4C2E] mt-0.5">14,95 €</div>
                  <div className="text-[10px] text-emerald-700 font-bold">40 % sparen</div>
                </div>
              </div>
            </div>

            {/* Category Selection Checklist */}
            <div className="mb-5">
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                  Kategorien auswählen ({selectedCategories.length} gewählt) <span className="text-red-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={selectAllCategories}
                  className="text-xs font-semibold text-[#0F4C2E] hover:underline"
                >
                  {selectedCategories.length === allCategoryNames.length ? 'Auswahl aufheben' : 'Alle 6 Kategorien wählen'}
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {allCategoryNames.map((catName) => {
                  const isSelected = selectedCategories.includes(catName);
                  return (
                    <button
                      key={catName}
                      type="button"
                      onClick={() => toggleCategory(catName)}
                      className={`p-2.5 rounded-xl border text-left text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#0F4C2E] text-white border-[#0F4C2E] shadow-sm'
                          : 'bg-[#FAF8F5] text-gray-700 border-[#E7E2DA] hover:border-[#0F4C2E]/40'
                      }`}
                    >
                      <span className="truncate pr-1">{catName}</span>
                      <div className={`w-4 h-4 rounded-md flex items-center justify-center shrink-0 border ${isSelected ? 'bg-white text-[#0F4C2E] border-white' : 'border-gray-300'}`}>
                        {isSelected && <Check className="w-3 h-3" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Dynamic Calculated Summary */}
            <div className="bg-gradient-to-r from-[#0F4C2E]/10 to-[#F2761B]/10 border border-[#0F4C2E]/20 rounded-2xl p-4 mb-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <div className="text-xs font-bold text-gray-800">
                  {categoryCount} Kategorie{categoryCount > 1 ? 'n' : ''} ausgewählt ({pricePerCategory.toFixed(2).replace('.', ',')} € / Kat.)
                </div>
                <div className="text-[11.5px] text-[#5F6B63] mt-0.5">
                  Kündigungsfrist: 14 Tage zum Monatsende (wie Premium-Account)
                </div>
              </div>
              <div className="text-right sm:shrink-0">
                <div className="text-[20px] font-bold text-[#0F4C2E]">
                  {totalMonthlyPrice} € <span className="text-xs text-gray-600 font-normal">/ Monat netto</span>
                </div>
                {discountLabel && (
                  <div className="text-[11px] font-bold text-[#D65F0C]">
                    ✓ {discountLabel} (Sie sparen {monthlySavings} €/Mo.)
                  </div>
                )}
              </div>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                    Ihr Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Max Mustermann"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-[#E7E2DA] rounded-xl px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-[#0F4C2E] focus:bg-white transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                    Unternehmen / Betrieb <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Muster GmbH"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-[#E7E2DA] rounded-xl px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-[#0F4C2E] focus:bg-white transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                    E-Mail-Adresse <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="kontakt@musterbetrieb.de"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-[#E7E2DA] rounded-xl px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-[#0F4C2E] focus:bg-white transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                    Telefonnummer
                  </label>
                  <input
                    type="tel"
                    placeholder="02981 123456"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-[#E7E2DA] rounded-xl px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-[#0F4C2E] focus:bg-white transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                  Ihre Nachricht / Sonderwünsche (optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="z. B. Start ab kommenden Monat, Verlinkung auf unser neues Menü..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-[#E7E2DA] rounded-xl p-2.5 text-sm text-gray-900 focus:outline-none focus:border-[#0F4C2E] focus:bg-white transition-colors"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 rounded-full border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Abbrechen
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[#0F4C2E] hover:bg-[#06301C] text-white text-xs font-semibold px-6 py-2.5 rounded-full inline-flex items-center gap-2 transition-colors disabled:opacity-50 shadow-md"
                >
                  {isSubmitting ? (
                    'Wird gesendet...'
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" /> Unverbindlich anfragen ({totalMonthlyPrice} €/Mo.)
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