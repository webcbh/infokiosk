import React, { useState, useEffect } from "react";
import {
  Boxes,
  Power,
  Sliders,
  Play,
  RotateCcw,
  Plus,
  Trash2,
  CheckCircle,
  XCircle,
  Activity,
  Layers,
  Sparkles,
  Radio,
  Search,
  Filter,
  Eye,
  Info,
  Smartphone,
  Monitor,
  Check,
  Send,
} from "lucide-react";
import { moduleRegistry, useAllModules } from "../modules/ModuleRegistry";
import { moduleBus } from "../modules/ModuleBus";
import { ModulePlugin, ModuleManifest, ModuleStateRecord } from "../modules/types";

export function ModuleManagerTab({
  hotels,
  onShowToast,
}: {
  hotels: any[];
  onShowToast: (msg: string) => void;
}) {
  const allModules = useAllModules();
  const [moduleStates, setModuleStates] = useState<Record<string, ModuleStateRecord>>(() =>
    moduleRegistry.getAllStates()
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [lifecycleLogs, setLifecycleLogs] = useState<string[]>([]);
  const [busEvents, setBusEvents] = useState<any[]>(() => moduleBus.getHistory());
  const [testEventName, setTestEventName] = useState("concierge:bell-request");
  const [testEventPayload, setTestEventPayload] = useState('{"room": "204", "priority": "high"}');

  // Modal States
  const [configuringModule, setConfiguringModule] = useState<ModulePlugin | null>(null);
  const [configValues, setConfigValues] = useState<Record<string, any>>({});
  const [showAddModal, setShowAddModal] = useState(false);

  // New Custom Plugin Form State
  const [newPluginId, setNewPluginId] = useState("");
  const [newPluginName, setNewPluginName] = useState("");
  const [newPluginSubtitle, setNewPluginSubtitle] = useState("");
  const [newPluginCategory, setNewPluginCategory] = useState<any>("guest-services");
  const [newPluginIcon, setNewPluginIcon] = useState("Sparkles");
  const [newPluginSurface, setNewPluginSurface] = useState<any>("both");
  const [newPluginDescription, setNewPluginDescription] = useState("");
  const [newPluginHtml, setNewPluginHtml] = useState(
    `<div class="p-6 bg-slate-900 border border-amber-500/30 rounded-2xl text-center space-y-4">
  <h2 class="text-2xl font-serif font-bold text-amber-400">Custom Guest Experience</h2>
  <p class="text-sm text-slate-300">This module was registered dynamically via the InfoKiosk Plugin Architecture without modifying core code!</p>
  <button class="px-5 py-2.5 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs uppercase tracking-wider">Explore Service</button>
</div>`
  );

  // Sync module state updates
  useEffect(() => {
    const unsubReg = moduleRegistry.subscribe(() => {
      setModuleStates(moduleRegistry.getAllStates());
    });
    const unsubBus = moduleBus.subscribeHistory(() => {
      setBusEvents(moduleBus.getHistory());
    });
    return () => {
      unsubReg();
      unsubBus();
    };
  }, []);

  const handleToggleGlobal = async (moduleId: string, currentEnabled: boolean) => {
    const newEnabled = !currentEnabled;
    moduleRegistry.setModuleActivation(moduleId, newEnabled);
    setModuleStates(moduleRegistry.getAllStates());

    try {
      await fetch("/api/admin/modules/toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ moduleId, enabled: newEnabled }),
      });
    } catch (e) {}

    addLog(`Module "${moduleId}" global state toggled to ${newEnabled ? "ACTIVE" : "INACTIVE"}`);
    onShowToast(`Module ${newEnabled ? "activated" : "deactivated"} globally`);
  };

  const handleToggleHotelOverride = async (moduleId: string, hotelId: string, currentVal: boolean) => {
    const newVal = !currentVal;
    moduleRegistry.setModuleActivation(moduleId, newVal, hotelId);
    setModuleStates(moduleRegistry.getAllStates());

    try {
      await fetch("/api/admin/modules/toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ moduleId, hotelId, enabled: newVal }),
      });
    } catch (e) {}

    const hotelName = hotels.find((h) => h.id === hotelId)?.name || hotelId;
    addLog(`Module "${moduleId}" for hotel "${hotelName}" set to ${newVal ? "ENABLED" : "DISABLED"}`);
    onShowToast(`Updated hotel override`);
  };

  const handleTestLoad = async (moduleId: string) => {
    addLog(`Invoking lifecycle load: moduleRegistry.loadModule("${moduleId}")`);
    try {
      await moduleRegistry.loadModule(moduleId);
      addLog(`Module "${moduleId}" loaded into active runtime memory successfully.`);
      onShowToast(`Module "${moduleId}" loaded`);
    } catch (err: any) {
      addLog(`Error loading "${moduleId}": ${err?.message}`);
      onShowToast(`Failed to load module`);
    }
  };

  const handleTestUnload = async (moduleId: string) => {
    addLog(`Invoking lifecycle unload: moduleRegistry.unloadModule("${moduleId}")`);
    try {
      await moduleRegistry.unloadModule(moduleId);
      addLog(`Module "${moduleId}" unloaded from memory. onDestroy lifecycle hook executed.`);
      onShowToast(`Module "${moduleId}" unloaded from memory`);
    } catch (err: any) {
      addLog(`Error unloading "${moduleId}": ${err?.message}`);
    }
  };

  const handleOpenConfig = (plugin: ModulePlugin) => {
    setConfiguringModule(plugin);
    const state = moduleRegistry.getModuleState(plugin.manifest.id);
    setConfigValues(state.config || plugin.manifest.defaultConfig || {});
  };

  const handleSaveConfig = async () => {
    if (!configuringModule) return;
    const moduleId = configuringModule.manifest.id;
    moduleRegistry.setModuleConfig(moduleId, configValues);
    setModuleStates(moduleRegistry.getAllStates());

    try {
      await fetch("/api/admin/modules/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ moduleId, config: configValues }),
      });
    } catch (e) {}

    addLog(`Updated configuration schema for module "${moduleId}"`);
    onShowToast(`Configuration saved for ${configuringModule.manifest.name}`);
    setConfiguringModule(null);
  };

  const handleRegisterCustomPlugin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPluginId.trim() || !newPluginName.trim()) {
      alert("Please provide valid plugin ID and Name.");
      return;
    }

    const cleanId = newPluginId.trim().toLowerCase().replace(/\s+/g, "-");
    const manifest: ModuleManifest = {
      id: cleanId,
      name: newPluginName.trim(),
      subtitle: newPluginSubtitle.trim() || undefined,
      description: newPluginDescription.trim() || "Dynamically registered custom plugin.",
      version: "1.0.0",
      author: "Admin Dynamic Plugin",
      icon: newPluginIcon || "Sparkles",
      category: newPluginCategory,
      targetSurfaces: newPluginSurface,
      isCustom: true,
      customHtml: newPluginHtml,
      defaultConfig: {},
    };

    const newPlugin: ModulePlugin = {
      manifest,
      renderDetail: () => null, // Handled automatically by ModuleRenderer customHtml
    };

    moduleRegistry.register(newPlugin);
    addLog(`Successfully registered dynamic plugin "${cleanId}" via ModuleRegistry.`);

    try {
      await fetch("/api/admin/modules/custom", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plugin: manifest }),
      });
    } catch (e) {}

    onShowToast(`Registered dynamic plugin "${newPluginName}"`);
    setShowAddModal(false);
    setNewPluginId("");
    setNewPluginName("");
    setNewPluginSubtitle("");
    setNewPluginDescription("");
  };

  const handleDeleteCustomPlugin = async (moduleId: string) => {
    if (!confirm(`Are you sure you want to unregister custom plugin "${moduleId}"?`)) return;
    moduleRegistry.unregister(moduleId);
    addLog(`Unregistered plugin "${moduleId}" and purged runtime references.`);

    try {
      await fetch(`/api/admin/modules/custom/${moduleId}`, { method: "DELETE" });
    } catch (e) {}

    onShowToast(`Deleted custom plugin "${moduleId}"`);
  };

  const handleEmitTestBusEvent = () => {
    if (!testEventName.trim()) return;
    let payload = {};
    try {
      payload = JSON.parse(testEventPayload);
    } catch (e) {
      payload = { raw: testEventPayload };
    }
    moduleBus.createScopedBus("admin-dashboard").emit(testEventName, payload);
    addLog(`Emitted test event "${testEventName}" onto ModuleBus.`);
    onShowToast(`Event "${testEventName}" broadcasted`);
  };

  const addLog = (msg: string) => {
    setLifecycleLogs((prev) => [
      `[${new Date().toLocaleTimeString()}] ${msg}`,
      ...prev.slice(0, 40),
    ]);
  };

  // Filtering
  const filteredModules = allModules.filter((mod) => {
    const matchesCat =
      selectedCategory === "all" ||
      (selectedCategory === "custom" ? mod.manifest.isCustom : mod.manifest.category === selectedCategory);
    const matchesSearch =
      !searchQuery.trim() ||
      mod.manifest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mod.manifest.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (mod.manifest.description || "").toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  // Calculate metrics
  const totalCount = allModules.length;
  const activeKioskCount = allModules.filter(
    (m) =>
      moduleRegistry.isEnabled(m.manifest.id) &&
      (m.manifest.targetSurfaces === "kiosk" || m.manifest.targetSurfaces === "both")
  ).length;
  const activeMobileCount = allModules.filter(
    (m) =>
      moduleRegistry.isEnabled(m.manifest.id) &&
      (m.manifest.targetSurfaces === "mobile" || m.manifest.targetSurfaces === "both")
  ).length;
  const loadedCount = allModules.filter((m) => moduleRegistry.isLoaded(m.manifest.id)).length;

  return (
    <div className="space-y-6">
      {/* Top Banner & Action */}
      <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <Boxes size={22} />
            </span>
            <h2 className="text-xl font-bold text-neutral-800">Module & Plugin Management</h2>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold">
              v2.1 Architecture
            </span>
          </div>
          <p className="text-sm text-neutral-500">
            Dynamically register, activate, configure, load, and isolate plugins across Constantinou Bros InfoKiosk & Mobile PWA.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
        >
          <Plus size={16} /> Register New Plugin
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-neutral-200 rounded-xl p-4 shadow-sm">
          <span className="text-xs text-neutral-500 uppercase tracking-wider font-medium">Total Registered</span>
          <div className="text-2xl font-bold text-neutral-800 mt-1">{totalCount} Modules</div>
          <span className="text-[11px] text-neutral-400">Core & dynamic extensions</span>
        </div>

        <div className="bg-white border border-neutral-200 rounded-xl p-4 shadow-sm">
          <span className="text-xs text-neutral-500 uppercase tracking-wider font-medium">Active on Kiosk</span>
          <div className="text-2xl font-bold text-blue-600 mt-1">{activeKioskCount} Active</div>
          <span className="text-[11px] text-neutral-400">Large display surfaces</span>
        </div>

        <div className="bg-white border border-neutral-200 rounded-xl p-4 shadow-sm">
          <span className="text-xs text-neutral-500 uppercase tracking-wider font-medium">Active on Mobile</span>
          <div className="text-2xl font-bold text-amber-600 mt-1">{activeMobileCount} Active</div>
          <span className="text-[11px] text-neutral-400">Guest mobile devices</span>
        </div>

        <div className="bg-white border border-neutral-200 rounded-xl p-4 shadow-sm">
          <span className="text-xs text-neutral-500 uppercase tracking-wider font-medium">Runtime Loaded</span>
          <div className="text-2xl font-bold text-emerald-600 mt-1">{loadedCount} Loaded</div>
          <span className="text-[11px] text-neutral-400">Active memory footprint</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-neutral-200 rounded-xl p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search modules by name, ID, or keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-neutral-300 rounded-lg text-sm text-neutral-800 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {[
            { id: "all", label: "All" },
            { id: "guest-services", label: "Guest Services" },
            { id: "amenities", label: "Amenities" },
            { id: "activities", label: "Activities" },
            { id: "information", label: "Information" },
            { id: "utilities", label: "Utilities" },
            { id: "custom", label: "Custom Plugins" },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat.id
                  ? "bg-neutral-800 text-white"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Module List Table / Cards */}
      <div className="bg-white border border-neutral-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-neutral-200 flex items-center justify-between">
          <h3 className="font-bold text-neutral-800 text-sm">
            Installed Modules ({filteredModules.length})
          </h3>
          <span className="text-xs text-neutral-400">
            Changes synchronize to active kiosks and mobile sessions in real time.
          </span>
        </div>

        <div className="divide-y divide-neutral-200">
          {filteredModules.map((plugin) => {
            const m = plugin.manifest;
            const state = moduleStates[m.id] || { enabled: true, hotelOverrides: {}, config: {} };
            const isGloballyActive = state.enabled !== false;
            const isLoaded = moduleRegistry.isLoaded(m.id);

            return (
              <div key={m.id} className="p-4 hover:bg-neutral-50/70 transition-colors space-y-3">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  {/* Left: Icon, Name, ID, Badges */}
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-700 shrink-0 font-bold">
                      {m.icon ? <span className="text-xs font-mono">{m.icon.slice(0, 3)}</span> : <Boxes size={18} />}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-neutral-900 text-sm">{m.name}</span>
                        <span className="px-2 py-0.5 rounded bg-neutral-100 text-neutral-600 font-mono text-[10px] border border-neutral-200">
                          {m.id}
                        </span>
                        <span className="text-[10px] text-neutral-400 font-mono">v{m.version}</span>
                        {m.isCustom && (
                          <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 text-[10px] font-bold">
                            Dynamic Plugin
                          </span>
                        )}
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            isLoaded ? "bg-emerald-100 text-emerald-700" : "bg-neutral-100 text-neutral-500"
                          }`}
                        >
                          {isLoaded ? "Loaded in Memory" : "Unloaded"}
                        </span>
                      </div>

                      {m.subtitle && (
                        <p className="text-xs text-neutral-500 mt-0.5 italic">{m.subtitle}</p>
                      )}
                      <p className="text-xs text-neutral-600 mt-1 line-clamp-1">{m.description}</p>
                    </div>
                  </div>

                  {/* Right: Global Toggle & Action Buttons */}
                  <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                    {/* Global Power Switch */}
                    <button
                      onClick={() => handleToggleGlobal(m.id, isGloballyActive)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                        isGloballyActive
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                          : "bg-neutral-100 text-neutral-500 border border-neutral-200 hover:bg-neutral-200"
                      }`}
                    >
                      <Power size={13} />
                      <span>{isGloballyActive ? "Active" : "Disabled"}</span>
                    </button>

                    {/* Configure Button */}
                    <button
                      onClick={() => handleOpenConfig(plugin)}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium bg-neutral-100 text-neutral-700 hover:bg-neutral-200 border border-neutral-200 flex items-center gap-1 cursor-pointer"
                      title="Configure module options"
                    >
                      <Sliders size={13} />
                      <span>Config</span>
                    </button>

                    {/* Test Load / Unload Lifecycle Buttons */}
                    <button
                      onClick={() => (isLoaded ? handleTestUnload(m.id) : handleTestLoad(m.id))}
                      className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-neutral-100 text-neutral-600 hover:bg-neutral-200 border border-neutral-200 flex items-center gap-1 cursor-pointer"
                      title={isLoaded ? "Unload from runtime memory" : "Load into runtime memory"}
                    >
                      <RotateCcw size={12} />
                      <span>{isLoaded ? "Unload" : "Load"}</span>
                    </button>

                    {/* If custom plugin, allow delete */}
                    {m.isCustom && (
                      <button
                        onClick={() => handleDeleteCustomPlugin(m.id)}
                        className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                        title="Delete custom plugin"
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Per-Hotel Activation Matrix */}
                <div className="pt-2 border-t border-neutral-100 flex flex-wrap items-center gap-x-4 gap-y-2">
                  <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                    Per-Hotel Activation:
                  </span>
                  {hotels.map((h) => {
                    const isHotelActive =
                      state.hotelOverrides && state.hotelOverrides[h.id] !== undefined
                        ? state.hotelOverrides[h.id]
                        : isGloballyActive;

                    return (
                      <label
                        key={h.id}
                        className="flex items-center gap-1.5 text-xs text-neutral-700 cursor-pointer select-none"
                      >
                        <input
                          type="checkbox"
                          checked={isHotelActive}
                          onChange={() => handleToggleHotelOverride(m.id, h.id, isHotelActive)}
                          className="rounded border-neutral-300 text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
                        />
                        <span className={isHotelActive ? "font-medium text-neutral-800" : "text-neutral-400 line-through"}>
                          {h.name.replace("Constantinou Bros ", "")}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Diagnostics: Live Inter-Module Bus Monitor & Test Console */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Inter-Module Bus Stream */}
        <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Radio size={18} className="text-blue-600 animate-pulse" />
              <h3 className="font-bold text-neutral-800 text-sm">Inter-Module Event Bus Stream</h3>
            </div>
            <span className="text-xs text-neutral-400 font-mono">
              {busEvents.length} events logged
            </span>
          </div>
          <p className="text-xs text-neutral-500">
            Real-time inter-module decoupled messages and broadcasts fired across plugins.
          </p>

          <div className="bg-neutral-900 rounded-xl p-3 h-48 overflow-y-auto space-y-2 font-mono text-xs text-neutral-300">
            {busEvents.length === 0 ? (
              <div className="text-neutral-500 italic text-center py-6">No bus events fired yet.</div>
            ) : (
              busEvents.map((ev) => (
                <div key={ev.id} className="border-b border-neutral-800 pb-1.5 last:border-0">
                  <div className="flex items-center justify-between text-[11px] text-neutral-400">
                    <span className="text-amber-400 font-bold">[{ev.sourceModuleId}]</span>
                    <span>{new Date(ev.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <div className="text-white font-semibold">{ev.event}</div>
                  {ev.payload && (
                    <div className="text-neutral-400 text-[10px] truncate">
                      {JSON.stringify(ev.payload)}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Test Event Dispatcher */}
          <div className="pt-2 border-t border-neutral-200 flex flex-col gap-2">
            <span className="text-xs font-semibold text-neutral-700">Dispatch Test Message onto Bus</span>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="event:name (e.g. concierge:request)"
                value={testEventName}
                onChange={(e) => setTestEventName(e.target.value)}
                className="flex-1 px-3 py-1.5 border border-neutral-300 rounded text-xs font-mono"
              />
              <button
                onClick={handleEmitTestBusEvent}
                className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-900 text-white rounded text-xs font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Send size={12} /> Emit
              </button>
            </div>
          </div>
        </div>

        {/* Right: Module Lifecycle Log */}
        <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity size={18} className="text-emerald-600" />
              <h3 className="font-bold text-neutral-800 text-sm">Module Lifecycle Execution Log</h3>
            </div>
            <button
              onClick={() => setLifecycleLogs([])}
              className="text-xs text-neutral-400 hover:text-neutral-600 cursor-pointer"
            >
              Clear
            </button>
          </div>
          <p className="text-xs text-neutral-500">
            Real-time audit of module load, unload, activation, and configuration transitions.
          </p>

          <div className="bg-neutral-900 rounded-xl p-3 h-64 overflow-y-auto space-y-1 font-mono text-xs text-emerald-400">
            {lifecycleLogs.length === 0 ? (
              <div className="text-neutral-500 italic text-center py-8">
                Ready. Click "Load", "Unload" or toggle activation switches to monitor runtime hooks.
              </div>
            ) : (
              lifecycleLogs.map((log, i) => (
                <div key={i} className="leading-relaxed">
                  {log}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Modal: Module Configuration */}
      {configuringModule && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 border border-neutral-200">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
              <div>
                <h3 className="text-lg font-bold text-neutral-800">
                  Configure {configuringModule.manifest.name}
                </h3>
                <span className="text-xs text-neutral-500 font-mono">
                  Module ID: {configuringModule.manifest.id}
                </span>
              </div>
              <button
                onClick={() => setConfiguringModule(null)}
                className="text-neutral-400 hover:text-neutral-700 text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
              {configuringModule.manifest.configSchema && configuringModule.manifest.configSchema.length > 0 ? (
                configuringModule.manifest.configSchema.map((field) => (
                  <div key={field.key} className="space-y-1">
                    <label className="text-xs font-semibold text-neutral-700 uppercase tracking-wider block">
                      {field.label}
                    </label>
                    {field.description && (
                      <p className="text-[11px] text-neutral-400">{field.description}</p>
                    )}

                    {field.type === "boolean" ? (
                      <label className="flex items-center gap-2 cursor-pointer pt-1">
                        <input
                          type="checkbox"
                          checked={!!configValues[field.key]}
                          onChange={(e) =>
                            setConfigValues({ ...configValues, [field.key]: e.target.checked })
                          }
                          className="rounded border-neutral-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-xs text-neutral-700">Enabled</span>
                      </label>
                    ) : field.type === "select" ? (
                      <select
                        value={configValues[field.key] || field.defaultValue || ""}
                        onChange={(e) =>
                          setConfigValues({ ...configValues, [field.key]: e.target.value })
                        }
                        className="w-full border border-neutral-300 rounded-lg p-2 text-xs text-neutral-800 focus:border-blue-500 focus:outline-none"
                      >
                        {field.options?.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    ) : field.type === "number" ? (
                      <input
                        type="number"
                        value={configValues[field.key] ?? field.defaultValue ?? 0}
                        onChange={(e) =>
                          setConfigValues({ ...configValues, [field.key]: parseFloat(e.target.value) || 0 })
                        }
                        className="w-full border border-neutral-300 rounded-lg p-2 text-xs text-neutral-800 focus:border-blue-500 focus:outline-none"
                      />
                    ) : (
                      <input
                        type="text"
                        value={configValues[field.key] ?? field.defaultValue ?? ""}
                        onChange={(e) =>
                          setConfigValues({ ...configValues, [field.key]: e.target.value })
                        }
                        className="w-full border border-neutral-300 rounded-lg p-2 text-xs text-neutral-800 focus:border-blue-500 focus:outline-none"
                      />
                    )}
                  </div>
                ))
              ) : (
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-neutral-700 block">
                    Custom Settings (JSON)
                  </span>
                  <textarea
                    rows={6}
                    value={JSON.stringify(configValues, null, 2)}
                    onChange={(e) => {
                      try {
                        setConfigValues(JSON.parse(e.target.value));
                      } catch (err) {}
                    }}
                    className="w-full border border-neutral-300 rounded-lg p-3 text-xs font-mono text-neutral-800 focus:border-blue-500 focus:outline-none"
                  />
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-neutral-200">
              <button
                onClick={() => setConfiguringModule(null)}
                className="px-4 py-2 rounded-lg text-xs font-medium text-neutral-600 hover:bg-neutral-100"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveConfig}
                className="px-4 py-2 rounded-lg text-xs font-bold bg-blue-600 text-white hover:bg-blue-700"
              >
                Save Configuration
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Register New Custom Plugin */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form
            onSubmit={handleRegisterCustomPlugin}
            className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 border border-neutral-200"
          >
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
              <div className="flex items-center gap-2">
                <Sparkles size={20} className="text-purple-600" />
                <h3 className="text-lg font-bold text-neutral-800">Register New Module Plugin</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-neutral-400 hover:text-neutral-700 text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-1">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-neutral-700 block mb-1">
                    Plugin Identifier (ID) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. yacht-charter"
                    value={newPluginId}
                    onChange={(e) => setNewPluginId(e.target.value)}
                    className="w-full border border-neutral-300 rounded-lg p-2 text-xs font-mono focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-neutral-700 block mb-1">
                    Display Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Private Yacht Charter"
                    value={newPluginName}
                    onChange={(e) => setNewPluginName(e.target.value)}
                    className="w-full border border-neutral-300 rounded-lg p-2 text-xs focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-neutral-700 block mb-1">Category</label>
                  <select
                    value={newPluginCategory}
                    onChange={(e) => setNewPluginCategory(e.target.value)}
                    className="w-full border border-neutral-300 rounded-lg p-2 text-xs focus:border-blue-500 focus:outline-none"
                  >
                    <option value="guest-services">Guest Services</option>
                    <option value="amenities">Amenities</option>
                    <option value="activities">Activities</option>
                    <option value="information">Information</option>
                    <option value="utilities">Utilities</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-neutral-700 block mb-1">Target Surface</label>
                  <select
                    value={newPluginSurface}
                    onChange={(e) => setNewPluginSurface(e.target.value)}
                    className="w-full border border-neutral-300 rounded-lg p-2 text-xs focus:border-blue-500 focus:outline-none"
                  >
                    <option value="both">Both (Kiosk & Mobile)</option>
                    <option value="kiosk">Kiosk Only</option>
                    <option value="mobile">Mobile PWA Only</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-700 block mb-1">Tagline / Subtitle</label>
                <input
                  type="text"
                  placeholder="e.g. Sail the Akamas Coast in luxury"
                  value={newPluginSubtitle}
                  onChange={(e) => setNewPluginSubtitle(e.target.value)}
                  className="w-full border border-neutral-300 rounded-lg p-2 text-xs focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-700 block mb-1">Description</label>
                <input
                  type="text"
                  placeholder="Short explanation of what this plugin provides..."
                  value={newPluginDescription}
                  onChange={(e) => setNewPluginDescription(e.target.value)}
                  className="w-full border border-neutral-300 rounded-lg p-2 text-xs focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-700 block mb-1">
                  Custom HTML / Component Layout
                </label>
                <textarea
                  rows={5}
                  value={newPluginHtml}
                  onChange={(e) => setNewPluginHtml(e.target.value)}
                  className="w-full border border-neutral-300 rounded-lg p-2 text-xs font-mono focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-neutral-200">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded-lg text-xs font-medium text-neutral-600 hover:bg-neutral-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg text-xs font-bold bg-purple-600 text-white hover:bg-purple-700"
              >
                Register & Activate
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
