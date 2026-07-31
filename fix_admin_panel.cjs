const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const bad = `function AdminPanel({ theme, activeThemeKey, businesses, setBusinesses, onBusinessAdded, onCancel, token, businessToEdit }: any) {
  const { t } = useTranslation(); theme, activeThemeKey, businesses, setBusinesses, onBusinessAdded, onCancel, token, businessToEdit }: any) {`;

const good = `function AdminPanel({ theme, activeThemeKey, businesses, setBusinesses, onBusinessAdded, onCancel, token, businessToEdit }: any) {
  const { t } = useTranslation();`;

content = content.replace(bad, good);

fs.writeFileSync('src/App.tsx', content);
