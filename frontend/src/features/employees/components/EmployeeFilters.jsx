import { Search, Filter } from 'lucide-react';
import PropTypes from 'prop-types';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

/**
 * EmployeeFilters — search input + department dropdown above the
 * employee table.
 *
 * Responsive: on phone, everything stacks into full-width rows
 * (search on its own line, then filters, then a full-width
 * "Add Employee" button) instead of squeezing into one cramped row.
 */
export function EmployeeFilters({
  filters,
  onFilterChange,
  departmentOptions,
  onAddClick,
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3">
      {/* Search input */}
      <div className="relative flex-1 min-w-0 sm:min-w-[240px]">
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

      <div className="flex items-center gap-3">
        {/* Department dropdown */}
        <select
          value={filters.department}
          onChange={(e) => onFilterChange({ ...filters, department: e.target.value })}
          className={cn(
            'flex-1 sm:flex-initial h-10 px-3 rounded-input text-sm min-w-0 sm:min-w-[180px]',
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

        <Button variant="outline" size="icon" aria-label="More filters" className="shrink-0">
          <Filter size={16} />
        </Button>
      </div>

      <Button onClick={onAddClick} className="w-full sm:w-auto sm:ml-auto justify-center">
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