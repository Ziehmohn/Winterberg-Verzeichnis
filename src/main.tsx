import 'react-quill/dist/quill.snow.css';
import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { AuthProvider } from './AuthContext';
import { I18nProvider } from './i18n';

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
