import { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { PayrollOverviewRow } from './PayrollOverviewRow';
import { LoadingSkeleton } from '@/components/feedback/LoadingSkeleton';
import { EmptyState } from '@/components/feedback/EmptyState';

const COLUMNS = [
  'EMPLOYEE',
  'DEPARTMENT',
  'BASE SALARY',
  'OVERTIME',
  'NET',
  'STATUS',
  '',
];

const ROWS_PER_PAGE = 3;

export function PayrollOverviewTable({
  rows = [],
  isLoading,
  onPayClick,
  onEditClick,
  onGenerateClick,
}) {
  const [currentPage, setCurrentPage] = useState(1);

  /*
   * IMPORTANT:
   * Pagination is done using slice().
   * We NEVER append rows here.
   *
   * So:
   * Page 1 -> rows 0,1,2
   * Page 2 -> rows 3,4,5
   *
   * Going back to Page 1 will NOT create duplicates.
   */
  const totalPages = Math.max(
    1,
    Math.ceil(rows.length / ROWS_PER_PAGE)
  );

  /*
   * If rows change and current page becomes invalid,
   * automatically move to the last valid page.
   */
  useEffect(() => {
    setCurrentPage((page) =>
      Math.min(Math.max(page, 1), totalPages)
    );
  }, [totalPages]);

  /*
   * ONLY select records for current page.
   * Do not modify rows.
   */
  const paginatedRows = useMemo(() => {
    const startIndex =
      (currentPage - 1) * ROWS_PER_PAGE;

    return rows.slice(
      startIndex,
      startIndex + ROWS_PER_PAGE
    );
  }, [rows, currentPage]);

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

  /*
   * Reset to page 1 when the actual dataset changes.
   *
   * This is useful when month/filter changes.
   */
  useEffect(() => {
    setCurrentPage(1);
  }, [rows]);

  if (isLoading) {
    return (
      <div className="space-y-3">
        <LoadingSkeleton className="h-16 w-full" />
        <LoadingSkeleton className="h-16 w-full" />
        <LoadingSkeleton className="h-16 w-full" />
      </div>
    );
  }

  if (!rows || rows.length === 0) {
    return (
      <EmptyState
        icon="Wallet"
        title="No payroll records"
        description="No payroll records are available for this period."
      />
    );
  }

  const startRecord =
    (currentPage - 1) * ROWS_PER_PAGE + 1;

  const endRecord = Math.min(
    currentPage * ROWS_PER_PAGE,
    rows.length
  );

  return (
    <div className="w-full min-w-0 overflow-hidden rounded-xl border border-border bg-background">
      {/* =====================================================
          DESKTOP TABLE
          ===================================================== */}

      <div className="hidden w-full md:block">
        <table className="w-full table-fixed border-collapse">
          <thead>
            <tr className="border-b border-border">
              <th className="w-[18%] px-3 py-4 text-left text-xs font-semibold uppercase tracking-wide text-text-secondary lg:px-4">
                EMPLOYEE
              </th>

              <th className="w-[15%] px-3 py-4 text-left text-xs font-semibold uppercase tracking-wide text-text-secondary lg:px-4">
                DEPARTMENT
              </th>

              <th className="w-[14%] px-3 py-4 text-left text-xs font-semibold uppercase tracking-wide text-text-secondary lg:px-4">
                BASE SALARY
              </th>

              <th className="w-[12%] px-3 py-4 text-left text-xs font-semibold uppercase tracking-wide text-text-secondary lg:px-4">
                OVERTIME
              </th>

              <th className="w-[12%] px-3 py-4 text-left text-xs font-semibold uppercase tracking-wide text-text-secondary lg:px-4">
                NET
              </th>

              <th className="w-[11%] px-3 py-4 text-left text-xs font-semibold uppercase tracking-wide text-text-secondary lg:px-4">
                STATUS
              </th>

              <th className="w-[18%] px-3 py-4 text-right text-xs font-semibold uppercase tracking-wide text-text-secondary lg:px-4">
                ACTIONS
              </th>
            </tr>
          </thead>

          <tbody>
            {paginatedRows.map((row) => (
              <PayrollOverviewRow
                key={
                  row.wageId ??
                  row.employeeId ??
                  row.id
                }
                row={row}
                onPayClick={onPayClick}
                onEditClick={onEditClick}
                onGenerateClick={onGenerateClick}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* =====================================================
          MOBILE CARDS
          ===================================================== */}

      <div className="space-y-3 p-3 md:hidden">
        {paginatedRows.map((row) => (
          <div
            key={
              row.wageId ??
              row.employeeId ??
              row.id
            }
            className="rounded-xl border border-border bg-card p-4"
          >
            {/* Employee */}
            <div className="mb-4 flex items-start justify-between gap-3 border-b border-border pb-3">
              <div className="min-w-0">
                <p className="truncate text-base font-semibold text-text-primary">
                  {row.employeeName}
                </p>

                <p className="mt-1 truncate text-sm text-text-secondary">
                  {row.department}
                </p>
              </div>

              <div className="shrink-0">
                {row.status === 'Paid' ? (
                  <span className="rounded-full bg-success/10 px-2.5 py-1 text-xs font-medium text-success">
                    Paid
                  </span>
                ) : row.status ? (
                  <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-text-secondary">
                    {row.status}
                  </span>
                ) : null}
              </div>
            </div>

            {/* Salary Information */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-text-secondary">
                  Base Salary
                </p>

                <p className="mt-1 text-sm font-semibold text-text-primary">
                  $
                  {Number(
                    row.baseSalary || 0
                  ).toLocaleString()}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-text-secondary">
                  Overtime
                </p>

                <p className="mt-1 text-sm font-semibold text-text-primary">
                  {row.overtimeAmount > 0
                    ? `+$${Number(
                        row.overtimeAmount
                      ).toLocaleString()}`
                    : '—'}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-text-secondary">
                  Net
                </p>

                <p className="mt-1 text-base font-bold text-text-primary">
                  {row.wageId
                    ? `$${Number(
                        row.netAmount || 0
                      ).toLocaleString()}`
                    : '—'}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-text-secondary">
                  Status
                </p>

                <p className="mt-1 text-sm font-medium text-text-primary">
                  {!row.wageId
                    ? 'Not Generated'
                    : row.status || 'Draft'}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-4 flex flex-wrap gap-2 border-t border-border pt-4">
              {!row.wageId && (
                <button
                  type="button"
                  onClick={() =>
                    onGenerateClick(row)
                  }
                  className="rounded-lg border border-border px-3 py-2 text-sm font-medium text-text-primary transition hover:bg-muted"
                >
                  Generate
                </button>
              )}

              {row.wageId &&
                (row.status === 'Draft' ||
                  row.status === 'Calculated') && (
                  <button
                    type="button"
                    onClick={() =>
                      onEditClick(row)
                    }
                    className="rounded-lg border border-border px-3 py-2 text-sm font-medium text-text-primary transition hover:bg-muted"
                  >
                    Edit
                  </button>
                )}

              {row.wageId &&
                row.status === 'Calculated' && (
                  <button
                    type="button"
                    onClick={() => {
                      // Approval is intentionally handled
                      // by PayrollOverviewRow on desktop.
                      // Mobile action can remain available
                      // through the same row component if needed.
                    }}
                    className="rounded-lg border border-border px-3 py-2 text-sm font-medium text-text-primary transition hover:bg-muted"
                  >
                    Approve
                  </button>
                )}

              {row.wageId &&
                (row.status === 'Approved' ||
                  row.status === 'Paid') &&
                Number(row.netAmount || 0) -
                  Number(row.amountPaid || 0) >
                  0 && (
                  <button
                    type="button"
                    onClick={() =>
                      onPayClick(row)
                    }
                    className="rounded-lg border border-border px-3 py-2 text-sm font-medium text-text-primary transition hover:bg-muted"
                  >
                    Pay
                  </button>
                )}
            </div>
          </div>
        ))}
      </div>

      {/* =====================================================
          PAGINATION
          ===================================================== */}

      {rows.length > ROWS_PER_PAGE && (
        <div className="flex flex-col gap-3 border-t border-border px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Showing count */}
          <p className="text-center text-xs text-text-secondary sm:text-left">
            Showing{' '}
            <span className="font-medium text-text-primary">
              {startRecord} - {endRecord}
            </span>{' '}
            of{' '}
            <span className="font-medium text-text-primary">
              {rows.length}
            </span>{' '}
            employees
          </p>

          {/* Controls */}
          <div className="flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={handlePrevious}
              disabled={currentPage === 1}
              className="flex items-center gap-1 rounded-lg border border-border px-3 py-2 text-sm font-medium text-text-secondary transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
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
              disabled={
                currentPage === totalPages
              }
              className="flex items-center gap-1 rounded-lg border border-border px-3 py-2 text-sm font-medium text-text-secondary transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
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

PayrollOverviewTable.propTypes = {
  rows: PropTypes.array,
  isLoading: PropTypes.bool,
  onPayClick: PropTypes.func.isRequired,
  onEditClick: PropTypes.func.isRequired,
  onGenerateClick: PropTypes.func.isRequired,
};