import { Routes } from '@angular/router';

export const auditRoutes: Routes = [
  {
    path: 'audit',
    data: {
      breadcrumb: `Audit`
    },
    loadComponent: () => import('./audit.component').then(m => m.AuditComponent),
    children: [
      {
        path: 'logins',
        loadComponent: () => import('./logins/logins.component').then(m => m.LoginsComponent),
        data: {
          breadcrumb: `Logins`
        }
      },
      {
        path: 'operates',
        loadComponent: () => import('./operates/operates.component').then(m => m.OperatesComponent),
        data: {
          breadcrumb: `Operates`
        }
      },
      { path: '', redirectTo: 'logins', pathMatch: 'full' }
    ]
  }
];
