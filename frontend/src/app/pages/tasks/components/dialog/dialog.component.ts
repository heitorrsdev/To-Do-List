import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class DialogComponent {
  @Input() open = false;
  @Input() closeOnBackdropClick = true;
  @Output() closed = new EventEmitter<void>();

  close(): void {
    this.closed.emit();
  }

  onBackdropClick(event: MouseEvent): void {
    // Verifica se o evento é um clique no backdrop e se o backdrop deve fechar o diálogo
    if (this.closeOnBackdropClick && event.target === event.currentTarget) {
      this.close();
    }
  }
}
