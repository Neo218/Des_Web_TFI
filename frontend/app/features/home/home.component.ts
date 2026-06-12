import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ClienteService } from '../clientes/cliente.service';
import { EstadoCliente } from '../clientes/cliente.model';
import { ProyectoService } from '../proyectos/proyecto.service';
import { EstadoProyecto, Proyecto } from '../proyectos/proyecto.model';
import { TareaService } from '../tareas/tarea.service';
import { EstadoTarea } from '../tareas/tarea.model';
import { AuthStore } from '../../core/services/auth-store';

interface EstadisticasGenerales {
  clientesActivos: number;
  totalClientes: number;
  proyectosActivos: number;
  proyectosFinalizados: number;
  proyectosInternos: number;
  totalProyectos: number;
  tareasPendientes: number;
  tareasFinalizadas: number;
  tareasBaja: number;
  totalTareas: number;
}

interface ProyectosPorCliente {
  cliente: string;
  total: number;
  activos: number;
  finalizados: number;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  private router = inject(Router);
  private clienteService = inject(ClienteService);
  private proyectoService = inject(ProyectoService);
  private tareaService = inject(TareaService);
  private authStore = inject(AuthStore);
  usuario = '';
  rol = '';

  loading = signal(false);
  error = signal('');

  estadisticas: EstadisticasGenerales = {
    clientesActivos: 0,
    totalClientes: 0,
    proyectosActivos: 0,
    proyectosFinalizados: 0,
    proyectosInternos: 0,
    totalProyectos: 0,
    tareasPendientes: 0,
    tareasFinalizadas: 0,
    tareasBaja: 0,
    totalTareas: 0,
  };

  proyectosPorCliente: ProyectosPorCliente[] = [];

  ngOnInit(): void {
    this.usuario = this.authStore.obtenerUsuario();
    this.rol = this.authStore.obtenerRol();
    this.loadEstadisticas();
  }

  navigateTo(path: string, queryParams?: Record<string, string>): void {
    this.router.navigate([path], { queryParams });
  }

  loadEstadisticas(): void {
    this.loading.set(true);
    this.error.set('');

    forkJoin({
      clientes: this.clienteService.getAll(),
      proyectos: this.proyectoService.getAll(),
      tareas: this.tareaService.getAll(),
    }).subscribe({
      next: ({ clientes, proyectos, tareas }) => {
        this.estadisticas = {
          clientesActivos: clientes.filter((cliente) => cliente.estado === EstadoCliente.ACTIVO).length,
          totalClientes: clientes.length,
          proyectosActivos: proyectos.filter((proyecto) => proyecto.estado === EstadoProyecto.ACTIVO).length,
          proyectosFinalizados: proyectos.filter(
            (proyecto) => proyecto.estado === EstadoProyecto.FINALIZADO,
          ).length,
          proyectosInternos: proyectos.filter((proyecto) => !proyecto.cliente).length,
          totalProyectos: proyectos.length,
          tareasPendientes: tareas.filter((tarea) => tarea.estado === EstadoTarea.PENDIENTE).length,
          tareasFinalizadas: tareas.filter((tarea) => tarea.estado === EstadoTarea.FINALIZADA).length,
          tareasBaja: tareas.filter((tarea) => tarea.estado === EstadoTarea.BAJA).length,
          totalTareas: tareas.length,
        };
        this.proyectosPorCliente = this.getProyectosPorCliente(proyectos);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No se pudieron cargar las estadísticas.');
        this.loading.set(false);
      },
    });
  }

  getPorcentaje(valor: number, total: number): number {
    if (!total) return 0;
    return Math.round((valor / total) * 100);
  }

  getProgresoCompletitud(finalizados: number, total: number): number {
    if (!total) return 0;
    return Math.round((finalizados / total) * 100);
  }

  private getProyectosPorCliente(proyectos: Proyecto[]): ProyectosPorCliente[] {
    const acumulado = new Map<string, ProyectosPorCliente>();

    for (const proyecto of proyectos) {
      const cliente = proyecto.cliente?.nombre ?? 'Interno';
      const actual =
        acumulado.get(cliente) ??
        ({
          cliente,
          total: 0,
          activos: 0,
          finalizados: 0,
        } satisfies ProyectosPorCliente);

      actual.total++;
      if (proyecto.estado === EstadoProyecto.ACTIVO) actual.activos++;
      if (proyecto.estado === EstadoProyecto.FINALIZADO) actual.finalizados++;

      acumulado.set(cliente, actual);
    }

    return Array.from(acumulado.values()).sort((a, b) => b.total - a.total);
  }
}
