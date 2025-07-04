import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

type TaskStatus = 'pending' | 'in-progress' | 'completed';

@Component({
  selector: 'app-task-status-badge',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-status-badge.component.html',
  styleUrls: ['./task-status-badge.component.css']
})
export class TaskStatusBadgeComponent {
  @Input() status: TaskStatus = 'pending';
  @Output() statusChange = new EventEmitter<void>();

  onStatusClick(): void {
    this.statusChange.emit();
  }
}
