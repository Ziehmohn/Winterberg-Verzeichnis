import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { Business } from '../types';
import { ShieldCheck, Check, X, Building2, User, Mail, Phone, Calendar, Clock } from 'lucide-react';

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

  const fetchClaims = async () => {
    try {
      setLoading(true);
      const snap = await getDocs(collection(db, 'claims'));
      const list: ClaimItem[] = [];
      snap.forEach(d => {
        list.push({ id: d.id, ...d.data() } as ClaimItem);
      });
      list.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
      setClaims(list);
    } catch (err) {
      console.error('Error fetching claims:', err);
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
      const busRef = doc(db, 'businesses', claim.businessId);
      const updates: any = {
        ownerEmail: claim.applicantEmail,
        isVerified: true
      };
      if (claim.userId) {
        updates.ownerId = claim.userId;
      }
      await updateDoc(busRef, updates);

      // 2. Update claim status
      await updateDoc(doc(db, 'claims', claim.id), { status: 'approved' });

      // 3. Update local state
      setClaims(prev => prev.map(c => c.id === claim.id ? { ...c, status: 'approved' } : c));
      setBusinesses(prev => prev.map(b => b.id === claim.businessId ? { ...b, ...updates } : b));
      alert(`Übernahme erfolgreich freigegeben! ${claim.applicantEmail} hat nun Zugriff als Inhaber.`);
    } catch (err) {
      console.error('Error approving claim:', err);
      alert('Fehler beim Freigeben der Übernahme.');
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

  return (
    <div className="bg-white border border-[#EDE8E0] rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h2 className="font-display text-[21px] font-bold text-[#1B211D] mb-1 flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-[#0F4C2E]" />
            <span>Unternehmens-Übernahmen (Claims)</span>
          </h2>
          <p className="text-[14px] text-[#5F6B63] m-0">
            Hier verwalten Sie Anträge von echten Inhabern, die ihren bestehenden Basiseintrag beanspruchen möchten.
          </p>
        </div>
        <button
          onClick={fetchClaims}
          className="text-xs bg-[#FAF8F5] border border-[#E7E2DA] hover:border-[#0F4C2E] px-3 py-1.5 rounded-md text-[#0F4C2E] font-medium transition-colors cursor-pointer"
        >
          Aktualisieren
        </button>
      </div>

      {loading ? (
        <div className="py-12 text-center text-[#8A928B]">Lade Übernahme-Anträge...</div>
      ) : claims.length === 0 ? (
        <div className="border border-dashed border-[#D8D2C8] rounded-xl p-10 text-center text-[#8A928B]">
          Bisher liegen keine offenen oder bearbeiteten Übernahme-Anfragen vor.
        </div>
      ) : (
        <div className="space-y-4">
          {claims.map(claim => (
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
