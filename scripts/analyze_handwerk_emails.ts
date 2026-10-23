import { businesses } from '../src/data';
import * as fs from 'fs';

interface HandwerkSummary {
  name: string;
  subcategory: string;
  district: string;
  email: string | null;
  phone: string | null;
}

const handwerk = businesses.filter(b => 
  b.category === 'Handwerk' || 
  (b.additionalCategories && b.additionalCategories.some(ac => ac.category === 'Handwerk'))
);

const withEmail: HandwerkSummary[] = [];
const withoutEmail: HandwerkSummary[] = [];

handwerk.forEach(b => {
  const item: HandwerkSummary = {
    name: b.name,
    subcategory: b.subcategory || 'Ohne Unterkategorie',
    district: b.district || 'Winterberg',
    email: b.email ? b.email.trim() : null,
    phone: b.phone ? b.phone.trim() : null,
  };
  if (item.email) {
    withEmail.push(item);
  } else {
    withoutEmail.push(item);
  }
});

console.log(`\n=== HANDWERK BETRIEBE GESAMT: ${handwerk.length} ===`);
console.log(`Mit E-Mail: ${withEmail.length}`);
console.log(`Ohne E-Mail: ${withoutEmail.length}\n`);

// Group by Subcategory
const groupedWithout: Record<string, HandwerkSummary[]> = {};
withoutEmail.forEach(b => {
  if (!groupedWithout[b.subcategory]) groupedWithout[b.subcategory] = [];
  groupedWithout[b.subcategory].push(b);
});

const groupedWith: Record<string, HandwerkSummary[]> = {};
withEmail.forEach(b => {
  if (!groupedWith[b.subcategory]) groupedWith[b.subcategory] = [];
  groupedWith[b.subcategory].push(b);
});

console.log('=== OHNE E-MAIL (Gruppiert nach Gewerk) ===');
Object.keys(groupedWithout).sort().forEach(sub => {
  console.log(`\n--- ${sub} (${groupedWithout[sub].length}) ---`);
  groupedWithout[sub].forEach(b => {
    console.log(`• ${b.name} [${b.district}] - Tel: ${b.phone || 'Keine'}`);
  });
});

console.log('\n=== MIT E-MAIL (Gruppiert nach Gewerk) ===');
Object.keys(groupedWith).sort().forEach(sub => {
  console.log(`\n--- ${sub} (${groupedWith[sub].length}) ---`);
  groupedWith[sub].forEach(b => {
    console.log(`• ${b.name} [${b.district}]: ${b.email}`);
  });
});

// Write json report for convenience
fs.writeFileSync('scripts/handwerk_report.json', JSON.stringify({ withEmail, withoutEmail }, null, 2));
