import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { Component } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { LoginComponent } from './login.component';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';

const mockAuthService = {
  login: jasmine.createSpy().and.returnValue(of(true))
};

@Component({ template: '' }) class DummyRegisterComponent { }


describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    mockAuthService.login.calls.reset();
    mockAuthService.login.and.returnValue(of(true)); // Retorna sucesso por padrão, já que não é ele quem está sendo testado
    await TestBed.configureTestingModule({
      imports: [
        LoginComponent,
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([
          { path: 'register', component: DummyRegisterComponent }
        ])
      ],
      providers: [
        FormBuilder,
        { provide: ActivatedRoute, useValue: {} },
        { provide: AuthService, useValue: mockAuthService },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Inicializa o componente (chama ngOnInit, renderiza o DOM, etc.)
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should mark all fields as touched if the form is invalid', () => {
    component.loginForm.setValue({ email: '', password: '' });
    component.onSubmit();

    expect(component.loginForm.touched).toBeTrue();
    expect(component.loginForm.get('email')?.touched).toBeTrue();
    expect(component.loginForm.get('password')?.touched).toBeTrue();
  });

  it('should call AuthService.login if the form is valid', () => {
    component.loginForm.setValue({ email: 'teste@teste.com', password: '123' });
    component.onSubmit();

    expect(mockAuthService.login).toHaveBeenCalledWith({
      email: 'teste@teste.com',
      password: '123'
    });
  });

  it('should navigate to "/" after successful login', fakeAsync(() => {
    const router = TestBed.inject(Router);
    const navigateSpy = spyOn(router, 'navigate').and.resolveTo(true);

    component.loginForm.setValue({ email: 'teste@teste.com', password: '123' });
    component.onSubmit();

    fixture.detectChanges();
    tick(); // avança o relógio virtual para concluir promises e observables

    expect(navigateSpy).toHaveBeenCalledWith(['/']);
  }));

  it('should handle login error', fakeAsync(() => {
    mockAuthService.login.and.returnValue(throwError(() => new Error('Erro')));

    component.loginForm.setValue({ email: 'teste@teste.com', password: '123' });
    component.onSubmit();

    tick(2100);

    expect(component.isLoading).toBeFalse();
  }));
});
