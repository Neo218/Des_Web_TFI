import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tarea, EstadoTarea } from './tarea.model';

export interface CreateTareaDto {
  descripcion: string;
  estado: EstadoTarea;
  id_proyecto: number;
}

export interface UpdateTareaDto {
  descripcion?: string;
  estado?: EstadoTarea;
  id_proyecto?: number;
}

@Injectable({
  providedIn: 'root',
})
export class TareaService {
  private apiUrl = '/api/tareas';

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

  create(tarea: CreateTareaDto): Observable<Tarea> {
    return this.http.post<Tarea>(this.apiUrl, tarea);
  }

  update(id: number, tarea: UpdateTareaDto): Observable<Tarea> {
    return this.http.put<Tarea>(`${this.apiUrl}/${id}`, tarea);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
