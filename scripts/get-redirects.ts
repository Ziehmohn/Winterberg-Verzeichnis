import { db } from '../src/firebase';
import { collection, getDocs } from 'firebase/firestore';

async function main() {
  const snap = await getDocs(collection(db, 'redirects'));
  console.log(`Total redirects in Firestore: ${snap.size}`);
  snap.forEach(d => {
    console.log(d.id, d.data());
  });
}

main().catch(console.error);
