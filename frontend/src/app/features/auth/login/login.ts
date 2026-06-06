import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginApiClient } from './login-api-client';
import { AuthStore } from '../../../core/services/auth-store';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class Login {
  private fb = inject(FormBuilder);
  private loginApiClient = inject(LoginApiClient);
  private authStore = inject(AuthStore);
  private router = inject(Router);

  loginForm = this.fb.group({
    nombre: ['', Validators.required],
    clave: ['', Validators.required],
  });

  errorMessage = '';
  loading = false;

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const nombre = this.loginForm.value.nombre!;
    const clave = this.loginForm.value.clave!;

    this.loginApiClient.iniciarSesion(nombre, clave).subscribe({
      next: (data) => {
        this.authStore.guardarToken(data.access_token);
        this.router.navigate(['/']);
      },
      error: () => {
        this.errorMessage = 'Credenciales inválidas';
        this.loading = false;
      },
    });
  }
}
