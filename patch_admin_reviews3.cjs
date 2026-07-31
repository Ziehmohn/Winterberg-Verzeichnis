const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const replacement = `
        ) : activeTab === 'reviews' ? (
          <div>
            <h3 className="text-xl font-bold mb-4 font-display">Kundenbewertungen verwalten</h3>
            
            <div className="mb-6">
              <h4 className="font-bold mb-3">Ausstehende Freigaben</h4>
              {businesses.flatMap(b => (b.reviews || []).filter(r => r.status === 'pending').map(r => ({ ...r, businessId: b.id, businessName: b.name }))).length > 0 ? (
                <div className="space-y-3">
                  {businesses.flatMap(b => (b.reviews || []).filter(r => r.status === 'pending').map(r => ({ ...r, businessId: b.id, businessName: b.name }))).map(review => (
                    <div key={review.id} className="bg-white/5 p-4 rounded border border-black/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div>
                        <div className="font-medium text-sm">{review.businessName} <span className="font-normal opacity-70">({review.rating} Sterne)</span></div>
                        <div className="text-sm opacity-80 mt-1">{review.text}</div>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <button 
                          onClick={() => {
                            setBusinesses(prev => prev.map(b => {
                              if (b.id === review.businessId) {
                                return { ...b, reviews: (b.reviews || []).map(r => r.id === review.id ? { ...r, status: 'approved' } : r) };
                              }
                              return b;
                            }));
                          }}
                          className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
                        >
                          Freigeben
                        </button>
                        <button 
                          onClick={() => {
                            setBusinesses(prev => prev.map(b => {
                              if (b.id === review.businessId) {
                                return { ...b, reviews: (b.reviews || []).filter(r => r.id !== review.id) };
                              }
                              return b;
                            }));
                          }}
                          className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
                        >
                          Löschen
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                 <p className="text-sm opacity-70">Keine ausstehenden Bewertungen.</p>
              )}
            </div>

            <div>
              <h4 className="font-bold mb-3">Veröffentlichte Bewertungen</h4>
              {businesses.flatMap(b => (b.reviews || []).filter(r => r.status === 'approved').map(r => ({ ...r, businessId: b.id, businessName: b.name }))).length > 0 ? (
                <div className="space-y-3">
                  {businesses.flatMap(b => (b.reviews || []).filter(r => r.status === 'approved').map(r => ({ ...r, businessId: b.id, businessName: b.name }))).map(review => (
                    <div key={review.id} className="bg-white/5 p-4 rounded border border-black/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div>
                        <div className="font-medium text-sm">{review.businessName} <span className="font-normal opacity-70">({review.rating} Sterne)</span></div>
                        <div className="text-sm opacity-80 mt-1">{review.text}</div>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <button 
                          onClick={() => {
                            if (window.confirm("Bewertung wirklich löschen?")) {
                              setBusinesses(prev => prev.map(b => {
                                if (b.id === review.businessId) {
                                  return { ...b, reviews: (b.reviews || []).filter(r => r.id !== review.id) };
                                }
                                return b;
                              }));
                            }
                          }}
                          className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
                        >
                          Löschen
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm opacity-70">Keine veröffentlichten Bewertungen vorhanden.</p>
              )}
            </div>
          </div>
        ) : (`;

code = code.replace(
  /\) : \(\s*<SeoAdminPanel/,
  replacement + "\n          <SeoAdminPanel"
);

fs.writeFileSync('src/App.tsx', code);
