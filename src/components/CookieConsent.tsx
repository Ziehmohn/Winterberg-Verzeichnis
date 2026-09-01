import React, { useState, useEffect } from 'react';
import { Shield, Check, Settings, X } from 'lucide-react';
import { useTranslation } from '../i18n';
import { ThemeConfig } from '../types';
import { getGoogleAnalyticsId, trackPageView } from '../utils/analytics';

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
  const { lang } = useTranslation();
  const isNl = lang === 'nl';
  
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
      let parsedSettings: CookieSettings | null = null;
      try {
        const parsed = JSON.parse(saved);
        // Check if expired
        if (parsed.expires && new Date().getTime() > parsed.expires) {
          setShowBanner(true);
        } else {
          parsedSettings = parsed.settings;
          setSettings(parsed.settings);
        }
      } catch(e) {
        setShowBanner(true);
      }
      
      if (parsedSettings) {
        try {
          applyScripts(parsedSettings);
        } catch (scriptErr) {
          console.error("Error applying scripts:", scriptErr);
        }
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
    
    // Dispatch event to notify DynamicScriptLoader
    window.dispatchEvent(new Event('cookie_consent_updated'));
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
    // Google Analytics Injection (Property ID: 302481363 / Configurable G-ID)
    if (currentSettings.analytics) {
      if (!document.getElementById('ga-script')) {
        const gaId = getGoogleAnalyticsId();
        const tagId = gaId.startsWith('G-') || gaId.startsWith('GT-') ? gaId : `G-${gaId}`;

        const script1 = document.createElement('script');
        script1.id = 'ga-script';
        script1.async = true;
        script1.src = `https://www.googletagmanager.com/gtag/js?id=${tagId}`;
        document.head.appendChild(script1);

        const script2 = document.createElement('script');
        script2.id = 'ga-inline';
        script2.innerHTML = `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}', { 'anonymize_ip': true, 'send_page_view': true });
          if ('${gaId}' !== '${tagId}') {
            gtag('config', '${tagId}', { 'anonymize_ip': true, 'send_page_view': true });
          }
          gtag('config', 'G-MXFC2V1GXZ', { 'anonymize_ip': true, 'send_page_view': true });
        `;
        document.head.appendChild(script2);

        // Send initial pageview
        setTimeout(() => {
          trackPageView(window.location.pathname, document.title);
        }, 150);
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
  };

  return (
    <>
      {/* Fingerprint Button (Floating) */}
      {!showBanner && (
        <button
          onClick={() => setShowBanner(true)}
          className="fixed bottom-6 left-6 z-50 p-3 bg-white border border-[#E7E2DA] rounded-full shadow-[0_4px_16px_rgba(0,0,0,0.12)] hover:bg-[#FAF8F5] transition-all hover:scale-110 group cursor-pointer"
          title={isNl ? "Cookie-instellingen openen" : "Cookie-Einstellungen öffnen"}
        >
          <Shield className="w-5 h-5 text-[#0F4C2E] group-hover:text-[#F2761B] transition-colors" />
        </button>
      )}

      {/* Backdrop & Banner */}
      {showBanner && (
        <div className="fixed inset-0 z-[1000] flex items-end justify-center sm:items-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-10 sm:zoom-in-95 duration-300 relative border border-[#EDE8E0]">
            {!showSettings ? (
              <div className="p-6 md:p-8">
                <div className="flex items-center gap-3.5 mb-4">
                  <div className="w-11 h-11 bg-[#E8F1EB] rounded-lg flex items-center justify-center shrink-0">
                    <Shield className="w-6 h-6 text-[#0F4C2E]" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold font-display text-[#1B211D]">
                      {isNl ? 'Privacy & Cookies' : 'Datenschutz & Cookies'}
                    </h2>
                    <span className="text-xs text-[#8A928B]">
                      {isNl ? 'Winterberg Bedrijvengids' : 'Das Winterberg Verzeichnis'}
                    </span>
                  </div>
                </div>
                <p className="text-[14.5px] text-[#5F6B63] mb-6 leading-relaxed">
                  {isNl 
                    ? 'Wij gebruiken cookies en webanalyse (Google Analytics) om het gebruik van onze website te meten en uw gebruikerservaring te verbeteren. U kunt zelf kiezen welke categorieën u wilt toestaan.' 
                    : 'Wir nutzen Cookies und Webanalyse (Google Analytics), um die Nutzung unserer Plattform zu messen und Ihr Nutzungserlebnis stetig zu verbessern. Sie können selbst entscheiden, welche Cookies Sie zulassen möchten.'}
                </p>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <button 
                    onClick={handleAcceptAll} 
                    className="flex-1 px-5 py-3 bg-[#0F4C2E] hover:bg-[#06301C] text-white font-bold rounded-lg transition-colors shadow-md text-sm"
                  >
                    {isNl ? 'Alles accepteren' : 'Alle akzeptieren'}
                  </button>
                  <button 
                    onClick={handleAcceptEssential} 
                    className="flex-1 px-5 py-3 bg-[#FAF8F5] hover:bg-[#F3F0EA] text-[#1B211D] font-bold rounded-lg transition-colors border border-[#E7E2DA] text-sm"
                  >
                    {isNl ? 'Alleen noodzakelijk' : 'Nur essenzielle'}
                  </button>
                </div>
                <div className="mt-4 text-center">
                  <button 
                    onClick={() => setShowSettings(true)} 
                    className="text-xs text-[#5F6B63] hover:text-[#0F4C2E] underline underline-offset-4 font-semibold cursor-pointer"
                  >
                    {isNl ? 'Individuele instellingen aanpassen' : 'Individuelle Einstellungen anpassen'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col max-h-[85vh]">
                <div className="p-5 border-b border-[#EDE8E0] flex items-center justify-between sticky top-0 bg-white z-10">
                  <h2 className="text-lg font-bold text-[#1B211D] font-display">
                    {isNl ? 'Cookie-instellingen' : 'Cookie-Einstellungen'}
                  </h2>
                  <button onClick={() => setShowSettings(false)} className="p-1.5 hover:bg-gray-100 rounded-md transition-colors text-gray-500">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="p-6 overflow-y-auto flex-1 space-y-3.5 text-[13.5px]">
                  {/* Essential */}
                  <div className="flex items-start gap-3.5 p-3.5 bg-[#FAF8F5] rounded-lg border border-[#EDE8E0]">
                    <div className="mt-0.5">
                      <input type="checkbox" checked disabled className="w-4 h-4 accent-[#0F4C2E] cursor-not-allowed rounded" />
                    </div>
                    <div>
                      <h3 className="font-bold text-[#1B211D]">
                        {isNl ? 'Noodzakelijk (Altijd actief)' : 'Essenziell (Immer aktiv)'}
                      </h3>
                      <p className="text-xs text-[#5F6B63] mt-1">
                        {isNl 
                          ? 'Vereist voor basisfuncties van de website, bijv. inloggen en het opslaan van deze cookie-instellingen.' 
                          : 'Diese Cookies werden für die grundlegenden Funktionen der Webseite benötigt, z.B. für den Login und das Speichern dieser Cookie-Einstellungen.'}
                      </p>
                    </div>
                  </div>

                  {/* Analytics */}
                  <div 
                    className="flex items-start gap-3.5 p-3.5 border border-[#EDE8E0] rounded-lg hover:bg-[#FAF8F5] transition-colors cursor-pointer" 
                    onClick={() => setSettings({...settings, analytics: !settings.analytics})}
                  >
                    <div className="mt-0.5">
                      <input 
                        type="checkbox" 
                        checked={settings.analytics} 
                        onChange={() => {}} 
                        className="w-4 h-4 accent-[#0F4C2E] cursor-pointer pointer-events-none rounded" 
                      />
                    </div>
                    <div>
                      <h3 className="font-bold text-[#1B211D]">
                        {isNl ? 'Statistieken & Analyse (Google Analytics)' : 'Statistiken & Webanalyse (Google Analytics)'}
                      </h3>
                      <p className="text-xs text-[#5F6B63] mt-1">
                        {isNl 
                          ? 'Verzamelt geanonimiseerde gegevens (Property ID 302481363) om bezoekersaantallen en paginabezoeken te meten met geactiveerde IP-anonimisering.' 
                          : 'Erfasst anonymisierte Daten (Property ID 302481363, z. B. besuchte Seiten, Verweildauer) mit aktivierter IP-Anonymisierung zur Verbesserung des Angebots.'}
                      </p>
                    </div>
                  </div>

                  {/* Marketing */}
                  <div 
                    className="flex items-start gap-3.5 p-3.5 border border-[#EDE8E0] rounded-lg hover:bg-[#FAF8F5] transition-colors cursor-pointer" 
                    onClick={() => setSettings({...settings, marketing: !settings.marketing})}
                  >
                    <div className="mt-0.5">
                      <input 
                        type="checkbox" 
                        checked={settings.marketing} 
                        onChange={() => {}} 
                        className="w-4 h-4 accent-[#0F4C2E] cursor-pointer pointer-events-none rounded" 
                      />
                    </div>
                    <div>
                      <h3 className="font-bold text-[#1B211D]">
                        {isNl ? 'Marketing & Externe advertenties' : 'Marketing & Kampagnen'}
                      </h3>
                      <p className="text-xs text-[#5F6B63] mt-1">
                        {isNl 
                          ? 'Optionele scripts van derden om het bereik van advertentiecampagnes te analyseren.' 
                          : 'Wird verwendet, um Werbeanzeigen und deren Erfolg über Websites hinweg zu messen.'}
                      </p>
                    </div>
                  </div>

                  {/* External Media */}
                  <div 
                    className="flex items-start gap-3.5 p-3.5 border border-[#EDE8E0] rounded-lg hover:bg-[#FAF8F5] transition-colors cursor-pointer" 
                    onClick={() => setSettings({...settings, externalMedia: !settings.externalMedia})}
                  >
                    <div className="mt-0.5">
                      <input 
                        type="checkbox" 
                        checked={settings.externalMedia} 
                        onChange={() => {}} 
                        className="w-4 h-4 accent-[#0F4C2E] cursor-pointer pointer-events-none rounded" 
                      />
                    </div>
                    <div>
                      <h3 className="font-bold text-[#1B211D]">
                        {isNl ? 'Externe media & Kaarten' : 'Externe Medien & Karten'}
                      </h3>
                      <p className="text-xs text-[#5F6B63] mt-1">
                        {isNl 
                          ? 'Staat het inladen van externe content zoals Google Maps of video\'s toe.' 
                          : 'Erlaubt das Laden von Inhalten von Drittanbietern wie Google Maps-Karten oder externen Medien.'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 border-t border-[#EDE8E0] bg-white sticky bottom-0 z-10">
                  <button 
                    onClick={handleSaveSettings} 
                    className="w-full py-2.5 bg-[#0F4C2E] hover:bg-[#06301C] text-white font-bold rounded-lg transition-colors text-sm shadow-md"
                  >
                    {isNl ? 'Selectie opslaan' : 'Auswahl speichern'}
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
