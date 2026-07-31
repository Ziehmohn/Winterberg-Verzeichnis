const fs = require('fs');
let logoCode = fs.readFileSync('src/components/Logo.tsx', 'utf8');

// The user wants the logo to be larger and white with a transparent background.
// If the image itself is black with transparent background, we can use brightness-0 invert.
logoCode = logoCode.replace(
  'max-h-20 md:max-h-24 w-auto object-contain z-50 ${className}',
  'max-h-28 md:max-h-32 w-auto object-contain z-50 brightness-0 invert ${className}'
);
fs.writeFileSync('src/components/Logo.tsx', logoCode);
