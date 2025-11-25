import { authenticatedClient } from '@/core/lib/api';
import type { Task, CreateTaskDto } from '../types/task';

/**
 * @service TaskService
 * @domain task
 * @type REST
 */
export const taskService = {
  /**
   * Creates a new task
   * @param data Task creation data
   * @returns Created task
   */
  async create(data: CreateTaskDto): Promise<Task> {
    const response = await authenticatedClient.post<{ data: Task }>('/task', data);
    return response.data.data;
  },
};
