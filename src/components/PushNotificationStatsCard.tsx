import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  Smartphone, 
  Laptop, 
  Send, 
  CheckCircle2, 
  RefreshCw, 
  Users, 
  ChevronDown, 
  ChevronUp, 
  Radio, 
  AlertCircle,
  Apple,
  Globe
} from 'lucide-react';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebase';

export interface PushSubscriptionItem {
  id: string;
  token: string;
  topic?: string;
  platform?: string;
  userAgent?: string;
  createdAt?: string;
  active?: boolean;
}

export function PushNotificationStatsCard() {
  const [subscriptions, setSubscriptions] = useState<PushSubscriptionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showTestModal, setShowTestModal] = useState(false);

  // Test push state
  const [testTitle, setTestTitle] = useState('Test-Benachrichtigung aus Winterberg');
  const [testBody, setTestBody] = useState('Dies ist eine Test-Nachricht vom Winterberg Verzeichnis.');
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  const loadSubscriptions = async () => {
    try {
      setLoading(true);
      setError(null);
      const q = query(collection(db, 'push_subscriptions'));
      const snap = await getDocs(q);
      const items: PushSubscriptionItem[] = snap.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as any)
      }));
      // Sort newest first
      items.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
      setSubscriptions(items);
    } catch (err: any) {
      console.error('Fehler beim Laden der Push-Statistiken:', err);
      setError(err?.message || 'Statistiken konnten nicht geladen werden.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubscriptions();
  }, []);

  const totalActive = subscriptions.filter(s => s.active !== false).length;
  const totalInactive = subscriptions.filter(s => s.active === false).length;

  const mobileCount = subscriptions.filter(s => 
    s.active !== false && (s.platform === 'ios' || s.platform === 'android' || /Mobile|Android|iPhone|iPad/i.test(s.userAgent || ''))
  ).length;

  const desktopCount = subscriptions.filter(s => 
    s.active !== false && !s.platform?.includes('ios') && !s.platform?.includes('android') && !/Mobile|Android|iPhone|iPad/i.test(s.userAgent || '')
  ).length;

  const iosCount = subscriptions.filter(s => s.active !== false && s.platform === 'ios').length;
  const androidCount = subscriptions.filter(s => s.active !== false && s.platform === 'android').length;

  const lastSub = subscriptions[0];
  const lastSubDate = lastSub?.createdAt ? new Date(lastSub.createdAt).toLocaleString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }) : 'Noch keine';

  const handleSendTestPush = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testTitle.trim() || !testBody.trim()) return;

    try {
      setIsSendingTest(true);
      setTestResult(null);

      const res = await fetch('/api/send-news-push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: testTitle.trim(),
          body: testBody.trim(),
          url: '/news',
          icon: '/pwa-icon-192.png'
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setTestResult({
          success: true,
          message: `Erfolgreich gesendet an ${data.sentCount || totalActive} Empfänger!`
        });
      } else {
        setTestResult({
          success: false,
          message: data.error || data.message || 'Fehler beim Versenden der Test-Push-Nachricht.'
        });
      }
    } catch (err: any) {
      setTestResult({
        success: false,
        message: err?.message || 'Netzwerkfehler beim Versenden.'
      });
    } finally {
      setIsSendingTest(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-[#0F4C2E]/5 via-[#FAF8F5] to-emerald-50/50 border border-[#0F4C2E]/20 rounded-xl p-5 sm:p-6 mb-6 shadow-xs">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#0F4C2E]/10">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-[#0F4C2E] text-white flex items-center justify-center shadow-xs shrink-0">
            <Bell className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-[#1B211D]">
                Web-Push-Benachrichtigungen &amp; Abonnenten
              </h3>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-[#0F4C2E]">
                <Radio className="w-3 h-3 text-emerald-600 animate-ping" />
                Live
              </span>
            </div>
            <p className="text-xs text-[#5F6B63] mt-0.5">
              Statistik über alle registrierten Smartphones und Desktop-Browser für Eilmeldungen.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={loadSubscriptions}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md border border-[#E7E2DA] bg-white text-[#1B211D] hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-50"
            title="Statistik neu laden"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Aktualisieren</span>
          </button>

          <button
            type="button"
            onClick={() => setShowTestModal(!showTestModal)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-md bg-[#0F4C2E] hover:bg-[#0b3822] text-white shadow-xs transition-colors cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Test-Push senden</span>
          </button>
        </div>
      </div>

      {error ? (
        <div className="mt-4 p-3.5 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      ) : (
        /* Stat Metric Cards */
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-4">
          {/* Card 1: Total Active */}
          <div className="bg-white border border-[#E7E2DA] rounded-lg p-3.5 shadow-2xs">
            <div className="flex items-center justify-between text-[#5F6B63] text-xs font-medium mb-1">
              <span>Aktive Abonnenten</span>
              <Users className="w-4 h-4 text-[#0F4C2E]" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-extrabold text-[#1B211D]">
                {loading ? '...' : totalActive}
              </span>
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                Empfangsbereit
              </span>
            </div>
            {totalInactive > 0 && (
              <div className="text-[10.5px] text-gray-400 mt-1">
                +{totalInactive} abgemeldet
              </div>
            )}
          </div>

          {/* Card 2: Mobile Devices */}
          <div className="bg-white border border-[#E7E2DA] rounded-lg p-3.5 shadow-2xs">
            <div className="flex items-center justify-between text-[#5F6B63] text-xs font-medium mb-1">
              <span>Smartphones</span>
              <Smartphone className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-extrabold text-[#1B211D]">
                {loading ? '...' : mobileCount}
              </span>
              <span className="text-[11px] text-[#5F6B63]">Geräte</span>
            </div>
            <div className="text-[10.5px] text-[#5F6B63] mt-1 flex items-center gap-1.5">
              <span>iOS: <strong>{iosCount}</strong></span>
              <span>·</span>
              <span>Android: <strong>{androidCount}</strong></span>
            </div>
          </div>

          {/* Card 3: Desktop */}
          <div className="bg-white border border-[#E7E2DA] rounded-lg p-3.5 shadow-2xs">
            <div className="flex items-center justify-between text-[#5F6B63] text-xs font-medium mb-1">
              <span>Desktop / PC</span>
              <Laptop className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-extrabold text-[#1B211D]">
                {loading ? '...' : desktopCount}
              </span>
              <span className="text-[11px] text-[#5F6B63]">Browser</span>
            </div>
            <div className="text-[10.5px] text-[#5F6B63] mt-1">
              Chrome, Edge, Safari
            </div>
          </div>

          {/* Card 4: Last Subscription */}
          <div className="bg-white border border-[#E7E2DA] rounded-lg p-3.5 shadow-2xs">
            <div className="flex items-center justify-between text-[#5F6B63] text-xs font-medium mb-1">
              <span>Letzte Anmeldung</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-xs font-bold text-[#1B211D] truncate mt-1">
              {loading ? '...' : lastSubDate}
            </div>
            <div className="text-[10.5px] text-[#5F6B63] mt-1 truncate">
              {lastSub ? `${lastSub.platform || 'Web'} (${lastSub.topic || 'news'})` : 'Bisher keine Daten'}
            </div>
          </div>
        </div>
      )}

      {/* Test Push Drawer / Modal */}
      {showTestModal && (
        <form onSubmit={handleSendTestPush} className="mt-4 p-4 bg-white border border-[#0F4C2E]/30 rounded-lg shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0F4C2E] flex items-center gap-1.5">
              <Send className="w-3.5 h-3.5" /> Test-Push an alle {totalActive} Abonnenten senden
            </span>
            <button
              type="button"
              onClick={() => { setShowTestModal(false); setTestResult(null); }}
              className="text-xs text-gray-400 hover:text-gray-700 cursor-pointer"
            >
              Schließen
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-gray-700 mb-1">Titel der Push-Nachricht</label>
              <input
                type="text"
                value={testTitle}
                onChange={e => setTestTitle(e.target.value)}
                required
                className="w-full text-xs border border-[#E7E2DA] rounded px-3 py-2 bg-[#FAF8F5] focus:bg-white focus:outline-none focus:border-[#0F4C2E]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-gray-700 mb-1">Nachrichtentext</label>
              <input
                type="text"
                value={testBody}
                onChange={e => setTestBody(e.target.value)}
                required
                className="w-full text-xs border border-[#E7E2DA] rounded px-3 py-2 bg-[#FAF8F5] focus:bg-white focus:outline-none focus:border-[#0F4C2E]"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-gray-500">
              Klickt der Nutzer auf die Push-Meldung, öffnet sich die News-Seite.
            </span>
            <button
              type="submit"
              disabled={isSendingTest || totalActive === 0}
              className="bg-[#0F4C2E] hover:bg-[#0b3822] text-white px-4 py-2 rounded text-xs font-bold transition-colors cursor-pointer disabled:opacity-50 inline-flex items-center gap-1.5"
            >
              <Send className="w-3 h-3" />
              {isSendingTest ? 'Wird versendet...' : 'Jetzt absenden'}
            </button>
          </div>

          {testResult && (
            <div className={`p-2.5 rounded text-xs flex items-center gap-2 ${
              testResult.success ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
              {testResult.success ? <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" /> : <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />}
              <span>{testResult.message}</span>
            </div>
          )}
        </form>
      )}

      {/* Toggle Details List */}
      <div className="mt-4 pt-3 border-t border-[#0F4C2E]/10 flex items-center justify-between text-xs">
        <button
          type="button"
          onClick={() => setShowDetails(!showDetails)}
          className="text-[#0F4C2E] hover:underline font-semibold inline-flex items-center gap-1 cursor-pointer"
        >
          {showDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          <span>{showDetails ? 'Geräteliste ausblenden' : `Registrierte Geräte anzeigen (${subscriptions.length})`}</span>
        </button>
        <span className="text-[#8A928B] text-[11px]">
          FCM Token-Verschlüsselung aktiv
        </span>
      </div>

      {/* Expanded Devices List */}
      {showDetails && (
        <div className="mt-3 bg-white border border-[#E7E2DA] rounded-lg overflow-hidden divide-y divide-[#EDE8E0] max-h-[260px] overflow-y-auto">
          {subscriptions.length === 0 ? (
            <div className="p-4 text-center text-xs text-[#8A928B]">
              Noch keine Push-Abonnenten vorhanden.
            </div>
          ) : (
            subscriptions.map((sub, idx) => (
              <div key={sub.id || idx} className="p-3 text-xs flex items-center justify-between hover:bg-[#FAF8F5] transition-colors">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center shrink-0 text-gray-600">
                    {sub.platform === 'ios' ? (
                      <Apple className="w-3.5 h-3.5" />
                    ) : sub.platform === 'android' ? (
                      <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Laptop className="w-3.5 h-3.5 text-blue-600" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold text-gray-900 flex items-center gap-2">
                      <span className="uppercase text-[10.5px] px-1.5 py-0.2 bg-gray-100 rounded text-gray-700">
                        {sub.platform || 'Web'}
                      </span>
                      <span className="text-gray-400 font-mono text-[10px] truncate max-w-[140px] sm:max-w-[240px]">
                        {sub.token ? `${sub.token.slice(0, 16)}...${sub.token.slice(-8)}` : sub.id}
                      </span>
                    </div>
                    <div className="text-[10.5px] text-[#5F6B63] truncate max-w-[280px] sm:max-w-[450px]">
                      {sub.userAgent || 'Unbekannter Browser'}
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0 ml-3">
                  <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold ${
                    sub.active !== false ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {sub.active !== false ? 'Aktiv' : 'Inaktiv'}
                  </span>
                  <div className="text-[10px] text-gray-400 mt-0.5">
                    {sub.createdAt ? new Date(sub.createdAt).toLocaleDateString('de-DE') : '–'}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
