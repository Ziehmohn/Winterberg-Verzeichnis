import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Check, X, Eye, ExternalLink, Image as ImageIcon, Upload, MousePointerClick, Megaphone, Sparkles, AlertCircle, Building2 } from 'lucide-react';
import { AdBanner, AdInquiry, Business } from '../types';
import { categories } from '../data';
import { db, storage } from '../firebase';
import { doc, setDoc, deleteDoc, updateDoc, collection, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getBusinessPath } from '../utils/routes';

interface AdminAdsManagerProps {
  ads: AdBanner[];
  setAds: React.Dispatch<React.SetStateAction<AdBanner[]>>;
  businesses?: Business[];
  currentUser?: any;
}

export default function AdminAdsManager({ ads, setAds, businesses = [], currentUser }: AdminAdsManagerProps) {
  const [subTab, setSubTab] = useState<'banners' | 'inquiries'>('banners');
  const [inquiries, setInquiries] = useState<AdInquiry[]>([]);
  const [loadingInquiries, setLoadingInquiries] = useState(false);

  // Identify business owned by logged-in user if applicable
  const userOwnedBusiness = businesses.find(b => 
    (currentUser?.businessId && b.id === currentUser.businessId) ||
    (currentUser?.uid && b.ownerId === currentUser.uid) ||
    (currentUser?.email && b.email && b.email.toLowerCase() === currentUser.email.toLowerCase())
  );

  const getProfileUrl = (b: Business) => {
    return getBusinessPath(b, 'de');
  };

  // Form State
  const [isEditing, setIsEditing] = useState(false);
  const [editingAd, setEditingAd] = useState<AdBanner | null>(null);

  const [selectedBusinessId, setSelectedBusinessId] = useState<string>('');
  const [title, setTitle] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [targetUrl, setTargetUrl] = useState('');
  const [category, setCategory] = useState('Alle');
  const [badgeText, setBadgeText] = useState('Anzeige');
  const [isActive, setIsActive] = useState(true);

  const [uploadingImage, setUploadingImage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Load Inquiries
  useEffect(() => {
    loadInquiries();
  }, []);

  const loadInquiries = async () => {
    setLoadingInquiries(true);
    try {
      const snap = await getDocs(collection(db, 'ad_inquiries'));
      const inqList: AdInquiry[] = [];
      snap.forEach((d) => inqList.push({ id: d.id, ...d.data() } as AdInquiry));
      
      // Merge with any local inquiries
      const localInquiries = JSON.parse(localStorage.getItem('local_ad_inquiries') || '[]');
      const combined = [...inqList];
      localInquiries.forEach((li: AdInquiry) => {
        if (!combined.some(c => c.id === li.id)) combined.push(li);
      });

      combined.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setInquiries(combined);
    } catch (err) {
      console.warn('Could not load ad inquiries from Firestore, using localStorage fallback', err);
      const localInquiries = JSON.parse(localStorage.getItem('local_ad_inquiries') || '[]');
      setInquiries(localInquiries);
    } finally {
      setLoadingInquiries(false);
    }
  };

  const handleOpenNew = () => {
    setEditingAd(null);
    if (userOwnedBusiness) {
      setSelectedBusinessId(userOwnedBusiness.id);
      setTitle(userOwnedBusiness.name + ' – Jetzt entdecken');
      setCompanyName(userOwnedBusiness.name);
      setCategory(userOwnedBusiness.category);
      setTargetUrl(getProfileUrl(userOwnedBusiness));
    } else {
      setSelectedBusinessId('');
      setTitle('');
      setCompanyName('');
      setCategory('Alle');
      setTargetUrl('');
    }
    setImageUrl('');
    setBadgeText('Anzeige');
    setIsActive(true);
    setFormError(null);
    setIsEditing(true);
  };

  const handleOpenEdit = (ad: AdBanner) => {
    setEditingAd(ad);
    setSelectedBusinessId(ad.businessId || '');
    setTitle(ad.title || '');
    setCompanyName(ad.companyName || '');
    setImageUrl(ad.imageUrl || '');
    setTargetUrl(ad.targetUrl || '');
    setCategory(ad.category || 'Alle');
    setBadgeText(ad.badgeText || 'Anzeige');
    setIsActive(ad.isActive);
    setFormError(null);
    setIsEditing(true);
  };

  const handleSelectBusiness = (bId: string) => {
    setSelectedBusinessId(bId);
    const bus = businesses.find(b => b.id === bId);
    if (bus) {
      setCompanyName(bus.name);
      setCategory(bus.category);
      setTargetUrl(getProfileUrl(bus));
      if (!title || title.includes('– Jetzt entdecken') || title.includes('– Anzeige') || title.includes('- Anzeige')) {
        setTitle(`${bus.name} – Jetzt entdecken`);
      }
    }
  };

  const handleToggleActive = async (ad: AdBanner) => {
    const newStatus = !ad.isActive;
    setAds((prev) => prev.map((a) => (a.id === ad.id ? { ...a, isActive: newStatus } : a)));

    try {
      await updateDoc(doc(db, 'ads', ad.id), { isActive: newStatus });
      localStorage.setItem('ads_initialized', 'true');
    } catch (err) {
      console.error('Error toggling ad status:', err);
    }
  };

  const handleDelete = async (adId: string) => {
    if (!window.confirm('Möchten Sie dieses Werbebanner wirklich löschen?')) return;

    setAds((prev) => prev.filter((a) => a.id !== adId));
    localStorage.setItem('ads_initialized', 'true');

    try {
      await deleteDoc(doc(db, 'ads', adId));
    } catch (err) {
      console.error('Error deleting ad from Firestore:', err);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setUploadingImage(true);
    setFormError(null);

    try {
      let url = '';
      try {
        const storageRef = ref(storage, `ads/${Date.now()}_${file.name}`);
        await uploadBytes(storageRef, file);
        url = await getDownloadURL(storageRef);
      } catch (storageErr) {
        console.warn('Storage upload failed, using FileReader fallback', storageErr);
        url = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      }
      setImageUrl(url);
    } catch (err: any) {
      setFormError('Fehler beim Hochladen des Bildes: ' + (err.message || err));
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !imageUrl.trim() || !targetUrl.trim()) {
      setFormError('Bitte füllen Sie Titel, Bild und Ziellink aus.');
      return;
    }

    setIsSubmitting(true);
    setFormError(null);

    const adId = editingAd?.id || 'ad_' + Date.now().toString(36);
    const adData: AdBanner = {
      id: adId,
      title: title.trim(),
      companyName: companyName.trim() || undefined,
      businessId: selectedBusinessId || undefined,
      imageUrl: imageUrl.trim(),
      targetUrl: targetUrl.trim(),
      category: category || 'Alle',
      position: 'skyscraper_right',
      isActive,
      badgeText: badgeText.trim() || 'Anzeige',
      clicks: editingAd?.clicks || 0,
      createdAt: editingAd?.createdAt || new Date().toISOString()
    };

    try {
      await setDoc(doc(db, 'ads', adId), adData, { merge: true });
      localStorage.setItem('ads_initialized', 'true');

      setAds((prev) => {
        const exists = prev.some((a) => a.id === adId);
        if (exists) {
          return prev.map((a) => (a.id === adId ? adData : a));
        }
        return [adData, ...prev];
      });

      setIsEditing(false);
    } catch (err: any) {
      console.error('Error saving ad to Firestore:', err);
      // Fallback: update local state
      setAds((prev) => {
        const exists = prev.some((a) => a.id === adId);
        if (exists) return prev.map((a) => (a.id === adId ? adData : a));
        return [adData, ...prev];
      });
      setIsEditing(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white border border-[#EDE8E0] rounded-lg p-6 shadow-[0_10px_30px_rgba(27,33,29,0.06)]">
      {/* Top Header & Subtabs */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-5 border-b border-[#F3F0EA]">
        <div>
          <div className="flex items-center gap-2">
            <Megaphone className="w-5 h-5 text-[#F2761B]" />
            <h3 className="font-display text-xl font-bold text-gray-900">
              Werbung & Skyscraper-Banner
            </h3>
          </div>
          <p className="text-sm text-[#5F6B63] mt-0.5">
            Verwalten Sie Bannerwerbung in den Kategorien und eingegangene Werbeanfragen.
          </p>
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto">
          <div className="flex bg-[#FAF8F5] border border-[#EDE8E0] rounded-md p-1">
            <button
              type="button"
              onClick={() => { setSubTab('banners'); setIsEditing(false); }}
              className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors ${
                subTab === 'banners' ? 'bg-[#0F4C2E] text-white' : 'text-[#5F6B63] hover:text-gray-900'
              }`}
            >
              Aktive Banner ({ads.length})
            </button>
            <button
              type="button"
              onClick={() => { setSubTab('inquiries'); setIsEditing(false); }}
              className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors flex items-center gap-1.5 ${
                subTab === 'inquiries' ? 'bg-[#0F4C2E] text-white' : 'text-[#5F6B63] hover:text-gray-900'
              }`}
            >
              Anfragen ({inquiries.length})
              {inquiries.filter((i) => i.status === 'new').length > 0 && (
                <span className="w-2 h-2 rounded-full bg-[#F2761B]" />
              )}
            </button>
          </div>

          {subTab === 'banners' && !isEditing && (
            <button
              type="button"
              onClick={handleOpenNew}
              className="bg-[#0F4C2E] hover:bg-[#06301C] text-white text-xs font-semibold px-4 py-2 rounded-md flex items-center gap-1.5 transition-colors shrink-0"
            >
              <Plus className="w-4 h-4" /> Neues Banner
            </button>
          )}
        </div>
      </div>

      {/* Subtab: Banners Form */}
      {isEditing ? (
        <form onSubmit={handleSave} className="space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#F3F0EA]">
            <h4 className="font-display font-bold text-lg text-gray-900">
              {editingAd ? 'Banneranzeige bearbeiten' : 'Neues Skyscraper-Banner anlegen'}
            </h4>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="text-sm text-[#5F6B63] hover:text-gray-900 font-medium"
            >
              Abbrechen
            </button>
          </div>

          {formError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {formError}
            </div>
          )}

          {/* Business Link Selection Box */}
          <div className="bg-[#FAF8F5] border border-[#E7E2DA] rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Building2 className="w-4 h-4 text-[#0F4C2E]" />
              <span className="text-xs font-bold text-[#1B211D] uppercase tracking-wider">
                Verknüpftes Unternehmensprofil <span className="text-red-500">*</span>
              </span>
            </div>

            {userOwnedBusiness ? (
              <div className="bg-white border border-[#EDE8E0] rounded-md p-3 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-sm text-[#1B211D]">{userOwnedBusiness.name}</div>
                  <div className="text-xs text-[#8A928B]">{userOwnedBusiness.category} · {userOwnedBusiness.district || 'Winterberg'}</div>
                </div>
                <span className="text-xs bg-[#E8F1EB] text-[#0F4C2E] font-bold px-2.5 py-1 rounded">
                  Ihr Unternehmen (fest verknüpft)
                </span>
              </div>
            ) : (
              <div>
                <select
                  required
                  value={selectedBusinessId}
                  onChange={(e) => handleSelectBusiness(e.target.value)}
                  className="w-full bg-white border border-[#E7E2DA] rounded-md px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-[#0F4C2E] transition-colors"
                >
                  <option value="">-- Bitte das zu bewerbende Unternehmen auswählen --</option>
                  {businesses.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name} ({b.category}{b.subcategory ? ` / ${b.subcategory}` : ''} · {b.district || 'Winterberg'})
                    </option>
                  ))}
                </select>
                <span className="text-xs text-[#5F6B63] mt-1.5 block">
                  💡 Klicks auf das Banner führen automatisch direkt auf das Profil des ausgewählten Unternehmens.
                </span>
              </div>
            )}

            {targetUrl && (
              <div className="mt-3 pt-3 border-t border-[#E7E2DA]/60 flex items-center justify-between text-xs text-[#5F6B63]">
                <span className="truncate">
                  🔗 <strong>Ziellink zum Profil:</strong> <code className="bg-white px-2 py-0.5 rounded border border-[#EDE8E0] text-[#0F4C2E] font-semibold">{targetUrl}</code>
                </span>
                <a 
                  href={targetUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-[#0F4C2E] hover:underline font-bold shrink-0 ml-2 inline-flex items-center gap-1"
                >
                  Profil ansehen <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Titel / Kampagne <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="z. B. Brauhaus Winterberg - Jetzt Tisch reservieren"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#E7E2DA] rounded-md px-3.5 py-2 text-sm text-gray-900 focus:outline-none focus:border-[#0F4C2E] focus:bg-white transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Ziel-Kategorie <span className="text-red-500">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#E7E2DA] rounded-md px-3.5 py-2 text-sm text-gray-900 focus:outline-none focus:border-[#0F4C2E] focus:bg-white transition-colors"
              >
                <option value="Alle">Alle Kategorien (Globales Banner)</option>
                {categories.map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
              <span className="text-xs text-[#8A928B] mt-1 block">
                Das Banner wird rechts neben den Betrieben in dieser Kategorie angezeigt.
              </span>
            </div>
          </div>

          {/* Banner Graphic Upload / URL */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              Banner-Grafik (Skyscraper: ca. 240x500 px bis 300x600 px) <span className="text-red-500">*</span>
            </label>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
              <div>
                <input
                  type="text"
                  placeholder="https://... oder Datei hochladen"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-[#E7E2DA] rounded-md px-3.5 py-2 text-sm text-gray-900 focus:outline-none focus:border-[#0F4C2E] focus:bg-white transition-colors mb-3"
                />

                <label className="inline-flex items-center gap-2 bg-[#FAF8F5] hover:bg-[#F3F0EA] border border-[#E7E2DA] px-4 py-2 rounded-md cursor-pointer text-xs font-semibold text-gray-700 transition-colors">
                  <Upload className="w-4 h-4 text-[#0F4C2E]" />
                  {uploadingImage ? 'Lade hoch...' : 'Grafik-Datei hochladen'}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploadingImage}
                    className="hidden"
                  />
                </label>
              </div>

              {imageUrl && (
                <div className="bg-[#FAF8F5] border border-[#EDE8E0] rounded-md p-3 flex flex-col items-center">
                  <span className="text-[11px] font-semibold text-gray-500 mb-2">Vorschau:</span>
                  <img
                    src={imageUrl}
                    alt="Vorschau"
                    className="max-w-[140px] max-h-[220px] object-cover rounded-md border border-[#E7E2DA] shadow-sm"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center pt-2">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Kennzeichnung
              </label>
              <input
                type="text"
                value={badgeText}
                onChange={(e) => setBadgeText(e.target.value)}
                placeholder="Anzeige"
                className="w-full bg-[#FAF8F5] border border-[#E7E2DA] rounded-md px-3.5 py-2 text-sm text-gray-900 focus:outline-none focus:border-[#0F4C2E] transition-colors"
              />
            </div>

            <div className="flex items-center gap-3 pt-4">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0F4C2E]" />
              </label>
              <span className="text-sm font-semibold text-gray-900">
                {isActive ? 'Banner ist aktiv (wird ausgespielt)' : 'Banner ist pausiert'}
              </span>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-[#F3F0EA]">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 rounded-md border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Abbrechen
            </button>
            <button
              type="submit"
              disabled={isSubmitting || uploadingImage}
              className="bg-[#0F4C2E] hover:bg-[#06301C] text-white text-sm font-semibold px-5 py-2 rounded-md transition-colors disabled:opacity-50 inline-flex items-center gap-2"
            >
              {isSubmitting ? 'Speichert...' : 'Banner speichern'}
            </button>
          </div>
        </form>
      ) : subTab === 'banners' ? (
        /* List of Banners */
        <div>
          {ads.length === 0 ? (
            <div className="py-12 text-center text-[#8A928B]">
              <Megaphone className="w-10 h-10 mx-auto text-gray-300 mb-3" />
              <p className="font-medium text-gray-700">Noch keine Werbebanner angelegt</p>
              <p className="text-sm text-gray-500 mt-1">
                Klicken Sie oben auf „Neues Banner“, um Ihr erstes Skyscraper-Banner zu schalten.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {ads.map((ad) => (
                <div
                  key={ad.id}
                  className={`border rounded-lg p-4 flex gap-4 transition-all ${
                    ad.isActive ? 'bg-white border-[#EDE8E0] shadow-sm' : 'bg-gray-50 border-gray-200 opacity-65'
                  }`}
                >
                  {/* Thumbnail */}
                  <div className="w-20 h-28 rounded-md bg-[#FAF8F5] border border-[#E7E2DA] overflow-hidden shrink-0 flex items-center justify-center">
                    {ad.imageUrl ? (
                      <img src={ad.imageUrl} alt={ad.title} className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="w-6 h-6 text-gray-300" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="bg-[#FAF8F5] border border-[#E7E2DA] text-[#0F4C2E] rounded px-2 py-0.5 text-[10.5px] font-bold">
                          {ad.category || 'Alle'}
                        </span>
                        <span
                          className={`rounded px-2 py-0.5 text-[10.5px] font-bold ${
                            ad.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-200 text-gray-600'
                          }`}
                        >
                          {ad.isActive ? 'Aktiv' : 'Pausiert'}
                        </span>
                      </div>

                      <h5 className="font-display font-semibold text-[15px] text-gray-900 truncate leading-snug">
                        {ad.title}
                      </h5>

                      {ad.companyName && (
                        <div className="text-xs text-[#5F6B63] truncate">{ad.companyName}</div>
                      )}

                      <a
                        href={ad.targetUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-[#D65F0C] hover:underline flex items-center gap-1 mt-1 truncate"
                      >
                        <ExternalLink className="w-3 h-3 shrink-0" />
                        {ad.targetUrl}
                      </a>
                    </div>

                    {/* Stats & Actions */}
                    <div className="flex items-center justify-between pt-2 mt-2 border-t border-[#F3F0EA]">
                      <div className="flex items-center gap-1.5 text-xs text-[#8A928B]">
                        <MousePointerClick className="w-3.5 h-3.5" />
                        <span>{ad.clicks || 0} Klicks</span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleToggleActive(ad)}
                          title={ad.isActive ? 'Deaktivieren' : 'Aktivieren'}
                          className={`p-1.5 rounded text-xs font-medium transition-colors ${
                            ad.isActive ? 'text-amber-600 hover:bg-amber-50' : 'text-emerald-600 hover:bg-emerald-50'
                          }`}
                        >
                          {ad.isActive ? <X className="w-4 h-4" /> : <Check className="w-4 h-4" />}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(ad)}
                          className="p-1.5 rounded text-gray-600 hover:bg-gray-100 transition-colors"
                          title="Bearbeiten"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(ad.id)}
                          className="p-1.5 rounded text-red-600 hover:bg-red-50 transition-colors"
                          title="Löschen"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Subtab: Inquiries */
        <div>
          {loadingInquiries ? (
            <div className="py-12 text-center text-sm text-gray-500">Lade Werbeanfragen...</div>
          ) : inquiries.length === 0 ? (
            <div className="py-12 text-center text-[#8A928B]">
              <Sparkles className="w-10 h-10 mx-auto text-gray-300 mb-3" />
              <p className="font-medium text-gray-700">Noch keine Werbeanfragen eingegangen</p>
              <p className="text-sm text-gray-500 mt-1">
                Sobald Unternehmen auf „Hier werben“ klicken und das Anfrageformular ausfüllen, erscheinen die Anfragen hier.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {inquiries.map((inq) => (
                <div
                  key={inq.id}
                  className="border border-[#EDE8E0] rounded-lg p-4 bg-white hover:border-[#0F4C2E]/40 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-2">
                    <div>
                      <span className="font-display font-bold text-base text-gray-900 mr-2">
                        {inq.companyName}
                      </span>
                      <span className="text-xs text-gray-500 font-normal">
                        ({inq.name})
                      </span>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="bg-[#FFF1E4] text-[#D65F0C] rounded px-2.5 py-0.5 text-xs font-bold">
                        {inq.categories ? `${inq.categories.length} Kat.: ${inq.categories.join(', ')}` : `Kategorie: ${inq.category}`}
                      </span>
                      {inq.totalMonthlyPrice !== undefined && (
                        <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 rounded px-2.5 py-0.5 text-xs font-bold">
                          {inq.totalMonthlyPrice.toFixed(2).replace('.', ',')} € / Mo.
                        </span>
                      )}
                      <span className="text-xs text-gray-400">
                        {new Date(inq.createdAt).toLocaleDateString('de-DE')}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 text-xs text-gray-600 mb-3">
                    <div>
                      <span className="font-semibold text-gray-700">E-Mail:</span>{' '}
                      <a href={`mailto:${inq.email}`} className="text-[#0F4C2E] hover:underline">
                        {inq.email}
                      </a>
                    </div>
                    {inq.phone && (
                      <div>
                        <span className="font-semibold text-gray-700">Telefon:</span>{' '}
                        <a href={`tel:${inq.phone}`} className="text-[#0F4C2E] hover:underline">
                          {inq.phone}
                        </a>
                      </div>
                    )}
                  </div>

                  {inq.message && (
                    <div className="bg-[#FAF8F5] rounded-md p-3 text-xs text-gray-700 leading-relaxed border border-[#E7E2DA]">
                      <span className="font-semibold block mb-1">Nachricht / Anmerkungen:</span>
                      {inq.message}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
