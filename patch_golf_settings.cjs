const fs = require('fs');
let code = fs.readFileSync('src/AdminDashboard.tsx', 'utf8');

const targetSelect = `<option value="suite">Suite Design</option>
                      <option value="restaurant">Single Restaurant</option>
                    </select>`;
const replaceSelect = `<option value="suite">Suite Design</option>
                      <option value="restaurant">Single Restaurant</option>
                      <option value="golfDetails">Golf Details Template</option>
                    </select>`;
code = code.replace(targetSelect, replaceSelect);

const targetRestaurantSettingsEnd = `                  </div>
                </div>
                )}

                {/* Suites Grid Setup */}`;
const replaceRestaurantSettingsEnd = `                  </div>
                </div>
                )}

                {/* Golf Details Settings */}
                {editingSubmodule.sub.layout === 'golfDetails' && (
                <div className="border border-neutral-200 rounded-xl p-4 bg-green-50/50 mt-4">
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-xs uppercase text-green-800 font-bold mb-0">
                      Golf Details Settings
                    </label>
                    <span className="text-[10px] text-green-600 bg-green-100 px-2 py-0.5 rounded font-medium">
                      Used for Golf Details layout
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-[10px] uppercase text-neutral-500 mb-1 font-semibold">
                        Holes
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 18"
                        value={editingSubmodule.sub.holes || ""}
                        onChange={(e) => {
                          const sub = { ...editingSubmodule.sub, holes: e.target.value };
                          setEditingSubmodule({ ...editingSubmodule, sub });
                          const newModules = [...editingHotel.content.modules];
                          newModules[editingSubmodule.modIdx].submodules[editingSubmodule.subIdx] = sub;
                          saveHotelContent(editingHotel.id, { ...editingHotel.content, modules: newModules });
                        }}
                        className="w-full border border-neutral-300 rounded p-2 focus:border-green-500 focus:outline-none text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase text-neutral-500 mb-1 font-semibold">
                        Par
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 72"
                        value={editingSubmodule.sub.par || ""}
                        onChange={(e) => {
                          const sub = { ...editingSubmodule.sub, par: e.target.value };
                          setEditingSubmodule({ ...editingSubmodule, sub });
                          const newModules = [...editingHotel.content.modules];
                          newModules[editingSubmodule.modIdx].submodules[editingSubmodule.subIdx] = sub;
                          saveHotelContent(editingHotel.id, { ...editingHotel.content, modules: newModules });
                        }}
                        className="w-full border border-neutral-300 rounded p-2 focus:border-green-500 focus:outline-none text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase text-neutral-500 mb-1 font-semibold">
                        Length (m)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 5902 m"
                        value={editingSubmodule.sub.length || ""}
                        onChange={(e) => {
                          const sub = { ...editingSubmodule.sub, length: e.target.value };
                          setEditingSubmodule({ ...editingSubmodule, sub });
                          const newModules = [...editingHotel.content.modules];
                          newModules[editingSubmodule.modIdx].submodules[editingSubmodule.subIdx] = sub;
                          saveHotelContent(editingHotel.id, { ...editingHotel.content, modules: newModules });
                        }}
                        className="w-full border border-neutral-300 rounded p-2 focus:border-green-500 focus:outline-none text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase text-neutral-500 mb-1 font-semibold">
                        Men Handicap
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 36"
                        value={editingSubmodule.sub.menHandicap || ""}
                        onChange={(e) => {
                          const sub = { ...editingSubmodule.sub, menHandicap: e.target.value };
                          setEditingSubmodule({ ...editingSubmodule, sub });
                          const newModules = [...editingHotel.content.modules];
                          newModules[editingSubmodule.modIdx].submodules[editingSubmodule.subIdx] = sub;
                          saveHotelContent(editingHotel.id, { ...editingHotel.content, modules: newModules });
                        }}
                        className="w-full border border-neutral-300 rounded p-2 focus:border-green-500 focus:outline-none text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase text-neutral-500 mb-1 font-semibold">
                        Women Handicap
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 36"
                        value={editingSubmodule.sub.womenHandicap || ""}
                        onChange={(e) => {
                          const sub = { ...editingSubmodule.sub, womenHandicap: e.target.value };
                          setEditingSubmodule({ ...editingSubmodule, sub });
                          const newModules = [...editingHotel.content.modules];
                          newModules[editingSubmodule.modIdx].submodules[editingSubmodule.subIdx] = sub;
                          saveHotelContent(editingHotel.id, { ...editingHotel.content, modules: newModules });
                        }}
                        className="w-full border border-neutral-300 rounded p-2 focus:border-green-500 focus:outline-none text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase text-neutral-500 mb-1 font-semibold">
                        Distance from Hotel
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Approx. 18 km"
                        value={editingSubmodule.sub.distance || ""}
                        onChange={(e) => {
                          const sub = { ...editingSubmodule.sub, distance: e.target.value };
                          setEditingSubmodule({ ...editingSubmodule, sub });
                          const newModules = [...editingHotel.content.modules];
                          newModules[editingSubmodule.modIdx].submodules[editingSubmodule.subIdx] = sub;
                          saveHotelContent(editingHotel.id, { ...editingHotel.content, modules: newModules });
                        }}
                        className="w-full border border-neutral-300 rounded p-2 focus:border-green-500 focus:outline-none text-sm"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-[10px] uppercase text-neutral-500 mb-1 font-semibold">
                        Good to Know (List)
                      </label>
                      <textarea
                        placeholder="One item per line"
                        value={editingSubmodule.sub.goodToKnow || ""}
                        onChange={(e) => {
                          const sub = { ...editingSubmodule.sub, goodToKnow: e.target.value };
                          setEditingSubmodule({ ...editingSubmodule, sub });
                          const newModules = [...editingHotel.content.modules];
                          newModules[editingSubmodule.modIdx].submodules[editingSubmodule.subIdx] = sub;
                          saveHotelContent(editingHotel.id, { ...editingHotel.content, modules: newModules });
                        }}
                        className="w-full border border-neutral-300 rounded p-2 focus:border-green-500 focus:outline-none text-sm min-h-[60px]"
                      />
                    </div>
                  </div>
                </div>
                )}

                {/* Suites Grid Setup */}`;
code = code.replace(targetRestaurantSettingsEnd, replaceRestaurantSettingsEnd);

fs.writeFileSync('src/AdminDashboard.tsx', code);
