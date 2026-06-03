import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'clients',
    loadComponent: () =>
      import('./clients/clients.component')
      .then(m => m.ClientsComponent),
  },
];