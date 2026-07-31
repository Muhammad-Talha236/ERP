import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import PropTypes from 'prop-types';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { createBundleSchema } from '../schemas/bundle.schema';
import { useSplitIntoBundles } from '../hooks/useSplitIntoBundles';

/**
 * SplitIntoBundlesForm — name kept for continuity; behavior changed:
 * every order already has a default Bundle 1 (full quantity), so
 * this form CARVES a new bundle's quantity out of an EXISTING bundle
 * the user picks, shrinking that source bundle by the same amount.
 * Total quantity across all bundles never changes.
 */
export function SplitIntoBundlesForm({ orderId, bundles, firstStageName, onDone }) {
  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createBundleSchema),
    defaultValues: { sourceBundleId: bundles[0]?.id ?? '', quantity: '' },
  });

  const { mutate: createBundle, isPending } = useSplitIntoBundles();

  const sourceBundleId = watch('sourceBundleId');
  const sourceBundle = bundles.find((b) => b.id === sourceBundleId);
  const quantity = Number(watch('quantity')) || 0;

  const onSubmit = (formData) => {
    createBundle(
      { orderId, sourceBundleId: formData.sourceBundleId, quantity: formData.quantity, firstStageName },
      {
        onSuccess: () => onDone(),
        onError: (err) => setError('quantity', { message: err.message }),
      }
    );
  };

  return (
    <div className="rounded-input border border-border p-4">
      <p className="text-sm font-semibold text-text-primary mb-1">Create New Bundle</p>
      <p className="text-xs text-text-secondary mb-3">Move some quantity out of an existing bundle to form a new one.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-[1fr_140px_auto] gap-3 items-end">
        <Select
          label="From bundle"
          error={errors.sourceBundleId?.message}
          {...register('sourceBundleId')}
          options={bundles.map((b) => ({ label: `${b.bundleNumber} (qty ${b.quantity})`, value: b.id }))}
        />
        <Input label="New bundle qty" type="number" error={errors.quantity?.message} {...register('quantity')} />
        <Button type="submit" disabled={isPending || quantity <= 0}>
          {isPending ? 'Creating...' : 'Create'}
        </Button>
      </form>

      {sourceBundle && quantity > 0 && (
        <p className="text-xs text-text-secondary mt-2">
          {sourceBundle.bundleNumber} will become {Math.max(sourceBundle.quantity - quantity, 0)}, new bundle will be {quantity}.
        </p>
      )}
    </div>
  );
}

SplitIntoBundlesForm.propTypes = {
  orderId: PropTypes.string.isRequired,
  bundles: PropTypes.array.isRequired,
  firstStageName: PropTypes.string.isRequired,
  onDone: PropTypes.func.isRequired,
};