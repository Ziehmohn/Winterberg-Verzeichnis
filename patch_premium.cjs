const fs = require('fs');
let app = fs.readFileSync('src/App.tsx', 'utf8');

app = app.replace(
  "{bus.subcategory ? `${t(bus.category)} — ${t(bus.subcategory)}` : t(bus.category)}\n                          </div>",
  "{bus.subcategory ? `${t(bus.category)} — ${t(bus.subcategory)}` : t(bus.category)}\n                          </div>\n                          {bus.isPremium && (\n                            <div className={`absolute top-4 right-4 bg-orange-500 text-white shadow-lg shadow-orange-500/30 px-3 py-1 text-xs font-bold flex items-center gap-1 ${activeThemeKey === 'modern' ? 'rounded-none' : 'rounded-full'}`}>\n                              <Star className=\"w-3 h-3 fill-current\" /> Premium\n                            </div>\n                          )}"
);

fs.writeFileSync('src/App.tsx', app);
