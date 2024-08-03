import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Workflow } from '@common/models/workflow';
import { WpxApi } from '@weplanx/ng';

@Injectable({ providedIn: 'root' })
export class WorkflowsService extends WpxApi<Workflow> {
  protected override collection = 'workflows';

  sync(id: string): Observable<void> {
    return this.http.post<void>(`${this.collection}/sync`, { id });
  }
}
