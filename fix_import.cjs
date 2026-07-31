const fs = require('fs');
let app = fs.readFileSync('src/App.tsx', 'utf8');

app = app.replace(
  "import { collection, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';",
  "import { collection, getDocs, doc, setDoc, deleteDoc, addDoc } from 'firebase/firestore';"
);

fs.writeFileSync('src/App.tsx', app);
