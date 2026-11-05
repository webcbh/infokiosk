const { JSDOM } = require('jsdom');
const fs = require('fs');

const code = fs.readFileSync('src/App.tsx', 'utf8');

// The react code is compiled, let's just grep the actual buttons
console.log("Header Content");
