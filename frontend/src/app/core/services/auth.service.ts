import { Credentials } from '../models/credentials.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
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

  constructor(private http: HttpClient, private router: Router) { }

  login(credentials: Credentials): Observable<LoginResponse> {
    const { email, password } = credentials;
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap(response => { // tap é usado para executar efeitos colaterais
        if (response.token) {
          this.saveToken(response.token);
          /* response.token && this.saveToken(response.token);
           isso poderia ser usado ao invés do if, mas o ESLint reclama */
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

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
