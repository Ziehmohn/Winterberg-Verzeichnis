import ReactDOM from 'react-dom';
import {StrictMode} from 'react';
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

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <I18nProvider initialLang={initialLang}>
        <App />
      </I18nProvider>
    </AuthProvider>
  </StrictMode>,
);
