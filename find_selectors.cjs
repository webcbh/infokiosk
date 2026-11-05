const fs = require('fs');
const code = fs.readFileSync('src/App.tsx', 'utf8');
const mobileCode = fs.readFileSync('src/MobileAppView.tsx', 'utf8');
console.log("Files read successfully.");
// I will just use regular expression to extract the tree if I can't run it.
