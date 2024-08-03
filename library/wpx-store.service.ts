import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';

import { set, get, del, clear } from 'idb-keyval';

@Injectable({
  providedIn: 'root'
})
export class WpxStoreService {
  set<T>(key: string, value: T): Observable<void> {
    return from(set(key, value));
  }

  get<T>(key: string): Observable<T | undefined> {
    return from(get<T>(key));
  }

  remove(key: string): Observable<void> {
    return from(del(key));
  }

  clear(): Observable<void> {
    return from(clear());
  }
}
