import PropTypes from 'prop-types';
import { MaterialCard } from './MaterialCard';
import { LoadingSkeleton } from '@/components/feedback/LoadingSkeleton';
import { EmptyState } from '@/components/feedback/EmptyState';
import { Package } from 'lucide-react';

/**
 * MaterialGrid — responsive grid of MaterialCards, matching the
 * 3-column layout in the design screenshot (collapses to fewer
 * columns on smaller screens).
 *
 * @param {Object} props
 * @param {Material[]} props.materials
 * @param {boolean} props.isLoading
 * @param {(material: Material) => void} props.onCardClick
 */
export function MaterialGrid({ materials, isLoading, onCardClick }) {
  if (isLoading) {
    return <LoadingSkeleton rows={3} />;
  }

  if (!materials || materials.length === 0) {
    return (
      <EmptyState
        icon={Package}
        title="No materials found"
        description="Try adjusting your search, or add a new material to inventory."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {materials.map((material) => (
        <MaterialCard
          key={material.id}
          material={material}
          onClick={() => onCardClick(material)}
        />
      ))}
    </div>
  );
}

MaterialGrid.propTypes = {
  materials: PropTypes.array,
  isLoading: PropTypes.bool,
  onCardClick: PropTypes.func,
};