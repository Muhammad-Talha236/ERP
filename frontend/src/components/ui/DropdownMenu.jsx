import * as RadixDropdown from '@radix-ui/react-dropdown-menu';
import PropTypes from 'prop-types';
import { cn } from '@/lib/utils';

/**
 * DropdownMenu — generic dropdown menu wrapper around Radix's
 * DropdownMenu primitive. Used for row actions (View/Edit/Delete)
 * across every module's table.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.trigger - the element that opens the menu
 * @param {{label: string, icon?: React.ComponentType, onClick: () => void, danger?: boolean}[]} props.items
 */
export function DropdownMenu({ trigger, items }) {
  return (
    <RadixDropdown.Root>
      <RadixDropdown.Trigger asChild>{trigger}</RadixDropdown.Trigger>

      <RadixDropdown.Portal>
        <RadixDropdown.Content
          align="end"
          sideOffset={4}
          className={cn(
            'min-w-[160px] rounded-input border border-border bg-background shadow-lg py-1 z-50',
            'animate-in fade-in zoom-in-95 duration-100'
          )}
        >
          {items.map((item) => (
            <RadixDropdown.Item
              key={item.label}
              onClick={item.onClick}
              className={cn(
                'flex items-center gap-2 px-3 py-2 text-sm cursor-pointer outline-none',
                'hover:bg-surface transition-colors',
                item.danger ? 'text-danger' : 'text-text-primary'
              )}
            >
              {item.icon && <item.icon size={14} />}
              {item.label}
            </RadixDropdown.Item>
          ))}
        </RadixDropdown.Content>
      </RadixDropdown.Portal>
    </RadixDropdown.Root>
  );
}

DropdownMenu.propTypes = {
  trigger: PropTypes.node.isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      icon: PropTypes.elementType,
      onClick: PropTypes.func.isRequired,
      danger: PropTypes.bool,
    })
  ).isRequired,
};