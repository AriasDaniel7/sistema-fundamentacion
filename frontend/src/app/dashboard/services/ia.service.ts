import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { map } from 'rxjs';
import { ChatInitResponse } from '../interfaces/chatInit-response.interface';
import { IaResponse } from '../interfaces/ia-response.interface';

@Injectable({
  providedIn: 'root',
})
export class IaService {
  private http = inject(HttpClient);
  private sessionId: string = '';
  private readonly API_URL = environment.API_HOST;

  constructor() {}

  initChat(name: string, description: string) {
    return this.http
      .post<ChatInitResponse>(`${this.API_URL}/ia/iniciar`, {
        name,
        description,
      })
      .pipe(
        map((response) => {
          this.sessionId = response.sessionId;
          return response;
        })
      );
  }

  sendMessage(message: string) {
    return this.http.post<IaResponse>(`${this.API_URL}/ia/enviar/${this.sessionId}`, {
      message,
    });
  }
}
