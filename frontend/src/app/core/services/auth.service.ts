import { Credentials } from '../models/credentials.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { inject, Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';

interface RegisterResponse {
  message?: string;
  error?: string;
}
interface LoginResponse {
  token?: string;
  error?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = environment.apiUrl;

  private http = inject(HttpClient);
  private router = inject(Router);

  login(credentials: Credentials): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => { // tap é usado para executar efeitos colaterais
        if (response.token) {
          this.saveToken(response.token);
          /* response.token && this.saveToken(response.token);
          isso poderia ser usado ao invés do if, mas o ESLint não permite */
        }
      })
    );
  }

  register(credentials: Credentials): Observable<RegisterResponse> {
    const { email, password } = credentials;
    return this.http.post<RegisterResponse>(`${this.apiUrl}/register`, { email, password });
  }

  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  private saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  get token(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.token;
  }
}
