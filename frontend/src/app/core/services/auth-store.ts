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

  cerrarSesion(): void {
    sessionStorage.removeItem('token');
    this.router.navigateByUrl('/login');
  }
}
