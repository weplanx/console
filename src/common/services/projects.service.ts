import { Injectable } from '@angular/core';
import { Observable, switchMap, timer } from 'rxjs';
import { map } from 'rxjs/operators';

import { Project, TenantsResult } from '@common/models/project';
import { Any, WpxApi } from '@weplanx/ng';

@Injectable({ providedIn: 'root' })
export class ProjectsService extends WpxApi<Project> {
  protected override collection = 'projects';

  existsNamespace(namespace: string): Observable<Any> {
    return timer(500).pipe(
      switchMap(() => this.exists({ namespace })),
      map(v => (v ? { error: true, duplicated: v } : null))
    );
  }

  getTenants(id: string): Observable<TenantsResult> {
    return this.http.get<TenantsResult>(`${this.collection}/${id}/tenants`);
  }

  deployNats(id: string): Observable<void> {
    return this.http.post<void>(`${this.collection}/deploy_nats`, { id });
  }
}
