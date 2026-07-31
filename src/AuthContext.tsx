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

          const isAdminEmail = user.email && (
            user.email.includes('sichtbar') || 
            user.email.includes('simon.kraeling')
          );
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
            const isAdminEmail = user.email && (user.email.includes('sichtbar') || user.email.includes('simon.kraeling'));
            setUserProfile({ uid: user.uid, email: user.email, role: isAdminEmail ? 'admin' : 'user' });
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
      {!loading && children}
    </AuthContext.Provider>
  );
}
