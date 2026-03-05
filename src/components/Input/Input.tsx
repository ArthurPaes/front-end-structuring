/**
 * @file Input atom — accessible text input with label support.
 *
 * SOLID: Liskov Substitution — extends native <input>, fully compatible.
 */
import { type InputHTMLAttributes, forwardRef, type Ref } from 'react';
import { cn } from '@/utils/cn';
import styles from './Input.module.css';

interface InputBaseProps {
  /** Error message — shows error styling and message below input */
  error?: string;
  /** Label text */
  label?: string;
}

export type InputProps = InputBaseProps & InputHTMLAttributes<HTMLInputElement>;

function InputInner(
  { error, label, className, id, ...rest }: InputProps,
  ref: Ref<HTMLInputElement>,
) {
  const inputId = id ?? rest.name;

  return (
    <div className={styles.wrapper}>
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        className={cn(
          'w-full rounded-lg border px-3 py-2 text-sm',
          'focus:outline-none focus:ring-2 focus:ring-offset-1',
          'transition-colors duration-150',
          error
            ? 'border-red-500 focus:ring-red-500'
            : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500',
          className,
        )}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${inputId}-error` : undefined}
        {...rest}
      />
      {error && (
        <p id={`${inputId}-error`} className="mt-1 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export const Input = forwardRef(InputInner);
Input.displayName = 'Input';
