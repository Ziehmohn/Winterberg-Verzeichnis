import ReactGA from "react-ga4";

/**
 * Google Analytics Helper for Winterberg Verzeichnis
 * Property ID: 302481363 / Measurement ID: G-86EMTRTX80
 */

export const DEFAULT_GA_ID = 'G-86EMTRTX80';

export function getGoogleAnalyticsId(): string {
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem('seoSettings');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.googleAnalyticsId && parsed.googleAnalyticsId.trim()) {
          return parsed.googleAnalyticsId.trim();
        }
      }
    } catch (e) {
      // Ignore
    }
  }
  return DEFAULT_GA_ID;
}

export function initGA(gaId: string = DEFAULT_GA_ID) {
  if (typeof window !== 'undefined') {
    ReactGA.initialize(gaId);
  }
}

export function trackPageView(path: string, title?: string) {
  if (typeof window !== 'undefined') {
    const pageTitle = title || document.title || 'Winterberg Verzeichnis';
    ReactGA.send({ hitType: "pageview", page: path, title: pageTitle });
  }
}

export function updateConsent(analytics: boolean, marketing: boolean) {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('consent', 'update', {
      'analytics_storage': analytics ? 'granted' : 'denied',
      'ad_storage': marketing ? 'granted' : 'denied',
      'ad_user_data': marketing ? 'granted' : 'denied',
      'ad_personalization': marketing ? 'granted' : 'denied'
    });
  }
}

export function trackEvent(action: string, category: string, label?: string, value?: number) {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    try {
      window.gtag('event', action, {
        event_category: category,
        event_label: label,
        value: value
      });
    } catch (e) {
      // Ignore
    }
  }
}
