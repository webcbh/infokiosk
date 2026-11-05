const fs = require('fs');
let code = fs.readFileSync('src/components/DailyProgramLayout.tsx', 'utf8');

const targetReturn = `  return (
    <div className="w-full h-full bg-[#fcfcfc] font-sans text-neutral-800 overflow-y-auto">`;

const replacementReturn = `  return (
    <>
    <div className="w-full h-full bg-[#fcfcfc] font-sans text-neutral-800 overflow-y-auto">`;

code = code.replace(targetReturn, replacementReturn);

const targetEnd = `        )}
      </AnimatePresence>
  );
}`;

const replacementEnd = `        )}
      </AnimatePresence>
    </>
  );
}`;

code = code.replace(targetEnd, replacementEnd);
fs.writeFileSync('src/components/DailyProgramLayout.tsx', code);
