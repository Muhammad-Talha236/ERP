import { Search, Filter } from 'lucide-react';
import PropTypes from 'prop-types';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

/**
 * EmployeeFilters — search input + department dropdown above the
 * employee table.
 *
 * Deliberately "controlled" — it doesn't hold its own state. The
 * parent (EmployeesPage) owns the filters object and passes down
 * both the current values and a change handler. This keeps
 * EmployeesPage as the single source of truth that feeds
 * useEmployees(filters), so the table and filter UI can never
 * drift out of sync.
 *
 * @param {Object} props
 * @param {{search: string, department: string}} props.filters
 * @param {(next: object) => void} props.onFilterChange
 * @param {string[]} props.departmentOptions
 * @param {() => void} props.onAddClick
 */
export function EmployeeFilters({
  filters,
  onFilterChange,
  departmentOptions,
  onAddClick,
}) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Search input */}
      <div className="relative flex-1 min-w-[240px]">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none"
        />
        <input
          type="text"
          value={filters.search}
          onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
          placeholder="Search employees..."
          className={cn(
            'w-full h-10 pl-9 pr-4 rounded-input text-sm',
            'bg-background border border-border text-text-primary',
            'placeholder:text-text-secondary',
            'focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary'
          )}
        />
      </div>

      {/* Department dropdown */}
      <select
        value={filters.department}
        onChange={(e) => onFilterChange({ ...filters, department: e.target.value })}
        className={cn(
          'h-10 px-3 rounded-input text-sm min-w-[180px]',
          'bg-background border border-border text-text-primary',
          'focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary'
        )}
      >
        <option value="all">All departments</option>
        {departmentOptions.map((dept) => (
          <option key={dept} value={dept}>
            {dept}
          </option>
        ))}
      </select>

      <Button variant="outline" size="icon" aria-label="More filters">
        <Filter size={16} />
      </Button>

      <Button onClick={onAddClick} className="ml-auto">
        + Add Employee
      </Button>
    </div>
  );
}

EmployeeFilters.propTypes = {
  filters: PropTypes.shape({
    search: PropTypes.string,
    department: PropTypes.string,
  }).isRequired,
  onFilterChange: PropTypes.func.isRequired,
  departmentOptions: PropTypes.arrayOf(PropTypes.string).isRequired,
  onAddClick: PropTypes.func.isRequired,
};