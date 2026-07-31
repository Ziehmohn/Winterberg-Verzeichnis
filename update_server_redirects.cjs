const fs = require('fs');
let server = fs.readFileSync('server.ts', 'utf8');

const redirectLogic = `
const PROJECT_ID = "gen-lang-client-0671429103";
let redirectsMap = new Map<string, string>();

async function fetchRedirects() {
  try {
    const res = await fetch(\`https://firestore.googleapis.com/v1/projects/\${PROJECT_ID}/databases/(default)/documents/redirects\`);
    const data = await res.json();
    const newMap = new Map<string, string>();
    if (data.documents) {
      data.documents.forEach((doc: any) => {
        const source = doc.fields.source?.stringValue;
        const target = doc.fields.target?.stringValue;
        if (source && target) {
          newMap.set(source, target);
        }
      });
    }
    redirectsMap = newMap;
    console.log("Redirects loaded:", redirectsMap.size);
  } catch(e) {
    console.error("Error fetching redirects", e);
  }
}

fetchRedirects();
setInterval(fetchRedirects, 60000);

`;

const refreshEndpoint = `
  app.post('/api/refresh-redirects', (req, res) => {
    fetchRedirects();
    res.json({ success: true });
  });

  // Redirect Middleware
  app.use((req, res, next) => {
    const target = redirectsMap.get(req.path);
    if (target) {
      return res.redirect(301, target);
    }
    next();
  });
`;

server = server.replace(/async function startServer\(\) \{/, redirectLogic + '\nasync function startServer() {\n' + refreshEndpoint);

fs.writeFileSync('server.ts', server);
