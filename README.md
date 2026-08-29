# Winterberg Wirtschaft - Digitales Branchenbuch

Ein modernes, voll funktionsfähiges digitales Branchenbuch für die Region Winterberg, entwickelt mit React, TypeScript, Vite, Tailwind CSS und Firebase.

**Live-Website:** [https://www.winterberg-verzeichnis.de](https://www.winterberg-verzeichnis.de)

## Inhaltsverzeichnis

1. [Projektübersicht](#projektübersicht)
2. [Technologie-Stack](#technologie-stack)
3. [Funktionen & Features](#funktionen--features)
4. [Datenmodell & Struktur](#datenmodell--struktur)
5. [Rollen & Berechtigungen](#rollen--berechtigungen)
6. [Projektstruktur](#projektstruktur)
7. [Installation & Setup](#installation--setup)
8. [Backend & Infrastruktur](#backend--infrastruktur)
9. [SEO & Prerendering](#seo--prerendering)

---

## Projektübersicht

Dieses Projekt ist eine Plattform zur Listung lokaler Unternehmen im Raum Winterberg. Nutzer können nach Dienstleistungen, Gastronomie, Handwerkern und weiteren Kategorien suchen. Unternehmen können sich auf der Plattform präsentieren. Es gibt ein Premium-Modell, das erweiterte Darstellungsmöglichkeiten (Bildergalerien, ausführliche formatierte Beschreibungen) bietet.

## Technologie-Stack

- **Frontend:** React 19, TypeScript, Vite
- **Styling:** Tailwind CSS (v4)
- **Icons & Animationen:** Lucide React, Framer Motion (`motion/react`)
- **Karten:** React Leaflet (`react-leaflet`, `leaflet`)
- **Text-Editor:** React Quill (für Premium-Beschreibungen)
- **Backend/Server:** Node.js, Express (für Stripe Checkout und SPA-Routing)
- **Datenbank & Auth:** Firebase (Firestore, Authentication, Storage)
- **Zahlungsabwicklung:** Stripe API

## Funktionen & Features

### Für Endnutzer (Besucher)
- **Suche & Filter:** Intelligente Suchfunktion kombiniert mit Filterung nach Kategorien (z. B. Handwerk, Gastronomie) und Ortsteilen (Winterberg, Altastenberg, etc.).
- **Kartenansicht:** Interaktive Karte zur Darstellung aller gefilterten Unternehmen.
- **Unternehmensprofile:** Detailseiten mit Kontaktdaten, Öffnungszeiten, Standort, Leistungen und Jobangeboten.
- **Bewertungen:** Nutzer können (nach Login) Sterne-Bewertungen und Texte abgeben.
- **Offene Stellen:** Ein integriertes Jobboard listet alle offenen Vakanzen der Region.

### Für Unternehmen (Business Owner)
- **Eigener Eintrag:** Unternehmen können ihre Basisdaten (Öffnungszeiten, Kontakt, Kurzbeschreibung) verwalten.
- **Premium-Account:** Kann via Stripe abonniert werden. Bietet:
  - Höheres Ranking in den Suchergebnissen (wird immer oben gelistet).
  - Visuelle Hervorhebung (Goldener Rahmen, Premium-Badge).
  - Umfangreiche "Über uns"-Beschreibung (über WYSIWYG-Editor).
  - Bildergalerie und wählbares Titelbild (Upload über Firebase Storage).
  - Leistungen & Services Liste.

### Für Administratoren
- **Admin-Dashboard:** Zentrale Verwaltungsoberfläche (aufrufbar via `/admin`).
- **Unternehmensverwaltung:** Hinzufügen, Bearbeiten (inkl. Premium-Features) und Löschen von Unternehmen.
- **Bewertungs-Moderation:** Eingehende Bewertungen prüfen, freigeben oder ablehnen.
- **SEO-Einstellungen:** Meta-Titel, Meta-Beschreibung und Basis-URL für die Plattform anpassen.
- **Redirect-Management:** 301-Weiterleitungen verwalten (z. B. für alte URLs).

## Datenmodell & Struktur

Die zentralen Daten liegen in Firebase Firestore:

### Collections
- \`users\`: Enthält Benutzerdaten und Rollen (\`admin\`, \`business_owner\`, \`user\`).
- \`businesses\`: Enthält die Unternehmensprofile.
- \`redirects\`: Enthält URL-Weiterleitungen.

### Wichtigste Typen (\`src/types.ts\`)
- \`Business\`: Repräsentiert ein Unternehmen. Wichtige Felder:
  - \`isPremium\`: Boolean. Schaltet Bildergalerie und \`extendedDescription\` frei.
  - \`gallery\`: Array von Bild-URLs.
  - \`extendedDescription\`: HTML-String (von React Quill).
  - \`ownerId\`: Verknüpfung zur UID des Besitzers.
  - \`reviews\`: Array eingebetteter \`Review\`-Objekte.

## Rollen & Berechtigungen

Die Absicherung erfolgt sowohl im Frontend als auch über Firestore Security Rules (\`firestore.rules\`).

- **Admin (\`role: 'admin'\`)**: Voller Lese- und Schreibzugriff auf alle Collections.
- **Business Owner (\`role: 'business_owner'\`)**: Schreibzugriff nur auf das eigene Unternehmensprofil.
- **Nutzer (\`role: 'user'\`)**: Darf Bewertungen verfassen.

## Projektstruktur

\`\`\`
.
├── src/
│   ├── components/       # Wiederverwendbare UI-Komponenten (AdminPanel, BusinessDetail, etc.)
│   ├── App.tsx           # Hauptanwendung, Routing und State-Management
│   ├── main.tsx          # React Entrypoint
│   ├── firebase.ts       # Firebase Initialisierung (Auth, DB, Storage)
│   ├── types.ts          # TypeScript Interfaces
│   ├── data.ts           # Statische Kategorien und Initialdaten
│   ├── i18n.ts           # Lokalisierung / Übersetzungen
│   └── AuthContext.tsx   # React Context für Firebase Auth State
├── scripts/
│   ├── generate-sitemap.ts # Skript zur Sitemap-Generierung
│   └── prerender.ts      # Skript für statisches HTML-Prerendering
├── server.ts             # Express Backend-Server (Stripe, Redirects, SPA-Fallback)
├── firestore.rules       # Firebase Security Rules
├── package.json          # Abhängigkeiten und Skripte
└── tailwind.config.js    # (Optional) Tailwind Konfiguration
\`\`\`

## Installation & Setup

1. **Abhängigkeiten installieren:**
   \`\`\`bash
   npm install
   \`\`\`

2. **Umgebungsvariablen einrichten:**
   Lege eine \`.env\` Datei an (für den lokalen Server):
   \`\`\`env
   STRIPE_SECRET_KEY=sk_test_...
   APP_URL=http://localhost:3000
   \`\`\`

3. **Entwicklungsserver starten:**
   \`\`\`bash
   npm run dev
   \`\`\`
   Dies startet den Express-Server (port 3000) inklusive Vite Middleware.

4. **Produktions-Build:**
   \`\`\`bash
   npm run build
   \`\`\`
   Erzeugt das \`dist\`-Verzeichnis und transpiliert den Server zu \`dist/server.cjs\`.

## Backend & Infrastruktur

Das Projekt läuft als Full-Stack-Applikation.
- **Development:** \`server.ts\` lädt Vite über \`middlewareMode\`.
- **Production:** \`node dist/server.cjs\` serviert die statischen Dateien aus \`dist\` und fungiert als API-Gateway für \`/api/create-checkout-session\` (Stripe).
- **Firebase:** Die Kommunikation mit der Datenbank erfolgt Client-seitig über das Firebase JS SDK.

## SEO & Prerendering

Da es sich um ein öffentliches Branchenbuch handelt, ist SEO essenziell:
- \`npm run build\` führt automatisch \`scripts/prerender.ts\` aus.
- Dies rendert Kernseiten (z. B. \`/\`, \`/Handwerk\`) serverseitig in statisches HTML für bessere Indexierbarkeit durch Suchmaschinen (Google Bot).
- \`scripts/generate-sitemap.ts\` erzeugt eine \`sitemap.xml\` basierend auf den vorhandenen Routen und Unternehmensprofilen.
