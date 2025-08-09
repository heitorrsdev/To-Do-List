import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskStatusType } from '../../../../core/models/task.model';


@Component({
  selector: 'app-task-status-badge',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-status-badge.component.html',
  styleUrls: ['./task-status-badge.component.css']
})
export class TaskStatusBadgeComponent {
  @Input() status: TaskStatusType = 'pending';
  @Output() statusChange = new EventEmitter<void>();

  onStatusClick(): void {
    this.statusChange.emit();
  }
}
