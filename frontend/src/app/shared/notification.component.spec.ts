import { By } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Notification } from '../core/models/notification.model';
import { NotificationComponent } from './notification.component';
import { NotificationService } from '../core/services/notification.service';
import { Subject, Subscription } from 'rxjs';

describe('NotificationComponent', () => {
  let component: NotificationComponent;
  let fixture: ComponentFixture<NotificationComponent>;
  let notificationServiceSpy: jasmine.SpyObj<NotificationService>;
  let notificationsSubject: Subject<Notification[]>;

  beforeEach(async () => {
    notificationsSubject = new Subject<Notification[]>();

    notificationServiceSpy = jasmine.createSpyObj('NotificationService', [
      'removeNotification'
    ], {
      notifications$: notificationsSubject.asObservable()
    });

    await TestBed.configureTestingModule({
      imports: [CommonModule, NotificationComponent, NoopAnimationsModule],
      providers: [
        { provide: NotificationService, useValue: notificationServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NotificationComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should subscribe and update notifications on ngOnInit', () => {
    const mockNotifications: Notification[] = [
      { id: '1', type: 'success', message: 'Teste OK' }
    ];

    fixture.detectChanges(); // triggers ngOnInit

    notificationsSubject.next(mockNotifications);
    fixture.detectChanges();

    expect(component.notifications).toEqual(mockNotifications);

    const notificationEls = fixture.debugElement.queryAll(By.css('.notification'));
    expect(notificationEls.length).toBe(1);
    expect(notificationEls[0].nativeElement.textContent).toContain('Teste OK');
  });

  it('should call removeNotification when closing notification', () => {
    fixture.detectChanges();

    const mockNotification: Notification = { id: '123', type: 'error', message: 'Erro' };
    component.notifications = [mockNotification];
    fixture.detectChanges();

    const closeButton = fixture.debugElement.query(By.css('.notification-close'));
    closeButton.triggerEventHandler('click', null);

    expect(notificationServiceSpy.removeNotification).toHaveBeenCalledWith('123');
  });

  it('should return the correct CSS class with getNotificationClass', () => {
    expect(component.getNotificationClass('success')).toBe('notification-success');
    expect(component.getNotificationClass('error')).toBe('notification-error');
  });

  it('should unsubscribe on ngOnDestroy', () => {
    spyOn(Subscription.prototype, 'unsubscribe');
    fixture.detectChanges();
    component.ngOnDestroy();
    expect(Subscription.prototype.unsubscribe).toHaveBeenCalled();
  });

  it('should render multiple notifications', () => {
    fixture.detectChanges();

    const mockNotifications: Notification[] = [
      { id: '1', type: 'success', message: 'OK' },
      { id: '2', type: 'warning', message: 'Cuidado' }
    ];

    notificationsSubject.next(mockNotifications);
    fixture.detectChanges();

    const notificationEls = fixture.debugElement.queryAll(By.css('.notification'));
    expect(notificationEls.length).toBe(2);
    expect(notificationEls[0].nativeElement.classList).toContain('notification-success');
    expect(notificationEls[1].nativeElement.classList).toContain('notification-warning');
  });
});
