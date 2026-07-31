const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Imports
content = content.replace(
  "import { collection, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';",
  "import { collection, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';\nimport { useTranslation } from './i18n';"
);

content = content.replace(
  "const { currentUser, userProfile } = useAuth();",
  "const { currentUser, userProfile } = useAuth();\n  const { t, lang, setLang } = useTranslation();"
);

// 2. pathParts adjustment
content = content.replace(
  "const pathParts = path.split('/').filter(Boolean);",
  "const pathParts = path.split('/').filter(Boolean);\n    if (pathParts[0] === 'nl') { pathParts.shift(); }"
);

// 3. getPath helper
content = content.replace(
  "const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(initialSelectedBusiness);",
  "const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(initialSelectedBusiness);\n  \n  const getPath = (p: string) => {\n    const base = lang === 'nl' ? '/nl' : '';\n    if (!p || p === '/') return base || '/';\n    if (p.startsWith('/')) return base + p;\n    return base + '/' + p;\n  };"
);

// 4. Update window.history.pushState calls safely
content = content.replace(/window\.history\.pushState\(null, '', '(\/)'\)/g, "window.history.pushState(null, '', getPath('$1'))");
content = content.replace(/window\.history\.pushState\(null, '', `\/\$\{encodeURIComponent\((.*?)\)\}`\)/g, "window.history.pushState(null, '', getPath(`/${encodeURIComponent($1)}`))");
content = content.replace(/window\.history\.pushState\(null, '', `\/\$\{encodeURIComponent\((.*?)\)\}\/\$\{encodeURIComponent\((.*?)\)\}`\)/g, "window.history.pushState(null, '', getPath(`/${encodeURIComponent($1)}/${encodeURIComponent($2)}`))");
content = content.replace(/window\.history\.pushState\(null, '', `\/\$\{encodeURIComponent\((.*?)\)\}\/\$\{encodeURIComponent\((.*?)\)\}\/\$\{encodeURIComponent\((.*?)\.replace\(\/\\\\s\\+\/g, '-'\)\.toLowerCase\(\)\)\}`\)/g, "window.history.pushState(null, '', getPath(`/${encodeURIComponent($1)}/${encodeURIComponent($2)}/${encodeURIComponent($3.replace(/\\s+/g, '-').toLowerCase())}`))");
content = content.replace(/window\.history\.pushState\(null, '', '\/impressum'\)/g, "window.history.pushState(null, '', getPath('/impressum'))");
content = content.replace(/window\.history\.pushState\(null, '', '\/agb'\)/g, "window.history.pushState(null, '', getPath('/agb'))");
content = content.replace(/window\.history\.pushState\(null, '', '\/preise'\)/g, "window.history.pushState(null, '', getPath('/preise'))");
content = content.replace(/window\.history\.pushState\(null, '', '\/eintragen'\)/g, "window.history.pushState(null, '', getPath('/eintragen'))");
content = content.replace(/window\.history\.pushState\(null, '', '\/jobs'\)/g, "window.history.pushState(null, '', getPath('/jobs'))");
content = content.replace(/window\.history\.pushState\(null, '', `\/jobs\/\$\{encodeURIComponent\((\w+)\)\}`\)/g, "window.history.pushState(null, '', getPath(`/jobs/${encodeURIComponent($1)}`))");
content = content.replace(/window\.history\.replaceState\(null, '', '\/'\)/g, "window.history.replaceState(null, '', getPath('/'))");

// 5. Update anchor hrefs safely
content = content.replace(/href="\/"/g, 'href={getPath("/")}');
content = content.replace(/href="\/jobs"/g, 'href={getPath("/jobs")}');

// For string literals in href, carefully replace:
// href={`/${...}`} -> href={getPath(`/${...}`)}
// We'll just replace "href={`" with "href={getPath(`" and then find the closing brace.
// But that's hard with regex. Let's do it manually with a small parser or just simple replaces.
content = content.split('\n').map(line => {
  if (line.includes('href={`/')) {
    // Replace href={`...`} with href={getPath(`...`)}
    return line.replace(/href=\{`([^`]+)`\}/g, 'href={getPath(`$1`)}');
  }
  return line;
}).join('\n');


// 6. Translations
content = content.replace(/placeholder="Suchen \(z\.B\. Hotel, Bäcker\.\.\.\)"/g, 'placeholder={t("searchPlaceholder")}');
content = content.replace(/value="Alle"/g, 'value={t("allLocations")}');
content = content.replace(/>Alle</g, '>{t("allLocations")}<');
content = content.replace(/>Liste</g, '>{t("viewList")}<');
content = content.replace(/>Karte</g, '>{t("viewMap")}<');
content = content.replace(/>Alle Kategorien</g, '>{t("allCategories")}<');
content = content.replace(/>Alle anzeigen</g, '>{t("showAll")}<');
content = content.replace(/>Eintrag erstellen</g, '>{t("createEntry")}<');
content = content.replace(/>Menü</g, '>{t("menu")}<');
content = content.replace(/>Impressum</g, '>{t("impressum")}<');
content = content.replace(/>AGB</g, '>{t("agb")}<');
content = content.replace(/>Preise</g, '>{t("pricing")}<');
content = content.replace(/>Rechtliches</g, '>{t("legal")}<');
content = content.replace(/>Stellenangebote</g, '>{t("jobs")}<');

// categories mapping:
content = content.replace(/\{category\.name\}/g, '{t(category.name)}');
content = content.replace(/\{group\.name\}/g, '{t(group.name)}');
// Note: not touching {sub} here to avoid messing up logic where {sub} might not be just text

// 7. Footer Switcher
const footerCode = `          <div className="flex flex-col md:flex-row items-center gap-4 text-sm font-medium">
            <button
              onClick={() => {
                setLang('de');
                const curr = window.location.pathname.replace(/^\\/nl/, '');
                window.history.pushState(null, '', curr || '/');
              }}
              className={\`\${lang === 'de' ? 'text-black font-bold' : 'text-black/60'} hover:text-black\`}
            >
              DE
            </button>
            <span className="text-black/20">|</span>
            <button
              onClick={() => {
                setLang('nl');
                const curr = window.location.pathname.replace(/^\\/nl/, '');
                window.history.pushState(null, '', '/nl' + (curr === '/' ? '' : curr));
              }}
              className={\`\${lang === 'nl' ? 'text-black font-bold' : 'text-black/60'} hover:text-black\`}
            >
              NL
            </button>
          </div>`;

content = content.replace(
  /{isLoggedIn \? \(/g,
  `${footerCode}\n\n            {isLoggedIn ? (`
);

fs.writeFileSync('src/App.tsx', content);
