import { db } from './src/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

async function run() {
  const docRef = doc(db, "system", "details");
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) {
    console.log("No data found");
    return;
  }
  
  const data = docSnap.data();
  let updated = false;

  if (data.hotels) {
    data.hotels = data.hotels.map((hotel: any) => {
      if (hotel.content && hotel.content.modules) {
        hotel.content.modules = hotel.content.modules.map((mod: any) => {
          if (mod.submodules) {
            mod.submodules = mod.submodules.map((sub: any) => {
              if (sub.layout === 'directory' || sub.title?.toLowerCase().includes('directory')) {
                updated = true;
                if (sub.directoryConfig && sub.directoryConfig.categories) {
                    // Check if A-Z category exists
                    let cat = sub.directoryConfig.categories.find((c: any) => c.title === 'A-Z SERVICES');
                    if (!cat) {
                        sub.directoryConfig.categories.unshift({
                            id: 'cat-a-z',
                            title: 'A-Z SERVICES',
                            description: 'Comprehensive A-Z list of our services and policies.',
                            icon: 'List',
                            items: [
                                { name: 'Adaptor', icon: 'Plug' },
                                { name: 'Air-Conditioning / Heating', icon: 'Thermometer' },
                                { name: 'Hotel Policies', icon: 'FileText' },
                                { name: 'Airport Transfers', icon: 'Plane' },
                                { name: 'Babysitting', icon: 'Baby' },
                                { name: 'Baggage', icon: 'Briefcase' }
                            ]
                        });
                    } else {
                        const toAdd = [
                            { name: 'Adaptor', icon: 'Plug' },
                            { name: 'Air-Conditioning / Heating', icon: 'Thermometer' },
                            { name: 'Hotel Policies', icon: 'FileText' }
                        ];
                        for (const item of toAdd) {
                            if (!cat.items.find((i: any) => i.name === item.name)) {
                                cat.items.push(item);
                            }
                        }
                    }
                }
              }
              return sub;
            });
          }
          if (mod.templateId === 'directory' || mod.title?.toLowerCase().includes('directory')) {
            updated = true;
            if (mod.directoryConfig && mod.directoryConfig.categories) {
                let cat = mod.directoryConfig.categories.find((c: any) => c.title === 'A-Z SERVICES');
                if (!cat) {
                    mod.directoryConfig.categories.unshift({
                        id: 'cat-a-z',
                        title: 'A-Z SERVICES',
                        description: 'Comprehensive A-Z list of our services and policies.',
                        icon: 'List',
                        items: [
                            { name: 'Adaptor', icon: 'Plug' },
                            { name: 'Air-Conditioning / Heating', icon: 'Thermometer' },
                            { name: 'Hotel Policies', icon: 'FileText' }
                        ]
                    });
                } else {
                    const toAdd = [
                        { name: 'Adaptor', icon: 'Plug' },
                        { name: 'Air-Conditioning / Heating', icon: 'Thermometer' },
                        { name: 'Hotel Policies', icon: 'FileText' }
                    ];
                    for (const item of toAdd) {
                        if (!cat.items.find((i: any) => i.name === item.name)) {
                            cat.items.push(item);
                        }
                    }
                }
            }
          }
          return mod;
        });
      }
      return hotel;
    });
  }

  if (updated) {
    await setDoc(docRef, data);
    console.log("Updated system details.");
  } else {
    console.log("No updates needed.");
  }
}

run().then(() => {
    console.log("Done");
    process.exit(0);
}).catch(e => {
    console.error(e);
    process.exit(1);
});
