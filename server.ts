import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { createServer } from "http";
import { Server } from "socket.io";
import multer from "multer";
import { GoogleGenAI, Type } from "@google/genai";

let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
}

import { initializeApp } from "firebase/app";
import { initializeFirestore, doc, getDoc, setDoc } from "firebase/firestore";

const firebaseConfigPath = path.join(process.cwd(), 'firebase-applet-config.json');
let firestoreDb: any = null;
if (fs.existsSync(firebaseConfigPath)) {
  const firebaseConfig = JSON.parse(fs.readFileSync(firebaseConfigPath, 'utf8'));
  const fbApp = initializeApp(firebaseConfig);
  firestoreDb = initializeFirestore(fbApp, { experimentalForceLongPolling: true }, firebaseConfig.firestoreDatabaseId);
}

const publicDir = path.join(process.cwd(), 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // we use a folder for uploads, e.g., in the public dir so it's easily served, but for production it should be handled differently
    cb(null, publicDir); 
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'upl_' + uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// Default content structure
const defaultContent = {
  logo: "",
  banners: [] as string[],
  location: { lat: 34.7667, lng: 32.4167 }, // Paphos
  dailyProgram: [
    {
      id: "dp1",
      date: "2024-05-26",
      title: "Arrival & Grounding",
      description: "Ease into your retreat with grounding practices, gentle movement, and connection.",
      events: [
        {
          id: "ev1",
          startTime: "2:00 PM",
          endTime: "4:00 PM",
          icon: "Briefcase",
          title: "Arrival & Check-In",
          description: "Settle in, receive a warm welcome, and take time to relax.",
          image: ""
        }
      ]
    }
  ],
  actions: [
    { id: "a1", icon: "CalendarMinus", title: "Book Now", subtitle: "Best Rate Guarantee" },
    { id: "a2", icon: "ConciergeBell", title: "Online Check-in", subtitle: "Save Time, Start Relaxing" },
    { id: "a3", icon: "Flower2", title: "Review Us", subtitle: "Share Your Experience" }
  ],
  modules: [
    { id: "m1", icon: "ConciergeBell", title: "Directory Of Services", subtitle: "Our services are at your convenience...", image: "", submodules: [] },
    { id: "m2", icon: "Bed", title: "Suites", subtitle: "Elegance & Comfort", image: "", submodules: [] },
    { id: "m3", icon: "Utensils", title: "Restaurants", subtitle: "A World of Flavors", image: "", submodules: [] },
    { id: "m4", icon: "ConciergeBell", title: "Restaurant Reservations", subtitle: "Reserve Your Table", image: "", submodules: [] },
    { id: "m5", icon: "Martini", title: "Bars", subtitle: "Sip, Savor, Relax", image: "", submodules: [] },
    { id: "m6", icon: "Music", title: "Daily Program", subtitle: "Experience Every Day", image: "", submodules: [] },
    { id: "m7", icon: "Camera", title: "Book Tours & Excursions", subtitle: "Explore More", image: "", submodules: [] },
    { id: "m8", icon: "Flower2", title: "Elixir Spa", subtitle: "Relax & Rejuvenate", image: "", submodules: [] },
    { id: "m9", icon: "Gift", title: "Guests Loyalty Club", subtitle: "Exclusive Privileges", image: "", submodules: [] },
    { id: "m10", icon: "Flag", title: "Golf Holidays", subtitle: "Tee Off in Paradise", image: "", submodules: [] },
    { id: "m11", icon: "Trophy", title: "Awards", subtitle: "Our Achievements", image: "", submodules: [] },
    { id: "m12", icon: "Map", title: "Hotel Map", subtitle: "Find Your Way", image: "", submodules: [] },
    { id: "m13", icon: "Sun", title: "Weather", subtitle: "Plan Your Perfect Day", image: "", submodules: [] },
    { id: "m14", icon: "Info", title: "General Information", subtitle: "Need to Know", image: "", submodules: [] },
    { id: "m15", icon: "Heart", title: "Weddings", subtitle: "System Module", image: "", submodules: [] },
    { id: "m16", icon: "MapPin", title: "Local Attractions", subtitle: "Discover nearby places", image: "", submodules: [] }
  ]
};

// Simulation of DB
const db = {
  settings: {
    ipWhitelistEnabled: false,
    whitelistedIps: [] as string[],
    generalConfig: {
      theme: "dark",
      refreshRate: 60,
      enableHotelSelector: false,
      enableMobileApp: true,
      disableMobileIpFiltering: true,
    },
  },
  devices: [] as { id: string; ip: string; name: string; status: "online" | "offline"; lastSeen: number; assignedHotelId?: string }[],
  logs: [] as { timestamp: number; type: string; message: string }[],
  templates: [
    { id: "tmpl_grid", name: "Default Grid Layout", displayType: "grid" },
    { id: "tmpl_list", name: "Detailed List Layout", displayType: "list" },
    { id: "tmpl_hero", name: "Hero Showcase Layout", displayType: "hero" },
    { id: "tmpl_suite", name: "Single Suite Light Design", displayType: "suite" }
  ],
  hotels: [
    { id: "h1", name: "Constantinou Bros Asimina Suites Hotel", active: true, content: JSON.parse(JSON.stringify(defaultContent)) },
    { id: "h2", name: "Constantinou Bros Athena Beach Hotel", active: true, content: JSON.parse(JSON.stringify(defaultContent)) },
    { id: "h3", name: "Constantinou Bros Athena Royal Beach Hotel", active: true, content: JSON.parse(JSON.stringify(defaultContent)) },
    { id: "h4", name: "Constantinou Bros Pioneer Beach Hotel", active: true, content: JSON.parse(JSON.stringify(defaultContent)) },
  ],
  modulesConfig: {} as Record<string, { enabled?: boolean; hotelOverrides?: Record<string, boolean>; config?: Record<string, any> }>,
  customPlugins: [] as any[],
};

async function loadDb() {
  if (!firestoreDb) return;
  try {
    const docSpan = await getDoc(doc(firestoreDb, "system", "details"));
    if (docSpan.exists()) {
      const data = docSpan.data();
      db.settings = data.settings || db.settings;
      db.hotels = data.hotels || db.hotels;
      db.templates = data.templates || db.templates;
      db.devices = data.devices || db.devices;
      db.logs = data.logs || db.logs;
      db.modulesConfig = data.modulesConfig || db.modulesConfig || {};
      db.customPlugins = data.customPlugins || db.customPlugins || [];
    }
  } catch (e) { console.error("Firebase load err", e) }
}

async function saveDb() {
  if (!firestoreDb) return;
  try {
    await setDoc(doc(firestoreDb, "system", "details"), {
      settings: db.settings,
      hotels: db.hotels,
      templates: db.templates,
      devices: db.devices,
      logs: db.logs,
      modulesConfig: db.modulesConfig,
      customPlugins: db.customPlugins
    });
  } catch (e) { console.error("Firebase save err", e) }
}

async function startServer() {
  await loadDb();

  const app = express();
  const PORT = 3000;
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: { origin: "*" },
  });

  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  // Trust proxy for IP
  app.set('trust proxy', true);

  // API Routes
  app.get("/api/flights", async (req, res) => {
    const airport = (req.query.airport as string || 'pafos').toLowerCase();
    const type = (req.query.type as string || 'departures').toLowerCase() as 'departures' | 'arrivals';
    
    const iataMap: Record<string, string> = {
      pafos: 'PFO',
      larnaca: 'LCA'
    };
    const iata = iataMap[airport] || 'PFO';
    const isDep = type === 'departures';

    // Helper to clean airport names into pristine city names with IATA
    function cleanAirportName(name: string): string {
      if (!name) return 'Unknown';
      let cleaned = name
        .replace(/\s*(International|National|Regional|Municipal)\s*/gi, ' ')
        .replace(/\s*Airport\s*/gi, '')
        .replace(/\s*\"[^\"]*\"\s*/g, '')
        .replace(/\s+/g, ' ')
        .trim();
      
      const shortMap: Record<string, string> = {
        'Eleftherios Venizelos': 'Athens',
        'Franz Josef Strauss': 'Munich',
        'Charles de Gaulle': 'Paris (CDG)',
        'Ben Gurion': 'Tel Aviv',
        'Leonardo da Vinci': 'Rome',
        'Gatwick': 'London (LGW)',
        'Heathrow': 'London (LHR)',
        'Stansted': 'London (STN)',
        'Luton': 'London (LTN)',
        'Manchester': 'Manchester',
        'Vienna': 'Vienna',
        'Beirut': 'Beirut',
        'Doha': 'Doha',
        'Budapest': 'Budapest',
        'Moscow': 'Moscow',
        'Heraklion': 'Heraklion',
        'Thessaloniki': 'Thessaloniki',
        'Frankfurt': 'Frankfurt',
        'Brussels': 'Brussels',
        'Amsterdam': 'Amsterdam'
      };

      for (const [key, val] of Object.entries(shortMap)) {
        if (cleaned.toLowerCase().includes(key.toLowerCase())) {
          return val;
        }
      }
      return cleaned;
    }

    const aviationKey = (process.env.AVIATIONSTACK_API_KEY || '').replace(/['"]/g, '').trim();
    const airlabsKey = (process.env.AIRLABS_API_KEY || '').replace(/['"]/g, '').trim();

    // 1. Check for Aviationstack API Key
    if (aviationKey) {
      try {
        console.log(`[Flights API] Fetching from Aviationstack for ${iata} (${type})...`);
        const queryParam = isDep ? `dep_iata=${iata}` : `arr_iata=${iata}`;
        const response = await fetch(`http://api.aviationstack.com/v1/flights?access_key=${aviationKey}&${queryParam}&limit=25`);
        
        if (response.ok) {
          const json = await response.json();
          if (json && json.data && Array.isArray(json.data)) {
            const flights = json.data.map((item: any, index: number) => {
              const flightNo = item.flight?.iata || `${item.airline?.iata || ''} ${item.flight?.number || ''}`.trim() || 'N/A';
              const airline = item.airline?.name || 'Unknown Airline';
              
              let time = 'N/A';
              try {
                const dateStr = isDep ? item.departure?.scheduled : item.arrival?.scheduled;
                if (dateStr) {
                  const date = new Date(dateStr);
                  // Dynamic timezone adjustment to the airport's local timezone (Europe/Nicosia)
                  time = date.toLocaleTimeString('en-GB', {
                    timeZone: 'Europe/Nicosia',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false
                  });
                }
              } catch (e) {}

              const destName = cleanAirportName(item.arrival?.airport || 'Unknown');
              const destIata = item.arrival?.iata || '';
              const destination = isDep ? (destIata ? `${destName} (${destIata})` : destName) : undefined;

              const origName = cleanAirportName(item.departure?.airport || 'Unknown');
              const origIata = item.departure?.iata || '';
              const origin = !isDep ? (origIata ? `${origName} (${origIata})` : origName) : undefined;
              
              const delay = isDep ? item.departure?.delay : item.arrival?.delay;
              let status = 'Scheduled';
              const rawStatus = (item.flight_status || '').toLowerCase();
              if (rawStatus === 'active') {
                status = delay ? 'Delayed' : 'On Time';
              } else if (rawStatus === 'landed') {
                status = 'Landed';
              } else if (rawStatus === 'cancelled') {
                status = 'Cancelled';
              } else if (rawStatus === 'scheduled') {
                status = delay ? 'Delayed' : 'Scheduled';
              } else if (rawStatus === 'incident' || rawStatus === 'diverted') {
                status = 'Diverted';
              }
              
              const gate = isDep ? item.departure?.gate : item.arrival?.gate;

              return {
                id: `avs-${index}-${Date.now()}`,
                flightNo,
                airline,
                destination,
                origin,
                time,
                status,
                gate: gate || undefined,
                info: !isDep && rawStatus === 'landed' ? 'Landed' : undefined,
                type
              };
            });
            
            // Chronological sorting
            flights.sort((a, b) => a.time.localeCompare(b.time));

            return res.json({
              success: true,
              isRealTime: true,
              provider: 'Aviationstack',
              flights
            });
          } else if (json && json.error) {
            console.error(`[Flights API] Aviationstack API returned error:`, json.error);
          }
        }
        console.warn(`[Flights API] Aviationstack response not OK or empty data. Status: ${response.status}`);
      } catch (e: any) {
        console.error("[Flights API] Aviationstack error:", e.message || e);
      }
    }

    // 2. Check for AirLabs API Key
    if (airlabsKey) {
      try {
        console.log(`[Flights API] Fetching from AirLabs for ${iata} (${type})...`);
        const queryParam = isDep ? `dep_iata=${iata}` : `arr_iata=${iata}`;
        const response = await fetch(`https://airlabs.co/api/v9/schedules?${queryParam}&api_key=${airlabsKey}`);
        
        if (response.ok) {
          const json = await response.json();
          if (json && json.response && Array.isArray(json.response)) {
            const flights = json.response.slice(0, 25).map((item: any, index: number) => {
              const flightNo = item.flight_iata || item.flight_num || 'N/A';
              const airline = item.airline_name || 'Unknown Airline';
              
              let time = isDep ? item.dep_time : item.arr_time;
              if (time && (time.includes('T') || time.includes('-'))) {
                try {
                  const date = new Date(time);
                  // Dynamic timezone adjustment to the airport's local timezone (Europe/Nicosia)
                  time = date.toLocaleTimeString('en-GB', {
                    timeZone: 'Europe/Nicosia',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false
                  });
                } catch (e) {}
              } else if (time && time.length > 5) {
                time = time.substring(0, 5);
              }

              const destName = cleanAirportName(item.arr_name || 'Unknown');
              const destIata = item.arr_iata || '';
              const destination = isDep ? (destIata ? `${destName} (${destIata})` : destName) : undefined;

              const origName = cleanAirportName(item.dep_name || 'Unknown');
              const origIata = item.dep_iata || '';
              const origin = !isDep ? (origIata ? `${origName} (${origIata})` : origName) : undefined;

              let status = 'Scheduled';
              const rawStatus = (item.status || '').toLowerCase();
              if (rawStatus === 'en-route' || rawStatus === 'active') status = 'On Time';
              else if (rawStatus === 'landed') status = 'Landed';
              else if (rawStatus === 'cancelled') status = 'Cancelled';
              else if (rawStatus === 'delayed') status = 'Delayed';
              else if (rawStatus === 'scheduled') status = 'Scheduled';

              const gate = isDep ? item.dep_gate : item.arr_gate;

              return {
                id: `arl-${index}-${Date.now()}`,
                flightNo,
                airline,
                destination,
                origin,
                time: time || 'N/A',
                status,
                gate: gate || undefined,
                info: !isDep && rawStatus === 'landed' ? 'Landed' : undefined,
                type
              };
            });

            // Chronological sorting
            flights.sort((a, b) => a.time.localeCompare(b.time));

            return res.json({
              success: true,
              isRealTime: true,
              provider: 'AirLabs',
              flights
            });
          } else if (json && json.error) {
            console.error(`[Flights API] AirLabs API returned error:`, json.error);
          }
        }
        console.warn(`[Flights API] AirLabs response not OK or empty data. Status: ${response.status}`);
      } catch (e: any) {
        console.error("[Flights API] AirLabs error:", e.message || e);
      }
    }

    // 3. High-Fidelity Local Simulation Fallback (Guarantees elegant kiosk experience out-of-the-box)
    const mockAirlines = ['Ryanair', 'EasyJet', 'British Airways', 'Cyprus Airways', 'Aegean Airlines', 'Wizz Air', 'Austrian Airlines', 'Lufthansa', 'Qatar Airways'];
    const mockCities = isDep 
      ? ['London (LGW)', 'Athens (ATH)', 'Rome (FCO)', 'Vienna (VIE)', 'Tel Aviv (TLV)', 'Manchester (MAN)', 'Doha (DOH)', 'Munich (MUC)', 'Beirut (BEY)', 'Budapest (BUD)']
      : ['London (LGW)', 'Athens (ATH)', 'Rome (FCO)', 'Vienna (VIE)', 'Tel Aviv (TLV)', 'Manchester (MAN)', 'Doha (DOH)', 'Munich (MUC)', 'Heraklion (HER)'];

    const now = new Date();
    const flightsList = [];

    for (let i = 0; i < 7; i++) {
      // Generate times centered around the current time for realistic kiosk experience
      const flightTime = new Date(now.getTime() + (i - 2) * 45 * 60 * 1000);
      const timeStr = flightTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
      
      const airline = mockAirlines[(i * 3 + airport.length) % mockAirlines.length];
      const carrierCode = airline.substring(0, 2).toUpperCase();
      const flightNo = `${carrierCode} ${100 + ((i * 87) % 900)}`;
      
      const city = mockCities[(i * 7 + airport.length) % mockCities.length];
      
      let status = 'Scheduled';
      const diffMinutes = (flightTime.getTime() - now.getTime()) / (60 * 1000);
      
      if (diffMinutes < -15) {
        status = isDep ? 'Gate Closed' : 'Landed';
      } else if (diffMinutes >= -15 && diffMinutes <= 15) {
        status = isDep ? 'Boarding' : 'Landed';
      } else if (diffMinutes > 15 && diffMinutes <= 60) {
        status = 'On Time';
      } else if (i % 5 === 0) {
        status = 'Delayed';
      }

      const gate = isDep ? String(((i * 7) % 15) + 1).padStart(2, '0') : undefined;

      flightsList.push({
        id: `sim-${airport}-${type}-${i}-${Date.now()}`,
        flightNo,
        airline,
        destination: isDep ? city : undefined,
        origin: !isDep ? city : undefined,
        time: timeStr,
        status,
        gate,
        info: !isDep && status === 'Landed' ? `Landed ${timeStr}` : undefined,
        type
      });
    }

    // Sort flights by time chronologically
    flightsList.sort((a, b) => a.time.localeCompare(b.time));

    res.json({
      success: true,
      isRealTime: false,
      provider: 'Simulation',
      flights: flightsList
    });
  });

  // API Routes
  app.get("/api/config", async (req, res) => {
    await loadDb();
    let clientIp = req.ip || req.socket.remoteAddress || "unknown";
    if (req.headers['x-forwarded-for']) {
      const xff = req.headers['x-forwarded-for'];
      clientIp = Array.isArray(xff) ? xff[0] : xff.split(',')[0].trim();
    }
    const userAgent = req.headers["user-agent"] || "";
    let isMobileDevice = /mobile|tablet|ip(ad|hone|od)|android/i.test(userAgent);

    const isWhitelisted = clientIp === "::1" || clientIp === "127.0.0.1" || !db.settings.ipWhitelistEnabled || db.settings.whitelistedIps.includes(clientIp);

    if (!isWhitelisted) {
      if (db.settings.generalConfig.enableMobileApp) {
        // Force mobile version if IP is not whitelisted but mobile app is enabled
        isMobileDevice = true;
      } else {
        return res.status(403).json({ error: "Access Denied by IP Whitelist" });
      }
    }

    let device = db.devices.find(d => d.ip === clientIp);
    if (!device) {
      device = {
        id: "dev_" + Math.random().toString(36).substring(2, 9),
        ip: clientIp,
        name: (isMobileDevice ? "Mobile Guest (" : "Kiosk Screen (") + clientIp + ")",
        status: "online",
        lastSeen: Date.now(),
        // @ts-ignore
        isMobile: isMobileDevice
      };
      db.devices.push(device);
      saveDb().catch(() => {});
    } else {
      device.status = "online";
      device.lastSeen = Date.now();
      // @ts-ignore
      if (isMobileDevice) device.isMobile = true;
    }

    res.json({
      settings: db.settings.generalConfig,
      hotels: db.hotels,
      templates: db.templates,
      myIp: clientIp,
      assignedHotelId: device?.assignedHotelId || null,
      isMobileDevice,
      isWhitelisted,
      modulesConfig: db.modulesConfig,
      customPlugins: db.customPlugins
    });
  });

  app.get("/api/admin/data-size", (req, res) => {
    let sizeInfo = {};
    for (const key of Object.keys(db)) {
       sizeInfo[key] = JSON.stringify(db[key]).length;
    }
    res.json(sizeInfo);
  });
  app.get("/api/admin/data", async (req, res) => {
    await loadDb();
    let clientIp = req.ip || req.socket.remoteAddress || "unknown";
    if (req.headers['x-forwarded-for']) {
        const xff = req.headers['x-forwarded-for'];
        clientIp = Array.isArray(xff) ? xff[0] : xff.split(',')[0].trim();
    }
    const myDevice = db.devices.find((d) => d.ip === clientIp || d.ip.includes(clientIp) || clientIp.includes(d.ip));
    res.json({
      settings: db.settings,
      devices: db.devices,
      logs: db.logs,
      hotels: db.hotels,
      templates: db.templates,
      modulesConfig: db.modulesConfig,
      customPlugins: db.customPlugins,
      myDevice: myDevice || null
    });
  });

  // Module Management Endpoints
  app.get("/api/admin/modules", async (req, res) => {
    await loadDb();
    res.json({
      modulesConfig: db.modulesConfig,
      customPlugins: db.customPlugins
    });
  });

  app.post("/api/admin/modules/toggle", async (req, res) => {
    const { moduleId, hotelId, enabled } = req.body;
    if (!moduleId) return res.status(400).json({ error: "Missing moduleId" });

    if (!db.modulesConfig[moduleId]) {
      db.modulesConfig[moduleId] = { enabled: true, hotelOverrides: {}, config: {} };
    }

    if (hotelId) {
      if (!db.modulesConfig[moduleId].hotelOverrides) {
        db.modulesConfig[moduleId].hotelOverrides = {};
      }
      db.modulesConfig[moduleId].hotelOverrides![hotelId] = !!enabled;
    } else {
      db.modulesConfig[moduleId].enabled = !!enabled;
    }

    db.logs.unshift({
      timestamp: Date.now(),
      type: "info",
      message: `Module "${moduleId}" ${hotelId ? `(hotel: ${hotelId})` : "globally"} set to ${enabled ? "ACTIVE" : "INACTIVE"}`
    });

    await saveDb();
    io.emit("updateModules", { modulesConfig: db.modulesConfig, customPlugins: db.customPlugins });
    io.emit("updateConfig", { settings: db.settings.generalConfig, hotels: db.hotels, modulesConfig: db.modulesConfig });
    res.json({ success: true, modulesConfig: db.modulesConfig });
  });

  app.post("/api/admin/modules/config", async (req, res) => {
    const { moduleId, config } = req.body;
    if (!moduleId || !config) return res.status(400).json({ error: "Missing moduleId or config" });

    if (!db.modulesConfig[moduleId]) {
      db.modulesConfig[moduleId] = { enabled: true, hotelOverrides: {}, config: {} };
    }
    db.modulesConfig[moduleId].config = {
      ...(db.modulesConfig[moduleId].config || {}),
      ...config
    };

    await saveDb();
    io.emit("updateModules", { modulesConfig: db.modulesConfig, customPlugins: db.customPlugins });
    res.json({ success: true, modulesConfig: db.modulesConfig });
  });

  app.post("/api/admin/modules/custom", async (req, res) => {
    const { plugin } = req.body;
    if (!plugin || !plugin.id) return res.status(400).json({ error: "Invalid plugin manifest" });

    // Remove existing if duplicate ID
    db.customPlugins = (db.customPlugins || []).filter((p: any) => p.id !== plugin.id);
    db.customPlugins.push(plugin);

    db.logs.unshift({
      timestamp: Date.now(),
      type: "info",
      message: `Dynamic custom plugin registered: "${plugin.name}" (${plugin.id})`
    });

    await saveDb();
    io.emit("updateModules", { modulesConfig: db.modulesConfig, customPlugins: db.customPlugins });
    res.json({ success: true, customPlugins: db.customPlugins });
  });

  app.delete("/api/admin/modules/custom/:id", async (req, res) => {
    const { id } = req.params;
    db.customPlugins = (db.customPlugins || []).filter((p: any) => p.id !== id);
    if (db.modulesConfig[id]) {
      delete db.modulesConfig[id];
    }

    db.logs.unshift({
      timestamp: Date.now(),
      type: "info",
      message: `Dynamic custom plugin removed: (${id})`
    });

    await saveDb();
    io.emit("updateModules", { modulesConfig: db.modulesConfig, customPlugins: db.customPlugins });
    res.json({ success: true, customPlugins: db.customPlugins });
  });

  app.post("/api/admin/settings/whitelist", async (req, res) => {
    const { enabled, ips } = req.body;
    if (typeof enabled === 'boolean') db.settings.ipWhitelistEnabled = enabled;
    if (Array.isArray(ips)) db.settings.whitelistedIps = ips;
    await saveDb();
    io.emit("updateConfig", { settings: db.settings.generalConfig, hotels: db.hotels });
    res.json({ success: true, settings: db.settings });
  });

  app.post("/api/admin/settings/general", async (req, res) => {
    const { enableHotelSelector, enableMobileApp, disableMobileIpFiltering } = req.body;
    if (typeof enableHotelSelector === 'boolean') {
      db.settings.generalConfig.enableHotelSelector = enableHotelSelector;
    }
    await saveDb();
    io.emit("updateConfig", { settings: db.settings.generalConfig, hotels: db.hotels });
    res.json({ success: true, settings: db.settings });
  });

  // Serve static public folder specifically for uploads if needed when built
  app.use(express.static('public'));

  app.post("/api/admin/upload", (req, res, next) => {
    upload.single('image')(req, res, async (err) => {
      if (err) {
        console.error("Multer error on single upload:", err);
        return res.status(500).json({ error: "Upload failed: " + err.message });
      }
      if (!req.file) return res.status(400).json({ error: "No file uploaded" });
      
      try {
        if (firestoreDb) {
          const fileData = fs.readFileSync(req.file.path);
          const base64 = fileData.toString('base64');
          const id = `upl_${Date.now()}_${Math.round(Math.random() * 1E9)}`;
          await setDoc(doc(firestoreDb, "uploads", id), {
            base64,
            mimeType: req.file.mimetype || 'image/jpeg',
            createdAt: Date.now()
          });
          // Also delete the local file to save space
          fs.unlinkSync(req.file.path);
          res.json({ success: true, url: `/api/uploads/${id}` });
        } else {
          // Fallback if no firestore
          const fileUrl = `/${req.file.filename}`;
          res.json({ success: true, url: fileUrl });
        }
      } catch (uploadErr: any) {
        console.error("Firestore upload error:", uploadErr);
        res.status(500).json({ error: "Failed to save to database" });
      }
    });
  });

  app.post("/api/admin/parse-schedule-image", upload.single("image"), async (req, res) => {
    try {
      if (!ai) return res.status(500).json({ error: "Gemini AI not configured" });
      if (!req.file) return res.status(400).json({ error: "No image uploaded" });
      
      const fileData = fs.readFileSync(req.file.path);
      const base64Data = fileData.toString("base64");
      
      const generateConfig = {
        contents: [
          {
            inlineData: {
              mimeType: req.file.mimetype || 'image/jpeg',
              data: base64Data,
            }
          },
          "Extract the daily schedule from this image. Output a JSON array containing the days, where each day has a date (YYYY-MM-DD), title, description, and an array of events (with startTime, endTime, title, description, and a Lucide icon name like Coffee, User, Moon, Activity, Utensils). Do not wrap in markdown tags."
        ],
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                date: { type: Type.STRING },
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                events: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      startTime: { type: Type.STRING },
                      endTime: { type: Type.STRING },
                      icon: { type: Type.STRING },
                      title: { type: Type.STRING },
                      description: { type: Type.STRING }
                    }
                  }
                }
              }
            }
          }
        }
      };

      let response;
      try {
        response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          ...generateConfig
        });
      } catch (firstErr: any) {
        if (firstErr.status === 429 || firstErr.status === 404 || firstErr.status === "RESOURCE_EXHAUSTED" || firstErr.status === "NOT_FOUND" || firstErr.message?.includes('429') || firstErr.message?.includes('404')) {
          console.warn("gemini-2.5-flash failed (quota or not found), falling back to gemini-2.0-flash...");
          try {
            response = await ai.models.generateContent({
              model: "gemini-2.0-flash",
              ...generateConfig
            });
          } catch (secondErr: any) {
            console.error("Fallback to gemini-2.0-flash also failed:", secondErr);
            throw new Error("AI Quota Exceeded or Models Not Found. Please try again later or upgrade your plan.");
          }
        } else {
          throw firstErr;
        }
      }
      
      const output = JSON.parse(response.text || "[]");
      
      // Cleanup the temp file if needed
      fs.unlinkSync(req.file.path);
      
      res.json({ success: true, program: output });
    } catch (e: any) {
      console.error(e);
      res.status(500).json({ error: e.message || "Failed to parse schedule" });
    }
  });

  app.post("/api/admin/uploads", (req, res, next) => {
    upload.array('images', 20)(req, res, async (err) => {
      if (err) {
        console.error("Multer error on multiple upload:", err);
        return res.status(500).json({ error: "Upload failed: " + err.message });
      }
      if (!req.files || !Array.isArray(req.files)) return res.status(400).json({ error: "No files uploaded" });
      
      try {
        if (firestoreDb) {
          const urls = [];
          for (const file of req.files) {
            const fileData = fs.readFileSync(file.path);
            const base64 = fileData.toString('base64');
            const id = `upl_${Date.now()}_${Math.round(Math.random() * 1E9)}`;
            await setDoc(doc(firestoreDb, "uploads", id), {
              base64,
              mimeType: file.mimetype || 'image/jpeg',
              createdAt: Date.now()
            });
            fs.unlinkSync(file.path);
            urls.push(`/api/uploads/${id}`);
          }
          res.json({ success: true, urls });
        } else {
          const urls = req.files.map((f: Express.Multer.File) => `/${f.filename}`);
          res.json({ success: true, urls });
        }
      } catch (uploadErr: any) {
        console.error("Firestore multi-upload error:", uploadErr);
        res.status(500).json({ error: "Failed to save to database" });
      }
    });
  });

  app.get("/api/uploads/:id", async (req, res) => {
    if (!firestoreDb) return res.status(404).send("Not found");
    try {
      const docRef = doc(firestoreDb, "uploads", req.params.id);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) return res.status(404).send("Not found");
      const data = docSnap.data();
      const buffer = Buffer.from(data.base64, 'base64');
      res.setHeader('Content-Type', data.mimeType || 'image/jpeg');
      res.setHeader('Cache-Control', 'public, max-age=31536000');
      res.send(buffer);
    } catch (e) {
      res.status(500).send("Error");
    }
  });

  app.post("/api/admin/hotels/:id/daily-program", async (req, res) => {
    const hotelId = req.params.id;
    const { dailyProgram, dailyProgramCategories } = req.body;
    const hotel = db.hotels.find((h: any) => h.id === hotelId);
    if (hotel) {
      if (dailyProgram !== undefined) hotel.content.dailyProgram = dailyProgram;
      if (dailyProgramCategories !== undefined) hotel.content.dailyProgramCategories = dailyProgramCategories;
    await saveDb();
      io.emit("updateConfig", { settings: db.settings.generalConfig, hotels: db.hotels });
      res.json({ success: true, hotel });
    } else {
      res.status(404).json({ error: "Hotel not found" });
    }
  });

  app.post("/api/admin/hotels", async (req, res) => {
    db.hotels = req.body.hotels;
    await saveDb();
    io.emit("updateConfig", { settings: db.settings.generalConfig, hotels: db.hotels });
    res.json({ success: true, hotels: db.hotels });
  });
  
  app.post("/api/admin/device/rename", async (req, res) => {
    const { id, name } = req.body;
    const device = db.devices.find(d => d.id === id);
    if(device) {
       device.name = name;
    await saveDb();
    io.emit("updateConfig", { settings: db.settings.generalConfig, hotels: db.hotels });
    }
    res.json({ success: true, devices: db.devices });
  });

  app.post("/api/admin/device/assign", async (req, res) => {
    const { id, hotelId } = req.body;
    const device = db.devices.find(d => d.id === id);
    if(device) {
       device.assignedHotelId = hotelId;
    await saveDb();
    io.emit("updateConfig", { settings: db.settings.generalConfig, hotels: db.hotels });
    }
    res.json({ success: true, devices: db.devices });
  });

  app.post("/api/admin/push", async (req, res) => {
    io.emit("updateConfig", { settings: db.settings.generalConfig, hotels: db.hotels });
    db.logs.unshift({ timestamp: Date.now(), type: "info", message: "Push Updates emitted to all devices." });
    await saveDb();
    io.emit("updateConfig", { settings: db.settings.generalConfig, hotels: db.hotels });
    res.json({ success: true });
  });

  app.post("/api/admin/clear-cache", async (req, res) => {
    const { targetId } = req.body;
    if (targetId) {
      io.to(targetId).emit("clearCacheCommand");
      db.logs.unshift({ timestamp: Date.now(), type: "info", message: "Clear Cache command sent to device ID " + targetId });
    } else {
      io.emit("clearCacheCommand");
      db.logs.unshift({ timestamp: Date.now(), type: "info", message: "Clear Cache command emitted to all devices." });
    }
    await saveDb();
    io.emit("updateConfig", { settings: db.settings.generalConfig, hotels: db.hotels });
    res.json({ success: true });
  });

  app.post("/api/admin/lock", async (req, res) => {
    const { targetId } = req.body;
    if (targetId) {
      io.to(targetId).emit("lockCommand");
      db.logs.unshift({ timestamp: Date.now(), type: "warn", message: "Lock command sent to device ID " + targetId });
    } else {
      io.emit("lockCommand");
      db.logs.unshift({ timestamp: Date.now(), type: "warn", message: "Global lock command sent." });
    }
    await saveDb();
    res.json({ success: true });
  });

  app.post("/api/admin/templates", async (req, res) => {
    if (req.body.templates) {
      db.templates = req.body.templates;
    await saveDb();
    io.emit("updateConfig", { settings: db.settings.generalConfig, hotels: db.hotels });
    }
    res.json({ success: true, templates: db.templates });
  });

  app.post("/api/admin/reboot", async (req, res) => {
    const { targetId } = req.body; 
    if (targetId) {
       io.to(targetId).emit("rebootCommand");
       db.logs.unshift({ timestamp: Date.now(), type: "warn", message: "Remote reboot sent to device ID " + targetId });
    } else {
       io.emit("rebootCommand");
       db.logs.unshift({ timestamp: Date.now(), type: "warn", message: "Global remote reboot sent." });
    }
    await saveDb();
    io.emit("updateConfig", { settings: db.settings.generalConfig, hotels: db.hotels });
    res.json({ success: true });
  });

  // Socket.io for Real-time device tracking
  io.on("connection", (socket) => {
    let clientIp = socket.handshake.headers['x-forwarded-for'] || socket.handshake.address;
    if(Array.isArray(clientIp)) clientIp = clientIp[0];
    const userAgent = (socket.handshake.headers['user-agent'] || '') as string;
    const isMobile = /mobile|tablet|ip(ad|hone|od)|android/i.test(userAgent);
    
    const existingDevice = db.devices.find(d => d.ip === clientIp || d.id === socket.id);
    if (!existingDevice) {
       db.devices.push({
         id: socket.id,
         ip: clientIp as string,
         name: (isMobile ? "Mobile Device (" : "Kiosk (") + clientIp + ")",
         status: "online",
         lastSeen: Date.now(),
         // @ts-ignore
         isMobile: isMobile
       });
    } else {
      existingDevice.id = socket.id; // Update connection ID
      existingDevice.status = "online";
      existingDevice.lastSeen = Date.now();
      // @ts-ignore
      if (isMobile) existingDevice.isMobile = true;
    }
    
    socket.on("errorLog", (data) => {
       db.logs.unshift({ timestamp: Date.now(), type: "error", message: "[Device: " + clientIp + "] " + data.message });
    });

    socket.on("disconnect", () => {
      const dev = db.devices.find(d => d.id === socket.id);
      if(dev) dev.status = "offline";
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log("Server running on http://localhost:" + PORT);
  });
}

startServer();
