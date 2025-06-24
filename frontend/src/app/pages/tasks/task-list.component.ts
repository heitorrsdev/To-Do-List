import { AuthService } from '../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { DialogComponent } from '../../components/dialog/dialog.component';
import { FormBuilder, FormGroup, FormsModule, Validators, ReactiveFormsModule } from '@angular/forms';
import { Task, TaskService, CreateTaskDto } from '../../core/services/task.service';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    CommonModule,
    DialogComponent,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {
  addTaskForm!: FormGroup;
  editTaskTitle: string = '';
  errorMessage: string | null = null;
  isEditingTask = false;
  isLoading = false;
  isTaskDialogOpen = false;
  selectedTask: Task | null = null;
  showDeleteConfirmation = false;
  taskIdToDelete: string | null = null;
  tasks: Task[] = [];

  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  private taskService = inject(TaskService);

  ngOnInit(): void {
    this.addTaskForm = this.fb.group({
      title: ['', Validators.required]
    });
    this.loadTasks();
  }

  // ===== CRUD de tarefas =====
  loadTasks(): void {
    this.isLoading = true;
    this.errorMessage = null;
    this.taskService.getTasks().subscribe({
      next: (tasks) => {
        this.tasks = tasks;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Erro ao carregar tarefas.';
        console.error('Failed to load tasks:', err);
        this.isLoading = false;
      }
    });
  }

  addTask(): void {
    if (this.addTaskForm.invalid) {
      this.addTaskForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;
    const newTaskData: CreateTaskDto = this.addTaskForm.value;

    this.taskService.createTask(newTaskData).subscribe({
      next: (newTask) => {
        this.tasks.push(newTask);
        this.addTaskForm.reset();
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Erro ao adicionar tarefa.';
        console.error('Failed to add task:', err);
        this.isLoading = false;
      }
    });
  }

  cycleTaskStatus(task: Task): void {
    const statusOrder: Array<'pending' | 'in-progress' | 'completed'> = ['pending', 'in-progress', 'completed'];
    const currentIdx = statusOrder.indexOf(task.status);
    const nextStatus = statusOrder[(currentIdx + 1) % statusOrder.length];
    this.isLoading = true;
    this.errorMessage = null;
    this.taskService.updateTask(task._id, { status: nextStatus }).subscribe({
      next: (updatedTask) => {
        const index = this.tasks.findIndex(t => t._id === updatedTask._id);
        if (index !== -1) {
          this.tasks[index] = updatedTask;
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Erro ao atualizar status da tarefa.';
        console.error('Failed to update task status:', err);
        this.isLoading = false;
      }
    });
  }

  saveEditTask(): void {
    if (!this.selectedTask || !this.editTaskTitle.trim() || this.editTaskTitle.trim() === this.selectedTask.title) {
      return;
    }
    this.isLoading = true;
    this.errorMessage = null;
    this.taskService.updateTask(this.selectedTask._id, { title: this.editTaskTitle.trim() }).subscribe({
      next: (updatedTask) => {
        const index = this.tasks.findIndex(t => t._id === updatedTask._id);
        if (index !== -1) {
          this.tasks[index] = updatedTask;
        }
        this.closeTaskDialog();
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Erro ao editar tarefa.';
        this.isLoading = false;
        console.error('Failed to edit task:', err);
      }
    });
  }

  deleteTask(taskId: string | undefined): void {
    if (!taskId) return;
    this.isLoading = true;
    this.taskService.deleteTask(taskId).subscribe({
      next: () => {
        this.tasks = this.tasks.filter(task => task._id !== taskId);
        this.closeTaskDialog();
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Erro ao excluir tarefa.';
        this.isLoading = false;
        console.error('Failed to delete task:', err);
      }
    });
  }

  // ===== Diálogo de tarefas =====
  openTaskDialog(task: Task): void {
    this.selectedTask = { ...task };
    this.editTaskTitle = task.title;
    this.isTaskDialogOpen = true;
    this.isEditingTask = false;
  }

  closeTaskDialog(): void {
    this.isTaskDialogOpen = false;
    this.selectedTask = null;
    this.editTaskTitle = '';
    this.isEditingTask = false;
  }

  enableEditTask(): void {
    this.isEditingTask = true;
    this.editTaskTitle = this.selectedTask?.title || '';
  }

  cancelEditTask(): void {
    this.isEditingTask = false;
    this.editTaskTitle = this.selectedTask?.title || '';
  }

  // ===== Métodos auxiliares =====
  getStatusLabel(status: 'pending' | 'in-progress' | 'completed'): string {
    switch (status) {
      case 'pending': return 'Pendente';
      case 'in-progress': return 'Em progresso';
      case 'completed': return 'Concluída';
      default: return status;
    }
  }

  truncateText(text: string, maxWords: number = 20): string {
    const words = text.trim().split(/\s+/);
    if (words.length > maxWords) {
      return words.slice(0, maxWords).join(' ') + ' [...]';
    }
    return text.trim();
  }

  resizeTextarea(textarea: HTMLTextAreaElement, maxHeight?: number): void {
    maxHeight = maxHeight || 170;
    textarea.style.height = 'auto';
    const newHeight = Math.min(textarea.scrollHeight, maxHeight);
    textarea.style.height = `${newHeight}px`;
    textarea.style.overflowY = textarea.scrollHeight > maxHeight ? 'auto' : 'hidden';
  }

  trackByTaskId(index: number, task: Task): string {
    // Os parâmetros são passados automaticamente pelo Angular em uma trackByFn
    return task._id;
  }

  // ===== Getters =====
  get deleteDialogTaskTitle(): string {
    if (!this.taskIdToDelete) return '';
    const task = this.tasks.find(t => t._id === this.taskIdToDelete);
    return this.truncateText(task?.title ?? '', 10);
  }

  // ===== Logout =====
  logout(): void {
    this.authService.logout();
  }
}
