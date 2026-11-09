import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const outputDir = path.join(rootDir, 'public');

const artifactDir = 'C:/Users/simon/.gemini/antigravity/brain/9e781da6-98b2-44c4-ad42-6b0f1a1c1303';

// 1. Forest Green Edition (High-contrast, glowing accents, premium feel)
const htmlGreen = `<!DOCTYPE html>
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
      background: radial-gradient(circle at 85% 15%, #185e3b 0%, #0F4C2E 42%, #072618 100%);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 56px 64px;
      color: #FFFFFF;
    }

    /* Abstract Graphic Vector Shapes & Glowing Mesh */
    .bg-decorations {
      position: absolute;
      inset: 0;
      overflow: hidden;
      pointer-events: none;
      z-index: 1;
    }

    .topo-ring {
      position: absolute;
      border-radius: 50%;
      border: 1.5px solid rgba(255, 255, 255, 0.08);
    }
    .tr-1 { width: 850px; height: 850px; top: -250px; right: -200px; }
    .tr-2 { width: 1150px; height: 1150px; top: -400px; right: -350px; }
    .tr-3 { width: 1450px; height: 1450px; top: -550px; right: -500px; }

    .glow-orange {
      position: absolute;
      width: 520px;
      height: 520px;
      background: radial-gradient(circle, rgba(242, 118, 27, 0.22) 0%, transparent 70%);
      top: 40px;
      left: 120px;
      filter: blur(65px);
    }

    .glow-cyan {
      position: absolute;
      width: 500px;
      height: 500px;
      background: radial-gradient(circle, rgba(46, 204, 113, 0.2) 0%, transparent 70%);
      bottom: -100px;
      right: 50px;
      filter: blur(70px);
    }

    .content-layer {
      position: relative;
      z-index: 10;
      display: flex;
      flex-direction: column;
      height: 100%;
      justify-content: space-between;
    }

    /* TOP BAR */
    .top-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .brand-group {
      display: flex;
      align-items: center;
      gap: 14px;
    }

    .brand-icon-box {
      width: 52px;
      height: 52px;
      border-radius: 14px;
      background: rgba(255, 255, 255, 0.15);
      border: 1px solid rgba(255, 255, 255, 0.3);
      backdrop-filter: blur(12px);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #FFA459;
    }

    .brand-names {
      display: flex;
      flex-direction: column;
    }

    .brand-title {
      font-size: 26px;
      font-weight: 800;
      letter-spacing: 0.01em;
      color: #FFFFFF;
      line-height: 1.1;
    }
    .brand-subtitle {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 13px;
      font-weight: 600;
      color: #C8DDD1;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    .badge-kostenlos {
      background: linear-gradient(135deg, #F2761B 0%, #D85C04 100%);
      color: #FFFFFF;
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 14px;
      font-weight: 800;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      padding: 10px 22px;
      border-radius: 999px;
      box-shadow: 0 8px 24px rgba(242, 118, 27, 0.45);
      border: 1.5px solid rgba(255, 255, 255, 0.35);
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }

    /* HERO HEADLINE */
    .hero-section {
      margin-top: 18px;
      margin-bottom: 20px;
    }

    .category-pill {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: rgba(255, 255, 255, 0.12);
      border: 1px solid rgba(255, 255, 255, 0.25);
      backdrop-filter: blur(10px);
      color: #FFE6D0;
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 14px;
      font-weight: 700;
      padding: 7px 18px;
      border-radius: 999px;
      margin-bottom: 14px;
    }

    .main-claim {
      font-size: 60px;
      font-weight: 900;
      line-height: 1.08;
      letter-spacing: -0.02em;
      color: #FFFFFF;
    }

    .highlight-word {
      color: #FFA459;
      position: relative;
      display: inline-block;
    }

    .accent-swoosh {
      position: absolute;
      bottom: -6px;
      left: 0;
      width: 100%;
      height: 10px;
    }

    .sub-claim {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 21px;
      font-weight: 500;
      color: #DDEEE5;
      margin-top: 12px;
      max-width: 860px;
      line-height: 1.38;
    }

    /* 3 FEATURE BENEFIT CARDS */
    .benefit-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
      margin: 10px 0 22px;
    }

    .benefit-card {
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.22);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border-radius: 20px;
      padding: 22px 20px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
      position: relative;
    }

    .card-badge-top {
      position: absolute;
      top: -10px;
      right: 16px;
      background: #FFA459;
      color: #072618;
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      padding: 3px 10px;
      border-radius: 999px;
    }

    .benefit-icon-wrapper {
      width: 48px;
      height: 48px;
      border-radius: 14px;
      background: rgba(255, 255, 255, 0.18);
      border: 1px solid rgba(255, 255, 255, 0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #FFA459;
    }

    .benefit-texts {
      display: flex;
      flex-direction: column;
    }

    .benefit-title {
      font-size: 20px;
      font-weight: 800;
      color: #FFFFFF;
      letter-spacing: -0.01em;
      line-height: 1.2;
    }

    .benefit-desc {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 14px;
      font-weight: 500;
      color: #D3E6DB;
      margin-top: 6px;
      line-height: 1.4;
    }

    /* PUNCHLINE BAR */
    .punchline-bar {
      background: rgba(0, 0, 0, 0.28);
      border-radius: 16px;
      border: 1px dashed rgba(255, 255, 255, 0.28);
      padding: 14px 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 22px;
    }

    .punchline-left {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .punchline-text {
      font-size: 18px;
      font-weight: 700;
      color: #FFFFFF;
      letter-spacing: -0.01em;
    }

    .punchline-highlight {
      color: #FFA459;
      font-weight: 800;
    }

    .punchline-status {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 13px;
      font-weight: 700;
      color: #A3D8B8;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    /* FOOTER & CTA */
    .bottom-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-top: 1px solid rgba(255, 255, 255, 0.18);
      padding-top: 22px;
    }

    .cta-button {
      background: #FFFFFF;
      color: #0F4C2E;
      font-family: 'Outfit', sans-serif;
      font-size: 20px;
      font-weight: 800;
      padding: 16px 36px;
      border-radius: 999px;
      display: inline-flex;
      align-items: center;
      gap: 12px;
      box-shadow: 0 12px 30px rgba(0, 0, 0, 0.25);
      letter-spacing: 0.01em;
    }

    .cta-button svg {
      stroke: #0F4C2E;
    }

    .web-url-box {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
    }

    .web-url-label {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 11px;
      font-weight: 700;
      color: #A3D8B8;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    .web-url {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 19px;
      font-weight: 800;
      color: #FFFFFF;
      letter-spacing: 0.01em;
    }
  </style>
</head>
<body>
  <div class="bg-decorations">
    <div class="topo-ring tr-1"></div>
    <div class="topo-ring tr-2"></div>
    <div class="topo-ring tr-3"></div>
    <div class="glow-orange"></div>
    <div class="glow-cyan"></div>
  </div>

  <div class="content-layer">
    <!-- Top Bar -->
    <div class="top-header">
      <div class="brand-group">
        <div class="brand-icon-box">
          <!-- Sparkles Icon -->
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round">
            <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
          </svg>
        </div>
        <div class="brand-names">
          <div class="brand-title">Winterberg Unternehmen</div>
          <div class="brand-subtitle">Offizielle Themen-Sonderseite</div>
        </div>
      </div>

      <div class="badge-kostenlos">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <path d="m9 12 2 2 4-4"/>
        </svg>
        100% Kostenlos Eintragen
      </div>
    </div>

    <!-- Main Hero Hook -->
    <div class="hero-section">
      <div class="category-pill">
        <span>✨ Neueröffnung in Winterberg & Ortsteilen</span>
      </div>
      <h1 class="main-claim">
        Neu eröffnet?<br>
        Sei sofort <span class="highlight-word">
          überall sichtbar!
          <svg class="accent-swoosh" viewBox="0 0 200 10" preserveAspectRatio="none">
            <path d="M3 7C45 2 95 1 145 4c25 2 42 4 52 1" stroke="#F2761B" stroke-width="5" fill="none" stroke-linecap="round"/>
          </svg>
        </span>
      </h1>
      <p class="sub-claim">
        Trag dein neues Geschäft, Lokal oder deine Praxis kostenlos ein – und sichere dir maximale Reichweite bei Google, KI-Suchmaschinen und Gästen.
      </p>
    </div>

    <!-- 3 Core Benefit Cards -->
    <div class="benefit-grid">
      <!-- 1: Google & Suchmaschinen -->
      <div class="benefit-card">
        <span class="card-badge-top">Top Ranking</span>
        <div class="benefit-icon-wrapper">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.3-4.3"/>
            <path d="m11 8 2 3-2 3"/>
          </svg>
        </div>
        <div class="benefit-texts">
          <div class="benefit-title">Google-Suche</div>
          <div class="benefit-desc">Werde direkt gefunden, wenn Menschen nach neuen Adressen im Sauerland suchen.</div>
        </div>
      </div>

      <!-- 2: KI-Suche & Modern AI Search -->
      <div class="benefit-card">
        <span class="card-badge-top">Zukunftssicher</span>
        <div class="benefit-icon-wrapper">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 2v4"/>
            <path d="m4.93 4.93 2.83 2.83"/>
            <path d="M2 12h4"/>
            <path d="m4.93 19.07 2.83-2.83"/>
            <path d="M12 18v4"/>
            <path d="m16.24 16.24 2.83 2.83"/>
            <path d="M18 12h4"/>
            <path d="m16.24 7.76 2.83-2.83"/>
            <circle cx="12" cy="12" r="3.5"/>
          </svg>
        </div>
        <div class="benefit-texts">
          <div class="benefit-title">KI-Suche</div>
          <div class="benefit-desc">Präsenz in modernen KI-Assistenten (ChatGPT, Gemini, Perplexity) durch strukturierte Daten.</div>
        </div>
      </div>

      <!-- 3: SEO Power & Backlinks -->
      <div class="benefit-card">
        <span class="card-badge-top">Starke SEO</span>
        <div class="benefit-icon-wrapper">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/>
            <polyline points="16 7 22 7 22 13"/>
          </svg>
        </div>
        <div class="benefit-texts">
          <div class="benefit-title">Regionale SEO</div>
          <div class="benefit-desc">Hochwertiger lokaler Backlink & Vertrauenssignal für deine eigene Firmen-Website.</div>
        </div>
      </div>
    </div>

    <!-- Punchline Bar -->
    <div class="punchline-bar">
      <div class="punchline-left">
        <!-- Shield check -->
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FFA459" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.8 17 5 19 5a1 1 0 0 1 1 1z"/>
          <path d="m9 12 2 2 4-4"/>
        </svg>
        <span class="punchline-text">Kostenlos registrieren, Neueröffnung einreichen – <span class="punchline-highlight">fertig!</span></span>
      </div>
      <div class="punchline-status">
        <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#38ef7d;"></span>
        Jetzt live eintragen
      </div>
    </div>

    <!-- Footer Bar with CTA -->
    <div class="bottom-footer">
      <div class="cta-button">
        <span>Jetzt Neueröffnung eintragen</span>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round">
          <line x1="5" y1="12" x2="19" y2="12"></line>
          <polyline points="12 5 19 12 12 19"></polyline>
        </svg>
      </div>

      <div class="web-url-box">
        <span class="web-url-label">Sonderseite</span>
        <span class="web-url">winterberg-verzeichnis.de/themen/...</span>
      </div>
    </div>
  </div>
</body>
</html>
`;

// 2. Light Cream Edition (Matching the website design with clear white cards and dark green typography)
const htmlLight = `<!DOCTYPE html>
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
      background: #FAF8F5;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 58px 64px;
      color: #1A2E22;
    }

    /* Subtle background grid pattern */
    .bg-grid {
      position: absolute;
      inset: 0;
      background-image: 
        radial-gradient(rgba(15, 76, 46, 0.08) 1.5px, transparent 1.5px);
      background-size: 32px 32px;
      pointer-events: none;
      z-index: 1;
    }

    .corner-decor {
      position: absolute;
      width: 500px;
      height: 500px;
      background: radial-gradient(circle, rgba(15, 76, 46, 0.06) 0%, transparent 70%);
      top: -100px;
      right: -100px;
      pointer-events: none;
      z-index: 1;
    }

    .content-layer {
      position: relative;
      z-index: 10;
      display: flex;
      flex-direction: column;
      height: 100%;
      justify-content: space-between;
    }

    .top-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .brand-group {
      display: flex;
      align-items: center;
      gap: 14px;
    }

    .brand-icon-box {
      width: 54px;
      height: 54px;
      border-radius: 16px;
      background: #0F4C2E;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #FFFFFF;
      box-shadow: 0 8px 18px rgba(15, 76, 46, 0.25);
    }

    .brand-title {
      font-size: 27px;
      font-weight: 800;
      color: #0F4C2E;
      line-height: 1.1;
    }

    .brand-subtitle {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 13px;
      font-weight: 700;
      color: #6E7E73;
      letter-spacing: 0.06em;
      text-transform: uppercase;
    }

    .badge-free {
      background: #FEEFE6;
      border: 1.5px solid #F8C39E;
      color: #D85C04;
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 14px;
      font-weight: 800;
      padding: 10px 22px;
      border-radius: 999px;
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }

    .hero-section {
      margin-top: 18px;
      margin-bottom: 18px;
    }

    .tagline-pill {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: rgba(15, 76, 46, 0.08);
      color: #0F4C2E;
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 14px;
      font-weight: 700;
      padding: 6px 16px;
      border-radius: 999px;
      margin-bottom: 12px;
    }

    .main-claim {
      font-size: 60px;
      font-weight: 900;
      line-height: 1.06;
      letter-spacing: -0.025em;
      color: #0F4C2E;
    }

    .highlight-word {
      color: #F2761B;
      position: relative;
      display: inline-block;
    }

    .accent-swoosh {
      position: absolute;
      bottom: -6px;
      left: 0;
      width: 100%;
      height: 12px;
    }

    .sub-claim {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 21px;
      font-weight: 500;
      color: #4A5850;
      margin-top: 12px;
      max-width: 860px;
      line-height: 1.38;
    }

    /* 3 FEATURE CARDS */
    .benefit-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
      margin: 10px 0 22px;
    }

    .benefit-card {
      background: #FFFFFF;
      border: 1.5px solid #E5E0D8;
      border-radius: 20px;
      padding: 22px 20px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      box-shadow: 0 6px 18px rgba(0, 0, 0, 0.04);
      position: relative;
    }

    .card-badge-top {
      position: absolute;
      top: -10px;
      right: 16px;
      background: #FEEFE6;
      border: 1px solid #F8C39E;
      color: #D85C04;
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      padding: 3px 10px;
      border-radius: 999px;
    }

    .benefit-icon-wrapper {
      width: 48px;
      height: 48px;
      border-radius: 14px;
      background: #F1F7F3;
      border: 1px solid #D1E5D8;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #0F4C2E;
    }

    .benefit-title {
      font-size: 20px;
      font-weight: 800;
      color: #0F4C2E;
      line-height: 1.2;
    }

    .benefit-desc {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 14px;
      font-weight: 500;
      color: #617066;
      margin-top: 6px;
      line-height: 1.4;
    }

    .punchline-bar {
      background: #0F4C2E;
      color: #FFFFFF;
      border-radius: 16px;
      padding: 16px 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 22px;
      box-shadow: 0 8px 20px rgba(15, 76, 46, 0.2);
    }

    .punchline-left {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .punchline-text {
      font-size: 18px;
      font-weight: 700;
    }

    .punchline-highlight {
      color: #FFA459;
      font-weight: 800;
    }

    .punchline-badge {
      background: rgba(255, 255, 255, 0.18);
      padding: 6px 14px;
      border-radius: 999px;
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 13px;
      font-weight: 700;
      color: #FFFFFF;
    }

    .bottom-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-top: 1.5px solid #E5E0D8;
      padding-top: 22px;
    }

    .cta-button {
      background: #F2761B;
      color: #FFFFFF;
      font-family: 'Outfit', sans-serif;
      font-size: 20px;
      font-weight: 800;
      padding: 16px 36px;
      border-radius: 999px;
      display: inline-flex;
      align-items: center;
      gap: 12px;
      box-shadow: 0 10px 24px rgba(242, 118, 27, 0.35);
    }

    .web-url-box {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
    }

    .web-url-label {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 11px;
      font-weight: 700;
      color: #6E7E73;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    .web-url {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 19px;
      font-weight: 800;
      color: #0F4C2E;
    }
  </style>
</head>
<body>
  <div class="bg-grid"></div>
  <div class="corner-decor"></div>

  <div class="content-layer">
    <!-- Top Bar -->
    <div class="top-header">
      <div class="brand-group">
        <div class="brand-icon-box">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round">
            <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
          </svg>
        </div>
        <div class="brand-names">
          <div class="brand-title">Winterberg Unternehmen</div>
          <div class="brand-subtitle">Offizielle Themen-Sonderseite</div>
        </div>
      </div>

      <div class="badge-free">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <path d="m9 12 2 2 4-4"/>
        </svg>
        100% Kostenlos
      </div>
    </div>

    <!-- Main Hero Hook -->
    <div class="hero-section">
      <div class="tagline-pill">
        ✨ Sonderseite: Neueröffnungen in Winterberg
      </div>
      <h1 class="main-claim">
        Neu eröffnet?<br>
        Sei sofort <span class="highlight-word">
          überall sichtbar!
          <svg class="accent-swoosh" viewBox="0 0 200 10" preserveAspectRatio="none">
            <path d="M3 7C45 2 95 1 145 4c25 2 42 4 52 1" stroke="#F2761B" stroke-width="5" fill="none" stroke-linecap="round"/>
          </svg>
        </span>
      </h1>
      <p class="sub-claim">
        Trag dein neues Geschäft, Lokal oder deine Praxis kostenlos ein – und profitiere von voller Sichtbarkeit in Google, KI-Suche und starkem SEO.
      </p>
    </div>

    <!-- 3 Core Benefit Cards -->
    <div class="benefit-grid">
      <!-- 1: Google & Suchmaschinen -->
      <div class="benefit-card">
        <span class="card-badge-top">Top Platzierung</span>
        <div class="benefit-icon-wrapper">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.3-4.3"/>
            <path d="m11 8 2 3-2 3"/>
          </svg>
        </div>
        <div class="benefit-texts">
          <div class="benefit-title">Google-Suche</div>
          <div class="benefit-desc">Werde sofort gefunden, wenn Einheimische und Gäste nach Neueröffnungen suchen.</div>
        </div>
      </div>

      <!-- 2: KI-Suche & KI-Assistenten -->
      <div class="benefit-card">
        <span class="card-badge-top">Zukunftssicher</span>
        <div class="benefit-icon-wrapper">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 2v4"/>
            <path d="m4.93 4.93 2.83 2.83"/>
            <path d="M2 12h4"/>
            <path d="m4.93 19.07 2.83-2.83"/>
            <path d="M12 18v4"/>
            <path d="m16.24 16.24 2.83 2.83"/>
            <path d="M18 12h4"/>
            <path d="m16.24 7.76 2.83-2.83"/>
            <circle cx="12" cy="12" r="3.5"/>
          </svg>
        </div>
        <div class="benefit-texts">
          <div class="benefit-title">KI-Suche</div>
          <div class="benefit-desc">Präsenz in KI-Modellen (ChatGPT, Gemini, Perplexity) dank strukturierter Daten.</div>
        </div>
      </div>

      <!-- 3: Reines SEO & Backlinks -->
      <div class="benefit-card">
        <span class="card-badge-top">Echtes SEO</span>
        <div class="benefit-icon-wrapper">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/>
            <polyline points="16 7 22 7 22 13"/>
          </svg>
        </div>
        <div class="benefit-texts">
          <div class="benefit-title">Regionale SEO</div>
          <div class="benefit-desc">Starker regionaler Backlink & Vertrauenssignal für deine eigene Firmenwebsite.</div>
        </div>
      </div>
    </div>

    <!-- Punchline Bar -->
    <div class="punchline-bar">
      <div class="punchline-left">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FFA459" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.8 17 5 19 5a1 1 0 0 1 1 1z"/>
          <path d="m9 12 2 2 4-4"/>
        </svg>
        <span class="punchline-text">Kostenlos anmelden, Neueröffnung eintragen – <span class="punchline-highlight">und starten!</span></span>
      </div>
      <div class="punchline-badge">
        0 € Dauerhaft
      </div>
    </div>

    <!-- Bottom Footer with CTA -->
    <div class="bottom-footer">
      <div class="cta-button">
        <span>Jetzt kostenlos eintragen</span>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round">
          <line x1="5" y1="12" x2="19" y2="12"></line>
          <polyline points="12 5 19 12 12 19"></polyline>
        </svg>
      </div>

      <div class="web-url-box">
        <span class="web-url-label">Sonderseite</span>
        <span class="web-url">winterberg-verzeichnis.de</span>
      </div>
    </div>
  </div>
</body>
</html>
`;

async function main() {
  console.log('Launching Puppeteer for Neueröffnungen post...');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1080, height: 1080, deviceScaleFactor: 2 });

  // 1. Render Forest Green Variant
  await page.setContent(htmlGreen, { waitUntil: 'domcontentloaded' });
  await page.evaluateHandle('document.fonts.ready');
  await new Promise(r => setTimeout(r, 600));

  const out1Public = path.join(outputDir, 'instagram-neueroeffnungen-gruen.png');
  const out1Artifact = path.join(artifactDir, 'instagram-neueroeffnungen-gruen.png');
  await page.screenshot({ path: out1Public, type: 'png' });
  await page.screenshot({ path: out1Artifact, type: 'png' });
  console.log('Rendered Green variant to:', out1Public, 'and', out1Artifact);

  // 2. Render Light Cream Variant
  await page.setContent(htmlLight, { waitUntil: 'domcontentloaded' });
  await page.evaluateHandle('document.fonts.ready');
  await new Promise(r => setTimeout(r, 600));

  const out2Public = path.join(outputDir, 'instagram-neueroeffnungen-hell.png');
  const out2Artifact = path.join(artifactDir, 'instagram-neueroeffnungen-hell.png');
  await page.screenshot({ path: out2Public, type: 'png' });
  await page.screenshot({ path: out2Artifact, type: 'png' });
  console.log('Rendered Light variant to:', out2Public, 'and', out2Artifact);

  await browser.close();
  console.log('Done rendering Neueröffnungen posts!');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
