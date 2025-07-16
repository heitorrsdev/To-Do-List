import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Notification, NotificationType } from '../models/notification.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  public notifications$: Observable<Notification[]> = this.notificationsSubject.asObservable();

  constructor() {}

  // Método genérico para adicionar notificações
  addNotification(type: NotificationType, message: string, duration: number = 5000): string {
    const id = this.generateId();
    const notification: Notification = { id, type, message, duration };

    const currentNotifications = this.notificationsSubject.value;
    this.notificationsSubject.next([...currentNotifications, notification]);

    // Auto-remover após a duração especificada
    if (duration > 0) {
      setTimeout(() => this.removeNotification(id), duration);
    }

    return id;
  }

  // Métodos específicos para cada tipo de notificação
  showError(message: string, duration: number = 5000): string {
    return this.addNotification('error', message, duration);
  }

  showSuccess(message: string, duration: number = 5000): string {
    return this.addNotification('success', message, duration);
  }

  showWarning(message: string, duration: number = 5000): string {
    return this.addNotification('warning', message, duration);
  }

  showInfo(message: string, duration: number = 5000): string {
    return this.addNotification('info', message, duration);
  }

  // Remover uma notificação específica
  removeNotification(id: string): void {
    const currentNotifications = this.notificationsSubject.value;
    this.notificationsSubject.next(
      currentNotifications.filter(notification => notification.id !== id)
    );
  }

  // Remover todas as notificações
  clearNotifications(): void {
    this.notificationsSubject.next([]);
  }

  // Gerar ID único para cada notificação
  private generateId(): string {
    return `notification-${new Date().getTime()}-${Math.floor(Math.random() * 1000)}`;
  }
}