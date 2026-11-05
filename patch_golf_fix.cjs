const fs = require('fs');
let code = fs.readFileSync('src/components/GolfLayout.tsx', 'utf8');

const targetEnd = `              </motion.div>
            );
          })}
        </div>`;

const replacementEnd = `              </motion.div>
            );
          })})()}
        </div>`;

code = code.replace(targetEnd, replacementEnd);
fs.writeFileSync('src/components/GolfLayout.tsx', code);
