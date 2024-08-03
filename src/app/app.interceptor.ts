import { HttpEvent, HttpEventType, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, Observable, tap, throwError } from 'rxjs';

import { environment } from '@env';
import { NzMessageService } from 'ng-zorro-antd/message';

export function appInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  const router = inject(Router);
  const message = inject(NzMessageService);
  const regex = new RegExp('^http(|s)://');
  let option = {
    url: req.url,
    withCredentials: false
  };
  if (!regex.test(req.url)) {
    option = {
      url: `${environment.baseUrl}/${req.url}`,
      withCredentials: true
    };
  }
  const request = req.clone({
    ...req,
    ...option
  });
  return next(request).pipe(
    tap(event => {
      if (event.type === HttpEventType.Response) {
        // TODO: RBAC Code...
      }
    }),
    catchError(e => {
      switch (e.status) {
        case 400:
          switch (e.error.code) {
            case 'AUTH_INCORRECT':
              message.error(`Your login failed, please confirm whether the account password is correct`);
              break;
            case 'AUTH_MANY_INCORRECT':
              message.error(`You have failed to log in too many times, please try again later`);
              break;
            default:
              message.error(`Failed [${e.error.code}] ${e.error.message}`);
          }
          break;
        case 401:
          message.error(`Authentication has expired, please log in again`);
          router.navigateByUrl('/login');
          break;
        case 403:
          message.error(`Access is disabled, please contact the administrator`);
          break;
        case 500:
        case 503:
          message.error(`The server is running abnormally`);
          break;
      }
      return throwError(() => e);
    })
  );
}
