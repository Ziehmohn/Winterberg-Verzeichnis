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
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data() as UserProfile;
            if (user.email === 'simon.kraeling@gmail.com') {
              data.role = 'admin';
            }
            setUserProfile(data);
          } else {
            // Default profile for new users (could be expanded)
            setUserProfile({
              uid: user.uid,
              email: user.email,
              role: user.email === 'simon.kraeling@gmail.com' ? 'admin' : 'user',
            });
          }
        } catch (error: any) {
          if (error?.code === 'unavailable' || error?.message?.includes('offline')) {
            console.warn("Client offline. Using fallback profile.");
            setUserProfile({ uid: user.uid, email: user.email, role: 'user' });
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
