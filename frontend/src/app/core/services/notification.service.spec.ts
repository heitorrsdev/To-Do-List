import { NotificationService } from './notification.service';
import { TestBed } from '@angular/core/testing';
import { take } from 'rxjs';

describe('NotificationService', () => {
  let service: NotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotificationService);
  });

  afterEach(() => {
    service.clearNotifications();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create error notification', (done) => {
    const message = 'Ocorreu um erro :(';
    service.showError(message, 0); // duração 0 para não sumir

    service.notifications$.pipe(take(1)).subscribe(notifications => {
      expect(notifications.length).toBe(1);
      expect(notifications[0].message).toBe(message);
      expect(notifications[0].type).toBe('error');
      done();
    });
  });

  it('should create a success notification', (done) => {
    const message = 'Ação realizada com sucesso =)';
    service.showSuccess(message, 0);

    service.notifications$.pipe(take(1)).subscribe(notifications => {
      expect(notifications.length).toBe(1);
      expect(notifications[0].message).toBe(message);
      expect(notifications[0].type).toBe('success');
      done();
    });
  });

  it('should create a warning notification', (done) => {
    const message = 'Não é possível realizar essa ação.';
    service.showWarning(message, 0);

    service.notifications$.pipe(take(1)).subscribe(notifications => {
      expect(notifications.length).toBe(1);
      expect(notifications[0].message).toBe(message);
      expect(notifications[0].type).toBe('warning');
      done();
    });
  });

  it('should create a info notification', (done) => {
    const message = 'Informação muito útil e necessária';
    service.showInfo(message, 0);

    service.notifications$.pipe(take(1)).subscribe(notifications => {
      expect(notifications.length).toBe(1);
      expect(notifications[0].message).toBe(message);
      expect(notifications[0].type).toBe('info');
      done();
    });
  });

  it('should remove one notification', (done) => {
    const id = service.showInfo('Isto deve ser excluído');

    service.removeNotification(id);

    service.notifications$.pipe(take(1)).subscribe(notifications => {
      expect(notifications.length).toBe(0);
      done();
    });
  });

  it('should delete all notifications', (done) => {
    service.showError('Não deu tudo certo =(');
    service.showSuccess('Deu tudo certo =)');

    service.clearNotifications();

    service.notifications$.pipe(take(1)).subscribe(notifications => {
      expect(notifications.length).toBe(0);
      done();
    });
  });

  it('should remove a notification after a delay', (done) => {
    jasmine.clock().install();
    const id = service.showError('Erro muito errado mesmo', 3000);

    jasmine.clock().tick(2999);

    service.notifications$.pipe(take(1)).subscribe(notifications => {
      expect(notifications.some(n => n.id === id)).toBeTrue();
    });

    jasmine.clock().tick(1);

    service.notifications$.pipe(take(1)).subscribe(notifications => {
      expect(notifications.some(n => n.id === id)).toBeFalse();
      done();
    });
  });

  it('should create a error notification with default message', (done) => {
    service.showError(undefined, 0);

    service.notifications$.pipe(take(1)).subscribe(notifications => {
      expect(notifications[0].message).toBe('Ocorreu um erro inesperado. Atualize a página ou contate o suporte.');
      done();
    });
  });
});
