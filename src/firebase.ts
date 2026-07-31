import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAqpSLrA6PiSFSXJiN4hFWsyfyUXTawhSw",
  authDomain: "winterberger-unternehmen.firebaseapp.com",
  projectId: "winterberger-unternehmen",
  storageBucket: "winterberger-unternehmen.firebasestorage.app",
  messagingSenderId: "923063046759",
  appId: "1:923063046759:web:03c7023ebaaff2c6b93ac2",
  measurementId: "G-MXFC2V1GXZ"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

