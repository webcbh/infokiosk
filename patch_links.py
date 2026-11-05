import re

with open("src/App.tsx", "r") as f:
    app_content = f.read()

target = """                  onClick={() => {
                    if (act.url) {
                      window.open(act.url, "_blank");
                    } else if (act.title.toLowerCase().includes("check-in")) {
                      setShowCheckInModal(true);
                    }
                  }}"""

replacement = """                  onClick={() => {
                    if (act.moduleId) {
                      const mod = currentHotel?.content?.modules?.find((m: any) => m.id === act.moduleId);
                      if (mod) {
                        window.history.pushState({ view: 'module' }, "");
                        setActiveModule(mod);
                      }
                    } else if (act.url) {
                      window.open(act.url, "_blank");
                    } else if (act.title.toLowerCase().includes("check-in")) {
                      setShowCheckInModal(true);
                    }
                  }}"""

app_content = app_content.replace(target, replacement)

with open("src/App.tsx", "w") as f:
    f.write(app_content)

with open("src/MobileAppView.tsx", "r") as f:
    mob_content = f.read()

target2 = """                onClick={() => {
                  if (act.url) {
                    window.open(act.url, "_blank");
                  } else if (act.title.toLowerCase().includes("check-in")) {
                    setShowCheckInModal(true);
                  }
                }}"""

replacement2 = """                onClick={() => {
                  if (act.moduleId) {
                    const mod = currentHotel?.content?.modules?.find((m: any) => m.id === act.moduleId);
                    if (mod) {
                      window.history.pushState({ view: 'module' }, "");
                      setActiveModule(mod);
                    }
                  } else if (act.url) {
                    window.open(act.url, "_blank");
                  } else if (act.title.toLowerCase().includes("check-in")) {
                    setShowCheckInModal(true);
                  }
                }}"""

mob_content = mob_content.replace(target2, replacement2)

with open("src/MobileAppView.tsx", "w") as f:
    f.write(mob_content)

with open("src/AdminDashboard.tsx", "r") as f:
    adm_content = f.read()

target3 = """                            <input
                              type="text"
                              value={action.url || ""}
                              placeholder="https://..."
                              onChange={(e) => {
                                const newActions = [
                                  ...editingHotel.content.actions,
                                ];
                                newActions[idx].url = e.target.value;
                                saveHotelContent(editingHotel.id, {
                                  ...editingHotel.content,
                                  actions: newActions,
                                });
                              }}
                              className="w-full border-b border-neutral-300 focus:border-blue-500 focus:outline-none py-1 text-sm"
                            />
                          </div>"""

replacement3 = """                            <input
                              type="text"
                              value={action.url || ""}
                              placeholder="https://..."
                              onChange={(e) => {
                                const newActions = [
                                  ...editingHotel.content.actions,
                                ];
                                newActions[idx].url = e.target.value;
                                saveHotelContent(editingHotel.id, {
                                  ...editingHotel.content,
                                  actions: newActions,
                                });
                              }}
                              className="w-full border-b border-neutral-300 focus:border-blue-500 focus:outline-none py-1 text-sm"
                            />
                            
                            <label className="block text-xs uppercase text-neutral-500 mt-3 mb-1">
                              Link to Internal Module (Optional)
                            </label>
                            <select
                              value={action.moduleId || ""}
                              onChange={(e) => {
                                const newActions = [...editingHotel.content.actions];
                                newActions[idx].moduleId = e.target.value;
                                saveHotelContent(editingHotel.id, {
                                  ...editingHotel.content,
                                  actions: newActions,
                                });
                              }}
                              className="w-full border-b border-neutral-300 focus:border-blue-500 focus:outline-none py-1 text-sm bg-transparent"
                            >
                              <option value="">None (Use URL or default behavior)</option>
                              {editingHotel.content?.modules?.map((m: any) => (
                                <option key={m.id} value={m.id}>
                                  {m.title}
                                </option>
                              ))}
                            </select>
                          </div>"""

adm_content = adm_content.replace(target3, replacement3)

with open("src/AdminDashboard.tsx", "w") as f:
    f.write(adm_content)

