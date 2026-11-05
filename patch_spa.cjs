const fs = require('fs');
let code = fs.readFileSync('src/components/SpaLayout.tsx', 'utf8');

// Insert onClick for SpaLayout booking button
code = code.replace(
    /href=\{spaBooking\.buttonUrl\}\s*className="px-8 py-3 rounded text-sm font-bold tracking-wider transition-opacity hover:opacity-90 whitespace-nowrap"/,
    `href={spaBooking.buttonUrl}
            onClick={(e) => {
              if (module?.button?.moduleId) {
                e.preventDefault();
                window.dispatchEvent(new CustomEvent('openModule', { detail: module.button.moduleId }));
              }
            }}
            className="px-8 py-3 rounded text-sm font-bold tracking-wider transition-opacity hover:opacity-90 whitespace-nowrap"`
);

// If spaBooking.buttonText is rendered, I want it to actually use module.button.label if it exists!
code = code.replace(
    /\{spaBooking\.buttonText\}/,
    `{module?.button?.label || spaBooking.buttonText}`
);

fs.writeFileSync('src/components/SpaLayout.tsx', code);
