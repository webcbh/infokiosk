import { db } from './src/firebase';
import { doc, getDoc } from 'firebase/firestore';

async function run() {
  const docRef = doc(db, "system", "details");
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const data = docSnap.data();
    for (const h of data.hotels) {
      for (const m of h.content.modules) {
        if (m.title?.toLowerCase().includes('directory')) {
           console.log("Hotel:", h.id, "Dir Config categories:", m.directoryConfig?.categories?.length);
        }
      }
    }
  }
}
run();
