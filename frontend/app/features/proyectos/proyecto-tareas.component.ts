import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TareaService, CreateTareaDto, UpdateTareaDto } from '../tareas/tarea.service';
import { ProyectoService } from './proyecto.service';
import { Tarea, EstadoTarea } from '../tareas/tarea.model';
import { Proyecto } from './proyecto.model';

@Component({
  selector: 'app-proyecto-tareas',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './proyecto-tareas.component.html',
  styleUrls: ['./proyecto-tareas.component.css'],
})
export class ProyectoTareasComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private tareaService = inject(TareaService);
  private proyectoService = inject(ProyectoService);

  proyecto: Proyecto | null = null;
  tareas: Tarea[] = [];
  loading = signal(false);
  showForm = signal(false);
  editingId: number | null = null;
  errorMessage = signal('');
  successMessage = signal('');

  tareaForm = this.fb.nonNullable.group({
    descripcion: ['', Validators.required],
    estado: [EstadoTarea.PENDIENTE, Validators.required],
  });

  EstadoTarea = EstadoTarea;

  ngOnInit(): void {
    const proyectoId = parseInt(this.route.snapshot.paramMap.get('id') || '0');
    if (proyectoId) {
      this.loadProyecto(proyectoId);
      this.loadTareas(proyectoId);
    }
  }

  loadProyecto(id: number): void {
    this.clearMessages();
    this.proyectoService.getWithTareas(id).subscribe({
      next: (data) => {
        this.proyecto = data;
      },
      error: (err) => {
        this.errorMessage.set(this.getErrorMessage(err, 'No se pudo cargar el proyecto.'));
      },
    });
  }

  loadTareas(proyectoId: number): void {
    this.loading.set(true);
    this.clearMessages();
    this.tareaService.getByProyecto(proyectoId).subscribe({
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

  showCreateForm(): void {
    this.clearMessages();
    this.editingId = null;
    this.tareaForm.reset({ estado: EstadoTarea.PENDIENTE });
    this.showForm.set(true);
  }

  editTarea(tarea: Tarea): void {
    this.clearMessages();
    this.editingId = tarea.id || null;
    this.tareaForm.patchValue({
      descripcion: tarea.descripcion,
      estado: tarea.estado,
    });
    this.showForm.set(true);
  }

  saveTarea(): void {
    if (this.tareaForm.invalid || !this.proyecto?.id) return;
    this.clearMessages();

    const rawValue = this.tareaForm.getRawValue();
    const data: CreateTareaDto = {
      descripcion: rawValue.descripcion,
      estado: rawValue.estado,
      id_proyecto: this.proyecto.id,
    };

    if (this.editingId) {
      const updateData: UpdateTareaDto = {
        descripcion: rawValue.descripcion,
        estado: rawValue.estado,
        id_proyecto: this.proyecto.id,
      };
      this.tareaService.update(this.editingId, updateData).subscribe({
        next: () => {
          this.loadTareas(this.proyecto!.id!);
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
          this.loadTareas(this.proyecto!.id!);
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
        this.loadTareas(this.proyecto!.id!);
        this.successMessage.set('Tarea eliminada correctamente.');
      },
      error: (err) => {
        this.errorMessage.set(this.getErrorMessage(err, 'No se pudo eliminar la tarea.'));
      },
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

  backToList(): void {
    this.router.navigate(['/proyectos']);
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
