import fs from 'fs';

const serverTs = fs.readFileSync('server.ts', 'utf-8');
const match = serverTs.match(/const initialBusinesses = (\[[\s\S]*?\]);\n/);
if (match) {
  let dataTs = fs.readFileSync('src/data.ts', 'utf-8');
  dataTs = dataTs.replace(/export const businesses: Business\[\] = \[[^]*?\];/, `export const businesses: Business[] = ${match[1]};`);
  fs.writeFileSync('src/data.ts', dataTs, 'utf-8');
  console.log("Updated src/data.ts successfully!");
} else {
  console.log("Failed to parse server.ts");
}
