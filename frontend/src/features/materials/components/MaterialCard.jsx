import { Package } from 'lucide-react';
import PropTypes from 'prop-types';
import { formatDistanceToNow } from 'date-fns';
import { Badge } from '@/components/ui/Badge';
import { isLowStock, getStockProgressPercent, getStockBarColor } from '../utils/materialStockHelpers';

/**
 * MaterialCard — single raw material card showing stock level,
 * a visual progress bar, and supplier info, matching the design
 * screenshot exactly.
 *
 * @param {Object} props
 * @param {Material} props.material
 * @param {() => void} [props.onClick] - opens edit modal / history
 */
export function MaterialCard({ material, onClick }) {
  const low = isLowStock(material);
  const progressPercent = getStockProgressPercent(material);
  const barColor = getStockBarColor(material);

  return (
    <div className="rounded-card border border-border bg-background p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-input bg-primary/15 text-primary flex items-center justify-center shrink-0">
            <Package size={18} />
          </div>
          <div>
            <p className="text-sm font-semibold text-text-primary">{material.materialName}</p>
            <p className="text-xs text-text-secondary">{material.materialCode}</p>
          </div>
        </div>

        {low && <Badge variant="danger">Low</Badge>}
      </div>

      <div className="flex items-baseline gap-1.5 mb-3">
        <span className="text-3xl font-bold text-text-primary">
          {material.currentStock.toLocaleString()}
        </span>
        <span className="text-sm text-text-secondary">{material.unit.toLowerCase()}s</span>
      </div>

      {/* Stock progress bar */}
      <div className="w-full h-1.5 rounded-full bg-surface overflow-hidden mb-2">
        <div
          className={`h-full rounded-full ${barColor}`}
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <div className="flex items-center justify-between text-xs text-text-secondary mb-4">
        <span>Min: {material.minimumStock.toLocaleString()}</span>
        <span>Updated {formatDistanceToNow(new Date(material.lastUpdated), { addSuffix: true })}</span>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-border">
        <span className="text-xs text-text-secondary">{material.supplierName}</span>
        <button
          type="button"
          onClick={onClick}
          className="text-xs font-semibold text-primary hover:text-primary-hover transition-colors"
        >
          History
        </button>
      </div>
    </div>
  );
}

MaterialCard.propTypes = {
  material: PropTypes.object.isRequired,
  onClick: PropTypes.func,
};