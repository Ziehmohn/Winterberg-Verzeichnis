import React, { useState, useEffect } from 'react';
import { 
  Hammer, 
  MapPin, 
  Clock, 
  Search, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink, 
  RefreshCw,
  Mail,
  Phone,
  Eye,
  Calendar,
  Lock,
  Plus
} from 'lucide-react';
import { TenderProject, ThemeConfig } from '../types';
import { fetchAllTendersAdmin, updateTenderStatus, deleteTender, formatTimeframe } from '../services/tenderService';

interface TendersAdminPanelProps {
  onOpenLiveBoerse: () => void;
}

export default function TendersAdminPanel({ onOpenLiveBoerse }: TendersAdminPanelProps) {
  const [tenders, setTenders] = useState<TenderProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'completed' | 'cancelled'>('all');
  const [actionMessage, setActionMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const loadData = async () => {
    setLoading(true);
    const data = await fetchAllTendersAdmin();
    setTenders(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStatusToggle = async (tender: TenderProject, newStatus: 'active' | 'completed' | 'cancelled') => {
    const res = await updateTenderStatus(tender.id, newStatus, undefined, true);
    if (res.success) {
      setTenders(prev => prev.map(t => t.id === tender.id ? { ...t, status: newStatus } : t));
      setActionMessage({ type: 'success', text: `Status erfolgreich auf "${newStatus}" geändert.` });
      setTimeout(() => setActionMessage(null), 3000);
    } else {
      setActionMessage({ type: 'error', text: res.error || 'Fehler beim Ändern des Status.' });
    }
  };

  const handleDelete = async (tenderId: string, title: string) => {
    if (!window.confirm(`Möchten Sie die Ausschreibung "${title}" wirklich unwiderruflich löschen?`)) {
      return;
    }
    const res = await deleteTender(tenderId);
    if (res.success) {
      setTenders(prev => prev.filter(t => t.id !== tenderId));
      setActionMessage({ type: 'success', text: 'Ausschreibung wurde gelöscht.' });
      setTimeout(() => setActionMessage(null), 3000);
    } else {
      setActionMessage({ type: 'error', text: res.error || 'Fehler beim Löschen.' });
    }
  };

  const filtered = tenders.filter(t => {
    if (statusFilter !== 'all' && t.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        t.title.toLowerCase().includes(q) ||
        t.district.toLowerCase().includes(q) ||
        t.subcategory.toLowerCase().includes(q) ||
        t.contactName.toLowerCase().includes(q) ||
        t.contactEmail.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Bar */}
      <div className="bg-white rounded-2xl border border-[#EDE8E0] p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-[#1B211D]">Auftragsbörse Verwaltung</h2>
            <span className="bg-[#F2761B] text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
              Interner Test
            </span>
          </div>
          <p className="text-xs text-[#5F6B63] mt-0.5">
            Übersicht aller Handwerks-Ausschreibungen, Kontaktdaten und Status der Kunden.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadData}
            disabled={loading}
            className="p-2.5 rounded-xl border border-[#EDE8E0] text-[#5F6B63] hover:text-[#1B211D] hover:bg-[#FAF8F5] transition-colors"
            title="Aktualisieren"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={onOpenLiveBoerse}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#0F4C2E] hover:bg-[#0c3c24] text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
          >
            <ExternalLink className="w-4 h-4" /> Live-Auftragsbörse testen
          </button>
        </div>
      </div>

      {actionMessage && (
        <div className={`p-3.5 rounded-xl text-xs flex items-center gap-2 ${
          actionMessage.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {actionMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          <span>{actionMessage.text}</span>
        </div>
      )}

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-[#5F6B63] absolute left-3 top-3 pointer-events-none" />
          <input
            type="text"
            placeholder="Ausschreibung, Ortsteil, Kontakt suchen..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-white border border-[#EDE8E0] rounded-xl text-xs text-[#1B211D] focus:outline-none focus:ring-1 focus:ring-[#0F4C2E]"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          {(['all', 'active', 'completed', 'cancelled'] as const).map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                statusFilter === st 
                  ? 'bg-[#0F4C2E] text-white' 
                  : 'bg-white border border-[#EDE8E0] text-[#5F6B63] hover:text-[#1B211D]'
              }`}
            >
              {st === 'all' ? 'Alle' : st === 'active' ? 'Aktiv' : st === 'completed' ? 'Vergeben' : 'Storniert'}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-[#EDE8E0]">
          <div className="w-8 h-8 border-3 border-[#0F4C2E] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs text-[#5F6B63]">Lade Ausschreibungen...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-[#EDE8E0] p-4">
          <Hammer className="w-10 h-10 text-gray-300 mx-auto mb-2" />
          <p className="text-sm font-bold text-[#1B211D]">Keine Ausschreibungen gefunden</p>
          <p className="text-xs text-[#5F6B63] mt-1">Keine Einträge für diese Filterkriterien.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(t => (
            <div 
              key={t.id}
              className="bg-white rounded-xl border border-[#EDE8E0] p-4 shadow-xs hover:border-[#0F4C2E]/40 transition-colors space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-[#0F4C2E]/10 text-[#0F4C2E]">
                      {t.subcategory}
                    </span>
                    <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-gray-100 text-[#5F6B63] flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#F2761B]" /> {t.district}
                    </span>
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                      t.status === 'active' ? 'bg-emerald-100 text-emerald-800' :
                      t.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {t.status === 'active' ? '● Aktiv' : t.status === 'completed' ? '✓ Vergeben' : 'Storniert'}
                    </span>
                  </div>
                  <h3 className="font-bold text-sm text-[#1B211D]">{t.title}</h3>
                </div>

                <div className="text-right text-[11px] text-[#8F9E95] shrink-0">
                  <div>Erstellt: {new Date(t.createdAt).toLocaleDateString('de-DE')}</div>
                  <div className="font-mono text-[10px] text-gray-400">Token: {t.manageToken}</div>
                </div>
              </div>

              <p className="text-xs text-[#5F6B63] leading-relaxed line-clamp-2">
                {t.description}
              </p>

              {/* Contact Box (Admin View) */}
              <div className="bg-[#FAF8F5] rounded-lg p-3 border border-[#EDE8E0] flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-4 flex-wrap">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#8A928B] block">Auftraggeber</span>
                    <strong className="text-[#1B211D]">{t.contactName}</strong>
                  </div>
                  {t.contactPhone && (
                    <div className="flex items-center gap-1 text-[#1B211D]">
                      <Phone className="w-3.5 h-3.5 text-[#0F4C2E]" />
                      <span>{t.contactPhone}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1 text-[#1B211D]">
                    <Mail className="w-3.5 h-3.5 text-[#0F4C2E]" />
                    <span>{t.contactEmail}</span>
                  </div>
                  <div className="text-[#5F6B63]">
                    Zeitraum: <strong>{formatTimeframe(t.timeframe)}</strong>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  {t.status === 'active' ? (
                    <button
                      onClick={() => handleStatusToggle(t, 'completed')}
                      className="px-2.5 py-1 text-xs font-bold rounded-md bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                      title="Als vergeben markieren"
                    >
                      Als vergeben markieren
                    </button>
                  ) : (
                    <button
                      onClick={() => handleStatusToggle(t, 'active')}
                      className="px-2.5 py-1 text-xs font-bold rounded-md bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
                      title="Wieder aktivieren"
                    >
                      Wieder aktivieren
                    </button>
                  )}

                  <button
                    onClick={() => handleDelete(t.id, t.title)}
                    className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                    title="Löschen"
                  >
                    <Trash2 className="w-4 h-4" />
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
