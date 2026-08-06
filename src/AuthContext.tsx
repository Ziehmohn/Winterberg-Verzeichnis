import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import { UserProfile } from './types';

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  userProfile: null,
  loading: true,
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        // Fetch user profile from Firestore
        try {
          const docRef = doc(db, 'users', user.uid);
          const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('TIMEOUT_AUTH')), 5000));
          const docSnap = await Promise.race([
            getDoc(docRef),
            timeoutPromise
          ]) as any;

          const adminEmails = ['simon.kraeling@sichtbar-online.com', 'info@sichtbar-online.com', 'info@winterberg.sichtbar-online.com'];
          const isAdminEmail = user.email && adminEmails.includes(user.email);
          if (docSnap && docSnap.exists && docSnap.exists()) {
            const data = docSnap.data() as UserProfile;
            if (isAdminEmail) {
              data.role = 'admin';
            }
            setUserProfile(data);
          } else {
            setUserProfile({
              uid: user.uid,
              email: user.email,
              role: isAdminEmail ? 'admin' : 'user',
            });
          }
        } catch (error: any) {
          if (error?.code === 'unavailable' || error?.message?.includes('offline')) {
            console.warn("Client offline. Using fallback profile.");
            const adminEmails = ['simon.kraeling@sichtbar-online.com', 'info@sichtbar-online.com', 'info@winterberg.sichtbar-online.com'];
            const isFallbackAdmin = user.email && adminEmails.includes(user.email);
            setUserProfile({ uid: user.uid, email: user.email, role: isFallbackAdmin ? 'admin' : 'user' });
          } else {
            console.error("Error fetching user profile:", error);
            setUserProfile(null);
          }
        }

      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, userProfile, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
