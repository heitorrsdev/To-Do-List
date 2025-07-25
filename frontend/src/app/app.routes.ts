import { LoginComponent } from './pages/auth/login/login.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { Routes } from '@angular/router';
import { TaskListComponent } from './pages/tasks/task-list.component';
import { authGuard } from './core/guards/auth.guard';
import { provideRouter } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    component: TaskListComponent,
    canActivate: [authGuard]
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  // Redireciona para a rota inicial ao acessar uma rota desconhecida. Essa rota deve ser a última da lista.
  {
    path: '**',
    redirectTo: ''
  }
];

export const AppRoutes = provideRouter(routes);
