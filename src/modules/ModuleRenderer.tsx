import React, { useEffect, useState, Component, ErrorInfo, ReactNode } from "react";
import { moduleRegistry } from "./ModuleRegistry";
import { ModuleContext, ModulePlugin } from "./types";
import { AlertTriangle, RefreshCw, X } from "lucide-react";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallbackTitle?: string;
  onClose?: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class PluginErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("[ModuleRenderer] Plugin execution error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#040d1a] text-white flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 rounded-full bg-red-500/20 border border-red-500/40 text-red-400 flex items-center justify-center mb-4">
            <AlertTriangle size={32} />
          </div>
          <h2 className="text-2xl font-serif text-white font-bold mb-2">Module Unavailable</h2>
          <p className="text-sm text-[#A8B6CA] max-w-md mb-6 leading-relaxed">
            The requested module encountered an issue while loading. You can return to the main guest directory.
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-2 cursor-pointer"
            >
              <RefreshCw size={14} /> Retry
            </button>
            {this.props.onClose && (
              <button
                onClick={this.props.onClose}
                className="px-5 py-2.5 rounded-xl bg-[#E5A830] text-[#06152a] text-xs font-bold uppercase tracking-wider cursor-pointer"
              >
                Back to Services
              </button>
            )}
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

interface ModuleRendererProps {
  moduleId: string;
  context: ModuleContext;
  moduleData?: any;
  onClose?: () => void;
}

export function ModuleRenderer({ moduleId, context, moduleData, onClose }: ModuleRendererProps) {
  const [plugin, setPlugin] = useState<ModulePlugin | undefined>(() => moduleRegistry.get(moduleId));
  const [loading, setLoading] = useState<boolean>(!moduleRegistry.isLoaded(moduleId));
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const targetPlugin = moduleRegistry.get(moduleId);
    if (!targetPlugin) {
      setLoadError(`Module "${moduleId}" is not registered.`);
      setLoading(false);
      return;
    }

    setPlugin(targetPlugin);

    if (!moduleRegistry.isLoaded(moduleId)) {
      setLoading(true);
      moduleRegistry
        .loadModule(moduleId, context)
        .then(() => {
          if (mounted) setLoading(false);
        })
        .catch((err) => {
          if (mounted) {
            setLoadError(err?.message || "Failed to load module");
            setLoading(false);
          }
        });
    } else {
      setLoading(false);
    }

    return () => {
      mounted = false;
    };
  }, [moduleId, context]);

  if (loadError) {
    return (
      <div className="fixed inset-0 z-50 bg-[#040d1a] flex flex-col items-center justify-center p-6 text-white text-center">
        <div className="w-14 h-14 rounded-full bg-amber-500/20 border border-amber-500 text-amber-400 flex items-center justify-center mb-4">
          <AlertTriangle size={28} />
        </div>
        <h3 className="text-xl font-serif font-bold mb-2">Module Not Found</h3>
        <p className="text-xs text-[#A8B6CA] mb-6">{loadError}</p>
        <button
          onClick={onClose || context.navigation.closeModule}
          className="px-5 py-2 bg-[#E5A830] text-[#06152a] text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer"
        >
          Close
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 bg-[#040d1a]/95 backdrop-blur-md flex flex-col items-center justify-center text-white">
        <div className="w-12 h-12 border-3 border-[#E5A830]/30 border-t-[#E5A830] rounded-full animate-spin mb-4" />
        <span className="text-xs uppercase tracking-widest text-[#E5A830] font-serif font-semibold">
          Loading Module Experience...
        </span>
      </div>
    );
  }

  if (!plugin) {
    return null;
  }

  // Handle custom HTML dynamic plugins
  if (plugin.manifest.isCustom && plugin.manifest.customHtml) {
    return (
      <PluginErrorBoundary onClose={onClose || context.navigation.closeModule}>
        <div className="min-h-screen bg-[#040d1a] text-white font-sans pb-24">
          <div className="sticky top-0 z-40 bg-[#06152a]/95 backdrop-blur-md border-b border-[#E5A830]/30 px-6 py-4 flex items-center justify-between">
            <button
              onClick={onClose || context.navigation.closeModule}
              className="text-[#E5A830] font-semibold text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
            >
              <span>Back</span>
            </button>
            <span className="font-serif text-sm font-bold text-white uppercase">{plugin.manifest.name}</span>
            <button
              onClick={onClose || context.navigation.closeModule}
              className="w-7 h-7 rounded-full bg-[#081a33] border border-[#E5A830]/50 flex items-center justify-center text-[#E5A830]"
            >
              <X size={14} />
            </button>
          </div>
          <div className="max-w-4xl mx-auto px-4 py-8">
            <div
              className="prose prose-invert max-w-none text-slate-200"
              dangerouslySetInnerHTML={{ __html: plugin.manifest.customHtml }}
            />
          </div>
        </div>
      </PluginErrorBoundary>
    );
  }

  return (
    <PluginErrorBoundary onClose={onClose || context.navigation.closeModule}>
      {plugin.renderDetail(context, { module: moduleData })}
    </PluginErrorBoundary>
  );
}
