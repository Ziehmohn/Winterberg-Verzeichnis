import fs from 'fs';

const html = fs.readFileSync('scratch/live.html', 'utf8');
const match = html.match(/src="([^"]*assets\/index-[^"]*\.js)"/);
console.log("Index JS bundle in live HTML:", match ? match[1] : "NOT FOUND");
