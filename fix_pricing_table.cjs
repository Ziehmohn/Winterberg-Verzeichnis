const fs = require('fs');
let pricing = fs.readFileSync('src/components/PricingTable.tsx', 'utf8');

// Fix the "save" text in the button
pricing = pricing.replace(
  /3 € \/ \{t\("month"\)\}\s*\{t\("save"\)\}/g,
  '36 € / Jahr sparen'
);

// Add zzgl. MwSt. to the price display
pricing = pricing.replace(
  /\/ \{billingCycle === "monthly" \? t\("month"\) : "Jahr"\}/g,
  '/ {billingCycle === "monthly" ? t("month") : "Jahr"} <span className="text-xs ml-1">(netto zzgl. MwSt.)</span>'
);

// Also check SubmitBusiness.tsx just to be sure it has zzgl. MwSt.
let submit = fs.readFileSync('src/components/SubmitBusiness.tsx', 'utf8');
submit = submit.replace(
  /Monatlich \(12,95€\)/g,
  'Monatlich (12,95€ zzgl. MwSt.)'
);
submit = submit.replace(
  /Jährlich \(119,40€\)/g,
  'Jährlich (119,40€ zzgl. MwSt.)'
);

fs.writeFileSync('src/components/PricingTable.tsx', pricing);
fs.writeFileSync('src/components/SubmitBusiness.tsx', submit);
