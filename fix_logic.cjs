const fs = require('fs');
let app = fs.readFileSync('src/App.tsx', 'utf8');

app = app.replace(
  /const allowedBusinesses = isAdmin \? businesses : businesses\.filter\(\(b: Business\) => b\.id === ownerBusinessId\);/g,
  'const allowedBusinesses = isAdmin ? businesses : businesses.filter((b: Business) => b.id === ownerBusinessId || b.ownerId === userProfile?.uid);'
);

fs.writeFileSync('src/App.tsx', app);
