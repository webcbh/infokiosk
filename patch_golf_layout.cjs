const fs = require('fs');
let code = fs.readFileSync('src/components/GolfLayout.tsx', 'utf8');

const targetOpen = `onClick={() => onOpenSubmodule(sub, { layout: 'list' })}`;
const replaceOpen = `onClick={() => onOpenSubmodule({ ...sub, layout: sub.layout || 'golfDetails' })}`;
code = code.replace(targetOpen, replaceOpen);

fs.writeFileSync('src/components/GolfLayout.tsx', code);
