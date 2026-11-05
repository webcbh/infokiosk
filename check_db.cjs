const admin = require("firebase-admin");
const fs = require('fs');

const firebaseConfigPath = 'firebase-applet-config.json';
if (fs.existsSync(firebaseConfigPath)) {
  const firebaseConfig = JSON.parse(fs.readFileSync(firebaseConfigPath, 'utf8'));
  
  admin.initializeApp({
    credential: admin.credential.cert(firebaseConfig)
  });
  
  const db = admin.firestore();
  
  db.collection('system').doc('details').get().then(doc => {
    if (doc.exists) {
      const data = doc.data();
      console.log("H1 Daily Program:", JSON.stringify(data.hotels[0].content.dailyProgram, null, 2));
    }
    process.exit(0);
  });
} else {
  console.log("No firebase config");
}
