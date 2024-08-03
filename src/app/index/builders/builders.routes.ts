import { Routes } from '@angular/router';

export const buildersRoutes: Routes = [
  {
    path: 'builders',
    loadComponent: () => import('./builders.component').then(m => m.BuildersComponent),
    data: {
      breadcrumb: `Builders`
    },
    children: [
      {
        path: 'index',
        loadComponent: () => import('./index.component').then(m => m.IndexComponent)
      },
      {
        path: ':id',
        loadComponent: () => import('./schema/schema.component').then(m => m.SchemaComponent)
      },
      { path: '', redirectTo: 'index', pathMatch: 'full' }
    ]
  }
];
