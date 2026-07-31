const fs = require('fs');
let app = fs.readFileSync('src/App.tsx', 'utf8');

app = app.replace(
  "    return matchesCategory && matchesSearch && matchesLocation;\n  });",
  "    return matchesCategory && matchesSearch && matchesLocation;\n  }).sort((a, b) => {\n    if (a.isPremium && !b.isPremium) return -1;\n    if (!a.isPremium && b.isPremium) return 1;\n    return a.name.localeCompare(b.name);\n  });"
);

app = app.replace(
  "key={bus.id} \n                        className={`group flex flex-col overflow-hidden border transition-all hover:-translate-y-1 bg-white ${theme.cardBorder} ${theme.cardShadow} ${activeThemeKey === 'modern' ? 'rounded-none' : 'rounded-xl'}`}",
  "key={bus.id} \n                        className={`group flex flex-col overflow-hidden transition-all hover:-translate-y-1 bg-white ${bus.isPremium ? 'border-2 border-orange-400 shadow-lg shadow-orange-500/20' : 'border ' + theme.cardBorder + ' ' + theme.cardShadow} ${activeThemeKey === 'modern' ? 'rounded-none' : 'rounded-xl'}`}"
);

fs.writeFileSync('src/App.tsx', app);
