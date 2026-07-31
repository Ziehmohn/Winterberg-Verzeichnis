import fs from 'fs';
const content = fs.readFileSync('src/data.ts', 'utf-8');
const matches = [...content.matchAll(/subcategory:\s*'([^']+)'/g)];
const subs = new Set(matches.map(m => m[1]));
console.log(Array.from(subs).join(', '));
