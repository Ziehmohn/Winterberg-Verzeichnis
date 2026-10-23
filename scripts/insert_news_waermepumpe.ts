import { initializeApp } from 'firebase/app';
import { initializeFirestore, doc, setDoc } from 'firebase/firestore';
import * as fs from 'fs';
import * as path from 'path';

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

const contentDe = `Winterberg und Hallenberg setzen ein starkes Zeichen für die regionale Wärmewende: Als eine von nur 25 ausgewählten Kommunen in ganz Deutschland haben die beiden Sauerländer Nachbarstädte den Zuschlag erhalten, Gastgeber für die renommierten **bundesweiten Wärmepumpen-Infotage 2026/2027** ([waermepumpen-infotag.de](https://waermepumpen-infotag.de)) zu sein. Aus bundesweit rund 60 Bewerbungen überzeugte das gemeinsame Konzept der beiden Städte. Die Großveranstaltung kommt im **Januar 2027** nach Winterberg – das genaue Veranstaltungsdatum und der Tagungsort folgen in Kürze.

Mit den bereits erfolgreich abgeschlossenen kommunalen Wärmeplanungen haben die Städte Winterberg und Hallenberg eine verlässliche und zukunftsfähige Grundlage geschaffen. Dabei steht fest: Für einen Großteil der Bürgerinnen und Bürger wird eine dezentrale Lösung – allen voran moderne Wärmepumpensysteme – eine tragende Rolle bei der Wärmeversorgung des eigenen Gebäudes einnehmen. Umso entscheidender ist es, frühzeitig unabhängige, verlässliche Orientierung und praxisnahe Beratung zu erhalten.

## Beratungsmarathon statt reiner Frontalvortrag

Genau hier setzt der Wärmepumpen-Infotag an: Er versteht sich nicht als bloße Informationsveranstaltung, sondern als echter **Beratungsmarathon**. Interessierte können ihre individuellen Fragen, Gebäudedaten und Sanierungspläne direkt vor Ort im persönlichen Gespräch mit Fachleuten durchgehen.

Der Infotag informiert herstellerneutral, praxisnah und verständlich über den Heizungstausch. Geleitet wird er von den führenden Wärmewende-Experten Dr. Jens Clausen und Dr. Marek Miara rund um Initiatorin Anja Floetenmeyer-Woltmann. Ein wesentlicher Pluspunkt: Zahlreiche lokale Installations- und Fachbetriebe sowie Energieberater aus der Region sind direkt eingebunden, sodass der Schritt von der theoretischen Überlegung zur handwerklichen Umsetzung nahtlos gelingt.

## Für Ein- und Mehrfamilienhäuser, Selbstnutzer & Vermieter

Passt eine moderne Wärmepumpe auch zu einem älteren Bestandsgebäude? Muss zwingend vorher aufwendig gedämmt werden? Welche Vorlauftemperaturen sind realisierbar? Und wie sieht eine Lösung im Mehrfamilienhaus mit bisherigen Gasetagenheizungen aus?

Der Wärmepumpen-Infotag beantwortet diese Fragen differenziert für alle Eigentumsformen:
* **Einfamilienhausbesitzende:** Konkrete Berechnungsgrundlagen, Machbarkeitschecks und Empfehlungen zur Auslegung.
* **Eigentümer von Mehrfamilienhäusern & WEGs:** Technische Konzepte für zentrale oder etagenweise Lösungen sowie Austauschmöglichkeiten mit erfahrenen Fachbetrieben.
* **Vermieterinnen & Vermieter:** Transparente Aufschlüsselung von Investitionskosten, Steuervorteilen und umlagefähigen Modernisierungskosten – fair kalkuliert ohne übermäßige Belastung der Mieter.

## Fördermittel: „Wer wartet, verliert Geld“

Ein wichtiger Faktor für die zeitnahe Durchführung ist die staatliche Förderkulisse: Die Bundesförderung für effiziente Gebäude (BEG) zum Heizungstausch schmilzt seit Juli 2026 stufenweise alle sechs Monate ab. Wer sich jetzt informiert und Klarheit verschafft, sichert sich rechtzeitig die höchstmöglichen Fördersätze für die Investition.

Bereits im Jahr 2025 hat die Wärmepumpe in Deutschland ihren Durchbruch gefeiert: Mit rund **48 Prozent Marktanteil** war sie die meistverkaufte Heiztechnik bundesweit – es wurden mehr Wärmepumpen installiert als Gas- und Ölheizungen zusammen.

## Bürgermeister Beckmann & Eppner: „Niemand bleibt mit seinen Fragen allein“

Die Bürgermeister Michael Beckmann (Winterberg) und Enrico Eppner (Hallenberg) betonen die Bedeutung des Zuschlags für die Region:

> „Wir freuen uns sehr, dass Winterberg und Hallenberg für diesen besonderen Wärmepumpen-Infotag ausgewählt wurden und wir unseren Bürgerinnen und Bürgern damit ein so umfassendes Beratungsangebot direkt vor Ort machen können. Unsere kommunalen Wärmeplanungen zeigen, dass viele Haushalte ihre Wärmeversorgung künftig eigenständig und dezentral gestalten werden – umso wichtiger ist es, dass niemand mit seinen Fragen allein bleibt und konkrete, verständliche Antworten bekommt. Der Wärmepumpen-Infotag ist deshalb eine hervorragende Gelegenheit, sich umfassend zu informieren, individuelle Fragen zu klären und die nächsten Schritte für die eigene Immobilie gut vorbereitet anzugehen.“

:::contact
### Wichtige Fakten & Pressekontakt
Alle Kerninformationen zum bundesweiten Wärmepumpen-Infotag im Überblick:

* **Veranstaltung:** Bundesweiter Wärmepumpen-Infotag 2026/2027
* **Zeitraum:** Januar 2027 (genauer Tag und Uhrzeit werden in Kürze bekanntgegeben)
* **Ort:** Winterberg (Veranstaltungsort wird zeitnah veröffentlicht)
* **Teilnahme:** Herstellerneutral, praxisnah und kostenfrei für Bürgerinnen und Bürger
* **Initiative & Experten:** Veranstaltungsreihe unter Mitwirkung renommierter Wärmewende-Experten (u. a. Dr. Jens Clausen, Dr. Marek Miara, Anja Floetenmeyer-Woltmann) in Kooperation mit dem Bundesverband Wärmepumpe (BWP)
* **Weitere Informationen:** [waermepumpen-infotag.de](https://waermepumpen-infotag.de) und [Rathaus Winterberg](https://www.rathaus-winterberg.de/leben-wohnen/waermepumpen-infotag/)
* **Pressekontakt Stadt Winterberg:** Öffentlichkeitsarbeit · Rabea Kappen · Fichtenweg 10, 59955 Winterberg · Tel: [02981 800 121](tel:02981800121) · [rabea.kappen@winterberg.de](mailto:rabea.kappen@winterberg.de)
:::`;

const contentNl = `Winterberg en Hallenberg zetten een belangrijke stap in de regionale energietransitie: als een van de slechts 25 geselecteerde gemeenten in heel Duitsland mogen beide Sauerlandse buursteden de gerenommeerde **landelijke Warmtepomp Infodagen 2026/2027** ([waermepumpen-infotag.de](https://waermepumpen-infotag.de)) verwelkomen. Uit circa 60 inzendingen uit het hele land werd het gezamenlijke concept van Winterberg en Hallenberg gekozen. Het evenement vindt plaats in **januari 2027** in Winterberg – de exacte datum en locatie worden binnenkort bekendgemaakt.

Met de reeds afgeronde gemeentelijke warmteplannen hebben de steden Winterberg en Hallenberg een heldere basis gelegd voor de toekomstige warmtevoorziening. Eén conclusie staat vast: voor veel huiseigenaren en bewoners zal een decentrale installatie – met name een warmtepomp – de sleutel vormen. Betrouwbare, onafhankelijke informatie en concreet advies zijn daarbij onmisbaar.

## Een adviesmarathon met regionale vakbedrijven

De Warmtepomp Infodag is geen statische lezing, maar een actieve **adviesmarathon**. Bezoekers krijgen de gelegenheid om hun specifieke woonsituatie, verbruiksgegevens en verbouwingsplannen één-op-één met experts en lokale installateurs te bespreken.

De voorlichting is merkneutraal, praktisch en begrijpelijk van opzet. De dag wordt geleid door toonaangevende Duitse warmtetransitie-experts zoals dr. Jens Clausen en dr. Marek Miara rond initiatiefneemster Anja Floetenmeyer-Woltmann. Doordat tevens tal van lokale installatiebedrijven en energieadviseurs aanwezig zijn, kan de stap van advies naar daadwerkelijke installatie direct worden gezet.

## Voor eengezinswoningen, appartementen en verhuurders

Past een warmtepomp in een ouder pand? Is voorafgaande extra isolatie verplicht? Welke aanvoertemperaturen zijn realistisch? En wat zijn de opties voor appartementsgebouwen met individuele gasketels?

De Warmtepomp Infodag biedt gerichte antwoorden voor alle woonsituaties:
* **Eigenaars van eengezinswoningen:** Heldere berekeningen, haalbaarheidsanalyses en advies over dimensionering.
* **Appartementsgebouwen & VvE's:** Technische concepten voor centrale of etage-oplossingen in overleg met gespecialiseerde vakmensen.
* **Verhuurders:** Duidelijkheid over investeringskosten, fiscale voordelen en subsidieregelingen – zonder onnodige verhoging van de lasten voor huurders.

## Subsidies: „Wie wacht, verliest geld“

Een extra reden voor snelle actie is het Duitse subsidiestelsel (BEG): de subsidiepercentages voor verwarmingsvervanging worden sinds juli 2026 ieder halfjaar stapsgewijs afgebouwd. Wie tijdig plannen maakt, profiteert nog van de hoogste subsidiebedragen.

In 2025 beleefde de warmtepomp in Duitsland al een historisch succes: met een marktaandeel van circa **48 procent** was het de best verkochte verwarmingstechniek van het land – er werden meer warmtepompen geplaatst dan gas- en olieketels samen.

## Burgemeesters Beckmann en Eppner: „Niemand blijft met vragen achter“

Burgemeester Michael Beckmann (Winterberg) en burgemeester Enrico Eppner (Hallenberg) lichten toe:

> „We zijn bijzonder trots dat Winterberg en Hallenberg zijn uitgekozen voor deze speciale Warmtepomp Infodag en dat we onze inwoners zo'n compleet adviesaanbod direct ter plaatse kunnen bieden. Onze gemeentelijke warmteplannen laten zien dat veel huishoudens hun warmtevoorziening zelfstandig en decentraal gaan inrichten – des te belangrijker is het dat niemand met onzekerheden blijft zitten. De Warmtepomp Infodag is dé kans om u uitvoerig te informeren, vragen op te lossen en weloverwogen de volgende stap te zetten.“

:::contact
### Kerngegevens & contact
Alle feiten over de Warmtepomp Infodag op een rij:

* **Evenement:** Bundesweiter Wärmepumpen-Infotag 2026/2027
* **Periode:** Januari 2027 (precieze datum en locatie volgen binnenkort)
* **Locatie:** Winterberg
* **Deelname:** Merkneutraal, praktijkgericht en gratis toegankelijk
* **Initiatief:** Georganiseerd in samenwerking met toonaangevende Duitse experts en het Bundesverband Wärmepumpe (BWP)
* **Meer info:** [waermepumpen-infotag.de](https://waermepumpen-infotag.de) en [Rathaus Winterberg](https://www.rathaus-winterberg.de/leben-wohnen/waermepumpen-infotag/)
* **Perscontact gemeente Winterberg:** Öffentlichkeitsarbeit · Rabea Kappen · Fichtenweg 10, 59955 Winterberg · Tel: [02981 800 121](tel:02981800121) · [rabea.kappen@winterberg.de](mailto:rabea.kappen@winterberg.de)
:::`;

const articleData = {
  id: 'waermepumpen-infotag-winterberg-hallenberg-2027',
  slug: 'waermepumpen-infotag-winterberg-hallenberg-gastgeber-2027',
  slug_nl: 'warmtepomp-infodag-winterberg-hallenberg-gastgemeente-2027',
  title: 'Winterberg und Hallenberg werden Gastgeber für den bundesweiten Wärmepumpen-Infotag',
  title_nl: 'Winterberg en Hallenberg gastgemeenten voor landelijke Warmtepomp-Infodag',
  author: 'Stadt Winterberg',
  businessName: 'Stadt Winterberg & Stadt Hallenberg',
  imageUrl: '/news-waermepumpen-infotag-winterberg.jpg',
  isAiGenerated: true,
  status: 'approved',
  date: '2026-10-23T10:00:00.000Z',
  content: contentDe,
  content_nl: contentNl
};

async function run() {
  console.log("1. Writing to Firestore...");
  const docRef = doc(db, 'news', articleData.id);
  await setDoc(docRef, articleData, { merge: true });
  console.log("Successfully wrote to Firestore document:", articleData.id);

  console.log("2. Updating src/dataNews.ts...");
  const dataNewsPath = path.resolve('src/dataNews.ts');
  const currentContent = fs.readFileSync(dataNewsPath, 'utf-8');

  // Check if article already in dataNews.ts
  if (currentContent.includes(articleData.id)) {
    console.log("Article already exists in src/dataNews.ts, skipping prepend.");
  } else {
    const insertMarker = 'export const initialNews: NewsArticle[] = [\n';
    if (!currentContent.includes(insertMarker)) {
      throw new Error("Could not find insertMarker in dataNews.ts");
    }

    const articleString = `  {
    id: ${JSON.stringify(articleData.id)},
    slug: ${JSON.stringify(articleData.slug)},
    slug_nl: ${JSON.stringify(articleData.slug_nl)},
    title: ${JSON.stringify(articleData.title)},
    title_nl: ${JSON.stringify(articleData.title_nl)},
    author: ${JSON.stringify(articleData.author)},
    businessName: ${JSON.stringify(articleData.businessName)},
    imageUrl: ${JSON.stringify(articleData.imageUrl)},
    imageCredit: ${JSON.stringify(articleData.imageCredit)},
    isAiGenerated: true,
    status: 'approved',
    date: ${JSON.stringify(articleData.date)},
    content: \`${articleData.content.replace(/`/g, '\\`').replace(/\${/g, '\\${')}\`,
    content_nl: \`${articleData.content_nl.replace(/`/g, '\\`').replace(/\${/g, '\\${')}\`,
  },
`;

    const updatedContent = currentContent.replace(insertMarker, insertMarker + articleString);
    fs.writeFileSync(dataNewsPath, updatedContent, 'utf-8');
    console.log("Successfully prepended article to src/dataNews.ts!");
  }
}

run().then(() => {
  console.log("DONE!");
  process.exit(0);
}).catch(err => {
  console.error("FATAL ERROR:", err);
  process.exit(1);
});
