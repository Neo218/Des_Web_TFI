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

  tareaForm = this.fb.nonNullable.group({
    descripcion: ['', Validators.required],
    estado: [EstadoTarea.PENDIENTE, Validators.required],
    id_proyecto: [null as number | null, Validators.required],
  });

  EstadoTarea = EstadoTarea;

  ngOnInit(): void {
    console.log('Usuario:', this.authStore.obtenerUsuario());
    console.log('Rol:', this.authStore.obtenerRol());
    console.log('Es admin:', this.authStore.esAdmin());
    this.loadProyectos();
    this.loadTareas();
    if (this.route.snapshot.queryParams['create'] === 'true') {
      this.showCreateForm();
    }
  }

  loadTareas(): void {
    this.loading.set(true);
    const service = this.filterProyecto
      ? this.tareaService.getByProyecto(this.filterProyecto)
      : this.tareaService.getAll();

    service.subscribe({
      next: (data) => {
        this.tareas = data;
        this.loading.set(false);
      },
      error: () => {
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
    const select = event.target as HTMLSelectElement;
    this.filterProyecto = select.value ? parseInt(select.value) : null;
    this.loadTareas();
  }

  showCreateForm(): void {
    this.editingId = null;
    this.tareaForm.reset({
      estado: EstadoTarea.PENDIENTE,
      id_proyecto: this.filterProyecto ?? null,
    });
    this.showForm.set(true);
  }

  editTarea(tarea: Tarea): void {
    console.log('Editando tarea:', tarea);
    this.editingId = tarea.id || null;
    this.tareaForm.patchValue({
      descripcion: tarea.descripcion,
      estado: tarea.estado,
      id_proyecto: tarea.proyecto?.id || null,
    });
    this.showForm.set(true);
    console.log('Formulario should be visible:', this.showForm());
  }

  saveTarea(): void {
    if (this.tareaForm.invalid) return;

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
        },
      });
    } else {
      this.tareaService.create(data).subscribe({
        next: () => {
          this.loadTareas();
          this.cancelForm();
        },
      });
    }
  }

  deleteTarea(id: number): void {
    if (confirm('¿Está seguro de eliminar esta tarea?')) {
      this.tareaService.delete(id).subscribe({
        next: () => {
          this.loadTareas();
        },
      });
    }
  }

  marcarCompletada(tarea: Tarea): void {
    console.log('Marcando como completada:', tarea);
    this.tareaService.update(tarea.id!, {
      descripcion: tarea.descripcion,
      estado: EstadoTarea.FINALIZADA,
      id_proyecto: tarea.proyecto?.id || 0,
    }).subscribe({
      next: () => {
        console.log('Tarea marcada como completada');
        this.loadTareas();
      },
      error: (err) => console.error('Error al marcar como completada:', err),
    });
  }

  marcarPendiente(tarea: Tarea): void {
    console.log('Marcando como pendiente:', tarea);
    this.tareaService.update(tarea.id!, {
      descripcion: tarea.descripcion,
      estado: EstadoTarea.PENDIENTE,
      id_proyecto: tarea.proyecto?.id || 0,
    }).subscribe({
      next: () => {
        console.log('Tarea marcada como pendiente');
        this.loadTareas();
      },
      error: (err) => console.error('Error al marcar como pendiente:', err),
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

    // Inicializar con todos los proyectos (o solo el filtrado)
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

    // Agregar tareas a sus proyectos
    for (const tarea of this.tareas) {
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

    // Convertir a array y ordenar por cantidad de tareas pendientes (descendente)
    return Array.from(agrupadas.values())
      .filter(p => p.tareas.length > 0 || !this.filterProyecto);
  }

  private formatCsvValue(value: string | number): string {
    const text = String(value).replace(/"/g, '""');
    return `"${text}"`;
  }
}
 
