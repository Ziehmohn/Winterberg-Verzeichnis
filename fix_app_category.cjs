const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf8');

// Fix category strings rendering
content = content.replace(
  /\{bus\.subcategory \? \`\$\{bus\.category\} — \$\{bus\.subcategory\}\` : bus\.category\}/g,
  '{bus.subcategory ? `${t(bus.category)} — ${t(bus.subcategory)}` : t(bus.category)}'
);

content = content.replace(
  /\{matchedBusiness\.subcategory \? \`\$\{matchedBusiness\.category\} — \$\{matchedBusiness\.subcategory\}\` : matchedBusiness\.category\}/g,
  '{matchedBusiness.subcategory ? `${t(matchedBusiness.category)} — ${t(matchedBusiness.subcategory)}` : t(matchedBusiness.category)}'
);

content = content.replace(
  /\{business\.subcategory \? \`\$\{business\.category\} — \$\{business\.subcategory\}\` : business\.category\}/g,
  '{business.subcategory ? `${t(business.category)} — ${t(business.subcategory)}` : t(business.category)}'
);

fs.writeFileSync('src/App.tsx', content);
