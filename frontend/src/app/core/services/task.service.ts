import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

// Definindo uma interface para o objeto Task baseada na estrutura do backend
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

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private http = inject(HttpClient);
  // URL base para os endpoints da API de tarefas
  private apiUrl = `${environment.apiUrl}/tasks`;

  // Buscar todas as tarefas do usuário logado
  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl);
  }

  // Criar uma nova tarefa
  createTask(taskData: CreateTaskDto): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, taskData);
  }

  // Atualizar uma tarefa existente
  updateTask(taskId: string, taskUpdate: UpdateTaskDto): Observable<Task> {
    const url = `${this.apiUrl}/${taskId}`;
    return this.http.put<Task>(url, taskUpdate);
  }

  // Deletar uma tarefa
  deleteTask(taskId: string): Observable<{ message: string }> {
    const url = `${this.apiUrl}/${taskId}`;
    return this.http.delete<{ message: string }>(url);
  }

  //Deletar todas as tarefas concluídas
  deleteCompletedTasks(): Observable<{ message: string }> {
    const url = `${this.apiUrl}/completed`;
    return this.http.delete<{ message: string }>(url);
  }

  // Deletar todas as tarefas do usuário logado
  deleteAllTasks(): Observable<{ message: string }> {
    const url = `${this.apiUrl}/all`;
    return this.http.delete<{ message: string }>(url);
  }
}
