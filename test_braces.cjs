const fs = require('fs');
const content = fs.readFileSync('src/App.tsx', 'utf-8');
let depth = 0;
for (let i = 0; i < content.length; i++) {
    if (content[i] === '{') depth++;
    if (content[i] === '}') depth--;
    if (depth < 0) {
        console.log("Unmatched } at index " + i + " around: " + content.slice(i-20, i+20));
        break;
    }
}
console.log("Final depth of {}: " + depth);
