import React, { useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { TrackingScript } from '../types';

const COOKIE_CONSENT_KEY = 'winterberg_cookie_consent';

export default function DynamicScriptLoader() {
  useEffect(() => {
    let isMounted = true;
    
    const loadScripts = async () => {
      // 1. Get consent
      const saved = localStorage.getItem(COOKIE_CONSENT_KEY);
      if (!saved) return;
      
      let consentSettings;
      try {
        const parsed = JSON.parse(saved);
        if (parsed.expires && new Date().getTime() > parsed.expires) return;
        consentSettings = parsed.settings;
      } catch(e) {
        return;
      }
      if (!consentSettings) return;

      // 2. Fetch scripts from DB
      try {
        const snap = await getDocs(collection(db, 'scripts'));
        const scripts: TrackingScript[] = [];
        snap.forEach(d => {
          scripts.push({ id: d.id, ...d.data() } as TrackingScript);
        });

        if (!isMounted) return;

        // 3. Inject scripts based on consent
        scripts.forEach(script => {
          if (!script.isActive) return;
          
          const isAllowed = 
            (script.category === 'analytics' && consentSettings.analytics) ||
            (script.category === 'marketing' && consentSettings.marketing) ||
            (script.category === 'externalMedia' && consentSettings.externalMedia);

          if (isAllowed) {
            // Check if already injected
            if (document.getElementById(script.id)) return;

            // Simple parser to extract script tags and their content
            const template = document.createElement('template');
            template.innerHTML = script.code.trim();
            
            Array.from(template.content.childNodes).forEach((node) => {
              if (node.nodeName.toLowerCase() === 'script') {
                const oldScript = node as HTMLScriptElement;
                const newScript = document.createElement('script');
                newScript.id = script.id; // Mark as injected
                
                // Copy attributes (src, async, defer, type)
                Array.from(oldScript.attributes).forEach(attr => {
                  newScript.setAttribute(attr.name, attr.value);
                });
                
                // Copy inline code
                newScript.text = oldScript.text;
                
                document.head.appendChild(newScript);
              }
            });
          }
        });
      } catch (e) {
        console.error("Error loading dynamic scripts:", e);
      }
    };

    loadScripts();

    // Listen for custom event from CookieConsent component
    const handleConsentUpdate = () => {
      loadScripts();
    };
    window.addEventListener('cookie_consent_updated', handleConsentUpdate);

    return () => {
      isMounted = false;
      window.removeEventListener('cookie_consent_updated', handleConsentUpdate);
    };
  }, []);

  return null; // This component doesn't render anything
}
