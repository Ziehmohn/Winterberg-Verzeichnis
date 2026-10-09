import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import { UserProfile } from './types';
import { isAdminEmail } from './utils/admin';

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  /** Wird gesetzt, wenn ein gesperrter Nutzer automatisch abgemeldet wurde. */
  bannedMessage: string | null;
  clearBannedMessage: () => void;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  userProfile: null,
  loading: true,
  bannedMessage: null,
  clearBannedMessage: () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

/**
 * Leitet die effektive Rolle ab. Admin wird NUR über die E-Mail vergeben –
 * eine 'admin'-Rolle aus der Datenbank wird für alle anderen Konten ignoriert.
 */
function resolveRole(email: string | null, stored?: UserProfile['role'], hasBusiness?: boolean): UserProfile['role'] {
  if (isAdminEmail(email)) return 'admin';
  if (stored === 'business_owner' || hasBusiness) return 'business_owner';
  return 'user';
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [bannedMessage, setBannedMessage] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setCurrentUser(null);
        setUserProfile(null);
        setLoading(false);
        return;
      }

      const nowIso = new Date().toISOString();
      const fallbackProfile: UserProfile = {
        uid: user.uid,
        email: user.email,
        role: resolveRole(user.email),
      };

      try {
        const docRef = doc(db, 'users', user.uid);
        const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('TIMEOUT_AUTH')), 5000));
        const docSnap = await Promise.race([getDoc(docRef), timeoutPromise]) as any;

        if (docSnap && docSnap.exists && docSnap.exists()) {
          const data = docSnap.data() as UserProfile;

          // Gesperrte Nutzer sofort abmelden (Admin kann nie gesperrt werden)
          if (data.banned && !isAdminEmail(user.email)) {
            setBannedMessage(
              'Ihr Konto wurde gesperrt.' + (data.bannedReason ? ` Grund: ${data.bannedReason}` : '') +
              ' Bei Fragen wenden Sie sich bitte an info@sichtbar-online.com.'
            );
            setUserProfile(null);
            setCurrentUser(null);
            setLoading(false);
            await signOut(auth);
            return;
          }

          const profile: UserProfile = {
            ...data,
            uid: user.uid,
            email: user.email,
            role: resolveRole(user.email, data.role, !!(data.businessId || data.ownedBusinessId)),
          };
          setCurrentUser(user);
          setUserProfile(profile);

          // "Zuletzt aktiv" max. 1x pro Stunde aktualisieren (spart Schreibzugriffe)
          const last = data.lastLoginAt ? Date.parse(data.lastLoginAt) : 0;
          if (!last || Date.now() - last > 60 * 60 * 1000) {
            updateDoc(docRef, { lastLoginAt: nowIso }).catch((e) => console.warn('lastLoginAt update failed', e));
          }
        } else {
          // Erstes Login: Nutzerdokument anlegen, damit das Konto in der Mitgliederverwaltung erscheint
          const newProfile: UserProfile = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || '',
            role: 'user',
            createdAt: nowIso,
            lastLoginAt: nowIso,
          };
          setDoc(docRef, newProfile).catch((e) => console.warn('Could not create user profile', e));
          setCurrentUser(user);
          setUserProfile({ ...newProfile, role: resolveRole(user.email) });
        }
      } catch (error: any) {
        console.warn('Error fetching user profile, using fallback profile:', error);
        setCurrentUser(user);
        setUserProfile(fallbackProfile);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, userProfile, loading, bannedMessage, clearBannedMessage: () => setBannedMessage(null) }}>
      {children}
    </AuthContext.Provider>
  );
}
