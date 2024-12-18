import { HttpClient, HttpHeaders } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { AuthStatus } from '../interfaces/auth-status.enum';
import { catchError, map, of, throwError } from 'rxjs';
import { LoginResponse } from '../interfaces/login-response.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);

  private readonly API_URL = environment.API_HOST;
  private _currentId = signal<string | undefined>(undefined);
  private _authStatus = signal<AuthStatus>(AuthStatus.checking);

  public currentId = computed(() => this._currentId());
  public authStatus = computed(() => this._authStatus());

  constructor() {
    this.checkToken().subscribe();
  }

  private setAuthentication(id: string, token: string) {
    this._currentId.set(id);
    this._authStatus.set(AuthStatus.authenticated);
    localStorage.setItem('token', token);
    return true;
  }

  login(userName: string, password: string) {
    const url = `${this.API_URL}/auth/login`;
    const body = { userName, password };

    return this.http.post<LoginResponse>(url, body).pipe(
      map(({ id, token }) => this.setAuthentication(id, token)),
      catchError((err) => throwError(() => err.error.message))
    );
  }

  private checkToken() {
    const url = `${this.API_URL}/auth/check-token`;
    const token = localStorage.getItem('token');

    if (!token) {
      this.logout();
      return of(false);
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<LoginResponse>(url, { headers }).pipe(
      map(({ id, token }) => this.setAuthentication(id, token)),
      catchError((err) => {
        this._authStatus.set(AuthStatus.notAuthenticated);
        return of(false);
      })
    );
  }

  logout() {
    this._currentId.set(undefined);
    this._authStatus.set(AuthStatus.notAuthenticated);
    localStorage.removeItem('token');
  }
}
