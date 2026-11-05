import { db } from './src/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

async function run() {
  const docRef = doc(db, "system", "details");
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) return;
  const data = docSnap.data();

  const defaultConfig = {
    fontFamily: 'Inter',
    primaryColor: '#0f3866', 
    secondaryColor: '#d9b673',
    backgroundColor: '#f8fafc',
    textColor: '#334155',
    categories: [
      {
        id: 'cat-1',
        title: 'GUEST SERVICES',
        description: 'We are here to make your stay seamless and worry-free.',
        icon: 'Star',
        items: [
          { name: '24-Hour Front Desk', icon: 'Clock' },
          { name: 'Concierge', icon: 'UserCircle' },
          { name: 'Bell Desk', icon: 'Bell' },
          { name: 'Luggage Assistance', icon: 'Briefcase' }
        ]
      }
    ],
    bottomItems: []
  };

  let count = 0;
  data.hotels = data.hotels.map((hotel: any) => {
    if (hotel.content && hotel.content.modules) {
      hotel.content.modules = hotel.content.modules.map((mod: any) => {
        if (mod.title?.toLowerCase().includes('directory')) {
          console.log(`Updating ${hotel.id} - ${mod.title}`);
          mod.directoryConfig = JSON.parse(JSON.stringify(defaultConfig));
          count++;
        }
        return mod;
      });
    }
    return hotel;
  });
  
  if (count > 0) {
    console.log(`Updated ${count} modules. Saving to Firestore...`);
    try {
      await setDoc(docRef, data);
      console.log("Saved successfully!");
      
      const res = await fetch("http://localhost:3000/api/admin/hotels", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hotels: data.hotels })
      });
      console.log("Updated local server");
      await fetch("http://localhost:3000/api/admin/push", { method: "POST" });
      console.log("Pushed to clients");
    } catch (e) {
      console.error("Error saving:", e);
    }
  }
}
run();
