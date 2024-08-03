import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { R } from '@weplanx/ng';

@Injectable()
export class SessionsService {
  constructor(private http: HttpClient) {}

  get(): Observable<string[]> {
    return this.http.get<string[]>(`sessions`);
  }

  delete(id: string): Observable<R> {
    return this.http.delete(`sessions/${id}`);
  }

  clear(): Observable<R> {
    return this.http.post(`sessions/clear`, {});
  }
}
