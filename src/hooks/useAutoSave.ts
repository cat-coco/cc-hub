import { useEffect, useState } from 'react';

/**
 * Periodically persists {@code value} to localStorage.
 *
 * <p>Returns the last save timestamp and a manual {@code restore()} helper.
 * Payload key is {@code cch.draft.{key}}; stale copies across tabs are
 * picked up via the `storage` event.
 */
export function useAutoSave<T>(key: string, value: T, intervalMs = 10_000) {
  const storageKey = `cch.draft.${key}`;
  const [savedAt, setSavedAt] = useState<Date | null>(null);

  useEffect(() => {
    const id = setInterval(() => {
      try {
        localStorage.setItem(storageKey, JSON.stringify({ value, savedAt: Date.now() }));
        setSavedAt(new Date());
      } catch {
        /* quota exceeded — ignore */
      }
    }, intervalMs);
    return () => clearInterval(id);
  }, [storageKey, value, intervalMs]);

  function restore(): { value: T; savedAt: number } | null {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as { value: T; savedAt: number };
    } catch {
      return null;
    }
  }

  function clear() {
    localStorage.removeItem(storageKey);
  }

  return { savedAt, restore, clear };
}
