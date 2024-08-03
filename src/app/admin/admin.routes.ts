import { Routes } from '@angular/router';

import { integratedRoutes } from './integrated/integrated.routes';
import { settingsRoutes } from './settings/settings.routes';

export const adminRoutes: Routes = [
  {
    path: 'admin',
    loadComponent: () => import('./admin.component').then(m => m.AdminComponent),
    data: {
      breadcrumb: `Admin`
    },
    children: [
      {
        path: 'projects',
        loadComponent: () => import('./projects/projects.component').then(m => m.ProjectsComponent),
        data: {
          breadcrumb: `Projects`
        }
      },
      {
        path: 'clusters',
        loadComponent: () => import('./clusters/clusters.component').then(m => m.ClustersComponent),
        data: {
          breadcrumb: `Clusters`
        }
      },
      {
        path: 'endpoints',
        loadComponent: () => import('./endpoints/endpoints.component').then(m => m.EndpointsComponent),
        data: {
          breadcrumb: `Endpoints`
        }
      },
      {
        path: 'imessages',
        loadComponent: () => import('./imessages/imessages.component').then(m => m.ImessagesComponent),
        data: {
          breadcrumb: `IMessages`
        }
      },
      {
        path: 'acc-tasks',
        loadComponent: () => import('./acc-tasks/acc-tasks.component').then(m => m.AccTasksComponent),
        data: {
          breadcrumb: `AccTasks`
        }
      },
      {
        path: 'datasets',
        loadComponent: () => import('./datasets/datasets.component').then(m => m.DatasetsComponent),
        data: {
          breadcrumb: `Dataset`
        }
      },
      {
        path: 'monitor/:type',
        loadComponent: () => import('./monitor/monitor.component').then(m => m.MonitorComponent),
        data: {
          breadcrumb: `Monitor`
        }
      },
      { path: 'monitor', redirectTo: 'monitor/mongo', pathMatch: 'full' },
      {
        path: 'users',
        loadComponent: () => import('./users/users.component').then(m => m.UsersComponent),
        data: {
          breadcrumb: `Users`
        }
      },
      ...integratedRoutes,
      ...settingsRoutes,
      { path: '', redirectTo: 'projects', pathMatch: 'full' }
    ]
  }
];
