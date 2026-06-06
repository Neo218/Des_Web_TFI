import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login').then((m) => m.Login),
  },
  {
    path: '',
    loadComponent: () =>
      import('./features/layout/layout.component').then((m) => m.LayoutComponent),
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/home/home.component').then((m) => m.HomeComponent),
      },
      {
        path: 'clientes',
        loadComponent: () =>
          import('./features/clientes/clientes.component').then((m) => m.ClientesComponent),
      },
      {
        path: 'proyectos',
        loadComponent: () =>
          import('./features/proyectos/proyectos.component').then((m) => m.ProyectosComponent),
      },
      {
        path: 'proyectos/:id/tareas',
        loadComponent: () =>
          import('./features/proyectos/proyecto-tareas.component').then(
            (m) => m.ProyectoTareasComponent,
          ),
      },
      {
        path: 'tareas',
        loadComponent: () =>
          import('./features/tareas/tareas.component').then((m) => m.TareasComponent),
      },
    ],
  },
  { path: '**', redirectTo: '/login' },
];
