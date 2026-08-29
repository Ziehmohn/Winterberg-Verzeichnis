import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getFirestore, doc, updateDoc } from 'firebase/firestore';
import fs from 'fs';
import path from 'path';

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
const storage = getStorage(app);
const db = getFirestore(app, 'ai-studio-winterberguntern-dcab9b4d-c8de-4204-84d9-91f84061f319');

async function run() {
  try {
    const filePath = path.resolve('public/news-ladenlokale.jpg');
    const fileBuffer = fs.readFileSync(filePath);
    
    const storageRef = ref(storage, `news/freistehende-ladenlokale-winterberg-${Date.now()}.jpg`);
    await uploadBytes(storageRef, fileBuffer, {
      contentType: 'image/jpeg'
    });

    const downloadURL = await getDownloadURL(storageRef);
    console.log("Uploaded successfully to Firebase Storage:", downloadURL);

    // Update doc in firestore
    const docRef = doc(db, 'news', '0MFwSDdhOmyvv3O8IqnA');
    await updateDoc(docRef, {
      imageUrl: downloadURL
    });

    console.log("Updated news article imageUrl with Firebase Storage URL!");
  } catch (err) {
    console.error("Error uploading to Firebase Storage:", err);
  }
}

run();
