import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import fs from "fs";
import path from "path";

const firebaseConfig = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));
const fbApp = initializeApp(firebaseConfig);
const db = getFirestore(fbApp, firebaseConfig.firestoreDatabaseId);

const publicDir = './public';
const files = fs.readdirSync(publicDir).filter(f => f.startsWith('upl_'));

async function migrate() {
  const docSnap = await getDoc(doc(db, "system", "details"));
  let data = docSnap.exists() ? docSnap.data() : null;
  if (!data) return console.log("No data");

  // 1. Upload files
  let fileMap = {}; 
  for (const f of files) {
    const fileData = fs.readFileSync(path.join(publicDir, f));
    const base64 = fileData.toString('base64');
    const id = f.replace(/\.[^/.]+$/, ""); 
    
    await setDoc(doc(db, "uploads", id), {
      base64,
      mimeType: 'image/jpeg',
      createdAt: Date.now()
    });
    console.log("Uploaded", f, "as", id);
    fileMap[`/${f}`] = `/api/uploads/${id}`;
  }

  // 2. Replace URLs in db stringified
  let dbString = JSON.stringify(data);
  for (const oldUrl in fileMap) {
    // simple string replace
    dbString = dbString.split(oldUrl).join(fileMap[oldUrl]);
  }

  // 3. Save db back
  await setDoc(doc(db, "system", "details"), JSON.parse(dbString));
  console.log("DB Updated");
  process.exit(0);
}

migrate();
