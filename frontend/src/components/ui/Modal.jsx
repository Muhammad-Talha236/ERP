import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import PropTypes from 'prop-types';
import { cn } from '@/lib/utils';

/**
 * Modal — reusable dialog wrapper built on Radix's Dialog primitive.
 *
 * Radix handles the hard accessibility problems for free:
 *  - Focus trapped inside the modal while open
 *  - ESC key closes it
 *  - Click outside closes it
 *  - Proper aria-modal / role="dialog" wiring
 *
 * We only supply the visual styling and a Header/Body/Footer
 * structure matching the UI doc's Modal Structure spec.
 *
 * @param {Object} props
 * @param {boolean} props.open
 * @param {(open: boolean) => void} props.onOpenChange
 * @param {string} props.title
 * @param {string} [props.description]
 * @param {React.ReactNode} props.children - modal body content
 * @param {React.ReactNode} [props.footer] - typically Cancel/Confirm buttons
 * @param {'sm'|'md'|'lg'} [props.size]
 */
export function Modal({ open, onOpenChange, title, description, children, footer, size = 'md' }) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        {/* Overlay dims the background behind the modal */}
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-40 animate-in fade-in duration-150" />

        <Dialog.Content
          className={cn(
            'fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50',
            'w-full rounded-modal bg-background border border-border shadow-xl',
            'max-h-[85vh] flex flex-col',
            sizeStyles[size]
          )}
        >
          {/* Header */}
          <div className="flex items-start justify-between px-6 py-5 border-b border-border">
            <div>
              <Dialog.Title className="text-lg font-bold text-text-primary">
                {title}
              </Dialog.Title>
              {description && (
                <Dialog.Description className="text-sm text-text-secondary mt-1">
                  {description}
                </Dialog.Description>
              )}
            </div>
            <Dialog.Close className="text-text-secondary hover:text-text-primary transition-colors">
              <X size={18} />
            </Dialog.Close>
          </div>

          {/* Body — scrollable if content is tall */}
          <div className="px-6 py-5 overflow-y-auto flex-1">{children}</div>

          {/* Footer */}
          {footer && (
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border">
              {footer}
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

const sizeStyles = {
  sm: 'max-w-md',
  md: 'max-w-xl',
  lg: 'max-w-3xl', // matches UI doc's "Maximum width 700px" guidance, roughly
};

Modal.propTypes = {
  open: PropTypes.bool.isRequired,
  onOpenChange: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  children: PropTypes.node,
  footer: PropTypes.node,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
};