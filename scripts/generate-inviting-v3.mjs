import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Read the background from the first draft
const bgPath = 'C:/Users/simon/.gemini/antigravity/brain/652352a0-c2db-43b5-b0af-fee749a411cd/winterberg_instagram_launch_1793785376355.jpg';
let bgDataUri = '';
if (fs.existsSync(bgPath)) {
  const bgBase64 = fs.readFileSync(bgPath).toString('base64');
  bgDataUri = `data:image/jpeg;base64,${bgBase64}`;
}

const outputDir = path.join(rootDir, 'public');

const html = `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
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
      font-family: 'Outfit', sans-serif;
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      background-image: url('${bgDataUri}');
      background-size: cover;
      background-position: center center;
    }

    /* Subtle vignette to focus on center */
    .overlay-vignette {
      position: absolute;
      inset: 0;
      background: radial-gradient(circle at 50% 50%, rgba(0, 0, 0, 0.05) 0%, rgba(6, 40, 23, 0.35) 100%);
      pointer-events: none;
    }

    /* WRAPPER FOR GLASS CARD AND 4 CORNER SQUIRCLES */
    .card-container {
      position: relative;
      width: 740px;
      margin-bottom: 48px;
      z-index: 10;
    }

    /* CENTRAL FROSTED GLASS CARD */
    .glass-card {
      width: 100%;
      background: rgba(255, 255, 255, 0.22);
      border: 1.5px solid rgba(255, 255, 255, 0.45);
      backdrop-filter: blur(28px);
      -webkit-backdrop-filter: blur(28px);
      border-radius: 36px;
      padding: 56px 44px 50px;
      text-align: center;
      box-shadow: 
        0 24px 60px rgba(0, 0, 0, 0.22),
        inset 0 1px 2px rgba(255, 255, 255, 0.5);
    }

    /* 4 CORNER SQUIRCLES (Exactly as in the reference image) */
    .squircle {
      position: absolute;
      width: 90px;
      height: 90px;
      background: rgba(255, 255, 255, 0.35);
      border: 1.5px solid rgba(255, 255, 255, 0.55);
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      border-radius: 26px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 14px 30px rgba(0, 0, 0, 0.16);
      z-index: 15;
    }
    .squircle svg {
      width: 44px;
      height: 44px;
      stroke: #0F4C2E;
      fill: none;
    }
    .sq-tl { top: -22px; left: -22px; }
    .sq-tr { top: -22px; right: -22px; }
    .sq-bl { bottom: -22px; left: -22px; }
    .sq-br { bottom: -22px; right: -22px; }

    /* TYPOGRAPHY IN EXACT WEBSITE DESIGN */
    .greeting-line-1 {
      font-size: 58px;
      font-weight: 800;
      color: #FFFFFF;
      line-height: 1.05;
      letter-spacing: -0.01em;
      text-shadow: 0 2px 10px rgba(0, 0, 0, 0.18);
    }

    .greeting-line-2 {
      font-size: 74px;
      font-weight: 900;
      color: #FFFFFF;
      line-height: 1.1;
      letter-spacing: -0.01em;
      display: inline-flex;
      align-items: center;
      gap: 12px;
      position: relative;
      margin-top: 4px;
      margin-bottom: 24px;
      text-shadow: 0 2px 12px rgba(0, 0, 0, 0.22);
    }

    .brand-word {
      position: relative;
      display: inline-block;
    }

    .brand-swoosh {
      position: absolute;
      bottom: -10px;
      left: 0;
      width: 100%;
      height: 14px;
    }

    .wave-hand {
      font-size: 64px;
      display: inline-block;
      filter: drop-shadow(0 4px 10px rgba(0, 0, 0, 0.25));
    }

    .subtitle-1 {
      font-family: 'Outfit', sans-serif;
      font-size: 24px;
      font-weight: 600;
      color: #FFFFFF;
      margin-bottom: 6px;
      letter-spacing: -0.005em;
      text-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
    }

    .subtitle-2 {
      font-family: 'Outfit', sans-serif;
      font-size: 23px;
      font-weight: 700;
      color: #FFA459;
      letter-spacing: 0.01em;
      text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    }

    /* ORANGE BUTTON */
    .bottom-cta-btn {
      position: relative;
      z-index: 10;
      background: #F2761B;
      color: #FFFFFF;
      font-family: 'Outfit', sans-serif;
      font-size: 25px;
      font-weight: 800;
      letter-spacing: 0.02em;
      padding: 18px 52px;
      border-radius: 999px;
      display: inline-flex;
      align-items: center;
      gap: 12px;
      border: 1.5px solid rgba(255, 255, 255, 0.3);
      box-shadow: 
        0 14px 34px rgba(242, 118, 27, 0.55),
        0 4px 12px rgba(0, 0, 0, 0.2);
    }
  </style>
</head>
<body>
  <div class="overlay-vignette"></div>

  <div class="card-container">
    <!-- 4 CORNER SQUIRCLES -->
    <div class="squircle sq-tl">
      <!-- Shop / Einzelhandel -->
      <svg viewBox="0 0 24 24" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/>
        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
        <path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/>
        <path d="M2 7h20"/>
      </svg>
    </div>

    <div class="squircle sq-tr">
      <!-- Gastronomie: Gabel & Messer -->
      <svg viewBox="0 0 24 24" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M18 2v20"/>
        <path d="M21 15V2a5 5 0 0 0-5 5v8h5Zm0 0v7"/>
        <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/>
        <path d="M7 2v20"/>
      </svg>
    </div>

    <div class="squircle sq-bl">
      <!-- Kompass / Entdecken / Handwerk -->
      <svg viewBox="0 0 24 24" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill="#0F4C2E"/>
      </svg>
    </div>

    <div class="squircle sq-br">
      <!-- Kalender / Events / Termine -->
      <svg viewBox="0 0 24 24" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/>
        <line x1="16" x2="16" y1="2" y2="6"/>
        <line x1="8" x2="8" y1="2" y2="6"/>
        <line x1="3" x2="21" y1="10" y2="10"/>
        <circle cx="8" cy="15" r="1.2" fill="#0F4C2E"/>
        <circle cx="12" cy="15" r="1.2" fill="#0F4C2E"/>
        <circle cx="16" cy="15" r="1.2" fill="#0F4C2E"/>
      </svg>
    </div>

    <!-- MAIN FROSTED GLASS CARD -->
    <div class="glass-card">
      <div class="greeting-line-1">Hallo</div>
      <div class="greeting-line-2">
        <span class="brand-word">
          Winterberg!
          <!-- Exact website signature orange swoosh -->
          <svg class="brand-swoosh" viewBox="0 0 200 10" preserveAspectRatio="none">
            <path d="M3 7C38 2 78 1 118 4c28 2 52 5 79 1" stroke="#F2761B" stroke-width="4.8" fill="none" stroke-linecap="round"/>
          </svg>
        </span>
        <span class="wave-hand">👋</span>
      </div>

      <div class="subtitle-1">
        Das offizielle Verzeichnis für
      </div>
      <div class="subtitle-2">
        Unternehmen, Gastronomie, Jobs & Events
      </div>
    </div>
  </div>

  <!-- BOTTOM ORANGE BUTTON -->
  <div class="bottom-cta-btn">
    <span>winterberg-verzeichnis.de</span>
  </div>
</body>
</html>
`;

async function render() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1080, height: 1080, deviceScaleFactor: 2 });
  await page.setContent(html, { waitUntil: 'domcontentloaded' });
  await page.evaluateHandle('document.fonts.ready');
  await new Promise(r => setTimeout(r, 600));

  const out = path.join(outputDir, 'winterberg-instagram-launch-perfect.png');
  await page.screenshot({ path: out, type: 'png' });
  console.log('Saved perfect match to:', out);

  await browser.close();
}

render().catch(console.error);
