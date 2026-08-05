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
    <main className="flex-1 max-w-[440px] mx-auto w-full px-6 py-[70px] pb-[90px]">
      <div className="bg-white border border-[#EDE8E0] rounded-[22px] p-8 shadow-[0_10px_30px_rgba(27,33,29,0.06)]">
        <h1 className="font-display text-[26px] font-bold mb-2">
          {mode === 'login' ? 'Anmeldung' : mode === 'register' ? 'Registrieren' : 'Passwort zurücksetzen'}
        </h1>
        <p className="text-[15px] text-[#5F6B63] mb-[22px]">
          {mode === 'login' ? 'Adminbereich und Unternehmens-Dashboard.' : mode === 'register' ? 'Neues Konto anlegen.' : 'Geben Sie Ihre E-Mail ein, um einen Link zu erhalten.'}
        </p>

        {msg && <div className="bg-[#E8F1EB] text-[#0F4C2E] p-4 rounded-[12px] text-center mb-4 text-[14px]">{msg}</div>}
        {error && <div className="bg-[#FBEAE7] text-[#C0392B] p-4 rounded-[12px] text-center mb-4 text-[14px]">{error}</div>}
        
        <form onSubmit={handleAuth} className="grid gap-[14px]">
          <label className="grid gap-[7px] text-[14px] font-semibold">
            E-Mail
            <input 
              type="email" 
              required 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              placeholder="name@beispiel.de"
              className="border border-[#E7E2DA] rounded-[12px] px-[14px] py-[13px] text-[15px] font-normal bg-[#FAF8F5] focus:outline-none focus:border-[#0F4C2E] transition-colors"
            />
          </label>
          
          {mode !== 'forgot' && (
            <label className="grid gap-[7px] text-[14px] font-semibold">
              Passwort
              <input 
                type="password" 
                required 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                placeholder="••••••••"
                className="border border-[#E7E2DA] rounded-[12px] px-[14px] py-[13px] text-[15px] font-normal bg-[#FAF8F5] focus:outline-none focus:border-[#0F4C2E] transition-colors"
              />
            </label>
          )}

          <button 
            type="submit" 
            disabled={loading} 
            className="bg-[#0F4C2E] text-white border-none rounded-full p-[14px] text-[15px] font-semibold cursor-pointer hover:bg-[#06301C] transition-colors disabled:opacity-50 mt-2"
          >
            {loading ? t("pleaseWait") : mode === 'login' ? 'Anmelden' : mode === 'register' ? 'Registrieren' : t("requestLink")}
          </button>
        </form>

        <div className="mt-6 flex flex-col gap-3 text-center">
          {mode === 'login' ? (
            <>
              <button type="button" onClick={() => setMode('forgot')} className="text-[14px] text-[#5F6B63] hover:underline bg-transparent border-none cursor-pointer">{t("forgotPassword")}</button>
              <button type="button" onClick={() => setMode('register')} className="text-[14px] text-[#5F6B63] hover:underline bg-transparent border-none cursor-pointer">{t("noAccountRegister")}</button>
            </>
          ) : (
            <button type="button" onClick={() => setMode('login')} className="text-[14px] text-[#5F6B63] hover:underline bg-transparent border-none cursor-pointer">{t("backToLogin")}</button>
          )}
          <button type="button" onClick={onBack} className="text-[14px] text-[#5F6B63] hover:underline bg-transparent border-none cursor-pointer mt-2">{t("cancel")}</button>
        </div>
      </div>
    </main>
  );
}
