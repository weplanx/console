import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AppService } from '@app';

export const appGuard: CanActivateFn = (): Observable<boolean> => {
  const router = inject(Router);
  const app = inject(AppService);
  return app.verify().pipe(
    map(response => {
      if (!response.ok) {
        app.activeUser.set(null);
        app.stopRefreshToken();
        router.navigateByUrl('/login');
      }
      app.getUser().subscribe(() => {
        app.autoRefreshToken();
      });
      return true;
    })
  );
};
