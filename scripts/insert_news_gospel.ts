import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

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

const content = `Am 20. Dezember dürfen sich Musikbegeisterte und Kulturfreunde im Sauerland auf ein ganz besonderes musikalisches Highlight freuen: Die weltbekannten **New York Gospel Stars** gastieren in Winterberg und bringen ihre unverwechselbare Energie, kraftvolle Stimmen und jede Menge Gefühl auf die Bühne der Stadthalle Oversum.

Mit mitreißenden Rhythmen, emotionalen Soli und klangvollem Chorgesang entführt das international gefeierte Ensemble das Publikum auf eine musikalische Reise in die traditionsreichen Gospelkirchen New Yorks – ein stimmungsvolles Konzerterlebnis pünktlich zur Vorweihnachtszeit.

## Ein unvergesslicher Abend voller Gospel & Soul

Das Publikum darf sich auf eine packende Mischung aus weltberühmten Gospel-Hymnen, spirituellen Klassikern und weihnachtlichen Klängen freuen:

* **Stimmgewaltiges Ensemble aus New York**
  Herausragende Sängerinnen und Sänger begeistern mit Leidenschaft, Dynamik und echter Gospel-Tradition, die unter die Haut geht.

* **Erstklassige Konzertkulisse im Oversum**
  Das Kongress- und Eventzentrum am Kurpark bietet den perfekten akustischen Rahmen für ein intimes und zugleich kraftvolles Live-Erlebnis.

* **Vorweihnachtliches Kultur-Highlight**
  Ein inspirierender Konzertabend für Einheimische und Gäste, der festliche Vorfreude in die winterliche Bergstadt bringt.

:::contact
### Event-Details & Tickets
Sichern Sie sich rechtzeitig Ihre Plätze für das Konzert der New York Gospel Stars in Winterberg:

* **Datum:** Sonntag, 20. Dezember 2026
* **Beginn:** 18:00 Uhr
* **Veranstaltungsort:** Stadthalle / Kongresszentrum Oversum, Am Kurpark 6, 59955 Winterberg
* **Tickets:** Erhältlich über gängige Vorverkaufsstellen (z. B. Eventim) sowie lokale Vorverkaufsstellen
* **Location-Profil:** [Zur Profilseite der Stadthalle Oversum im Winterberg Verzeichnis](/dienstleistungen/tagungszentren/stadthalle-oversum)
:::`;

async function run() {
  const newsData = {
    title: "New York Gospel Stars live in Winterberg: Weihnachtliches Konzert-Highlight im Oversum",
    slug: "new-york-gospel-stars-konzert-oversum-winterberg",
    author: "Simon Kräling",
    businessId: "stadthalle-oversum-winterberg",
    businessName: "Stadthalle Oversum Winterberg",
    imageUrl: "/news-gospel-stars-winterberg.jpg",
    status: "approved",
    date: new Date().toISOString(),
    content: content
  };

  try {
    const docRef = await addDoc(collection(db, 'news'), newsData);
    console.log("SUCCESS! Inserted gospel concert news with ID:", docRef.id);
  } catch (err) {
    console.error("ERROR inserting gospel news:", err);
  }
}

run();
