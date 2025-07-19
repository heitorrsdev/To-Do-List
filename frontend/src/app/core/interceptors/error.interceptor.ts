import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, EMPTY } from 'rxjs';
import { NotificationService } from '../services/notification.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router: Router = inject(Router);
  const notificationService = inject(NotificationService);

  return next(req).pipe(
    catchError(errorResponse => {
      if (errorResponse.status === 401) {
        localStorage.removeItem('token');
        if (router.url !== '/login') { // router.url !== '/login' && router.navigate(['/login']) poderia ser usado, mas o ESLint não permite
          router.navigate(['/login']);
        }
      }
      notificationService.showError(errorResponse.error?.message);
      return EMPTY; // Retorna EMPTY para evitar log do erro
    })
  );
};