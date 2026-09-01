/**
 * Google Analytics Helper for Winterberg Verzeichnis
 * Property ID: 302481363 / Configurable Measurement ID (G-XXXXXXXXXX)
 */

export const DEFAULT_GA_ID = '302481363';

declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
  }
}

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

export function trackPageView(path: string, title?: string) {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    try {
      const gaId = getGoogleAnalyticsId();
      const tagId = gaId.startsWith('G-') || gaId.startsWith('GT-') ? gaId : `G-${gaId}`;
      const pageTitle = title || (typeof document !== 'undefined' ? document.title : '');

      window.gtag('event', 'page_view', {
        page_path: path,
        page_title: pageTitle,
        page_location: window.location.href
      });

      window.gtag('config', gaId, {
        page_path: path,
        page_title: pageTitle
      });

      if (tagId !== gaId) {
        window.gtag('config', tagId, {
          page_path: path,
          page_title: pageTitle
        });
      }
    } catch (e) {
      // Ignore
    }
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
