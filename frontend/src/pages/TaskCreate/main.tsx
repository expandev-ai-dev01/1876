import { TaskForm } from '@/domain/task/components/TaskForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/core/components/card';
import { useNavigation } from '@/core/hooks/useNavigation';

function TaskCreatePage() {
  const { navigate } = useNavigation();

  const handleSuccess = () => {
    navigate('/');
  };

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <div className="flex min-h-full items-center justify-center py-12">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold tracking-tight">Nova Tarefa</CardTitle>
          <CardDescription>
            Preencha os campos abaixo para criar uma nova tarefa. Campos marcados com * são
            obrigatórios.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TaskForm onSuccess={handleSuccess} onCancel={handleCancel} />
        </CardContent>
      </Card>
    </div>
  );
}

export { TaskCreatePage };
