import { CreateTaskDto, Task, UpdateTaskDto } from '../models/task.model';
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

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
