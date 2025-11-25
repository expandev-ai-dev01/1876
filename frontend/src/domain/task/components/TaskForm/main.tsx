import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import DOMPurify from 'dompurify';
import { taskSchema } from '../../validations/taskSchema';
import { useTaskCreate } from '../../hooks/useTaskCreate';
import { Button } from '@/core/components/button';
import { Input } from '@/core/components/input';
import { Textarea } from '@/core/components/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/core/components/select';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/core/components/form';
import { toast } from 'sonner';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

type TaskFormData = z.infer<typeof taskSchema>;

interface TaskFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

function TaskForm({ onSuccess, onCancel }: TaskFormProps) {
  const { createTask, isCreating, error, isSuccess, reset } = useTaskCreate();

  const form = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    mode: 'onBlur',
    defaultValues: {
      titulo: '',
      descricao: '',
      prioridade: 'Média',
      data_vencimento: '',
    },
  });

  useEffect(() => {
    if (isSuccess) {
      toast.success('Tarefa criada com sucesso');
      form.reset();
      reset();
      onSuccess?.();
    }
  }, [isSuccess, form, reset, onSuccess]);

  useEffect(() => {
    if (error) {
      const axiosError = error as any;
      if (axiosError?.response?.data?.error?.code === 'DUPLICATE_TITLE') {
        form.setError('titulo', {
          type: 'manual',
          message: 'Já existe uma tarefa com este título. Por favor, use um título diferente',
        });
      } else {
        toast.error(
          axiosError?.response?.data?.error?.message ||
            'Não foi possível salvar a tarefa. Tente novamente mais tarde'
        );
      }
    }
  }, [error, form]);

  const onSubmit = async (data: TaskFormData) => {
    const sanitizedData = {
      titulo: data.titulo.trim(),
      descricao: data.descricao ? DOMPurify.sanitize(data.descricao) : undefined,
      prioridade: data.prioridade || 'Média',
      data_vencimento: data.data_vencimento || undefined,
    };

    try {
      await createTask(sanitizedData);
    } catch (err) {
      // Error handling is done in useEffect
    }
  };

  const handleCancel = () => {
    if (form.formState.isDirty) {
      const confirmed = window.confirm('Deseja realmente cancelar? Os dados não serão salvos');
      if (!confirmed) return;
    }
    form.reset();
    onCancel?.();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="titulo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título *</FormLabel>
              <FormControl>
                <Input placeholder="Digite o título da tarefa" {...field} disabled={isCreating} />
              </FormControl>
              <FormDescription>
                Título que identifica o objetivo principal da tarefa
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="descricao"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Digite uma descrição detalhada (opcional)"
                  className="min-h-[100px] resize-none"
                  {...field}
                  disabled={isCreating}
                />
              </FormControl>
              <FormDescription>
                Descrição detalhada da tarefa (máximo 500 caracteres)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-6 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="prioridade"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prioridade</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={isCreating}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a prioridade" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Alta">Alta</SelectItem>
                    <SelectItem value="Média">Média</SelectItem>
                    <SelectItem value="Baixa">Baixa</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>Nível de importância da tarefa</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="data_vencimento"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data de Vencimento</FormLabel>
                <FormControl>
                  <Input type="date" {...field} disabled={isCreating} />
                </FormControl>
                <FormDescription>Data limite para conclusão</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" onClick={handleCancel} disabled={isCreating}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isCreating}>
            {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isCreating ? 'Salvando...' : 'Criar Tarefa'}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export { TaskForm };
