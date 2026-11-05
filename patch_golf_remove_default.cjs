const fs = require('fs');
let code = fs.readFileSync('src/components/GolfLayout.tsx', 'utf8');

const targetCourses = `            const displayCourses = module.submodules && module.submodules.length > 0 
              ? module.submodules 
              : defaultCourses;`;

const replacementCourses = `            const displayCourses = module.submodules || [];`;

code = code.replace(targetCourses, replacementCourses);
fs.writeFileSync('src/components/GolfLayout.tsx', code);
