import { db } from './src/firebase';
import { doc, getDoc } from 'firebase/firestore';

async function run() {
  const docRef = doc(db, "system", "details");
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) return;
  const data = docSnap.data();
  data.hotels.forEach((h: any) => {
    console.log("Hotel:", h.id);
    const m1 = h.content.modules.find((m: any) => m.title.includes('Directory'));
    if (m1) {
      console.log("  hasDirConfig:", !!m1.directoryConfig);
      console.log("  categories count:", m1.directoryConfig?.categories?.length);
    } else {
      console.log("  No Directory module found.");
    }
  });
}
run();
