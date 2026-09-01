import React, { useState } from 'react';
import { ArrowLeft, Trash2, Image as ImageIcon, Upload, X, Sparkles, Globe, Plus, Newspaper, ExternalLink, FileText, Check, FolderPlus, Tag, Laptop, Tablet, Smartphone, Crosshair, Move, FileDown, FileCheck, PhoneCall, CalendarDays, UtensilsCrossed, BadgePercent, Siren, ShieldCheck, HeartHandshake } from 'lucide-react';
import { Business, CategoryGroup, BusinessNewsArticle, GalleryCategory, GalleryImage, HeaderPositionConfig, BusinessDocument, CustomActionCta } from '../types';
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
      logoUrl: base.logoUrl || '',
      logoBgColor: base.logoBgColor || '#ffffff',
      uploadedImage: base.uploadedImage || '',
      imageLink: base.imageLink || '',
      services: Array.isArray(base.services) ? [...base.services] : [],
      products: Array.isArray(base.products) ? [...base.products] : [],
      jobs: Array.isArray(base.jobs) ? [...base.jobs] : [],
      openingHours: base.openingHours ? { ...base.openingHours } : { monday: '', tuesday: '', wednesday: '', thursday: '', friday: '', saturday: '', sunday: '' },
      headerImage: base.headerImage || '',
      headerPosition: base.headerPosition || {
        desktop: '50% 50%',
        tablet: '50% 50%',
        mobile: '50% 50%'
      },
      gallery: Array.isArray(base.gallery) ? [...base.gallery] : [],
      galleryCategories: Array.isArray(base.galleryCategories) && base.galleryCategories.length > 0
        ? base.galleryCategories.map((c: any) => ({
            id: c.id || 'cat_' + Math.random().toString(36).substring(2, 7),
            name: c.name || 'Galerie',
            name_nl: c.name_nl || '',
            images: (c.images || []).map((img: any) => typeof img === 'string' ? { url: img, alt: '', title: '' } : { url: img.url || '', alt: img.alt || '', title: img.title || '' })
          }))
        : (Array.isArray(base.gallery) && base.gallery.length > 0
            ? [{
                id: 'cat_default',
                name: 'Impressionen',
                name_nl: 'Impressies',
                images: base.gallery.map((url: any) => ({ url: typeof url === 'string' ? url : (url?.url || ''), alt: '', title: '' }))
              }]
            : []),
      isPremium: !!base.isPremium,
      businessNews: Array.isArray(base.businessNews) ? [...base.businessNews] : [],
      documents: Array.isArray(base.documents) ? [...base.documents] : [],
      featureBadges: Array.isArray(base.featureBadges) ? [...base.featureBadges] : [],
      customCta: base.customCta || { text: '', url: '', type: 'custom' },
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
  const [headerDeviceTab, setHeaderDeviceTab] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newService, setNewService] = useState('');
  const [newServiceNl, setNewServiceNl] = useState('');
  const [newProduct, setNewProduct] = useState('');
  const [newProductNl, setNewProductNl] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);

  // New Document Upload State
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const [docTitle, setDocTitle] = useState('');
  const [docType, setDocType] = useState<BusinessDocument['type']>('menu');
  const [newCustomBadge, setNewCustomBadge] = useState('');

  const handleDocumentUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      alert('Bitte nur PDF-Dateien hochladen.');
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      alert('Die PDF-Datei ist zu groß (maximal 15 MB).');
      return;
    }

    setUploadingDoc(true);
    try {
      const storageRef = ref(storage, `documents/${formData.id || 'new'}_${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`);
      await uploadBytes(storageRef, file);
      const downloadUrl = await getDownloadURL(storageRef);

      const sizeStr = file.size > 1024 * 1024 
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` 
        : `${Math.round(file.size / 1024)} KB`;

      const newDoc: BusinessDocument = {
        id: `doc_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        title: docTitle.trim() || file.name.replace(/\.pdf$/i, ''),
        type: docType,
        url: downloadUrl,
        fileSize: sizeStr,
        updatedAt: new Date().toISOString()
      };

      setFormData(prev => ({
        ...prev,
        documents: [...(prev.documents || []), newDoc]
      }));

      setDocTitle('');
      e.target.value = '';
    } catch (err: any) {
      console.error('Error uploading document:', err);
      alert('Fehler beim Hochladen des Dokuments: ' + (err.message || err));
    } finally {
      setUploadingDoc(false);
    }
  };

  const handleDeleteDocument = (docId: string) => {
    setFormData(prev => ({
      ...prev,
      documents: (prev.documents || []).filter(d => d.id !== docId)
    }));
  };

  const handleToggleBadge = (badgeLabel: string) => {
    setFormData(prev => {
      const existing = prev.featureBadges || [];
      if (existing.includes(badgeLabel)) {
        return { ...prev, featureBadges: existing.filter(b => b !== badgeLabel) };
      } else {
        return { ...prev, featureBadges: [...existing, badgeLabel] };
      }
    });
  };

  const handleAddCustomBadge = () => {
    const trimmed = newCustomBadge.trim();
    if (!trimmed) return;
    if (!(formData.featureBadges || []).includes(trimmed)) {
      setFormData(prev => ({
        ...prev,
        featureBadges: [...(prev.featureBadges || []), trimmed]
      }));
    }
    setNewCustomBadge('');
  };


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
    
    const syncedGallery = (formData.galleryCategories || []).flatMap(c => (c.images || []).map(img => typeof img === 'string' ? img : img.url).filter(Boolean));

    const newId = formData.id || 'b_' + Date.now().toString(36);
    const dataToSubmit: Business = {
      ...formData,
      logoUrl: formData.logoUrl || '',
      logoBgColor: formData.logoBgColor || '#ffffff',
      jobs: formData.jobs || [],
      headerImage: formData.headerImage || '',
      headerPosition: formData.headerPosition || {
        desktop: '50% 50%',
        tablet: '50% 50%',
        mobile: '50% 50%'
      },
      galleryCategories: formData.galleryCategories || [],
      gallery: syncedGallery.length > 0 ? syncedGallery : (formData.gallery || []),
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
      documents: formData.documents || [],
      featureBadges: formData.featureBadges || [],
      customCta: formData.customCta?.text ? formData.customCta : null,
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

  const handleAddCategory = (name: string = '') => {
    const currentCats = formData.galleryCategories || [];
    if (currentCats.length >= 5) {
      alert("Maximal 5 Galerie-Kategorien im Premium-Account möglich.");
      return;
    }
    const defaultNames = ['Räumlichkeiten', 'Team', 'Speisen & Getränke', 'Werkstatt & Handwerk', 'Events & Feiern'];
    const fallbackName = defaultNames.find(n => !currentCats.some(c => c.name.toLowerCase() === n.toLowerCase())) || `Kategorie ${currentCats.length + 1}`;
    const newCatName = name.trim() || fallbackName;
    const newCat: GalleryCategory = {
      id: 'cat_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 5),
      name: newCatName,
      name_nl: translateTextToDutch(newCatName),
      images: []
    };
    setFormData(prev => ({
      ...prev,
      galleryCategories: [...(prev.galleryCategories || []), newCat]
    }));
  };

  const handleUpdateCategoryName = (catId: string, name: string) => {
    setFormData(prev => ({
      ...prev,
      galleryCategories: (prev.galleryCategories || []).map(c => 
        c.id === catId ? { ...c, name, name_nl: translateTextToDutch(name) } : c
      )
    }));
  };

  const handleDeleteCategory = (catId: string) => {
    if (confirm("Möchten Sie diese Kategorie und alle darin enthaltenen Bilder wirklich löschen?")) {
      setFormData(prev => {
        const newCats = (prev.galleryCategories || []).filter(c => c.id !== catId);
        const syncedGallery = newCats.flatMap(c => c.images.map(img => img.url));
        return {
          ...prev,
          galleryCategories: newCats,
          gallery: syncedGallery
        };
      });
    }
  };

  const handleAddImageToCategory = (catId: string, imageUrl: string, altText: string = '', titleText: string = '') => {
    if (!imageUrl) return;
    setFormData(prev => {
      const currentCats = prev.galleryCategories || [];
      const updatedCats = currentCats.map(c => {
        if (c.id === catId) {
          if (c.images.length >= 5) {
            alert("Maximal 5 Bilder pro Kategorie möglich.");
            return c;
          }
          return {
            ...c,
            images: [...c.images, { url: imageUrl, alt: altText, title: titleText }]
          };
        }
        return c;
      });
      const syncedGallery = updatedCats.flatMap(c => c.images.map(img => img.url));
      return {
        ...prev,
        galleryCategories: updatedCats,
        gallery: syncedGallery
      };
    });
  };

  const handleUpdateImageMeta = (catId: string, imgIdx: number, updates: Partial<GalleryImage>) => {
    setFormData(prev => ({
      ...prev,
      galleryCategories: (prev.galleryCategories || []).map(c => {
        if (c.id === catId) {
          const newImgs = [...c.images];
          if (newImgs[imgIdx]) {
            newImgs[imgIdx] = { ...newImgs[imgIdx], ...updates };
          }
          return { ...c, images: newImgs };
        }
        return c;
      })
    }));
  };

  const handleDeleteImageFromCategory = (catId: string, imgIdx: number) => {
    setFormData(prev => {
      const updatedCats = (prev.galleryCategories || []).map(c => {
        if (c.id === catId) {
          return {
            ...c,
            images: c.images.filter((_, i) => i !== imgIdx)
          };
        }
        return c;
      });
      const syncedGallery = updatedCats.flatMap(c => c.images.map(img => img.url));
      return {
        ...prev,
        galleryCategories: updatedCats,
        gallery: syncedGallery
      };
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, target: 'gallery' | 'title' | 'logo' | 'header' = 'gallery', categoryId?: string) => {
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
              const max = 1200;
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
                resolve(canvas.toDataURL('image/jpeg', 0.8));
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
        if (target === 'header') {
          return { ...prev, headerImage: url };
        }
        if (target === 'logo') {
          return { ...prev, logoUrl: url };
        }
        if (target === 'title') {
          return { ...prev, uploadedImage: url, imageLink: url };
        }
        
        // target === 'gallery'
        const currentCats = [...(prev.galleryCategories || [])];
        if (currentCats.length === 0) {
          const newCat: GalleryCategory = {
            id: 'cat_' + Date.now().toString(36),
            name: 'Impressionen',
            name_nl: 'Impressies',
            images: [{ url, alt: '', title: '' }]
          };
          return {
            ...prev,
            galleryCategories: [newCat],
            gallery: [url]
          };
        }
        
        const targetCatIndex = categoryId ? currentCats.findIndex(c => c.id === categoryId) : 0;
        const indexToUse = targetCatIndex >= 0 ? targetCatIndex : 0;
        if (currentCats[indexToUse].images.length >= 5) {
          alert("Maximal 5 Bilder pro Kategorie möglich.");
          return prev;
        }
        
        currentCats[indexToUse] = {
          ...currentCats[indexToUse],
          images: [...currentCats[indexToUse].images, { url, alt: '', title: '' }]
        };
        
        const synced = currentCats.flatMap(c => c.images.map(img => img.url));
        return {
          ...prev,
          galleryCategories: currentCats,
          gallery: synced
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
      const updatedCats = (prev.galleryCategories || []).map(c => ({
        ...c,
        images: c.images.filter(img => img.url !== imgUrl)
      }));
      const newGallery = (prev.gallery || []).filter(url => url !== imgUrl);
      const isCover = imgUrl === prev.imageLink || imgUrl === prev.uploadedImage;
      return {
        ...prev,
        galleryCategories: updatedCats,
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

  const parsePositionCoords = (posStr?: string): { x: number, y: number } => {
    if (!posStr) return { x: 50, y: 50 };
    if (posStr === 'center' || posStr === 'center center') return { x: 50, y: 50 };
    if (posStr === 'top' || posStr === 'top center') return { x: 50, y: 0 };
    if (posStr === 'bottom' || posStr === 'bottom center') return { x: 50, y: 100 };
    if (posStr === 'left' || posStr === 'left center') return { x: 0, y: 50 };
    if (posStr === 'right' || posStr === 'right center') return { x: 100, y: 50 };
    const parts = posStr.trim().split(/\s+/).map(p => parseFloat(p.replace('%', '')));
    if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
      return { x: Math.max(0, Math.min(100, parts[0])), y: Math.max(0, Math.min(100, parts[1])) };
    }
    return { x: 50, y: 50 };
  };

  const handleSetHeaderPosition = (device: 'desktop' | 'tablet' | 'mobile', x: number, y: number) => {
    const clampedX = Math.max(0, Math.min(100, Math.round(x)));
    const clampedY = Math.max(0, Math.min(100, Math.round(y)));
    const posStr = `${clampedX}% ${clampedY}%`;
    setFormData(prev => ({
      ...prev,
      headerPosition: {
        ...(prev.headerPosition || { desktop: '50% 50%', tablet: '50% 50%', mobile: '50% 50%' }),
        [device]: posStr
      }
    }));
  };

  const handleHeaderPreviewClick = (e: React.MouseEvent<HTMLDivElement>, device: 'desktop' | 'tablet' | 'mobile') => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    const pctX = (clickX / rect.width) * 100;
    const pctY = (clickY / rect.height) * 100;
    handleSetHeaderPosition(device, pctX, pctY);
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
                Als Premium-Eintrag aktivieren (Logo, Hero-Header, Galerie, Öffnungszeiten, Stellenanzeigen, News)
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
                  Aktivieren Sie die Checkbox oben, um das Unternehmens-Logo, Hero-Headerbild, die kategorisierte Bildergalerie, Öffnungszeiten, ausführliche Beschreibung und Stellenanzeigen zu bearbeiten und für diesen Eintrag freizuschalten.
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
                  <Upload className="w-4 h-4 mr-1.5" />
                  {uploadingImage ? 'Lädt...' : 'Hochladen'}
                  <input type="file" accept="image/*" className="hidden" onChange={e => handleImageUpload(e, 'logo')} disabled={uploadingImage || !formData.isPremium} />
                </label>
              </div>
              <p className="text-xs opacity-70 mt-1.5 leading-relaxed">
                Das Logo wird in den Suchergebnissen auf der Karte sowie im Unternehmensprofil direkt über der Kontaktbox dargestellt.
              </p>

              {/* Logo-Box Hintergrundfarbe */}
              <div className="mt-3 pt-3 border-t border-gray-100">
                <label className="text-xs font-semibold text-[#5F6B63] block mb-1.5">
                  Hintergrundfarbe der Logo-Box (auf Detailseite):
                </label>
                <div className="flex flex-wrap items-center gap-2">
                  {[
                    { label: 'Weiß', value: '#ffffff', bgClass: 'bg-white text-gray-800' },
                    { label: 'Creme / Warmweiß', value: '#FAF8F5', bgClass: 'bg-[#FAF8F5] text-gray-800' },
                    { label: 'Hellgrau', value: '#F3F4F6', bgClass: 'bg-gray-100 text-gray-800' },
                    { label: 'Dunkelgrün', value: '#0F4C2E', bgClass: 'bg-[#0F4C2E] text-white' },
                    { label: 'Dunkel', value: '#1B211D', bgClass: 'bg-[#1B211D] text-white' },
                    { label: 'Transparent', value: 'transparent', bgClass: 'bg-transparent text-gray-800 border-dashed' },
                  ].map(preset => {
                    const isSelected = (formData.logoBgColor || '#ffffff').toLowerCase() === preset.value.toLowerCase();
                    return (
                      <button
                        key={preset.value}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, logoBgColor: preset.value }))}
                        className={`text-xs px-2.5 py-1 rounded-md border transition-all flex items-center gap-1.5 cursor-pointer ${preset.bgClass} ${
                          isSelected ? 'border-[#F2761B] ring-2 ring-[#F2761B]/40 font-bold scale-105 shadow-xs' : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        <span className="w-2.5 h-2.5 rounded-full border border-black/20" style={{ backgroundColor: preset.value === 'transparent' ? '#ffffff' : preset.value }}></span>
                        {preset.label}
                      </button>
                    );
                  })}

                  <div className="flex items-center gap-1.5 ml-1">
                    <span className="text-xs text-gray-400">oder</span>
                    <input 
                      type="color" 
                      value={formData.logoBgColor?.startsWith('#') ? formData.logoBgColor : '#ffffff'} 
                      onChange={e => setFormData(prev => ({ ...prev, logoBgColor: e.target.value }))}
                      className="w-7 h-7 rounded border border-gray-300 cursor-pointer p-0.5"
                      title="Eigene Hintergrundfarbe wählen"
                    />
                    <input
                      type="text"
                      value={formData.logoBgColor || '#ffffff'}
                      onChange={e => setFormData(prev => ({ ...prev, logoBgColor: e.target.value }))}
                      className="w-20 text-xs border border-gray-200 rounded px-1.5 py-1 font-mono uppercase bg-white"
                      placeholder="#FFFFFF"
                    />
                  </div>
                </div>
              </div>

              {formData.logoUrl && (
                <div className="mt-3.5">
                  <span className="text-[11px] text-[#5F6B63] block mb-1">Logo-Vorschau mit gewählter Hintergrundfarbe:</span>
                  <div 
                    className="relative w-36 h-24 border border-black/15 rounded-lg p-2.5 shadow-xs flex items-center justify-center transition-colors"
                    style={{ backgroundColor: formData.logoBgColor || '#ffffff' }}
                  >
                    <img src={formData.logoUrl} alt="Logo Vorschau" className="max-w-full max-h-full object-contain" />
                    <button 
                      type="button" 
                      onClick={() => setFormData({...formData, logoUrl: ''})} 
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow hover:bg-red-600 transition-colors cursor-pointer"
                      title="Logo entfernen"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
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

            
            {/* Hero / Header Hintergrundbild (Premium) */}
            <div className="border-b border-orange-200/50 pb-6">
              <label className={labelClass}>Hero- / Header-Hintergrundbild (Premium-Feature)</label>
              <p className="text-xs opacity-70 mb-3">
                Dieses Bild wird im Kopfbereich Ihres Profils als stimmungsvoller Hintergrund mit dem eleganten Farbverlauf wie auf der Startseite dargestellt.
              </p>
              
              <div className="flex flex-col gap-4">
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={formData.headerImage || ''} 
                    onChange={e => setFormData({...formData, headerImage: e.target.value})} 
                    className={inputClass} 
                    placeholder="https://beispiel.de/header-hintergrund.jpg" 
                    disabled={!formData.isPremium}
                  />
                  <label className={`cursor-pointer flex items-center gap-2 px-4 py-2 text-sm font-medium shrink-0 transition-colors ${theme.primaryBtn} ${activeThemeKey === 'modern' ? 'rounded-none' : 'rounded-md'} ${uploadingImage || !formData.isPremium ? 'opacity-50' : ''}`}>
                    <Upload className="w-4 h-4" />
                    {uploadingImage ? 'Lädt...' : 'Header-Bild hochladen'}
                    <input type="file" accept="image/*" className="hidden" onChange={e => handleImageUpload(e, 'header')} disabled={uploadingImage || !formData.isPremium} />
                  </label>
                </div>

                {formData.headerImage && (
                  <div className="bg-white border border-orange-200/80 rounded-lg p-4 shadow-2xs space-y-4">
                    {/* Device Switcher Tabs */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-gray-100">
                      <div className="text-xs font-bold text-[#0F4C2E] flex items-center gap-1.5">
                        <Crosshair className="w-3.5 h-3.5 text-[#F2761B]" />
                        Bild-Ausschnitt & Fokuspunkt je Endgerät anpassen:
                      </div>
                      <div className="flex bg-[#FAF8F5] p-1 rounded-md border border-[#EDE8E0] gap-1 self-start sm:self-auto">
                        <button
                          type="button"
                          onClick={() => setHeaderDeviceTab('desktop')}
                          className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded transition-colors cursor-pointer ${
                            headerDeviceTab === 'desktop'
                              ? 'bg-[#0F4C2E] text-white shadow-xs'
                              : 'text-[#5F6B63] hover:text-[#0F4C2E]'
                          }`}
                        >
                          <Laptop className="w-3.5 h-3.5" />
                          Desktop
                        </button>
                        <button
                          type="button"
                          onClick={() => setHeaderDeviceTab('tablet')}
                          className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded transition-colors cursor-pointer ${
                            headerDeviceTab === 'tablet'
                              ? 'bg-[#0F4C2E] text-white shadow-xs'
                              : 'text-[#5F6B63] hover:text-[#0F4C2E]'
                          }`}
                        >
                          <Tablet className="w-3.5 h-3.5" />
                          Tablet
                        </button>
                        <button
                          type="button"
                          onClick={() => setHeaderDeviceTab('mobile')}
                          className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded transition-colors cursor-pointer ${
                            headerDeviceTab === 'mobile'
                              ? 'bg-[#0F4C2E] text-white shadow-xs'
                              : 'text-[#5F6B63] hover:text-[#0F4C2E]'
                          }`}
                        >
                          <Smartphone className="w-3.5 h-3.5" />
                          Mobil
                        </button>
                      </div>
                    </div>

                    {/* Responsive Live Preview Box */}
                    {(() => {
                      const currentPosStr = formData.headerPosition?.[headerDeviceTab] || '50% 50%';
                      const { x, y } = parsePositionCoords(currentPosStr);

                      // Frame sizing based on selected device tab
                      const frameClass = headerDeviceTab === 'desktop'
                        ? 'w-full h-36'
                        : headerDeviceTab === 'tablet'
                          ? 'max-w-md mx-auto h-44'
                          : 'max-w-xs mx-auto h-52';

                      return (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>
                              Live-Vorschau ({headerDeviceTab === 'desktop' ? 'Breitbild Desktop' : headerDeviceTab === 'tablet' ? 'Tablet Quer-/Hochformat' : 'Kompakt Smartphone'}):
                            </span>
                            <span className="font-mono text-[#0F4C2E] font-bold bg-[#FAF8F5] px-2 py-0.5 rounded border border-[#EDE8E0]">
                              Fokus: X {x}% / Y {y}%
                            </span>
                          </div>

                          <div 
                            onClick={(e) => handleHeaderPreviewClick(e, headerDeviceTab)}
                            className={`relative rounded-lg overflow-hidden border-2 border-orange-300 shadow-md p-4 flex flex-col justify-end cursor-crosshair transition-all select-none ${frameClass}`}
                            style={{
                              backgroundImage: `linear-gradient(105deg, rgba(6,48,28,0.94) 0%, rgba(15,76,46,0.86) 55%, rgba(15,76,46,0.45) 100%), url(${formData.headerImage})`,
                              backgroundPosition: currentPosStr,
                              backgroundSize: 'cover',
                              backgroundRepeat: 'no-repeat'
                            }}
                            title="Klicken Sie ins Bild, um den Fokuspunkt direkt zu setzen"
                          >
                            {/* Focal Target Indicator */}
                            <div 
                              className="absolute w-6 h-6 -ml-3 -mt-3 rounded-full border-2 border-white bg-[#F2761B] shadow-lg pointer-events-none flex items-center justify-center animate-pulse"
                              style={{ left: `${x}%`, top: `${y}%` }}
                            >
                              <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                            </div>

                            {/* Mock Header Content */}
                            <div className="text-white text-xs font-bold drop-shadow truncate pointer-events-none">
                              {formData.name || 'Unternehmensname'}
                            </div>
                            <div className="text-white/80 text-[10px] drop-shadow truncate pointer-events-none">
                              {formData.category || 'Kategorie'}
                            </div>

                            <button 
                              type="button" 
                              onClick={(e) => { e.stopPropagation(); setFormData(prev => ({...prev, headerImage: ''})); }} 
                              className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full shadow hover:bg-red-600 transition-colors cursor-pointer"
                              title="Header-Bild entfernen"
                            >
                              <Trash2 className="w-3.5 h-3.5"/>
                            </button>
                          </div>

                          {/* Control Panel: 9-Grid & Fine Adjustment Sliders */}
                          <div className="grid grid-cols-1 md:grid-cols-[160px_1fr] gap-4 pt-2 border-t border-gray-100">
                            {/* 9-Grid Quick Presets */}
                            <div>
                              <span className="text-[11px] font-semibold text-[#5F6B63] block mb-1.5">
                                Schnellwahl Fokus:
                              </span>
                              <div className="grid grid-cols-3 gap-1 w-fit">
                                {[
                                  { label: '↖', title: 'Oben Links', x: 0, y: 0 },
                                  { label: '↑', title: 'Oben Mitte', x: 50, y: 0 },
                                  { label: '↗', title: 'Oben Rechts', x: 100, y: 0 },
                                  { label: '←', title: 'Mitte Links', x: 0, y: 50 },
                                  { label: '⦿', title: 'Zentriert', x: 50, y: 50 },
                                  { label: '→', title: 'Mitte Rechts', x: 100, y: 50 },
                                  { label: '↙', title: 'Unten Links', x: 0, y: 100 },
                                  { label: '↓', title: 'Unten Mitte', x: 50, y: 100 },
                                  { label: '↘', title: 'Unten Rechts', x: 100, y: 100 }
                                ].map((preset, idx) => {
                                  const isSelected = Math.abs(x - preset.x) < 5 && Math.abs(y - preset.y) < 5;
                                  return (
                                    <button
                                      key={idx}
                                      type="button"
                                      onClick={() => handleSetHeaderPosition(headerDeviceTab, preset.x, preset.y)}
                                      className={`w-9 h-7 rounded text-xs font-bold transition-all cursor-pointer flex items-center justify-center ${
                                        isSelected
                                          ? 'bg-[#0F4C2E] text-white shadow-xs scale-105'
                                          : 'bg-[#FAF8F5] text-[#5F6B63] hover:bg-[#E8F1EB] hover:text-[#0F4C2E] border border-[#EDE8E0]'
                                      }`}
                                      title={preset.title}
                                    >
                                      {preset.label}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>

                            {/* Precise Sliders */}
                            <div className="flex flex-col justify-center gap-2">
                              <div>
                                <div className="flex justify-between text-[11px] font-semibold text-[#5F6B63] mb-1">
                                  <span>Horizontaler Fokus (X):</span>
                                  <span className="font-mono text-[#0F4C2E]">{x}%</span>
                                </div>
                                <input 
                                  type="range" 
                                  min="0" 
                                  max="100" 
                                  value={x} 
                                  onChange={(e) => handleSetHeaderPosition(headerDeviceTab, Number(e.target.value), y)}
                                  className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#0F4C2E]"
                                />
                                <div className="flex justify-between text-[9.5px] text-gray-400 mt-0.5">
                                  <span>Links (0%)</span>
                                  <span>Mitte (50%)</span>
                                  <span>Rechts (100%)</span>
                                </div>
                              </div>

                              <div>
                                <div className="flex justify-between text-[11px] font-semibold text-[#5F6B63] mb-1">
                                  <span>Vertikaler Fokus (Y):</span>
                                  <span className="font-mono text-[#0F4C2E]">{y}%</span>
                                </div>
                                <input 
                                  type="range" 
                                  min="0" 
                                  max="100" 
                                  value={y} 
                                  onChange={(e) => handleSetHeaderPosition(headerDeviceTab, x, Number(e.target.value))}
                                  className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#0F4C2E]"
                                />
                                <div className="flex justify-between text-[9.5px] text-gray-400 mt-0.5">
                                  <span>Oben (0%)</span>
                                  <span>Mitte (50%)</span>
                                  <span>Unten (100%)</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="text-[11px] text-[#5F6B63] bg-[#FFF8F1] border border-orange-200/50 p-2.5 rounded-md flex items-start gap-2">
                            <span className="text-[#F2761B] font-bold">💡</span>
                            <span>
                              <strong>Tipp:</strong> Sie können direkt in das Vorschaubild klicken, um den Bildausschnitt für <em>{headerDeviceTab === 'desktop' ? 'Desktop' : headerDeviceTab === 'tablet' ? 'Tablet' : 'Mobil'}</em> millimetergenau zu platzieren.
                            </span>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                )}
              </div>
            </div>

            {/* Titelbild (Hauptbild) */}
            <div className="border-b border-orange-200/50 pb-5">
              <label className={labelClass}>Titelbild (Hauptbild auf Suchkarte)</label>
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
                    disabled={!formData.isPremium}
                  />
                  <label className={`cursor-pointer flex items-center gap-2 px-4 py-2 text-sm font-medium shrink-0 transition-colors bg-white border border-black/20 hover:bg-black/5 ${activeThemeKey === 'modern' ? 'rounded-none' : 'rounded-md'} ${!formData.isPremium ? 'opacity-50' : ''}`}>
                    <Upload className="w-4 h-4" />
                    {uploadingImage ? 'Lädt...' : 'Direkt hochladen'}
                    <input type="file" accept="image/*" className="hidden" onChange={e => handleImageUpload(e, 'title')} disabled={uploadingImage || !formData.isPremium} />
                  </label>
                </div>
              </div>
            </div>

            {/* Kategorisierte Bildergalerie (Bis zu 5 Kategorien à 5 Bilder) */}
            <div className="border-b border-orange-200/50 pb-6">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <label className={`${labelClass} mb-0`}>
                    Kategorisierte Bildergalerie (Bis zu 5 Kategorien à 5 Bilder)
                  </label>
                  <p className="text-xs opacity-70 mt-0.5">
                    Strukturieren Sie Ihre Bilder nach Themenbereichen inkl. SEO Alt- & Titel-Tags.
                  </p>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded bg-[#FAF8F5] border border-[#EDE8E0] text-[#0F4C2E]">
                  {(formData.galleryCategories || []).length} / 5 Kategorien
                </span>
              </div>

              {/* Quick Add Suggestions */}
              {(formData.galleryCategories || []).length < 5 && (
                <div className="my-3 p-3 bg-white/80 border border-orange-200/60 rounded-lg">
                  <div className="text-xs font-semibold text-[#5F6B63] mb-2 flex items-center gap-1.5">
                    <FolderPlus className="w-3.5 h-3.5 text-[#F2761B]" />
                    Neue Kategorie hinzufügen (Vorschlag wählen oder selbst benennen):
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {['Räumlichkeiten', 'Team', 'Speisen & Getränke', 'Werkstatt & Handwerk', 'Events & Feiern', 'Ausstattung'].map((catSuggestion) => {
                      const isExisting = (formData.galleryCategories || []).some(c => c.name.toLowerCase() === catSuggestion.toLowerCase());
                      if (isExisting) return null;
                      return (
                        <button
                          key={catSuggestion}
                          type="button"
                          onClick={() => handleAddCategory(catSuggestion)}
                          className="text-xs px-2.5 py-1 rounded-md bg-[#FFF1E4] text-[#D65F0C] border border-[#F2761B]/30 hover:bg-[#F2761B] hover:text-white transition-colors font-medium cursor-pointer"
                        >
                          + {catSuggestion}
                        </button>
                      );
                    })}
                    <button
                      type="button"
                      onClick={() => handleAddCategory('')}
                      className="text-xs px-2.5 py-1 rounded-md bg-white border border-[#EDE8E0] text-[#0F4C2E] hover:bg-[#E8F1EB] transition-colors font-medium cursor-pointer"
                    >
                      + Eigene Kategorie...
                    </button>
                  </div>
                </div>
              )}

              {/* Category Cards List */}
              <div className="space-y-4 mt-4">
                {(formData.galleryCategories || []).map((category, catIdx) => {
                  const imagesCount = (category.images || []).length;
                  return (
                    <div key={category.id || catIdx} className="bg-white border border-orange-200/70 rounded-lg p-4 shadow-2xs">
                      {/* Category Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <span className="w-6 h-6 rounded-full bg-[#FFF1E4] text-[#D65F0C] font-bold text-xs flex items-center justify-center shrink-0">
                            {catIdx + 1}
                          </span>
                          <input 
                            type="text" 
                            value={category.name} 
                            onChange={e => handleUpdateCategoryName(category.id, e.target.value)} 
                            className="text-sm font-bold border border-gray-200 rounded px-2.5 py-1 bg-[#FAF8F5] focus:outline-none focus:ring-1 focus:ring-[#F2761B] w-full max-w-[280px]"
                            placeholder="Kategoriename (z. B. Räumlichkeiten)"
                          />
                        </div>
                        
                        <div className="flex items-center gap-2 shrink-0">
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded ${imagesCount >= 5 ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-700'}`}>
                            {imagesCount} / 5 Bilder
                          </span>
                          <button 
                            type="button" 
                            onClick={() => handleDeleteCategory(category.id)} 
                            className="text-xs text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5 rounded transition-colors flex items-center gap-1"
                            title="Kategorie löschen"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Kategorie entfernen</span>
                          </button>
                        </div>
                      </div>

                      {/* Category Images Grid */}
                      <div className="mt-3">
                        {(category.images || []).length > 0 ? (
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-3">
                            {category.images.map((img, imgIdx) => {
                              const imgUrl = typeof img === 'string' ? img : img.url;
                              const isCover = imgUrl === formData.imageLink || imgUrl === formData.uploadedImage;
                              const altText = typeof img === 'string' ? '' : (img.alt || '');
                              const titleText = typeof img === 'string' ? '' : (img.title || '');

                              return (
                                <div key={imgIdx} className={`border rounded-lg p-2.5 bg-[#FAF8F5] transition-all ${isCover ? 'border-[#F2761B] ring-1 ring-[#F2761B]' : 'border-gray-200'}`}>
                                  <div className="relative h-28 w-full rounded overflow-hidden mb-2 bg-gray-100">
                                    <img src={imgUrl} alt={altText || `Bild ${imgIdx + 1}`} className="w-full h-full object-cover" />
                                    {isCover && (
                                      <div className="absolute top-1 left-1 bg-[#F2761B] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
                                        Titelbild
                                      </div>
                                    )}
                                    <div className="absolute top-1 right-1 flex gap-1">
                                      <button 
                                        type="button" 
                                        onClick={() => handleDeleteImageFromCategory(category.id, imgIdx)} 
                                        className="w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow"
                                        title="Bild löschen"
                                      >
                                        <X className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  </div>

                                  <div className="space-y-1.5">
                                    <div>
                                      <label className="text-[11px] font-semibold text-[#5F6B63] block">Alt-Text (SEO / Bildbeschreibung):</label>
                                      <input 
                                        type="text" 
                                        value={altText} 
                                        onChange={e => handleUpdateImageMeta(category.id, imgIdx, { alt: e.target.value })} 
                                        placeholder={`z. B. ${category.name} bei ${formData.name || 'uns'}`} 
                                        className="w-full text-xs border border-gray-200 rounded px-2 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-[#F2761B]"
                                      />
                                    </div>

                                    <div>
                                      <label className="text-[11px] font-semibold text-[#5F6B63] block">Bild-Titel / Caption:</label>
                                      <input 
                                        type="text" 
                                        value={titleText} 
                                        onChange={e => handleUpdateImageMeta(category.id, imgIdx, { title: e.target.value })} 
                                        placeholder={`z. B. ${category.name} Übersicht`} 
                                        className="w-full text-xs border border-gray-200 rounded px-2 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-[#F2761B]"
                                      />
                                    </div>

                                    {!isCover && (
                                      <button 
                                        type="button" 
                                        onClick={() => setFormData(prev => ({ ...prev, imageLink: imgUrl, uploadedImage: imgUrl }))} 
                                        className="w-full text-xs font-semibold py-1 px-2 rounded bg-white hover:bg-orange-50 border border-[#EDE8E0] text-[#D65F0C] transition-colors"
                                      >
                                        ★ Als Titelbild festlegen
                                      </button>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="text-xs text-[#8A928B] italic py-2">
                            Noch keine Bilder in dieser Kategorie vorhanden.
                          </div>
                        )}

                        {/* Add Image to this Category */}
                        {imagesCount < 5 && (
                          <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-gray-100">
                            <label className={`cursor-pointer flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors bg-[#E8F1EB] text-[#0F4C2E] hover:bg-[#D6E7DC] rounded ${uploadingImage ? 'opacity-50' : ''}`}>
                              <Upload className="w-3.5 h-3.5" />
                              {uploadingImage ? 'Lädt...' : `Foto zu "${category.name}" hochladen`}
                              <input type="file" accept="image/*" className="hidden" onChange={e => handleImageUpload(e, 'gallery', category.id)} disabled={uploadingImage} />
                            </label>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}

                {(formData.galleryCategories || []).length === 0 && (
                  <div className="text-center py-6 border border-dashed border-gray-300 rounded-lg bg-gray-50/50">
                    <p className="text-sm text-gray-500 mb-3">Noch keine Galerie-Kategorien angelegt.</p>
                    <button
                      type="button"
                      onClick={() => handleAddCategory('Impressionen')}
                      className="px-4 py-2 text-xs font-bold rounded bg-[#0F4C2E] text-white hover:bg-[#0B3B24] transition-colors"
                    >
                      + Erste Kategorie „Impressionen“ anlegen
                    </button>
                  </div>
                )}
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

            {/* ─── PDF-Speisekarten, Preislisten & Dokumente ──────── */}
            <div className="mt-8 border-t-2 border-orange-200 pt-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-[#0F4C2E] flex items-center gap-2">
                    <FileDown className="w-5 h-5 text-[#F2761B]" />
                    📄 Speisekarten, Preislisten & PDF-Dokumente
                  </h3>
                  <p className="text-sm text-[#5F6B63] mt-0.5">
                    Laden Sie Speisekarten, Getränkekarten, Preislisten, Verleihgebühren oder Imagebroschüren als PDF hoch (max. 15 MB).
                  </p>
                </div>
              </div>

              {/* Upload Box */}
              <div className="bg-[#FAF8F5] border border-[#E7E2DA] rounded-lg p-4 mb-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
                  <div>
                    <label className="block text-xs font-bold text-[#1B211D] mb-1">Dokument-Typ *</label>
                    <select
                      value={docType}
                      onChange={e => setDocType(e.target.value as any)}
                      className="w-full border border-[#E7E2DA] rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:border-[#0F4C2E]"
                    >
                      <option value="menu">🍽️ Speise- / Getränkekarte</option>
                      <option value="pricelist">🏷️ Preis- / Verleihliste</option>
                      <option value="flyer">📰 Flyer &amp; Angebote</option>
                      <option value="brochure">📖 Broschüre &amp; Katalog</option>
                      <option value="other">📁 Sonstiges Dokument</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-[#1B211D] mb-1">Titel des Dokuments (Optional)</label>
                    <input
                      type="text"
                      value={docTitle}
                      onChange={e => setDocTitle(e.target.value)}
                      placeholder="z. B. Speisekarte Saison 2026, Preisliste Handwerk..."
                      className="w-full border border-[#E7E2DA] rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:border-[#0F4C2E]"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <label className={`cursor-pointer inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-md text-white bg-[#0F4C2E] hover:bg-[#06301C] transition-colors shadow-xs ${uploadingDoc ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    <Upload className="w-4 h-4" />
                    {uploadingDoc ? 'Wird hochgeladen...' : '+ PDF-Datei auswählen & hochladen'}
                    <input
                      type="file"
                      accept="application/pdf,.pdf"
                      className="hidden"
                      onChange={handleDocumentUpload}
                      disabled={uploadingDoc}
                    />
                  </label>
                  <span className="text-xs text-[#8A928B]">Nur PDF-Dateien bis 15 MB</span>
                </div>
              </div>

              {/* Uploaded Documents List */}
              <div className="space-y-2.5">
                {(formData.documents || []).map((docItem) => {
                  const typeLabel = docItem.type === 'menu' ? '🍽️ Speisekarte'
                    : docItem.type === 'pricelist' ? '🏷️ Preisliste'
                    : docItem.type === 'flyer' ? '📰 Flyer'
                    : docItem.type === 'brochure' ? '📖 Broschüre'
                    : '📁 Dokument';

                  return (
                    <div key={docItem.id} className="bg-white border border-[#EDE8E0] rounded-lg p-3.5 flex items-center justify-between gap-3 shadow-2xs">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-lg bg-red-50 text-red-600 flex items-center justify-center shrink-0 font-bold text-xs">
                          PDF
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-sm text-[#1B211D] truncate">{docItem.title}</p>
                          <div className="flex items-center gap-2 text-xs text-[#5F6B63] mt-0.5">
                            <span className="bg-[#FAF8F5] border border-[#EDE8E0] px-2 py-0.5 rounded text-[11px] font-medium">{typeLabel}</span>
                            {docItem.fileSize && <span>{docItem.fileSize}</span>}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <a
                          href={docItem.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-semibold px-3 py-1.5 rounded-md bg-[#FAF8F5] border border-[#EDE8E0] text-[#0F4C2E] hover:bg-[#E8F1EB] transition-colors inline-flex items-center gap-1"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          Öffnen
                        </a>
                        <button
                          type="button"
                          onClick={() => handleDeleteDocument(docItem.id)}
                          className="text-xs px-2.5 py-1.5 rounded-md bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                          title="Dokument löschen"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
                {(formData.documents || []).length === 0 && (
                  <p className="text-xs text-[#8A928B] italic">Noch keine PDF-Dokumente oder Speisekarten hinterlegt.</p>
                )}
              </div>
            </div>

            {/* ─── Ausstattungs- & Besonderheiten-Badges (USPs) ── */}
            <div className="mt-8 border-t-2 border-orange-200 pt-6">
              <div>
                <h3 className="text-lg font-bold text-[#0F4C2E] flex items-center gap-2">
                  <Tag className="w-5 h-5 text-[#F2761B]" />
                  🏷️ Ausstattungs- &amp; Besonderheiten-Badges (USPs)
                </h3>
                <p className="text-sm text-[#5F6B63] mt-0.5 mb-3">
                  Wählen Sie passende Ausstattungsmerkmale und Besonderheiten für Ihr Unternehmen (z. B. Hunde erlaubt, Notdienst, Terrasse).
                </p>
              </div>

              {/* Active Badges */}
              {(formData.featureBadges || []).length > 0 && (
                <div className="mb-4 p-3 bg-white rounded-lg border border-[#EDE8E0]">
                  <span className="text-xs font-bold text-[#1B211D] block mb-2">Ausgewählte Badges:</span>
                  <div className="flex flex-wrap gap-2">
                    {(formData.featureBadges || []).map((b, idx) => (
                      <span key={idx} className="bg-[#E8F1EB] text-[#0F4C2E] font-medium text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-[#0F4C2E]/20">
                        {b}
                        <button
                          type="button"
                          onClick={() => handleToggleBadge(b)}
                          className="hover:text-red-600 ml-0.5 cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Presets */}
              <div className="space-y-3 bg-[#FAF8F5] border border-[#E7E2DA] rounded-lg p-4">
                <span className="text-xs font-bold text-[#5F6B63] uppercase tracking-wider block">Schnellauswahl nach Branche:</span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    '🐶 Hunde erlaubt',
                    '☀️ Biergarten / Terrasse',
                    '🌱 Vegan & Vegetarisch',
                    '💳 Kartenzahlung',
                    '♿ Barrierefrei',
                    '👶 Kinderfreundlich',
                    '🚨 24h Notdienst',
                    '🏆 Meisterbetrieb',
                    '📝 Kostenloses Angebot',
                    '🎿 Skikeller mit Schuhtrockner',
                    '🚴 E-Bike Ladestation',
                    '🎫 Sauerland SommerCard inklusive',
                    '🧖 Sauna & Wellness',
                    '🅿️ Kostenloser Parkplatz',
                    '🎿 Ausrüstungsverleih',
                    '🏂 Skischule vor Ort',
                    '📅 Online-Terminbuchung',
                    '💬 Kostenlose Erstberatung'
                  ].map((preset) => {
                    const isSelected = (formData.featureBadges || []).includes(preset);
                    return (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => handleToggleBadge(preset)}
                        className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#0F4C2E] text-white shadow-xs'
                            : 'bg-white text-[#4A544D] border border-[#EDE8E0] hover:border-[#0F4C2E]'
                        }`}
                      >
                        {isSelected ? '✓ ' : '+ '} {preset}
                      </button>
                    );
                  })}
                </div>

                {/* Custom Badge Input */}
                <div className="pt-3 border-t border-[#EDE8E0] flex gap-2">
                  <input
                    type="text"
                    value={newCustomBadge}
                    onChange={e => setNewCustomBadge(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddCustomBadge(); } }}
                    placeholder="Eigenes Merkmal hinzufügen (z. B. Panorama-Aussicht)..."
                    className="flex-1 border border-[#E7E2DA] rounded-md px-3 py-1.5 text-xs bg-white focus:outline-none focus:border-[#0F4C2E]"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomBadge}
                    className="px-3 py-1.5 bg-[#0F4C2E] text-white text-xs font-semibold rounded-md hover:bg-[#06301C] transition-colors"
                  >
                    Hinzufügen
                  </button>
                </div>
              </div>
            </div>

            {/* ─── Individueller Call-to-Action (Action-Button) ── */}
            <div className="mt-8 border-t-2 border-orange-200 pt-6">
              <div>
                <h3 className="text-lg font-bold text-[#0F4C2E] flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#F2761B]" />
                  🔘 Individueller Action-Button (Call-to-Action)
                </h3>
                <p className="text-sm text-[#5F6B63] mt-0.5 mb-3">
                  Heben Sie eine primäre Kundenaktion im Profil hervor (z. B. Tisch reservieren, Notdienst rufen, Termin vereinbaren).
                </p>
              </div>

              <div className="bg-[#FAF8F5] border border-[#E7E2DA] rounded-lg p-4 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#1B211D] mb-1">Aktionstyp</label>
                    <select
                      value={formData.customCta?.type || 'custom'}
                      onChange={e => setFormData({
                        ...formData,
                        customCta: {
                          text: formData.customCta?.text || '',
                          url: formData.customCta?.url || '',
                          type: e.target.value as any
                        }
                      })}
                      className="w-full border border-[#E7E2DA] rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:border-[#0F4C2E]"
                    >
                      <option value="table">🍽️ Tisch online reservieren</option>
                      <option value="emergency">🚨 24h Notdienst anrufen</option>
                      <option value="booking">📅 Termin online buchen</option>
                      <option value="rental">🎿 Ausrüstung vorbestellen</option>
                      <option value="inquiry">📝 Angebot / Anfrage</option>
                      <option value="custom">🔗 Individuelle Verlinkung</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#1B211D] mb-1">Button-Beschriftung</label>
                    <input
                      type="text"
                      value={formData.customCta?.text || ''}
                      onChange={e => setFormData({
                        ...formData,
                        customCta: {
                          url: formData.customCta?.url || '',
                          type: formData.customCta?.type || 'custom',
                          text: e.target.value
                        }
                      })}
                      placeholder="z. B. Tisch reservieren"
                      className="w-full border border-[#E7E2DA] rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:border-[#0F4C2E]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#1B211D] mb-1">Ziel-URL oder Telefonnummer</label>
                    <input
                      type="text"
                      value={formData.customCta?.url || ''}
                      onChange={e => setFormData({
                        ...formData,
                        customCta: {
                          text: formData.customCta?.text || '',
                          type: formData.customCta?.type || 'custom',
                          url: e.target.value
                        }
                      })}
                      placeholder="https://... oder tel:+49..."
                      className="w-full border border-[#E7E2DA] rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:border-[#0F4C2E]"
                    />
                  </div>
                </div>
              </div>
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
