import React, { useState, useEffect } from 'react';
import { Bell, BellRing, CheckCircle2, X, AlertCircle, Smartphone, Sparkles, Loader2 } from 'lucide-react';
import { 
  isPushNotificationSupported, 
  isUserSubscribedToPush, 
  isPromptDismissed, 
  dismissPrompt, 
  subscribeToNewsPush,
  getNotificationPermission
} from '../services/pushNotificationService';
import { useTranslation } from '../i18n';

interface NewsPushPromptProps {
  variant?: 'banner' | 'card' | 'inline';
  className?: string;
}

export const NewsPushPrompt: React.FC<NewsPushPromptProps> = ({ 
  variant = 'banner',
  className = '' 
}) => {
  const { lang } = useTranslation();
  const isNl = lang === 'nl';

  const [supported, setSupported] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const isSupp = isPushNotificationSupported();
    setSupported(isSupp);
    if (isSupp) {
      setSubscribed(isUserSubscribedToPush());
      setDismissed(isPromptDismissed());
    }
  }, []);

  if (!supported) return null;

  const handleSubscribe = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const result = await subscribeToNewsPush();
      if (result.success) {
        setSubscribed(true);
        setMessage({
          type: 'success',
          text: isNl 
            ? 'Gelukt! Je ontvangt nu meldingen bij belangrijk nieuws uit Winterberg.' 
            : 'Erfolgreich aktiviert! Du erhältst ab sofort wichtige Winterberg-News direkt als Benachrichtigung.'
        });
      } else {
        setMessage({
          type: 'error',
          text: result.error || (isNl ? 'Inschrijven mislukt.' : 'Aktivierung fehlgeschlagen.')
        });
      }
    } catch (err: any) {
      setMessage({
        type: 'error',
        text: err?.message || (isNl ? 'Er is een fout opgetreden.' : 'Ein unerwarteter Fehler ist aufgetreten.')
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDismiss = () => {
    dismissPrompt(14);
    setDismissed(true);
  };

  // If already subscribed, show a compact confirmation badge
  if (subscribed) {
    if (variant === 'inline') {
      return (
        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold text-emerald-800 dark:text-emerald-300 ${className}`}>
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>{isNl ? 'Pushmeldingen actief' : 'News-Push aktiviert'}</span>
        </div>
      );
    }

    return (
      <div className={`p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800/40 flex items-center justify-between gap-3 text-xs text-emerald-800 dark:text-emerald-300 ${className}`}>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center shrink-0">
            <Bell className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
          </div>
          <div>
            <span className="font-bold block text-sm">
              {isNl ? 'Meldingen ingeschakeld' : 'News-Push ist aktiv'}
            </span>
            <span className="text-emerald-700/80 dark:text-emerald-400/80 text-[11px]">
              {isNl 
                ? 'Je ontvangt updates bij belangrijk lokaal nieuws.' 
                : 'Du wirst bei wichtigen Eilmeldungen automatisch informiert.'}
            </span>
          </div>
        </div>
        <span className="px-2.5 py-1 rounded-full bg-emerald-200/70 dark:bg-emerald-900/60 text-emerald-900 dark:text-emerald-200 font-bold text-[10px] uppercase tracking-wider">
          Aktiv
        </span>
      </div>
    );
  }

  // If dismissed by user and not an explicit inline prompt, hide banner
  if (dismissed && variant === 'banner') {
    return null;
  }

  // Banner variant (ideal for top of news feed)
  if (variant === 'banner') {
    return (
      <div className={`relative overflow-hidden rounded-2xl p-5 sm:p-6 bg-gradient-to-r from-[#17382A] via-[#1F4A37] to-[#122B20] text-white shadow-md border border-emerald-500/30 ${className}`}>
        {/* Close / Dismiss button */}
        <button
          type="button"
          onClick={handleDismiss}
          className="absolute top-3 right-3 p-1.5 text-white/60 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          aria-label={isNl ? 'Sluiten' : 'Schließen'}
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pr-6 sm:pr-0">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 text-[#0F281E] flex items-center justify-center shadow-lg shrink-0 mt-0.5 sm:mt-0">
              <BellRing className="w-6 h-6 animate-bounce" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 text-[10px] font-bold uppercase tracking-wider mb-1">
                <Sparkles className="w-3 h-3" />
                <span>{isNl ? 'Nieuws-abonnement' : 'Kostenlos & Direkt'}</span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                {isNl 
                  ? 'Winterberg-nieuws direct als pushmelding ontvangen?' 
                  : 'Winterberg-News als Push-Nachricht erhalten?'}
              </h3>
              <p className="text-xs text-white/80 max-w-xl mt-1 leading-relaxed">
                {isNl 
                  ? 'Mis geen belangrijke gebeurtenissen, openingen, wegafsluitingen of weerwaarschuwingen uit Winterberg en de dorpen.'
                  : 'Sei sofort informiert bei Eilmeldungen, Neueröffnungen, Events, Straßensperrungen und wichtigen Updates aus Winterberg & den 14 Ortsteilen.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 pt-2 sm:pt-0">
            <button
              type="button"
              onClick={handleSubscribe}
              disabled={loading}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#0E291F] font-extrabold text-xs sm:text-sm shadow-md transition-all hover:scale-[1.02] cursor-pointer disabled:opacity-70"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{isNl ? 'Activeren...' : 'Wird aktiviert...'}</span>
                </>
              ) : (
                <>
                  <Bell className="w-4 h-4" />
                  <span>{isNl ? 'Pushmeldingen inschakelen' : 'Push-News aktivieren'}</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={handleDismiss}
              className="hidden sm:inline-flex px-3 py-2 text-xs font-semibold text-white/70 hover:text-white transition-colors cursor-pointer"
            >
              {isNl ? 'Later' : 'Später'}
            </button>
          </div>
        </div>

        {message && (
          <div className={`mt-3 pt-3 border-t border-white/10 text-xs flex items-center gap-2 ${message.type === 'success' ? 'text-emerald-300' : 'text-rose-300'}`}>
            {message.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
            <span>{message.text}</span>
          </div>
        )}
      </div>
    );
  }

  // Card / Inline variant (for single news article sidebar or footer)
  return (
    <div className={`rounded-2xl p-5 bg-gradient-to-br from-emerald-50/70 to-teal-50/40 dark:from-[#17261E] dark:to-[#172D24] border border-emerald-500/20 shadow-sm ${className}`}>
      <div className="flex items-start gap-3.5">
        <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md shrink-0">
          <BellRing className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-bold text-gray-900 dark:text-white">
            {isNl ? 'Blijf op de hoogte van Winterberg' : 'Bleibe immer informiert'}
          </h4>
          <p className="text-xs text-gray-600 dark:text-gray-300 mt-1 leading-relaxed">
            {isNl 
              ? 'Activeer gratis pushberichten voor actuele meldingen en nieuws.' 
              : 'Aktiviere kostenlose Push-Nachrichten für wichtige Neuigkeiten direkt auf dein Smartphone oder deinen PC.'}
          </p>

          <div className="mt-3 flex items-center gap-2">
            <button
              type="button"
              onClick={handleSubscribe}
              disabled={loading}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer disabled:opacity-70"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>{isNl ? 'Bezig...' : 'Wird aktiviert...'}</span>
                </>
              ) : (
                <>
                  <Bell className="w-3.5 h-3.5" />
                  <span>{isNl ? 'Meldingen aanzetten' : 'Push aktivieren'}</span>
                </>
              )}
            </button>
          </div>

          {message && (
            <p className={`mt-2 text-xs font-medium flex items-center gap-1.5 ${message.type === 'success' ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
              {message.type === 'success' ? <CheckCircle2 className="w-3.5 h-3.5 shrink-0" /> : <AlertCircle className="w-3.5 h-3.5 shrink-0" />}
              <span>{message.text}</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewsPushPrompt;
