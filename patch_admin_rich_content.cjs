const fs = require('fs');
let code = fs.readFileSync('src/AdminDashboard.tsx', 'utf8');

const targetRichContent = `                <div className="flex-1 min-h-[300px] flex flex-col">
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs uppercase text-neutral-500 font-semibold">
                      Rich Content
                    </label>
                    <button
                      onClick={() => {
                        const suiteFeatures = [`;

const replaceRichContent = `                <div className="flex-1 min-h-[300px] flex flex-col">
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs uppercase text-neutral-500 font-semibold">
                      {editingSubmodule.sub.layout === 'golfDetails' ? 'Course Overview' : 'Rich Content'}
                    </label>
                    {editingSubmodule.sub.layout !== 'golfDetails' && (
                    <button
                      onClick={() => {
                        const suiteFeatures = [`;

code = code.replace(targetRichContent, replaceRichContent);

const targetRichContentEnd = `                      className="text-[10px] bg-blue-50 text-blue-600 px-2 py-1 rounded font-bold hover:bg-blue-100 transition-colors uppercase tracking-widest"
                    >
                      Autopopulate Suite Design
                    </button>
                  </div>`;

const replaceRichContentEnd = `                      className="text-[10px] bg-blue-50 text-blue-600 px-2 py-1 rounded font-bold hover:bg-blue-100 transition-colors uppercase tracking-widest"
                    >
                      Autopopulate Suite Design
                    </button>
                    )}
                  </div>`;

code = code.replace(targetRichContentEnd, replaceRichContentEnd);

fs.writeFileSync('src/AdminDashboard.tsx', code);
