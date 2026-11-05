import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const outputDir = path.join(rootDir, 'public');

const artifactDir = 'C:/Users/simon/.gemini/antigravity/brain/9e781da6-98b2-44c4-ad42-6b0f1a1c1303';

const htmlContent = `<!DOCTYPE html>
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
      background: radial-gradient(circle at 80% 20%, #165b38 0%, #0F4C2E 45%, #082819 100%);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 56px 64px 60px;
      color: #FFFFFF;
    }

    /* Abstract Graphic Vector Shapes & Contour Lines (NO AI PHOTOS) */
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
      border: 1.5px solid rgba(255, 255, 255, 0.07);
    }
    .tr-1 { width: 900px; height: 900px; top: -300px; right: -250px; }
    .tr-2 { width: 1200px; height: 1200px; top: -450px; right: -400px; }
    .tr-3 { width: 1500px; height: 1500px; top: -600px; right: -550px; }

    .glow-spot-1 {
      position: absolute;
      width: 500px;
      height: 500px;
      background: radial-gradient(circle, rgba(242, 118, 27, 0.18) 0%, transparent 70%);
      top: -100px;
      left: 100px;
      filter: blur(50px);
    }
    .glow-spot-2 {
      position: absolute;
      width: 600px;
      height: 600px;
      background: radial-gradient(circle, rgba(46, 175, 110, 0.22) 0%, transparent 70%);
      bottom: -150px;
      right: -100px;
      filter: blur(60px);
    }

    /* Mountain & Fir Pine Silhouette Vector in the bottom */
    .landscape-silhouette {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 220px;
      opacity: 0.14;
      z-index: 2;
    }

    /* Content Area */
    .content-layer {
      position: relative;
      z-index: 10;
      display: flex;
      flex-direction: column;
      height: 100%;
      justify-content: space-between;
    }

    /* HEADER */
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
      letter-spacing: 0.08em;
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
      margin-top: 24px;
      margin-bottom: 24px;
    }

    .main-claim {
      font-size: 64px;
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
      font-size: 22px;
      font-weight: 500;
      color: #E2EFE7;
      margin-top: 14px;
      max-width: 820px;
      line-height: 1.4;
    }

    /* 4 BENEFIT CARDS (2x2 GRID) */
    .benefit-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin: 12px 0 24px;
    }

    .benefit-card {
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.22);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border-radius: 20px;
      padding: 20px 22px;
      display: flex;
      align-items: flex-start;
      gap: 16px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
    }

    .benefit-icon-wrapper {
      width: 46px;
      height: 46px;
      border-radius: 12px;
      background: rgba(255, 255, 255, 0.18);
      border: 1px solid rgba(255, 255, 255, 0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      color: #FFA459;
    }

    .benefit-texts {
      display: flex;
      flex-direction: column;
    }

    .benefit-title {
      font-size: 19px;
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
      margin-top: 4px;
      line-height: 1.35;
    }

    /* PUNCHLINE BAR */
    .punchline-bar {
      background: rgba(0, 0, 0, 0.25);
      border-radius: 16px;
      border: 1px dashed rgba(255, 255, 255, 0.28);
      padding: 14px 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      margin-bottom: 24px;
    }

    .punchline-text {
      font-size: 18px;
      font-weight: 700;
      color: #FFFFFF;
      letter-spacing: -0.01em;
    }

    .punchline-tag {
      color: #FFA459;
      font-weight: 800;
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
      transition: transform 0.2s ease;
    }

    .web-url {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 20px;
      font-weight: 700;
      color: #FFFFFF;
      letter-spacing: 0.02em;
      opacity: 0.95;
    }
  </style>
</head>
<body>
  <!-- Graphic Background Elements -->
  <div class="bg-decorations">
    <div class="topo-ring tr-1"></div>
    <div class="topo-ring tr-2"></div>
    <div class="topo-ring tr-3"></div>
    <div class="glow-spot-1"></div>
    <div class="glow-spot-2"></div>

    <!-- Stylized pine/mountain tree vector skyline -->
    <svg class="landscape-silhouette" viewBox="0 0 1080 200" preserveAspectRatio="none" fill="#FFFFFF">
      <path d="M0,200 L0,160 L40,110 L80,160 L130,90 L180,160 L230,120 L270,160 L320,70 L370,160 L420,110 L470,160 L520,85 L570,160 L620,115 L660,160 L710,65 L760,160 L810,105 L860,160 L910,80 L960,160 L1010,110 L1050,160 L1080,130 L1080,200 Z" />
    </svg>
  </div>

  <div class="content-layer">
    <!-- Top Bar -->
    <div class="top-header">
      <div class="brand-group">
        <div class="brand-icon-box">
          <!-- Sparkle / Star Icon -->
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round">
            <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
          </svg>
        </div>
        <div class="brand-names">
          <div class="brand-title">Winterberg Unternehmen</div>
          <div class="brand-subtitle">Das regionale Wirtschaftsportal</div>
        </div>
      </div>

      <div class="badge-kostenlos">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <path d="m9 12 2 2 4-4"/>
        </svg>
        0 € Dauerhaft
      </div>
    </div>

    <!-- Main Hero Hook -->
    <div class="hero-section">
      <h1 class="main-claim">
        Sei dabei.<br>
        Es kostet <span class="highlight-word">
          gar nichts.
          <svg class="accent-swoosh" viewBox="0 0 200 10" preserveAspectRatio="none">
            <path d="M3 7C45 2 95 1 145 4c25 2 42 4 52 1" stroke="#F2761B" stroke-width="5" fill="none" stroke-linecap="round"/>
          </svg>
        </span>
      </h1>
      <p class="sub-claim">
        Mach dein Unternehmen im ganzen Sauerland sichtbar – unkompliziert, regional und zu 100 % kostenfrei.
      </p>
    </div>

    <!-- 4 Clear Value Props -->
    <div class="benefit-grid">
      <!-- 1 -->
      <div class="benefit-card">
        <div class="benefit-icon-wrapper">
          <!-- Storefront icon -->
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/>
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
            <path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/>
            <path d="M2 7h20"/>
          </svg>
        </div>
        <div class="benefit-texts">
          <div class="benefit-title">Betrieb präsentieren</div>
          <div class="benefit-desc">Öffnungszeiten, Leistungen & Fotos für Kunden aus der Region.</div>
        </div>
      </div>

      <!-- 2 -->
      <div class="benefit-card">
        <div class="benefit-icon-wrapper">
          <!-- Calendar icon -->
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/>
            <line x1="16" x2="16" y1="2" y2="6"/>
            <line x1="8" x2="8" y1="2" y2="6"/>
            <line x1="3" x2="21" y1="10" y2="10"/>
            <circle cx="8" cy="14" r="1"/>
            <circle cx="12" cy="14" r="1"/>
            <circle cx="16" cy="14" r="1"/>
          </svg>
        </div>
        <div class="benefit-texts">
          <div class="benefit-title">Events & Termine teilen</div>
          <div class="benefit-desc">Veranstaltungen, Rabatte & News ohne Reichweitenverlust posten.</div>
        </div>
      </div>

      <!-- 3 -->
      <div class="benefit-card">
        <div class="benefit-icon-wrapper">
          <!-- Users icon -->
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
        </div>
        <div class="benefit-texts">
          <div class="benefit-title">Mitarbeiter & Azubis finden</div>
          <div class="benefit-desc">Stellenangebote direkt im regionalen Jobportal veröffentlichen.</div>
        </div>
      </div>

      <!-- 4 -->
      <div class="benefit-card">
        <div class="benefit-icon-wrapper">
          <!-- Trending up icon -->
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/>
            <polyline points="16 7 22 7 22 13"/>
          </svg>
        </div>
        <div class="benefit-texts">
          <div class="benefit-title">Einfach sichtbarer werden</div>
          <div class="benefit-desc">Besseres Google-Ranking und maximale lokale Reichweite.</div>
        </div>
      </div>
    </div>

    <!-- Punchline Bar -->
    <div class="punchline-bar">
      <span class="punchline-text">Und genau darum geht’s am Ende: <span class="punchline-tag">Gemeinsam sichtbar sein!</span></span>
    </div>

    <!-- Footer Bar with CTA -->
    <div class="bottom-footer">
      <div class="cta-button">
        <span>Jetzt Betrieb eintragen</span>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round">
          <line x1="5" y1="12" x2="19" y2="12"></line>
          <polyline points="12 5 19 12 12 19"></polyline>
        </svg>
      </div>

      <div class="web-url">
        winterberg-verzeichnis.de
      </div>
    </div>
  </div>
</body>
</html>
`;

// Also render a 2nd variant: Editorial Minimalist Light Style (Warm cream background #FAF8F5, deep green typography, orange badges)
const htmlContentLight = `<!DOCTYPE html>
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
      padding: 60px 64px;
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
      top: -120px;
      right: -120px;
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
      font-size: 15px;
      font-weight: 800;
      padding: 10px 22px;
      border-radius: 999px;
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }

    .hero-section {
      margin-top: 20px;
      margin-bottom: 20px;
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
      margin-bottom: 14px;
    }

    .main-claim {
      font-size: 66px;
      font-weight: 900;
      line-height: 1.05;
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
      font-size: 22px;
      font-weight: 500;
      color: #4A5850;
      margin-top: 14px;
      max-width: 820px;
      line-height: 1.4;
    }

    .benefit-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin: 10px 0 24px;
    }

    .benefit-card {
      background: #FFFFFF;
      border: 1.5px solid #E5E0D8;
      border-radius: 20px;
      padding: 22px 24px;
      display: flex;
      align-items: flex-start;
      gap: 16px;
      box-shadow: 0 6px 18px rgba(0, 0, 0, 0.04);
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
      flex-shrink: 0;
      color: #0F4C2E;
    }

    .benefit-title {
      font-size: 19px;
      font-weight: 800;
      color: #0F4C2E;
      line-height: 1.2;
    }

    .benefit-desc {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 14px;
      font-weight: 500;
      color: #617066;
      margin-top: 4px;
      line-height: 1.35;
    }

    .punchline-bar {
      background: #0F4C2E;
      color: #FFFFFF;
      border-radius: 16px;
      padding: 16px 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      margin-bottom: 24px;
      box-shadow: 0 8px 20px rgba(15, 76, 46, 0.2);
    }

    .punchline-text {
      font-size: 19px;
      font-weight: 700;
    }
    .punchline-tag {
      color: #FFA459;
      font-weight: 800;
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

    .web-url {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 21px;
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
          <div class="brand-subtitle">Wirtschaftsportal für die Region</div>
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
        📍 Für alle Betriebe in Winterberg & Dörfern
      </div>
      <h1 class="main-claim">
        Sei dabei.<br>
        Es kostet <span class="highlight-word">
          gar nichts.
          <svg class="accent-swoosh" viewBox="0 0 200 10" preserveAspectRatio="none">
            <path d="M3 7C45 2 95 1 145 4c25 2 42 4 52 1" stroke="#F2761B" stroke-width="5" fill="none" stroke-linecap="round"/>
          </svg>
        </span>
      </h1>
      <p class="sub-claim">
        Präsentiere deinen Betrieb, teile Events und finde neue Mitarbeiter direkt vor Ort.
      </p>
    </div>

    <!-- 4 Clear Value Props -->
    <div class="benefit-grid">
      <!-- 1 -->
      <div class="benefit-card">
        <div class="benefit-icon-wrapper">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/>
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
            <path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/>
            <path d="M2 7h20"/>
          </svg>
        </div>
        <div class="benefit-texts">
          <div class="benefit-title">Unternehmen präsentieren</div>
          <div class="benefit-desc">Zeig dein Angebot, Kontaktdaten und Öffnungszeiten.</div>
        </div>
      </div>

      <!-- 2 -->
      <div class="benefit-card">
        <div class="benefit-icon-wrapper">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/>
            <line x1="16" x2="16" y1="2" y2="6"/>
            <line x1="8" x2="8" y1="2" y2="6"/>
            <line x1="3" x2="21" y1="10" y2="10"/>
            <circle cx="8" cy="14" r="1"/>
            <circle cx="12" cy="14" r="1"/>
            <circle cx="16" cy="14" r="1"/>
          </svg>
        </div>
        <div class="benefit-texts">
          <div class="benefit-title">Events & Aktionen posten</div>
          <div class="benefit-desc">Erreiche Einheimische & Gäste ohne Reichweitenverlust.</div>
        </div>
      </div>

      <!-- 3 -->
      <div class="benefit-card">
        <div class="benefit-icon-wrapper">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
        </div>
        <div class="benefit-texts">
          <div class="benefit-title">Mitarbeiter & Azubis finden</div>
          <div class="benefit-desc">Regionale Jobs schalten und Talente direkt vor Ort finden.</div>
        </div>
      </div>

      <!-- 4 -->
      <div class="benefit-card">
        <div class="benefit-icon-wrapper">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/>
            <polyline points="16 7 22 7 22 13"/>
          </svg>
        </div>
        <div class="benefit-texts">
          <div class="benefit-title">Einfach sichtbarer werden</div>
          <div class="benefit-desc">Besseres Google-Ranking & regionale Vernetzung.</div>
        </div>
      </div>
    </div>

    <!-- Punchline Bar -->
    <div class="punchline-bar">
      <span class="punchline-text">Und genau darum geht’s am Ende: <span class="punchline-tag">Sichtbar sein im Sauerland!</span></span>
    </div>

    <!-- Footer Bar with CTA -->
    <div class="bottom-footer">
      <div class="cta-button">
        <span>Jetzt kostenlos eintragen</span>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round">
          <line x1="5" y1="12" x2="19" y2="12"></line>
          <polyline points="12 5 19 12 12 19"></polyline>
        </svg>
      </div>

      <div class="web-url">
        winterberg-verzeichnis.de
      </div>
    </div>
  </div>
</body>
</html>
`;

async function main() {
  console.log('Launching Puppeteer...');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1080, height: 1080, deviceScaleFactor: 2 });

  // 1. Render Forest Green Premium Variant
  await page.setContent(htmlContent, { waitUntil: 'domcontentloaded' });
  await page.evaluateHandle('document.fonts.ready');
  await new Promise(r => setTimeout(r, 600));

  const out1Public = path.join(outputDir, 'instagram-kostenlos-dabei-sein-gruen.png');
  const out1Artifact = path.join(artifactDir, 'instagram-kostenlos-dabei-sein-gruen.png');
  await page.screenshot({ path: out1Public, type: 'png' });
  await page.screenshot({ path: out1Artifact, type: 'png' });
  console.log('Rendered Green variant to:', out1Public, 'and', out1Artifact);

  // 2. Render Elegant Light Cream Variant
  await page.setContent(htmlContentLight, { waitUntil: 'domcontentloaded' });
  await page.evaluateHandle('document.fonts.ready');
  await new Promise(r => setTimeout(r, 600));

  const out2Public = path.join(outputDir, 'instagram-kostenlos-dabei-sein-hell.png');
  const out2Artifact = path.join(artifactDir, 'instagram-kostenlos-dabei-sein-hell.png');
  await page.screenshot({ path: out2Public, type: 'png' });
  await page.screenshot({ path: out2Artifact, type: 'png' });
  console.log('Rendered Light variant to:', out2Public, 'and', out2Artifact);

  await browser.close();
  console.log('Done!');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
