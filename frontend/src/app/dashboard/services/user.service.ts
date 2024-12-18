import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { catchError, of } from 'rxjs';
import { UserResponse } from '../interfaces/user-response.interface';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);

  private readonly API_URL = environment.API_HOST;
  constructor() {}

  getUser(id: string) {
    const url = `${this.API_URL}/user/${id}`;
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http
      .get<UserResponse>(url, { headers })
      .pipe(catchError(() => of(null)));
  }

  getUsers() {
    const url = `${this.API_URL}/users`;
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http
      .get<UserResponse[]>(url, { headers })
      .pipe(catchError(() => of([])));
  }
}
