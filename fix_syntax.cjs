const fs = require('fs');
let content = fs.readFileSync('src/i18n.tsx', 'utf8');

// Find the bad insert
const badInsertStart = content.indexOf('}};\n    "Branchen": "Branches",');
if (badInsertStart !== -1) {
    // We just need to fix this part
    let before = content.substring(0, badInsertStart);
    let after = content.substring(badInsertStart + 3); // Skip }};
    
    // now we have:
    // ... "Alle": "Alle" \n    "Branchen": "Branches", ...
    // wait, we need a comma after "Alle": "Alle"
    before = before.replace(/"Alle": "Alle"$/, '"Alle": "Alle",');
    
    // We need to re-add }}; before export const I18nContext
    after = after.replace(/export const I18nContext/, '  }\n};\nexport const I18nContext');
    
    fs.writeFileSync('src/i18n.tsx', before + after);
}
