import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, doc, updateDoc, deleteDoc, setDoc, query, where, limit } from 'firebase/firestore';
import { invalidateCache, bumpRemoteBusinessesVersion, CACHE_KEYS } from '../utils/dbCache';
import { Business } from '../types';
import { ShieldCheck, Check, X, Building2, User, Mail, Phone, Calendar, Clock, RefreshCw, AlertCircle, Plus, Search } from 'lucide-react';

interface ClaimItem {
  id: string;
  businessId: string;
  businessName: string;
  businessCategory?: string;
  applicantName: string;
  applicantEmail: string;
  applicantPhone?: string;
  proofNote?: string;
  userId?: string | null;
  status: 'pending' | 'approved' | 'rejected';
  type?: 'basic' | 'premium';
  createdAt: string;
}

interface ClaimsAdminPanelProps {
  businesses: Business[];
  setBusinesses: React.Dispatch<React.SetStateAction<Business[]>>;
}

export default function ClaimsAdminPanel({ businesses, setBusinesses }: ClaimsAdminPanelProps) {
  const [claims, setClaims] = useState<ClaimItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  // Manual Claim Modal State
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [manualBusinessSearch, setManualBusinessSearch] = useState('');
  const [selectedManualBusId, setSelectedManualBusId] = useState('winterberg-immobilien');
  const [manualApplicantName, setManualApplicantName] = useState('');
  const [manualApplicantEmail, setManualApplicantEmail] = useState('');
  const [manualApplicantPhone, setManualApplicantPhone] = useState('');
  const [manualPlan, setManualPlan] = useState<'basic' | 'premium'>('basic');
  const [manualSendEmail, setManualSendEmail] = useState(true);
  const [manualSubmitting, setManualSubmitting] = useState(false);

  const fetchClaims = async () => {
    try {
      setLoading(true);
      setFetchError(null);
      const snap = await getDocs(collection(db, 'claims'));
      const list: ClaimItem[] = [];
      snap.forEach(d => {
        list.push({ id: d.id, ...d.data() } as ClaimItem);
      });
      list.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
      setClaims(list);
      try {
        localStorage.setItem('wb_claims_cache', JSON.stringify(list));
      } catch (e) {}
    } catch (err: any) {
      console.error('Error fetching claims:', err);
      setFetchError(err?.message || 'Fehler beim Laden der Freigabe-Anfragen');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    try {
      const cached = localStorage.getItem('wb_claims_cache');
      if (cached) {
        setClaims(JSON.parse(cached));
      }
    } catch (e) {}
    fetchClaims();
  }, []);

  const handleApproveClaim = async (claim: ClaimItem) => {
    if (!confirm(`Übernahme für "${claim.businessName}" durch ${claim.applicantName} (${claim.applicantEmail}) freigeben?`)) {
      return;
    }

    try {
      // 1. Update business document in Firestore: assign owner
      const cleanEmail = claim.applicantEmail.trim().toLowerCase();
      const busRef = doc(db, 'businesses', claim.businessId);
      const updates: any = {
        ownerEmail: cleanEmail,
        isVerified: true
      };

      // 2. Check if a user account already exists in users collection
      let assignedUid = claim.userId || null;
      if (!assignedUid) {
        try {
          const userQuery = query(collection(db, 'users'), where('email', '==', cleanEmail), limit(1));
          const userSnap = await getDocs(userQuery);
          if (!userSnap.empty) {
            assignedUid = userSnap.docs[0].id;
          }
        } catch (findErr) {
          console.warn('Could not query users by email:', findErr);
        }
      }

      if (assignedUid) {
        updates.ownerId = assignedUid;
      }
      if (claim.type === 'premium') {
        updates.isPremium = true;
      }
      await setDoc(busRef, updates, { merge: true });

      // If user ID is known, also ensure users/{uid} is marked as business_owner
      if (assignedUid) {
        try {
          await setDoc(doc(db, 'users', assignedUid), {
            role: 'business_owner',
            businessId: claim.businessId,
            email: cleanEmail
          }, { merge: true });
        } catch (uErr) {
          console.warn('Could not update users document:', uErr);
        }
      }

      // 3. Update claim status
      await updateDoc(doc(db, 'claims', claim.id), { status: 'approved' });

      // 4. Update local state
      setClaims(prev => prev.map(c => c.id === claim.id ? { ...c, status: 'approved' } : c));
      setBusinesses(prev => prev.map(b => b.id === claim.businessId ? { ...b, ...updates } : b));
      invalidateCache(CACHE_KEYS.BUSINESSES);
      bumpRemoteBusinessesVersion(db);

      // 5. Notify applicant of approval
      try {
        await fetch('/api/send-mail', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: cleanEmail,
            subject: 'Profil-Übernahme freigeschaltet - Das Winterberg Verzeichnis',
            html: `
              <div style="font-family: sans-serif; color: #1B211D;">
                <p>Hallo ${claim.applicantName},</p>
                <p>gute Nachrichten: Wir haben Ihre Anfrage geprüft und die Übernahme des Profils <strong>${claim.businessName}</strong> soeben erfolgreich freigeschaltet!</p>
                <p>Sie können sich nun jederzeit auf <a href="https://www.winterberg-verzeichnis.de">winterberg-verzeichnis.de</a> mit Ihrer E-Mail-Adresse (${cleanEmail}) einloggen, um Ihr Profil zu verwalten, Daten zu aktualisieren oder Widgets abzurufen.</p>
                <p>Viele Grüße,<br>Ihr Team vom Winterberg Verzeichnis</p>
              </div>
            `
          })
        });
      } catch (e) {
        console.error("Could not send approval email", e);
      }

      alert(`Übernahme erfolgreich freigegeben! ${cleanEmail} hat nun Zugriff als Inhaber.`);
    } catch (err) {
      console.error('Error approving claim:', err);
      alert('Fehler beim Freigeben der Übernahme. Bitte versuchen Sie es später erneut.');
    }
  };

  const handleRejectClaim = async (claim: ClaimItem) => {
    if (!confirm(`Übernahme-Anfrage für "${claim.businessName}" ablehnen?`)) {
      return;
    }

    try {
      await updateDoc(doc(db, 'claims', claim.id), { status: 'rejected' });
      setClaims(prev => prev.map(c => c.id === claim.id ? { ...c, status: 'rejected' } : c));
    } catch (err) {
      console.error('Error rejecting claim:', err);
      alert('Fehler beim Ablehnen.');
    }
  };

  const handleDeleteClaim = async (id: string) => {
    if (!confirm('Diesen Eintrag unwiderruflich löschen?')) return;
    try {
      await deleteDoc(doc(db, 'claims', id));
      setClaims(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      console.error('Error deleting claim:', err);
    }
  };

  const handleManualClaimSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedManualBusId || !manualApplicantEmail.trim()) {
      alert('Bitte wählen Sie ein Unternehmen aus und geben Sie eine E-Mail-Adresse an.');
      return;
    }

    const targetBus = businesses.find(b => b.id === selectedManualBusId);
    if (!targetBus) {
      alert('Unternehmen nicht gefunden.');
      return;
    }

    setManualSubmitting(true);
    const cleanEmail = manualApplicantEmail.trim().toLowerCase();
    const appName = manualApplicantName.trim() || targetBus.name;

    try {
      // 1. Update business document in Firestore
      const busRef = doc(db, 'businesses', targetBus.id);
      const updates: any = {
        ownerEmail: cleanEmail,
        isVerified: true
      };
      if (manualPlan === 'premium') {
        updates.isPremium = true;
      }

      // Check if user already exists
      let assignedUid: string | null = null;
      try {
        const uq = query(collection(db, 'users'), where('email', '==', cleanEmail), limit(1));
        const usnap = await getDocs(uq);
        if (!usnap.empty) {
          assignedUid = usnap.docs[0].id;
        }
      } catch (e) {
        console.warn('Could not query users:', e);
      }

      if (assignedUid) {
        updates.ownerId = assignedUid;
        try {
          await setDoc(doc(db, 'users', assignedUid), {
            role: 'business_owner',
            businessId: targetBus.id,
            email: cleanEmail
          }, { merge: true });
        } catch (ue) {
          console.warn('Could not update user doc:', ue);
        }
      }

      // Try setDoc on business
      try {
        await setDoc(busRef, updates, { merge: true });
      } catch (be) {
        console.warn('Could not save to Firestore businesses, updating locally:', be);
      }

      // 2. Try recording claim document
      const newClaimItem: ClaimItem = {
        id: 'manual_' + Date.now(),
        businessId: targetBus.id,
        businessName: targetBus.name,
        applicantName: appName,
        applicantEmail: cleanEmail,
        applicantPhone: manualApplicantPhone.trim() || undefined,
        status: 'approved',
        type: manualPlan,
        createdAt: new Date().toISOString()
      };

      try {
        await setDoc(doc(db, 'claims', newClaimItem.id), newClaimItem);
      } catch (ce) {
        console.warn('Could not save claim to Firestore:', ce);
      }

      // 3. Send email if checked
      if (manualSendEmail) {
        try {
          await fetch('/api/send-mail', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              to: cleanEmail,
              subject: 'Profil-Übernahme freigeschaltet - Das Winterberg Verzeichnis',
              html: `
                <div style="font-family: sans-serif; color: #1B211D;">
                  <p>Hallo ${appName},</p>
                  <p>gute Nachrichten: Ihr Unternehmenseintrag <strong>${targetBus.name}</strong> wurde soeben erfolgreich für Sie freigeschaltet!</p>
                  <p>Sie können sich nun jederzeit auf <a href="https://www.winterberg-verzeichnis.de">winterberg-verzeichnis.de</a> mit Ihrer E-Mail-Adresse (${cleanEmail}) anmelden, um Ihr Profil zu verwalten, Daten zu aktualisieren oder Trust-Badges zu nutzen.</p>
                  <p>Viele Grüße,<br>Ihr Team vom Winterberg Verzeichnis</p>
                </div>
              `
            })
          });
        } catch (me) {
          console.warn('Could not send confirmation email:', me);
        }
      }

      // 4. Update local state
      setBusinesses(prev => prev.map(b => b.id === targetBus.id ? { ...b, ...updates } : b));
      setClaims(prev => [newClaimItem, ...prev]);
      try {
        const cached = localStorage.getItem('wb_claims_cache');
        const list = cached ? JSON.parse(cached) : [];
        localStorage.setItem('wb_claims_cache', JSON.stringify([newClaimItem, ...list]));
      } catch (e) {}

      invalidateCache(CACHE_KEYS.BUSINESSES);
      bumpRemoteBusinessesVersion(db);

      alert(`Erfolgreich freigeschaltet! "${targetBus.name}" ist nun der E-Mail ${cleanEmail} zugeordnet.`);
      setIsManualModalOpen(false);
      setManualApplicantEmail('');
      setManualApplicantName('');
      setManualApplicantPhone('');
    } catch (err: any) {
      console.error('Error in manual claim approval:', err);
      alert('Fehler: ' + (err?.message || 'Unbekannter Fehler'));
    } finally {
      setManualSubmitting(false);
    }
  };

  const pendingCount = claims.filter(c => c.status === 'pending').length;
  const approvedCount = claims.filter(c => c.status === 'approved').length;
  const rejectedCount = claims.filter(c => c.status === 'rejected').length;

  const displayedClaims = claims.filter(c => {
    if (statusFilter === 'all') return true;
    return c.status === statusFilter;
  });

  const matchingBusinessesForManual = businesses.filter(b => {
    if (!manualBusinessSearch.trim()) return true;
    return b.name.toLowerCase().includes(manualBusinessSearch.toLowerCase().trim());
  }).slice(0, 30);

  return (
    <div className="bg-white border border-[#EDE8E0] rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h2 className="font-display text-[21px] font-bold text-[#1B211D] mb-1 flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-[#0F4C2E]" />
            <span>Freigaben & Übernahme-Anfragen (Claims)</span>
          </h2>
          <p className="text-[14px] text-[#5F6B63] m-0">
            Hier prüfen und verwalten Sie Anfragen von echten Inhabern, die ihren bestehenden Unternehmenseintrag beanspruchen möchten.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setIsManualModalOpen(true)}
            className="text-xs bg-[#0F4C2E] text-white hover:bg-[#06301C] px-3.5 py-2 rounded-md font-semibold transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Manuelle Freigabe erfassen</span>
          </button>
          <button
            onClick={fetchClaims}
            disabled={loading}
            className="text-xs bg-[#FAF8F5] border border-[#E7E2DA] hover:border-[#0F4C2E] px-3.5 py-2 rounded-md text-[#0F4C2E] font-medium transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Aktualisieren</span>
          </button>
        </div>
      </div>

      {fetchError && (
        <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm space-y-2">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span className="font-semibold">Tägliches Leselimit von Firestore vorübergehend erreicht</span>
            </div>
            <button 
              onClick={fetchClaims} 
              className="text-xs font-bold underline hover:text-rose-950 cursor-pointer"
            >
              Erneut versuchen
            </button>
          </div>
          <p className="text-xs text-rose-700 m-0 leading-relaxed">
            Das kostenlose tägliche Firestore-Leselimit ist heute temporär erschöpft (setzt sich automatisch zurück). 
            <strong> Keine Sorge:</strong> Sie können Übernahmen für <strong>Winterberg Immobilien</strong> oder andere Betriebe sofort über den Button <strong>„Manuelle Freigabe erfassen“</strong> freischalten und die Bestätigungs-E-Mail versenden!
          </p>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 mb-5 flex-wrap border-b border-[#EDE8E0] pb-3">
        {[
          { key: 'all' as const, label: 'Alle Anfragen', count: claims.length },
          { key: 'pending' as const, label: 'Offene Freigaben', count: pendingCount, highlight: pendingCount > 0 },
          { key: 'approved' as const, label: 'Freigegeben', count: approvedCount },
          { key: 'rejected' as const, label: 'Abgelehnt', count: rejectedCount }
        ].map(tab => {
          const isActive = statusFilter === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setStatusFilter(tab.key)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer inline-flex items-center gap-2 ${
                isActive
                  ? 'bg-[#0F4C2E] text-white shadow-xs'
                  : 'text-[#5F6B63] hover:text-[#1B211D] bg-[#FAF8F5] border border-[#E7E2DA]'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded-full ${
                isActive
                  ? 'bg-white/20 text-white'
                  : tab.highlight
                  ? 'bg-[#F2761B] text-white'
                  : 'bg-black/5 text-[#5F6B63]'
              }`}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="py-12 text-center text-[#8A928B]">Lade Freigabe-Anträge...</div>
      ) : displayedClaims.length === 0 ? (
        <div className="border border-dashed border-[#D8D2C8] rounded-xl p-10 text-center text-[#8A928B]">
          {statusFilter === 'pending'
            ? 'Aktuell liegen keine offenen Freigabe-Anfragen vor.'
            : statusFilter === 'approved'
            ? 'Bisher wurden keine Freigaben erteilt.'
            : statusFilter === 'rejected'
            ? 'Keine abgelehnten Anfragen vorhanden.'
            : 'Bisher liegen keine Übernahme-Anfragen vor.'}
        </div>
      ) : (
        <div className="space-y-4">
          {displayedClaims.map(claim => {
            const targetBus = businesses.find(b => b.id === claim.businessId);
            const isAlreadyAssigned = targetBus?.ownerEmail && targetBus.ownerEmail.toLowerCase().trim() === claim.applicantEmail.toLowerCase().trim();

            return (
            <div
              key={claim.id}
              className={`border rounded-xl p-5 transition-all ${
                claim.status === 'pending'
                  ? isAlreadyAssigned
                    ? 'bg-[#F4F9F5] border-emerald-300'
                    : 'bg-[#FFF8F1] border-[#FBD9BC]'
                  : claim.status === 'approved'
                  ? 'bg-[#FAF8F5] border-emerald-200'
                  : 'bg-gray-50 border-gray-200 opacity-70'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="font-bold text-[17px] text-[#1B211D]">
                      {claim.businessName}
                    </span>
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded border ${
                      claim.type === 'premium'
                        ? 'bg-[#FFF1E4] text-[#D65F0C] border-[#F2761B]/40'
                        : 'bg-[#F4F9F5] text-[#0F4C2E] border-[#D0E7D8]'
                    }`}>
                      {claim.type === 'premium' ? '🌟 PREMIUM' : '🟢 BASIS'}
                    </span>
                    {claim.status === 'pending' && (
                      <span className={`rounded px-2 py-0.5 text-[11px] font-bold border ${
                        isAlreadyAssigned
                          ? 'bg-emerald-100 text-[#0F4C2E] border-emerald-300'
                          : 'bg-[#FFF1E4] text-[#D65F0C] border-[#F2761B]/30'
                      }`}>
                        {isAlreadyAssigned ? '✓ BEREITS FREIGESCHALTET' : 'OFFEN (PRÜFUNG)'}
                      </span>
                    )}
                    {claim.status === 'approved' && (
                      <span className="bg-emerald-100 text-[#0F4C2E] border border-emerald-300 rounded px-2 py-0.5 text-[11px] font-bold">
                        FREIGEGEBEN
                      </span>
                    )}
                    {claim.status === 'rejected' && (
                      <span className="bg-rose-100 text-rose-700 border border-rose-300 rounded px-2 py-0.5 text-[11px] font-bold">
                        ABGELEHNT
                      </span>
                    )}
                    <span className="text-[12px] text-[#8A928B] flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {new Date(claim.createdAt).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[13.5px] text-[#4A544D] pt-1">
                    <div className="flex items-center gap-1.5">
                      <User className="w-4 h-4 text-[#8A928B] shrink-0" />
                      <span>{claim.applicantName}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Mail className="w-4 h-4 text-[#8A928B] shrink-0" />
                      <a href={`mailto:${claim.applicantEmail}`} className="text-[#0F4C2E] hover:underline">
                        {claim.applicantEmail}
                      </a>
                    </div>
                    {claim.applicantPhone && (
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-4 h-4 text-[#8A928B] shrink-0" />
                        <a href={`tel:${claim.applicantPhone}`} className="text-[#0F4C2E] hover:underline">
                          {claim.applicantPhone}
                        </a>
                      </div>
                    )}
                  </div>

                  {claim.proofNote && (
                    <div className="text-[13px] text-[#5F6B63] bg-white/80 border border-[#E7E2DA] rounded-lg p-2.5 mt-2">
                      <strong>Rolle / Angabe:</strong> {claim.proofNote}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0 self-start md:self-center">
                  {claim.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleApproveClaim(claim)}
                        className="bg-[#0F4C2E] hover:bg-[#06301C] text-white px-3.5 py-2 rounded-lg font-semibold text-[13px] flex items-center gap-1.5 cursor-pointer shadow-sm transition-colors"
                      >
                        <Check className="w-4 h-4" />
                        <span>Freigeben</span>
                      </button>
                      <button
                        onClick={() => handleRejectClaim(claim)}
                        className="bg-white border border-rose-300 text-rose-700 hover:bg-rose-50 px-3.5 py-2 rounded-lg font-semibold text-[13px] flex items-center gap-1.5 cursor-pointer transition-colors"
                      >
                        <X className="w-4 h-4" />
                        <span>Ablehnen</span>
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => handleDeleteClaim(claim.id)}
                    className="text-gray-400 hover:text-rose-600 p-2 text-xs transition-colors cursor-pointer"
                    title="Löschen"
                  >
                    Löschen
                  </button>
                </div>
              </div>
            </div>
            );
          })}
        </div>
      )}

      {/* Manual Claim Modal */}
      {isManualModalOpen && (
        <div className="fixed inset-0 z-[120] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="max-w-lg w-full bg-white rounded-2xl shadow-2xl border border-[#EDE8E0] overflow-hidden my-8 relative">
            <div className="p-6 border-b border-[#EDE8E0] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-[#E8F1EB] text-[#0F4C2E] flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-[17px] text-[#1B211D] m-0">Manuelle Freigabe erfassen</h3>
                  <p className="text-xs text-[#5F6B63] m-0">Eintrag direkt einem Inhaber zuweisen und freischalten</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsManualModalOpen(false)}
                className="text-gray-400 hover:text-gray-700 p-1.5 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleManualClaimSubmit} className="p-6 space-y-4">
              {/* Business Select */}
              <div>
                <label className="block text-xs font-bold text-[#1B211D] uppercase tracking-wider mb-1.5">
                  Unternehmen auswählen *
                </label>
                <input
                  type="text"
                  placeholder="Unternehmen suchen..."
                  value={manualBusinessSearch}
                  onChange={e => setManualBusinessSearch(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-[#E7E2DA] rounded-lg mb-2 bg-[#FAF8F5] focus:outline-none focus:border-[#0F4C2E]"
                />
                <select
                  required
                  value={selectedManualBusId}
                  onChange={e => setSelectedManualBusId(e.target.value)}
                  className="w-full px-3 py-2.5 border border-[#E7E2DA] rounded-lg text-sm bg-white focus:outline-none focus:border-[#0F4C2E]"
                >
                  {matchingBusinessesForManual.map(b => (
                    <option key={b.id} value={b.id}>
                      {b.name} ({b.district || 'Winterberg'})
                    </option>
                  ))}
                </select>
              </div>

              {/* Applicant Name */}
              <div>
                <label className="block text-xs font-bold text-[#1B211D] uppercase tracking-wider mb-1.5">
                  Name des Inhabers / Antragstellers
                </label>
                <input
                  type="text"
                  placeholder="z.B. Max Mustermann"
                  value={manualApplicantName}
                  onChange={e => setManualApplicantName(e.target.value)}
                  className="w-full px-3 py-2.5 border border-[#E7E2DA] rounded-lg text-sm bg-white focus:outline-none focus:border-[#0F4C2E]"
                />
              </div>

              {/* Applicant Email */}
              <div>
                <label className="block text-xs font-bold text-[#1B211D] uppercase tracking-wider mb-1.5">
                  E-Mail-Adresse des Inhabers *
                </label>
                <input
                  required
                  type="email"
                  placeholder="inhaber@firma.de"
                  value={manualApplicantEmail}
                  onChange={e => setManualApplicantEmail(e.target.value)}
                  className="w-full px-3 py-2.5 border border-[#E7E2DA] rounded-lg text-sm bg-white focus:outline-none focus:border-[#0F4C2E]"
                />
                <p className="text-[11px] text-[#5F6B63] mt-1">
                  Mit dieser E-Mail kann sich der Inhaber einloggen und sein Dashboard öffnen.
                </p>
              </div>

              {/* Phone (optional) */}
              <div>
                <label className="block text-xs font-bold text-[#1B211D] uppercase tracking-wider mb-1.5">
                  Telefonnummer (optional)
                </label>
                <input
                  type="text"
                  placeholder="02981 ..."
                  value={manualApplicantPhone}
                  onChange={e => setManualApplicantPhone(e.target.value)}
                  className="w-full px-3 py-2.5 border border-[#E7E2DA] rounded-lg text-sm bg-white focus:outline-none focus:border-[#0F4C2E]"
                />
              </div>

              {/* Plan Choice */}
              <div>
                <label className="block text-xs font-bold text-[#1B211D] uppercase tracking-wider mb-1.5">
                  Tarif
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setManualPlan('basic')}
                    className={`py-2 px-3 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                      manualPlan === 'basic'
                        ? 'bg-[#E8F1EB] text-[#0F4C2E] border-[#0F4C2E]'
                        : 'bg-white text-gray-600 border-gray-200'
                    }`}
                  >
                    🟢 Kostenloser Basiseintrag
                  </button>
                  <button
                    type="button"
                    onClick={() => setManualPlan('premium')}
                    className={`py-2 px-3 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                      manualPlan === 'premium'
                        ? 'bg-[#FFF1E4] text-[#D65F0C] border-[#F2761B]'
                        : 'bg-white text-gray-600 border-gray-200'
                    }`}
                  >
                    🌟 Premium Profil
                  </button>
                </div>
              </div>

              {/* Send email checkbox */}
              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-[#1B211D]">
                  <input
                    type="checkbox"
                    checked={manualSendEmail}
                    onChange={e => setManualSendEmail(e.target.checked)}
                    className="rounded border-gray-300 text-[#0F4C2E] focus:ring-[#0F4C2E]"
                  />
                  <span>Freischaltungs-Bestätigung per E-Mail an den Antragsteller senden</span>
                </label>
              </div>

              {/* Buttons */}
              <div className="pt-4 border-t border-[#EDE8E0] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsManualModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#5F6B63] hover:text-[#1B211D] bg-white border border-[#E7E2DA] rounded-lg cursor-pointer"
                >
                  Abbrechen
                </button>
                <button
                  type="submit"
                  disabled={manualSubmitting}
                  className="px-5 py-2 text-xs font-bold text-white bg-[#0F4C2E] hover:bg-[#06301C] rounded-lg cursor-pointer transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  {manualSubmitting ? 'Wird freigeschaltet...' : 'Jetzt freischalten'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
