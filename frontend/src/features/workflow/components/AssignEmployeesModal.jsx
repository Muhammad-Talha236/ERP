import PropTypes from 'prop-types';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { BundleWorkflowModal } from './BundleWorkflowModal';

/**
 * AssignEmployeesModal — opened from a bundle's "Assign Employees"
 * button. Shows that bundle's own stage-by-stage workflow.
 */
export function AssignEmployeesModal({ open, onOpenChange, bundle, steps }) {
  if (!bundle) return null;

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={`Assign Employees — ${bundle.id || bundle.bundleNumber}`}
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