import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { NotificationService } from '../services/notification.service';
import { Router } from '@angular/router';
import { TestBed } from '@angular/core/testing';
import { errorInterceptor } from './error.interceptor';
import { throwError } from 'rxjs';

describe('errorInterceptor', () => {
  let nextFn: jasmine.Spy<HttpHandlerFn>;
  let routerSpy: jasmine.SpyObj<Router>;
  let notificationServiceSpy: jasmine.SpyObj<NotificationService>;

  beforeEach(() => {
    routerSpy = jasmine.createSpyObj<Router>('Router', ['navigate'], { url: '/test' });
    notificationServiceSpy = jasmine.createSpyObj<NotificationService>('NotificationService', ['showError']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: NotificationService, useValue: notificationServiceSpy }
      ]
    });

    nextFn = jasmine.createSpy<HttpHandlerFn>('next');
    localStorage.clear();
  });

  it('should remove token and navigate to /login when status is 401 and current URL is not /login', (done) => {
    spyOn(localStorage, 'removeItem');
    nextFn.and.returnValue(throwError(() => ({ status: 401, error: { message: 'Unauthorized' } })));

    const req = new HttpRequest('GET', '/test');

    TestBed.runInInjectionContext(() => {
      errorInterceptor(req, nextFn).subscribe({
        error: (err) => {
          expect(localStorage.removeItem).toHaveBeenCalledWith('token');
          expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
          expect(notificationServiceSpy.showError).toHaveBeenCalledWith('Unauthorized');
          expect(err.status).toBe(401);
          done();
        }
      });
    });
  });

  it('should not navigate when already on /login even if status is 401', (done) => {
    Object.defineProperty(routerSpy, 'url', { get: () => '/login' });
    spyOn(localStorage, 'removeItem');
    nextFn.and.returnValue(throwError(() => ({ status: 401, error: { message: 'Unauthorized' } })));

    const req = new HttpRequest('GET', '/test');

    TestBed.runInInjectionContext(() => {
      errorInterceptor(req, nextFn).subscribe({
        error: () => {
          expect(localStorage.removeItem).toHaveBeenCalledWith('token');
          expect(routerSpy.navigate).not.toHaveBeenCalled();
          expect(notificationServiceSpy.showError).toHaveBeenCalledWith('Unauthorized');
          done();
        }
      });
    });
  });

  it('should not remove token or navigate when status is different from 401', (done) => {
    nextFn.and.returnValue(throwError(() => ({ status: 500, error: { message: 'Server error' } })));

    const req = new HttpRequest('GET', '/test');

    TestBed.runInInjectionContext(() => {
      errorInterceptor(req, nextFn).subscribe({
        error: () => {
          expect(routerSpy.navigate).not.toHaveBeenCalled();
          expect(notificationServiceSpy.showError).toHaveBeenCalledWith('Server error');
          done();
        }
      });
    });
  });
});
