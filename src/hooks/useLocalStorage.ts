import { useState, useCallback, useRef } from 'react';

interface UseLocalStorageOptions {
  version?: number;
  debounceMs?: number;
}

interface StoredData<T> {
  version: number;
  data: T;
}

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  options: UseLocalStorageOptions = {}
) {
  const { version = 1, debounceMs = 300 } = options;

  const [value, setValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue;

    try {
      const stored = localStorage.getItem(key);
      if (!stored) return initialValue;

      const parsed: StoredData<T> = JSON.parse(stored);
      if (parsed.version !== version) return initialValue;

      return parsed.data;
    } catch {
      return initialValue;
    }
  });

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const debouncedSave = useCallback(
    (newValue: T) => {
      if (typeof window === 'undefined') return;

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        try {
          const stored: StoredData<T> = { version, data: newValue };
          localStorage.setItem(key, JSON.stringify(stored));
        } catch (error) {
          console.error('Failed to save to localStorage:', error);
        }
      }, debounceMs);
    },
    [key, version, debounceMs]
  );

  const setValueWithDebounce = useCallback(
    (newValue: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const resolvedValue = typeof newValue === 'function' ? (newValue as (prev: T) => T)(prev) : newValue;
        debouncedSave(resolvedValue);
        return resolvedValue;
      });
    },
    [debouncedSave]
  );

  return [value, setValueWithDebounce] as const;
}