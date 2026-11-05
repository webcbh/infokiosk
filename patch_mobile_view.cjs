const fs = require('fs');
let code = fs.readFileSync('src/MobileAppView.tsx', 'utf8');

// Quick actions
const actionTarget = `            return (
              <button 
                key={act.id}`;
const actionReplacement = `            const isCheckIn = act.title.toLowerCase().includes("check-in");
            return (
              <motion.button 
                key={act.id}
                animate={
                  isCheckIn
                    ? {
                        boxShadow: [
                          "0px 0px 0px rgba(217,182,115,0)",
                          "0px 0px 20px rgba(217,182,115,0.4)",
                          "0px 0px 0px rgba(217,182,115,0)",
                        ],
                      }
                    : {}
                }
                transition={
                  isCheckIn
                    ? { repeat: Infinity, duration: 2, ease: "easeInOut" }
                    : {}
                }`;
code = code.replace(actionTarget, actionReplacement);

const actionClassTarget = `                className="bg-white p-4 rounded-2xl shadow-sm border border-neutral-100 flex flex-col items-center text-center gap-2 active:scale-95 transition-transform"
              >
                <div className="w-10 h-10 rounded-full bg-[#08183A]/5 flex items-center justify-center text-[#D9B673]">
                  <Icon size={20} />
                </div>
                <div className="font-semibold text-xs tracking-wider uppercase text-[#08183A]">{act.title}</div>
              </button>`;
const actionClassReplacement = `                className={\`bg-white p-4 rounded-2xl shadow-sm border flex flex-col items-center text-center gap-2 active:scale-95 transition-transform \${
                  isCheckIn ? 'border-[#D9B673]/60' : 'border-neutral-100'
                }\`}
              >
                <div className="w-10 h-10 rounded-full bg-[#08183A]/5 flex items-center justify-center text-[#D9B673]">
                  <Icon size={20} />
                </div>
                <div className="font-semibold text-xs tracking-wider uppercase text-[#08183A]">{act.title}</div>
              </motion.button>`;
code = code.replace(actionClassTarget, actionClassReplacement);

// Modules List
const moduleTarget = `              return (
                <button
                  key={mod.id}`;
const moduleReplacement = `              const isCheckIn = mod.title.toLowerCase().includes("check-in");
              return (
                <motion.button
                  key={mod.id}
                  animate={
                    isCheckIn
                      ? {
                          boxShadow: [
                            "0px 0px 0px rgba(217,182,115,0)",
                            "0px 0px 20px rgba(217,182,115,0.4)",
                            "0px 0px 0px rgba(217,182,115,0)",
                          ],
                        }
                      : {}
                  }
                  transition={
                    isCheckIn
                      ? { repeat: Infinity, duration: 2, ease: "easeInOut" }
                      : {}
                  }`;
code = code.replace(moduleTarget, moduleReplacement);

const moduleClassTarget = `                  className="w-full bg-white p-4 rounded-2xl shadow-sm border border-neutral-100 flex items-center gap-4 active:scale-95 transition-transform"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#08183A] flex shrink-0 items-center justify-center text-[#D9B673]">
                    <Icon size={24} strokeWidth={1.5} />
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="font-bold text-sm tracking-wide uppercase text-[#08183A]">{mod.title}</h3>
                    <p className="text-xs text-neutral-500 mt-0.5 line-clamp-1">{mod.subtitle}</p>
                  </div>
                  <LucideIcons.ChevronRight size={18} className="text-neutral-300" />
                </button>`;
const moduleClassReplacement = `                  className={\`w-full bg-white p-4 rounded-2xl shadow-sm border flex items-center gap-4 active:scale-95 transition-transform \${
                    isCheckIn ? 'border-[#D9B673]/60' : 'border-neutral-100'
                  }\`}
                >
                  <div className="w-12 h-12 rounded-xl bg-[#08183A] flex shrink-0 items-center justify-center text-[#D9B673]">
                    <Icon size={24} strokeWidth={1.5} />
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="font-bold text-sm tracking-wide uppercase text-[#08183A]">{mod.title}</h3>
                    <p className="text-xs text-neutral-500 mt-0.5 line-clamp-1">{mod.subtitle}</p>
                  </div>
                  <LucideIcons.ChevronRight size={18} className="text-neutral-300" />
                </motion.button>`;
code = code.replace(moduleClassTarget, moduleClassReplacement);

fs.writeFileSync('src/MobileAppView.tsx', code);
