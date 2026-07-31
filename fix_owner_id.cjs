const fs = require('fs');
let app = fs.readFileSync('src/App.tsx', 'utf8');

const ownerIdHtml = `
        <div className="mt-4 pt-4 border-t border-black/10">
          <label className={labelClass}>Besitzer Benutzer-ID (UID)</label>
          <input 
            type="text" 
            value={formData.ownerId || ''} 
            onChange={e => setFormData({...formData, ownerId: e.target.value})} 
            className={inputClass} 
            placeholder="z.B. jUa98zK..." 
          />
          <p className="text-xs mt-1.5 opacity-70">
            Wenn Sie hier die UID eines Benutzers eintragen, sieht dieser das Unternehmen nach dem Login in seinem Dashboard.
          </p>
        </div>
`;

app = app.replace(
  /<div className="flex items-center gap-2 mt-4 pt-4 border-t border-black\/10">/g,
  ownerIdHtml + '\n        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-black/10">'
);

fs.writeFileSync('src/App.tsx', app);
