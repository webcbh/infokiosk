const http = require('http');

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

http.get('http://localhost:3000/api/admin/data', (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    let data = JSON.parse(body);
    let updated = false;
    
    if (data.hotels) {
      data.hotels.forEach(hotel => {
        if (hotel.content && hotel.content.modules) {
          hotel.content.modules.forEach(mod => {
            if (mod.templateId === 'golf' || mod.title === 'Golf Holidays') {
              if (!mod.submodules || mod.submodules.length === 0) {
                mod.submodules = defaultCourses;
                updated = true;
                console.log('Seeded golf courses into hotel:', hotel.name);
              }
            }
          });
        }
      });
    }

    if (updated) {
      const options = {
        hostname: 'localhost',
        port: 3000,
        path: '/api/admin/hotels',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      };

      const req = http.request(options, (res2) => {
        let body2 = '';
        res2.on('data', chunk => body2 += chunk);
        res2.on('end', () => {
          console.log('Saved. Response:', body2);
        });
      });
      req.write(JSON.stringify({ hotels: data.hotels }));
      req.end();
    } else {
      console.log('No updates needed. Ensure the Golf module exists in the Admin dashboard.');
    }
  });
}).on('error', err => console.error(err));
