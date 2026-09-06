/**
 * PWA Helper Utilities for Winterberg Verzeichnis
 */

/**
 * Prüft, ob der Nutzer die Seite aktuell in der installierten PWA (Standalone-Modus) nutzt.
 * Damit können gezielt Features, Banner oder Navigationselemente exklusiv für die App
 * ein- oder ausgeblendet werden.
 */
export function isPwaStandalone(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as any).standalone === true ||
    document.referrer.includes('android-app://')
  );
}

/**
 * Öffnet den Installationsdialog oder das Anleitungsmodal von überall auf der Website.
 */
export function openPwaInstall(): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('open-pwa-install'));
  }
}
