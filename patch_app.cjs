const fs = require('fs');
let app = fs.readFileSync('src/App.tsx', 'utf8');

app = app.replace("import { useTranslation } from './i18n';\n\nimport ReactQuill from 'react-quill';\nimport 'react-quill/dist/quill.snow.css';", "import { useTranslation } from './i18n';\nimport AdminPanel from './components/AdminPanel';");

const startIndex = app.indexOf('function AdminPanel({ theme, activeThemeKey');
if (startIndex !== -1) {
  // Find the end of AdminPanel
  const seoPanelIndex = app.indexOf('function SeoAdminPanel({');
  if (seoPanelIndex !== -1) {
    app = app.substring(0, startIndex) + app.substring(seoPanelIndex);
  }
}

fs.writeFileSync('src/App.tsx', app);
