/**
 * @summary
 * Task creation controller handling HTTP requests for creating new tasks.
 * Implements validation, business logic execution, and standardized response formatting.
 *
 * @module api/v1/internal/task/controller
 */

import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { successResponse, errorResponse } from '@/utils/response';
import { taskCreate } from '@/services/task';

/**
 * @validation Task creation request body schema
 */
const bodySchema = z.object({
  titulo: z
    .string()
    .min(3, 'O título deve ter pelo menos 3 caracteres')
    .max(100, 'O título deve ter no máximo 100 caracteres'),
  descricao: z.string().max(500, 'A descrição deve ter no máximo 500 caracteres').optional(),
  prioridade: z.enum(['Alta', 'Média', 'Baixa']).optional().default('Média'),
  data_vencimento: z.string().datetime().optional(),
});

/**
 * @api {post} /api/v1/internal/task Create Task
 * @apiName CreateTask
 * @apiGroup Task
 * @apiVersion 1.0.0
 *
 * @apiDescription Creates a new task with the specified parameters
 *
 * @apiParam {String} titulo Task title (3-100 characters)
 * @apiParam {String} [descricao] Task description (max 500 characters)
 * @apiParam {String} [prioridade] Task priority: 'Alta', 'Média', 'Baixa' (default: 'Média')
 * @apiParam {String} [data_vencimento] Due date in ISO format
 *
 * @apiSuccess {String} id Task identifier
 * @apiSuccess {String} titulo Task title
 * @apiSuccess {String} descricao Task description
 * @apiSuccess {String} prioridade Task priority
 * @apiSuccess {String} data_vencimento Due date
 * @apiSuccess {String} status Task status
 * @apiSuccess {String} data_criacao Creation timestamp
 * @apiSuccess {String} usuario_criador Creator user ID
 *
 * @apiError {String} ValidationError Invalid parameters provided
 * @apiError {String} DuplicateTitleError Task with same title already exists
 * @apiError {String} ServerError Internal server error
 */
export async function postHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    /**
     * @validation Validate request body against schema
     */
    const validatedData = bodySchema.parse(req.body);

    /**
     * @validation Validate due date is not in the past
     */
    if (validatedData.data_vencimento) {
      const dueDate = new Date(validatedData.data_vencimento);
      const now = new Date();
      now.setHours(0, 0, 0, 0);

      if (dueDate < now) {
        res
          .status(400)
          .json(
            errorResponse(
              'A data de vencimento não pode ser anterior à data atual',
              'INVALID_DUE_DATE'
            )
          );
        return;
      }
    }

    /**
     * @rule {fn-task-creation} Execute task creation business logic
     */
    const task = await taskCreate({
      titulo: validatedData.titulo,
      descricao: validatedData.descricao || null,
      prioridade: validatedData.prioridade || 'Média',
      data_vencimento: validatedData.data_vencimento || null,
    });

    res.status(201).json(successResponse(task));
  } catch (error: any) {
    /**
     * @rule {be-error-handling} Handle validation and business errors
     */
    if (error instanceof z.ZodError) {
      res
        .status(400)
        .json(errorResponse(error.errors[0].message, 'VALIDATION_ERROR', error.errors));
      return;
    }

    if (error.code === 'DUPLICATE_TITLE') {
      res
        .status(409)
        .json(
          errorResponse(
            'Já existe uma tarefa com este título. Por favor, use um título diferente',
            'DUPLICATE_TITLE'
          )
        );
      return;
    }

    next(error);
  }
}
