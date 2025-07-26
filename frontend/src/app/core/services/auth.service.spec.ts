import { AuthService } from './auth.service';
import { Credentials } from '../models/credentials.model';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../../environments/environment';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let mockRouter: jasmine.SpyObj<Router>;

  const apiUrl = environment.apiUrl;

  beforeEach(() => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        { provide: Router, useValue: mockRouter }
      ]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);

    // Limpa o localStorage antes de cada teste
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify(); // verifica se não tem requisições sem resposta
  });

  it('should login and save token', () => {
    const credentials: Credentials = { email: 'teste@email.com', password: '123456' };
    const fakeToken = 'fake-jwt-token';

    service.login(credentials).subscribe(response => {
      expect(response.token).toBe(fakeToken);
      expect(localStorage.getItem('token')).toBe(fakeToken);
    });

    const req = httpMock.expectOne(`${apiUrl}/login`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(credentials);
    /* o toEqual compara o valor de variáveis, mesmo que tenham referências disdintas.
      Ele deve ser usado para arrays, objetos e classes.
      Para variaveis simples usar o toBe (===)
    */
    req.flush({ token: fakeToken });
  });

  it('should register a new user and return success message', () => {
    const credentials: Credentials = { email: 'teste@email.com', password: '123456' };
    const responseMock = { message: 'Conta criada com sucesso' };

    service.register(credentials).subscribe(response => {
      expect(response.message).toBe('Conta criada com sucesso');
    });

    const req = httpMock.expectOne(`${apiUrl}/register`);
    expect(req.request.method).toBe('POST');
    req.flush(responseMock);
  });

  it('should remove token and navigate to login', () => {
    localStorage.setItem('token', 'fake-token');

    service.logout();

    expect(localStorage.getItem('token')).toBeNull();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should return token', () => {
    localStorage.setItem('token', 'meu-token');

    expect(service.token).toBe('meu-token');
  });

  it('should return true if logged in', () => {
    localStorage.setItem('token', 'qualquer-token');

    expect(service.isLoggedIn()).toBeTrue();
  });

  it('should return false if not logged in', () => {
    localStorage.removeItem('token');

    expect(service.isLoggedIn()).toBeFalse();
  });
});
