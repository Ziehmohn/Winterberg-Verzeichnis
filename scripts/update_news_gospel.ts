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

const updatedContent = `Am Sonntag, den 20. Dezember 2026, dürfen sich Musikbegeisterte und Kulturfreunde im Sauerland auf ein ganz besonderes musikalisches Highlight freuen: Die weltbekannten **New York Gospel Stars** gastieren in Winterberg und bringen ihre unverwechselbare Energie, kraftvolle Stimmen und jede Menge Gefühl auf die Bühne der Stadthalle Oversum am Kurpark.

Mit mitreißenden Rhythmen, emotionalen Soli und klangvollem Chorgesang entführt das international gefeierte Ensemble das Publikum auf eine musikalische Reise in die traditionsreichen Gospelkirchen New Yorks – ein stimmungsvolles Konzerterlebnis pünktlich zur Vorweihnachtszeit.

## Ein unvergesslicher Abend voller Gospel & Soul

Das Publikum darf sich auf eine packende Mischung aus weltberühmten Gospel-Hymnen, spirituellen Klassikern und weihnachtlichen Klängen freuen:

* **Stimmgewaltiges Ensemble aus New York**
  Herausragende Sängerinnen und Sänger begeistern mit Leidenschaft, Dynamik und echter Gospel-Tradition, die unter die Haut geht.

* **Schöne und sichere Eventlocation im Oversum**
  Das Kongress- und Veranstaltungszentrum am Kurpark bietet ein modernes, ansprechendes und sicheres Ambiente mit hervorragender Akustik.

* **Vorweihnachtliches Kultur-Highlight**
  Ein inspirierender Konzertabend für Einheimische und Gäste, der festliche Vorfreude in die winterliche Bergstadt bringt.

:::contact
### Event-Details & Tickets
Sichern Sie sich rechtzeitig Ihre Tickets für das Konzert der New York Gospel Stars in Winterberg:

* **Datum:** Sonntag, 20. Dezember 2026
* **Zeiten:** Einlass ab 17:00 Uhr | Beginn um 18:00 Uhr
* **Veranstaltungsort:** Stadthalle Oversum, Am Kurpark 6, 59955 Winterberg
* **Eintrittspreis:** 37,50 €
* **Ticket-Vorverkauf:** [Hier Tickets direkt beim Veranstalter LB Events sichern](https://www.lb-events.de/de/veranstaltungen/new-york-gospel-stars-1.html)
* **Location-Profil:** [Zur Profilseite der Stadthalle Oversum im Winterberg Verzeichnis](/dienstleistungen/tagungszentren/stadthalle-oversum)
:::`;

async function run() {
  try {
    const docRef = doc(db, 'news', 'yYTxj1idu2eW41hpeynL');
    await updateDoc(docRef, {
      content: updatedContent
    });
    console.log("SUCCESS! Updated gospel news without seating mention.");
  } catch (err) {
    console.error("ERROR updating gospel news:", err);
  }
}

run();
