import fs from 'fs';

let content = fs.readFileSync('src/data.ts', 'utf8');

const images: Record<string, string> = {
  'KFZ-Werkstätten': 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=800&q=80',
  'Outdoor-Freizeitgebiet': 'https://images.unsplash.com/photo-1600150806193-841808605c30?auto=format&fit=crop&w=800&q=80',
  'Schreinereien': 'https://images.unsplash.com/photo-1622359146200-84511d51aeb1?auto=format&fit=crop&w=800&q=80',
  'Wäschereien': 'https://images.unsplash.com/photo-1604335399105-a0c585fd81a1?auto=format&fit=crop&w=800&q=80',
  'Elektriker': 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=800&q=80',
  'Dachdecker': 'https://images.unsplash.com/photo-1549419139-4467dcba9710?auto=format&fit=crop&w=800&q=80',
  'Supermarkt': 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=800&q=80',
  'Tennisplätze': 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&w=800&q=80',
  'Fußballvereine': 'https://images.unsplash.com/photo-1518605368461-1ee7c66dcde8?auto=format&fit=crop&w=800&q=80',
  'Steuerberater': 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=800&q=80',
  'Marketingdienstleistungen': 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
  'Rechtsanwälte': 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=800&q=80',
  'Kleidung': 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=800&q=80',
  'Bürobedarf': 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80',
  'Restaurant': 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=800&q=80',
  'Banken': 'https://images.unsplash.com/photo-1501167786227-4cba60f6d58f?auto=format&fit=crop&w=800&q=80',
  'Indoor-Spielplätze': 'https://images.unsplash.com/photo-1515024505315-0d0263f350b9?auto=format&fit=crop&w=800&q=80',
};

const blocks = content.split(/(\{\s*id:\s*'[A-Za-z0-9_]+',)/g);
for (let i = 1; i < blocks.length; i += 2) {
  let block = blocks[i] + blocks[i+1];
  
  const subCatMatch = block.match(/subcategory:\s*'([^']+)'/);
  const catMatch = block.match(/category:\s*'([^']+)'/);
  
  let key = subCatMatch ? subCatMatch[1] : (catMatch ? catMatch[1] : null);
  if (!key) continue;

  let imgUrl = images[key];

  if (!imgUrl) {
    if (key === 'Dienstleistungen') imgUrl = images['Steuerberater'];
    else if (key === 'Handwerk') imgUrl = images['Schreinereien'];
    else if (key === 'Einzelhandel') imgUrl = images['Kleidung'];
    else if (key === 'Freizeit und Tourismus') imgUrl = images['Outdoor-Freizeitgebiet'];
    else imgUrl = 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=800&q=80';
  }

  // specific overrides based on name
  if (block.includes('Holocafé') || block.includes('Lasertag')) {
    imgUrl = 'https://images.unsplash.com/photo-1538370965046-79c0d6907d47?auto=format&fit=crop&w=800&q=80';
  }

  // remove existing imageUrl if present
  block = block.replace(/,\s*imageUrl:\s*'[^']+'/g, '');

  // append new imageUrl
  if (block.includes('imageFallback:')) {
    block = block.replace(/(imageFallback:\s*'(.*?)')(\s*\n)/g, `$1,\n    imageUrl: '${imgUrl}'$3`);
  } else {
    block = block.replace(/(address:\s*'(.*?)')(\s*\n)/g, `$1,\n    imageUrl: '${imgUrl}'$3`);
  }

  blocks[i] = block.substring(0, blocks[i].length);
  blocks[i+1] = block.substring(blocks[i].length);
}

fs.writeFileSync('src/data.ts', blocks.join(''));
console.log('Update Complete 4');
