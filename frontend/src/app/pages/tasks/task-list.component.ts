import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TASK_TITLE_MAX_LENGTH } from '../../core/constants';
import { Task, TaskService, CreateTaskDto } from '../../core/services/task.service';

// Componentes modulares
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

  private taskService = inject(TaskService);

  ngOnInit(): void {
    this.loadTasks();
  }

  // ===== CRUD de tarefas =====
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
    const statusOrder: Array<'pending' | 'in-progress' | 'completed'> = ['pending', 'in-progress', 'completed'];
    const currentIdx = statusOrder.indexOf(task.status);
    const nextStatus = statusOrder[(currentIdx + 1) % statusOrder.length];

    this.isLoading = true;

    this.taskService.updateTask(task._id, { status: nextStatus }).subscribe({
      next: (updatedTask) => {
        const index = this.tasks.findIndex(t => t._id === updatedTask._id);
        if (index !== -1) {
          this.tasks[index] = updatedTask;
        }
        this.isLoading = false;
      },
      error: () => {
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
    if (!this.selectedTask || !newTitle.trim() || newTitle.trim() === this.selectedTask.title || newTitle.length > TASK_TITLE_MAX_LENGTH) {
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
    this.isTaskDialogOpen = false;
    this.selectedTask = null;
    this.editTaskTitle = '';
    this.isEditingTask = false;
    this.taskIdToDelete = null;
  }

  hasCompletedTasks(): boolean {
    return this.tasks.some(task => task.status === 'completed');
  }

  trackByTaskId(index: number, task: Task): string {
    return task._id;
  }
}
