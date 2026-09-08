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

const content = `Große Erleichterung für Familien in Winterberg, Medebach und Hallenberg: An der Poststraße 12 in Winterberg hat die neue kinder- und jugendärztliche Praxis eröffnet. Damit wird die wohnortnahe medizinische Versorgung für Kinder in unserer Region nachhaltig gestärkt und weite Anfahrtswege werden deutlich verkürzt.

Träger der neuen Praxis ist das St. Franziskus Hospital Winterberg. Die Ansiedlung wurde in enger Kooperation zwischen der Stadt Winterberg, der Wirtschaftsförderung sowie den Nachbarkommunen Medebach und Hallenberg realisiert.

## Das Praxisteam an der Poststraße

Für eine kompetente und einfühlsame Betreuung sorgt ein erfahrenes Mediziner- und Praxisteam:

* **Dr. Peter Gelshäuser (Ärztlicher Leiter)**
  Facharzt für Kinder- und Jugendmedizin in Vollzeit mit langjähriger Praxis- und Klinikerfahrung.

* **Dr. Ralph Armbrust (Facharzt für Kinder- und Jugendmedizin)**
  Unterstützt die Praxis auf einer Teilzeitstelle und übernimmt die Vertretung.

* **Engagiertes Praxis- & MFA-Team**
  Ein fünfköpfiges Team aus medizinischen Fachangestellten betreut Familien von der Terminvergabe bis zur Behandlung.

:::contact
### Kontakt & Praxisdaten
Alle Sprechzeiten, angebotene Leistungen sowie die Kontaktdaten finden Sie im Profil des Winterberg Verzeichnisses:

* **Standort:** Poststraße 12, 59955 Winterberg
* **Telefon:** 02981 909348-0
* **E-Mail:** kinderarzt@kh-winterberg.de
* **Unternehmensprofil im Verzeichnis:** [Zur Profilseite der Kinderarztpraxis Winterberg](/gesundheit-und-medizin/aerzte-und-praxen/kinderarztpraxis-winterberg-mvz)
:::`;

async function run() {
  const newsData = {
    title: "Neue Kinderarztpraxis an der Poststraße in Winterberg eröffnet",
    slug: "neue-kinderarztpraxis-winterberg-poststrasse",
    author: "Simon Kräling",
    businessId: "kinderarztpraxis-winterberg",
    businessName: "Kinderarztpraxis Winterberg (MVZ)",
    imageUrl: "/news-kinderarztpraxis.jpg",
    status: "approved",
    date: new Date().toISOString(),
    content: content
  };

  try {
    const docRef = await addDoc(collection(db, 'news'), newsData);
    console.log("SUCCESS! Inserted pediatric clinic news with ID:", docRef.id);
  } catch (err) {
    console.error("ERROR inserting news:", err);
  }
}

run();
