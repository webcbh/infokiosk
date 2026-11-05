import fs from 'fs';
let code = fs.readFileSync('src/components/RestaurantsGridLayout.tsx', 'utf8');

code = code.replace(
    /          <\/div>\n        \)\}\n      <\/div>\n      <\/div>\n    <\/motion\.div>\n  \);\n\}/,
    `          </div>\n        )}\n      </div>\n    </div>\n  );\n}`
);
fs.writeFileSync('src/components/RestaurantsGridLayout.tsx', code);
