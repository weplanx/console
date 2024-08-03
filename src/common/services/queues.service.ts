import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Queue, QueueInfo } from '@common/models/queue';
import { Any, WpxApi } from '@weplanx/ng';

@Injectable({ providedIn: 'root' })
export class QueuesService extends WpxApi<Queue> {
  protected override collection = 'queues';

  sync(id: string): Observable<void> {
    return this.http.post<void>(`${this.collection}/sync`, { id });
  }

  info(id: string): Observable<QueueInfo> {
    return this.http.get<QueueInfo>(`${this.collection}/${id}/info`);
  }

  publish(project: string, subject: string, payload: Any): Observable<Any> {
    return this.http.post(`${this.collection}/publish`, { project, subject, payload });
  }
}
