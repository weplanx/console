import { Routes } from '@angular/router';

export const integratedRoutes: Routes = [
  {
    path: 'integrated',
    data: {
      breadcrumb: `Integrated`
    },
    children: [
      {
        path: 'cloud',
        loadComponent: () => import('./cloud/cloud.component').then(m => m.CloudComponent),
        data: {
          breadcrumb: `Public Cloud`
        }
      },
      {
        path: 'collaboration',
        loadComponent: () => import('./collaboration/collaboration.component').then(m => m.CollaborationComponent),
        data: {
          breadcrumb: `Collaboration`
        }
      },
      {
        path: 'extend',
        loadComponent: () => import('./extend/extend.component').then(m => m.ExtendComponent),
        data: {
          breadcrumb: `Extend`
        }
      },
      { path: '', redirectTo: 'cloud', pathMatch: 'full' }
    ]
  }
];
