import { initializeApp } from 'firebase/app';
import { getFirestore, doc, updateDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCU_-ygCWdyCrGvoNXeyIjmt9YnbZgp0Dk",
  authDomain: "gen-lang-client-0671429103.firebaseapp.com",
  projectId: "gen-lang-client-0671429103",
  storageBucket: "gen-lang-client-0671429103.firebasestorage.app",
  messagingSenderId: "363603639368",
  appId: "1:363603639368:web:665f56c570afba7869ac7d",
  measurementId: "G-MXFC2V1GXZ"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app, 'ai-studio-winterberguntern-dcab9b4d-c8de-4204-84d9-91f84061f319');

async function update() {
  try {
    const docRef = doc(db, 'news', '0MFwSDdhOmyvv3O8IqnA');
    await updateDoc(docRef, {
      imageUrl: '/news-ladenlokale.jpg'
    });
    console.log("SUCCESS! Updated imageUrl for news article 0MFwSDdhOmyvv3O8IqnA");
  } catch (err) {
    console.error("ERROR updating news article:", err);
  }
}

update();
