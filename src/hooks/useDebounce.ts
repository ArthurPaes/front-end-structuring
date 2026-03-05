/**
 * @file Debounce hook — delays value updates until input stabilises.
 *
 * USAGE:
 *   const debouncedSearch = useDebounce(searchTerm, 300);
 *   useEffect(() => { fetchResults(debouncedSearch); }, [debouncedSearch]);
 *
 * SOLID: Single Responsibility — this hook does one thing only.
 */
import { useEffect, useState } from 'react';

export function useDebounce<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return debounced;
}
