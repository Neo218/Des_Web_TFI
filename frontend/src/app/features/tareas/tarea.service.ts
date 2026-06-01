import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tarea, EstadoTarea } from './tarea.model';

@Injectable({
  providedIn: 'root',
})
export class TareaService {
  private apiUrl = 'http://localhost:3000/api/tareas';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Tarea[]> {
    return this.http.get<Tarea[]>(this.apiUrl);
  }

  getByProyecto(idProyecto: number): Observable<Tarea[]> {
    return this.http.get<Tarea[]>(`${this.apiUrl}/proyecto/${idProyecto}`);
  }

  getById(id: number): Observable<Tarea> {
    return this.http.get<Tarea>(`${this.apiUrl}/${id}`);
  }

  create(tarea: Omit<Tarea, 'id' | 'proyecto'>): Observable<Tarea> {
    return this.http.post<Tarea>(this.apiUrl, tarea);
  }

  update(id: number, tarea: Partial<Tarea>): Observable<Tarea> {
    return this.http.put<Tarea>(`${this.apiUrl}/${id}`, tarea);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
