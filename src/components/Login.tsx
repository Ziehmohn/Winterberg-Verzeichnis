import React, { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, sendEmailVerification, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { useTranslation } from '../i18n';
import { ThemeConfig } from '../types';
import { useAuth } from '../AuthContext';
import { isAdminEmail } from '../utils/admin';

function mapAuthError(err: any): string {
  const code = err?.code || '';
  switch (code) {
    case 'auth/network-request-failed':
      return 'Verbindung zum Anmeldedienst fehlgeschlagen. Bitte prüfen Sie Ihre Internetverbindung, deaktivieren Sie ggf. Werbeblocker/VPN für diese Seite und versuchen Sie es erneut.';
    case 'auth/email-already-in-use':
      return 'Für diese E-Mail-Adresse existiert bereits ein Konto. Bitte melden Sie sich an oder setzen Sie Ihr Passwort zurück.';
    case 'auth/invalid-email':
      return 'Bitte geben Sie eine gültige E-Mail-Adresse ein.';
    case 'auth/weak-password':
      return 'Das Passwort ist zu schwach (mindestens 6 Zeichen).';
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'E-Mail oder Passwort ist falsch.';
    case 'auth/too-many-requests':
      return 'Zu viele Versuche. Bitte warten Sie einen Moment und versuchen Sie es erneut.';
    case 'auth/user-disabled':
      return 'Dieses Konto wurde deaktiviert.';
    default:
      return err?.message || 'Es ist ein Fehler aufgetreten.';
  }
}

export default function Login({ theme, activeThemeKey, onBack }: { theme: ThemeConfig, activeThemeKey: string, onBack: () => void }) {
  const { t } = useTranslation();
  const { bannedMessage, clearBannedMessage } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [msg, setMsg] = useState('');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMsg('');
    clearBannedMessage();
    setLoading(true);
    try {
      if (mode === 'login') {
        await signInWithEmailAndPassword(auth, email.trim(), password);
        // Successful login will be handled by AuthContext listener and parent component
      } else if (mode === 'register') {
        const userCred = await createUserWithEmailAndPassword(auth, email.trim(), password);
        const nowIso = new Date().toISOString();
        const name = displayName.trim();
        try {
          if (name) await updateProfile(userCred.user, { displayName: name });
          await setDoc(doc(db, 'users', userCred.user.uid), {
            uid: userCred.user.uid,
            email: userCred.user.email,
            displayName: name,
            role: 'user',
            createdAt: nowIso,
            lastLoginAt: nowIso,
          }, { merge: true });
        } catch (profileErr) {
          console.warn('Could not save profile details', profileErr);
        }
        if (!isAdminEmail(userCred.user.email)) {
          try {
            await sendEmailVerification(userCred.user);
          } catch (e) {
            console.error("Could not send verification email", e);
          }
        }
      } else if (mode === 'forgot') {
        await sendPasswordResetEmail(auth, email.trim());
        setMsg(t("resetLinkSent"));
      }
    } catch (err: any) {
      console.error(err);
      setError(mapAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex-1 max-w-[440px] mx-auto w-full px-6 py-[70px] pb-[90px]">
      <div className="bg-white border border-[#EDE8E0] rounded-lg p-8 shadow-[0_10px_30px_rgba(27,33,29,0.06)]">
        <h1 className="font-display text-[26px] font-bold mb-2">
          {mode === 'login' ? 'Anmeldung' : mode === 'register' ? 'Registrieren' : 'Passwort zurücksetzen'}
        </h1>
        <p className="text-[15px] text-[#5F6B63] mb-[22px]">
          {mode === 'login' ? 'Adminbereich und Unternehmens-Dashboard.' : mode === 'register' ? 'Neues Konto anlegen.' : 'Geben Sie Ihre E-Mail ein, um einen Link zu erhalten.'}
        </p>

        {bannedMessage && <div className="bg-[#FBEAE7] text-[#C0392B] p-4 rounded-md text-center mb-4 text-[14px]">{bannedMessage}</div>}
        {msg && <div className="bg-[#E8F1EB] text-[#0F4C2E] p-4 rounded-md text-center mb-4 text-[14px]">{msg}</div>}
        {error && <div className="bg-[#FBEAE7] text-[#C0392B] p-4 rounded-md text-center mb-4 text-[14px]">{error}</div>}
        
        <form onSubmit={handleAuth} className="grid gap-[14px]">
          {mode === 'register' && (
            <label className="grid gap-[7px] text-[14px] font-semibold">
              Name
              <input 
                type="text" 
                required 
                value={displayName} 
                onChange={e => setDisplayName(e.target.value)} 
                placeholder="Vor- und Nachname"
                className="border border-[#E7E2DA] rounded-md px-3.5 py-2.5 text-[15px] font-normal bg-[#FAF8F5] focus:outline-none focus:border-[#0F4C2E] transition-colors"
              />
            </label>
          )}
          <label className="grid gap-[7px] text-[14px] font-semibold">
            E-Mail
            <input 
              type="email" 
              required 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              placeholder="name@beispiel.de"
              className="border border-[#E7E2DA] rounded-md px-3.5 py-2.5 text-[15px] font-normal bg-[#FAF8F5] focus:outline-none focus:border-[#0F4C2E] transition-colors"
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
                className="border border-[#E7E2DA] rounded-md px-3.5 py-2.5 text-[15px] font-normal bg-[#FAF8F5] focus:outline-none focus:border-[#0F4C2E] transition-colors"
              />
            </label>
          )}

          <button 
            type="submit" 
            disabled={loading} 
            className="bg-[#0F4C2E] text-white border-none rounded-md p-3 text-[15px] font-semibold cursor-pointer hover:bg-[#06301C] transition-colors disabled:opacity-50 mt-2"
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
