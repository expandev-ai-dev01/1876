export interface Task {
  id: string;
  titulo: string;
  descricao: string | null;
  prioridade: 'Alta' | 'Média' | 'Baixa';
  data_vencimento: string | null;
  status: 'Pendente' | 'Concluída';
  data_criacao: string;
  usuario_criador: string;
}

export interface CreateTaskDto {
  titulo: string;
  descricao?: string;
  prioridade?: 'Alta' | 'Média' | 'Baixa';
  data_vencimento?: string;
}
