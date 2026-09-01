const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  page.on('pageerror', err => {
    console.error('PAGE ERROR:', err.message);
  });
  
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.error('CONSOLE ERROR:', msg.text());
    }
  });

  try {
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
    console.log('Page loaded successfully');

    console.log('Clicking on Alle Unternehmen link...');
    const links = await page.$$('a');
    for (const link of links) {
      const text = await page.evaluate(el => el.textContent, link);
      if (text && text.includes('Unternehmen')) {
        await link.click();
        break;
      }
    }
    await new Promise(r => setTimeout(r, 2000));
  } catch (err) {
    console.error('Navigation error:', err.message);
  }

  await browser.close();
})();
