import { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import { LoadingSkeleton } from '@/components/feedback/LoadingSkeleton';
import { EmptyState } from '@/components/feedback/EmptyState';
import {
  Pencil,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

export function RecentEntriesTable({
  entries = [],
  isLoading,
  onEditClick,
}) {
  const [currentPage, setCurrentPage] = useState(1);

  const ROWS_PER_PAGE = 5;

  // --------------------------------------------------
  // Material keys
  // --------------------------------------------------

  const materialKeys = useMemo(() => {
    const keys = new Set();

    entries.forEach((entry) => {
      const matName =
        entry.materialName ||
        entry.material_name ||
        entry.category ||
        'Material';

      keys.add(matName);
    });

    return Array.from(keys);
  }, [entries]);

  // --------------------------------------------------
  // Group entries by date
  // --------------------------------------------------

  const groupedData = useMemo(() => {
    const map = {};

    entries.forEach((entry) => {
      const date =
        entry.usageDate ||
        entry.usage_date ||
        new Date().toISOString().split('T')[0];

      if (!map[date]) {
        map[date] = {
          date,
          total: 0,
          entries: [],
        };

        materialKeys.forEach((key) => {
          map[date][key] = 0;
        });
      }

      const matName =
        entry.materialName ||
        entry.material_name ||
        entry.category ||
        'Material';

      const qty = Number(
        entry.quantityUsed ||
          entry.quantity_used ||
          0
      );

      map[date][matName] =
        (map[date][matName] || 0) + qty;

      map[date].total += qty;
      map[date].entries.push(entry);
    });

    return Object.values(map).sort(
      (a, b) =>
        new Date(b.date) - new Date(a.date)
    );
  }, [entries, materialKeys]);

  // --------------------------------------------------
  // Pagination
  // --------------------------------------------------

  const totalPages = Math.ceil(
    groupedData.length / ROWS_PER_PAGE
  );

  const paginatedData = useMemo(() => {
    const startIndex =
      (currentPage - 1) * ROWS_PER_PAGE;

    return groupedData.slice(
      startIndex,
      startIndex + ROWS_PER_PAGE
    );
  }, [groupedData, currentPage]);

  // --------------------------------------------------
  // Keep current page valid when data changes
  // --------------------------------------------------

  useEffect(() => {
    if (totalPages === 0) {
      setCurrentPage(1);
      return;
    }

    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  // --------------------------------------------------
  // Handlers
  // --------------------------------------------------

  const handlePrevious = () => {
    setCurrentPage((page) =>
      Math.max(1, page - 1)
    );
  };

  const handleNext = () => {
    setCurrentPage((page) =>
      Math.min(totalPages, page + 1)
    );
  };

  // --------------------------------------------------
  // Loading
  // --------------------------------------------------

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  // --------------------------------------------------
  // Empty
  // --------------------------------------------------

  if (!entries || entries.length === 0) {
    return <EmptyState />;
  }

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <div className="w-full overflow-hidden rounded-xl border border-border bg-background">
      {/* Header */}
      <div className="border-b border-border px-4 py-4 sm:px-6">
        <h2 className="text-base font-semibold text-text-primary">
          Recent entries
        </h2>
      </div>

      {/* ================= DESKTOP TABLE ================= */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="border-b border-border">
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-text-secondary">
                DATE
              </th>

              {materialKeys.map((mat) => (
                <th
                  key={mat}
                  className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-text-secondary"
                >
                  {mat}
                </th>
              ))}

              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-text-secondary">
                TOTAL
              </th>

              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-text-secondary">
                ACTIONS
              </th>
            </tr>
          </thead>

          <tbody>
            {paginatedData.map((row) => (
              <tr
                key={row.date}
                className="border-b border-border last:border-0"
              >
                <td className="px-4 py-4 text-sm font-semibold text-text-primary">
                  {format(
                    new Date(row.date),
                    'MMM d, yyyy'
                  )}
                </td>

                {materialKeys.map((mat) => (
                  <td
                    key={mat}
                    className="px-4 py-4 text-sm text-text-secondary"
                  >
                    {row[mat] || 0}
                  </td>
                ))}

                <td className="px-4 py-4 text-sm font-semibold text-text-primary">
                  {row.total}
                </td>

                <td className="px-4 py-4 text-right">
                  <button
                    type="button"
                    onClick={() =>
                      onEditClick &&
                      onEditClick(row)
                    }
                    className="rounded-md p-2 text-text-secondary transition-colors hover:bg-muted hover:text-primary"
                    title="Edit entry"
                  >
                    <Pencil size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= MOBILE CARDS ================= */}
      <div className="space-y-3 p-4 md:hidden">
        {paginatedData.map((row) => (
          <div
            key={row.date}
            className="rounded-xl border border-border bg-card p-4 shadow-sm"
          >
            {/* Card Header */}
            <div className="mb-4 flex items-center justify-between border-b border-border pb-3">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-text-secondary">
                  Date
                </p>

                <p className="mt-1 text-sm font-semibold text-text-primary">
                  {format(
                    new Date(row.date),
                    'MMM d, yyyy'
                  )}
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  onEditClick &&
                  onEditClick(row)
                }
                className="rounded-lg p-2 text-text-secondary transition-colors hover:bg-muted hover:text-primary"
                title="Edit entry"
              >
                <Pencil size={17} />
              </button>
            </div>

            {/* Materials */}
            <div className="space-y-2">
              {materialKeys.map((mat) => (
                <div
                  key={mat}
                  className="flex items-center justify-between gap-3"
                >
                  <span className="min-w-0 truncate text-sm text-text-secondary">
                    {mat}
                  </span>

                  <span className="shrink-0 text-sm font-medium text-text-primary">
                    {row[mat] || 0}
                  </span>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
              <span className="text-sm font-semibold text-text-primary">
                Total
              </span>

              <span className="text-base font-bold text-primary">
                {row.total}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* ================= PAGINATION ================= */}
      {totalPages > 1 && (
        <div className="flex flex-col gap-3 border-t border-border px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p className="text-center text-xs text-text-secondary sm:text-left">
            Showing{' '}
            {(currentPage - 1) * ROWS_PER_PAGE + 1}
            {' - '}
            {Math.min(
              currentPage * ROWS_PER_PAGE,
              groupedData.length
            )}{' '}
            of {groupedData.length}
          </p>

          <div className="flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={handlePrevious}
              disabled={currentPage === 1}
              className="flex items-center gap-1 rounded-lg border border-border px-3 py-2 text-sm text-text-secondary transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ChevronLeft size={16} />
              <span>Previous</span>
            </button>

            <span className="min-w-[70px] text-center text-sm font-medium text-text-primary">
              {currentPage} / {totalPages}
            </span>

            <button
              type="button"
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className="flex items-center gap-1 rounded-lg border border-border px-3 py-2 text-sm text-text-secondary transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
            >
              <span>Next</span>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

RecentEntriesTable.propTypes = {
  entries: PropTypes.array,
  isLoading: PropTypes.bool,
  onEditClick: PropTypes.func,
};