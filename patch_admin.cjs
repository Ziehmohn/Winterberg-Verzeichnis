const fs = require('fs');
let app = fs.readFileSync('src/App.tsx', 'utf8');

const linkIconImport = "Link"; // We'll need to import Link icon from lucide-react if we want it, or just use ArrowRight or Globe. Let's use Globe since it's already imported. Wait, Link is common. Let's just use Globe.

const redirectsComponent = `
function RedirectsAdminPanel({ theme, activeThemeKey }: any) {
  const [redirects, setRedirects] = useState<any[]>([]);
  const [source, setSource] = useState('');
  const [target, setTarget] = useState('');
  const [loading, setLoading] = useState(true);

  const loadRedirects = async () => {
    try {
      const snap = await getDocs(collection(db, 'redirects'));
      setRedirects(snap.docs.map((doc: any) => ({ id: doc.id, ...doc.data() })));
    } catch(e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRedirects();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!source || !target) return;
    try {
      await addDoc(collection(db, 'redirects'), { source, target });
      setSource('');
      setTarget('');
      loadRedirects();
      fetch('/api/refresh-redirects', { method: 'POST' }).catch(console.error);
    } catch(e) {
      console.error(e);
      alert('Fehler beim Speichern');
    }
  };

  const handleDelete = async (id: string) => {
    if(!window.confirm('Weiterleitung wirklich löschen?')) return;
    try {
      await deleteDoc(doc(db, 'redirects', id));
      loadRedirects();
      fetch('/api/refresh-redirects', { method: 'POST' }).catch(console.error);
    } catch(e) {
      console.error(e);
    }
  };

  return (
    <div>
      <h3 className="text-xl font-bold mb-4 font-display">301 Redirects (Weiterleitungen)</h3>
      <p className="text-sm opacity-70 mb-6 max-w-2xl">Hier können Sie permanente (301) Weiterleitungen einrichten. Dies ist nützlich, wenn sich eine URL ändert und Sie sicherstellen möchten, dass bestehende Links weiterhin funktionieren.</p>
      
      <form onSubmit={handleAdd} className="flex flex-col md:flex-row gap-3 items-end mb-8 bg-black/5 p-5 rounded-lg border border-black/10">
        <div className="flex-1 w-full">
          <label className="block text-xs font-bold uppercase mb-1.5 opacity-70">Ausgangs-URL (z.B. /alte-seite)</label>
          <input value={source} onChange={e=>setSource(e.target.value)} required placeholder="/alte-seite" className="w-full px-3 py-2 border border-black/10 rounded focus:outline-none" />
        </div>
        <div className="flex-1 w-full">
          <label className="block text-xs font-bold uppercase mb-1.5 opacity-70">Ziel-URL (z.B. /neue-seite)</label>
          <input value={target} onChange={e=>setTarget(e.target.value)} required placeholder="/neue-seite" className="w-full px-3 py-2 border border-black/10 rounded focus:outline-none" />
        </div>
        <button type="submit" className={\`w-full md:w-auto px-6 py-2 text-sm font-medium transition-colors \${theme.primaryBtn} \${activeThemeKey === 'modern' ? 'rounded-none' : 'rounded-md'}\`}>Hinzufügen</button>
      </form>
      
      {loading ? (
        <p className="opacity-70">Lade Weiterleitungen...</p>
      ) : redirects.length === 0 ? (
        <p className="text-sm opacity-70 italic">Noch keine Weiterleitungen vorhanden.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-black/10 opacity-70">
                <th className="py-3 px-4 font-medium text-sm">Ausgangs-URL</th>
                <th className="py-3 px-4 font-medium text-sm">Ziel-URL</th>
                <th className="py-3 px-4 font-medium text-sm text-right">Aktion</th>
              </tr>
            </thead>
            <tbody>
              {redirects.map(r => (
                <tr key={r.id} className="border-b border-black/10 hover:bg-black/5 transition-colors">
                  <td className="py-3 px-4 text-sm font-medium">{r.source}</td>
                  <td className="py-3 px-4 text-sm opacity-80">{r.target}</td>
                  <td className="py-3 px-4 text-right">
                    <button onClick={() => handleDelete(r.id)} className="text-red-500 hover:text-red-700 p-2 transition-colors rounded hover:bg-red-50" title="Löschen"><Trash2 className="w-4 h-4"/></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

`;

app = app.replace(
  "function AdminDashboard({",
  redirectsComponent + "function AdminDashboard({"
);

app = app.replace(
  "const [activeTab, setActiveTab] = useState<'entries' | 'seo' | 'reviews' | 'abrechnung'>('entries');",
  "const [activeTab, setActiveTab] = useState<'entries' | 'seo' | 'reviews' | 'abrechnung' | 'redirects'>('entries');"
);

const redirectTabButton = `
          <button onClick={() => setActiveTab('redirects')} className={\`px-4 py-2 text-sm font-medium transition-colors \${activeTab === 'redirects' ? 'bg-black text-white' : 'hover:bg-black/5'} \${activeThemeKey === 'modern' ? 'rounded-none' : 'rounded-md'} flex items-center gap-2\`}>
            <Globe className="w-4 h-4" /> 301 Redirects
          </button>
        </div>
`;

app = app.replace(
  /<\/button>\s*<\/div>\s*\{activeTab === 'entries' \? \(/,
  "</button>\n" + redirectTabButton + "\n        {activeTab === 'entries' ? ("
);

const redirectTabContent = `
        ) : activeTab === 'redirects' ? (
          <RedirectsAdminPanel theme={theme} activeThemeKey={activeThemeKey} />
        ) : (
          <SeoAdminPanel
`;

app = app.replace(
  /\) : \(\s*<SeoAdminPanel/,
  redirectTabContent
);

fs.writeFileSync('src/App.tsx', app);
