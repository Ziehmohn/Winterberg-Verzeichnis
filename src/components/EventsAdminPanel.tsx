import React, { useState, useMemo } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Ticket, 
  Plus, 
  Edit2, 
  Trash2, 
  Copy, 
  ExternalLink, 
  Search, 
  Filter, 
  Sparkles, 
  AlertCircle, 
  Check, 
  X, 
  Building2, 
  Image as ImageIcon, 
  Upload, 
  RefreshCw,
  Eye,
  Tag
} from 'lucide-react';
import { Business, EventItem } from '../types';
import { db, storage } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { fetchDutchTranslation } from '../utils/translator';
import { invalidateCache, bumpRemoteBusinessesVersion, CACHE_KEYS } from '../utils/dbCache';
import { slugify } from '../utils/routes';
import { normalizeEventCategory } from '../utils/eventUtils';

interface EventsAdminPanelProps {
  businesses: Business[];
  setBusinesses: React.Dispatch<React.SetStateAction<Business[]>>;
  isAdmin: boolean;
  currentUser?: any;
  allowedBusinesses: Business[];
  onRefreshBusinesses?: (force?: boolean) => Promise<void>;
}

export const EVENT_CATEGORIES = [
  'Sport',
  'Fest & Party',
  'Konzert',
  'Wandern',
  'Kultur',
  'Workshop & Kurse',
  'Comedy & Kabarett',
  'Kulinarik',
  'Märkte & Messen',
  'Familie & Kinder',
  'Neueröffnungen',
  'Sonstiges'
];

export default function EventsAdminPanel({
  businesses,
  setBusinesses,
  isAdmin,
  currentUser,
  allowedBusinesses,
  onRefreshBusinesses
}: EventsAdminPanelProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Alle');
  const [timeFilter, setTimeFilter] = useState<'all' | 'upcoming' | 'past'>('upcoming');
  const [selectedBusinessId, setSelectedBusinessId] = useState('Alle');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Edit / Form state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [targetBusinessId, setTargetBusinessId] = useState<string>('');
  const [originalBusinessId, setOriginalBusinessId] = useState<string>('');

  // Form fields
  const [title, setTitle] = useState('');
  const [titleNl, setTitleNl] = useState('');
  const [description, setDescription] = useState('');
  const [descriptionNl, setDescriptionNl] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState(EVENT_CATEGORIES[0]);
  const [customCategory, setCustomCategory] = useState('');
  const [price, setPrice] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [externalUrl, setExternalUrl] = useState('');
  const [externalUrlNl, setExternalUrlNl] = useState('');

  // Form helpers
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Default WTW / Tourist info ID for admin
  const defaultWtwId = useMemo(() => {
    const found = businesses.find(b => b.id === 'wtw' || b.name.toLowerCase().includes('winterberg touristik'));
    return found ? found.id : (businesses[0]?.id || '');
  }, [businesses]);

  // Allowed businesses to attach events to
  const selectableBusinesses = useMemo(() => {
    return isAdmin ? businesses : allowedBusinesses;
  }, [isAdmin, businesses, allowedBusinesses]);

  // Aggregate all events with their business info
  const allEventItems = useMemo(() => {
    const list: Array<{ event: EventItem; business: Business }> = [];
    const pool = isAdmin ? businesses : allowedBusinesses;
    
    pool.forEach(bus => {
      if (bus.events && Array.isArray(bus.events)) {
        bus.events.forEach(ev => {
          list.push({ event: ev, business: bus });
        });
      }
    });

    // Sort by start date ascending
    return list.sort((a, b) => new Date(a.event.startDate).getTime() - new Date(b.event.startDate).getTime());
  }, [businesses, allowedBusinesses, isAdmin]);

  // Today ISO string for upcoming/past check
  const todayStr = useMemo(() => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }, []);

  // Filtered events
  const filteredEvents = useMemo(() => {
    return allEventItems.filter(({ event, business }) => {
      // Time filter
      const eventEnd = event.endDate || event.startDate;
      if (timeFilter === 'upcoming') {
        if (eventEnd < todayStr) return false;
      } else if (timeFilter === 'past') {
        if (eventEnd >= todayStr) return false;
      }

      // Category filter
      if (selectedCategory !== 'Alle') {
        const norm = normalizeEventCategory(event.category);
        if (norm !== selectedCategory && event.category !== selectedCategory) return false;
      }

      // Business filter
      if (selectedBusinessId !== 'Alle') {
        if (business.id !== selectedBusinessId) return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle = event.title.toLowerCase().includes(q) || (event.title_nl && event.title_nl.toLowerCase().includes(q));
        const matchesBus = business.name.toLowerCase().includes(q);
        const matchesLoc = event.location && event.location.toLowerCase().includes(q);
        const matchesDesc = event.description && event.description.toLowerCase().includes(q);
        if (!matchesTitle && !matchesBus && !matchesLoc && !matchesDesc) return false;
      }

      return true;
    });
  }, [allEventItems, timeFilter, todayStr, selectedCategory, selectedBusinessId, searchQuery]);

  // Stats
  const stats = useMemo(() => {
    const total = allEventItems.length;
    const upcoming = allEventItems.filter(({ event }) => (event.endDate || event.startDate) >= todayStr).length;
    const past = total - upcoming;
    const businessesWithEvents = new Set(allEventItems.map(i => i.business.id)).size;
    return { total, upcoming, past, businessesWithEvents };
  }, [allEventItems, todayStr]);

  // Reset form
  const handleOpenCreate = () => {
    setEditingEventId(null);
    const initialBusId = selectableBusinesses[0]?.id === 'wtw' 
      ? 'wtw' 
      : (defaultWtwId || selectableBusinesses[0]?.id || '');
    setTargetBusinessId(initialBusId);
    setOriginalBusinessId('');
    setTitle('');
    setTitleNl('');
    setDescription('');
    setDescriptionNl('');
    setStartDate(todayStr);
    setEndDate('');
    setStartTime('');
    setEndTime('');
    setLocation('');
    setCategory('Fest & Party');
    setCustomCategory('');
    setPrice('');
    setImageUrl('');
    setExternalUrl('');
    setExternalUrlNl('');
    setFormError(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (item: { event: EventItem; business: Business }) => {
    const { event, business } = item;
    setEditingEventId(event.id);
    setTargetBusinessId(business.id);
    setOriginalBusinessId(business.id);
    setTitle(event.title || '');
    setTitleNl(event.title_nl || '');
    setDescription(event.description || '');
    setDescriptionNl(event.description_nl || '');
    setStartDate(event.startDate || todayStr);
    setEndDate(event.endDate || '');
    setStartTime(event.startTime || '');
    setEndTime(event.endTime || '');
    setLocation(event.location || '');
    if (EVENT_CATEGORIES.includes(event.category)) {
      setCategory(event.category);
      setCustomCategory('');
    } else {
      setCategory('Sonstiges');
      setCustomCategory(event.category || '');
    }
    setPrice(event.price || '');
    setImageUrl(event.imageUrl || '');
    setExternalUrl(event.externalUrl || '');
    setExternalUrlNl(event.externalUrl_nl || '');
    setFormError(null);
    setIsFormOpen(true);
  };

  const handleDuplicate = (item: { event: EventItem; business: Business }) => {
    const { event, business } = item;
    setEditingEventId(null);
    setTargetBusinessId(business.id);
    setOriginalBusinessId('');
    setTitle(`${event.title} (Kopie)`);
    setTitleNl(event.title_nl ? `${event.title_nl} (Kopie)` : '');
    setDescription(event.description || '');
    setDescriptionNl(event.description_nl || '');
    setStartDate(event.startDate || todayStr);
    setEndDate(event.endDate || '');
    setStartTime(event.startTime || '');
    setEndTime(event.endTime || '');
    setLocation(event.location || '');
    if (EVENT_CATEGORIES.includes(event.category)) {
      setCategory(event.category);
      setCustomCategory('');
    } else {
      setCategory('Sonstiges');
      setCustomCategory(event.category || '');
    }
    setPrice(event.price || '');
    setImageUrl(event.imageUrl || '');
    setExternalUrl(event.externalUrl || '');
    setExternalUrlNl(event.externalUrl_nl || '');
    setFormError(null);
    setIsFormOpen(true);
  };

  const handleAutoTranslate = async () => {
    if (!title.trim() && !description.trim()) {
      setFormError('Bitte zuerst einen deutschen Titel oder eine Beschreibung eingeben.');
      return;
    }
    setIsTranslating(true);
    setFormError(null);
    try {
      if (title.trim()) {
        const trTitle = await fetchDutchTranslation(title.trim(), 'de', 'nl');
        setTitleNl(trTitle);
      }
      if (description.trim()) {
        const trDesc = await fetchDutchTranslation(description.trim(), 'de', 'nl');
        setDescriptionNl(trDesc);
      }
    } catch (err: any) {
      console.error('Translation error:', err);
      setFormError('Fehler bei der Übersetzung: ' + (err.message || err));
    } finally {
      setIsTranslating(false);
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
        const storageRef = ref(storage, `events/${Date.now()}_${file.name}`);
        await uploadBytes(storageRef, file);
        url = await getDownloadURL(storageRef);
      } catch (storageErr) {
        console.warn('Storage upload fallback to FileReader', storageErr);
        url = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      }
      setImageUrl(url);
    } catch (err: any) {
      setFormError('Fehler beim Hochladen: ' + (err.message || err));
    } finally {
      setUploadingImage(false);
    }
  };

  const handleDeleteEvent = async (eventItem: EventItem, busId: string) => {
    if (!confirm(`Möchten Sie das Event "${eventItem.title}" wirklich unwiderruflich löschen?`)) {
      return;
    }

    try {
      const bus = businesses.find(b => b.id === busId);
      if (!bus) return;

      const updatedEvents = (bus.events || []).filter(ev => ev.id !== eventItem.id);

      // Save to Firestore
      await setDoc(doc(db, 'businesses', bus.id), { events: updatedEvents }, { merge: true });
      await bumpRemoteBusinessesVersion(db);
      invalidateCache(CACHE_KEYS.BUSINESSES);

      // Update state
      setBusinesses(prev => prev.map(b => b.id === bus.id ? { ...b, events: updatedEvents } : b));
      setSuccessMessage(`Event "${eventItem.title}" wurde erfolgreich gelöscht.`);
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err: any) {
      console.error('Error deleting event:', err);
      alert('Fehler beim Löschen des Events: ' + (err.message || err));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setFormError('Bitte einen Titel angeben.');
      return;
    }
    if (!startDate) {
      setFormError('Bitte ein Startdatum angeben.');
      return;
    }
    if (!targetBusinessId) {
      setFormError('Bitte ein Unternehmen zuordnen.');
      return;
    }

    setIsSubmitting(true);
    setFormError(null);

    try {
      const effectiveCategory = (category === 'Sonstiges' && customCategory.trim()) 
        ? customCategory.trim() 
        : category;

      const targetBus = businesses.find(b => b.id === targetBusinessId);
      if (!targetBus) {
        throw new Error('Das ausgewählte Unternehmen konnte nicht gefunden werden.');
      }

      const eventId = editingEventId || (slugify(title) + '-' + Date.now().toString(36));

      const eventData: EventItem = {
        id: eventId,
        title: title.trim(),
        title_nl: titleNl.trim() || undefined,
        description: description.trim(),
        description_nl: descriptionNl.trim() || undefined,
        startDate: startDate,
        endDate: endDate.trim() ? endDate : undefined,
        startTime: startTime.trim() || undefined,
        endTime: endTime.trim() || undefined,
        location: location.trim() || undefined,
        category: effectiveCategory,
        price: price.trim() || undefined,
        imageUrl: imageUrl.trim() || undefined,
        externalUrl: externalUrl.trim() || undefined,
        externalUrl_nl: externalUrlNl.trim() || undefined,
        isPremium: targetBus.isPremium
      };

      // Handle re-assignment if business changed
      const isReassigned = originalBusinessId && originalBusinessId !== targetBusinessId;

      let newTargetEvents: EventItem[];
      if (editingEventId && !isReassigned) {
        newTargetEvents = (targetBus.events || []).map(ev => ev.id === editingEventId ? eventData : ev);
      } else {
        newTargetEvents = [...(targetBus.events || []).filter(ev => ev.id !== eventId), eventData];
      }

      // 1. Update target business in Firestore
      await setDoc(doc(db, 'businesses', targetBus.id), { events: newTargetEvents }, { merge: true });

      // 2. If reassigned, remove from original business
      let originalUpdatedEvents: EventItem[] | null = null;
      if (isReassigned) {
        const origBus = businesses.find(b => b.id === originalBusinessId);
        if (origBus) {
          originalUpdatedEvents = (origBus.events || []).filter(ev => ev.id !== editingEventId);
          await setDoc(doc(db, 'businesses', origBus.id), { events: originalUpdatedEvents }, { merge: true });
        }
      }

      await bumpRemoteBusinessesVersion(db);
      invalidateCache(CACHE_KEYS.BUSINESSES);

      // 3. Update React state
      setBusinesses(prev => prev.map(b => {
        if (b.id === targetBus.id) {
          return { ...b, events: newTargetEvents };
        }
        if (isReassigned && b.id === originalBusinessId && originalUpdatedEvents) {
          return { ...b, events: originalUpdatedEvents };
        }
        return b;
      }));

      setSuccessMessage(`Event "${eventData.title}" wurde erfolgreich gespeichert.`);
      setTimeout(() => setSuccessMessage(null), 4000);
      setIsFormOpen(false);
      setEditingEventId(null);
    } catch (err: any) {
      console.error('Error saving event:', err);
      setFormError('Fehler beim Speichern: ' + (err.message || err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-[#EDE8E0] rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 rounded-xl bg-purple-50 text-purple-700 border border-purple-100 inline-flex">
              <Calendar className="w-5 h-5" />
            </span>
            <h1 className="font-display text-xl sm:text-2xl font-bold text-[#1B211D]">
              Events & Terminkalender
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-[#5F6B63] max-w-2xl">
            Verwalten Sie Veranstaltungen, Feste, Konzerte und Workshops im Winterberg-Kalender. Events werden den Profilen der Veranstalter zugeordnet und auf der Events-Seite präsentiert.
          </p>
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto shrink-0 flex-wrap">
          {onRefreshBusinesses && (
            <button
              type="button"
              onClick={async () => {
                setIsRefreshing(true);
                try {
                  await onRefreshBusinesses(true);
                } finally {
                  setIsRefreshing(false);
                }
              }}
              disabled={isRefreshing}
              className="px-3.5 py-2.5 rounded-xl border border-[#EDE8E0] hover:border-[#0F4C2E] text-xs font-semibold text-[#1B211D] bg-[#FAF8F5] hover:bg-white transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              title="Daten aktualisieren"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#0F4C2E]' : ''}`} />
              <span className="hidden sm:inline">Aktualisieren</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleOpenCreate}
            className="px-4 py-2.5 rounded-xl bg-[#0F4C2E] hover:bg-[#06301C] text-white text-xs sm:text-sm font-bold transition-all shadow-sm hover:shadow-md cursor-pointer flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Neues Event erstellen</span>
          </button>
        </div>
      </div>

      {/* Success alert */}
      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-sm font-semibold flex items-center gap-2.5 shadow-xs">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white border border-[#EDE8E0] rounded-xl p-3.5 shadow-2xs">
          <div className="text-xs text-[#5F6B63] font-medium">Gesamt Termine</div>
          <div className="text-xl sm:text-2xl font-bold text-[#1B211D] mt-0.5">{stats.total}</div>
        </div>
        <div className="bg-white border border-[#EDE8E0] rounded-xl p-3.5 shadow-2xs">
          <div className="text-xs text-purple-700 font-medium">Anstehend ab heute</div>
          <div className="text-xl sm:text-2xl font-bold text-purple-800 mt-0.5">{stats.upcoming}</div>
        </div>
        <div className="bg-white border border-[#EDE8E0] rounded-xl p-3.5 shadow-2xs">
          <div className="text-xs text-gray-500 font-medium">Vergangene Termine</div>
          <div className="text-xl sm:text-2xl font-bold text-gray-700 mt-0.5">{stats.past}</div>
        </div>
        <div className="bg-white border border-[#EDE8E0] rounded-xl p-3.5 shadow-2xs">
          <div className="text-xs text-[#0F4C2E] font-medium">Veranstalter / Betriebe</div>
          <div className="text-xl sm:text-2xl font-bold text-[#0F4C2E] mt-0.5">{stats.businessesWithEvents}</div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white border border-[#EDE8E0] rounded-2xl p-4 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
          {/* Search Input */}
          <div className="lg:col-span-5 relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Event, Betrieb, Ort oder Suchbegriff..."
              className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm bg-[#FAF8F5] border border-[#E7E2DA] rounded-xl focus:bg-white focus:outline-none focus:border-[#0F4C2E] text-[#1B211D]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 rounded-full cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Time Filter */}
          <div className="lg:col-span-3">
            <select
              value={timeFilter}
              onChange={e => setTimeFilter(e.target.value as any)}
              className="w-full py-2 px-3 text-xs sm:text-sm bg-[#FAF8F5] border border-[#E7E2DA] rounded-xl focus:bg-white focus:outline-none focus:border-[#0F4C2E] text-[#1B211D] font-medium cursor-pointer"
            >
              <option value="upcoming">Nur ab heute / anstehende ({stats.upcoming})</option>
              <option value="all">Alle Termine anzeigen ({stats.total})</option>
              <option value="past">Nur vergangene Termine ({stats.past})</option>
            </select>
          </div>

          {/* Category Filter */}
          <div className="lg:col-span-2">
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="w-full py-2 px-3 text-xs sm:text-sm bg-[#FAF8F5] border border-[#E7E2DA] rounded-xl focus:bg-white focus:outline-none focus:border-[#0F4C2E] text-[#1B211D] font-medium cursor-pointer"
            >
              <option value="Alle">Alle Kategorien</option>
              {EVENT_CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Business Filter (if admin) */}
          <div className="lg:col-span-2">
            <select
              value={selectedBusinessId}
              onChange={e => setSelectedBusinessId(e.target.value)}
              className="w-full py-2 px-3 text-xs sm:text-sm bg-[#FAF8F5] border border-[#E7E2DA] rounded-xl focus:bg-white focus:outline-none focus:border-[#0F4C2E] text-[#1B211D] font-medium cursor-pointer truncate"
            >
              <option value="Alle">Alle Betriebe</option>
              {selectableBusinesses.map(b => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick Reset */}
        {(searchQuery || selectedCategory !== 'Alle' || timeFilter !== 'upcoming' || selectedBusinessId !== 'Alle') && (
          <div className="flex items-center justify-between text-xs pt-2 border-t border-[#F0EBE1]">
            <span className="text-[#5F6B63]">
              {filteredEvents.length} {filteredEvents.length === 1 ? 'Event gefunden' : 'Events gefunden'}
            </span>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('Alle');
                setTimeFilter('upcoming');
                setSelectedBusinessId('Alle');
              }}
              className="font-semibold text-purple-700 hover:text-purple-900 cursor-pointer flex items-center gap-1"
            >
              <X className="w-3 h-3" />
              <span>Filter zurücksetzen</span>
            </button>
          </div>
        )}
      </div>

      {/* Events Listing */}
      {filteredEvents.length === 0 ? (
        <div className="bg-white border border-dashed border-[#D8D2C8] rounded-2xl p-12 text-center text-[#5F6B63]">
          <Calendar className="w-10 h-10 mx-auto text-[#8A958E] mb-3" />
          <h3 className="text-base font-bold text-[#1B211D] mb-1">Keine Veranstaltungen gefunden</h3>
          <p className="text-xs sm:text-sm text-[#717E75] max-w-md mx-auto mb-4">
            Für die gewählten Filter liegen keine Termine vor. Passen Sie die Suche an oder erstellen Sie ein neues Event.
          </p>
          <button
            type="button"
            onClick={handleOpenCreate}
            className="px-4 py-2 bg-[#0F4C2E] text-white text-xs font-bold rounded-lg hover:bg-[#06301C] transition-colors cursor-pointer inline-flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Jetzt Event eintragen</span>
          </button>
        </div>
      ) : (
        <div className="space-y-3.5">
          {filteredEvents.map(({ event, business }) => {
            const isPast = (event.endDate || event.startDate) < todayStr;
            const normCat = normalizeEventCategory(event.category);

            return (
              <div 
                key={`${business.id}-${event.id}`}
                className={`bg-white border rounded-2xl p-4 sm:p-5 transition-all shadow-2xs hover:shadow-md flex flex-col md:flex-row items-start justify-between gap-4 ${
                  isPast ? 'border-gray-200 bg-gray-50/50 opacity-80' : 'border-[#EDE8E0] hover:border-[#D8D2C8]'
                }`}
              >
                {/* Left: Thumbnail & Details */}
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  {/* Event Thumbnail */}
                  {event.imageUrl ? (
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden border border-[#EDE8E0] bg-gray-100 shrink-0">
                      <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover" />
                    </div>
                  ) : business.logoUrl ? (
                    <div 
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl border border-[#EDE8E0] p-1.5 flex items-center justify-center shrink-0 shadow-2xs"
                      style={{ backgroundColor: business.logoBgColor || '#ffffff' }}
                    >
                      <img src={business.logoUrl} alt={business.name} className="max-w-full max-h-full object-contain" />
                    </div>
                  ) : (
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-purple-50 border border-purple-100 text-purple-700 flex flex-col items-center justify-center shrink-0">
                      <Calendar className="w-6 h-6" />
                    </div>
                  )}

                  <div className="flex-1 min-w-0 space-y-1.5">
                    {/* Badges row */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-100 text-purple-800 border border-purple-200">
                        {normCat}
                      </span>

                      {isPast ? (
                        <span className="px-2 py-0.5 rounded-full text-[10.5px] font-bold bg-gray-200 text-gray-700">
                          Vergangen
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10.5px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                          Aktiv / Bevorstehend
                        </span>
                      )}

                      {event.title_nl ? (
                        <span className="px-2 py-0.5 rounded-full text-[10.5px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                          🇳🇱 NL
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10.5px] font-medium bg-amber-50 text-amber-700 border border-amber-200">
                          NL fehlt
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="text-base sm:text-lg font-bold text-[#1B211D] leading-snug">
                      {event.title}
                    </h3>

                    {/* Dates, Time, Location & Business */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-[#5F6B63]">
                      <span className="flex items-center gap-1.5 font-semibold text-[#1B211D]">
                        <Calendar className="w-3.5 h-3.5 text-purple-700" />
                        <span>
                          {new Date(event.startDate + 'T00:00:00').toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                          {event.endDate && event.endDate !== event.startDate && ` – ${new Date(event.endDate + 'T00:00:00').toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })}`}
                        </span>
                      </span>

                      {(event.startTime || event.endTime) && (
                        <span className="flex items-center gap-1 font-medium">
                          <Clock className="w-3.5 h-3.5 text-gray-400" />
                          <span>{event.startTime || '?'}{event.endTime ? ` – ${event.endTime}` : ' Uhr'}</span>
                        </span>
                      )}

                      {event.location && (
                        <span className="flex items-center gap-1 font-medium text-[#0F4C2E]">
                          <MapPin className="w-3.5 h-3.5 text-[#0F4C2E]" />
                          <span>{event.location}</span>
                        </span>
                      )}

                      {event.price && (
                        <span className="flex items-center gap-1 font-medium bg-[#FAF8F5] px-2 py-0.5 rounded border border-[#EDE8E0]">
                          <Ticket className="w-3 h-3 text-purple-700" />
                          <span>{event.price}</span>
                        </span>
                      )}
                    </div>

                    {/* Associated Business */}
                    <div className="flex items-center gap-2 pt-1 text-xs text-[#5F6B63]">
                      <span className="text-gray-400">Veranstalter:</span>
                      <div className="inline-flex items-center gap-1.5 font-semibold text-[#0F4C2E]">
                        {business.logoUrl && (
                          <img 
                            src={business.logoUrl} 
                            alt={business.name} 
                            className="w-4 h-4 rounded object-contain bg-white border border-[#EDE8E0]" 
                          />
                        )}
                        <span>{business.name}</span>
                      </div>
                    </div>

                    {/* Description preview */}
                    {event.description && (
                      <p className="text-xs text-[#717E75] line-clamp-2 pt-1 leading-relaxed">
                        {event.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex sm:flex-col items-center sm:items-stretch gap-2 shrink-0 self-stretch sm:self-auto w-full sm:w-auto md:w-36 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#F0EBE1]">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit({ event, business })}
                    className="flex-1 sm:flex-initial py-2 px-3 rounded-lg bg-[#0F4C2E] hover:bg-[#06301C] text-white text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Bearbeiten</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDuplicate({ event, business })}
                    className="flex-1 sm:flex-initial py-2 px-3 rounded-lg bg-[#FAF8F5] hover:bg-[#EBE5DB] text-[#1B211D] border border-[#E7E2DA] text-xs font-semibold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                    title="Als Vorlage duplizieren"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Duplizieren</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteEvent(event, business.id)}
                    className="p-2 sm:py-2 sm:px-3 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 text-xs font-semibold transition-colors cursor-pointer flex items-center justify-center gap-1.5 border border-red-200"
                    title="Event löschen"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Löschen</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit / Create Event Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-[#EDE8E0] my-8 max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#EDE8E0] mb-5 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 border border-purple-100 flex items-center justify-center">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-display text-lg sm:text-xl font-bold text-[#1B211D]">
                    {editingEventId ? 'Event bearbeiten' : 'Neues Event anlegen'}
                  </h2>
                  <p className="text-xs text-[#5F6B63]">
                    {editingEventId ? 'Aktualisieren Sie die Details dieser Veranstaltung' : 'Veröffentlichen Sie einen neuen Termin im Stadtkalender'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => { setIsFormOpen(false); setEditingEventId(null); }}
                className="p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Error banner */}
            {formError && (
              <div className="mb-4 p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            {/* Form Scroll Area */}
            <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto pr-1 flex-1">
              {/* Title DE */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Titel der Veranstaltung (Deutsch) *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="z. B. Winterberger Frühlingsfest oder Rodel-Weltcup"
                  className="w-full px-3.5 py-2.5 bg-white border border-[#D5D0C5] rounded-xl text-sm font-semibold text-[#1B211D] focus:outline-none focus:ring-2 focus:ring-[#0F4C2E]/20 focus:border-[#0F4C2E]"
                />
              </div>

              {/* Title NL */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-[#0F4C2E] uppercase tracking-wider">
                    Titel (Niederländisch) 🇳🇱
                  </label>
                  <span className="text-[11px] text-gray-400">Optional (wird auf niederländischer Seite angezeigt)</span>
                </div>
                <input
                  type="text"
                  value={titleNl}
                  onChange={e => setTitleNl(e.target.value)}
                  placeholder="Niederländische Übersetzung..."
                  className="w-full px-3.5 py-2 bg-[#F7FAF8] border border-[#D5D0C5] rounded-xl text-sm text-[#1B211D] focus:outline-none focus:border-[#0F4C2E]"
                />
              </div>

              {/* Associated Business & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-[#0F4C2E]" />
                    <span>Zugeordnetes Unternehmen *</span>
                  </label>
                  <select
                    required
                    value={targetBusinessId}
                    onChange={e => setTargetBusinessId(e.target.value)}
                    className="w-full px-3.5 py-2 bg-white border border-[#D5D0C5] rounded-xl text-xs sm:text-sm text-[#1B211D] font-medium focus:outline-none focus:border-[#0F4C2E] cursor-pointer"
                  >
                    {selectableBusinesses.map(b => (
                      <option key={b.id} value={b.id}>
                        {b.name} ({b.district || 'Winterberg'})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-purple-700" />
                    <span>Kategorie *</span>
                  </label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2 bg-white border border-[#D5D0C5] rounded-xl text-xs sm:text-sm text-[#1B211D] font-medium focus:outline-none focus:border-[#0F4C2E] cursor-pointer"
                  >
                    {EVENT_CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  {category === 'Sonstiges' && (
                    <input
                      type="text"
                      value={customCategory}
                      onChange={e => setCustomCategory(e.target.value)}
                      placeholder="Eigene Kategorie eingeben..."
                      className="mt-2 w-full px-3 py-1.5 text-xs border border-[#D5D0C5] rounded-lg focus:outline-none focus:border-[#0F4C2E]"
                    />
                  )}
                </div>
              </div>

              {/* Dates & Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Startdatum *
                  </label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={e => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#D5D0C5] rounded-xl text-xs sm:text-sm text-[#1B211D] font-medium focus:outline-none focus:border-[#0F4C2E] cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Enddatum (optional)
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    min={startDate || undefined}
                    onChange={e => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#D5D0C5] rounded-xl text-xs sm:text-sm text-[#1B211D] font-medium focus:outline-none focus:border-[#0F4C2E] cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Beginn (Uhrzeit)
                  </label>
                  <input
                    type="text"
                    value={startTime}
                    onChange={e => setStartTime(e.target.value)}
                    placeholder="z. B. 18:00"
                    className="w-full px-3 py-2 bg-white border border-[#D5D0C5] rounded-xl text-xs sm:text-sm text-[#1B211D] focus:outline-none focus:border-[#0F4C2E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Ende (Uhrzeit)
                  </label>
                  <input
                    type="text"
                    value={endTime}
                    onChange={e => setEndTime(e.target.value)}
                    placeholder="z. B. 22:30"
                    className="w-full px-3 py-2 bg-white border border-[#D5D0C5] rounded-xl text-xs sm:text-sm text-[#1B211D] focus:outline-none focus:border-[#0F4C2E]"
                  />
                </div>
              </div>

              {/* Location & Price */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#0F4C2E]" />
                    <span>Veranstaltungsort</span>
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                    placeholder="z. B. Marktplatz Winterberg oder Halle 3"
                    className="w-full px-3.5 py-2 bg-white border border-[#D5D0C5] rounded-xl text-xs sm:text-sm text-[#1B211D] focus:outline-none focus:border-[#0F4C2E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <Ticket className="w-3.5 h-3.5 text-purple-700" />
                    <span>Eintritt / Preis</span>
                  </label>
                  <input
                    type="text"
                    value={price}
                    onChange={e => setPrice(e.target.value)}
                    placeholder="z. B. Kostenlos, Eintritt frei oder 15,00 €"
                    className="w-full px-3.5 py-2 bg-white border border-[#D5D0C5] rounded-xl text-xs sm:text-sm text-[#1B211D] focus:outline-none focus:border-[#0F4C2E]"
                  />
                </div>
              </div>

              {/* Image Upload / URL */}
              <div className="bg-[#FAF8F5] border border-[#E7E2DA] rounded-2xl p-4 space-y-3">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-purple-700" />
                  <span>Veranstaltungsbild (Titelbild)</span>
                </label>

                {imageUrl ? (
                  <div className="relative w-full h-36 rounded-xl overflow-hidden border border-[#D5D0C5] bg-gray-100 flex items-center justify-center">
                    <img src={imageUrl} alt="Event Vorschau" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setImageUrl('')}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-white/90 hover:bg-white text-red-600 shadow-md cursor-pointer"
                      title="Bild entfernen"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <label className="border-2 border-dashed border-[#D5D0C5] hover:border-[#0F4C2E] bg-white rounded-xl p-4 text-center cursor-pointer transition-colors flex flex-col items-center justify-center">
                      <Upload className={`w-5 h-5 text-gray-400 mb-1 ${uploadingImage ? 'animate-bounce text-[#0F4C2E]' : ''}`} />
                      <span className="text-xs font-semibold text-[#1B211D]">
                        {uploadingImage ? 'Wird hochgeladen...' : 'Bild vom Computer wählen'}
                      </span>
                      <span className="text-[11px] text-gray-400 mt-0.5">JPG, PNG, WebP</span>
                      <input
                        type="file"
                        accept="image/*"
                        disabled={uploadingImage}
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>

                    <div className="bg-white border border-[#D5D0C5] rounded-xl p-3 flex flex-col justify-center">
                      <span className="text-xs font-semibold text-gray-700 mb-1">Oder direkte Bild-URL:</span>
                      <input
                        type="url"
                        value={imageUrl}
                        onChange={e => setImageUrl(e.target.value)}
                        placeholder="https://..."
                        className="w-full px-2.5 py-1.5 text-xs border border-[#E7E2DA] rounded-lg focus:outline-none focus:border-[#0F4C2E]"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* External URL */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <ExternalLink className="w-3.5 h-3.5 text-[#0F4C2E]" />
                    <span>Weblink / Ticket-Shop (Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={externalUrl}
                    onChange={e => setExternalUrl(e.target.value)}
                    placeholder="https://... oder mailto:..."
                    className="w-full px-3.5 py-2 bg-white border border-[#D5D0C5] rounded-xl text-xs sm:text-sm text-[#1B211D] focus:outline-none focus:border-[#0F4C2E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0F4C2E] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <ExternalLink className="w-3.5 h-3.5 text-[#0F4C2E]" />
                    <span>Weblink (NL) 🇳🇱</span>
                  </label>
                  <input
                    type="text"
                    value={externalUrlNl}
                    onChange={e => setExternalUrlNl(e.target.value)}
                    placeholder="Niederländischer Link (falls vorhanden)..."
                    className="w-full px-3.5 py-2 bg-[#F7FAF8] border border-[#D5D0C5] rounded-xl text-xs sm:text-sm text-[#1B211D] focus:outline-none focus:border-[#0F4C2E]"
                  />
                </div>
              </div>

              {/* Description DE */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Beschreibung (Deutsch)
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Beschreiben Sie das Programm, Highlights, Zielgruppe, besondere Hinweise..."
                  className="w-full px-3.5 py-2.5 bg-white border border-[#D5D0C5] rounded-xl text-xs sm:text-sm text-[#1B211D] focus:outline-none focus:ring-2 focus:ring-[#0F4C2E]/20 focus:border-[#0F4C2E] leading-relaxed"
                />
              </div>

              {/* Description NL + Auto Translate Button */}
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 mb-1.5">
                  <label className="block text-xs font-bold text-[#0F4C2E] uppercase tracking-wider">
                    Beschreibung (Niederländisch) 🇳🇱
                  </label>
                  <button
                    type="button"
                    onClick={handleAutoTranslate}
                    disabled={isTranslating}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-[#0F4C2E] text-xs font-bold border border-emerald-200 transition-colors cursor-pointer disabled:opacity-50 self-start sm:self-auto"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#0F4C2E]" />
                    <span>{isTranslating ? 'Übersetze via KI...' : '⚡ Automatisch ins Niederländische übersetzen'}</span>
                  </button>
                </div>
                <textarea
                  rows={3}
                  value={descriptionNl}
                  onChange={e => setDescriptionNl(e.target.value)}
                  placeholder="Niederländische Beschreibung..."
                  className="w-full px-3.5 py-2.5 bg-[#F7FAF8] border border-[#D5D0C5] rounded-xl text-xs sm:text-sm text-[#1B211D] focus:outline-none focus:border-[#0F4C2E] leading-relaxed"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-[#EDE8E0] flex items-center justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => { setIsFormOpen(false); setEditingEventId(null); }}
                  className="px-4 py-2.5 rounded-xl border border-[#D5D0C5] hover:bg-gray-50 text-xs sm:text-sm font-semibold text-gray-700 transition-colors cursor-pointer"
                >
                  Abbrechen
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-[#0F4C2E] hover:bg-[#06301C] text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2"
                >
                  {isSubmitting && <RefreshCw className="w-4 h-4 animate-spin" />}
                  <span>{editingEventId ? 'Änderungen speichern' : 'Event veröffentlichen'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
