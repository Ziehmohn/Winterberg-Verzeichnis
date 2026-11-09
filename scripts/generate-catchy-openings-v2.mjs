import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const outputDir = path.join(rootDir, 'public');
const artifactDir = 'C:/Users/simon/.gemini/antigravity/brain/9e781da6-98b2-44c4-ad42-6b0f1a1c1303';

const html = `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@600;700;800;900&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      width: 1080px;
      height: 1080px;
      overflow: hidden;
      font-family: 'Outfit', sans-serif;
      background: radial-gradient(circle at 75% 25%, #134e2c 0%, #092C1A 50%, #051a0f 100%);
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 80px 80px 90px;
      color: #FFFFFF;
    }

    /* Ambient background glows */
    .glow-orange {
      position: absolute;
      width: 700px;
      height: 700px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(242, 118, 27, 0.22) 0%, transparent 68%);
      top: 50%;
      left: 55%;
      transform: translate(-50%, -50%);
      pointer-events: none;
      filter: blur(50px);
    }

    .glow-green {
      position: absolute;
      width: 500px;
      height: 500px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(46, 204, 113, 0.18) 0%, transparent 65%);
      bottom: -80px;
      left: -50px;
      pointer-events: none;
      filter: blur(60px);
    }

    /* TOP ROW */
    .top-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: relative;
      z-index: 10;
    }

    .tag-open {
      background: #FFE814;
      color: #092C1A;
      font-family: 'Outfit', sans-serif;
      font-size: 20px;
      font-weight: 900;
      padding: 10px 24px;
      border-radius: 999px;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      box-shadow: 0 8px 24px rgba(255, 232, 20, 0.35);
    }

    .badge-kostenlos {
      background: rgba(255, 255, 255, 0.14);
      border: 1.5px solid rgba(255, 255, 255, 0.28);
      backdrop-filter: blur(12px);
      color: #FFFFFF;
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 17px;
      font-weight: 800;
      padding: 10px 22px;
      border-radius: 999px;
      letter-spacing: 0.04em;
    }

    /* CENTER MAIN HOOK */
    .center-content {
      position: relative;
      z-index: 10;
      display: flex;
      flex-direction: column;
      gap: 28px;
      margin: auto 0;
    }

    .eyebrow-text {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 38px;
      font-weight: 700;
      color: #A3D8B8;
      letter-spacing: -0.01em;
      line-height: 1.2;
    }

    .main-claim {
      font-size: 86px;
      font-weight: 900;
      line-height: 1.02;
      letter-spacing: -0.035em;
      color: #FFFFFF;
    }

    .main-claim span.accent {
      color: #FFE814;
      position: relative;
      display: inline-block;
    }

    .accent-swoosh {
      position: absolute;
      bottom: -8px;
      left: 0;
      width: 100%;
      height: 12px;
    }

    /* 3 Clean feature pills */
    .pill-row {
      display: flex;
      gap: 14px;
      flex-wrap: wrap;
      margin-top: 8px;
    }

    .feature-pill {
      background: rgba(255, 255, 255, 0.12);
      border: 1.5px solid rgba(255, 255, 255, 0.25);
      backdrop-filter: blur(16px);
      padding: 14px 26px;
      border-radius: 999px;
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 20px;
      font-weight: 700;
      color: #FFFFFF;
      display: flex;
      align-items: center;
      gap: 10px;
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
    }

    /* BOTTOM BRANDING (NO FAKE BUTTON!) */
    .bottom-row {
      position: relative;
      z-index: 10;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-top: 1.5px solid rgba(255, 255, 255, 0.18);
      padding-top: 32px;
    }

    .bottom-site {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 24px;
      font-weight: 800;
      color: #FFFFFF;
      letter-spacing: 0.02em;
    }

    .bottom-region {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 17px;
      font-weight: 600;
      color: #A3D8B8;
    }
  </style>
</head>
<body>
  <div class="glow-orange"></div>
  <div class="glow-green"></div>

  <div class="top-row">
    <div class="tag-open">
      <span>🚀 NEUERÖFFNUNG</span>
    </div>
    <div class="badge-kostenlos">
      ✓ 100% Kostenlos
    </div>
  </div>

  <div class="center-content">
    <div class="eyebrow-text">
      Neueröffnung in Winterberg oder den Ortsteilen?
    </div>
    <h1 class="main-claim">
      Werde sofort bei<br>
      <span class="accent">
        Google & KI
        <svg class="accent-swoosh" viewBox="0 0 200 10" preserveAspectRatio="none">
          <path d="M3 7C45 2 95 1 145 4c25 2 42 4 52 1" stroke="#F2761B" stroke-width="5" fill="none" stroke-linecap="round"/>
        </svg>
      </span>
      gefunden.
    </h1>
    <div class="pill-row">
      <div class="feature-pill">🔍 Top Google-Ranking</div>
      <div class="feature-pill">🤖 KI-Suche (ChatGPT & Co.)</div>
      <div class="feature-pill">📈 Regionale SEO</div>
    </div>
  </div>

  <div class="bottom-row">
    <div class="bottom-site">
      winterberg-verzeichnis.de
    </div>
    <div class="bottom-region">
      Das offizielle regionale Branchenportal
    </div>
  </div>
</body>
</html>
`;

async function main() {
  console.log('Rendering Revised Variant 2 (No CTA Button)...');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1080, height: 1080, deviceScaleFactor: 2 });

  await page.setContent(html, { waitUntil: 'domcontentloaded' });
  await page.evaluateHandle('document.fonts.ready');
  await new Promise(r => setTimeout(r, 600));

  const outPublic = path.join(outputDir, 'instagram-neueroeffnung-v2-nobutton.png');
  const outArtifact = path.join(artifactDir, 'instagram-neueroeffnung-v2-nobutton.png');

  await page.screenshot({ path: outPublic, type: 'png' });
  await page.screenshot({ path: outArtifact, type: 'png' });

  await browser.close();
  console.log('Done rendering no-button variant to:', outPublic);
}

main().catch(console.error);
