import fs from 'fs';
import path from 'path';

// Read src/data.ts to extract all categories and subcategories
const dataContent = fs.readFileSync('src/data.ts', 'utf8');
const catGroupMatch = dataContent.match(/export const categories: CategoryGroup\[\] = \[([\s\S]*?)\];/);
if (!catGroupMatch) {
  console.error('Could not find categories in src/data.ts');
  process.exit(1);
}

const lines = catGroupMatch[1].split('\n').filter(l => l.includes('name:'));
const allExpectedCategories = [];
for (const line of lines) {
  const nameMatch = line.match(/name:\s*'([^']+)'/);
  const subsMatch = line.match(/subcategories:\s*\[([^\]]+)\]/);
  if (nameMatch) {
    allExpectedCategories.push({ name: nameMatch[1], isMain: true });
    if (subsMatch) {
      const subs = subsMatch[1].split(',').map(s => s.trim().replace(/^'|'$/g, ''));
      for (const s of subs) {
        allExpectedCategories.push({ name: s, isMain: false, parent: nameMatch[1] });
      }
    }
  }
}

console.log(`Total categories & subcategories defined in src/data.ts: ${allExpectedCategories.length}`);

// Read src/utils/categoryHeaders.ts
const headersContent = fs.readFileSync('src/utils/categoryHeaders.ts', 'utf8');

let missingCount = 0;
let fileMissingCount = 0;
let aiFlagCount = 0;
let missingCreditCount = 0;

for (const item of allExpectedCategories) {
  // Check if item.name exists as a key in CATEGORY_HEADERS
  const escapedName = item.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const keyRegex = new RegExp(`['"]${escapedName}['"]\\s*:`, 'm');
  if (!keyRegex.test(headersContent)) {
    console.warn(`[MISSING IN HEADERS] "${item.name}" (Main: ${item.isMain}, Parent: ${item.parent || 'none'})`);
    missingCount++;
  }
}

// Find all image references in CATEGORY_HEADERS
const imageMatches = [...headersContent.matchAll(/image:\s*['"]\/([^'"]+)['"]/g)];
console.log(`Found ${imageMatches.length} header entries with images in categoryHeaders.ts`);

const uniqueImages = new Set();
for (const m of imageMatches) {
  const fileRel = m[1];
  uniqueImages.add(fileRel);
  const fullPath = path.join('public', fileRel);
  if (!fs.existsSync(fullPath)) {
    console.error(`[FILE NOT FOUND] public/${fileRel}`);
    fileMissingCount++;
  } else {
    const stats = fs.statSync(fullPath);
    if (stats.size < 10000) {
      console.warn(`[FILE TOO SMALL] public/${fileRel} (${stats.size} bytes)`);
    }
  }
}

// Check for isAiGenerated: true
const aiTrueMatches = [...headersContent.matchAll(/isAiGenerated:\s*true/g)];
if (aiTrueMatches.length > 0) {
  console.warn(`Warning: Found ${aiTrueMatches.length} occurrences of isAiGenerated: true`);
  aiFlagCount = aiTrueMatches.length;
}

console.log(`\n=================== VERIFICATION SUMMARY ===================`);
console.log(`Expected Categories in App: ${allExpectedCategories.length}`);
console.log(`Categories Missing from Header Config: ${missingCount}`);
console.log(`Referenced Image Files Missing from public/: ${fileMissingCount}`);
console.log(`Unique Header Images in public/: ${uniqueImages.size}`);
console.log(`AI-Generated Flags Set to True: ${aiFlagCount}`);
console.log(`============================================================\n`);

if (missingCount === 0 && fileMissingCount === 0 && aiFlagCount === 0) {
  console.log('ALL CATEGORIES AND HEADER IMAGES ARE 100% VERIFIED!');
} else {
  console.log('Some items require attention.');
}
