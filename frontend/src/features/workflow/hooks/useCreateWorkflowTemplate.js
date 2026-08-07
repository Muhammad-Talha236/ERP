import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';

export function useCreateWorkflowTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ templateName, stages }) => {
      const payload = {
        templateName,
        stages: stages.map((stage, index) => ({
          stageName: stage.stageName,
          expense: Number(stage.stageExpense || 0),
          wagePerPerson: Number(stage.wagePerPerson || 0),
          headcount: Number(stage.headcount || 1),
          position: Number(stage.position || index + 1),
        })),
      };
      const response = await api.post('/workflows', payload);
      return response.data ?? response;
    },
    onSuccess: () => {
      // Purchase Order form ke "existing workflow" dropdown ko bhi refresh kar dega
      queryClient.invalidateQueries({ queryKey: ['workflows'] });
    },
  });
}