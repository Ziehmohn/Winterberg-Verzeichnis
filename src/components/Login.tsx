import React, { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, sendEmailVerification, signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { useTranslation } from '../i18n';
import { ThemeConfig } from '../types';

export default function Login({ theme, activeThemeKey, onBack }: { theme: ThemeConfig, activeThemeKey: string, onBack: () => void }) {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [msg, setMsg] = useState('');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMsg('');
    setLoading(true);
    try {
      if (mode === 'login') {
        const userCred = await signInWithEmailAndPassword(auth, email, password);
        const isAdmin = userCred.user.email && (userCred.user.email.includes('sichtbar') || userCred.user.email.includes('simon.kraeling'));
        if (!isAdmin && !userCred.user.emailVerified) {
          await signOut(auth);
          throw new Error("Bitte bestätigen Sie zuerst Ihre E-Mail-Adresse. Überprüfen Sie Ihren Posteingang auf den Bestätigungslink.");
        }
        // Successful login will be handled by AuthContext listener and parent component
      } else if (mode === 'register') {
        const userCred = await createUserWithEmailAndPassword(auth, email, password);
        const isAdmin = userCred.user.email && (userCred.user.email.includes('sichtbar') || userCred.user.email.includes('simon.kraeling'));
        
        if (!isAdmin) {
          await sendEmailVerification(userCred.user);
          await signOut(auth);
          setMsg("Erfolgreich registriert! Bitte bestätigen Sie Ihre E-Mail-Adresse über den Link in Ihrem Posteingang, bevor Sie sich einloggen.");
          return;
        }
      } else if (mode === 'forgot') {
        await sendPasswordResetEmail(auth, email);
        setMsg(t("resetLinkSent"));
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || t("errorOccurred"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`w-full max-w-md mx-auto p-6 md:p-8 border ${theme.cardBg} ${theme.cardBorder} ${theme.cardShadow} ${activeThemeKey === 'modern' ? 'rounded-none' : 'rounded-xl'} mt-10`}>
      <h2 className="text-2xl font-display font-bold mb-6 text-center">
        {mode === 'login' ? 'Login' : mode === 'register' ? 'Registrieren' : 'Passwort zurücksetzen'}
      </h2>
      
      {msg && <div className="bg-emerald-100 text-emerald-800 p-4 rounded text-center mb-4 border border-emerald-200">{msg}</div>}
      {error && <div className="bg-red-100 text-red-800 p-4 rounded text-center mb-4 border border-red-200">{error}</div>}
      
      <form onSubmit={handleAuth} className="space-y-4">
        <div>
          <label className={`block text-sm font-medium mb-1 ${theme.textBase}`}>{t("email")}</label>
          <input 
            type="email" 
            required 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            className={`w-full px-4 py-2 border focus:outline-none focus:ring-2 focus:border-orange-500 focus:ring-orange-500/20 transition-all bg-white ${theme.cardBorder} ${theme.textBase} ${activeThemeKey === 'modern' ? 'rounded-none' : 'rounded-md'}`}
          />
        </div>
        {mode !== 'forgot' && (
          <div>
            <label className={`block text-sm font-medium mb-1 ${theme.textBase}`}>{t("password")}</label>
            <input 
              type="password" 
              required 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              className={`w-full px-4 py-2 border focus:outline-none focus:ring-2 focus:border-orange-500 focus:ring-orange-500/20 transition-all bg-white ${theme.cardBorder} ${theme.textBase} ${activeThemeKey === 'modern' ? 'rounded-none' : 'rounded-md'}`}
            />
          </div>
        )}
        <button type="submit" disabled={loading} className={`w-full px-6 py-2 font-medium transition-colors ${theme.primaryBtn} ${activeThemeKey === 'modern' ? 'rounded-none' : 'rounded-md'} disabled:opacity-50`}>
          {loading ? t("pleaseWait") : mode === 'login' ? 'Anmelden' : mode === 'register' ? 'Registrieren' : t("requestLink")}
        </button>
      </form>

      <div className="mt-6 flex flex-col gap-2 text-center">
        {mode === 'login' ? (
          <>
            <button type="button" onClick={() => setMode('forgot')} className={`text-sm hover:underline ${theme.textMuted}`}>{t("forgotPassword")}</button>
            <button type="button" onClick={() => setMode('register')} className={`text-sm hover:underline ${theme.textMuted}`}>{t("noAccountRegister")}</button>
          </>
        ) : (
          <button type="button" onClick={() => setMode('login')} className={`text-sm hover:underline ${theme.textMuted}`}>{t("backToLogin")}</button>
        )}
        <button type="button" onClick={onBack} className={`text-sm hover:underline ${theme.textMuted} mt-4`}>{t("cancel")}</button>
      </div>
    </div>
  );
}
