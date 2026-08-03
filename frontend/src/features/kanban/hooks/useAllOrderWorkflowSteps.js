import { useQuery } from '@tanstack/react-query';
import { fetchAllOrderWorkflowSteps } from '@/mocks/handlers/productionOrder.mock';

/**
 * useAllOrderWorkflowSteps — fetches every order's workflow steps
 * in one call, so the Kanban page can compute each order's total
 * expense (sum of step.expense) without a fetch per order.
 */
export function useAllOrderWorkflowSteps() {
  return useQuery({ queryKey: ['allOrderWorkflowSteps'], queryFn: fetchAllOrderWorkflowSteps });
}