import { ModuleCommunicationBus, ModuleEvent } from "./types";

type EventHandler = (payload: any, eventMeta: ModuleEvent) => void;
type QueryHandler = (args?: any) => any | Promise<any>;

class CentralModuleBus {
  private listeners: Map<string, Set<EventHandler>> = new Map();
  private queryHandlers: Map<string, Map<string, QueryHandler>> = new Map(); // moduleId -> action -> handler
  private eventHistory: ModuleEvent[] = [];
  private maxHistory: number = 60;
  private changeSubscribers: Set<() => void> = new Set();

  public subscribeHistory(cb: () => void): () => void {
    this.changeSubscribers.add(cb);
    return () => this.changeSubscribers.delete(cb);
  }

  private notifyHistoryChanged() {
    this.changeSubscribers.forEach((cb) => {
      try {
        cb();
      } catch (e) {
        console.error("Bus history callback error", e);
      }
    });
  }

  public getHistory(): ModuleEvent[] {
    return [...this.eventHistory];
  }

  public createScopedBus(sourceModuleId: string): ModuleCommunicationBus {
    return {
      emit: (event: string, payload?: any) => {
        this.emitInternal(sourceModuleId, event, payload);
      },
      broadcast: (event: string, payload?: any) => {
        this.emitInternal(sourceModuleId, `broadcast:${event}`, payload);
      },
      on: (event: string, handler: EventHandler) => {
        if (!this.listeners.has(event)) {
          this.listeners.set(event, new Set());
        }
        this.listeners.get(event)!.add(handler);

        return () => {
          this.listeners.get(event)?.delete(handler);
        };
      },
      query: async (targetModuleId: string, action: string, args?: any) => {
        return this.queryInternal(sourceModuleId, targetModuleId, action, args);
      },
      registerQueryHandler: (action: string, handler: QueryHandler) => {
        if (!this.queryHandlers.has(sourceModuleId)) {
          this.queryHandlers.set(sourceModuleId, new Map());
        }
        this.queryHandlers.get(sourceModuleId)!.set(action, handler);

        return () => {
          this.queryHandlers.get(sourceModuleId)?.delete(action);
        };
      },
      getRecentEvents: () => {
        return this.getHistory();
      },
    };
  }

  private emitInternal(sourceModuleId: string, event: string, payload?: any) {
    const meta: ModuleEvent = {
      id: "ev_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7),
      sourceModuleId,
      event,
      payload,
      timestamp: Date.now(),
    };

    // Keep history ring buffer
    this.eventHistory.unshift(meta);
    if (this.eventHistory.length > this.maxHistory) {
      this.eventHistory.pop();
    }
    this.notifyHistoryChanged();

    // Exact match listeners
    const handlers = this.listeners.get(event);
    if (handlers) {
      handlers.forEach((h) => {
        try {
          h(payload, meta);
        } catch (err) {
          console.error(`[ModuleBus] Handler error for event ${event}:`, err);
        }
      });
    }

    // Wildcard '*' listeners
    const wildcardHandlers = this.listeners.get("*");
    if (wildcardHandlers) {
      wildcardHandlers.forEach((h) => {
        try {
          h(payload, meta);
        } catch (err) {
          console.error(`[ModuleBus] Wildcard handler error:`, err);
        }
      });
    }
  }

  private async queryInternal(
    sourceModuleId: string,
    targetModuleId: string,
    action: string,
    args?: any
  ): Promise<any> {
    const moduleQueries = this.queryHandlers.get(targetModuleId);
    if (!moduleQueries || !moduleQueries.has(action)) {
      throw new Error(
        `[ModuleBus] Target module "${targetModuleId}" does not support query action "${action}"`
      );
    }
    const handler = moduleQueries.get(action)!;
    return await Promise.resolve(handler(args));
  }
}

export const moduleBus = new CentralModuleBus();
