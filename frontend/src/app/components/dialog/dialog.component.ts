import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent {
  @Input() open = false;
  @Output() closed = new EventEmitter<void>();

  close() {
    this.closed.emit();
  }
}
