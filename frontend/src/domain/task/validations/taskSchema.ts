import { z } from 'zod';

export const taskSchema = z.object({
  titulo: z
    .string('O título da tarefa é obrigatório')
    .min(3, 'O título deve ter pelo menos 3 caracteres')
    .max(100, 'O título deve ter no máximo 100 caracteres')
    .refine((val) => val.trim().length > 0, 'O título não pode conter apenas espaços em branco'),
  descricao: z
    .string()
    .max(500, 'A descrição deve ter no máximo 500 caracteres')
    .optional()
    .or(z.literal('')),
  prioridade: z.enum(['Alta', 'Média', 'Baixa'], 'Selecione uma prioridade válida').optional(),
  data_vencimento: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val) return true;
        const selectedDate = new Date(val);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return selectedDate >= today;
      },
      { message: 'A data de vencimento não pode ser anterior à data atual' }
    ),
});
