const fs = require('fs');
let code = fs.readFileSync('src/AdminDashboard.tsx', 'utf8');

code = code.replace(
  /{editingSubmodule\.sub\.layout !== 'restaurant' && \(/g,
  `{editingSubmodule.sub.layout !== 'restaurant' && editingSubmodule.sub.layout !== 'golfDetails' && (`
);

fs.writeFileSync('src/AdminDashboard.tsx', code);
