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

## Zünftige Oktoberfeste im Stadtgebiet Winterberg

Wer das neue Outfit direkt ausführen möchte, hat im Oktober in den Winterberger Ortsteilen beste Gelegenheiten zum Feiern:

* **Oktoberfest Langewiese**
  Am Mittwoch, den 02. Oktober (am Vorabend zum Feiertag), lädt Langewiese ab 19:30 Uhr zum zünftigen Oktoberfest ein. Für ausgelassene Stimmung sorgen die Live-Formationen „Irrsinnig Gross – die kleine blasmusik“ und die „Schultes Partyband“.

* **Oktoberfest in der Schützenhalle Niedersfeld**
  Ebenfalls am Mittwoch, den 02. Oktober, veranstalten der Löschzug Niedersfeld der Freiwilligen Feuerwehr und die Blasmusik Niedersfeld ihr traditionelles Oktoberfest. Beginn ist um 19:00 Uhr in der Schützenhalle Niedersfeld mit Festbier, zünftigen Schmankerln und bester Blasmusik.

* **Oktoberfest an der Clemensberghütte in Hildfeld**
  Am Samstag, den 10. Oktober 2026, startet ab 14:00 Uhr das beliebte Hütten-Oktoberfest an der Clemensberghütte (Hildfelderstraße 70 in Winterberg-Hildfeld) mit echtem Hüttenzauber, Musik und Geselligkeit vor herrlicher Bergkulisse.

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

## Gezellige Oktoberfesten in de gemeente Winterberg

Wie zijn nieuwe feestoutfit meteen wil aantrekken, heeft in oktober in de dorpen rondom Winterberg volop gelegenheid voor een gezellige feestavond:

* **Oktoberfest Langewiese**
  Op woensdag 2 oktober (de avond voor de nationale feestdag) begint om 19:30 uur het Oktoberfest in Langewiese. Voor feestelijke livemuziek zorgen „Irrsinnig Gross – die kleine blasmusik“ en de „Schultes Partyband“.

* **Oktoberfest in de Schützenhalle Niedersfeld**
  Eveneens op woensdag 2 oktober organiseren de vrijwillige brandweer van Niedersfeld en de Blasmusik Niedersfeld hun traditionele Oktoberfest. Vanaf 19:00 uur bent u welkom in de Schützenhalle van Niedersfeld voor feestbier, muziek en typisch Beierse gezelligheid.

* **Oktoberfest bij de Clemensberghütte in Hildfeld**
  Op zaterdag 10 oktober 2026 begint om 14:00 uur het populaire hutten-Oktoberfest bij de Clemensberghütte (Hildfelderstraße 70 in Winterberg-Hildfeld) met muziek, lekker eten en authentieke berghuttensfeer.

:::contact
### Bessmann Mode & Sport in Winterberg
Bezoek de outlet aan de Neue Mitte en ontdek de actuele collectie voor het Oktoberfest-seizoen:

* **Locatie:** Neue Mitte 3, 59955 Winterberg
* **Assortiment:** Klederdracht exclusief verkrijgbaar in het filiaal Neue Mitte
* **Telefoon:** 02981 8994180
* **Bedrijfsprofiel in het overzicht:** [Naar het profiel van Bessmann Mode & Sport](/nl/detailhandel/kleding/bessmann-mode-und-sport-outlet)
:::`;

async function run() {
  const docRef = doc(db, 'news', '52ETlMxlFpR4x9HHFJbF');
  try {
    await updateDoc(docRef, {
      content: contentDe,
      content_nl: contentNl
    });
    console.log("SUCCESS! Updated Bessmann news with local Oktoberfeste list!");
  } catch (err) {
    console.error("ERROR updating news:", err);
  }
}

run();
