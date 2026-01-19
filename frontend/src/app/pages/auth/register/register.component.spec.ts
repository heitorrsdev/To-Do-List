import { AuthService } from '../../../core/services/auth.service';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NotificationService } from '../../../core/services/notification.service';
import { RegisterComponent } from './register.component';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';

const mockAuthService = {
  register: jasmine.createSpy().and.returnValue(of(true)),
  login: jasmine.createSpy().and.returnValue(of(true))
};

const mockNotificationService = {
  showSuccess: jasmine.createSpy()
};

@Component({ template: '' }) class DummyHomeComponent {}

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let router: Router;

  beforeEach(async () => {
    mockAuthService.register.and.returnValue(of(true)); // reseta o retorno padrão
    await TestBed.configureTestingModule({
      imports: [
        RegisterComponent,
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([
          { path: '', component: DummyHomeComponent }
        ])
      ],
      providers: [
        FormBuilder,
        { provide: AuthService, useValue: mockAuthService },
        { provide: NotificationService, useValue: mockNotificationService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should mark all fields as touched if form is invalid', () => {
    component.registerForm.setValue({ email: '', password: '', confirmPassword: '' });
    component.onSubmit();

    expect(component.registerForm.touched).toBeTrue();
    expect(component.registerForm.get('email')?.touched).toBeTrue();
    expect(component.registerForm.get('password')?.touched).toBeTrue();
    expect(component.registerForm.get('confirmPassword')?.touched).toBeTrue();
  });

  it('should show password mismatch error', () => {
    component.registerForm.setValue({
      email: 'test@test.com',
      password: '123456',
      confirmPassword: 'different'
    });

    component.onSubmit();

    expect(component.registerForm.errors?.['passwordMismatch']).toBeTrue();
  });

  it('should call register and login, then navigate on success', () => {
    const navigateSpy = spyOn(router, 'navigate');
    component.registerForm.setValue({
      email: 'test@test.com',
      password: '123456',
      confirmPassword: '123456'
    });

    component.onSubmit();

    expect(mockAuthService.register).toHaveBeenCalledWith({ email: 'test@test.com', password: '123456' });
    expect(mockAuthService.login).toHaveBeenCalledWith({ email: 'test@test.com', password: '123456' });
    expect(mockNotificationService.showSuccess).toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalledWith(['/']);
  });

  it('should handle registration error', () => {
    mockAuthService.register.and.returnValue(throwError(() => new Error('Erro de registro')));

    component.registerForm.setValue({
      email: 'test@test.com',
      password: '123456',
      confirmPassword: '123456'
    });

    component.onSubmit();

    expect(component.isLoading).toBeFalse();
  });
});
