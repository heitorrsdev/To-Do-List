import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { NotificationService } from '../../core/services/notification.service';
import { ReactiveFormsModule } from '@angular/forms';
import { TaskService } from '../../core/services/task.service';

import { CreateTaskDto, Task, TaskStatusType } from '../../core/models/task.model';
import { EmptyStateComponent } from './components/empty-state/empty-state.component';
import { FooterComponent } from './components/footer/footer.component';
import { TaskActionsComponent } from './components/task-actions/task-actions.component';
import { TaskDialogComponent } from './components/task-dialog/task-dialog.component';
import { TaskFormComponent } from './components/task-form/task-form.component';
import { TaskItemComponent } from './components/task-item/task-item.component';
import { TaskListHeaderComponent } from './components/task-list-header/task-list-header.component';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    CommonModule,
    EmptyStateComponent,
    FooterComponent,
    ReactiveFormsModule,
    TaskActionsComponent,
    TaskDialogComponent,
    TaskFormComponent,
    TaskItemComponent,
    TaskListHeaderComponent
  ],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {
  editTaskTitle: string = '';
  isEditingTask: boolean = false;
  isLoading: boolean = false;
  isTaskDialogOpen = false;
  selectedTask: Task | null = null;
  taskIdToDelete: string | null = null;
  tasks: Task[] = [];

  private notificationService = inject(NotificationService);
  private taskService = inject(TaskService);

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.isLoading = true;

    this.taskService.getTasks().subscribe({
      next: (tasks) => {
        this.tasks = tasks;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  onTaskSubmitted(newTaskData: CreateTaskDto): void {
    this.isLoading = true;

    this.taskService.createTask(newTaskData).subscribe({
      next: (newTask) => {
        this.tasks.push(newTask);
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  onTaskStatusChange(task: Task): void {
    const statusOrder: Array<TaskStatusType> = ['pending', 'in-progress', 'completed'];
    const currentIdx: number = statusOrder.indexOf(task.status);
    const nextStatus: TaskStatusType = statusOrder[(currentIdx + 1) % statusOrder.length];

    // Atualização otimista: altera localmente antes da resposta
    const originalStatus = task.status;
    task.status = nextStatus;

    this.isLoading = true;

    this.taskService.updateTask(task._id, { status: nextStatus }).subscribe({
      next: () => {
        this.isLoading = false;
      },
      error: () => {
        task.status = originalStatus;
        this.isLoading = false;
      }
    });
  }

  onTaskSelected(task: Task): void {
    this.selectedTask = { ...task };
    this.editTaskTitle = task.title;
    this.isTaskDialogOpen = true;
    this.isEditingTask = false;
  }

  onEditEnabled(): void {
    this.isEditingTask = true;
    this.editTaskTitle = this.selectedTask?.title || '';
  }

  onEditCancelled(): void {
    this.isEditingTask = false;
    this.editTaskTitle = this.selectedTask?.title || '';
  }

  onEditSaved(newTitle: string): void {
    if (!this.selectedTask || !newTitle.trim() || newTitle.trim() === this.selectedTask.title) {
      return;
    }

    this.isLoading = true;

    this.taskService.updateTask(this.selectedTask._id, { title: newTitle.trim() }).subscribe({
      next: (updatedTask) => {
        const index = this.tasks.findIndex(t => t._id === updatedTask._id);
        if (index !== -1) {
          this.tasks[index] = updatedTask;
        }
        this.closeTaskDialog();
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  onDeleteRequested(taskId: string): void {
    if (!taskId) return;
    this.taskIdToDelete = taskId;
  }

  onDeleteConfirmed(): void {
    if (!this.taskIdToDelete) return;

    this.isLoading = true;

    this.taskService.deleteTask(this.taskIdToDelete).subscribe({
      next: () => {
        this.tasks = this.tasks.filter(task => task._id !== this.taskIdToDelete);
        this.closeTaskDialog();
        this.isLoading = false;
        this.notificationService.showSuccess('Tarefa deletada com sucesso!');
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  onDeleteCancelled(): void {
    this.taskIdToDelete = null;
  }

  onDeleteCompletedTasks(): void {
    this.isLoading = true;

    this.taskService.deleteCompletedTasks().subscribe({
      next: () => {
        this.tasks = this.tasks.filter(task => task.status !== 'completed');
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  onDeleteAllTasks(): void {
    if (this.tasks.length === 0) {
      this.notificationService.showWarning('Nenhuma tarefa para deletar.');
      return;
    }

    this.isLoading = true;

    this.taskService.deleteAllTasks().subscribe({
      next: () => {
        this.tasks = [];
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  closeTaskDialog(): void {
    this.editTaskTitle = '';
    this.isEditingTask = false;
    this.isLoading = false;
    this.isTaskDialogOpen = false;
    this.selectedTask = null;
    this.taskIdToDelete = null;
  }

  hasTasks(): boolean {
    return this.tasks.length > 0;
  }

  hasCompletedTasks(): boolean {
    return this.tasks.some(task => task.status === 'completed');
  }

  trackByTaskId(index: number, task: Task): string {
    return task._id;
  }
}
