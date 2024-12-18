import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { RoleResponse } from '../interfaces/role-response.interface';
import { catchError, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  private http = inject(HttpClient);

  private readonly API_URL = environment.API_HOST;
  constructor() {}

  getRoles() {
    const url = `${this.API_URL}/roles`;
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http
      .get<RoleResponse[]>(url, { headers })
      .pipe(catchError(() => of([])));
  }
}
