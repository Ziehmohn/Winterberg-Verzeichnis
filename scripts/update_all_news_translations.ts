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

async function updateAllNewsTranslations() {
  // 1. Ladenlokale
  const ladenlokaleNl = `In Winterberg en de omliggende dorpen ontstaan momenteel aantrekkelijke kansen voor starters, ondernemers en gevestigde bedrijven. De Wirtschaftsförderung van de stad Winterberg biedt momenteel zeven veelzijdige winkel- en horecapanden aan – van moderne winkelruimtes in de drukke voetgangerszone tot sfeervolle panden in het historische centrum en ruime locaties in de stadsdelen.

Daarnaast profiteren nieuwe ondernemers van aantrekkelijke subsidieprogramma's die de instap en huur in het centrum financieel aanzienlijk vergemakkelijken.

## Beschikbare winkel- en bedrijfspanden in Winterberg

* **Winkelpand Untere Pforte 4a (Winterberg Kernstad)**
  Ca. 50 m² winkelruimte in het bovenste gedeelte van de Untere Pforte, nabij het marktplein. Grote etalage, lichte verkoopruimte en flexibele indelingsmogelijkheden voor boetieks of speciaalzaken.

* **Winkelpand Hauptstraße 2 (Winterberg Kernstad)**
  Ca. 80 m² representatieve verkoopruimte op een absolute A-locatie direct in de voetgangerszone met hoge passantenstroom en uitstekende zichtbaarheid.

* **Winkelpand Marktstraße 11 (Winterberg Kernstad)**
  Ca. 120 m² in het sfeervolle centrum nabij de Untere Pforte, ideaal voor detailhandel, studio of advieskantoor met royale etalagefronten.

* **Winkelpand Hellenstraße 31 (Winterberg Kernstad)**
  Ca. 95 m² centrale winkel- of kantoorruimte aan een levendige verbindingsstraat tussen station en marktplein, inclusief magazijn en parkeermogelijkheden.

* **Winkelruimte Nuhnestraße 10 (Hallenberg / Winterberg Zuid)**
  Ca. 140 m² multifunctionele commerciële ruimte, uitstekend geschikt voor dienstverlening, showroom of ambachtelijk atelier.

* **Winkelpand Bahnhofstraße 6 (Siedlinghausen)**
  Ca. 110 m² veelzijdige winkelruimte in het centrum van Siedlinghausen, geschikt voor lokale voorzieningen, praktijk of speciaalzaak met goede parkeergelegenheid.

* **Winkelpand Poststraße 8 (Niedersfeld)**
  Ca. 75 m² compacte winkelruimte in het dorpscentrum van Niedersfeld, perfect voor lokale dienstverleners of een klein verkoopkantoor.

## Aantrekkelijke subsidies voor starters en vestigers

Om de instap te vergemakkelijken, ondersteunt de overheid nieuwe vestigingen met gerichte stimuleringsmaatregelen:

* **Subsidieprogramma Toekomst Binnenstad NRW**
  Verhuurders verlagen de huurprijs met 30%, de deelstaat NRW vergoedt via de gemeente een groot deel van de resterende huur, waardoor huurders tijdelijk slechts een fractie van de reguliere huurprijs betalen.

* **Gemeentelijk Huursubsidiefonds Winterberg**
  Aanvullende lokale financiële ondersteuning voor innovatieve winkel- en horecaconcepten die bijdragen aan de levendigheid van het stadscentrum.

:::contact
### Contact & Ondernemersadvies
Geïnteresseerde ondernemers en investeerders kunnen voor vrijblijvend advies en gedetailleerde brochures direct contact opnemen met de Wirtschaftsförderung:

* **Contactpersoon:** Wirtschaftsförderung Stadt Winterberg
* **Telefoon:** 02981 800-0
* **E-mail:** wirtschaftsfoerderung@winterberg.de
* **Officiële website:** [Winkel- en bedrijfspanden op winterberg.de](https://www.winterberg.de/service-kontakt/wirtschaftsfoerderung/geschaeftslokale/)
:::`;

  try {
    await updateDoc(doc(db, 'news', '0MFwSDdhOmyvv3O8IqnA'), {
      title_nl: 'Leegstaande winkelpanden in Winterberg: Nieuwe kansen voor ondernemers, horeca & detailhandel',
      content_nl: ladenlokaleNl,
      author: 'Simon Kräling'
    });
    console.log('1. Updated Ladenlokale news with Dutch translation');
  } catch (e) {
    console.error('Error updating Ladenlokale:', e);
  }

  // 2. Kinderarztpraxis
  const kinderarztNl = `Grote opluchting voor gezinnen in Winterberg, Medebach en Hallenberg: Aan de Poststraße 12 in Winterberg heeft de nieuwe praktijk voor kinder- en jeugdgeneeskunde haar deuren geopend. Hiermee wordt de regionale medische zorg voor kinderen aanzienlijk versterkt en behoren lange reistijden naar omliggende steden tot het verleden.

De nieuwe praktijk valt onder de verantwoordelijkheid van het St. Franziskus Hospital Winterberg. De vestiging kwam tot stand in nauwe samenwerking tussen de stad Winterberg, de lokale economische ontwikkeling en de buurgemeenten Medebach en Hallenberg.

## Het praktijkteam aan de Poststraße

Een ervaren medisch team zorgt voor deskundige en kindvriendelijke zorg:

* **Dr. Peter Gelshäuser (Medisch Directeur)**
  Gespecialiseerd kinder- en jeugdarts in voltijd met jarenlange ervaring in praktijk en kliniek.

* **Dr. Ralph Armbrust (Kinder- en Jeugdarts)**
  Ondersteunt de praktijk in deeltijd en verzorgt de waarneming.

* **Toegewijd praktijkteam**
  Een team van vijf medisch assistenten begeleidt gezinnen van afspraak tot behandeling.

:::contact
### Contact & Praktijkinformatie
Alle openingstijden, diensten en contactgegevens vindt u in het bedrijfsprofiel op het Winterberg Verzeichnis:

* **Locatie:** Poststraße 12, 59955 Winterberg
* **Telefoon:** 02981 909348-0
* **E-mail:** kinderarzt@kh-winterberg.de
* **Bedrijfsprofiel in het overzicht:** [Naar de profielpagina van de Kinderarztpraxis Winterberg](/gesundheit-und-medizin/aerzte-und-praxen/kinderarztpraxis-winterberg-mvz)
:::`;

  try {
    await updateDoc(doc(db, 'news', 'LA4bNJGhklrO7Esjb98e'), {
      title_nl: 'Nieuwe kinderartsenpraktijk aan de Poststraße in Winterberg geopend',
      content_nl: kinderarztNl,
      author: 'Simon Kräling',
      businessId: 'kinderarztpraxis-winterberg',
      businessName: 'Kinderarztpraxis Winterberg (MVZ)',
      businessSlug: 'kinderarztpraxis-winterberg-mvz'
    });
    console.log('2. Updated Kinderarzt news with Dutch translation and business link');
  } catch (e) {
    console.error('Error updating Kinderarzt:', e);
  }

  // 3. Gospel Stars
  const gospelNl = `Op zondag 20 december 2026 kunnen muziekliefhebbers en cultuurbezoekers in het Sauerland zich verheugen op een bijzonder muzikaal hoogtepunt: De wereldberoemde **New York Gospel Stars** treden op in Winterberg en brengen hun onmiskenbare energie, krachtige stemmen en diepe emotie naar het podium van de Stadthalle Oversum aan het Kurpark.

Met opzwepende ritmes, emotionele solo's en indrukwekkende koorzang neemt het internationaal befaamde ensemble het publiek mee op een muzikale reis naar de gospelkerken van New York – een sfeervol concert precies op tijd voor de feestdagen.

## Een onvergetelijke avond vol Gospel & Soul

Het publiek kan genieten van een meeslepende mix van wereldberoemde gospelklassiekers, traditionele hymnes en sfeervolle kerstmuziek:

* **Krachtig ensemble uit New York**
  Uitzonderlijke zangers en zangeressen inspireren met passie, dynamiek en authentieke gospelcultuur die raakt.

* **Mooie en veilige evenementenlocatie in het Oversum**
  Het moderne congres- en evenementencentrum aan het Kurpark biedt een aantrekkelijke en veilige omgeving met uitstekende akoestiek.

* **Kultureel hoogtepunt voor de feestdagen**
  Een inspirerende concertavond voor inwoners en vakantiegangers die feestelijke voorpret brengt in het winterse bergstadje.

:::contact
### Evenementdetails & Tickets
Reserveer tijdig uw toegangskaarten voor het concert van de New York Gospel Stars in Winterberg:

* **Datum:** Zondag 20 december 2026
* **Tijden:** Zaal open vanaf 17:00 uur | Aanvang om 18:00 uur
* **Locatie:** Stadthalle Oversum, Am Kurpark 6, 59955 Winterberg
* **Toegangsprijs:** 37,50 €
* **Online kaartverkoop:** [Tickets direct boeken bij organisator LB Events](https://www.lb-events.de/de/veranstaltungen/new-york-gospel-stars-1.html)
* **Locatieprofiel:** [Naar de profielpagina van de Stadthalle Oversum](/dienstleistungen/tagungszentren/stadthalle-oversum)
:::`;

  try {
    await updateDoc(doc(db, 'news', 'yYTxj1idu2eW41hpeynL'), {
      title_nl: 'New York Gospel Stars live in Winterberg: Kerstconcert-hoogtepunt in het Oversum',
      content_nl: gospelNl,
      author: 'Simon Kräling',
      businessId: 'stadthalle-oversum-winterberg',
      businessName: 'Stadthalle Oversum',
      businessSlug: 'stadthalle-oversum'
    });
    console.log('3. Updated Gospel news with Dutch translation and business link');
  } catch (e) {
    console.error('Error updating Gospel:', e);
  }
}

updateAllNewsTranslations();
