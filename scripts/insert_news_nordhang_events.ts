import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

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

const contentDe = `Bunte Laubwälder, klare Bergluft und der verlockende Duft von knisterndem Buchenholz: Der Herbst hält Einzug im Hochsauerland und verwandelt die Bergkulisse rund um den Kahlen Asten in ein farbenfrohes Naturparadies. An der beliebten **Nordhang Jause in Winterberg** beginnt damit die gemütlichste Zeit des Jahres. Hüttenwirt und Team laden Einheimische, Wanderer und Urlaubsgäste im Oktober und November zu zwei stimmungsvollen Veranstaltungshöhepunkten ein, die herbstliches Naturerlebnis, Geselligkeit und Gaumenfreuden miteinander verbinden.

Ein großes Plus für alle Ausflügler: An beiden Eventtagen gelten die regulären Öffnungszeiten – Hütte und Küche stehen somit durchgehend allen Gästen offen!

## Kreativzeit für kleine Hände: Kürbisschnitzen am 23. Oktober

Den Auftakt macht am **Freitag, den 23. Oktober 2026 ab 14:00 Uhr**, ein erlebnisreicher Nachmittag für Familien. Unter gemütlicher Hüttenatmosphäre können junge Besucher ihrer Fantasie freien Lauf lassen und eigene gruselige oder lustige Halloween-Kürbisse schnitzen. 

Doch das ist längst nicht alles: Vor der Hütte lodert die Feuerschale, an der gemeinsam knuspriges Stockbrot gebacken und süße Marshmallows geröstet werden.

### Das Wichtigste auf einen Blick:

* **Datum & Beginn:** Freitag, 23. Oktober 2026, ab 14:00 Uhr
* **Zwei Zeitfenster:** Geschnitzt wird in zwei Etappen von 14:00 bis 16:00 Uhr sowie von 16:00 bis 18:00 Uhr
* **Kostenbeitrag:** 8,00 € pro Kind (inklusive Kürbis, Schnitzwerkzeug und Leckereien an der Feuerschale)
* **Kulinarisches:** Warme Speisen, Hüttenspezialitäten und Erfrischungen für Groß und Klein
* **Wichtig – Voranmeldung:** Da die Plätze und Kürbisse limitiert sind, ist eine rechtzeitige Reservierung erforderlich – telefonisch unter **02981 8996399** oder per E-Mail an **info@nordhangjause.de**.

![Kürbisschnitzen für Kids an der Nordhang Jause](/events-nordhang-kuerbisschnitzen.png)

## Romantischer Lichterzauber am Nordhang: Samstag, 7. November

Wenn der Herbst seinem Ausklang entgegengeht, setzt die Nordhang Jause am **Samstag, den 7. November 2026 von 15:00 bis 22:00 Uhr**, ein strahlendes Glanzlicht. Sobald die Dämmerung hereinbricht, hüllt ein Meer aus Lichterketten, Laternen und bunten Strahlern das gesamte Waldareal in eine märchenhafte Szenerie.

Der **Lichterzauber am Nordhang** bietet einen stimmungsvollen Abend für alle Sinne:

* **Handgemachte Live-Musik:** Die beliebte Akustik-Band **„Hörgerätchen“** aus Siegen sorgt für mitreißende Live-Rhythmen und eine unvergleichliche Hüttenstimmung.
* **Spezialitäten vom Buchenholzfeuer:** Auf den Rosten brutzeln aromatischer Flammlachs am Holzbrett und traditioneller Sauerländer Kartoffelbraten. Dazu wird würziger Glühwein über offenem Holzfeuer serviert.
* **Highlights für die Kleinen:** Die beliebte Holzkugelbahn der Nordhang Jause wird farbenfroh illuminiert und lädt zum Spielen ein. Als bleibende Erinnerung erhält jedes Kind ein eigenes kleines Licht geschenkt.
* **Eintritt frei:** Der Zugang zum Veranstaltungsgelände ist für alle Besucher kostenlos.

Ob als wärmender Abschluss nach einer herbstlichen Wandertour oder als Ausflugsziel mit Familie und Freunden: Jacke anziehen, die frische Bergluft einatmen und den Zauber der Lichter genießen!

![Lichterzauber am Nordhang in Winterberg](/events-nordhang-lichterzauber.png)

:::contact
### Nordhang Jause Winterberg
* **Standort:** In der Renau 10/11, 59955 Winterberg
* **Telefon:** 02981 8996399
* **E-Mail:** info@nordhangjause.de
* **Website:** https://www.nordhangjause.de
* **Unternehmensprofil im Verzeichnis:** [Zum Profil der Nordhang Jause Winterberg](/gastronomie/restaurant/nordhang-jause-winterberg)
:::`;

const contentNl = `Kleurrijke herfstbossen, frisse berglucht en de geur van knisperend beukenhout: het najaar in het Hochsauerland is in volle gang en tovert de heuvels rondom de Kahler Asten om in een sfeervol landschap. Bij de geliefde **Nordhang Jause in Winterberg** markeert dit het begin van het gezelligste seizoen van het jaar. Het team nodigt inwoners en vakantiegangers in oktober en november uit voor twee bijzondere evenementen waarin natuur, gezelligheid en culinaire traktaties centraal staan.

Fijn voor wandelaars en bezoekers: op beide dagen gelden de normale openingstijden, waardoor de berghut en keuken doorlopend voor iedereen geopend zijn!

## Creatieve herfstmiddag: Pompoen snijden op 23 oktober

Op **vrijdag 23 oktober 2026 vanaf 14:00 uur** kunnen jonge bezoekers hun creativiteit botvieren. In de warme berghut kunnen kinderen onder begeleiding prachtige Halloween-figuren en herfstmotieven in grote pompoenen kerven.

Buiten brandt de vuurschaal, waar samen knapperig stokbrood wordt gebakken en zoete marshmallows worden geroosterd.

### Belangrijke informatie op een rij:

* **Datum & aanvang:** Vrijdag 23 oktober 2026, vanaf 14:00 uur
* **Twee tijdsloten:** Gesneden wordt in twee etappes van 14:00 tot 16:00 uur en van 16:00 tot 18:00 uur
* **Kosten:** € 8,00 per kind (inclusief pompoen, snijmateriaal en lekkers bij het kampvuur)
* **Culinair:** Warme gerechten, streekgerechten en drankjes voor de hele familie
* **Aanmelden verplicht:** Het aantal plaatsen is beperkt; tijdige reservatie is vereist via **02981 8996399** of via **info@nordhangjause.de**.

![Pompoen snijden voor kinderen bij Nordhang Jause](/events-nordhang-kuerbisschnitzen.png)

## Betoverende Lichtjesmagie aan de Nordhang: Zaterdag 7 november

Als het herfstseizoen zijn einde nadert, pakt de Nordhang Jause op **zaterdag 7 november 2026 van 15:00 tot 22:00 uur** groots uit. Zodra de schemering valt, hullen ontelbare lampjes, lantaarns en verlichte bomen het bosperceel in een sprookjesachtige sfeer.

De **Lichtjesmagie aan de Nordhang** is een feest voor alle zintuigen:

* **Livemuziek:** De band **„Hörgerätchen“** uit Siegen zorgt voor akoestische live-klanken en een geweldige stemming rondom de hut.
* **Culinair bij het beukenhoutvuur:** Vers gegrilde vlamzalm op houtplanken, traditioneel Sauerlands aardappelbraden en dampende glühwein direct van het vuur.
* **Beleving voor de kleintjes:** De grote houten knikkerbaan wordt magisch uitgelicht en ieder kind krijgt een eigen lichtje cadeau om mee naar huis te nemen.
* **Gratis toegang:** De toegang tot het festivalterrein is voor iedereen gratis.

Ideaal als feestelijke afsluiting van een frisse herfstwandeling of voor een gezellige avond met familie en vrienden rond het vuur!

![Lichtjesmagie aan de Nordhang](/events-nordhang-lichterzauber.png)

:::contact
### Nordhang Jause Winterberg
* **Locatie:** In der Renau 10/11, 59955 Winterberg
* **Telefoon:** 02981 8996399
* **E-mail:** info@nordhangjause.de
* **Website:** https://www.nordhangjause.de
* **Bedrijfsprofiel in het overzicht:** [Naar het profiel van Nordhang Jause Winterberg](/nl/horeca/restaurants/nordhang-jause-winterberg)
:::`;

async function run() {
  const newsData = {
    title: "Goldener Oktober & leuchtende Novemberabende: Die Herbst-Highlights an der Nordhang Jause",
    title_nl: "Gouden herfst & fonkelende avonden: De najaarshoogtepunten bij Nordhang Jause",
    slug: "herbstzeit-nordhang-jause-kuerbisschnitzen-lichterzauber",
    slug_nl: "herfst-nordhang-jause-pompoensnijden-lichtjesmagie",
    author: "Simon Kräling",
    businessId: "nordhang-jause",
    businessName: "Nordhang Jause Winterberg",
    businessSlug: "gastronomie/restaurant/nordhang-jause-winterberg",
    imageUrl: "/news-nordhang-jause-herbstevents.jpg",
    imageCredit: "Flyer / Fotos: Nordhang Jause Winterberg",
    isAiGenerated: false,
    status: "approved",
    date: new Date().toISOString(),
    content: contentDe,
    content_nl: contentNl
  };

  try {
    const docRef = doc(db, 'news', 'B99nqQbUNBZVpUXNNgNj');
    await setDoc(docRef, newsData, { merge: true });
    console.log("SUCCESS! Updated Firestore news doc with clean formatting and PNG links!");
  } catch (err) {
    console.error("ERROR updating news in Firestore:", err);
  }
}

run();
