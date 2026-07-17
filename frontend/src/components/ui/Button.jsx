import { forwardRef } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';
import PropTypes from 'prop-types';
import { cn } from '@/lib/utils';

/**
 * buttonVariants — defines every visual variant/size combination
 * as Tailwind class strings, using cva for a clean, declarative API.
 *
 * Variants match the UI/UX doc's Button Types table:
 * Primary, Secondary, Outline, Ghost, Danger.
 */
const buttonVariants = cva(
  // Base classes applied to EVERY button regardless of variant
  'inline-flex items-center justify-center gap-2 rounded-button font-semibold text-sm transition-colors duration-150 disabled:opacity-50 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-white hover:bg-primary-hover',
        secondary: 'bg-surface text-text-primary border border-border hover:bg-border/50',
        outline: 'border border-border text-text-primary hover:bg-surface',
        ghost: 'text-text-secondary hover:bg-surface hover:text-text-primary',
        danger: 'bg-danger text-white hover:bg-danger/90',
      },
      size: {
        sm: 'h-8 px-3 text-xs',
        md: 'h-10 px-4',
        lg: 'h-12 px-6 text-base',
        icon: 'h-9 w-9 shrink-0', // square button for icon-only actions (header bell, theme toggle)
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

/**
 * Button — the single reusable button component for the entire app.
 *
 * @param {Object} props
 * @param {'primary'|'secondary'|'outline'|'ghost'|'danger'} [props.variant]
 * @param {'sm'|'md'|'lg'|'icon'} [props.size]
 * @param {boolean} [props.asChild] - if true, renders props.children's
 *        own element (via Radix Slot) instead of a <button>, while
 *        still applying button styles/behavior. Useful for e.g.
 *        making a <Link> look exactly like a button.
 */
export const Button = forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    // Slot lets us "merge" button styling onto a child element
    // (e.g. a router Link) instead of always rendering a real <button>
    const Comp = asChild ? Slot : 'button';

    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

Button.propTypes = {
  variant: PropTypes.oneOf(['primary', 'secondary', 'outline', 'ghost', 'danger']),
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'icon']),
  asChild: PropTypes.bool,
  className: PropTypes.string,
};