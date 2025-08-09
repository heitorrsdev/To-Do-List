export interface Task {
  _id: string;
  title: string;
  status: 'pending' | 'in-progress' | 'completed';
  userId: string; // ID do usuário que possui a tarefa
  createdAt: Date;
  updatedAt: Date;
}

// Definindo a estrutura para criar uma tarefa (excluindo campos gerados pelo backend)
export interface CreateTaskDto {
  title: string;
  status: 'pending'; // Novas tarefas sempre começam como pendentes
}

// Definindo a estrutura para atualizar uma tarefa (permitindo atualizações parciais)
export interface UpdateTaskDto {
  title?: string;
  status?: 'pending' | 'in-progress' | 'completed';
}
