import { db } from './src/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const allServices = [
  { name: 'Airport Transfers', icon: 'Bus' },
  { name: 'Airport Reservations', icon: 'Plane' },
  { name: 'Arrangements on Bridges', icon: 'Map' },
  { name: 'Baby Cot', icon: 'Baby' },
  { name: 'Barber', icon: 'Scissors' },
  { name: 'Boutique', icon: 'ShoppingBag' },
  { name: 'Car Rental', icon: 'Car' },
  { name: 'Check in / Check out Time', icon: 'Clock' },
  { name: 'Children\'s High Chairs', icon: 'Armchair' },
  { name: 'Credit Cards (Visa/Master)', icon: 'CreditCard' },
  { name: 'Dancing', icon: 'Music' },
  { name: 'Diving Centre', icon: 'Waves' },
  { name: 'Doctor', icon: 'Stethoscope' },
  { name: 'Dress Code', icon: 'Shirt' },
  { name: 'Electricity', icon: 'Zap' },
  { name: 'Emergency Calls', icon: 'PhoneCall' },
  { name: 'Entertainment for Children', icon: 'Users' },
  { name: 'Entertainment', icon: 'PartyPopper' },
  { name: 'Excursions', icon: 'Map' },
  { name: 'First Aid', icon: 'BriefcaseMedical' },
  { name: 'Flowers', icon: 'Flower2' },
  { name: 'Foreign Exchange', icon: 'CircleDollarSign' },
  { name: 'Games', icon: 'Gamepad2' },
  { name: 'Gift Shop', icon: 'Gift' },
  { name: 'Green Bowls', icon: 'Circle' },
  { name: 'Groups Arrangements', icon: 'Users' },
  { name: 'Gym', icon: 'Dumbbell' },
  { name: 'Hair Dryer', icon: 'Wind' },
  { name: 'Hair Salon', icon: 'Scissors' },
  { name: 'Housekeeping', icon: 'SprayCan' },
  { name: 'Internet Corner', icon: 'Wifi' },
  { name: 'Keys', icon: 'Key' },
  { name: 'Kids Club', icon: 'Smile' },
  { name: 'Laundry & Dry Cleaning', icon: 'Shirt' },
  { name: 'Library Room', icon: 'BookOpen' },
  { name: 'Lifts', icon: 'ArrowUpDown' },
  { name: 'Lost & Found', icon: 'Search' },
  { name: 'Luggage', icon: 'Luggage' },
  { name: 'Mail & Messages', icon: 'Mail' },
  { name: 'Meeting & Conference Facilities', icon: 'Users' },
  { name: 'Meeting Room', icon: 'CalendarDays' },
  { name: 'Mini Bar', icon: 'Wine' },
  { name: 'Mini Market', icon: 'ShoppingBasket' },
  { name: 'Motorized Scooters', icon: 'Bike' },
  { name: 'Music', icon: 'Music' },
  { name: 'Parking', icon: 'ParkingCircle' },
  { name: 'Pets', icon: 'PawPrint' },
  { name: 'Pharmacy', icon: 'Pill' },
  { name: 'Photographer', icon: 'Camera' },
  { name: 'Pool Beach Towels', icon: 'Umbrella' },
  { name: 'Reception', icon: 'ConciergeBell' }
];

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
                if (!sub.directoryConfig) sub.directoryConfig = {};
                sub.directoryConfig.categories = [{
                  id: 'all-services',
                  title: 'All Services',
                  items: allServices
                }];
              }
              return sub;
            });
          }
          if (mod.templateId === 'directory' || mod.title?.toLowerCase().includes('directory')) {
            updated = true;
            if (!mod.directoryConfig) mod.directoryConfig = {};
            mod.directoryConfig.categories = [{
              id: 'all-services',
              title: 'All Services',
              items: allServices
            }];
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
