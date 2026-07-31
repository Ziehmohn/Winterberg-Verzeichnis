const fs = require('fs');
let logoCode = fs.readFileSync('src/components/Logo.tsx', 'utf8');

logoCode = logoCode.replace(
  'max-h-20 md:max-h-24 w-auto object-contain z-50 invert mix-blend-screen ${className}',
  'max-h-24 md:max-h-32 w-auto object-contain z-50 brightness-0 invert ${className}'
);
fs.writeFileSync('src/components/Logo.tsx', logoCode);
