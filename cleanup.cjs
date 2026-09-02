const fs = require('fs');

let content = fs.readFileSync('src/data.ts', 'utf8');

const businessesToStripAll = [
  'tinq-tankautomat-langewiese',
  'jet-tankstelle-winterberg',
  'aral-tankstelle-winterberg',
  'calpam-tankautomat-zueschen',
  'imkerei-niggemann',
  'imkerei-becker',
  'fleischerei-heinz-thomas-knieb-siedlinghausen'
];

businessesToStripAll.forEach(id => {
  const r = new RegExp(`(id:\\s*'${id}',[\\s\\S]*?)additionalCategories:\\s*\\[[\\s\\S]*?\\],\\r?\\n`, 'g');
  content = content.replace(r, '$1');
});

const businessesToStripSome = [
  { id: 'baeckerei-gerke-franzes', toRemove: /{\s*category:\s*'Einzelhandel',\s*subcategory:\s*'Supermarkt'\s*}/ },
  { id: 'baeckerei-isken-rewe', toRemove: /{\s*category:\s*'Einzelhandel',\s*subcategory:\s*'Supermarkt'\s*}/ },
  { id: 'pro-biker', toRemove: /{\s*category:\s*'Mobilität & KFZ',\s*subcategory:\s*'KFZ-Werkstätten'\s*}/ },
  { id: 'uppu-biketours', toRemove: /{\s*category:\s*'Gastronomie',\s*subcategory:\s*'Restaurant'\s*}/ },
  { id: 'green-bikes', toRemove: /{\s*category:\s*'Mobilität & KFZ',\s*subcategory:\s*'KFZ-Werkstätten'\s*}/ }
];

businessesToStripSome.forEach(item => {
  const r = new RegExp(`(id:\\s*'${item.id}',[\\s\\S]*?additionalCategories:\\s*\\[)([\\s\\S]*?)(\\])`, 'g');
  content = content.replace(r, (match, start, cats, end) => {
    let newCats = cats.replace(item.toRemove, '');
    newCats = newCats.replace(/,\\s*,/g, ',').replace(/^[\\s,]*/, '').replace(/[\\s,]*$/, '');
    if (newCats.trim() === '') {
      // It's empty now, we should ideally remove the additionalCategories completely,
      // but an empty array is syntactically valid in JS: `additionalCategories: []`
    }
    return start + newCats + end;
  });
});

fs.writeFileSync('src/data.ts', content);
console.log('Cleanup complete.');
