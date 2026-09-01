/**
 * Google Analytics Helper for Winterberg Verzeichnis
 * Property ID: 302481363
 */

export const GA_PROPERTY_ID = '302481363';

declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
  }
}

export function trackPageView(path: string, title?: string) {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    try {
      window.gtag('event', 'page_view', {
        page_path: path,
        page_title: title || (typeof document !== 'undefined' ? document.title : ''),
        page_location: window.location.href
      });
      window.gtag('config', GA_PROPERTY_ID, {
        page_path: path,
        page_title: title || (typeof document !== 'undefined' ? document.title : '')
      });
    } catch (e) {
      // Ignore in development/offline
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
