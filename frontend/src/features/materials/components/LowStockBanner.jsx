import { AlertTriangle } from 'lucide-react';
import PropTypes from 'prop-types';
import { Button } from '@/components/ui/Button';
import { isLowStock } from '../utils/materialStockHelpers';

/**
 * LowStockBanner — warning banner shown when one or more materials
 * have fallen below their minimum stock threshold.
 *
 * Returns null (renders nothing) when no materials are low — the
 * banner should only ever appear when there's something to warn about.
 *
 * @param {Object} props
 * @param {Material[]} props.materials - the FULL materials list
 *        (not a filtered/searched subset), so the warning always
 *        reflects true inventory state regardless of what the user
 *        is currently searching for.
 * @param {() => void} [props.onReorderClick]
 */
export function LowStockBanner({ materials, onReorderClick }) {
  const lowStockMaterials = materials.filter(isLowStock);

  if (lowStockMaterials.length === 0) {
    return null;
  }

  const names = lowStockMaterials.map((m) => m.materialName).join(', ');

  return (
    <div className="flex items-center justify-between gap-4 rounded-card border-l-4 border-l-warning border border-border bg-warning/10 px-5 py-4">
      <div className="flex items-start gap-3">
        <AlertTriangle size={20} className="text-warning shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-text-primary">Low stock warning</p>
          <p className="text-sm text-text-secondary mt-0.5">
            {lowStockMaterials.length} material{lowStockMaterials.length > 1 ? 's are' : ' is'} below
            the minimum threshold: {names}.
          </p>
        </div>
      </div>

      <Button variant="secondary" size="sm" onClick={onReorderClick} className="shrink-0">
        Reorder
      </Button>
    </div>
  );
}

LowStockBanner.propTypes = {
  materials: PropTypes.array.isRequired,
  onReorderClick: PropTypes.func,
};