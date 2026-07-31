import fs from 'fs';

const images: Record<string, string> = {
  'KFZ-Werkstätten': 'https://images.unsplash.com/photo-1542282088-fe8426682b8f?w=600&q=80',
  'Schreinereien': 'https://images.unsplash.com/photo-1622359146200-84511d51aeb1?w=600&q=80',
  'Wäschereien': 'https://images.unsplash.com/photo-1545041926-72ed6210f760?w=600&q=80',
  'Dachdecker': 'https://images.unsplash.com/photo-1513628253939-010e64ac66cd?w=600&q=80',
  'Elektriker': 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&q=80',
  'Supermarkt': 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=600&q=80',
  'Kleidung': 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=600&q=80',
  'Bürobedarf': 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=600&q=80',
  'Restaurant': 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80',
  'Gastronomie': 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80',
  'Steuerberater': 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&q=80',
  'Marketingdienstleistungen': 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80',
  'Finanzberatung': 'https://images.unsplash.com/photo-1616803140344-6682afb13cda?w=600&q=80',
  'Banken': 'https://images.unsplash.com/photo-1616803140344-6682afb13cda?w=600&q=80',
  'Rechtsanwälte': 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=600&q=80',
  'Indoor-Spielplätze': 'https://images.unsplash.com/photo-1515024505315-0d0263f350b9?w=600&q=80',
  'Tennisplätze': 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=600&q=80',
  'Fußballvereine': 'https://images.unsplash.com/photo-1518605368461-1ee7c66dcde8?w=600&q=80',
  'Schwimmbäder': 'https://images.unsplash.com/photo-1519315901367-f34f9b98a77b?w=600&q=80',
  'Outdoor-Freizeitgebiet': 'https://images.unsplash.com/photo-1501555088652-021faa106b9b?w=600&q=80',
  'Hotels und Unterkünfte': 'https://images.unsplash.com/photo-1566073874656-9e414167e85c?w=600&q=80',
  'Laser Tag / Indoor Gaming': 'https://images.unsplash.com/photo-1553481187-be93c21490a9?w=600&q=80',
  'Mountainbiking': 'https://images.unsplash.com/photo-1544181093-c712fb401bb6?w=600&q=80',
  'Minigolf': 'https://images.unsplash.com/photo-1512411082502-3dc0e21bc9e9?w=600&q=80', 
  'Seilbahnen': 'https://images.unsplash.com/photo-1588636186835-df460b1e4fa7?w=600&q=80'
};

let content = fs.readFileSync('src/data.ts', 'utf8');

const blocks = content.split(/(\{\s*id:\s*'[0-9]+',)/g);
for (let i = 1; i < blocks.length; i += 2) {
  let block = blocks[i] + blocks[i+1];
  
  const subCatMatch = block.match(/subcategory:\s*'([^']+)'/);
  const catMatch = block.match(/category:\s*'([^']+)'/);
  
  let key = subCatMatch ? subCatMatch[1] : (catMatch ? catMatch[1] : null);
  if (!key) continue;

  let imgUrl = images[key] || images['Gastronomie'] || 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=600&q=80';
  
  if (key === 'Dienstleistungen') imgUrl = images['Steuerberater'];
  if (key === 'Handwerk') imgUrl = images['Schreinereien'];
  if (key === 'Einzelhandel') imgUrl = 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=600&q=80';
  if (key === 'Freizeit und Tourismus') imgUrl = images['Outdoor-Freizeitgebiet'];
  if (block.includes("'SEO'")) imgUrl = images['Marketingdienstleistungen'];

  if (block.includes('imageUrl:')) {
    block = block.replace(/imageUrl:\s*'[^']+'/, `imageUrl: '${imgUrl}'`);
  } else {
    if (block.includes('imageFallback:')) {
      block = block.replace(/(imageFallback:\s*'(.*?)')(\s*\n)/g, `$1,\n    imageUrl: '${imgUrl}'$3`);
    } else {
        block = block.replace(/(address:\s*'(.*?)')(\s*\n)/g, `$1,\n    imageUrl: '${imgUrl}'$3`);
    }
  }

  blocks[i] = block.substring(0, blocks[i].length);
  blocks[i+1] = block.substring(blocks[i].length);
}

fs.writeFileSync('src/data.ts', blocks.join(''));
console.log('Update Complete');
