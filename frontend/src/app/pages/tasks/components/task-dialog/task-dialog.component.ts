import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, ViewChild, ElementRef } from '@angular/core';
import { DialogComponent } from '../dialog/dialog.component';
import { FormsModule } from '@angular/forms';
import { TASK_TITLE_MAX_LENGTH } from '../../../../core/constants';
import { Task } from '../../../../core/services/task.service';

@Component({
  selector: 'app-task-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DialogComponent
  ],
  templateUrl: './task-dialog.component.html',
  styleUrls: ['./task-dialog.component.css']
})
export class TaskDialogComponent {
  @Input() isOpen = false;
  @Input() task: Task | null = null;
  @Input() isLoading = false;
  @Input() isEditing = false;
  @Input() taskIdToDelete: string | null = null;
  @Input() editTaskTitle = '';

  @Output() closed = new EventEmitter<void>();
  @Output() editEnabled = new EventEmitter<void>();
  @Output() editCancelled = new EventEmitter<void>();
  @Output() editSaved = new EventEmitter<string>();
  @Output() deleteConfirmed = new EventEmitter<void>();
  @Output() deleteCancelled = new EventEmitter<void>();
  @Output() deleteRequested = new EventEmitter<string>();

  @ViewChild('editTaskInput') editTaskInput!: ElementRef<HTMLTextAreaElement>;

  TASK_TITLE_MAX_LENGTH: number = TASK_TITLE_MAX_LENGTH; // Usado apenas no template

  closeDialog(): void {
    this.closed.emit();
  }

  enableEditTask(): void {
    this.editEnabled.emit();
  }

  cancelEditTask(): void {
    this.editCancelled.emit();
  }

  saveEditTask(): void {
    this.editSaved.emit(this.editTaskTitle);
  }

  showDeleteTaskConfirmation(taskId: string | undefined): void {
    if (!taskId) return;
    this.deleteRequested.emit(taskId);
  }

  confirmDeleteTask(): void {
    this.deleteConfirmed.emit();
  }

  cancelDeleteTask(): void {
    this.deleteCancelled.emit();
  }

  resizeTextarea(textarea: HTMLTextAreaElement, maxHeight: number = 170): void {
    textarea.style.height = 'auto';
    const newHeight = Math.min(textarea.scrollHeight, maxHeight);
    textarea.style.height = `${newHeight}px`;
    textarea.style.overflowY = textarea.scrollHeight > maxHeight ? 'auto' : 'hidden';
  }
}
