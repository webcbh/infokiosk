const { initializeApp } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const fs = require('fs');
let projectId;
try {
  const firebaseConfig = JSON.parse(fs.readFileSync('firebase-applet-config.json', 'utf8'));
  projectId = firebaseConfig.projectId;
} catch(e) {}
initializeApp({ projectId });
const db = getFirestore();
db.collection('system').doc('details').get().then(doc => {
  console.log("Exists:", doc.exists);
}).catch(e => {
  console.log("Error:", e);
});
