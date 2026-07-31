const fs = require('fs');
const app = fs.readFileSync('src/App.tsx', 'utf8');
const lines = app.split('\n');

let start = -1;
let end = -1;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes("{activeCategory === 'KFZ-Werkstätten' && (() => {")) start = i;
  if (start !== -1 && lines[i].includes("activeCategory === 'Kleidung'") && lines[i].includes("})()}")) {
    // Wait, each block ends with })()}
  }
}
// Find the last })()} of the Kleidung block
const kText = "activeCategory === 'Kleidung'";
const kIdx = app.indexOf(kText);
const endIdx = app.indexOf("})()}", kIdx) + 5;

const before = app.substring(0, app.indexOf("{activeCategory === 'KFZ-Werkstätten'"));
const after = app.substring(endIdx);
console.log("Lines before:", before.split('\n').length);
console.log("Lines after:", after.split('\n').length);
