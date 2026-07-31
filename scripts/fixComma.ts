import fs from 'fs';

let content = fs.readFileSync('src/data.ts', 'utf8');

content = content.replace(/(imageFallback:\s*(?:'[^']*'|"[^"]*"))\s*,?\s*\n\s*imageUrl:\s*'[^']+',?/g, "$1");

fs.writeFileSync('src/data.ts', content);
console.log('Fixed syntax');
