const fs = require('fs');
const glob = require('glob'); // wait, we don't have glob, just use raw node

function findFiles(dir, files = []) {
  fs.readdirSync(dir).forEach(file => {
    const name = dir + '/' + file;
    if (fs.statSync(name).isDirectory()) {
      findFiles(name, files);
    } else if (name.endsWith('.tsx') || name.endsWith('.ts')) {
      files.push(name);
    }
  });
  return files;
}

const allFiles = findFiles('src');
let allKeys = new Set();

allFiles.forEach(f => {
  const code = fs.readFileSync(f, 'utf8');
  // Match t("key") or t('key')
  const regex = /t\(['"]([^'"]+)['"]\)/g;
  let match;
  while ((match = regex.exec(code)) !== null) {
    allKeys.add(match[1]);
  }
});

const i18n = fs.readFileSync('src/i18n.tsx', 'utf8');

const missingDE = [];
const missingNL = [];

for (const key of allKeys) {
  if (!i18n.includes(`"${key}":`) && !i18n.includes(`'${key}':`)) {
    missingDE.push(key);
  }
}

console.log("Missing keys:");
console.log(missingDE);
