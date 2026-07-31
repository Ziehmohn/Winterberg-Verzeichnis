const fs = require('fs');
let fb = fs.readFileSync('src/firebase.ts', 'utf8');
fb = fb.replace("import { getAuth } from 'firebase/auth';", "import { getAuth } from 'firebase/auth';\nimport { getStorage } from 'firebase/storage';");
fb = fb.replace("export const auth = getAuth(app);", "export const auth = getAuth(app);\nexport const storage = getStorage(app);");
fs.writeFileSync('src/firebase.ts', fb);
