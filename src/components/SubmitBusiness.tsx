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
  const [servicesInput, setServicesInput] = useState('');
  const [productsInput, setProductsInput] = useState('');
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
    
    const parsedServices = servicesInput
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    const parsedProducts = productsInput
      .split(',')
      .map(p => p.trim())
      .filter(Boolean);

    const newId = 'b_' + Date.now().toString(36);
    const dataToSubmit = {
      ...formData,
      id: newId,
      services: parsedServices.length > 0 ? parsedServices : (formData.services || []),
      products: parsedProducts.length > 0 ? parsedProducts : (formData.products || []),
      ownerId: user?.uid || null,
      ownerEmail: user?.email || null,
      isPremium: selectedPlan === 'premium'
    };
    
    try {
      // Use API route instead of client-side setDoc to prevent connection hangs
      const createRes = await fetch('/api/create-business', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: newId, data: dataToSubmit })
      });
      
      if (!createRes.ok) {
        let errorMsg = 'Fehler beim Speichern in der Datenbank.';
        try {
          const errData = await createRes.json();
          if (errData.error) errorMsg += ' Details: ' + errData.error;
        } catch(e) {}
        throw new Error(errorMsg);
      }
      
      if (selectedPlan === 'premium') {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000);
        
        const res = await fetch('/api/create-checkout-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            businessId: newId, 
            email: formData.email, 
            billingCycle,
            ownerId: user?.uid || null,
            ownerEmail: user?.email || null
          }),
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
        <div className="bg-white border border-[#EDE8E0] rounded-lg p-7 shadow-[0_10px_30px_rgba(27,33,29,0.06)]">
          <div className="bg-[#E8F1EB] rounded-md p-4 text-[#0F4C2E] text-[15px]">Danke! Der Eintrag liegt jetzt zur Prüfung im Adminbereich.</div>
          <button type="button" onClick={onCancel} className="mt-4 bg-transparent border-none text-[#5F6B63] text-[13.5px] cursor-pointer hover:underline">Zurück zur Startseite</button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 w-full max-w-[720px] mx-auto px-6 py-[54px] pb-[80px]">
      <h1 className="font-display text-[clamp(32px,5vw,48px)] font-bold mb-3.5">Unternehmen eintragen</h1>
      <p className="text-[17px] leading-[1.65] text-[#4A544D] mb-[30px]">Kostenlos gelistet werden — oder mit <a href="/preise" target="_blank" rel="noopener noreferrer" className="text-[#F2761B] hover:underline font-semibold">Premium</a> Bildergalerie, ausführliches Profil und Top-Platzierung freischalten.</p>
      
      <form onSubmit={handleSubmit} className="bg-white border border-[#EDE8E0] rounded-lg p-7 grid gap-[18px] shadow-[0_10px_30px_rgba(27,33,29,0.06)]">
        <label className="grid gap-[7px] text-[14px] font-semibold">Unternehmensname
          <input required placeholder="z. B. Café Sonnenberg" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} className="border border-[#E7E2DA] rounded-md p-3 text-[15px] font-normal bg-[#FAF8F5] focus:outline-none focus:ring-2 focus:ring-[#F2761B]" />
        </label>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[18px]">
          <label className="grid gap-[7px] text-[14px] font-semibold">Kategorie
            <select required value={formData.category || ''} onChange={e => setFormData({...formData, category: e.target.value, subcategory: ''})} className="border border-[#E7E2DA] rounded-md p-3 text-[15px] font-normal bg-[#FAF8F5] focus:outline-none focus:ring-2 focus:ring-[#F2761B]">
              <option value="">Bitte wählen...</option>
              {CATEGORY_NAMES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </label>
          
          {formData.category && categories.find(c => c.name === formData.category)?.subcategories?.length ? (
            <label className="grid gap-[7px] text-[14px] font-semibold">Unterkategorie (Optional)
              <select value={formData.subcategory || ''} onChange={e => setFormData({...formData, subcategory: e.target.value})} className="border border-[#E7E2DA] rounded-md p-3 text-[15px] font-normal bg-[#FAF8F5] focus:outline-none focus:ring-2 focus:ring-[#F2761B]">
                <option value="">Bitte wählen...</option>
                {categories.find(c => c.name === formData.category)?.subcategories.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </label>
          ) : <div />}

          {/* Weitere Kategorien */}
          <div className="md:col-span-2 mt-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[14px] font-semibold">Weitere Kategorien (Optional)</span>
              <button 
                type="button" 
                onClick={() => setFormData({ ...formData, additionalCategories: [...(formData.additionalCategories || []), { category: '', subcategory: '' }]})}
                className="text-xs text-[#F2761B] hover:underline"
              >
                + Weitere Kategorie hinzufügen
              </button>
            </div>
            
            {formData.additionalCategories?.map((ac, index) => (
              <div key={index} className="flex flex-col md:flex-row gap-[18px] mb-3 p-3 bg-gray-50 border border-gray-100 rounded-md relative">
                <button type="button" onClick={() => {
                  const newCats = [...(formData.additionalCategories || [])];
                  newCats.splice(index, 1);
                  setFormData({...formData, additionalCategories: newCats});
                }} className="absolute top-2 right-2 text-gray-400 hover:text-red-500">
                  &times;
                </button>
                <div className="flex-1 grid gap-[7px]">
                  <select value={ac.category} onChange={e => {
                    const newCats = [...(formData.additionalCategories || [])];
                    newCats[index] = { category: e.target.value, subcategory: '' };
                    setFormData({...formData, additionalCategories: newCats});
                  }} className="border border-[#E7E2DA] rounded-md p-2 text-[14px] bg-white w-full">
                    <option value="">Hauptkategorie wählen...</option>
                    {CATEGORY_NAMES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="flex-1 grid gap-[7px]">
                  {ac.category && categories.find(c => c.name === ac.category)?.subcategories?.length ? (
                    <select value={ac.subcategory} onChange={e => {
                      const newCats = [...(formData.additionalCategories || [])];
                      newCats[index] = { ...newCats[index], subcategory: e.target.value };
                      setFormData({...formData, additionalCategories: newCats});
                    }} className="border border-[#E7E2DA] rounded-md p-2 text-[14px] bg-white w-full">
                      <option value="">Unterkategorie wählen...</option>
                      {categories.find(c => c.name === ac.category)?.subcategories.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  ) : null}
                </div>
              </div>
            ))}
          </div>

          <label className="grid gap-[7px] text-[14px] font-semibold">Ortsteil
            <select required value={formData.district || ''} onChange={e => setFormData({...formData, district: e.target.value})} className="border border-[#E7E2DA] rounded-md p-3 text-[15px] font-normal bg-[#FAF8F5] focus:outline-none focus:ring-2 focus:ring-[#F2761B]">
              <option value="">Bitte wählen...</option>
              {ALL_DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </label>
        </div>
        
        <label className="grid gap-[7px] text-[14px] font-semibold">Adresse
          <input required placeholder="Straße, PLZ Ort" value={formData.address || ''} onChange={e => setFormData({...formData, address: e.target.value})} className="border border-[#E7E2DA] rounded-md p-3 text-[15px] font-normal bg-[#FAF8F5] focus:outline-none focus:ring-2 focus:ring-[#F2761B]" />
        </label>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[18px]">
          <label className="grid gap-[7px] text-[14px] font-semibold">E-Mail
            <input type="email" placeholder="mail@example.com" value={formData.email || ''} onChange={e => setFormData({...formData, email: e.target.value})} className="border border-[#E7E2DA] rounded-md p-3 text-[15px] font-normal bg-[#FAF8F5] focus:outline-none focus:ring-2 focus:ring-[#F2761B]" />
          </label>
          <label className="grid gap-[7px] text-[14px] font-semibold">Telefon
            <input placeholder="optional" value={formData.phone || ''} onChange={e => setFormData({...formData, phone: e.target.value})} className="border border-[#E7E2DA] rounded-md p-3 text-[15px] font-normal bg-[#FAF8F5] focus:outline-none focus:ring-2 focus:ring-[#F2761B]" />
          </label>
          <label className="grid gap-[7px] text-[14px] font-semibold">Website
            <input type="url" placeholder="https://" value={formData.website || ''} onChange={e => setFormData({...formData, website: e.target.value})} className="border border-[#E7E2DA] rounded-md p-3 text-[15px] font-normal bg-[#FAF8F5] focus:outline-none focus:ring-2 focus:ring-[#F2761B]" />
          </label>
        </div>

        <label className="grid gap-[7px] text-[14px] font-semibold">Kurzbeschreibung
          <textarea required rows={4} placeholder="Was macht Ihr Unternehmen besonders?" value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} className="border border-[#E7E2DA] rounded-md p-3 text-[15px] font-normal bg-[#FAF8F5] focus:outline-none focus:ring-2 focus:ring-[#F2761B] resize-y"></textarea>
        </label>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-[18px]">
          <label className="grid gap-[7px] text-[14px] font-semibold">
            Leistungen & Services
            <span className="text-[12px] font-normal text-[#5F6B63]">
              z. B. <em>Reparatur, Beratung, Montage, Wartung, Lieferservice</em> (Kommagetrennt. <strong>Basiseintrag: bis zu 3</strong>, <strong>Premium: bis zu 15</strong>).
            </span>
            <input 
              type="text" 
              placeholder="z. B. Reparatur, Beratung, Montage" 
              value={servicesInput} 
              onChange={e => setServicesInput(e.target.value)} 
              className="border border-[#E7E2DA] rounded-md p-3 text-[15px] font-normal bg-[#FAF8F5] focus:outline-none focus:ring-2 focus:ring-[#F2761B]" 
            />
          </label>

          <label className="grid gap-[7px] text-[14px] font-semibold">
            Produkte & Angebote
            <span className="text-[12px] font-normal text-[#5F6B63]">
              z. B. <em>E-Bikes, Skier, Schuhe, Ersatzteile, Gutscheine</em> (Kommagetrennt. <strong>Basiseintrag: bis zu 3</strong>, <strong>Premium: bis zu 15</strong>).
            </span>
            <input 
              type="text" 
              placeholder="z. B. E-Bikes, Ski-Ausrüstung, Zubehör" 
              value={productsInput} 
              onChange={e => setProductsInput(e.target.value)} 
              className="border border-[#E7E2DA] rounded-md p-3 text-[15px] font-normal bg-[#FAF8F5] focus:outline-none focus:ring-2 focus:ring-[#F2761B]" 
            />
          </label>
        </div>
        
        <div className="grid gap-[7px] text-[14px] font-semibold mt-2">
          Eintragstyp wählen
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[14px]">
            <div 
              onClick={() => setSelectedPlan('free')}
              className={`cursor-pointer border p-4 rounded-md transition-colors ${selectedPlan === 'free' ? 'border-[#F2761B] bg-[#FFF1E4]' : 'border-[#E7E2DA] bg-[#FAF8F5] hover:border-[#F2761B]/50'}`}
            >
              <div className="flex justify-between items-start mb-1">
                <div className="font-bold">Basiseintrag</div>
                {selectedPlan === 'free' && <CheckCircle2 className="w-5 h-5 text-[#F2761B]" />}
              </div>
              <div className="font-bold text-[18px] mb-2">0,00 € <span className="text-[12px] font-normal text-[#5F6B63]">dauerhaft</span></div>
              <div className="text-[13px] text-[#5F6B63]">Standard-Sichtbarkeit, Kontaktdaten, <strong>bis zu 3 Leistungen & 3 Produkte</strong>, kostenloses Trust-Siegel für Ihre Website.</div>
            </div>
            
            <div 
              onClick={() => setSelectedPlan('premium')}
              className={`cursor-pointer border p-4 rounded-md transition-colors relative ${selectedPlan === 'premium' ? 'border-[#F2761B] bg-[#FFF8F1] ring-2 ring-[#F2761B]' : 'border-[#E7E2DA] bg-[#FAF8F5] hover:border-[#F2761B]/50'}`}
            >
              <div className="flex justify-between items-start mb-1">
                <div className="font-bold flex items-center gap-1.5 text-[#0F4C2E]">Premium <ShieldCheck className="w-4 h-4 text-[#F2761B]" /></div>
                {selectedPlan === 'premium' && <CheckCircle2 className="w-5 h-5 text-[#F2761B]" />}
              </div>

              {selectedPlan === 'premium' ? (
                <div className="my-2">
                  <div className="flex bg-white rounded-md p-0.5 border border-[#EDE8E0] mb-2 w-fit">
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setBillingCycle('monthly'); }}
                      className={`px-2.5 py-1 text-[11px] font-medium rounded transition-colors ${billingCycle === 'monthly' ? 'bg-[#0F4C2E] text-white' : 'text-[#5F6B63]'}`}
                    >
                      Monatlich (12,95 €)
                    </button>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setBillingCycle('yearly'); }}
                      className={`px-2.5 py-1 text-[11px] font-medium rounded transition-colors ${billingCycle === 'yearly' ? 'bg-[#0F4C2E] text-white' : 'text-[#5F6B63]'}`}
                    >
                      Jährlich (9,95 €/Mtl.)
                    </button>
                  </div>
                  <div className="font-bold text-[18px] text-[#D65F0C]">
                    {billingCycle === 'yearly' ? '119,40 € / Jahr' : '12,95 € / Monat'}
                    <span className="text-[12px] font-normal text-[#5F6B63]"> netto</span>
                  </div>
                </div>
              ) : (
                <div className="font-bold text-[18px] mb-2 text-[#D65F0C]">ab 9,95 € <span className="text-[12px] font-normal text-[#5F6B63]">/ Monat</span></div>
              )}
              
              <div className="text-[13px] text-[#5F6B63]"><strong>Bis zu 15 Leistungen & 15 Produkte</strong>, Öffnungszeiten, Galerie, Jobs, News, White-Label Bewertungs-Widget, Top-Platzierung.</div>
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
          <button type="submit" disabled={isSubmitting} className="flex-1 bg-[#F2761B] text-white border-none rounded-md py-3 text-[16px] font-semibold cursor-pointer hover:bg-[#D65F0C] transition-colors disabled:opacity-50">
            {isSubmitting ? 'Wird verarbeitet...' : 'Eintrag einreichen'}
          </button>
          <button type="button" onClick={onCancel} className="md:w-auto bg-transparent border-none text-[#5F6B63] py-3 px-6 text-[15px] cursor-pointer hover:underline">
            Abbrechen
          </button>
        </div>
      </form>
    </main>
  );
}
