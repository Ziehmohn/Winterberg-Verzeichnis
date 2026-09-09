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

const contentDe = `Winterberg pulsiert durch seine lebendige Innenstadt, die vielfältigen Flaniermeilen und ein breites Angebot an inhabergeführten Fachgeschäften, Sportausstattern und Boutiquen. Jahr für Jahr schätzen Einheimische wie Feriengäste das persönliche Einkaufserlebnis und die individuelle Beratung vor Ort.

Doch moderner Einzelhandel hört an der Ladentür nicht auf: Immer mehr Winterberger Unternehmen setzen erfolgreich auf die Kombination aus stationärem Ladengeschäft und eigenem Onlineshop. So können Kundinnen und Kunden nicht nur beim Bummel durch die Fußgängerzone stöbern, sondern ihre Lieblingsprodukte auch bequem von zu Hause aus nachbestellen – egal ob nach dem Urlaub oder im Alltag.

## Ausgewählte Winterberger Geschäfte mit Onlineshop

Hier finden Sie eine Auswahl an lokalen Händlern aus Winterberg, die neben ihrem Ladenlokal auch einen eigenen Webshop betreiben:

* **Pfiffikus Spielwaren**
  Das beliebte Fachgeschäft an der Hauptstraße bietet ein riesiges Sortiment an Spielwaren, Puzzles, Holzspielzeug und Kinderspielen namhafter Marken – sowohl im Laden als auch online.
  * [Zum Unternehmensprofil im Verzeichnis](/einzelhandel/spielwaren/pfiffikus-winterberg)
  * [Zum Onlineshop bei idee+spiel](https://www.ideeundspiel.com/s/1476-pfiffikus-spielwaren)

* **Insider Fashion Store (Precious)**
  Angesagte Modetrends, Premium-Streetwear und stilvolle Accessoires für Damen und Herren an der Flaniermeile Am Waltenberg sowie im modernen Onlineshop.
  * [Zum Unternehmensprofil im Verzeichnis](/einzelhandel/bekleidung/insider-fashion-store-precious)
  * [Zum Onlineshop auf preciouswinterberg.de](https://preciouswinterberg.de/)

* **Liftstation Snowboard- & Skateshop**
  Spezialisierter Shop an der Hauptstraße für Snowboards, Skateboards, Bindungen, Boots sowie Winter- und Streetwear führender Szene-Marken.
  * [Zum Unternehmensprofil im Verzeichnis](/ski-bike-sport/sport-outdoor/liftstation-snowboard-skateshop-winterberg)
  * [Zum Onlineshop auf liftstation.eu](https://www.liftstation.eu/)

* **hagebau kompakt Müllenhoff (mein-heimwerkermarkt.de)**
  Ihr Fachmarkt an der Remmeswiese für Heimwerkerbedarf, Werkzeuge, Farben, Gartenartikel und Baustoffe mit komfortabler Online-Bestellung und Lieferservice.
  * [Zum Unternehmensprofil im Verzeichnis](/einzelhandel/baumaerkte/hagebau-kompakt-muellenhoff-winterberg)
  * [Zum Onlineshop auf mein-heimwerkermarkt.de](https://mein-heimwerkermarkt.de/)

:::contact
### Ihr Winterberger Unternehmen hat auch einen Onlineshop?
Betreiben Sie ein Ladengeschäft in Winterberg oder den Ortsteilen und bieten Ihre Produkte ebenfalls online an? Lassen Sie Ihren Webshop gerne in Ihrem Unternehmensprofil im Verzeichnis ergänzen oder melden Sie sich bei uns:

* **Eintrag aktualisieren:** Über den Button „Eintrag kostenlos hinzufügen / bearbeiten“
* **E-Mail:** info@winterberg-verzeichnis.de
* **Tipp:** Nutzen Sie die Chance, sowohl Urlauber als auch lokale Kunden ganzjährig digital zu erreichen!
:::`;

const contentNl = `Winterberg bruist dankzij het levendige stadscentrum, de gezellige winkelstraten en een gevarieerd aanbod aan speciaalzaken, sportwinkels en modieuze boetieks. Zowel inwoners als toeristen waarderen het persoonlijke winkelplezier en het deskundige advies ter plaatse.

Moderne detailhandel stopt echter niet bij de winkeldeur: Steeds meer ondernemers in Winterberg combineren hun fysieke winkel met een eigen webshop. Zo kunnen klanten niet alleen ontspannen winkelen tijdens een bezoek aan Winterberg, maar hun favoriete producten ook na hun vakantie eenvoudig vanuit huis nabestellen.

## Geselecteerde winkels in Winterberg met een webshop

Hier vindt u een selectie van lokale winkeliers uit Winterberg die naast hun winkel ook een online shop aanbieden:

* **Pfiffikus Spielwaren**
  De populaire speelgoedspeciaalzaak aan de Hauptstraße biedt een ruim assortiment speelgoed, puzzels, houten speelgoed en kinderspellen – zowel in de winkel als online.
  * [Naar het bedrijfsprofiel in het overzicht](/einzelhandel/spielwaren/pfiffikus-winterberg)
  * [Naar de webshop bij idee+spiel](https://www.ideeundspiel.com/s/1476-pfiffikus-spielwaren)

* **Insider Fashion Store (Precious)**
  Trendy mode, premium streetwear en stijlvolle accessoires voor dames en heren aan de Am Waltenberg en via de eigen webshop.
  * [Naar het bedrijfsprofiel in het overzicht](/einzelhandel/bekleidung/insider-fashion-store-precious)
  * [Naar de webshop op preciouswinterberg.de](https://preciouswinterberg.de/)

* **Liftstation Snowboard- & Skateshop**
  Gespecialiseerde winkel aan de Hauptstraße voor snowboards, skateboards, boots, bindingen en modieuze winter- en streetwear.
  * [Naar het bedrijfsprofiel in het overzicht](/ski-bike-sport/sport-outdoor/liftstation-snowboard-skateshop-winterberg)
  * [Naar de webshop op liftstation.eu](https://www.liftstation.eu/)

* **hagebau kompakt Müllenhoff (mein-heimwerkermarkt.de)**
  Uw bouwmarkt en tuincentrum aan de Remmeswiese voor doe-het-zelf, gereedschap, verf en bouwmaterialen met eenvoudige online bestelling en bezorging.
  * [Naar het bedrijfsprofiel in het overzicht](/einzelhandel/baumaerkte/hagebau-kompakt-muellenhoff-winterberg)
  * [Naar de webshop op mein-heimwerkermarkt.de](https://mein-heimwerkermarkt.de/)

:::contact
### Heeft uw winkel in Winterberg ook een webshop?
Heeft u een winkel of bedrijf in Winterberg of een van de dorpen en verkoopt u uw producten ook online? Laat uw webshop toevoegen aan uw bedrijfsprofiel op de website of neem contact met ons op:

* **Profiel bijwerken:** Via de knop „Bedrijf gratis aanmelden / bewerken“
* **E-mail:** info@winterberg-verzeichnis.de
* **Tip:** Bereik zowel toeristen als lokale klanten het hele jaar door digitaal!
:::`;

async function run() {
  const newsData = {
    title: "Lokal einkaufen & online bestellen: Winterberger Geschäfte verbinden stationären Handel und Onlineshopping",
    title_nl: "Lokaal winkelen & online bestellen: Winkels in Winterberg combineren fysieke winkel met webshop",
    slug: "lokal-einkaufen-und-online-bestellen-winterberger-onlineshops",
    author: "Simon Kräling",
    imageUrl: "/news-winterberg-onlineshops.jpg",
    status: "approved",
    date: new Date().toISOString(),
    content: contentDe,
    content_nl: contentNl
  };

  try {
    const docRef = await addDoc(collection(db, 'news'), newsData);
    console.log("SUCCESS! Inserted onlineshops news with ID:", docRef.id);
  } catch (err) {
    console.error("ERROR inserting news:", err);
  }
}

run();
