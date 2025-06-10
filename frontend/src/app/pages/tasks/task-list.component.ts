import { AuthService } from '../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { DialogComponent } from '../../components/dialog/dialog.component';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
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
  isDeleteDialogOpen = false;
  isEditDialogOpen = false;
  isLoading = false;
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

    this.isLoading = true; // Indica carregamento para operação de adicionar
    this.errorMessage = null;
    const newTaskData: CreateTaskDto = this.addTaskForm.value;

    this.taskService.createTask(newTaskData).subscribe({
      next: (newTask) => {
        this.tasks.push(newTask); // Adiciona à lista localmente
        this.addTaskForm.reset(); // Reseta o formulário
        this.isLoading = false;
        // Opcionalmente exibe uma mensagem de sucesso
      },
      error: (err) => {
        this.errorMessage = 'Erro ao adicionar tarefa.';
        console.error('Failed to add task:', err);
        this.isLoading = false;
      }
    });
  }

  getStatusLabel(status: 'pending' | 'in-progress' | 'completed'): string {
    switch (status) {
      case 'pending': return 'Pendente';
      case 'in-progress': return 'Em progresso';
      case 'completed': return 'Concluída';
      default: return status;
    }
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

  openDeleteDialog(taskId: string): void {
    this.taskIdToDelete = taskId;
    this.isDeleteDialogOpen = true;
  }

  confirmDelete(): void {
    if (!this.taskIdToDelete) return;
    this.taskService.deleteTask(this.taskIdToDelete).subscribe({
      next: () => {
        this.tasks = this.tasks.filter(task => task._id !== this.taskIdToDelete);
        this.closeDeleteDialog();
      },
      error: (err) => {
        this.errorMessage = 'Erro ao excluir tarefa.';
        this.closeDeleteDialog();
        console.error('Failed to delete task:', err);
      }
    });
  }

  closeDeleteDialog(): void {
    this.isDeleteDialogOpen = false;
    this.taskIdToDelete = null;
  }

  openEditDialog(task: Task): void {
    this.selectedTask = { ...task };
    this.editTaskTitle = task.title;
    this.isEditDialogOpen = true;
  }

  saveEdit(): void {
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
        this.isEditDialogOpen = false;
        this.selectedTask = null;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Erro ao editar tarefa.';
        console.error('Failed to edit task:', err);
        this.isLoading = false;
        this.closeEditDialog();
      }
    });
  }

  closeEditDialog(): void {
    this.isEditDialogOpen = false;
    this.selectedTask = null;
    this.editTaskTitle = '';
    this.addTaskForm.reset();
  }

  logout(): void {
    this.authService.logout();
  }
}
