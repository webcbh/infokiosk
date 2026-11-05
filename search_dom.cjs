const { JSDOM } = require('jsdom');
const fs = require('fs');

const html = fs.readFileSync('dist/index.html', 'utf8');

// The react app is rendered dynamically. 
// Let's just grep the components!
