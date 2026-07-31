const fs = require('fs');
let app = fs.readFileSync('src/main.tsx', 'utf8');
if (!app.includes('react-quill/dist/quill.snow.css')) {
  app = "import 'react-quill/dist/quill.snow.css';\n" + app;
  fs.writeFileSync('src/main.tsx', app);
}
