# Projektdokumentation: Winterberger Unternehmens-Verzeichnis

## Inhaltsverzeichnis
1. [Einleitung](#einleitung)
2. [Architektur & Technologien](#architektur--technologien)
3. [Projektstruktur](#projektstruktur)
4. [Funktionsumfang](#funktionsumfang)
5. [SEO & Metadaten](#seo--metadaten)
6. [Datenbank & Authentifizierung (Firebase)](#datenbank--authentifizierung)
7. [Deploy & Prerendering](#deploy--prerendering)
8. [Erweiterung & Wartung](#erweiterung--wartung)

---

## 1. Einleitung
Das "Winterberger Unternehmens-Verzeichnis" (unter *www.winterberg-verzeichnis.de*) ist eine Webanwendung, die als umfassendes Verzeichnis für lokale Unternehmen, Dienstleister, Handwerker und Freizeiteinrichtungen in Winterberg und den umliegenden Ortsteilen (Dörfern) dient. 
Zweck der Anwendung ist die Stärkung der lokalen Wirtschaft und die bessere Auffindbarkeit von Betrieben durch eine optimierte, nutzerfreundliche und SEO-starke Plattform.

## 2. Architektur & Technologien
Das Projekt wurde als moderne Single-Page-Application (SPA) mit integriertem Static-Site-Generation-Ansatz (SSG/Prerendering) für SEO-Zwecke entwickelt. 

**Eingesetzte Technologien:**
- **Frontend-Framework:** React 18+ (via Vite)
- **Programmiersprache:** TypeScript (für Typsicherheit und Wartbarkeit)
- **Styling:** Tailwind CSS (für Utility-First CSS und responsives Design)
- **Backend / Persistenz:** Firebase (Firestore als NoSQL Datenbank, Firebase Auth für Logins)
- **Build-System & SSR/Prerendering:** Vite + custom Build-Skripte (z.B. `esbuild` für das Server-Backend / Prerendering)
- **Icons:** Lucide React
- **Karten-Integration (Optional):** Google Maps API (falls aktiviert)

## 3. Projektstruktur
Die Ordnerstruktur orientiert sich an gängigen React/Vite Best-Practices:

```text
/
├── public/                     # Statische Assets (Favicons, Bilder wie winterberg-header.webp)
├── src/                        # Quellcode der Anwendung
│   ├── components/             # Wiederverwendbare UI-Komponenten
│   ├── App.tsx                 # Hauptkomponente (Routing, Layout, State-Handling)
│   ├── main.tsx                # Einstiegspunkt für React
│   ├── data.ts                 # Initial-Daten / Fallback-Daten der Unternehmen & Kategorien
│   ├── types.ts                # TypeScript Interfaces (Business, Review, UserProfile, etc.)
│   ├── firebase.ts             # Firebase Initialisierung & Config
│   ├── AuthContext.tsx         # Context-Provider für User-Login-Status
│   ├── index.css               # Globale Styles & Tailwind-Imports
│   └── utils.ts                # Hilfsfunktionen (z.B. Tailwind-Klassen-Merge)
├── scripts/                    # Skripte für Build & Prerendering
│   └── prerender.ts            # Generiert statische HTML-Seiten für SEO (Kategorien, Detailseiten)
├── dist/                       # Output-Ordner für den Produktions-Build
├── server.ts                   # Express-Server für Full-Stack / lokales Serving
├── vite.config.ts              # Vite Konfiguration
├── index.html                  # HTML-Einstiegspunkt
└── package.json                # Abhängigkeiten & Scripts
```

## 4. Funktionsumfang

### Für Endnutzer (Besucher):
- **Suchfunktion & Filter:** Nutzer können Unternehmen nach Name, Kategorie oder Ortsteil suchen.
- **Kategorien & Ortsteile:** Unternehmen sind in logische Kategorien (Handwerk, Gastronomie, etc.) und Ortsteile (Kernstadt, Silbach, Züschen, etc.) unterteilt.
- **Unternehmens-Detailansicht:** Jedes Unternehmen hat eine eigene Seite (via Routing/URL-Parametern), die Beschreibungen, Kontaktinfos, Öffnungszeiten und ggf. Bewertungen anzeigt.
- **Theme-Switching:** Verschiedene visuelle Themes (Nature, Winter, Modern, etc.) sind implementiert, um das Design anzupassen.
- **Responsives Layout:** Die Anwendung ist vollständig auf Mobile, Tablet und Desktop optimiert. Auf mobilen Endgeräten wird z.B. das Header-Bild ausgeblendet, um Platz zu sparen.

### Für Administratoren / Business-Owner:
- **Unternehmens-Management:** Über einen Admin-Bereich (`/admin` oder UI-Toggle) können Unternehmen hinzugefügt, bearbeitet oder gelöscht werden (verbunden mit Firestore).
- **Bewertungssystem (Reviews):** Kunden können Bewertungen abgeben, welche vom Admin vor der Veröffentlichung freigegeben werden können ("Pending"-Status).
- **Premium-Features:** Unternehmen können als "Premium" markiert werden.

## 5. SEO & Metadaten
Ein großes Augenmerk liegt auf der Suchmaschinenoptimierung (SEO), um bei Google gut gefunden zu werden.

- **Title & Meta-Tags (`index.html`):** Der Titel der App ist auf `Winterberger Unternehmen` gesetzt. 
- **JSON-LD (Structured Data):** Ein JSON-LD Block vom Typ `WebSite` ist in der `index.html` verankert, damit Google die Seite besser kategorisieren und indexieren kann (zeigt "Winterberger Unternehmen" als Site-Name in den Suchergebnissen an).
- **Open Graph (OG):** Der Tag `<meta property="og:site_name" content="Winterberger Unternehmen" />` wurde integriert, um den Namen beim Teilen (z.B. WhatsApp, Facebook) und in Googles Site-Name-Erkennung korrekt auszugeben.
- **Dynamische Titel (`src/App.tsx`):** Wenn ein Nutzer durch Kategorien navigiert, wird der Titel dynamisch angepasst (z.B. "Handwerk in Winterberg | Winterberger Unternehmen").
- **Prerendering (`scripts/prerender.ts`):** Damit Google-Bots die Inhalte lesen können, werden beim Build-Prozess (`npm run build`) statische HTML-Dateien für alle Routen, Kategorien und Detailseiten generiert.

## 6. Datenbank & Authentifizierung (Firebase)
Die Plattform nutzt **Google Firebase** als Backend-as-a-Service:

- **Firestore (Datenbank):** Speichert Unternehmen (`businesses`), Kategorien, Reviews (`reviews`) und Benutzerprofile (`users`). Firestore ermöglicht Echtzeit-Updates und persistente Speicherung.
- **Firebase Auth:** Regelt die Anmeldung (Login). Benutzer können Rollen zugewiesen bekommen (z.B. `admin`, `business_owner`, `user`), die in der Firestore-Collection `users` hinterlegt sind.
- **Security Rules (`firestore.rules`):** Diese Regeln definieren, wer welche Daten lesen und schreiben darf (z.B. Admins dürfen alles bearbeiten, normale User dürfen nur genehmigte Unternehmen sehen).

## 7. Deploy & Prerendering
Die App kann problemlos als Static-Site oder via Node.js Server deployt werden (z.B. auf Google Cloud Run, Vercel oder einem eigenen vServer).

**Der Build-Prozess (`npm run build`):**
1. **Vite Build:** Kompiliert das React-Frontend in den `/dist`-Ordner (generiert statische Assets: HTML, JS, CSS).
2. **Prerendering:** Das Skript `scripts/prerender.ts` wird ausgeführt. Es liest die statischen Routen und Unternehmensdaten aus und erzeugt für jede Ansicht (z.B. `/Handwerk`, `/Handwerk/Dachdecker`, `/Einzelhandel/Supermarkt/aldi-nord`) eigene `.html`-Dateien im `/dist`-Verzeichnis. Das ist essenziell, damit Suchmaschinen tiefere Seiten direkt crawlen können.
3. **Server Build:** Kompiliert `server.ts` via `esbuild` nach `dist/server.cjs` (für ein Full-Stack-Deployment).

## 8. Erweiterung & Wartung
- **Neue Unternehmen:** Können direkt in der App über den "Eintragen"-Modus (wenn freigeschaltet) oder über den Admin-Modus ergänzt werden.
- **Design-Anpassungen:** Finden hauptsächlich in `src/App.tsx` (für Struktur) und in `src/types.ts` & Theme-Konfiguration statt. CSS-Klassen basieren auf Tailwind, was direkte Anpassungen im HTML vereinfacht.
- **Datenstruktur anpassen:** Wenn Felder für Unternehmen hinzukommen (z.B. Social-Media-Links), muss das Interface `Business` in `src/types.ts` erweitert und die Firestore-Regeln ggf. beachtet werden.

---

## 9. Bewertungs- & Trust-Siegel (Freemium + Backlink-Strategie)
Unternehmen können ihr offizielles Trust-Siegel oder interaktives Bewertungs-Widget direkt auf der eigenen Webseite einbinden:

### Strategie & Differenzierung:
- **Basis-Einträge (Kostenlos):** Erhalten ein kostenloses Trust-Siegel mit festem Verweis und Backlink zu *winterberg-verzeichnis.de*. Dies sorgt für eine virale Generierung wertvoller lokaler Backlinks.
- **Premium-Einträge:** Erhalten vollen Zugriff auf alle Layouts (inkl. Kundenstimmen-Slider und Detailkarte) sowie die **White-Label-Option** (Verweis auf das Portal optional entfernbar).

### Endpunkte & Integration:
- **Standalone Widget Route:** `/embed/reviews/:businessId` (oder `/widget/reviews/:businessId`)
- **URL-Parameter:**
  - `layout`: `badge` (Standard-Siegel), `card` (Bewertungskarte mit Zitat), `carousel` (Kundenstimmen-Slider), `simple_badge` (Mini-Siegel)
  - `theme`: `light` (Hell), `dark` (Dunkel), `brand` (Winterberg Waldgrün), `transparent` (Minimal)
  - `whitelabel`: `1` (nur aktivierbar, wenn `isPremium = true`)
- **Universelles Helper-Skript (`public/widget.js`):** Unterstützt Auto-Resizing des iFrames via `postMessage` und funktioniert in WordPress, Jimdo, Wix, Squarespace, Webflow & statischem HTML.

---
*Erstellt im Rahmen der Projektentwicklung für das Winterberger Unternehmens-Verzeichnis.*
