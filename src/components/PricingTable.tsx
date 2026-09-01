import { useTranslation } from '../i18n';
import React, { useState } from 'react';
import { ThemeConfig } from '../types';
import { Check, X, ArrowLeft, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';
import { PRICING, AD_CTA } from '../config';

interface PricingTableProps {
  theme: ThemeConfig;
  activeThemeKey: string;
  onBack: () => void;
  onSelect: (plan: 'free' | 'premium') => void;
  onInquireAd?: () => void;
  hideAction?: boolean;
}

export default function PricingTable({ theme, activeThemeKey, onBack, onSelect, onInquireAd, hideAction = false }: PricingTableProps) {
  const { t } = useTranslation();

  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const features = [
    { name: `${t("company")} & ${t("address")}`, free: true, premium: true },
    { name: t("shortDescription"), free: true, premium: true },
    { name: t("contactDetails"), free: true, premium: true },
    { name: t("websiteLink"), free: true, premium: true },
    { name: t("pricingFreeTrustBadge"), free: true, premium: true },
    { name: t("servicesAndFeatures"), free: 'Bis zu 3', premium: 'Bis zu 15' },
    { name: 'Produkte & Angebote', free: 'Bis zu 3', premium: 'Bis zu 15' },
    { name: t("pricingCatGallery"), free: false, premium: true },
    { name: t("pricingHeroHeader"), free: false, premium: true },
    { name: t("openingHours"), free: false, premium: true },
    { name: t("detailedDesc"), free: false, premium: true },
    { name: t("pricingLogoDesc"), free: false, premium: true },
    { name: t("pricingPremiumBadge"), free: false, premium: true },
    { name: t("priorityInSearch"), free: false, premium: true },
    { name: t("login"), free: false, premium: true },
    { name: t("editAnytime"), free: false, premium: true },
    { name: t("pricingPublishJobs"), free: false, premium: true },
    { name: t("pricingPublishNews"), free: false, premium: true },
    { name: t("pricingCommentReviews"), free: false, premium: true },
    { name: t("pricingWhiteLabel"), free: false, premium: true },
    { name: t("pricingTestimonialSlider"), free: false, premium: true },
  ];
  return (
    <main className="flex-1 w-full max-w-[1000px] mx-auto px-6 py-[54px] pb-[80px]">
      <h1 className="font-display text-[clamp(32px,5vw,50px)] font-bold mb-3">{t("pricingMainTitle")}</h1>
      <p className="text-[17px] leading-[1.65] text-[#4A544D] max-w-[60ch] mb-8">
        {t("pricingMainSubtitle")}
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
        {/* Basiseintrag */}
        <div className="bg-white border border-[#EDE8E0] rounded-lg p-7">
          <div className="font-display text-[22px] font-semibold">{t("pricingFreePlan")}</div>
          <div className="font-display text-[38px] font-bold mt-2.5 mb-1">{t("pricingFreePrice")}</div>
          <div className="text-[14px] text-[#5F6B63] mb-[22px]">{t("pricingFreeSub")}</div>
          
          <div className="grid gap-2.5 text-[15px] text-[#4A544D]">
            <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> {t("company")} & {t("address")}</div>
            <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> {t("shortDescription")}</div>
            <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> {t("contactDetails")}</div>
            <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> {t("websiteLink")}</div>
            <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> <strong>{t("pricingFree3Services")}</strong></div>
            <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> {t("pricingFreeTrustBadge")}</div>
          </div>
          
          {!hideAction && (
            <button 
              type="button" 
              onClick={() => onSelect('free')} 
              className="mt-[26px] w-full bg-white text-[#D65F0C] border-2 border-[#F2761B] rounded-md py-3 text-[15px] font-semibold cursor-pointer hover:bg-[#FFF1E4] transition-colors"
            >
              {t("pricingFreeBtn")}
            </button>
          )}
        </div>

        {/* Premium */}
        <div className="bg-white border-2 border-[#F2761B] rounded-lg p-7 shadow-[0_16px_40px_rgba(242,118,27,0.14)] relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#F2761B] text-white text-[11px] font-bold px-2.5 py-0.5 rounded uppercase tracking-wider">
            {t("pricingPopular")}
          </div>
          <div className="flex justify-between items-center mb-4">
            <div className="font-display text-[22px] font-semibold">Premium</div>
            
            <div className="flex bg-[#FAF8F5] rounded-md p-1 border border-[#EDE8E0]">
              <button
                type="button"
                onClick={() => setBillingCycle('monthly')}
                className={`px-3 py-1.5 text-[13px] font-medium rounded transition-colors ${billingCycle === 'monthly' ? 'bg-white shadow text-[#0F4C2E]' : 'text-[#5F6B63] hover:text-[#0F4C2E]'}`}
              >
                {t("pricingMonthly")}
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle('yearly')}
                className={`px-3 py-1.5 text-[13px] font-medium rounded transition-colors ${billingCycle === 'yearly' ? 'bg-white shadow text-[#0F4C2E]' : 'text-[#5F6B63] hover:text-[#0F4C2E]'}`}
              >
                {t("pricingYearly")}
              </button>
            </div>
          </div>
          
          <div className="font-display text-[38px] font-bold mt-2.5 mb-1 text-[#D65F0C]">
            {billingCycle === 'yearly' ? PRICING.premiumYearly : PRICING.premiumMonthly}
          </div>
          <div className="text-[14px] text-[#5F6B63] mb-[22px]">
            {t("pricingPerMonthTax")} 
            {billingCycle === 'yearly' ? (
              <div className="mt-1.5 font-bold text-[#0F4C2E] bg-[#0F4C2E]/5 inline-block px-2 py-0.5 rounded text-[13px]">
                {t("pricingYearlyTotal")} {PRICING.premiumYearlyTotal}
              </div>
            ) : (
              ` · ${t("pricingMonthlyCancel")}`
            )}
          </div>
          
          <div className="grid gap-2.5 text-[15px] text-[#4A544D]">
            <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> {t("pricingAllFromBasic")}</div>
            <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> <strong>{t("pricingUpTo15Services")}</strong></div>
            <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> <strong>{t("pricingCatGallery")}</strong></div>
            <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> <strong>{t("pricingHeroHeader")}</strong></div>
            <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> {t("pricingOpeningHours")}</div>
            <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> {t("pricingLogoDesc")}</div>
            <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> {t("pricingPremiumBadge")}</div>
            <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> {t("pricingPublishJobs")}</div>
            <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> {t("pricingPublishNews")}</div>
            <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> {t("pricingCommentReviews")}</div>
            <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> {t("pricingWhiteLabel")}</div>
            <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> {t("pricingTestimonialSlider")}</div>
          </div>
          
          {!hideAction && (
            <button 
              type="button" 
              onClick={() => onSelect('premium')}
              className="mt-[26px] w-full bg-[#F2761B] hover:bg-[#D65F0C] text-white border-none rounded-md py-3 text-[15px] font-semibold cursor-pointer transition-colors shadow-[0_4px_14px_rgba(242,118,27,0.3)]"
            >
              {t("pricingSelectPremium")}
            </button>
          )}
        </div>
      </div>

      {/* Skyscraper Banner Advertising Card */}
      <div className="bg-gradient-to-br from-[#0F4C2E] to-[#06301C] text-white rounded-lg p-8 md:p-10 shadow-xl flex flex-col md:flex-row gap-6 items-center justify-between">
        <div className="max-w-[56ch]">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded px-3 py-1 text-xs font-semibold uppercase tracking-wider mb-3">
            <span className="w-2 h-2 rounded-full bg-[#F2761B]" />
            {t("pricingMaxVisibility")}
          </div>
          <h3 className="font-display text-2xl md:text-3xl font-bold mb-2">
            {t("pricingSkyscraperTitle")}
          </h3>
          <p className="text-white/85 text-[15px] leading-relaxed mb-4">
            {t("pricingSkyscraperDesc")}
          </p>
          <div className="inline-flex flex-wrap gap-2 text-xs text-white/90">
            <span className="bg-white/15 px-3 py-1 rounded">{t("pricingBannerTier1")}: <strong>{PRICING.bannerTier1} / Mo.</strong></span>
            <span className="bg-white/15 px-3 py-1 rounded text-emerald-300">{t("pricingBannerTier2")}: <strong>{PRICING.bannerTier2} / Mo.</strong> ({PRICING.bannerTier2Discount})</span>
            <span className="bg-white/15 px-3 py-1 rounded text-[#F2761B]">{t("pricingBannerTier3")}: <strong>{PRICING.bannerTier3} / Mo.</strong> ({PRICING.bannerTier3Discount})</span>
          </div>
          <div className="text-[12px] text-white/60 mt-2">
            {t("pricingBannerCancel")}
          </div>
        </div>
        {onInquireAd && (
          <button
            type="button"
            onClick={onInquireAd}
            className="bg-[#F2761B] hover:bg-[#D65F0C] text-white font-semibold px-6 py-3 rounded-md text-base transition-colors shrink-0 shadow-lg cursor-pointer text-center"
          >
            {t("pricingBannerInquire")}
          </button>
        )}
      </div>
    </main>
  );
}
