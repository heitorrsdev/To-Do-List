import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Task } from '../../../../core/models/task.model';

@Component({
  selector: 'app-task-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-item.component.html',
  styleUrls: ['./task-item.component.css']
})
export class TaskItemComponent {
  @Input() task!: Task;
  @Output() statusChange = new EventEmitter<Task>();
  @Output() taskSelected = new EventEmitter<Task>();

  cycleStatus(): void {
    this.statusChange.emit(this.task);
  }

  openTaskDetails(): void {
    this.taskSelected.emit(this.task);
  }
}
