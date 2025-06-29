import { AuthService } from '../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { DialogComponent } from '../../components/dialog/dialog.component';
import { FormBuilder, FormGroup, FormsModule, Validators, ReactiveFormsModule } from '@angular/forms';
import { TASK_TITLE_MAX_LENGTH } from '../../core/constants';
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
  TASK_TITLE_MAX_LENGTH: number = TASK_TITLE_MAX_LENGTH;
  addTaskForm!: FormGroup;
  editTaskTitle: string = '';
  errorMessage: string | null = null;
  isEditingTask: boolean = false;
  isLoading: boolean = false;
  isTaskDialogOpen = false;
  selectedTask: Task | null = null;
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
    if (this.addTaskForm.invalid || this.addTaskForm.value.title.trim().length > TASK_TITLE_MAX_LENGTH) {
      this.addTaskForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;
    const newTaskData: CreateTaskDto = {
      title: this.addTaskForm.value.title.trim(),
      status: 'pending'
    };

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
    if (!this.selectedTask ||
      !this.editTaskTitle.trim() ||
      this.editTaskTitle.trim() === this.selectedTask.title ||
      this.editTaskTitle.length > TASK_TITLE_MAX_LENGTH
    ) {
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

  deleteTask(): void {
    if (!this.taskIdToDelete) return;
    this.isLoading = true;
    this.taskService.deleteTask(this.taskIdToDelete).subscribe({
      next: () => { // atualização pessimista (só atualiza a lista após a exclusão bem-sucedida)
        this.tasks = this.tasks.filter(task => task._id !== this.taskIdToDelete);
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

  showDeleteTaskConfirmation(taskId: string | undefined): void {
    if (!taskId) return;
    this.taskIdToDelete = taskId;
  }

  cancelDeleteTask(): void {
    if (!this.taskIdToDelete) return;
    this.taskIdToDelete = null;
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


  resizeTextarea(textarea: HTMLTextAreaElement, maxHeight: number = 170): void {
    textarea.style.height = 'auto';
    const newHeight = Math.min(textarea.scrollHeight, maxHeight);
    textarea.style.height = `${newHeight}px`;
    textarea.style.overflowY = textarea.scrollHeight > maxHeight ? 'auto' : 'hidden';
  }

  trackByTaskId(index: number, task: Task): string {
    // Os parâmetros são passados automaticamente pelo Angular em uma trackByFn
    return task._id;
  }

  // ===== Logout =====
  logout(): void {
    this.authService.logout();
  }
}
