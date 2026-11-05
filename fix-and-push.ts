import { db } from './src/firebase';
import { doc, getDoc } from 'firebase/firestore';

async function run() {
  const docRef = doc(db, "system", "details");
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) {
    console.log("No data found");
    return;
  }
  
  const data = docSnap.data();
  let updated = false;

  const defaultConfig = {
    fontFamily: 'Inter',
    primaryColor: '#0f3866', // Deep blue from image
    secondaryColor: '#d9b673', // Gold/yellow from image
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
          { name: 'Luggage Assistance', icon: 'Briefcase' },
          { name: 'Wake-Up Call', icon: 'AlarmClock' },
          { name: 'Umbrella Service', icon: 'Umbrella' },
          { name: 'Safety Deposit Box', icon: 'Lock' },
          { name: 'Express Check-In / Check-Out', icon: 'LogOut' },
          { name: 'Tour & Travel Assistance', icon: 'Map' },
          { name: 'Transportation', icon: 'Car' },
          { name: 'Doctor on Call', icon: 'Stethoscope' },
          { name: 'Lost & Found', icon: 'Search' },
          { name: 'Message Service', icon: 'Mail' },
          { name: 'Postal Service', icon: 'Package' },
          { name: 'Airport Transfers', icon: 'Plane' },
          { name: 'Valet Parking', icon: 'Car' },
          { name: 'Parking', icon: 'ParkingCircle' },
          { name: 'Shuttle Service', icon: 'Bus' },
          { name: 'Car Rental', icon: 'Car' },
          { name: 'Laundry & Dry Cleaning', icon: 'Shirt' },
          { name: 'Pressing Service', icon: 'AlignVerticalSpaceAround' },
          { name: 'Shoe Shine', icon: 'Footprints' },
          { name: 'Housekeeping', icon: 'Broom' },
          { name: 'Turndown Service', icon: 'BedDouble' },
          { name: 'Extra Amenities', icon: 'Plus' },
          { name: 'Baby Crib (On Request)', icon: 'Baby' },
          { name: 'Rollaway Bed (On Request)', icon: 'Bed' },
          { name: 'In-Room Safe', icon: 'Safe' },
          { name: 'Newspaper', icon: 'Newspaper' },
          { name: 'Music Channel', icon: 'Music' },
          { name: 'Wi-Fi Access', icon: 'Wifi' },
          { name: 'Business Center', icon: 'Briefcase' },
          { name: 'Meeting & Banquet Facilities', icon: 'Users' },
          { name: 'Secretarial Services', icon: 'FileText' },
          { name: 'Fax / Photocopy', icon: 'Printer' },
          { name: 'Printer', icon: 'Printer' },
          { name: 'Courier Service', icon: 'Send' },
          { name: 'Currency Exchange', icon: 'DollarSign' },
          { name: 'ATM', icon: 'CreditCard' },
          { name: 'Smoking Zone', icon: 'Flame' },
          { name: 'Non-Smoking Hotel', icon: 'Ban' },
          { name: 'Mobile Charging Station', icon: 'BatteryCharging' }
        ]
      },
      {
        id: 'cat-2',
        title: 'DINING EXPERIENCES',
        description: 'Savor a variety of delicious options throughout your stay.',
        icon: 'ConciergeBell',
        items: [
          { name: 'All-Day Dining Restaurant', icon: 'Utensils' },
          { name: 'Specialty Restaurant', icon: 'ChefHat' },
          { name: 'In-Room Dining (24 Hours)', icon: 'RoomService' },
          { name: 'The Lounge', icon: 'Coffee' },
          { name: 'Pool Bar', icon: 'Martini' },
          { name: 'Café / Coffee Shop', icon: 'Coffee' },
          { name: 'Breakfast (Complimentary)', icon: 'Coffee' },
          { name: 'Room Service', icon: 'BellRing' },
          { name: 'Dietary / Special Meal', icon: 'Leaf' },
          { name: 'Private Dining', icon: 'Users' },
          { name: 'Buffet', icon: 'Soup' },
          { name: 'À La Carte', icon: 'FileText' },
          { name: "Kids' Menu", icon: 'Baby' },
          { name: 'Bar', icon: 'Wine' },
          { name: 'Happy Hour', icon: 'Clock' },
          { name: 'Wine Selection', icon: 'Wine' },
          { name: 'Dessert Menu', icon: 'Cake' },
          { name: 'Take Away', icon: 'ShoppingBag' },
          { name: 'Catering Service', icon: 'Truck' },
          { name: 'Celebration Arrangements', icon: 'Gift' }
        ]
      },
      {
        id: 'cat-3',
        title: 'RELAX & RECHARGE',
        description: 'Wellness and leisure facilities designed for your comfort.',
        icon: 'Flower2',
        items: [
          { name: 'Swimming Pool', icon: 'Waves' },
          { name: 'Fitness Center', icon: 'Dumbbell' },
          { name: 'Spa & Wellness', icon: 'Sparkles' },
          { name: 'Sauna & Steam', icon: 'Droplets' },
          { name: 'Yoga / Meditation Room', icon: 'Accessibility' },
          { name: 'Massage', icon: 'Hand' },
          { name: 'Salon', icon: 'Scissors' },
          { name: 'Outdoor Garden', icon: 'TreePine' },
          { name: 'Tennis Court', icon: 'CircleDot' },
          { name: "Kids' Club", icon: 'Baby' },
          { name: 'Game Room', icon: 'Gamepad2' },
          { name: 'Library', icon: 'Book' },
          { name: 'Bicycle Rental', icon: 'Bike' },
          { name: 'Beach Access', icon: 'Umbrella' },
          { name: 'Water Sports', icon: 'Waves' },
          { name: 'Golf', icon: 'Flag' },
          { name: 'Jogging Track', icon: 'Activity' },
          { name: 'Entertainment Program', icon: 'Ticket' },
          { name: 'Live Music', icon: 'Music' },
          { name: 'Movie Screening', icon: 'Film' },
          { name: 'Shopping Arcade', icon: 'ShoppingBag' },
          { name: 'Art Gallery', icon: 'Palette' },
          { name: 'Photo Studio', icon: 'Camera' },
          { name: 'Event Spaces', icon: 'Calendar' },
          { name: 'Banquet Hall', icon: 'Users' },
          { name: 'Conference Room', icon: 'Users' },
          { name: 'Wedding Services', icon: 'Heart' },
          { name: 'Romantic Set-Up', icon: 'Heart' },
          { name: 'Helicopter Service', icon: 'Plane' },
          { name: 'Pet-Friendly (On Request)', icon: 'PawPrint' }
        ]
      }
    ],
    bottomItems: [
      {
        id: 'bot-1',
        title: 'WI-FI ACCESS',
        description: 'Complimentary high-speed internet throughout the hotel.',
        icon: 'Wifi'
      },
      {
        id: 'bot-2',
        title: 'PARKING',
        description: 'Complimentary self-parking for all in-house guests.',
        icon: 'Car'
      },
      {
        id: 'bot-3',
        title: 'SHUTTLE SERVICE',
        description: 'Scheduled shuttle service available to key locations. Please inquire at the front desk.',
        icon: 'Bus'
      },
      {
        id: 'bot-4',
        title: 'NON-SMOKING HOTEL',
        description: 'For the comfort of all guests, our hotel is 100% smoke-free.',
        icon: 'CigaretteOff'
      }
    ],
    footerLeft: 'Need anything? Dial "0" to contact our front desk.',
    footerRight: 'Thank you for choosing us. We wish you a pleasant stay!'
  };

  if (data.hotels) {
    data.hotels = data.hotels.map((hotel: any) => {
      if (hotel.content && hotel.content.modules) {
        hotel.content.modules = hotel.content.modules.map((mod: any) => {
          if (mod.submodules) {
            mod.submodules = mod.submodules.map((sub: any) => {
              if (sub.layout === 'directory' || sub.title?.toLowerCase().includes('directory')) {
                updated = true;
                if (!sub.directoryConfig || Object.keys(sub.directoryConfig).length === 0 || !sub.directoryConfig.categories || sub.directoryConfig.categories.length === 0) {
                  return {
                    ...sub,
                    title: 'DIRECTORY OF SERVICES',
                    subtitle: 'Everything you need for a comfortable and memorable stay. Our services are at your convenience.',
                    directoryConfig: defaultConfig
                  };
                }
              }
              return sub;
            });
          }
          if (mod.templateId === 'directory' || mod.title?.toLowerCase().includes('directory')) {
            updated = true;
            if (!mod.directoryConfig || Object.keys(mod.directoryConfig).length === 0 || !mod.directoryConfig.categories || mod.directoryConfig.categories.length === 0) {
              return {
                ...mod,
                title: 'DIRECTORY OF SERVICES',
                subtitle: 'Everything you need for a comfortable and memorable stay. Our services are at your convenience.',
                directoryConfig: defaultConfig
              };
            }
          }
          return mod;
        });
      }
      return hotel;
    });
  }

  // send to the local server
  const res = await fetch("http://localhost:3000/api/admin/hotels", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ hotels: data.hotels })
  });
  console.log("Updated local server:", await res.json());
  
  const pushRes = await fetch("http://localhost:3000/api/admin/push", {
    method: "POST"
  });
  console.log("Pushed to devices:", await pushRes.json());
}

run().catch(console.error);
