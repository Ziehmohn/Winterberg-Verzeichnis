const fs = require('fs');

// 1. Update Logo component
let logoCode = fs.readFileSync('src/components/Logo.tsx', 'utf8');
logoCode = logoCode.replace('max-h-32 md:max-h-40', 'max-h-20 md:max-h-24');
fs.writeFileSync('src/components/Logo.tsx', logoCode);

// 2. Update App.tsx header padding and clip paths
let appCode = fs.readFileSync('src/App.tsx', 'utf8');

// Increase bottom padding
appCode = appCode.replace(
  'className={`w-full relative z-20 pt-6 pb-16 md:pb-20 transition-colors duration-300 ${theme.headerBg}`}',
  'className={`w-full relative z-20 pt-6 pb-24 md:pb-32 transition-colors duration-300 ${theme.headerBg}`}'
);

// Reduce clip path steepness to avoid cutting off text
appCode = appCode.replace(
  "style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 calc(100% - 5rem))' }}",
  "style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 calc(100% - 3rem))' }}"
);
appCode = appCode.replace(
  "style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 7rem), 0 100%)' }}",
  "style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 4rem), 0 100%)' }}"
);

fs.writeFileSync('src/App.tsx', appCode);
console.log("Layout patched");
