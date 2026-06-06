import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ClienteService } from './cliente.service';
import { Cliente, EstadoCliente } from './cliente.model';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css'],
})
export class ClientesComponent implements OnInit {
  private fb = inject(FormBuilder);
  private clienteService = inject(ClienteService);
  private route = inject(ActivatedRoute);

  clientes: Cliente[] = [];
  loading = signal(false);
  showForm = signal(false);
  editingId: number | null = null;

  clienteForm = this.fb.nonNullable.group({
    nombre: ['', Validators.required],
    estado: [EstadoCliente.ACTIVO, Validators.required],
  });

  EstadoCliente = EstadoCliente;

  ngOnInit(): void {
    console.log('ClientesComponent - ngOnInit llamado');
    this.loadClientes();
    if (this.route.snapshot.queryParams['create'] === 'true') {
      this.showCreateForm();
    }
  }

  loadClientes(): void {
    this.loading.set(true);
    console.log('Cargando clientes...');
    const subscription = this.clienteService.getAll().subscribe({
      next: (data) => {
        console.log('Clientes recibidos:', data);
        this.clientes = data;
        this.loading.set(false);
        console.log('Loading ahora es false');
      },
      error: (err) => {
        console.error('Error al cargar clientes:', err);
        this.loading.set(false);
      },
      complete: () => {
        console.log('Observable completado');
      },
    });
    console.log('Suscripción creada:', subscription);
  }

  showCreateForm(): void {
    this.editingId = null;
    this.clienteForm.reset({ estado: EstadoCliente.ACTIVO });
    this.showForm.set(true);
  }

  editCliente(cliente: Cliente): void {
    this.editingId = cliente.id || null;
    this.clienteForm.patchValue(cliente);
    this.showForm.set(true);
  }

  saveCliente(): void {
    if (this.clienteForm.invalid) return;

    const rawValue = this.clienteForm.getRawValue();
    const data: Omit<Cliente, 'id'> = {
      nombre: rawValue.nombre,
      estado: rawValue.estado,
    };

    if (this.editingId) {
      this.clienteService.update(this.editingId, data).subscribe({
        next: () => {
          this.loadClientes();
          this.cancelForm();
        },
      });
    } else {
      this.clienteService.create(data).subscribe({
        next: () => {
          this.loadClientes();
          this.cancelForm();
        },
      });
    }
  }

  deleteCliente(id: number): void {
    if (confirm('¿Está seguro de eliminar este cliente?')) {
      this.clienteService.delete(id).subscribe({
        next: () => {
          this.loadClientes();
        },
      });
    }
  }

  cancelForm(): void {
    this.showForm.set(false);
    this.clienteForm.reset();
    this.editingId = null;
  }

  getEstadoClass(estado: EstadoCliente): string {
    return estado === EstadoCliente.ACTIVO ? 'badge-active' : 'badge-inactive';
  }
}
