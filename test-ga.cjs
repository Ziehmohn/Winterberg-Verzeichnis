const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  
  // Intercept network requests
  await page.setRequestInterception(true);
  let gaFired = false;
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  
  page.on('request', request => {
    const url = request.url();
    if (url.includes('google-analytics.com/g/collect')) {
      console.log('✅ GA4 Hit Fired:', url.substring(0, 150) + '...');
      if (url.includes('G-77PLYCGN1S')) {
        console.log('✅ CORRECT MEASUREMENT ID FOUND!');
      }
      gaFired = true;
    }
    request.continue();
  });

  console.log('Navigating to http://localhost:3000 ...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
  
  console.log('Waiting for cookie banner...');
  const buttons = await page.$$('button');
  for (const button of buttons) {
    const text = await page.evaluate(el => el.textContent, button);
    if (text && (text.includes('akzeptieren') || text.includes('accepteren'))) {
      console.log('Clicking accept button: ' + text);
      await button.click();
      break;
    }
  }

  // wait a bit for GA to fire
  await new Promise(r => setTimeout(r, 5000));
  
  if (!gaFired) {
    console.log('❌ NO GA4 HIT FIRED!');
  }
  
  await browser.close();
  console.log('Done.');
})();
