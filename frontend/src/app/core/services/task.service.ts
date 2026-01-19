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
  private apiUrl = `${environment.apiUrl}/tasks`;

  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl);
  }

  createTask(taskData: CreateTaskDto): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, taskData);
  }

  updateTask(taskId: string, taskUpdate: UpdateTaskDto): Observable<Task> {
    const url = `${this.apiUrl}/${taskId}`;
    return this.http.put<Task>(url, taskUpdate);
  }

  deleteTask(taskId: string): Observable<{ message: string }> {
    const url = `${this.apiUrl}/${taskId}`;
    return this.http.delete<{ message: string }>(url);
  }

  deleteCompletedTasks(): Observable<{ message: string }> {
    const url = `${this.apiUrl}/completed`;
    return this.http.delete<{ message: string }>(url);
  }

  deleteAllTasks(): Observable<{ message: string }> {
    const url = `${this.apiUrl}/all`;
    return this.http.delete<{ message: string }>(url);
  }
}
