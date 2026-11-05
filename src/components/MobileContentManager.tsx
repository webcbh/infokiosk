import React, { useState } from 'react';
import * as LucideIcons from 'lucide-react';
import { Smartphone, ExternalLink, Eye, EyeOff, CheckCircle2, ShieldCheck, Filter, Search, Layers, Sparkles } from 'lucide-react';

export function MobileContentManager({ data, fetchAdminData }: { data: any; fetchAdminData: () => Promise<void> }) {
  const [selectedHotelId, setSelectedHotelId] = useState<string>(data?.hotels?.[0]?.id || "");
  const [isSaving, setIsSaving] = useState(false);
  const [filterMode, setFilterMode] = useState<"all" | "enabled" | "hidden">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const currentHotel = data?.hotels?.find((h: any) => h.id === selectedHotelId) || data?.hotels?.[0];
  if (!currentHotel) return <div className="p-8 text-neutral-500">No hotels available.</div>;

  const updateBackend = async (newContent: any) => {
    setIsSaving(true);
    try {
      const newHotels = data.hotels.map((h: any) =>
        h.id === currentHotel.id ? { ...h, content: newContent } : h
      );
      await fetch("/api/admin/hotels", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hotels: newHotels }),
      });
      await fetchAdminData();
    } catch (e) {
      console.error("Failed to update mobile content", e);
    } finally {
      setIsSaving(false);
    }
  };

  const toggleModuleVisibility = (modIdx: number, currentVal: boolean) => {
    const newModules = [...(currentHotel.content?.modules || [])];
    newModules[modIdx] = { ...newModules[modIdx], showOnMobile: !currentVal };
    updateBackend({ ...currentHotel.content, modules: newModules });
  };

  const toggleActionVisibility = (actionIdx: number, currentVal: boolean) => {
    const newActions = [...(currentHotel.content?.actions || [])];
    newActions[actionIdx] = { ...newActions[actionIdx], showOnMobile: !currentVal };
    updateBackend({ ...currentHotel.content, actions: newActions });
  };

  const enableAllModules = () => {
    const newModules = (currentHotel.content?.modules || []).map((m: any) => ({ ...m, showOnMobile: true }));
    updateBackend({ ...currentHotel.content, modules: newModules });
  };

  const disableAllModules = () => {
    const newModules = (currentHotel.content?.modules || []).map((m: any) => ({ ...m, showOnMobile: false }));
    updateBackend({ ...currentHotel.content, modules: newModules });
  };

  const modules = currentHotel.content?.modules || [];
  const actions = currentHotel.content?.actions || [];

  const enabledModulesCount = modules.filter((m: any) => m.showOnMobile !== false).length;
  const hiddenModulesCount = modules.length - enabledModulesCount;

  const enabledActionsCount = actions.filter((a: any) => a.showOnMobile !== false).length;
  const hiddenActionsCount = actions.length - enabledActionsCount;

  const filteredModules = modules.map((m: any, idx: number) => ({ ...m, originalIndex: idx })).filter((m: any) => {
    const isVisible = m.showOnMobile !== false;
    if (filterMode === "enabled" && !isVisible) return false;
    if (filterMode === "hidden" && isVisible) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (m.title || "").toLowerCase().includes(q) || (m.subtitle || "").toLowerCase().includes(q);
    }
    return true;
  });

  const filteredActions = actions.map((a: any, idx: number) => ({ ...a, originalIndex: idx })).filter((a: any) => {
    const isVisible = a.showOnMobile !== false;
    if (filterMode === "enabled" && !isVisible) return false;
    if (filterMode === "hidden" && isVisible) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (a.title || "").toLowerCase().includes(q) || (a.subtitle || "").toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden font-sans">
      {/* Top Banner & Hotel Switcher */}
      <div className="p-6 border-b border-neutral-100 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-8 h-8 rounded-lg bg-amber-400/20 border border-amber-400/40 text-amber-300 flex items-center justify-center font-bold text-xs">
                CB
              </span>
              <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                Mobile Content & Device Assignment
              </h2>
            </div>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Configure which hotel services, menus, and quick actions are visible when guests open the app on mobile devices.
              Mobile devices automatically see the dedicated luxury navy & gold theme.
            </p>
          </div>

          {/* Hotel Selector & Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative">
              <select 
                value={currentHotel.id} 
                onChange={e => setSelectedHotelId(e.target.value)}
                className="w-full sm:w-auto bg-slate-800/90 border border-slate-700 text-white rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-400 shadow-sm"
              >
                {data?.hotels?.map((h: any) => (
                  <option key={h.id} value={h.id} className="bg-slate-900 text-white">
                    {h.name} {h.active ? "• Active" : "• Inactive"}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={`/?mobile=true&hotelId=${currentHotel.id}`}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors shadow-sm"
                title="Preview this hotel on mobile theme"
              >
                <Smartphone size={14} strokeWidth={2.5} />
                <span>Hotel View</span>
                <ExternalLink size={12} />
              </a>

              <a
                href="/?mobile=true&landing=true"
                target="_blank"
                rel="noreferrer"
                className="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors shadow-sm"
                title="Preview the hotel selection landing page"
              >
                <Layers size={14} />
                <span>Landing Page</span>
                <ExternalLink size={12} />
              </a>
            </div>
          </div>
        </div>

        {/* Live Metrics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-800">
          <div className="bg-slate-800/60 rounded-xl p-3 border border-slate-700/60">
            <div className="text-[11px] text-slate-400 uppercase font-semibold">Total Modules</div>
            <div className="text-xl font-bold text-white mt-0.5">{modules.length}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Configured for resort</div>
          </div>

          <div className="bg-slate-800/60 rounded-xl p-3 border border-emerald-500/30">
            <div className="text-[11px] text-emerald-400 uppercase font-semibold flex items-center gap-1">
              <Eye size={12} /> Mobile Enabled
            </div>
            <div className="text-xl font-bold text-emerald-300 mt-0.5">{enabledModulesCount}</div>
            <div className="text-[10px] text-emerald-400/80 mt-0.5">Visible to guests</div>
          </div>

          <div className="bg-slate-800/60 rounded-xl p-3 border border-slate-700/60">
            <div className="text-[11px] text-slate-400 uppercase font-semibold flex items-center gap-1">
              <EyeOff size={12} /> Mobile Hidden
            </div>
            <div className="text-xl font-bold text-slate-300 mt-0.5">{hiddenModulesCount}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Hidden on phones</div>
          </div>

          <div className="bg-slate-800/60 rounded-xl p-3 border border-amber-500/30">
            <div className="text-[11px] text-amber-400 uppercase font-semibold">Quick Actions</div>
            <div className="text-xl font-bold text-amber-300 mt-0.5">
              {enabledActionsCount} / {actions.length}
            </div>
            <div className="text-[10px] text-amber-400/80 mt-0.5">Enabled on mobile</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-slate-50 border-b border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setFilterMode("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              filterMode === "all" ? "bg-slate-900 text-white shadow-sm" : "bg-white text-slate-600 hover:bg-slate-100 border border-neutral-200"
            }`}
          >
            All Items ({modules.length})
          </button>
          <button
            onClick={() => setFilterMode("enabled")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              filterMode === "enabled" ? "bg-emerald-600 text-white shadow-sm" : "bg-white text-slate-600 hover:bg-slate-100 border border-neutral-200"
            }`}
          >
            Visible on Mobile ({enabledModulesCount})
          </button>
          <button
            onClick={() => setFilterMode("hidden")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              filterMode === "hidden" ? "bg-rose-600 text-white shadow-sm" : "bg-white text-slate-600 hover:bg-slate-100 border border-neutral-200"
            }`}
          >
            Hidden on Mobile ({hiddenModulesCount})
          </button>
        </div>

        {/* Search & Bulk Actions */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-60">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search modules..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <button
            onClick={enableAllModules}
            disabled={isSaving}
            className="px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-semibold transition-colors whitespace-nowrap"
            title="Enable all modules on mobile"
          >
            Enable All
          </button>
          <button
            onClick={disableAllModules}
            disabled={isSaving}
            className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 text-xs font-semibold transition-colors whitespace-nowrap"
            title="Disable all modules on mobile"
          >
            Hide All
          </button>
        </div>
      </div>

      {/* Main Content Areas */}
      <div className="p-6 space-y-8">
        {/* Modules Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Sparkles size={16} className="text-amber-500" />
                Hotel Service Modules ({filteredModules.length})
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Toggle the switch to show or hide any service on mobile guest devices. Changes save instantly.
              </p>
            </div>
            {isSaving && (
              <span className="text-xs text-indigo-600 font-semibold flex items-center gap-1.5 animate-pulse">
                <LucideIcons.RefreshCw size={12} className="animate-spin" /> Saving changes...
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {filteredModules.map((mod: any) => {
              const isVisible = mod.showOnMobile !== false;
              const IconComp = (LucideIcons as any)[mod.icon] || LucideIcons.Sparkles;
              const subCount = mod.submodules?.length || 0;

              return (
                <div
                  key={mod.id || mod.originalIndex}
                  className={`p-4 rounded-xl border transition-all flex items-center justify-between gap-4 ${
                    isVisible
                      ? "bg-white border-neutral-200 shadow-sm hover:border-indigo-300"
                      : "bg-slate-50 border-dashed border-slate-300 opacity-75"
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                        isVisible
                          ? "bg-slate-900 text-amber-400 shadow-sm"
                          : "bg-slate-200 text-slate-500"
                      }`}
                    >
                      <IconComp size={22} strokeWidth={1.75} />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-slate-900 text-sm truncate">{mod.title}</h4>
                        {subCount > 0 && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-600">
                            {subCount} items
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 truncate mt-0.5">{mod.subtitle || "No subtitle"}</p>
                      <div className="mt-1 flex items-center gap-1.5">
                        <span
                          className={`inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                            isVisible
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-slate-100 text-slate-500 border border-slate-200"
                          }`}
                        >
                          {isVisible ? <Eye size={10} /> : <EyeOff size={10} />}
                          {isVisible ? "Active on Mobile" : "Hidden from Mobile"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Toggle Switch */}
                  <button
                    disabled={isSaving}
                    onClick={() => toggleModuleVisibility(mod.originalIndex, isVisible)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      isVisible ? "bg-emerald-500" : "bg-slate-300"
                    } ${isSaving ? "opacity-50 cursor-not-allowed" : ""}`}
                    role="switch"
                    aria-checked={isVisible}
                    title={isVisible ? "Click to hide on mobile" : "Click to enable on mobile"}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                        isVisible ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              );
            })}

            {filteredModules.length === 0 && (
              <div className="col-span-2 py-8 text-center text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                No modules match the selected filter.
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions Section */}
        {actions.length > 0 && (
          <div className="pt-6 border-t border-neutral-100">
            <div className="mb-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <CheckCircle2 size={16} className="text-indigo-600" />
                Quick Actions ({filteredActions.length})
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Top shortcut buttons displayed on the hotel home screen on mobile devices.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {filteredActions.map((act: any) => {
                const isVisible = act.showOnMobile !== false;
                const IconComp = (LucideIcons as any)[act.icon] || LucideIcons.Sparkles;

                return (
                  <div
                    key={act.id || act.originalIndex}
                    className={`p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                      isVisible
                        ? "bg-white border-neutral-200 shadow-sm"
                        : "bg-slate-50 border-dashed border-slate-300 opacity-75"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                          isVisible ? "bg-indigo-50 text-indigo-700" : "bg-slate-200 text-slate-500"
                        }`}
                      >
                        <IconComp size={18} strokeWidth={2} />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-semibold text-slate-900 text-xs truncate">{act.title}</h4>
                        <span
                          className={`inline-block text-[9px] font-semibold uppercase tracking-wider mt-0.5 px-1.5 py-0.2 rounded ${
                            isVisible ? "text-emerald-700 bg-emerald-50" : "text-slate-500 bg-slate-100"
                          }`}
                        >
                          {isVisible ? "Active" : "Hidden"}
                        </span>
                      </div>
                    </div>

                    <button
                      disabled={isSaving}
                      onClick={() => toggleActionVisibility(act.originalIndex, isVisible)}
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        isVisible ? "bg-emerald-500" : "bg-slate-300"
                      } ${isSaving ? "opacity-50 cursor-not-allowed" : ""}`}
                      role="switch"
                      aria-checked={isVisible}
                    >
                      <span
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          isVisible ? "translate-x-4" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
