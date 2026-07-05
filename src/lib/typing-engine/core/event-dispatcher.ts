/**
 * Event Dispatcher
 * 
 * Manages event subscriptions and dispatching for the typing engine.
 * Allows modules to communicate without tight coupling.
 */

import type {
  EngineEvent,
  EngineEventType,
  EventListener,
  EventUnsubscribe,
} from "../types";

export class EventDispatcher {
  private listeners: Map<EngineEventType, Set<EventListener>>;
  private globalListeners: Set<EventListener>;

  constructor() {
    this.listeners = new Map();
    this.globalListeners = new Set();
  }

  /**
   * Subscribe to a specific event type
   */
  on<T = unknown>(
    eventType: EngineEventType,
    listener: EventListener<T>
  ): EventUnsubscribe {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set());
    }

    const listeners = this.listeners.get(eventType);
    listeners?.add(listener as EventListener);

    // Return unsubscribe function
    return () => {
      listeners?.delete(listener as EventListener);
    };
  }

  /**
   * Subscribe to multiple event types
   */
  onMultiple<T = unknown>(
    eventTypes: EngineEventType[],
    listener: EventListener<T>
  ): EventUnsubscribe {
    const unsubscribers = eventTypes.map((type) => this.on(type, listener));

    // Return function that unsubscribes from all
    return () => {
      unsubscribers.forEach((unsub) => unsub());
    };
  }

  /**
   * Subscribe to all events (global listener)
   */
  onAll(listener: EventListener): EventUnsubscribe {
    this.globalListeners.add(listener);

    return () => {
      this.globalListeners.delete(listener);
    };
  }

  /**
   * Subscribe to an event once (auto-unsubscribe after first trigger)
   */
  once<T = unknown>(
    eventType: EngineEventType,
    listener: EventListener<T>
  ): EventUnsubscribe {
    const wrappedListener: EventListener<T> = (event) => {
      listener(event);
      unsub();
    };

    const unsub = this.on(eventType, wrappedListener);
    return unsub;
  }

  /**
   * Dispatch an event to all subscribers
   */
  emit<T = unknown>(eventType: EngineEventType, data: T): void {
    const event: EngineEvent<T> = {
      type: eventType,
      timestamp: Date.now(),
      data,
    };

    // Notify specific listeners
    const listeners = this.listeners.get(eventType);
    if (listeners) {
      listeners.forEach((listener) => {
        try {
          listener(event);
        } catch (error) {
          console.error(`Error in event listener for ${eventType}:`, error);
        }
      });
    }

    // Notify global listeners
    this.globalListeners.forEach((listener) => {
      try {
        listener(event);
      } catch (error) {
        console.error(`Error in global event listener:`, error);
      }
    });
  }

  /**
   * Remove all listeners for a specific event type
   */
  removeAllListeners(eventType?: EngineEventType): void {
    if (eventType) {
      this.listeners.delete(eventType);
    } else {
      this.listeners.clear();
      this.globalListeners.clear();
    }
  }

  /**
   * Get the number of listeners for an event type
   */
  listenerCount(eventType: EngineEventType): number {
    return this.listeners.get(eventType)?.size ?? 0;
  }

  /**
   * Check if there are any listeners for an event type
   */
  hasListeners(eventType: EngineEventType): boolean {
    return this.listenerCount(eventType) > 0 || this.globalListeners.size > 0;
  }

  /**
   * Get all registered event types
   */
  getEventTypes(): EngineEventType[] {
    return Array.from(this.listeners.keys());
  }

  /**
   * Clear all listeners and reset the dispatcher
   */
  destroy(): void {
    this.listeners.clear();
    this.globalListeners.clear();
  }
}
