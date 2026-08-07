import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import PropTypes from 'prop-types';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { createBundleSchema, createInitialBundleSchema } from '../schemas/bundle.schema';
import { useSplitIntoBundles } from '../hooks/useSplitIntoBundles';
import { useCreateBundle } from '../hooks/useCreateBundle';

/**
 * SplitIntoBundlesForm — Carves a new bundle's quantity out of an EXISTING bundle,
 * or creates the first bundle for an order (capped at the order's total quantity).
 *
 * `orderId` here must be the PO NUMBER (e.g. "PO-6365"), not the numeric
 * database id — the backend looks up production_orders by po_number.
 */
export function SplitIntoBundlesForm({ orderId, orderQuantity, bundles, firstStageName, onDone }) {
  const isInitialBundle = bundles.length === 0;

  const allocatedQuantity = bundles.reduce((sum, b) => sum + Number(b.quantity || 0), 0);
  const remainingQuantity = Math.max(0, Number(orderQuantity || 0) - allocatedQuantity);

  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(isInitialBundle ? createInitialBundleSchema : createBundleSchema),
    defaultValues: {
      sourceBundleId: bundles[0]?.id ?? '',
      quantity: '',
    },
  });

  const { mutate: splitBundle, isPending: isSplitting } = useSplitIntoBundles();
  const { mutate: createInitialBundle, isPending: isCreatingInitial } = useCreateBundle();

  const sourceBundleId = watch('sourceBundleId');
  const sourceBundle = bundles.find((b) => b.id === sourceBundleId);

  const rawQty = watch('quantity');
  const quantity = Number(rawQty) || 0;

  const isQuantityValid = isInitialBundle
    ? quantity > 0 && quantity <= remainingQuantity
    : sourceBundle && quantity > 0 && quantity < sourceBundle.quantity;

  const onSubmit = (formData) => {
    if (isInitialBundle) {
      if (Number(formData.quantity) > remainingQuantity) {
        setError('quantity', {
          message: `Quantity cannot exceed the order total (${orderQuantity}). Max available: ${remainingQuantity}.`,
        });
        return;
      }

      createInitialBundle(
        {
          poNumber: orderId,
          quantity: Number(formData.quantity),
          stageName: firstStageName,
        },
        {
          onSuccess: () => {
            if (onDone) onDone();
          },
          onError: (err) => {
            setError('quantity', { message: err.message || 'Failed to create bundle' });
          },
        }
      );
      return;
    }

    splitBundle(
      {
        sourceBundleId: formData.sourceBundleId,
        newQty: Number(formData.quantity),
        poNumber: orderId,
      },
      {
        onSuccess: () => {
          if (onDone) onDone();
        },
        onError: (err) => {
          setError('quantity', { message: err.message || 'Failed to split bundle' });
        },
      }
    );
  };

  const isPending = isSplitting || isCreatingInitial;

  return (
    <div className="rounded-input border border-border p-4">
      <p className="text-sm font-semibold text-text-primary mb-1">
        {isInitialBundle ? 'Create First Bundle' : 'Create New Bundle'}
      </p>
      <p className="text-xs text-text-secondary mb-3">
        {isInitialBundle
          ? 'This order has no bundles yet. Add the first bundle to begin tracking production.'
          : 'Move some quantity out of an existing bundle to form a new one.'}
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-[1fr_140px_auto] gap-3 items-end">
        {!isInitialBundle && (
          <Select
            label="From bundle"
            error={errors.sourceBundleId?.message}
            {...register('sourceBundleId')}
            options={bundles.map((b) => ({ label: `${b.bundleNumber || b.id} (qty ${b.quantity})`, value: b.id }))}
          />
        )}

        <Input
          label={isInitialBundle ? 'Bundle quantity' : 'New bundle qty'}
          type="number"
          min="1"
          max={isInitialBundle ? remainingQuantity : sourceBundle ? sourceBundle.quantity - 1 : undefined}
          error={errors.quantity?.message}
          {...register('quantity', { valueAsNumber: true, min: 1 })}
        />
        <Button type="submit" disabled={isPending || !isQuantityValid}>
          {isPending ? 'Creating...' : 'Create'}
        </Button>
      </form>

      {isInitialBundle && quantity > 0 && (
        <p className={`text-xs mt-2 ${quantity > remainingQuantity ? 'text-red-500 font-medium' : 'text-text-secondary'}`}>
          {quantity > remainingQuantity
            ? `Quantity cannot exceed the order total (${orderQuantity}). Max available: ${remainingQuantity}.`
            : `${remainingQuantity - quantity} of ${orderQuantity} will remain after this bundle.`}
        </p>
      )}

      {!isInitialBundle && sourceBundle && quantity > 0 && (
        <p className={`text-xs mt-2 ${quantity >= sourceBundle.quantity ? 'text-red-500 font-medium' : 'text-text-secondary'}`}>
          {quantity >= sourceBundle.quantity
            ? `Quantity must be less than current bundle total (${sourceBundle.quantity}).`
            : `${sourceBundle.bundleNumber || sourceBundle.id} will become ${sourceBundle.quantity - quantity}, new bundle will be ${quantity}.`}
        </p>
      )}
    </div>
  );
}

SplitIntoBundlesForm.propTypes = {
  orderId: PropTypes.string.isRequired,
  orderQuantity: PropTypes.number.isRequired,
  bundles: PropTypes.array.isRequired,
  firstStageName: PropTypes.string.isRequired,
  onDone: PropTypes.func.isRequired,
};