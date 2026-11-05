import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadString, getDownloadURL } from "firebase/storage";
import fs from "fs";

const firebaseConfig = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));
const fbApp = initializeApp(firebaseConfig);
const storage = getStorage(fbApp);
const storageRef = ref(storage, 'test.txt');

uploadString(storageRef, 'Hello World').then(async () => {
  const url = await getDownloadURL(storageRef);
  console.log("SUCCESS:", url);
  process.exit(0);
}).catch(err => {
  console.error("FAIL:", err.message);
  process.exit(1);
});
