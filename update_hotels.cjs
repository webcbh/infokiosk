const http = require('http');

http.get('http://localhost:3000/api/config', (res) => {
  let data = '';
  res.on('data', chunk => { data += chunk; });
  res.on('end', () => {
    const config = JSON.parse(data);
    let hotels = config.hotels;
    
    // Update the modules for all hotels
    hotels.forEach(hotel => {
      if (hotel.content && hotel.content.modules) {
        hotel.content.modules.forEach(mod => {
          if (mod.type === 'directory') {
            if (mod.directoryConfig) {
              mod.directoryConfig.categories = [
                {
                  id: 'cat-1',
                  title: 'ALL SERVICES',
                  description: 'Everything you need for a comfortable and memorable stay.',
                  icon: 'ConciergeBell',
                  items: [
                    { name: 'Hotel Policies', icon: 'FileText' },
                    { name: 'Airports', icon: 'Plane' },
                    { name: 'Air-Conditioning / Heating', icon: 'Snowflake' },
                    { name: 'Auto Reservation', icon: 'Car' },
                    { name: 'Airport Transportation', icon: 'Bus' },
                    { name: 'Attractions & Bridges', icon: 'Map' },
                    { name: 'Baby Cot', icon: 'Baby' },
                    { name: 'Banks', icon: 'Landmark' },
                    { name: 'Beverages', icon: 'Coffee' },
                    { name: 'Bills', icon: 'Receipt' },
                    { name: 'Bus Service', icon: 'Bus' },
                    { name: 'Car Rental', icon: 'Car' },
                    { name: 'Check In / Out Time', icon: 'Clock' },
                    { name: 'Children\'s High Chairs', icon: 'Baby' },
                    { name: 'Coffee & Tea Making Facilities', icon: 'Coffee' },
                    { name: 'Credit Card Acceptance', icon: 'CreditCard' },
                    { name: 'Doctoring', icon: 'Stethoscope' },
                    { name: 'Driving License', icon: 'IdCard' },
                    { name: 'Doctor', icon: 'Stethoscope' },
                    { name: 'Dress Code', icon: 'Shirt' },
                    { name: 'Electricity', icon: 'Zap' },
                    { name: 'Emergencies', icon: 'Siren' },
                    { name: 'Emergency Calls', icon: 'Phone' },
                    { name: 'Embassies & Consulates', icon: 'Landmark' },
                    
                    { name: 'Entertainment', icon: 'Music' },
                    { name: 'Excursions', icon: 'Map' },
                    { name: 'First Aid', icon: 'PlusSquare' },
                    { name: 'Flowers', icon: 'Flower2' },
                    { name: 'Foreign Exchange', icon: 'DollarSign' },
                    { name: 'Games', icon: 'Gamepad2' },
                    { name: 'Green Donkey', icon: 'Trees' },
                    { name: 'Group Arrangements', icon: 'Users' },
                    { name: 'Gym', icon: 'Dumbbell' },
                    { name: 'Hair Dryer', icon: 'Wind' },
                    { name: 'Hair Salon', icon: 'Scissors' },
                    { name: 'Housekeeping', icon: 'Broom' },
                    { name: 'Internet Corner', icon: 'Globe' },
                    { name: 'Keys', icon: 'Key' },
                    { name: 'Kids Club', icon: 'Baby' },
                    { name: 'Laundry & Dry Cleaning Services', icon: 'Shirt' },
                    { name: 'Library / Books', icon: 'Book' },
                    { name: 'Lifts', icon: 'ArrowUpDown' },
                    { name: 'Lost & Found', icon: 'Search' },
                    { name: 'Luggage', icon: 'Briefcase' },
                    { name: 'Mail & Messages', icon: 'Mail' },
                    { name: 'Meeting & Conference Facilities', icon: 'Users' },
                    { name: 'Men\'s', icon: 'User' },
                    { name: 'Mini Bar', icon: 'Wine' },
                    { name: 'Mini Market', icon: 'ShoppingCart' },
                    { name: 'Mirrored Sockets', icon: 'Zap' },
                    
                    { name: 'Mobile', icon: 'Smartphone' },
                    { name: 'Parking', icon: 'ParkingCircle' },
                    { name: 'Pets', icon: 'PawPrint' },
                    { name: 'Pharmacy', icon: 'Pill' },
                    { name: 'Photocopier', icon: 'Printer' },
                    { name: 'Pool Beach Towels', icon: 'Waves' },
                    { name: 'Postage Stamps', icon: 'Mail' },
                    { name: 'Premium Package (Lux. All Inclusive)', icon: 'Gift' },
                    { name: 'Receptions', icon: 'Bell' },
                    { name: 'Religious Services', icon: 'Church' },
                    { name: 'Restaurants', icon: 'Utensils' },
                    { name: 'Room Service', icon: 'ConciergeBell' },
                    { name: 'Safety Deposit Box', icon: 'Lock' },
                    { name: 'Sauna and Steam bath', icon: 'Droplets' },
                    { name: 'Security', icon: 'ShieldCheck' },
                    { name: 'Smoking', icon: 'Cigarette' },
                    { name: 'Spa', icon: 'Flower2' },
                    { name: 'Telephone', icon: 'Phone' },
                    { name: 'Television', icon: 'Tv' },
                    { name: 'Trouser Press', icon: 'AlignVerticalSpaceAround' },
                    { name: 'Wake-up Service', icon: 'AlarmClock' },
                    { name: 'Water', icon: 'Droplet' },
                    { name: 'Water Sports', icon: 'Waves' },
                    { name: 'Wi-Fi', icon: 'Wifi' },
                    { name: 'Wine', icon: 'Wine' }
                  ]
                }
              ];
            }
          }
        });
      }
    });

    const postData = JSON.stringify({ hotels: hotels });
    
    const req = http.request({
      hostname: 'localhost',
      port: 3000,
      path: '/api/admin/hotels',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    }, (resPost) => {
      let result = '';
      resPost.on('data', (c) => result += c);
      resPost.on('end', () => console.log('Update result:', result));
    });

    req.on('error', (e) => console.error(e));
    req.write(postData);
    req.end();
  });
}).on('error', (e) => {
  console.error(`Got error: ${e.message}`);
});
