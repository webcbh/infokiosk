const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const targetApp = `          if (data.hotels && data.hotels.length > 0) {
            const activeHotels = data.hotels.filter((h: any) => h.active);
            if (activeHotels.length > 0) {
              const savedId = localStorage.getItem("kiosk_hotel_id");
              if (savedId && activeHotels.find((h: any) => h.id === savedId)) {
                setSelectedHotelId(savedId);
              } else {
                setSelectedHotelId(activeHotels[0].id);
              }
            }
          }`;

const replacementApp = `          if (data.hotels && data.hotels.length > 0) {
            const activeHotels = data.hotels.filter((h: any) => h.active);
            if (activeHotels.length > 0) {
              const assignedHotelId = data.myDevice?.assignedHotelId;
              const savedId = localStorage.getItem("kiosk_hotel_id");
              if (assignedHotelId && activeHotels.find((h: any) => h.id === assignedHotelId)) {
                setSelectedHotelId(assignedHotelId);
                localStorage.setItem("kiosk_hotel_id", assignedHotelId);
              } else if (savedId && activeHotels.find((h: any) => h.id === savedId)) {
                setSelectedHotelId(savedId);
              } else {
                setSelectedHotelId(activeHotels[0].id);
              }
            }
          }`;

code = code.replace(targetApp, replacementApp);

fs.writeFileSync('src/App.tsx', code);
