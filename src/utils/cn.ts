/**
 * @file Classname merge utility — combines clsx and tailwind-merge.
 *
 * WHY: `clsx` handles conditional classes, `tailwind-merge` deduplicates
 * conflicting Tailwind classes (e.g., `px-2 px-4` → `px-4`).
 */
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
