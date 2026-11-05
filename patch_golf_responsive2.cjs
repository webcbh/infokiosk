const fs = require('fs');
let code = fs.readFileSync('src/components/GolfDetailsLayout.tsx', 'utf8');

code = code.replace(
  /<div className="prose prose-lg text-\[#334155\] prose-p:leading-relaxed">/,
  `<div className="prose prose-lg text-[#334155] prose-p:leading-relaxed break-words max-w-full">`
);

code = code.replace(
  /<ul className="space-y-2">/,
  `<ul className="space-y-2 break-words">`
);

fs.writeFileSync('src/components/GolfDetailsLayout.tsx', code);
