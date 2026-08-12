type EventCallback = () => void;

class EventEmitter {
  private listeners: Record<string, EventCallback[]> = {};

  on(event: string, callback: EventCallback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);

    // Return an unsubscribe function
    return () => {
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    };
  }

  emit(event: string) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(cb => cb());
    }
  }
}

export const appEvents = new EventEmitter();

// Centralized invalidation events
export const invalidateDeliveries = () => appEvents.emit('refresh:deliveries');
export const invalidatePartners = () => appEvents.emit('refresh:partners');
export const invalidateAssignments = () => appEvents.emit('refresh:assignments');
export const invalidateAuditLogs = () => appEvents.emit('refresh:audit');
export const invalidateReports = () => appEvents.emit('refresh:reports');

// Useful hook for components
import { useEffect } from 'react';

export const useAppEvent = (eventName: string, callback: () => void) => {
  useEffect(() => {
    const unsubscribe = appEvents.on(eventName, callback);
    return () => unsubscribe();
  }, [eventName, callback]);
};
