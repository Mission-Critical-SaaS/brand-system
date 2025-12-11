import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility function for merging Tailwind CSS classes with proper precedence.
 * Combines clsx for conditional classes with tailwind-merge for deduplication.
 *
 * @example
 * cn('px-4 py-2', isActive && 'bg-blue-500', className)
 * cn('px-4', 'px-8') // => 'px-8' (tailwind-merge handles conflicts)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
