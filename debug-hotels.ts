import { db } from './src/firebase';
import { doc, getDoc } from 'firebase/firestore';

async function run() {
  const docRef = doc(db, "system", "details");
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) return;
  const data = docSnap.data();
  console.log(JSON.stringify(data.hotels[0].content.modules.map(m => ({ id: m.id, title: m.title, hasDirConfig: !!m.directoryConfig, submodules: m.submodules?.map(s => ({ id: s.id, title: s.title, hasDirConfig: !!s.directoryConfig })) })), null, 2));
}
run();
