repo: Ziehmohn/Winterberg-Verzeichnis
branch: main

## Last sync
date: 2026-08-04T12:43:33Z
commit: 1c54e5e57c89

### Updated in this project
- Kartenansicht ergänzt: Liste/Karte-Umschalter auf „Alle Unternehmen“, Leaflet-Karte mit orangen Markern, Live-Geocoding via Nominatim (gecacht), Popup-Klick öffnet Profil — nachgebaut aus src/components/DirectoryMap.tsx.
- Wortmarke „Das WINTERBERG Verzeichnis“ mit Schwung-Linie unter WINTERBERG (Header, Hero, Footer).
- URL-Routing nach dem bestehenden Schema: /{Kategorie}/{Branche}/{name-slug}, /jobs/{Typ}, /eintragen, /preise, /impressum, /datenschutz, /agb, /admin — plus dynamische Seitentitel.
- Adminbereich mit Login: Einträge (CRUD inkl. Premium-Block), Bewertungs-Moderation, Abrechnung, SEO, Redirects, Tracking-Skripte.
- Öffentliche Funktionen: Bewertungen abgeben, Öffnungszeiten mit Geöffnet-Status, Jobboard mit Typ-Filter, Preise, Rechtstexte, Cookie-Banner; alle 15 Ortsteile werden gelistet, auch ohne Einträge.

### Not yet integrated from upstream
- src/i18n.tsx (DE/NL-Mehrsprachigkeit) — noch nicht übernommen, da groß; auf Anfrage separat integrierbar.

## Screen map
| Screen (in DC) | Repo source |
| --- | --- |
| Start (Hero, Kategorien, Ortsteile, Empfohlene) | src/App.tsx (home view), src/data.ts, public/winterberg-header.webp |
| Alle Unternehmen + Filter | src/App.tsx (Such-/Filterlogik), wb-data.js (aus src/data.ts) |
| Unternehmensprofil + Bewertungen | src/components/BusinessDetail.tsx, src/components/ReviewForm.tsx, src/utils.ts (isOpenNow) |
| Jobs | src/components/JobsBoard.tsx, scripts/generate-sitemap.ts (Job-Typen) |
| Kartenansicht (Alle Unternehmen) | src/components/DirectoryMap.tsx |
| Preise | src/components/PricingTable.tsx |
| Eintragen | src/components/SubmitBusiness.tsx |
| Adminbereich | src/components/AdminPanel.tsx, src/components/ScriptManager.tsx, src/App.tsx (SEO-/Redirect-Panels), src/components/Login.tsx |
| Impressum / Datenschutz / AGB | src/components/Impressum.tsx, Datenschutz.tsx, AGB.tsx |
| URL-Schema | scripts/generate-sitemap.ts, src/App.tsx (pushState-Pfade) |

## Sync history
- 2026-08-02T21:22:33Z — Wortmarke, URL-Schema, Admin, öffentliche Funktionen.
- 2026-08-02T21:04:49Z — v2-Redesign in Markenfarben, vollständiger Datenbestand.
- 2026-08-02T20:55:00Z — Erstimport (Modernist-Variante).
