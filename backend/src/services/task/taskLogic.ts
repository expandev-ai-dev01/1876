/**
 * @summary
 * Task business logic implementation.
 * Handles task creation with validation and data management.
 *
 * @module services/task/taskLogic
 */

import { v4 as uuidv4 } from 'uuid';
import { Task, TaskCreateRequest } from './taskTypes';

/**
 * @remarks
 * In-memory storage for tasks (no database persistence)
 */
const tasks: Task[] = [];

/**
 * @summary
 * Creates a new task with validation
 *
 * @function taskCreate
 * @module services/task
 *
 * @param {TaskCreateRequest} params - Task creation parameters
 * @param {string} params.titulo - Task title (3-100 characters)
 * @param {string | null} params.descricao - Task description (max 500 characters)
 * @param {string} params.prioridade - Task priority: 'Alta', 'Média', 'Baixa'
 * @param {string | null} params.data_vencimento - Due date in ISO format
 *
 * @returns {Promise<Task>} Created task entity
 *
 * @throws {Error} DUPLICATE_TITLE - When title already exists
 */
export async function taskCreate(params: TaskCreateRequest): Promise<Task> {
  /**
   * @validation Check for duplicate title
   * @throw {DUPLICATE_TITLE}
   */
  const existingTask = tasks.find((t) => t.titulo.toLowerCase() === params.titulo.toLowerCase());
  if (existingTask) {
    const error: any = new Error('Já existe uma tarefa com este título');
    error.code = 'DUPLICATE_TITLE';
    throw error;
  }

  /**
   * @rule {fn-task-creation} Create new task with system-generated fields
   */
  const newTask: Task = {
    id: uuidv4(),
    titulo: params.titulo,
    descricao: params.descricao || '',
    prioridade: params.prioridade,
    data_vencimento: params.data_vencimento,
    status: 'Pendente',
    data_criacao: new Date().toISOString(),
    usuario_criador: 'system',
  };

  tasks.push(newTask);

  return newTask;
}

/**
 * @summary
 * Retrieves all tasks
 *
 * @function taskList
 * @module services/task
 *
 * @returns {Promise<Task[]>} Array of all tasks
 */
export async function taskList(): Promise<Task[]> {
  return tasks;
}
