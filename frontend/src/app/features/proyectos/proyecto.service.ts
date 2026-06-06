import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Proyecto, EstadoProyecto } from './proyecto.model';

@Injectable({
  providedIn: 'root',
})
export class ProyectoService {
  private apiUrl = '/api/proyectos';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Proyecto[]> {
    return this.http.get<Proyecto[]>(this.apiUrl);
  }

  getById(id: number): Observable<Proyecto> {
    return this.http.get<Proyecto>(`${this.apiUrl}/${id}`);
  }

  getWithTareas(id: number): Observable<Proyecto> {
    return this.http.get<Proyecto>(`${this.apiUrl}/${id}/tareas`);
  }

  create(proyecto: Omit<Proyecto, 'id' | 'cliente' | 'tareas'>): Observable<Proyecto> {
    return this.http.post<Proyecto>(this.apiUrl, proyecto);
  }

  update(id: number, proyecto: Partial<Proyecto>): Observable<Proyecto> {
    return this.http.put<Proyecto>(`${this.apiUrl}/${id}`, proyecto);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
