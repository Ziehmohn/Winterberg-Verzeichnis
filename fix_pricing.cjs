const fs = require('fs');

// --- Fix PricingTable.tsx ---
let pricing = fs.readFileSync('src/components/PricingTable.tsx', 'utf8');
pricing = pricing.replace(/'"{t\("monthlyCancelable"\)}"'/g, '{t("monthlyCancelable")}');
pricing = pricing.replace(/'\+t\("monthlyCancelable"\)\+'/g, '{t("monthlyCancelable")}');
pricing = pricing.replace(/\{\s*billingCycle === 'monthly' \? '\{t\("month"\)\}' : 'Jahr'\s*\}/g, '{billingCycle === "monthly" ? t("month") : "Jahr"}');
pricing = pricing.replace(/<div className="text-3xl font-bold text-orange-900">\s*\{billingCycle === 'monthly' \? '12,95 €' : '119,40 €'\}\s*<\/div>/g, 
  `<div className="text-3xl font-bold text-orange-900">
                {billingCycle === 'monthly' ? '12,95 €' : '119,40 €'}
              </div>`);
              
pricing = pricing.replace(/<div className="text-base font-normal opacity-70 mb-1">\s*\/ \{billingCycle === 'monthly' \? t\("month"\) : 'Jahr'\}\s*<\/div>/, 
  `<div className="text-base font-normal opacity-70 mb-1">
                / {billingCycle === 'monthly' ? t("month") : 'Jahr'} <span className="text-xs ml-1">(zzgl. MwSt.)</span>
              </div>`);

fs.writeFileSync('src/components/PricingTable.tsx', pricing);

// --- Fix SubmitBusiness.tsx ---
let submit = fs.readFileSync('src/components/SubmitBusiness.tsx', 'utf8');

// Add state for billing cycle
const importStatement = `import React, { useState } from 'react';`;
submit = submit.replace(`import React, { useState } from 'react';`, `import React, { useState } from 'react';`);

const stateDecl = `  const [selectedPlan, setSelectedPlan] = useState<'free' | 'premium'>('free');`;
if (!submit.includes('billingCycle')) {
    submit = submit.replace(stateDecl, stateDecl + `\n  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');`);
}

// Replace premium card
const oldPremiumCard = `<div 
              // onClick={() => setSelectedPlan('premium')} // Disabled for now
              className={\`cursor-not-allowed opacity-60 p-4 border-2 transition-all \${activeThemeKey === 'modern' ? 'rounded-none' : 'rounded-xl'} border-black/10\`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="font-bold text-lg flex items-center gap-2">Premium <ShieldCheck className="w-4 h-4 text-emerald-500" /></div>
                {selectedPlan === 'premium' && <CheckCircle2 className="w-5 h-5 text-orange-500" />}
              </div>
              <div className="font-bold mb-1 text-black/80">19,95 € <span className="text-xs font-normal">/ {t("month")}</span></div>
              <div className="text-sm mb-3 text-black/60">{t("premiumYearlyDesc")}</div>`;

const newPremiumCard = `<div 
              onClick={() => setSelectedPlan('premium')}
              className={\`cursor-pointer p-4 border-2 transition-all \${activeThemeKey === 'modern' ? 'rounded-none' : 'rounded-xl'} \${selectedPlan === 'premium' ? 'border-orange-500 bg-orange-50/50' : 'border-black/10 hover:border-black/20'}\`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="font-bold text-lg flex items-center gap-2">Premium <ShieldCheck className="w-4 h-4 text-emerald-500" /></div>
                {selectedPlan === 'premium' && <CheckCircle2 className="w-5 h-5 text-orange-500" />}
              </div>
              
              {selectedPlan === 'premium' ? (
                <div className="flex bg-white border border-black/10 p-1 rounded-lg mb-3">
                  <div 
                    onClick={(e) => { e.stopPropagation(); setBillingCycle('monthly'); }}
                    className={\`flex-1 text-center py-1 text-xs font-medium rounded transition-colors \${billingCycle === 'monthly' ? 'bg-orange-100 text-orange-900' : 'text-black/60 hover:text-black'}\`}
                  >
                    Monatlich (12,95€)
                  </div>
                  <div 
                    onClick={(e) => { e.stopPropagation(); setBillingCycle('yearly'); }}
                    className={\`flex-1 text-center py-1 text-xs font-medium rounded transition-colors \${billingCycle === 'yearly' ? 'bg-orange-100 text-orange-900' : 'text-black/60 hover:text-black'}\`}
                  >
                    Jährlich (119,40€)
                  </div>
                </div>
              ) : (
                 <div className="font-bold mb-1 text-black/80">ab 9,95 € <span className="text-xs font-normal">/ {t("month")} zzgl. MwSt.</span></div>
              )}
              
              <div className="text-sm mb-3 text-black/60">Hervorgehobene Platzierung, Galerie, Jobs & mehr.</div>`;

submit = submit.replace(oldPremiumCard, newPremiumCard);

// Enable the submit button by removing the disabled message
const disabledMessage = `<div className="mt-4 p-2 bg-orange-100 text-orange-800 text-xs font-bold rounded">
                Die Bezahlfunktion wird in Kürze eingerichtet. Aktuell ist nur der {t("basicEntry")} verfügbar.
              </div>`;
submit = submit.replace(disabledMessage, '');

fs.writeFileSync('src/components/SubmitBusiness.tsx', submit);


// --- Fix AGB.tsx ---
let agb = fs.readFileSync('src/components/AGB.tsx', 'utf8');

const agbSection = `<h3 className="font-bold mb-2">4. {t("contractDuration")}</h3>
        <p className="mb-4">
          Die Laufzeit von Premium-Einträgen ergibt sich aus dem gewählten Paket. Ohne fristgerechte Kündigung verlängert sich der Vertrag automatisch.
        </p>`;

const newAgbSection = `<h3 className="font-bold mb-2">4. {t("contractDuration")} und Kündigung</h3>
        <p className="mb-4">
          Die Laufzeit von Premium-Einträgen ergibt sich aus dem gewählten Paket (monatlich oder jährlich). Ohne fristgerechte Kündigung verlängert sich der Vertrag automatisch. 
          Kündigungen von kostenpflichtigen Verträgen bedürfen der Textform (schriftlich per E-Mail) oder können formlos und jederzeit direkt über das Nutzer-Backend durch Klick auf den entsprechenden Kündigungs-Button eingereicht werden.
        </p>`;
        
agb = agb.replace(agbSection, newAgbSection);
fs.writeFileSync('src/components/AGB.tsx', agb);

// --- Fix AdminDashboard / Abrechnung in App.tsx ---
let app = fs.readFileSync('src/App.tsx', 'utf8');
const abrechnungTab = `                ) : activeTab === 'abrechnung' ? (
          <div className="p-8 text-center text-black/50">
            <p>Die Abrechnungsfunktionen werden in Kürze freigeschaltet.</p>
            <p className="text-sm mt-2">Hier finden Sie zukünftig Ihre Rechnungen und Zahlungsinformationen.</p>
          </div>
        ) : activeTab === 'seo' ? (`;

const newAbrechnungTab = `                ) : activeTab === 'abrechnung' ? (
          <div className="p-6">
            <h3 className="text-xl font-bold mb-6">Abrechnung & Abonnements</h3>
            
            <div className="bg-white border rounded-xl p-6 mb-6">
               <div className="flex justify-between items-start mb-4">
                 <div>
                   <h4 className="font-bold text-lg mb-1">Premium-Abonnement</h4>
                   <p className="text-sm text-black/60">Aktueller Status: <span className="text-green-600 font-bold">Aktiv</span></p>
                 </div>
                 <div className="text-right">
                   <div className="text-xl font-bold">12,95 € <span className="text-sm font-normal text-black/60">/ Monat</span></div>
                   <div className="text-xs text-black/40">zzgl. MwSt.</div>
                 </div>
               </div>
               
               <div className="flex flex-col sm:flex-row gap-4 border-t pt-4">
                 <div className="flex-1">
                   <p className="text-xs text-black/50 mb-1">Nächste Zahlung</p>
                   <p className="font-medium">01. {t("month")} 2026</p>
                 </div>
                 <div className="flex-1">
                   <p className="text-xs text-black/50 mb-1">Zahlungsmethode</p>
                   <p className="font-medium flex items-center gap-2"><CreditCard className="w-4 h-4"/> Visa endend auf 4242</p>
                 </div>
                 <div>
                   <button 
                     onClick={() => {
                        if (confirm('Möchten Sie Ihr Premium-Abonnement wirklich kündigen? Zukünftige Zahlungen werden gestoppt und Sie erhalten eine Bestätigung per E-Mail.')) {
                            alert('Das Abonnement wurde erfolgreich gekündigt. Sie erhalten in Kürze eine E-Mail-Bestätigung (simuliert via Stripe).');
                        }
                     }}
                     className="px-4 py-2 text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition-colors"
                   >
                     Abo kündigen
                   </button>
                 </div>
               </div>
            </div>
            
            <h3 className="text-lg font-bold mb-4">Rechnungen</h3>
            <div className="bg-white border rounded-xl overflow-hidden">
               <table className="w-full text-left text-sm">
                 <thead className="bg-black/5">
                   <tr>
                     <th className="py-2 px-4 font-medium">Datum</th>
                     <th className="py-2 px-4 font-medium">Betrag</th>
                     <th className="py-2 px-4 font-medium">Status</th>
                     <th className="py-2 px-4 font-medium">Download</th>
                   </tr>
                 </thead>
                 <tbody>
                   <tr className="border-t">
                     <td className="py-3 px-4">01.07.2025</td>
                     <td className="py-3 px-4">15,41 € (inkl. MwSt.)</td>
                     <td className="py-3 px-4"><span className="text-green-600 bg-green-50 px-2 py-0.5 rounded text-xs font-bold">Bezahlt</span></td>
                     <td className="py-3 px-4"><button className="text-blue-600 hover:underline">PDF herunterladen</button></td>
                   </tr>
                   <tr className="border-t">
                     <td className="py-3 px-4">01.06.2025</td>
                     <td className="py-3 px-4">15,41 € (inkl. MwSt.)</td>
                     <td className="py-3 px-4"><span className="text-green-600 bg-green-50 px-2 py-0.5 rounded text-xs font-bold">Bezahlt</span></td>
                     <td className="py-3 px-4"><button className="text-blue-600 hover:underline">PDF herunterladen</button></td>
                   </tr>
                 </tbody>
               </table>
            </div>
          </div>
        ) : activeTab === 'seo' ? (`;
app = app.replace(abrechnungTab, newAbrechnungTab);
fs.writeFileSync('src/App.tsx', app);
