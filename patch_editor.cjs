const fs = require('fs');
let code = fs.readFileSync('src/components/DirectoryOfServicesEditor.tsx', 'utf8');

const target = `<div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {(cat.items || []).map((item: any, itemIdx: number) => (
                    <div key={itemIdx} className="flex gap-2 items-center bg-neutral-50 p-2 rounded border border-neutral-100">
                      <GripVertical size={14} className="text-neutral-400 cursor-move" />
                      <input 
                        type="text" 
                        placeholder="Icon (e.g. Wifi)"
                        value={item.icon || ''} 
                        onChange={(e) => updateItem(catIdx, itemIdx, 'icon', e.target.value)}
                        className="w-24 border border-neutral-200 rounded px-2 py-1 text-xs"
                      />
                      <input 
                        type="text" 
                        placeholder="Item name"
                        value={item.name || ''} 
                        onChange={(e) => updateItem(catIdx, itemIdx, 'name', e.target.value)}
                        className="flex-1 border border-neutral-200 rounded px-2 py-1 text-xs"
                      />
                      <button onClick={() => removeItem(catIdx, itemIdx)} className="text-neutral-400 hover:text-red-500">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>`;
                
const replacement = `<div className="grid grid-cols-1 gap-4">
                  {(cat.items || []).map((item: any, itemIdx: number) => (
                    <div key={itemIdx} className="flex flex-col gap-2 bg-neutral-50 p-3 rounded border border-neutral-100">
                      <div className="flex gap-2 items-center">
                        <GripVertical size={14} className="text-neutral-400 cursor-move" />
                        <input 
                          type="text" 
                          placeholder="Icon (e.g. Wifi)"
                          value={item.icon || ''} 
                          onChange={(e) => updateItem(catIdx, itemIdx, 'icon', e.target.value)}
                          className="w-24 border border-neutral-200 rounded px-2 py-1 text-xs"
                        />
                        <input 
                          type="text" 
                          placeholder="Item name"
                          value={item.name || ''} 
                          onChange={(e) => updateItem(catIdx, itemIdx, 'name', e.target.value)}
                          className="flex-1 border border-neutral-200 rounded px-2 py-1 text-xs"
                        />
                        <button onClick={() => removeItem(catIdx, itemIdx)} className="text-neutral-400 hover:text-red-500">
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <div className="pl-6 pb-2 pr-2">
                        <label className="block text-xs text-neutral-500 mb-1">Item Modal Content (Optional)</label>
                        <ReactQuill 
                          theme="snow"
                          value={item.content || ''}
                          onChange={(val) => updateItem(catIdx, itemIdx, 'content', val)}
                          className="bg-white rounded"
                        />
                      </div>
                    </div>
                  ))}
                </div>`;

fs.writeFileSync('src/components/DirectoryOfServicesEditor.tsx', code.replace(target, replacement));
