import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import PropTypes from 'prop-types';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { splitIntoBundlesSchema } from '../schemas/bundle.schema';
import { useSplitIntoBundles } from '../hooks/useSplitIntoBundles';

/**
 * SplitIntoBundlesForm — shown when an order has no bundles yet.
 * Admin enters how many units per bundle; shows a live preview of
 * how many bundles that creates (including a smaller final "leftover"
 * bundle if the total doesn't divide evenly).
 *
 * @param {Object} props
 * @param {string} props.orderId
 * @param {number} props.totalQuantity
 * @param {string} props.firstStageName
 */
export function SplitIntoBundlesForm({ orderId, totalQuantity, firstStageName }) {
  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    resolver: zodResolver(splitIntoBundlesSchema),
    defaultValues: { quantityPerBundle: '' },
  });

  const { mutate: splitBundles, isPending } = useSplitIntoBundles();

  const quantityPerBundle = Number(watch('quantityPerBundle')) || 0;
  const fullBundles = quantityPerBundle > 0 ? Math.floor(totalQuantity / quantityPerBundle) : 0;
  const remainder = quantityPerBundle > 0 ? totalQuantity % quantityPerBundle : 0;

  const onSubmit = (formData) => {
    splitBundles({
      orderId,
      totalQuantity,
      quantityPerBundle: formData.quantityPerBundle,
      firstStageName,
    });
  };

  return (
    <div className="rounded-input border border-border p-5 text-center">
      <p className="text-sm font-semibold text-text-primary mb-1">No bundles yet</p>
      <p className="text-xs text-text-secondary mb-4">
        Split this order's {totalQuantity.toLocaleString()} units into bundles to track them individually.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="flex items-end justify-center gap-3 max-w-xs mx-auto">
        <Input
          label="Units per bundle"
          type="number"
          error={errors.quantityPerBundle?.message}
          {...register('quantityPerBundle')}
        />
        <Button type="submit" disabled={isPending || quantityPerBundle <= 0}>
          {isPending ? 'Splitting...' : 'Split'}
        </Button>
      </form>

      {quantityPerBundle > 0 && (
        <p className="text-xs text-text-secondary mt-3">
          This will create {fullBundles} bundle{fullBundles !== 1 ? 's' : ''} of {quantityPerBundle.toLocaleString()}
          {remainder > 0 && <> + 1 final bundle of {remainder.toLocaleString()}</>}.
        </p>
      )}
    </div>
  );
}

SplitIntoBundlesForm.propTypes = {
  orderId: PropTypes.string.isRequired,
  totalQuantity: PropTypes.number.isRequired,
  firstStageName: PropTypes.string.isRequired,
};