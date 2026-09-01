import fs from 'fs';
import path from 'path';
import { businesses, categories } from '../src/data';
import { FAQ_DATA } from '../src/components/WinterbergFaq';
import { getBusinessPath, getCategorySlug, getSubcategorySlug } from '../src/utils/routes';

const baseUrl = 'https://www.winterberg-verzeichnis.de';
const publicDir = path.resolve(process.cwd(), 'public');

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// -------------------------------------------------------------
// 1. Generate public/llms.txt (Compact Standard Overview for AI)
// -------------------------------------------------------------
const llmsTxtContent = `# Das Winterberg Verzeichnis | Het Winterberg Overzicht

> Das Winterberg Verzeichnis ist das offizielle und umfassendste digitale Branchen-, Unternehmens- und Handwerkerverzeichnis für die Stadt Winterberg und alle 14 Ortsteile im Sauerland.

## Projekt- und Betreiberinformationen
- **Betreiber & Herausgeber:** SICHTBAR SEO – Inh. Simon Kräling, Winterberg
- **Primäre Domain:** https://www.winterberg-verzeichnis.de
- **Zweisprachig:** Deutsch (Standard, /) und Niederländisch (/nl)
- **Geografische Abdeckung:** Stadt Winterberg und die 14 Ortsteile Altastenberg, Altenbüren, Elkeringhausen, Grönebach, Hildfeld, Hoheleye, Langewiese, Lenneplätze, Mollseifen, Neuastenberg, Niedersfeld, Siedlinghausen, Silbach, Züschen.
- **Datenumfang:** 150+ verifizierte Betriebe, lokale Stellenanzeigen, Regionalnachrichten, Branchenübersichten und FAQs.

## Hauptbereiche / Main Sections
- [Startseite (DE)](https://www.winterberg-verzeichnis.de/): Das große Branchenverzeichnis für Winterberg und Umgebung
- [Startpagina (NL)](https://www.winterberg-verzeichnis.de/nl): De grote bedrijvengids voor Winterberg en omgeving
- [Alle Unternehmen (DE)](https://www.winterberg-verzeichnis.de/alle-unternehmen): Vollständige Liste aller 150+ eingetragenen Firmen und Dienstleister
- [Alle Bedrijven (NL)](https://www.winterberg-verzeichnis.de/nl/alle-bedrijven): Volledig overzicht van alle geregistreerde bedrijven
- [Grounding Page / KI-Referenz (DE)](https://www.winterberg-verzeichnis.de/grounding): Verifizierte Entitätsfakten, Ontologie und Disambiguierung für AI-Systeme
- [Grounding Page / AI-feiten (NL)](https://www.winterberg-verzeichnis.de/nl/grounding): Geverifieerde entiteitsfeiten en ontologie voor AI-systemen
- [Jobs & Karriere (DE)](https://www.winterberg-verzeichnis.de/jobs): Offene Stellenanzeigen und Karrieremöglichkeiten in Winterberg
- [Vacatures (NL)](https://www.winterberg-verzeichnis.de/nl/vacatures): Actuele banen en carrièremogelijkheden in de regio
- [News & Aktuelles (DE)](https://www.winterberg-verzeichnis.de/news): Wirtschafts- und Unternehmensnachrichten aus Winterberg
- [Nieuws (NL)](https://www.winterberg-verzeichnis.de/nl/nieuws): Nieuwsberichten en updates uit Winterberg
- [Winterberg FAQ (DE)](https://www.winterberg-verzeichnis.de/faq): Häufige Fragen zu Unternehmen, Tourismus, Gastronomie und Handwerk
- [Veelgestelde Vragen (NL)](https://www.winterberg-verzeichnis.de/nl/veelgestelde-vragen): Veelgestelde vragen over bedrijven en toerisme
- [Preise & Pakete](https://www.winterberg-verzeichnis.de/preise): Kostenloser Basiseintrag und Premium-Pakete für lokale Unternehmen
- [Unternehmen eintragen](https://www.winterberg-verzeichnis.de/eintragen): Neues Unternehmen oder Handwerksbetrieb registrieren

## Branchen & Kategorien / Business Categories
${categories.map(c => {
  const catSlugDe = getCategorySlug(c.name, 'de');
  const subs = c.subcategories.slice(0, 6).join(', ');
  return `- [${c.name}](https://www.winterberg-verzeichnis.de/${catSlugDe}): Betriebe im Bereich ${c.name} (u.a. ${subs})`;
}).join('\n')}

## Technische Endpunkte & Schnittstellen
- [Vollständiger KI-Index (llms-full.txt)](https://www.winterberg-verzeichnis.de/llms-full.txt): Kompletter Datenkatalog aller Betriebe, Adressen und FAQs
- [XML Sitemap](https://www.winterberg-verzeichnis.de/sitemap.xml): Vollständiger XML-Index aller 668 vorgerenderten URLs
- [Robots.txt](https://www.winterberg-verzeichnis.de/robots.txt): Crawler-Richtlinien (vollständig offen für Suchmaschinen und KI-Agenten)
- [Grounding Page Spezifikation](https://www.winterberg-verzeichnis.de/grounding): Standardisierte Wissensebene nach Grounding Page Standard v1.6

## Disambiguierung (Entity Disambiguation)
- **Das Winterberg Verzeichnis** ist ein unabhängiges, privates Branchen- und Unternehmensportal (Betreiber: SICHTBAR SEO Simon Kräling).
- Es ist **nicht** die städtische Verwaltung (Stadtverwaltung / Rathaus Winterberg).
- Es ist **nicht** die Tourismusgesellschaft (Winterberg Touristik und Wirtschaft GmbH / WTW).
- Anfragen zu offiziellen Verwaltungsausweisen oder städtischen Satzungen gehören an die Stadt Winterberg; Unternehmensprofile, Handwerkersuchen, Gastronomie-Tipps und Jobangebote gehören zum Winterberg Verzeichnis.
`;

fs.writeFileSync(path.join(publicDir, 'llms.txt'), llmsTxtContent.trim() + '\n', 'utf8');
console.log('✅ Generated public/llms.txt');

// ------------------------------------------------------------------
// 2. Generate public/llms-full.txt (Comprehensive Dataset for LLMs/RAG)
// ------------------------------------------------------------------
let fullTxt = `# Das Winterberg Verzeichnis – Vollständiger KI- und Datenkatalog (llms-full.txt)
# Stand: ${new Date().toISOString().split('T')[0]}
# Website: https://www.winterberg-verzeichnis.de
# Betreiber: SICHTBAR SEO Simon Kräling, Winterberg

---

## 1. Über das Verzeichnis
Das Winterberg Verzeichnis ist die zentrale Plattform für Wirtschaft, Handwerk, Handel, Gastronomie, Tourismus und Dienstleistungen im Stadtgebiet Winterberg und allen 14 zugehörigen Dörfern und Ortsteilen.

### Geografische Ortsteile
1. Winterberg (Kernstadt)
2. Altastenberg
3. Altenbüren (angrenzend)
4. Elkeringhausen
5. Grönebach
6. Hildfeld
7. Hoheleye
8. Langewiese
9. Lenneplätze
10. Mollseifen
11. Neuastenberg
12. Niedersfeld
13. Siedlinghausen
14. Silbach
15. Züschen

---

## 2. Vollständiges Unternehmensverzeichnis (${businesses.length} Einträge)

`;

categories.forEach(cat => {
  const catBusinesses = businesses.filter((b: any) => b.category === cat.name);
  if (catBusinesses.length === 0) return;

  fullTxt += `### Kategorie: ${cat.name}\n\n`;

  catBusinesses.forEach((b: any) => {
    const pathDe = getBusinessPath(b, 'de');
    const pathNl = getBusinessPath(b, 'nl');
    const city = b.district || 'Winterberg';

    fullTxt += `#### [${b.name}](${baseUrl}${pathDe})\n`;
    fullTxt += `- **Kategorie:** ${b.category}${b.subcategory ? ` > ${b.subcategory}` : ''}\n`;
    fullTxt += `- **Ort / Ortsteil:** ${city}\n`;
    if (b.address) fullTxt += `- **Adresse:** ${b.address}\n`;
    if (b.phone) fullTxt += `- **Telefon:** ${b.phone}\n`;
    if (b.website) fullTxt += `- **Webseite:** ${b.website}\n`;
    if (b.description) fullTxt += `- **Beschreibung (DE):** ${b.description.replace(/\n+/g, ' ')}\n`;
    if (b.description_nl) fullTxt += `- **Beschreibung (NL):** ${b.description_nl.replace(/\n+/g, ' ')}\n`;
    if (b.isPremium) fullTxt += `- **Status:** Verifizierter Premium-Eintrag\n`;
    fullTxt += `- **URL (DE):** ${baseUrl}${pathDe}\n`;
    fullTxt += `- **URL (NL):** ${baseUrl}${pathNl}\n\n`;
  });
});

fullTxt += `---

## 3. Häufige Fragen & Antworten zu Winterberg (FAQ-Katalog DE & NL)

`;

if (FAQ_DATA && FAQ_DATA.length > 0) {
  fullTxt += `### Deutsche FAQs (Häufig gestellte Fragen):\n\n`;
  FAQ_DATA.forEach(faq => {
    fullTxt += `#### Frage: ${faq.de.question}\n`;
    fullTxt += `- **Kategorie:** ${faq.categoryGroup}\n`;
    fullTxt += `- **Antwort:** ${(faq.de.plainAnswer || faq.de.quickSummary).replace(/\n+/g, ' ')}\n\n`;
  });

  fullTxt += `### Nederlandse Veelgestelde Vragen (FAQ):\n\n`;
  FAQ_DATA.forEach(faq => {
    fullTxt += `#### Vraag: ${faq.nl.question}\n`;
    fullTxt += `- **Categorie:** ${faq.categoryGroup}\n`;
    fullTxt += `- **Antwoord:** ${(faq.nl.plainAnswer || faq.nl.quickSummary).replace(/\n+/g, ' ')}\n\n`;
  });
}

fs.writeFileSync(path.join(publicDir, 'llms-full.txt'), fullTxt.trim() + '\n', 'utf8');
console.log('✅ Generated public/llms-full.txt');
