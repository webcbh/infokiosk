const fs = require('fs');
let code = fs.readFileSync('src/components/RestaurantsGridLayout.tsx', 'utf8');

// Insert Action Button rendering
code = code.replace(
    /<\/motion\.div>\s*\);\s*\}/s,
    `
        {/* Dynamic Action Button */}
        {module.button?.label && (
          <div className="mt-8">
            <div 
              className="bg-[#0F203C] rounded-lg p-5 flex justify-between items-center text-white cursor-pointer hover:bg-[#1a365d] transition-colors shadow-md"
              onClick={() => {
                if (module.button.moduleId) {
                   // how to link to a module? we don't have openModule here. we might need to use a custom event or window location.
                   // Actually we can dispatch a custom event.
                   window.dispatchEvent(new CustomEvent('openModule', { detail: module.button.moduleId }));
                } else if (module.button.url) {
                   window.open(module.button.url, '_blank');
                }
              }}
            >
               <div className="flex items-center gap-4">
                 <span className="font-sans font-bold text-sm tracking-wider uppercase">{module.button.label}</span>
               </div>
               <ChevronRight size={20} className="text-[#C09F64]"/>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
`
);

fs.writeFileSync('src/components/RestaurantsGridLayout.tsx', code);
