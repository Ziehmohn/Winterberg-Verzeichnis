import React, { useState, useEffect, useMemo } from 'react';
import { 
  Hammer, 
  MapPin, 
  Clock, 
  Search, 
  Filter, 
  X, 
  Plus, 
  Phone, 
  Mail, 
  Lock, 
  Unlock, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Building2, 
  ArrowLeft, 
  Share2, 
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Calendar,
  Check,
  Info
} from 'lucide-react';
import { Business, ThemeConfig, TenderProject, TenderTimeframe } from '../types';
import { useAuth } from '../AuthContext';
import { isAdminEmail } from '../utils/admin';
import { 
  fetchActiveTenders, 
  updateTenderStatus, 
  recordTenderContactUnlock, 
  formatTimeframe,
  IS_PILOT_PHASE
} from '../services/tenderService';
import { SITE } from '../config';
import SubmitTenderModal from './SubmitTenderModal';

interface AuftragsboerseProps {
  businesses: Business[];
  theme: ThemeConfig;
  activeThemeKey: string;
  onBusinessSelect?: (b: Business) => void;
  onNavigatePricing?: () => void;
  onBack: () => void;
}

const SUBCATEGORIES_FILTER = [
  'Alle Gewerke',
  'Test',
  'Heizungstechnik',
  'Dachdecker',
  'Elektriker',
  'Schreinereien',
  'Maler & Lackierer',
  'Bauunternehmen',
  'Gartenbauer',
  'Bäderstudios',
  'Sonstiges Handwerk'
];

export default function Auftragsboerse({
  businesses,
  theme,
  activeThemeKey,
  onBusinessSelect,
  onNavigatePricing,
  onBack
}: AuftragsboerseProps) {
  const { currentUser, userProfile } = useAuth();
  
  // Tenders State
  const [tenders, setTenders] = useState<TenderProject[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('Alle Gewerke');
  const [selectedDistrict, setSelectedDistrict] = useState('Alle Ortsteile');
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>('Alle');

  // Modals
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [selectedTenderDetail, setSelectedTenderDetail] = useState<TenderProject | null>(null);
  const [activeImagePreview, setActiveImagePreview] = useState<string | null>(null);
  
  // Management Modal (for customer closing/managing tender)
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [manageTenderId, setManageTenderId] = useState('');
  const [manageTokenInput, setManageTokenInput] = useState('');
  const [manageMessage, setManageMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [manageLoading, setManageLoading] = useState(false);

  // Track locally unlocked contacts
  const [locallyUnlocked, setLocallyUnlocked] = useState<Record<string, boolean>>({});

  // Determine if viewer is Admin or has Premium Business
  const isAdmin = useMemo(() => {
    return userProfile?.role === 'admin' || isAdminEmail(currentUser?.email);
  }, [currentUser?.email, userProfile?.role]);

  const userPremiumBusiness = useMemo(() => {
    if (!currentUser) return null;
    const currentUid = currentUser.uid;
    const normalizedEmail = (currentUser.email || '').toLowerCase().trim();
    const ownerBusinessId = userProfile?.businessId || (userProfile as any)?.ownedBusinessId;

    return businesses.find(b => {
      const isOwned = (ownerBusinessId && b.id === ownerBusinessId) ||
                      (currentUid && b.ownerId === currentUid) ||
                      (normalizedEmail && b.ownerEmail && b.ownerEmail.toLowerCase() === normalizedEmail) ||
                      (normalizedEmail && b.email && b.email.toLowerCase() === normalizedEmail);
      return isOwned && b.isPremium;
    }) || null;
  }, [currentUser, userProfile, businesses]);

  const isUserPremium = isAdmin || !!userPremiumBusiness;

  // Load tenders on mount
  useEffect(() => {
    loadTenders();
  }, []);

  // Check URL parameters for direct management link (e.g. ?manage=ID&token=TOKEN)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const mId = params.get('manage');
    const mTok = params.get('token');
    if (mId && mTok) {
      setManageTenderId(mId);
      setManageTokenInput(mTok);
      setIsManageModalOpen(true);
    }
  }, []);

  const loadTenders = async () => {
    setLoading(true);
    const data = await fetchActiveTenders();
    setTenders(data);
    setLoading(false);
  };

  const handleTenderCreated = (newTender: TenderProject) => {
    setTenders(prev => [newTender, ...prev]);
  };

  // Filtered Tenders
  const filteredTenders = useMemo(() => {
    return tenders.filter(t => {
      if (t.status !== 'active') return false;

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = t.title.toLowerCase().includes(q);
        const matchesDesc = t.description.toLowerCase().includes(q);
        const matchesDist = t.district.toLowerCase().includes(q);
        const matchesSub = t.subcategory.toLowerCase().includes(q);
        if (!matchesTitle && !matchesDesc && !matchesDist && !matchesSub) return false;
      }

      // Subcategory
      if (selectedSubcategory !== 'Alle Gewerke' && t.subcategory !== selectedSubcategory) {
        return false;
      }

      // District
      if (selectedDistrict !== 'Alle Ortsteile' && t.district !== selectedDistrict) {
        return false;
      }

      // Timeframe
      if (selectedTimeframe !== 'Alle' && t.timeframe !== selectedTimeframe) {
        return false;
      }

      return true;
    });
  }, [tenders, searchQuery, selectedSubcategory, selectedDistrict, selectedTimeframe]);

  const handleUnlockContact = (tender: TenderProject) => {
    if (!isUserPremium && !IS_PILOT_PHASE) {
      if (onNavigatePricing) {
        onNavigatePricing();
      } else {
        alert('Die Kontaktdaten von Ausschreibungen sind exklusiv für Premium-Partner zugänglich.');
      }
      return;
    }

    setLocallyUnlocked(prev => ({ ...prev, [tender.id]: true }));
    const idTag = userPremiumBusiness ? userPremiumBusiness.id : (currentUser?.uid || 'pilot-lead-user');
    recordTenderContactUnlock(tender.id, idTag);
  };

  // Handle Close / Complete tender
  const handleCloseTenderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manageTenderId || (!manageTokenInput && !isAdmin)) return;

    setManageLoading(true);
    setManageMessage(null);

    const res = await updateTenderStatus(manageTenderId, 'completed', manageTokenInput.trim(), isAdmin);
    setManageLoading(false);

    if (res.success) {
      setManageMessage({ type: 'success', text: 'Der Auftrag wurde erfolgreich als vergeben markiert und aus der Börse entfernt.' });
      setTenders(prev => prev.filter(t => t.id !== manageTenderId));
      setTimeout(() => {
        setIsManageModalOpen(false);
        setManageMessage(null);
        setManageTenderId('');
        setManageTokenInput('');
      }, 2500);
    } else {
      setManageMessage({ type: 'error', text: res.error || 'Fehler beim Schließen des Auftrags. Bitte prüfen Sie den Code.' });
    }
  };

  // Helper for relative time
  const formatRelativeDate = (timestamp: number) => {
    const diffMs = Date.now() - timestamp;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return 'Gerade eben';
    if (diffHours < 24) return `Vor ${diffHours} Std.`;
    if (diffDays === 1) return 'Gestern';
    if (diffDays < 7) return `Vor ${diffDays} Tagen`;
    return new Date(timestamp).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  // Obfuscate contact preview for non-premium
  const obfuscateName = (name: string) => {
    const parts = name.split(' ');
    return parts.map(p => p.slice(0, 2) + '••••').join(' ');
  };

  return (
    <div className="min-h-screen bg-[#F7F5F0] text-[#1B211D] pb-24">
      
      {/* Top Banner / Breadcrumb */}
      <div className="bg-white border-b border-[#E7E2DA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs font-bold text-[#5F6B63] hover:text-[#0F4C2E] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Zurück zur Übersicht
          </button>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsManageModalOpen(true)}
              className="text-xs font-medium text-[#5F6B63] hover:text-[#0F4C2E] underline underline-offset-2 transition-colors"
            >
              Eigenen Auftrag verwalten
            </button>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-[#0F4C2E] text-white py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Subtle decorative circles */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-72 h-72 bg-[#F2761B]/10 rounded-full blur-2xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="max-w-2xl space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-[#F2761B] text-white shadow-sm">
                <Hammer className="w-3.5 h-3.5" /> Handwerk & Bau • Winterberg
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
                Winterberger Auftragsbörse
              </h1>
              <p className="text-sm sm:text-base text-white/80 leading-relaxed max-w-xl">
                Bürger, Vermieter und Zweitwohnsitz-Besitzer schreiben ihre Projekte aus – 
                geprüfte Winterberger Fachbetriebe melden sich direkt mit Angeboten.
              </p>

              {/* Badges / Stats */}
              <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-white/90">
                <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg backdrop-blur-sm">
                  <CheckCircle2 className="w-4 h-4 text-[#F2761B]" />
                  <span><strong>{tenders.length}</strong> aktuelle Ausschreibungen</span>
                </div>
                <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg backdrop-blur-sm">
                  <MapPin className="w-4 h-4 text-[#F2761B]" />
                  <span>14 Winterberger Ortsteile</span>
                </div>
                <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg backdrop-blur-sm">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Exklusiver Lead-Zugang für Premium-Partner</span>
                </div>
              </div>
            </div>

            {/* Hero Actions */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 min-w-[280px]">
              <button
                onClick={() => setIsSubmitModalOpen(true)}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#F2761B] hover:bg-[#d65f0c] text-white font-bold text-sm rounded-xl shadow-lg hover:shadow-xl transition-all transform active:scale-95"
              >
                <Plus className="w-5 h-5" /> Auftrag kostenlos ausschreiben
              </button>

              {!isUserPremium && (
                <button
                  onClick={onNavigatePricing}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-white/10 hover:bg-white/20 text-white font-medium text-xs rounded-xl backdrop-blur-sm border border-white/20 transition-all"
                >
                  <Lock className="w-4 h-4 text-[#F2761B]" /> Als Handwerker Kontaktdaten freischalten
                </button>
              )}

              {isUserPremium && (
                <div className="bg-white/15 backdrop-blur-sm border border-emerald-400/40 rounded-xl p-3 text-center">
                  <span className="text-xs font-bold text-emerald-300 flex items-center justify-center gap-1.5">
                    <Check className="w-4 h-4" /> Premium-Partner Status aktiv
                  </span>
                  <span className="text-[11px] text-white/70 block mt-0.5">
                    Sie haben vollen Zugriff auf alle Kontaktdaten!
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        
        {/* Search & Filter Bar */}
        <div className="bg-white rounded-2xl shadow-lg border border-[#E7E2DA] p-4 sm:p-5 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            
            {/* Search Input */}
            <div className="relative md:col-span-1">
              <Search className="w-4 h-4 text-[#5F6B63] absolute left-3.5 top-3.5 pointer-events-none" />
              <input
                type="text"
                placeholder="Projekt suchen (z. B. Wärmepumpe, Dach)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 bg-[#F7F5F0] border border-[#E7E2DA] rounded-xl text-xs sm:text-sm text-[#1B211D] focus:outline-none focus:ring-2 focus:ring-[#0F4C2E]"
              />
            </div>

            {/* Subcategory Filter */}
            <div>
              <select
                value={selectedSubcategory}
                onChange={(e) => setSelectedSubcategory(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#F7F5F0] border border-[#E7E2DA] rounded-xl text-xs sm:text-sm font-medium text-[#1B211D] focus:outline-none focus:ring-2 focus:ring-[#0F4C2E]"
              >
                {SUBCATEGORIES_FILTER.map(sub => (
                  <option key={sub} value={sub}>{sub}</option>
                ))}
              </select>
            </div>

            {/* District Filter */}
            <div>
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#F7F5F0] border border-[#E7E2DA] rounded-xl text-xs sm:text-sm font-medium text-[#1B211D] focus:outline-none focus:ring-2 focus:ring-[#0F4C2E]"
              >
                <option value="Alle Ortsteile">Alle 14 Ortsteile</option>
                {SITE.districts.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            {/* Timeframe Filter */}
            <div>
              <select
                value={selectedTimeframe}
                onChange={(e) => setSelectedTimeframe(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#F7F5F0] border border-[#E7E2DA] rounded-xl text-xs sm:text-sm font-medium text-[#1B211D] focus:outline-none focus:ring-2 focus:ring-[#0F4C2E]"
              >
                <option value="Alle">Alle Zeiträume</option>
                <option value="urgent">Dringend / Schnellstmöglich</option>
                <option value="1_month">In den nächsten 4 Wochen</option>
                <option value="3_months">In den nächsten 1–3 Monaten</option>
                <option value="flexible">Flexibel</option>
              </select>
            </div>

          </div>

          {/* Active Filter Pills Reset */}
          {(searchQuery || selectedSubcategory !== 'Alle Gewerke' || selectedDistrict !== 'Alle Ortsteile' || selectedTimeframe !== 'Alle') && (
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-[#E7E2DA] text-xs text-[#5F6B63]">
              <span>Aktive Filter:</span>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedSubcategory('Alle Gewerke');
                  setSelectedDistrict('Alle Ortsteile');
                  setSelectedTimeframe('Alle');
                }}
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-[#1B211D] rounded-full font-medium transition-colors"
              >
                <X className="w-3 h-3" /> Filter zurücksetzen
              </button>
            </div>
          )}
        </div>

        {/* Tenders Grid */}
        {loading ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-[#E7E2DA]">
            <div className="w-10 h-10 border-4 border-[#0F4C2E] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm text-[#5F6B63]">Lade aktuelle Ausschreibungen...</p>
          </div>
        ) : filteredTenders.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-[#E7E2DA] p-6">
            <Hammer className="w-12 h-12 text-[#CCD4CF] mx-auto mb-3" />
            <h3 className="text-lg font-bold text-[#1B211D]">Keine passenden Ausschreibungen gefunden</h3>
            <p className="text-xs sm:text-sm text-[#5F6B63] max-w-md mx-auto mt-1 mb-5">
              Für diese Filterkombination liegen aktuell keine Gesuche vor. Passen Sie die Filter an oder schreiben Sie selbst den ersten Auftrag aus!
            </p>
            <button
              onClick={() => setIsSubmitModalOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0F4C2E] text-white text-xs font-bold rounded-xl hover:bg-[#0c3c24] transition-colors"
            >
              <Plus className="w-4 h-4" /> Jetzt Auftrag ausschreiben
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredTenders.map(tender => {
              const isUnlocked = isUserPremium || !!locallyUnlocked[tender.id];

              return (
                <div 
                  key={tender.id}
                  className="bg-white rounded-2xl border border-[#E7E2DA] shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between overflow-hidden"
                >
                  <div className="p-5 sm:p-6 space-y-4">
                    
                    {/* Meta Top Row */}
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-[#0F4C2E]/10 text-[#0F4C2E]">
                          <Hammer className="w-3.5 h-3.5" /> {tender.subcategory}
                        </span>
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-gray-100 text-[#5F6B63]">
                          <MapPin className="w-3.5 h-3.5 text-[#F2761B]" /> {tender.district}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-[#8F9E95]">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{formatRelativeDate(tender.createdAt)}</span>
                      </div>
                    </div>

                    {/* Title */}
                    <div>
                      <h2 
                        onClick={() => setSelectedTenderDetail(tender)}
                        className="text-lg font-bold text-[#1B211D] hover:text-[#0F4C2E] cursor-pointer transition-colors leading-snug"
                      >
                        {tender.title}
                      </h2>
                      <p className="text-xs sm:text-sm text-[#5F6B63] mt-2 line-clamp-3 leading-relaxed">
                        {tender.description}
                      </p>
                    </div>

                    {/* Timeframe & Budget Badges */}
                    <div className="flex items-center gap-2 flex-wrap text-xs">
                      <div className={`px-2.5 py-1 rounded-md font-semibold inline-flex items-center gap-1 ${
                        tender.timeframe === 'urgent' 
                          ? 'bg-red-50 text-red-700 border border-red-200' 
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}>
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{formatTimeframe(tender.timeframe)}</span>
                      </div>

                      {tender.budgetRange && (
                        <div className="px-2.5 py-1 rounded-md font-medium bg-[#F7F5F0] text-[#5F6B63] border border-[#E7E2DA]">
                          Budget: {tender.budgetRange}
                        </div>
                      )}

                      {tender.images && tender.images.length > 0 && (
                        <div className="px-2 py-1 rounded-md text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-200">
                          📷 {tender.images.length} Foto(s)
                        </div>
                      )}
                    </div>

                    {/* Photo Thumbnails if available */}
                    {tender.images && tender.images.length > 0 && (
                      <div className="flex gap-2 pt-1 overflow-x-auto pb-1">
                        {tender.images.map((img, i) => (
                          <img
                            key={i}
                            src={img}
                            alt="Projektfoto"
                            onClick={() => setActiveImagePreview(img)}
                            className="w-16 h-16 rounded-lg object-cover border border-[#E7E2DA] cursor-pointer hover:opacity-90 transition-opacity flex-shrink-0"
                          />
                        ))}
                      </div>
                    )}

                  </div>

                  {/* BOTTOM: Contact Unlock / Lead Section */}
                  <div className={`p-4 sm:p-5 border-t transition-colors ${
                    isUnlocked ? 'bg-emerald-50/70 border-emerald-200' : 'bg-[#F7F5F0] border-[#E7E2DA]'
                  }`}>
                    {isUnlocked ? (
                      /* FREIGESCHALTETE KONTAKTDATEN */
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                            <ShieldCheck className="w-4 h-4 text-emerald-600" />
                            Kontaktdaten freigeschaltet ({isUserPremium ? 'Premium-Partner' : 'Direktzugriff'})
                          </span>
                          <span className="text-[11px] text-[#5F6B63]">
                            Auftraggeber: <strong>{tender.contactName}</strong>
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                          {tender.contactPhone ? (
                            <a
                              href={`tel:${tender.contactPhone.replace(/\s+/g, '')}`}
                              className="inline-flex items-center justify-center gap-2 px-3.5 py-2.5 bg-[#0F4C2E] hover:bg-[#0c3c24] text-white text-xs font-bold rounded-xl shadow-sm transition-colors"
                            >
                              <Phone className="w-4 h-4" /> {tender.contactPhone} anrufen
                            </a>
                          ) : (
                            <div className="text-xs text-[#5F6B63] italic py-2">Keine Telefonnummer hinterlegt</div>
                          )}

                          <a
                            href={`mailto:${tender.contactEmail}?subject=Ihr Handwerksauftrag: ${encodeURIComponent(tender.title)}`}
                            className="inline-flex items-center justify-center gap-2 px-3.5 py-2.5 bg-white border border-[#CCD4CF] hover:border-[#0F4C2E] text-[#1B211D] text-xs font-semibold rounded-xl shadow-sm transition-colors"
                          >
                            <Mail className="w-4 h-4 text-[#0F4C2E]" /> E-Mail schreiben
                          </a>
                        </div>

                        {tender.preferredContactMethod && (
                          <div className="text-[11px] text-[#5F6B63]">
                            Präferenz des Kunden: {
                              tender.preferredContactMethod === 'phone' ? '📞 Bevorzugt telefonisch' :
                              tender.preferredContactMethod === 'email' ? '✉️ Bevorzugt per E-Mail' :
                              'Beliebig erreichbar'
                            }
                          </div>
                        )}
                      </div>
                    ) : (
                      /* GESPERRTE KONTAKTDATEN (LEAD MAGNET / PILOT PHASE) */
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#8F9E95]">
                            <Lock className="w-4 h-4 text-[#F2761B]" /> {IS_PILOT_PHASE ? 'Kostenloser Pilot-Zugang' : 'Kontaktdaten geschützt'}
                          </span>
                          <span className="text-[11px] font-mono text-[#8F9E95]">
                            {obfuscateName(tender.contactName)}
                          </span>
                        </div>

                        <div className="p-3 bg-white rounded-xl border border-[#E7E2DA] text-xs text-[#5F6B63] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="space-y-0.5">
                            <div className="font-semibold text-[#1B211D]">
                              {IS_PILOT_PHASE ? '🎉 Startphase: Freischaltung für Winterberger Betriebe' : 'Exklusiver Lead für Premium-Mitglieder'}
                            </div>
                            <div className="text-[11px]">
                              {IS_PILOT_PHASE ? 'In der Pilotphase können Sie die Kontaktdaten direkt kostenlos einsehen.' : 'Schalten Sie Telefonnummer & E-Mail dieses Kunden frei.'}
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleUnlockContact(tender)}
                            className="flex-shrink-0 inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-[#F2761B] hover:bg-[#d65f0c] text-white text-xs font-bold rounded-lg shadow transition-all"
                          >
                            <Unlock className="w-3.5 h-3.5" /> {IS_PILOT_PHASE ? 'Kostenlos freischalten' : 'Jetzt freischalten'}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* DETAIL MODAL */}
      {selectedTenderDetail && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 relative">
            <button
              onClick={() => setSelectedTenderDetail(null)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-700 bg-gray-100 rounded-full"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-4">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-[#0F4C2E]/10 text-[#0F4C2E]">
                <Hammer className="w-3.5 h-3.5" /> {selectedTenderDetail.subcategory}
              </span>
              <h3 className="text-xl font-bold text-[#1B211D]">
                {selectedTenderDetail.title}
              </h3>
              
              <div className="flex gap-4 text-xs text-[#5F6B63]">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#F2761B]" /> {selectedTenderDetail.district}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {formatTimeframe(selectedTenderDetail.timeframe)}
                </span>
              </div>

              <div className="p-4 bg-[#F7F5F0] rounded-xl text-xs sm:text-sm text-[#1B211D] whitespace-pre-wrap leading-relaxed">
                {selectedTenderDetail.description}
              </div>

              {selectedTenderDetail.images && selectedTenderDetail.images.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-[#5F6B63] mb-2 uppercase">Angehängte Fotos</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedTenderDetail.images.map((img, i) => (
                      <img
                        key={i}
                        src={img}
                        alt="Projektfoto"
                        onClick={() => setActiveImagePreview(img)}
                        className="w-full h-36 object-cover rounded-xl cursor-pointer hover:opacity-90 border border-[#E7E2DA]"
                      />
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-2">
                {isUserPremium ? (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 space-y-2">
                    <span className="text-xs font-bold text-emerald-800 block">Kontakt des Auftraggebers:</span>
                    <div className="text-sm font-semibold">{selectedTenderDetail.contactName}</div>
                    {selectedTenderDetail.contactPhone && (
                      <div className="text-xs">Tel: <strong>{selectedTenderDetail.contactPhone}</strong></div>
                    )}
                    <div className="text-xs">E-Mail: <strong>{selectedTenderDetail.contactEmail}</strong></div>
                  </div>
                ) : (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center space-y-2">
                    <p className="text-xs text-amber-800">
                      Die Kontaktdaten sind für Premium-Handwerkspartner reserviert.
                    </p>
                    <button
                      onClick={() => {
                        setSelectedTenderDetail(null);
                        if (onNavigatePricing) onNavigatePricing();
                      }}
                      className="px-4 py-2 bg-[#F2761B] text-white text-xs font-bold rounded-lg shadow"
                    >
                      Jetzt Premium freischalten
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* LIGHTBOX FOR IMAGES */}
      {activeImagePreview && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setActiveImagePreview(null)}
        >
          <div className="relative max-w-3xl max-h-[85vh]">
            <img src={activeImagePreview} alt="Grossansicht" className="max-w-full max-h-[85vh] rounded-xl object-contain shadow-2xl" />
            <button 
              onClick={() => setActiveImagePreview(null)} 
              className="absolute top-3 right-3 p-2 bg-black/50 text-white rounded-full hover:bg-black/70"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* MANAGE TENDER MODAL (Auftrag schließen / beenden) */}
      {isManageModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative border border-[#E7E2DA]">
            <button
              onClick={() => {
                setIsManageModalOpen(false);
                setManageMessage(null);
              }}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-700 bg-gray-100 rounded-full"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-lg font-bold text-[#1B211D] mb-1">
              Eigenen Auftrag verwalten
            </h3>
            <p className="text-xs text-[#5F6B63] mb-4">
              Haben Sie bereits einen passenden Handwerker gefunden? Hier können Sie Ihren Auftrag als vergeben markieren.
            </p>

            {manageMessage && (
              <div className={`p-3 rounded-xl text-xs mb-4 flex items-center gap-2 ${
                manageMessage.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'
              }`}>
                {manageMessage.type === 'success' ? <Check className="w-4 h-4 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
                <span>{manageMessage.text}</span>
              </div>
            )}

            <form onSubmit={handleCloseTenderSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#5F6B63] mb-1">
                  Ausschreibungs-ID oder Auswahl *
                </label>
                <select
                  value={manageTenderId}
                  onChange={(e) => setManageTenderId(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#CCD4CF] rounded-xl text-xs text-[#1B211D]"
                >
                  <option value="">-- Bitte Auftrag auswählen --</option>
                  {tenders.map(t => (
                    <option key={t.id} value={t.id}>{t.title} ({t.district})</option>
                  ))}
                </select>
              </div>

              {!isAdmin && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#5F6B63] mb-1">
                    Ihr persönlicher Verwaltungscode *
                  </label>
                  <input
                    type="text"
                    placeholder="Code aus der Bestätigungs-E-Mail"
                    value={manageTokenInput}
                    onChange={(e) => setManageTokenInput(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#CCD4CF] rounded-xl text-xs text-[#1B211D]"
                  />
                  <span className="text-[10px] text-[#5F6B63] mt-1 block">
                    Diesen Code haben Sie bei der Veröffentlichung erhalten.
                  </span>
                </div>
              )}

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsManageModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-[#5F6B63] hover:text-[#1B211D]"
                >
                  Abbrechen
                </button>
                <button
                  type="submit"
                  disabled={manageLoading || !manageTenderId}
                  className="px-4 py-2 bg-[#0F4C2E] hover:bg-[#0c3c24] text-white text-xs font-bold rounded-xl shadow transition-colors"
                >
                  {manageLoading ? 'Wird beendet...' : 'Als vergeben markieren'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE TENDER MODAL */}
      <SubmitTenderModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        onTenderCreated={handleTenderCreated}
        theme={theme}
      />

    </div>
  );
}
