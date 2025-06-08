import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router: Router = inject(Router);

  return next(req).pipe(
    catchError(error => {
      if (error.status === 401) {
        localStorage.removeItem('token');
        if (router.url !== '/login') {
          router.navigate(['/login']);
        }
      } else {
        console.error('HTTP Error:', error);
      }
      return throwError(() => error);
    })
  );
};