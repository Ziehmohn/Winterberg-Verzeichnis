import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Read the actual winterberg-header image and convert to Base64 data URI
const headerImagePath = path.join(rootDir, 'public', 'winterberg-header.webp');
const headerImageBase64 = fs.readFileSync(headerImagePath).toString('base64');
const headerImageDataUri = `data:image/webp;base64,${headerImageBase64}`;

const iconPath = path.join(rootDir, 'public', 'pwa-icon-512.png');
const iconBase64 = fs.readFileSync(iconPath).toString('base64');
const iconDataUri = `data:image/png;base64,${iconBase64}`;

const outputDir = path.join(rootDir, 'public');

// 1. Inviting Square Post (1080 x 1080 px)
const templateSquare = `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Caveat:wght@600;700&display=swap" rel="stylesheet">
  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      width: 1080px;
      height: 1080px;
      overflow: hidden;
      font-family: 'Plus Jakarta Sans', -apple-system, sans-serif;
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      padding: 64px 60px;
      background-image: 
        radial-gradient(circle at 50% 25%, rgba(242, 118, 27, 0.15) 0%, transparent 60%),
        linear-gradient(155deg, rgba(6, 40, 23, 0.90) 0%, rgba(15, 76, 46, 0.82) 45%, rgba(6, 32, 18, 0.94) 100%),
        url('${headerImageDataUri}');
      background-size: cover;
      background-position: center 30%;
      color: #FFFFFF;
    }

    /* TOP LOGO CONTAINER */
    .top-logo-card {
      display: flex;
      align-items: center;
      gap: 16px;
      background: rgba(255, 255, 255, 0.10);
      border: 1.5px solid rgba(255, 255, 255, 0.22);
      backdrop-filter: blur(14px);
      padding: 14px 32px;
      border-radius: 999px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
    }
    .logo-container {
      display: flex;
      align-items: baseline;
      gap: 10px;
    }
    .logo-pre {
      font-family: 'Outfit', sans-serif;
      font-size: 22px;
      font-weight: 500;
      color: rgba(255, 255, 255, 0.85);
    }
    .logo-text-block {
      display: flex;
      flex-direction: column;
    }
    .logo-main {
      font-family: 'Outfit', sans-serif;
      font-size: 32px;
      font-weight: 900;
      letter-spacing: 0.04em;
      color: #FFFFFF;
      line-height: 1;
    }
    .orange-swoosh {
      width: 100%;
      height: 7px;
      margin-top: 2px;
      display: block;
    }
    .logo-sub {
      font-family: 'Outfit', sans-serif;
      font-size: 13.5px;
      font-weight: 700;
      letter-spacing: 0.36em;
      color: #FFA459;
      margin-top: 3px;
      line-height: 1;
    }

    /* CENTRAL GLASS CARD */
    .welcome-card {
      width: 100%;
      max-width: 960px;
      background: rgba(255, 255, 255, 0.08);
      border: 1.5px solid rgba(255, 255, 255, 0.24);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border-radius: 36px;
      padding: 48px 52px;
      text-align: center;
      box-shadow: 
        0 24px 60px rgba(0, 0, 0, 0.38),
        inset 0 1px 2px rgba(255, 255, 255, 0.35);
      position: relative;
    }

    .welcome-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: rgba(255, 255, 255, 0.14);
      border: 1px solid rgba(255, 255, 255, 0.28);
      padding: 8px 22px;
      border-radius: 999px;
      font-size: 16px;
      font-weight: 700;
      letter-spacing: 0.04em;
      color: #FFA459;
      margin-bottom: 20px;
      text-transform: uppercase;
    }

    .greeting-title {
      font-family: 'Outfit', sans-serif;
      font-size: 68px;
      font-weight: 900;
      line-height: 1.05;
      letter-spacing: -0.02em;
      color: #FFFFFF;
      margin-bottom: 14px;
    }
    .wave-emoji {
      display: inline-block;
      filter: drop-shadow(0 4px 10px rgba(0,0,0,0.3));
    }

    .greeting-sub {
      font-family: 'Outfit', sans-serif;
      font-size: 26px;
      font-weight: 600;
      color: #FFA459;
      margin-bottom: 22px;
      letter-spacing: -0.01em;
    }

    .greeting-desc {
      font-size: 20px;
      line-height: 1.6;
      color: rgba(255, 255, 255, 0.92);
      max-width: 780px;
      margin: 0 auto 32px auto;
      font-weight: 400;
    }

    /* 4 CORNER PILLS */
    .features-row {
      display: flex;
      justify-content: center;
      gap: 12px;
      flex-wrap: wrap;
    }
    .feature-pill {
      display: flex;
      align-items: center;
      gap: 8px;
      background: rgba(0, 0, 0, 0.28);
      border: 1px solid rgba(255, 255, 255, 0.2);
      padding: 10px 20px;
      border-radius: 999px;
      font-size: 16px;
      font-weight: 600;
      color: #FFFFFF;
      backdrop-filter: blur(8px);
    }
    .pill-icon {
      font-size: 18px;
    }

    /* BOTTOM CTA & DOMAIN */
    .bottom-section {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 14px;
    }
    .cta-button {
      background: linear-gradient(135deg, #F2761B 0%, #FFA459 100%);
      color: #FFFFFF;
      font-family: 'Outfit', sans-serif;
      font-size: 20px;
      font-weight: 800;
      letter-spacing: 0.02em;
      padding: 16px 42px;
      border-radius: 999px;
      display: flex;
      align-items: center;
      gap: 10px;
      box-shadow: 0 8px 24px rgba(242, 118, 27, 0.45);
      border: none;
    }
    .cta-hint {
      font-size: 15px;
      color: rgba(255, 255, 255, 0.8);
      font-weight: 500;
    }
  </style>
</head>
<body>
  <!-- TOP LOGO -->
  <div class="top-logo-card">
    <div class="logo-container">
      <span class="logo-pre">Das</span>
      <div class="logo-text-block">
        <span class="logo-main">WINTERBERG</span>
        <svg class="orange-swoosh" viewBox="0 0 200 10" preserveAspectRatio="none">
          <path d="M3 7C38 2 78 1 118 4c28 2 52 5 79 1" stroke="#F2761B" stroke-width="4.5" fill="none" stroke-linecap="round"/>
        </svg>
        <span class="logo-sub">VERZEICHNIS</span>
      </div>
    </div>
  </div>

  <!-- CENTRAL FROSTED GLASS CARD -->
  <main class="welcome-card">
    <div class="welcome-badge">
      <span>🌲</span>
      <span>Neu auf Instagram</span>
    </div>

    <h1 class="greeting-title">
      Hallo Winterberg! <span class="wave-emoji">👋</span>
    </h1>

    <div class="greeting-sub">
      Schön, dass du da bist.
    </div>

    <p class="greeting-desc">
      Das offizielle Portal für lokale Betriebe, Handwerk, Gastronomie, Jobs & Events. Wir vernetzen die Menschen und Lieblingsorte aus der Kernstadt und allen 14 Ortsteilen.
    </p>

    <div class="features-row">
      <div class="feature-pill">
        <span class="pill-icon">📍</span>
        <span>14 Ortsteile</span>
      </div>
      <div class="feature-pill">
        <span class="pill-icon">☕</span>
        <span>Gastronomie</span>
      </div>
      <div class="feature-pill">
        <span class="pill-icon">🔨</span>
        <span>Handwerk</span>
      </div>
      <div class="feature-pill">
        <span class="pill-icon">💼</span>
        <span>Jobs vor Ort</span>
      </div>
      <div class="feature-pill">
        <span class="pill-icon">📅</span>
        <span>Events</span>
      </div>
    </div>
  </main>

  <!-- BOTTOM SECTION -->
  <footer class="bottom-section">
    <div class="cta-button">
      <span>winterberg-verzeichnis.de</span>
      <span>↗</span>
    </div>
    <div class="cta-hint">
      Folge uns für regionale Einblicke, Angebote & News aus unserer Heimat
    </div>
  </footer>
</body>
</html>
`;

// 2. Inviting Portrait Post (1080 x 1350 px, 4:5 Aspect Ratio for Feed)
const templatePortrait = `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Caveat:wght@600;700&display=swap" rel="stylesheet">
  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      width: 1080px;
      height: 1350px;
      overflow: hidden;
      font-family: 'Plus Jakarta Sans', -apple-system, sans-serif;
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      padding: 72px 64px 60px;
      background-image: 
        radial-gradient(circle at 50% 28%, rgba(242, 118, 27, 0.18) 0%, transparent 65%),
        linear-gradient(155deg, rgba(6, 40, 23, 0.90) 0%, rgba(15, 76, 46, 0.82) 45%, rgba(6, 32, 18, 0.94) 100%),
        url('${headerImageDataUri}');
      background-size: cover;
      background-position: center 30%;
      color: #FFFFFF;
    }

    /* TOP LOGO CONTAINER */
    .top-logo-card {
      display: flex;
      align-items: center;
      gap: 16px;
      background: rgba(255, 255, 255, 0.10);
      border: 1.5px solid rgba(255, 255, 255, 0.22);
      backdrop-filter: blur(14px);
      padding: 16px 36px;
      border-radius: 999px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
    }
    .logo-container {
      display: flex;
      align-items: baseline;
      gap: 12px;
    }
    .logo-pre {
      font-family: 'Outfit', sans-serif;
      font-size: 24px;
      font-weight: 500;
      color: rgba(255, 255, 255, 0.85);
    }
    .logo-text-block {
      display: flex;
      flex-direction: column;
    }
    .logo-main {
      font-family: 'Outfit', sans-serif;
      font-size: 36px;
      font-weight: 900;
      letter-spacing: 0.04em;
      color: #FFFFFF;
      line-height: 1;
    }
    .orange-swoosh {
      width: 100%;
      height: 8px;
      margin-top: 2px;
      display: block;
    }
    .logo-sub {
      font-family: 'Outfit', sans-serif;
      font-size: 15px;
      font-weight: 700;
      letter-spacing: 0.36em;
      color: #FFA459;
      margin-top: 3px;
      line-height: 1;
    }

    /* CENTRAL GLASS CARD */
    .welcome-card {
      width: 100%;
      max-width: 960px;
      background: rgba(255, 255, 255, 0.08);
      border: 1.5px solid rgba(255, 255, 255, 0.24);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border-radius: 40px;
      padding: 56px 56px;
      text-align: center;
      box-shadow: 
        0 28px 70px rgba(0, 0, 0, 0.4),
        inset 0 1px 2px rgba(255, 255, 255, 0.35);
      position: relative;
    }

    .welcome-badge {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      background: rgba(255, 255, 255, 0.14);
      border: 1px solid rgba(255, 255, 255, 0.28);
      padding: 10px 24px;
      border-radius: 999px;
      font-size: 17px;
      font-weight: 700;
      letter-spacing: 0.04em;
      color: #FFA459;
      margin-bottom: 24px;
      text-transform: uppercase;
    }

    .greeting-title {
      font-family: 'Outfit', sans-serif;
      font-size: 76px;
      font-weight: 900;
      line-height: 1.05;
      letter-spacing: -0.02em;
      color: #FFFFFF;
      margin-bottom: 16px;
    }
    .wave-emoji {
      display: inline-block;
      filter: drop-shadow(0 4px 12px rgba(0,0,0,0.35));
    }

    .greeting-sub {
      font-family: 'Outfit', sans-serif;
      font-size: 30px;
      font-weight: 600;
      color: #FFA459;
      margin-bottom: 26px;
      letter-spacing: -0.01em;
    }

    .greeting-desc {
      font-size: 22px;
      line-height: 1.65;
      color: rgba(255, 255, 255, 0.92);
      max-width: 820px;
      margin: 0 auto 38px auto;
      font-weight: 400;
    }

    /* 4 VALUE CARDS */
    .values-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      text-align: left;
      margin-bottom: 10px;
    }
    .val-item {
      background: rgba(0, 0, 0, 0.28);
      border: 1px solid rgba(255, 255, 255, 0.18);
      border-radius: 20px;
      padding: 18px 22px;
      display: flex;
      align-items: center;
      gap: 16px;
      backdrop-filter: blur(8px);
    }
    .val-icon {
      width: 48px;
      height: 48px;
      border-radius: 14px;
      background: rgba(242, 118, 27, 0.25);
      border: 1px solid rgba(242, 118, 27, 0.45);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      flex-shrink: 0;
    }
    .val-title {
      font-family: 'Outfit', sans-serif;
      font-size: 19px;
      font-weight: 800;
      color: #FFFFFF;
      margin-bottom: 3px;
    }
    .val-sub {
      font-size: 14.5px;
      color: rgba(255, 255, 255, 0.75);
    }

    /* BOTTOM CTA & DOMAIN */
    .bottom-section {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
    }
    .cta-button {
      background: linear-gradient(135deg, #F2761B 0%, #FFA459 100%);
      color: #FFFFFF;
      font-family: 'Outfit', sans-serif;
      font-size: 22px;
      font-weight: 800;
      letter-spacing: 0.02em;
      padding: 18px 48px;
      border-radius: 999px;
      display: flex;
      align-items: center;
      gap: 12px;
      box-shadow: 0 10px 28px rgba(242, 118, 27, 0.45);
      border: none;
    }
    .cta-hint {
      font-size: 16px;
      color: rgba(255, 255, 255, 0.82);
      font-weight: 500;
    }
  </style>
</head>
<body>
  <!-- TOP LOGO -->
  <div class="top-logo-card">
    <div class="logo-container">
      <span class="logo-pre">Das</span>
      <div class="logo-text-block">
        <span class="logo-main">WINTERBERG</span>
        <svg class="orange-swoosh" viewBox="0 0 200 10" preserveAspectRatio="none">
          <path d="M3 7C38 2 78 1 118 4c28 2 52 5 79 1" stroke="#F2761B" stroke-width="4.5" fill="none" stroke-linecap="round"/>
        </svg>
        <span class="logo-sub">VERZEICHNIS</span>
      </div>
    </div>
  </div>

  <!-- CENTRAL FROSTED GLASS CARD -->
  <main class="welcome-card">
    <div class="welcome-badge">
      <span>🌲</span>
      <span>Neu auf Instagram</span>
    </div>

    <h1 class="greeting-title">
      Hallo Winterberg! <span class="wave-emoji">👋</span>
    </h1>

    <div class="greeting-sub">
      Schön, dass du da bist.
    </div>

    <p class="greeting-desc">
      Das offizielle Portal für lokale Betriebe, Handwerk, Gastronomie, Jobs & Events. Wir vernetzen die Menschen und Lieblingsorte aus der Kernstadt und allen 14 Ortsteilen.
    </p>

    <!-- 4 VALUE ITEMS -->
    <div class="values-grid">
      <div class="val-item">
        <div class="val-icon">📍</div>
        <div>
          <div class="val-title">Alle 14 Ortsteile</div>
          <div class="val-sub">Regionale Verbundenheit</div>
        </div>
      </div>
      <div class="val-item">
        <div class="val-icon">☕</div>
        <div>
          <div class="val-title">Gastro & Shopping</div>
          <div class="val-sub">Genuss & Einkaufserlebnisse</div>
        </div>
      </div>
      <div class="val-item">
        <div class="val-icon">🔨</div>
        <div>
          <div class="val-title">Starkes Handwerk</div>
          <div class="val-sub">Geprüfte Fachbetriebe</div>
        </div>
      </div>
      <div class="val-item">
        <div class="val-icon">💼</div>
        <div>
          <div class="val-title">Jobs & Karriere</div>
          <div class="val-sub">Chancen in der Heimat</div>
        </div>
      </div>
    </div>
  </main>

  <!-- BOTTOM SECTION -->
  <footer class="bottom-section">
    <div class="cta-button">
      <span>winterberg-verzeichnis.de</span>
      <span>↗</span>
    </div>
    <div class="cta-hint">
      Folge uns für Neuigkeiten, Angebote & Einblicke aus unserer Region
    </div>
  </footer>
</body>
</html>
`;

async function render() {
  console.log('Launching Puppeteer...');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  // 1. Render Square (1080x1080)
  console.log('Rendering Inviting Square...');
  await page.setViewport({ width: 1080, height: 1080, deviceScaleFactor: 2 });
  await page.setContent(templateSquare, { waitUntil: 'domcontentloaded' });
  await page.evaluateHandle('document.fonts.ready');
  await new Promise(r => setTimeout(r, 600));
  const outSquare = path.join(outputDir, 'instagram-hallo-winterberg-square.png');
  await page.screenshot({ path: outSquare, type: 'png' });
  console.log(`Saved: ${outSquare}`);

  // 2. Render Portrait (1080x1350)
  console.log('Rendering Inviting Portrait...');
  await page.setViewport({ width: 1080, height: 1350, deviceScaleFactor: 2 });
  await page.setContent(templatePortrait, { waitUntil: 'domcontentloaded' });
  await page.evaluateHandle('document.fonts.ready');
  await new Promise(r => setTimeout(r, 600));
  const outPortrait = path.join(outputDir, 'instagram-hallo-winterberg-portrait.png');
  await page.screenshot({ path: outPortrait, type: 'png' });
  console.log(`Saved: ${outPortrait}`);

  await browser.close();
  console.log('Done!');
}

render().catch(e => {
  console.error(e);
  process.exit(1);
});
