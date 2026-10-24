import { initializeApp } from 'firebase/app';
import { initializeFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { initialNews } from '../src/dataNews';

const firebaseConfig = {
  apiKey: "AIzaSyCU_-ygCWdyCrGvoNXeyIjmt9YnbZgp0Dk",
  authDomain: "gen-lang-client-0671429103.firebaseapp.com",
  projectId: "gen-lang-client-0671429103",
  storageBucket: "gen-lang-client-0671429103.firebasestorage.app",
  messagingSenderId: "363603639368",
  appId: "1:363603639368:web:665f56c570afba7869ac7d",
  measurementId: "G-77PLYCGN1S"
};

const app = initializeApp(firebaseConfig);
const db = initializeFirestore(app, {
  ignoreUndefinedProperties: true
}, 'ai-studio-winterberguntern-dcab9b4d-c8de-4204-84d9-91f84061f319');

async function main() {
  const article = initialNews.find(n => n.id === 'halloween-2026-winterberg-party-events-feste');
  if (!article) {
    throw new Error('Halloween article not found in initialNews');
  }

  console.log('Syncing article to Firestore:', article.id);
  const docRef = doc(db, 'news', article.id);
  await setDoc(docRef, { ...article }, { merge: true });
  console.log('Successfully written to Firestore news collection!');

  const check = await getDoc(docRef);
  if (check.exists()) {
    console.log('Verified Firestore doc exists:', check.id, check.data()?.title);
  }
}

main().catch(err => {
  console.error('Error syncing news:', err);
  process.exit(1);
});
