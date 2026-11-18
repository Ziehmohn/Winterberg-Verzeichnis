const { initializeApp } = require('firebase/app');
const { initializeFirestore, doc, setDoc, getDoc } = require('firebase/firestore');

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

const postmasEvent = {
  id: 'postmas-gasthof-zur-post-neuastenberg-2026',
  title: 'POSTMAS – Kleiner Wintermarkt am Gasthof zur Post',
  title_nl: 'POSTMAS – Kleine wintermarkt bij Gasthof zur Post',
  startDate: '2026-12-12',
  endDate: '2026-12-13',
  startTime: '14:00',
  endTime: '21:00',
  category: 'Märkte & Messen',
  location: 'Am Carport, Gasthof zur Post, Neuastenberger Str. 49, 59955 Winterberg-Neuastenberg',
  coordinates: { lat: 51.1636, lng: 8.4812 },
  imageUrl: '/events-postmas-gasthof-zur-post-2026.jpg',
  organizer: 'Gasthof zur Post Neuastenberg',
  description: 'POSTMAS – Kleiner Wintermarkt am Gasthof zur Post in Neuastenberg (am Carport).\n\nFreuen Sie sich auf Glühwein, gutes Essen und Hausgemachtes in gemütlicher Winteratmosphäre.\n\nÖffnungszeiten:\n• Samstag, 12. Dezember 2026: 14:00 – 21:00 Uhr\n• Sonntag, 13. Dezember 2026: 12:00 – 19:00 Uhr',
  description_nl: 'POSTMAS – Kleine wintermarkt bij Gasthof zur Post in Neuastenberg (bij de carport).\n\nGeniet van glühwein, lekker eten en huisgemaakte lekkernijen in een gezellige wintersfeer.\n\nOpeningstijden:\n• Zaterdag 12 december 2026: 14:00 – 21:00 uur\n• Zondag 13 december 2026: 12:00 – 19:00 uur',
  slug: 'postmas-wintermarkt-gasthof-zur-post-neuastenberg-2026',
  slug_nl: 'postmas-wintermarkt-gasthof-zur-post-neuastenberg-2026'
};

async function main() {
  const businessRef = doc(db, 'businesses', 'gasthof-zur-post-neuastenberg');
  const snap = await getDoc(businessRef);
  let existingEvents = [];
  if (snap.exists()) {
    existingEvents = snap.data().events || [];
  }

  const mergedEvents = [
    ...existingEvents.filter(e => e.id !== postmasEvent.id),
    postmasEvent
  ];

  await setDoc(businessRef, {
    name: 'Hotel Gasthof zur Post Neuastenberg',
    category: 'Gastronomie',
    subcategory: 'Restaurant',
    address: 'Neuastenberger Str. 49, 59955 Winterberg-Neuastenberg',
    district: 'Neuastenberg',
    status: 'approved',
    events: mergedEvents,
    updatedAt: new Date().toISOString()
  }, { merge: true });

  console.log('Updated Firestore: businesses/gasthof-zur-post-neuastenberg (' + mergedEvents.length + ' events)');

  const newVersion = Date.now();
  await setDoc(doc(db, 'system', 'metadata'), {
    businessesUpdatedAt: newVersion
  }, { merge: true });
  console.log('Bumped system/metadata businessesUpdatedAt to ' + newVersion);

  process.exit(0);
}

main().catch(err => {
  console.error('Error syncing POSTMAS event:', err);
  process.exit(1);
});
