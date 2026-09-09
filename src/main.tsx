import ReactDOM from 'react-dom';
import React, { StrictMode } from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { AuthProvider } from './AuthContext';
import { I18nProvider } from './i18n';

// React 19 polyfill for legacy libraries (like react-quill) that rely on ReactDOM.findDOMNode
if (typeof window !== 'undefined' && !(ReactDOM as any).findDOMNode) {
  (ReactDOM as any).findDOMNode = (inst: any) => {
    if (!inst) return null;
    if (inst instanceof HTMLElement) return inst;
    if (inst.current instanceof HTMLElement) return inst.current;
    return null;
  };
}


let initialLang: 'de' | 'nl' = 'de';
if (typeof window !== 'undefined') {
  const path = window.location.pathname;
  if (path.startsWith('/nl/') || path === '/nl') {
    initialLang = 'nl';
  }
}

class RootErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean; error: Error | null }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error("RootErrorBoundary caught fatal error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F8F9FA', fontFamily: 'system-ui, sans-serif', padding: '20px' }}>
          <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: '16px', padding: '32px', maxWidth: '520px', width: '100%', textAlign: 'center', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }}>
            <h1 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1F2937', marginBottom: '12px' }}>Seite konnte nicht geladen werden</h1>
            <p style={{ fontSize: '14px', color: '#4B5563', marginBottom: '24px', lineHeight: '1.5' }}>
              Ein unerwarteter Fehler ist aufgetreten. Bitte laden Sie die Seite neu oder kehren Sie zur Startseite zurück.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button 
                onClick={() => window.location.reload()} 
                style={{ background: '#0F4C2E', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}
              >
                Neu laden
              </button>
              <a 
                href="/" 
                style={{ background: '#F3F4F6', color: '#374151', border: '1px solid #D1D5DB', padding: '10px 20px', borderRadius: '8px', fontWeight: '600', textDecoration: 'none', display: 'inline-block' }}
              >
                Zur Startseite
              </a>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RootErrorBoundary>
      <AuthProvider>
        <I18nProvider initialLang={initialLang}>
          <App />
        </I18nProvider>
      </AuthProvider>
    </RootErrorBoundary>
  </StrictMode>,
);

// Clean up skeleton styles after React has mounted
const skeletonStyles = document.getElementById('skeleton-styles');
if (skeletonStyles) skeletonStyles.remove();
