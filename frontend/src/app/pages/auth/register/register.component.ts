import { AuthService } from '../../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';

// Validador personalizado para correspondência de senhas
function passwordMatchValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { passwordMismatch: true };
    }
    return null;
  };
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]], // Mínimo de caracteres
      confirmPassword: ['', Validators.required]
    }, { validators: passwordMatchValidator() });
  }

  onSubmit(): void {
    this.errorMessage = null;
    this.successMessage = null;

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    // Exclui confirmPassword antes de enviar para o backend
    const userData = { ...this.registerForm.value };
    delete userData.confirmPassword;

    this.authService.register(userData).subscribe({
      next: () => {
        this.successMessage = 'Registro realizado com sucesso! Você será redirecionado para o login.';
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000); // Redireciona após 2 segundos
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Falha no registro. Tente novamente.';
        console.error('Registration failed:', err);
      }
    });
  }
}

