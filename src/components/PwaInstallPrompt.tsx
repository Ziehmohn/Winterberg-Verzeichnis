import React, { useState, useEffect } from 'react';
import { Download, Smartphone, X, Check, Share, MoreVertical, Monitor, RefreshCw, Sparkles } from 'lucide-react';

export default function PwaInstallPrompt({ lang = 'de' }: { lang?: 'de' | 'nl' }) {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [platform, setPlatform] = useState<'ios' | 'android' | 'desktop'>('desktop');

  useEffect(() => {
    // Detect platform
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIos = /iphone|ipad|ipod/.test(userAgent);
    const isAndroid = /android/.test(userAgent);
    if (isIos) setPlatform('ios');
    else if (isAndroid) setPlatform('android');
    else setPlatform('desktop');

    // 1. Register Service Worker
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(
          (registration) => {
            console.log('PWA ServiceWorker registered:', registration.scope);
          },
          (err) => {
            console.log('PWA ServiceWorker registration failed:', err);
          }
        );
      });
    }

    // 2. Check if already running in standalone mode (installed)
    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone) {
      setIsInstalled(true);
      return;
    }

    // 3. Listen for browser install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      (window as any).__wb_deferredPrompt = e;

      // Only suppress automatic pop-up if dismissed within last 24 hours
      const dismissed = localStorage.getItem('wb_pwa_prompt_dismissed');
      if (!dismissed || Date.now() - parseInt(dismissed, 10) > 24 * 60 * 60 * 1000) {
        setShowPrompt(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // 4. Custom event listener for manual trigger ("App installieren" buttons across site)
    const handleManualOpen = () => {
      // Clear dismissal so it can be shown
      localStorage.removeItem('wb_pwa_prompt_dismissed');
      
      const promptToUse = deferredPrompt || (window as any).__wb_deferredPrompt;
      if (promptToUse) {
        promptToUse.prompt();
        promptToUse.userChoice.then(({ outcome }: any) => {
          if (outcome === 'accepted') {
            setIsInstalled(true);
            setShowPrompt(false);
            setShowGuideModal(false);
          }
        });
      } else {
        // If native prompt is not available (e.g. iOS Safari, or already triggered once), show step-by-step guide
        setShowGuideModal(true);
      }
    };

    window.addEventListener('open-pwa-install', handleManualOpen);
    (window as any).__wb_openPwaInstall = handleManualOpen;

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('open-pwa-install', handleManualOpen);
    };
  }, [deferredPrompt]);

  const handleInstallClick = async () => {
    const promptToUse = deferredPrompt || (window as any).__wb_deferredPrompt;
    if (!promptToUse) {
      setShowGuideModal(true);
      return;
    }

    promptToUse.prompt();
    const { outcome } = await promptToUse.userChoice;
    if (outcome === 'accepted') {
      setIsInstalled(true);
      setShowPrompt(false);
      setShowGuideModal(false);
    }
    setDeferredPrompt(null);
    (window as any).__wb_deferredPrompt = null;
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    // Dismiss only for 24 hours
    localStorage.setItem('wb_pwa_prompt_dismissed', Date.now().toString());
  };

  const handleResetDismissal = () => {
    localStorage.removeItem('wb_pwa_prompt_dismissed');
    setShowGuideModal(false);
    setShowPrompt(true);
  };

  return (
    <>
      {/* 1. Floating Bottom Banner (auto-prompt) */}
      {!isInstalled && showPrompt && !showGuideModal && (
        <div className="fixed bottom-4 right-4 z-[99] max-w-sm w-[calc(100vw-2rem)] bg-white border border-[#E7E2DA] rounded-2xl shadow-2xl p-4 transition-all animate-in fade-in slide-in-from-bottom-5">
          <button 
            onClick={handleDismiss}
            className="absolute top-2.5 right-2.5 text-gray-400 hover:text-gray-600 p-1 rounded-full cursor-pointer"
            aria-label="Schließen"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-start gap-3">
            <img 
              src="/favicon.svg" 
              alt="Winterberg App" 
              className="w-12 h-12 rounded-xl shrink-0 shadow-md object-cover" 
            />
            <div className="flex-1 pr-4">
              <h4 className="font-display font-bold text-[15px] text-[#1B211D] leading-tight mb-1">
                {lang === 'nl' ? 'Als App installeren' : 'Als App installieren'}
              </h4>
              <p className="text-[12.5px] text-[#5F6B63] leading-snug mb-3">
                {lang === 'nl' 
                  ? 'Installeer het Winterberg-overzicht direct op je telefoon voor supersnelle toegang en actuele informatie.'
                  : 'Nutzen Sie das Winterberg-Verzeichnis wie eine native App: Schneller Zugriff, Spritpreise & Notdienste direkt auf Ihrem Startbildschirm.'}
              </p>
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={handleInstallClick}
                  className="bg-[#0F4C2E] hover:bg-[#06301C] text-white px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{lang === 'nl' ? 'Nu installeren' : 'Jetzt installieren'}</span>
                </button>
                <button
                  onClick={handleDismiss}
                  className="text-xs text-[#5F6B63] hover:text-[#1B211D] px-2 py-1.5 cursor-pointer"
                >
                  {lang === 'nl' ? 'Later' : 'Später'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Manual Installation Guide Modal (opens when user clicks App Install button or on iOS/Safari) */}
      {showGuideModal && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative border border-[#EDE8E0] max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowGuideModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 p-1 rounded-full cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <img 
                src="/favicon.svg" 
                alt="Winterberg App" 
                className="w-12 h-12 rounded-xl shrink-0 shadow-md object-cover" 
              />
              <div>
                <h3 className="font-display font-bold text-lg text-[#1B211D] leading-tight">
                  {lang === 'nl' ? 'Winterberg App installeren' : 'Winterberg App installieren'}
                </h3>
                <p className="text-xs text-[#717E75]">
                  {lang === 'nl' ? 'Direct op uw startscherm' : 'Direkt auf Ihrem Startbildschirm'}
                </p>
              </div>
            </div>

            {/* Direct install button if deferred prompt is ready */}
            {deferredPrompt && (
              <div className="mb-5 p-3.5 bg-[#E8F1EB] rounded-xl border border-[#0F4C2E]/20">
                <p className="text-xs text-[#0F4C2E] font-medium mb-2.5">
                  {lang === 'nl' ? 'Uw browser ondersteunt directe installatie:' : 'Ihr Browser unterstützt die direkte Installation:'}
                </p>
                <button
                  onClick={handleInstallClick}
                  className="w-full bg-[#0F4C2E] hover:bg-[#06301C] text-white py-2 px-4 rounded-lg text-sm font-bold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>{lang === 'nl' ? 'Nu met één klik installeren' : 'Jetzt mit einem Klick installieren'}</span>
                </button>
              </div>
            )}

            {/* Platform instructions */}
            <div className="space-y-4 text-sm text-[#374151]">
              <div className="font-semibold text-xs uppercase tracking-wider text-[#0F4C2E] border-b border-gray-100 pb-1">
                {platform === 'ios' ? '📱 Anleitung für iPhone & iPad (Safari)' : platform === 'android' ? '📱 Anleitung für Android (Chrome)' : '💻 Anleitung für PC & Mac'}
              </div>

              {platform === 'ios' ? (
                <ol className="space-y-2.5 text-[13.5px] leading-relaxed">
                  <li className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[#0F4C2E] text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">1</span>
                    <span>Tippen Sie unten in der Safari-Leiste auf das <strong className="text-[#0F4C2E] inline-flex items-center gap-1"><Share className="w-3.5 h-3.5 inline" /> Teilen-Symbol</strong> (Quadrat mit Pfeil nach oben).</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[#0F4C2E] text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">2</span>
                    <span>Scrollen Sie im Menü etwas nach unten und wählen Sie <strong>„Zum Home-Bildschirm“</strong>.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[#0F4C2E] text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">3</span>
                    <span>Tippen Sie oben rechts auf <strong>„Hinzufügen“</strong>. Fertig! Die Winterberg App ist sofort verfügbar.</span>
                  </li>
                </ol>
              ) : platform === 'android' ? (
                <ol className="space-y-2.5 text-[13.5px] leading-relaxed">
                  <li className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[#0F4C2E] text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">1</span>
                    <span>Tippen Sie oben rechts auf das <strong className="text-[#0F4C2E] inline-flex items-center gap-1"><MoreVertical className="w-3.5 h-3.5 inline" /> Drei-Punkte-Menü</strong> in Chrome.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[#0F4C2E] text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">2</span>
                    <span>Wählen Sie <strong>„App installieren“</strong> oder <strong>„Zum Startbildschirm hinzufügen“</strong>.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[#0F4C2E] text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">3</span>
                    <span>Bestätigen Sie mit <strong>„Installieren“</strong>.</span>
                  </li>
                </ol>
              ) : (
                <ol className="space-y-2.5 text-[13.5px] leading-relaxed">
                  <li className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[#0F4C2E] text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">1</span>
                    <span>Klicken Sie ganz rechts in Ihrer Browser-Adresszeile auf das <strong className="text-[#0F4C2E] inline-flex items-center gap-1"><Download className="w-3.5 h-3.5 inline" /> Installieren-Symbol</strong>.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[#0F4C2E] text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">2</span>
                    <span>Bestätigen Sie den Dialog mit <strong>„Installieren“</strong>.</span>
                  </li>
                </ol>
              )}
            </div>

            {/* Reset Button */}
            <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleResetDismissal}
                className="text-xs text-[#5F6B63] hover:text-[#0F4C2E] flex items-center gap-1 cursor-pointer"
                title="Blendet den Hinweis bei Ihrem nächsten Besuch wieder automatisch ein"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Hinweis zurücksetzen</span>
              </button>
              <button
                type="button"
                onClick={() => setShowGuideModal(false)}
                className="px-4 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-[#1B211D] text-xs font-semibold cursor-pointer transition-colors"
              >
                Schließen
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
