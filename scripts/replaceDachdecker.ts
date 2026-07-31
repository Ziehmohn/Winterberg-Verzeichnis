import fs from 'fs';
let content = fs.readFileSync('src/data.ts', 'utf8');
content = content.replace(/1549419139-4467dcba9710/g, '1600585154340-be6161a56a0c');
fs.writeFileSync('src/data.ts', content);
