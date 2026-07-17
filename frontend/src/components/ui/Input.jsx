import { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { cn } from '@/lib/utils';

/**
 * Input — reusable text/number/date input with label + error message.
 *
 * Uses forwardRef because react-hook-form's register() needs a real
 * ref to the underlying <input> DOM node to wire up validation and
 * focus management. Without forwardRef, RHF cannot register this
 * component correctly.
 *
 * Usage with react-hook-form:
 *   <Input label="First Name" error={errors.firstName?.message}
 *          {...register('firstName')} />
 *
 * @param {Object} props
 * @param {string} [props.label]
 * @param {string} [props.error] - validation error message, if any
 * @param {boolean} [props.required]
 */
export const Input = forwardRef(
  ({ label, error, required, className, id, ...props }, ref) => {
    const inputId = id || props.name;

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-text-primary">
            {label}
            {required && <span className="text-danger ml-0.5">*</span>}
          </label>
        )}

        <input
          ref={ref}
          id={inputId}
          className={cn(
            'h-10 px-3 rounded-input text-sm',
            'bg-background border text-text-primary',
            'placeholder:text-text-secondary',
            'focus:outline-none focus:ring-2 focus:ring-primary/40',
            error ? 'border-danger focus:border-danger' : 'border-border focus:border-primary',
            className
          )}
          {...props}
        />

        {error && <p className="text-xs text-danger">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

Input.propTypes = {
  label: PropTypes.string,
  error: PropTypes.string,
  required: PropTypes.bool,
  className: PropTypes.string,
  id: PropTypes.string,
};