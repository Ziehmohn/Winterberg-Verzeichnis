import fs from 'fs';

fetch('https://www.winterberg-verzeichnis.de/einzelhandel/buerobedarf/k-office-buerodesign')
  .then(r => r.text())
  .then(html => {
    fs.writeFileSync('scratch/live.html', html);
    console.log("HTML length:", html.length);
    console.log("Contains 'Jetzt Kontakt':", html.includes('Jetzt Kontakt'));
    console.log("Contains 'Hochwertige':", html.includes('Hochwertige'));
    console.log("Contains 'Bürodesign':", html.includes('Bürodesign'));
    console.log("Contains '404':", html.includes('404') || html.includes('Nicht gefunden'));
  });
