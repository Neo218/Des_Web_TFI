import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HistorialCambio } from './historial.model';

@Injectable({
  providedIn: 'root',
})
export class HistorialService {
  private apiUrl = '/api/historial';

  constructor(private http: HttpClient) {}

  getAll(): Observable<HistorialCambio[]> {
    return this.http.get<HistorialCambio[]>(this.apiUrl);
  }
}
