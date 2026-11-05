const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const targetActionBar = `        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6"
        >`;

const replacementActionBar = `        <motion.div 
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
              }
            }
          }}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6"
        >`;
code = code.replace(targetActionBar, replacementActionBar);

const targetActionItemLoop = `                .map((act: any) => (
                <ActionItem`;

const replacementActionItemLoop = `                .map((act: any) => (
                <motion.div
                  key={act.id}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
                  }}
                >
                  <ActionItem`;
code = code.replace(targetActionItemLoop, replacementActionItemLoop);

const targetActionItemEnd = `                      setShowCheckInModal(true);
                    }
                  }}
                />
              ))}`;

const replacementActionItemEnd = `                      setShowCheckInModal(true);
                    }
                  }}
                />
                </motion.div>
              ))}`;
code = code.replace(targetActionItemEnd, replacementActionItemEnd);

const targetModuleCardDiv = `                <motion.div
                  layout
                  className="h-full"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
                  key={mod.id}
                  variants={{`;

const replacementModuleCardDiv = `                <motion.div
                  layout
                  className="h-full"
                  exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
                  key={mod.id}
                  variants={{`;
code = code.replace(targetModuleCardDiv, replacementModuleCardDiv);

fs.writeFileSync('src/App.tsx', code);
