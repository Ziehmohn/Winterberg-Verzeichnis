const fs = require('fs');
let server = fs.readFileSync('server.ts', 'utf8');

server = server.replace(
  "async function startServer() {",
  "async function startServer() {\n  const app = express();\n  const PORT = 3000;\n"
);

server = server.replace(
  "  const app = express();\n  const PORT = 3000;\n  app.use(express.json());",
  "  app.use(express.json());"
);

fs.writeFileSync('server.ts', server);
