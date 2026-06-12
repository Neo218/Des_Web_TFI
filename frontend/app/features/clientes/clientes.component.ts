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
  private fb = inject(FormBuilder);
  private clienteService = inject(ClienteService);
  private route = inject(ActivatedRoute);
  public authStore = inject(AuthStore);

  searchTerm = '';
  orden = 'asc';
  paginaActual = 1;
  clientesPorPagina = 15;
  clientes: Cliente[] = [];
  loading = signal(false);
  showForm = signal(false);
  errorMessage = signal('');
  successMessage = signal('');
  editingId: number | null = null;

  clienteForm = this.fb.nonNullable.group({
    nombre: ['', Validators.required],
    telefono: ['', [Validators.pattern(/^([0-9]{7,15}|(\+[0-9]{1,3})?[0-9]{7,15})$/)]],
    email: ['', [Validators.email]],
    direccion: [''],
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
    this.clienteForm.reset({ nombre: '', telefono: '', email: '', direccion: '', estado: EstadoCliente.ACTIVO });
    this.showForm.set(true);
  }

  editCliente(cliente: Cliente): void {
    this.clearMessages();
    this.editingId = cliente.id || null;
    this.clienteForm.patchValue({
      nombre: cliente.nombre,
      telefono: cliente.telefono || '',
      email: cliente.email || '',
      direccion: cliente.direccion || '',
      estado: cliente.estado,
    });
    this.showForm.set(true);
  }

  saveCliente(): void {
    if (this.clienteForm.invalid) {
      Object.values(this.clienteForm.controls).forEach(control => {
        control.markAsTouched();
      });
      return;
    }
    this.clearMessages();

    const rawValue = this.clienteForm.getRawValue();
    const data: Omit<Cliente, 'id'> = {
      nombre: rawValue.nombre.trim(),
      telefono: rawValue.telefono?.trim() || undefined,
      email: rawValue.email?.trim() || undefined,
      direccion: rawValue.direccion?.trim() || undefined,
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
    this.clienteForm.reset({ nombre: '', telefono: '', email: '', direccion: '', estado: EstadoCliente.ACTIVO });
    this.editingId = null;
  }

  getEstadoClass(estado: EstadoCliente): string {
    return estado === EstadoCliente.ACTIVO ? 'badge-active' : 'badge-inactive';
  }

  get telefonoInvalid(): boolean {
    const control = this.clienteForm.get('telefono');
    return !!control && control.invalid && (control.touched || control.dirty) && control.value?.length > 0;
  }

  get emailInvalid(): boolean {
    const control = this.clienteForm.get('email');
    return !!control && control.invalid && (control.touched || control.dirty) && control.value?.length > 0;
  }

  get nombreInvalid(): boolean {
    const control = this.clienteForm.get('nombre');
    return !!control && control.invalid && (control.touched || control.dirty);
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
    const inicio = (this.paginaActual - 1) * this.clientesPorPagina;
    return this.clientesFiltrados.slice(inicio, inicio + this.clientesPorPagina);
  }

  ordenarClientes(): void {
    this.clientes.sort((a, b) =>
      this.orden === 'asc'
        ? a.nombre.localeCompare(b.nombre)
        : b.nombre.localeCompare(a.nombre)
    );
  }

  get totalPaginas(): number {
    return Math.ceil(this.clientesFiltrados.length / this.clientesPorPagina);
  }

  paginaAnterior(): void {
    if (this.paginaActual > 1) {
      this.paginaActual--;
    }
  }

  paginaSiguiente(): void {
    if (this.paginaActual < this.totalPaginas) {
      this.paginaActual++;
    }
  }
}
