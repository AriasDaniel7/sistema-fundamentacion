import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import {
  Project,
  ProjectCreate,
  ProjectResponse,
  ProjectResponseInformation,
} from '../interfaces/project-response.interface';
import { catchError, of, throwError } from 'rxjs';
import {
  CreateUserProjectRoleResponse,
  CreateUserProjectRole,
} from '../interfaces/relations.interface';
import { UserByProjectResponse } from '../interfaces/user-response.interface';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private http = inject(HttpClient);

  private readonly API_URL = environment.API_HOST;
  constructor() {}

  getProjectById(id: string) {
    const url = `${this.API_URL}/project/${id}`;
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http
      .get<ProjectResponseInformation>(url, { headers })
      .pipe(catchError(() => of(undefined)));
  }

  getProjectsByUserId(id: string) {
    const url = `${this.API_URL}/user/${id}/projects`;
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http
      .get<ProjectResponse[]>(url, { headers })
      .pipe(catchError(() => of([])));
  }

  getUserByIDAndProjectID(userId: string, projectId: string) {
    const url = `${this.API_URL}/project/${projectId}/user/${userId}`;
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http
      .get<UserByProjectResponse>(url, { headers })
      .pipe(catchError(() => of(undefined)));
  }

  createProject(project: ProjectCreate) {
    const url = `${this.API_URL}/project`;
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http
      .post<Project>(url, project, { headers })
      .pipe(catchError((err) => throwError(() => err.error.message)));
  }

  createAssignationUserRole(createUserProjectRole: CreateUserProjectRole) {
    const url = `${this.API_URL}/user-project-role/assign`;
    const token = localStorage.getItem('token');
    const body = createUserProjectRole;

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.post<CreateUserProjectRoleResponse>(url, body, {
      headers,
    });
  }

  deleteProject(id: string) {
    const url = `${this.API_URL}/project/${id}`;
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete(url, { headers });
  }
}
