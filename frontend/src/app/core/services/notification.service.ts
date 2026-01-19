import { BehaviorSubject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Notification, NotificationType } from '../models/notification.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  public notifications$: Observable<Notification[]> = this.notificationsSubject.asObservable(); // asObservable esconde os métodos de escrita, permitindo apenas a leitura de dados
  private defaultErrorMessage = 'Ocorreu um erro inesperado. Atualize a página ou contate o suporte.';

  private addNotification(type: NotificationType, message: string, duration: number): string {
    const id = this.generateId();
    const notification: Notification = { id, type, message, duration };

    const currentNotifications = this.notificationsSubject.value;
    this.notificationsSubject.next([...currentNotifications, notification]);

    if (duration > 0) {
      setTimeout(() => this.removeNotification(id), duration);
    }

    return id;
  }

  showError(message: string = this.defaultErrorMessage, duration: number = 5000): string {
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

  removeNotification(id: string): void {
    const currentNotifications = this.notificationsSubject.value;
    this.notificationsSubject.next(
      currentNotifications.filter(notification => notification.id !== id)
    );
  }

  clearNotifications(): void {
    this.notificationsSubject.next([]);
  }

  private generateId(): string {
    return `notification-${new Date().getTime()}-${Math.floor(Math.random() * 1000)}`;
  }
}
