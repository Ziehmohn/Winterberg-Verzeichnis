import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const googleScreenshotPath = 'C:/Users/simon/.gemini/antigravity/brain/a4bafe3e-7e9a-47d6-a554-68b477a2eb90/.user_uploaded/media_1794347687892_0d6a7a35.png';
const googleImageBase64 = fs.readFileSync(googleScreenshotPath).toString('base64');
const googleDataUri = `data:image/png;base64,${googleImageBase64}`;

const iconPath = path.join(rootDir, 'public', 'pwa-icon-512.png');
const iconDataUri = fs.existsSync(iconPath) 
  ? `data:image/png;base64,${fs.readFileSync(iconPath).toString('base64')}`
  : '';

const outputDir = path.join(rootDir, 'public');
const artifactDir = 'C:/Users/simon/.gemini/antigravity/brain/a4bafe3e-7e9a-47d6-a554-68b477a2eb90';

// Template 1: Square (1080x1080)
const templateSquare = `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@600;700;800;900&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      width: 1080px;
      height: 1080px;
      overflow: hidden;
      font-family: 'Outfit', sans-serif;
      background: radial-gradient(circle at 80% 20%, #155733 0%, #092C1A 55%, #04140b 100%);
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 68px 72px 64px;
      color: #FFFFFF;
    }

    .glow-gold {
      position: absolute;
      width: 750px;
      height: 750px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(255, 232, 20, 0.16) 0%, rgba(242, 118, 27, 0.12) 40%, transparent 70%);
      top: 45%;
      left: 50%;
      transform: translate(-50%, -50%);
      pointer-events: none;
      filter: blur(50px);
    }

    .glow-top {
      position: absolute;
      width: 500px;
      height: 400px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(39, 174, 96, 0.22) 0%, transparent 70%);
      top: -100px;
      left: 10%;
      pointer-events: none;
      filter: blur(60px);
    }

    /* TOP ROW (NO BUTTON) */
    .top-row {
      display: flex;
      align-items: center;
      position: relative;
      z-index: 10;
    }

    .tag-silvester {
      background: linear-gradient(135deg, #FFE814 0%, #F59E0B 100%);
      color: #092C1A;
      font-family: 'Outfit', sans-serif;
      font-size: 19px;
      font-weight: 900;
      padding: 10px 22px;
      border-radius: 999px;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      display: inline-flex;
      align-items: center;
      gap: 10px;
      box-shadow: 0 8px 24px rgba(255, 232, 20, 0.3);
    }

    /* HERO HEADLINE BLOCK */
    .headline-block {
      position: relative;
      z-index: 10;
      margin-top: 10px;
    }

    .eyebrow {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 27px;
      font-weight: 700;
      color: #A3D8B8;
      margin-bottom: 8px;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .main-title {
      font-size: 54px;
      font-weight: 900;
      line-height: 1.08;
      letter-spacing: -0.03em;
      color: #FFFFFF;
    }

    .main-title .highlight {
      color: #FFE814;
      display: inline-block;
      position: relative;
    }

    /* GOOGLE PROOF CARD */
    .card-container {
      position: relative;
      z-index: 10;
      margin: 12px 0;
    }

    .proof-badge {
      position: absolute;
      top: -16px;
      right: 28px;
      z-index: 20;
      background: #10B981;
      color: #FFFFFF;
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 15px;
      font-weight: 800;
      padding: 7px 18px;
      border-radius: 999px;
      box-shadow: 0 6px 18px rgba(16, 185, 129, 0.45);
      display: flex;
      align-items: center;
      gap: 6px;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    .google-card {
      background: #FFFFFF;
      border-radius: 20px;
      padding: 14px 16px;
      box-shadow: 0 24px 60px rgba(0, 0, 0, 0.45), 0 0 0 1px rgba(255, 255, 255, 0.1);
      display: flex;
      justify-content: center;
      align-items: center;
      overflow: hidden;
    }

    .google-img {
      width: 100%;
      height: auto;
      display: block;
      border-radius: 10px;
    }

    /* BENEFIT PILLS */
    .pills-row {
      position: relative;
      z-index: 10;
      display: flex;
      gap: 12px;
      justify-content: space-between;
    }

    .pill {
      flex: 1;
      background: rgba(255, 255, 255, 0.1);
      border: 1.5px solid rgba(255, 255, 255, 0.2);
      backdrop-filter: blur(14px);
      padding: 15px 16px;
      border-radius: 16px;
      display: flex;
      align-items: center;
      gap: 10px;
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 16px;
      font-weight: 700;
      color: #FFFFFF;
    }

    .pill-icon {
      font-size: 20px;
      flex-shrink: 0;
    }

    /* BOTTOM ROW - NO FAKE BUTTON */
    .bottom-row {
      position: relative;
      z-index: 10;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-top: 1.5px solid rgba(255, 255, 255, 0.18);
      padding-top: 26px;
    }

    .bottom-brand {
      display: flex;
      align-items: center;
      gap: 14px;
    }

    .bottom-logo {
      width: 44px;
      height: 44px;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    }

    .bottom-domain {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 24px;
      font-weight: 800;
      color: #FFFFFF;
      letter-spacing: 0.01em;
    }

    .bottom-region {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 16px;
      font-weight: 600;
      color: #A3D8B8;
    }
  </style>
</head>
<body>
  <div class="glow-gold"></div>
  <div class="glow-top"></div>

  <!-- TOP HEADER (NO BUTTON) -->
  <div class="top-row">
    <div class="tag-silvester">
      <span>🍾 SILVESTER 2026</span>
    </div>
  </div>

  <!-- HEADLINE BLOCK -->
  <div class="headline-block">
    <div class="eyebrow">
      Silvesterparty geplant? Und noch weiß niemand davon?
    </div>
    <h1 class="main-title">
      Mit uns bist du bei Google <br>
      <span class="highlight">kostenlos oben dabei! 🚀</span>
    </h1>
  </div>

  <!-- GOOGLE PROOF CARD -->
  <div class="card-container">
    <div class="proof-badge">
      ⭐ TOP-RANKING SEITE 1
    </div>
    <div class="google-card">
      <img class="google-img" src="${googleDataUri}" alt="Google Suche Winterberg Silvester" />
    </div>
  </div>

  <!-- BENEFIT PILLS -->
  <div class="pills-row">
    <div class="pill">
      <span class="pill-icon">🔥</span>
      <span>Volle Hütte garantieren</span>
    </div>
    <div class="pill">
      <span class="pill-icon">👥</span>
      <span>Feierwütige Gäste erreichen</span>
    </div>
    <div class="pill">
      <span class="pill-icon">⚡</span>
      <span>In 2 Min. online sichtbar</span>
    </div>
  </div>

  <!-- BOTTOM BAR (NO FAKE BUTTON) -->
  <div class="bottom-row">
    <div class="bottom-brand">
      ${iconDataUri ? `<img class="bottom-logo" src="${iconDataUri}" alt="Logo" />` : ''}
      <div class="bottom-domain">winterberg-verzeichnis.de</div>
    </div>
    <div class="bottom-region">
      Das Portal für Winterberg & seine Dörfer
    </div>
  </div>
</body>
</html>`;

// Template 2: Portrait 4:5 (1080x1350) - Optimized for Instagram Feed
const templatePortrait = `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@600;700;800;900&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      width: 1080px;
      height: 1350px;
      overflow: hidden;
      font-family: 'Outfit', sans-serif;
      background: radial-gradient(circle at 75% 15%, #155733 0%, #092C1A 50%, #04140b 100%);
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 85px 80px 80px;
      color: #FFFFFF;
    }

    .glow-gold {
      position: absolute;
      width: 850px;
      height: 850px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(255, 232, 20, 0.15) 0%, rgba(242, 118, 27, 0.12) 40%, transparent 70%);
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      pointer-events: none;
      filter: blur(60px);
    }

    .glow-top {
      position: absolute;
      width: 600px;
      height: 500px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(39, 174, 96, 0.22) 0%, transparent 70%);
      top: -120px;
      left: 15%;
      pointer-events: none;
      filter: blur(70px);
    }

    /* TOP ROW (NO BUTTON) */
    .top-row {
      display: flex;
      align-items: center;
      position: relative;
      z-index: 10;
    }

    .tag-silvester {
      background: linear-gradient(135deg, #FFE814 0%, #F59E0B 100%);
      color: #092C1A;
      font-family: 'Outfit', sans-serif;
      font-size: 21px;
      font-weight: 900;
      padding: 12px 26px;
      border-radius: 999px;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      display: inline-flex;
      align-items: center;
      gap: 10px;
      box-shadow: 0 8px 24px rgba(255, 232, 20, 0.35);
    }

    /* HERO HEADLINE BLOCK */
    .headline-block {
      position: relative;
      z-index: 10;
      margin-top: 15px;
    }

    .eyebrow {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 32px;
      font-weight: 700;
      color: #A3D8B8;
      margin-bottom: 12px;
      letter-spacing: -0.01em;
    }

    .main-title {
      font-size: 64px;
      font-weight: 900;
      line-height: 1.06;
      letter-spacing: -0.035em;
      color: #FFFFFF;
    }

    .main-title .highlight {
      color: #FFE814;
      display: inline-block;
      position: relative;
    }

    .sub-hook {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 25px;
      font-weight: 500;
      color: rgba(255, 255, 255, 0.88);
      margin-top: 16px;
      line-height: 1.35;
    }

    /* GOOGLE PROOF CARD */
    .card-container {
      position: relative;
      z-index: 10;
      margin: 20px 0 15px;
    }

    .proof-badge {
      position: absolute;
      top: -18px;
      right: 32px;
      z-index: 20;
      background: #10B981;
      color: #FFFFFF;
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 16px;
      font-weight: 800;
      padding: 8px 22px;
      border-radius: 999px;
      box-shadow: 0 8px 20px rgba(16, 185, 129, 0.45);
      display: flex;
      align-items: center;
      gap: 8px;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    .google-card {
      background: #FFFFFF;
      border-radius: 24px;
      padding: 18px 20px;
      box-shadow: 0 30px 70px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.12);
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .google-img {
      width: 100%;
      height: auto;
      display: block;
      border-radius: 12px;
    }

    /* 3 FEATURE PILLS */
    .pills-column {
      position: relative;
      z-index: 10;
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    .pill-item {
      background: rgba(255, 255, 255, 0.1);
      border: 1.5px solid rgba(255, 255, 255, 0.2);
      backdrop-filter: blur(14px);
      padding: 18px 24px;
      border-radius: 18px;
      display: flex;
      align-items: center;
      gap: 14px;
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 20px;
      font-weight: 700;
      color: #FFFFFF;
    }

    .pill-icon {
      font-size: 24px;
      flex-shrink: 0;
    }

    /* BOTTOM ROW - NO FAKE BUTTON */
    .bottom-row {
      position: relative;
      z-index: 10;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-top: 1.5px solid rgba(255, 255, 255, 0.18);
      padding-top: 32px;
    }

    .bottom-brand {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .bottom-logo {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    }

    .bottom-domain {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 26px;
      font-weight: 800;
      color: #FFFFFF;
      letter-spacing: 0.01em;
    }

    .bottom-region {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 18px;
      font-weight: 600;
      color: #A3D8B8;
    }
  </style>
</head>
<body>
  <div class="glow-gold"></div>
  <div class="glow-top"></div>

  <!-- TOP HEADER (NO BUTTON) -->
  <div class="top-row">
    <div class="tag-silvester">
      <span>🍾 SILVESTER 2026</span>
    </div>
  </div>

  <!-- HEADLINE BLOCK -->
  <div class="headline-block">
    <div class="eyebrow">
      Silvesterparty geplant? Und noch weiß niemand davon?
    </div>
    <h1 class="main-title">
      Mit uns bist du bei Google <br>
      <span class="highlight">kostenlos oben dabei! 🚀</span>
    </h1>
    <p class="sub-hook">
      Top-Ranking auf Seite 1: Lenke die Aufmerksamkeit von Feierwütigen & Urlaubern direkt auf dein Event.
    </p>
  </div>

  <!-- GOOGLE PROOF CARD -->
  <div class="card-container">
    <div class="proof-badge">
      ⭐ TOP-RANKING SEITE 1
    </div>
    <div class="google-card">
      <img class="google-img" src="${googleDataUri}" alt="Google Suche Winterberg Silvester" />
    </div>
  </div>

  <!-- BENEFIT PILLS -->
  <div class="pills-column">
    <div class="pill-item">
      <span class="pill-icon">🔥</span>
      <span>Volle Hütte garantiert: Direkt auf Seite 1 bei Google gefunden werden</span>
    </div>
    <div class="pill-item">
      <span class="pill-icon">⚡</span>
      <span>In unter 2 Minuten im Winterberg Verzeichnis eingetragen</span>
    </div>
  </div>

  <!-- BOTTOM BAR (NO FAKE BUTTON) -->
  <div class="bottom-row">
    <div class="bottom-brand">
      ${iconDataUri ? `<img class="bottom-logo" src="${iconDataUri}" alt="Logo" />` : ''}
      <div class="bottom-domain">winterberg-verzeichnis.de</div>
    </div>
    <div class="bottom-region">
      Das Portal für Winterberg & seine Dörfer
    </div>
  </div>
</body>
</html>`;

async function render() {
  console.log('Launching Puppeteer...');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  // Render Square 1080x1080
  console.log('Rendering Square 1080x1080...');
  const pageSquare = await browser.newPage();
  await pageSquare.setViewport({ width: 1080, height: 1080, deviceScaleFactor: 2 });
  await pageSquare.setContent(templateSquare, { waitUntil: 'domcontentloaded' });
  await pageSquare.evaluateHandle('document.fonts.ready');
  await new Promise(r => setTimeout(r, 600));

  const squarePublic = path.join(outputDir, 'instagram-silvester-square.png');
  const squareArtifact = path.join(artifactDir, 'instagram-silvester-square.png');
  await pageSquare.screenshot({ path: squarePublic, type: 'png' });
  await pageSquare.screenshot({ path: squareArtifact, type: 'png' });
  console.log('Saved square image to:', squarePublic);

  // Render Portrait 1080x1350
  console.log('Rendering Portrait 1080x1350...');
  const pagePortrait = await browser.newPage();
  await pagePortrait.setViewport({ width: 1080, height: 1350, deviceScaleFactor: 2 });
  await pagePortrait.setContent(templatePortrait, { waitUntil: 'domcontentloaded' });
  await pagePortrait.evaluateHandle('document.fonts.ready');
  await new Promise(r => setTimeout(r, 600));

  const portraitPublic = path.join(outputDir, 'instagram-silvester-portrait.png');
  const portraitArtifact = path.join(artifactDir, 'instagram-silvester-portrait.png');
  await pagePortrait.screenshot({ path: portraitPublic, type: 'png' });
  await pagePortrait.screenshot({ path: portraitArtifact, type: 'png' });
  console.log('Saved portrait image to:', portraitPublic);

  await browser.close();
  console.log('Done rendering with "kostenlos" in headline and no top button!');
}

render().catch(err => {
  console.error('Render error:', err);
  process.exit(1);
});
