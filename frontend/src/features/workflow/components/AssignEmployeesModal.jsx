import PropTypes from 'prop-types';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { BundleWorkflowModal } from './BundleWorkflowModal';

/**
 * AssignEmployeesModal — opened from a bundle's "Assign Employees"
 * button. Shows that bundle's own stage-by-stage workflow.
 *
 * Bulk assignment mode removed per feedback — instead, EVERY stage
 * row (not just the active one) now shows its own "add employee"
 * form directly, so the user can pre-assign anyone to any upcoming
 * stage without a separate bulk screen. Only marking a stage's work
 * DONE stays restricted to the current active stage.
 */
export function AssignEmployeesModal({ open, onOpenChange, bundle, steps }) {
  if (!bundle) return null;

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={`Assign Employees — ${bundle.bundleNumber}`}
      description={`Quantity: ${bundle.quantity} · Status: ${bundle.status}`}
      size="lg"
      footer={
        <Button variant="secondary" onClick={() => onOpenChange(false)}>
          Close
        </Button>
      }
    >
      <BundleWorkflowModal bundle={bundle} steps={steps} />
    </Modal>
  );
}

AssignEmployeesModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onOpenChange: PropTypes.func.isRequired,
  bundle: PropTypes.object,
  steps: PropTypes.array.isRequired,
};