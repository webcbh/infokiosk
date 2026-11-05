const fs = require('fs');
let code = fs.readFileSync('src/components/GeneralInfoLayout.tsx', 'utf8');

// Insert onClick for GeneralInfoLayout footer button
code = code.replace(
    /className="shrink-0 px-8 py-4 rounded-full flex items-center gap-3 text-white font-bold text-sm tracking-wide shadow hover:opacity-90 transition-opacity"/,
    `className="shrink-0 px-8 py-4 rounded-full flex items-center gap-3 text-white font-bold text-sm tracking-wide shadow hover:opacity-90 transition-opacity"
                onClick={() => {
                  if (module?.button?.moduleId) {
                    window.dispatchEvent(new CustomEvent('openModule', { detail: module.button.moduleId }));
                  } else if (module?.button?.url) {
                    window.open(module.button.url, '_blank');
                  }
                }}`
);

// If config.footer.buttonText is rendered, I want it to actually use module.button.label if it exists!
code = code.replace(
    /\{config\.footer\.buttonText\}/,
    `{module?.button?.label || config.footer.buttonText}`
);

fs.writeFileSync('src/components/GeneralInfoLayout.tsx', code);
