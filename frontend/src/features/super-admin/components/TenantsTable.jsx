import { useState } from 'react';
import { format } from 'date-fns';
import { MoreHorizontal, Pencil, Ban, CheckCircle2, Trash2 } from 'lucide-react';
import PropTypes from 'prop-types';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { DropdownMenu } from '@/components/ui/DropdownMenu';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { EmptyState } from '@/components/feedback/EmptyState';
import { LoadingSkeleton } from '@/components/feedback/LoadingSkeleton';
import { Building2 } from 'lucide-react';
import { useUpdateTenantStatus } from '../hooks/useUpdateTenantStatus';
import { useDeleteTenant } from '../hooks/useDeleteTenant';

const COLUMNS = ['COMPANY', 'CODE', 'ADMIN EMAIL', 'EMPLOYEES', 'STATUS', 'CREATED', ''];

/**
 * TenantsTable — full CRUD list of factories on the platform.
 *
 * @param {Object} props
 * @param {Tenant[]} props.tenants
 * @param {boolean} props.isLoading
 * @param {(tenant: Tenant) => void} props.onEditClick
 */
export function TenantsTable({ tenants, isLoading, onEditClick }) {
  const [deleteTarget, setDeleteTarget] = useState(null);

  const { mutate: updateStatus } = useUpdateTenantStatus();
  const { mutate: deleteTenant, isPending: isDeleting } = useDeleteTenant();

  if (isLoading) return <LoadingSkeleton rows={4} />;

  if (!tenants || tenants.length === 0) {
    return (
      <EmptyState
        icon={Building2}
        title="No factories yet"
        description="Create the first factory account to get started."
      />
    );
  }

  return (
    <div className="rounded-card border border-border bg-background p-6">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            {COLUMNS.map((col) => (
              <th key={col} className="text-left text-xs font-semibold text-text-secondary uppercase tracking-wide py-3">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tenants.map((tenant) => (
            <tr key={tenant.id} className="border-b border-border last:border-0">
              <td className="py-4 text-sm font-semibold text-text-primary">{tenant.companyName}</td>
              <td className="py-4 text-sm text-text-secondary">{tenant.companyCode}</td>
              <td className="py-4 text-sm text-text-secondary">{tenant.email}</td>
              <td className="py-4 text-sm text-text-secondary">{tenant.employeeCount}</td>
              <td className="py-4">
                <Badge variant={tenant.status === 'Active' ? 'success' : 'danger'}>{tenant.status}</Badge>
              </td>
              <td className="py-4 text-sm text-text-secondary">{format(new Date(tenant.createdAt), 'MMM d, yyyy')}</td>
              <td className="py-4 text-right">
                <DropdownMenu
                  trigger={
                    <Button variant="ghost" size="icon" aria-label="Actions">
                      <MoreHorizontal size={16} />
                    </Button>
                  }
                  items={[
                    { label: 'Edit', icon: Pencil, onClick: () => onEditClick(tenant) },
                    tenant.status === 'Active'
                      ? { label: 'Suspend', icon: Ban, onClick: () => updateStatus({ id: tenant.id, status: 'Suspended' }) }
                      : { label: 'Activate', icon: CheckCircle2, onClick: () => updateStatus({ id: tenant.id, status: 'Active' }) },
                    { label: 'Delete', icon: Trash2, onClick: () => setDeleteTarget(tenant), danger: true },
                  ]}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete Factory?"
        description={
          deleteTarget
            ? `Are you sure you want to permanently delete ${deleteTarget.companyName}? This cannot be undone.`
            : ''
        }
        onConfirm={() => deleteTenant(deleteTarget.id, { onSuccess: () => setDeleteTarget(null) })}
        isConfirming={isDeleting}
      />
    </div>
  );
}

TenantsTable.propTypes = {
  tenants: PropTypes.array,
  isLoading: PropTypes.bool,
  onEditClick: PropTypes.func,
};