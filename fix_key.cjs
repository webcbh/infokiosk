const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const targetActionItem = `                  <ActionItem
                  key={act.id}`;
const replaceActionItem = `                  <ActionItem`;

code = code.replace(targetActionItem, replaceActionItem);

fs.writeFileSync('src/App.tsx', code);
