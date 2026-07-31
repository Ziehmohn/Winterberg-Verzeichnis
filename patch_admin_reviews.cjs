const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Add Reviews Tab Button
code = code.replace(
  /<button onClick=\{\(\) => setActiveTab\('seo'\)\} className=\{`px-4 py-2 text-sm font-medium transition-colors \$\{activeTab === 'seo' \? 'bg-black text-white' : 'hover:bg-black\/5'\} \$\{activeThemeKey === 'modern' \? 'rounded-none' : 'rounded-md'\} flex items-center gap-2`\}>\s*<SearchCode className="w-4 h-4" \/> SEO & Sitemap\s*<\/button>/,
  `<button onClick={() => setActiveTab('reviews')} className={\`px-4 py-2 text-sm font-medium transition-colors \${activeTab === 'reviews' ? 'bg-black text-white' : 'hover:bg-black/5'} \${activeThemeKey === 'modern' ? 'rounded-none' : 'rounded-md'} flex items-center gap-2\`}>
            <Star className="w-4 h-4" /> Bewertungen
          </button>
          <button onClick={() => setActiveTab('seo')} className={\`px-4 py-2 text-sm font-medium transition-colors \${activeTab === 'seo' ? 'bg-black text-white' : 'hover:bg-black/5'} \${activeThemeKey === 'modern' ? 'rounded-none' : 'rounded-md'} flex items-center gap-2\`}>
            <SearchCode className="w-4 h-4" /> SEO & Sitemap
          </button>`
);

// 2. Remove the inline reviews section from entries tab
const entriesReviewSection = `          <>
            <div className={\`mb-8 p-5 border bg-black/5 text-black relative group/admin-review \${theme.cardBorder} \${activeThemeKey === 'modern' ? 'rounded-none border-black' : 'rounded-xl'}\`}>
              <div className={\`flex flex-col md:flex-row items-start md:items-center justify-between gap-4\`}>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Star className={\`w-5 h-5 text-yellow-500\`} />
                    <h3 className="font-bold font-display">Freizugebende Bewertungen <span className="text-xs ml-2 px-2 py-0.5 bg-black text-white rounded-full font-medium align-middle">Aktiv</span></h3>
                  </div>
                  <p className={\`text-sm text-black/80\`}>
                    Kundenbewertungen können in den Unternehmenseinträgen freigegeben oder blockiert werden. 
                    {businesses.flatMap(b => (b.reviews || []).filter(r => r.status === 'pending')).length === 0 ? " Aktuell keine offenen Bewertungen." : \` \${businesses.flatMap(b => (b.reviews || []).filter(r => r.status === 'pending')).length} offene Bewertungen.\`}
                  </p>
                </div>
              </div>
              
              {businesses.flatMap(b => (b.reviews || []).filter(r => r.status === 'pending').map(r => ({ ...r, businessId: b.id, businessName: b.name }))).length > 0 && (
                <div className="mt-4 space-y-3">
                  {businesses.flatMap(b => (b.reviews || []).filter(r => r.status === 'pending').map(r => ({ ...r, businessId: b.id, businessName: b.name }))).map(review => (
                    <div key={review.id} className="bg-white p-3 rounded border border-black/10 flex justify-between items-center">
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
              )}
            </div>
            
            <div className="overflow-x-auto">`;

const cleanEntries = `          <>
            <div className="overflow-x-auto">`;

code = code.replace(entriesReviewSection, cleanEntries);

// 3. Add the reviews tab logic
const reviewsTabLogic = `
        {activeTab === 'reviews' ? (
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
        ) : activeTab === 'seo' ? (`;

code = code.replace(
  /\{activeTab === 'seo' \? \(/,
  reviewsTabLogic
);

fs.writeFileSync('src/App.tsx', code);
console.log("Reviews tab added");
