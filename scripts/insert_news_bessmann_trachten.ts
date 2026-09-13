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

const contentDe = `Wenn die Tage kürzer werden und im Sauerland sowie weit darüber hinaus die beliebte Oktoberfest- und Hüttengaudi-Saison ansteht, gehört das passende Trachtenoutfit für viele Feierfreudige einfach dazu. Pünktlich zum Start der Festzelt-Wochenenden hat das Mode- und Sportoutlet Bessmann in Winterberg wieder sein traditionelles Trachtensortiment in die Regale geholt.

Ob für das Vereinsfest im Hochsauerland, die private Hüttenparty oder den Besuch eines großen Oktoberfests: Die jährliche Trachtenaktion bei Bessmann bietet Einheimischen und Urlaubsgästen eine vielseitige Auswahl an traditioneller und moderner Festtagskleidung zu gewohnt attraktiven Outlet-Preisen.

## Zeitlose Klassiker und moderne Festtags-Trends

Die Kollektion vereint alpine Gemütlichkeit mit aktuellem Stil und bietet sowohl für Damen als auch für Herren eine breite Palette an Schnitten und Materialien:

* **Stilvolle Dirndl & detailverliebte Blusen**
  Von dezent-klassischen Modellen bis hin zu modernen Farbvarianten in samtigen Tönen oder feinen Pastellnuancen. Liebevolle Stickereien, edle Schürzen und bequeme Passformen sorgen für den perfekten Sitz auf der Festbank. Ergänzt wird die Auswahl durch passende Trachtenblusen mit Spitze, Karomuster oder verspielten Ausschnitten.

* **Robuste Lederhosen, Trachtenhemden & Westen**
  Für die Herren bilden kernige Lederhosen das Herzstück – gefertigt aus strapazierfähigem Leder mit authentischen Ziernähten. Kombiniert mit zünftigen Karo- oder Leinenhemden sowie edlen Trachtenwesten entsteht ein stimmiger Gesamtlook, der Langlebigkeit und Tragekomfort vereint.

* **Harmonische Accessoires für den Feinschliff**
  Erst die Details machen die Tracht perfekt: Passende Trachtenstrümpfe, Gürtel mit traditioneller Schließe und wärmende Strickjanker sorgen dafür, dass man auch an kühleren Herbstabenden in den Sauerländer Bergen bestens gewappnet ist.

## Wichtiger Hinweis zum Einkauf in Winterberg

Für alle, die sich vor Ort neu einkleiden möchten: Das gesamte Trachtenangebot ist in Winterberg **ausschließlich in der Filiale in der Neuen Mitte (Neue Mitte 3)** erhältlich. Die zweite Winterberger Bessmann-Filiale an der Poststraße führt das Trachtensortiment nicht.

:::contact
### Bessmann Mode & Sport in Winterberg
Besuchen Sie das Outlet in der Neuen Mitte und entdecken Sie die aktuelle Kollektion für die Festsaison:

* **Standort:** Neue Mitte 3, 59955 Winterberg
* **Sortiment:** Trachtenmode exklusiv in der Filiale Neue Mitte erhältlich
* **Telefon:** 02981 8994180
* **Unternehmensprofil im Verzeichnis:** [Zum Profil von Bessmann Mode & Sport](/einzelhandel/bekleidung/bessmann-mode-und-sport-outlet)
:::`;

const contentNl = `Wanneer de dagen korter worden en in het Sauerland en ver daarbuiten het populaire Oktoberfest- en Hüttengaudi-seizoen voor de deur staat, hoort een authentieke traditionele outfit er voor velen helemaal bij. Precies op tijd voor de feestelijke herfstweekenden heeft mode- en sportoutlet Bessmann in Winterberg het populaire Trachten-assortiment weer in de winkel staan.

Of het nu voor een gezellig dorpsfeest in het Hochsauerland is, een winterse huttenavond of een bezoek aan een groot Oktoberfest: de jaarlijkse klederdrachtactie bij Bessmann biedt zowel inwoners als vakantiegangers een ruime keuze aan traditionele en moderne kleding tegen aantrekkelijke outletprijzen.

## Tijdloze klassiekers en moderne trends

De collectie combineert alpine gezelligheid met moderne trends en biedt zowel voor dames als heren volop keuze in pasvormen, kleuren en materialen:

* **Stijlvolle Dirndls & gedetailleerde blouses**
  Van klassiek-traditionele modellen tot moderne kleurvarianten in fluweelachtige tinten of frisse pasteltinten. Mooie borduursels, feestelijke schorten en comfortabele pasvormen zorgen voor een geweldige uitstraling. Aangevuld met elegante Trachten-blouses met kant of speelse details.

* **Robuuste Lederhosen, overhemden & vesten**
  Voor heren vormen hoogwaardige Lederhosen het hart van de outfit – gemaakt van duurzaam leder met authentieke sierstiksels. Gecombineerd met geruite overhemden en stijlvolle vesten ontstaat een complete en comfortabele feestelijke look.

* **Bijpassende accessoires**
  Van traditionele kousen en riemen tot warme gebreide vesten voor de frissere herfstavonden in de heuvels rondom Winterberg.

## Belangrijke locatie-informatie voor Winterberg

Voor iedereen die in Winterberg langs wil komen: de complete Trachten-collectie is **uitsluitend verkrijgbaar in het filiaal aan de Neue Mitte (Neue Mitte 3)**. Het tweede Bessmann-filiaal aan de Poststraße verkoopt deze seizoenskleding niet.

:::contact
### Bessmann Mode & Sport in Winterberg
Bezoek de outlet aan de Neue Mitte en ontdek de actuele collectie voor het Oktoberfest-seizoen:

* **Locatie:** Neue Mitte 3, 59955 Winterberg
* **Assortiment:** Klederdracht exclusief verkrijgbaar in het filiaal Neue Mitte
* **Telefoon:** 02981 8994180
* **Bedrijfsprofiel in het overzicht:** [Naar het profiel van Bessmann Mode & Sport](/nl/detailhandel/kleding/bessmann-mode-und-sport-outlet)
:::`;

async function run() {
  const newsData = {
    title: "Zünftig eingekleidet: Bessmann in der Neuen Mitte startet Verkauf der neuen Trachtenkollektion",
    title_nl: "Feestelijk gekleed in klederdracht: Bessmann in Neue Mitte Winterberg start verkoop nieuwe Trachten-collectie",
    slug: "trachtenmode-oktoberfest-bessmann-winterberg-neue-mitte",
    author: "Simon Kräling",
    businessId: "104",
    businessName: "Bessmann Mode & Sport (Outlet)",
    businessSlug: "einzelhandel/bekleidung/bessmann-mode-und-sport-outlet",
    imageUrl: "/news-bessmann-trachtenmode.jpg",
    isAiGenerated: true,
    imageSource: "Symbolbild · KI-generiert",
    status: "approved",
    date: new Date().toISOString(),
    content: contentDe,
    content_nl: contentNl
  };

  try {
    const docRef = await addDoc(collection(db, 'news'), newsData);
    console.log("SUCCESS! Inserted Bessmann Trachtenmode news with ID:", docRef.id);
  } catch (err) {
    console.error("ERROR inserting news:", err);
  }
}

run();
