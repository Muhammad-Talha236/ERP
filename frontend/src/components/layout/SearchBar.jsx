import { useState, useRef, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Search, Loader2, User, Package, Factory, ShoppingCart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useGlobalSearch } from '@/features/search/hooks/useGlobalSearch';

/**
 * SearchBar — global search input shown in the Header. Debounces
 * typing, then searches Employees / Materials / Production Orders /
 * Stock Orders in parallel via useGlobalSearch. Results render as a
 * dropdown grouped by category; clicking a result navigates —
 * Employees go straight to the employee's own record page, the
 * other modules go to their list page (no per-item route exists
 * there yet).
 */
export function SearchBar({ className }) {
  const [value, setValue] = useState('');
  const [debouncedValue, setDebouncedValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), 300);
    return () => clearTimeout(timer);
  }, [value]);

  const { data, isFetching } = useGlobalSearch(debouncedValue);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const goTo = (to, params) => {
    navigate(params ? { to, params } : { to });
    setIsOpen(false);
    setValue('');
    setDebouncedValue('');
  };

  const hasQuery = debouncedValue.trim().length >= 2;
  const results = data ?? { employees: [], materials: [], orders: [], stockOrders: [] };
  const totalResults =
    results.employees.length + results.materials.length + results.orders.length + results.stockOrders.length;

  return (
    <div ref={containerRef} className={cn('relative flex-1 max-w-xl', className)}>
      <Search
        size={16}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        placeholder="Search orders, employees, materials..."
        className={cn(
          'w-full h-10 pl-9 pr-4 rounded-input text-sm',
          'bg-surface border border-border text-text-primary',
          'placeholder:text-text-secondary',
          'focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary',
          'transition-colors'
        )}
      />
      {isFetching && (
        <Loader2 size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary animate-spin" />
      )}

      {isOpen && hasQuery && (
        <div className="absolute left-0 right-0 mt-2 rounded-input border border-border bg-background shadow-lg z-50 max-h-96 overflow-y-auto">
          {!isFetching && totalResults === 0 && (
            <p className="px-4 py-3 text-sm text-text-secondary">No results for "{debouncedValue}"</p>
          )}

          {results.employees.length > 0 && (
            <SearchGroup label="Employees" icon={User}>
              {results.employees.map((emp) => (
                <SearchResultRow
                  key={emp.id}
                  title={`${emp.firstName} ${emp.lastName}`}
                  subtitle={emp.employeeCode}
                  onClick={() => goTo('/employees/$employeeId', { employeeId: emp.id })}
                />
              ))}
            </SearchGroup>
          )}

          {results.materials.length > 0 && (
            <SearchGroup label="Materials" icon={Package}>
              {results.materials.map((mat) => (
                <SearchResultRow
                  key={mat.id}
                  title={mat.materialName}
                  subtitle={mat.materialCode}
                  onClick={() => goTo('/materials')}
                />
              ))}
            </SearchGroup>
          )}

          {results.orders.length > 0 && (
            <SearchGroup label="Production Orders" icon={Factory}>
              {results.orders.map((order) => (
                <SearchResultRow
                  key={order.id}
                  title={order.poNumber}
                  subtitle={order.productName || order.customerName}
                  onClick={() => goTo('/Purchase')}
                />
              ))}
            </SearchGroup>
          )}

          {results.stockOrders.length > 0 && (
            <SearchGroup label="Stock Orders" icon={ShoppingCart}>
              {results.stockOrders.map((po) => (
                <SearchResultRow
                  key={po.id}
                  title={po.poNumber}
                  subtitle={po.supplierName}
                  onClick={() => goTo('/StockOrders')}
                />
              ))}
            </SearchGroup>
          )}
        </div>
      )}
    </div>
  );
}

function SearchGroup({ label, icon: Icon, children }) {
  return (
    <div className="border-b border-border last:border-0">
      <p className="flex items-center gap-1.5 px-4 pt-3 pb-1 text-xs font-semibold uppercase tracking-wide text-text-secondary">
        <Icon size={12} /> {label}
      </p>
      <div className="pb-2">{children}</div>
    </div>
  );
}

function SearchResultRow({ title, subtitle, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center justify-between gap-3 px-4 py-2 text-left hover:bg-surface transition-colors"
    >
      <span className="text-sm font-medium text-text-primary truncate">{title}</span>
      {subtitle && <span className="text-xs text-text-secondary truncate shrink-0">{subtitle}</span>}
    </button>
  );
}