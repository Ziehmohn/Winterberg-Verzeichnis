export function loadGoogleFont(fontName: string) {
  if (!fontName || typeof document === 'undefined') return;
  const cleanFont = fontName.trim().replace(/\s+/g, '+');
  const id = `google-font-${cleanFont.toLowerCase()}`;
  if (!document.getElementById(id)) {
    const link = document.createElement('link');
    link.id = id;
    link.rel = 'stylesheet';
    link.href = `https://fonts.googleapis.com/css2?family=${cleanFont}:wght@300;400;500;600;700;800&display=swap`;
    document.head.appendChild(link);
  }
}
