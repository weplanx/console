import { Injectable } from '@angular/core';
import { Observable, switchMap, timer } from 'rxjs';
import { map } from 'rxjs/operators';

import { User } from '@common/models/user';
import { Any, WpxApi } from '@weplanx/ng';

@Injectable({ providedIn: 'root' })
export class UsersService extends WpxApi<User> {
  protected override collection = 'users';

  existsEmail(email: string): Observable<Any> {
    return timer(500).pipe(
      switchMap(() => this.exists({ email })),
      map(v => (v ? { error: true, duplicated: v } : null))
    );
  }
}
