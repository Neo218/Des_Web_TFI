import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthStore {
  private readonly router: Router = inject(Router);

  guardarToken(token: string): void {
    sessionStorage.setItem('token', token);
  }

  obtenerToken(): string | null {
    return sessionStorage.getItem('token');
  }

  obtenerPayload() {
    const token = this.obtenerToken();

    if (!token) {
      return null;
    }

    return JSON.parse(atob(token.split('.')[1]));
  }

  obtenerUsuario(): string {
    return this.obtenerPayload()?.nombre || '';
  }

  obtenerRol(): string {
    return this.obtenerPayload()?.rol || '';
  }

  esAdmin(): boolean {
    return this.obtenerRol() === 'ADMIN';
  }

  cerrarSesion(): void {
    sessionStorage.removeItem('token');
    this.router.navigateByUrl('/login');
  }
}
