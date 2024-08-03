import { Routes } from '@angular/router';

export const settingsRoutes: Routes = [
  {
    path: 'settings',
    data: {
      breadcrumb: `Setting`
    },
    children: [
      {
        path: 'security',
        loadComponent: () => import('./security/security.component').then(m => m.SecurityComponent),
        data: {
          breadcrumb: `Security`
        }
      },
      {
        path: 'sessions',
        loadComponent: () => import('./sessions/sessions.component').then(m => m.SessionsComponent),
        data: {
          breadcrumb: `Sessions`
        }
      },
      {
        path: 'values',
        loadComponent: () => import('./values/values.component').then(m => m.ValuesComponent),
        data: {
          breadcrumb: `Dynamic Values`
        }
      },
      { path: '', redirectTo: 'security', pathMatch: 'full' }
    ]
  }
];
