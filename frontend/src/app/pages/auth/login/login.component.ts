import { AuthService } from '../../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Credentials } from '../../../core/models/credentials.model';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule // Necessário para routerLink - navegação entre rotas sem recarregar a página
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup; // o ! indica que o campo será inicializado posteriormente

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  isLoading: boolean = false;

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.isLoading) return; // Previne múltiplos envios enquanto está carregando
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched(); // Marca todos os campos como tocados para exibir erros de validação
      return;
    }

    this.isLoading = true;

    const credentials: Credentials = this.loginForm.getRawValue();

    this.authService.login(credentials).subscribe({
      next: () => {
        // Navega para a página inicial após o login bem-sucedido
        this.isLoading = false;
        this.router.navigate(['/']);
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }
}
