import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TareaService, CreateTareaDto, UpdateTareaDto } from './tarea.service';
import { ProyectoService } from '../proyectos/proyecto.service';
import { Tarea, EstadoTarea } from './tarea.model';
import { Proyecto } from '../proyectos/proyecto.model';
import { AuthStore } from '../../core/services/auth-store';

interface ProyectoAgrupado {
  id: number;
  proyectoNombre: string;
  clienteNombre?: string;
  tareas: Tarea[];
  tareasPendientes: number;
  tareasCompletadas: number;
}

@Component({
  selector: 'app-tareas',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './tareas.component.html',
  styleUrls: ['./tareas.component.css'],
})
export class TareasComponent implements OnInit {
  private fb = inject(FormBuilder);
  private tareaService = inject(TareaService);
  private proyectoService = inject(ProyectoService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  public authStore = inject(AuthStore);

  tareas: Tarea[] = [];
  proyectos: Proyecto[] = [];
  loading = signal(false);
  showForm = signal(false);
  editingId: number | null = null;
  filterProyecto: number | null = null;
  errorMessage = signal('');
  successMessage = signal('');

  filtroBusqueda = '';
  filtroEstado = '';

  tareaForm = this.fb.nonNullable.group({
    descripcion: ['', Validators.required],
    estado: [EstadoTarea.PENDIENTE, Validators.required],
    id_proyecto: [null as number | null, Validators.required],
  });

  EstadoTarea = EstadoTarea;

  get tareasFiltradas(): Tarea[] {
    const busqueda = this.filtroBusqueda.toLowerCase().trim();
    return this.tareas.filter(t => {
      const matchEstado = !this.filtroEstado || t.estado === this.filtroEstado;
      const matchBusqueda = !busqueda
        || t.descripcion.toLowerCase().includes(busqueda)
        || t.proyecto?.nombre?.toLowerCase().includes(busqueda)
        || t.proyecto?.cliente?.nombre?.toLowerCase().includes(busqueda);
      return matchEstado && matchBusqueda;
    });
  }

  get hayFiltrosActivos(): boolean {
    return !!(this.filtroBusqueda || this.filtroEstado || this.filterProyecto);
  }

  ngOnInit(): void {
    this.loadProyectos();
    this.loadTareas();
    if (this.route.snapshot.queryParams['create'] === 'true') {
      this.showCreateForm();
    }
  }

  loadTareas(): void {
    this.loading.set(true);
    this.clearMessages();
    const service = this.filterProyecto
      ? this.tareaService.getByProyecto(this.filterProyecto)
      : this.tareaService.getAll();

    service.subscribe({
      next: (data) => {
        this.tareas = data;
        this.loading.set(false);
      },
      error: (err) => {
        this.errorMessage.set(this.getErrorMessage(err, 'No se pudieron cargar las tareas.'));
        this.loading.set(false);
      },
    });
  }

  loadProyectos(): void {
    this.proyectoService.getAll().subscribe({
      next: (data) => {
        this.proyectos = data;
      },
    });
  }

  onFilterChange(event: Event): void {
    this.clearMessages();
    const select = event.target as HTMLSelectElement;
    this.filterProyecto = select.value ? parseInt(select.value) : null;
    this.loadTareas();
  }

  limpiarFiltros(): void {
    this.filtroBusqueda = '';
    this.filtroEstado = '';
    this.filterProyecto = null;
    this.clearMessages();
    this.loadTareas();
  }

  showCreateForm(): void {
    this.clearMessages();
    this.editingId = null;
    this.tareaForm.reset({
      estado: EstadoTarea.PENDIENTE,
      id_proyecto: this.filterProyecto ?? null,
    });
    this.showForm.set(true);
  }

  editTarea(tarea: Tarea): void {
    this.clearMessages();
    this.editingId = tarea.id || null;
    this.tareaForm.patchValue({
      descripcion: tarea.descripcion,
      estado: tarea.estado,
      id_proyecto: tarea.proyecto?.id || null,
    });
    this.showForm.set(true);
  }

  saveTarea(): void {
    if (this.tareaForm.invalid) return;
    this.clearMessages();

    const rawValue = this.tareaForm.getRawValue();
    const data: CreateTareaDto = {
      descripcion: rawValue.descripcion,
      estado: rawValue.estado,
      id_proyecto: Number(rawValue.id_proyecto) || 0,
    };

    if (this.editingId) {
      const updateData: UpdateTareaDto = {
        descripcion: rawValue.descripcion,
        estado: rawValue.estado,
        id_proyecto: Number(rawValue.id_proyecto) || 0,
      };
      this.tareaService.update(this.editingId, updateData).subscribe({
        next: () => {
          this.loadTareas();
          this.cancelForm();
          this.successMessage.set('Tarea actualizada correctamente.');
        },
        error: (err) => {
          this.errorMessage.set(this.getErrorMessage(err, 'No se pudo actualizar la tarea.'));
        },
      });
    } else {
      this.tareaService.create(data).subscribe({
        next: () => {
          this.loadTareas();
          this.cancelForm();
          this.successMessage.set('Tarea creada correctamente.');
        },
        error: (err) => {
          this.errorMessage.set(this.getErrorMessage(err, 'No se pudo crear la tarea.'));
        },
      });
    }
  }

  deleteTarea(id: number): void {
    this.clearMessages();
    if (!confirm('¿Está seguro de eliminar esta tarea?')) return;

    this.tareaService.delete(id).subscribe({
      next: () => {
        this.loadTareas();
        this.successMessage.set('Tarea eliminada correctamente.');
      },
      error: (err) => {
        this.errorMessage.set(this.getErrorMessage(err, 'No se pudo eliminar la tarea.'));
      },
    });
  }

  marcarCompletada(tarea: Tarea): void {
    this.clearMessages();
    this.tareaService.update(tarea.id!, {
      descripcion: tarea.descripcion,
      estado: EstadoTarea.FINALIZADA,
      id_proyecto: tarea.proyecto?.id || 0,
    }).subscribe({
      next: () => {
        this.loadTareas();
        this.successMessage.set('Tarea completada.');
      },
      error: (err) => {
        this.errorMessage.set(this.getErrorMessage(err, 'No se pudo completar la tarea.'));
      },
    });
  }

  marcarPendiente(tarea: Tarea): void {
    this.clearMessages();
    this.tareaService.update(tarea.id!, {
      descripcion: tarea.descripcion,
      estado: EstadoTarea.PENDIENTE,
      id_proyecto: tarea.proyecto?.id || 0,
    }).subscribe({
      next: () => {
        this.loadTareas();
        this.successMessage.set('Tarea marcada como pendiente.');
      },
      error: (err) => {
        this.errorMessage.set(this.getErrorMessage(err, 'No se pudo actualizar la tarea.'));
      },
    });
  }

  exportarTareasCsv(): void {
    if (this.tareas.length === 0) {
      alert('No hay tareas para exportar.');
      return;
    }

    const headers = ['ID', 'Descripcion', 'Estado', 'Proyecto', 'Cliente'];
    const rows = this.tareas.map((tarea) => [
      tarea.id ?? '',
      tarea.descripcion,
      tarea.estado,
      tarea.proyecto?.nombre ?? 'Sin proyecto',
      tarea.proyecto?.cliente?.nombre ?? 'Interno',
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map((value) => this.formatCsvValue(value)).join(','))
      .join('\r\n');

    const blob = new Blob([`\ufeff${csvContent}`], {
      type: 'text/csv;charset=utf-8;',
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    const fileName = this.filterProyecto
      ? `tareas-proyecto-${this.filterProyecto}.csv`
      : 'tareas.csv';

    link.href = url;
    link.download = fileName;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  cancelForm(): void {
    this.showForm.set(false);
    this.tareaForm.reset();
    this.editingId = null;
  }

  getEstadoClass(estado: EstadoTarea): string {
    switch (estado) {
      case EstadoTarea.PENDIENTE:
        return 'badge-pending';
      case EstadoTarea.FINALIZADA:
        return 'badge-completed';
      case EstadoTarea.BAJA:
        return 'badge-inactive';
      default:
        return '';
    }
  }

  getTareasAgrupadasPorProyecto(): ProyectoAgrupado[] {
    const agrupadas = new Map<number, ProyectoAgrupado>();

    const proyectosAMostrar = this.filterProyecto
      ? this.proyectos.filter(p => p.id === this.filterProyecto)
      : this.proyectos;

    for (const proyecto of proyectosAMostrar) {
      agrupadas.set(proyecto.id!, {
        id: proyecto.id!,
        proyectoNombre: proyecto.nombre!,
        clienteNombre: proyecto.cliente?.nombre,
        tareas: [],
        tareasPendientes: 0,
        tareasCompletadas: 0,
      });
    }

    for (const tarea of this.tareasFiltradas) {
      const agrupado = agrupadas.get(tarea.proyecto?.id || 0);
      if (agrupado) {
        agrupado.tareas.push(tarea);
        if (tarea.estado === EstadoTarea.PENDIENTE) {
          agrupado.tareasPendientes++;
        } else if (tarea.estado === EstadoTarea.FINALIZADA) {
          agrupado.tareasCompletadas++;
        }
      }
    }

    return Array.from(agrupadas.values())
      .filter(p => p.tareas.length > 0 || !this.filterProyecto);
  }

  private formatCsvValue(value: string | number): string {
    const text = String(value).replace(/"/g, '""');
    return `"${text}"`;
  }

  private clearMessages(): void {
    this.errorMessage.set('');
    this.successMessage.set('');
  }

  private getErrorMessage(error: any, fallback: string): string {
    const message = error?.error?.message;
    if (Array.isArray(message)) {
      return message.join(' ');
    }
    return message || fallback;
  }
}

