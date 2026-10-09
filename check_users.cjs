const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const { getAuth } = require('firebase-admin/auth');

initializeApp();
const db = getFirestore();

async function checkUsers() {
  const qs = await db.collection('users').get();
  console.log(`Firestore 'users' collection has ${qs.size} documents.`);
  qs.forEach(doc => {
    console.log(doc.id, doc.data().email);
  });
  
  const authUsers = await getAuth().listUsers();
  console.log(`\nFirebase Auth has ${authUsers.users.length} users.`);
  authUsers.users.forEach(u => {
    console.log(u.uid, u.email);
  });
}
checkUsers().catch(console.error);
