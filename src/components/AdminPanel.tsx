import React, { useState } from 'react';
import { ArrowLeft, Trash2, Image as ImageIcon, Upload } from 'lucide-react';
import { Business, CategoryGroup } from '../types';
import { categories } from '../data';
import { useTranslation } from '../i18n';
import { db, storage } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export default function AdminPanel({ theme, activeThemeKey, businesses, setBusinesses, onBusinessAdded, onCancel, businessToEdit }: any) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<Business>(businessToEdit || {
    id: '',
    name: '',
    category: categories[0].name,
    subcategory: '',
    description: '',
    address: '',
    district: '',
    phone: '',
    email: '',
    website: '',
    uploadedImage: '',
    imageLink: '',
    services: [],
    openingHours: { monday: '', tuesday: '', wednesday: '', thursday: '', friday: '', saturday: '', sunday: '' },
    gallery: [],
    isPremium: false,
    extendedDescription: '',
    ownerId: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newService, setNewService] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const newId = formData.id || 'b_' + Date.now().toString(36);
    const dataToSubmit = {
      ...formData,
      status: formData.status || 'approved',
      id: newId
    };
    
    try {
      await setDoc(doc(db, 'businesses', newId), dataToSubmit);
      if (formData.id) {
        setBusinesses((prev: Business[]) => prev.map((b: Business) => b.id === formData.id ? dataToSubmit : b));
      } else {
        setBusinesses((prev: Business[]) => [...prev, dataToSubmit]);
      }
      onBusinessAdded();
    } catch (err) {
      console.error(err);
      alert('Fehler beim Speichern');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setUploadingImage(true);
    
    try {
      const storageRef = ref(storage, \`businesses/\${Date.now()}_\${file.name}\`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      
      setFormData(prev => ({
        ...prev,
        gallery: [...(prev.gallery || []), url],
        imageLink: prev.imageLink || url // Set as title image if none exists
      }));
    } catch (err) {
      console.error("Upload error", err);
      alert("Fehler beim Hochladen des Bildes");
    } finally {
      setUploadingImage(false);
    }
  };

  const inputClass = \`w-full px-4 py-2 border focus:outline-none focus:ring-2 focus:border-orange-500 focus:ring-orange-500/20 transition-all bg-white \${theme.cardBorder} \${theme.textBase} \${activeThemeKey === 'modern' ? 'rounded-none' : 'rounded-md'}\`;
  const labelClass = \`block text-sm font-medium mb-1 \${theme.textBase}\`;

  return (
    <div className={\`w-full max-w-4xl mx-auto p-6 md:p-8 border \${theme.cardBg} \${theme.cardBorder} \${theme.cardShadow} \${activeThemeKey === 'modern' ? 'rounded-none' : 'rounded-xl'}\`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-display font-bold">{formData.id ? 'Unternehmen bearbeiten' : 'Neues Unternehmen hinzufügen'}</h2>
        <button type="button" onClick={onCancel} className="p-2 bg-black/5 hover:bg-black/10 rounded-md transition-colors"><ArrowLeft className="w-5 h-5"/></button>
      </div>
        
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className={labelClass}>Unternehmensname *</label>
            <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className={inputClass} placeholder="z.B. Hotel Sauerland" />
          </div>
            
          <div>
            <label className={labelClass}>Kategorie *</label>
            <select 
              required 
              value={formData.subcategory || formData.category} 
              onChange={e => {
                const selectedVal = e.target.value;
                const group = categories.find(g => g.name === selectedVal || g.subcategories.includes(selectedVal));
                if (group) {
                  setFormData({
                    ...formData, 
                    category: group.name, 
                    subcategory: group.subcategories.includes(selectedVal) ? selectedVal : ''
                  });
                }
              }} 
              className={inputClass}
            >
              {categories.map(group => (
                <optgroup key={t(group.name)} label={t(group.name)}>
                  {group.subcategories.length === 0 ? (
                    <option value={t(group.name)}>{t(group.name)}</option>
                  ) : (
                    <>
                      <option value={t(group.name)}>{t(group.name)} (Allgemein)</option>
                      {group.subcategories.map(sub => (
                        <option key={sub} value={sub}>{sub}</option>
                      ))}
                    </>
                  )}
                </optgroup>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className={labelClass}>Kurzbeschreibung * (max. 90 Zeichen)</label>
          <textarea required maxLength={90} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className={inputClass} rows={2} placeholder="Kurze Beschreibung des Unternehmens..." />
          <div className="text-right text-xs opacity-70 mt-1">{formData.description.length}/90</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className={labelClass}>Adresse *</label>
            <input required type="text" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className={inputClass} placeholder="Straße, PLZ Ort" />
          </div>
          <div>
            <label className={labelClass}>Ortsteil</label>
            <select value={formData.district || ''} onChange={e => setFormData({...formData, district: e.target.value})} className={inputClass}>
              <option value="">(Kein Ortsteil)</option>
              <option value="Winterberg">Winterberg</option>
              <option value="Altastenberg">Altastenberg</option>
              <option value="Altenfeld">Altenfeld</option>
              <option value="Elkeringhausen">Elkeringhausen</option>
              <option value="Grönebach">Grönebach</option>
              <option value="Hildfeld">Hildfeld</option>
              <option value="Hoheleye">Hoheleye</option>
              <option value="Langewiese">Langewiese</option>
              <option value="Lenneplätze">Lenneplätze</option>
              <option value="Neuastenberg">Neuastenberg</option>
              <option value="Niedersfeld">Niedersfeld</option>
              <option value="Siedlinghausen">Siedlinghausen</option>
              <option value="Silbach">Silbach</option>
              <option value="Züschen">Züschen</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <label className={labelClass}>Telefon</label>
            <input type="text" value={formData.phone || ''} onChange={e => setFormData({...formData, phone: e.target.value})} className={inputClass} placeholder="02981..." />
          </div>
          <div>
            <label className={labelClass}>E-Mail</label>
            <input type="email" value={formData.email || ''} onChange={e => setFormData({...formData, email: e.target.value})} className={inputClass} placeholder="info@..." />
          </div>
          <div>
            <label className={labelClass}>Website</label>
            <input type="url" value={formData.website || ''} onChange={e => setFormData({...formData, website: e.target.value})} className={inputClass} placeholder="https://..." />
          </div>
        </div>

        <div className="border-t border-black/10 pt-5">
          <label className={labelClass}>Leistungen & Services</label>
          <div className="flex gap-2 mb-2">
            <input 
              type="text" 
              value={newService} 
              onChange={e => setNewService(e.target.value)} 
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  if (newService.trim()) {
                    setFormData(prev => ({ ...prev, services: [...(prev.services || []), newService.trim()] }));
                    setNewService('');
                  }
                }
              }}
              className={inputClass} 
              placeholder="Neue Leistung eingeben (z.B. Reparatur) und Enter drücken" 
            />
            <button 
              type="button" 
              onClick={() => {
                if (newService.trim()) {
                  setFormData(prev => ({ ...prev, services: [...(prev.services || []), newService.trim()] }));
                  setNewService('');
                }
              }}
              className={\`px-4 py-2 font-medium transition-colors \${theme.primaryBtn} \${activeThemeKey === 'modern' ? 'rounded-none' : 'rounded-md'}\`}
            >
              Hinzufügen
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {(formData.services || []).map((service, idx) => (
              <div key={idx} className="flex items-center gap-2 bg-black/5 px-3 py-1.5 rounded-full text-sm">
                <span>{service}</span>
                <button type="button" onClick={() => {
                  setFormData(prev => ({ ...prev, services: prev.services?.filter((_, i) => i !== idx) }));
                }} className="text-red-500 hover:text-red-700">
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-black/10 pt-5">
          <label className={labelClass}>Öffnungszeiten</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => (
              <div key={day} className="flex items-center gap-2">
                <span className="w-24 text-sm font-medium capitalize">{day === 'monday' ? 'Montag' : day === 'tuesday' ? 'Dienstag' : day === 'wednesday' ? 'Mittwoch' : day === 'thursday' ? 'Donnerstag' : day === 'friday' ? 'Freitag' : day === 'saturday' ? 'Samstag' : 'Sonntag'}</span>
                <input 
                  type="text" 
                  value={formData.openingHours?.[day as keyof typeof formData.openingHours] || ''} 
                  onChange={e => setFormData(prev => ({
                    ...prev,
                    openingHours: { ...(prev.openingHours || {}), [day]: e.target.value }
                  }))}
                  className={\`\${inputClass} py-1.5\`} 
                  placeholder="09:00 - 18:00 (oder Geschlossen)" 
                />
              </div>
            ))}
          </div>
        </div>

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

        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-black/10 mb-2">
          <input 
            type="checkbox" 
            id="isPremium" 
            checked={!!formData.isPremium} 
            onChange={e => setFormData({...formData, isPremium: e.target.checked})} 
            className="w-4 h-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500" 
          />
          <label htmlFor="isPremium" className={\`text-lg font-bold \${theme.textBase}\`}>Premium (Erweiterte Beschreibung, Galerie)</label>
        </div>

        {formData.isPremium && (
          <div className="p-5 bg-orange-50/50 border border-orange-200 rounded-lg space-y-6">
            
            <div>
              <label className={labelClass}>Titelbild (Hauptbild)</label>
              <div className="flex flex-col gap-4">
                {formData.imageLink && (
                  <div className="relative w-48 h-32 rounded-lg overflow-hidden border border-black/10">
                    <img src={formData.imageLink} alt="Titelbild" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => setFormData(prev => ({...prev, imageLink: ''}))} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full"><Trash2 className="w-3 h-3"/></button>
                  </div>
                )}
                {!formData.imageLink && (
                   <p className="text-sm opacity-70 italic">Wählen Sie unten ein Bild aus der Galerie als Titelbild aus, oder fügen Sie eine URL ein.</p>
                )}
                <input type="text" value={formData.imageLink || ''} onChange={e => setFormData({...formData, imageLink: e.target.value})} className={inputClass} placeholder="Bilder-URL..." />
              </div>
            </div>

            <div className="border-t border-orange-200/50 pt-5">
              <label className={labelClass}>Bildergalerie (Upload)</label>
              
              <div className="flex flex-wrap gap-4 mb-4">
                {(formData.gallery || []).map((imgUrl, idx) => (
                  <div key={idx} className="relative w-32 h-24 rounded-md overflow-hidden border border-black/10 group">
                    <img src={imgUrl} alt={\`Gallery \${idx}\`} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                      <button type="button" onClick={() => setFormData(prev => ({...prev, imageLink: imgUrl}))} className="text-xs bg-white text-black px-2 py-1 rounded shadow" title="Als Titelbild setzen">Titelbild</button>
                      <button type="button" onClick={() => setFormData(prev => ({...prev, gallery: prev.gallery?.filter((_, i) => i !== idx)}))} className="text-white bg-red-500 p-1 rounded-full" title="Löschen"><Trash2 className="w-3 h-3" /></button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-3">
                <label className={\`cursor-pointer flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors bg-white border border-black/20 hover:bg-black/5 \${activeThemeKey === 'modern' ? 'rounded-none' : 'rounded-md'}\`}>
                  <Upload className="w-4 h-4" />
                  {uploadingImage ? 'Lädt...' : 'Bild hochladen'}
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploadingImage} />
                </label>
              </div>
            </div>

            <div className="border-t border-orange-200/50 pt-5">
              <label className={labelClass}>Ausführliche Premium-Beschreibung</label>
              <div className="bg-white rounded-md border border-black/10">
                <ReactQuill 
                  theme="snow"
                  value={formData.extendedDescription || ''}
                  onChange={(val) => setFormData({...formData, extendedDescription: val})}
                  className="h-64"
                />
              </div>
              <div className="h-12"></div>
            </div>
            
          </div>
        )}

        <div className="pt-4 border-t border-black/10 flex flex-col sm:flex-row gap-3">
          <button 
            type="submit" 
            disabled={isSubmitting}
            className={\`px-6 py-2.5 font-bold transition-colors flex-1 \${theme.primaryBtn} \${activeThemeKey === 'modern' ? 'rounded-none' : 'rounded-md'} \${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}\`}
          >
            {isSubmitting ? 'Wird gespeichert...' : 'Speichern & Veröffentlichen'}
          </button>
          <button 
            type="button" 
            onClick={onCancel}
            className={\`px-6 py-2.5 font-medium transition-colors bg-black/5 hover:bg-black/10 \${theme.textBase} \${activeThemeKey === 'modern' ? 'rounded-none' : 'rounded-md'}\`}
          >
            Abbrechen
          </button>
        </div>
      </form>
    </div>
  );
}
