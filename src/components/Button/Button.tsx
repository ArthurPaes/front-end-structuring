/**
 * @file Button atom — the most fundamental interactive element.
 *
 * SOLID PRINCIPLES APPLIED:
 *   - Single Responsibility: renders a button, nothing else.
 *   - Open/Closed: extendable via `variant`, `size`, `className` props — no if/else chains.
 *   - Interface Segregation: only accepts button-relevant props.
 *   - Liskov Substitution: extends native button — any <button> usage can be replaced with <Button>.
 *
 * PERFORMANCE: React Compiler handles memoisation automatically in React 19.
 * No manual React.memo() needed.
 *
 * A11Y: Uses native <button> element, inherits all aria attributes.
 */
import { type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/utils/cn';
import styles from './Button.module.css';

// ── Prop interfaces (Interface Segregation) ───────────────
interface ButtonBaseProps {
  /** Visual variant */
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  /** Size preset */
  size?: 'sm' | 'md' | 'lg';
  /** Show loading spinner and disable interactions */
  isLoading?: boolean;
  /** Content */
  children: ReactNode;
}

export type ButtonProps = ButtonBaseProps & ButtonHTMLAttributes<HTMLButtonElement>;

// ── Variant & size maps (Open/Closed) ─────────────────────
const variantClasses: Record<NonNullable<ButtonBaseProps['variant']>, string> = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500',
  secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus-visible:ring-gray-400',
  danger: 'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500',
  ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 focus-visible:ring-gray-400',
};

const sizeClasses: Record<NonNullable<ButtonBaseProps['size']>, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
};

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  children,
  className,
  disabled,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={cn(
        styles.button,
        'inline-flex items-center justify-center rounded-lg font-medium',
        'transition-colors duration-150',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      disabled={disabled || isLoading}
      aria-busy={isLoading}
      {...rest}
    >
      {isLoading && (
        <span className="mr-2 animate-spin" aria-hidden="true">
          ⏳
        </span>
      )}
      {children}
    </button>
  );
}
