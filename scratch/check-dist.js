import fs from 'fs';

const localHtml = fs.readFileSync('dist/einzelhandel/buerobedarf/k-office-buerodesign/index.html', 'utf8');
console.log("Local dist HTML length:", localHtml.length);
console.log("Contains 'Jetzt Kontakt':", localHtml.includes('Jetzt Kontakt'));
console.log("Contains 'Hochwertige':", localHtml.includes('Hochwertige'));
console.log("Contains 'Bürodesign':", localHtml.includes('Bürodesign'));
console.log("Contains 'K-OFFICE':", localHtml.includes('K-OFFICE'));
