const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf8');

if (!content.includes("useTranslation")) {
  content = `import { useTranslation } from './i18n';\n` + content;
}

if (!content.includes("const { t } = useTranslation();")) {
  content = content.replace(/(export default function App\([^)]*\)\s*\{)/, "$1\n  const { t } = useTranslation();");
}

fs.writeFileSync('src/App.tsx', content);
