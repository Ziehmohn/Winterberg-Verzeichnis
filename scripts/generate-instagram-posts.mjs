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

// Also read pwa-icon-512.png
const iconPath = path.join(rootDir, 'public', 'pwa-icon-512.png');
const iconBase64 = fs.readFileSync(iconPath).toString('base64');
const iconDataUri = `data:image/png;base64,${iconBase64}`;

const outputDir = path.join(rootDir, 'public');

// HTML Template 1: Exact Website Design (Square 1080x1080)
const template1Square = `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet">
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
      background: #FAF8F5;
      display: flex;
      flex-direction: column;
      position: relative;
    }

    /* TOP HEADER BAR */
    .header-bar {
      height: 96px;
      background: rgba(255, 255, 255, 0.98);
      border-bottom: 2px solid #E7E2DA;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 48px;
      z-index: 20;
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
      color: #5F6B63;
    }
    .logo-text-block {
      display: flex;
      flex-direction: column;
    }
    .logo-main {
      font-family: 'Outfit', sans-serif;
      font-size: 34px;
      font-weight: 900;
      letter-spacing: 0.04em;
      color: #0F4C2E;
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
      color: #1B211D;
      margin-top: 3px;
      line-height: 1;
    }
    .header-badge {
      display: flex;
      align-items: center;
      gap: 12px;
      background: #FFF4EC;
      border: 1.5px solid #FDBA8C;
      color: #C2410C;
      padding: 10px 22px;
      border-radius: 999px;
      font-size: 16px;
      font-weight: 700;
      letter-spacing: 0.02em;
    }
    .ig-icon-svg {
      width: 22px;
      height: 22px;
      fill: #C2410C;
    }

    /* HERO MAIN CONTENT */
    .hero-section {
      flex: 1;
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 48px 52px;
      background-image: 
        linear-gradient(135deg, rgba(6, 40, 23, 0.91) 0%, rgba(15, 76, 46, 0.85) 55%, rgba(6, 35, 20, 0.93) 100%),
        url('${headerImageDataUri}');
      background-size: cover;
      background-position: center 30%;
      color: #FFFFFF;
    }

    .hero-top-badge {
      align-self: flex-start;
      display: inline-flex;
      align-items: center;
      gap: 10px;
      background: rgba(255, 255, 255, 0.12);
      border: 1.5px solid rgba(255, 255, 255, 0.25);
      backdrop-filter: blur(8px);
      padding: 8px 20px;
      border-radius: 999px;
      font-size: 15px;
      font-weight: 700;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      color: #FFA459;
    }
    .pulse-dot {
      width: 10px;
      height: 10px;
      background: #F2761B;
      border-radius: 50%;
      box-shadow: 0 0 10px #F2761B;
    }

    .hero-headline-group {
      margin-top: 16px;
    }
    .hero-h1 {
      font-family: 'Outfit', sans-serif;
      font-size: 58px;
      font-weight: 500;
      line-height: 1.1;
      letter-spacing: -0.01em;
      color: #FFFFFF;
      margin-bottom: 20px;
    }
    .hero-h1-bold {
      font-weight: 900;
      letter-spacing: 0.02em;
      display: inline-block;
      position: relative;
    }
    .hero-h1-bold svg {
      position: absolute;
      bottom: -10px;
      left: 0;
      width: 100%;
      height: 12px;
    }
    .hero-sub {
      font-size: 21px;
      font-weight: 500;
      line-height: 1.5;
      color: rgba(255, 255, 255, 0.92);
      max-width: 860px;
      margin-bottom: 12px;
    }
    .hero-district-list {
      font-size: 15px;
      line-height: 1.55;
      color: rgba(255, 255, 255, 0.72);
      max-width: 880px;
    }

    /* SEARCH BAR MOCKUP */
    .search-mockup {
      background: #FFFFFF;
      border-radius: 20px;
      padding: 10px 12px 10px 24px;
      display: flex;
      align-items: center;
      gap: 16px;
      box-shadow: 0 18px 40px rgba(0, 0, 0, 0.28);
      margin: 22px 0 18px 0;
    }
    .search-mockup-left {
      display: flex;
      align-items: center;
      gap: 14px;
      flex: 1;
    }
    .search-icon {
      width: 26px;
      height: 26px;
      stroke: #8A928B;
    }
    .search-placeholder {
      font-size: 19px;
      color: #6B7280;
      font-weight: 500;
    }
    .search-dropdown-pill {
      background: #F3EFE9;
      color: #1B211D;
      font-size: 16px;
      font-weight: 600;
      padding: 12px 20px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .search-btn {
      background: #F2761B;
      color: #FFFFFF;
      font-family: 'Outfit', sans-serif;
      font-size: 19px;
      font-weight: 700;
      padding: 14px 34px;
      border-radius: 14px;
      border: none;
      box-shadow: 0 4px 14px rgba(242, 118, 27, 0.4);
    }

    /* CATEGORIES PILLS */
    .pills-row {
      display: flex;
      align-items: center;
      gap: 10px;
      flex-wrap: wrap;
      margin-bottom: 14px;
    }
    .pills-label {
      font-size: 14px;
      font-weight: 700;
      color: #FFA459;
      display: flex;
      align-items: center;
      gap: 6px;
      margin-right: 4px;
    }
    .pill {
      background: rgba(255, 255, 255, 0.12);
      border: 1px solid rgba(255, 255, 255, 0.24);
      backdrop-filter: blur(6px);
      padding: 7px 16px;
      border-radius: 999px;
      font-size: 14px;
      font-weight: 600;
      color: #FFFFFF;
    }

    /* STATS & FOOTER BAR */
    .hero-footer {
      border-top: 1px solid rgba(255, 255, 255, 0.18);
      padding-top: 18px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .stats-group {
      display: flex;
      align-items: baseline;
      gap: 40px;
    }
    .stat-item {
      display: flex;
      align-items: baseline;
      gap: 8px;
    }
    .stat-number {
      font-family: 'Outfit', sans-serif;
      font-size: 40px;
      font-weight: 900;
      color: #FFFFFF;
      line-height: 1;
    }
    .stat-label {
      font-size: 16px;
      font-weight: 600;
      color: rgba(255, 255, 255, 0.85);
    }
    .domain-badge {
      display: flex;
      align-items: center;
      gap: 10px;
      background: rgba(0, 0, 0, 0.35);
      border: 1.5px solid rgba(255, 255, 255, 0.28);
      border-radius: 999px;
      padding: 10px 24px;
      font-family: 'Outfit', sans-serif;
      font-size: 18px;
      font-weight: 700;
      letter-spacing: 0.03em;
      color: #FFFFFF;
    }
    .domain-arrow {
      color: #F2761B;
      font-size: 20px;
      font-weight: 900;
    }
  </style>
</head>
<body>
  <!-- HEADER BAR -->
  <header class="header-bar">
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
    <div class="header-badge">
      <svg class="ig-icon-svg" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
      </svg>
      <span>JETZT AUF INSTAGRAM</span>
    </div>
  </header>

  <!-- HERO SECTION -->
  <main class="hero-section">
    <div class="hero-top-badge">
      <span class="pulse-dot"></span>
      <span>Das offizielle regionale Branchenportal</span>
    </div>

    <div class="hero-headline-group">
      <h1 class="hero-h1">
        Das <span class="hero-h1-bold">
          WINTERBERG
          <svg viewBox="0 0 200 10" preserveAspectRatio="none">
            <path d="M3 7C38 2 78 1 118 4c28 2 52 5 79 1" stroke="#F2761B" stroke-width="5" fill="none" stroke-linecap="round"/>
          </svg>
        </span> Verzeichnis
      </h1>
      <p class="hero-sub">
        Handwerk, Gastronomie, Einzelhandel, Dienstleistungen, Freizeit und Unterkünfte — aus der Kernstadt und jedem Ortsteil.
      </p>
      <p class="hero-district-list">
        Finde lokale Anbieter in Winterberg, Züschen, Niedersfeld, Siedlinghausen, Silbach, Neuastenberg, Langewiese, Hoheleye, Mollseifen, Lenneplätze, Elkeringhausen, Grönebach, Hildfeld und Altenfeld.
      </p>
    </div>

    <!-- SEARCH BAR MOCKUP -->
    <div class="search-mockup">
      <div class="search-mockup-left">
        <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.3-4.3"></path>
        </svg>
        <span class="search-placeholder">Was suchst du? (z. B. Restaurant, Dachdecker, Jobs...)</span>
      </div>
      <div class="search-dropdown-pill">
        <span>Alle Ortsteile</span>
        <span>▾</span>
      </div>
      <button class="search-btn">Suchen</button>
    </div>

    <!-- CATEGORIES / TAGS -->
    <div class="pills-row">
      <div class="pills-label">
        <span>✨ Beliebte Bereiche:</span>
      </div>
      <span class="pill">Ferienwohnungen</span>
      <span class="pill">Gastronomie</span>
      <span class="pill">Handwerk</span>
      <span class="pill">Outdoor & Ski</span>
      <span class="pill">Ärzte & Notdienste</span>
      <span class="pill">Jobs</span>
    </div>

    <!-- STATS & FOOTER -->
    <footer class="hero-footer">
      <div class="stats-group">
        <div class="stat-item">
          <span class="stat-number">471</span>
          <span class="stat-label">Unternehmen</span>
        </div>
        <div class="stat-item">
          <span class="stat-number">9</span>
          <span class="stat-label">Kategorien</span>
        </div>
        <div class="stat-item">
          <span class="stat-number">14</span>
          <span class="stat-label">Ortsteile</span>
        </div>
      </div>
      <div class="domain-badge">
        <span class="domain-arrow">↗</span>
        <span>winterberg-verzeichnis.de</span>
      </div>
    </footer>
  </main>
</body>
</html>
`;

// HTML Template 2: Welcome / Introduction Announcement (Square 1080x1080)
const template2Announcement = `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet">
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
      padding: 56px;
      background-image: 
        linear-gradient(145deg, rgba(6, 40, 23, 0.94) 0%, rgba(15, 76, 46, 0.88) 55%, rgba(6, 35, 20, 0.95) 100%),
        url('${headerImageDataUri}');
      background-size: cover;
      background-position: center 25%;
      color: #FFFFFF;
    }

    /* TOP BAR */
    .top-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: rgba(255, 255, 255, 0.12);
      border: 1.5px solid rgba(255, 255, 255, 0.22);
      backdrop-filter: blur(12px);
      border-radius: 24px;
      padding: 16px 28px;
    }
    .logo-container {
      display: flex;
      align-items: baseline;
      gap: 10px;
    }
    .logo-pre {
      font-family: 'Outfit', sans-serif;
      font-size: 20px;
      font-weight: 500;
      color: rgba(255, 255, 255, 0.8);
    }
    .logo-text-block {
      display: flex;
      flex-direction: column;
    }
    .logo-main {
      font-family: 'Outfit', sans-serif;
      font-size: 30px;
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
      font-size: 13px;
      font-weight: 700;
      letter-spacing: 0.36em;
      color: #FFA459;
      margin-top: 2px;
      line-height: 1;
    }
    .top-pill {
      background: #F2761B;
      color: #FFFFFF;
      font-family: 'Outfit', sans-serif;
      font-size: 15px;
      font-weight: 800;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      padding: 10px 22px;
      border-radius: 999px;
      box-shadow: 0 4px 16px rgba(242, 118, 27, 0.5);
    }

    /* CENTER HERO CARD */
    .center-card {
      background: rgba(255, 255, 255, 0.08);
      border: 1.5px solid rgba(255, 255, 255, 0.2);
      backdrop-filter: blur(16px);
      border-radius: 32px;
      padding: 44px 48px;
      box-shadow: 0 24px 60px rgba(0, 0, 0, 0.35);
    }
    .hello-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: rgba(255, 255, 255, 0.16);
      border: 1px solid rgba(255, 255, 255, 0.3);
      padding: 8px 18px;
      border-radius: 999px;
      font-size: 17px;
      font-weight: 700;
      color: #FFA459;
      margin-bottom: 18px;
    }
    .center-h1 {
      font-family: 'Outfit', sans-serif;
      font-size: 54px;
      font-weight: 900;
      line-height: 1.1;
      letter-spacing: -0.01em;
      margin-bottom: 18px;
      color: #FFFFFF;
    }
    .highlight-brand {
      color: #FFA459;
      display: inline-block;
      position: relative;
    }
    .center-desc {
      font-size: 20px;
      line-height: 1.55;
      color: rgba(255, 255, 255, 0.9);
      margin-bottom: 28px;
      max-width: 820px;
    }

    /* 4 VALUE PROPOSITIONS */
    .grid-benefits {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }
    .benefit-item {
      background: rgba(0, 0, 0, 0.25);
      border: 1px solid rgba(255, 255, 255, 0.16);
      border-radius: 18px;
      padding: 16px 20px;
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .benefit-icon {
      width: 44px;
      height: 44px;
      border-radius: 12px;
      background: rgba(242, 118, 27, 0.2);
      border: 1px solid rgba(242, 118, 27, 0.4);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 22px;
      flex-shrink: 0;
    }
    .benefit-text-title {
      font-family: 'Outfit', sans-serif;
      font-size: 18px;
      font-weight: 800;
      color: #FFFFFF;
      margin-bottom: 2px;
    }
    .benefit-text-sub {
      font-size: 14px;
      color: rgba(255, 255, 255, 0.75);
    }

    /* FOOTER ACTION */
    .bottom-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 8px;
    }
    .cta-text-group {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .cta-avatar {
      width: 58px;
      height: 58px;
      border-radius: 16px;
      border: 2px solid #FFA459;
      box-shadow: 0 4px 14px rgba(0, 0, 0, 0.3);
    }
    .cta-heading {
      font-family: 'Outfit', sans-serif;
      font-size: 22px;
      font-weight: 800;
      color: #FFFFFF;
    }
    .cta-sub {
      font-size: 15px;
      color: rgba(255, 255, 255, 0.75);
    }
    .follow-btn {
      background: #FFFFFF;
      color: #0F4C2E;
      font-family: 'Outfit', sans-serif;
      font-size: 20px;
      font-weight: 800;
      padding: 16px 36px;
      border-radius: 999px;
      display: flex;
      align-items: center;
      gap: 10px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
    }
    .follow-btn-arrow {
      color: #F2761B;
      font-size: 22px;
    }
  </style>
</head>
<body>
  <!-- TOP BAR -->
  <header class="top-bar">
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
    <div class="top-pill">
      🎉 WIR SIND AUF INSTAGRAM
    </div>
  </header>

  <!-- CENTER HERO CARD -->
  <div class="center-card">
    <div class="hello-badge">
      <span>👋</span>
      <span>Hallo Winterberg!</span>
    </div>
    <h1 class="center-h1">
      Dein regionales Portal – <br>jetzt auch im <span class="highlight-brand">Instagram-Feed</span>.
    </h1>
    <p class="center-desc">
      Ob alteingesessener Handwerksbetrieb, Gastronomie, Einzelhandel oder moderne Dienstleister: Wir vernetzen Winterberg und alle 14 Ortsteile.
    </p>

    <!-- 4 BENEFITS -->
    <div class="grid-benefits">
      <div class="benefit-item">
        <div class="benefit-icon">🏢</div>
        <div>
          <div class="benefit-text-title">470+ Unternehmen</div>
          <div class="benefit-text-sub">Öffnungszeiten, Kontakte & Angebote</div>
        </div>
      </div>
      <div class="benefit-item">
        <div class="benefit-icon">💼</div>
        <div>
          <div class="benefit-text-title">Jobs & Karriere</div>
          <div class="benefit-text-sub">Aktuelle Stellenangebote vor Ort</div>
        </div>
      </div>
      <div class="benefit-item">
        <div class="benefit-icon">📅</div>
        <div>
          <div class="benefit-text-title">Events & Termine</div>
          <div class="benefit-text-sub">Veranstaltungen & verkaufsoffene Sonntage</div>
        </div>
      </div>
      <div class="benefit-item">
        <div class="benefit-icon">🚨</div>
        <div>
          <div class="benefit-text-title">Notdienste & News</div>
          <div class="benefit-text-sub">Apotheken, Bereitschaft & Aktuelles</div>
        </div>
      </div>
    </div>
  </div>

  <!-- BOTTOM BAR -->
  <footer class="bottom-bar">
    <div class="cta-text-group">
      <img src="${iconDataUri}" class="cta-avatar" alt="Winterberg Verzeichnis Logo" />
      <div>
        <div class="cta-heading">Jetzt folgen & nichts verpassen</div>
        <div class="cta-sub">winterberg-verzeichnis.de • Kostenlose Einträge</div>
      </div>
    </div>
    <div class="follow-btn">
      <span>Folgen</span>
      <span class="follow-btn-arrow">→</span>
    </div>
  </footer>
</body>
</html>
`;

// HTML Template 3: Optimal 4:5 Mobile Feed Format (1080x1350)
const template3Portrait = `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet">
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
      background: #FAF8F5;
    }

    /* TOP HEADER BAR */
    .header-bar {
      height: 110px;
      background: rgba(255, 255, 255, 0.98);
      border-bottom: 2px solid #E7E2DA;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 52px;
      z-index: 20;
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
      color: #5F6B63;
    }
    .logo-text-block {
      display: flex;
      flex-direction: column;
    }
    .logo-main {
      font-family: 'Outfit', sans-serif;
      font-size: 38px;
      font-weight: 900;
      letter-spacing: 0.04em;
      color: #0F4C2E;
      line-height: 1;
    }
    .orange-swoosh {
      width: 100%;
      height: 9px;
      margin-top: 2px;
      display: block;
    }
    .logo-sub {
      font-family: 'Outfit', sans-serif;
      font-size: 16px;
      font-weight: 700;
      letter-spacing: 0.36em;
      color: #1B211D;
      margin-top: 3px;
      line-height: 1;
    }
    .header-badge {
      display: flex;
      align-items: center;
      gap: 12px;
      background: #FFF4EC;
      border: 1.5px solid #FDBA8C;
      color: #C2410C;
      padding: 12px 24px;
      border-radius: 999px;
      font-size: 17px;
      font-weight: 800;
      letter-spacing: 0.02em;
    }

    /* HERO SECTION */
    .hero-section {
      flex: 1;
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 56px 56px 44px;
      background-image: 
        linear-gradient(135deg, rgba(6, 40, 23, 0.91) 0%, rgba(15, 76, 46, 0.86) 55%, rgba(6, 35, 20, 0.94) 100%),
        url('${headerImageDataUri}');
      background-size: cover;
      background-position: center 30%;
      color: #FFFFFF;
    }

    .hero-top-badge {
      align-self: flex-start;
      display: inline-flex;
      align-items: center;
      gap: 10px;
      background: rgba(255, 255, 255, 0.12);
      border: 1.5px solid rgba(255, 255, 255, 0.25);
      backdrop-filter: blur(8px);
      padding: 10px 24px;
      border-radius: 999px;
      font-size: 16px;
      font-weight: 700;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      color: #FFA459;
    }
    .pulse-dot {
      width: 10px;
      height: 10px;
      background: #F2761B;
      border-radius: 50%;
      box-shadow: 0 0 10px #F2761B;
    }

    .hero-headline-group {
      margin-top: 24px;
    }
    .hero-h1 {
      font-family: 'Outfit', sans-serif;
      font-size: 66px;
      font-weight: 500;
      line-height: 1.1;
      letter-spacing: -0.01em;
      color: #FFFFFF;
      margin-bottom: 22px;
    }
    .hero-h1-bold {
      font-weight: 900;
      letter-spacing: 0.02em;
      display: inline-block;
      position: relative;
    }
    .hero-h1-bold svg {
      position: absolute;
      bottom: -10px;
      left: 0;
      width: 100%;
      height: 14px;
    }
    .hero-sub {
      font-size: 23px;
      font-weight: 500;
      line-height: 1.55;
      color: rgba(255, 255, 255, 0.94);
      max-width: 900px;
      margin-bottom: 16px;
    }
    .hero-district-list {
      font-size: 16px;
      line-height: 1.6;
      color: rgba(255, 255, 255, 0.75);
      max-width: 920px;
    }

    /* SEARCH BAR MOCKUP */
    .search-mockup {
      background: #FFFFFF;
      border-radius: 24px;
      padding: 12px 14px 12px 28px;
      display: flex;
      align-items: center;
      gap: 18px;
      box-shadow: 0 20px 48px rgba(0, 0, 0, 0.32);
      margin: 28px 0 22px 0;
    }
    .search-mockup-left {
      display: flex;
      align-items: center;
      gap: 16px;
      flex: 1;
    }
    .search-icon {
      width: 28px;
      height: 28px;
      stroke: #8A928B;
    }
    .search-placeholder {
      font-size: 20px;
      color: #6B7280;
      font-weight: 500;
    }
    .search-dropdown-pill {
      background: #F3EFE9;
      color: #1B211D;
      font-size: 17px;
      font-weight: 600;
      padding: 14px 22px;
      border-radius: 14px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .search-btn {
      background: #F2761B;
      color: #FFFFFF;
      font-family: 'Outfit', sans-serif;
      font-size: 20px;
      font-weight: 800;
      padding: 16px 38px;
      border-radius: 16px;
      border: none;
      box-shadow: 0 4px 16px rgba(242, 118, 27, 0.45);
    }

    /* 4 HIGHLIGHT CARDS */
    .highlights-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 14px;
      margin: 10px 0 24px 0;
    }
    .hl-card {
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      backdrop-filter: blur(8px);
      border-radius: 18px;
      padding: 16px 14px;
      text-align: center;
    }
    .hl-card-icon {
      font-size: 28px;
      margin-bottom: 6px;
    }
    .hl-card-title {
      font-family: 'Outfit', sans-serif;
      font-size: 16px;
      font-weight: 800;
      color: #FFFFFF;
      margin-bottom: 2px;
    }
    .hl-card-sub {
      font-size: 12px;
      color: rgba(255, 255, 255, 0.75);
    }

    /* STATS & FOOTER */
    .hero-footer {
      border-top: 1px solid rgba(255, 255, 255, 0.2);
      padding-top: 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .stats-group {
      display: flex;
      align-items: baseline;
      gap: 48px;
    }
    .stat-item {
      display: flex;
      align-items: baseline;
      gap: 10px;
    }
    .stat-number {
      font-family: 'Outfit', sans-serif;
      font-size: 46px;
      font-weight: 900;
      color: #FFFFFF;
      line-height: 1;
    }
    .stat-label {
      font-size: 17px;
      font-weight: 600;
      color: rgba(255, 255, 255, 0.85);
    }
    .domain-badge {
      display: flex;
      align-items: center;
      gap: 10px;
      background: rgba(0, 0, 0, 0.38);
      border: 1.5px solid rgba(255, 255, 255, 0.3);
      border-radius: 999px;
      padding: 12px 28px;
      font-family: 'Outfit', sans-serif;
      font-size: 20px;
      font-weight: 800;
      letter-spacing: 0.03em;
      color: #FFFFFF;
    }
    .domain-arrow {
      color: #F2761B;
      font-size: 22px;
      font-weight: 900;
    }
  </style>
</head>
<body>
  <!-- HEADER BAR -->
  <header class="header-bar">
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
    <div class="header-badge">
      <span>📸 JETZT AUF INSTAGRAM</span>
    </div>
  </header>

  <!-- HERO SECTION -->
  <main class="hero-section">
    <div class="hero-top-badge">
      <span class="pulse-dot"></span>
      <span>Offizielles Portal für Winterberg & Umgebung</span>
    </div>

    <div class="hero-headline-group">
      <h1 class="hero-h1">
        Das <span class="hero-h1-bold">
          WINTERBERG
          <svg viewBox="0 0 200 10" preserveAspectRatio="none">
            <path d="M3 7C38 2 78 1 118 4c28 2 52 5 79 1" stroke="#F2761B" stroke-width="5" fill="none" stroke-linecap="round"/>
          </svg>
        </span> Verzeichnis
      </h1>
      <p class="hero-sub">
        Handwerk, Gastronomie, Einzelhandel, Dienstleistungen, Freizeit und Unterkünfte — aus der Kernstadt und jedem Ortsteil.
      </p>
      <p class="hero-district-list">
        Finde lokale Anbieter in Winterberg, Züschen, Niedersfeld, Siedlinghausen, Silbach, Neuastenberg, Langewiese, Hoheleye, Mollseifen, Lenneplätze, Elkeringhausen, Grönebach, Hildfeld und Altenfeld.
      </p>
    </div>

    <!-- SEARCH BAR MOCKUP -->
    <div class="search-mockup">
      <div class="search-mockup-left">
        <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.3-4.3"></path>
        </svg>
        <span class="search-placeholder">Was suchst du? (z. B. Restaurant, Dachdecker...)</span>
      </div>
      <div class="search-dropdown-pill">
        <span>Alle Ortsteile</span>
        <span>▾</span>
      </div>
      <button class="search-btn">Suchen</button>
    </div>

    <!-- 4 FEATURE HIGHLIGHTS -->
    <div class="highlights-grid">
      <div class="hl-card">
        <div class="hl-card-icon">🌲</div>
        <div class="hl-card-title">14 Ortsteile</div>
        <div class="hl-card-sub">Vollständig vernetzt</div>
      </div>
      <div class="hl-card">
        <div class="hl-card-icon">🔨</div>
        <div class="hl-card-title">Handwerk & Gastro</div>
        <div class="hl-card-sub">Geprüfte Betriebe</div>
      </div>
      <div class="hl-card">
        <div class="hl-card-icon">💼</div>
        <div class="hl-card-title">Jobs vor Ort</div>
        <div class="hl-card-sub">Regionale Chancen</div>
      </div>
      <div class="hl-card">
        <div class="hl-card-icon">🚨</div>
        <div class="hl-card-title">Notdienste</div>
        <div class="hl-card-sub">Apotheken 24/7</div>
      </div>
    </div>

    <!-- STATS & FOOTER -->
    <footer class="hero-footer">
      <div class="stats-group">
        <div class="stat-item">
          <span class="stat-number">471</span>
          <span class="stat-label">Unternehmen</span>
        </div>
        <div class="stat-item">
          <span class="stat-number">9</span>
          <span class="stat-label">Kategorien</span>
        </div>
        <div class="stat-item">
          <span class="stat-number">14</span>
          <span class="stat-label">Ortsteile</span>
        </div>
      </div>
      <div class="domain-badge">
        <span class="domain-arrow">↗</span>
        <span>winterberg-verzeichnis.de</span>
      </div>
    </footer>
  </main>
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
  page.setViewport({ width: 1080, height: 1080, deviceScaleFactor: 2 }); // High DPI for retina sharpness

  // 1. Render Template 1 (Website Authentic Style - Square)
  console.log('Rendering Template 1 (Square)...');
  await page.setContent(template1Square, { waitUntil: 'networkidle0' });
  await page.evaluateHandle('document.fonts.ready');
  // Small pause to ensure font rendering
  await new Promise(r => setTimeout(r, 600));
  const out1 = path.join(outputDir, 'instagram-post-website-square.png');
  await page.screenshot({ path: out1, type: 'png' });
  console.log(`Saved: ${out1}`);

  // 2. Render Template 2 (Announcement Style - Square)
  console.log('Rendering Template 2 (Announcement Square)...');
  await page.setContent(template2Announcement, { waitUntil: 'domcontentloaded' });
  await page.evaluateHandle('document.fonts.ready');
  await new Promise(r => setTimeout(r, 800));
  const out2 = path.join(outputDir, 'instagram-post-announcement-square.png');
  await page.screenshot({ path: out2, type: 'png' });
  console.log(`Saved: ${out2}`);

  // 3. Render Template 3 (Portrait 1080x1350)
  console.log('Rendering Template 3 (Portrait 4:5)...');
  await page.setViewport({ width: 1080, height: 1350, deviceScaleFactor: 2 });
  await page.setContent(template3Portrait, { waitUntil: 'domcontentloaded' });
  await page.evaluateHandle('document.fonts.ready');
  await new Promise(r => setTimeout(r, 800));
  const out3 = path.join(outputDir, 'instagram-post-website-portrait.png');
  await page.screenshot({ path: out3, type: 'png' });
  console.log(`Saved: ${out3}`);

  await browser.close();
  console.log('All Instagram graphics generated successfully!');
}

render().catch(err => {
  console.error('Render failed:', err);
  process.exit(1);
});
