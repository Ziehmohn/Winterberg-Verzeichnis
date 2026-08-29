import React, { useState, useEffect } from 'react';
import { Plus, Trash2, CheckCircle2, Code2, AlertTriangle } from 'lucide-react';
import { db } from '../firebase';
import { collection, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { TrackingScript, ThemeConfig } from '../types';

export default function ScriptManager({ theme, activeThemeKey }: { theme: ThemeConfig, activeThemeKey: string }) {
  const [scripts, setScripts] = useState<TrackingScript[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newScript, setNewScript] = useState<Partial<TrackingScript>>({ category: 'analytics', isActive: true });

  const fetchScripts = async () => {
    try {
      const snap = await getDocs(collection(db, 'scripts'));
      const list: TrackingScript[] = [];
      snap.forEach(d => {
        list.push({ id: d.id, ...d.data() } as TrackingScript);
      });
      setScripts(list);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScripts();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newScript.name || !newScript.code) return;
    
    const id = 'script_' + Date.now().toString(36);
    const toSave: TrackingScript = {
      id,
      name: newScript.name,
      category: newScript.category as any,
      code: newScript.code,
      isActive: newScript.isActive ?? true
    };
    
    try {
      await setDoc(doc(db, 'scripts', id), toSave);
      setScripts([...scripts, toSave]);
      setIsAdding(false);
      setNewScript({ category: 'analytics', isActive: true });
    } catch (e) {
      console.error(e);
      alert('Fehler beim Speichern des Skripts.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Dieses Skript wirklich löschen?")) return;
    try {
      await deleteDoc(doc(db, 'scripts', id));
      setScripts(scripts.filter(s => s.id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  const toggleActive = async (script: TrackingScript) => {
    try {
      const updated = { ...script, isActive: !script.isActive };
      await setDoc(doc(db, 'scripts', script.id), updated);
      setScripts(scripts.map(s => s.id === script.id ? updated : s));
    } catch (e) {
      console.error(e);
    }
  };

  const inputClass = `w-full px-3 py-2 border focus:outline-none focus:ring-2 focus:border-blue-500 focus:ring-blue-500/20 transition-all bg-white ${theme.cardBorder} ${theme.textBase} ${activeThemeKey === 'modern' ? 'rounded-none' : 'rounded-md'}`;
  const labelClass = `block text-sm font-medium mb-1 ${theme.textBase}`;

  if (loading) return <div className="p-4">Lade Skripte...</div>;

  return (
    <div className={`mt-8 border ${theme.cardBg} ${theme.cardBorder} ${activeThemeKey === 'modern' ? 'rounded-none' : 'rounded-lg'} p-6`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold font-display flex items-center gap-2">
            <Code2 className="w-6 h-6 text-orange-500" />
            Cookie & Skript Manager
          </h2>
          <p className="text-sm opacity-70 mt-1">Verwalte externe Skripte (z.B. Facebook Pixel). Sie werden nur geladen, wenn der Nutzer im Cookie-Banner zustimmt.</p>
        </div>
        {!isAdding && (
          <button onClick={() => setIsAdding(true)} className={`flex items-center gap-2 px-4 py-2 bg-black text-white font-medium hover:bg-black/80 transition-colors ${activeThemeKey === 'modern' ? 'rounded-none' : 'rounded-md'}`}>
            <Plus className="w-4 h-4" /> Neues Skript
          </button>
        )}
      </div>

      {isAdding && (
        <form onSubmit={handleSave} className={`mb-8 p-5 bg-black/5 border border-black/10 ${activeThemeKey === 'modern' ? 'rounded-none' : 'rounded-lg'}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className={labelClass}>Name des Skripts (intern)</label>
              <input required type="text" value={newScript.name || ''} onChange={e => setNewScript({...newScript, name: e.target.value})} className={inputClass} placeholder="z.B. Facebook Pixel" />
            </div>
            <div>
              <label className={labelClass}>Cookie-Kategorie</label>
              <select required value={newScript.category || 'analytics'} onChange={e => setNewScript({...newScript, category: e.target.value as any})} className={inputClass}>
                <option value="analytics">Statistiken (z.B. Google Analytics)</option>
                <option value="marketing">Marketing (z.B. Facebook Pixel)</option>
                <option value="externalMedia">Externe Medien (z.B. Maps)</option>
              </select>
            </div>
          </div>
          <div className="mb-4">
            <label className={labelClass}>JavaScript Code (inklusive &lt;script&gt; Tags)</label>
            <textarea 
              required 
              rows={5} 
              value={newScript.code || ''} 
              onChange={e => setNewScript({...newScript, code: e.target.value})} 
              className={`${inputClass} font-mono text-sm`} 
              placeholder={`<script>\n  console.log("Hello World");\n</script>`} 
            />
          </div>
          <div className="flex gap-2 justify-end">
            <button type="button" onClick={() => setIsAdding(false)} className={`px-4 py-2 font-medium bg-white border hover:bg-gray-50 transition-colors ${activeThemeKey === 'modern' ? 'rounded-none' : 'rounded-md'}`}>
              Abbrechen
            </button>
            <button type="submit" className={`px-6 py-2 font-bold bg-orange-500 hover:bg-orange-600 text-white transition-colors ${activeThemeKey === 'modern' ? 'rounded-none' : 'rounded-md'}`}>
              Skript speichern
            </button>
          </div>
        </form>
      )}

      {scripts.length === 0 && !isAdding ? (
        <div className="text-center py-8 opacity-60 text-sm border-t border-black/5">
          Noch keine externen Skripte angelegt.
        </div>
      ) : (
        <div className="space-y-3">
          {scripts.map(script => (
            <div key={script.id} className={`flex items-center justify-between p-4 bg-white border ${theme.cardBorder} ${activeThemeKey === 'modern' ? 'rounded-none' : 'rounded-lg shadow-sm'}`}>
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => toggleActive(script)}
                  className={`w-12 h-6 rounded-full flex items-center transition-colors p-1 ${script.isActive ? 'bg-orange-500' : 'bg-gray-300'}`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full transition-transform ${script.isActive ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
                <div>
                  <h3 className="font-bold flex items-center gap-2">
                    {script.name}
                    {!script.isActive && <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded">Inaktiv</span>}
                  </h3>
                  <p className="text-xs opacity-70 flex items-center gap-1 mt-0.5">
                    Kategorie: <span className="font-medium text-orange-600">{script.category}</span>
                  </p>
                </div>
              </div>
              <button onClick={() => handleDelete(script.id)} className="p-2 text-red-500 hover:bg-red-50 rounded transition-colors" title="Löschen">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
