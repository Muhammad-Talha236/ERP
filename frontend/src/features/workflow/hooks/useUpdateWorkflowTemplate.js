import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';

export function useUpdateWorkflowTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, templateName, stages }) => {
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
      const response = await api.put(`/workflows/${id}`, payload);
      return response.data ?? response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflows'] });
    },
  });
}