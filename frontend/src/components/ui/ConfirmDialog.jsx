import PropTypes from 'prop-types';
import { Modal } from './Modal';
import { Button } from './Button';

/**
 * ConfirmDialog — generic confirmation modal for destructive actions.
 *
 * Matches the UI doc's Confirmation Dialog spec exactly:
 * "Delete Employee? / This action cannot be undone. / Cancel / Delete"
 *
 * Reused across every module wherever a destructive action needs
 * confirmation first — not just Employees.
 *
 * @param {Object} props
 * @param {boolean} props.open
 * @param {(open: boolean) => void} props.onOpenChange
 * @param {string} props.title - e.g. "Delete Employee?"
 * @param {string} props.description
 * @param {() => void} props.onConfirm
 * @param {boolean} [props.isConfirming] - shows loading state on confirm button
 */
export function ConfirmDialog({ open, onOpenChange, title, description, onConfirm, isConfirming }) {
  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description={description}
      size="sm"
      footer={
        <>
          <Button variant="secondary" onClick={() => onOpenChange(false)} disabled={isConfirming}>
            Cancel
          </Button>
          <Button variant="danger" onClick={onConfirm} disabled={isConfirming}>
            {isConfirming ? 'Deleting...' : 'Delete'}
          </Button>
        </>
      }
    >
      {/* Body intentionally minimal — description above already
          conveys the warning per the UI doc's simple confirmation spec */}
      <p className="text-sm text-text-secondary">
        Please confirm you want to proceed. This action cannot be undone.
      </p>
    </Modal>
  );
}

ConfirmDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onOpenChange: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  onConfirm: PropTypes.func.isRequired,
  isConfirming: PropTypes.bool,
};