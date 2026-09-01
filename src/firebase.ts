import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCU_-ygCWdyCrGvoNXeyIjmt9YnbZgp0Dk",
  authDomain: "gen-lang-client-0671429103.firebaseapp.com",
  projectId: "gen-lang-client-0671429103",
  storageBucket: "gen-lang-client-0671429103.firebasestorage.app",
  messagingSenderId: "363603639368",
  appId: "1:363603639368:web:665f56c570afba7869ac7d",
  measurementId: "G-77PLYCGN1S" // Google Analytics 4
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, 'ai-studio-winterberguntern-dcab9b4d-c8de-4204-84d9-91f84061f319');
export const auth = getAuth(app);
export const storage = getStorage(app);

