import fs from 'fs';

let content = fs.readFileSync('src/data.ts', 'utf8');

content = content.replace(/(imageUrl:\s*'[^']+')(\s*\n)/g, "$1,$2");

fs.writeFileSync('src/data.ts', content);
console.log('FixedimageUrl commas');
