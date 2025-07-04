import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-task-actions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-actions.component.html',
  styleUrls: ['./task-actions.component.css']
})
export class TaskActionsComponent {
  @Input() hasCompletedTasks = false;
  @Input() isLoading = false;

  @Output() deleteCompletedTasks = new EventEmitter<void>();
  @Output() deleteAllTasks = new EventEmitter<void>();

  isMenuOpen = false;

  onDeleteCompletedTasks(): void {
    this.deleteCompletedTasks.emit();
  }

  onDeleteAllTasks(): void {
    this.deleteAllTasks.emit();
  }
}
