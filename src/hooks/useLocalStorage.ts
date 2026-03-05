/**
 * @file Persist state in localStorage with type-safe read/write.
 *
 * USAGE:
 *   const [theme, setTheme] = useLocalStorage('theme', 'light');
 */
import { useState, useCallback } from 'react';
import { storage } from '@/utils/storage';

export function useLocalStorage<TStoredValue>(key: string, initialValue: TStoredValue) {
  const [storedValue, setStoredValue] = useState<TStoredValue>(() => storage.get(key, initialValue));

  // `newValueOrUpdater` can be:
  //   A) a plain new value — e.g. setTheme('dark')
  //   B) an updater function — e.g. setCount(prev => prev + 1)
  //      identical to how React's own setState works
  const setValue = useCallback((newValueOrUpdater: TStoredValue | ((prev: TStoredValue) => TStoredValue)) => {
      setStoredValue((prev) => {
        // If it's a function, call it with the current value to get the next value.
        // If it's a plain value, use it directly.
        const next = typeof newValueOrUpdater === 'function'
          ? (newValueOrUpdater as (prev: TStoredValue) => TStoredValue)(prev)
          : newValueOrUpdater;
        storage.set(key, next);  // persist to localStorage
        return next;             // update React state
      });
    },
    [key],
  );

  const removeValue = useCallback(() => {
    storage.remove(key);
    setStoredValue(initialValue);
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue] as const;
}
