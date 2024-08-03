import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Endpoint, ScheduleState } from '@common/models/endpoint';
import { Any, WpxApi } from '@weplanx/ng';

@Injectable({ providedIn: 'root' })
export class EndpointsService extends WpxApi<Endpoint> {
  protected override collection = 'endpoints';

  scheduleKeys(id: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.collection}/${id}/schedule_keys`);
  }

  schedulePing(nodes: string[]): Observable<Any> {
    return this.http.post(`${this.collection}/schedule_ping`, { nodes });
  }

  scheduleRevoke(id: string, key: string): Observable<void> {
    return this.http.post<void>(`${this.collection}/schedule_revoke`, { id, key });
  }

  scheduleState(node: string, key: string): Observable<ScheduleState> {
    return this.http.post<ScheduleState>(`${this.collection}/schedule_state`, { node, key });
  }
}
