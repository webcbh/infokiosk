import { useEffect, useState, useSyncExternalStore } from "react";
import {
  ModulePlugin,
  ModuleManifest,
  ModuleStateRecord,
  ModuleContext,
  ModuleSurface,
} from "./types";
import { moduleBus } from "./ModuleBus";

class ModuleRegistrySingleton {
  private plugins: Map<string, ModulePlugin> = new Map();
  private loadedModules: Set<string> = new Set();
  private loadingPromises: Map<string, Promise<ModulePlugin>> = new Map();
  private moduleStates: Map<string, ModuleStateRecord> = new Map();
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.loadStateFromStorage();
  }

  private loadStateFromStorage() {
    try {
      if (typeof window !== "undefined") {
        const saved = localStorage.getItem("cbh_modules_state");
        if (saved) {
          const parsed = JSON.parse(saved);
          Object.keys(parsed).forEach((id) => {
            this.moduleStates.set(id, parsed[id]);
          });
        }
      }
    } catch (e) {
      console.warn("Could not read modules state from localStorage", e);
    }
  }

  private persistState() {
    try {
      if (typeof window !== "undefined") {
        const obj: Record<string, ModuleStateRecord> = {};
        this.moduleStates.forEach((val, key) => {
          obj[key] = val;
        });
        localStorage.setItem("cbh_modules_state", JSON.stringify(obj));
      }
    } catch (e) {
      console.warn("Could not persist modules state", e);
    }
    this.notify();
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((l) => {
      try {
        l();
      } catch (e) {
        console.error("ModuleRegistry listener error", e);
      }
    });
  }

  /**
   * Register a module plugin.
   */
  public register(plugin: ModulePlugin) {
    const id = plugin.manifest.id;
    this.plugins.set(id, plugin);

    // Initialize state record if missing
    if (!this.moduleStates.has(id)) {
      this.moduleStates.set(id, {
        enabled: true,
        hotelOverrides: {},
        config: plugin.manifest.defaultConfig ? { ...plugin.manifest.defaultConfig } : {},
      });
    }

    // Automatically mark as loaded initially since it is registered in bundle
    this.loadedModules.add(id);
    this.notify();
  }

  /**
   * Unregister a module plugin.
   */
  public unregister(moduleId: string) {
    const plugin = this.plugins.get(moduleId);
    if (plugin) {
      if (plugin.onDestroy) {
        try {
          plugin.onDestroy();
        } catch (e) {
          console.error(`Error in onDestroy for module ${moduleId}:`, e);
        }
      }
      this.plugins.delete(moduleId);
      this.loadedModules.delete(moduleId);
      this.moduleStates.delete(moduleId);
      this.persistState();
    }
  }

  /**
   * Get a registered plugin by ID.
   */
  public get(moduleId: string): ModulePlugin | undefined {
    return this.plugins.get(moduleId);
  }

  /**
   * Return all registered plugins.
   */
  public getAll(): ModulePlugin[] {
    return Array.from(this.plugins.values());
  }

  /**
   * Check if a module is enabled globally and for a specific hotel.
   */
  public isEnabled(moduleId: string, hotelId?: string): boolean {
    const state = this.moduleStates.get(moduleId);
    if (!state) return true; // Default to enabled if no state
    if (state.enabled === false) return false;

    if (hotelId && state.hotelOverrides && state.hotelOverrides[hotelId] !== undefined) {
      return state.hotelOverrides[hotelId];
    }

    return true;
  }

  /**
   * Get all active plugins for a specific hotel and surface.
   */
  public getActive(hotelId?: string, surface?: ModuleSurface): ModulePlugin[] {
    return this.getAll().filter((plugin) => {
      const isAct = this.isEnabled(plugin.manifest.id, hotelId);
      if (!isAct) return false;

      if (surface) {
        const target = plugin.manifest.targetSurfaces;
        if (target === "both") return true;
        if (surface === "both") return true;
        return target === surface;
      }
      return true;
    });
  }

  /**
   * Dynamic loading of a module (supports lazy load and asynchronous lifecycle initialization).
   */
  public async loadModule(moduleId: string, context?: ModuleContext): Promise<ModulePlugin> {
    const plugin = this.plugins.get(moduleId);
    if (!plugin) {
      throw new Error(`Module "${moduleId}" is not registered in the system.`);
    }

    if (this.loadedModules.has(moduleId)) {
      return plugin;
    }

    if (this.loadingPromises.has(moduleId)) {
      return this.loadingPromises.get(moduleId)!;
    }

    const loadPromise = (async () => {
      try {
        if (plugin.onInit && context) {
          await Promise.resolve(plugin.onInit(context));
        }
        this.loadedModules.add(moduleId);
        this.loadingPromises.delete(moduleId);
        this.notify();
        return plugin;
      } catch (err) {
        this.loadingPromises.delete(moduleId);
        throw err;
      }
    })();

    this.loadingPromises.set(moduleId, loadPromise);
    return loadPromise;
  }

  /**
   * Dynamic unloading of a module from active memory.
   */
  public async unloadModule(moduleId: string): Promise<void> {
    const plugin = this.plugins.get(moduleId);
    if (!plugin) return;

    if (plugin.onDestroy) {
      try {
        await Promise.resolve(plugin.onDestroy());
      } catch (err) {
        console.error(`Error destroying module ${moduleId}:`, err);
      }
    }

    this.loadedModules.delete(moduleId);
    this.notify();
  }

  /**
   * Check if a module is currently loaded in active memory.
   */
  public isLoaded(moduleId: string): boolean {
    return this.loadedModules.has(moduleId);
  }

  /**
   * Toggle activation state (globally or for a specific hotel).
   */
  public setModuleActivation(moduleId: string, enabled: boolean, hotelId?: string) {
    let state = this.moduleStates.get(moduleId);
    if (!state) {
      state = {
        enabled: true,
        hotelOverrides: {},
        config: {},
      };
      this.moduleStates.set(moduleId, state);
    }

    if (hotelId) {
      state.hotelOverrides = {
        ...state.hotelOverrides,
        [hotelId]: enabled,
      };
    } else {
      state.enabled = enabled;
    }

    state.lastUpdated = Date.now();
    this.persistState();

    // Trigger lifecycle hooks if active
    const plugin = this.plugins.get(moduleId);
    if (plugin) {
      if (enabled && plugin.onActivate) {
        plugin.onActivate();
      } else if (!enabled && plugin.onDeactivate) {
        plugin.onDeactivate();
      }
    }
  }

  /**
   * Update configuration for a module.
   */
  public setModuleConfig(moduleId: string, config: Record<string, any>) {
    let state = this.moduleStates.get(moduleId);
    if (!state) {
      state = {
        enabled: true,
        hotelOverrides: {},
        config: {},
      };
      this.moduleStates.set(moduleId, state);
    }

    state.config = { ...state.config, ...config };
    state.lastUpdated = Date.now();
    this.persistState();

    const plugin = this.plugins.get(moduleId);
    if (plugin && plugin.onConfigChange) {
      plugin.onConfigChange(state.config);
    }
  }

  /**
   * Synchronize batch state from server/socket.
   */
  public syncServerState(serverConfig: Record<string, ModuleStateRecord>) {
    if (!serverConfig) return;
    Object.keys(serverConfig).forEach((id) => {
      this.moduleStates.set(id, {
        enabled: serverConfig[id].enabled ?? true,
        hotelOverrides: serverConfig[id].hotelOverrides || {},
        config: serverConfig[id].config || {},
      });
    });
    this.persistState();
  }

  public getModuleState(moduleId: string): ModuleStateRecord {
    return (
      this.moduleStates.get(moduleId) || {
        enabled: true,
        hotelOverrides: {},
        config: {},
      }
    );
  }

  public getAllStates(): Record<string, ModuleStateRecord> {
    const out: Record<string, ModuleStateRecord> = {};
    this.moduleStates.forEach((val, key) => {
      out[key] = val;
    });
    return out;
  }
}

export const moduleRegistry = new ModuleRegistrySingleton();

/**
 * React hook to listen for module registry changes.
 */
export function useModules(hotelId?: string, surface?: ModuleSurface) {
  const [modules, setModules] = useState<ModulePlugin[]>(() =>
    moduleRegistry.getActive(hotelId, surface)
  );

  useEffect(() => {
    const update = () => {
      setModules(moduleRegistry.getActive(hotelId, surface));
    };
    update();
    const unsub = moduleRegistry.subscribe(update);
    return unsub;
  }, [hotelId, surface]);

  return modules;
}

export function useAllModules() {
  const [modules, setModules] = useState<ModulePlugin[]>(() => moduleRegistry.getAll());

  useEffect(() => {
    const update = () => setModules(moduleRegistry.getAll());
    const unsub = moduleRegistry.subscribe(update);
    return unsub;
  }, []);

  return modules;
}

export function useModule(moduleId: string) {
  const [plugin, setPlugin] = useState<ModulePlugin | undefined>(() =>
    moduleRegistry.get(moduleId)
  );

  useEffect(() => {
    const update = () => setPlugin(moduleRegistry.get(moduleId));
    const unsub = moduleRegistry.subscribe(update);
    return unsub;
  }, [moduleId]);

  return plugin;
}
