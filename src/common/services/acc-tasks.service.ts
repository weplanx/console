import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { AccTask, InvokeResult } from '@common/models/acc-task';
import { WpxApi } from '@weplanx/ng';

@Injectable({ providedIn: 'root' })
export class AccTasksService extends WpxApi<AccTask> {
  protected override collection = 'acc_tasks';

  invoke(): Observable<InvokeResult> {
    return this.http.post<InvokeResult>(`acc_tasks/invoke`, {});
  }
}
