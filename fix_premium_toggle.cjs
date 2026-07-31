const fs = require('fs');
let app = fs.readFileSync('src/App.tsx', 'utf8');

// Header row
const headerTarget = `                    <th className="py-3 px-4 font-medium">Status</th>
                    <th className="py-3 px-4 font-medium">Aktionen</th>`;
const headerReplacement = `                    <th className="py-3 px-4 font-medium">Status</th>
                    <th className="py-3 px-4 font-medium hidden sm:table-cell">Premium</th>
                    <th className="py-3 px-4 font-medium">Aktionen</th>`;
app = app.replace(headerTarget, headerReplacement);

// Data row
const dataTarget = `                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          {bus.status === 'pending' && (`;

const dataReplacement = `                      <td className="py-3 px-4 hidden sm:table-cell">
                        <button 
                          onClick={async () => {
                            try {
                              const updated = { ...bus, isPremium: !bus.isPremium };
                              await setDoc(doc(db, 'businesses', bus.id), updated);
                              setBusinesses(businesses.map((b) => b.id === bus.id ? updated : b));
                            } catch (e) {
                              console.error(e);
                            }
                          }}
                          className={\`px-3 py-1 text-xs font-bold rounded-full transition-colors \${bus.isPremium ? 'bg-orange-100 text-orange-800 hover:bg-orange-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}\`}
                        >
                          {bus.isPremium ? 'Premium' : 'Standard'}
                        </button>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          {bus.status === 'pending' && (`;

app = app.replace(dataTarget, dataReplacement);

const colspanTarget = `<td colSpan={3} className="py-8 text-center opacity-70">Keine Einträge für diese Kategorie vorhanden.</td>`;
const colspanReplacement = `<td colSpan={5} className="py-8 text-center opacity-70">Keine Einträge für diese Kategorie vorhanden.</td>`;
app = app.replace(colspanTarget, colspanReplacement);


fs.writeFileSync('src/App.tsx', app);
