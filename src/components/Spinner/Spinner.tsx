/**
 * @file Spinner — loading indicator atom.
 *
 * A11Y: Uses role="status" and sr-only label.
 */

import { cn } from '@/utils/cn';

interface SpinnerProps {
  /** Size in Tailwind units */
  size?: 'sm' | 'md' | 'lg';
  /** Screen-reader label */
  label?: string;
  className?: string;
}

const sizeMap = { sm: 'h-4 w-4', md: 'h-8 w-8', lg: 'h-12 w-12' } as const;

export function Spinner({ size = 'md', label = 'Loading…', className }: SpinnerProps) {
  return (
    <div role="status" className={cn('inline-flex items-center justify-center', className)}>
      <div
        className={cn(
          'animate-spin rounded-full border-4 border-gray-200 border-t-blue-600',
          sizeMap[size],
        )}
        aria-hidden="true"
      />
      <span className="sr-only">{label}</span>
    </div>
  );
}
