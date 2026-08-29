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

const updatedContent = `Haben Sie schon länger eine Geschäftsidee im Kopf oder möchten mit Ihrem bestehenden Betrieb nach Winterberg expandieren? Jetzt ist der ideale Zeitpunkt! Die Stadt Winterberg und die Wirtschaftsförderung bieten nicht nur attraktive Gewerbe- und Ladenlokale in besten Lagen, sondern unterstützen neue Konzepte auch mit gezielten Förderprogrammen und spürbaren Mietzuschüssen.

## Aktuelle Ladenlokale und Gewerbeflächen

Egal ob Einzelhandel, Showroom, Gastronomie, Praxis oder modernes Büro – aktuell stehen vielseitige Objekte zur Anmietung bereit:

* **Hauptstraße 5 (Kernstadt – ca. 160 m²)**
  Modernes Ladenlokal nur 100 Meter vom Marktplatz entfernt. Große Schaufensterfront zur Straße – ideal für Einzelhandel, Praxis, Büro oder Showroom.

* **Hellenstraße 5 / ehem. Nudelhaus (Kernstadt – 200 m² Gastro + 50 m² Lager)**
  Zentral gelegenes Restaurant mit 200 m² Gastraum voller Möglichkeiten, 50 m² Lagerfläche und eigenen Gästeparkplätzen direkt am Haus.

* **Marktstraße 11 / ehem. Marktapotheke (Kernstadt – ca. 140 m²)**
  Ladenlokal mit historischem Ambiente und barrierearmem Zugang (Rampe) direkt am innerstädtischen Verkehrsring.

* **Hauptstraße 9 (Kernstadt)**
  Charmanter, restaurierter Altbestand mit hellen Schaufensterfronten links und rechts des Eingangs sowie modernem Glasfaseranschluss.

* **Am Hagenblech 63 (Kernstadt – 150 m² Gewerbe + 90 m² Lager)**
  Ehemalige Schulungs- und Büroräume mit Parkplätzen vor der Tür – ideal für Dienstleister, Agenturen oder Praxen.

* **Holtener Weg / Hapimag Resort (Kernstadt – bis zu 480 m²)**
  Exklusive Gewerbefläche in Traumlage mit Panoramablick über Winterberg für innovative Nutzungskonzepte, Ausstellungen oder moderne Arbeitswelten.

* **Grönebacher Straße 5 (Niedersfeld – Dorfmitte)**
  Verkehrsgünstig gelegenes Ladenlokal direkt gegenüber dem Dorfplatz an der L 872 / B 480 mit großen Fensterfronten und Parkflächen.

## Attraktive Fördermöglichkeiten: Mieten leicht gemacht

Um Leerstände aktiv mit Leben zu füllen, stehen Unternehmern und Gründern zwei starke Programme zur Verfügung:

* **Landesförderprogramm „Zukunft Innenstadt NRW“ (Kernstadt)**
  Unternehmen, Start-ups, Pop-up-Stores oder Initiativen haben die Möglichkeit, leerstehende Ladenlokale im Förderbereich zu besonders günstigen Konditionen anzumieten und neue Konzepte risikominimiert zu testen.

* **Kommunales Mietzuschussprogramm der Stadt Winterberg (Alle Ortsteile)**
  Gilt von Altastenberg bis Züschen für alle Lagen außerhalb des Kernstadt-Förderbereichs. Die Stadt bezuschusst die Anmietung gezielt für inhabergeführte Geschäfte und Gastronomiebetriebe.

:::contact
### Ansprechpartner & Beratung
Haben Sie Interesse an einer Fläche oder möchten Sie Ihre Geschäftsidee besprechen? Das Team der Wirtschaftsförderung Winterberg unterstützt Sie gerne von der ersten Idee bis zur Eröffnung:

* **Ansprechpartner:** Winfried Borgmann (Tel. 02981 9250-12) und Christine Schulte (Tel. 02981 9250-14)
* **E-Mail:** wirtschaft@winterberg.de
* **Adresse:** Am Kurpark 4, 59955 Winterberg
* **Offizielle Exposés & Details:** [winterberg.de/geschaeftslokale](https://www.winterberg.de/service-kontakt/wirtschaftsfoerderung/geschaeftslokale/)
:::`;

async function run() {
  try {
    const docRef = doc(db, 'news', '0MFwSDdhOmyvv3O8IqnA');
    await updateDoc(docRef, {
      author: 'Simon Kräling',
      businessName: '',
      slug: 'freistehende-ladenlokale-winterberg',
      content: updatedContent,
      imageUrl: '/news-ladenlokale.jpg'
    });
    console.log("SUCCESS! Updated news article with slug freistehende-ladenlokale-winterberg.");
  } catch (e) {
    console.error("ERROR updating news article:", e);
  }
}

run();
