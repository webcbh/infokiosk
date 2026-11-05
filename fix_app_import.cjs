const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const importStr = `import { GolfDetailsLayout } from "./components/GolfDetailsLayout";\n`;
if (!code.includes("GolfDetailsLayout }")) {
  code = importStr + code;
}
fs.writeFileSync('src/App.tsx', code);

let layoutCode = fs.readFileSync('src/components/GolfDetailsLayout.tsx', 'utf8');
layoutCode = layoutCode.replace(/import { DynamicIcon } from '.\/DynamicIcon';\n/, "");
fs.writeFileSync('src/components/GolfDetailsLayout.tsx', layoutCode);
