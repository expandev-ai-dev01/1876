import { useMutation, useQueryClient } from '@tanstack/react-query';
import { taskService } from '../../services/taskService';
import type { CreateTaskDto } from '../../types/task';

export const useTaskCreate = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: CreateTaskDto) => taskService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  return {
    createTask: mutation.mutateAsync,
    isCreating: mutation.isPending,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
    reset: mutation.reset,
  };
};
