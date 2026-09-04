import React, { useState, useEffect } from 'react';
import { Download, Smartphone, X, Check } from 'lucide-react';

export default function PwaInstallPrompt({ lang = 'de' }: { lang?: 'de' | 'nl' }) {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
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
      // Check if user dismissed prompt recently
      const dismissed = localStorage.getItem('wb_pwa_prompt_dismissed');
      if (!dismissed || Date.now() - parseInt(dismissed, 10) > 14 * 24 * 60 * 60 * 1000) {
        setShowPrompt(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      alert(lang === 'nl' 
        ? 'Om te installeren op iOS: Tik op het "Deel"-icoon in Safari en selecteer "Zet op beginscherm".'
        : 'Zur Installation auf iPhone/iPad: Tippen Sie im Safari-Browser auf das "Teilen"-Symbol und wählen Sie "Zum Home-Bildschirm".');
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstalled(true);
      setShowPrompt(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('wb_pwa_prompt_dismissed', Date.now().toString());
  };

  if (isInstalled || !showPrompt) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[99] max-w-sm w-[calc(100vw-2rem)] bg-white border border-[#E7E2DA] rounded-2xl shadow-2xl p-4 transition-all animate-in fade-in slide-in-from-bottom-5">
      <button 
        onClick={handleDismiss}
        className="absolute top-2.5 right-2.5 text-gray-400 hover:text-gray-600 p-1 rounded-full"
        aria-label="Schließen"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-xl bg-[#0F4C2E] text-white flex items-center justify-center shrink-0 shadow-md">
          <Smartphone className="w-6 h-6 text-[#FCD34D]" />
        </div>
        <div className="flex-1 pr-4">
          <h4 className="font-display font-bold text-[15px] text-[#1B211D] leading-tight mb-1">
            {lang === 'nl' ? 'Als App installeren' : 'Als App installieren'}
          </h4>
          <p className="text-[12.5px] text-[#5F6B63] leading-snug mb-3">
            {lang === 'nl' 
              ? 'Installeer het Winterberg-overzicht direct op je telefoon of computer voor snellere toegang & offline gebruik.'
              : 'Nutzen Sie das Winterberg-Verzeichnis wie eine native App: Schneller Zugriff, Spritpreise & Notdienste direkt auf Ihrem Startbildschirm.'}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={handleInstallClick}
              className="bg-[#0F4C2E] hover:bg-[#06301C] text-white px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{lang === 'nl' ? 'Nu installeren' : 'Jetzt installieren'}</span>
            </button>
            <button
              onClick={handleDismiss}
              className="text-xs text-[#5F6B63] hover:text-[#1B211D] px-2 py-1.5"
            >
              {lang === 'nl' ? 'Later' : 'Später'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
