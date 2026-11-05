const fs = require('fs');
let code = fs.readFileSync('src/AdminDashboard.tsx', 'utf8');

// For Main Module Action Button
code = code.replace(
    /className="w-full border border-neutral-300 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none bg-white font-mono text-blue-600"\s*\/>\s*<\/div>/,
    `className="w-full border border-neutral-300 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none bg-white font-mono text-blue-600" />
                                    </div>
                                    <div>
                                      <label className="block text-xs text-neutral-500 mb-1">
                                        Link to Internal Module (Optional)
                                      </label>
                                      <select
                                        value={mod.button.moduleId || ""}
                                        onChange={(e) => {
                                          const newModules = [...editingHotel.content.modules];
                                          newModules[editingMainModuleIdx].button.moduleId = e.target.value;
                                          saveHotelContent(editingHotel.id, {
                                            ...editingHotel.content,
                                            modules: newModules,
                                          });
                                        }}
                                        className="w-full border border-neutral-300 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none bg-white"
                                      >
                                        <option value="">None (Use URL or default behavior)</option>
                                        {editingHotel.content?.modules?.map((m: any) => (
                                          <option key={m.id} value={m.id}>
                                            {m.title}
                                          </option>
                                        ))}
                                      </select>
                                    </div>`
);

// We need to carefully patch both places using string replace.
