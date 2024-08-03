import { Routes } from '@angular/router';

export const loginRoutes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./login.component').then(m => m.LoginComponent),
    children: [
      {
        path: 'basic',
        loadComponent: () => import('./basic/basic.component').then(m => m.BasicComponent)
      },
      {
        path: 'totp',
        loadComponent: () => import('./totp/totp.component').then(m => m.TotpComponent)
      },
      {
        path: 'sms',
        loadComponent: () => import('./sms/sms.component').then(m => m.SmsComponent)
      },
      { path: '', redirectTo: 'basic', pathMatch: 'full' }
    ]
  }
];
