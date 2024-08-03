import { Routes } from '@angular/router';

import { buildersRoutes } from './builders/builders.routes';
import { resolver } from './resolver';

export const indexRoutes: Routes = [
  {
    path: 'x/:namespace',
    loadComponent: () => import('./index.component').then(m => m.IndexComponent),
    children: [
      {
        path: 'overview',
        loadComponent: () => import('./overview/overview.component').then(m => m.OverviewComponent),
        data: {
          breadcrumb: `Overview`
        }
      },
      ...buildersRoutes,
      {
        path: 'workflows',
        loadComponent: () => import('./workflows/workflows.component').then(m => m.WorkflowsComponent),
        data: {
          breadcrumb: `Workflows`
        }
      },
      {
        path: 'queues',
        loadComponent: () => import('./queues/queues.component').then(m => m.QueuesComponent),
        data: {
          breadcrumb: `Queues`
        }
      },
      { path: '', redirectTo: 'overview', pathMatch: 'full' }
    ],
    resolve: {
      project: resolver
    }
  }
];
