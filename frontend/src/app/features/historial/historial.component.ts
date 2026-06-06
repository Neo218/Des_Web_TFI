import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { HistorialCambio } from './historial.model';
import { HistorialService } from './historial.service';

@Component({
  selector: 'app-historial',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './historial.component.html',
  styleUrls: ['./historial.component.css'],
})
export class HistorialComponent implements OnInit {
  private historialService = inject(HistorialService);

  cambios: HistorialCambio[] = [];
  loading = signal(false);
  error = signal('');

  ngOnInit(): void {
    this.loadHistorial();
  }

  loadHistorial(): void {
    this.loading.set(true);
    this.error.set('');

    this.historialService.getAll().subscribe({
      next: (data) => {
        this.cambios = data;
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No se pudo cargar el historial de cambios.');
        this.loading.set(false);
      },
    });
  }

  getAccionClass(accion: HistorialCambio['accion']): string {
    switch (accion) {
      case 'CREACION':
        return 'badge-create';
      case 'MODIFICACION':
        return 'badge-update';
      case 'ELIMINACION':
        return 'badge-delete';
      default:
        return '';
    }
  }

  getDetalleResumen(cambio: HistorialCambio): string {
    if (!cambio.detalle) return 'Sin detalle adicional';

    try {
      const detalle = JSON.parse(cambio.detalle);
      const despues = detalle.despues;
      const antes = detalle.antes;
      const base = despues ?? antes;

      if (base?.nombre) return base.nombre;
      if (base?.descripcion) return base.descripcion;
      return `Registro #${cambio.id_registro ?? '-'}`;
    } catch {
      return cambio.detalle;
    }
  }
}
