import { registerLocaleData } from '@angular/common';
import { provideHttpClient, withFetch, withInterceptors, withXsrfConfiguration } from '@angular/common/http';
import en from '@angular/common/locales/en';
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';

import { ShareModule } from '@common/share.module';
import { environment } from '@env';
import { provideNzConfig } from 'ng-zorro-antd/core/config';
import { en_US, provideNzI18n } from 'ng-zorro-antd/i18n';

import { appInterceptor } from './app.interceptor';
import { routes } from './app.routes';

registerLocaleData(en);

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(ShareModule),
    provideNzConfig({
      notification: { nzPlacement: 'bottomRight' },
      card: { nzBordered: false },
      table: { nzSize: 'middle' },
      codeEditor: {
        assetsRoot: `${environment.cdn}/npm/monaco-editor@0.40.0/min`
      }
    }),
    provideHttpClient(
      withFetch(),
      withInterceptors([appInterceptor]),
      withXsrfConfiguration({
        cookieName: 'XSRF-TOKEN',
        headerName: 'X-XSRF-TOKEN'
      })
    ),
    provideNzI18n(en_US),
    provideAnimationsAsync(),
    provideClientHydration(),
    provideRouter(routes)
  ]
};
