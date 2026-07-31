import fs from 'fs';

let content = fs.readFileSync('src/data.ts', 'utf8');

const blocks = content.split(/(\{\s*id:\s*'[A-Za-z0-9_]+',)/g);
for (let i = 1; i < blocks.length; i += 2) {
  let block = blocks[i] + blocks[i+1];
  
  const idMatch = block.match(/id:\s*'([A-Za-z0-9_]+)'/);
  if (!idMatch) continue;
  const idStr = idMatch[1];
  
  let imgUrl = `https://picsum.photos/seed/${idStr}/800/600`;

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
console.log('Update Complete 9');
