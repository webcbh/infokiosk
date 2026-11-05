const fs = require('fs');
let code = fs.readFileSync('src/components/DirectoryOfServicesLayout.tsx', 'utf8');

const replacements = [
  {
    target: '<span className="tracking-wide uppercase text-sm md:text-base">DIRECTORY OF SERVICES</span>',
    replacement: '<span className="tracking-wide uppercase text-sm md:text-base lg:text-lg">DIRECTORY OF SERVICES</span>'
  },
  {
    target: '<h1 className="text-3xl md:text-4xl font-bold mb-2 uppercase tracking-tight" style={{ color: brandBlue }}>',
    replacement: '<h1 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-2 md:mb-4 uppercase tracking-tight" style={{ color: brandBlue }}>'
  },
  {
    target: '<p className="text-base md:text-lg mb-6 leading-relaxed max-w-2xl" style={{ color: brandBlue }}>',
    replacement: '<p className="text-sm md:text-lg lg:text-xl mb-6 leading-relaxed max-w-2xl" style={{ color: brandBlue }}>'
  },
  {
    target: '<h3 className="font-bold text-sm md:text-base uppercase tracking-wider mb-1">HERE TO HELP</h3>',
    replacement: '<h3 className="font-bold text-sm md:text-base lg:text-lg uppercase tracking-wider mb-1">HERE TO HELP</h3>'
  },
  {
    target: '<p className="text-sm md:text-base opacity-90">',
    replacement: '<p className="text-xs md:text-base lg:text-lg opacity-90 leading-relaxed">'
  },
  {
    target: '<h2 className="text-xl md:text-2xl font-bold uppercase tracking-widest" style={{ color: brandBlue }}>',
    replacement: '<h2 className="text-lg md:text-2xl lg:text-3xl font-bold uppercase tracking-widest" style={{ color: brandBlue }}>'
  },
  {
    target: 'className={`font-medium text-sm md:text-base ${item.content ? \'group-hover:opacity-80 transition-opacity\' : \'\'}`}',
    replacement: 'className={`font-medium text-sm md:text-base lg:text-lg ${item.content ? \'group-hover:opacity-80 transition-opacity\' : \'\'}`}'
  },
  {
    target: '<h3 className="text-xl font-bold uppercase tracking-wider" style={{ color: brandBlue }}>',
    replacement: '<h3 className="text-lg md:text-xl lg:text-2xl font-bold uppercase tracking-wider" style={{ color: brandBlue }}>'
  },
  {
    target: '<div className="flex-1 overflow-y-auto px-6 py-6 prose prose-sm sm:prose-base max-w-none" style={{ color: brandBlue }}>',
    replacement: '<div className="flex-1 overflow-y-auto px-6 py-6 prose prose-sm md:prose-base lg:prose-lg max-w-none" style={{ color: brandBlue }}>'
  }
];

replacements.forEach(({ target, replacement }) => {
  if (code.includes(target)) {
    code = code.replace(target, replacement);
  } else {
    console.warn('Target not found:', target);
  }
});

fs.writeFileSync('src/components/DirectoryOfServicesLayout.tsx', code);
