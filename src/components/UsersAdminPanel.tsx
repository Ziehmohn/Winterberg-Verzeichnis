import React, { useEffect, useState } from 'react';
import { collection, getDocs, updateDoc, doc, addDoc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { UserProfile, Business } from '../types';
import { Mail, Search, Slash, CheckCircle, Clock } from 'lucide-react';

export default function UsersAdminPanel({ businesses }: { businesses: Business[] }) {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [messageSubject, setMessageSubject] = useState('');
  const [messageBody, setMessageBody] = useState('');
  const [sendingMsg, setSendingMsg] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const [fetchError, setFetchError] = useState('');

  const loadUsers = async () => {
    setLoading(true);
    setFetchError('');
    try {
      const qs = await getDocs(collection(db, 'users'));
      const data = qs.docs.map(d => d.data() as UserProfile);
      data.sort((a, b) => {
        const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return timeB - timeA;
      });
      setUsers(data);
    } catch (e: any) {
      console.error(e);
      setFetchError(e.message || 'Error fetching users');
    } finally {
      setLoading(false);
    }
  };

  const handleBanToggle = async (user: UserProfile) => {
    const isCurrentlyBanned = user.banned;
    if (!isCurrentlyBanned) {
      const reason = prompt('Grund für die Sperrung?');
      if (reason === null) return;
      try {
        await updateDoc(doc(db, 'users', user.uid), {
          banned: true,
          bannedReason: reason,
          bannedAt: new Date().toISOString()
        });
        setUsers(users.map(u => u.uid === user.uid ? { ...u, banned: true, bannedReason: reason } : u));
      } catch (e) {
        console.error(e);
        alert('Fehler beim Sperren');
      }
    } else {
      if (!confirm('Diesen Nutzer wieder entsperren?')) return;
      try {
        await updateDoc(doc(db, 'users', user.uid), {
          banned: false,
          bannedReason: null,
          bannedAt: null
        });
        setUsers(users.map(u => u.uid === user.uid ? { ...u, banned: false, bannedReason: undefined } : u));
      } catch (e) {
        console.error(e);
        alert('Fehler beim Entsperren');
      }
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser || !messageSubject.trim() || !messageBody.trim()) return;
    setSendingMsg(true);
    try {
      await addDoc(collection(db, 'messages'), {
        toUid: selectedUser.uid,
        toEmail: selectedUser.email,
        fromEmail: 'info@sichtbar-online.com',
        subject: messageSubject.trim(),
        body: messageBody.trim(),
        createdAt: new Date().toISOString(),
        read: false
      });
      alert('Nachricht gesendet!');
      setSelectedUser(null);
      setMessageSubject('');
      setMessageBody('');
    } catch (err) {
      console.error(err);
      alert('Fehler beim Senden der Nachricht.');
    } finally {
      setSendingMsg(false);
    }
  };

  const filtered = users.filter(u => 
    (u.email || '').toLowerCase().includes(search.toLowerCase()) || 
    (u.displayName || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-white border border-[#EDE8E0] rounded-lg p-6 shadow-sm">
      <div className="flex flex-col gap-4 mb-6">
        <h3 className="text-[18px] font-bold">Mitgliederverwaltung</h3>
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-[#8A928B]" />
          <input 
            type="text"
            placeholder="Nutzer suchen..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-[#E7E2DA] rounded-md text-[14px] focus:border-[#0F4C2E] focus:outline-none"
          />
        </div>
      </div>

      {fetchError && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <p className="text-red-700 text-sm font-bold">Fehler beim Laden:</p>
          <p className="text-red-600 text-sm">{fetchError}</p>
        </div>
      )}

      {loading ? (
        <p className="text-[#8A928B] text-sm">Lade Mitglieder...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-[#EDE8E0] text-[13px] text-[#5F6B63]">
                <th className="pb-3 pr-4 font-semibold">Nutzer / E-Mail</th>
                <th className="pb-3 pr-4 font-semibold">Rolle</th>
                <th className="pb-3 pr-4 font-semibold">Unternehmen</th>
                <th className="pb-3 pr-4 font-semibold">Registriert</th>
                <th className="pb-3 pr-4 font-semibold">Letzter Login</th>
                <th className="pb-3 font-semibold text-right">Aktion</th>
              </tr>
            </thead>
            <tbody className="text-[14px]">
              {filtered.map(user => {
                const ownerOf = businesses.filter(b => b.ownerId === user.uid || (user.email && b.ownerEmail === user.email));
                return (
                  <tr key={user.uid} className={`border-b border-[#EDE8E0] ${user.banned ? 'bg-red-50' : 'hover:bg-[#FAF8F5]'}`}>
                    <td className="py-3 pr-4">
                      <div className="font-semibold">{user.displayName || '-'}</div>
                      <div className="text-[13px] text-[#5F6B63]">{user.email || 'Keine E-Mail'}</div>
                      {user.banned && <div className="text-xs text-red-600 font-bold mt-1">Gesperrt: {user.bannedReason}</div>}
                    </td>
                    <td className="py-3 pr-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider ${
                        user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                        user.role === 'business_owner' ? 'bg-[#0F4C2E]/10 text-[#0F4C2E]' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3 pr-4">
                      {ownerOf.length > 0 ? (
                        <div className="flex flex-col gap-1">
                          {ownerOf.map(b => (
                            <span key={b.id} className="text-[#0F4C2E] font-medium text-[13px]">{b.name}</span>
                          ))}
                        </div>
                      ) : '-'}
                    </td>
                    <td className="py-3 pr-4 text-[#5F6B63] text-[13px]">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}
                    </td>
                    <td className="py-3 pr-4 text-[#5F6B63] text-[13px]">
                      {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString() : '-'}
                    </td>
                    <td className="py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => setSelectedUser(user)}
                          className="p-1.5 text-[#5F6B63] hover:text-[#0F4C2E] hover:bg-[#E8F1EB] rounded transition-colors"
                          title="Nachricht senden"
                        >
                          <Mail className="w-4 h-4" />
                        </button>
                        {user.role !== 'admin' && (
                          <button 
                            onClick={() => handleBanToggle(user)}
                            className={`p-1.5 rounded transition-colors ${
                              user.banned 
                                ? 'text-green-600 hover:bg-green-100' 
                                : 'text-red-600 hover:bg-red-100'
                            }`}
                            title={user.banned ? 'Entsperren' : 'Sperren (Rauswurf)'}
                          >
                            {user.banned ? <CheckCircle className="w-4 h-4" /> : <Slash className="w-4 h-4" />}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-[#8A928B]">
                    Keine Nutzer gefunden.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {selectedUser && (
        <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 relative">
            <h3 className="text-lg font-bold mb-4">
              Nachricht an {selectedUser.displayName || selectedUser.email}
            </h3>
            <form onSubmit={handleSendMessage} className="grid gap-4">
              <label className="grid gap-1.5 text-[14px] font-semibold">
                Betreff
                <input 
                  type="text" 
                  required
                  value={messageSubject}
                  onChange={e => setMessageSubject(e.target.value)}
                  className="w-full border border-[#E7E2DA] rounded-md px-3 py-2 bg-[#FAF8F5]"
                />
              </label>
              <label className="grid gap-1.5 text-[14px] font-semibold">
                Nachricht
                <textarea 
                  required
                  rows={5}
                  value={messageBody}
                  onChange={e => setMessageBody(e.target.value)}
                  className="w-full border border-[#E7E2DA] rounded-md px-3 py-2 bg-[#FAF8F5]"
                />
              </label>
              <div className="flex gap-3 justify-end mt-2">
                <button 
                  type="button" 
                  onClick={() => setSelectedUser(null)}
                  className="px-4 py-2 bg-[#FAF8F5] text-[#5F6B63] hover:bg-[#E7E2DA] rounded-md font-semibold text-sm transition-colors"
                >
                  Abbrechen
                </button>
                <button 
                  type="submit" 
                  disabled={sendingMsg}
                  className="px-4 py-2 bg-[#0F4C2E] text-white hover:bg-[#06301C] rounded-md font-semibold text-sm transition-colors"
                >
                  {sendingMsg ? 'Sendet...' : 'Senden'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
