const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function generatePdf() {
  const outputPath = path.join(__dirname, '..', 'public', 'downloads', 'verkaufsoffene-sonntage-winterberg-2026.pdf');
  
  const htmlContent = `
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <title>Verkaufsoffene Sonntage Winterberg 2026</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 12mm 15mm 12mm 15mm;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    }
    body {
      color: #1c2720;
      background: #ffffff;
      font-size: 9pt;
      line-height: 1.35;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 2px solid #0F4C2E;
      padding-bottom: 8px;
      margin-bottom: 12px;
    }
    .brand-title {
      font-size: 15pt;
      font-weight: 800;
      color: #0F4C2E;
      letter-spacing: -0.3px;
    }
    .brand-sub {
      font-size: 8.5pt;
      color: #556B5C;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .badge {
      background: #E8F5E9;
      color: #0F4C2E;
      padding: 4px 10px;
      border-radius: 20px;
      font-size: 8pt;
      font-weight: 700;
      border: 1px solid #A5D6A7;
    }
    .hero {
      background: linear-gradient(135deg, #0F4C2E 0%, #166534 100%);
      color: #ffffff;
      padding: 12px 16px;
      border-radius: 8px;
      margin-bottom: 12px;
    }
    .hero h1 {
      font-size: 14pt;
      font-weight: 800;
      margin-bottom: 4px;
    }
    .hero p {
      font-size: 8.5pt;
      color: #E2E8F0;
      line-height: 1.3;
    }
    .info-bar {
      display: flex;
      gap: 10px;
      margin-top: 8px;
      padding-top: 8px;
      border-top: 1px solid rgba(255, 255, 255, 0.2);
    }
    .info-item {
      font-size: 7.5pt;
      background: rgba(255, 255, 255, 0.15);
      padding: 3px 8px;
      border-radius: 4px;
      font-weight: 600;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 9px;
      margin-bottom: 12px;
    }
    .month-card {
      border: 1px solid #E2E8F0;
      border-radius: 6px;
      overflow: hidden;
      background: #FAFCF9;
    }
    .month-header {
      background: #0F4C2E;
      color: #ffffff;
      font-weight: 700;
      font-size: 8.5pt;
      padding: 4px 8px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .month-count {
      font-size: 7pt;
      background: rgba(255, 255, 255, 0.25);
      padding: 1px 5px;
      border-radius: 10px;
    }
    .date-list {
      list-style: none;
      padding: 6px 8px;
      min-height: 58px;
    }
    .date-item {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      font-size: 8pt;
      padding: 2.5px 0;
      border-bottom: 1px dotted #E2E8F0;
    }
    .date-item:last-child {
      border-bottom: none;
    }
    .date-day {
      font-weight: 700;
      color: #0F4C2E;
      white-space: nowrap;
    }
    .date-event {
      font-size: 6.8pt;
      color: #64748B;
      text-align: right;
      margin-left: 4px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      max-width: 100px;
    }
    .no-dates {
      font-size: 7.5pt;
      color: #94A3B8;
      font-style: italic;
      padding: 14px 0;
      text-align: center;
    }
    .rules-box {
      background: #F8FAFC;
      border: 1px solid #CBD5E1;
      border-left: 4px solid #F59E0B;
      padding: 8px 12px;
      border-radius: 4px;
      margin-bottom: 12px;
    }
    .rules-title {
      font-weight: 700;
      font-size: 8.5pt;
      color: #92400E;
      margin-bottom: 3px;
    }
    .rules-text {
      font-size: 7.5pt;
      color: #475569;
      line-height: 1.35;
    }
    .footer {
      border-top: 1px solid #E2E8F0;
      padding-top: 8px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 7.5pt;
      color: #64748B;
    }
    .footer strong {
      color: #0F4C2E;
    }
  </style>
</head>
<body>

  <div class="header">
    <div>
      <div class="brand-title">Das Winterberg Verzeichnis</div>
      <div class="brand-sub">Offizieller Kalender & Guide für Winterberg</div>
    </div>
    <div class="badge">Bäderregelung NRW 2026</div>
  </div>

  <div class="hero">
    <h1>Verkaufsoffene Sonntage Winterberg 2026</h1>
    <p>Übersicht aller 33 zugelassenen Sonn- & Feiertagsöffnungen für den Einzelhandel in der Ferien- und Kurstadt Winterberg. Erleben Sie Mode, Schuhe, Outdoor und Shopping mit alpinem Flair!</p>
    <div class="info-bar">
      <div class="info-item">🕒 Kernöffnungszeit: 13:00 – 18:00 Uhr</div>
      <div class="info-item">📍 Einkaufsmeile: Am Waltenberg, Hauptstraße & Neue Mitte</div>
      <div class="info-item">🛍️ Über 30 teilnehmende Boutiquen & Fachgeschäfte</div>
    </div>
  </div>

  <div class="grid">
    <!-- Januar -->
    <div class="month-card">
      <div class="month-header"><span>Januar 2026</span><span class="month-count">3 Sonntage</span></div>
      <ul class="date-list">
        <li class="date-item"><span class="date-day">So. 11.01.</span><span class="date-event">Rennrodel WC</span></li>
        <li class="date-item"><span class="date-day">So. 18.01.</span><span class="date-event">Junior WC Rodeln</span></li>
        <li class="date-item"><span class="date-day">So. 25.01.</span><span class="date-event">Wintersport</span></li>
      </ul>
    </div>

    <!-- Februar -->
    <div class="month-card">
      <div class="month-header"><span>Februar 2026</span><span class="month-count">4 Sonntage</span></div>
      <ul class="date-list">
        <li class="date-item"><span class="date-day">So. 01.02.</span><span class="date-event">Winterferien</span></li>
        <li class="date-item"><span class="date-day">So. 08.02.</span><span class="date-event">Skisaison</span></li>
        <li class="date-item"><span class="date-day">So. 15.02.</span><span class="date-event">Karnevalswochenende</span></li>
        <li class="date-item"><span class="date-day">So. 22.02.</span><span class="date-event">Hauptsaison</span></li>
      </ul>
    </div>

    <!-- März -->
    <div class="month-card">
      <div class="month-header"><span>März 2026</span><span class="month-count">1 Sonntag</span></div>
      <ul class="date-list">
        <li class="date-item"><span class="date-day">So. 29.03.</span><span class="date-event">Frühjahrsauftakt</span></li>
      </ul>
    </div>

    <!-- April -->
    <div class="month-card">
      <div class="month-header"><span>April 2026</span><span class="month-count">2 Sonntage</span></div>
      <ul class="date-list">
        <li class="date-item"><span class="date-day">So. 19.04.</span><span class="date-event">Frühling im Sauerland</span></li>
        <li class="date-item"><span class="date-day">So. 26.04.</span><span class="date-event">Königstag (NL)</span></li>
      </ul>
    </div>

    <!-- Mai -->
    <div class="month-card">
      <div class="month-header"><span>Mai 2026</span><span class="month-count">5 Sonntage</span></div>
      <ul class="date-list">
        <li class="date-item"><span class="date-day">So. 03.05.</span><span class="date-event">Mai-Shopping</span></li>
        <li class="date-item"><span class="date-day">So. 10.05.</span><span class="date-event">Stadterlebnis</span></li>
        <li class="date-item"><span class="date-day">So. 17.05.</span><span class="date-event">Himmelfahrt-Woche</span></li>
        <li class="date-item"><span class="date-day">So. 24.05.</span><span class="date-event">Pfingstsonntag</span></li>
        <li class="date-item"><span class="date-day">So. 31.05.</span><span class="date-event">Sauerland Klassik</span></li>
      </ul>
    </div>

    <!-- Juni -->
    <div class="month-card">
      <div class="month-header"><span>Juni 2026</span><span class="month-count">1 Sonntag</span></div>
      <ul class="date-list">
        <li class="date-item"><span class="date-day">So. 07.06.</span><span class="date-event">Sommerauftakt</span></li>
      </ul>
    </div>

    <!-- Juli -->
    <div class="month-card">
      <div class="month-header"><span>Juli 2026</span><span class="month-count">0 Sonntage</span></div>
      <div class="no-dates">Keine Sonntagsöffnungen (Sommerpause Einzelhandel)</div>
    </div>

    <!-- August -->
    <div class="month-card">
      <div class="month-header"><span>August 2026</span><span class="month-count">5 Sonntage</span></div>
      <ul class="date-list">
        <li class="date-item"><span class="date-day">So. 02.08.</span><span class="date-event">Sommerferien</span></li>
        <li class="date-item"><span class="date-day">So. 09.08.</span><span class="date-event">Urlaubssaison</span></li>
        <li class="date-item"><span class="date-day">So. 16.08.</span><span class="date-event">Winterberger Kirmes</span></li>
        <li class="date-item"><span class="date-day">So. 23.08.</span><span class="date-event">Sunshine Race</span></li>
        <li class="date-item"><span class="date-day">So. 30.08.</span><span class="date-event">Ferienausklang</span></li>
      </ul>
    </div>

    <!-- September -->
    <div class="month-card">
      <div class="month-header"><span>September 2026</span><span class="month-count">4 Sonntage</span></div>
      <ul class="date-list">
        <li class="date-item"><span class="date-day">So. 06.09.</span><span class="date-event">Sauerland Rundfahrt</span></li>
        <li class="date-item"><span class="date-day">So. 13.09.</span><span class="date-event">Spätsommer-Bummel</span></li>
        <li class="date-item"><span class="date-day">So. 20.09.</span><span class="date-event">Herbstkollektionen</span></li>
        <li class="date-item"><span class="date-day">So. 27.09.</span><span class="date-event">Wanderwochenende</span></li>
      </ul>
    </div>

    <!-- Oktober -->
    <div class="month-card">
      <div class="month-header"><span>Oktober 2026</span><span class="month-count">5 Termine</span></div>
      <ul class="date-list">
        <li class="date-item"><span class="date-day">Sa. 03.10.</span><span class="date-event">Tag der dt. Einheit</span></li>
        <li class="date-item"><span class="date-day">So. 04.10.</span><span class="date-event">Feiertagswochenende</span></li>
        <li class="date-item"><span class="date-day">So. 11.10.</span><span class="date-event">Herbstferien</span></li>
        <li class="date-item"><span class="date-day">So. 18.10.</span><span class="date-event">Herbstferien</span></li>
        <li class="date-item"><span class="date-day">So. 25.10.</span><span class="date-event">Goldener Oktober</span></li>
      </ul>
    </div>

    <!-- November -->
    <div class="month-card">
      <div class="month-header"><span>November 2026</span><span class="month-count">0 Sonntage</span></div>
      <div class="no-dates">Keine Sonntagsöffnungen (Stille Tage)</div>
    </div>

    <!-- Dezember -->
    <div class="month-card">
      <div class="month-header"><span>Dezember 2026</span><span class="month-count">3 Termine</span></div>
      <ul class="date-list">
        <li class="date-item"><span class="date-day">So. 20.12.</span><span class="date-event">4. Advent / Vorweihnacht</span></li>
        <li class="date-item"><span class="date-day">Sa. 26.12.</span><span class="date-event">2. Weihnachtstag</span></li>
        <li class="date-item"><span class="date-day">So. 27.12.</span><span class="date-event">Winterdorf & Silvester</span></li>
      </ul>
    </div>
  </div>

  <div class="rules-box">
    <div class="rules-title">Wichtige Besucher-Hinweise & Regelungen</div>
    <div class="rules-text">
      <strong>Bäderverordnung NRW (§ 10 LÖG):</strong> Als heilklimatischer Kurort darf der Einzelhandel in Winterberg an bis zu 40 Sonn- und Feiertagen im Jahr öffnen. Die Kernöffnungszeit der Bekleidungsgeschäfte, Modegeschäfte, Schuhhäuser, Sportfachgeschäfte und Outlets liegt zwischen <strong>13:00 und 18:00 Uhr</strong>. Bäckereien und Gastronomien öffnen in der Regel früher. Supermärkte (Aldi, Lidl, etc.) bleiben sonntags geschlossen. Alle Angaben basieren auf der amtlichen Genehmigung für 2026 (Änderungen vorbehalten).
    </div>
  </div>

  <div class="footer">
    <div><strong>Das Winterberg Verzeichnis</strong> · Alle Geschäfte & Betriebe im Überblick</div>
    <div>Online-Guide & Profile: <strong>www.winterberg-verzeichnis.de/shoppen-in-winterberg</strong></div>
  </div>

</body>
</html>
  `;

  console.log('Launching browser to render PDF...');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
  await page.pdf({
    path: outputPath,
    format: 'A4',
    printBackground: true,
    margin: {
      top: '0mm',
      bottom: '0mm',
      left: '0mm',
      right: '0mm'
    }
  });

  await browser.close();
  console.log('Successfully generated PDF at:', outputPath);
  console.log('File size:', fs.statSync(outputPath).size, 'bytes');
}

generatePdf().catch(err => {
  console.error('Error generating PDF:', err);
  process.exit(1);
});
