const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const funcs = ['AdminDashboard', 'SeoAdminPanel', 'InteractiveLockOverlay'];
for (const fn of funcs) {
  content = content.replace(new RegExp(`(function ${fn}\\([^{]*\\)\\s*\\{)`), `$1\n  const { t } = useTranslation();\n`);
}

fs.writeFileSync('src/App.tsx', content);
