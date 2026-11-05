const fs = require('fs');
let content = fs.readFileSync('src/components/DailyProgramLayout.tsx', 'utf8');
content = content.replace(
  'const dailyProgram = currentHotel?.content?.dailyProgram || [];',
  `const dailyProgram = currentHotel?.content?.dailyProgram || [];
  console.log("DailyProgramLayout: currentHotel dailyProgram=", dailyProgram);`
);
fs.writeFileSync('src/components/DailyProgramLayout.tsx', content);
