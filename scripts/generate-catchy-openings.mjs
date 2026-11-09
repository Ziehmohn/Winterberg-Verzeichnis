import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const outputDir = path.join(rootDir, 'public');
const artifactDir = 'C:/Users/simon/.gemini/antigravity/brain/9e781da6-98b2-44c4-ad42-6b0f1a1c1303';

// VARIANT 1: Bold Scroll-Stopper (Forest Green & Punchy Orange / Neon)
const html1 = `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@600;700;800;900&family=Plus+Jakarta+Sans:wght@700;800&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      width: 1080px;
      height: 1080px;
      overflow: hidden;
      font-family: 'Outfit', sans-serif;
      background: #0B3D23;
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 70px 70px 80px;
      color: #FFFFFF;
    }

    /* Dramatic glowing mesh behind headline */
    .glow-orange {
      position: absolute;
      width: 650px;
      height: 650px;
      background: radial-gradient(circle, rgba(242, 118, 27, 0.35) 0%, transparent 65%);
      top: 150px;
      left: 180px;
      filter: blur(80px);
      pointer-events: none;
    }
    .glow-green {
      position: absolute;
      width: 500px;
      height: 500px;
      background: radial-gradient(circle, rgba(46, 204, 113, 0.25) 0%, transparent 65%);
      bottom: 50px;
      right: 50px;
      filter: blur(70px);
      pointer-events: none;
    }

    .top-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: relative;
      z-index: 10;
    }

    .brand-pill {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      background: rgba(255, 255, 255, 0.12);
      border: 1px solid rgba(255, 255, 255, 0.25);
      backdrop-filter: blur(12px);
      padding: 10px 22px;
      border-radius: 999px;
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 17px;
      font-weight: 700;
      color: #FFFFFF;
      letter-spacing: 0.02em;
    }

    .badge-0euro {
      background: #F2761B;
      color: #FFFFFF;
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 16px;
      font-weight: 800;
      padding: 10px 22px;
      border-radius: 999px;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      box-shadow: 0 8px 24px rgba(242, 118, 27, 0.45);
    }

    /* CENTER HOOK - CATCHY & HUGE */
    .center-hook {
      position: relative;
      z-index: 10;
      display: flex;
      flex-direction: column;
      gap: 18px;
    }

    .eyebrow-tag {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 26px;
      font-weight: 800;
      color: #FFA459;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .giant-title {
      font-size: 92px;
      font-weight: 900;
      line-height: 0.98;
      letter-spacing: -0.035em;
      text-transform: uppercase;
    }

    .highlight-text {
      color: #F2761B;
      text-shadow: 0 8px 30px rgba(242, 118, 27, 0.4);
      display: block;
    }

    .punch-sub {
      font-size: 32px;
      font-weight: 600;
      color: #E2EFE7;
      line-height: 1.25;
      max-width: 880px;
      margin-top: 6px;
    }

    .punch-sub strong {
      color: #FFFFFF;
      font-weight: 800;
    }

    /* BOTTOM BAR */
    .bottom-bar {
      position: relative;
      z-index: 10;
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: rgba(0, 0, 0, 0.35);
      border: 1.5px solid rgba(255, 255, 255, 0.2);
      backdrop-filter: blur(20px);
      padding: 24px 34px;
      border-radius: 24px;
    }

    .bottom-claim {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .bottom-claim-main {
      font-size: 24px;
      font-weight: 800;
      color: #FFFFFF;
    }

    .bottom-claim-sub {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 16px;
      font-weight: 600;
      color: #FFA459;
    }

    .cta-pill {
      background: #FFFFFF;
      color: #0B3D23;
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 19px;
      font-weight: 800;
      padding: 16px 32px;
      border-radius: 999px;
      display: inline-flex;
      align-items: center;
      gap: 10px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
    }
  </style>
</head>
<body>
  <div class="glow-orange"></div>
  <div class="glow-green"></div>

  <div class="top-bar">
    <div class="brand-pill">
      <span>📍 Winterberg & Region</span>
    </div>
    <div class="badge-0euro">
      ✓ 100% Kostenlos
    </div>
  </div>

  <div class="center-hook">
    <div class="eyebrow-tag">
      <span>✨ Neues Geschäft oder Lokal?</span>
    </div>
    <h1 class="giant-title">
      NEUERÖFFNUNG<br>
      IN <span class="highlight-text">WINTERBERG?</span>
    </h1>
    <p class="punch-sub">
      Sei ab Tag 1 ganz oben bei <strong>Google</strong> und in der <strong>KI-Suche</strong>.
    </p>
  </div>

  <div class="bottom-bar">
    <div class="bottom-claim">
      <div class="bottom-claim-main">Jetzt Betrieb eintragen</div>
      <div class="bottom-claim-sub">winterberg-verzeichnis.de</div>
    </div>
    <div class="cta-pill">
      <span>Hier anmelden</span>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
        <line x1="5" y1="12" x2="19" y2="12"></line>
        <polyline points="12 5 19 12 12 19"></polyline>
      </svg>
    </div>
  </div>
</body>
</html>
`;

// VARIANT 2: Catchy Sticker / Badge Poster (High Contrast Yellow/Orange & Dark Forest)
const html2 = `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@700;800;900&family=Plus+Jakarta+Sans:wght@700;800&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      width: 1080px;
      height: 1080px;
      overflow: hidden;
      font-family: 'Outfit', sans-serif;
      background: #092C1A;
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 70px 70px 80px;
      color: #FFFFFF;
    }

    /* Giant Badge / Sticker graphic in center */
    .bg-circle {
      position: absolute;
      width: 800px;
      height: 800px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(242, 118, 27, 0.18) 0%, transparent 68%);
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      pointer-events: none;
    }

    .top-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      z-index: 10;
    }

    .tag-open {
      background: #FFE814;
      color: #092C1A;
      font-family: 'Outfit', sans-serif;
      font-size: 22px;
      font-weight: 900;
      padding: 10px 24px;
      border-radius: 12px;
      letter-spacing: 0.05em;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      box-shadow: 0 8px 24px rgba(255, 232, 20, 0.3);
      transform: rotate(-2deg);
    }

    .domain-tag {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 18px;
      font-weight: 700;
      color: #A3D8B8;
    }

    /* Central Impact Message */
    .center-card {
      z-index: 10;
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .big-question {
      font-size: 38px;
      font-weight: 700;
      color: #A3D8B8;
      letter-spacing: -0.01em;
    }

    .power-statement {
      font-size: 84px;
      font-weight: 900;
      line-height: 1.02;
      letter-spacing: -0.03em;
    }

    .power-statement span.accent {
      color: #FFE814;
      text-decoration: underline;
      text-decoration-color: #F2761B;
      text-underline-offset: 8px;
    }

    /* Big Punchy Pills */
    .pill-row {
      display: flex;
      gap: 14px;
      flex-wrap: wrap;
      margin-top: 6px;
    }

    .feature-pill {
      background: rgba(255, 255, 255, 0.12);
      border: 1.5px solid rgba(255, 255, 255, 0.25);
      padding: 12px 24px;
      border-radius: 999px;
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 19px;
      font-weight: 700;
      color: #FFFFFF;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .bottom-banner {
      z-index: 10;
      background: linear-gradient(90deg, #F2761B 0%, #D85C04 100%);
      padding: 22px 36px;
      border-radius: 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-shadow: 0 12px 35px rgba(242, 118, 27, 0.45);
    }

    .banner-text {
      font-size: 26px;
      font-weight: 900;
      letter-spacing: -0.01em;
      color: #FFFFFF;
    }

    .banner-cta {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 18px;
      font-weight: 800;
      background: #FFFFFF;
      color: #D85C04;
      padding: 12px 26px;
      border-radius: 999px;
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }
  </style>
</head>
<body>
  <div class="bg-circle"></div>

  <div class="top-row">
    <div class="tag-open">
      <span>🚀 NEUERÖFFNUNG</span>
    </div>
    <div class="domain-tag">
      winterberg-verzeichnis.de
    </div>
  </div>

  <div class="center-card">
    <div class="big-question">
      Neu in Winterberg oder den Ortsteilen?
    </div>
    <h1 class="power-statement">
      Werde sofort bei <span class="accent">Google & KI</span> gefunden.
    </h1>
    <div class="pill-row">
      <div class="feature-pill">🔍 Top Google-Ranking</div>
      <div class="feature-pill">🤖 KI-Suche (ChatGPT & Co.)</div>
      <div class="feature-pill">🏷️ 100% Kostenlos</div>
    </div>
  </div>

  <div class="bottom-banner">
    <div class="banner-text">
      Jetzt kostenlos eintragen!
    </div>
    <div class="banner-cta">
      <span>Hier eintragen</span>
      ➔
    </div>
  </div>
</body>
</html>
`;

// VARIANT 3: Light Clean Editorial Poster (White / Cream with Punchy Green & Orange)
const html3 = `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@700;800;900&family=Plus+Jakarta+Sans:wght@700;800&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      width: 1080px;
      height: 1080px;
      overflow: hidden;
      font-family: 'Outfit', sans-serif;
      background: #FAF8F5;
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 70px 70px 80px;
      color: #0F4C2E;
    }

    .top-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      z-index: 10;
    }

    .brand-tag {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 19px;
      font-weight: 800;
      color: #0F4C2E;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .free-badge {
      background: #FEEFE6;
      border: 1.5px solid #F8C39E;
      color: #D85C04;
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 16px;
      font-weight: 800;
      padding: 8px 20px;
      border-radius: 999px;
    }

    /* CENTER */
    .center-content {
      z-index: 10;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .eyebrow {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 24px;
      font-weight: 800;
      color: #F2761B;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .huge-headline {
      font-size: 88px;
      font-weight: 900;
      line-height: 0.98;
      letter-spacing: -0.03em;
      color: #0F4C2E;
    }

    .huge-headline span.orange {
      color: #F2761B;
    }

    .catchy-sub {
      font-size: 30px;
      font-weight: 600;
      color: #3F5245;
      line-height: 1.3;
      margin-top: 8px;
      max-width: 860px;
    }

    .catchy-sub strong {
      color: #0F4C2E;
      font-weight: 800;
    }

    .bottom-cta {
      z-index: 10;
      background: #0F4C2E;
      color: #FFFFFF;
      padding: 24px 38px;
      border-radius: 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-shadow: 0 12px 30px rgba(15, 76, 46, 0.2);
    }

    .cta-text {
      font-size: 24px;
      font-weight: 800;
    }

    .cta-sub {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 15px;
      color: #A3D8B8;
      margin-top: 2px;
    }

    .cta-button-light {
      background: #F2761B;
      color: #FFFFFF;
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 18px;
      font-weight: 800;
      padding: 14px 28px;
      border-radius: 999px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
  </style>
</head>
<body>
  <div class="top-row">
    <div class="brand-tag">
      <span>📍 Winterberg Unternehmen</span>
    </div>
    <div class="free-badge">
      ✓ Kostenloser Eintrag
    </div>
  </div>

  <div class="center-content">
    <div class="eyebrow">
      ✨ Neu in der Region?
    </div>
    <h1 class="huge-headline">
      NEUERÖFFNUNG<br>
      IN <span class="orange">WINTERBERG?</span>
    </h1>
    <p class="catchy-sub">
      Lass dein Business ab Tag 1 bei <strong>Google & in der KI-Suche</strong> finden.
    </p>
  </div>

  <div class="bottom-cta">
    <div>
      <div class="cta-text">Jetzt kostenlos eintragen</div>
      <div class="cta-sub">winterberg-verzeichnis.de/themen/neueroeffnungen-in-winterberg</div>
    </div>
    <div class="cta-button-light">
      <span>Hier anmelden</span> ➔
    </div>
  </div>
</body>
</html>
`;

async function main() {
  console.log('Rendering Catchy Posters...');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1080, height: 1080, deviceScaleFactor: 2 });

  // 1. Poster 1
  await page.setContent(html1, { waitUntil: 'domcontentloaded' });
  await page.evaluateHandle('document.fonts.ready');
  await new Promise(r => setTimeout(r, 500));
  const p1Out = path.join(outputDir, 'instagram-catchy-neueroeffnung-1.png');
  const p1Art = path.join(artifactDir, 'instagram-catchy-neueroeffnung-1.png');
  await page.screenshot({ path: p1Out, type: 'png' });
  await page.screenshot({ path: p1Art, type: 'png' });

  // 2. Poster 2
  await page.setContent(html2, { waitUntil: 'domcontentloaded' });
  await page.evaluateHandle('document.fonts.ready');
  await new Promise(r => setTimeout(r, 500));
  const p2Out = path.join(outputDir, 'instagram-catchy-neueroeffnung-2.png');
  const p2Art = path.join(artifactDir, 'instagram-catchy-neueroeffnung-2.png');
  await page.screenshot({ path: p2Out, type: 'png' });
  await page.screenshot({ path: p2Art, type: 'png' });

  // 3. Poster 3
  await page.setContent(html3, { waitUntil: 'domcontentloaded' });
  await page.evaluateHandle('document.fonts.ready');
  await new Promise(r => setTimeout(r, 500));
  const p3Out = path.join(outputDir, 'instagram-catchy-neueroeffnung-3.png');
  const p3Art = path.join(artifactDir, 'instagram-catchy-neueroeffnung-3.png');
  await page.screenshot({ path: p3Out, type: 'png' });
  await page.screenshot({ path: p3Art, type: 'png' });

  await browser.close();
  console.log('Done rendering 3 Catchy Posters!');
}

main().catch(console.error);
