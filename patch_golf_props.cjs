const fs = require('fs');
let code = fs.readFileSync('src/components/GolfLayout.tsx', 'utf8');

code = code.replace(/onClose/g, 'onBack');

fs.writeFileSync('src/components/GolfLayout.tsx', code);
