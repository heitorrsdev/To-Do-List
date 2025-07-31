import { AuthService } from '../../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { NotificationService } from '../../../core/services/notification.service';
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
  isLoading: boolean = false;

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private notificationService = inject(NotificationService);
  private router = inject(Router);

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]], // Mínimo de caracteres
      confirmPassword: ['', Validators.required]
    }, { validators: passwordMatchValidator() });
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    // Exclui confirmPassword antes de enviar para o backend
    const userData = { ...this.registerForm.value };
    delete userData.confirmPassword;

    this.authService.register(userData).subscribe({
      next: () => {
        this.notificationService.showSuccess('Cadastro realizado com sucesso!');
        this.authService.login(userData).subscribe({
          next: () => {
            setTimeout(() => {
              this.isLoading = false;
              this.router.navigate(['/']);
            }, 300);
          }
        });
      },
      error: () => {
        setTimeout(() => { this.isLoading = false; }, 2000);
      }
    });
  }
}
