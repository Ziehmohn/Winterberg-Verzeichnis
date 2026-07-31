import { useTranslation } from '../i18n';
import React, { useState } from 'react';
import { ThemeConfig } from '../types';
import { Check, X, ArrowLeft, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';

interface PricingTableProps {
  theme: ThemeConfig;
  activeThemeKey: string;
  onBack: () => void;
  onSelect: (plan: 'free' | 'premium') => void;
  hideAction?: boolean;
}

export default function PricingTable({ theme, activeThemeKey, onBack, onSelect, hideAction = false }: PricingTableProps) {
  const { t } = useTranslation();

  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const features = [
    { name: `${t("company")} & ${t("address")}`, free: true, premium: true },
    { name: t("shortDescription"), free: true, premium: true },
    { name: t("contactDetails"), free: true, premium: true },
    { name: t("websiteLink"), free: true, premium: true },
    { name: t("openingHours"), free: false, premium: true },
    { name: t("detailedDesc"), free: false, premium: true },
    { name: t("logoGallery"), free: false, premium: true },
    { name: t("servicesAndFeatures"), free: false, premium: true },
    { name: 'Hervorgehobene Platzierung (Premium-Badge)', free: false, premium: true },
    { name: t("priorityInSearch"), free: false, premium: true },
    { name: t("login"), free: false, premium: true },
    { name: t("editAnytime"), free: false, premium: true },
    { name: 'Stellenanzeigen veröffentlichen', free: false, premium: true },
    { name: 'Kundenbewertungen kommentieren', free: false, premium: true },
  ];

  return (
    <div className={`w-full bg-white ${theme.cardBorder} ${theme.cardShadow} ${activeThemeKey === 'modern' ? 'rounded-none' : 'rounded-xl'} overflow-hidden`}>
      <div className="p-6 md:p-8 border-b border-black/5">
        <button 
          onClick={onBack} 
          className="flex items-center gap-2 text-sm font-medium hover:underline mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          {t("back")}
        </button>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-4">
          <h1 className="text-4xl font-display font-bold mb-2">{t("pricingTitle")}</h1>
          
          <div className="flex bg-black/5 p-1 rounded-lg self-start">
            <button 
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${billingCycle === 'monthly' ? 'bg-white shadow-sm text-black' : 'text-black/60 hover:text-black'}`}
            >
              {t("month")}lich
            </button>
            <button 
              onClick={() => setBillingCycle('yearly')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors flex items-center gap-2 ${billingCycle === 'yearly' ? 'bg-white shadow-sm text-black' : 'text-black/60 hover:text-black'}`}
            >
              Jährlich <span className="text-[10px] uppercase font-bold bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full">36 € / Jahr sparen</span>
            </button>
          </div>
        </div>
        <p className="text-black/70 max-w-2xl text-lg">
          {t("pricingDesc2")}
        </p>
      </div>

      <div className="flex flex-col md:flex-row">
        {/* Free Plan */}
        <div className="flex-1 p-6 md:p-8 border-b md:border-b-0 md:border-r border-black/5">
          <div className="mb-6">
            <h3 className="text-2xl font-bold mb-2">{t("basicEntry")}</h3>
            <div className="text-3xl font-bold mb-2">0,00 € <span className="text-base font-normal opacity-70">/ dauerhaft</span></div>
            <p className="text-sm opacity-80 h-10">{t("free")} {t("freeBasicPresence")}</p>
          </div>
          
          <div className="space-y-4 mb-8">
            {features.map((feature, idx) => (
              <div key={idx} className="flex items-center gap-3">
                {feature.free ? (
                  <Check className="w-5 h-5 text-emerald-500 shrink-0" />
                ) : (
                  <X className="w-5 h-5 text-black/20 shrink-0" />
                )}
                <span className={`text-sm ${feature.free ? 'text-black' : 'text-black/40'}`}>{feature.name}</span>
              </div>
            ))}
          </div>

          {!hideAction && (
            <button 
              onClick={() => onSelect('free')}
              className={`w-full py-3 font-medium border-2 border-orange-500 text-orange-600 hover:bg-orange-50 transition-colors ${activeThemeKey === 'modern' ? 'rounded-none' : 'rounded-lg'}`}
            >
              Kostenfrei eintragen
            </button>
          )}
        </div>

        {/* Premium Plan */}
        <div className="flex-1 p-6 md:p-8 bg-orange-50/30 relative">
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-orange-400 to-orange-600"></div>
          
          <div className="mb-6">
            <h3 className="text-2xl font-bold mb-2 flex items-center gap-2">
              Premium <ShieldCheck className="w-6 h-6 text-emerald-500" />
            </h3>
            <div className="flex items-end gap-2 mb-2">
              <div className="text-3xl font-bold text-orange-900">
                {billingCycle === 'monthly' ? '12,95 €' : '119,40 €'}
              </div>
              <div className="text-base font-normal opacity-70 mb-1">
                / {billingCycle === "monthly" ? t("month") : "Jahr"} <span className="text-xs ml-1">(netto zzgl. MwSt.)</span>
              </div>
            </div>
            <p className="text-sm text-orange-800 h-10">
              {billingCycle === 'monthly' ? t("monthlyCancelable") : 'Entspricht 9,95 € pro Monat. 36 € im Jahr sparen!'}
            </p>
          </div>

          <div className="space-y-4 mb-8">
            {features.map((feature, idx) => (
              <div key={idx} className="flex items-center gap-3">
                {feature.premium ? (
                  <Check className="w-5 h-5 text-orange-500 shrink-0" />
                ) : (
                  <X className="w-5 h-5 text-black/20 shrink-0" />
                )}
                <span className={`text-sm ${feature.premium ? 'text-black font-medium' : 'text-black/40'}`}>{feature.name}</span>
              </div>
            ))}
          </div>

          {!hideAction && (
            <div className="flex flex-col gap-2">
              <button 
                disabled
                className={`w-full py-3 font-bold text-white bg-orange-500 opacity-50 cursor-not-allowed ${activeThemeKey === 'modern' ? 'rounded-none' : 'rounded-lg'}`}
              >
                Zahlungspflichtig bestellen
              </button>
              <p className="text-xs text-orange-600 font-bold text-center mt-2">
                {t("paymentSoon")} {t("basicEntry")} {t("available")}.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
