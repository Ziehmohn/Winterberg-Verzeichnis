import React, { useState } from 'react';
import { db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { PricingSettings, ThemeConfig } from '../types';
import { DEFAULT_PRICING_SETTINGS, isPricingOfferActive } from '../config';
import { Check, Sparkles, AlertCircle, Save, ArrowRight, Tag, Calendar, Eye, Palette } from 'lucide-react';

interface AdminPricingManagerProps {
  theme: ThemeConfig;
  pricingSettings: PricingSettings;
  onUpdatePricing: (settings: PricingSettings) => void;
}

export default function AdminPricingManager({
  theme,
  pricingSettings,
  onUpdatePricing
}: AdminPricingManagerProps) {
  const [formData, setFormData] = useState<PricingSettings>(() => ({
    ...DEFAULT_PRICING_SETTINGS,
    ...(pricingSettings || {})
  }));

  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const isLive = isPricingOfferActive(formData);

  const parsePrice = (str: string | number | undefined | null) => {
    if (!str) return 0;
    const cleaned = String(str).replace(/[^0-9,.]/g, '').replace(',', '.');
    return parseFloat(cleaned) || 0;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMessage('');
    setSavedSuccess(false);

    // Auto-calculate yearly totals (monthly price * 12)
    const yearlyPerMonth = parsePrice(formData.premiumYearly);
    const calculatedYearlyTotal = (yearlyPerMonth * 12).toFixed(2).replace('.', ',') + ' € / Jahr';

    const offerYearlyPerMonth = parsePrice(formData.offerYearlyPrice);
    const calculatedOfferYearlyTotal = (offerYearlyPerMonth * 12).toFixed(2).replace('.', ',') + ' € / Jahr';

    const payload: PricingSettings = {
      ...formData,
      premiumYearlyTotal: calculatedYearlyTotal,
      offerYearlyTotal: calculatedOfferYearlyTotal,
    };

    try {
      await setDoc(doc(db, 'settings', 'pricing'), payload, { merge: true });
      onUpdatePricing(payload);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 4000);
    } catch (err: any) {
      console.error('Error saving pricing settings:', err);
      setErrorMessage(err.message || 'Fehler beim Speichern der Preise.');
    } finally {
      setIsSaving(false);
    }
  };

  const inputClass = "w-full border border-[#E7E2DA] rounded-md px-3.5 py-2.5 text-sm bg-[#FAF8F5] focus:outline-none focus:border-[#0F4C2E] transition-colors";
  const labelClass = "block text-xs font-bold text-[#1B211D] mb-1.5";

  return (
    <form onSubmit={handleSave} className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-[#EDE8E0]">
        <div>
          <h2 className="text-xl font-bold text-[#1B211D] flex items-center gap-2">
            <Tag className="w-5 h-5 text-[#F2761B]" />
            Preise, Streichpreise & Aktions-Banderole
          </h2>
          <p className="text-xs text-[#5F6B63] mt-1">
            Steuern Sie hier alle Preise für Premium-Accounts, zeitlich begrenzte Aktionen mit Streichpreisen und die Banderole oben rechts.
          </p>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className={`px-5 py-2.5 rounded-md font-bold text-sm text-white flex items-center gap-2 shadow-sm transition-all cursor-pointer ${
            savedSuccess ? 'bg-emerald-600' : 'bg-[#F2761B] hover:bg-[#D65F0C]'
          }`}
        >
          {isSaving ? (
            'Wird gespeichert...'
          ) : savedSuccess ? (
            <>
              <Check className="w-4 h-4" /> Gespeichert!
            </>
          ) : (
            <>
              <Save className="w-4 h-4" /> Preise & Aktion speichern
            </>
          )}
        </button>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-sm flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          Preise und Aktions-Einstellungen wurden erfolgreich gespeichert und sind sofort live wirksam.
        </div>
      )}

      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          {errorMessage}
        </div>
      )}

      {/* SECTION 1: Reguläre Standardpreise */}
      <div className="bg-white border border-[#EDE8E0] rounded-xl p-6 shadow-sm space-y-4">
        <h3 className="font-bold text-base text-[#0F4C2E] flex items-center gap-2">
          <span>1. Reguläre Standard-Preise (ohne Aktion)</span>
        </h3>
        <p className="text-xs text-[#5F6B63]">
          Diese Preise gelten standardmäßig auf der Preiseseite und im gesamten Portal, wenn keine Sonderaktion aktiv ist.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div>
            <label className={labelClass}>Monatspreis (monatliche Zahlung) *</label>
            <input
              type="text"
              required
              value={formData.premiumMonthly}
              onChange={e => setFormData({ ...formData, premiumMonthly: e.target.value })}
              className={inputClass}
              placeholder="12,95 €"
            />
          </div>

          <div>
            <label className={labelClass}>Jahres-Tarif (pro Monat bei Jahreszahlung) *</label>
            <input
              type="text"
              required
              value={formData.premiumYearly}
              onChange={e => setFormData({ ...formData, premiumYearly: e.target.value })}
              className={inputClass}
              placeholder="9,95 €"
            />
          </div>
        </div>

        {/* Automatisch ermittelter Jahrespreis */}
        <div className="bg-[#FAF8F5] border border-[#EDE8E0] rounded-lg p-3 text-xs flex items-center justify-between">
          <span className="text-[#5F6B63]">
            💡 Jahresgesamtbetrag (automatisch <strong className="text-[#1B211D]">Monatswert × 12</strong>):
          </span>
          <span className="font-bold text-[#0F4C2E] text-sm">
            {(parsePrice(formData.premiumYearly) * 12).toFixed(2).replace('.', ',')} € / Jahr
          </span>
        </div>
      </div>

      {/* SECTION 2: Aktions- & Streichpreise */}
      <div className={`border-2 rounded-xl p-6 shadow-sm space-y-5 transition-all ${
        formData.isOfferActive ? 'bg-[#FFF8F1] border-[#F2761B]' : 'bg-white border-[#EDE8E0]'
      }`}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-black/10">
          <div>
            <h3 className="font-bold text-base text-[#1B211D] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#F2761B]" />
              2. Sonderaktion & Streichpreise
            </h3>
            <p className="text-xs text-[#5F6B63] mt-0.5">
              Aktivieren Sie Rabattaktionen mit durchgestrichenen Preisen und begrenztem Gültigkeitszeitraum.
            </p>
          </div>

          <label className="flex items-center gap-2.5 cursor-pointer bg-white px-3.5 py-2 rounded-lg border border-[#EDE8E0] shadow-2xs hover:border-[#F2761B]">
            <input
              type="checkbox"
              checked={formData.isOfferActive}
              onChange={e => setFormData({ ...formData, isOfferActive: e.target.checked })}
              className="w-4 h-4 rounded text-[#F2761B] focus:ring-[#F2761B]"
            />
            <span className="text-xs font-bold text-[#1B211D]">Sonderaktion aktivieren</span>
          </label>
        </div>

        {/* Status Indicator */}
        <div className="flex items-center gap-2 text-xs">
          <span className="font-bold">Status:</span>
          {isLive ? (
            <span className="bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              🟢 Aktion ist aktuell LIVE
            </span>
          ) : formData.isOfferActive ? (
            <span className="bg-amber-100 text-amber-800 font-bold px-2.5 py-0.5 rounded-full">
              🟡 Außerhalb des Datumsbereichs (geplant)
            </span>
          ) : (
            <span className="bg-gray-100 text-gray-600 font-medium px-2.5 py-0.5 rounded-full">
              ⚪ Aktion inaktiv
            </span>
          )}
        </div>

        {formData.isOfferActive && (
          <div className="space-y-4 pt-2">
            {/* Zeitraum & Badge */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className={labelClass}>
                  <Calendar className="w-3.5 h-3.5 inline mr-1 text-[#5F6B63]" />
                  Aktionsbeginn (Optional)
                </label>
                <input
                  type="date"
                  value={formData.offerStartDate || ''}
                  onChange={e => setFormData({ ...formData, offerStartDate: e.target.value })}
                  className={inputClass}
                />
                <span className="text-[11px] text-[#8A928B] mt-0.5 block">Leer lassen für sofortigen Start</span>
              </div>

              <div>
                <label className={labelClass}>
                  <Calendar className="w-3.5 h-3.5 inline mr-1 text-[#5F6B63]" />
                  Aktionsende (Optional)
                </label>
                <input
                  type="date"
                  value={formData.offerEndDate || ''}
                  onChange={e => setFormData({ ...formData, offerEndDate: e.target.value })}
                  className={inputClass}
                />
                <span className="text-[11px] text-[#8A928B] mt-0.5 block">Leer lassen für unbegrenzte Laufzeit</span>
              </div>

              <div>
                <label className={labelClass}>Aktions-Badge Text</label>
                <input
                  type="text"
                  value={formData.offerBadgeText || ''}
                  onChange={e => setFormData({ ...formData, offerBadgeText: e.target.value })}
                  className={inputClass}
                  placeholder="z. B. Herbst-Aktion: 50% Rabatt"
                />
              </div>
            </div>

            {/* Preise & Streichpreise */}
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-white rounded-lg border border-orange-200">
                <div>
                  <label className={labelClass}>Aktions-Monatspreis *</label>
                  <input
                    type="text"
                    value={formData.offerMonthlyPrice || ''}
                    onChange={e => setFormData({ ...formData, offerMonthlyPrice: e.target.value })}
                    className={inputClass}
                    placeholder="15,95 €"
                  />
                </div>

                <div>
                  <label className={labelClass}>Streichpreis Monat</label>
                  <input
                    type="text"
                    value={formData.strikethroughMonthly || ''}
                    onChange={e => setFormData({ ...formData, strikethroughMonthly: e.target.value })}
                    className={inputClass}
                    placeholder="19,95 €"
                  />
                  <span className="text-[11px] text-[#8A928B] mt-0.5 block">Wird durchgestrichen dargestellt</span>
                </div>

                <div>
                  <label className={labelClass}>Aktions-Jahrespreis / Mo *</label>
                  <input
                    type="text"
                    value={formData.offerYearlyPrice || ''}
                    onChange={e => setFormData({ ...formData, offerYearlyPrice: e.target.value })}
                    className={inputClass}
                    placeholder="10,95 €"
                  />
                </div>

                <div>
                  <label className={labelClass}>Streichpreis Jahr / Mo</label>
                  <input
                    type="text"
                    value={formData.strikethroughYearly || ''}
                    onChange={e => setFormData({ ...formData, strikethroughYearly: e.target.value })}
                    className={inputClass}
                    placeholder="13,95 €"
                  />
                  <span className="text-[11px] text-[#8A928B] mt-0.5 block">Wird durchgestrichen dargestellt</span>
                </div>
              </div>

              {/* Automatische Berechnungsvorschau für die Aktion */}
              <div className="bg-orange-50/80 border border-orange-200 rounded-lg p-3 text-xs text-[#1B211D] grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <span className="text-[#5F6B63] block">Aktions-Jahrespreis (× 12):</span>
                  <strong className="text-[#D65F0C] text-sm">
                    {(parsePrice(formData.offerYearlyPrice) * 12).toFixed(2).replace('.', ',')} € / Jahr
                  </strong>
                </div>
                {parsePrice(formData.strikethroughYearly) > 0 && (
                  <div>
                    <span className="text-[#5F6B63] block">Streich-Jahrespreis (× 12):</span>
                    <strong className="text-gray-500 line-through text-sm">
                      {(parsePrice(formData.strikethroughYearly) * 12).toFixed(2).replace('.', ',')} € / Jahr
                    </strong>
                  </div>
                )}
                <div>
                  <span className="text-[#5F6B63] block">Ersparnis im Jahr:</span>
                  <strong className="text-emerald-700 text-sm">
                    {Math.max(
                      0,
                      ((parsePrice(formData.offerMonthlyPrice) || parsePrice(formData.premiumMonthly)) * 12) -
                        (parsePrice(formData.offerYearlyPrice) * 12)
                    ).toFixed(2).replace('.', ',')} €
                  </strong>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* SECTION 3: Banderole oben rechts */}
      <div className="bg-white border border-[#EDE8E0] rounded-xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-[#EDE8E0]">
          <div>
            <h3 className="font-bold text-base text-[#1B211D] flex items-center gap-2">
              <Eye className="w-4 h-4 text-[#0F4C2E]" />
              3. Aktions-Banderole oben rechts auf der Website
            </h3>
            <p className="text-xs text-[#5F6B63] mt-0.5">
              Zeigt eine auffällige Banderole / Badge in der oberen rechten Bildschirmecke für Besucher an.
            </p>
          </div>

          <label className="flex items-center gap-2.5 cursor-pointer bg-[#FAF8F5] px-3.5 py-2 rounded-lg border border-[#EDE8E0] hover:border-[#0F4C2E]">
            <input
              type="checkbox"
              checked={formData.showRibbon}
              onChange={e => setFormData({ ...formData, showRibbon: e.target.checked })}
              className="w-4 h-4 rounded text-[#0F4C2E] focus:ring-[#0F4C2E]"
            />
            <span className="text-xs font-bold text-[#1B211D]">Banderole anzeigen</span>
          </label>
        </div>

        {formData.showRibbon && (
          <div className="space-y-4 pt-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Banderolen-Text *</label>
                <input
                  type="text"
                  value={formData.ribbonText || ''}
                  onChange={e => setFormData({ ...formData, ribbonText: e.target.value })}
                  className={inputClass}
                  placeholder="🔥 Limitiertes Angebot: Premium ab 4,95 € / Monat!"
                />
              </div>

              <div>
                <label className={labelClass}>Link-Ziel bei Klick *</label>
                <input
                  type="text"
                  value={formData.ribbonLink || ''}
                  onChange={e => setFormData({ ...formData, ribbonLink: e.target.value })}
                  className={inputClass}
                  placeholder="/preise"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>
                  <Palette className="w-3.5 h-3.5 inline mr-1 text-[#5F6B63]" />
                  Hintergrundfarbe
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={formData.ribbonBgColor || '#F2761B'}
                    onChange={e => setFormData({ ...formData, ribbonBgColor: e.target.value })}
                    className="w-10 h-10 rounded border border-gray-300 p-1 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.ribbonBgColor || '#F2761B'}
                    onChange={e => setFormData({ ...formData, ribbonBgColor: e.target.value })}
                    className={inputClass}
                  />
                </div>
                <div className="flex gap-2 mt-2">
                  {['#F2761B', '#0F4C2E', '#DC2626', '#1B211D', '#2563EB'].map(c => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setFormData({ ...formData, ribbonBgColor: c })}
                      style={{ backgroundColor: c }}
                      className="w-6 h-6 rounded-full border border-black/10 cursor-pointer"
                      title={c}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className={labelClass}>Textfarbe</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={formData.ribbonTextColor || '#FFFFFF'}
                    onChange={e => setFormData({ ...formData, ribbonTextColor: e.target.value })}
                    className="w-10 h-10 rounded border border-gray-300 p-1 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.ribbonTextColor || '#FFFFFF'}
                    onChange={e => setFormData({ ...formData, ribbonTextColor: e.target.value })}
                    className={inputClass}
                  />
                </div>
                <div className="flex gap-2 mt-2">
                  {['#FFFFFF', '#1B211D', '#FFF1E4'].map(c => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setFormData({ ...formData, ribbonTextColor: c })}
                      style={{ backgroundColor: c }}
                      className="w-6 h-6 rounded-full border border-black/20 cursor-pointer"
                      title={c}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Live Preview */}
            <div className="p-4 bg-[#FAF8F5] border border-[#EDE8E0] rounded-lg mt-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#8A928B] block mb-2">
                Live-Vorschau der Banderole:
              </span>
              <div className="flex items-center">
                <div
                  style={{
                    backgroundColor: formData.ribbonBgColor || '#F2761B',
                    color: formData.ribbonTextColor || '#FFFFFF'
                  }}
                  className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full shadow-md font-bold text-xs"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{formData.ribbonText || '🔥 Limitiertes Angebot'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* SECTION 4: Bannerwerbung & Konditionen */}
      <div className="bg-white border border-[#EDE8E0] rounded-xl p-6 shadow-sm space-y-4">
        <h3 className="font-bold text-base text-[#1B211D]">4. Bannerwerbung (Skyscraper) & Konditionen</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className={labelClass}>Preis 1–2 Kategorien</label>
            <input
              type="text"
              value={formData.bannerTier1}
              onChange={e => setFormData({ ...formData, bannerTier1: e.target.value })}
              className={inputClass}
              placeholder="24,95 €"
            />
          </div>

          <div>
            <label className={labelClass}>Preis ab 3 Kategorien</label>
            <input
              type="text"
              value={formData.bannerTier2}
              onChange={e => setFormData({ ...formData, bannerTier2: e.target.value })}
              className={inputClass}
              placeholder="19,95 €"
            />
          </div>

          <div>
            <label className={labelClass}>Preis ab 5 Kategorien</label>
            <input
              type="text"
              value={formData.bannerTier3}
              onChange={e => setFormData({ ...formData, bannerTier3: e.target.value })}
              className={inputClass}
              placeholder="14,95 €"
            />
          </div>

          <div className="md:col-span-3">
            <label className={labelClass}>Kündigungsfrist (Text)</label>
            <input
              type="text"
              value={formData.cancellationPeriod}
              onChange={e => setFormData({ ...formData, cancellationPeriod: e.target.value })}
              className={inputClass}
              placeholder="14 Tage"
            />
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={isSaving}
          className="px-6 py-3 rounded-md font-bold text-sm text-white bg-[#F2761B] hover:bg-[#D65F0C] flex items-center gap-2 shadow-md transition-all cursor-pointer"
        >
          <Save className="w-4 h-4" />
          Preise & Aktion speichern
        </button>
      </div>
    </form>
  );
}
