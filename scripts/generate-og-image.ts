import puppeteer from 'puppeteer';
import path from 'path';

async function run() {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  
  const generate = async (lang: 'de' | 'nl', filename: string) => {
    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 630 });
    const isNl = lang === 'nl';
    const preText = isNl ? 'De' : 'Das';
    const subText = isNl ? 'BEDRIJVENGIDS' : 'VERZEICHNIS';
    const badgeText = isNl ? 'Officiële gids' : 'Offizielles Portal';
    const headline = isNl
      ? `Alle bedrijven, horeca &amp; winkels <span style="color:#F2761B">op één plek.</span>`
      : `Alle Unternehmen, Handwerk &amp; Gastronomie <span style="color:#F2761B">auf einen Blick.</span>`;
    const subline = isNl
      ? 'Vind lokale ondernemingen, openingstijden, contactgegevens, actueel nieuws en vacatures in Winterberg en alle 14 dorpen.'
      : 'Finden Sie regionale Betriebe, Öffnungszeiten, Kontaktdaten, aktuelle News und offene Stellen in Winterberg und allen 14 Ortsteilen.';
    const pill1 = isNl ? '<strong>1.400+</strong> Bedrijven' : '<strong>1.400+</strong> Betriebe';
    const pill2 = isNl ? '<strong>14</strong> Dorpen' : '<strong>14</strong> Ortsteile';
    const pill3 = isNl ? 'Openingstijden &amp; Nooddiensten' : 'Öffnungszeiten &amp; Notdienste';
    const pill4 = isNl ? 'Vacatures &amp; Nieuws' : 'Jobs &amp; News';

    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@500;700;800;900&family=Plus+Jakarta+Sans:wght@500;600;700&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      width: 1200px;
      height: 630px;
      background: radial-gradient(circle at 85% 15%, #186841 0%, #0F4C2E 50%, #06301C 100%);
      font-family: 'Plus Jakarta Sans', sans-serif;
      color: #FFFFFF;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 70px 85px;
      position: relative;
      overflow: hidden;
    }
    .header { display: flex; align-items: center; justify-content: space-between; position: relative; z-index: 2; }
    .brand { display: flex; align-items: baseline; gap: 12px; }
    .brand-pre { font-family: 'Outfit', sans-serif; font-size: 28px; font-weight: 500; color: rgba(255, 255, 255, 0.7); }
    .brand-main { font-family: 'Outfit', sans-serif; font-size: 44px; font-weight: 900; letter-spacing: 0.05em; color: #FFFFFF; line-height: 1; }
    .brand-stroke { width: 100%; height: 9px; display: block; margin-top: 4px; }
    .brand-sub { font-family: 'Outfit', sans-serif; font-size: 19px; font-weight: 700; letter-spacing: 0.38em; color: #FFFFFF; display: block; margin-top: 5px; }
    .badge-portal { background: rgba(255, 255, 255, 0.12); border: 1px solid rgba(255, 255, 255, 0.25); border-radius: 999px; padding: 10px 22px; font-size: 15px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: #FFFFFF; display: inline-flex; align-items: center; gap: 8px; }
    .badge-dot { width: 9px; height: 9px; border-radius: 50%; background: #F2761B; }
    .content { position: relative; z-index: 2; max-width: 950px; margin-top: 10px; }
    .headline { font-family: 'Outfit', sans-serif; font-size: 54px; font-weight: 800; line-height: 1.15; letter-spacing: -0.01em; margin-bottom: 18px; color: #FFFFFF; }
    .subline { font-size: 22px; line-height: 1.45; color: rgba(255, 255, 255, 0.85); font-weight: 500; max-width: 820px; }
    .footer { display: flex; align-items: center; justify-content: space-between; position: relative; z-index: 2; border-top: 1px solid rgba(255, 255, 255, 0.18); padding-top: 26px; }
    .pills { display: flex; align-items: center; gap: 14px; }
    .pill { background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.18); border-radius: 8px; padding: 8px 16px; font-size: 15px; font-weight: 600; color: #FFFFFF; }
    .pill strong { color: #F2761B; font-weight: 700; }
    .domain { font-family: 'Outfit', sans-serif; font-size: 19px; font-weight: 700; letter-spacing: 0.04em; color: rgba(255, 255, 255, 0.9); }
  </style>
</head>
<body>
  <div class="header">
    <div class="brand">
      <span class="brand-pre">${preText}</span>
      <div>
        <span class="brand-main">WINTERBERG</span>
        <svg class="brand-stroke" viewBox="0 0 200 10" preserveAspectRatio="none"><path d="M3 7C38 2 78 1 118 4c28 2 52 5 79 1" stroke="#F2761B" stroke-width="4.5" fill="none" stroke-linecap="round"/></svg>
        <span class="brand-sub">${subText}</span>
      </div>
    </div>
    <div class="badge-portal"><span class="badge-dot"></span>${badgeText}</div>
  </div>
  <div class="content">
    <h1 class="headline">${headline}</h1>
    <p class="subline">${subline}</p>
  </div>
  <div class="footer">
    <div class="pills">
      <div class="pill">${pill1}</div>
      <div class="pill">${pill2}</div>
      <div class="pill">${pill3}</div>
      <div class="pill">${pill4}</div>
    </div>
    <div class="domain"><span style="color:#F2761B">↗</span> winterberg-verzeichnis.de</div>
  </div>
</body>
</html>`;
    await page.setContent(html, { waitUntil: 'load' });
    await new Promise(r => setTimeout(r, 600)); // allow fonts to paint
    await page.screenshot({ path: path.resolve(process.cwd(), filename), type: 'jpeg', quality: 90 });
    await page.close();
    console.log('Saved', filename);
  };

  await generate('de', 'public/og-image.jpg');
  await generate('nl', 'public/og-image-nl.jpg');
  await browser.close();
}

run().catch(console.error);
