import React, { useState } from 'react';
import { useTranslation } from '../i18n';
import { ThemeConfig, Business } from '../types';
import { db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { CheckCircle2, ShieldCheck } from 'lucide-react';

export default function SubmitBusiness({ theme, activeThemeKey, onCancel }: { theme: ThemeConfig, activeThemeKey: string, onCancel: () => void }) {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const newId = 'b_' + Date.now().toString(36);
    const dataToSubmit = {
      ...formData,
      id: newId,
      isPremium: selectedPlan === 'premium' // Just a marker, needs admin approval in real system
    };
    
    try {
      await setDoc(doc(db, 'businesses', newId), dataToSubmit);
      
      if (selectedPlan === 'premium') {
        // Stripe integration disabled temporarily
        /*
        const res = await fetch('/api/create-checkout-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ businessId: newId, email: formData.email })
        });
        const data = await res.json();
        if (data.url) {
          window.location.href = data.url;
          return;
        } else {
          throw new Error(data.error || 'Fehler beim Weiterleiten zu Stripe');
        }
        */
      }
      
      setIsSuccess(true);
    } catch (err) {
      console.error(err);
      alert(t("errorOccurred"));
      setIsSubmitting(false);
    }
  };

  const inputClass = `w-full px-4 py-2 border focus:outline-none focus:ring-2 focus:border-orange-500 focus:ring-orange-500/20 transition-all bg-white ${theme.cardBorder} ${theme.textBase} ${activeThemeKey === 'modern' ? 'rounded-none' : 'rounded-md'}`;
  const labelClass = `block text-sm font-medium mb-1 ${theme.textBase}`;

  if (isSuccess) {
    return (
      <div className={`p-8 border ${theme.cardBg} ${theme.cardBorder} ${theme.cardShadow} ${activeThemeKey === 'modern' ? 'rounded-none' : 'rounded-xl'} text-center`}>
        <h2 className="text-2xl font-display font-bold mb-4">{t("thankYou")}</h2>
        <p className="mb-6">{t("submitSuccessDesc")}</p>
        <button onClick={onCancel} className={`px-6 py-2 font-medium transition-colors ${theme.primaryBtn} ${activeThemeKey === 'modern' ? 'rounded-none' : 'rounded-md'}`}>
          Zurück zur Startseite
        </button>
      </div>
    );
  }

  return (
    <div className={`p-6 md:p-8 border ${theme.cardBg} ${theme.cardBorder} ${theme.cardShadow} ${activeThemeKey === 'modern' ? 'rounded-none' : 'rounded-xl'}`}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-display font-bold">{t("submitBusinessTitle")}</h1>
      </div>
      
      <p className="mb-8 text-sm opacity-80">{t("submitBusinessDesc")}</p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>{t("companyNamePlaceholder")}*</label>
            <input required value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>{t("category")}*</label>
            <input required placeholder="z.B. Gastronomie" value={formData.category || ''} onChange={e => setFormData({...formData, category: e.target.value})} className={inputClass} />
          </div>
        </div>
        
        <div>
          <label className={labelClass}>{t("shortDescription")}*</label>
          <textarea required value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} className={inputClass} rows={3} />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>{t("address")}*</label>
            <input required value={formData.address || ''} onChange={e => setFormData({...formData, address: e.target.value})} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>{t("email")}</label>
            <input type="email" value={formData.email || ''} onChange={e => setFormData({...formData, email: e.target.value})} className={inputClass} />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>{t("phoneOptional")}</label>
            <input value={formData.phone || ''} onChange={e => setFormData({...formData, phone: e.target.value})} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>{t("websiteOptional")}</label>
            <input type="url" placeholder="https://" value={formData.website || ''} onChange={e => setFormData({...formData, website: e.target.value})} className={inputClass} />
          </div>
        </div>

        <div className="pt-6 pb-2">
          <label className={labelClass}>{t("pricingDesc")}</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            <div 
              onClick={() => setSelectedPlan('free')}
              className={`cursor-pointer p-4 border-2 transition-all ${activeThemeKey === 'modern' ? 'rounded-none' : 'rounded-xl'} ${selectedPlan === 'free' ? 'border-orange-500 bg-orange-50/50' : 'border-black/10 hover:border-black/20'}`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="font-bold text-lg">{t("basicEntry")}</div>
                {selectedPlan === 'free' && <CheckCircle2 className="w-5 h-5 text-orange-500" />}
              </div>
              <div className="font-bold mb-3 text-black/60">0,00 € <span className="text-xs font-normal">/ {t("free")}</span></div>
              <ul className="text-sm space-y-2 text-black/70">
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-black/40" /> {t("company")} & {t("address")}</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-black/40" /> {t("shortDescription")}</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-black/40" /> {t("contactDetails")}</li>
              </ul>
            </div>
            
            <div 
              onClick={() => setSelectedPlan('premium')}
              className={`cursor-pointer p-4 border-2 transition-all ${activeThemeKey === 'modern' ? 'rounded-none' : 'rounded-xl'} ${selectedPlan === 'premium' ? 'border-orange-500 bg-orange-50/50' : 'border-black/10 hover:border-black/20'}`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="font-bold text-lg flex items-center gap-2">Premium <ShieldCheck className="w-4 h-4 text-emerald-500" /></div>
                {selectedPlan === 'premium' && <CheckCircle2 className="w-5 h-5 text-orange-500" />}
              </div>
              
              {selectedPlan === 'premium' ? (
                <div className="flex bg-white border border-black/10 p-1 rounded-lg mb-3">
                  <div 
                    onClick={(e) => { e.stopPropagation(); setBillingCycle('monthly'); }}
                    className={`flex-1 text-center py-1 text-xs font-medium rounded transition-colors ${billingCycle === 'monthly' ? 'bg-orange-100 text-orange-900' : 'text-black/60 hover:text-black'}`}
                  >
                    Monatlich (12,95€ zzgl. MwSt.)
                  </div>
                  <div 
                    onClick={(e) => { e.stopPropagation(); setBillingCycle('yearly'); }}
                    className={`flex-1 text-center py-1 text-xs font-medium rounded transition-colors ${billingCycle === 'yearly' ? 'bg-orange-100 text-orange-900' : 'text-black/60 hover:text-black'}`}
                  >
                    Jährlich (119,40€ zzgl. MwSt.)
                  </div>
                </div>
              ) : (
                 <div className="font-bold mb-1 text-black/80">ab 9,95 € <span className="text-xs font-normal">/ {t("month")} zzgl. MwSt.</span></div>
              )}
              
              <div className="text-sm mb-3 text-black/60">Hervorgehobene Platzierung, Galerie, Jobs & mehr.</div>
              <ul className="text-sm space-y-2 text-black/70">
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-orange-500" /> {t("detailedDesc")} & {t("logoGallery")}</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-orange-500" /> {t("highlightedPlacement")} & SEO</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-orange-500" /> {t("publishJobs")}</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-orange-500" /> {t("customerReviews")}</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-orange-500" /> {t("login")}</li>
              </ul>
              
            </div>
          </div>
        </div>

        <div className="pt-4 pb-2 border-t border-black/10 mt-4">
          <label className="flex items-start gap-3 cursor-pointer group">
            <input 
              type="checkbox" 
              required
              className="mt-1 w-4 h-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500 flex-shrink-0 cursor-pointer"
            />
            <span className="text-sm text-black/70 group-hover:text-black transition-colors leading-relaxed">
              Ich habe die <strong>AGB</strong> und die <strong>Datenschutzerklärung</strong> gelesen und akzeptiere diese. Ich bestätige hiermit außerdem ausdrücklich, dass ich <strong>gewerblich (B2B)</strong> handle.
            </span>
          </label>
        </div>

        <div className="pt-4 flex flex-col md:flex-row gap-3">
          <button type="submit" disabled={isSubmitting} className={`px-6 py-3 md:py-2 font-medium flex-1 text-center transition-colors ${theme.primaryBtn} ${activeThemeKey === 'modern' ? 'rounded-none' : 'rounded-md'} disabled:opacity-50`}>
            {isSubmitting ? 'Bitte warten...' : selectedPlan === 'premium' ? t("bookPaid") : t("createEntry")}
          </button>
          <button type="button" onClick={onCancel} className={`px-6 py-3 md:py-2 font-medium text-center transition-colors bg-black/5 hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/20 ${activeThemeKey === 'modern' ? 'rounded-none' : 'rounded-md'}`}>
            Abbrechen
          </button>
        </div>
      </form>
    </div>
  );
}
