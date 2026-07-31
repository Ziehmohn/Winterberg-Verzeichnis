const fs = require('fs');
let code = fs.readFileSync('scripts/prerender.ts', 'utf8');

code = code.replace(
  "const server = app.listen(3001, () => {",
  `const server = app.listen(0, () => {
    const port = server.address().port;`
);

code = code.replace(
  "console.log('Prerender server listening on port 3001');",
  "console.log('Prerender server listening on port ' + port);"
);

code = code.replace(
  "await page.goto(`http://localhost:3001${p}`",
  "await page.goto(`http://localhost:${server.address().port}${p}`"
);

fs.writeFileSync('scripts/prerender.ts', code);
console.log("Patched prerender.ts");
