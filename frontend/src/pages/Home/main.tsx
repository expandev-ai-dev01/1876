import { Button } from '@/core/components/button';
import { useNavigation } from '@/core/hooks/useNavigation';
import { PlusIcon } from 'lucide-react';

function HomePage() {
  const { navigate } = useNavigation();

  return (
    <div className="flex flex-col items-center justify-center space-y-6 py-12 text-center">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">Gerenciador de Tarefas</h1>
        <p className="text-muted-foreground text-lg">
          Organize suas atividades de forma simples e eficiente
        </p>
      </div>
      <Button size="lg" onClick={() => navigate('/tasks/create')} className="gap-2">
        <PlusIcon className="h-5 w-5" />
        Criar Nova Tarefa
      </Button>
    </div>
  );
}

export { HomePage };
