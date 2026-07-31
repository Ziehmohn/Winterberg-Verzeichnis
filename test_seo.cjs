const fs = require('fs');
const app = fs.readFileSync('src/App.tsx', 'utf8');
const lines = app.split('\n');
let active = false;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes("activeCategory === 'Kleidung'")) {
    active = true;
  }
  if (active) {
    console.log(lines[i]);
    if (lines[i].includes('})()}')) break;
  }
}
