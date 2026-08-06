import React, { useState, useEffect } from 'react';
import { useTranslation } from '../i18n';
import { ThemeConfig, Business } from '../types';
import { db } from '../firebase';
import { categories } from '../data';
import { doc, setDoc } from 'firebase/firestore';
import { CheckCircle2, ShieldCheck } from 'lucide-react';
import { useAuth } from '../AuthContext';
import Login from './Login';

export default function SubmitBusiness({ theme, activeThemeKey, onCancel }: { theme: ThemeConfig, activeThemeKey: string, onCancel: () => void }) {
  const { currentUser: user, loading } = useAuth();
  const { t } = useTranslation();
  const [formData, setFormData] = useState<Partial<Business>>({
    name: '',
    category: '',
    description: '',
    address: '',
    phone: '',
    website: '',
    email: '',
    status: 'pending'
  });
  const [selectedPlan, setSelectedPlan] = useState<'free' | 'premium'>('free');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Pre-fill email if user is logged in
  useEffect(() => {
    if (user?.email && !formData.email) {
      setFormData(prev => ({ ...prev, email: user.email || '' }));
    }
  }, [user]);

  if (loading) return <div className="p-8 text-center">Wird geladen...</div>;

  if (!user) {
    return (
      <div className="flex-1 w-full bg-[#FAF8F5]">
        <div className="text-center pt-10 px-6">
          <h2 className="text-2xl font-bold mb-2">Bitte loggen Sie sich ein</h2>
          <p className="text-[#5F6B63]">Um ein Unternehmen einzutragen, benötigen Sie ein kostenloses Konto.</p>
        </div>
        <Login theme={theme} activeThemeKey={activeThemeKey} onBack={onCancel} />
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const newId = 'b_' + Date.now().toString(36);
    const dataToSubmit = {
      ...formData,
      id: newId,
      ownerId: user?.uid || null,
      ownerEmail: user?.email || null,
      isPremium: selectedPlan === 'premium'
    };
    
    try {
      const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('Die Datenbankverbindung dauert zu lange. Bitte prüfen Sie Ihre Internetverbindung oder deaktivieren Sie ggf. Ihren Adblocker.')), 10000));
      await Promise.race([
        setDoc(doc(db, 'businesses', newId), dataToSubmit),
        timeoutPromise
      ]);
      
      if (selectedPlan === 'premium') {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000);
        
        const res = await fetch('/api/create-checkout-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ businessId: newId, email: formData.email, billingCycle }),
          signal: controller.signal
        });
        clearTimeout(timeoutId);
        
        const data = await res.json();
        if (data.url) {
          window.location.href = data.url;
          return;
        } else {
          throw new Error(data.error || 'Fehler beim Weiterleiten zu Stripe');
        }
      }
      
      setIsSuccess(true);
    } catch (err: any) {
      console.error(err);
      if (err?.code === 'permission-denied') {
        alert("Zugriff verweigert. Bitte überprüfen Sie Ihre Eingaben oder laden Sie die Seite neu.");
      } else {
        alert(t("errorOccurred") + ": " + (err?.message || ""));
      }
      setIsSubmitting(false);
    }
  };

  const inputClass = `w-full px-4 py-2 border focus:outline-none focus:ring-2 focus:border-orange-500 focus:ring-orange-500/20 transition-all bg-white ${theme.cardBorder} ${theme.textBase} ${activeThemeKey === 'modern' ? 'rounded-none' : 'rounded-md'}`;
  const labelClass = `block text-sm font-medium mb-1 ${theme.textBase}`;

  const ALL_DISTRICTS = ['Winterberg', 'Altastenberg', 'Altenfeld', 'Elkeringhausen', 'Grönebach', 'Hildfeld', 'Hoheleye', 'Langewiese', 'Lenneplätze', 'Mollseifen', 'Neuastenberg', 'Niedersfeld', 'Siedlinghausen', 'Silbach', 'Züschen'];
  const CATEGORY_NAMES = ['Handwerk', 'Gastronomie', 'Einzelhandel', 'Dienstleistungen', 'Freizeit', 'Hotels und Unterkünfte'];

  if (isSuccess) {
    return (
      <main className="flex-1 w-full max-w-[720px] mx-auto px-6 py-[54px] pb-[80px]">
        <h1 className="font-display text-[clamp(32px,5vw,48px)] font-bold mb-3.5">Unternehmen eintragen</h1>
        <div className="bg-white border border-[#EDE8E0] rounded-[22px] p-[30px] shadow-[0_10px_30px_rgba(27,33,29,0.06)]">
          <div className="bg-[#E8F1EB] rounded-[14px] p-4 text-[#0F4C2E] text-[15px]">Danke! Der Eintrag liegt jetzt zur Prüfung im Adminbereich.</div>
          <button type="button" onClick={onCancel} className="mt-4 bg-transparent border-none text-[#5F6B63] text-[13.5px] cursor-pointer hover:underline">Zurück zur Startseite</button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 w-full max-w-[720px] mx-auto px-6 py-[54px] pb-[80px]">
      <h1 className="font-display text-[clamp(32px,5vw,48px)] font-bold mb-3.5">Unternehmen eintragen</h1>
      <p className="text-[17px] leading-[1.65] text-[#4A544D] mb-[30px]">Kostenlos gelistet werden — oder mit Premium Bildergalerie, ausführliches Profil und Top-Platzierung freischalten.</p>
      
      <form onSubmit={handleSubmit} className="bg-white border border-[#EDE8E0] rounded-[22px] p-[30px] grid gap-[18px] shadow-[0_10px_30px_rgba(27,33,29,0.06)]">
        <label className="grid gap-[7px] text-[14px] font-semibold">Unternehmensname
          <input required placeholder="z. B. Café Sonnenberg" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} className="border border-[#E7E2DA] rounded-[12px] p-[13px_14px] text-[15px] font-normal bg-[#FAF8F5] focus:outline-none focus:ring-2 focus:ring-[#F2761B]" />
        </label>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[18px]">
          <label className="grid gap-[7px] text-[14px] font-semibold">Kategorie
            <select required value={formData.category || ''} onChange={e => setFormData({...formData, category: e.target.value, subcategory: ''})} className="border border-[#E7E2DA] rounded-[12px] p-[13px_14px] text-[15px] font-normal bg-[#FAF8F5] focus:outline-none focus:ring-2 focus:ring-[#F2761B]">
              <option value="">Bitte wählen...</option>
              {CATEGORY_NAMES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </label>
          
          {formData.category && categories.find(c => c.name === formData.category)?.subcategories?.length ? (
            <label className="grid gap-[7px] text-[14px] font-semibold">Unterkategorie (Optional)
              <select value={formData.subcategory || ''} onChange={e => setFormData({...formData, subcategory: e.target.value})} className="border border-[#E7E2DA] rounded-[12px] p-[13px_14px] text-[15px] font-normal bg-[#FAF8F5] focus:outline-none focus:ring-2 focus:ring-[#F2761B]">
                <option value="">Bitte wählen...</option>
                {categories.find(c => c.name === formData.category)?.subcategories.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </label>
          ) : null}

          <label className="grid gap-[7px] text-[14px] font-semibold">Ortsteil
            <select required value={formData.district || ''} onChange={e => setFormData({...formData, district: e.target.value})} className="border border-[#E7E2DA] rounded-[12px] p-[13px_14px] text-[15px] font-normal bg-[#FAF8F5] focus:outline-none focus:ring-2 focus:ring-[#F2761B]">
              <option value="">Bitte wählen...</option>
              {ALL_DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </label>
        </div>
        
        <label className="grid gap-[7px] text-[14px] font-semibold">Adresse
          <input required placeholder="Straße, PLZ Ort" value={formData.address || ''} onChange={e => setFormData({...formData, address: e.target.value})} className="border border-[#E7E2DA] rounded-[12px] p-[13px_14px] text-[15px] font-normal bg-[#FAF8F5] focus:outline-none focus:ring-2 focus:ring-[#F2761B]" />
        </label>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[18px]">
          <label className="grid gap-[7px] text-[14px] font-semibold">E-Mail
            <input type="email" placeholder="mail@example.com" value={formData.email || ''} onChange={e => setFormData({...formData, email: e.target.value})} className="border border-[#E7E2DA] rounded-[12px] p-[13px_14px] text-[15px] font-normal bg-[#FAF8F5] focus:outline-none focus:ring-2 focus:ring-[#F2761B]" />
          </label>
          <label className="grid gap-[7px] text-[14px] font-semibold">Telefon
            <input placeholder="optional" value={formData.phone || ''} onChange={e => setFormData({...formData, phone: e.target.value})} className="border border-[#E7E2DA] rounded-[12px] p-[13px_14px] text-[15px] font-normal bg-[#FAF8F5] focus:outline-none focus:ring-2 focus:ring-[#F2761B]" />
          </label>
          <label className="grid gap-[7px] text-[14px] font-semibold">Website
            <input type="url" placeholder="https://" value={formData.website || ''} onChange={e => setFormData({...formData, website: e.target.value})} className="border border-[#E7E2DA] rounded-[12px] p-[13px_14px] text-[15px] font-normal bg-[#FAF8F5] focus:outline-none focus:ring-2 focus:ring-[#F2761B]" />
          </label>
        </div>

        <label className="grid gap-[7px] text-[14px] font-semibold">Kurzbeschreibung
          <textarea required rows={4} placeholder="Was macht Ihr Unternehmen besonders?" value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} className="border border-[#E7E2DA] rounded-[12px] p-[13px_14px] text-[15px] font-normal bg-[#FAF8F5] focus:outline-none focus:ring-2 focus:ring-[#F2761B] resize-y"></textarea>
        </label>
        
        <div className="grid gap-[7px] text-[14px] font-semibold mt-2">
          Eintragstyp wählen
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[14px]">
            <div 
              onClick={() => setSelectedPlan('free')}
              className={`cursor-pointer border p-4 rounded-[12px] transition-colors ${selectedPlan === 'free' ? 'border-[#F2761B] bg-[#FFF1E4]' : 'border-[#E7E2DA] bg-[#FAF8F5] hover:border-[#F2761B]/50'}`}
            >
              <div className="flex justify-between items-start mb-1">
                <div className="font-bold">Basiseintrag</div>
                {selectedPlan === 'free' && <CheckCircle2 className="w-5 h-5 text-[#F2761B]" />}
              </div>
              <div className="font-bold text-[18px] mb-2">0,00 € <span className="text-[12px] font-normal text-[#5F6B63]">dauerhaft</span></div>
              <div className="text-[13px] text-[#5F6B63]">Standard-Sichtbarkeit, Kontaktdaten, Kurzbeschreibung.</div>
            </div>
            <div 
              onClick={() => setSelectedPlan('premium')}
              className={`cursor-pointer border p-4 rounded-[12px] transition-colors flex flex-col ${selectedPlan === 'premium' ? 'border-[#F2761B] bg-[#FFF1E4]' : 'border-[#E7E2DA] bg-[#FAF8F5] hover:border-[#F2761B]/50'}`}
            >
              <div className="flex justify-between items-start mb-1">
                <div className="font-bold flex items-center gap-1.5">Premium <ShieldCheck className="w-4 h-4 text-emerald-600" /></div>
                {selectedPlan === 'premium' && <CheckCircle2 className="w-5 h-5 text-[#F2761B]" />}
              </div>
              
              {selectedPlan === 'premium' && (
                <div className="flex bg-white/60 border border-[#E7E2DA] rounded-lg p-1 my-3" onClick={e => e.stopPropagation()}>
                  <button 
                    type="button"
                    onClick={() => setBillingCycle('monthly')}
                    className={`flex-1 text-[13px] font-medium py-1.5 rounded-md transition-colors ${billingCycle === 'monthly' ? 'bg-white shadow-sm text-[#0F4C2E]' : 'text-[#5F6B63] hover:text-[#1B211D]'}`}
                  >
                    Monatlich
                  </button>
                  <button 
                    type="button"
                    onClick={() => setBillingCycle('yearly')}
                    className={`flex-1 text-[13px] font-medium py-1.5 rounded-md transition-colors ${billingCycle === 'yearly' ? 'bg-white shadow-sm text-[#0F4C2E]' : 'text-[#5F6B63] hover:text-[#1B211D]'}`}
                  >
                    Jährlich (-23%)
                  </button>
                </div>
              )}
              
              <div className="font-bold text-[18px] text-[#D65F0C] mb-2 mt-auto">
                {selectedPlan === 'premium' && billingCycle === 'monthly' ? '12,95 €' : '9,95 €'}
                <span className="text-[12px] font-normal text-[#5F6B63]"> / Monat (netto)</span>
              </div>
              <div className="text-[13px] text-[#5F6B63]">Ausführliches Profil, Galerie, Jobs, Top-Platzierung. {selectedPlan === 'premium' && billingCycle === 'yearly' && "Abrechnung jährlich (119,40 €)."}</div>
            </div>
          </div>
        </div>

        <div className="pt-2">
          <label className="flex items-start gap-3 cursor-pointer group">
            <input 
              type="checkbox" 
              required
              className="mt-1 w-4 h-4 rounded border-[#E7E2DA] text-[#F2761B] focus:ring-[#F2761B] flex-shrink-0 cursor-pointer"
            />
            <span className="text-[14px] text-[#4A544D] group-hover:text-[#0F4C2E] transition-colors leading-relaxed">
              Ich habe die <strong>AGB</strong> und die <strong>Datenschutzerklärung</strong> gelesen und akzeptiere diese. Ich bestätige hiermit außerdem ausdrücklich, dass ich <strong>gewerblich (B2B)</strong> handle.
            </span>
          </label>
        </div>

        <div className="flex flex-col md:flex-row gap-[14px] mt-2">
          <button type="submit" disabled={isSubmitting} className="flex-1 bg-[#F2761B] text-white border-none rounded-full py-[15px] text-[16px] font-semibold cursor-pointer hover:bg-[#D65F0C] transition-colors disabled:opacity-50">
            {isSubmitting ? 'Wird verarbeitet...' : 'Eintrag einreichen'}
          </button>
          <button type="button" onClick={onCancel} className="md:w-auto bg-transparent border-none text-[#5F6B63] py-[15px] px-6 text-[15px] cursor-pointer hover:underline">
            Abbrechen
          </button>
        </div>
      </form>
    </main>
  );
}
