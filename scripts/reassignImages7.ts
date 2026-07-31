import fs from 'fs';

let content = fs.readFileSync('src/data.ts', 'utf8');

const IMAGES: Record<string, string> = {
  'KFZ-Werkstätten': 'https://images.unsplash.com/photo-1503376713356-f5b248a39a73?auto=format&fit=crop&w=800&q=80',
  'Schreinereien': 'https://images.unsplash.com/photo-1505503043224-b1eb2ded0a74?auto=format&fit=crop&w=800&q=80',
  'Wäschereien': 'https://images.unsplash.com/photo-1582734651336-0c91bbff1bb1?auto=format&fit=crop&w=800&q=80',
  'Dachdecker': 'https://images.unsplash.com/photo-1632731557007-8022b79313ce?auto=format&fit=crop&w=800&q=80',
  'Elektriker': 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=800&q=80',
  'Supermarkt': 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=800&q=80',
  'Kleidung': 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80',
  'Bürobedarf': 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80',
  'Restaurant': 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=800&q=80',
  'Steuerberater': 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=800&q=80',
  'Marketingdienstleistungen': 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
  'Finanzberatung': 'https://images.unsplash.com/photo-1616803140344-6682afb13cda?auto=format&fit=crop&w=800&q=80',
  'Banken': 'https://images.unsplash.com/photo-1501167786227-4cba60f6d58f?auto=format&fit=crop&w=800&q=80',
  'Rechtsanwälte': 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=800&q=80',
  'Indoor-Spielplätze': 'https://images.unsplash.com/photo-1580221363297-f58c7e6cba3b?auto=format&fit=crop&w=800&q=80',
  'Tennisplätze': 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&w=800&q=80',
  'Fußballvereine': 'https://images.unsplash.com/photo-1518605368461-1ee7c66dcde8?auto=format&fit=crop&w=800&q=80',
  'Schwimmbäder': 'https://images.unsplash.com/photo-1519315901367-f34f9b98a77b?auto=format&fit=crop&w=800&q=80',
  'Outdoor-Freizeitgebiet': 'https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&w=800&q=80',
};

const CATEGORIES: Record<string, string> = {
  'Handwerk': 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&w=800&q=80',
  'Einzelhandel': 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80',
  'Gastronomie': 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=800&q=80',
  'Dienstleistungen': 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80',
  'Freizeit und Tourismus': 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=800&q=80',
  'Hotels und Unterkünfte': 'https://images.unsplash.com/photo-1566073874656-9e414167e85c?auto=format&fit=crop&w=800&q=80'
};

content = content.replace(/(imageFallback:\s*(?:'[^']*'|"[^"]*"))\s*,?\s*\n\s*imageUrl:\s*'[^']+',?/g, "$1,");

const blocks = content.split(/(\{\s*id:\s*'[A-Za-z0-9_]+',)/g);
for (let i = 1; i < blocks.length; i += 2) {
  let block = blocks[i] + blocks[i+1];
  
  const subCatMatch = block.match(/subcategory:\s*'([^']+)'/);
  const catMatch = block.match(/category:\s*'([^']+)'/);
  const nameMatch = block.match(/name:\s*'([^']+)'/);
  
  let key = subCatMatch ? subCatMatch[1] : (catMatch ? catMatch[1] : null);
  let name = nameMatch ? nameMatch[1] : '';
  if (!key) continue;

  let imgUrl = IMAGES[key];

  if (!imgUrl && catMatch) {
    imgUrl = CATEGORIES[catMatch[1]];
  }
  
  if (!imgUrl) {
    imgUrl = 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=800&q=80';
  }

  // Text-based overrides for specific businesses without matching subcategories
  if (name.includes('Kletter')) imgUrl = 'https://images.unsplash.com/photo-1534064375620-3fc7ff7a88fb?auto=format&fit=crop&w=800&q=80';
  if (name.includes('Bike')) imgUrl = 'https://images.unsplash.com/photo-1544181093-c712fb401bb6?auto=format&fit=crop&w=800&q=80';
  if (name.includes('Golf') || name.includes('golf')) imgUrl = 'https://images.unsplash.com/photo-1512411082502-3dc0e21bc9e9?auto=format&fit=crop&w=800&q=80';
  if (name.includes('Lasertag') || name.includes('Holocafé')) imgUrl = 'https://images.unsplash.com/photo-1538370965046-79c0d6907d47?auto=format&fit=crop&w=800&q=80';
  if (name.includes('Rodelbahn')) imgUrl = 'https://images.unsplash.com/photo-1550050849-c188dcab96be?auto=format&fit=crop&w=800&q=80';
  if (name.includes('Brücke')) imgUrl = 'https://images.unsplash.com/photo-1513689405073-6323de047b74?auto=format&fit=crop&w=800&q=80';
  if (name.includes('SEO')) imgUrl = IMAGES['Marketingdienstleistungen'];

  // Append new imageUrl correctly
  if (block.includes('imageFallback:')) {
    block = block.replace(/(imageFallback:\s*(?:'[^']*'|"[^"]*"))\s*,?(\s*\n)/g, `$1,\n    imageUrl: '${imgUrl}'$2`);
  } else {
    block = block.replace(/(address:\s*(?:'[^']*'|"[^"]*"))\s*,?(\s*\n)/g, `$1,\n    imageUrl: '${imgUrl}'$2`);
  }

  blocks[i] = block.substring(0, blocks[i].length);
  blocks[i+1] = block.substring(blocks[i].length);
}

fs.writeFileSync('src/data.ts', blocks.join(''));
console.log('Update Complete 7');
