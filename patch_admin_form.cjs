const fs = require('fs');
let app = fs.readFileSync('src/App.tsx', 'utf8');

const reactQuillImport = `
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
`;
app = app.replace("import { useTranslation } from './i18n';", "import { useTranslation } from './i18n';\n" + reactQuillImport);

// We need to write a script to patch AdminPanel to include all these fields correctly.
