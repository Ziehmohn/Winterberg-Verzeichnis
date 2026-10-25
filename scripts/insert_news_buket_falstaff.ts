import { initializeApp } from 'firebase/app';
import { initializeFirestore, doc, setDoc } from 'firebase/firestore';
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

async function run() {
  const article = initialNews.find(n => n.id === "falstaff-barguide-2027-buket-bar-winterberg-auszeichnung");
  if (!article) {
    console.error("Article not found in initialNews!");
    process.exit(1);
  }

  try {
    const docRef = doc(db, 'news', article.id);
    await setDoc(docRef, {
      ...article,
      updatedAt: new Date().toISOString()
    }, { merge: true });

    console.log("SUCCESS! Synced news to Firestore document: news/" + article.id);
    process.exit(0);
  } catch (err) {
    console.error("Error inserting news into Firestore:", err);
    process.exit(1);
  }
}

run();
