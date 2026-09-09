import { db } from '../src/firebase';
import { collection, getDocs, addDoc, doc, setDoc } from 'firebase/firestore';

export interface RedirectDef {
  source: string;
  target: string;
  note: string;
}

export const duplicateRedirects: RedirectDef[] = [
  // 1. Hotel Schneider
  {
    source: '/hotels-und-unterkuenfte/hotels/hotel-schneider',
    target: '/hotels-und-unterkuenfte/hotels/hotel-schneider-winterberg',
    note: 'Duplikat Hotel Schneider (DE)'
  },
  {
    source: '/nl/hotels-en-accommodaties/hotels/hotel-schneider',
    target: '/nl/hotels-en-accommodaties/hotels/hotel-schneider-winterberg',
    note: 'Duplikat Hotel Schneider (NL)'
  },
  {
    source: '/hotel-schneider',
    target: '/hotels-und-unterkuenfte/hotels/hotel-schneider-winterberg',
    note: 'Kurz-URL Hotel Schneider'
  },

  // 2. Die Sperre
  {
    source: '/gastronomie/restaurants/die-sperre',
    target: '/gastronomie/restaurants/die-sperre-landhotel-restaurant',
    note: 'Duplikat Die Sperre (DE)'
  },
  {
    source: '/nl/gastronomie/restaurants/die-sperre',
    target: '/nl/gastronomie/restaurants/die-sperre-landhotel-restaurant',
    note: 'Duplikat Die Sperre (NL)'
  },

  // 3. Kiemen Elektroinstallation
  {
    source: '/handwerk/elektriker/hermann-josef-kiemen',
    target: '/handwerk/elektriker/kiemen-hermann-j-elektroinstallation',
    note: 'Duplikat Kiemen Elektro (DE)'
  },
  {
    source: '/nl/ambacht-en-bouw/elektriciens/hermann-josef-kiemen',
    target: '/nl/ambacht-en-bouw/elektriciens/kiemen-hermann-j-elektroinstallation',
    note: 'Duplikat Kiemen Elektro (NL)'
  },

  // 4. Der Brabander
  {
    source: '/hotels-und-unterkuenfte/hotels/der-brabander',
    target: '/hotels-und-unterkuenfte/hotels/vakantiehotel-der-brabander',
    note: 'Duplikat Der Brabander Hotel (DE)'
  },
  {
    source: '/nl/hotels-en-accommodaties/hotels/der-brabander',
    target: '/nl/hotels-en-accommodaties/hotels/vakantiehotel-der-brabander',
    note: 'Duplikat Der Brabander Hotel (NL)'
  },
  {
    source: '/der-brabander',
    target: '/hotels-und-unterkuenfte/hotels/vakantiehotel-der-brabander',
    note: 'Kurz-URL Der Brabander'
  },

  // 5. Minigolf am Erlebnisberg Kappe
  {
    source: '/freizeit-und-erlebnis/outdoor/abenteuergolf-winterberg-erlebnisberg-kappe',
    target: '/freizeit-und-erlebnis/outdoor/minigolf-am-erlebnisberg-kappe',
    note: 'Duplikat Abenteuergolf Kappe (DE)'
  },
  {
    source: '/nl/vrije-tijd-en-beleving/outdoor/abenteuergolf-winterberg-erlebnisberg-kappe',
    target: '/nl/vrije-tijd-en-beleving/outdoor/minigolf-am-erlebnisberg-kappe',
    note: 'Duplikat Abenteuergolf Kappe (NL)'
  },

  // 6. Modeorth
  {
    source: '/einzelhandel/bekleidung/modeorth-winterberg-gmbh',
    target: '/einzelhandel/bekleidung/modeorth-winterberg',
    note: 'Duplikat Modeorth (DE)'
  },
  {
    source: '/nl/winkelen/kleding/modeorth-winterberg-gmbh',
    target: '/nl/winkelen/kleding/modeorth-winterberg',
    note: 'Duplikat Modeorth (NL)'
  }
];

async function run() {
  console.log('Adding 301 redirects to Firestore collection "redirects"...');
  const snap = await getDocs(collection(db, 'redirects'));
  const existingSources = new Set<string>();
  snap.forEach(d => existingSources.add(d.data().source));

  let added = 0;
  for (const r of duplicateRedirects) {
    if (!existingSources.has(r.source)) {
      await addDoc(collection(db, 'redirects'), {
        source: r.source,
        target: r.target,
        note: r.note,
        type: '301 Permanent',
        createdAt: new Date().toISOString()
      });
      console.log(`Added redirect: ${r.source} -> ${r.target} (${r.note})`);
      added++;
    } else {
      console.log(`Already exists: ${r.source}`);
    }
  }

  console.log(`Finished. Added ${added} new redirects to Firestore.`);
}

run().catch(console.error);
