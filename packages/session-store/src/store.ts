import { MemorySessionStore } from "./memory-store";
import type { SessionStore } from "./types";

let defaultStore: SessionStore | null = null;

/**
 * Get the default session store
 */
export function getSessionStore(): SessionStore {
  if (!defaultStore) {
    defaultStore = new MemorySessionStore();
  }
  return defaultStore;
}

/**
 * Set a custom session store
 */
export function setSessionStore(store: SessionStore): void {
  defaultStore = store;
}
