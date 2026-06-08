import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ClienteService } from './cliente.service';
import { Cliente, EstadoCliente } from './cliente.model';
import { AuthStore } from '../../core/services/auth-store';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css'],
})
export class ClientesComponent implements OnInit {
  public authStore = inject(AuthStore);
  private fb = inject(FormBuilder);
  private clienteService = inject(ClienteService);
  private route = inject(ActivatedRoute);
  searchTerm = '';
  orden = 'asc';
  paginaActual = 1;
  clientesPorPagina = 5;
  clientes: Cliente[] = [];
  loading = signal(false);
  showForm = signal(false);
  errorMessage = signal('');
  successMessage = signal('');
  editingId: number | null = null;

  clienteForm = this.fb.nonNullable.group({
    nombre: ['', Validators.required],
    estado: [EstadoCliente.ACTIVO, Validators.required],
  });

  EstadoCliente = EstadoCliente;

  ngOnInit(): void {
    this.loadClientes();
    if (this.route.snapshot.queryParams['create'] === 'true') {
      this.showCreateForm();
    }
  }

  loadClientes(): void {
    this.loading.set(true);
    this.clienteService.getAll().subscribe({
      next: (data) => {
        this.clientes = data;
        this.loading.set(false);
      },
      error: (err) => {
        this.errorMessage.set(this.getErrorMessage(err, 'No se pudieron cargar los clientes.'));
        this.loading.set(false);
      },
    });
  }

  showCreateForm(): void {
    this.clearMessages();
    this.editingId = null;
    this.clienteForm.reset({ nombre: '', estado: EstadoCliente.ACTIVO });
    this.showForm.set(true);
  }

  editCliente(cliente: Cliente): void {
    this.clearMessages();
    this.editingId = cliente.id || null;
    this.clienteForm.patchValue({
      nombre: cliente.nombre,
      estado: cliente.estado,
    });
    this.showForm.set(true);
  }

  saveCliente(): void {
    if (this.clienteForm.invalid) return;
    this.clearMessages();

    const rawValue = this.clienteForm.getRawValue();
    const data: Omit<Cliente, 'id'> = {
      nombre: rawValue.nombre.trim(),
      estado: rawValue.estado,
    };

    if (this.editingId) {
      this.clienteService.update(this.editingId, data).subscribe({
        next: () => {
          this.loadClientes();
          this.cancelForm();
          this.successMessage.set('Cliente actualizado correctamente.');
        },
        error: (err) => {
          this.errorMessage.set(this.getErrorMessage(err, 'No se pudo actualizar el cliente.'));
        },
      });
      return;
    }

    this.clienteService.create(data).subscribe({
      next: () => {
        this.loadClientes();
        this.cancelForm();
        this.successMessage.set('Cliente creado correctamente.');
      },
      error: (err) => {
        this.errorMessage.set(this.getErrorMessage(err, 'No se pudo crear el cliente.'));
      },
    });
  }

  deleteCliente(id: number): void {
    this.clearMessages();
    if (!confirm('Esta seguro de dar de baja este cliente?')) return;

    this.clienteService.delete(id).subscribe({
      next: () => {
        this.loadClientes();
        this.successMessage.set('Cliente dado de baja correctamente.');
      },
      error: (err) => {
        this.errorMessage.set(this.getErrorMessage(err, 'No se pudo dar de baja el cliente.'));
      },
    });
  }

  cancelForm(): void {
    this.showForm.set(false);
    this.clienteForm.reset({ nombre: '', estado: EstadoCliente.ACTIVO });
    this.editingId = null;
  }

  getEstadoClass(estado: EstadoCliente): string {
    return estado === EstadoCliente.ACTIVO ? 'badge-active' : 'badge-inactive';
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
  get clientesFiltrados() {
   return this.clientes.filter(cliente =>
     cliente.nombre
       .toLowerCase()
       .includes(this.searchTerm.toLowerCase())
   );
  }
  get clientesPaginados() {
   const inicio =
    (this.paginaActual - 1) * this.clientesPorPagina;

   return this.clientesFiltrados.slice(
    inicio,
    inicio + this.clientesPorPagina
   );
  }
  ordenarClientes(): void {
   this.clientes.sort((a, b) =>
     this.orden === 'asc'
      ? a.nombre.localeCompare(b.nombre)
      : b.nombre.localeCompare(a.nombre)
   );
  }
}
