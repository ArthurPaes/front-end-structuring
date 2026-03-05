/**
 * @file ThemeContext — manages light/dark/system theme.
 *
 * WHY CONTEXT (not Zustand)?
 *   Theme is a good fit for Context because:
 *   1. It only changes rarely (user toggle or system preference).
 *   2. It needs to be available everywhere but doesn't cause frequent re-renders.
 *   3. It's simpler than adding a Zustand slice for a single value.
 *
 *   USE ZUSTAND when: state changes frequently, multiple consumers subscribe
 *   to different slices, or you need middleware (persist, devtools).
 */
import {
  createContext,
  useContext,
  useEffect,
  type ReactNode,
} from 'react';
import { useLocalStorage } from '@/hooks';
import { useMediaQuery } from '@/hooks';
import { STORAGE_KEYS } from '@/constants';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextValue {
  theme: Theme;
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within <ThemeProvider>');
  return ctx;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useLocalStorage<Theme>(STORAGE_KEYS.THEME, 'system');
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)');

  const resolvedTheme: 'light' | 'dark' =
    theme === 'system' ? (prefersDark ? 'dark' : 'light') : theme;

  // Apply theme to <html> element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', resolvedTheme);
  }, [resolvedTheme]);

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
