const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

code = code.replace(
  'import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";',
  'import { initializeFirestore, doc, getDoc, setDoc } from "firebase/firestore";'
);

code = code.replace(
  'firestoreDb = getFirestore(fbApp, firebaseConfig.firestoreDatabaseId);',
  'firestoreDb = initializeFirestore(fbApp, { experimentalAutoDetectLongPolling: true }, firebaseConfig.firestoreDatabaseId);'
);

fs.writeFileSync('server.ts', code);
