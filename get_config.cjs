const http = require('http');
http.get('http://localhost:3000/api/config', res => {
  let data = '';
  res.on('data', c => data += c);
  res.on('end', () => {
    let conf = JSON.parse(data);
    let hotel = conf.hotels[0];
    let dirMod = hotel.content.modules.find(m => m.type === 'directory');
    console.log(JSON.stringify(dirMod.directoryConfig, null, 2));
  });
});
