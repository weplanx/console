import { Routes } from '@angular/router';

import { environment } from '@env';

import { adminRoutes } from './admin/admin.routes';
import { appGuard } from './app.guard';
import { auditRoutes } from './audit/audit.routes';
import { filebrowserRoutes } from './filebrowser/filebrowser.routes';
import { indexRoutes } from './index/index.routes';
import { loginRoutes } from './login/login.routes';

export const routes: Routes = [
  ...loginRoutes,
  {
    path: 'forget',
    loadComponent: () => import('./forget/forget.component').then(m => m.ForgetComponent)
  },
  {
    path: 'unauthorize',
    loadComponent: () => import('@common/components/result/unauthorize.component').then(m => m.UnauthorizeComponent)
  },
  {
    path: 'authorized',
    loadComponent: () => import('@common/components/result/authorized.component').then(m => m.AuthorizedComponent)
  },
  {
    path: '',
    canActivate: [appGuard],
    children: [
      ...adminRoutes,
      ...indexRoutes,
      ...filebrowserRoutes,
      ...auditRoutes,
      ...environment.extend,
      { path: '', redirectTo: 'admin', pathMatch: 'full' }
    ]
  }
];
