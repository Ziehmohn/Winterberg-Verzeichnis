import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, doc, setDoc, getDoc } from 'firebase/firestore';

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

const contentDe = `Wenn die Tage kürzer werden und sich der Herbst im Hochsauerland von seiner schönsten Seite zeigt, wird es auch an der Winterberger Nordhang Jause wieder besonders urig und gemütlich. Mit zwei besonderen Veranstaltungen lädt das Team Groß und Klein dazu ein, gemeinsam unvergessliche Herbststunden an der frischen Bergluft und am wärmenden Feuer zu verbringen.

Bei allen Live-Events gilt: Es gelten die regulären Öffnungszeiten – Hütte und Küche sind durchgehend für jedermann geöffnet!

## 1. Kürbisschnitzen für Kids – Freitag, 23. Oktober 2026

Kürbisse schnitzen, Stockbrot und Marshmallows am knisternden Lagerfeuer rösten und einfach eine schöne Familienzeit zusammen verbringen: Beim Kürbisschnitzen dürfen die Kids kreativ werden und ihren ganz persönlichen Halloween-Kürbis gestalten.

* **Termin:** Freitag, 23. Oktober 2026, ab 14:00 Uhr
* **Zwei Zeitfenster:** Geschnitzt wird von 14:00 bis 16:00 Uhr sowie von 16:00 bis 18:00 Uhr
* **Unkostenbeitrag:** 8,00 € pro Kind/Kürbis
* **Highlights:** Stockbrot & Marshmallows vom Lagerfeuer, Speisen & Getränke für Groß und Klein
* **Wichtig – Vorherige Anmeldung erforderlich:** Damit für jedes Kind ein Kürbis und ein Arbeitsplatz vorbereitet werden können, ist eine Anmeldung unbedingt erforderlich (telefonisch unter 02981 / 8996399 oder per E-Mail an info@nordhangjause.de). Die Plätze sind begrenzt!

![Kürbisschnitzen für Kids an der Nordhang Jause](/events-nordhang-kuerbisschnitzen.jpg)

## 2. Lichterzauber am Nordhang – Samstag, 7. November 2026

Wenn es draußen langsam dunkel wird, beginnt der Nordhang zu leuchten! Beim Lichterzauber verwandeln zahlreiche Lichter und Strahler das Gelände rund um die Nordhang Jause in eine zauberhafte Kulisse für die ganze Familie.

* **Termin:** Samstag, 7. November 2026, von 15:00 bis 22:00 Uhr
* **Eintritt frei!**
* **Live-Musik:** Musikalische Unterhaltung mit der Band „Hörgerätchen“ aus Siegen
* **Kulinarik am Buchenholzfeuer:** Frischer Flammlachs, traditioneller Kartoffelbraten, Getränkestand & heißer Glühwein vom offenen Feuer
* **Illuminierter Lichterwald & Kugelbahn:** Auch die beliebte Holzkugelbahn wird stimmungsvoll in Szene gesetzt und kann von den kleinen Besuchern bespielt werden
* **Ein Licht für jedes Kind:** Als Erinnerung erhält jedes Kind ein eigenes kleines Licht geschenkt

Ob beim herbstlichen Familiennachmittag oder beim stimmungsvollen Lichterzauber mit Musik, Feuer und gutem Essen: Jacke an, raus an die frische Luft und gemeinsam den Herbst am Nordhang genießen!

![Lichterzauber am Nordhang](/events-nordhang-lichterzauber.jpg)

:::contact
### Nordhang Jause Winterberg
* **Standort:** In der Renau 10/11, 59955 Winterberg
* **Telefon:** 02981 8996399
* **E-Mail:** info@nordhangjause.de
* **Website:** https://www.nordhangjause.de
* **Unternehmensprofil im Verzeichnis:** [Zum Profil der Nordhang Jause Winterberg](/gastronomie/restaurant/nordhang-jause-winterberg)
:::`;

const contentNl = `Wanneer de dagen korter worden en de herfst in het Hochsauerland op zijn mooist is, wordt het ook bij de Winterbergse Nordhang Jause weer bijzonder gezellig. Met twee speciale evenementen nodigt het team jong en oud uit om samen te genieten van de frisse berglucht en het kampvuur.

Voor alle live-evenementen geldt: De normale openingstijden zijn van kracht – hut en keuken zijn doorlopend voor iedereen geopend!

## 1. Pompoen snijden voor kinderen – Vrijdag 23 oktober 2026

Pompoenen uitsnijden, marshmallows en brooddeeg roosteren boven het knisperende kampvuur en genieten van een gezellige herfstmiddag: tijdens het pompoensnijden kunnen kinderen hun creativiteit de vrije loop laten en hun eigen Halloween-pompoen maken.

* **Datum & tijd:** Vrijdag 23 oktober 2026, vanaf 14:00 uur
* **Twee tijdsloten:** Er wordt gesneden van 14:00 tot 16:00 uur en van 16:00 tot 18:00 uur
* **Kosten:** € 8,00 per kind/pompoen
* **Highlights:** Marshmallows & broodjes van het kampvuur, eten & drinken voor jong en oud
* **Belangrijk – Vooraf aanmelden verplicht:** Om voor ieder kind een pompoen en een plek klaar te zetten, is vooraf reserveren noodzakelijk (telefonisch via 02981 / 8996399 of per e-mail via info@nordhangjause.de). Het aantal plaatsen is beperkt!

![Pompoen snijden voor kinderen bij Nordhang Jause](/events-nordhang-kuerbisschnitzen.jpg)

## 2. Lichtjesmagie aan de Nordhang – Zaterdag 7 november 2026

Wanneer het buiten langzaam donker wordt, begint de Nordhang te stralen! Talloze lichtjes toveren het terrein rondom de Nordhang Jause om in een sprookjesachtig decor.

* **Datum & tijd:** Zaterdag 7 november 2026, van 15:00 tot 22:00 uur
* **Toegang gratis!**
* **Livemuziek:** Muzikaal genieten met de band „Hörgerätchen“ uit Siegen
* **Culinair bij het beukenhoutvuur:** Verse vlamzalm, traditioneel Sauerlands aardappelbraden, drankstand & warme glühwein van het open vuur
* **Verlicht bos & knikkerbaan:** Ook de populaire houten knikkerbaan wordt sfeervol uitgelicht en kan door de kinderen worden gebruikt
* **Een lichtje voor ieder kind:** Ieder kind krijgt een eigen klein lichtje cadeau als herinnering

Trek een warme jas aan, naar buiten in de frisse berglucht en samen de herfst beleven aan de Nordhang!

![Lichtjesmagie aan de Nordhang](/events-nordhang-lichterzauber.jpg)

:::contact
### Nordhang Jause Winterberg
* **Locatie:** In der Renau 10/11, 59955 Winterberg
* **Telefoon:** 02981 8996399
* **E-mail:** info@nordhangjause.de
* **Website:** https://www.nordhangjause.de
* **Bedrijfsprofiel in het overzicht:** [Naar het profiel van Nordhang Jause Winterberg](/nl/horeca/restaurants/nordhang-jause-winterberg)
:::`;

const events = [
  {
    id: 'kuerbisschnitzen-fuer-kids-nordhang-jause-2026',
    title: 'Kürbisschnitzen für Kids an der Nordhang Jause',
    title_nl: 'Pompoen snijden voor kinderen bij Nordhang Jause',
    startDate: '2026-10-23',
    endDate: '2026-10-23',
    startTime: '14:00',
    endTime: '18:00',
    price: '8,00 € pro Kind/Kürbis',
    category: 'Familie',
    location: 'Nordhang Jause, In d. Renau 10/11, 59955 Winterberg',
    imageUrl: '/events-nordhang-kuerbisschnitzen.jpg',
    description: 'Kürbisse schnitzen, Stockbrot und Marshmallows am Lagerfeuer und leuchtende Kinderaugen: Beim Kürbisschnitzen an der Nordhang Jause dürfen Kids kreativ werden und ihren eigenen Halloween-Kürbis gestalten. Geschnitzt wird in zwei Zeitfenstern: 14:00 bis 16:00 Uhr sowie 16:00 bis 18:00 Uhr. Unkostenbeitrag: 8,00 € pro Kind/Kürbis. Vorherige Anmeldung unbedingt erforderlich unter Tel. 02981 / 8996399 oder info@nordhangjause.de (Plätze begrenzt). Hütte und Küche für jedermann regulär geöffnet!',
    description_nl: 'Pompoen snijden, marshmallows en broodjes bakken bij het kampvuur en stralende kinderogen: kinderen kunnen hun eigen Halloween-pompoen vormgeven bij Nordhang Jause. Twee tijdsloten: 14:00–16:00 uur en 16:00–18:00 uur. Kosten: € 8,00 per kind/pompoen. Vooraf aanmelden verplicht via 02981 / 8996399 of info@nordhangjause.de. De hut en keuken zijn regulier geopend voor iedereen!',
    externalUrl: 'https://www.nordhangjause.de'
  },
  {
    id: 'lichterzauber-am-nordhang-2026',
    title: 'Lichterzauber am Nordhang – Wenn der Nordhang zu leuchten beginnt',
    title_nl: 'Lichtjesmagie aan de Nordhang – Als de Nordhang begint te stralen',
    startDate: '2026-11-07',
    endDate: '2026-11-07',
    startTime: '15:00',
    endTime: '22:00',
    price: 'Freier Eintritt',
    category: 'Fest',
    location: 'Nordhang Jause, In d. Renau 10/11, 59955 Winterberg',
    imageUrl: '/events-nordhang-lichterzauber.jpg',
    description: 'Wenn es draußen langsam dunkel wird, verwandeln zahlreiche Lichter das Gelände rund um die Nordhang Jause in eine besondere Herbstkulisse. Mit Live-Musik von „Hörgerätchen“ aus Siegen, frischem Flammlachs, traditionellem Sauerländer Kartoffelbraten, Getränkestand und heißem Glühwein vom offenen Buchenholzfeuer. Die Kugelbahn wird stimmungsvoll beleuchtet und als kleines Andenken bekommt jedes Kind ein eigenes Licht geschenkt. Eintritt frei! Bei allen Live-Events gelten die regulären Öffnungszeiten – Hütte und Küche sind für jedermann geöffnet!',
    description_nl: 'Talloze lichtjes toveren het terrein rondom de Nordhang Jause om in een magisch herfstdecor! Met livemuziek van „Hörgerätchen“ uit Siegen, verse vlamzalm, traditioneel aardappelbraden, drankstand en glühwein van het beukenhoutvuur. De knikkerbaan is verlicht en ieder kind krijgt een eigen lichtje cadeau. Gratis toegang! Hut en keuken zijn voor iedereen geopend.',
    externalUrl: 'https://www.nordhangjause.de'
  }
];

async function run() {
  const newsData = {
    title: "Herbstzeit an der Nordhang Jause: Kürbisschnitzen für Kids & stimmungsvoller Lichterzauber",
    title_nl: "Herfst bij Nordhang Jause: Pompoen snijden voor kinderen & sfeervolle Lichtjesmagie",
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
    const docRef = await addDoc(collection(db, 'news'), newsData);
    console.log("SUCCESS! Inserted Nordhang Jause news with ID:", docRef.id);
  } catch (err) {
    console.error("ERROR inserting news:", err);
  }

  // Update business document in Firestore if it exists or merge it
  try {
    const busRef = doc(db, 'businesses', 'nordhang-jause');
    const busSnap = await getDoc(busRef);
    if (busSnap.exists()) {
      await setDoc(busRef, {
        events: events,
        address: 'In d. Renau 10/11, 59955 Winterberg',
        phone: '02981 8996399',
        email: 'info@nordhangjause.de',
        website: 'https://www.nordhangjause.de'
      }, { merge: true });
      console.log("SUCCESS! Updated existing Firestore business doc 'nordhang-jause'");
    } else {
      console.log("Firestore business doc 'nordhang-jause' not present, local data.ts serves as source of truth.");
    }
  } catch (err) {
    console.error("Notice updating business in Firestore:", err);
  }
}

run();
