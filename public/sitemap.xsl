<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0" 
  xmlns:html="http://www.w3.org/TR/REC-html40"
  xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html xmlns="http://www.w3.org/1999/xhtml" lang="de">
      <head>
        <title>XML Sitemap | Das Winterberg Verzeichnis</title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="crossorigin" />
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&amp;family=Inter:wght@400;500;600&amp;display=swap" rel="stylesheet" />
        <style type="text/css">
          * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
          }
          body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            color: #1B211D;
            background: #FDFCFA;
            line-height: 1.5;
            padding-bottom: 60px;
          }
          header {
            background: #0F4C2E;
            color: #ffffff;
            padding: 40px 24px;
            border-bottom: 3px solid #F2761B;
          }
          .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
          }
          .header-brand {
            display: inline-flex;
            flex-direction: column;
            margin-bottom: 16px;
          }
          .header-brand-small {
            font-family: 'Outfit', sans-serif;
            font-size: 13px;
            font-weight: 500;
            color: rgba(255,255,255,0.7);
            letter-spacing: 0.05em;
          }
          .header-brand-title {
            font-family: 'Outfit', sans-serif;
            font-size: 26px;
            font-weight: 800;
            letter-spacing: 0.08em;
            color: #ffffff;
            line-height: 1;
            margin-top: 2px;
          }
          .badge {
            display: inline-block;
            background: rgba(242, 118, 27, 0.2);
            color: #F2761B;
            border: 1px solid rgba(242, 118, 27, 0.4);
            font-family: 'Outfit', sans-serif;
            font-size: 11.5px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            padding: 4px 10px;
            border-radius: 999px;
            margin-bottom: 10px;
          }
          h1 {
            font-family: 'Outfit', sans-serif;
            font-size: 32px;
            font-weight: 700;
            margin-bottom: 10px;
          }
          .intro {
            font-size: 15px;
            color: rgba(255,255,255,0.85);
            max-width: 68ch;
          }
          .intro a {
            color: #ffffff;
            text-decoration: underline;
            text-underline-offset: 3px;
          }
          .stats-bar {
            background: #ffffff;
            border: 1px solid #EDE8E0;
            border-radius: 18px;
            padding: 20px 24px;
            margin: -24px auto 30px auto;
            box-shadow: 0 10px 30px rgba(15,76,46,0.06);
            display: flex;
            align-items: center;
            justify-content: space-between;
            flex-wrap: wrap;
            gap: 16px;
          }
          .stats-info {
            display: flex;
            align-items: center;
            gap: 24px;
            flex-wrap: wrap;
          }
          .stat-item {
            display: flex;
            flex-direction: column;
          }
          .stat-val {
            font-family: 'Outfit', sans-serif;
            font-size: 24px;
            font-weight: 700;
            color: #0F4C2E;
            line-height: 1.1;
          }
          .stat-label {
            font-size: 12.5px;
            color: #5F6B63;
          }
          .search-box {
            position: relative;
            min-width: 280px;
          }
          .search-input {
            width: 100%;
            padding: 10px 14px 10px 36px;
            border: 1px solid #E7E2DA;
            background: #FAF8F5;
            border-radius: 12px;
            font-size: 14px;
            color: #1B211D;
            outline: none;
            transition: all 0.2s;
          }
          .search-input:focus {
            border-color: #0F4C2E;
            background: #ffffff;
            box-shadow: 0 0 0 3px rgba(15,76,46,0.08);
          }
          .search-icon {
            position: absolute;
            left: 12px;
            top: 50%;
            transform: translateY(-50%);
            color: #8A928B;
            font-size: 14px;
          }
          .table-wrapper {
            background: #ffffff;
            border: 1px solid #EDE8E0;
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0,0,0,0.02);
          }
          table {
            width: 100%;
            border-collapse: collapse;
            text-align: left;
            font-size: 13.5px;
          }
          thead {
            background: #FAF8F5;
            border-bottom: 1px solid #EDE8E0;
          }
          th {
            font-family: 'Outfit', sans-serif;
            font-size: 12.5px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.06em;
            color: #5F6B63;
            padding: 14px 18px;
          }
          tbody tr {
            border-bottom: 1px solid #F3F0EA;
            transition: background 0.15s;
          }
          tbody tr:hover {
            background: #FAF8F5;
          }
          tbody tr:last-child {
            border-bottom: none;
          }
          td {
            padding: 12px 18px;
            color: #4A544D;
            vertical-align: middle;
          }
          td.url-cell {
            font-family: 'Inter', monospace;
            font-size: 13px;
            font-weight: 500;
            max-width: 550px;
            word-break: break-all;
          }
          td.url-cell a {
            color: #0F4C2E;
            text-decoration: none;
            transition: color 0.15s;
          }
          td.url-cell a:hover {
            color: #F2761B;
            text-decoration: underline;
          }
          .lang-badge {
            display: inline-block;
            font-size: 11px;
            font-weight: 700;
            padding: 2px 6px;
            border-radius: 6px;
            background: #E8F1EB;
            color: #0F4C2E;
            margin-right: 4px;
          }
          .lang-badge.nl {
            background: #FFF1E4;
            color: #D65F0C;
          }
          .prio-pill {
            display: inline-block;
            padding: 2px 8px;
            border-radius: 999px;
            font-size: 11.5px;
            font-weight: 700;
            background: #F3F0EA;
            color: #1B211D;
          }
          .prio-high {
            background: #E8F1EB;
            color: #0F4C2E;
          }
          .prio-top {
            background: #FFF1E4;
            color: #D65F0C;
          }
          footer {
            margin-top: 40px;
            text-align: center;
            font-size: 13px;
            color: #8A928B;
          }
          footer a {
            color: #0F4C2E;
            text-decoration: none;
            font-weight: 600;
          }
          footer a:hover {
            color: #F2761B;
          }
        </style>
      </head>
      <body>
        <header>
          <div class="container">
            <div class="header-brand">
              <span class="header-brand-small">Das</span>
              <span class="header-brand-title">WINTERBERG VERZEICHNIS</span>
            </div>
            <div class="badge">Google XML Sitemap</div>
            <h1>XML Sitemap Übersicht</h1>
            <p class="intro">
              Dies ist die offizielle XML-Sitemap von <a href="https://www.winterberg-verzeichnis.de">winterberg-verzeichnis.de</a>. 
              Sie unterstützt Suchmaschinen wie Google und Bing bei der vollständigen Indexierung aller Verzeichnisseiten, Branchen und Unternehmen in Winterberg.
            </p>
          </div>
        </header>

        <div class="container">
          <div class="stats-bar">
            <div class="stats-info">
              <div class="stat-item">
                <span class="stat-val"><xsl:value-of select="count(sitemap:urlset/sitemap:url)"/></span>
                <span class="stat-label">Indexierte URLs</span>
              </div>
              <div class="stat-item">
                <span class="stat-val">DE / NL</span>
                <span class="stat-label">Zweisprachig mit hreflang</span>
              </div>
              <div class="stat-item">
                <span class="stat-val"><xsl:value-of select="sitemap:urlset/sitemap:url[1]/sitemap:lastmod"/></span>
                <span class="stat-label">Letzte Aktualisierung</span>
              </div>
            </div>
            <div class="search-box">
              <span class="search-icon">🔍</span>
              <input type="text" id="sitemapFilter" class="search-input" placeholder="Sitemap durchsuchen..." onkeyup="filterSitemap()" />
            </div>
          </div>

          <div class="table-wrapper">
            <table id="sitemapTable">
              <thead>
                <tr>
                  <th style="width: 50px;">#</th>
                  <th>URL / Pfad</th>
                  <th style="width: 100px;">Sprache</th>
                  <th style="width: 130px;">Letzte Änderung</th>
                  <th style="width: 120px;">Häufigkeit</th>
                  <th style="width: 100px;">Priorität</th>
                </tr>
              </thead>
              <tbody>
                <xsl:for-each select="sitemap:urlset/sitemap:url">
                  <tr>
                    <td style="color: #8A928B; font-weight: 600;"><xsl:value-of select="position()"/></td>
                    <td class="url-cell">
                      <a href="{sitemap:loc}" target="_blank">
                        <xsl:value-of select="sitemap:loc"/>
                      </a>
                    </td>
                    <td>
                      <xsl:choose>
                        <xsl:when test="contains(sitemap:loc, '/nl')">
                          <span class="lang-badge nl">NL</span>
                        </xsl:when>
                        <xsl:otherwise>
                          <span class="lang-badge">DE</span>
                        </xsl:otherwise>
                      </xsl:choose>
                    </td>
                    <td style="color: #5F6B63; font-size: 13px;"><xsl:value-of select="sitemap:lastmod"/></td>
                    <td style="color: #5F6B63; font-size: 13px; text-transform: capitalize;"><xsl:value-of select="sitemap:changefreq"/></td>
                    <td>
                      <xsl:variable name="prio" select="sitemap:priority"/>
                      <xsl:choose>
                        <xsl:when test="$prio = '1.0' or $prio = '0.9'">
                          <span class="prio-pill prio-top"><xsl:value-of select="$prio"/></span>
                        </xsl:when>
                        <xsl:when test="$prio = '0.8' or $prio = '0.7'">
                          <span class="prio-pill prio-high"><xsl:value-of select="$prio"/></span>
                        </xsl:when>
                        <xsl:otherwise>
                          <span class="prio-pill"><xsl:value-of select="$prio"/></span>
                        </xsl:otherwise>
                      </xsl:choose>
                    </td>
                  </tr>
                </xsl:for-each>
              </tbody>
            </table>
          </div>

          <footer>
            <p>© <script type="text/javascript">document.write(new Date().getFullYear())</script> Das Winterberg Verzeichnis · <a href="https://www.winterberg-verzeichnis.de">Zur Startseite</a></p>
          </footer>
        </div>

        <script type="text/javascript">
          function filterSitemap() {
            var input = document.getElementById('sitemapFilter');
            var filter = input.value.toLowerCase();
            var table = document.getElementById('sitemapTable');
            var tr = table.getElementsByTagName('tr');

            for (var i = 1; i &lt; tr.length; i++) {
              var td = tr[i].getElementsByTagName('td')[1];
              if (td) {
                var txtValue = td.textContent || td.innerText;
                if (txtValue.toLowerCase().indexOf(filter) &gt; -1) {
                  tr[i].style.display = '';
                } else {
                  tr[i].style.display = 'none';
                }
              }
            }
          }
        </script>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
