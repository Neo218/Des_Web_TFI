import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginRequest, LoginResponse } from '../../../models/usuario.model';

@Injectable({
  providedIn: 'root',
})
export class LoginApiClient {
  private readonly apiUrl = 'http://localhost:3000/api/auth';

  constructor(private readonly http: HttpClient) {}

  iniciarSesion(nombre: string, clave: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { nombre, clave });
  }
}
