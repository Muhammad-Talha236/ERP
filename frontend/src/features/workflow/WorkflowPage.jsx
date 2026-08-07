import { useMemo, useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { OrderWorkflowCard } from './components/OrderWorkflowCard';
import { CreateTemplateModal } from './components/CreateTemplateModal';
import { LoadingSkeleton } from '@/components/feedback/LoadingSkeleton';
import { EmptyState } from '@/components/feedback/EmptyState';
import { Button } from '@/components/ui/Button';
import { GitBranch, Plus, Layers, Pencil, Trash2 } from 'lucide-react';
import { useProductionOrders } from '@/features/Purchaseorder/hooks/useProductionOrders';
import { useWorkflowTemplates } from './hooks/useWorkflowTemplates';
import { useDeleteWorkflowTemplate } from './hooks/useDeleteWorkflowTemplate';

/**
 * WorkflowPage — manage stages, bundles, and employee assignments
 * for every active order, split into two groups instead of a
 * dropdown selector:
 *
 *  - "Needs Setup": orders where NOT A SINGLE step has an assigned
 *    employee yet (nothing has started).
 *  - "In Progress": orders where at least one step already has
 *    someone assigned — actively being worked.
 *
 * Completed/Cancelled orders are excluded — nothing left to manage.
 * Clicking an order expands it inline (no modal, no separate page
 * navigation) to show its Workflow Steps / Bundles / Movement Log tabs.
 *
 * "+ Create Template" opens a modal where the user defines a reusable
 * workflow template (name + stages). Saved templates then appear in
 * the Purchase Order form's "Use existing workflow" dropdown.
 */
export function WorkflowPage() {
  const { data: orders, isLoading } = useProductionOrders();
  const { data: templates, isLoading: isTemplatesLoading } = useWorkflowTemplates();
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [isCreateTemplateOpen, setIsCreateTemplateOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [deletingTemplate, setDeletingTemplate] = useState(null);

  const { mutate: deleteTemplate, isPending: isDeleting } = useDeleteWorkflowTemplate();

  const activeOrders = useMemo(
    () => (orders ?? []).filter((o) => o.status !== 'Completed' && o.status !== 'Cancelled'),
    [orders]
  );

  const confirmDeleteTemplate = () => {
    deleteTemplate(deletingTemplate.id, {
      onSettled: () => setDeletingTemplate(null),
    });
  };

  const templatesSection = (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="text-lg font-bold text-text-primary">Workflow Templates</h2>
          <p className="text-sm text-text-secondary">Reusable templates users can pick when creating a new order.</p>
        </div>
        <Button size="sm" onClick={() => setIsCreateTemplateOpen(true)}>
          <Plus size={14} /> Create Template
        </Button>
        <CreateTemplateModal open={isCreateTemplateOpen} onOpenChange={setIsCreateTemplateOpen} />
        <CreateTemplateModal
          open={!!editingTemplate}
          onOpenChange={(isOpen) => !isOpen && setEditingTemplate(null)}
          template={editingTemplate}
        />
      </div>

      {isTemplatesLoading ? (
        <LoadingSkeleton rows={2} />
      ) : !templates || templates.length === 0 ? (
        <div className="rounded-card border border-border p-4 bg-surface">
          <p className="text-sm text-text-secondary">No templates yet. Create one to reuse across orders.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {templates.map((template) => (
            <div key={template.id} className="rounded-card border border-border bg-background p-4">
              <div className="flex items-start justify-between mb-1">
                <div className="flex items-center gap-2">
                  <Layers size={16} className="text-primary" />
                  <p className="text-sm font-semibold text-text-primary">{template.templateName}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingTemplate(template)}
                    className="text-text-secondary hover:text-primary"
                    title="Edit template"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeletingTemplate(template)}
                    className="text-text-secondary hover:text-red-600"
                    title="Delete template"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <p className="text-xs text-text-secondary">
                {(template.stages ?? []).filter((s) => s.stageName).length} stage
                {(template.stages ?? []).filter((s) => s.stageName).length === 1 ? '' : 's'}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Delete confirmation */}
      {deletingTemplate && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-background rounded-card p-6 max-w-sm w-full space-y-4 border border-border">
            <h3 className="text-lg font-semibold text-text-primary">Delete "{deletingTemplate.templateName}"?</h3>
            <p className="text-sm text-text-secondary">
              This action cannot be undone. Orders already using this template will keep their existing stages.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeletingTemplate(null)}
                className="px-4 py-2 text-sm rounded-md border border-border text-text-primary"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteTemplate}
                className="px-4 py-2 text-sm rounded-md bg-red-600 text-white"
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  if (isLoading) {
    return (
      <AppLayout title="Workflow" subtitle="Manage stages, bundles, and employee assignments">
        {templatesSection}
        <LoadingSkeleton rows={4} />
      </AppLayout>
    );
  }

  if (activeOrders.length === 0) {
    return (
      <AppLayout title="Workflow" subtitle="Manage stages, bundles, and employee assignments">
        {templatesSection}
        <EmptyState
          icon={GitBranch}
          title="No active orders"
          description="Orders will appear here once created and until they're completed."
        />
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Workflow" subtitle="Manage stages, bundles, and employee assignments">
      {templatesSection}
      <div className="space-y-3">
        {activeOrders.map((order) => (
          <OrderWorkflowCard
            key={order.id}
            order={order}
            isExpanded={expandedOrderId === order.id}
            onToggleExpand={() => setExpandedOrderId(expandedOrderId === order.id ? null : order.id)}
          />
        ))}
      </div>
    </AppLayout>
  );
}