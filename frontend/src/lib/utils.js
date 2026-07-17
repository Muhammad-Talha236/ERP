import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * cn() — the single utility every component in this project uses
 * to build its className string.
 *
 * Combines two libraries:
 *  - clsx: lets us pass conditional classes as objects/arrays and
 *           safely ignores false/null/undefined values
 *  - twMerge: resolves conflicts between Tailwind utility classes,
 *              so the LAST conflicting class always wins predictably
 *              (e.g. a parent overriding a child's default background)
 *
 * Example usage inside a component:
 *
 *   <div className={cn(
 *     "px-4 py-2 rounded-button bg-surface",   // base styles
 *     isActive && "bg-primary text-white",      // conditional style
 *     className                                  // allow parent override
 *   )} />
 *
 * @param  {...(string|Object|Array|undefined|null|false)} inputs
 * @returns {string} final, deduplicated className string
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}