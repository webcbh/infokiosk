const fs = require('fs');
let code = fs.readFileSync('src/components/GolfDetailsLayout.tsx', 'utf8');

// Add break-words to main container
code = code.replace(
  /<div className="min-h-screen bg-\[#F8F9FA\] text-\[#0A1B3F\] font-sans w-full">/,
  `<div className="min-h-screen bg-[#F8F9FA] text-[#0A1B3F] font-sans w-full overflow-x-hidden break-words">`
);

// Top header title
code = code.replace(
  /<h1 className="text-lg font-semibold tracking-wide uppercase">/,
  `<h1 className="text-lg font-semibold tracking-wide uppercase break-words flex-1">`
);

// Main title container
code = code.replace(
  /<div className="w-full lg:w-\[55%\] flex flex-col justify-center">/,
  `<div className="w-full lg:w-[55%] flex flex-col justify-center min-w-0">`
);

// Main title text
code = code.replace(
  /<h2 className="text-4xl font-bold text-\[#0A1B3F\]">\{module.title\}<\/h2>/,
  `<h2 className="text-4xl font-bold text-[#0A1B3F] break-words flex-1 min-w-0">{module.title}</h2>`
);

// Add min-w-0 and flex-1 to all grid text containers
code = code.replace(
  /<div>\s*<p className="text-xs font-bold text-\[#0A1B3F\] tracking-widest uppercase mb-1">/g,
  `<div className="min-w-0 flex-1">\n                <p className="text-xs font-bold text-[#0A1B3F] tracking-widest uppercase mb-1 break-words">`
);

code = code.replace(
  /<p className="text-4xl font-semibold text-\[#0A1B3F\]">/g,
  `<p className="text-4xl font-semibold text-[#0A1B3F] break-words">`
);

code = code.replace(
  /<p className="text-xl font-semibold text-\[#0A1B3F\]">/g,
  `<p className="text-xl font-semibold text-[#0A1B3F] break-words">`
);

// Contact Banner
code = code.replace(
  /<div>\s*<h3 className="text-lg font-bold uppercase mb-1">/g,
  `<div className="min-w-0 flex-1">\n              <h3 className="text-lg font-bold uppercase mb-1 break-words">`
);

code = code.replace(
  /<p className="text-white\/80 max-w-md">/g,
  `<p className="text-white/80 max-w-md break-words">`
);

fs.writeFileSync('src/components/GolfDetailsLayout.tsx', code);
