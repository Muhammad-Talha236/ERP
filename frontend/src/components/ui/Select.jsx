import { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';
import PropTypes from 'prop-types';
import { cn } from '@/lib/utils';

/**
 * Select — reusable dropdown with label + error message, matching
 * Input's API so both can be used interchangeably in forms.
 *
 * Deliberately built on a native <select> rather than a custom
 * Radix dropdown: for FORM fields specifically, native selects are
 * simpler, fully accessible out of the box, and give a better
 * experience on mobile (native OS picker). Radix's Dropdown/Select
 * primitives are better reserved for non-form UI, like a table row's
 * actions menu, which we'll build separately.
 *
 * @param {Object} props
 * @param {string} [props.label]
 * @param {string} [props.error]
 * @param {boolean} [props.required]
 * @param {{label: string, value: string}[]} props.options
 */
export const Select = forwardRef(
  ({ label, error, required, options, className, id, ...props }, ref) => {
    const selectId = id || props.name;

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={selectId} className="text-sm font-medium text-text-primary">
            {label}
            {required && <span className="text-danger ml-0.5">*</span>}
          </label>
        )}

        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={cn(
              'w-full h-10 pl-3 pr-9 rounded-input text-sm appearance-none',
              'bg-background border text-text-primary',
              'focus:outline-none focus:ring-2 focus:ring-primary/40',
              error ? 'border-danger focus:border-danger' : 'border-border focus:border-primary',
              className
            )}
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown
            size={16}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none"
          />
        </div>

        {error && <p className="text-xs text-danger">{error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';

Select.propTypes = {
  label: PropTypes.string,
  error: PropTypes.string,
  required: PropTypes.bool,
  options: PropTypes.arrayOf(
    PropTypes.shape({ label: PropTypes.string, value: PropTypes.string })
  ).isRequired,
  className: PropTypes.string,
  id: PropTypes.string,
};