const fs = require('fs');
let code = fs.readFileSync('src/components/RestaurantsGridLayout.tsx', 'utf8');

// Remove hardcoded Please Note box
code = code.replace(
    /\{\/\* Please Note Box \*\/\}.*?<\/div>\s*<\/div>\s*<\/div>\s*\{\/\* Dynamic Action Button \*\/\}/s,
    `        {/* Dynamic Action Button */}`
);

fs.writeFileSync('src/components/RestaurantsGridLayout.tsx', code);
