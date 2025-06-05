import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css'],
  standalone: true,
})
export class DialogComponent {
  @Input() open = false;
  @Output() closed = new EventEmitter<void>();

  close() {
    this.closed.emit();
  }
}
