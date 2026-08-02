import React, { useState } from 'react';
import { ArrowLeft, Trash2, Image as ImageIcon, Upload, X } from 'lucide-react';
import { Business, CategoryGroup } from '../types';
import { categories } from '../data';
import { useTranslation } from '../i18n';
import { db, storage } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import ReactDOM from 'react-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

// Polyfill findDOMNode for React 19 compatibility with legacy ReactQuill
if (typeof window !== 'undefined' && !(ReactDOM as any).findDOMNode) {
  (ReactDOM as any).findDOMNode = (inst: any) => {
    if (!inst) return null;
    if (inst instanceof HTMLElement) return inst;
    if (inst.current instanceof HTMLElement) return inst.current;
    return null;
  };
}

function SafeRichTextEditor({ value, onChange }: { value: string, onChange: (val: string) => void }) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div className="flex flex-col gap-2">
        <textarea
          value={value}
          onChange={e => onChange(e.target.value)}
          className="w-full h-64 p-3 border border-black/20 rounded-md font-mono text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          placeholder="Erweiterte Beschreibung (HTML)..."
        />
        <span className="text-xs text-black/50">HTML-Editor aktiv.</span>
      </div>
    );
  }

  try {
    return (
      <ReactQuill 
        theme="snow"
        value={value || ''}
        onChange={onChange}
        className="h-64"
      />
    );
  } catch (err) {
    console.error("ReactQuill render error:", err);
    return (
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full h-64 p-3 border border-black/20 rounded-md font-mono text-sm focus:outline-none"
      />
    );
  }
}

export default function AdminPanel({ theme, activeThemeKey, businesses, setBusinesses, onBusinessAdded, onCancel, businessToEdit }: any) {

  const { t } = useTranslation();
  const [formData, setFormData] = useState<Business>(() => {
    const base = businessToEdit || {};
    return {
      id: base.id || '',
      name: base.name || '',
      category: base.category || (categories[0] ? categories[0].name : 'Handwerk'),
      subcategory: base.subcategory || '',
      description: base.description || '',
      address: base.address || '',
      district: base.district || '',
      phone: base.phone || '',
      email: base.email || '',
      website: base.website || '',
      uploadedImage: base.uploadedImage || '',
      imageLink: base.imageLink || '',
      services: Array.isArray(base.services) ? [...base.services] : [],
      openingHours: base.openingHours ? { ...base.openingHours } : { monday: '', tuesday: '', wednesday: '', thursday: '', friday: '', saturday: '', sunday: '' },
      gallery: Array.isArray(base.gallery) ? [...base.gallery] : [],
      isPremium: !!base.isPremium,
      extendedDescription: base.extendedDescription || '',
      ownerId: base.ownerId || '',
      status: base.status || 'approved'
    };
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
      // Force token refresh to clear any stalled gRPC auth channels
      if (auth.currentUser) {
        await auth.currentUser.getIdToken(true);
      }

      // 10 second timeout for setDoc to catch hanging issues (e.g. invalid auth tokens)
      const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('TIMEOUT')), 10000));
      await Promise.race([
        setDoc(doc(db, 'businesses', newId), dataToSubmit),
        timeoutPromise
      ]);
      
      if (formData.id) {
        setBusinesses((prev: Business[]) => prev.map((b: Business) => b.id === formData.id ? dataToSubmit : b));
      } else {
        setBusinesses((prev: Business[]) => [...prev, dataToSubmit]);
      }
      onBusinessAdded();
    } catch (error: any) {
      console.error("Save error:", error);
      if (error.message === 'TIMEOUT') {
        alert("Fehler: Zeitüberschreitung beim Speichern. Bitte logge dich einmal aus und wieder ein (Logout-Button), da dein Sicherheitsschlüssel veraltet sein könnte!");
      } else {
        alert("Fehler beim Speichern: " + (error.message || JSON.stringify(error)));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, target: 'gallery' | 'title' | 'logo' = 'gallery') => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setUploadingImage(true);
    
    try {
      let url = '';
      try {
        const storageRef = ref(storage, `businesses/${Date.now()}_${file.name}`);
        await uploadBytes(storageRef, file);
        url = await getDownloadURL(storageRef);
      } catch (storageErr) {
        console.warn("Storage upload failed, using Data URL fallback", storageErr);
        url = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      }
      
      setFormData(prev => {
        if (target === 'logo') {
          return { ...prev, logoUrl: url };
        }
        
        const newGallery = prev.gallery ? [...prev.gallery] : [];
        if (!newGallery.includes(url)) {
          newGallery.push(url);
        }
        
        const currentCover = prev.imageLink || prev.uploadedImage;
        const isTitle = target === 'title';
        return {
          ...prev,
          gallery: newGallery,
          uploadedImage: isTitle ? url : (currentCover || url),
          imageLink: isTitle ? url : (currentCover || url)
        };
      });
    } catch (err) {
      console.error("Upload error", err);
      alert("Fehler beim Verarbeiten des Bildes");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleDeleteImage = async (imgUrl: string) => {
    // Remove from UI first
    setFormData(prev => {
      const newGallery = (prev.gallery || []).filter(url => url !== imgUrl);
      const isCover = imgUrl === prev.imageLink || imgUrl === prev.uploadedImage;
      return {
        ...prev,
        gallery: newGallery,
        imageLink: isCover ? '' : prev.imageLink,
        uploadedImage: isCover ? '' : prev.uploadedImage
      };
    });
    
    // Optionally delete from Firebase Storage if it's a firebase storage URL
    if (imgUrl.includes('firebasestorage')) {
      try {
        const imageRef = ref(storage, imgUrl);
        await deleteObject(imageRef);
      } catch (e) {
        console.warn("Could not delete from storage", e);
      }
    }
  };

  const addServicesFromInput = (input: string) => {
    if (!input.trim()) return;
    const items = input.split(',').map(s => s.trim()).filter(Boolean);
    if (items.length > 0) {
      setFormData(prev => {
        const existing = prev.services || [];
        const updated = [...existing];
        items.forEach(item => {
          if (!updated.includes(item)) {
            updated.push(item);
          }
        });
        return { ...prev, services: updated };
      });
      setNewService('');
    }
  };

  const inputClass = `w-full px-4 py-2 border focus:outline-none focus:ring-2 focus:border-orange-500 focus:ring-orange-500/20 transition-all bg-white ${theme.cardBorder} ${theme.textBase} ${activeThemeKey === 'modern' ? 'rounded-none' : 'rounded-md'}`;
  const labelClass = `block text-sm font-medium mb-1 ${theme.textBase}`;

  return (
    <div className={`w-full max-w-4xl mx-auto p-6 md:p-8 border ${theme.cardBg} ${theme.cardBorder} ${theme.cardShadow} ${activeThemeKey === 'modern' ? 'rounded-none' : 'rounded-xl'}`}>
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
          <label className={labelClass}>Kurzbeschreibung * (max. 90 Zeichen für Suchergebnisse & Vorschau)</label>
          <textarea required maxLength={90} value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} className={inputClass} rows={2} placeholder="Kurze Zusammenfassung für die Suchliste..." />
          <div className="text-right text-xs opacity-70 mt-1">{(formData.description || '').length}/90 Zeichen</div>
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
          <label htmlFor="isPremium" className={`text-lg font-bold ${theme.textBase}`}>Premium-Funktionen (Öffnungszeiten, Leistungen, Beschreibung, Galerie, Stellenanzeigen)</label>
        </div>

        {formData.isPremium && (
          <div className="p-5 bg-orange-50/50 border border-orange-200 rounded-lg space-y-6">
          
            <div className="border-b border-orange-200/50 pb-5">
              <label className={labelClass}>Unternehmens-Logo (URL) (Premium-Feature)</label>
              <div className="flex gap-2 mb-1">
                <input 
                  type="text" 
                  value={formData.logoUrl || ''} 
                  onChange={e => setFormData({...formData, logoUrl: e.target.value})} 
                  className={inputClass} 
                  placeholder="https://beispiel.de/logo.png" 
                />
                <label className={`px-4 py-2 font-medium transition-colors ${theme.primaryBtn} cursor-pointer flex items-center justify-center shrink-0 ${activeThemeKey === 'modern' ? 'rounded-none' : 'rounded-md'} ${uploadingImage ? 'opacity-50' : ''}`}>
                  {uploadingImage ? 'Lädt...' : 'Hochladen'}
                  <input type="file" accept="image/*" className="hidden" onChange={e => handleImageUpload(e, 'logo')} disabled={uploadingImage} />
                </label>
              </div>
              <p className="text-xs opacity-70 mt-1">Das Logo wird in den Suchergebnissen auf der Karte angezeigt. **Voraussetzung:** Das Logo muss quadratisch sein (idealerweise 400x400 Pixel), damit es optimal und scharf dargestellt wird.</p>
              {formData.logoUrl && (
                <div className="mt-3 relative w-16 h-16 border rounded bg-white p-1">
                  <img src={formData.logoUrl} alt="Logo Preview" className="w-full h-full object-contain" />
                  <button type="button" onClick={() => setFormData({...formData, logoUrl: ''})} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 shadow hover:bg-red-600"><X className="w-3 h-3" /></button>
                </div>
              )}
            </div>

            <div className="border-b border-orange-200/50 pb-5">
              <label className={labelClass}>Leistungen & Services (Premium-Feature)</label>
              <div className="flex gap-2 mb-1">
                <input 
                  type="text" 
                  value={newService} 
                  onChange={e => {
                    const val = e.target.value;
                    if (val.includes(',')) {
                      addServicesFromInput(val);
                    } else {
                      setNewService(val);
                    }
                  }} 
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addServicesFromInput(newService);
                    }
                  }}
                  className={inputClass} 
                  placeholder="Leistung eingeben (oder mehrere mit Komma trennen) und Enter drücken" 
                />
                <button 
                  type="button" 
                  onClick={() => addServicesFromInput(newService)}
                  className={`px-4 py-2 font-medium transition-colors ${theme.primaryBtn} ${activeThemeKey === 'modern' ? 'rounded-none' : 'rounded-md'}`}
                >
                  Hinzufügen
                </button>
              </div>
              <p className="text-xs opacity-70 mb-3">Tipp: Mehrere Leistungen können mit Komma getrennt eingegeben werden (z. B. "Dacheindeckung, Sanierung, Reparatur").</p>
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
            
            <div className="border-b border-orange-200/50 pb-5">
              <label className={labelClass}>Öffnungszeiten (Premium-Feature)</label>
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
                      className={`${inputClass} py-1.5`} 
                      placeholder="09:00 - 18:00 (oder Geschlossen)" 
                    />
                  </div>
                ))}
              </div>
            </div>

            
            <div>
              <label className={labelClass}>Titelbild (Hauptbild)</label>
              <div className="flex flex-col gap-4">
                {(formData.uploadedImage || formData.imageLink) ? (
                  <div className="relative w-48 h-32 rounded-lg overflow-hidden border border-black/10 shadow-sm">
                    <img src={formData.uploadedImage || formData.imageLink} alt="Titelbild" className="w-full h-full object-cover" />
                    <button 
                      type="button" 
                      onClick={() => setFormData(prev => ({...prev, imageLink: '', uploadedImage: ''}))} 
                      className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full shadow hover:bg-red-600 transition-colors"
                      title="Titelbild entfernen"
                    >
                      <Trash2 className="w-3 h-3"/>
                    </button>
                  </div>
                ) : (
                   <p className="text-sm opacity-70 italic">Wählen Sie unten ein Bild aus der Galerie als Titelbild aus, laden Sie eines hoch oder geben Sie eine URL ein.</p>
                )}
                
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={formData.imageLink || formData.uploadedImage || ''} 
                    onChange={e => setFormData({...formData, imageLink: e.target.value, uploadedImage: e.target.value})} 
                    className={inputClass} 
                    placeholder="Titelbild-URL eingeben..." 
                  />
                  <label className={`cursor-pointer flex items-center gap-2 px-4 py-2 text-sm font-medium shrink-0 transition-colors bg-white border border-black/20 hover:bg-black/5 ${activeThemeKey === 'modern' ? 'rounded-none' : 'rounded-md'}`}>
                    <Upload className="w-4 h-4" />
                    {uploadingImage ? 'Lädt...' : 'Direkt hochladen'}
                    <input type="file" accept="image/*" className="hidden" onChange={e => handleImageUpload(e, 'title')} disabled={uploadingImage} />
                  </label>
                </div>
              </div>
            </div>

            <div className="border-t border-orange-200/50 pt-5">
              <label className={labelClass}>Bildergalerie & Auswahl</label>
              
              <div className="flex flex-wrap gap-4 mb-4">
                {(formData.gallery || []).map((imgUrl, idx) => {
                  const isCover = imgUrl === formData.imageLink || imgUrl === formData.uploadedImage;
                  return (
                    <div key={idx} className={`relative w-36 h-28 rounded-md overflow-hidden border transition-all ${isCover ? 'border-2 border-orange-500 shadow-md scale-105' : 'border-black/10'}`}>
                      <img src={imgUrl} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                      {isCover && (
                        <div className="absolute top-1 left-1 bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
                          Titelbild
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5 p-1">
                        {!isCover && (
                          <button 
                            type="button" 
                            onClick={() => setFormData(prev => ({...prev, imageLink: imgUrl, uploadedImage: imgUrl}))} 
                            className="text-xs bg-white text-black font-bold px-2 py-1 rounded shadow hover:bg-orange-50"
                          >
                            Als Titelbild
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleDeleteImage(imgUrl)}
                          className="absolute top-1 right-1 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow"
                          title="Bild löschen"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        <button 
                          type="button" 
                          onClick={() => setFormData(prev => {
                            const newGallery = prev.gallery?.filter((_, i) => i !== idx) || [];
                            const isTitle = isCover;
                            return {
                              ...prev,
                              gallery: newGallery,
                              imageLink: isTitle ? (newGallery[0] || '') : prev.imageLink,
                              uploadedImage: isTitle ? (newGallery[0] || '') : prev.uploadedImage
                            };
                          })} 
                          className="text-xs text-white bg-red-500 px-2 py-1 rounded shadow hover:bg-red-600 flex items-center gap-1"
                        >
                          <Trash2 className="w-3 h-3" /> Löschen
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center gap-3">
                <label className={`cursor-pointer flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors bg-white border border-black/20 hover:bg-black/5 ${activeThemeKey === 'modern' ? 'rounded-none' : 'rounded-md'}`}>
                  <Upload className="w-4 h-4" />
                  {uploadingImage ? 'Lädt...' : 'Galerie-Bild hochladen'}
                  <input type="file" accept="image/*" className="hidden" onChange={e => handleImageUpload(e, 'gallery')} disabled={uploadingImage} />
                </label>
              </div>
            </div>

            <div className="border-t border-orange-200/50 pt-5">
              <label className={labelClass}>Ausführliche Premium-Beschreibung ("Über uns")</label>
              <p className="text-xs opacity-70 mb-2">Hier können Sie umfangreiche Texte, Formatierungen und Bilder über den WYSIWYG-Editor gestalten.</p>
              <div className="bg-white rounded-md border border-black/10">
                <SafeRichTextEditor 
                  value={formData.extendedDescription || ''}
                  onChange={(val) => setFormData({...formData, extendedDescription: val})}
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
            className={`px-6 py-2.5 font-bold transition-colors flex-1 ${theme.primaryBtn} ${activeThemeKey === 'modern' ? 'rounded-none' : 'rounded-md'} ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isSubmitting ? 'Wird gespeichert...' : 'Speichern & Veröffentlichen'}
          </button>
          <button 
            type="button" 
            onClick={onCancel}
            className={`px-6 py-2.5 font-medium transition-colors bg-black/5 hover:bg-black/10 ${theme.textBase} ${activeThemeKey === 'modern' ? 'rounded-none' : 'rounded-md'}`}
          >
            Abbrechen
          </button>

        </div>
      </form>
    </div>
  );
}
