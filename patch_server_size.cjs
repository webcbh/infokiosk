const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

code = code.replace(
  '  app.get("/api/admin/data", async (req, res) => {',
  `  app.get("/api/admin/data-size", (req, res) => {
    let sizeInfo = {};
    for (const key of Object.keys(db)) {
       sizeInfo[key] = JSON.stringify(db[key]).length;
    }
    res.json(sizeInfo);
  });
  app.get("/api/admin/data", async (req, res) => {`
);

fs.writeFileSync('server.ts', code);
