import fs from 'fs';

const images: Record<string, string> = {
  'KFZ-Werkstätten': 'https://images.unsplash.com/photo-1486495574514-ce525ee8201a?w=600&q=80', // mechanic under car
  'Schreinereien': 'https://images.unsplash.com/photo-1506485338023-6ce5f36692bb?w=600&q=80', // woodworking tools
  'Wäschereien': 'https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?w=600&q=80', // washing machines
  'Dachdecker': 'https://images.unsplash.com/photo-1505085816390-39e14a79df89?w=600&q=80', // roof construction
  'Elektriker': 'https://images.unsplash.com/photo-1555626906-81e6b91129b1?w=600&q=80', // electricians, or wires
  'Supermarkt': 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&q=80', // grocery store aisle
  'Kleidung': 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&q=80', // clothing store
  'Bürobedarf': 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=600&q=80', // office desk
  'Restaurant': 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80', // restaurant
  'Steuerberater': 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&q=80', // calculator/finances
  'Marketingdienstleistungen': 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80', // marketing chart
  'Finanzberatung': 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&q=80', // consulting/finances
  'Banken': 'https://images.unsplash.com/photo-1450101499163-c8848c66e2c6?w=600&q=80', // banking/finance
  'Rechtsanwälte': 'https://images.unsplash.com/photo-1589391886645-19e0787b322f?w=600&q=80', // gavel/law
  'Indoor-Spielplätze': 'https://images.unsplash.com/photo-1510251147893-dd370b3d81dc?w=600&q=80', // indoor fun
  'Tennisplätze': 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=600&q=80', // tennis
  'Fußballvereine': 'https://images.unsplash.com/photo-1518605368461-1ee7c66dcde8?w=600&q=80', // soccer
  'Schwimmbäder': 'https://images.unsplash.com/photo-1519315901367-f34f9b98a77b?w=600&q=80', // swimming pool
  'Outdoor-Freizeitgebiet': 'https://images.unsplash.com/photo-1501555088652-021faa106b9b?w=600&q=80', // outdoor 
};

let content = fs.readFileSync('src/data.ts', 'utf8');

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
    else imgUrl = 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=600&q=80';
  }

  // specific overrides based on name
  if (block.includes('Elektro') || block.includes('Elektriker')) {
    imgUrl = 'https://images.unsplash.com/photo-1555626906-81e6b91129b1?w=600&q=80'; // backup electrician image
  }
  if (block.includes('Holocafé') || block.includes('Lasertag')) {
    imgUrl = 'https://images.unsplash.com/photo-1538370965046-79c0d6907d47?w=600&q=80'; // gaming/arcade
  }

  if (block.includes('imageUrl:')) {
    block = block.replace(/imageUrl:\s*'[^']+'/, `imageUrl: '${imgUrl}'`);
  } else {
    // try to append it
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
