import fs from 'fs';

const file = fs.readFileSync('src/data.ts', 'utf-8');

const imageForCategory = (cat: string, sub: string) => {
  if (cat === 'Handwerk') return 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&q=80';
  if (cat === 'Gastronomie') return 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80';
  if (sub === 'Banken') return 'https://images.unsplash.com/photo-1601597111158-2fceff292cdc?w=600&q=80';
  if (cat === 'Freizeit und Tourismus') return 'https://images.unsplash.com/photo-1533240332308-f404d025218d?w=600&q=80';
  if (cat === 'Dienstleistungen') return 'https://images.unsplash.com/photo-1556761175-5973dc0f32d7?w=600&q=80';
  if (cat === 'Einzelhandel') return 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&q=80';
  return 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80';
};

let result = file;
let currentCat = '';
let currentSub = '';

const lines = result.split('\n');
let insideObj = false;
let hasImageUrl = false;
let objStartIdx = -1;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];

  if (line.includes('category:')) {
    const match = line.match(/category:\s*'([^']+)'/);
    if (match) currentCat = match[1];
  }
  if (line.includes('subcategory:')) {
    const match = line.match(/subcategory:\s*'([^']+)'/);
    if (match) currentSub = match[1];
  }

  if (line.includes('{') && line.trim().startsWith('{')) {
    insideObj = true;
    hasImageUrl = false;
    objStartIdx = i;
  }
  
  if (line.includes('imageUrl:')) {
    hasImageUrl = true;
  }
  
  if (line.includes('}') && insideObj) {
    if (!hasImageUrl && currentCat && typeof lines[i-1] === 'string') {
      let prevLineIndex = i - 1;
      while (lines[prevLineIndex].trim() === '' && prevLineIndex > 0) {
        prevLineIndex--;
      }
      if (!lines[prevLineIndex].trim().endsWith(',')) {
        lines[prevLineIndex] = lines[prevLineIndex] + ',';
      }
      lines.splice(i, 0, `    imageUrl: '${imageForCategory(currentCat, currentSub)}'`);
      i++; // adjust since we added a line
    }
    insideObj = false;
  }
  
  // stop when we reach categories
  if (line.includes('export const categories')) {
    break;
  }
}

fs.writeFileSync('src/data.ts', lines.join('\n'));
