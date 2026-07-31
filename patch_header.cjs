const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// replace the header classes
code = code.replace(
  /className=\{`w-full relative z-20 h-\[350px\] pt-6 transition-colors duration-300 \$\{theme\.headerBg\}`\}/,
  "className={`w-full relative z-20 pt-6 pb-16 md:pb-20 transition-colors duration-300 ${theme.headerBg}`}"
);

// replace clip paths
code = code.replace(
  "style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 calc(100% - 10rem))' }}",
  "style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 calc(100% - 5rem))' }}"
);
code = code.replace(
  "style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 14rem), 0 100%)' }}",
  "style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 7rem), 0 100%)' }}"
);

// make the description text a bit smaller
code = code.replace(
  'className="mt-3 text-base md:text-lg max-w-sm text-white drop-shadow-md mx-auto md:mx-0 font-medium"',
  'className="mt-3 text-sm md:text-base max-w-sm text-white drop-shadow-md mx-auto md:mx-0 font-medium"'
);

fs.writeFileSync('src/App.tsx', code);
console.log("Header patched");
