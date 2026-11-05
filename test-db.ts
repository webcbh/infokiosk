import { db } from './src/firebase';
import { collection, getDocs, doc, setDoc } from 'firebase/firestore';

async function run() {
  const hotelsSnap = await getDocs(collection(db, 'hotels'));
  for (const hotelDoc of hotelsSnap.docs) {
    const hotelData = hotelDoc.data();
    console.log(JSON.stringify(hotelData.content.modules.map(m => m.title), null, 2));
    
    // find directory module
    let dir = hotelData.content.modules.find(m => m.title?.toLowerCase().includes('directory'));
    if (!dir) {
      hotelData.content.modules.forEach(m => {
        if (m.submodules) {
          const s = m.submodules.find(sub => sub.title?.toLowerCase().includes('directory'));
          if (s) dir = s;
        }
      });
    }
    
    if (dir) {
      console.log('Directory config keys:', Object.keys(dir.directoryConfig || {}));
      if (dir.directoryConfig) {
        console.log('Categories count:', dir.directoryConfig.categories?.length);
      }
    }
  }
}

run().catch(console.error);
