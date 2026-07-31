import React, { useState, useEffect } from 'react';
import { Shield, Check, Settings, X } from 'lucide-react';
import { useTranslation } from '../i18n';
import { ThemeConfig } from '../types';

interface CookieSettings {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
  externalMedia: boolean;
}

const COOKIE_CONSENT_KEY = 'winterberg_cookie_consent';
const EXPIRY_DAYS = 180; // 6 months

export default function CookieConsent({ theme }: { theme: ThemeConfig }) {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const { t } = useTranslation();
  
  const [settings, setSettings] = useState<CookieSettings>({
    essential: true, // Always true
    analytics: false,
    marketing: false,
    externalMedia: false
  });

  useEffect(() => {
    // Check local storage on mount
    const saved = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Check if expired
        if (parsed.expires && new Date().getTime() > parsed.expires) {
          setShowBanner(true);
        } else {
          setSettings(parsed.settings);
          applyScripts(parsed.settings);
        }
      } catch(e) {
        setShowBanner(true);
      }
    } else {
      setShowBanner(true);
    }
  }, []);

  const saveConsent = (newSettings: CookieSettings) => {
    const expires = new Date().getTime() + (EXPIRY_DAYS * 24 * 60 * 60 * 1000);
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify({ settings: newSettings, expires }));
    setSettings(newSettings);
    setShowBanner(false);
    setShowSettings(false);
    applyScripts(newSettings);
  };

  const handleAcceptAll = () => {
    saveConsent({ essential: true, analytics: true, marketing: true, externalMedia: true });
  };

  const handleAcceptEssential = () => {
    saveConsent({ essential: true, analytics: false, marketing: false, externalMedia: false });
  };

  const handleSaveSettings = () => {
    saveConsent(settings);
  };

  const applyScripts = (currentSettings: CookieSettings) => {
    // Google Analytics Injection
    if (currentSettings.analytics) {
      if (!document.getElementById('ga-script')) {
        const script1 = document.createElement('script');
        script1.id = 'ga-script';
        script1.async = true;
        // The measurement ID from your firebase config
        script1.src = 'https://www.googletagmanager.com/gtag/js?id=G-MXFC2V1GXZ';
        document.head.appendChild(script1);

        const script2 = document.createElement('script');
        script2.id = 'ga-inline';
        script2.innerHTML = `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-MXFC2V1GXZ', { 'anonymize_ip': true });
        `;
        document.head.appendChild(script2);
      }
    } else {
      // Remove scripts if revoked
      const script1 = document.getElementById('ga-script');
      const script2 = document.getElementById('ga-inline');
      if (script1) script1.remove();
      if (script2) script2.remove();
      
      // Attempt to clear GA cookies
      document.cookie.split(";").forEach((c) => {
        if (c.trim().startsWith("_ga")) {
          document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
        }
      });
    }
    
    // Future scripts (Marketing, External Media) can be handled here similarly.
  };

  return (
    <>
      {/* Fingerprint Button (Floating) */}
      {!showBanner && (
        <button
          onClick={() => setShowBanner(true)}
          className="fixed bottom-6 left-6 z-50 p-3 bg-white border border-gray-200 rounded-full shadow-lg hover:bg-gray-50 transition-all hover:scale-110 group"
          title="Cookie-Einstellungen öffnen"
        >
          <Shield className="w-6 h-6 text-orange-500 group-hover:scale-110 transition-transform" />
        </button>
      )}

      {/* Backdrop & Banner */}
      {showBanner && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-10 sm:zoom-in-95 duration-300 relative">
            {!showSettings ? (
              <div className="p-6 md:p-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center shrink-0">
                    <Shield className="w-6 h-6 text-orange-500 group-hover:scale-110 transition-transform" />
                  </div>
                  <h2 className="text-2xl font-bold font-display">Datenschutz & Cookies</h2>
                </div>
                <p className="text-gray-600 mb-8 leading-relaxed">
                  Wir nutzen Cookies auf unserer Website. Einige von ihnen sind essenziell, während andere uns helfen, diese Website und deine Erfahrung zu verbessern. Du kannst selbst entscheiden, ob du die nicht essenziellen Cookies zulassen möchtest.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <button onClick={handleAcceptAll} className="flex-1 px-6 py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-colors shadow-md">
                    Alle akzeptieren
                  </button>
                  <button onClick={handleAcceptEssential} className="flex-1 px-6 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-xl transition-colors border border-gray-200">
                    Nur essenzielle
                  </button>
                </div>
                <div className="mt-5 text-center">
                  <button onClick={() => setShowSettings(true)} className="text-sm text-gray-500 hover:text-orange-600 underline underline-offset-4 font-medium">
                    Individuelle Einstellungen
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col max-h-[85vh]">
                <div className="p-5 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
                  <h2 className="text-xl font-bold">Cookie-Einstellungen</h2>
                  <button onClick={() => setShowSettings(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="p-6 overflow-y-auto flex-1 space-y-4">
                  {/* Essential */}
                  <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <div className="mt-1">
                      <input type="checkbox" checked disabled className="w-5 h-5 accent-orange-500 cursor-not-allowed" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">Essenziell (Immer aktiv)</h3>
                      <p className="text-sm text-gray-600 mt-1">Diese Cookies werden für die grundlegenden Funktionen der Webseite benötigt, z.B. für den Login und das Speichern dieser Cookie-Einstellungen.</p>
                    </div>
                  </div>

                  {/* Analytics */}
                  <div className="flex items-start gap-4 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => setSettings({...settings, analytics: !settings.analytics})}>
                    <div className="mt-1">
                      <input type="checkbox" checked={settings.analytics} onChange={() => {}} className="w-5 h-5 accent-orange-500 cursor-pointer pointer-events-none" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">Statistiken (Google Analytics)</h3>
                      <p className="text-sm text-gray-600 mt-1">Erfasst anonymisierte Daten (z.B. besuchte Seiten, Verweildauer) zur Verbesserung unseres Angebots. <br/><b>Anbieter:</b> Google Ireland Limited.<br/><b>Speicherdauer:</b> bis zu 2 Jahre.</p>
                    </div>
                  </div>

                  {/* Marketing */}
                  <div className="flex items-start gap-4 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => setSettings({...settings, marketing: !settings.marketing})}>
                    <div className="mt-1">
                      <input type="checkbox" checked={settings.marketing} onChange={() => {}} className="w-5 h-5 accent-orange-500 cursor-pointer pointer-events-none" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">Marketing</h3>
                      <p className="text-sm text-gray-600 mt-1">Wird verwendet, um personalisierte Werbeanzeigen auszuspielen und deren Erfolg über Websites hinweg zu messen (z.B. Facebook Pixel).</p>
                    </div>
                  </div>

                  {/* External Media */}
                  <div className="flex items-start gap-4 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => setSettings({...settings, externalMedia: !settings.externalMedia})}>
                    <div className="mt-1">
                      <input type="checkbox" checked={settings.externalMedia} onChange={() => {}} className="w-5 h-5 accent-orange-500 cursor-pointer pointer-events-none" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">Externe Medien</h3>
                      <p className="text-sm text-gray-600 mt-1">Erlaubt das Laden von Inhalten von Drittanbietern wie eingebetteten YouTube-Videos oder Google Maps-Karten.</p>
                    </div>
                  </div>
                </div>

                <div className="p-6 border-t border-gray-100 bg-white sticky bottom-0 z-10">
                  <button onClick={handleSaveSettings} className="w-full py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-colors shadow-md">
                    Auswahl speichern
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
