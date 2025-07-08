import { AuthService } from '../../../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { inject } from '@angular/core';

@Component({
  selector: 'app-task-list-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-list-header.component.html',
  styleUrls: ['./task-list-header.component.css']
})
export class TaskListHeaderComponent {

  private authService = inject(AuthService);

  logout(): void {
    this.authService.logout();
  }
}
