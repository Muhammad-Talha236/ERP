import { useState } from 'react';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * SearchBar — global search input shown in the Header.
 *
 * Currently local-state only (no real search wired up) since
 * cross-module search requires backend + every team's data to exist.
 * Structured so a real onSearch handler can be dropped in later
 * without changing this component's markup or props shape.
 */
export function SearchBar({ className }) {
  const [value, setValue] = useState('');

  return (
    <div className={cn('relative flex-1 max-w-xl', className)}>
      <Search
        size={16}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search orders, employees, materials..."
        className={cn(
          'w-full h-10 pl-9 pr-4 rounded-input text-sm',
          'bg-surface border border-border text-text-primary',
          'placeholder:text-text-secondary',
          'focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary',
          'transition-colors'
        )}
      />
    </div>
  );
}