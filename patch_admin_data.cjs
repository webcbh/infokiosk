const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const target = `  app.get("/api/admin/data", async (req, res) => {
    await loadDb();
    res.json({
      settings: db.settings,
      devices: db.devices,
      logs: db.logs,
      hotels: db.hotels,
      templates: db.templates,
    });
  });`;

const replacement = `  app.get("/api/admin/data", async (req, res) => {
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
      myDevice: myDevice || null
    });
  });`;

code = code.replace(target, replacement);

fs.writeFileSync('server.ts', code);
