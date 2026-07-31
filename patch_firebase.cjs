const fs = require('fs');
let fb = fs.readFileSync('src/firebase.ts', 'utf8');

const DB_ID = "ai-studio-winterberguntern-dcab9b4d-c8de-4204-84d9-91f84061f319";

fb = fb.replace(
  "export const db = getFirestore(app);",
  `export const db = getFirestore(app, "${DB_ID}");`
);

fs.writeFileSync('src/firebase.ts', fb);

let server = fs.readFileSync('server.ts', 'utf8');
server = server.replace(
  "https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/redirects",
  `https://firestore.googleapis.com/v1/projects/\${PROJECT_ID}/databases/${DB_ID}/documents/redirects`
);
fs.writeFileSync('server.ts', server);
