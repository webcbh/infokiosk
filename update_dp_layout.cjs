const fs = require('fs');
const content = fs.readFileSync('src/components/DailyProgramLayout.tsx', 'utf8');
console.log(content.substring(0, 1500));
