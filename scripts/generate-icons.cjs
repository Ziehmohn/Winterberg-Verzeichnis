const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function main() {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  const svgContent = fs.readFileSync(path.join(__dirname, '../public/favicon.svg'), 'utf8');

  const sizes = [
    { size: 180, file: '../public/apple-touch-icon.png' },
    { size: 192, file: '../public/pwa-icon-192.png' },
    { size: 512, file: '../public/pwa-icon-512.png' },
    { size: 512, file: '../public/logo-green-bg.png' }
  ];

  for (const { size, file } of sizes) {
    await page.setViewport({ width: size, height: size, deviceScaleFactor: 1 });
    const html = `<!DOCTYPE html><html><head><style>* { margin: 0; padding: 0; } html, body { width: ${size}px; height: ${size}px; background: transparent; overflow: hidden; display: flex; }</style></head><body>${svgContent}</body></html>`;
    await page.setContent(html);
    const target = path.join(__dirname, file);
    await page.screenshot({ path: target, omitBackground: true });
    console.log(`Generated ${target}`);
  }

  await browser.close();
  console.log('All icons successfully created from favicon.svg!');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
