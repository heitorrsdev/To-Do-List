import { AppRoutes } from './app.routes';
import { ApplicationConfig } from '@angular/core';
import { authInterceptor } from './core/services/auth.interceptor';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptors([authInterceptor])),
    AppRoutes
  ]
};
