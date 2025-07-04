import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-task-list-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-list-header.component.html',
  styleUrls: ['./task-list-header.component.css']
})
export class TaskListHeaderComponent {
  @Output() logoutClicked = new EventEmitter<void>();

  logout(): void {
    this.logoutClicked.emit();
  }
}
