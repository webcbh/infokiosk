const fs = require('fs');
let content = fs.readFileSync('src/components/TemplateSelector.tsx', 'utf8');

content = content.replace(
  /case 'grid':[\s\S]*?case 'list':/,
  `case 'grid':
      return (
        <div className="flex flex-wrap gap-1.5 p-2 w-full h-full items-center justify-center bg-blue-50/50">
           <div className="w-[45%] h-[40%] bg-blue-400 rounded shadow-sm flex items-center justify-center"><span className="text-[8px] text-white font-bold">GRID</span></div>
           <div className="w-[45%] h-[40%] bg-blue-400 rounded shadow-sm flex items-center justify-center"><span className="text-[8px] text-white font-bold">GRID</span></div>
           <div className="w-[45%] h-[40%] bg-blue-400 rounded shadow-sm flex items-center justify-center"><span className="text-[8px] text-white font-bold">GRID</span></div>
           <div className="w-[45%] h-[40%] bg-blue-400 rounded shadow-sm flex items-center justify-center"><span className="text-[8px] text-white font-bold">GRID</span></div>
        </div>
      );
    case 'list':`
);

content = content.replace(
  /case 'list':\s*case 'directory':[\s\S]*?case 'hero':/,
  `case 'list':
    case 'directory':
      return (
        <div className="flex flex-col gap-1.5 p-2 w-full h-full justify-center bg-emerald-50/50">
           <div className="w-full h-[22%] bg-emerald-400 rounded shadow-sm flex items-center px-2"><span className="text-[8px] text-white font-bold">List Item</span></div>
           <div className="w-full h-[22%] bg-emerald-400 rounded shadow-sm flex items-center px-2"><span className="text-[8px] text-white font-bold">List Item</span></div>
           <div className="w-[85%] h-[22%] bg-emerald-400 rounded shadow-sm flex items-center px-2"><span className="text-[8px] text-white font-bold">List Item</span></div>
        </div>
      );
    case 'hero':`
);

content = content.replace(
  /case 'hero':[\s\S]*?case 'map':/,
  `case 'hero':
      return (
        <div className="flex flex-col gap-1.5 p-2 w-full h-full justify-center bg-purple-50/50">
           <div className="w-full h-[65%] bg-purple-400 rounded shadow-sm flex items-center justify-center"><span className="text-[10px] text-white font-bold">HERO IMAGE</span></div>
           <div className="w-[60%] h-[15%] bg-purple-300 rounded mx-auto flex items-center justify-center"><span className="text-[6px] text-purple-800 font-bold">Subtitle</span></div>
        </div>
      );
    case 'map':`
);

fs.writeFileSync('src/components/TemplateSelector.tsx', content);
