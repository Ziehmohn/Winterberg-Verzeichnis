const fs = require('fs');
const path = require('path');
const { initializeApp } = require('firebase/app');
const { initializeFirestore, doc, setDoc, getDoc } = require('firebase/firestore');

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

// 1. Pilgerkirche Altastenberg events
const pilgerkircheEvents = [
  {
    id: 'pilgergottesdienst-altastenberg-november-2026',
    title: 'Pilgergottesdienst in der Pilgerkirche Altastenberg',
    title_nl: 'Pelgrimsviering in de pelgrimskerk Altastenberg',
    startDate: '2026-11-07',
    endDate: '2026-11-07',
    startTime: '14:00',
    endTime: '',
    category: 'Kultur',
    location: 'Pilgerkirche St. Erasmus, Am Dorfgarten 6, 59955 Winterberg-Altastenberg',
    coordinates: { lat: 51.1895, lng: 8.4682 },
    price: 'Kostenlos',
    imageUrl: '/events-pilgerkirche-altastenberg.jpg',
    organizer: 'Pilgerkirche Altastenberg',
    description: 'Besonderer Pilgergottesdienst in der höchstgelegenen Pilgerkirche des Sauerlands, der katholischen Pfarr- und Pilgerkirche St. Erasmus in Altastenberg. Ein stimmungsvoller Gottesdienst für Einheimische, Wanderer und Pilger.\n\nBeginn: 14:00 Uhr.',
    description_nl: 'Speciale pelgrimsviering in de hoogstgelegen pelgrimskerk van het Sauerland, de St. Erasmuskerk in Altastenberg. Een sfeervolle dienst voor inwoners, wandelaars en pelgrims.\n\nAanvang: 14:00 uur.',
    slug: 'pilgergottesdienst-altastenberg-07-11-2026',
    slug_nl: 'pelgrimsviering-altastenberg-07-11-2026'
  },
  {
    id: 'kultur-talk-vorstadtkinderinstinkt-altastenberg-2026',
    title: 'Kultur & Talk in der Kirche: Vorstadtkinderinstinkt',
    title_nl: 'Cultuur & Talk in de kerk: Vorstadtkinderinstinkt',
    startDate: '2026-11-14',
    endDate: '2026-11-14',
    startTime: '18:00',
    endTime: '',
    category: 'Konzert',
    location: 'Pilgerkirche St. Erasmus, Am Dorfgarten 6, 59955 Winterberg-Altastenberg',
    coordinates: { lat: 51.1895, lng: 8.4682 },
    price: 'Eintritt frei / Spende erbeten',
    imageUrl: '/events-pilgerkirche-altastenberg.jpg',
    organizer: 'Pilgerkirche Altastenberg',
    description: 'Kultur & Talk in der Kirche mit VORSTADTKINDERINSTINKT (Singer/Songwriter aus Essen).\n\nErleben Sie einfühlsame, handgemachte Akustik-Musik, emotionale Texte und anregende Gespräche in der besonderen Atmosphäre der Pilgerkirche Altastenberg.\n\nBeginn: 18:00 Uhr.',
    description_nl: 'Cultuur & Talk in de kerk met VORSTADTKINDERINSTINKT (singer-songwriters uit Essen).\n\nGeniet van akoestische luistermuziek, poëtische teksten en inspirerende gesprekken in de unieke ambiance van de pelgrimskerk Altastenberg.\n\nAanvang: 18:00 uur.',
    slug: 'kultur-talk-vorstadtkinderinstinkt-altastenberg-2026',
    slug_nl: 'cultuur-talk-vorstadtkinderinstinkt-altastenberg-2026'
  },
  {
    id: 'pilgergottesdienst-advent-altastenberg-2026',
    title: 'Pilgergottesdienst im Advent mit Punsch & Leckereien',
    title_nl: 'Advent-pelgrimsviering met punch & lekkernijen',
    startDate: '2026-12-05',
    endDate: '2026-12-05',
    startTime: '14:00',
    endTime: '',
    category: 'Kultur',
    location: 'Pilgerkirche St. Erasmus, Am Dorfgarten 6, 59955 Winterberg-Altastenberg',
    coordinates: { lat: 51.1895, lng: 8.4682 },
    price: 'Kostenlos',
    imageUrl: '/events-pilgerkirche-altastenberg.jpg',
    organizer: 'Pilgerkirche Altastenberg',
    description: 'Festlicher Pilgergottesdienst im Advent in der Pilgerkirche Altastenberg. Nach dem Gottesdienst sind alle Besucher herzlich zu warmem Punsch und winterlichen Leckereien in gemütlicher Runde eingeladen.\n\nBeginn: 14:00 Uhr.',
    description_nl: 'Sfeervolle pelgrimsviering in de advent in de pelgrimskerk Altastenberg. Na de viering is er warme punch en winterse lekkernijen voor alle aanwezigen.\n\nAanvang: 14:00 uur.',
    slug: 'pilgergottesdienst-advent-altastenberg-2026',
    slug_nl: 'advent-pelgrimsviering-altastenberg-2026'
  },
  {
    id: 'wein-und-bibel-altastenberg-2026',
    title: 'Wein & Bibel – Ein besinnlicher Abend vor den Festtagen',
    title_nl: 'Wijn & Bijbel – Een bezinningsavond voor de feestdagen',
    startDate: '2026-12-19',
    endDate: '2026-12-19',
    startTime: '18:00',
    endTime: '',
    category: 'Kulinarik',
    location: 'Pilgerkirche St. Erasmus, Am Dorfgarten 6, 59955 Winterberg-Altastenberg',
    coordinates: { lat: 51.1895, lng: 8.4682 },
    price: 'Um Anmeldung wird gebeten',
    imageUrl: '/events-pilgerkirche-altastenberg.jpg',
    organizer: 'Pilgerkirche Altastenberg',
    description: 'Wein & Bibel: Ein besinnlicher Abend vor den Festtagen in der Pilgerkirche Altastenberg. Bei ausgewählten Weinen, inspirierenden Gedanken und guten Gesprächen zur Ruhe kommen und sich auf Weihnachten einstimmen.\n\nBeginn: 18:00 Uhr.\nUm vorherige Anmeldung wird gebeten.',
    description_nl: 'Wijn & Bijbel: een sfeervolle avond voor de kerstdagen in de pelgrimskerk van Altastenberg. Met goede wijnen, inspirerende bijbelteksten en ontmoeting.\n\nAanvang: 18:00 uur. Graag vooraf aanmelden.',
    slug: 'wein-und-bibel-altastenberg-2026',
    slug_nl: 'wijn-en-bijbel-altastenberg-2026'
  },
  {
    id: 'weihnachten-platz-fuer-dich-altastenberg-2026',
    title: 'Weihnachten – Platz für dich (Gottesdienst an Heiligabend)',
    title_nl: 'Kerstmis – Plek voor jou (Gezinsviering kerstavond)',
    startDate: '2026-12-24',
    endDate: '2026-12-24',
    startTime: '16:00',
    endTime: '',
    category: 'Familie & Kinder',
    location: 'Pilgerkirche St. Erasmus, Am Dorfgarten 6, 59955 Winterberg-Altastenberg',
    coordinates: { lat: 51.1895, lng: 8.4682 },
    price: 'Kostenlos',
    imageUrl: '/events-pilgerkirche-altastenberg.jpg',
    organizer: 'Pilgerkirche Altastenberg',
    description: '„Weihnachten – Platz für dich.“ Ein ganz besonderer Weihnachtsgottesdienst für Große und Kleine in der festlich erleuchteten Pilgerkirche Altastenberg.\n\nBeginn: 16:00 Uhr.',
    description_nl: '„Kerstmis – plek voor jou.“ Een bijzondere kerstviering voor groot en klein op kerstavond in de feestelijk verlichte kerk van Altastenberg.\n\nAanvang: 16:00 uur.',
    slug: 'weihnachten-platz-fuer-dich-altastenberg-2026',
    slug_nl: 'kerstmis-plek-voor-jou-altastenberg-2026'
  },
  {
    id: 'kindersegnung-altastenberg-2026',
    title: 'Kindersegnung in der Pilgerkirche Altastenberg',
    title_nl: 'Kinderzegening in de pelgrimskerk Altastenberg',
    startDate: '2026-12-27',
    endDate: '2026-12-27',
    startTime: '11:00',
    endTime: '',
    category: 'Familie & Kinder',
    location: 'Pilgerkirche St. Erasmus, Am Dorfgarten 6, 59955 Winterberg-Altastenberg',
    coordinates: { lat: 51.1895, lng: 8.4682 },
    price: 'Kostenlos',
    imageUrl: '/events-pilgerkirche-altastenberg.jpg',
    organizer: 'Pilgerkirche Altastenberg',
    description: 'Traditionelle Kindersegnung in der Pilgerkirche Altastenberg. Ein liebevoller Segensgottesdienst für alle Babys, Kinder und ihre Familien.\n\nBeginn: 11:00 Uhr.',
    description_nl: 'Traditionele kinderzegening in de pelgrimskerk Altastenberg. Een feestelijke viering waarin kinderen en hun gezinnen Gods zegen ontvangen.\n\nAanvang: 11:00 uur.',
    slug: 'kindersegnung-altastenberg-2026',
    slug_nl: 'kinderzegening-altastenberg-2026'
  },
  {
    id: 'pilgergottesdienst-neujahr-altastenberg-2027',
    title: 'Pilgergottesdienst zum Neuen Jahr 2027',
    title_nl: 'Nieuwjaars-pelgrimsviering Altastenberg 2027',
    startDate: '2027-01-02',
    endDate: '2027-01-02',
    startTime: '14:00',
    endTime: '',
    category: 'Kultur',
    location: 'Pilgerkirche St. Erasmus, Am Dorfgarten 6, 59955 Winterberg-Altastenberg',
    coordinates: { lat: 51.1895, lng: 8.4682 },
    price: 'Kostenlos',
    imageUrl: '/events-pilgerkirche-altastenberg.jpg',
    organizer: 'Pilgerkirche Altastenberg',
    description: 'Pilgergottesdienst zum Beginn des neuen Jahres 2027 in der Pilgerkirche Altastenberg. Den Start ins neue Jahr bewusst und gestärkt begehen.\n\nBeginn: 14:00 Uhr.',
    description_nl: 'Pelgrimsviering voor het nieuwe jaar 2027 in de pelgrimskerk Altastenberg. Een moment van rust en inspiratie om het nieuwe jaar te beginnen.\n\nAanvang: 14:00 uur.',
    slug: 'pilgergottesdienst-neujahr-altastenberg-2027',
    slug_nl: 'nieuwjaars-pelgrimsviering-altastenberg-2027'
  },
  {
    id: 'kultur-talk-doerte-das-schwa-altastenberg-2027',
    title: 'Kultur & Talk in der Kirche: Dörte & das Schwa (Valentinstag)',
    title_nl: 'Cultuur & Talk in de kerk: Dörte & das Schwa (Valentijnsdag)',
    startDate: '2027-02-13',
    endDate: '2027-02-13',
    startTime: '18:00',
    endTime: '',
    category: 'Konzert',
    location: 'Pilgerkirche St. Erasmus, Am Dorfgarten 6, 59955 Winterberg-Altastenberg',
    coordinates: { lat: 51.1895, lng: 8.4682 },
    price: 'Eintritt frei / Spende erbeten',
    imageUrl: '/events-pilgerkirche-altastenberg.jpg',
    organizer: 'Pilgerkirche Altastenberg',
    description: 'Kultur & Talk in der Kirche zum Valentinstag mit DÖRTE & DAS SCHWA (Popmusik aus Münster).\n\nRomantische, eingängige Pop-Melodien mit Witz, Herz und Tiefgang, kombiniert mit interessanten Talk-Gästen in der Pilgerkirche Altastenberg.\n\nBeginn: 18:00 Uhr.',
    description_nl: 'Cultuur & Talk in de kerk ter ere van Valentijnsdag met DÖRTE & DAS SCHWA (popmuziek uit Münster).\n\nSfeervolle popmuziek met humor en gevoel, gecombineerd met boeiende gesprekken in de pelgrimskerk Altastenberg.\n\nAanvang: 18:00 uur.',
    slug: 'kultur-talk-doerte-das-schwa-altastenberg-2027',
    slug_nl: 'cultuur-talk-doerte-das-schwa-altastenberg-2027'
  }
];

const pilgerkircheBusiness = {
  id: 'pilgerkirche-altastenberg',
  name: 'Pilgerkirche Altastenberg (St. Erasmus)',
  category: 'Freizeit',
  subcategory: 'Outdoor-Freizeitgebiet',
  description: 'Die katholische Pfarr- und Pilgerkirche St. Erasmus in Altastenberg ist die höchstgelegene Pilgerkirche Nordrhein-Westfalens. Ein Ort der Ruhe, Spiritualität und kultureller Begegnung mit der renommierten Reihe Kultur & Talk.',
  description_nl: 'De katholieke pelgrimskerk St. Erasmus in Altastenberg is de hoogstgelegen pelgrimskerk van Noordrijn-Westfalen. Een plek van rust, spiritualiteit en cultuur met bijzondere vieringen en concerten.',
  extendedDescription: 'Auf über 780 Höhenmetern gelegen, ist die Pfarr- und Pilgerkirche St. Erasmus und Maria Schnee in Altastenberg ein spirituelles und architektonisches Kleinod im Sauerland. Wanderer auf dem Rothaarsteig und den Höhenwegen sowie Pilgernde schätzen die einladende Atmosphäre der offenen Kirche. Mit der Veranstaltungsreihe "Kultur & Talk in der Kirche", Pilgergottesdiensten zu verschiedenen Jahreszeiten, Wein & Bibel und Familienfeiern setzt die Kirche lebendige Akzente im Dorf- und Kulturleben.',
  extendedDescription_nl: 'Gelegen op meer dan 780 meter hoogte is de pelgrimskerk St. Erasmus in Altastenberg een bijzonder spiritueel en cultureel herkenningspunt in het Sauerland. Met pelgrimsvieringen, bezinningsavonden en de evenementenreeks Cultuur & Talk biedt de kerk een warm welkom aan wandelaars, inwoners en bezoekers.',
  address: 'Am Dorfgarten 6, 59955 Winterberg-Altastenberg',
  district: 'Altastenberg',
  coordinates: { lat: 51.1895, lng: 8.4682 },
  website: 'https://www.pvwinterberg.de',
  imageFallback: 'PA',
  uploadedImage: '/events-pilgerkirche-altastenberg.jpg',
  headerImage: '/events-pilgerkirche-altastenberg.jpg',
  isPremium: false,
  isActive: true,
  status: 'approved',
  events: pilgerkircheEvents
};

// 2. Winterdorf Würfelspiel event
const winterdorfWuerfelEvent = {
  id: 'winterdorf-wuerfelspiel-spielenachmittag-2026',
  title: 'Spielenachmittag: Das neue Winterdorf-Würfelspiel',
  title_nl: 'Spellenmiddag: Het nieuwe Winterdorf-dobbelspel',
  startDate: '2026-12-12',
  endDate: '2026-12-12',
  startTime: '16:30',
  endTime: '',
  price: 'Teilnahme kostenlos (Anmeldung erforderlich)',
  category: 'Fest & Party',
  location: 'Grevensteiner-Alm im Winterberger Winterdorf, Marktplatz Untere Pforte, 59955 Winterberg',
  coordinates: { lat: 51.1950, lng: 8.5330 },
  imageUrl: '/events-winterdorf-wuerfelspiel.jpg',
  description: 'Großer Spielenachmittag anlässlich des 10-jährigen Jubiläums des Winterberger Winterdorfs! 🎲\n\nAm Samstag, 12. Dezember um 16:30 Uhr lädt das Winterdorf herzlich zu einem besonderen Würfel-Event in die gemütliche Grevensteiner-Alm ein.\n\nStellt Euch Eurem Glück und Eurem Würfelgeschick beim Spielen unseres neuen Winterdorf-Würfelspiels. Die Teilnahme ist kostenlos!\n\nIhr seid mindestens 3 Personen? Dann meldet Euch an! Wir reservieren Euch einen Tisch in unserer Alm und stellen Euch das Spiel zur Verfügung.\n\nAn insgesamt 8 Spieltischen werden die Gewinner ermittelt, die anschließend am großen Finaltisch gegeneinander antreten. Natürlich warten auch tolle Preise auf Euch!',
  description_nl: 'Grote spellenmiddag ter gelegenheid van het 10-jarig jubileum van het Winterberger Winterdorf! 🎲\n\nOp zaterdag 12 december om 16:30 uur nodigt het Winterdorf u van harte uit voor een bijzonder dobbel-event in de Grevensteiner-Alm.\n\nTest uw geluk en dobbelkunsten met het gloednieuwe Winterdorf-dobbelspel. Deelname is gratis!\n\nBent u met minimaal 3 personen? Meld u dan aan! We reserveren een tafel in de Alm en stellen het spel beschikbaar. Aan 8 speeltafels worden de winnaars bepaald, die daarna aan de grote finaletafel strijden om mooie prijzen!',
  externalUrl: 'https://www.instagram.com/winterberger_winterdorf/',
  slug: 'winterdorf-wuerfelspiel-spielenachmittag-2026',
  slug_nl: 'winterdorf-dobbelspel-spellenmiddag-2026'
};

// 3. RitmuS Fado events
const ritmusFadoEvents = [
  {
    id: 'fado-abend-alfredo-baladeiro-ritmus-2026',
    title: 'Fado-Abend mit Alfredo Baladeiro – Portugiesische Musik & Tapas',
    title_nl: 'Fado-avond met Alfredo Baladeiro – Portugese muziek & tapas',
    startDate: '2026-12-04',
    endDate: '2026-12-04',
    startTime: '18:00',
    endTime: '',
    category: 'Konzert',
    location: 'Tapas Weinland / RitmuS, Kolpingstraße 12, 59955 Winterberg-Siedlinghausen',
    coordinates: { lat: 51.2505, lng: 8.4901 },
    price: 'Tischreservierung empfohlen',
    imageUrl: '/events-ritmus-fado-siedlinghausen.jpg',
    externalUrl: 'https://ritmus.de',
    organizer: 'RitmuS - Restaurant & Tapas Bar',
    description: 'Zwei Abende mit Fado – Portugiesische Musik. Emotionen, die verbinden.\n\nAm Freitag, den 04. Dezember lädt das RitmuS / Tapas Weinland in Siedlinghausen zu einem stimmungsvollen Fado-Abend mit dem renommierten Fadista Alfredo Baladeiro ein.\n\n„Fado ist mehr als nur Musik... Es ist Gefühl.“\n\nErleben Sie authentische portugiesische Gitarrenklänge, tief berührenden Fado-Gesang und dazu feinste Tapas und erlesene Weine. Gutes Essen, gute Weine, besondere Momente!\n\nAufgrund begrenzter Plätze wird um rechtzeitige Tischreservierung gebeten (Tel. 02983 1339 oder per Mail an info@ritmus.de).',
    description_nl: 'Twee avonden met Fado – Portugese muziek en emotie.\n\nOp vrijdag 4 december presenteert RitmuS / Tapas Weinland in Siedlinghausen een sfeervolle Fado-avond met de bekende fadista Alfredo Baladeiro.\n\n„Fado is meer dan alleen muziek... Het is gevoel.“\n\nGeniet van authentieke Portugese klanken, heerlijke tapas en fijne wijnen. Gezien de grote belangstelling wordt tijdige tafelreservering aangeraden (+49 2983 1339).',
    slug: 'fado-abend-alfredo-baladeiro-ritmus-2026',
    slug_nl: 'fado-avond-alfredo-baladeiro-ritmus-2026'
  },
  {
    id: 'fado-abend-susana-pais-ritmus-2026',
    title: 'Fado-Abend mit Sängerin Susana Pais – Restaurant RitmuS',
    title_nl: 'Fado-avond met zangeres Susana Pais – Restaurant RitmuS',
    startDate: '2026-12-05',
    endDate: '2026-12-05',
    startTime: '18:00',
    endTime: '',
    category: 'Konzert',
    location: 'Restaurant RitmuS, Kolpingstraße 12, 59955 Winterberg-Siedlinghausen',
    coordinates: { lat: 51.2505, lng: 8.4901 },
    price: 'Tischreservierung empfohlen',
    imageUrl: '/events-ritmus-fado-siedlinghausen.jpg',
    externalUrl: 'https://ritmus.de',
    organizer: 'RitmuS - Restaurant & Tapas Bar',
    description: 'Zwei Abende mit Fado – Portugiesische Musik. Emotionen, die verbinden.\n\nAm Samstag, den 05. Dezember lädt das Restaurant RitmuS in Siedlinghausen zum zweiten Fado-Abend mit der herausragenden portugiesischen Sängerin Susana Pais ein.\n\n„Fado ist mehr als nur Musik... Es ist Gefühl.“\n\nLassen Sie sich von ihrer kraftvollen, ausdrucksstarken Stimme und den emotionalen Fado-Melodien mitreißen. Dazu serviert die RitmuS-Küche spanisch-portugiesische Tapas-Variationen und edle Weine.\n\nRechtzeitige Tischreservierung empfohlen unter Tel. 02983 1339 oder info@ritmus.de.',
    description_nl: 'Twee avonden met Fado – Portugese muziek en emotie.\n\nOp zaterdag 5 december presenteert Restaurant RitmuS in Siedlinghausen een magische avond met de Portugese fadozangeres Susana Pais.\n\n„Fado is meer dan alleen muziek... Het is gevoel.“\n\nLaat u meevoeren door haar prachtige stem, vergezeld van Spaanse en Portugese tapas en geselecteerde wijnen.\n\nTafelreservering via +49 2983 1339 of info@ritmus.de.',
    slug: 'fado-abend-susana-pais-ritmus-2026',
    slug_nl: 'fado-avond-susana-pais-ritmus-2026'
  }
];

// 4. Gymnasium Tag der offenen Tür event
const gsgTagDerOffenenTuer = {
  id: 'tag-der-offenen-tuer-gymnasium-winterberg-2026',
  title: 'Tag der offenen Tür – Geschwister-Scholl-Gymnasium Winterberg',
  title_nl: 'Open dag – Geschwister-Scholl-Gymnasium Winterberg',
  startDate: '2026-11-21',
  endDate: '2026-11-21',
  startTime: '09:00',
  endTime: '15:00',
  category: 'Familie & Kinder',
  location: 'Geschwister-Scholl-Gymnasium, Ursulinenstraße 24, 59955 Winterberg',
  coordinates: { lat: 51.1969, lng: 8.5284 },
  price: 'Kostenlos',
  imageUrl: '/events-tag-der-offenen-tuer-gymnasium-winterberg.jpg',
  externalUrl: 'https://www.gymnasium-winterberg.de',
  organizer: 'Geschwister-Scholl-Gymnasium Winterberg',
  description: '„Gemeinsam Schule Gestalten“ – das ist das Leitbild und der gelebte Schulalltag am Geschwister-Scholl-Gymnasium in Winterberg.\n\nAm Samstag, den 21. November 2026 von 09:00 bis 15:00 Uhr öffnet das Gymnasium an der Ursulinenstraße 24 seine Türen für interessierte Viertklässler, angehende Oberstufenschüler, Eltern und Freunde der Schule.\n\nDas Programm am Tag der offenen Tür:\n- Schulführungen durch das moderne Schulgebäude\n- Probeunterricht & spannende Mitmachangebote\n- Umfassende Beratung & persönlicher Austausch mit Lehrkräften und Schulleitung\n- Vorweihnachtlicher Schulweihnachtsmarkt\n\nDas macht das GSG Winterberg aus:\n- Eliteschule des Sports / NRW Sportschule\n- Schule ohne Rassismus – Schule mit Courage\n- Theater & Musik\n- Starke Schulgemeinschaft & Zusammenhalt\n\nEine Voranmeldung vorab ist bequem über den QR-Code auf der Schulhomepage (www.gymnasium-winterberg.de) möglich. Wir freuen uns auf Ihren Besuch!',
  description_nl: '„Samen school maken“ – Open dag bij het Geschwister-Scholl-Gymnasium in Winterberg!\n\nOp zaterdag 21 november 2026 van 09:00 tot 15:00 uur verwelkomt het gymnasium aankomende brugklassers, ouders en geïnteresseerden aan de Ursulinenstraße 24.\n\nWat staat er op het programma:\n- Rondleidingen door het schoolgebouw\n- Proeflessen en interactieve workshops\n- Persoonlijk advies en voorlichting over het onderwijsaanbod\n- Gezellige kerstmarkt van de school\n\nBijzonderheden van het GSG Winterberg:\n- Topsportschool / NRW Sportschule (o.a. wintersportfocus)\n- School zonder Racisme – School met Moed\n- Theater & Muziek\n- Hechte schoolgemeenschap\n\nVooraf aanmelden is mogelijk via de website www.gymnasium-winterberg.de. Welkom!',
  slug: 'tag-der-offenen-tuer-gymnasium-winterberg-2026',
  slug_nl: 'open-dag-gymnasium-winterberg-2026'
};

async function main() {
  console.log('--- Step 1: Updating src/data.ts ---');
  let dataContent = fs.readFileSync('src/data.ts', 'utf8');

  // 1A. Append winterdorfWuerfelEvent to winterberger-winterdorf
  const silvesterEventStr = "id: 'winterdorf-silvesterparty-2026-2027'";
  const silvesterIdx = dataContent.indexOf(silvesterEventStr);
  if (silvesterIdx === -1) {
    throw new Error('Could not find winterdorf-silvesterparty-2026-2027 in src/data.ts');
  }
  // Find closing bracket of silvester event
  const closeBraceIdx = dataContent.indexOf('      }', silvesterIdx);
  if (dataContent.includes(winterdorfWuerfelEvent.id)) {
    console.log('Winterdorf Würfelspiel event already in src/data.ts');
  } else {
    const formattedWinterdorfEvent = `,\n      ` + JSON.stringify(winterdorfWuerfelEvent, null, 8).trim();
    dataContent = dataContent.substring(0, closeBraceIdx + 7) + formattedWinterdorfEvent + dataContent.substring(closeBraceIdx + 7);
    console.log('Added Winterdorf Würfelspiel event to src/data.ts');
  }

  // 1B. Add events to ritmus-restaurant
  const ritmusIdx = dataContent.indexOf("id: 'ritmus-restaurant'");
  if (ritmusIdx === -1) {
    throw new Error('Could not find ritmus-restaurant in src/data.ts');
  }
  if (dataContent.includes('fado-abend-alfredo-baladeiro-ritmus-2026')) {
    console.log('Ritmus events already in src/data.ts');
  } else {
    const ritmusEndIdx = dataContent.indexOf('status: \'approved\'', ritmusIdx);
    const ritmusReplacement = `status: 'approved',\n    phone: '02983 1339',\n    uploadedImage: '/events-ritmus-fado-siedlinghausen.jpg',\n    headerImage: '/events-ritmus-fado-siedlinghausen.jpg',\n    events: ` + JSON.stringify(ritmusFadoEvents, null, 6);
    dataContent = dataContent.substring(0, ritmusEndIdx) + ritmusReplacement + dataContent.substring(ritmusEndIdx + 'status: \'approved\''.length);
    console.log('Added Fado events to ritmus-restaurant in src/data.ts');
  }

  // 1C. Add events to geschwister-scholl-gymnasium-winterberg
  const gsgIdx = dataContent.indexOf('"id": "geschwister-scholl-gymnasium-winterberg"');
  if (gsgIdx === -1) {
    throw new Error('Could not find geschwister-scholl-gymnasium-winterberg in src/data.ts');
  }
  if (dataContent.includes('tag-der-offenen-tuer-gymnasium-winterberg-2026')) {
    console.log('GSG Tag der offenen Tür already in src/data.ts');
  } else {
    const gsgHoursIdx = dataContent.indexOf('"openingHours": {', gsgIdx);
    const gsgHoursEndIdx = dataContent.indexOf('      }', gsgHoursIdx);
    const formattedGsgEvent = `,\n      "uploadedImage": "/events-tag-der-offenen-tuer-gymnasium-winterberg.jpg",\n      "events": ` + JSON.stringify([gsgTagDerOffenenTuer], null, 8);
    dataContent = dataContent.substring(0, gsgHoursEndIdx + 7) + formattedGsgEvent + dataContent.substring(gsgHoursEndIdx + 7);
    console.log('Added Tag der offenen Tür to geschwister-scholl-gymnasium-winterberg in src/data.ts');
  }

  // 1D. Add pilgerkirche-altastenberg
  if (dataContent.includes("id: 'pilgerkirche-altastenberg'")) {
    console.log('Pilgerkirche Altastenberg already in src/data.ts');
  } else {
    const hotelAltastenbergIdx = dataContent.indexOf("id: 'hotel-altastenberg'");
    if (hotelAltastenbergIdx === -1) {
      throw new Error('Could not find hotel-altastenberg in src/data.ts');
    }
    const insertPoint = dataContent.lastIndexOf('  {', hotelAltastenbergIdx);
    const formattedPilgerkirche = `  ` + JSON.stringify(pilgerkircheBusiness, null, 4).replace(/"([^"]+)":/g, '$1:') + `,\n`;
    dataContent = dataContent.substring(0, insertPoint) + formattedPilgerkirche + dataContent.substring(insertPoint);
    console.log('Added pilgerkirche-altastenberg to src/data.ts');
  }

  fs.writeFileSync('src/data.ts', dataContent, 'utf8');
  console.log('Successfully written src/data.ts');

  // --- Step 2: Sync to Firestore ---
  console.log('\n--- Step 2: Updating Firestore documents ---');

  // 2A. Update winterberger-winterdorf in Firestore
  const winterdorfRef = doc(db, 'businesses', 'winterberger-winterdorf');
  const winterdorfSnap = await getDoc(winterdorfRef);
  let existingWinterdorfEvents = [];
  if (winterdorfSnap.exists()) {
    existingWinterdorfEvents = winterdorfSnap.data().events || [];
  }
  const mergedWinterdorfEvents = [...existingWinterdorfEvents.filter(e => e.id !== winterdorfWuerfelEvent.id), winterdorfWuerfelEvent];
  await setDoc(winterdorfRef, {
    events: mergedWinterdorfEvents,
    updatedAt: new Date().toISOString()
  }, { merge: true });
  console.log('Updated Firestore: businesses/winterberger-winterdorf (' + mergedWinterdorfEvents.length + ' events)');

  // 2B. Update ritmus-restaurant in Firestore
  const ritmusRef = doc(db, 'businesses', 'ritmus-restaurant');
  const ritmusSnap = await getDoc(ritmusRef);
  let existingRitmusEvents = [];
  if (ritmusSnap.exists()) {
    existingRitmusEvents = ritmusSnap.data().events || [];
  }
  const mergedRitmusEvents = [
    ...existingRitmusEvents.filter(e => !ritmusFadoEvents.some(ne => ne.id === e.id)),
    ...ritmusFadoEvents
  ];
  await setDoc(ritmusRef, {
    name: 'RitmuS - Restaurant & Tapas Bar',
    phone: '02983 1339',
    uploadedImage: '/events-ritmus-fado-siedlinghausen.jpg',
    events: mergedRitmusEvents,
    updatedAt: new Date().toISOString()
  }, { merge: true });
  console.log('Updated Firestore: businesses/ritmus-restaurant (' + mergedRitmusEvents.length + ' events)');

  // 2C. Update geschwister-scholl-gymnasium-winterberg in Firestore
  const gsgRef = doc(db, 'businesses', 'geschwister-scholl-gymnasium-winterberg');
  const gsgSnap = await getDoc(gsgRef);
  let existingGsgEvents = [];
  if (gsgSnap.exists()) {
    existingGsgEvents = gsgSnap.data().events || [];
  }
  const mergedGsgEvents = [
    ...existingGsgEvents.filter(e => e.id !== gsgTagDerOffenenTuer.id),
    gsgTagDerOffenenTuer
  ];
  await setDoc(gsgRef, {
    events: mergedGsgEvents,
    uploadedImage: '/events-tag-der-offenen-tuer-gymnasium-winterberg.jpg',
    updatedAt: new Date().toISOString()
  }, { merge: true });
  console.log('Updated Firestore: businesses/geschwister-scholl-gymnasium-winterberg (' + mergedGsgEvents.length + ' events)');

  // 2D. Create/Update pilgerkirche-altastenberg in Firestore
  const pilgerRef = doc(db, 'businesses', 'pilgerkirche-altastenberg');
  await setDoc(pilgerRef, {
    ...pilgerkircheBusiness,
    updatedAt: new Date().toISOString()
  }, { merge: true });
  console.log('Updated Firestore: businesses/pilgerkirche-altastenberg (' + pilgerkircheEvents.length + ' events)');

  // 2E. Bump remote businesses version in Firestore
  const newVersion = Date.now();
  await setDoc(doc(db, 'system', 'metadata'), {
    businessesUpdatedAt: newVersion
  }, { merge: true });
  console.log('Bumped system/metadata businessesUpdatedAt to ' + newVersion);

  console.log('\nAll 12 new events successfully synced to local data and Firestore!');
  process.exit(0);
}

main().catch(err => {
  console.error('Error syncing new events:', err);
  process.exit(1);
});
