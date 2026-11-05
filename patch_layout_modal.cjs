const fs = require('fs');
let code = fs.readFileSync('src/components/DirectoryOfServicesLayout.tsx', 'utf8');

const target = `<div className="flex-1 overflow-y-auto px-6 py-6 prose prose-sm md:prose-base lg:prose-lg max-w-none" style={{ color: brandBlue }}>
                <SafeHTML html={selectedItem.content || ''} />
              </div>`;

const replacement = `<div className="flex-1 overflow-y-auto px-6 py-6 prose prose-sm md:prose-base lg:prose-lg max-w-none break-words" style={{ color: brandBlue, wordWrap: 'break-word', overflowWrap: 'break-word' }}>
                <SafeHTML html={selectedItem.content || ''} className="w-full max-w-full overflow-hidden [&_*]:max-w-full [&_*]:break-words" />
              </div>`;

code = code.replace(target, replacement);

fs.writeFileSync('src/components/DirectoryOfServicesLayout.tsx', code);
