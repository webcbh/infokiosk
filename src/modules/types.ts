import React from "react";

export type ModuleCategory =
  | "guest-services"
  | "amenities"
  | "activities"
  | "information"
  | "utilities"
  | "custom";

export type ModuleSurface = "kiosk" | "mobile" | "both";

export interface ConfigFieldSchema {
  key: string;
  label: string;
  type: "string" | "boolean" | "number" | "select" | "color" | "textarea";
  options?: { label: string; value: string }[];
  defaultValue?: any;
  description?: string;
}

export interface ModuleManifest {
  /** Unique module identifier (e.g., "m3", "dining", "spa", "currency-calculator") */
  id: string;
  /** Human-readable display name */
  name: string;
  /** Short tagline or subtitle */
  subtitle?: string;
  /** Detailed description of functionality */
  description: string;
  /** Semantic version string */
  version: string;
  /** Module creator / maintainer */
  author?: string;
  /** Lucide icon name */
  icon: string;
  /** Functional category */
  category: ModuleCategory;
  /** Where this module can run */
  targetSurfaces: ModuleSurface;
  /** Background image or banner URL */
  bannerImage?: string;
  /** Optional dependencies on other modules by ID */
  dependencies?: string[];
  /** Permissions required by this module */
  permissions?: ("storage" | "network" | "location" | "inter-module" | "notifications")[];
  /** Default configuration values */
  defaultConfig?: Record<string, any>;
  /** Schema for admin configuration panel */
  configSchema?: ConfigFieldSchema[];
  /** Flag if dynamically created by admin */
  isCustom?: boolean;
  /** Custom HTML content for simple dynamic custom plugins */
  customHtml?: string;
}

export interface ModuleEvent {
  id: string;
  sourceModuleId: string;
  event: string;
  payload?: any;
  timestamp: number;
}

export interface ModuleCommunicationBus {
  /** Emit an event to any listening module */
  emit: (event: string, payload?: any) => void;
  /** Listen for events across the system */
  on: (event: string, handler: (payload: any, eventMeta: ModuleEvent) => void) => () => void;
  /** Broadcast a system-wide announcement */
  broadcast: (event: string, payload?: any) => void;
  /** Request-response RPC to query another module */
  query: (targetModuleId: string, action: string, args?: any) => Promise<any>;
  /** Provide an action handler for queries from other modules */
  registerQueryHandler: (action: string, handler: (args?: any) => any | Promise<any>) => () => void;
  /** Get recent bus event log for telemetry / diagnostics */
  getRecentEvents: () => ModuleEvent[];
}

export interface ModuleContext {
  /** Current hotel data and metadata */
  hotel: any;
  /** Active platform: "kiosk" (large screen) or "mobile" (PWA) */
  platform: "kiosk" | "mobile";
  /** Branding theme */
  theme: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    backgroundColor: string;
    isDark: boolean;
  };
  /** Local persistent storage scoped to this module */
  storage: {
    get: <T = any>(key: string, defaultValue?: T) => T;
    set: (key: string, value: any) => void;
    remove: (key: string) => void;
    clear: () => void;
  };
  /** Inter-module event bus and RPC bridge */
  bus: ModuleCommunicationBus;
  /** Core navigation controls */
  navigation: {
    openModule: (moduleId: string, params?: any) => void;
    closeModule: () => void;
    openSubmodule: (submodule: any) => void;
    closeSubmodule: () => void;
    navigateToHotel: (hotelId: string) => void;
  };
  /** Weather data if available */
  weather: {
    temp?: number;
    code?: number;
    description?: string;
  } | null;
  /** Active module configuration */
  config: Record<string, any>;
  /** System notification toast */
  notify: (message: string, type?: "info" | "success" | "warning" | "error") => void;
}

export interface ModulePlugin {
  manifest: ModuleManifest;

  // Lifecycle hooks
  onInit?: (context: ModuleContext) => void | Promise<void>;
  onDestroy?: () => void | Promise<void>;
  onActivate?: () => void;
  onDeactivate?: () => void;
  onConfigChange?: (newConfig: Record<string, any>) => void;

  // Rendering interfaces
  renderDetail: (context: ModuleContext, props?: any) => React.ReactNode;
  renderTile?: (context: ModuleContext, isSelected?: boolean) => React.ReactNode;
  renderWidget?: (context: ModuleContext) => React.ReactNode;
  renderSettings?: (
    config: Record<string, any>,
    onChange: (newConfig: Record<string, any>) => void
  ) => React.ReactNode;
}

export interface ModuleStateRecord {
  enabled: boolean;
  hotelOverrides: Record<string, boolean>; // hotelId -> boolean
  config: Record<string, any>;
  lastUpdated?: number;
}
