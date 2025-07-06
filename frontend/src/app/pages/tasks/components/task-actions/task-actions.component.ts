import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
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
    this.isMenuOpen = false; // Fecha o menu após a ação
  }

  onDeleteAllTasks(): void {
    this.deleteAllTasks.emit();
    this.isMenuOpen = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const clickedInside = target.closest('.dropdown');
    if (!clickedInside) {
      this.isMenuOpen = false;
    }
  }
}
