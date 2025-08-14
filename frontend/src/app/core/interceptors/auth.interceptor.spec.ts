import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthService } from '../services/auth.service';
import { HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { authInterceptor } from './auth.interceptor';

describe('authInterceptor', () => {
  let nextFn: jasmine.Spy<HttpHandlerFn>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });

    nextFn = jasmine.createSpy<HttpHandlerFn>('next');

    localStorage.clear();
  });

  it('should call next with the original request when there is no token', () => {
    const req = new HttpRequest('GET', '/test');

    TestBed.runInInjectionContext(() => {
      authInterceptor(req, nextFn);
    });

    expect(nextFn).toHaveBeenCalledOnceWith(req);
    expect(req.headers.has('Authorization')).toBeFalse();
  });

  it('should clone the request and add the Authorization header when there is a token', () => {
    const fakeToken = 'abc123';
    localStorage.setItem('token', fakeToken);

    const req = new HttpRequest<unknown>('GET', '/test');

    TestBed.runInInjectionContext(() => {
      authInterceptor(req, nextFn);
    });

    expect(nextFn).toHaveBeenCalledTimes(1);

    const calledRequest = nextFn.calls.mostRecent().args[0] as HttpRequest<unknown>;
    expect(calledRequest.headers.get('Authorization')).toBe(`Bearer ${fakeToken}`);
    expect(calledRequest).not.toBe(req);
  });

  it('should not modify the Authorization header when there is no token', () => {
    const req = new HttpRequest<unknown>('GET', '/test');

    TestBed.runInInjectionContext(() => {
      authInterceptor(req, nextFn);
    });

    const calledRequest = nextFn.calls.mostRecent().args[0] as HttpRequest<unknown>;
    expect(calledRequest.headers.has('Authorization')).toBeFalse();
  });
});
