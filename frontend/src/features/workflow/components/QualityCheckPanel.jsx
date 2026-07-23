import { useState } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';
import PropTypes from 'prop-types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useApproveQualityCheck, useRejectQualityCheck } from '@/features/Purchaseorder/hooks/useQualityCheckAction';

/**
 * QualityCheckPanel — admin-only verification gate for the Quality
 * Check stage. Unlike other stages (where individual employees mark
 * their own work done), Quality Check requires a deliberate human
 * decision: Approve (order moves to Completed) or Reject (order
 * goes back to In Progress, and this stage's work must be redone).
 *
 * @param {Object} props
 * @param {OrderWorkflowStep} props.step
 * @param {() => void} props.onApproved - the stage passed, advance the order
 * @param {() => void} props.onRejected - the stage failed, send back
 */
export function QualityCheckPanel({ step, onApproved, onRejected }) {
  const [remarks, setRemarks] = useState('');

  const { mutate: approve, isPending: isApproving } = useApproveQualityCheck();
  const { mutate: reject, isPending: isRejecting } = useRejectQualityCheck();

  const handleApprove = () => {
    approve(step.id, { onSuccess: () => onApproved() });
  };

  const handleReject = () => {
    reject(step.id, { onSuccess: () => onRejected() });
  };

  return (
    <div className="space-y-3">
      <p className="text-sm text-text-secondary">
        Review this order's production output before final approval. Rejecting will send it
        back to <span className="font-semibold text-text-primary">In Progress</span> so the
        team can address issues.
      </p>

      <Input
        label="Remarks (optional)"
        placeholder="e.g. Minor defects found on batch 2"
        value={remarks}
        onChange={(e) => setRemarks(e.target.value)}
      />

      <div className="flex gap-3">
        <Button variant="danger" size="sm" onClick={handleReject} disabled={isApproving || isRejecting}>
          <XCircle size={14} /> {isRejecting ? 'Rejecting...' : 'Reject'}
        </Button>
        <Button size="sm" onClick={handleApprove} disabled={isApproving || isRejecting}>
          <CheckCircle2 size={14} /> {isApproving ? 'Approving...' : 'Approve'}
        </Button>
      </div>
    </div>
  );
}

QualityCheckPanel.propTypes = {
  step: PropTypes.object.isRequired,
  onApproved: PropTypes.func.isRequired,
  onRejected: PropTypes.func.isRequired,
};