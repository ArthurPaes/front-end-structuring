/**
 * @file Select — compound component pattern example.
 *
 * COMPOUND COMPONENTS:
 *   Instead of passing everything via props to a single component,
 *   compound components share state via context and let the consumer
 *   compose the UI structure.
 *
 * USAGE:
 *   <Select value={val} onChange={setVal}>
 *     <Select.Trigger>Choose…</Select.Trigger>
 *     <Select.Options>
 *       <Select.Option value="a">Option A</Select.Option>
 *       <Select.Option value="b">Option B</Select.Option>
 *     </Select.Options>
 *   </Select>
 *
 * SOLID: Open/Closed — new option types can be added without modifying the
 * Select component itself.
 * SOLID: Liskov Substitution — TypeScript generics allow any value type.
 */
import {
  createContext,
  useContext,
  useState,
  type ReactNode,
  useCallback,
  useRef,
  useEffect,
} from 'react';
import { cn } from '@/utils/cn';

// ── Shared context ────────────────────────────────────────
interface SelectContextValue {
  value: string;
  onChange: (value: string) => void;
  isOpen: boolean;
  toggle: () => void;
  close: () => void;
}

const SelectContext = createContext<SelectContextValue | null>(null);

function useSelectContext() {
  const ctx = useContext(SelectContext);
  if (!ctx) throw new Error('Select compound components must be used within <Select>');
  return ctx;
}

// ── Root ──────────────────────────────────────────────────
interface SelectRootProps {
  value: string;
  onChange: (value: string) => void;
  children: ReactNode;
}

function SelectRoot({ value, onChange, children }: SelectRootProps) {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);
  const close = useCallback(() => setIsOpen(false), []);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) close();
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [close]);

  return (
    <SelectContext.Provider value={{ value, onChange, isOpen, toggle, close }}>
      <div ref={ref} className="relative inline-block w-full">
        {children}
      </div>
    </SelectContext.Provider>
  );
}

// ── Trigger ───────────────────────────────────────────────
function Trigger({ children }: { children: ReactNode }) {
  const { toggle, isOpen } = useSelectContext();
  return (
    <button
      type="button"
      onClick={toggle}
      className={cn(
        'w-full flex items-center justify-between rounded-lg border px-3 py-2 text-sm',
        'bg-white hover:bg-gray-50 focus:ring-2 focus:ring-blue-500',
      )}
      aria-expanded={isOpen}
      aria-haspopup="listbox"
    >
      {children}
      <span className="ml-2" aria-hidden="true">{isOpen ? '▲' : '▼'}</span>
    </button>
  );
}

// ── Options container ─────────────────────────────────────
function Options({ children }: { children: ReactNode }) {
  const { isOpen } = useSelectContext();
  if (!isOpen) return null;

  return (
    <ul
      role="listbox"
      className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto"
    >
      {children}
    </ul>
  );
}

// ── Single option ─────────────────────────────────────────
interface OptionProps {
  value: string;
  children: ReactNode;
}

function Option({ value: optionValue, children }: OptionProps) {
  const { value, onChange, close } = useSelectContext();
  const isSelected = value === optionValue;

  return (
    <li
      role="option"
      aria-selected={isSelected}
      className={cn(
        'px-3 py-2 text-sm cursor-pointer hover:bg-blue-50',
        isSelected && 'bg-blue-100 font-medium',
      )}
      onClick={() => {
        onChange(optionValue);
        close();
      }}
    >
      {children}
    </li>
  );
}

// ── Assemble compound component ───────────────────────────
export const Select = Object.assign(SelectRoot, {
  Trigger,
  Options,
  Option,
});
