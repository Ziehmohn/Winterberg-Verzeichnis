import fs from 'fs';

let content = fs.readFileSync('src/data.ts', 'utf8');

const CATEGORIES: Record<string, string> = {
  'Handwerk': 'craft',
  'Einzelhandel': 'retail',
  'Gastronomie': 'restaurant',
  'Dienstleistungen': 'service',
  'Freizeit und Tourismus': 'tourism',
  'Hotels und Unterkünfte': 'hotel'
};

const SUBCATEGORIES: Record<string, string> = {
  'KFZ-Werkstätten': 'car,repair',
  'Schreinereien': 'woodworking',
  'Wäschereien': 'laundry',
  'Dachdecker': 'roofing',
  'Elektriker': 'electrician',
  'Supermarkt': 'supermarket',
  'Kleidung': 'clothing',
  'Bürobedarf': 'office,supplies',
  'Restaurant': 'restaurant',
  'Steuerberater': 'accounting,office',
  'Marketingdienstleistungen': 'marketing',
  'Finanzberatung': 'finance',
  'Banken': 'bank',
  'Rechtsanwälte': 'lawyer',
  'Indoor-Spielplätze': 'playground,indoor',
  'Tennisplätze': 'tennis',
  'Fußballvereine': 'soccer',
  'Schwimmbäder': 'swimming,pool',
  'Outdoor-Freizeitgebiet': 'outdoor,park'
};

const blocks = content.split(/(\{\s*id:\s*'[A-Za-z0-9_]+',)/g);
for (let i = 1; i < blocks.length; i += 2) {
  let block = blocks[i] + blocks[i+1];
  
  const subCatMatch = block.match(/subcategory:\s*'([^']+)'/);
  const catMatch = block.match(/category:\s*'([^']+)'/);
  const nameMatch = block.match(/name:\s*'([^']+)'/);
  
  let key = subCatMatch ? subCatMatch[1] : (catMatch ? catMatch[1] : null);
  let name = nameMatch ? nameMatch[1] : '';
  if (!key) continue;

  let keyword = '';
  if (subCatMatch && SUBCATEGORIES[subCatMatch[1]]) {
    keyword = SUBCATEGORIES[subCatMatch[1]];
  } else if (catMatch && CATEGORIES[catMatch[1]]) {
    keyword = CATEGORIES[catMatch[1]];
  } else {
    keyword = 'business';
  }

  // Text-based overrides
  if (name.includes('Kletter')) keyword = 'climbing';
  if (name.includes('Bike')) keyword = 'bicycle';
  if (name.includes('Golf') || name.includes('golf')) keyword = 'golf';
  if (name.includes('Lasertag') || name.includes('Holocafé')) keyword = 'arcade,neon';
  if (name.includes('Rodelbahn')) keyword = 'sledding';
  if (name.includes('Brücke')) keyword = 'bridge';
  if (name.includes('SEO')) keyword = 'seo,marketing';
  if (name.includes('Asten')) keyword = 'mountain,resort';

  let imgUrl = `https://loremflickr.com/800/600/${keyword}?lock=2`;

  // completely wipe existing imageUrl to recreate
  block = block.replace(/,\s*imageUrl:\s*'[^']+'/g, '');
  block = block.replace(/\s*imageUrl:\s*'[^']+',/g, '');
  block = block.replace(/\s*imageUrl:\s*'[^']+'/g, '');

  if (block.includes('imageFallback:')) {
    block = block.replace(/(imageFallback:\s*(?:'[^']*'|"[^"]*"))\s*,?(\s*\n)/g, `$1,\n    imageUrl: '${imgUrl}'$2`);
  } else {
    block = block.replace(/(address:\s*(?:'[^']*'|"[^"]*"))\s*,?(\s*\n)/g, `$1,\n    imageUrl: '${imgUrl}'$2`);
  }

  blocks[i] = block.substring(0, blocks[i].length);
  blocks[i+1] = block.substring(blocks[i].length);
}

fs.writeFileSync('src/data.ts', blocks.join(''));
console.log('Update Complete 8');
