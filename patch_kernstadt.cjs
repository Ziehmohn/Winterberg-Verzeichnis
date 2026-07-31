const fs = require('fs');

let dataCode = fs.readFileSync('src/data.ts', 'utf8');
dataCode = dataCode.replace(/'Kernstadt'/g, "'Winterberg'");
dataCode = dataCode.replace(/in der Kernstadt/g, "in Winterberg");
fs.writeFileSync('src/data.ts', dataCode);

let appCode = fs.readFileSync('src/App.tsx', 'utf8');
// "const distName = dist.toLowerCase() === 'kernstadt' ? 'der Kernstadt' : dist;"
appCode = appCode.replace(/const distName = dist\.toLowerCase\(\) === 'kernstadt' \? 'der Kernstadt' : dist;/g, "const distName = dist;");
appCode = appCode.replace(/Kernstadt/g, "Winterberg");

fs.writeFileSync('src/App.tsx', appCode);
console.log("Replaced Kernstadt");
