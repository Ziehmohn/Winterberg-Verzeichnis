import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, doc, updateDoc, deleteDoc, setDoc, query, where, limit } from 'firebase/firestore';
import { invalidateCache, bumpRemoteBusinessesVersion, CACHE_KEYS } from '../utils/dbCache';
import { Business } from '../types';
import { ShieldCheck, Check, X, Building2, User, Mail, Phone, Calendar, Clock, RefreshCw, AlertCircle } from 'lucide-react';

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
    } catch (err: any) {
      console.error('Error fetching claims:', err);
      setFetchError(err?.message || 'Fehler beim Laden der Freigabe-Anfragen');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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

  const pendingCount = claims.filter(c => c.status === 'pending').length;
  const approvedCount = claims.filter(c => c.status === 'approved').length;
  const rejectedCount = claims.filter(c => c.status === 'rejected').length;

  const displayedClaims = claims.filter(c => {
    if (statusFilter === 'all') return true;
    return c.status === statusFilter;
  });

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
        <button
          onClick={fetchClaims}
          disabled={loading}
          className="text-xs bg-[#FAF8F5] border border-[#E7E2DA] hover:border-[#0F4C2E] px-3.5 py-2 rounded-md text-[#0F4C2E] font-medium transition-colors cursor-pointer flex items-center gap-1.5"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Aktualisieren</span>
        </button>
      </div>

      {fetchError && (
        <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{fetchError}</span>
          </div>
          <button 
            onClick={fetchClaims} 
            className="text-xs font-bold underline hover:text-rose-950 cursor-pointer"
          >
            Erneut versuchen
          </button>
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
          {displayedClaims.map(claim => (
            <div
              key={claim.id}
              className={`border rounded-xl p-5 transition-all ${
                claim.status === 'pending'
                  ? 'bg-[#FFF8F1] border-[#FBD9BC]'
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
                      <span className="bg-[#FFF1E4] text-[#D65F0C] border border-[#F2761B]/30 rounded px-2 py-0.5 text-[11px] font-bold">
                        OFFEN (PRÜFUNG)
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
          ))}
        </div>
      )}
    </div>
  );
}
