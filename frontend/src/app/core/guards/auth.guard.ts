import { AuthService } from '../services/auth.service';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (): boolean | UrlTree => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Se não está logado, retorna uma UrlTree para redirecionar
  if (!authService.isLoggedIn()) {
    return router.createUrlTree(['/login']);
  }

  return true;
};
