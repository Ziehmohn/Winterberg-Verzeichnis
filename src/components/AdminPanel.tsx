import React, { useState } from 'react';
import { ArrowLeft, Trash2, Image as ImageIcon, Upload, X, Sparkles, Globe, Plus, Newspaper, ExternalLink, FileText, Check } from 'lucide-react';
import { Business, CategoryGroup, BusinessNewsArticle } from '../types';
import { categories } from '../data';
import { useTranslation } from '../i18n';
import { translateTextToDutch, translateServiceToDutch } from '../utils/translator';
import { db, storage, auth } from '../firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
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

function NewBusinessArticleForm({ onAdd }: { onAdd: (article: BusinessNewsArticle) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [externalLink, setExternalLink] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setUploadingImage(true);
    try {
      let url = '';
      try {
        const storageRef = ref(storage, `businessNews/${Date.now()}_${file.name}`);
        await uploadBytes(storageRef, file);
        url = await getDownloadURL(storageRef);
      } catch {
        url = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
      }
      setImageUrl(url);
    } catch (err) {
      console.error(err);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newArticle: BusinessNewsArticle = {
      id: `bnews_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      title: title.trim(),
      excerpt: excerpt.trim() || (content.trim().substring(0, 160) + (content.length > 160 ? '...' : '')),
      content: content.trim(),
      publishedAt: new Date().toISOString(),
      externalLink: externalLink.trim() || undefined,
      imageUrl: imageUrl.trim() || undefined,
      status: 'published'
    };

    onAdd(newArticle);
    setTitle('');
    setExcerpt('');
    setContent('');
    setExternalLink('');
    setImageUrl('');
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="w-full py-3 px-4 bg-white border-2 border-dashed border-orange-300 hover:border-orange-500 rounded-lg text-orange-600 font-semibold text-sm flex items-center justify-center gap-2 hover:bg-orange-50/50 transition-all cursor-pointer"
      >
        <Plus className="w-4 h-4" />
        Neuen News-Beitrag verfassen (+1 Beitrag)
      </button>
    );
  }

  return (
    <div className="bg-white border border-orange-200 rounded-lg p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-orange-100">
        <h4 className="font-bold text-sm text-[#1B211D] flex items-center gap-2">
          <Newspaper className="w-4 h-4 text-[#F2761B]" />
          Neuen News-Beitrag verfassen
        </h4>
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="text-xs text-gray-400 hover:text-gray-700 cursor-pointer"
        >
          ✕ Schließen
        </button>
      </div>

      <div>
        <label className="block text-xs font-bold text-[#1B211D] mb-1">Titel des Beitrags *</label>
        <input
          type="text"
          required
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="z. B. Neueröffnung unserer Sonnenterrasse im Frühjahr"
          className="w-full border border-[#E7E2DA] rounded-md px-3 py-2 text-sm bg-[#FAF8F5] focus:outline-none focus:border-[#0F4C2E]"
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-[#1B211D] mb-1">
          Kurzfassung / Teaser (wird auf Kacheln & Übersichten angezeigt)
        </label>
        <textarea
          rows={2}
          maxLength={300}
          value={excerpt}
          onChange={e => setExcerpt(e.target.value)}
          placeholder="Kurze Zusammenfassung in 1-2 Sätzen (max. 300 Zeichen)..."
          className="w-full border border-[#E7E2DA] rounded-md px-3 py-2 text-sm bg-[#FAF8F5] focus:outline-none focus:border-[#0F4C2E]"
        />
        <div className="text-[11px] text-right text-[#8A928B]">{excerpt.length}/300</div>
      </div>

      <div>
        <label className="block text-xs font-bold text-[#1B211D] mb-1">Volltext / Ausführlicher Bericht</label>
        <textarea
          rows={4}
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="Beschreiben Sie Ihr Angebot, Ihre Neuigkeit oder Ihr Event ausführlich..."
          className="w-full border border-[#E7E2DA] rounded-md px-3 py-2 text-sm bg-[#FAF8F5] focus:outline-none focus:border-[#0F4C2E]"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-bold text-[#1B211D] mb-1">Titelbild (Optional)</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={imageUrl}
              onChange={e => setImageUrl(e.target.value)}
              placeholder="https://... oder hochladen"
              className="flex-1 border border-[#E7E2DA] rounded-md px-3 py-2 text-xs bg-[#FAF8F5] focus:outline-none focus:border-[#0F4C2E]"
            />
            <label className="px-3 py-2 text-xs font-semibold bg-[#FAF8F5] border border-[#E7E2DA] hover:bg-gray-100 rounded-md cursor-pointer shrink-0 flex items-center gap-1">
              <Upload className="w-3.5 h-3.5" />
              {uploadingImage ? '...' : 'Upload'}
              <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploadingImage} />
            </label>
          </div>
          {imageUrl && (
            <div className="mt-2 relative w-20 h-14 rounded border overflow-hidden">
              <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
              <button type="button" onClick={() => setImageUrl('')} className="absolute top-0.5 right-0.5 bg-red-500 text-white rounded-full p-0.5"><X className="w-2.5 h-2.5" /></button>
            </div>
          )}
        </div>

        <div>
          <label className="block text-xs font-bold text-[#1B211D] mb-1">Externer Link / Backlink (Optional)</label>
          <input
            type="url"
            value={externalLink}
            onChange={e => setExternalLink(e.target.value)}
            placeholder="https://ihre-website.de/angebot"
            className="w-full border border-[#E7E2DA] rounded-md px-3 py-2 text-xs bg-[#FAF8F5] focus:outline-none focus:border-[#0F4C2E]"
          />
          <span className="text-[11px] text-[#8A928B] mt-0.5 block">Wird als Backlink auf Ihrer Unternehmensseite & im News-Board gesetzt.</span>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-2 border-t border-orange-100">
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded-md cursor-pointer"
        >
          Abbrechen
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!title.trim()}
          className="px-4 py-1.5 text-xs font-bold text-white bg-[#F2761B] hover:bg-[#D65F0C] rounded-md shadow-sm disabled:opacity-50 transition-colors cursor-pointer"
        >
          Beitrag speichern & veröffentlichen
        </button>
      </div>
    </div>
  );
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
      products: Array.isArray(base.products) ? [...base.products] : [],
      openingHours: base.openingHours ? { ...base.openingHours } : { monday: '', tuesday: '', wednesday: '', thursday: '', friday: '', saturday: '', sunday: '' },
      gallery: Array.isArray(base.gallery) ? [...base.gallery] : [],
      isPremium: !!base.isPremium,
      businessNews: Array.isArray(base.businessNews) ? [...base.businessNews] : [],
      extendedDescription: base.extendedDescription || '',
      ownerId: base.ownerId || '',
      status: base.status || 'approved',
      translations: base.translations || {},
      description_nl: base.translations?.nl?.description || base.description_nl || '',
      extendedDescription_nl: base.translations?.nl?.extendedDescription || base.extendedDescription_nl || '',
      services_nl: Array.isArray(base.translations?.nl?.services) ? [...base.translations.nl.services] : (Array.isArray(base.services_nl) ? [...base.services_nl] : []),
      products_nl: Array.isArray(base.translations?.nl?.products) ? [...base.translations.nl.products] : (Array.isArray(base.products_nl) ? [...base.products_nl] : [])
    };
  });
  
  const [activeLangTab, setActiveLangTab] = useState<'de' | 'nl'>('de');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newService, setNewService] = useState('');
  const [newServiceNl, setNewServiceNl] = useState('');
  const [newProduct, setNewProduct] = useState('');
  const [newProductNl, setNewProductNl] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);


  const handleAutoTranslateToDutch = () => {
    const autoDesc = translateTextToDutch(formData.description || '');
    const autoExt = formData.extendedDescription ? translateTextToDutch(formData.extendedDescription) : '';
    const autoServices = (formData.services || []).map(s => translateServiceToDutch(s));
    const autoProducts = (formData.products || []).map(p => translateServiceToDutch(p));

    setFormData(prev => ({
      ...prev,
      description_nl: autoDesc,
      extendedDescription_nl: autoExt,
      services_nl: autoServices,
      products_nl: autoProducts,
      translations: {
        ...prev.translations,
        nl: {
          description: autoDesc,
          extendedDescription: autoExt,
          services: autoServices,
          products: autoProducts
        }
      }
    }));
    setActiveLangTab('nl');
  };

  const addServicesNlFromInput = (input: string) => {
    if (!input.trim()) return;
    const items = input.split(',').map(s => s.trim()).filter(Boolean);
    if (items.length > 0) {
      setFormData(prev => {
        const existing = prev.services_nl || [];
        const updated = [...existing];
        items.forEach(item => {
          if (!updated.includes(item)) {
            updated.push(item);
          }
        });
        return { 
          ...prev, 
          services_nl: updated,
          translations: {
            ...prev.translations,
            nl: {
              ...(prev.translations?.nl || {}),
              services: updated
            }
          }
        };
      });
      setNewServiceNl('');
    }
  };

  const addProductsNlFromInput = (input: string) => {
    if (!input.trim()) return;
    const items = input.split(',').map(s => s.trim()).filter(Boolean);
    if (items.length > 0) {
      setFormData(prev => {
        const existing = prev.products_nl || [];
        const updated = [...existing];
        items.forEach(item => {
          if (!updated.includes(item)) {
            updated.push(item);
          }
        });
        return { 
          ...prev, 
          products_nl: updated,
          translations: {
            ...prev.translations,
            nl: {
              ...(prev.translations?.nl || {}),
              products: updated
            }
          }
        };
      });
      setNewProductNl('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const newId = formData.id || 'b_' + Date.now().toString(36);
    const dataToSubmit: Business = {
      ...formData,
      translations: {
        ...formData.translations,
        nl: {
          description: formData.description_nl || '',
          extendedDescription: formData.extendedDescription_nl || '',
          services: formData.services_nl || [],
          products: formData.products_nl || []
        }
      },
      description_nl: formData.description_nl || '',
      extendedDescription_nl: formData.extendedDescription_nl || '',
      services_nl: formData.services_nl || [],
      products: formData.products || [],
      products_nl: formData.products_nl || [],
      businessNews: formData.businessNews || [],
      status: formData.status || 'approved',
      id: newId
    };
    
    try {
      // 10 second timeout for setDoc to catch hanging issues
      const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('TIMEOUT')), 10000));
      await Promise.race([
        setDoc(doc(db, 'businesses', newId), dataToSubmit, { merge: true }),
        timeoutPromise
      ]);

      // Sync published businessNews to 'news' collection for review if not yet submitted
      if (Array.isArray(formData.businessNews) && formData.businessNews.length > 0) {
        for (const art of formData.businessNews) {
          if (art.status === 'published') {
            try {
              const newsDocRef = doc(db, 'news', art.id);
              const newsSnap = await getDoc(newsDocRef);
              if (!newsSnap.exists()) {
                await setDoc(newsDocRef, {
                  title: art.title,
                  content: art.content || art.excerpt,
                  author: formData.name,
                  businessId: newId,
                  businessName: formData.name,
                  imageUrl: art.imageUrl || '',
                  externalLink: art.externalLink || '',
                  date: art.publishedAt || new Date().toISOString(),
                  isBusinessNews: true,
                  status: 'pending' // Admin must approve before showing on NewsBoard
                });
              }
            } catch (syncErr) {
              console.warn("Could not sync business news to news collection:", syncErr);
            }
          }
        }
      }
      
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
          reader.onload = (e) => {
            const img = new window.Image();
            img.onload = () => {
              const canvas = document.createElement('canvas');
              let { width, height } = img;
              const max = 800;
              if (width > height) {
                if (width > max) { height *= max / width; width = max; }
              } else {
                if (height > max) { width *= max / height; height = max; }
              }
              canvas.width = width;
              canvas.height = height;
              const ctx = canvas.getContext('2d');
              if (ctx) {
                ctx.drawImage(img, 0, 0, width, height);
                resolve(canvas.toDataURL('image/jpeg', 0.7));
              } else {
                resolve(e.target?.result as string);
              }
            };
            img.onerror = reject;
            img.src = e.target?.result as string;
          };
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

  const addProductsFromInput = (input: string) => {
    if (!input.trim()) return;
    const items = input.split(',').map(s => s.trim()).filter(Boolean);
    if (items.length > 0) {
      setFormData(prev => {
        const existing = prev.products || [];
        const updated = [...existing];
        items.forEach(item => {
          if (!updated.includes(item)) {
            updated.push(item);
          }
        });
        return { ...prev, products: updated };
      });
      setNewProduct('');
    }
  };

  const inputClass = `w-full border border-[#E7E2DA] rounded-md px-3 py-2.5 text-[15px] font-normal bg-[#FAF8F5] focus:outline-none focus:border-[#0F4C2E]`;
  const labelClass = `block text-[13.5px] font-semibold mb-[6px]`;

  return (
    <div className="bg-white border border-[#EDE8E0] rounded-lg p-6 md:p-8 shadow-[0_10px_30px_rgba(27,33,29,0.06)] w-full max-w-[1180px] mx-auto">
      <div className="flex justify-between items-center mb-[22px]">
        <h2 className="font-display text-[24px] font-bold m-0">{formData.id ? 'Unternehmen bearbeiten' : 'Neues Unternehmen hinzufügen'}</h2>
        <button type="button" onClick={onCancel} className="bg-[#F3F0EA] border-none rounded-md px-3.5 py-2 text-[14px] cursor-pointer hover:bg-[#EAE5DB]">Abbrechen</button>
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
          
          <div className="md:col-span-2 mt-2">
            <div className="flex items-center justify-between mb-2">
              <span className={labelClass}>Weitere Kategorien (Optional)</span>
              <button 
                type="button" 
                onClick={() => setFormData({ ...formData, additionalCategories: [...(formData.additionalCategories || []), { category: '', subcategory: '' }]})}
                className="text-xs text-[#F2761B] hover:underline font-semibold"
              >
                + Weitere Kategorie hinzufügen
              </button>
            </div>
            
            {formData.additionalCategories?.map((ac, index) => (
              <div key={index} className="flex flex-col md:flex-row gap-5 mb-3 p-3 bg-[#FAF8F5] border border-[#E7E2DA] rounded-md relative">
                <button type="button" onClick={() => {
                  const newCats = [...(formData.additionalCategories || [])];
                  newCats.splice(index, 1);
                  setFormData({...formData, additionalCategories: newCats});
                }} className="absolute top-2 right-2 text-gray-400 hover:text-red-500">
                  &times;
                </button>
                <div className="flex-1">
                  <select 
                    value={ac.subcategory || ac.category} 
                    onChange={e => {
                      const selectedVal = e.target.value;
                      const group = categories.find(g => g.name === selectedVal || g.subcategories.includes(selectedVal));
                      if (group) {
                        const newCats = [...(formData.additionalCategories || [])];
                        newCats[index] = {
                          category: group.name,
                          subcategory: group.subcategories.includes(selectedVal) ? selectedVal : ''
                        };
                        setFormData({...formData, additionalCategories: newCats});
                      }
                    }} 
                    className={inputClass}
                  >
                    <option value="">Kategorie wählen...</option>
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
            ))}
          </div>
        </div>

        {/* Mehrsprachigkeit & Übersetzung */}
        <div className="bg-[#FAF8F5] border border-[#E7E2DA] rounded-lg p-3.5">
          <div className="flex items-center justify-between flex-wrap gap-3 mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#5F6B63] uppercase tracking-wider">Sprache für Texte:</span>
              <div className="flex items-center bg-white p-1 rounded-md border border-[#E7E2DA] gap-1">
                <button
                  type="button"
                  onClick={() => setActiveLangTab('de')}
                  className={`px-3 py-1 rounded text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeLangTab === 'de'
                      ? 'bg-[#0F4C2E] text-white shadow-2xs'
                      : 'text-[#5F6B63] hover:text-[#1B211D]'
                  }`}
                >
                  <span>🇩🇪</span>
                  <span>Deutsch (Standard)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveLangTab('nl')}
                  className={`px-3 py-1 rounded text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeLangTab === 'nl'
                      ? 'bg-[#0F4C2E] text-white shadow-2xs'
                      : 'text-[#5F6B63] hover:text-[#1B211D]'
                  }`}
                >
                  <span>🇳🇱</span>
                  <span>Niederländisch (NL)</span>
                  {(formData.description_nl || (formData.services_nl && formData.services_nl.length > 0)) ? (
                    <span className="w-2 h-2 rounded-full bg-[#F2761B]" title="Angepasste Übersetzung vorhanden"></span>
                  ) : null}
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={handleAutoTranslateToDutch}
              className="bg-orange-50 hover:bg-orange-100 text-[#D65F0C] border border-orange-200 rounded-md px-3 py-1.5 text-xs font-bold cursor-pointer transition-colors flex items-center gap-1.5 shadow-2xs"
              title="Generiert automatisch eine niederländische Übersetzung aus den deutschen Texten"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#F2761B]" />
              <span>⚡ Automatisch ins Niederländische übersetzen</span>
            </button>
          </div>

          {activeLangTab === 'nl' && (
            <div className="bg-emerald-50 border border-emerald-200 rounded p-2.5 text-xs text-emerald-800 mb-3 flex items-start gap-2">
              <Globe className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
              <div>
                <strong>Automatische Übersetzung aktiv:</strong> Wenn Sie die niederländischen Felder leer lassen, übersetzt das System die Unternehmensseite für niederländische Besucher (/nl/...) automatisch in Echtzeit. Sie können hier aber beliebige Texte manuell anpassen oder überschreiben.
              </div>
            </div>
          )}

          {activeLangTab === 'de' ? (
            <div>
              <label className={labelClass}>Kurzbeschreibung (Deutsch) * (max. 90 Zeichen für Suchergebnisse & Vorschau)</label>
              <textarea required maxLength={90} value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} className={inputClass} rows={2} placeholder="Kurze Zusammenfassung für die Suchliste..." />
              <div className="text-right text-xs opacity-70 mt-1">{(formData.description || '').length}/90 Zeichen</div>
            </div>
          ) : (
            <div>
              <label className={labelClass}>Kurzbeschreibung (Niederländisch) (max. 90 Zeichen für /nl/...)</label>
              <textarea maxLength={90} value={formData.description_nl || ''} onChange={e => setFormData({...formData, description_nl: e.target.value})} className={inputClass} rows={2} placeholder="Korte samenvatting voor Nederlandse bezoekers (optional)..." />
              <div className="text-right text-xs opacity-70 mt-1">{(formData.description_nl || '').length}/90 Zeichen</div>
            </div>
          )}
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

        {/* Leistungen & Produkte (Für alle Einträge: Bis zu 3 im Basiseintrag / bis zu 15 mit Premium) */}
        <div className="p-5 bg-white border border-gray-200 rounded-lg space-y-6 mt-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div>
              <h3 className={`text-base font-bold ${theme.textBase}`}>Leistungen & Produkte</h3>
              <p className="text-xs text-[#5F6B63] mt-0.5">Für die Volltextsuche und das Profil (Basiseintrag: bis zu 3 aktiv | Premium: bis zu 15 aktiv)</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded bg-[#FAF8F5] border border-[#EDE8E0] text-[#0F4C2E]">
              {formData.isPremium ? '🌟 Premium (bis zu 15)' : '🟢 Basiseintrag (bis zu 3)'}
            </span>
          </div>

          <div className="border-b border-gray-100 pb-5">
            <div className="flex items-center justify-between mb-1">
              <label className={labelClass}>
                {activeLangTab === 'de' ? 'Leistungen & Services (Deutsch)' : 'Leistungen & Services (Niederländisch)'}
              </label>
              <span className="text-xs text-[#5F6B63]">
                {activeLangTab === 'de' ? '🇩🇪 Deutsch aktiv' : '🇳🇱 Niederländisch aktiv'}
              </span>
            </div>

            {activeLangTab === 'de' ? (
              <>
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
                    <div key={idx} className="flex items-center gap-2 bg-black/5 px-2.5 py-1 rounded-md text-sm">
                      <span>{service}</span>
                      <button type="button" onClick={() => {
                        setFormData(prev => ({ ...prev, services: prev.services?.filter((_, i) => i !== idx) }));
                      }} className="text-red-500 hover:text-red-700">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <>
                <div className="flex gap-2 mb-1">
                  <input 
                    type="text" 
                    value={newServiceNl} 
                    onChange={e => {
                      const val = e.target.value;
                      if (val.includes(',')) {
                        addServicesNlFromInput(val);
                      } else {
                        setNewServiceNl(val);
                      }
                    }} 
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addServicesNlFromInput(newServiceNl);
                      }
                    }} 
                    className={inputClass} 
                    placeholder="Nederlandse dienst/product invoeren en op Enter drukken (optioneel)" 
                  />
                  <button 
                    type="button" 
                    onClick={() => addServicesNlFromInput(newServiceNl)}
                    className={`px-4 py-2 font-medium transition-colors ${theme.primaryBtn} ${activeThemeKey === 'modern' ? 'rounded-none' : 'rounded-md'}`}
                  >
                    Hinzufügen
                  </button>
                </div>
                <p className="text-xs opacity-70 mb-3">Optional: Falls leer, werden die deutschen Leistungen automatisch in Echtzeit ins Niederländische übersetzt.</p>
                <div className="flex flex-wrap gap-2">
                  {(formData.services_nl || []).map((service, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-orange-100/70 border border-orange-200 px-2.5 py-1 rounded-md text-sm">
                      <span>{service}</span>
                      <button type="button" onClick={() => {
                        setFormData(prev => ({ ...prev, services_nl: prev.services_nl?.filter((_, i) => i !== idx) }));
                      }} className="text-red-500 hover:text-red-700">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className={labelClass}>
                {activeLangTab === 'de' ? 'Produkte & Angebote (Deutsch)' : 'Produkte & Angebote (Niederländisch)'}
              </label>
              <span className="text-xs text-[#5F6B63]">
                {activeLangTab === 'de' ? '🇩🇪 Deutsch aktiv' : '🇳🇱 Niederländisch aktiv'}
              </span>
            </div>

            {activeLangTab === 'de' ? (
              <>
                <div className="flex gap-2 mb-1">
                  <input 
                    type="text" 
                    value={newProduct} 
                    onChange={e => {
                      const val = e.target.value;
                      if (val.includes(',')) {
                        addProductsFromInput(val);
                      } else {
                        setNewProduct(val);
                      }
                    }} 
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addProductsFromInput(newProduct);
                      }
                    }} 
                    className={inputClass} 
                    placeholder="Produkt/Angebot eingeben und Enter drücken" 
                  />
                  <button 
                    type="button" 
                    onClick={() => addProductsFromInput(newProduct)}
                    className={`px-4 py-2 font-medium transition-colors ${theme.primaryBtn} ${activeThemeKey === 'modern' ? 'rounded-none' : 'rounded-md'}`}
                  >
                    Hinzufügen
                  </button>
                </div>
                <p className="text-xs opacity-70 mb-3">Tipp: Hier können Sie konkrete Waren, Tarife oder Produkte auflisten (z. B. "Wohngebäudeversicherung, Kfz-Versicherung, Skier, E-Bikes"). Kommagetrennt möglich.</p>
                <div className="flex flex-wrap gap-2">
                  {(formData.products || []).map((product, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-[#FFF1E4] border border-[#F2761B]/30 px-2.5 py-1 rounded-md text-sm text-[#D65F0C] font-medium">
                      <span>{product}</span>
                      <button type="button" onClick={() => {
                        setFormData(prev => ({ ...prev, products: prev.products?.filter((_, i) => i !== idx) }));
                      }} className="text-red-500 hover:text-red-700">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <>
                <div className="flex gap-2 mb-1">
                  <input 
                    type="text" 
                    value={newProductNl} 
                    onChange={e => {
                      const val = e.target.value;
                      if (val.includes(',')) {
                        addProductsNlFromInput(val);
                      } else {
                        setNewProductNl(val);
                      }
                    }} 
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addProductsNlFromInput(newProductNl);
                      }
                    }} 
                    className={inputClass} 
                    placeholder="Nederlands product invoeren en op Enter drukken (optioneel)" 
                  />
                  <button 
                    type="button" 
                    onClick={() => addProductsNlFromInput(newProductNl)}
                    className={`px-4 py-2 font-medium transition-colors ${theme.primaryBtn} ${activeThemeKey === 'modern' ? 'rounded-none' : 'rounded-md'}`}
                  >
                    Hinzufügen
                  </button>
                </div>
                <p className="text-xs opacity-70 mb-3">Optional: Falls leer, werden die deutschen Produkte automatisch in Echtzeit ins Niederländische übersetzt.</p>
                <div className="flex flex-wrap gap-2">
                  {(formData.products_nl || []).map((product, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-orange-100/70 border border-orange-200 px-2.5 py-1 rounded-md text-sm text-[#D65F0C] font-medium">
                      <span>{product}</span>
                      <button type="button" onClick={() => {
                        setFormData(prev => ({ ...prev, products_nl: prev.products_nl?.filter((_, i) => i !== idx) }));
                      }} className="text-red-500 hover:text-red-700">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Premium Section Toggle & Container */}
        <div className="mt-8 pt-4 border-t border-black/10">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <input 
                type="checkbox" 
                id="isPremium" 
                checked={!!formData.isPremium} 
                onChange={e => setFormData({...formData, isPremium: e.target.checked})} 
                className="w-5 h-5 rounded border-gray-300 text-orange-500 focus:ring-orange-500 cursor-pointer" 
              />
              <label htmlFor="isPremium" className={`text-lg font-bold cursor-pointer ${theme.textBase}`}>
                Als Premium-Eintrag aktivieren (Logo, Öffnungszeiten, Galerie, Stellenanzeigen, News)
              </label>
            </div>
            <span className={`text-xs font-bold px-3 py-1 rounded-full ${formData.isPremium ? 'bg-[#F2761B] text-white shadow-sm' : 'bg-gray-200 text-gray-700'}`}>
              {formData.isPremium ? '🌟 Premium Aktiv' : '🔒 Deaktiviert (Basiseintrag)'}
            </span>
          </div>

          {!formData.isPremium && (
            <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 text-sm flex items-start gap-3">
              <span className="text-xl leading-none">🔒</span>
              <div>
                <strong>Premium-Funktionen sind für diesen Eintrag deaktiviert (ausgegraut).</strong>
                <p className="text-xs text-amber-800 mt-1">
                  Aktivieren Sie die Checkbox oben, um das Unternehmens-Logo, Öffnungszeiten, die Bildergalerie, ausführliche Beschreibung und Stellenanzeigen zu bearbeiten und für diesen Eintrag freizuschalten.
                </p>
              </div>
            </div>
          )}

          <div className={`transition-all ${
            formData.isPremium 
              ? 'p-5 bg-orange-50/50 border border-orange-200 rounded-lg space-y-6 shadow-xs' 
              : 'p-5 bg-gray-100/60 border border-gray-200 rounded-lg space-y-6 opacity-45 pointer-events-none select-none grayscale-[40%]'
          }`}>
          
            <div className="border-b border-orange-200/50 pb-5">
              <label className={labelClass}>Unternehmens-Logo (URL) (Premium-Feature)</label>
              <div className="flex gap-2 mb-1">
                <input 
                  type="text" 
                  value={formData.logoUrl || ''} 
                  onChange={e => setFormData({...formData, logoUrl: e.target.value})} 
                  className={inputClass} 
                  placeholder="https://beispiel.de/logo.png" 
                  disabled={!formData.isPremium}
                />
                <label className={`px-4 py-2 font-medium transition-colors ${theme.primaryBtn} cursor-pointer flex items-center justify-center shrink-0 ${activeThemeKey === 'modern' ? 'rounded-none' : 'rounded-md'} ${uploadingImage ? 'opacity-50' : ''}`}>
                  {uploadingImage ? 'Lädt...' : 'Hochladen'}
                  <input type="file" accept="image/*" className="hidden" onChange={e => handleImageUpload(e, 'logo')} disabled={uploadingImage || !formData.isPremium} />
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
              <label className={labelClass}>Öffnungszeiten (Premium-Feature)</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => {
                  const val = formData.openingHours?.[day as keyof typeof formData.openingHours] || '';
                  const isClosed = !val || val.toLowerCase() === 'geschlossen';
                  
                  let start = '09:00';
                  let end = '17:00';
                  if (!isClosed && val.includes('-')) {
                     const parts = val.split('-').map(p => p.trim());
                     if (parts.length >= 2) {
                        start = parts[0];
                        // In case of multiple slots like '09:00 - 12:00, 13:00 - 17:00', we take just the first simple parse
                        end = parts[1].split(',')[0].trim();
                     }
                  }

                  return (
                    <div key={day} className="flex flex-col gap-1.5 p-3 border border-orange-100 rounded-lg bg-orange-50/30">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{day === 'monday' ? 'Montag' : day === 'tuesday' ? 'Dienstag' : day === 'wednesday' ? 'Mittwoch' : day === 'thursday' ? 'Donnerstag' : day === 'friday' ? 'Freitag' : day === 'saturday' ? 'Samstag' : 'Sonntag'}</span>
                        <label className="flex items-center gap-1.5 text-sm text-gray-700 cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={!isClosed} 
                            onChange={e => {
                              const checked = e.target.checked;
                              setFormData(prev => ({
                                ...prev,
                                openingHours: { ...(prev.openingHours || {}), [day]: checked ? `${start} - ${end}` : 'Geschlossen' }
                              }));
                            }}
                            className="rounded border-orange-300 text-orange-500 focus:ring-orange-500"
                          />
                          Geöffnet
                        </label>
                      </div>
                      {!isClosed && (
                        <div className="flex items-center gap-2 mt-1">
                          <input 
                            type="time" 
                            value={start}
                            onChange={e => setFormData(prev => ({
                              ...prev,
                              openingHours: { ...(prev.openingHours || {}), [day]: `${e.target.value} - ${end}` }
                            }))}
                            className={`${inputClass} py-1 px-2 text-sm text-center`}
                          />
                          <span className="text-gray-400 text-sm">bis</span>
                          <input 
                            type="time" 
                            value={end}
                            onChange={e => setFormData(prev => ({
                              ...prev,
                              openingHours: { ...(prev.openingHours || {}), [day]: `${start} - ${e.target.value}` }
                            }))}
                            className={`${inputClass} py-1 px-2 text-sm text-center`}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
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
              <div className="flex items-center justify-between mb-1">
                <label className={labelClass}>
                  {activeLangTab === 'de' ? 'Ausführliche Premium-Beschreibung (Deutsch - "Über uns")' : 'Ausführliche Premium-Beschreibung (Niederländisch - "Over het bedrijf")'}
                </label>
                <span className="text-xs text-[#5F6B63]">
                  {activeLangTab === 'de' ? '🇩🇪 Deutsch aktiv' : '🇳🇱 Niederländisch aktiv'}
                </span>
              </div>
              <p className="text-xs opacity-70 mb-2">
                {activeLangTab === 'de' 
                  ? 'Hier können Sie umfangreiche Texte, Formatierungen und Bilder über den WYSIWYG-Editor gestalten.' 
                  : 'Optional: Gestalten Sie hier die niederländische Übersetzung. Bleibt dieses Feld leer, wird der deutsche Text automatisch übersetzt.'}
              </p>
              <div className="bg-white rounded-md border border-black/10">
                {activeLangTab === 'de' ? (
                  <SafeRichTextEditor 
                    value={formData.extendedDescription || ''}
                    onChange={(val) => setFormData({...formData, extendedDescription: val})}
                  />
                ) : (
                  <SafeRichTextEditor 
                    value={formData.extendedDescription_nl || ''}
                    onChange={(val) => setFormData({...formData, extendedDescription_nl: val})}
                  />
                )}
              </div>

              <div className="h-12"></div>
            </div>

            {/* ─── Business News ─────────────────────────────────── */}
            <div className="mt-6 border-t-2 border-orange-200 pt-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-[#0F4C2E]">📰 News & Aktuelle Beiträge</h3>
                  <p className="text-sm text-[#5F6B63] mt-0.5">
                    Bis zu 5 Beiträge pro Monat · erscheinen sofort auf der Unternehmensseite · im News-Board erst nach Admin-Freigabe
                  </p>
                </div>
                {(() => {
                  const now = new Date();
                  const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
                  const count = (formData.businessNews || []).filter(n => n.publishedAt?.startsWith(thisMonth)).length;
                  return (
                    <span className={`text-sm font-bold px-3 py-1 rounded-full ${count >= 5 ? 'bg-red-100 text-red-700' : 'bg-[#E8F1EB] text-[#0F4C2E]'}`}>
                      {count} / 5 diesen Monat
                    </span>
                  );
                })()}
              </div>

              {/* Existing articles */}
              <div className="space-y-3 mb-4">
                {(formData.businessNews || []).map((article, idx) => (
                  <div key={article.id} className="bg-white border border-orange-200/60 rounded-lg p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${article.status === 'published' ? 'bg-[#E8F1EB] text-[#0F4C2E]' : 'bg-gray-100 text-gray-500'}`}>
                            {article.status === 'published' ? 'Veröffentlicht' : 'Entwurf'}
                          </span>
                          <span className="text-xs text-[#8A928B]">
                            {new Date(article.publishedAt).toLocaleDateString('de-DE', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                        </div>
                        <p className="font-semibold text-sm text-[#1B211D] truncate">{article.title}</p>
                        <p className="text-xs text-[#5F6B63] line-clamp-2 mt-0.5">{article.excerpt}</p>
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            const updated = (formData.businessNews || []).map((n, i) =>
                              i === idx ? { ...n, status: n.status === 'published' ? 'draft' as const : 'published' as const } : n
                            );
                            setFormData(prev => ({ ...prev, businessNews: updated }));
                          }}
                          className="text-xs px-2 py-1 rounded bg-[#E8F1EB] text-[#0F4C2E] hover:bg-[#C5DFCE] transition-colors font-medium"
                          title={article.status === 'published' ? 'Als Entwurf speichern' : 'Veröffentlichen'}
                        >
                          {article.status === 'published' ? 'Verbergen' : 'Publizieren'}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const updated = (formData.businessNews || []).filter((_, i) => i !== idx);
                            setFormData(prev => ({ ...prev, businessNews: updated }));
                          }}
                          className="text-xs px-2 py-1 rounded bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                          title="Löschen"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {(formData.businessNews || []).length === 0 && (
                  <p className="text-sm text-[#8A928B] italic">Noch keine Beiträge vorhanden.</p>
                )}
              </div>

              {/* New article form */}
              {(() => {
                const now = new Date();
                const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
                const count = (formData.businessNews || []).filter(n => n.publishedAt?.startsWith(thisMonth)).length;
                if (count >= 5) {
                  return <p className="text-sm text-red-600 font-medium">Monatliches Limit von 5 Beiträgen erreicht.</p>;
                }
                return (
                  <NewBusinessArticleForm
                    onAdd={(article) => {
                      setFormData(prev => ({
                        ...prev,
                        businessNews: [...(prev.businessNews || []), article],
                      }));
                    }}
                  />
                );
              })()}
            </div>

          </div>
        </div>


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
