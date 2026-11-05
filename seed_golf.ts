import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import firebaseConfig from './firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

const defaultCourses = [
  {
    id: 'course-1',
    title: 'Minthis Golf Club',
    subtitle: 'A stunning championship course set in a breathtaking natural landscape.',
    image: 'https://images.unsplash.com/photo-1593111663630-f47055745749?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'course-2',
    title: 'Aphrodite Hills',
    subtitle: 'An award-winning golf resort with panoramic views and exceptional facilities.',
    image: 'https://images.unsplash.com/photo-1587314541740-f47055745749?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'course-3',
    title: 'Secret Valley',
    subtitle: 'A unique golf experience surrounded by picturesque landscapes and serenity.',
    image: 'https://images.unsplash.com/photo-1535144883408-01186716093d?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'course-4',
    title: 'Elea Golf',
    subtitle: 'A beautiful course that combines natural beauty with a memorable golfing experience.',
    image: 'https://images.unsplash.com/photo-1592919505780-303950717480?auto=format&fit=crop&w=800&q=80'
  }
];

async function seed() {
  const docRef = doc(db, 'config', 'global');
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    const data = docSnap.data();
    let updated = false;
    
    if (data.hotels) {
      data.hotels.forEach((hotel: any) => {
        if (hotel.content && hotel.content.modules) {
          hotel.content.modules.forEach((mod: any) => {
            if (mod.templateId === 'golf' || mod.title === 'Golf Holidays') {
              if (!mod.submodules || mod.submodules.length === 0) {
                mod.submodules = defaultCourses;
                updated = true;
                console.log('Seeded golf courses into module:', mod.title);
              }
            }
          });
        }
      });
    }
    
    if (updated) {
      await updateDoc(docRef, { hotels: data.hotels });
      console.log('Database updated successfully.');
    } else {
      console.log('No update needed (Golf module already has submodules or not found).');
    }
  } else {
    console.log('Config document not found');
  }
  process.exit(0);
}

seed().catch(console.error);
