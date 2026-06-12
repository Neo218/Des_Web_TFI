import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ProyectoService } from './proyecto.service';
import { ClienteService } from '../clientes/cliente.service';
import { Proyecto, EstadoProyecto, ClienteReference } from './proyecto.model';

type Cliente = ClienteReference;

@Component({
  selector: 'app-proyectos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './proyectos.component.html',
  styleUrls: ['./proyectos.component.css'],
})
export class ProyectosComponent implements OnInit {
  private fb = inject(FormBuilder);
  private proyectoService = inject(ProyectoService);
  private clienteService = inject(ClienteService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  proyectos: Proyecto[] = [];
  clientesActivos: Cliente[] = [];
  loading = signal(false);
  showForm = signal(false);
  editingId: number | null = null;
  errorMessage = signal('');
  successMessage = signal('');

  proyectoForm = this.fb.nonNullable.group({
    nombre: ['', Validators.required],
    estado: [EstadoProyecto.ACTIVO, Validators.required],
    id_cliente: [null as number | null],
    fechaObjetivo: [''],
  });

  EstadoProyecto = EstadoProyecto;

  ngOnInit(): void {
    this.loadProyectos();
    this.loadClientesActivos();
    if (this.route.snapshot.queryParams['create'] === 'true') {
      this.showCreateForm();
    }
  }

  loadProyectos(): void {
    this.loading.set(true);
    this.clearMessages();
    this.proyectoService.getAll().subscribe({
      next: (data) => {
        this.proyectos = data;
        this.loading.set(false);
      },
      error: (err) => {
        this.errorMessage.set(this.getErrorMessage(err, 'No se pudieron cargar los proyectos.'));
        this.loading.set(false);
      },
    });
  }

  loadClientesActivos(): void {
    this.clienteService.getActivos().subscribe({
      next: (data) => {
        this.clientesActivos = data;
      },
    });
  }

  showCreateForm(): void {
    this.clearMessages();
    this.editingId = null;
    this.proyectoForm.reset({ estado: EstadoProyecto.ACTIVO, id_cliente: 0, fechaObjetivo: '' });
    this.showForm.set(true);
  }

  editProyecto(proyecto: Proyecto): void {
    this.clearMessages();
    this.editingId = proyecto.id || null;
    this.proyectoForm.patchValue({
      nombre: proyecto.nombre,
      estado: proyecto.estado,
      id_cliente: proyecto.id_cliente ?? 0,
      fechaObjetivo: proyecto.fechaObjetivo ? new Date(proyecto.fechaObjetivo).toISOString().split('T')[0] : '',
    });
    this.showForm.set(true);
  }

  saveProyecto(): void {
    if (this.proyectoForm.invalid) {
      return;
    }
    this.clearMessages();

    const rawValue = this.proyectoForm.getRawValue();

    const idClienteValue = Number(rawValue.id_cliente);

    const data = {
      nombre: rawValue.nombre,
      estado: rawValue.estado,
      ...(idClienteValue > 0 ? { id_cliente: idClienteValue } : {}),
      ...(rawValue.fechaObjetivo ? { fechaObjetivo: rawValue.fechaObjetivo } : {}),
    } as Omit<Proyecto, 'id' | 'cliente' | 'tareas'>;

    if (this.editingId) {
      this.proyectoService.update(this.editingId, data).subscribe({
        next: () => {
          this.loadProyectos();
          this.cancelForm();
          this.successMessage.set('Proyecto actualizado correctamente.');
        },
        error: (err) => {
          this.errorMessage.set(this.getErrorMessage(err, 'No se pudo actualizar el proyecto.'));
        },
      });
    } else {
      this.proyectoService.create(data).subscribe({
        next: () => {
          this.loadProyectos();
          this.cancelForm();
          this.successMessage.set('Proyecto creado correctamente.');
        },
        error: (err) => {
          this.errorMessage.set(this.getErrorMessage(err, 'No se pudo crear el proyecto.'));
        },
      });
    }
  }

  deleteProyecto(id: number): void {
    this.clearMessages();
    if (!confirm('¿Está seguro de eliminar este proyecto?')) return;

    this.proyectoService.delete(id).subscribe({
      next: () => {
        this.loadProyectos();
        this.successMessage.set('Proyecto eliminado correctamente.');
      },
      error: (err) => {
        this.errorMessage.set(this.getErrorMessage(err, 'No se pudo eliminar el proyecto.'));
      },
    });
  }

  viewTareas(proyectoId: number): void {
    this.router.navigate(['/proyectos', proyectoId, 'tareas']);
  }

  cancelForm(): void {
    this.showForm.set(false);
    this.proyectoForm.reset();
    this.editingId = null;
  }

  getEstadoClass(estado: EstadoProyecto): string {
    switch (estado) {
      case EstadoProyecto.ACTIVO:
        return 'badge-active';
      case EstadoProyecto.FINALIZADO:
        return 'badge-completed';
      case EstadoProyecto.BAJA:
        return 'badge-inactive';
      default:
        return '';
    }
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
