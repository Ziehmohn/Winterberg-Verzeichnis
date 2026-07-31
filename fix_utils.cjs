const fs = require('fs');

function patchFile(filepath) {
  if (!fs.existsSync(filepath)) return;
  let content = fs.readFileSync(filepath, 'utf8');

  // ensure useTranslation is imported
  if (!content.includes("useTranslation")) {
      content = `import { useTranslation } from './i18n';\n` + content;
  }

  // we can't use a hook outside of a component, so we need to either pass t, or remove the usages of t from utils.ts. Since utils.ts is just a helper, it's easier to remove t from utils.ts and just pass the raw string and let the component translate it, or just use hardcoded german since this app seems mostly german
  
  content = content.replace(/t\('noInfo'\) \|\| /g, "");
  content = content.replace(/t\('closedNow'\) \|\| /g, "");
  content = content.replace(/t\('openNow'\)/g, "'Geöffnet'");
  content = content.replace(/t\('closesAt'\) \|\| /g, "");
  content = content.replace(/t\('closedNow'\)/g, "'Geschlossen'");
  content = content.replace(/t\('opensAt'\) \|\| /g, "");

  fs.writeFileSync(filepath, content);
}

patchFile('src/utils.ts');
