const fs = require('fs');
let code = fs.readFileSync('src/components/DirectoryOfServicesEditor.tsx', 'utf8');

code = code.replace(
  '<div>\n                  <label className="block text-xs text-neutral-500 mb-1">Category Icon (Lucide)</label>\n                  <input \n                    type="text" \n                    value={cat.icon || \'\'} \n                    onChange={(e) => updateCategory(catIdx, \'icon\', e.target.value)}\n                    className="w-full border border-neutral-200 rounded px-3 py-2 text-sm"\n                  />\n                </div>',
  `<div>
                  <label className="block text-xs text-neutral-500 mb-1">Category Icon (Lucide)</label>
                  <input 
                    type="text" 
                    value={cat.icon || ''} 
                    onChange={(e) => updateCategory(catIdx, 'icon', e.target.value)}
                    className="w-full border border-neutral-200 rounded px-3 py-2 text-sm mb-2"
                  />
                  <ImageUpload 
                    label="Or Upload Image"
                    value={cat.image || ''}
                    onChange={(val) => updateCategory(catIdx, 'image', val)}
                  />
                </div>`
);

code = code.replace(
  '<label className="block text-xs text-neutral-500 mb-1">Icon</label>\n                  <input \n                    type="text" \n                    value={item.icon || \'\'} \n                    onChange={(e) => updateBottomItem(idx, \'icon\', e.target.value)}\n                    className="w-full border border-neutral-200 rounded px-2 py-1 text-xs"\n                  />',
  `<label className="block text-xs text-neutral-500 mb-1">Icon (Lucide)</label>
                  <input 
                    type="text" 
                    value={item.icon || ''} 
                    onChange={(e) => updateBottomItem(idx, 'icon', e.target.value)}
                    className="w-full border border-neutral-200 rounded px-2 py-1 text-xs mb-2"
                  />
                  <ImageUpload 
                    label="Or Image"
                    value={item.image || ''}
                    onChange={(val) => updateBottomItem(idx, 'image', val)}
                  />`
);

fs.writeFileSync('src/components/DirectoryOfServicesEditor.tsx', code);
