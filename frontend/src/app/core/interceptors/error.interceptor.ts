import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router: Router = inject(Router);

  return next(req).pipe(
    catchError(errorRespnse => {
      if (errorRespnse.status === 401) {
        localStorage.removeItem('token');
        if (router.url !== '/login') { // router.url !== '/login' && router.navigate(['/login']) poderia ser usado, mas o ESLint não permite
          router.navigate(['/login']);
        }
      } else {
        console.error('HTTP Error:', errorRespnse);
      }
      return throwError(() => errorRespnse);
    })
  );
};