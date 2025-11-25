/**
 * @summary
 * Type definitions for task domain.
 * Defines interfaces and types for task entities and operations.
 *
 * @module services/task/taskTypes
 */

/**
 * @interface Task
 * @description Represents a task entity in the system
 *
 * @property {string} id - Unique task identifier (UUID)
 * @property {string} titulo - Task title (3-100 characters)
 * @property {string} descricao - Task description (max 500 characters)
 * @property {TaskPriority} prioridade - Task priority level
 * @property {string | null} data_vencimento - Due date in ISO format
 * @property {TaskStatus} status - Current task status
 * @property {string} data_criacao - Creation timestamp in ISO format
 * @property {string} usuario_criador - Creator user identifier
 */
export interface Task {
  id: string;
  titulo: string;
  descricao: string;
  prioridade: TaskPriority;
  data_vencimento: string | null;
  status: TaskStatus;
  data_criacao: string;
  usuario_criador: string;
}

/**
 * @interface TaskCreateRequest
 * @description Request parameters for creating a new task
 *
 * @property {string} titulo - Task title (3-100 characters)
 * @property {string | null} descricao - Task description (max 500 characters)
 * @property {TaskPriority} prioridade - Task priority level
 * @property {string | null} data_vencimento - Due date in ISO format
 */
export interface TaskCreateRequest {
  titulo: string;
  descricao: string | null;
  prioridade: TaskPriority;
  data_vencimento: string | null;
}

/**
 * @type TaskPriority
 * @description Task priority levels
 */
export type TaskPriority = 'Alta' | 'Média' | 'Baixa';

/**
 * @type TaskStatus
 * @description Task status values
 */
export type TaskStatus = 'Pendente' | 'Em Progresso' | 'Concluída';
