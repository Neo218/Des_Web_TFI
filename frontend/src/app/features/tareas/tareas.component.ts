import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TareaService } from './tarea.service';
import { ProyectoService } from '../proyectos/proyecto.service';
import { Tarea, EstadoTarea } from './tarea.model';
import { Proyecto } from '../proyectos/proyecto.model';

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
      id_proyecto: tarea.id_proyecto,
    });
    this.showForm.set(true);
    console.log('Formulario should be visible:', this.showForm());
  }

  saveTarea(): void {
    if (this.tareaForm.invalid) return;

    const rawValue = this.tareaForm.getRawValue();
    const data = {
      descripcion: rawValue.descripcion,
      estado: rawValue.estado,
      id_proyecto: Number(rawValue.id_proyecto) || 0,
    };

    if (this.editingId) {
      this.tareaService.update(this.editingId, data).subscribe({
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
      id_proyecto: tarea.id_proyecto,
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
      id_proyecto: tarea.id_proyecto,
    }).subscribe({
      next: () => {
        console.log('Tarea marcada como pendiente');
        this.loadTareas();
      },
      error: (err) => console.error('Error al marcar como pendiente:', err),
    });
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
      const agrupado = agrupadas.get(tarea.id_proyecto);
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
}
 
