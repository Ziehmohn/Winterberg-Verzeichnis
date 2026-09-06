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

    // Check if early deferred prompt is already present on window
    if ((window as any).__wb_deferredPrompt) {
      setDeferredPrompt((window as any).__wb_deferredPrompt);
    }

    const handlePromptAvailable = () => {
      if ((window as any).__wb_deferredPrompt) {
        setDeferredPrompt((window as any).__wb_deferredPrompt);
      }
    };
    window.addEventListener('wb-prompt-available', handlePromptAvailable);

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

    // Check if user chose "Nicht mehr nachfragen"
    const neverAsk = localStorage.getItem('wb_pwa_never_ask');
    const dismissed = localStorage.getItem('wb_pwa_prompt_dismissed');
    const shouldShow = neverAsk !== 'true' && (!dismissed || Date.now() - parseInt(dismissed, 10) > 24 * 60 * 60 * 1000);

    // On iOS (which never fires beforeinstallprompt), show prompt banner directly if eligible
    if (isIos && shouldShow) {
      // Show banner after a gentle delay
      setTimeout(() => {
        setShowPrompt(true);
      }, 1500);
    }

    // 3. Listen for browser install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      (window as any).__wb_deferredPrompt = e;

      if (shouldShow) {
        setShowPrompt(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // If deferred prompt was already captured before this hook mounted, show prompt if eligible
    if ((window as any).__wb_deferredPrompt && shouldShow) {
      setShowPrompt(true);
    }

    // 4. Custom event listener for manual trigger ("App installieren" buttons across site)
    const handleManualOpen = () => {
      localStorage.removeItem('wb_pwa_prompt_dismissed');
      localStorage.removeItem('wb_pwa_never_ask');
      
      const promptToUse = deferredPrompt || (window as any).__wb_deferredPrompt;
      if (promptToUse) {
        try {
          promptToUse.prompt();
          promptToUse.userChoice.then(({ outcome }: any) => {
            if (outcome === 'accepted') {
              setIsInstalled(true);
              setShowPrompt(false);
              setShowGuideModal(false);
            }
          });
          return;
        } catch (e) {
          console.warn('Install prompt error in manual open:', e);
        }
      }
      // If native prompt is not available (e.g. iOS Safari), show modal / guide
      setShowGuideModal(true);
    };

    window.addEventListener('open-pwa-install', handleManualOpen);
    (window as any).__wb_openPwaInstall = handleManualOpen;

    return () => {
      window.removeEventListener('wb-prompt-available', handlePromptAvailable);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('open-pwa-install', handleManualOpen);
    };
  }, []);

  const handleInstallClick = async (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const promptToUse = deferredPrompt || (window as any).__wb_deferredPrompt;
    if (promptToUse) {
      try {
        await promptToUse.prompt();
        const choice = await promptToUse.userChoice;
        if (choice && choice.outcome === 'accepted') {
          setIsInstalled(true);
          setShowPrompt(false);
          setShowGuideModal(false);
        }
        setDeferredPrompt(null);
        (window as any).__wb_deferredPrompt = null;
        return;
      } catch (err) {
        console.warn('Install prompt error:', err);
      }
    }

    // If native prompt is not available (e.g. iOS Safari, or already triggered once),
    // open the helpful step-by-step modal guide immediately
    setShowGuideModal(true);
  };

  const handleDismissLater = () => {
    setShowPrompt(false);
    // Dismiss temporarily for 24 hours
    localStorage.setItem('wb_pwa_prompt_dismissed', Date.now().toString());
  };

  const handleNeverAskAgain = () => {
    setShowPrompt(false);
    // Dismiss permanently
    localStorage.setItem('wb_pwa_never_ask', 'true');
  };

  const handleResetDismissal = () => {
    localStorage.removeItem('wb_pwa_prompt_dismissed');
    localStorage.removeItem('wb_pwa_never_ask');
    setShowGuideModal(false);
    setShowPrompt(true);
  };

  return (
    <>
      {/* 1. Floating Bottom Banner (auto-prompt) */}
      {!isInstalled && showPrompt && !showGuideModal && (
        <div className="fixed bottom-4 right-4 z-[99] max-w-sm w-[calc(100vw-2rem)] bg-white border border-[#E7E2DA] rounded-2xl shadow-2xl p-4 transition-all animate-in fade-in slide-in-from-bottom-5">
          <button 
            onClick={handleDismissLater}
            className="absolute top-2.5 right-2.5 text-gray-400 hover:text-gray-600 p-1 rounded-full cursor-pointer"
            title={lang === 'nl' ? 'Sluiten (later herinneren)' : 'Schließen (später erinnern)'}
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
              <div className="flex items-center gap-2 flex-wrap pt-0.5">
                <button
                  onClick={handleInstallClick}
                  className="bg-[#0F4C2E] hover:bg-[#06301C] text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{lang === 'nl' ? 'Nu installeren' : 'Jetzt installieren'}</span>
                </button>
                <button
                  onClick={handleDismissLater}
                  className="bg-[#FAF8F5] hover:bg-[#EDE8E0] text-[#1B211D] border border-[#EDE8E0] px-2.5 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors"
                >
                  {lang === 'nl' ? 'Later' : 'Später'}
                </button>
                <button
                  onClick={handleNeverAskAgain}
                  className="text-[11px] text-[#8A928B] hover:text-[#DC2626] transition-colors cursor-pointer px-1 py-1 underline-offset-2 hover:underline"
                >
                  {lang === 'nl' ? 'Niet meer vragen' : 'Nicht mehr nachfragen'}
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

            {/* Platform instructions */}
            <div className="space-y-4 text-sm text-[#374151]">
              {platform === 'ios' ? (
                <div>
                  <div className="font-semibold text-xs uppercase tracking-wider text-[#0F4C2E] border-b border-gray-100 pb-2 mb-3">
                    📱 Installation auf dem iPhone / iPad
                  </div>
                  <p className="text-xs text-[#5F6B63] mb-3">
                    {lang === 'nl'
                      ? 'Apple staat installaties in Safari alleen toe via het deel-menu van uw telefoon:'
                      : 'Apple erlaubt in Safari die Installation direkt über das iOS-Teilen-Menü Ihres iPhones:'}
                  </p>
                  <ol className="space-y-3 text-[13.5px] leading-relaxed">
                    <li className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-[#0F4C2E] text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">1</span>
                      <span>Tippen Sie unten in der Safari-Menüleiste auf das <strong className="text-[#0F4C2E] inline-flex items-center gap-1 font-semibold"><Share className="w-4 h-4 inline text-[#0F4C2E]" /> Teilen-Symbol</strong>.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-[#0F4C2E] text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">2</span>
                      <span>Wischen Sie etwas nach oben und tippen Sie auf <strong className="text-[#1B211D]">„Zum Home-Bildschirm“</strong>.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-[#0F4C2E] text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">3</span>
                      <span>Oben rechts auf <strong className="text-[#0F4C2E]">„Hinzufügen“</strong> tippen – fertig!</span>
                    </li>
                  </ol>
                </div>
              ) : (
                <div>
                  <div className="font-semibold text-xs uppercase tracking-wider text-[#0F4C2E] border-b border-gray-100 pb-2 mb-3">
                    {platform === 'android' ? '📱 Installation auf Android' : '💻 Installation am Desktop'}
                  </div>
                  <p className="text-xs text-[#5F6B63] mb-3">
                    {lang === 'nl'
                      ? 'Klik op de knop om de app direct te installeren:'
                      : 'Klicken Sie auf den Button, um die Installation im Browser zu starten:'}
                  </p>
                  <button
                    onClick={handleInstallClick}
                    className="w-full bg-[#0F4C2E] hover:bg-[#06301C] text-white py-3 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer mb-3"
                  >
                    <Download className="w-4 h-4" />
                    <span>{lang === 'nl' ? 'Nu installeren' : 'Jetzt installieren'}</span>
                  </button>
                  <div className="bg-[#FAF8F5] p-3 rounded-lg border border-[#EDE8E0] text-[12px] text-[#5F6B63] space-y-1.5">
                    <p className="font-semibold text-[#1B211D]">Falls Ihr Browser keinen Dialog anzeigt:</p>
                    <p>• <strong>Chrome / Android:</strong> Tippen Sie oben rechts auf die drei Punkte <strong>(⋮)</strong> und wählen Sie <strong>„App installieren“</strong> oder <strong>„Zum Startbildschirm hinzufügen“</strong>.</p>
                    <p>• <strong>Desktop:</strong> Klicken Sie in der Browser-Adressleiste auf das Installieren-Symbol.</p>
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
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
