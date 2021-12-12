import { registerLocaleData } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import zh from '@angular/common/locales/zh';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { ServiceWorkerModule } from '@angular/service-worker';

import { AppGuard } from '@common/app.guard';
import { AppInterceptors } from '@common/app.interceptors';
import { environment } from '@env';
import { AppShareModule } from '@share';
import { NZ_CONFIG, NzConfig } from 'ng-zorro-antd/core/config';
import { NZ_I18N, zh_CN } from 'ng-zorro-antd/i18n';

import { AppComponent } from './app.component';

registerLocaleData(zh);

const routes: Routes = [
  {
    path: 'pages',
    loadChildren: () => import('./app-routing.module').then(m => m.AppRoutingModule),
    canActivate: [AppGuard]
  },
  {
    path: 'center',
    loadChildren: () => import('./center/center.module').then(m => m.CenterModule)
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule),
    data: {
      breadcrumb: '管理者工具'
    }
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then(m => m.LoginModule)
  }
];

const ngZorroConfig: NzConfig = {
  notification: { nzPlacement: 'bottomLeft' },
  pageHeader: { nzGhost: false },
  card: { nzBorderless: true },
  table: { nzSize: 'middle' },
  codeEditor: { assetsRoot: `${environment.cdn}/assets` }
};

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppShareModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      registrationStrategy: 'registerWhenStable:30000'
    }),
    RouterModule.forRoot(routes, { useHash: true })
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AppInterceptors, multi: true },
    { provide: NZ_I18N, useValue: zh_CN },
    { provide: NZ_CONFIG, useValue: ngZorroConfig }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
